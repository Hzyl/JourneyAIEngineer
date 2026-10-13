---
lesson_id: phase-20-genai-finetuning-fine-tuning-3
phase_id: phase-20-genai-finetuning
module_id: fine-tuning
title_vi: Đánh giá sau tinh chỉnh
title_en: Fine-tuning evaluation
summary_vi: Đánh giá trước/sau tinh chỉnh trên tập giữ riêng, phát hiện leakage và lỗi theo nhóm.
summary_en: Evaluate baseline and tuned candidates on held-out data and detect leakage and slice regressions.
learning_objectives:
- Đánh giá trước/sau tinh chỉnh trên tập giữ riêng, phát hiện leakage và lỗi theo nhóm.
- Đối chiếu baseline/candidate trên ba câu giữ riêng; đổi một nhãn để thấy điểm đổi. Thêm test ID vào train để phát
  hiện leakage.
- ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
learning_objectives_en:
- Evaluate baseline and tuned candidates on held-out data and detect leakage and slice regressions.
- Compare baseline/candidate on three held-out questions; change one label to observe the score change. Add a test
  ID to train to detect leakage.
- An ID overlap between train and test must fail validation rather than silently dropping the row.
prerequisites:
- phase-20-genai-finetuning-fine-tuning-2
- phase-19-genai-production-genai-production-1
key_terms:
- fine
- tuning
- evaluation
- token
- embedding
- retrieval
- fine-tuning
concept_notes_vi: 'Fine-tuning thay đổi tham số mô hình; RAG đưa thêm bằng chứng vào lúc xử lý. Không dùng fine-tuning
  như cách thay thế mặc định cho tài liệu mới. Trước khi tinh chỉnh, cần baseline, dữ liệu có quyền sử dụng, giấy
  phép model, tiêu chí đánh giá và ngân sách tài nguyên.


  Tách train, dev và test theo đơn vị có nguy cơ trùng, chẳng hạn cùng tài liệu hoặc người viết. Dùng dev để chọn
  cấu hình; giữ test riêng đến lúc so cuối. Nếu nhiều lần chọn theo điểm test, nó đã trở thành dữ liệu phục vụ lựa
  chọn. Ví dụ so các dự đoán tự tạo bằng exact match và phát hiện ID train/test trùng; không chạy huấn luyện hay
  khẳng định model đã tốt hơn.


  Tự kiểm tra: điểm chung tăng có đủ chấp nhận model mới không? Không; kiểm tra lỗi theo nhóm, từ chối câu thiếu
  dữ liệu, chi phí và latency trong cùng workload. Exact match phù hợp đáp án ngắn chuẩn hóa; với câu mở cần rubric
  hỗ trợ nguồn hoặc người chấm. PEFT giảm phần tham số cần học nhưng không bảo đảm chất lượng.'
concept_notes_en: 'Fine-tuning changes model parameters; RAG adds evidence at inference time. Fine-tuning is not
  the default substitute for updated documents. Establish a baseline, permitted data use, model license, evaluation
  criteria and resource budget first.


  Split train, dev and test by the unit likely to leak, such as source document or author. Use dev for configuration
  selection and reserve test for the final comparison. Repeatedly choosing by test scores turns test into selection
  data. This example compares synthetic predictions with exact match and detects overlapping train/test IDs; it
  performs no training and establishes no real model improvement.


  Self-check: is a higher aggregate score sufficient to accept a candidate? No; inspect slice regressions, abstention,
  cost and latency under the same workload. Exact match suits short normalized answers; open responses need evidence-based
  rubrics or human review. PEFT reduces trainable parameters but does not guarantee quality.'
why_it_matters_vi: Đánh giá trước/sau tinh chỉnh trên tập giữ riêng, phát hiện leakage và lỗi theo nhóm.
why_it_matters_en: Evaluate baseline and tuned candidates on held-out data and detect leakage and slice regressions.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Đối chiếu baseline/candidate trên ba câu giữ riêng; đổi một nhãn để thấy điểm đổi. Thêm test ID vào train để phát
  hiện leakage.
- ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Compare baseline/candidate on three held-out questions; change one label to observe the score change. Add a test
  ID to train to detect leakage.
- An ID overlap between train and test must fail validation rather than silently dropping the row.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Đối chiếu baseline/candidate trên ba câu giữ riêng; đổi một nhãn để thấy điểm đổi. Thêm test ID vào train
      để phát hiện leakage.
    deliverables:
    - Bảng dữ liệu train/dev/test, dự đoán trước/sau và lỗi theo từng câu
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Compare baseline/candidate on three held-out questions; change one label to observe the score change.
      Add a test ID to train to detect leakage.
    deliverables:
    - A train/dev/test manifest, before/after predictions and per-question failures
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: An ID overlap between train and test must fail validation rather than silently dropping the row.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Đánh giá sau tinh chỉnh” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain fine-tuning evaluation to a new teammate?
  - Which assumption behind fine-tuning evaluation could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- Exact-match accuracy = matching predictions / evaluated examples
code_examples:
- language: python
  title: Compare baseline and candidate on a fixed held-out fixture
  code: "import json\ndef check_split(train_ids, test_ids):\n    if set(train_ids) & set(test_ids):\n        raise\
    \ ValueError(\"train/test overlap\")\ndef accuracy(predictions, gold):\n    if set(predictions) != set(gold):\n\
    \        raise ValueError(\"prediction IDs differ\")\n    return sum(predictions[k] == value for k, value in\
    \ gold.items()) / len(gold)\ngold = {\"test-1\": \"yes\", \"test-2\": \"no\", \"test-3\": \"abstain\"}\nbaseline\
    \ = {\"test-1\": \"yes\", \"test-2\": \"yes\", \"test-3\": \"answer\"}\ncandidate = {\"test-1\": \"yes\", \"\
    test-2\": \"no\", \"test-3\": \"answer\"}\ncheck_split([\"train-1\"], gold)\ntry:\n    check_split([\"test-1\"\
    ], gold)\nexcept ValueError as error:\n    leakage = str(error)\nprint(json.dumps({\"baseline\": round(accuracy(baseline,\
    \ gold), 3),\n                  \"candidate\": round(accuracy(candidate, gold), 3),\n                  \"remaining_failures\"\
    : [k for k in gold if candidate[k] != gold[k]],\n                  \"leakage\": leakage}))\n"
  status: runnable
  purpose_vi: Đánh giá trước/sau tinh chỉnh trên tập giữ riêng, phát hiện leakage và lỗi theo nhóm.
  purpose_en: Evaluate baseline and tuned candidates on held-out data and detect leakage and slice regressions.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"baseline": 0.333, "candidate": 0.667, "remaining_failures": ["test-3"], "leakage": "train/test
    overlap"}'
  edge_case_vi: ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
  edge_case_en: An ID overlap between train and test must fail validation rather than silently dropping the row.
  explanation_vi: Các dự đoán là dữ liệu mô phỏng; kết quả tính được chỉ minh họa đánh giá và không chứng minh fine-tuning
    hiệu quả.
  explanation_en: Predictions are fixtures; computed scores demonstrate evaluation rather than successful fine-tuning.
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
- exercise-20-fine-tuning
review_item_ids:
- phase-20-genai-finetuning-fine-tuning-3-recall
- phase-20-genai-finetuning-fine-tuning-3-application
- phase-20-genai-finetuning-fine-tuning-3-debug
- phase-20-genai-finetuning-fine-tuning-3-interview
estimated_minutes: 60
completion_checklist:
- Đối chiếu baseline/candidate trên ba câu giữ riêng; đổi một nhãn để thấy điểm đổi. Thêm test ID vào train để phát
  hiện leakage.
- ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng dữ liệu train/dev/test, dự đoán trước/sau và lỗi theo từng câu
- ID trùng giữa train và test phải làm kiểm tra thất bại, không được tự bỏ dòng rồi báo đạt.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Kết luận tinh chỉnh tốt chỉ từ dữ liệu đã dùng để huấn luyện.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-20-genai-finetuning-fine-tuning-4
- phase-21-genai-local-llm-local-llm-1
review_question_vi: Nội dung cốt lõi của “Đánh giá sau tinh chỉnh” là gì?
review_question_en: Define fine-tuning evaluation in your own words. What are the input, transformation and output?
review_answer_vi: So sánh mô hình tinh chỉnh với mô hình cơ sở bằng cùng tập kiểm tra và cách sinh. Cần xem cả nhiệm
  vụ mục tiêu và khả năng suy giảm ở các tình huống liên quan.
review_answer_en: A strong answer names the input, transformation, output and the context where fine-tuning evaluation
  is used. Relate it specifically to fine-tuning evaluation in lesson phase-20-genai-finetuning-fine-tuning-3.
review_cards:
- id: phase-20-genai-finetuning-fine-tuning-3-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đánh giá sau tinh chỉnh” là gì?
  question_en: Define fine-tuning evaluation in your own words. What are the input, transformation and output?
  answer_vi: So sánh mô hình tinh chỉnh với mô hình cơ sở bằng cùng tập kiểm tra và cách sinh. Cần xem cả nhiệm
    vụ mục tiêu và khả năng suy giảm ở các tình huống liên quan.
  answer_en: A strong answer names the input, transformation, output and the context where fine-tuning evaluation
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-20-genai-finetuning-fine-tuning-3-application
  type: application
  question_vi: Lập bảng trước, sau tinh chỉnh và đọc những trường hợp chất lượng giảm.
  question_en: Write a small code example or design that applies fine-tuning evaluation to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Lập bảng trước, sau tinh chỉnh và đọc những trường hợp chất lượng giảm”, cần lưu: bảng
    dữ liệu hoặc kết quả trước, sau thay đổi với cấu hình rõ. So sánh trên tập giữ riêng và đọc các trường hợp chất
    lượng giảm.'
  answer_en: The fine-tuning evaluation example should have an explicit input, expected output and a way to run
    or verify it (phase-20-genai-finetuning-fine-tuning-3).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-20-genai-finetuning-fine-tuning-3-debug
  type: debug
  question_vi: Khi làm bài “Đánh giá sau tinh chỉnh”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If fine-tuning evaluation produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Đánh giá sau tinh chỉnh”, lỗi cần tránh là: kết luận tinh chỉnh tốt chỉ từ dữ liệu đã dùng
    để huấn luyện. So sánh trên tập giữ riêng và đọc các trường hợp chất lượng giảm. Dùng ví dụ nhỏ để tìm bước
    đầu tiên có kết quả khác dự kiến.'
  answer_en: For fine-tuning evaluation, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-20-genai-finetuning-fine-tuning-3).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-20-genai-finetuning-fine-tuning-3-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đánh giá sau tinh chỉnh” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of fine-tuning evaluation?
  answer_vi: Bắt đầu từ nhiệm vụ “Lập bảng trước, sau tinh chỉnh và đọc những trường hợp chất lượng giảm”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about fine-tuning evaluation should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-20-genai-finetuning-fine-tuning-3).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đánh giá sau tinh chỉnh / Fine-tuning evaluation

Fine-tuning thay đổi tham số mô hình; RAG đưa thêm bằng chứng vào lúc xử lý. Không dùng fine-tuning như cách thay thế mặc định cho tài liệu mới. Trước khi tinh chỉnh, cần baseline, dữ liệu có quyền sử dụng, giấy phép model, tiêu chí đánh giá và ngân sách tài nguyên.

Tách train, dev và test theo đơn vị có nguy cơ trùng, chẳng hạn cùng tài liệu hoặc người viết. Dùng dev để chọn cấu hình; giữ test riêng đến lúc so cuối. Nếu nhiều lần chọn theo điểm test, nó đã trở thành dữ liệu phục vụ lựa chọn. Ví dụ so các dự đoán tự tạo bằng exact match và phát hiện ID train/test trùng; không chạy huấn luyện hay khẳng định model đã tốt hơn.

Tự kiểm tra: điểm chung tăng có đủ chấp nhận model mới không? Không; kiểm tra lỗi theo nhóm, từ chối câu thiếu dữ liệu, chi phí và latency trong cùng workload. Exact match phù hợp đáp án ngắn chuẩn hóa; với câu mở cần rubric hỗ trợ nguồn hoặc người chấm. PEFT giảm phần tham số cần học nhưng không bảo đảm chất lượng.

## English

Fine-tuning changes model parameters; RAG adds evidence at inference time. Fine-tuning is not the default substitute for updated documents. Establish a baseline, permitted data use, model license, evaluation criteria and resource budget first.

Split train, dev and test by the unit likely to leak, such as source document or author. Use dev for configuration selection and reserve test for the final comparison. Repeatedly choosing by test scores turns test into selection data. This example compares synthetic predictions with exact match and detects overlapping train/test IDs; it performs no training and establishes no real model improvement.

Self-check: is a higher aggregate score sufficient to accept a candidate? No; inspect slice regressions, abstention, cost and latency under the same workload. Exact match suits short normalized answers; open responses need evidence-based rubrics or human review. PEFT reduces trainable parameters but does not guarantee quality.

## Thực hành / Practice

Đối chiếu baseline/candidate trên ba câu giữ riêng; đổi một nhãn để thấy điểm đổi. Thêm test ID vào train để phát hiện leakage.

Compare baseline/candidate on three held-out questions; change one label to observe the score change. Add a test ID to train to detect leakage.
