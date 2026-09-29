---
lesson_id: phase-01-python-software-data-files-2
phase_id: phase-01-python-software
module_id: data-files
title_vi: Parquet và columnar data
title_en: Parquet and columnar data
summary_vi: Học Parquet và columnar data qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Parquet and columnar data through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích parquet và columnar data bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng parquet và columnar data.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain parquet and columnar data with a concrete example.
- Write or adapt a small code example applying parquet and columnar data.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-data-files-1
- phase-00-onboarding-environment-1
key_terms:
- parquet
- columnar
- data
- Python
- testing
- debugging
- maintainability
- data-files
concept_notes_vi: Parquet và columnar data là khái niệm của module data-files. Hãy xác định input, output, giả định, failure
  mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Parquet và columnar data is a concept in the data-files module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Đọc và ghi dữ liệu có schema, xử lý thiếu dữ liệu và tạo CLI có input/output kiểm tra được.
why_it_matters_en: Read and write data with schemas, handle missing values, and create CLIs with inspectable inputs and outputs.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đọc và ghi dữ liệu có schema, xử lý thiếu dữ liệu và tạo CLI có input/output kiểm tra
  được.'
- Mở Python Standard Library, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Xây pipeline CSV/JSON nhỏ: validate schema, báo dòng lỗi, tạo output sạch và chạy lại được từ terminal.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Read and write data with schemas, handle missing values, and create CLIs with inspectable
  inputs and outputs.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Build a small CSV/JSON pipeline that validates schema, reports bad rows, writes clean output,
  and reruns from a terminal.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Xây pipeline CSV/JSON nhỏ: validate schema, báo dòng lỗi, tạo output sạch và chạy lại được từ terminal.'
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn biết dữ liệu nào được giữ, loại bỏ hoặc sửa và có lý do cho từng quyết định.
    stretch: Viết thêm một failure test cho parquet và columnar data và giải thích kết quả.
  en:
    task: Build a small CSV/JSON pipeline that validates schema, reports bad rows, writes clean output, and reruns from a
      terminal.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which data is kept, dropped, or repaired and why each decision is safe.
    stretch: Add a failure test for parquet and columnar data and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích parquet và columnar data cho một đồng đội mới như thế nào?
  - Một assumption nào của parquet và columnar data có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain parquet and columnar data to a new teammate?
  - Which assumption behind parquet and columnar data could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Parquet and columnar data: inspect one complete path'
  code: "# Topic: Parquet and columnar data (phase-01-python-software-data-files-2)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của parquet và columnar data.
  purpose_en: Illustrate the input-to-output path for parquet and columnar data.
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
- exercise-1-data-files
review_item_ids:
- phase-01-python-software-data-files-2-recall
- phase-01-python-software-data-files-2-application
- phase-01-python-software-data-files-2-debug
- phase-01-python-software-data-files-2-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của parquet và columnar data.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng parquet và columnar data và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng parquet và columnar data.
- Đánh giá parquet và columnar data bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ parquet và columnar data mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-data-files-3
- phase-01-python-software-data-files-4
review_question_vi: Định nghĩa parquet và columnar data bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define parquet and columnar data in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng parquet và columnar data. Hãy liên
  hệ cụ thể với parquet và columnar data trong lesson phase-01-python-software-data-files-2.
review_answer_en: A strong answer names the input, transformation, output and the context where parquet and columnar data
  is used. Relate it specifically to parquet and columnar data in lesson phase-01-python-software-data-files-2.
review_cards:
- id: phase-01-python-software-data-files-2-recall
  type: recall
  question_vi: Định nghĩa parquet và columnar data bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define parquet and columnar data in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng parquet và columnar data.
  answer_en: A strong answer names the input, transformation, output and the context where parquet and columnar data is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-data-files-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng parquet và columnar data cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies parquet and columnar data to an AI engineering problem.
  answer_vi: Ví dụ cho parquet và columnar data cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-data-files-2).
  answer_en: The parquet and columnar data example should have an explicit input, expected output and a way to run or verify
    it (phase-01-python-software-data-files-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-data-files-2-debug
  type: debug
  question_vi: Nếu kết quả của parquet và columnar data sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If parquet and columnar data produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với parquet và columnar data, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-01-python-software-data-files-2).
  answer_en: For parquet and columnar data, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-01-python-software-data-files-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-data-files-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của parquet và columnar data như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of parquet and columnar data?
  answer_vi: Câu trả lời về parquet và columnar data cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-01-python-software-data-files-2).
  answer_en: The answer about parquet and columnar data should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-01-python-software-data-files-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Parquet và columnar data / Parquet and columnar data

Parquet và columnar data là khái niệm của module data-files. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Xây pipeline CSV/JSON nhỏ: validate schema, báo dòng lỗi, tạo output sạch và chạy lại được từ terminal.
