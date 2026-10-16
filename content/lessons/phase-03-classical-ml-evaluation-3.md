---
lesson_id: phase-03-classical-ml-evaluation-3
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Kiểm định chéo
title_en: Cross-validation
summary_vi: Chia các fold rời nhau, học lại baseline trong từng tập train và báo MAE từng fold cùng trung bình/độ
  phân tán.
summary_en: Build disjoint folds, refit a baseline within each training split and report fold MAEs with their
  mean and spread.
learning_objectives:
- Kiểm tra mỗi mẫu được đánh giá đúng một lần trong K-fold.
- Học trung bình mục tiêu chỉ từ train của từng fold.
- Báo điểm từng fold, trung bình, độ lệch chuẩn và giới hạn cách chia.
learning_objectives_en:
- Verify each sample is evaluated once in K-fold.
- Learn the target mean only from each fold training split.
- Report fold scores, mean, standard deviation and split limitations.
prerequisites:
- phase-03-classical-ml-evaluation-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- fold
- training split
- validation split
- train-only fitting
- mean baseline
- leakage
concept_notes_vi: |-
  K-fold chia dữ liệu phát triển thành K phần; mỗi lượt giữ một phần làm validation và dùng các phần còn lại làm train. Trong mỗi lượt, chỉ số train và validation phải rời nhau. Các tập train giữa các lượt có thể chồng lặp; điểm các fold không phải các phép thử độc lập.

  Ví dụ sáu thời gian giả lập [2,4,6,8,10,12] được xem là các quan sát độc lập, không có thứ tự thời gian hay nhóm. Ba fold validation là [0,1], [2,3], [4,5]. Baseline dự đoán bằng trung bình mục tiêu của riêng train: lần lượt 9,7,5. MAE validation tương ứng 6,1,6. Trung bình 4.333 và độ lệch chuẩn mô tả 2.357 cho thấy phụ thuộc cách chia.

  Ví dụ chỉ fit baseline; không có bước chuẩn hóa. Khi thêm imputation, scaling hoặc chọn đặc trưng, fit chúng bên trong từng train rồi transform validation; Pipeline hỗ trợ quy trình này. Không tính trước thống kê bằng cả sáu dòng.

  Các fold liên tiếp này minh họa cơ chế, không phải splitter dùng được cho mọi dữ liệu. Nếu dự đoán tương lai, dùng chia theo thời gian không học từ tương lai; nếu đánh giá khách hàng mới, giữ toàn bộ một khách hàng ở một phía. Không có kiểm tra nhóm/thời gian nào trong ví dụ. Độ lệch chuẩn fold không phải khoảng tin cậy; tập test cuối vẫn phải giữ ngoài lựa chọn mô hình.
concept_notes_en: |-
  K-fold partitions development data into K parts; each iteration holds out one part for validation and trains on the rest. Training and validation indices must be disjoint within each iteration. Training sets across iterations overlap, so fold scores are not independent experiments.

  The six fictional durations [2,4,6,8,10,12] are treated as independent observations with no time or group structure. Validation folds are [0,1], [2,3], [4,5]. The baseline learns the target mean from training rows alone: 9,7,5 respectively. Validation MAEs are 6,1,6. Their mean 4.333 and descriptive standard deviation 2.357 show sensitivity to the split.

  This example only fits a baseline; it has no scaling step. When adding imputation, scaling or feature selection, fit them inside each training split and transform validation; Pipeline supports this workflow. Do not precompute statistics using all six rows.

  These consecutive folds demonstrate mechanics, not a universally suitable splitter. For future prediction, split by time without training on future records; for unseen customers, keep each customer on one side. This code performs no group/time checks. Fold standard deviation is not a confidence interval; keep the final test set outside model selection.
why_it_matters_vi: Huấn luyện lại ở mỗi lượt ngăn thống kê validation lọt vào baseline; báo mọi fold tránh
  chỉ chọn kết quả thuận lợi.
why_it_matters_en: Refitting each iteration keeps validation statistics out of the baseline; reporting every
  fold avoids cherry-picking a favorable result.
study_steps_vi:
- Viết sáu chỉ số dòng và ba phần validation; lấy train bằng phần bù.
- Đọc K-fold và Data transformation with held-out data trong tài liệu.
- Mở hướng dẫn Practice Lab, tải mã hoặc chép vào Colab/Python 3.11 rồi chạy.
- Đối chiếu trung bình train 9/7/5 và MAE 6/1/6; thử một chỉ số lặp.
- Lưu mọi fold và giải thích vì sao dữ liệu thời gian/nhóm cần cách chia riêng.
study_steps_en:
- List six row indices and three validation parts; construct training as the complement.
- Read K-fold and Data transformation with held-out data in the reference.
- Open the Practice Lab guide, download the code or copy it into Colab/Python 3.11 and run it.
- Check training means 9/7/5 and MAEs 6/1/6; try a duplicate index.
- Save every fold and explain why time/group data needs a suitable split.
practice_plan:
  vi:
    task: Chạy ba fold cho baseline trung bình; chứng minh train/validation rời nhau và tính MAE từng fold.
    deliverables:
    - Mã cùng bảng chỉ số train/validation, trung bình train và MAE
    - MAE trung bình và độ lệch chuẩn mô tả
    - Ghi chú dữ liệu độc lập, không có kiểm tra thời gian/nhóm
    checkpoint: Mỗi chỉ số xuất hiện đúng một lần ở validation; MAE là 6,1,6.
    stretch: Đổi fold thành [0,3], [1,4], [2,5]; tính lại và giải thích độ nhạy với cách chia.
  en:
    task: Run three folds for a mean baseline; prove train/validation disjointness and calculate each fold
      MAE.
    deliverables:
    - Code and a table of train/validation indices, training means and MAEs
    - Mean MAE and descriptive standard deviation
    - Independent-row assumption and absence of time/group checks
    checkpoint: Every index appears once in validation; MAEs are 6,1,6.
    stretch: Change folds to [0,3], [1,4], [2,5]; recompute and explain split sensitivity.
interview_questions:
  vi:
  - 'Giữ lại chỉ số [0,1] của [2,4,6,8,10,12]: baseline và MAE bằng bao nhiêu?'
  - Chuẩn hóa cả dữ liệu trước K-fold gây lỗi gì và sửa ở đâu?
  - MAE fold 6,1,6 có chứng minh hiệu năng tương lai không?
  en:
  - 'Hold out indices [0,1] of [2,4,6,8,10,12]: what are the baseline and MAE?'
  - What is wrong with scaling all data before K-fold, and where is the fix?
  - Do fold MAEs of 6,1,6 prove future performance?
formulas:
- baseline_j = mean(y_train_j)
- MAE_j = mean(|y_valid_j − baseline_j|)
- mean_MAE = Σ MAE_j / K
- descriptive_sd = √[Σ(MAE_j − mean_MAE)² / K]
code_examples:
- language: python
  title: Three folds with a freshly fitted mean baseline
  code: |
    from math import isfinite
    from statistics import mean, pstdev

    def cross_validate_mean(targets, validation_folds):
        if len(targets) < 2 or not all(isfinite(value) for value in targets):
            raise ValueError("at least two finite targets are required")
        if len(validation_folds) < 2 or any(not fold for fold in validation_folds):
            raise ValueError("at least two non-empty folds are required")
        flattened = [index for fold in validation_folds for index in fold]
        if any(type(index) is not int for index in flattened):
            raise ValueError("fold indices must be integers")
        if sorted(flattened) != list(range(len(targets))):
            raise ValueError("folds must partition every index exactly once")
        results = []
        for validation_indices in validation_folds:
            training_indices = [index for index in range(len(targets))
                                if index not in validation_indices]
            assert set(training_indices).isdisjoint(validation_indices)
            training_mean = mean(targets[index] for index in training_indices)
            fold_mae = mean(abs(targets[index] - training_mean)
                            for index in validation_indices)
            results.append({"train": training_indices, "valid": validation_indices,
                            "training_mean": training_mean, "mae": fold_mae})
        return results

    targets = [2, 4, 6, 8, 10, 12]
    results = cross_validate_mean(targets, [[0, 1], [2, 3], [4, 5]])
    for fold_number, result in enumerate(results, start=1):
        print(f"fold={fold_number} train={result['train']} valid={result['valid']}")
        print(f"train_mean={result['training_mean']:.3f} mae={result['mae']:.3f}")
    fold_scores = [result["mae"] for result in results]
    print(f"mean_mae={mean(fold_scores):.3f} descriptive_sd={pstdev(fold_scores):.3f}")
  status: runnable
  purpose_vi: Fit baseline riêng trong mỗi train và chấm trên phần giữ lại.
  purpose_en: Fit a separate baseline within each training split and score held-out rows.
  setup: Python 3.11+; standard library only. Run in Colab or save as cross_validation.py and run python cross_validation.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành cross_validation.py và chạy lệnh python cross_validation.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as cross_validation.py and run python cross_validation.py from the folder containing the file.
  expected_output: |-
    fold=1 train=[2, 3, 4, 5] valid=[0, 1]
    train_mean=9.000 mae=6.000
    fold=2 train=[0, 1, 4, 5] valid=[2, 3]
    train_mean=7.000 mae=1.000
    fold=3 train=[0, 1, 2, 3] valid=[4, 5]
    train_mean=5.000 mae=6.000
    mean_mae=4.333 descriptive_sd=2.357
  edge_case_vi: Chỉ số lặp, thiếu, ngoài phạm vi hoặc fold rỗng gây ValueError; không có đánh giá trên tập
    train.
  edge_case_en: Duplicate, missing, out-of-range indices or empty folds raise ValueError; evaluation is not
    performed on training rows.
  explanation_vi: Đây là vòng lặp kiểm định chéo của baseline trung bình, không huấn luyện mô hình dùng đặc
    trưng và không bảo đảm tránh rò rỉ nhóm/thời gian.
  explanation_en: This is cross-validation of a mean baseline, not a feature-based fitted predictor and not
    a guarantee against group/time leakage.
resources:
- language: en
  title: scikit-learn Cross-validation
  url: https://scikit-learn.org/stable/modules/cross_validation.html#k-fold
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc K-fold, Data transformation with held-out data và phần chia theo nhóm/thời gian.
  read_en: Read K-fold, Data transformation with held-out data and the group/time splitting sections.
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
  url: https://scikit-learn.org/stable/modules/compose.html#pipeline-chaining-estimators
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc Pipeline; xác định bước fit nào phải nằm trong từng fold.
  read_en: Read Pipeline and identify which fit steps belong within every fold.
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
- phase-03-classical-ml-evaluation-3-recall
- phase-03-classical-ml-evaluation-3-application
- phase-03-classical-ml-evaluation-3-debug
- phase-03-classical-ml-evaluation-3-interview
estimated_minutes: 60
completion_checklist:
- Kiểm tra phân hoạch và trung bình train ở từng fold.
- Tái tạo MAE 6/1/6, mean 4.333 và SD 2.357.
- Phân biệt độ phân tán fold với khoảng tin cậy và tập test cuối.
completion_criteria:
- Kiểm tra phân hoạch và trung bình train ở từng fold.
- Tái tạo MAE 6/1/6, mean 4.333 và SD 2.357.
- Phân biệt độ phân tán fold với khoảng tin cậy và tập test cuối.
common_mistakes:
- Dùng trung bình của toàn bộ dữ liệu cho mọi fold.
- Để cùng chỉ số trong cả train và validation.
- Chia ngẫu nhiên bất chấp thời gian/nhóm hoặc coi SD fold là khoảng tin cậy.
next_lessons:
- phase-03-classical-ml-evaluation-4
- phase-03-classical-ml-analysis-1
review_question_vi: Trong K-fold, phần nào phải rời nhau và phần nào có thể chồng lặp?
review_question_en: In K-fold, which parts must be disjoint and which may overlap?
review_answer_vi: Train và validation của cùng lượt phải rời nhau. Mỗi mẫu thuộc đúng một fold validation;
  các tập train giữa các lượt chồng lặp, nên điểm fold không độc lập.
review_answer_en: Training and validation within an iteration must be disjoint. Each sample belongs to one
  validation fold; training sets across iterations overlap, so fold scores are not independent.
review_cards:
- id: phase-03-classical-ml-evaluation-3-recall
  type: recall
  question_vi: Trong K-fold, phần nào phải rời nhau và phần nào có thể chồng lặp?
  question_en: In K-fold, which parts must be disjoint and which may overlap?
  answer_vi: Train và validation của cùng lượt phải rời nhau. Mỗi mẫu thuộc đúng một fold validation; các tập
    train giữa các lượt chồng lặp, nên điểm fold không độc lập.
  answer_en: Training and validation within an iteration must be disjoint. Each sample belongs to one validation
    fold; training sets across iterations overlap, so fold scores are not independent.
  hint_vi: Phân biệt cùng lượt và giữa các lượt.
  hint_en: Distinguish within and across iterations.
- id: phase-03-classical-ml-evaluation-3-application
  type: application
  question_vi: 'Giữ lại chỉ số [0,1] của [2,4,6,8,10,12]: baseline và MAE bằng bao nhiêu?'
  question_en: 'Hold out indices [0,1] of [2,4,6,8,10,12]: what are the baseline and MAE?'
  answer_vi: Train=[6,8,10,12] nên trung bình=9. Validation=[2,4] có lỗi 7 và 5; MAE=6. Không được dùng trung
    bình toàn dữ liệu là 7.
  answer_en: Training targets [6,8,10,12] have mean 9. Validation targets [2,4] have errors 7 and 5; MAE=6.
    Do not use the full-data mean of 7.
  hint_vi: Chỉ tính trung bình từ bốn mẫu train.
  hint_en: Average only the four training targets.
- id: phase-03-classical-ml-evaluation-3-debug
  type: debug
  question_vi: Chuẩn hóa cả dữ liệu trước K-fold gây lỗi gì và sửa ở đâu?
  question_en: What is wrong with scaling all data before K-fold, and where is the fix?
  answer_vi: Thống kê validation đã lọt vào bước học. Fit scaler riêng trên train mỗi fold rồi transform validation;
    đặt scaler và mô hình trong Pipeline. Ví dụ hiện chỉ fit trung bình mục tiêu.
  answer_en: Validation statistics leaked into fitting. Fit the scaler separately on each training fold and
    transform validation; put scaler and estimator in a Pipeline. This example only fits the target mean.
  hint_vi: Tìm dữ liệu mà fit đã nhìn thấy.
  hint_en: Track which rows fit has seen.
- id: phase-03-classical-ml-evaluation-3-interview
  type: interview
  question_vi: MAE fold 6,1,6 có chứng minh hiệu năng tương lai không?
  question_en: Do fold MAEs of 6,1,6 prove future performance?
  answer_vi: Không. Mean=4.333, SD mô tả=2.357 cho thấy độ nhạy cách chia trên fixture nhỏ. Nếu có thời gian/nhóm
    phải đổi splitter; cần dữ liệu đại diện và test độc lập sau lựa chọn.
  answer_en: No. Mean=4.333 and descriptive SD=2.357 show split sensitivity on a tiny fixture. Time/group data
    needs an appropriate splitter; representative data and independent post-selection testing are required.
  hint_vi: Xem giả định về quan sát độc lập.
  hint_en: Check the independent-observation assumption.
completion_checklist_en:
- Verify the partition and training mean in every fold.
- Reproduce MAEs 6/1/6, mean 4.333 and SD 2.357.
- Distinguish fold spread from a confidence interval and final test set.
completion_criteria_en:
- Verify the partition and training mean in every fold.
- Reproduce MAEs 6/1/6, mean 4.333 and SD 2.357.
- Distinguish fold spread from a confidence interval and final test set.
common_mistakes_en:
- Use the full-data mean for every fold.
- Place the same index in both training and validation.
- Ignore time/groups when splitting or treat fold SD as a confidence interval.
---
# Kiểm định chéo / Cross-validation

K-fold chia dữ liệu phát triển thành K phần; mỗi lượt giữ một phần làm validation và dùng các phần còn lại làm train. Trong mỗi lượt, chỉ số train và validation phải rời nhau. Các tập train giữa các lượt có thể chồng lặp; điểm các fold không phải các phép thử độc lập.

Ví dụ sáu thời gian giả lập [2,4,6,8,10,12] được xem là các quan sát độc lập, không có thứ tự thời gian hay nhóm. Ba fold validation là [0,1], [2,3], [4,5]. Baseline dự đoán bằng trung bình mục tiêu của riêng train: lần lượt 9,7,5. MAE validation tương ứng 6,1,6. Trung bình 4.333 và độ lệch chuẩn mô tả 2.357 cho thấy phụ thuộc cách chia.

Ví dụ chỉ fit baseline; không có bước chuẩn hóa. Khi thêm imputation, scaling hoặc chọn đặc trưng, fit chúng bên trong từng train rồi transform validation; Pipeline hỗ trợ quy trình này. Không tính trước thống kê bằng cả sáu dòng.

Các fold liên tiếp này minh họa cơ chế, không phải splitter dùng được cho mọi dữ liệu. Nếu dự đoán tương lai, dùng chia theo thời gian không học từ tương lai; nếu đánh giá khách hàng mới, giữ toàn bộ một khách hàng ở một phía. Không có kiểm tra nhóm/thời gian nào trong ví dụ. Độ lệch chuẩn fold không phải khoảng tin cậy; tập test cuối vẫn phải giữ ngoài lựa chọn mô hình.

## Practice / Thực hành

Chạy ba fold cho baseline trung bình; chứng minh train/validation rời nhau và tính MAE từng fold.

Run three folds for a mean baseline; prove train/validation disjointness and calculate each fold MAE.
