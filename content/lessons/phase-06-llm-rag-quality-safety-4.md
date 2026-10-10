---
lesson_id: phase-06-llm-rag-quality-safety-4
phase_id: phase-06-llm-rag
module_id: quality-safety
title_vi: Độ trễ và chi phí token
title_en: Latency and token cost
summary_vi: Chi phí phụ thuộc lượng token và cách tính của dịch vụ; độ trễ còn phụ thuộc mạng, truy xuất và sinh
  đầu ra.
summary_en: Learn Latency and token cost through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.
- So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain latency and token cost with a concrete example.
- Write or adapt a small code example applying latency and token cost.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-quality-safety-3
- phase-05-mlops-api-1
key_terms:
- latency
- token
- cost
- inference
- observability
- reproducibility
- deployment
- quality-safety
concept_notes_vi: Chi phí phụ thuộc lượng token và cách tính của dịch vụ; độ trễ còn phụ thuộc mạng, truy xuất và
  sinh đầu ra. Ghi số liệu từng bước để tìm phần cần tối ưu.
concept_notes_en: 'Latency và token cost belongs to LLM Application Engineering: design the contract between the
  application and the model. Define instructions, inputs, output schema, timeout, retry, and token limits; parse
  model output as untrusted data and return actionable errors.'
why_it_matters_vi: Đánh giá đồng thời chất lượng, độ trễ, chi phí và khả năng giữ đúng phạm vi yêu cầu.
why_it_matters_en: Measure quality, latency, cost, and safety together; treat hallucinations and injection as test
  cases.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Latency and token cost” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.
- So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần
  đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Measure quality, latency, cost, and safety together; treat hallucinations
  and injection as test cases.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Create a rubric, golden set, adversarial set, cost log, and an error dashboard by
  category.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo tiêu chí chấm, bộ câu hỏi chuẩn,
      tình huống đối kháng, nhật ký chi phí và bảng thống kê lỗi.'
    deliverables:
    - Bộ tình huống và bảng đánh giá chất lượng, độ trễ hoặc chi phí
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Create a rubric, golden set, adversarial set, cost log, and an error dashboard by category.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You can defend a model change with quality–latency–cost evidence rather than intuition.
    stretch: Add a failure test for latency and token cost and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Độ trễ và chi phí token” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain latency and token cost to a new teammate?
  - Which assumption behind latency and token cost could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- p95 = percentile(latencies, 95)
- throughput = completed_requests / elapsed_seconds
code_examples:
- language: python
  title: 'Latency and token cost: inspect one complete path'
  code: "# Topic: Latency and token cost (phase-06-llm-rag-quality-safety-4)\nimport time\n\ndef timed_response(value:\
    \ float) -> dict[str, float]:\n    started = time.perf_counter()\n    result = value * 2\n    return {'result':\
    \ result, 'latency_ms': (time.perf_counter() - started) * 1000}\n\nprint(timed_response(3.0))"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for latency and token cost.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Transformers Docs
  url: https://huggingface.co/docs/transformers/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Documentation
  url: https://faiss.ai/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Hugging Face Tokenizers
  url: https://huggingface.co/docs/transformers/main/en/tokenizer_summary
  language: en
  purpose_vi: Đếm token thực tế để đánh giá dung lượng ngữ cảnh và chi phí.
  read_vi: Đọc về tokenizer, token đặc biệt, cắt bớt chuỗi và chèn phần đệm.
  purpose_en: Measure real tokens before reasoning about context and cost.
  read_en: Read tokenizers, special tokens, and truncation/padding.
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
- exercise-6-quality-safety
review_item_ids:
- phase-06-llm-rag-quality-safety-4-recall
- phase-06-llm-rag-quality-safety-4-application
- phase-06-llm-rag-quality-safety-4-debug
- phase-06-llm-rag-quality-safety-4-interview
estimated_minutes: 60
completion_checklist:
- Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.
- So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu.
common_mistakes:
- Chỉ báo cáo các câu trả lời tốt hoặc bỏ qua chi phí phát sinh.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-adaptation-1
- phase-06-llm-rag-adaptation-2
review_question_vi: Nội dung cốt lõi của “Độ trễ và chi phí token” là gì?
review_question_en: Define latency and token cost in your own words. What are the input, transformation and output?
review_answer_vi: Chi phí phụ thuộc lượng token và cách tính của dịch vụ; độ trễ còn phụ thuộc mạng, truy xuất và
  sinh đầu ra. Ghi số liệu từng bước để tìm phần cần tối ưu.
review_answer_en: A strong answer names the input, transformation, output and the context where latency and token
  cost is used. Relate it specifically to latency and token cost in lesson phase-06-llm-rag-quality-safety-4.
review_cards:
- id: phase-06-llm-rag-quality-safety-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Độ trễ và chi phí token” là gì?
  question_en: Define latency and token cost in your own words. What are the input, transformation and output?
  answer_vi: Chi phí phụ thuộc lượng token và cách tính của dịch vụ; độ trễ còn phụ thuộc mạng, truy xuất và sinh
    đầu ra. Ghi số liệu từng bước để tìm phần cần tối ưu.
  answer_en: A strong answer names the input, transformation, output and the context where latency and token cost
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-quality-safety-4-application
  type: application
  question_vi: Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.
  question_en: Write a small code example or design that applies latency and token cost to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu”, cần lưu: bộ tình huống
    và bảng đánh giá chất lượng, độ trễ hoặc chi phí. So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp
    xấu.'
  answer_en: The latency and token cost example should have an explicit input, expected output and a way to run
    or verify it (phase-06-llm-rag-quality-safety-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-quality-safety-4-debug
  type: debug
  question_vi: Khi làm bài “Độ trễ và chi phí token”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If latency and token cost produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Độ trễ và chi phí token”, lỗi cần tránh là: chỉ báo cáo các câu trả lời tốt hoặc bỏ qua
    chi phí phát sinh. So sánh thay đổi trên cùng bộ câu hỏi và ghi cả trường hợp xấu. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For latency and token cost, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-06-llm-rag-quality-safety-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-quality-safety-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Độ trễ và chi phí token” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of latency and token cost?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about latency and token cost should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-06-llm-rag-quality-safety-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Độ trễ và chi phí token / Latency and token cost

Chi phí phụ thuộc lượng token và cách tính của dịch vụ; độ trễ còn phụ thuộc mạng, truy xuất và sinh đầu ra. Ghi số liệu từng bước để tìm phần cần tối ưu.

## Thực hành

Ghi token đầu vào, đầu ra và thời gian của một nhóm yêu cầu.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Tạo tiêu chí chấm, bộ câu hỏi chuẩn, tình huống đối kháng, nhật ký chi phí và bảng thống kê lỗi.
