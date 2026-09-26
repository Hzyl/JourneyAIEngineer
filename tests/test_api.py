import importlib
import shutil
import sys
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


def test_lesson_schema_and_settings(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    lesson = module.lesson_detail("phase-00-onboarding-environment-1")
    required = {
        "lesson_id", "phase_id", "module_id", "title_vi", "title_en", "summary_vi", "summary_en",
        "learning_objectives", "prerequisites", "keywords", "concept_notes_vi", "concept_notes_en",
        "formulas", "code_examples", "resources", "exercise_ids", "review_item_ids",
        "estimated_minutes", "completion_checklist", "common_mistakes", "next_lessons",
    }
    assert required.issubset(lesson)
    assert lesson["code_examples"]
    assert lesson["resources"]
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


def test_workspace_creation_and_runner(tmp_path, monkeypatch):
    module = load_module(tmp_path, monkeypatch)
    exercise = module.exercises()["exercises"][0]
    workspace = module.create_workspace(exercise["slug"])
    workspace_id = workspace["workspace"]["id"]
    result = module.run_workspace(workspace_id)
    assert result["status"] == "passed"
    workspace_path = tmp_path / ".data" / "workspaces" / exercise["slug"]
    assert (workspace_path / "starter.py").exists()
    shutil.rmtree(workspace_path)
    repaired_run = module.run_workspace(workspace_id)
    assert repaired_run["status"] == "passed"
    (workspace_path / "README.md").unlink()
    repaired = module.create_workspace(exercise["slug"])
    assert repaired["created"] is False
    assert repaired["repaired"] is True
    assert (workspace_path / "README.md").exists()


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
