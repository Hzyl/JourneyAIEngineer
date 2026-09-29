---
lesson_id: phase-11-llm-application-llm-application-1
phase_id: phase-11-llm-application
module_id: llm-application
title_vi: Chat completion và message lifecycle
title_en: Chat completion and message lifecycle
summary_vi: Học Chat completion và message lifecycle qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài
  tập có edge case.
summary_en: Learn Chat completion and message lifecycle through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích chat completion và message lifecycle bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng chat completion và message lifecycle.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain chat completion and message lifecycle with a concrete example.
- Write or adapt a small code example applying chat completion and message lifecycle.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-10-genai-transformers-genai-transformers-4
- phase-10-genai-transformers-genai-transformers-1
key_terms:
- chat
- completion
- message
- lifecycle
- token
- embedding
- retrieval
- evaluation
- llm-application
concept_notes_vi: 'Chat completion và message lifecycle thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng
  và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin
  cậy và trả lỗi có thể xử lý.'
concept_notes_en: 'Chat completion và message lifecycle belongs to LLM Application Engineering: design the contract between
  the application and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse model
  output as untrusted data and return actionable errors.'
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
    stretch: Viết thêm một failure test cho chat completion và message lifecycle và giải thích kết quả.
  en:
    task: Build an LLM Chat API with request/response schemas, simulated streaming, backoff retries, and a token budget.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Another client can call the API without knowing internal prompts, and schema failures plus rate limits have
      dedicated tests.
    stretch: Add a failure test for chat completion and message lifecycle and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích chat completion và message lifecycle cho một đồng đội mới như thế nào?
  - Một assumption nào của chat completion và message lifecycle có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain chat completion and message lifecycle to a new teammate?
  - Which assumption behind chat completion and message lifecycle could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Chat completion and message lifecycle: inspect one complete path'
  code: "# Topic: Chat completion and message lifecycle (phase-11-llm-application-llm-application-1)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của chat completion và message lifecycle.
  purpose_en: Illustrate the input-to-output path for chat completion and message lifecycle.
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
- phase-11-llm-application-llm-application-1-recall
- phase-11-llm-application-llm-application-1-application
- phase-11-llm-application-llm-application-1-debug
- phase-11-llm-application-llm-application-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của chat completion và message lifecycle.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng chat completion và message lifecycle và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng chat completion và message lifecycle.
- Đánh giá chat completion và message lifecycle bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ chat completion và message lifecycle mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-11-llm-application-llm-application-2
- phase-11-llm-application-llm-application-3
review_question_vi: Định nghĩa chat completion và message lifecycle bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define chat completion and message lifecycle in your own words. What are the input, transformation and
  output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng chat completion và message lifecycle.
  Hãy liên hệ cụ thể với chat completion và message lifecycle trong lesson phase-11-llm-application-llm-application-1.
review_answer_en: A strong answer names the input, transformation, output and the context where chat completion and message
  lifecycle is used. Relate it specifically to chat completion and message lifecycle in lesson phase-11-llm-application-llm-application-1.
review_cards:
- id: phase-11-llm-application-llm-application-1-recall
  type: recall
  question_vi: Định nghĩa chat completion và message lifecycle bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define chat completion and message lifecycle in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng chat completion và message lifecycle.
  answer_en: A strong answer names the input, transformation, output and the context where chat completion and message lifecycle
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-11-llm-application-llm-application-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng chat completion và message lifecycle cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies chat completion and message lifecycle to an AI engineering
    problem.
  answer_vi: Ví dụ cho chat completion và message lifecycle cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-11-llm-application-llm-application-1).
  answer_en: The chat completion and message lifecycle example should have an explicit input, expected output and a way to
    run or verify it (phase-11-llm-application-llm-application-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-11-llm-application-llm-application-1-debug
  type: debug
  question_vi: Nếu kết quả của chat completion và message lifecycle sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If chat completion and message lifecycle produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với chat completion và message lifecycle, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-11-llm-application-llm-application-1).
  answer_en: For chat completion and message lifecycle, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-11-llm-application-llm-application-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-11-llm-application-llm-application-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của chat completion và message lifecycle như
    thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of chat completion and message lifecycle?
  answer_vi: Câu trả lời về chat completion và message lifecycle cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-11-llm-application-llm-application-1).
  answer_en: The answer about chat completion and message lifecycle should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-11-llm-application-llm-application-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chat completion và message lifecycle / Chat completion and message lifecycle

Chat completion và message lifecycle thuộc LLM Application Engineering: thiết kế contract giữa ứng dụng và model. Xác định instruction, input, output schema, timeout, retry và giới hạn token; parse output như dữ liệu không tin cậy và trả lỗi có thể xử lý.

## Practice

Xây LLM Chat API có schema request/response, streaming giả lập, retry có backoff và token budget.
