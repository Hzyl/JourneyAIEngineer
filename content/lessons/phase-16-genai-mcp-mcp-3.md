---
lesson_id: phase-16-genai-mcp-mcp-3
phase_id: phase-16-genai-mcp
module_id: mcp
title_vi: MCP tools và resources
title_en: MCP tools and resources
summary_vi: Học MCP tools và resources qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn MCP tools and resources through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích mcp tools và resources bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng mcp tools và resources.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain mcp tools and resources with a concrete example.
- Write or adapt a small code example applying mcp tools and resources.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-16-genai-mcp-mcp-2
- phase-15-genai-agents-ai-agents-1
key_terms:
- mcp
- tools
- resources
- token
- embedding
- retrieval
- evaluation
concept_notes_vi: MCP tools và resources mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới
  hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.
concept_notes_en: MCP tools và resources extends a model with controlled actions. Tool schemas must validate inputs, limit
  permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval for side
  effects.
why_it_matters_vi: MCP chuẩn hóa cách model khám phá context và capability, nhưng không loại bỏ trách nhiệm về quyền truy
  cập.
why_it_matters_en: MCP standardizes how models discover context and capabilities without removing access-control responsibility.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: MCP chuẩn hóa cách model khám phá context và capability, nhưng không loại bỏ trách nhiệm
  về quyền truy cập.'
- Mở MCP Getting Started, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết MCP server local cung cấp một resource và một tool read-only, kiểm tra schema và quyền truy cập.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: MCP standardizes how models discover context and capabilities without removing access-control
  responsibility.'
- Open MCP Getting Started, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a local MCP server exposing one resource and one read-only tool, then test schemas and
  access control.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết MCP server local cung cấp một resource và một tool read-only, kiểm tra schema và quyền truy cập.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn vẽ được flow client/server, phân biệt tool với resource/prompt và nêu được threat model tối thiểu.
    stretch: Viết thêm một failure test cho mcp tools và resources và giải thích kết quả.
  en:
    task: Write a local MCP server exposing one resource and one read-only tool, then test schemas and access control.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the client/server flow, distinguish tools from resources/prompts, and state a minimum threat
      model.
    stretch: Add a failure test for mcp tools and resources and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích mcp tools và resources cho một đồng đội mới như thế nào?
  - Một assumption nào của mcp tools và resources có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain mcp tools and resources to a new teammate?
  - Which assumption behind mcp tools and resources could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'MCP tools and resources: inspect one complete path'
  code: "# Topic: MCP tools and resources (phase-16-genai-mcp-mcp-3)\ndef grounded_answer(answer: str, evidence: list[str])\
    \ -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\nSources: ' + '; '.join(evidence)\n\
    \nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của mcp tools và resources.
  purpose_en: Illustrate the input-to-output path for mcp tools and resources.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: MCP Getting Started
  url: https://modelcontextprotocol.io/docs/getting-started/intro
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MCP Specification
  url: https://modelcontextprotocol.io/specification/2025-06-18
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MCP Python SDK
  url: https://github.com/modelcontextprotocol/python-sdk
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
- exercise-16-mcp
review_item_ids:
- phase-16-genai-mcp-mcp-3-recall
- phase-16-genai-mcp-mcp-3-application
- phase-16-genai-mcp-mcp-3-debug
- phase-16-genai-mcp-mcp-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của mcp tools và resources.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng mcp tools và resources và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng mcp tools và resources.
- Đánh giá mcp tools và resources bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ mcp tools và resources mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-16-genai-mcp-mcp-4
- phase-17-genai-evaluation-genai-evaluation-1
review_question_vi: Định nghĩa mcp tools và resources bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define mcp tools and resources in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng mcp tools và resources. Hãy liên
  hệ cụ thể với mcp tools và resources trong lesson phase-16-genai-mcp-mcp-3.
review_answer_en: A strong answer names the input, transformation, output and the context where mcp tools and resources is
  used. Relate it specifically to mcp tools and resources in lesson phase-16-genai-mcp-mcp-3.
review_cards:
- id: phase-16-genai-mcp-mcp-3-recall
  type: recall
  question_vi: Định nghĩa mcp tools và resources bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define mcp tools and resources in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng mcp tools và resources.
  answer_en: A strong answer names the input, transformation, output and the context where mcp tools and resources is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-16-genai-mcp-mcp-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng mcp tools và resources cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies mcp tools and resources to an AI engineering problem.
  answer_vi: Ví dụ cho mcp tools và resources cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-16-genai-mcp-mcp-3).
  answer_en: The mcp tools and resources example should have an explicit input, expected output and a way to run or verify
    it (phase-16-genai-mcp-mcp-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-16-genai-mcp-mcp-3-debug
  type: debug
  question_vi: Nếu kết quả của mcp tools và resources sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If mcp tools and resources produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với mcp tools và resources, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-16-genai-mcp-mcp-3).
  answer_en: For mcp tools and resources, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-16-genai-mcp-mcp-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-16-genai-mcp-mcp-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của mcp tools và resources như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of mcp tools and resources?
  answer_vi: Câu trả lời về mcp tools và resources cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-16-genai-mcp-mcp-3).
  answer_en: The answer about mcp tools and resources should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-16-genai-mcp-mcp-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# MCP tools và resources / MCP tools and resources

MCP tools và resources mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.

## Practice

Viết MCP server local cung cấp một resource và một tool read-only, kiểm tra schema và quyền truy cập.
