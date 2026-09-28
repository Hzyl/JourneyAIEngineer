# Journey AI Engineer — Public Learning Hub and Feedback Loop

## Decision

Journey AI Engineer will use an editorial public surface inspired by the information architecture of modern learning products, while keeping the signed-in learning workspace focused on progress, review, and practice. Feedback is attached to a lesson and becomes content only through an explicit review flow.

The first implementation slice is local-first: SQLite and the existing FastAPI/React stack gain a feedback loop and a public community surface without requiring a cloud account, API key, or deployment. The database and API shapes are tenant-ready so Supabase/PostgreSQL and GitHub/email authentication can be added later without changing the lesson URLs or public feedback contract.

## User flows

1. A visitor opens the public learning surface and discovers the roadmap, lessons, resources, and latest approved feedback.
2. A learner opens a lesson, reads the content, and submits a structured feedback item: unclear concept, incorrect content, missing example, missing resource, broken link, typo, exercise problem, or feature request.
3. New feedback is private to moderation until it is approved. Approved feedback can be shown on the lesson and community surface.
4. A maintainer reviews feedback, records an action, and later updates version-controlled content in GitHub. The app never edits or pushes curriculum automatically.
5. Code exercises continue to run locally through the existing VS Code workspace flow. The public web surface never executes arbitrary learner code on the server.

## Data contract

The feedback record stores a stable id, lesson slug, optional author identity, a controlled kind, body, status, moderation note, timestamps, and an optional resolved commit reference. Public read endpoints return approved records only and omit private identity fields. Write endpoints validate length and enum values at the API boundary.

Statuses are `pending`, `triaged`, `accepted`, `rejected`, `drafted`, and `implemented`. The local build may submit feedback without an account, but it must not expose an online-ready admin mutation without an explicit server-side moderation credential. This keeps the local MVP usable while making the production boundary fail closed.

## UI direction

- Public hub: warm editorial hierarchy, strong lesson/phase cards, a three-step `Learn → Practice → Review` explanation, featured resources, and a small approved-feedback/changelog feed.
- Lesson page: existing structured lesson content remains primary; add a compact feedback panel after completion criteria and a list of approved feedback.
- Community view: searchable approved feedback and changelog entries, with clear status labels and links back to lessons.
- Accessibility: keyboard-operable controls, labels for form fields, visible validation errors, safe text rendering, responsive layout, and no user content rendered as HTML.

## Security boundaries

- All feedback is untrusted input: validate, length-cap, normalize, and render as plain text.
- Public reads expose only approved content and no email or private progress.
- Moderation mutations require a server-side token in production; no token is sent to or stored in the frontend bundle.
- Rate limiting and auth provider integration are a later cloud slice; the local slice documents the boundary instead of pretending local SQLite is multi-tenant.
- RedAmon is not part of the app runtime. Security testing remains an explicitly authorized, isolated, staged workflow against a local/staging target.

## Future cloud migration

The next slice will add Supabase Auth (GitHub and email magic link), PostgreSQL/RLS, per-user progress, and a hosted FastAPI service. The feedback table will retain the lesson slug and status contract. GitHub remains the content source of truth; accepted feedback is exported to a draft for human review before any commit or pull request.

