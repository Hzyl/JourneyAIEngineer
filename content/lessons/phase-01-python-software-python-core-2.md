---
lesson_id: phase-01-python-software-python-core-2
phase_id: phase-01-python-software
module_id: python-core
title_vi: Rẽ nhánh, vòng lặp và comprehension
title_en: Control flow and comprehensions
summary_vi: Câu lệnh điều kiện chọn nhánh xử lý, vòng lặp lặp lại công việc, còn comprehension tạo tập hợp dữ liệu
  ngắn gọn.
summary_en: Learn Control flow and comprehensions through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.
- Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain control flow and comprehensions with a concrete example.
- Write or adapt a small code example applying control flow and comprehensions.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-01-python-software-python-core-1
- phase-00-onboarding-environment-1
key_terms:
- control
- flow
- comprehension
- Python
- testing
- debugging
- maintainability
- python-core
concept_notes_vi: Câu lệnh điều kiện chọn nhánh xử lý, vòng lặp lặp lại công việc, còn comprehension tạo tập hợp
  dữ liệu ngắn gọn. Ưu tiên cách viết dễ đọc khi điều kiện hoặc phép biến đổi trở nên phức tạp.
concept_notes_en: Control flow và comprehension is a concept in the python-core module. Identify the inputs, outputs,
  assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Nắm Python đủ để đọc mã AI, viết hàm nhỏ và tự kiểm tra hành vi của chương trình.
why_it_matters_en: Build enough Python fluency to read AI code, write small tested functions, and work beyond notebooks.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Control flow and comprehensions” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.
- Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu. Ghi kết quả đối chiếu và điều
  bạn đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Build enough Python fluency to read AI code, write small tested functions,
  and work beyond notebooks.'
- Open Python Standard Library, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a small package with pure functions, type hints, invalid-input handling, and
  happy-path plus edge-case tests.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết package nhỏ có hàm thuần, chú thích
      kiểu, xử lý đầu vào không hợp lệ và kiểm thử trường hợp biên.'
    deliverables:
    - Mã Python nhỏ và các trường hợp kiểm tra hành vi
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a small package with pure functions, type hints, invalid-input handling, and happy-path plus edge-case
      tests.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain the important lines and change a requirement without copying a tutorial wholesale.
    stretch: Add a failure test for control flow and comprehensions and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Rẽ nhánh, vòng lặp và comprehension” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain control flow and comprehensions to a new teammate?
  - Which assumption behind control flow and comprehensions could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Control flow and comprehensions: inspect one complete path'
  code: "# Topic: Control flow and comprehensions (phase-01-python-software-python-core-2)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for control flow and comprehensions.
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
- exercise-1-python-core
review_item_ids:
- phase-01-python-software-python-core-2-recall
- phase-01-python-software-python-core-2-application
- phase-01-python-software-python-core-2-debug
- phase-01-python-software-python-core-2-interview
estimated_minutes: 45
completion_checklist:
- Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.
- Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu.
common_mistakes:
- Nhầm việc hiển thị bằng print với việc trả giá trị từ hàm.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-01-python-software-python-core-3
- phase-01-python-software-python-core-4
review_question_vi: Nội dung cốt lõi của “Rẽ nhánh, vòng lặp và comprehension” là gì?
review_question_en: Define control flow and comprehensions in your own words. What are the input, transformation
  and output?
review_answer_vi: Câu lệnh điều kiện chọn nhánh xử lý, vòng lặp lặp lại công việc, còn comprehension tạo tập hợp
  dữ liệu ngắn gọn. Ưu tiên cách viết dễ đọc khi điều kiện hoặc phép biến đổi trở nên phức tạp.
review_answer_en: A strong answer names the input, transformation, output and the context where control flow and
  comprehensions is used. Relate it specifically to control flow and comprehensions in lesson phase-01-python-software-python-core-2.
review_cards:
- id: phase-01-python-software-python-core-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Rẽ nhánh, vòng lặp và comprehension” là gì?
  question_en: Define control flow and comprehensions in your own words. What are the input, transformation and
    output?
  answer_vi: Câu lệnh điều kiện chọn nhánh xử lý, vòng lặp lặp lại công việc, còn comprehension tạo tập hợp dữ liệu
    ngắn gọn. Ưu tiên cách viết dễ đọc khi điều kiện hoặc phép biến đổi trở nên phức tạp.
  answer_en: A strong answer names the input, transformation, output and the context where control flow and comprehensions
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-01-python-software-python-core-2-application
  type: application
  question_vi: Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.
  question_en: Write a small code example or design that applies control flow and comprehensions to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả”, cần lưu:
    mã Python nhỏ và các trường hợp kiểm tra hành vi. Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả
    về và thay đổi dữ liệu.'
  answer_en: The control flow and comprehensions example should have an explicit input, expected output and a way
    to run or verify it (phase-01-python-software-python-core-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-01-python-software-python-core-2-debug
  type: debug
  question_vi: Khi làm bài “Rẽ nhánh, vòng lặp và comprehension”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If control flow and comprehensions produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Rẽ nhánh, vòng lặp và comprehension”, lỗi cần tránh là: nhầm việc hiển thị bằng print với
    việc trả giá trị từ hàm. Dự đoán kết quả trước khi chạy, rồi giải thích giá trị trả về và thay đổi dữ liệu.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For control flow and comprehensions, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-01-python-software-python-core-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-01-python-software-python-core-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Rẽ nhánh, vòng lặp và comprehension” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of control flow and comprehensions?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about control flow and comprehensions should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-01-python-software-python-core-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Rẽ nhánh, vòng lặp và comprehension / Control flow and comprehensions

Câu lệnh điều kiện chọn nhánh xử lý, vòng lặp lặp lại công việc, còn comprehension tạo tập hợp dữ liệu ngắn gọn. Ưu tiên cách viết dễ đọc khi điều kiện hoặc phép biến đổi trở nên phức tạp.

## Thực hành

Viết phép lọc dữ liệu bằng vòng lặp và comprehension rồi đối chiếu kết quả.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết package nhỏ có hàm thuần, chú thích kiểu, xử lý đầu vào không hợp lệ và kiểm thử trường hợp biên.
