---
lesson_id: phase-10-genai-transformers-genai-transformers-2
phase_id: phase-10-genai-transformers
module_id: genai-transformers
title_vi: Self-attention và scaled dot product
title_en: Self-attention and scaled dot product
summary_vi: Học Self-attention và scaled dot product qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài
  tập có edge case.
summary_en: Learn Self-attention and scaled dot product through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích self-attention và scaled dot product bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng self-attention và scaled dot product.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain self-attention and scaled dot product with a concrete example.
- Write or adapt a small code example applying self-attention and scaled dot product.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-10-genai-transformers-genai-transformers-1
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
key_terms:
- self
- attention
- scaled
- dot
- product
- PyTorch
- tensor
- loss
- training
- genai-transformers
concept_notes_vi: Self-attention và scaled dot product là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của
  tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector
  khác scale không làm sai kết luận.
concept_notes_en: Self-attention và scaled dot product is a foundation for numerical representations. Track tensor shapes,
  units, and axes; verify multiplication on a small example before using a large batch. For similarity, normalize the measure
  so scale differences do not change the conclusion.
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
    stretch: Viết thêm một failure test cho self-attention và scaled dot product và giải thích kết quả.
  en:
    task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with and without caching.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the Q/K/V flow, explain encoder/decoder roles, and quantify why KV cache reduces latency.
    stretch: Add a failure test for self-attention and scaled dot product and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích self-attention và scaled dot product cho một đồng đội mới như thế nào?
  - Một assumption nào của self-attention và scaled dot product có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain self-attention and scaled dot product to a new teammate?
  - Which assumption behind self-attention and scaled dot product could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Attention(Q,K,V) = softmax(QKᵀ / √d_k)V
code_examples:
- language: python
  title: 'Self-attention and scaled dot product: inspect one complete path'
  code: "# Topic: Self-attention and scaled dot product (phase-10-genai-transformers-genai-transformers-2)\nfrom math import\
    \ sqrt\n\ndef dot(left: list[float], right: list[float]) -> float:\n    if len(left) != len(right):\n        raise ValueError('vectors\
    \ must have equal length')\n    return sum(a * b for a, b in zip(left, right))\n\nleft = [1.0, 2.0]\nright = [0.5, 3.0]\n\
    print({'dot': dot(left, right), 'norm_left': sqrt(dot(left, left))})"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của self-attention và scaled dot product.
  purpose_en: Illustrate the input-to-output path for self-attention and scaled dot product.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Kiểm tra shape trước phép toán; ví dụ dùng dữ liệu nhỏ để kết quả có thể tính tay.
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
- phase-10-genai-transformers-genai-transformers-2-recall
- phase-10-genai-transformers-genai-transformers-2-application
- phase-10-genai-transformers-genai-transformers-2-debug
- phase-10-genai-transformers-genai-transformers-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của self-attention và scaled dot product.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng self-attention và scaled dot product và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng self-attention và scaled dot product.
- Đánh giá self-attention và scaled dot product bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ self-attention và scaled dot product mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-10-genai-transformers-genai-transformers-3
- phase-10-genai-transformers-genai-transformers-4
review_question_vi: Định nghĩa self-attention và scaled dot product bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define self-attention and scaled dot product in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng self-attention và scaled dot product.
  Hãy liên hệ cụ thể với self-attention và scaled dot product trong lesson phase-10-genai-transformers-genai-transformers-2.
review_answer_en: A strong answer names the input, transformation, output and the context where self-attention and scaled
  dot product is used. Relate it specifically to self-attention and scaled dot product in lesson phase-10-genai-transformers-genai-transformers-2.
review_cards:
- id: phase-10-genai-transformers-genai-transformers-2-recall
  type: recall
  question_vi: Định nghĩa self-attention và scaled dot product bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define self-attention and scaled dot product in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng self-attention và scaled dot product.
  answer_en: A strong answer names the input, transformation, output and the context where self-attention and scaled dot product
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-10-genai-transformers-genai-transformers-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng self-attention và scaled dot product cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies self-attention and scaled dot product to an AI engineering
    problem.
  answer_vi: Ví dụ cho self-attention và scaled dot product cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-10-genai-transformers-genai-transformers-2).
  answer_en: The self-attention and scaled dot product example should have an explicit input, expected output and a way to
    run or verify it (phase-10-genai-transformers-genai-transformers-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-10-genai-transformers-genai-transformers-2-debug
  type: debug
  question_vi: Nếu kết quả của self-attention và scaled dot product sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If self-attention and scaled dot product produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với self-attention và scaled dot product, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-10-genai-transformers-genai-transformers-2).
  answer_en: For self-attention and scaled dot product, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-10-genai-transformers-genai-transformers-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-10-genai-transformers-genai-transformers-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của self-attention và scaled dot product như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of self-attention and scaled dot product?
  answer_vi: Câu trả lời về self-attention và scaled dot product cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-10-genai-transformers-genai-transformers-2).
  answer_en: The answer about self-attention and scaled dot product should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-10-genai-transformers-genai-transformers-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Self-attention và scaled dot product / Self-attention and scaled dot product

Self-attention và scaled dot product là nền tảng biểu diễn dữ liệu số. Luôn ghi shape, đơn vị và trục của tensor; kiểm tra phép nhân bằng một ví dụ nhỏ trước khi dùng batch lớn. Với similarity, chuẩn hóa cách đo để hai vector khác scale không làm sai kết luận.

## Practice

Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.
