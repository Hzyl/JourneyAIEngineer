# Absolute 24-hour hosted sessions

User requirement: a login lasts 24 hours, including time spent with the tab closed.
Token refresh, reload and another device's login must not extend that deadline.
Desktop SQLite mode has no hosted login and remains independent.

## Design

Use the server-owned `auth.sessions.created_at`, matched to the signed JWT's
`session_id` and `auth.uid()`. The deadline is creation plus 24 hours, shortened by
`not_after` when present. Missing or revoked sessions fail closed. A narrow private
SQL helper reads only the current caller's session; no session table is exposed.

A read-only RPC supplies the current deadline and server time to the frontend.
The provider checks it before showing personal content, arms an expiry timer,
and rechecks after token changes, tab focus and visibility changes. Expiry hides
personal content, clears the current device's session and explains how to sign in
again. Network errors use the existing retry screen instead of admitting a session
whose lifetime could not be verified. Database restrictive policies enforce the
same deadline for all nine learning tables, including writes through invoker RPCs.
Account deletion also checks the original caller's session before reauthentication.

This keeps the Free plan. It limits access to Journey's private data; it does not
configure Supabase Pro time-boxed Auth sessions or change JWT token lifetime.
Browser checks are UX controls; database checks are the authorization boundary.

## Verification and rollout

Test the exact 24-hour boundary, refreshed tokens, old stored sessions, missing or
revoked session IDs, two owners, multiple sessions for one owner, a sleeping tab,
failed RPC reads, late replies and local mode. Use synthetic local data only.
Production rollout requires the migration before the frontend and updated deletion
function. Keep the original per-user policies and account records intact.

## Verified locally — 2026-10-08

- 210 frontend unit tests passed, including 20 provider/session tests. Timer tests
  advance the clock; nobody needed to wait a day to verify the boundary.
- 148 pgTAP assertions passed on a new disposable local Supabase stack. The 20 new
  assertions cover the deadline, reads/writes/exports, missing/revoked/foreign
  sessions, earlier `not_after`, privileges and all nine restrictive policies.
- 17 real Auth/REST checks passed: password login, refresh, an aged session rejected
  even with a newly refreshed JWT, another device remaining active and two-user
  isolation. 23 deletion checks passed, including rejection of an expired original
  session before password reauthentication and cleanup of synthetic users.
- Concurrent review writes and idempotent retries passed with real session fixtures.
- All 28 production-build browser tests passed. New VI/EN cases verify that expired
  restored sessions never request private data, local session storage is removed,
  reload stays signed out and the expiry notice is readable in both themes at 390px.
  Vietnamese light/dark screenshots were inspected after correcting notice layout.
- TypeScript, lint, production build, the supported secret-marker scanner and diff
  whitespace checks passed. Existing Fast Refresh and large-chunk warnings remain.

Commands for the additional real local checks:

```text
python scripts/test_local_session_lifetime.py --workdir .build/journey-readiness-session24
python scripts/test_local_account_deletion.py --workdir .build/journey-readiness-session24
```

The scripts reject cloud endpoints and require a matching disposable local project
on port 55321. Passwords and tokens remain in process memory and are not logged.
Tests use synthetic accounts and transaction rollbacks; no production user was changed.

## Production rollout — 2026-10-08

The maintainer approved the commit, push and production deployment. Migration
`20261008162049_limit_learning_sessions.sql` was applied to the existing Supabase
project before frontend publication. Its filename matches the version assigned by
Supabase MCP. The updated `delete-account` function is active as version 2.
Production metadata confirms nine restrictive session policies, RLS still enabled
on all nine tables, and the deadline RPC executable only by authenticated callers.

The migration adds policies/functions without deleting user data. Existing sessions
older than 24 hours need a new login. New frontend code fails closed if its deadline
RPC is unavailable, so frontend-first rollout is not supported. Frontend publication
uses the existing Cloudflare Pages integration on `main`; verify its deployment and
GitHub CI against the pushed commit before declaring the web rollout complete.

This change does not rebuild or replace the previous Windows release candidate.

References: [Supabase sessions](https://supabase.com/docs/guides/auth/sessions) and
[JWT claims](https://supabase.com/docs/guides/auth/jwt-fields).
