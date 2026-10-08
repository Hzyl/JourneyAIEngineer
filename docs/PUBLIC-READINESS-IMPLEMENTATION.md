# Public readiness implementation

Approved scope: the 2026-10-07 audit and its four implementation stages.
Existing user changes and auth commits must be preserved.
Status is evidence based; an unchecked item remains part of the active goal.

Deployment decision, 2026-10-08: retain the existing web and Supabase project
`tnnlpsecrzatxdpoaagw` under the Free-plan goal. Separate cloud staging is optional,
not a prerequisite. Use local/CI disposable tests; production mutations and test
account operations still require approval of their concrete scope.

The initial specifically approved backend rollout completed on 2026-10-08 after a verified
backup and local rehearsal. All six migration versions are applied, nine tables have
RLS, and `delete-account` version 1 is ACTIVE. Ten non-destructive live HTTP checks
passed; see [backend rollout](BACKEND-ROLLOUT.md). The matching frontend was approved,
pushed as `5518493` and deployed by Cloudflare. CI run `37741791718` passed both jobs;
guest browser checks on the main site passed in the first exercise flow.
Real email/deletion/browser acceptance, Windows smoke coverage and learner
pilot evidence remain outstanding; those checklist items below remain unchecked.

Current checkpoint: the separately approved 24-hour session change is deployed as
`128b353`, with both CI jobs passing. Supabase now has seven migrations and
`delete-account` version 2; see [release readiness](RELEASE-READINESS.md) and
[session lifetime](SESSION-LIFETIME.md). Maintainer feedback reports recovery/export
and two accounts working, with UI and exercises provisionally accepted. Blank or
placeholder answers for email and progress are not passing evidence. The remaining
acceptance document records these distinctions without closing unverified checks.

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
- [x] Accessible colors, readable type and simpler lesson layout.
- [x] Main-flow VI/EN strings; responsive, keyboard, focus and empty/error states.
- [x] Desktop/mobile screenshots and interactive verification.

Stage B implementation/browser acceptance is recorded in [UI acceptance](UI-ACCEPTANCE.md).
These checks do not claim deployment, full WCAG certification or stage C/D acceptance.

## C. Data integrity and privacy

- [x] Idempotent progress/review writes and correct first-review concurrency.
- [x] Ordered, paginated history and complete export reads.
- [x] Stable catalog/version metadata and safe import preview/conflict handling.
- [ ] Cloud export and authenticated account-deletion flow.
- [x] Two-account RLS, RPC, retry and concurrency tests in local/staging database.
- [ ] Real auth email smoke tests and advisor follow-up, with external gates respected.

## D. Release preparation

- [x] Demo-first README, lesson contribution template and meaningful starter issues.
- [x] Version-matched source archive and clear portable workspace/source instructions.
- [x] Docs consistent with deployment, migration and local/web capability boundaries.
- [x] Appropriate unit/API/catalog/E2E/lint/build/package checks for the web checkpoint and local preview.
- [ ] Windows clean-machine smoke coverage and documented remaining limitations.
- [ ] Concrete migration/release diff and rollback instructions ready for approval.
- [ ] Commit/push/deploy/production changes only after current explicit confirmation.
- [ ] Pilot feedback with real learners is external evidence, never fabricated.

## Evidence log

Current web deployment and remote CI evidence: [release readiness](RELEASE-READINESS.md).
Open checks requiring real accounts, a clean Windows environment or human feedback:
[remaining acceptance](PRODUCTION-ACCEPTANCE.md). Entries below retain their historical
checkpoint wording; an earlier statement that a feature was local is not its current deployment status.

Further verification: [feedback/community](FEEDBACK-UX.md), [global search](SEARCH-UX.md),
[ML framing solution](ML-FRAMING-SOLUTION.md), and [backup/cloud export](BACKUP-UX.md).
Lesson reading and practice handoff verification: [lesson UX](LESSON-UX.md).
Today form and roadmap filter/navigation verification: [Today and roadmap UX](TODAY-ROADMAP-UX.md).
Recall, rating and activity recovery verification: [review UX](REVIEW-UX.md).
Preferences, weekly goals and portfolio requirements: [settings/portfolio UX](SETTINGS-PORTFOLIO-UX.md).
Guest entry, navigation history and bilingual account forms: [public entry UX](PUBLIC-ENTRY-UX.md).
Personal-app mobile drawer, focus restoration and responsive navigation: [app navigation UX](APP-NAVIGATION-UX.md).
Invalid links, lesson request recovery and unsaved draft retention: [lesson recovery UX](LESSON-RECOVERY-UX.md).
Account confirmation, session changes and deletion/logout recovery: [account deletion UX](ACCOUNT-DELETION-UX.md).
Session startup recovery and topbar sign-out feedback: [session recovery UX](SESSION-RECOVERY-UX.md).
Local passive source review, bilingual findings and unavailable-source handling: [Security Lab UX](SECURITY-LAB-UX.md).
Production browser CI coverage and source archive checks: [CI/source release checks](CI-SOURCE-RELEASE-CHECKS.md).
Workspace refresh races, language retry and shared settings writes: [workspace recovery UX](WORKSPACE-RECOVERY-UX.md).
Cross-flow stage B requirement mapping and current browser scope: [UI acceptance](UI-ACCEPTANCE.md).
Bounded deletion input, strict UTF-8 and corrected current-test counts: [Edge input validation](EDGE-INPUT-VALIDATION.md).
External release gates remain open.
Read-only schema evidence and completed local SQL/Auth/cascade acceptance:
[database acceptance](DATABASE-ACCEPTANCE.md).

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
- Follow-up 2026-10-08: all 128 pgTAP assertions, migration 004 conditional cases
  and two-connection races passed locally. Types were regenerated and compile.
  Real local Auth/Edge deletion passed 21 checks; see `DATABASE-ACCEPTANCE.md`.
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

1. Preserve the now-passing local SQL, concurrency and generated-type checks; run
   the CI gates on the approved candidate before promotion.
2. Local Deno/Auth acceptance and deployed CORS checks passed. Verify signed-in
   export, deletion and browser sign-out using the approved disposable accounts.
3. Stage B cross-flow browser acceptance is complete in the scope recorded in
   `UI-ACCEPTANCE.md`. Preserve its checks when integrating further changes and
   extend the deployed guest checks recorded in `RELEASE-READINESS.md` with real
   authenticated acceptance; the current web checkpoint is deployed.
4. Verify Windows launch, missing-Python behavior, learner workspace and backup restore
   on a clean machine. The successful build on this development machine is insufficient.
5. Complete real confirmation/resend/reset email and two-account acceptance on an
   approved staging/deployment. Review the leaked-password advisor setting separately.
6. Publish a private support contact, choose a new release version, gather actual pilot
   feedback, and prepare final commit/deployment approval. See `RELEASE-READINESS.md`.

Cloud export and the deletion UI/handler are implemented and unit-tested, but their item
stays unchecked until deployed acceptance. Backup identity/fingerprint/preview protections
are implemented. Journal writes use compensating rollback on file-write or database errors.
Malformed-input validation now rejects invalid types, settings, timestamps, encoding and
Windows filenames before writes; 107 Python tests and four focused restore browser tests
pass. See `BACKUP-UX.md`. Durable recovery is now verified at five process-exit
boundaries, including another exit during recovery; see `BACKUP-RECOVERY.md`.
Power-loss and clean-machine EXE acceptance are not established. External
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

## Guest load and exercise reader follow-up — 2026-10-07

- Read-only remote verification confirms `origin/main` at `94d3be8`. The interaction
  and Journal/exercise language work described above is now pushed. The subsequent
  in-page reader, reference solutions and guest loading changes remain uncommitted.
- The shared reader provides task requirements, walkthroughs, hints and starter files
  inside the app. Three verified exercises have opt-in bilingual solutions; the other
  49 labs explicitly lack authored solutions. See `EXERCISE-UX.md`.
- Guest entry now defers the personal app and exercise code until needed. Measured
  landing JavaScript drops from 846,855 to 631,820 bytes (about 25.4%); details and
  a reproducible production-browser check are in `FRONTEND-LOAD.md`.
- 45 unit tests and all 10 production-browser tests passed, including chunk-failure
  recovery, guest request boundaries, exercise solutions and light/dark layouts.
  TypeScript/Vite build passed; lint has no errors and one existing Fast Refresh warning.
- Full local regression exposed a Journal overflow with long Git metadata. A synthetic
  long-metadata case reproduced it before the layout fix. All 18 local browser tests
  passed after the fix, including desktop/mobile and light/dark checks. The final
  build and diff whitespace checks also passed. No full accessibility certification
  or production acceptance is claimed here.
- Database staging, email delivery, clean-machine Windows acceptance and real learner
  pilot evidence remain open. These frontend checks do not complete those gates.

## Foundation worked solutions follow-up — 2026-10-07

- Six exercises now have individually authored bilingual guides and opt-in solutions:
  the three introductory templates plus Python core, reliable code and data files.
  The remaining 46 labs explicitly show that no worked solution is available.
- The three new examples include downloadable files, setup instructions, five tests
  each, explanations, pitfalls and follow-up practice. Opening a solution does not
  change progress. Foundation labs retain self-assessment status.
- The full Python suite passed (62 tests), including fresh-folder execution and a
  check that the intentionally buggy example fails its regression test. Frontend
  unit tests (46), production browser tests (10), and focused local exercise browser
  tests (2) passed. Desktop/mobile light/dark solution screenshots were inspected.
- Catalog fingerprint updated for the authored content. No production database,
  authentication, deployment or release changes are included in this follow-up.
  Source changes remain local and uncommitted.

## Developer workflow and SQL solutions follow-up — 2026-10-07

- Eight exercises now have authored bilingual guides and optional worked solutions,
  covering all five software foundation labs plus the three introductory templates.
  The remaining 44 labs still need individually authored walkthroughs and solutions.
- Developer workflow includes a loopback API, validated JSON downloads and manual
  Git branch/diff/recovery instructions. SQL uses in-memory SQLite to compare two
  weekly aggregates, explaining table grain, JOIN semantics and dictionary costs.
- Both examples include five runnable tests. Fresh-folder integration checks pass;
  the full Python suite passes 64 tests. All 12 production browser tests pass,
  including bilingual solution downloads with no local API calls from the website.
- All 47 frontend unit tests, lint and production build pass. The existing Fast
  Refresh lint warning and large hosted-client chunk warning remain.
- Git exercise instructions are teaching material: no learner Git operation was
  performed, and automated API tests do not certify manual Git recovery. No Docker,
  Supabase change, commit, push or deployment was performed for this follow-up.
- Database staging, real Auth email, Windows clean-machine checks and real learner
  pilot evidence remain open. This follow-up does not complete the public release plan.

## Math solutions follow-up — 2026-10-07

- Twelve exercises have authored guides/solutions after adding four math labs;
  40 still need individual walkthroughs and answers. The additions preserve the
  original NumPy, PCA, autograd, histogram and optimizer-comparison requirements.
- Fifteen NumPy numerical checks passed in fresh folders, plus four calculus checks
  without PyTorch. Autograd and all four plots remain unverified pending an approved
  dependency environment. See `MATH-SOLUTION-VERIFICATION.md`; do not claim full
  math runtime acceptance from the browser or app test suites.
- All 47 frontend unit tests, 14 production-browser tests, lint and build passed.
  The earlier full Python suite passed 64 tests; the subsequently added dependency
  fingerprint regression passed separately. Requirements files now contribute to
  the catalog fingerprint, retaining line-ending normalization.
- No package installation, production data change, commit, push or deployment was
  performed. Existing app and bundled Python environments remain unchanged.

## Reference-library language follow-up — 2026-10-07

- Extracted ResourcesView from App.tsx and fixed the Vietnamese-only English-mode
  hero, mixed phase names, source counts and official/community/type labels. Raw
  catalog types and phase keys remain unchanged so existing filter URLs still work.
- Three new unit tests cover language changes, source URL preservation, deep links,
  empty results and browser-history restoration. Two local browser tests pass in
  VI/EN with desktop/mobile, light/dark, contrast, overflow and keyboard checks.
  Screenshots in `.build/resources-evidence/` were visually inspected.
- The current full Python suite passes 65 tests. The current frontend suite passes
  50 tests; lint and production build pass with the previously documented warnings.
  The 14 production-browser checks passed before this local reference-library edit;
  this follow-up uses its two focused browser checks rather than claiming a rerun.
- Math autograd and plot execution remain pending dependency-installation consent.
  The broader localization/accessibility and release gates remain open.

## Toolkit language follow-up — 2026-10-07

- The eight toolkit entries previously copied Vietnamese into their English fields.
  Authored English now covers purpose, setup, usage, troubleshooting, combinations,
  risks and when to avoid each tool. The two prose entries inside command lists also
  have English variants; shell commands themselves remain unchanged.
- ToolsView now receives the active language and uses a typed LearningTool contract.
  Its labels, category names and empty state are localized. The layout uses two
  columns on desktop and one on narrow screens, with wrapping for long commands.
- The full Python suite passes 65 tests; 53 frontend unit tests, lint and production
  build pass. Two focused local toolkit browser tests pass in VI/EN, with desktop/
  mobile light/dark contrast, overflow and empty-state checks. Page interactions
  make no command-execution requests. Screenshots are in `.build/tools-evidence/`.
- No tool was installed or launched by this content change. The math dependency
  request, broader UI audit, staging/Windows acceptance and public release gates
  remain open. This follow-up is local and unpublished.
