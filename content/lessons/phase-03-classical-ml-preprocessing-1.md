---
lesson_id: phase-03-classical-ml-preprocessing-1
phase_id: phase-03-classical-ml
module_id: preprocessing
title_vi: Xử lý dữ liệu thiếu
title_en: Missing data
summary_vi: Điền trung vị từ train, giữ cờ thiếu và kiểm tra cột toàn thiếu.
summary_en: Impute with a training median, preserve missingness indicators, and handle all-missing columns
  explicitly.
learning_objectives:
- Tính trung vị chỉ từ train và biến đổi dữ liệu mới mà không fit lại.
- Phân biệt None, số 0 và mã thiếu; giải thích cờ thiếu.
- Kiểm tra train toàn thiếu và so trung vị với trung bình.
learning_objectives_en:
- Fit a median on training values and reuse it unchanged.
- Distinguish None, zero and sentinels; explain missingness flags.
- Test all-missing training data and compare median with mean.
prerequisites:
- phase-03-classical-ml-models-4
- phase-02-math-ml-linear-algebra-1
key_terms:
- missing
- data
- dataset
- feature
- baseline
- evaluation
- preprocessing
concept_notes_vi: |-
  Thiếu là chưa biết, không phải số 0. Ví dụ thu nhập 0 vẫn là một quan sát hợp lệ; None trong bài này mới biểu diễn thiếu. Trước khi điền, đo tỷ lệ thiếu theo cột/nhóm và kiểm tra nguyên nhân. Xóa mọi dòng thiếu có thể loại có hệ thống một nhóm người dùng.

  Tách train/validation/test trước. Fit lấy trung vị của các giá trị quan sát trong train; transform thay None bằng trung vị đã lưu và thêm cờ 1 khi thiếu, 0 khi có. Validation/test không được thay đổi trung vị. Trong cross-validation, fit lại trên phần train của từng fold. Pipeline giúp giữ đúng ranh giới này khi dùng thư viện.

  Với train [10, None, 20, 100], trung vị là 20 còn trung bình là 43,33. Trung vị ít bị 100 kéo lệch hơn, nhưng không khôi phục giá trị thật hoặc bảo đảm mô hình tốt hơn. Cờ thiếu chỉ hữu ích nếu trạng thái đó cũng có sẵn khi dự đoán. Cột toàn thiếu không có trung vị: ví dụ báo lỗi; thực tế phải chọn bỏ cột hoặc hằng số có lý do từ train, giữ schema nhất quán.

  Hợp đồng ví dụ chỉ nhận số hữu hạn hoặc None; NaN, vô cực, chuỗi và boolean bị từ chối. Nếu nguồn dùng -999 hay chuỗi rỗng, chuyển về None sau khi xác nhận đó là mã thiếu, tránh biến một giá trị thật thành thiếu.
concept_notes_en: |-
  Missing means unknown, not zero. An income of zero is an observed value; this example uses None for missingness. Inspect missing rates by column/group and collection causes first. Dropping every incomplete row can systematically remove a user group.

  Split train/validation/test first. Fit computes the median of observed training values; transform fills None with the saved median and adds a missingness flag (1 missing, 0 observed). Validation/test must not change that median. In cross-validation, refit inside each training fold. A library Pipeline helps maintain this boundary.

  For training [10, None, 20, 100], the median is 20 and the mean is 43.33. The median is less affected by 100, but neither recovers truth nor guarantees better predictions. A missingness flag must be available at prediction time. An entirely missing column has no median: this example rejects it; a real pipeline needs a justified training-time constant or column-removal policy with a stable schema.

  The example accepts finite numbers or None only; NaN, infinity, strings and booleans fail validation. If a source uses -999 or empty strings, normalize them to None only after verifying the sentinel contract so real values are not erased.
why_it_matters_vi: Giữ cách xử lý dữ liệu nhất quán giữa huấn luyện và dự đoán để tránh rò rỉ hoặc sai
  lệch.
why_it_matters_en: Build consistent, leakage-safe preprocessing that turns messy data into reproducible
  features.
study_steps_vi:
- Đọc khái niệm và mục Univariate feature imputation của tài liệu.
- Lưu mã, chạy python missing_demo.py và đối chiếu output.
- Chạy ví dụ. Thêm 1000 vào validation và kiểm tra trung vị vẫn 20. So với điền bằng trung bình train
  130/3; ghi hai kết quả khi đầu vào là None.
- Chạy các ca biên, lưu kết quả và trả lời bốn thẻ ôn tập.
study_steps_en:
- Read the concepts and Univariate feature imputation in the reference.
- Save the code, run python missing_demo.py, and compare the output.
- Run the example. Add 1000 to validation and confirm the median stays 20. Compare with training-mean
  imputation using 130/3; record both outputs for None.
- Run boundary cases, save results, and answer the four review cards.
practice_plan:
  vi:
    task: Chạy ví dụ. Thêm 1000 vào validation và kiểm tra trung vị vẫn 20. So với điền bằng trung bình
      train 130/3; ghi hai kết quả khi đầu vào là None.
    deliverables:
    - missing_demo.py và output đúng mẫu
    - Assert cho None, 0, tập rỗng và train toàn thiếu
    - Ghi trung vị 20, trung bình 130/3 và giới hạn của cách điền
    checkpoint: None thành (20.0, 1), 0 thành (0.0, 0); thay validation không đổi fit.
    stretch: Dùng train [10, 20, 30, 100] và xác nhận trung vị 25; giải thích cách lấy trung bình hai
      giá trị giữa.
  en:
    task: Run the example. Add 1000 to validation and confirm the median stays 20. Compare with training-mean
      imputation using 130/3; record both outputs for None.
    deliverables:
    - missing_demo.py with matching output
    - Assertions for None, zero, empty input and all-missing train
    - Median 20, mean 130/3 and a limitation of imputation
    checkpoint: None becomes (20.0, 1), zero becomes (0.0, 0); validation changes cannot alter the fit.
    stretch: Use train [10, 20, 30, 100] and verify median 25; explain averaging the two middle values.
interview_questions:
  vi:
  - 'Train [10, None, 20, 100], validation [None, 0]: kết quả?'
  - Train toàn None thì sửa lỗi thế nào?
  - Trung vị tốt hơn trung bình trong mọi trường hợp không?
  en:
  - With train [10, None, 20, 100] and validation [None, 0], what is the output?
  - What should happen when training is entirely None?
  - Is median imputation always better than mean imputation?
formulas: []
code_examples:
- language: python
  title: Fit a training median and retain missingness
  code: |-
    from math import isfinite
    from statistics import median


    def validate_values(values):
        for value in values:
            if value is not None and (
                isinstance(value, bool)
                or not isinstance(value, (int, float))
                or not isfinite(value)
            ):
                raise ValueError("expected finite numbers or None")


    def fit_median(train_values):
        validate_values(train_values)
        observed = [value for value in train_values if value is not None]
        if not observed:
            raise ValueError("training column has no observed values")
        return float(median(observed))


    def transform_missing(values, fill_value):
        validate_values(values)
        validate_values([fill_value])
        if fill_value is None:
            raise ValueError("fill value must be observed")
        return [
            (float(fill_value if value is None else value), int(value is None))
            for value in values
        ]


    if __name__ == "__main__":
        training = [10, None, 20, 100]
        frozen_median = fit_median(training)
        print(f"train_median={frozen_median:.1f}")
        print("validation=", transform_missing([None, 0, 200], frozen_median), sep="")
        print("test=", transform_missing([None, 30], frozen_median), sep="")
        print(f"median_after_transform={frozen_median:.1f}")
  status: runnable
  purpose_vi: Tách bước học trung vị và bước điền; xuất cặp (giá trị, cờ thiếu).
  purpose_en: Separate fitting from transformation; emit (value, missing flag) pairs.
  setup: Python 3.11+; standard library only. Save as missing_demo.py and run python missing_demo.py.
  setup_vi: Python 3.11+; chỉ thư viện chuẩn. Lưu thành missing_demo.py rồi chạy python missing_demo.py.
  setup_en: Python 3.11+; standard library only. Save as missing_demo.py and run python missing_demo.py.
  expected_output: |-
    train_median=20.0
    validation=[(20.0, 1), (0.0, 0), (200.0, 0)]
    test=[(20.0, 1), (30.0, 0)]
    median_after_transform=20.0
  edge_case_vi: fit_median([]) và fit_median([None, None]) báo ValueError; transform_missing([], 20) trả
    []; NaN bị từ chối. Số 0 giữ cờ 0.
  edge_case_en: fit_median([]) and fit_median([None, None]) raise ValueError; transform_missing([], 20)
    returns []; NaN is rejected. Zero retains flag 0.
  explanation_vi: Ba giá trị đã sắp là 10, 20, 100 nên trung vị 20. Giá trị validation 200 không tham
    gia fit. Mỗi lần transform dùng cùng số đã lưu, không sửa đầu vào.
  explanation_en: Sorted observed values are 10, 20, 100, so the median is 20. Validation value 200 never
    enters fit. Every transform reuses the saved scalar without changing input data.
resources:
- title: 'scikit-learn: Imputation'
  url: https://scikit-learn.org/stable/modules/impute.html
  language: en
  kind: official
  required: true
  purpose_vi: Đối chiếu chiến lược điền và cờ thiếu.
  purpose_en: Compare imputation strategies and missingness indicators.
  read_vi: Đọc Univariate feature imputation và Marking imputed values; đối chiếu với hợp đồng None của
    ví dụ.
  read_en: Read Univariate feature imputation and Marking imputed values; compare with the example None
    contract.
exercise_ids:
- exercise-3-preprocessing
review_item_ids:
- phase-03-classical-ml-preprocessing-1-recall
- phase-03-classical-ml-preprocessing-1-application
- phase-03-classical-ml-preprocessing-1-debug
- phase-03-classical-ml-preprocessing-1-interview
estimated_minutes: 60
completion_checklist:
- missing_demo.py và output đúng mẫu
- Assert cho None, 0, tập rỗng và train toàn thiếu
- Ghi trung vị 20, trung bình 130/3 và giới hạn của cách điền
completion_criteria:
- None thành (20.0, 1), 0 thành (0.0, 0); thay validation không đổi fit.
- Các ca lỗi trả ValueError; giải thích được vì sao không fit trên test.
common_mistakes:
- Fit trung vị trên toàn bộ dữ liệu.
- Đổi số 0 thật thành thiếu.
- Tự coi train toàn thiếu có trung vị 0.
next_lessons:
- phase-03-classical-ml-preprocessing-2
- phase-03-classical-ml-preprocessing-3
review_question_vi: Vì sao không điền mọi giá trị thiếu bằng 0?
review_question_en: Why not fill every missing value with zero?
review_answer_vi: 0 có thể là giá trị thật. None là chưa biết; điền trung vị train và giữ cờ thiếu phân
  biệt hai trạng thái nhưng không khôi phục sự thật.
review_answer_en: Zero may be a genuine observation. None is unknown; a training median plus a missingness
  flag distinguishes states but cannot recover truth.
review_cards:
- id: phase-03-classical-ml-preprocessing-1-recall
  type: recall
  question_vi: Vì sao không điền mọi giá trị thiếu bằng 0?
  question_en: Why not fill every missing value with zero?
  answer_vi: 0 có thể là giá trị thật. None là chưa biết; điền trung vị train và giữ cờ thiếu phân biệt
    hai trạng thái nhưng không khôi phục sự thật.
  answer_en: Zero may be a genuine observation. None is unknown; a training median plus a missingness
    flag distinguishes states but cannot recover truth.
  hint_vi: So sánh (0, 0) với (20, 1).
  hint_en: Compare (0, 0) with (20, 1).
- id: phase-03-classical-ml-preprocessing-1-application
  type: application
  question_vi: 'Train [10, None, 20, 100], validation [None, 0]: kết quả?'
  question_en: With train [10, None, 20, 100] and validation [None, 0], what is the output?
  answer_vi: Trung vị 20; [(20.0, 1), (0.0, 0)]. Không tính lại trung vị trên validation.
  answer_en: Median 20; [(20.0, 1), (0.0, 0)]. Do not recompute the median on validation.
  hint_vi: Bỏ None khi fit, giữ vị trí khi transform.
  hint_en: Ignore None during fit, preserve positions during transform.
- id: phase-03-classical-ml-preprocessing-1-debug
  type: debug
  question_vi: Train toàn None thì sửa lỗi thế nào?
  question_en: What should happen when training is entirely None?
  answer_vi: 'Không có thống kê để học: báo lỗi rồi chọn chính sách bỏ cột hoặc hằng số có lý do và schema
    ổn định. Không mượn test để tính trung vị.'
  answer_en: 'There is no statistic to learn: fail, then choose a justified constant or column removal
    with stable schema. Do not borrow test values.'
  hint_vi: Có giá trị nào để lấy trung vị không?
  hint_en: Are there observed values to take a median of?
- id: phase-03-classical-ml-preprocessing-1-interview
  type: interview
  question_vi: Trung vị tốt hơn trung bình trong mọi trường hợp không?
  question_en: Is median imputation always better than mean imputation?
  answer_vi: Không. Trung vị ít nhạy với ngoại lệ nhưng làm mất biến thiên và có thể lệch nhóm. So trên
    cùng validation, kiểm tra tỷ lệ thiếu theo nhóm; chỉ train học tham số.
  answer_en: No. Median is less outlier-sensitive but loses variation and can bias groups. Compare on
    the same validation set, inspect group missingness, and learn parameters only on train.
  hint_vi: Tách tính bền với ngoại lệ khỏi chất lượng dự đoán.
  hint_en: Separate resistance to outliers from predictive quality.
completion_checklist_en:
- missing_demo.py with matching output
- Assertions for None, zero, empty input and all-missing train
- Median 20, mean 130/3 and a limitation of imputation
completion_criteria_en:
- None becomes (20.0, 1), zero becomes (0.0, 0); validation changes cannot alter the fit.
- Failure cases raise ValueError; explain why test data must not be fitted.
common_mistakes_en:
- Fitting a median on the full dataset.
- Treating genuine zeros as missing.
- Assuming an all-missing training column has median zero.
---
# Xử lý dữ liệu thiếu / Missing data

Thiếu là chưa biết, không phải số 0. Ví dụ thu nhập 0 vẫn là một quan sát hợp lệ; None trong bài này mới biểu diễn thiếu. Trước khi điền, đo tỷ lệ thiếu theo cột/nhóm và kiểm tra nguyên nhân. Xóa mọi dòng thiếu có thể loại có hệ thống một nhóm người dùng.

Tách train/validation/test trước. Fit lấy trung vị của các giá trị quan sát trong train; transform thay None bằng trung vị đã lưu và thêm cờ 1 khi thiếu, 0 khi có. Validation/test không được thay đổi trung vị. Trong cross-validation, fit lại trên phần train của từng fold. Pipeline giúp giữ đúng ranh giới này khi dùng thư viện.

Với train [10, None, 20, 100], trung vị là 20 còn trung bình là 43,33. Trung vị ít bị 100 kéo lệch hơn, nhưng không khôi phục giá trị thật hoặc bảo đảm mô hình tốt hơn. Cờ thiếu chỉ hữu ích nếu trạng thái đó cũng có sẵn khi dự đoán. Cột toàn thiếu không có trung vị: ví dụ báo lỗi; thực tế phải chọn bỏ cột hoặc hằng số có lý do từ train, giữ schema nhất quán.

Hợp đồng ví dụ chỉ nhận số hữu hạn hoặc None; NaN, vô cực, chuỗi và boolean bị từ chối. Nếu nguồn dùng -999 hay chuỗi rỗng, chuyển về None sau khi xác nhận đó là mã thiếu, tránh biến một giá trị thật thành thiếu.

Missing means unknown, not zero. An income of zero is an observed value; this example uses None for missingness. Inspect missing rates by column/group and collection causes first. Dropping every incomplete row can systematically remove a user group.

Split train/validation/test first. Fit computes the median of observed training values; transform fills None with the saved median and adds a missingness flag (1 missing, 0 observed). Validation/test must not change that median. In cross-validation, refit inside each training fold. A library Pipeline helps maintain this boundary.

For training [10, None, 20, 100], the median is 20 and the mean is 43.33. The median is less affected by 100, but neither recovers truth nor guarantees better predictions. A missingness flag must be available at prediction time. An entirely missing column has no median: this example rejects it; a real pipeline needs a justified training-time constant or column-removal policy with a stable schema.

The example accepts finite numbers or None only; NaN, infinity, strings and booleans fail validation. If a source uses -999 or empty strings, normalize them to None only after verifying the sentinel contract so real values are not erased.
