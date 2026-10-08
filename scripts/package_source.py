"""Create a source ZIP without Git, using a public-source allowlist and file hashes."""
import argparse
import hashlib
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
from scripts.source_secrets import redacted_report, scan_payloads

DIRECTORIES = {"src", "apps", "content", "docs", "scripts", "packaging", "public", "tests", "samples", ".github"}
ROOT_FILES = {
    "README.md", "CONTRIBUTING.md", "SECURITY.md", "LICENSE", "package.json", "package-lock.json",
    "index.html", "vite.config.ts", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json",
    "playwright.config.ts", "playwright.hosted.config.ts", "playwright.production.config.ts",
    "pytest.ini", ".gitignore", ".oxlintrc.json",
}
EXACT_FILES = {"supabase/config.toml", "supabase/seed.sql", "journal/weekly/TEMPLATE.md",
               "exercises/README.md", "projects/README.md"}
BLOCKED_PARTS = {".git", ".data", ".codex", ".omx", "node_modules", "__pycache__", ".venv", "secrets",
                 ".build", ".pytest_cache", "test-results", "playwright-report"}
BLOCKED_SUFFIXES = {".pyc", ".pyo", ".db", ".sqlite", ".sqlite3", ".pem", ".key", ".exe", ".log"}
BLOCKED_SUFFIXES.update(f"{database}{sidecar}" for database in (".db", ".db3", ".sqlite", ".sqlite3")
                        for sidecar in ("", "-wal", "-shm", "-journal"))


def source_files(root: Path) -> list[Path]:
    result = []
    candidates = {root / name for name in ROOT_FILES | EXACT_FILES}
    for directory in DIRECTORIES | {"supabase/migrations", "supabase/tests", "supabase/functions"}:
        candidates.update((root / directory).rglob("*"))
    for file in sorted(candidates):
        relative = file.relative_to(root)
        parts = relative.parts
        name = relative.as_posix()
        allowed = (name in ROOT_FILES or name in EXACT_FILES or parts[0] in DIRECTORIES
                   or name.startswith(("supabase/migrations/", "supabase/tests/", "supabase/functions/")))
        if not allowed or any(part.casefold() in BLOCKED_PARTS for part in parts):
            continue
        if file.name.casefold() == "agents.md" or file.name.casefold().startswith(".env") or file.suffix.lower() in BLOCKED_SUFFIXES:
            continue
        if not file.is_file():
            continue
        if file.is_symlink() or root.resolve() not in file.resolve().parents:
            raise ValueError(f"Source archive cannot include external or linked files: {name}")
        result.append(file)
    return result


def create_source_archive(root: Path, output: Path, version: str) -> Path:
    actual_version = json.loads((root / "package.json").read_text(encoding="utf-8"))["version"]
    if version != actual_version:
        raise ValueError("Source version must match package.json; update version before creating a release")
    files = source_files(root)
    payloads = {file.relative_to(root).as_posix(): file.read_bytes() for file in files}
    findings = scan_payloads(payloads)
    if findings:
        raise ValueError(redacted_report(findings))
    manifest = {
        "format": "journey-source-manifest", "schema_version": 1, "app_version": version,
        "origin": "working-tree snapshot; not evidence of a published release",
        "files": {name: hashlib.sha256(data).hexdigest() for name, data in payloads.items()},
    }
    payloads["SOURCE-MANIFEST.json"] = (json.dumps(manifest, indent=2) + "\n").encode()
    output.mkdir(parents=True, exist_ok=True)
    target = output / f"JourneyAIEngineer-v{version}-source.zip"
    # Exclusive creation prevents silently replacing a previously reviewed release.
    with zipfile.ZipFile(target, "x", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, data in payloads.items():
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    checksum = hashlib.sha256(target.read_bytes()).hexdigest()
    target.with_suffix(".zip.sha256").write_text(f"{checksum}  {target.name}\n", encoding="ascii")
    return target


def content_bundle_data(root: Path) -> list[tuple[str, str]]:
    """Select authored content for PyInstaller with the source archive boundary."""
    return [(str(file), file.relative_to(root).parent.as_posix()) for file in source_files(root)
            if file.relative_to(root).parts[0] == "content"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / ".build" / "source-preview")
    parser.add_argument("--version", default=json.loads((ROOT / "package.json").read_text())["version"])
    args = parser.parse_args()
    print(create_source_archive(ROOT, args.output.resolve(), args.version))


if __name__ == "__main__":
    main()
