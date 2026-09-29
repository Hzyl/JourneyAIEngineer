---
lesson_id: phase-04-deep-learning-debugging-2
phase_id: phase-04-deep-learning
module_id: debugging
title_vi: NaN và exploding gradient
title_en: NaN values and exploding gradients
summary_vi: Học NaN và exploding gradient qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn NaN values and exploding gradients through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích nan và exploding gradient bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng nan và exploding gradient.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain nan values and exploding gradients with a concrete example.
- Write or adapt a small code example applying nan values and exploding gradients.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-debugging-1
- phase-03-classical-ml-ml-framing-1
key_terms:
- nan
- exploding
- gradient
- NumPy
- vector
- optimization
- debugging
concept_notes_vi: NaN và exploding gradient cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference
  trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết
  định bước cập nhật có ổn định hay không.
concept_notes_en: NaN và exploding gradient describes how an output changes when a parameter changes. Use finite differences
  on a small input to check a gradient, then trace the chain rule through each transformation; gradient sign and scale determine
  whether updates are stable.
why_it_matters_vi: Debug shape, NaN, GPU memory và experiment tracking bằng log có đủ context.
why_it_matters_en: Debug shape errors, NaNs, GPU memory, and experiment tracking with contextual logs.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Debug shape, NaN, GPU memory và experiment tracking bằng log có đủ context.'
- Mở PyTorch Tutorials, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo từng lỗi một, ghi symptom, hypothesis, smallest reproduction và fix; lưu run metadata.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Debug shape errors, NaNs, GPU memory, and experiment tracking with contextual logs.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create one failure at a time and record its symptom, hypothesis, smallest reproduction, and
  fix with run metadata.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo từng lỗi một, ghi symptom, hypothesis, smallest reproduction và fix; lưu run metadata.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn không chữa NaN bằng cách giảm learning rate một cách mù quáng; bạn tìm nguyên nhân trước.
    stretch: Viết thêm một failure test cho nan và exploding gradient và giải thích kết quả.
  en:
    task: Create one failure at a time and record its symptom, hypothesis, smallest reproduction, and fix with run metadata.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You do not blindly lower the learning rate for NaNs; you find the cause first.
    stretch: Add a failure test for nan values and exploding gradients and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nan và exploding gradient cho một đồng đội mới như thế nào?
  - Một assumption nào của nan và exploding gradient có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain nan values and exploding gradients to a new teammate?
  - Which assumption behind nan values and exploding gradients could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'NaN values and exploding gradients: inspect one complete path'
  code: "# Topic: NaN values and exploding gradients (phase-04-deep-learning-debugging-2)\ndef finite_difference(f, x, step=1e-5):\n\
    \    if step <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step)) / (2 * step)\n\
    \nprint(round(finite_difference(lambda value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của nan và exploding gradient.
  purpose_en: Illustrate the input-to-output path for nan values and exploding gradients.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: So sánh đạo hàm giải tích với finite difference và kiểm tra bước h dương, đủ nhỏ.
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
- exercise-4-debugging
review_item_ids:
- phase-04-deep-learning-debugging-2-recall
- phase-04-deep-learning-debugging-2-application
- phase-04-deep-learning-debugging-2-debug
- phase-04-deep-learning-debugging-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của nan và exploding gradient.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng nan và exploding gradient và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng nan và exploding gradient.
- Đánh giá nan và exploding gradient bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ nan và exploding gradient mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-debugging-3
- phase-04-deep-learning-debugging-4
review_question_vi: Định nghĩa nan và exploding gradient bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define nan values and exploding gradients in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng nan và exploding gradient. Hãy
  liên hệ cụ thể với nan và exploding gradient trong lesson phase-04-deep-learning-debugging-2.
review_answer_en: A strong answer names the input, transformation, output and the context where nan values and exploding gradients
  is used. Relate it specifically to nan values and exploding gradients in lesson phase-04-deep-learning-debugging-2.
review_cards:
- id: phase-04-deep-learning-debugging-2-recall
  type: recall
  question_vi: Định nghĩa nan và exploding gradient bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define nan values and exploding gradients in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng nan và exploding gradient.
  answer_en: A strong answer names the input, transformation, output and the context where nan values and exploding gradients
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-debugging-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng nan và exploding gradient cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies nan values and exploding gradients to an AI engineering problem.
  answer_vi: Ví dụ cho nan và exploding gradient cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-04-deep-learning-debugging-2).
  answer_en: The nan values and exploding gradients example should have an explicit input, expected output and a way to run
    or verify it (phase-04-deep-learning-debugging-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-debugging-2-debug
  type: debug
  question_vi: Nếu kết quả của nan và exploding gradient sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If nan values and exploding gradients produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với nan và exploding gradient, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-04-deep-learning-debugging-2).
  answer_en: For nan values and exploding gradients, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-04-deep-learning-debugging-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-debugging-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của nan và exploding gradient như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of nan values and exploding gradients?
  answer_vi: Câu trả lời về nan và exploding gradient cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-04-deep-learning-debugging-2).
  answer_en: The answer about nan values and exploding gradients should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-04-deep-learning-debugging-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# NaN và exploding gradient / NaN values and exploding gradients

NaN và exploding gradient cho biết output thay đổi thế nào khi một tham số thay đổi. Dùng finite difference trên input nhỏ để kiểm tra gradient, sau đó theo dõi chain rule qua từng phép biến đổi; dấu và scale của gradient quyết định bước cập nhật có ổn định hay không.

## Practice

Tạo từng lỗi một, ghi symptom, hypothesis, smallest reproduction và fix; lưu run metadata.
