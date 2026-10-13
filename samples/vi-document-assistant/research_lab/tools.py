"""Read-only in-process fake tools. This module is not an MCP server."""
from copy import deepcopy
from time import monotonic
from .retrieval import lexical_search


class ToolSession:
    def __init__(self, chunks, user, max_calls=5, timeout_seconds=2.0, clock=monotonic,
                 failure_calls=(), harden=True):
        if user not in ("A", "B"):
            raise ValueError("Unknown principal")
        if type(max_calls) is not int or not 1 <= max_calls <= 5:
            raise ValueError("max_calls must be an integer from 1 to 5")
        if not isinstance(timeout_seconds, (int, float)) or not 0 < timeout_seconds <= 300:
            raise ValueError("timeout_seconds must be in (0, 300]")
        self.chunks, self.user = chunks, user
        self.max_calls, self.timeout_seconds, self.clock = max_calls, float(timeout_seconds), clock
        self.started, self.calls, self.elapsed_before = clock(), 0, 0.0
        self.trace, self.seen_queries = [], set()
        self.failure_calls, self.harden = set(failure_calls), harden

    def elapsed(self):
        return self.elapsed_before + max(0, self.clock() - self.started)

    def _record(self, tool, status, before, payload=None):
        # Never log arbitrary arguments, document bodies, exception text, or secrets.
        self.trace.append({"attempt": self.calls, "tool": tool if tool in (
            "search", "read_document") else "[outside_allowlist]",
            "status": status, "state_before": "tool_requested", "state_after": "observed",
            "latency_ms": max(0, self.clock() - before) * 1000})
        return {"status": status, "data": payload}

    def call(self, tool, arguments):
        before = self.clock()
        if self.calls >= self.max_calls:
            return self._record(tool, "call_budget_exhausted", before)
        if self.elapsed() >= self.timeout_seconds:
            return self._record(tool, "timeout", before)
        self.calls += 1  # Invalid arguments and forbidden tool attempts consume budget too.
        if tool not in ("search", "read_document"):
            return self._record(tool, "tool_denied", before)
        key = "query" if tool == "search" else "document_id"
        if (not isinstance(arguments, dict) or set(arguments) != {key}
                or not isinstance(arguments[key], str) or not arguments[key].strip()
                or len(arguments[key]) > 500):
            return self._record(tool, "invalid_arguments", before)
        if self.calls in self.failure_calls:
            return self._record(tool, "tool_failure", before)
        if tool == "search":
            normalized = " ".join(arguments[key].casefold().split())
            if normalized in self.seen_queries:
                return self._record(tool, "repeated_query", before)
            self.seen_queries.add(normalized)
            candidates = self.chunks if not self.harden else [
                c for c in self.chunks if self.user in c["allowed_users"]
            ]
            # The deliberately unsafe comparison is synthetic only; never use in an app.
            search_user = self.user if self.harden else "B"
            rows = lexical_search(arguments[key], candidates, search_user, top_k=3)
            payload = [{"document_id": r["chunk"]["document_id"],
                        "chunk_id": r["chunk"]["chunk_id"], "score": r["score"]} for r in rows]
        else:
            permitted = [c for c in self.chunks if c["document_id"] == arguments[key]
                         and (not self.harden or self.user in c["allowed_users"])]
            if not permitted:
                # Same response for missing and forbidden IDs; no existence oracle.
                return self._record(tool, "document_denied", before)
            payload = deepcopy(permitted)
        # In-process fake tools are immediate; real blocking I/O needs cancellable transport deadlines.
        if self.elapsed() >= self.timeout_seconds:
            return self._record(tool, "timeout", before)
        return self._record(tool, "ok" if payload else "no_result", before, payload)

    def snapshot(self):
        return {"user": self.user, "calls": self.calls, "max_calls": self.max_calls,
                "timeout_seconds": self.timeout_seconds, "elapsed": self.elapsed(),
                "seen_queries": sorted(self.seen_queries), "trace": deepcopy(self.trace)}

    def restore(self, state):
        if state["user"] != self.user or state["max_calls"] != self.max_calls:
            raise ValueError("Checkpoint principal or budget mismatch")
        if state["timeout_seconds"] != self.timeout_seconds:
            raise ValueError("Checkpoint timeout mismatch")
        if type(state["calls"]) is not int or not 0 <= state["calls"] <= self.max_calls:
            raise ValueError("Invalid checkpoint call count")
        if not 0 <= state["elapsed"] <= 300:
            raise ValueError("Invalid checkpoint elapsed time")
        self.calls, self.elapsed_before = state["calls"], state["elapsed"]
        self.started, self.trace = self.clock(), deepcopy(state["trace"])
        self.seen_queries = set(state["seen_queries"])
