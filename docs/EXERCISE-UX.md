# Exercise reading experience

## Scope and direction

The public `/exercises` route and the signed-in/local exercise views share a compact catalogue and an in-page exercise reader. Reading a task no longer sends learners to GitHub. Cards show a brief summary; search, difficulty filtering and progressive loading keep the catalogue manageable.

The reader separates requirements, walkthrough, self-checks, optional hints and setup. Fourteen exercises have individually written Vietnamese and English walkthroughs and examples: three introductory exercises, all five software foundation labs, four math labs, ML framing and Core models. The other 38 labs retain their own task and checkpoint with a common four-step practice workflow; they do not yet have individually authored walkthroughs.

Starter and test downloads contain only authored template files. Fourteen authored reference solutions are bundled for a collapsed, opt-in reader with bilingual explanations, common mistakes and follow-up practice. Answers are not rendered until the learner opens them; this is spoiler prevention, not access control. Learner workspaces are never bundled. The hosted reader does not execute code or invoke local APIs; desktop workspace actions remain available in the local app.

The five foundation lab examples each include five runnable standard-library tests and file downloads. The Python core example explains its package directory layout; browsers download individual basenames, so learners create the documented folder themselves. Additional files stay collapsed until selected. These examples illustrate one solution to each open-ended lab; the labs remain self-assessed and do not acquire verified-completion status.

Developer workflow uses a loopback mock API and explicit manual Git steps in a dedicated learner folder. Tests cover HTTP/JSON/schema failures, timeout propagation, output preservation, repeatability and CLI exit codes; they do not execute Git commits or certify manual recovery. SQL uses an in-memory SQLite learning log, compares LEFT JOIN aggregation with SQL aggregation plus Python dictionary lookup, and covers empty weeks, same-name learners, equal-duration sessions, foreign keys and year boundaries. Neither lab needs Supabase, Docker or a paid API.

Math labs cover NumPy/PCA, analytic and numerical gradients plus PyTorch autograd, Bernoulli sampling and conditional probabilities, and sample-wise SGD/momentum/Adam. Downloaded requirements files are included in the content fingerprint. The separate 2026-10-08 verification record reports all 20 tests and four plots passed in the approved isolated environment; see [MATH-SOLUTION-VERIFICATION.md](MATH-SOLUTION-VERIFICATION.md). Those results were not rerun as part of the Core models change.

The ML framing example adds an in-page data dictionary and leakage table, with maturity-aware chronological splits, a majority baseline and explicitly withheld test metrics. See [ML-FRAMING-SOLUTION.md](ML-FRAMING-SOLUTION.md) for evidence and teaching limits.

Core models adds a reproducible four-model comparison, real error examples, timing and complexity tradeoffs. It runs with standard-library Python and retains an explicit test-score reveal. See [CORE-MODELS-SOLUTION.md](CORE-MODELS-SOLUTION.md).

## Design and accessibility

- Owner: Codex UI; existing design refined with UI/UX Pro Max and Impeccable guidance.
- Existing project typography, color tokens, themes and interaction feedback are reused; no new theme payload or external design runtime.
- Two columns of short cards on desktop, one on mobile. Detail content precedes setup on narrow screens.
- Native controls, keyboard operation, detail-heading focus and focus restoration when returning to the list.
- Shareable exercise URLs and browser history support.
- Task prose is rendered without raw HTML. Long code examples scroll; the test command wraps inside its panel.

## Verification

The bullets below describe earlier reader checkpoints. The latest Core models
slice passed 219 frontend unit tests, eight Python integration checks and four
targeted production-browser tests; its own downloadable suite has 11 tests.
See the Core models record for scope. Manual checks are consolidated in
[ACCEPTANCE-BATCH.md](ACCEPTANCE-BATCH.md).

Node/npm, existing Playwright configuration and Chromium were available. No additional tools were installed.

- The latest frontend suite passed 71 unit tests, including solution disclosure, language changes, reset when selecting another exercise, multi-file downloads and all five software foundation labs retaining self-assessment status.
- 16 production-browser tests passed, including Vietnamese/English exercise reading and file downloads without local API calls. Dedicated workflow/SQL/math checks cover downloaded contents and mobile overflow/contrast.
- All 24 local E2E tests passed after the reader, resource/tool localization and feedback follow-up. The 16 production-browser tests were repeated successfully after the ML framing extension, using synthetic hosted settings.
- Production build passed. Lint passed with one existing Fast Refresh warning.
- Browser checks cover 1440px and 390px, light/dark themes, contrast, keyboard navigation, filtering, browser history and downloaded starter content.
- Local screenshots: `.build/exercise-guide-evidence/` (ignored generated output).
- Solution follow-up: both hosted exercise E2E tests passed with Enter/Space disclosure checks and light/dark screenshots of the expanded answer at both viewport widths.
- All three Python template tests passed: reference answers pass their exercise tests, while unfinished starters and unrelated answers are rejected.
- The full Python suite passed (66 tests). Seven integration checks copy six standard-library examples into fresh folders, run their 31 embedded tests without third-party packages and verify that the regression test detects the intentionally buggy implementation. CSV tests cover Windows line endings, Unicode, quoted multiline records and repeatable CLI output. Requirements-file fingerprint coverage includes line-ending equivalence.

## Limits and publication

### Solution navigation follow-up

- Added a bilingual solution shortcut at the top of the exercise reader. Following it focuses the solution section without revealing the answer.
- Public page navigation no longer steals focus from same-page anchors. Selecting another exercise clears the previous section hash.
- Verification: 15 focused exercise unit tests and 10 production-browser exercise/public-navigation tests passed. TypeScript and lint passed with the existing AuthProvider Fast Refresh warning; the production build retains its bundle-size warning.

The common workflow for the remaining 38 labs should be replaced incrementally with exercise-specific explanations and examples. Existing production bundle-size warnings remain. The local Core models checks do not verify live Supabase or a Cloudflare deployment.

The 38 labs without authored solutions display an explicit unavailable message. There is no completion or sign-in gate for viewing an available solution, and opening one does not mark the exercise complete.

The Core models extension is local and has not been committed, pushed or deployed. Earlier reader functionality has already shipped; this note does not roll back that status. Commit/push authorization is required for publishing the new extension.
