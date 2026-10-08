# Feedback and community follow-up

The web beta does not yet have a feedback submission service. Its previous adapter returned a fabricated `drafted` result, and the lesson form cleared the learner's text as if submission had succeeded. The hosted form now prepares a reviewable, copyable draft and keeps the original text. Direct hosted submission rejects explicitly instead of returning fake success.

Local feedback continues to save to the local review queue. The form locks its fields while saving, rejects duplicate submissions, retains text after failures and clears it only after success. Community and lesson feeds show accepted or implemented items, with loading, retry and empty states. Hosted community explains that the public feed is unavailable and points learners to the roadmap to prepare lesson feedback.

Vietnamese and English labels, lesson titles and dates follow the selected language; learner-authored feedback is preserved verbatim. Generated reports identify the actual mode and app version. Common credential patterns are redacted from reports, but the preview still asks the author to check private content before sharing. Nothing is sent to GitHub automatically.

## Verification

- 58 frontend unit tests pass. New regressions cover hosted drafts without API calls, retained input, report redaction, clipboard failure, duplicate local submits, failed-save recovery, feed retry, moderation filtering and localized navigation.
- All 24 local Playwright tests pass. Community checks include failed loading and retry, filtering, unpublished items, long text, 1440px and 390px widths, both themes, contrast and page overflow.
- All 14 production-browser tests pass using synthetic hosted configuration. These exercise public reading and authentication boundaries, not live Supabase acceptance.
- Production build passes. Lint has no errors and one pre-existing Fast Refresh warning; the existing large hosted bundle warning remains.
- Generated screenshots in `.build/community-evidence/` were inspected; generated output is ignored by Git.

This is a local source change, not a deployment. No database migration, authentication setting or production service was changed.
