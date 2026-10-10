---
lesson_id: phase-02-math-ml-calculus-4
phase_id: phase-02-math-ml
module_id: calculus
title_vi: Quy tắc dây chuyền trong mạng nơ-ron
title_en: The chain rule in neural networks
summary_vi: Quy tắc dây chuyền tính đạo hàm của hàm hợp qua các bước trung gian.
summary_en: Learn The chain rule in neural networks through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain the chain rule in neural networks with a concrete example.
- Write or adapt a small code example applying the chain rule in neural networks.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-02-math-ml-calculus-3
- phase-01-python-software-python-core-1
key_terms:
- chain
- rule
- trong
- neural
- network
- NumPy
- vector
- gradient
- optimization
- calculus
concept_notes_vi: Quy tắc dây chuyền tính đạo hàm của hàm hợp qua các bước trung gian. Lan truyền ngược dùng quy
  tắc này để truyền ảnh hưởng của hàm mất mát về từng tham số trong mạng.
concept_notes_en: Chain rule trong neural network describes how an output changes when a parameter changes. Use
  finite differences on a small input to check a gradient, then trace the chain rule through each transformation;
  gradient sign and scale determine whether updates are stable.
why_it_matters_vi: Hiểu đạo hàm và quy tắc dây chuyền để giải thích cách cập nhật tham số.
why_it_matters_en: Understand derivatives, gradients, and the chain rule as parameter-update mechanisms rather than
  isolated formulas.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “The chain rule in neural networks” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.
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
    task: 'Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.


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
    stretch: Add a failure test for the chain rule in neural networks and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Quy tắc dây chuyền trong mạng nơ-ron” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain the chain rule in neural networks to a new teammate?
  - Which assumption behind the chain rule in neural networks could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- dL/dx = (dL/dy)(dy/dx)
code_examples:
- language: python
  title: 'The chain rule in neural networks: inspect one complete path'
  code: "# Topic: The chain rule in neural networks (phase-02-math-ml-calculus-4)\ndef finite_difference(f, x, step=1e-5):\n\
    \    if step <= 0:\n        raise ValueError('step must be positive')\n    return (f(x + step) - f(x - step))\
    \ / (2 * step)\n\nprint(round(finite_difference(lambda value: value ** 2, 3.0), 5))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for the chain rule in neural networks.
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
- title: PyTorch Autograd
  url: https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html
  language: en
  purpose_vi: Đối chiếu gradient tính tay với kết quả từ đồ thị tính toán.
  read_vi: Đọc về requires_grad, backward và cơ chế cộng dồn gradient.
  purpose_en: Compare hand-computed gradients with the computational graph.
  read_en: Read requires_grad, backward, and gradient accumulation.
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
- exercise-2-calculus
review_item_ids:
- phase-02-math-ml-calculus-4-recall
- phase-02-math-ml-calculus-4-application
- phase-02-math-ml-calculus-4-debug
- phase-02-math-ml-calculus-4-interview
estimated_minutes: 45
completion_checklist:
- Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.
common_mistakes:
- Quên hệ số từ quy tắc dây chuyền hoặc nhầm dấu gradient.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-02-math-ml-probability-1
- phase-02-math-ml-probability-2
review_question_vi: Nội dung cốt lõi của “Quy tắc dây chuyền trong mạng nơ-ron” là gì?
review_question_en: Define the chain rule in neural networks in your own words. What are the input, transformation
  and output?
review_answer_vi: Quy tắc dây chuyền tính đạo hàm của hàm hợp qua các bước trung gian. Lan truyền ngược dùng quy
  tắc này để truyền ảnh hưởng của hàm mất mát về từng tham số trong mạng.
review_answer_en: A strong answer names the input, transformation, output and the context where the chain rule in
  neural networks is used. Relate it specifically to the chain rule in neural networks in lesson phase-02-math-ml-calculus-4.
review_cards:
- id: phase-02-math-ml-calculus-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Quy tắc dây chuyền trong mạng nơ-ron” là gì?
  question_en: Define the chain rule in neural networks in your own words. What are the input, transformation and
    output?
  answer_vi: Quy tắc dây chuyền tính đạo hàm của hàm hợp qua các bước trung gian. Lan truyền ngược dùng quy tắc
    này để truyền ảnh hưởng của hàm mất mát về từng tham số trong mạng.
  answer_en: A strong answer names the input, transformation, output and the context where the chain rule in neural
    networks is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-02-math-ml-calculus-4-application
  type: application
  question_vi: Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.
  question_en: Write a small code example or design that applies the chain rule in neural networks to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd”, cần lưu: phép tính
    đạo hàm có các bước trung gian. So sánh tính tay với sai phân hoặc autograd tại cùng một điểm.'
  answer_en: The the chain rule in neural networks example should have an explicit input, expected output and a
    way to run or verify it (phase-02-math-ml-calculus-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-02-math-ml-calculus-4-debug
  type: debug
  question_vi: Khi làm bài “Quy tắc dây chuyền trong mạng nơ-ron”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If the chain rule in neural networks produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Quy tắc dây chuyền trong mạng nơ-ron”, lỗi cần tránh là: quên hệ số từ quy tắc dây chuyền
    hoặc nhầm dấu gradient. So sánh tính tay với sai phân hoặc autograd tại cùng một điểm. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For the chain rule in neural networks, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-02-math-ml-calculus-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-02-math-ml-calculus-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Quy tắc dây chuyền trong mạng nơ-ron” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of the chain rule in neural
    networks?
  answer_vi: Bắt đầu từ nhiệm vụ “Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about the chain rule in neural networks should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-02-math-ml-calculus-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Quy tắc dây chuyền trong mạng nơ-ron / The chain rule in neural networks

Quy tắc dây chuyền tính đạo hàm của hàm hợp qua các bước trung gian. Lan truyền ngược dùng quy tắc này để truyền ảnh hưởng của hàm mất mát về từng tham số trong mạng.

## Thực hành

Tính đạo hàm của một phép hợp đơn giản và đối chiếu với autograd.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Vẽ hàm mất mát một biến, tính gradient bằng tay, kiểm tra bằng sai phân rồi đối chiếu với autograd.
