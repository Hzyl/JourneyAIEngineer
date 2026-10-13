---
lesson_id: phase-16-genai-mcp-mcp-1
phase_id: phase-16-genai-mcp
module_id: mcp
title_vi: Kiến trúc MCP và luồng thông điệp
title_en: MCP architecture and message flow
summary_vi: Phân biệt host/client/server và kiểm tra thứ tự initialize, initialized, tools/list của MCP.
summary_en: Distinguish MCP host/client/server and validate the initialize, initialized, tools/list sequence.
learning_objectives:
- Phân biệt host/client/server và kiểm tra thứ tự initialize, initialized, tools/list của MCP.
- Chạy luồng hợp lệ rồi thử tools/list trước khởi tạo và sai phiên bản; ghi vị trí bị từ chối.
- tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration test.
learning_objectives_en:
- Distinguish MCP host/client/server and validate the initialize, initialized, tools/list sequence.
- Run the valid sequence, then try tools/list before initialization and a version mismatch; record where each is
  rejected.
- tools/list before notifications/initialized must be rejected; do not label this as an SDK integration test.
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
concept_notes_vi: 'Host là ứng dụng giữ tương tác và chính sách với người dùng; host quản lý client kết nối tới
  server. Server cung cấp capability như tools và resources. MCP chuẩn hóa trao đổi khả năng và thông điệp; nó không
  phải mô hình, không tự điều phối agent và không thay thế kiểm tra quyền của ứng dụng.


  Bài cố định spec 2025-06-18. Client gửi initialize với protocolVersion, capabilities và clientInfo; server phản
  hồi phiên bản/capability hỗ trợ. Client kiểm tra tương thích rồi gửi notifications/initialized trước thao tác
  thông thường. Chỉ sử dụng capability đã thương lượng. Phiên bản không hỗ trợ cần xử lý lỗi/ngắt kết nối, không
  im lặng tiếp tục.


  Ví dụ là máy trạng thái thông điệp tối giản, không phải MCP server hoặc SDK đang chạy. Nó không triển khai transport
  stdio/HTTP, timeout hay JSON-RPC đầy đủ. Tự kiểm tra: tools/list thành công có chứng minh người dùng được gọi
  mọi tool không? Không; khám phá tool khác với cấp quyền thực thi.'
concept_notes_en: 'A host is the user-facing application that owns policy and manages clients connecting to servers.
  Servers expose capabilities such as tools and resources. MCP standardizes capability and message exchange; it
  is not a model, an agent orchestrator or a replacement for application authorization.


  This lesson pins specification 2025-06-18. The client sends initialize with protocolVersion, capabilities and
  clientInfo; the server returns its supported version and capabilities. The client checks compatibility and sends
  notifications/initialized before normal operations. Use only negotiated capabilities. Handle unsupported versions
  as an error or disconnect rather than silently continuing.


  The example is a minimal message-state simulation, not an MCP server or an executed SDK integration. It implements
  neither stdio/HTTP transport nor complete timeout or JSON-RPC handling. Self-check: does a successful tools/list
  grant access to every tool? No; discovery and execution authorization are separate.'
why_it_matters_vi: Phân biệt host/client/server và kiểm tra thứ tự initialize, initialized, tools/list của MCP.
why_it_matters_en: Distinguish MCP host/client/server and validate the initialize, initialized, tools/list sequence.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy luồng hợp lệ rồi thử tools/list trước khởi tạo và sai phiên bản; ghi vị trí bị từ chối.
- tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration test.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run the valid sequence, then try tools/list before initialization and a version mismatch; record where each is
  rejected.
- tools/list before notifications/initialized must be rejected; do not label this as an SDK integration test.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy luồng hợp lệ rồi thử tools/list trước khởi tạo và sai phiên bản; ghi vị trí bị từ chối.
    deliverables:
    - Sơ đồ host–client–server và bảng thứ tự thông điệp cho spec 2025-06-18
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration
      test.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run the valid sequence, then try tools/list before initialization and a version mismatch; record where
      each is rejected.
    deliverables:
    - A host–client–server diagram and message-order table for specification 2025-06-18
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: tools/list before notifications/initialized must be rejected; do not label this as an SDK integration
      test.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
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
  title: Check the MCP 2025-06-18 initialization order
  code: "import json\nVERSION = \"2025-06-18\"\nclass Session:\n    def __init__(self):\n        self.state = \"\
    new\"\n    def receive(self, message):\n        method = message[\"method\"]\n        if method == \"initialize\"\
    \ and self.state == \"new\":\n            if message[\"params\"][\"protocolVersion\"] != VERSION:\n        \
    \        return \"unsupported_version\"\n            self.state = \"negotiated\"\n            return {\"protocolVersion\"\
    : VERSION, \"capabilities\": {\"tools\": {}}}\n        if method == \"notifications/initialized\" and self.state\
    \ == \"negotiated\":\n            self.state = \"ready\"\n            return \"ready\"\n        if method ==\
    \ \"tools/list\" and self.state == \"ready\":\n            return [\"read_document\"]\n        return \"invalid_sequence\"\
    \nsession = Session()\nearly = session.receive({\"method\": \"tools/list\"})\nreply = session.receive({\"method\"\
    : \"initialize\", \"params\": {\n    \"protocolVersion\": VERSION, \"capabilities\": {},\n    \"clientInfo\"\
    : {\"name\": \"lesson-fixture\", \"version\": \"1\"}}})\nsession.receive({\"method\": \"notifications/initialized\"\
    })\nwrong = Session().receive({\"method\": \"initialize\", \"params\": {\"protocolVersion\": \"unsupported\"\
    }})\nprint(json.dumps({\"early\": early, \"version\": reply[\"protocolVersion\"],\n                  \"tools\"\
    : session.receive({\"method\": \"tools/list\"}), \"wrong\": wrong}))\n"
  status: runnable
  purpose_vi: Phân biệt host/client/server và kiểm tra thứ tự initialize, initialized, tools/list của MCP.
  purpose_en: Distinguish MCP host/client/server and validate the initialize, initialized, tools/list sequence.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"early": "invalid_sequence", "version": "2025-06-18", "tools": ["read_document"], "wrong":
    "unsupported_version"}'
  edge_case_vi: tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration
    test.
  edge_case_en: tools/list before notifications/initialized must be rejected; do not label this as an SDK integration
    test.
  explanation_vi: State machine mô phỏng bước thương lượng, không kiểm chứng kết nối MCP thật hoặc transport.
  explanation_en: The state machine simulates negotiation and does not verify a real MCP connection or transport.
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
- title: MCP 2025-06-18 — Lifecycle
  url: https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle
  purpose_vi: Đối chiếu trình tự khởi tạo và thương lượng capability với spec cố định.
  purpose_en: Check initialization and capability negotiation against the pinned specification.
  read_vi: Đọc Initialization, Version Negotiation và Capability Negotiation; bài không dùng SDK.
  read_en: Read Initialization, Version Negotiation and Capability Negotiation; this lesson uses no SDK.
  language: en
  kind: official
  required: false
exercise_ids:
- exercise-16-mcp
review_item_ids:
- phase-16-genai-mcp-mcp-1-recall
- phase-16-genai-mcp-mcp-1-application
- phase-16-genai-mcp-mcp-1-debug
- phase-16-genai-mcp-mcp-1-interview
estimated_minutes: 60
completion_checklist:
- Chạy luồng hợp lệ rồi thử tools/list trước khởi tạo và sai phiên bản; ghi vị trí bị từ chối.
- tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration test.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Sơ đồ host–client–server và bảng thứ tự thông điệp cho spec 2025-06-18
- tools/list trước notifications/initialized phải bị từ chối; không gọi ví dụ này là SDK integration test.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
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

Host là ứng dụng giữ tương tác và chính sách với người dùng; host quản lý client kết nối tới server. Server cung cấp capability như tools và resources. MCP chuẩn hóa trao đổi khả năng và thông điệp; nó không phải mô hình, không tự điều phối agent và không thay thế kiểm tra quyền của ứng dụng.

Bài cố định spec 2025-06-18. Client gửi initialize với protocolVersion, capabilities và clientInfo; server phản hồi phiên bản/capability hỗ trợ. Client kiểm tra tương thích rồi gửi notifications/initialized trước thao tác thông thường. Chỉ sử dụng capability đã thương lượng. Phiên bản không hỗ trợ cần xử lý lỗi/ngắt kết nối, không im lặng tiếp tục.

Ví dụ là máy trạng thái thông điệp tối giản, không phải MCP server hoặc SDK đang chạy. Nó không triển khai transport stdio/HTTP, timeout hay JSON-RPC đầy đủ. Tự kiểm tra: tools/list thành công có chứng minh người dùng được gọi mọi tool không? Không; khám phá tool khác với cấp quyền thực thi.

## English

A host is the user-facing application that owns policy and manages clients connecting to servers. Servers expose capabilities such as tools and resources. MCP standardizes capability and message exchange; it is not a model, an agent orchestrator or a replacement for application authorization.

This lesson pins specification 2025-06-18. The client sends initialize with protocolVersion, capabilities and clientInfo; the server returns its supported version and capabilities. The client checks compatibility and sends notifications/initialized before normal operations. Use only negotiated capabilities. Handle unsupported versions as an error or disconnect rather than silently continuing.

The example is a minimal message-state simulation, not an MCP server or an executed SDK integration. It implements neither stdio/HTTP transport nor complete timeout or JSON-RPC handling. Self-check: does a successful tools/list grant access to every tool? No; discovery and execution authorization are separate.

## Thực hành / Practice

Chạy luồng hợp lệ rồi thử tools/list trước khởi tạo và sai phiên bản; ghi vị trí bị từ chối.

Run the valid sequence, then try tools/list before initialization and a version mismatch; record where each is rejected.
