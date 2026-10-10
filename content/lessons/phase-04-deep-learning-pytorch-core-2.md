---
lesson_id: phase-04-deep-learning-pytorch-core-2
phase_id: phase-04-deep-learning
module_id: pytorch-core
title_vi: Quy tắc broadcasting
title_en: Broadcasting
summary_vi: Broadcasting cho phép tính với tensor có kích thước tương thích mà không cần tự sao chép dữ liệu.
summary_en: Learn Broadcasting through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain broadcasting with a concrete example.
- Write or adapt a small code example applying broadcasting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-pytorch-core-1
- phase-03-classical-ml-ml-framing-1
key_terms:
- broadcasting
- PyTorch
- tensor
- loss
- training
- pytorch-core
concept_notes_vi: Broadcasting cho phép tính với tensor có kích thước tương thích mà không cần tự sao chép dữ liệu.
  Phép toán chạy được không có nghĩa các chiều đã khớp đúng ý nghĩa bài toán.
concept_notes_en: Broadcasting is a concept in the pytorch-core module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Hiểu kích thước tensor, cách lấy dữ liệu và gradient để tự viết vòng lặp huấn luyện.
why_it_matters_en: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch training loop.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Broadcasting” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch
  training loop.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a toy Dataset and DataLoader, print batch shapes, and inspect a layer''s gradient
  manually.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo Dataset với dữ liệu mẫu, đọc một
      lô qua DataLoader, ghi kích thước rồi kiểm tra gradient của một lớp bằng tay.'
    deliverables:
    - Ví dụ tensor hoặc DataLoader có kích thước, kiểu và thiết bị
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a toy Dataset and DataLoader, print batch shapes, and inspect a layer's gradient manually.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain batch dimension, train/eval mode, dtype, and device for every tensor.
    stretch: Add a failure test for broadcasting and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Quy tắc broadcasting” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain broadcasting to a new teammate?
  - Which assumption behind broadcasting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Broadcasting: inspect one complete path'
  code: "# Topic: Broadcasting (phase-04-deep-learning-pytorch-core-2)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for broadcasting.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
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
- exercise-4-pytorch-core
review_item_ids:
- phase-04-deep-learning-pytorch-core-2-recall
- phase-04-deep-learning-pytorch-core-2-application
- phase-04-deep-learning-pytorch-core-2-debug
- phase-04-deep-learning-pytorch-core-2-interview
estimated_minutes: 60
completion_checklist:
- Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
common_mistakes:
- Nhầm trục dữ liệu hoặc ghép tensor khác thiết bị.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-04-deep-learning-pytorch-core-3
- phase-04-deep-learning-pytorch-core-4
review_question_vi: Nội dung cốt lõi của “Quy tắc broadcasting” là gì?
review_question_en: Define broadcasting in your own words. What are the input, transformation and output?
review_answer_vi: Broadcasting cho phép tính với tensor có kích thước tương thích mà không cần tự sao chép dữ liệu.
  Phép toán chạy được không có nghĩa các chiều đã khớp đúng ý nghĩa bài toán.
review_answer_en: A strong answer names the input, transformation, output and the context where broadcasting is
  used. Relate it specifically to broadcasting in lesson phase-04-deep-learning-pytorch-core-2.
review_cards:
- id: phase-04-deep-learning-pytorch-core-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Quy tắc broadcasting” là gì?
  question_en: Define broadcasting in your own words. What are the input, transformation and output?
  answer_vi: Broadcasting cho phép tính với tensor có kích thước tương thích mà không cần tự sao chép dữ liệu. Phép
    toán chạy được không có nghĩa các chiều đã khớp đúng ý nghĩa bài toán.
  answer_en: A strong answer names the input, transformation, output and the context where broadcasting is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-pytorch-core-2-application
  type: application
  question_vi: Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.
  question_en: Write a small code example or design that applies broadcasting to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau”, cần lưu:
    ví dụ tensor hoặc DataLoader có kích thước, kiểu và thiết bị. Theo dõi từng phép biến đổi và đối chiếu với kích
    thước dự đoán.'
  answer_en: The broadcasting example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-pytorch-core-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-pytorch-core-2-debug
  type: debug
  question_vi: Khi làm bài “Quy tắc broadcasting”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If broadcasting produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Quy tắc broadcasting”, lỗi cần tránh là: nhầm trục dữ liệu hoặc ghép tensor khác thiết
    bị. Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán. Dùng ví dụ nhỏ để tìm bước đầu tiên có
    kết quả khác dự kiến.'
  answer_en: For broadcasting, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-04-deep-learning-pytorch-core-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-pytorch-core-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Quy tắc broadcasting” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of broadcasting?
  answer_vi: Bắt đầu từ nhiệm vụ “Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about broadcasting should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-04-deep-learning-pytorch-core-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Quy tắc broadcasting / Broadcasting

Broadcasting cho phép tính với tensor có kích thước tương thích mà không cần tự sao chép dữ liệu. Phép toán chạy được không có nghĩa các chiều đã khớp đúng ý nghĩa bài toán.

## Thực hành

Dự đoán kích thước kết quả trước khi cộng hai tensor có số chiều khác nhau.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo Dataset với dữ liệu mẫu, đọc một lô qua DataLoader, ghi kích thước rồi kiểm tra gradient của một lớp bằng tay.
