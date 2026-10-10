---
lesson_id: phase-04-deep-learning-debugging-4
phase_id: phase-04-deep-learning
module_id: debugging
title_vi: Ghi lại thí nghiệm
title_en: Experiment logging
summary_vi: Nhật ký thí nghiệm cần gắn kết quả với cấu hình, dữ liệu và phiên bản mã nguồn.
summary_en: Learn Experiment logging through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.
- Tìm bước đầu tiên lệch khỏi kết quả dự kiến.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain experiment logging with a concrete example.
- Write or adapt a small code example applying experiment logging.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-debugging-3
- phase-03-classical-ml-ml-framing-1
key_terms:
- experiment
- logging
- PyTorch
- tensor
- loss
- training
- debugging
concept_notes_vi: Nhật ký thí nghiệm cần gắn kết quả với cấu hình, dữ liệu và phiên bản mã nguồn. Nhờ vậy bạn có
  thể so sánh và tái hiện kết quả thay vì giữ biểu đồ không rõ nguồn.
concept_notes_en: Experiment logging is a Software Engineering skill for turning an idea into code that can be read,
  tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python,
  small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Dùng bằng chứng để tìm lỗi kích thước, NaN, bộ nhớ GPU và so sánh thí nghiệm.
why_it_matters_en: Debug shape errors, NaNs, GPU memory, and experiment tracking with contextual logs.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Experiment logging” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.
- Tìm bước đầu tiên lệch khỏi kết quả dự kiến. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Debug shape errors, NaNs, GPU memory, and experiment tracking with contextual
  logs.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create one failure at a time and record its symptom, hypothesis, smallest reproduction,
  and fix with run metadata.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo từng lỗi có kiểm soát, ghi biểu
      hiện, giả thuyết, ví dụ tái hiện tối thiểu và cách sửa; lưu cấu hình lần chạy.'
    deliverables:
    - Ví dụ tái hiện nhỏ, dấu hiệu lỗi và phép kiểm tra giả thuyết
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Tìm bước đầu tiên lệch khỏi kết quả dự kiến.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create one failure at a time and record its symptom, hypothesis, smallest reproduction, and fix with run
      metadata.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You do not blindly lower the learning rate for NaNs; you find the cause first.
    stretch: Add a failure test for experiment logging and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Ghi lại thí nghiệm” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain experiment logging to a new teammate?
  - Which assumption behind experiment logging could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Experiment logging: inspect one complete path'
  code: "# Topic: Experiment logging (phase-04-deep-learning-debugging-4)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for experiment logging.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
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
- exercise-4-debugging
review_item_ids:
- phase-04-deep-learning-debugging-4-recall
- phase-04-deep-learning-debugging-4-application
- phase-04-deep-learning-debugging-4-debug
- phase-04-deep-learning-debugging-4-interview
estimated_minutes: 60
completion_checklist:
- Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.
- Tìm bước đầu tiên lệch khỏi kết quả dự kiến.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Tìm bước đầu tiên lệch khỏi kết quả dự kiến.
common_mistakes:
- Tăng bộ nhớ hoặc đổi mô hình trước khi xác định bước gây lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-05-mlops-api-1
- phase-05-mlops-api-2
review_question_vi: Nội dung cốt lõi của “Ghi lại thí nghiệm” là gì?
review_question_en: Define experiment logging in your own words. What are the input, transformation and output?
review_answer_vi: Nhật ký thí nghiệm cần gắn kết quả với cấu hình, dữ liệu và phiên bản mã nguồn. Nhờ vậy bạn có
  thể so sánh và tái hiện kết quả thay vì giữ biểu đồ không rõ nguồn.
review_answer_en: A strong answer names the input, transformation, output and the context where experiment logging
  is used. Relate it specifically to experiment logging in lesson phase-04-deep-learning-debugging-4.
review_cards:
- id: phase-04-deep-learning-debugging-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Ghi lại thí nghiệm” là gì?
  question_en: Define experiment logging in your own words. What are the input, transformation and output?
  answer_vi: Nhật ký thí nghiệm cần gắn kết quả với cấu hình, dữ liệu và phiên bản mã nguồn. Nhờ vậy bạn có thể
    so sánh và tái hiện kết quả thay vì giữ biểu đồ không rõ nguồn.
  answer_en: A strong answer names the input, transformation, output and the context where experiment logging is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-debugging-4-application
  type: application
  question_vi: Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.
  question_en: Write a small code example or design that applies experiment logging to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh”, cần lưu: ví
    dụ tái hiện nhỏ, dấu hiệu lỗi và phép kiểm tra giả thuyết. Tìm bước đầu tiên lệch khỏi kết quả dự kiến.'
  answer_en: The experiment logging example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-debugging-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-debugging-4-debug
  type: debug
  question_vi: Khi làm bài “Ghi lại thí nghiệm”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If experiment logging produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Ghi lại thí nghiệm”, lỗi cần tránh là: tăng bộ nhớ hoặc đổi mô hình trước khi xác định
    bước gây lỗi. Tìm bước đầu tiên lệch khỏi kết quả dự kiến. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác
    dự kiến.'
  answer_en: For experiment logging, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-04-deep-learning-debugging-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-debugging-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Ghi lại thí nghiệm” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of experiment logging?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about experiment logging should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-04-deep-learning-debugging-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Ghi lại thí nghiệm / Experiment logging

Nhật ký thí nghiệm cần gắn kết quả với cấu hình, dữ liệu và phiên bản mã nguồn. Nhờ vậy bạn có thể so sánh và tái hiện kết quả thay vì giữ biểu đồ không rõ nguồn.

## Thực hành

Ghi tham số, thước đo và phiên bản dữ liệu của hai lần chạy để so sánh.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo từng lỗi có kiểm soát, ghi biểu hiện, giả thuyết, ví dụ tái hiện tối thiểu và cách sửa; lưu cấu hình lần chạy.
