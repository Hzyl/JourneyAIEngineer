"""Scripted, single-process policy simulator. No real API, MCP or external writes."""
import json


def validate(call):
    if type(call) is not dict or set(call) != {"tool", "target", "arguments"}:
        return "invalid_schema"
    if call["tool"] not in ("read_note", "set_status"):
        return "tool_denied"
    if type(call["target"]) is not str or call["target"] not in ("note-1", "note-2"):
        return "invalid_target"
    args = call["arguments"]
    if type(args) is not dict:
        return "invalid_schema"
    if call["tool"] == "read_note":
        return "ok" if not args else "invalid_schema"
    if set(args) != {"status"} or args["status"] not in ("draft", "reviewed"):
        return "invalid_schema"
    return "ok"


def binding(principal, request_id, call):
    # Exact canonical snapshot, not a signature or authentication mechanism.
    return json.dumps([principal, request_id, call], sort_keys=True, separators=(",", ":"))


class Policy:
    def __init__(self):
        self.permissions = {"alice": {"note-1"}, "bob": {"note-2"}}
        self.notes = {"note-1": "draft", "note-2": "draft"}
        self.approvals = {}
        self.completed = {}
        self.writes = 0
        self.audit = []

    def approve(self, principal, request_id, call, now, ttl=10):
        """Fake trusted reviewer channel; never call from model/tool-result text."""
        if validate(call) != "ok" or call["target"] not in self.permissions.get(principal, set()):
            raise ValueError("cannot approve")
        if type(ttl) is not int or ttl <= 0:
            raise ValueError("invalid approval lifetime")
        approval_id = f"approval-{len(self.approvals) + 1}"
        self.approvals[approval_id] = {
            "binding": binding(principal, request_id, call),
            "expires": now + ttl,
        }
        return approval_id

    def execute(self, principal, request_id, call, now, deadline, approval_id=None):
        def finish(status):
            # Fixed labels only: no argument, document, token, or exception text.
            self.audit.append({"status": status})
            return status

        status = validate(call)
        if status != "ok":
            return finish(status)
        if type(request_id) is not str or not request_id or len(request_id) > 80:
            return finish("invalid_request_id")
        if now >= deadline:
            return finish("deadline")
        target = call["target"]
        if target not in self.permissions.get(principal, set()):
            return finish("permission_denied")
        if call["tool"] == "read_note":
            return finish("read_only_complete")
        grant = self.approvals.get(approval_id)
        expected = binding(principal, request_id, call)
        if grant is None or grant["binding"] != expected:
            return finish("approval_mismatch")
        if now >= grant["expires"]:
            return finish("approval_expired")
        key = (principal, request_id)
        previous = self.completed.get(key)
        if previous is not None:
            if previous != expected:
                return finish("idempotency_conflict")
            if self.notes[target] != call["arguments"]["status"]:
                return finish("state_drift")
            return finish("already_applied")
        # No await/concurrency/crash window is modeled by this in-memory fixture.
        self.notes[target] = call["arguments"]["status"]
        self.writes += 1
        self.completed[key] = expected
        return finish("applied")


def demo():
    policy = Policy()
    call = {"tool": "set_status", "target": "note-1", "arguments": {"status": "reviewed"}}
    approval = policy.approve("alice", "request-1", call, now=0)
    print(policy.execute("alice", "request-1", call, 1, 20, approval))
    print(policy.execute("alice", "request-1", call, 2, 20, approval))
    print("writes", policy.writes, "observed", policy.notes["note-1"])
    mutated = {**call, "arguments": {"status": "draft"}}
    print(policy.execute("alice", "request-1", mutated, 3, 20, approval))
    policy.permissions["alice"].clear()
    print(policy.execute("alice", "request-1", call, 4, 20, approval))


if __name__ == "__main__":
    demo()
