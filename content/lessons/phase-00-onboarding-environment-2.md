---
lesson_id: phase-00-onboarding-environment-2
phase_id: phase-00-onboarding
module_id: environment
title_vi: Thiết lập VS Code và terminal
title_en: Set up VS Code and the terminal
summary_vi: VS Code là nơi soạn mã; terminal là nơi chạy lệnh trong một thư mục và môi trường cụ thể.
summary_en: Learn Set up VS Code and the terminal through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain set up vs code and the terminal with a concrete example.
- Write or adapt a small code example applying set up vs code and the terminal.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-environment-1
key_terms:
- thiết
- lập
- code
- terminal
- Python
- testing
- debugging
- maintainability
- environment
concept_notes_vi: VS Code là nơi soạn mã; terminal là nơi chạy lệnh trong một thư mục và môi trường cụ thể. Chọn
  đúng trình thông dịch giúp lệnh trong terminal và nút chạy dùng cùng môi trường.
concept_notes_en: 'Thiết lập VS Code và terminal makes AI engineering work traceable: every change needs a diff,
  a reason, and a verification step. Practise in a small repository, introduce an intentional failure, read the
  terminal output, and fix it with a focused commit.'
why_it_matters_vi: Thiết lập môi trường Python có thể tạo lại và biết kiểm tra nguyên nhân khi lệnh chạy khác dự
  kiến.
why_it_matters_en: Turn Windows into a reproducible Python environment and learn to verify tools from the terminal.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Set up VS Code and the terminal” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Turn Windows into a reproducible Python environment and learn to verify tools
  from the terminal.'
- Open Python Tutorial, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a repository folder, create a .venv, run a Python script from VS Code, and
  record the version checks.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo kho mã nguồn, môi trường .venv và
      chạy một tệp Python từ VS Code; ghi phiên bản cùng đường dẫn trình thông dịch.'
    deliverables:
    - Bản ghi phiên bản, đường dẫn Python và lệnh đã chạy
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a repository folder, create a .venv, run a Python script from VS Code, and record the version checks.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can recreate the environment from a clean clone and run the script without guessing commands.
    stretch: Add a failure test for set up vs code and the terminal and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Thiết lập VS Code và terminal” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain set up vs code and the terminal to a new teammate?
  - Which assumption behind set up vs code and the terminal could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Set up VS Code and the terminal: inspect one complete path'
  code: "# Topic: Set up VS Code and the terminal (phase-00-onboarding-environment-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for set up vs code and the terminal.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Python Tutorial
  url: https://docs.python.org/3/tutorial/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: VS Code Python
  url: https://code.visualstudio.com/docs/languages/python
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Git Reference
  url: https://git-scm.com/docs
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: VS Code Getting Started
  url: https://code.visualstudio.com/docs/getstarted/getting-started
  language: en
  purpose_vi: Hướng dẫn mở thư mục bài tập và terminal trong VS Code.
  read_vi: Đọc cách mở thư mục và terminal tích hợp trước khi làm bài tập.
  purpose_en: Official guide for folders, terminals, and workspaces.
  read_en: Read the folder and integrated-terminal sections before the exercise.
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
- exercise-0-environment
review_item_ids:
- phase-00-onboarding-environment-2-recall
- phase-00-onboarding-environment-2-application
- phase-00-onboarding-environment-2-debug
- phase-00-onboarding-environment-2-interview
estimated_minutes: 45
completion_checklist:
- Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
common_mistakes:
- Cài thư viện trước khi kiểm tra Python nào đang chạy.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-00-onboarding-environment-3
- phase-00-onboarding-environment-4
review_question_vi: Nội dung cốt lõi của “Thiết lập VS Code và terminal” là gì?
review_question_en: Define set up vs code and the terminal in your own words. What are the input, transformation
  and output?
review_answer_vi: VS Code là nơi soạn mã; terminal là nơi chạy lệnh trong một thư mục và môi trường cụ thể. Chọn
  đúng trình thông dịch giúp lệnh trong terminal và nút chạy dùng cùng môi trường.
review_answer_en: A strong answer names the input, transformation, output and the context where set up vs code and
  the terminal is used. Relate it specifically to set up vs code and the terminal in lesson phase-00-onboarding-environment-2.
review_cards:
- id: phase-00-onboarding-environment-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Thiết lập VS Code và terminal” là gì?
  question_en: Define set up vs code and the terminal in your own words. What are the input, transformation and
    output?
  answer_vi: VS Code là nơi soạn mã; terminal là nơi chạy lệnh trong một thư mục và môi trường cụ thể. Chọn đúng
    trình thông dịch giúp lệnh trong terminal và nút chạy dùng cùng môi trường.
  answer_en: A strong answer names the input, transformation, output and the context where set up vs code and the
    terminal is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-environment-2-application
  type: application
  question_vi: Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.
  question_en: Write a small code example or design that applies set up vs code and the terminal to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả”, cần lưu: bản
    ghi phiên bản, đường dẫn Python và lệnh đã chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông
    dịch.'
  answer_en: The set up vs code and the terminal example should have an explicit input, expected output and a way
    to run or verify it (phase-00-onboarding-environment-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-environment-2-debug
  type: debug
  question_vi: Khi làm bài “Thiết lập VS Code và terminal”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If set up vs code and the terminal produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Thiết lập VS Code và terminal”, lỗi cần tránh là: cài thư viện trước khi kiểm tra Python
    nào đang chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For set up vs code and the terminal, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-00-onboarding-environment-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-environment-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Thiết lập VS Code và terminal” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of set up vs code and the terminal?
  answer_vi: Bắt đầu từ nhiệm vụ “Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about set up vs code and the terminal should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-00-onboarding-environment-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Thiết lập VS Code và terminal / Set up VS Code and the terminal

VS Code là nơi soạn mã; terminal là nơi chạy lệnh trong một thư mục và môi trường cụ thể. Chọn đúng trình thông dịch giúp lệnh trong terminal và nút chạy dùng cùng môi trường.

## Thực hành

Chạy cùng một tệp Python từ VS Code và terminal, rồi đối chiếu kết quả.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo kho mã nguồn, môi trường .venv và chạy một tệp Python từ VS Code; ghi phiên bản cùng đường dẫn trình thông dịch.
