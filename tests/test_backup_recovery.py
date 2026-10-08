"""Real process-exit tests use only pytest's disposable database and journal."""
import json
from pathlib import Path
import sqlite3
import subprocess
import sys

import pytest
from fastapi import HTTPException

from apps.api import backup_recovery
from apps.api.backup_lock import backup_lock
from test_review_activation import FIRST, app  # noqa: F401


CRASH_SCRIPT = r'''
import json
import os
import sys
from apps.api import main, backup_journal, backup_recovery

mode = sys.argv[1]
if mode != "recovery":
    main.init_db()
replace = backup_journal._replace_bytes

def replace_then_exit(path, content):
    replace(path, content)
    if path.name == "first.md":
        os._exit(71)

if mode in {"file", "recovery"}:
    backup_journal._replace_bytes = replace_then_exit

if mode == "temporary":
    replace_file = backup_journal.os.replace
    def exit_before_replace(source, target):
        if target.name == "first.md":
            os._exit(71)
        replace_file(source, target)
    backup_journal.os.replace = exit_before_replace

if mode in {"database", "commit"}:
    connect = main.connect
    def connect_with_exit():
        db = connect()
        def trace(statement):
            boundary = "DELETE FROM progress" if mode == "database" else "UPDATE backup_restore_state SET committed=1"
            if statement.startswith(boundary):
                os._exit(71)
        db.set_trace_callback(trace)
        return db
    main.connect = connect_with_exit

if mode == "committed":
    clear = backup_recovery._clear_ledger
    def clear_or_exit(db):
        state = db.execute("SELECT committed FROM backup_restore_state").fetchone()
        if state and state[0]:
            os._exit(71)
        clear(db)
    backup_recovery._clear_ledger = clear_or_exit

if mode == "recovery":
    main.init_db()
else:
    payload = json.loads((main.DATA_ROOT / "crash-import.json").read_text(encoding="utf-8"))
    main.import_backup(main.BackupImportRequest(payload=payload, confirm=True))
raise RuntimeError("The requested crash boundary was not reached")
'''


def prepare(app):
    app.update_progress(FIRST, app.ProgressUpdate(status="completed", minutes_spent=25))
    (app.JOURNAL_ROOT / "first.md").write_text("original ✓", encoding="utf-8")
    payload = app._build_backup_payload()
    payload["progress"][0]["minutes_spent"] = 42
    payload["journal_files"] = [
        {"path": "first.md", "content": "replacement ✓"},
        {"path": "new.md", "content": "new journal"},
    ]
    (app.DATA_ROOT / "crash-import.json").write_text(json.dumps(payload), encoding="utf-8")
    return payload


def crash(app, mode):
    # A test-owned subprocess exits itself; no existing application is stopped.
    result = subprocess.run(
        [sys.executable, "-X", "utf8", "-c", CRASH_SCRIPT, mode],
        cwd=Path(app.__file__).resolve().parents[2], capture_output=True, text=True, timeout=30,
    )
    assert result.returncode == 71, result.stdout + result.stderr


def minutes(app):
    with app.connect() as db:
        return db.execute("SELECT minutes_spent FROM progress").fetchone()[0]


def assert_no_recovery_pending(app):
    with app.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM backup_restore_state").fetchone()[0] == 0
        assert db.execute("SELECT COUNT(*) FROM backup_restore_files").fetchone()[0] == 0


@pytest.mark.parametrize("boundary", ["temporary", "file", "database", "commit", "committed"])
def test_restart_recovers_the_matching_database_and_journal(app, boundary):
    prepare(app)
    crash(app, boundary)
    with app.connect() as db:
        assert db.execute("SELECT committed FROM backup_restore_state").fetchone()[0] == (boundary == "committed")
    expected_before_restart = "original ✓" if boundary == "temporary" else "replacement ✓"
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == expected_before_restart
    app.init_db()
    committed = boundary == "committed"
    assert minutes(app) == (42 if committed else 25)
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == (
        "replacement ✓" if committed else "original ✓"
    )
    assert (app.JOURNAL_ROOT / "new.md").exists() is committed
    assert_no_recovery_pending(app)
    app.init_db()  # Recovery remains safe to repeat.
    assert minutes(app) == (42 if committed else 25)


def test_changed_journal_is_preserved_and_undo_records_retained(app):
    prepare(app)
    crash(app, "file")
    first = app.JOURNAL_ROOT / "first.md"
    first.write_text("edited after the crash", encoding="utf-8")
    with pytest.raises(backup_recovery.BackupRecoveryError, match="Journal changed"):
        app.init_db()
    assert first.read_text(encoding="utf-8") == "edited after the crash"
    assert minutes(app) == 25
    with app.connect() as db:
        assert db.execute("SELECT COUNT(*) FROM backup_restore_files").fetchone()[0] == 2
    first.write_text("replacement ✓", encoding="utf-8")
    app.init_db()
    assert first.read_text(encoding="utf-8") == "original ✓"
    assert_no_recovery_pending(app)


def test_a_second_process_exit_during_recovery_can_be_retried(app):
    prepare(app)
    crash(app, "database")
    crash(app, "recovery")
    assert minutes(app) == 25
    app.init_db()
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == "original ✓"
    assert not (app.JOURNAL_ROOT / "new.md").exists()
    assert_no_recovery_pending(app)


def test_second_restore_is_rejected_before_safety_snapshot(app, monkeypatch):
    payload = prepare(app)
    def unexpected_snapshot(*_args):
        pytest.fail("A competing restore must not start a safety snapshot")
    monkeypatch.setattr(app, "_write_backup_files", unexpected_snapshot)
    with backup_lock(app.DATA_ROOT / "backup-restore.lock"):
        with pytest.raises(HTTPException) as failure:
            app.import_backup(app.BackupImportRequest(payload=payload, confirm=True))
    assert failure.value.status_code == 409
    assert minutes(app) == 25


def test_committed_cleanup_failure_keeps_success_and_recovers_later(app, monkeypatch):
    payload = prepare(app)
    clear = backup_recovery._clear_ledger
    def fail_cleanup(_db):
        raise sqlite3.OperationalError("Simulated cleanup error")
    monkeypatch.setattr(backup_recovery, "_clear_ledger", fail_cleanup)
    result = app.import_backup(app.BackupImportRequest(payload=payload, confirm=True))
    assert result["imported"] is True
    assert minutes(app) == 42
    monkeypatch.setattr(backup_recovery, "_clear_ledger", clear)
    app.init_db()
    assert minutes(app) == 42
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == "replacement ✓"
    assert_no_recovery_pending(app)


def test_recovery_refuses_a_changed_journal_root(app, tmp_path):
    prepare(app)
    crash(app, "file")
    with pytest.raises(backup_recovery.BackupRecoveryError, match="original JOURNEY_JOURNAL_DIR"):
        backup_recovery.recover_backup_import(app.connect, tmp_path / "different", app.DATA_ROOT / "backup-restore.lock")
    app.init_db()
    assert minutes(app) == 25
    assert_no_recovery_pending(app)


def test_another_process_cannot_recover_an_active_import(app):
    prepare(app)
    with backup_lock(app.DATA_ROOT / "backup-restore.lock"):
        result = subprocess.run(
            [sys.executable, "-X", "utf8", "-c", CRASH_SCRIPT, "file"],
            cwd=Path(app.__file__).resolve().parents[2], capture_output=True, text=True, timeout=30,
        )
    assert result.returncode == 1
    assert "Another backup restore is active" in result.stderr
    assert minutes(app) == 25
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == "original ✓"


def test_sqlite_write_failure_restores_database_and_all_journal_files(app):
    payload = prepare(app)
    original = app._build_backup_payload()
    with app.connect() as db:
        db.execute("""CREATE TRIGGER reject_import BEFORE INSERT ON progress
                      BEGIN SELECT RAISE(ABORT, 'Simulated SQLite failure'); END""")
    with pytest.raises(sqlite3.IntegrityError, match="Simulated SQLite failure"):
        app.import_backup(app.BackupImportRequest(payload=payload, confirm=True))
    after = app._build_backup_payload()
    for key in ("progress", "review_state", "review_history", "settings", "notes", "study_sessions"):
        assert after[key] == original[key]
    assert (app.JOURNAL_ROOT / "first.md").read_text(encoding="utf-8") == "original ✓"
    assert not (app.JOURNAL_ROOT / "new.md").exists()
    assert_no_recovery_pending(app)
