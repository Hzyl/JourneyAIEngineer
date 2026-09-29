---
lesson_id: phase-10-genai-transformers-genai-transformers-1
phase_id: phase-10-genai-transformers
module_id: genai-transformers
title_vi: Neural network và backpropagation
title_en: Neural networks and backpropagation
summary_vi: Học Neural network và backpropagation qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập
  có edge case.
summary_en: Learn Neural networks and backpropagation through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích neural network và backpropagation bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng neural network và backpropagation.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain neural networks and backpropagation with a concrete example.
- Write or adapt a small code example applying neural networks and backpropagation.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-4
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
key_terms:
- neural
- network
- backpropagation
- PyTorch
- tensor
- loss
- training
- genai-transformers
concept_notes_vi: Neural network và backpropagation cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite
  difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient
  quyết định bước cập nhật có ổn định hay không.
concept_notes_en: Neural network và backpropagation describes how an output changes when a parameter changes. Use finite differences
  on a small input to check a gradient, then trace the chain rule through each transformation; gradient sign and scale determine
  whether updates are stable.
why_it_matters_vi: Transformer chỉ trở nên dễ hiểu khi theo dõi tensor shape, attention weights và chi phí inference.
why_it_matters_en: Transformers become understandable when you trace tensor shapes, attention weights, and inference cost.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Transformer chỉ trở nên dễ hiểu khi theo dõi tensor shape, attention weights và chi
  phí inference.'
- Mở PyTorch Tutorials, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Transformers become understandable when you trace tensor shapes, attention weights,
  and inference cost.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with
  and without caching.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn vẽ được luồng Q/K/V, giải thích encoder/decoder và định lượng vì sao KV cache giảm latency.
    stretch: Viết thêm một failure test cho neural network và backpropagation và giải thích kết quả.
  en:
    task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with and without caching.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the Q/K/V flow, explain encoder/decoder roles, and quantify why KV cache reduces latency.
    stretch: Add a failure test for neural networks and backpropagation and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích neural network và backpropagation cho một đồng đội mới như thế nào?
  - Một assumption nào của neural network và backpropagation có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain neural networks and backpropagation to a new teammate?
  - Which assumption behind neural networks and backpropagation could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Neural networks and backpropagation: inspect one complete path'
  code: "# Topic: Neural networks and backpropagation (phase-10-genai-transformers-genai-transformers-1)\ndef linear(x: list[float],\
    \ weights: list[float], bias: float = 0.0) -> float:\n    if len(x) != len(weights):\n        raise ValueError('shape\
    \ mismatch')\n    return sum(value * weight for value, weight in zip(x, weights)) + bias\n\nprediction = linear([1.0,\
    \ 2.0], [0.2, -0.1], 0.5)\nprint({'prediction': prediction, 'loss': (prediction - 1.0) ** 2})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của neural network và backpropagation.
  purpose_en: Illustrate the input-to-output path for neural networks and backpropagation.
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
  title: The Illustrated Transformer
  url: https://jalammar.github.io/illustrated-transformer/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Attention Is All You Need
  url: https://arxiv.org/abs/1706.03762
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
- exercise-10-genai-transformers
review_item_ids:
- phase-10-genai-transformers-genai-transformers-1-recall
- phase-10-genai-transformers-genai-transformers-1-application
- phase-10-genai-transformers-genai-transformers-1-debug
- phase-10-genai-transformers-genai-transformers-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của neural network và backpropagation.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng neural network và backpropagation và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng neural network và backpropagation.
- Đánh giá neural network và backpropagation bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ neural network và backpropagation mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-10-genai-transformers-genai-transformers-2
- phase-10-genai-transformers-genai-transformers-3
review_question_vi: Định nghĩa neural network và backpropagation bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define neural networks and backpropagation in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng neural network và backpropagation.
  Hãy liên hệ cụ thể với neural network và backpropagation trong lesson phase-10-genai-transformers-genai-transformers-1.
review_answer_en: A strong answer names the input, transformation, output and the context where neural networks and backpropagation
  is used. Relate it specifically to neural networks and backpropagation in lesson phase-10-genai-transformers-genai-transformers-1.
review_cards:
- id: phase-10-genai-transformers-genai-transformers-1-recall
  type: recall
  question_vi: Định nghĩa neural network và backpropagation bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define neural networks and backpropagation in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng neural network và backpropagation.
  answer_en: A strong answer names the input, transformation, output and the context where neural networks and backpropagation
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-10-genai-transformers-genai-transformers-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng neural network và backpropagation cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies neural networks and backpropagation to an AI engineering
    problem.
  answer_vi: Ví dụ cho neural network và backpropagation cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-10-genai-transformers-genai-transformers-1).
  answer_en: The neural networks and backpropagation example should have an explicit input, expected output and a way to run
    or verify it (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-10-genai-transformers-genai-transformers-1-debug
  type: debug
  question_vi: Nếu kết quả của neural network và backpropagation sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If neural networks and backpropagation produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với neural network và backpropagation, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-10-genai-transformers-genai-transformers-1).
  answer_en: For neural networks and backpropagation, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-10-genai-transformers-genai-transformers-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của neural network và backpropagation như thế
    nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of neural networks and backpropagation?
  answer_vi: Câu trả lời về neural network và backpropagation cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-10-genai-transformers-genai-transformers-1).
  answer_en: The answer about neural networks and backpropagation should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-10-genai-transformers-genai-transformers-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Neural network và backpropagation / Neural networks and backpropagation

Neural network và backpropagation cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định bước cập nhật có ổn định hay không.

## Practice

Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.
