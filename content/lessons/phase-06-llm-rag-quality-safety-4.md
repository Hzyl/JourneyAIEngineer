---
lesson_id: phase-06-llm-rag-quality-safety-4
phase_id: phase-06-llm-rag
module_id: quality-safety
title_vi: Latency và token cost
title_en: Latency and token cost
summary_vi: Học Latency và token cost qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Latency and token cost through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích latency và token cost bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng latency và token cost.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain latency and token cost with a concrete example.
- Write or adapt a small code example applying latency and token cost.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-quality-safety-3
- phase-05-mlops-api-1
key_terms:
- latency
- token
- cost
- inference
- observability
- reproducibility
- deployment
- quality-safety
concept_notes_vi: 'Latency và token cost thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác
  định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả
  lỗi có thể xử lý.'
concept_notes_en: 'Latency và token cost belongs to LLM Application Engineering: design the contract between the application
  and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output as untrusted
  data and return actionable errors.'
why_it_matters_vi: Đo quality, latency, cost và safety cùng lúc; coi hallucination/injection là test case chứ không phải chuyện
  bất ngờ.
why_it_matters_en: Measure quality, latency, cost, and safety together; treat hallucinations and injection as test cases.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đo quality, latency, cost và safety cùng lúc; coi hallucination/injection là test case
  chứ không phải chuyện bất ngờ.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo rubric, golden set, adversarial set, cost log và dashboard lỗi theo loại.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Measure quality, latency, cost, and safety together; treat hallucinations and injection
  as test cases.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a rubric, golden set, adversarial set, cost log, and an error dashboard by category.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo rubric, golden set, adversarial set, cost log và dashboard lỗi theo loại.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn bảo vệ được một thay đổi model bằng số liệu quality–latency–cost, không chỉ cảm nhận.
    stretch: Viết thêm một failure test cho latency và token cost và giải thích kết quả.
  en:
    task: Create a rubric, golden set, adversarial set, cost log, and an error dashboard by category.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can defend a model change with quality–latency–cost evidence rather than intuition.
    stretch: Add a failure test for latency and token cost and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích latency và token cost cho một đồng đội mới như thế nào?
  - Một assumption nào của latency và token cost có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain latency and token cost to a new teammate?
  - Which assumption behind latency and token cost could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- p95 = percentile(latencies, 95)
- throughput = completed_requests / elapsed_seconds
code_examples:
- language: python
  title: 'Latency and token cost: inspect one complete path'
  code: "# Topic: Latency and token cost (phase-06-llm-rag-quality-safety-4)\nimport time\n\ndef timed_response(value: float)\
    \ -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms':\
    \ (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của latency và token cost.
  purpose_en: Illustrate the input-to-output path for latency and token cost.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Đo boundary nhỏ bằng input hợp lệ, output có schema và một chỉ số vận hành quan sát được.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Transformers Docs
  url: https://huggingface.co/docs/transformers/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Documentation
  url: https://faiss.ai/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Hugging Face Tokenizers
  url: https://huggingface.co/docs/transformers/main/en/tokenizer_summary
  language: en
  purpose_vi: Đo token thật trước khi nói về context và cost.
  read_vi: Đọc tokenizer, special tokens và truncation/padding.
  purpose_en: Measure real tokens before reasoning about context and cost.
  read_en: Read tokenizers, special tokens, and truncation/padding.
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
- exercise-6-quality-safety
review_item_ids:
- phase-06-llm-rag-quality-safety-4-recall
- phase-06-llm-rag-quality-safety-4-application
- phase-06-llm-rag-quality-safety-4-debug
- phase-06-llm-rag-quality-safety-4-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của latency và token cost.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng latency và token cost và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng latency và token cost.
- Đánh giá latency và token cost bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ latency và token cost mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-adaptation-1
- phase-06-llm-rag-adaptation-2
review_question_vi: Định nghĩa latency và token cost bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define latency and token cost in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng latency và token cost. Hãy liên
  hệ cụ thể với latency và token cost trong lesson phase-06-llm-rag-quality-safety-4.
review_answer_en: A strong answer names the input, transformation, output and the context where latency and token cost is
  used. Relate it specifically to latency and token cost in lesson phase-06-llm-rag-quality-safety-4.
review_cards:
- id: phase-06-llm-rag-quality-safety-4-recall
  type: recall
  question_vi: Định nghĩa latency và token cost bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define latency and token cost in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng latency và token cost.
  answer_en: A strong answer names the input, transformation, output and the context where latency and token cost is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-quality-safety-4-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng latency và token cost cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies latency and token cost to an AI engineering problem.
  answer_vi: Ví dụ cho latency và token cost cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-quality-safety-4).
  answer_en: The latency and token cost example should have an explicit input, expected output and a way to run or verify
    it (phase-06-llm-rag-quality-safety-4).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-quality-safety-4-debug
  type: debug
  question_vi: Nếu kết quả của latency và token cost sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If latency and token cost produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với latency và token cost, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-06-llm-rag-quality-safety-4).
  answer_en: For latency and token cost, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-06-llm-rag-quality-safety-4).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-quality-safety-4-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của latency và token cost như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of latency and token cost?
  answer_vi: Câu trả lời về latency và token cost cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-quality-safety-4).
  answer_en: The answer about latency and token cost should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-06-llm-rag-quality-safety-4).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Latency và token cost / Latency and token cost

Latency và token cost thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.

## Practice

Tạo rubric, golden set, adversarial set, cost log và dashboard lỗi theo loại.
