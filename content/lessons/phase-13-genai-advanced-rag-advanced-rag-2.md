---
lesson_id: phase-13-genai-advanced-rag-advanced-rag-2
phase_id: phase-13-genai-advanced-rag
module_id: advanced-rag
title_vi: Xếp hạng lại và chọn top-k
title_en: Reranking and top-k selection
summary_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
summary_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and
  after reranking.
learning_objectives:
- Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
- Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả
  số ứng viên và k cùng báo cáo.
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Tách candidate recall khỏi chất lượng reranking và chỉ thêm reranker khi có lợi ích đo được.
learning_objectives_en:
- Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and after reranking.
- Change the reranking rule and compare both cases; the missing-source case must still fail. In Lab A, save
  candidate count and k with the report.
- 'Remove d2 from the candidates: reciprocal rank remains zero regardless of reranking scores.'
- Separate candidate recall from reranking quality and require measured benefit for added complexity.
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
concept_notes_vi: |-
  Retriever lấy tập ứng viên trước; reranker chấm lại từng cặp truy vấn–đoạn rồi đổi thứ tự trong tập đó. Bi-encoder tính vector riêng cho truy vấn và đoạn; cross-encoder xử lý cặp cùng nhau. Reranker không thể khôi phục đoạn mà retriever chưa lấy được.

  Ví dụ dùng quy tắc chấm tự tạo để học cách đo, không chạy cross-encoder. MRR lấy trung bình nghịch đảo thứ hạng của nguồn đúng đầu tiên, quy ước 0 nếu không có. Recall@k đo độ bao phủ nguồn đúng trong k kết quả đầu. Tăng k có thể tăng recall nhưng đưa thêm nhiễu và tăng context/độ trễ; phải ghi cả số ứng viên, k và điều kiện chạy.

  Tự kiểm tra: MRR tăng có đủ kết luận câu trả lời tốt hơn không? Không; cần đánh giá riêng generation và trích dẫn. Trong Colab, giữ tập câu hỏi cố định, đo từng trường hợp và thời gian thực; điểm của dữ liệu mô phỏng dưới đây không dự đoán chất lượng tiếng Việt.

  Chuẩn bị: chạy baseline và hybrid của bài trước. Ví dụ đầu giữ điểm giả để nhìn rõ lỗi mất ứng viên. Lab nối tiếp dùng văn bản thật của corpus giả: retriever lấy tối đa 6 đoạn, reranker đo bigram có thứ tự giữa query và đoạn rồi chọn 3. Đây là heuristic minh bạch, không phải CrossEncoder và không được ghi là benchmark model.

  Reranker chỉ được đổi thứ tự tập ứng viên đã qua ACL; không tạo ID mới hoặc kéo đoạn bị cấm vào context. Một điểm hữu hạn cho mỗi ứng viên là hợp đồng đầu vào; thiếu điểm hoặc NaN phải bị từ chối. Khi đồng điểm, giữ thứ hạng trước để tránh một tie-break tùy ý làm đẹp MRR.

  So hybrid với hybrid_phrase_rerank trên cùng câu hỏi và cùng candidate pool. Nếu nguồn đúng không có trong pool, tăng độ tốt của reranker vẫn không cứu được. Trước khi dùng cross-encoder thật, đo candidate Recall@6, giới hạn độ dài query/passage, p95 và thời gian tải model; điểm chấm không mặc nhiên là xác suất đúng.

  Trong 14 câu dev hiện tại, heuristic không cải thiện điểm vì baseline đã đạt trần. Probe paraphrase và thiếu chi tiết vẫn hỏng. Kết luận đúng là chưa có bằng chứng nên thêm reranker vào hệ thống mặc định. Muốn thử model thật, dùng hosted Colab như nhánh tùy chọn; ghi model/revision/hardware, không dùng CPU lab này để suy ra tốc độ GPU.
concept_notes_en: |-
  A retriever first selects candidates; a reranker scores each query–passage pair and reorders that set. A bi-encoder represents queries and passages independently, while a cross-encoder processes the pair jointly. A reranker cannot recover a passage the retriever never selected.

  This example uses a synthetic scoring rule, not a cross-encoder. MRR averages the reciprocal rank of the first relevant source, using zero when none is found. Recall@k measures relevant-source coverage within the first k results. Larger k may improve recall but add noise, context and latency; record candidate count, k and execution conditions.

  Self-check: does higher MRR establish better answers? No; generation and citations need separate evaluation. In Colab, hold questions fixed and measure per-case outcomes and real elapsed time; the fixture scores below do not predict Vietnamese model quality.

  Prerequisite: baseline and hybrid retrieval. Keep the first mock-score example to expose missing candidates. The connected lab retrieves up to six real fixture passages and reorders them by query–passage ordered-bigram overlap before selecting three. This transparent heuristic is not a CrossEncoder benchmark.

  A reranker only reorders already authorized candidates; it cannot invent IDs or restore forbidden chunks. It must return one finite score per candidate; mismatched counts and NaN fail. Ties retain prior rank to prevent arbitrary tie-breaking gains.

  Compare hybrid and hybrid_phrase_rerank on identical questions and candidate pools. A missing relevant passage cannot be recovered by reranking. Before using a neural cross-encoder, measure candidate Recall@6, input truncation, p95 and model-loading time. Scores are not automatically calibrated correctness probabilities.

  The heuristic adds no quality gain on the original 14 dev questions because the baseline is already at the ceiling. Paraphrase and unsupported-detail probes still fail. There is currently no evidence to enable reranking by default. Optional hosted Colab model experiments must record model/revision/hardware; CPU fixture timings do not predict GPU performance.
why_it_matters_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
why_it_matters_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before
  and after reranking.
study_steps_vi:
- Giữ ví dụ điểm giả để hiểu MRR.
- Chạy ablation của bài hybrid trên corpus văn bản.
- So ứng viên trước/sau và kiểm tra không có ID mới.
- Ghi lợi ích, latency và trường hợp cần giữ baseline.
study_steps_en:
- Use mock scores to understand MRR.
- Run the previous lesson’s text-corpus ablation.
- Compare candidate IDs before/after.
- Record benefit, latency and reasons to keep the baseline.
practice_plan:
  vi:
    task: Chạy code ablation ở bài trước, xuất hai bảng cho hybrid và hybrid_phrase_rerank. Tạo một dev query
      mà nguồn đúng nằm ngoài pool, rồi giải thích vì sao rerank không sửa được.
    deliverables:
    - Danh sách ứng viên trước/sau cho từng ca
    - Candidate Recall@6 và MRR@3 được phân biệt
    - Báo cáo latency và kết luận thêm/bỏ reranker dựa trên bằng chứng
    checkpoint: Test thiếu ứng viên phải còn thất bại; NaN hoặc sai số lượng điểm bị chặn; không lấy gold labels
      làm điểm rerank.
    stretch: Thử một cross-encoder trong Colab như thí nghiệm riêng, giữ corpus/test và lưu revision; ghi NOT
      RUN nếu chưa thực thi.
  en:
    task: Export hybrid and hybrid_phrase_rerank comparisons. Author a dev query whose evidence is outside
      the pool and explain why reranking cannot fix it.
    deliverables:
    - Per-case candidate lists before/after
    - Separate candidate Recall@6 and MRR@3
    - Measured latency and an evidence-based retain/remove decision
    checkpoint: Missing-candidate tests still fail; reject NaN/count mismatch; never feed gold labels into
      scoring.
    stretch: Try a pinned cross-encoder in hosted Colab as a separate experiment; record NOT RUN when unexecuted.
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
  code: |
    import json
    def reciprocal_rank(ranking, relevant):
        return next((1 / rank for rank, doc in enumerate(ranking, 1)
                     if doc in relevant), 0.0)
    def recall_at_k(ranking, relevant, k):
        return len(set(ranking[:k]) & relevant) / len(relevant)
    cases = [(["d1", "d2"], {"d2"}), (["d1", "d3"], {"d2"})]
    mock_scores = {"d1": 0.2, "d2": 0.9, "d3": 0.1}
    after = [(sorted(r, key=lambda d: -mock_scores[d]), gold) for r, gold in cases]
    def evaluate(rows):
        return {"mrr": sum(reciprocal_rank(r, g) for r, g in rows) / len(rows),
                "recall_at_1": sum(recall_at_k(r, g, 1) for r, g in rows) / len(rows)}
    print(json.dumps({"before": evaluate(cases), "after": evaluate(after),
                      "missing_candidate_rr": reciprocal_rank(after[1][0], {"d2"})}))
  status: runnable
  purpose_vi: Tách lỗi mất ứng viên khỏi lỗi xếp hạng; đo Recall@k và MRR trước/sau rerank.
  purpose_en: Separate missing-candidate failures from ranking failures; measure Recall@k and MRR before and
    after reranking.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"before": {"mrr": 0.25, "recall_at_1": 0.0}, "after": {"mrr": 0.5, "recall_at_1": 0.5},
    "missing_candidate_rr": 0.0}'
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
  read_en: 'Run in Colab on a Google-hosted CPU runtime: baseline first, then optional embeddings. Use dev
    before evaluating test and download the report.'
- title: Sentence Transformers — Retrieve & Re-Rank
  url: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
  purpose_vi: Phân biệt bi-encoder lấy ứng viên và cross-encoder xếp hạng lại.
  purpose_en: Distinguish bi-encoder candidate retrieval from cross-encoder reranking.
  read_vi: 'Đọc Retrieve & Re-Rank Pipeline và Re-Ranker: Cross-Encoder; đối chiếu giới hạn tập ứng viên.'
  read_en: 'Read Retrieve & Re-Rank Pipeline and Re-Ranker: Cross-Encoder; inspect candidate-set limitations.'
  language: en
  kind: official
  required: false
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
exercise_ids:
- exercise-13-advanced-rag
review_item_ids:
- phase-13-genai-advanced-rag-advanced-rag-2-recall
- phase-13-genai-advanced-rag-advanced-rag-2-application
- phase-13-genai-advanced-rag-advanced-rag-2-debug
- phase-13-genai-advanced-rag-advanced-rag-2-interview
estimated_minutes: 65
completion_checklist:
- Đổi quy tắc rerank rồi so hai trường hợp; trường hợp mất nguồn phải tiếp tục thất bại. Trong Lab A, lưu cả
  số ứng viên và k cùng báo cáo.
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Báo cáo trước/sau gồm MRR, Recall@k và trường hợp không có nguồn trong ứng viên
- 'Xóa d2 khỏi ứng viên: reciprocal rank vẫn bằng 0 dù đổi điểm rerank.'
- Không suy kết quả model thật từ dữ liệu mô phỏng.
- Danh sách ứng viên trước/sau cho từng ca
- Candidate Recall@6 và MRR@3 được phân biệt
- Báo cáo latency và kết luận thêm/bỏ reranker dựa trên bằng chứng
- Test thiếu ứng viên phải còn thất bại; NaN hoặc sai số lượng điểm bị chặn; không lấy gold labels làm điểm
  rerank.
common_mistakes:
- Gộp điểm BM25 với điểm vector mà chưa xét thang đo.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Gọi heuristic là neural reranker.
- Đánh đồng citation có thật với câu trả lời được nguồn hỗ trợ.
- Thay pool và model cùng lúc rồi quy mọi cải thiện cho model.
next_lessons:
- phase-13-genai-advanced-rag-advanced-rag-3
- phase-13-genai-advanced-rag-advanced-rag-4
review_question_vi: Retriever, reranker và bước chọn top-k khác nhau như thế nào? Reranker có tìm lại được
  đoạn vắng trong tập ứng viên không?
review_question_en: How do retrieval, reranking and top-k selection differ? Can a reranker recover a passage
  absent from the candidates?
review_answer_vi: Retriever lấy tập ứng viên từ corpus; reranker chấm mức liên quan của từng cặp truy vấn–đoạn
  và sắp lại tập đó; chọn top-k giữ k kết quả đầu để dùng tiếp. Bi-encoder biểu diễn truy vấn và đoạn riêng,
  còn cross-encoder xử lý cặp cùng nhau. Reranker không tạo thêm nguồn ngoài tập ứng viên.
review_answer_en: A retriever selects candidates from the corpus; a reranker scores the relevance of each query–passage
  pair and reorders that set; top-k selection keeps the first k results for downstream use. A bi-encoder represents
  the query and passage separately, while a cross-encoder processes the pair jointly. A reranker cannot add
  sources outside the candidate set.
review_cards:
- id: phase-13-genai-advanced-rag-advanced-rag-2-recall
  type: recall
  question_vi: Retriever, reranker và bước chọn top-k khác nhau như thế nào? Reranker có tìm lại được đoạn
    vắng trong tập ứng viên không?
  question_en: How do retrieval, reranking and top-k selection differ? Can a reranker recover a passage absent
    from the candidates?
  answer_vi: Retriever lấy tập ứng viên từ corpus; reranker chấm mức liên quan của từng cặp truy vấn–đoạn và
    sắp lại tập đó; chọn top-k giữ k kết quả đầu để dùng tiếp. Bi-encoder biểu diễn truy vấn và đoạn riêng,
    còn cross-encoder xử lý cặp cùng nhau. Reranker không tạo thêm nguồn ngoài tập ứng viên.
  answer_en: A retriever selects candidates from the corpus; a reranker scores the relevance of each query–passage
    pair and reorders that set; top-k selection keeps the first k results for downstream use. A bi-encoder
    represents the query and passage separately, while a cross-encoder processes the pair jointly. A reranker
    cannot add sources outside the candidate set.
  hint_vi: Theo dõi nguồn từ corpus đến ứng viên, thứ hạng mới và context cuối cùng.
  hint_en: Trace sources from the corpus to candidates, the new ranking and the final context.
- id: phase-13-genai-advanced-rag-advanced-rag-2-application
  type: application
  question_vi: Trong ví dụ mã, hai tập ứng viên là [d1, d2] và [d1, d3], cùng có nhãn {d2}. Tính RR từng trường
    hợp, MRR và Recall@1 trung bình trước/sau khi dùng mock_scores.
  question_en: In the snippet, the candidate sets are [d1, d2] and [d1, d3], both labeled {d2}. Calculate each
    case’s RR, MRR and mean Recall@1 before and after applying mock_scores.
  answer_vi: Trước rerank, RR là [1/2, 0], nên MRR = 0,25; Recall@1 của cả hai trường hợp bằng 0, nên trung
    bình bằng 0. Sau rerank, thứ tự là [d2, d1] và [d1, d3], RR là [1, 0], nên MRR = 0,5. Recall@1 lần lượt
    là [1, 0], trung bình bằng 0,5. Trường hợp thứ hai vẫn thiếu d2; đây là kết quả quy tắc giả lập, không
    phải benchmark cross-encoder.
  answer_en: Before reranking, RR is [1/2, 0], so MRR is 0.25; Recall@1 is zero for both cases, giving a mean
    of 0. After reranking, the orders are [d2, d1] and [d1, d3], with RR [1, 0], so MRR is 0.5. Recall@1 is
    [1, 0], averaging 0.5. The second case still lacks d2; these are results from a synthetic rule, not a cross-encoder
    benchmark.
  hint_vi: RR là nghịch đảo vị trí nguồn đúng đầu tiên, hoặc 0 nếu thiếu; lấy trung bình trên cả hai trường
    hợp.
  hint_en: RR is the reciprocal of the first relevant position, or zero if absent; average across both cases.
- id: phase-13-genai-advanced-rag-advanced-rag-2-debug
  type: debug
  question_vi: Sau rerank, trường hợp [d1, d3] vẫn có RR=0 với nhãn {d2}. Bạn cần kiểm tra bước nào, và tăng
    điểm của d2 trong mock_scores có sửa được không?
  question_en: After reranking, the [d1, d3] case still has RR=0 for label {d2}. Which stage should you inspect,
    and would increasing d2’s mock_scores value fix it?
  answer_vi: Kiểm tra bước lấy ứng viên vì d2 chưa có trong đầu vào reranker. Đối chiếu d2 với corpus, bộ lọc
    quyền và danh sách retriever trả về để tìm nguyên nhân bỏ sót. Tăng điểm d2 không giúp vì sorted chỉ duyệt
    d1 và d3; RR vẫn bằng 0. Chỉ chẩn đoán lỗi thứ hạng khi nguồn đúng đã có trong tập ứng viên.
  answer_en: Inspect candidate retrieval because d2 never entered the reranker. Check d2 against the corpus,
    permission filters and the retriever’s returned list to locate the omission. Increasing d2’s score does
    not help because sorted only processes d1 and d3; RR remains zero. Diagnose a ranking failure only when
    the relevant source is already among the candidates.
  hint_vi: Tìm d2 trong danh sách được đưa vào sorted trước khi sửa điểm.
  hint_en: Look for d2 in the list passed to sorted before changing scores.
- id: phase-13-genai-advanced-rag-advanced-rag-2-interview
  type: interview
  question_vi: Bạn cân bằng số ứng viên và k như thế nào khi thêm cross-encoder? Vì sao MRR tăng trong ví dụ
    chưa đủ để kết luận câu trả lời tốt hơn?
  question_en: How do you balance candidate count and k when adding a cross-encoder? Why is the fixture’s higher
    MRR insufficient to conclude that answers are better?
  answer_vi: Nhiều ứng viên hơn có thể tăng cơ hội lấy được nguồn đúng nhưng cần chấm nhiều cặp hơn; k lớn
    hơn có thể tăng độ bao phủ nhưng thêm nhiễu và chi phí context. Giữ tập câu hỏi cố định, ghi số ứng viên
    và k, đo Recall@k, MRR, thời gian và chi phí thực tế. Đánh giá riêng câu trả lời và trích dẫn. Ví dụ chỉ
    dùng mock_scores và còn một trường hợp mất nguồn, nên không chứng minh chất lượng hay độ trễ của cross-encoder
    thật.
  answer_en: More candidates may improve the chance of retrieving a relevant source but require scoring more
    pairs; a larger k may improve coverage while adding noise and context cost. Hold the questions fixed, record
    candidate count and k, and measure Recall@k, MRR, actual runtime and cost. Evaluate answers and citations
    separately. The fixture only uses mock_scores and still has a missing-source case, so it establishes neither
    the quality nor latency of a real cross-encoder.
  hint_vi: Phân biệt số cặp cần chấm với số đoạn được đưa vào context; đo retrieval và generation riêng.
  hint_en: Distinguish the number of pairs scored from the passages placed in context; evaluate retrieval and
    generation separately.
completion_criteria_en:
- Per-case candidate lists before/after
- Separate candidate Recall@6 and MRR@3
- Measured latency and an evidence-based retain/remove decision
- Missing-candidate tests still fail; reject NaN/count mismatch; never feed gold labels into scoring.
common_mistakes_en:
- Calling a heuristic neural reranking.
- Equating real citations with supported answers.
- Changing pool and model together and attributing all gains to the model.
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

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: chạy baseline và hybrid của bài trước. Ví dụ đầu giữ điểm giả để nhìn rõ lỗi mất ứng viên. Lab nối tiếp dùng văn bản thật của corpus giả: retriever lấy tối đa 6 đoạn, reranker đo bigram có thứ tự giữa query và đoạn rồi chọn 3. Đây là heuristic minh bạch, không phải CrossEncoder và không được ghi là benchmark model.

Reranker chỉ được đổi thứ tự tập ứng viên đã qua ACL; không tạo ID mới hoặc kéo đoạn bị cấm vào context. Một điểm hữu hạn cho mỗi ứng viên là hợp đồng đầu vào; thiếu điểm hoặc NaN phải bị từ chối. Khi đồng điểm, giữ thứ hạng trước để tránh một tie-break tùy ý làm đẹp MRR.

So hybrid với hybrid_phrase_rerank trên cùng câu hỏi và cùng candidate pool. Nếu nguồn đúng không có trong pool, tăng độ tốt của reranker vẫn không cứu được. Trước khi dùng cross-encoder thật, đo candidate Recall@6, giới hạn độ dài query/passage, p95 và thời gian tải model; điểm chấm không mặc nhiên là xác suất đúng.

Trong 14 câu dev hiện tại, heuristic không cải thiện điểm vì baseline đã đạt trần. Probe paraphrase và thiếu chi tiết vẫn hỏng. Kết luận đúng là chưa có bằng chứng nên thêm reranker vào hệ thống mặc định. Muốn thử model thật, dùng hosted Colab như nhánh tùy chọn; ghi model/revision/hardware, không dùng CPU lab này để suy ra tốc độ GPU.

Chạy code ablation ở bài trước, xuất hai bảng cho hybrid và hybrid_phrase_rerank. Tạo một dev query mà nguồn đúng nằm ngoài pool, rồi giải thích vì sao rerank không sửa được.

Test thiếu ứng viên phải còn thất bại; NaN hoặc sai số lượng điểm bị chặn; không lấy gold labels làm điểm rerank.

### English

Prerequisite: baseline and hybrid retrieval. Keep the first mock-score example to expose missing candidates. The connected lab retrieves up to six real fixture passages and reorders them by query–passage ordered-bigram overlap before selecting three. This transparent heuristic is not a CrossEncoder benchmark.

A reranker only reorders already authorized candidates; it cannot invent IDs or restore forbidden chunks. It must return one finite score per candidate; mismatched counts and NaN fail. Ties retain prior rank to prevent arbitrary tie-breaking gains.

Compare hybrid and hybrid_phrase_rerank on identical questions and candidate pools. A missing relevant passage cannot be recovered by reranking. Before using a neural cross-encoder, measure candidate Recall@6, input truncation, p95 and model-loading time. Scores are not automatically calibrated correctness probabilities.

The heuristic adds no quality gain on the original 14 dev questions because the baseline is already at the ceiling. Paraphrase and unsupported-detail probes still fail. There is currently no evidence to enable reranking by default. Optional hosted Colab model experiments must record model/revision/hardware; CPU fixture timings do not predict GPU performance.

Export hybrid and hybrid_phrase_rerank comparisons. Author a dev query whose evidence is outside the pool and explain why reranking cannot fix it.

Missing-candidate tests still fail; reject NaN/count mismatch; never feed gold labels into scoring.
