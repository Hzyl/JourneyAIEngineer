# v0.1.3 — local release candidate

Status: prepared locally, not tagged or published. The latest GitHub Release
verified on 2026-10-08 is v0.1.2. Keep its existing assets unchanged.

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

CI and guest web acceptance for the preceding application checkpoint `5518493`
are recorded in [release readiness](RELEASE-READINESS.md). The version bump does
not add lesson IDs or change the catalog content fingerprint.

The candidate packaging pipeline must pass before review. Its build/inspection
report is separate from Windows runtime acceptance: a clean-machine launch,
missing-Python flow, learner workspace and backup restore still need observation.
An earlier executable launch was rejected by automatic approval review; the
packaging process only inspects the executable and does not launch it.

Real email/account acceptance, a maintainer-approved private support contact and
actual learner pilot evidence also remain open in [the checklist](PRODUCTION-ACCEPTANCE.md).
Commit/push, tag creation and release upload require approval of the exact artifacts
and destination. Preparing this candidate does not authorize publication.
