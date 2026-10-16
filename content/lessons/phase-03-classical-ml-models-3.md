---
lesson_id: phase-03-classical-ml-models-3
phase_id: phase-03-classical-ml
module_id: models
title_vi: Cây quyết định và rừng ngẫu nhiên
title_en: Decision trees and random forests
summary_vi: Cây quyết định chia dữ liệu qua các điều kiện; rừng ngẫu nhiên kết hợp nhiều cây để giảm biến động của
  dự đoán.
summary_en: Decision trees predict through successive conditions; random forests combine randomized trees to reduce prediction variability.
learning_objectives:
- So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Explain decision trees and random forests with a concrete example.
- Write or adapt a small code example applying decision trees and random forests.
- Recognize its assumptions, limits and one common failure mode.
prerequisites:
- phase-03-classical-ml-models-2
- phase-02-math-ml-linear-algebra-1
key_terms:
- decision
- tree
- random
- forest
- dataset
- feature
- baseline
- evaluation
- models
concept_notes_vi: |-
  Cây quyết định chia dữ liệu bằng các điều kiện nối tiếp, rồi dự đoán từ lá tương ứng. Cây sâu có thể ghi nhớ những chi tiết nhỏ của tập train; độ sâu và số mẫu tối thiểu ở lá giúp kiểm soát mức phức tạp.

  Rừng ngẫu nhiên kết hợp nhiều cây có sự ngẫu nhiên trong dữ liệu và tập đặc trưng được xét. Lấy trung bình hoặc bỏ phiếu giúp giảm biến động khi các cây không mắc lỗi hoàn toàn giống nhau. Khác một cây, cả rừng thường khó diễn giải bằng một chuỗi điều kiện ngắn.

  Tự kiểm tra: tăng số cây có sửa được dữ liệu bị rò rỉ không? Không; nó chỉ thay đổi cách kết hợp mô hình. Giữ cách chia hợp lệ và so chất lượng, thời gian cùng kích thước mô hình khi tăng số cây.
concept_notes_en: |-
  A decision tree splits data through successive conditions and predicts from the resulting leaf. Deep trees can memorize small training-set details; depth and minimum leaf size help control complexity.

  A random forest combines trees randomized through data sampling and feature selection. Averaging or voting reduces variability when trees do not make identical errors. Unlike a single tree, a forest is usually hard to summarize as one short chain of conditions.

  Self-check: does adding trees repair data leakage? No; it only changes the model ensemble. Keep splits valid and compare quality, runtime and model size when increasing tree count.
why_it_matters_vi: So sánh mô hình theo giả định, độ phức tạp và dạng lỗi trên cùng dữ liệu.
why_it_matters_en: Compare models by assumptions, complexity, and error patterns instead of trying many models without
  a baseline.
study_steps_vi:
- Đọc phần giải thích, xác định khái niệm và điều kiện cần dùng cho nhiệm vụ bên dưới.
- Tìm mục tương ứng với “Decision trees and random forests” trong tài liệu tham khảo; đối chiếu với phần giải thích
  của bài.
- So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.
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
      So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.

      Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
    deliverables:
    - Cấu hình mô hình và kết quả trên cùng tập kiểm định
    - Kết quả đối chiếu kèm dữ liệu hoặc điều kiện thực hiện
    - Một giới hạn và cách kiểm tra thêm
    checkpoint: So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
    stretch: Thay một điều kiện trong bài làm và giải thích kết quả thay đổi như thế nào.
  en:
    task: Use the toy stump to inspect Gini-based splitting and supplied predictions to inspect voting. For the
      full lesson task, train a decision tree and an actual random forest and compare them on the same validation
      set; the supplied votes do not complete that training experiment.
    deliverables:
    - The selected stump threshold and its two leaf predictions
    - For the full comparison, tree and forest settings plus validation metrics
    - One disagreement, runtime or model-size comparison and a limitation
    checkpoint: Separate the stump-and-vote illustration from evidence obtained by training and evaluating a real
      forest.
    stretch: Change one binary label and explain whether the best Gini split or a leaf majority changes.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Cây quyết định và rừng ngẫu nhiên” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain decision trees and random forests to a new teammate?
  - Which assumption behind decision trees and random forests could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Fit a Gini stump and illustrate voting with supplied predictions
  code: |-
    from math import isfinite


    def majority(labels):
        if not labels or any(label not in (0, 1) for label in labels):
            raise ValueError("non-empty binary labels are required")
        return int(2 * sum(labels) > len(labels))  # A tie selects class 0.


    def gini(labels):
        probability = sum(labels) / len(labels)
        return 2 * probability * (1 - probability)


    def fit_stump(xs, ys):
        if not xs or len(xs) != len(ys):
            raise ValueError("non-empty aligned data are required")
        if any(not isinstance(value, (int, float)) or not isfinite(value)
               for value in xs):
            raise ValueError("features must be finite numbers")
        majority(ys)  # Validate the binary labels before evaluating splits.
        distinct = sorted(set(xs))
        if len(distinct) < 2:
            raise ValueError("at least two distinct x values are required")
        best_score = float("inf")
        best_stump = None
        for lower, upper in zip(distinct, distinct[1:]):
            threshold = lower / 2 + upper / 2
            if threshold >= upper:
                threshold = lower
            left = [label for value, label in zip(xs, ys) if value <= threshold]
            right = [label for value, label in zip(xs, ys) if value > threshold]
            score = (len(left) * gini(left) + len(right) * gini(right)) / len(ys)
            if score < best_score:
                best_score = score
                best_stump = {
                    "threshold": threshold,
                    "left": majority(left),
                    "right": majority(right),
                }
        return best_stump


    def predict_stump(stump, value):
        if not isinstance(value, (int, float)) or not isfinite(value):
            raise ValueError("feature must be a finite number")
        return stump["left"] if value <= stump["threshold"] else stump["right"]


    if __name__ == "__main__":
        features = [1, 2, 3, 4, 5, 6]
        labels = [0, 0, 0, 1, 1, 1]
        stump = fit_stump(features, labels)
        predictions = [predict_stump(stump, value) for value in (2, 5)]
        print(f"threshold={stump['threshold']:.1f}")
        print(f"stump_predictions={predictions}")
        # Supplied predictions from three imagined trees, not a trained forest.
        tree_predictions = [[0, 1], [0, 0], [1, 1]]
        votes = [majority(list(sample_votes))
                 for sample_votes in zip(*tree_predictions)]
        print(f"supplied_tree_votes={votes}")
  status: runnable
  purpose_vi: Tìm ngưỡng chia tốt nhất cho cây một tầng theo Gini nhị phân; sau đó minh họa bỏ phiếu từ dự đoán
    được cho sẵn, không huấn luyện rừng ngẫu nhiên.
  purpose_en: Fit a one-split classification tree using binary Gini impurity, then illustrate voting with supplied
    tree predictions. This does not train a random forest.
  setup: Python 3.11+; chỉ dùng thư viện chuẩn / standard library only. Save as tree_demo.py and run python tree_demo.py.
  expected_output: |-
    threshold=3.5
    stump_predictions=[0, 1]
    supplied_tree_votes=[0, 1]
  edge_case_vi: Thử đặc trưng không đổi, dữ liệu rỗng, khác độ dài hoặc nhãn ngoài {0, 1}; phải báo ValueError.
    majority([0, 1]) trả về 0 theo quy tắc phá hòa đã ghi. Nếu nhiều ngưỡng có Gini bằng nhau, ví dụ giữ ngưỡng
    nhỏ nhất được xét.
  edge_case_en: Constant features, empty or misaligned data, and non-binary labels must raise ValueError. majority([0,
    1]) returns 0 under the documented tie rule. Equal-quality splits retain the first, lowest threshold considered.
  explanation_vi: Với tỉ lệ lớp 1 là p, Gini nhị phân bằng 2p(1−p). Mã xét ngưỡng giữa các giá trị đặc trưng phân
    biệt và tối thiểu hóa Gini trung bình có trọng số theo số mẫu hai nhánh; mỗi lá trả về lớp đa số. Ba danh sách
    dự đoán chỉ minh họa cách kết hợp cây. Rừng thật còn lấy mẫu dữ liệu và chọn tập đặc trưng ngẫu nhiên; RandomForestClassifier
    của scikit-learn trung bình hóa xác suất thay vì bỏ phiếu nhãn như ví dụ này.
  explanation_en: For class-1 proportion p, binary Gini is 2p(1−p). The code tests thresholds between distinct feature
    values and minimizes child Gini weighted by sample count; leaves predict their majority class. The three supplied
    prediction lists illustrate aggregation only. A real forest also samples data and features; scikit-learn RandomForestClassifier
    averages probabilities rather than using this hard-label vote.
resources:
- language: en
  title: scikit-learn User Guide
  url: https://scikit-learn.org/stable/user_guide.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Trong User Guide, đọc Decision Trees → Mathematical formulation và Ensembles → Random forests; kiểm tra
    Gini có trọng số và cách scikit-learn kết hợp xác suất của cây.
  read_en: In the User Guide, read Decision Trees → Mathematical formulation and Ensembles → Random forests; check
    weighted Gini and scikit-learn probability aggregation.
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
- title: MDN HTTP Overview
  url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
  language: en
  purpose_vi: Hiểu cấu trúc yêu cầu, phản hồi HTTP và cách trao đổi dữ liệu JSON.
  read_vi: Đọc về chu trình yêu cầu–phản hồi, mã trạng thái và kiểu nội dung.
  purpose_en: Learn request, response, methods, status codes, and JSON boundaries.
  read_en: Read the request/response cycle, status codes, and content types.
  kind: official
  required: true
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
- phase-03-classical-ml-models-3-recall
- phase-03-classical-ml-models-3-application
- phase-03-classical-ml-models-3-debug
- phase-03-classical-ml-models-3-interview
estimated_minutes: 60
completion_checklist:
- So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- So sánh với mô hình cơ sở và đọc ít nhất một dự đoán sai.
common_mistakes:
- Chọn mô hình chỉ vì điểm huấn luyện cao.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-03-classical-ml-models-4
- phase-03-classical-ml-preprocessing-1
review_question_vi: Cây quyết định dự đoán như thế nào, và rừng ngẫu nhiên giúp giảm biến động bằng cách nào?
review_question_en: How does a decision tree predict, and how can a random forest reduce prediction variability?
review_answer_vi: Cây đi qua các điều kiện chia dữ liệu đến một lá rồi dùng dự đoán tại lá đó. Rừng kết hợp nhiều
  cây được tạo với sự ngẫu nhiên trong lấy mẫu dữ liệu và lựa chọn đặc trưng. Kết hợp dự đoán giúp giảm biến động
  khi lỗi của các cây không hoàn toàn giống nhau; độ sâu và số mẫu tối thiểu ở lá vẫn cần được kiểm soát.
review_answer_en: A tree follows split conditions to a leaf and uses that leaf's prediction. A forest combines
  trees randomized through data sampling and feature selection. Combining predictions reduces variability when
  the trees do not make identical errors; depth and minimum leaf size still need to be controlled.
review_cards:
- id: phase-03-classical-ml-models-3-recall
  type: recall
  question_vi: Vì sao rừng ngẫu nhiên cần các cây khác nhau thay vì sao chép cùng một cây nhiều lần?
  question_en: Why does a random forest need different trees instead of many copies of the same tree?
  answer_vi: Sao chép một cây giữ nguyên dự đoán và lỗi của nó, nên kết hợp các bản sao không giảm biến động.
    Lấy mẫu dữ liệu và chọn ngẫu nhiên các đặc trưng được xét giúp tạo cây khác nhau; lợi ích xuất hiện khi lỗi
    của chúng không hoàn toàn trùng nhau.
  answer_en: Copies of one tree make the same predictions and errors, so combining them does not reduce
    variability. Data sampling and random feature selection help create different trees; the benefit depends
    on their errors not being identical.
  hint_vi: Nếu mọi cây trả về cùng một dự đoán thì lấy trung bình có đổi kết quả không?
  hint_en: If every tree returns the same prediction, does averaging change it?
- id: phase-03-classical-ml-models-3-application
  type: application
  question_vi: Bạn sẽ so sánh một cây với rừng ngẫu nhiên công bằng và ghi lại những gì?
  question_en: How would you compare a decision tree with a random forest fairly, and what would you record?
  answer_vi: Dùng cùng tập train, tập kiểm định, đặc trưng và thước đo. Lưu độ sâu, số mẫu tối thiểu ở lá, số cây
    và seed; so chất lượng kiểm định với baseline, thời gian dự đoán và kích thước mô hình. Xem ít nhất một mẫu
    mà hai mô hình dự đoán khác nhau để giải thích lợi ích hoặc giới hạn của rừng.
  answer_en: Use the same training and validation sets, features and metric. Record depth, minimum leaf size,
    tree count and seed; compare validation quality with a baseline, prediction time and model size. Inspect
    at least one case where the models disagree to explain a benefit or limitation of the forest.
  hint_vi: Giữ cách chia dữ liệu cố định để khác biệt kết quả có ý nghĩa.
  hint_en: Keep the data split fixed so the comparison is meaningful.
- id: phase-03-classical-ml-models-3-debug
  type: debug
  question_vi: Một cây dự đoán gần hoàn hảo trên train nhưng kém trên kiểm định. Bạn kiểm tra và thử điều gì?
  question_en: A tree predicts almost perfectly on training data but poorly on validation data. What would you check and try?
  answer_vi: Kiểm tra cách chia dữ liệu và rò rỉ đặc trưng trước, rồi xem độ sâu và số mẫu trong các lá. Cây quá
    sâu có thể ghi nhớ tập train. Thử giới hạn độ sâu hoặc tăng số mẫu tối thiểu ở lá, so lại chênh lệch train–validation
    trên cùng phép chia. Nhiều cây hơn không sửa được rò rỉ dữ liệu.
  answer_en: First check the split and feature leakage, then inspect tree depth and leaf sample counts. An
    overly deep tree may memorize training data. Try limiting depth or increasing minimum leaf size, and
    compare the training–validation gap on the same split. Adding trees cannot repair data leakage.
  hint_vi: Xem điều kiện chia và số mẫu ở lá trước khi tăng số cây.
  hint_en: Inspect split conditions and leaf sample counts before increasing tree count.
- id: phase-03-classical-ml-models-3-interview
  type: interview
  question_vi: Khi nào bạn vẫn chọn một cây nhỏ dù rừng ngẫu nhiên có điểm kiểm định tốt hơn?
  question_en: When might you choose a small tree even if a random forest has a better validation score?
  answer_vi: Một cây nhỏ có thể phù hợp khi cần giải thích từng quyết định bằng chuỗi điều kiện ngắn hoặc ngân
    sách bộ nhớ và thời gian dự đoán hạn chế. Rừng thường giảm biến động nhưng khó diễn giải toàn bộ và cần lưu,
    chạy nhiều cây. Quyết định dựa trên mức cải thiện chất lượng và chi phí đo được, không chỉ tên mô hình.
  answer_en: A small tree may fit a need for short, traceable decision rules or tight memory and prediction-time
    budgets. A forest often reduces variability but is harder to explain as a whole and requires storing and
    evaluating many trees. Choose using the measured quality gain and costs, not the model name alone.
  hint_vi: Đối chiếu độ chính xác với yêu cầu giải thích, bộ nhớ và thời gian dự đoán.
  hint_en: Weigh predictive quality against explanation needs, memory and prediction time.
---
# Cây quyết định và rừng ngẫu nhiên / Decision trees and random forests

Cây quyết định chia dữ liệu bằng các điều kiện nối tiếp, rồi dự đoán từ lá tương ứng. Cây sâu có thể ghi nhớ những chi tiết nhỏ của tập train; độ sâu và số mẫu tối thiểu ở lá giúp kiểm soát mức phức tạp.

Rừng ngẫu nhiên kết hợp nhiều cây có sự ngẫu nhiên trong dữ liệu và tập đặc trưng được xét. Lấy trung bình hoặc bỏ phiếu giúp giảm biến động khi các cây không mắc lỗi hoàn toàn giống nhau. Khác một cây, cả rừng thường khó diễn giải bằng một chuỗi điều kiện ngắn.

Tự kiểm tra: tăng số cây có sửa được dữ liệu bị rò rỉ không? Không; nó chỉ thay đổi cách kết hợp mô hình. Giữ cách chia hợp lệ và so chất lượng, thời gian cùng kích thước mô hình khi tăng số cây.

Ví dụ mã chỉ huấn luyện cây một tầng bằng Gini và bỏ phiếu trên dự đoán cho sẵn. Đây chưa phải huấn luyện rừng ngẫu nhiên; nhiệm vụ so sánh cây với rừng trên tập kiểm định vẫn cần một thí nghiệm riêng. RandomForestClassifier của scikit-learn kết hợp xác suất của các cây, khác phép bỏ phiếu nhãn minh họa.

## Thực hành

So sánh một cây với rừng ngẫu nhiên trên cùng tập kiểm định.

Sau khi học xong các bài trong học phần, bạn có thể làm bài tổng hợp: Huấn luyện mô hình đơn giản, thêm cây hoặc boosting rồi ghi thước đo cùng một lỗi tiêu biểu cho mỗi mô hình.
