"""Read a PyInstaller archive without executing it; reject stale or extra app data."""

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
from scripts.package_source import source_files

REQUIRED_MODULES = {
    "apps.api.backup_lock", "apps.api.backup_recovery", "apps.api.backup_validation",
    "apps.api.backup_journal", "apps.api.security_source_checks", "apps.api.security_audit_copy",
}


def verify_data(reader, expected: dict[str, bytes]) -> dict[str, int]:
    names = {name.replace("\\", "/"): name for name in reader.toc}
    if len(names) != len(reader.toc):
        raise ValueError("Duplicate normalized archive paths")
    actual = {name for name in names if name.startswith(("content/", "dist/"))}
    missing, extra = set(expected) - actual, actual - set(expected)
    if missing or extra:
        raise ValueError(f"Embedded data mismatch: missing={sorted(missing)}, extra={sorted(extra)}")
    for name, content in expected.items():
        if reader.extract(names[name]) != content:
            raise ValueError(f"Embedded file differs from source: {name}")
    archives = [name for name in reader.toc if name.endswith(".pyz")]
    if len(archives) != 1:
        raise ValueError("Expected exactly one embedded Python module archive")
    modules = reader.open_embedded_archive(archives[0]).toc
    missing_modules = REQUIRED_MODULES - set(modules)
    if missing_modules:
        raise ValueError(f"Missing runtime modules: {sorted(missing_modules)}")
    return {"content_files": sum(name.startswith("content/") for name in actual),
            "frontend_files": sum(name.startswith("dist/") for name in actual),
            "required_modules": len(REQUIRED_MODULES)}


def inspect_bundle(executable: Path, root: Path) -> dict:
    from PyInstaller.archive.readers import CArchiveReader

    files = [file for file in source_files(root) if file.relative_to(root).parts[0] == "content"]
    files.extend(file for file in (root / "dist").rglob("*") if file.is_file())
    for file in files:
        if file.is_symlink() or root.resolve() not in file.resolve().parents:
            raise ValueError("Linked or external bundle input")
    expected = {file.relative_to(root).as_posix(): file.read_bytes() for file in files}
    if "dist/index.html" not in expected or "content/curriculum.json" not in expected:
        raise ValueError("Missing production frontend or curriculum input")
    counts = verify_data(CArchiveReader(str(executable)), expected)
    return {"status": "passed", "check": "embedded data and required module inventory",
            "executable_sha256": hashlib.sha256(executable.read_bytes()).hexdigest(),
            "executed": False, "runtime_verified": False, **counts}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("executable", type=Path)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    report = inspect_bundle(args.executable.resolve(), args.root.resolve())
    text = json.dumps(report, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        # A reviewed report must not be silently overwritten.
        with args.report.open("x", encoding="utf-8") as target:
            target.write(text)
    print(text)


if __name__ == "__main__":
    main()
