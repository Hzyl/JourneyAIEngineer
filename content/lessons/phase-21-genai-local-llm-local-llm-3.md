---
lesson_id: phase-21-genai-local-llm-local-llm-3
phase_id: phase-21-genai-local-llm
module_id: local-llm
title_vi: GGUF, quantization và Ollama
title_en: GGUF, quantization, and Ollama
summary_vi: Học GGUF, quantization và Ollama qua một mô hình input → biến đổi → output, sau đó kiểm chứng bằng bài tập có
  edge case.
summary_en: Learn GGUF, quantization, and Ollama through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích gguf, quantization và ollama bằng ví dụ cụ thể.
- Viết hoặc sửa một đoạn code nhỏ áp dụng gguf, quantization và ollama.
- Nhận diện điều kiện áp dụng, giới hạn và một lỗi thường gặp.
learning_objectives_en:
- Explain gguf, quantization, and ollama with a concrete example.
- Write or adapt a small code example applying gguf, quantization, and ollama.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-21-genai-local-llm-local-llm-2
- phase-20-genai-finetuning-fine-tuning-1
key_terms:
- gguf
- quantization
- ollama
- token
- embedding
- retrieval
- evaluation
- local-llm
concept_notes_vi: GGUF, quantization và Ollama là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch,
  tách train/eval, theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất
  lượng, latency, chi phí và quyền riêng tư.
concept_notes_en: GGUF, quantization và Ollama is model optimization after establishing an evaluation baseline. Prepare clean
  data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving based
  on quality, latency, cost, and privacy.
why_it_matters_vi: Local LLM giúp hiểu rõ memory, throughput và trade-off giữa model size, quality và privacy.
why_it_matters_en: Local LLMs expose the trade-offs among memory, throughput, model size, quality, and privacy.
study_steps_vi:
- 'Đọc phần Concept notes để trả lời: Local LLM giúp hiểu rõ memory, throughput và trade-off giữa model size, quality và privacy.'
- Mở vLLM Documentation, đọc đúng mục Read this lesson và ghi lại một ví dụ hoặc định nghĩa đã kiểm chứng.
- Mở Practice Lab, bấm Tạo & mở VS Code, lưu bằng Ctrl+S, thay một tham số rồi chạy lại test.
- 'Làm bài thực hành: Chạy một model nhỏ local, đo cold/warm latency, tokens/sec, VRAM và so sánh quantized với full precision.'
- Trả lời review card không nhìn gợi ý, hoàn thiện checklist và lưu một artifact có thể đưa lên GitHub.
study_steps_en:
- 'Read the concept notes and answer: Local LLMs expose the trade-offs among memory, throughput, model size, quality, and
  privacy.'
- Open vLLM Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the test.
- 'Complete the practice task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare quantized
  with full precision.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: Chạy một model nhỏ local, đo cold/warm latency, tokens/sec, VRAM và so sánh quantized với full precision.
    deliverables:
    - Một implementation nhỏ chạy được
    - Một test hoặc benchmark
    - Một note về failure mode và trade-off
    checkpoint: Bạn chọn được runtime theo hardware, workload và privacy requirement thay vì chọn theo trend.
    stretch: Viết thêm một failure test cho gguf, quantization và ollama và giải thích kết quả.
  en:
    task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare quantized with full precision.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can choose a runtime from hardware, workload, and privacy requirements rather than hype.
    stretch: Add a failure test for gguf, quantization, and ollama and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích gguf, quantization và ollama cho một đồng đội mới như thế nào?
  - Một assumption nào của gguf, quantization và ollama có thể sai trong production?
  - Bạn sẽ chọn metric hoặc test nào để chứng minh kết quả đáng tin?
  en:
  - How would you explain gguf, quantization, and ollama to a new teammate?
  - Which assumption behind gguf, quantization, and ollama could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'GGUF, quantization, and Ollama: inspect one complete path'
  code: "# Topic: GGUF, quantization, and Ollama (phase-21-genai-local-llm-local-llm-3)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready', valid=True)\n\
    print(result)"
  status: runnable
  purpose_vi: Minh họa đường đi input → output của gguf, quantization và ollama.
  purpose_en: Illustrate the input-to-output path for gguf, quantization, and ollama.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Thử input rỗng, shape sai hoặc dữ liệu thiếu và ghi lại lỗi.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Giữ input, biến đổi và output nhỏ để có thể test boundary và failure case.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: vLLM Documentation
  url: https://docs.vllm.ai/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ollama Documentation
  url: https://docs.ollama.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong lesson.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: llama.cpp
  url: https://github.com/ggml-org/llama.cpp
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
- exercise-21-local-llm
review_item_ids:
- phase-21-genai-local-llm-local-llm-3-recall
- phase-21-genai-local-llm-local-llm-3-application
- phase-21-genai-local-llm-local-llm-3-debug
- phase-21-genai-local-llm-local-llm-3-interview
estimated_minutes: 60
completion_checklist:
- Giải thích được input, biến đổi và output của gguf, quantization và ollama.
- Chạy hoặc sửa được code example với một input mới.
- Ghi lại một edge case, metric hoặc failure mode.
- Trả lời review card bằng bằng chứng cụ thể.
completion_criteria:
- Mô tả được khi nào dùng gguf, quantization và ollama và khi nào cần baseline khác.
- Có artifact chạy được và output có thể kiểm tra.
- Nêu được một giả định, edge case và cách kiểm chứng.
common_mistakes:
- Bỏ qua invariant hoặc shape khi áp dụng gguf, quantization và ollama.
- Đánh giá gguf, quantization và ollama bằng một output tốt mà không có baseline hoặc failure case.
- Sao chép ví dụ gguf, quantization và ollama mà không thay input và kiểm tra kết quả biên.
next_lessons:
- phase-21-genai-local-llm-local-llm-4
- phase-22-genai-system-design-genai-system-design-1
review_question_vi: Định nghĩa gguf, quantization và ollama bằng lời của bạn. Input, biến đổi và output là gì?
review_question_en: Define gguf, quantization, and ollama in your own words. What are the input, transformation and output?
review_answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gguf, quantization và ollama. Hãy
  liên hệ cụ thể với gguf, quantization và ollama trong lesson phase-21-genai-local-llm-local-llm-3.
review_answer_en: A strong answer names the input, transformation, output and the context where gguf, quantization, and ollama
  is used. Relate it specifically to gguf, quantization, and ollama in lesson phase-21-genai-local-llm-local-llm-3.
review_cards:
- id: phase-21-genai-local-llm-local-llm-3-recall
  type: recall
  question_vi: Định nghĩa gguf, quantization và ollama bằng lời của bạn. Input, biến đổi và output là gì?
  question_en: Define gguf, quantization, and ollama in your own words. What are the input, transformation and output?
  answer_vi: Một câu trả lời tốt nêu rõ input, phép biến đổi, output và bối cảnh dùng gguf, quantization và ollama.
  answer_en: A strong answer names the input, transformation, output and the context where gguf, quantization, and ollama
    is used.
  hint_vi: Bắt đầu bằng một ví dụ nhỏ có thể tính bằng tay.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-21-genai-local-llm-local-llm-3-application
  type: application
  question_vi: Viết một ví dụ code hoặc thiết kế nhỏ áp dụng gguf, quantization và ollama cho bài toán AI Engineer.
  question_en: Write a small code example or design that applies gguf, quantization, and ollama to an AI engineering problem.
  answer_vi: Ví dụ cho gguf, quantization và ollama cần có input rõ ràng, output mong đợi và một cách chạy hoặc kiểm chứng
    (phase-21-genai-local-llm-local-llm-3).
  answer_en: The gguf, quantization, and ollama example should have an explicit input, expected output and a way to run or
    verify it (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Dùng code example trong lesson rồi thay một giả định.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-21-genai-local-llm-local-llm-3-debug
  type: debug
  question_vi: Nếu kết quả của gguf, quantization và ollama sai hoặc metric giảm, bạn sẽ debug theo thứ tự nào?
  question_en: If gguf, quantization, and ollama produces a wrong result or a metric drops, what would you debug first?
  answer_vi: Với gguf, quantization và ollama, kiểm tra input/shape, preprocessing và baseline trước; sau đó cô lập lỗi bằng
    test nhỏ và error analysis (phase-21-genai-local-llm-local-llm-3).
  answer_en: For gguf, quantization, and ollama, check inputs/shapes, preprocessing and the baseline first; then isolate the
    failure with a small test and error analysis (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Đừng bắt đầu bằng việc đổi model hoặc tăng độ phức tạp.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-21-genai-local-llm-local-llm-3-interview
  type: interview
  question_vi: Trong phỏng vấn, bạn sẽ giải thích trade-off và một edge case của gguf, quantization và ollama như thế nào?
  question_en: In an interview, how would you explain a trade-off and one edge case of gguf, quantization, and ollama?
  answer_vi: Câu trả lời về gguf, quantization và ollama cần nêu giả định, metric/chi phí, giới hạn và cách giảm rủi ro trong
    production (phase-21-genai-local-llm-local-llm-3).
  answer_en: The answer about gguf, quantization, and ollama should cover assumptions, metrics/cost, limitations and how to
    reduce production risk (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Liên hệ với latency, chất lượng, chi phí hoặc khả năng quan sát nếu phù hợp.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# GGUF, quantization và Ollama / GGUF, quantization, and Ollama

GGUF, quantization và Ollama là tối ưu hóa model sau khi đã có evaluation baseline. Chuẩn bị dataset sạch, tách train/eval, theo dõi memory và quality regression; chọn fine-tuning, quantization hoặc local serving dựa trên chất lượng, latency, chi phí và quyền riêng tư.

## Practice

Chạy một model nhỏ local, đo cold/warm latency, tokens/sec, VRAM và so sánh quantized với full precision.
