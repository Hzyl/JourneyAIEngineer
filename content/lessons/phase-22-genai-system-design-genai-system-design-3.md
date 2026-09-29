---
lesson_id: phase-22-genai-system-design-genai-system-design-3
phase_id: phase-22-genai-system-design
module_id: genai-system-design
title_vi: Security, cost optimization và model selection
title_en: Security, cost optimization, and model selection
summary_vi: Học Security, cost optimization và model selection qua một mô hình input → biến đổi → output, sau đó kiểm chứng
  bằng bài tập có edge case.
summary_en: Learn Security, cost optimization, and model selection through an input → transformation → output model, then
  verify it with an edge-case exercise.
learning_objectives:
- Giải thích security, cost optimization và model selection bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng security, cost optimization và model selection.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain security, cost optimization, and model selection with a concrete example.
- Write or adapt a small code example applying security, cost optimization, and model selection.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-22-genai-system-design-genai-system-design-2
- phase-21-genai-local-llm-local-llm-1
key_terms:
- security
- cost
- optimization
- model
- selection
- inference
- observability
- reproducibility
- deployment
- genai-system-design
concept_notes_vi: Security, cost optimization và model selection biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa
  metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation,
  data hoặc infrastructure thay vì chỉ nhìn một điểm số.
concept_notes_en: Security, cost optimization và model selection turns an AI demo into a system that can be trusted. Define
  metrics and an evaluation set first, record prompt/model/version/tokens/latency, and attribute failures to retrieval, generation,
  data, or infrastructure instead of relying on one score.
why_it_matters_vi: Senior AI Engineer phải giải thích quyết định hệ thống qua user value, reliability, security và cost.
why_it_matters_en: A senior AI Engineer explains system decisions through user value, reliability, security, and cost.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Senior AI Engineer phải giải thích quyết định hệ thống qua user value, reliability,
  security và cost.'
- Mở Google Rules of Machine Learning, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết design doc cho Production GenAI System, có data flow, SLO, threat model, cost estimate và rollout
  plan.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: A senior AI Engineer explains system decisions through user value, reliability, security,
  and cost.'
- Open Google Rules of Machine Learning, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a design document for a Production GenAI System with data flow, SLOs, threat model, cost
  estimate, and rollout plan.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết design doc cho Production GenAI System, có data flow, SLO, threat model, cost estimate và rollout plan.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Reviewer có thể lần theo từng quyết định, failure mode, metric và kế hoạch rollback trong design doc.
    stretch: Viết thêm một failure test cho security, cost optimization và model selection và giải thích kết quả.
  en:
    task: Write a design document for a Production GenAI System with data flow, SLOs, threat model, cost estimate, and rollout
      plan.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: A reviewer can trace every decision, failure mode, metric, and rollback plan in the design document.
    stretch: Add a failure test for security, cost optimization, and model selection and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích security, cost optimization và model selection cho một đồng đội mới như thế nào?
  - Một assumption nào của security, cost optimization và model selection có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain security, cost optimization, and model selection to a new teammate?
  - Which assumption behind security, cost optimization, and model selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Security, cost optimization, and model selection: inspect one complete path'
  code: "# Topic: Security, cost optimization, and model selection (phase-22-genai-system-design-genai-system-design-3)\n\
    import time\n\ndef timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n    result =\
    \ value * 2\n    return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của security, cost optimization và model selection.
  purpose_en: Illustrate the input-to-output path for security, cost optimization, and model selection.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Đo boundary nhỏ bằng input hợp lệ, output có schema và một chỉ số vận hành quan sát được.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Google Rules of Machine Learning
  url: https://developers.google.com/machine-learning/guides/rules-of-ml
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Full Stack Deep Learning
  url: https://fullstackdeeplearning.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Machine Learning Systems Design
  url: https://github.com/chiphuyen/machine-learning-systems-design
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: SciPy Optimize Tutorial
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  language: en
  purpose_vi: Liên hệ objective, gradient và optimizer với bài toán tối ưu.
  read_vi: Đọc minimize và callback; ghi rõ objective, điểm bắt đầu và điều kiện dừng.
  purpose_en: Connect objectives, gradients, and optimizers to optimization problems.
  read_en: Read minimize and callbacks; record the objective, start point, and stopping rule.
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
- exercise-22-genai-system-design
review_item_ids:
- phase-22-genai-system-design-genai-system-design-3-recall
- phase-22-genai-system-design-genai-system-design-3-application
- phase-22-genai-system-design-genai-system-design-3-debug
- phase-22-genai-system-design-genai-system-design-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của security, cost optimization và model selection.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng security, cost optimization và model selection và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng security, cost optimization và model selection.
- Đánh giá security, cost optimization và model selection bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ security, cost optimization và model selection mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-22-genai-system-design-genai-system-design-4
review_question_vi: Định nghĩa security, cost optimization và model selection bằng lời của bạn. Input, biến đổi và output
  là gì?
review_question_en: Define security, cost optimization, and model selection in your own words. What are the input, transformation
  and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng security, cost optimization và
  model selection. Hãy liên hệ cụ thể với security, cost optimization và model selection trong lesson phase-22-genai-system-design-genai-system-design-3.
review_answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization,
  and model selection is used. Relate it specifically to security, cost optimization, and model selection in lesson phase-22-genai-system-design-genai-system-design-3.
review_cards:
- id: phase-22-genai-system-design-genai-system-design-3-recall
  type: recall
  question_vi: Định nghĩa security, cost optimization và model selection bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define security, cost optimization, and model selection in your own words. What are the input, transformation
    and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng security, cost optimization và model
    selection.
  answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization, and
    model selection is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-22-genai-system-design-genai-system-design-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng security, cost optimization và model selection cho bài toán AI
    Engineer.
  question_en: Write a small code example or design that applies security, cost optimization, and model selection to an AI
    engineering problem.
  answer_vi: Ví dụ cho security, cost optimization và model selection cần có input rõ ràng, output mong đợi và một cách chạy
    hoặc kiểm chứng (phase-22-genai-system-design-genai-system-design-3).
  answer_en: The security, cost optimization, and model selection example should have an explicit input, expected output and
    a way to run or verify it (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-22-genai-system-design-genai-system-design-3-debug
  type: debug
  question_vi: Nếu kết quả của security, cost optimization và model selection sai hoặc metric giảm, bạn sẽ debug theo thứ
    tự nào?
  question_en: If security, cost optimization, and model selection produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: Với security, cost optimization và model selection, kiểm tra input/shape, preprocessing và baseline trước; sau
    đó cô lập lỗi bằng test nhỏ và error analysis (phase-22-genai-system-design-genai-system-design-3).
  answer_en: For security, cost optimization, and model selection, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-22-genai-system-design-genai-system-design-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của security, cost optimization và model selection
    như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of security, cost optimization, and model
    selection?
  answer_vi: Câu trả lời về security, cost optimization và model selection cần nêu giả định, metric/chi phí, giới hạn và cách
    giảm rủi ro trong production (phase-22-genai-system-design-genai-system-design-3).
  answer_en: The answer about security, cost optimization, and model selection should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Security, cost optimization và model selection / Security, cost optimization, and model selection

Security, cost optimization và model selection biến một demo AI thành hệ thống có thể tin cậy. Định nghĩa metric và dataset kiểm thử trước, ghi prompt/model/version/token/latency, rồi phân tích failure theo retrieval, generation, data hoặc infrastructure thay vì chỉ nhìn một điểm số.

## Practice

Viết design doc cho Production GenAI System, có data flow, SLO, threat model, cost estimate và rollout plan.
