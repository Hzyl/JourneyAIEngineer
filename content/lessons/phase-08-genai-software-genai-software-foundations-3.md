---
lesson_id: phase-08-genai-software-genai-software-foundations-3
phase_id: phase-08-genai-software
module_id: genai-software-foundations
title_vi: REST API, SQL và Docker cho AI
title_en: REST APIs, SQL and Docker for AI
summary_vi: API nhận yêu cầu, SQL quản lý dữ liệu có cấu trúc, Docker đóng gói môi trường.
summary_en: Learn REST APIs, SQL and Docker for AI through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain rest apis, sql and docker for ai with a concrete example.
- Write or adapt a small code example applying rest apis, sql and docker for ai.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-08-genai-software-genai-software-foundations-2
- phase-07-capstone-career-problem-1
key_terms:
- rest
- api
- sql
- docker
- cho
- inference
- observability
- reproducibility
- deployment
- genai-software-foundations
concept_notes_vi: API nhận yêu cầu, SQL quản lý dữ liệu có cấu trúc, Docker đóng gói môi trường. Xác định trách
  nhiệm từng phần để lỗi lưu trữ hoặc đầu vào không bị nhầm thành lỗi mô hình.
concept_notes_en: REST API, SQL và Docker cho AI describes a boundary between data and a service. A sound request
  has a schema, validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate
  indexes, and tests empty or malformed data.
why_it_matters_vi: Kiểm soát cấu trúc dịch vụ, phụ thuộc và phát hành trước khi tối ưu mô hình.
why_it_matters_en: An AI Engineer must control service boundaries, dependencies, and releases before optimizing
  a model.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “REST APIs, SQL and Docker for AI” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: An AI Engineer must control service boundaries, dependencies, and releases
  before optimizing a model.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its
  contract, health check, and rollback command.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đóng gói API AI giả lập bằng FastAPI,
      Docker và GitHub Actions; ghi cấu trúc trao đổi, kiểm tra tình trạng và cách khôi phục.'
    deliverables:
    - Đặc tả dịch vụ hoặc cấu hình chạy có cách kiểm tra
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract, health check,
      and rollback command.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From a clean clone, run tests and the container with one command sequence and distinguish code,
      environment, and deployment failures.
    stretch: Add a failure test for rest apis, sql and docker for ai and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “REST API, SQL và Docker cho AI” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain rest apis, sql and docker for ai to a new teammate?
  - Which assumption behind rest apis, sql and docker for ai could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'REST APIs, SQL and Docker for AI: inspect one complete path'
  code: "# Topic: REST APIs, SQL and Docker for AI (phase-08-genai-software-genai-software-foundations-3)\nimport\
    \ time\n\ndef timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n    result\
    \ = value * 2\n    return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for rest apis, sql and docker for ai.
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
  title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
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
- title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
  language: en
  purpose_vi: Hiểu cấu trúc yêu cầu, phản hồi HTTP và cách trao đổi dữ liệu JSON.
  read_vi: Đọc về chu trình yêu cầu–phản hồi, mã trạng thái và kiểu nội dung.
  purpose_en: Learn request, response, methods, status codes, and JSON boundaries.
  read_en: Read the request/response cycle, status codes, and content types.
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
- exercise-8-genai-software-foundations
review_item_ids:
- phase-08-genai-software-genai-software-foundations-3-recall
- phase-08-genai-software-genai-software-foundations-3-application
- phase-08-genai-software-genai-software-foundations-3-debug
- phase-08-genai-software-genai-software-foundations-3-interview
estimated_minutes: 60
completion_checklist:
- Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
common_mistakes:
- Dựa vào chú thích kiểu mà bỏ qua kiểm tra dữ liệu khi chạy.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-08-genai-software-genai-software-foundations-4
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
review_question_vi: Nội dung cốt lõi của “REST API, SQL và Docker cho AI” là gì?
review_question_en: Define rest apis, sql and docker for ai in your own words. What are the input, transformation
  and output?
review_answer_vi: API nhận yêu cầu, SQL quản lý dữ liệu có cấu trúc, Docker đóng gói môi trường. Xác định trách
  nhiệm từng phần để lỗi lưu trữ hoặc đầu vào không bị nhầm thành lỗi mô hình.
review_answer_en: A strong answer names the input, transformation, output and the context where rest apis, sql and
  docker for ai is used. Relate it specifically to rest apis, sql and docker for ai in lesson phase-08-genai-software-genai-software-foundations-3.
review_cards:
- id: phase-08-genai-software-genai-software-foundations-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “REST API, SQL và Docker cho AI” là gì?
  question_en: Define rest apis, sql and docker for ai in your own words. What are the input, transformation and
    output?
  answer_vi: API nhận yêu cầu, SQL quản lý dữ liệu có cấu trúc, Docker đóng gói môi trường. Xác định trách nhiệm
    từng phần để lỗi lưu trữ hoặc đầu vào không bị nhầm thành lỗi mô hình.
  answer_en: A strong answer names the input, transformation, output and the context where rest apis, sql and docker
    for ai is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-08-genai-software-genai-software-foundations-3-application
  type: application
  question_vi: Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.
  question_en: Write a small code example or design that applies rest apis, sql and docker for ai to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi”, cần lưu: đặc tả dịch vụ hoặc cấu
    hình chạy có cách kiểm tra. Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.'
  answer_en: The rest apis, sql and docker for ai example should have an explicit input, expected output and a way
    to run or verify it (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-08-genai-software-genai-software-foundations-3-debug
  type: debug
  question_vi: Khi làm bài “REST API, SQL và Docker cho AI”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If rest apis, sql and docker for ai produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “REST API, SQL và Docker cho AI”, lỗi cần tránh là: dựa vào chú thích kiểu mà bỏ qua kiểm
    tra dữ liệu khi chạy. Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For rest apis, sql and docker for ai, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-08-genai-software-genai-software-foundations-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “REST API, SQL và Docker cho AI” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of rest apis, sql and docker
    for ai?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi”. Trình bày kết quả đã lưu,
    cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about rest apis, sql and docker for ai should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-08-genai-software-genai-software-foundations-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# REST API, SQL và Docker cho AI / REST APIs, SQL and Docker for AI

API nhận yêu cầu, SQL quản lý dữ liệu có cấu trúc, Docker đóng gói môi trường. Xác định trách nhiệm từng phần để lỗi lưu trữ hoặc đầu vào không bị nhầm thành lỗi mô hình.

## Thực hành

Vẽ luồng một yêu cầu từ API tới dữ liệu và phản hồi.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đóng gói API AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi cấu trúc trao đổi, kiểm tra tình trạng và cách khôi phục.
