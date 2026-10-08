# Session recovery and sign-out feedback

## Scope — 2026-10-08

Route: `codex-ui`. This is a bounded correction to the existing authentication
flow, with no visual concept change or external handoff. No installation or
production change was required.

Previously, an initial `getSession()` rejection could leave the app on its loading
screen. Its returned error was also ignored. The provider now exposes a recovery
state with localized instructions, heading focus and a retry action that preserves
the current URL. Repeated same-tick retries start only one read. A newer auth event
takes precedence over a late startup result, including a late failure or a session
snapshot belonging to an account that has since signed out.

The topbar sign-out control now shows progress and prevents duplicate requests.
Failures that leave the personal screen mounted show a generic, localized retry
message without raw provider details. Responses after unmounting do not update the
old control. The existing SDK default logout scope (`global`) is unchanged.

## Evidence

- All 174 frontend unit tests passed. The twelve session tests cover startup
  returned/rejected errors, retry deduplication, newer auth events, unmounting,
  local mode, sign-out failures, late results and Vietnamese recovery copy.
- A route test verifies that a session error mounts recovery rather than silently
  displaying guest or private content, and retains the requested lesson URL.
- All 26 production-build browser tests passed, including two new bilingual
  sign-out scenarios with the installed Supabase SDK and intercepted requests.
- Five focused local browser tests passed: the existing learning flow and
  Vietnamese/English mobile navigation. No full local-suite rerun is claimed.
- TypeScript and production build passed. Lint retains only the existing
  AuthProvider Fast Refresh warning; the existing large hosted-client bundle
  warning also remains. The diff whitespace check passed.
- Sign-out screenshots cover 1440px, 390px and 320px in light/dark themes, with
  contrast and overflow checks. The English dark 320px screenshot was visually
  inspected. Images are ignored under `.build/session-evidence/`.

## Boundaries

The installed Auth SDK removes the local session even after the mocked logout
endpoint returns HTTP 500. Browser tests verify that the personal app disappears,
the public screen opens, session storage is removed and no uncaught page error is
raised. Unit tests separately model failures where the session remains available
and the retry control stays visible.

Startup error handling is verified at the provider/route boundary with controlled
SDK results, not by claiming a real Supabase outage. Tests use synthetic accounts;
no real account was signed out or deleted. This does not establish deployed email,
database, cross-device token revocation or physical-device accessibility behavior.
The outstanding staging, Windows and publication gates remain open.
