---
lesson_id: phase-01-python-software-developer-tools-4
phase_id: phase-01-python-software
module_id: developer-tools
title_vi: HTTP, REST và JSON
title_en: HTTP, REST and JSON
summary_vi: HTTP quy định cách gửi yêu cầu và nhận phản hồi qua mạng.
summary_en: Learn HTTP, REST and JSON through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain http, rest and json with a concrete example.
- Write or adapt a small code example applying http, rest and json.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-developer-tools-3
- phase-00-onboarding-environment-1
key_terms:
- http
- rest
- json
- Python
- testing
- debugging
- maintainability
- developer-tools
concept_notes_vi: HTTP quy định cách gửi yêu cầu và nhận phản hồi qua mạng. REST là một cách thiết kế API quanh
  tài nguyên; JSON thường biểu diễn dữ liệu, còn mã trạng thái và header mang thông tin xử lý.
concept_notes_en: HTTP, REST và JSON describes a boundary between data and a service. A sound request has a schema,
  validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes,
  and tests empty or malformed data.
why_it_matters_vi: Dùng Git, terminal và HTTP để tái hiện vấn đề, xem xét thay đổi và trao đổi với hệ thống.
why_it_matters_en: Use Git, terminals, and HTTP as daily tools for reproduction, review, and system communication.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “HTTP, REST and JSON” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.
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
    task: 'Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.


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
    stretch: Add a failure test for http, rest and json and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “HTTP, REST và JSON” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain http, rest and json to a new teammate?
  - Which assumption behind http, rest and json could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'HTTP, REST and JSON: inspect one complete path'
  code: "# Topic: HTTP, REST and JSON (phase-01-python-software-developer-tools-4)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for http, rest and json.
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
- title: Python CSV and JSON
  url: https://docs.python.org/3/library/csv.html
  language: en
  purpose_vi: Hướng dẫn đọc, ghi dữ liệu dạng bảng bằng thư viện chuẩn.
  read_vi: Đọc về định dạng CSV, DictReader/DictWriter và cách kiểm tra mã hóa ký tự.
  purpose_en: Read and write tabular and structured data with the standard library.
  read_en: Focus on dialects, DictReader/DictWriter, and encoding.
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
- phase-01-python-software-developer-tools-4-recall
- phase-01-python-software-developer-tools-4-application
- phase-01-python-software-developer-tools-4-debug
- phase-01-python-software-developer-tools-4-interview
estimated_minutes: 45
completion_checklist:
- Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header,
  dữ liệu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo.
common_mistakes:
- Thực hiện lệnh thay đổi dữ liệu khi chưa rõ thư mục và phạm vi tác động.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-sql-structures-1
- phase-01-python-software-sql-structures-2
review_question_vi: Nội dung cốt lõi của “HTTP, REST và JSON” là gì?
review_question_en: Define http, rest and json in your own words. What are the input, transformation and output?
review_answer_vi: HTTP quy định cách gửi yêu cầu và nhận phản hồi qua mạng. REST là một cách thiết kế API quanh
  tài nguyên; JSON thường biểu diễn dữ liệu, còn mã trạng thái và header mang thông tin xử lý.
review_answer_en: A strong answer names the input, transformation, output and the context where http, rest and json
  is used. Relate it specifically to http, rest and json in lesson phase-01-python-software-developer-tools-4.
review_cards:
- id: phase-01-python-software-developer-tools-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “HTTP, REST và JSON” là gì?
  question_en: Define http, rest and json in your own words. What are the input, transformation and output?
  answer_vi: HTTP quy định cách gửi yêu cầu và nhận phản hồi qua mạng. REST là một cách thiết kế API quanh tài nguyên;
    JSON thường biểu diễn dữ liệu, còn mã trạng thái và header mang thông tin xử lý.
  answer_en: A strong answer names the input, transformation, output and the context where http, rest and json is
    used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-developer-tools-4-application
  type: application
  question_vi: Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.
  question_en: Write a small code example or design that applies http, rest and json to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header,
    dữ liệu”, cần lưu: lệnh hoặc yêu cầu đã gửi cùng phần kết quả cần giải thích. Xác nhận thư mục, phạm vi thay
    đổi và phản hồi trước bước tiếp theo.'
  answer_en: The http, rest and json example should have an explicit input, expected output and a way to run or
    verify it (phase-01-python-software-developer-tools-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-developer-tools-4-debug
  type: debug
  question_vi: Khi làm bài “HTTP, REST và JSON”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If http, rest and json produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “HTTP, REST và JSON”, lỗi cần tránh là: thực hiện lệnh thay đổi dữ liệu khi chưa rõ thư
    mục và phạm vi tác động. Xác nhận thư mục, phạm vi thay đổi và phản hồi trước bước tiếp theo. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For http, rest and json, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-01-python-software-developer-tools-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-developer-tools-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “HTTP, REST và JSON” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of http, rest and json?
  answer_vi: Bắt đầu từ nhiệm vụ “Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header,
    dữ liệu”. Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ
    đọc lại định nghĩa.
  answer_en: The answer about http, rest and json should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-01-python-software-developer-tools-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# HTTP, REST và JSON / HTTP, REST and JSON

HTTP quy định cách gửi yêu cầu và nhận phản hồi qua mạng. REST là một cách thiết kế API quanh tài nguyên; JSON thường biểu diễn dữ liệu, còn mã trạng thái và header mang thông tin xử lý.

## Thực hành

Đọc một yêu cầu HTTP cùng phản hồi và phân biệt phương thức, mã trạng thái, header, dữ liệu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Trong kho thử nghiệm, tạo nhánh, xem diff, gọi API, lưu phản hồi và viết thông điệp commit mô tả thay đổi.
