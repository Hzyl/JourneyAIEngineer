---
lesson_id: phase-01-python-software-developer-tools-2
phase_id: phase-01-python-software
module_id: developer-tools
title_vi: Nhánh Git và pull request
title_en: Branches and pull requests
summary_vi: Nhánh cho phép phát triển một thay đổi độc lập trong lịch sử Git.
summary_en: Learn Branches and pull requests through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: Nhánh cho phép phát triển một thay đổi độc lập trong lịch sử Git. Pull request tập hợp thay đổi
  để người khác xem xét; mô tả nên nêu vấn đề, cách sửa và bằng chứng kiểm tra.
concept_notes_en: 'Branch và pull request makes AI engineering work traceable: every change needs a diff, a reason,
  and a verification step. Practise in a small repository, introduce an intentional failure, read the terminal output,
  and fix it with a focused commit.'
why_it_matters_vi: Dùng Git, terminal và HTTP để tái hiện vấn đề, xem xét thay đổi và trao đổi với hệ thống.
why_it_matters_en: Use Git, terminals, and HTTP as daily tools for reproduction, review, and system communication.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Branches and pull requests” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Use Git, terminals, and HTTP as daily tools for reproduction, review, and
  system communication.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a branch, inspect a diff, call an API, save its response, and write a commit
  message that matches the change.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Trong kho thử nghiệm, tạo nhánh, xem
      diff, gọi API, lưu phản hồi và viết thông điệp commit mô tả thay đổi.'
    deliverables:
    - Lệnh hoặc yêu cầu đã gửi cùng phần kết quả cần giải thích
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a branch, inspect a diff, call an API, save its response, and write a commit message that matches
      the change.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recover an earlier state and explain a change from its diff instead of saying only that
      it was fixed.
    stretch: Add a failure test for branches and pull requests and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Nhánh Git và pull request” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain branches and pull requests to a new teammate?
  - Which assumption behind branches and pull requests could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Branches and pull requests: inspect one complete path'
  code: "# Topic: Branches and pull requests (phase-01-python-software-developer-tools-2)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for branches and pull requests.
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
- title: 'Git Book: Branching'
  url: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
  language: en
  purpose_vi: Tìm hiểu nhánh, bản so sánh thay đổi và commit trước khi chia sẻ mã nguồn trên GitHub.
  read_vi: Đọc về nhánh, vùng chuẩn bị và cách kiểm tra diff trước khi đẩy mã nguồn.
  purpose_en: Understand branches, diffs, and commits before publishing artifacts.
  read_en: Read branches, the staging area, and reviewing a diff before push.
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
- exercise-1-developer-tools
review_item_ids:
- phase-01-python-software-developer-tools-2-recall
- phase-01-python-software-developer-tools-2-application
- phase-01-python-software-developer-tools-2-debug
- phase-01-python-software-developer-tools-2-interview
estimated_minutes: 45
completion_checklist:
- Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
common_mistakes:
- Thực hiện lệnh thay đổi dữ liệu khi chưa rõ thư mục và phạm vi tác động.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-developer-tools-3
- phase-01-python-software-developer-tools-4
review_question_vi: Nội dung cốt lõi của “Nhánh Git và pull request” là gì?
review_question_en: Define branches and pull requests in your own words. What are the input, transformation and
  output?
review_answer_vi: Nhánh cho phép phát triển một thay đổi độc lập trong lịch sử Git. Pull request tập hợp thay đổi
  để người khác xem xét; mô tả nên nêu vấn đề, cách sửa và bằng chứng kiểm tra.
review_answer_en: A strong answer names the input, transformation, output and the context where branches and pull
  requests is used. Relate it specifically to branches and pull requests in lesson phase-01-python-software-developer-tools-2.
review_cards:
- id: phase-01-python-software-developer-tools-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Nhánh Git và pull request” là gì?
  question_en: Define branches and pull requests in your own words. What are the input, transformation and output?
  answer_vi: Nhánh cho phép phát triển một thay đổi độc lập trong lịch sử Git. Pull request tập hợp thay đổi để
    người khác xem xét; mô tả nên nêu vấn đề, cách sửa và bằng chứng kiểm tra.
  answer_en: A strong answer names the input, transformation, output and the context where branches and pull requests
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-developer-tools-2-application
  type: application
  question_vi: Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.
  question_en: Write a small code example or design that applies branches and pull requests to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review”, cần
    lưu: lệnh hoặc yêu cầu đã gửi cùng phần kết quả cần giải thích. Xác nhận thư mục, phạm vi thay đổi và phản hồi
    trước bước tiếp theo.'
  answer_en: The branches and pull requests example should have an explicit input, expected output and a way to
    run or verify it (phase-01-python-software-developer-tools-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-developer-tools-2-debug
  type: debug
  question_vi: Khi làm bài “Nhánh Git và pull request”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If branches and pull requests produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Nhánh Git và pull request”, lỗi cần tránh là: thực hiện lệnh thay đổi dữ liệu khi chưa
    rõ thư mục và phạm vi tác động. Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For branches and pull requests, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-01-python-software-developer-tools-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-developer-tools-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Nhánh Git và pull request” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of branches and pull requests?
  answer_vi: Bắt đầu từ nhiệm vụ “Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about branches and pull requests should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-01-python-software-developer-tools-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Nhánh Git và pull request / Branches and pull requests

Nhánh cho phép phát triển một thay đổi độc lập trong lịch sử Git. Pull request tập hợp thay đổi để người khác xem xét; mô tả nên nêu vấn đề, cách sửa và bằng chứng kiểm tra.

## Thực hành

Tạo nhánh thử nghiệm và viết mô tả thay đổi kèm cách kiểm tra để chuẩn bị review.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Trong kho thử nghiệm, tạo nhánh, xem diff, gọi API, lưu phản hồi và viết thông điệp commit mô tả thay đổi.
