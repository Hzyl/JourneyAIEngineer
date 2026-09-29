---
lesson_id: phase-11-llm-application-llm-application-3
phase_id: phase-11-llm-application
module_id: llm-application
title_vi: Structured output và JSON Schema
title_en: Structured outputs and JSON Schema
summary_vi: Học Structured output và JSON Schema qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập
  có edge case.
summary_en: Learn Structured outputs and JSON Schema through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích structured output và json schema bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng structured output và json schema.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain structured outputs and json schema with a concrete example.
- Write or adapt a small code example applying structured outputs and json schema.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-11-llm-application-llm-application-2
- phase-10-genai-transformers-genai-transformers-1
key_terms:
- structured
- output
- json
- schema
- token
- embedding
- retrieval
- evaluation
- llm-application
concept_notes_vi: Structured output và JSON Schema mô tả một boundary giữa dữ liệu và service. Một request tốt có schema,
  validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test
  cho dữ liệu rỗng hoặc sai kiểu.
concept_notes_en: Structured output và JSON Schema describes a boundary between data and a service. A sound request has a
  schema, validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes,
  and tests empty or malformed data.
why_it_matters_vi: LLM application engineering là thiết kế contract và failure boundary quanh model, không phải chỉ viết một
  prompt dài.
why_it_matters_en: LLM application engineering designs contracts and failure boundaries around a model, not just a long prompt.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: LLM application engineering là thiết kế contract và failure boundary quanh model, không
  phải chỉ viết một prompt dài.'
- Mở OpenAI Function Calling Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Xây LLM Chat API có schema request/response, streaming giả lập, retry có backoff và token budget.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: LLM application engineering designs contracts and failure boundaries around a model,
  not just a long prompt.'
- Open OpenAI Function Calling Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build an LLM Chat API with request/response schemas, simulated streaming, backoff retries,
  and a token budget.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Xây LLM Chat API có schema request/response, streaming giả lập, retry có backoff và token budget.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Một client khác có thể gọi API mà không biết prompt nội bộ; output sai schema và rate limit đều có test riêng.
    stretch: Viết thêm một failure test cho structured output và json schema và giải thích kết quả.
  en:
    task: Build an LLM Chat API with request/response schemas, simulated streaming, backoff retries, and a token budget.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Another client can call the API without knowing internal prompts, and schema failures plus rate limits have
      dedicated tests.
    stretch: Add a failure test for structured outputs and json schema and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích structured output và json schema cho một đồng đội mới như thế nào?
  - Một assumption nào của structured output và json schema có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain structured outputs and json schema to a new teammate?
  - Which assumption behind structured outputs and json schema could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Structured outputs and JSON Schema: inspect one complete path'
  code: "# Topic: Structured outputs and JSON Schema (phase-11-llm-application-llm-application-3)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của structured output và json schema.
  purpose_en: Illustrate the input-to-output path for structured outputs and json schema.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenAI Function Calling Guide
  url: https://platform.openai.com/docs/guides/function-calling
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: JSON Schema
  url: https://json-schema.org/learn/getting-started-step-by-step
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: OpenAI Cookbook
  url: https://cookbook.openai.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python CSV and JSON
  url: https://docs.python.org/3/library/csv.html
  language: en
  purpose_vi: Đọc/ghi dữ liệu tabular và cấu trúc với thư viện chuẩn.
  read_vi: Đọc dialect, DictReader/DictWriter và kiểm tra encoding.
  purpose_en: Read and write tabular and structured data with the standard library.
  read_en: Focus on dialects, DictReader/DictWriter, and encoding.
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
- exercise-11-llm-application
review_item_ids:
- phase-11-llm-application-llm-application-3-recall
- phase-11-llm-application-llm-application-3-application
- phase-11-llm-application-llm-application-3-debug
- phase-11-llm-application-llm-application-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của structured output và json schema.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng structured output và json schema và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng structured output và json schema.
- Đánh giá structured output và json schema bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ structured output và json schema mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-11-llm-application-llm-application-4
- phase-12-genai-rag-rag-foundations-1
review_question_vi: Định nghĩa structured output và json schema bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define structured outputs and json schema in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured output và json schema.
  Hãy liên hệ cụ thể với structured output và json schema trong lesson phase-11-llm-application-llm-application-3.
review_answer_en: A strong answer names the input, transformation, output and the context where structured outputs and json
  schema is used. Relate it specifically to structured outputs and json schema in lesson phase-11-llm-application-llm-application-3.
review_cards:
- id: phase-11-llm-application-llm-application-3-recall
  type: recall
  question_vi: Định nghĩa structured output và json schema bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define structured outputs and json schema in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng structured output và json schema.
  answer_en: A strong answer names the input, transformation, output and the context where structured outputs and json schema
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-11-llm-application-llm-application-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng structured output và json schema cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies structured outputs and json schema to an AI engineering problem.
  answer_vi: Ví dụ cho structured output và json schema cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-11-llm-application-llm-application-3).
  answer_en: The structured outputs and json schema example should have an explicit input, expected output and a way to run
    or verify it (phase-11-llm-application-llm-application-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-11-llm-application-llm-application-3-debug
  type: debug
  question_vi: Nếu kết quả của structured output và json schema sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If structured outputs and json schema produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với structured output và json schema, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-11-llm-application-llm-application-3).
  answer_en: For structured outputs and json schema, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-11-llm-application-llm-application-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-11-llm-application-llm-application-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của structured output và json schema như thế
    nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured outputs and json schema?
  answer_vi: Câu trả lời về structured output và json schema cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-11-llm-application-llm-application-3).
  answer_en: The answer about structured outputs and json schema should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-11-llm-application-llm-application-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Structured output và JSON Schema / Structured outputs and JSON Schema

Structured output và JSON Schema mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.

## Practice

Xây LLM Chat API có schema request/response, streaming giả lập, retry có backoff và token budget.
