---
lesson_id: phase-22-genai-system-design-genai-system-design-3
phase_id: phase-22-genai-system-design
module_id: genai-system-design
title_vi: Bảo mật, chi phí và lựa chọn mô hình
title_en: Security, cost optimization, and model selection
summary_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ.
summary_en: Learn Security, cost optimization, and model selection through an input → transformation → output model,
  then verify it with an edge-case exercise.
learning_objectives:
- So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.
- Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần chính.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain security, cost optimization, and model selection with a concrete example.
- Write or adapt a small code example applying security, cost optimization, and model selection.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-22-genai-system-design-genai-system-design-2
- phase-21-genai-local-llm-local-llm-1
key_terms:
- security
- cost
- optimization
- model
- selection
- inference
- observability
- reproducibility
- deployment
- genai-system-design
concept_notes_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn
  chỉ phù hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.
concept_notes_en: Security, cost optimization và model selection turns an AI demo into a system that can be trusted.
  Define metrics and an evaluation set first, record prompt/model/version/tokens/latency, and attribute failures
  to retrieval, generation, data, or infrastructure instead of relying on one score.
why_it_matters_vi: Giải thích lựa chọn kiến trúc bằng nhu cầu người dùng, độ tin cậy, bảo mật và chi phí.
why_it_matters_en: A senior AI Engineer explains system decisions through user value, reliability, security, and
  cost.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Security, cost optimization, and model selection” trong tài liệu tham khảo; đối chiếu với
  phần giải thích của bài.
- So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.
- Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần chính. Ghi kết quả đối chiếu và điều bạn đã
  sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: A senior AI Engineer explains system decisions through user value, reliability,
  security, and cost.'
- Open Google Rules of Machine Learning, read the section marked Read this lesson, and record one verified example
  or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a design document for a Production GenAI System with data flow, SLOs, threat
  model, cost estimate, and rollout plan.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết tài liệu thiết kế hệ thống GenAI
      gồm luồng dữ liệu, SLO, mô hình đe dọa, ước tính chi phí và kế hoạch triển khai.'
    deliverables:
    - Sơ đồ hoặc tài liệu quyết định có ràng buộc và cách kiểm chứng
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần chính.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a design document for a Production GenAI System with data flow, SLOs, threat model, cost estimate,
      and rollout plan.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: A reviewer can trace every decision, failure mode, metric, and rollback plan in the design document.
    stretch: Add a failure test for security, cost optimization, and model selection and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Bảo mật, chi phí và lựa chọn mô hình” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain security, cost optimization, and model selection to a new teammate?
  - Which assumption behind security, cost optimization, and model selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Security, cost optimization, and model selection: inspect one complete path'
  code: "# Topic: Security, cost optimization, and model selection (phase-22-genai-system-design-genai-system-design-3)\n\
    import time\n\ndef timed_response(value: float) -> dict[str, float]:\n    started = time.perf_counter()\n  \
    \  result = value * 2\n    return {'result': result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\
    \nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for security, cost optimization, and model selection.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Google Rules of Machine Learning
  url: https://developers.google.com/machine-learning/guides/rules-of-ml
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Full Stack Deep Learning
  url: https://fullstackdeeplearning.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Machine Learning Systems Design
  url: https://github.com/chiphuyen/machine-learning-systems-design
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: SciPy Optimize Tutorial
  url: https://docs.scipy.org/doc/scipy/tutorial/optimize.html
  language: en
  purpose_vi: Liên hệ hàm mục tiêu, gradient và bộ tối ưu với bài toán tối ưu.
  read_vi: Đọc minimize và callback; ghi rõ hàm mục tiêu, điểm bắt đầu và điều kiện dừng.
  purpose_en: Connect objectives, gradients, and optimizers to optimization problems.
  read_en: Read minimize and callbacks; record the objective, start point, and stopping rule.
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
- exercise-22-genai-system-design
review_item_ids:
- phase-22-genai-system-design-genai-system-design-3-recall
- phase-22-genai-system-design-genai-system-design-3-application
- phase-22-genai-system-design-genai-system-design-3-debug
- phase-22-genai-system-design-genai-system-design-3-interview
estimated_minutes: 60
completion_checklist:
- So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.
- Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần chính.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần chính.
common_mistakes:
- Vẽ nhiều thành phần nhưng thiếu căn cứ về tải, chi phí và yêu cầu dữ liệu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-22-genai-system-design-genai-system-design-4
review_question_vi: Nội dung cốt lõi của “Bảo mật, chi phí và lựa chọn mô hình” là gì?
review_question_en: Define security, cost optimization, and model selection in your own words. What are the input,
  transformation and output?
review_answer_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn
  chỉ phù hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.
review_answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization,
  and model selection is used. Relate it specifically to security, cost optimization, and model selection in lesson
  phase-22-genai-system-design-genai-system-design-3.
review_cards:
- id: phase-22-genai-system-design-genai-system-design-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Bảo mật, chi phí và lựa chọn mô hình” là gì?
  question_en: Define security, cost optimization, and model selection in your own words. What are the input, transformation
    and output?
  answer_vi: Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn chỉ phù
    hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.
  answer_en: A strong answer names the input, transformation, output and the context where security, cost optimization,
    and model selection is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-22-genai-system-design-genai-system-design-3-application
  type: application
  question_vi: So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.
  question_en: Write a small code example or design that applies security, cost optimization, and model selection
    to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu”, cần lưu:
    sơ đồ hoặc tài liệu quyết định có ràng buộc và cách kiểm chứng. Lần theo luồng dữ liệu và xét một tình huống
    lỗi cho mỗi thành phần chính.'
  answer_en: The security, cost optimization, and model selection example should have an explicit input, expected
    output and a way to run or verify it (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-22-genai-system-design-genai-system-design-3-debug
  type: debug
  question_vi: Khi làm bài “Bảo mật, chi phí và lựa chọn mô hình”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If security, cost optimization, and model selection produces a wrong result or a metric drops, what
    would you debug first?
  answer_vi: 'Trong bài “Bảo mật, chi phí và lựa chọn mô hình”, lỗi cần tránh là: vẽ nhiều thành phần nhưng thiếu
    căn cứ về tải, chi phí và yêu cầu dữ liệu. Lần theo luồng dữ liệu và xét một tình huống lỗi cho mỗi thành phần
    chính. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For security, cost optimization, and model selection, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-22-genai-system-design-genai-system-design-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Bảo mật, chi phí và lựa chọn mô hình” để giải thích cách làm và giới
    hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of security, cost optimization,
    and model selection?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about security, cost optimization, and model selection should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-22-genai-system-design-genai-system-design-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Bảo mật, chi phí và lựa chọn mô hình / Security, cost optimization, and model selection

Lựa chọn mô hình cần xét chất lượng cùng yêu cầu dữ liệu, chi phí và độ trễ. Phương án rẻ hơn chỉ phù hợp khi vẫn đáp ứng tiêu chí tối thiểu đã thống nhất.

## Thực hành

So sánh hai phương án theo chất lượng, chi phí, độ trễ và phạm vi dữ liệu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết tài liệu thiết kế hệ thống GenAI gồm luồng dữ liệu, SLO, mô hình đe dọa, ước tính chi phí và kế hoạch triển khai.
