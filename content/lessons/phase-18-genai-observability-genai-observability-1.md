---
lesson_id: phase-18-genai-observability-genai-observability-1
phase_id: phase-18-genai-observability
module_id: genai-observability
title_vi: Nhật ký có cấu trúc và truy vết
title_en: Structured logging and tracing
summary_vi: Nối các bước bằng trace_id và span_id, ghi độ trễ mà không lưu dữ liệu nhạy cảm.
summary_en: Correlate steps with trace_id and span_id and record latency without retaining sensitive payloads.
learning_objectives:
- Nối các bước bằng trace_id và span_id, ghi độ trễ mà không lưu dữ liệu nhạy cảm.
- Thêm một trường bí mật lồng nhau vào raw event; kiểm tra đầu ra chỉ còn trường cho phép và hai bước vẫn cùng trace_id.
- Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
learning_objectives_en:
- Correlate steps with trace_id and span_id and record latency without retaining sensitive payloads.
- Add a nested secret field to a raw event; verify only allowed fields remain and both steps still share a trace_id.
- Adding prompt or authorization to a raw event must not expose them in the filtered log.
prerequisites:
- phase-17-genai-evaluation-genai-evaluation-4
- phase-17-genai-evaluation-genai-evaluation-1
key_terms:
- structured
- logging
- tracing
- inference
- observability
- reproducibility
- deployment
- genai-observability
concept_notes_vi: 'Log ghi một sự kiện; trace nối các bước của cùng yêu cầu, chẳng hạn retrieval và kiểm tra quyền.
  trace_id dùng chung, span_id nhận diện bước và parent_span_id thể hiện quan hệ. Thời gian đo cần cùng đơn vị;
  token và chi phí chỉ ghi khi có số đo hoặc nguồn tính rõ ràng.


  Ví dụ dùng sự kiện tự tạo với độ trễ giả lập để kiểm tra cấu trúc, không benchmark runtime. Thay vì ghi toàn bộ
  prompt và kết quả công cụ, bộ lọc chỉ giữ danh sách trường cho phép. Không lưu token đăng nhập, nội dung tài liệu
  hay suy nghĩ nội bộ của mô hình. trace_id là ID mờ, không dùng email hoặc tên người làm ID.


  Tự kiểm tra: bỏ trường password có đảm bảo log an toàn không? Không; bí mật có thể nằm trong prompt hoặc trường
  lồng nhau. Allowlist hạn chế bề mặt dữ liệu nhưng vẫn cần chính sách lưu giữ, kiểm soát truy cập và kiểm tra giá
  trị. Lab C dùng dữ liệu mô phỏng để thử redaction và quyền.'
concept_notes_en: 'A log records an event; a trace links steps belonging to one request, such as retrieval and authorization.
  A shared trace_id identifies the request, span_id identifies a step and parent_span_id expresses its relationship.
  Timing needs consistent units; record tokens and cost only when measurements or explicit accounting sources exist.


  This example uses synthetic events and illustrative latency, not a runtime benchmark. Instead of saving full prompts
  and tool responses, a filter retains only allowlisted fields. Do not log credentials, document bodies or model-internal
  reasoning. Use opaque trace IDs rather than emails or personal names.


  Self-check: does deleting password make a log safe? No; secrets may occur in prompts or nested fields. An allowlist
  reduces the data surface but still needs retention policy, access control and value inspection. Lab C tests redaction
  and permissions with fixtures.'
why_it_matters_vi: Nối các bước bằng trace_id và span_id, ghi độ trễ mà không lưu dữ liệu nhạy cảm.
why_it_matters_en: Correlate steps with trace_id and span_id and record latency without retaining sensitive payloads.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Thêm một trường bí mật lồng nhau vào raw event; kiểm tra đầu ra chỉ còn trường cho phép và hai bước vẫn cùng trace_id.
- Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Add a nested secret field to a raw event; verify only allowed fields remain and both steps still share a trace_id.
- Adding prompt or authorization to a raw event must not expose them in the filtered log.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Thêm một trường bí mật lồng nhau vào raw event; kiểm tra đầu ra chỉ còn trường cho phép và hai bước vẫn
      cùng trace_id.
    deliverables:
    - Hai sự kiện JSON có quan hệ trace/span, status và latency_ms, không có payload nhạy cảm
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Add a nested secret field to a raw event; verify only allowed fields remain and both steps still share
      a trace_id.
    deliverables:
    - Two related JSON events with trace/span IDs, status and latency_ms, without sensitive payloads
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Adding prompt or authorization to a raw event must not expose them in the filtered log.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Nhật ký có cấu trúc và truy vết” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain structured logging and tracing to a new teammate?
  - Which assumption behind structured logging and tracing could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Correlate redacted structured events
  code: "import json\nSAFE_FIELDS = {\"trace_id\", \"span_id\", \"parent_span_id\", \"operation\", \"status\", \"\
    latency_ms\"}\ndef redact(event):\n    return {key: value for key, value in event.items() if key in SAFE_FIELDS}\n\
    raw = [\n    dict(trace_id=\"t1\", span_id=\"s1\", parent_span_id=None, operation=\"search\",\n         status=\"\
    ok\", latency_ms=12, prompt=\"PRIVATE\", authorization=\"SECRET\"),\n    dict(trace_id=\"t1\", span_id=\"s2\"\
    , parent_span_id=\"s1\", operation=\"read_document\",\n         status=\"denied\", latency_ms=3, payload={\"\
    token\": \"SECRET\"}),\n]\nevents = [redact(e) for e in raw]\nserialized = json.dumps(events)\nprint(json.dumps({\"\
    trace_ids\": sorted({e[\"trace_id\"] for e in events}),\n                  \"parent\": events[1][\"parent_span_id\"\
    ],\n                  \"latency_fixture_ms\": sum(e[\"latency_ms\"] for e in events),\n                  \"\
    secret_present\": \"SECRET\" in serialized or \"PRIVATE\" in serialized}))\n"
  status: runnable
  purpose_vi: Nối các bước bằng trace_id và span_id, ghi độ trễ mà không lưu dữ liệu nhạy cảm.
  purpose_en: Correlate steps with trace_id and span_id and record latency without retaining sensitive payloads.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"trace_ids": ["t1"], "parent": "s1", "latency_fixture_ms": 15, "secret_present": false}'
  edge_case_vi: Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
  edge_case_en: Adding prompt or authorization to a raw event must not expose them in the filtered log.
  explanation_vi: Allowlist loại nguyên payload; các con số độ trễ là dữ liệu mô phỏng, không phải phép đo dịch
    vụ thật.
  explanation_en: The allowlist discards whole payloads; latency values are fixtures, not real service measurements.
resources:
- language: en
  title: OpenTelemetry Python
  url: https://opentelemetry.io/docs/languages/python/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Prometheus Overview
  url: https://prometheus.io/docs/introduction/overview/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Langfuse Documentation
  url: https://langfuse.com/docs
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python logging
  url: https://docs.python.org/3/library/logging.html
  language: en
  purpose_vi: Ghi đủ thông tin ngữ cảnh để tìm lỗi khi phát triển và vận hành ứng dụng.
  read_vi: Đọc về mức độ nhật ký, logger và handler; tránh ghi bí mật hoặc thông tin nhận dạng cá nhân (PII).
  purpose_en: Add structured context for debugging and production.
  read_en: Read levels, loggers, and handlers; never log secrets or PII.
  kind: official
  required: false
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab C
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-c-security-regression.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy từng ô và đối chiếu báo cáo. Lab dùng công cụ giả lập chỉ
    đọc, không tải model; tải báo cáo để lưu kết quả.
  read_en: Run in Colab on a Google-hosted CPU runtime and inspect each report. This lab uses read-only fake tools
    and downloads no model; download the report to retain results.
exercise_ids:
- exercise-18-genai-observability
review_item_ids:
- phase-18-genai-observability-genai-observability-1-recall
- phase-18-genai-observability-genai-observability-1-application
- phase-18-genai-observability-genai-observability-1-debug
- phase-18-genai-observability-genai-observability-1-interview
estimated_minutes: 60
completion_checklist:
- Thêm một trường bí mật lồng nhau vào raw event; kiểm tra đầu ra chỉ còn trường cho phép và hai bước vẫn cùng trace_id.
- Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Hai sự kiện JSON có quan hệ trace/span, status và latency_ms, không có payload nhạy cảm
- Thêm prompt hoặc authorization vào raw event không được làm chúng xuất hiện trong log đã lọc.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-18-genai-observability-genai-observability-2
- phase-18-genai-observability-genai-observability-3
review_question_vi: Nội dung cốt lõi của “Nhật ký có cấu trúc và truy vết” là gì?
review_question_en: Define structured logging and tracing in your own words. What are the input, transformation
  and output?
review_answer_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm
  hoặc lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.
review_answer_en: A strong answer names the input, transformation, output and the context where structured logging
  and tracing is used. Relate it specifically to structured logging and tracing in lesson phase-18-genai-observability-genai-observability-1.
review_cards:
- id: phase-18-genai-observability-genai-observability-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Nhật ký có cấu trúc và truy vết” là gì?
  question_en: Define structured logging and tracing in your own words. What are the input, transformation and output?
  answer_vi: Nhật ký ghi sự kiện; truy vết nối các bước xử lý của một yêu cầu. Mã truy vết giúp tìm bước chậm hoặc
    lỗi trong chuỗi truy xuất, gọi mô hình và công cụ.
  answer_en: A strong answer names the input, transformation, output and the context where structured logging and
    tracing is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-18-genai-observability-genai-observability-1-application
  type: application
  question_vi: Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết.
  question_en: Write a small code example or design that applies structured logging and tracing to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết”, cần lưu: bản ghi yêu cầu có
    mã truy vết, thời gian và lượng tài nguyên. Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.'
  answer_en: The structured logging and tracing example should have an explicit input, expected output and a way
    to run or verify it (phase-18-genai-observability-genai-observability-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-18-genai-observability-genai-observability-1-debug
  type: debug
  question_vi: Khi làm bài “Nhật ký có cấu trúc và truy vết”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If structured logging and tracing produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Nhật ký có cấu trúc và truy vết”, lỗi cần tránh là: ghi prompt nhạy cảm chỉ để tiện tìm
    lỗi. Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For structured logging and tracing, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-18-genai-observability-genai-observability-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-18-genai-observability-genai-observability-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Nhật ký có cấu trúc và truy vết” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of structured logging and tracing?
  answer_vi: Bắt đầu từ nhiệm vụ “Theo dõi một yêu cầu qua các bước bằng cùng mã truy vết”. Trình bày kết quả đã
    lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about structured logging and tracing should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-18-genai-observability-genai-observability-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Nhật ký có cấu trúc và truy vết / Structured logging and tracing

Log ghi một sự kiện; trace nối các bước của cùng yêu cầu, chẳng hạn retrieval và kiểm tra quyền. trace_id dùng chung, span_id nhận diện bước và parent_span_id thể hiện quan hệ. Thời gian đo cần cùng đơn vị; token và chi phí chỉ ghi khi có số đo hoặc nguồn tính rõ ràng.

Ví dụ dùng sự kiện tự tạo với độ trễ giả lập để kiểm tra cấu trúc, không benchmark runtime. Thay vì ghi toàn bộ prompt và kết quả công cụ, bộ lọc chỉ giữ danh sách trường cho phép. Không lưu token đăng nhập, nội dung tài liệu hay suy nghĩ nội bộ của mô hình. trace_id là ID mờ, không dùng email hoặc tên người làm ID.

Tự kiểm tra: bỏ trường password có đảm bảo log an toàn không? Không; bí mật có thể nằm trong prompt hoặc trường lồng nhau. Allowlist hạn chế bề mặt dữ liệu nhưng vẫn cần chính sách lưu giữ, kiểm soát truy cập và kiểm tra giá trị. Lab C dùng dữ liệu mô phỏng để thử redaction và quyền.

## English

A log records an event; a trace links steps belonging to one request, such as retrieval and authorization. A shared trace_id identifies the request, span_id identifies a step and parent_span_id expresses its relationship. Timing needs consistent units; record tokens and cost only when measurements or explicit accounting sources exist.

This example uses synthetic events and illustrative latency, not a runtime benchmark. Instead of saving full prompts and tool responses, a filter retains only allowlisted fields. Do not log credentials, document bodies or model-internal reasoning. Use opaque trace IDs rather than emails or personal names.

Self-check: does deleting password make a log safe? No; secrets may occur in prompts or nested fields. An allowlist reduces the data surface but still needs retention policy, access control and value inspection. Lab C tests redaction and permissions with fixtures.

## Thực hành / Practice

Thêm một trường bí mật lồng nhau vào raw event; kiểm tra đầu ra chỉ còn trường cho phép và hai bước vẫn cùng trace_id.

Add a nested secret field to a raw event; verify only allowed fields remain and both steps still share a trace_id.
