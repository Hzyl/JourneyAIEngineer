---
lesson_id: phase-10-genai-transformers-genai-transformers-3
phase_id: phase-10-genai-transformers
module_id: genai-transformers
title_vi: Encoder và decoder của Transformer
title_en: Transformer encoders and decoders
summary_vi: Phân biệt encoder, decoder và encoder–decoder; kiểm tra model card theo ID và phiên bản cụ thể.
summary_en: Distinguish encoder, decoder and encoder–decoder architectures; inspect a model card by exact ID and
  revision.
learning_objectives:
- Phân biệt encoder, decoder và encoder–decoder; kiểm tra model card theo ID và phiên bản cụ thể.
- Chạy bộ kiểm tra ba model card giả lập; thêm một card thiếu revision rồi ghi lỗi. Trong Colab Lab A, đối chiếu
  card của embedding model được chọn trước khi bật model thật.
- Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
learning_objectives_en:
- Distinguish encoder, decoder and encoder–decoder architectures; inspect a model card by exact ID and revision.
- Run the three synthetic model-card checks; add a card missing its revision and record the error. In Colab Lab
  A, inspect the selected embedding model card before enabling real execution.
- Removing revision must return missing:revision; UNKNOWN is not a verified license.
prerequisites:
- phase-10-genai-transformers-genai-transformers-2
- phase-09-genai-ml-fundamentals-genai-ml-fundamentals-1
key_terms:
- transformer
- encoder
- decoder
- PyTorch
- tensor
- loss
- training
- genai-transformers
concept_notes_vi: 'Tokenizer chuyển văn bản thành token ID; token không luôn tương ứng một từ. Encoder dùng ngữ
  cảnh đầu vào để tạo biểu diễn, còn decoder tự hồi quy dự đoán token tiếp theo với ràng buộc nhân quả. Kiến trúc
  encoder–decoder kết hợp biểu diễn đầu vào với quá trình sinh. Không suy kiến trúc hay khả năng từ tên cả họ mô
  hình.


  Embedding là vector biểu diễn, có thể dùng để tìm đoạn gần truy vấn; generation tạo chuỗi token. Độ tương tự không
  chứng minh phát biểu đúng. Ví dụ dưới đây kiểm tra metadata tự tạo, không chạy tokenizer, embedding hoặc model
  thật. Đếm bằng split chỉ là đếm từ cách nhau bởi khoảng trắng, không phải đếm token của model.


  Khi chọn model thật, ghi model_id, commit/revision, tokenizer, kiến trúc, giấy phép cùng điều kiện sử dụng, ngôn
  ngữ được công bố, giới hạn context và yêu cầu bộ nhớ/phần cứng. Để trống điều chưa xác minh thay vì đoán. Tự kiểm
  tra: hai model cùng họ có chắc cùng giấy phép hay tài nguyên không? Không; phải đọc từng model card và đo cấu
  hình cụ thể.'
concept_notes_en: 'A tokenizer maps text to token IDs; a token is not always a word. An encoder produces representations
  from input context, while an autoregressive decoder predicts the next token under a causal constraint. Encoder–decoder
  architectures combine input representations with generation. Do not infer architecture or capabilities from a
  model family name.


  An embedding is a representation vector that can retrieve passages near a query; generation produces a token sequence.
  Similarity does not establish truth. This example checks synthetic metadata; it runs no tokenizer, embedding model
  or generator. Counting with split counts whitespace-separated words, not model tokens.


  For a real model, record model_id, commit/revision, tokenizer, architecture, license and usage conditions, documented
  languages, context limits and memory/hardware needs. Leave unverified fields unknown. Self-check: must two models
  in one family share a license or resource requirements? No; inspect each card and measure the specific configuration.'
why_it_matters_vi: Phân biệt encoder, decoder và encoder–decoder; kiểm tra model card theo ID và phiên bản cụ thể.
why_it_matters_en: Distinguish encoder, decoder and encoder–decoder architectures; inspect a model card by exact
  ID and revision.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy bộ kiểm tra ba model card giả lập; thêm một card thiếu revision rồi ghi lỗi. Trong Colab Lab A, đối chiếu
  card của embedding model được chọn trước khi bật model thật.
- Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run the three synthetic model-card checks; add a card missing its revision and record the error. In Colab Lab
  A, inspect the selected embedding model card before enabling real execution.
- Removing revision must return missing:revision; UNKNOWN is not a verified license.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy bộ kiểm tra ba model card giả lập; thêm một card thiếu revision rồi ghi lỗi. Trong Colab Lab A, đối
      chiếu card của embedding model được chọn trước khi bật model thật.
    deliverables:
    - Bảng model ID, revision, kiến trúc, nhiệm vụ, giấy phép và tài nguyên đã xác minh
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run the three synthetic model-card checks; add a card missing its revision and record the error. In Colab
      Lab A, inspect the selected embedding model card before enabling real execution.
    deliverables:
    - A table of model IDs, revisions, architecture, tasks, licenses and verified resource needs
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Removing revision must return missing:revision; UNKNOWN is not a verified license.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Encoder và decoder của Transformer” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain transformer encoders and decoders to a new teammate?
  - Which assumption behind transformer encoders and decoders could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Inspect an architecture and model-card fixture
  code: "import json\nREQUIRED = (\"model_id\", \"revision\", \"architecture\", \"license\", \"resources\")\ndef\
    \ validate(card):\n    missing = [field for field in REQUIRED if not card.get(field)]\n    return \"missing:\"\
    \ + \",\".join(missing) if missing else \"complete\"\ncards = [\n    dict(model_id=\"fixture/encoder\", revision=\"\
    demo-v1\", architecture=\"encoder\",\n         license=\"UNKNOWN\", resources=\"unmeasured\"),\n    dict(model_id=\"\
    fixture/decoder\", revision=\"demo-v1\", architecture=\"decoder\",\n         license=\"UNKNOWN\", resources=\"\
    unmeasured\"),\n    dict(model_id=\"fixture/seq2seq\", revision=\"demo-v1\", architecture=\"encoder-decoder\"\
    ,\n         license=\"UNKNOWN\", resources=\"unmeasured\"),\n]\nbroken = dict(cards[0])\nbroken.pop(\"revision\"\
    )\nprint(json.dumps({\"cards\": [validate(c) for c in cards],\n                  \"broken\": validate(broken),\
    \ \"model_executed\": False}))\n"
  status: runnable
  purpose_vi: Phân biệt encoder, decoder và encoder–decoder; kiểm tra model card theo ID và phiên bản cụ thể.
  purpose_en: Distinguish encoder, decoder and encoder–decoder architectures; inspect a model card by exact ID and
    revision.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"cards": ["complete", "complete", "complete"], "broken": "missing:revision", "model_executed":
    false}'
  edge_case_vi: Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
  edge_case_en: Removing revision must return missing:revision; UNKNOWN is not a verified license.
  explanation_vi: Ba card là dữ liệu tự tạo để học cách kiểm tra; chương trình không chứng minh năng lực một model
    có thật.
  explanation_en: All three cards are synthetic validation fixtures; the program establishes no real model capability.
resources:
- language: en
  title: PyTorch Tutorials
  url: https://pytorch.org/tutorials/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Illustrated Transformer
  url: https://jalammar.github.io/illustrated-transformer/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Attention Is All You Need
  url: https://arxiv.org/abs/1706.03762
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: 'Stanford CS336: Language Modeling from Scratch (Spring 2026)'
  url: https://cs336.stanford.edu/
  kind: official
  required: false
  purpose_vi: Tài liệu học nâng cao nối dữ liệu, Transformer, huấn luyện, đánh giá và triển khai mô hình ngôn ngữ.
  purpose_en: Advanced course material connecting data, Transformers, training, evaluation, and language-model deployment.
  read_vi: Đọc đề cương và bài phù hợp sau khi đã vững Python, PyTorch, hệ thống và toán; lịch Spring 2026 đã qua,
    không xem đây là khóa đang tuyển sinh.
  read_en: Use the syllabus and relevant assignments only after building Python, PyTorch, systems, and math foundations;
    Spring 2026 has passed, so this is not an active enrollment offer.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
- title: Google Colab — Lab A
  language: vi/en
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb
  kind: external
  required: false
  purpose_vi: Chạy trong Colab để mở rộng ví dụ bằng dữ liệu và báo cáo của lab.
  purpose_en: Run in Colab to extend this example with the lab dataset and reports.
  read_vi: Chọn môi trường CPU do Google lưu trữ, chạy baseline rồi phần embedding tùy chọn. Dùng tập dev trước
    khi đánh giá test và tải báo cáo về.
  read_en: 'Run in Colab on a Google-hosted CPU runtime: baseline first, then optional embeddings. Use dev before
    evaluating test and download the report.'
exercise_ids:
- exercise-10-genai-transformers
review_item_ids:
- phase-10-genai-transformers-genai-transformers-3-recall
- phase-10-genai-transformers-genai-transformers-3-application
- phase-10-genai-transformers-genai-transformers-3-debug
- phase-10-genai-transformers-genai-transformers-3-interview
estimated_minutes: 60
completion_checklist:
- Chạy bộ kiểm tra ba model card giả lập; thêm một card thiếu revision rồi ghi lỗi. Trong Colab Lab A, đối chiếu
  card của embedding model được chọn trước khi bật model thật.
- Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng model ID, revision, kiến trúc, nhiệm vụ, giấy phép và tài nguyên đã xác minh
- Xóa revision phải nhận missing:revision; không coi UNKNOWN là thông tin giấy phép đã xác minh.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- So sánh hiệu năng với độ dài chuỗi hoặc cấu hình sinh khác nhau.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-10-genai-transformers-genai-transformers-4
- phase-11-llm-application-llm-application-1
review_question_vi: Nội dung cốt lõi của “Encoder và decoder của Transformer” là gì?
review_question_en: Define transformer encoders and decoders in your own words. What are the input, transformation
  and output?
review_answer_vi: Encoder tạo biểu diễn ngữ cảnh; decoder phục vụ tạo đầu ra theo cấu trúc kiến trúc. Mặt nạ nhân
  quả cần thiết khi huấn luyện dự đoán token tiếp theo.
review_answer_en: A strong answer names the input, transformation, output and the context where transformer encoders
  and decoders is used. Relate it specifically to transformer encoders and decoders in lesson phase-10-genai-transformers-genai-transformers-3.
review_cards:
- id: phase-10-genai-transformers-genai-transformers-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Encoder và decoder của Transformer” là gì?
  question_en: Define transformer encoders and decoders in your own words. What are the input, transformation and
    output?
  answer_vi: Encoder tạo biểu diễn ngữ cảnh; decoder phục vụ tạo đầu ra theo cấu trúc kiến trúc. Mặt nạ nhân quả
    cần thiết khi huấn luyện dự đoán token tiếp theo.
  answer_en: A strong answer names the input, transformation, output and the context where transformer encoders
    and decoders is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-10-genai-transformers-genai-transformers-3-application
  type: application
  question_vi: Vẽ luồng thông tin và xác định vị trí cần mặt nạ nhân quả.
  question_en: Write a small code example or design that applies transformer encoders and decoders to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Vẽ luồng thông tin và xác định vị trí cần mặt nạ nhân quả”, cần lưu: ví dụ hoặc sơ đồ
    Q/K/V có kích thước và điều kiện đo. Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước.'
  answer_en: The transformer encoders and decoders example should have an explicit input, expected output and a
    way to run or verify it (phase-10-genai-transformers-genai-transformers-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-10-genai-transformers-genai-transformers-3-debug
  type: debug
  question_vi: Khi làm bài “Encoder và decoder của Transformer”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If transformer encoders and decoders produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Encoder và decoder của Transformer”, lỗi cần tránh là: so sánh hiệu năng với độ dài chuỗi
    hoặc cấu hình sinh khác nhau. Đối chiếu luồng thông tin, mặt nạ và bộ nhớ ở từng bước. Dùng ví dụ nhỏ để tìm
    bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For transformer encoders and decoders, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-10-genai-transformers-genai-transformers-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-10-genai-transformers-genai-transformers-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Encoder và decoder của Transformer” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of transformer encoders and
    decoders?
  answer_vi: Bắt đầu từ nhiệm vụ “Vẽ luồng thông tin và xác định vị trí cần mặt nạ nhân quả”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about transformer encoders and decoders should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-10-genai-transformers-genai-transformers-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Encoder và decoder của Transformer / Transformer encoders and decoders

Tokenizer chuyển văn bản thành token ID; token không luôn tương ứng một từ. Encoder dùng ngữ cảnh đầu vào để tạo biểu diễn, còn decoder tự hồi quy dự đoán token tiếp theo với ràng buộc nhân quả. Kiến trúc encoder–decoder kết hợp biểu diễn đầu vào với quá trình sinh. Không suy kiến trúc hay khả năng từ tên cả họ mô hình.

Embedding là vector biểu diễn, có thể dùng để tìm đoạn gần truy vấn; generation tạo chuỗi token. Độ tương tự không chứng minh phát biểu đúng. Ví dụ dưới đây kiểm tra metadata tự tạo, không chạy tokenizer, embedding hoặc model thật. Đếm bằng split chỉ là đếm từ cách nhau bởi khoảng trắng, không phải đếm token của model.

Khi chọn model thật, ghi model_id, commit/revision, tokenizer, kiến trúc, giấy phép cùng điều kiện sử dụng, ngôn ngữ được công bố, giới hạn context và yêu cầu bộ nhớ/phần cứng. Để trống điều chưa xác minh thay vì đoán. Tự kiểm tra: hai model cùng họ có chắc cùng giấy phép hay tài nguyên không? Không; phải đọc từng model card và đo cấu hình cụ thể.

## English

A tokenizer maps text to token IDs; a token is not always a word. An encoder produces representations from input context, while an autoregressive decoder predicts the next token under a causal constraint. Encoder–decoder architectures combine input representations with generation. Do not infer architecture or capabilities from a model family name.

An embedding is a representation vector that can retrieve passages near a query; generation produces a token sequence. Similarity does not establish truth. This example checks synthetic metadata; it runs no tokenizer, embedding model or generator. Counting with split counts whitespace-separated words, not model tokens.

For a real model, record model_id, commit/revision, tokenizer, architecture, license and usage conditions, documented languages, context limits and memory/hardware needs. Leave unverified fields unknown. Self-check: must two models in one family share a license or resource requirements? No; inspect each card and measure the specific configuration.

## Thực hành / Practice

Chạy bộ kiểm tra ba model card giả lập; thêm một card thiếu revision rồi ghi lỗi. Trong Colab Lab A, đối chiếu card của embedding model được chọn trước khi bật model thật.

Run the three synthetic model-card checks; add a card missing its revision and record the error. In Colab Lab A, inspect the selected embedding model card before enabling real execution.
