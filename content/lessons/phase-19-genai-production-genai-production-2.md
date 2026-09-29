---
lesson_id: phase-19-genai-production-genai-production-2
phase_id: phase-19-genai-production
module_id: genai-production
title_vi: Retry, fallback và rate limit
title_en: Retries, fallbacks, and rate limits
summary_vi: Học Retry, fallback và rate limit qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Retries, fallbacks, and rate limits through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích retry, fallback và rate limit bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng retry, fallback và rate limit.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain retries, fallbacks, and rate limits with a concrete example.
- Write or adapt a small code example applying retries, fallbacks, and rate limits.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-19-genai-production-genai-production-1
- phase-18-genai-observability-genai-observability-1
key_terms:
- retry
- fallback
- rate
- limit
- inference
- observability
- reproducibility
- deployment
- genai-production
concept_notes_vi: 'Retry, fallback và rate limit thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model.
  Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và
  trả lỗi có thể xử lý.'
concept_notes_en: 'Retry, fallback và rate limit belongs to LLM Application Engineering: design the contract between the application
  and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output as untrusted
  data and return actionable errors.'
why_it_matters_vi: Production quality là behavior khi provider chậm, lỗi, đắt hoặc traffic tăng chứ không chỉ happy path.
why_it_matters_en: Production quality is behavior when providers are slow, failing, expensive, or traffic grows—not just the
  happy path.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Production quality là behavior khi provider chậm, lỗi, đắt hoặc traffic tăng chứ không
  chỉ happy path.'
- Mở Redis Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Thiết kế service có cache policy, provider fallback, queue worker và load test đơn giản với SLO rõ ràng.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Production quality is behavior when providers are slow, failing, expensive, or traffic
  grows—not just the happy path.'
- Open Redis Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Design a service with a cache policy, provider fallback, queue worker, and a small load test
  with explicit SLOs.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Thiết kế service có cache policy, provider fallback, queue worker và load test đơn giản với SLO rõ ràng.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn giải thích được trade-off consistency, latency, cost và availability bằng số liệu đo được.
    stretch: Viết thêm một failure test cho retry, fallback và rate limit và giải thích kết quả.
  en:
    task: Design a service with a cache policy, provider fallback, queue worker, and a small load test with explicit SLOs.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can explain consistency, latency, cost, and availability trade-offs with measured evidence.
    stretch: Add a failure test for retries, fallbacks, and rate limits and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích retry, fallback và rate limit cho một đồng đội mới như thế nào?
  - Một assumption nào của retry, fallback và rate limit có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain retries, fallbacks, and rate limits to a new teammate?
  - Which assumption behind retries, fallbacks, and rate limits could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Retries, fallbacks, and rate limits: inspect one complete path'
  code: "# Topic: Retries, fallbacks, and rate limits (phase-19-genai-production-genai-production-2)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của retry, fallback và rate limit.
  purpose_en: Illustrate the input-to-output path for retries, fallbacks, and rate limits.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Redis Documentation
  url: https://redis.io/docs/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Celery Documentation
  url: https://docs.celeryq.dev/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Kubernetes Basics
  url: https://kubernetes.io/docs/tutorials/kubernetes-basics/
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
- exercise-19-genai-production
review_item_ids:
- phase-19-genai-production-genai-production-2-recall
- phase-19-genai-production-genai-production-2-application
- phase-19-genai-production-genai-production-2-debug
- phase-19-genai-production-genai-production-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của retry, fallback và rate limit.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng retry, fallback và rate limit và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng retry, fallback và rate limit.
- Đánh giá retry, fallback và rate limit bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ retry, fallback và rate limit mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-19-genai-production-genai-production-3
- phase-19-genai-production-genai-production-4
review_question_vi: Định nghĩa retry, fallback và rate limit bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define retries, fallbacks, and rate limits in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng retry, fallback và rate limit.
  Hãy liên hệ cụ thể với retry, fallback và rate limit trong lesson phase-19-genai-production-genai-production-2.
review_answer_en: A strong answer names the input, transformation, output and the context where retries, fallbacks, and rate
  limits is used. Relate it specifically to retries, fallbacks, and rate limits in lesson phase-19-genai-production-genai-production-2.
review_cards:
- id: phase-19-genai-production-genai-production-2-recall
  type: recall
  question_vi: Định nghĩa retry, fallback và rate limit bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define retries, fallbacks, and rate limits in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng retry, fallback và rate limit.
  answer_en: A strong answer names the input, transformation, output and the context where retries, fallbacks, and rate limits
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-19-genai-production-genai-production-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng retry, fallback và rate limit cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies retries, fallbacks, and rate limits to an AI engineering
    problem.
  answer_vi: Ví dụ cho retry, fallback và rate limit cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-19-genai-production-genai-production-2).
  answer_en: The retries, fallbacks, and rate limits example should have an explicit input, expected output and a way to run
    or verify it (phase-19-genai-production-genai-production-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-19-genai-production-genai-production-2-debug
  type: debug
  question_vi: Nếu kết quả của retry, fallback và rate limit sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If retries, fallbacks, and rate limits produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với retry, fallback và rate limit, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-19-genai-production-genai-production-2).
  answer_en: For retries, fallbacks, and rate limits, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-19-genai-production-genai-production-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-19-genai-production-genai-production-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của retry, fallback và rate limit như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of retries, fallbacks, and rate limits?
  answer_vi: Câu trả lời về retry, fallback và rate limit cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-19-genai-production-genai-production-2).
  answer_en: The answer about retries, fallbacks, and rate limits should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-19-genai-production-genai-production-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Retry, fallback và rate limit / Retries, fallbacks, and rate limits

Retry, fallback và rate limit thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.

## Practice

Thiết kế service có cache policy, provider fallback, queue worker và load test đơn giản với SLO rõ ràng.
