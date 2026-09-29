---
lesson_id: phase-06-llm-rag-transformers-3
phase_id: phase-06-llm-rag
module_id: transformers
title_vi: Prompt design
title_en: Prompt design
summary_vi: Học Prompt design qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Prompt design through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích prompt design bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng prompt design.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain prompt design with a concrete example.
- Write or adapt a small code example applying prompt design.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-transformers-2
- phase-05-mlops-api-1
key_terms:
- prompt
- design
- token
- embedding
- retrieval
- evaluation
- transformers
concept_notes_vi: 'Prompt design thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction,
  input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.'
concept_notes_en: 'Prompt design belongs to LLM Application Engineering: design the contract between the application and the
  model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model output as untrusted data
  and return actionable errors.'
why_it_matters_vi: Đi từ attention tới prompt và structured output, luôn kiểm tra schema thay vì tin raw text.
why_it_matters_en: Move from attention to prompts and structured outputs while validating schemas instead of trusting raw
  text.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đi từ attention tới prompt và structured output, luôn kiểm tra schema thay vì tin raw
  text.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Move from attention to prompts and structured outputs while validating schemas instead
  of trusting raw text.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a prompt with an input/output contract, test missing data, and validate JSON before downstream
  use.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn nhận diện được prompt ambiguity, output invalid và injection trong một flow cụ thể.
    stretch: Viết thêm một failure test cho prompt design và giải thích kết quả.
  en:
    task: Write a prompt with an input/output contract, test missing data, and validate JSON before downstream use.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can identify prompt ambiguity, invalid output, and injection in a concrete flow.
    stretch: Add a failure test for prompt design and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích prompt design cho một đồng đội mới như thế nào?
  - Một assumption nào của prompt design có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain prompt design to a new teammate?
  - Which assumption behind prompt design could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Prompt design: inspect one complete path'
  code: "# Topic: Prompt design (phase-06-llm-rag-transformers-3)\ndef grounded_answer(answer: str, evidence: list[str]) ->\
    \ str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: ' + '; '.join(evidence)\n\
    \nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của prompt design.
  purpose_en: Illustrate the input-to-output path for prompt design.
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
- exercise-6-transformers
review_item_ids:
- phase-06-llm-rag-transformers-3-recall
- phase-06-llm-rag-transformers-3-application
- phase-06-llm-rag-transformers-3-debug
- phase-06-llm-rag-transformers-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của prompt design.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng prompt design và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng prompt design.
- Đánh giá prompt design bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ prompt design mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-transformers-4
- phase-06-llm-rag-retrieval-1
review_question_vi: Định nghĩa prompt design bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define prompt design in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng prompt design. Hãy liên hệ cụ thể
  với prompt design trong lesson phase-06-llm-rag-transformers-3.
review_answer_en: A strong answer names the input, transformation, output and the context where prompt design is used. Relate
  it specifically to prompt design in lesson phase-06-llm-rag-transformers-3.
review_cards:
- id: phase-06-llm-rag-transformers-3-recall
  type: recall
  question_vi: Định nghĩa prompt design bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define prompt design in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng prompt design.
  answer_en: A strong answer names the input, transformation, output and the context where prompt design is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-transformers-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng prompt design cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies prompt design to an AI engineering problem.
  answer_vi: Ví dụ cho prompt design cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-transformers-3).
  answer_en: The prompt design example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-transformers-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-transformers-3-debug
  type: debug
  question_vi: Nếu kết quả của prompt design sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If prompt design produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với prompt design, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và
    error analysis (phase-06-llm-rag-transformers-3).
  answer_en: For prompt design, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a
    small test and error analysis (phase-06-llm-rag-transformers-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-transformers-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của prompt design như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of prompt design?
  answer_vi: Câu trả lời về prompt design cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-transformers-3).
  answer_en: The answer about prompt design should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-transformers-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Prompt design / Prompt design

Prompt design thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.

## Practice

Viết prompt có input/output contract, thử case thiếu dữ liệu và validate JSON trước khi dùng downstream.
