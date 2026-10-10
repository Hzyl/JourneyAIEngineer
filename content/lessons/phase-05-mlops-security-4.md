---
lesson_id: phase-05-mlops-security-4
phase_id: phase-05-mlops
module_id: security
title_vi: Che dữ liệu cá nhân và bí mật
title_en: PII and secret redaction
summary_vi: Nhật ký hoặc thông báo lỗi có thể chứa dữ liệu cá nhân, khóa API hay thông tin đăng nhập.
summary_en: Learn PII and secret redaction through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.
- Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain pii and secret redaction with a concrete example.
- Write or adapt a small code example applying pii and secret redaction.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-security-3
- phase-04-deep-learning-pytorch-core-1
key_terms:
- pii
- secret
- redaction
- inference
- observability
- reproducibility
- deployment
- security
concept_notes_vi: Nhật ký hoặc thông báo lỗi có thể chứa dữ liệu cá nhân, khóa API hay thông tin đăng nhập. Che
  dữ liệu trước khi ghi và kiểm tra bằng giá trị giả lập.
concept_notes_en: PII và secret redaction is a concept in the security module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Kiểm soát đầu vào, phụ thuộc và nhật ký để giảm rò rỉ bí mật hoặc dữ liệu cá nhân.
why_it_matters_en: Protect the inference service from secret leaks, oversized input, risky dependencies, and PII
  exposure.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “PII and secret redaction” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.
- Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Protect the inference service from secret leaks, oversized input, risky dependencies,
  and PII exposure.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Add input limits, secret redaction, and dependency checks; test a malicious payload
  without real secrets.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đặt giới hạn đầu vào, che bí mật và
      kiểm tra phụ thuộc; thử bằng dữ liệu xấu giả lập.'
    deliverables:
    - Trường hợp thử bằng dữ liệu giả và kết quả kiểm soát đầu vào
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Add input limits, secret redaction, and dependency checks; test a malicious payload without real secrets.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know which logs to redact, which limits to enforce, and how to report a risk.
    stretch: Add a failure test for pii and secret redaction and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Che dữ liệu cá nhân và bí mật” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain pii and secret redaction to a new teammate?
  - Which assumption behind pii and secret redaction could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'PII and secret redaction: inspect one complete path'
  code: "# Topic: PII and secret redaction (phase-05-mlops-security-4)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for pii and secret redaction.
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
- exercise-5-security
review_item_ids:
- phase-05-mlops-security-4-recall
- phase-05-mlops-security-4-application
- phase-05-mlops-security-4-debug
- phase-05-mlops-security-4-interview
estimated_minutes: 60
completion_checklist:
- Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.
- Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký.
common_mistakes:
- Dùng dữ liệu thật hoặc bí mật để thử cơ chế che thông tin.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-nlp-foundations-1
- phase-06-llm-rag-nlp-foundations-2
review_question_vi: Nội dung cốt lõi của “Che dữ liệu cá nhân và bí mật” là gì?
review_question_en: Define pii and secret redaction in your own words. What are the input, transformation and output?
review_answer_vi: Nhật ký hoặc thông báo lỗi có thể chứa dữ liệu cá nhân, khóa API hay thông tin đăng nhập. Che
  dữ liệu trước khi ghi và kiểm tra bằng giá trị giả lập.
review_answer_en: A strong answer names the input, transformation, output and the context where pii and secret redaction
  is used. Relate it specifically to pii and secret redaction in lesson phase-05-mlops-security-4.
review_cards:
- id: phase-05-mlops-security-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Che dữ liệu cá nhân và bí mật” là gì?
  question_en: Define pii and secret redaction in your own words. What are the input, transformation and output?
  answer_vi: Nhật ký hoặc thông báo lỗi có thể chứa dữ liệu cá nhân, khóa API hay thông tin đăng nhập. Che dữ liệu
    trước khi ghi và kiểm tra bằng giá trị giả lập.
  answer_en: A strong answer names the input, transformation, output and the context where pii and secret redaction
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-security-4-application
  type: application
  question_vi: Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.
  question_en: Write a small code example or design that applies pii and secret redaction to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi”, cần lưu:
    trường hợp thử bằng dữ liệu giả và kết quả kiểm soát đầu vào. Kiểm tra giới hạn, quyền truy cập và nội dung
    bị ghi vào nhật ký.'
  answer_en: The pii and secret redaction example should have an explicit input, expected output and a way to run
    or verify it (phase-05-mlops-security-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-security-4-debug
  type: debug
  question_vi: Khi làm bài “Che dữ liệu cá nhân và bí mật”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If pii and secret redaction produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Che dữ liệu cá nhân và bí mật”, lỗi cần tránh là: dùng dữ liệu thật hoặc bí mật để thử
    cơ chế che thông tin. Kiểm tra giới hạn, quyền truy cập và nội dung bị ghi vào nhật ký. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For pii and secret redaction, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-05-mlops-security-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-security-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Che dữ liệu cá nhân và bí mật” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of pii and secret redaction?
  answer_vi: Bắt đầu từ nhiệm vụ “Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about pii and secret redaction should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-05-mlops-security-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Che dữ liệu cá nhân và bí mật / PII and secret redaction

Nhật ký hoặc thông báo lỗi có thể chứa dữ liệu cá nhân, khóa API hay thông tin đăng nhập. Che dữ liệu trước khi ghi và kiểm tra bằng giá trị giả lập.

## Thực hành

Dùng dữ liệu giả để kiểm tra bí mật bị che trong nhật ký và thông báo lỗi.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đặt giới hạn đầu vào, che bí mật và kiểm tra phụ thuộc; thử bằng dữ liệu xấu giả lập.
