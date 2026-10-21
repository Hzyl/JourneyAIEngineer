---
lesson_id: phase-19-genai-production-genai-production-4
phase_id: phase-19-genai-production
module_id: genai-production
title_vi: Tính sẵn sàng và năng lực phục vụ
title_en: High availability and capacity
summary_vi: Tính sẵn sàng cần xét các điểm phụ thuộc và cách suy giảm khi lỗi.
summary_en: Learn High availability and capacity through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời.
- Kiểm tra giới hạn thử lại, cách chuyển dự phòng và ảnh hưởng tới người dùng.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Đánh giá capacity và phục hồi trên workload cụ thể, không nhầm với high availability.
learning_objectives_en:
- Explain high availability and capacity with a concrete example.
- Write or adapt a small code example applying high availability and capacity.
- Recognize its assumptions, limits and one common failure mode.
- Assess bounded workload capacity and recovery without claiming high availability.
prerequisites:
- phase-19-genai-production-genai-production-3
- phase-18-genai-observability-genai-observability-1
key_terms:
- high
- availability
- capacity
- inference
- observability
- reproducibility
- deployment
- genai-production
concept_notes_vi: |-
  Tính sẵn sàng cần xét các điểm phụ thuộc và cách suy giảm khi lỗi. Năng lực phục vụ phải được đo với tải phù hợp, gồm cả yêu cầu chậm và giới hạn nhà cung cấp.

  Capacity là lượng tải hệ thống xử lý được trong các ràng buộc; availability là khả năng cung cấp dịch vụ theo tiêu chí đã định. Thêm bản sao ứng dụng chưa giải quyết điểm lỗi chung như một cơ sở dữ liệu hoặc hạn mức nhà cung cấp.

  Ví dụ, khi mô hình quá tải, hệ thống có thể trả kết quả tìm kiếm nguồn với thông báo rõ thay vì treo mọi yêu cầu. Tự kiểm tra: thử một yêu cầu nhanh có chứng minh phục vụ tốt nhiều người không? Không; cần tải đại diện, quan sát hàng đợi, lỗi và độ trễ ở nhóm chậm, đồng thời thử tình huống phụ thuộc bị ngắt.

  Chuẩn bị: đã đo p50/p95, hiểu health/ready và có capstone HTTP. Trước thử tải, tự đặt ngân sách cho tác vụ: ví dụ p95 dưới 100 ms chỉ cho fixture loopback là mục tiêu bài tập, không phải SLA chung cho chatbot. Nêu request count, concurrency, timeout và tỷ lệ đúng; HTTP 200 sai câu trả lời vẫn là lỗi sản phẩm.

  Benchmark capstone giới hạn 1–200 request và concurrency 1/2/4. Chạy 20 request trước, đọc correctness gate rồi mới tăng. Kết quả là phép đo có giới hạn trên máy đang dùng; không ngoại suy thành số người dùng đồng thời của web, GPU throughput hay uptime theo tháng.

  Kiểm tra phục hồi: ghi counter, dừng/start lại dịch vụ trên cùng state, chờ /ready, đọc counter và gửi query mới. /health chỉ xác nhận process trả lời; /ready kiểm tra state database và corpus. Một process cùng SQLite volume là single point of failure; restart thành công chưa chứng minh high availability.

  Nếu thêm model server, giới hạn tổng request deadline, context/output tokens, hàng đợi và số retry; khi model lỗi có thể trả nguồn tìm được với nhãn không có generation. Không tự retry hành động ghi. Chưa cần vLLM/GPU cho corpus này; nếu chọn self-host, ghim bản phát hành ổn định, model revision, driver/CUDA và budget, không sao chép tài liệu latest developer preview như lab đã chạy.

  Trước công khai dịch vụ phải thay public demo keys bằng authentication/authorization phía server, thêm TLS/reverse proxy, rate/body limits, secret storage, dependency/image scan và backup/restore. Compose lab chỉ bind loopback và dữ liệu giả; không phải cấu hình deploy production của Journey.
concept_notes_en: |-
  Availability depends on shared dependencies and graceful behavior during faults. Capacity must be measured under representative load, including slow requests and provider limits.

  Capacity describes supported load within constraints; availability describes service delivery under defined criteria. More application replicas do not remove a shared database failure or provider quota.

  An overloaded model might degrade to clearly labeled source search instead of hanging all requests. Self-check: does one fast request prove multi-user readiness? No: test representative load, queues, errors and slow-tail latency, plus dependency outages.

  Prerequisites: latency metrics, health/readiness and a working capstone HTTP service. Define a workload-specific budget first: p95 under 100 ms is an illustrative loopback exercise target, not a universal chatbot SLA. HTTP 200 with a wrong answer still fails product correctness.

  The bounded probe permits 1–200 requests and concurrency 1/2/4. Start with twenty at one, check correctness, then increase. Results describe that machine/workload, not public-web user capacity, GPU throughput or monthly uptime.

  Recovery check: save counter, restart on the same state, await /ready, read counter and query again. /health reports process liveness; /ready checks state and corpus. One process and one SQLite volume remain failure points. Restart success is not high availability.

  A later model service needs request deadlines, context/output limits, bounded queues/retries and clearly labeled retrieval-only fallback. Never blindly retry writes. This corpus does not require vLLM/GPU. Optional self-hosting must pin a stable release, model revision, driver/CUDA and budget, not copy latest developer-preview docs as a verified lab.

  Public deployment requires real server-side authentication/authorization, TLS/proxy, rate/body limits, managed secrets, dependency/image scanning and tested backup/restore. Public demo keys and loopback Compose are a synthetic lab, not Journey production deployment configuration.
why_it_matters_vi: Thiết kế hành vi khi nhà cung cấp chậm, lỗi hoặc tải tăng để duy trì mức phục vụ đã đặt
  ra.
why_it_matters_en: Production quality is behavior when providers are slow, failing, expensive, or traffic grows—not
  just the happy path.
study_steps_vi:
- Ghi ngân sách và workload trước khi chạy.
- Kiểm tra correctness ở concurrency 1.
- Tăng lên 2 rồi so latency/error/throughput.
- Restart và kiểm tra state, ghi giới hạn và kế hoạch rollback.
study_steps_en:
- Define budget/workload.
- Check correctness at concurrency one.
- Compare concurrency two.
- Restart, verify state and document rollback limits.
practice_plan:
  vi:
    task: Chạy hai workload nhỏ, thử restart giữ counter và ghi một rủi ro single point of failure. Dùng fixture
      dưới để thấy HTTP nhanh không đủ nếu đáp án sai.
    deliverables:
    - Workload, budget và report hai lần chạy
    - Counter trước/sau restart và readiness
    - Rủi ro, điều kiện rollback và việc cần làm trước public
    checkpoint: Đáp án sai làm fail dù HTTP 200; chỉ kết luận cho tải đã đo. Docker/model chưa chạy phải ghi
      riêng NOT RUN.
    stretch: Thêm lỗi dependency có kiểm soát trong bản sao lab và đo khả năng degraded response, không tạo
      tải lên production.
  en:
    task: Run two small workloads, verify persisted counter after restart and identify a shared failure point.
      Use the fixture to see why low latency alone is insufficient.
    deliverables:
    - Workload, budget and two reports
    - Counter before/after restart and readiness
    - Failure risks, rollback criteria and public-deployment prerequisites
    checkpoint: Wrong answers fail even with HTTP 200; conclusions cover measured load only. Unrun Docker/model
      checks are separate NOT RUN items.
    stretch: Inject a controlled dependency failure in a lab copy and measure degraded response, never production
      load.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tính sẵn sàng và năng lực phục vụ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain high availability and capacity to a new teammate?
  - Which assumption behind high availability and capacity could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- title: Correctness before a latency budget
  code: |
    import json

    def assess(report, budget_ms):
        if report["errors"] or report["correct"] != report["requests"]:
            return "fix_correctness_first"
        if report["p95_ms"] > budget_ms:
            return "exceeds_lab_latency_budget"
        return "passes_this_workload_only"

    fixture = {"requests": 20, "correct": 20, "errors": 0, "p95_ms": 80}
    failed = dict(fixture, correct=19)
    print(json.dumps({"healthy_fixture": assess(fixture, 100), "wrong_answer": assess(failed, 100)}))
  language: python
  status: runnable
  purpose_vi: Fixture minh họa cổng nghiệm thu; thời gian 80 ms là dữ liệu giả, không phải benchmark.
  purpose_en: A synthetic acceptance gate; 80 ms is fixture data, not a benchmark.
  setup: Python 3.11+; standard library only; paste into one Colab cell.
  expected_output: '{"healthy_fixture": "passes_this_workload_only", "wrong_answer": "fix_correctness_first"}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Fixture minh họa cổng nghiệm thu; thời gian 80 ms là dữ liệu giả, không phải benchmark.
  explanation_en: A synthetic acceptance gate; 80 ms is fixture data, not a benchmark.
  setup_en: Python 3.11+; standard library only; paste into one Colab cell.
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
resources:
- language: en
  title: Redis Documentation
  url: https://redis.io/docs/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Celery Documentation
  url: https://docs.celeryq.dev/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Kubernetes Basics
  url: https://kubernetes.io/docs/tutorials/kubernetes-basics/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
  language: en
  purpose_vi: Tự động kiểm tra chất lượng trước khi tích hợp hoặc chia sẻ mã nguồn.
  read_vi: Đọc về quy trình tự động, máy chạy tác vụ, quản lý bí mật và tệp kết quả của lần chạy.
  purpose_en: Automate quality gates before merging or publishing artifacts.
  read_en: Read workflows, runners, secrets, and artifacts.
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
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
- title: FastAPI in containers
  url: https://fastapi.tiangolo.com/deployment/docker/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc thứ tự COPY để tận dụng cache và cách chạy Uvicorn trong container.
  purpose_en: Read COPY ordering for caching and Uvicorn container deployment.
  read_vi: Đọc thứ tự COPY để tận dụng cache và cách chạy Uvicorn trong container.
  read_en: Read COPY ordering for caching and Uvicorn container deployment.
- title: 'Docker Compose: control startup order'
  url: https://docs.docker.com/compose/how-tos/startup-order/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc service_healthy và phân biệt khởi động với sẵn sàng nhận yêu cầu.
  purpose_en: Read service_healthy and distinguish a started process from a ready dependency.
  read_vi: Đọc service_healthy và phân biệt khởi động với sẵn sàng nhận yêu cầu.
  read_en: Read service_healthy and distinguish a started process from a ready dependency.
- title: OpenTelemetry observability primer
  url: https://opentelemetry.io/docs/concepts/observability-primer/
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  purpose_en: Distinguish aggregate metrics, event logs and cross-step traces.
  read_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  read_en: Distinguish aggregate metrics, event logs and cross-step traces.
exercise_ids:
- exercise-19-genai-production
review_item_ids:
- phase-19-genai-production-genai-production-4-recall
- phase-19-genai-production-genai-production-4-application
- phase-19-genai-production-genai-production-4-debug
- phase-19-genai-production-genai-production-4-interview
estimated_minutes: 80
completion_checklist:
- Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời.
- Kiểm tra giới hạn thử lại, cách chuyển dự phòng và ảnh hưởng tới người dùng.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Kiểm tra giới hạn thử lại, cách chuyển dự phòng và ảnh hưởng tới người dùng.
- Workload, budget và report hai lần chạy
- Counter trước/sau restart và readiness
- Rủi ro, điều kiện rollback và việc cần làm trước public
- Đáp án sai làm fail dù HTTP 200; chỉ kết luận cho tải đã đo. Docker/model chưa chạy phải ghi riêng NOT RUN.
common_mistakes:
- Dùng bộ nhớ đệm chung mà không xét quyền và ngữ cảnh của người dùng.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Coi restart là HA.
- Suy capacity production từ 20 request loopback.
- Retry vô hạn hoặc tự gửi lại hành động ghi.
next_lessons:
- phase-20-genai-finetuning-fine-tuning-1
- phase-20-genai-finetuning-fine-tuning-2
review_question_vi: Nội dung cốt lõi của “Tính sẵn sàng và năng lực phục vụ” là gì?
review_question_en: Define high availability and capacity in your own words. What are the input, transformation
  and output?
review_answer_vi: Tính sẵn sàng cần xét các điểm phụ thuộc và cách suy giảm khi lỗi. Năng lực phục vụ phải
  được đo với tải phù hợp, gồm cả yêu cầu chậm và giới hạn nhà cung cấp.
review_answer_en: A strong answer names the input, transformation, output and the context where high availability
  and capacity is used. Relate it specifically to high availability and capacity in lesson phase-19-genai-production-genai-production-4.
review_cards:
- id: phase-19-genai-production-genai-production-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tính sẵn sàng và năng lực phục vụ” là gì?
  question_en: Define high availability and capacity in your own words. What are the input, transformation
    and output?
  answer_vi: Tính sẵn sàng cần xét các điểm phụ thuộc và cách suy giảm khi lỗi. Năng lực phục vụ phải được
    đo với tải phù hợp, gồm cả yêu cầu chậm và giới hạn nhà cung cấp.
  answer_en: A strong answer names the input, transformation, output and the context where high availability
    and capacity is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-19-genai-production-genai-production-4-application
  type: application
  question_vi: Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời.
  question_en: Write a small code example or design that applies high availability and capacity to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời”, cần lưu: cấu hình
    dịch vụ và kết quả thử tình huống chậm, lỗi hoặc quá tải. Kiểm tra giới hạn thử lại, cách chuyển dự phòng
    và ảnh hưởng tới người dùng.'
  answer_en: The high availability and capacity example should have an explicit input, expected output and
    a way to run or verify it (phase-19-genai-production-genai-production-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-19-genai-production-genai-production-4-debug
  type: debug
  question_vi: Khi làm bài “Tính sẵn sàng và năng lực phục vụ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If high availability and capacity produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Tính sẵn sàng và năng lực phục vụ”, lỗi cần tránh là: dùng bộ nhớ đệm chung mà không
    xét quyền và ngữ cảnh của người dùng. Kiểm tra giới hạn thử lại, cách chuyển dự phòng và ảnh hưởng tới
    người dùng. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For high availability and capacity, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-19-genai-production-genai-production-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-19-genai-production-genai-production-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tính sẵn sàng và năng lực phục vụ” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of high availability and
    capacity?
  answer_vi: Bắt đầu từ nhiệm vụ “Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định
    nghĩa.
  answer_en: The answer about high availability and capacity should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-19-genai-production-genai-production-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Workload, budget and two reports
- Counter before/after restart and readiness
- Failure risks, rollback criteria and public-deployment prerequisites
- Wrong answers fail even with HTTP 200; conclusions cover measured load only. Unrun Docker/model checks are
  separate NOT RUN items.
common_mistakes_en:
- Equating restart with HA.
- Extrapolating twenty loopback requests to production.
- Unbounded retries or automatic write retries.
---
# Tính sẵn sàng và năng lực phục vụ / High availability and capacity

Tính sẵn sàng cần xét các điểm phụ thuộc và cách suy giảm khi lỗi. Năng lực phục vụ phải được đo với tải phù hợp, gồm cả yêu cầu chậm và giới hạn nhà cung cấp.

Capacity là lượng tải hệ thống xử lý được trong các ràng buộc; availability là khả năng cung cấp dịch vụ theo tiêu chí đã định. Thêm bản sao ứng dụng chưa giải quyết điểm lỗi chung như một cơ sở dữ liệu hoặc hạn mức nhà cung cấp.

Ví dụ, khi mô hình quá tải, hệ thống có thể trả kết quả tìm kiếm nguồn với thông báo rõ thay vì treo mọi yêu cầu. Tự kiểm tra: thử một yêu cầu nhanh có chứng minh phục vụ tốt nhiều người không? Không; cần tải đại diện, quan sát hàng đợi, lỗi và độ trễ ở nhóm chậm, đồng thời thử tình huống phụ thuộc bị ngắt.

## Thực hành

Xác định điểm nghẽn và đo độ trễ khi tăng số yêu cầu đồng thời.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Thiết kế bộ nhớ đệm, phương án dự phòng, hàng đợi và tiến trình xử lý; chạy phép thử tải với SLO rõ.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: đã đo p50/p95, hiểu health/ready và có capstone HTTP. Trước thử tải, tự đặt ngân sách cho tác vụ: ví dụ p95 dưới 100 ms chỉ cho fixture loopback là mục tiêu bài tập, không phải SLA chung cho chatbot. Nêu request count, concurrency, timeout và tỷ lệ đúng; HTTP 200 sai câu trả lời vẫn là lỗi sản phẩm.

Benchmark capstone giới hạn 1–200 request và concurrency 1/2/4. Chạy 20 request trước, đọc correctness gate rồi mới tăng. Kết quả là phép đo có giới hạn trên máy đang dùng; không ngoại suy thành số người dùng đồng thời của web, GPU throughput hay uptime theo tháng.

Kiểm tra phục hồi: ghi counter, dừng/start lại dịch vụ trên cùng state, chờ /ready, đọc counter và gửi query mới. /health chỉ xác nhận process trả lời; /ready kiểm tra state database và corpus. Một process cùng SQLite volume là single point of failure; restart thành công chưa chứng minh high availability.

Nếu thêm model server, giới hạn tổng request deadline, context/output tokens, hàng đợi và số retry; khi model lỗi có thể trả nguồn tìm được với nhãn không có generation. Không tự retry hành động ghi. Chưa cần vLLM/GPU cho corpus này; nếu chọn self-host, ghim bản phát hành ổn định, model revision, driver/CUDA và budget, không sao chép tài liệu latest developer preview như lab đã chạy.

Trước công khai dịch vụ phải thay public demo keys bằng authentication/authorization phía server, thêm TLS/reverse proxy, rate/body limits, secret storage, dependency/image scan và backup/restore. Compose lab chỉ bind loopback và dữ liệu giả; không phải cấu hình deploy production của Journey.

Chạy hai workload nhỏ, thử restart giữ counter và ghi một rủi ro single point of failure. Dùng fixture dưới để thấy HTTP nhanh không đủ nếu đáp án sai.

Đáp án sai làm fail dù HTTP 200; chỉ kết luận cho tải đã đo. Docker/model chưa chạy phải ghi riêng NOT RUN.

### English

Prerequisites: latency metrics, health/readiness and a working capstone HTTP service. Define a workload-specific budget first: p95 under 100 ms is an illustrative loopback exercise target, not a universal chatbot SLA. HTTP 200 with a wrong answer still fails product correctness.

The bounded probe permits 1–200 requests and concurrency 1/2/4. Start with twenty at one, check correctness, then increase. Results describe that machine/workload, not public-web user capacity, GPU throughput or monthly uptime.

Recovery check: save counter, restart on the same state, await /ready, read counter and query again. /health reports process liveness; /ready checks state and corpus. One process and one SQLite volume remain failure points. Restart success is not high availability.

A later model service needs request deadlines, context/output limits, bounded queues/retries and clearly labeled retrieval-only fallback. Never blindly retry writes. This corpus does not require vLLM/GPU. Optional self-hosting must pin a stable release, model revision, driver/CUDA and budget, not copy latest developer-preview docs as a verified lab.

Public deployment requires real server-side authentication/authorization, TLS/proxy, rate/body limits, managed secrets, dependency/image scanning and tested backup/restore. Public demo keys and loopback Compose are a synthetic lab, not Journey production deployment configuration.

Run two small workloads, verify persisted counter after restart and identify a shared failure point. Use the fixture to see why low latency alone is insufficient.

Wrong answers fail even with HTTP 200; conclusions cover measured load only. Unrun Docker/model checks are separate NOT RUN items.
