"""Durable undo records couple journal replacement to the learning transaction.

All callers hold the OS restore lock across recovery, the safety snapshot and
import. Prepared undo records survive process exit; a committed marker shares
the transaction that replaces learning rows. No private journal data is logged.
"""
from contextlib import closing, contextmanager
from pathlib import Path
import sqlite3

from apps.api import backup_journal
from apps.api.backup_lock import backup_lock


class BackupRecoveryError(OSError):
    pass


def _ensure_ledger(db: sqlite3.Connection) -> None:
    db.executescript("""
        CREATE TABLE IF NOT EXISTS backup_restore_state (
            singleton INTEGER PRIMARY KEY CHECK(singleton = 1),
            journal_root TEXT NOT NULL,
            committed INTEGER NOT NULL DEFAULT 0 CHECK(committed IN (0, 1))
        );
        CREATE TABLE IF NOT EXISTS backup_restore_files (
            path TEXT PRIMARY KEY,
            original BLOB,
            incoming BLOB NOT NULL
        );
    """)


def _clear_ledger(db: sqlite3.Connection) -> None:
    with db:
        db.execute("DELETE FROM backup_restore_files")
        db.execute("DELETE FROM backup_restore_state")


def _recover(db: sqlite3.Connection, root: Path) -> None:
    state = db.execute("SELECT journal_root, committed FROM backup_restore_state WHERE singleton=1").fetchone()
    if state is None:
        return
    if state[1]:
        _clear_ledger(db)
        return
    if Path(state[0]).resolve() != root.resolve():
        raise BackupRecoveryError("Restore recovery requires the original JOURNEY_JOURNAL_DIR")
    records = db.execute("SELECT path, original, incoming FROM backup_restore_files ORDER BY path").fetchall()
    targets = backup_journal.journal_targets(root, [{"path": row[0], "content": ""} for row in records])
    pending = []
    # Check every destination before altering any, including after a failed retry.
    for (target, _), (_, original, incoming) in zip(targets, records):
        current = target.read_bytes() if target.exists() else None
        if current == original:
            continue
        if current != incoming:
            raise BackupRecoveryError(
                "Journal changed after an interrupted restore; preserve the files and recover from the safety backup"
            )
        pending.append((target, original))
    for target, original in reversed(pending):
        if original is None:
            target.unlink(missing_ok=True)
        else:
            backup_journal._replace_bytes(target, original)
    _clear_ledger(db)


@contextmanager
def guarded_restore(connect, root: Path, lock_path: Path):
    with backup_lock(lock_path), closing(connect()) as db:
        _ensure_ledger(db)
        _recover(db, root)
        yield db


def recover_backup_import(connect, root: Path, lock_path: Path) -> None:
    """Run before app startup exposes any learning endpoints."""
    with guarded_restore(connect, root, lock_path):
        pass


@contextmanager
def restore_transaction(db: sqlite3.Connection, root: Path, rows: list[dict]):
    """Caller must hold guarded_restore; yielded connection owns the DB commit."""
    targets = backup_journal.journal_targets(root, rows)
    records = [
        (path.relative_to(root.resolve()).as_posix(), path.read_bytes() if path.exists() else None,
         content.encode("utf-8"))
        for path, content in targets
    ]
    with db:
        db.execute("INSERT INTO backup_restore_state(singleton, journal_root) VALUES(1, ?)", (str(root.resolve()),))
        db.executemany("INSERT INTO backup_restore_files(path, original, incoming) VALUES(?, ?, ?)", records)
    try:
        db.execute("BEGIN IMMEDIATE")
        for path, content in targets:
            backup_journal._replace_bytes(path, content.encode("utf-8"))
        yield len(targets)
        db.execute("UPDATE backup_restore_state SET committed=1 WHERE singleton=1")
        db.commit()
    except BaseException:
        db.rollback()
        _recover(db, root)
        raise
    else:
        # A failed cleanup must not report a committed import as failed. The
        # durable committed marker makes cleanup safe on the next start/import.
        try:
            _clear_ledger(db)
        except sqlite3.Error:
            db.rollback()
