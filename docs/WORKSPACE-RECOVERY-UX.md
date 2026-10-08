# Workspace loading and preference recovery

Date: 2026-10-08. Local implementation; not published.

## Behavior

The personal app uses `useWorkspaceData` for its shared dashboard, catalog and
preferences. A refresh that started before a successful preference write can no
longer restore the old language. Only the latest workspace read may publish its
result or failure, and responses arriving after unmount are ignored. Manual
reloads are deduplicated; a refresh after a saved learning action can supersede
an older in-flight read.

Settings and the topbar language toggle share one write lock. While either saves,
the other controls are disabled and pending feedback is visible. Switching
language retains an edited weekly goal. A failed language change keeps the
current language; its Retry action repeats the preference write rather than
merely reading the old settings again.

An initial workspace load failure displays a recovery message instead of an
apparently empty catalog. A failed refresh retains the previous content and
explicitly labels it as previously loaded data. The current lesson's error is
independent of the general workspace refresh. Retry targets the error currently
shown, with lesson, language and workspace failures in that order.

Settings errors use fixed bilingual text and follow later language changes.
Provider error details are not rendered. Typed weekly minutes survive a failed
save and remain available for retry. Existing theme tokens and controls are used;
no new design runtime, library or service was introduced.

## Verification

- The original browser reproduction failed: an older Vietnamese settings read
  overwrote a newly saved English preference. It passes with the shared loader.
- Nine loader unit cases cover obsolete successes/failures, preference races,
  duplicate reloads, initial/refresh failures, actual language retry and unmount.
- Two settings regressions verify translated generic errors and the shared lock
  preserving an unsaved weekly goal. The nine workspace and eleven settings cases
  pass in the scoped current-checkout suite.
- Twelve focused local browser tests passed across workspace, lesson recovery and
  settings/portfolio. Six workspace scenarios cover the reproduced race, initial
  outage, previous-content recovery and VI/EN language retry with pending controls.
- The current scoped suite passes 202 unit tests; all 26 hosted production-build
  browser tests passed at the UI checkpoint. The earlier 371 full / 29 focused
  unit totals included extracted snapshot copies, not just current tests. See
  [the discovery correction](CI-SOURCE-RELEASE-CHECKS.md). TypeScript, lint and
  Vite production build passed; the existing
  AuthProvider Fast Refresh and hosted bundle-size warnings remain.
- The full local browser suite passed all 54 tests, including the existing
  learning, review, backup, notes, exercise, search, navigation and theme flows.
- Screenshot/contrast/overflow checks cover light/dark themes, 320px, 390px and
  1440px. Keyboard retry uses Enter. The initial light/320 failure, English
  dark/320 retained-content state and Vietnamese light/320 pending settings
  screenshots were visually inspected in `.build/workspace-recovery-evidence/`.
- That inspection exposed small toolkit prose. It now uses 15px body text, 14px
  labels and 13px commands, with more reading width below 600px. All eight focused
  toolkit/workspace browser tests passed after the CSS change, and the English
  dark/320 retained-content screenshot was inspected again.

## Boundaries

Browser settings writes and outages are intercepted; the backend uses isolated
test data. The hosted checks use synthetic cloud responses. None of these tests
establish live Supabase, email delivery, Cloudflare deployment or clean-machine
Windows acceptance. Network requests are retired from UI state, not physically
cancelled, and an offline reload cannot recover an uncached workspace.

Until a first settings snapshot loads, the personal shell defaults to Vietnamese.
This change does not add persistent caching or replace the public language URL
behavior. No production data, authentication setting, dependency installation,
commit, push or deployment is included. The broader release plan remains active.
