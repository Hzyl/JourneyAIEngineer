# Pending public-readiness release

Status as of 2026-10-07: readiness commit `29b6baf` and theme commit `5e0e34a`
are on `origin/main` (remote head verified). Interaction feedback and Journal VI/EN
follow-up changes remain local. Cloudflare deployment and production migrations have
not been reverified after those pushes. The package version is still 0.1.2, an
existing release; select a new version before publishing new assets.
See `PUBLIC-READINESS-IMPLEMENTATION.md` for evidence and outstanding checks.

## Supabase MCP and Docker have different jobs

The deployed beta uses Supabase project `tnnlpsecrzatxdpoaagw`. MCP is connected and
was used for read-only project URL, migration, schema and advisor inspection.
The browser talks to hosted Supabase directly; neither learners nor the hosted app need Docker.
The desktop app uses SQLite and also does not need Docker.

Docker supplies a disposable local Postgres/Supabase test database. Tests create two fake
users, attempt cross-user access, retry mutations, race concurrent requests and roll back
fixtures. Never point those tests or `db reset` at the deployed project. A separate staging
project is an alternative, but must be explicitly provisioned/approved before use.

## Additive database and function rollout

Live MCP inspection on 2026-10-07 showed only `20261006000100` and `20261006000200` applied.
Review these four pending migrations, in order:

1. `20261007000100_serialize_review_activation.sql`: lock a user's first review and require learned content.
2. `20261007000200_idempotent_learning_writes.sql`: receipt table and transactional mutation RPC.
3. `20261007000300_export_learning_snapshot.sql`: owner-only snapshot export in one SQL statement.
4. `20261007000400_restrict_rls_trigger_execution.sql`: remove client EXECUTE permission on
   the platform event-trigger function when present; preserve its body and event trigger.

Before rollout, finish local SQL/type generation checks, back up the destination and review
the exact migration diff. Do not run a reset against production. Apply migrations before
deploying the frontend that calls the new RPCs.

The `delete-account` Edge Function also needs a separate deployment and environment setup:

- Set `ALLOWED_ORIGINS` to the exact approved HTTPS frontend origins, comma-separated.
  Do not use `*`; add preview origins only when intentionally testing that preview.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` stay in the server
  function environment. Never copy the service key into a Vite variable or browser bundle.
- Gateway `verify_jwt=false` is intentional: the handler validates the bearer token with
  Auth `getUser`, reauthenticates the password, checks the same user ID and then deletes
  that verified ID. Do not remove this application-level authentication.
- The flow requires typing DELETE, refuses verified MFA accounts until an MFA-aware
  implementation exists, and returns generic failures without leaking provider details.
- Test a disposable account's deletion, all learning-row cascades and sign-out before launch.
  Handler unit tests alone do not prove deployed Auth behavior. No real account was deleted
  during this implementation.

The security advisor also reported leaked-password protection disabled. Review the project's
available plan/settings and obtain approval before changing authentication or billing settings.

## Release order and rollback

1. Complete outstanding checks and select a new app/catalog version together.
2. Build into a fresh output directory; verify Windows/source ZIP checksums and source manifest.
3. Show the exact commit message and `origin/main` target for maintainer consent.
   With Cloudflare Git integration enabled, pushing main may also deploy the frontend.
4. Coordinate approved DB/function setup before that frontend deployment. Verify email
   confirmation/resend/reset, two-user isolation, learning persistence, export and deletion.
5. Inspect the deployed commit and collect a real learner pilot before broad promotion.

If the frontend fails, restore the last successful Cloudflare deployment. Additive tables
and receipts can remain: do not drop them as a frontend rollback. Restore an affected database
from a reviewed backup only through a separately approved recovery procedure. If deletion
fails, keep the account/data intact, show the error and provide a private support route.
No public support address is invented here; publishing one remains a maintainer task.

Cloud export is a private JSON snapshot, not an automatic sync or cloud-to-SQLite import.
Do not promise backup retention expiry or instantaneous JWT invalidation without verifying
the deployed provider behavior and retention policy.
