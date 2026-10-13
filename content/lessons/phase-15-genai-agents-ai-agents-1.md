---
lesson_id: phase-15-genai-agents-ai-agents-1
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Lập kế hoạch và chia nhỏ nhiệm vụ
title_en: Planning and task decomposition
summary_vi: Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra.
summary_en: Plan steps with explicit inputs, observations and stop conditions; revise the next action when
  a lookup fails.
learning_objectives:
- Chia nhiệm vụ thành các bước và nêu điều kiện chuyển sang bước tiếp.
- Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Separate intended steps from observed execution state.
- Compare a fixed workflow with a scripted adaptive policy on the same lookup task.
- Verify call limits, tool failures and explicit stop reasons.
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
concept_notes_vi: |-
  Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều chỉnh khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.

  Danh sách bước là dự định; trạng thái thực thi cho biết bước nào đã có bằng chứng hoàn thành. Chia nhiệm vụ hữu ích khi làm rõ phụ thuộc: phải có dữ liệu trước khi phân tích, và phải đánh giá kết quả trước khi báo xong.

  Ví dụ, agent đọc tài liệu, tìm điều khoản rồi soạn câu trả lời; nếu không đọc được nguồn thì cần sửa cách lấy dữ liệu hoặc báo thiếu. Tự kiểm tra: kế hoạch viết rất chi tiết có bảo đảm thành công không? Không; phải kiểm tra đầu ra từng bước, cập nhật khi giả định sai và tránh thực hiện bước sau bằng dữ liệu tưởng tượng.
concept_notes_en: |-
  A plan divides a goal into steps with inputs, outputs and verification conditions. Agents should revise plans when observations contradict assumptions.

  A step list states intentions; execution state records what evidence supports completion. Useful decomposition exposes dependencies: obtain data before analysis and evaluate results before claiming success.

  An agent may read a document, locate a clause and draft an answer; failed reading requires recovery or a missing-evidence report. Self-check: does a detailed plan guarantee success? No: inspect each output, revise failed assumptions and do not continue using imagined data.
why_it_matters_vi: Agent cần trạng thái, giới hạn và dấu vết rõ để hành động có thể kiểm tra.
why_it_matters_en: An agent is a control loop with state and side effects; reliability comes from limits and observability.
study_steps_vi:
- Đọc phần kiến thức và phân biệt kế hoạch dự kiến với kết quả đã quan sát.
- Lưu ví dụ thành agent_loop.py rồi chạy bằng Python 3.11 trở lên; không cần API key.
- So trace của workflow cố định với chính sách mô phỏng biết thử truy vấn khác.
- Đổi max_calls thành 1 và thử truy vấn timeout; kiểm tra lý do dừng.
- 'Ghi giới hạn: đây là bộ điều khiển giả lập, chưa kiểm tra khả năng quyết định của LLM hay hiệu quả agent
  thật.'
study_steps_en:
- Distinguish intended plans from observed execution state.
- Save the example as agent_loop.py and run with Python 3.11 or newer; no API key is needed.
- Compare traces from the fixed workflow and scripted adaptive policy.
- Set max_calls to 1 and try the timeout query; check stop reasons.
- 'Record the limit: this is a simulated controller, not a test of LLM decisions or real-agent effectiveness.'
practice_plan:
  vi:
    task: Chạy workflow cố định và bộ điều khiển mô phỏng trên cùng nhiệm vụ chỉ đọc. Bổ sung case không có
      nguồn, công cụ lỗi và lời gọi lặp; lưu trace cùng lý do dừng cho từng case.
    deliverables:
    - Hai chính sách dùng cùng kho tài liệu giả
    - 'Kết quả từng case: đầu ra, số lần gọi và lý do dừng'
    - Giải thích điều mô phỏng chưa đo được ở LLM thật
    checkpoint: Không vượt giới hạn lời gọi, chỉ dùng search/read_document và không diễn giải văn bản nguồn
      thành lệnh thực thi.
    stretch: Thêm kiểm thử tài liệu chứa yêu cầu gọi công cụ ngoài quyền; giải thích vì sao kiểm thử giả lập
      chưa chứng minh chống prompt injection với LLM.
  en:
    task: Run a fixed workflow and simulated adaptive controller on the same read-only task. Add missing-source,
      tool-error and repeated-call cases; save each trace and stop reason.
    deliverables:
    - Two policies using the same synthetic corpus
    - Per-case output, call count and stop reason
    - An explanation of what the simulation does not measure in real LLMs
    checkpoint: Respect call limits, use only search/read_document and never interpret source text as executable
      instructions.
    stretch: Test a document requesting an unauthorized tool; explain why this simulated test does not establish
      LLM prompt-injection resistance.
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
  title: Quan sát rồi chọn bước tiếp / Observe before choosing the next step
  status: runnable
  code: "DOCUMENTS = {'guide': 'Học theo nhịp riêng; ghi lại nguồn và kết quả.'}\n\n\ndef search(query):\n\
    \    if not isinstance(query, str) or not query.strip():\n        raise ValueError('invalid query')\n \
    \   if query == 'timeout':\n        raise TimeoutError('simulated timeout')\n    return ['guide'] if query\
    \ == 'học' else []\n\n\ndef read_document(document_id):\n    return DOCUMENTS[document_id]\n\n\nTOOLS =\
    \ {'search': search, 'read_document': read_document}\n\n\ndef run(query, max_calls=5, adaptive=True, tools=None):\n\
    \    tools = TOOLS if tools is None else tools\n    if not isinstance(query, str) or not query.strip():\n\
    \        return {'stop': 'invalid_input', 'trace': [], 'evidence': None}\n    if type(max_calls) is not\
    \ int or not 1 <= max_calls <= 5:\n        raise ValueError('max_calls must be 1..5')\n    trace, seen,\
    \ evidence = [], set(), None\n    action, argument = 'search', query\n    for _ in range(max_calls):\n\
    \        call = (action, argument)\n        if call in seen:\n            return {'stop': 'repeated_call',\
    \ 'trace': trace, 'evidence': evidence}\n        seen.add(call)\n        try:\n            result = tools[action](argument)\n\
    \        except (TimeoutError, ValueError, KeyError) as error:\n            trace.append({'tool': action,\
    \ 'input': argument, 'error': type(error).__name__})\n            return {'stop': 'tool_error', 'trace':\
    \ trace, 'evidence': evidence}\n        trace.append({'tool': action, 'input': argument, 'output': result})\n\
    \        if action == 'read_document':\n            return {'stop': 'evidence_found', 'trace': trace, 'evidence':\
    \ result}\n        if result:\n            action, argument = 'read_document', result[0]\n        elif\
    \ adaptive:\n            argument = 'học'  # Scripted policy; no LLM decision is being tested.\n      \
    \  else:\n            return {'stop': 'no_results', 'trace': trace, 'evidence': None}\n    return {'stop':\
    \ 'call_limit', 'trace': trace, 'evidence': evidence}\n\n\nif __name__ == '__main__':\n    fixed = run('cách\
    \ ôn', adaptive=False)\n    adaptive = run('cách ôn')\n    assert fixed['stop'] == 'no_results'\n    assert\
    \ adaptive['stop'] == 'evidence_found' and len(adaptive['trace']) == 3\n    assert run('cách ôn', max_calls=1)['stop']\
    \ == 'call_limit'\n    assert run('timeout')['stop'] == 'tool_error'\n    assert run('')['stop'] == 'invalid_input'\n\
    \    empty_tools = {**TOOLS, 'search': lambda query: []}\n    assert run('cách ôn', tools=empty_tools)['stop']\
    \ == 'repeated_call'\n    print(fixed['stop'], adaptive['stop'], len(adaptive['trace']))\n    print('call\
    \ limit, timeout and invalid input: checked')\n"
  setup: Python 3.11+; lưu thành agent_loop.py rồi chạy python agent_loop.py. Standard library only.
  expected_output: 'no_results evidence_found 3

    call limit, timeout and invalid input: checked'
  purpose_vi: So workflow cố định với chính sách mô phỏng thay truy vấn sau khi không có kết quả; lưu trace
    và lý do dừng.
  purpose_en: Compare a fixed workflow with a scripted policy that revises an unsuccessful query; retain traces
    and stop reasons.
  edge_case_vi: Thử max_calls=1, truy vấn rỗng và timeout giả lập. Chỉ có hai công cụ đọc được định nghĩa sẵn;
    nội dung tài liệu không được chuyển thành lệnh.
  edge_case_en: Try max_calls=1, empty input and a simulated timeout. Only two predefined read tools exist;
    document text is never converted into an instruction.
  explanation_vi: Chính sách thay truy vấn bằng từ học được viết cố định để quan sát vòng lặp. Nó không chứng
    minh agent dùng LLM tốt hơn workflow. Timeout là lỗi giả lập từ công cụ, chưa phải cơ chế ngắt một API
    đang treo. Trace lưu công cụ, đầu vào, đầu ra hoặc lỗi, không lưu suy nghĩ nội bộ.
  explanation_en: The fallback query is scripted to expose loop behavior, not to demonstrate that an LLM agent
    outperforms a workflow. Timeout is a simulated tool exception, not cancellation of a hanging API. Traces
    contain tools, inputs, outputs or errors, not private model reasoning.
resources:
- title: Lab B · Colab
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb
  language: vi
  kind: practice
  required: false
  purpose_vi: So sánh workflow và agent theo kịch bản trên Colab, không gọi model hay API trả phí.
  purpose_en: Compare a workflow and scripted agent on Colab without a model or paid API.
  read_vi: Đọc trace, giới hạn số lần gọi và lý do dừng; giải thích một ca sai rồi tải báo cáo.
  read_en: Inspect traces, call limits and stop reasons; explain one failure and download the report.
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
- language: en
  title: "UC Berkeley: LLM Agents (Fall 2024)"
  url: https://rdi.berkeley.edu/llm-agents/f24
  kind: official
  required: false
  purpose_vi: "Đề cương lưu trữ bao quát nền tảng agent LLM, suy luận, lập kế hoạch, dùng công cụ, RAG, đánh giá và an toàn."
  purpose_en: "Archived syllabus covering LLM-agent foundations, reasoning, planning, tool use, RAG, evaluation, and safety."
  read_vi: "Chọn một tuần và tài liệu gắn với bài toán đang học; đây là môn Fall 2024 lưu trữ, không phải thông báo tuyển sinh hiện hành."
  read_en: "Select a week and readings relevant to the current problem; this is an archived Fall 2024 course, not a current enrollment announcement."
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

Danh sách bước là dự định; trạng thái thực thi cho biết bước nào đã có bằng chứng hoàn thành. Chia nhiệm vụ hữu ích khi làm rõ phụ thuộc: phải có dữ liệu trước khi phân tích, và phải đánh giá kết quả trước khi báo xong.

Ví dụ, agent đọc tài liệu, tìm điều khoản rồi soạn câu trả lời; nếu không đọc được nguồn thì cần sửa cách lấy dữ liệu hoặc báo thiếu. Tự kiểm tra: kế hoạch viết rất chi tiết có bảo đảm thành công không? Không; phải kiểm tra đầu ra từng bước, cập nhật khi giả định sai và tránh thực hiện bước sau bằng dữ liệu tưởng tượng.

## Thực hành

Chạy workflow cố định và bộ điều khiển mô phỏng trên cùng nhiệm vụ chỉ đọc. Bổ sung case không có nguồn, công cụ lỗi và lời gọi lặp; lưu trace cùng lý do dừng cho từng case.
