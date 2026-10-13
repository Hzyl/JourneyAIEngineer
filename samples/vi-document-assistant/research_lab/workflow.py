"""Scripted observation-driven controller, not an LLM agent."""
from .corpus import canonical_hash
from .retrieval import lexical_search, select_evidence


class Runner:
    def __init__(self, tools, task, strategy="fixed", require_approval=False):
        if strategy not in ("fixed", "scripted_adaptive"):
            raise ValueError("Unknown strategy")
        self.tools, self.task, self.strategy = tools, task, strategy
        self.stage, self.next_query = "search", task["initial_query"]
        self.observation, self.decision, self.stop_reason = None, None, None
        self.transitions = []
        self.require_approval = bool(require_approval)
        self.approval_granted = False

    def approve(self, principal, task_hash, approved):
        """Synthetic decision only: the caller supplies identity, not authentication."""
        if self.stage != "waiting_approval" or self.stop_reason:
            raise ValueError("No pending approval")
        if principal != self.tools.user or task_hash != canonical_hash(self.task):
            raise ValueError("Approval principal/task mismatch")
        if type(approved) is not bool:
            raise ValueError("Approval decision must be boolean")
        if approved:
            self.approval_granted, self.stage = True, "read"
        else:
            self.stop_reason = "approval_denied"
        self.transitions.append({"from": "waiting_approval", "to": self.stage if approved else "stopped",
                                 "decision": "approved" if approved else "approval_denied",
                                 "observation_status": "synthetic_approval"})

    def step(self):
        if self.stop_reason:
            return
        if self.stage == "waiting_approval":
            return  # No tool call or budget reset while approval is pending.
        previous = self.stage
        if self.stage == "search":
            response = self.tools.call("search", {"query": self.next_query})
            if response["status"] == "ok":
                self.observation = response["data"][0]["document_id"]
                self.stage = "waiting_approval" if self.require_approval and not self.approval_granted else "read"
            elif response["status"] == "no_result" and self.strategy == "scripted_adaptive":
                if self.next_query == self.task.get("fallback_query"):
                    self.stop_reason = "no_evidence"
                else:
                    self.next_query = self.task.get("fallback_query", self.next_query)
                    # A repeated fallback is rejected by the tool on the next step.
            else:
                self.stop_reason = response["status"]
        else:
            response = self.tools.call("read_document", {"document_id": self.observation})
            if response["status"] != "ok":
                self.stop_reason = response["status"]
            else:
                chunks = response["data"]
                ranked = lexical_search(self.task["question"], chunks, self.tools.user)
                self.decision = select_evidence(self.task["question"], ranked, chunks, self.tools.user)
                if (self.decision["action"] == "abstain" and self.strategy == "scripted_adaptive"
                        and self.next_query != self.task.get("fallback_query", self.next_query)):
                    self.next_query = self.task["fallback_query"]
                    self.stage, self.decision = "search", None
                else:
                    self.stop_reason = "completed" if self.decision["action"] == "answer" else self.decision["action"]
        self.transitions.append({"from": previous, "to": "stopped" if self.stop_reason else self.stage,
                                 "observation_status": response["status"],
                                 "decision": self.stop_reason or self.stage})

    def run(self):
        # Controller safety bound as well as the tool budget; no infinite invalid loops.
        for _ in range(self.tools.max_calls + 1):
            if self.stop_reason or self.stage == "waiting_approval":
                break
            self.step()
        if not self.stop_reason and self.stage != "waiting_approval":
            self.stop_reason = "controller_budget_exhausted"
        return self.report()

    def report(self):
        citations = (self.decision or {}).get("citations", [])
        return {"strategy": self.strategy, "is_mock": True,
                "stop_reason": "awaiting_approval" if self.stage == "waiting_approval" and not self.stop_reason
                else self.stop_reason,
                "approval": {"required": self.require_approval, "granted": self.approval_granted,
                             "pending": self.stage == "waiting_approval" and not self.stop_reason,
                             "scope": "Synthetic task-bound decision, not real user authentication."},
                "calls": self.tools.calls, "decision": self.decision,
                "task_success": self.stop_reason == "completed" and any(
                    c["chunk_id"] == self.task["gold_chunk"] for c in citations),
                "trace": self.tools.trace, "states": self.transitions}

    def checkpoint(self, fixture_hash):
        return {"schema_version": 1, "fixture_sha256": fixture_hash,
                "task_sha256": canonical_hash(self.task), "strategy": self.strategy,
                "stage": self.stage, "next_query": self.next_query, "observation": self.observation,
                "decision": self.decision, "stop_reason": self.stop_reason,
                "require_approval": self.require_approval, "approval_granted": self.approval_granted,
                "transitions": self.transitions, "tools": self.tools.snapshot()}

    def resume(self, state, fixture_hash):
        if (state.get("schema_version") != 1 or state.get("fixture_sha256") != fixture_hash
                or state.get("task_sha256") != canonical_hash(self.task)
                or state.get("strategy") != self.strategy
                or state.get("require_approval") is not self.require_approval):
            raise ValueError("Checkpoint fixture/task/strategy mismatch")
        self.tools.restore(state["tools"])
        if type(state.get("approval_granted")) is not bool:
            raise ValueError("Invalid checkpoint approval decision")
        self.approval_granted = state["approval_granted"]
        for name in ("stage", "next_query", "observation", "decision", "stop_reason"):
            setattr(self, name, state[name])
        self.transitions = state["transitions"]
