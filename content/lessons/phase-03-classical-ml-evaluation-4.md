---
lesson_id: phase-03-classical-ml-evaluation-4
phase_id: phase-03-classical-ml
module_id: evaluation
title_vi: Điều chỉnh siêu tham số
title_en: Hyperparameter tuning
summary_vi: Chọn số láng giềng k bằng MAE validation trên cùng cách chia; khóa lựa chọn, fit lại rồi mới đánh
  giá test.
summary_en: Choose neighbor count k by validation MAE on a fixed split; lock the choice, refit and only then
  evaluate the test set.
learning_objectives:
- Phân biệt siêu tham số k và dữ liệu được lưu khi fit k-NN.
- So sánh ba ứng viên bằng cùng train/validation và MAE.
- Khóa lựa chọn trước test, báo ngân sách và giới hạn fixture nhỏ.
learning_objectives_en:
- Distinguish hyperparameter k from data stored when fitting k-NN.
- Compare three candidates on identical train/validation rows using MAE.
- Lock selection before testing and report budget and tiny-fixture limitations.
prerequisites:
- phase-03-classical-ml-evaluation-3
- phase-02-math-ml-linear-algebra-1
key_terms:
- hyperparameter
- k-nearest neighbors
- validation MAE
- search budget
- refit
- held-out test
concept_notes_vi: |-
  Siêu tham số quy định cách học hoặc dự đoán và được chọn bên ngoài lần fit: độ sâu cây, tốc độ học, hoặc số láng giềng k. Hồi quy k-NN lưu các cặp (đặc trưng, mục tiêu) của train; dự đoán là trung bình mục tiêu của k mẫu có khoảng cách gần nhất. Fit k-NN không học hệ số hồi quy.

  Ví dụ dùng một đặc trưng số, khoảng cách tuyệt đối và trọng số đều. Train có sáu dòng, validation có hai dòng khác biệt. Thử đúng k=1,3,5 trên cùng train; MAE validation lần lượt 2.000,0.667,0.500 nên chọn k=5. Nếu bằng điểm, quy tắc đã định trước chọn k nhỏ hơn; bằng khoảng cách thì dùng thứ tự dòng train.

  Sau lựa chọn, fit lại k=5 trên train+validation; lúc này validation đã trở thành dữ liệu huấn luyện, không được dùng điểm cũ như đánh giá độc lập của mô hình mới. Chỉ sau đó đọc hai dòng test để báo MAE=1.000, cùng baseline trung bình fit trên train+validation có MAE=2.000. Hàm chọn k không nhận dữ liệu test.

  Đây là tìm kiếm trên một split nhỏ, không phải GridSearchCV, benchmark hay bằng chứng k=5 luôn tốt nhất. Tìm nhiều ứng viên có thể khớp nhiễu validation; ghi cả ứng viên, metric và ngân sách (3 lần fit ứng viên + 1 lần refit k-NN). Trong dự án lớn, dùng cross-validation phù hợp và Pipeline cho bước tiền xử lý, rồi test độc lập; không đổi lưới tìm kiếm dựa trên điểm test.
concept_notes_en: |-
  Hyperparameters control learning or prediction and are selected outside an individual fit: tree depth, learning rate or neighbor count k. k-NN regression stores training (feature, target) pairs; prediction averages the targets of the k nearest rows. Fitting k-NN does not learn regression coefficients.

  The example uses one numeric feature, absolute distance and uniform weights. Training has six rows and validation has two distinct rows. Try k=1,3,5 on the same training data; validation MAEs are 2.000,0.667,0.500, so select k=5. A predeclared score tie rule prefers smaller k; equal distances use training-row order.

  After selection, refit k=5 on train+validation. Validation is now training data, so its old score is not an independent evaluation of the new model. Only then read the two test rows: test MAE=1.000, compared with MAE=2.000 for a mean baseline fitted on train+validation. The k-selection function receives no test data.

  This is a tiny single-split search, not GridSearchCV, a benchmark or evidence that k=5 is universally best. Searching more candidates can fit validation noise; record candidates, metric and budget (3 candidate fits + 1 k-NN refit). Larger projects need suitable cross-validation and a preprocessing Pipeline, followed by independent testing; do not revise the search grid based on test scores.
why_it_matters_vi: Điểm tốt nhất sau tìm kiếm dễ quá lạc quan; tách lựa chọn và đánh giá cuối giúp báo cáo
  trung thực.
why_it_matters_en: The best score after a search can be optimistic; separating selection from final evaluation
  keeps reporting honest.
study_steps_vi:
- Ghi vai trò train, validation, test và lưới k=1,3,5 trước khi chạy.
- 'Đọc Exhaustive Grid Search và Model selection: development and evaluation.'
- Mở hướng dẫn Practice Lab, tải mã hoặc chép vào Colab/Python 3.11 rồi chạy.
- Đối chiếu ba MAE validation; theo dõi refit trước khi mở test.
- Lưu k được chọn, kết quả test/baseline, ngân sách và giới hạn dữ liệu nhỏ.
study_steps_en:
- Record train, validation and test roles and the grid k=1,3,5 before running.
- 'Read Exhaustive Grid Search and Model selection: development and evaluation.'
- Open the Practice Lab guide, download the code or copy it into Colab/Python 3.11 and run it.
- Check the three validation MAEs; trace refitting before opening test data.
- Save selected k, test/baseline results, budget and the tiny-data limitation.
practice_plan:
  vi:
    task: Chọn k từ 1,3,5 theo MAE validation, refit train+validation rồi báo test và baseline một lần.
    deliverables:
    - Mã và bảng ba ứng viên với MAE validation
    - k được chọn, quy tắc hòa điểm và ngân sách fit
    - MAE test/baseline và ghi chú không dùng test để chọn lại
    checkpoint: Hàm lựa chọn không nhận test; k=5 được khóa trước khi tính test MAE.
    stretch: Trên dữ liệu phát triển, so sánh lựa chọn bằng cross-validation; cần test mới nếu test cũ đã dẫn
      dắt thay đổi.
  en:
    task: Select k from 1,3,5 by validation MAE, refit on train+validation and report test and baseline once.
    deliverables:
    - Code and a three-candidate validation MAE table
    - Selected k, score tie rule and fit budget
    - Test/baseline MAEs and a note that test does not guide reselection
    checkpoint: The selection function receives no test data; k=5 is locked before test MAE is computed.
    stretch: On development data, compare cross-validation selection; use a new test set if the old test guided
      changes.
interview_questions:
  vi:
  - 'MAE validation của k=1,3,5 là 2,0.667,0.5: chọn gì và làm gì tiếp?'
  - 'Sau khi xem test, thêm k=7 vì muốn điểm tốt hơn: sai ở đâu?'
  - Vì sao không thể tuyên bố k=5 tốt nhất từ ví dụ này?
  en:
  - 'Validation MAEs for k=1,3,5 are 2,0.667,0.5: what do you select and do next?'
  - 'After seeing test results, you add k=7 to improve them: what went wrong?'
  - Why can this example not establish that k=5 is best in general?
formulas:
- ŷ(query; k) = mean(targets of k nearest training rows)
- k* = argmin_k MAE_validation(k)
- candidate fits in K-fold grid search = candidate_count × fold_count; refit adds one fit
code_examples:
- language: python
  title: Select k using validation, then open the test set
  code: |
    from math import isfinite
    from statistics import mean

    def fit_knn(training_rows, neighbors):
        if type(neighbors) is not int or not 1 <= neighbors <= len(training_rows):
            raise ValueError("neighbors must be an integer within training size")
        if any(not isfinite(value) for row in training_rows for value in row):
            raise ValueError("training values must be finite")
        return tuple(tuple(row) for row in training_rows), neighbors

    def predict_knn(model, queries):
        training_rows, neighbors = model
        predictions = []
        for query in queries:
            if not isfinite(query):
                raise ValueError("queries must be finite")
            nearest = sorted(enumerate(training_rows),
                             key=lambda item: (abs(item[1][0] - query), item[0]))
            predictions.append(mean(row[1] for _, row in nearest[:neighbors]))
        return predictions

    def mean_absolute_error(actual, predicted):
        if not actual or len(actual) != len(predicted):
            raise ValueError("non-empty aligned values are required")
        if not all(isfinite(value) for value in [*actual, *predicted]):
            raise ValueError("metric values must be finite")
        return mean(abs(truth - guess) for truth, guess in zip(actual, predicted))

    def select_neighbors(training_rows, validation_rows, candidates):
        if not candidates or not validation_rows:
            raise ValueError("candidates and validation rows must not be empty")
        results = []
        for neighbors in candidates:
            model = fit_knn(training_rows, neighbors)
            predicted = predict_knn(model, [row[0] for row in validation_rows])
            score = mean_absolute_error([row[1] for row in validation_rows], predicted)
            results.append((neighbors, score))
        best_neighbors, _ = min(results, key=lambda result: (result[1], result[0]))
        return best_neighbors, results

    training_rows = [(0, 0), (1, 1), (2, 6), (3, 3), (4, 4), (5, 5)]
    validation_rows = [(1.9, 2), (3.9, 4)]
    best_neighbors, results = select_neighbors(training_rows, validation_rows, [1, 3, 5])
    for neighbors, score in results:
        print(f"k={neighbors} validation_mae={score:.3f}")
    print(f"selected_k={best_neighbors} candidate_fits={len(results)}")
    development_rows = training_rows + validation_rows
    final_model = fit_knn(development_rows, best_neighbors)
    # Test rows are opened only after selection and refitting are complete.
    test_rows = [(0.5, 0.5), (4.5, 4.5)]
    test_targets = [row[1] for row in test_rows]
    test_predictions = predict_knn(final_model, [row[0] for row in test_rows])
    baseline = mean(row[1] for row in development_rows)
    print(f"test_mae={mean_absolute_error(test_targets, test_predictions):.3f}")
    print(f"baseline_test_mae={mean_absolute_error(test_targets, [baseline] * 2):.3f}")
  status: runnable
  purpose_vi: Thực hiện lựa chọn siêu tham số từ dự đoán thật trên validation rồi đánh giá test sau refit.
  purpose_en: Perform hyperparameter selection from actual validation predictions and evaluate test after refitting.
  setup: Python 3.11+; standard library only. Run in Colab or save as tuning.py and run python tuning.py.
  setup_vi: |-
    Dùng Python 3.11 trở lên; chỉ cần thư viện chuẩn, không cần cài thêm gói.
    Dán toàn bộ ví dụ vào một ô mã Python trên Google Colab rồi chạy ô đó, hoặc lưu thành tuning.py và chạy lệnh python tuning.py trong thư mục chứa tệp.
  setup_en: |-
    Use Python 3.11 or later; only the standard library is needed, with no additional packages to install.
    Paste the entire example into one Python code cell in Google Colab and run it, or save it as tuning.py and run python tuning.py from the folder containing the file.
  expected_output: |-
    k=1 validation_mae=2.000
    k=3 validation_mae=0.667
    k=5 validation_mae=0.500
    selected_k=5 candidate_fits=3
    test_mae=1.000
    baseline_test_mae=2.000
  edge_case_vi: k=0, k vượt số mẫu train, lưới rỗng hoặc validation rỗng gây ValueError. Hòa MAE chọn k nhỏ
    hơn; hòa khoảng cách dùng thứ tự train.
  edge_case_en: k=0, k beyond training size, an empty grid or empty validation raises ValueError. MAE ties
    choose smaller k; distance ties use training order.
  explanation_vi: Dữ liệu một chiều nhỏ, split cố định; ví dụ không kiểm tra rò rỉ theo nhóm/thời gian và không
    thay thế quy trình đánh giá trên dữ liệu đại diện.
  explanation_en: Small one-dimensional data and a fixed split; this example does not check group/time leakage
    or replace representative evaluation.
resources:
- language: en
  title: scikit-learn Hyperparameter tuning
  url: https://scikit-learn.org/stable/modules/grid_search.html#model-selection-development-and-evaluation
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: 'Đọc Exhaustive Grid Search và Model selection: development and evaluation; phân biệt tập phát triển
    và tập đánh giá cuối.'
  read_en: 'Read Exhaustive Grid Search and Model selection: development and evaluation; distinguish development
    data from final evaluation data.'
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
- language: en
  title: scikit-learn Nearest Neighbors Regression
  url: https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-regression
  kind: official
  required: false
  purpose_vi: Kiểm chứng cách dự đoán hồi quy k-NN.
  purpose_en: Verify the k-NN regression prediction rule.
  read_vi: Đọc Nearest Neighbors Regression và lưu ý thứ tự dữ liệu khi bằng khoảng cách.
  read_en: Read Nearest Neighbors Regression and the warning about equal-distance ties.
exercise_ids:
- exercise-3-evaluation
review_item_ids:
- phase-03-classical-ml-evaluation-4-recall
- phase-03-classical-ml-evaluation-4-application
- phase-03-classical-ml-evaluation-4-debug
- phase-03-classical-ml-evaluation-4-interview
estimated_minutes: 60
completion_checklist:
- Tái tạo bảng validation và lựa chọn k=5.
- Refit trước test; báo MAE test 1 và baseline 2.
- Ghi ba candidate fits, một refit và giới hạn fixture.
completion_criteria:
- Tái tạo bảng validation và lựa chọn k=5.
- Refit trước test; báo MAE test 1 và baseline 2.
- Ghi ba candidate fits, một refit và giới hạn fixture.
common_mistakes:
- Dùng test để chọn k hoặc mở rộng lưới.
- So ứng viên trên các split hoặc thước đo khác nhau.
- Báo điểm validation tốt nhất như bằng chứng hiệu năng độc lập.
next_lessons:
- phase-03-classical-ml-analysis-1
- phase-03-classical-ml-analysis-2
review_question_vi: k là gì trong hồi quy k-NN; fit học điều gì?
review_question_en: What is k in k-NN regression, and what does fit learn?
review_answer_vi: k là số láng giềng lấy trung bình, một siêu tham số được chọn bằng validation. Fit lưu các
  dòng train; dự đoán dùng khoảng cách đến các dòng ấy, không học hệ số hồi quy.
review_answer_en: k is the number of neighbors averaged, a hyperparameter selected using validation. Fit stores
  training rows; prediction uses distances to them rather than learned regression coefficients.
review_cards:
- id: phase-03-classical-ml-evaluation-4-recall
  type: recall
  question_vi: k là gì trong hồi quy k-NN; fit học điều gì?
  question_en: What is k in k-NN regression, and what does fit learn?
  answer_vi: k là số láng giềng lấy trung bình, một siêu tham số được chọn bằng validation. Fit lưu các dòng
    train; dự đoán dùng khoảng cách đến các dòng ấy, không học hệ số hồi quy.
  answer_en: k is the number of neighbors averaged, a hyperparameter selected using validation. Fit stores
    training rows; prediction uses distances to them rather than learned regression coefficients.
  hint_vi: Phân biệt quy tắc dự đoán với dữ liệu được lưu.
  hint_en: Distinguish the prediction rule from stored data.
- id: phase-03-classical-ml-evaluation-4-application
  type: application
  question_vi: 'MAE validation của k=1,3,5 là 2,0.667,0.5: chọn gì và làm gì tiếp?'
  question_en: 'Validation MAEs for k=1,3,5 are 2,0.667,0.5: what do you select and do next?'
  answer_vi: Chọn k=5 vì MAE thấp nhất. Khóa k, refit train+validation, rồi đánh giá test chưa dùng để chọn;
    ví dụ cho MAE test=1 và baseline=2.
  answer_en: Choose k=5 for the lowest MAE. Lock k, refit on train+validation, then evaluate test data not
    used for selection; the example gives test MAE=1 and baseline MAE=2.
  hint_vi: MAE càng nhỏ càng tốt trên cùng tập.
  hint_en: Lower MAE is better on the same set.
- id: phase-03-classical-ml-evaluation-4-debug
  type: debug
  question_vi: 'Sau khi xem test, thêm k=7 vì muốn điểm tốt hơn: sai ở đâu?'
  question_en: 'After seeing test results, you add k=7 to improve them: what went wrong?'
  answer_vi: Test đã dẫn dắt lựa chọn nên không còn là đánh giá độc lập. Ghi rõ việc đã dùng test; tiếp tục
    phát triển bằng train/validation và cần một test mới chưa xem cho kết luận cuối.
  answer_en: Test results now guide selection and are no longer independent evaluation. Disclose that use;
    continue development with train/validation and obtain a new unseen test set for the final claim.
  hint_vi: Xem quyết định nào đã dựa vào test.
  hint_en: Trace decisions influenced by test.
- id: phase-03-classical-ml-evaluation-4-interview
  type: interview
  question_vi: Vì sao không thể tuyên bố k=5 tốt nhất từ ví dụ này?
  question_en: Why can this example not establish that k=5 is best in general?
  answer_vi: Chỉ có ba ứng viên và hai dòng validation, nên nhiễu và cách chia ảnh hưởng lớn. Báo toàn bộ kết
    quả/ngân sách; kiểm định chéo phù hợp trên dữ liệu phát triển và test đại diện mới giúp đánh giá khả năng
    khái quát.
  answer_en: Only three candidates and two validation rows were used, so noise and the split matter greatly.
    Report all results and budget; suitable development cross-validation and representative testing help assess
    generalization.
  hint_vi: Nhớ kích thước dữ liệu và phạm vi tìm kiếm.
  hint_en: Remember sample size and search scope.
completion_checklist_en:
- Reproduce the validation table and selection of k=5.
- Refit before testing; report test MAE 1 and baseline MAE 2.
- Record three candidate fits, one refit and fixture limitations.
completion_criteria_en:
- Reproduce the validation table and selection of k=5.
- Refit before testing; report test MAE 1 and baseline MAE 2.
- Record three candidate fits, one refit and fixture limitations.
common_mistakes_en:
- Use test data to choose k or expand the grid.
- Compare candidates using different splits or metrics.
- Report the best validation score as independent performance evidence.
---
# Điều chỉnh siêu tham số / Hyperparameter tuning

Siêu tham số quy định cách học hoặc dự đoán và được chọn bên ngoài lần fit: độ sâu cây, tốc độ học, hoặc số láng giềng k. Hồi quy k-NN lưu các cặp (đặc trưng, mục tiêu) của train; dự đoán là trung bình mục tiêu của k mẫu có khoảng cách gần nhất. Fit k-NN không học hệ số hồi quy.

Ví dụ dùng một đặc trưng số, khoảng cách tuyệt đối và trọng số đều. Train có sáu dòng, validation có hai dòng khác biệt. Thử đúng k=1,3,5 trên cùng train; MAE validation lần lượt 2.000,0.667,0.500 nên chọn k=5. Nếu bằng điểm, quy tắc đã định trước chọn k nhỏ hơn; bằng khoảng cách thì dùng thứ tự dòng train.

Sau lựa chọn, fit lại k=5 trên train+validation; lúc này validation đã trở thành dữ liệu huấn luyện, không được dùng điểm cũ như đánh giá độc lập của mô hình mới. Chỉ sau đó đọc hai dòng test để báo MAE=1.000, cùng baseline trung bình fit trên train+validation có MAE=2.000. Hàm chọn k không nhận dữ liệu test.

Đây là tìm kiếm trên một split nhỏ, không phải GridSearchCV, benchmark hay bằng chứng k=5 luôn tốt nhất. Tìm nhiều ứng viên có thể khớp nhiễu validation; ghi cả ứng viên, metric và ngân sách (3 lần fit ứng viên + 1 lần refit k-NN). Trong dự án lớn, dùng cross-validation phù hợp và Pipeline cho bước tiền xử lý, rồi test độc lập; không đổi lưới tìm kiếm dựa trên điểm test.

## Practice / Thực hành

Chọn k từ 1,3,5 theo MAE validation, refit train+validation rồi báo test và baseline một lần.

Select k from 1,3,5 by validation MAE, refit on train+validation and report test and baseline once.
