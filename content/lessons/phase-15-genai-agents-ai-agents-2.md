---
lesson_id: phase-15-genai-agents-ai-agents-2
phase_id: phase-15-genai-agents
module_id: ai-agents
title_vi: 'Bộ nhớ: trạng thái, lịch sử và truy xuất'
title_en: 'Memory: state, history, and retrieval'
summary_vi: Chọn bằng chứng liên quan trong ngân sách context và phân biệt state, lịch sử, truy xuất.
summary_en: Select relevant evidence within a context budget and distinguish state, history and retrieval.
learning_objectives:
- Chọn bằng chứng liên quan trong ngân sách context và phân biệt state, lịch sử, truy xuất.
- Thử ngân sách 0, 4 và 8 từ minh họa; ghi ID được chọn và giải thích vì sao đoạn trái quyền luôn bị loại.
- Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
learning_objectives_en:
- Select relevant evidence within a context budget and distinguish state, history and retrieval.
- Try illustrative budgets of 0, 4 and 8 words; record selected IDs and explain why unauthorized passages are always
  excluded.
- A zero budget returns an empty list; duplicate IDs and unauthorized passages cannot add context.
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
concept_notes_vi: 'State lưu tiến độ có cấu trúc, chẳng hạn bước hiện tại và nguồn đã đọc. Lịch sử là các lượt trao
  đổi; truy xuất tìm thông tin từ kho ngoài. Prompt engineering sửa lời hướng dẫn, còn context engineering còn quyết
  định lịch sử, bằng chứng và kết quả công cụ nào được đưa vào mỗi lượt.


  Nạp toàn bộ lịch sử có thể tốn context và mang theo dữ liệu đã cũ hoặc trái quyền. Ví dụ lọc quyền trước, chọn
  đoạn liên quan, không lặp nguồn và dừng ở ngân sách. Đếm từ bằng split là đơn vị minh họa; khi chạy model thật
  phải dùng tokenizer đúng model để đếm token, đồng thời dự trù chỗ cho đầu ra.


  Tự kiểm tra: context ít hơn có luôn tốt hơn không? Không; bỏ bằng chứng cần thiết có thể giảm chất lượng. So cùng
  câu hỏi và nguồn chuẩn, ghi cả lượng context và nguồn bị bỏ. State trong RAM cũng không phải checkpoint lưu bền;
  bài người duyệt tiếp theo minh họa phục hồi từ đĩa.'
concept_notes_en: 'State stores structured progress such as the current step and sources already read. History contains
  conversation turns; retrieval locates information in an external collection. Prompt engineering changes instructions,
  while context engineering also chooses which history, evidence and tool results enter each turn.


  Loading all history can consume context and retain stale or unauthorized data. The example filters permissions
  first, selects relevant passages, deduplicates sources and enforces a budget. Counting with split is an illustrative
  word unit; real execution requires the model''s tokenizer and space reserved for output tokens.


  Self-check: is less context always better? No; dropping necessary evidence may reduce quality. Compare the same
  questions and source labels, recording context size and omitted sources. RAM state is also not a durable checkpoint;
  the next human-review lesson demonstrates disk recovery.'
why_it_matters_vi: Chọn bằng chứng liên quan trong ngân sách context và phân biệt state, lịch sử, truy xuất.
why_it_matters_en: Select relevant evidence within a context budget and distinguish state, history and retrieval.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Thử ngân sách 0, 4 và 8 từ minh họa; ghi ID được chọn và giải thích vì sao đoạn trái quyền luôn bị loại.
- Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Try illustrative budgets of 0, 4 and 8 words; record selected IDs and explain why unauthorized passages are always
  excluded.
- A zero budget returns an empty list; duplicate IDs and unauthorized passages cannot add context.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Thử ngân sách 0, 4 và 8 từ minh họa; ghi ID được chọn và giải thích vì sao đoạn trái quyền luôn bị loại.
    deliverables:
    - Bảng ngân sách, nguồn được chọn, nguồn bị loại và lý do
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Try illustrative budgets of 0, 4 and 8 words; record selected IDs and explain why unauthorized passages
      are always excluded.
    deliverables:
    - A table of budgets, included/excluded sources and reasons
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: A zero budget returns an empty list; duplicate IDs and unauthorized passages cannot add context.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - 'Bạn sẽ giải thích nội dung “Bộ nhớ: trạng thái, lịch sử và truy xuất” bằng ví dụ nào?'
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - 'How would you explain memory: state, history, and retrieval to a new teammate?'
  - 'Which assumption behind memory: state, history, and retrieval could fail in production?'
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Select authorized evidence under a context budget
  code: "import json\ndef select_context(passages, user, budget):\n    selected, used, seen = [], 0, set()\n   \
    \ for p in sorted(passages, key=lambda row: -row[\"relevance\"]):\n        if user not in p[\"allowed_users\"\
    ] or p[\"id\"] in seen:\n            continue\n        size = len(p[\"text\"].split())\n        if used + size\
    \ <= budget:\n            selected.append(p[\"id\"])\n            seen.add(p[\"id\"])\n            used += size\n\
    \    return {\"ids\": selected, \"word_units\": used}\npassages = [\n    dict(id=\"private\", text=\"Hidden\
    \ policy\", relevance=10, allowed_users=[\"an\"]),\n    dict(id=\"guide\", text=\"Public course guide here\"\
    , relevance=8, allowed_users=[\"binh\"]),\n    dict(id=\"guide\", text=\"Duplicate guide\", relevance=7, allowed_users=[\"\
    binh\"]),\n    dict(id=\"faq\", text=\"Course frequently asked questions\", relevance=6, allowed_users=[\"binh\"\
    ]),\n]\nprint(json.dumps({str(b): select_context(passages, \"binh\", b) for b in (0, 4, 8)}))\n"
  status: runnable
  purpose_vi: Chọn bằng chứng liên quan trong ngân sách context và phân biệt state, lịch sử, truy xuất.
  purpose_en: Select relevant evidence within a context budget and distinguish state, history and retrieval.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"0": {"ids": [], "word_units": 0}, "4": {"ids": ["guide"], "word_units": 4}, "8": {"ids": ["guide",
    "faq"], "word_units": 8}}'
  edge_case_vi: Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
  edge_case_en: A zero budget returns an empty list; duplicate IDs and unauthorized passages cannot add context.
  explanation_vi: Bộ chọn dùng điểm liên quan giả lập và số từ, không phải điểm model hay số token thật.
  explanation_en: The selector uses simulated relevance and word counts, not model scores or real token counts.
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
- language: en
  title: 'Anthropic: Effective Context Engineering for AI Agents'
  url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  kind: official
  required: false
  purpose_vi: Bổ sung cách tuyển chọn ngữ cảnh hữu hạn gồm chỉ dẫn, công cụ, lịch sử và dữ liệu truy xuất cho agent.
  purpose_en: Adds guidance on curating finite agent context across instructions, tools, history, and retrieved
    data.
  read_vi: Đọc các phần về tuyển chọn ngữ cảnh, truy xuất đúng lúc và tác vụ dài; so sánh bằng chứng/kết quả thay
    vì giả định context ngắn hơn luôn tốt hơn.
  read_en: Read the context-curation, just-in-time retrieval, and long-horizon sections; compare evidence and outcomes
    rather than assuming shorter context is always better.
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
exercise_ids:
- exercise-15-ai-agents
review_item_ids:
- phase-15-genai-agents-ai-agents-2-recall
- phase-15-genai-agents-ai-agents-2-application
- phase-15-genai-agents-ai-agents-2-debug
- phase-15-genai-agents-ai-agents-2-interview
estimated_minutes: 60
completion_checklist:
- Thử ngân sách 0, 4 và 8 từ minh họa; ghi ID được chọn và giải thích vì sao đoạn trái quyền luôn bị loại.
- Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng ngân sách, nguồn được chọn, nguồn bị loại và lý do
- Ngân sách 0 trả danh sách rỗng; đoạn trùng ID hoặc trái quyền không được nạp thêm.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Cho agent tiếp tục vô hạn hoặc bỏ qua yêu cầu người duyệt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-15-genai-agents-ai-agents-3
- phase-15-genai-agents-ai-agents-4
review_question_vi: 'Nội dung cốt lõi của “Bộ nhớ: trạng thái, lịch sử và truy xuất” là gì?'
review_question_en: 'Define memory: state, history, and retrieval in your own words. What are the input, transformation
  and output?'
review_answer_vi: Trạng thái lưu thông tin đang cần cho công việc; lịch sử ghi các sự kiện; truy xuất tìm lại thông
  tin liên quan. Chỉ giữ dữ liệu cần thiết và kiểm tra nguồn trước khi dùng làm căn cứ.
review_answer_en: 'A strong answer names the input, transformation, output and the context where memory: state,
  history, and retrieval is used. Relate it specifically to memory: state, history, and retrieval in lesson phase-15-genai-agents-ai-agents-2.'
review_cards:
- id: phase-15-genai-agents-ai-agents-2-recall
  type: recall
  question_vi: 'Nội dung cốt lõi của “Bộ nhớ: trạng thái, lịch sử và truy xuất” là gì?'
  question_en: 'Define memory: state, history, and retrieval in your own words. What are the input, transformation
    and output?'
  answer_vi: Trạng thái lưu thông tin đang cần cho công việc; lịch sử ghi các sự kiện; truy xuất tìm lại thông tin
    liên quan. Chỉ giữ dữ liệu cần thiết và kiểm tra nguồn trước khi dùng làm căn cứ.
  answer_en: 'A strong answer names the input, transformation, output and the context where memory: state, history,
    and retrieval is used.'
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-15-genai-agents-ai-agents-2-application
  type: application
  question_vi: Phân loại dữ liệu cần lưu thành trạng thái, lịch sử hoặc tài liệu truy xuất.
  question_en: 'Write a small code example or design that applies memory: state, history, and retrieval to an AI
    engineering problem.'
  answer_vi: 'Với nhiệm vụ “Phân loại dữ liệu cần lưu thành trạng thái, lịch sử hoặc tài liệu truy xuất”, cần lưu:
    kế hoạch hoặc chuỗi hành động có trạng thái và giới hạn. Thử tình huống không đạt mục tiêu và xác nhận điều
    kiện dừng.'
  answer_en: 'The memory: state, history, and retrieval example should have an explicit input, expected output and
    a way to run or verify it (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-15-genai-agents-ai-agents-2-debug
  type: debug
  question_vi: 'Khi làm bài “Bộ nhớ: trạng thái, lịch sử và truy xuất”, bạn cần tránh lỗi nào và kiểm tra lại ra
    sao?'
  question_en: 'If memory: state, history, and retrieval produces a wrong result or a metric drops, what would you
    debug first?'
  answer_vi: 'Trong bài “Bộ nhớ: trạng thái, lịch sử và truy xuất”, lỗi cần tránh là: cho agent tiếp tục vô hạn
    hoặc bỏ qua yêu cầu người duyệt. Thử tình huống không đạt mục tiêu và xác nhận điều kiện dừng. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: 'For memory: state, history, and retrieval, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-15-genai-agents-ai-agents-2-interview
  type: interview
  question_vi: 'Bạn dùng kết quả nào từ bài “Bộ nhớ: trạng thái, lịch sử và truy xuất” để giải thích cách làm và
    giới hạn?'
  question_en: 'In an interview, how would you explain a trade-off and one edge case of memory: state, history,
    and retrieval?'
  answer_vi: Bắt đầu từ nhiệm vụ “Phân loại dữ liệu cần lưu thành trạng thái, lịch sử hoặc tài liệu truy xuất”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: 'The answer about memory: state, history, and retrieval should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-15-genai-agents-ai-agents-2).'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bộ nhớ: trạng thái, lịch sử và truy xuất / Memory: state, history, and retrieval

State lưu tiến độ có cấu trúc, chẳng hạn bước hiện tại và nguồn đã đọc. Lịch sử là các lượt trao đổi; truy xuất tìm thông tin từ kho ngoài. Prompt engineering sửa lời hướng dẫn, còn context engineering còn quyết định lịch sử, bằng chứng và kết quả công cụ nào được đưa vào mỗi lượt.

Nạp toàn bộ lịch sử có thể tốn context và mang theo dữ liệu đã cũ hoặc trái quyền. Ví dụ lọc quyền trước, chọn đoạn liên quan, không lặp nguồn và dừng ở ngân sách. Đếm từ bằng split là đơn vị minh họa; khi chạy model thật phải dùng tokenizer đúng model để đếm token, đồng thời dự trù chỗ cho đầu ra.

Tự kiểm tra: context ít hơn có luôn tốt hơn không? Không; bỏ bằng chứng cần thiết có thể giảm chất lượng. So cùng câu hỏi và nguồn chuẩn, ghi cả lượng context và nguồn bị bỏ. State trong RAM cũng không phải checkpoint lưu bền; bài người duyệt tiếp theo minh họa phục hồi từ đĩa.

## English

State stores structured progress such as the current step and sources already read. History contains conversation turns; retrieval locates information in an external collection. Prompt engineering changes instructions, while context engineering also chooses which history, evidence and tool results enter each turn.

Loading all history can consume context and retain stale or unauthorized data. The example filters permissions first, selects relevant passages, deduplicates sources and enforces a budget. Counting with split is an illustrative word unit; real execution requires the model's tokenizer and space reserved for output tokens.

Self-check: is less context always better? No; dropping necessary evidence may reduce quality. Compare the same questions and source labels, recording context size and omitted sources. RAM state is also not a durable checkpoint; the next human-review lesson demonstrates disk recovery.

## Thực hành / Practice

Thử ngân sách 0, 4 và 8 từ minh họa; ghi ID được chọn và giải thích vì sao đoạn trái quyền luôn bị loại.

Try illustrative budgets of 0, 4 and 8 words; record selected IDs and explain why unauthorized passages are always excluded.
