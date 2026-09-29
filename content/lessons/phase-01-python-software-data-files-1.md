---
lesson_id: phase-01-python-software-data-files-1
phase_id: phase-01-python-software
module_id: data-files
title_vi: CSV và JSON
title_en: CSV and JSON
summary_vi: Học CSV và JSON qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn CSV and JSON through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích csv và json bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng csv và json.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain csv and json with a concrete example.
- Write or adapt a small code example applying csv and json.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-reliable-code-4
- phase-00-onboarding-environment-1
key_terms:
- csv
- json
- Python
- testing
- debugging
- maintainability
- data-files
concept_notes_vi: CSV và JSON mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code,
  timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai
  kiểu.
concept_notes_en: CSV và JSON describes a boundary between data and a service. A sound request has a schema, validation, status
  code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and tests empty or malformed
  data.
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
    stretch: Viết thêm một failure test cho csv và json và giải thích kết quả.
  en:
    task: Build a small CSV/JSON pipeline that validates schema, reports bad rows, writes clean output, and reruns from a
      terminal.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which data is kept, dropped, or repaired and why each decision is safe.
    stretch: Add a failure test for csv and json and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích csv và json cho một đồng đội mới như thế nào?
  - Một assumption nào của csv và json có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain csv and json to a new teammate?
  - Which assumption behind csv and json could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'CSV and JSON: inspect one complete path'
  code: "# Topic: CSV and JSON (phase-01-python-software-data-files-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của csv và json.
  purpose_en: Illustrate the input-to-output path for csv and json.
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
- title: Python CSV and JSON
  url: https://docs.python.org/3/library/csv.html
  language: en
  purpose_vi: Đọc/ghi dữ liệu tabular và cấu trúc với thư viện chuẩn.
  read_vi: Đọc dialect, DictReader/DictWriter và kiểm tra encoding.
  purpose_en: Read and write tabular and structured data with the standard library.
  read_en: Focus on dialects, DictReader/DictWriter, and encoding.
  kind: official
  required: true
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
- phase-01-python-software-data-files-1-recall
- phase-01-python-software-data-files-1-application
- phase-01-python-software-data-files-1-debug
- phase-01-python-software-data-files-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của csv và json.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng csv và json và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng csv và json.
- Đánh giá csv và json bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ csv và json mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-data-files-2
- phase-01-python-software-data-files-3
review_question_vi: Định nghĩa csv và json bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define csv and json in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng csv và json. Hãy liên hệ cụ thể
  với csv và json trong lesson phase-01-python-software-data-files-1.
review_answer_en: A strong answer names the input, transformation, output and the context where csv and json is used. Relate
  it specifically to csv and json in lesson phase-01-python-software-data-files-1.
review_cards:
- id: phase-01-python-software-data-files-1-recall
  type: recall
  question_vi: Định nghĩa csv và json bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define csv and json in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng csv và json.
  answer_en: A strong answer names the input, transformation, output and the context where csv and json is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-data-files-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng csv và json cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies csv and json to an AI engineering problem.
  answer_vi: Ví dụ cho csv và json cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-data-files-1).
  answer_en: The csv and json example should have an explicit input, expected output and a way to run or verify it (phase-01-python-software-data-files-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-data-files-1-debug
  type: debug
  question_vi: Nếu kết quả của csv và json sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If csv and json produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với csv và json, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ và error
    analysis (phase-01-python-software-data-files-1).
  answer_en: For csv and json, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with a
    small test and error analysis (phase-01-python-software-data-files-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-data-files-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của csv và json như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of csv and json?
  answer_vi: Câu trả lời về csv và json cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production (phase-01-python-software-data-files-1).
  answer_en: The answer about csv and json should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-01-python-software-data-files-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# CSV và JSON / CSV and JSON

CSV và JSON mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.

## Practice

Xây pipeline CSV/JSON nhỏ: validate schema, báo dòng lỗi, tạo output sạch và chạy lại được từ terminal.
