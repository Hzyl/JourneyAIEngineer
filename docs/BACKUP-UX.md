# Backup and cloud export verification

Date: 2026-10-08. Local implementation; no publication or production writes.

## Local backup and restore

The previous UI could retain preview A while importing newly edited JSON B.
`BackupSettings` now binds each preview to the exact source and parsed payload.
Editing or exporting invalidates that preview. Import uses the captured reviewed
payload, requires confirmation, and locks conflicting operations immediately.

The preview lists incoming and replaced counts, settings replacement, and the
existing journal filenames that would be overwritten. Preview does not write
files. Invalid JSON and failed requests preserve the source; a failed import
requires another preview before retrying. Successful imports retain a safety
backup receipt and reload learning state, including the weekly goal.

The JSON editor disables spellchecking and uses internal horizontal scrolling.
The two browser scenarios use the full exported snapshot, including 832 review
cards. They verify pending controls, a keyboard edit invalidating the preview,
cancellation without an import request, actual isolated SQLite restore, and the
updated weekly goal. They also check VI/EN, light/dark, desktop/mobile contrast
and page overflow. Screenshots: `.build/backup-evidence/`.

An earlier test replaced the entire compact JSON with hundreds of KB of pretty
JSON through `locator.fill`, which timed out in Chromium. The same behavior was
reproduced in a plain HTML textarea without React or the app. The test now makes
a real one-character keyboard edit to the unchanged full-size snapshot. This
does not establish acceptance for every browser's large multiline paste path.

## Hosted account isolation and export

`useCloudExport` prevents duplicate requests and discards unfinished results
after unmount, sign-out or account changes. It checks the snapshot owner and
rechecks the current authenticated user before creating a download. Normal token
refresh for the same account does not cancel the operation. Errors are localized
and omit raw provider diagnostics; retry remains available.

`AppRoutes` keys the authenticated learning screen by user ID so that switching
accounts cannot retain the previous account's component state. A same-user
refresh retains that screen. This UI check supplements, rather than proves, RLS.

Seven focused unit tests cover export ownership, duplicate clicks, sign-out and
return to the same account, unmount, ordinary token refresh, errors and retry,
downloaded content and URL cleanup. A routing regression covers private draft
state across account changes. Two production-build browser scenarios exercise
VI/EN export failure/retry, download contents, busy state, themes and responsive
layout without local API requests. Supabase responses use synthetic fixtures;
they do not contact production or prove live Auth, RPC or RLS behavior.
Screenshots: `.build/cloud-export-evidence/`.

## Verification checkpoint

- Frontend unit suite: 85 passed; the final unmounted-auth callback guard was
  followed by 11 focused export/routing checks, all passing.
- Python suite: 67 passed, including journal conflict preview without writes.
- Local browser suite: 28 passed against an isolated temporary SQLite/journal root.
- Hosted production-build browser suite: 18 passed using synthetic Supabase data.
- Lint and TypeScript/Vite build passed. The pre-existing AuthProvider Fast Refresh
  warning and hosted catalog chunk-size warning remain.
- Catalog fingerprint and Git diff whitespace checks passed. Desktop/mobile
  screenshots for local backup and cloud export were visually inspected.

These earlier checks did not establish process-crash recovery; the later recovery
verification is linked below. Real hosted Auth/RLS, clean-machine Windows operation
and public deployment remain outside these local checks.

## Malformed local backups — 2026-10-08

Strict preflight validation now covers stored field types, SQLite integer bounds,
finite positive review ease, schedule flags, ISO timestamps, UTF-8 text and known
setting values. Boolean values cannot masquerade as integer IDs or durations.
Unknown string settings and optional legacy fields remain compatible; stable card
keys still remap before validation. Errors identify fields without echoing note
or journal contents. Invalid Windows filename characters are also rejected.

Invalid previews return field errors and keep import disabled. Invalid import
requests return 422 before writing a safety snapshot, changing learning tables,
or replacing journal files. Regression tests compare the original learning state
and journal after rejection. Process recovery is verified separately below.

The full Python suite passed 107 tests, including 40 added malformed-input,
legacy-compatibility and filename cases. Four focused VI/EN browser scenarios
passed against isolated SQLite/journal directories: two full restore scenarios
and two invalid-preview scenarios. No production data or hosted settings changed.

## Interrupted process recovery — 2026-10-08

[Durable recovery](BACKUP-RECOVERY.md) now preserves a prepared undo record before
journal writes and commits its completion marker with learning-state replacement.
Restart restores original files for an uncommitted import and keeps imported files
after commit. Recovery is repeatable and refuses to overwrite independent edits.

The full Python suite passed 117 tests after integration. The subsequently extended
recovery suite passed all 12 cases, including the added pre-replacement process-exit
case. All four focused VI/EN browser restore scenarios passed. The final added case
did not change application code. Power loss and clean-machine EXE startup remain
unverified; no user process or private learner data was used for the crash tests.

## Deployment limits

Read-only Supabase MCP inspection on 2026-10-08 confirmed the project is
`tnnlpsecrzatxdpoaagw`. Only the two 20261006 migrations are applied and the Edge
Function inventory is empty. The four 20261007 migrations and `delete-account`
function remain undeployed. Cloud export requires its pending snapshot RPC.

No real user data was imported, exported, deleted or published for these tests.
No Docker runtime or dependency installation was started. Broader staging RLS,
real email, clean-machine Windows and learner-pilot acceptance remain open.
See [release gates](RELEASE-READINESS.md) before any deployment.
