---
lesson_id: phase-20-genai-finetuning-fine-tuning-2
phase_id: phase-20-genai-finetuning
module_id: fine-tuning
title_vi: LoRA, QLoRA và PEFT
title_en: LoRA, QLoRA, and PEFT
summary_vi: Học LoRA, QLoRA và PEFT qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có edge case.
summary_en: Learn LoRA, QLoRA, and PEFT through an input → transformation → output model, then verify it with an edge-case
  exercise.
learning_objectives:
- Giải thích lora, qlora và peft bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng lora, qlora và peft.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain lora, qlora, and peft with a concrete example.
- Write or adapt a small code example applying lora, qlora, and peft.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-20-genai-finetuning-fine-tuning-1
- phase-19-genai-production-genai-production-1
key_terms:
- lora
- qlora
- peft
- token
- embedding
- retrieval
- evaluation
- fine-tuning
concept_notes_vi: LoRA, QLoRA và PEFT là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval,
  theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi
  phí và quyền riêng tư.
concept_notes_en: LoRA, QLoRA và PEFT is model optimization after establishing an evaluation baseline. Prepare clean data,
  split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving based on
  quality, latency, cost, and privacy.
why_it_matters_vi: Fine-tuning chỉ đáng làm khi data và evaluation chứng minh prompting/RAG chưa giải quyết được vấn đề.
why_it_matters_en: Fine-tuning is justified only when data and evaluation show prompting/RAG are insufficient.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Fine-tuning chỉ đáng làm khi data và evaluation chứng minh prompting/RAG chưa giải quyết
  được vấn đề.'
- Mở Hugging Face PEFT, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Chuẩn bị dataset có split và license rõ ràng, chạy LoRA nhỏ, so sánh baseline và đo memory/quality.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Fine-tuning is justified only when data and evaluation show prompting/RAG are insufficient.'
- Open Hugging Face PEFT, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Prepare a dataset with explicit splits and licensing, run a small LoRA experiment, and compare
  memory and quality to baseline.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Chuẩn bị dataset có split và license rõ ràng, chạy LoRA nhỏ, so sánh baseline và đo memory/quality.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn bảo vệ được quyết định fine-tune hay không bằng quality, cost, data volume và maintenance risk.
    stretch: Viết thêm một failure test cho lora, qlora và peft và giải thích kết quả.
  en:
    task: Prepare a dataset with explicit splits and licensing, run a small LoRA experiment, and compare memory and quality
      to baseline.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can defend whether to fine-tune using quality, cost, data volume, and maintenance risk.
    stretch: Add a failure test for lora, qlora, and peft and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích lora, qlora và peft cho một đồng đội mới như thế nào?
  - Một assumption nào của lora, qlora và peft có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain lora, qlora, and peft to a new teammate?
  - Which assumption behind lora, qlora, and peft could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'LoRA, QLoRA, and PEFT: inspect one complete path'
  code: "# Topic: LoRA, QLoRA, and PEFT (phase-20-genai-finetuning-fine-tuning-2)\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\n\
    class Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của lora, qlora và peft.
  purpose_en: Illustrate the input-to-output path for lora, qlora, and peft.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face PEFT
  url: https://huggingface.co/docs/peft/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face TRL
  url: https://huggingface.co/docs/trl/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: bitsandbytes Documentation
  url: https://huggingface.co/docs/bitsandbytes/main/en/index
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
- exercise-20-fine-tuning
review_item_ids:
- phase-20-genai-finetuning-fine-tuning-2-recall
- phase-20-genai-finetuning-fine-tuning-2-application
- phase-20-genai-finetuning-fine-tuning-2-debug
- phase-20-genai-finetuning-fine-tuning-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của lora, qlora và peft.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng lora, qlora và peft và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng lora, qlora và peft.
- Đánh giá lora, qlora và peft bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ lora, qlora và peft mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-20-genai-finetuning-fine-tuning-3
- phase-20-genai-finetuning-fine-tuning-4
review_question_vi: Định nghĩa lora, qlora và peft bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define lora, qlora, and peft in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng lora, qlora và peft. Hãy liên hệ
  cụ thể với lora, qlora và peft trong lesson phase-20-genai-finetuning-fine-tuning-2.
review_answer_en: A strong answer names the input, transformation, output and the context where lora, qlora, and peft is used.
  Relate it specifically to lora, qlora, and peft in lesson phase-20-genai-finetuning-fine-tuning-2.
review_cards:
- id: phase-20-genai-finetuning-fine-tuning-2-recall
  type: recall
  question_vi: Định nghĩa lora, qlora và peft bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define lora, qlora, and peft in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng lora, qlora và peft.
  answer_en: A strong answer names the input, transformation, output and the context where lora, qlora, and peft is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-20-genai-finetuning-fine-tuning-2-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng lora, qlora và peft cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies lora, qlora, and peft to an AI engineering problem.
  answer_vi: Ví dụ cho lora, qlora và peft cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng (phase-20-genai-finetuning-fine-tuning-2).
  answer_en: The lora, qlora, and peft example should have an explicit input, expected output and a way to run or verify it
    (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-20-genai-finetuning-fine-tuning-2-debug
  type: debug
  question_vi: Nếu kết quả của lora, qlora và peft sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If lora, qlora, and peft produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với lora, qlora và peft, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng test nhỏ
    và error analysis (phase-20-genai-finetuning-fine-tuning-2).
  answer_en: For lora, qlora, and peft, check inputs/shapes, preprocessing and the baseline first; then isolate the failure
    with a small test and error analysis (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-20-genai-finetuning-fine-tuning-2-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của lora, qlora và peft như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of lora, qlora, and peft?
  answer_vi: Câu trả lời về lora, qlora và peft cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong production
    (phase-20-genai-finetuning-fine-tuning-2).
  answer_en: The answer about lora, qlora, and peft should cover assumptions, metrics/cost, limitations and how to reduce
    production risk (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# LoRA, QLoRA và PEFT / LoRA, QLoRA, and PEFT

LoRA, QLoRA và PEFT là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval, theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi phí và quyền riêng tư.

## Practice

Chuẩn bị dataset có split và license rõ ràng, chạy LoRA nhỏ, so sánh baseline và đo memory/quality.
