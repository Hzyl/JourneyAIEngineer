---
lesson_id: phase-17-genai-evaluation-genai-evaluation-1
phase_id: phase-17-genai-evaluation
module_id: genai-evaluation
title_vi: Đánh giá LLM và xây tập kiểm tra
title_en: LLM evaluation and test sets
summary_vi: Chấm từng ca theo nguồn, dòng, câu trích, đáp án và từ chối; phân tích lỗi với tập dev/test tách biệt.
summary_en: Score source, line, quote, answer and abstention per case, and analyze failures with separate dev/test
  sets.
learning_objectives:
- Viết tiêu chí chấm đúng nguồn, dòng, câu trích, đáp án và từ chối khi thiếu bằng chứng.
- Đọc lỗi từng ca và nêu mẫu số của từng tỷ lệ; phân biệt trích dẫn có thật với hỗ trợ ngữ nghĩa.
- Tách dev/test, ghi điều kiện đo và giải thích giới hạn về dữ liệu, độ trễ, chi phí.
learning_objectives_en:
- Define checks for source, line, quote, answer and abstention when evidence is missing.
- Inspect per-case failures and metric denominators; distinguish citation existence from semantic support.
- Separate dev/test, record measurement conditions and explain data, latency and cost limits.
prerequisites:
- phase-16-genai-mcp-mcp-4
- phase-16-genai-mcp-mcp-1
key_terms:
- llm
- evaluation
- test
- set
- token
- embedding
- retrieval
- genai-evaluation
concept_notes_vi: 'Đánh giá bắt đầu từ nhiệm vụ, dữ liệu và tiêu chí chấm được viết trước khi tối ưu. Với trợ lý
  tài liệu, tách kiểm tra tìm đúng nguồn khỏi kiểm tra câu trả lời. Ví dụ dưới dùng câu hỏi giả định về hạn hoàn
  tiền và câu ngoài dữ liệu về thời hạn bảo hành; các đầu ra cố định giúp kiểm tra bộ chấm, không đo LLM thật.


  Mỗi đáp án có bằng chứng cần khớp tài liệu nguồn, số dòng tính từ 1, câu trích và nội dung trả lời theo đáp án chuẩn.
  Sai nguồn vẫn là lỗi dù câu trích giống nhau; đúng tệp nhưng sai dòng cũng phải bị phát hiện. citation_exists
  chỉ kiểm tra câu trích có thật tại vị trí đã chỉ. Nó không chứng minh nguồn có thẩm quyền hoặc câu trích hỗ trợ
  ý nghĩa của câu trả lời. unsupported_answer dẫn đúng câu về 30 ngày nhưng trả lời 90 ngày: kiểm tra trích dẫn
  vẫn đạt, kiểm tra đáp án không đạt. So khớp chuỗi ở đây nghiêm ngặt và có thể loại cách diễn đạt đúng khác; đánh
  giá ngữ nghĩa cần tiêu chí riêng và người kiểm tra một mẫu kết quả.


  Khi câu hỏi không có bằng chứng trong kho, đáp án chuẩn của ví dụ yêu cầu abstain=True, câu trả lời rỗng và không
  dẫn nguồn. Một trích dẫn có thật nhưng không liên quan vẫn không trả lời được câu hỏi ngoài dữ liệu. Trong sản
  phẩm, có thể hiển thị lời từ chối hoặc hỏi thêm; trường answer rỗng là quy ước của bộ chấm này.


  Ghi từng lỗi, số ca đạt/tổng ca và tỷ lệ theo nhóm. Ở đây có 4 ca cần trả lời và 2 ca ngoài dữ liệu: source, line,
  quote, answer có mẫu số 4; abstention có mẫu số 2; case_pass có mẫu số 6. Không thay ca lỗi bằng câu dễ hơn để
  tăng điểm. Tự kiểm tra: citation_exists đạt đã chứng minh câu trả lời đúng chưa? Chưa, ca unsupported_answer là
  phản ví dụ.


  Dùng tập phát triển (dev) để phân tích lỗi và sửa; chỉ chạy tập đánh giá cuối (test) sau khi chốt cấu hình cùng
  tiêu chí. Chia theo tài liệu/chủ đề khi câu gần trùng có thể lọt sang hai tập. Không dùng đáp án test để sửa prompt
  rồi gọi đó là phép đo độc lập; nếu đã xem và điều chỉnh, ghi nhận rò rỉ và chuẩn bị tập giữ lại mới. Các fixture
  nhỏ, công khai trong bài chỉ dạy quy trình, không phải benchmark độc lập.


  Với bài chạy đầy đủ, ghi phiên bản cấu hình, mã băm corpus/fixture, máy chạy và phạm vi đo. Đặt trước giới hạn
  thời gian, số lần gọi và chi phí phù hợp nhiệm vụ. p50/p95 chỉ mô tả độ trễ đã đo trong điều kiện đó; ít ca, một
  lần chạy và máy khác nhau không chứng minh hiệu năng triển khai. Ví dụ không gọi nhà cung cấp nên provider_cost=0,
  nhưng không có nghĩa máy tính hay thời gian là miễn phí; cũng không dự đoán chi phí/token hoặc chất lượng model
  thật.'
concept_notes_en: 'Evaluation starts with a task, data and a rubric defined before optimization. For a document
  assistant, separate finding the right evidence from answering correctly. The example uses an assumed refund-deadline
  question and an out-of-corpus warranty question; fixed outputs exercise the scorer, not a real LLM.


  An evidence-backed answer must match the expected source ID, one-based line, quotation and answer. A wrong source
  fails even if its quotation is identical; the correct file with the wrong line must fail too. citation_exists
  only checks that the quotation occurs at the cited position. It does not establish source authority or semantic
  support for the answer. unsupported_answer cites the correct 30-day sentence but answers 90 days: the citation
  check passes while the answer check fails. Exact matching here is strict and may reject valid paraphrases; semantic
  evaluation needs a separate rubric and human inspection of a sample.


  For a question with no evidence in the corpus, this example expects abstain=True, an empty answer and no citation.
  A real but unrelated citation cannot answer an out-of-corpus question. A product may display a refusal or clarification;
  an empty answer field is this scorer''s convention.


  Record each failure, passed/total cases and group results. Four cases require answers and two are out of scope:
  source, line, quote and answer each have denominator 4; abstention has denominator 2; case_pass has denominator
  6. Do not replace failing cases with easier questions to raise the score. Self-check: does passing citation_exists
  prove answer correctness? No; unsupported_answer is a counterexample.


  Use development data (dev) to analyze failures and revise; run the final test only after fixing configuration
  and scoring rules. Split by document/topic when near-duplicate questions could cross sets. Tuning prompts against
  test answers destroys the original independence; disclose contamination and prepare a new held-out set if that
  happens. The small public fixtures here teach the process and are not an independent benchmark.


  For a full run, record configuration versions, corpus/fixture hashes, hardware and measurement scope. Predefine
  task-appropriate time, call-count and cost limits. p50/p95 describe measured latency under those conditions; few
  cases, a single run and different machines do not establish deployment performance. No provider is called here,
  so provider_cost=0; hardware and time are not free, and this does not predict real model cost, tokens or quality.'
why_it_matters_vi: Dùng tiêu chí và dữ liệu đại diện để biết hệ thống tốt ở đâu, còn lỗi ở đâu.
why_it_matters_en: Evaluation distinguishes a fluent demo from a trustworthy system that can improve.
study_steps_vi:
- Viết trước đáp án và quy ước từ chối cho câu hỏi có/không có bằng chứng.
- Sao chép toàn bộ ví dụ vào score_cases.py và chạy python score_cases.py bằng Python riêng; bản web không chạy
  mã này.
- Đối chiếu bốn ca lỗi, nhất là đúng tệp sai dòng và trích dẫn đúng nhưng đáp án sai.
- Ghi tử số/mẫu số từng phép chấm và giải thích vì sao 2/6 không đo chất lượng model.
- Nếu có bản sao repo, chạy mẫu dev bằng lệnh trong phần thực hành; chốt quyết định trước khi chạy test.
study_steps_en:
- Predefine answers and the abstention contract for questions with and without evidence.
- Copy the complete example into score_cases.py and run python score_cases.py in your own Python environment; the
  web page does not execute it.
- Inspect all four failing cases, especially the correct file with a wrong line and a real citation with a wrong
  answer.
- Record each metric numerator/denominator and explain why 2/6 does not measure model quality.
- If you have a repository copy, run the optional dev command in the practice plan; fix decisions before running
  test.
practice_plan:
  vi:
    task: Chạy bộ chấm trong ví dụ và lưu lỗi từng ca. Tùy chọn, tạo thư mục .build tại gốc repo nếu chưa có, rồi từ thư mục gốc repo chạy python samples/vi-document-assistant/evaluate_lab.py
      --split dev --output .build/evaluation-dev.json. Chỉ sau khi chốt cấu hình/tiêu chí, thay dev bằng test và
      đổi đầu ra thành .build/evaluation-test.json.
    deliverables:
    - Tệp Python cùng bảng kết quả 6 ca và các tỷ lệ có mẫu số.
    - Giải thích wrong_source, wrong_line, unsupported_answer và unknown_bad.
    - Nếu chạy mẫu repo, lưu JSON, phiên bản/cấu hình, mã băm dữ liệu, điều kiện đo và giới hạn kết luận.
    checkpoint: Bản gốc đạt 2/6, abstention đạt 1/2; bốn ca sai phải được ghi rõ. Nguồn có thật chưa đủ chứng minh
      đáp án đúng.
    stretch: Thêm đáp án diễn đạt lại đúng nghĩa để thấy giới hạn so khớp chuỗi; ghi tiêu chí chấm thủ công trước
      khi xem kết quả.
  en:
    task: Run the standalone scorer and save per-case failures. Optionally create the .build folder at the repository root if it does not exist, then run python samples/vi-document-assistant/evaluate_lab.py
      --split dev --output .build/evaluation-dev.json from the repository root. Only after fixing configuration/rubric,
      replace dev with test and use .build/evaluation-test.json as output.
    deliverables:
    - The Python file, six-case results and rates with denominators.
    - An explanation of wrong_source, wrong_line, unsupported_answer and unknown_bad.
    - For the optional repository run, save JSON, versions/configuration, data hashes, measurement conditions and
      limits.
    checkpoint: The original scores 2/6 and abstention 1/2; all four failures must be visible. An existing citation
      alone does not prove the answer.
    stretch: Add a correct paraphrase to expose exact-match limitations; define a manual rubric before inspecting
      results.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Đánh giá LLM và xây tập kiểm tra” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain llm evaluation and test sets to a new teammate?
  - Which assumption behind llm evaluation and test sets could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Evidence and abstention scoring / Chấm bằng chứng và từ chối
  code: "# Synthetic fixtures and fixed outputs: no LLM or network.\nimport json\n\ncorpus = {\"policy\": [\"Refunds\
    \ are allowed within 30 days.\", \"Support opens at 9.\"],\n          \"draft\": [\"Refunds are allowed within\
    \ 30 days.\"]}\nquote = corpus[\"policy\"][0]\ngold = {\"answer\": \"30 days\", \"source\": \"policy\", \"line\"\
    : 1, \"quote\": quote}\n# Define gold and expected abstention before examining candidate outputs.\ncases = [\n\
    \    (\"correct\", gold, dict(gold, abstain=False)),\n    (\"wrong_source\", gold, dict(gold, source=\"draft\"\
    , abstain=False)),\n    (\"wrong_line\", gold, dict(gold, line=2, abstain=False)),\n    (\"unsupported_answer\"\
    , gold, dict(gold, answer=\"90 days\", abstain=False)),\n    (\"unknown_bad\", None, dict(gold, abstain=False)),\n\
    \    (\"unknown_good\", None, {\"answer\": \"\", \"abstain\": True}),\n]\n\ndef score(expected, actual):\n \
    \   if expected is None:  # Unknown question: no supplied evidence answers it.\n        return {\"abstention\"\
    : actual.get(\"abstain\") is True,\n                \"empty_answer\": actual.get(\"answer\") == \"\",\n    \
    \            \"no_citation\": not any(actual.get(k) for k in (\"source\", \"line\", \"quote\"))}\n    lines\
    \ = corpus.get(actual.get(\"source\"), [])\n    line = actual.get(\"line\")\n    exists = (type(line) is int\
    \ and 1 <= line <= len(lines)\n              and actual.get(\"quote\") == lines[line - 1])\n    checks = {k:\
    \ actual.get(k) == expected[k] for k in (\"source\", \"line\", \"quote\", \"answer\")}\n    checks.update(citation_exists=exists,\
    \ answered=actual.get(\"abstain\") is False)\n    return checks\n\nresults, totals = [], {}\nfor case_id, expected,\
    \ actual in cases:\n    checks = score(expected, actual)\n    failures = [name for name, passed in checks.items()\
    \ if not passed]\n    results.append({\"id\": case_id, \"pass\": not failures, \"failures\": failures})\n  \
    \  for name, passed in checks.items():\n        numerator, denominator = totals.get(name, (0, 0))\n        totals[name]\
    \ = (numerator + int(passed), denominator + 1)\nprint(json.dumps(results, indent=2))\nprint({name: f\"{a}/{b}\"\
    \ for name, (a, b) in totals.items()})\nprint(f\"case_pass={sum(r['pass'] for r in results)}/{len(results)};\
    \ provider_cost=0\")\n"
  status: runnable
  purpose_vi: Phát hiện sai nguồn, sai dòng, đáp án không được hỗ trợ và trả lời khi thiếu bằng chứng.
  purpose_en: Detect wrong sources, wrong lines, unsupported answers and answers without evidence.
  setup: Python 3.11+; standard library only / chỉ thư viện chuẩn; python score_cases.py.
  expected_output: case_pass=2/6; provider_cost=0; source=3/4, line=3/4, quote=4/4, answer=3/4, citation_exists=3/4,
    answered=4/4, abstention=1/2, empty_answer=1/2, no_citation=1/2.
  edge_case_vi: unknown_bad dẫn câu có thật nhưng không liên quan; wrong_line dùng đúng tệp nhưng sai dòng; cả hai
    phải không đạt.
  edge_case_en: unknown_bad uses a real but irrelevant citation; wrong_line uses the right file at the wrong line;
    both must fail.
  explanation_vi: Câu trích và đáp án mẫu được cố định để kiểm tra bộ chấm. citation_exists kiểm tra vị trí văn
    bản, còn answer so khớp đáp án chuẩn; không có suy luận ngữ nghĩa tự động hoặc LLM.
  explanation_en: Fixed quotes and candidate answers test the scorer. citation_exists checks text location while
    answer matches a reference; there is no automated semantic reasoning or LLM.
resources:
- title: Lab A · Colab
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb
  language: vi
  kind: practice
  required: false
  purpose_vi: Mở rộng bài đánh giá thành 30 câu hỏi và so sánh truy xuất từ khóa với embedding trên Colab.
  purpose_en: Extend evaluation to 30 questions and compare lexical retrieval with embeddings on Colab.
  read_vi: Phân tích dev trước khi đọc test; trích dẫn tồn tại không chứng minh câu trả lời đúng về ngữ nghĩa.
  read_en: Analyze dev before examining test; citation existence does not prove semantic answer correctness.
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
- language: en
  title: "UK AISI Inspect: Tasks"
  url: https://inspect.aisi.org.uk/tasks.html
  kind: official
  required: false
  purpose_vi: "Tài liệu về cấu phần tác vụ đánh giá: dataset, solver, scorer và cấu hình tùy chọn."
  purpose_en: "Documentation on evaluation task components: dataset, solver, scorer, and optional configuration."
  read_vi: "Đọc Task Basics và Task Options; phác thảo dataset/solver/scorer cho bộ kiểm thử và định nghĩa rõ điểm số đại diện cho điều gì."
  read_en: "Read Task Basics and Task Options; sketch a dataset/solver/scorer for a test set and define what its score represents."
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
- exercise-17-genai-evaluation
review_item_ids:
- phase-17-genai-evaluation-genai-evaluation-1-recall
- phase-17-genai-evaluation-genai-evaluation-1-application
- phase-17-genai-evaluation-genai-evaluation-1-debug
- phase-17-genai-evaluation-genai-evaluation-1-interview
estimated_minutes: 60
completion_checklist:
- Chạy ví dụ và giải thích đúng bốn ca lỗi cùng từng mẫu số.
- Phân biệt kiểm tra vị trí trích dẫn với hỗ trợ ngữ nghĩa.
- Ghi quy tắc tách dev/test, điều kiện đo và giới hạn chi phí/độ trễ.
completion_criteria:
- Bản gốc cho 2/6, abstention 1/2 và danh sách lỗi theo ID.
- Không dùng tỷ lệ chung để che lỗi nhóm hoặc coi mock là phép đo model.
- Nếu dùng mẫu repo, lưu báo cáo dev và chỉ dùng test sau khi chốt quyết định.
common_mistakes:
- Chỉ kiểm tra tên tệp hoặc có trích dẫn mà bỏ dòng, câu trích và ý nghĩa đáp án.
- Xem đáp án test để sửa rồi vẫn gọi điểm là đánh giá độc lập.
- Công bố tỷ lệ thiếu mẫu số hoặc suy hiệu năng/chi phí model từ bài ngoại tuyến.
next_lessons:
- phase-17-genai-evaluation-genai-evaluation-2
- phase-17-genai-evaluation-genai-evaluation-3
review_question_vi: Nội dung cốt lõi của “Đánh giá LLM và xây tập kiểm tra” là gì?
review_question_en: Define llm evaluation and test sets in your own words. What are the input, transformation and
  output?
review_answer_vi: Tập kiểm tra cần đại diện nhiệm vụ và tiêu chí chấm có thể áp dụng nhất quán. Tách dữ liệu điều
  chỉnh khỏi đánh giá cuối, ghi phiên bản mô hình và cấu hình mỗi lần đo.
review_answer_en: A strong answer names the input, transformation, output and the context where llm evaluation and
  test sets is used. Relate it specifically to llm evaluation and test sets in lesson phase-17-genai-evaluation-genai-evaluation-1.
review_cards:
- id: phase-17-genai-evaluation-genai-evaluation-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đánh giá LLM và xây tập kiểm tra” là gì?
  question_en: Define llm evaluation and test sets in your own words. What are the input, transformation and output?
  answer_vi: Tập kiểm tra cần đại diện nhiệm vụ và tiêu chí chấm có thể áp dụng nhất quán. Tách dữ liệu điều chỉnh
    khỏi đánh giá cuối, ghi phiên bản mô hình và cấu hình mỗi lần đo.
  answer_en: A strong answer names the input, transformation, output and the context where llm evaluation and test
    sets is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-17-genai-evaluation-genai-evaluation-1-application
  type: application
  question_vi: Viết tiêu chí chấm và thử áp dụng cho một câu trả lời tốt, một câu trả lời sai.
  question_en: Write a small code example or design that applies llm evaluation and test sets to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Viết tiêu chí chấm và thử áp dụng cho một câu trả lời tốt, một câu trả lời sai”, cần
    lưu: tiêu chí chấm và kết quả trên tình huống đúng, sai. Chấm nhất quán và phân biệt chất lượng truy xuất với
    chất lượng câu trả lời.'
  answer_en: The llm evaluation and test sets example should have an explicit input, expected output and a way to
    run or verify it (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-17-genai-evaluation-genai-evaluation-1-debug
  type: debug
  question_vi: Khi làm bài “Đánh giá LLM và xây tập kiểm tra”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If llm evaluation and test sets produces a wrong result or a metric drops, what would you debug first?
  answer_vi: 'Trong bài “Đánh giá LLM và xây tập kiểm tra”, lỗi cần tránh là: chỉ dùng một điểm tổng để kết luận
    mọi thành phần đều tốt. Chấm nhất quán và phân biệt chất lượng truy xuất với chất lượng câu trả lời. Dùng ví
    dụ nhỏ để tìm bước đầu tiên có kết quả khác dự kiến.'
  answer_en: For llm evaluation and test sets, check inputs/shapes, preprocessing and the baseline first; then isolate
    the failure with a small test and error analysis (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-17-genai-evaluation-genai-evaluation-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đánh giá LLM và xây tập kiểm tra” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of llm evaluation and test sets?
  answer_vi: Bắt đầu từ nhiệm vụ “Viết tiêu chí chấm và thử áp dụng cho một câu trả lời tốt, một câu trả lời sai”.
    Trình bày kết quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại
    định nghĩa.
  answer_en: The answer about llm evaluation and test sets should cover assumptions, metrics/cost, limitations and
    how to reduce production risk (phase-17-genai-evaluation-genai-evaluation-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đánh giá LLM và xây tập kiểm tra / LLM evaluation and test sets

Đánh giá bắt đầu từ nhiệm vụ, dữ liệu và tiêu chí chấm được viết trước khi tối ưu. Với trợ lý tài liệu, tách kiểm tra tìm đúng nguồn khỏi kiểm tra câu trả lời. Ví dụ dưới dùng câu hỏi giả định về hạn hoàn tiền và câu ngoài dữ liệu về thời hạn bảo hành; các đầu ra cố định giúp kiểm tra bộ chấm, không đo LLM thật.

Mỗi đáp án có bằng chứng cần khớp tài liệu nguồn, số dòng tính từ 1, câu trích và nội dung trả lời theo đáp án chuẩn. Sai nguồn vẫn là lỗi dù câu trích giống nhau; đúng tệp nhưng sai dòng cũng phải bị phát hiện. citation_exists chỉ kiểm tra câu trích có thật tại vị trí đã chỉ. Nó không chứng minh nguồn có thẩm quyền hoặc câu trích hỗ trợ ý nghĩa của câu trả lời. unsupported_answer dẫn đúng câu về 30 ngày nhưng trả lời 90 ngày: kiểm tra trích dẫn vẫn đạt, kiểm tra đáp án không đạt. So khớp chuỗi ở đây nghiêm ngặt và có thể loại cách diễn đạt đúng khác; đánh giá ngữ nghĩa cần tiêu chí riêng và người kiểm tra một mẫu kết quả.

Khi câu hỏi không có bằng chứng trong kho, đáp án chuẩn của ví dụ yêu cầu abstain=True, câu trả lời rỗng và không dẫn nguồn. Một trích dẫn có thật nhưng không liên quan vẫn không trả lời được câu hỏi ngoài dữ liệu. Trong sản phẩm, có thể hiển thị lời từ chối hoặc hỏi thêm; trường answer rỗng là quy ước của bộ chấm này.

Ghi từng lỗi, số ca đạt/tổng ca và tỷ lệ theo nhóm. Ở đây có 4 ca cần trả lời và 2 ca ngoài dữ liệu: source, line, quote, answer có mẫu số 4; abstention có mẫu số 2; case_pass có mẫu số 6. Không thay ca lỗi bằng câu dễ hơn để tăng điểm. Tự kiểm tra: citation_exists đạt đã chứng minh câu trả lời đúng chưa? Chưa, ca unsupported_answer là phản ví dụ.

Dùng tập phát triển (dev) để phân tích lỗi và sửa; chỉ chạy tập đánh giá cuối (test) sau khi chốt cấu hình cùng tiêu chí. Chia theo tài liệu/chủ đề khi câu gần trùng có thể lọt sang hai tập. Không dùng đáp án test để sửa prompt rồi gọi đó là phép đo độc lập; nếu đã xem và điều chỉnh, ghi nhận rò rỉ và chuẩn bị tập giữ lại mới. Các fixture nhỏ, công khai trong bài chỉ dạy quy trình, không phải benchmark độc lập.

Với bài chạy đầy đủ, ghi phiên bản cấu hình, mã băm corpus/fixture, máy chạy và phạm vi đo. Đặt trước giới hạn thời gian, số lần gọi và chi phí phù hợp nhiệm vụ. p50/p95 chỉ mô tả độ trễ đã đo trong điều kiện đó; ít ca, một lần chạy và máy khác nhau không chứng minh hiệu năng triển khai. Ví dụ không gọi nhà cung cấp nên provider_cost=0, nhưng không có nghĩa máy tính hay thời gian là miễn phí; cũng không dự đoán chi phí/token hoặc chất lượng model thật.

## Thực hành

Chạy bộ chấm trong ví dụ và lưu lỗi từng ca. Tùy chọn, tạo thư mục .build tại gốc repo nếu chưa có, rồi từ thư mục gốc repo chạy python samples/vi-document-assistant/evaluate_lab.py --split dev --output .build/evaluation-dev.json. Chỉ sau khi chốt cấu hình/tiêu chí, thay dev bằng test và đổi đầu ra thành .build/evaluation-test.json. Lưu kết quả theo ID và các mẫu số. Mẫu repo có 12 ca tổng hợp trên kho tài liệu nhỏ sẵn có, chấm nguồn/dòng/câu trích và xuất độ trễ p50/p95 theo nearest-rank; đây là baseline tìm kiếm ngoại tuyến, không gọi LLM, không tự tối ưu và không phải benchmark model.
