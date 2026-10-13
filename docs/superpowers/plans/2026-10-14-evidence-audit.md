# Evidence-based audit — 2026-10-14

Baseline: `5dd5baabf0a2c0c2760b8854e58d81fb6471ad50`, clean working tree.
The previous turn published the reviewed P0 batch; that is verified progress.

## Contract

Review the current learning experience for concrete defects and useful gaps.
Do not manufacture findings to consume quota or repeatedly reopen passing work.
Keep IDs, learner data, local/hosted boundaries and VI/EN equivalence intact.
No new dependencies, model downloads, Docker, production writes, commits or
publication in this audit. Any proposed expansion needs evidence of actual need.

Route: Codex UI owns local inspection, integration and verified fixes. No bridge
or model change to the app. Two bounded reviews supported the parent before
explicit ownership transfers for implementation; no nested delegation or
overlapping source ownership. AgentPulse scan found no matches,
candidates or safety blocks; this is context, not a security certification.

## Ownership

- Initial curriculum/data reviews were read-only. After verified findings, the
  parent transferred bounded implementation ownership: the curriculum implementer
  owns only the chunking lesson source and its Python regression test; the notes
  implementer owns only hosted-client createNote and its unit/browser tests.
- The notes implementer then received integration ownership of generated
  `content/lessons.json`, `content/catalog-version.json`, this ledger and
  `docs/RESEARCH-INTEGRATION.md`. Helpers remain under
  `.build/audit-20261014/{chunking,notes,integration}/`.
- Parent: final review, coordination, baseline production-browser evidence and
  deployed-artifact/CI evidence. Source fixes are returned to their designated
  owner; no implementation edits are made during integration.
- All new browser/data fixtures are synthetic; no real accounts or production
  writes, dependency changes, migrations, commits or publication.

## Acceptance and stopping rules

1. A finding requires a concrete trigger, observed result and expected contract.
2. Check whether existing code/tests already cover it before proposing a change.
3. Record each reviewed area once; revisit only after a relevant edit or failure.
4. Prefer a small extension of existing code over a new framework or feature.
5. Prove behavior changes with a failing reproduction, then a passing regression.
6. Separate source checks, mocked browser tests, live read-only observations and
   real-account/device acceptance. Do not substitute one for another.
7. Run relevant checks after fixes; a final common suite covers integrated work.
8. Record unresolved limits without turning speculative risks into defects.

## Ledger

| Area | Evidence | Decision / state |
| --- | --- | --- |
| P0 ingestion/planning batch | Published as baseline; 290 Python, 247 Vitest and 16 browser checks from prior turn | Do not rerun narrow checks without a new reason |
| Baseline production-browser flows | `npx playwright test --config playwright.production.config.ts`: 55 passed, exit 0, 3.0 minutes before these fixes; observed parent tool session 94260 on 2026-10-14, no retained log file | Baseline evidence only; not a rerun of the final tree |
| Published baseline / CI | Commit `5dd5baa`: GitHub run `38432451543` quality and hosted-database jobs succeeded; Cloudflare Pages check succeeded, deployment `bcf7594a-691b-42f6-8d39-23347bc02571` | Existing baseline deployment confirmed by parent; current fixes remain unpublished |
| Live guest reading | Parent opened the landing page and first sample lesson in IAB; console error log empty; 320px viewport/document/body widths all 320; first three main paragraph fonts 19/16/18px | Guest read-only observation, no account or physical-phone acceptance |
| RAG chunking | Original example joined an answer/evidence string rather than performing chunking; replaced with executable line/section comparison, provenance and whole-chunk character-budget packing | Fixed one lesson; 28 focused Python cases, included in full suite |
| Chunking integration boundary | Independent review reproduced a valid section ending in a blank source line being rejected; canonical LF splitting now retains the empty line | Red/green reproduction retained; four additional regression cases passed |
| Hosted note retries | Lost committed response then retry reproduced two notes; reuse existing mutation UUID, conflict read by ID/user and exact content check | Fixed; 15 new unit cases and two VI/EN mocked browser flows |
| Other reviewed data paths | Bounded read of note writes, backup/export and session paths found no concrete cross-account leak/export defect; journal natural-key upsert appeared intact | Keep as is; static scoped evidence, not exhaustive or live RLS certification |
| Catalog and learner data | 208 source/catalog identities and relationships preserved, 207 other lesson records identical; existing learner DB inventory and SHA-256 unchanged | Verified before/after integration tests |
| Final integration | One `npm test`: 318 Python, 262 Vitest; validator/fingerprint/lint/TypeScript/build passed. Final chunking browser matrix: eight passed | Complete locally; parent owns final review and any later publication decision |

## Accepted changes and retained behavior

- The chunking lesson keeps its ID, prerequisite/next-lesson/exercise links and
  four review-card IDs/types. It reuses existing Docling reading material and
  standard-library examples; no dependency, notebook or model was added.
  Existing conceptual explanations of refund exceptions and overlap were useful
  and retained. The reviewer found no curated override for this lesson.
- The integration review caught `len(text.splitlines())` dropping a terminal
  blank source line. The source owner changed the canonical joined-text check
  to `split('\n')` and added blank-before-heading, repeated-blank, document-end
  and CRLF regressions. The independent reproduction then passed.
- Note retry protection uses the existing `withMutationRequest` helper and
  existing notes primary key. It still inserts normally, recovers only on
  `23505`, reads by both ID and user ID, and checks lesson/title/body equality.
  It does not upsert, overwrite conflicting content, change RLS or add a migration.
  An acknowledged later action receives a new UUID. Recovery across a page reload
  is verified within the same browser session; it is not cross-device recovery.
- Hosted backup import remains intentionally local-only; cloud export is a
  separate feature. Reviewed application filters use `user.id` and SQL access
  policies use `auth.uid()`. No real-account RLS audit was performed, and this
  review does not certify every session, review or progress path.

## Final verification and evidence

All paths below are local ignored artifacts relative to the repository root.

- Catalog regenerated with `.venv\Scripts\python.exe -X utf8 scripts/build_lesson_catalog.py`
  and `scripts/catalog_version.py --write`; content validation passed for
  23 phases and 208 lessons. Logs: `.build/audit-20261014/integration/catalog-build.log`,
  `catalog-version.log` and `content-validation.log`.
- One `npm test` ran after the final source fix and catalog generation:
  318 Python tests passed in 61.26 seconds; 262 Vitest tests across 43 files
  passed in 7.76 seconds. The 28 chunking and 15 note cases are included in those
  totals. Exit 0, including content/fingerprint/lint/TypeScript/production build.
  Log: `.build/audit-20261014/integration/npm-test.log`.
- `npx playwright test --config .build/audit-20261014/integration/playwright.config.ts`:
  eight passed in 17.2 seconds, exit 0. Matrix: VI/EN × 320/1440px × light/dark,
  using isolated port 4193 and a production build. Tests checked teaching prose,
  source code, answer hints, practice instructions, expected stdout, Colab
  file-creation instructions, focus, control size, overflow and contrast.
  Supabase was mocked and unexpected network requests were blocked.
  Logs: `integration/browser.log`, `integration/results.json` beneath
  `.build/audit-20261014/`; 24 screenshots in `integration/evidence/`.
- Visually inspected VI 320px concept screenshots in light/dark and EN 1440px
  dark practice/code screenshots. Prose remained readable; code uses its existing
  horizontally scrollable block. These are browser viewport simulations.
- Earlier note checks remain separate evidence: 19 targeted unit tests passed
  (15 new note cases plus four existing cases), and two VI/EN production-preview
  browser tests passed in 7.6 seconds. Logs:
  `.build/audit-20261014/notes/unit-red.log`, `unit-green.log`,
  `browser-green.log`; details in `notes/evidence.md`.
- Scope comparison against `5dd5baabf0a2c0c2760b8854e58d81fb6471ad50`:
  `.build/audit-20261014/integration/scope-verification.log`.
  DB file hashes before/after are retained in `learner-db-before.json` and
  `learner-db-after.json` in that folder. No learner database was modified.
  Boundary reproduction: `blank-line-red.log` (exit 1) and
  `blank-line-green.log` (exit 0).
- Final `git diff --check` passed, exit 0; `git status --short` showed only the
  intended nine source/test/catalog/document files. Records:
  `.build/audit-20261014/integration/diff-check.log` and `final-status.log`.
- Parent's live IAB observation loaded landing and first guest lesson, with a
  visible GitHub link and a readable desktop screenshot. The 320px DOM geometry
  check passed, but the provider scaled the mobile screenshot awkwardly; no
  full phone visual QA is claimed. The temporary viewport was reset and tab closed.

Known warnings remain Fast Refresh exports in AuthProvider, bundle size,
NO_COLOR/FORCE_COLOR in browser tooling, and 32 passive security items requiring
human review. Those static items are not 32 demonstrated vulnerabilities.
No real Supabase account/device, Colab/model, Docling/PDF/OCR, production write,
commit, push or deployment was part of the final local verification.
