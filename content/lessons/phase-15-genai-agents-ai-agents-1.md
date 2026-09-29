---
lesson_id: phase-15-genai-agents-ai-agents-1
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Planning và task decomposition
title_en: Planning and task decomposition
summary_vi: Học Planning và task decomposition qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Planning and task decomposition through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích planning và task decomposition bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng planning và task decomposition.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain planning and task decomposition with a concrete example.
- Write or adapt a small code example applying planning and task decomposition.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-4
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- planning
- task
- decomposition
- token
- embedding
- retrieval
- evaluation
- ai-agents
concept_notes_vi: Planning và task decomposition mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input,
  giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.
concept_notes_en: Planning và task decomposition extends a model with controlled actions. Tool schemas must validate inputs,
  limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval
  for side effects.
why_it_matters_vi: Agent là một vòng lặp điều khiển có state và side effect; độ tin cậy đến từ giới hạn và quan sát được.
why_it_matters_en: An agent is a control loop with state and side effects; reliability comes from limits and observability.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Agent là một vòng lặp điều khiển có state và side effect; độ tin cậy đến từ giới hạn
  và quan sát được.'
- Mở Building Effective Agents, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Xây research agent tối giản có max steps, tool allowlist, memory state và bước phê duyệt trước side
  effect.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: An agent is a control loop with state and side effects; reliability comes from limits
  and observability.'
- Open Building Effective Agents, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build a minimal research agent with max steps, a tool allowlist, memory state, and approval
  before side effects.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Xây research agent tối giản có max steps, tool allowlist, memory state và bước phê duyệt trước side effect.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Agent dừng đúng khi đạt mục tiêu hoặc gặp guardrail; mọi tool call có lý do, input và output để review.
    stretch: Viết thêm một failure test cho planning và task decomposition và giải thích kết quả.
  en:
    task: Build a minimal research agent with max steps, a tool allowlist, memory state, and approval before side effects.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: The agent stops when it reaches the goal or a guardrail, and every tool call has reviewable intent, input,
      and output.
    stretch: Add a failure test for planning and task decomposition and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích planning và task decomposition cho một đồng đội mới như thế nào?
  - Một assumption nào của planning và task decomposition có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain planning and task decomposition to a new teammate?
  - Which assumption behind planning and task decomposition could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Planning and task decomposition: inspect one complete path'
  code: "# Topic: Planning and task decomposition (phase-15-genai-agents-ai-agents-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của planning và task decomposition.
  purpose_en: Illustrate the input-to-output path for planning and task decomposition.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Building Effective Agents
  url: https://www.anthropic.com/research/building-effective-agents
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: LangGraph Documentation
  url: https://langchain-ai.github.io/langgraph/
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
- exercise-15-ai-agents
review_item_ids:
- phase-15-genai-agents-ai-agents-1-recall
- phase-15-genai-agents-ai-agents-1-application
- phase-15-genai-agents-ai-agents-1-debug
- phase-15-genai-agents-ai-agents-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của planning và task decomposition.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng planning và task decomposition và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng planning và task decomposition.
- Đánh giá planning và task decomposition bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ planning và task decomposition mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-15-genai-agents-ai-agents-2
- phase-15-genai-agents-ai-agents-3
review_question_vi: Định nghĩa planning và task decomposition bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define planning and task decomposition in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng planning và task decomposition.
  Hãy liên hệ cụ thể với planning và task decomposition trong lesson phase-15-genai-agents-ai-agents-1.
review_answer_en: A strong answer names the input, transformation, output and the context where planning and task decomposition
  is used. Relate it specifically to planning and task decomposition in lesson phase-15-genai-agents-ai-agents-1.
review_cards:
- id: phase-15-genai-agents-ai-agents-1-recall
  type: recall
  question_vi: Định nghĩa planning và task decomposition bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define planning and task decomposition in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng planning và task decomposition.
  answer_en: A strong answer names the input, transformation, output and the context where planning and task decomposition
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng planning và task decomposition cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies planning and task decomposition to an AI engineering problem.
  answer_vi: Ví dụ cho planning và task decomposition cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-15-genai-agents-ai-agents-1).
  answer_en: The planning and task decomposition example should have an explicit input, expected output and a way to run or
    verify it (phase-15-genai-agents-ai-agents-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-1-debug
  type: debug
  question_vi: Nếu kết quả của planning và task decomposition sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If planning and task decomposition produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với planning và task decomposition, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-15-genai-agents-ai-agents-1).
  answer_en: For planning and task decomposition, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-15-genai-agents-ai-agents-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của planning và task decomposition như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of planning and task decomposition?
  answer_vi: Câu trả lời về planning và task decomposition cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-15-genai-agents-ai-agents-1).
  answer_en: The answer about planning and task decomposition should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-15-genai-agents-ai-agents-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Planning và task decomposition / Planning and task decomposition

Planning và task decomposition mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.

## Practice

Xây research agent tối giản có max steps, tool allowlist, memory state và bước phê duyệt trước side effect.
