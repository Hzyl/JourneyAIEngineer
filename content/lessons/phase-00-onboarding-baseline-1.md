---
lesson_id: phase-00-onboarding-baseline-1
phase_id: phase-00-onboarding
module_id: baseline
title_vi: Bài kiểm tra Python cơ bản
title_en: Python baseline assessment
summary_vi: Bài đánh giá giúp bạn nhận ra phần Python đã nắm chắc và phần cần luyện thêm.
summary_en: Learn Python baseline assessment through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.
- Làm lại một trường hợp khác trước khi kết luận đã nắm vững.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain python baseline assessment with a concrete example.
- Write or adapt a small code example applying python baseline assessment.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-environment-4
key_terms:
- bài
- kiểm
- tra
- python
- bản
- Python
- testing
- debugging
- maintainability
- baseline
concept_notes_vi: Bài đánh giá giúp bạn nhận ra phần Python đã nắm chắc và phần cần luyện thêm. Hãy tự làm trước
  khi xem gợi ý, phân biệt lỗi cú pháp, lỗi khi chạy và kết quả sai; ghi rõ mức hỗ trợ đã sử dụng.
concept_notes_en: Bài kiểm tra Python cơ bản is a Software Engineering skill for turning an idea into code that
  can be read, tested, and maintained. Define the inputs, outputs, invariants, and failure modes before implementing.
  In Python, small boundaries make tests fast and tracebacks actionable.
why_it_matters_vi: Xác định kiến thức đã vững và phần cần ôn để chọn nhịp học phù hợp.
why_it_matters_en: Measure your current baseline honestly so the learning pace follows evidence rather than confidence.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Python baseline assessment” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.
- Làm lại một trường hợp khác trước khi kết luận đã nắm vững. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Measure your current baseline honestly so the learning pace follows evidence
  rather than confidence.'
- Open Python Tutorial, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Take the assessment without references, score it with the checklist, then record
  three gaps and a recovery plan.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tự làm bài đánh giá trước khi xem tài
      liệu, đối chiếu tiêu chí rồi ghi ba phần cần ôn bổ sung.'
    deliverables:
    - Bài tự làm, kết quả kiểm tra và phần đã dùng gợi ý
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Làm lại một trường hợp khác trước khi kết luận đã nắm vững.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Take the assessment without references, score it with the checklist, then record three gaps and a recovery
      plan.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can justify the six-month or 12–15-month track using your own evidence.
    stretch: Add a failure test for python baseline assessment and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Bài kiểm tra Python cơ bản” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain python baseline assessment to a new teammate?
  - Which assumption behind python baseline assessment could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Python baseline assessment: inspect one complete path'
  code: "# Topic: Python baseline assessment (phase-00-onboarding-baseline-1)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for python baseline assessment.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Python Tutorial
  url: https://docs.python.org/3/tutorial/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: VS Code Python
  url: https://code.visualstudio.com/docs/languages/python
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Git Reference
  url: https://git-scm.com/docs
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Python downloads
  url: https://www.python.org/downloads/
  language: en
  purpose_vi: Trang tải Python chính thức; dùng để cài đúng bản ổn định.
  read_vi: Chọn Windows installer 64-bit, kiểm tra Add Python to PATH và xác nhận bằng python --version.
  purpose_en: Official Python downloads; use it to install a stable release.
  read_en: Choose the 64-bit Windows installer, enable PATH, and verify with python --version.
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
- exercise-0-baseline
review_item_ids:
- phase-00-onboarding-baseline-1-recall
- phase-00-onboarding-baseline-1-application
- phase-00-onboarding-baseline-1-debug
- phase-00-onboarding-baseline-1-interview
estimated_minutes: 45
completion_checklist:
- Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.
- Làm lại một trường hợp khác trước khi kết luận đã nắm vững.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Làm lại một trường hợp khác trước khi kết luận đã nắm vững.
common_mistakes:
- Tính cả phần chép từ lời giải là kết quả tự làm.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-00-onboarding-baseline-2
- phase-00-onboarding-baseline-3
review_question_vi: Nội dung cốt lõi của “Bài kiểm tra Python cơ bản” là gì?
review_question_en: Define python baseline assessment in your own words. What are the input, transformation and
  output?
review_answer_vi: Bài đánh giá giúp bạn nhận ra phần Python đã nắm chắc và phần cần luyện thêm. Hãy tự làm trước
  khi xem gợi ý, phân biệt lỗi cú pháp, lỗi khi chạy và kết quả sai; ghi rõ mức hỗ trợ đã sử dụng.
review_answer_en: A strong answer names the input, transformation, output and the context where python baseline
  assessment is used. Relate it specifically to python baseline assessment in lesson phase-00-onboarding-baseline-1.
review_cards:
- id: phase-00-onboarding-baseline-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Bài kiểm tra Python cơ bản” là gì?
  question_en: Define python baseline assessment in your own words. What are the input, transformation and output?
  answer_vi: Bài đánh giá giúp bạn nhận ra phần Python đã nắm chắc và phần cần luyện thêm. Hãy tự làm trước khi
    xem gợi ý, phân biệt lỗi cú pháp, lỗi khi chạy và kết quả sai; ghi rõ mức hỗ trợ đã sử dụng.
  answer_en: A strong answer names the input, transformation, output and the context where python baseline assessment
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-baseline-1-application
  type: application
  question_vi: Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.
  question_en: Write a small code example or design that applies python baseline assessment to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý”,
    cần lưu: bài tự làm, kết quả kiểm tra và phần đã dùng gợi ý. Làm lại một trường hợp khác trước khi kết luận
    đã nắm vững.'
  answer_en: The python baseline assessment example should have an explicit input, expected output and a way to
    run or verify it (phase-00-onboarding-baseline-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-baseline-1-debug
  type: debug
  question_vi: Khi làm bài “Bài kiểm tra Python cơ bản”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If python baseline assessment produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Bài kiểm tra Python cơ bản”, lỗi cần tránh là: tính cả phần chép từ lời giải là kết quả
    tự làm. Làm lại một trường hợp khác trước khi kết luận đã nắm vững. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết
    quả khác dự kiến.'
  answer_en: For python baseline assessment, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-00-onboarding-baseline-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-baseline-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Bài kiểm tra Python cơ bản” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of python baseline assessment?
  answer_vi: Bắt đầu từ nhiệm vụ “Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi
    ý”. Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc
    lại định nghĩa.
  answer_en: The answer about python baseline assessment should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-00-onboarding-baseline-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bài kiểm tra Python cơ bản / Python baseline assessment

Bài đánh giá giúp bạn nhận ra phần Python đã nắm chắc và phần cần luyện thêm. Hãy tự làm trước khi xem gợi ý, phân biệt lỗi cú pháp, lỗi khi chạy và kết quả sai; ghi rõ mức hỗ trợ đã sử dụng.

## Thực hành

Tự giải một bài Python ngắn và ghi cách kiểm tra kết quả cùng những chỗ cần gợi ý.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tự làm bài đánh giá trước khi xem tài liệu, đối chiếu tiêu chí rồi ghi ba phần cần ôn bổ sung.
