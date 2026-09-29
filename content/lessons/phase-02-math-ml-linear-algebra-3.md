---
lesson_id: phase-02-math-ml-linear-algebra-3
phase_id: phase-02-math-ml
module_id: linear-algebra
title_vi: Dot product, norm và distance
title_en: Dot products, norms and distances
summary_vi: Học Dot product, norm và distance qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Dot products, norms and distances through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích dot product, norm và distance bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng dot product, norm và distance.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain dot products, norms and distances with a concrete example.
- Write or adapt a small code example applying dot products, norms and distances.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-linear-algebra-2
- phase-01-python-software-python-core-1
key_terms:
- dot
- product
- norm
- distance
- NumPy
- vector
- gradient
- optimization
- linear-algebra
concept_notes_vi: Dot product, norm và distance là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor;
  kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale
  không làm sai kết luận.
concept_notes_en: Dot product, norm và distance is a foundation for numerical representations. Track tensor shapes, units,
  and axes; verify multiplication on a small example before using a large batch. For similarity, normalize the measure so
  scale differences do not change the conclusion.
why_it_matters_vi: Liên hệ vector, ma trận, khoảng cách và PCA với tensor shape và biểu diễn dữ liệu trong model.
why_it_matters_en: Connect vectors, matrices, distances, and PCA to tensor shapes and model representations.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Liên hệ vector, ma trận, khoảng cách và PCA với tensor shape và biểu diễn dữ liệu trong
  model.'
- Mở NumPy Linear Algebra, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tính tay một ví dụ nhỏ, viết lại bằng NumPy, in shape ở từng bước và giải thích ý nghĩa hình học.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Connect vectors, matrices, distances, and PCA to tensor shapes and model representations.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Work one small example by hand, reimplement it in NumPy, print every shape, and explain the
  geometry.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tính tay một ví dụ nhỏ, viết lại bằng NumPy, in shape ở từng bước và giải thích ý nghĩa hình học.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn phát hiện được shape mismatch trước khi chạy model và biết PCA đang loại bỏ thông tin nào.
    stretch: Viết thêm một failure test cho dot product, norm và distance và giải thích kết quả.
  en:
    task: Work one small example by hand, reimplement it in NumPy, print every shape, and explain the geometry.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can spot a shape mismatch before training and explain which information PCA removes.
    stretch: Add a failure test for dot products, norms and distances and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích dot product, norm và distance cho một đồng đội mới như thế nào?
  - Một assumption nào của dot product, norm và distance có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain dot products, norms and distances to a new teammate?
  - Which assumption behind dot products, norms and distances could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- x · y = Σ_i x_i y_i
- '||x||₂ = √(Σ_i x_i²)'
code_examples:
- language: python
  title: 'Dot products, norms and distances: inspect one complete path'
  code: "# Topic: Dot products, norms and distances (phase-02-math-ml-linear-algebra-3)\nfrom math import sqrt\n\ndef dot(left:\
    \ list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors must\
    \ have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\nprint({'dot':\
    \ dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của dot product, norm và distance.
  purpose_en: Illustrate the input-to-output path for dot products, norms and distances.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay.
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
- exercise-2-linear-algebra
review_item_ids:
- phase-02-math-ml-linear-algebra-3-recall
- phase-02-math-ml-linear-algebra-3-application
- phase-02-math-ml-linear-algebra-3-debug
- phase-02-math-ml-linear-algebra-3-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của dot product, norm và distance.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng dot product, norm và distance và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng dot product, norm và distance.
- Đánh giá dot product, norm và distance bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ dot product, norm và distance mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-02-math-ml-linear-algebra-4
- phase-02-math-ml-calculus-1
review_question_vi: Định nghĩa dot product, norm và distance bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define dot products, norms and distances in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dot product, norm và distance.
  Hãy liên hệ cụ thể với dot product, norm và distance trong lesson phase-02-math-ml-linear-algebra-3.
review_answer_en: A strong answer names the input, transformation, output and the context where dot products, norms and distances
  is used. Relate it specifically to dot products, norms and distances in lesson phase-02-math-ml-linear-algebra-3.
review_cards:
- id: phase-02-math-ml-linear-algebra-3-recall
  type: recall
  question_vi: Định nghĩa dot product, norm và distance bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define dot products, norms and distances in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dot product, norm và distance.
  answer_en: A strong answer names the input, transformation, output and the context where dot products, norms and distances
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-linear-algebra-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng dot product, norm và distance cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies dot products, norms and distances to an AI engineering problem.
  answer_vi: Ví dụ cho dot product, norm và distance cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-02-math-ml-linear-algebra-3).
  answer_en: The dot products, norms and distances example should have an explicit input, expected output and a way to run
    or verify it (phase-02-math-ml-linear-algebra-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-linear-algebra-3-debug
  type: debug
  question_vi: Nếu kết quả của dot product, norm và distance sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If dot products, norms and distances produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với dot product, norm và distance, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-02-math-ml-linear-algebra-3).
  answer_en: For dot products, norms and distances, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-02-math-ml-linear-algebra-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-linear-algebra-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của dot product, norm và distance như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of dot products, norms and distances?
  answer_vi: Câu trả lời về dot product, norm và distance cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-02-math-ml-linear-algebra-3).
  answer_en: The answer about dot products, norms and distances should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-02-math-ml-linear-algebra-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dot product, norm và distance / Dot products, norms and distances

Dot product, norm và distance là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai kết luận.

## Practice

Tính tay một ví dụ nhỏ, viết lại bằng NumPy, in shape ở từng bước và giải thích ý nghĩa hình học.
