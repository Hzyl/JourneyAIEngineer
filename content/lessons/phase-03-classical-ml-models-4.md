---
lesson_id: phase-03-classical-ml-models-4
phase_id: phase-03-classical-ml
module_id: models
title_vi: Gradient boosting
title_en: Gradient boosting
summary_vi: Học Gradient boosting qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Gradient boosting through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích gradient boosting bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng gradient boosting.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain gradient boosting with a concrete example.
- Write or adapt a small code example applying gradient boosting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-3
- phase-02-math-ml-linear-algebra-1
key_terms:
- gradient
- boosting
- NumPy
- vector
- optimization
- models
concept_notes_vi: Gradient boosting cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên
  input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định
  bước cập nhật có ổn định hay không.
concept_notes_en: Gradient boosting describes how an output changes when a parameter changes. Use finite differences on a
  small input to check a gradient, then trace the chain rule through each transformation; gradient sign and scale determine
  whether updates are stable.
why_it_matters_vi: So sánh model bằng giả định, độ phức tạp và error pattern thay vì chạy nhiều model không có baseline.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without a baseline.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: So sánh model bằng giả định, độ phức tạp và error pattern thay vì chạy nhiều model không
  có baseline.'
- Mở scikit-learn User Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng
  model.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Compare models by assumptions, complexity, and error patterns instead of trying many
  models without a baseline.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Train a simple model first, add trees/boosting, and record metrics plus a representative error
  for each model.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng model.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được trade-off giữa interpretability, latency, data size và quality.
    stretch: Viết thêm một failure test cho gradient boosting và giải thích kết quả.
  en:
    task: Train a simple model first, add trees/boosting, and record metrics plus a representative error for each model.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain trade-offs among interpretability, latency, data size, and quality.
    stretch: Add a failure test for gradient boosting and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích gradient boosting cho một đồng đội mới như thế nào?
  - Một assumption nào của gradient boosting có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain gradient boosting to a new teammate?
  - Which assumption behind gradient boosting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Gradient boosting: inspect one complete path'
  code: "# Topic: Gradient boosting (phase-03-classical-ml-models-4)\ndef finite_difference(f, x, step=1e-5):\n    if step\
    \ <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step)) / (2 * step)\n\nprint(round(finite_difference(lambda\
    \ value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của gradient boosting.
  purpose_en: Illustrate the input-to-output path for gradient boosting.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: So sánh đạo hàm giải tích với finite difference và kiểm tra bước h dương, đủ nhỏ.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
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
- exercise-3-models
review_item_ids:
- phase-03-classical-ml-models-4-recall
- phase-03-classical-ml-models-4-application
- phase-03-classical-ml-models-4-debug
- phase-03-classical-ml-models-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của gradient boosting.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng gradient boosting và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng gradient boosting.
- Đánh giá gradient boosting bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ gradient boosting mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-03-classical-ml-preprocessing-1
- phase-03-classical-ml-preprocessing-2
review_question_vi: Định nghĩa gradient boosting bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define gradient boosting in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gradient boosting. Hãy liên hệ
  cụ thể với gradient boosting trong lesson phase-03-classical-ml-models-4.
review_answer_en: A strong answer names the input, transformation, output and the context where gradient boosting is used.
  Relate it specifically to gradient boosting in lesson phase-03-classical-ml-models-4.
review_cards:
- id: phase-03-classical-ml-models-4-recall
  type: recall
  question_vi: Định nghĩa gradient boosting bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define gradient boosting in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gradient boosting.
  answer_en: A strong answer names the input, transformation, output and the context where gradient boosting is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-models-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng gradient boosting cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies gradient boosting to an AI engineering problem.
  answer_vi: Ví dụ cho gradient boosting cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-03-classical-ml-models-4).
  answer_en: The gradient boosting example should have an explicit input, expected output and a way to run or verify it (phase-03-classical-ml-models-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-models-4-debug
  type: debug
  question_vi: Nếu kết quả của gradient boosting sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If gradient boosting produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với gradient boosting, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-03-classical-ml-models-4).
  answer_en: For gradient boosting, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-03-classical-ml-models-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-models-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của gradient boosting như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of gradient boosting?
  answer_vi: Câu trả lời về gradient boosting cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-03-classical-ml-models-4).
  answer_en: The answer about gradient boosting should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-03-classical-ml-models-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Gradient boosting / Gradient boosting

Gradient boosting cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định bước cập nhật có ổn định hay không.

## Practice

Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng model.
