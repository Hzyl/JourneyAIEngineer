# Database acceptance follow-up

Current status, 2026-10-08: the approved backend rollout is complete. Production now
has six migrations, nine RLS tables and `delete-account` version 1 ACTIVE; ten
non-destructive HTTP checks passed. See [backend rollout](BACKEND-ROLLOUT.md).
The earlier inspection below records the pre-rollout state. Real authenticated
browser/deletion acceptance remains pending.

## Read-only production evidence: 2026-10-08

Supabase MCP confirmed project `tnnlpsecrzatxdpoaagw`, only migrations
`20261006000100` and `20261006000200`, and no deployed Edge Functions.
All eight current public learning tables have RLS enabled. Each has a foreign key
to `auth.users` configured with `ON DELETE CASCADE`. These are catalog inspections,
not execution of deletion or two-user isolation tests.

Generated production TypeScript still exposes only `answer_review_card` and
`record_lesson_progress`; it lacks the pending mutation/export RPCs. Do not replace
the candidate's database types with these older production types. Regenerate from
the disposable database after all candidate migrations, then retain the CI diff gate.

The platform-created `public.rls_auto_enable()` remains SECURITY DEFINER with
EXECUTE granted to anon/authenticated. Pending migration 004 conditionally revokes
those grants while preserving the event-trigger implementation. Catalog permission
visibility alone does not prove that an event-trigger function is directly callable
as an RPC. Validate the migration's present/absent paths before rollout.

## Cascade regression: passed on disposable local Supabase

`supabase/tests/database/account_cascade.test.sql` creates two synthetic auth users
inside a transaction with foreign keys and auth insertion triggers enabled. It
expects profiles/settings from the real insertion trigger, and seeds seven more
learning tables, including mutation receipts. It checks:

- Both owners have fixtures in all nine tables before deletion (18 assertions).
- Deleting A's auth row removes all A rows and preserves B rows (18 assertions).
- A's auth row is absent and B's remains (two assertions).
- Every field of B's learning rows still matches the saved snapshot (one assertion).

All fixture changes roll back. This file belongs only in a disposable local/staging
database. It does not call Auth HTTP, send email, or certify session invalidation.
The older RLS fixtures deliberately disable foreign-key checks and cannot stand in
for this regression. Their explanatory comment now states that limitation accurately.

The existing CI command `npx supabase test db` discovers this test automatically.
Run it after all candidate migrations, alongside the existing RPC/idempotency/export
tests and `scripts/test_db_concurrency.py`. Then regenerate types and verify the diff.
Do not run `db reset` or these fixture tests against production.

## Remaining prerequisites

The maintainer clarified on 2026-10-08 that the existing web and Supabase project
`tnnlpsecrzatxdpoaagw` remain the deployment destination, with the Free-plan goal.
A second cloud project or paid branch is not a prerequisite. The earlier request
for a separate staging project reference is superseded.

Use an approved disposable local database or CI for destructive fixture tests.
Docker, if approved for local testing, serves only that purpose and does not become
an application dependency. Do not apply migrations or create/delete test users in
the deployed project without approval for those concrete actions. Review and apply
the approved production migrations before pushing a frontend that needs the new RPCs.

Deno, psql and pg_ctl are not on the host PATH. The approved Docker stack supplies
Postgres and the Supabase Edge runtime; no global Deno installation was needed.

`scripts/test_db_concurrency.py` now also checks migration 004 against an event-trigger
function, an absent function and an unrelated scalar function. It checks permission
revocation and preservation of the original body and event-trigger registrations.
All DDL fixtures roll back. The existing container-name guard remains in place.
CI now uses that guarded test-container name and invokes the conditional migration
and two-connection checks. Both additions passed in the isolated local stack.

The maintainer subsequently approved Docker for local tests and necessary test
images. A fresh isolated workdir was prepared at
`.build/journey-readiness-20261008-041610`, with a guarded project/container name
and separate ports. Docker Desktop startup failed before the Engine became ready:
its log reports an inaccessible `Docker/run/dockerInference` endpoint while
initializing the Inference manager. Windows also refused to rename or inspect the
endpoint (error 1920); the attempted rename made no change. Normal Desktop stop
reported failure. Only the two task-owned diagnostic CLI processes were stopped.

## Completed local acceptance: 2026-10-08

Docker Engine subsequently became healthy (29.2.1); no runtime-directory repair or
factory reset was performed. The isolated stack applied all six candidate migrations.

- `supabase test db`: six files, 128 pgTAP assertions passed, including 39 real-FK
  cascade assertions. SQL fixtures rolled back.
- `scripts/test_db_concurrency.py`: migration 004 present/absent/scalar cases passed;
  simultaneous distinct review requests produced two writes, retrying one request
  produced one write. Synthetic fixtures were cleaned.
- Generated TypeScript from the migrated local schema and updated the tracked file
  with `learning_mutations`, `apply_learning_mutation` and `export_learning_snapshot`.
  TypeScript compilation passed; the CI generated-type diff gate remains enabled.
  `npm run supabase:types` now normalizes trailing whitespace and writes atomically
  after successful CLI output validation. Repeated local generation is identical;
  an intentional missing-workdir failure preserved the existing file unchanged.
- `scripts/test_local_account_deletion.py`: 21 checks passed through real local Auth
  HTTP and Edge runtime 1.77.1 (Deno 2.1.4). Two synthetic password accounts were
  created; missing/invalid tokens, wrong password, missing confirmation, disallowed
  origin, oversized body and invalid UTF-8 were rejected without data changes.
- Successful deletion with A's token and a forged B target removed A's Auth row and
  all nine A learning-table rows. Every field of B's learning data remained unchanged.
  Auth rejected identification using A's old token. All synthetic Auth users were
  removed in cleanup. This does not claim universal immediate JWT invalidation.

The local Kong CORS plugin overwrites response CORS headers with `*`, including
preflight. The test verifies the function's disallowed-origin 403 response; exact
production CORS headers and browser behavior still require deployed acceptance.
No production migrations, function deployment or production users were changed.

Reproduce only in the guarded disposable workdir, with the function served using
`ALLOWED_ORIGINS=http://127.0.0.1:5173`. The script requires loopback API port 55321,
matching project/workdir names under `.build`, and deletes only UUIDs it created.
It keeps local keys/passwords in memory and prints only assertion names.

Real confirmation/resend/reset email delivery, deployed-browser acceptance and a
remote CI run remain open. The local release packet `release-review-20261008-035140`
predates these source changes; refresh it before publication approval.

## Production backup and local rollout rehearsal: 2026-10-08

The maintainer authorized backup creation and verification. Supabase CLI 2.119.0
was authenticated to the expected project; its existing linked connection exported
the database without a new password prompt. Backup SQL, private diagnostic logs and
SHA-256 checksums are outside the repository in a directory restricted to the local
owner and SYSTEM. They are not release assets or learner-facing downloads.

- Seven SQL components cover roles, application schema, managed schema, data,
  migration history, combined restore schema and the platform event trigger.
- A separate PostgreSQL 17.11.0.003 container restored the backup with networking
  disabled and no published ports. All 42 COPY blocks matched row-for-row, and the
  sequence state matched. Eight application tables retained RLS and 31 policies;
  migration history contained the two original deployed versions.
- Restore setup must retain database owner `postgres`, since schema `public` is
  owned by `pg_database_owner`. The bare image also needed the existing platform
  role `supabase_realtime_admin`, with the same non-login/non-admin attributes.
- Use the combined schema export to preserve Auth/public dependency ordering.
  CLI exports omitted event trigger `ensure_rls`; it was captured separately and
  restored as `postgres`. Its owner, enabled state, function body and restricted
  search path matched the live read-only metadata.
- The exact four reviewed migration hashes passed in order under role `postgres`
  on the restored copy. A second full row comparison found no changed existing
  data. The copy then had nine RLS tables and 33 policies. The trigger and its
  function body remained unchanged; restricted function grants matched expectations.
- The task-owned container and anonymous volume were removed after verification.
  Other running Docker services were left intact. The backup remains available.

This is verified database recovery and a local migration rehearsal. It does not
copy API/JWT secrets, SMTP/Auth-provider settings or a whole managed Supabase
deployment. CLI data exports exclude service-internal Auth/Storage migration
history; do not treat them as a service-version migration recipe. Storage had no
buckets or objects at inspection. Real email delivery and deployed acceptance
remain open. A final read-only cloud check confirmed the two original migrations
and no Edge Functions; no production migration or deployment was performed.
