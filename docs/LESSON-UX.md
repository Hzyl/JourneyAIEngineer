# Lesson reading and practice handoff

Date: 2026-10-08. Local changes, not published.

## Learning flow

The local/authenticated lesson workspace is extracted from App.tsx into bounded
lesson components. Content IDs, review IDs and stored checklist keys are retained.
The guest sample-lesson reader remains a separate public surface.

- Related exercises now open the exact in-app task and guide. Browser Back returns
  to the lesson and its reading fragment. No GitHub redirect or local command runs
  when opening the guide.
- Lesson anchors transfer keyboard focus as well as scroll position; direct fragment
  URLs restore the target section. Reduced-motion preferences are respected.
- Missing English controls are localized: reading time, resources, study actions,
  helper text and step labels. Existing authored content remains the source of truth;
  this change does not claim that all legacy lesson prose has been reviewed.
- Checklist ticks survive a language change and remain scoped to the hosted user.
  Opening an answer never records completion. Incomplete checklists prompt the
  learner and focus the understanding-check section.
- Study minutes must be an integer from 1 to 1440. Invalid input cannot write
  progress. Pending writes block duplicate clicks; failed writes retain the minutes
  and allow retry. Existing note failure/pending behavior remains covered.

## Reading layout and themes

The lesson contents menu now stays in normal document flow. Screenshots of the
previous sticky version showed it covering reading content during scrolling.
Subsection headings are 24–32px, main explanatory text is 15px, step labels are
15px and code is 13px with keyboard-accessible internal scrolling. Linked exercise
actions stack on narrow screens instead of squeezing their titles.

The browser checks also exposed a reduced-motion defect: a global 0.01ms transition
duration introduced a short background transition even on elements with no normal
transition. Descendant text could use the new theme while an ancestor still used
the old background. Reduced-motion transition duration and delay are now both zero,
including auth controls. The contrast check was retained; no colors were hardcoded
to hide the mismatch.

## Evidence and limits

- Full frontend unit suite: 97 passed, including 12 new lesson checks.
- Full local browser suite: 30 passed after the functional extraction and
  reduced-motion correction. Both lesson VI/EN scenarios passed again after the
  final typography and non-sticky contents-menu changes.
- Hosted production-build browser suite: 18 passed after the functional extraction
  and reduced-motion correction, using synthetic settings and Supabase responses.
- Final lint, TypeScript/Vite build and Git whitespace checks passed. Existing
  AuthProvider Fast Refresh and hosted catalog chunk-size warnings remain.
- VI/EN desktop/mobile light/dark screenshots are in `.build/lesson-evidence/`.
  The final Vietnamese dark/mobile and English light/desktop images were inspected.

Progress writes in the two new browser scenarios use controlled error/success
responses to verify the client flow. They do not prove new database behavior.
The previous 67-test Python checkpoint remains unchanged by this frontend slice.
No package installation, Docker launch, production change, commit, push or deployment
was performed. Staging, real Auth email, Windows and learner-pilot release gates
remain open in [the implementation plan](PUBLIC-READINESS-IMPLEMENTATION.md).
