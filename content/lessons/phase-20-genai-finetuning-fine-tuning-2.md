---
lesson_id: phase-20-genai-finetuning-fine-tuning-2
phase_id: phase-20-genai-finetuning
module_id: fine-tuning
title_vi: LoRA, QLoRA và PEFT
title_en: LoRA, QLoRA, and PEFT
summary_vi: LoRA học cập nhật hạng thấp; QLoRA kết hợp cách tinh chỉnh này với mô hình nền được lượng tử hóa.
summary_en: Learn LoRA, QLoRA, and PEFT through an input → transformation → output model, then verify it with an
  edge-case exercise.
learning_objectives:
- Giải thích phần tham số được học và phần được giữ cố định.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
- Giải thích kết quả và nêu một giới hạn của bài làm.
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
concept_notes_vi: LoRA học cập nhật hạng thấp; QLoRA kết hợp cách tinh chỉnh này với mô hình nền được lượng tử hóa.
  So sánh cần ghi bộ nhớ, cấu hình và chất lượng trên cùng nhiệm vụ.
concept_notes_en: LoRA, QLoRA và PEFT is model optimization after establishing an evaluation baseline. Prepare clean
  data, split train/eval, track memory and quality regressions, and choose fine-tuning, quantization, or local serving
  based on quality, latency, cost, and privacy.
why_it_matters_vi: Chỉ chọn tinh chỉnh khi dữ liệu và đánh giá cho thấy giải pháp hiện tại chưa đáp ứng nhiệm vụ.
why_it_matters_en: Fine-tuning is justified only when data and evaluation show prompting/RAG are insufficient.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “LoRA, QLoRA, and PEFT” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Giải thích phần tham số được học và phần được giữ cố định.
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
    task: 'Giải thích phần tham số được học và phần được giữ cố định.


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
    stretch: Add a failure test for lora, qlora, and peft and explain the result.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “LoRA, QLoRA và PEFT” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain lora, qlora, and peft to a new teammate?
  - Which assumption behind lora, qlora, and peft could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: 'LoRA, QLoRA, and PEFT: inspect one complete path'
  code: "# Topic: LoRA, QLoRA, and PEFT (phase-20-genai-finetuning-fine-tuning-2)\nfrom dataclasses import dataclass\n\
    \n@dataclass(frozen=True)\nclass Result:\n    value: str\n    valid: bool\n\nresult = Result(value='ready',\
    \ valid=True)\nprint(result)"
  status: runnable
  purpose_vi: Chạy ví dụ để quan sát cấu trúc dữ liệu và kết quả trước khi liên hệ với nhiệm vụ của bài.
  purpose_en: Illustrate the input-to-output path for lora, qlora, and peft.
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
- phase-20-genai-finetuning-fine-tuning-2-recall
- phase-20-genai-finetuning-fine-tuning-2-application
- phase-20-genai-finetuning-fine-tuning-2-debug
- phase-20-genai-finetuning-fine-tuning-2-interview
estimated_minutes: 60
completion_checklist:
- Giải thích phần tham số được học và phần được giữ cố định.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Giải thích phần tham số được học và phần được giữ cố định.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.
common_mistakes:
- Kết luận tinh chỉnh tốt chỉ từ dữ liệu đã dùng để huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-20-genai-finetuning-fine-tuning-3
- phase-20-genai-finetuning-fine-tuning-4
review_question_vi: Nội dung cốt lõi của “LoRA, QLoRA và PEFT” là gì?
review_question_en: Define lora, qlora, and peft in your own words. What are the input, transformation and output?
review_answer_vi: LoRA học cập nhật hạng thấp; QLoRA kết hợp cách tinh chỉnh này với mô hình nền được lượng tử hóa.
  So sánh cần ghi bộ nhớ, cấu hình và chất lượng trên cùng nhiệm vụ.
review_answer_en: A strong answer names the input, transformation, output and the context where lora, qlora, and
  peft is used. Relate it specifically to lora, qlora, and peft in lesson phase-20-genai-finetuning-fine-tuning-2.
review_cards:
- id: phase-20-genai-finetuning-fine-tuning-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “LoRA, QLoRA và PEFT” là gì?
  question_en: Define lora, qlora, and peft in your own words. What are the input, transformation and output?
  answer_vi: LoRA học cập nhật hạng thấp; QLoRA kết hợp cách tinh chỉnh này với mô hình nền được lượng tử hóa. So
    sánh cần ghi bộ nhớ, cấu hình và chất lượng trên cùng nhiệm vụ.
  answer_en: A strong answer names the input, transformation, output and the context where lora, qlora, and peft
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-20-genai-finetuning-fine-tuning-2-application
  type: application
  question_vi: Giải thích phần tham số được học và phần được giữ cố định.
  question_en: Write a small code example or design that applies lora, qlora, and peft to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Giải thích phần tham số được học và phần được giữ cố định”, cần lưu: bảng dữ liệu hoặc
    kết quả trước, sau thay đổi với cấu hình rõ. So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm.'
  answer_en: The lora, qlora, and peft example should have an explicit input, expected output and a way to run or
    verify it (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-20-genai-finetuning-fine-tuning-2-debug
  type: debug
  question_vi: Khi làm bài “LoRA, QLoRA và PEFT”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If lora, qlora, and peft produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “LoRA, QLoRA và PEFT”, lỗi cần tránh là: kết luận tinh chỉnh tốt chỉ từ dữ liệu đã dùng
    để huấn luyện. So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For lora, qlora, and peft, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-20-genai-finetuning-fine-tuning-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “LoRA, QLoRA và PEFT” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of lora, qlora, and peft?
  answer_vi: Bắt đầu từ nhiệm vụ “Giải thích phần tham số được học và phần được giữ cố định”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about lora, qlora, and peft should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-20-genai-finetuning-fine-tuning-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# LoRA, QLoRA và PEFT / LoRA, QLoRA, and PEFT

LoRA học cập nhật hạng thấp; QLoRA kết hợp cách tinh chỉnh này với mô hình nền được lượng tử hóa. So sánh cần ghi bộ nhớ, cấu hình và chất lượng trên cùng nhiệm vụ.

## Thực hành

Giải thích phần tham số được học và phần được giữ cố định.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Chuẩn bị dữ liệu có cách chia và giấy phép rõ, chạy LoRA nhỏ rồi so sánh chất lượng, bộ nhớ với mô hình cơ sở.
