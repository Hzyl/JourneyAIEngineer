---
lesson_id: phase-06-llm-rag-adaptation-1
phase_id: phase-06-llm-rag
module_id: adaptation
title_vi: Fine-tuning khi nào
title_en: When to fine-tune
summary_vi: Học Fine-tuning khi nào qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn When to fine-tune through an input → transformation → output model, then verify it with an edge-case exercise.
learning_objectives:
- Giải thích fine-tuning khi nào bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng fine-tuning khi nào.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain when to fine-tune with a concrete example.
- Write or adapt a small code example applying when to fine-tune.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-06-llm-rag-quality-safety-4
- phase-05-mlops-api-1
key_terms:
- fine
- tuning
- khi
- nào
- token
- embedding
- retrieval
- evaluation
- adaptation
concept_notes_vi: Fine-tuning khi nào là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval,
  theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi
  phí và quyền riêng tư.
concept_notes_en: Fine-tuning khi nào is model optimization after establishing an evaluation baseline. Prepare clean data,
  split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving based on
  quality, latency, cost, and privacy.
why_it_matters_vi: Biết khi nào RAG đủ, khi nào fine-tune/LoRA/quantization hợp lý và agent cần stop condition.
why_it_matters_en: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified, and why agents need stop conditions.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Biết khi nào RAG đủ, khi nào fine-tune/LoRA/quantization hợp lý và agent cần stop condition.'
- Mở Hugging Face NLP Course, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Viết decision record so sánh RAG, prompt, fine-tune và model nhỏ theo data, cost, latency và risk.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Know when RAG is enough, when fine-tuning/LoRA/quantization is justified, and why agents
  need stop conditions.'
- Open Hugging Face NLP Course, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by data, cost,
  latency, and risk.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Viết decision record so sánh RAG, prompt, fine-tune và model nhỏ theo data, cost, latency và risk.
    deliverables:
    - Một file code chạy được
    - Một test hoặc output expected
    - Một note nêu edge case và trade-off
    checkpoint: Bạn không fine-tune chỉ vì prompt chưa được debug, và agent không chạy vô hạn.
    stretch: Viết thêm một failure test cho fine-tuning khi nào và giải thích kết quả.
  en:
    task: Write a decision record comparing RAG, prompting, fine-tuning, and small models by data, cost, latency, and risk.
    deliverables:
    - One executable code file
    - One test or expected output
    - One note describing an edge case and trade-off
    checkpoint: You do not fine-tune before debugging the prompt, and your agent cannot run forever.
    stretch: Add a failure test for when to fine-tune and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích fine-tuning khi nào cho một đồng đội mới như thế nào?
  - Một assumption nào của fine-tuning khi nào có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain when to fine-tune to a new teammate?
  - Which assumption behind when to fine-tune could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'When to fine-tune: inspect one complete path'
  code: "# Topic: When to fine-tune (phase-06-llm-rag-adaptation-1)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của fine-tuning khi nào.
  purpose_en: Illustrate the input-to-output path for when to fine-tune.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face Transformers Docs
  url: https://huggingface.co/docs/transformers/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Documentation
  url: https://faiss.ai/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
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
- exercise-6-adaptation
review_item_ids:
- phase-06-llm-rag-adaptation-1-recall
- phase-06-llm-rag-adaptation-1-application
- phase-06-llm-rag-adaptation-1-debug
- phase-06-llm-rag-adaptation-1-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của fine-tuning khi nào.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng fine-tuning khi nào và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng fine-tuning khi nào.
- Đánh giá fine-tuning khi nào bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ fine-tuning khi nào mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-06-llm-rag-adaptation-2
- phase-06-llm-rag-adaptation-3
review_question_vi: Định nghĩa fine-tuning khi nào bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define when to fine-tune in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng fine-tuning khi nào. Hãy liên hệ
  cụ thể với fine-tuning khi nào trong lesson phase-06-llm-rag-adaptation-1.
review_answer_en: A strong answer names the input, transformation, output and the context where when to fine-tune is used.
  Relate it specifically to when to fine-tune in lesson phase-06-llm-rag-adaptation-1.
review_cards:
- id: phase-06-llm-rag-adaptation-1-recall
  type: recall
  question_vi: Định nghĩa fine-tuning khi nào bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define when to fine-tune in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng fine-tuning khi nào.
  answer_en: A strong answer names the input, transformation, output and the context where when to fine-tune is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-06-llm-rag-adaptation-1-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng fine-tuning khi nào cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies when to fine-tune to an AI engineering problem.
  answer_vi: Ví dụ cho fine-tuning khi nào cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-06-llm-rag-adaptation-1).
  answer_en: The when to fine-tune example should have an explicit input, expected output and a way to run or verify it (phase-06-llm-rag-adaptation-1).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-06-llm-rag-adaptation-1-debug
  type: debug
  question_vi: Nếu kết quả của fine-tuning khi nào sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If when to fine-tune produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với fine-tuning khi nào, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-06-llm-rag-adaptation-1).
  answer_en: For when to fine-tune, check inputs/shapes, preprocessing and the baseline first; then isolate the failure with
    a small test and error analysis (phase-06-llm-rag-adaptation-1).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-06-llm-rag-adaptation-1-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của fine-tuning khi nào như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of when to fine-tune?
  answer_vi: Câu trả lời về fine-tuning khi nào cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-06-llm-rag-adaptation-1).
  answer_en: The answer about when to fine-tune should cover assumptions, metrics/cost, limitations and how to reduce production
    risk (phase-06-llm-rag-adaptation-1).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Fine-tuning khi nào / When to fine-tune

Fine-tuning khi nào là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval, theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi phí và quyền riêng tư.

## Practice

Viết decision record so sánh RAG, prompt, fine-tune và model nhỏ theo data, cost, latency và risk.
