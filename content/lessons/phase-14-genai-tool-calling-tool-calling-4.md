---
lesson_id: phase-14-genai-tool-calling-tool-calling-4
phase_id: phase-14-genai-tool-calling
module_id: tool-calling
title_vi: Xử lý lỗi và thực thi công cụ an toàn
title_en: Error handling and secure tool execution
summary_vi: Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng.
summary_en: Learn Error handling and secure tool execution through an input → transformation → output model, then
  verify it with an edge-case exercise.
learning_objectives:
- Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.
- Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain error handling and secure tool execution with a concrete example.
- Write or adapt a small code example applying error handling and secure tool execution.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-14-genai-tool-calling-tool-calling-3
- phase-13-genai-advanced-rag-advanced-rag-1
key_terms:
- error
- handling
- secure
- tool
- execution
- token
- embedding
- retrieval
- evaluation
- tool-calling
concept_notes_vi: Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần
  thiết và ghi dấu vết thao tác mà không lộ bí mật.
concept_notes_en: Error handling và secure tool execution extends a model with controlled actions. Tool schemas
  must validate inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions,
  step logs, and human approval for side effects.
why_it_matters_vi: Kiểm tra lời gọi và quyền trước khi biến đề xuất của mô hình thành hành động.
why_it_matters_en: Tool calling turns model output into actions, so its contracts must be stricter than ordinary
  chat.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Error handling and secure tool execution” trong tài liệu tham khảo; đối chiếu với phần
  giải thích của bài.
- Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.
- Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp. Ghi kết quả đối chiếu và điều bạn đã
  sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Tool calling turns model output into actions, so its contracts must be stricter
  than ordinary chat.'
- Open OpenAI Function Calling Guide, read the section marked Read this lesson, and record one verified example
  or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build a mock database tool with schema validation, bounded retries, timeouts, and
  an audit log without secrets.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây công cụ đọc cơ sở dữ liệu giả lập
      có kiểm tra schema, thời gian chờ, thử lại giới hạn và nhật ký không chứa bí mật.'
    deliverables:
    - Lời gọi công cụ mẫu và kết quả kiểm tra quyền, tham số hoặc lỗi
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Build a mock database tool with schema validation, bounded retries, timeouts, and an audit log without
      secrets.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Invalid tool input cannot cause side effects, retries do not duplicate transactions, and errors
      are actionable.
    stretch: Add a failure test for error handling and secure tool execution and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xử lý lỗi và thực thi công cụ an toàn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain error handling and secure tool execution to a new teammate?
  - Which assumption behind error handling and secure tool execution could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Error handling and secure tool execution: inspect one complete path'
  code: "# Topic: Error handling and secure tool execution (phase-14-genai-tool-calling-tool-calling-4)\ndef grounded_answer(answer:\
    \ str, evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return\
    \ answer + '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for error handling and secure tool execution.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
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
  title: Tenacity Documentation
  url: https://tenacity.readthedocs.io/en/latest/
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
- exercise-14-tool-calling
review_item_ids:
- phase-14-genai-tool-calling-tool-calling-4-recall
- phase-14-genai-tool-calling-tool-calling-4-application
- phase-14-genai-tool-calling-tool-calling-4-debug
- phase-14-genai-tool-calling-tool-calling-4-interview
estimated_minutes: 60
completion_checklist:
- Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.
- Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp.
common_mistakes:
- Coi đề xuất của mô hình là quyền tự động thực thi công cụ.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-15-genai-agents-ai-agents-1
- phase-15-genai-agents-ai-agents-2
review_question_vi: Nội dung cốt lõi của “Xử lý lỗi và thực thi công cụ an toàn” là gì?
review_question_en: Define error handling and secure tool execution in your own words. What are the input, transformation
  and output?
review_answer_vi: Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần
  thiết và ghi dấu vết thao tác mà không lộ bí mật.
review_answer_en: A strong answer names the input, transformation, output and the context where error handling and
  secure tool execution is used. Relate it specifically to error handling and secure tool execution in lesson phase-14-genai-tool-calling-tool-calling-4.
review_cards:
- id: phase-14-genai-tool-calling-tool-calling-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xử lý lỗi và thực thi công cụ an toàn” là gì?
  question_en: Define error handling and secure tool execution in your own words. What are the input, transformation
    and output?
  answer_vi: Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần thiết
    và ghi dấu vết thao tác mà không lộ bí mật.
  answer_en: A strong answer names the input, transformation, output and the context where error handling and secure
    tool execution is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-14-genai-tool-calling-tool-calling-4-application
  type: application
  question_vi: Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.
  question_en: Write a small code example or design that applies error handling and secure tool execution to an
    AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập”, cần lưu:
    lời gọi công cụ mẫu và kết quả kiểm tra quyền, tham số hoặc lỗi. Xác nhận lời gọi sai bị chặn và việc thử lại
    không tạo tác dụng phụ lặp.'
  answer_en: The error handling and secure tool execution example should have an explicit input, expected output
    and a way to run or verify it (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-14-genai-tool-calling-tool-calling-4-debug
  type: debug
  question_vi: Khi làm bài “Xử lý lỗi và thực thi công cụ an toàn”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If error handling and secure tool execution produces a wrong result or a metric drops, what would
    you debug first?
  answer_vi: 'Trong bài “Xử lý lỗi và thực thi công cụ an toàn”, lỗi cần tránh là: coi đề xuất của mô hình là quyền
    tự động thực thi công cụ. Xác nhận lời gọi sai bị chặn và việc thử lại không tạo tác dụng phụ lặp. Dùng ví dụ
    nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For error handling and secure tool execution, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-14-genai-tool-calling-tool-calling-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xử lý lỗi và thực thi công cụ an toàn” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of error handling and secure
    tool execution?
  answer_vi: Bắt đầu từ nhiệm vụ “Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about error handling and secure tool execution should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-14-genai-tool-calling-tool-calling-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xử lý lỗi và thực thi công cụ an toàn / Error handling and secure tool execution

Lỗi công cụ cần có thông tin đủ để quyết định sửa yêu cầu, thử lại hoặc dừng. Chỉ cấp quyền cần thiết và ghi dấu vết thao tác mà không lộ bí mật.

## Thực hành

Phân biệt lỗi có thể thử lại với lỗi phải dừng trong một công cụ giả lập.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây công cụ đọc cơ sở dữ liệu giả lập có kiểm tra schema, thời gian chờ, thử lại giới hạn và nhật ký không chứa bí mật.
