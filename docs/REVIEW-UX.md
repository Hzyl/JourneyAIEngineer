# Review interaction and recovery

Date: 2026-10-08. Local changes, not published.

## Behavior

- The answer draft, disclosure and elapsed-time retry snapshot belong to the current
  card ID. A refreshed queue cannot attach one answer to a different card. Changing
  the language keeps the current draft and disclosure intact. Local numeric IDs and
  hosted string IDs are supported without changing stored identifiers.
- The current card remains visible while its submission and parent refresh finish.
  The next card cannot display a pending indicator for the previous answer. Duplicate
  clicks are locked immediately, and failed submissions retain the answer for retry.
  Retrying an unchanged answer and rating reuses its original elapsed seconds.
- A new card receives heading focus, including after scrolling down to the rating
  controls on mobile. The empty-session heading receives focus after the final card.
- The four ratings include bilingual explanations. History translates rating labels;
  topic suggestions explain their difficult-review counts. Revealing an answer does
  not submit a rating, change the review schedule or mark a lesson complete.
- History and topic suggestions have independent error states and a retry action.
  One failed endpoint no longer discards the successful endpoint result. Older
  responses are ignored after a new queue request or unmount. Activity errors do not
  overwrite submission errors or disable the active recall card.

## Layout

Review controls reuse the existing theme and press feedback. Ratings form four
columns on desktop and two on mobile, with readable descriptions and equal row
heights. The pending spinner has reserved space beside its label. Answer prose
preserves line breaks, long text wraps, and disclosure controls have a 44px target.

## Evidence and limits

- Six additional unit regressions cover queue replacement, independent activity
  failure and retry, final-card focus, language/string IDs, late responses and an
  early parent refresh. All 112 frontend unit tests passed.
- Two new local browser scenarios passed in VI/EN. They cover history failure and
  recovery, keyboard answer disclosure without writes, save failure with retained
  input, identical retry payloads, pending states, both card transitions and lesson
  navigation. Contrast and overflow are checked in light/dark at 1440px and 390px.
- Eighteen hosted production-build browser regressions passed with synthetic Auth
  and Supabase responses. These do not establish live cloud review/RPC acceptance.
- The final complete local browser suite passed all 36 tests, including the two
  new review scenarios and existing lesson, backup, theme and navigation checks.
- Lint and the final TypeScript/Vite build passed. The existing AuthProvider Fast
  Refresh and hosted catalog chunk-size warnings remain.
- Screenshots are in `.build/review-evidence/`. English light/desktop and Vietnamese
  dark/mobile pending states were inspected; the final mobile image was inspected
  again after positioning the spinner.

The browser review responses are controlled fixtures. No learner records, schedule
algorithm, production data, dependencies or database schema changed. No commit,
push or deployment was performed. Broader release gates remain in the
[implementation plan](PUBLIC-READINESS-IMPLEMENTATION.md).
