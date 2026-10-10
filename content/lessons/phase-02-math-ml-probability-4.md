---
lesson_id: phase-02-math-ml-probability-4
phase_id: phase-02-math-ml
module_id: probability
title_vi: Lấy mẫu và luật số lớn
title_en: Sampling and the law of large numbers
summary_vi: Lấy mẫu giúp ước lượng đặc điểm quần thể từ một phần dữ liệu.
summary_en: Learn Sampling and the law of large numbers through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain sampling and the law of large numbers with a concrete example.
- Write or adapt a small code example applying sampling and the law of large numbers.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-probability-3
- phase-01-python-software-python-core-1
key_terms:
- sampling
- luật
- lớn
- NumPy
- vector
- gradient
- optimization
- probability
concept_notes_vi: Lấy mẫu giúp ước lượng đặc điểm quần thể từ một phần dữ liệu. Luật số lớn giải thích sự ổn định
  của trung bình mẫu dưới các điều kiện thích hợp; tăng số mẫu không tự sửa sai lệch do cách chọn mẫu.
concept_notes_en: Sampling và luật số lớn quantifies uncertainty instead of returning only a prediction. Distinguish
  conditional from marginal probability, population from sample, and state distribution or confidence-interval assumptions
  before interpreting a result.
why_it_matters_vi: Dùng xác suất để mô tả bất định và đánh giá mức tin cậy của kết luận từ mẫu.
why_it_matters_en: Use probability and statistics to quantify uncertainty, sampling, and the reliability of conclusions.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Sampling and the law of large numbers” trong tài liệu tham khảo; đối chiếu với phần giải
  thích của bài.
- Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.
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
    task: 'Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.


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
    stretch: Add a failure test for sampling and the law of large numbers and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lấy mẫu và luật số lớn” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain sampling and the law of large numbers to a new teammate?
  - Which assumption behind sampling and the law of large numbers could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- CI₉₅% = x̄ ± 1.96·s/√n
- SE(x̄) = s/√n
code_examples:
- language: python
  title: 'Sampling and the law of large numbers: inspect one complete path'
  code: '# Topic: Sampling and the law of large numbers (phase-02-math-ml-probability-4)

    from collections import Counter


    samples = [''pass'', ''pass'', ''fail'', ''pass'']

    counts = Counter(samples)

    probability_pass = counts[''pass''] / len(samples)

    print({''counts'': dict(counts), ''p_pass'': probability_pass})'
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for sampling and the law of large numbers.
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
- title: SciPy Statistics Reference
  url: https://docs.scipy.org/doc/scipy/reference/stats.html
  language: en
  purpose_vi: Tra cứu phân phối và phép thống kê để kiểm chứng mô phỏng.
  read_vi: Chọn một phân phối, ghi tham số và so sánh đặc điểm lý thuyết với mẫu mô phỏng.
  purpose_en: Reference distributions and statistics for simulation checks.
  read_en: Choose one distribution, record parameters, and compare theory with samples.
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
- exercise-2-probability
review_item_ids:
- phase-02-math-ml-probability-4-recall
- phase-02-math-ml-probability-4-application
- phase-02-math-ml-probability-4-debug
- phase-02-math-ml-probability-4-interview
estimated_minutes: 45
completion_checklist:
- Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn.
common_mistakes:
- Kết luận về cả phân phối chỉ từ một mẫu nhỏ.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-optimization-1
- phase-02-math-ml-optimization-2
review_question_vi: Nội dung cốt lõi của “Lấy mẫu và luật số lớn” là gì?
review_question_en: Define sampling and the law of large numbers in your own words. What are the input, transformation
  and output?
review_answer_vi: Lấy mẫu giúp ước lượng đặc điểm quần thể từ một phần dữ liệu. Luật số lớn giải thích sự ổn định
  của trung bình mẫu dưới các điều kiện thích hợp; tăng số mẫu không tự sửa sai lệch do cách chọn mẫu.
review_answer_en: A strong answer names the input, transformation, output and the context where sampling and the
  law of large numbers is used. Relate it specifically to sampling and the law of large numbers in lesson phase-02-math-ml-probability-4.
review_cards:
- id: phase-02-math-ml-probability-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lấy mẫu và luật số lớn” là gì?
  question_en: Define sampling and the law of large numbers in your own words. What are the input, transformation
    and output?
  answer_vi: Lấy mẫu giúp ước lượng đặc điểm quần thể từ một phần dữ liệu. Luật số lớn giải thích sự ổn định của
    trung bình mẫu dưới các điều kiện thích hợp; tăng số mẫu không tự sửa sai lệch do cách chọn mẫu.
  answer_en: A strong answer names the input, transformation, output and the context where sampling and the law
    of large numbers is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-probability-4-application
  type: application
  question_vi: Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.
  question_en: Write a small code example or design that applies sampling and the law of large numbers to an AI
    engineering problem.
  answer_vi: 'Với nhiệm vụ “Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu”, cần lưu: bảng
    tính hoặc kết quả mô phỏng có tham số và cách lấy mẫu. Phân biệt giá trị lý thuyết với kết quả quan sát từ một
    mẫu hữu hạn.'
  answer_en: The sampling and the law of large numbers example should have an explicit input, expected output and
    a way to run or verify it (phase-02-math-ml-probability-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-probability-4-debug
  type: debug
  question_vi: Khi làm bài “Lấy mẫu và luật số lớn”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If sampling and the law of large numbers produces a wrong result or a metric drops, what would you
    debug first?
  answer_vi: 'Trong bài “Lấy mẫu và luật số lớn”, lỗi cần tránh là: kết luận về cả phân phối chỉ từ một mẫu nhỏ.
    Phân biệt giá trị lý thuyết với kết quả quan sát từ một mẫu hữu hạn. Dùng ví dụ nhỏ để tìm bước đầu tiên có
    kết quả khác dự kiến.'
  answer_en: For sampling and the law of large numbers, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-02-math-ml-probability-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-probability-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lấy mẫu và luật số lớn” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of sampling and the law of large
    numbers?
  answer_vi: Bắt đầu từ nhiệm vụ “Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about sampling and the law of large numbers should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-02-math-ml-probability-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Lấy mẫu và luật số lớn / Sampling and the law of large numbers

Lấy mẫu giúp ước lượng đặc điểm quần thể từ một phần dữ liệu. Luật số lớn giải thích sự ổn định của trung bình mẫu dưới các điều kiện thích hợp; tăng số mẫu không tự sửa sai lệch do cách chọn mẫu.

## Thực hành

Mô phỏng trung bình với các cỡ mẫu khác nhau và ghi rõ cách lấy mẫu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Mô phỏng phân phối, thay cỡ mẫu, vẽ biểu đồ tần suất và ghi giả định trước khi kết luận.
