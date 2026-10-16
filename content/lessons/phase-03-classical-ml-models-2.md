---
lesson_id: phase-03-classical-ml-models-2
phase_id: phase-03-classical-ml
module_id: models
title_vi: Hồi quy logistic
title_en: Logistic regression
summary_vi: Hồi quy logistic chuyển tổ hợp tuyến tính thành xác suất cho bài toán phân loại.
summary_en: Logistic regression maps a linear score to a class probability; a decision threshold turns that probability into a label.
learning_objectives:
- So sánh precision và recall khi thay ngưỡng quyết định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain logistic regression with a concrete example.
- Write or adapt a small code example applying logistic regression.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- logistic
- regression
- dataset
- feature
- baseline
- evaluation
- models
concept_notes_vi: |-
  Dù có chữ hồi quy trong tên, hồi quy logistic thường dùng cho phân loại. Trong bài toán nhị phân, nó biến điểm tuyến tính qua sigmoid thành giá trị giữa 0 và 1 để ước lượng xác suất của lớp dương.

  Ngưỡng quyết định biến điểm xác suất thành nhãn. Điểm 0,4 được gán âm với ngưỡng 0,5 nhưng dương với ngưỡng 0,3; đổi ngưỡng không cần huấn luyện lại mô hình. Hạ ngưỡng thường tăng số trường hợp bị báo dương, gồm cả đúng và sai.

  Tự kiểm tra: dự đoán 0,8 có nghĩa đúng chính xác 80% ở mọi nhóm không? Không; cần kiểm tra hiệu chỉnh xác suất trên dữ liệu phù hợp. Chọn ngưỡng theo tác hại của từng loại lỗi và dùng tập kiểm định, không chọn bằng điểm tập kiểm tra.
concept_notes_en: |-
  Despite its name, logistic regression commonly performs classification. In the binary case, it applies a sigmoid to a linear score to estimate positive-class probability between 0 and 1.

  A decision threshold converts probability scores into labels. A score of 0.4 is negative at threshold 0.5 but positive at 0.3; changing the threshold does not require retraining. Lower thresholds generally flag more positives, both correct and incorrect.

  Self-check: does a prediction of 0.8 mean exactly 80% accuracy in every group? No; check probability calibration on appropriate data. Choose thresholds using error costs and validation data, not test-set scores.
why_it_matters_vi: So sánh mô hình theo giả định, độ phức tạp và dạng lỗi trên cùng dữ liệu.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without
  a baseline.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Logistic regression” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- So sánh precision và recall khi thay ngưỡng quyết định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai. Ghi kết quả đối chiếu và điều bạn đã sửa nếu lần đầu
  chưa đúng.
- Tự trả lời thẻ ôn tập, rồi kiểm tra các tiêu chí hoàn thành trước khi chuyển bài.
study_steps_en:
- 'Read the concept notes and answer: Compare models by assumptions, complexity, and error patterns instead of trying
  many models without a baseline.'
- Open scikit-learn User Guide, read the section marked Read this lesson, and record one verified example or definition.
- Open Practice Lab, use Create & open VS Code, save with Ctrl+S, and change one parameter before rerunning the
  test.
- 'Complete the practice task: Train a simple model first, add trees/boosting, and record metrics plus a representative
  error for each model.'
- Answer the review card without hints, finish the checklist, and save a GitHub-ready artifact.
practice_plan:
  vi:
    task: |-
      So sánh precision và recall khi thay ngưỡng quyết định.

      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
    deliverables:
    - Cấu hình mô hình và kết quả trên cùng tập kiểm định
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Compare precision and recall at different decision thresholds. First use the fixed-coefficient sigmoid
      example; when evaluating a fitted model, estimate coefficients on training data and compare thresholds on
      validation data.
    deliverables:
    - The probabilities, labels and threshold values used
    - Predictions, precision and recall for each threshold
    - One false positive or false negative and its consequence
    checkpoint: Changing the threshold keeps probabilities fixed; choose thresholds without consulting test labels.
    stretch: Try a threshold with no predicted positives and explain the demo convention of precision equal to 0.0.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Hồi quy logistic” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain logistic regression to a new teammate?
  - Which assumption behind logistic regression could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- σ(z) = 1 / (1 + e^(−z))
- precision = TP / (TP + FP)
code_examples:
- language: python
  title: Fixed logistic scores, two thresholds, precision and recall
  code: |-
    from math import exp, isfinite, log


    def finite_number(value):
        return isinstance(value, (int, float)) and isfinite(value)


    def sigmoid(score):
        if not finite_number(score):
            raise ValueError("score must be a finite number")
        if score >= 0:
            return 1.0 / (1.0 + exp(-score))
        exponential = exp(score)
        return exponential / (1.0 + exponential)


    def classify(probabilities, threshold):
        if not finite_number(threshold) or not 0 <= threshold <= 1:
            raise ValueError("threshold must be in [0, 1]")
        if not probabilities:
            raise ValueError("probabilities must not be empty")
        if any(not finite_number(value) or not 0 <= value <= 1
               for value in probabilities):
            raise ValueError("probabilities must be finite and in [0, 1]")
        return [int(probability >= threshold) for probability in probabilities]


    def binary_metrics(labels, predictions):
        # For this demo, an undefined precision or recall is reported as 0.0.
        if not labels or len(labels) != len(predictions):
            raise ValueError("non-empty aligned labels are required")
        if any(value not in (0, 1)
               for values in (labels, predictions) for value in values):
            raise ValueError("labels and predictions must be binary 0 or 1")
        true_positive = sum(actual == 1 and predicted == 1
                            for actual, predicted in zip(labels, predictions))
        predicted_positive = sum(predictions)
        actual_positive = sum(labels)
        precision = true_positive / predicted_positive if predicted_positive else 0.0
        recall = true_positive / actual_positive if actual_positive else 0.0
        return {"precision": precision, "recall": recall}


    if __name__ == "__main__":
        # Fixed coefficients illustrate inference; no model is fitted here.
        weight = 1.0
        intercept = 0.0
        features = [log(4), log(1.5), log(2 / 3), log(0.25)]
        labels = [1, 0, 1, 0]
        probabilities = [sigmoid(weight * value + intercept) for value in features]
        print(f"probabilities={[round(value, 1) for value in probabilities]}")
        for threshold in (0.5, 0.3):
            predictions = classify(probabilities, threshold)
            metrics = binary_metrics(labels, predictions)
            print(f"threshold={threshold:.1f}, labels={predictions}")
            print(f"precision={metrics['precision']:.3f}, recall={metrics['recall']:.3f}")
  status: runnable
  purpose_vi: Dùng hệ số cố định để tính sigmoid, đổi ngưỡng và đo precision/recall; ví dụ minh họa suy luận, không
    huấn luyện hồi quy logistic.
  purpose_en: Use fixed coefficients to compute sigmoid probabilities, change thresholds and measure precision/recall.
    This demonstrates inference, not logistic-regression fitting.
  setup: Python 3.11+; chỉ dùng thư viện chuẩn / standard library only. Save as logistic_demo.py and run python
    logistic_demo.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành logistic_demo.py và chạy lệnh python logistic_demo.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as logistic_demo.py and run python logistic_demo.py from the folder containing the file.
  expected_output: |-
    probabilities=[0.8, 0.6, 0.4, 0.2]
    threshold=0.5, labels=[1, 1, 0, 0]
    precision=0.500, recall=0.500
    threshold=0.3, labels=[1, 1, 1, 0]
    precision=0.667, recall=1.000
  edge_case_vi: sigmoid(1000) và sigmoid(-1000) không tràn số. Thử xác suất 1,2, ngưỡng ngoài [0, 1], danh sách
    rỗng hoặc nhãn 2; phải báo ValueError. Khi không có dự đoán dương hoặc nhãn dương, metric tương ứng được quy
    ước là 0,0.
  edge_case_en: sigmoid(1000) and sigmoid(-1000) avoid overflow. A probability of 1.2, a threshold outside [0, 1],
    empty data or label 2 must raise ValueError. Undefined precision or recall is assigned 0.0 in this demo.
  explanation_vi: Điểm là weight×x+intercept với hệ số đã cho; sigmoid biến điểm thành xác suất. Quy tắc của ví
    dụ là p ≥ ngưỡng thì gán lớp 1. Ngưỡng 0,3 bắt thêm một mẫu dương thật nên cả precision và recall đều tăng trong
    bộ dữ liệu nhỏ này; precision không nhất thiết giảm khi hạ ngưỡng. Đây không phải bằng chứng về mô hình đã được
    huấn luyện hoặc hiệu chỉnh xác suất.
  explanation_en: The score is weight×x+intercept with supplied coefficients; sigmoid maps it to a probability.
    This demo assigns class 1 when p ≥ threshold. Threshold 0.3 adds a true positive, so both precision and recall
    rise on these toy labels; lower thresholds do not necessarily reduce precision. The example provides no evidence
    of model fitting or probability calibration.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Trong User Guide, đọc Linear Models → Logistic regression → Binary Case và Tuning the decision threshold
    for class prediction; tách bước ước lượng xác suất khỏi bước chọn nhãn.
  read_en: In the User Guide, read Linear Models → Logistic regression → Binary Case and Tuning the decision threshold
    for class prediction; distinguish probability estimation from label selection.
- language: en
  title: scikit-learn Model Evaluation
  url: https://scikit-learn.org/stable/modules/model_evaluation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
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
- exercise-3-models
review_item_ids:
- phase-03-classical-ml-models-2-recall
- phase-03-classical-ml-models-2-application
- phase-03-classical-ml-models-2-debug
- phase-03-classical-ml-models-2-interview
estimated_minutes: 60
completion_checklist:
- So sánh precision và recall khi thay ngưỡng quyết định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh precision và recall khi thay ngưỡng quyết định.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
common_mistakes:
- Chọn mô hình chỉ vì điểm huấn luyện cao.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-models-3
- phase-03-classical-ml-models-4
review_question_vi: Hồi quy logistic nhị phân biến đặc trưng thành xác suất và nhãn như thế nào?
review_question_en: How does binary logistic regression turn features into a probability and then a label?
review_answer_vi: Mô hình tính điểm tuyến tính từ đặc trưng rồi dùng sigmoid để ước lượng xác suất lớp dương.
  Ngưỡng quyết định biến xác suất thành nhãn; với quy tắc p ≥ ngưỡng, p = 0,4 cho nhãn âm ở ngưỡng 0,5 nhưng
  nhãn dương ở ngưỡng 0,3. Thay ngưỡng không cần huấn luyện lại mô hình.
review_answer_en: The model computes a linear feature score and applies a sigmoid to estimate positive-class
  probability. A threshold turns that probability into a label. Using p ≥ threshold, p = 0.4 is negative at 0.5
  but positive at 0.3. Changing this threshold does not require retraining the model.
review_cards:
- id: phase-03-classical-ml-models-2-recall
  type: recall
  question_vi: Với xác suất lớp dương 0,4, nhãn thay đổi thế nào khi hạ ngưỡng từ 0,5 xuống 0,3? Có phải huấn luyện lại không?
  question_en: For a positive-class probability of 0.4, what changes when the threshold drops from 0.5 to 0.3? Is retraining needed?
  answer_vi: Nếu gán dương khi p ≥ ngưỡng, nhãn đổi từ âm sang dương. Xác suất mô hình vẫn là 0,4; chỉ quy tắc
    quyết định thay đổi, nên không cần huấn luyện lại.
  answer_en: If positive means p ≥ threshold, the label changes from negative to positive. The model probability
    remains 0.4; only the decision rule changes, so retraining is unnecessary.
  hint_vi: Phân biệt đầu ra xác suất với bước chuyển xác suất thành nhãn.
  hint_en: Distinguish the probability estimate from the rule that assigns a label.
- id: phase-03-classical-ml-models-2-application
  type: application
  question_vi: Với nhãn thật [1, 0, 1, 0] và xác suất [0,8; 0,6; 0,4; 0,2], precision và recall ở ngưỡng 0,5 và 0,3 là bao nhiêu?
  question_en: For labels [1, 0, 1, 0] and probabilities [0.8, 0.6, 0.4, 0.2], what are precision and recall at thresholds 0.5 and 0.3?
  answer_vi: Gán dương khi p ≥ ngưỡng. Ở ngưỡng 0,5 có TP = 1, FP = 1, FN = 1 nên precision = 1/2 và recall = 1/2.
    Ở ngưỡng 0,3 có TP = 2, FP = 1, FN = 0 nên precision = 2/3 và recall = 1. So ngưỡng trên tập kiểm định theo
    chi phí báo nhầm và bỏ sót; không chọn ngưỡng bằng kết quả tập test.
  answer_en: Assign positive when p ≥ threshold. At 0.5, TP = 1, FP = 1 and FN = 1, so precision = 1/2 and recall = 1/2.
    At 0.3, TP = 2, FP = 1 and FN = 0, so precision = 2/3 and recall = 1. Compare thresholds on validation data
    using false-positive and false-negative costs; do not choose the threshold using test results.
  hint_vi: Lập nhãn dự đoán ở từng ngưỡng rồi đếm TP, FP và FN trước khi tính tỉ lệ.
  hint_en: Assign labels at each threshold, then count TP, FP and FN before computing the ratios.
- id: phase-03-classical-ml-models-2-debug
  type: debug
  question_vi: Accuracy cao nhưng mô hình bỏ sót nhiều mẫu dương. Bạn sẽ kiểm tra gì trước khi đổi mô hình?
  question_en: Accuracy is high, but the model misses many positive cases. What would you inspect before changing the model?
  answer_vi: Kiểm tra tỉ lệ lớp, cách xác định lớp dương và confusion matrix trên tập kiểm định. So recall với
    baseline luôn dự đoán lớp đa số, rồi thử các ngưỡng trên cùng xác suất và ghi cả precision lẫn recall.
    Hạ ngưỡng không bảo đảm precision tăng; cần đọc số báo nhầm và bỏ sót thực tế.
  answer_en: Check class proportions, the positive-class definition and the validation confusion matrix. Compare
    recall with a majority-class baseline, then evaluate thresholds on the same probabilities and record both
    precision and recall. Lowering the threshold does not guarantee better precision; inspect actual false positives and false negatives.
  hint_vi: Accuracy có thể bị lớp đa số chi phối; hãy nhìn riêng các mẫu dương.
  hint_en: The majority class can dominate accuracy; examine positive cases separately.
- id: phase-03-classical-ml-models-2-interview
  type: interview
  question_vi: Dự đoán xác suất 0,8 có tự chứng minh mô hình đã được hiệu chỉnh tốt không?
  question_en: Does a predicted probability of 0.8 by itself show that the model is well calibrated?
  answer_vi: Không. Hiệu chỉnh tốt nghĩa là trong nhiều mẫu được dự đoán gần 0,8, tỉ lệ dương quan sát được cũng
    gần 80% trên dữ liệu phù hợp. Cần kiểm tra theo nhóm xác suất và các nhóm dữ liệu quan trọng; một dự đoán
    đơn lẻ không chứng minh điều đó. Chọn ngưỡng là quyết định riêng, phụ thuộc chi phí từng loại lỗi.
  answer_en: No. Good calibration means that among many cases scored near 0.8, the observed positive rate is also
    near 80% on appropriate data. Check probability groups and relevant data subgroups; one prediction cannot
    establish calibration. Threshold selection is a separate decision based on the costs of different errors.
  hint_vi: Xác suất nói về tần suất trong nhiều trường hợp tương tự, không phải bảo đảm cho một mẫu.
  hint_en: A probability concerns frequencies across similar cases, not a guarantee for one case.
---
# Hồi quy logistic / Logistic regression

Dù có chữ hồi quy trong tên, hồi quy logistic thường dùng cho phân loại. Trong bài toán nhị phân, nó biến điểm tuyến tính qua sigmoid thành giá trị giữa 0 và 1 để ước lượng xác suất của lớp dương.

Ngưỡng quyết định biến điểm xác suất thành nhãn. Điểm 0,4 được gán âm với ngưỡng 0,5 nhưng dương với ngưỡng 0,3; đổi ngưỡng không cần huấn luyện lại mô hình. Hạ ngưỡng thường tăng số trường hợp bị báo dương, gồm cả đúng và sai.

Tự kiểm tra: dự đoán 0,8 có nghĩa đúng chính xác 80% ở mọi nhóm không? Không; cần kiểm tra hiệu chỉnh xác suất trên dữ liệu phù hợp. Chọn ngưỡng theo tác hại của từng loại lỗi và dùng tập kiểm định, không chọn bằng điểm tập kiểm tra.

Ví dụ mã dùng hệ số cố định để minh họa sigmoid, ngưỡng quyết định và precision/recall; không thực hiện bước học hệ số. Muốn đánh giá mô hình được huấn luyện, cần học hệ số trên tập train rồi chọn ngưỡng trên tập kiểm định riêng.

## Thực hành

So sánh precision và recall khi thay ngưỡng quyết định.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
