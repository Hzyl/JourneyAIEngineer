"""Run the Markdown examples and independently verify evidence boundaries."""
from pathlib import Path
import subprocess
import sys

import pytest
import yaml

SOURCE = Path(__file__).resolve().parents[1] / "content/lessons/phase-12-genai-rag-rag-foundations-2.md"


def lesson():
    return yaml.safe_load(SOURCE.read_text(encoding="utf-8").split("---", 2)[1])


def implementation():
    ns = {"__name__": "lesson"}
    exec(lesson()["code_examples"][0]["code"], ns)
    assert "split_document" in ns, "lesson must teach executable chunking"
    return ns


def checker():
    ns = {"__name__": "checker"}
    code = lesson()["code_examples"][1]["code"].replace(
        "from chunk_documents import split_document, assemble_context", "")
    exec(code, ns)
    return ns["check_chunking"]


def test_two_markdown_examples_run_with_exact_stdout(tmp_path):
    examples = lesson()["code_examples"]
    assert len(examples) == 2
    for name, example in zip(("chunk_documents.py", "check_chunking.py"), examples):
        path = tmp_path / name
        path.write_text(example["code"], encoding="utf-8")
        result = subprocess.run([sys.executable, "-X", "utf8", str(path)], cwd=tmp_path,
                                capture_output=True, text=True, encoding="utf-8", timeout=10)
        assert result.returncode == 0, result.stderr
        assert result.stdout == example["expected_output"].rstrip("\n") + "\n"


def test_source_spans_preserve_blank_lines_whitespace_and_version():
    split = implementation()["split_document"]
    doc = {"id": "vi", "version": "v2", "text": "# Đổi trả\n  Điều kiện.  \n\nNgoại lệ.\n# Sau\nCuối."}
    line, section = split(doc, "line"), split(doc, "section")
    assert [(c["line_start"], c["line_end"]) for c in line] == [(2, 2), (4, 4), (6, 6)]
    assert [(c["line_start"], c["line_end"]) for c in section] == [(1, 4), (5, 6)]
    assert line[0]["text"] == "  Điều kiện.  "
    for chunks in (line, section):
        assert len({c["chunk_id"] for c in chunks}) == len(chunks)
        for c in chunks:
            assert c["document_id"] == "vi" and c["version"] == "v2"
            assert c["text"] == "\n".join(doc["text"].splitlines()[c["line_start"] - 1:c["line_end"]])


def test_top_one_line_loses_exception_while_section_retains_it():
    ns = implementation()
    doc = ns["DOCUMENT"]
    for mode, expected in (("line", False), ("section", True)):
        top = next(c for c in ns["split_document"](doc, mode) if "refund" in c["text"].lower())
        assert ns["CONDITION"] in top["text"]
        assert (ns["EXCEPTION"] in top["text"]) is expected


def test_budget_includes_labels_and_separator_without_truncating():
    ns = implementation()
    chunks = ns["split_document"](ns["DOCUMENT"], "section")
    blocks = [f"[{c['document_id']}@{c['version']}/{c['chunk_id']}:L{c['line_start']}-L{c['line_end']}]\n{c['text']}" for c in chunks]
    exact = len("\n\n".join(blocks))
    packed = ns["assemble_context"](chunks, exact)
    assert packed["context"] == "\n\n".join(blocks)
    assert packed["skipped"] == []
    short = ns["assemble_context"](chunks, exact - 1)
    assert short["context"] == blocks[0]
    assert len(short["skipped"]) == 1
    empty = ns["assemble_context"](chunks[:1], len(blocks[0]) - 1)
    assert empty["context"] == "" and len(empty["skipped"]) == 1
    assert empty["status"] == "insufficient evidence"


@pytest.mark.parametrize("bad", [None, {}, {"id": "x"}, {"id": "x", "version": "1", "text": " "},
    {"id": "x", "version": "1", "text": "# Heading\n\n"}])
def test_invalid_document_rejected(bad):
    with pytest.raises(ValueError):
        implementation()["split_document"](bad, "section")


@pytest.mark.parametrize("budget", [-1, 1.5, True, "10"])
def test_invalid_budget_rejected(budget):
    with pytest.raises(ValueError):
        implementation()["assemble_context"]([], budget)


def test_checker_rejects_missing_metadata_lost_exception_and_budget_cut():
    ns, check = implementation(), checker()
    split, pack = ns["split_document"], ns["assemble_context"]
    assert check(split, pack)

    def missing(doc, mode):
        chunks = split(doc, mode)
        for c in chunks:
            c.pop("version")
        return chunks

    def lost(doc, mode):
        chunks = split(doc, mode)
        if mode == "section":
            chunks[0]["text"] = "\n".join(chunks[0]["text"].splitlines()[:2])
            chunks[0]["line_end"] = 2
        return chunks

    def cut(chunks, budget):
        result = pack(chunks, 10000)
        result["context"] = result["context"][:budget]
        return result

    for bad in (missing, lost):
        with pytest.raises((AssertionError, KeyError, ValueError)):
            check(bad, pack)
    with pytest.raises(AssertionError):
        check(split, cut)


def test_relationships_and_web_path_preserved():
    data = lesson()
    assert data["prerequisites"] == ["phase-12-genai-rag-rag-foundations-1", "phase-11-llm-application-llm-application-1"]
    assert data["exercise_ids"] == ["exercise-12-rag-foundations"]
    assert [c["id"] for c in data["review_cards"]] == data["review_item_ids"]
    assert [c["type"] for c in data["review_cards"]] == ["recall", "application", "debug", "interview"]
    for language in ("vi", "en"):
        instructions = " ".join(c[f"explanation_{language}"] for c in data["code_examples"])
        assert "%%writefile chunk_documents.py" in instructions
        assert "%%writefile check_chunking.py" in instructions
        assert "!python check_chunking.py" in instructions


@pytest.mark.parametrize("field", ["document_id", "version", "chunk_id", "line_start", "line_end", "text"])
def test_context_rejects_missing_provenance(field):
    ns = implementation()
    chunk = ns["split_document"](ns["DOCUMENT"], "section")[0]
    del chunk[field]
    with pytest.raises(ValueError):
        ns["assemble_context"]([chunk], 1000)


def test_skip_oversized_section_then_include_later_whole_section():
    ns = implementation()
    chunks = ns["split_document"](ns["DOCUMENT"], "section")
    label = "policy@v1/section-2:L4-L5"
    expected = f"[{label}]\n# Contact\nEmail support."
    result = ns["assemble_context"](chunks, len(expected))
    assert result == {"context": expected, "included": [label],
                      "skipped": ["policy@v1/section-1:L1-L3"],
                      "status": "insufficient evidence"}


def test_context_rejects_duplicate_identity_and_inconsistent_span():
    ns = implementation()
    chunk = ns["split_document"](ns["DOCUMENT"], "section")[0]
    with pytest.raises(ValueError, match="duplicate"):
        ns["assemble_context"]([chunk, dict(chunk)], 1000)
    with pytest.raises(ValueError, match="span"):
        ns["assemble_context"]([{**chunk, "line_end": 2}], 1000)


def test_section_grouping_can_lose_cross_heading_exception():
    ns = implementation()
    doc = {**ns["DOCUMENT"], "text": "# Returns\n" + ns["CONDITION"] + "\n# Exclusions\n" + ns["EXCEPTION"]}
    chunks = ns["split_document"](doc, "section")
    top = next(c for c in chunks if "refund" in c["text"].lower())
    assert ns["EXCEPTION"] not in top["text"]


@pytest.mark.parametrize("text,spans", [
    ("# Returns\nRefund.\n\n# Contact\nEmail.", [(1, 3), (4, 5)]),
    ("# Returns\nRefund.\n\n\n# Contact\nEmail.", [(1, 4), (5, 6)]),
    ("# Returns\nRefund.\n\n\n", [(1, 4)]),
    ("# Returns\r\nRefund.\r\n\r\n# Contact\r\nEmail.\r\n\r\n", [(1, 3), (4, 6)]),
])
def test_section_context_preserves_terminal_blank_source_lines(text, spans):
    ns = implementation()
    document = {"id": "policy", "version": "v1", "text": text}
    chunks = ns["split_document"](document, "section")
    source_lines = text.splitlines()
    assert [(c["line_start"], c["line_end"]) for c in chunks] == spans
    expected_blocks = []
    for number, (chunk, (start, end)) in enumerate(zip(chunks, spans), 1):
        # Source line positions include empty lines; CRLF is normalized to LF.
        original_span = "\n".join(source_lines[start - 1:end])
        assert chunk["text"] == original_span
        assert original_span.endswith("\n") or end == len(source_lines)
        expected_blocks.append(f"[policy@v1/section-{number}:L{start}-L{end}]\n{original_span}")
    expected = "\n\n".join(expected_blocks)
    result = ns["assemble_context"](chunks, len(expected))
    assert result["context"] == expected
    assert result["skipped"] == []
    assert result["status"] == "packed"
