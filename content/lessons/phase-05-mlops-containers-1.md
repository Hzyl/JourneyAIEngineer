---
lesson_id: phase-05-mlops-containers-1
phase_id: phase-05-mlops
module_id: containers
title_vi: Tạo Docker image
title_en: Docker images
summary_vi: Docker image đóng gói hệ thống tệp và cấu hình cần để khởi chạy ứng dụng.
summary_en: Learn Docker images through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Tạo image cho API RAG nhỏ và kiểm chứng readiness bằng HTTP.
learning_objectives_en:
- Explain docker images with a concrete example.
- Write or adapt a small code example applying docker images.
- Recognize its assumptions, limits and one common failure mode.
- Build a small RAG API image and verify readiness through HTTP.
prerequisites:
- phase-05-mlops-api-4
- phase-04-deep-learning-pytorch-core-1
key_terms:
- docker
- image
- inference
- observability
- reproducibility
- deployment
- containers
concept_notes_vi: |-
  Docker image đóng gói hệ thống tệp và cấu hình cần để khởi chạy ứng dụng. Image tái lập cần phụ thuộc rõ, lệnh khởi động đúng và không chứa bí mật của môi trường sử dụng.

  Image là mẫu bất biến dùng để tạo container; container là tiến trình chạy với hệ thống tệp của image và phần ghi riêng. Nó không phải máy ảo đầy đủ, nên kiến trúc CPU và môi trường chạy vẫn ảnh hưởng khả năng sử dụng.

  Ví dụ, COPY requirements.txt rồi cài thư viện giúp bước cài có thể dùng lại khi chỉ đổi mã ứng dụng. Dữ liệu cần giữ qua lần thay container phải được lưu ở volume hoặc dịch vụ lưu trữ phù hợp.

  Tự kiểm tra: xóa container có nên làm mất dữ liệu học của người dùng không? Không; đó là lý do cần tách dữ liệu bền vững khỏi phần ghi tạm của container và thử khôi phục.

  Chuẩn bị: biết gọi HTTP, chạy Python và phân biệt file mã nguồn với cấu hình. Image là khuôn bất biến gồm hệ điều hành tối thiểu, thư viện và mã; container là tiến trình chạy từ image. Máy chủ model là một dịch vụ riêng nếu cần GPU; API điều phối retrieval không tự biến thành model server.

  Lab dùng samples/vi-document-assistant/Dockerfile.capstone: chép requirements trước mã để cache dependency, ghim Python/FastAPI/Uvicorn, chạy bằng UID 10001, chỉ chép corpus giả. Không chép .env, database học hoặc cache vào image. Tag phiên bản vẫn có thể đổi nội dung; bản phát hành cần lưu image digest và bản khóa dependency đầy đủ.

  Từ thư mục samples/vi-document-assistant, chạy docker compose -f compose.capstone.yaml config --quiet, rồi docker compose -f compose.capstone.yaml up --build -d api. Mở /ready ở cổng 8091. Lệnh đầu chỉ kiểm tra cấu hình; chỉ khi build và HTTP probe đều chạy mới có bằng chứng container hoạt động. Nếu Docker Engine chưa chạy, ghi NOT RUN; không thay bằng kết quả chạy Python native.

  Cổng host chỉ bind 127.0.0.1. API bên trong bind 0.0.0.0:8080 để container nhận kết nối. Các khóa demo-A-public/demo-B-public chỉ chọn danh tính giả; tuyệt đối không dùng làm đăng nhập production. Đây là baseline trích xuất nguồn, chưa gọi LLM.
concept_notes_en: |-
  A Docker image packages filesystem content and startup configuration. Reproducible builds need explicit dependencies, a correct startup command and no deployment secrets embedded in the image.

  An image is an immutable template; a container is a running process with the image filesystem and its own writable layer. It is not a complete virtual machine, so CPU architecture and runtime environment still matter.

  Copy dependency declarations before application code to allow reuse of the installation layer. Store data that must survive container replacement in a suitable volume or storage service.

  Self-check: should removing a container erase learner progress? No: separate persistent data from its temporary writable layer and test recovery.

  Prerequisites: HTTP requests, running Python and separating source from configuration. An image is an immutable template of minimal OS, libraries and code; a container is a running process. A GPU model server is a separate service when needed; a retrieval API is not itself a model server.

  The lab Dockerfile.capstone copies requirements before source for caching, pins Python/FastAPI/Uvicorn, runs as UID 10001 and includes synthetic data only. Do not copy .env, learner databases or caches. Version tags remain mutable; releases need an image digest and a complete dependency lock.

  From samples/vi-document-assistant, run docker compose -f compose.capstone.yaml config --quiet, then docker compose -f compose.capstone.yaml up --build -d api. Probe /ready on port 8091. Config validation alone does not run a container. If the engine is unavailable, record NOT RUN; native Python execution is separate evidence.

  The host port binds only to 127.0.0.1; Uvicorn inside binds to 0.0.0.0:8080. Public demo keys select synthetic identities, not production authentication. This is an extractive baseline without LLM inference.
why_it_matters_vi: Đóng gói môi trường để người khác chạy được cùng dịch vụ và kiểm tra tự động.
why_it_matters_en: Package the environment with Docker and CI so another engineer can run the same service
  from a clone.
study_steps_vi:
- Đọc Dockerfile và .dockerignore trước khi build.
- Kiểm tra từng layer, UID và đường dẫn state.
- Build và chạy api bằng Compose; chạy probe ở terminal thứ hai.
- Lưu digest, output và trạng thái các bước chưa chạy.
study_steps_en:
- Read Dockerfile and .dockerignore.
- Inspect layers, UID and state path.
- Build/start api with Compose; probe from a second terminal.
- Save digest, output and NOT RUN steps.
practice_plan:
  vi:
    task: Chạy image capstone rồi gọi /ready. Sau đó cố ý đổi cổng gọi thành 8092 để phân biệt lỗi kết nối
      với lỗi ứng dụng.
    deliverables:
    - Dockerfile và danh sách file được đưa vào image
    - HTTP readiness thành công cùng digest hoặc ghi NOT RUN rõ lý do
    checkpoint: 'Probe in {"ready": true, "has_corpus": true}; sai cổng phải báo lỗi kết nối. Không có bí mật
      trong build context.'
    stretch: Thử tag khác trong một bản sao lab và giải thích vì sao cần lưu digest để rollback.
  en:
    task: Run the capstone image and probe /ready; use port 8092 once to distinguish connection failure from
      application failure.
    deliverables:
    - Dockerfile and build-context inventory
    - Successful HTTP readiness and digest, or an explicit NOT RUN reason
    checkpoint: 'Probe prints {"ready": true, "has_corpus": true}; wrong port fails. Build context contains
      no secrets.'
    stretch: Try a different image tag in a lab copy and explain digest-based rollback.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tạo Docker image” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain docker images to a new teammate?
  - Which assumption behind docker images could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- title: Probe the capstone readiness endpoint
  code: |
    import json
    from urllib.request import urlopen

    with urlopen("http://127.0.0.1:8091/ready", timeout=3) as response:
        payload = json.load(response)
    assert payload["status"] == "ready"
    assert payload["chunks"] > 0
    assert len(payload["corpus_sha256"]) == 64
    print(json.dumps({"ready": True, "has_corpus": True}))
  language: python
  status: runnable
  purpose_vi: Gọi dịch vụ thật và kiểm tra corpus đã nạp; không dùng số liệu thời gian giả.
  purpose_en: Call the actual service and verify corpus readiness, without fabricated timing.
  setup: Download repository ZIP; start the synthetic API using the native or Docker commands shown in this
    lesson/CAPSTONE.md. Run this Python cell in a second local terminal (not remote Colab). No credentials
    needed; demo keys are public fixtures.
  expected_output: '{"ready": true, "has_corpus": true}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Gọi dịch vụ thật và kiểm tra corpus đã nạp; không dùng số liệu thời gian giả.
  explanation_en: Call the actual service and verify corpus readiness, without fabricated timing.
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
- phase-05-mlops-containers-1-recall
- phase-05-mlops-containers-1-application
- phase-05-mlops-containers-1-debug
- phase-05-mlops-containers-1-interview
estimated_minutes: 75
completion_checklist:
- Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Dockerfile và danh sách file được đưa vào image
- HTTP readiness thành công cùng digest hoặc ghi NOT RUN rõ lý do
- 'Probe in {"ready": true, "has_corpus": true}; sai cổng phải báo lỗi kết nối. Không có bí mật trong build
  context.'
common_mistakes:
- Cho rằng chạy được trên máy phát triển đã đủ chứng minh môi trường tái lập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Nhầm config --quiet pass với container đã chạy.
- Chép cả repo hoặc secrets vào image; nhầm khóa demo với xác thực an toàn.
next_lessons:
- phase-05-mlops-containers-2
- phase-05-mlops-containers-3
review_question_vi: Nội dung cốt lõi của “Tạo Docker image” là gì?
review_question_en: Define docker images in your own words. What are the input, transformation and output?
review_answer_vi: Docker image đóng gói hệ thống tệp và cấu hình cần để khởi chạy ứng dụng. Image tái lập cần
  phụ thuộc rõ, lệnh khởi động đúng và không chứa bí mật của môi trường sử dụng.
review_answer_en: A strong answer names the input, transformation, output and the context where docker images
  is used. Relate it specifically to docker images in lesson phase-05-mlops-containers-1.
review_cards:
- id: phase-05-mlops-containers-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tạo Docker image” là gì?
  question_en: Define docker images in your own words. What are the input, transformation and output?
  answer_vi: Docker image đóng gói hệ thống tệp và cấu hình cần để khởi chạy ứng dụng. Image tái lập cần phụ
    thuộc rõ, lệnh khởi động đúng và không chứa bí mật của môi trường sử dụng.
  answer_en: A strong answer names the input, transformation, output and the context where docker images is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-containers-1-application
  type: application
  question_vi: Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container.
  question_en: Write a small code example or design that applies docker images to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container”, cần lưu:
    cấu hình chạy cùng kết quả kiểm tra dịch vụ. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần
    thiết.'
  answer_en: The docker images example should have an explicit input, expected output and a way to run or verify
    it (phase-05-mlops-containers-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-containers-1-debug
  type: debug
  question_vi: Khi làm bài “Tạo Docker image”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If docker images produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Tạo Docker image”, lỗi cần tránh là: cho rằng chạy được trên máy phát triển đã đủ
    chứng minh môi trường tái lập. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết. Dùng
    ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For docker images, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-05-mlops-containers-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-containers-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tạo Docker image” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of docker images?
  answer_vi: Bắt đầu từ nhiệm vụ “Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định
    nghĩa.
  answer_en: The answer about docker images should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-05-mlops-containers-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Dockerfile and build-context inventory
- Successful HTTP readiness and digest, or an explicit NOT RUN reason
- 'Probe prints {"ready": true, "has_corpus": true}; wrong port fails. Build context contains no secrets.'
common_mistakes_en:
- Treating config validation as container execution.
- Copying secrets or treating public demo keys as real authentication.
---
# Tạo Docker image / Docker images

Docker image đóng gói hệ thống tệp và cấu hình cần để khởi chạy ứng dụng. Image tái lập cần phụ thuộc rõ, lệnh khởi động đúng và không chứa bí mật của môi trường sử dụng.

Image là mẫu bất biến dùng để tạo container; container là tiến trình chạy với hệ thống tệp của image và phần ghi riêng. Nó không phải máy ảo đầy đủ, nên kiến trúc CPU và môi trường chạy vẫn ảnh hưởng khả năng sử dụng.

Ví dụ, COPY requirements.txt rồi cài thư viện giúp bước cài có thể dùng lại khi chỉ đổi mã ứng dụng. Dữ liệu cần giữ qua lần thay container phải được lưu ở volume hoặc dịch vụ lưu trữ phù hợp.

Tự kiểm tra: xóa container có nên làm mất dữ liệu học của người dùng không? Không; đó là lý do cần tách dữ liệu bền vững khỏi phần ghi tạm của container và thử khôi phục.

## Thực hành

Tạo image cho ứng dụng nhỏ và kiểm tra ứng dụng chạy trong container.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết Dockerfile, tạo image, chạy container, kiểm tra tình trạng dịch vụ và cấu hình CI chạy kiểm thử.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: biết gọi HTTP, chạy Python và phân biệt file mã nguồn với cấu hình. Image là khuôn bất biến gồm hệ điều hành tối thiểu, thư viện và mã; container là tiến trình chạy từ image. Máy chủ model là một dịch vụ riêng nếu cần GPU; API điều phối retrieval không tự biến thành model server.

Lab dùng samples/vi-document-assistant/Dockerfile.capstone: chép requirements trước mã để cache dependency, ghim Python/FastAPI/Uvicorn, chạy bằng UID 10001, chỉ chép corpus giả. Không chép .env, database học hoặc cache vào image. Tag phiên bản vẫn có thể đổi nội dung; bản phát hành cần lưu image digest và bản khóa dependency đầy đủ.

Từ thư mục samples/vi-document-assistant, chạy docker compose -f compose.capstone.yaml config --quiet, rồi docker compose -f compose.capstone.yaml up --build -d api. Mở /ready ở cổng 8091. Lệnh đầu chỉ kiểm tra cấu hình; chỉ khi build và HTTP probe đều chạy mới có bằng chứng container hoạt động. Nếu Docker Engine chưa chạy, ghi NOT RUN; không thay bằng kết quả chạy Python native.

Cổng host chỉ bind 127.0.0.1. API bên trong bind 0.0.0.0:8080 để container nhận kết nối. Các khóa demo-A-public/demo-B-public chỉ chọn danh tính giả; tuyệt đối không dùng làm đăng nhập production. Đây là baseline trích xuất nguồn, chưa gọi LLM.

Chạy image capstone rồi gọi /ready. Sau đó cố ý đổi cổng gọi thành 8092 để phân biệt lỗi kết nối với lỗi ứng dụng.

Probe in {"ready": true, "has_corpus": true}; sai cổng phải báo lỗi kết nối. Không có bí mật trong build context.

### English

Prerequisites: HTTP requests, running Python and separating source from configuration. An image is an immutable template of minimal OS, libraries and code; a container is a running process. A GPU model server is a separate service when needed; a retrieval API is not itself a model server.

The lab Dockerfile.capstone copies requirements before source for caching, pins Python/FastAPI/Uvicorn, runs as UID 10001 and includes synthetic data only. Do not copy .env, learner databases or caches. Version tags remain mutable; releases need an image digest and a complete dependency lock.

From samples/vi-document-assistant, run docker compose -f compose.capstone.yaml config --quiet, then docker compose -f compose.capstone.yaml up --build -d api. Probe /ready on port 8091. Config validation alone does not run a container. If the engine is unavailable, record NOT RUN; native Python execution is separate evidence.

The host port binds only to 127.0.0.1; Uvicorn inside binds to 0.0.0.0:8080. Public demo keys select synthetic identities, not production authentication. This is an extractive baseline without LLM inference.

Run the capstone image and probe /ready; use port 8092 once to distinguish connection failure from application failure.

Probe prints {"ready": true, "has_corpus": true}; wrong port fails. Build context contains no secrets.
