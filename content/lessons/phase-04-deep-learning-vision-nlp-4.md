---
lesson_id: phase-04-deep-learning-vision-nlp-4
phase_id: phase-04-deep-learning
module_id: vision-nlp
title_vi: Attention và Transformer overview
title_en: Attention and a Transformer overview
summary_vi: Học Attention và Transformer overview qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập
  có edge case.
summary_en: Learn Attention and a Transformer overview through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích attention và transformer overview bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng attention và transformer overview.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain attention and a transformer overview with a concrete example.
- Write or adapt a small code example applying attention and a transformer overview.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-vision-nlp-3
- phase-03-classical-ml-ml-framing-1
key_terms:
- attention
- transformer
- overview
- PyTorch
- tensor
- loss
- training
- vision-nlp
concept_notes_vi: Attention và Transformer overview giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo
  dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại
  dùng thêm memory.
concept_notes_en: Attention và Transformer overview explains how a Transformer weights relevant tokens. Track the shapes of
  Q, K, V, masks, and context length; during inference, KV cache avoids recomputing keys and values at the cost of memory.
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
    stretch: Viết thêm một failure test cho attention và transformer overview và giải thích kết quả.
  en:
    task: Choose a small dataset, train a baseline, try transfer learning or embeddings, and inspect a confusion matrix.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which representation is learned and which errors still come from the data.
    stretch: Add a failure test for attention and a transformer overview and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích attention và transformer overview cho một đồng đội mới như thế nào?
  - Một assumption nào của attention và transformer overview có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain attention and a transformer overview to a new teammate?
  - Which assumption behind attention and a transformer overview could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Attention and a Transformer overview: inspect one complete path'
  code: "# Topic: Attention and a Transformer overview (phase-04-deep-learning-vision-nlp-4)\ndef linear(x: list[float], weights:\
    \ list[float], bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape mismatch')\n\
    \    return sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0, 2.0], [0.2, -0.1],\
    \ 0.5)\nprint({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của attention và transformer overview.
  purpose_en: Illustrate the input-to-output path for attention and a transformer overview.
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
- exercise-4-vision-nlp
review_item_ids:
- phase-04-deep-learning-vision-nlp-4-recall
- phase-04-deep-learning-vision-nlp-4-application
- phase-04-deep-learning-vision-nlp-4-debug
- phase-04-deep-learning-vision-nlp-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của attention và transformer overview.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng attention và transformer overview và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng attention và transformer overview.
- Đánh giá attention và transformer overview bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ attention và transformer overview mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-debugging-1
- phase-04-deep-learning-debugging-2
review_question_vi: Định nghĩa attention và transformer overview bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define attention and a transformer overview in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng attention và transformer overview.
  Hãy liên hệ cụ thể với attention và transformer overview trong lesson phase-04-deep-learning-vision-nlp-4.
review_answer_en: A strong answer names the input, transformation, output and the context where attention and a transformer
  overview is used. Relate it specifically to attention and a transformer overview in lesson phase-04-deep-learning-vision-nlp-4.
review_cards:
- id: phase-04-deep-learning-vision-nlp-4-recall
  type: recall
  question_vi: Định nghĩa attention và transformer overview bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define attention and a transformer overview in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng attention và transformer overview.
  answer_en: A strong answer names the input, transformation, output and the context where attention and a transformer overview
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-vision-nlp-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng attention và transformer overview cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies attention and a transformer overview to an AI engineering
    problem.
  answer_vi: Ví dụ cho attention và transformer overview cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-04-deep-learning-vision-nlp-4).
  answer_en: The attention and a transformer overview example should have an explicit input, expected output and a way to
    run or verify it (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-vision-nlp-4-debug
  type: debug
  question_vi: Nếu kết quả của attention và transformer overview sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If attention and a transformer overview produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với attention và transformer overview, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-04-deep-learning-vision-nlp-4).
  answer_en: For attention and a transformer overview, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-vision-nlp-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của attention và transformer overview như thế
    nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of attention and a transformer overview?
  answer_vi: Câu trả lời về attention và transformer overview cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-04-deep-learning-vision-nlp-4).
  answer_en: The answer about attention and a transformer overview should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-04-deep-learning-vision-nlp-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Attention và Transformer overview / Attention and a Transformer overview

Attention và Transformer overview giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại dùng thêm memory.

## Practice

Chọn một dataset nhỏ, train baseline, dùng transfer learning hoặc embedding, rồi phân tích confusion matrix.
