import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[1] / "content/exercise_templates"
SLUGS = ["exercise-0-environment", "exercise-0-baseline", "exercise-0-learning-system"]


@pytest.mark.parametrize("slug", SLUGS)
def test_topic_checks_reject_starter_and_nonsense_but_accept_reference(tmp_path, slug):
    template = ROOT / slug
    manifest = json.loads((template / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["exercise_slug"] == slug
    assert manifest["assessment_kind"] == "verified"
    shutil.copyfile(template / "test_exercise.py", tmp_path / "test_exercise.py")
    command = [sys.executable, "-B", "-m", "unittest", "-v", "test_exercise.py"]
    for name, expected in [("starter.py", False), ("reference.py", True)]:
        shutil.copyfile(template / name, tmp_path / "starter.py")
        result = subprocess.run(command, cwd=tmp_path, capture_output=True, text=True, timeout=15)
        assert (result.returncode == 0) == expected, f"{slug}/{name}: {result.stderr}"
    wrong = "\n".join(
        f"def {name}(*args):\n    return {{'result': 'ok', 'explanation': 'verified'}}"
        for name in ("inspect_environment", "summarize_scores", "total_study_minutes")
    )
    (tmp_path / "starter.py").write_text(wrong, encoding="utf-8")
    result = subprocess.run(command, cwd=tmp_path, capture_output=True, text=True, timeout=15)
    assert result.returncode != 0, "An irrelevant dictionary must not pass topic checks"
