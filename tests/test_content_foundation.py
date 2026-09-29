from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"


def test_every_curriculum_lesson_has_canonical_markdown_source() -> None:
    curriculum = json.loads((CONTENT / "curriculum.json").read_text(encoding="utf-8"))
    expected = {
        f"{phase['slug']}-{module['slug']}-{index + 1}"
        for phase in curriculum["phases"]
        for module in phase["modules"]
        for index, _ in enumerate(module["lessons"])
    }
    sources = {path.stem for path in (CONTENT / "lessons").glob("*.md")}
    assert sources == expected


def test_build_is_deterministic_and_preserves_catalog_shape(tmp_path: Path) -> None:
    output = tmp_path / "lessons.json"
    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build_lesson_catalog.py"), "--output", str(output)],
        check=True,
        cwd=ROOT,
    )
    generated = json.loads(output.read_text(encoding="utf-8"))
    checked_in = json.loads((CONTENT / "lessons.json").read_text(encoding="utf-8"))
    assert generated == checked_in
    assert set(generated) == {"schema_version", "lessons"}
    assert len(generated["lessons"]) == 208


def test_accelerated_track_has_explicit_lesson_map_and_workload() -> None:
    curriculum = json.loads((CONTENT / "curriculum.json").read_text(encoding="utf-8"))
    track = curriculum["program"]["accelerated_track"]
    assert track["weeks"] == curriculum["program"]["accelerated_weeks"]
    assert len(track["lesson_map"]) == 208
    assert {entry["lesson_id"] for entry in track["lesson_map"]}
    assert all(entry["week"] >= 1 and entry["workload_minutes"] > 0 for entry in track["lesson_map"])


def test_strict_content_validator_passes() -> None:
    from scripts.validate_content import validate

    validate()


def test_topic_formulas_are_not_generic_for_core_math_topics() -> None:
    from scripts.build_lesson_catalog import formula_for, kind_for

    assert "Av = λv" in formula_for("math", "Eigenvalue, eigenvector và PCA")
    assert any("f'(x)" in formula or "df" in formula for formula in formula_for("math", "Hàm số và đạo hàm"))
    assert any("log" in formula.lower() for formula in formula_for("math", "Maximum likelihood"))
    optimizer_formulas = formula_for("math", "SGD, momentum và Adam")
    assert any("m_t" in formula for formula in optimizer_formulas)
    assert any("v_t" in formula for formula in optimizer_formulas)
    assert kind_for("Tokenization", 16) == "llm"


def test_every_lesson_has_four_typed_review_cards() -> None:
    catalog = json.loads((CONTENT / "lessons.json").read_text(encoding="utf-8"))
    required_types = {"recall", "application", "debug", "interview"}
    for lesson in catalog["lessons"]:
        cards = lesson["review_cards"]
        assert len(cards) >= 4, lesson["lesson_id"]
        assert {card["type"] for card in cards} >= required_types
        assert lesson["review_item_ids"] == [card["id"] for card in cards]
        assert all(card["question_vi"] and card["answer_vi"] and card["hint_vi"] for card in cards)
