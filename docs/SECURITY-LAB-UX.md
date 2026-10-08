# Passive Security Lab verification

## Scope and design — 2026-10-08

Codex UI completed this bounded local correction using UI/UX Pro Max guidance,
the existing theme tokens and an Impeccable readability/interaction check. No
external design tool, runtime or dependency was installed. This feature remains
local-only; it does not give the hosted website access to local source files.

- Extracted the old inline screen from `App.tsx` into typed components and a
  request hook, with separate, formatted CSS files under 300 lines each.
- Vietnamese/English now covers findings, evidence, remedies, limitations,
  filters, summary, endpoint metadata labels and loading/error/empty states.
  Existing finding identifiers and Vietnamese response fields are retained.
- Reading text is 15px, supporting labels are at least 13px, controls have a
  44px minimum height, and long source paths wrap. Native details controls and
  a focusable endpoint region support keyboard reading.
- Filters survive language changes without another audit request. Empty results
  offer a clear-filter action. A failed refresh retains and explicitly labels
  previous results; duplicate refresh clicks are blocked and late responses after
  leaving the screen are ignored. Provider error details are not displayed.

## Correctness correction

The old scanner treated a missing/unreadable/unparseable API file as an empty list
of findings, then added two verified-control findings. It now distinguishes an
unsuccessful inspection from a parsed file with no matching risk patterns. Missing,
unreadable, oversized or invalid Python source produces an explicit unavailable
finding and no successful source-control checks.

The UI calls these results source checks, rather than a security certification.
The report documents its bounded pattern scope: `apps/api/main.py` and top-level
`src/*.tsx`. It does not claim coverage of every file, dependency, middleware or
runtime authorization control. Scanning still reads metadata/source without
executing inventoried endpoint handlers or installing/running external tools.

## Evidence

- Full Python suite: 124 passed. Eight targeted security tests passed, including
  six new source scenarios. The two existing API security tests passed again after
  adding assertions for English fields on every returned finding.
- Full frontend suite: 180 passed, including six new Security Lab cases.
- Two bilingual local browser scenarios passed twice. They exercise initial
  failure/retry, real local audit output, filtering/clearing, keyboard details,
  failed refresh with retained results, and synthetic long source metadata.
  No non-runtime API writes or uncaught page errors were observed.
- Browser checks cover light/dark themes at 1440px, 390px and 320px, with text
  contrast and horizontal-overflow assertions. English dark-mode introduction
  and Vietnamese light-mode finding screenshots at 320px were visually inspected.
  Images are ignored under `.build/security-evidence/`.
- All 26 production-build hosted browser tests passed. TypeScript/Vite build,
  lint and diff whitespace checks passed. Existing AuthProvider Fast Refresh
  and large hosted-client bundle warnings remain.

The first oversized-source fixture accidentally used its full contents as the
pytest case ID, causing Windows temporary-directory setup errors. Explicit short
case IDs fixed the fixture; the oversized-file assertion remains in place.
TypeScript also caught a missing English limitations field in the hosted no-op
client response; that response now matches the shared contract.

## Remaining gates

This is targeted UI and scanner-correctness evidence, not a full security audit,
screen-reader certification or Windows clean-machine acceptance. Supabase staging,
migration 004/type generation, real auth email/deletion and public release checks
remain open. No Docker startup, production change, commit, push or deployment was
performed in this follow-up.
