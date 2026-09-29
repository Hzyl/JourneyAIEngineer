---
lesson_id: phase-05-mlops-containers-2
phase_id: phase-05-mlops
module_id: containers
title_vi: Docker compose basics
title_en: Docker Compose basics
summary_vi: Học Docker compose basics qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Docker Compose basics through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích docker compose basics bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng docker compose basics.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain docker compose basics with a concrete example.
- Write or adapt a small code example applying docker compose basics.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-containers-1
- phase-04-deep-learning-pytorch-core-1
key_terms:
- docker
- compose
- basics
- inference
- observability
- reproducibility
- deployment
- containers
concept_notes_vi: Docker compose basics nối code với môi trường chạy thật. Hãy ghi rõ artifact, dependency, configuration,
  health check và cách rollback; một build thành công chưa đủ nếu chưa chạy smoke test trong môi trường gần production.
concept_notes_en: Docker compose basics connects code to a real runtime. Document the artifact, dependencies, configuration,
  health check, and rollback path; a successful build is not enough without a smoke test in a production-like environment.
why_it_matters_vi: Đóng gói môi trường bằng Docker và CI để người khác clone rồi chạy được cùng một service.
why_it_matters_en: Package the environment with Docker and CI so another engineer can run the same service from a clone.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đóng gói môi trường bằng Docker và CI để người khác clone rồi chạy được cùng một service.'
- Mở FastAPI Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết Dockerfile nhỏ, build image, chạy container, gọi health check và tạo CI chạy test.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Package the environment with Docker and CI so another engineer can run the same service
  from a clone.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a small Dockerfile, build the image, run the container, call its health check, and add
  CI tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết Dockerfile nhỏ, build image, chạy container, gọi health check và tạo CI chạy test.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn biết image chứa gì, thiếu gì, và có thể rollback về tag trước khi release.
    stretch: Viết thêm một failure test cho docker compose basics và giải thích kết quả.
  en:
    task: Write a small Dockerfile, build the image, run the container, call its health check, and add CI tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know what the image contains, what it omits, and how to roll back to an earlier tag.
    stretch: Add a failure test for docker compose basics and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích docker compose basics cho một đồng đội mới như thế nào?
  - Một assumption nào của docker compose basics có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain docker compose basics to a new teammate?
  - Which assumption behind docker compose basics could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Docker Compose basics: inspect one complete path'
  code: "# Topic: Docker Compose basics (phase-05-mlops-containers-2)\nimport time\n\ndef timed_response(value: float) ->\
    \ dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms':\
    \ (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của docker compose basics.
  purpose_en: Illustrate the input-to-output path for docker compose basics.
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
- exercise-5-containers
review_item_ids:
- phase-05-mlops-containers-2-recall
- phase-05-mlops-containers-2-application
- phase-05-mlops-containers-2-debug
- phase-05-mlops-containers-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của docker compose basics.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng docker compose basics và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng docker compose basics.
- Đánh giá docker compose basics bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ docker compose basics mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-05-mlops-containers-3
- phase-05-mlops-containers-4
review_question_vi: Định nghĩa docker compose basics bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define docker compose basics in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng docker compose basics. Hãy liên
  hệ cụ thể với docker compose basics trong lesson phase-05-mlops-containers-2.
review_answer_en: A strong answer names the input, transformation, output and the context where docker compose basics is used.
  Relate it specifically to docker compose basics in lesson phase-05-mlops-containers-2.
review_cards:
- id: phase-05-mlops-containers-2-recall
  type: recall
  question_vi: Định nghĩa docker compose basics bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define docker compose basics in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng docker compose basics.
  answer_en: A strong answer names the input, transformation, output and the context where docker compose basics is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-containers-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng docker compose basics cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies docker compose basics to an AI engineering problem.
  answer_vi: Ví dụ cho docker compose basics cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-05-mlops-containers-2).
  answer_en: The docker compose basics example should have an explicit input, expected output and a way to run or verify it
    (phase-05-mlops-containers-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-containers-2-debug
  type: debug
  question_vi: Nếu kết quả của docker compose basics sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If docker compose basics produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với docker compose basics, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-05-mlops-containers-2).
  answer_en: For docker compose basics, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-05-mlops-containers-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-containers-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của docker compose basics như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of docker compose basics?
  answer_vi: Câu trả lời về docker compose basics cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-05-mlops-containers-2).
  answer_en: The answer about docker compose basics should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-05-mlops-containers-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Docker compose basics / Docker Compose basics

Docker compose basics nối code với môi trường chạy thật. Hãy ghi rõ artifact, dependency, configuration, health check và cách rollback; một build thành công chưa đủ nếu chưa chạy smoke test trong môi trường gần production.

## Practice

Viết Dockerfile nhỏ, build image, chạy container, gọi health check và tạo CI chạy test.
