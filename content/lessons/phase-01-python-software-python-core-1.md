---
lesson_id: phase-01-python-software-python-core-1
phase_id: phase-01-python-software
module_id: python-core
title_vi: Kiểu dữ liệu và biến
title_en: Data types and variables
summary_vi: Học Kiểu dữ liệu và biến qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Data types and variables through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích kiểu dữ liệu và biến bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng kiểu dữ liệu và biến.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain data types and variables with a concrete example.
- Write or adapt a small code example applying data types and variables.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-learning-system-4
- phase-00-onboarding-environment-1
key_terms:
- kiểu
- liệu
- biến
- Python
- testing
- debugging
- maintainability
- python-core
concept_notes_vi: Kiểu dữ liệu và biến là khái niệm của module python-core. Hãy xác định input, output, giả định, failure
  mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Kiểu dữ liệu và biến is a concept in the python-core module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Nắm Python đủ chắc để đọc code AI, viết hàm nhỏ có kiểm thử và không phụ thuộc vào notebook.
why_it_matters_en: Build enough Python fluency to read AI code, write small tested functions, and work beyond notebooks.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Nắm Python đủ chắc để đọc code AI, viết hàm nhỏ có kiểm thử và không phụ thuộc vào notebook.'
- Mở Python Standard Library, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết một package nhỏ có hàm thuần, type hint, xử lý input xấu và test cho cả happy path lẫn edge case.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Build enough Python fluency to read AI code, write small tested functions, and work
  beyond notebooks.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a small package with pure functions, type hints, invalid-input handling, and happy-path
  plus edge-case tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết một package nhỏ có hàm thuần, type hint, xử lý input xấu và test cho cả happy path lẫn edge case.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn có thể giải thích từng dòng quan trọng và sửa yêu cầu mới mà không copy nguyên tutorial.
    stretch: Viết thêm một failure test cho kiểu dữ liệu và biến và giải thích kết quả.
  en:
    task: Write a small package with pure functions, type hints, invalid-input handling, and happy-path plus edge-case tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain the important lines and change a requirement without copying a tutorial wholesale.
    stretch: Add a failure test for data types and variables and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích kiểu dữ liệu và biến cho một đồng đội mới như thế nào?
  - Một assumption nào của kiểu dữ liệu và biến có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain data types and variables to a new teammate?
  - Which assumption behind data types and variables could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Data types and variables: inspect one complete path'
  code: "# Topic: Data types and variables (phase-01-python-software-python-core-1)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của kiểu dữ liệu và biến.
  purpose_en: Illustrate the input-to-output path for data types and variables.
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
- exercise-1-python-core
review_item_ids:
- phase-01-python-software-python-core-1-recall
- phase-01-python-software-python-core-1-application
- phase-01-python-software-python-core-1-debug
- phase-01-python-software-python-core-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của kiểu dữ liệu và biến.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng kiểu dữ liệu và biến và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng kiểu dữ liệu và biến.
- Đánh giá kiểu dữ liệu và biến bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ kiểu dữ liệu và biến mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-python-core-2
- phase-01-python-software-python-core-3
review_question_vi: Định nghĩa kiểu dữ liệu và biến bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define data types and variables in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng kiểu dữ liệu và biến. Hãy liên
  hệ cụ thể với kiểu dữ liệu và biến trong lesson phase-01-python-software-python-core-1.
review_answer_en: A strong answer names the input, transformation, output and the context where data types and variables is
  used. Relate it specifically to data types and variables in lesson phase-01-python-software-python-core-1.
review_cards:
- id: phase-01-python-software-python-core-1-recall
  type: recall
  question_vi: Định nghĩa kiểu dữ liệu và biến bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define data types and variables in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng kiểu dữ liệu và biến.
  answer_en: A strong answer names the input, transformation, output and the context where data types and variables is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-python-core-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng kiểu dữ liệu và biến cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies data types and variables to an AI engineering problem.
  answer_vi: Ví dụ cho kiểu dữ liệu và biến cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-python-core-1).
  answer_en: The data types and variables example should have an explicit input, expected output and a way to run or verify
    it (phase-01-python-software-python-core-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-python-core-1-debug
  type: debug
  question_vi: Nếu kết quả của kiểu dữ liệu và biến sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If data types and variables produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với kiểu dữ liệu và biến, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-01-python-software-python-core-1).
  answer_en: For data types and variables, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-01-python-software-python-core-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-python-core-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của kiểu dữ liệu và biến như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of data types and variables?
  answer_vi: Câu trả lời về kiểu dữ liệu và biến cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-01-python-software-python-core-1).
  answer_en: The answer about data types and variables should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-01-python-software-python-core-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kiểu dữ liệu và biến / Data types and variables

Kiểu dữ liệu và biến là khái niệm của module python-core. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Viết một package nhỏ có hàm thuần, type hint, xử lý input xấu và test cho cả happy path lẫn edge case.
