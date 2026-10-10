---
lesson_id: phase-05-mlops-observability-1
phase_id: phase-05-mlops
module_id: observability
title_vi: Ghi nhật ký có cấu trúc
title_en: Structured logging
summary_vi: Nhật ký có cấu trúc lưu sự kiện thành các trường nhất quán để tìm kiếm, tổng hợp.
summary_en: Learn Structured logging through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Nhật ký có cấu trúc lưu sự kiện thành các trường nhất quán để tìm kiếm, tổng hợp. Mã yêu cầu giúp
  nối sự kiện cùng luồng; loại bỏ dữ liệu nhạy cảm trước khi ghi.
concept_notes_en: Structured logging is a Software Engineering skill for turning an idea into code that can be read,
  tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python,
  small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Đo độ trễ, thay đổi dữ liệu và lỗi để phát hiện vấn đề trong dịch vụ.
why_it_matters_en: Measure latency, drift, and production errors so you find failures before users report them.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Structured logging” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Measure latency, drift, and production errors so you find failures before
  users report them.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Add structured logs, measure p50/p95, create a drift report, and write a rollback
  runbook.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Thêm nhật ký có cấu trúc, đo p50/p95,
      lập báo cáo thay đổi phân bố dữ liệu và hướng dẫn khôi phục phiên bản.'
    deliverables:
    - Nhật ký hoặc bảng đo có khoảng thời gian và điều kiện thu thập
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
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
  - Bạn sẽ giải thích nội dung “Ghi nhật ký có cấu trúc” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain structured logging to a new teammate?
  - Which assumption behind structured logging could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured logging: inspect one complete path'
  code: "# Topic: Structured logging (phase-05-mlops-observability-1)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for structured logging.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: FastAPI Documentation
  url: https://fastapi.tiangolo.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Docker Get Started
  url: https://docs.docker.com/get-started/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MLflow Documentation
  url: https://mlflow.org/docs/latest/ml/tracking/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python logging
  url: https://docs.python.org/3/library/logging.html
  language: en
  purpose_vi: Ghi đủ thông tin ngữ cảnh để tìm lỗi khi phát triển và vận hành ứng dụng.
  read_vi: Đọc về mức độ nhật ký, logger và handler; tránh ghi bí mật hoặc thông tin nhận dạng cá nhân (PII).
  purpose_en: Add structured context for debugging and production.
  read_en: Read levels, loggers, and handlers; never log secrets or PII.
  kind: official
  required: true
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
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
- Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
common_mistakes:
- Quy mọi suy giảm chất lượng cho thay đổi dữ liệu mà chưa kiểm tra nguyên nhân.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-observability-2
- phase-05-mlops-observability-3
review_question_vi: Nội dung cốt lõi của “Ghi nhật ký có cấu trúc” là gì?
review_question_en: Define structured logging in your own words. What are the input, transformation and output?
review_answer_vi: Nhật ký có cấu trúc lưu sự kiện thành các trường nhất quán để tìm kiếm, tổng hợp. Mã yêu cầu giúp
  nối sự kiện cùng luồng; loại bỏ dữ liệu nhạy cảm trước khi ghi.
review_answer_en: A strong answer names the input, transformation, output and the context where structured logging
  is used. Relate it specifically to structured logging in lesson phase-05-mlops-observability-1.
review_cards:
- id: phase-05-mlops-observability-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Ghi nhật ký có cấu trúc” là gì?
  question_en: Define structured logging in your own words. What are the input, transformation and output?
  answer_vi: Nhật ký có cấu trúc lưu sự kiện thành các trường nhất quán để tìm kiếm, tổng hợp. Mã yêu cầu giúp nối
    sự kiện cùng luồng; loại bỏ dữ liệu nhạy cảm trước khi ghi.
  answer_en: A strong answer names the input, transformation, output and the context where structured logging is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-observability-1-application
  type: application
  question_vi: Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.
  question_en: Write a small code example or design that applies structured logging to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật”, cần lưu:
    nhật ký hoặc bảng đo có khoảng thời gian và điều kiện thu thập. Phân biệt dấu hiệu bất thường với nguyên nhân
    đã được kiểm chứng.'
  answer_en: The structured logging example should have an explicit input, expected output and a way to run or verify
    it (phase-05-mlops-observability-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-observability-1-debug
  type: debug
  question_vi: Khi làm bài “Ghi nhật ký có cấu trúc”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If structured logging produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Ghi nhật ký có cấu trúc”, lỗi cần tránh là: quy mọi suy giảm chất lượng cho thay đổi dữ
    liệu mà chưa kiểm tra nguyên nhân. Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For structured logging, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-05-mlops-observability-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-observability-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Ghi nhật ký có cấu trúc” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured logging?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about structured logging should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-05-mlops-observability-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Ghi nhật ký có cấu trúc / Structured logging

Nhật ký có cấu trúc lưu sự kiện thành các trường nhất quán để tìm kiếm, tổng hợp. Mã yêu cầu giúp nối sự kiện cùng luồng; loại bỏ dữ liệu nhạy cảm trước khi ghi.

## Thực hành

Ghi sự kiện với mã yêu cầu, thời gian xử lý và trạng thái mà không lộ bí mật.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Thêm nhật ký có cấu trúc, đo p50/p95, lập báo cáo thay đổi phân bố dữ liệu và hướng dẫn khôi phục phiên bản.
