"""Two weekly aggregates over the same in-memory learning log."""
from datetime import date, timedelta
import sqlite3


def create_log() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript("""
        CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
        CREATE TABLE sessions (
            id INTEGER PRIMARY KEY,
            learner_id INTEGER NOT NULL REFERENCES learners(id),
            studied_on TEXT NOT NULL,
            minutes INTEGER NOT NULL CHECK (minutes BETWEEN 1 AND 1440)
        );
        CREATE INDEX sessions_week ON sessions(studied_on, learner_id);
    """)
    return db


def week_bounds(monday: str) -> tuple[str, str]:
    start = date.fromisoformat(monday)
    if start.isoformat() != monday or start.weekday() != 0:
        raise ValueError("Expected an ISO Monday: YYYY-MM-DD")
    return monday, (start + timedelta(days=7)).isoformat()


def weekly_join(db: sqlite3.Connection, monday: str) -> list[tuple]:
    start, end = week_bounds(monday)
    return db.execute("""
        SELECT l.id, l.name, COALESCE(SUM(s.minutes), 0)
        FROM learners AS l
        LEFT JOIN sessions AS s ON s.learner_id = l.id
            AND s.studied_on >= ? AND s.studied_on < ?
        GROUP BY l.id, l.name
        ORDER BY l.id
    """, (start, end)).fetchall()


def weekly_lookup(db: sqlite3.Connection, monday: str) -> list[tuple]:
    start, end = week_bounds(monday)
    totals = dict(db.execute("""
        SELECT learner_id, SUM(minutes) FROM sessions
        WHERE studied_on >= ? AND studied_on < ?
        GROUP BY learner_id
    """, (start, end)))
    learners = db.execute("SELECT id, name FROM learners ORDER BY id")
    return [(identity, name, totals.get(identity, 0)) for identity, name in learners]


def seed(db: sqlite3.Connection) -> None:
    db.executemany("INSERT INTO learners VALUES (?, ?)", [(1, "An"), (2, "Binh"), (3, "Chi")])
    db.executemany("INSERT INTO sessions VALUES (?, ?, ?, ?)", [
        (1, 1, "2026-10-05", 20), (2, 1, "2026-10-11", 25),
        (3, 2, "2026-10-06", 30), (4, 1, "2026-10-12", 100),
    ])
    db.commit()


if __name__ == "__main__":
    connection = create_log()
    try:
        seed(connection)
        print("JOIN:", weekly_join(connection, "2026-10-05"))
        print("Lookup:", weekly_lookup(connection, "2026-10-05"))
    finally:
        connection.close()
