# Pending public-readiness release

Read-only follow-up on 2026-10-08 confirms GitHub `main` at `94d3be8`.
Cloudflare's GitHub check reports successful deployment
`13510298-de1b-48a2-a53d-9e1005a95ca6` for that exact commit, with preview
`https://13510298.journeyaiengineer.pages.dev`. Direct HTTP inspection returned 403,
but the subsequent browser inspection loaded both that preview and the main site
`https://journeyaiengineer.pages.dev`, showing the public learning page. This proves
those pages are reachable in the browser, not authenticated acceptance or an exact
production-alias-to-deployment mapping. Confirm the mapping in Cloudflare before rollback.

The in-page exercise reader, solutions and workflow improvements remain local.
GitHub run `37636393815` passed `quality` but failed `hosted-database` at the
regenerated-types diff: `learning_mutations` and two RPCs were missing. The local
candidate now includes the generated definitions and passes an exact regeneration
comparison. The remote CI check has not been rerun on this unpublished candidate.

The package version remains 0.1.2, an existing release; select a new version before
publishing new assets. The approved backend rollout completed on 2026-10-08:
six migrations are applied, nine public tables have RLS, and `delete-account`
version 1 is ACTIVE. Ten non-destructive live HTTP checks passed. See the
[rollout report](BACKEND-ROLLOUT.md) for exact scope and remaining acceptance.
See `PUBLIC-READINESS-IMPLEMENTATION.md` for evidence and outstanding checks.
The [review packet](RELEASE-REVIEW-PACKET.md) records the exact candidate source,
backend files and the order of approval, verification and rollback. Older packets
are historical snapshots; check the rollout report before applying any migration.

## Supabase MCP and Docker have different jobs

The deployed beta uses Supabase project `tnnlpsecrzatxdpoaagw`. MCP is connected and
was used for project URL, migration, schema and advisor inspection, and the approved
Edge Function deployment. The CLI applied the approved versioned migrations.
The browser talks to hosted Supabase directly; neither learners nor the hosted app need Docker.
The desktop app uses SQLite and also does not need Docker.

Docker supplies a disposable local Postgres/Supabase test database. Tests create two fake
users, attempt cross-user access, retry mutations, race concurrent requests and roll back
fixtures. Never point those tests or `db reset` at the deployed project. A separate staging
project is an alternative, but must be explicitly provisioned/approved before use.

The maintainer confirmed on 2026-10-08 that the existing project remains the
deployment destination under the Free-plan goal. A separate cloud staging project
is optional. Complete disposable tests locally or in CI, and obtain approval for
the concrete production migration/function changes and disposable-account checks.

## Additive database and function rollout

Following backup verification and explicit approval, the four migrations below were
applied on 2026-10-08 in addition to `20261006000100` and `20261006000200`.
MCP confirmed the resulting schema and the same destination project:

1. `20261007000100_serialize_review_activation.sql`: lock a user's first review and require learned content.
2. `20261007000200_idempotent_learning_writes.sql`: receipt table and transactional mutation RPC.
3. `20261007000300_export_learning_snapshot.sql`: owner-only snapshot export in one SQL statement.
4. `20261007000400_restrict_rls_trigger_execution.sql`: remove client EXECUTE permission on
   the platform event-trigger function when present; preserve its body and event trigger.

Local SQL/type generation checks pass (see `DATABASE-ACCEPTANCE.md`). The production
rollout followed the verified backup and local rehearsal. Do not run a reset against
production. Reconfirm backend compatibility before promoting a later frontend.

The approved `delete-account` deployment and environment setup are complete:

- `ALLOWED_ORIGINS` is `https://journeyaiengineer.pages.dev`; live checks confirmed
  that exact origin and rejection of other origins. Add previews only when approved.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` stay in the server
  function environment. Never copy the service key into a Vite variable or browser bundle.
- Gateway `verify_jwt=false` is intentional: the handler validates the bearer token with
  Auth `getUser`, reauthenticates the password, checks the same user ID and then deletes
  that verified ID. Do not remove this application-level authentication.
- The flow requires typing DELETE, refuses verified MFA accounts until an MFA-aware
  implementation exists, and returns generic failures without leaking provider details.
- Test a disposable account's deletion, all learning-row cascades and sign-out before launch.
  Local Auth/Edge acceptance passed with two synthetic accounts and full cleanup.
  This does not prove deployed Auth/browser behavior; no production account was deleted.
- The request reader now enforces an 8192-byte streamed body limit and strict UTF-8;
  [input verification](EDGE-INPUT-VALIDATION.md) covers Node Web Streams behavior.
  Local Deno entrypoint/Auth acceptance and live malformed-input checks passed;
  successful authenticated deletion and browser sign-out still need acceptance.

The security advisor still reports leaked-password protection disabled. Supabase's
[password security documentation](https://supabase.com/docs/guides/auth/password-security)
limits this feature to Pro and above. The maintainer's Free-plan choice remains in
force; record the limitation without claiming it is enabled or changing billing.
Migration 004 removed the separate event-trigger EXECUTE grants; MCP confirmed
anon/authenticated denial and the preserved event trigger. That advisor finding cleared.

For Free-plan projects, Supabase recommends regular CLI exports in its
[backup documentation](https://supabase.com/docs/guides/platform/backups).
An authorized production backup was exported and restored locally on 2026-10-08.
The existing CLI connection worked without requesting a password in chat.
Seven SQL components and their checksums are stored outside the repository in a
restricted local backup directory. All 42 data blocks and one sequence matched;
the four rollout migrations also passed on the restored copy without changing
existing rows. See [database acceptance](DATABASE-ACCEPTANCE.md).

The CLI omits platform event triggers, so `ensure_rls` was captured separately and
verified with its original owner, function body and enabled state. The test container
and its anonymous volume were removed. This verifies database restoration, not all
Supabase service configuration, credentials, email behavior or a production rollout.
That backup captured the two original migrations before rollout. Subsequent approved
deployment and post-deployment checks are recorded in `BACKEND-ROLLOUT.md`.

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
