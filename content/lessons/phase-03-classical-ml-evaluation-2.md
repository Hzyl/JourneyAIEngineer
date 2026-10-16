---
lesson_id: phase-03-classical-ml-evaluation-2
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Thước đo cho hồi quy
title_en: Regression metrics
summary_vi: Tính MAE, MSE và RMSE; so sánh sai số đều với một sai số lớn để thấy tác động của bình phương.
summary_en: Calculate MAE, MSE and RMSE; compare uniform errors with one large error to see the effect of squaring.
learning_objectives:
- Tính MAE/MSE/RMSE từ nhãn thật và dự đoán.
- Giải thích vì sao cùng MAE nhưng khác RMSE.
- Chọn thước đo theo chi phí sai số và ghi đơn vị.
learning_objectives_en:
- Compute MAE/MSE/RMSE from targets and predictions.
- Explain equal MAE but different RMSE.
- Choose a metric by error cost and report its units.
prerequisites:
- phase-03-classical-ml-evaluation-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- residual
- MAE
- MSE
- RMSE
- outlier
- target units
concept_notes_vi: |-
  Đặt sai số e_i = y_i − ŷ_i. MAE là trung bình |e_i|; MSE là trung bình e_i²; RMSE là căn MSE. Nếu mục tiêu tính bằng phút, MAE/RMSE tính bằng phút còn MSE bằng phút². Giá trị nhỏ hơn tốt hơn trên cùng bộ dữ liệu, đơn vị và nhiệm vụ.

  Bốn sai số [2,2,2,2] cho MAE=2, MSE=4, RMSE=2. Các sai số [0,0,0,8] cũng MAE=2 nhưng MSE=16, RMSE=4. Một sai số 8 đóng góp 64 vào tổng bình phương; cả bốn sai số 2 chỉ đóng góp 16.

  MAE phản ánh chi phí tăng tuyến tính theo độ lớn lỗi. MSE/RMSE nhạy hơn với lỗi lớn; trên cùng dữ liệu chúng xếp hạng mô hình giống nhau vì căn bậc hai tăng đơn điệu. Không kết luận RMSE=4 là gấp đôi mọi lỗi hoặc luôn chọn RMSE. Kiểm tra sai số từng mẫu/nhóm và hậu quả sử dụng.

  Ví dụ dùng dự đoán có sẵn, không huấn luyện mô hình. Trong dự án thật, so với baseline học từ tập train và chỉ báo kết quả trên dữ liệu chưa dùng để chọn mô hình.
concept_notes_en: |-
  Let error e_i = y_i − ŷ_i. MAE averages |e_i|; MSE averages e_i²; RMSE is the square root of MSE. If targets are minutes, MAE/RMSE are minutes and MSE is minutes². Lower is better on the same data, units and task.

  Four errors [2,2,2,2] give MAE=2, MSE=4, RMSE=2. Errors [0,0,0,8] also give MAE=2 but MSE=16 and RMSE=4. One error of 8 contributes 64 to the squared-error sum; all four errors of 2 contribute only 16.

  MAE reflects cost growing linearly with error size. MSE/RMSE emphasize large errors; on the same data they rank models identically because square root is increasing. RMSE=4 does not mean every error doubled, nor should RMSE always be preferred. Inspect sample/group errors and practical consequences.

  The example evaluates supplied predictions rather than fitting a model. In a real project, compare against a baseline learned from training data and report results on data not used for model selection.
why_it_matters_vi: Một điểm trung bình có thể che lỗi nghiêm trọng; thước đo và đơn vị phải phù hợp hậu quả
  của dự đoán sai.
why_it_matters_en: An average can hide severe errors; the metric and units must match the consequences of prediction
  mistakes.
study_steps_vi:
- Tính tay các sai số [2,2,2,2] và [0,0,0,8].
- Đọc Mean absolute error và Mean squared error trong tài liệu chính thức.
- Mở hướng dẫn Practice Lab, tải mã hoặc chép vào Colab/Python 3.11 rồi chạy.
- Đối chiếu ba thước đo và kiểm tra dự đoán hoàn hảo, đầu vào rỗng.
- Lưu kết quả với đơn vị phút/phút² và lý do chọn thước đo.
study_steps_en:
- Calculate the errors [2,2,2,2] and [0,0,0,8] by hand.
- Read Mean absolute error and Mean squared error in the official reference.
- Open the Practice Lab guide, download the code or copy it into Colab/Python 3.11 and run it.
- Compare the three metrics and test perfect predictions and empty input.
- Save results with minute/minute² units and explain your metric choice.
practice_plan:
  vi:
    task: Đánh giá hai bộ dự đoán thời gian trên cùng bốn nhãn; giải thích cùng MAE nhưng RMSE khác nhau.
    deliverables:
    - Mã và output MAE/MSE/RMSE cho hai bộ dự đoán
    - Bảng sai số tuyệt đối và bình phương từng mẫu
    - Đơn vị, lựa chọn thước đo và một giới hạn
    checkpoint: Tự tính được MAE=2 cho cả hai; RMSE lần lượt 2 và 4.
    stretch: Đổi sai số lớn từ 8 thành 16 rồi tính lại; giải thích MSE tăng theo bình phương.
  en:
    task: Evaluate two time-prediction sets on the same four targets; explain equal MAE but different RMSE.
    deliverables:
    - Code and MAE/MSE/RMSE output for both prediction sets
    - Per-sample absolute and squared errors
    - Units, metric choice and one limitation
    checkpoint: Calculate MAE=2 for both and RMSE values of 2 and 4.
    stretch: Change the large error from 8 to 16 and recalculate; explain the squared contribution to MSE.
interview_questions:
  vi:
  - Tính thước đo cho sai số [0,0,0,8].
  - Sai số [-5,5] có trung bình 0; dự đoán có hoàn hảo không?
  - Khi nào cần xem RMSE bên cạnh MAE, và còn giới hạn gì?
  en:
  - Calculate the metrics for errors [0,0,0,8].
  - Errors [-5,5] average to zero; are predictions perfect?
  - When should RMSE accompany MAE, and what limitation remains?
formulas:
- e_i = y_i − ŷ_i
- MAE = Σ|e_i| / n
- MSE = Σ(e_i²) / n
- RMSE = √MSE
code_examples:
- language: python
  title: Equal MAE, different outlier cost
  code: |
    from math import isfinite, sqrt

    def regression_metrics(actual, predicted):
        if not actual or len(actual) != len(predicted):
            raise ValueError("non-empty aligned values are required")
        if not all(isfinite(value) for value in [*actual, *predicted]):
            raise ValueError("values must be finite")
        errors = [truth - guess for truth, guess in zip(actual, predicted)]
        mae = sum(abs(error) for error in errors) / len(errors)
        mse = sum(error ** 2 for error in errors) / len(errors)
        return {"mae": mae, "mse": mse, "rmse": sqrt(mse)}

    actual = [10, 10, 10, 10]
    predictions = {"uniform": [8, 8, 8, 8], "one_large": [10, 10, 10, 2]}
    for name, predicted in predictions.items():
        result = regression_metrics(actual, predicted)
        print(name, " ".join(f"{metric}={result[metric]:.3f}"
                             for metric in ("mae", "mse", "rmse")))
    assert regression_metrics(actual, actual) == {"mae": 0, "mse": 0, "rmse": 0}
  status: runnable
  purpose_vi: Đo đúng sai số hồi quy thay vì so khớp nhãn bằng accuracy.
  purpose_en: Measure regression errors rather than exact-label accuracy.
  setup: Python 3.11+; standard library only. Run in Colab or save as regression_metrics.py and run python
    regression_metrics.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành regression_metrics.py và chạy lệnh python regression_metrics.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as regression_metrics.py and run python regression_metrics.py from the folder containing the file.
  expected_output: |-
    uniform mae=2.000 mse=4.000 rmse=2.000
    one_large mae=2.000 mse=16.000 rmse=4.000
  edge_case_vi: Dự đoán hoàn hảo cho ba số 0. Danh sách rỗng, khác độ dài hoặc NaN/infinity gây ValueError.
  edge_case_en: Perfect predictions give three zeros. Empty lists, unequal lengths or NaN/infinity raise ValueError.
  explanation_vi: Fixture bốn mẫu cho phép tính tay và kiểm tra chi phí lỗi lớn; không chứng minh mô hình nào
    tốt hơn trên dân số.
  explanation_en: The four-row fixture supports hand calculation and comparison of large-error cost; it does
    not establish population-level model quality.
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
  url: https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc Mean absolute error, Mean squared error và Root mean squared error; kiểm tra đơn vị và chiều
    tốt/xấu.
  read_en: Read Mean absolute error, Mean squared error and Root mean squared error; verify units and which
    direction is better.
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
- phase-03-classical-ml-evaluation-2-recall
- phase-03-classical-ml-evaluation-2-application
- phase-03-classical-ml-evaluation-2-debug
- phase-03-classical-ml-evaluation-2-interview
estimated_minutes: 60
completion_checklist:
- Tái tạo hai dòng output và ghi đúng đơn vị.
- Giải thích tổng bình phương 16 so với 64.
- Kiểm tra dự đoán hoàn hảo và từ chối dữ liệu không hợp lệ.
completion_criteria:
- Tái tạo hai dòng output và ghi đúng đơn vị.
- Giải thích tổng bình phương 16 so với 64.
- Kiểm tra dự đoán hoàn hảo và từ chối dữ liệu không hợp lệ.
common_mistakes:
- Dùng accuracy cho mục tiêu liên tục.
- Lấy trung bình sai số có dấu làm lỗi triệt tiêu nhau.
- Báo MSE theo đơn vị gốc hoặc bỏ qua lỗi lớn.
next_lessons:
- phase-03-classical-ml-evaluation-3
- phase-03-classical-ml-evaluation-4
review_question_vi: MAE, MSE và RMSE khác nhau thế nào về công thức và đơn vị?
review_question_en: How do MAE, MSE and RMSE differ in formula and units?
review_answer_vi: MAE=mean(|e|), MSE=mean(e²), RMSE=√MSE. Với e tính bằng phút, MAE/RMSE là phút và MSE là
  phút²; cả ba không âm.
review_answer_en: MAE=mean(|e|), MSE=mean(e²), RMSE=√MSE. For errors in minutes, MAE/RMSE use minutes and MSE
  uses minutes²; all are nonnegative.
review_cards:
- id: phase-03-classical-ml-evaluation-2-recall
  type: recall
  question_vi: MAE, MSE và RMSE khác nhau thế nào về công thức và đơn vị?
  question_en: How do MAE, MSE and RMSE differ in formula and units?
  answer_vi: MAE=mean(|e|), MSE=mean(e²), RMSE=√MSE. Với e tính bằng phút, MAE/RMSE là phút và MSE là phút²;
    cả ba không âm.
  answer_en: MAE=mean(|e|), MSE=mean(e²), RMSE=√MSE. For errors in minutes, MAE/RMSE use minutes and MSE uses
    minutes²; all are nonnegative.
  hint_vi: Bình phương rồi lấy căn.
  hint_en: Square, then take the root.
- id: phase-03-classical-ml-evaluation-2-application
  type: application
  question_vi: Tính thước đo cho sai số [0,0,0,8].
  question_en: Calculate the metrics for errors [0,0,0,8].
  answer_vi: MAE=8/4=2; MSE=64/4=16; RMSE=4. So với [2,2,2,2], cùng MAE nhưng RMSE tăng từ 2 lên 4.
  answer_en: MAE=8/4=2; MSE=64/4=16; RMSE=4. Compared with [2,2,2,2], MAE is unchanged but RMSE rises from
    2 to 4.
  hint_vi: Chia tổng cho bốn mẫu.
  hint_en: Divide each sum by four samples.
- id: phase-03-classical-ml-evaluation-2-debug
  type: debug
  question_vi: Sai số [-5,5] có trung bình 0; dự đoán có hoàn hảo không?
  question_en: Errors [-5,5] average to zero; are predictions perfect?
  answer_vi: Không. Sai số có dấu triệt tiêu; MAE=5, MSE=25, RMSE=5. Dự đoán hoàn hảo yêu cầu mọi sai số bằng
    0; dùng trị tuyệt đối hoặc bình phương trước khi lấy trung bình.
  answer_en: No. Signed errors cancel; MAE=5, MSE=25, RMSE=5. Perfect predictions require every error to be
    zero; apply absolute value or squaring before averaging.
  hint_vi: Phân biệt độ lệch có dấu và độ lớn sai số.
  hint_en: Distinguish signed bias from error magnitude.
- id: phase-03-classical-ml-evaluation-2-interview
  type: interview
  question_vi: Khi nào cần xem RMSE bên cạnh MAE, và còn giới hạn gì?
  question_en: When should RMSE accompany MAE, and what limitation remains?
  answer_vi: Khi lỗi lớn gây hậu quả nặng, RMSE làm chúng nổi bật hơn MAE. Cả hai vẫn là số tổng hợp; xem từng
    nhóm/mẫu, đơn vị và baseline, không suy chất lượng thực tế từ bốn mẫu.
  answer_en: When large errors are especially costly, RMSE emphasizes them more than MAE. Both remain aggregates;
    inspect groups/samples, units and a baseline, and do not infer real-world quality from four rows.
  hint_vi: Liên hệ lỗi lớn với chi phí thực tế.
  hint_en: Connect large errors to practical cost.
completion_checklist_en:
- Reproduce both output lines with correct units.
- Explain squared-error sums of 16 versus 64.
- Test perfect predictions and reject invalid data.
completion_criteria_en:
- Reproduce both output lines with correct units.
- Explain squared-error sums of 16 versus 64.
- Test perfect predictions and reject invalid data.
common_mistakes_en:
- Use accuracy for continuous targets.
- Average signed errors and let them cancel.
- Report MSE in original units or ignore large errors.
---
# Thước đo cho hồi quy / Regression metrics

Đặt sai số e_i = y_i − ŷ_i. MAE là trung bình |e_i|; MSE là trung bình e_i²; RMSE là căn MSE. Nếu mục tiêu tính bằng phút, MAE/RMSE tính bằng phút còn MSE bằng phút². Giá trị nhỏ hơn tốt hơn trên cùng bộ dữ liệu, đơn vị và nhiệm vụ.

Bốn sai số [2,2,2,2] cho MAE=2, MSE=4, RMSE=2. Các sai số [0,0,0,8] cũng MAE=2 nhưng MSE=16, RMSE=4. Một sai số 8 đóng góp 64 vào tổng bình phương; cả bốn sai số 2 chỉ đóng góp 16.

MAE phản ánh chi phí tăng tuyến tính theo độ lớn lỗi. MSE/RMSE nhạy hơn với lỗi lớn; trên cùng dữ liệu chúng xếp hạng mô hình giống nhau vì căn bậc hai tăng đơn điệu. Không kết luận RMSE=4 là gấp đôi mọi lỗi hoặc luôn chọn RMSE. Kiểm tra sai số từng mẫu/nhóm và hậu quả sử dụng.

Ví dụ dùng dự đoán có sẵn, không huấn luyện mô hình. Trong dự án thật, so với baseline học từ tập train và chỉ báo kết quả trên dữ liệu chưa dùng để chọn mô hình.

## Practice / Thực hành

Đánh giá hai bộ dự đoán thời gian trên cùng bốn nhãn; giải thích cùng MAE nhưng RMSE khác nhau.

Evaluate two time-prediction sets on the same four targets; explain equal MAE but different RMSE.
