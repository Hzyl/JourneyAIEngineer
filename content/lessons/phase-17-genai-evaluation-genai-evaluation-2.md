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
- Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn có thật
  nhưng sai khẳng định.
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
learning_objectives_en:
- Score retrieval, citation support and unanswerable handling with separate criteria.
- Correct q2 and rerun; only supported-answer rate should increase. Add a case with an existing citation that supports
  the wrong claim.
- Never divide by an empty gold set; score unanswerable/ambiguous cases by their separate behaviors.
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
concept_notes_vi: 'Retrieval đúng là tìm được nguồn liên quan; generation đúng còn đòi hỏi câu trả lời được nguồn
  hỗ trợ. Có thể tìm đúng đoạn nhưng trả lời sai, hoặc dẫn nguồn có thật nhưng không hỗ trợ khẳng định. Vì vậy tách
  Recall@k, đáp án được hỗ trợ và hành vi từ chối/hỏi rõ khi dữ liệu thiếu.


  Ví dụ dùng nhãn do người biên soạn dữ liệu mô phỏng đặt trước, không nhờ model chấm. Case q2 tìm đúng nguồn nhưng
  trả lời sai nên recall vẫn cao trong khi supported-answer rate giảm. Câu không có đáp án và câu mơ hồ không có
  nhãn nguồn để tính recall; chấm lần lượt abstain và clarify riêng.


  Tự kiểm tra: 100% recall có chứng minh hệ RAG đúng 100% không? Không. Lab A có 20 câu có đáp án, 5 thiếu đáp án
  và 5 mơ hồ; chia dev/test trước khi chỉnh cách truy xuất. Với LLM-as-judge, cần rubric rõ và đối chiếu mẫu chấm
  tay; không xem điểm tự động là sự thật tuyệt đối.'
concept_notes_en: 'Successful retrieval finds relevant sources; correct generation additionally requires that sources
  support the answer. A system may retrieve the right passage but answer incorrectly, or cite a real source that
  does not support its claim. Separate Recall@k, supported-answer rate and abstain/clarify behavior when evidence
  is missing.


  This example uses author-labeled fixtures rather than a model grader. Case q2 retrieves the right source but answers
  incorrectly, so recall remains high while supported-answer rate falls. Unanswerable and ambiguous questions have
  no relevant-source labels for recall; score abstention and clarification separately.


  Self-check: does 100% recall imply 100% correct RAG answers? No. Lab A contains 20 answerable, 5 unanswerable
  and 5 ambiguous questions; establish dev/test splits before tuning retrieval. LLM-as-judge needs an explicit rubric
  and human calibration rather than treating automated scores as ground truth.'
why_it_matters_vi: Chấm truy xuất, hỗ trợ dẫn nguồn và cách xử lý câu thiếu đáp án bằng các tiêu chí riêng.
why_it_matters_en: Score retrieval, citation support and unanswerable handling with separate criteria.
study_steps_vi:
- Đọc phần giải thích và dự đoán đầu ra của ví dụ trước khi chạy.
- Chạy mã Python trong một ô Google Colab; ví dụ chỉ dùng thư viện chuẩn, không cần cài thêm.
- Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn có thật
  nhưng sai khẳng định.
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Lưu đầu ra, đối chiếu với kết quả mong đợi và ghi rõ giới hạn của dữ liệu mô phỏng.
study_steps_en:
- Read the explanation and predict the example output before running it.
- Run the Python code in a Google Colab cell; this example uses only the standard library.
- Correct q2 and rerun; only supported-answer rate should increase. Add a case with an existing citation that supports
  the wrong claim.
- Never divide by an empty gold set; score unanswerable/ambiguous cases by their separate behaviors.
- Save the output, compare it with the expected result and state the limits of the synthetic data.
practice_plan:
  vi:
    task: Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn
      có thật nhưng sai khẳng định.
    deliverables:
    - Báo cáo từng trường hợp tách recall, câu trả lời có hỗ trợ, abstain và clarify
    - Đầu ra gốc và kết quả sau khi đổi một điều kiện
    - Giải thích một lỗi và giới hạn của phép đo
    checkpoint: Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
    stretch: Mở notebook liên kết, chạy trong Colab và ghi cấu hình thực tế.
  en:
    task: Correct q2 and rerun; only supported-answer rate should increase. Add a case with an existing citation
      that supports the wrong claim.
    deliverables:
    - A per-case report separating recall, supported answers, abstention and clarification
    - Original output and output after changing one condition
    - An explanation of one failure and the measurement limits
    checkpoint: Never divide by an empty gold set; score unanswerable/ambiguous cases by their separate behaviors.
    stretch: Open the linked notebook, run in Colab and record the actual configuration.
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
  code: "import json\ncases = [\n    dict(id=\"q1\", kind=\"answerable\", gold={\"d1\"}, found=[\"d1\"], supported=True),\n\
    \    dict(id=\"q2\", kind=\"answerable\", gold={\"d2\"}, found=[\"d2\"], supported=False),\n    dict(id=\"q3\"\
    , kind=\"unanswerable\", gold=set(), found=[], action=\"abstain\"),\n    dict(id=\"q4\", kind=\"ambiguous\"\
    , gold=set(), found=[], action=\"clarify\"),\n]\nanswerable = [c for c in cases if c[\"kind\"] == \"answerable\"\
    ]\nrecall = sum(len(set(c[\"found\"]) & c[\"gold\"]) / len(c[\"gold\"]) for c in answerable) / len(answerable)\n\
    supported = sum(c[\"supported\"] for c in answerable) / len(answerable)\nspecial = [c for c in cases if c[\"\
    kind\"] != \"answerable\"]\nexpected = {\"unanswerable\": \"abstain\", \"ambiguous\": \"clarify\"}\ncorrect_behavior\
    \ = sum(c[\"action\"] == expected[c[\"kind\"]] for c in special)\nprint(json.dumps({\"retrieval_recall\": recall,\
    \ \"supported_answer_rate\": supported,\n                  \"special_cases_correct\": correct_behavior,\n  \
    \                \"failures\": [c[\"id\"] for c in answerable if not c[\"supported\"]]}))\n"
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
  read_en: 'Run in Colab on a Google-hosted CPU runtime: baseline first, then optional embeddings. Use dev before
    evaluating test and download the report.'
exercise_ids:
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-2-recall
- phase-17-genai-evaluation-genai-evaluation-2-application
- phase-17-genai-evaluation-genai-evaluation-2-debug
- phase-17-genai-evaluation-genai-evaluation-2-interview
estimated_minutes: 60
completion_checklist:
- Đổi đáp án q2 thành đúng rồi chạy lại; chỉ supported-answer rate được tăng. Thêm một trường hợp dẫn nguồn có thật
  nhưng sai khẳng định.
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Lưu đầu ra và ghi đúng giới hạn của ví dụ.
completion_criteria:
- Báo cáo từng trường hợp tách recall, câu trả lời có hỗ trợ, abstain và clarify
- Không chia cho tập gold rỗng; trường hợp unanswerable/ambiguous phải chấm theo hành vi riêng.
- Không suy kết quả model thật từ dữ liệu mô phỏng.
common_mistakes:
- Chỉ dùng một điểm tổng để kết luận mọi thành phần đều tốt.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-3
- phase-17-genai-evaluation-genai-evaluation-4
review_question_vi: 'Nội dung cốt lõi của “Đánh giá RAG: truy xuất và câu trả lời” là gì?'
review_question_en: 'Define rag evaluation: retrieval and answers in your own words. What are the input, transformation
  and output?'
review_answer_vi: Chất lượng truy xuất và chất lượng câu trả lời là hai phần riêng. Nếu nguồn cần thiết không có
  trong ứng viên, cần sửa truy xuất; nếu nguồn đủ mà trả lời sai, xem bước dùng ngữ cảnh.
review_answer_en: 'A strong answer names the input, transformation, output and the context where rag evaluation:
  retrieval and answers is used. Relate it specifically to rag evaluation: retrieval and answers in lesson phase-17-genai-evaluation-genai-evaluation-2.'
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-2-recall
  type: recall
  question_vi: 'Nội dung cốt lõi của “Đánh giá RAG: truy xuất và câu trả lời” là gì?'
  question_en: 'Define rag evaluation: retrieval and answers in your own words. What are the input, transformation
    and output?'
  answer_vi: Chất lượng truy xuất và chất lượng câu trả lời là hai phần riêng. Nếu nguồn cần thiết không có trong
    ứng viên, cần sửa truy xuất; nếu nguồn đủ mà trả lời sai, xem bước dùng ngữ cảnh.
  answer_en: 'A strong answer names the input, transformation, output and the context where rag evaluation: retrieval
    and answers is used.'
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-2-application
  type: application
  question_vi: Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng.
  question_en: 'Write a small code example or design that applies rag evaluation: retrieval and answers to an AI
    engineering problem.'
  answer_vi: 'Với nhiệm vụ “Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng”, cần lưu: tiêu
    chí chấm và kết quả trên tình huống đúng, sai. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng
    câu trả lời.'
  answer_en: 'The rag evaluation: retrieval and answers example should have an explicit input, expected output and
    a way to run or verify it (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-2-debug
  type: debug
  question_vi: 'Khi làm bài “Đánh giá RAG: truy xuất và câu trả lời”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?'
  question_en: 'If rag evaluation: retrieval and answers produces a wrong result or a metric drops, what would you
    debug first?'
  answer_vi: 'Trong bài “Đánh giá RAG: truy xuất và câu trả lời”, lỗi cần tránh là: chỉ dùng một điểm tổng để kết
    luận mọi thành phần đều tốt. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng câu trả lời. Dùng
    ví dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: 'For rag evaluation: retrieval and answers, check inputs/shapes, preprocessing and the baseline first;
    then isolate the failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-2-interview
  type: interview
  question_vi: 'Bạn dùng kết quả nào từ bài “Đánh giá RAG: truy xuất và câu trả lời” để giải thích cách làm và giới
    hạn?'
  question_en: 'In an interview, how would you explain a trade-off and one edge case of rag evaluation: retrieval
    and answers?'
  answer_vi: Bắt đầu từ nhiệm vụ “Chấm riêng việc tìm được bằng chứng và việc sử dụng đúng bằng chứng”. Trình bày
    kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: 'The answer about rag evaluation: retrieval and answers should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-17-genai-evaluation-genai-evaluation-2).'
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
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
