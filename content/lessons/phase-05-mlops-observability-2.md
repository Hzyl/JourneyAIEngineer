---
lesson_id: phase-05-mlops-observability-2
phase_id: phase-05-mlops
module_id: observability
title_vi: Latency p50/p95
title_en: p50/p95 latency
summary_vi: Học Latency p50/p95 qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn p50/p95 latency through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích latency p50/p95 bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng latency p50/p95.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain p50/p95 latency with a concrete example.
- Write or adapt a small code example applying p50/p95 latency.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-observability-1
- phase-04-deep-learning-pytorch-core-1
key_terms:
- latency
- p50
- p95
- inference
- observability
- reproducibility
- deployment
concept_notes_vi: Latency p50/p95 biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước,
  ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay
  vì chỉ nhìn một điểm số.
concept_notes_en: Latency p50/p95 turns an AI demo into a system that can be trusted. Define metrics and an evaluation set
  first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation, data, or infrastructure
  instead of relying on one score.
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
    stretch: Viết thêm một failure test cho latency p50/p95 và giải thích kết quả.
  en:
    task: Add structured logs, measure p50/p95, create a drift report, and write a rollback runbook.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish data drift, concept drift, and latency regression with measurements.
    stretch: Add a failure test for p50/p95 latency and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích latency p50/p95 cho một đồng đội mới như thế nào?
  - Một assumption nào của latency p50/p95 có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain p50/p95 latency to a new teammate?
  - Which assumption behind p50/p95 latency could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- p95 = percentile(latencies, 95)
- throughput = completed_requests / elapsed_seconds
code_examples:
- language: python
  title: 'p50/p95 latency: inspect one complete path'
  code: "# Topic: p50/p95 latency (phase-05-mlops-observability-2)\nimport time\n\ndef timed_response(value: float) -> dict[str,\
    \ float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms': (time.perf_counter()\
    \ - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của latency p50/p95.
  purpose_en: Illustrate the input-to-output path for p50/p95 latency.
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
- phase-05-mlops-observability-2-recall
- phase-05-mlops-observability-2-application
- phase-05-mlops-observability-2-debug
- phase-05-mlops-observability-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của latency p50/p95.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng latency p50/p95 và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng latency p50/p95.
- Đánh giá latency p50/p95 bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ latency p50/p95 mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-05-mlops-observability-3
- phase-05-mlops-observability-4
review_question_vi: Định nghĩa latency p50/p95 bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define p50/p95 latency in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng latency p50/p95. Hãy liên hệ cụ
  thể với latency p50/p95 trong lesson phase-05-mlops-observability-2.
review_answer_en: A strong answer names the input, transformation, output and the context where p50/p95 latency is used. Relate
  it specifically to p50/p95 latency in lesson phase-05-mlops-observability-2.
review_cards:
- id: phase-05-mlops-observability-2-recall
  type: recall
  question_vi: Định nghĩa latency p50/p95 bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define p50/p95 latency in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng latency p50/p95.
  answer_en: A strong answer names the input, transformation, output and the context where p50/p95 latency is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-observability-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng latency p50/p95 cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies p50/p95 latency to an AI engineering problem.
  answer_vi: Ví dụ cho latency p50/p95 cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-05-mlops-observability-2).
  answer_en: The p50/p95 latency example should have an explicit input, expected output and a way to run or verify it (phase-05-mlops-observability-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-observability-2-debug
  type: debug
  question_vi: Nếu kết quả của latency p50/p95 sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If p50/p95 latency produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với latency p50/p95, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và
    error analysis (phase-05-mlops-observability-2).
  answer_en: For p50/p95 latency, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-05-mlops-observability-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-observability-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của latency p50/p95 như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of p50/p95 latency?
  answer_vi: Câu trả lời về latency p50/p95 cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-05-mlops-observability-2).
  answer_en: The answer about p50/p95 latency should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-05-mlops-observability-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Latency p50/p95 / p50/p95 latency

Latency p50/p95 biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.

## Practice

Thêm structured log, đo p50/p95, tạo một drift report và viết runbook rollback.
