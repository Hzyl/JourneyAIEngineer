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
    }
    for name, text in files.items():
        file = root / name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(text, encoding="utf-8")
    target = packager.create_source_archive(root, tmp_path / "output", "1.2.3")
    with zipfile.ZipFile(target) as archive:
        assert set(archive.namelist()) == {
            "package.json", "src/new.ts", "supabase/migrations/001.sql", "content/example.json", "SOURCE-MANIFEST.json",
        }
        manifest = json.loads(archive.read("SOURCE-MANIFEST.json"))
        for name, digest in manifest["files"].items():
            assert hashlib.sha256(archive.read(name)).hexdigest() == digest
    with pytest.raises(ValueError, match="version"):
        packager.create_source_archive(root, tmp_path / "other", "9.9.9")
    with pytest.raises(FileExistsError):
        packager.create_source_archive(root, tmp_path / "output", "1.2.3")
