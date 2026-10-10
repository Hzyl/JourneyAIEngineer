---
lesson_id: phase-05-mlops-observability-4
phase_id: phase-05-mlops
module_id: observability
title_vi: Thay đổi quan hệ dự đoán và khôi phục phiên bản
title_en: Concept drift and rollback
summary_vi: Concept drift là thay đổi quan hệ giữa đầu vào và mục tiêu.
summary_en: Learn Concept drift and rollback through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain concept drift and rollback with a concrete example.
- Write or adapt a small code example applying concept drift and rollback.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-observability-3
- phase-04-deep-learning-pytorch-core-1
key_terms:
- concept
- drift
- rollback
- inference
- observability
- reproducibility
- deployment
concept_notes_vi: Concept drift là thay đổi quan hệ giữa đầu vào và mục tiêu. Khi chất lượng giảm, cần bằng chứng
  đánh giá và kế hoạch khôi phục, đồng thời kiểm tra tương thích giữa dữ liệu và dịch vụ.
concept_notes_en: Concept drift và rollback turns an AI demo into a system that can be trusted. Define metrics and
  an evaluation set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation,
  data, or infrastructure instead of relying on one score.
why_it_matters_vi: Đo độ trễ, thay đổi dữ liệu và lỗi để phát hiện vấn đề trong dịch vụ.
why_it_matters_en: Measure latency, drift, and production errors so you find failures before users report them.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Concept drift and rollback” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.
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
    task: 'Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.


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
    stretch: Add a failure test for concept drift and rollback and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Thay đổi quan hệ dự đoán và khôi phục phiên bản” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain concept drift and rollback to a new teammate?
  - Which assumption behind concept drift and rollback could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Concept drift and rollback: inspect one complete path'
  code: "# Topic: Concept drift and rollback (phase-05-mlops-observability-4)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for concept drift and rollback.
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
- phase-05-mlops-observability-4-recall
- phase-05-mlops-observability-4-application
- phase-05-mlops-observability-4-debug
- phase-05-mlops-observability-4-interview
estimated_minutes: 60
completion_checklist:
- Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Phân biệt dấu hiệu bất thường với nguyên nhân đã được kiểm chứng.
common_mistakes:
- Quy mọi suy giảm chất lượng cho thay đổi dữ liệu mà chưa kiểm tra nguyên nhân.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-security-1
- phase-05-mlops-security-2
review_question_vi: Nội dung cốt lõi của “Thay đổi quan hệ dự đoán và khôi phục phiên bản” là gì?
review_question_en: Define concept drift and rollback in your own words. What are the input, transformation and
  output?
review_answer_vi: Concept drift là thay đổi quan hệ giữa đầu vào và mục tiêu. Khi chất lượng giảm, cần bằng chứng
  đánh giá và kế hoạch khôi phục, đồng thời kiểm tra tương thích giữa dữ liệu và dịch vụ.
review_answer_en: A strong answer names the input, transformation, output and the context where concept drift and
  rollback is used. Relate it specifically to concept drift and rollback in lesson phase-05-mlops-observability-4.
review_cards:
- id: phase-05-mlops-observability-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Thay đổi quan hệ dự đoán và khôi phục phiên bản” là gì?
  question_en: Define concept drift and rollback in your own words. What are the input, transformation and output?
  answer_vi: Concept drift là thay đổi quan hệ giữa đầu vào và mục tiêu. Khi chất lượng giảm, cần bằng chứng đánh
    giá và kế hoạch khôi phục, đồng thời kiểm tra tương thích giữa dữ liệu và dịch vụ.
  answer_en: A strong answer names the input, transformation, output and the context where concept drift and rollback
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-observability-4-application
  type: application
  question_vi: Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.
  question_en: Write a small code example or design that applies concept drift and rollback to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước”, cần lưu:
    nhật ký hoặc bảng đo có khoảng thời gian và điều kiện thu thập. Phân biệt dấu hiệu bất thường với nguyên nhân
    đã được kiểm chứng.'
  answer_en: The concept drift and rollback example should have an explicit input, expected output and a way to
    run or verify it (phase-05-mlops-observability-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-observability-4-debug
  type: debug
  question_vi: Khi làm bài “Thay đổi quan hệ dự đoán và khôi phục phiên bản”, bạn cần tránh lỗi nào và kiểm tra
    lại ra sao?
  question_en: If concept drift and rollback produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Thay đổi quan hệ dự đoán và khôi phục phiên bản”, lỗi cần tránh là: quy mọi suy giảm chất
    lượng cho thay đổi dữ liệu mà chưa kiểm tra nguyên nhân. Phân biệt dấu hiệu bất thường với nguyên nhân đã được
    kiểm chứng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For concept drift and rollback, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-05-mlops-observability-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-observability-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Thay đổi quan hệ dự đoán và khôi phục phiên bản” để giải thích cách
    làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of concept drift and rollback?
  answer_vi: Bắt đầu từ nhiệm vụ “Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about concept drift and rollback should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-05-mlops-observability-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Thay đổi quan hệ dự đoán và khôi phục phiên bản / Concept drift and rollback

Concept drift là thay đổi quan hệ giữa đầu vào và mục tiêu. Khi chất lượng giảm, cần bằng chứng đánh giá và kế hoạch khôi phục, đồng thời kiểm tra tương thích giữa dữ liệu và dịch vụ.

## Thực hành

Mô tả cách xác nhận chất lượng giảm và điều kiện khôi phục phiên bản trước.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Thêm nhật ký có cấu trúc, đo p50/p95, lập báo cáo thay đổi phân bố dữ liệu và hướng dẫn khôi phục phiên bản.
