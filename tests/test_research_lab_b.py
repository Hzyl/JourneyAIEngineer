"""Tool budgets, recoverability and scripted controller behavior."""
import json
from pathlib import Path
import subprocess
import sys
import pytest

SAMPLE = Path(__file__).resolve().parents[1] / "samples" / "vi-document-assistant"
sys.path.insert(0, str(SAMPLE))
from research_lab import lab_b
from research_lab.checkpoint import JsonStore, MemoryStore
from research_lab.corpus import canonical_hash, load_fixture
from research_lab.tools import ToolSession
from research_lab.workflow import Runner


def test_fixed_and_adaptive_share_tasks_but_observations_change_plan():
    report = lab_b.run()
    fixed = {r["id"]: r for r in report["methods"]["fixed"]["cases"]}
    adaptive = {r["id"]: r for r in report["methods"]["scripted_adaptive"]["cases"]}
    assert fixed.keys() == adaptive.keys()
    assert fixed["direct"]["task_success"] and adaptive["direct"]["task_success"]
    assert not fixed["query_rewrite"]["task_success"]
    assert adaptive["query_rewrite"]["task_success"]
    assert adaptive["query_rewrite"]["calls"] <= 5
    assert adaptive["query_rewrite"]["states"] != fixed["query_rewrite"]["states"]
    assert all(p["passed"] for p in report["failure_probes"])
    assert report["checkpoint"]["disk_new_store_resumed"]
    assert not report["checkpoint"]["ram_new_store_has_state"]
    json.dumps(report, allow_nan=False)


def test_invalid_attempts_consume_budget_and_forbidden_tools_never_execute():
    session = ToolSession(load_fixture()[0], "A")
    for _ in range(5):
        assert session.call("send_email", {"body": "SENSITIVE"})["status"] == "tool_denied"
    assert session.call("search", {"query": "Python"})["status"] == "call_budget_exhausted"
    assert session.calls == 5
    assert "SENSITIVE" not in json.dumps(session.trace)
    with pytest.raises(ValueError):
        ToolSession([], "A", max_calls=6)


def test_timeout_before_and_after_call_with_injected_clock():
    now = [0.0]
    session = ToolSession(load_fixture()[0], "A", clock=lambda: now[0], timeout_seconds=1)
    now[0] = 1
    assert session.call("search", {"query": "Python"})["status"] == "timeout"
    assert session.calls == 0
    ticks = iter([0, 0, 0, 2, 2])
    session = ToolSession(load_fixture()[0], "A", clock=lambda: next(ticks), timeout_seconds=1)
    assert session.call("search", {"query": "Python"})["status"] == "timeout"
    assert session.calls == 1


def test_resume_keeps_budget_seen_queries_and_user_binding(tmp_path):
    chunks = load_fixture()[0]
    task = lab_b.TASKS[1]
    runner = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive")
    runner.step()
    state = runner.checkpoint("fixture")
    store = JsonStore(tmp_path / "state.json")
    store.save(state)
    resumed = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive")
    resumed.resume(JsonStore(store.path).load(), "fixture")
    assert resumed.tools.calls == 1
    assert resumed.tools.seen_queries == runner.tools.seen_queries
    assert resumed.run()["task_success"]
    with pytest.raises(ValueError, match="principal"):
        Runner(ToolSession(chunks, "B"), task, "scripted_adaptive").resume(state, "fixture")
    with pytest.raises(ValueError, match="fixture"):
        resumed.resume(state, "changed-fixture")
    ram = MemoryStore()
    ram.save(state)
    assert ram.load() is not None and MemoryStore().load() is None


def test_disk_checkpoint_recovers_in_separate_process(tmp_path):
    chunks = load_fixture()[0]
    task = lab_b.TASKS[1]
    runner = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive", require_approval=True)
    runner.step()
    path = tmp_path / "restart.json"
    JsonStore(path).save(runner.checkpoint(canonical_hash(lab_b.TASKS)))
    code = """
import json, sys
sys.path.insert(0, sys.argv[1])
from research_lab import lab_b
from research_lab.checkpoint import JsonStore
from research_lab.corpus import load_fixture, canonical_hash
from research_lab.tools import ToolSession
from research_lab.workflow import Runner
runner = Runner(ToolSession(load_fixture()[0], "A"), lab_b.TASKS[1], "scripted_adaptive", require_approval=True)
runner.resume(JsonStore(sys.argv[2]).load(), canonical_hash(lab_b.TASKS))
pending = runner.run()
assert pending["stop_reason"] == "awaiting_approval" and pending["calls"] == 1
runner.approve("A", canonical_hash(lab_b.TASKS[1]), True)
print(json.dumps(runner.run()))
"""
    result = subprocess.run([sys.executable, "-X", "utf8", "-c", code, str(SAMPLE), str(path)],
                            capture_output=True, text=True, encoding="utf-8", timeout=15, check=True)
    report = json.loads(result.stdout)
    assert report["task_success"]
    assert report["calls"] > runner.tools.calls
    assert report["trace"][0]["status"] == runner.tools.trace[0]["status"]
    assert report["approval"]["granted"]


def test_fake_approval_blocks_tools_binds_principal_task_and_can_deny():
    task = lab_b.TASKS[0]
    runner = Runner(ToolSession(load_fixture()[0], "A"), task, require_approval=True)
    pending = runner.run()
    assert pending["stop_reason"] == "awaiting_approval"
    assert pending["calls"] == 1
    runner.step()
    assert runner.run()["calls"] == 1
    with pytest.raises(ValueError, match="principal/task"):
        runner.approve("B", canonical_hash(task), True)
    with pytest.raises(ValueError, match="principal/task"):
        runner.approve("A", "different-task", True)
    assert runner.tools.calls == 1 and not runner.approval_granted
    runner.approve("A", canonical_hash(task), False)
    denied = runner.run()
    assert denied["stop_reason"] == "approval_denied" and denied["calls"] == 1
    assert not denied["task_success"]
    with pytest.raises(ValueError, match="No pending"):
        runner.approve("A", canonical_hash(task), True)


def test_checkpoint_cannot_silently_disable_required_approval():
    task = lab_b.TASKS[0]
    runner = Runner(ToolSession(load_fixture()[0], "A"), task, require_approval=True)
    runner.run()
    state = runner.checkpoint("fixture")
    with pytest.raises(ValueError, match="Checkpoint"):
        Runner(ToolSession(load_fixture()[0], "A"), task).resume(state, "fixture")
    approved = Runner(ToolSession(load_fixture()[0], "A"), task, require_approval=True)
    approved.resume(state, "fixture")
    approved.approve("A", canonical_hash(task), True)
    assert approved.run()["task_success"]
    assert approved.tools.calls == 2


def test_repeated_fallback_failure_and_timeout_stop_controller():
    chunks = load_fixture()[0]
    task = {"question": "xyzzynotfound", "initial_query": "xyzzynotfound", "gold_chunk": None}
    result = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive").run()
    assert result["stop_reason"] == "repeated_query"
    assert result["calls"] == 2
    result = Runner(ToolSession(chunks, "A", failure_calls=(1,)), lab_b.TASKS[0]).run()
    assert result["stop_reason"] == "tool_failure"
    now = [0.0]
    session = ToolSession(chunks, "A", clock=lambda: now[0], timeout_seconds=1)
    runner = Runner(session, lab_b.TASKS[0])
    now[0] = 2
    assert runner.run()["stop_reason"] == "timeout"
