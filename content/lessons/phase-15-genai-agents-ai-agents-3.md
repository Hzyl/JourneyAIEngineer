---
lesson_id: phase-15-genai-agents-ai-agents-3
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Vòng lặp agent và điều kiện dừng
title_en: Agent loops and stop conditions
summary_vi: Dừng vòng lặp theo số lần thử, deadline, lỗi liên tiếp và truy vấn lặp; phân biệt tìm thấy bằng
  chứng với hoàn thành nhiệm vụ.
summary_en: Stop by attempt budget, deadline, consecutive errors and repeated queries; distinguish evidence
  discovery from task completion.
learning_objectives:
- Dừng vòng lặp theo số lần thử, deadline, lỗi liên tiếp và truy vấn lặp; phân biệt tìm thấy bằng chứng với
  hoàn thành nhiệm vụ.
- Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
- Hai timeout liên tiếp dừng error_limit; PermissionError dừng ngay bước 1.
- Kết quả muộn bị đánh dấu late_result/deadline; trace không lưu câu truy vấn hoặc thông báo lỗi thô.
learning_objectives_en:
- Stop by attempt budget, deadline, consecutive errors and repeated queries; distinguish evidence discovery
  from task completion.
- An eight-step empty-result plan stops at five calls with step_limit, never success.
- Two consecutive timeouts stop at error_limit; PermissionError stops at step 1.
- A late result is marked late_result/deadline; traces contain no raw query or exception message.
prerequisites:
- phase-15-genai-agents-ai-agents-2
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- agent
- loop
- điều
- kiện
- dừng
- token
- embedding
- retrieval
- evaluation
- ai-agents
concept_notes_vi: |-
  Vòng lặp nhận quan sát, chọn hành động rồi kiểm tra kết quả. Giới hạn số bước, thời gian, chi phí và lỗi liên tiếp cần được thực thi bên ngoài quyết định của mô hình.

  Điều kiện thành công mô tả kết quả cần đạt; giới hạn dừng bảo vệ thời gian và tài nguyên khi chưa đạt kết quả. Hai điều này phải được ghi riêng để không báo 'hoàn tất' chỉ vì hết lượt chạy.

  Ví dụ, agent tra cứu gặp cùng lỗi quyền nhiều lần cần dừng và nêu trở ngại, thay vì đổi cách diễn đạt lời gọi vô hạn. Tự kiểm tra: để mô hình tự nhớ giới hạn số bước đã đủ chưa? Chưa; bộ điều khiển phải đếm, thực thi hạn mức và lưu trạng thái. Khi dừng do giới hạn, báo phần đã xác minh cùng việc còn thiếu.

  Lab B trong repo đã so sánh workflow cố định với bộ điều khiển thích nghi theo kịch bản trên cùng nhiệm vụ; đã có call budget, timeout và checkpoint. Không tạo thêm một agent giả rồi gọi là LLM agent. Ví dụ rút gọn dưới đây giúp quan sát trực tiếp phần bộ điều khiển: plan là danh sách lập sẵn, tool là hàm Python chỉ đọc; không có suy luận từ model.

  Mỗi lần thử đều tiêu ngân sách, kể cả schema sai, tool bị chặn hay timeout. Thành công ở đây chỉ là evidence_found: cần kiểm tra tài liệu thực sự trả lời câu hỏi, quyền truy cập, groundedness và citation ở bước sau. step_limit, deadline, error_limit, repeated_query và plan_exhausted đều không phải hoàn thành. Lưu stop_reason cùng số bước để người dùng biết điều còn thiếu.

  Ví dụ cho retry timeout của công cụ đọc với tối đa hai lỗi liên tiếp; lỗi quyền dừng ngay. Query đã chạy thành công nhưng không có bằng chứng được ghi vào seen để phát hiện lặp. Query timeout chưa có kết quả có thể thử lại nhưng vẫn tốn một bước. Thực tế còn cần token/cost budget và backoff nếu gọi provider; ví dụ không có provider nên không giả số token hay chi phí.

  Deadline được kiểm tra trước gọi tool và sau khi trả về; kết quả đến muộn không được báo evidence_found. Đây là timeout hợp tác, không ngắt được một hàm Python bị treo. Dịch vụ thật cần connect/read timeout, cancellation, deadline propagation và giới hạn ở worker/transport. Không giữ một HTTP request mở trong lúc chờ người duyệt: lưu trạng thái waiting_review rồi resume có kiểm tra lại quyền, expiry và ngân sách.

  Bài tập không yêu cầu agent thắng workflow. Giữ cùng nhiệm vụ và scorer, báo từng failure case thay vì chỉ điểm trung bình. Nội dung tool trả về là dữ liệu; nó không được tăng max_steps, tạo tool mới hay gọi kênh cấp quyền.

  Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.
concept_notes_en: |-
  An agent loop observes, acts and checks results. Step, time, cost and repeated-error limits must be enforced outside the model's decisions.

  Success conditions describe the desired outcome; stop limits bound resource use before success. Record them separately so exhaustion is not reported as completion.

  Repeated authorization failures should stop a lookup agent with a clear obstacle, not endless reformulations. Self-check: is asking the model to remember its step limit sufficient? No: the controller must count, enforce limits and preserve state. On limit-based stopping, report verified progress and remaining work.

  Existing Lab B already compares a fixed workflow with a scripted adaptive controller on identical tasks, with call budget, timeout and checkpoint support. Do not invent another fake agent and call it an LLM agent. The compact example isolates controller behavior: plan is a predefined list and tool is a read-only Python function; no model makes decisions.

  Every attempt consumes budget, including malformed schema, denied tools and timeouts. Success here means only evidence_found: later stages must verify relevance, access, groundedness and citation. step_limit, deadline, error_limit, repeated_query and plan_exhausted are not task completion. Record stop_reason and step count so remaining work is visible.

  The example retries read-tool timeouts up to two consecutive errors and stops immediately on authorization failure. A successful empty query enters seen to detect repetition. A timed-out query may retry because no result was received, but still consumes a step. Real providers also need token/cost budgets and backoff; this provider-free example invents no token or cost measurements.

  The deadline is checked before invocation and after return; a late result is not evidence_found. This is cooperative timeout, not preemption of a hung Python function. Real services require connect/read timeouts, cancellation, deadline propagation and worker/transport limits. Do not keep an HTTP request open while waiting for review: persist waiting_review and resume with permission, expiry and budget checks.

  The exercise does not require an agent to beat a workflow. Keep tasks and scoring identical and report individual failures instead of only an average. Tool output is data: it cannot raise max_steps, create tools or invoke the approval channel.

  Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.
why_it_matters_vi: Agent cần trạng thái, giới hạn và dấu vết rõ để hành động có thể kiểm tra.
why_it_matters_en: An agent is a control loop with state and side effects; reliability comes from limits and
  observability.
study_steps_vi:
- Đọc giải thích, dự đoán output rồi chạy mỗi ví dụ trong một ô Colab riêng; chỉ dùng Python 3.11+ standard
  library.
- Chạy ba kịch bản có sẵn; thêm timeout liên tiếp, lỗi quyền và kết quả đến sau deadline bằng đồng hồ giả.
  Ghi stop_reason, steps, số lần tool thực sự chạy.
- Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
- Hai timeout liên tiếp dừng error_limit; PermissionError dừng ngay bước 1.
- Kết quả muộn bị đánh dấu late_result/deadline; trace không lưu câu truy vấn hoặc thông báo lỗi thô.
study_steps_en:
- Read the explanation, predict output and run each example in a separate Colab cell; only Python 3.11+ standard
  library is needed.
- Run the three supplied scenarios; add consecutive timeouts, permission failure and a late result using a
  fake clock. Record stop_reason, steps and actual tool calls.
- An eight-step empty-result plan stops at five calls with step_limit, never success.
- Two consecutive timeouts stop at error_limit; PermissionError stops at step 1.
- A late result is marked late_result/deadline; traces contain no raw query or exception message.
practice_plan:
  vi:
    task: Chạy ba kịch bản có sẵn; thêm timeout liên tiếp, lỗi quyền và kết quả đến sau deadline bằng đồng
      hồ giả. Ghi stop_reason, steps, số lần tool thực sự chạy.
    deliverables:
    - Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
    - Hai timeout liên tiếp dừng error_limit; PermissionError dừng ngay bước 1.
    - Kết quả muộn bị đánh dấu late_result/deadline; trace không lưu câu truy vấn hoặc thông báo lỗi thô.
    checkpoint: Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
    stretch: Đề xuất thiết kế lưu bền và test crash/concurrency; không khẳng định đã kiểm tra nếu chỉ chạy
      simulator.
  en:
    task: Run the three supplied scenarios; add consecutive timeouts, permission failure and a late result
      using a fake clock. Record stop_reason, steps and actual tool calls.
    deliverables:
    - An eight-step empty-result plan stops at five calls with step_limit, never success.
    - Two consecutive timeouts stop at error_limit; PermissionError stops at step 1.
    - A late result is marked late_result/deadline; traces contain no raw query or exception message.
    checkpoint: An eight-step empty-result plan stops at five calls with step_limit, never success.
    stretch: Propose durable storage and crash/concurrency tests; do not claim they passed from simulator-only
      results.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Vòng lặp agent và điều kiện dừng” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain agent loops and stop conditions to a new teammate?
  - Which assumption behind agent loops and stop conditions could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Scripted policy simulator: bounded_loop.py'
  code: |
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
  status: runnable
  setup: Python 3.11+ standard library only. Paste the complete example into one Google Colab cell; no API
    key, model or installation.
  purpose_vi: Dừng vòng lặp theo số lần thử, deadline, lỗi liên tiếp và truy vấn lặp; phân biệt tìm thấy bằng
    chứng với hoàn thành nhiệm vụ.
  purpose_en: Stop by attempt budget, deadline, consecutive errors and repeated queries; distinguish evidence
    discovery from task completion.
  expected_output: |-
    step_limit 5
    repeated_query 2
    evidence_found 1
  edge_case_vi: Chạy ba kịch bản có sẵn; thêm timeout liên tiếp, lỗi quyền và kết quả đến sau deadline bằng
    đồng hồ giả. Ghi stop_reason, steps, số lần tool thực sự chạy.
  edge_case_en: Run the three supplied scenarios; add consecutive timeouts, permission failure and a late result
    using a fake clock. Record stop_reason, steps and actual tool calls.
  explanation_vi: Dữ liệu và quyết định đều mô phỏng; chỉ thay đổi dict trong RAM. Không gọi model/MCP/API
    thật, không thực thi lệnh lấy từ tài liệu. Các kiểm thử xác nhận hành vi fixture, không chứng nhận an toàn
    production.
  explanation_en: Data and decisions are scripted; only in-memory dictionaries change. No real model/MCP/API
    is called and document instructions are never executed. Tests establish fixture behavior, not production
    security.
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
  title: 'LangGraph: Thinking in LangGraph'
  url: https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph
  kind: official
  required: false
  purpose_vi: Ví dụ chính thức về chia luồng thành node, thiết kế state và phân loại lỗi trong workflow đồ
    thị.
  purpose_en: Official examples of decomposing flows into nodes, designing state, and handling errors in graph
    workflows.
  read_vi: Đọc graph design, state design và error handling; ghi chú ví dụ là JavaScript/TypeScript, không
    phải Python.
  read_en: Read graph design, state design, and error handling; note that the examples use JavaScript/TypeScript,
    not Python.
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
- phase-15-genai-agents-ai-agents-3-recall
- phase-15-genai-agents-ai-agents-3-application
- phase-15-genai-agents-ai-agents-3-debug
- phase-15-genai-agents-ai-agents-3-interview
estimated_minutes: 60
completion_checklist:
- Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
- Hai timeout liên tiếp dừng error_limit; PermissionError dừng ngay bước 1.
- Kết quả muộn bị đánh dấu late_result/deadline; trace không lưu câu truy vấn hoặc thông báo lỗi thô.
completion_criteria:
- Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo thành công.
- Hai timeout liên tiếp dừng error_limit; PermissionError dừng ngay bước 1.
- Kết quả muộn bị đánh dấu late_result/deadline; trace không lưu câu truy vấn hoặc thông báo lỗi thô.
common_mistakes:
- Coi schema hợp lệ, lời model đề xuất hoặc mô tả tool là quyền thực thi.
- Gọi hết ngân sách là thành công hoặc timeout là bằng chứng chưa ghi.
- Đổi payload sau khi duyệt, tin quyền cũ khi resume hoặc coi checkpoint là exactly-once.
- Suy an toàn MCP/OAuth/model thật từ một simulator theo kịch bản.
next_lessons:
- phase-15-genai-agents-ai-agents-4
- phase-16-genai-mcp-mcp-1
review_question_vi: Nội dung cốt lõi của “Vòng lặp agent và điều kiện dừng” là gì?
review_question_en: Define agent loops and stop conditions in your own words. What are the input, transformation
  and output?
review_answer_vi: Dừng vòng lặp theo số lần thử, deadline, lỗi liên tiếp và truy vấn lặp; phân biệt tìm thấy
  bằng chứng với hoàn thành nhiệm vụ. Plan 8 bước không tìm được nguồn dừng step_limit ở 5 lần gọi; không báo
  thành công.
review_answer_en: Stop by attempt budget, deadline, consecutive errors and repeated queries; distinguish evidence
  discovery from task completion. Two consecutive timeouts stop at error_limit; PermissionError stops at step
  1.
review_cards:
- id: phase-15-genai-agents-ai-agents-3-recall
  type: recall
  question_vi: Agent cần những giới hạn dừng độc lập nào?
  question_en: Which independent stop budgets does an agent need?
  answer_vi: Giới hạn số lần thử, deadline tổng, lỗi liên tiếp và truy vấn lặp. Mỗi lần gọi kể cả lỗi đều tiêu
    ngân sách; finding evidence, hoàn thành tác vụ và hết ngân sách là các trạng thái khác nhau.
  answer_en: Bound attempts, total deadline, consecutive failures and repeated queries. Failed calls also consume
    budget. Finding evidence, completing a task and exhausting budget are different outcomes.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-3-application
  type: application
  question_vi: 'Plan có 8 query khác nhau, tool luôn trả rỗng, max_steps=5: kết quả?'
  question_en: 'Eight distinct queries, always-empty results, max_steps=5: what happens?'
  answer_vi: Chỉ gọi tool 5 lần rồi dừng step_limit, không báo success. Ghi trace để chứng minh không có lần
    gọi thứ 6; đổi cùng một query lặp lại có thể kích hoạt giới hạn lặp sớm hơn.
  answer_en: Call at most five times and return step_limit, never success. Verify no sixth call in the trace.
    Repeating the same query can trigger a repetition limit earlier.
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-3-debug
  type: debug
  question_vi: Tool trả nguồn sau deadline có được đánh thành công không?
  question_en: May evidence arriving after the deadline count as success?
  answer_vi: Không. Kiểm tra clock cả trước và sau call; kết quả muộn ghi late_result rồi dừng deadline. Simulator
    phát hiện sau khi hàm trả về, không hủy được I/O đang treo; client thật cần timeout/cancellation riêng.
  answer_en: No. Check the clock before and after the call, record late_result and stop at deadline. This simulator
    detects lateness after return; it cannot cancel blocked I/O, so real clients need timeouts/cancellation.
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-3-interview
  type: interview
  question_vi: Vì sao retry timeout nhưng không retry PermissionError?
  question_en: Why retry a timeout but stop on PermissionError?
  answer_vi: 'Timeout có thể tạm thời nhưng chỉ retry khi còn ngân sách và tác vụ an toàn. PermissionError
    là quyết định quyền: thử lại cùng quyền không sửa được và có thể tạo hành vi lạm dụng. Lab dừng permission_denied
    ngay lần đầu.'
  answer_en: Timeouts may be transient, but retry requires budget and a safe operation. PermissionError is
    an authorization decision; retrying unchanged authority cannot fix it. The lab stops at permission_denied
    on the first attempt.
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Vòng lặp agent và điều kiện dừng / Agent loops and stop conditions

Vòng lặp nhận quan sát, chọn hành động rồi kiểm tra kết quả. Giới hạn số bước, thời gian, chi phí và lỗi liên tiếp cần được thực thi bên ngoài quyết định của mô hình.

Điều kiện thành công mô tả kết quả cần đạt; giới hạn dừng bảo vệ thời gian và tài nguyên khi chưa đạt kết quả. Hai điều này phải được ghi riêng để không báo 'hoàn tất' chỉ vì hết lượt chạy.

Ví dụ, agent tra cứu gặp cùng lỗi quyền nhiều lần cần dừng và nêu trở ngại, thay vì đổi cách diễn đạt lời gọi vô hạn. Tự kiểm tra: để mô hình tự nhớ giới hạn số bước đã đủ chưa? Chưa; bộ điều khiển phải đếm, thực thi hạn mức và lưu trạng thái. Khi dừng do giới hạn, báo phần đã xác minh cùng việc còn thiếu.

Lab B trong repo đã so sánh workflow cố định với bộ điều khiển thích nghi theo kịch bản trên cùng nhiệm vụ; đã có call budget, timeout và checkpoint. Không tạo thêm một agent giả rồi gọi là LLM agent. Ví dụ rút gọn dưới đây giúp quan sát trực tiếp phần bộ điều khiển: plan là danh sách lập sẵn, tool là hàm Python chỉ đọc; không có suy luận từ model.

Mỗi lần thử đều tiêu ngân sách, kể cả schema sai, tool bị chặn hay timeout. Thành công ở đây chỉ là evidence_found: cần kiểm tra tài liệu thực sự trả lời câu hỏi, quyền truy cập, groundedness và citation ở bước sau. step_limit, deadline, error_limit, repeated_query và plan_exhausted đều không phải hoàn thành. Lưu stop_reason cùng số bước để người dùng biết điều còn thiếu.

Ví dụ cho retry timeout của công cụ đọc với tối đa hai lỗi liên tiếp; lỗi quyền dừng ngay. Query đã chạy thành công nhưng không có bằng chứng được ghi vào seen để phát hiện lặp. Query timeout chưa có kết quả có thể thử lại nhưng vẫn tốn một bước. Thực tế còn cần token/cost budget và backoff nếu gọi provider; ví dụ không có provider nên không giả số token hay chi phí.

Deadline được kiểm tra trước gọi tool và sau khi trả về; kết quả đến muộn không được báo evidence_found. Đây là timeout hợp tác, không ngắt được một hàm Python bị treo. Dịch vụ thật cần connect/read timeout, cancellation, deadline propagation và giới hạn ở worker/transport. Không giữ một HTTP request mở trong lúc chờ người duyệt: lưu trạng thái waiting_review rồi resume có kiểm tra lại quyền, expiry và ngân sách.

Bài tập không yêu cầu agent thắng workflow. Giữ cùng nhiệm vụ và scorer, báo từng failure case thay vì chỉ điểm trung bình. Nội dung tool trả về là dữ liệu; nó không được tăng max_steps, tạo tool mới hay gọi kênh cấp quyền.

Nguồn gợi ý chủ đề: T15 M+H (8/8 ảnh), T24 M+H (7/7 ảnh); T21 chỉ M+H khung hình từng phần, chưa xác định repo. Không có transcript đầy đủ hoặc xác nhận xem hết video. Đây không phải bằng chứng về hiệu quả hay mức an toàn của mã; khẳng định kỹ thuật dựa trên nguồn chính thức và kiểm thử mô phỏng bên dưới.

## English

An agent loop observes, acts and checks results. Step, time, cost and repeated-error limits must be enforced outside the model's decisions.

Success conditions describe the desired outcome; stop limits bound resource use before success. Record them separately so exhaustion is not reported as completion.

Repeated authorization failures should stop a lookup agent with a clear obstacle, not endless reformulations. Self-check: is asking the model to remember its step limit sufficient? No: the controller must count, enforce limits and preserve state. On limit-based stopping, report verified progress and remaining work.

Existing Lab B already compares a fixed workflow with a scripted adaptive controller on identical tasks, with call budget, timeout and checkpoint support. Do not invent another fake agent and call it an LLM agent. The compact example isolates controller behavior: plan is a predefined list and tool is a read-only Python function; no model makes decisions.

Every attempt consumes budget, including malformed schema, denied tools and timeouts. Success here means only evidence_found: later stages must verify relevance, access, groundedness and citation. step_limit, deadline, error_limit, repeated_query and plan_exhausted are not task completion. Record stop_reason and step count so remaining work is visible.

The example retries read-tool timeouts up to two consecutive errors and stops immediately on authorization failure. A successful empty query enters seen to detect repetition. A timed-out query may retry because no result was received, but still consumes a step. Real providers also need token/cost budgets and backoff; this provider-free example invents no token or cost measurements.

The deadline is checked before invocation and after return; a late result is not evidence_found. This is cooperative timeout, not preemption of a hung Python function. Real services require connect/read timeouts, cancellation, deadline propagation and worker/transport limits. Do not keep an HTTP request open while waiting for review: persist waiting_review and resume with permission, expiry and budget checks.

The exercise does not require an agent to beat a workflow. Keep tasks and scoring identical and report individual failures instead of only an average. Tool output is data: it cannot raise max_steps, create tools or invoke the approval channel.

Topic-discovery evidence: T15 M+H (8/8 images), T24 M+H (7/7 images); T21 has only metadata and partial frames, with its repository still unknown. No full transcript or full-video verification is available. This does not establish code effectiveness or security; technical claims use official sources and the scripted tests below.

## Thực hành / Practice

Chạy ba kịch bản có sẵn; thêm timeout liên tiếp, lỗi quyền và kết quả đến sau deadline bằng đồng hồ giả. Ghi stop_reason, steps, số lần tool thực sự chạy.

Run the three supplied scenarios; add consecutive timeouts, permission failure and a late result using a fake clock. Record stop_reason, steps and actual tool calls.
