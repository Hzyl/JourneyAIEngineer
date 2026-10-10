---
lesson_id: phase-01-python-software-data-files-2
phase_id: phase-01-python-software
module_id: data-files
title_vi: Parquet và lưu trữ theo cột
title_en: Parquet and columnar data
summary_vi: Parquet tổ chức dữ liệu theo cột và lưu thông tin kiểu.
summary_en: Learn Parquet and columnar data through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.
- Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain parquet and columnar data with a concrete example.
- Write or adapt a small code example applying parquet and columnar data.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-data-files-1
- phase-00-onboarding-environment-1
key_terms:
- parquet
- columnar
- data
- Python
- testing
- debugging
- maintainability
- data-files
concept_notes_vi: Parquet tổ chức dữ liệu theo cột và lưu thông tin kiểu. Khi chỉ cần một số cột, định dạng này
  có thể giảm lượng dữ liệu phải đọc; lợi ích thực tế phụ thuộc cách truy vấn và kích thước dữ liệu.
concept_notes_en: Parquet và columnar data is a concept in the data-files module. Identify the inputs, outputs,
  assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Đọc, ghi dữ liệu theo cấu trúc rõ và xử lý giá trị thiếu bằng chính sách có thể giải thích.
why_it_matters_en: Read and write data with schemas, handle missing values, and create CLIs with inspectable inputs
  and outputs.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Parquet and columnar data” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.
- Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Read and write data with schemas, handle missing values, and create CLIs with
  inspectable inputs and outputs.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Build a small CSV/JSON pipeline that validates schema, reports bad rows, writes clean
  output, and reruns from a terminal.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây quy trình CSV/JSON nhỏ: kiểm tra
      cấu trúc, báo dòng lỗi, xuất dữ liệu sạch và chạy lại từ terminal.'
    deliverables:
    - Dữ liệu mẫu, lệnh xử lý và kết quả đọc hoặc ghi
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Build a small CSV/JSON pipeline that validates schema, reports bad rows, writes clean output, and reruns
      from a terminal.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain which data is kept, dropped, or repaired and why each decision is safe.
    stretch: Add a failure test for parquet and columnar data and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Parquet và lưu trữ theo cột” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain parquet and columnar data to a new teammate?
  - Which assumption behind parquet and columnar data could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Parquet and columnar data: inspect one complete path'
  code: "# Topic: Parquet and columnar data (phase-01-python-software-data-files-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for parquet and columnar data.
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
- exercise-1-data-files
review_item_ids:
- phase-01-python-software-data-files-2-recall
- phase-01-python-software-data-files-2-application
- phase-01-python-software-data-files-2-debug
- phase-01-python-software-data-files-2-interview
estimated_minutes: 45
completion_checklist:
- So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.
- Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý.
common_mistakes:
- Để chuyển đổi kiểu hoặc giá trị thiếu âm thầm làm đổi dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-data-files-3
- phase-01-python-software-data-files-4
review_question_vi: Nội dung cốt lõi của “Parquet và lưu trữ theo cột” là gì?
review_question_en: Define parquet and columnar data in your own words. What are the input, transformation and output?
review_answer_vi: Parquet tổ chức dữ liệu theo cột và lưu thông tin kiểu. Khi chỉ cần một số cột, định dạng này
  có thể giảm lượng dữ liệu phải đọc; lợi ích thực tế phụ thuộc cách truy vấn và kích thước dữ liệu.
review_answer_en: A strong answer names the input, transformation, output and the context where parquet and columnar
  data is used. Relate it specifically to parquet and columnar data in lesson phase-01-python-software-data-files-2.
review_cards:
- id: phase-01-python-software-data-files-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Parquet và lưu trữ theo cột” là gì?
  question_en: Define parquet and columnar data in your own words. What are the input, transformation and output?
  answer_vi: Parquet tổ chức dữ liệu theo cột và lưu thông tin kiểu. Khi chỉ cần một số cột, định dạng này có thể
    giảm lượng dữ liệu phải đọc; lợi ích thực tế phụ thuộc cách truy vấn và kích thước dữ liệu.
  answer_en: A strong answer names the input, transformation, output and the context where parquet and columnar
    data is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-data-files-2-application
  type: application
  question_vi: So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.
  question_en: Write a small code example or design that applies parquet and columnar data to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet”, cần lưu: dữ liệu mẫu,
    lệnh xử lý và kết quả đọc hoặc ghi. Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý.'
  answer_en: The parquet and columnar data example should have an explicit input, expected output and a way to run
    or verify it (phase-01-python-software-data-files-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-data-files-2-debug
  type: debug
  question_vi: Khi làm bài “Parquet và lưu trữ theo cột”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If parquet and columnar data produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Parquet và lưu trữ theo cột”, lỗi cần tránh là: để chuyển đổi kiểu hoặc giá trị thiếu âm
    thầm làm đổi dữ liệu. Đối chiếu số dòng, kiểu dữ liệu và giá trị trước, sau xử lý. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For parquet and columnar data, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-01-python-software-data-files-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-data-files-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Parquet và lưu trữ theo cột” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of parquet and columnar data?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about parquet and columnar data should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-01-python-software-data-files-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Parquet và lưu trữ theo cột / Parquet and columnar data

Parquet tổ chức dữ liệu theo cột và lưu thông tin kiểu. Khi chỉ cần một số cột, định dạng này có thể giảm lượng dữ liệu phải đọc; lợi ích thực tế phụ thuộc cách truy vấn và kích thước dữ liệu.

## Thực hành

So sánh việc đọc một số cột từ cùng dữ liệu ở CSV và Parquet.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Xây quy trình CSV/JSON nhỏ: kiểm tra cấu trúc, báo dòng lỗi, xuất dữ liệu sạch và chạy lại từ terminal.
