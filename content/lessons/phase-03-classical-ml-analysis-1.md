---
lesson_id: phase-03-classical-ml-analysis-1
phase_id: phase-03-classical-ml
module_id: analysis
title_vi: Dữ liệu mất cân bằng lớp
title_en: Imbalanced data
summary_vi: Đo lớp hiếm, so baseline và chọn ngưỡng trên validation bằng chi phí FP/FN.
summary_en: Measure rare-class performance, compare a baseline, and choose thresholds on validation using
  FP/FN costs.
learning_objectives: &id001
- Tính đúng baseline accuracy=0.8, recall=0 và precision=None.
- Đối chiếu support, prevalence và TP/FP/TN/FN tại hai ngưỡng.
- Chọn ngưỡng từ validation, ghi chi phí và không dùng test để chọn.
learning_objectives_en: &id002
- Verify baseline accuracy=0.8, recall=0 and precision=None.
- Check support, prevalence and TP/FP/TN/FN at both thresholds.
- Select on validation, record costs, and keep test out of selection.
prerequisites:
- phase-03-classical-ml-evaluation-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- imbalanced
- data
- dataset
- feature
- baseline
- evaluation
- analysis
concept_notes_vi: 'Lớp 1 là lỗi máy. Có 2 lỗi trong 10 mẫu: support dương=2, support âm=8, prevalence=2/10=0.2.
  Baseline luôn đoán 0 có TN=8, FN=2, TP=FP=0: accuracy=0.8 nhưng recall=0. Precision không xác định vì
  không có dự đoán dương; bài này dùng None thay vì quy ước 0 của bài metrics trước.


  Ma trận dùng hàng nhãn thật, cột dự đoán theo [0,1]: [[TN,FP],[FN,TP]]. Recall dùng số lỗi thật TP+FN;
  precision dùng số cảnh báo TP+FP. Luôn báo số đếm và mẫu số cùng tỉ lệ.


  Ví dụ là validation tổng hợp, điểm số cố định. Ngưỡng 0.5 cho TP=1, FP=1, TN=7, FN=1; ngưỡng 0.3 cho
  TP=2, FP=2, TN=6, FN=0. Accuracy đều 0.8, precision đều 0.5 nhưng recall tăng từ 0.5 lên 1. Với chi
  phí bỏ sót 5 và báo nhầm 1, tổng chi phí giảm từ 6 xuống 2 trong fixture này.


  Chọn ngưỡng trên validation rồi khóa trước khi đánh giá test. Đặt trọng số lớp thay đổi hàm mất mát
  khi huấn luyện; lấy mẫu lại thay đổi dữ liệu train; đổi ngưỡng chỉ đổi nhãn từ điểm số đã có. Chỉ resample
  trong train từng fold, không cân bằng test. Kết quả 10 mẫu không chứng minh lợi ích ngoài thực tế; phải
  kiểm tra độ ổn định và prevalence triển khai.'
concept_notes_en: 'Class 1 means machine failure. Two failures among ten observations give positive support=2,
  negative support=8 and prevalence=0.2. An always-zero baseline has TN=8, FN=2, TP=FP=0: accuracy=0.8
  but recall=0. Precision is undefined because there are no predicted positives; this lesson uses None
  instead of the explicit zero convention in the earlier metrics lesson.


  With true labels as rows and predictions as columns in [0,1] order, the matrix is [[TN,FP],[FN,TP]].
  Recall divides by actual failures TP+FN; precision divides by alerts TP+FP. Report counts and denominators
  alongside rates.


  The fixture is synthetic validation data with fixed scores. Threshold 0.5 gives TP=1, FP=1, TN=7, FN=1;
  threshold 0.3 gives TP=2, FP=2, TN=6, FN=0. Both have accuracy=0.8 and precision=0.5, while recall rises
  from 0.5 to 1. At missed-failure cost 5 and false-alert cost 1, total fixture cost falls from 6 to 2.


  Choose the threshold on validation, then freeze it before test evaluation. Class weighting changes the
  training loss, resampling changes training observations, and thresholding changes decisions from existing
  scores. Resample only inside training folds; do not rebalance test. Ten observations cannot establish
  a deployment improvement; check stability and deployment prevalence.'
why_it_matters_vi: Bỏ sót lỗi máy và báo nhầm có chi phí khác nhau; accuracy bằng nhau có thể dẫn tới
  quyết định khác.
why_it_matters_en: Missed failures and false alerts have different costs; equal accuracy can conceal different
  decisions.
study_steps_vi:
- Đếm 2 mẫu dương trong 10 mẫu và lập baseline toàn âm.
- Đọc tài liệu precision/recall; ghi rõ quy ước None.
- Chạy ví dụ ở Colab hoặc Python, đối chiếu output.
- So chi phí 5*FN+FP trên validation tại 0.5 và 0.3.
- Khóa ngưỡng, ghi cách đánh giá test đại diện và trả lời thẻ ôn tập.
study_steps_en:
- Count two positives among ten and construct an all-negative baseline.
- Read precision/recall documentation and record the None convention.
- Run in Colab or Python and compare stdout.
- Compare validation cost 5*FN+FP at 0.5 and 0.3.
- Freeze the threshold, describe representative test evaluation, and answer the review cards.
practice_plan:
  vi:
    task: Lập báo cáo validation cho baseline và hai ngưỡng; chọn theo chi phí bỏ sót 5, báo nhầm 1.
    deliverables:
    - Mã và output của ba báo cáo
    - Bảng TP/FP/TN/FN, support, prevalence, precision, recall
    - Quyết định ngưỡng, quy ước None và kế hoạch test
    checkpoint: Chi phí hai ngưỡng lần lượt 6 và 2; đây là lựa chọn validation.
    stretch: 'Đổi chi phí FP thành 10: chi phí là 15 và 20; giải thích quyết định đổi.'
  en:
    task: Report the baseline and two validation thresholds; select using miss cost 5 and false-alert
      cost 1.
    deliverables:
    - Code and stdout for all three reports
    - TP/FP/TN/FN, support, prevalence, precision and recall table
    - Threshold decision, None convention and test plan
    checkpoint: Threshold costs are 6 and 2; this is validation selection.
    stretch: 'Change FP cost to 10: costs become 15 and 20; explain the changed decision.'
interview_questions:
  vi:
  - Ngưỡng nào có chi phí thấp hơn khi FN giá 5, FP giá 1?
  - Recall=None có phải recall=0 không?
  - Đổi ngưỡng khác cân bằng lớp thế nào?
  en:
  - Which threshold costs less when FN costs 5 and FP costs 1?
  - Does recall=None mean recall=0?
  - How does thresholding differ from balancing classes?
formulas:
- prevalence = (TP+FN)/N
- precision = TP/(TP+FP); recall = TP/(TP+FN); undefined -> None
- validation cost = 5*FN + FP
code_examples:
- language: python
  title: 'Rare failures: validation thresholds and baseline'
  code: "from math import isfinite\n\n\ndef binary_report(labels, scores, threshold):\n    if not labels\
    \ or len(labels) != len(scores):\n        raise ValueError(\"non-empty aligned inputs required\")\n\
    \    if any(type(label) is not int or label not in (0, 1) for label in labels):\n        raise ValueError(\"\
    integer binary labels required\")\n    if any(type(value) not in (int, float) or not isfinite(value)\n\
    \           or not 0 <= value <= 1 for value in [*scores, threshold]):\n        raise ValueError(\"\
    finite probabilities and threshold in [0, 1] required\")\n    counts = {\"tp\": 0, \"fp\": 0, \"tn\"\
    : 0, \"fn\": 0}\n    for label, score in zip(labels, scores):\n        predicted = int(score >= threshold)\n\
    \        key = {(1, 1): \"tp\", (0, 1): \"fp\", (0, 0): \"tn\", (1, 0): \"fn\"}\n        counts[key[label,\
    \ predicted]] += 1\n    positives = counts[\"tp\"] + counts[\"fn\"]\n    alerts = counts[\"tp\"] +\
    \ counts[\"fp\"]\n    return {\n        **counts,\n        \"support\": len(labels),\n        \"positives\"\
    : positives,\n        \"prevalence\": positives / len(labels),\n        \"accuracy\": (counts[\"tp\"\
    ] + counts[\"tn\"]) / len(labels),\n        \"precision\": counts[\"tp\"] / alerts if alerts else\
    \ None,\n        \"recall\": counts[\"tp\"] / positives if positives else None,\n    }\n\n\nvalidation_labels\
    \ = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]\nvalidation_scores = [0.8, 0.4, 0.7, 0.35, 0.2, 0.1, 0.1, 0.1,\
    \ 0.1, 0.1]\nfor name, scores, threshold in [\n    (\"baseline\", [0.0] * 10, 0.5),\n    (\"threshold=0.5\"\
    , validation_scores, 0.5),\n    (\"threshold=0.3\", validation_scores, 0.3),\n]:\n    report = binary_report(validation_labels,\
    \ scores, threshold)\n    print(name, report)\n    print(\"validation_cost:\", 5 * report[\"fn\"]\
    \ + report[\"fp\"])\n"
  status: runnable
  purpose_vi: Đối chiếu support, prevalence và TP/FP/TN/FN tại hai ngưỡng.
  purpose_en: Check support, prevalence and TP/FP/TN/FN at both thresholds.
  setup: Python 3.11+; standard library only; Colab or python imbalance.py.
  expected_output: 'baseline {''tp'': 0, ''fp'': 0, ''tn'': 8, ''fn'': 2, ''support'': 10, ''positives'':
    2, ''prevalence'': 0.2, ''accuracy'': 0.8, ''precision'': None, ''recall'': 0.0}

    validation_cost: 10

    threshold=0.5 {''tp'': 1, ''fp'': 1, ''tn'': 7, ''fn'': 1, ''support'': 10, ''positives'': 2, ''prevalence'':
    0.2, ''accuracy'': 0.8, ''precision'': 0.5, ''recall'': 0.5}

    validation_cost: 6

    threshold=0.3 {''tp'': 2, ''fp'': 2, ''tn'': 6, ''fn'': 0, ''support'': 10, ''positives'': 2, ''prevalence'':
    0.2, ''accuracy'': 0.8, ''precision'': 0.5, ''recall'': 1.0}

    validation_cost: 2'
  edge_case_vi: Nhãn [0], điểm [0.1], ngưỡng 0.5 trả precision=None, recall=None. Rỗng, lệch độ dài, nhãn
    2 hoặc NaN gây ValueError.
  edge_case_en: Labels [0], scores [0.1], threshold 0.5 return precision=None and recall=None. Empty/misaligned
    inputs, label 2 or NaN raise ValueError.
  explanation_vi: Điểm bằng ngưỡng được xếp dương. Ví dụ không fit mô hình; chỉ chọn giữa hai ngưỡng trên
    validation tổng hợp.
  explanation_en: A score equal to the threshold is positive. This does not fit a model; it compares two
    thresholds on synthetic validation data.
  setup_vi: Dán toàn bộ mã vào một ô Colab hoặc lưu imbalance.py rồi chạy python imbalance.py bằng Python
    3.11+. Không cần cài gói.
  setup_en: Paste into one Colab cell, or save imbalance.py and run python imbalance.py with Python 3.11+.
    No packages needed.
resources:
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measures-and-support
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc precision, recall và support; đối chiếu mẫu số và quy ước zero_division.
  read_en: Read precision, recall and support; check denominators and zero_division conventions.
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
- phase-03-classical-ml-analysis-1-recall
- phase-03-classical-ml-analysis-1-application
- phase-03-classical-ml-analysis-1-debug
- phase-03-classical-ml-analysis-1-interview
estimated_minutes: 60
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Dùng accuracy để che recall=0.
- Đổi ngưỡng bằng test hoặc resample test.
- Đồng nhất None với 0 và bỏ qua support.
next_lessons:
- phase-03-classical-ml-analysis-2
- phase-03-classical-ml-analysis-3
review_question_vi: Vì sao accuracy=0.8 chưa đủ?
review_question_en: Why is accuracy=0.8 insufficient?
review_answer_vi: 'Baseline bỏ sót cả 2 lỗi: FN=2, recall=0; không có cảnh báo nên precision=None.'
review_answer_en: 'The baseline misses both failures: FN=2 and recall=0; no alerts means precision=None.'
review_cards:
- id: phase-03-classical-ml-analysis-1-recall
  type: recall
  question_vi: Vì sao accuracy=0.8 chưa đủ?
  question_en: Why is accuracy=0.8 insufficient?
  answer_vi: 'Baseline bỏ sót cả 2 lỗi: FN=2, recall=0; không có cảnh báo nên precision=None.'
  answer_en: 'The baseline misses both failures: FN=2 and recall=0; no alerts means precision=None.'
  hint_vi: Đối chiếu số đếm và ranh giới validation/test.
  hint_en: Check counts and the validation/test boundary.
- id: phase-03-classical-ml-analysis-1-application
  type: application
  question_vi: Ngưỡng nào có chi phí thấp hơn khi FN giá 5, FP giá 1?
  question_en: Which threshold costs less when FN costs 5 and FP costs 1?
  answer_vi: 'Validation: 0.5 có chi phí 6; 0.3 có chi phí 2. Chọn 0.3 rồi khóa trước test.'
  answer_en: On validation, 0.5 costs 6 and 0.3 costs 2. Choose 0.3, then freeze it before test.
  hint_vi: Đối chiếu số đếm và ranh giới validation/test.
  hint_en: Check counts and the validation/test boundary.
- id: phase-03-classical-ml-analysis-1-debug
  type: debug
  question_vi: Recall=None có phải recall=0 không?
  question_en: Does recall=None mean recall=0?
  answer_vi: Không. None nghĩa không có nhãn dương nên mẫu số bằng 0; recall=0 nghĩa có mẫu dương nhưng
    không phát hiện được mẫu nào.
  answer_en: No. None means no positive labels and a zero denominator; zero recall means actual positives
    exist but none were detected.
  hint_vi: Đối chiếu số đếm và ranh giới validation/test.
  hint_en: Check counts and the validation/test boundary.
- id: phase-03-classical-ml-analysis-1-interview
  type: interview
  question_vi: Đổi ngưỡng khác cân bằng lớp thế nào?
  question_en: How does thresholding differ from balancing classes?
  answer_vi: Ngưỡng đổi quyết định từ điểm cố định; trọng số đổi loss và resampling đổi train. Không thao
    tác test để chọn phương án.
  answer_en: A threshold changes decisions from fixed scores; weights change loss and resampling changes
    training data. Do not modify test to select an approach.
  hint_vi: Đối chiếu số đếm và ranh giới validation/test.
  hint_en: Check counts and the validation/test boundary.
completion_checklist_en: *id002
completion_criteria_en: *id002
common_mistakes_en:
- Use accuracy to hide recall=0.
- Tune on test or resample test.
- Treat None as zero and omit support.
---
# Dữ liệu mất cân bằng lớp / Imbalanced data

Lớp 1 là lỗi máy. Có 2 lỗi trong 10 mẫu: support dương=2, support âm=8, prevalence=2/10=0.2. Baseline luôn đoán 0 có TN=8, FN=2, TP=FP=0: accuracy=0.8 nhưng recall=0. Precision không xác định vì không có dự đoán dương; bài này dùng None thay vì quy ước 0 của bài metrics trước.

Ma trận dùng hàng nhãn thật, cột dự đoán theo [0,1]: [[TN,FP],[FN,TP]]. Recall dùng số lỗi thật TP+FN; precision dùng số cảnh báo TP+FP. Luôn báo số đếm và mẫu số cùng tỉ lệ.

Ví dụ là validation tổng hợp, điểm số cố định. Ngưỡng 0.5 cho TP=1, FP=1, TN=7, FN=1; ngưỡng 0.3 cho TP=2, FP=2, TN=6, FN=0. Accuracy đều 0.8, precision đều 0.5 nhưng recall tăng từ 0.5 lên 1. Với chi phí bỏ sót 5 và báo nhầm 1, tổng chi phí giảm từ 6 xuống 2 trong fixture này.

Chọn ngưỡng trên validation rồi khóa trước khi đánh giá test. Đặt trọng số lớp thay đổi hàm mất mát khi huấn luyện; lấy mẫu lại thay đổi dữ liệu train; đổi ngưỡng chỉ đổi nhãn từ điểm số đã có. Chỉ resample trong train từng fold, không cân bằng test. Kết quả 10 mẫu không chứng minh lợi ích ngoài thực tế; phải kiểm tra độ ổn định và prevalence triển khai.

Class 1 means machine failure. Two failures among ten observations give positive support=2, negative support=8 and prevalence=0.2. An always-zero baseline has TN=8, FN=2, TP=FP=0: accuracy=0.8 but recall=0. Precision is undefined because there are no predicted positives; this lesson uses None instead of the explicit zero convention in the earlier metrics lesson.

With true labels as rows and predictions as columns in [0,1] order, the matrix is [[TN,FP],[FN,TP]]. Recall divides by actual failures TP+FN; precision divides by alerts TP+FP. Report counts and denominators alongside rates.

The fixture is synthetic validation data with fixed scores. Threshold 0.5 gives TP=1, FP=1, TN=7, FN=1; threshold 0.3 gives TP=2, FP=2, TN=6, FN=0. Both have accuracy=0.8 and precision=0.5, while recall rises from 0.5 to 1. At missed-failure cost 5 and false-alert cost 1, total fixture cost falls from 6 to 2.

Choose the threshold on validation, then freeze it before test evaluation. Class weighting changes the training loss, resampling changes training observations, and thresholding changes decisions from existing scores. Resample only inside training folds; do not rebalance test. Ten observations cannot establish a deployment improvement; check stability and deployment prevalence.
