---
lesson_id: phase-03-classical-ml-analysis-3
phase_id: phase-03-classical-ml
module_id: analysis
title_vi: Phân tích lỗi mô hình
title_en: Error analysis
summary_vi: Chia lỗi validation theo nhóm, báo mẫu số và biến quan sát thành giả thuyết có thể kiểm tra.
summary_en: Slice validation errors by group, report denominators, and turn observations into testable
  hypotheses.
learning_objectives: &id001
- Đối chiếu số đếm từng nhóm và báo cả support lẫn số dương.
- Xác nhận desktop/mobile có recall 1/0 và error rate 0.25/0.75.
- Ghi một giả thuyết kiểm tra được, giới hạn mẫu nhỏ và quy tắc log tối thiểu.
learning_objectives_en: &id002
- Verify group counts and report support and actual positives.
- Confirm desktop/mobile recall 1/0 and error rate 0.25/0.75.
- Record a testable hypothesis, tiny-slice limits and minimal logging rules.
prerequisites:
- phase-03-classical-ml-analysis-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- error
- analysis
- dataset
- feature
- baseline
- evaluation
concept_notes_vi: 'Một tỉ lệ lỗi tổng thể có thể che khác biệt giữa nhóm. Chọn lát cắt có lý do nghiệp
  vụ trước khi xem kết quả, như kênh desktop/mobile. Ghi nhãn dương=1, số mẫu N, số dương thật TP+FN,
  số cảnh báo TP+FP, TP/FP/TN/FN, precision, recall và error rate=(FP+FN)/N. Không so recall mà bỏ qua
  số dương thật.


  Fixture validation có 8 mẫu. Desktop có N=4, dương=2, TP=2, FP=1, TN=1, FN=0: precision=2/3, recall=1,
  error rate=0.25. Mobile có N=4, dương=2, TP=0, FP=1, TN=1, FN=2: precision=0, recall=0, error rate=0.75.
  Tổng là TP=2, FP=2, TN=2, FN=2, precision=recall=0.5 và error rate=0.5.


  Chênh lệch này chỉ là quan sát của fixture. Hai mẫu dương mỗi nhóm là mẫu số rất nhỏ; một FN đổi thành
  TP làm recall mobile tăng 0.5. Không kết luận kênh gây lỗi hay có phân biệt đối xử chỉ từ bảng. Kiểm
  tra chất lượng nhãn, thiếu dữ liệu, thời điểm, phân bố đặc trưng và độ bất định; nhiều lát cắt hậu nghiệm
  dễ tạo kết quả ngẫu nhiên.


  Dùng lỗi validation để đề xuất sửa preprocessing hoặc thu thêm dữ liệu, kiểm tra trên holdout mới trước
  khi kết luận. Khi xem test cuối cùng mà quyết định sửa, cần test mới độc lập. Nhật ký chỉ lưu ID giả
  danh, nhóm được phép, nhãn/dự đoán và loại lỗi cần thiết; không ghi nội dung riêng tư, tên, email hoặc
  dữ liệu thô. Giới hạn truy cập và thời gian giữ log. None biểu diễn precision/recall không có mẫu số,
  không phải tỉ lệ 0.'
concept_notes_en: 'An aggregate error rate can hide group differences. Choose slices for an operational
  reason before inspecting outcomes, such as desktop/mobile channels. Declare positive label=1 and report
  N, actual positives TP+FN, alerts TP+FP, TP/FP/TN/FN, precision, recall and error rate=(FP+FN)/N. Do
  not compare recall without positive denominators.


  This eight-case validation fixture has desktop N=4, positives=2, TP=2, FP=1, TN=1, FN=0: precision=2/3,
  recall=1 and error rate=0.25. Mobile has N=4, positives=2, TP=0, FP=1, TN=1, FN=2: precision=0, recall=0
  and error rate=0.75. Overall TP=2, FP=2, TN=2, FN=2 gives precision=recall=0.5 and error rate=0.5.


  The gap is only a fixture observation. Two positives per group is a tiny denominator; changing one mobile
  FN into TP raises its recall by 0.5. The table alone establishes neither channel causation nor discrimination.
  Investigate label quality, missingness, time, feature distributions and uncertainty; many post-hoc slices
  can produce chance findings.


  Use validation errors to propose preprocessing fixes or additional data, then verify on a fresh holdout.
  A change motivated by final test results needs a new independent test. Logs should contain only pseudonymous
  IDs, permitted groups, labels/predictions and necessary error categories; omit private text, names,
  emails and raw records. Limit access and retention. None means an undefined precision/recall denominator,
  not a measured zero rate.'
why_it_matters_vi: Bảng theo nhóm giúp chọn việc điều tra cụ thể; mẫu số và giới hạn tránh biến vài lỗi
  thành kết luận quá mức.
why_it_matters_en: Group reports guide concrete investigation; denominators and limitations prevent overclaiming
  from a few errors.
study_steps_vi:
- Vẽ ma trận riêng cho desktop và mobile.
- Đọc Fairlearn về giới hạn metric trong bối cảnh thực tế.
- Chạy mã trên validation tổng hợp, so output với tính tay.
- Đổi một FN mobile thành TP và đo mức thay đổi recall.
- Viết giả thuyết thiếu dữ liệu cần kiểm tra, kế hoạch holdout và log không chứa dữ liệu riêng tư.
study_steps_en:
- Draw separate desktop and mobile confusion matrices.
- Read Fairlearn on contextual limitations of metrics.
- Run the synthetic validation fixture and compare hand calculations.
- Change one mobile FN to TP and measure the recall change.
- Write a missing-data hypothesis, holdout plan and privacy-conscious log policy.
practice_plan:
  vi:
    task: Lập báo cáo lỗi theo kênh và đề xuất kiểm tra tỉ lệ thiếu đặc trưng trên mobile bằng validation.
    deliverables:
    - Mã và bảng tổng/từng nhóm
    - Ba ID lỗi mobile giả danh và loại FP/FN
    - Giả thuyết, kiểm tra tiếp theo, giới hạn mẫu nhỏ và chính sách log
    checkpoint: Mobile có 2 FN, 1 FP; chưa biết nguyên nhân và chưa chứng minh phân biệt đối xử.
    stretch: 'Thêm nhóm chỉ có nhãn âm: recall=None; giải thích vì sao không xếp nhóm này tốt nhất.'
  en:
    task: Report channel errors and propose checking mobile feature missingness on validation.
    deliverables:
    - Code and overall/per-group tables
    - Three pseudonymous mobile error IDs with FP/FN types
    - Hypothesis, next check, tiny-slice limits and log policy
    checkpoint: Mobile has 2 FN and 1 FP; the cause and discrimination have not been established.
    stretch: 'Add a group with only negative labels: recall=None; explain why it cannot be ranked as best.'
interview_questions:
  vi:
  - Ba lỗi mobile là gì?
  - 'Nhóm không có dương cho recall=None: sửa dữ liệu không?'
  - Có thể nói mobile gây lỗi hoặc mô hình phân biệt đối xử không?
  en:
  - What are the three mobile errors?
  - 'A group without positives has recall=None: should its data be changed?'
  - Can we claim mobile causes errors or that the model discriminates?
formulas:
- error rate = (FP+FN)/N
- precision = TP/(TP+FP); recall = TP/(TP+FN)
- one corrected FN changes recall by 1/(TP+FN)
code_examples:
- language: python
  title: Validation error slices with explicit denominators
  code: "def group_report(labels, predicted):\n    if not labels or len(labels) != len(predicted):\n \
    \       raise ValueError(\"non-empty aligned labels required\")\n    if any(type(label) is not int\
    \ or label not in (0, 1)\n           for label in [*labels, *predicted]):\n        raise ValueError(\"\
    integer binary labels required\")\n    counts = {\"tp\": 0, \"fp\": 0, \"tn\": 0, \"fn\": 0}\n   \
    \ names = {(1, 1): \"tp\", (0, 1): \"fp\", (0, 0): \"tn\", (1, 0): \"fn\"}\n    for truth, guess in\
    \ zip(labels, predicted):\n        counts[names[truth, guess]] += 1\n    positives = counts[\"tp\"\
    ] + counts[\"fn\"]\n    alerts = counts[\"tp\"] + counts[\"fp\"]\n    return {\n        **counts,\n\
    \        \"support\": len(labels),\n        \"positives\": positives,\n        \"alerts\": alerts,\n\
    \        \"precision\": counts[\"tp\"] / alerts if alerts else None,\n        \"recall\": counts[\"\
    tp\"] / positives if positives else None,\n        \"error_rate\": (counts[\"fp\"] + counts[\"fn\"\
    ]) / len(labels),\n    }\n\n\ndef slice_reports(labels, predicted, groups):\n    overall = group_report(labels,\
    \ predicted)\n    if len(groups) != len(labels) or any(type(group) is not str or not group.strip()\n\
    \                                        for group in groups):\n        raise ValueError(\"aligned\
    \ non-empty group names required\")\n    reports = {}\n    for group in sorted(set(groups)):\n   \
    \     indices = [index for index, value in enumerate(groups) if value == group]\n        reports[group]\
    \ = group_report([labels[index] for index in indices],\n                                      [predicted[index]\
    \ for index in indices])\n    return overall, reports\n\n\nvalidation_labels = [1, 1, 0, 0, 1, 1,\
    \ 0, 0]\nvalidation_predictions = [1, 1, 1, 0, 0, 0, 1, 0]\ngroups = [\"desktop\"] * 4 + [\"mobile\"\
    ] * 4\noverall, reports = slice_reports(validation_labels, validation_predictions, groups)\nfor group,\
    \ report in [(\"overall\", overall), *reports.items()]:\n    print(group, report)\n# Synthetic IDs\
    \ only; do not copy raw private records into error logs.\nerror_log = [(f\"case-{index + 1}\", groups[index],\
    \ \"FN\" if truth == 1 else \"FP\")\n             for index, (truth, guess) in enumerate(zip(validation_labels,\
    \ validation_predictions))\n             if truth != guess]\nprint(\"errors:\", error_log)\n"
  status: runnable
  purpose_vi: Đối chiếu số đếm từng nhóm và báo cả support lẫn số dương.
  purpose_en: Verify group counts and report support and actual positives.
  setup: Python 3.11+; standard library only; Colab or python errors.py.
  expected_output: 'overall {''tp'': 2, ''fp'': 2, ''tn'': 2, ''fn'': 2, ''support'': 8, ''positives'':
    4, ''alerts'': 4, ''precision'': 0.5, ''recall'': 0.5, ''error_rate'': 0.5}

    desktop {''tp'': 2, ''fp'': 1, ''tn'': 1, ''fn'': 0, ''support'': 4, ''positives'': 2, ''alerts'':
    3, ''precision'': 0.6666666666666666, ''recall'': 1.0, ''error_rate'': 0.25}

    mobile {''tp'': 0, ''fp'': 1, ''tn'': 1, ''fn'': 2, ''support'': 4, ''positives'': 2, ''alerts'':
    1, ''precision'': 0.0, ''recall'': 0.0, ''error_rate'': 0.75}

    errors: [(''case-3'', ''desktop'', ''FP''), (''case-5'', ''mobile'', ''FN''), (''case-6'', ''mobile'',
    ''FN''), (''case-7'', ''mobile'', ''FP'')]'
  edge_case_vi: group_report([0],[0]) trả precision=None, recall=None, error_rate=0. Nhóm thiếu/rỗng,
    lệch độ dài hoặc nhãn 2 gây ValueError.
  edge_case_en: group_report([0],[0]) returns precision=None, recall=None, error_rate=0. Missing/blank
    groups, unequal lengths or label 2 raise ValueError.
  explanation_vi: Nhóm trong ví dụ là kênh giả lập; không dùng dữ liệu người thật. Các tỉ lệ chỉ mô tả
    mẫu, chưa suy ra nguyên nhân hoặc fairness.
  explanation_en: Groups are synthetic channels; no personal data is used. Rates describe this sample
    and establish neither causes nor fairness.
  setup_vi: Dán mã vào một ô Colab hoặc lưu errors.py rồi chạy python errors.py bằng Python 3.11+. Không
    cần cài gói.
  setup_en: Paste into one Colab cell, or save errors.py and run python errors.py with Python 3.11+. No
    packages needed.
resources:
- language: en
  title: 'Fairlearn: Common fairness metrics'
  url: https://fairlearn.org/main/user_guide/assessment/common_fairness_metrics.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc các hạn chế khi diễn giải metric fairness và vai trò của bối cảnh.
  read_en: Read limitations of fairness-metric interpretations and the role of context.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
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
exercise_ids:
- exercise-3-analysis
review_item_ids:
- phase-03-classical-ml-analysis-3-recall
- phase-03-classical-ml-analysis-3-application
- phase-03-classical-ml-analysis-3-debug
- phase-03-classical-ml-analysis-3-interview
estimated_minutes: 60
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Bỏ mẫu số khi so các nhóm nhỏ.
- Kết luận nhân quả hoặc phân biệt đối xử từ một chênh lệch.
- Chỉnh mô hình theo test rồi báo lại cùng test; log dữ liệu riêng tư.
next_lessons:
- phase-03-classical-ml-analysis-4
- phase-04-deep-learning-pytorch-core-1
review_question_vi: Vì sao phải báo số dương cùng recall?
review_question_en: Why report actual positives alongside recall?
review_answer_vi: Recall chia cho số dương thật. Mobile có 2 dương; chỉ một lỗi sửa đúng đã đổi recall
  0.5, nên tỉ lệ rất không ổn định.
review_answer_en: Recall divides by actual positives. Mobile has two; correcting just one miss changes
  recall by 0.5, making the rate unstable.
review_cards:
- id: phase-03-classical-ml-analysis-3-recall
  type: recall
  question_vi: Vì sao phải báo số dương cùng recall?
  question_en: Why report actual positives alongside recall?
  answer_vi: Recall chia cho số dương thật. Mobile có 2 dương; chỉ một lỗi sửa đúng đã đổi recall 0.5,
    nên tỉ lệ rất không ổn định.
  answer_en: Recall divides by actual positives. Mobile has two; correcting just one miss changes recall
    by 0.5, making the rate unstable.
  hint_vi: Đếm lỗi, kiểm tra mẫu số và giới hạn suy luận.
  hint_en: Count errors and inspect denominators and inference limits.
- id: phase-03-classical-ml-analysis-3-application
  type: application
  question_vi: Ba lỗi mobile là gì?
  question_en: What are the three mobile errors?
  answer_vi: 'case-5 và case-6 là FN, case-7 là FP: error rate=3/4, precision=0/1, recall=0/2.'
  answer_en: 'case-5 and case-6 are FN; case-7 is FP: error rate=3/4, precision=0/1 and recall=0/2.'
  hint_vi: Đếm lỗi, kiểm tra mẫu số và giới hạn suy luận.
  hint_en: Count errors and inspect denominators and inference limits.
- id: phase-03-classical-ml-analysis-3-debug
  type: debug
  question_vi: 'Nhóm không có dương cho recall=None: sửa dữ liệu không?'
  question_en: 'A group without positives has recall=None: should its data be changed?'
  answer_vi: Không sửa nhãn để tạo metric. Báo support và số dương 0, giữ None; thu thêm mẫu đại diện
    nếu cần đánh giá recall.
  answer_en: Do not alter labels to manufacture a metric. Report support and zero positives, keep None,
    and collect representative observations if recall assessment is needed.
  hint_vi: Đếm lỗi, kiểm tra mẫu số và giới hạn suy luận.
  hint_en: Count errors and inspect denominators and inference limits.
- id: phase-03-classical-ml-analysis-3-interview
  type: interview
  question_vi: Có thể nói mobile gây lỗi hoặc mô hình phân biệt đối xử không?
  question_en: Can we claim mobile causes errors or that the model discriminates?
  answer_vi: Không từ bảng này. Cần xem nhãn, dữ liệu thiếu, bối cảnh tác động và bất định; đề xuất kiểm
    tra validation rồi dùng holdout mới, tránh log thông tin riêng tư.
  answer_en: Not from this table. Inspect labels, missingness, impact context and uncertainty; test a
    validation hypothesis and then a fresh holdout while avoiding private logs.
  hint_vi: Đếm lỗi, kiểm tra mẫu số và giới hạn suy luận.
  hint_en: Count errors and inspect denominators and inference limits.
completion_checklist_en: *id002
completion_criteria_en: *id002
common_mistakes_en:
- Omit denominators when comparing tiny groups.
- Infer causation or discrimination from one gap.
- Tune from test and reuse that test; log private records.
---
# Phân tích lỗi mô hình / Error analysis

Một tỉ lệ lỗi tổng thể có thể che khác biệt giữa nhóm. Chọn lát cắt có lý do nghiệp vụ trước khi xem kết quả, như kênh desktop/mobile. Ghi nhãn dương=1, số mẫu N, số dương thật TP+FN, số cảnh báo TP+FP, TP/FP/TN/FN, precision, recall và error rate=(FP+FN)/N. Không so recall mà bỏ qua số dương thật.

Fixture validation có 8 mẫu. Desktop có N=4, dương=2, TP=2, FP=1, TN=1, FN=0: precision=2/3, recall=1, error rate=0.25. Mobile có N=4, dương=2, TP=0, FP=1, TN=1, FN=2: precision=0, recall=0, error rate=0.75. Tổng là TP=2, FP=2, TN=2, FN=2, precision=recall=0.5 và error rate=0.5.

Chênh lệch này chỉ là quan sát của fixture. Hai mẫu dương mỗi nhóm là mẫu số rất nhỏ; một FN đổi thành TP làm recall mobile tăng 0.5. Không kết luận kênh gây lỗi hay có phân biệt đối xử chỉ từ bảng. Kiểm tra chất lượng nhãn, thiếu dữ liệu, thời điểm, phân bố đặc trưng và độ bất định; nhiều lát cắt hậu nghiệm dễ tạo kết quả ngẫu nhiên.

Dùng lỗi validation để đề xuất sửa preprocessing hoặc thu thêm dữ liệu, kiểm tra trên holdout mới trước khi kết luận. Khi xem test cuối cùng mà quyết định sửa, cần test mới độc lập. Nhật ký chỉ lưu ID giả danh, nhóm được phép, nhãn/dự đoán và loại lỗi cần thiết; không ghi nội dung riêng tư, tên, email hoặc dữ liệu thô. Giới hạn truy cập và thời gian giữ log. None biểu diễn precision/recall không có mẫu số, không phải tỉ lệ 0.

An aggregate error rate can hide group differences. Choose slices for an operational reason before inspecting outcomes, such as desktop/mobile channels. Declare positive label=1 and report N, actual positives TP+FN, alerts TP+FP, TP/FP/TN/FN, precision, recall and error rate=(FP+FN)/N. Do not compare recall without positive denominators.

This eight-case validation fixture has desktop N=4, positives=2, TP=2, FP=1, TN=1, FN=0: precision=2/3, recall=1 and error rate=0.25. Mobile has N=4, positives=2, TP=0, FP=1, TN=1, FN=2: precision=0, recall=0 and error rate=0.75. Overall TP=2, FP=2, TN=2, FN=2 gives precision=recall=0.5 and error rate=0.5.

The gap is only a fixture observation. Two positives per group is a tiny denominator; changing one mobile FN into TP raises its recall by 0.5. The table alone establishes neither channel causation nor discrimination. Investigate label quality, missingness, time, feature distributions and uncertainty; many post-hoc slices can produce chance findings.

Use validation errors to propose preprocessing fixes or additional data, then verify on a fresh holdout. A change motivated by final test results needs a new independent test. Logs should contain only pseudonymous IDs, permitted groups, labels/predictions and necessary error categories; omit private text, names, emails and raw records. Limit access and retention. None means an undefined precision/recall denominator, not a measured zero rate.
