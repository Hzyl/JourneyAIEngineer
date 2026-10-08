from copy import deepcopy

import pytest
from fastapi import HTTPException

from test_review_activation import FIRST, app  # noqa: F401


@pytest.mark.parametrize(("group", "field", "value"), [
    ("progress", "lesson_slug", []),
    ("progress", "status", {}),
    ("progress", "minutes_spent", True),
    ("progress", "minutes_spent", 2**80),
    ("progress", "completed_at", "yesterday"),
    ("review_state", "id", []),
    ("review_state", "id", True),
    ("review_state", "interval_days", False),
    ("review_state", "repetitions", -1),
    ("review_state", "ease_factor", float("inf")),
    ("review_state", "ease_factor", float("nan")),
    ("review_state", "ease_factor", -1),
    ("review_state", "lapses", None),
    ("review_state", "leech", 2),
    ("review_state", "due_at", {}),
    ("review_history", "rating", []),
    ("review_history", "thought_seconds", -1),
    ("review_history", "answer_text", {}),
    ("notes", "title", []),
    ("notes", "body", "\ud800"),
    ("notes", "lesson_slug", {}),
    ("study_sessions", "minutes", "25"),
    ("study_sessions", "created_at", "2026-02-30T00:00:00"),
    ("journal_files", "content", "\ud800"),
    ("journal_files", "path", "bad\ud800.md"),
])
def test_malformed_rows_rejected_before_any_write(app, monkeypatch, group, field, value):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed", minutes_spent=25))
    card = app.lesson_detail(FIRST)["reviews"][0]
    app.answer_review(card["id"], app.ReviewAnswer(rating="good"))
    original = app._build_backup_payload()
    backup = deepcopy(original)
    backup["notes"] = [{"title": "My note", "body": "Keep this"}]
    backup["study_sessions"] = [{"minutes": 25}]
    backup["journal_files"] = [{"path": "entry.md", "content": "Replacement"}]
    app.JOURNAL_ROOT.mkdir(parents=True, exist_ok=True)
    journal = app.JOURNAL_ROOT / "entry.md"
    journal.write_text("Original", encoding="utf-8")
    if group == "review_state":
        backup[group][0].pop("card_key", None)  # Exercise the legacy numeric-ID path.
    backup[group][0][field] = value

    def unexpected_write(*_args):
        pytest.fail("Invalid input must be rejected before writing even a safety backup")

    monkeypatch.setattr(app, "_write_backup_files", unexpected_write)
    preview = app.preview_backup(app.BackupImportRequest(payload=backup))
    assert preview["valid"] is False
    assert preview["errors"]
    assert preview["journal_conflicts"] == []
    with pytest.raises(HTTPException) as failure:
        app.import_backup(app.BackupImportRequest(payload=backup, confirm=True))
    assert failure.value.status_code == 422
    after = app._build_backup_payload()
    for key in ("progress", "review_state", "review_history", "settings", "notes", "study_sessions"):
        assert after[key] == original[key]
    assert journal.read_text(encoding="utf-8") == "Original"


@pytest.mark.parametrize(("key", "value"), [
    ("weekly_goal_minutes", "not-a-number"),
    ("weekly_goal_minutes", "59"),
    ("weekly_goal_minutes", "10081"),
    ("weekly_goal_minutes", 720),
    ("language", "xx"),
    ("track", []),
    ("show_completed_lessons", "maybe"),
    ("onboarding_complete", True),
    ("future_setting", "x" * 1001),
])
def test_invalid_settings_are_not_silently_imported(app, key, value):
    backup = app._build_backup_payload()
    backup["settings"][key] = value
    preview = app.preview_backup(app.BackupImportRequest(payload=backup))
    assert preview["valid"] is False
    assert any("settings" in error for error in preview["errors"])


def test_schema_version_requires_an_integer(app):
    backup = app._build_backup_payload()
    backup["schema_version"] = True
    assert not app.preview_backup(app.BackupImportRequest(payload=backup))["valid"]


def test_legacy_defaults_and_unknown_string_settings_round_trip(app):
    backup = app._build_backup_payload()
    backup.pop("catalog")
    for row in backup["review_state"]:
        row.pop("card_key")
        for field in ("lapses", "leech", "suspended", "last_reviewed_at"):
            row.pop(field)
    backup["settings"] = {"weekly_goal_minutes": "600", "future_setting": "preserved"}
    backup["notes"] = [{"title": "Ghi chú", "body": "Nội dung\nUnicode ✓"}]
    backup["study_sessions"] = [{"minutes": 25, "created_at": "2026-10-07T12:30:00"}]
    preview = app.preview_backup(app.BackupImportRequest(payload=backup))
    assert preview["valid"] is True
    assert preview["warnings"]
    app.import_backup(app.BackupImportRequest(payload=backup, confirm=True))
    restored = app._build_backup_payload()
    assert restored["settings"]["future_setting"] == "preserved"
    assert app.get_settings()["weekly_goal_minutes"] == 600
    assert restored["notes"][0]["body"] == backup["notes"][0]["body"]
    assert restored["study_sessions"][0]["minutes"] == 25
