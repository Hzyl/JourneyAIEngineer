---
lesson_id: phase-00-onboarding-environment-4
phase_id: phase-00-onboarding
module_id: environment
title_vi: Khi nào nên dùng Jupyter hoặc Colab
title_en: Jupyter, Colab and when to use them
summary_vi: Notebook cho phép xen kẽ mã, kết quả và giải thích, phù hợp khi khám phá dữ liệu.
summary_en: Learn Jupyter, Colab and when to use them through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain jupyter, colab and when to use them with a concrete example.
- Write or adapt a small code example applying jupyter, colab and when to use them.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-environment-3
key_terms:
- jupyter
- colab
- khi
- nào
- dùng
- chúng
- Python
- testing
- debugging
- maintainability
concept_notes_vi: Notebook cho phép xen kẽ mã, kết quả và giải thích, phù hợp khi khám phá dữ liệu. Các ô chia sẻ
  trạng thái trong phiên làm việc, nên chạy sai thứ tự có thể tạo kết quả khó tái lập.
concept_notes_en: Jupyter, Colab và khi nào dùng chúng is a concept in the environment module. Identify the inputs,
  outputs, assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Thiết lập môi trường Python có thể tạo lại và biết kiểm tra nguyên nhân khi lệnh chạy khác dự
  kiến.
why_it_matters_en: Turn Windows into a reproducible Python environment and learn to verify tools from the terminal.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Jupyter, Colab and when to use them” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.
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
    task: 'Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.


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
    stretch: Add a failure test for jupyter, colab and when to use them and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Khi nào nên dùng Jupyter hoặc Colab” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain jupyter, colab and when to use them to a new teammate?
  - Which assumption behind jupyter, colab and when to use them could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Jupyter, Colab and when to use them: inspect one complete path'
  code: "# Topic: Jupyter, Colab and when to use them (phase-00-onboarding-environment-4)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for jupyter, colab and when to use them.
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
- title: Jupyter Documentation
  url: https://docs.jupyter.org/en/latest/
  language: en
  purpose_vi: Hiểu notebook, kernel và lúc nào notebook phù hợp.
  read_vi: Đọc phần bắt đầu rồi so sánh notebook với package Python trong thư mục thực hành.
  purpose_en: Understand notebooks, kernels, and when notebooks fit.
  read_en: Read the getting-started section and compare notebooks with a Python package.
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
- phase-00-onboarding-environment-4-recall
- phase-00-onboarding-environment-4-application
- phase-00-onboarding-environment-4-debug
- phase-00-onboarding-environment-4-interview
estimated_minutes: 45
completion_checklist:
- Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
common_mistakes:
- Cài thư viện trước khi kiểm tra Python nào đang chạy.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-00-onboarding-baseline-1
- phase-00-onboarding-baseline-2
review_question_vi: Nội dung cốt lõi của “Khi nào nên dùng Jupyter hoặc Colab” là gì?
review_question_en: Define jupyter, colab and when to use them in your own words. What are the input, transformation
  and output?
review_answer_vi: Notebook cho phép xen kẽ mã, kết quả và giải thích, phù hợp khi khám phá dữ liệu. Các ô chia sẻ
  trạng thái trong phiên làm việc, nên chạy sai thứ tự có thể tạo kết quả khó tái lập.
review_answer_en: A strong answer names the input, transformation, output and the context where jupyter, colab and
  when to use them is used. Relate it specifically to jupyter, colab and when to use them in lesson phase-00-onboarding-environment-4.
review_cards:
- id: phase-00-onboarding-environment-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Khi nào nên dùng Jupyter hoặc Colab” là gì?
  question_en: Define jupyter, colab and when to use them in your own words. What are the input, transformation
    and output?
  answer_vi: Notebook cho phép xen kẽ mã, kết quả và giải thích, phù hợp khi khám phá dữ liệu. Các ô chia sẻ trạng
    thái trong phiên làm việc, nên chạy sai thứ tự có thể tạo kết quả khó tái lập.
  answer_en: A strong answer names the input, transformation, output and the context where jupyter, colab and when
    to use them is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-environment-4-application
  type: application
  question_vi: Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.
  question_en: Write a small code example or design that applies jupyter, colab and when to use them to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập”, cần lưu:
    bản ghi phiên bản, đường dẫn Python và lệnh đã chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình
    thông dịch.'
  answer_en: The jupyter, colab and when to use them example should have an explicit input, expected output and
    a way to run or verify it (phase-00-onboarding-environment-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-environment-4-debug
  type: debug
  question_vi: Khi làm bài “Khi nào nên dùng Jupyter hoặc Colab”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If jupyter, colab and when to use them produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Khi nào nên dùng Jupyter hoặc Colab”, lỗi cần tránh là: cài thư viện trước khi kiểm tra
    Python nào đang chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch. Dùng ví dụ nhỏ để
    tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For jupyter, colab and when to use them, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-00-onboarding-environment-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-environment-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Khi nào nên dùng Jupyter hoặc Colab” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of jupyter, colab and when to
    use them?
  answer_vi: Bắt đầu từ nhiệm vụ “Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about jupyter, colab and when to use them should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-00-onboarding-environment-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Khi nào nên dùng Jupyter hoặc Colab / Jupyter, Colab and when to use them

Notebook cho phép xen kẽ mã, kết quả và giải thích, phù hợp khi khám phá dữ liệu. Các ô chia sẻ trạng thái trong phiên làm việc, nên chạy sai thứ tự có thể tạo kết quả khó tái lập.

## Thực hành

Khởi động lại phiên notebook và chạy các ô từ đầu để kiểm tra tính tái lập.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo kho mã nguồn, môi trường .venv và chạy một tệp Python từ VS Code; ghi phiên bản cùng đường dẫn trình thông dịch.
