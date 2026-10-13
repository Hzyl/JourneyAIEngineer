"""Execute the parent-authored ingestion example and independent provenance checks."""
from pathlib import Path
import subprocess
import sys
import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
ID = "phase-12-genai-rag-rag-foundations-1"
SOURCE = ROOT / "content" / "lessons" / (ID + ".md")


def lesson():
    return yaml.safe_load(SOURCE.read_text(encoding="utf-8").split("---", 2)[1])


def implementation():
    namespace = {"__name__": "lesson"}
    exec(lesson()["code_examples"][0]["code"], namespace)
    return namespace["ingest"]


def acceptance():
    namespace = {"__name__": "checks"}
    code = lesson()["code_examples"][1]["code"].replace("from ingest_documents import ingest", "")
    exec(code, namespace)
    return namespace["check_ingestion"]


def test_two_files_match_exact_stdout(tmp_path):
    for name, example in zip(("ingest_documents.py", "check_ingestion.py"), lesson()["code_examples"]):
        path = tmp_path / name
        path.write_text(example["code"], encoding="utf-8")
        result = subprocess.run([sys.executable, "-X", "utf8", str(path)], cwd=tmp_path,
                                capture_output=True, text=True, encoding="utf-8", timeout=10)
        assert result.returncode == 0, result.stderr
        assert result.stdout.strip() == example["expected_output"].strip()


def test_exact_text_line_heading_and_distinct_versions():
    docs = [{"id": "vi", "version": "1", "text": "# Đầu\n  Có dấu.  \n\n# Sau\nDòng cuối."},
            {"id": "vi", "version": "2", "text": "# Mới\nĐã đổi."}]
    chunks = implementation()(docs)
    assert [c["line"] for c in chunks] == [2, 5, 2]
    assert [c["heading"] for c in chunks] == ["Đầu", "Sau", "Mới"]
    assert chunks[0]["text"] == "  Có dấu.  "
    for chunk in chunks:
        doc = next(d for d in docs if d["version"] == chunk["version"])
        assert chunk["text"] == doc["text"].splitlines()[chunk["line"] - 1]
        assert chunk["source"] == f'vi@{chunk["version"]}:L{chunk["line"]}'


@pytest.mark.parametrize("bad", [None, {}, [], [None], [{"id": "x"}],
    [{"id": "x", "version": "1", "text": " "}],
    [{"id": "x", "version": "1", "text": "# Only a heading"}],
    [{"id": "x", "version": None, "text": "body"}],
    [{"id": " ", "version": "1", "text": "body"}]])
def test_rejects_invalid_inputs(bad):
    with pytest.raises(ValueError):
        implementation()(bad)


def test_duplicate_identity_rejected_even_if_content_changes():
    doc = {"id": "x", "version": "1", "text": "body"}
    with pytest.raises(ValueError, match="duplicate"):
        implementation()([doc, {**doc, "text": "changed"}])


def test_checker_rejects_empty_output_and_plausible_wrong_line_mutant():
    ingest = implementation()
    check = acceptance()
    assert check(ingest)
    with pytest.raises(AssertionError):
        check(lambda documents: [])
    def wrong_line(documents):
        chunks = ingest(documents)
        for number, chunk in enumerate(chunks, 1):
            chunk["line"] = number
            chunk["source"] = f'{chunk["document_id"]}@{chunk["version"]}:L{number}'
        return chunks
    with pytest.raises(AssertionError):
        check(wrong_line)


def test_stable_relationships_and_focused_resources():
    data = lesson()
    assert data["lesson_id"] == ID
    assert data["prerequisites"] == ["phase-11-llm-application-llm-application-4",
                                     "phase-11-llm-application-llm-application-1"]
    assert data["exercise_ids"] == ["exercise-12-rag-foundations"]
    assert [card["id"] for card in data["review_cards"]] == data["review_item_ids"]
    assert len(data["code_examples"]) == 2
    urls = [resource["url"] for resource in data["resources"]]
    assert "https://docling-project.github.io/docling/concepts/chunking/" in urls
    assert any("colab.research.google.com" in url for url in urls)
    assert any(resource["kind"] == "in_app" for resource in data["resources"])
