---
lesson_id: phase-18-genai-observability-genai-observability-3
phase_id: phase-18-genai-observability
module_id: genai-observability
title_vi: Theo dõi chi phí và ngân sách
title_en: Cost monitoring and budgets
summary_vi: Chi phí cần gắn với loại yêu cầu, mô hình và lượng sử dụng.
summary_en: Learn Cost monitoring and budgets through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Chi phí cần gắn với loại yêu cầu, mô hình và lượng sử dụng. Ngưỡng ngân sách phải đi cùng hành
  động rõ như cảnh báo, từ chối yêu cầu mới hoặc chuyển phương án đã đánh giá.
concept_notes_en: Cost monitoring và budget turns an AI demo into a system that can be trusted. Define metrics and
  an evaluation set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation,
  data, or infrastructure instead of relying on one score.
why_it_matters_vi: Thu thập dữ liệu đủ để phân biệt lỗi mô hình, truy xuất, nhà cung cấp và hạ tầng.
why_it_matters_en: Without telemetry you cannot tell whether a failure is in the model, retrieval, provider, or
  infrastructure.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Cost monitoring and budgets” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.
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
    task: 'Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.


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
    stretch: Add a failure test for cost monitoring and budgets and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Theo dõi chi phí và ngân sách” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
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
  code: "# Topic: Cost monitoring and budgets (phase-18-genai-observability-genai-observability-3)\nfrom dataclasses\
    \ import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for cost monitoring and budgets.
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
- phase-18-genai-observability-genai-observability-3-recall
- phase-18-genai-observability-genai-observability-3-application
- phase-18-genai-observability-genai-observability-3-debug
- phase-18-genai-observability-genai-observability-3-interview
estimated_minutes: 60
completion_checklist:
- Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
common_mistakes:
- Ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-18-genai-observability-genai-observability-4
- phase-19-genai-production-genai-production-1
review_question_vi: Nội dung cốt lõi của “Theo dõi chi phí và ngân sách” là gì?
review_question_en: Define cost monitoring and budgets in your own words. What are the input, transformation and
  output?
review_answer_vi: Chi phí cần gắn với loại yêu cầu, mô hình và lượng sử dụng. Ngưỡng ngân sách phải đi cùng hành
  động rõ như cảnh báo, từ chối yêu cầu mới hoặc chuyển phương án đã đánh giá.
review_answer_en: A strong answer names the input, transformation, output and the context where cost monitoring
  and budgets is used. Relate it specifically to cost monitoring and budgets in lesson phase-18-genai-observability-genai-observability-3.
review_cards:
- id: phase-18-genai-observability-genai-observability-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Theo dõi chi phí và ngân sách” là gì?
  question_en: Define cost monitoring and budgets in your own words. What are the input, transformation and output?
  answer_vi: Chi phí cần gắn với loại yêu cầu, mô hình và lượng sử dụng. Ngưỡng ngân sách phải đi cùng hành động
    rõ như cảnh báo, từ chối yêu cầu mới hoặc chuyển phương án đã đánh giá.
  answer_en: A strong answer names the input, transformation, output and the context where cost monitoring and budgets
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-18-genai-observability-genai-observability-3-application
  type: application
  question_vi: Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.
  question_en: Write a small code example or design that applies cost monitoring and budgets to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng”, cần lưu: bản
    ghi yêu cầu có mã truy vết, thời gian và lượng tài nguyên. Lần theo các bước và xác định nơi độ trễ hoặc chi
    phí tăng.'
  answer_en: The cost monitoring and budgets example should have an explicit input, expected output and a way to
    run or verify it (phase-18-genai-observability-genai-observability-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-18-genai-observability-genai-observability-3-debug
  type: debug
  question_vi: Khi làm bài “Theo dõi chi phí và ngân sách”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If cost monitoring and budgets produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Theo dõi chi phí và ngân sách”, lỗi cần tránh là: ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
    Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác
    dự kiến.'
  answer_en: For cost monitoring and budgets, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-18-genai-observability-genai-observability-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-18-genai-observability-genai-observability-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Theo dõi chi phí và ngân sách” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of cost monitoring and budgets?
  answer_vi: Bắt đầu từ nhiệm vụ “Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about cost monitoring and budgets should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-18-genai-observability-genai-observability-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Theo dõi chi phí và ngân sách / Cost monitoring and budgets

Chi phí cần gắn với loại yêu cầu, mô hình và lượng sử dụng. Ngưỡng ngân sách phải đi cùng hành động rõ như cảnh báo, từ chối yêu cầu mới hoặc chuyển phương án đã đánh giá.

## Thực hành

Lập bảng chi phí theo yêu cầu và định nghĩa hành động khi chạm ngưỡng.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Theo dõi một yêu cầu từ đầu tới cuối với mã truy vết, token, chi phí, độ trễ p50/p95 và cảnh báo ngân sách.
