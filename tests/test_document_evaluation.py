import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

import pytest

ROOT = Path(__file__).resolve().parents[1] / "samples" / "vi-document-assistant"
SPEC = importlib.util.spec_from_file_location("document_evaluation", ROOT / "evaluate_lab.py")
lab = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(lab)


@pytest.fixture
def corpus():
    return lab.read_corpus(ROOT / "documents")[0]


@pytest.fixture
def cases(corpus):
    return lab.load_fixture(ROOT / "evaluation_lab.json", corpus)[0]


def write_fixture(tmp_path, cases):
    path = tmp_path / "fixture.json"
    path.write_text(json.dumps(cases, ensure_ascii=False), encoding="utf-8")
    return path


def good_answer(case):
    citation = copy.deepcopy(case["expected"]["citation"])
    return {"abstained": False, "answer": citation["quote"], "citations": [citation]}


@pytest.mark.parametrize("split", ["dev", "test"])
def test_only_selected_split_reaches_solver(split, cases):
    received = []

    def solver(question, directory):
        received.append(question)
        return lab.assistant.answer(question, directory)

    report = lab.evaluate_lab(split, solver=solver)
    assert received == [case["question"] for case in cases if case["split"] == split]
    assert report["overall"]["total"] == 6
    assert {c: r["total"] for c, r in report["categories"].items()} == {
        "answerable": 3, "unanswerable": 2, "ambiguous": 1}
    assert report["run"]["model"] is report["run"]["prompt"] is None
    assert report["provider_cost_usd"] is None
    assert report["run"]["config"] is None
    assert report["provenance"]["assistant_sha256"] is None


@pytest.mark.parametrize("field,value", [
    ("source", "project.md"), ("source", "missing.md"), ("source", "../workshop.md"),
    ("line", 4), ("line", 0), ("line", True), ("quote", "fabricated quote"),
])
def test_wrong_source_line_or_quote_fails(field, value, cases, corpus):
    result = good_answer(cases[0])
    assert lab.score_case(cases[0], result, corpus)["passed"]
    result["citations"][0][field] = value
    score = lab.score_case(cases[0], result, corpus)
    assert not score["passed"]
    assert not score["citation_exact"]


def test_real_but_wrong_evidence_and_unrelated_answer_fail(cases, corpus):
    result = good_answer(cases[1])
    score = lab.score_case(cases[0], result, corpus)
    assert score["citation_exact"] and not score["expected_evidence"]
    assert not score["passed"]
    result = good_answer(cases[0])
    result["answer"] = "An unrelated answer"
    score = lab.score_case(cases[0], result, corpus)
    assert score["citation_exact"] and score["expected_evidence"]
    assert score["failure_reasons"] == ["answer_not_expected_extract"]


@pytest.mark.parametrize("result", [None, {}, {"abstained": False},
    {"abstained": False, "answer": "", "citations": []},
    {"abstained": False, "answer": "Unknown", "citations": []},
    {"abstained": True, "answer": "Unknown", "citations": []}])
def test_missing_or_unknown_answer_fails_answerable(result, cases, corpus):
    assert not lab.score_case(cases[0], result, corpus)["passed"]


def test_all_citations_validated_and_abstention_contract(cases, corpus):
    result = good_answer(cases[0])
    result["citations"].append({"source": "fake.md", "line": 99, "quote": "fake"})
    assert not lab.score_case(cases[0], result, corpus)["passed"]
    unknown = next(case for case in cases if case["category"] == "unanswerable")
    assert not lab.score_case(unknown, good_answer(cases[0]), corpus)["passed"]
    abstention = {"abstained": True, "answer": "Không đủ bằng chứng", "citations": []}
    assert lab.score_case(unknown, abstention, corpus)["passed"]
    abstention["citations"] = good_answer(cases[0])["citations"]
    assert not lab.score_case(unknown, abstention, corpus)["passed"]


def test_empty_category_rates_and_measured_nearest_rank(tmp_path, cases, monkeypatch):
    path = write_fixture(tmp_path, cases[:3])
    ticks = iter([0, .001, 1, 1.002, 2, 2.009])
    monkeypatch.setattr(lab, "perf_counter", lambda: next(ticks))
    report = lab.evaluate_lab("dev", fixture=path)
    assert report["categories"]["unanswerable"] == {"passed": 0, "total": 0, "rate": None}
    assert report["categories"]["ambiguous"]["rate"] is None
    assert report["latency_ms"]["p50"] == pytest.approx(2)
    assert report["latency_ms"]["p95"] == pytest.approx(9)
    assert lab.percentile([], 95) is None


@pytest.mark.parametrize("defect", ["id", "split", "category", "duplicate", "line", "quote", "abstention"])
def test_malformed_fixture_rejected_before_solver(defect, tmp_path, cases):
    if defect == "id":
        cases[1]["id"] = cases[0]["id"]
    elif defect == "duplicate":
        cases[6]["question"] = "BUOI HOC PYTHON TAI PHONG NAO!!!"
    elif defect in ("split", "category"):
        cases[0][defect] = "invalid"
    elif defect in ("line", "quote"):
        cases[0]["expected"]["citation"][defect] = 99 if defect == "line" else "false"
    else:
        cases[3]["expected"]["abstained"] = False
    path = write_fixture(tmp_path, cases)
    with pytest.raises(ValueError):
        lab.evaluate_lab("dev", fixture=path, solver=lambda *args: pytest.fail("Solver called"))


def test_hashes_stable_and_sensitive_to_corpus(tmp_path, cases):
    (tmp_path / "a.md").write_text("Original evidence", encoding="utf-8")
    first = lab.read_corpus(tmp_path)
    assert first == lab.read_corpus(tmp_path)
    (tmp_path / "a.md").write_text("Changed evidence", encoding="utf-8")
    assert first[2] != lab.read_corpus(tmp_path)[2]
    path = write_fixture(tmp_path, cases)
    corpus = lab.read_corpus(ROOT / "documents")[0]
    before = lab.load_fixture(path, corpus)[1]
    path.write_text(path.read_text(encoding="utf-8") + "\n", encoding="utf-8")
    assert before != lab.load_fixture(path, corpus)[1]


def test_report_cli_exit_contract_and_visible_failures(tmp_path, cases):
    output = tmp_path / "report.json"
    command = [sys.executable, str(ROOT / "evaluate_lab.py"), "--split", "test", "--output", str(output)]
    completed = subprocess.run(command, capture_output=True, text=True, encoding="utf-8")
    assert completed.returncode == 0, completed.stderr
    report = json.loads(output.read_text(encoding="utf-8"))
    assert report == json.loads(completed.stdout)
    assert report["run"]["model"] == report["run"]["prompt"] == "not_used"
    assert report["provider_cost_usd"] == 0
    assert any(row["failure_reasons"] for row in report["cases"])
    strict = subprocess.run(command + ["--require-all-pass"], capture_output=True)
    assert strict.returncode == 1
    invalid = write_fixture(tmp_path, [])
    broken = subprocess.run(command + ["--fixture", str(invalid)], capture_output=True)
    assert broken.returncode == 2
