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
- So sánh baseline và hybrid trên cùng corpus, metadata, tập câu hỏi và ngân sách.
learning_objectives_en:
- Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
- Run RRF and compare Recall@1 with Recall@2; remove d2 from both lists to observe a failure fusion cannot
  repair.
- A missing candidate cannot appear after fusion; empty relevance labels must be excluded from recall.
- Compare lexical and hybrid retrieval with fixed corpus, permissions, questions and budget.
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
concept_notes_vi: |-
  BM25 dùng thống kê từ khóa và độ dài tài liệu; vector retrieval dùng biểu diễn học được. Từ khóa hữu ích cho mã chính xác, còn embedding có thể tìm cách diễn đạt khác. Hai hệ thống có thang điểm khác nhau; cộng trực tiếp điểm có thể khiến một hệ thống lấn át hệ thống còn lại.

  Reciprocal rank fusion (RRF) cộng 1/(c + rank) cho mỗi tài liệu xuất hiện trong các danh sách, với rank bắt đầu từ 1. Ví dụ dùng danh sách lexical và dense giả lập đã xếp hạng để chỉ học phép hợp nhất; không triển khai BM25 và không chạy embedding. Recall@k là số nguồn liên quan tìm được chia tổng nguồn liên quan; chỉ tính trên câu có nhãn nguồn không rỗng.

  Tự kiểm tra: RRF có tạo ra nguồn bị cả hai retriever bỏ sót không? Không. Giữ corpus, câu hỏi, quyền và k cố định khi so; xem riêng truy vấn mã hiếm, diễn đạt khác, thiếu đáp án và mơ hồ. Lab A cung cấp corpus có nhãn và tùy chọn embedding thật trong Colab.

  Chuẩn bị: học nhập tài liệu và chunking ở phase 12, hiểu token, cosine và tập dev/test. Bắt đầu với tìm từ khóa để có baseline rẻ, dễ giải thích. Lab giữ nguyên 12 tài liệu giả, 30 câu hỏi và ID đoạn theo dòng; chunk có document_id, version, line, text, allowed_users. Lọc quyền và metadata trước khi tính thống kê BM25, embedding hoặc điểm, không chỉ lọc đáp án cuối.

  Pipeline thực hành: lexical → BM25 → vector ký tự → hợp nhất BM25/vector bằng RRF → rerank. BM25 có độ bão hòa tần suất từ và chuẩn hóa độ dài; vector mặc định là cosine của trigram ký tự, không phải embedding ngữ nghĩa. Nếu chạy ô model có sẵn trong Colab, truyền backend đó vào run để thử embedding thật mà không cài lên máy cá nhân.

  Giữ top-k=3, candidate pool=6, corpus và câu hỏi cố định. RRF trong lab dùng hạng bắt đầu từ 1 và hằng số 60; không cộng trực tiếp điểm BM25 với cosine. Qdrant có quy ước/default khác, nên ghi cấu hình thay vì khẳng định mọi triển khai dùng cùng công thức số.

  Kết quả đo offline: cả 5 cách đều Recall@3=1 và không lỗi trên 14 câu dev cũ. Điều này không chứng minh hybrid tốt hơn. Năm probe dev bổ sung được báo riêng, không chèn vào test: paraphrase về giờ thư viện và hỏi phí phạt không có trong tài liệu vẫn thất bại. So sánh cả latency và quyết định trả lời/từ chối; nếu không tăng chất lượng, giữ baseline đơn giản.

  Mốc chunking: trước khi đổi kích thước đoạn, chạy lại bài phase-12-genai-rag-rag-2 và giữ nguyên offset/trích dẫn. Split theo nguồn trước khi tạo câu hỏi; khi đổi chunk, ánh xạ gold bằng vị trí nguồn thay vì sửa nhãn theo kết quả retriever. Chunking không có một tỷ lệ đóng góp chất lượng cố định. TikTok T17/T24 là gợi ý M/H; số đo ở đây đến từ fixture của repo.
concept_notes_en: |-
  BM25 uses term statistics and document length; vector retrieval uses learned representations. Keywords help with exact identifiers, while embeddings may find paraphrases. The two systems have different score scales, so adding raw scores can let one dominate.

  Reciprocal rank fusion (RRF) sums 1/(c + rank) for each document in the ranked lists, with ranks starting at 1. The example uses pre-ranked lexical and simulated dense lists to teach fusion; it implements neither BM25 nor embedding inference. Recall@k divides retrieved relevant sources by all relevant sources and requires nonempty relevance labels.

  Self-check: can RRF recover a source absent from both retrievers? No. Hold the corpus, questions, permissions and k fixed; inspect rare identifiers, paraphrases, unanswerable and ambiguous questions separately. Lab A supplies labeled data and optional real embeddings in Colab.

  Prerequisites: phase 12 ingestion/chunking, token overlap, cosine and dev/test. Start with an inexpensive lexical baseline. The lab preserves 12 synthetic documents, 30 questions and line-based chunk IDs; metadata includes document_id, version, line, text and allowed_users. Apply authorization and metadata filters before corpus statistics, encoding or scoring.

  Compare lexical, BM25, character vectors, BM25/vector RRF and reranking. BM25 saturates term frequency and normalizes document length. Default vectors are character-trigram cosine, not semantic embeddings. The existing optional Colab model can be passed into run as the backend without installing it on the learner’s PC.

  Keep top-k=3, candidate pool=6, corpus and questions fixed. This lab uses 1-based ranks and RRF constant 60. Never add raw BM25 and cosine scores directly. Qdrant has different defaults/conventions, so record them rather than assuming identical numerical formulas.

  Offline measurements give all five methods Recall@3=1 and no failures on the original 14 dev cases. This does not show a hybrid gain. Five separate dev stress cases expose paraphrase and unsupported-detail failures; test stays unchanged. Compare latency and answer/abstention decisions. Retain the simple baseline when added complexity produces no measured benefit.

  For chunking experiments, revisit phase-12-genai-rag-rag-2 and preserve source offsets/citations. Split by source before authoring questions; remap gold evidence by source location when rechunking, never by retriever output. No fixed quality percentage is attributed to chunking. TikTok T17/T24 are M/H topic leads; numerical evidence comes from repository fixtures.
why_it_matters_vi: Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
why_it_matters_en: Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
study_steps_vi:
- Chạy baseline Lab A và lưu hash corpus/test.
- Đọc ranking.py rồi chạy ablation dev.
- Mở failures của 5 probe riêng và lần về nguồn.
- Chọn cấu hình theo dev và chi phí; chỉ sau đó mở test.
study_steps_en:
- Run Lab A baseline and save corpus/test hashes.
- Read ranking.py and run dev ablations.
- Inspect the five separate stress cases and original sources.
- Freeze the dev-based choice before opening test.
practice_plan:
  vi:
    task: Chạy 5 cách retrieval; lập bảng Recall@3, MRR@3, p95 và ca sai. Thử thay candidate pool trong bản
      sao, giữ test nguyên vẹn.
    deliverables:
    - Báo cáo JSON có hash dữ liệu, cấu hình và từng ca
    - Bảng so sánh và lý do chọn cách đơn giản nhất đạt yêu cầu
    - Một lỗi do retrieval và một lỗi do quyết định trả lời
    checkpoint: Không rò chunk bị cấm; có thể truy từ citation về đúng document/version/line. Không gọi vector
      ký tự là model embedding.
    stretch: Trong Colab, thay duy nhất vector backend bằng model đã ghim revision và đo lại; không mặc định
      neural model phải thắng.
  en:
    task: Compare Recall@3, MRR@3, p95 and failures for five methods. Change candidate count in a copy without
      editing test.
    deliverables:
    - JSON report with hashes, configuration and per-case results
    - Comparison table and simplest adequate configuration
    - One retrieval failure and one answer-policy failure
    checkpoint: No forbidden chunk is exposed; citations resolve to document/version/line. Character vectors
      are not described as neural embeddings.
    stretch: Replace only the vector backend in hosted Colab with the pinned model and remeasure; neural retrieval
      need not win.
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
  code: |
    import json
    def rrf(rankings, c=60):
        if c < 0:
            raise ValueError("c must be nonnegative")
        scores = {}
        for ranking in rankings:
            for rank, doc in enumerate(dict.fromkeys(ranking), 1):
                scores[doc] = scores.get(doc, 0) + 1 / (c + rank)
        return sorted(scores, key=lambda doc: (-scores[doc], doc))
    def recall(ranking, relevant, k):
        if not relevant:
            raise ValueError("answerable labels required")
        return len(set(ranking[:k]) & relevant) / len(relevant)
    lexical = ["d1", "d2", "d3"]
    simulated_dense = ["d2", "d3", "d1"]
    fused = rrf([lexical, simulated_dense])
    print(json.dumps({"ranking": fused, "recall_at_1": recall(fused, {"d2", "d3"}, 1),
                      "recall_at_2": recall(fused, {"d2", "d3"}, 2),
                      "empty_fusion": rrf([])}))
  status: runnable
  purpose_vi: Kết hợp thứ hạng bằng reciprocal rank fusion và đo Recall@k trên nhãn nguồn.
  purpose_en: Combine rankings with reciprocal rank fusion and measure Recall@k against source labels.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"ranking": ["d2", "d1", "d3"], "recall_at_1": 0.5, "recall_at_2": 0.5, "empty_fusion":
    []}'
  edge_case_vi: Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách
    khỏi Recall.
  edge_case_en: A missing candidate cannot appear after fusion; empty relevance labels must be excluded from
    recall.
  explanation_vi: Đây là phép hợp nhất danh sách minh họa, không phải kết quả so BM25 với model embedding thật.
  explanation_en: This is ranked-list fusion on a fixture, not a measured comparison between BM25 and a real
    embedding model.
  setup_en: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
- title: Run the shared retrieval ablation
  code: |
    from research_lab.experiments import run

    report = run("dev")
    for name, score in report["methods"].items():
        print(name, score["count"], score["retrieval"]["recall_at_k"], len(score["failures"]))
    probe = report["dev_probes"]["lexical"]
    print("stress", probe["count"], probe["decision_accuracy"])
    print("failed", sorted(row["id"] for row in probe["failures"]))
  language: python
  status: runnable
  purpose_vi: Chạy thuật toán trên nội dung thật của fixture; các ca probe thất bại là đầu ra cần phân tích.
  purpose_en: Run algorithms over fixture text; stress-case failures are evidence to analyze.
  setup: Open the existing Lab A Colab, run setup and baseline, then paste this cell. Alternatively download
    repository ZIP, cd samples/vi-document-assistant and use Python 3.11+. No package/model download for this
    example.
  expected_output: |-
    lexical 14 1.0 0
    bm25 14 1.0 0
    vector 14 1.0 0
    hybrid 14 1.0 0
    hybrid_phrase_rerank 14 1.0 0
    stress 5 0.6
    failed ['probe-paraphrase', 'probe-unsupported-detail']
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Chạy thuật toán trên nội dung thật của fixture; các ca probe thất bại là đầu ra cần phân
    tích.
  explanation_en: Run algorithms over fixture text; stress-case failures are evidence to analyze.
  setup_en: Open the existing Lab A Colab, run setup and baseline, then paste this cell. Alternatively download
    repository ZIP, cd samples/vi-document-assistant and use Python 3.11+. No package/model download for this
    example.
  setup_vi: Mở Lab A Colab, chạy ô thiết lập và baseline rồi dán mã này vào ô mới. Hoặc tải ZIP repo, mở samples/vi-document-assistant
    và dùng Python 3.11+. Ví dụ offline không tải model hay cài package.
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
  read_en: 'Run in Colab on a Google-hosted CPU runtime: baseline first, then optional embeddings. Use dev
    before evaluating test and download the report.'
- title: Qdrant hybrid queries
  url: https://qdrant.tech/documentation/search/hybrid-queries/
  language: en
  kind: official
  required: false
  purpose_vi: Đọc cách hợp nhất thứ hạng. Ghi riêng quy ước hạng và hằng số của từng thư viện.
  purpose_en: Read rank fusion and record each implementation’s rank origin and constant.
  read_vi: Đọc cách hợp nhất thứ hạng. Ghi riêng quy ước hạng và hằng số của từng thư viện.
  read_en: Read rank fusion and record each implementation’s rank origin and constant.
- title: 'Sentence Transformers: retrieve and rerank'
  url: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  purpose_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
  read_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  read_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
- title: 'Stanford IR: Okapi BM25'
  url: https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html
  language: en
  kind: official
  required: false
  purpose_vi: Đọc term frequency, chuẩn hóa độ dài và sự khác nhau giữa biến thể IDF.
  purpose_en: Read term frequency saturation, length normalization and IDF variants.
  read_vi: Đọc term frequency, chuẩn hóa độ dài và sự khác nhau giữa biến thể IDF.
  read_en: Read term frequency saturation, length normalization and IDF variants.
exercise_ids:
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-1-recall
- phase-13-genai-advanced-rag-advanced-rag-1-application
- phase-13-genai-advanced-rag-advanced-rag-1-debug
- phase-13-genai-advanced-rag-advanced-rag-1-interview
estimated_minutes: 80
completion_checklist:
- Chạy RRF rồi so Recall@1 và Recall@2; bỏ d2 khỏi cả hai danh sách để quan sát lỗi không thể sửa bằng fusion.
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Bảng thứ hạng lexical, dense giả lập, fusion và Recall@k
- Nguồn không có trong tập ứng viên không được xuất hiện sau fusion; nhãn rỗng phải được tách khỏi Recall.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
- Báo cáo JSON có hash dữ liệu, cấu hình và từng ca
- Bảng so sánh và lý do chọn cách đơn giản nhất đạt yêu cầu
- Một lỗi do retrieval và một lỗi do quyết định trả lời
- Không rò chunk bị cấm; có thể truy từ citation về đúng document/version/line. Không gọi vector ký tự là model
  embedding.
common_mistakes:
- Gộp điểm BM25 với điểm vector mà chưa xét thang đo.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Chọn thuật toán theo test.
- Trộn raw score khác thang đo.
- Quy mọi lỗi trả lời cho retrieval hoặc dùng số quảng cáo làm benchmark.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-2
- phase-13-genai-advanced-rag-advanced-rag-3
review_question_vi: Tìm kiếm kết hợp BM25 và vector bổ sung tín hiệu gì cho nhau, và RRF hợp nhất hai danh
  sách như thế nào?
review_question_en: How do BM25 and vector search complement each other, and how does RRF combine their ranked
  lists?
review_answer_vi: BM25 dùng thống kê từ khóa và độ dài tài liệu, hữu ích cho mã chính xác; vector search dùng
  biểu diễn học được để tìm các cách diễn đạt liên quan. RRF cộng 1/(c + rank) cho mỗi tài liệu xuất hiện trong
  các danh sách; trong bài, rank bắt đầu từ 1 và c=60. RRF dùng thứ hạng thay vì cộng trực tiếp điểm thô khác
  thang đo.
review_answer_en: BM25 uses term statistics and document length, which helps with exact identifiers; vector
  search uses learned representations to find related phrasing. RRF sums 1/(c + rank) for each document appearing
  in the lists; this lesson uses ranks starting at 1 and c=60. RRF uses ranks instead of directly adding raw
  scores on different scales.
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-1-recall
  type: recall
  question_vi: Tìm kiếm kết hợp BM25 và vector bổ sung tín hiệu gì cho nhau, và RRF hợp nhất hai danh sách
    như thế nào?
  question_en: How do BM25 and vector search complement each other, and how does RRF combine their ranked lists?
  answer_vi: BM25 dùng thống kê từ khóa và độ dài tài liệu, hữu ích cho mã chính xác; vector search dùng biểu
    diễn học được để tìm các cách diễn đạt liên quan. RRF cộng 1/(c + rank) cho mỗi tài liệu xuất hiện trong
    các danh sách; trong bài, rank bắt đầu từ 1 và c=60. RRF dùng thứ hạng thay vì cộng trực tiếp điểm thô
    khác thang đo.
  answer_en: BM25 uses term statistics and document length, which helps with exact identifiers; vector search
    uses learned representations to find related phrasing. RRF sums 1/(c + rank) for each document appearing
    in the lists; this lesson uses ranks starting at 1 and c=60. RRF uses ranks instead of directly adding
    raw scores on different scales.
  hint_vi: Phân biệt tín hiệu từ khóa, biểu diễn ngữ nghĩa và thứ hạng được dùng để fusion.
  hint_en: Distinguish keyword signals, semantic representations and the ranks used for fusion.
- id: phase-13-genai-advanced-rag-advanced-rag-1-application
  type: application
  question_vi: Với lexical=[d1, d2, d3], dense giả lập=[d2, d3, d1], c=60 và nhãn {d2, d3}, tính thứ hạng RRF,
    Recall@1 và Recall@2 trong ví dụ mã.
  question_en: With lexical=[d1, d2, d3], simulated dense=[d2, d3, d1], c=60 and relevance labels {d2, d3},
    calculate the snippet’s RRF ranking, Recall@1 and Recall@2.
  answer_vi: Điểm d2 = 1/62 + 1/61, d1 = 1/61 + 1/63 và d3 = 1/63 + 1/62, nên thứ hạng là [d2, d1, d3]. Top-1
    và top-2 đều chỉ chứa một trong hai nguồn liên quan là d2; vì vậy Recall@1 = Recall@2 = 1/2 = 0,5. Thêm
    d1 ở vị trí thứ hai không làm tăng recall.
  answer_en: The scores are d2 = 1/62 + 1/61, d1 = 1/61 + 1/63 and d3 = 1/63 + 1/62, so the ranking is [d2,
    d1, d3]. Both top-1 and top-2 contain only one of the two relevant sources, d2; therefore Recall@1 = Recall@2
    = 1/2 = 0.5. Adding d1 in second place does not increase recall.
  hint_vi: Cộng hai phần điểm của từng ID theo thứ hạng bắt đầu từ 1, rồi đếm nguồn đúng trong top-k.
  hint_en: Add each ID’s two rank contributions using ranks starting at 1, then count relevant sources in top-k.
- id: phase-13-genai-advanced-rag-advanced-rag-1-debug
  type: debug
  question_vi: Nếu xóa d2 khỏi cả hai danh sách mà vẫn giữ nhãn {d2, d3}, đổi c có thể đưa d2 trở lại không?
    Hàm recall xử lý nhãn rỗng như thế nào?
  question_en: If d2 is removed from both lists while the labels remain {d2, d3}, can changing c bring d2 back?
    How does recall handle empty labels?
  answer_vi: Không. RRF chỉ chấm các ID có trong đầu vào; sau khi xóa d2, không giá trị c hợp lệ nào tạo lại
    được d2. Kiểm tra tập ứng viên của từng retriever, bộ lọc quyền và dữ liệu nguồn để tìm bước bỏ sót trước
    khi chỉnh fusion. Hàm recall báo ValueError("answerable labels required") khi nhãn rỗng; tách trường hợp
    không có đáp án khỏi phép tính recall này.
  answer_en: No. RRF only scores IDs present in its inputs; after removing d2, no valid c can recreate it.
    Inspect each retriever’s candidates, permission filters and source data to locate the omission before tuning
    fusion. The recall function raises ValueError("answerable labels required") for empty labels; handle unanswerable
    cases separately from this recall calculation.
  hint_vi: Kiểm tra hợp của các ID đầu vào trước khi xem điểm fusion; recall cần mẫu số khác 0.
  hint_en: Check the union of input IDs before fusion scores; recall needs a nonzero denominator.
- id: phase-13-genai-advanced-rag-advanced-rag-1-interview
  type: interview
  question_vi: Vì sao dùng RRF thay vì cộng điểm BM25 và vector thô, và bạn cần đo gì trước khi chọn hybrid
    search cho hệ thống thật?
  question_en: Why use RRF instead of adding raw BM25 and vector scores, and what should you measure before
    choosing hybrid search for a real system?
  answer_vi: RRF tránh để một thang điểm thô lấn át thang còn lại, nhưng bỏ qua độ chênh điểm giữa các kết
    quả và vẫn phụ thuộc chất lượng ứng viên. Chạy hai retriever cũng thêm chi phí và độ trễ. So lexical, vector
    và fusion trên cùng corpus, câu hỏi, quyền và k; đo Recall@k, độ trễ và xem riêng mã hiếm, diễn đạt khác,
    thiếu đáp án. Ví dụ chỉ hợp nhất danh sách giả lập, chưa chứng minh hybrid tốt hơn BM25 hay embedding thật.
  answer_en: RRF avoids letting one raw score scale dominate the other, but discards score gaps between results
    and still depends on candidate quality. Running two retrievers also adds cost and latency. Compare lexical,
    vector and fused results with the same corpus, questions, permissions and k; measure Recall@k and latency,
    and inspect rare identifiers, paraphrases and unanswerable cases separately. The fixture only fuses simulated
    lists; it does not establish that hybrid search outperforms real BM25 or embeddings.
  hint_vi: Cân nhắc tính ổn định giữa thang điểm, thông tin bị bỏ qua và chi phí chạy hai retriever.
  hint_en: Consider robustness across score scales, discarded information and the cost of running two retrievers.
completion_criteria_en:
- JSON report with hashes, configuration and per-case results
- Comparison table and simplest adequate configuration
- One retrieval failure and one answer-policy failure
- No forbidden chunk is exposed; citations resolve to document/version/line. Character vectors are not described
  as neural embeddings.
common_mistakes_en:
- Tuning on test.
- Adding scores with incompatible scales.
- Blaming every answer error on retrieval or citing advertising as a benchmark.
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

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: học nhập tài liệu và chunking ở phase 12, hiểu token, cosine và tập dev/test. Bắt đầu với tìm từ khóa để có baseline rẻ, dễ giải thích. Lab giữ nguyên 12 tài liệu giả, 30 câu hỏi và ID đoạn theo dòng; chunk có document_id, version, line, text, allowed_users. Lọc quyền và metadata trước khi tính thống kê BM25, embedding hoặc điểm, không chỉ lọc đáp án cuối.

Pipeline thực hành: lexical → BM25 → vector ký tự → hợp nhất BM25/vector bằng RRF → rerank. BM25 có độ bão hòa tần suất từ và chuẩn hóa độ dài; vector mặc định là cosine của trigram ký tự, không phải embedding ngữ nghĩa. Nếu chạy ô model có sẵn trong Colab, truyền backend đó vào run để thử embedding thật mà không cài lên máy cá nhân.

Giữ top-k=3, candidate pool=6, corpus và câu hỏi cố định. RRF trong lab dùng hạng bắt đầu từ 1 và hằng số 60; không cộng trực tiếp điểm BM25 với cosine. Qdrant có quy ước/default khác, nên ghi cấu hình thay vì khẳng định mọi triển khai dùng cùng công thức số.

Kết quả đo offline: cả 5 cách đều Recall@3=1 và không lỗi trên 14 câu dev cũ. Điều này không chứng minh hybrid tốt hơn. Năm probe dev bổ sung được báo riêng, không chèn vào test: paraphrase về giờ thư viện và hỏi phí phạt không có trong tài liệu vẫn thất bại. So sánh cả latency và quyết định trả lời/từ chối; nếu không tăng chất lượng, giữ baseline đơn giản.

Mốc chunking: trước khi đổi kích thước đoạn, chạy lại bài phase-12-genai-rag-rag-2 và giữ nguyên offset/trích dẫn. Split theo nguồn trước khi tạo câu hỏi; khi đổi chunk, ánh xạ gold bằng vị trí nguồn thay vì sửa nhãn theo kết quả retriever. Chunking không có một tỷ lệ đóng góp chất lượng cố định. TikTok T17/T24 là gợi ý M/H; số đo ở đây đến từ fixture của repo.

Chạy 5 cách retrieval; lập bảng Recall@3, MRR@3, p95 và ca sai. Thử thay candidate pool trong bản sao, giữ test nguyên vẹn.

Không rò chunk bị cấm; có thể truy từ citation về đúng document/version/line. Không gọi vector ký tự là model embedding.

### English

Prerequisites: phase 12 ingestion/chunking, token overlap, cosine and dev/test. Start with an inexpensive lexical baseline. The lab preserves 12 synthetic documents, 30 questions and line-based chunk IDs; metadata includes document_id, version, line, text and allowed_users. Apply authorization and metadata filters before corpus statistics, encoding or scoring.

Compare lexical, BM25, character vectors, BM25/vector RRF and reranking. BM25 saturates term frequency and normalizes document length. Default vectors are character-trigram cosine, not semantic embeddings. The existing optional Colab model can be passed into run as the backend without installing it on the learner’s PC.

Keep top-k=3, candidate pool=6, corpus and questions fixed. This lab uses 1-based ranks and RRF constant 60. Never add raw BM25 and cosine scores directly. Qdrant has different defaults/conventions, so record them rather than assuming identical numerical formulas.

Offline measurements give all five methods Recall@3=1 and no failures on the original 14 dev cases. This does not show a hybrid gain. Five separate dev stress cases expose paraphrase and unsupported-detail failures; test stays unchanged. Compare latency and answer/abstention decisions. Retain the simple baseline when added complexity produces no measured benefit.

For chunking experiments, revisit phase-12-genai-rag-rag-2 and preserve source offsets/citations. Split by source before authoring questions; remap gold evidence by source location when rechunking, never by retriever output. No fixed quality percentage is attributed to chunking. TikTok T17/T24 are M/H topic leads; numerical evidence comes from repository fixtures.

Compare Recall@3, MRR@3, p95 and failures for five methods. Change candidate count in a copy without editing test.

No forbidden chunk is exposed; citations resolve to document/version/line. Character vectors are not described as neural embeddings.
