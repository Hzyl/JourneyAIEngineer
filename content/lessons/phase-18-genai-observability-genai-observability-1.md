---
lesson_id: phase-18-genai-observability-genai-observability-1
phase_id: phase-18-genai-observability
module_id: genai-observability
title_vi: Nhật ký có cấu trúc và truy vết
title_en: Structured logging and tracing
summary_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu.
summary_en: Learn Structured logging and tracing through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain structured logging and tracing with a concrete example.
- Write or adapt a small code example applying structured logging and tracing.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-17-genai-evaluation-genai-evaluation-4
- phase-17-genai-evaluation-genai-evaluation-1
key_terms:
- structured
- logging
- tracing
- inference
- observability
- reproducibility
- deployment
- genai-observability
concept_notes_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm
  hoặc lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.
concept_notes_en: Structured logging và tracing is a Software Engineering skill for turning an idea into code that
  can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing.
  In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Thu thập dữ liệu đủ để phân biệt lỗi mô hình, truy xuất, nhà cung cấp và hạ tầng.
why_it_matters_en: Without telemetry you cannot tell whether a failure is in the model, retrieval, provider, or
  infrastructure.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Structured logging and tracing” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Without telemetry you cannot tell whether a failure is in the model, retrieval,
  provider, or infrastructure.'
- Open OpenTelemetry Python, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Instrument an end-to-end request with a trace ID, token/cost fields, p50/p95 latency,
  and a budget alert.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Theo dõi một yêu cầu từ đầu tới cuối
      với mã truy vết, token, chi phí, độ trễ p50/p95 và cảnh báo ngân sách.'
    deliverables:
    - Bản ghi yêu cầu có mã truy vết, thời gian và lượng tài nguyên
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Instrument an end-to-end request with a trace ID, token/cost fields, p50/p95 latency, and a budget alert.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From one trace you can identify a latency or cost spike without logging sensitive prompts.
    stretch: Add a failure test for structured logging and tracing and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Nhật ký có cấu trúc và truy vết” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain structured logging and tracing to a new teammate?
  - Which assumption behind structured logging and tracing could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured logging and tracing: inspect one complete path'
  code: "# Topic: Structured logging and tracing (phase-18-genai-observability-genai-observability-1)\nimport time\n\
    \ndef timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value\
    \ * 2\n    return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for structured logging and tracing.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenTelemetry Python
  url: https://opentelemetry.io/docs/languages/python/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Prometheus Overview
  url: https://prometheus.io/docs/introduction/overview/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Langfuse Documentation
  url: https://langfuse.com/docs
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
- exercise-18-genai-observability
review_item_ids:
- phase-18-genai-observability-genai-observability-1-recall
- phase-18-genai-observability-genai-observability-1-application
- phase-18-genai-observability-genai-observability-1-debug
- phase-18-genai-observability-genai-observability-1-interview
estimated_minutes: 60
completion_checklist:
- Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
common_mistakes:
- Ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-18-genai-observability-genai-observability-2
- phase-18-genai-observability-genai-observability-3
review_question_vi: Nội dung cốt lõi của “Nhật ký có cấu trúc và truy vết” là gì?
review_question_en: Define structured logging and tracing in your own words. What are the input, transformation
  and output?
review_answer_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm
  hoặc lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.
review_answer_en: A strong answer names the input, transformation, output and the context where structured logging
  and tracing is used. Relate it specifically to structured logging and tracing in lesson phase-18-genai-observability-genai-observability-1.
review_cards:
- id: phase-18-genai-observability-genai-observability-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Nhật ký có cấu trúc và truy vết” là gì?
  question_en: Define structured logging and tracing in your own words. What are the input, transformation and output?
  answer_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm hoặc
    lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.
  answer_en: A strong answer names the input, transformation, output and the context where structured logging and
    tracing is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-18-genai-observability-genai-observability-1-application
  type: application
  question_vi: Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.
  question_en: Write a small code example or design that applies structured logging and tracing to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết”, cần lưu: bản ghi yêu cầu có
    mã truy vết, thời gian và lượng tài nguyên. Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.'
  answer_en: The structured logging and tracing example should have an explicit input, expected output and a way
    to run or verify it (phase-18-genai-observability-genai-observability-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-18-genai-observability-genai-observability-1-debug
  type: debug
  question_vi: Khi làm bài “Nhật ký có cấu trúc và truy vết”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If structured logging and tracing produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Nhật ký có cấu trúc và truy vết”, lỗi cần tránh là: ghi prompt nhạy cảm chỉ để tiện tìm
    lỗi. Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For structured logging and tracing, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-18-genai-observability-genai-observability-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-18-genai-observability-genai-observability-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Nhật ký có cấu trúc và truy vết” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured logging and tracing?
  answer_vi: Bắt đầu từ nhiệm vụ “Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết”. Trình bày kết quả đã
    lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about structured logging and tracing should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-18-genai-observability-genai-observability-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Nhật ký có cấu trúc và truy vết / Structured logging and tracing

Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm hoặc lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.

## Thực hành

Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Theo dõi một yêu cầu từ đầu tới cuối với mã truy vết, token, chi phí, độ trễ p50/p95 và cảnh báo ngân sách.
