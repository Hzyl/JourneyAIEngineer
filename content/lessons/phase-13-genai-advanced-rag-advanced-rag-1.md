---
lesson_id: phase-13-genai-advanced-rag-advanced-rag-1
phase_id: phase-13-genai-advanced-rag
module_id: advanced-rag
title_vi: Tìm kiếm kết hợp BM25 và vector
title_en: 'Hybrid search: BM25 and vector search'
summary_vi: Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
summary_en: Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
learning_objectives:
- Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
- Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
learning_objectives_en:
- Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
- Run RRF and compare Recall@1 with Recall@2; remove d2 from both lists to observe a failure fusion cannot repair.
- A missing candidate cannot appear after fusion; empty relevance labels must be excluded from recall.
prerequisites:
- phase-12-genai-rag-rag-foundations-4
- phase-12-genai-rag-rag-foundations-1
key_terms:
- hybrid
- search
- bm25
- vector
- token
- embedding
- retrieval
- evaluation
- advanced-rag
concept_notes_vi: 'BM25 dùng thống kê từ khóa và độ dài tài liệu; vector retrieval dùng biểu diễn học được. Từ khóa
  hữu ích cho mã chính xác, còn embedding có thể tìm cách diễn đạt khác. Hai hệ thống có thang điểm khác nhau; cộng
  trực tiếp điểm có thể khiến một hệ thống lấn át hệ thống còn lại.


  Reciprocal rank fusion (RRF) cộng 1/(c + rank) cho mỗi tài liệu xuất hiện trong các danh sách, với rank bắt đầu
  từ 1. Ví dụ dùng danh sách lexical và dense giả lập đã xếp hạng để chỉ học phép hợp nhất; không triển khai BM25
  và không chạy embedding. Recall@k là số nguồn liên quan tìm được chia tổng nguồn liên quan; chỉ tính trên câu
  có nhãn nguồn không rỗng.


  Tự kiểm tra: RRF có tạo ra nguồn bị cả hai retriever bỏ sót không? Không. Giữ corpus, câu hỏi, quyền và k cố định
  khi so; xem riêng truy vấn mã hiếm, diễn đạt khác, thiếu đáp án và mơ hồ. Lab A cung cấp corpus có nhãn và tùy
  chọn embedding thật trong Colab.'
concept_notes_en: 'BM25 uses term statistics and document length; vector retrieval uses learned representations.
  Keywords help with exact identifiers, while embeddings may find paraphrases. The two systems have different score
  scales, so adding raw scores can let one dominate.


  Reciprocal rank fusion (RRF) sums 1/(c + rank) for each document in the ranked lists, with ranks starting at 1.
  The example uses pre-ranked lexical and simulated dense lists to teach fusion; it implements neither BM25 nor
  embedding inference. Recall@k divides retrieved relevant sources by all relevant sources and requires nonempty
  relevance labels.


  Self-check: can RRF recover a source absent from both retrievers? No. Hold the corpus, questions, permissions
  and k fixed; inspect rare identifiers, paraphrases, unanswerable and ambiguous questions separately. Lab A supplies
  labeled data and optional real embeddings in Colab.'
why_it_matters_vi: Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
why_it_matters_en: Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Run RRF and compare Recall@1 with Recall@2; remove d2 from both lists to observe a failure fusion cannot repair.
- A missing candidate cannot appear after fusion; empty relevance labels must be excluded from recall.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.
    deliverables:
    - Bảng thứ hạng lexical, dense giả lập, fusion và Recall@k
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi
      Recall.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Run RRF and compare Recall@1 with Recall@2; remove d2 from both lists to observe a failure fusion cannot
      repair.
    deliverables:
    - A table of lexical, simulated dense and fused rankings with Recall@k
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: A missing candidate cannot appear after fusion; empty relevance labels must be excluded from recall.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Tìm kiếm kết hợp BM25 và vector” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - 'How would you explain hybrid search: bm25 and vector search to a new teammate?'
  - 'Which assumption behind hybrid search: bm25 and vector search could fail in production?'
  - Which metric or test would prove the result is trustworthy?
formulas:
- RRF(d) = sum(1 / (c + rank_i(d)))
- Recall@k = relevant sources in top-k / all relevant sources
code_examples:
- language: python
  title: Fuse lexical and simulated dense ranks
  code: "import json\ndef rrf(rankings, c=60):\n    if c < 0:\n        raise ValueError(\"c must be nonnegative\"\
    )\n    scores = {}\n    for ranking in rankings:\n        for rank, doc in enumerate(dict.fromkeys(ranking),\
    \ 1):\n            scores[doc] = scores.get(doc, 0) + 1 / (c + rank)\n    return sorted(scores, key=lambda doc:\
    \ (-scores[doc], doc))\ndef recall(ranking, relevant, k):\n    if not relevant:\n        raise ValueError(\"\
    answerable labels required\")\n    return len(set(ranking[:k]) & relevant) / len(relevant)\nlexical = [\"d1\"\
    , \"d2\", \"d3\"]\nsimulated_dense = [\"d2\", \"d3\", \"d1\"]\nfused = rrf([lexical, simulated_dense])\nprint(json.dumps({\"\
    ranking\": fused, \"recall_at_1\": recall(fused, {\"d2\", \"d3\"}, 1),\n                  \"recall_at_2\": recall(fused,\
    \ {\"d2\", \"d3\"}, 2),\n                  \"empty_fusion\": rrf([])}))\n"
  status: runnable
  purpose_vi: Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
  purpose_en: Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"ranking": ["d2", "d1", "d3"], "recall_at_1": 0.5, "recall_at_2": 0.5, "empty_fusion": []}'
  edge_case_vi: Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi
    Recall.
  edge_case_en: A missing candidate cannot appear after fusion; empty relevance labels must be excluded from recall.
  explanation_vi: Đây là phép hợp nhất danh sách minh họa, không phải kết quả so BM25 với model embedding thật.
  explanation_en: This is ranked-list fusion on a fixture, not a measured comparison between BM25 and a real embedding
    model.
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
- title: NumPy Quickstart
  url: https://numpy.org/doc/stable/user/quickstart.html
  language: en
  purpose_vi: Thực hành tạo mảng, kiểm tra kích thước và tính toán vector bằng NumPy.
  read_vi: Đọc về kích thước mảng, truy cập theo chỉ số và broadcasting; in kích thước sau mỗi bước.
  purpose_en: Practice arrays, shapes, and vector operations with NumPy.
  read_en: Read array shapes, indexing, and broadcasting; print every shape.
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
exercise_ids:
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-1-recall
- phase-13-genai-advanced-rag-advanced-rag-1-application
- phase-13-genai-advanced-rag-advanced-rag-1-debug
- phase-13-genai-advanced-rag-advanced-rag-1-interview
estimated_minutes: 60
completion_checklist:
- Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng thứ hạng lexical, dense giả lập, fusion và Recall@k
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Gộp điểm BM25 với điểm vector mà chưa xét thang đo.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-2
- phase-13-genai-advanced-rag-advanced-rag-3
review_question_vi: Nội dung cốt lõi của “Tìm kiếm kết hợp BM25 và vector” là gì?
review_question_en: 'Define hybrid search: bm25 and vector search in your own words. What are the input, transformation
  and output?'
review_answer_vi: BM25 phù hợp với tín hiệu từ khóa; tìm kiếm vector bổ sung quan hệ ngữ nghĩa. Cách kết hợp cần
  được đánh giá vì điểm số hai hệ thống không nhất thiết cùng thang đo.
review_answer_en: 'A strong answer names the input, transformation, output and the context where hybrid search:
  bm25 and vector search is used. Relate it specifically to hybrid search: bm25 and vector search in lesson phase-13-genai-advanced-rag-advanced-rag-1.'
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Tìm kiếm kết hợp BM25 và vector” là gì?
  question_en: 'Define hybrid search: bm25 and vector search in your own words. What are the input, transformation
    and output?'
  answer_vi: BM25 phù hợp với tín hiệu từ khóa; tìm kiếm vector bổ sung quan hệ ngữ nghĩa. Cách kết hợp cần được
    đánh giá vì điểm số hai hệ thống không nhất thiết cùng thang đo.
  answer_en: 'A strong answer names the input, transformation, output and the context where hybrid search: bm25
    and vector search is used.'
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-13-genai-advanced-rag-advanced-rag-1-application
  type: application
  question_vi: So sánh truy xuất từ khóa, vector và kết hợp trên cùng bộ câu hỏi.
  question_en: 'Write a small code example or design that applies hybrid search: bm25 and vector search to an AI
    engineering problem.'
  answer_vi: 'Với nhiệm vụ “So sánh truy xuất từ khóa, vector và kết hợp trên cùng bộ câu hỏi”, cần lưu: bảng so
    sánh truy xuất trên cùng bộ câu hỏi có nguồn chuẩn. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích
    dẫn.'
  answer_en: 'The hybrid search: bm25 and vector search example should have an explicit input, expected output and
    a way to run or verify it (phase-13-genai-advanced-rag-advanced-rag-1).'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-13-genai-advanced-rag-advanced-rag-1-debug
  type: debug
  question_vi: Khi làm bài “Tìm kiếm kết hợp BM25 và vector”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: 'If hybrid search: bm25 and vector search produces a wrong result or a metric drops, what would you
    debug first?'
  answer_vi: 'Trong bài “Tìm kiếm kết hợp BM25 và vector”, lỗi cần tránh là: gộp điểm BM25 với điểm vector mà chưa
    xét thang đo. Đọc riêng các trường hợp bỏ sót, sai thứ hạng và sai trích dẫn. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: 'For hybrid search: bm25 and vector search, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-13-genai-advanced-rag-advanced-rag-1).'
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-13-genai-advanced-rag-advanced-rag-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Tìm kiếm kết hợp BM25 và vector” để giải thích cách làm và giới hạn?
  question_en: 'In an interview, how would you explain a trade-off and one edge case of hybrid search: bm25 and
    vector search?'
  answer_vi: Bắt đầu từ nhiệm vụ “So sánh truy xuất từ khóa, vector và kết hợp trên cùng bộ câu hỏi”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: 'The answer about hybrid search: bm25 and vector search should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-13-genai-advanced-rag-advanced-rag-1).'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Tìm kiếm kết hợp BM25 và vector / Hybrid search: BM25 and vector search

BM25 dùng thống kê từ khóa và độ dài tài liệu; vector retrieval dùng biểu diễn học được. Từ khóa hữu ích cho mã chính xác, còn embedding có thể tìm cách diễn đạt khác. Hai hệ thống có thang điểm khác nhau; cộng trực tiếp điểm có thể khiến một hệ thống lấn át hệ thống còn lại.

Reciprocal rank fusion (RRF) cộng 1/(c + rank) cho mỗi tài liệu xuất hiện trong các danh sách, với rank bắt đầu từ 1. Ví dụ dùng danh sách lexical và dense giả lập đã xếp hạng để chỉ học phép hợp nhất; không triển khai BM25 và không chạy embedding. Recall@k là số nguồn liên quan tìm được chia tổng nguồn liên quan; chỉ tính trên câu có nhãn nguồn không rỗng.

Tự kiểm tra: RRF có tạo ra nguồn bị cả hai retriever bỏ sót không? Không. Giữ corpus, câu hỏi, quyền và k cố định khi so; xem riêng truy vấn mã hiếm, diễn đạt khác, thiếu đáp án và mơ hồ. Lab A cung cấp corpus có nhãn và tùy chọn embedding thật trong Colab.

## English

BM25 uses term statistics and document length; vector retrieval uses learned representations. Keywords help with exact identifiers, while embeddings may find paraphrases. The two systems have different score scales, so adding raw scores can let one dominate.

Reciprocal rank fusion (RRF) sums 1/(c + rank) for each document in the ranked lists, with ranks starting at 1. The example uses pre-ranked lexical and simulated dense lists to teach fusion; it implements neither BM25 nor embedding inference. Recall@k divides retrieved relevant sources by all relevant sources and requires nonempty relevance labels.

Self-check: can RRF recover a source absent from both retrievers? No. Hold the corpus, questions, permissions and k fixed; inspect rare identifiers, paraphrases, unanswerable and ambiguous questions separately. Lab A supplies labeled data and optional real embeddings in Colab.

## Thực hành / Practice

Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.

Run RRF and compare Recall@1 with Recall@2; remove d2 from both lists to observe a failure fusion cannot repair.
