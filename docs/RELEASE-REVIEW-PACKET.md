# Reviewing the pending release

## Current mobile and Core models packet — 2026-10-09

Review directory: `.build/release-review-mobile-models-20261009/`.
Base: `41ff566d4b98d1f79352b8bbf57c2a706a341953` on `main`.
Proposed commit: `feat: improve mobile layout and add core models practice`.
Destination: `origin/main`, `https://github.com/Hzyl/JourneyAIEngineer.git`.

This combines the Core models files listed below with the responsive drawer/header
fix and its signed-in browser coverage. The Google file is already committed in
the base; approval of that earlier commit does not authorize this new batch.
There are no backend, credential, SMTP, dependency or production-data changes.

`REVIEW.json` records the exact public source hashes and changed paths;
`changes.diff` includes new files. `VERIFICATION.json` records archive integrity,
manifest checks, public-source/secret scanning and equality with the working tree.
Any later source edit invalidates that equality and needs a fresh snapshot.
The ZIP is a review artifact, not a published release or a rebuilt Windows binary.
Human acceptance remains deferred to [one round](ACCEPTANCE-BATCH.md).

## Responsive follow-up — 2026-10-09

The Core models snapshot below predates the signed-in dashboard responsive fix.
Its manifest is historical and does **not** cover the current working tree.
Rebuild the review packet before publication; no new commit/push has been approved.

The follow-up collapses navigation through 1100 CSS pixels and allows the header
to wrap without squeezing its title. Six production-build browser checks passed:
four VI/EN and light/dark layout cases across 13 widths (320–1440), plus two sign-out
checks. TypeScript passed; lint passed with the existing AuthProvider fast-refresh
warning. The build retains its existing large-chunk warning.

These checks use Chromium mobile/touch emulation and synthetic accounts locally.
The exact reported phone/browser issue is not yet reproduced on a physical device.

## Earlier Core models packet — 2026-10-09

Review directory: `.build/release-review-core-models-20261009/`.
Base: `9bd2a7ccd359013d391a30f2d32bc392c74ca7b4` on `main`.
Proposed commit: `feat(learning): add core models walkthrough and worked solution`.
Destination: `origin/main`, `https://github.com/Hzyl/JourneyAIEngineer.git`.
No commit/push or deployment is authorized by the existence of this packet.

The batch adds three downloadable Python files, bilingual guide/solution content,
reader registrations, tests, a minimum row-header width for readable mobile model
names, a catalog fingerprint and documentation. It preserves exercise IDs and
self-assessment. There are **no database migrations, Edge Function changes,
SMTP/Auth settings, new runtime dependencies or production data changes**.

For this packet, `REVIEW.json` lists exact source hashes and changed public paths;
`changes.diff` includes new files; the source ZIP is a working-tree snapshot.
`VERIFICATION.json` covers archive integrity, manifest hashes and agreement with
the reviewed working tree. It does not claim fresh Windows packaging or runtime.
The older Windows candidate is identified in [candidate notes](RELEASE-v0.1.3.md).

Automated evidence for the code in this batch: 219 frontend tests, eight Python
integration checks (including the 11 Core models tests), four targeted production
browser tests, TypeScript, lint, content/fingerprint and Vite build passed.
See [the scoped result](CORE-MODELS-SOLUTION.md). Documentation-only consolidation
does not require repeating those same browser runs.

After commit/push approval, verify CI for the resulting exact SHA and Cloudflare's
production alias. The previously verified deployment is
`49125584-20e4-4154-b454-ab410e006d8e` at `9bd2a7c`; recheck that mapping immediately
before any rollback. For a regression, restore that reviewed frontend deployment
or prepare a reviewed Git revert. This batch requires no SQL rollback. Do not
reset data or overwrite learner workspaces when rolling back the desktop app.

The user deferred manual acceptance to [one final round](ACCEPTANCE-BATCH.md).
Sending-domain/SMTP inputs, real-account checks, clean Windows runtime and learner
feedback remain open. Further exercise solutions are a content backlog; their
existence does not substitute for closing those release requirements.

## Earlier packet format and history

The local review packet under `.build/release-review-<timestamp>/` is a dated
working-tree snapshot. It is not a published release, a deployment approval or a
replacement for the existing v0.1.2 assets. Earlier packets use version 0.1.2;
the new local candidate uses 0.1.3 as described in [candidate notes](RELEASE-v0.1.3.md).

Backend status changed after the earlier packets were created: the four migration
files and `delete-account` function were approved and deployed on 2026-10-08.
See [backend rollout](BACKEND-ROLLOUT.md) before acting on a packet's historical
"pending" list. Frontend commit/push was subsequently approved and completed as
`5518493`; Cloudflare and CI passed. New versioned release assets remain a separate
gate. Dated packets retain their original bytes and should not be mistaken for the
current working tree; see [release readiness](RELEASE-READINESS.md).

## Packet contents

- `REVIEW.json`: exact base commit, observed remote branch, current source hashes,
  added/modified public-source paths, migration status and function files.
- `changes.diff`: reviewable UTF-8 changes against the base, including newly
  authored files. Newlines are normalized for reading; file hashes in the manifest
  identify the original bytes. Binary changes are listed in the manifest.
- `deployment/`: exact copies of the four reviewed migration files and all three
  `delete-account` function modules. These are review material, not an auto-run script.
- Version-matched source ZIP, checksum and source manifest, generated by
  `scripts/package_source.py`. The source ZIP includes the corrected test discovery
  configuration and optional exercise solutions.
- `VERIFICATION.json`: archive integrity and fresh-extraction check results added
  only after each check runs successfully. Check status rather than file presence.
- `windows-preview/WINDOWS-INSPECTION.json`: the packaging pipeline reads the EXE
  archive without launching it and requires exact content/frontend bytes and the
  backup/security module inventory. Unexpected cache files fail this check.
  This inspection does not establish runtime or clean-machine acceptance.

Source selection uses the existing packager allowlist. Both current and baseline
source are scanned for supported secret markers before a diff is written. Private
runtime data, learner journals, credentials and agent configuration are excluded.
These safeguards do not replace human review of the exact candidate diff.

## Publication order

1. Review the source diff, migration/function hashes and outstanding checks in
   [release readiness](RELEASE-READINESS.md). Reconfirm destination identities.
2. Preserve the completed local migration 004, generated types, two-account SQL
   and real Deno/Auth checks recorded in `DATABASE-ACCEPTANCE.md`. Finish the
   clean-machine Windows checks, then run remote CI. Math runtime acceptance now
   passes all 20 tests and four inspected plots; see `MATH-SOLUTION-VERIFICATION.md`.
3. Select a new version and private support contact, then rebuild release assets.
   Record real learner pilot evidence; never substitute synthetic test results.
4. Obtain approval for the exact production migration/function/origin changes.
   Back up the destination and capture the current successful Cloudflare deployment
   ID before changing it. Apply and verify the approved backend prerequisites first.
5. Present the final commit message and `origin/main` target for commit/push consent.
   Main may automatically deploy through Cloudflare Git integration. Verify the
   resulting deployment and real email/account learning flows after promotion.

## Rollback boundaries

- If a frontend regression appears, restore the previously recorded successful
  Cloudflare deployment. The Git comparison base alone does not identify that
  deployment. Preserve additive tables and mutation receipts.
- Do not run `db reset`, drop receipt/history data or reverse SQL automatically on
  production. Any database restore needs a reviewed backup and separate approval.
- If account deletion fails before success is confirmed, keep its error state and
  retry/support route; do not report the account as deleted. A confirmed deletion
  is not undone by rolling back the frontend or function code.
- Recheck the packet against the working tree before approving it. Further edits
  make it a historical snapshot; they are not covered by an earlier review.

No packet creation step commits, pushes, deploys, changes Auth settings, installs
dependencies or starts a database runtime. External acceptance gates stay open.

## Embedded Windows data regression

The first Windows preview contained 12 Python cache files under `content/`.
Its packet, `release-review-20261008-033309`, is marked superseded and its Windows
artifact rejected for release. The source archive had passed its own checks.

The PyInstaller spec now selects authored content through the source packager's
allowlist instead of copying the entire directory. Existing cache files stay on
disk. The release pipeline then independently inspects the resulting executable
before creating the ZIP. A stale frontend, missing content, extra cache/private
data or absent recovery module fails packaging. The verifier reproduces the
12-file failure on the old executable; 17 focused packaging/security tests pass.

For a new packet, read the actual `WINDOWS-INSPECTION.json` and `VERIFICATION.json`.
Passing these structural checks still leaves the Windows runtime, clean-machine
and external production acceptance gates open.
