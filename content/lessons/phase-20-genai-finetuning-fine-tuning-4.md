---
lesson_id: phase-20-genai-finetuning-fine-tuning-4
phase_id: phase-20-genai-finetuning
module_id: fine-tuning
title_vi: Lượng tử hóa và lựa chọn mô hình
title_en: Quantization and model trade-offs
summary_vi: Lượng tử hóa giảm độ chính xác biểu diễn để tiết kiệm tài nguyên, nhưng tác động chất lượng và tốc độ
  phụ thuộc phần cứng, cách cài đặt.
summary_en: Learn Quantization and model trade-offs through an input → transformation → output model, then verify
  it with an edge-case exercise.
learning_objectives:
- So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain quantization and model trade-offs with a concrete example.
- Write or adapt a small code example applying quantization and model trade-offs.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-20-genai-finetuning-fine-tuning-3
- phase-19-genai-production-genai-production-1
key_terms:
- quantization
- model
- trade
- offs
- token
- embedding
- retrieval
- evaluation
- fine-tuning
concept_notes_vi: Lượng tử hóa giảm độ chính xác biểu diễn để tiết kiệm tài nguyên, nhưng tác động chất lượng và
  tốc độ phụ thuộc phần cứng, cách cài đặt. Đo thực tế trước khi chọn.
concept_notes_en: Quantization và model trade-offs is model optimization after establishing an evaluation baseline.
  Prepare clean data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization,
  or local serving based on quality, latency, cost, and privacy.
why_it_matters_vi: Chỉ chọn tinh chỉnh khi dữ liệu và đánh giá cho thấy giải pháp hiện tại chưa đáp ứng nhiệm vụ.
why_it_matters_en: Fine-tuning is justified only when data and evaluation show prompting/RAG are insufficient.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Quantization and model trade-offs” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm. Ghi kết quả đối chiếu và điều bạn đã sửa nếu
  lần đầu chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Fine-tuning is justified only when data and evaluation show prompting/RAG
  are insufficient.'
- Open Hugging Face PEFT, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Prepare a dataset with explicit splits and licensing, run a small LoRA experiment,
  and compare memory and quality to baseline.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: 'So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.


      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chuẩn bị dữ liệu có cách chia và giấy
      phép rõ, chạy LoRA nhỏ rồi so sánh chất lượng, bộ nhớ với mô hình cơ sở.'
    deliverables:
    - Bảng dữ liệu hoặc kết quả trước, sau thay đổi với cấu hình rõ
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Prepare a dataset with explicit splits and licensing, run a small LoRA experiment, and compare memory
      and quality to baseline.
    deliverables:
    - One working implementation
    - One test or benchmark
    - One note on failure modes and trade-offs
    checkpoint: You can defend whether to fine-tune using quality, cost, data volume, and maintenance risk.
    stretch: Add a failure test for quantization and model trade-offs and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Lượng tử hóa và lựa chọn mô hình” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain quantization and model trade-offs to a new teammate?
  - Which assumption behind quantization and model trade-offs could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'Quantization and model trade-offs: inspect one complete path'
  code: "# Topic: Quantization and model trade-offs (phase-20-genai-finetuning-fine-tuning-4)\nfrom dataclasses\
    \ import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for quantization and model trade-offs.
  setup: Python 3.11; cài numpy/scikit-learn/torch/fastapi nếu ví dụ cần thư viện.
  expected_output: Một output nhỏ có thể kiểm tra bằng mắt hoặc bằng test.
  edge_case_vi: Chọn một đầu vào hoặc điều kiện khác phù hợp với ví dụ, rồi ghi kết quả và nguyên nhân.
  edge_case_en: Try an empty input, a wrong shape or missing data and record the failure.
  explanation_vi: Theo dõi từng phép xử lý và đối chiếu đầu ra với dự đoán. Ví dụ mã có thể chỉ minh họa một phần
    nội dung; cần hoàn thành riêng nhiệm vụ thực hành.
  explanation_en: Keep the boundary executable and inspectable; change one input and verify the expected output.
resources:
- language: en
  title: Hugging Face PEFT
  url: https://huggingface.co/docs/peft/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face TRL
  url: https://huggingface.co/docs/trl/index
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: bitsandbytes Documentation
  url: https://huggingface.co/docs/bitsandbytes/main/en/index
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
- exercise-20-fine-tuning
review_item_ids:
- phase-20-genai-finetuning-fine-tuning-4-recall
- phase-20-genai-finetuning-fine-tuning-4-application
- phase-20-genai-finetuning-fine-tuning-4-debug
- phase-20-genai-finetuning-fine-tuning-4-interview
estimated_minutes: 60
completion_checklist:
- So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
common_mistakes:
- Kết luận tinh chỉnh tốt chỉ từ dữ liệu đã dùng để huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-21-genai-local-llm-local-llm-1
- phase-21-genai-local-llm-local-llm-2
review_question_vi: Nội dung cốt lõi của “Lượng tử hóa và lựa chọn mô hình” là gì?
review_question_en: Define quantization and model trade-offs in your own words. What are the input, transformation
  and output?
review_answer_vi: Lượng tử hóa giảm độ chính xác biểu diễn để tiết kiệm tài nguyên, nhưng tác động chất lượng và
  tốc độ phụ thuộc phần cứng, cách cài đặt. Đo thực tế trước khi chọn.
review_answer_en: A strong answer names the input, transformation, output and the context where quantization and
  model trade-offs is used. Relate it specifically to quantization and model trade-offs in lesson phase-20-genai-finetuning-fine-tuning-4.
review_cards:
- id: phase-20-genai-finetuning-fine-tuning-4-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Lượng tử hóa và lựa chọn mô hình” là gì?
  question_en: Define quantization and model trade-offs in your own words. What are the input, transformation and
    output?
  answer_vi: Lượng tử hóa giảm độ chính xác biểu diễn để tiết kiệm tài nguyên, nhưng tác động chất lượng và tốc
    độ phụ thuộc phần cứng, cách cài đặt. Đo thực tế trước khi chọn.
  answer_en: A strong answer names the input, transformation, output and the context where quantization and model
    trade-offs is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-20-genai-finetuning-fine-tuning-4-application
  type: application
  question_vi: So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.
  question_en: Write a small code example or design that applies quantization and model trade-offs to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình”, cần lưu: bảng dữ liệu
    hoặc kết quả trước, sau thay đổi với cấu hình rõ. So sánh trên tập giữ riêng và đọc các trường hợp chất lượng
    giảm.'
  answer_en: The quantization and model trade-offs example should have an explicit input, expected output and a
    way to run or verify it (phase-20-genai-finetuning-fine-tuning-4).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-20-genai-finetuning-fine-tuning-4-debug
  type: debug
  question_vi: Khi làm bài “Lượng tử hóa và lựa chọn mô hình”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If quantization and model trade-offs produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Lượng tử hóa và lựa chọn mô hình”, lỗi cần tránh là: kết luận tinh chỉnh tốt chỉ từ dữ
    liệu đã dùng để huấn luyện. So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm. Dùng ví dụ nhỏ
    để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For quantization and model trade-offs, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-20-genai-finetuning-fine-tuning-4).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-20-genai-finetuning-fine-tuning-4-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Lượng tử hóa và lựa chọn mô hình” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of quantization and model trade-offs?
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about quantization and model trade-offs should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-20-genai-finetuning-fine-tuning-4).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Lượng tử hóa và lựa chọn mô hình / Quantization and model trade-offs

Lượng tử hóa giảm độ chính xác biểu diễn để tiết kiệm tài nguyên, nhưng tác động chất lượng và tốc độ phụ thuộc phần cứng, cách cài đặt. Đo thực tế trước khi chọn.

## Thực hành

So sánh chất lượng, bộ nhớ và độ trễ của hai cấu hình mô hình.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chuẩn bị dữ liệu có cách chia và giấy phép rõ, chạy LoRA nhỏ rồi so sánh chất lượng, bộ nhớ với mô hình cơ sở.
