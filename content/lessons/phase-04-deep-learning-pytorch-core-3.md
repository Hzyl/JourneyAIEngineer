---
lesson_id: phase-04-deep-learning-pytorch-core-3
phase_id: phase-04-deep-learning
module_id: pytorch-core
title_vi: Dataset và DataLoader
title_en: Datasets and DataLoaders
summary_vi: Học Dataset và DataLoader qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn Datasets and DataLoaders through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích dataset và dataloader bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng dataset và dataloader.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
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
concept_notes_vi: Dataset và DataLoader là khái niệm của module pytorch-core. Hãy xác định input, output, giả định, failure
  mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.
concept_notes_en: Dataset và DataLoader is a concept in the pytorch-core module. Identify the inputs, outputs, assumptions,
  failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Đọc tensor shape, dataset và autograd để tự viết được training loop nhỏ bằng PyTorch.
why_it_matters_en: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch training loop.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Đọc tensor shape, dataset và autograd để tự viết được training loop nhỏ bằng PyTorch.'
- Mở PyTorch Tutorials, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Tạo Dataset giả, DataLoader, in batch shape và kiểm tra gradient của một layer bằng tay.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Read tensor shapes, datasets, and autograd well enough to write a small PyTorch training
  loop.'
- Open PyTorch Tutorials, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Create a toy Dataset and DataLoader, print batch shapes, and inspect a layer''s gradient manually.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Tạo Dataset giả, DataLoader, in batch shape và kiểm tra gradient của một layer bằng tay.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được batch dimension, train/eval mode, dtype và device của từng tensor.
    stretch: Viết thêm một failure test cho dataset và dataloader và giải thích kết quả.
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
  - Bạn sẽ giải thích dataset và dataloader cho một đồng đội mới như thế nào?
  - Một assumption nào của dataset và dataloader có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
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
  code: "# Topic: Datasets and DataLoaders (phase-04-deep-learning-pytorch-core-3)\nfrom dataclasses import dataclass\n\n\
    @dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của dataset và dataloader.
  purpose_en: Illustrate the input-to-output path for datasets and dataloaders.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Data Loading
  url: https://pytorch.org/tutorials/beginner/basics/data_tutorial.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: PyTorch Optimization
  url: https://pytorch.org/docs/stable/optim.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: PyTorch Fundamentals
  url: https://pytorch.org/tutorials/beginner/basics/intro.html
  language: en
  purpose_vi: Học tensor, Dataset, DataLoader và training loop theo flow chính thức.
  read_vi: Đọc data, model, autograd và optimization theo thứ tự.
  purpose_en: Learn tensors, datasets, dataloaders, and loops from the official flow.
  read_en: Read data, models, autograd, and optimization in that order.
  kind: official
  required: true
- title: Giải thích tiếng Việt và checklist của lesson
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Phần giải thích, code example, checklist và tiêu chí hoàn thành ngay trong app.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc theo thứ tự Study plan → Concept notes → Code example → Practice plan.
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
- Giải thích được input, biến đổi và output của dataset và dataloader.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng dataset và dataloader và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng dataset và dataloader.
- Đánh giá dataset và dataloader bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ dataset và dataloader mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-04-deep-learning-pytorch-core-4
- phase-04-deep-learning-training-1
review_question_vi: Định nghĩa dataset và dataloader bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define datasets and dataloaders in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dataset và dataloader. Hãy liên
  hệ cụ thể với dataset và dataloader trong lesson phase-04-deep-learning-pytorch-core-3.
review_answer_en: A strong answer names the input, transformation, output and the context where datasets and dataloaders is
  used. Relate it specifically to datasets and dataloaders in lesson phase-04-deep-learning-pytorch-core-3.
review_cards:
- id: phase-04-deep-learning-pytorch-core-3-recall
  type: recall
  question_vi: Định nghĩa dataset và dataloader bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define datasets and dataloaders in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng dataset và dataloader.
  answer_en: A strong answer names the input, transformation, output and the context where datasets and dataloaders is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-04-deep-learning-pytorch-core-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng dataset và dataloader cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies datasets and dataloaders to an AI engineering problem.
  answer_vi: Ví dụ cho dataset và dataloader cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-04-deep-learning-pytorch-core-3).
  answer_en: The datasets and dataloaders example should have an explicit input, expected output and a way to run or verify
    it (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-04-deep-learning-pytorch-core-3-debug
  type: debug
  question_vi: Nếu kết quả của dataset và dataloader sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If datasets and dataloaders produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với dataset và dataloader, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test
    nhỏ và error analysis (phase-04-deep-learning-pytorch-core-3).
  answer_en: For datasets and dataloaders, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-04-deep-learning-pytorch-core-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của dataset và dataloader như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of datasets and dataloaders?
  answer_vi: Câu trả lời về dataset và dataloader cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-04-deep-learning-pytorch-core-3).
  answer_en: The answer about datasets and dataloaders should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-04-deep-learning-pytorch-core-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Dataset và DataLoader / Datasets and DataLoaders

Dataset và DataLoader là khái niệm của module pytorch-core. Hãy xác định input, output, giả định, failure mode và cách kiểm chứng bằng một ví dụ nhỏ trước khi mở rộng sang project.

## Practice

Tạo Dataset giả, DataLoader, in batch shape và kiểm tra gradient của một layer bằng tay.
