# Consolidated acceptance queue

On 2026-10-09 the maintainer requested that manual acceptance be deferred and
collected into one final round while authorized implementation continues.
Pending human checks are not implementation blockers and are not marked passed.

Use [PRODUCTION-ACCEPTANCE.md](PRODUCTION-ACCEPTANCE.md) for the detailed steps.
Before the final round, record the exact deployed commit, Windows/source artifact
checksums and automated verification results together. Rebuild release candidates
after the agreed implementation batch, rather than asking for acceptance per lab.

| Area | Remaining evidence | Dependency for final acceptance |
| --- | --- | --- |
| Signup email and recovery | Actual delivery, branded sender/content, OTP and recovery completion | Custom SMTP and verified sender details are still absent; the Free default provider rejected template changes. |
| Signed-in web | Save/reload, export, two-account isolation and 24-hour expiry | Disposable maintainer-controlled accounts; never use existing learners' private records. |
| Account deletion | Target account removed, other account preserved | Confirm the exact disposable account immediately before irreversible deletion. |
| Exercises and interface | Learner understands task, attempts it, opens hints/solution and explains result; VI/EN, phone/desktop, both themes | One consolidated reviewed build with the list of newly authored labs. |
| Windows package | Start without Git/source checkout, onboarding, exercise, persistence, backup/restore | Clean Windows machine or disposable VM; previous archive inspection is not runtime acceptance. |
| Public release and support | Private security contact, actual learner feedback, final artifacts | Maintainer chooses contact; external invitations and publication retain their own authorization boundaries. |

New lab in this implementation batch: **Core models** (`exercise-3-models`).
Its Python tests and browser checks can run locally without SMTP, cloud mutations,
Docker or manual account acceptance. Remaining labs should be authored in bounded
slices with runnable examples; placeholders must not be counted as complete solutions.

This queue consolidates the open checks; it does not replace them with inferred success.

Responsive follow-up (2026-10-09): signed-in Today now uses a drawer through 1100
CSS pixels and a wrapping header. Local production-build checks cover VI/EN,
light/dark, 13 widths from 320 to 1440, header overlap/overflow and menu focus.
In the final device round, revisit the reported phone using its actual browser,
URL and zoom/text-size settings, including portrait and landscape. Chromium
emulation is not physical-device or Safari acceptance. The change is not deployed.
