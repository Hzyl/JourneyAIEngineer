---
lesson_id: phase-21-genai-local-llm-local-llm-2
phase_id: phase-21-genai-local-llm
module_id: local-llm
title_vi: vLLM và thông lượng phục vụ
title_en: vLLM and serving throughput
summary_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian.
summary_en: Learn vLLM and serving throughput through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain vllm and serving throughput with a concrete example.
- Write or adapt a small code example applying vllm and serving throughput.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-21-genai-local-llm-local-llm-1
- phase-20-genai-finetuning-fine-tuning-1
key_terms:
- vllm
- serving
- throughput
- token
- embedding
- retrieval
- evaluation
- local-llm
concept_notes_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu
  cầu đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.
concept_notes_en: vLLM và serving throughput is model optimization after establishing an evaluation baseline. Prepare
  clean data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local
  serving based on quality, latency, cost, and privacy.
why_it_matters_vi: Đo tài nguyên và chất lượng để chọn mô hình cục bộ phù hợp phần cứng, nhu cầu riêng tư.
why_it_matters_en: Local LLMs expose the trade-offs among memory, throughput, model size, quality, and privacy.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “vLLM and serving throughput” trong tài liệu tham khảo; đối chiếu với phần giải thích của
  bài.
- Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.
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
    task: 'Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.


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
    stretch: Add a failure test for vllm and serving throughput and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “vLLM và thông lượng phục vụ” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain vllm and serving throughput to a new teammate?
  - Which assumption behind vllm and serving throughput could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'vLLM and serving throughput: inspect one complete path'
  code: "# Topic: vLLM and serving throughput (phase-21-genai-local-llm-local-llm-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for vllm and serving throughput.
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
- phase-21-genai-local-llm-local-llm-2-recall
- phase-21-genai-local-llm-local-llm-2-application
- phase-21-genai-local-llm-local-llm-2-debug
- phase-21-genai-local-llm-local-llm-2-interview
estimated_minutes: 60
completion_checklist:
- Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
common_mistakes:
- So sánh token mỗi giây giữa các lần chạy khác tải hoặc khác độ dài chuỗi.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-21-genai-local-llm-local-llm-3
- phase-21-genai-local-llm-local-llm-4
review_question_vi: Nội dung cốt lõi của “vLLM và thông lượng phục vụ” là gì?
review_question_en: Define vllm and serving throughput in your own words. What are the input, transformation and
  output?
review_answer_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu
  cầu đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.
review_answer_en: A strong answer names the input, transformation, output and the context where vllm and serving
  throughput is used. Relate it specifically to vllm and serving throughput in lesson phase-21-genai-local-llm-local-llm-2.
review_cards:
- id: phase-21-genai-local-llm-local-llm-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “vLLM và thông lượng phục vụ” là gì?
  question_en: Define vllm and serving throughput in your own words. What are the input, transformation and output?
  answer_vi: Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu cầu
    đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.
  answer_en: A strong answer names the input, transformation, output and the context where vllm and serving throughput
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-21-genai-local-llm-local-llm-2-application
  type: application
  question_vi: Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.
  question_en: Write a small code example or design that applies vllm and serving throughput to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau”, cần lưu: cấu hình phần
    cứng, mô hình và bảng đo hiệu năng. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất
    quán.'
  answer_en: The vllm and serving throughput example should have an explicit input, expected output and a way to
    run or verify it (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-21-genai-local-llm-local-llm-2-debug
  type: debug
  question_vi: Khi làm bài “vLLM và thông lượng phục vụ”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If vllm and serving throughput produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “vLLM và thông lượng phục vụ”, lỗi cần tránh là: so sánh token mỗi giây giữa các lần chạy
    khác tải hoặc khác độ dài chuỗi. Tách thời gian nạp mô hình khỏi thời gian sinh và giữ điều kiện đo nhất quán.
    Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For vllm and serving throughput, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-21-genai-local-llm-local-llm-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “vLLM và thông lượng phục vụ” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of vllm and serving throughput?
  answer_vi: Bắt đầu từ nhiệm vụ “Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about vllm and serving throughput should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-21-genai-local-llm-local-llm-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# vLLM và thông lượng phục vụ / vLLM and serving throughput

Thông lượng đo lượng công việc hoàn tất theo thời gian. Khi đánh giá hệ phục vụ, cần ghi số yêu cầu đồng thời, độ dài chuỗi và độ trễ để biết thông lượng tăng có làm chờ lâu hơn.

## Thực hành

Đo thông lượng cùng độ trễ dưới các mức đồng thời khác nhau.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chạy mô hình nhỏ, đo thời gian trước và sau khi nạp, token/giây, VRAM; so sánh bản lượng tử hóa với bản đầy đủ.
