---
lesson_id: phase-01-python-software-developer-tools-3
phase_id: phase-01-python-software
module_id: developer-tools
title_vi: Terminal PowerShell/Linux
title_en: PowerShell and Linux terminals
summary_vi: Học Terminal PowerShell/Linux qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge
  case.
summary_en: Learn PowerShell and Linux terminals through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích terminal powershell/linux bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng terminal powershell/linux.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain powershell and linux terminals with a concrete example.
- Write or adapt a small code example applying powershell and linux terminals.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-developer-tools-2
- phase-00-onboarding-environment-1
key_terms:
- terminal
- powershell
- linux
- Python
- testing
- debugging
- maintainability
- developer-tools
concept_notes_vi: 'Terminal PowerShell/Linux giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do
  và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit
  rõ nghĩa.'
concept_notes_en: 'Terminal PowerShell/Linux makes AI engineering work traceable: every change needs a diff, a reason, and
  a verification step. Practise in a small repository, introduce an intentional failure, read the terminal output, and fix
  it with a focused commit.'
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
    stretch: Viết thêm một failure test cho terminal powershell/linux và giải thích kết quả.
  en:
    task: Create a branch, inspect a diff, call an API, save its response, and write a commit message that matches the change.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recover an earlier state and explain a change from its diff instead of saying only that it was fixed.
    stretch: Add a failure test for powershell and linux terminals and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích terminal powershell/linux cho một đồng đội mới như thế nào?
  - Một assumption nào của terminal powershell/linux có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain powershell and linux terminals to a new teammate?
  - Which assumption behind powershell and linux terminals could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'PowerShell and Linux terminals: inspect one complete path'
  code: "# Topic: PowerShell and Linux terminals (phase-01-python-software-developer-tools-3)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của terminal powershell/linux.
  purpose_en: Illustrate the input-to-output path for powershell and linux terminals.
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
- title: VS Code Getting Started
  url: https://code.visualstudio.com/docs/getstarted/getting-started
  language: en
  purpose_vi: Hướng dẫn chính thức để mở folder, terminal và workspace.
  read_vi: Đọc phần mở folder và integrated terminal trước khi làm exercise.
  purpose_en: Official guide for folders, terminals, and workspaces.
  read_en: Read the folder and integrated-terminal sections before the exercise.
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
- phase-01-python-software-developer-tools-3-recall
- phase-01-python-software-developer-tools-3-application
- phase-01-python-software-developer-tools-3-debug
- phase-01-python-software-developer-tools-3-interview
estimated_minutes: 45
completion_checklist:
- Giải thích được input, biến đổi và output của terminal powershell/linux.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng terminal powershell/linux và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng terminal powershell/linux.
- Đánh giá terminal powershell/linux bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ terminal powershell/linux mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-01-python-software-developer-tools-4
- phase-01-python-software-sql-structures-1
review_question_vi: Định nghĩa terminal powershell/linux bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define powershell and linux terminals in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng terminal powershell/linux. Hãy
  liên hệ cụ thể với terminal powershell/linux trong lesson phase-01-python-software-developer-tools-3.
review_answer_en: A strong answer names the input, transformation, output and the context where powershell and linux terminals
  is used. Relate it specifically to powershell and linux terminals in lesson phase-01-python-software-developer-tools-3.
review_cards:
- id: phase-01-python-software-developer-tools-3-recall
  type: recall
  question_vi: Định nghĩa terminal powershell/linux bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define powershell and linux terminals in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng terminal powershell/linux.
  answer_en: A strong answer names the input, transformation, output and the context where powershell and linux terminals
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-developer-tools-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng terminal powershell/linux cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies powershell and linux terminals to an AI engineering problem.
  answer_vi: Ví dụ cho terminal powershell/linux cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-01-python-software-developer-tools-3).
  answer_en: The powershell and linux terminals example should have an explicit input, expected output and a way to run or
    verify it (phase-01-python-software-developer-tools-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-developer-tools-3-debug
  type: debug
  question_vi: Nếu kết quả của terminal powershell/linux sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If powershell and linux terminals produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với terminal powershell/linux, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-01-python-software-developer-tools-3).
  answer_en: For powershell and linux terminals, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-01-python-software-developer-tools-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-developer-tools-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của terminal powershell/linux như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of powershell and linux terminals?
  answer_vi: Câu trả lời về terminal powershell/linux cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-01-python-software-developer-tools-3).
  answer_en: The answer about powershell and linux terminals should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-01-python-software-developer-tools-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Terminal PowerShell/Linux / PowerShell and Linux terminals

Terminal PowerShell/Linux giúp một AI Engineer làm việc có thể truy vết: mỗi thay đổi cần có diff, lý do và cách kiểm chứng. Thực hành bằng một repository nhỏ, tạo một lỗi có chủ ý, đọc output của terminal rồi sửa bằng commit rõ nghĩa.

## Practice

Tạo branch, xem diff, gọi một API, lưu response và viết commit message mô tả đúng thay đổi.
