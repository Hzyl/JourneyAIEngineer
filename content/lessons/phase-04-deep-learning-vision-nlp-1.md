---
lesson_id: phase-04-deep-learning-vision-nlp-1
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: CNN và image classifier
title_en: CNNs and image classifiers
summary_vi: Học CNN và image classifier qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn CNNs and image classifiers through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích cnn và image classifier bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng cnn và image classifier.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain cnns and image classifiers with a concrete example.
- Write or adapt a small code example applying cnns and image classifiers.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-generalization-4
- phase-03-classical-ml-ml-framing-1
key_terms:
- cnn
- image
- classifier
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: CNN và image classifier là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc,
  kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python,
  giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: CNN và image classifier is a Software Engineering skill for turning an idea into code that can be read,
  tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python, small
  boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Hiểu CNN, transfer learning, embedding và attention ở mức đủ để chọn hướng CV hoặc NLP.
why_it_matters_en: Understand CNNs, transfer learning, embeddings, and attention well enough to choose a CV or NLP path.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Hiểu CNN, transfer learning, embedding và attention ở mức đủ để chọn hướng CV hoặc NLP.'
- Mở PyTorch Tutorials, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Chọn một dataset nhỏ, train baseline, dùng transfer learning hoặc embedding, rồi phân tích confusion
  matrix.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Understand CNNs, transfer learning, embeddings, and attention well enough to choose
  a CV or NLP path.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Choose a small dataset, train a baseline, try transfer learning or embeddings, and inspect
  a confusion matrix.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Chọn một dataset nhỏ, train baseline, dùng transfer learning hoặc embedding, rồi phân tích confusion matrix.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được representation nào đang được học và lỗi nào còn do dữ liệu.
    stretch: Viết thêm một failure test cho cnn và image classifier và giải thích kết quả.
  en:
    task: Choose a small dataset, train a baseline, try transfer learning or embeddings, and inspect a confusion matrix.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which representation is learned and which errors still come from the data.
    stretch: Add a failure test for cnns and image classifiers and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích cnn và image classifier cho một đồng đội mới như thế nào?
  - Một assumption nào của cnn và image classifier có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain cnns and image classifiers to a new teammate?
  - Which assumption behind cnns and image classifiers could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'CNNs and image classifiers: inspect one complete path'
  code: "# Topic: CNNs and image classifiers (phase-04-deep-learning-vision-nlp-1)\ndef linear(x: list[float], weights: list[float],\
    \ bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n    return\
    \ sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1], 0.5)\n\
    print({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của cnn và image classifier.
  purpose_en: Illustrate the input-to-output path for cnns and image classifiers.
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
- title: PyTorch Transfer Learning
  url: https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html
  language: en
  purpose_vi: Xây image classifier thực tế mà không train từ đầu mù quáng.
  read_vi: Đọc data augmentation, pretrained model và đánh giá validation.
  purpose_en: Build a practical image classifier without blindly training from scratch.
  read_en: Read augmentation, pretrained models, and validation evaluation.
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
- exercise-4-vision-nlp
review_item_ids:
- phase-04-deep-learning-vision-nlp-1-recall
- phase-04-deep-learning-vision-nlp-1-application
- phase-04-deep-learning-vision-nlp-1-debug
- phase-04-deep-learning-vision-nlp-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của cnn và image classifier.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng cnn và image classifier và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng cnn và image classifier.
- Đánh giá cnn và image classifier bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ cnn và image classifier mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-vision-nlp-2
- phase-04-deep-learning-vision-nlp-3
review_question_vi: Định nghĩa cnn và image classifier bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define cnns and image classifiers in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng cnn và image classifier. Hãy liên
  hệ cụ thể với cnn và image classifier trong lesson phase-04-deep-learning-vision-nlp-1.
review_answer_en: A strong answer names the input, transformation, output and the context where cnns and image classifiers
  is used. Relate it specifically to cnns and image classifiers in lesson phase-04-deep-learning-vision-nlp-1.
review_cards:
- id: phase-04-deep-learning-vision-nlp-1-recall
  type: recall
  question_vi: Định nghĩa cnn và image classifier bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define cnns and image classifiers in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng cnn và image classifier.
  answer_en: A strong answer names the input, transformation, output and the context where cnns and image classifiers is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng cnn và image classifier cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies cnns and image classifiers to an AI engineering problem.
  answer_vi: Ví dụ cho cnn và image classifier cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-04-deep-learning-vision-nlp-1).
  answer_en: The cnns and image classifiers example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-vision-nlp-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-1-debug
  type: debug
  question_vi: Nếu kết quả của cnn và image classifier sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If cnns and image classifiers produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với cnn và image classifier, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-04-deep-learning-vision-nlp-1).
  answer_en: For cnns and image classifiers, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-04-deep-learning-vision-nlp-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của cnn và image classifier như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of cnns and image classifiers?
  answer_vi: Câu trả lời về cnn và image classifier cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-04-deep-learning-vision-nlp-1).
  answer_en: The answer about cnns and image classifiers should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-04-deep-learning-vision-nlp-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# CNN và image classifier / CNNs and image classifiers

CNN và image classifier là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Chọn một dataset nhỏ, train baseline, dùng transfer learning hoặc embedding, rồi phân tích confusion matrix.
