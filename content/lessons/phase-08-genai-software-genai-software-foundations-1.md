---
lesson_id: phase-08-genai-software-genai-software-foundations-1
phase_id: phase-08-genai-software
module_id: genai-software-foundations
title_vi: Python cho dịch vụ AI và quy định kiểu dữ liệu
title_en: Python for AI services and typed contracts
summary_vi: Dịch vụ AI cần ranh giới rõ giữa nhận yêu cầu, kiểm tra dữ liệu và gọi mô hình.
summary_en: Learn Python for AI services and typed contracts through an input → transformation → output model, then
  verify it with an edge-case exercise.
learning_objectives:
- Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain python for ai services and typed contracts with a concrete example.
- Write or adapt a small code example applying python for ai services and typed contracts.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-career-4
- phase-07-capstone-career-problem-1
key_terms:
- python
- cho
- service
- typed
- contract
- Python
- testing
- debugging
- maintainability
- genai-software-foundations
concept_notes_vi: Dịch vụ AI cần ranh giới rõ giữa nhận yêu cầu, kiểm tra dữ liệu và gọi mô hình. Chú thích kiểu
  hỗ trợ đọc mã; việc kiểm tra đầu vào khi chạy vẫn cần được cài đặt.
concept_notes_en: Python cho AI service và typed contract is a Software Engineering skill for turning an idea into
  code that can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before
  implementing. In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Kiểm soát cấu trúc dịch vụ, phụ thuộc và phát hành trước khi tối ưu mô hình.
why_it_matters_en: An AI Engineer must control service boundaries, dependencies, and releases before optimizing
  a model.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Python for AI services and typed contracts” trong tài liệu tham khảo; đối chiếu với phần
  giải thích của bài.
- Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: An AI Engineer must control service boundaries, dependencies, and releases
  before optimizing a model.'
- Open FastAPI Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its
  contract, health check, and rollback command.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đóng gói API AI giả lập bằng FastAPI,
      Docker và GitHub Actions; ghi cấu trúc trao đổi, kiểm tra tình trạng và cách khôi phục.'
    deliverables:
    - Đặc tả dịch vụ hoặc cấu hình chạy có cách kiểm tra
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Package a stub AI endpoint with FastAPI, Docker, and GitHub Actions; document its contract, health check,
      and rollback command.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: From a clean clone, run tests and the container with one command sequence and distinguish code,
      environment, and deployment failures.
    stretch: Add a failure test for python for ai services and typed contracts and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Python cho dịch vụ AI và quy định kiểu dữ liệu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain python for ai services and typed contracts to a new teammate?
  - Which assumption behind python for ai services and typed contracts could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Python for AI services and typed contracts: inspect one complete path'
  code: "# Topic: Python for AI services and typed contracts (phase-08-genai-software-genai-software-foundations-1)\n\
    from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\
    \nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for python for ai services and typed contracts.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: FastAPI Documentation
  url: https://fastapi.tiangolo.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: GitHub Actions Documentation
  url: https://docs.github.com/en/actions
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Docker Get Started
  url: https://docs.docker.com/get-started/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python downloads
  url: https://www.python.org/downloads/
  language: en
  purpose_vi: Trang tải Python chính thức; dùng để cài đúng bản ổn định.
  read_vi: Chọn Windows installer 64-bit, kiểm tra Add Python to PATH và xác nhận bằng python --version.
  purpose_en: Official Python downloads; use it to install a stable release.
  read_en: Choose the 64-bit Windows installer, enable PATH, and verify with python --version.
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
- exercise-8-genai-software-foundations
review_item_ids:
- phase-08-genai-software-genai-software-foundations-1-recall
- phase-08-genai-software-genai-software-foundations-1-application
- phase-08-genai-software-genai-software-foundations-1-debug
- phase-08-genai-software-genai-software-foundations-1-interview
estimated_minutes: 60
completion_checklist:
- Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
common_mistakes:
- Dựa vào chú thích kiểu mà bỏ qua kiểm tra dữ liệu khi chạy.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-08-genai-software-genai-software-foundations-2
- phase-08-genai-software-genai-software-foundations-3
review_question_vi: Nội dung cốt lõi của “Python cho dịch vụ AI và quy định kiểu dữ liệu” là gì?
review_question_en: Define python for ai services and typed contracts in your own words. What are the input, transformation
  and output?
review_answer_vi: Dịch vụ AI cần ranh giới rõ giữa nhận yêu cầu, kiểm tra dữ liệu và gọi mô hình. Chú thích kiểu
  hỗ trợ đọc mã; việc kiểm tra đầu vào khi chạy vẫn cần được cài đặt.
review_answer_en: A strong answer names the input, transformation, output and the context where python for ai services
  and typed contracts is used. Relate it specifically to python for ai services and typed contracts in lesson phase-08-genai-software-genai-software-foundations-1.
review_cards:
- id: phase-08-genai-software-genai-software-foundations-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Python cho dịch vụ AI và quy định kiểu dữ liệu” là gì?
  question_en: Define python for ai services and typed contracts in your own words. What are the input, transformation
    and output?
  answer_vi: Dịch vụ AI cần ranh giới rõ giữa nhận yêu cầu, kiểm tra dữ liệu và gọi mô hình. Chú thích kiểu hỗ trợ
    đọc mã; việc kiểm tra đầu vào khi chạy vẫn cần được cài đặt.
  answer_en: A strong answer names the input, transformation, output and the context where python for ai services
    and typed contracts is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-08-genai-software-genai-software-foundations-1-application
  type: application
  question_vi: Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.
  question_en: Write a small code example or design that applies python for ai services and typed contracts to an
    AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu”, cần lưu: đặc tả dịch
    vụ hoặc cấu hình chạy có cách kiểm tra. Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.'
  answer_en: The python for ai services and typed contracts example should have an explicit input, expected output
    and a way to run or verify it (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-08-genai-software-genai-software-foundations-1-debug
  type: debug
  question_vi: Khi làm bài “Python cho dịch vụ AI và quy định kiểu dữ liệu”, bạn cần tránh lỗi nào và kiểm tra lại
    ra sao?
  question_en: If python for ai services and typed contracts produces a wrong result or a metric drops, what would
    you debug first?
  answer_vi: 'Trong bài “Python cho dịch vụ AI và quy định kiểu dữ liệu”, lỗi cần tránh là: dựa vào chú thích kiểu
    mà bỏ qua kiểm tra dữ liệu khi chạy. Theo dõi một yêu cầu và xác nhận các lỗi được xử lý ở đúng thành phần.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For python for ai services and typed contracts, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-08-genai-software-genai-software-foundations-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Python cho dịch vụ AI và quy định kiểu dữ liệu” để giải thích cách làm
    và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of python for ai services and
    typed contracts?
  answer_vi: Bắt đầu từ nhiệm vụ “Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about python for ai services and typed contracts should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-08-genai-software-genai-software-foundations-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Python cho dịch vụ AI và quy định kiểu dữ liệu / Python for AI services and typed contracts

Dịch vụ AI cần ranh giới rõ giữa nhận yêu cầu, kiểm tra dữ liệu và gọi mô hình. Chú thích kiểu hỗ trợ đọc mã; việc kiểm tra đầu vào khi chạy vẫn cần được cài đặt.

## Thực hành

Mô tả cấu trúc đầu vào, đầu ra và kiểm tra một yêu cầu sai kiểu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Đóng gói API AI giả lập bằng FastAPI, Docker và GitHub Actions; ghi cấu trúc trao đổi, kiểm tra tình trạng và cách khôi phục.
