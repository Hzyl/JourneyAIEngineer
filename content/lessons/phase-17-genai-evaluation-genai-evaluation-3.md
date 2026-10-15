---
lesson_id: phase-17-genai-evaluation-genai-evaluation-3
phase_id: phase-17-genai-evaluation
module_id: genai-evaluation
title_vi: Đánh giá agent và chuỗi hành động
title_en: Agent evaluation and trajectories
summary_vi: So workflow và agent trên cùng trường hợp, chấm đúng nhiệm vụ cùng quyền và số bước.
summary_en: Compare workflow and agent on identical cases, scoring task success alongside permissions and step count.
learning_objectives:
- So workflow và agent trên cùng trường hợp, chấm đúng nhiệm vụ cùng quyền và số bước.
- Chạy ví dụ 2, đối chiếu tám kết quả và lần lượt thay đổi lời báo thành công, báo cáo, thứ tự công cụ, quyền và ngân sách.
- Báo thành công nhưng thiếu hoặc sai báo cáo vẫn trượt; đổi thứ tự hợp lệ vẫn đạt; gọi write, gọi công cụ 6 lần hoặc mất 3 giây đều trượt; đề mơ hồ
  báo lỗi đề bài.
learning_objectives_en:
- Compare workflow and agent on identical cases, scoring task success alongside permissions and step count.
- Run example 2, compare eight results, then mutate the claim, report, tool order, permissions and budgets separately.
- A success claim cannot rescue a missing/wrong report; valid reordered tools pass; write, 6 calls or 3 seconds
  fail; an ambiguous task is a task-definition error.
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
concept_notes_vi: 'Bộ đánh giá gồm dataset nêu nhiệm vụ, solver thực hiện chiến lược và scorer áp tiêu chí đã định.
  Workflow cố định bước; agent có thể chọn bước dựa trên quan sát. So sánh chỉ có ý nghĩa khi giữ trường hợp, công
  cụ, dữ liệu, quyền và ngân sách tương đương.


  Đáp án trông đúng vẫn có thể dùng tool trái quyền. Scorer nên kiểm tra hoàn thành nhiệm vụ, hành động cho phép,
  giới hạn số lần gọi, thời gian và trường hợp từ chối. Ví dụ dưới đây chấm trace giả lập bằng quy tắc công khai;
  không chạy LLM hay Inspect. Kết quả tốt của trace không chứng minh model sẽ tạo trace đó.


  Tự kiểm tra: agent sửa truy vấn và thành công trên một trường hợp có nghĩa nên thay workflow không? Không; cần
  đọc các trường hợp còn lại và đánh đổi số bước/độ trễ. Lưu lỗi từng trường hợp cùng cấu hình; chỉ giữ cải tiến
  khi đạt tiêu chí trên tập tách biệt.


  Ví dụ 1 nhận nhãn correct đã gán sẵn: nó kiểm tra quyền/ngân sách, không tự xác minh đáp án. Ví dụ 2 đối chiếu
  báo cáo cuối với tiêu chí nhiệm vụ. Lời báo thành công và chuỗi hành động do bộ thực hiện nhiệm vụ (solver) tự mô tả chưa phải bằng chứng.
  Bộ chạy kiểm thử (harness) đáng tin phải ghi nhận báo cáo, công cụ thực sự đã gọi và thời gian; không cho solver tự tạo observed.
  Ở đây tất cả là dữ liệu giả trong bộ nhớ; ví dụ chưa kết nối hệ thống thật và chưa có cơ chế chống giả mạo. Báo cáo trả về trong bộ nhớ không phải
  thao tác tool write.


  Chấp nhận giá trị các trường bắt buộc và mọi thứ tự tool hợp lệ; không ép một đường đi chuẩn. Vẫn chỉ cho search/read_document,
  tối đa 5 lần gọi và 2 giây. Thiếu tiêu chí cho “báo cáo hữu ích” là TaskDefinitionError của đề bài, phải sửa trước
  khi chấm; không tính thành agent thất bại. Hàm chỉ phát hiện thiếu hợp đồng tối thiểu; người ra đề vẫn phải kiểm
  tra ý nghĩa và tính nhất quán.'
concept_notes_en: 'An evaluation combines a dataset of tasks, a solver implementing a strategy and a scorer applying
  predetermined criteria. A workflow fixes its steps; an agent can select steps using observations. Comparison requires
  equivalent cases, tools, data, permissions and budgets.


  An apparently correct answer may still involve an unauthorized tool. Score task success, permitted actions, call
  limits, elapsed time and denial behavior. This example scores synthetic traces using explicit rules; it runs neither
  an LLM nor Inspect. A successful fixture trace does not establish that a model will produce it.


  Self-check: does an agent succeeding after a query rewrite on one case justify replacing a workflow? No; inspect
  other cases and step/latency tradeoffs. Save per-case failures and configuration; retain a change only when it
  meets criteria on held-out cases.


  Example 1 accepts a preassigned correct label: it checks permissions/budgets but does not verify the answer. Example
  2 compares the final report with task criteria. A solver success claim and descriptive trace are not evidence.
  A trusted harness must capture the report, actual tool calls and elapsed time; the solver must not supply observed.
  Here these are in-memory fixtures, with no production backend or tamper protection. Returning an in-memory report
  is not a write tool call.


  Accept the required field values and any permitted tool order, rather than one reference path. Only search/read_document,
  at most 5 calls and 2 seconds remain allowed. Missing criteria for a “useful report” raise a task-author TaskDefinitionError;
  fix the task before scoring, rather than counting an agent failure. The function catches a missing minimum contract
  only; task authors must still review its meaning and consistency.'
why_it_matters_vi: So workflow và agent trên cùng trường hợp, chấm đúng nhiệm vụ cùng quyền và số bước.
why_it_matters_en: Compare workflow and agent on identical cases, scoring task success alongside permissions and
  step count.
study_steps_vi:
- Dự đoán đầu ra hai ví dụ và nhận diện nhãn correct có sẵn ở ví dụ 1.
- Chạy từng ví dụ độc lập trong Colab hoặc lưu tệp Python theo hướng dẫn.
- Chạy ví dụ 2, đối chiếu tám kết quả và lần lượt thay đổi lời báo thành công, báo cáo, thứ tự công cụ, quyền và ngân sách.
- Báo thành công nhưng thiếu hoặc sai báo cáo vẫn trượt; đổi thứ tự hợp lệ vẫn đạt; gọi write, gọi công cụ 6 lần hoặc mất 3 giây đều trượt; đề mơ hồ
  báo lỗi đề bài.
- Lưu kết quả sau khi thay đổi từng điều kiện và giải thích ranh giới tin cậy của observed.
study_steps_en:
- Predict both outputs and identify the supplied correct label in example 1.
- Run each example independently in Colab or save a Python file as described in setup.
- Run example 2, compare eight results, then mutate the claim, report, tool order, permissions and budgets separately.
- A success claim cannot rescue a missing/wrong report; valid reordered tools pass; write, 6 calls or 3 seconds
  fail; an ambiguous task is a task-definition error.
- Save mutation results and explain the trust boundary of observed.
practice_plan:
  vi:
    task: Chạy ví dụ 2, đối chiếu tám kết quả và lần lượt thay đổi lời báo thành công, báo cáo, thứ tự công cụ, quyền và ngân sách.
    deliverables:
    - Tám kết quả gốc và đầu ra sau mỗi lần thay đổi điều kiện
    - Bảng nhiệm vụ / lời báo và chuỗi hành động / kết quả quan sát / kết luận chấm
    - Giải thích lỗi đề bài và giới hạn mô phỏng
    checkpoint: Báo thành công nhưng thiếu hoặc sai báo cáo vẫn trượt; đổi thứ tự hợp lệ vẫn đạt; gọi write, gọi công cụ 6 lần hoặc mất 3 giây đều trượt;
      đề mơ hồ báo lỗi đề bài.
    stretch: Mở Lab B để so sánh workflow/agent; notebook không triển khai grader mới này.
  en:
    task: Run example 2, compare eight results, then mutate the claim, report, tool order, permissions and budgets
      separately.
    deliverables:
    - Eight original results and output after each mutation
    - A task / solver claim-trace / harness observation / verdict table
    - An explanation of task errors and simulation limits
    checkpoint: A success claim cannot rescue a missing/wrong report; valid reordered tools pass; write, 6 calls
      or 3 seconds fail; an ambiguous task is a task-definition error.
    stretch: Open Lab B to compare workflow/agent; the notebook does not implement this new grader.
interview_questions:
  vi:
  - Vì sao claimed_success=True vẫn trượt, còn thứ tự read_document → search có thể đạt?
  - Làm sao tránh dùng trace solver tự khai để kiểm quyền?
  - Lỗi đề bài khác lỗi agent thế nào trong ví dụ?
  en:
  - Why can claimed_success=True fail while read_document → search can pass?
  - How do you avoid checking permissions using a self-reported solver trace?
  - How does a task-definition error differ from an agent failure here?
formulas:
- Pass rate = passing tasks / graded tasks (exclude task-definition errors)
code_examples:
- language: python
  title: Compare two fixed traces with an authorization-aware scorer
  code: "import json\ndef score(trace):\n    allowed = all(tool in {\"search\", \"read_document\"} for tool in trace[\"\
    tools\"])\n    return trace[\"correct\"] and allowed and len(trace[\"tools\"]) <= 5 and trace[\"seconds\"] <=\
    \ 2\nsolvers = {\n    \"workflow\": [dict(correct=True, tools=[\"search\", \"read_document\"], seconds=1),\n\
    \                 dict(correct=False, tools=[\"search\"], seconds=1)],\n    \"agent\": [dict(correct=True, tools=[\"\
    search\", \"read_document\"], seconds=1),\n              dict(correct=True, tools=[\"search\", \"search\", \"\
    read_document\"], seconds=2)],\n}\nrates = {name: sum(score(t) for t in traces) / len(traces) for name, traces\
    \ in solvers.items()}\nunsafe = dict(correct=True, tools=[\"write\"], seconds=1)\nover_budget = dict(correct=True,\
    \ tools=[\"search\"] * 6, seconds=1)\nprint(json.dumps({\"synthetic_pass_rates\": rates, \"unsafe_passes\":\
    \ score(unsafe),\n                  \"over_budget_passes\": score(over_budget)}))\n"
  status: runnable
  purpose_vi: So workflow và agent trên cùng trường hợp, chấm đúng nhiệm vụ cùng quyền và số bước.
  purpose_en: Compare workflow and agent on identical cases, scoring task success alongside permissions and step
    count.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"synthetic_pass_rates": {"workflow": 0.5, "agent": 1.0}, "unsafe_passes": false, "over_budget_passes":
    false}'
  edge_case_vi: Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
  edge_case_en: A correct answer with write or more than five tool calls must fail.
  explanation_vi: Đây là đánh giá trace cố định; Lab B chạy workflow/agent quy tắc thật trên công cụ giả lập chỉ
    đọc.
  explanation_en: This scores fixed traces; Lab B executes rule-based workflow/agent variants against read-only
    fake tools.
- language: python
  title: Grade an independently observed report, not a success claim
  code: "import json\n\nclass TaskDefinitionError(ValueError):\n    pass\n\ndef grade(task, solver, observed):\n\
    \    # Task authors must define a prompt and a concrete expected report.\n    expected = task.get(\"expected_report\"\
    )\n    if not task.get(\"prompt\", \"\").strip() or not isinstance(expected, dict) or not expected:\n      \
    \  raise TaskDefinitionError(\"Define the requested report before scoring\")\n    # solver holds claims/trace\
    \ for diagnosis, never authoritative evidence.\n    # observed comes from the harness recorder, not a solver-supplied\
    \ dictionary.\n    if any(tool not in {\"search\", \"read_document\"} for tool in observed[\"tools\"]):\n  \
    \      return \"fail:permission\"\n    if len(observed[\"tools\"]) > 5 or not 0 <= observed[\"seconds\"] <=\
    \ 2:\n        return \"fail:budget\"\n    report = observed.get(\"report\")\n    if not isinstance(report, dict)\
    \ or any(k not in report or report[k] != v for k, v in expected.items()):\n        return \"fail:outcome\"\n    return \"pass\"\
    \n\ntask = {\n    \"prompt\": \"Return document_id and item_count for the public checklist guide.\",\n    \"\
    expected_report\": {\"document_id\": \"guide\", \"item_count\": 3},\n}\nsolver = {\"claimed_success\": True,\
    \ \"trace\": [\"search\", \"read_document\"]}\ngood = {\"report\": {\"document_id\": \"guide\", \"item_count\"\
    : 3},\n        \"tools\": [\"search\", \"read_document\"], \"seconds\": 1}\ncases = {\n    \"false_success\"\
    : {**good, \"report\": None},\n    # A known document can be read before a confirming search.\n    \"alternative_order\"\
    : {**good, \"tools\": [\"read_document\", \"search\"]},\n    \"wrong_report\": {**good, \"report\": {\"document_id\"\
    : \"guide\", \"item_count\": 4}},\n    \"missing_field\": {**good, \"report\": {\"document_id\": \"guide\"}},\n\
    \    \"unauthorized\": {**good, \"tools\": [\"write\"]},\n    \"too_many_calls\": {**good, \"tools\": [\"search\"\
    ] * 6},\n    \"too_slow\": {**good, \"seconds\": 3},\n}\nresults = {name: grade(task, solver, observation) for\
    \ name, observation in cases.items()}\ntry:\n    grade({\"prompt\": \"Make a useful report\"}, solver, good)\n\
    except TaskDefinitionError:\n    results[\"ambiguous_task\"] = \"task_definition_error\"\nprint(json.dumps(results))\n"
  status: runnable
  purpose_vi: Tách lời tự nhận thành công khỏi kết quả và hành động mà bộ chạy kiểm thử quan sát.
  purpose_en: Separate claimed success from the outcome and actions observed by the harness.
  setup: 'Python 3.11+; standard library only. Save as agent_outcome.py and run: python -X utf8 agent_outcome.py.
    Google Colab: paste this entire second example into one new code cell and Run; no install or first example required.'
  expected_output: '{"false_success": "fail:outcome", "alternative_order": "pass", "wrong_report": "fail:outcome",
    "missing_field": "fail:outcome", "unauthorized": "fail:permission", "too_many_calls": "fail:budget", "too_slow":
    "fail:budget", "ambiguous_task": "task_definition_error"}'
  edge_case_vi: Chấp nhận giá trị các trường bắt buộc và mọi thứ tự tool hợp lệ; không ép một đường đi chuẩn. Vẫn
    chỉ cho search/read_document, tối đa 5 lần gọi và 2 giây. Thiếu tiêu chí cho “báo cáo hữu ích” là TaskDefinitionError
    của đề bài, phải sửa trước khi chấm; không tính thành agent thất bại. Hàm chỉ phát hiện thiếu hợp đồng tối thiểu;
    người ra đề vẫn phải kiểm tra ý nghĩa và tính nhất quán.
  edge_case_en: Accept the required field values and any permitted tool order, rather than one reference path. Only
    search/read_document, at most 5 calls and 2 seconds remain allowed. Missing criteria for a “useful report” raise
    a task-author TaskDefinitionError; fix the task before scoring, rather than counting an agent failure. The function
    catches a missing minimum contract only; task authors must still review its meaning and consistency.
  explanation_vi: 'Ví dụ 1 nhận nhãn correct đã gán sẵn: nó kiểm tra quyền/ngân sách, không tự xác minh đáp án.
    Ví dụ 2 đối chiếu báo cáo cuối với tiêu chí nhiệm vụ. Lời báo thành công và chuỗi hành động do bộ thực hiện nhiệm vụ (solver) tự mô tả chưa phải
    bằng chứng. Bộ chạy kiểm thử (harness) đáng tin phải ghi nhận báo cáo, công cụ thực sự đã gọi và thời gian; không cho solver tự tạo observed.
    Ở đây tất cả là dữ liệu giả trong bộ nhớ; ví dụ chưa kết nối hệ thống thật và chưa có cơ chế chống giả mạo. Báo cáo trả về trong
    bộ nhớ không phải thao tác tool write.'
  explanation_en: 'Example 1 accepts a preassigned correct label: it checks permissions/budgets but does not verify
    the answer. Example 2 compares the final report with task criteria. A solver success claim and descriptive trace
    are not evidence. A trusted harness must capture the report, actual tool calls and elapsed time; the solver
    must not supply observed. Here these are in-memory fixtures, with no production backend or tamper protection.
    Returning an in-memory report is not a write tool call.'
resources:
- language: en
  title: OpenAI Evals
  url: https://github.com/openai/evals
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ragas Documentation
  url: https://docs.ragas.io/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: DeepEval Documentation
  url: https://deepeval.com/docs/getting-started
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
- title: Google Colab — Lab B
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập chỉ
    đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake tools
    and downloads no model; download the report to retain results.
- title: Inspect — Tasks
  url: https://inspect.aisi.org.uk/tasks.html
  purpose_vi: Hiểu cách tách dataset, solver và scorer khi thiết kế đánh giá.
  purpose_en: Understand dataset, solver and scorer separation in evaluation design.
  read_vi: Đọc Task Basics và Task Options; ví dụ bài học dùng stdlib, không yêu cầu cài Inspect.
  read_en: Read Task Basics and Task Options; the lesson uses stdlib and does not require Inspect installation.
  language: en
  kind: official
  required: false
- title: Anthropic — Demystifying evals for AI agents
  url: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt transcript với kết quả và xác định tiêu chí nhiệm vụ rõ ràng.
  purpose_en: Distinguish transcripts from outcomes and define unambiguous task criteria.
  read_vi: Đối chiếu kết quả quan sát với lời tự nhận; giải thích vì sao hai đường đi hợp lệ có thể cùng đạt.
  read_en: Compare observed outcomes with claims; explain why two valid paths can both pass.
exercise_ids:
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-3-recall
- phase-17-genai-evaluation-genai-evaluation-3-application
- phase-17-genai-evaluation-genai-evaluation-3-debug
- phase-17-genai-evaluation-genai-evaluation-3-interview
estimated_minutes: 60
completion_checklist:
- Chạy ví dụ 2, đối chiếu tám kết quả và lần lượt thay đổi lời báo thành công, báo cáo, thứ tự công cụ, quyền và ngân sách.
- Báo thành công nhưng thiếu hoặc sai báo cáo vẫn trượt; đổi thứ tự hợp lệ vẫn đạt; gọi write, gọi công cụ 6 lần hoặc mất 3 giây đều trượt; đề mơ hồ
  báo lỗi đề bài.
- Lưu đầu ra và giải thích vì sao observed phải do bộ chạy kiểm thử đáng tin cung cấp.
completion_criteria:
- Có đủ tám kết quả gốc và kết quả sau thay đổi để đối chiếu lời giải
- Báo thành công nhưng thiếu hoặc sai báo cáo vẫn trượt; đổi thứ tự hợp lệ vẫn đạt; gọi write, gọi công cụ 6 lần hoặc mất 3 giây đều trượt; đề mơ hồ
  báo lỗi đề bài.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Dùng correct hoặc claimed_success làm bằng chứng kết quả.
- So khớp đúng thứ tự tool mẫu thay vì mục tiêu và ràng buộc.
- Tính lỗi đề bài vào điểm agent hoặc tin observed do solver tự gửi.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-4
- phase-18-genai-observability-genai-observability-1
review_question_vi: Vì sao claimed_success=True vẫn trượt, còn thứ tự read_document → search có thể đạt?
review_question_en: Why can claimed_success=True fail while read_document → search can pass?
review_answer_vi: Bộ chấm đối chiếu báo cáo do bộ chạy kiểm thử quan sát với expected_report, đồng thời kiểm tra quyền và ngân sách.
  Lời báo thành công không quyết định điểm; mọi thứ tự tool được phép đều hợp lệ nếu có kết quả đúng, tối đa 5 lần gọi và 2 giây.
review_answer_en: The grader compares the harness-observed report with expected_report and enforces permissions
  and budgets. Claims do not decide the score; any permitted tool order can pass with the required outcome, at most
  5 calls and 2 seconds.
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-3-recall
  type: recall
  question_vi: Vì sao claimed_success=True vẫn trượt, còn thứ tự read_document → search có thể đạt?
  question_en: Why can claimed_success=True fail while read_document → search can pass?
  answer_vi: Bộ chấm đối chiếu báo cáo do bộ chạy kiểm thử quan sát với expected_report, đồng thời kiểm tra quyền và ngân sách. Lời báo thành công
    không quyết định điểm; mọi thứ tự tool được phép đều hợp lệ nếu có kết quả đúng, tối đa 5 lần gọi và 2 giây.
  answer_en: The grader compares the harness-observed report with expected_report and enforces permissions and budgets.
    Claims do not decide the score; any permitted tool order can pass with the required outcome, at most 5 calls
    and 2 seconds.
  hint_vi: Tách lời tự nhận, kết quả quan sát và ràng buộc.
  hint_en: Separate claims, observed outcomes and constraints.
- id: phase-17-genai-evaluation-genai-evaluation-3-application
  type: application
  question_vi: 'Đặt claimed_success thành False và đảo thứ tự hai công cụ trong good: kết quả nào, vì sao?'
  question_en: 'Set the claim to False and reverse the two tools in good: what verdict and why?'
  answer_vi: 'Vẫn pass: báo cáo chứa guide và 3, các tool đều được phép, thời gian 1 giây. Chỉ đổi lời báo thành công không
    làm đổi bằng chứng của bộ chạy kiểm thử; không bắt buộc đường đi search trước.'
  answer_en: 'Still pass: the report contains guide and 3, tools are permitted and elapsed time is 1 second. Changing
    the claim does not change harness evidence; search need not come first.'
  hint_vi: 'Gọi grade(task, {**solver, "claimed_success": False}, cases["alternative_order"]).'
  hint_en: 'Call grade(task, {**solver, "claimed_success": False}, cases["alternative_order"]).'
- id: phase-17-genai-evaluation-genai-evaluation-3-debug
  type: debug
  question_vi: Solver báo thành công nhưng thiếu item_count; hoặc đề chỉ nói “báo cáo hữu ích”. Hai lỗi khác nhau
    thế nào?
  question_en: A solver claims success but omits item_count; another task only asks for a useful report. How do
    these failures differ?
  answer_vi: 'Thiếu item_count với đề rõ ràng là fail:outcome. Thiếu expected_report là TaskDefinitionError: sửa
    tiêu chí trước khi chấm, không ghi agent thất bại. Hàm không tự phát hiện mọi mơ hồ ngữ nghĩa.'
  answer_en: 'Missing item_count under a clear task is fail:outcome. Missing expected_report is TaskDefinitionError:
    repair criteria before grading, without recording an agent failure. The function cannot detect every semantic
    ambiguity.'
  hint_vi: Kiểm hợp đồng đề bài trước, rồi kiểm báo cáo quan sát.
  hint_en: Check the task contract first, then the observed report.
- id: phase-17-genai-evaluation-genai-evaluation-3-interview
  type: interview
  question_vi: Bạn dùng ví dụ này để giải thích đánh đổi và giới hạn nào khi đánh giá agent?
  question_en: Which trade-off and limitation would you explain using this example?
  answer_vi: Chấp nhận nhiều cách làm hợp lệ nhưng vẫn loại trường hợp gọi write, quá 5 lần gọi hoặc quá 2 giây, dù báo cáo đúng. Kết quả mô phỏng
    không đo model thật; bộ chạy kiểm thử phải tự ghi kết quả, hành động và thời gian, không tin dữ liệu solver tự khai.
  answer_en: Allow multiple valid paths while rejecting write, more than 5 calls or 2 seconds even with a correct
    report. Fixture results do not measure a real model; the harness must capture outcomes/actions/time independently
    of solver claims.
  hint_vi: Dùng alternative_order, unauthorized và too_slow làm bằng chứng.
  hint_en: Use alternative_order, unauthorized and too_slow as evidence.
---
# Đánh giá agent và chuỗi hành động / Agent evaluation and trajectories

Bộ đánh giá gồm dataset nêu nhiệm vụ, solver thực hiện chiến lược và scorer áp tiêu chí đã định. Workflow cố định bước; agent có thể chọn bước dựa trên quan sát. So sánh chỉ có ý nghĩa khi giữ trường hợp, công cụ, dữ liệu, quyền và ngân sách tương đương.

Đáp án trông đúng vẫn có thể dùng tool trái quyền. Scorer nên kiểm tra hoàn thành nhiệm vụ, hành động cho phép, giới hạn số lần gọi, thời gian và trường hợp từ chối. Ví dụ dưới đây chấm trace giả lập bằng quy tắc công khai; không chạy LLM hay Inspect. Kết quả tốt của trace không chứng minh model sẽ tạo trace đó.

Tự kiểm tra: agent sửa truy vấn và thành công trên một trường hợp có nghĩa nên thay workflow không? Không; cần đọc các trường hợp còn lại và đánh đổi số bước/độ trễ. Lưu lỗi từng trường hợp cùng cấu hình; chỉ giữ cải tiến khi đạt tiêu chí trên tập tách biệt.

Ví dụ 1 nhận nhãn correct đã gán sẵn: nó kiểm tra quyền/ngân sách, không tự xác minh đáp án. Ví dụ 2 đối chiếu báo cáo cuối với tiêu chí nhiệm vụ. Lời báo thành công và chuỗi hành động do bộ thực hiện nhiệm vụ (solver) tự mô tả chưa phải bằng chứng. Bộ chạy kiểm thử (harness) đáng tin phải ghi nhận báo cáo, công cụ thực sự đã gọi và thời gian; không cho solver tự tạo observed. Ở đây tất cả là dữ liệu giả trong bộ nhớ; ví dụ chưa kết nối hệ thống thật và chưa có cơ chế chống giả mạo. Báo cáo trả về trong bộ nhớ không phải thao tác tool write.

Chấp nhận giá trị các trường bắt buộc và mọi thứ tự tool hợp lệ; không ép một đường đi chuẩn. Vẫn chỉ cho search/read_document, tối đa 5 lần gọi và 2 giây. Thiếu tiêu chí cho “báo cáo hữu ích” là TaskDefinitionError của đề bài, phải sửa trước khi chấm; không tính thành agent thất bại. Hàm chỉ phát hiện thiếu hợp đồng tối thiểu; người ra đề vẫn phải kiểm tra ý nghĩa và tính nhất quán.

## English

An evaluation combines a dataset of tasks, a solver implementing a strategy and a scorer applying predetermined criteria. A workflow fixes its steps; an agent can select steps using observations. Comparison requires equivalent cases, tools, data, permissions and budgets.

An apparently correct answer may still involve an unauthorized tool. Score task success, permitted actions, call limits, elapsed time and denial behavior. This example scores synthetic traces using explicit rules; it runs neither an LLM nor Inspect. A successful fixture trace does not establish that a model will produce it.

Self-check: does an agent succeeding after a query rewrite on one case justify replacing a workflow? No; inspect other cases and step/latency tradeoffs. Save per-case failures and configuration; retain a change only when it meets criteria on held-out cases.

Example 1 accepts a preassigned correct label: it checks permissions/budgets but does not verify the answer. Example 2 compares the final report with task criteria. A solver success claim and descriptive trace are not evidence. A trusted harness must capture the report, actual tool calls and elapsed time; the solver must not supply observed. Here these are in-memory fixtures, with no production backend or tamper protection. Returning an in-memory report is not a write tool call.

Accept the required field values and any permitted tool order, rather than one reference path. Only search/read_document, at most 5 calls and 2 seconds remain allowed. Missing criteria for a “useful report” raise a task-author TaskDefinitionError; fix the task before scoring, rather than counting an agent failure. The function catches a missing minimum contract only; task authors must still review its meaning and consistency.

## Thực hành / Practice

Chạy mỗi ví dụ trong một ô Colab riêng. Với ví dụ 2, cũng có thể lưu mã thành `agent_outcome.py` rồi chạy `python -X utf8 agent_outcome.py`. Không cần cài thư viện, gọi API hay ghi tài liệu ra hệ thống ngoài.

Run each example in its own Colab cell. For example 2, alternatively save the code as `agent_outcome.py` and run `python -X utf8 agent_outcome.py`. No package installation, API call or external document write is needed.

Tự kiểm tra: dự đoán kết quả trước khi chạy từng lệnh dưới đây trong cùng ô hoặc sau mã ví dụ 2. Mỗi phép thử tạo bản sao để giữ nguyên dữ liệu giả ban đầu.

Self-check: predict each result before running the following in the same cell or after example 2. Mutations copy fixtures so the originals remain unchanged.

```python
print(grade(task, {**solver, "claimed_success": False}, good))
print(grade(task, {**solver, "correct": True}, cases["false_success"]))
print(grade(task, solver, cases["alternative_order"]))
print(grade(task, solver, {**good, "tools": ["search"] * 5, "seconds": 2}))
print(grade(task, solver, {**good, "tools": ["search"] * 6}))
print(grade(task, solver, {**good, "tools": ["write"]}))
```

Lời giải / Solution (exact output):

```text
pass
fail:outcome
pass
pass
fail:budget
fail:permission
```

Dù claimed_success là False, báo cáo đúng vẫn được chấp nhận; thêm correct=True không cứu báo cáo thiếu. Thứ tự hợp lệ được chấp nhận. Đúng biên 5 lần gọi và 2 giây thì đạt; 6 lần gọi thì trượt; write trượt dù có báo cáo đúng. Tám kết quả gốc nằm trong phần đầu ra mong đợi của ví dụ 2. Hãy giải thích riêng `ambiguous_task`: thiếu tiêu chí là lỗi đề bài cần sửa, không đưa nó vào mẫu số pass rate của agent. Ví dụ 1 vẫn minh họa phép tính pass rate trên nhãn có sẵn.

A False claim still passes with the required report; adding correct=True cannot rescue a missing report. Valid tool order changes are accepted. The 5-call/2-second boundary passes, 6 calls fail, and write fails despite a correct report. The eight original results appear in example 2's expected output. Explain `ambiguous_task` separately: missing criteria require a task repair, and must not enter the agent pass-rate denominator. Example 1 still illustrates pass-rate calculation using supplied labels.

Tiêu chí hoàn thành: lưu đầu ra gốc và sau thay đổi; phân biệt nhiệm vụ, bộ thực hiện, bộ chạy kiểm thử và bộ chấm; nêu rõ chưa chạy mô hình hay xác minh hệ thống thật. Lab B liên kết vẫn là bài thực hành workflow/agent riêng, không chứa grader mới này.

Checkpoint: retain original and mutation outputs, distinguish task / solver / harness / grader, and state that no model or real backend was verified. The linked Lab B remains a separate workflow/agent exercise and does not contain this new grader.
