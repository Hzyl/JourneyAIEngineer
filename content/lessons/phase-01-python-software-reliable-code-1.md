---
lesson_id: phase-01-python-software-reliable-code-1
phase_id: phase-01-python-software
module_id: reliable-code
title_vi: Module và package
title_en: Modules and packages
summary_vi: Học Module và package qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Modules and packages through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích module và package bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng module và package.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain modules and packages with a concrete example.
- Write or adapt a small code example applying modules and packages.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-python-core-4
- phase-00-onboarding-environment-1
key_terms:
- module
- package
- Python
- testing
- debugging
- maintainability
- reliable-code
concept_notes_vi: Module và package là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra
  và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ
  boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.
concept_notes_en: Module và package is a Software Engineering skill for turning an idea into code that can be read, tested,
  and maintained. Define the inputs, outputs, invariants, and failure modes before implementing. In Python, small boundaries
  make tests fast and tracebacks actionable.
why_it_matters_vi: Biến code chạy được thành code đáng tin bằng module boundary, logging, exception và test boundary rõ ràng.
why_it_matters_en: Turn working code into reliable code with module boundaries, logging, exceptions, and explicit test boundaries.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Biến code chạy được thành code đáng tin bằng module boundary, logging, exception và
  test boundary rõ ràng.'
- Mở Python Standard Library, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Cố tình tạo lỗi, ghi giả thuyết, dùng debugger/log để tìm nguyên nhân rồi viết regression test cho lỗi
  đó.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Turn working code into reliable code with module boundaries, logging, exceptions, and
  explicit test boundaries.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Introduce a failure, write a hypothesis, use logs or a debugger to find the cause, then add
  a regression test.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Cố tình tạo lỗi, ghi giả thuyết, dùng debugger/log để tìm nguyên nhân rồi viết regression test cho lỗi đó.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn phân biệt được lỗi do input, lỗi logic và lỗi môi trường, đồng thời biết test nào ngăn lỗi quay lại.
    stretch: Viết thêm một failure test cho module và package và giải thích kết quả.
  en:
    task: Introduce a failure, write a hypothesis, use logs or a debugger to find the cause, then add a regression test.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish input, logic, and environment failures and know which test prevents a regression.
    stretch: Add a failure test for modules and packages and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích module và package cho một đồng đội mới như thế nào?
  - Một assumption nào của module và package có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain modules and packages to a new teammate?
  - Which assumption behind modules and packages could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Modules and packages: inspect one complete path'
  code: "# Topic: Modules and packages (phase-01-python-software-reliable-code-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của module và package.
  purpose_en: Illustrate the input-to-output path for modules and packages.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Python Standard Library
  url: https://docs.python.org/3/library/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: pytest Documentation
  url: https://docs.pytest.org/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SQLite Documentation
  url: https://www.sqlite.org/docs.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Giải thích tiếng Việt và checklist của lesson
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
exercise_ids:
- exercise-1-reliable-code
review_item_ids:
- phase-01-python-software-reliable-code-1-recall
- phase-01-python-software-reliable-code-1-application
- phase-01-python-software-reliable-code-1-debug
- phase-01-python-software-reliable-code-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của module và package.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng module và package và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng module và package.
- Đánh giá module và package bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ module và package mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-reliable-code-2
- phase-01-python-software-reliable-code-3
review_question_vi: Định nghĩa module và package bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define modules and packages in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng module và package. Hãy liên hệ
  cụ thể với module và package trong lesson phase-01-python-software-reliable-code-1.
review_answer_en: A strong answer names the input, transformation, output and the context where modules and packages is used.
  Relate it specifically to modules and packages in lesson phase-01-python-software-reliable-code-1.
review_cards:
- id: phase-01-python-software-reliable-code-1-recall
  type: recall
  question_vi: Định nghĩa module và package bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define modules and packages in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng module và package.
  answer_en: A strong answer names the input, transformation, output and the context where modules and packages is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-reliable-code-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng module và package cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies modules and packages to an AI engineering problem.
  answer_vi: Ví dụ cho module và package cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-reliable-code-1).
  answer_en: The modules and packages example should have an explicit input, expected output and a way to run or verify it
    (phase-01-python-software-reliable-code-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-reliable-code-1-debug
  type: debug
  question_vi: Nếu kết quả của module và package sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If modules and packages produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với module và package, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-01-python-software-reliable-code-1).
  answer_en: For modules and packages, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-01-python-software-reliable-code-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-reliable-code-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của module và package như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of modules and packages?
  answer_vi: Câu trả lời về module và package cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-01-python-software-reliable-code-1).
  answer_en: The answer about modules and packages should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-01-python-software-reliable-code-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Module và package / Modules and packages

Module và package là một kỹ năng Software Engineering dùng để biến ý tưởng thành code có thể đọc, kiểm tra và bảo trì. Hãy xác định input, output, invariant và lỗi có thể xảy ra trước khi viết implementation. Trong Python, giữ boundary nhỏ giúp test nhanh và traceback chỉ ra đúng lớp lỗi.

## Practice

Cố tình tạo lỗi, ghi giả thuyết, dùng debugger/log để tìm nguyên nhân rồi viết regression test cho lỗi đó.
