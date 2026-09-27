import importlib
import json
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest


def load_module(tmp_path, monkeypatch):
    monkeypatch.setenv("JOURNEY_DATA_DIR", str(tmp_path / ".data"))
    sys.modules.pop("apps.api.main", None)
    module = importlib.import_module("apps.api.main")
    module.JOURNAL_ROOT = tmp_path / "journal"
    module.JOURNAL_ROOT.mkdir(parents=True, exist_ok=True)
    module.init_db()
    return module


def test_curriculum_is_seeded(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    with module.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM phases").fetchone()[0] == 8
        assert db.execute("SELECT COUNT(*) FROM lessons").fetchone()[0] == 148
        assert db.execute("SELECT COUNT(*) FROM exercises").fetchone()[0] == 37
        assert db.execute("SELECT COUNT(*) FROM review_items").fetchone()[0] == 148
        exercise = db.execute("SELECT test_command,starter_code FROM exercises LIMIT 1").fetchone()
        assert "test_exercise.py" in exercise["test_command"]
        assert "NotImplementedError" in exercise["starter_code"]


def test_curriculum_sync_adds_new_records_without_resetting_progress(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    lesson_slug = "phase-00-onboarding-environment-1"
    module.update_progress(lesson_slug, module.ProgressUpdate(status="completed", minutes_spent=42))
    module.create_note(module.NoteCreate(lesson_slug=lesson_slug, title="Keep this note", body="Do not lose my progress."))

    source_content = module.CONTENT_ROOT
    curriculum = json.loads((source_content / "curriculum.json").read_text(encoding="utf-8"))
    first_phase = curriculum["phases"][0]
    first_phase["modules"].append(
        {
            "slug": "startup-sync-regression",
            "title_vi": "Kiểm tra đồng bộ startup",
            "title_en": "Startup sync regression",
            "lessons": ["Additive content sync"],
        }
    )
    content_root = tmp_path / "content-update"
    content_root.mkdir()
    (content_root / "curriculum.json").write_text(json.dumps(curriculum, ensure_ascii=False), encoding="utf-8")
    for filename in ("lessons.json", "module_guides.json"):
        shutil.copy2(source_content / filename, content_root / filename)
    monkeypatch.setattr(module, "CONTENT_ROOT", content_root)

    module.seed_content()

    with module.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM phases").fetchone()[0] == 8
        assert db.execute("SELECT COUNT(*) FROM modules").fetchone()[0] == 38
        assert db.execute("SELECT COUNT(*) FROM lessons").fetchone()[0] == 149
        assert db.execute("SELECT COUNT(*) FROM exercises").fetchone()[0] == 38
        assert db.execute("SELECT COUNT(*) FROM review_items").fetchone()[0] == 149
        progress = db.execute("SELECT status,minutes_spent FROM progress WHERE lesson_id=(SELECT id FROM lessons WHERE slug=?)", (lesson_slug,)).fetchone()
        assert progress["status"] == "completed"
        assert progress["minutes_spent"] == 42
        assert db.execute("SELECT COUNT(*) FROM notes WHERE lesson_id=(SELECT id FROM lessons WHERE slug=?)", (lesson_slug,)).fetchone()[0] == 1

    new_lesson = module.lesson_detail("phase-00-onboarding-startup-sync-regression-1")
    assert new_lesson["title_vi"] == "Additive content sync"


def test_lesson_schema_and_settings(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    lesson = module.lesson_detail("phase-00-onboarding-environment-1")
    required = {
        "lesson_id", "phase_id", "module_id", "title_vi", "title_en", "summary_vi", "summary_en",
        "learning_objectives", "prerequisites", "keywords", "concept_notes_vi", "concept_notes_en",
        "formulas", "code_examples", "resources", "exercise_ids", "review_item_ids",
        "estimated_minutes", "completion_checklist", "common_mistakes", "next_lessons",
        "why_it_matters_vi", "why_it_matters_en", "study_steps_vi", "study_steps_en",
        "practice_plan", "interview_questions", "guide",
    }
    assert required.issubset(lesson)
    assert lesson["code_examples"]
    assert lesson["resources"]
    assert len(lesson["study_steps_vi"]) >= 4
    assert lesson["practice_plan"]["vi"]["task"]
    assert len(lesson["interview_questions"]["vi"]) >= 3
    assert any(resource.get("url", "").startswith("http") for resource in lesson["resources"])
    assert any(resource.get("kind") == "in_app" for resource in lesson["resources"])
    assert module.get_settings()["track"] == "standard"
    assert module.get_settings()["target_role"] == "internship"
    updated = module.update_settings(module.SettingsUpdate(track="accelerated", weekly_goal_minutes=900, target_role="junior", experience_level="intermediate", onboarding_complete=True))
    assert updated["track"] == "accelerated"
    assert updated["weekly_goal_minutes"] == 900
    assert updated["target_role"] == "junior"
    assert updated["onboarding_complete"] is True


def test_git_commands_hide_windows(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    calls = []

    def fake_run(*args, **kwargs):
        calls.append(kwargs)
        return module.subprocess.CompletedProcess(args, 0, stdout="", stderr="")

    monkeypatch.setattr(module.subprocess, "run", fake_run)
    module.git_status()
    module.git_diff()

    expected_flag = getattr(module.subprocess, "CREATE_NO_WINDOW", 0)
    assert calls
    assert all(call.get("creationflags", 0) == expected_flag for call in calls)
    assert all(call.get("encoding") == "utf-8" and call.get("errors") == "replace" for call in calls)


def test_progress_and_review_flow(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    slug = "phase-00-onboarding-environment-1"
    result = module.update_progress(slug, module.ProgressUpdate(status="completed", minutes_spent=30))
    assert result["status"] == "completed"
    assert module.create_session(module.SessionCreate(lesson_slug=slug, minutes=45, note="review gradients"))["status"] == "recorded"
    dashboard = module.dashboard()
    assert dashboard["completed_lessons"] == 1
    assert dashboard["weekly_minutes"] == 75
    assert dashboard["streak_days"] >= 1
    with module.connect() as db:
        review_id = db.execute("SELECT id FROM review_items WHERE lesson_id=(SELECT id FROM lessons WHERE slug=?)", (slug,)).fetchone()[0]
    next_review = module.answer_review(review_id, module.ReviewAnswer(rating="good", thought_seconds=22, answer_text="A short explanation."))
    assert next_review["interval_days"] >= 1
    assert module.review_history()["count"] == 1
    assert module.weak_topics()["items"]
    module.init_db()
    assert module.dashboard()["completed_lessons"] == 1
    assert module.review_history()["count"] == 1


def test_study_streak_uses_local_calendar_days(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    vietnam_timezone = timezone(timedelta(hours=7))
    monkeypatch.setattr(module, "local_timezone", lambda: vietnam_timezone)
    local_yesterday = datetime.now(vietnam_timezone).replace(hour=0, minute=30, second=0, microsecond=0) - timedelta(days=1)
    stored_utc_timestamp = local_yesterday.astimezone(timezone.utc).isoformat()
    with module.connect() as db:
        db.execute(
            "INSERT INTO study_sessions(lesson_id,minutes,note,created_at) VALUES(NULL,?,?,?)",
            (25, "local midnight boundary", stored_utc_timestamp),
        )

    assert module.local_day_for_iso(stored_utc_timestamp, vietnam_timezone) == local_yesterday.date()
    with module.connect() as db:
        assert module.study_streak(db) == 1


def test_workspace_creation_and_runner(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    exercise = module.exercises()["exercises"][0]
    workspace = module.create_workspace(exercise["slug"])
    workspace_id = workspace["workspace"]["id"]
    workspace_path = tmp_path / ".data" / "workspaces" / exercise["slug"]
    assert (workspace_path / "starter.py").exists()
    assert (workspace_path / "test_exercise.py").exists()
    first_run = module.run_workspace(workspace_id)
    assert first_run["status"] == "failed"
    (workspace_path / "starter.py").write_text(
        "def solve():\n    return {'result': 'ok', 'explanation': 'verified'}\n",
        encoding="utf-8",
    )
    result = module.run_workspace(workspace_id)
    assert result["status"] == "passed"
    shutil.rmtree(workspace_path)
    repaired_run = module.run_workspace(workspace_id)
    assert repaired_run["status"] == "failed"
    (workspace_path / "README.md").unlink()
    repaired = module.create_workspace(exercise["slug"])
    assert repaired["created"] is False
    assert repaired["repaired"] is True
    assert (workspace_path / "README.md").exists()


def test_workspace_folder_export_and_secret_guard(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    exercise = module.exercises()["exercises"][0]
    workspace = module.create_workspace(exercise["slug"])
    workspace_id = workspace["workspace"]["id"]
    popen_calls = []

    def fake_popen(*args, **kwargs):
        popen_calls.append((args, kwargs))

    monkeypatch.setattr(module.subprocess, "Popen", fake_popen)
    opened = module.open_workspace_folder(workspace_id)
    assert opened["opened"] is True
    assert popen_calls
    assert popen_calls[0][1].get("creationflags", 0) == getattr(module.subprocess, "CREATE_NO_WINDOW", 0)

    project_root = tmp_path / "repo"
    project_root.mkdir()
    module.PROJECT_ROOT = project_root
    exported = module.export_workspace(workspace_id)
    artifact = project_root / "exercises" / exercise["slug"]
    assert exported["artifact_path"] == f"exercises/{exercise['slug']}"
    assert (artifact / "starter.py").exists()
    assert (artifact / "README.md").exists()

    workspace_path = Path(workspace["workspace"]["path"])
    (workspace_path / "starter.py").write_text('api_key = "real-looking-secret-value"\n', encoding="utf-8")
    with pytest.raises(module.HTTPException) as secret_error:
        module.export_workspace(workspace_id)
    assert secret_error.value.status_code == 422
    assert "starter.py" in str(secret_error.value.detail)


def test_publish_requires_confirmation_and_pushes_only_selected_artifact(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    project_root = tmp_path / "repo"
    artifact = project_root / "exercises" / "python-functions"
    artifact.mkdir(parents=True)
    (artifact / "starter.py").write_text("print('practice')\n", encoding="utf-8")
    module.PROJECT_ROOT = project_root

    with pytest.raises(module.HTTPException) as missing_confirmation:
        module.publish_git(module.GitPublishRequest(paths=["exercises/python-functions"], message="learn: practice", confirm=False))
    assert missing_confirmation.value.status_code == 400
    with pytest.raises(module.HTTPException) as blank_message:
        module.publish_git(module.GitPublishRequest(paths=["exercises/python-functions"], message="     ", confirm=True))
    assert blank_message.value.status_code == 400

    calls = []

    def fake_git(args, timeout=15):
        calls.append(args)
        if args == ["rev-parse", "--show-toplevel"]:
            return module.subprocess.CompletedProcess(args, 0, stdout=str(project_root), stderr="")
        if args == ["diff", "--cached", "--name-only"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="", stderr="")
        if args[:2] == ["add", "--"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="", stderr="")
        if args == ["diff", "--cached", "--binary"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="diff --git a/exercises/python-functions/starter.py b/exercises/python-functions/starter.py", stderr="")
        if args[:2] == ["commit", "-m"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="[main abc1234] learn: practice", stderr="")
        if args == ["branch", "--show-current"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="main", stderr="")
        if args == ["remote", "get-url", "origin"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="https://github.com/Hzyl/JouneyAIEngineer.git", stderr="")
        if args == ["rev-parse", "--short", "HEAD"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="abc1234", stderr="")
        if args == ["push", "origin", "main"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="", stderr="")
        if args[:2] == ["reset", "--"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="", stderr="")
        if args == ["diff", "--cached", "--name-only"]:
            return module.subprocess.CompletedProcess(args, 0, stdout="exercises/python-functions/starter.py\n", stderr="")
        raise AssertionError(args)

    # The first cached-name call is empty; the second one is the post-add verification.
    cached_calls = 0

    def fake_git_with_stage(args, timeout=15):
        nonlocal cached_calls
        if args == ["diff", "--cached", "--name-only"]:
            cached_calls += 1
            output = "" if cached_calls == 1 else "exercises/python-functions/starter.py\n"
            calls.append(args)
            return module.subprocess.CompletedProcess(args, 0, stdout=output, stderr="")
        return fake_git(args, timeout)

    monkeypatch.setattr(module, "run_git", fake_git_with_stage)
    result = module.publish_git(module.GitPublishRequest(paths=["exercises/python-functions"], message="learn: practice", confirm=True))
    assert result["pushed"] is True
    assert result["branch"] == "main"
    assert result["files"] == ["exercises/python-functions/starter.py"]
    assert ["push", "origin", "main"] in calls


def test_journal_and_context_exports(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    module.create_note(module.NoteCreate(lesson_slug="phase-00-onboarding-environment-1", title="Insight", body="Tôi cần hiểu rõ environment."))
    module.update_progress("phase-00-onboarding-environment-1", module.ProgressUpdate(status="in_progress", minutes_spent=20))
    journal = module.export_journal()
    journal_path = Path(journal["path"])
    journal_path.write_text(journal_path.read_text(encoding="utf-8") + "\nMy manual reflection.\n", encoding="utf-8")
    refreshed_journal = module.export_journal()
    assert refreshed_journal["preserved_reflections"] is True
    assert "My manual reflection." in journal_path.read_text(encoding="utf-8")
    context = module.export_context(module.ContextRequest(lesson_slug="phase-00-onboarding-environment-1", question="Giải thích gradient descent từng bước."))
    assert journal["path"].endswith(".md")
    assert context["path"].endswith("-context.md")
    assert "gradient descent" in context["content"]
    assert "in_progress" in context["content"]
    assert "environment" in context["content"]
    second_context = module.export_context(module.ContextRequest(lesson_slug="phase-00-onboarding-environment-1", question="Một câu hỏi khác."))
    assert second_context["path"] != context["path"]
    assert Path(context["path"]).exists()
    assert Path(second_context["path"]).exists()
    with pytest.raises(module.HTTPException) as missing_lesson:
        module.export_context(module.ContextRequest(lesson_slug="missing-lesson", question="test"))
    assert missing_lesson.value.status_code == 404
    with pytest.raises(module.HTTPException) as missing_exercise:
        module.export_context(module.ContextRequest(exercise_slug="missing-exercise", question="test"))
    assert missing_exercise.value.status_code == 404
    assert "***REDACTED***" in module.redact_secrets("api_key=do-not-export")
    assert "do-not-export" not in module.redact_secrets("Authorization: Bearer do-not-export")
