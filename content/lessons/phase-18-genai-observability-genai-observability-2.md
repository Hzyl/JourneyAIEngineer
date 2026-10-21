---
lesson_id: phase-18-genai-observability-genai-observability-2
phase_id: phase-18-genai-observability
module_id: genai-observability
title_vi: Lượng token và độ trễ
title_en: Token usage and latency
summary_vi: Đếm token cho biết mức sử dụng, còn thời gian từng bước giúp tìm phần chậm.
summary_en: Learn Token usage and latency through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Ghi token và các mốc thời gian của một yêu cầu có streaming.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Đo latency/error/usage đúng phạm vi và liên kết request bằng trace ID mà không log dữ liệu nhạy cảm.
learning_objectives_en:
- Explain token usage and latency with a concrete example.
- Write or adapt a small code example applying token usage and latency.
- Recognize its assumptions, limits and one common failure mode.
- Measure latency, errors and usage at the right boundary and correlate requests without sensitive logs.
prerequisites:
- phase-18-genai-observability-genai-observability-1
- phase-17-genai-evaluation-genai-evaluation-1
key_terms:
- token
- usage
- latency
- inference
- observability
- reproducibility
- deployment
- genai-observability
concept_notes_vi: |-
  Đếm token cho biết mức sử dụng, còn thời gian từng bước giúp tìm phần chậm. Phân biệt thời gian tới phần trả lời đầu tiên với thời gian hoàn tất.

  Token là đơn vị tokenizer xử lý, không đồng nhất với từ hay ký tự. Độ trễ đầu tiên phản ánh lúc người dùng thấy phản hồi; độ trễ toàn bộ phản ánh lúc công việc thật sự kết thúc.

  Ví dụ, hai câu trả lời cùng số từ có thể dùng số token khác nhau do ngôn ngữ và cách mã hóa. Tự kiểm tra: giảm số token đầu vào có chắc giảm thời gian toàn hệ thống tương ứng không? Không; còn thời gian hàng đợi, truy xuất và tốc độ sinh. Đo từng bước cùng độ dài đầu vào, đầu ra trên cùng loại yêu cầu.

  Chuẩn bị: hiểu request/response, token và phần vị. Ví dụ dưới dùng ba sự kiện giả để kiểm tra cách tính, không phải thời gian đo. p95 theo nearest-rank lấy phần tử ceil(0.95*n) trong dãy sắp xếp; ít mẫu thì phần đuôi rất nhiễu. Tính error rate cùng latency, không loại timeout chỉ để p95 đẹp.

  Trong capstone thật, server tạo trace ID mới, trả X-Trace-Id và log route/status/elapsed_ms. Không log header, câu hỏi, context hay token bí mật. Đây là log có mã liên kết, chưa phải distributed tracing bằng OpenTelemetry SDK/exporter; nếu thêm retriever/model service, cần span con và propagate context có kiểm soát.

  Chạy benchmark_capstone.py --requests 20 --concurrency 1 --output evidence/load-c1.json, rồi concurrency 2. Tool chỉ nhận loopback để tránh vô ý tạo tải lên web thật. Đo thời gian HTTP ở client; latency trong payload là retrieval/SQLite phía server, hai phạm vi không thay thế nhau.

  API baseline không stream token, nên TTFT=null, generation=not_run. Không lấy số ký tự làm token hay suy giá tiền từ số từ. Với provider thật, lấy usage/tokenizer tương ứng, đơn giá có ngày hiệu lực và ghi unknown khi request lỗi không trả usage. Cost provider=0 trong lab không đồng nghĩa hạ tầng miễn phí.
concept_notes_en: |-
  Token counts measure usage, while stage timing locates delays. Distinguish time to first output from time to completion.

  A token is a tokenizer unit, not necessarily a word or character. First-output latency describes visible responsiveness; total latency describes when work finishes.

  Equal word counts may produce different token counts across languages and encodings. Self-check: does reducing input tokens guarantee an equivalent reduction in total latency? No: queueing, retrieval and generation also contribute. Measure stages with input and output lengths on comparable requests.

  Prerequisites: HTTP, tokens and percentiles. Three synthetic events validate arithmetic, not measured speed. Nearest-rank p95 selects ceil(0.95*n) from sorted observations; tiny samples are noisy. Report errors and timeouts alongside latency.

  The actual capstone generates X-Trace-Id and logs only route/status/elapsed_ms, not headers, questions or context. These correlated logs are not an OpenTelemetry SDK/exporter deployment. Multiple services require child spans and controlled context propagation.

  Run benchmark_capstone.py with twenty requests at concurrency one and two, saving reports. The tool restricts targets to loopback to avoid accidental production load. Client HTTP time and server retrieval/SQLite time cover different scopes.

  The baseline emits no token stream: TTFT is null and generation is not_run. Characters are not tokens. Real-provider accounting requires matching usage/tokenizer, dated prices and unknown usage when absent. Zero provider cost is not zero infrastructure cost.
why_it_matters_vi: Thu thập dữ liệu đủ để phân biệt lỗi mô hình, truy xuất, nhà cung cấp và hạ tầng.
why_it_matters_en: Without telemetry you cannot tell whether a failure is in the model, retrieval, provider,
  or infrastructure.
study_steps_vi:
- Tính metric trên fixture ba sự kiện.
- Chạy API và benchmark loopback.
- So thời gian client/server và trace ID.
- Đọc log để kiểm tra không lưu query hoặc credential.
study_steps_en:
- Calculate synthetic metrics.
- Run the loopback API/benchmark.
- Compare client/server timing and trace ID.
- Inspect logs for sensitive data.
practice_plan:
  vi:
    task: Chạy 20 request ở hai mức concurrency, lưu số mẫu, p50/p95, lỗi và đáp án đúng. Giữ null cho TTFT/token
      chưa đo.
    deliverables:
    - Hai report có workload và môi trường
    - Một trace ID nối response với log
    - Ghi chú metric thiếu và phạm vi đo
    checkpoint: Không bỏ timeout ra khỏi báo cáo; không gọi ba sự kiện giả là benchmark; không ghi query/credential
      vào log.
    stretch: Thêm span retrieval và database ở một nhánh riêng, kiểm tra exporter và sampling trước khi gọi
      là distributed trace.
  en:
    task: Run twenty requests at two concurrency levels. Save workload, p50/p95, errors and correctness; retain
      null for unmeasured TTFT/tokens.
    deliverables:
    - Two reports with workload/environment
    - One response-to-log trace ID
    - Missing metrics and timing scope
    checkpoint: Timeouts remain in reports; synthetic events are not a benchmark; queries/credentials are absent
      from logs.
    stretch: Add retrieval/database spans in a separate experiment and verify exporter/sampling before claiming
      distributed traces.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lượng token và độ trễ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain token usage and latency to a new teammate?
  - Which assumption behind token usage and latency could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- p95 = percentile(latencies, 95)
- throughput = completed_requests / elapsed_seconds
code_examples:
- title: Percentiles, failures and unknown token usage
  code: |
    import json
    import math

    def percentile(values, probability):
        if not values or not 0 < probability <= 1:
            raise ValueError("Need observations and a probability in (0, 1]")
        return sorted(values)[math.ceil(len(values) * probability) - 1]

    rows = [{"total_ms": 80, "ttft_ms": 20, "status": 200, "input_tokens": 32, "output_tokens": 8},
            {"total_ms": 120, "ttft_ms": 35, "status": 200, "input_tokens": 40, "output_tokens": 10},
            {"total_ms": 500, "ttft_ms": None, "status": 504, "input_tokens": None, "output_tokens": None}]
    latencies = [row["total_ms"] for row in rows]
    print(json.dumps({"synthetic": True, "requests": len(rows),
                      "p50_ms": percentile(latencies, .5), "p95_ms": percentile(latencies, .95),
                      "errors": sum(row["status"] >= 400 for row in rows),
                      "unknown_usage_requests": sum(row["input_tokens"] is None for row in rows)}))
  language: python
  status: runnable
  purpose_vi: Tính phần vị và giữ usage chưa biết; số liệu được gắn nhãn giả lập.
  purpose_en: Compute percentiles while preserving unknown usage; data is explicitly synthetic.
  setup: Python 3.11+; standard library only; paste into one Colab cell.
  expected_output: '{"synthetic": true, "requests": 3, "p50_ms": 120, "p95_ms": 500, "errors": 1, "unknown_usage_requests":
    1}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Tính phần vị và giữ usage chưa biết; số liệu được gắn nhãn giả lập.
  explanation_en: Compute percentiles while preserving unknown usage; data is explicitly synthetic.
  setup_en: Python 3.11+; standard library only; paste into one Colab cell.
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
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
- title: Hugging Face Tokenizers
  url: https://huggingface.co/docs/transformers/main/en/tokenizer_summary
  language: en
  purpose_vi: Đếm token thực tế để đánh giá dung lượng ngữ cảnh và chi phí.
  read_vi: Đọc về tokenizer, token đặc biệt, cắt bớt chuỗi và chèn phần đệm.
  purpose_en: Measure real tokens before reasoning about context and cost.
  read_en: Read tokenizers, special tokens, and truncation/padding.
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
- title: OpenTelemetry observability primer
  url: https://opentelemetry.io/docs/concepts/observability-primer/
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  purpose_en: Distinguish aggregate metrics, event logs and cross-step traces.
  read_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  read_en: Distinguish aggregate metrics, event logs and cross-step traces.
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
exercise_ids:
- exercise-18-genai-observability
review_item_ids:
- phase-18-genai-observability-genai-observability-2-recall
- phase-18-genai-observability-genai-observability-2-application
- phase-18-genai-observability-genai-observability-2-debug
- phase-18-genai-observability-genai-observability-2-interview
estimated_minutes: 65
completion_checklist:
- Ghi token và các mốc thời gian của một yêu cầu có streaming.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi token và các mốc thời gian của một yêu cầu có streaming.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng.
- Hai report có workload và môi trường
- Một trace ID nối response với log
- Ghi chú metric thiếu và phạm vi đo
- Không bỏ timeout ra khỏi báo cáo; không gọi ba sự kiện giả là benchmark; không ghi query/credential vào log.
common_mistakes:
- Ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Coi ký tự là token.
- Ghi unknown thành 0.
- Gọi một log có trace ID là tracing phân tán đã hoàn chỉnh.
next_lessons:
- phase-18-genai-observability-genai-observability-3
- phase-18-genai-observability-genai-observability-4
review_question_vi: Nội dung cốt lõi của “Lượng token và độ trễ” là gì?
review_question_en: Define token usage and latency in your own words. What are the input, transformation and
  output?
review_answer_vi: Đếm token cho biết mức sử dụng, còn thời gian từng bước giúp tìm phần chậm. Phân biệt thời
  gian tới phần trả lời đầu tiên với thời gian hoàn tất.
review_answer_en: A strong answer names the input, transformation, output and the context where token usage
  and latency is used. Relate it specifically to token usage and latency in lesson phase-18-genai-observability-genai-observability-2.
review_cards:
- id: phase-18-genai-observability-genai-observability-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lượng token và độ trễ” là gì?
  question_en: Define token usage and latency in your own words. What are the input, transformation and output?
  answer_vi: Đếm token cho biết mức sử dụng, còn thời gian từng bước giúp tìm phần chậm. Phân biệt thời gian
    tới phần trả lời đầu tiên với thời gian hoàn tất.
  answer_en: A strong answer names the input, transformation, output and the context where token usage and
    latency is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-18-genai-observability-genai-observability-2-application
  type: application
  question_vi: Ghi token và các mốc thời gian của một yêu cầu có streaming.
  question_en: Write a small code example or design that applies token usage and latency to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Ghi token và các mốc thời gian của một yêu cầu có streaming”, cần lưu: bản ghi
    yêu cầu có mã truy vết, thời gian và lượng tài nguyên. Lần theo các bước và xác định nơi độ trễ hoặc chi
    phí tăng.'
  answer_en: The token usage and latency example should have an explicit input, expected output and a way to
    run or verify it (phase-18-genai-observability-genai-observability-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-18-genai-observability-genai-observability-2-debug
  type: debug
  question_vi: Khi làm bài “Lượng token và độ trễ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If token usage and latency produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Lượng token và độ trễ”, lỗi cần tránh là: ghi prompt nhạy cảm chỉ để tiện tìm lỗi.
    Lần theo các bước và xác định nơi độ trễ hoặc chi phí tăng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For token usage and latency, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-18-genai-observability-genai-observability-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-18-genai-observability-genai-observability-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lượng token và độ trễ” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of token usage and latency?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi token và các mốc thời gian của một yêu cầu có streaming”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about token usage and latency should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-18-genai-observability-genai-observability-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Two reports with workload/environment
- One response-to-log trace ID
- Missing metrics and timing scope
- Timeouts remain in reports; synthetic events are not a benchmark; queries/credentials are absent from logs.
common_mistakes_en:
- Counting characters as tokens.
- Converting unknown usage to zero.
- Calling correlated logs complete distributed tracing.
---
# Lượng token và độ trễ / Token usage and latency

Đếm token cho biết mức sử dụng, còn thời gian từng bước giúp tìm phần chậm. Phân biệt thời gian tới phần trả lời đầu tiên với thời gian hoàn tất.

Token là đơn vị tokenizer xử lý, không đồng nhất với từ hay ký tự. Độ trễ đầu tiên phản ánh lúc người dùng thấy phản hồi; độ trễ toàn bộ phản ánh lúc công việc thật sự kết thúc.

Ví dụ, hai câu trả lời cùng số từ có thể dùng số token khác nhau do ngôn ngữ và cách mã hóa. Tự kiểm tra: giảm số token đầu vào có chắc giảm thời gian toàn hệ thống tương ứng không? Không; còn thời gian hàng đợi, truy xuất và tốc độ sinh. Đo từng bước cùng độ dài đầu vào, đầu ra trên cùng loại yêu cầu.

## Thực hành

Ghi token và các mốc thời gian của một yêu cầu có streaming.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Theo dõi một yêu cầu từ đầu tới cuối với mã truy vết, token, chi phí, độ trễ p50/p95 và cảnh báo ngân sách.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: hiểu request/response, token và phần vị. Ví dụ dưới dùng ba sự kiện giả để kiểm tra cách tính, không phải thời gian đo. p95 theo nearest-rank lấy phần tử ceil(0.95*n) trong dãy sắp xếp; ít mẫu thì phần đuôi rất nhiễu. Tính error rate cùng latency, không loại timeout chỉ để p95 đẹp.

Trong capstone thật, server tạo trace ID mới, trả X-Trace-Id và log route/status/elapsed_ms. Không log header, câu hỏi, context hay token bí mật. Đây là log có mã liên kết, chưa phải distributed tracing bằng OpenTelemetry SDK/exporter; nếu thêm retriever/model service, cần span con và propagate context có kiểm soát.

Chạy benchmark_capstone.py --requests 20 --concurrency 1 --output evidence/load-c1.json, rồi concurrency 2. Tool chỉ nhận loopback để tránh vô ý tạo tải lên web thật. Đo thời gian HTTP ở client; latency trong payload là retrieval/SQLite phía server, hai phạm vi không thay thế nhau.

API baseline không stream token, nên TTFT=null, generation=not_run. Không lấy số ký tự làm token hay suy giá tiền từ số từ. Với provider thật, lấy usage/tokenizer tương ứng, đơn giá có ngày hiệu lực và ghi unknown khi request lỗi không trả usage. Cost provider=0 trong lab không đồng nghĩa hạ tầng miễn phí.

Chạy 20 request ở hai mức concurrency, lưu số mẫu, p50/p95, lỗi và đáp án đúng. Giữ null cho TTFT/token chưa đo.

Không bỏ timeout ra khỏi báo cáo; không gọi ba sự kiện giả là benchmark; không ghi query/credential vào log.

### English

Prerequisites: HTTP, tokens and percentiles. Three synthetic events validate arithmetic, not measured speed. Nearest-rank p95 selects ceil(0.95*n) from sorted observations; tiny samples are noisy. Report errors and timeouts alongside latency.

The actual capstone generates X-Trace-Id and logs only route/status/elapsed_ms, not headers, questions or context. These correlated logs are not an OpenTelemetry SDK/exporter deployment. Multiple services require child spans and controlled context propagation.

Run benchmark_capstone.py with twenty requests at concurrency one and two, saving reports. The tool restricts targets to loopback to avoid accidental production load. Client HTTP time and server retrieval/SQLite time cover different scopes.

The baseline emits no token stream: TTFT is null and generation is not_run. Characters are not tokens. Real-provider accounting requires matching usage/tokenizer, dated prices and unknown usage when absent. Zero provider cost is not zero infrastructure cost.

Run twenty requests at two concurrency levels. Save workload, p50/p95, errors and correctness; retain null for unmeasured TTFT/tokens.

Timeouts remain in reports; synthetic events are not a benchmark; queries/credentials are absent from logs.
