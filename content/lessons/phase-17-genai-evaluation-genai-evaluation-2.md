---
lesson_id: phase-17-genai-evaluation-genai-evaluation-2
phase_id: phase-17-genai-evaluation
module_id: genai-evaluation
title_vi: 'Đánh giá RAG: truy xuất và câu trả lời'
title_en: 'RAG evaluation: retrieval and answers'
summary_vi: Chấm truy xuất, hỗ trợ dẫn nguồn và cách xử lý câu thiếu đáp án bằng các tiêu chí riêng.
summary_en: Score retrieval, citation support and unanswerable handling with separate criteria.
learning_objectives:
- Chấm truy xuất, hỗ trợ dẫn nguồn và cách xử lý câu thiếu đáp án bằng các tiêu chí riêng.
- Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn
  có thật nhưng sai khẳng định.
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Phân tích lỗi theo từng tầng và dùng đúng mẫu số, không đánh đồng retrieval với groundedness.
learning_objectives_en:
- Score retrieval, citation support and unanswerable handling with separate criteria.
- Correct q2 and rerun; only supported-answer rate should increase. Add a case with an existing citation that
  supports the wrong claim.
- Never divide by an empty gold set; score unanswerable/ambiguous cases by their separate behaviors.
- Diagnose failures by layer and metric denominator without equating retrieval with grounding.
prerequisites:
- phase-17-genai-evaluation-genai-evaluation-1
- phase-16-genai-mcp-mcp-1
key_terms:
- rag
- evaluation
- retrieval
- answer
- token
- embedding
- genai-evaluation
concept_notes_vi: |-
  Retrieval đúng là tìm được nguồn liên quan; generation đúng còn đòi hỏi câu trả lời được nguồn hỗ trợ. Có thể tìm đúng đoạn nhưng trả lời sai, hoặc dẫn nguồn có thật nhưng không hỗ trợ khẳng định. Vì vậy tách Recall@k, đáp án được hỗ trợ và hành vi từ chối/hỏi rõ khi dữ liệu thiếu.

  Ví dụ dùng nhãn do người biên soạn dữ liệu mô phỏng đặt trước, không nhờ model chấm. Case q2 tìm đúng nguồn nhưng trả lời sai nên recall vẫn cao trong khi supported-answer rate giảm. Câu không có đáp án và câu mơ hồ không có nhãn nguồn để tính recall; chấm lần lượt abstain và clarify riêng.

  Tự kiểm tra: 100% recall có chứng minh hệ RAG đúng 100% không? Không. Lab A có 20 câu có đáp án, 5 thiếu đáp án và 5 mơ hồ; chia dev/test trước khi chỉnh cách truy xuất. Với LLM-as-judge, cần rubric rõ và đối chiếu mẫu chấm tay; không xem điểm tự động là sự thật tuyệt đối.

  Chuẩn bị: đã chạy baseline RAG và biết gold evidence là nhãn tham chiếu, không được đưa vào retriever. Giữ ví dụ bốn ca đầu để phân biệt retrieval, support và abstention; sau đó chạy cùng bộ Lab A bằng run("dev"). Báo cáo từng câu quan trọng hơn một điểm tổng đẹp.

  Lập cây chẩn đoán: nguồn không được nạp/không đủ quyền → ingestion hoặc ACL; nguồn có nhưng vắng trong top-k → retrieval; nguồn có trong pool nhưng đứng thấp → ranking; nguồn đúng đã lấy mà quyết định trả lời vẫn sai → answer policy/generation. Đọc nguồn để xác nhận, vì nhãn chẩn đoán tự động chỉ là gợi ý.

  Hai probe cố ý khó: câu diễn đạt giờ thư viện bằng “chỗ cho mượn sách” làm lộ phụ thuộc từ khóa; câu hỏi mức phạt trả muộn bị trả đoạn nói về thư viện dù không có con số phạt. Trường hợp thứ hai có citation đúng nguyên văn nhưng không trả lời được câu hỏi. Sửa retrieval không tự sửa abstention.

  Giữ 14 dev và 16 test cũ; năm probe mới là dev riêng. Recall@3/MRR chỉ tính trên ca có gold; decision accuracy còn kiểm tra action và citation gold. Không dùng citation exactness làm groundedness. Nếu thêm LLM, tách từng claim để người đọc đánh supported/unsupported/unclear, lưu người chấm và bất đồng; bài này không có LLM judge.

  Nguồn TikTok chỉ gợi ý chủ đề, không cung cấp kết quả đánh giá cho repo. Không gắn tỷ lệ quảng cáo vào rubric. Sau khi đã xem test, mọi thay đổi tiếp theo phải dùng một tập test mới chưa xem nếu cần kết luận độc lập.
concept_notes_en: |-
  Successful retrieval finds relevant sources; correct generation additionally requires that sources support the answer. A system may retrieve the right passage but answer incorrectly, or cite a real source that does not support its claim. Separate Recall@k, supported-answer rate and abstain/clarify behavior when evidence is missing.

  This example uses author-labeled fixtures rather than a model grader. Case q2 retrieves the right source but answers incorrectly, so recall remains high while supported-answer rate falls. Unanswerable and ambiguous questions have no relevant-source labels for recall; score abstention and clarification separately.

  Self-check: does 100% recall imply 100% correct RAG answers? No. Lab A contains 20 answerable, 5 unanswerable and 5 ambiguous questions; establish dev/test splits before tuning retrieval. LLM-as-judge needs an explicit rubric and human calibration rather than treating automated scores as ground truth.

  Prerequisite: baseline RAG and gold evidence as evaluator-only labels. Keep the four-case example to separate retrieval, support and abstention, then run Lab A dev. Per-case evidence matters more than an attractive aggregate.

  Diagnose missing ingestion/permission first, missing top-k evidence second, low candidate rank third, then answer-policy/generation failures despite available evidence. Verify against source: automated diagnosis labels are hints, not proof.

  A library-hours paraphrase exposes lexical dependence. A late-return-fee question receives a library passage with no fee figure. Its citation is exact but does not answer the question; better retrieval does not automatically repair abstention.

  Preserve fourteen dev and sixteen test cases; five new probes remain separate dev. Recall@3/MRR use evidence-bearing cases only; decision accuracy additionally checks actions and gold citations. Exact citations are not semantic groundedness. For LLM extensions, review claims as supported/unsupported/unclear and retain reviewer disagreements. No LLM judge runs here.

  TikTok provides topic leads, not repository evaluation results. No promotional percentages enter the rubric. After inspecting test, later independent evaluation requires new unseen cases.
why_it_matters_vi: Chấm truy xuất, hỗ trợ dẫn nguồn và cách xử lý câu thiếu đáp án bằng các tiêu chí riêng.
why_it_matters_en: Score retrieval, citation support and unanswerable handling with separate criteria.
study_steps_vi:
- Chạy ví dụ bốn ca.
- Chạy Lab A và năm probe riêng.
- Đối chiếu hai lỗi với nguồn.
- Ghi giả thuyết, test hồi quy và giới hạn chấm.
study_steps_en:
- Run the four-case example.
- Run Lab A and separate probes.
- Trace two failures to source.
- Record hypothesis, regression and judging limits.
practice_plan:
  vi:
    task: Lập bảng id → retrieved → citation → expected action → actual action → nguyên nhân → thử nghiệm kế
      tiếp cho hai probe thất bại.
    deliverables:
    - Bảng hai lỗi có trích nguồn
    - Mẫu số metric và trạng thái generation rõ ràng
    - Một regression test cho thiếu bằng chứng
    checkpoint: Không sửa gold để ép pass; câu hỏi phí phạt phải được đánh là thiếu dữ kiện dù citation tồn
      tại.
    stretch: Nhờ người thứ hai chấm claim support độc lập và giải thích bất đồng.
  en:
    task: For both failing probes, tabulate IDs, retrieval, citation, expected/actual action, cause and next
      experiment.
    deliverables:
    - Two source-backed failure analyses
    - Metric denominators and generation status
    - One missing-evidence regression test
    checkpoint: Never rewrite gold to pass; the fee question lacks evidence even with a real citation.
    stretch: Have a second reviewer assess claim support independently and explain disagreements.
interview_questions:
  vi:
  - 'Bạn sẽ giải thích nội dung “Đánh giá RAG: truy xuất và câu trả lời” bằng ví dụ nào?'
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - 'How would you explain rag evaluation: retrieval and answers to a new teammate?'
  - 'Which assumption behind rag evaluation: retrieval and answers could fail in production?'
  - Which metric or test would prove the result is trustworthy?
formulas:
- Recall@k = relevant sources in top-k / all relevant sources
- Supported-answer rate = supported answers / answerable questions
code_examples:
- language: python
  title: Score retrieval, supported answers and abstention separately
  code: |
    import json
    cases = [
        dict(id="q1", kind="answerable", gold={"d1"}, found=["d1"], supported=True),
        dict(id="q2", kind="answerable", gold={"d2"}, found=["d2"], supported=False),
        dict(id="q3", kind="unanswerable", gold=set(), found=[], action="abstain"),
        dict(id="q4", kind="ambiguous", gold=set(), found=[], action="clarify"),
    ]
    answerable = [c for c in cases if c["kind"] == "answerable"]
    recall = sum(len(set(c["found"]) & c["gold"]) / len(c["gold"]) for c in answerable) / len(answerable)
    supported = sum(c["supported"] for c in answerable) / len(answerable)
    special = [c for c in cases if c["kind"] != "answerable"]
    expected = {"unanswerable": "abstain", "ambiguous": "clarify"}
    correct_behavior = sum(c["action"] == expected[c["kind"]] for c in special)
    print(json.dumps({"retrieval_recall": recall, "supported_answer_rate": supported,
                      "special_cases_correct": correct_behavior,
                      "failures": [c["id"] for c in answerable if not c["supported"]]}))
  status: runnable
  purpose_vi: Chấm truy xuất, hỗ trợ dẫn nguồn và cách xử lý câu thiếu đáp án bằng các tiêu chí riêng.
  purpose_en: Score retrieval, citation support and unanswerable handling with separate criteria.
  setup: 'Python 3.11+; standard library only. Google Colab: paste into one code cell and Run.'
  expected_output: '{"retrieval_recall": 1.0, "supported_answer_rate": 0.5, "special_cases_correct": 2, "failures":
    ["q2"]}'
  edge_case_vi: Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
  edge_case_en: Never divide by an empty gold set; score unanswerable/ambiguous cases by their separate behaviors.
  explanation_vi: Groundedness trong ví dụ là nhãn hỗ trợ đặt trước, không phải bộ suy luận ngữ nghĩa tự động.
  explanation_en: Groundedness here is a preassigned support label, not an automated semantic entailment system.
resources:
- language: en
  title: OpenAI Evals
  url: https://github.com/openai/evals
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
  title: DeepEval Documentation
  url: https://deepeval.com/docs/getting-started
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  language: en
  purpose_vi: Tìm hiểu nền tảng Transformer và cách đánh giá an toàn cho ứng dụng NLP/LLM.
  read_vi: Đọc chương liên quan, sau đó ghi lại giả định và trường hợp thất bại cho bài học.
  purpose_en: Build transformer and safety foundations for NLP/LLM applications.
  read_en: Read the relevant chapter, then record assumptions and failure cases.
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
- title: 'Capstone RAG: source, commands and evidence rubric'
  url: https://github.com/Hzyl/JourneyAIEngineer/blob/main/samples/vi-document-assistant/CAPSTONE.md
  language: vi
  kind: external
  required: false
  purpose_vi: 'Mã nguồn và lệnh đầy đủ của lab dùng xuyên suốt các bài, không cần Git: có thể tải ZIP.'
  purpose_en: Complete shared lab commands and sources; download ZIP without using Git.
  read_vi: Đọc mốc M1–M6, chạy đúng môi trường và ghi phần chưa chạy.
  read_en: Follow milestones M1–M6 and record the environment and unexecuted steps.
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
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-2-recall
- phase-17-genai-evaluation-genai-evaluation-2-application
- phase-17-genai-evaluation-genai-evaluation-2-debug
- phase-17-genai-evaluation-genai-evaluation-2-interview
estimated_minutes: 75
completion_checklist:
- Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn
  có thật nhưng sai khẳng định.
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Báo cáo từng trường hợp tách recall, câu trả lời có hỗ trợ, abstain và clarify
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
- Bảng hai lỗi có trích nguồn
- Mẫu số metric và trạng thái generation rõ ràng
- Một regression test cho thiếu bằng chứng
- Không sửa gold để ép pass; câu hỏi phí phạt phải được đánh là thiếu dữ kiện dù citation tồn tại.
common_mistakes:
- Chỉ dùng một điểm tổng để kết luận mọi thành phần đều tốt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
- Tính recall cho câu không có gold mà không nói quy ước.
- Coi đúng vị trí nguồn là đúng ý nghĩa.
- Vừa tune vừa chấm trên test.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-3
- phase-17-genai-evaluation-genai-evaluation-4
review_question_vi: 'Nội dung cốt lõi của “Đánh giá RAG: truy xuất và câu trả lời” là gì?'
review_question_en: 'Define rag evaluation: retrieval and answers in your own words. What are the input, transformation
  and output?'
review_answer_vi: Chất lượng truy xuất và chất lượng câu trả lời là hai phần riêng. Nếu nguồn cần thiết không
  có trong ứng viên, cần sửa truy xuất; nếu nguồn đủ mà trả lời sai, xem bước dùng ngữ cảnh.
review_answer_en: 'A strong answer names the input, transformation, output and the context where rag evaluation:
  retrieval and answers is used. Relate it specifically to rag evaluation: retrieval and answers in lesson
  phase-17-genai-evaluation-genai-evaluation-2.'
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-2-recall
  type: recall
  question_vi: 'Nội dung cốt lõi của “Đánh giá RAG: truy xuất và câu trả lời” là gì?'
  question_en: 'Define rag evaluation: retrieval and answers in your own words. What are the input, transformation
    and output?'
  answer_vi: Chất lượng truy xuất và chất lượng câu trả lời là hai phần riêng. Nếu nguồn cần thiết không có
    trong ứng viên, cần sửa truy xuất; nếu nguồn đủ mà trả lời sai, xem bước dùng ngữ cảnh.
  answer_en: 'A strong answer names the input, transformation, output and the context where rag evaluation:
    retrieval and answers is used.'
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-2-application
  type: application
  question_vi: Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng.
  question_en: 'Write a small code example or design that applies rag evaluation: retrieval and answers to
    an AI engineering problem.'
  answer_vi: 'Với nhiệm vụ “Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng”, cần lưu:
    tiêu chí chấm và kết quả trên tình huống đúng, sai. Chấm nhất quán và phân biệt chất lượng truy xuất với
    chất lượng câu trả lời.'
  answer_en: 'The rag evaluation: retrieval and answers example should have an explicit input, expected output
    and a way to run or verify it (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-2-debug
  type: debug
  question_vi: 'Khi làm bài “Đánh giá RAG: truy xuất và câu trả lời”, bạn cần tránh lỗi nào và kiểm tra lại
    ra sao?'
  question_en: 'If rag evaluation: retrieval and answers produces a wrong result or a metric drops, what would
    you debug first?'
  answer_vi: 'Trong bài “Đánh giá RAG: truy xuất và câu trả lời”, lỗi cần tránh là: chỉ dùng một điểm tổng
    để kết luận mọi thành phần đều tốt. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng câu
    trả lời. Dùng ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: 'For rag evaluation: retrieval and answers, check inputs/shapes, preprocessing and the baseline
    first; then isolate the failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-2-interview
  type: interview
  question_vi: 'Bạn dùng kết quả nào từ bài “Đánh giá RAG: truy xuất và câu trả lời” để giải thích cách làm
    và giới hạn?'
  question_en: 'In an interview, how would you explain a trade-off and one edge case of rag evaluation: retrieval
    and answers?'
  answer_vi: Bắt đầu từ nhiệm vụ “Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng”. Trình
    bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định
    nghĩa.
  answer_en: 'The answer about rag evaluation: retrieval and answers should cover assumptions, metrics/cost,
    limitations and how to reduce production risk (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
completion_criteria_en:
- Two source-backed failure analyses
- Metric denominators and generation status
- One missing-evidence regression test
- Never rewrite gold to pass; the fee question lacks evidence even with a real citation.
common_mistakes_en:
- Using undefined recall denominators.
- Confusing source exactness with support.
- Tuning on the final test.
---
# Đánh giá RAG: truy xuất và câu trả lời / RAG evaluation: retrieval and answers

Retrieval đúng là tìm được nguồn liên quan; generation đúng còn đòi hỏi câu trả lời được nguồn hỗ trợ. Có thể tìm đúng đoạn nhưng trả lời sai, hoặc dẫn nguồn có thật nhưng không hỗ trợ khẳng định. Vì vậy tách Recall@k, đáp án được hỗ trợ và hành vi từ chối/hỏi rõ khi dữ liệu thiếu.

Ví dụ dùng nhãn do người biên soạn dữ liệu mô phỏng đặt trước, không nhờ model chấm. Case q2 tìm đúng nguồn nhưng trả lời sai nên recall vẫn cao trong khi supported-answer rate giảm. Câu không có đáp án và câu mơ hồ không có nhãn nguồn để tính recall; chấm lần lượt abstain và clarify riêng.

Tự kiểm tra: 100% recall có chứng minh hệ RAG đúng 100% không? Không. Lab A có 20 câu có đáp án, 5 thiếu đáp án và 5 mơ hồ; chia dev/test trước khi chỉnh cách truy xuất. Với LLM-as-judge, cần rubric rõ và đối chiếu mẫu chấm tay; không xem điểm tự động là sự thật tuyệt đối.

## English

Successful retrieval finds relevant sources; correct generation additionally requires that sources support the answer. A system may retrieve the right passage but answer incorrectly, or cite a real source that does not support its claim. Separate Recall@k, supported-answer rate and abstain/clarify behavior when evidence is missing.

This example uses author-labeled fixtures rather than a model grader. Case q2 retrieves the right source but answers incorrectly, so recall remains high while supported-answer rate falls. Unanswerable and ambiguous questions have no relevant-source labels for recall; score abstention and clarification separately.

Self-check: does 100% recall imply 100% correct RAG answers? No. Lab A contains 20 answerable, 5 unanswerable and 5 ambiguous questions; establish dev/test splits before tuning retrieval. LLM-as-judge needs an explicit rubric and human calibration rather than treating automated scores as ground truth.

## Thực hành / Practice

Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn có thật nhưng sai khẳng định.

Correct q2 and rerun; only supported-answer rate should increase. Add a case with an existing citation that supports the wrong claim.

## Lab nối tiếp · 21/10/2026 / Connected lab

### Tiếng Việt

Chuẩn bị: đã chạy baseline RAG và biết gold evidence là nhãn tham chiếu, không được đưa vào retriever. Giữ ví dụ bốn ca đầu để phân biệt retrieval, support và abstention; sau đó chạy cùng bộ Lab A bằng run("dev"). Báo cáo từng câu quan trọng hơn một điểm tổng đẹp.

Lập cây chẩn đoán: nguồn không được nạp/không đủ quyền → ingestion hoặc ACL; nguồn có nhưng vắng trong top-k → retrieval; nguồn có trong pool nhưng đứng thấp → ranking; nguồn đúng đã lấy mà quyết định trả lời vẫn sai → answer policy/generation. Đọc nguồn để xác nhận, vì nhãn chẩn đoán tự động chỉ là gợi ý.

Hai probe cố ý khó: câu diễn đạt giờ thư viện bằng “chỗ cho mượn sách” làm lộ phụ thuộc từ khóa; câu hỏi mức phạt trả muộn bị trả đoạn nói về thư viện dù không có con số phạt. Trường hợp thứ hai có citation đúng nguyên văn nhưng không trả lời được câu hỏi. Sửa retrieval không tự sửa abstention.

Giữ 14 dev và 16 test cũ; năm probe mới là dev riêng. Recall@3/MRR chỉ tính trên ca có gold; decision accuracy còn kiểm tra action và citation gold. Không dùng citation exactness làm groundedness. Nếu thêm LLM, tách từng claim để người đọc đánh supported/unsupported/unclear, lưu người chấm và bất đồng; bài này không có LLM judge.

Nguồn TikTok chỉ gợi ý chủ đề, không cung cấp kết quả đánh giá cho repo. Không gắn tỷ lệ quảng cáo vào rubric. Sau khi đã xem test, mọi thay đổi tiếp theo phải dùng một tập test mới chưa xem nếu cần kết luận độc lập.

Lập bảng id → retrieved → citation → expected action → actual action → nguyên nhân → thử nghiệm kế tiếp cho hai probe thất bại.

Không sửa gold để ép pass; câu hỏi phí phạt phải được đánh là thiếu dữ kiện dù citation tồn tại.

### English

Prerequisite: baseline RAG and gold evidence as evaluator-only labels. Keep the four-case example to separate retrieval, support and abstention, then run Lab A dev. Per-case evidence matters more than an attractive aggregate.

Diagnose missing ingestion/permission first, missing top-k evidence second, low candidate rank third, then answer-policy/generation failures despite available evidence. Verify against source: automated diagnosis labels are hints, not proof.

A library-hours paraphrase exposes lexical dependence. A late-return-fee question receives a library passage with no fee figure. Its citation is exact but does not answer the question; better retrieval does not automatically repair abstention.

Preserve fourteen dev and sixteen test cases; five new probes remain separate dev. Recall@3/MRR use evidence-bearing cases only; decision accuracy additionally checks actions and gold citations. Exact citations are not semantic groundedness. For LLM extensions, review claims as supported/unsupported/unclear and retain reviewer disagreements. No LLM judge runs here.

TikTok provides topic leads, not repository evaluation results. No promotional percentages enter the rubric. After inspecting test, later independent evaluation requires new unseen cases.

For both failing probes, tabulate IDs, retrieval, citation, expected/actual action, cause and next experiment.

Never rewrite gold to pass; the fee question lacks evidence even with a real citation.
