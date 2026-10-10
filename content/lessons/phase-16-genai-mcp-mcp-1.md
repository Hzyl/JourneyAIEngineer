---
lesson_id: phase-16-genai-mcp-mcp-1
phase_id: phase-16-genai-mcp
module_id: mcp
title_vi: Kiến trúc MCP và luồng thông điệp
title_en: MCP architecture and message flow
summary_vi: MCP chuẩn hóa trao đổi giữa ứng dụng và nguồn công cụ, ngữ cảnh.
summary_en: Learn MCP architecture and message flow through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain mcp architecture and message flow with a concrete example.
- Write or adapt a small code example applying mcp architecture and message flow.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-15-genai-agents-ai-agents-4
- phase-15-genai-agents-ai-agents-1
key_terms:
- mcp
- architecture
- message
- flow
- token
- embedding
- retrieval
- evaluation
concept_notes_vi: MCP chuẩn hóa trao đổi giữa ứng dụng và nguồn công cụ, ngữ cảnh. Phân biệt ứng dụng chủ, client
  và server để biết phần nào khám phá khả năng, gửi yêu cầu và thực thi.
concept_notes_en: MCP architecture và message flow extends a model with controlled actions. Tool schemas must validate
  inputs, limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and
  human approval for side effects.
why_it_matters_vi: Hiểu cách kết nối công cụ, ngữ cảnh và giữ ranh giới quyền truy cập.
why_it_matters_en: MCP standardizes how models discover context and capabilities without removing access-control
  responsibility.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “MCP architecture and message flow” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: MCP standardizes how models discover context and capabilities without removing
  access-control responsibility.'
- Open MCP Getting Started, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a local MCP server exposing one resource and one read-only tool, then test
  schemas and access control.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết server MCP cục bộ cung cấp một
      tài nguyên và một công cụ chỉ đọc; kiểm tra schema cùng quyền.'
    deliverables:
    - Sơ đồ hoặc thông điệp mẫu thể hiện client, server và quyền
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a local MCP server exposing one resource and one read-only tool, then test schemas and access control.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can draw the client/server flow, distinguish tools from resources/prompts, and state a minimum
      threat model.
    stretch: Add a failure test for mcp architecture and message flow and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kiến trúc MCP và luồng thông điệp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain mcp architecture and message flow to a new teammate?
  - Which assumption behind mcp architecture and message flow could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'MCP architecture and message flow: inspect one complete path'
  code: "# Topic: MCP architecture and message flow (phase-16-genai-mcp-mcp-1)\ndef grounded_answer(answer: str,\
    \ evidence: list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer\
    \ + '\\nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for mcp architecture and message flow.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: MCP Getting Started
  url: https://modelcontextprotocol.io/docs/getting-started/intro
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MCP Specification
  url: https://modelcontextprotocol.io/specification/2025-06-18
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MCP Python SDK
  url: https://github.com/modelcontextprotocol/python-sdk
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
- exercise-16-mcp
review_item_ids:
- phase-16-genai-mcp-mcp-1-recall
- phase-16-genai-mcp-mcp-1-application
- phase-16-genai-mcp-mcp-1-debug
- phase-16-genai-mcp-mcp-1-interview
estimated_minutes: 60
completion_checklist:
- Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
common_mistakes:
- Cho rằng giao thức kết nối tự thay thế việc kiểm soát quyền truy cập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-16-genai-mcp-mcp-2
- phase-16-genai-mcp-mcp-3
review_question_vi: Nội dung cốt lõi của “Kiến trúc MCP và luồng thông điệp” là gì?
review_question_en: Define mcp architecture and message flow in your own words. What are the input, transformation
  and output?
review_answer_vi: MCP chuẩn hóa trao đổi giữa ứng dụng và nguồn công cụ, ngữ cảnh. Phân biệt ứng dụng chủ, client
  và server để biết phần nào khám phá khả năng, gửi yêu cầu và thực thi.
review_answer_en: A strong answer names the input, transformation, output and the context where mcp architecture
  and message flow is used. Relate it specifically to mcp architecture and message flow in lesson phase-16-genai-mcp-mcp-1.
review_cards:
- id: phase-16-genai-mcp-mcp-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kiến trúc MCP và luồng thông điệp” là gì?
  question_en: Define mcp architecture and message flow in your own words. What are the input, transformation and
    output?
  answer_vi: MCP chuẩn hóa trao đổi giữa ứng dụng và nguồn công cụ, ngữ cảnh. Phân biệt ứng dụng chủ, client và
    server để biết phần nào khám phá khả năng, gửi yêu cầu và thực thi.
  answer_en: A strong answer names the input, transformation, output and the context where mcp architecture and
    message flow is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-16-genai-mcp-mcp-1-application
  type: application
  question_vi: Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.
  question_en: Write a small code example or design that applies mcp architecture and message flow to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Vẽ luồng khám phá công cụ và gọi công cụ qua client, server”, cần lưu: sơ đồ hoặc thông
    điệp mẫu thể hiện client, server và quyền. Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.'
  answer_en: The mcp architecture and message flow example should have an explicit input, expected output and a
    way to run or verify it (phase-16-genai-mcp-mcp-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-16-genai-mcp-mcp-1-debug
  type: debug
  question_vi: Khi làm bài “Kiến trúc MCP và luồng thông điệp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If mcp architecture and message flow produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Kiến trúc MCP và luồng thông điệp”, lỗi cần tránh là: cho rằng giao thức kết nối tự thay
    thế việc kiểm soát quyền truy cập. Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For mcp architecture and message flow, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-16-genai-mcp-mcp-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-16-genai-mcp-mcp-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kiến trúc MCP và luồng thông điệp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of mcp architecture and message
    flow?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ luồng khám phá công cụ và gọi công cụ qua client, server”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about mcp architecture and message flow should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-16-genai-mcp-mcp-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiến trúc MCP và luồng thông điệp / MCP architecture and message flow

MCP chuẩn hóa trao đổi giữa ứng dụng và nguồn công cụ, ngữ cảnh. Phân biệt ứng dụng chủ, client và server để biết phần nào khám phá khả năng, gửi yêu cầu và thực thi.

## Thực hành

Vẽ luồng khám phá công cụ và gọi công cụ qua client, server.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết server MCP cục bộ cung cấp một tài nguyên và một công cụ chỉ đọc; kiểm tra schema cùng quyền.
