import json
import subprocess
import sys
from pathlib import Path

from apps.api.catalog_content import load_lesson_catalog


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"


def test_first_ten_lessons_are_curated_without_losing_stable_cards():
    legacy = json.loads((CONTENT / "lessons.json").read_text(encoding="utf-8"))["lessons"]
    effective = load_lesson_catalog(CONTENT / "lessons.json")
    for old in legacy[:10]:
        lesson = effective[old["lesson_id"]]
        assert lesson["quality_status"] == "reviewed"
        assert lesson["review_item_ids"] == old["review_item_ids"]
        assert "input → biến đổi → output" not in lesson["summary_vi"]
        assert "class Result:" not in str(lesson["code_examples"])
        assert lesson["learning_objectives_en"]
        assert lesson["completion_checklist_en"]
        assert lesson["common_mistakes_en"]
        assert len(lesson["review_cards"]) == 4
        assert len((CONTENT / "curated" / f"{old['lesson_id']}.json").read_text(encoding="utf-8").splitlines()) < 300


def test_controlled_curated_python_examples_run_without_packages(tmp_path):
    lessons = load_lesson_catalog(CONTENT / "lessons.json")
    for lesson in list(lessons.values())[:10]:
        for example in lesson["code_examples"]:
            if example["language"] != "python":
                continue
            result = subprocess.run(
                [sys.executable, "-I", "-c", example["code"]], cwd=tmp_path,
                capture_output=True, text=True, timeout=10,
            )
            assert result.returncode == 0, f"{lesson['lesson_id']}: {result.stderr}"
            assert result.stdout.strip(), lesson["lesson_id"]


def test_topic_specific_examples_cover_the_claimed_intro_skills():
    lessons = list(load_lesson_catalog(CONTENT / "lessons.json").values())
    assert "sys.executable" in lessons[0]["code_examples"][0]["code"]
    assert "sys.base_prefix" in lessons[2]["code_examples"][0]["code"]
    assert "mean_score([]) is None" in lessons[4]["code_examples"][0]["code"]
    assert "git diff --cached" in lessons[6]["code_examples"][0]["code"]
    assert "not the artifact result" in lessons[8]["code_examples"][0]["code"]
