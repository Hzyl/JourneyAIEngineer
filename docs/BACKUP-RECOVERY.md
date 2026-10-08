# Local backup process recovery

Date: 2026-10-08. Implemented locally; no production database changes.

## Contract

An interrupted import must not leave the app serving old learning rows alongside
partly replaced journal files after restart. Recovery runs before schema/content
initialization and before FastAPI exposes learning endpoints.

`backup_recovery.py` records each destination's original bytes (or absence) and
incoming bytes in two private SQLite tables before replacing any journal file.
Learning-table replacement and the `committed` marker share one transaction.
The OS-owned `backup-restore.lock` covers recovery, the safety snapshot and import;
process exit releases it without stale-PID heuristics. A competing import gets 409.

| Durable state on restart | Action |
| --- | --- |
| No pending import | Start normally |
| Prepared, transaction not committed | Restore original journal files; SQLite retains the original learning rows |
| Transaction committed | Keep imported data and journal; remove recovery records |
| Recovery interrupted again | Repeat safely, skipping files already restored |
| Journal destination changed independently | Preserve files and recovery records; stop startup with an explicit conflict |
| Journal root changed while recovery is pending | Require the original `JOURNEY_JOURNAL_DIR`; do not write into the new root |

Normal write/SQLite failures use this same recovery path. There is no separate
in-memory rollback implementation. Cleanup failure after commit retains a durable
committed marker and does not incorrectly report that the import failed.

## Privacy and operations

Recovery records contain private journal bytes inside the local SQLite database.
They are not included in portable JSON exports or sent to Supabase. Completed
recovery removes the records; this is normal SQL deletion, not secure erasure.

For a conflict, first preserve the current database, its SQLite sidecars and the
journal folder. Keep the safety JSON in the data directory's `backups` folder.
Do not delete recovery rows or repeatedly attempt imports to suppress the error.
Resolve the conflicting journal destination against its preserved copy and safety
snapshot before retrying with this app version. Do not open the interrupted data
with an older version that lacks recovery support.

Process exit during temporary-file writing may leave a `.journey-import-*` file.
It is not a journal document and is excluded by the text backup suffix filter.
Recovery protects the actual destination; it does not broadly delete temporary
files that another operation might own.

## Verification scope

Tests use disposable SQLite/journal directories and test-owned subprocesses that
exit with `os._exit`, bypassing exception handlers and `finally` cleanup. Existing
user processes and private learner files are never stopped or changed.

Covered boundaries include temporary-file replacement, the first journal write,
learning-table replacement, the commit marker and post-commit cleanup. Additional
tests cover another exit during recovery, external journal edits, a changed root,
two-process locking, an actual SQLite trigger failure and failed cleanup after a
successful commit. Ordinary malformed-backup and browser restore tests still apply.

These checks cover process exit on this Windows development machine. They do not
certify power-loss behavior, damaged storage, network filesystems, clean-machine
EXE startup or live hosted acceptance.
