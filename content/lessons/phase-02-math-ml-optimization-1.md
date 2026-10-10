---
lesson_id: phase-02-math-ml-optimization-1
phase_id: phase-02-math-ml
module_id: optimization
title_vi: Độ chệch, phương sai và quá khớp
title_en: Bias, variance and overfitting
summary_vi: Mô hình quá đơn giản có thể bỏ sót quy luật, còn mô hình quá linh hoạt dễ học cả nhiễu của mẫu huấn
  luyện.
summary_en: Learn Bias, variance and overfitting through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain bias, variance and overfitting with a concrete example.
- Write or adapt a small code example applying bias, variance and overfitting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-probability-4
- phase-01-python-software-python-core-1
key_terms:
- bias
- variance
- overfitting
- NumPy
- vector
- gradient
- optimization
concept_notes_vi: Mô hình quá đơn giản có thể bỏ sót quy luật, còn mô hình quá linh hoạt dễ học cả nhiễu của mẫu
  huấn luyện. So sánh kết quả huấn luyện và kiểm định giúp nhận ra dấu hiệu thiếu khớp hoặc quá khớp.
concept_notes_en: Bias, variance và overfitting quantifies uncertainty instead of returning only a prediction. Distinguish
  conditional from marginal probability, population from sample, and state distribution or confidence-interval assumptions
  before interpreting a result.
why_it_matters_vi: Xác định hàm mục tiêu và cách cập nhật để hiểu mô hình đang học điều gì.
why_it_matters_en: Understand objectives, loss landscapes, regularization, and optimizers so you know what a model
  is optimizing.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Bias, variance and overfitting” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Understand objectives, loss landscapes, regularization, and optimizers so
  you know what a model is optimizing.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Implement minimal linear/logistic regression, plot loss curves, and compare learning
  rate, SGD, momentum, and Adam.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cài đặt hồi quy tuyến tính hoặc logistic
      tối giản; vẽ đồ thị mất mát, so sánh tốc độ học, SGD, momentum và Adam.'
    deliverables:
    - Cấu hình thí nghiệm và bảng hoặc đồ thị hàm mục tiêu
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Implement minimal linear/logistic regression, plot loss curves, and compare learning rate, SGD, momentum,
      and Adam.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can predict signs of underfitting, overfitting, exploding updates, and choose a metric to verify
      them.
    stretch: Add a failure test for bias, variance and overfitting and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Độ chệch, phương sai và quá khớp” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain bias, variance and overfitting to a new teammate?
  - Which assumption behind bias, variance and overfitting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- E[(ŷ − y)²] = Bias² + Variance + Noise
- Var(X) = E[(X − E[X])²]
code_examples:
- language: python
  title: 'Bias, variance and overfitting: inspect one complete path'
  code: '# Topic: Bias, variance and overfitting (phase-02-math-ml-optimization-1)

    from collections import Counter


    samples = [''pass'', ''pass'', ''fail'', ''pass'']

    counts = Counter(samples)

    probability_pass = counts[''pass''] / len(samples)

    print({''counts'': dict(counts), ''p_pass'': probability_pass})'
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for bias, variance and overfitting.
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
- exercise-2-optimization
review_item_ids:
- phase-02-math-ml-optimization-1-recall
- phase-02-math-ml-optimization-1-application
- phase-02-math-ml-optimization-1-debug
- phase-02-math-ml-optimization-1-interview
estimated_minutes: 45
completion_checklist:
- Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá.
common_mistakes:
- Đổi tốc độ học, dữ liệu và số bước cùng lúc rồi quy kết nguyên nhân.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-optimization-2
- phase-02-math-ml-optimization-3
review_question_vi: Nội dung cốt lõi của “Độ chệch, phương sai và quá khớp” là gì?
review_question_en: Define bias, variance and overfitting in your own words. What are the input, transformation
  and output?
review_answer_vi: Mô hình quá đơn giản có thể bỏ sót quy luật, còn mô hình quá linh hoạt dễ học cả nhiễu của mẫu
  huấn luyện. So sánh kết quả huấn luyện và kiểm định giúp nhận ra dấu hiệu thiếu khớp hoặc quá khớp.
review_answer_en: A strong answer names the input, transformation, output and the context where bias, variance and
  overfitting is used. Relate it specifically to bias, variance and overfitting in lesson phase-02-math-ml-optimization-1.
review_cards:
- id: phase-02-math-ml-optimization-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Độ chệch, phương sai và quá khớp” là gì?
  question_en: Define bias, variance and overfitting in your own words. What are the input, transformation and output?
  answer_vi: Mô hình quá đơn giản có thể bỏ sót quy luật, còn mô hình quá linh hoạt dễ học cả nhiễu của mẫu huấn
    luyện. So sánh kết quả huấn luyện và kiểm định giúp nhận ra dấu hiệu thiếu khớp hoặc quá khớp.
  answer_en: A strong answer names the input, transformation, output and the context where bias, variance and overfitting
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-optimization-1-application
  type: application
  question_vi: Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.
  question_en: Write a small code example or design that applies bias, variance and overfitting to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau”,
    cần lưu: cấu hình thí nghiệm và bảng hoặc đồ thị hàm mục tiêu. So sánh các lần chạy khi giữ nguyên dữ liệu và
    điều kiện đánh giá.'
  answer_en: The bias, variance and overfitting example should have an explicit input, expected output and a way
    to run or verify it (phase-02-math-ml-optimization-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-optimization-1-debug
  type: debug
  question_vi: Khi làm bài “Độ chệch, phương sai và quá khớp”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If bias, variance and overfitting produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Độ chệch, phương sai và quá khớp”, lỗi cần tránh là: đổi tốc độ học, dữ liệu và số bước
    cùng lúc rồi quy kết nguyên nhân. So sánh các lần chạy khi giữ nguyên dữ liệu và điều kiện đánh giá. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For bias, variance and overfitting, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-02-math-ml-optimization-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-optimization-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Độ chệch, phương sai và quá khớp” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of bias, variance and overfitting?
  answer_vi: Bắt đầu từ nhiệm vụ “Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about bias, variance and overfitting should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-02-math-ml-optimization-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Độ chệch, phương sai và quá khớp / Bias, variance and overfitting

Mô hình quá đơn giản có thể bỏ sót quy luật, còn mô hình quá linh hoạt dễ học cả nhiễu của mẫu huấn luyện. So sánh kết quả huấn luyện và kiểm định giúp nhận ra dấu hiệu thiếu khớp hoặc quá khớp.

## Thực hành

Đối chiếu sai số huấn luyện và kiểm định của hai mô hình có độ phức tạp khác nhau.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Cài đặt hồi quy tuyến tính hoặc logistic tối giản; vẽ đồ thị mất mát, so sánh tốc độ học, SGD, momentum và Adam.
