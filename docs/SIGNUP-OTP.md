# Signup OTP and email identity

Candidate prepared and approved for commit, push and controlled rollout on 2026-10-09.
This document records implementation and local verification. Hosted deployment and
the Auth template update require separate verification; a Git push alone proves neither.
The pre-rollout frontend checkpoint was `128b353`.

## User flow

Password signup now opens an email confirmation form. The learner can paste the
code, correct the email address, return to sign-in, or resend after a 60-second
cooldown. Incorrect/expired codes, rate limits and transport failures have localized
feedback. Passwords are cleared when entering this form; codes are never persisted.

An unconfirmed password sign-in opens the same form. After reloading or reopening
the site, sign in with the email and password just created to reach code entry.
Existing confirmation links and password-recovery callbacks continue to work.

The frontend uses `auth.verifyOtp({ email, token, type: 'email' })` and
`auth.resend({ type: 'signup', email })`. Supabase determines the actual code length
and expiration; the UI accepts bounded numeric input without assuming hosted settings.
The client cooldown is UX feedback, not a replacement for server rate limits.
After verification, AuthProvider checks the existing server session deadline before
loading personal data. This change does not replace the deployed 24-hour policy.

## Email prepared for review

- Template: [`confirm-signup.html`](../supabase/templates/confirm-signup.html).
- Supabase template category: **Confirm signup**, not Magic Link.
- Subject: **Journey AI Engineer — Mã xác nhận / Verification code**.
- Code variable: `{{ .Token }}`; no token-bearing link is embedded in the final template.
- Content identifies the app, explains the request in Vietnamese and English,
  tells learners where to enter the code, and explains single-use/expiry and unsolicited mail.
- The public footer links to `https://journeyaiengineer.pages.dev` without credentials.

`supabase/config.toml` selects this local template. Editing that file or pushing the
frontend does **not** change the hosted Auth email template. Local default
`enable_confirmations = false` stays unchanged for existing test workflows.
The dedicated OTP test stack enables confirmations independently.

Email content/subject and sender identity are separate settings. To use an owned
sender address, configure a verified sending domain and custom SMTP with sender
name **Journey AI Engineer**. Do not invent an address or publish credentials.
No hosted SMTP settings were inspected or changed for this candidate.
Supabase's default sending service has restricted recipients/rates and is not
intended for public production delivery; custom SMTP requires separate configuration.

## Verification

On the isolated `journey-readiness-otp` stack, real Auth and Mailpit passed 17
assertions: signup without a session, branded subject/body, numeric code delivery,
rejected password login before confirmation, wrong/expired codes, signup resend,
successful `type: email` verification, session policy RPC, single-use enforcement,
and subsequent password sign-in. The synthetic account was deleted by the test.
No external email was sent and no hosted account was created.

Reproduction script: `scripts/test_local_signup_otp.py --workdir .build/journey-readiness-otp`.
It requires an isolated config/project name, loopback Auth port 55321 and Mailpit
port 55324, local migrations, confirmations enabled, and the template configured.
Never point it at a hosted project. The script reads local test keys without printing them.

Frontend coverage includes focused unit tests, production-browser VI/EN flows,
duplicate-submit guards, retry focus, theme contrast and horizontal overflow at
1440/390/320px. Email HTML is rendered at 600/390/320px with a synthetic preview code.
Evidence is under ignored `.build/signup-otp-evidence/`; it contains no live OTP.
These checks do not prove Gmail/Outlook rendering or production inbox delivery.

Validation results: 218 frontend unit tests passed; after the final focus adjustment,
all 12 affected auth tests passed again. All 31 production-browser tests passed.
TypeScript and lint passed with one pre-existing AuthProvider Fast Refresh warning.
The production build passed with its existing large-chunk warning.

## Controlled production rollout — approval required

1. Review this candidate and its exact commit/target, then approve commit, push,
   Cloudflare deployment and the **Confirm signup** subject/body change for project
   `tnnlpsecrzatxdpoaagw`. SMTP, DNS, credentials and billing remain a separate decision.
2. Retain the existing hosted confirmation template/settings for rollback without
   copying secrets into Git. Verify Confirm email remains enabled and inspect the
   configured code lifetime/length. Do not change them incidentally.
3. Deploy the frontend first and verify the OTP form is available on the deployed
   commit. Keep callback support so previously sent confirmation links still work.
4. Apply the reviewed subject/body to **Confirm signup**, then verify the saved
   template. This is a separate Auth dashboard/Management API operation: the current
   Supabase MCP tools do not expose Auth template configuration.
5. Complete an approved real signup with a maintainer-controlled address. Confirm
   brand, code entry, resend, password sign-in and progress after reload. Stop on a
   mail-provider rejection; do not repeatedly consume the sender's rate limit.
6. During the frontend/template transition, earlier messages may still contain links;
   those callbacks remain supported. For an old open tab without a code field,
   reload and sign in with the new account credentials to open the confirmation form.
7. If rolling back the frontend, restore the link-capable confirmation template first.
   A code-only email cannot be completed in the old UI. No database rollback is needed.

Public email acceptance remains open until real delivery and sender identity have
been checked. The separately reported progress issue still needs reproduction details.

## Sources

- [Email templates and variables](https://supabase.com/docs/guides/auth/auth-email-templates).
- [JavaScript verifyOtp](https://supabase.com/docs/reference/javascript/auth-verifyotp).
- [JavaScript resend](https://supabase.com/docs/reference/javascript/auth-resend).
- [Custom SMTP and default sender limits](https://supabase.com/docs/guides/auth/auth-smtp).
