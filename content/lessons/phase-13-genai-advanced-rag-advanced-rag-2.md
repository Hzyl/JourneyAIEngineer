---
lesson_id: phase-13-genai-advanced-rag-advanced-rag-2
phase_id: phase-13-genai-advanced-rag
module_id: advanced-rag
title_vi: Xếp hạng lại và chọn top-k
title_en: Reranking and top-k selection
summary_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
summary_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and after
  reranking.
learning_objectives:
- Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
- Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả số
  ứng viên và k cùng báo cáo.
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
learning_objectives_en:
- Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and after reranking.
- Change the reranking rule and compare both cases; the missing-source case must still fail. In Lab A, save candidate
  count and k with the report.
- 'Remove d2 from the candidates: reciprocal rank remains zero regardless of reranking scores.'
prerequisites:
- phase-13-genai-advanced-rag-advanced-rag-1
- phase-12-genai-rag-rag-foundations-1
key_terms:
- reranking
- top
- selection
- token
- embedding
- retrieval
- evaluation
- advanced-rag
concept_notes_vi: 'Retriever lấy tập ứng viên trước; reranker chấm lại từng cặp truy vấn–đoạn rồi đổi thứ tự trong
  tập đó. Bi-encoder tính vector riêng cho truy vấn và đoạn; cross-encoder xử lý cặp cùng nhau. Reranker không thể
  khôi phục đoạn mà retriever chưa lấy được.


  Ví dụ dùng quy tắc chấm tự tạo để học cách đo, không chạy cross-encoder. MRR lấy trung bình nghịch đảo thứ hạng
  của nguồn đúng đầu tiên, quy ước 0 nếu không có. Recall@k đo độ bao phủ nguồn đúng trong k kết quả đầu. Tăng k
  có thể tăng recall nhưng đưa thêm nhiễu và tăng context/độ trễ; phải ghi cả số ứng viên, k và điều kiện chạy.


  Tự kiểm tra: MRR tăng có đủ kết luận câu trả lời tốt hơn không? Không; cần đánh giá riêng generation và trích
  dẫn. Trong Colab, giữ tập câu hỏi cố định, đo từng trường hợp và thời gian thực; điểm của dữ liệu mô phỏng dưới
  đây không dự đoán chất lượng tiếng Việt.'
concept_notes_en: 'A retriever first selects candidates; a reranker scores each query–passage pair and reorders
  that set. A bi-encoder represents queries and passages independently, while a cross-encoder processes the pair
  jointly. A reranker cannot recover a passage the retriever never selected.


  This example uses a synthetic scoring rule, not a cross-encoder. MRR averages the reciprocal rank of the first
  relevant source, using zero when none is found. Recall@k measures relevant-source coverage within the first k
  results. Larger k may improve recall but add noise, context and latency; record candidate count, k and execution
  conditions.


  Self-check: does higher MRR establish better answers? No; generation and citations need separate evaluation. In
  Colab, hold questions fixed and measure per-case outcomes and real elapsed time; the fixture scores below do not
  predict Vietnamese model quality.'
why_it_matters_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
why_it_matters_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and
  after reranking.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả số
  ứng viên và k cùng báo cáo.
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Change the reranking rule and compare both cases; the missing-source case must still fail. In Lab A, save candidate
  count and k with the report.
- 'Remove d2 from the candidates: reciprocal rank remains zero regardless of reranking scores.'
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu
      cả số ứng viên và k cùng báo cáo.
    deliverables:
    - Báo cáo trước/sau gồm MRR, Recall@k và trường hợp không có nguồn trong ứng viên
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Change the reranking rule and compare both cases; the missing-source case must still fail. In Lab A, save
      candidate count and k with the report.
    deliverables:
    - A before/after report with MRR, Recall@k and a missing-candidate case
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: 'Remove d2 from the candidates: reciprocal rank remains zero regardless of reranking scores.'
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Xếp hạng lại và chọn top-k” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain reranking and top-k selection to a new teammate?
  - Which assumption behind reranking and top-k selection could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- MRR = mean(1 / rank of first relevant result); missing result contributes 0
- Recall@k = relevant sources in top-k / all relevant sources
code_examples:
- language: python
  title: Evaluate a deterministic reranker on fixed candidates
  code: "import json\ndef reciprocal_rank(ranking, relevant):\n    return next((1 / rank for rank, doc in enumerate(ranking,\
    \ 1)\n                 if doc in relevant), 0.0)\ndef recall_at_k(ranking, relevant, k):\n    return len(set(ranking[:k])\
    \ & relevant) / len(relevant)\ncases = [([\"d1\", \"d2\"], {\"d2\"}), ([\"d1\", \"d3\"], {\"d2\"})]\nmock_scores\
    \ = {\"d1\": 0.2, \"d2\": 0.9, \"d3\": 0.1}\nafter = [(sorted(r, key=lambda d: -mock_scores[d]), gold) for r,\
    \ gold in cases]\ndef evaluate(rows):\n    return {\"mrr\": sum(reciprocal_rank(r, g) for r, g in rows) / len(rows),\n\
    \            \"recall_at_1\": sum(recall_at_k(r, g, 1) for r, g in rows) / len(rows)}\nprint(json.dumps({\"\
    before\": evaluate(cases), \"after\": evaluate(after),\n                  \"missing_candidate_rr\": reciprocal_rank(after[1][0],\
    \ {\"d2\"})}))\n"
  status: runnable
  purpose_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
  purpose_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and after
    reranking.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"before": {"mrr": 0.25, "recall_at_1": 0.0}, "after": {"mrr": 0.5, "recall_at_1": 0.5}, "missing_candidate_rr":
    0.0}'
  edge_case_vi: 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
  edge_case_en: 'Remove d2 from the candidates: reciprocal rank remains zero regardless of reranking scores.'
  explanation_vi: Cải thiện chỉ đúng với nhãn và quy tắc giả lập đang chạy; không phải benchmark một model.
  explanation_en: The improvement applies only to these executed fixtures and rules; it is not a model benchmark.
resources:
- language: en
  title: Elasticsearch Reference
  url: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Ragas Documentation
  url: https://docs.ragas.io/en/stable/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Qdrant Hybrid Search
  url: https://qdrant.tech/documentation/concepts/hybrid-queries/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: FAISS Documentation
  url: https://faiss.ai/
  language: en
  purpose_vi: Thử lập chỉ mục và truy xuất top-k trước khi thêm bước sinh câu trả lời.
  read_vi: Đọc về chỉ mục, thước đo khoảng cách và cách kiểm tra hit@k.
  purpose_en: Try indexing and top-k retrieval before adding generation.
  read_en: Read indexes, distance metrics, and hit@k evaluation.
  kind: official
  required: false
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
- title: Sentence Transformers — Retrieve & Re-Rank
  url: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
  purpose_vi: Phân biệt bi-encoder lấy ứng viên và cross-encoder xếp hạng lại.
  purpose_en: Distinguish bi-encoder candidate retrieval from cross-encoder reranking.
  read_vi: 'Đọc Retrieve & Re-Rank Pipeline và Re-Ranker: Cross-Encoder; đối chiếu giới hạn tập ứng viên.'
  read_en: 'Read Retrieve & Re-Rank Pipeline and Re-Ranker: Cross-Encoder; inspect candidate-set limitations.'
  language: en
  kind: official
  required: false
exercise_ids:
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-2-recall
- phase-13-genai-advanced-rag-advanced-rag-2-application
- phase-13-genai-advanced-rag-advanced-rag-2-debug
- phase-13-genai-advanced-rag-advanced-rag-2-interview
estimated_minutes: 60
completion_checklist:
- Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả số
  ứng viên và k cùng báo cáo.
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Báo cáo trước/sau gồm MRR, Recall@k và trường hợp không có nguồn trong ứng viên
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Gộp điểm BM25 với điểm vector mà chưa xét thang đo.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-3
- phase-13-genai-advanced-rag-advanced-rag-4
review_question_vi: Nội dung cốt lõi của “Xếp hạng lại và chọn top-k” là gì?
review_question_en: Define reranking and top-k selection in your own words. What are the input, transformation and
  output?
review_answer_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ,
  nhiễu trong ngữ cảnh và chi phí xử lý.
review_answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k
  selection is used. Relate it specifically to reranking and top-k selection in lesson phase-13-genai-advanced-rag-advanced-rag-2.
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Xếp hạng lại và chọn top-k” là gì?
  question_en: Define reranking and top-k selection in your own words. What are the input, transformation and output?
  answer_vi: Xếp hạng lại sắp lại tập ứng viên theo mức liên quan. Chọn số kết quả cần cân bằng độ bao phủ, nhiễu
    trong ngữ cảnh và chi phí xử lý.
  answer_en: A strong answer names the input, transformation, output and the context where reranking and top-k selection
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-13-genai-advanced-rag-advanced-rag-2-application
  type: application
  question_vi: Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ.
  question_en: Write a small code example or design that applies reranking and top-k selection to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ”, cần lưu: bảng so sánh
    truy xuất trên cùng bộ câu hỏi có nguồn chuẩn. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn.'
  answer_en: The reranking and top-k selection example should have an explicit input, expected output and a way
    to run or verify it (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-13-genai-advanced-rag-advanced-rag-2-debug
  type: debug
  question_vi: Khi làm bài “Xếp hạng lại và chọn top-k”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If reranking and top-k selection produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Xếp hạng lại và chọn top-k”, lỗi cần tránh là: gộp điểm BM25 với điểm vector mà chưa xét
    thang đo. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn. Dùng ví dụ nhỏ để tìm bước đầu tiên
    có kết quả khác dự kiến.'
  answer_en: For reranking and top-k selection, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-13-genai-advanced-rag-advanced-rag-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Xếp hạng lại và chọn top-k” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of reranking and top-k selection?
  answer_vi: Bắt đầu từ nhiệm vụ “Thử hai giá trị k và đọc các bằng chứng được thêm hoặc bị bỏ”. Trình bày kết quả
    đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about reranking and top-k selection should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-13-genai-advanced-rag-advanced-rag-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Xếp hạng lại và chọn top-k / Reranking and top-k selection

Retriever lấy tập ứng viên trước; reranker chấm lại từng cặp truy vấn–đoạn rồi đổi thứ tự trong tập đó. Bi-encoder tính vector riêng cho truy vấn và đoạn; cross-encoder xử lý cặp cùng nhau. Reranker không thể khôi phục đoạn mà retriever chưa lấy được.

Ví dụ dùng quy tắc chấm tự tạo để học cách đo, không chạy cross-encoder. MRR lấy trung bình nghịch đảo thứ hạng của nguồn đúng đầu tiên, quy ước 0 nếu không có. Recall@k đo độ bao phủ nguồn đúng trong k kết quả đầu. Tăng k có thể tăng recall nhưng đưa thêm nhiễu và tăng context/độ trễ; phải ghi cả số ứng viên, k và điều kiện chạy.

Tự kiểm tra: MRR tăng có đủ kết luận câu trả lời tốt hơn không? Không; cần đánh giá riêng generation và trích dẫn. Trong Colab, giữ tập câu hỏi cố định, đo từng trường hợp và thời gian thực; điểm của dữ liệu mô phỏng dưới đây không dự đoán chất lượng tiếng Việt.

## English

A retriever first selects candidates; a reranker scores each query–passage pair and reorders that set. A bi-encoder represents queries and passages independently, while a cross-encoder processes the pair jointly. A reranker cannot recover a passage the retriever never selected.

This example uses a synthetic scoring rule, not a cross-encoder. MRR averages the reciprocal rank of the first relevant source, using zero when none is found. Recall@k measures relevant-source coverage within the first k results. Larger k may improve recall but add noise, context and latency; record candidate count, k and execution conditions.

Self-check: does higher MRR establish better answers? No; generation and citations need separate evaluation. In Colab, hold questions fixed and measure per-case outcomes and real elapsed time; the fixture scores below do not predict Vietnamese model quality.

## Thực hành / Practice

Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả số ứng viên và k cùng báo cáo.

Change the reranking rule and compare both cases; the missing-source case must still fail. In Lab A, save candidate count and k with the report.
