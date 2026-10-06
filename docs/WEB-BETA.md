# Web beta: Supabase + Cloudflare Pages

Web beta adds a browser-only learning mode. It is deliberately separate from the local FastAPI app: a browser may read the curriculum, authenticate, and save its own learning state, but it never receives filesystem, VS Code, Git, subprocess, exercise-runner or SQLite capabilities.

## What is ready in source

- React/Vite hosted mode is enabled by `VITE_APP_MODE=hosted`.
- Supabase Auth supports email/password signup, confirmation, sign-in, password reset and sign-out.
- Per-user progress, review scheduling, notes, journal metadata, settings and study sessions live in Postgres behind RLS.
- Curriculum, resources and exercise briefs remain versioned static content; the web does not upload or execute learner code.
- Cloudflare Pages receives the SPA rewrite and generated CSP headers. The build rejects a missing URL/key or a secret Supabase key.

## What is deliberately not public yet

No Supabase project is linked, no migration is pushed, and no Cloudflare Pages deployment exists. Do not claim a hosted URL until a preview has passed the two-user/RLS smoke test. The portable Windows app and source clone remain the current usable release paths.

## Local hosted development

Docker Desktop is required for the Supabase local stack.

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

## Deployment sequence

1. Run curriculum, local regression, database/RLS, hosted unit and hosted browser tests.
2. Create a **Supabase Free** project and enable email confirmation. Record only its URL and publishable key in deployment settings.
3. Push the additive migrations after reviewing `supabase db push --dry-run`.
4. Create a Cloudflare Pages preview tied only to this repository, with Node 22, build command `npm run build`, output `dist` and hosted variables.
5. Check sign-up/confirmation/login/reset, refresh, a direct lesson URL, persistence, mobile layout, no `/api/*` requests, and user A/user B isolation.
6. Promote the exact reviewed preview only after no Critical/High finding remains. Keep the previous successful production deployment as rollback target.

Every remote project creation, migration push, environment-variable change and deployment needs separate maintainer confirmation. Free tiers are useful for a small beta but have quotas and policies that may change.

## Acceptance checklist

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
