---
lesson_id: phase-00-onboarding-learning-system-1
phase_id: phase-00-onboarding
module_id: learning-system
title_vi: Sử dụng lộ trình và mốc tự đánh giá
title_en: Use the roadmap and checkpoints
summary_vi: Lộ trình cho biết thứ tự kiến thức, còn mốc tự đánh giá cho biết bạn đã vận dụng được đến đâu.
summary_en: Learn Use the roadmap and checkpoints through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.
- Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain use the roadmap and checkpoints with a concrete example.
- Write or adapt a small code example applying use the roadmap and checkpoints.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-00-onboarding-baseline-4
key_terms:
- cách
- dùng
- roadmap
- checkpoint
- Python
- testing
- debugging
- maintainability
- learning-system
concept_notes_vi: Lộ trình cho biết thứ tự kiến thức, còn mốc tự đánh giá cho biết bạn đã vận dụng được đến đâu.
  Khi chưa đạt một tiêu chí, quay lại đúng bài liên quan và làm lại với ví dụ khác.
concept_notes_en: Cách dùng roadmap và checkpoint is a concept in the learning-system module. Identify the inputs,
  outputs, assumptions, failure modes, and verification method with a small example before scaling to a project.
why_it_matters_vi: Gắn việc học với kết quả tự làm để biết điều đã hiểu và điều cần luyện tiếp.
why_it_matters_en: Build an evidence-based learning system with sessions, journals, reviews, and checkpoints instead
  of passive reading.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Use the roadmap and checkpoints” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.
- Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Build an evidence-based learning system with sessions, journals, reviews,
  and checkpoints instead of passive reading.'
- Open Python Tutorial, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Run one complete 45–60 minute loop: read, attempt, test, answer a review card, and
  record one journal insight.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Hoàn thành một buổi học 45–60 phút:
      đọc, tự làm, kiểm tra, trả lời thẻ ôn tập và ghi điều rút ra.'
    deliverables:
    - Ghi chú có mục tiêu, thời lượng thực tế và kết quả của buổi học
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: 'Run one complete 45–60 minute loop: read, attempt, test, answer a review card, and record one journal
      insight.'
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: Each week you can point to an artifact that proves progress and a topic that remains weak.
    stretch: Add a failure test for use the roadmap and checkpoints and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Sử dụng lộ trình và mốc tự đánh giá” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain use the roadmap and checkpoints to a new teammate?
  - Which assumption behind use the roadmap and checkpoints could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Use the roadmap and checkpoints: inspect one complete path'
  code: "# Topic: Use the roadmap and checkpoints (phase-00-onboarding-learning-system-1)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for use the roadmap and checkpoints.
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
- exercise-0-learning-system
review_item_ids:
- phase-00-onboarding-learning-system-1-recall
- phase-00-onboarding-learning-system-1-application
- phase-00-onboarding-learning-system-1-debug
- phase-00-onboarding-learning-system-1-interview
estimated_minutes: 45
completion_checklist:
- Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.
- Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp.
common_mistakes:
- Dùng số phút hoặc số bài đã đọc để thay thế bằng chứng hiểu bài.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-00-onboarding-learning-system-2
- phase-00-onboarding-learning-system-3
review_question_vi: Nội dung cốt lõi của “Sử dụng lộ trình và mốc tự đánh giá” là gì?
review_question_en: Define use the roadmap and checkpoints in your own words. What are the input, transformation
  and output?
review_answer_vi: Lộ trình cho biết thứ tự kiến thức, còn mốc tự đánh giá cho biết bạn đã vận dụng được đến đâu.
  Khi chưa đạt một tiêu chí, quay lại đúng bài liên quan và làm lại với ví dụ khác.
review_answer_en: A strong answer names the input, transformation, output and the context where use the roadmap
  and checkpoints is used. Relate it specifically to use the roadmap and checkpoints in lesson phase-00-onboarding-learning-system-1.
review_cards:
- id: phase-00-onboarding-learning-system-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Sử dụng lộ trình và mốc tự đánh giá” là gì?
  question_en: Define use the roadmap and checkpoints in your own words. What are the input, transformation and
    output?
  answer_vi: Lộ trình cho biết thứ tự kiến thức, còn mốc tự đánh giá cho biết bạn đã vận dụng được đến đâu. Khi
    chưa đạt một tiêu chí, quay lại đúng bài liên quan và làm lại với ví dụ khác.
  answer_en: A strong answer names the input, transformation, output and the context where use the roadmap and checkpoints
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-00-onboarding-learning-system-1-application
  type: application
  question_vi: Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.
  question_en: Write a small code example or design that applies use the roadmap and checkpoints to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó”, cần lưu: ghi chú
    có mục tiêu, thời lượng thực tế và kết quả của buổi học. Đối chiếu việc đã làm với mục tiêu và chọn phần cần
    học tiếp.'
  answer_en: The use the roadmap and checkpoints example should have an explicit input, expected output and a way
    to run or verify it (phase-00-onboarding-learning-system-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-00-onboarding-learning-system-1-debug
  type: debug
  question_vi: Khi làm bài “Sử dụng lộ trình và mốc tự đánh giá”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If use the roadmap and checkpoints produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Sử dụng lộ trình và mốc tự đánh giá”, lỗi cần tránh là: dùng số phút hoặc số bài đã đọc
    để thay thế bằng chứng hiểu bài. Đối chiếu việc đã làm với mục tiêu và chọn phần cần học tiếp. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For use the roadmap and checkpoints, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-00-onboarding-learning-system-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-00-onboarding-learning-system-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Sử dụng lộ trình và mốc tự đánh giá” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of use the roadmap and checkpoints?
  answer_vi: Bắt đầu từ nhiệm vụ “Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about use the roadmap and checkpoints should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-00-onboarding-learning-system-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Sử dụng lộ trình và mốc tự đánh giá / Use the roadmap and checkpoints

Lộ trình cho biết thứ tự kiến thức, còn mốc tự đánh giá cho biết bạn đã vận dụng được đến đâu. Khi chưa đạt một tiêu chí, quay lại đúng bài liên quan và làm lại với ví dụ khác.

## Thực hành

Chọn một mốc học và ghi bằng chứng cần có để xác nhận đã đạt mốc đó.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Hoàn thành một buổi học 45–60 phút: đọc, tự làm, kiểm tra, trả lời thẻ ôn tập và ghi điều rút ra.
