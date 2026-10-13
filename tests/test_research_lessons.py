"""Run the authored lesson examples and independently challenge their boundaries."""
import json
from pathlib import Path
import subprocess
import sys

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
TARGETS = {
    "10-3": "phase-10-genai-transformers-genai-transformers-3",
    "12-3": "phase-12-genai-rag-rag-foundations-3",
    "13-1": "phase-13-genai-advanced-rag-advanced-rag-1",
    "13-2": "phase-13-genai-advanced-rag-advanced-rag-2",
    "14-2": "phase-14-genai-tool-calling-tool-calling-2",
    "15-2": "phase-15-genai-agents-ai-agents-2",
    "15-4": "phase-15-genai-agents-ai-agents-4",
    "16-1": "phase-16-genai-mcp-mcp-1",
    "17-2": "phase-17-genai-evaluation-genai-evaluation-2",
    "17-3": "phase-17-genai-evaluation-genai-evaluation-3",
    "18-1": "phase-18-genai-observability-genai-observability-1",
    "19-2": "phase-19-genai-production-genai-production-2",
    "20-3": "phase-20-genai-finetuning-fine-tuning-3",
    "21-2": "phase-21-genai-local-llm-local-llm-2",
    "22-1": "phase-22-genai-system-design-genai-system-design-1",
    "22-3": "phase-22-genai-system-design-genai-system-design-3",
}


def lesson(key):
    path = ROOT / "content" / "lessons" / (TARGETS[key] + ".md")
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1])


def run_example(key, folder, assertions=""):
    example = lesson(key)["code_examples"][0]
    completed = subprocess.run(
        [sys.executable, "-X", "utf8", "-c", example["code"] + "\n" + assertions],
        cwd=folder, capture_output=True, text=True, encoding="utf-8", timeout=20,
    )
    assert completed.returncode == 0, completed.stderr
    return completed.stdout.strip(), example["expected_output"]


@pytest.mark.parametrize("key", TARGETS)
def test_documented_example_runs_and_matches_exact_output(key, tmp_path):
    actual, expected = run_example(key, tmp_path)
    assert actual == expected
    # All examples expose structured results learners can independently inspect.
    assert isinstance(json.loads(actual), (dict, list))


@pytest.mark.parametrize("key", TARGETS)
def test_identity_and_colab_target_are_consistent(key):
    data = lesson(key)
    assert data["lesson_id"] == TARGETS[key]
    assert data["lesson_id"].startswith(data["phase_id"] + "-" + data["module_id"] + "-")
    assert [c["id"] for c in data["review_cards"]] == data["review_item_ids"]
    assert len(data["review_cards"]) == 4
    assert data["exercise_ids"]
    assert not (ROOT / "content" / "curated" / (TARGETS[key] + ".json")).exists()
    resources = [r for r in data["resources"] if r["url"].startswith("https://colab.research.google.com/")]
    assert len(resources) == 1
    resource = resources[0]
    assert resource["kind"] == "external"
    filename = resource["url"].rsplit("/", 1)[1]
    assert (ROOT / "notebooks" / filename).is_file()


BOUNDARIES = {
    "10-3": "assert validate({}) == 'missing:model_id,revision,architecture,license,resources'",
    "12-3": "assert cosine([1, 0], [-1, 0]) == -1\nassert cosine([1, 0], [0, 1]) == 0",
    "13-1": "assert rrf([['a', 'a'], ['b']]) == rrf([['a'], ['b']])\nassert recall(['a'], {'b'}, 1) == 0",
    "13-2": "assert reciprocal_rank(['a', 'b'], {'b'}) == 0.5\nassert reciprocal_rank([], {'b'}) == 0",
    "14-2": "assert read_document({'document_id': 'private'}, 'binh') == {'status': 'denied'}\nassert read_document({'document_id': 'missing'}, 'an') == {'status': 'denied'}",
    "15-2": "assert select_context(passages, 'outsider', 100) == {'ids': [], 'word_units': 0}\nassert select_context(passages, 'binh', 7)['ids'] == ['guide']",
    "15-4": "assert resume(restored, False, True) == 'denied'\nassert resume(restored, True, False) == 'denied'",
    "16-1": "s = Session()\nassert s.receive({'method': 'notifications/initialized'}) == 'invalid_sequence'\nassert s.state == 'new'",
    "17-2": "assert recall == 1 and supported == 0.5\nassert sum(c.get('supported', False) for c in cases) == 1",
    "17-3": "assert not score(dict(correct=True, tools=['search'], seconds=3))\nassert not score(dict(correct=False, tools=[], seconds=0))",
    "18-1": "assert redact({'payload': {'token': 'secret'}, 'status': 'ok'}) == {'status': 'ok'}",
    "19-2": "assert bounded_retry(['ok'], max_attempts=0)['calls'] == 0\nassert bounded_retry(['timeout'] * 9)['calls'] == 3",
    "20-3": "assert accuracy(gold, gold) == 1\nassert accuracy({k: 'wrong' for k in gold}, gold) == 0",
    "21-2": "assert metrics([dict(start=0, first=1, end=4, tokens=8)])['output_tokens_per_s'] == 2",
    "22-1": "assert choose([dict(name='bad', quality=1, latency_ms=1, cost_units=0, authorized=False)], 500) is None",
    "22-3": "cards[1]['license_checked'] = False\nassert route('restricted') is None\nassert estimated_cost(cards[0], 0, 0) == 0",
}


@pytest.mark.parametrize("key,assertions", BOUNDARIES.items())
def test_independent_counterexamples(key, assertions, tmp_path):
    run_example(key, tmp_path, assertions)
