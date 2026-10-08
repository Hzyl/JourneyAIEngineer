# Public learning UI acceptance

Checkpoint: 2026-10-08. Implementation and local browser acceptance for stage B
of the public-readiness plan. This is not a deployment or an accessibility certification.

## Requirement evidence

| Stage B requirement | Implementation and verification |
| --- | --- |
| Accessible colors | Shared semantic light/dark tokens, visible keyboard outlines, readable notices and pending controls. `theme.spec.ts` checks the eleven personal-app routes; hosted learning tests cover landing, roadmap, lesson and auth. Focused route tests cover expanded, failed and pending states. |
| Readable type and simpler lesson layout | Shared lesson reader presents an ordered, single reading column with section navigation and separate notes/progress actions. Long prose/code wrap or scroll within their panel. Exercise cards lead into an in-page guide with opt-in solutions. Toolkit prose is 15px, labels 14px and commands 13px; narrow cards reserve the width for text. |
| Main-flow Vietnamese/English | Localized controls, validation, receipts, failure/retry and empty states across the flows below. Auth and public navigation preserve language. Learner-authored text, filenames and code remain unchanged. Unreviewed lessons and missing worked solutions remain explicitly labelled. |
| Responsive and keyboard operation | Native form submission/disclosures; mobile drawer focus trap, Escape and focus return; search arrow navigation; lesson section anchors; keyboard retry; disabled duplicate submissions and preserved drafts. Desktop/mobile layout checks include 1440px and 390px, with 320px checks for navigation, security and recovery. |
| Screenshots and interactive verification | Current local and production-hosted browser suites pass. Route reports retain screenshot locations and the inspected states. Fresh workspace screenshots were inspected before and after the toolkit typography adjustment. |

## Main-flow coverage

Paths in the test column are under `tests/e2e/`. Each evidence report describes
the actual assertions and its limits; a passing test is not a claim that every
possible account state or assistive technology was exercised.

| Flow | Browser evidence | Detailed record |
| --- | --- | --- |
| Guest entry, routes, language, auth forms | `hosted-public-navigation`, `hosted-learning-flow`, `guest-load.production` | [Public entry](PUBLIC-ENTRY-UX.md) |
| Today, study sessions, roadmap filters | `today-roadmap`, `learning-flow` | [Today and roadmap](TODAY-ROADMAP-UX.md) |
| Lesson reading, notes, progress, deep links | `lesson-language`, `lesson-recovery`, `interaction-feedback` | [Lesson](LESSON-UX.md), [recovery](LESSON-RECOVERY-UX.md) |
| Recall, reveal, rating, review activity | `review-language`, `theme` | [Review](REVIEW-UX.md) |
| Exercise catalogue, guide, optional solutions, downloads | `exercise-language`, `hosted-exercises`, `hosted-framing` | [Exercises](EXERCISE-UX.md) |
| Resource filters and toolkit instructions | `resources-language`, `tools-language` | Implementation-plan resource/tool follow-ups |
| Search selection and obsolete results | `global-search` | [Search](SEARCH-UX.md) |
| Community feedback, filters and failures | `community-language` | [Feedback](FEEDBACK-UX.md) |
| Journal editing, context and clipboard failure | `journal-language`, `interaction-feedback` | Implementation-plan Journal follow-up |
| Settings, weekly goals and portfolio requirements | `settings-portfolio`, `workspace-recovery` | [Settings/portfolio](SETTINGS-PORTFOLIO-UX.md) |
| Local backup and cloud export UI | `backup-restore`, `hosted-cloud-export` | [Backup/export](BACKUP-UX.md) |
| Account deletion and sign-out UI | `hosted-delete-account`, `hosted-signout` | [Deletion](ACCOUNT-DELETION-UX.md), [session](SESSION-RECOVERY-UX.md) |
| Mobile navigation and route recovery | `mobile-navigation`, `lesson-recovery` | [Navigation](APP-NAVIGATION-UX.md) |
| Local passive Security Lab | `security-language` | [Security Lab](SECURITY-LAB-UX.md) |
| Workspace failures and language/save races | `workspace-recovery` | [Workspace recovery](WORKSPACE-RECOVERY-UX.md) |

## Current verification and limits

- The current scoped unit suite passes **202 tests in 38 files**. The UI checkpoint
  passed **54 local browser tests** and **26 hosted production-build browser tests**.
  The earlier 371-unit-test report included extracted snapshot copies and was not
  a count of unique current tests; see [CI/source checks](CI-SOURCE-RELEASE-CHECKS.md).
  Lint, TypeScript
  and Vite build passed with the known Fast Refresh and bundle-size warnings.
- After the final toolkit CSS adjustment, all eight tool/workspace browser cases
  passed again, including light/dark and 320px checks. No application logic changed
  after the full-suite checkpoint.
- The contrast helper measures rendered text against solid/gradient-derived
  backgrounds and checks document overflow. It is a regression guard, not a full
  WCAG audit. Normal disabled controls are excluded; busy controls are checked.
- Browser acceptance uses Chromium on this development machine with isolated local
  data and synthetic hosted responses. Physical mobile, screen-reader, cross-browser
  and clean-machine Windows acceptance are not established by these results.
- The initial personal shell defaults to Vietnamese until settings load. Public
  language URLs remain independent. There is no new offline workspace cache.
- UI acceptance does not prove live Auth emails, RLS, deletion cascades, migrations,
  Edge Function deployment or a real learner pilot. Those stage C/D gates stay open.
- Source edits are uncommitted and unpublished. Existing source ZIPs are dated
  snapshots and must be rebuilt for an approved release containing these changes.
