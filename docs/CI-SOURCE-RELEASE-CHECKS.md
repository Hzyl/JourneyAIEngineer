# CI and source archive checks

## Changes — 2026-10-08

The Windows quality job now runs `npm run test:e2e:production` as well as the
local browser suite. This production-build suite uses synthetic Supabase settings
and intercepted private requests; it does not require production credentials or
replace the separate database/RLS/type-generation job. The workflow YAML parses
locally and retains the database type-diff gate. GitHub execution remains pending
commit/push approval; a valid workflow file is not evidence of a successful CI run.

`scripts/source_secrets.py` replaces the old CI shell snippet that printed matching
source lines. The new output contains only relative paths, line numbers and rule
names. Values and surrounding source text are withheld. Its default input is Git
tracked files; `--source-archive` uses the public-source allowlist including newly
created files. It returns nonzero on a match or an inspection failure.

The source packager uses the same checks before writing a ZIP. Its allowlist now
includes `playwright.production.config.ts`, so the production browser command is
present in a source download. It excludes SQLite WAL/SHM/journal files, caches and
private path names regardless of filename case, in addition to the existing
runtime, environment, database, private journal and agent-file exclusions.

## Evidence and limits

Nine targeted tests passed for archive contents, checksums, deterministic archive
bytes, overwrite/version rejection, marker detection, redacted output and blocking
archive creation before writing an embedded marker. Tests use constructed fake
markers only. Both the tracked-source and source-archive CLI scans passed on the
working tree at this checkpoint.

These are common-marker checks, not a complete secret audit. They do not prove the
absence of every credential format or private text embedded in otherwise allowed
source files. Review the exact candidate diff and manifest before publishing.

## Source snapshot verification

A source snapshot can be checked without `.git`: verify every manifest hash,
extract into a fresh ignored directory, run catalog fingerprint/content validation,
and run the packaging/security regressions with an existing prepared Python
interpreter. The archive includes source and dependency manifests, not an installed
environment. Browser tests still require installed Node dependencies and Chromium.

Local snapshots retain the current `package.json` version and explicitly identify
themselves as working-tree snapshots. They are not release uploads. Remote tag
inspection on 2026-10-08 found `v0.1.0`, `v0.1.1` and `v0.1.2`; select and recheck a
new version before publishing. No tag/version or production configuration changed
in this follow-up. Staging, math dependency execution, Windows clean-machine and
maintainer publication gates remain open.

## Verified local snapshot

`.build/source-readiness-20261008-023001/JourneyAIEngineer-v0.1.2-source.zip`
contains 602 files plus its manifest. All manifest hashes and the full-file-list
comparison passed. SHA-256:
`075014bbeb6bc0a67b8b15b89ea64ff300ff3620dc2ec9e2c1e2d4ed31bdd9ac`.

After extraction into a fresh directory without `.git`, catalog fingerprint and
strict validation passed for 23 phases and 208 structured lessons. Fifteen
packaging/secret-marker/source-review tests passed using the existing prepared
Python interpreter. The full working-tree Python suite subsequently passed 132
tests, and the diff whitespace check passed. No fresh-machine dependency setup,
Windows executable launch or hosted database acceptance is implied.

The adjacent `verification.json` records the archive path, file count and checksum.
This evidence entry was written after packaging; the archive preserves the
documentation as it existed at creation time. It does not replace the published
v0.1.2 assets and must be rebuilt with the approved new version for a release.

## Unit discovery correction

Vitest's positional `src/test` filter also matched an extracted archive under
`.build/source-readiness-20261008-023001/extracted/src/test`. The earlier report
of 371 tests therefore combined current tests with old snapshot tests. It must
not be treated as a count of unique current-checkout coverage. The snapshot
files were preserved; deleting them would only hide the discovery problem.

The shared Vite/Vitest configuration now explicitly includes only
`src/test/**/*.test.{ts,tsx}` relative to the active project root. File discovery
before the correction selected 74 files after adding the new Edge input test,
including 36 archived files. Afterward it selected 38 files, exactly matching
every current `*.test.*` file under `src/test`, with no `.build` paths.

The corrected full run passed **202 tests in 38 files**, including eleven new
Edge request-body cases. Its JSON report is `.build/unit-current-results.json`;
before/after file inventories are `.build/unit-files-before.json` and
`.build/unit-files-after.json`. TypeScript, lint, production build and whitespace
checks passed. The source-archive marker scan checked 611 current source files
without a supported marker. All outputs are local evidence, not GitHub CI results.

Existing local and hosted browser counts are unaffected: Playwright already
selects its explicit `tests/e2e` directory. Those suites were not rerun for this
test-discovery and server-input-only follow-up. Earlier source ZIPs preserve their
old configuration and must be regenerated for a release containing this fix.
