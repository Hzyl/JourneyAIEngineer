---
lesson_id: phase-14-genai-tool-calling-tool-calling-2
phase_id: phase-14-genai-tool-calling
module_id: tool-calling
title_vi: Tool validation và argument policy
title_en: Tool validation and argument policies
summary_vi: Học Tool validation và argument policy qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập
  có edge case.
summary_en: Learn Tool validation and argument policies through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích tool validation và argument policy bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng tool validation và argument policy.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain tool validation and argument policies with a concrete example.
- Write or adapt a small code example applying tool validation and argument policies.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-1
- phase-13-genai-advanced-rag-advanced-rag-1
key_terms:
- tool
- validation
- argument
- policy
- token
- embedding
- retrieval
- evaluation
- tool-calling
concept_notes_vi: Tool validation và argument policy mở rộng model bằng hành động có kiểm soát. Tool schema phải validate
  input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có
  side effect.
concept_notes_en: Tool validation và argument policy extends a model with controlled actions. Tool schemas must validate inputs,
  limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval
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
    stretch: Viết thêm một failure test cho tool validation và argument policy và giải thích kết quả.
  en:
    task: Build a mock database tool with schema validation, bounded retries, timeouts, and an audit log without secrets.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Invalid tool input cannot cause side effects, retries do not duplicate transactions, and errors are actionable.
    stretch: Add a failure test for tool validation and argument policies and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích tool validation và argument policy cho một đồng đội mới như thế nào?
  - Một assumption nào của tool validation và argument policy có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain tool validation and argument policies to a new teammate?
  - Which assumption behind tool validation and argument policies could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Tool validation and argument policies: inspect one complete path'
  code: "# Topic: Tool validation and argument policies (phase-14-genai-tool-calling-tool-calling-2)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer +\
    \ '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của tool validation và argument policy.
  purpose_en: Illustrate the input-to-output path for tool validation and argument policies.
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
- phase-14-genai-tool-calling-tool-calling-2-recall
- phase-14-genai-tool-calling-tool-calling-2-application
- phase-14-genai-tool-calling-tool-calling-2-debug
- phase-14-genai-tool-calling-tool-calling-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của tool validation và argument policy.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng tool validation và argument policy và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng tool validation và argument policy.
- Đánh giá tool validation và argument policy bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ tool validation và argument policy mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-14-genai-tool-calling-tool-calling-3
- phase-14-genai-tool-calling-tool-calling-4
review_question_vi: Định nghĩa tool validation và argument policy bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define tool validation and argument policies in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng tool validation và argument policy.
  Hãy liên hệ cụ thể với tool validation và argument policy trong lesson phase-14-genai-tool-calling-tool-calling-2.
review_answer_en: A strong answer names the input, transformation, output and the context where tool validation and argument
  policies is used. Relate it specifically to tool validation and argument policies in lesson phase-14-genai-tool-calling-tool-calling-2.
review_cards:
- id: phase-14-genai-tool-calling-tool-calling-2-recall
  type: recall
  question_vi: Định nghĩa tool validation và argument policy bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define tool validation and argument policies in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng tool validation và argument policy.
  answer_en: A strong answer names the input, transformation, output and the context where tool validation and argument policies
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-14-genai-tool-calling-tool-calling-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng tool validation và argument policy cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies tool validation and argument policies to an AI engineering
    problem.
  answer_vi: Ví dụ cho tool validation và argument policy cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-14-genai-tool-calling-tool-calling-2).
  answer_en: The tool validation and argument policies example should have an explicit input, expected output and a way to
    run or verify it (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-14-genai-tool-calling-tool-calling-2-debug
  type: debug
  question_vi: Nếu kết quả của tool validation và argument policy sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If tool validation and argument policies produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với tool validation và argument policy, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-14-genai-tool-calling-tool-calling-2).
  answer_en: For tool validation and argument policies, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-14-genai-tool-calling-tool-calling-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của tool validation và argument policy như thế
    nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of tool validation and argument policies?
  answer_vi: Câu trả lời về tool validation và argument policy cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-14-genai-tool-calling-tool-calling-2).
  answer_en: The answer about tool validation and argument policies should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-14-genai-tool-calling-tool-calling-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tool validation và argument policy / Tool validation and argument policies

Tool validation và argument policy mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.

## Practice

Xây tool đọc database giả lập với schema validation, timeout, retry có giới hạn và audit log không chứa secret.
