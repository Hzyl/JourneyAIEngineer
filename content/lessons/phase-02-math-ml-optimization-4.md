---
lesson_id: phase-02-math-ml-optimization-4
phase_id: phase-02-math-ml
module_id: optimization
title_vi: SGD, momentum và Adam
title_en: SGD, momentum and Adam
summary_vi: SGD ước lượng gradient từ một phần dữ liệu; momentum sử dụng lịch sử cập nhật; Adam điều chỉnh bước
  theo các thống kê gradient.
summary_en: Learn SGD, momentum and Adam through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain sgd, momentum and adam with a concrete example.
- Write or adapt a small code example applying sgd, momentum and adam.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-optimization-3
- phase-01-python-software-python-core-1
key_terms:
- sgd
- momentum
- adam
- NumPy
- vector
- gradient
- optimization
concept_notes_vi: SGD ước lượng gradient từ một phần dữ liệu; momentum sử dụng lịch sử cập nhật; Adam điều chỉnh
  bước theo các thống kê gradient. Cần so sánh trên cùng dữ liệu và ngân sách huấn luyện.
concept_notes_en: SGD, momentum và Adam is a concept in the optimization module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Xác định hàm mục tiêu và cách cập nhật để hiểu mô hình đang học điều gì.
why_it_matters_en: Understand objectives, loss landscapes, regularization, and optimizers so you know what a model
  is optimizing.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “SGD, momentum and Adam” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.
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
    task: 'So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.


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
    stretch: Add a failure test for sgd, momentum and adam and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “SGD, momentum và Adam” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain sgd, momentum and adam to a new teammate?
  - Which assumption behind sgd, momentum and adam could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- g_t = ∇θ J(θ_t)
- m_t = β₁m_{t−1} + (1−β₁)g_t
- v_t = β₂v_{t−1} + (1−β₂)g_t²
code_examples:
- language: python
  title: 'SGD, momentum and Adam: inspect one complete path'
  code: '# Topic: SGD, momentum and Adam (phase-02-math-ml-optimization-4)

    parameter = 2.0

    gradient = 4.0

    learning_rate = 0.1

    momentum = 0.9

    velocity = 0.0

    velocity = momentum * velocity + gradient

    parameter -= learning_rate * velocity

    print({''updated_parameter'': parameter, ''velocity'': velocity})'
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for sgd, momentum and adam.
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
- phase-02-math-ml-optimization-4-recall
- phase-02-math-ml-optimization-4-application
- phase-02-math-ml-optimization-4-debug
- phase-02-math-ml-optimization-4-interview
estimated_minutes: 45
completion_checklist:
- So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
common_mistakes:
- Đổi tốc độ học, dữ liệu và số bước cùng lúc rồi quy kết nguyên nhân.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-ml-framing-1
- phase-03-classical-ml-ml-framing-2
review_question_vi: Nội dung cốt lõi của “SGD, momentum và Adam” là gì?
review_question_en: Define sgd, momentum and adam in your own words. What are the input, transformation and output?
review_answer_vi: SGD ước lượng gradient từ một phần dữ liệu; momentum sử dụng lịch sử cập nhật; Adam điều chỉnh
  bước theo các thống kê gradient. Cần so sánh trên cùng dữ liệu và ngân sách huấn luyện.
review_answer_en: A strong answer names the input, transformation, output and the context where sgd, momentum and
  adam is used. Relate it specifically to sgd, momentum and adam in lesson phase-02-math-ml-optimization-4.
review_cards:
- id: phase-02-math-ml-optimization-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “SGD, momentum và Adam” là gì?
  question_en: Define sgd, momentum and adam in your own words. What are the input, transformation and output?
  answer_vi: SGD ước lượng gradient từ một phần dữ liệu; momentum sử dụng lịch sử cập nhật; Adam điều chỉnh bước
    theo các thống kê gradient. Cần so sánh trên cùng dữ liệu và ngân sách huấn luyện.
  answer_en: A strong answer names the input, transformation, output and the context where sgd, momentum and adam
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-optimization-4-application
  type: application
  question_vi: So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.
  question_en: Write a small code example or design that applies sgd, momentum and adam to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu”, cần lưu: cấu hình
    thí nghiệm và bảng hoặc đồ thị hàm mục tiêu. So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.'
  answer_en: The sgd, momentum and adam example should have an explicit input, expected output and a way to run
    or verify it (phase-02-math-ml-optimization-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-optimization-4-debug
  type: debug
  question_vi: Khi làm bài “SGD, momentum và Adam”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If sgd, momentum and adam produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “SGD, momentum và Adam”, lỗi cần tránh là: đổi tốc độ học, dữ liệu và số bước cùng lúc rồi
    quy kết nguyên nhân. So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For sgd, momentum and adam, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-02-math-ml-optimization-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-optimization-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “SGD, momentum và Adam” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of sgd, momentum and adam?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about sgd, momentum and adam should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-02-math-ml-optimization-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# SGD, momentum và Adam / SGD, momentum and Adam

SGD ước lượng gradient từ một phần dữ liệu; momentum sử dụng lịch sử cập nhật; Adam điều chỉnh bước theo các thống kê gradient. Cần so sánh trên cùng dữ liệu và ngân sách huấn luyện.

## Thực hành

So sánh đồ thị mất mát của các bộ tối ưu với cùng cách chia dữ liệu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cài đặt hồi quy tuyến tính hoặc logistic tối giản; vẽ đồ thị mất mát, so sánh tốc độ học, SGD, momentum và Adam.
