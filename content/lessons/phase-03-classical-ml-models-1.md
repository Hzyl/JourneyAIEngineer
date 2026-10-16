---
lesson_id: phase-03-classical-ml-models-1
phase_id: phase-03-classical-ml
module_id: models
title_vi: Hồi quy tuyến tính
title_en: Linear regression
summary_vi: Hồi quy tuyến tính mô tả đầu ra bằng tổ hợp tuyến tính của các đặc trưng.
summary_en: Linear regression predicts a numeric target from a weighted sum of features and an intercept.
learning_objectives:
- Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain linear regression with a concrete example.
- Write or adapt a small code example applying linear regression.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-ml-framing-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- linear
- regression
- dataset
- feature
- baseline
- evaluation
- models
concept_notes_vi: |-
  Hồi quy tuyến tính biểu diễn dự đoán bằng tổng có trọng số của các đặc trưng cộng một hệ số chặn. Tuyến tính ở đây nói về hệ số; bạn vẫn có thể đưa x² vào như một đặc trưng đã biến đổi.

  Với dự đoán y=2x+1, tăng x một đơn vị làm dự đoán tăng 2 khi các đặc trưng khác giữ nguyên. Đây là quan hệ trong mô hình, không chứng minh việc can thiệp tăng x sẽ gây ra thay đổi tương ứng ngoài đời. Các đặc trưng tương quan cũng làm hệ số khó diễn giải riêng lẻ.

  Tự kiểm tra: đường khớp tốt trong khoảng x từ 1 đến 10 có đáng tin khi x=100 không? Chưa có cơ sở; đó là ngoại suy. Xem sai số và phạm vi dữ liệu trước khi sử dụng dự đoán ngoài miền đã quan sát.
concept_notes_en: |-
  Linear regression expresses predictions as a weighted sum of features plus an intercept. Linear refers to the coefficients; x² can still be supplied as a transformed feature.

  For y=2x+1, increasing x by one raises the prediction by 2 while other features remain fixed. This is a model relationship, not proof that intervening on x causes the same real-world change. Correlated features can also make individual coefficients hard to interpret.

  Self-check: is a good fit over x from 1 to 10 trustworthy at x=100? Not without evidence; that is extrapolation. Inspect errors and data coverage before using predictions beyond the observed range.
why_it_matters_vi: So sánh mô hình theo giả định, độ phức tạp và dạng lỗi trên cùng dữ liệu.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without
  a baseline.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Linear regression” trong tài liệu tham khảo; đối chiếu với phần giải thích của bài.
- Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.
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
      Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.

      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
    deliverables:
    - Cấu hình mô hình và kết quả trên cùng tập kiểm định
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Fit a univariate line using training data and compare its held-out MSE with a training-mean baseline.
      The supplied toy example demonstrates this comparison; repeat it on data with noise and inspect an error.
    deliverables:
    - Training and validation data, fitted slope and intercept
    - Validation predictions and MSE for the line and mean baseline
    - One residual and one limitation of the fitted relationship
    checkpoint: The baseline uses only training labels, and both models use the same validation samples.
    stretch: Add noise to one training target and explain how the slope, intercept and validation errors change.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Hồi quy tuyến tính” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain linear regression to a new teammate?
  - Which assumption behind linear regression could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas:
- MSE = (1/n) Σ_i (y_i − ŷ_i)²
code_examples:
- language: python
  title: Fit a line and compare held-out MSE with a mean baseline
  code: |-
    from math import isfinite


    def validate_pairs(first, second):
        if not first or len(first) != len(second):
            raise ValueError("non-empty aligned sequences are required")
        if any(not isinstance(value, (int, float)) or not isfinite(value)
               for values in (first, second) for value in values):
            raise ValueError("all values must be finite numbers")


    def fit_line(xs, ys):
        validate_pairs(xs, ys)
        mean_x = sum(xs) / len(xs)
        mean_y = sum(ys) / len(ys)
        denominator = sum((value - mean_x) ** 2 for value in xs)
        if denominator == 0:
            raise ValueError("at least two distinct x values are required")
        numerator = sum((value - mean_x) * (target - mean_y)
                        for value, target in zip(xs, ys))
        slope = numerator / denominator
        intercept = mean_y - slope * mean_x
        return slope, intercept


    def mse(y_true, y_pred):
        validate_pairs(y_true, y_pred)
        return sum((actual - predicted) ** 2
                   for actual, predicted in zip(y_true, y_pred)) / len(y_true)


    if __name__ == "__main__":
        train_x = [1.0, 2.0, 3.0, 4.0]
        train_y = [3.0, 5.0, 7.0, 9.0]
        validation_x = [1.5, 3.5]
        validation_y = [4.0, 8.0]
        slope, intercept = fit_line(train_x, train_y)
        predicted = [slope * value + intercept for value in validation_x]
        training_mean = sum(train_y) / len(train_y)
        baseline = [training_mean] * len(validation_y)
        print(f"slope={slope:.2f}, intercept={intercept:.2f}")
        print(f"baseline_mse={mse(validation_y, baseline):.2f}")
        print(f"linear_mse={mse(validation_y, predicted):.2f}")
  status: runnable
  purpose_vi: Khớp đường thẳng bằng bình phương tối thiểu một biến, rồi so MSE trên hai mẫu kiểm định với baseline
    trung bình tập train.
  purpose_en: Fit a univariate least-squares line and compare its MSE on two held-out samples with a training-mean
    baseline.
  setup: Python 3.11+; chỉ dùng thư viện chuẩn / standard library only. Save as linear_demo.py and run python linear_demo.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành linear_demo.py và chạy lệnh python linear_demo.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as linear_demo.py and run python linear_demo.py from the folder containing the file.
  expected_output: |-
    slope=2.00, intercept=1.00
    baseline_mse=4.00
    linear_mse=0.00
  edge_case_vi: Thử fit_line([2, 2], [1, 3]), hai danh sách khác độ dài hoặc giá trị NaN; mỗi trường hợp phải báo
    ValueError. mse cũng từ chối dữ liệu rỗng hoặc không cùng độ dài.
  edge_case_en: Try fit_line([2, 2], [1, 3]), unequal lengths or NaN; each must raise ValueError. mse also rejects
    empty or misaligned inputs.
  explanation_vi: Từ điều kiện đạo hàm của tổng bình phương phần dư bằng 0, hệ số góc là tổng (x−x̄)(y−ȳ) chia tổng
    (x−x̄)², hệ số chặn là ȳ−slope×x̄. Chỉ tập train xác định hệ số và baseline. Dữ liệu đồ chơi nằm đúng trên một
    đường thẳng nên MSE kiểm định bằng 0; điều này không bảo đảm kết quả trên dữ liệu thật hay khi ngoại suy.
  explanation_en: Setting the squared-error derivatives to zero gives slope = sum((x−mean_x)(y−mean_y)) / sum((x−mean_x)²)
    and intercept = mean_y−slope×mean_x. Only training data determine the fit and baseline. The toy points lie exactly
    on a line, so zero validation MSE does not establish real-world accuracy or safe extrapolation.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Trong User Guide, mở Linear Models → Ordinary Least Squares; đối chiếu mục tiêu tối thiểu hóa tổng bình
    phương phần dư với fit_line.
  read_en: In the User Guide, open Linear Models → Ordinary Least Squares and compare its residual-sum-of-squares
    objective with fit_line.
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
- phase-03-classical-ml-models-1-recall
- phase-03-classical-ml-models-1-application
- phase-03-classical-ml-models-1-debug
- phase-03-classical-ml-models-1-interview
estimated_minutes: 60
completion_checklist:
- Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
common_mistakes:
- Chọn mô hình chỉ vì điểm huấn luyện cao.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-models-2
- phase-03-classical-ml-models-3
review_question_vi: Hồi quy tuyến tính tính dự đoán như thế nào, và hệ số 2 trong ŷ = 2x + 1 cho biết điều gì?
review_question_en: How does linear regression predict, and what does the coefficient 2 in ŷ = 2x + 1 mean?
review_answer_vi: Dự đoán là tổng có trọng số của các đặc trưng cộng hệ số chặn. Với ŷ = 2x + 1, x tăng một đơn vị
  thì dự đoán tăng 2. Trong mô hình nhiều đặc trưng, diễn giải này giữ các đặc trưng khác cố định. Hệ số không tự
  chứng minh quan hệ nhân quả.
review_answer_en: The prediction is a weighted sum of features plus an intercept. In ŷ = 2x + 1, a one-unit increase
  in x raises the prediction by 2. In a model with multiple features, this interpretation holds other features
  fixed. The coefficient alone does not establish causation.
review_cards:
- id: phase-03-classical-ml-models-1-recall
  type: recall
  question_vi: Với ŷ = 2x + 1, dự đoán tại x = 3 là bao nhiêu? Có thể kết luận tăng x gây ra tăng y không?
  question_en: For ŷ = 2x + 1, what is the prediction at x = 3? Does the coefficient prove that increasing x causes y to rise?
  answer_vi: Dự đoán là 2 × 3 + 1 = 7. Hệ số 2 mô tả quan hệ trong mô hình đã khớp; dữ liệu quan sát và hệ số này
    chưa đủ để kết luận tác động nhân quả.
  answer_en: The prediction is 2 × 3 + 1 = 7. The coefficient describes a relationship in the fitted model;
    observational data and this coefficient alone are insufficient to infer a causal effect.
  hint_vi: Tách phép tính dự đoán khỏi kết luận về can thiệp ngoài đời.
  hint_en: Separate a model prediction from a claim about a real-world intervention.
- id: phase-03-classical-ml-models-1-application
  type: application
  question_vi: Bạn kiểm tra hồi quy tuyến tính có tốt hơn cách luôn dự đoán trung bình như thế nào?
  question_en: How would you check whether linear regression improves on always predicting the mean?
  answer_vi: Tính trung bình mục tiêu trên tập train để tạo baseline, rồi khớp hồi quy tuyến tính trên cùng tập
    train. So sánh MSE của cả hai trên cùng tập kiểm định, lưu cấu hình và xem ít nhất một mẫu có sai số lớn.
    Không dùng nhãn kiểm định để tính trung bình baseline hoặc khớp mô hình.
  answer_en: Compute the target mean on the training set for the baseline, and fit linear regression on that same
    training set. Compare both models' MSE on the same validation set, save the configuration, and inspect at least
    one large error. Do not use validation labels to fit either model or calculate the baseline mean.
  hint_vi: Baseline cũng phải được học từ tập train; chỉ chấm điểm trên tập kiểm định.
  hint_en: Fit the baseline on training data too; use validation data only to evaluate it.
- id: phase-03-classical-ml-models-1-debug
  type: debug
  question_vi: Mô hình khớp tốt khi x từ 1 đến 10 nhưng sai lớn tại x = 100. Bạn cần kiểm tra gì?
  question_en: A model fits well for x between 1 and 10 but makes a large error at x = 100. What should you check?
  answer_vi: Xác nhận đơn vị và tiền xử lý của x nhất quán, rồi so phạm vi đầu vào với dữ liệu train. x = 100 nằm
    ngoài miền đã quan sát nên đây là ngoại suy. Sai số nhỏ trong miền 1–10 không chứng minh dự đoán ngoài miền
    đáng tin; cần dữ liệu phù hợp hoặc giới hạn phạm vi sử dụng.
  answer_en: Check that x uses the same units and preprocessing, then compare its range with the training data.
    x = 100 is outside the observed range, so this is extrapolation. Small errors within 1–10 do not validate
    predictions outside that range; collect relevant data or restrict the model's use.
  hint_vi: So sánh miền dữ liệu dùng để khớp với miền đang dự đoán.
  hint_en: Compare the fitted data range with the prediction range.
- id: phase-03-classical-ml-models-1-interview
  type: interview
  question_vi: Vì sao chọn hồi quy tuyến tính làm baseline, và khi nào hệ số của nó khó diễn giải?
  question_en: Why use linear regression as a baseline, and when can its coefficients be difficult to interpret?
  answer_vi: Cách tính dự đoán đơn giản và các hệ số giúp mô tả quan hệ giữa đặc trưng với mục tiêu. Tuy nhiên,
    các đặc trưng tương quan làm khó tách riêng vai trò của từng hệ số, và quan hệ phi tuyến có thể không được
    biểu diễn tốt bằng các đặc trưng hiện có. Dùng sai số kiểm định và phần dư để đánh giá giới hạn đó.
  answer_en: Its prediction rule is simple, and coefficients help describe feature–target relationships. However,
    correlated features make individual effects difficult to separate, and the supplied features may not capture
    nonlinear relationships. Use validation errors and residuals to assess these limitations.
  hint_vi: Phân biệt khả năng đọc công thức với khả năng diễn giải từng hệ số một cách độc lập.
  hint_en: A readable formula does not guarantee that each coefficient has an independent interpretation.
---
# Hồi quy tuyến tính / Linear regression

Hồi quy tuyến tính biểu diễn dự đoán bằng tổng có trọng số của các đặc trưng cộng một hệ số chặn. Tuyến tính ở đây nói về hệ số; bạn vẫn có thể đưa x² vào như một đặc trưng đã biến đổi.

Với dự đoán y=2x+1, tăng x một đơn vị làm dự đoán tăng 2 khi các đặc trưng khác giữ nguyên. Đây là quan hệ trong mô hình, không chứng minh việc can thiệp tăng x sẽ gây ra thay đổi tương ứng ngoài đời. Các đặc trưng tương quan cũng làm hệ số khó diễn giải riêng lẻ.

Tự kiểm tra: đường khớp tốt trong khoảng x từ 1 đến 10 có đáng tin khi x=100 không? Chưa có cơ sở; đó là ngoại suy. Xem sai số và phạm vi dữ liệu trước khi sử dụng dự đoán ngoài miền đã quan sát.

Ví dụ mã khớp một đường thẳng một biến bằng thư viện chuẩn và so với baseline trung bình chỉ học từ tập train. Hai mẫu kiểm định được giữ riêng; MSE bằng 0 trên dữ liệu đồ chơi không chứng minh mô hình đủ tốt cho dữ liệu thật.

## Thực hành

Huấn luyện mô hình hồi quy tuyến tính và đọc sai số trên tập kiểm định.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
