import importlib
import sys

import pytest
from fastapi import HTTPException


@pytest.fixture
def app(tmp_path, monkeypatch):
    monkeypatch.setenv("JOURNEY_DATA_DIR", str(tmp_path / "data"))
    monkeypatch.setenv("JOURNEY_JOURNAL_DIR", str(tmp_path / "journal"))
    sys.modules.pop("apps.api.main", None)
    module = importlib.import_module("apps.api.main")
    module.init_db()
    return module


FIRST = "phase-00-onboarding-environment-1"
SECOND = "phase-00-onboarding-environment-2"


def test_fresh_learner_has_no_review_debt(app):
    assert app.dashboard()["due_reviews"] == 0
    assert app.dashboard()["new_reviews"] == 0
    assert app.due_reviews()["items"] == []


def test_completion_activates_only_its_cards(app):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed"))
    queue = app.due_reviews()
    assert queue["due_count"] == 0
    assert queue["new_count"] == 4
    assert {row["lesson_slug"] for row in queue["items"]} == {FIRST}
    assert all(row["queue_status"] == "new" for row in queue["items"])
    assert app.dashboard()["new_reviews"] == 4


def test_cannot_answer_unlearned_card_directly(app):
    card = app.lesson_detail(SECOND)["reviews"][0]
    with pytest.raises(HTTPException) as error:
        app.answer_review(card["id"], app.ReviewAnswer(rating="good"))
    assert error.value.status_code == 409
    assert app.review_history()["count"] == 0


def test_due_order_and_schedule_survive_content_sync_and_progress_reset(app):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed"))
    app.update_progress(SECOND, app.ProgressUpdate(status="completed"))
    card = app.lesson_detail(SECOND)["reviews"][0]
    result = app.answer_review(card["id"], app.ReviewAnswer(rating="good"))
    assert app.dashboard()["due_reviews"] == 0
    with app.connect() as db:
        db.execute("UPDATE review_state SET due_at=? WHERE card_id=?", ("2020-01-01", card["id"]))
        db.execute("UPDATE review_items SET due_at=? WHERE id=?", ("2020-01-01", card["id"]))
    app.update_progress(SECOND, app.ProgressUpdate(status="not_started"))
    app.init_db()
    queue = app.due_reviews()
    assert queue["due_count"] == 1
    assert queue["new_count"] == 4
    assert queue["items"][0]["id"] == card["id"]
    assert queue["items"][0]["queue_status"] == "due"
    assert queue["items"][0]["repetitions"] == result["repetitions"]
    assert app.review_history()["count"] == 1
    with app.connect() as db:
        db.execute("UPDATE review_state SET suspended=1 WHERE card_id=?", (card["id"],))
    assert app.dashboard()["due_reviews"] == 0
