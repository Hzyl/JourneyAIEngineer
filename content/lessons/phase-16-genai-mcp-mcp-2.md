---
lesson_id: phase-16-genai-mcp-mcp-2
phase_id: phase-16-genai-mcp
module_id: mcp
title_vi: Client và server MCP
title_en: MCP clients and servers
summary_vi: Client duy trì kết nối tới server; server công bố các khả năng mà nó cung cấp.
summary_en: Learn MCP clients and servers through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain mcp clients and servers with a concrete example.
- Write or adapt a small code example applying mcp clients and servers.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-16-genai-mcp-mcp-1
- phase-15-genai-agents-ai-agents-1
key_terms:
- mcp
- client
- server
- token
- embedding
- retrieval
- evaluation
concept_notes_vi: Client duy trì kết nối tới server; server công bố các khả năng mà nó cung cấp. Cấu hình kết nối
  không tự cấp quyền cho mọi thao tác, nên vẫn cần kiểm tra phạm vi truy cập.
concept_notes_en: MCP client và server extends a model with controlled actions. Tool schemas must validate inputs,
  limit permissions, and define timeout and retry; an agent loop needs stopping conditions, step logs, and human
  approval for side effects.
why_it_matters_vi: Hiểu cách kết nối công cụ, ngữ cảnh và giữ ranh giới quyền truy cập.
why_it_matters_en: MCP standardizes how models discover context and capabilities without removing access-control
  responsibility.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “MCP clients and servers” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.
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
    task: 'Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.


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
    stretch: Add a failure test for mcp clients and servers and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Client và server MCP” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain mcp clients and servers to a new teammate?
  - Which assumption behind mcp clients and servers could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'MCP clients and servers: inspect one complete path'
  code: "# Topic: MCP clients and servers (phase-16-genai-mcp-mcp-2)\ndef grounded_answer(answer: str, evidence:\
    \ list[str]) -> str:\n    if not evidence:\n        return 'Insufficient evidence'\n    return answer + '\\\
    nSources: ' + '; '.join(evidence)\n\nprint(grounded_answer('A concise answer', ['doc-1']))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for mcp clients and servers.
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
- title: argparse Documentation
  url: https://docs.python.org/3/library/argparse.html
  language: en
  purpose_vi: Tạo chương trình dòng lệnh có hướng dẫn sử dụng và tham số rõ ràng.
  read_vi: Đọc về tham số vị trí, tham số tùy chọn, kiểu dữ liệu và thông báo lỗi.
  purpose_en: Turn a script into a CLI with explicit help and inputs.
  read_en: Read positional/optional arguments, types, and errors.
  kind: official
  required: true
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
- phase-16-genai-mcp-mcp-2-recall
- phase-16-genai-mcp-mcp-2-application
- phase-16-genai-mcp-mcp-2-debug
- phase-16-genai-mcp-mcp-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi.
common_mistakes:
- Cho rằng giao thức kết nối tự thay thế việc kiểm soát quyền truy cập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-16-genai-mcp-mcp-3
- phase-16-genai-mcp-mcp-4
review_question_vi: Nội dung cốt lõi của “Client và server MCP” là gì?
review_question_en: Define mcp clients and servers in your own words. What are the input, transformation and output?
review_answer_vi: Client duy trì kết nối tới server; server công bố các khả năng mà nó cung cấp. Cấu hình kết nối
  không tự cấp quyền cho mọi thao tác, nên vẫn cần kiểm tra phạm vi truy cập.
review_answer_en: A strong answer names the input, transformation, output and the context where mcp clients and
  servers is used. Relate it specifically to mcp clients and servers in lesson phase-16-genai-mcp-mcp-2.
review_cards:
- id: phase-16-genai-mcp-mcp-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Client và server MCP” là gì?
  question_en: Define mcp clients and servers in your own words. What are the input, transformation and output?
  answer_vi: Client duy trì kết nối tới server; server công bố các khả năng mà nó cung cấp. Cấu hình kết nối không
    tự cấp quyền cho mọi thao tác, nên vẫn cần kiểm tra phạm vi truy cập.
  answer_en: A strong answer names the input, transformation, output and the context where mcp clients and servers
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-16-genai-mcp-mcp-2-application
  type: application
  question_vi: Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.
  question_en: Write a small code example or design that applies mcp clients and servers to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Giải thích trách nhiệm của client, server khi một yêu cầu thất bại”, cần lưu: sơ đồ
    hoặc thông điệp mẫu thể hiện client, server và quyền. Xác định nơi khám phá khả năng, kiểm tra quyền và thực
    thi.'
  answer_en: The mcp clients and servers example should have an explicit input, expected output and a way to run
    or verify it (phase-16-genai-mcp-mcp-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-16-genai-mcp-mcp-2-debug
  type: debug
  question_vi: Khi làm bài “Client và server MCP”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If mcp clients and servers produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Client và server MCP”, lỗi cần tránh là: cho rằng giao thức kết nối tự thay thế việc kiểm
    soát quyền truy cập. Xác định nơi khám phá khả năng, kiểm tra quyền và thực thi. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For mcp clients and servers, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-16-genai-mcp-mcp-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-16-genai-mcp-mcp-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Client và server MCP” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of mcp clients and servers?
  answer_vi: Bắt đầu từ nhiệm vụ “Giải thích trách nhiệm của client, server khi một yêu cầu thất bại”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about mcp clients and servers should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-16-genai-mcp-mcp-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Client và server MCP / MCP clients and servers

Client duy trì kết nối tới server; server công bố các khả năng mà nó cung cấp. Cấu hình kết nối không tự cấp quyền cho mọi thao tác, nên vẫn cần kiểm tra phạm vi truy cập.

## Thực hành

Giải thích trách nhiệm của client, server khi một yêu cầu thất bại.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết server MCP cục bộ cung cấp một tài nguyên và một công cụ chỉ đọc; kiểm tra schema cùng quyền.
