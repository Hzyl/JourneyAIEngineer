"""Verify the exact downloadable teaching files in a fresh directory."""
from pathlib import Path
import shutil
import subprocess
import sys

import pytest


ROOT = Path(__file__).resolve().parents[1] / "content" / "worked_solutions"


@pytest.mark.parametrize("slug,test_count", [
    ("exercise-1-python-core", 5), ("exercise-1-reliable-code", 5), ("exercise-1-data-files", 5),
    ("exercise-1-developer-tools", 5), ("exercise-1-sql-structures", 5),
    ("exercise-3-ml-framing", 6),
    ("exercise-3-models", 11),
])
def test_downloadable_worked_solution_runs_without_external_packages(slug, test_count, tmp_path):
    destination = tmp_path / slug
    shutil.copytree(ROOT / slug, destination, ignore=shutil.ignore_patterns("__pycache__"))
    result = subprocess.run(
        [sys.executable, "-S", "-m", "unittest", "-v", "test_solution.py"],
        cwd=destination, capture_output=True, text=True, timeout=20,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    assert f"Ran {test_count} tests" in result.stderr


def test_debugging_regression_rejects_the_original_bug(tmp_path):
    source = ROOT / "exercise-1-reliable-code"
    shutil.copytree(source, tmp_path, dirs_exist_ok=True, ignore=shutil.ignore_patterns("__pycache__"))
    test_path = tmp_path / "test_solution.py"
    test_path.write_text(
        test_path.read_text(encoding="utf-8").replace("from tags import add_tag", "from buggy import add_tag"),
        encoding="utf-8",
    )
    result = subprocess.run(
        [sys.executable, "-S", "-m", "unittest", "-v", "test_solution.TagTests.test_calls_are_independent"],
        cwd=tmp_path, capture_output=True, text=True, timeout=10,
    )
    assert result.returncode == 1
    assert "FAIL: test_calls_are_independent" in result.stderr
    assert "AssertionError" in result.stderr
    assert "ImportError" not in result.stderr
