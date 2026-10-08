# Approved backend rollout — 2026-10-08

The maintainer approved four migrations, the production origin setting and deployment
of `delete-account` to Supabase project `tnnlpsecrzatxdpoaagw`. These steps completed.
This approval did not include a frontend commit/push or deleting a real account.

## Database

The CLI dry run matched the four reviewed files. The approved push applied them in
order, retaining their repository versions. MCP then confirmed all six migrations:

- `20261006000100` — create learning state, already deployed.
- `20261006000200` — add learning RPCs, already deployed.
- `20261007000100` — serialize first-review activation and require learned content.
- `20261007000200` — add mutation receipts and retry-safe learning writes.
- `20261007000300` — add the owner-scoped snapshot export RPC.
- `20261007000400` — restrict client execution of the platform RLS event-trigger function.

Post-deployment inspection confirmed nine public tables with RLS and 33 policies.
Both new RPCs use SECURITY INVOKER, deny anon execution and allow authenticated
execution. `rls_auto_enable()` denies execution to anon/authenticated; `ensure_rls`
remains enabled, owned by `postgres`, with unchanged function body and search path.
The security advisor no longer reports those event-trigger grants. Its remaining
warning is disabled leaked-password protection, already documented under the
maintainer's Free-plan choice; no billing or Auth-setting change was made.

## Account-deletion function

`delete-account` is ACTIVE at version 1, deployed through Supabase MCP. The retrieved
deployed source exactly matches all three submitted TypeScript files. Bundle SHA-256:
`1f020276fc2e3db44766c743a2f35df98caaa1e8e02493619e46e5bac2560e26`.

`ALLOWED_ORIGINS` is `https://journeyaiengineer.pages.dev`. Server keys remain in
the function environment. Gateway `verify_jwt=false` is intentional: application
code verifies the bearer token with Auth, reauthenticates the password, checks the
same user ID and refuses enrolled MFA accounts before any deletion.

Ten live HTTP checks passed without using a valid account token:

| Case | Result |
| --- | --- |
| Approved-origin preflight | 204; exact origin, POST and expected headers allowed |
| Other-origin preflight | 403; no allow-origin header |
| Missing bearer token | 401 |
| Invalid bearer token with a valid request shape | 401 |
| Unsupported GET | 405 |
| POST from another origin | 403 |
| Invalid JSON | 400 |
| Invalid UTF-8 | 400 |
| Body exceeding 8192 bytes | 413 |
| Missing DELETE confirmation | 400 |

Allowed-origin error responses also returned the exact CORS origin. No wildcard
override was observed on the deployed gateway, unlike the earlier local Kong test.
These checks do not establish successful authenticated deletion, two-account
isolation through the deployed app, email delivery or browser sign-out. No account
was deleted, and no real learner token/password was used.

## Backup and remaining work

The pre-rollout backup was restored in an isolated container and compared across
42 data blocks and one sequence. The four migrations passed on that copy without
changing existing rows. The event trigger was backed up separately. The private
backup and its checksums remain outside the repository; test storage was removed.
See [database acceptance](DATABASE-ACCEPTANCE.md) for restore scope and limitations.

Follow-up on 2026-10-08: the frontend was separately approved and pushed as `5518493`.
Cloudflare deployment and both CI jobs passed; guest exercise browser checks passed.
Real email/account acceptance, private support
contact, Windows clean-machine checks and real learner pilot evidence remain open.
See [release readiness](RELEASE-READINESS.md); this backend rollout does not complete
the entire public-release plan.
