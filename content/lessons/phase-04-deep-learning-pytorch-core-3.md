---
lesson_id: phase-04-deep-learning-pytorch-core-3
phase_id: phase-04-deep-learning
module_id: pytorch-core
title_vi: Dataset và DataLoader
title_en: Datasets and DataLoaders
summary_vi: Dataset định nghĩa cách lấy một mẫu; DataLoader tổ chức mẫu thành lô và điều khiển cách duyệt dữ liệu.
summary_en: Learn Datasets and DataLoaders through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain datasets and dataloaders with a concrete example.
- Write or adapt a small code example applying datasets and dataloaders.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-04-deep-learning-pytorch-core-2
- phase-03-classical-ml-ml-framing-1
key_terms:
- dataset
- dataloader
- PyTorch
- tensor
- loss
- training
- pytorch-core
concept_notes_vi: Dataset định nghĩa cách lấy một mẫu; DataLoader tổ chức mẫu thành lô và điều khiển cách duyệt
  dữ liệu. Kiểm tra một lô trước khi huấn luyện giúp phát hiện sai kiểu, nhãn hoặc kích thước.
concept_notes_en: Dataset và DataLoader is a concept in the pytorch-core module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Hiểu kích thước tensor, cách lấy dữ liệu và gradient để tự viết vòng lặp huấn luyện.
why_it_matters_en: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch training loop.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Datasets and DataLoaders” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.
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
    task: 'Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.


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
    stretch: Add a failure test for datasets and dataloaders and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Dataset và DataLoader” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain datasets and dataloaders to a new teammate?
  - Which assumption behind datasets and dataloaders could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- z = Wx + b
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: 'Datasets and DataLoaders: inspect one complete path'
  code: "# Topic: Datasets and DataLoaders (phase-04-deep-learning-pytorch-core-3)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for datasets and dataloaders.
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
- title: PyTorch Fundamentals
  url: https://pytorch.org/tutorials/beginner/basics/intro.html
  language: en
  purpose_vi: Học tensor, Dataset, DataLoader và vòng lặp huấn luyện theo luồng xử lý chính thức.
  read_vi: Lần lượt đọc phần dữ liệu, mô hình, autograd và tối ưu hóa.
  purpose_en: Learn tensors, datasets, dataloaders, and loops from the official flow.
  read_en: Read data, models, autograd, and optimization in that order.
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
- exercise-4-pytorch-core
review_item_ids:
- phase-04-deep-learning-pytorch-core-3-recall
- phase-04-deep-learning-pytorch-core-3-application
- phase-04-deep-learning-pytorch-core-3-debug
- phase-04-deep-learning-pytorch-core-3-interview
estimated_minutes: 60
completion_checklist:
- Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán.
common_mistakes:
- Nhầm trục dữ liệu hoặc ghép tensor khác thiết bị.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-04-deep-learning-pytorch-core-4
- phase-04-deep-learning-training-1
review_question_vi: Nội dung cốt lõi của “Dataset và DataLoader” là gì?
review_question_en: Define datasets and dataloaders in your own words. What are the input, transformation and output?
review_answer_vi: Dataset định nghĩa cách lấy một mẫu; DataLoader tổ chức mẫu thành lô và điều khiển cách duyệt
  dữ liệu. Kiểm tra một lô trước khi huấn luyện giúp phát hiện sai kiểu, nhãn hoặc kích thước.
review_answer_en: A strong answer names the input, transformation, output and the context where datasets and dataloaders
  is used. Relate it specifically to datasets and dataloaders in lesson phase-04-deep-learning-pytorch-core-3.
review_cards:
- id: phase-04-deep-learning-pytorch-core-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Dataset và DataLoader” là gì?
  question_en: Define datasets and dataloaders in your own words. What are the input, transformation and output?
  answer_vi: Dataset định nghĩa cách lấy một mẫu; DataLoader tổ chức mẫu thành lô và điều khiển cách duyệt dữ liệu.
    Kiểm tra một lô trước khi huấn luyện giúp phát hiện sai kiểu, nhãn hoặc kích thước.
  answer_en: A strong answer names the input, transformation, output and the context where datasets and dataloaders
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-pytorch-core-3-application
  type: application
  question_vi: Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.
  question_en: Write a small code example or design that applies datasets and dataloaders to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn”, cần lưu: ví dụ tensor
    hoặc DataLoader có kích thước, kiểu và thiết bị. Theo dõi từng phép biến đổi và đối chiếu với kích thước dự
    đoán.'
  answer_en: The datasets and dataloaders example should have an explicit input, expected output and a way to run
    or verify it (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-pytorch-core-3-debug
  type: debug
  question_vi: Khi làm bài “Dataset và DataLoader”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If datasets and dataloaders produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Dataset và DataLoader”, lỗi cần tránh là: nhầm trục dữ liệu hoặc ghép tensor khác thiết
    bị. Theo dõi từng phép biến đổi và đối chiếu với kích thước dự đoán. Dùng ví dụ nhỏ để tìm bước đầu tiên có
    kết quả khác dự kiến.'
  answer_en: For datasets and dataloaders, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-pytorch-core-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Dataset và DataLoader” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of datasets and dataloaders?
  answer_vi: Bắt đầu từ nhiệm vụ “Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about datasets and dataloaders should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dataset và DataLoader / Datasets and DataLoaders

Dataset định nghĩa cách lấy một mẫu; DataLoader tổ chức mẫu thành lô và điều khiển cách duyệt dữ liệu. Kiểm tra một lô trước khi huấn luyện giúp phát hiện sai kiểu, nhãn hoặc kích thước.

## Thực hành

Lấy một lô từ DataLoader và kiểm tra kích thước dữ liệu cùng nhãn.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo Dataset với dữ liệu mẫu, đọc một lô qua DataLoader, ghi kích thước rồi kiểm tra gradient của một lớp bằng tay.
