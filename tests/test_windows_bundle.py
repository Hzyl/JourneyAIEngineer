from types import SimpleNamespace

import pytest

from scripts.verify_windows_bundle import REQUIRED_MODULES, verify_data


class Archive:
    def __init__(self, files, modules=REQUIRED_MODULES):
        self.files = files
        self.toc = {**dict.fromkeys(files), "PYZ.pyz": None}
        self.modules = modules

    def extract(self, name):
        return self.files[name]

    def open_embedded_archive(self, name):
        assert name == "PYZ.pyz"
        return SimpleNamespace(toc=dict.fromkeys(self.modules))


EXPECTED = {"content/task.py": b"teaching example", "dist/index.html": b"current frontend"}


def test_bundle_accepts_windows_paths_and_exact_bytes():
    archive = Archive({name.replace("/", "\\"): content for name, content in EXPECTED.items()})
    assert verify_data(archive, EXPECTED) == {
        "content_files": 1, "frontend_files": 1, "required_modules": len(REQUIRED_MODULES),
    }


@pytest.mark.parametrize("extra", ["content/__pycache__/task.pyc", "content/.env", "dist/old.js"])
def test_bundle_rejects_unexpected_data(extra):
    with pytest.raises(ValueError, match="extra="):
        verify_data(Archive({**EXPECTED, extra: b"unwanted"}), EXPECTED)


def test_bundle_rejects_missing_task_and_stale_frontend():
    with pytest.raises(ValueError, match="missing="):
        verify_data(Archive({"dist/index.html": EXPECTED["dist/index.html"]}), EXPECTED)
    with pytest.raises(ValueError, match="differs from source: dist/index.html"):
        verify_data(Archive({**EXPECTED, "dist/index.html": b"old frontend"}), EXPECTED)


def test_bundle_rejects_missing_recovery_module():
    with pytest.raises(ValueError, match="Missing runtime modules"):
        verify_data(Archive(EXPECTED, REQUIRED_MODULES - {"apps.api.backup_recovery"}), EXPECTED)


def test_bundle_rejects_duplicate_normalized_paths():
    with pytest.raises(ValueError, match="Duplicate normalized"):
        verify_data(Archive({**EXPECTED, "content\\task.py": b"ambiguous"}), EXPECTED)
