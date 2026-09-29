---
lesson_id: phase-15-genai-agents-ai-agents-2
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: 'Memory: state, history và retrieval'
title_en: 'Memory: state, history, and retrieval'
summary_vi: 'Học Memory: state, history và retrieval qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài
  tập có edge case.'
summary_en: 'Learn Memory: state, history, and retrieval through an input → transformation → output model, then verify it
  with an edge-case exercise.'
learning_objectives:
- 'Giải thích memory: state, history và retrieval bằng ví dụ cụ thể.'
- 'Viết hoặc sửa một đoạn code nhỏ áp dụng memory: state, history và retrieval.'
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- 'Explain memory: state, history, and retrieval with a concrete example.'
- 'Write or adapt a small code example applying memory: state, history, and retrieval.'
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-15-genai-agents-ai-agents-1
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- memory
- state
- history
- retrieval
- token
- embedding
- evaluation
- ai-agents
concept_notes_vi: 'Memory: state, history và retrieval là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval,
  reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness
  và câu trả lời không có bằng chứng.'
concept_notes_en: 'Memory: state, history và retrieval is one link in a RAG system. Separate parsing, chunking, indexing,
  retrieval, reranking, and generation so failures are attributable. Chunks need enough context; evaluation should measure
  retrieval recall, groundedness, and abstention when evidence is missing.'
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
    stretch: 'Viết thêm một failure test cho memory: state, history và retrieval và giải thích kết quả.'
  en:
    task: Build a minimal research agent with max steps, a tool allowlist, memory state, and approval before side effects.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: The agent stops when it reaches the goal or a guardrail, and every tool call has reviewable intent, input,
      and output.
    stretch: 'Add a failure test for memory: state, history, and retrieval and explain the result.'
interview_questions:
  vi:
  - 'Bạn sẽ giải thích memory: state, history và retrieval cho một đồng đội mới như thế nào?'
  - 'Một assumption nào của memory: state, history và retrieval có thể sai trong production?'
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - 'How would you explain memory: state, history, and retrieval to a new teammate?'
  - 'Which assumption behind memory: state, history, and retrieval could fail in production?'
  - Which metric or test would prove the result is trustworthy?
formulas:
- similarity(a,b) = (a · b) / (||a||₂ ||b||₂)
code_examples:
- language: python
  title: 'Memory: state, history, and retrieval: inspect one complete path'
  code: "# Topic: Memory: state, history, and retrieval (phase-15-genai-agents-ai-agents-2)\ndef grounded_answer(answer: str,\
    \ evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\\
    nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: 'Minh họa đường đi input → output của memory: state, history và retrieval.'
  purpose_en: 'Illustrate the input-to-output path for memory: state, history, and retrieval.'
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
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
- phase-15-genai-agents-ai-agents-2-recall
- phase-15-genai-agents-ai-agents-2-application
- phase-15-genai-agents-ai-agents-2-debug
- phase-15-genai-agents-ai-agents-2-interview
estimated_minutes: 60
completion_checklist:
- 'Giải thích được input, biến đổi và output của memory: state, history và retrieval.'
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- 'Mô tả được khi nào dùng memory: state, history và retrieval và khi nào cần baseline khác.'
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- 'Bỏ qua invariant hoặc shape khi áp dụng memory: state, history và retrieval.'
- 'Đánh giá memory: state, history và retrieval bằng một output tốt mà không có baseline hoặc failure case.'
- 'Sao chép ví dụ memory: state, history và retrieval mà không thay input và kiểm tra kết quả biên.'
next_lessons:
- phase-15-genai-agents-ai-agents-3
- phase-15-genai-agents-ai-agents-4
review_question_vi: 'Định nghĩa memory: state, history và retrieval bằng lời của bạn. Input, biến đổi và output là gì?'
review_question_en: 'Define memory: state, history, and retrieval in your own words. What are the input, transformation and
  output?'
review_answer_vi: 'Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng memory: state, history và retrieval.
  Hãy liên hệ cụ thể với memory: state, history và retrieval trong lesson phase-15-genai-agents-ai-agents-2.'
review_answer_en: 'A strong answer names the input, transformation, output and the context where memory: state, history, and
  retrieval is used. Relate it specifically to memory: state, history, and retrieval in lesson phase-15-genai-agents-ai-agents-2.'
review_cards:
- id: phase-15-genai-agents-ai-agents-2-recall
  type: recall
  question_vi: 'Định nghĩa memory: state, history và retrieval bằng lời của bạn. Input, biến đổi và output là gì?'
  question_en: 'Define memory: state, history, and retrieval in your own words. What are the input, transformation and output?'
  answer_vi: 'Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng memory: state, history và retrieval.'
  answer_en: 'A strong answer names the input, transformation, output and the context where memory: state, history, and retrieval
    is used.'
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-2-application
  type: application
  question_vi: 'Viết một ví dụ code hoặc thiết kế nhỏ áp dụng memory: state, history và retrieval cho bài toán AI Engineer.'
  question_en: 'Write a small code example or design that applies memory: state, history, and retrieval to an AI engineering
    problem.'
  answer_vi: 'Ví dụ cho memory: state, history và retrieval cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm
    chứng (phase-15-genai-agents-ai-agents-2).'
  answer_en: 'The memory: state, history, and retrieval example should have an explicit input, expected output and a way to
    run or verify it (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-2-debug
  type: debug
  question_vi: 'Nếu kết quả của memory: state, history và retrieval sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?'
  question_en: 'If memory: state, history, and retrieval produces a wrong result or a metric drops, what would you debug first?'
  answer_vi: 'Với memory: state, history và retrieval, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập
    lỗi bằng test nhỏ và error analysis (phase-15-genai-agents-ai-agents-2).'
  answer_en: 'For memory: state, history, and retrieval, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-2-interview
  type: interview
  question_vi: 'Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của memory: state, history và retrieval như
    thế nào?'
  question_en: 'In an interview, how would you explain a trade-off and one edge case of memory: state, history, and retrieval?'
  answer_vi: 'Câu trả lời về memory: state, history và retrieval cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi
    ro trong production (phase-15-genai-agents-ai-agents-2).'
  answer_en: 'The answer about memory: state, history, and retrieval should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Memory: state, history và retrieval / Memory: state, history, and retrieval

Memory: state, history và retrieval là một mắt xích của RAG. Tách parsing, chunking, indexing, retrieval, reranking và generation để biết lỗi nằm ở đâu. Chunk cần giữ đủ ngữ cảnh; evaluation phải đo retrieval recall, groundedness và câu trả lời không có bằng chứng.

## Practice

Xây research agent tối giản có max steps, tool allowlist, memory state và bước phê duyệt trước side effect.
