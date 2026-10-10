---
lesson_id: phase-05-mlops-containers-3
phase_id: phase-05-mlops
module_id: containers
title_vi: Kiểm thử đơn vị và tích hợp
title_en: Unit and integration tests
summary_vi: Kiểm thử đơn vị kiểm tra hành vi trong phạm vi nhỏ; kiểm thử tích hợp kiểm tra sự phối hợp giữa các
  thành phần.
summary_en: Learn Unit and integration tests through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain unit and integration tests with a concrete example.
- Write or adapt a small code example applying unit and integration tests.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-containers-2
- phase-04-deep-learning-pytorch-core-1
key_terms:
- unit
- integration
- test
- inference
- observability
- reproducibility
- deployment
- containers
concept_notes_vi: Kiểm thử đơn vị kiểm tra hành vi trong phạm vi nhỏ; kiểm thử tích hợp kiểm tra sự phối hợp giữa
  các thành phần. Hai loại bổ sung cho nhau và cần kết quả mong đợi rõ.
concept_notes_en: Unit và integration test is a concept in the containers module. Identify the inputs, outputs,
  assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Đóng gói môi trường để người khác chạy được cùng dịch vụ và kiểm tra tự động.
why_it_matters_en: Package the environment with Docker and CI so another engineer can run the same service from
  a clone.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Unit and integration tests” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Package the environment with Docker and CI so another engineer can run the
  same service from a clone.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a small Dockerfile, build the image, run the container, call its health check,
  and add CI tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết Dockerfile, tạo image, chạy container,
      kiểm tra tình trạng dịch vụ và cấu hình CI chạy kiểm thử.'
    deliverables:
    - Cấu hình chạy cùng kết quả kiểm tra dịch vụ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a small Dockerfile, build the image, run the container, call its health check, and add CI tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You know what the image contains, what it omits, and how to roll back to an earlier tag.
    stretch: Add a failure test for unit and integration tests and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kiểm thử đơn vị và tích hợp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain unit and integration tests to a new teammate?
  - Which assumption behind unit and integration tests could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Unit and integration tests: inspect one complete path'
  code: "# Topic: Unit and integration tests (phase-05-mlops-containers-3)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for unit and integration tests.
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
- exercise-5-containers
review_item_ids:
- phase-05-mlops-containers-3-recall
- phase-05-mlops-containers-3-application
- phase-05-mlops-containers-3-debug
- phase-05-mlops-containers-3-interview
estimated_minutes: 60
completion_checklist:
- Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.
common_mistakes:
- Cho rằng chạy được trên máy phát triển đã đủ chứng minh môi trường tái lập.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-containers-4
- phase-05-mlops-tracking-1
review_question_vi: Nội dung cốt lõi của “Kiểm thử đơn vị và tích hợp” là gì?
review_question_en: Define unit and integration tests in your own words. What are the input, transformation and
  output?
review_answer_vi: Kiểm thử đơn vị kiểm tra hành vi trong phạm vi nhỏ; kiểm thử tích hợp kiểm tra sự phối hợp giữa
  các thành phần. Hai loại bổ sung cho nhau và cần kết quả mong đợi rõ.
review_answer_en: A strong answer names the input, transformation, output and the context where unit and integration
  tests is used. Relate it specifically to unit and integration tests in lesson phase-05-mlops-containers-3.
review_cards:
- id: phase-05-mlops-containers-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kiểm thử đơn vị và tích hợp” là gì?
  question_en: Define unit and integration tests in your own words. What are the input, transformation and output?
  answer_vi: Kiểm thử đơn vị kiểm tra hành vi trong phạm vi nhỏ; kiểm thử tích hợp kiểm tra sự phối hợp giữa các
    thành phần. Hai loại bổ sung cho nhau và cần kết quả mong đợi rõ.
  answer_en: A strong answer names the input, transformation, output and the context where unit and integration
    tests is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-containers-3-application
  type: application
  question_vi: Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.
  question_en: Write a small code example or design that applies unit and integration tests to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần”, cần lưu: cấu hình
    chạy cùng kết quả kiểm tra dịch vụ. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết.'
  answer_en: The unit and integration tests example should have an explicit input, expected output and a way to
    run or verify it (phase-05-mlops-containers-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-containers-3-debug
  type: debug
  question_vi: Khi làm bài “Kiểm thử đơn vị và tích hợp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If unit and integration tests produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Kiểm thử đơn vị và tích hợp”, lỗi cần tránh là: cho rằng chạy được trên máy phát triển
    đã đủ chứng minh môi trường tái lập. Chạy lại trong môi trường mới và kiểm tra các phụ thuộc cần thiết. Dùng
    ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For unit and integration tests, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-05-mlops-containers-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-containers-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kiểm thử đơn vị và tích hợp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of unit and integration tests?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about unit and integration tests should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-05-mlops-containers-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiểm thử đơn vị và tích hợp / Unit and integration tests

Kiểm thử đơn vị kiểm tra hành vi trong phạm vi nhỏ; kiểm thử tích hợp kiểm tra sự phối hợp giữa các thành phần. Hai loại bổ sung cho nhau và cần kết quả mong đợi rõ.

## Thực hành

Viết kiểm thử cho một hàm và cho một luồng qua nhiều thành phần.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết Dockerfile, tạo image, chạy container, kiểm tra tình trạng dịch vụ và cấu hình CI chạy kiểm thử.
