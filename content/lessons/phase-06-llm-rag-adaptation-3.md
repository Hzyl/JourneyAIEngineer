---
lesson_id: phase-06-llm-rag-adaptation-3
phase_id: phase-06-llm-rag
module_id: adaptation
title_vi: Lượng tử hóa
title_en: Quantization
summary_vi: Lượng tử hóa biểu diễn số bằng độ chính xác thấp hơn để giảm bộ nhớ hoặc chi phí tính toán.
summary_en: Learn Quantization through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain quantization with a concrete example.
- Write or adapt a small code example applying quantization.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-adaptation-2
- phase-05-mlops-api-1
key_terms:
- quantization
- token
- embedding
- retrieval
- evaluation
- adaptation
concept_notes_vi: Lượng tử hóa biểu diễn số bằng độ chính xác thấp hơn để giảm bộ nhớ hoặc chi phí tính toán. Mức
  tiết kiệm và ảnh hưởng chất lượng phụ thuộc mô hình, định dạng, phần cứng.
concept_notes_en: Quantization is model optimization after establishing an evaluation baseline. Prepare clean data,
  split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving
  based on quality, latency, cost, and privacy.
why_it_matters_vi: Chọn prompt, RAG, tinh chỉnh hoặc lượng tử hóa theo vấn đề cần giải quyết; giới hạn agent bằng
  điều kiện dừng.
why_it_matters_en: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified, and why agents need
  stop conditions.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Quantization” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu chưa
  đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified,
  and why agents need stop conditions.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by
  data, cost, latency, and risk.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản ghi so sánh các phương án theo
      dữ liệu, chi phí, độ trễ và rủi ro.'
    deliverables:
    - Bảng so sánh phương án với dữ liệu, chi phí và rủi ro
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by data, cost, latency,
      and risk.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You do not fine-tune before debugging the prompt, and your agent cannot run forever.
    stretch: Add a failure test for quantization and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lượng tử hóa” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain quantization to a new teammate?
  - Which assumption behind quantization could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Quantization: inspect one complete path'
  code: "# Topic: Quantization (phase-06-llm-rag-adaptation-3)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for quantization.
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
- exercise-6-adaptation
review_item_ids:
- phase-06-llm-rag-adaptation-3-recall
- phase-06-llm-rag-adaptation-3-application
- phase-06-llm-rag-adaptation-3-debug
- phase-06-llm-rag-adaptation-3-interview
estimated_minutes: 60
completion_checklist:
- So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.
common_mistakes:
- Chọn tinh chỉnh hoặc agent khi chưa xác định được nhu cầu.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-06-llm-rag-adaptation-4
- phase-07-capstone-career-problem-1
review_question_vi: Nội dung cốt lõi của “Lượng tử hóa” là gì?
review_question_en: Define quantization in your own words. What are the input, transformation and output?
review_answer_vi: Lượng tử hóa biểu diễn số bằng độ chính xác thấp hơn để giảm bộ nhớ hoặc chi phí tính toán. Mức
  tiết kiệm và ảnh hưởng chất lượng phụ thuộc mô hình, định dạng, phần cứng.
review_answer_en: A strong answer names the input, transformation, output and the context where quantization is
  used. Relate it specifically to quantization in lesson phase-06-llm-rag-adaptation-3.
review_cards:
- id: phase-06-llm-rag-adaptation-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lượng tử hóa” là gì?
  question_en: Define quantization in your own words. What are the input, transformation and output?
  answer_vi: Lượng tử hóa biểu diễn số bằng độ chính xác thấp hơn để giảm bộ nhớ hoặc chi phí tính toán. Mức tiết
    kiệm và ảnh hưởng chất lượng phụ thuộc mô hình, định dạng, phần cứng.
  answer_en: A strong answer names the input, transformation, output and the context where quantization is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-adaptation-3-application
  type: application
  question_vi: So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.
  question_en: Write a small code example or design that applies quantization to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ”, cần lưu:
    bảng so sánh phương án với dữ liệu, chi phí và rủi ro. Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục.'
  answer_en: The quantization example should have an explicit input, expected output and a way to run or verify
    it (phase-06-llm-rag-adaptation-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-adaptation-3-debug
  type: debug
  question_vi: Khi làm bài “Lượng tử hóa”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If quantization produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Lượng tử hóa”, lỗi cần tránh là: chọn tinh chỉnh hoặc agent khi chưa xác định được nhu
    cầu. Liên hệ phương án đã chọn với lỗi cụ thể cần khắc phục. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả
    khác dự kiến.'
  answer_en: For quantization, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-06-llm-rag-adaptation-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-adaptation-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lượng tử hóa” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of quantization?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about quantization should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-06-llm-rag-adaptation-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Lượng tử hóa / Quantization

Lượng tử hóa biểu diễn số bằng độ chính xác thấp hơn để giảm bộ nhớ hoặc chi phí tính toán. Mức tiết kiệm và ảnh hưởng chất lượng phụ thuộc mô hình, định dạng, phần cứng.

## Thực hành

So sánh bộ nhớ và chất lượng của hai mức độ chính xác trên cùng nhiệm vụ.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Viết bản ghi so sánh các phương án theo dữ liệu, chi phí, độ trễ và rủi ro.
