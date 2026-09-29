---
lesson_id: phase-01-python-software-sql-structures-3
phase_id: phase-01-python-software
module_id: sql-structures
title_vi: List, dict, set và queue
title_en: Lists, dicts, sets and queues
summary_vi: Học List, dict, set và queue qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Lists, dicts, sets and queues through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích list, dict, set và queue bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng list, dict, set và queue.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain lists, dicts, sets and queues with a concrete example.
- Write or adapt a small code example applying lists, dicts, sets and queues.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-sql-structures-2
- phase-00-onboarding-environment-1
key_terms:
- list
- dict
- set
- queue
- Python
- testing
- debugging
- maintainability
- sql-structures
concept_notes_vi: List, dict, set và queue là khái niệm của module sql-structures. Hãy xác định input, output, giả định, failure
  mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: List, dict, set và queue is a concept in the sql-structures module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: 'Tư duy dữ liệu có cấu trúc: query đúng, hiểu quan hệ và cân nhắc chi phí thuật toán.'
why_it_matters_en: 'Develop structured-data thinking: write correct queries, understand relations, and reason about algorithmic
  cost.'
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Tư duy dữ liệu có cấu trúc: query đúng, hiểu quan hệ và cân nhắc chi phí thuật toán.'
- Mở Python Standard Library, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo database nhỏ cho learning log, viết query tổng hợp tuần và so sánh hai cách truy vấn trên cùng dữ
  liệu.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Develop structured-data thinking: write correct queries, understand relations, and reason
  about algorithmic cost.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a small learning-log database, write weekly aggregates, and compare two queries over
  the same data.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo database nhỏ cho learning log, viết query tổng hợp tuần và so sánh hai cách truy vấn trên cùng dữ liệu.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được grain của bảng, khóa liên kết, kết quả JOIN và độ phức tạp của cấu trúc dữ liệu.
    stretch: Viết thêm một failure test cho list, dict, set và queue và giải thích kết quả.
  en:
    task: Create a small learning-log database, write weekly aggregates, and compare two queries over the same data.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain table grain, keys, JOIN results, and the complexity of the chosen data structure.
    stretch: Add a failure test for lists, dicts, sets and queues and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích list, dict, set và queue cho một đồng đội mới như thế nào?
  - Một assumption nào của list, dict, set và queue có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain lists, dicts, sets and queues to a new teammate?
  - Which assumption behind lists, dicts, sets and queues could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Lists, dicts, sets and queues: inspect one complete path'
  code: "# Topic: Lists, dicts, sets and queues (phase-01-python-software-sql-structures-3)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của list, dict, set và queue.
  purpose_en: Illustrate the input-to-output path for lists, dicts, sets and queues.
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
- exercise-1-sql-structures
review_item_ids:
- phase-01-python-software-sql-structures-3-recall
- phase-01-python-software-sql-structures-3-application
- phase-01-python-software-sql-structures-3-debug
- phase-01-python-software-sql-structures-3-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của list, dict, set và queue.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng list, dict, set và queue và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng list, dict, set và queue.
- Đánh giá list, dict, set và queue bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ list, dict, set và queue mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-sql-structures-4
- phase-02-math-ml-linear-algebra-1
review_question_vi: Định nghĩa list, dict, set và queue bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define lists, dicts, sets and queues in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng list, dict, set và queue. Hãy liên
  hệ cụ thể với list, dict, set và queue trong lesson phase-01-python-software-sql-structures-3.
review_answer_en: A strong answer names the input, transformation, output and the context where lists, dicts, sets and queues
  is used. Relate it specifically to lists, dicts, sets and queues in lesson phase-01-python-software-sql-structures-3.
review_cards:
- id: phase-01-python-software-sql-structures-3-recall
  type: recall
  question_vi: Định nghĩa list, dict, set và queue bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define lists, dicts, sets and queues in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng list, dict, set và queue.
  answer_en: A strong answer names the input, transformation, output and the context where lists, dicts, sets and queues is
    used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-sql-structures-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng list, dict, set và queue cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies lists, dicts, sets and queues to an AI engineering problem.
  answer_vi: Ví dụ cho list, dict, set và queue cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-sql-structures-3).
  answer_en: The lists, dicts, sets and queues example should have an explicit input, expected output and a way to run or
    verify it (phase-01-python-software-sql-structures-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-sql-structures-3-debug
  type: debug
  question_vi: Nếu kết quả của list, dict, set và queue sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If lists, dicts, sets and queues produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với list, dict, set và queue, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-01-python-software-sql-structures-3).
  answer_en: For lists, dicts, sets and queues, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-01-python-software-sql-structures-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-sql-structures-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của list, dict, set và queue như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of lists, dicts, sets and queues?
  answer_vi: Câu trả lời về list, dict, set và queue cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-01-python-software-sql-structures-3).
  answer_en: The answer about lists, dicts, sets and queues should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-01-python-software-sql-structures-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# List, dict, set và queue / Lists, dicts, sets and queues

List, dict, set và queue là khái niệm của module sql-structures. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Tạo database nhỏ cho learning log, viết query tổng hợp tuần và so sánh hai cách truy vấn trên cùng dữ liệu.
