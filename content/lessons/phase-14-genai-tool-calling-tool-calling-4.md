---
lesson_id: phase-14-genai-tool-calling-tool-calling-4
phase_id: phase-14-genai-tool-calling
module_id: tool-calling
title_vi: Xử lý lỗi và thực thi công cụ an toàn
title_en: Error handling and secure tool execution
summary_vi: Kiểm tra schema, quyền và phạm vi hành động trước khi chạy; chỉ thử lại lỗi tạm thời trong ngân
  sách hữu hạn.
summary_en: Validate schema, authorization and action scope before execution; retry only transient failures
  within a finite budget.
learning_objectives:
- Kiểm tra schema, quyền và phạm vi hành động trước khi chạy; chỉ thử lại lỗi tạm thời trong ngân sách hữu
  hạn.
- Sáu ca có expected/actual; ca bị chặn không tăng writes.
- Lặp đúng yêu cầu trả already_applied, writes vẫn bằng 1 và trạng thái đích là reviewed.
- Phân biệt schema error, permission error và transient timeout; không gọi timeout là chưa ghi.
learning_objectives_en:
- Validate schema, authorization and action scope before execution; retry only transient failures within a
  finite budget.
- Six cases have expected/actual results; denied cases never increase writes.
- An identical retry returns already_applied, writes stays 1 and target status is reviewed.
- Distinguish schema, permission and transient errors; a timeout is not proof of no write.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-3
- phase-13-genai-advanced-rag-advanced-rag-1
key_terms:
- error
- handling
- secure
- tool
- execution
- token
- embedding
- retrieval
- evaluation
- tool-calling
concept_notes_vi: |-
  Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần thiết và ghi dấu vết thao tác mà không lộ bí mật.

  Lỗi đầu vào cần sửa dữ liệu; lỗi quyền cần xử lý phạm vi truy cập; lỗi tạm thời có thể phù hợp để thử lại có giới hạn. Gộp mọi lỗi thành câu 'hãy thử lại' làm agent lặp vô ích hoặc cố thực hiện thao tác không được phép.

  Ví dụ, khi công cụ trả thiếu quyền đọc, agent giải thích giới hạn hoặc dùng nguồn được phép thay vì đổi tài khoản. Tự kiểm tra: đưa toàn bộ thông báo lỗi và biến môi trường vào prompt có giúp sửa nhanh một cách an toàn không? Không; chỉ chuyển thông tin cần thiết, che bí mật và giữ log kỹ thuật theo quyền phù hợp.

  Một lời gọi hợp schema chỉ nói tham số có hình dạng hợp lệ. Nó chưa chứng minh người gọi có quyền đọc note-1 hay được đổi trạng thái của ghi chú. Cần tách bốn lớp: model đề xuất → ứng dụng kiểm tra schema/allowlist → kiểm tra danh tính và quyền trên đối tượng → thực thi rồi kiểm tra kết quả. Danh tính lấy từ phiên đã xác thực phía server, không từ arguments do model tự khai.

  Trong ví dụ, allowlist chỉ có read_note và set_status. arguments của read_note phải rỗng; set_status chỉ nhận status thuộc draft/reviewed. Không chấp nhận khóa thừa để một trường principal hoặc lệnh shell không lọt vào dispatcher. Hàm validate chỉ thực thi một schema nhỏ bằng Python, không phải bộ kiểm định JSON Schema tổng quát. Với API thật, công bố inputSchema rõ kiểu/required/additionalProperties và kiểm tra lại phía server, kể cả khi provider có strict mode.

  Lỗi schema/đích không hợp lệ cần sửa đề xuất; lỗi permission_denied phải dừng hoặc yêu cầu quyền qua luồng hợp lệ, không đổi người dùng để thử. Timeout/429/5xx có thể thử lại nếu thao tác cho phép, có backoff, Retry-After phù hợp và tổng số lần/thời gian hữu hạn. Timeout của lệnh ghi là kết quả chưa biết, không chứng minh chưa ghi: truy vấn trạng thái bằng idempotency key ở đích trước khi gửi lại. Không retry mọi exception.

  Ví dụ bên dưới bổ sung một thao tác ghi giả vào dict trong RAM để thấy khác biệt giữa applied, already_applied và approval_mismatch. Nó không ghi database, gọi mạng hay xác thực tài khoản thật. Bài Người duyệt và giới hạn an toàn sẽ giải thích sâu bản ghi duyệt và resume. Audit chỉ giữ nhãn trạng thái; production cần thêm request ID đã kiểm soát, thời điểm, actor/target theo quyền và retention, không log token/raw prompt/document.

  Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.
concept_notes_en: |-
  Tool errors need enough information to choose correction, retry or stopping. Grant minimum permissions and record actions without exposing secrets.

  Invalid input needs correction; authorization failure needs scope handling; transient failure may permit bounded retry. Treating every error as retryable causes pointless loops or attempts beyond permission.

  When a tool lacks read access, explain the limit or use an authorized source rather than switching accounts. Self-check: is sending complete errors and environment variables to the model a safe shortcut? No: provide necessary details, redact secrets and protect technical logs with appropriate access.

  Schema validity only describes argument shape. It does not prove that the caller can read note-1 or change its status. Separate four layers: model proposal → application schema/allowlist checks → identity and object-level authorization → execution and result verification. The principal comes from authenticated server context, never model-supplied arguments.

  The allowlist contains read_note and set_status. read_note accepts no arguments; set_status accepts only status in draft/reviewed. Reject extra keys so a forged principal or shell instruction cannot reach dispatch. validate implements one small schema in Python, not a general JSON Schema validator. A real API should publish types/required/additionalProperties and enforce validation server-side even when a provider offers strict mode.

  Invalid schema/target requires a corrected proposal; permission_denied must stop or use a legitimate authorization workflow, never switch identity to retry. Timeout/429/5xx may be retryable when the operation permits it, with backoff, appropriate Retry-After handling and finite attempt/time budgets. A write timeout means unknown outcome, not proof of no write: reconcile target state using an idempotency key before retrying. Do not retry every exception.

  The example adds a fake in-memory dict write to distinguish applied, already_applied and approval_mismatch. It performs no database/network write or real authentication. The human-review lesson explains approval records and resume in depth. Audit keeps only status labels; production also needs controlled request IDs, timestamps, authorized actor/target fields and retention without tokens/raw prompts/documents.

  Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.
why_it_matters_vi: Kiểm tra lời gọi và quyền trước khi biến đề xuất của mô hình thành hành động.
why_it_matters_en: Tool calling turns model output into actions, so its contracts must be stricter than ordinary
  chat.
study_steps_vi:
- Đọc giải thích, dự đoán output rồi chạy mỗi ví dụ trong một ô Colab riêng; chỉ dùng Python 3.11+ standard
  library.
- 'Chạy ví dụ; thêm sáu ca: tool ngoài allowlist, khóa thừa, status sai, sai người, không duyệt, gọi lại đúng
  request. Ghi trạng thái và số lần ghi sau mỗi ca.'
- Sáu ca có expected/actual; ca bị chặn không tăng writes.
- Lặp đúng yêu cầu trả already_applied, writes vẫn bằng 1 và trạng thái đích là reviewed.
- Phân biệt schema error, permission error và transient timeout; không gọi timeout là chưa ghi.
study_steps_en:
- Read the explanation, predict output and run each example in a separate Colab cell; only Python 3.11+ standard
  library is needed.
- 'Run the example; add six cases: unlisted tool, extra key, invalid status, wrong user, missing approval and
  identical retry. Record status and write count after each case.'
- Six cases have expected/actual results; denied cases never increase writes.
- An identical retry returns already_applied, writes stays 1 and target status is reviewed.
- Distinguish schema, permission and transient errors; a timeout is not proof of no write.
practice_plan:
  vi:
    task: 'Chạy ví dụ; thêm sáu ca: tool ngoài allowlist, khóa thừa, status sai, sai người, không duyệt, gọi
      lại đúng request. Ghi trạng thái và số lần ghi sau mỗi ca.'
    deliverables:
    - Sáu ca có expected/actual; ca bị chặn không tăng writes.
    - Lặp đúng yêu cầu trả already_applied, writes vẫn bằng 1 và trạng thái đích là reviewed.
    - Phân biệt schema error, permission error và transient timeout; không gọi timeout là chưa ghi.
    checkpoint: Sáu ca có expected/actual; ca bị chặn không tăng writes.
    stretch: Đề xuất thiết kế lưu bền và test crash/concurrency; không khẳng định đã kiểm tra nếu chỉ chạy
      simulator.
  en:
    task: 'Run the example; add six cases: unlisted tool, extra key, invalid status, wrong user, missing approval
      and identical retry. Record status and write count after each case.'
    deliverables:
    - Six cases have expected/actual results; denied cases never increase writes.
    - An identical retry returns already_applied, writes stays 1 and target status is reviewed.
    - Distinguish schema, permission and transient errors; a timeout is not proof of no write.
    checkpoint: Six cases have expected/actual results; denied cases never increase writes.
    stretch: Propose durable storage and crash/concurrency tests; do not claim they passed from simulator-only
      results.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xử lý lỗi và thực thi công cụ an toàn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain error handling and secure tool execution to a new teammate?
  - Which assumption behind error handling and secure tool execution could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
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
  status: runnable
  setup: Python 3.11+ standard library only. Paste the complete example into one Google Colab cell; no API
    key, model or installation.
  purpose_vi: Kiểm tra schema, quyền và phạm vi hành động trước khi chạy; chỉ thử lại lỗi tạm thời trong ngân
    sách hữu hạn.
  purpose_en: Validate schema, authorization and action scope before execution; retry only transient failures
    within a finite budget.
  expected_output: |-
    applied
    already_applied
    writes 1 observed reviewed
    approval_mismatch
    permission_denied
  edge_case_vi: 'Chạy ví dụ; thêm sáu ca: tool ngoài allowlist, khóa thừa, status sai, sai người, không duyệt,
    gọi lại đúng request. Ghi trạng thái và số lần ghi sau mỗi ca.'
  edge_case_en: 'Run the example; add six cases: unlisted tool, extra key, invalid status, wrong user, missing
    approval and identical retry. Record status and write count after each case.'
  explanation_vi: Dữ liệu và quyết định đều mô phỏng; chỉ thay đổi dict trong RAM. Không gọi model/MCP/API
    thật, không thực thi lệnh lấy từ tài liệu. Các kiểm thử xác nhận hành vi fixture, không chứng nhận an toàn
    production.
  explanation_en: Data and decisions are scripted; only in-memory dictionaries change. No real model/MCP/API
    is called and document instructions are never executed. Tests establish fixture behavior, not production
    security.
resources:
- language: en
  title: OpenAI Function Calling Guide
  url: https://platform.openai.com/docs/guides/function-calling
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: JSON Schema
  url: https://json-schema.org/learn/getting-started-step-by-step
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Tenacity Documentation
  url: https://tenacity.readthedocs.io/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
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
exercise_ids:
- exercise-14-tool-calling
review_item_ids:
- phase-14-genai-tool-calling-tool-calling-4-recall
- phase-14-genai-tool-calling-tool-calling-4-application
- phase-14-genai-tool-calling-tool-calling-4-debug
- phase-14-genai-tool-calling-tool-calling-4-interview
estimated_minutes: 60
completion_checklist:
- Sáu ca có expected/actual; ca bị chặn không tăng writes.
- Lặp đúng yêu cầu trả already_applied, writes vẫn bằng 1 và trạng thái đích là reviewed.
- Phân biệt schema error, permission error và transient timeout; không gọi timeout là chưa ghi.
completion_criteria:
- Sáu ca có expected/actual; ca bị chặn không tăng writes.
- Lặp đúng yêu cầu trả already_applied, writes vẫn bằng 1 và trạng thái đích là reviewed.
- Phân biệt schema error, permission error và transient timeout; không gọi timeout là chưa ghi.
common_mistakes:
- Coi schema hợp lệ, lời model đề xuất hoặc mô tả tool là quyền thực thi.
- Gọi hết ngân sách là thành công hoặc timeout là bằng chứng chưa ghi.
- Đổi payload sau khi duyệt, tin quyền cũ khi resume hoặc coi checkpoint là exactly-once.
- Suy an toàn MCP/OAuth/model thật từ một simulator theo kịch bản.
next_lessons:
- phase-15-genai-agents-ai-agents-1
- phase-15-genai-agents-ai-agents-2
review_question_vi: Nội dung cốt lõi của “Xử lý lỗi và thực thi công cụ an toàn” là gì?
review_question_en: Define error handling and secure tool execution in your own words. What are the input,
  transformation and output?
review_answer_vi: Kiểm tra schema, quyền và phạm vi hành động trước khi chạy; chỉ thử lại lỗi tạm thời trong
  ngân sách hữu hạn. Sáu ca có expected/actual; ca bị chặn không tăng writes.
review_answer_en: Validate schema, authorization and action scope before execution; retry only transient failures
  within a finite budget. An identical retry returns already_applied, writes stays 1 and target status is reviewed.
review_cards:
- id: phase-14-genai-tool-calling-tool-calling-4-recall
  type: recall
  question_vi: Schema hợp lệ đã đủ để chạy tool chưa?
  question_en: Does valid schema authorize a tool call?
  answer_vi: Chưa. Schema chỉ xác nhận cấu trúc; còn phải kiểm tra danh tính từ kênh tin cậy, allowlist, quyền
    với đối tượng, deadline và approval cho hành động ghi cụ thể.
  answer_en: No. Schema checks structure; execution also requires a trusted identity, allowlist, object permission,
    deadline and exact-action approval for writes.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-14-genai-tool-calling-tool-calling-4-application
  type: application
  question_vi: Retry request-1 sau khi đã ghi thành công phải làm gì?
  question_en: What should a retry of successful request-1 do?
  answer_vi: Giữ cùng người/request/tool/đích/tham số, kiểm tra lại quyền và approval còn hạn, đọc trạng thái
    đích. Nếu vẫn reviewed thì trả already_applied và writes giữ 1; đổi tham số không được dùng kết quả cache
    cũ.
  answer_en: Keep the same principal/request/tool/target/arguments, recheck current permission and approval,
    then inspect target state. If still reviewed, return already_applied with writes=1. Changed arguments cannot
    reuse cached success.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-14-genai-tool-calling-tool-calling-4-debug
  type: debug
  question_vi: 'Approval có sẵn nhưng đổi status từ reviewed thành draft: kiểm tra gì?'
  question_en: 'Approval exists, but status changes from reviewed to draft: what fails?'
  answer_vi: 'So snapshot chuẩn hóa với call mới: binding khác nên approval_mismatch trước khi ghi. Test phải
    kiểm tra cả nhãn lỗi và writes không tăng; chỉ assert có exception chưa chứng minh trạng thái không đổi.'
  answer_en: The canonical action binding changes, so approval_mismatch occurs before a write. Assert both
    the error label and unchanged writes/state; an exception alone does not prove no side effect.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-14-genai-tool-calling-tool-calling-4-interview
  type: interview
  question_vi: Idempotency trong fixture chứng minh được giới hạn nào?
  question_en: What does fixture idempotency establish, and what remains unproven?
  answer_vi: Nó chứng minh nhánh retry tuần tự không ghi lặp và phát hiện state_drift. Dict RAM không giải
    quyết race giữa hai worker hoặc crash sau ghi trước lưu kết quả; production cần transaction/durable idempotency
    store và test crash.
  answer_en: It checks sequential retries and state drift. In-memory dictionaries do not cover concurrent workers
    or a crash between writing and recording completion; production needs durable transactional idempotency
    and crash tests.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xử lý lỗi và thực thi công cụ an toàn / Error handling and secure tool execution

Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần thiết và ghi dấu vết thao tác mà không lộ bí mật.

Lỗi đầu vào cần sửa dữ liệu; lỗi quyền cần xử lý phạm vi truy cập; lỗi tạm thời có thể phù hợp để thử lại có giới hạn. Gộp mọi lỗi thành câu 'hãy thử lại' làm agent lặp vô ích hoặc cố thực hiện thao tác không được phép.

Ví dụ, khi công cụ trả thiếu quyền đọc, agent giải thích giới hạn hoặc dùng nguồn được phép thay vì đổi tài khoản. Tự kiểm tra: đưa toàn bộ thông báo lỗi và biến môi trường vào prompt có giúp sửa nhanh một cách an toàn không? Không; chỉ chuyển thông tin cần thiết, che bí mật và giữ log kỹ thuật theo quyền phù hợp.

Một lời gọi hợp schema chỉ nói tham số có hình dạng hợp lệ. Nó chưa chứng minh người gọi có quyền đọc note-1 hay được đổi trạng thái của ghi chú. Cần tách bốn lớp: model đề xuất → ứng dụng kiểm tra schema/allowlist → kiểm tra danh tính và quyền trên đối tượng → thực thi rồi kiểm tra kết quả. Danh tính lấy từ phiên đã xác thực phía server, không từ arguments do model tự khai.

Trong ví dụ, allowlist chỉ có read_note và set_status. arguments của read_note phải rỗng; set_status chỉ nhận status thuộc draft/reviewed. Không chấp nhận khóa thừa để một trường principal hoặc lệnh shell không lọt vào dispatcher. Hàm validate chỉ thực thi một schema nhỏ bằng Python, không phải bộ kiểm định JSON Schema tổng quát. Với API thật, công bố inputSchema rõ kiểu/required/additionalProperties và kiểm tra lại phía server, kể cả khi provider có strict mode.

Lỗi schema/đích không hợp lệ cần sửa đề xuất; lỗi permission_denied phải dừng hoặc yêu cầu quyền qua luồng hợp lệ, không đổi người dùng để thử. Timeout/429/5xx có thể thử lại nếu thao tác cho phép, có backoff, Retry-After phù hợp và tổng số lần/thời gian hữu hạn. Timeout của lệnh ghi là kết quả chưa biết, không chứng minh chưa ghi: truy vấn trạng thái bằng idempotency key ở đích trước khi gửi lại. Không retry mọi exception.

Ví dụ bên dưới bổ sung một thao tác ghi giả vào dict trong RAM để thấy khác biệt giữa applied, already_applied và approval_mismatch. Nó không ghi database, gọi mạng hay xác thực tài khoản thật. Bài Người duyệt và giới hạn an toàn sẽ giải thích sâu bản ghi duyệt và resume. Audit chỉ giữ nhãn trạng thái; production cần thêm request ID đã kiểm soát, thời điểm, actor/target theo quyền và retention, không log token/raw prompt/document.

Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.

## English

Tool errors need enough information to choose correction, retry or stopping. Grant minimum permissions and record actions without exposing secrets.

Invalid input needs correction; authorization failure needs scope handling; transient failure may permit bounded retry. Treating every error as retryable causes pointless loops or attempts beyond permission.

When a tool lacks read access, explain the limit or use an authorized source rather than switching accounts. Self-check: is sending complete errors and environment variables to the model a safe shortcut? No: provide necessary details, redact secrets and protect technical logs with appropriate access.

Schema validity only describes argument shape. It does not prove that the caller can read note-1 or change its status. Separate four layers: model proposal → application schema/allowlist checks → identity and object-level authorization → execution and result verification. The principal comes from authenticated server context, never model-supplied arguments.

The allowlist contains read_note and set_status. read_note accepts no arguments; set_status accepts only status in draft/reviewed. Reject extra keys so a forged principal or shell instruction cannot reach dispatch. validate implements one small schema in Python, not a general JSON Schema validator. A real API should publish types/required/additionalProperties and enforce validation server-side even when a provider offers strict mode.

Invalid schema/target requires a corrected proposal; permission_denied must stop or use a legitimate authorization workflow, never switch identity to retry. Timeout/429/5xx may be retryable when the operation permits it, with backoff, appropriate Retry-After handling and finite attempt/time budgets. A write timeout means unknown outcome, not proof of no write: reconcile target state using an idempotency key before retrying. Do not retry every exception.

The example adds a fake in-memory dict write to distinguish applied, already_applied and approval_mismatch. It performs no database/network write or real authentication. The human-review lesson explains approval records and resume in depth. Audit keeps only status labels; production also needs controlled request IDs, timestamps, authorized actor/target fields and retention without tokens/raw prompts/documents.

Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.

## Thực hành / Practice

Chạy ví dụ; thêm sáu ca: tool ngoài allowlist, khóa thừa, status sai, sai người, không duyệt, gọi lại đúng request. Ghi trạng thái và số lần ghi sau mỗi ca.

Run the example; add six cases: unlisted tool, extra key, invalid status, wrong user, missing approval and identical retry. Record status and write count after each case.
