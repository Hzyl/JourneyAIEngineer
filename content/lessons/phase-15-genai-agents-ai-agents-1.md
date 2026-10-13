---
lesson_id: phase-15-genai-agents-ai-agents-1
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: Lập kế hoạch và chia nhỏ nhiệm vụ
title_en: Planning and task decomposition
summary_vi: Chia nhiệm vụ tra cứu thành bước có điều kiện; kiểm tra kết quả công cụ trước khi chuyển bước hoặc báo có bằng chứng.
summary_en: Decompose a lookup into guarded steps; validate tool observations before advancing or claiming evidence.
learning_objectives:
- Phân biệt kế hoạch dự kiến, lời gọi đã thực hiện và kết quả đã kiểm tra.
- So sánh workflow cố định với chính sách thử lại theo kịch bản trên cùng nhiệm vụ.
- Kiểm tra hợp đồng kết quả công cụ, ngân sách lời gọi và lý do dừng; nêu giới hạn của mô phỏng.
learning_objectives_en:
- Distinguish intended plans, attempted calls and validated observations.
- Compare a fixed workflow with a scripted adaptive policy on the same lookup task.
- Check tool-result contracts, call budgets and stop reasons; explain the simulation's limits.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-4
- phase-14-genai-tool-calling-tool-calling-1
key_terms:
- planning
- task
- decomposition
- observation
- tool contract
- call budget
- stop reason
- ai-agents
concept_notes_vi: |-
  Kế hoạch chia mục tiêu thành các bước có đầu vào, kết quả và điều kiện kiểm tra. Agent cần điều chỉnh khi quan sát mới bác bỏ giả định, thay vì tiếp tục kế hoạch cũ một cách máy móc.

  Danh sách bước là dự định; trạng thái thực thi cho biết bước nào đã có bằng chứng hoàn thành. Chia nhiệm vụ hữu ích khi làm rõ phụ thuộc: phải có dữ liệu trước khi phân tích, và phải đánh giá kết quả trước khi báo xong.

  Ví dụ, agent đọc tài liệu, tìm điều khoản rồi soạn câu trả lời; nếu không đọc được nguồn thì cần sửa cách lấy dữ liệu hoặc báo thiếu. Tự kiểm tra: kế hoạch viết rất chi tiết có bảo đảm thành công không? Không; phải kiểm tra đầu ra từng bước, cập nhật khi giả định sai và tránh thực hiện bước sau bằng dữ liệu tưởng tượng.

  Với tác vụ chỉ đọc trong ví dụ, search phải trả list các ID chuỗi không rỗng. List rỗng là quan sát hợp lệ nhưng không tìm thấy nguồn; chuỗi guide hoặc list chứa số là lỗi hợp đồng. read_document chỉ được coi là có bằng chứng khi trả chuỗi không chỉ có khoảng trắng. Sai hợp đồng dừng invalid_tool_result, không đoán dữ liệu thay thế.

  plan ghi bước dự kiến; trace ghi lời gọi đã thử, kể cả lỗi; completed chỉ ghi lời gọi có quan sát hợp lệ. search trả list rỗng vẫn có thể nằm trong completed nhưng nhiệm vụ chưa thành công. Ngân sách giới hạn số lần gọi, còn seen chặn cặp công cụ/tham số lặp; cả hai cần thiết khi môi trường không cung cấp bằng chứng.

  Workflow đi theo đường xử lý định trước; agent dùng LLM có thể chọn bước động từ phản hồi môi trường. Chính sách đổi truy vấn thành học ở đây được viết sẵn, chỉ minh họa vòng điều khiển. Không có LLM, framework hay API thật. TimeoutError là lỗi giả lập; giới hạn lời gọi không thể ngắt một công cụ đang treo và không chứng minh chống prompt injection.
concept_notes_en: |-
  A plan divides a goal into steps with inputs, outputs and verification conditions. Agents should revise plans when observations contradict assumptions.

  A step list states intentions; execution state records what evidence supports completion. Useful decomposition exposes dependencies: obtain data before analysis and evaluate results before claiming success.

  An agent may read a document, locate a clause and draft an answer; failed reading requires recovery or a missing-evidence report. Self-check: does a detailed plan guarantee success? No: inspect each output, revise failed assumptions and do not continue using imagined data.

  In this read-only task, search must return a list of nonblank string IDs. An empty list is a valid observation with no source; the string guide or a list containing a number violates the contract. read_document counts as evidence only when it returns nonblank text. Contract violations stop with invalid_tool_result rather than invented replacement data.

  plan records intended steps; trace records attempted calls including failures; completed records only calls with valid observations. A search returning an empty list may enter completed without completing the task. The budget bounds attempts while seen blocks repeated tool/argument pairs; both matter when the environment supplies no evidence.

  Workflows follow predefined paths; an LLM agent can choose dynamic steps from environment feedback. The fallback query học is hard-coded here to illustrate a control loop. No real LLM, framework or API runs. TimeoutError is simulated; a call budget cannot interrupt a hanging tool and does not prove prompt-injection resistance.
why_it_matters_vi: Kế hoạch chỉ đáng tin khi từng bước có kết quả hợp lệ và điều kiện dừng; báo thành công không thay thế bằng chứng thực thi.
why_it_matters_en: A plan needs validated observations and stop conditions; a success claim cannot replace execution evidence.
study_steps_vi:
- Đọc phần kiến thức và phân biệt kế hoạch dự kiến với kết quả đã quan sát.
- Lưu ví dụ thành agent_loop.py rồi chạy bằng Python 3.11 trở lên; không cần API key.
- So trace của workflow cố định với chính sách mô phỏng biết thử truy vấn khác.
- Lưu ví dụ thứ hai thành check_agent.py cạnh agent_loop.py; chạy python check_agent.py rồi thử làm sai kiểm tra kết quả công cụ.
- 'Ghi giới hạn: đây là bộ điều khiển giả lập, chưa kiểm tra khả năng quyết định của LLM hay hiệu quả agent
  thật.'
study_steps_en:
- Distinguish intended plans from observed execution state.
- Save the example as agent_loop.py and run with Python 3.11 or newer; no API key is needed.
- Compare traces from the fixed workflow and scripted adaptive policy.
- Save the second example as check_agent.py beside agent_loop.py; run python check_agent.py, then deliberately break tool-result validation.
- 'Record the limit: this is a simulated controller, not a test of LLM decisions or real-agent effectiveness.'
practice_plan:
  vi:
    task: Chạy hai ví dụ trong cùng thư mục hoặc runtime Colab. Giữ nguyên check_controller, sửa run để kiểm tra mọi kết quả search/read_document; đối chiếu trace với lời gọi thật khi không có nguồn, kết quả sai kiểu và hết ngân sách.
    deliverables:
    - Hai chính sách dùng cùng kho tài liệu giả
    - Hai tệp agent_loop.py và check_agent.py với đầu ra khớp hướng dẫn
    - 'Kết quả từng case: plan, completed, trace, evidence và lý do dừng'
    - Giải thích điều mô phỏng chưa đo được ở LLM thật
    checkpoint: check_controller(run) đạt; controller thành công giả và controller bỏ kiểm tra kết quả phải không đạt. Không vượt ngân sách hoặc gọi lặp; chỉ coi văn bản nguồn là dữ liệu.
    stretch: Thêm kiểm thử tài liệu chứa yêu cầu gọi công cụ ngoài quyền; giải thích vì sao kiểm thử giả lập
      chưa chứng minh chống prompt injection với LLM.
  en:
    task: Run both examples in the same folder or Colab runtime. Keep check_controller unchanged and edit run to validate every search/read_document result; compare traces with actual calls for missing sources, malformed results and exhausted budgets.
    deliverables:
    - Two policies using the same synthetic corpus
    - agent_loop.py and check_agent.py with the documented output
    - Per-case plan, completed steps, trace, evidence and stop reason
    - An explanation of what the simulation does not measure in real LLMs
    checkpoint: check_controller(run) passes; fake-success and unchecked-result controllers fail. Respect call budgets and repeated-call stops; treat source text as data only.
    stretch: Test a document requesting an unauthorized tool; explain why this simulated test does not establish
      LLM prompt-injection resistance.
interview_questions:
  vi:
  - Vì sao plan có read_document nhưng completed có thể chỉ có search?
  - search trả chuỗi guide và read_document trả chuỗi rỗng phải dừng thế nào?
  - Bộ kiểm tra phát hiện thành công giả ra sao và chưa chứng minh điều gì về LLM?
  en:
  - Why can plan include read_document while completed contains only search?
  - How should a search string or empty document text stop the controller?
  - How do the checks expose fake success, and what do they not establish about LLMs?
formulas: []
code_examples:
- language: python
  title: Quan sát hợp lệ rồi chọn bước tiếp / Validate observations before choosing the next step
  status: runnable
  code: |
    DOCUMENTS = {'guide': 'Học theo nhịp riêng; ghi lại nguồn và kết quả.'}


    def search(query):
        if query == 'timeout':
            raise TimeoutError('simulated timeout')
        return ['guide'] if query == 'học' else []


    def read_document(document_id):
        return DOCUMENTS[document_id]


    TOOLS = {'search': search, 'read_document': read_document}


    def run(query, max_calls=5, adaptive=True, tools=None):
        tools = TOOLS if tools is None else tools
        trace, seen, completed = [], set(), []
        plan = ['search', 'read_document']

        def finish(stop, evidence=None):
            return {'stop': stop, 'trace': trace, 'evidence': evidence,
                    'plan': plan, 'completed': completed.copy()}

        if not isinstance(query, str) or not query.strip():
            return finish('invalid_input')
        if type(max_calls) is not int or not 1 <= max_calls <= 5:
            raise ValueError('max_calls must be 1..5')
        action, argument = 'search', query
        for _ in range(max_calls):
            call = (action, argument)
            if call in seen:
                return finish('repeated_call')
            seen.add(call)
            event = {'tool': action, 'input': argument, 'status': 'requested'}
            trace.append(event)  # Every attempted call, including failure, consumes budget.
            try:
                tool = tools[action]
                if not callable(tool):
                    event['status'] = 'invalid_tool'
                    return finish('tool_error')
                result = tool(argument)
            except (TimeoutError, ValueError, KeyError) as error:
                event.update(status='tool_error', error=type(error).__name__)
                return finish('tool_error')
            # Validate the entire observation before selecting a next action.
            valid = (isinstance(result, list)
                     and all(isinstance(item, str) and item.strip() for item in result)
                     if action == 'search' else isinstance(result, str) and bool(result.strip()))
            if not valid:
                event['status'] = 'invalid_tool_result'
                return finish('invalid_tool_result')
            event.update(status='observed', output=result)
            completed.append(action)
            if action == 'read_document':
                return finish('evidence_found', result)
            if result:
                action, argument = 'read_document', result[0]
            elif adaptive:
                argument = 'học'  # Scripted fallback; no model chooses an action.
            else:
                return finish('no_results')
        return finish('call_limit')


    if __name__ == '__main__':
        fixed = run('cách ôn', adaptive=False)
        adaptive = run('cách ôn')
        assert fixed['stop'] == 'no_results'
        assert adaptive['stop'] == 'evidence_found' and len(adaptive['trace']) == 3
        assert run('cách ôn', max_calls=1)['stop'] == 'call_limit'
        assert run('timeout')['stop'] == 'tool_error'
        assert run('')['stop'] == 'invalid_input'
        empty_tools = {**TOOLS, 'search': lambda query: []}
        assert run('cách ôn', tools=empty_tools)['stop'] == 'repeated_call'
        bad_search = {**TOOLS, 'search': lambda query: 'guide'}
        bad_read = {**TOOLS, 'read_document': lambda document_id: ' '}
        assert run('học', tools=bad_search)['stop'] == 'invalid_tool_result'
        assert run('học', tools=bad_read)['stop'] == 'invalid_tool_result'
        print(fixed['stop'], adaptive['stop'], len(adaptive['trace']))
        print('call limit, timeout, invalid input and tool results: checked')
  setup: "Python 3.11+; save as agent_loop.py and run python agent_loop.py. Standard library only."
  expected_output: |
    no_results evidence_found 3
    call limit, timeout, invalid input and tool results: checked
  purpose_vi: "So sánh workflow cố định và chính sách thử lại theo kịch bản; chỉ báo có bằng chứng sau khi kiểm tra kiểu và nội dung kết quả công cụ."
  purpose_en: "Compare a fixed workflow with a scripted fallback; claim evidence only after validating tool-result type and content."
  edge_case_vi: "search phải trả list gồm các ID chuỗi không rỗng; list rỗng là không có kết quả. read_document phải trả chuỗi không chỉ có khoảng trắng. Sai hợp đồng dừng invalid_tool_result, không đọc ký tự đầu của một chuỗi search."
  edge_case_en: "search must return a list of nonblank string IDs; an empty list means no results. read_document must return nonblank text. Contract violations stop with invalid_tool_result; a search string is never treated as an ID list."
  explanation_vi: "plan là dự định; completed chỉ ghi lời gọi có kết quả hợp lệ, chưa bảo đảm hoàn thành nhiệm vụ. Mỗi lần gọi thực tế ghi vào trace và tính vào ngân sách. Không thực hiện lời gọi lặp; không diễn giải nguồn thành lệnh. Trace chứa dữ liệu giả, không dùng để log dữ liệu riêng tư trong production. Timeout chỉ là ngoại lệ giả lập, không ngắt API đang treo."
  explanation_en: "plan records intent; completed records calls with valid observations, not guaranteed task success. Every actual attempt enters the trace and consumes budget. Repeated calls are blocked and source text is not executed. Traces contain synthetic data, not a production private-data logging policy. Timeout is a simulated exception, not cancellation of a hanging API."
- language: python
  title: Tự kiểm tra controller / Check your controller
  status: runnable
  code: |
    from agent_loop import run


    def check_controller(candidate):
        def case(query, search_result, read_result, expected, calls, **options):
            observed = []

            def fake_search(value):
                observed.append(('search', value))
                return search_result

            def fake_read(value):
                observed.append(('read_document', value))
                return read_result

            result = candidate(query, tools={'search': fake_search, 'read_document': fake_read}, **options)
            assert result['stop'] == expected, (expected, result['stop'])
            assert len(observed) == calls == len(result['trace'])
            assert [(event['tool'], event['input']) for event in result['trace']] == observed
            if expected == 'evidence_found':
                assert result['evidence'] == read_result
                assert result['completed'][-1] == 'read_document'
            else:
                assert result['evidence'] is None
                assert 'read_document' not in result['completed']
            return result

        case('học', ['guide'], 'known evidence', 'evidence_found', 2)
        case('học', ['guide'], 'known evidence', 'call_limit', 1, max_calls=1)
        case('', ['guide'], 'known evidence', 'invalid_input', 0)
        case('missing', [], 'unused', 'no_results', 1, adaptive=False)
        case('missing', [], 'unused', 'repeated_call', 2)
        for malformed in ('guide', {'id': 'guide'}, None, [3], ['guide', ' ']):
            result = case('học', malformed, 'unused', 'invalid_tool_result', 1)
            assert result['completed'] == []
        for malformed in ('', '  ', None, 7, ['pretend evidence']):
            case('học', ['guide'], malformed, 'invalid_tool_result', 2)
        return True


    if __name__ == '__main__':
        assert check_controller(run)
        print('controller acceptance: passed')
  setup: "Save beside agent_loop.py as check_agent.py, then run python check_agent.py. Use both files in the same Colab runtime or local folder."
  expected_output: "controller acceptance: passed"
  purpose_vi: "Dùng công cụ giả ghi lại lời gọi thật để đối chiếu trace, ngân sách và bằng chứng; truyền hàm bạn sửa vào candidate."
  purpose_en: "Use recording fake tools to compare actual calls, trace, budget and evidence; pass your edited function as candidate."
  edge_case_vi: "Controller trả thành công mà không gọi tool phải không đạt; bỏ kiểm tra chuỗi search hoặc nội dung read cũng phải không đạt."
  edge_case_en: "A success dictionary without tool calls must fail; skipping search-list or read-text validation must fail too."
  explanation_vi: "Local: lưu check_agent.py cạnh agent_loop.py, chạy python check_agent.py. Colab: đặt %%writefile agent_loop.py ở dòng đầu ô chứa ví dụ 1 rồi chạy; đặt %%writefile check_agent.py ở dòng đầu ô chứa ví dụ 2 rồi chạy; ô mới chạy !python check_agent.py. Ô code thường không tự tạo tệp để import. Stdout đúng: controller acceptance: passed. Giữ nguyên checker khi sửa run; đây không phải chứng nhận agent production."
  explanation_en: "Local: save check_agent.py beside agent_loop.py and run python check_agent.py. Colab: put %%writefile agent_loop.py first in the example 1 cell and run it; put %%writefile check_agent.py first in the example 2 cell and run it; run !python check_agent.py in a new cell. Ordinary cells do not create importable files. Expected stdout: controller acceptance: passed. Keep the checker unchanged while editing run; this is not production certification."
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
  url: https://www.anthropic.com/engineering/building-effective-agents
  kind: official
  required: false
  purpose_vi: Phân biệt workflow theo đường định trước với agent chọn bước động bằng LLM.
  purpose_en: Distinguish predefined workflows from agents whose LLM dynamically chooses steps.
  read_vi: Đọc What are agents? và Agents; tìm vai trò phản hồi môi trường và giới hạn số vòng. Đối chiếu với fallback viết sẵn trong ví dụ, không coi đó là agent LLM đã chạy.
  read_en: Read What are agents? and Agents for environment feedback and iteration limits. Contrast these with the scripted fallback; the example does not run an LLM agent.
- language: en
  title: Thinking in LangGraph
  url: https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph
  kind: official
  required: false
  purpose_vi: Chia luồng thành bước có trạng thái và xử lý lỗi thay vì chỉ viết danh sách dự định.
  purpose_en: Decompose a workflow into stateful steps and error handling rather than an intention list.
  read_vi: Đọc phần chia các bước, thiết kế state và xử lý lỗi. Vẽ ánh xạ plan/trace/completed của ví dụ sang state; đây là tài liệu JavaScript/TypeScript, không có LangGraph chạy trong bài.
  read_en: Read the sections on workflow steps, state design and error handling. Map plan/trace/completed to state; the source uses JavaScript/TypeScript and this lesson does not run LangGraph.
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
- Đối chiếu plan với trace và completed cho hai chính sách.
- Chạy check_agent.py; xác nhận quan sát sai không được báo có bằng chứng.
- Giải thích ngân sách lời gọi, chặn lặp và giới hạn timeout giả lập.
completion_criteria:
- Hai chương trình chạy và khớp stdout đã nêu.
- Bộ kiểm tra chấp nhận controller đúng và bác bỏ thành công giả hoặc bỏ kiểm tra quan sát.
- Sai kiểu search/read, hết ngân sách, lời gọi lặp và lỗi công cụ có lý do dừng cụ thể.
common_mistakes:
- Coi chuỗi search là list rồi lấy ký tự đầu làm ID tài liệu.
- Báo evidence_found khi read_document trả rỗng hoặc sai kiểu.
- Nhầm plan với completed hoặc nhầm giới hạn số lần gọi với khả năng ngắt công cụ đang treo.
next_lessons:
- phase-15-genai-agents-ai-agents-2
- phase-15-genai-agents-ai-agents-3
review_question_vi: Vì sao kế hoạch có bước đọc tài liệu chưa đủ để báo có bằng chứng?
review_question_en: Why is a planned document-reading step insufficient to claim evidence?
review_answer_vi: plan chỉ ghi dự định. Phải thực sự gọi search, kiểm tra list ID rồi gọi read_document và kiểm tra chuỗi không rỗng; trace ghi lần thử, completed ghi quan sát hợp lệ. Chỉ sau đó mới báo evidence_found.
review_answer_en: plan records intent. Actually call search, validate its ID list, call read_document and validate nonblank text; trace records attempts and completed records valid observations. Only then report evidence_found.
review_cards:
- id: phase-15-genai-agents-ai-agents-1-recall
  type: recall
  question_vi: Phân biệt plan, trace và completed trong ví dụ.
  question_en: Distinguish plan, trace and completed in the example.
  answer_vi: plan là danh sách dự định; trace lưu lời gọi đã thử kể cả lỗi; completed chỉ thêm công cụ sau quan sát hợp lệ. completed có search không có nghĩa đã tìm được nguồn hoặc đọc tài liệu.
  answer_en: plan lists intentions; trace records attempted calls including errors; completed adds a tool only after a valid observation. A completed search does not imply that a source was found or read.
  hint_vi: Thử search trả list rỗng và xem ba trường.
  hint_en: Return an empty search list and inspect the three fields.
- id: phase-15-genai-agents-ai-agents-1-application
  type: application
  question_vi: Cùng truy vấn cách ôn, hai chính sách đi qua bước nào và dừng ra sao?
  question_en: For the query cách ôn, which steps do the two policies take and where do they stop?
  answer_vi: Workflow cố định search một lần rồi dừng no_results. Chính sách mô phỏng search cách ôn, search học rồi read_document guide; ba lời gọi trả evidence_found khi đọc được văn bản hợp lệ.
  answer_en: The fixed workflow searches once and stops with no_results. The scripted policy searches cách ôn, searches học and reads guide; three calls yield evidence_found only after valid text is read.
  hint_vi: So trace và số lời gọi, không chỉ so tên trạng thái cuối.
  hint_en: Compare traces and actual call counts, not only final status names.
- id: phase-15-genai-agents-ai-agents-1-debug
  type: debug
  question_vi: search trả chuỗi guide hoặc read_document trả khoảng trắng thì xử lý thế nào?
  question_en: What happens when search returns the string guide or read_document returns whitespace?
  answer_vi: Cả hai vi phạm hợp đồng và phải dừng invalid_tool_result với evidence None. Chuỗi search không được lấy ký tự đầu làm ID; kết quả đọc rỗng không được báo thành công. Lời gọi sai vẫn nằm trong trace và tính vào ngân sách.
  answer_en: Both violate the contract and stop with invalid_tool_result and evidence None. Never use the first character of a search string as an ID or claim success from blank reading results. The failed attempt remains in the trace and counts against the budget.
  hint_vi: Kiểm tra kiểu và nội dung quan sát trước khi đổi action.
  hint_en: Validate observation type and content before changing action.
- id: phase-15-genai-agents-ai-agents-1-interview
  type: interview
  question_vi: Giới hạn lời gọi và test này bảo đảm gì, chưa bảo đảm gì?
  question_en: What do the call budget and these tests establish, and what do they not?
  answer_vi: Mô phỏng có tối đa năm lần gọi, chặn cặp lời gọi lặp và không thành công với quan sát sai hợp đồng. Chúng không ngắt công cụ đang treo, không đo quyết định của LLM thật, không chứng nhận production hoặc chống mọi injection.
  answer_en: The simulation makes at most five calls, blocks repeated call pairs and rejects malformed observations instead of claiming success. It does not cancel a hanging tool, measure real LLM decisions, certify production behavior or prove resistance to all injection.
  hint_vi: Phân biệt số lần gọi với thời gian chờ và quyết định viết sẵn với quyết định LLM.
  hint_en: Separate call count from waiting time and scripted choices from LLM decisions.
---
# Lập kế hoạch và chia nhỏ nhiệm vụ / Planning and task decomposition

Kế hoạch ghi bước dự kiến; trạng thái thực thi phải dựa vào quan sát hợp lệ. Ví dụ chỉ dùng hai công cụ đọc và chính sách thử lại viết sẵn, không gọi LLM hay framework.

search phải trả list ID chuỗi không rỗng; list rỗng là không có kết quả, còn chuỗi guide là sai hợp đồng. read_document phải trả văn bản không chỉ có khoảng trắng. Sai kết quả dừng invalid_tool_result trước khi báo có bằng chứng.

plan ghi dự định, trace ghi lời gọi đã thử và completed ghi quan sát hợp lệ. Ngân sách tính cả lỗi công cụ; cặp công cụ/tham số lặp bị chặn. TimeoutError chỉ mô phỏng lỗi, không ngắt API đang treo.

## Thực hành

Lưu hai ví dụ thành agent_loop.py và check_agent.py trong cùng thư mục hoặc runtime Colab. Chạy lần lượt, đối chiếu stdout, rồi sửa run trong khi giữ nguyên check_controller. Thành công giả hoặc bỏ kiểm tra kết quả phải bị phát hiện; không dùng kết quả này để khẳng định chất lượng agent LLM.

## Practice

Save the two examples as agent_loop.py and check_agent.py in the same folder or Colab runtime. Run them in order, compare stdout, then edit run while keeping check_controller unchanged. Fake success and unchecked observations must fail; this simulation does not establish real LLM-agent quality.
