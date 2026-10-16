# Signup email-link confirmation and email identity

## Current frontend correction — 2026-10-17

The confirmation screen only offers the link sent in the signup email. The old
numeric-code input and its toggle have been removed. The UI does not promise a
branded sender or successful inbox delivery. Resend retains its 60-second cooldown.

The original signup tab now shows “Email confirmed” and an explicit “Continue
learning” action after Auth verifies the same email in another tab. SDK auth events
are wake-up signals, not proof: `getUser()` runs outside the event callback and
must return the matching email with `email_confirmed_at`. Focus, pageshow and
visible-page changes recover missed events without polling. Signout and account
changes invalidate stale checks. The screen never admits a user to private data;
the existing server session deadline remains the admission gate.

Tab-local `journey-pending-signup` session storage contains only email, resend
deadline and a one-hour expiry. It restores the pending screen after reload and
requires a fresh Auth check before showing success. It contains no password,
token or saved confirmation flag. If session storage is unavailable, in-memory
state works until reload. Confirmation in another browser or device cannot notify
this tab; the learner can return to password sign-in after using the email link.

`/auth/sign-up` opens account creation directly. Selecting Create account keeps that
intent in the URL across reload, including the existing `next` destination. The
existing public sign-in buttons still intentionally open sign-in. Invalid sign-in
feedback remains generic about whether an email exists and points new learners to
Create account; signup errors use signup-specific language.

Confirmation links keep the existing allowlisted callback URL unchanged. A safe
learning destination is kept in browser storage for up to one hour and consumed
once after confirmation, including when the email opens a new tab in that browser.
External destinations are rejected. Another browser or blocked/expired storage
falls back to the home page; password recovery keeps its separate flow.

This is a local frontend correction, not a hosted email/template rollout. The sender
configuration dependency below remains open. No real account or external email is
needed for the synthetic regression tests.

## Previous hosted release

Frontend deployed on 2026-10-09 at commit `dc6d47f` after approval of commit, push
and the controlled Confirm signup template rollout. The pre-rollout frontend
checkpoint was `128b353`. **The hosted email template update was rejected; signup
OTP and branded email acceptance are not complete.**

## Hosted rollout result — 2026-10-09

- Both jobs in [CI run 37816888792](https://github.com/Hzyl/JourneyAIEngineer/actions/runs/37816888792)
  passed. Cloudflare Pages deployment `34c7e321-7daa-4020-a6f9-98eb0e2bab47` succeeded
  for the same commit. The public web responds with HTTP 200 and serves the new OTP code.
- A minimal Supabase CLI config targeted only the Confirm signup subject and body
  on project `tnnlpsecrzatxdpoaagw`. Supabase rejected the update with HTTP 400:
  `Email template modification is not available for free tier projects using the default email provider.`
  The response requires a plan upgrade or custom SMTP before template editing.
- A second preview, explicitly declined, still showed both template changes pending.
  The existing hosted subject/body therefore remain unchanged. The deployed code
  input does not establish that the delivered email contains a code.
- No SMTP, sender, domain, credentials or billing settings changed.
  No production account was created and no test email was sent.
- Configuration inspection found Site URL `http://localhost:3000` and an empty
  redirect allowlist. After separate approval on 2026-10-09, the Site URL was set to
  `https://journeyaiengineer.pages.dev` with five reviewed callback destinations.
  A targeted push changed exactly these two fields and remote readback confirmed
  no pending declared differences; see [Auth redirects](AUTH-REDIRECTS.md).

Next: choose and authorize the sending setup; apply and read back the branded
template once permitted; then verify a real delivered email.
Existing callback handling remains in the app, but hosted link delivery and destination
must still be verified with actual delivered messages after the configuration correction.
Ignored operational evidence is in `.build/signup-otp-deployment/`.

## User flow

Password signup opens an email confirmation screen. The learner follows the link
in their email. The original tab updates after successful verification in the same
browser, and stays on the success message until the learner continues. They can
also request a status recheck, correct the address, return to sign-in or resend
after a 60-second cooldown. Expired links remain errors in the callback tab and
never confirm the original tab. Passwords are cleared on entering confirmation.

An unconfirmed password sign-in opens the same screen. Reloading the same tab
restores its pending email for up to one hour; reopening a separate browser starts
the ordinary sign-in flow.
Existing confirmation links and password-recovery callbacks continue to work.

The frontend uses `auth.onAuthStateChange`, `auth.getUser()` and
`auth.resend({ type: 'signup', email })`. It no longer submits numeric signup codes.
The client cooldown is UX feedback, not a replacement for server rate limits.
After verification, AuthProvider checks the existing server session deadline before
loading personal data. This change does not replace the deployed 24-hour policy.

## Historical email candidate — not compatible with the current UI

The following code-only candidate was never applied to hosted Auth. Do not deploy
it with the current link-only screen. A future branding change must retain the
confirmation link and receive its own template/sender review and authorization.

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
The historical dedicated OTP test stack enables confirmations independently;
it tests the old candidate, not the current frontend signup flow.

Email content/subject and sender identity are separate settings. To use an owned
sender address, configure a verified sending domain and custom SMTP with sender
name **Journey AI Engineer**. Do not invent an address or publish credentials.
No hosted SMTP settings were changed during this rollout.
Supabase's default sending service has restricted recipients/rates and is not
intended for public production delivery; custom SMTP requires separate configuration.

## Verification

The current regression suite covers link-only signup, same-browser two-tab success,
reload recovery, missing BroadcastChannel, wrong-account rejection, expired links,
safe continuation paths and the existing session admission boundary. Browser tests
use synthetic Supabase responses; they do not validate real email delivery or
hosted tokens. Current local evidence is under `.build/auth-email-link/`.

During the previous rollout, on the isolated `journey-readiness-otp` stack, real Auth and Mailpit passed 17
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

Previous rollout validation: 218 frontend unit tests passed; after the final focus adjustment,
all 12 affected auth tests passed again. All 31 production-browser tests passed.
TypeScript and lint passed with one pre-existing AuthProvider Fast Refresh warning.
The production build passed with its existing large-chunk warning.

## Controlled production rollout — approval required

1. Review the exact frontend commit and target, then authorize commit, push and
   Cloudflare deployment. This correction requires no Auth template, SMTP, DNS,
   credentials, billing or database changes.
2. On the deployed commit, verify that signup has link instructions and no numeric
   code input. Keep the existing link-capable hosted confirmation template.
3. With an authorized maintainer-controlled signup, open the delivered link in a
   second tab of the same browser. Confirm both the callback and original-tab
   success state, then use Continue learning. Reload the original tab and verify
   ordinary signed-in behavior and persisted learning progress.
4. Check an expired link and confirmation opened on another device. The original
   tab must not invent success; another device requires password sign-in here.
5. Verify resend once within provider limits. Stop on a mail-provider rejection.
   Real inbox delivery and sender branding remain separate acceptance items.
6. Roll back the frontend commit if necessary. This change has no database or
   hosted-email configuration migration to undo.

Public email acceptance remains open until real delivery and sender identity have
been checked. The separately reported progress issue still needs reproduction details.

## Sources

- [Email templates and variables](https://supabase.com/docs/guides/auth/auth-email-templates).
- [JavaScript verifyOtp](https://supabase.com/docs/reference/javascript/auth-verifyotp).
- [JavaScript resend](https://supabase.com/docs/reference/javascript/auth-resend).
- [Custom SMTP and default sender limits](https://supabase.com/docs/guides/auth/auth-smtp).
