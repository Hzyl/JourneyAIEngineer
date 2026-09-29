---
lesson_id: phase-02-math-ml-linear-algebra-2
phase_id: phase-02-math-ml
module_id: linear-algebra
title_vi: Matrix multiplication
title_en: Matrix multiplication
summary_vi: Học Matrix multiplication qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Matrix multiplication through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích matrix multiplication bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng matrix multiplication.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain matrix multiplication with a concrete example.
- Write or adapt a small code example applying matrix multiplication.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-linear-algebra-1
- phase-01-python-software-python-core-1
key_terms:
- matrix
- multiplication
- NumPy
- vector
- gradient
- optimization
- linear-algebra
concept_notes_vi: Matrix multiplication là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm
  tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không
  làm sai kết luận.
concept_notes_en: Matrix multiplication is a foundation for numerical representations. Track tensor shapes, units, and axes;
  verify multiplication on a small example before using a large batch. For similarity, normalize the measure so scale differences
  do not change the conclusion.
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
    stretch: Viết thêm một failure test cho matrix multiplication và giải thích kết quả.
  en:
    task: Work one small example by hand, reimplement it in NumPy, print every shape, and explain the geometry.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can spot a shape mismatch before training and explain which information PCA removes.
    stretch: Add a failure test for matrix multiplication and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích matrix multiplication cho một đồng đội mới như thế nào?
  - Một assumption nào của matrix multiplication có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain matrix multiplication to a new teammate?
  - Which assumption behind matrix multiplication could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- (AB)_{ij} = Σ_k A_{ik}B_{kj}
code_examples:
- language: python
  title: 'Matrix multiplication: inspect one complete path'
  code: "# Topic: Matrix multiplication (phase-02-math-ml-linear-algebra-2)\nfrom math import sqrt\n\ndef dot(left: list[float],\
    \ right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors must have equal length')\n\
    \    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\nprint({'dot': dot(left,\
    \ right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của matrix multiplication.
  purpose_en: Illustrate the input-to-output path for matrix multiplication.
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
- title: NumPy Quickstart
  url: https://numpy.org/doc/stable/user/quickstart.html
  language: en
  purpose_vi: Thực hành array, shape và phép toán vector bằng NumPy.
  read_vi: Đọc array shape, indexing và broadcasting rồi in shape ở mỗi bước.
  purpose_en: Practice arrays, shapes, and vector operations with NumPy.
  read_en: Read array shapes, indexing, and broadcasting; print every shape.
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
- exercise-2-linear-algebra
review_item_ids:
- phase-02-math-ml-linear-algebra-2-recall
- phase-02-math-ml-linear-algebra-2-application
- phase-02-math-ml-linear-algebra-2-debug
- phase-02-math-ml-linear-algebra-2-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của matrix multiplication.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng matrix multiplication và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng matrix multiplication.
- Đánh giá matrix multiplication bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ matrix multiplication mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-02-math-ml-linear-algebra-3
- phase-02-math-ml-linear-algebra-4
review_question_vi: Định nghĩa matrix multiplication bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define matrix multiplication in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng matrix multiplication. Hãy liên
  hệ cụ thể với matrix multiplication trong lesson phase-02-math-ml-linear-algebra-2.
review_answer_en: A strong answer names the input, transformation, output and the context where matrix multiplication is used.
  Relate it specifically to matrix multiplication in lesson phase-02-math-ml-linear-algebra-2.
review_cards:
- id: phase-02-math-ml-linear-algebra-2-recall
  type: recall
  question_vi: Định nghĩa matrix multiplication bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define matrix multiplication in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng matrix multiplication.
  answer_en: A strong answer names the input, transformation, output and the context where matrix multiplication is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-linear-algebra-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng matrix multiplication cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies matrix multiplication to an AI engineering problem.
  answer_vi: Ví dụ cho matrix multiplication cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-02-math-ml-linear-algebra-2).
  answer_en: The matrix multiplication example should have an explicit input, expected output and a way to run or verify it
    (phase-02-math-ml-linear-algebra-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-linear-algebra-2-debug
  type: debug
  question_vi: Nếu kết quả của matrix multiplication sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If matrix multiplication produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với matrix multiplication, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-02-math-ml-linear-algebra-2).
  answer_en: For matrix multiplication, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-02-math-ml-linear-algebra-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-linear-algebra-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của matrix multiplication như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of matrix multiplication?
  answer_vi: Câu trả lời về matrix multiplication cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-02-math-ml-linear-algebra-2).
  answer_en: The answer about matrix multiplication should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-02-math-ml-linear-algebra-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Matrix multiplication / Matrix multiplication

Matrix multiplication là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai kết luận.

## Practice

Tính tay một ví dụ nhỏ, viết lại bằng NumPy, in shape ở từng bước và giải thích ý nghĩa hình học.
