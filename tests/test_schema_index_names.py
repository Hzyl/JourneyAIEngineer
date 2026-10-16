"""Schema inspection must treat SQLite index names as data."""
from test_api import load_module


def test_quoted_index_name_survives_restart_without_losing_learning_state(tmp_path, monkeypatch):
    app = load_module(tmp_path, monkeypatch)
    slug = "phase-00-onboarding-environment-1"
    app.update_progress(slug, app.ProgressUpdate(status="completed", minutes_spent=37))
    app.create_note(app.NoteCreate(lesson_slug=slug, title="Keep this note", body="Saved learner work"))
    with app.connect() as database:
        database.execute("""CREATE UNIQUE INDEX "review's unique id" ON review_cards(id)""")
        card_id = database.execute("SELECT id FROM review_cards ORDER BY id LIMIT 1").fetchone()[0]
        database.execute("UPDATE review_state SET repetitions=4, interval_days=12 WHERE card_id=?", (card_id,))
        cards = [tuple(row) for row in database.execute("SELECT * FROM review_cards ORDER BY id")]
        states = [tuple(row) for row in database.execute("SELECT * FROM review_state ORDER BY card_id")]

    app.init_db()

    with app.connect() as database:
        assert [tuple(row) for row in database.execute("SELECT * FROM review_cards ORDER BY id")] == cards
        assert [tuple(row) for row in database.execute("SELECT * FROM review_state ORDER BY card_id")] == states
        assert database.execute("SELECT COUNT(*) FROM notes WHERE title=?", ("Keep this note",)).fetchone()[0] == 1
        progress = database.execute("SELECT status, minutes_spent FROM progress").fetchone()
        assert tuple(progress) == ("completed", 37)
        assert database.execute("PRAGMA user_version").fetchone()[0] == app.SCHEMA_VERSION
        assert database.execute(
            "SELECT name FROM sqlite_master WHERE type='index' AND name=?", ("review's unique id",)
        ).fetchone()
