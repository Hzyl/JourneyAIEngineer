---
lesson_id: phase-05-mlops-security-4
phase_id: phase-05-mlops
module_id: security
title_vi: PII và secret redaction
title_en: PII and secret redaction
summary_vi: Học PII và secret redaction qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn PII and secret redaction through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích pii và secret redaction bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng pii và secret redaction.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
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
concept_notes_vi: PII và secret redaction là khái niệm của module security. Hãy xác định input, output, giả định, failure
  mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: PII và secret redaction is a concept in the security module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Bảo vệ inference service khỏi secret leak, input quá lớn, dependency rủi ro và PII.
why_it_matters_en: Protect the inference service from secret leaks, oversized input, risky dependencies, and PII exposure.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Bảo vệ inference service khỏi secret leak, input quá lớn, dependency rủi ro và PII.'
- Mở FastAPI Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết input limits, secret redaction và dependency check; thử một payload xấu nhưng không dùng secret
  thật.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Protect the inference service from secret leaks, oversized input, risky dependencies,
  and PII exposure.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Add input limits, secret redaction, and dependency checks; test a malicious payload without
  real secrets.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết input limits, secret redaction và dependency check; thử một payload xấu nhưng không dùng secret thật.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn biết log nào cần ẩn, giới hạn nào cần enforce và cách báo cáo rủi ro.
    stretch: Viết thêm một failure test cho pii và secret redaction và giải thích kết quả.
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
  - Bạn sẽ giải thích pii và secret redaction cho một đồng đội mới như thế nào?
  - Một assumption nào của pii và secret redaction có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
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
  purpose_vi: Minh họa đường đi input → output của pii và secret redaction.
  purpose_en: Illustrate the input-to-output path for pii and secret redaction.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
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
- exercise-5-security
review_item_ids:
- phase-05-mlops-security-4-recall
- phase-05-mlops-security-4-application
- phase-05-mlops-security-4-debug
- phase-05-mlops-security-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của pii và secret redaction.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng pii và secret redaction và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng pii và secret redaction.
- Đánh giá pii và secret redaction bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ pii và secret redaction mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-nlp-foundations-1
- phase-06-llm-rag-nlp-foundations-2
review_question_vi: Định nghĩa pii và secret redaction bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define pii and secret redaction in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng pii và secret redaction. Hãy liên
  hệ cụ thể với pii và secret redaction trong lesson phase-05-mlops-security-4.
review_answer_en: A strong answer names the input, transformation, output and the context where pii and secret redaction is
  used. Relate it specifically to pii and secret redaction in lesson phase-05-mlops-security-4.
review_cards:
- id: phase-05-mlops-security-4-recall
  type: recall
  question_vi: Định nghĩa pii và secret redaction bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define pii and secret redaction in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng pii và secret redaction.
  answer_en: A strong answer names the input, transformation, output and the context where pii and secret redaction is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-security-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng pii và secret redaction cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies pii and secret redaction to an AI engineering problem.
  answer_vi: Ví dụ cho pii và secret redaction cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-05-mlops-security-4).
  answer_en: The pii and secret redaction example should have an explicit input, expected output and a way to run or verify
    it (phase-05-mlops-security-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-security-4-debug
  type: debug
  question_vi: Nếu kết quả của pii và secret redaction sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If pii and secret redaction produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với pii và secret redaction, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-05-mlops-security-4).
  answer_en: For pii and secret redaction, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-05-mlops-security-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-security-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của pii và secret redaction như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of pii and secret redaction?
  answer_vi: Câu trả lời về pii và secret redaction cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-05-mlops-security-4).
  answer_en: The answer about pii and secret redaction should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-05-mlops-security-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# PII và secret redaction / PII and secret redaction

PII và secret redaction là khái niệm của module security. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Viết input limits, secret redaction và dependency check; thử một payload xấu nhưng không dùng secret thật.
