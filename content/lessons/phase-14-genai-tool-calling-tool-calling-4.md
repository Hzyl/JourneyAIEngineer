---
lesson_id: phase-14-genai-tool-calling-tool-calling-4
phase_id: phase-14-genai-tool-calling
module_id: tool-calling
title_vi: Error handling và secure tool execution
title_en: Error handling and secure tool execution
summary_vi: Học Error handling và secure tool execution qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng
  bài tập có edge case.
summary_en: Learn Error handling and secure tool execution through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Giải thích error handling và secure tool execution bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng error handling và secure tool execution.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain error handling and secure tool execution with a concrete example.
- Write or adapt a small code example applying error handling and secure tool execution.
- Recognize its assumptions, limits and one common failure mode.
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
concept_notes_vi: Error handling và secure tool execution mở rộng model bằng hành động có kiểm soát. Tool schema phải validate
  input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có
  side effect.
concept_notes_en: Error handling và secure tool execution extends a model with controlled actions. Tool schemas must validate
  inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval
  for side effects.
why_it_matters_vi: Tool calling biến output model thành hành động nên cần contract chặt hơn chat thông thường.
why_it_matters_en: Tool calling turns model output into actions, so its contracts must be stricter than ordinary chat.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Tool calling biến output model thành hành động nên cần contract chặt hơn chat thông
  thường.'
- Mở OpenAI Function Calling Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Xây tool đọc database giả lập với schema validation, timeout, retry có giới hạn và audit log không chứa
  secret.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Tool calling turns model output into actions, so its contracts must be stricter than
  ordinary chat.'
- Open OpenAI Function Calling Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build a mock database tool with schema validation, bounded retries, timeouts, and an audit
  log without secrets.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Xây tool đọc database giả lập với schema validation, timeout, retry có giới hạn và audit log không chứa secret.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Tool sai input không thể chạy side effect; retry không nhân đôi giao dịch và lỗi được trả về có thể sửa.
    stretch: Viết thêm một failure test cho error handling và secure tool execution và giải thích kết quả.
  en:
    task: Build a mock database tool with schema validation, bounded retries, timeouts, and an audit log without secrets.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Invalid tool input cannot cause side effects, retries do not duplicate transactions, and errors are actionable.
    stretch: Add a failure test for error handling and secure tool execution and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích error handling và secure tool execution cho một đồng đội mới như thế nào?
  - Một assumption nào của error handling và secure tool execution có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain error handling and secure tool execution to a new teammate?
  - Which assumption behind error handling and secure tool execution could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Error handling and secure tool execution: inspect one complete path'
  code: "# Topic: Error handling and secure tool execution (phase-14-genai-tool-calling-tool-calling-4)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer +\
    \ '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của error handling và secure tool execution.
  purpose_en: Illustrate the input-to-output path for error handling and secure tool execution.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenAI Function Calling Guide
  url: https://platform.openai.com/docs/guides/function-calling
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: JSON Schema
  url: https://json-schema.org/learn/getting-started-step-by-step
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Tenacity Documentation
  url: https://tenacity.readthedocs.io/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích tiếng Việt và checklist của lesson
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
exercise_ids:
- exercise-14-tool-calling
review_item_ids:
- phase-14-genai-tool-calling-tool-calling-4-recall
- phase-14-genai-tool-calling-tool-calling-4-application
- phase-14-genai-tool-calling-tool-calling-4-debug
- phase-14-genai-tool-calling-tool-calling-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của error handling và secure tool execution.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng error handling và secure tool execution và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng error handling và secure tool execution.
- Đánh giá error handling và secure tool execution bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ error handling và secure tool execution mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-15-genai-agents-ai-agents-1
- phase-15-genai-agents-ai-agents-2
review_question_vi: Định nghĩa error handling và secure tool execution bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define error handling and secure tool execution in your own words. What are the input, transformation
  and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng error handling và secure tool execution.
  Hãy liên hệ cụ thể với error handling và secure tool execution trong lesson phase-14-genai-tool-calling-tool-calling-4.
review_answer_en: A strong answer names the input, transformation, output and the context where error handling and secure
  tool execution is used. Relate it specifically to error handling and secure tool execution in lesson phase-14-genai-tool-calling-tool-calling-4.
review_cards:
- id: phase-14-genai-tool-calling-tool-calling-4-recall
  type: recall
  question_vi: Định nghĩa error handling và secure tool execution bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define error handling and secure tool execution in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng error handling và secure tool execution.
  answer_en: A strong answer names the input, transformation, output and the context where error handling and secure tool
    execution is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-14-genai-tool-calling-tool-calling-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng error handling và secure tool execution cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies error handling and secure tool execution to an AI engineering
    problem.
  answer_vi: Ví dụ cho error handling và secure tool execution cần có input rõ ràng, output mong đợi và một cách chạy hoặc
    kiểm chứng (phase-14-genai-tool-calling-tool-calling-4).
  answer_en: The error handling and secure tool execution example should have an explicit input, expected output and a way
    to run or verify it (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-14-genai-tool-calling-tool-calling-4-debug
  type: debug
  question_vi: Nếu kết quả của error handling và secure tool execution sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If error handling and secure tool execution produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: Với error handling và secure tool execution, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô
    lập lỗi bằng test nhỏ và error analysis (phase-14-genai-tool-calling-tool-calling-4).
  answer_en: For error handling and secure tool execution, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-14-genai-tool-calling-tool-calling-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của error handling và secure tool execution như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of error handling and secure tool execution?
  answer_vi: Câu trả lời về error handling và secure tool execution cần nêu giả định, metric/chi phí, giới hạn và cách giảm
    rủi ro trong production (phase-14-genai-tool-calling-tool-calling-4).
  answer_en: The answer about error handling and secure tool execution should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Error handling và secure tool execution / Error handling and secure tool execution

Error handling và secure tool execution mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.

## Practice

Xây tool đọc database giả lập với schema validation, timeout, retry có giới hạn và audit log không chứa secret.
