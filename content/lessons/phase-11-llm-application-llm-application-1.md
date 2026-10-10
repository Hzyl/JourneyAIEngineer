---
lesson_id: phase-11-llm-application-llm-application-1
phase_id: phase-11-llm-application
module_id: llm-application
title_vi: Chat completion và vòng đời tin nhắn
title_en: Chat completion and message lifecycle
summary_vi: Ứng dụng chat cần quản lý vai trò, thứ tự tin nhắn và phần lịch sử đưa vào mỗi yêu cầu.
summary_en: Learn Chat completion and message lifecycle through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.
- Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain chat completion and message lifecycle with a concrete example.
- Write or adapt a small code example applying chat completion and message lifecycle.
- Recognize its assumptions, limits and one common failure mode.
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
concept_notes_vi: Ứng dụng chat cần quản lý vai trò, thứ tự tin nhắn và phần lịch sử đưa vào mỗi yêu cầu. Lịch sử
  hiển thị cho người dùng có thể dài hơn phần mô hình thật sự nhận.
concept_notes_en: 'Chat completion và message lifecycle belongs to LLM Application Engineering: design the contract
  between the application and the model. Define instructions, inputs, output schema, timeout, retry, and token limits;
  parse model output as untrusted data and return actionable errors.'
why_it_matters_vi: Xác định cấu trúc trao đổi và cách xử lý lỗi quanh mô hình để ứng dụng dùng được kết quả.
why_it_matters_en: LLM application engineering designs contracts and failure boundaries around a model, not just
  a long prompt.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Chat completion and message lifecycle” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.
- Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: LLM application engineering designs contracts and failure boundaries around
  a model, not just a long prompt.'
- Open OpenAI Function Calling Guide, read the section marked Read this lesson, and record one verified example
  or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build an LLM Chat API with request/response schemas, simulated streaming, backoff
  retries, and a token budget.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây API chat có schema yêu cầu, phản
      hồi, streaming giả lập, thử lại với khoảng chờ tăng dần và ngân sách token.'
    deliverables:
    - Hội thoại hoặc yêu cầu API mẫu cùng phản hồi đã kiểm tra
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Build an LLM Chat API with request/response schemas, simulated streaming, backoff retries, and a token
      budget.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: Another client can call the API without knowing internal prompts, and schema failures plus rate
      limits have dedicated tests.
    stretch: Add a failure test for chat completion and message lifecycle and explain the result.
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
  title: 'Chat completion and message lifecycle: inspect one complete path'
  code: "# Topic: Chat completion and message lifecycle (phase-11-llm-application-llm-application-1)\nfrom dataclasses\
    \ import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for chat completion and message lifecycle.
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
- exercise-11-llm-application
review_item_ids:
- phase-11-llm-application-llm-application-1-recall
- phase-11-llm-application-llm-application-1-application
- phase-11-llm-application-llm-application-1-debug
- phase-11-llm-application-llm-application-1-interview
estimated_minutes: 60
completion_checklist:
- Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.
- Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra vai trò tin nhắn, schema và hành vi khi yêu cầu thất bại.
common_mistakes:
- Tin đầu ra mô hình mà chưa kiểm tra cấu trúc và điều kiện sử dụng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
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

Ứng dụng chat cần quản lý vai trò, thứ tự tin nhắn và phần lịch sử đưa vào mỗi yêu cầu. Lịch sử hiển thị cho người dùng có thể dài hơn phần mô hình thật sự nhận.

## Thực hành

Lần theo một lượt chat và ghi rõ tin nhắn nào được gửi tới mô hình.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây API chat có schema yêu cầu, phản hồi, streaming giả lập, thử lại với khoảng chờ tăng dần và ngân sách token.
