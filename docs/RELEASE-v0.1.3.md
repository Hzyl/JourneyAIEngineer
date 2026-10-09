# v0.1.3 — local release candidate

Status: prepared locally, not tagged or published. The latest GitHub Release
verified on 2026-10-08 is v0.1.2. Keep its existing assets unchanged.

A newer candidate was built from `9bd2a7ccd359013d391a30f2d32bc392c74ca7b4`
in `.build/release-9bd2a7c-20261009/`. It includes the session/OTP frontend and
the E2E configuration fix. The source verification record matched 636 files
against that commit (357 differed only in line endings); embedded inspection
verified 272 content files, 22 frontend files and six required runtime modules.
The executable was not launched and the candidate was not published.

Recorded SHA-256 checksums, also present in that directory's `SHA256SUMS.txt`:

| Artifact | SHA-256 |
| --- | --- |
| Windows ZIP | `e291e7eed9782144a69f15dfe56a5ae15d3dfea6d0e41949962ff220dabfda7a` |
| Source ZIP | `36d63e255efaa565ac6d93cf17610b3061ba4856b67c98dbcb940f3127228b52` |

The current uncommitted Core models extension is **not** in these two archives.
Its review packet contains a separate working-tree source snapshot. Rebuild the
Windows/source pair together from the approved final release commit before
publishing; never relabel an older artifact as the latest source.

## Changes included

- Read exercise instructions inside the app, with concise lists, search, difficulty
  filtering, step-by-step guidance, hints and downloadable practice files.
- Reveal a reference solution when ready. Thirteen of 52 exercises have authored
  solutions; exercises without one say so rather than presenting generic answers.
- Improve VI/EN, light/dark readability, navigation, search and recovery feedback.
- Strengthen local backup validation and recovery, with a source ZIP usable without Git.
- Include the hosted export/deletion UI and reviewed backend migration sources.
  The approved backend and web checkpoint are already deployed separately.

## Candidate artifacts

- `JourneyAIEngineer-v0.1.3-windows-x64.zip`: portable app and onboarding documents.
- `JourneyAIEngineer-v0.1.3-source.zip`: public source and per-file hash manifest.
- `SHA256SUMS.txt`: checksums for the exact ZIPs in the same candidate directory.

Use a fresh output directory. Verify both archive hashes, source manifest/version,
private-file exclusions and embedded executable resources. Source archive checks
do not require a Git checkout. Do not label a preview ZIP as an uploaded release.

## Acceptance and publication

CI and deployment evidence through `9bd2a7c` are recorded in
[release readiness](RELEASE-READINESS.md). The version remains 0.1.3 and lesson IDs
stay stable. Adding the Core models files intentionally changes the content
fingerprint; it must not be confused with the catalog inside the older archives.

The candidate packaging pipeline must pass before review. Its build/inspection
report is separate from Windows runtime acceptance: a clean-machine launch,
missing-Python flow, learner workspace and backup restore still need observation.
An earlier executable launch was rejected by automatic approval review; the
packaging process only inspects the executable and does not launch it.

Real email/account acceptance, a maintainer-approved private support contact and
actual learner pilot evidence also remain open in [the checklist](PRODUCTION-ACCEPTANCE.md).
Commit/push, tag creation and release upload require approval of the exact artifacts
and destination. Preparing this candidate does not authorize publication.
