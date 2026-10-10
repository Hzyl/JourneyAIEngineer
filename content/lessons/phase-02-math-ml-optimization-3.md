---
lesson_id: phase-02-math-ml-optimization-3
phase_id: phase-02-math-ml
module_id: optimization
title_vi: Hạ gradient
title_en: Gradient descent
summary_vi: Hạ gradient cập nhật tham số theo hướng ngược gradient của hàm mục tiêu.
summary_en: Learn Gradient descent through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Hạ gradient cập nhật tham số theo hướng ngược gradient của hàm mục tiêu. Tốc độ học quá lớn có
  thể khiến cập nhật dao động; quá nhỏ có thể làm quá trình tối ưu tiến triển chậm.
concept_notes_en: Gradient descent describes how an output changes when a parameter changes. Use finite differences
  on a small input to check a gradient, then trace the chain rule through each transformation; gradient sign and
  scale determine whether updates are stable.
why_it_matters_vi: Xác định hàm mục tiêu và cách cập nhật để hiểu mô hình đang học điều gì.
why_it_matters_en: Understand objectives, loss landscapes, regularization, and optimizers so you know what a model
  is optimizing.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Gradient descent” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Understand objectives, loss landscapes, regularization, and optimizers so
  you know what a model is optimizing.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Implement minimal linear/logistic regression, plot loss curves, and compare learning
  rate, SGD, momentum, and Adam.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cài đặt hồi quy tuyến tính hoặc logistic
      tối giản; vẽ đồ thị mất mát, so sánh tốc độ học, SGD, momentum và Adam.'
    deliverables:
    - Cấu hình thí nghiệm và bảng hoặc đồ thị hàm mục tiêu
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Implement minimal linear/logistic regression, plot loss curves, and compare learning rate, SGD, momentum,
      and Adam.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can predict signs of underfitting, overfitting, exploding updates, and choose a metric to verify
      them.
    stretch: Add a failure test for gradient descent and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Hạ gradient” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain gradient descent to a new teammate?
  - Which assumption behind gradient descent could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Gradient descent: inspect one complete path'
  code: "# Topic: Gradient descent (phase-02-math-ml-optimization-3)\ndef finite_difference(f, x, step=1e-5):\n\
    \    if step <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step))\
    \ / (2 * step)\n\nprint(round(finite_difference(lambda value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for gradient descent.
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
- exercise-2-optimization
review_item_ids:
- phase-02-math-ml-optimization-3-recall
- phase-02-math-ml-optimization-3-application
- phase-02-math-ml-optimization-3-debug
- phase-02-math-ml-optimization-3-interview
estimated_minutes: 45
completion_checklist:
- Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
common_mistakes:
- Đổi tốc độ học, dữ liệu và số bước cùng lúc rồi quy kết nguyên nhân.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-optimization-4
- phase-03-classical-ml-ml-framing-1
review_question_vi: Nội dung cốt lõi của “Hạ gradient” là gì?
review_question_en: Define gradient descent in your own words. What are the input, transformation and output?
review_answer_vi: Hạ gradient cập nhật tham số theo hướng ngược gradient của hàm mục tiêu. Tốc độ học quá lớn có
  thể khiến cập nhật dao động; quá nhỏ có thể làm quá trình tối ưu tiến triển chậm.
review_answer_en: A strong answer names the input, transformation, output and the context where gradient descent
  is used. Relate it specifically to gradient descent in lesson phase-02-math-ml-optimization-3.
review_cards:
- id: phase-02-math-ml-optimization-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Hạ gradient” là gì?
  question_en: Define gradient descent in your own words. What are the input, transformation and output?
  answer_vi: Hạ gradient cập nhật tham số theo hướng ngược gradient của hàm mục tiêu. Tốc độ học quá lớn có thể
    khiến cập nhật dao động; quá nhỏ có thể làm quá trình tối ưu tiến triển chậm.
  answer_en: A strong answer names the input, transformation, output and the context where gradient descent is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-optimization-3-application
  type: application
  question_vi: Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.
  question_en: Write a small code example or design that applies gradient descent to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học”, cần lưu: cấu
    hình thí nghiệm và bảng hoặc đồ thị hàm mục tiêu. So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh
    giá.'
  answer_en: The gradient descent example should have an explicit input, expected output and a way to run or verify
    it (phase-02-math-ml-optimization-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-optimization-3-debug
  type: debug
  question_vi: Khi làm bài “Hạ gradient”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If gradient descent produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Hạ gradient”, lỗi cần tránh là: đổi tốc độ học, dữ liệu và số bước cùng lúc rồi quy kết
    nguyên nhân. So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For gradient descent, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-02-math-ml-optimization-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-optimization-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Hạ gradient” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of gradient descent?
  answer_vi: Bắt đầu từ nhiệm vụ “Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about gradient descent should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-02-math-ml-optimization-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Hạ gradient / Gradient descent

Hạ gradient cập nhật tham số theo hướng ngược gradient của hàm mục tiêu. Tốc độ học quá lớn có thể khiến cập nhật dao động; quá nhỏ có thể làm quá trình tối ưu tiến triển chậm.

## Thực hành

Theo dõi giá trị hàm mục tiêu khi chạy hạ gradient với hai tốc độ học.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cài đặt hồi quy tuyến tính hoặc logistic tối giản; vẽ đồ thị mất mát, so sánh tốc độ học, SGD, momentum và Adam.
