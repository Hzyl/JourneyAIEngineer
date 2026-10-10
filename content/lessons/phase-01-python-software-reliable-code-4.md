---
lesson_id: phase-01-python-software-reliable-code-4
phase_id: phase-01-python-software
module_id: reliable-code
title_vi: Kiểm thử bằng pytest và xác định phạm vi kiểm thử
title_en: pytest and test boundaries
summary_vi: Một kiểm thử nên kiểm tra hành vi quan sát được của hàm hoặc thành phần.
summary_en: Learn pytest and test boundaries through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain pytest and test boundaries with a concrete example.
- Write or adapt a small code example applying pytest and test boundaries.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-reliable-code-3
- phase-00-onboarding-environment-1
key_terms:
- pytest
- test
- boundary
- Python
- testing
- debugging
- maintainability
- reliable-code
concept_notes_vi: Một kiểm thử nên kiểm tra hành vi quan sát được của hàm hoặc thành phần. Kết quả mong đợi cần
  độc lập với cách cài đặt; thêm trường hợp biên giúp phát hiện lỗi mà dữ liệu thông thường bỏ sót.
concept_notes_en: pytest và test boundary is a Software Engineering skill for turning an idea into code that can
  be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing.
  In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Chia trách nhiệm rõ, xử lý ngoại lệ và ghi nhật ký để mã dễ kiểm tra, bảo trì.
why_it_matters_en: Turn working code into reliable code with module boundaries, logging, exceptions, and explicit
  test boundaries.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “pytest and test boundaries” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.
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
    task: 'Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.


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
    stretch: Add a failure test for pytest and test boundaries and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kiểm thử bằng pytest và xác định phạm vi kiểm thử” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain pytest and test boundaries to a new teammate?
  - Which assumption behind pytest and test boundaries could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'pytest and test boundaries: inspect one complete path'
  code: "# Topic: pytest and test boundaries (phase-01-python-software-reliable-code-4)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for pytest and test boundaries.
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
- title: pytest Getting Started
  url: https://docs.pytest.org/en/stable/getting-started.html
  language: en
  purpose_vi: Viết kiểm thử dễ đọc và chạy được từ terminal.
  read_vi: Đọc cách pytest tìm kiểm thử, sử dụng assert và tạo fixture cơ bản.
  purpose_en: Write readable tests that run from a terminal.
  read_en: Read test discovery, assertions, and basic fixtures.
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
- phase-01-python-software-reliable-code-4-recall
- phase-01-python-software-reliable-code-4-application
- phase-01-python-software-reliable-code-4-debug
- phase-01-python-software-reliable-code-4-interview
estimated_minutes: 45
completion_checklist:
- Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân.
common_mistakes:
- Sửa nhiều chỗ cùng lúc mà chưa cô lập được lỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-data-files-1
- phase-01-python-software-data-files-2
review_question_vi: Nội dung cốt lõi của “Kiểm thử bằng pytest và xác định phạm vi kiểm thử” là gì?
review_question_en: Define pytest and test boundaries in your own words. What are the input, transformation and
  output?
review_answer_vi: Một kiểm thử nên kiểm tra hành vi quan sát được của hàm hoặc thành phần. Kết quả mong đợi cần
  độc lập với cách cài đặt; thêm trường hợp biên giúp phát hiện lỗi mà dữ liệu thông thường bỏ sót.
review_answer_en: A strong answer names the input, transformation, output and the context where pytest and test
  boundaries is used. Relate it specifically to pytest and test boundaries in lesson phase-01-python-software-reliable-code-4.
review_cards:
- id: phase-01-python-software-reliable-code-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kiểm thử bằng pytest và xác định phạm vi kiểm thử” là gì?
  question_en: Define pytest and test boundaries in your own words. What are the input, transformation and output?
  answer_vi: Một kiểm thử nên kiểm tra hành vi quan sát được của hàm hoặc thành phần. Kết quả mong đợi cần độc lập
    với cách cài đặt; thêm trường hợp biên giúp phát hiện lỗi mà dữ liệu thông thường bỏ sót.
  answer_en: A strong answer names the input, transformation, output and the context where pytest and test boundaries
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-reliable-code-4-application
  type: application
  question_vi: Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.
  question_en: Write a small code example or design that applies pytest and test boundaries to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ”, cần
    lưu: ví dụ tái hiện, cách xử lý và kiểm thử cho lỗi đã chọn. Chạy kiểm thử trước và sau khi sửa để xác nhận
    nguyên nhân.'
  answer_en: The pytest and test boundaries example should have an explicit input, expected output and a way to
    run or verify it (phase-01-python-software-reliable-code-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-reliable-code-4-debug
  type: debug
  question_vi: Khi làm bài “Kiểm thử bằng pytest và xác định phạm vi kiểm thử”, bạn cần tránh lỗi nào và kiểm tra
    lại ra sao?
  question_en: If pytest and test boundaries produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Kiểm thử bằng pytest và xác định phạm vi kiểm thử”, lỗi cần tránh là: sửa nhiều chỗ cùng
    lúc mà chưa cô lập được lỗi. Chạy kiểm thử trước và sau khi sửa để xác nhận nguyên nhân. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For pytest and test boundaries, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-01-python-software-reliable-code-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-reliable-code-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kiểm thử bằng pytest và xác định phạm vi kiểm thử” để giải thích cách
    làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of pytest and test boundaries?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about pytest and test boundaries should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-01-python-software-reliable-code-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiểm thử bằng pytest và xác định phạm vi kiểm thử / pytest and test boundaries

Một kiểm thử nên kiểm tra hành vi quan sát được của hàm hoặc thành phần. Kết quả mong đợi cần độc lập với cách cài đặt; thêm trường hợp biên giúp phát hiện lỗi mà dữ liệu thông thường bỏ sót.

## Thực hành

Viết kiểm thử cho trường hợp thông thường, dữ liệu rỗng và đầu vào không hợp lệ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo một lỗi có kiểm soát, ghi giả thuyết, dùng nhật ký hoặc trình gỡ lỗi tìm nguyên nhân rồi thêm kiểm thử hồi quy.
