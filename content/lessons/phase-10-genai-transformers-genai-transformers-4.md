---
lesson_id: phase-10-genai-transformers-genai-transformers-4
phase_id: phase-10-genai-transformers
module_id: genai-transformers
title_vi: KV cache và inference efficiency
title_en: KV cache and inference efficiency
summary_vi: Học KV cache và inference efficiency qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập
  có edge case.
summary_en: Learn KV cache and inference efficiency through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích kv cache và inference efficiency bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng kv cache và inference efficiency.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain kv cache and inference efficiency with a concrete example.
- Write or adapt a small code example applying kv cache and inference efficiency.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-10-genai-transformers-genai-transformers-3
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
key_terms:
- cache
- inference
- efficiency
- PyTorch
- tensor
- loss
- training
- genai-transformers
concept_notes_vi: KV cache và inference efficiency giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo
  dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại
  dùng thêm memory.
concept_notes_en: KV cache và inference efficiency explains how a Transformer weights relevant tokens. Track the shapes of
  Q, K, V, masks, and context length; during inference, KV cache avoids recomputing keys and values at the cost of memory.
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
    stretch: Viết thêm một failure test cho kv cache và inference efficiency và giải thích kết quả.
  en:
    task: Implement minimal attention with PyTorch/NumPy, inspect shapes, and compare inference with and without caching.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the Q/K/V flow, explain encoder/decoder roles, and quantify why KV cache reduces latency.
    stretch: Add a failure test for kv cache and inference efficiency and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích kv cache và inference efficiency cho một đồng đội mới như thế nào?
  - Một assumption nào của kv cache và inference efficiency có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain kv cache and inference efficiency to a new teammate?
  - Which assumption behind kv cache and inference efficiency could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'KV cache and inference efficiency: inspect one complete path'
  code: "# Topic: KV cache and inference efficiency (phase-10-genai-transformers-genai-transformers-4)\nimport time\n\ndef\
    \ timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return\
    \ {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của kv cache và inference efficiency.
  purpose_en: Illustrate the input-to-output path for kv cache and inference efficiency.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Đo boundary nhỏ bằng input hợp lệ, output có schema và một chỉ số vận hành quan sát được.
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
- title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
  language: en
  purpose_vi: Tự động chạy quality gate trước khi merge hoặc push artifact.
  read_vi: Đọc workflow, runner, secrets và artifact.
  purpose_en: Automate quality gates before merging or publishing artifacts.
  read_en: Read workflows, runners, secrets, and artifacts.
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
- exercise-10-genai-transformers
review_item_ids:
- phase-10-genai-transformers-genai-transformers-4-recall
- phase-10-genai-transformers-genai-transformers-4-application
- phase-10-genai-transformers-genai-transformers-4-debug
- phase-10-genai-transformers-genai-transformers-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của kv cache và inference efficiency.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng kv cache và inference efficiency và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng kv cache và inference efficiency.
- Đánh giá kv cache và inference efficiency bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ kv cache và inference efficiency mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-11-llm-application-llm-application-1
- phase-11-llm-application-llm-application-2
review_question_vi: Định nghĩa kv cache và inference efficiency bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define kv cache and inference efficiency in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng kv cache và inference efficiency.
  Hãy liên hệ cụ thể với kv cache và inference efficiency trong lesson phase-10-genai-transformers-genai-transformers-4.
review_answer_en: A strong answer names the input, transformation, output and the context where kv cache and inference efficiency
  is used. Relate it specifically to kv cache and inference efficiency in lesson phase-10-genai-transformers-genai-transformers-4.
review_cards:
- id: phase-10-genai-transformers-genai-transformers-4-recall
  type: recall
  question_vi: Định nghĩa kv cache và inference efficiency bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define kv cache and inference efficiency in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng kv cache và inference efficiency.
  answer_en: A strong answer names the input, transformation, output and the context where kv cache and inference efficiency
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-10-genai-transformers-genai-transformers-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng kv cache và inference efficiency cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies kv cache and inference efficiency to an AI engineering problem.
  answer_vi: Ví dụ cho kv cache và inference efficiency cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-10-genai-transformers-genai-transformers-4).
  answer_en: The kv cache and inference efficiency example should have an explicit input, expected output and a way to run
    or verify it (phase-10-genai-transformers-genai-transformers-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-10-genai-transformers-genai-transformers-4-debug
  type: debug
  question_vi: Nếu kết quả của kv cache và inference efficiency sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If kv cache and inference efficiency produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với kv cache và inference efficiency, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-10-genai-transformers-genai-transformers-4).
  answer_en: For kv cache and inference efficiency, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-10-genai-transformers-genai-transformers-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-10-genai-transformers-genai-transformers-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của kv cache và inference efficiency như thế
    nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of kv cache and inference efficiency?
  answer_vi: Câu trả lời về kv cache và inference efficiency cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-10-genai-transformers-genai-transformers-4).
  answer_en: The answer about kv cache and inference efficiency should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-10-genai-transformers-genai-transformers-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# KV cache và inference efficiency / KV cache and inference efficiency

KV cache và inference efficiency giải thích cách Transformer phân bổ trọng số cho token liên quan. Theo dõi shape của Q, K, V, mask và context length; khi tối ưu inference, KV cache giảm việc tính lại key/value nhưng đổi lại dùng thêm memory.

## Practice

Tự viết attention tối giản bằng PyTorch/NumPy, đo shape và so sánh inference có/không có cache.
