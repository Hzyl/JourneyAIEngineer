# Web beta: Supabase + Cloudflare Pages

Web beta adds a browser-only learning mode. It is deliberately separate from the local FastAPI app: a browser may read the curriculum, authenticate, and save its own learning state, but it never receives filesystem, VS Code, Git, subprocess, exercise-runner or SQLite capabilities.

## Current deployment status

The web beta is deployed on Cloudflare Pages and uses Supabase email/password authentication.
Use the beta URL shared by the maintainer. Desktop/local remains a separate runtime with its own SQLite data;
the beta does not automatically synchronise that database with the web account.

Deployment handoff checkpoint, **2026-10-07**:

- The maintainer confirmed that the web beta is deployed. Its URL and live Cloudflare deployment were not
  independently checked during this documentation update.
- Read-only `git ls-remote origin refs/heads/main` confirms GitHub `main` at
  `94d3be844de58596c383f2fe20cf061bb3bfb72b`. This includes the auth, public-readiness,
  theme and interaction-feedback commits; the earlier auth push blockage is resolved.
- Exercise readers, reference-solution disclosure and guest bundle splitting are subsequent
  local changes. They have not been committed or pushed at this checkpoint.
- If Cloudflare Pages Git integration is enabled for `main`, an approved push will trigger a build/deployment.
  Check the resulting deployment commit and smoke-test it before marking these auth changes as live.

## Hosted features

- React/Vite hosted mode is enabled by `VITE_APP_MODE=hosted`.
- Supabase Auth supports email/password signup, confirmation, sign-in, password reset and sign-out.
- Per-user progress, review scheduling, notes, journal metadata, settings and study sessions live in Postgres behind RLS.
- Curriculum, resources and exercise briefs remain versioned static content; the web does not upload or execute learner code.
- Cloudflare Pages receives the SPA rewrite and generated CSP headers. The build rejects a missing URL/key or a secret Supabase key.

## Auth improvements in source

The commits on `main` add password confirmation at signup, show/hide password controls, guidance and a
resend action for unconfirmed email, and more prominent account-creation and success/error feedback.
Invalid-credential and password-recovery messages do not tell the user that an email address is unregistered.

Local hosted Playwright E2E, unit tests, lint and a Vite production build have passed for these flows.
The hosted Playwright configuration uses test-only Supabase values and checks the auth UI and absence of local
`/api/*` calls. That test does not verify live email delivery, a signed-in learning session or production RLS.
The acceptance checklist below must be checked against the deployed build; it is not a record of completed tests.

## Pending public-readiness changes

The local candidate adds the exercise reader, solutions and learning workflow improvements;
that frontend remains unpublished. Its four additive migrations and `delete-account`
function were approved and deployed on 2026-10-08. Six migration versions, nine RLS tables,
function source and ten non-destructive live HTTP checks were verified. Authenticated
account/browser acceptance remains open. See [backend rollout](BACKEND-ROLLOUT.md) and
[release order and rollback](RELEASE-READINESS.md).

## Local hosted development

Using the deployed web beta does **not** require Docker. Read-only inspection of its real
Supabase database uses the connected MCP. Docker Desktop is needed only for the disposable
local Supabase stack used by database/RLS tests. Run the following reset commands only in a
separate development stack with no personal data; never against production.

```powershell
npm ci
npx supabase start
npx supabase db reset
npx supabase status -o env
```

Copy the local Project URL and publishable key into an untracked `.env.hosted.local` based on `.env.hosted.example`, then run:

```powershell
$env:VITE_APP_MODE = 'hosted'
$env:VITE_SUPABASE_URL = 'http://127.0.0.1:54321'
$env:VITE_SUPABASE_PUBLISHABLE_KEY = '<local publishable key from supabase status>'
npm run dev
```

Run database tests only after the local stack is healthy:

```powershell
npx supabase db reset
npx supabase test db
```

`VITE_SUPABASE_PUBLISHABLE_KEY` is intended for the browser. Never put a database password, personal access token, `service_role`, or `sb_secret_` key in a Vite environment variable.

## Updating the existing deployment

1. Run the applicable curriculum, local regression, database/RLS, hosted unit and hosted browser tests.
2. Check backend prerequisites against [release readiness](RELEASE-READINESS.md). This
   candidate's four migrations and `delete-account` function were deployed and verified on
   2026-10-08. Review later changes separately and obtain approval before applying them with
   a verified backup. Never run `db reset` against the deployed project.
3. Review the exact commits and obtain maintainer confirmation before pushing to `origin/main`.
   Do not include `.env`, service keys, database passwords, `.data`, SQLite databases, private journals or tokens.
4. Push the approved commits with `git push origin main`. If Cloudflare Git integration is still enabled for
   `main`, this also triggers its configured build/deployment. Otherwise use an explicitly approved deployment.
5. Check Cloudflare build status and the deployed commit. Verify the hosted variables and Supabase Auth
   redirect settings against the deployed URL; configuration changes need maintainer confirmation.
6. Run the acceptance checklist against that build, including confirmation/resend/reset email and two-user
   isolation. Keep the previous successful deployment available as a rollback target.

## Setting up another environment

These steps apply to a new environment, not to the already deployed beta.

1. Run curriculum, local regression, database/RLS, hosted unit and hosted browser tests.
2. Create a **Supabase Free** project and enable email confirmation. Record only its URL and publishable key in deployment settings.
3. Push the additive migrations after reviewing `supabase db push --dry-run`.
4. Create a Cloudflare Pages preview tied only to this repository, with Node 22, build command `npm run build`, output `dist` and hosted variables.
5. Check sign-up/confirmation/login/reset, refresh, a direct lesson URL, persistence, mobile layout, no `/api/*` requests, and user A/user B isolation.
6. Promote the exact reviewed preview only after no Critical/High finding remains. Keep the previous successful production deployment as rollback target.

Every remote project creation, migration push, environment-variable change and deployment needs separate maintainer confirmation. Free tiers are useful for a small beta but have quotas and policies that may change.

## Acceptance checklist for each deployment

- [ ] Local mode still binds FastAPI to loopback and portable packaging passes.
- [ ] Hosted mode has no Security Lab, Git, VS Code, test runner, workspace execution, SQLite backup or local heartbeat calls.
- [ ] RLS blocks user B from reading, writing or deleting user A data.
- [ ] Signup, confirmation, sign-in, session refresh, sign-out and password recovery work.
- [ ] Progress, settings, notes, review history, journal and study sessions survive refresh.
- [ ] Cloudflare deep links resolve through `_redirects`.
- [ ] CSP only allows the app and the exact Supabase project origin.
- [ ] The browser bundle contains no service key, database password or access token.

## Operational references

- [Supabase React Auth](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database testing](https://supabase.com/docs/guides/database/testing)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/)
