# Remaining production acceptance

**Scheduling update, 2026-10-09:** the maintainer deferred manual acceptance to one
final round while implementation continues. Track the grouped requirements in
[ACCEPTANCE-BATCH.md](ACCEPTANCE-BATCH.md); do not repeatedly interrupt independent
implementation for these checks. The checkpoints below retain their original scope.

Latest frontend checkpoint: 2026-10-09, commit `dc6d47f`, Supabase project
`tnnlpsecrzatxdpoaagw`, https://journeyaiengineer.pages.dev.
Both jobs in [CI run 37816888792](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37816888792)
passed. Cloudflare deployment `34c7e321-7daa-4020-a6f9-98eb0e2bab47` succeeded for this
commit; HTTP 200 and the served OTP assets were verified. **The hosted signup email
template was rejected by Supabase and remains unchanged.** The default email provider
on this Free project does not permit template edits. Sender setup and real delivery
remain open; see [the rollout result](SIGNUP-OTP.md).

The previous `128b353` checkpoint verified the live 24-hour-policy screen; Supabase
migration `20261008162049` and deletion function version 2 were deployed then.
Inspection on 2026-10-09 found Site URL `http://localhost:3000` and no allowed
redirect URLs. The separately approved [URL-only correction](AUTH-REDIRECTS.md) was
then applied and read back: the Site URL is the public Pages app, with five reviewed
callback destinations. Actual email/recovery acceptance remains pending.
Earlier guest checks at `5518493` covered the exercise list,
first guide/solution, VI/EN, themes and reload. These observations do not establish
signed-in production account behavior. See [session lifetime](SESSION-LIFETIME.md).

## Maintainer feedback recorded on 2026-10-08

| Area | Report | Acceptance status |
| --- | --- | --- |
| Registration/email | The response retained the example placeholder. | Still unconfirmed; no delivery result supplied. |
| Progress persistence | No result supplied. | Still unconfirmed. |
| Exercises, guides and solutions | Provisionally acceptable. | Provisional; no specific additional defect reported. |
| Interface | Provisionally acceptable. | Provisional; no specific additional defect reported. |
| Recovery/export | Reported working. | Maintainer-observed, without individual flow evidence. |
| Two accounts | Reported working. | Maintainer-observed, without individual isolation evidence. |
| Session duration | Requested 24 hours after observing restored sign-in. | Implemented and deployed; local expiry tests passed. |

The maintainer's observations are valid feedback, but do not prove every numbered
step below. In particular, export success does not prove deletion or email recovery.
The original session-duration question is resolved by the approved 24-hour policy;
it is no longer awaiting a choice of lifetime. A real expired-session login check
remains part of manual acceptance, not a reason to change unrelated Auth settings.

Follow-up: the maintainer identified signup email UX problems: no input for an OTP,
link-based confirmation, and generic Supabase branding. The deployed
[signup OTP frontend](SIGNUP-OTP.md) provides code entry. The branded email is locally
verified, but its hosted template deployment was rejected and real delivery acceptance
remains pending. A separate progress
persistence failure has not yet been described and is not inferred from this feedback.
The maintainer has not selected a private security contact; that item remains open.

## Account and email checks — pending

Choose two disposable email addresses controlled by the maintainer. Obtain approval
for account creation, confirmation/recovery emails and synthetic learning records
on the named project before running these steps. Do not use existing learner accounts.
The maintainer enters passwords and completes password changes in the browser;
passwords and email tokens must not be included in reports or chat.

| Step | Action | Evidence required |
| --- | --- | --- |
| 1 | Register account A with a new password and confirmation field. | Unconfirmed-email screen appears; the actual confirmation email reaches A. |
| 2 | After the sender/template and redirect configuration are ready, request one confirmation resend, respecting any cooldown. | A branded email arrives and its code completes signup in the app. Verify an earlier confirmation link also returns to the public app. |
| 3 | Register and confirm account B in a separate browser profile/session. | A and B are distinct authenticated users. |
| 4 | In A, record a lesson, a short study session and a synthetic note such as `QA A only`. Reload. | A's records remain; the displayed minutes do not increase just from reload. |
| 5 | In B, create `QA B only` and inspect the same learning views. | A's note/progress is absent from B; B's data is absent after returning to A. |
| 6 | Export A's cloud snapshot. | Parse the downloaded JSON locally; its account data belongs to A, includes A's test records and excludes B's records. |
| 7 | Request a password-reset email for A and complete it manually. | Email arrives; the reset link opens the correct app flow, and sign-in works with the new password. |
| 8 | Sign out and reload. | Public UI is shown, with no private learner content left visible. |

Keep downloaded exports outside Git. Record result, timestamp, deployed commit and
redacted screenshots for each step. A generic success message for confirmation or
password recovery does not prove email delivery. If mail is rate-limited or rejected,
record that result and stop resending; an email-provider change needs separate approval.

## Account deletion — separate confirmation required

Only after the tests above, identify the exact disposable account to delete and
obtain confirmation immediately before the irreversible action. Use the normal
account settings flow: enter the account password and the required `DELETE` text.

- [ ] The first deletion removes only the selected test account, signs its browser out,
  and keeps it signed out after reload.
- [ ] A read-only database check, scoped to that approved test user ID, confirms its
  dependent learning rows were removed; the other test user's records still exist.
- [ ] The other test account is deleted only after its own explicit confirmation.
- [ ] Test exports are handled according to the maintainer's chosen cleanup procedure.

Do not point disposable local reset/test scripts at production. Local two-user Auth,
RLS and cascade tests already passed; this section verifies the deployed user flow.
No production test accounts have been created or deleted at this checkpoint.

## Windows runtime — pending

Use the exact reviewed Windows preview, its recorded checksum and a clean Windows
machine or disposable VM. Record Windows version, architecture and whether Python
was already installed. A successful build or EXE archive inspection is insufficient.

- [ ] Extract the ZIP, start the app and reach onboarding without the repository or Git.
- [ ] With Python absent, verify the app's guidance and that failed practice attempts
  preserve learner data; then manually install a supported Python if needed.
- [ ] Open the learner workspace, complete the first exercise and retain its output.
- [ ] Save progress and a note, close/reopen the app and verify persistence.
- [ ] Export a backup, inspect its preview and restore only into a disposable workspace.
  Confirm that invalid backups are rejected without replacing existing records.
- [ ] Record startup failures and paths without including private journal contents.

An earlier automated approval review rejected launching the locally built EXE with
`blocked by policy` and no detailed reason. Runtime acceptance remains open; do not
substitute archive inspection for a launch or bypass that rejection.

## Support, release and learner pilot — pending

- [ ] Maintainer supplies a private support/security contact approved for publication.
- [x] Select version 0.1.3 for the next local Windows/source candidate. Version 0.1.2
  already exists; publishing new assets remains gated and must not replace its assets.
- [ ] Invite actual learners only with authorization to contact them. Ask each to
  open a lesson, attempt an exercise, use a hint/solution and explain what they learned.
- [ ] Record real navigation problems, confusing instructions and time spent; keep
  personal details out of the public report. Fix or explicitly triage observed blockers.
- [ ] Review the exact release artifacts and obtain publication approval.

These are open acceptance tasks, not a report that they passed. The web checkpoint
is deployed; completion of the wider public-release plan requires the missing evidence.
