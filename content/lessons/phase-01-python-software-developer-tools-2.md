---
lesson_id: phase-01-python-software-developer-tools-2
phase_id: phase-01-python-software
module_id: developer-tools
title_vi: Branch và pull request
title_en: Branches and pull requests
summary_vi: Học Branch và pull request qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Branches and pull requests through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích branch và pull request bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng branch và pull request.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain branches and pull requests with a concrete example.
- Write or adapt a small code example applying branches and pull requests.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-developer-tools-1
- phase-00-onboarding-environment-1
key_terms:
- branch
- pull
- request
- Python
- testing
- debugging
- maintainability
- developer-tools
concept_notes_vi: 'Branch và pull request giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và
  cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ
  nghĩa.'
concept_notes_en: 'Branch và pull request makes AI engineering work traceable: every change needs a diff, a reason, and a
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
    stretch: Viết thêm một failure test cho branch và pull request và giải thích kết quả.
  en:
    task: Create a branch, inspect a diff, call an API, save its response, and write a commit message that matches the change.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recover an earlier state and explain a change from its diff instead of saying only that it was fixed.
    stretch: Add a failure test for branches and pull requests and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích branch và pull request cho một đồng đội mới như thế nào?
  - Một assumption nào của branch và pull request có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain branches and pull requests to a new teammate?
  - Which assumption behind branches and pull requests could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Branches and pull requests: inspect one complete path'
  code: "# Topic: Branches and pull requests (phase-01-python-software-developer-tools-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của branch và pull request.
  purpose_en: Illustrate the input-to-output path for branches and pull requests.
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
- phase-01-python-software-developer-tools-2-recall
- phase-01-python-software-developer-tools-2-application
- phase-01-python-software-developer-tools-2-debug
- phase-01-python-software-developer-tools-2-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của branch và pull request.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng branch và pull request và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng branch và pull request.
- Đánh giá branch và pull request bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ branch và pull request mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-developer-tools-3
- phase-01-python-software-developer-tools-4
review_question_vi: Định nghĩa branch và pull request bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define branches and pull requests in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng branch và pull request. Hãy liên
  hệ cụ thể với branch và pull request trong lesson phase-01-python-software-developer-tools-2.
review_answer_en: A strong answer names the input, transformation, output and the context where branches and pull requests
  is used. Relate it specifically to branches and pull requests in lesson phase-01-python-software-developer-tools-2.
review_cards:
- id: phase-01-python-software-developer-tools-2-recall
  type: recall
  question_vi: Định nghĩa branch và pull request bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define branches and pull requests in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng branch và pull request.
  answer_en: A strong answer names the input, transformation, output and the context where branches and pull requests is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-developer-tools-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng branch và pull request cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies branches and pull requests to an AI engineering problem.
  answer_vi: Ví dụ cho branch và pull request cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-developer-tools-2).
  answer_en: The branches and pull requests example should have an explicit input, expected output and a way to run or verify
    it (phase-01-python-software-developer-tools-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-developer-tools-2-debug
  type: debug
  question_vi: Nếu kết quả của branch và pull request sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If branches and pull requests produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với branch và pull request, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-01-python-software-developer-tools-2).
  answer_en: For branches and pull requests, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-01-python-software-developer-tools-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-developer-tools-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của branch và pull request như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of branches and pull requests?
  answer_vi: Câu trả lời về branch và pull request cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-01-python-software-developer-tools-2).
  answer_en: The answer about branches and pull requests should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-01-python-software-developer-tools-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Branch và pull request / Branches and pull requests

Branch và pull request giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ nghĩa.

## Practice

Tạo branch, xem diff, gọi một API, lưu response và viết commit message mô tả đúng thay đổi.
