---
lesson_id: phase-03-classical-ml-preprocessing-3
phase_id: phase-03-classical-ml
module_id: preprocessing
title_vi: Chuẩn hóa và biến đổi dữ liệu
title_en: Scaling and transformations
summary_vi: Chuẩn hóa bằng thống kê train, xử lý cột hằng và phân biệt đổi thang đo với log.
summary_en: Scale using training statistics, handle constant columns, and distinguish rescaling from log
  transforms.
learning_objectives:
- Tính mean, variance và scale chỉ từ train.
- Giải thích đầu ra khi train hằng và test vượt khoảng train.
- Phân biệt standardization với log và kiểm tra miền giá trị.
learning_objectives_en:
- Compute mean, variance and scale only from train.
- Explain constant-column outputs and values beyond the training range.
- Distinguish standardization from log and validate domains.
prerequisites:
- phase-03-classical-ml-preprocessing-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- scaling
- transformation
- dataset
- feature
- baseline
- evaluation
- preprocessing
concept_notes_vi: |-
  Standardization tính z=(x−mean_train)/scale_train. Ví dụ dùng phương sai tổng thể: tổng bình phương độ lệch chia n (ddof=0), giống quy ước StandardScaler. Fit chỉ trên train, transform validation/test với cùng mean và scale. Trong cross-validation, fit trong từng fold train; khi dùng thư viện, đặt scaler trong Pipeline.

  Với train [10,20], mean=15 và scale=5: train thành [-1,1], giá trị mới 25 thành 2. Nếu train hằng [7,7], phương sai 0; chọn scale=1 để tránh chia 0. Giá trị 7 thành 0, giá trị mới 9 thành 2. Không có cơ sở buộc mọi dữ liệu mới thành 0; khác biệt này có thể báo hiệu thay đổi phân bố.

  Min–max là (x−min_train)/(max_train−min_train). Train [10,20] đưa 25 thành 1,5, không bảo đảm test nằm trong [0,1]. Không fit lại để ép test vào khoảng; clipping phải là chính sách rõ và làm mất thông tin vượt biên. Khi min=max cũng cần quy tắc cột hằng.

  Đổi thang đo không làm dữ liệu có phân bố chuẩn. Log làm nén đuôi phải theo cách phi tuyến. log1p(x) có miền toán học x>−1; hợp đồng số đếm của ví dụ chặt hơn: x≥0. Đây là ví dụ riêng; nếu dùng log rồi scale, phải fit scaler trên log(train). Chuẩn hóa thường quan trọng với khoảng cách, regularization và gradient, ít cần hơn cho cây chia ngưỡng từng cột. Ngoại lệ vẫn có thể kéo mean/scale lệch.
concept_notes_en: |-
  Standardization computes z=(x−mean_train)/scale_train. This example uses population variance: squared deviations divided by n (ddof=0), matching StandardScaler. Fit only on train and transform validation/test with the same mean and scale. During cross-validation, fit inside each training fold; use a Pipeline with library estimators.

  For train [10,20], mean=15 and scale=5: train becomes [-1,1] and a new 25 becomes 2. Constant training [7,7] has zero variance; use scale=1 to avoid division by zero. A 7 becomes 0 but a new 9 becomes 2. Forcing all future values to zero would erase change that may indicate drift.

  Min–max computes (x−min_train)/(max_train−min_train). Training [10,20] maps 25 to 1.5; test is not guaranteed to lie in [0,1]. Do not refit to force test into range. Clipping requires an explicit policy and loses out-of-range information. Equal training min/max also requires a constant-column policy.

  Rescaling does not create a normal distribution. Log compresses a right tail nonlinearly. The mathematical domain of log1p(x) is x>−1; this example deliberately enforces the narrower nonnegative-count domain x≥0. Log is demonstrated separately; for log then scale, fit the scaler on log(train). Scaling often matters for distances, regularization and gradients, and less for trees splitting individual features. Outliers can still distort mean/scale.
why_it_matters_vi: Giữ cách xử lý dữ liệu nhất quán giữa huấn luyện và dự đoán để tránh rò rỉ hoặc sai
  lệch.
why_it_matters_en: Build consistent, leakage-safe preprocessing that turns messy data into reproducible
  features.
study_steps_vi:
- Đọc công thức và mục Standardization của tài liệu.
- Lưu mã, chạy python scaling_demo.py.
- Chạy scaling_demo.py. Thêm 100 vào validation và xác nhận state vẫn (15,5), đầu ra mới bằng 17. Tự tính
  min–max cho 25 với train [10,20].
- Chạy ca biên và trả lời thẻ ôn tập.
study_steps_en:
- Read the formulas and Standardization in the reference.
- Save code and run python scaling_demo.py.
- 'Run scaling_demo.py. Add 100 to validation: state remains (15,5) and its output is 17. Calculate min–max
  for 25 with train [10,20].'
- Run boundary cases and answer the review cards.
practice_plan:
  vi:
    task: Chạy scaling_demo.py. Thêm 100 vào validation và xác nhận state vẫn (15,5), đầu ra mới bằng
      17. Tự tính min–max cho 25 với train [10,20].
    deliverables:
    - Mã và output mẫu
    - Assert train hằng, NaN, train rỗng và log âm
    - Phép tính standardization 17 và min–max 1,5
    checkpoint: Train có mean đầu ra 0; test không được học lại tham số.
    stretch: 'Thử log trước scale: fit trên log_counts(train), rồi transform log_counts(validation).'
  en:
    task: 'Run scaling_demo.py. Add 100 to validation: state remains (15,5) and its output is 17. Calculate
      min–max for 25 with train [10,20].'
    deliverables:
    - Code and matching output
    - Assertions for constant train, NaN, empty train and negative log input
    - Calculations showing standardized 17 and min–max 1.5
    checkpoint: Transformed train has mean zero; test cannot refit parameters.
    stretch: 'Try log before scaling: fit on log_counts(train), then transform log_counts(validation).'
interview_questions:
  vi:
  - 'Train [10,20]: standardization và min–max của 25 là gì?'
  - 'Train [7,7], validation [7,9]: tránh chia 0 thế nào?'
  - Khi nào nên scale và giới hạn là gì?
  en:
  - With train [10,20], what are standardized and min–max values for 25?
  - For train [7,7] and validation [7,9], how is division by zero avoided?
  - When is scaling useful and what are its limitations?
formulas:
- mean_train = sum(train)/n; variance_train = sum((x−mean_train)²)/n
- z = (x−mean_train)/(sqrt(variance_train) if variance_train>0 else 1)
- minmax(x) = (x−min_train)/(max_train−min_train), when max_train>min_train
code_examples:
- language: python
  title: Training-only standardization and a guarded log transform
  code: |-
    from math import isfinite, log1p, sqrt


    def validate_numbers(values):
        if any(isinstance(value, bool) or not isinstance(value, (int, float))
               or not isfinite(value) for value in values):
            raise ValueError("expected finite numbers")


    def fit_scaler(train_values):
        validate_numbers(train_values)
        if not train_values:
            raise ValueError("training values must not be empty")
        mean = sum(train_values) / len(train_values)
        variance = sum((value - mean) ** 2 for value in train_values) / len(train_values)
        scale = sqrt(variance) if variance > 0 else 1.0
        return mean, scale


    def transform_scaled(values, state):
        validate_numbers(values)
        if len(state) != 2:
            raise ValueError("state must contain mean and positive scale")
        validate_numbers(state)
        mean, scale = state
        if scale <= 0:
            raise ValueError("scale must be positive")
        return [(value - mean) / scale for value in values]


    def log_counts(values):
        validate_numbers(values)
        if any(value < 0 for value in values):
            raise ValueError("counts must be nonnegative")
        return [log1p(value) for value in values]


    if __name__ == "__main__":
        state = fit_scaler([10, 20])
        print("state=", state, sep="")
        print("train=", transform_scaled([10, 20], state), sep="")
        print("validation=", transform_scaled([15, 25], state), sep="")
        constant_state = fit_scaler([7, 7])
        print("constant_state=", constant_state, sep="")
        print("constant_validation=", transform_scaled([7, 9], constant_state), sep="")
        print("log_counts=", [round(value, 4) for value in log_counts([0, 3, 8])], sep="")
  status: runnable
  setup: Python 3.11+; standard library only. Save as scaling_demo.py and run python scaling_demo.py.
  setup_vi: Python 3.11+; chỉ thư viện chuẩn. Lưu scaling_demo.py và chạy python scaling_demo.py.
  setup_en: Python 3.11+; standard library only. Save as scaling_demo.py and run python scaling_demo.py.
  purpose_vi: Tính trung bình/phương sai train, xử lý cột hằng và kiểm tra miền log.
  purpose_en: Compute training mean/variance, handle constant columns, and guard log inputs.
  expected_output: |-
    state=(15.0, 5.0)
    train=[-1.0, 1.0]
    validation=[0.0, 2.0]
    constant_state=(7.0, 1.0)
    constant_validation=[0.0, 2.0]
    log_counts=[0.0, 1.3863, 2.1972]
  edge_case_vi: Train rỗng, NaN hoặc scale=0 báo ValueError. log_counts([-1]) báo lỗi; transform_scaled([],
    state) trả []. Train hằng dùng scale 1.
  edge_case_en: Empty train, NaN or scale=0 raises ValueError. log_counts([-1]) fails; transform_scaled([],
    state) returns []. Constant train uses scale 1.
  explanation_vi: Train có mean 15, variance ((10−15)²+(20−15)²)/2=25 nên scale 5. Test 25 thành 2. Cột
    hằng được trừ mean rồi chia 1, không ép mọi giá trị mới thành 0. Log là phép biến đổi riêng, chưa
    ghép vào scaler.
  explanation_en: Training mean is 15; variance is ((10−15)²+(20−15)²)/2=25, so scale is 5. A new 25 becomes
    2. Constant columns subtract their mean and divide by 1; new values are not forced to zero. Log is
    demonstrated separately from scaling.
resources:
- title: 'scikit-learn: Preprocessing data'
  url: https://scikit-learn.org/stable/modules/preprocessing.html
  language: en
  kind: official
  required: true
  purpose_vi: Đối chiếu standardization, min–max và biến đổi phi tuyến.
  purpose_en: Compare standardization, min–max and nonlinear transformations.
  read_vi: Đọc Standardization và Non-linear transformation; kiểm tra miền và ranh giới fit/transform.
  read_en: Read Standardization and Non-linear transformation; inspect domains and the fit/transform boundary.
exercise_ids:
- exercise-3-preprocessing
review_item_ids:
- phase-03-classical-ml-preprocessing-3-recall
- phase-03-classical-ml-preprocessing-3-application
- phase-03-classical-ml-preprocessing-3-debug
- phase-03-classical-ml-preprocessing-3-interview
estimated_minutes: 60
completion_checklist:
- Mã và output mẫu
- Assert train hằng, NaN, train rỗng và log âm
- Phép tính standardization 17 và min–max 1,5
completion_criteria:
- Train có mean đầu ra 0; test không được học lại tham số.
- Assert train hằng, NaN, train rỗng và log âm
common_mistakes:
- Tính mean/scale trên test.
- Chia cho 0 ở cột hằng.
- Cho rằng standardized nghĩa là phân bố chuẩn hoặc min–max test luôn thuộc [0,1].
next_lessons:
- phase-03-classical-ml-preprocessing-4
- phase-03-classical-ml-evaluation-1
review_question_vi: Standardization học gì và log khác ở đâu?
review_question_en: What does standardization learn, and how is log different?
review_answer_vi: Standardization học mean và độ lệch chuẩn từ train, rồi tính (x−mean)/scale. Log là
  biến đổi phi tuyến nén đuôi; cả hai không bảo đảm phân bố chuẩn.
review_answer_en: Standardization learns training mean and standard deviation, then computes (x−mean)/scale.
  Log is nonlinear tail compression; neither guarantees a normal distribution.
review_cards:
- id: phase-03-classical-ml-preprocessing-3-recall
  type: recall
  question_vi: Standardization học gì và log khác ở đâu?
  question_en: What does standardization learn, and how is log different?
  answer_vi: Standardization học mean và độ lệch chuẩn từ train, rồi tính (x−mean)/scale. Log là biến
    đổi phi tuyến nén đuôi; cả hai không bảo đảm phân bố chuẩn.
  answer_en: Standardization learns training mean and standard deviation, then computes (x−mean)/scale.
    Log is nonlinear tail compression; neither guarantees a normal distribution.
  hint_vi: Đổi đơn vị so với đổi hình dạng phân bố.
  hint_en: Contrast rescaling with changing distribution shape.
- id: phase-03-classical-ml-preprocessing-3-application
  type: application
  question_vi: 'Train [10,20]: standardization và min–max của 25 là gì?'
  question_en: With train [10,20], what are standardized and min–max values for 25?
  answer_vi: 'Mean 15, variance 25, scale 5: (25−15)/5=2. Min–max là (25−10)/(20−10)=1,5. Không fit lại
    trên test.'
  answer_en: 'Mean 15, variance 25, scale 5: (25−15)/5=2. Min–max is (25−10)/(20−10)=1.5. Do not refit
    on test.'
  hint_vi: Chỉ lấy thống kê từ hai giá trị train.
  hint_en: Use statistics from the two training values only.
- id: phase-03-classical-ml-preprocessing-3-debug
  type: debug
  question_vi: 'Train [7,7], validation [7,9]: tránh chia 0 thế nào?'
  question_en: For train [7,7] and validation [7,9], how is division by zero avoided?
  answer_vi: Dùng mean 7 và scale 1 khi phương sai 0; validation thành [0,2]. Không ép 9 thành 0 hoặc
    fit lại để che thay đổi.
  answer_en: Use mean 7 and scale 1 for zero variance; validation becomes [0,2]. Do not force 9 to zero
    or refit to hide change.
  hint_vi: Vẫn trừ mean_train.
  hint_en: Still subtract mean_train.
- id: phase-03-classical-ml-preprocessing-3-interview
  type: interview
  question_vi: Khi nào nên scale và giới hạn là gì?
  question_en: When is scaling useful and what are its limitations?
  answer_vi: Khoảng cách và regularization phụ thuộc thang đo; cây chia ngưỡng ít nhạy hơn. Mean/scale
    nhạy ngoại lệ; so cùng validation và fit trong từng fold. Log cho số đếm phải từ chối số âm.
  answer_en: Distances and regularization depend on scale; threshold-splitting trees are less sensitive.
    Mean/scale remain outlier-sensitive; compare on the same validation set and fit inside each fold.
    Count log transforms must reject negative values.
  hint_vi: Nhớ miền log và ngoại lệ.
  hint_en: Remember log domains and outliers.
completion_checklist_en:
- Code and matching output
- Assertions for constant train, NaN, empty train and negative log input
- Calculations showing standardized 17 and min–max 1.5
completion_criteria_en:
- Transformed train has mean zero; test cannot refit parameters.
- Assertions for constant train, NaN, empty train and negative log input
common_mistakes_en:
- Computing test mean/scale.
- Dividing by zero on constant columns.
- Assuming standardized means normally distributed or test min–max always lies in [0,1].
---
# Chuẩn hóa và biến đổi dữ liệu / Scaling and transformations

Standardization tính z=(x−mean_train)/scale_train. Ví dụ dùng phương sai tổng thể: tổng bình phương độ lệch chia n (ddof=0), giống quy ước StandardScaler. Fit chỉ trên train, transform validation/test với cùng mean và scale. Trong cross-validation, fit trong từng fold train; khi dùng thư viện, đặt scaler trong Pipeline.

Với train [10,20], mean=15 và scale=5: train thành [-1,1], giá trị mới 25 thành 2. Nếu train hằng [7,7], phương sai 0; chọn scale=1 để tránh chia 0. Giá trị 7 thành 0, giá trị mới 9 thành 2. Không có cơ sở buộc mọi dữ liệu mới thành 0; khác biệt này có thể báo hiệu thay đổi phân bố.

Min–max là (x−min_train)/(max_train−min_train). Train [10,20] đưa 25 thành 1,5, không bảo đảm test nằm trong [0,1]. Không fit lại để ép test vào khoảng; clipping phải là chính sách rõ và làm mất thông tin vượt biên. Khi min=max cũng cần quy tắc cột hằng.

Đổi thang đo không làm dữ liệu có phân bố chuẩn. Log làm nén đuôi phải theo cách phi tuyến. log1p(x) có miền toán học x>−1; hợp đồng số đếm của ví dụ chặt hơn: x≥0. Đây là ví dụ riêng; nếu dùng log rồi scale, phải fit scaler trên log(train). Chuẩn hóa thường quan trọng với khoảng cách, regularization và gradient, ít cần hơn cho cây chia ngưỡng từng cột. Ngoại lệ vẫn có thể kéo mean/scale lệch.

Standardization computes z=(x−mean_train)/scale_train. This example uses population variance: squared deviations divided by n (ddof=0), matching StandardScaler. Fit only on train and transform validation/test with the same mean and scale. During cross-validation, fit inside each training fold; use a Pipeline with library estimators.

For train [10,20], mean=15 and scale=5: train becomes [-1,1] and a new 25 becomes 2. Constant training [7,7] has zero variance; use scale=1 to avoid division by zero. A 7 becomes 0 but a new 9 becomes 2. Forcing all future values to zero would erase change that may indicate drift.

Min–max computes (x−min_train)/(max_train−min_train). Training [10,20] maps 25 to 1.5; test is not guaranteed to lie in [0,1]. Do not refit to force test into range. Clipping requires an explicit policy and loses out-of-range information. Equal training min/max also requires a constant-column policy.

Rescaling does not create a normal distribution. Log compresses a right tail nonlinearly. The mathematical domain of log1p(x) is x>−1; this example deliberately enforces the narrower nonnegative-count domain x≥0. Log is demonstrated separately; for log then scale, fit the scaler on log(train). Scaling often matters for distances, regularization and gradients, and less for trees splitting individual features. Outliers can still distort mean/scale.
