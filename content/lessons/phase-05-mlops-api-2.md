---
lesson_id: phase-05-mlops-api-2
phase_id: phase-05-mlops
module_id: api
title_vi: Định nghĩa route trong FastAPI
title_en: FastAPI routes
summary_vi: Route ánh xạ đường dẫn và phương thức HTTP tới hàm xử lý.
summary_en: Learn FastAPI routes through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain fastapi routes with a concrete example.
- Write or adapt a small code example applying fastapi routes.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-api-1
- phase-04-deep-learning-pytorch-core-1
key_terms:
- fastapi
- route
- inference
- observability
- reproducibility
- deployment
- api
concept_notes_vi: Route ánh xạ đường dẫn và phương thức HTTP tới hàm xử lý. Giữ lớp giao tiếp gọn giúp kiểm thử
  nghiệp vụ riêng và trả lỗi rõ khi yêu cầu không hợp lệ.
concept_notes_en: FastAPI route describes a boundary between data and a service. A sound request has a schema, validation,
  status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and tests
  empty or malformed data.
why_it_matters_vi: Đóng gói mô hình thành dịch vụ có cấu hình và cấu trúc yêu cầu, phản hồi rõ ràng.
why_it_matters_en: Package a model as an inference service with configuration, request/response schemas, and a clear
  batch path.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “FastAPI routes” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Package a model as an inference service with configuration, request/response
  schemas, and a clear batch path.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Separate model loading, service, and routes; add health checks, model versioning,
  and valid/invalid request tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách bộ nạp mô hình, logic dịch vụ và
      route; thêm kiểm tra tình trạng, phiên bản mô hình và kiểm thử yêu cầu hợp lệ, không hợp lệ.'
    deliverables:
    - Yêu cầu mẫu, phản hồi và kiểm thử dữ liệu không hợp lệ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Separate model loading, service, and routes; add health checks, model versioning, and valid/invalid request
      tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can replace the model without rewriting the API and locate input, model, or server failures.
    stretch: Add a failure test for fastapi routes and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Định nghĩa route trong FastAPI” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain fastapi routes to a new teammate?
  - Which assumption behind fastapi routes could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'FastAPI routes: inspect one complete path'
  code: "# Topic: FastAPI routes (phase-05-mlops-api-2)\nimport time\n\ndef timed_response(value: float) -> dict[str,\
    \ float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result, 'latency_ms':\
    \ (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for fastapi routes.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
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
- title: FastAPI Tutorial
  url: https://fastapi.tiangolo.com/tutorial/
  language: en
  purpose_vi: Đóng gói bước suy luận thành API có cấu trúc dữ liệu rõ và tài liệu được tạo tự động.
  read_vi: Đọc về khai báo route, phần thân yêu cầu bằng Pydantic và mô hình dữ liệu phản hồi.
  purpose_en: Package inference as an API with schemas and generated docs.
  read_en: Read path operations, Pydantic bodies, and response models.
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
- exercise-5-api
review_item_ids:
- phase-05-mlops-api-2-recall
- phase-05-mlops-api-2-application
- phase-05-mlops-api-2-debug
- phase-05-mlops-api-2-interview
estimated_minutes: 60
completion_checklist:
- Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.
common_mistakes:
- Chỉ thử yêu cầu hợp lệ và bỏ qua lỗi nạp mô hình hoặc sai kiểu dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-api-3
- phase-05-mlops-api-4
review_question_vi: Nội dung cốt lõi của “Định nghĩa route trong FastAPI” là gì?
review_question_en: Define fastapi routes in your own words. What are the input, transformation and output?
review_answer_vi: Route ánh xạ đường dẫn và phương thức HTTP tới hàm xử lý. Giữ lớp giao tiếp gọn giúp kiểm thử
  nghiệp vụ riêng và trả lỗi rõ khi yêu cầu không hợp lệ.
review_answer_en: A strong answer names the input, transformation, output and the context where fastapi routes is
  used. Relate it specifically to fastapi routes in lesson phase-05-mlops-api-2.
review_cards:
- id: phase-05-mlops-api-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Định nghĩa route trong FastAPI” là gì?
  question_en: Define fastapi routes in your own words. What are the input, transformation and output?
  answer_vi: Route ánh xạ đường dẫn và phương thức HTTP tới hàm xử lý. Giữ lớp giao tiếp gọn giúp kiểm thử nghiệp
    vụ riêng và trả lỗi rõ khi yêu cầu không hợp lệ.
  answer_en: A strong answer names the input, transformation, output and the context where fastapi routes is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-api-2-application
  type: application
  question_vi: Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.
  question_en: Write a small code example or design that applies fastapi routes to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ”, cần lưu: yêu cầu
    mẫu, phản hồi và kiểm thử dữ liệu không hợp lệ. Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API.'
  answer_en: The fastapi routes example should have an explicit input, expected output and a way to run or verify
    it (phase-05-mlops-api-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-api-2-debug
  type: debug
  question_vi: Khi làm bài “Định nghĩa route trong FastAPI”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If fastapi routes produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Định nghĩa route trong FastAPI”, lỗi cần tránh là: chỉ thử yêu cầu hợp lệ và bỏ qua lỗi
    nạp mô hình hoặc sai kiểu dữ liệu. Đối chiếu mã trạng thái và cấu trúc phản hồi với đặc tả API. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For fastapi routes, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-05-mlops-api-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-api-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Định nghĩa route trong FastAPI” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of fastapi routes?
  answer_vi: Bắt đầu từ nhiệm vụ “Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about fastapi routes should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-05-mlops-api-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Định nghĩa route trong FastAPI / FastAPI routes

Route ánh xạ đường dẫn và phương thức HTTP tới hàm xử lý. Giữ lớp giao tiếp gọn giúp kiểm thử nghiệp vụ riêng và trả lỗi rõ khi yêu cầu không hợp lệ.

## Thực hành

Tạo route nhỏ và kiểm tra phản hồi cho yêu cầu hợp lệ, không hợp lệ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tách bộ nạp mô hình, logic dịch vụ và route; thêm kiểm tra tình trạng, phiên bản mô hình và kiểm thử yêu cầu hợp lệ, không hợp lệ.
