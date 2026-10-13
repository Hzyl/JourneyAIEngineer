"""Lab B: compare a fixed workflow and a scripted adaptive controller."""
from tempfile import TemporaryDirectory
from pathlib import Path
from .checkpoint import JsonStore, MemoryStore
from .corpus import canonical_hash, load_fixture
from .tools import ToolSession
from .workflow import Runner

TASKS = [
    {"id": "direct", "question": "Workshop Python bắt đầu lúc nào?",
     "initial_query": "Workshop Python bắt đầu", "fallback_query": "Workshop Python bắt đầu",
     "gold_chunk": "workshop@1.0:L2"},
    {"id": "query_rewrite", "question": "Workshop Python bắt đầu lúc nào?",
     "initial_query": "buổi thực hành cuối tuần", "fallback_query": "Workshop Python bắt đầu",
     "gold_chunk": "workshop@1.0:L2"},
    {"id": "no_evidence", "question": "Thiên hà xa bao nhiêu?",
     "initial_query": "xyz thiên hà", "fallback_query": "xyz vũ trụ",
     "gold_chunk": None},
]


def checkpoint_demo(chunks, fixture_hash):
    task = TASKS[1]
    runner = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive", require_approval=True)
    runner.step()
    ram = MemoryStore()
    ram.save(runner.checkpoint(fixture_hash))
    with TemporaryDirectory(prefix="research-lab-") as directory:
        path = Path(directory) / "checkpoint.json"
        JsonStore(path).save(ram.load())
        recovered = Runner(ToolSession(chunks, "A"), task, "scripted_adaptive", require_approval=True)
        recovered.resume(JsonStore(path).load(), fixture_hash)
        pending = recovered.run()
        recovered.approve("A", canonical_hash(task), True)
        result = recovered.run()
    return {"ram_new_store_has_state": MemoryStore().load() is not None,
            "disk_new_store_resumed": result["task_success"], "resumed_calls": result["calls"],
            "call_count_before_save": runner.tools.calls,
            "pending_before_save": runner.stage == "waiting_approval",
            "resume_without_approval": {"stop_reason": pending["stop_reason"], "calls": pending["calls"]},
            "approval": "Explicit fake approval bound to principal A and task hash; not authentication.",
            "resume_scope": "New store/controller instances; separate-process restart is checked by tests.",
            "budget": "Calls and active elapsed execution time survive resume; downtime excluded.",
            "trust": "Local synthetic checkpoint is not signed/encrypted. Do not load untrusted state."}


def failure_probes(chunks):
    probes = []
    cases = [
        ("invalid_schema", "search", {"query": 42}, (), "invalid_arguments"),
        ("outside_allowlist", "send_email", {"to": "example.invalid"}, (), "tool_denied"),
        ("tool_failure", "search", {"query": "Python"}, (1,), "tool_failure"),
        ("no_result", "search", {"query": "xyzzynotfound"}, (), "no_result"),
    ]
    for name, tool, arguments, failures, expected in cases:
        session = ToolSession(chunks, "A", failure_calls=failures)
        actual = session.call(tool, arguments)["status"]
        probes.append({"id": name, "status": actual, "passed": actual == expected, "trace": session.trace})
    session = ToolSession(chunks, "A")
    session.call("search", {"query": "Python"})
    status = session.call("search", {"query": "  PYTHON  "})["status"]
    probes.append({"id": "repeated_query", "status": status, "passed": status == "repeated_query",
                   "trace": session.trace})
    session = ToolSession(chunks, "A")
    for _ in range(5):
        session.call("search", {"wrong_key": "not_logged"})
    status = session.call("search", {"query": "Python"})["status"]
    probes.append({"id": "invalid_attempts_exhaust_budget", "status": status,
                   "passed": status == "call_budget_exhausted" and session.calls == 5, "trace": session.trace})
    now = [0.0]
    session = ToolSession(chunks, "A", timeout_seconds=1, clock=lambda: now[0])
    now[0] = 2.0
    status = session.call("search", {"query": "Python"})["status"]
    probes.append({"id": "injected_clock_timeout", "status": status,
                   "passed": status == "timeout" and session.calls == 0, "trace": session.trace})
    return probes


def run():
    chunks, _, _, provenance = load_fixture()
    task_hash = canonical_hash(TASKS)
    methods = {}
    for strategy in ("fixed", "scripted_adaptive"):
        rows = [{"id": task["id"], **Runner(ToolSession(chunks, "A"), task, strategy).run()}
                for task in TASKS]
        methods[strategy] = {"cases": rows, "task_success_rate": sum(r["task_success"] for r in rows) / len(rows),
                             "mean_calls": sum(r["calls"] for r in rows) / len(rows)}
    return {"lab": "B", "is_mock": True, "tools": ["search", "read_document"],
            "provenance": {**provenance, "task_version": "workflow-tasks-v1", "task_sha256": task_hash},
            "budget": {"maximum_calls": 5, "timeout_seconds": 2.0, "invalid_attempts_count": True},
            "methods": methods, "failure_probes": failure_probes(chunks),
            "checkpoint": checkpoint_demo(chunks, task_hash),
            "provider_cost_usd": 0, "model": "none",
            "limitations": [
                "Scripted query rewriting demonstrates state transitions, not genuine LLM decisions.",
                "The same three tasks and scoring rule are used by both strategies; tiny synthetic fixtures.",
                "No-result task intentionally cannot produce task_success; inspect stop reasons separately.",
                "Timeouts are cooperative around immediate fake tools; real I/O needs transport cancellation.",
                "Tool output is data; injection containment is tested in Lab C, not proven for real models.",
            ]}
