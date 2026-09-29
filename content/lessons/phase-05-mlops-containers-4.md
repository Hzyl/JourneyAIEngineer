---
lesson_id: phase-05-mlops-containers-4
phase_id: phase-05-mlops
module_id: containers
title_vi: CI pipeline
title_en: CI pipelines
summary_vi: Học CI pipeline qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn CI pipelines through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích ci pipeline bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng ci pipeline.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain ci pipelines with a concrete example.
- Write or adapt a small code example applying ci pipelines.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-containers-3
- phase-04-deep-learning-pytorch-core-1
key_terms:
- pipeline
- inference
- observability
- reproducibility
- deployment
- containers
concept_notes_vi: CI pipeline là khái niệm của module containers. Hãy xác định input, output, giả định, failure mode và cách
  kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: CI pipeline is a concept in the containers module. Identify the inputs, outputs, assumptions, failure modes,
  and verification method with a small example before scaling to a project.
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
    stretch: Viết thêm một failure test cho ci pipeline và giải thích kết quả.
  en:
    task: Write a small Dockerfile, build the image, run the container, call its health check, and add CI tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know what the image contains, what it omits, and how to roll back to an earlier tag.
    stretch: Add a failure test for ci pipelines and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích ci pipeline cho một đồng đội mới như thế nào?
  - Một assumption nào của ci pipeline có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain ci pipelines to a new teammate?
  - Which assumption behind ci pipelines could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'CI pipelines: inspect one complete path'
  code: "# Topic: CI pipelines (phase-05-mlops-containers-4)\nimport time\n\ndef timed_response(value: float) -> dict[str,\
    \ float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms': (time.perf_counter()\
    \ - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của ci pipeline.
  purpose_en: Illustrate the input-to-output path for ci pipelines.
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
- title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
  language: en
  purpose_vi: Tự động chạy quality gate trước khi merge hoặc push artifact.
  read_vi: Đọc workflow, runner, secrets và artifact.
  purpose_en: Automate quality gates before merging or publishing artifacts.
  read_en: Read workflows, runners, secrets, and artifacts.
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
- exercise-5-containers
review_item_ids:
- phase-05-mlops-containers-4-recall
- phase-05-mlops-containers-4-application
- phase-05-mlops-containers-4-debug
- phase-05-mlops-containers-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của ci pipeline.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng ci pipeline và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng ci pipeline.
- Đánh giá ci pipeline bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ ci pipeline mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-05-mlops-tracking-1
- phase-05-mlops-tracking-2
review_question_vi: Định nghĩa ci pipeline bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define ci pipelines in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng ci pipeline. Hãy liên hệ cụ thể
  với ci pipeline trong lesson phase-05-mlops-containers-4.
review_answer_en: A strong answer names the input, transformation, output and the context where ci pipelines is used. Relate
  it specifically to ci pipelines in lesson phase-05-mlops-containers-4.
review_cards:
- id: phase-05-mlops-containers-4-recall
  type: recall
  question_vi: Định nghĩa ci pipeline bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define ci pipelines in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng ci pipeline.
  answer_en: A strong answer names the input, transformation, output and the context where ci pipelines is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-containers-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng ci pipeline cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies ci pipelines to an AI engineering problem.
  answer_vi: Ví dụ cho ci pipeline cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-05-mlops-containers-4).
  answer_en: The ci pipelines example should have an explicit input, expected output and a way to run or verify it (phase-05-mlops-containers-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-containers-4-debug
  type: debug
  question_vi: Nếu kết quả của ci pipeline sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If ci pipelines produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với ci pipeline, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và error
    analysis (phase-05-mlops-containers-4).
  answer_en: For ci pipelines, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a
    small test and error analysis (phase-05-mlops-containers-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-containers-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của ci pipeline như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of ci pipelines?
  answer_vi: Câu trả lời về ci pipeline cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production (phase-05-mlops-containers-4).
  answer_en: The answer about ci pipelines should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-05-mlops-containers-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# CI pipeline / CI pipelines

CI pipeline là khái niệm của module containers. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Viết Dockerfile nhỏ, build image, chạy container, gọi health check và tạo CI chạy test.
