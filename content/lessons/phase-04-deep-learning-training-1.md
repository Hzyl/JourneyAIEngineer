---
lesson_id: phase-04-deep-learning-training-1
phase_id: phase-04-deep-learning
module_id: training
title_vi: Forward pass và loss
title_en: Forward passes and loss
summary_vi: Học Forward pass và loss qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Forward passes and loss through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích forward pass và loss bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng forward pass và loss.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain forward passes and loss with a concrete example.
- Write or adapt a small code example applying forward passes and loss.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-pytorch-core-4
- phase-03-classical-ml-ml-framing-1
key_terms:
- forward
- pass
- loss
- PyTorch
- tensor
- training
concept_notes_vi: Forward pass và loss là khái niệm của module training. Hãy xác định input, output, giả định, failure mode
  và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Forward pass và loss is a concept in the training module. Identify the inputs, outputs, assumptions, failure
  modes, and verification method with a small example before scaling to a project.
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
    stretch: Viết thêm một failure test cho forward pass và loss và giải thích kết quả.
  en:
    task: Write a training loop, log train/validation loss, save the best checkpoint, and resume from it.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know which model is saved and why, and can reproduce metrics from its checkpoint.
    stretch: Add a failure test for forward passes and loss and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích forward pass và loss cho một đồng đội mới như thế nào?
  - Một assumption nào của forward pass và loss có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain forward passes and loss to a new teammate?
  - Which assumption behind forward passes and loss could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Forward passes and loss: inspect one complete path'
  code: "# Topic: Forward passes and loss (phase-04-deep-learning-training-1)\ndef linear(x: list[float], weights: list[float],\
    \ bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n    return\
    \ sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\n\
    print({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của forward pass và loss.
  purpose_en: Illustrate the input-to-output path for forward passes and loss.
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
- phase-04-deep-learning-training-1-recall
- phase-04-deep-learning-training-1-application
- phase-04-deep-learning-training-1-debug
- phase-04-deep-learning-training-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của forward pass và loss.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng forward pass và loss và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng forward pass và loss.
- Đánh giá forward pass và loss bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ forward pass và loss mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-training-2
- phase-04-deep-learning-training-3
review_question_vi: Định nghĩa forward pass và loss bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define forward passes and loss in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng forward pass và loss. Hãy liên
  hệ cụ thể với forward pass và loss trong lesson phase-04-deep-learning-training-1.
review_answer_en: A strong answer names the input, transformation, output and the context where forward passes and loss is
  used. Relate it specifically to forward passes and loss in lesson phase-04-deep-learning-training-1.
review_cards:
- id: phase-04-deep-learning-training-1-recall
  type: recall
  question_vi: Định nghĩa forward pass và loss bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define forward passes and loss in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng forward pass và loss.
  answer_en: A strong answer names the input, transformation, output and the context where forward passes and loss is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-training-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng forward pass và loss cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies forward passes and loss to an AI engineering problem.
  answer_vi: Ví dụ cho forward pass và loss cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-04-deep-learning-training-1).
  answer_en: The forward passes and loss example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-training-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-training-1-debug
  type: debug
  question_vi: Nếu kết quả của forward pass và loss sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If forward passes and loss produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với forward pass và loss, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-04-deep-learning-training-1).
  answer_en: For forward passes and loss, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-04-deep-learning-training-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-training-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của forward pass và loss như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of forward passes and loss?
  answer_vi: Câu trả lời về forward pass và loss cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-04-deep-learning-training-1).
  answer_en: The answer about forward passes and loss should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-04-deep-learning-training-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Forward pass và loss / Forward passes and loss

Forward pass và loss là khái niệm của module training. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Viết training loop, log train/validation loss, lưu best checkpoint và resume từ checkpoint đó.
