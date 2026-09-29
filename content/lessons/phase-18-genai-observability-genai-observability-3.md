---
lesson_id: phase-18-genai-observability-genai-observability-3
phase_id: phase-18-genai-observability
module_id: genai-observability
title_vi: Cost monitoring và budget
title_en: Cost monitoring and budgets
summary_vi: Học Cost monitoring và budget qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Cost monitoring and budgets through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích cost monitoring và budget bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng cost monitoring và budget.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain cost monitoring and budgets with a concrete example.
- Write or adapt a small code example applying cost monitoring and budgets.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-18-genai-observability-genai-observability-2
- phase-17-genai-evaluation-genai-evaluation-1
key_terms:
- cost
- monitoring
- budget
- inference
- observability
- reproducibility
- deployment
- genai-observability
concept_notes_vi: Cost monitoring và budget biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm
  thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure
  thay vì chỉ nhìn một điểm số.
concept_notes_en: Cost monitoring và budget turns an AI demo into a system that can be trusted. Define metrics and an evaluation
  set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation, data, or infrastructure
  instead of relying on one score.
why_it_matters_vi: Không có telemetry thì không biết lỗi nằm ở model, retrieval, provider hay hạ tầng.
why_it_matters_en: Without telemetry you cannot tell whether a failure is in the model, retrieval, provider, or infrastructure.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Không có telemetry thì không biết lỗi nằm ở model, retrieval, provider hay hạ tầng.'
- Mở OpenTelemetry Python, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Instrument một request end-to-end với trace id, token/cost fields, p50/p95 latency và alert budget.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Without telemetry you cannot tell whether a failure is in the model, retrieval, provider,
  or infrastructure.'
- Open OpenTelemetry Python, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Instrument an end-to-end request with a trace ID, token/cost fields, p50/p95 latency, and a
  budget alert.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Instrument một request end-to-end với trace id, token/cost fields, p50/p95 latency và alert budget.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Từ một trace bạn tìm được nguyên nhân của latency/cost spike mà không log prompt nhạy cảm.
    stretch: Viết thêm một failure test cho cost monitoring và budget và giải thích kết quả.
  en:
    task: Instrument an end-to-end request with a trace ID, token/cost fields, p50/p95 latency, and a budget alert.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From one trace you can identify a latency or cost spike without logging sensitive prompts.
    stretch: Add a failure test for cost monitoring and budgets and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích cost monitoring và budget cho một đồng đội mới như thế nào?
  - Một assumption nào của cost monitoring và budget có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain cost monitoring and budgets to a new teammate?
  - Which assumption behind cost monitoring and budgets could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- p95 = percentile(latencies, 95)
- throughput = completed_requests / elapsed_seconds
code_examples:
- language: python
  title: 'Cost monitoring and budgets: inspect one complete path'
  code: "# Topic: Cost monitoring and budgets (phase-18-genai-observability-genai-observability-3)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của cost monitoring và budget.
  purpose_en: Illustrate the input-to-output path for cost monitoring and budgets.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenTelemetry Python
  url: https://opentelemetry.io/docs/languages/python/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Prometheus Overview
  url: https://prometheus.io/docs/introduction/overview/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Langfuse Documentation
  url: https://langfuse.com/docs
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
- exercise-18-genai-observability
review_item_ids:
- phase-18-genai-observability-genai-observability-3-recall
- phase-18-genai-observability-genai-observability-3-application
- phase-18-genai-observability-genai-observability-3-debug
- phase-18-genai-observability-genai-observability-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của cost monitoring và budget.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng cost monitoring và budget và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng cost monitoring và budget.
- Đánh giá cost monitoring và budget bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ cost monitoring và budget mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-18-genai-observability-genai-observability-4
- phase-19-genai-production-genai-production-1
review_question_vi: Định nghĩa cost monitoring và budget bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define cost monitoring and budgets in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng cost monitoring và budget. Hãy
  liên hệ cụ thể với cost monitoring và budget trong lesson phase-18-genai-observability-genai-observability-3.
review_answer_en: A strong answer names the input, transformation, output and the context where cost monitoring and budgets
  is used. Relate it specifically to cost monitoring and budgets in lesson phase-18-genai-observability-genai-observability-3.
review_cards:
- id: phase-18-genai-observability-genai-observability-3-recall
  type: recall
  question_vi: Định nghĩa cost monitoring và budget bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define cost monitoring and budgets in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng cost monitoring và budget.
  answer_en: A strong answer names the input, transformation, output and the context where cost monitoring and budgets is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-18-genai-observability-genai-observability-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng cost monitoring và budget cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies cost monitoring and budgets to an AI engineering problem.
  answer_vi: Ví dụ cho cost monitoring và budget cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-18-genai-observability-genai-observability-3).
  answer_en: The cost monitoring and budgets example should have an explicit input, expected output and a way to run or verify
    it (phase-18-genai-observability-genai-observability-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-18-genai-observability-genai-observability-3-debug
  type: debug
  question_vi: Nếu kết quả của cost monitoring và budget sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If cost monitoring and budgets produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với cost monitoring và budget, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-18-genai-observability-genai-observability-3).
  answer_en: For cost monitoring and budgets, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-18-genai-observability-genai-observability-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-18-genai-observability-genai-observability-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của cost monitoring và budget như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of cost monitoring and budgets?
  answer_vi: Câu trả lời về cost monitoring và budget cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-18-genai-observability-genai-observability-3).
  answer_en: The answer about cost monitoring and budgets should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-18-genai-observability-genai-observability-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Cost monitoring và budget / Cost monitoring and budgets

Cost monitoring và budget biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.

## Practice

Instrument một request end-to-end với trace id, token/cost fields, p50/p95 latency và alert budget.
