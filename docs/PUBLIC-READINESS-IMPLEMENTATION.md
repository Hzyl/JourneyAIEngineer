# Public readiness implementation

Approved scope: the 2026-10-07 audit and its four implementation stages.
Existing user changes and auth commits must be preserved.
Status is evidence based; an unchecked item remains part of the active goal.

## Contracts and ownership

- Codex owns integration, app logic, database migrations, tests and verification.
- OMX delegation could not start with its configured CLI model; Codex completed the content/exercise work locally.
- Antigravity was asked for read-only concepts; no returned design is claimed. Codex implemented and checked the UI.
- Neither satellite may call another satellite, commit, push, deploy, install,
  change credentials or touch live private data.
- Keep web free of local API, filesystem, Git, process and editor access.
- Existing lesson, review-card and exercise identifiers remain stable.
- Additive migration and content synchronization must retain user progress.

### Curated content integration contract

`content/curated/<lesson_id>.json` contains a complete lesson object using the
existing `content/lessons.json` schema, plus `quality_status: "reviewed"` and
`reviewed_at: "2026-10-07"`. It overrides the matching legacy lesson by ID.
Do not change lesson/module/phase IDs, prerequisite IDs or review-card IDs.
Codex integrates this overlay in the Python and TypeScript catalog loaders.
Unreviewed legacy lessons stay available with an honest draft content label.

Each of the first ten lessons must be specific to its topic, bilingual, runnable
where appropriate, and distinguish web reading/manual practice from local tools.
Retain four review cards per lesson with the existing IDs/types for compatibility.
Each JSON file should remain below approximately 300 lines.

`content/exercise_templates/<exercise_slug>/` contains `starter.py`,
`test_exercise.py`, `reference.py`, `README.vi.md`, `README.en.md` and `manifest.json`.
Manifest fields: `schema_version: 1`, `exercise_slug`, `title_vi`, `title_en`,
`assessment_kind: "verified"`, `test_command: "python -m unittest -v test_exercise.py"`.
Target the three onboarding module exercises already defined in exercises.json.
Templates must use standard Python libraries, deterministic synthetic examples,
topic-specific assertions and edge cases. Starter must fail, reference must pass,
and a meaningless nonempty result/explanation dictionary must fail.
Codex owns selection/copying of templates and honest UI assessment labels.

Allowed OMX edits: content/curated/**, content/exercise_templates/**,
tests/test_curated_content.py, docs/CURRICULUM-STANDARDS.md. No other files.

## A. Learning correctness

- [x] Stable-ID catalog overlay and validation, including portfolio references.
- [x] Fix Vietnamese RAG phase reference.
- [x] Ten curated bilingual onboarding lessons and quality status in UI.
- [x] Three topic-specific exercise templates; no false mastery from reflection tests.
- [x] Review only learned lessons; distinguish new/due cards and preserve scheduling.
- [x] Separate self-reported completion, practice verification and career evidence.
- [x] Coherent foundation/application/deep-ML route choices and workload wording.
- [x] Runnable Vietnamese document assistant sample with evaluation and citations.

## B. Public learning and UI

- [x] Guest landing, roadmap and sample lessons; account required only to persist.
- [x] One clear next action on Today; productive first artifact without Git.
- [ ] Accessible colors, readable type and simpler lesson layout.
- [ ] Main-flow VI/EN strings; responsive, keyboard, focus and empty/error states.
- [ ] Desktop/mobile screenshots and interactive verification.

## C. Data integrity and privacy

- [x] Idempotent progress/review writes and correct first-review concurrency.
- [x] Ordered, paginated history and complete export reads.
- [ ] Stable catalog/version metadata and safe import preview/conflict handling.
- [ ] Cloud export and authenticated account-deletion flow.
- [ ] Two-account RLS, RPC, retry and concurrency tests in local/staging database.
- [ ] Real auth email smoke tests and advisor follow-up, with external gates respected.

## D. Release preparation

- [x] Demo-first README, lesson contribution template and meaningful starter issues.
- [x] Version-matched source archive and clear portable workspace/source instructions.
- [x] Docs consistent with deployment, migration and local/web capability boundaries.
- [ ] Appropriate unit/API/catalog/E2E/lint/build/package checks.
- [ ] Windows clean-machine smoke coverage and documented remaining limitations.
- [ ] Concrete migration/release diff and rollback instructions ready for approval.
- [ ] Commit/push/deploy/production changes only after current explicit confirmation.
- [ ] Pilot feedback with real learners is external evidence, never fabricated.

## Evidence log

- 2026-10-07: initial state main ahead 2, six pre-existing documentation/ignore edits.
- 2026-10-07: AgentPulse scan completed; no safety block; no GitNexus index available.
- 2026-10-07: implementation contracts recorded before independent work.


## Initial verification checkpoint — 2026-10-07

Implemented does not mean deployed. At this initial checkpoint, MCP read-only inspection
showed only the two 20261006 migrations. No commit, push, production migration,
Auth-setting change or Edge deployment had been performed at that checkpoint.
See the follow-up below for subsequent Git and test status.

- Current Python suite: **57 passed**; catalog/reference/fingerprint validation passed.
- Current frontend suite: **25 passed**; lint exits successfully with 3 warnings.
- Current local Playwright: **3 passed**. Hosted guest/boundary Playwright: **2 passed**.
  These tests use isolated local services/test settings, not real email delivery.
- Production frontend build passed. Main chunk remains about 568 KB and hosted lazy
  catalog about 2.95 MB before compression; performance work remains.
- Earlier disposable SQL run: **89 pgTAP assertions passed** through migration 003;
  a separate two-connection test passed distinct-write and same-request races.
- Migration 004 and final generated types have **not** been verified. Docker's engine
  became unavailable; CI's generated-type diff check is still a release blocker.
- Windows EXE built successfully into `.build/readiness-windows-20261007-final-local` (19.1 MB).
  Automated approval rejected the runtime launch with `blocked by policy`, without a
  detailed reason. Do not claim runtime or clean-machine acceptance for this new binary.
- Browser checks: Today, route selection (application route: 56 lessons), settings EN,
  desktop width 1265 and narrow width 375; no horizontal overflow in observed views.
  Screenshots are in `docs/screenshots/`. This is not a complete accessibility audit.
- Local backup controls and replacement confirmation now support VI/EN and enumerate journal, review history and study-session effects.
- Checklist browser keys now separate hosted user IDs and retain legacy local keys;
  unit tests cover account isolation and malformed data.

## Remaining work before promotion

1. Restore an approved disposable database runtime, test migration 004's conditional
   event-trigger path, account deletion cascades, and regenerate database types. Keep
   the CI type-diff gate; do not generate from the old production schema.
2. Run/check the Edge Function with its real Deno runtime and disposable Auth accounts;
   confirm origins, password reauthentication, failure behavior and account deletion.
3. Complete remaining VI/EN strings beyond the verified Journal and exercise screens,
   keyboard/focus checks across routes and frontend load-time review.
4. Verify Windows launch, missing-Python behavior, learner workspace and backup restore
   on a clean machine. The successful build on this development machine is insufficient.
5. Complete real confirmation/resend/reset email and two-account acceptance on an
   approved staging/deployment. Review the leaked-password advisor setting separately.
6. Publish a private support contact, choose a new release version, gather actual pilot
   feedback, and prepare final commit/deployment approval. See `RELEASE-READINESS.md`.

Cloud export and the deletion UI/handler are implemented and unit-tested, but their item
stays unchecked until deployed acceptance. Backup identity/fingerprint/preview protections
are implemented. Journal writes now use compensating rollback on file-write or database errors, with eight additional tests. Further malformed-input review and process-crash recovery remain. External
pilot results and publication are deliberately unchecked, not simulated by tests.


### Source ZIP verification

`.build/source-readiness-20261007-1605/JourneyAIEngineer-v0.1.2-source.zip` contains
400 source files plus its manifest. Every listed file hash and the private-path exclusion
checks passed. After extraction into a fresh directory without `.git`, catalog fingerprint,
strict content validation and all 8 journal rollback/path tests passed using the existing
Python environment. The first extracted test invocation lacked its `.build` parent directory;
creating that test directory resolved the setup error. This does not establish clean-machine
installation or runtime acceptance.
SHA-256: `46d89d84d4ba7588bfa59aebef9cebb4288caf40d0a0d53eceb54a161233370d`.
This is an unpublished working-tree snapshot, not a replacement for the existing v0.1.2 release.
The archive records its creation-time documentation; this verification entry was updated afterward.

Measured theme pairs: body/white 15.81:1, muted/paper 6.73:1, white/primary button 6.66:1,
sidebar hint/background 8.90:1. These pair checks do not certify the entire application.

## Interaction and Journal follow-up — 2026-10-07

- Remote `main` verified at `5e0e34af22fb02f7e0056a9013fe66cb292eb7e0`:
  readiness and theme commits are pushed. This follow-up remains uncommitted locally.
  Remote Git state does not establish Cloudflare or Supabase deployment state.
- Added shared press feedback, pending indicators, duplicate-submit protection and
  persistent save/error feedback; see `INTERACTIONS.md`.
- Extracted Journal into dedicated components and VI/EN labels. User-authored text
  remains unchanged. Hosted Journal never requests local Git APIs. Notes expose
  English lesson-title metadata through an additive response field.
- Current checks: 58 Python tests, 31 unit tests, 15 local Playwright tests and
  6 hosted Playwright tests passed. After limiting button/navigation transitions to
  movement and shadow, reran 6 interaction/Journal tests and all 6 hosted tests: passed.
- Journal VI/EN checks cover context creation, clipboard failure with retained preview,
  export feedback, mobile width 390px, and light/dark contrast. Stable screenshots
  in `.build/journal-evidence/` were visually inspected; generated evidence stays ignored.
  Hosted editor unit tests cover validation, pending state, duplicate clicks, retry,
  draft preservation and language changes. These do not prove live cloud writes.
- Production build passes; lint has no errors and 2 existing Fast Refresh warnings.
  Bundle-size warnings remain. No new production DB/Auth changes or Windows packaging.

The broader accessibility, release and deployment checklist remains open; these
focused checks do not cover every route, real auth email, or clean-machine acceptance.

## Exercise interaction follow-up — 2026-10-07

- Exercise actions now show localized pending labels, prevent duplicate submissions,
  preserve failed run output, and allow retry. Changing a publish message resets its
  confirmation; controls stay locked while publication is pending.
- Exercise labels, filters, empty states and run summaries support VI/EN. Hosted mode
  exposes the manual guide without invoking local workspace or Git APIs.
- Latest checks: 35 unit tests, 17 local Playwright tests and 6 hosted Playwright tests
  passed. Production build passed; lint has no errors and 2 existing Fast Refresh
  warnings. Bundle-size warnings remain. The earlier 58 Python tests were not rerun
  for this frontend-only follow-up.
- Mobile light/dark screenshots in `.build/exercise-evidence/` were inspected, with
  pending-button contrast and horizontal-overflow checks. The skip link remains
  keyboard accessible and is clipped when unfocused, including full-page screenshots.
- Exercise browser tests mock workspace and Git operations; they do not launch VS Code,
  run learner code or publish commits. No live DB/Auth or Windows acceptance is claimed.
  These follow-ups remain local and uncommitted.
