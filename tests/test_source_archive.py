import hashlib
import importlib.util
import json
import zipfile
from pathlib import Path

import pytest

SPEC = importlib.util.spec_from_file_location(
    "package_source", Path(__file__).resolve().parents[1] / "scripts" / "package_source.py",
)
packager = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(packager)


def test_source_archive_includes_untracked_code_but_no_runtime_or_private_data(tmp_path):
    root = tmp_path / "repo"
    files = {
        "package.json": '{"version":"1.2.3"}', "src/new.ts": "export const answer = 42",
        "supabase/migrations/001.sql": "select 1;", "AGENTS.md": "private instructions",
        ".env": "secret", "src/.env.local": "secret", ".data/journey.db": "private",
        "journal/weekly/private.md": "private", ".codex/auth.json": "secret",
        "apps/api/__pycache__/app.pyc": "binary", "content/example.json": "{}",
        "playwright.production.config.ts": "export default {}",
        "src/.ENV.production": "private", "docs/Secrets/credentials.txt": "private",
        "src/.pytest_cache/state.json": "private", "docs/AGENTS.MD": "private instructions",
        "apps/api/state.DB-WAL": "private", "apps/api/state.sqlite3-shm": "private",
        "apps/api/state.db-journal": "private", "apps/api/state.db3": "private",
    }
    for name, text in files.items():
        file = root / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(text, encoding="utf-8")
    target = packager.create_source_archive(root, tmp_path / "output", "1.2.3")
    with zipfile.ZipFile(target) as archive:
        assert set(archive.namelist()) == {
            "package.json", "src/new.ts", "supabase/migrations/001.sql", "content/example.json",
            "playwright.production.config.ts", "SOURCE-MANIFEST.json",
        }
        manifest = json.loads(archive.read("SOURCE-MANIFEST.json"))
        for name, digest in manifest["files"].items():
            assert hashlib.sha256(archive.read(name)).hexdigest() == digest
    with pytest.raises(ValueError, match="version"):
        packager.create_source_archive(root, tmp_path / "other", "9.9.9")
    with pytest.raises(FileExistsError):
        packager.create_source_archive(root, tmp_path / "output", "1.2.3")


def test_source_archive_blocks_embedded_secret_marker_before_writing_a_zip(tmp_path):
    root = tmp_path / "repo"
    (root / "src").mkdir(parents=True)
    (root / "package.json").write_text('{"version":"1.2.3"}', encoding="utf-8")
    marker = "ghp_" + "x" * 24
    (root / "src" / "new.ts").write_text(f"const token = '{marker}'", encoding="utf-8")
    output = tmp_path / "output"
    with pytest.raises(ValueError, match="values withheld") as failure:
        packager.create_source_archive(root, output, "1.2.3")
    assert "src/new.ts" in str(failure.value)
    assert marker not in str(failure.value)
    assert not output.exists()


def test_source_archive_is_reproducible_and_verifiable_without_git(tmp_path):
    root = tmp_path / "repo"
    root.mkdir()
    (root / "package.json").write_text('{"version":"1.2.3"}', encoding="utf-8")
    (root / "README.md").write_text("Source snapshot", encoding="utf-8")
    first = packager.create_source_archive(root, tmp_path / "one", "1.2.3")
    second = packager.create_source_archive(root, tmp_path / "two", "1.2.3")
    assert first.read_bytes() == second.read_bytes()
    digest, filename = first.with_suffix(".zip.sha256").read_text().split()
    assert digest == hashlib.sha256(first.read_bytes()).hexdigest()
    assert filename == first.name
    with zipfile.ZipFile(first) as archive:
        assert all(not name.startswith(".git/") for name in archive.namelist())
        manifest = json.loads(archive.read("SOURCE-MANIFEST.json"))
        assert set(manifest["files"]) == set(archive.namelist()) - {"SOURCE-MANIFEST.json"}


def test_windows_content_bundle_excludes_cache_and_private_files_without_deleting_them(tmp_path):
    root = tmp_path / "repo"
    allowed = {"content/lessons.json", "content/exercise_templates/example/starter.py",
               "content/worked_solutions/example/requirements.txt"}
    excluded = {"content/exercise_templates/example/__pycache__/starter.cpython-311.pyc",
                "content/.env", "content/private.sqlite3", "content/Secrets/token.txt", "src/app.ts"}
    for name in allowed | excluded:
        file = root / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text("synthetic fixture", encoding="utf-8")
    entries = packager.content_bundle_data(root)
    sources = {Path(source).relative_to(root).as_posix() for source, _ in entries}
    destinations = {f"{destination}/{Path(source).name}" for source, destination in entries}
    assert sources == destinations == allowed
    assert all((root / name).is_file() for name in excluded)
