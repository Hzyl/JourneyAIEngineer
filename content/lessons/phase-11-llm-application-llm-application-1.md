---
lesson_id: phase-11-llm-application-llm-application-1
phase_id: phase-11-llm-application
module_id: llm-application
title_vi: Chat completion và vòng đời tin nhắn
title_en: Chat completion and message lifecycle
summary_vi: Lần theo payload của một lượt chat và đo baseline với ca đầy đủ, mất lịch sử và đầu vào rỗng.
summary_en: Trace one chat payload and measure a baseline with full history, lost history and empty input.
learning_objectives:
- Phân biệt lịch sử hiển thị với payload thực sự gửi đi.
- Viết trước kết quả mong đợi và kiểm tra vai trò, nội dung cùng lần sửa gần nhất.
- Ghi lỗi baseline trước khi tối ưu và giải thích giới hạn của phản hồi giả lập.
learning_objectives_en:
- Distinguish visible history from the submitted payload.
- Predefine expected results and check roles, content and the latest correction.
- Record baseline failures before optimizing and explain the limits of mock responses.
prerequisites:
- phase-10-genai-transformers-genai-transformers-4
- phase-10-genai-transformers-genai-transformers-1
key_terms:
- chat
- completion
- message
- lifecycle
- token
- embedding
- retrieval
- evaluation
- llm-application
concept_notes_vi: 'Ứng dụng chat quản lý vai trò, thứ tự tin nhắn và phần lịch sử gửi trong mỗi yêu cầu (payload).
  Lịch sử trên màn hình có thể dài hơn ngữ cảnh mô hình thực sự nhận. Trong ví dụ, system ghi quy tắc, user đặt
  hoặc sửa ngày, assistant ghi phản hồi; đây là hợp đồng dữ liệu của bài, không phải schema của một API cụ thể.


  Ngay ở ứng dụng đầu tiên, hãy tạo bản cơ sở (baseline) và ghi trước các trường hợp kiểm tra: hội thoại đầy đủ,
  lịch sử bị cắt và nội dung rỗng. Baseline là cách làm ban đầu để so sánh thay đổi. Ghi đầu vào, kết quả mong đợi,
  kết quả thực tế và lỗi từng trường hợp trước khi sửa prompt; một phản hồi nghe hợp lý chưa chứng minh hệ thống
  đúng.


  Người dùng sửa ngày từ 12 sang 18 rồi hỏi lại. Nếu chỉ giữ system và câu hỏi cuối, cả thông tin ngày lẫn lần sửa
  gần nhất đều mất. Hàm giả lập trả unknown; bộ kiểm tra vẫn yêu cầu 18 và báo lỗi trimmed_history. Mô hình thật
  cũng không thể dựa vào thông tin đã bị loại khỏi payload. Tự kiểm tra: thấy tin nhắn trên màn hình có chứng minh
  nó được gửi không? Không; cần kiểm tra chính payload, đồng thời che dữ liệu nhạy cảm khi ghi log.


  Ví dụ chạy hoàn toàn ngoại tuyến, dùng assert để minh họa kiểm tra hợp đồng và phản hồi giả lập theo quy tắc.
  Không dùng python -O vì chế độ đó bỏ assert; ứng dụng thật cần xử lý lỗi đầu vào rõ ràng. Kết quả 2/3 chỉ đo ba
  trường hợp này, không đo năng lực LLM, streaming hay retry. Bài Đánh giá LLM và xây tập kiểm tra ở phase 17 phát
  triển tiếp việc chấm nguồn và tách dev/test.'
concept_notes_en: 'A chat application manages roles, message order and the history sent in each request payload.
  Visible history may exceed the context actually received by a model. Here system stores the rule, user sets or
  corrects the day, and assistant records a reply; this is the lesson data contract, not a particular provider API
  schema.


  Start the first application with a baseline and predefined cases: full history, trimmed history and empty content.
  A baseline is the initial approach against which changes are compared. Record input, expected result, actual result
  and per-case failures before optimizing prompts; a plausible reply alone does not establish correctness.


  The user changes day 12 to 18 and then asks again. Keeping only system and the final question loses both the date
  and its recent correction. The mock returns unknown, while the evaluator still expects 18 and reports trimmed_history.
  A real model cannot rely on information omitted from its payload either. Self-check: does seeing a message on
  screen prove it was sent? No; inspect the actual payload and redact sensitive data in logs.


  This fully offline example uses assertions to illustrate contract checks and rule-based mock responses. Do not
  use python -O because it removes assertions; production applications need explicit input error handling. A 2/3
  result measures only these three cases, not LLM capability, streaming or retries. LLM evaluation and test sets
  in phase 17 extends this practice to source scoring and dev/test separation.'
why_it_matters_vi: Xác định cấu trúc trao đổi và cách xử lý lỗi quanh mô hình để ứng dụng dùng được kết quả.
why_it_matters_en: LLM application engineering designs contracts and failure boundaries around a model, not just
  a long prompt.
study_steps_vi:
- Đọc ví dụ hội thoại và đánh dấu tin nhắn sửa ngày từ 12 sang 18.
- Ghi dự đoán cho ba trường hợp trước khi chạy mã.
- Sao chép ví dụ vào chat_baseline.py và chạy python chat_baseline.py bằng Python riêng; bản web chỉ hiển thị mã.
- Đọc lỗi trimmed_history, rồi sửa cách chọn lịch sử để giữ lần sửa ngày gần nhất.
- Lưu bảng kết quả trước/sau và giải thích vì sao giả lập chưa đánh giá LLM thật.
study_steps_en:
- Read the conversation and locate the correction from day 12 to day 18.
- Write predictions for all three cases before running the code.
- Copy the example into chat_baseline.py and run python chat_baseline.py in your own Python environment; the web
  page only displays code.
- Inspect trimmed_history, then change history selection to retain the latest date correction.
- Save before/after results and explain why the mock does not evaluate a real LLM.
practice_plan:
  vi:
    task: Đo baseline ba trường hợp, rồi sửa cách chọn lịch sử mà không thay đáp án mong đợi.
    deliverables:
    - Tệp Python chạy độc lập và bảng expected/actual/pass theo ID.
    - Payload trước/sau đã loại dữ liệu nhạy cảm.
    - Một ghi chú về lỗi mất ràng buộc và giới hạn giả lập.
    checkpoint: Ban đầu đạt 2/3; trimmed_history nhận unknown thay vì 18. Sau khi giữ đúng lần sửa, cả ba đạt.
    stretch: Thêm lần sửa ngày thứ hai trước khi đổi mã; kiểm tra hệ thống giữ giá trị mới nhất.
  en:
    task: Measure the three-case baseline, then repair history selection without changing expected answers.
    deliverables:
    - A standalone Python file and expected/actual/pass results by ID.
    - Before/after payloads with sensitive data removed.
    - A note on lost constraints and mock limitations.
    checkpoint: Initially 2/3 pass; trimmed_history returns unknown instead of 18. Retaining the correct revision
      makes all three pass.
    stretch: Add a second date correction before changing code; verify the newest value wins.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Chat completion và vòng đời tin nhắn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain chat completion and message lifecycle to a new teammate?
  - Which assumption behind chat completion and message lifecycle could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Message payload baseline / Baseline payload tin nhắn
  code: "# Offline mock: validates our payload contract, not a provider API.\nimport json\n\nhistory = [\n    {\"\
    role\": \"system\", \"content\": \"Return the latest appointment day.\"},\n    {\"role\": \"user\", \"content\"\
    : \"day=12\"},\n    {\"role\": \"assistant\", \"content\": \"Recorded day 12.\"},\n    {\"role\": \"user\",\
    \ \"content\": \"Correction: day=18\"},\n    {\"role\": \"user\", \"content\": \"What day is my appointment?\"\
    },\n]\n\ndef mock_chat(messages):\n    assert messages and messages[0][\"role\"] == \"system\", \"missing_system\"\
    \n    assert messages[-1][\"role\"] == \"user\", \"missing_user_turn\"\n    for message in messages:\n     \
    \   assert message[\"role\"] in {\"system\", \"user\", \"assistant\"}, \"invalid_role\"\n        assert isinstance(message[\"\
    content\"], str) and message[\"content\"].strip(), \"empty_content\"\n    days = [m[\"content\"].split(\"day=\"\
    )[-1] for m in messages\n            if m[\"role\"] == \"user\" and \"day=\" in m[\"content\"]]\n    return\
    \ days[-1] if days else \"unknown\"\n\n# Define expected results before experimenting with history selection.\n\
    cases = [\n    (\"full_history\", history, \"18\"),\n    (\"trimmed_history\", [history[0], history[-1]], \"\
    18\"),\n    (\"empty_content\", [history[0], {\"role\": \"user\", \"content\": \"\"}], \"empty_content\"),\n\
    ]\nresults = []\nfor case_id, payload, expected in cases:\n    try:\n        actual = mock_chat(payload)\n \
    \   except AssertionError as error:\n        actual = str(error)\n    results.append({\"id\": case_id, \"expected\"\
    : expected, \"actual\": actual,\n                    \"pass\": actual == expected})\nprint(json.dumps(results,\
    \ ensure_ascii=False, indent=2))\nprint(f\"passed={sum(r['pass'] for r in results)}/{len(results)}; provider_cost=0\"\
    )\n"
  status: runnable
  purpose_vi: Kiểm tra payload và lỗi mất lần sửa ngày bằng giả lập ngoại tuyến.
  purpose_en: Check payloads and lost date corrections with an offline mock.
  setup: Python 3.11+; standard library only / chỉ thư viện chuẩn; python chat_baseline.py (không dùng / do not
    use -O).
  expected_output: 'full_history: 18; trimmed_history: unknown (expected 18); empty_content: empty_content; passed=2/3;
    provider_cost=0'
  edge_case_vi: Giữ system và câu hỏi cuối làm mất ngày đã sửa; bộ chấm phải báo lỗi thay vì đổi đáp án thành unknown.
  edge_case_en: Keeping system and the final question loses the corrected day; report failure instead of changing
    the expected answer to unknown.
  explanation_vi: Ba kết quả gồm hai ca đạt và một lỗi có chủ đích. assert chỉ phục vụ bài học; không gọi mô hình
    hoặc dịch vụ ngoài.
  explanation_en: Two cases pass and one deliberately fails. Assertions serve this lesson; no model or external
    service is called.
resources:
- language: en
  title: OpenAI Function Calling Guide
  url: https://platform.openai.com/docs/guides/function-calling
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: JSON Schema
  url: https://json-schema.org/learn/getting-started-step-by-step
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
  title: "Full Stack Deep Learning: LLM Bootcamp (April 2023)"
  url: https://fullstackdeeplearning.com/llm-bootcamp/
  kind: official
  required: false
  purpose_vi: "Tài liệu lịch sử tùy chọn về vòng đời ứng dụng LLM, từ prompt và UX tới đưa sản phẩm vào sử dụng."
  purpose_en: "Optional historical material on the LLM application lifecycle, from prompting and UX to putting a product into use."
  read_vi: "Đọc trang bootcamp và chọn bài phù hợp; nội dung từ tháng 4/2023, nên đối chiếu API/công cụ hiện hành và không coi là hướng dẫn mới."
  read_en: "Review the bootcamp page and select relevant lectures; it dates to April 2023, so verify current APIs/tools and do not treat it as current implementation guidance."
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
- exercise-11-llm-application
review_item_ids:
- phase-11-llm-application-llm-application-1-recall
- phase-11-llm-application-llm-application-1-application
- phase-11-llm-application-llm-application-1-debug
- phase-11-llm-application-llm-application-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được payload của cả ba trường hợp.
- Lưu kết quả baseline 2/3 và bản sửa 3/3 mà không đổi đáp án.
- Nêu giới hạn giả lập và cách che thông tin nhạy cảm khi ghi log.
completion_criteria:
- Có tệp chạy độc lập và bảng kết quả theo từng ID.
- Phát hiện lỗi mất lần sửa gần nhất, sửa cách chọn lịch sử và chạy lại.
- Không suy diễn điểm của giả lập thành chất lượng LLM thật.
common_mistakes:
- Cho rằng toàn bộ lịch sử trên giao diện đều được gửi đi.
- Đổi đáp án kiểm tra để che lỗi mất lịch sử.
- Tối ưu prompt trước khi ghi lỗi baseline hoặc coi giả lập là model thật.
next_lessons:
- phase-11-llm-application-llm-application-2
- phase-11-llm-application-llm-application-3
review_question_vi: Nội dung cốt lõi của “Chat completion và vòng đời tin nhắn” là gì?
review_question_en: Define chat completion and message lifecycle in your own words. What are the input, transformation
  and output?
review_answer_vi: Ứng dụng chat cần quản lý vai trò, thứ tự tin nhắn và phần lịch sử đưa vào mỗi yêu cầu. Lịch sử
  hiển thị cho người dùng có thể dài hơn phần mô hình thật sự nhận.
review_answer_en: A strong answer names the input, transformation, output and the context where chat completion
  and message lifecycle is used. Relate it specifically to chat completion and message lifecycle in lesson phase-11-llm-application-llm-application-1.
review_cards:
- id: phase-11-llm-application-llm-application-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Chat completion và vòng đời tin nhắn” là gì?
  question_en: Define chat completion and message lifecycle in your own words. What are the input, transformation
    and output?
  answer_vi: Ứng dụng chat cần quản lý vai trò, thứ tự tin nhắn và phần lịch sử đưa vào mỗi yêu cầu. Lịch sử hiển
    thị cho người dùng có thể dài hơn phần mô hình thật sự nhận.
  answer_en: A strong answer names the input, transformation, output and the context where chat completion and message
    lifecycle is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-11-llm-application-llm-application-1-application
  type: application
  question_vi: Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.
  question_en: Write a small code example or design that applies chat completion and message lifecycle to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình”, cần lưu: hội thoại
    hoặc yêu cầu API mẫu cùng phản hồi đã kiểm tra. Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất
    bại.'
  answer_en: The chat completion and message lifecycle example should have an explicit input, expected output and
    a way to run or verify it (phase-11-llm-application-llm-application-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-11-llm-application-llm-application-1-debug
  type: debug
  question_vi: Khi làm bài “Chat completion và vòng đời tin nhắn”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If chat completion and message lifecycle produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Chat completion và vòng đời tin nhắn”, lỗi cần tránh là: tin đầu ra mô hình mà chưa kiểm
    tra cấu trúc và điều kiện sử dụng. Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For chat completion and message lifecycle, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-11-llm-application-llm-application-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-11-llm-application-llm-application-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Chat completion và vòng đời tin nhắn” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of chat completion and message
    lifecycle?
  answer_vi: Bắt đầu từ nhiệm vụ “Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about chat completion and message lifecycle should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-11-llm-application-llm-application-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Chat completion và vòng đời tin nhắn / Chat completion and message lifecycle

Ứng dụng chat quản lý vai trò, thứ tự tin nhắn và phần lịch sử gửi trong mỗi yêu cầu (payload). Lịch sử trên màn hình có thể dài hơn ngữ cảnh mô hình thực sự nhận. Trong ví dụ, system ghi quy tắc, user đặt hoặc sửa ngày, assistant ghi phản hồi; đây là hợp đồng dữ liệu của bài, không phải schema của một API cụ thể.

Ngay ở ứng dụng đầu tiên, hãy tạo bản cơ sở (baseline) và ghi trước các trường hợp kiểm tra: hội thoại đầy đủ, lịch sử bị cắt và nội dung rỗng. Baseline là cách làm ban đầu để so sánh thay đổi. Ghi đầu vào, kết quả mong đợi, kết quả thực tế và lỗi từng trường hợp trước khi sửa prompt; một phản hồi nghe hợp lý chưa chứng minh hệ thống đúng.

Người dùng sửa ngày từ 12 sang 18 rồi hỏi lại. Nếu chỉ giữ system và câu hỏi cuối, cả thông tin ngày lẫn lần sửa gần nhất đều mất. Hàm giả lập trả unknown; bộ kiểm tra vẫn yêu cầu 18 và báo lỗi trimmed_history. Mô hình thật cũng không thể dựa vào thông tin đã bị loại khỏi payload. Tự kiểm tra: thấy tin nhắn trên màn hình có chứng minh nó được gửi không? Không; cần kiểm tra chính payload, đồng thời che dữ liệu nhạy cảm khi ghi log.

Ví dụ chạy hoàn toàn ngoại tuyến, dùng assert để minh họa kiểm tra hợp đồng và phản hồi giả lập theo quy tắc. Không dùng python -O vì chế độ đó bỏ assert; ứng dụng thật cần xử lý lỗi đầu vào rõ ràng. Kết quả 2/3 chỉ đo ba trường hợp này, không đo năng lực LLM, streaming hay retry. Bài Đánh giá LLM và xây tập kiểm tra ở phase 17 phát triển tiếp việc chấm nguồn và tách dev/test.

## Thực hành

Đo baseline ba trường hợp, rồi sửa cách chọn lịch sử mà không thay đáp án mong đợi. Sao chép mã trong mục ví dụ vào chat_baseline.py và chạy bằng Python riêng. Ban đầu cần thấy 2/3 ca đạt; sau khi sửa cách chọn lịch sử, cần thấy 3/3. Lưu cả hai kết quả cùng lời giải thích.
