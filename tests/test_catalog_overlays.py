import json
from pathlib import Path

import pytest

from apps.api.catalog_content import load_lesson_catalog, validate_portfolio_references


ROOT = Path(__file__).resolve().parents[1]


def test_portfolio_projects_resolve_and_invalid_reference_is_rejected():
    curriculum = json.loads((ROOT / "content/curriculum.json").read_text(encoding="utf-8"))
    validate_portfolio_references(curriculum)
    curriculum["program"]["portfolio_projects"][0]["phase_id"] = "missing"
    with pytest.raises(ValueError, match="Unknown portfolio phase"):
        validate_portfolio_references(curriculum)


def test_overlay_replaces_content_without_changing_ids(tmp_path):
    source = json.loads((ROOT / "content/lessons.json").read_text(encoding="utf-8"))["lessons"][0]
    catalog = tmp_path / "lessons.json"
    catalog.write_text(json.dumps({"lessons": [source]}), encoding="utf-8")
    assert load_lesson_catalog(catalog)[source["lesson_id"]]["quality_status"] == "draft"
    overlay = {
        **source, "summary_vi": "Nội dung đã biên tập", "quality_status": "reviewed", "reviewed_at": "2026-10-07",
    }
    (tmp_path / "curated").mkdir()
    file = tmp_path / "curated" / f"{source['lesson_id']}.json"
    file.write_text(json.dumps(overlay), encoding="utf-8")
    assert load_lesson_catalog(catalog)[source["lesson_id"]]["summary_vi"] == "Nội dung đã biên tập"
    overlay["review_item_ids"] = ["renamed-card"]
    file.write_text(json.dumps(overlay), encoding="utf-8")
    with pytest.raises(ValueError, match="stable review_item_ids"):
        load_lesson_catalog(catalog)
