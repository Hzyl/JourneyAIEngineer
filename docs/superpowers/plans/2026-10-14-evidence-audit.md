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

## Follow-up: retrieval answer parity and readable review cards

Baseline `6ad4363ae59643629994dafe329fa3a2db9ab86c` was subsequently pushed.
CI run `38452326531` passed both quality and hosted-database; Cloudflare deployment
`58527803-1bd2-4aed-aff1-8193016cce6c` succeeded. These results apply to that
baseline only, not the following working-tree changes.

The bounded audit retained existing runnable embedding, hybrid retrieval,
reranking and Lab A examples. It found a concrete review-answer mismatch:
Vietnamese cards supplied answers, while English cards mostly supplied rubrics.
Canonical lesson Markdown for 12-3, 13-1 and 13-2 now has twelve aligned bilingual
cards and matching top-level recall fields. No IDs, types, code, outputs, links,
other metadata or Markdown bodies changed. Catalog and fingerprint were rebuilt;
205 other lesson records and all 208 lesson identities were preserved.

Numerical answers were computed from existing snippets: cosine rankings reverse
when the query switches axes; one-based RRF with c=60 ranks d2, d1, d3; the two
reranking fixtures raise mean reciprocal rank from 0.25 to 0.5. These are toy
examples, not model benchmarks or claims about Qdrant defaults. Existing official
Sentence Transformers Retrieve & Re-Rank and Qdrant Hybrid Queries sources were
cross-checked; no dependency or resource was added.

The first browser run then exposed actual 11px review paragraphs and 10px answer
controls. The small lesson-reading.css extension sets paragraphs to 1.125rem,
summary controls to 1rem with a 44px minimum target, and wraps long strings.
At the tested 16px root font these are 18px and 16px. Existing theme tokens remain.

Verification artifacts are ignored beneath `.build/audit-20261014/`:

- `followup-integration/npm-test.log`: one full suite after final content/catalog,
  before the final CSS fix; 318 Python (58.05s), 262 Vitest / 43 files (7.75s),
  content/fingerprint/lint/TypeScript/production build all passed, exit 0.
- `followup-integration/browser-red.log` and `review-font-before.png` preserve
  the font failure. Final `browser.log`: eight passed in 34.6s after the CSS fix
  and a fresh production build, exit 0. No full-suite rerun is implied.
- `followup-ui/`: VI/EN × 320/1440px × light/dark, each visiting three lessons
  and opening four answer cards by keyboard. Checks cover text parity, focus,
  font, contrast, control size, no page errors and no horizontal overflow.
  Synthetic auth/Supabase fixtures reject unexpected requests. Twenty-four
  screenshots saved; root inspected VI 320px light and EN 1440px dark.
- `verify-review-scope.py`: source/catalog scope and unchanged real learner DB
  SHA-256 verified. `verify-review-refresh.py`: isolated backend initialization
  refreshed all twelve synthetic answers while preserving card IDs and entire
  review_state rows. Both exited 0; no real learner rows were read or changed.
- `followup-retrieval/review-verification.json`: independent source-field,
  identity, body and numerical checks. Independent read-only CSS review found
  no material blocker. Local exercise review kept existing code unchanged;
  five existing workspace/runner/export/template tests passed.

User has now confirmed this batch's commit and push. Root owns publication with
message `fix: clarify bilingual retrieval reviews and improve readability` to
`https://github.com/Hzyl/JourneyAIEngineer.git`, `origin/main`. Publication and
new CI/provider results must be checked separately after push. No physical-device,
real-account, Colab/model or Docling/PDF/OCR acceptance is claimed.

## Final bounded batch: review ease and agent outcomes

The preceding batch was published as `2c7c3359b589be9c5f2cfefe384417e781c3ff10`.
CI `38455734884` passed quality and hosted-database; Cloudflare deployment
`75dc1863-67da-463f-a540-d7570d60a834` succeeded. This does not publish the
following working-tree changes. No additional audit areas were opened.

- Local `answer_review` now clamps ease to 1.30..9.99 before calculating the
  next interval, matching the hosted bound. Synthetic tests reproduced the
  old upper-bound failure. Nine additional cases cover each rating, normal
  and lower-bound behavior, legacy above-cap values and repeated easy ratings;
  response and both scheduling tables agree. All 13 tests in the file passed.
  No migration, stored learner-data rewrite or observed data loss is claimed.
- Phase 17-3 retains its first example verbatim and adds one independent
  standard-library outcome grader. Eight outputs distinguish false success,
  alternate valid paths, incorrect/missing reports, permission and budget
  failures, and a task-definition error. Trusted observations are explicitly
  distinct from solver claims. Twenty-five tests execute the example and
  documented solution, including missing required keys whose expected value
  is null. Four bilingual cards retain their identities. Lab B is unchanged.
- Browser checks caught missing setup/output/edge-case metadata in the main
  code-example blocks. LessonContent now renders the existing fields with
  localized labels and the established definition-list layout. Two VI/EN
  regressions failed before the fix and passed after it; text is escaped.
  Scoped reading CSS ensures 16px guide text and wrapping. No redesign.

Evidence beneath ignored `.build/audit-20261014/`:

- `review-schedule/cap-red.log`: five expected pre-fix failures; `cap-green.log`:
  all 13 scheduling tests passed. No hosted SQL was rerun for this local fix.
- `agent-eval-integration/npm-test.log`: 352 Python tests (76.62s), 262 Vitest
  tests (43 files), content/fingerprint/lint/TypeScript/build passed, exit 0.
  Following the UI fix, the full frontend suite passed 264 tests (7.37s), and
  lint plus TypeScript/production build passed again. Python sources did not
  change after the full run; no second Python suite is implied.
- `agent-eval-integration/browser-selector-failure.log` preserves the missing
  metadata failure. Final `browser.log` and `agent-eval-ui/results.json`:
  eight passed in 20.2s, with VI/EN, 320/1440px and light/dark themes.
  Checks include code/output, prose and guide font sizes, contrast, keyboard
  focus, target size, document overflow, page errors and unexpected requests.
  Supabase/auth are synthetic; preview uses port 4195 and a fresh build.
- Thirty-two screenshots in `agent-eval-ui/evidence/`; root inspected outcome
  VI 320px light and EN 1440px dark. Long code retains horizontal scrolling.
  No physical-device or real-account acceptance is claimed.
- `agent-eval-integration/scope.json`: 208 identities and card IDs/types
  preserved, 207 lesson records unchanged, original example/output unchanged,
  and the real learner database file hash unchanged. Catalog was regenerated.
- `git diff --check` passed. Existing Fast Refresh/bundle warnings and passive
  audit review items remain; they are not new demonstrated vulnerabilities.

Current batch is local and uncommitted. No new model/API, installation, real
Supabase run, production write or deployment was performed. Publication needs
the applicable current confirmation with an exact commit message and target.

## 2026-10-16: route continuation and Classical ML examples

Baseline for this batch is `8a5116eb8b3506fcea03162b5c9bd3c07cb69e97`.
The three Copilot stage/project metadata corrections were already published in
`4e9b0cf`; the following fixes address separate runtime and lesson-content gaps.

- Lesson continuation now follows the selected learning route instead of the
  global authored sequence. Application RAG leads to evaluation, production
  leads to capstone, and the last core lesson offers a return to the roadmap.
  Selecting one optional phase does not enroll the learner in other optional
  phases. Authored links remain the fallback without a valid route/catalog.
  URL route context, browser history, reload and original roadmap filters are
  retained. No progress data or existing IDs were changed.
- Four canonical Classical ML lessons now use topic-specific runnable examples:
  least-squares regression, stable logistic probabilities and threshold metrics,
  a learned Gini split, and one squared-error boosting update. Each has exact
  output, edge cases and explanations. Logistic coefficients and forest votes
  are explicitly supplied illustrations, not trained models. The boosting
  example reports training error, not an unsupported generalization claim.
  Sixteen bilingual review cards now provide actual answers. Catalog and
  fingerprint were regenerated; all 208 lesson identities and card IDs/types
  were preserved, with exactly four changed and 204 unchanged lesson records.
- Browser verification exposed missing card padding and small path labels.
  Scoped lesson styles restore padding/readability and preserve multiline code
  output. Theme tokens and horizontally scrollable code remain in use.

Verification on this working tree:

- `npm test`: exit 0; 385 Python tests, 288 Vitest tests in 47 files,
  content/fingerprint validation, lint, TypeScript and production build passed.
  This includes 32 executable Classical ML checks and 11 route unit checks.
- Local Playwright `lesson-route-navigation.spec.ts` and `today-roadmap.spec.ts`:
  eight passed. After the final padding adjustment,
  `lesson-language.spec.ts`: two passed, including reading/progress retry.
- Production-build Playwright `hosted-route-navigation.spec.ts`,
  `hosted-classical-lessons.spec.ts`, `hosted-models.spec.ts`: six passed
  in 31.9 seconds after the final CSS cleanup. VI/EN, 390/1440px, light/dark,
  keyboard answer disclosure, fonts, contrast, output line breaks and document
  overflow were checked. Synthetic Auth rejects local API, unexpected writes
  and real external requests. Real Supabase acceptance is not implied.
- Ignored screenshots: `.build/route-evidence/` and
  `.build/models-lesson-evidence/`. Root inspected mobile Vietnamese dark
  logistic output and desktop English light boosting answer, plus the earlier
  terminal-route views. No physical-device inspection is claimed.
- `git diff --check` and an independent catalog identity/scope comparison passed.
  Existing AuthProvider lint warnings and large-chunk warning remain. Passive
  security review flags are review items, not demonstrated vulnerabilities.

No new dependencies, model downloads, production writes or real learner-data
changes were required. This is a bounded audit batch, not a completed review of
all 208 lessons. Remaining work includes other generic English answer rubrics,
admin expiry-display behavior, and the separately approved production rollout of
admin RPC hardening. Publication status must be recorded after an actual push.

## 2026-10-16: admin directory state and Classical ML evaluation

The preceding batch was pushed as
`141b2f12f018559d6bdcc4b9ad33d65a821be73e`. GitHub run `38861885348`
completed both quality and hosted-database successfully. The Cloudflare Pages
check for that SHA reported success, deployment
`01e3ac54-e0e8-4df4-90a0-a9d4f370f240`. These results do not publish the
following working-tree changes.

Admin UI bugs were reproduced before fixing them:

- A module-level timestamp left expired bans displayed as still in force.
  The view now recomputes expiry with a bounded local timer and on focus or
  visibility resume. No polling of the real account service is added.
- Slow old directory requests could replace a newer search or add a stale
  error. Only the latest mounted request can update the view.
- Permission/session errors retained personal rows and action buttons.
  New list loads clear prior results; an authorization failure during a
  mutation also clears them. A mutation completed after unmount no longer
  triggers a new list fetch. Confirmation and duplicate-action guards remain.
- Rendered admin text was 10–11px. Labels, values and controls are now at least
  16px at the tested root size, with stacked mobile fields, readable search
  layout and a non-wrapping status badge. The ban count explicitly says it
  covers this page. Backend authorization and role assignment are unchanged.

Four Evaluation lessons now have substantive matching bilingual tasks and
sixteen review answers. Runnable standard-library examples calculate a binary
confusion matrix, compare absolute/squared regression errors, fit the mean
baseline separately inside each cross-validation fold, and select k-NN
hyperparameters using validation before refitting and opening the test data.
The text distinguishes descriptive fold spread from statistical confidence
and tiny worked examples from generalization evidence. Canonical Markdown
was edited and the catalog regenerated: 208 lesson identities/card identities
remain stable, exactly four records changed and 204 stayed identical.

Verification after integration:

- `npm test`: exit 0 at 2026-10-16 13:53 local time; 415 Python tests
  (100.65s), 304 Vitest tests in 48 files (9.37s), content/fingerprint,
  lint, TypeScript and production build passed.
- The admin regression file had eleven meaningful failures before fixes;
  all sixteen tests now pass, including expiry/resume, response races,
  permission failures, confirmation and unmount behavior.
- Thirty independent Python checks execute the four lesson snippets, compare
  exact documented outputs, check hand-calculated metrics, reject invalid
  fold partitions and verify no within-fold fit leakage.
- Fresh hosted-production browser run: seven passed in 44.1s. Coverage includes
  ordinary-user navigation hiding, confirmed synthetic ban/unban/reset actions,
  eight Classical ML lessons in VI/EN, route continuation, keyboard answer
  disclosure and 390/1440px light/dark readability/contrast/overflow.
- Root inspected mobile Vietnamese and desktop English admin screenshots, then
  corrected a wrapped Active badge and reran. It also inspected mobile regression
  output and desktop hyperparameter review answers. Ignored artifacts are under
  `.build/admin-directory-evidence/` and `.build/models-lesson-evidence/`.
- `git diff --check` and focused lint passed. Existing AuthProvider warnings,
  large hosted-client chunk and passive security review flags remain.

All accounts and action requests in browser tests were synthetic. No real reset
email, ban, production database migration, deployment, physical-device test,
installation or model run was performed in this batch. It remains local.

The broad audit is still incomplete. A fresh scan after applying curated
overrides finds 183 of 208 lessons with a generic English recall-answer rubric;
this is a triage signal, not a finding that all of their concepts are wrong.
Other pending areas include full content review, shared code-example setup
localization, hosted payload size and production admin RPC hardening.

## 2026-10-16: local HTTP boundary, preprocessing and bilingual code setup

The preceding approved batch was pushed as
`7c00a8d668ccee61de7e8254e7b341c3cbf921ae`. The remote main SHA was
verified, CI run `38864900600` passed both quality and hosted-database,
and Cloudflare Pages deployment `3e0e81b8-a1c9-480c-83fc-339b8450c19c`
reported success. This does not publish the following new working-tree batch.

Route: codex-ui. Existing local implementation and verification; no bridge or
new provider/model run. Handoff: none. Local edits/tests are authorized;
publication of this new batch still requires its own confirmed message/target.

### Changes and reproduced failures

- Real isolated Uvicorn requests showed a loopback peer could use an untrusted
  Host to read/write private notes. A malformed IPv6 Origin raised a server
  error. The initial HTTP regression run had 15 failures and eight passes.
  A shared helper now validates peer, Host and any Origin, including duplicate
  Origin headers and malformed ports. Private handlers retain their existing
  local-only policy; the passive audit remains local even when other local
  capabilities are explicitly opted out. No cloud authorization was changed.
- A legitimate SQLite index named `review's unique id` broke startup because
  index metadata was interpolated into SQL. A parameterized
  `pragma_index_info(?)` query fixes the crash. A failing-then-passing restart
  regression preserves progress, notes, review state and schema version.
- Four canonical preprocessing lessons now teach train-only median imputation,
  frozen one-hot vocabulary with distinct missing/unknown flags, scaling/log
  transforms, and point-in-time feature construction. Each has bilingual tasks,
  four substantive review answers and an executable standard-library example
  with exact output. Feature windows check both event and availability times;
  neutral output names also support a non-default window. Tiny examples prove
  arithmetic/data boundaries, not generalization or production readiness.
- Shared code-example setup now supports `setup_vi`/`setup_en`, falling back
  to legacy setup and then the other language, skipping blanks. Existing
  content stays compatible. Eight earlier models/evaluation lessons changed
  only these two metadata fields; four preprocessing lessons also use them.
  A first complete check exposed JSON-inferred catalog types incorrectly
  requiring localized fields on old curated content. The catalog type now
  explicitly keeps these fields optional; no unsafe fixture cast was added.
- Patched only transitive dev/build dependency `source-map-js` from 1.2.1 to
  1.2.2 in the lockfile, using `--ignore-scripts --no-audit`. Its advisory is
  [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
  `package.json` is unchanged; no new top-level dependency was introduced.

### Fresh verification

- `npm test`: final exit 0, 477 Python tests (78.39s), 309 Vitest tests in
  48 files (9.53s), fingerprint/content validation, lint, TypeScript and Vite
  build. The earlier run passed tests but failed TypeScript; the final run
  above was after correcting the optional catalog fields.
- Thirty-five independent preprocessing checks run standalone examples,
  compare documented stdout, test known numerical results, frozen training
  state, unknown/missing categories, constant columns and time boundaries.
- Twenty-six real HTTP tests plus one quoted-index restart regression use
  disposable data. No real notes or learner history are fixtures.
- Full local Playwright: 60 passed, exit 0, 3.2 minutes, one worker and repo
  venv Python in PATH. This includes VI/EN real-API checks for all 12 lessons,
  navigation, recovery, interactions, localization, themes and responsive UI.
- Hosted production-build Classical ML Playwright: two passed, exit 0,
  39.8s, covering 12 lessons in VI/EN at 390/1440px, light/dark, keyboard answer
  disclosure, outputs, setup localization, contrast and overflow. Synthetic
  Auth rejects local API calls, unexpected writes and real external requests.
- Root inspected fresh mobile Vietnamese dark categorical output, desktop
  English feature recall and mobile Vietnamese localized setup screenshots.
  Artifacts remain ignored under `.build/models-lesson-evidence/`.
- Catalog comparison: all 208 lesson identities and review IDs/types retained;
  12 changed and 196 identical records. The eight older lessons only gained
  localized setup. No progress schema migration was needed.
- `npm audit --json`: exit 0, zero advisories, including dev dependencies.
  `python -m pip check`: exit 0, no broken requirements. This is not a Python
  vulnerability scan; no Python advisory scanner was installed or run.

### Remaining scope and limits

The passive source scan still reports 31 manual-review flags. Triage found
18 marker-based auth flags (the scanner does not recognize the local guard),
seven body-model flags on bodyless commands, and six f-string SQL sites using
fixed identifiers/fragments with request values bound separately. This bounded
inspection is not proof the entire API is secure; scanner rules were not
weakened to hide flags. See [Host validation](https://fastapi.tiangolo.com/advanced/middleware/#trustedhostmiddleware)
and [SQLite PRAGMA functions](https://www.sqlite.org/pragma.html#pragma_index_info)
for the boundary and parameterization approaches.

After curated overrides, 179 of 208 lessons still contain a generic English
recall rubric; this triage count does not imply all their concepts are wrong.
Other pending work includes content review, hosted payload size, existing
AuthProvider lint warnings and production admin RPC hardening. No real-account
acceptance, physical-device inspection, packaged-executable rebuild, production
database change, new commit, push or deploy was performed in this batch.

### Publication verification after user confirmation

The user confirmed commit and push for
`fix(learning): harden local access and improve preprocessing lessons` to
`origin/main` at `https://github.com/Hzyl/JourneyAIEngineer.git`.
No catalog-loading implementation or analysis-module lesson rewrite was saved
by the interrupted follow-up tasks, so neither is included in this release.

Fresh checks on 2026-10-16 before publication:

- `npm test`: exit 0; 477 Python tests, 309 Vitest tests in 48 files,
  content/fingerprint validation, lint, TypeScript and production build passed.
- `npx playwright test tests/e2e/lesson-code-setup.spec.ts --workers=1`:
  two passed, exit 0, real local API and all 12 lesson pages in VI/EN.
  Root inspected the refreshed mobile setup screenshots in both languages.
- Catalog comparison again preserved all 208 lesson IDs and review IDs/types;
  exactly 12 records changed. The source secret scan checked 780 files without
  finding a supported secret marker. The staged diff passed whitespace checks.
- Full hosted production browser verification: 64 passed, exit 0 in 3.9
  minutes, using synthetic Supabase settings. The run used an elevated runner
  after sandbox artifact/process restrictions; no package installation or
  source change was needed. The result file was updated at 16:58:43 local time.
- The sandbox initially redirected temporary files and the browser cache to
  inaccessible or absent paths. Runner-scoped `.build` temp directories and
  the already installed Chromium resolved these environment failures without
  installing packages or changing source. Local Playwright passed its cases
  but needed elevated cleanup of its two verified test-server PIDs to finish.

Only the 27 reviewed files are selected for publication. The six existing
`outputs/ai-engineer-learning-roadmap/` artifacts remain untracked. Supabase
production, real user accounts and learner data are unchanged. The full-system
audit remains open with the limitations listed above.
