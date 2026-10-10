---
lesson_id: phase-02-math-ml-probability-2
phase_id: phase-02-math-ml
module_id: probability
title_vi: Kỳ vọng và phương sai
title_en: Expectation and variance
summary_vi: Kỳ vọng mô tả giá trị trung bình theo phân phối; phương sai đo mức phân tán quanh kỳ vọng.
summary_en: Learn Expectation and variance through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain expectation and variance with a concrete example.
- Write or adapt a small code example applying expectation and variance.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-probability-1
- phase-01-python-software-python-core-1
key_terms:
- vọng
- phương
- sai
- NumPy
- vector
- gradient
- optimization
- probability
concept_notes_vi: Kỳ vọng mô tả giá trị trung bình theo phân phối; phương sai đo mức phân tán quanh kỳ vọng. Trung
  bình và phương sai tính từ mẫu là các ước lượng, có thể thay đổi khi lấy mẫu khác.
concept_notes_en: Kỳ vọng và phương sai is a concept in the probability module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Dùng xác suất để mô tả bất định và đánh giá mức tin cậy của kết luận từ mẫu.
why_it_matters_en: Use probability and statistics to quantify uncertainty, sampling, and the reliability of conclusions.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Expectation and variance” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn. Ghi kết quả đối chiếu và điều bạn đã sửa
  nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Use probability and statistics to quantify uncertainty, sampling, and the
  reliability of conclusions.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Simulate a distribution, vary sample size, plot a histogram, and state assumptions
  before drawing conclusions.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Mô phỏng phân phối, thay cỡ mẫu, vẽ
      biểu đồ tần suất và ghi giả định trước khi kết luận.'
    deliverables:
    - Bảng tính hoặc kết quả mô phỏng có tham số và cách lấy mẫu
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Simulate a distribution, vary sample size, plot a histogram, and state assumptions before drawing conclusions.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can distinguish conditional probability, expectation, variance, and sampling noise in an ML
      example.
    stretch: Add a failure test for expectation and variance and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Kỳ vọng và phương sai” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain expectation and variance to a new teammate?
  - Which assumption behind expectation and variance could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- x · y = Σ_i x_i y_i
- '||x||₂ = √(Σ_i x_i²)'
code_examples:
- language: python
  title: 'Expectation and variance: inspect one complete path'
  code: "# Topic: Expectation and variance (phase-02-math-ml-probability-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for expectation and variance.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: NumPy Linear Algebra
  url: https://numpy.org/doc/stable/reference/routines.linalg.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: SciPy Optimize
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Mathematical Foundations
  url: https://scikit-learn.org/stable/user_guide.html
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
- exercise-2-probability
review_item_ids:
- phase-02-math-ml-probability-2-recall
- phase-02-math-ml-probability-2-application
- phase-02-math-ml-probability-2-debug
- phase-02-math-ml-probability-2-interview
estimated_minutes: 45
completion_checklist:
- Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
common_mistakes:
- Kết luận về cả phân phối chỉ từ một mẫu nhỏ.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-probability-3
- phase-02-math-ml-probability-4
review_question_vi: Nội dung cốt lõi của “Kỳ vọng và phương sai” là gì?
review_question_en: Define expectation and variance in your own words. What are the input, transformation and output?
review_answer_vi: Kỳ vọng mô tả giá trị trung bình theo phân phối; phương sai đo mức phân tán quanh kỳ vọng. Trung
  bình và phương sai tính từ mẫu là các ước lượng, có thể thay đổi khi lấy mẫu khác.
review_answer_en: A strong answer names the input, transformation, output and the context where expectation and
  variance is used. Relate it specifically to expectation and variance in lesson phase-02-math-ml-probability-2.
review_cards:
- id: phase-02-math-ml-probability-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Kỳ vọng và phương sai” là gì?
  question_en: Define expectation and variance in your own words. What are the input, transformation and output?
  answer_vi: Kỳ vọng mô tả giá trị trung bình theo phân phối; phương sai đo mức phân tán quanh kỳ vọng. Trung bình
    và phương sai tính từ mẫu là các ước lượng, có thể thay đổi khi lấy mẫu khác.
  answer_en: A strong answer names the input, transformation, output and the context where expectation and variance
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-probability-2-application
  type: application
  question_vi: Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.
  question_en: Write a small code example or design that applies expectation and variance to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau”, cần lưu: bảng tính
    hoặc kết quả mô phỏng có tham số và cách lấy mẫu. Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu
    hữu hạn.'
  answer_en: The expectation and variance example should have an explicit input, expected output and a way to run
    or verify it (phase-02-math-ml-probability-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-probability-2-debug
  type: debug
  question_vi: Khi làm bài “Kỳ vọng và phương sai”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If expectation and variance produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Kỳ vọng và phương sai”, lỗi cần tránh là: kết luận về cả phân phối chỉ từ một mẫu nhỏ.
    Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn. Dùng ví dụ nhỏ để tìm bước đầu tiên có
    kết quả khác dự kiến.'
  answer_en: For expectation and variance, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-02-math-ml-probability-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-probability-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Kỳ vọng và phương sai” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of expectation and variance?
  answer_vi: Bắt đầu từ nhiệm vụ “Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about expectation and variance should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-02-math-ml-probability-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Kỳ vọng và phương sai / Expectation and variance

Kỳ vọng mô tả giá trị trung bình theo phân phối; phương sai đo mức phân tán quanh kỳ vọng. Trung bình và phương sai tính từ mẫu là các ước lượng, có thể thay đổi khi lấy mẫu khác.

## Thực hành

Tính trung bình, phương sai của hai mẫu và giải thích sự khác nhau.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Mô phỏng phân phối, thay cỡ mẫu, vẽ biểu đồ tần suất và ghi giả định trước khi kết luận.
