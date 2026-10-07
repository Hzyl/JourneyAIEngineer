"""Learning-aware review selection without rewriting existing schedules."""

import sqlite3


NEW_CARD_LIMIT = 8
QUEUE_LIMIT = 30

JOINS = """
    FROM review_cards c
    JOIN review_state s ON s.card_id=c.id
    JOIN lessons l ON l.id=c.lesson_id
    JOIN modules m ON m.id=l.module_id
    JOIN phases p ON p.id=m.phase_id
    LEFT JOIN progress pr ON pr.lesson_id=l.id
"""
ELIGIBLE = "s.suspended=0 AND (pr.status='completed' OR s.last_reviewed_at IS NOT NULL)"
FIELDS = """
    c.*, s.due_at, s.interval_days, s.repetitions, s.ease_factor,
    s.lapses, s.leech, s.suspended, s.last_reviewed_at,
    l.slug AS lesson_slug, l.title_vi AS lesson_title_vi,
    l.title_en AS lesson_title_en, p.title_vi AS phase_title_vi,
    (SELECT e.slug FROM exercises e WHERE e.module_id=m.id ORDER BY e.id LIMIT 1) AS related_exercise
"""


def review_counts(db: sqlite3.Connection, now: str) -> dict[str, int]:
    row = db.execute(
        f"""SELECT
            COALESCE(SUM(s.last_reviewed_at IS NOT NULL AND s.due_at <= ?), 0) AS due_count,
            COALESCE(SUM(s.last_reviewed_at IS NULL), 0) AS new_count
            {JOINS} WHERE {ELIGIBLE}""",
        (now,),
    ).fetchone()
    return {"due_count": row["due_count"], "new_count": row["new_count"]}


def learning_review_queue(db: sqlite3.Connection, now: str) -> dict:
    due = db.execute(
        f"""SELECT {FIELDS}, 'due' AS queue_status {JOINS}
            WHERE {ELIGIBLE} AND s.last_reviewed_at IS NOT NULL AND s.due_at <= ?
            ORDER BY s.due_at, c.id LIMIT ?""",
        (now, QUEUE_LIMIT),
    ).fetchall()
    new_limit = min(NEW_CARD_LIMIT, QUEUE_LIMIT - len(due))
    new = db.execute(
        f"""SELECT {FIELDS}, 'new' AS queue_status {JOINS}
            WHERE {ELIGIBLE} AND s.last_reviewed_at IS NULL
            ORDER BY p.order_index, m.order_index, l.order_index, c.id LIMIT ?""",
        (new_limit,),
    ).fetchall()
    counts = review_counts(db, now)
    items = [dict(row) for row in [*due, *new]]
    return {
        "items": items,
        "count": len(items),
        **counts,
        "total_count": counts["due_count"] + counts["new_count"],
    }
