---
lesson_id: phase-02-math-ml-optimization-1
phase_id: phase-02-math-ml
module_id: optimization
title_vi: Bias, variance và overfitting
title_en: Bias, variance and overfitting
summary_vi: Học Bias, variance và overfitting qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Bias, variance and overfitting through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích bias, variance và overfitting bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng bias, variance và overfitting.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain bias, variance and overfitting with a concrete example.
- Write or adapt a small code example applying bias, variance and overfitting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-probability-4
- phase-01-python-software-python-core-1
key_terms:
- bias
- variance
- overfitting
- NumPy
- vector
- gradient
- optimization
concept_notes_vi: Bias, variance và overfitting giúp định lượng bất định thay vì chỉ đưa một dự đoán. Phân biệt xác suất điều
  kiện với xác suất biên, population với sample, và nêu giả định của phân phối hoặc khoảng tin cậy trước khi diễn giải kết
  quả.
concept_notes_en: Bias, variance và overfitting quantifies uncertainty instead of returning only a prediction. Distinguish
  conditional from marginal probability, population from sample, and state distribution or confidence-interval assumptions
  before interpreting a result.
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
    stretch: Viết thêm một failure test cho bias, variance và overfitting và giải thích kết quả.
  en:
    task: Implement minimal linear/logistic regression, plot loss curves, and compare learning rate, SGD, momentum, and Adam.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can predict signs of underfitting, overfitting, exploding updates, and choose a metric to verify them.
    stretch: Add a failure test for bias, variance and overfitting and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích bias, variance và overfitting cho một đồng đội mới như thế nào?
  - Một assumption nào của bias, variance và overfitting có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain bias, variance and overfitting to a new teammate?
  - Which assumption behind bias, variance and overfitting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- E[(ŷ − y)²] = Bias² + Variance + Noise
- Var(X) = E[(X − E[X])²]
code_examples:
- language: python
  title: 'Bias, variance and overfitting: inspect one complete path'
  code: '# Topic: Bias, variance and overfitting (phase-02-math-ml-optimization-1)

    from collections import Counter


    samples = [''pass'', ''pass'', ''fail'', ''pass'']

    counts = Counter(samples)

    probability_pass = counts[''pass''] / len(samples)

    print({''counts'': dict(counts), ''p_pass'': probability_pass})'
  status: runnable
  purpose_vi: Minh họa đường đi input → output của bias, variance và overfitting.
  purpose_en: Illustrate the input-to-output path for bias, variance and overfitting.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách mẫu quan sát khỏi ước lượng; luôn nêu kích thước mẫu và giả định độc lập.
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
- title: SciPy Statistics Reference
  url: https://docs.scipy.org/doc/scipy/reference/stats.html
  language: en
  purpose_vi: Tra cứu phân phối và phép thống kê để kiểm chứng mô phỏng.
  read_vi: Chọn một distribution, ghi tham số và so sánh lý thuyết với sample.
  purpose_en: Reference distributions and statistics for simulation checks.
  read_en: Choose one distribution, record parameters, and compare theory with samples.
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
- exercise-2-optimization
review_item_ids:
- phase-02-math-ml-optimization-1-recall
- phase-02-math-ml-optimization-1-application
- phase-02-math-ml-optimization-1-debug
- phase-02-math-ml-optimization-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của bias, variance và overfitting.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng bias, variance và overfitting và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng bias, variance và overfitting.
- Đánh giá bias, variance và overfitting bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ bias, variance và overfitting mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-02-math-ml-optimization-2
- phase-02-math-ml-optimization-3
review_question_vi: Định nghĩa bias, variance và overfitting bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define bias, variance and overfitting in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng bias, variance và overfitting.
  Hãy liên hệ cụ thể với bias, variance và overfitting trong lesson phase-02-math-ml-optimization-1.
review_answer_en: A strong answer names the input, transformation, output and the context where bias, variance and overfitting
  is used. Relate it specifically to bias, variance and overfitting in lesson phase-02-math-ml-optimization-1.
review_cards:
- id: phase-02-math-ml-optimization-1-recall
  type: recall
  question_vi: Định nghĩa bias, variance và overfitting bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define bias, variance and overfitting in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng bias, variance và overfitting.
  answer_en: A strong answer names the input, transformation, output and the context where bias, variance and overfitting
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-optimization-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng bias, variance và overfitting cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies bias, variance and overfitting to an AI engineering problem.
  answer_vi: Ví dụ cho bias, variance và overfitting cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-02-math-ml-optimization-1).
  answer_en: The bias, variance and overfitting example should have an explicit input, expected output and a way to run or
    verify it (phase-02-math-ml-optimization-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-optimization-1-debug
  type: debug
  question_vi: Nếu kết quả của bias, variance và overfitting sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If bias, variance and overfitting produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với bias, variance và overfitting, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-02-math-ml-optimization-1).
  answer_en: For bias, variance and overfitting, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-02-math-ml-optimization-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-optimization-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của bias, variance và overfitting như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of bias, variance and overfitting?
  answer_vi: Câu trả lời về bias, variance và overfitting cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-02-math-ml-optimization-1).
  answer_en: The answer about bias, variance and overfitting should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-02-math-ml-optimization-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bias, variance và overfitting / Bias, variance and overfitting

Bias, variance và overfitting giúp định lượng bất định thay vì chỉ đưa một dự đoán. Phân biệt xác suất điều kiện với xác suất biên, population với sample, và nêu giả định của phân phối hoặc khoảng tin cậy trước khi diễn giải kết quả.

## Practice

Cài linear/logistic regression tối giản, vẽ loss curve và so sánh learning rate, SGD, momentum và Adam.
