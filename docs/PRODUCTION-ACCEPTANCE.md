# Remaining production acceptance

Checkpoint: 2026-10-08, frontend commit `5518493`, Supabase project
`tnnlpsecrzatxdpoaagw`, https://journeyaiengineer.pages.dev.
Both jobs in [CI run 37741791718](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37741791718)
passed. Cloudflare reported deployment success. Guest browser checks covered the
exercise list, the first exercise guide and solution, VI/EN, light/dark and reload.
Those observations do not establish signed-in production account behavior.

## Account and email checks — pending

Choose two disposable email addresses controlled by the maintainer. Obtain approval
for account creation, confirmation/recovery emails and synthetic learning records
on the named project before running these steps. Do not use existing learner accounts.
The maintainer enters passwords and completes password changes in the browser;
passwords and email tokens must not be included in reports or chat.

| Step | Action | Evidence required |
| --- | --- | --- |
| 1 | Register account A with a new password and confirmation field. | Unconfirmed-email screen appears; the actual confirmation email reaches A. |
| 2 | Request one confirmation resend, respecting any cooldown. | A new email arrives; its link opens the expected app flow and permits sign-in. |
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
