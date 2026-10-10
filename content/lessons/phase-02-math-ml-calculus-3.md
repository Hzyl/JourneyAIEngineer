---
lesson_id: phase-02-math-ml-calculus-3
phase_id: phase-02-math-ml
module_id: calculus
title_vi: Gradient và đường đồng mức
title_en: Gradients and level sets
summary_vi: Gradient tập hợp các đạo hàm riêng và chỉ hướng tăng nhanh nhất tại một điểm theo khoảng cách Euclid.
summary_en: Learn Gradients and level sets through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain gradients and level sets with a concrete example.
- Write or adapt a small code example applying gradients and level sets.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-calculus-2
- phase-01-python-software-python-core-1
key_terms:
- gradient
- level
- set
- NumPy
- vector
- optimization
- calculus
concept_notes_vi: Gradient tập hợp các đạo hàm riêng và chỉ hướng tăng nhanh nhất tại một điểm theo khoảng cách
  Euclid. Đường đồng mức nối các điểm có cùng giá trị hàm, giúp hình dung bài toán tối ưu.
concept_notes_en: Gradient và level set describes how an output changes when a parameter changes. Use finite differences
  on a small input to check a gradient, then trace the chain rule through each transformation; gradient sign and
  scale determine whether updates are stable.
why_it_matters_vi: Hiểu đạo hàm và quy tắc dây chuyền để giải thích cách cập nhật tham số.
why_it_matters_en: Understand derivatives, gradients, and the chain rule as parameter-update mechanisms rather than
  isolated formulas.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Gradients and level sets” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Understand derivatives, gradients, and the chain rule as parameter-update
  mechanisms rather than isolated formulas.'
- Open NumPy Linear Algebra, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Plot a one-variable loss, calculate the gradient by hand, check it with finite differences,
  then compare autograd.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Vẽ hàm mất mát một biến, tính gradient
      bằng tay, kiểm tra bằng sai phân rồi đối chiếu với autograd.'
    deliverables:
    - Phép tính đạo hàm có các bước trung gian
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Plot a one-variable loss, calculate the gradient by hand, check it with finite differences, then compare
      autograd.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain gradient sign, learning rate, and why a wrong gradient breaks training.
    stretch: Add a failure test for gradients and level sets and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Gradient và đường đồng mức” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain gradients and level sets to a new teammate?
  - Which assumption behind gradients and level sets could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Gradients and level sets: inspect one complete path'
  code: "# Topic: Gradients and level sets (phase-02-math-ml-calculus-3)\ndef finite_difference(f, x, step=1e-5):\n\
    \    if step <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step))\
    \ / (2 * step)\n\nprint(round(finite_difference(lambda value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for gradients and level sets.
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
- exercise-2-calculus
review_item_ids:
- phase-02-math-ml-calculus-3-recall
- phase-02-math-ml-calculus-3-application
- phase-02-math-ml-calculus-3-debug
- phase-02-math-ml-calculus-3-interview
estimated_minutes: 45
completion_checklist:
- Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
common_mistakes:
- Quên hệ số từ quy tắc dây chuyền hoặc nhầm dấu gradient.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-calculus-4
- phase-02-math-ml-probability-1
review_question_vi: Nội dung cốt lõi của “Gradient và đường đồng mức” là gì?
review_question_en: Define gradients and level sets in your own words. What are the input, transformation and output?
review_answer_vi: Gradient tập hợp các đạo hàm riêng và chỉ hướng tăng nhanh nhất tại một điểm theo khoảng cách
  Euclid. Đường đồng mức nối các điểm có cùng giá trị hàm, giúp hình dung bài toán tối ưu.
review_answer_en: A strong answer names the input, transformation, output and the context where gradients and level
  sets is used. Relate it specifically to gradients and level sets in lesson phase-02-math-ml-calculus-3.
review_cards:
- id: phase-02-math-ml-calculus-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Gradient và đường đồng mức” là gì?
  question_en: Define gradients and level sets in your own words. What are the input, transformation and output?
  answer_vi: Gradient tập hợp các đạo hàm riêng và chỉ hướng tăng nhanh nhất tại một điểm theo khoảng cách Euclid.
    Đường đồng mức nối các điểm có cùng giá trị hàm, giúp hình dung bài toán tối ưu.
  answer_en: A strong answer names the input, transformation, output and the context where gradients and level sets
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-calculus-3-application
  type: application
  question_vi: Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.
  question_en: Write a small code example or design that applies gradients and level sets to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient”, cần lưu: phép tính
    đạo hàm có các bước trung gian. So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.'
  answer_en: The gradients and level sets example should have an explicit input, expected output and a way to run
    or verify it (phase-02-math-ml-calculus-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-calculus-3-debug
  type: debug
  question_vi: Khi làm bài “Gradient và đường đồng mức”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If gradients and level sets produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Gradient và đường đồng mức”, lỗi cần tránh là: quên hệ số từ quy tắc dây chuyền hoặc nhầm
    dấu gradient. So sánh tính tay với sai phân hoặc autograd tại cùng một điểm. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For gradients and level sets, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-02-math-ml-calculus-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-calculus-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Gradient và đường đồng mức” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of gradients and level sets?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about gradients and level sets should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-02-math-ml-calculus-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Gradient và đường đồng mức / Gradients and level sets

Gradient tập hợp các đạo hàm riêng và chỉ hướng tăng nhanh nhất tại một điểm theo khoảng cách Euclid. Đường đồng mức nối các điểm có cùng giá trị hàm, giúp hình dung bài toán tối ưu.

## Thực hành

Vẽ đường đồng mức của hàm hai biến và xác định hướng âm gradient.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Vẽ hàm mất mát một biến, tính gradient bằng tay, kiểm tra bằng sai phân rồi đối chiếu với autograd.
