---
lesson_id: phase-15-genai-agents-ai-agents-4
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Người duyệt và giới hạn an toàn
title_en: Human in the loop and guardrails
summary_vi: Duyệt đúng người, request, tool, đích và tham số; kiểm tra lại quyền, thời hạn và trạng thái đích
  khi tiếp tục.
summary_en: Bind approval to principal, request, tool, target and arguments; recheck permissions, expiry and
  target state on resume.
learning_objectives:
- Duyệt đúng người, request, tool, đích và tham số; kiểm tra lại quyền, thời hạn và trạng thái đích khi tiếp
  tục.
- Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
- Sai người, request, target hoặc arguments không ghi; hết hạn/thu hồi quyền chặn cả resume.
- Retry đúng chỉ ghi 1 lần; conflict/drift không bị che bởi kết quả thành công cũ.
learning_objectives_en:
- Bind approval to principal, request, tool, target and arguments; recheck permissions, expiry and target state
  on resume.
- Checkpoint still recovers in a fresh process; an in-memory dict is not durable storage.
- Wrong principal, request, target or arguments never write; expiry/revocation also block resume.
- Identical retries write once; conflict/drift cannot be hidden behind cached success.
prerequisites:
- phase-15-genai-agents-ai-agents-3
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- human
- the
- loop
- guardrails
- token
- embedding
- retrieval
- evaluation
- ai-agents
concept_notes_vi: |-
  Người duyệt là điểm kiểm soát trước hành động có tác động, không phải cách cho model thêm quyền. Quyết định duyệt cần gắn với yêu cầu, đối tượng và thời hạn; khi tiếp tục vẫn phải kiểm tra lại quyền vì quyền có thể đã thay đổi trong lúc chờ.

  Checkpoint lưu trạng thái để tiếp tục một luồng; store dùng chung có thể lưu dữ liệu xuyên nhiều luồng. Một dict hay InMemorySaver trong RAM không tồn tại sau khi tiến trình dừng. Ví dụ dùng tệp JSON tạm và thực sự mở tiến trình Python mới để đọc lại điểm chờ. Đây là mô hình lưu đĩa tối thiểu; production cần kiểm soát truy cập, tính nguyên tử, version schema và chống thực thi lặp.

  Tự kiểm tra: đã lưu checkpoint có nghĩa hành động chỉ chạy một lần không? Không; retry sau lỗi có thể lặp tác động. Dùng idempotency key và trạng thái hoàn tất thích hợp ở hệ thống đích. Ví dụ chỉ đọc, mô phỏng người duyệt và không gửi dữ liệu ra ngoài.

  Ví dụ checkpoint cũ bên dưới vẫn đúng cho việc lưu điểm chờ và chứng minh tiến trình mới đọc lại được trạng thái. Hai boolean approved/can_read chỉ mô phỏng quyết định; chúng chưa gắn sự đồng ý với toàn bộ hành động. Vì vậy bài giữ ví dụ đó và thêm ví dụ policy riêng, thay vì coi lưu checkpoint là giải quyết đủ quyền thực thi.

  Luồng cần phân biệt proposed → waiting_review → approved → executing → observed_complete. UI duyệt phải hiển thị ai yêu cầu, công cụ nào, đích nào, dữ liệu sẽ đổi/gửi, tác động dự kiến và thời hạn. Trong ví dụ mới, approve là kênh người duyệt giả đáng tin; model/tool output không được gọi nó. Bản ghi phía server lưu snapshot chuẩn hóa của principal + request_id + tool + target + arguments và expires. Sửa một ký tự trong tham số phải xin duyệt lại. Snapshot JSON không phải chữ ký; ID tuần tự và dict chỉ là fixture, không dùng làm cơ chế xác thực production.

  Khi resume, kiểm tra lại quyền hiện tại trước khi thực thi hoặc trả kết quả cũ. Đồng ý trước đó không vượt qua việc quyền đã bị thu hồi; hết thời hạn tại now >= expires thì phải duyệt lại. Trong hệ thật dùng thời gian server và bản ghi bền có ACL; không tin expires hay approved do browser/model gửi. Không tự kéo dài thời hạn khi restart.

  Idempotency key gắn với (principal, request_id), còn payload được lưu để phát hiện dùng lại key cho hành động khác. Gọi lại đúng request trả already_applied và không ghi lần hai; gọi khác payload trả idempotency_conflict kể cả đã được duyệt mới. Kiểm tra trạng thái đích để không báo thành công từ cache khi ghi chú đã đổi lại: state_drift cần đối chiếu, không tự ghi đè.

  Ví dụ chỉ có một tiến trình và dict, không có concurrency hay crash. Production cần unique constraint/transaction hoặc idempotency tại hệ thống đích, trạng thái pending/succeeded/unknown, xác nhận version đích và cơ chế reconciliation. Nếu đứt mạng sau ghi nhưng trước checkpoint, không thể chứng minh exactly-once chỉ bằng một file JSON. Xem hướng dẫn LangGraph: node có thể chạy lại từ đầu khi resume, nên side effect trước interrupt cần idempotent hoặc tách ra và kiểm soát riêng.

  Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.
concept_notes_en: |-
  Human review is a control before consequential actions, not a way to grant the model extra authority. Approval must bind to a request, target and expiry; authorization still needs rechecking on resume because permissions may change while waiting.

  A checkpoint stores progress for one execution thread; a shared store may hold data across threads. A dictionary or InMemorySaver in RAM does not survive process termination. This example uses a temporary JSON file and actually starts a fresh Python process to read the pending checkpoint. It is a minimal disk-persistence model; production needs access controls, atomicity, schema versions and duplicate-execution protection.

  Self-check: does saving a checkpoint imply an action runs exactly once? No; retry after failure can duplicate effects. Use an idempotency key and completion state at the target system. This read-only fixture simulates approval and sends no external data.

  The original checkpoint example below remains useful: it persists a waiting state and demonstrates recovery in a new process. Its approved/can_read booleans simulate decisions but do not bind consent to the complete action. We retain that example and add a focused policy example instead of claiming checkpointing alone solves execution authority.

  Distinguish proposed → waiting_review → approved → executing → observed_complete. Review UI should show requester, tool, target, data changed/sent, expected impact and expiry. In the new example approve is a fake trusted reviewer channel unavailable to models/tool output. The server-side record stores a canonical snapshot of principal + request_id + tool + target + arguments and expires. Any argument change requires renewed approval. Canonical JSON is not a signature; sequential IDs and dictionaries are fixtures, not production authentication.

  On resume, recheck current permissions before execution or returning a cached result. Earlier approval cannot override revoked permission; at now >= expires require renewed review. Real deployments use server time and durable ACL-protected records, never browser/model-supplied expires or approved values. Do not extend expiry automatically on restart.

  The idempotency key is (principal, request_id); a stored payload detects reuse for a different action. Identical retries return already_applied without another write; changed payload returns idempotency_conflict even after renewed approval. Observe target state rather than claiming cached success when the note has changed again: state_drift requires reconciliation, not automatic overwrite.

  This example is single-process and in-memory, with no concurrency or crash window. Production needs unique constraints/transactions or target-system idempotency, pending/succeeded/unknown states, target version checks and reconciliation. If the connection drops after a write but before checkpointing, a JSON file cannot establish exactly-once execution. LangGraph documents that resume may restart a node from its beginning, so earlier side effects must be idempotent or separately controlled.

  Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.
why_it_matters_vi: Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
why_it_matters_en: Persist a review checkpoint to disk, recover it in a new process and recheck authorization
  on resume.
study_steps_vi:
- Đọc giải thích, dự đoán output rồi chạy mỗi ví dụ trong một ô Colab riêng; chỉ dùng Python 3.11+ standard
  library.
- Chạy cả hai ví dụ. Với policy, thử đổi target/status/request_id, đổi người duyệt, hết hạn, thu hồi quyền,
  retry đúng và target bị thay đổi sau ghi. Giữ số lần ghi và trạng thái quan sát làm bằng chứng.
- Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
- Sai người, request, target hoặc arguments không ghi; hết hạn/thu hồi quyền chặn cả resume.
- Retry đúng chỉ ghi 1 lần; conflict/drift không bị che bởi kết quả thành công cũ.
study_steps_en:
- Read the explanation, predict output and run each example in a separate Colab cell; only Python 3.11+ standard
  library is needed.
- Run both examples. For policy, vary target/status/request_id, principal, expiry, revoked permission, identical
  retry and post-write target drift. Keep write counts and observed state as evidence.
- Checkpoint still recovers in a fresh process; an in-memory dict is not durable storage.
- Wrong principal, request, target or arguments never write; expiry/revocation also block resume.
- Identical retries write once; conflict/drift cannot be hidden behind cached success.
practice_plan:
  vi:
    task: Chạy cả hai ví dụ. Với policy, thử đổi target/status/request_id, đổi người duyệt, hết hạn, thu hồi
      quyền, retry đúng và target bị thay đổi sau ghi. Giữ số lần ghi và trạng thái quan sát làm bằng chứng.
    deliverables:
    - Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
    - Sai người, request, target hoặc arguments không ghi; hết hạn/thu hồi quyền chặn cả resume.
    - Retry đúng chỉ ghi 1 lần; conflict/drift không bị che bởi kết quả thành công cũ.
    checkpoint: Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
    stretch: Đề xuất thiết kế lưu bền và test crash/concurrency; không khẳng định đã kiểm tra nếu chỉ chạy
      simulator.
  en:
    task: Run both examples. For policy, vary target/status/request_id, principal, expiry, revoked permission,
      identical retry and post-write target drift. Keep write counts and observed state as evidence.
    deliverables:
    - Checkpoint still recovers in a fresh process; an in-memory dict is not durable storage.
    - Wrong principal, request, target or arguments never write; expiry/revocation also block resume.
    - Identical retries write once; conflict/drift cannot be hidden behind cached success.
    checkpoint: Checkpoint still recovers in a fresh process; an in-memory dict is not durable storage.
    stretch: Propose durable storage and crash/concurrency tests; do not claim they passed from simulator-only
      results.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Người duyệt và giới hạn an toàn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain human in the loop and guardrails to a new teammate?
  - Which assumption behind human in the loop and guardrails could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Persist a review checkpoint and resume in a new process
  code: |
    import json
    from pathlib import Path
    import subprocess
    import sys
    from tempfile import TemporaryDirectory
    def resume(state, approved, can_read):
        if state["status"] != "waiting_review":
            raise ValueError("checkpoint is not waiting")
        return "read_only_complete" if approved and can_read else "denied"
    with TemporaryDirectory() as folder:
        path = Path(folder) / "checkpoint.json"
        path.write_text(json.dumps({"schema_version": 1, "thread_id": "case-1",
                                   "request": "read:guide", "status": "waiting_review"}), encoding="utf-8")
        child = "import json,sys; print(json.load(open(sys.argv[1], encoding='utf-8'))['status'])"
        fresh = subprocess.check_output([sys.executable, "-c", child, str(path)], text=True).strip()
        restored = json.loads(path.read_text(encoding="utf-8"))
        print(json.dumps({"fresh_process_state": fresh,
                          "approved": resume(restored, True, True),
                          "permission_revoked": resume(restored, True, False)}))
  status: runnable
  purpose_vi: Lưu điểm chờ duyệt vào đĩa, phục hồi ở tiến trình mới và kiểm tra lại quyền khi tiếp tục.
  purpose_en: Persist a review checkpoint to disk, recover it in a new process and recheck authorization on
    resume.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"fresh_process_state": "waiting_review", "approved": "read_only_complete", "permission_revoked":
    "denied"}'
  edge_case_vi: Duyệt nhưng mất quyền đọc vẫn phải denied; không dùng RAM để tuyên bố phục hồi sau restart.
  edge_case_en: Approval with revoked read access must still be denied; RAM state cannot establish restart
    recovery.
  explanation_vi: TemporaryDirectory giữ file đủ lâu để tiến trình con đọc, rồi dọn file do ví dụ tạo; không
    thay đổi tài liệu thật.
  explanation_en: TemporaryDirectory retains the file for the child process and then cleans up only fixture
    files; no real document changes.
  setup_en: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
- language: python
  title: 'Scripted policy simulator: tool_policy.py'
  code: |
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


    def resume_demo():
        policy = Policy()
        call = {"tool": "set_status", "target": "note-1", "arguments": {"status": "reviewed"}}
        grant = policy.approve("alice", "paused-1", call, 0, ttl=3)
        print("late_resume", policy.execute("alice", "paused-1", call, 3, 20, grant))
        print("writes_before_reapproval", policy.writes)
        fresh = policy.approve("alice", "paused-1", call, 4)
        print("fresh_resume", policy.execute("alice", "paused-1", call, 5, 20, fresh))
        print("retry", policy.execute("alice", "paused-1", call, 6, 20, fresh))
        policy.notes["note-1"] = "draft"
        print("external_drift", policy.execute("alice", "paused-1", call, 7, 20, fresh))
        print("writes", policy.writes)


    if __name__ == "__main__":
        resume_demo()
  status: runnable
  setup: Python 3.11+ standard library only. Paste the complete example into one Google Colab cell; no API
    key, model or installation.
  purpose_vi: Sau pause, kiểm tra hết hạn, duyệt lại, retry idempotent và trạng thái đích bị đổi ngoài luồng.
  purpose_en: After a pause, check expiry, fresh approval, idempotent retry and external state drift.
  expected_output: |-
    late_resume approval_expired
    writes_before_reapproval 0
    fresh_resume applied
    retry already_applied
    external_drift state_drift
    writes 1
  edge_case_vi: Chạy cả hai ví dụ. Với policy, thử đổi target/status/request_id, đổi người duyệt, hết hạn,
    thu hồi quyền, retry đúng và target bị thay đổi sau ghi. Giữ số lần ghi và trạng thái quan sát làm bằng
    chứng.
  edge_case_en: Run both examples. For policy, vary target/status/request_id, principal, expiry, revoked permission,
    identical retry and post-write target drift. Keep write counts and observed state as evidence.
  explanation_vi: Approval hết hạn không ghi; duyệt lại cho đúng action chỉ ghi một lần. Cache thành công không
    được che việc trạng thái đích đã đổi.
  explanation_en: Expired approval cannot write; a fresh exact-action approval writes once. Cached success
    must not hide changed target state.
  setup_en: Python 3.11+ standard library only. Paste the complete example into one Google Colab cell; no API
    key, model or installation.
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
resources:
- language: en
  title: Building Effective Agents
  url: https://www.anthropic.com/research/building-effective-agents
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: LangGraph Documentation
  url: https://langchain-ai.github.io/langgraph/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: OpenAI Cookbook
  url: https://cookbook.openai.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Agents Course
  url: https://huggingface.co/learn/agents-course/unit0/introduction
  kind: official
  required: false
  purpose_vi: Lộ trình tác nhân gồm nền tảng, công cụ và vòng lặp hành động/quan sát; có Agentic RAG cùng phần
    đánh giá/quan sát tùy chọn.
  purpose_en: Agent learning path covering fundamentals, tools, and action/observation loops, with Agentic
    RAG and optional evaluation/observability.
  read_vi: Đọc Unit 1 để ôn nền tảng, Unit 3 về Agentic RAG; chỉ mở phần Observability/Evaluation khi cần.
  read_en: Use Unit 1 to review foundations and Unit 3 for Agentic RAG; consult Observability/Evaluation only
    when relevant.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab B
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập
    chỉ đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake
    tools and downloads no model; download the report to retain results.
- title: LangGraph — Persistence
  url: https://docs.langchain.com/oss/python/langgraph/persistence
  purpose_vi: Phân biệt checkpoint theo thread, store và backend lưu bền.
  purpose_en: Distinguish per-thread checkpoints, stores and durable backends.
  read_vi: Đọc Checkpoints, Threads và Checkpointer libraries; phân biệt InMemorySaver với backend lưu đĩa.
  read_en: Read Checkpoints, Threads and Checkpointer libraries; distinguish InMemorySaver from disk-backed
    persistence.
  language: en
  kind: official
  required: false
- title: MCP tools — revision 2025-06-18
  url: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
  language: en
  kind: official
  required: false
  purpose_vi: 'Đọc User Interaction Model, Error Handling và Security Considerations: input validation, access
    control, confirmation, timeout.'
  purpose_en: 'Read User Interaction Model, Error Handling and Security Considerations: validation, access
    control, confirmation and timeout.'
  read_vi: 'Đọc User Interaction Model, Error Handling và Security Considerations: input validation, access
    control, confirmation, timeout.'
  read_en: 'Read User Interaction Model, Error Handling and Security Considerations: validation, access control,
    confirmation and timeout.'
- title: LangGraph — Interrupts
  url: https://docs.langchain.com/oss/python/langgraph/interrupts
  language: en
  kind: official
  required: false
  purpose_vi: 'Đọc Resuming interrupts và Rules of interrupts: node chạy lại, tác động phải có idempotency;
    ví dụ trong bài không dùng SDK này.'
  purpose_en: 'Read Resuming interrupts and Rules of interrupts: node restart and idempotent effects; this
    lesson does not execute the SDK.'
  read_vi: 'Đọc Resuming interrupts và Rules of interrupts: node chạy lại, tác động phải có idempotency; ví
    dụ trong bài không dùng SDK này.'
  read_en: 'Read Resuming interrupts and Rules of interrupts: node restart and idempotent effects; this lesson
    does not execute the SDK.'
exercise_ids:
- exercise-15-ai-agents
review_item_ids:
- phase-15-genai-agents-ai-agents-4-recall
- phase-15-genai-agents-ai-agents-4-application
- phase-15-genai-agents-ai-agents-4-debug
- phase-15-genai-agents-ai-agents-4-interview
estimated_minutes: 60
completion_checklist:
- Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
- Sai người, request, target hoặc arguments không ghi; hết hạn/thu hồi quyền chặn cả resume.
- Retry đúng chỉ ghi 1 lần; conflict/drift không bị che bởi kết quả thành công cũ.
completion_criteria:
- Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
- Sai người, request, target hoặc arguments không ghi; hết hạn/thu hồi quyền chặn cả resume.
- Retry đúng chỉ ghi 1 lần; conflict/drift không bị che bởi kết quả thành công cũ.
common_mistakes:
- Coi schema hợp lệ, lời model đề xuất hoặc mô tả tool là quyền thực thi.
- Gọi hết ngân sách là thành công hoặc timeout là bằng chứng chưa ghi.
- Đổi payload sau khi duyệt, tin quyền cũ khi resume hoặc coi checkpoint là exactly-once.
- Suy an toàn MCP/OAuth/model thật từ một simulator theo kịch bản.
next_lessons:
- phase-16-genai-mcp-mcp-1
- phase-16-genai-mcp-mcp-2
review_question_vi: Nội dung cốt lõi của “Người duyệt và giới hạn an toàn” là gì?
review_question_en: Define human in the loop and guardrails in your own words. What are the input, transformation
  and output?
review_answer_vi: Duyệt đúng người, request, tool, đích và tham số; kiểm tra lại quyền, thời hạn và trạng thái
  đích khi tiếp tục. Checkpoint vẫn phục hồi ở tiến trình mới; không gọi dict RAM là lưu bền.
review_answer_en: Bind approval to principal, request, tool, target and arguments; recheck permissions, expiry
  and target state on resume. Wrong principal, request, target or arguments never write; expiry/revocation
  also block resume.
review_cards:
- id: phase-15-genai-agents-ai-agents-4-recall
  type: recall
  question_vi: Checkpoint và approval khác nhau thế nào?
  question_en: How do checkpoint and approval differ?
  answer_vi: Checkpoint lưu trạng thái để tiếp tục tính toán; approval cho phép đúng tác động trong phạm vi
    và thời hạn. Khôi phục checkpoint không khôi phục quyền đã bị thu hồi hoặc gia hạn approval cũ.
  answer_en: A checkpoint stores resumable computation state; approval authorizes a specific effect within
    scope and time. Restoring a checkpoint cannot restore revoked permission or extend expired approval.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-4-application
  type: application
  question_vi: 'Approval hết hạn lúc 3, resume lúc 3: phải xử lý ra sao?'
  question_en: 'Approval expires at 3 and resume occurs at 3: what is required?'
  answer_vi: now >= expires bị chặn approval_expired, writes=0. Người duyệt phải xác nhận lại đúng action qua
    kênh tin cậy; approval mới cho phép ghi một lần, retry sau đó đọc lại trạng thái thay vì ghi lại.
  answer_en: now >= expires returns approval_expired with writes=0. A trusted reviewer must approve the exact
    action again. Fresh approval allows one write; a retry inspects state rather than writing again.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-4-debug
  type: debug
  question_vi: 'Cache nói đã applied nhưng đối tượng hiện là draft: làm gì?'
  question_en: 'Cached success says applied but the target is now draft: what should happen?'
  answer_vi: Trả state_drift và chuyển sang đối chiếu/xác nhận lại, không nói already_applied và không tự ghi
    đè. Kiểm tra cả trạng thái đích hiện tại, quyền hiện tại và binding của request.
  answer_en: Return state_drift for reconciliation or fresh approval, not already_applied or an automatic overwrite.
    Inspect current target state, authority and request binding.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-4-interview
  type: interview
  question_vi: Làm sao kiểm chứng lưu bền mà không nhầm dict RAM là checkpoint?
  question_en: How do you verify durability rather than an in-memory checkpoint?
  answer_vi: Ví dụ đầu ghi checkpoint ra file rồi tiếp tục trong subprocess mới; so cursor, trace và kết quả.
    Ví dụ approval thứ hai chỉ là policy RAM riêng, không có persistence hoặc transaction. Hai phép thử chứng
    minh hai phạm vi khác nhau.
  answer_en: The first example writes a file checkpoint and resumes in a new subprocess, comparing cursor,
    trace and result. The second approval example is an in-memory policy without persistence or transactions.
    These tests establish separate properties.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Người duyệt và giới hạn an toàn / Human in the loop and guardrails

Người duyệt là điểm kiểm soát trước hành động có tác động, không phải cách cho model thêm quyền. Quyết định duyệt cần gắn với yêu cầu, đối tượng và thời hạn; khi tiếp tục vẫn phải kiểm tra lại quyền vì quyền có thể đã thay đổi trong lúc chờ.

Checkpoint lưu trạng thái để tiếp tục một luồng; store dùng chung có thể lưu dữ liệu xuyên nhiều luồng. Một dict hay InMemorySaver trong RAM không tồn tại sau khi tiến trình dừng. Ví dụ dùng tệp JSON tạm và thực sự mở tiến trình Python mới để đọc lại điểm chờ. Đây là mô hình lưu đĩa tối thiểu; production cần kiểm soát truy cập, tính nguyên tử, version schema và chống thực thi lặp.

Tự kiểm tra: đã lưu checkpoint có nghĩa hành động chỉ chạy một lần không? Không; retry sau lỗi có thể lặp tác động. Dùng idempotency key và trạng thái hoàn tất thích hợp ở hệ thống đích. Ví dụ chỉ đọc, mô phỏng người duyệt và không gửi dữ liệu ra ngoài.

Ví dụ checkpoint cũ bên dưới vẫn đúng cho việc lưu điểm chờ và chứng minh tiến trình mới đọc lại được trạng thái. Hai boolean approved/can_read chỉ mô phỏng quyết định; chúng chưa gắn sự đồng ý với toàn bộ hành động. Vì vậy bài giữ ví dụ đó và thêm ví dụ policy riêng, thay vì coi lưu checkpoint là giải quyết đủ quyền thực thi.

Luồng cần phân biệt proposed → waiting_review → approved → executing → observed_complete. UI duyệt phải hiển thị ai yêu cầu, công cụ nào, đích nào, dữ liệu sẽ đổi/gửi, tác động dự kiến và thời hạn. Trong ví dụ mới, approve là kênh người duyệt giả đáng tin; model/tool output không được gọi nó. Bản ghi phía server lưu snapshot chuẩn hóa của principal + request_id + tool + target + arguments và expires. Sửa một ký tự trong tham số phải xin duyệt lại. Snapshot JSON không phải chữ ký; ID tuần tự và dict chỉ là fixture, không dùng làm cơ chế xác thực production.

Khi resume, kiểm tra lại quyền hiện tại trước khi thực thi hoặc trả kết quả cũ. Đồng ý trước đó không vượt qua việc quyền đã bị thu hồi; hết thời hạn tại now >= expires thì phải duyệt lại. Trong hệ thật dùng thời gian server và bản ghi bền có ACL; không tin expires hay approved do browser/model gửi. Không tự kéo dài thời hạn khi restart.

Idempotency key gắn với (principal, request_id), còn payload được lưu để phát hiện dùng lại key cho hành động khác. Gọi lại đúng request trả already_applied và không ghi lần hai; gọi khác payload trả idempotency_conflict kể cả đã được duyệt mới. Kiểm tra trạng thái đích để không báo thành công từ cache khi ghi chú đã đổi lại: state_drift cần đối chiếu, không tự ghi đè.

Ví dụ chỉ có một tiến trình và dict, không có concurrency hay crash. Production cần unique constraint/transaction hoặc idempotency tại hệ thống đích, trạng thái pending/succeeded/unknown, xác nhận version đích và cơ chế reconciliation. Nếu đứt mạng sau ghi nhưng trước checkpoint, không thể chứng minh exactly-once chỉ bằng một file JSON. Xem hướng dẫn LangGraph: node có thể chạy lại từ đầu khi resume, nên side effect trước interrupt cần idempotent hoặc tách ra và kiểm soát riêng.

Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.

## English

Human review is a control before consequential actions, not a way to grant the model extra authority. Approval must bind to a request, target and expiry; authorization still needs rechecking on resume because permissions may change while waiting.

A checkpoint stores progress for one execution thread; a shared store may hold data across threads. A dictionary or InMemorySaver in RAM does not survive process termination. This example uses a temporary JSON file and actually starts a fresh Python process to read the pending checkpoint. It is a minimal disk-persistence model; production needs access controls, atomicity, schema versions and duplicate-execution protection.

Self-check: does saving a checkpoint imply an action runs exactly once? No; retry after failure can duplicate effects. Use an idempotency key and completion state at the target system. This read-only fixture simulates approval and sends no external data.

The original checkpoint example below remains useful: it persists a waiting state and demonstrates recovery in a new process. Its approved/can_read booleans simulate decisions but do not bind consent to the complete action. We retain that example and add a focused policy example instead of claiming checkpointing alone solves execution authority.

Distinguish proposed → waiting_review → approved → executing → observed_complete. Review UI should show requester, tool, target, data changed/sent, expected impact and expiry. In the new example approve is a fake trusted reviewer channel unavailable to models/tool output. The server-side record stores a canonical snapshot of principal + request_id + tool + target + arguments and expires. Any argument change requires renewed approval. Canonical JSON is not a signature; sequential IDs and dictionaries are fixtures, not production authentication.

On resume, recheck current permissions before execution or returning a cached result. Earlier approval cannot override revoked permission; at now >= expires require renewed review. Real deployments use server time and durable ACL-protected records, never browser/model-supplied expires or approved values. Do not extend expiry automatically on restart.

The idempotency key is (principal, request_id); a stored payload detects reuse for a different action. Identical retries return already_applied without another write; changed payload returns idempotency_conflict even after renewed approval. Observe target state rather than claiming cached success when the note has changed again: state_drift requires reconciliation, not automatic overwrite.

This example is single-process and in-memory, with no concurrency or crash window. Production needs unique constraints/transactions or target-system idempotency, pending/succeeded/unknown states, target version checks and reconciliation. If the connection drops after a write but before checkpointing, a JSON file cannot establish exactly-once execution. LangGraph documents that resume may restart a node from its beginning, so earlier side effects must be idempotent or separately controlled.

Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.

## Thực hành / Practice

Chạy cả hai ví dụ. Với policy, thử đổi target/status/request_id, đổi người duyệt, hết hạn, thu hồi quyền, retry đúng và target bị thay đổi sau ghi. Giữ số lần ghi và trạng thái quan sát làm bằng chứng.

Run both examples. For policy, vary target/status/request_id, principal, expiry, revoked permission, identical retry and post-write target drift. Keep write counts and observed state as evidence.
