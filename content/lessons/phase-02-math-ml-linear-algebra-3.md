---
lesson_id: phase-02-math-ml-linear-algebra-3
phase_id: phase-02-math-ml
module_id: linear-algebra
title_vi: Tích vô hướng, chuẩn và khoảng cách
title_en: Dot products, norms and distances
summary_vi: Tích vô hướng kết hợp các thành phần tương ứng; chuẩn đo độ lớn của vector; khoảng cách đo mức chênh
  lệch giữa hai vector.
summary_en: Learn Dot products, norms and distances through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.
- Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Tích vô hướng kết hợp các thành phần tương ứng; chuẩn đo độ lớn của vector; khoảng cách đo mức
  chênh lệch giữa hai vector. Chọn phép đo phù hợp với đơn vị và ý nghĩa dữ liệu.
concept_notes_en: Dot product, norm và distance is a foundation for numerical representations. Track tensor shapes,
  units, and axes; verify multiplication on a small example before using a large batch. For similarity, normalize
  the measure so scale differences do not change the conclusion.
why_it_matters_vi: Liên hệ vector, ma trận, khoảng cách và PCA với biểu diễn dữ liệu trong mô hình.
why_it_matters_en: Connect vectors, matrices, distances, and PCA to tensor shapes and model representations.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Dot products, norms and distances” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.
- Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Connect vectors, matrices, distances, and PCA to tensor shapes and model representations.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Work one small example by hand, reimplement it in NumPy, print every shape, and explain
  the geometry.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tính tay ví dụ nhỏ, đối chiếu bằng NumPy,
      ghi kích thước từng bước và giải thích ý nghĩa hình học.'
    deliverables:
    - Phép tính hoặc hình minh họa có kích thước và đơn vị rõ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
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
  - Bạn sẽ giải thích nội dung “Tích vô hướng, chuẩn và khoảng cách” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
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
  code: "# Topic: Dot products, norms and distances (phase-02-math-ml-linear-algebra-3)\nfrom math import sqrt\n\
    \ndef dot(left: list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors\
    \ must have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright =\
    \ [0.5, 3.0]\nprint({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for dot products, norms and distances.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: NumPy Linear Algebra
  url: https://numpy.org/doc/stable/reference/routines.linalg.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SciPy Optimize
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Mathematical Foundations
  url: https://scikit-learn.org/stable/user_guide.html
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
- exercise-2-linear-algebra
review_item_ids:
- phase-02-math-ml-linear-algebra-3-recall
- phase-02-math-ml-linear-algebra-3-application
- phase-02-math-ml-linear-algebra-3-debug
- phase-02-math-ml-linear-algebra-3-interview
estimated_minutes: 45
completion_checklist:
- Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.
- Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả.
common_mistakes:
- Thực hiện phép toán trước khi kiểm tra kích thước và ý nghĩa từng chiều.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-linear-algebra-4
- phase-02-math-ml-calculus-1
review_question_vi: Nội dung cốt lõi của “Tích vô hướng, chuẩn và khoảng cách” là gì?
review_question_en: Define dot products, norms and distances in your own words. What are the input, transformation
  and output?
review_answer_vi: Tích vô hướng kết hợp các thành phần tương ứng; chuẩn đo độ lớn của vector; khoảng cách đo mức
  chênh lệch giữa hai vector. Chọn phép đo phù hợp với đơn vị và ý nghĩa dữ liệu.
review_answer_en: A strong answer names the input, transformation, output and the context where dot products, norms
  and distances is used. Relate it specifically to dot products, norms and distances in lesson phase-02-math-ml-linear-algebra-3.
review_cards:
- id: phase-02-math-ml-linear-algebra-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tích vô hướng, chuẩn và khoảng cách” là gì?
  question_en: Define dot products, norms and distances in your own words. What are the input, transformation and
    output?
  answer_vi: Tích vô hướng kết hợp các thành phần tương ứng; chuẩn đo độ lớn của vector; khoảng cách đo mức chênh
    lệch giữa hai vector. Chọn phép đo phù hợp với đơn vị và ý nghĩa dữ liệu.
  answer_en: A strong answer names the input, transformation, output and the context where dot products, norms and
    distances is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-linear-algebra-3-application
  type: application
  question_vi: Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.
  question_en: Write a small code example or design that applies dot products, norms and distances to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ”, cần lưu: phép tính hoặc
    hình minh họa có kích thước và đơn vị rõ. Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả.'
  answer_en: The dot products, norms and distances example should have an explicit input, expected output and a
    way to run or verify it (phase-02-math-ml-linear-algebra-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-linear-algebra-3-debug
  type: debug
  question_vi: Khi làm bài “Tích vô hướng, chuẩn và khoảng cách”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If dot products, norms and distances produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Tích vô hướng, chuẩn và khoảng cách”, lỗi cần tránh là: thực hiện phép toán trước khi kiểm
    tra kích thước và ý nghĩa từng chiều. Đối chiếu tính tay với NumPy và giải thích ý nghĩa của kết quả. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For dot products, norms and distances, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-02-math-ml-linear-algebra-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-linear-algebra-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tích vô hướng, chuẩn và khoảng cách” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of dot products, norms and distances?
  answer_vi: Bắt đầu từ nhiệm vụ “Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about dot products, norms and distances should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-02-math-ml-linear-algebra-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tích vô hướng, chuẩn và khoảng cách / Dot products, norms and distances

Tích vô hướng kết hợp các thành phần tương ứng; chuẩn đo độ lớn của vector; khoảng cách đo mức chênh lệch giữa hai vector. Chọn phép đo phù hợp với đơn vị và ý nghĩa dữ liệu.

## Thực hành

Tính tích vô hướng, chuẩn và khoảng cách cho hai vector nhỏ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tính tay ví dụ nhỏ, đối chiếu bằng NumPy, ghi kích thước từng bước và giải thích ý nghĩa hình học.
