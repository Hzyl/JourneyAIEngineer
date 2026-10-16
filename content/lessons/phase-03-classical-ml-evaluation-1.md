---
lesson_id: phase-03-classical-ml-evaluation-1
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Thước đo cho phân loại
title_en: Classification metrics
summary_vi: Tính accuracy, precision, recall và F1 từ TP/FP/TN/FN; nhận ra accuracy có thể che giấu việc bỏ
  sót lớp hiếm.
summary_en: Compute accuracy, precision, recall and F1 from TP/FP/TN/FN; see how accuracy can hide missed rare
  cases.
learning_objectives:
- Xác định lớp dương và đếm TP/FP/TN/FN.
- Tính bốn thước đo và xử lý mẫu số bằng 0.
- So sánh với baseline toàn âm và chọn thước đo theo chi phí lỗi.
learning_objectives_en:
- Declare the positive class and count TP/FP/TN/FN.
- Calculate four metrics and handle zero denominators.
- Compare an all-negative baseline and choose metrics by error cost.
prerequisites:
- phase-03-classical-ml-preprocessing-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- positive class
- confusion matrix
- precision
- recall
- F1
- class imbalance
concept_notes_vi: |-
  Lớp 1 là thư rác, lớp 0 là thư hợp lệ. TP: thư rác bị chặn; FP: thư hợp lệ bị chặn; TN: thư hợp lệ được giữ; FN: thư rác lọt qua. Ma trận có hàng là nhãn thật, cột là dự đoán, thứ tự [0, 1]: [[TN, FP], [FN, TP]].

  Accuracy dùng tất cả mẫu; precision hỏi trong các thư bị chặn có bao nhiêu thư rác; recall hỏi phát hiện được bao nhiêu thư rác thật. F1 là trung bình điều hòa của precision và recall, không tính TN và không biểu diễn mọi chi phí kinh doanh.

  Ví dụ 10 thư có 2 thư rác. Mô hình có TP=1, FP=1, TN=7, FN=1, đạt accuracy=0.8 và precision=recall=F1=0.5. Baseline toàn âm cũng accuracy=0.8 nhưng recall=0.

  Không có dự đoán dương thì precision không xác định; không có nhãn dương thì recall không xác định; F1 không xác định khi TP=FP=FN=0. Mã quy ước trả 0 cho mẫu số 0, tương ứng lựa chọn zero_division=0 trong scikit-learn; cần ghi quy ước, không hiểu số 0 là phép chia hợp lệ.
concept_notes_en: |-
  Class 1 is spam and class 0 is legitimate mail. TP is blocked spam; FP is blocked legitimate mail; TN is retained legitimate mail; FN is missed spam. With true labels as rows, predictions as columns and order [0, 1], the matrix is [[TN, FP], [FN, TP]].

  Accuracy uses every case; precision asks how much blocked mail is spam; recall asks how much actual spam was found. F1 is the harmonic mean of precision and recall, ignores TN and does not encode every business cost.

  The 10-mail fixture has 2 spam messages. TP=1, FP=1, TN=7, FN=1 gives accuracy=0.8 and precision=recall=F1=0.5. The all-negative baseline also has accuracy=0.8 but recall=0.

  Precision is undefined without predicted positives; recall is undefined without actual positives; F1 is undefined when TP=FP=FN=0. This code returns 0 for zero denominators, matching the explicit scikit-learn choice zero_division=0. Report the convention rather than treating 0 as a valid division.
why_it_matters_vi: Chặn nhầm thư hợp lệ và bỏ sót thư rác có hậu quả khác nhau; một accuracy cao chưa đủ để
  quyết định.
why_it_matters_en: Blocking legitimate mail and missing spam have different consequences; high accuracy alone
  cannot decide.
study_steps_vi:
- Vẽ ma trận [[TN, FP], [FN, TP]] và tính tay bốn thước đo.
- Đọc mục Precision, recall and F-measures trong tài liệu chính thức.
- Mở hướng dẫn Practice Lab; tải mã hoặc chép vào Colab/Python 3.11, chạy và đối chiếu output.
- Chạy baseline toàn âm, rồi thử dữ liệu toàn âm để thấy mẫu số 0.
- Lưu bảng kết quả, quy ước mẫu số 0 và lý do ưu tiên precision hay recall.
study_steps_en:
- Draw [[TN, FP], [FN, TP]] and calculate all four metrics by hand.
- Read Precision, recall and F-measures in the official reference.
- Open the Practice Lab guide; download the code or copy it into Colab/Python 3.11, run and compare the output.
- Run the all-negative baseline, then all-negative labels to expose zero denominators.
- Save the results, zero-denominator convention and your reason for prioritizing precision or recall.
practice_plan:
  vi:
    task: So sánh bộ lọc thư rác và baseline toàn âm trên cùng 10 nhãn; giải thích vì sao cùng accuracy nhưng
      khác recall.
    deliverables:
    - Mã chạy được và output bốn thước đo của hai cách dự đoán
    - Ma trận nhầm lẫn với lớp dương ghi rõ
    - Ghi chú mẫu số 0 và chi phí FP/FN
    checkpoint: Tự tính được TP=1, FP=1, TN=7, FN=1 và F1=0.5.
    stretch: Đổi một FN thành TP; dự đoán rồi kiểm tra recall và precision thay đổi ra sao.
  en:
    task: Compare the spam filter and all-negative baseline on the same 10 labels; explain equal accuracy but
      different recall.
    deliverables:
    - Runnable code and four metrics for both prediction sets
    - Confusion matrix with the positive class declared
    - Zero-denominator convention and FP/FN costs
    checkpoint: Calculate TP=1, FP=1, TN=7, FN=1 and F1=0.5 yourself.
    stretch: Change one FN to TP; predict and check how recall and precision change.
interview_questions:
  vi:
  - TP=1, FP=1, TN=7, FN=1 cho accuracy và F1 nào?
  - 'Precision gặp chia 0 khi dự đoán toàn âm: sửa thế nào?'
  - Nếu chặn nhầm thư hợp lệ rất tốn kém, chọn thước đo ra sao?
  en:
  - With TP=1, FP=1, TN=7, FN=1, what are accuracy and F1?
  - 'Precision divides by zero for all-negative predictions: what should you do?'
  - If blocking legitimate mail is costly, how should you choose metrics?
formulas:
- accuracy = (TP + TN) / N
- precision = TP / (TP + FP)
- recall = TP / (TP + FN)
- 'F1 = 2TP / (2TP + FP + FN); zero denominator: report convention'
code_examples:
- language: python
  title: Spam filter versus an all-negative baseline
  code: |
    def binary_metrics(actual, predicted):
        if not actual or len(actual) != len(predicted):
            raise ValueError("non-empty aligned labels are required")
        if any(label not in (0, 1) for label in [*actual, *predicted]):
            raise ValueError("labels must be 0 or 1")
        true_positive = false_positive = true_negative = false_negative = 0
        for truth, guess in zip(actual, predicted):
            if truth == 1 and guess == 1:
                true_positive += 1
            elif truth == 0 and guess == 1:
                false_positive += 1
            elif truth == 0 and guess == 0:
                true_negative += 1
            else:
                false_negative += 1
        def divide_or_zero(numerator, denominator):
            return numerator / denominator if denominator else 0.0
        precision = divide_or_zero(true_positive, true_positive + false_positive)
        recall = divide_or_zero(true_positive, true_positive + false_negative)
        f1 = divide_or_zero(2 * true_positive,
                            2 * true_positive + false_positive + false_negative)
        return {
            "counts": (true_positive, false_positive, true_negative, false_negative),
            "accuracy": (true_positive + true_negative) / len(actual),
            "precision": precision,
            "recall": recall,
            "f1": f1,
        }

    actual = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    predictions = {"filter": [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                   "baseline": [0] * 10}
    for name, predicted in predictions.items():
        result = binary_metrics(actual, predicted)
        print(name, "TP FP TN FN:", result["counts"])
        print(" ".join(f"{metric}={result[metric]:.3f}"
                       for metric in ("accuracy", "precision", "recall", "f1")))
    assert binary_metrics([0, 0], [0, 0])["f1"] == 0.0
  status: runnable
  purpose_vi: Đếm lỗi thật và so sánh baseline trên dữ liệu mất cân bằng.
  purpose_en: Count actual errors and compare a baseline on imbalanced labels.
  setup: Python 3.11+; standard library only. Run in Colab or save as metrics.py and run python metrics.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành metrics.py và chạy lệnh python metrics.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as metrics.py and run python metrics.py from the folder containing the file.
  expected_output: |-
    filter TP FP TN FN: (1, 1, 7, 1)
    accuracy=0.800 precision=0.500 recall=0.500 f1=0.500
    baseline TP FP TN FN: (0, 0, 8, 2)
    accuracy=0.800 precision=0.000 recall=0.000 f1=0.000
  edge_case_vi: 'Thử []/[], nhãn 2 và độ dài khác nhau: ValueError. Thử [0,0]/[0,0]: accuracy=1 nhưng precision/recall/F1=0
    theo quy ước.'
  edge_case_en: 'Try empty lists, label 2 or unequal lengths: ValueError. For [0,0]/[0,0], accuracy=1 but precision/recall/F1=0
    by convention.'
  explanation_vi: Chỉ đánh giá nhãn nhị phân có sẵn, không huấn luyện bộ lọc và không đánh giá xác suất. F1
    cao không bảo đảm xác suất được hiệu chỉnh.
  explanation_en: This evaluates supplied binary labels; it does not train a filter or assess probabilities.
    High F1 does not guarantee calibrated probabilities.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measures-and-support
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc Precision, recall and F-measures; đối chiếu mẫu số 0 và cách lấy trung bình nhiều lớp.
  read_en: Read Precision, recall and F-measures; check zero denominators and multiclass averaging.
- language: en
  title: scikit-learn Pipelines
  url: https://scikit-learn.org/stable/modules/compose.html
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
- exercise-3-evaluation
review_item_ids:
- phase-03-classical-ml-evaluation-1-recall
- phase-03-classical-ml-evaluation-1-application
- phase-03-classical-ml-evaluation-1-debug
- phase-03-classical-ml-evaluation-1-interview
estimated_minutes: 60
completion_checklist: &id001
- Đối chiếu đủ bốn thước đo cho hai bộ dự đoán.
- Giải thích quy ước 0 khi không có dự đoán dương.
- Nêu chi phí FP/FN và giới hạn của fixture 10 thư.
completion_criteria: *id001
common_mistakes:
- Đổi nhầm lớp dương hoặc đảo hàng/cột của ma trận.
- Kết luận từ accuracy khi lớp dương hiếm.
- Giấu mẫu số 0 hoặc coi F1 là thước đo hiệu chỉnh xác suất.
next_lessons:
- phase-03-classical-ml-evaluation-2
- phase-03-classical-ml-evaluation-3
review_question_vi: Recall tính gì, khác precision thế nào?
review_question_en: What does recall measure, and how does it differ from precision?
review_answer_vi: Recall=TP/(TP+FN) xét nhãn dương thật; precision=TP/(TP+FP) xét dự đoán dương. Với TP=1,
  FP=1, FN=1, cả hai bằng 0.5.
review_answer_en: Recall=TP/(TP+FN) considers actual positives; precision=TP/(TP+FP) considers predicted positives.
  For TP=1, FP=1, FN=1, both are 0.5.
review_cards:
- id: phase-03-classical-ml-evaluation-1-recall
  type: recall
  question_vi: Recall tính gì, khác precision thế nào?
  question_en: What does recall measure, and how does it differ from precision?
  answer_vi: Recall=TP/(TP+FN) xét nhãn dương thật; precision=TP/(TP+FP) xét dự đoán dương. Với TP=1, FP=1,
    FN=1, cả hai bằng 0.5.
  answer_en: Recall=TP/(TP+FN) considers actual positives; precision=TP/(TP+FP) considers predicted positives.
    For TP=1, FP=1, FN=1, both are 0.5.
  hint_vi: Xem hai mẫu số.
  hint_en: Compare the two denominators.
- id: phase-03-classical-ml-evaluation-1-application
  type: application
  question_vi: TP=1, FP=1, TN=7, FN=1 cho accuracy và F1 nào?
  question_en: With TP=1, FP=1, TN=7, FN=1, what are accuracy and F1?
  answer_vi: N=10; accuracy=(1+7)/10=0.8; F1=2/(2+1+1)=0.5. Baseline toàn âm cũng accuracy=0.8 nhưng bỏ sót
    cả hai mẫu dương.
  answer_en: N=10; accuracy=(1+7)/10=0.8; F1=2/(2+1+1)=0.5. An all-negative baseline also has accuracy=0.8
    but misses both positives.
  hint_vi: F1 không dùng TN.
  hint_en: F1 does not use TN.
- id: phase-03-classical-ml-evaluation-1-debug
  type: debug
  question_vi: 'Precision gặp chia 0 khi dự đoán toàn âm: sửa thế nào?'
  question_en: 'Precision divides by zero for all-negative predictions: what should you do?'
  answer_vi: TP+FP=0 nên precision không xác định. Ghi rõ quy ước trả 0 như ví dụ; báo thêm số dự đoán dương.
    Recall vẫn xác định nếu có nhãn dương thật.
  answer_en: TP+FP=0 makes precision undefined. Explicitly document the example convention of returning 0 and
    report the predicted-positive count. Recall remains defined if actual positives exist.
  hint_vi: Không âm thầm đổi mẫu số thành 1.
  hint_en: Do not silently replace the denominator with 1.
- id: phase-03-classical-ml-evaluation-1-interview
  type: interview
  question_vi: Nếu chặn nhầm thư hợp lệ rất tốn kém, chọn thước đo ra sao?
  question_en: If blocking legitimate mail is costly, how should you choose metrics?
  answer_vi: Ưu tiên precision của lớp thư rác, đồng thời báo recall và số FP/FN. Ngưỡng cao hơn có thể giảm
    FP nhưng bỏ sót thêm thư rác; phải kiểm tra trên dữ liệu kiểm định đại diện.
  answer_en: Prioritize spam precision while reporting recall and FP/FN counts. A higher threshold may reduce
    FP while missing more spam; check this on representative validation data.
  hint_vi: Nối lỗi FP với chi phí.
  hint_en: Connect false positives to cost.
completion_checklist_en: &id002
- Verify all four metrics for both prediction sets.
- Explain the zero convention when no positives are predicted.
- State FP/FN costs and the limits of the 10-mail fixture.
completion_criteria_en: *id002
common_mistakes_en:
- Swap the positive class or matrix row/column axes.
- Conclude from accuracy when positives are rare.
- Hide zero denominators or treat F1 as probability calibration.
---
# Thước đo cho phân loại / Classification metrics

Lớp 1 là thư rác, lớp 0 là thư hợp lệ. TP: thư rác bị chặn; FP: thư hợp lệ bị chặn; TN: thư hợp lệ được giữ; FN: thư rác lọt qua. Ma trận có hàng là nhãn thật, cột là dự đoán, thứ tự [0, 1]: [[TN, FP], [FN, TP]].

Accuracy dùng tất cả mẫu; precision hỏi trong các thư bị chặn có bao nhiêu thư rác; recall hỏi phát hiện được bao nhiêu thư rác thật. F1 là trung bình điều hòa của precision và recall, không tính TN và không biểu diễn mọi chi phí kinh doanh.

Ví dụ 10 thư có 2 thư rác. Mô hình có TP=1, FP=1, TN=7, FN=1, đạt accuracy=0.8 và precision=recall=F1=0.5. Baseline toàn âm cũng accuracy=0.8 nhưng recall=0.

Không có dự đoán dương thì precision không xác định; không có nhãn dương thì recall không xác định; F1 không xác định khi TP=FP=FN=0. Mã quy ước trả 0 cho mẫu số 0, tương ứng lựa chọn zero_division=0 trong scikit-learn; cần ghi quy ước, không hiểu số 0 là phép chia hợp lệ.

## Practice / Thực hành

So sánh bộ lọc thư rác và baseline toàn âm trên cùng 10 nhãn; giải thích vì sao cùng accuracy nhưng khác recall.

Compare the spam filter and all-negative baseline on the same 10 labels; explain equal accuracy but different recall.
