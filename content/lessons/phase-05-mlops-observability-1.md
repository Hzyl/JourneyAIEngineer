---
lesson_id: phase-05-mlops-observability-1
phase_id: phase-05-mlops
module_id: observability
title_vi: Structured logging
title_en: Structured logging
summary_vi: Học Structured logging qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Structured logging through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích structured logging bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng structured logging.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain structured logging with a concrete example.
- Write or adapt a small code example applying structured logging.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-tracking-4
- phase-04-deep-learning-pytorch-core-1
key_terms:
- structured
- logging
- inference
- observability
- reproducibility
- deployment
concept_notes_vi: Structured logging là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm
  tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python,
  giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: Structured logging is a Software Engineering skill for turning an idea into code that can be read, tested,
  and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python, small boundaries
  make tests fast and tracebacks actionable.
why_it_matters_vi: Đo latency, drift và lỗi production để biết service đang hỏng ở đâu trước khi người dùng báo.
why_it_matters_en: Measure latency, drift, and production errors so you find failures before users report them.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đo latency, drift và lỗi production để biết service đang hỏng ở đâu trước khi người
  dùng báo.'
- Mở FastAPI Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Thêm structured log, đo p50/p95, tạo một drift report và viết runbook rollback.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Measure latency, drift, and production errors so you find failures before users report
  them.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Add structured logs, measure p50/p95, create a drift report, and write a rollback runbook.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Thêm structured log, đo p50/p95, tạo một drift report và viết runbook rollback.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn phân biệt data drift, concept drift và latency regression bằng số liệu.
    stretch: Viết thêm một failure test cho structured logging và giải thích kết quả.
  en:
    task: Add structured logs, measure p50/p95, create a drift report, and write a rollback runbook.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish data drift, concept drift, and latency regression with measurements.
    stretch: Add a failure test for structured logging and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích structured logging cho một đồng đội mới như thế nào?
  - Một assumption nào của structured logging có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain structured logging to a new teammate?
  - Which assumption behind structured logging could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured logging: inspect one complete path'
  code: "# Topic: Structured logging (phase-05-mlops-observability-1)\nimport time\n\ndef timed_response(value: float) ->\
    \ dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms':\
    \ (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của structured logging.
  purpose_en: Illustrate the input-to-output path for structured logging.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Đo boundary nhỏ bằng input hợp lệ, output có schema và một chỉ số vận hành quan sát được.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: FastAPI Documentation
  url: https://fastapi.tiangolo.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Docker Get Started
  url: https://docs.docker.com/get-started/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MLflow Documentation
  url: https://mlflow.org/docs/latest/ml/tracking/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python logging
  url: https://docs.python.org/3/library/logging.html
  language: en
  purpose_vi: Ghi context có cấu trúc khi debug và chạy production.
  read_vi: Đọc levels, logger, handler; không log secret hoặc dữ liệu PII.
  purpose_en: Add structured context for debugging and production.
  read_en: Read levels, loggers, and handlers; never log secrets or PII.
  kind: official
  required: true
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
- exercise-5-observability
review_item_ids:
- phase-05-mlops-observability-1-recall
- phase-05-mlops-observability-1-application
- phase-05-mlops-observability-1-debug
- phase-05-mlops-observability-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của structured logging.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng structured logging và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng structured logging.
- Đánh giá structured logging bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ structured logging mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-05-mlops-observability-2
- phase-05-mlops-observability-3
review_question_vi: Định nghĩa structured logging bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define structured logging in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured logging. Hãy liên hệ
  cụ thể với structured logging trong lesson phase-05-mlops-observability-1.
review_answer_en: A strong answer names the input, transformation, output and the context where structured logging is used.
  Relate it specifically to structured logging in lesson phase-05-mlops-observability-1.
review_cards:
- id: phase-05-mlops-observability-1-recall
  type: recall
  question_vi: Định nghĩa structured logging bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define structured logging in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured logging.
  answer_en: A strong answer names the input, transformation, output and the context where structured logging is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-observability-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng structured logging cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies structured logging to an AI engineering problem.
  answer_vi: Ví dụ cho structured logging cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-05-mlops-observability-1).
  answer_en: The structured logging example should have an explicit input, expected output and a way to run or verify it (phase-05-mlops-observability-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-observability-1-debug
  type: debug
  question_vi: Nếu kết quả của structured logging sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If structured logging produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với structured logging, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-05-mlops-observability-1).
  answer_en: For structured logging, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-05-mlops-observability-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-observability-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của structured logging như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured logging?
  answer_vi: Câu trả lời về structured logging cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-05-mlops-observability-1).
  answer_en: The answer about structured logging should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-05-mlops-observability-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Structured logging / Structured logging

Structured logging là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Thêm structured log, đo p50/p95, tạo một drift report và viết runbook rollback.
