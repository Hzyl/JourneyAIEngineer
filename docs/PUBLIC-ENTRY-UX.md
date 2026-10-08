# Public entry and authentication UX

Date: 2026-10-08. Local implementation, not deployed.

## Scope and findings

Codex UI implemented a bounded pass using the existing UI/UX Pro Max and
Impeccable guidance. The current typography, themes and color tokens remain the
design source; no design runtime, library or external service was installed.

- High: English guests entered a Vietnamese-only authentication form. Sign-in,
  registration, resend, recovery and callback states now support both languages.
- Medium: sign-in state was detached from the URL. Guest entry now uses
  `/auth/sign-in?next=...`, with Back/Forward, reload and an in-page return action.
  A successful sign-in restores the validated same-origin learning destination
  before the personal app mounts. External and unsupported destinations fall back
  to home. Account switching still remounts private state.
- Medium: reload discarded guest language and selected learning direction.
  Language now persists in local storage; the roadmap direction lives in its URL.
  Public and personal screens update the document language for assistive technology.
- Medium: the roadmap page lacked a top-level heading and a direct learning action.
  It now identifies the current navigation item and opens the first sample lesson.
- Medium: authentication controls could switch modes while a request was pending.
  The form now locks mode changes and repeated submissions immediately, preserves
  failed input, and renders notices in the current language even after a switch.

## Layout and interaction

The existing two-panel auth layout is retained. Tablet columns can shrink without
clipping. On narrow screens the introductory heading is smaller, form buttons use
15px text and password visibility buttons have 44px targets. Navigation wraps at
small widths. The account mode controls use a native button group with pressed
state instead of incomplete tab semantics.

Error/confirmation text is stored as a message kind and rendered in the active
language. Login/recovery messages do not identify whether an email has an account.
Callback pages do not echo provider error descriptions; expired links offer a
working route back to sign-in. Invalid callback errors do not auto-redirect merely
because an unrelated session is already signed in.

## Evidence

- 138 frontend unit tests passed. New coverage includes pending duplicate guards,
  resend destinations, language changes with retained input/notices, recovery
  privacy copy, invalid lesson URLs and safe post-login destinations.
- All 22 hosted production-build Playwright tests passed with synthetic Supabase
  configuration. This includes four new public-entry/callback scenarios and the
  existing guest load budget, lazy loading, solution downloads and cloud export.
- Two focused local settings/portfolio browser scenarios passed after synchronizing
  the personal document language. No Python code changed in this UI follow-up.
- Production build, final TypeScript check, lint and diff whitespace check passed.
  The existing AuthProvider Fast Refresh and large hosted-client chunk warnings remain.
- VI/EN screenshots and contrast/overflow checks cover 1440, 820, 390 and 320px in
  both themes. Images are under `.build/public-entry-evidence/`; the English dark
  mobile form and Vietnamese light tablet form were visually inspected. The final
  mobile image confirms the smaller introduction and larger action text.

Two existing test assumptions were corrected: guest language now survives reload,
and the return button moved into an auth toolbar. Multi-page exercise checks select
language explicitly; the dedicated entry test verifies actual switching/persistence.

## Remaining gates

The email redirect now includes the requested `lang`; recovery also keeps its
`mode=recovery` parameter. Confirmation, resend and password-reset delivery,
redirect allowlisting and real session transitions still need approved deployed
acceptance with disposable accounts. Synthetic tests do not prove those outcomes.
No Supabase settings, credentials, migrations, public hosting or Git history changed.
The broader UI audit and public release checklist remain open.
