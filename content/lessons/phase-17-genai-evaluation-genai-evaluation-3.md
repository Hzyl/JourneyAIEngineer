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
- Chấm cùng hai trường hợp với hai solver giả lập; thêm hành động write vào trace có đáp án đúng và xác nhận scorer
  đánh trượt.
- Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
learning_objectives_en:
- Compare workflow and agent on identical cases, scoring task success alongside permissions and step count.
- Score the same two cases for two simulated solvers; add write to a correct-answer trace and confirm the scorer
  rejects it.
- A correct answer with write or more than five tool calls must fail.
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
  khi đạt tiêu chí trên tập tách biệt.'
concept_notes_en: 'An evaluation combines a dataset of tasks, a solver implementing a strategy and a scorer applying
  predetermined criteria. A workflow fixes its steps; an agent can select steps using observations. Comparison requires
  equivalent cases, tools, data, permissions and budgets.


  An apparently correct answer may still involve an unauthorized tool. Score task success, permitted actions, call
  limits, elapsed time and denial behavior. This example scores synthetic traces using explicit rules; it runs neither
  an LLM nor Inspect. A successful fixture trace does not establish that a model will produce it.


  Self-check: does an agent succeeding after a query rewrite on one case justify replacing a workflow? No; inspect
  other cases and step/latency tradeoffs. Save per-case failures and configuration; retain a change only when it
  meets criteria on held-out cases.'
why_it_matters_vi: So workflow và agent trên cùng trường hợp, chấm đúng nhiệm vụ cùng quyền và số bước.
why_it_matters_en: Compare workflow and agent on identical cases, scoring task success alongside permissions and
  step count.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chấm cùng hai trường hợp với hai solver giả lập; thêm hành động write vào trace có đáp án đúng và xác nhận scorer
  đánh trượt.
- Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Score the same two cases for two simulated solvers; add write to a correct-answer trace and confirm the scorer
  rejects it.
- A correct answer with write or more than five tool calls must fail.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chấm cùng hai trường hợp với hai solver giả lập; thêm hành động write vào trace có đáp án đúng và xác
      nhận scorer đánh trượt.
    deliverables:
    - Bảng dataset/solver/scorer, kết quả từng trường hợp và hành động bị từ chối
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Score the same two cases for two simulated solvers; add write to a correct-answer trace and confirm the
      scorer rejects it.
    deliverables:
    - A dataset/solver/scorer table, per-case results and rejected actions
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: A correct answer with write or more than five tool calls must fail.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Đánh giá agent và chuỗi hành động” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain agent evaluation and trajectories to a new teammate?
  - Which assumption behind agent evaluation and trajectories could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Pass rate = cases satisfying every criterion / all evaluated cases
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
exercise_ids:
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-3-recall
- phase-17-genai-evaluation-genai-evaluation-3-application
- phase-17-genai-evaluation-genai-evaluation-3-debug
- phase-17-genai-evaluation-genai-evaluation-3-interview
estimated_minutes: 60
completion_checklist:
- Chấm cùng hai trường hợp với hai solver giả lập; thêm hành động write vào trace có đáp án đúng và xác nhận scorer
  đánh trượt.
- Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng dataset/solver/scorer, kết quả từng trường hợp và hành động bị từ chối
- Đúng đáp án nhưng có write hoặc hơn 5 tool call vẫn phải không đạt.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Chỉ dùng một điểm tổng để kết luận mọi thành phần đều tốt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-4
- phase-18-genai-observability-genai-observability-1
review_question_vi: Nội dung cốt lõi của “Đánh giá agent và chuỗi hành động” là gì?
review_question_en: Define agent evaluation and trajectories in your own words. What are the input, transformation
  and output?
review_answer_vi: 'Agent cần được đánh giá cả kết quả lẫn đường đi: công cụ đã gọi, quyền sử dụng, lỗi, số bước
  và chi phí. Hoàn thành nhiệm vụ không bù được thao tác ngoài phạm vi cho phép.'
review_answer_en: A strong answer names the input, transformation, output and the context where agent evaluation
  and trajectories is used. Relate it specifically to agent evaluation and trajectories in lesson phase-17-genai-evaluation-genai-evaluation-3.
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đánh giá agent và chuỗi hành động” là gì?
  question_en: Define agent evaluation and trajectories in your own words. What are the input, transformation and
    output?
  answer_vi: 'Agent cần được đánh giá cả kết quả lẫn đường đi: công cụ đã gọi, quyền sử dụng, lỗi, số bước và chi
    phí. Hoàn thành nhiệm vụ không bù được thao tác ngoài phạm vi cho phép.'
  answer_en: A strong answer names the input, transformation, output and the context where agent evaluation and
    trajectories is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-3-application
  type: application
  question_vi: Đọc chuỗi hành động và kiểm tra mục tiêu, quyền, điều kiện dừng.
  question_en: Write a small code example or design that applies agent evaluation and trajectories to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đọc chuỗi hành động và kiểm tra mục tiêu, quyền, điều kiện dừng”, cần lưu: tiêu chí
    chấm và kết quả trên tình huống đúng, sai. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng câu
    trả lời.'
  answer_en: The agent evaluation and trajectories example should have an explicit input, expected output and a
    way to run or verify it (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-3-debug
  type: debug
  question_vi: Khi làm bài “Đánh giá agent và chuỗi hành động”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If agent evaluation and trajectories produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Đánh giá agent và chuỗi hành động”, lỗi cần tránh là: chỉ dùng một điểm tổng để kết luận
    mọi thành phần đều tốt. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng câu trả lời. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For agent evaluation and trajectories, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đánh giá agent và chuỗi hành động” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of agent evaluation and trajectories?
  answer_vi: Bắt đầu từ nhiệm vụ “Đọc chuỗi hành động và kiểm tra mục tiêu, quyền, điều kiện dừng”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about agent evaluation and trajectories should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-17-genai-evaluation-genai-evaluation-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đánh giá agent và chuỗi hành động / Agent evaluation and trajectories

Bộ đánh giá gồm dataset nêu nhiệm vụ, solver thực hiện chiến lược và scorer áp tiêu chí đã định. Workflow cố định bước; agent có thể chọn bước dựa trên quan sát. So sánh chỉ có ý nghĩa khi giữ trường hợp, công cụ, dữ liệu, quyền và ngân sách tương đương.

Đáp án trông đúng vẫn có thể dùng tool trái quyền. Scorer nên kiểm tra hoàn thành nhiệm vụ, hành động cho phép, giới hạn số lần gọi, thời gian và trường hợp từ chối. Ví dụ dưới đây chấm trace giả lập bằng quy tắc công khai; không chạy LLM hay Inspect. Kết quả tốt của trace không chứng minh model sẽ tạo trace đó.

Tự kiểm tra: agent sửa truy vấn và thành công trên một trường hợp có nghĩa nên thay workflow không? Không; cần đọc các trường hợp còn lại và đánh đổi số bước/độ trễ. Lưu lỗi từng trường hợp cùng cấu hình; chỉ giữ cải tiến khi đạt tiêu chí trên tập tách biệt.

## English

An evaluation combines a dataset of tasks, a solver implementing a strategy and a scorer applying predetermined criteria. A workflow fixes its steps; an agent can select steps using observations. Comparison requires equivalent cases, tools, data, permissions and budgets.

An apparently correct answer may still involve an unauthorized tool. Score task success, permitted actions, call limits, elapsed time and denial behavior. This example scores synthetic traces using explicit rules; it runs neither an LLM nor Inspect. A successful fixture trace does not establish that a model will produce it.

Self-check: does an agent succeeding after a query rewrite on one case justify replacing a workflow? No; inspect other cases and step/latency tradeoffs. Save per-case failures and configuration; retain a change only when it meets criteria on held-out cases.

## Thực hành / Practice

Chấm cùng hai trường hợp với hai solver giả lập; thêm hành động write vào trace có đáp án đúng và xác nhận scorer đánh trượt.

Score the same two cases for two simulated solvers; add write to a correct-answer trace and confirm the scorer rejects it.
