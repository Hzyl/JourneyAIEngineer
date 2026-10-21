---
lesson_id: phase-05-mlops-containers-2
phase_id: phase-05-mlops
module_id: containers
title_vi: Cơ bản về Docker Compose
title_en: Docker Compose basics
summary_vi: Docker Compose mô tả nhiều dịch vụ, mạng và vùng lưu trữ trong cùng cấu hình.
summary_en: Learn Docker Compose basics through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Dùng service DNS, healthcheck và volume để kiểm chứng đường đi và độ bền dữ liệu.
learning_objectives_en:
- Explain docker compose basics with a concrete example.
- Write or adapt a small code example applying docker compose basics.
- Recognize its assumptions, limits and one common failure mode.
- Verify service DNS, dependency health and durable state using Compose.
prerequisites:
- phase-05-mlops-containers-1
- phase-04-deep-learning-pytorch-core-1
key_terms:
- docker
- compose
- basics
- inference
- observability
- reproducibility
- deployment
- containers
concept_notes_vi: |-
  Docker Compose mô tả nhiều dịch vụ, mạng và vùng lưu trữ trong cùng cấu hình. Thứ tự khởi động không bảo đảm dịch vụ đã sẵn sàng; ứng dụng cần kiểm tra kết nối và xử lý chờ.

  Phân biệt phụ thuộc khởi động với sẵn sàng phục vụ. Tiến trình cơ sở dữ liệu có thể đã chạy nhưng còn khôi phục dữ liệu; healthcheck mô tả điều kiện sẵn sàng cụ thể, còn ứng dụng cần xử lý mất kết nối sau đó.

  Ví dụ, dịch vụ api kết nối tới tên dịch vụ db trên mạng Compose. localhost bên trong api chỉ chính container đó, không phải container cơ sở dữ liệu hay máy Windows chủ.

  Tự kiểm tra: depends_on thông thường đã đủ tránh lỗi kết nối chưa? Chưa; dùng điều kiện service_healthy khi phù hợp và thử khởi động chậm. Volume giữ dữ liệu, còn mạng giúp các dịch vụ tìm nhau: hai vai trò này khác nhau.

  Chuẩn bị: hoàn thành bài image và HTTP probe trước. Compose mô tả dịch vụ, mạng, volume và điều kiện phụ thuộc. Ở lab này api là dịch vụ chính, probe là client kiểm tra trong cùng mạng; không dựng Redis/Postgres nếu tác vụ chưa cần.

  Trong container probe, localhost là chính probe. Dùng http://api:8080/ready qua tên service; trên máy bạn dùng http://127.0.0.1:8091. depends_on với service_healthy chỉ chặn khởi động client cho tới khi healthcheck đạt, không tự bảo đảm hệ thống phục hồi sau mọi lỗi.

  Chạy docker compose -f compose.capstone.yaml --profile verify run --rm probe. Sau đó chạy ví dụ counter, ghi completed_queries, dùng docker compose -f compose.capstone.yaml restart api, chờ /ready rồi đọc /stats. Số đếm phải giữ nguyên qua restart. Named volume lab-state lưu SQLite counter, không lưu câu hỏi hay dữ liệu học.

  Để dừng lab dùng docker compose -f compose.capstone.yaml down, không thêm -v. Volume vẫn tồn tại; backup/restore là việc riêng và cần được thử. read_only, cap_drop và no-new-privileges giảm quyền container, không thay thế xác thực, TLS, giới hạn request hoặc kiểm tra lỗ hổng.
concept_notes_en: |-
  Docker Compose describes services, networks and volumes together. Startup ordering alone does not guarantee readiness; applications must handle connection delays.

  A database process may be running while still recovering data. A healthcheck states a readiness condition, while the application must also cope with connections lost later.

  For example, the api service connects to the service name db on a Compose network. Inside api, localhost refers to that container, not the database container or Windows host.

  Self-check: is plain depends_on enough to prevent connection failures? No: use service_healthy where appropriate and test slow startup. Volumes preserve data; networks connect services. These solve different problems.

  Prerequisite: the image lesson and HTTP probe. Compose declares services, networking, volumes and dependencies. api is the service and probe is a client on its network; no Redis/Postgres is added without a need.

  localhost inside probe means probe itself. Use http://api:8080/ready there and http://127.0.0.1:8091 from the host. service_healthy gates startup, not every later recovery scenario.

  Run docker compose -f compose.capstone.yaml --profile verify run --rm probe. Run the counter example, record completed_queries, restart api, wait for /ready and read /stats. The count survives restart through named volume lab-state. Only synthetic aggregate counters are stored, never question text or learner data.

  Stop with docker compose -f compose.capstone.yaml down without -v. Volumes persist; backup/restore remains a separate tested procedure. Read-only root, dropped capabilities and no-new-privileges do not replace authentication, TLS, request limits or vulnerability checks.
why_it_matters_vi: Đóng gói môi trường để người khác chạy được cùng dịch vụ và kiểm tra tự động.
why_it_matters_en: Package the environment with Docker and CI so another engineer can run the same service
  from a clone.
study_steps_vi:
- Đọc ports, depends_on, healthcheck và volumes.
- Chạy api rồi probe bằng profile verify.
- Gửi một truy vấn và ghi counter.
- Restart api, chờ ready và đối chiếu counter; dừng không xóa volume.
study_steps_en:
- Read ports, dependencies, health and volumes.
- Start api and the verify probe.
- Send one query and record the counter.
- Restart, await readiness and compare; stop without deleting volumes.
practice_plan:
  vi:
    task: Chứng minh client trong container dùng api:8080, còn client trên host dùng 127.0.0.1:8091. Ghi số
      đếm trước và sau restart.
    deliverables:
    - Output probe nội bộ và client host
    - 'Ba giá trị counter: trước query, sau query, sau restart'
    checkpoint: Một query hợp lệ tăng đúng 1; restart giữ số đếm. Không ghi nội dung câu hỏi vào SQLite.
    stretch: Làm dependency chưa ready trong bản sao lab; giải thích sự khác nhau giữa timeout, liveness và
      readiness.
  en:
    task: Demonstrate api:8080 from the container network and 127.0.0.1:8091 from the host; compare counters
      across restart.
    deliverables:
    - Internal and host probe outputs
    - Counter before query, after query and after restart
    checkpoint: One valid query increments once; restart preserves the count. SQLite contains no question text.
    stretch: Delay readiness in a lab copy and distinguish timeout, liveness and readiness.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Cơ bản về Docker Compose” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain docker compose basics to a new teammate?
  - Which assumption behind docker compose basics could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- title: Verify a real query and persisted counter
  code: |
    import json
    from urllib.request import Request, urlopen

    headers = {"X-Lab-Key": "demo-A-public", "Content-Type": "application/json"}
    def call(path, data=None):
        request = Request("http://127.0.0.1:8091" + path, data=data, headers=headers)
        with urlopen(request, timeout=3) as response:
            return json.load(response)
    before = call("/stats")["completed_queries"]
    body = json.dumps({"question": "Thư viện mở cửa lúc mấy giờ?"}).encode()
    answer = call("/query", body)
    after = call("/stats")["completed_queries"]
    assert answer["action"] == "answer" and "08:00" in answer["answer"]
    assert after == before + 1
    print(json.dumps({"counter_increased": True, "has_citation": bool(answer["citations"])}))
  language: python
  status: runnable
  purpose_vi: Kiểm tra câu trả lời, trích dẫn và counter; chạy riêng bước restart để kiểm tra persistence.
  purpose_en: Check answer, citations and counter; perform the separate restart step to test persistence.
  setup: Download repository ZIP; start the synthetic API using the native or Docker commands shown in this
    lesson/CAPSTONE.md. Run this Python cell in a second local terminal (not remote Colab). No credentials
    needed; demo keys are public fixtures.
  expected_output: '{"counter_increased": true, "has_citation": true}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Kiểm tra câu trả lời, trích dẫn và counter; chạy riêng bước restart để kiểm tra persistence.
  explanation_en: Check answer, citations and counter; perform the separate restart step to test persistence.
  setup_en: Download repository ZIP; start the synthetic API using the native or Docker commands shown in this
    lesson/CAPSTONE.md. Run this Python cell in a second local terminal (not remote Colab). No credentials
    needed; demo keys are public fixtures.
  setup_vi: Tải ZIP repo; mở samples/vi-document-assistant và chạy API bằng lệnh trong bài hoặc CAPSTONE.md.
    Chạy ví dụ ở terminal Python thứ hai trên cùng máy; Colab ở xa không gọi được localhost của bạn. Chỉ dùng
    dữ liệu và khóa demo công khai.
resources:
- language: en
  title: FastAPI Documentation
  url: https://fastapi.tiangolo.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Docker Get Started
  url: https://docs.docker.com/get-started/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MLflow Documentation
  url: https://mlflow.org/docs/latest/ml/tracking/
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
- title: 'Docker Compose: control startup order'
  url: https://docs.docker.com/compose/how-tos/startup-order/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc service_healthy và phân biệt khởi động với sẵn sàng nhận yêu cầu.
  purpose_en: Read service_healthy and distinguish a started process from a ready dependency.
  read_vi: Đọc service_healthy và phân biệt khởi động với sẵn sàng nhận yêu cầu.
  read_en: Read service_healthy and distinguish a started process from a ready dependency.
- title: Docker volumes
  url: https://docs.docker.com/engine/storage/volumes/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc vòng đời volume, đối chiếu với lớp ghi của container.
  purpose_en: Compare volume lifecycle with a container writable layer.
  read_vi: Đọc vòng đời volume, đối chiếu với lớp ghi của container.
  read_en: Compare volume lifecycle with a container writable layer.
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
- exercise-5-containers
review_item_ids:
- phase-05-mlops-containers-2-recall
- phase-05-mlops-containers-2-application
- phase-05-mlops-containers-2-debug
- phase-05-mlops-containers-2-interview
estimated_minutes: 75
completion_checklist:
- Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Output probe nội bộ và client host
- 'Ba giá trị counter: trước query, sau query, sau restart'
- Một query hợp lệ tăng đúng 1; restart giữ số đếm. Không ghi nội dung câu hỏi vào SQLite.
common_mistakes:
- Cho rằng chạy được trên máy phát triển đã đủ chứng minh môi trường tái lập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Dùng localhost để gọi container khác.
- Xóa volume rồi kết luận persistence hỏng.
- Nhầm startup ordering với high availability.
next_lessons:
- phase-05-mlops-containers-3
- phase-05-mlops-containers-4
review_question_vi: Nội dung cốt lõi của “Cơ bản về Docker Compose” là gì?
review_question_en: Define docker compose basics in your own words. What are the input, transformation and
  output?
review_answer_vi: Docker Compose mô tả nhiều dịch vụ, mạng và vùng lưu trữ trong cùng cấu hình. Thứ tự khởi
  động không bảo đảm dịch vụ đã sẵn sàng; ứng dụng cần kiểm tra kết nối và xử lý chờ.
review_answer_en: A strong answer names the input, transformation, output and the context where docker compose
  basics is used. Relate it specifically to docker compose basics in lesson phase-05-mlops-containers-2.
review_cards:
- id: phase-05-mlops-containers-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Cơ bản về Docker Compose” là gì?
  question_en: Define docker compose basics in your own words. What are the input, transformation and output?
  answer_vi: Docker Compose mô tả nhiều dịch vụ, mạng và vùng lưu trữ trong cùng cấu hình. Thứ tự khởi động
    không bảo đảm dịch vụ đã sẵn sàng; ứng dụng cần kiểm tra kết nối và xử lý chờ.
  answer_en: A strong answer names the input, transformation, output and the context where docker compose basics
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-containers-2-application
  type: application
  question_vi: Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối.
  question_en: Write a small code example or design that applies docker compose basics to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối”, cần lưu: cấu hình
    chạy cùng kết quả kiểm tra dịch vụ. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.'
  answer_en: The docker compose basics example should have an explicit input, expected output and a way to
    run or verify it (phase-05-mlops-containers-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-containers-2-debug
  type: debug
  question_vi: Khi làm bài “Cơ bản về Docker Compose”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If docker compose basics produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Cơ bản về Docker Compose”, lỗi cần tránh là: cho rằng chạy được trên máy phát triển
    đã đủ chứng minh môi trường tái lập. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For docker compose basics, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-05-mlops-containers-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-containers-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Cơ bản về Docker Compose” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of docker compose basics?
  answer_vi: Bắt đầu từ nhiệm vụ “Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định
    nghĩa.
  answer_en: The answer about docker compose basics should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-05-mlops-containers-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Internal and host probe outputs
- Counter before query, after query and after restart
- One valid query increments once; restart preserves the count. SQLite contains no question text.
common_mistakes_en:
- Calling another container through localhost.
- Deleting the volume before testing persistence.
- Equating startup ordering with availability.
---
# Cơ bản về Docker Compose / Docker Compose basics

Docker Compose mô tả nhiều dịch vụ, mạng và vùng lưu trữ trong cùng cấu hình. Thứ tự khởi động không bảo đảm dịch vụ đã sẵn sàng; ứng dụng cần kiểm tra kết nối và xử lý chờ.

Phân biệt phụ thuộc khởi động với sẵn sàng phục vụ. Tiến trình cơ sở dữ liệu có thể đã chạy nhưng còn khôi phục dữ liệu; healthcheck mô tả điều kiện sẵn sàng cụ thể, còn ứng dụng cần xử lý mất kết nối sau đó.

Ví dụ, dịch vụ api kết nối tới tên dịch vụ db trên mạng Compose. localhost bên trong api chỉ chính container đó, không phải container cơ sở dữ liệu hay máy Windows chủ.

Tự kiểm tra: depends_on thông thường đã đủ tránh lỗi kết nối chưa? Chưa; dùng điều kiện service_healthy khi phù hợp và thử khởi động chậm. Volume giữ dữ liệu, còn mạng giúp các dịch vụ tìm nhau: hai vai trò này khác nhau.

## Thực hành

Chạy hai dịch vụ bằng Compose và kiểm tra cách chúng kết nối.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết Dockerfile, tạo image, chạy container, kiểm tra tình trạng dịch vụ và cấu hình CI chạy kiểm thử.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: hoàn thành bài image và HTTP probe trước. Compose mô tả dịch vụ, mạng, volume và điều kiện phụ thuộc. Ở lab này api là dịch vụ chính, probe là client kiểm tra trong cùng mạng; không dựng Redis/Postgres nếu tác vụ chưa cần.

Trong container probe, localhost là chính probe. Dùng http://api:8080/ready qua tên service; trên máy bạn dùng http://127.0.0.1:8091. depends_on với service_healthy chỉ chặn khởi động client cho tới khi healthcheck đạt, không tự bảo đảm hệ thống phục hồi sau mọi lỗi.

Chạy docker compose -f compose.capstone.yaml --profile verify run --rm probe. Sau đó chạy ví dụ counter, ghi completed_queries, dùng docker compose -f compose.capstone.yaml restart api, chờ /ready rồi đọc /stats. Số đếm phải giữ nguyên qua restart. Named volume lab-state lưu SQLite counter, không lưu câu hỏi hay dữ liệu học.

Để dừng lab dùng docker compose -f compose.capstone.yaml down, không thêm -v. Volume vẫn tồn tại; backup/restore là việc riêng và cần được thử. read_only, cap_drop và no-new-privileges giảm quyền container, không thay thế xác thực, TLS, giới hạn request hoặc kiểm tra lỗ hổng.

Chứng minh client trong container dùng api:8080, còn client trên host dùng 127.0.0.1:8091. Ghi số đếm trước và sau restart.

Một query hợp lệ tăng đúng 1; restart giữ số đếm. Không ghi nội dung câu hỏi vào SQLite.

### English

Prerequisite: the image lesson and HTTP probe. Compose declares services, networking, volumes and dependencies. api is the service and probe is a client on its network; no Redis/Postgres is added without a need.

localhost inside probe means probe itself. Use http://api:8080/ready there and http://127.0.0.1:8091 from the host. service_healthy gates startup, not every later recovery scenario.

Run docker compose -f compose.capstone.yaml --profile verify run --rm probe. Run the counter example, record completed_queries, restart api, wait for /ready and read /stats. The count survives restart through named volume lab-state. Only synthetic aggregate counters are stored, never question text or learner data.

Stop with docker compose -f compose.capstone.yaml down without -v. Volumes persist; backup/restore remains a separate tested procedure. Read-only root, dropped capabilities and no-new-privileges do not replace authentication, TLS, request limits or vulnerability checks.

Demonstrate api:8080 from the container network and 127.0.0.1:8091 from the host; compare counters across restart.

One valid query increments once; restart preserves the count. SQLite contains no question text.
