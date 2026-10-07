from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from uuid import uuid4

import pytest
from fastapi import HTTPException

from test_review_activation import FIRST, app  # noqa: F401


def test_progress_retry_and_conflicting_payload(app):
    request_id = uuid4()
    payload = app.ProgressUpdate(status="completed", minutes_spent=25, request_id=request_id)
    first = app.update_progress(FIRST, payload)
    assert app.update_progress(FIRST, payload) == first
    with app.connect() as db:
        assert db.execute("SELECT SUM(minutes_spent) FROM progress").fetchone()[0] == 25
        assert db.execute("SELECT COUNT(*) FROM study_sessions").fetchone()[0] == 1
    with pytest.raises(HTTPException) as error:
        app.update_progress(FIRST, payload.model_copy(update={"minutes_spent": 30}))
    assert error.value.status_code == 409


def test_session_retry_and_failed_write_do_not_poison_receipt(app):
    request_id = uuid4()
    payload = app.SessionCreate(lesson_slug="unknown", minutes=15, request_id=request_id)
    with pytest.raises(HTTPException):
        app.create_session(payload)
    valid = payload.model_copy(update={"lesson_slug": FIRST})
    assert app.create_session(valid) == app.create_session(valid)
    with app.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM study_sessions").fetchone()[0] == 1
        assert db.execute("SELECT COUNT(*) FROM learning_mutations").fetchone()[0] == 1


@pytest.mark.parametrize("same_request,expected", [(False, 2), (True, 1)])
def test_concurrent_review_writes(app, same_request, expected):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed"))
    card_id = app.lesson_detail(FIRST)["reviews"][0]["id"]
    request_id = uuid4()
    barrier = Barrier(2)

    def answer(index):
        payload = app.ReviewAnswer(
            rating="good", request_id=request_id if same_request else uuid4(),
        )
        barrier.wait(timeout=5)
        return app.answer_review(card_id, payload)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(answer, range(2)))
    assert app.review_history()["count"] == expected
    with app.connect() as db:
        state = db.execute("SELECT repetitions FROM review_state WHERE card_id=?", (card_id,)).fetchone()
        assert state[0] == expected
    if same_request:
        assert results[0] == results[1]
