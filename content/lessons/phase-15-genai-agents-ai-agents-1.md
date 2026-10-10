---
lesson_id: phase-15-genai-agents-ai-agents-1
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Lập kế hoạch và chia nhỏ nhiệm vụ
title_en: Planning and task decomposition
summary_vi: Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra.
summary_en: Learn Planning and task decomposition through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.
- Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều
  chỉnh khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.
concept_notes_en: Planning và task decomposition extends a model with controlled actions. Tool schemas must validate
  inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and
  human approval for side effects.
why_it_matters_vi: Agent cần trạng thái, giới hạn và dấu vết rõ để hành động có thể kiểm tra.
why_it_matters_en: An agent is a control loop with state and side effects; reliability comes from limits and observability.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Planning and task decomposition” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.
- Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: An agent is a control loop with state and side effects; reliability comes
  from limits and observability.'
- Open Building Effective Agents, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build a minimal research agent with max steps, a tool allowlist, memory state, and
  approval before side effects.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây agent nghiên cứu nhỏ có giới hạn
      bước, danh sách công cụ được phép, trạng thái và bước duyệt trước thao tác có ảnh hưởng.'
    deliverables:
    - Kế hoạch hoặc chuỗi hành động có trạng thái và giới hạn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Build a minimal research agent with max steps, a tool allowlist, memory state, and approval before side
      effects.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: The agent stops when it reaches the goal or a guardrail, and every tool call has reviewable intent,
      input, and output.
    stretch: Add a failure test for planning and task decomposition and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lập kế hoạch và chia nhỏ nhiệm vụ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain planning and task decomposition to a new teammate?
  - Which assumption behind planning and task decomposition could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Planning and task decomposition: inspect one complete path'
  code: "# Topic: Planning and task decomposition (phase-15-genai-agents-ai-agents-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for planning and task decomposition.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Building Effective Agents
  url: https://www.anthropic.com/research/building-effective-agents
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: LangGraph Documentation
  url: https://langchain-ai.github.io/langgraph/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: OpenAI Cookbook
  url: https://cookbook.openai.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
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
- Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.
- Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.
common_mistakes:
- Cho agent tiếp tục vô hạn hoặc bỏ qua yêu cầu người duyệt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-15-genai-agents-ai-agents-2
- phase-15-genai-agents-ai-agents-3
review_question_vi: Nội dung cốt lõi của “Lập kế hoạch và chia nhỏ nhiệm vụ” là gì?
review_question_en: Define planning and task decomposition in your own words. What are the input, transformation
  and output?
review_answer_vi: Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều
  chỉnh khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.
review_answer_en: A strong answer names the input, transformation, output and the context where planning and task
  decomposition is used. Relate it specifically to planning and task decomposition in lesson phase-15-genai-agents-ai-agents-1.
review_cards:
- id: phase-15-genai-agents-ai-agents-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lập kế hoạch và chia nhỏ nhiệm vụ” là gì?
  question_en: Define planning and task decomposition in your own words. What are the input, transformation and
    output?
  answer_vi: Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều chỉnh
    khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.
  answer_en: A strong answer names the input, transformation, output and the context where planning and task decomposition
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-1-application
  type: application
  question_vi: Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.
  question_en: Write a small code example or design that applies planning and task decomposition to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp”, cần lưu: kế hoạch
    hoặc chuỗi hành động có trạng thái và giới hạn. Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.'
  answer_en: The planning and task decomposition example should have an explicit input, expected output and a way
    to run or verify it (phase-15-genai-agents-ai-agents-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-1-debug
  type: debug
  question_vi: Khi làm bài “Lập kế hoạch và chia nhỏ nhiệm vụ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If planning and task decomposition produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Lập kế hoạch và chia nhỏ nhiệm vụ”, lỗi cần tránh là: cho agent tiếp tục vô hạn hoặc bỏ
    qua yêu cầu người duyệt. Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For planning and task decomposition, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-15-genai-agents-ai-agents-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lập kế hoạch và chia nhỏ nhiệm vụ” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of planning and task decomposition?
  answer_vi: Bắt đầu từ nhiệm vụ “Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about planning and task decomposition should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-15-genai-agents-ai-agents-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Lập kế hoạch và chia nhỏ nhiệm vụ / Planning and task decomposition

Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều chỉnh khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.

## Thực hành

Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây agent nghiên cứu nhỏ có giới hạn bước, danh sách công cụ được phép, trạng thái và bước duyệt trước thao tác có ảnh hưởng.
