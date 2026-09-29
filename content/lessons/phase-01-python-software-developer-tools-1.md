---
lesson_id: phase-01-python-software-developer-tools-1
phase_id: phase-01-python-software
module_id: developer-tools
title_vi: Git add, diff và commit
title_en: Git add, diff and commit
summary_vi: Học Git add, diff và commit qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn Git add, diff and commit through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích git add, diff và commit bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng git add, diff và commit.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain git add, diff and commit with a concrete example.
- Write or adapt a small code example applying git add, diff and commit.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-data-files-4
- phase-00-onboarding-environment-1
key_terms:
- git
- add
- diff
- commit
- Python
- testing
- debugging
- maintainability
- developer-tools
concept_notes_vi: 'Git add, diff và commit giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do
  và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit
  rõ nghĩa.'
concept_notes_en: 'Git add, diff và commit makes AI engineering work traceable: every change needs a diff, a reason, and a
  verification step. Practise in a small repository, introduce an intentional failure, read the terminal output, and fix it
  with a focused commit.'
why_it_matters_vi: Dùng Git, terminal và HTTP như công cụ hàng ngày để tái hiện, review và giao tiếp với hệ thống.
why_it_matters_en: Use Git, terminals, and HTTP as daily tools for reproduction, review, and system communication.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Dùng Git, terminal và HTTP như công cụ hàng ngày để tái hiện, review và giao tiếp với
  hệ thống.'
- Mở Python Standard Library, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo branch, xem diff, gọi một API, lưu response và viết commit message mô tả đúng thay đổi.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Use Git, terminals, and HTTP as daily tools for reproduction, review, and system communication.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a branch, inspect a diff, call an API, save its response, and write a commit message
  that matches the change.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo branch, xem diff, gọi một API, lưu response và viết commit message mô tả đúng thay đổi.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn có thể khôi phục trạng thái trước đó và giải thích một thay đổi bằng diff thay vì chỉ nói đã sửa.
    stretch: Viết thêm một failure test cho git add, diff và commit và giải thích kết quả.
  en:
    task: Create a branch, inspect a diff, call an API, save its response, and write a commit message that matches the change.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recover an earlier state and explain a change from its diff instead of saying only that it was fixed.
    stretch: Add a failure test for git add, diff and commit and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích git add, diff và commit cho một đồng đội mới như thế nào?
  - Một assumption nào của git add, diff và commit có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain git add, diff and commit to a new teammate?
  - Which assumption behind git add, diff and commit could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Git add, diff and commit: inspect one complete path'
  code: "# Topic: Git add, diff and commit (phase-01-python-software-developer-tools-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của git add, diff và commit.
  purpose_en: Illustrate the input-to-output path for git add, diff and commit.
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
- title: 'Git Book: Branching'
  url: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
  language: en
  purpose_vi: Hiểu branch, diff và commit trước khi đưa artifact lên GitHub.
  read_vi: Đọc branch, staging area và cách review diff trước push.
  purpose_en: Understand branches, diffs, and commits before publishing artifacts.
  read_en: Read branches, the staging area, and reviewing a diff before push.
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
- exercise-1-developer-tools
review_item_ids:
- phase-01-python-software-developer-tools-1-recall
- phase-01-python-software-developer-tools-1-application
- phase-01-python-software-developer-tools-1-debug
- phase-01-python-software-developer-tools-1-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của git add, diff và commit.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng git add, diff và commit và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng git add, diff và commit.
- Đánh giá git add, diff và commit bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ git add, diff và commit mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-developer-tools-2
- phase-01-python-software-developer-tools-3
review_question_vi: Định nghĩa git add, diff và commit bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define git add, diff and commit in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng git add, diff và commit. Hãy liên
  hệ cụ thể với git add, diff và commit trong lesson phase-01-python-software-developer-tools-1.
review_answer_en: A strong answer names the input, transformation, output and the context where git add, diff and commit is
  used. Relate it specifically to git add, diff and commit in lesson phase-01-python-software-developer-tools-1.
review_cards:
- id: phase-01-python-software-developer-tools-1-recall
  type: recall
  question_vi: Định nghĩa git add, diff và commit bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define git add, diff and commit in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng git add, diff và commit.
  answer_en: A strong answer names the input, transformation, output and the context where git add, diff and commit is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-developer-tools-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng git add, diff và commit cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies git add, diff and commit to an AI engineering problem.
  answer_vi: Ví dụ cho git add, diff và commit cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-developer-tools-1).
  answer_en: The git add, diff and commit example should have an explicit input, expected output and a way to run or verify
    it (phase-01-python-software-developer-tools-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-developer-tools-1-debug
  type: debug
  question_vi: Nếu kết quả của git add, diff và commit sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If git add, diff and commit produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với git add, diff và commit, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-01-python-software-developer-tools-1).
  answer_en: For git add, diff and commit, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-01-python-software-developer-tools-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-developer-tools-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của git add, diff và commit như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of git add, diff and commit?
  answer_vi: Câu trả lời về git add, diff và commit cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-01-python-software-developer-tools-1).
  answer_en: The answer about git add, diff and commit should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-01-python-software-developer-tools-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Git add, diff và commit / Git add, diff and commit

Git add, diff và commit giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ nghĩa.

## Practice

Tạo branch, xem diff, gọi một API, lưu response và viết commit message mô tả đúng thay đổi.
