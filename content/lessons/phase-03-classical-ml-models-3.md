---
lesson_id: phase-03-classical-ml-models-3
phase_id: phase-03-classical-ml
module_id: models
title_vi: Decision tree và random forest
title_en: Decision trees and random forests
summary_vi: Học Decision tree và random forest qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn Decision trees and random forests through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Giải thích decision tree và random forest bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng decision tree và random forest.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain decision trees and random forests with a concrete example.
- Write or adapt a small code example applying decision trees and random forests.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- decision
- tree
- random
- forest
- dataset
- feature
- baseline
- evaluation
- models
concept_notes_vi: Decision tree và random forest mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation,
  status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu
  rỗng hoặc sai kiểu.
concept_notes_en: Decision tree và random forest describes a boundary between data and a service. A sound request has a schema,
  validation, status code, timeout, and actionable errors; a sound query uses parameter binding, appropriate indexes, and
  tests empty or malformed data.
why_it_matters_vi: So sánh model bằng giả định, độ phức tạp và error pattern thay vì chạy nhiều model không có baseline.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without a baseline.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: So sánh model bằng giả định, độ phức tạp và error pattern thay vì chạy nhiều model không
  có baseline.'
- Mở scikit-learn User Guide, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng
  model.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Compare models by assumptions, complexity, and error patterns instead of trying many
  models without a baseline.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Train a simple model first, add trees/boosting, and record metrics plus a representative error
  for each model.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng model.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn giải thích được trade-off giữa interpretability, latency, data size và quality.
    stretch: Viết thêm một failure test cho decision tree và random forest và giải thích kết quả.
  en:
    task: Train a simple model first, add trees/boosting, and record metrics plus a representative error for each model.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can explain trade-offs among interpretability, latency, data size, and quality.
    stretch: Add a failure test for decision trees and random forests and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích decision tree và random forest cho một đồng đội mới như thế nào?
  - Một assumption nào của decision tree và random forest có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain decision trees and random forests to a new teammate?
  - Which assumption behind decision trees and random forests could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Decision trees and random forests: inspect one complete path'
  code: '# Topic: Decision trees and random forests (phase-03-classical-ml-models-3)

    from collections import Counter


    samples = [''pass'', ''pass'', ''fail'', ''pass'']

    counts = Counter(samples)

    probability_pass = counts[''pass''] / len(samples)

    print({''counts'': dict(counts), ''p_pass'': probability_pass})'
  status: runnable
  purpose_vi: Minh họa đường đi input → output của decision tree và random forest.
  purpose_en: Illustrate the input-to-output path for decision trees and random forests.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Tách mẫu quan sát khỏi ước lượng; luôn nêu kích thước mẫu và giả định độc lập.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
  language: en
  purpose_vi: Nắm request, response, method, status và JSON boundary.
  read_vi: Đọc request/response cycle, status code và content type.
  purpose_en: Learn request, response, methods, status codes, and JSON boundaries.
  read_en: Read the request/response cycle, status codes, and content types.
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
- exercise-3-models
review_item_ids:
- phase-03-classical-ml-models-3-recall
- phase-03-classical-ml-models-3-application
- phase-03-classical-ml-models-3-debug
- phase-03-classical-ml-models-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của decision tree và random forest.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng decision tree và random forest và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng decision tree và random forest.
- Đánh giá decision tree và random forest bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ decision tree và random forest mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-03-classical-ml-models-4
- phase-03-classical-ml-preprocessing-1
review_question_vi: Định nghĩa decision tree và random forest bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define decision trees and random forests in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng decision tree và random forest.
  Hãy liên hệ cụ thể với decision tree và random forest trong lesson phase-03-classical-ml-models-3.
review_answer_en: A strong answer names the input, transformation, output and the context where decision trees and random
  forests is used. Relate it specifically to decision trees and random forests in lesson phase-03-classical-ml-models-3.
review_cards:
- id: phase-03-classical-ml-models-3-recall
  type: recall
  question_vi: Định nghĩa decision tree và random forest bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define decision trees and random forests in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng decision tree và random forest.
  answer_en: A strong answer names the input, transformation, output and the context where decision trees and random forests
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-03-classical-ml-models-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng decision tree và random forest cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies decision trees and random forests to an AI engineering problem.
  answer_vi: Ví dụ cho decision tree và random forest cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-03-classical-ml-models-3).
  answer_en: The decision trees and random forests example should have an explicit input, expected output and a way to run
    or verify it (phase-03-classical-ml-models-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-03-classical-ml-models-3-debug
  type: debug
  question_vi: Nếu kết quả của decision tree và random forest sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If decision trees and random forests produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với decision tree và random forest, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi
    bằng test nhỏ và error analysis (phase-03-classical-ml-models-3).
  answer_en: For decision trees and random forests, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-03-classical-ml-models-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-03-classical-ml-models-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của decision tree và random forest như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of decision trees and random forests?
  answer_vi: Câu trả lời về decision tree và random forest cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro
    trong production (phase-03-classical-ml-models-3).
  answer_en: The answer about decision trees and random forests should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-03-classical-ml-models-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Decision tree và random forest / Decision trees and random forests

Decision tree và random forest mô tả một boundary giữa dữ liệu và service. Một request tốt có schema, validation, status code, timeout và thông tin lỗi có thể hành động; query tốt có parameter binding, index phù hợp và test cho dữ liệu rỗng hoặc sai kiểu.

## Practice

Huấn luyện model đơn giản trước, thêm tree/boosting, ghi metric và một ví dụ lỗi tiêu biểu cho từng model.
