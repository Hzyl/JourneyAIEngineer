---
lesson_id: phase-05-mlops-api-1
phase_id: phase-05-mlops
module_id: api
title_vi: Đóng gói mã nguồn và cấu hình
title_en: Package code and configuration
summary_vi: Đóng gói tách logic xử lý khỏi điểm khởi động và cấu hình môi trường.
summary_en: Learn Package code and configuration through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain package code and configuration with a concrete example.
- Write or adapt a small code example applying package code and configuration.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-debugging-4
- phase-04-deep-learning-pytorch-core-1
key_terms:
- package
- code
- configuration
- inference
- observability
- reproducibility
- deployment
- api
concept_notes_vi: Đóng gói tách logic xử lý khỏi điểm khởi động và cấu hình môi trường. Cấu hình cần giá trị mặc
  định rõ, kiểm tra khi nạp và cách cung cấp bí mật riêng với mã nguồn.
concept_notes_en: Package code và configuration is a Software Engineering skill for turning an idea into code that
  can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing.
  In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Đóng gói mô hình thành dịch vụ có cấu hình và cấu trúc yêu cầu, phản hồi rõ ràng.
why_it_matters_en: Package a model as an inference service with configuration, request/response schemas, and a clear
  batch path.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Package code and configuration” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Package a model as an inference service with configuration, request/response
  schemas, and a clear batch path.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Separate model loading, service, and routes; add health checks, model versioning,
  and valid/invalid request tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách bộ nạp mô hình, logic dịch vụ và
      route; thêm kiểm tra tình trạng, phiên bản mô hình và kiểm thử yêu cầu hợp lệ, không hợp lệ.'
    deliverables:
    - Yêu cầu mẫu, phản hồi và kiểm thử dữ liệu không hợp lệ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Separate model loading, service, and routes; add health checks, model versioning, and valid/invalid request
      tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can replace the model without rewriting the API and locate input, model, or server failures.
    stretch: Add a failure test for package code and configuration and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Đóng gói mã nguồn và cấu hình” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain package code and configuration to a new teammate?
  - Which assumption behind package code and configuration could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Package code and configuration: inspect one complete path'
  code: "# Topic: Package code and configuration (phase-05-mlops-api-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for package code and configuration.
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
- exercise-5-api
review_item_ids:
- phase-05-mlops-api-1-recall
- phase-05-mlops-api-1-application
- phase-05-mlops-api-1-debug
- phase-05-mlops-api-1-interview
estimated_minutes: 60
completion_checklist:
- Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
common_mistakes:
- Chỉ thử yêu cầu hợp lệ và bỏ qua lỗi nạp mô hình hoặc sai kiểu dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-api-2
- phase-05-mlops-api-3
review_question_vi: Nội dung cốt lõi của “Đóng gói mã nguồn và cấu hình” là gì?
review_question_en: Define package code and configuration in your own words. What are the input, transformation
  and output?
review_answer_vi: Đóng gói tách logic xử lý khỏi điểm khởi động và cấu hình môi trường. Cấu hình cần giá trị mặc
  định rõ, kiểm tra khi nạp và cách cung cấp bí mật riêng với mã nguồn.
review_answer_en: A strong answer names the input, transformation, output and the context where package code and
  configuration is used. Relate it specifically to package code and configuration in lesson phase-05-mlops-api-1.
review_cards:
- id: phase-05-mlops-api-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đóng gói mã nguồn và cấu hình” là gì?
  question_en: Define package code and configuration in your own words. What are the input, transformation and output?
  answer_vi: Đóng gói tách logic xử lý khỏi điểm khởi động và cấu hình môi trường. Cấu hình cần giá trị mặc định
    rõ, kiểm tra khi nạp và cách cung cấp bí mật riêng với mã nguồn.
  answer_en: A strong answer names the input, transformation, output and the context where package code and configuration
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-api-1-application
  type: application
  question_vi: Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.
  question_en: Write a small code example or design that applies package code and configuration to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc”, cần lưu:
    yêu cầu mẫu, phản hồi và kiểm thử dữ liệu không hợp lệ. Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc
    tả API.'
  answer_en: The package code and configuration example should have an explicit input, expected output and a way
    to run or verify it (phase-05-mlops-api-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-api-1-debug
  type: debug
  question_vi: Khi làm bài “Đóng gói mã nguồn và cấu hình”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If package code and configuration produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Đóng gói mã nguồn và cấu hình”, lỗi cần tránh là: chỉ thử yêu cầu hợp lệ và bỏ qua lỗi
    nạp mô hình hoặc sai kiểu dữ liệu. Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For package code and configuration, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-05-mlops-api-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-api-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đóng gói mã nguồn và cấu hình” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of package code and configuration?
  answer_vi: Bắt đầu từ nhiệm vụ “Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about package code and configuration should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-05-mlops-api-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đóng gói mã nguồn và cấu hình / Package code and configuration

Đóng gói tách logic xử lý khỏi điểm khởi động và cấu hình môi trường. Cấu hình cần giá trị mặc định rõ, kiểm tra khi nạp và cách cung cấp bí mật riêng với mã nguồn.

## Thực hành

Tách cấu hình khỏi logic xử lý và kiểm tra trường hợp thiếu giá trị bắt buộc.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách bộ nạp mô hình, logic dịch vụ và route; thêm kiểm tra tình trạng, phiên bản mô hình và kiểm thử yêu cầu hợp lệ, không hợp lệ.
