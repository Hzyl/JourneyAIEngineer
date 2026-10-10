---
lesson_id: phase-01-python-software-reliable-code-2
phase_id: phase-01-python-software
module_id: reliable-code
title_vi: Xử lý ngoại lệ và ghi nhật ký
title_en: Exceptions and logging
summary_vi: Ngoại lệ báo một thao tác không hoàn thành bình thường.
summary_en: Learn Exceptions and logging through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain exceptions and logging with a concrete example.
- Write or adapt a small code example applying exceptions and logging.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-reliable-code-1
- phase-00-onboarding-environment-1
key_terms:
- exception
- logging
- inference
- observability
- reproducibility
- deployment
- reliable-code
concept_notes_vi: Ngoại lệ báo một thao tác không hoàn thành bình thường. Chỉ bắt lỗi ở nơi có thể xử lý hoặc bổ
  sung ngữ cảnh; nhật ký cần đủ thông tin chẩn đoán mà không lộ dữ liệu nhạy cảm.
concept_notes_en: Exception và logging is a Software Engineering skill for turning an idea into code that can be
  read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In
  Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Chia trách nhiệm rõ, xử lý ngoại lệ và ghi nhật ký để mã dễ kiểm tra, bảo trì.
why_it_matters_en: Turn working code into reliable code with module boundaries, logging, exceptions, and explicit
  test boundaries.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Exceptions and logging” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Turn working code into reliable code with module boundaries, logging, exceptions,
  and explicit test boundaries.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Introduce a failure, write a hypothesis, use logs or a debugger to find the cause,
  then add a regression test.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo một lỗi có kiểm soát, ghi giả thuyết,
      dùng nhật ký hoặc trình gỡ lỗi tìm nguyên nhân rồi thêm kiểm thử hồi quy.'
    deliverables:
    - Ví dụ tái hiện, cách xử lý và kiểm thử cho lỗi đã chọn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Introduce a failure, write a hypothesis, use logs or a debugger to find the cause, then add a regression
      test.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish input, logic, and environment failures and know which test prevents a regression.
    stretch: Add a failure test for exceptions and logging and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xử lý ngoại lệ và ghi nhật ký” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain exceptions and logging to a new teammate?
  - Which assumption behind exceptions and logging could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Exceptions and logging: inspect one complete path'
  code: "# Topic: Exceptions and logging (phase-01-python-software-reliable-code-2)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for exceptions and logging.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Python Standard Library
  url: https://docs.python.org/3/library/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: pytest Documentation
  url: https://docs.pytest.org/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SQLite Documentation
  url: https://www.sqlite.org/docs.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
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
- exercise-1-reliable-code
review_item_ids:
- phase-01-python-software-reliable-code-2-recall
- phase-01-python-software-reliable-code-2-application
- phase-01-python-software-reliable-code-2-debug
- phase-01-python-software-reliable-code-2-interview
estimated_minutes: 45
completion_checklist:
- Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
common_mistakes:
- Sửa nhiều chỗ cùng lúc mà chưa cô lập được lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-reliable-code-3
- phase-01-python-software-reliable-code-4
review_question_vi: Nội dung cốt lõi của “Xử lý ngoại lệ và ghi nhật ký” là gì?
review_question_en: Define exceptions and logging in your own words. What are the input, transformation and output?
review_answer_vi: Ngoại lệ báo một thao tác không hoàn thành bình thường. Chỉ bắt lỗi ở nơi có thể xử lý hoặc bổ
  sung ngữ cảnh; nhật ký cần đủ thông tin chẩn đoán mà không lộ dữ liệu nhạy cảm.
review_answer_en: A strong answer names the input, transformation, output and the context where exceptions and logging
  is used. Relate it specifically to exceptions and logging in lesson phase-01-python-software-reliable-code-2.
review_cards:
- id: phase-01-python-software-reliable-code-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xử lý ngoại lệ và ghi nhật ký” là gì?
  question_en: Define exceptions and logging in your own words. What are the input, transformation and output?
  answer_vi: Ngoại lệ báo một thao tác không hoàn thành bình thường. Chỉ bắt lỗi ở nơi có thể xử lý hoặc bổ sung
    ngữ cảnh; nhật ký cần đủ thông tin chẩn đoán mà không lộ dữ liệu nhạy cảm.
  answer_en: A strong answer names the input, transformation, output and the context where exceptions and logging
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-reliable-code-2-application
  type: application
  question_vi: Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.
  question_en: Write a small code example or design that applies exceptions and logging to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân”, cần lưu: ví dụ tái
    hiện, cách xử lý và kiểm thử cho lỗi đã chọn. Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.'
  answer_en: The exceptions and logging example should have an explicit input, expected output and a way to run
    or verify it (phase-01-python-software-reliable-code-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-reliable-code-2-debug
  type: debug
  question_vi: Khi làm bài “Xử lý ngoại lệ và ghi nhật ký”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If exceptions and logging produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Xử lý ngoại lệ và ghi nhật ký”, lỗi cần tránh là: sửa nhiều chỗ cùng lúc mà chưa cô lập
    được lỗi. Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân. Dùng ví dụ nhỏ để tìm bước đầu tiên có
    kết quả khác dự kiến.'
  answer_en: For exceptions and logging, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-01-python-software-reliable-code-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-reliable-code-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xử lý ngoại lệ và ghi nhật ký” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of exceptions and logging?
  answer_vi: Bắt đầu từ nhiệm vụ “Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about exceptions and logging should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-01-python-software-reliable-code-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xử lý ngoại lệ và ghi nhật ký / Exceptions and logging

Ngoại lệ báo một thao tác không hoàn thành bình thường. Chỉ bắt lỗi ở nơi có thể xử lý hoặc bổ sung ngữ cảnh; nhật ký cần đủ thông tin chẩn đoán mà không lộ dữ liệu nhạy cảm.

## Thực hành

Xử lý một lỗi dự kiến và ghi nhật ký đủ để tìm lại nguyên nhân.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo một lỗi có kiểm soát, ghi giả thuyết, dùng nhật ký hoặc trình gỡ lỗi tìm nguyên nhân rồi thêm kiểm thử hồi quy.
