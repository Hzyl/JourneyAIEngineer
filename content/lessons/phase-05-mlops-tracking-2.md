---
lesson_id: phase-05-mlops-tracking-2
phase_id: phase-05-mlops
module_id: tracking
title_vi: Quản lý phiên bản dữ liệu
title_en: Data versioning
summary_vi: Dữ liệu thay đổi có thể làm kết quả mô hình thay đổi dù mã nguồn giữ nguyên.
summary_en: Learn Data versioning through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.
- Lần từ kết quả về đúng phiên bản đã tạo ra nó.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain data versioning with a concrete example.
- Write or adapt a small code example applying data versioning.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-05-mlops-tracking-1
- phase-04-deep-learning-pytorch-core-1
key_terms:
- data
- versioning
- inference
- observability
- reproducibility
- deployment
- tracking
concept_notes_vi: Dữ liệu thay đổi có thể làm kết quả mô hình thay đổi dù mã nguồn giữ nguyên. Ghi nguồn, phiên
  bản và các bước biến đổi để tái tạo tập dữ liệu.
concept_notes_en: Data versioning is a concept in the tracking module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Gắn mô hình với dữ liệu, cấu hình và mã nguồn để kết quả có thể tái lập.
why_it_matters_en: Track models, data, experiments, and seeds so results are reproducible and comparable.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Data versioning” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.
- Lần từ kết quả về đúng phiên bản đã tạo ra nó. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Track models, data, experiments, and seeds so results are reproducible and
  comparable.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Log parameters, metrics, artifact paths, and the git commit for two runs, then compare
  them in a table.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Ghi tham số, thước đo, đường dẫn kết
      quả và commit cho hai lần chạy rồi so sánh bằng bảng.'
    deliverables:
    - Bản ghi lần chạy gắn dữ liệu, cấu hình, mã nguồn và thước đo
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Lần từ kết quả về đúng phiên bản đã tạo ra nó.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Log parameters, metrics, artifact paths, and the git commit for two runs, then compare them in a table.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can identify which run produced the served model and why it was selected.
    stretch: Add a failure test for data versioning and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Quản lý phiên bản dữ liệu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain data versioning to a new teammate?
  - Which assumption behind data versioning could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Data versioning: inspect one complete path'
  code: "# Topic: Data versioning (phase-05-mlops-tracking-2)\nimport time\n\ndef timed_response(value: float) ->\
    \ dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result': result,\
    \ 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for data versioning.
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
- exercise-5-tracking
review_item_ids:
- phase-05-mlops-tracking-2-recall
- phase-05-mlops-tracking-2-application
- phase-05-mlops-tracking-2-debug
- phase-05-mlops-tracking-2-interview
estimated_minutes: 60
completion_checklist:
- Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.
- Lần từ kết quả về đúng phiên bản đã tạo ra nó.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần từ kết quả về đúng phiên bản đã tạo ra nó.
common_mistakes:
- Lưu điểm số nhưng không lưu cấu hình hoặc phiên bản dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-tracking-3
- phase-05-mlops-tracking-4
review_question_vi: Nội dung cốt lõi của “Quản lý phiên bản dữ liệu” là gì?
review_question_en: Define data versioning in your own words. What are the input, transformation and output?
review_answer_vi: Dữ liệu thay đổi có thể làm kết quả mô hình thay đổi dù mã nguồn giữ nguyên. Ghi nguồn, phiên
  bản và các bước biến đổi để tái tạo tập dữ liệu.
review_answer_en: A strong answer names the input, transformation, output and the context where data versioning
  is used. Relate it specifically to data versioning in lesson phase-05-mlops-tracking-2.
review_cards:
- id: phase-05-mlops-tracking-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Quản lý phiên bản dữ liệu” là gì?
  question_en: Define data versioning in your own words. What are the input, transformation and output?
  answer_vi: Dữ liệu thay đổi có thể làm kết quả mô hình thay đổi dù mã nguồn giữ nguyên. Ghi nguồn, phiên bản và
    các bước biến đổi để tái tạo tập dữ liệu.
  answer_en: A strong answer names the input, transformation, output and the context where data versioning is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-05-mlops-tracking-2-application
  type: application
  question_vi: Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.
  question_en: Write a small code example or design that applies data versioning to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị”, cần lưu: bản ghi lần
    chạy gắn dữ liệu, cấu hình, mã nguồn và thước đo. Lần từ kết quả về đúng phiên bản đã tạo ra nó.'
  answer_en: The data versioning example should have an explicit input, expected output and a way to run or verify
    it (phase-05-mlops-tracking-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-05-mlops-tracking-2-debug
  type: debug
  question_vi: Khi làm bài “Quản lý phiên bản dữ liệu”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If data versioning produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Quản lý phiên bản dữ liệu”, lỗi cần tránh là: lưu điểm số nhưng không lưu cấu hình hoặc
    phiên bản dữ liệu. Lần từ kết quả về đúng phiên bản đã tạo ra nó. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For data versioning, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-05-mlops-tracking-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-05-mlops-tracking-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Quản lý phiên bản dữ liệu” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of data versioning?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about data versioning should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-05-mlops-tracking-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Quản lý phiên bản dữ liệu / Data versioning

Dữ liệu thay đổi có thể làm kết quả mô hình thay đổi dù mã nguồn giữ nguyên. Ghi nguồn, phiên bản và các bước biến đổi để tái tạo tập dữ liệu.

## Thực hành

Ghi phiên bản dữ liệu và mô tả thay đổi giữa hai lần chuẩn bị.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Ghi tham số, thước đo, đường dẫn kết quả và commit cho hai lần chạy rồi so sánh bằng bảng.
