# Pending public-readiness release

## Current base and pending mobile/Core models batch — 2026-10-09

Commit `41ff566d4b98d1f79352b8bbf57c2a706a341953` is on `origin/main`.
[CI run 37944886879](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37944886879)
completed successfully for that exact SHA. This separately approved commit contains
only the Google HTML verification file. Public HTTP inspection saw a same-host 308
to the extensionless path, then HTTP 200 with the exact 53-byte verification body.
Google Search Console ownership itself remains unconfirmed by the maintainer.

The pending review packet now combines Core models and the signed-in responsive
layout fix. Navigation collapses through 1100 CSS pixels; header controls wrap.
Six targeted production-build browser checks passed (four language/theme layout
cases across 13 widths and two sign-out cases), together with TypeScript and lint.
Existing lint/build warnings remain documented in the review packet. Physical
iPhone/Android acceptance is still open. No additional dependencies or backend
changes are required. See [the current review packet](RELEASE-REVIEW-PACKET.md).

## Previous base and Windows candidate — 2026-10-09

Commit `9bd2a7ccd359013d391a30f2d32bc392c74ca7b4` was the base before the Google
verification commit. [CI run 37884149235](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37884149235)
was read back as completed/success for that exact SHA. The earlier same-day
deployment record verified Cloudflare deployment
`49125584-20e4-4154-b454-ab410e006d8e` and HTTP 200 for the public root/callback.
That deployment observation is not a new live authenticated acceptance check.

A local Windows/source candidate was built from `9bd2a7c` in
`.build/release-9bd2a7c-20261009/`; its recorded archive and embedded-data checks
passed. It predates the uncommitted Core models addition. See
[candidate provenance](RELEASE-v0.1.3.md) for exact hashes and limitations.

The current batch adds Core models, a mobile table readability fix and updated
release/acceptance documentation. It needs no migration, Edge Function deployment
or Auth/SMTP change. Manual acceptance is grouped in
[ACCEPTANCE-BATCH.md](ACCEPTANCE-BATCH.md). Publishing the frontend batch and
publishing a GitHub Windows release are distinct actions; neither is implied by
creating a local review packet.

## Earlier OTP deployment checkpoint — 2026-10-09

Frontend commit `dc6d47f` is on `origin/main`. Both jobs in
[CI run 37816888792](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37816888792)
passed, and Cloudflare deployment `34c7e321-7daa-4020-a6f9-98eb0e2bab47` succeeded.
HTTP 200 and the served OTP frontend assets were verified. This does not establish
production signup acceptance: Supabase rejected the branded Confirm signup template
update because this Free project uses the default email provider. The existing
hosted email subject/body remain unchanged; no sender, SMTP or billing change was made.

The [signup rollout report](SIGNUP-OTP.md) records the rejection and local test evidence.
Read-only inspection also found a localhost Site URL and an empty callback allowlist.
The separately approved [URL-only correction](AUTH-REDIRECTS.md) is now applied and
verified: the public Site URL and five callback destinations match the reviewed config.
Real email/account acceptance, the sending setup and the
remaining [production acceptance](PRODUCTION-ACCEPTANCE.md) tasks are still open.
The older local Windows candidate has not been rebuilt or published by this rollout.

## Previous deployed checkpoint — 2026-10-08

Commit `128b353` is on `origin/main`. Both jobs in
[CI run 37808220810](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37808220810)
passed. Cloudflare deployment `b192916d-663b-498f-bb8d-cd17b710d099` succeeded for
that exact commit. The live sign-in screen displays the 24-hour session policy.
Supabase has seven migrations including `20261008162049_limit_learning_sessions`;
all nine learning tables retain RLS with nine additional restrictive session
policies (42 policies total). `delete-account` version 2 is ACTIVE. See
[session lifetime](SESSION-LIFETIME.md) for implementation and verification scope.

This supersedes the deployment versions in the historical checkpoint below.
The latest published GitHub Release remains v0.1.2; the existing local v0.1.3
candidate predates the session change. It is not an archive of commit `128b353`.
Publication requires a fresh source-matched candidate and the remaining Windows,
account and learner acceptance in [production acceptance](PRODUCTION-ACCEPTANCE.md).

## Earlier approved checkpoint

Approved web checkpoint, 2026-10-08: commit `5518493` was pushed to `origin/main`.
[CI run 37741791718](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37741791718)
passed both `quality` and `hosted-database`, including generated database types,
54 browser smoke tests and the production-build regression step.
Cloudflare reported successful deployment `69143046-7bf3-4dcc-a9c8-85b472085e46`
for that commit. The public site at https://journeyaiengineer.pages.dev was also
checked in a browser: the exercise list, first exercise guide, optional solution,
VI/EN, light/dark themes and direct exercise URL reload worked in the observed flow.
No console warnings or errors were captured during that check. This is guest-only
acceptance; it does not establish real email, signed-in persistence or deletion.

The earlier generated-type CI failure on `94d3be8` is resolved at this checkpoint.
For rollback, confirm the deployment-to-alias mapping in Cloudflare before choosing
an older successful deployment. See [remaining acceptance](PRODUCTION-ACCEPTANCE.md).

The local release candidate is 0.1.3; the latest published GitHub Release verified
on 2026-10-08 remains 0.1.2. See [candidate notes](RELEASE-v0.1.3.md); building these
assets does not publish them. The approved backend rollout completed on 2026-10-08:
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
