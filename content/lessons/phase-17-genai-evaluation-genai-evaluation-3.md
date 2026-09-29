---
lesson_id: phase-17-genai-evaluation-genai-evaluation-3
phase_id: phase-17-genai-evaluation
module_id: genai-evaluation
title_vi: Agent evaluation và trajectory
title_en: Agent evaluation and trajectories
summary_vi: Học Agent evaluation và trajectory qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Agent evaluation and trajectories through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích agent evaluation và trajectory bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng agent evaluation và trajectory.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain agent evaluation and trajectories with a concrete example.
- Write or adapt a small code example applying agent evaluation and trajectories.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-17-genai-evaluation-genai-evaluation-2
- phase-16-genai-mcp-mcp-1
key_terms:
- agent
- evaluation
- trajectory
- token
- embedding
- retrieval
- genai-evaluation
concept_notes_vi: Agent evaluation và trajectory mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input,
  giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.
concept_notes_en: Agent evaluation và trajectory extends a model with controlled actions. Tool schemas must validate inputs,
  limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human approval
  for side effects.
why_it_matters_vi: Evaluation là cách phân biệt demo nghe hay với hệ thống đáng tin và có thể cải thiện.
why_it_matters_en: Evaluation distinguishes a fluent demo from a trustworthy system that can improve.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Evaluation là cách phân biệt demo nghe hay với hệ thống đáng tin và có thể cải thiện.'
- Mở OpenAI Evals, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Evaluation distinguishes a fluent demo from a trustworthy system that can improve.'
- Open OpenAI Evals, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a golden set, rubric, and regression suite for RAG/agents, recording failures and cost
  for every run.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn biết metric nào đo retrieval, metric nào đo grounded answer và khi nào human review bắt buộc.
    stretch: Viết thêm một failure test cho agent evaluation và trajectory và giải thích kết quả.
  en:
    task: Create a golden set, rubric, and regression suite for RAG/agents, recording failures and cost for every run.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can identify retrieval metrics, grounded-answer metrics, and when human review is required.
    stretch: Add a failure test for agent evaluation and trajectories and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích agent evaluation và trajectory cho một đồng đội mới như thế nào?
  - Một assumption nào của agent evaluation và trajectory có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain agent evaluation and trajectories to a new teammate?
  - Which assumption behind agent evaluation and trajectories could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Agent evaluation and trajectories: inspect one complete path'
  code: "# Topic: Agent evaluation and trajectories (phase-17-genai-evaluation-genai-evaluation-3)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer +\
    \ '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của agent evaluation và trajectory.
  purpose_en: Illustrate the input-to-output path for agent evaluation and trajectories.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách evidence khỏi generation và từ chối khi không có bằng chứng đủ dùng.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: OpenAI Evals
  url: https://github.com/openai/evals
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ragas Documentation
  url: https://docs.ragas.io/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: DeepEval Documentation
  url: https://deepeval.com/docs/getting-started
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
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-3-recall
- phase-17-genai-evaluation-genai-evaluation-3-application
- phase-17-genai-evaluation-genai-evaluation-3-debug
- phase-17-genai-evaluation-genai-evaluation-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của agent evaluation và trajectory.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng agent evaluation và trajectory và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng agent evaluation và trajectory.
- Đánh giá agent evaluation và trajectory bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ agent evaluation và trajectory mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-4
- phase-18-genai-observability-genai-observability-1
review_question_vi: Định nghĩa agent evaluation và trajectory bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define agent evaluation and trajectories in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng agent evaluation và trajectory.
  Hãy liên hệ cụ thể với agent evaluation và trajectory trong lesson phase-17-genai-evaluation-genai-evaluation-3.
review_answer_en: A strong answer names the input, transformation, output and the context where agent evaluation and trajectories
  is used. Relate it specifically to agent evaluation and trajectories in lesson phase-17-genai-evaluation-genai-evaluation-3.
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-3-recall
  type: recall
  question_vi: Định nghĩa agent evaluation và trajectory bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define agent evaluation and trajectories in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng agent evaluation và trajectory.
  answer_en: A strong answer names the input, transformation, output and the context where agent evaluation and trajectories
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng agent evaluation và trajectory cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies agent evaluation and trajectories to an AI engineering problem.
  answer_vi: Ví dụ cho agent evaluation và trajectory cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-17-genai-evaluation-genai-evaluation-3).
  answer_en: The agent evaluation and trajectories example should have an explicit input, expected output and a way to run
    or verify it (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-3-debug
  type: debug
  question_vi: Nếu kết quả của agent evaluation và trajectory sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If agent evaluation and trajectories produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với agent evaluation và trajectory, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-17-genai-evaluation-genai-evaluation-3).
  answer_en: For agent evaluation and trajectories, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của agent evaluation và trajectory như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of agent evaluation and trajectories?
  answer_vi: Câu trả lời về agent evaluation và trajectory cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-17-genai-evaluation-genai-evaluation-3).
  answer_en: The answer about agent evaluation and trajectories should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Agent evaluation và trajectory / Agent evaluation and trajectories

Agent evaluation và trajectory mở rộng model bằng hành động có kiểm soát. Tool schema phải validate input, giới hạn quyền, timeout và retry; agent loop cần điều kiện dừng, log từng bước và human approval cho thao tác có side effect.

## Practice

Tạo golden set, rubric và regression suite cho RAG/agent; lưu cả lỗi và chi phí mỗi run.
