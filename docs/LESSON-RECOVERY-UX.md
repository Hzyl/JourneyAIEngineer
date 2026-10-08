# Lesson route and recovery verification

## Scope and implementation

Codex UI completed this follow-up to the public-readiness plan using the existing
project design. No dependency or service was added. The shared personal app now
parses its route through `app-location.ts` and loads lessons through `useLesson.ts`.

- Invalid percent encoding, incomplete lesson links and unknown page paths render
  a bilingual missing-page view instead of throwing during rendering. The original
  URL remains visible, and a focused heading and roadmap button offer recovery.
- Valid catalog IDs remain unchanged. The hosted route parser excludes the local
  Security Lab. A malformed route is not sent to the lesson API.
- Same-page history/hash changes keep the lesson mounted, preserving unfinished
  notes and section focus without making another lesson request.
- A lesson request is retired when its slug changes, loading is disabled or the
  component unmounts. A late success or error cannot overwrite the current view.
- A failed initial load has bilingual retry guidance independent of the workspace
  data refresh. Reloading an already displayed lesson preserves its content and
  unsaved draft while the response is pending, including when that refresh fails.
- Recovery text is larger and the empty-state layout no longer reserves 560px of
  blank space. Existing light/dark theme colors and button feedback are reused.

## Verification evidence

Existing Node/npm, Playwright and Chromium were available; no tools were installed.

- All 151 frontend unit tests passed, including nine route cases and four loader
  cases covering stale responses, disabling/leaving, retry and draft preservation.
- Full browser checkpoint: 46 local tests and 22 production-hosted tests passed.
  The two existing bilingual lesson/practice/progress scenarios also passed after
  the loader integration.
- After the final recovery layout adjustment, all four recovery browser scenarios,
  TypeScript/Vite build and lint passed again. Existing AuthProvider Fast Refresh
  and hosted-client bundle-size warnings remain.
- Browser recovery tests cover unknown-page entry, malformed client navigation,
  in-page Back navigation, exact draft retention and request counts, persistent
  failed loading, successful retry, and mobile light/dark text contrast/overflow.
- Screenshots live in `.build/lesson-recovery-evidence/` (ignored). The English
  light-mode mobile failure view was inspected before and after the layout change.

The first new browser run exposed two fixture issues: an incorrect textarea selector
and a one-request failure that did not model a persistent outage under development
Strict Mode. The tests now select the named input and keep the fake outage active
until retry. Assertions for recovery and draft preservation remain in place.

## Limits and release status

Tests use synthetic API failures and isolated local data. They do not establish live
Supabase, Cloudflare route fallback, physical-device, screen-reader or clean-machine
Windows acceptance. Malformed percent encoding is tested at the route parser and
client-navigation boundaries; a hosting server may reject such a URL before serving
the app. This does not claim that unsaved notes survive a full browser reload.

Changes remain local and uncommitted. No production data, authentication settings,
deployment or publication changed. The full release plan remains active.
