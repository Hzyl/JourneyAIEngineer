---
lesson_id: phase-06-llm-rag-quality-safety-3
phase_id: phase-06-llm-rag
module_id: quality-safety
title_vi: Prompt injection
title_en: Prompt injection
summary_vi: Học Prompt injection qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Prompt injection through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích prompt injection bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng prompt injection.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain prompt injection with a concrete example.
- Write or adapt a small code example applying prompt injection.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-quality-safety-2
- phase-05-mlops-api-1
key_terms:
- prompt
- injection
- token
- embedding
- retrieval
- evaluation
- quality-safety
concept_notes_vi: 'Prompt injection thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định
  instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có
  thể xử lý.'
concept_notes_en: 'Prompt injection belongs to LLM Application Engineering: design the contract between the application and
  the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output as untrusted
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
    stretch: Viết thêm một failure test cho prompt injection và giải thích kết quả.
  en:
    task: Create a rubric, golden set, adversarial set, cost log, and an error dashboard by category.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can defend a model change with quality–latency–cost evidence rather than intuition.
    stretch: Add a failure test for prompt injection and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích prompt injection cho một đồng đội mới như thế nào?
  - Một assumption nào của prompt injection có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain prompt injection to a new teammate?
  - Which assumption behind prompt injection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Prompt injection: inspect one complete path'
  code: "# Topic: Prompt injection (phase-06-llm-rag-quality-safety-3)\ndef grounded_answer(answer: str, evidence: list[str])\
    \ -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: ' + '; '.join(evidence)\n\
    \nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của prompt injection.
  purpose_en: Illustrate the input-to-output path for prompt injection.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
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
- phase-06-llm-rag-quality-safety-3-recall
- phase-06-llm-rag-quality-safety-3-application
- phase-06-llm-rag-quality-safety-3-debug
- phase-06-llm-rag-quality-safety-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của prompt injection.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng prompt injection và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng prompt injection.
- Đánh giá prompt injection bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ prompt injection mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-quality-safety-4
- phase-06-llm-rag-adaptation-1
review_question_vi: Định nghĩa prompt injection bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define prompt injection in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng prompt injection. Hãy liên hệ cụ
  thể với prompt injection trong lesson phase-06-llm-rag-quality-safety-3.
review_answer_en: A strong answer names the input, transformation, output and the context where prompt injection is used.
  Relate it specifically to prompt injection in lesson phase-06-llm-rag-quality-safety-3.
review_cards:
- id: phase-06-llm-rag-quality-safety-3-recall
  type: recall
  question_vi: Định nghĩa prompt injection bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define prompt injection in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng prompt injection.
  answer_en: A strong answer names the input, transformation, output and the context where prompt injection is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-quality-safety-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng prompt injection cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies prompt injection to an AI engineering problem.
  answer_vi: Ví dụ cho prompt injection cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-quality-safety-3).
  answer_en: The prompt injection example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-quality-safety-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-quality-safety-3-debug
  type: debug
  question_vi: Nếu kết quả của prompt injection sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If prompt injection produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với prompt injection, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-06-llm-rag-quality-safety-3).
  answer_en: For prompt injection, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-06-llm-rag-quality-safety-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-quality-safety-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của prompt injection như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of prompt injection?
  answer_vi: Câu trả lời về prompt injection cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-quality-safety-3).
  answer_en: The answer about prompt injection should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-quality-safety-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Prompt injection / Prompt injection

Prompt injection thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.

## Practice

Tạo rubric, golden set, adversarial set, cost log và dashboard lỗi theo loại.
