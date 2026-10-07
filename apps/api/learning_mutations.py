"""Atomic retry receipts for local learning writes; no learner text in receipts."""
import hashlib
import json
import sqlite3

from fastapi import HTTPException


def ensure_mutations(db: sqlite3.Connection) -> None:
    db.execute("""CREATE TABLE IF NOT EXISTS learning_mutations (
        request_id TEXT PRIMARY KEY,
        fingerprint TEXT NOT NULL,
        response_json TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )""")


def begin_mutation(db: sqlite3.Connection, request_id, operation: str, payload: dict):
    # Take the write reservation before reading scheduling state or receipts.
    db.execute("BEGIN IMMEDIATE")
    canonical = json.dumps([operation, payload], sort_keys=True, ensure_ascii=False)
    fingerprint = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    if request_id:
        row = db.execute(
            "SELECT fingerprint,response_json FROM learning_mutations WHERE request_id=?",
            (str(request_id),),
        ).fetchone()
        if row:
            if row["fingerprint"] != fingerprint:
                raise HTTPException(409, "Request ID already used for different content")
            return fingerprint, json.loads(row["response_json"])
    return fingerprint, None


def finish_mutation(db: sqlite3.Connection, request_id, fingerprint: str, response: dict) -> dict:
    if request_id:
        db.execute(
            "INSERT INTO learning_mutations(request_id,fingerprint,response_json) VALUES(?,?,?)",
            (str(request_id), fingerprint, json.dumps(response)),
        )
    return response
