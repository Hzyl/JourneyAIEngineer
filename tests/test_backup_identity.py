from test_review_activation import FIRST, app  # noqa: F401


def test_backup_remaps_stable_card_keys_and_previews_conflicts(app):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed", minutes_spent=25))
    card = app.lesson_detail(FIRST)["reviews"][0]
    app.answer_review(card["id"], app.ReviewAnswer(rating="good"))
    backup = app._build_backup_payload()
    assert len(backup["catalog"]["content_sha256"]) == 64
    for row in backup["review_state"]:
        row["id"] += 10000
    for row in backup["review_history"]:
        row["review_id"] += 10000
    backup["catalog"]["content_sha256"] = "older-content"
    preview = app.preview_backup(app.BackupImportRequest(payload=backup))
    assert preview["valid"] is True
    assert preview["replaces"]["progress"] == 1
    assert preview["warnings"]
    app.import_backup(app.BackupImportRequest(payload=backup, confirm=True))
    assert app.review_history()["count"] == 1
    with app.connect() as db:
        assert db.execute("SELECT repetitions FROM review_state WHERE card_id=?", (card["id"],)).fetchone()[0] == 1


def test_unknown_or_duplicate_identity_is_rejected_before_import(app):
    backup = app._build_backup_payload()
    backup["review_state"][0]["card_key"] = "unknown-card"
    assert not app.preview_backup(app.BackupImportRequest(payload=backup))["valid"]
    backup = app._build_backup_payload()
    backup["review_state"].append(backup["review_state"][0].copy())
    assert not app.preview_backup(app.BackupImportRequest(payload=backup))["valid"]
