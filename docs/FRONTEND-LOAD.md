# Guest frontend loading

The public learning experience no longer mounts or imports the personal application
while the visitor is signed out. `AppRoutes` waits for the existing auth provider,
then loads either the public experience or the learning app. Local mode opens the
learning app directly. Auth callbacks stay available before session resolution.

The public exercise catalogue is a separate lazy route. Opening exercises loads
its shared reader, authored guides, starter files and opt-in reference solutions.
The landing page and public lessons do not need those files. Existing styles and
theme tokens are preserved. A failed route chunk shows a reload action that retains
the current URL. This does not add offline caching or change learner persistence.

## Measurement

Two Vite production builds used identical synthetic hosted settings, on 2026-10-07.
Totals include the entry and public experience plus their static JavaScript imports.
They exclude CSS and the deferred private learning catalogue.

| Guest landing JavaScript | Before | After |
| --- | ---: | ---: |
| Minified bytes | 846,855 | 631,820 |
| Sum of gzip bytes per file | 225,726 | 168,417 |

Both totals decreased by approximately 25.4%. This measures payload size, not live
latency or a Core Web Vitals score. The private hosted catalogue still produces a
roughly 2.89 MB uncompressed chunk; its build warning remains visible.

Build manifests are saved in ignored `.build/guest-load-before/` and
`.build/guest-load-after/`. No Cloudflare deployment is implied by these builds.

## Reproducible checks

Run `npm run test:e2e:production`. The configuration builds into
`.build/hosted-production/` and previews on loopback port 4175 using test-only
Supabase values. It runs the existing hosted reading/auth/theme tests plus checks
for the guest request boundary, a 700,000-byte initial JavaScript limit, exercise
navigation, solution disclosure and recovery from a failed public chunk.

The browser test reads Vite's manifest rather than hardcoding hashed filenames.
Its attachment records requested files and raw byte totals. It does not verify
live email delivery, real account persistence or production database permissions.

Unit tests cover auth transitions, local startup and recovery callback routing.
The local browser suite also checks long Git metadata at desktop/mobile sizes:
repository names, branch names and commit descriptions wrap inside their columns
instead of widening the Journal page.

Verification: 45 unit tests, 10 production-browser tests and 18 local-browser tests
passed. The final TypeScript/Vite build passed; lint has one existing Fast Refresh
warning and no errors. The synthetic long-metadata regression failed before its
CSS fix and passed afterward, with the page-overflow check unchanged.

These changes are local and require the existing publication approval gate.
