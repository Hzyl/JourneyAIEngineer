---
lesson_id: phase-21-genai-local-llm-local-llm-3
phase_id: phase-21-genai-local-llm
module_id: local-llm
title_vi: GGUF, lượng tử hóa và Ollama
title_en: GGUF, quantization, and Ollama
summary_vi: GGUF là định dạng lưu mô hình; lượng tử hóa thay đổi cách biểu diễn trọng số; Ollama hỗ trợ chạy mô
  hình cục bộ.
summary_en: Learn GGUF, quantization, and Ollama through an input → transformation → output model, then verify it
  with an edge-case exercise.
learning_objectives:
- Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: GGUF là định dạng lưu mô hình; lượng tử hóa thay đổi cách biểu diễn trọng số; Ollama hỗ trợ chạy
  mô hình cục bộ. Cần kiểm tra tương thích của tệp, mô hình và môi trường.
concept_notes_en: GGUF, quantization và Ollama is model optimization after establishing an evaluation baseline.
  Prepare clean data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization,
  or local serving based on quality, latency, cost, and privacy.
why_it_matters_vi: Đo tài nguyên và chất lượng để chọn mô hình cục bộ phù hợp phần cứng, nhu cầu riêng tư.
why_it_matters_en: Local LLMs expose the trade-offs among memory, throughput, model size, quality, and privacy.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “GGUF, quantization, and Ollama” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán. Ghi kết quả đối chiếu và điều bạn
  đã sửa nếu lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Local LLMs expose the trade-offs among memory, throughput, model size, quality,
  and privacy.'
- Open vLLM Documentation, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare
  quantized with full precision.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chạy mô hình nhỏ, đo thời gian trước
      và sau khi nạp, token/giây, VRAM; so sánh bản lượng tử hóa với bản đầy đủ.'
    deliverables:
    - Cấu hình phần cứng, mô hình và bảng đo hiệu năng
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Run a small local model, measure cold/warm latency, tokens/sec, VRAM, and compare quantized with full
      precision.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can choose a runtime from hardware, workload, and privacy requirements rather than hype.
    stretch: Add a failure test for gguf, quantization, and ollama and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “GGUF, lượng tử hóa và Ollama” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain gguf, quantization, and ollama to a new teammate?
  - Which assumption behind gguf, quantization, and ollama could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'GGUF, quantization, and Ollama: inspect one complete path'
  code: "# Topic: GGUF, quantization, and Ollama (phase-21-genai-local-llm-local-llm-3)\nfrom dataclasses import\
    \ dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for gguf, quantization, and ollama.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: vLLM Documentation
  url: https://docs.vllm.ai/en/latest/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ollama Documentation
  url: https://docs.ollama.com/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: llama.cpp
  url: https://github.com/ggml-org/llama.cpp
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
- exercise-21-local-llm
review_item_ids:
- phase-21-genai-local-llm-local-llm-3-recall
- phase-21-genai-local-llm-local-llm-3-application
- phase-21-genai-local-llm-local-llm-3-debug
- phase-21-genai-local-llm-local-llm-3-interview
estimated_minutes: 60
completion_checklist:
- Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
common_mistakes:
- So sánh token mỗi giây giữa các lần chạy khác tải hoặc khác độ dài chuỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-21-genai-local-llm-local-llm-4
- phase-22-genai-system-design-genai-system-design-1
review_question_vi: Nội dung cốt lõi của “GGUF, lượng tử hóa và Ollama” là gì?
review_question_en: Define gguf, quantization, and ollama in your own words. What are the input, transformation
  and output?
review_answer_vi: GGUF là định dạng lưu mô hình; lượng tử hóa thay đổi cách biểu diễn trọng số; Ollama hỗ trợ chạy
  mô hình cục bộ. Cần kiểm tra tương thích của tệp, mô hình và môi trường.
review_answer_en: A strong answer names the input, transformation, output and the context where gguf, quantization,
  and ollama is used. Relate it specifically to gguf, quantization, and ollama in lesson phase-21-genai-local-llm-local-llm-3.
review_cards:
- id: phase-21-genai-local-llm-local-llm-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “GGUF, lượng tử hóa và Ollama” là gì?
  question_en: Define gguf, quantization, and ollama in your own words. What are the input, transformation and output?
  answer_vi: GGUF là định dạng lưu mô hình; lượng tử hóa thay đổi cách biểu diễn trọng số; Ollama hỗ trợ chạy mô
    hình cục bộ. Cần kiểm tra tương thích của tệp, mô hình và môi trường.
  answer_en: A strong answer names the input, transformation, output and the context where gguf, quantization, and
    ollama is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-21-genai-local-llm-local-llm-3-application
  type: application
  question_vi: Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.
  question_en: Write a small code example or design that applies gguf, quantization, and ollama to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử”, cần lưu: cấu hình
    phần cứng, mô hình và bảng đo hiệu năng. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo
    nhất quán.'
  answer_en: The gguf, quantization, and ollama example should have an explicit input, expected output and a way
    to run or verify it (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-21-genai-local-llm-local-llm-3-debug
  type: debug
  question_vi: Khi làm bài “GGUF, lượng tử hóa và Ollama”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If gguf, quantization, and ollama produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “GGUF, lượng tử hóa và Ollama”, lỗi cần tránh là: so sánh token mỗi giây giữa các lần chạy
    khác tải hoặc khác độ dài chuỗi. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For gguf, quantization, and ollama, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-21-genai-local-llm-local-llm-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “GGUF, lượng tử hóa và Ollama” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of gguf, quantization, and ollama?
  answer_vi: Bắt đầu từ nhiệm vụ “Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about gguf, quantization, and ollama should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-21-genai-local-llm-local-llm-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# GGUF, lượng tử hóa và Ollama / GGUF, quantization, and Ollama

GGUF là định dạng lưu mô hình; lượng tử hóa thay đổi cách biểu diễn trọng số; Ollama hỗ trợ chạy mô hình cục bộ. Cần kiểm tra tương thích của tệp, mô hình và môi trường.

## Thực hành

Ghi định dạng, mức lượng tử hóa và bộ nhớ cần cho mô hình đang thử.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chạy mô hình nhỏ, đo thời gian trước và sau khi nạp, token/giây, VRAM; so sánh bản lượng tử hóa với bản đầy đủ.
