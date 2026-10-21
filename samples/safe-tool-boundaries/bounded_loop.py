"""A scripted controller over fake read-only tools, not a model-driven agent."""
from time import monotonic


def run(plan, tool, clock=monotonic, max_steps=5, timeout=2, max_errors=2):
    if max_steps < 1 or timeout <= 0 or max_errors < 1:
        raise ValueError("positive budgets required")
    deadline = clock() + timeout
    trace = []
    errors = 0
    seen = set()

    def finish(reason):
        return {"stop_reason": reason, "steps": len(trace), "trace": trace}

    for call in plan:
        if clock() >= deadline:
            return finish("deadline")
        if len(trace) >= max_steps:
            return finish("step_limit")
        trace.append({"step": len(trace) + 1})
        if type(call) is not dict or set(call) != {"tool", "query"}:
            trace[-1]["status"] = "invalid_schema"
            return finish("invalid_schema")
        if call["tool"] != "search":
            trace[-1]["status"] = "tool_denied"
            return finish("tool_denied")
        if type(call["query"]) is not str or not call["query"].strip():
            trace[-1]["status"] = "invalid_schema"
            return finish("invalid_schema")
        query = call["query"].strip().casefold()
        if query in seen:
            trace[-1]["status"] = "repeated_query"
            return finish("repeated_query")
        try:
            evidence = tool(query)
        except TimeoutError:
            trace[-1]["status"] = "tool_timeout"
            errors += 1
            # Same read may retry; the attempt still consumes budget.
            if errors >= max_errors:
                return finish("error_limit")
            continue
        except PermissionError:
            trace[-1]["status"] = "permission_denied"
            return finish("permission_denied")
        seen.add(query)
        if clock() >= deadline:
            trace[-1]["status"] = "late_result"
            return finish("deadline")
        if type(evidence) is not list or any(type(x) is not str for x in evidence):
            trace[-1]["status"] = "invalid_output"
            return finish("invalid_output")
        errors = 0
        trace[-1]["status"] = "evidence" if evidence else "no_evidence"
        if evidence:
            # Success means evidence found, not that an answer was proved correct.
            return finish("evidence_found")
    return finish("plan_exhausted")


def demo():
    plan = [{"tool": "search", "query": f"query-{i}"} for i in range(8)]
    result = run(plan, lambda _: [], clock=lambda: 0)
    print(result["stop_reason"], result["steps"])
    repeated = run([plan[0], plan[0]], lambda _: [], clock=lambda: 0)
    print(repeated["stop_reason"], repeated["steps"])
    success = run(plan, lambda _: ["doc-1:L2"], clock=lambda: 0)
    print(success["stop_reason"], success["steps"])


if __name__ == "__main__":
    demo()
