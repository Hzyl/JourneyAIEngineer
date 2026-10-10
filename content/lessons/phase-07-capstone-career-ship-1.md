---
lesson_id: phase-07-capstone-career-ship-1
phase_id: phase-07-capstone-career
module_id: ship
title_vi: Mô hình cơ sở và sản phẩm tối thiểu
title_en: Baseline and MVP
summary_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị.
summary_en: Learn Baseline and MVP through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain baseline and mvp with a concrete example.
- Write or adapt a small code example applying baseline and mvp.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-07-capstone-career-problem-4
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- baseline
- mvp
- Python
- testing
- debugging
- maintainability
- ship
concept_notes_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá
  trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.
concept_notes_en: 'Baseline và MVP is a classical Machine Learning decision: define the label, baseline, split,
  and metric before choosing a model. Fit preprocessing on train only; error analysis should identify the groups
  where the model fails and how to retest the hypothesis.'
why_it_matters_vi: Hoàn thiện đồ án có thể chạy, đánh giá và trình bày rõ giới hạn.
why_it_matters_en: Turn the capstone into a product with a baseline, evaluation, demo, README, and explicit limitations.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Baseline and MVP” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Turn the capstone into a product with a baseline, evaluation, demo, README,
  and explicit limitations.'
- Open GitHub Docs, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Ship one local vertical slice, record tests/evaluation, make a short demo, and open
  issues for unfinished work.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Làm một luồng nhỏ chạy trọn trên máy,
      ghi kết quả kiểm thử, quay demo và ghi phần chưa hoàn thành.'
    deliverables:
    - Luồng sử dụng hoặc báo cáo có kết quả kiểm tra và giới hạn
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Ship one local vertical slice, record tests/evaluation, make a short demo, and open issues for unfinished
      work.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: Another person can clone the repo and run the demo from the README without your help.
    stretch: Add a failure test for baseline and mvp and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Mô hình cơ sở và sản phẩm tối thiểu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain baseline and mvp to a new teammate?
  - Which assumption behind baseline and mvp could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Baseline and MVP: inspect one complete path'
  code: "# Topic: Baseline and MVP (phase-07-capstone-career-ship-1)\ndef accuracy(y_true: list[int], y_pred: list[int])\
    \ -> float:\n    if len(y_true) != len(y_pred) or not y_true:\n        raise ValueError('non-empty aligned labels\
    \ are required')\n    return sum(a == b for a, b in zip(y_true, y_pred)) / len(y_true)\n\nprint(accuracy([1,\
    \ 0, 1], [1, 1, 1]))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for baseline and mvp.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: GitHub Docs
  url: https://docs.github.com/en
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Google Engineering Practices
  url: https://google.github.io/eng-practices/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Twelve-Factor App
  url: https://12factor.net/
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
- exercise-7-ship
review_item_ids:
- phase-07-capstone-career-ship-1-recall
- phase-07-capstone-career-ship-1-application
- phase-07-capstone-career-ship-1-debug
- phase-07-capstone-career-ship-1-interview
estimated_minutes: 60
completion_checklist:
- Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
common_mistakes:
- Trình bày bản demo như sản phẩm hoàn chỉnh khi chưa kiểm chứng cách chạy lại.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-07-capstone-career-ship-2
- phase-07-capstone-career-ship-3
review_question_vi: Nội dung cốt lõi của “Mô hình cơ sở và sản phẩm tối thiểu” là gì?
review_question_en: Define baseline and mvp in your own words. What are the input, transformation and output?
review_answer_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá
  trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.
review_answer_en: A strong answer names the input, transformation, output and the context where baseline and mvp
  is used. Relate it specifically to baseline and mvp in lesson phase-07-capstone-career-ship-1.
review_cards:
- id: phase-07-capstone-career-ship-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Mô hình cơ sở và sản phẩm tối thiểu” là gì?
  question_en: Define baseline and mvp in your own words. What are the input, transformation and output?
  answer_vi: Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị.
    Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.
  answer_en: A strong answer names the input, transformation, output and the context where baseline and mvp is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-ship-1-application
  type: application
  question_vi: Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.
  question_en: Write a small code example or design that applies baseline and mvp to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh”, cần lưu: luồng sử
    dụng hoặc báo cáo có kết quả kiểm tra và giới hạn. Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.'
  answer_en: The baseline and mvp example should have an explicit input, expected output and a way to run or verify
    it (phase-07-capstone-career-ship-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-ship-1-debug
  type: debug
  question_vi: Khi làm bài “Mô hình cơ sở và sản phẩm tối thiểu”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If baseline and mvp produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Mô hình cơ sở và sản phẩm tối thiểu”, lỗi cần tránh là: trình bày bản demo như sản phẩm
    hoàn chỉnh khi chưa kiểm chứng cách chạy lại. Để người khác làm theo hướng dẫn và ghi các bước còn thiếu. Dùng
    ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For baseline and mvp, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-07-capstone-career-ship-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-ship-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Mô hình cơ sở và sản phẩm tối thiểu” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of baseline and mvp?
  answer_vi: Bắt đầu từ nhiệm vụ “Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about baseline and mvp should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-07-capstone-career-ship-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Mô hình cơ sở và sản phẩm tối thiểu / Baseline and MVP

Mô hình cơ sở cung cấp mốc chất lượng; sản phẩm tối thiểu kiểm chứng một luồng sử dụng có giá trị. Giới hạn phạm vi giúp đo phản hồi sớm và quyết định có nên đầu tư thêm.

## Thực hành

Chọn luồng nhỏ chạy được từ đầu tới cuối và xác định mốc so sánh.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Làm một luồng nhỏ chạy trọn trên máy, ghi kết quả kiểm thử, quay demo và ghi phần chưa hoàn thành.
