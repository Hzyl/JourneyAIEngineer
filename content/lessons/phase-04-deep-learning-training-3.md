---
lesson_id: phase-04-deep-learning-training-3
phase_id: phase-04-deep-learning
module_id: training
title_vi: Optimizer và learning rate
title_en: Optimizers and learning rates
summary_vi: Học Optimizer và learning rate qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Optimizers and learning rates through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích optimizer và learning rate bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng optimizer và learning rate.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain optimizers and learning rates with a concrete example.
- Write or adapt a small code example applying optimizers and learning rates.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-training-2
- phase-03-classical-ml-ml-framing-1
key_terms:
- optimizer
- learning
- rate
- PyTorch
- tensor
- loss
- training
concept_notes_vi: 'Optimizer và learning rate là một mảnh của Deep Learning pipeline: tensor đi qua forward pass, loss tạo
  tín hiệu, backprop tính gradient và optimizer cập nhật tham số. Tách train/eval mode, lưu checkpoint và theo dõi validation
  để phân biệt overfit với lỗi dữ liệu.'
concept_notes_en: 'Optimizer và learning rate is one part of a Deep Learning pipeline: tensors flow through a forward pass,
  loss creates a signal, backprop computes gradients, and the optimizer updates parameters. Separate train/eval modes, save
  checkpoints, and track validation to distinguish overfitting from data errors.'
why_it_matters_vi: Tách forward, loss, backward, optimizer, validation và checkpoint thành một vòng lặp có thể debug.
why_it_matters_en: Separate forward, loss, backward, optimizer, validation, and checkpoint into a debuggable loop.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Tách forward, loss, backward, optimizer, validation và checkpoint thành một vòng lặp
  có thể debug.'
- Mở PyTorch Tutorials, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết training loop, log train/validation loss, lưu best checkpoint và resume từ checkpoint đó.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Separate forward, loss, backward, optimizer, validation, and checkpoint into a debuggable
  loop.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a training loop, log train/validation loss, save the best checkpoint, and resume from
  it.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết training loop, log train/validation loss, lưu best checkpoint và resume từ checkpoint đó.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn biết model nào được lưu, vì sao lưu, và có thể tái tạo metric từ checkpoint.
    stretch: Viết thêm một failure test cho optimizer và learning rate và giải thích kết quả.
  en:
    task: Write a training loop, log train/validation loss, save the best checkpoint, and resume from it.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know which model is saved and why, and can reproduce metrics from its checkpoint.
    stretch: Add a failure test for optimizers and learning rates and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích optimizer và learning rate cho một đồng đội mới như thế nào?
  - Một assumption nào của optimizer và learning rate có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain optimizers and learning rates to a new teammate?
  - Which assumption behind optimizers and learning rates could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Optimizers and learning rates: inspect one complete path'
  code: "# Topic: Optimizers and learning rates (phase-04-deep-learning-training-3)\ndef linear(x: list[float], weights: list[float],\
    \ bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n    return\
    \ sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\n\
    print({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của optimizer và learning rate.
  purpose_en: Illustrate the input-to-output path for optimizers and learning rates.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Làm rõ shape, forward output và loss trước khi thêm framework hoặc tối ưu hóa.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
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
- exercise-4-training
review_item_ids:
- phase-04-deep-learning-training-3-recall
- phase-04-deep-learning-training-3-application
- phase-04-deep-learning-training-3-debug
- phase-04-deep-learning-training-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của optimizer và learning rate.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng optimizer và learning rate và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng optimizer và learning rate.
- Đánh giá optimizer và learning rate bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ optimizer và learning rate mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-training-4
- phase-04-deep-learning-generalization-1
review_question_vi: Định nghĩa optimizer và learning rate bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define optimizers and learning rates in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng optimizer và learning rate. Hãy
  liên hệ cụ thể với optimizer và learning rate trong lesson phase-04-deep-learning-training-3.
review_answer_en: A strong answer names the input, transformation, output and the context where optimizers and learning rates
  is used. Relate it specifically to optimizers and learning rates in lesson phase-04-deep-learning-training-3.
review_cards:
- id: phase-04-deep-learning-training-3-recall
  type: recall
  question_vi: Định nghĩa optimizer và learning rate bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define optimizers and learning rates in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng optimizer và learning rate.
  answer_en: A strong answer names the input, transformation, output and the context where optimizers and learning rates is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-training-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng optimizer và learning rate cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies optimizers and learning rates to an AI engineering problem.
  answer_vi: Ví dụ cho optimizer và learning rate cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-04-deep-learning-training-3).
  answer_en: The optimizers and learning rates example should have an explicit input, expected output and a way to run or
    verify it (phase-04-deep-learning-training-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-training-3-debug
  type: debug
  question_vi: Nếu kết quả của optimizer và learning rate sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If optimizers and learning rates produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với optimizer và learning rate, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-04-deep-learning-training-3).
  answer_en: For optimizers and learning rates, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-04-deep-learning-training-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-training-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của optimizer và learning rate như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of optimizers and learning rates?
  answer_vi: Câu trả lời về optimizer và learning rate cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-04-deep-learning-training-3).
  answer_en: The answer about optimizers and learning rates should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-04-deep-learning-training-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Optimizer và learning rate / Optimizers and learning rates

Optimizer và learning rate là một mảnh của Deep Learning pipeline: tensor đi qua forward pass, loss tạo tín hiệu, backprop tính gradient và optimizer cập nhật tham số. Tách train/eval mode, lưu checkpoint và theo dõi validation để phân biệt overfit với lỗi dữ liệu.

## Practice

Viết training loop, log train/validation loss, lưu best checkpoint và resume từ checkpoint đó.
