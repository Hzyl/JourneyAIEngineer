---
lesson_id: phase-03-classical-ml-analysis-2
phase_id: phase-03-classical-ml
module_id: analysis
title_vi: Hiệu chỉnh xác suất dự đoán
title_en: Calibration
summary_vi: Hiệu chỉnh xác suất bằng hai bin, đối chiếu Brier và reliability trên test độc lập.
summary_en: Calibrate probabilities with two bins and compare Brier loss and reliability on independent
  test data.
learning_objectives: &id001
- Tính Brier 0.4525 trước và 0.3125 sau trên test.
- Báo support, mean probability và positive rate cho từng bin.
- Chứng minh ánh xạ chỉ fit từ calibration, không từ test.
learning_objectives_en: &id002
- Calculate test Brier 0.4525 before and 0.3125 after.
- Report support, mean probability and positive rate per bin.
- Show the mapping is fitted only on calibration, never test.
prerequisites:
- phase-03-classical-ml-analysis-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- calibration
- dataset
- feature
- baseline
- evaluation
- analysis
concept_notes_vi: 'Xác suất 0.8 được hiệu chỉnh tốt khi trong nhiều trường hợp nhận điểm gần 0.8, khoảng
  80% là dương. Accuracy chỉ xét nhãn sau ngưỡng; nó không cho biết xác suất có đáng tin. Brier nhị phân
  là trung bình (p-y)^2, nhỏ hơn là tốt hơn về dự đoán xác suất nhưng không riêng về calibration: còn
  phụ thuộc khả năng phân biệt và độ bất định.


  Reliability chia điểm thành bin, báo support, trung bình p và tỉ lệ nhãn dương. Hai bin cố định ở đây
  là [0,0.5) và [0.5,1]. Biên 0.5 thuộc bin cao; 1 cũng hợp lệ. Bin ít mẫu có tỉ lệ rất nhiễu. Bin rỗng
  được báo support=0, mean=None, rate=None; không tự coi là xác suất 0.


  Mô hình gốc đã được cố định từ train riêng, không minh họa huấn luyện trong bài. Fit histogram trên
  8 mẫu calibration: bin thấp có 1/4 dương, bin cao có 3/4 dương, nên ánh xạ 0.05 thành 0.25 và 0.95 thành
  0.75. Đánh giá trên 4 mẫu test khác, mỗi bin có 1/2 dương. Brier trước là (0.0025+0.9025+0.9025+0.0025)/4=0.4525;
  sau là (0.0625+0.5625+0.5625+0.0625)/4=0.3125.


  Đây là phép tính minh họa, không bảo đảm calibration luôn cải thiện test. Accuracy ở ngưỡng 0.5 vẫn
  là 0.5; các bin sau hiệu chỉnh vẫn lệch 0.25 so với tỉ lệ test 0.5. Không fit lại bằng nhãn test, không
  chọn số bin từ test; dùng validation hoặc cross-validation để chọn phương pháp. Sigmoid và isotonic
  trong scikit-learn là phương pháp khác; histogram đơn giản này không thay thế chúng.'
concept_notes_en: 'A probability of 0.8 is well calibrated when roughly 80% of many cases assigned scores
  near 0.8 are positive. Accuracy uses thresholded labels and cannot assess probability reliability. Binary
  Brier loss averages (p-y)^2; lower is better for probability prediction, but it also reflects discrimination
  and uncertainty, not calibration alone.


  Reliability bins report support, mean probability and positive fraction. This example fixes bins [0,0.5)
  and [0.5,1]. The boundary 0.5 belongs to the upper bin; 1 is valid. Small bins have noisy rates. Empty
  bins report support=0, mean=None, rate=None rather than an invented zero probability.


  Assume a base model already frozen from separate training data; training is not demonstrated here. Fit
  a histogram on eight calibration cases: the lower bin has 1/4 positives and the upper has 3/4, mapping
  0.05 to 0.25 and 0.95 to 0.75. Four different test cases have 1/2 positives in each bin. Original Brier
  is (0.0025+0.9025+0.9025+0.0025)/4=0.4525; calibrated Brier is (0.0625+0.5625+0.5625+0.0625)/4=0.3125.


  This worked fixture does not guarantee test improvement. Accuracy at 0.5 remains 0.5, and the calibrated
  bins still differ by 0.25 from the test rate 0.5. Never refit using test labels or choose bin counts
  on test; use validation or cross-validation for method selection. The simple histogram illustrates a
  mechanism; it is distinct from scikit-learn sigmoid and isotonic calibration.'
why_it_matters_vi: Hai mô hình có cùng nhãn dự đoán vẫn có độ tin cậy xác suất khác nhau; quyết định dựa
  trên rủi ro cần kiểm tra cả hai.
why_it_matters_en: Identical predicted labels can hide different probability reliability; risk-based decisions
  need both checks.
study_steps_vi:
- Đọc calibration curves và giới hạn Brier trong tài liệu.
- Tính tay tỉ lệ 1/4, 3/4 trên calibration.
- Chạy mã rồi so Brier và reliability trên test.
- Thử bin rỗng, NaN và biên 0.5; ghi lỗi đúng.
- Giải thích tại sao accuracy không đổi và không dùng nhãn test để fit.
study_steps_en:
- Read calibration curves and Brier limitations.
- Calculate calibration fractions 1/4 and 3/4 by hand.
- Run the code and compare test Brier and reliability.
- Try an empty bin, NaN and the 0.5 boundary; record the expected behavior.
- Explain unchanged accuracy and why test labels cannot fit the mapping.
practice_plan:
  vi:
    task: Fit hai bin trên calibration cố định rồi đánh giá test, lưu bảng trước/sau và giới hạn.
    deliverables:
    - Mã và stdout
    - Bảng support/mean/rate và hai Brier
    - Sơ đồ train → calibration → test cùng danh sách ID rời nhau
    checkpoint: Ánh xạ (0.25,0.75), test Brier 0.3125; không nói đã hiệu chỉnh hoàn hảo.
    stretch: 'Thử test nhãn [0,0,1,1]: Brier gốc 0.0025, sau 0.0625; giải thích hiệu chỉnh có thể tệ hơn.'
  en:
    task: Fit two fixed calibration bins and evaluate test; save before/after tables and limitations.
    deliverables:
    - Code and stdout
    - Support/mean/rate table and both Brier losses
    - Train → calibration → test diagram with disjoint IDs
    checkpoint: Mapping (0.25,0.75), test Brier 0.3125; do not claim perfect calibration.
    stretch: 'Try test labels [0,0,1,1]: original Brier 0.0025 and calibrated 0.0625; explain possible
      deterioration.'
interview_questions:
  vi:
  - Hai bin fit được xác suất nào?
  - Bin calibration rỗng xử lý thế nào?
  - Vì sao không fit bằng nhãn test?
  en:
  - Which probabilities do the two fitted bins produce?
  - What happens with an empty calibration bin?
  - Why not fit using test labels?
formulas:
- binary Brier = sum((probability-label)**2)/N
- bin positive rate = positive count / bin support
- bin mean probability = sum(probabilities in bin) / bin support
code_examples:
- language: python
  title: Two-bin calibration with independent test observations
  code: "from math import isfinite\n\n\ndef validate_probabilities(probabilities):\n    if not probabilities\
    \ or any(type(value) not in (int, float)\n                                or not isfinite(value) or\
    \ not 0 <= value <= 1\n                                for value in probabilities):\n        raise\
    \ ValueError(\"non-empty finite probabilities in [0, 1] required\")\n\n\ndef validate_pairs(labels,\
    \ probabilities):\n    validate_probabilities(probabilities)\n    if len(labels) != len(probabilities)\
    \ or any(\n        type(label) is not int or label not in (0, 1) for label in labels\n    ):\n   \
    \     raise ValueError(\"aligned integer binary labels required\")\n\n\ndef reliability(labels, probabilities):\n\
    \    validate_pairs(labels, probabilities)\n    rows = []\n    for upper in [False, True]:\n     \
    \   members = [(label, probability) for label, probability in zip(labels, probabilities)\n       \
    \            if (probability >= 0.5) == upper]\n        support = len(members)\n        rows.append({\n\
    \            \"support\": support,\n            \"mean\": sum(probability for _, probability in members)\
    \ / support if support else None,\n            \"rate\": sum(label for label, _ in members) / support\
    \ if support else None,\n        })\n    return rows\n\n\ndef fit_histogram(labels, probabilities):\n\
    \    rows = reliability(labels, probabilities)\n    if any(row[\"support\"] == 0 for row in rows):\n\
    \        raise ValueError(\"both calibration bins need observations\")\n    return tuple(row[\"rate\"\
    ] for row in rows)\n\n\ndef calibrate(probabilities, rates):\n    validate_probabilities(probabilities)\n\
    \    validate_probabilities(rates)\n    if len(rates) != 2:\n        raise ValueError(\"exactly two\
    \ bin rates required\")\n    return [rates[int(probability >= 0.5)] for probability in probabilities]\n\
    \n\ndef brier(labels, probabilities):\n    validate_pairs(labels, probabilities)\n    return sum((probability\
    \ - label) ** 2\n               for label, probability in zip(labels, probabilities)) / len(labels)\n\
    \n\ncalibration_ids = list(range(8))\ntest_ids = list(range(8, 12))\nassert set(calibration_ids).isdisjoint(test_ids)\n\
    calibration_labels = [0, 0, 0, 1, 0, 1, 1, 1]\ncalibration_probabilities = [0.05] * 4 + [0.95] * 4\n\
    rates = fit_histogram(calibration_labels, calibration_probabilities)\ntest_labels = [0, 1, 0, 1]\n\
    test_probabilities = [0.05, 0.05, 0.95, 0.95]\nadjusted = calibrate(test_probabilities, rates)\nprint(\"\
    calibration rates:\", rates)\nprint(\"test before:\", reliability(test_labels, test_probabilities))\n\
    print(\"test after:\", reliability(test_labels, adjusted))\nprint(f\"Brier before={brier(test_labels,\
    \ test_probabilities):.4f}\")\nprint(f\"Brier after={brier(test_labels, adjusted):.4f}\")\n"
  status: runnable
  purpose_vi: Tính Brier 0.4525 trước và 0.3125 sau trên test.
  purpose_en: Calculate test Brier 0.4525 before and 0.3125 after.
  setup: Python 3.11+; standard library only; Colab or python calibration.py.
  expected_output: 'calibration rates: (0.25, 0.75)

    test before: [{''support'': 2, ''mean'': 0.05, ''rate'': 0.5}, {''support'': 2, ''mean'': 0.95, ''rate'':
    0.5}]

    test after: [{''support'': 2, ''mean'': 0.25, ''rate'': 0.5}, {''support'': 2, ''mean'': 0.75, ''rate'':
    0.5}]

    Brier before=0.4525

    Brier after=0.3125'
  edge_case_vi: fit_histogram([0],[0.1]) gây ValueError do bin cao rỗng. reliability([0],[0.1]) vẫn báo
    bin rỗng bằng None. NaN, điểm >1, nhãn 2 bị từ chối.
  edge_case_en: fit_histogram([0],[0.1]) raises ValueError for an empty upper bin. reliability([0],[0.1])
    reports that bin with None. NaN, probabilities >1 and label 2 are rejected.
  explanation_vi: Brier đổi nhưng nhãn ở ngưỡng 0.5 không đổi. Đây là histogram minh họa trên dữ liệu
    tổng hợp, không phải benchmark hoặc mô hình production.
  explanation_en: Brier changes while threshold-0.5 labels do not. This synthetic histogram demonstration
    is neither a benchmark nor a production model.
  setup_vi: Dán mã vào một ô Colab hoặc lưu calibration.py và chạy python calibration.py bằng Python 3.11+.
    Không cần cài gói.
  setup_en: Paste into one Colab cell, or save calibration.py and run python calibration.py with Python
    3.11+. No packages needed.
resources:
- language: en
  title: scikit-learn Probability calibration
  url: https://scikit-learn.org/stable/modules/calibration.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc Calibration curves, giới hạn Brier và dữ liệu độc lập để fit calibrator.
  read_en: Read Calibration curves, the Brier caveat, and independent data for fitting calibrators.
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
- phase-03-classical-ml-analysis-2-recall
- phase-03-classical-ml-analysis-2-application
- phase-03-classical-ml-analysis-2-debug
- phase-03-classical-ml-analysis-2-interview
estimated_minutes: 60
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- Dùng accuracy thay cho calibration.
- Fit hoặc chọn số bin bằng test.
- Bỏ qua support hoặc nói Brier giảm bảo đảm calibration tốt hơn.
next_lessons:
- phase-03-classical-ml-analysis-3
- phase-03-classical-ml-analysis-4
review_question_vi: Brier nhỏ hơn có luôn nghĩa calibration tốt hơn?
review_question_en: Does lower Brier always mean better calibration?
review_answer_vi: Không. Brier còn phản ánh khả năng phân biệt và bất định; xem thêm mean/rate/support
  của reliability bins.
review_answer_en: No. Brier also reflects discrimination and uncertainty; inspect reliability-bin means,
  rates and support.
review_cards:
- id: phase-03-classical-ml-analysis-2-recall
  type: recall
  question_vi: Brier nhỏ hơn có luôn nghĩa calibration tốt hơn?
  question_en: Does lower Brier always mean better calibration?
  answer_vi: Không. Brier còn phản ánh khả năng phân biệt và bất định; xem thêm mean/rate/support của
    reliability bins.
  answer_en: No. Brier also reflects discrimination and uncertainty; inspect reliability-bin means, rates
    and support.
  hint_vi: So nguồn nhãn và mẫu số mỗi bin.
  hint_en: Check label provenance and each bin denominator.
- id: phase-03-classical-ml-analysis-2-application
  type: application
  question_vi: Hai bin fit được xác suất nào?
  question_en: Which probabilities do the two fitted bins produce?
  answer_vi: Calibration có 1/4 và 3/4 dương nên rates=(0.25,0.75). Dùng nguyên ánh xạ đó trên test cho
    Brier=0.3125.
  answer_en: Calibration has 1/4 and 3/4 positives, giving rates=(0.25,0.75). Reusing this mapping on
    test gives Brier=0.3125.
  hint_vi: So nguồn nhãn và mẫu số mỗi bin.
  hint_en: Check label provenance and each bin denominator.
- id: phase-03-classical-ml-analysis-2-debug
  type: debug
  question_vi: Bin calibration rỗng xử lý thế nào?
  question_en: What happens with an empty calibration bin?
  answer_vi: Ví dụ báo ValueError, không tự gán 0. Có thể thiết kế bin rộng hơn bằng dữ liệu phát triển,
    sau đó đánh giá lại test riêng.
  answer_en: The example raises ValueError rather than inventing zero. A wider-bin policy may be designed
    using development data, then evaluated on separate test data.
  hint_vi: So nguồn nhãn và mẫu số mỗi bin.
  hint_en: Check label provenance and each bin denominator.
- id: phase-03-classical-ml-analysis-2-interview
  type: interview
  question_vi: Vì sao không fit bằng nhãn test?
  question_en: Why not fit using test labels?
  answer_vi: Fit sẽ dùng đáp án của tập đánh giá, làm mất tính độc lập. Tách train/calibration/test, khóa
    phương pháp trước test và báo hạn chế vì mẫu nhỏ.
  answer_en: Fitting would use evaluation answers and destroy independence. Separate train/calibration/test,
    freeze the method before test and report small-sample limitations.
  hint_vi: So nguồn nhãn và mẫu số mỗi bin.
  hint_en: Check label provenance and each bin denominator.
completion_checklist_en: *id002
completion_criteria_en: *id002
common_mistakes_en:
- Use accuracy as calibration.
- Fit or select bin counts on test.
- Omit support or claim lower Brier guarantees better calibration.
---
# Hiệu chỉnh xác suất dự đoán / Calibration

Xác suất 0.8 được hiệu chỉnh tốt khi trong nhiều trường hợp nhận điểm gần 0.8, khoảng 80% là dương. Accuracy chỉ xét nhãn sau ngưỡng; nó không cho biết xác suất có đáng tin. Brier nhị phân là trung bình (p-y)^2, nhỏ hơn là tốt hơn về dự đoán xác suất nhưng không riêng về calibration: còn phụ thuộc khả năng phân biệt và độ bất định.

Reliability chia điểm thành bin, báo support, trung bình p và tỉ lệ nhãn dương. Hai bin cố định ở đây là [0,0.5) và [0.5,1]. Biên 0.5 thuộc bin cao; 1 cũng hợp lệ. Bin ít mẫu có tỉ lệ rất nhiễu. Bin rỗng được báo support=0, mean=None, rate=None; không tự coi là xác suất 0.

Mô hình gốc đã được cố định từ train riêng, không minh họa huấn luyện trong bài. Fit histogram trên 8 mẫu calibration: bin thấp có 1/4 dương, bin cao có 3/4 dương, nên ánh xạ 0.05 thành 0.25 và 0.95 thành 0.75. Đánh giá trên 4 mẫu test khác, mỗi bin có 1/2 dương. Brier trước là (0.0025+0.9025+0.9025+0.0025)/4=0.4525; sau là (0.0625+0.5625+0.5625+0.0625)/4=0.3125.

Đây là phép tính minh họa, không bảo đảm calibration luôn cải thiện test. Accuracy ở ngưỡng 0.5 vẫn là 0.5; các bin sau hiệu chỉnh vẫn lệch 0.25 so với tỉ lệ test 0.5. Không fit lại bằng nhãn test, không chọn số bin từ test; dùng validation hoặc cross-validation để chọn phương pháp. Sigmoid và isotonic trong scikit-learn là phương pháp khác; histogram đơn giản này không thay thế chúng.

A probability of 0.8 is well calibrated when roughly 80% of many cases assigned scores near 0.8 are positive. Accuracy uses thresholded labels and cannot assess probability reliability. Binary Brier loss averages (p-y)^2; lower is better for probability prediction, but it also reflects discrimination and uncertainty, not calibration alone.

Reliability bins report support, mean probability and positive fraction. This example fixes bins [0,0.5) and [0.5,1]. The boundary 0.5 belongs to the upper bin; 1 is valid. Small bins have noisy rates. Empty bins report support=0, mean=None, rate=None rather than an invented zero probability.

Assume a base model already frozen from separate training data; training is not demonstrated here. Fit a histogram on eight calibration cases: the lower bin has 1/4 positives and the upper has 3/4, mapping 0.05 to 0.25 and 0.95 to 0.75. Four different test cases have 1/2 positives in each bin. Original Brier is (0.0025+0.9025+0.9025+0.0025)/4=0.4525; calibrated Brier is (0.0625+0.5625+0.5625+0.0625)/4=0.3125.

This worked fixture does not guarantee test improvement. Accuracy at 0.5 remains 0.5, and the calibrated bins still differ by 0.25 from the test rate 0.5. Never refit using test labels or choose bin counts on test; use validation or cross-validation for method selection. The simple histogram illustrates a mechanism; it is distinct from scikit-learn sigmoid and isotonic calibration.
