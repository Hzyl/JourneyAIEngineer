---
lesson_id: phase-04-deep-learning-generalization-2
phase_id: phase-04-deep-learning
module_id: generalization
title_vi: Dropout và chuẩn hóa theo lô
title_en: Dropout and batch normalization
summary_vi: Dropout bỏ ngẫu nhiên một phần tín hiệu khi huấn luyện; chuẩn hóa theo lô dùng thống kê để biến đổi
  kích hoạt.
summary_en: Learn Dropout and batch normalization through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.
- Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain dropout and batch normalization with a concrete example.
- Write or adapt a small code example applying dropout and batch normalization.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-generalization-1
- phase-03-classical-ml-ml-framing-1
key_terms:
- dropout
- batch
- normalization
- PyTorch
- tensor
- loss
- training
- generalization
concept_notes_vi: Dropout bỏ ngẫu nhiên một phần tín hiệu khi huấn luyện; chuẩn hóa theo lô dùng thống kê để biến
  đổi kích hoạt. Hai cơ chế có hành vi phụ thuộc chế độ huấn luyện hoặc đánh giá.
concept_notes_en: Dropout và batch normalization is a foundation for numerical representations. Track tensor shapes,
  units, and axes; verify multiplication on a small example before using a large batch. For similarity, normalize
  the measure so scale differences do not change the conclusion.
why_it_matters_vi: Nhận diện quá khớp và đánh giá tác dụng của điều chuẩn, tăng cường dữ liệu, dừng sớm.
why_it_matters_en: Diagnose overfitting and improve generalization with regularization, augmentation, and early
  stopping.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Dropout and batch normalization” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.
- Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Diagnose overfitting and improve generalization with regularization, augmentation,
  and early stopping.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Overfit a tiny dataset on purpose, change one thing at a time, and plot train/validation
  curves.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cho mô hình học quá khớp một tập nhỏ,
      thay từng yếu tố và so sánh đồ thị mất mát trên tập huấn luyện, kiểm định.'
    deliverables:
    - Đồ thị huấn luyện, kiểm định và cấu hình từng lần chạy
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Overfit a tiny dataset on purpose, change one thing at a time, and plot train/validation curves.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish real improvement from simply making the training score look better.
    stretch: Add a failure test for dropout and batch normalization and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Dropout và chuẩn hóa theo lô” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain dropout and batch normalization to a new teammate?
  - Which assumption behind dropout and batch normalization could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Dropout and batch normalization: inspect one complete path'
  code: "# Topic: Dropout and batch normalization (phase-04-deep-learning-generalization-2)\nfrom math import sqrt\n\
    \ndef dot(left: list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors\
    \ must have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright =\
    \ [0.5, 3.0]\nprint({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for dropout and batch normalization.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
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
- exercise-4-generalization
review_item_ids:
- phase-04-deep-learning-generalization-2-recall
- phase-04-deep-learning-generalization-2-application
- phase-04-deep-learning-generalization-2-debug
- phase-04-deep-learning-generalization-2-interview
estimated_minutes: 60
completion_checklist:
- So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.
- Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định.
common_mistakes:
- Kết luận mô hình tốt hơn chỉ vì mất mát huấn luyện giảm.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-04-deep-learning-generalization-3
- phase-04-deep-learning-generalization-4
review_question_vi: Nội dung cốt lõi của “Dropout và chuẩn hóa theo lô” là gì?
review_question_en: Define dropout and batch normalization in your own words. What are the input, transformation
  and output?
review_answer_vi: Dropout bỏ ngẫu nhiên một phần tín hiệu khi huấn luyện; chuẩn hóa theo lô dùng thống kê để biến
  đổi kích hoạt. Hai cơ chế có hành vi phụ thuộc chế độ huấn luyện hoặc đánh giá.
review_answer_en: A strong answer names the input, transformation, output and the context where dropout and batch
  normalization is used. Relate it specifically to dropout and batch normalization in lesson phase-04-deep-learning-generalization-2.
review_cards:
- id: phase-04-deep-learning-generalization-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Dropout và chuẩn hóa theo lô” là gì?
  question_en: Define dropout and batch normalization in your own words. What are the input, transformation and
    output?
  answer_vi: Dropout bỏ ngẫu nhiên một phần tín hiệu khi huấn luyện; chuẩn hóa theo lô dùng thống kê để biến đổi
    kích hoạt. Hai cơ chế có hành vi phụ thuộc chế độ huấn luyện hoặc đánh giá.
  answer_en: A strong answer names the input, transformation, output and the context where dropout and batch normalization
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-generalization-2-application
  type: application
  question_vi: So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.
  question_en: Write a small code example or design that applies dropout and batch normalization to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau”, cần lưu: đồ thị
    huấn luyện, kiểm định và cấu hình từng lần chạy. Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định.'
  answer_en: The dropout and batch normalization example should have an explicit input, expected output and a way
    to run or verify it (phase-04-deep-learning-generalization-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-generalization-2-debug
  type: debug
  question_vi: Khi làm bài “Dropout và chuẩn hóa theo lô”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If dropout and batch normalization produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Dropout và chuẩn hóa theo lô”, lỗi cần tránh là: kết luận mô hình tốt hơn chỉ vì mất mát
    huấn luyện giảm. Thay từng yếu tố và so sánh trên cùng dữ liệu kiểm định. Dùng ví dụ nhỏ để tìm bước đầu tiên
    có kết quả khác dự kiến.'
  answer_en: For dropout and batch normalization, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-04-deep-learning-generalization-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-generalization-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Dropout và chuẩn hóa theo lô” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of dropout and batch normalization?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about dropout and batch normalization should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-04-deep-learning-generalization-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dropout và chuẩn hóa theo lô / Dropout and batch normalization

Dropout bỏ ngẫu nhiên một phần tín hiệu khi huấn luyện; chuẩn hóa theo lô dùng thống kê để biến đổi kích hoạt. Hai cơ chế có hành vi phụ thuộc chế độ huấn luyện hoặc đánh giá.

## Thực hành

So sánh đầu ra ở chế độ train và eval, rồi giải thích sự khác nhau.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cho mô hình học quá khớp một tập nhỏ, thay từng yếu tố và so sánh đồ thị mất mát trên tập huấn luyện, kiểm định.
