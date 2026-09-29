---
lesson_id: phase-08-genai-software-genai-software-foundations-3
phase_id: phase-08-genai-software
module_id: genai-software-foundations
title_vi: REST API, SQL và Docker cho AI
title_en: REST APIs, SQL and Docker for AI
summary_vi: Học REST API, SQL và Docker cho AI qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn REST APIs, SQL and Docker for AI through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích rest api, sql và docker cho ai bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng rest api, sql và docker cho ai.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain rest apis, sql and docker for ai with a concrete example.
- Write or adapt a small code example applying rest apis, sql and docker for ai.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-08-genai-software-genai-software-foundations-2
- phase-07-capstone-career-problem-1
key_terms:
- rest
- api
- sql
- docker
- cho
- inference
- observability
- reproducibility
- deployment
- genai-software-foundations
concept_notes_vi: REST API, SQL và Docker cho AI mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation,
  status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu
  rỗng hoặc sai kiểu.
concept_notes_en: REST API, SQL và Docker cho AI describes a boundary between data and a service. A sound request has a schema,
  validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and
  tests empty or malformed data.
why_it_matters_vi: Một AI Engineer phải kiểm soát boundary của service, dependency và release trước khi tối ưu model.
why_it_matters_en: An AI Engineer must control service boundaries, dependencies, and releases before optimizing a model.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Một AI Engineer phải kiểm soát boundary của service, dependency và release trước khi
  tối ưu model.'
- Mở FastAPI Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check
  và lệnh rollback.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: An AI Engineer must control service boundaries, dependencies, and releases before optimizing
  a model.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract,
  health check, and rollback command.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check và lệnh
      rollback.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Clone trên máy sạch, chạy test và container bằng một chuỗi lệnh; giải thích được lỗi thuộc code, môi trường
      hay deployment.
    stretch: Viết thêm một failure test cho rest api, sql và docker cho ai và giải thích kết quả.
  en:
    task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract, health check, and rollback
      command.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From a clean clone, run tests and the container with one command sequence and distinguish code, environment,
      and deployment failures.
    stretch: Add a failure test for rest apis, sql and docker for ai and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích rest api, sql và docker cho ai cho một đồng đội mới như thế nào?
  - Một assumption nào của rest api, sql và docker cho ai có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain rest apis, sql and docker for ai to a new teammate?
  - Which assumption behind rest apis, sql and docker for ai could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'REST APIs, SQL and Docker for AI: inspect one complete path'
  code: "# Topic: REST APIs, SQL and Docker for AI (phase-08-genai-software-genai-software-foundations-3)\nimport time\n\n\
    def timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n   \
    \ return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của rest api, sql và docker cho ai.
  purpose_en: Illustrate the input-to-output path for rest apis, sql and docker for ai.
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
  title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
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
- title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
  language: en
  purpose_vi: Nắm request, response, method, status và JSON boundary.
  read_vi: Đọc request/response cycle, status code và content type.
  purpose_en: Learn request, response, methods, status codes, and JSON boundaries.
  read_en: Read the request/response cycle, status codes, and content types.
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
- exercise-8-genai-software-foundations
review_item_ids:
- phase-08-genai-software-genai-software-foundations-3-recall
- phase-08-genai-software-genai-software-foundations-3-application
- phase-08-genai-software-genai-software-foundations-3-debug
- phase-08-genai-software-genai-software-foundations-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của rest api, sql và docker cho ai.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng rest api, sql và docker cho ai và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng rest api, sql và docker cho ai.
- Đánh giá rest api, sql và docker cho ai bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ rest api, sql và docker cho ai mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-08-genai-software-genai-software-foundations-4
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
review_question_vi: Định nghĩa rest api, sql và docker cho ai bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define rest apis, sql and docker for ai in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng rest api, sql và docker cho ai.
  Hãy liên hệ cụ thể với rest api, sql và docker cho ai trong lesson phase-08-genai-software-genai-software-foundations-3.
review_answer_en: A strong answer names the input, transformation, output and the context where rest apis, sql and docker
  for ai is used. Relate it specifically to rest apis, sql and docker for ai in lesson phase-08-genai-software-genai-software-foundations-3.
review_cards:
- id: phase-08-genai-software-genai-software-foundations-3-recall
  type: recall
  question_vi: Định nghĩa rest api, sql và docker cho ai bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define rest apis, sql and docker for ai in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng rest api, sql và docker cho ai.
  answer_en: A strong answer names the input, transformation, output and the context where rest apis, sql and docker for ai
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-08-genai-software-genai-software-foundations-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng rest api, sql và docker cho ai cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies rest apis, sql and docker for ai to an AI engineering problem.
  answer_vi: Ví dụ cho rest api, sql và docker cho ai cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-08-genai-software-genai-software-foundations-3).
  answer_en: The rest apis, sql and docker for ai example should have an explicit input, expected output and a way to run
    or verify it (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-08-genai-software-genai-software-foundations-3-debug
  type: debug
  question_vi: Nếu kết quả của rest api, sql và docker cho ai sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If rest apis, sql and docker for ai produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với rest api, sql và docker cho ai, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-08-genai-software-genai-software-foundations-3).
  answer_en: For rest apis, sql and docker for ai, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-08-genai-software-genai-software-foundations-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của rest api, sql và docker cho ai như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of rest apis, sql and docker for ai?
  answer_vi: Câu trả lời về rest api, sql và docker cho ai cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-08-genai-software-genai-software-foundations-3).
  answer_en: The answer about rest apis, sql and docker for ai should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# REST API, SQL và Docker cho AI / REST APIs, SQL and Docker for AI

REST API, SQL và Docker cho AI mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.

## Practice

Đóng gói một endpoint AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi lại contract, health check và lệnh rollback.
