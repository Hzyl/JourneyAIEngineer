# Today and roadmap navigation

Date: 2026-10-08. Local changes, not published.

## Behavior

- Study-session submission takes an immediate lock before awaiting the API. Both
  fields are disabled while pending, so a successful response cannot clear a note
  typed during the request. Failure retains the original minutes and note for retry.
  Editing a field clears the previous receipt or error. Minutes remain whole numbers
  from 1 through 1440; duplicate submissions do not start another request.
- Today uses the localized roadmap title. When an English title is unavailable, it
  shows an English continuation prompt instead of a Vietnamese title.
- An explicit Completed roadmap filter overrides the hide-completed preference.
  Clearing filters restores that preference, with explanatory text visible. Search
  still matches both languages and route order still follows the authored path.
- Opening a lesson stores its originating view and URL. The in-page Back button
  returns to that URL, retaining roadmap search, route, phase and status filters.
  Lessons opened from Today return to Today. Direct lesson links default to Roadmap.
  The return destination is in-memory and does not persist across a page reload.

## Verification

- All 106 frontend unit tests passed, including nine new tests for submission
  locking, failure recovery, validation, empty states and roadmap filters.
- Four new local browser scenarios passed in Vietnamese and English. They cover
  failed and delayed session responses, return navigation, completed filtering,
  no results, reset, and light/dark contrast and overflow at 1440px and 390px.
- The full local browser suite passed all 34 tests after these changes. The hosted
  production-browser suite was not rerun for this slice; its prior checkpoint is
  recorded in the lesson UX report.
- Lint and TypeScript/Vite build passed. Existing AuthProvider Fast Refresh and
  hosted catalog chunk-size warnings remain.
- Screenshots are in `.build/today-roadmap-evidence/`. Vietnamese dark/mobile Today
  and English light/desktop Roadmap were visually inspected.

The browser tests override session-write responses and one roadmap status; they
exercise client behavior without changing real learner records. They do not prove
production database behavior. No packages, Docker, database schema or learning
content changed in this slice. Production and release gates remain in the
[implementation plan](PUBLIC-READINESS-IMPLEMENTATION.md).
