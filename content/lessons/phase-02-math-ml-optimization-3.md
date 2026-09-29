---
lesson_id: phase-02-math-ml-optimization-3
phase_id: phase-02-math-ml
module_id: optimization
title_vi: Gradient descent
title_en: Gradient descent
summary_vi: Học Gradient descent qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Gradient descent through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích gradient descent bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng gradient descent.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain gradient descent with a concrete example.
- Write or adapt a small code example applying gradient descent.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-optimization-2
- phase-01-python-software-python-core-1
key_terms:
- gradient
- descent
- NumPy
- vector
- optimization
concept_notes_vi: Gradient descent cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên
  input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định
  bước cập nhật có ổn định hay không.
concept_notes_en: Gradient descent describes how an output changes when a parameter changes. Use finite differences on a small
  input to check a gradient, then trace the chain rule through each transformation; gradient sign and scale determine whether
  updates are stable.
why_it_matters_vi: Hiểu objective, loss landscape, regularization và optimizer để biết model đang tối ưu điều gì.
why_it_matters_en: Understand objectives, loss landscapes, regularization, and optimizers so you know what a model is optimizing.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Hiểu objective, loss landscape, regularization và optimizer để biết model đang tối ưu
  điều gì.'
- Mở NumPy Linear Algebra, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Cài linear/logistic regression tối giản, vẽ loss curve và so sánh learning rate, SGD, momentum và Adam.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Understand objectives, loss landscapes, regularization, and optimizers so you know what
  a model is optimizing.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Implement minimal linear/logistic regression, plot loss curves, and compare learning rate,
  SGD, momentum, and Adam.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Cài linear/logistic regression tối giản, vẽ loss curve và so sánh learning rate, SGD, momentum và Adam.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn dự đoán được dấu hiệu underfit, overfit, exploding update và biết chọn metric để kiểm tra.
    stretch: Viết thêm một failure test cho gradient descent và giải thích kết quả.
  en:
    task: Implement minimal linear/logistic regression, plot loss curves, and compare learning rate, SGD, momentum, and Adam.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can predict signs of underfitting, overfitting, exploding updates, and choose a metric to verify them.
    stretch: Add a failure test for gradient descent and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích gradient descent cho một đồng đội mới như thế nào?
  - Một assumption nào của gradient descent có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain gradient descent to a new teammate?
  - Which assumption behind gradient descent could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Gradient descent: inspect one complete path'
  code: "# Topic: Gradient descent (phase-02-math-ml-optimization-3)\ndef finite_difference(f, x, step=1e-5):\n    if step\
    \ <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step)) / (2 * step)\n\nprint(round(finite_difference(lambda\
    \ value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của gradient descent.
  purpose_en: Illustrate the input-to-output path for gradient descent.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: So sánh đạo hàm giải tích với finite difference và kiểm tra bước h dương, đủ nhỏ.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: NumPy Linear Algebra
  url: https://numpy.org/doc/stable/reference/routines.linalg.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SciPy Optimize
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Mathematical Foundations
  url: https://scikit-learn.org/stable/user_guide.html
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
- exercise-2-optimization
review_item_ids:
- phase-02-math-ml-optimization-3-recall
- phase-02-math-ml-optimization-3-application
- phase-02-math-ml-optimization-3-debug
- phase-02-math-ml-optimization-3-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của gradient descent.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng gradient descent và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng gradient descent.
- Đánh giá gradient descent bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ gradient descent mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-02-math-ml-optimization-4
- phase-03-classical-ml-ml-framing-1
review_question_vi: Định nghĩa gradient descent bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define gradient descent in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gradient descent. Hãy liên hệ cụ
  thể với gradient descent trong lesson phase-02-math-ml-optimization-3.
review_answer_en: A strong answer names the input, transformation, output and the context where gradient descent is used.
  Relate it specifically to gradient descent in lesson phase-02-math-ml-optimization-3.
review_cards:
- id: phase-02-math-ml-optimization-3-recall
  type: recall
  question_vi: Định nghĩa gradient descent bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define gradient descent in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gradient descent.
  answer_en: A strong answer names the input, transformation, output and the context where gradient descent is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-optimization-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng gradient descent cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies gradient descent to an AI engineering problem.
  answer_vi: Ví dụ cho gradient descent cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-02-math-ml-optimization-3).
  answer_en: The gradient descent example should have an explicit input, expected output and a way to run or verify it (phase-02-math-ml-optimization-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-optimization-3-debug
  type: debug
  question_vi: Nếu kết quả của gradient descent sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If gradient descent produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với gradient descent, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-02-math-ml-optimization-3).
  answer_en: For gradient descent, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-02-math-ml-optimization-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-optimization-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của gradient descent như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of gradient descent?
  answer_vi: Câu trả lời về gradient descent cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-02-math-ml-optimization-3).
  answer_en: The answer about gradient descent should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-02-math-ml-optimization-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Gradient descent / Gradient descent

Gradient descent cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định bước cập nhật có ổn định hay không.

## Practice

Cài linear/logistic regression tối giản, vẽ loss curve và so sánh learning rate, SGD, momentum và Adam.
