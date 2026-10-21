"""Behavioral regression for offline lesson simulators, not live security tests."""
import importlib.util
import json
from pathlib import Path

import pytest


SAMPLE = Path(__file__).resolve().parents[1] / "samples" / "safe-tool-boundaries"


def load(name):
    spec = importlib.util.spec_from_file_location(name, SAMPLE / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


policy_module = load("tool_policy")
loop = load("bounded_loop")
mcp = load("mcp_policy")


@pytest.fixture
def scenario():
    policy = policy_module.Policy()
    call = {"tool": "set_status", "target": "note-1", "arguments": {"status": "reviewed"}}
    grant = policy.approve("alice", "req-1", call, 0)
    return policy, call, grant


def test_retry_observes_same_state_without_duplicate_write(scenario):
    policy, call, grant = scenario
    assert policy.execute("alice", "req-1", call, 1, 20, grant) == "applied"
    assert policy.execute("alice", "req-1", call, 2, 20, grant) == "already_applied"
    assert policy.writes == 1
    assert policy.notes["note-1"] == "reviewed"


@pytest.mark.parametrize("change", [
    {"tool": "read_note", "arguments": {"status": "reviewed"}},
    {"target": "note-2"},
    {"arguments": {"status": "draft"}},
    {"arguments": {"status": "reviewed", "principal": "bob"}},
])
def test_changed_action_never_reuses_approval(scenario, change):
    policy, call, grant = scenario
    policy.permissions["alice"].add("note-2")
    result = policy.execute("alice", "req-1", {**call, **change}, 1, 20, grant)
    assert result in {"invalid_schema", "approval_mismatch"}
    assert policy.writes == 0


def test_wrong_user_and_new_request_replay(scenario):
    policy, call, grant = scenario
    policy.permissions["bob"].add("note-1")
    assert policy.execute("bob", "req-1", call, 1, 20, grant) == "approval_mismatch"
    assert policy.execute("alice", "req-2", call, 1, 20, grant) == "approval_mismatch"
    assert policy.writes == 0


def test_expiry_exact_boundary(scenario):
    policy, call, grant = scenario
    assert policy.execute("alice", "req-1", call, 10, 20, grant) == "approval_expired"
    assert policy.writes == 0


def test_revocation_rechecked_even_after_success(scenario):
    policy, call, grant = scenario
    policy.execute("alice", "req-1", call, 1, 20, grant)
    policy.permissions["alice"].clear()
    assert policy.execute("alice", "req-1", call, 2, 20, grant) == "permission_denied"
    assert policy.writes == 1


def test_snapshot_cannot_be_changed_by_mutating_original(scenario):
    policy, call, grant = scenario
    call["arguments"]["status"] = "draft"
    assert policy.execute("alice", "req-1", call, 1, 20, grant) == "approval_mismatch"
    assert policy.writes == 0


def test_idempotency_key_cannot_be_reused_for_another_approved_action(scenario):
    policy, call, grant = scenario
    policy.execute("alice", "req-1", call, 1, 20, grant)
    changed = {**call, "arguments": {"status": "draft"}}
    new_grant = policy.approve("alice", "req-1", changed, 2)
    assert policy.execute("alice", "req-1", changed, 3, 20, new_grant) == "idempotency_conflict"
    assert policy.notes["note-1"] == "reviewed"


def test_final_state_drift_not_hidden_by_success_cache(scenario):
    policy, call, grant = scenario
    policy.execute("alice", "req-1", call, 1, 20, grant)
    policy.notes["note-1"] = "draft"
    assert policy.execute("alice", "req-1", call, 2, 20, grant) == "state_drift"
    assert policy.writes == 1


def test_deadline_and_no_approval_do_not_write(scenario):
    policy, call, grant = scenario
    assert policy.execute("alice", "req-1", call, 2, 2, grant) == "deadline"
    assert policy.execute("alice", "req-1", call, 1, 20) == "approval_mismatch"
    assert policy.writes == 0


@pytest.mark.parametrize("call", [None, [], {}, {"tool": "shell", "target": "note-1", "arguments": {}}])
def test_malformed_and_unlisted_tools_blocked(scenario, call):
    policy, _, grant = scenario
    assert policy.execute("alice", "req-1", call, 1, 20, grant) in {"invalid_schema", "tool_denied"}
    assert policy.writes == 0


def test_budget_counts_attempts_and_exhaustion_is_not_success():
    plan = [{"tool": "search", "query": str(i)} for i in range(9)]
    calls = []
    result = loop.run(plan, lambda query: calls.append(query) or [], clock=lambda: 0)
    assert result["stop_reason"] == "step_limit"
    assert result["steps"] == len(calls) == 5


def test_transient_timeouts_retry_only_with_budget():
    calls = []

    def tool(query):
        calls.append(query)
        raise TimeoutError("FAKE_SECRET_SHOULD_NOT_BE_LOGGED")

    call = {"tool": "search", "query": "retry"}
    result = loop.run([call] * 9, tool, clock=lambda: 0)
    assert result["stop_reason"] == "error_limit"
    assert result["steps"] == len(calls) == 2
    assert "FAKE_SECRET" not in json.dumps(result)


def test_late_result_not_success():
    now = [0]

    def slow(_):
        now[0] = 3
        return ["doc-1"]

    result = loop.run([{"tool": "search", "query": "test"}], slow, clock=lambda: now[0])
    assert result["stop_reason"] == "deadline"
    assert result["trace"][0]["status"] == "late_result"


def test_permission_error_does_not_retry():
    def denied(_):
        raise PermissionError("private payload")

    plan = [{"tool": "search", "query": "test"}] * 8
    result = loop.run(plan, denied, clock=lambda: 0)
    assert result["stop_reason"] == "permission_denied"
    assert result["steps"] == 1


def test_scripted_injection_cannot_grant_tool_or_private_data():
    public = mcp.handle_proposal("alice", {"name": "read_resource", "arguments": {"target": "public"}})
    assert "Ignore rules" in public["data"]
    assert mcp.handle_proposal("alice", {"name": "send_email", "arguments": {}})["status"] == "tool_denied"
    private = {"name": "read_resource", "arguments": {"target": "private"}}
    assert mcp.handle_proposal("alice", private) == {"status": "denied", "data": None}
    assert mcp.handle_proposal("bob", private)["data"] == "SYNTHETIC_PRIVATE_CANARY"
    spoof = {"name": "read_resource", "arguments": {"target": "private", "principal": "bob"}}
    assert mcp.handle_proposal("alice", spoof)["status"] == "invalid_schema"


def test_read_without_approval_and_redacted_audit(scenario):
    policy, _, _ = scenario
    call = {"tool": "read_note", "target": "note-1", "arguments": {}}
    assert policy.execute("alice", "read-1", call, 1, 20) == "read_only_complete"
    assert policy.writes == 0
    assert policy.audit == [{"status": "read_only_complete"}]
