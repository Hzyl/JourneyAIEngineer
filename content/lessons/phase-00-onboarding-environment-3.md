---
lesson_id: phase-00-onboarding-environment-3
phase_id: phase-00-onboarding
module_id: environment
title_vi: Tạo môi trường ảo Python đầu tiên
title_en: Create your first virtual environment
summary_vi: Môi trường ảo tách thư viện của từng dự án.
summary_en: Learn Create your first virtual environment through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain create your first virtual environment with a concrete example.
- Write or adapt a small code example applying create your first virtual environment.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-environment-2
key_terms:
- tạo
- virtual
- environment
- đầu
- tiên
- inference
- observability
- reproducibility
- deployment
concept_notes_vi: Môi trường ảo tách thư viện của từng dự án. Thư mục .venv có thể tạo lại từ danh sách phụ thuộc;
  điều cần lưu cùng dự án là cách tạo môi trường và các phiên bản cần dùng.
concept_notes_en: Tạo virtual environment đầu tiên is a Software Engineering skill for turning an idea into code
  that can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing.
  In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Thiết lập môi trường Python có thể tạo lại và biết kiểm tra nguyên nhân khi lệnh chạy khác dự
  kiến.
why_it_matters_en: Turn Windows into a reproducible Python environment and learn to verify tools from the terminal.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Create your first virtual environment” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.
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
    task: 'Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.


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
    stretch: Add a failure test for create your first virtual environment and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tạo môi trường ảo Python đầu tiên” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain create your first virtual environment to a new teammate?
  - Which assumption behind create your first virtual environment could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Create your first virtual environment: inspect one complete path'
  code: "# Topic: Create your first virtual environment (phase-00-onboarding-environment-3)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for create your first virtual environment.
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
- title: Python venv
  url: https://docs.python.org/3/library/venv.html
  language: en
  purpose_vi: Hướng dẫn tạo môi trường ảo để quản lý thư viện riêng cho từng dự án.
  read_vi: Đọc cách tạo, kích hoạt, thoát môi trường ảo và kiểm tra trình thông dịch đang dùng.
  purpose_en: Official reference for isolated Python environments.
  read_en: Focus on create, activate, deactivate, and interpreter verification.
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
- phase-00-onboarding-environment-3-recall
- phase-00-onboarding-environment-3-application
- phase-00-onboarding-environment-3-debug
- phase-00-onboarding-environment-3-interview
estimated_minutes: 45
completion_checklist:
- Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch.
common_mistakes:
- Cài thư viện trước khi kiểm tra Python nào đang chạy.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-00-onboarding-environment-4
- phase-00-onboarding-baseline-1
review_question_vi: Nội dung cốt lõi của “Tạo môi trường ảo Python đầu tiên” là gì?
review_question_en: Define create your first virtual environment in your own words. What are the input, transformation
  and output?
review_answer_vi: Môi trường ảo tách thư viện của từng dự án. Thư mục .venv có thể tạo lại từ danh sách phụ thuộc;
  điều cần lưu cùng dự án là cách tạo môi trường và các phiên bản cần dùng.
review_answer_en: A strong answer names the input, transformation, output and the context where create your first
  virtual environment is used. Relate it specifically to create your first virtual environment in lesson phase-00-onboarding-environment-3.
review_cards:
- id: phase-00-onboarding-environment-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tạo môi trường ảo Python đầu tiên” là gì?
  question_en: Define create your first virtual environment in your own words. What are the input, transformation
    and output?
  answer_vi: Môi trường ảo tách thư viện của từng dự án. Thư mục .venv có thể tạo lại từ danh sách phụ thuộc; điều
    cần lưu cùng dự án là cách tạo môi trường và các phiên bản cần dùng.
  answer_en: A strong answer names the input, transformation, output and the context where create your first virtual
    environment is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-environment-3-application
  type: application
  question_vi: Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.
  question_en: Write a small code example or design that applies create your first virtual environment to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường”, cần lưu: bản ghi
    phiên bản, đường dẫn Python và lệnh đã chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông
    dịch.'
  answer_en: The create your first virtual environment example should have an explicit input, expected output and
    a way to run or verify it (phase-00-onboarding-environment-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-environment-3-debug
  type: debug
  question_vi: Khi làm bài “Tạo môi trường ảo Python đầu tiên”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If create your first virtual environment produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Tạo môi trường ảo Python đầu tiên”, lỗi cần tránh là: cài thư viện trước khi kiểm tra Python
    nào đang chạy. Chạy lại từ terminal mới và xác nhận đúng tệp, đúng trình thông dịch. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For create your first virtual environment, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-00-onboarding-environment-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-environment-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tạo môi trường ảo Python đầu tiên” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of create your first virtual
    environment?
  answer_vi: Bắt đầu từ nhiệm vụ “Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about create your first virtual environment should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-00-onboarding-environment-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tạo môi trường ảo Python đầu tiên / Create your first virtual environment

Môi trường ảo tách thư viện của từng dự án. Thư mục .venv có thể tạo lại từ danh sách phụ thuộc; điều cần lưu cùng dự án là cách tạo môi trường và các phiên bản cần dùng.

## Thực hành

Tạo .venv và kiểm tra đường dẫn Python sau khi kích hoạt môi trường.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo kho mã nguồn, môi trường .venv và chạy một tệp Python từ VS Code; ghi phiên bản cùng đường dẫn trình thông dịch.
