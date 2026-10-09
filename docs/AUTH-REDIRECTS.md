# Hosted Auth redirect correction

Status: approved, applied and verified on 2026-10-09.
Project: `tnnlpsecrzatxdpoaagw`. Public app: https://journeyaiengineer.pages.dev.

Before rollout, hosted inspection found `site_url = "http://localhost:3000"` and
`additional_redirect_urls = []`. The deployed frontend at `dc6d47f` sends callbacks
under `/auth/callback`, with `lang=vi` or `lang=en` and `mode=recovery` for password
resets. An unapproved redirect could fall back to the old localhost Site URL.
The two-field correction below is now applied; it does not resolve the separate email
provider restriction recorded in [Signup OTP](SIGNUP-OTP.md).

## Applied configuration

```toml
[auth]
site_url = "https://journeyaiengineer.pages.dev"
additional_redirect_urls = [
  "https://journeyaiengineer.pages.dev/auth/callback",
  "https://journeyaiengineer.pages.dev/auth/callback?lang=vi",
  "https://journeyaiengineer.pages.dev/auth/callback?lang=en",
  "https://journeyaiengineer.pages.dev/auth/callback?lang=vi&mode=recovery",
  "https://journeyaiengineer.pages.dev/auth/callback?lang=en&mode=recovery"
]
```

This allows only the existing public origin and the app's current callback variants.
It does not add preview deployments, localhost destinations or wildcard hosts.
No email provider, template, confirmation, session lifetime, MFA or database settings
are part of this correction. Existing email messages still need explicit acceptance;
changing settings does not prove their embedded links were rewritten.

## Review and verification

Use a dedicated minimal config, not the root local-development `supabase/config.toml`.
The reviewed minimal config is `.build/signup-url-fix/supabase/config.toml` (ignored).

On 2026-10-09, `config diff` showed exactly two declared updates. A subsequent
`config push` preview was explicitly answered `n`: Auth was skipped, no settings
were pushed, no secrets were sent and all 10 undeclared remote properties were left
unchanged. Evidence: `.build/signup-url-fix/push-preview.txt`. Independent source
review confirmed the five URLs cover the callbacks built by the deployed frontend;
historic messages with other destinations are not established by that review.

After the maintainer approved the combined URL/documentation/commit/push package,
a fresh diff confirmed the same two-field baseline. The targeted push succeeded:
Auth reported `updated` with exactly `auth.site_url` and
`auth.additional_redirect_urls`. No secrets were sent and no other service changed.
A subsequent remote diff reported zero declared updates; all ten undeclared remote
differences were retained. Evidence: `.build/signup-url-fix/push-result.json` and
`.build/signup-url-fix/verification.json`.

This verifies the hosted settings, not actual email delivery or successful account
recovery. No production test account was created and no test email was sent.

For any subsequent change:

1. Inspect the hosted diff immediately before applying. Only `auth.site_url` and
   `auth.additional_redirect_urls` may change. Stop if the hosted baseline has drifted.
2. Obtain approval for these two production fields on the named project.
3. Apply the reviewed minimal config, then read the diff again to confirm no pending
   change in either declared field. Record result and timestamp without secrets.
4. Verify real confirmation/recovery email destinations with a maintainer-controlled
   test address and authorization to send. Check both languages and the recovery form.
   Configuration readback alone does not prove email delivery or successful recovery.

Rollback, if specifically authorized: restore the recorded two-field baseline only.
Restoring localhost also restores the broken public link destination, so diagnose
before rollback. Never push the full local config as a hosted rollback.
