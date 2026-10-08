# Account deletion UX verification

## Changes

The personal web settings require the current password and exact `DELETE`
confirmation. Pending submission disables the form and blocks duplicate clicks.
Cancel clears sensitive input and returns focus to the opener. Labels, progress
and recoverable errors follow the selected Vietnamese or English language.

The client verifies that the session still belongs to the account that opened the
form, then sends its current access token. Account changes and unmounting retire
pending UI updates. A response from an old account cannot trigger logout of the
replacement account. Same-account token refresh remains supported. The existing
server handler independently verifies the token, password and deletion target.

After confirmed deletion, a cleanup retry only retries logout; it does not submit
another deletion. Password and confirmation are cleared. These guards do not undo
a deletion already accepted by the server when someone leaves the page.

## Verification — 2026-10-08

- All 161 frontend unit tests passed, including ten deletion UI cases and three
  existing server-handler cases. Coverage includes duplicate clicks, stale account
  responses, session mismatch, unmounting, refreshed tokens and cleanup retry.
- All 24 production-build browser tests passed. Two bilingual deletion scenarios
  use synthetic sessions and intercepted requests, exercise failure/retry and
  pending/success states, and check desktop/mobile light/dark layouts.
- TypeScript, lint and production build passed. The existing AuthProvider Fast
  Refresh lint warning and hosted-client bundle-size warning remain.
- Screenshots are in `.build/delete-account-evidence/` (ignored). The Vietnamese
  dark-mode 320px view was visually inspected; the browser checks also cover 390px
  and 1440px widths, text contrast and horizontal overflow.

The first browser expectation was corrected against the installed Supabase Auth
SDK: a logout HTTP 500 can still remove the local session. The browser test now
verifies the resulting public screen and exactly one logout request. The unit
test separately covers a cleanup failure where a session remains and retry is
available. Neither test weakens the requirement against duplicate deletion.

## External checks still needed

No real account was deleted. No Edge function, migration or auth setting was
deployed or changed. Read-only Supabase inspection returned no project branches
and only migrations `20261006000100` and `20261006000200`. This is a snapshot, not
proof that another separate staging project does not exist.

The cloud deletion/export release gate remains open pending approved isolated
database and deployed-function verification, including two-account boundaries
and deletion cascades. These frontend tests do not certify live database behavior,
real email delivery, physical devices or screen-reader acceptance.
