---
lesson_id: phase-03-classical-ml-models-4
phase_id: phase-03-classical-ml
module_id: models
title_vi: Gradient boosting
title_en: Gradient boosting
summary_vi: Gradient boosting bổ sung mô hình yếu theo từng bước để giảm hàm mất mát hiện tại.
summary_en: Gradient boosting adds weak models sequentially to reduce the current ensemble loss, with a learning rate controlling each contribution.
learning_objectives:
- Theo dõi chất lượng kiểm định khi tăng số bước boosting.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain gradient boosting with a concrete example.
- Write or adapt a small code example applying gradient boosting.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-3
- phase-02-math-ml-linear-algebra-1
key_terms:
- gradient
- boosting
- NumPy
- vector
- optimization
- models
concept_notes_vi: |-
  Gradient boosting thêm các mô hình thành phần theo từng bước để giảm hàm mất mát của tổ hợp hiện tại. Mô hình mới được học theo hướng gradient âm của loss; với bình phương sai số, hướng này liên quan trực tiếp tới phần dư.

  Khác rừng ngẫu nhiên chủ yếu kết hợp nhiều cây được xây riêng, boosting tạo chuỗi bước phụ thuộc vào kết quả trước. Tốc độ học điều chỉnh mức đóng góp của mỗi bước; tốc độ nhỏ thường cần nhiều bước hơn và không tự bảo đảm chất lượng tốt hơn.

  Tự kiểm tra: thêm cây tới khi train loss rất thấp có luôn cải thiện dự đoán mới không? Không; vẫn có thể quá khớp. Theo dõi kiểm định, giới hạn độ phức tạp và ngân sách, rồi so với baseline trên cùng phép chia dữ liệu.
concept_notes_en: |-
  Gradient boosting adds component models sequentially to reduce the current ensemble's loss. New models fit a direction derived from loss gradients; for squared error, this direction is directly related to residuals.

  Unlike a random forest that primarily combines separately built trees, boosting creates steps dependent on earlier results. Learning rate controls each step's contribution; smaller rates often require more steps and do not automatically improve quality.

  Self-check: does adding trees until training loss is tiny always improve new predictions? No; overfitting remains possible. Monitor validation, bound complexity and budget, and compare against a baseline using the same data split.
why_it_matters_vi: So sánh mô hình theo giả định, độ phức tạp và dạng lỗi trên cùng dữ liệu.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without
  a baseline.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Gradient boosting” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Theo dõi chất lượng kiểm định khi tăng số bước boosting.
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
      Theo dõi chất lượng kiểm định khi tăng số bước boosting.

      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
    deliverables:
    - Cấu hình mô hình và kết quả trên cùng tập kiểm định
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Run the single residual-boosting step and explain its training-MSE reduction. For the full lesson task,
      track a separate validation set over multiple boosting steps and choose a step count within a fixed budget.
    deliverables:
    - The mean baseline, residual stump and learning rate
    - For multiple steps, a table or curve of training and validation loss
    - A comparison with the baseline and one representative error
    checkpoint: Do not treat a drop in training loss as proof of generalization; choose the step count using validation
      data.
    stretch: Compare learning rates 0.1 and 0.5 in the toy update, then explain why a smaller update may require
      more steps.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Gradient boosting” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain gradient boosting to a new teammate?
  - Which assumption behind gradient boosting could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- θ_{t+1} = θ_t − η ∇J(θ_t)
code_examples:
- language: python
  title: One residual-boosting step from a mean baseline
  code: |-
    from math import isfinite


    def fit_stump(xs, residuals):
        if not xs or len(xs) != len(residuals):
            raise ValueError("non-empty aligned data are required")
        if any(not isinstance(value, (int, float)) or not isfinite(value)
               for values in (xs, residuals) for value in values):
            raise ValueError("features and residuals must be finite numbers")
        distinct = sorted(set(xs))
        if len(distinct) < 2:
            raise ValueError("at least two distinct x values are required")
        best_error = float("inf")
        best_stump = None
        for lower, upper in zip(distinct, distinct[1:]):
            threshold = lower / 2 + upper / 2
            if threshold >= upper:
                threshold = lower
            left = [residual for value, residual in zip(xs, residuals)
                    if value <= threshold]
            right = [residual for value, residual in zip(xs, residuals)
                     if value > threshold]
            left_mean = sum(left) / len(left)
            right_mean = sum(right) / len(right)
            error = (sum((value - left_mean) ** 2 for value in left)
                     + sum((value - right_mean) ** 2 for value in right))
            if error < best_error:
                best_error = error
                best_stump = {
                    "threshold": threshold,
                    "left": left_mean,
                    "right": right_mean,
                }
        return best_stump


    def predict_stump(stump, value):
        if not isinstance(value, (int, float)) or not isfinite(value):
            raise ValueError("feature must be a finite number")
        return stump["left"] if value <= stump["threshold"] else stump["right"]


    if __name__ == "__main__":
        features = [1.0, 2.0, 3.0, 4.0]
        targets = [1.0, 1.0, 4.0, 4.0]
        baseline = sum(targets) / len(targets)
        predictions = [baseline] * len(targets)
        residuals = [actual - predicted
                     for actual, predicted in zip(targets, predictions)]
        stump = fit_stump(features, residuals)
        learning_rate = 0.5
        if not isfinite(learning_rate) or not 0 < learning_rate <= 1:
            raise ValueError("learning_rate must be in (0, 1] for this demo")
        updated = [predicted + learning_rate * predict_stump(stump, value)
                   for value, predicted in zip(features, predictions)]
        loss_before = sum((actual - predicted) ** 2
                          for actual, predicted in zip(targets, predictions)) / len(targets)
        loss_after = sum((actual - predicted) ** 2
                         for actual, predicted in zip(targets, updated)) / len(targets)
        print(f"baseline={baseline:.2f}, threshold={stump['threshold']:.1f}")
        print(f"learning_rate={learning_rate:.1f}, predictions={updated}")
        print(f"training_mse_before={loss_before:.4f}")
        print(f"training_mse_after={loss_after:.4f}")
  status: runnable
  purpose_vi: Bắt đầu từ trung bình mục tiêu, khớp một cây hồi quy một tầng vào phần dư và quan sát MSE train trước/sau
    cập nhật có tốc độ học.
  purpose_en: Start from the target mean, fit a one-split regression tree to residuals, and inspect training MSE
    before and after a learning-rate-scaled update.
  setup: Python 3.11+; chỉ dùng thư viện chuẩn / standard library only. Save as boosting_demo.py and run python
    boosting_demo.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành boosting_demo.py và chạy lệnh python boosting_demo.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as boosting_demo.py and run python boosting_demo.py from the folder containing the file.
  expected_output: |-
    baseline=2.50, threshold=2.5
    learning_rate=0.5, predictions=[1.75, 1.75, 3.25, 3.25]
    training_mse_before=2.2500
    training_mse_after=0.5625
  edge_case_vi: fit_stump phải báo ValueError khi x không đổi, dữ liệu rỗng, khác độ dài hoặc có NaN. Khi phần dư
    đều bằng 0 và x vẫn phân biệt, hai lá dự đoán 0 nên bước cập nhật không đổi dự đoán. Ví dụ giới hạn tốc độ học
    trong (0, 1].
  edge_case_en: fit_stump must reject constant x, empty or misaligned data, and NaN. With distinct x and all-zero
    residuals, both leaves predict zero and the update leaves predictions unchanged. This demo restricts the learning
    rate to (0, 1].
  explanation_vi: Với loss một mẫu bằng một nửa bình phương sai số, gradient âm theo dự đoán là y−F(x). Mỗi ngưỡng
    được chấm bằng tổng bình phương sai số phần dư quanh trung bình hai lá; chọn ngưỡng tốt nhất rồi cập nhật F_new(x)=F_old(x)+learning_rate×stump(x).
    MSE được in trên chính tập train để thấy cơ chế một bước. Đây chưa phải đánh giá khái quát hóa hoặc một hệ thống
    boosting đầy đủ; nhiệm vụ chọn số bước cần thêm tập kiểm định riêng.
  explanation_en: For half squared-error loss, the negative gradient with respect to a prediction is y−F(x). Score
    each split by residual squared error around the two leaf means, choose the best split, and update F_new(x)=F_old(x)+learning_rate×stump(x).
    Printed MSE uses the training set to expose one step. This is neither a generalization evaluation nor a complete
    boosting system; selecting a step count requires separate validation data.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Trong User Guide, đọc Ensembles → Gradient-boosted trees → Mathematical formulation; đối chiếu khởi tạo
    bằng trung bình, gradient âm và cập nhật cộng.
  read_en: In the User Guide, read Ensembles → Gradient-boosted trees → Mathematical formulation; compare mean initialization,
    negative gradients and additive updates.
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
- phase-03-classical-ml-models-4-recall
- phase-03-classical-ml-models-4-application
- phase-03-classical-ml-models-4-debug
- phase-03-classical-ml-models-4-interview
estimated_minutes: 60
completion_checklist:
- Theo dõi chất lượng kiểm định khi tăng số bước boosting.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Theo dõi chất lượng kiểm định khi tăng số bước boosting.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
common_mistakes:
- Chọn mô hình chỉ vì điểm huấn luyện cao.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-preprocessing-1
- phase-03-classical-ml-preprocessing-2
review_question_vi: Gradient boosting khác rừng ngẫu nhiên ở cách xây mô hình thành phần như thế nào?
review_question_en: How does gradient boosting differ from a random forest in how its component models are built?
review_answer_vi: Boosting thêm mô hình theo chuỗi, mỗi bước học một hướng cập nhật dựa trên gradient âm của loss
  tại dự đoán hiện tại. Với bình phương sai số, hướng này tương ứng phần dư. Rừng ngẫu nhiên chủ yếu xây các cây
  riêng rồi kết hợp. Trong boosting, tốc độ học điều chỉnh đóng góp của từng bước; số bước cần chọn qua kiểm định.
review_answer_en: Boosting adds models sequentially, fitting each update to the negative loss gradient at the
  current predictions. For squared error, this corresponds to residuals. A random forest primarily builds trees
  separately and combines them. In boosting, the learning rate scales each contribution; select the number of
  steps using validation data.
review_cards:
- id: phase-03-classical-ml-models-4-recall
  type: recall
  question_vi: Dự đoán hiện tại là 8, cây mới dự đoán phần dư là 2 và tốc độ học là 0,1. Dự đoán sau bước boosting là bao nhiêu?
  question_en: The current prediction is 8, a new tree predicts a residual of 2, and the learning rate is 0.1. What is the updated prediction?
  answer_vi: Theo cập nhật cộng, dự đoán mới là 8 + 0,1 × 2 = 8,2. Tốc độ học chỉ cho phép bước này đóng góp 0,2.
    Nếu nhãn thật là 10 thì phần dư giảm từ 2 xuống 1,8; ví dụ một mẫu này không chứng minh chất lượng kiểm định tăng.
  answer_en: The additive update gives 8 + 0.1 × 2 = 8.2. The learning rate limits this step's contribution to 0.2.
    If the true target is 10, the residual falls from 2 to 1.8; this single-case calculation does not establish
    an improvement in validation quality.
  hint_vi: Nhân đầu ra cây mới với tốc độ học rồi cộng vào dự đoán hiện tại.
  hint_en: Multiply the new tree's output by the learning rate, then add it to the current prediction.
- id: phase-03-classical-ml-models-4-application
  type: application
  question_vi: Bạn theo dõi và chọn số bước boosting như thế nào khi chưa được dùng tập test để chọn mô hình?
  question_en: How would you track and choose the number of boosting steps without using the test set for model selection?
  answer_vi: Giữ cố định phép chia train–validation, tốc độ học và độ phức tạp cây. Ghi loss train, loss kiểm định
    và thời gian theo số bước; chọn bước có loss kiểm định tốt nhất trong ngân sách và các bước đã thử. So với
    baseline trên cùng tập kiểm định, đọc một lỗi tiêu biểu, rồi đánh giá cấu hình đã chốt trên tập test.
  answer_en: Keep the training–validation split, learning rate and tree complexity fixed. Record training loss,
    validation loss and runtime by step; choose the best validation loss among the tested steps within budget.
    Compare against a baseline on the same validation set, inspect a representative error, and evaluate the
    selected configuration on the test set.
  hint_vi: Chọn bằng kiểm định; giữ tập test cho lần đánh giá cấu hình đã chốt.
  hint_en: Select with validation data; reserve test data for evaluating the chosen configuration.
- id: phase-03-classical-ml-models-4-debug
  type: debug
  question_vi: Loss train tiếp tục giảm nhưng loss kiểm định tăng khi thêm cây. Bạn nên làm gì?
  question_en: Training loss keeps falling, but validation loss rises as trees are added. What should you do?
  answer_vi: Kiểm tra cách chia và tính nhất quán của dữ liệu, rồi xem đường loss theo từng bước. Nếu xu hướng
    tăng trên kiểm định được xác nhận, đây là dấu hiệu quá khớp; chọn lại bước có loss kiểm định thấp hơn thay
    vì chỉ tối thiểu hóa loss train. Có thể thử cây đơn giản hơn hoặc tốc độ học khác, nhưng phải kiểm định lại.
  answer_en: Check the split and data consistency, then inspect loss curves by step. If the validation increase
    is confirmed, it indicates overfitting; select an earlier step with lower validation loss instead of only
    minimizing training loss. Simpler trees or a different learning rate are further candidates to validate.
  hint_vi: Loss trên dữ liệu chưa dùng để khớp quyết định liệu thêm cây có còn hữu ích.
  hint_en: Loss on data not used for fitting helps decide whether extra trees remain useful.
- id: phase-03-classical-ml-models-4-interview
  type: interview
  question_vi: Vì sao giảm tốc độ học thường cần nhiều bước hơn, và có bảo đảm mô hình tốt hơn không?
  question_en: Why does a smaller learning rate often require more steps, and does it guarantee a better model?
  answer_vi: Mỗi mô hình thành phần đóng góp ít hơn nên thường cần nhiều bước để thay đổi dự đoán một mức tương
    tự. Nhiều bước làm tăng chi phí huấn luyện và có thể tăng chi phí dự đoán; chất lượng còn phụ thuộc dữ liệu,
    độ phức tạp cây và số bước. So các cặp tốc độ học–số bước bằng kiểm định trong cùng ngân sách, không mặc định nhỏ hơn là tốt hơn.
  answer_en: Each component contributes less, so more steps are often needed for a similar change in predictions.
    More steps increase training cost and can increase prediction cost. Quality also depends on data, tree
    complexity and step count. Compare learning-rate and step-count combinations on validation data within the
    same budget; a smaller rate is not automatically better.
  hint_vi: Xem đồng thời mức đóng góp mỗi bước, số bước và ngân sách tính toán.
  hint_en: Consider the contribution per step, the number of steps and the compute budget together.
---
# Gradient boosting / Gradient boosting

Gradient boosting thêm các mô hình thành phần theo từng bước để giảm hàm mất mát của tổ hợp hiện tại. Mô hình mới được học theo hướng gradient âm của loss; với bình phương sai số, hướng này liên quan trực tiếp tới phần dư.

Khác rừng ngẫu nhiên chủ yếu kết hợp nhiều cây được xây riêng, boosting tạo chuỗi bước phụ thuộc vào kết quả trước. Tốc độ học điều chỉnh mức đóng góp của mỗi bước; tốc độ nhỏ thường cần nhiều bước hơn và không tự bảo đảm chất lượng tốt hơn.

Tự kiểm tra: thêm cây tới khi train loss rất thấp có luôn cải thiện dự đoán mới không? Không; vẫn có thể quá khớp. Theo dõi kiểm định, giới hạn độ phức tạp và ngân sách, rồi so với baseline trên cùng phép chia dữ liệu.

Ví dụ mã khớp một cây vào phần dư rồi thực hiện một bước boosting từ baseline trung bình. MSE trước/sau là MSE train, chỉ minh họa hướng cập nhật; để chọn số bước và kiểm tra quá khớp vẫn phải theo dõi một tập kiểm định riêng.

## Thực hành

Theo dõi chất lượng kiểm định khi tăng số bước boosting.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
