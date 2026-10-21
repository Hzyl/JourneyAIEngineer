---
lesson_id: phase-07-capstone-career-ship-2
phase_id: phase-07-capstone-career
module_id: ship
title_vi: Viết báo cáo đánh giá
title_en: Evaluation reports
summary_vi: Báo cáo cần dữ liệu, cách chia, thước đo, mô hình cơ sở và kết quả theo nhóm.
summary_en: Learn Evaluation reports through an input → transformation → output model, then verify it with
  an edge-case exercise.
learning_objectives:
- Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
- Viết báo cáo phân biệt kết quả thực nghiệm, fixture và phần chưa xác minh.
learning_objectives_en:
- Explain evaluation reports with a concrete example.
- Write or adapt a small code example applying evaluation reports.
- Recognize its assumptions, limits and one common failure mode.
- Write an evaluation report that distinguishes measurements, fixtures and unverified claims.
prerequisites:
- phase-07-capstone-career-ship-1
- phase-06-llm-rag-nlp-foundations-1
key_terms:
- evaluation
- report
- Python
- testing
- debugging
- maintainability
- ship
concept_notes_vi: |-
  Báo cáo cần dữ liệu, cách chia, thước đo, mô hình cơ sở và kết quả theo nhóm. Nêu cả thất bại để người đọc hiểu giới hạn thay vì chỉ thấy kết quả tốt nhất.

  Báo cáo đánh giá khác bảng điểm: nó giải thích điểm được tạo ra từ dữ liệu và quy trình nào. Kết quả trên tập dễ hoặc đã dùng để chỉnh prompt không đại diện độc lập cho tình huống sử dụng mới.

  Ví dụ, báo cáo trợ lý tài liệu nên tách câu hỏi có nguồn, thiếu nguồn và nguồn mâu thuẫn, kèm câu trả lời sai điển hình. Tự kiểm tra: có nên chỉ báo cáo lần chạy tốt nhất? Không; nêu cách chọn cấu hình, độ biến động đã đo và phiên bản dữ liệu để người đọc đánh giá công bằng.

  Chuẩn bị: có baseline và artifact M1–M6 từ bài MVP. Báo cáo phải trả lời: hệ thống nào, dữ liệu nào, đo lúc nào, trên máy nào, thay đổi gì, metric nào và giới hạn gì. Lưu corpus/question/source hash, model revision nếu có, split, top-k, candidate pool, cấu hình, seed và từng ca thất bại.

  Bảng chất lượng tách Recall@k/MRR của truy xuất, action accuracy, citation exactness, claim-level groundedness và tỷ lệ từ chối đúng. Câu không có gold evidence không được biến thành Recall=0 hay 1 tùy tiện; ghi mẫu số. Citation đúng vị trí không chứng minh đoạn đó hỗ trợ điều người dùng hỏi.

  Bảng vận hành ghi số request, concurrency, warm-up, p50/p95 theo nearest-rank, timeout, lỗi HTTP, throughput và số đáp án fixture đúng. Chi phí provider bằng 0 vì baseline không gọi provider; chi phí hạ tầng vẫn chưa đo. TTFT/token phải để null hoặc NOT RUN khi không có generation/streaming.

  Ví dụ dưới là kiểm tra sự đầy đủ của báo cáo giả, không phải dấu chứng nhận production-ready. Kể cả trường hợp đi qua mọi trường bắt buộc vẫn cần người đọc rà bằng chứng. Ghi riêng Python native PASS, Compose config PASS, container runtime NOT RUN nếu chưa chạy; không cộng chúng thành một dấu pass chung.

  Viết decision log: baseline cũ đạt trần trên 14 dev, stress dev còn 2/5 ca sai, hybrid/rerank chưa có lợi ích được chứng minh. Giữ ca sai và đề xuất một thay đổi có giả thuyết, ví dụ cải thiện query paraphrase hoặc abstention. Không sửa tập test để làm đẹp báo cáo.
concept_notes_en: |-
  An evaluation report records data, splits, metrics, baselines and results by group. Include failures so readers can judge limitations.

  A report differs from a score table: it explains how data and procedure produced the scores. Easy examples or prompt-tuning data do not independently represent new usage.

  For a document assistant, separate answerable, missing-evidence and conflicting-source questions, with representative failures. Self-check: should only the best run be reported? No: disclose configuration selection, measured variation and data versions so readers can assess the comparison fairly.

  Prerequisite: baseline and M1–M6 artifacts. Record system/data/time/hardware/change/metrics/limits: corpus, questions and source hashes; model revision if used; split, top-k, candidate count, configuration, seed and failures.

  Separate retrieval Recall@k/MRR, action accuracy, citation exactness, claim-level groundedness and correct abstention. Cases without gold evidence need an explicit denominator, not arbitrary recall values. A valid source location does not prove the passage supports the requested fact.

  Operational evidence includes request count, concurrency, warm-up, nearest-rank p50/p95, timeout, HTTP errors, throughput and correct fixture answers. Provider cost is zero only because no provider is called; infrastructure cost is unmeasured. TTFT/tokens remain null or NOT RUN without generation/streaming.

  The example checks a synthetic report’s completeness, not production readiness. Passing required fields still needs human evidence review. Report native PASS, Compose configuration PASS and container runtime NOT RUN separately when applicable.

  Decision log: the original fourteen dev cases hit a ceiling, separate stress dev still has two failures out of five, and hybrid/reranking show no demonstrated gain. Preserve failures and propose one testable change; never rewrite test to improve results.
why_it_matters_vi: Hoàn thiện đồ án có thể chạy, đánh giá và trình bày rõ giới hạn.
why_it_matters_en: Turn the capstone into a product with a baseline, evaluation, demo, README, and explicit
  limitations.
study_steps_vi:
- Gom report và hash, không chép metric bằng tay.
- Tách bảng retrieval/answer/runtime.
- Đọc hai lỗi từ nguồn gốc.
- Viết quyết định và giới hạn; nhờ người khác tái chạy.
study_steps_en:
- Collect reports and hashes.
- Separate retrieval, answers and runtime.
- Trace two failures to source.
- Document decisions/limits and request reproduction.
practice_plan:
  vi:
    task: Tạo EVIDENCE.md cùng các JSON report của capstone. Dùng code dưới để thấy vì sao đủ trường không
      đồng nghĩa đủ bằng chứng; đổi generation thành not_run và deployment thành not_run.
    deliverables:
    - Báo cáo có dữ liệu/cấu hình/môi trường/đường dẫn artifact
    - Bảng lỗi kèm nguồn và một giả thuyết cải thiện
    - Danh sách PASS/FAIL/NOT RUN riêng cho native, Docker và model
    checkpoint: Không bịa metric hoặc tỷ lệ cải thiện; mọi số có mẫu số và điều kiện chạy. Nếu generation chưa
      chạy, kết luận chỉ áp dụng cho extractive baseline.
    stretch: Lặp lại benchmark ba lần và báo khoảng dao động; không chọn lần nhanh nhất.
  en:
    task: Write EVIDENCE.md alongside JSON reports. Use the example to distinguish field completeness from
      evidence; change generation and deployment to not_run.
    deliverables:
    - Data/configuration/environment/artifact references
    - Failure table and one improvement hypothesis
    - Separate native, Docker and model PASS/FAIL/NOT RUN statuses
    checkpoint: Every number has a denominator and conditions. No fabricated gains; without generation, conclusions
      cover the extractive baseline only.
    stretch: Repeat load tests three times and report variation rather than the fastest run.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Viết báo cáo đánh giá” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain evaluation reports to a new teammate?
  - Which assumption behind evaluation reports could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- title: A report gate is not proof of production readiness
  code: |
    import json

    def release_decision(report):
        required = {"corpus_sha256", "source_revision", "split", "retrieval", "generation", "deployment"}
        if not required <= report.keys():
            return "missing_evidence"
        if report["split"] != "test" or report["deployment"] != "verified":
            return "not_ready"
        if report["generation"] == "not_run":
            return "extractive_demo_only"
        return "human_review_required"

    report = {"corpus_sha256": "example-hash-not-a-run", "source_revision": "example-revision",
              "split": "test", "retrieval": {"recall_at_3": 1.0},
              "generation": "not_run", "deployment": "verified"}
    print(json.dumps({"missing": release_decision({}), "complete_fixture": release_decision(report)}))
  language: python
  status: runnable
  purpose_vi: Phân biệt thiếu bằng chứng, demo trích xuất và đánh giá con người; fixture không giả danh một
    lần chạy thật.
  purpose_en: Distinguish missing evidence, an extractive demo and human review; the fixture is not an actual
    run.
  setup: Python 3.11+; standard library only; paste into one Colab cell.
  expected_output: '{"missing": "missing_evidence", "complete_fixture": "extractive_demo_only"}'
  edge_case_vi: Thử tình huống lỗi trong phần thực hành; không coi chương trình thoát thành công là đủ nghiệm
    thu.
  edge_case_en: Try the practice failure case; a zero exit code alone does not establish acceptance.
  explanation_vi: Phân biệt thiếu bằng chứng, demo trích xuất và đánh giá con người; fixture không giả danh
    một lần chạy thật.
  explanation_en: Distinguish missing evidence, an extractive demo and human review; the fixture is not an
    actual run.
  setup_en: Python 3.11+; standard library only; paste into one Colab cell.
  setup_vi: Python 3.11+, chỉ thư viện chuẩn. Có thể dán vào một ô Google Colab và chạy.
resources:
- language: en
  title: GitHub Docs
  url: https://docs.github.com/en
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Google Engineering Practices
  url: https://google.github.io/eng-practices/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: The Twelve-Factor App
  url: https://12factor.net/
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
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
- title: OpenTelemetry observability primer
  url: https://opentelemetry.io/docs/concepts/observability-primer/
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  purpose_en: Distinguish aggregate metrics, event logs and cross-step traces.
  read_vi: Phân biệt metric tổng hợp, log sự kiện và trace xuyên nhiều bước.
  read_en: Distinguish aggregate metrics, event logs and cross-step traces.
- title: 'Sentence Transformers: retrieve and rerank'
  url: https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html
  language: en
  kind: official
  required: false
  purpose_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  purpose_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
  read_vi: Phân biệt bi-encoder lấy ứng viên với cross-encoder chấm cặp query–passage.
  read_en: Distinguish candidate retrieval by bi-encoder from query–passage cross-encoding.
exercise_ids:
- exercise-7-ship
review_item_ids:
- phase-07-capstone-career-ship-2-recall
- phase-07-capstone-career-ship-2-application
- phase-07-capstone-career-ship-2-debug
- phase-07-capstone-career-ship-2-interview
estimated_minutes: 90
completion_checklist:
- Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Để người khác làm theo hướng dẫn và ghi các bước còn thiếu.
- Báo cáo có dữ liệu/cấu hình/môi trường/đường dẫn artifact
- Bảng lỗi kèm nguồn và một giả thuyết cải thiện
- Danh sách PASS/FAIL/NOT RUN riêng cho native, Docker và model
- Không bịa metric hoặc tỷ lệ cải thiện; mọi số có mẫu số và điều kiện chạy. Nếu generation chưa chạy, kết
  luận chỉ áp dụng cho extractive baseline.
common_mistakes:
- Trình bày bản demo như sản phẩm hoàn chỉnh khi chưa kiểm chứng cách chạy lại.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Gọi template report là kết quả đo.
- Ghi cost=0 cho cả hạ tầng.
- Dùng fixture dễ để hứa chất lượng trên tài liệu thật.
next_lessons:
- phase-07-capstone-career-ship-3
- phase-07-capstone-career-ship-4
review_question_vi: Nội dung cốt lõi của “Viết báo cáo đánh giá” là gì?
review_question_en: Define evaluation reports in your own words. What are the input, transformation and output?
review_answer_vi: Báo cáo cần dữ liệu, cách chia, thước đo, mô hình cơ sở và kết quả theo nhóm. Nêu cả thất
  bại để người đọc hiểu giới hạn thay vì chỉ thấy kết quả tốt nhất.
review_answer_en: A strong answer names the input, transformation, output and the context where evaluation
  reports is used. Relate it specifically to evaluation reports in lesson phase-07-capstone-career-ship-2.
review_cards:
- id: phase-07-capstone-career-ship-2-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Viết báo cáo đánh giá” là gì?
  question_en: Define evaluation reports in your own words. What are the input, transformation and output?
  answer_vi: Báo cáo cần dữ liệu, cách chia, thước đo, mô hình cơ sở và kết quả theo nhóm. Nêu cả thất bại
    để người đọc hiểu giới hạn thay vì chỉ thấy kết quả tốt nhất.
  answer_en: A strong answer names the input, transformation, output and the context where evaluation reports
    is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-07-capstone-career-ship-2-application
  type: application
  question_vi: Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng.
  question_en: Write a small code example or design that applies evaluation reports to an AI engineering problem.
  answer_vi: 'Với nhiệm vụ “Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng”, cần lưu:
    luồng sử dụng hoặc báo cáo có kết quả kiểm tra và giới hạn. Để người khác làm theo hướng dẫn và ghi các
    bước còn thiếu.'
  answer_en: The evaluation reports example should have an explicit input, expected output and a way to run
    or verify it (phase-07-capstone-career-ship-2).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-07-capstone-career-ship-2-debug
  type: debug
  question_vi: Khi làm bài “Viết báo cáo đánh giá”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If evaluation reports produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Viết báo cáo đánh giá”, lỗi cần tránh là: trình bày bản demo như sản phẩm hoàn chỉnh
    khi chưa kiểm chứng cách chạy lại. Để người khác làm theo hướng dẫn và ghi các bước còn thiếu. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For evaluation reports, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-07-capstone-career-ship-2).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-07-capstone-career-ship-2-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Viết báo cáo đánh giá” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of evaluation reports?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc
    lại định nghĩa.
  answer_en: The answer about evaluation reports should cover assumptions, metrics/cost, limitations and how
    to reduce production risk (phase-07-capstone-career-ship-2).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Data/configuration/environment/artifact references
- Failure table and one improvement hypothesis
- Separate native, Docker and model PASS/FAIL/NOT RUN statuses
- Every number has a denominator and conditions. No fabricated gains; without generation, conclusions cover
  the extractive baseline only.
common_mistakes_en:
- Reporting a template as a measurement.
- Calling all infrastructure free.
- Generalizing tiny fixtures to real-document quality.
---
# Viết báo cáo đánh giá / Evaluation reports

Báo cáo cần dữ liệu, cách chia, thước đo, mô hình cơ sở và kết quả theo nhóm. Nêu cả thất bại để người đọc hiểu giới hạn thay vì chỉ thấy kết quả tốt nhất.

Báo cáo đánh giá khác bảng điểm: nó giải thích điểm được tạo ra từ dữ liệu và quy trình nào. Kết quả trên tập dễ hoặc đã dùng để chỉnh prompt không đại diện độc lập cho tình huống sử dụng mới.

Ví dụ, báo cáo trợ lý tài liệu nên tách câu hỏi có nguồn, thiếu nguồn và nguồn mâu thuẫn, kèm câu trả lời sai điển hình. Tự kiểm tra: có nên chỉ báo cáo lần chạy tốt nhất? Không; nêu cách chọn cấu hình, độ biến động đã đo và phiên bản dữ liệu để người đọc đánh giá công bằng.

## Thực hành

Viết bảng kết quả có mốc so sánh và giải thích một nhóm lỗi quan trọng.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Làm một luồng nhỏ chạy trọn trên máy, ghi kết quả kiểm thử, quay demo và ghi phần chưa hoàn thành.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: có baseline và artifact M1–M6 từ bài MVP. Báo cáo phải trả lời: hệ thống nào, dữ liệu nào, đo lúc nào, trên máy nào, thay đổi gì, metric nào và giới hạn gì. Lưu corpus/question/source hash, model revision nếu có, split, top-k, candidate pool, cấu hình, seed và từng ca thất bại.

Bảng chất lượng tách Recall@k/MRR của truy xuất, action accuracy, citation exactness, claim-level groundedness và tỷ lệ từ chối đúng. Câu không có gold evidence không được biến thành Recall=0 hay 1 tùy tiện; ghi mẫu số. Citation đúng vị trí không chứng minh đoạn đó hỗ trợ điều người dùng hỏi.

Bảng vận hành ghi số request, concurrency, warm-up, p50/p95 theo nearest-rank, timeout, lỗi HTTP, throughput và số đáp án fixture đúng. Chi phí provider bằng 0 vì baseline không gọi provider; chi phí hạ tầng vẫn chưa đo. TTFT/token phải để null hoặc NOT RUN khi không có generation/streaming.

Ví dụ dưới là kiểm tra sự đầy đủ của báo cáo giả, không phải dấu chứng nhận production-ready. Kể cả trường hợp đi qua mọi trường bắt buộc vẫn cần người đọc rà bằng chứng. Ghi riêng Python native PASS, Compose config PASS, container runtime NOT RUN nếu chưa chạy; không cộng chúng thành một dấu pass chung.

Viết decision log: baseline cũ đạt trần trên 14 dev, stress dev còn 2/5 ca sai, hybrid/rerank chưa có lợi ích được chứng minh. Giữ ca sai và đề xuất một thay đổi có giả thuyết, ví dụ cải thiện query paraphrase hoặc abstention. Không sửa tập test để làm đẹp báo cáo.

Tạo EVIDENCE.md cùng các JSON report của capstone. Dùng code dưới để thấy vì sao đủ trường không đồng nghĩa đủ bằng chứng; đổi generation thành not_run và deployment thành not_run.

Không bịa metric hoặc tỷ lệ cải thiện; mọi số có mẫu số và điều kiện chạy. Nếu generation chưa chạy, kết luận chỉ áp dụng cho extractive baseline.

### English

Prerequisite: baseline and M1–M6 artifacts. Record system/data/time/hardware/change/metrics/limits: corpus, questions and source hashes; model revision if used; split, top-k, candidate count, configuration, seed and failures.

Separate retrieval Recall@k/MRR, action accuracy, citation exactness, claim-level groundedness and correct abstention. Cases without gold evidence need an explicit denominator, not arbitrary recall values. A valid source location does not prove the passage supports the requested fact.

Operational evidence includes request count, concurrency, warm-up, nearest-rank p50/p95, timeout, HTTP errors, throughput and correct fixture answers. Provider cost is zero only because no provider is called; infrastructure cost is unmeasured. TTFT/tokens remain null or NOT RUN without generation/streaming.

The example checks a synthetic report’s completeness, not production readiness. Passing required fields still needs human evidence review. Report native PASS, Compose configuration PASS and container runtime NOT RUN separately when applicable.

Decision log: the original fourteen dev cases hit a ceiling, separate stress dev still has two failures out of five, and hybrid/reranking show no demonstrated gain. Preserve failures and propose one testable change; never rewrite test to improve results.

Write EVIDENCE.md alongside JSON reports. Use the example to distinguish field completeness from evidence; change generation and deployment to not_run.

Every number has a denominator and conditions. No fabricated gains; without generation, conclusions cover the extractive baseline only.
