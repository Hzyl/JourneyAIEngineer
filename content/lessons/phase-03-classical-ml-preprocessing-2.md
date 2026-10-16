---
lesson_id: phase-03-classical-ml-preprocessing-2
phase_id: phase-03-classical-ml
module_id: preprocessing
title_vi: Mã hóa dữ liệu phân loại
title_en: Categorical data
summary_vi: Mã hóa nhóm bằng danh mục cố định từ train và chính sách rõ cho thiếu/nhóm mới.
summary_en: Encode categories using a frozen training vocabulary and explicit missing/unknown policies.
learning_objectives:
- Phân biệt nhóm có thứ tự với danh nghĩa.
- Fit danh mục từ train, giữ số cột khi gặp nhóm mới.
- Kiểm tra thiếu và sentinel có thể trùng nhãn thật.
learning_objectives_en:
- Distinguish ordinal from nominal categories.
- Fit a training vocabulary and retain shape for unseen groups.
- Test missingness and sentinel collisions with genuine labels.
prerequisites:
- phase-03-classical-ml-preprocessing-1
- phase-02-math-ml-linear-algebra-1
key_terms:
- categorical
- data
- dataset
- feature
- baseline
- evaluation
- preprocessing
concept_notes_vi: |-
  Dữ liệu phân loại biểu diễn nhóm. Thành phố là danh nghĩa, không có thứ tự; mức thấp/vừa/cao có thứ tự. Gán thành phố A=1, B=2, C=3 có thể khiến mô hình khoảng cách hay tuyến tính hiểu sai khoảng cách. One-hot tạo một cột cho mỗi nhóm; ordinal chỉ phù hợp khi thứ tự có nghĩa, và khoảng cách số vẫn là một giả định.

  Chia tập trước, fit danh mục trên train rồi transform validation/test với cùng danh mục và thứ tự cột. Không fit encoder riêng trên mỗi tập. Trong cross-validation, danh mục được học trong từng fold train. Ví dụ thêm hai cột cố định: thiếu (None) và nhóm chưa biết. Nhóm mới không làm tăng số cột.

  Không dùng chuỗi __UNKNOWN__ như sentinel nếu nó có thể là nhãn thật. Ví dụ dùng hai cờ tách biệt, nên chuỗi đó có trong train thì vẫn là nhóm thật. None biểu diễn thiếu; chuỗi rỗng vẫn là nhóm thật theo hợp đồng này. Mã hóa all-zero cho unknown là chính sách khác; nếu cũng drop một nhóm cơ sở, hai trường hợp có thể không phân biệt được.

  One-hot tránh thứ tự giả nhưng số chiều tăng khi có nhiều nhóm. Gộp nhóm hiếm phải học tần suất từ train; chọn ngưỡng bằng validation. Target encoding cần tính ngoài fold cho hàng train để không lộ nhãn của chính hàng đó. Bài này chỉ làm one-hot không dùng nhãn.
concept_notes_en: |-
  Categorical values represent groups. Cities are nominal; low/medium/high are ordered. Coding cities as A=1, B=2, C=3 can impose misleading distances on linear or distance-based models. One-hot creates category indicators. Ordinal codes require meaningful order, and numeric spacing remains an assumption.

  Split first, fit vocabulary on train, and transform validation/test with the same vocabulary and column order. Never fit a separate encoder on each split. In cross-validation, learn vocabulary inside each training fold. The example adds two fixed columns: missing (None) and unknown. New categories cannot increase dimensionality.

  A string such as __UNKNOWN__ is unsafe as a sentinel if it can be a real label. Separate flags avoid collisions; if that string occurs in train it remains a real category. None means missing; an empty string is an ordinary category here. All-zero unknown encoding is another policy, but with a dropped reference category it may make the two states indistinguishable.

  One-hot avoids artificial order but expands high-cardinality inputs. Learn rare-group frequencies only from train and choose thresholds using validation. Target encoding needs out-of-fold training encodings so a row cannot reveal its own label. This lesson uses label-free one-hot encoding only.
why_it_matters_vi: Giữ cách xử lý dữ liệu nhất quán giữa huấn luyện và dự đoán để tránh rò rỉ hoặc sai
  lệch.
why_it_matters_en: Build consistent, leakage-safe preprocessing that turns messy data into reproducible
  features.
study_steps_vi:
- Đọc khái niệm và mục Encoding categorical features.
- Lưu mã, chạy python category_demo.py.
- Chạy category_demo.py; kiểm tra red, green, None và chuỗi __UNKNOWN__. Sau đó thêm __UNKNOWN__ vào train
  và ghi cột riêng của nhãn này.
- Chạy ca biên và trả lời thẻ ôn tập.
study_steps_en:
- Read the concepts and Encoding categorical features.
- Save code and run python category_demo.py.
- Run category_demo.py; inspect red, green, None and __UNKNOWN__. Then add __UNKNOWN__ to train and record
  its own category column.
- Run boundary cases and answer the review cards.
practice_plan:
  vi:
    task: Chạy category_demo.py; kiểm tra red, green, None và chuỗi __UNKNOWN__. Sau đó thêm __UNKNOWN__
      vào train và ghi cột riêng của nhãn này.
    deliverables:
    - Mã và output mẫu
    - Assert mỗi hàng có len(vocabulary)+2 cột và tổng bằng 1
    - Kết quả train toàn None và train rỗng
    checkpoint: Validation mới không đổi vocabulary; None và green có cột khác nhau.
    stretch: Thử train có chuỗi rỗng; giải thích vì sao không tự coi là thiếu.
  en:
    task: Run category_demo.py; inspect red, green, None and __UNKNOWN__. Then add __UNKNOWN__ to train
      and record its own category column.
    deliverables:
    - Code and matching example output
    - Assertions that each row has len(vocabulary)+2 columns and sums to 1
    - Results for all-None and empty training input
    checkpoint: New validation values do not alter vocabulary; None and green use different columns.
    stretch: Try an empty string in train; explain why it is not automatically missing.
interview_questions:
  vi:
  - Với vocabulary (blue, red), mã của green và None là gì?
  - Tại sao fit riêng trên test có thể gây lỗi dù số cột bằng nhau?
  - Vì sao dùng cờ riêng thay chuỗi sentinel?
  en:
  - With vocabulary (blue, red), how are green and None encoded?
  - Why can fitting separately on test fail even with equal column counts?
  - Why use separate flags instead of a string sentinel?
formulas: []
code_examples:
- language: python
  title: Frozen one-hot vocabulary with missing and unknown columns
  code: |-
    def validate_categories(values):
        if any(value is not None and not isinstance(value, str) for value in values):
            raise ValueError("categories must be strings or None")


    def fit_categories(train_values):
        validate_categories(train_values)
        if not train_values:
            raise ValueError("training values must not be empty")
        return tuple(sorted({value for value in train_values if value is not None}))


    def transform_categories(values, vocabulary):
        validate_categories(values)
        validate_categories(vocabulary)
        if None in vocabulary or len(set(vocabulary)) != len(vocabulary):
            raise ValueError("vocabulary must contain unique strings")
        encoded = []
        for value in values:
            known = [int(value == category) for category in vocabulary]
            missing = int(value is None)
            unknown = int(value is not None and value not in vocabulary)
            encoded.append(known + [missing, unknown])
        return encoded


    if __name__ == "__main__":
        vocabulary = fit_categories(["red", "blue", None, "red"])
        print("vocabulary=", vocabulary, sep="")
        print("validation=", transform_categories(["red", "green", None], vocabulary), sep="")
        print("test=", transform_categories(["blue", "__UNKNOWN__"], vocabulary), sep="")
        print("vocabulary_after_transform=", vocabulary, sep="")
  status: runnable
  setup: Python 3.11+; standard library only. Save as category_demo.py and run python category_demo.py.
  setup_vi: Python 3.11+; chỉ thư viện chuẩn. Lưu category_demo.py và chạy python category_demo.py.
  setup_en: Python 3.11+; standard library only. Save as category_demo.py and run python category_demo.py.
  purpose_vi: Học danh mục từ train rồi giữ nguyên thứ tự cột khi gặp nhóm mới.
  purpose_en: Learn training categories and preserve column order for unseen groups.
  expected_output: |-
    vocabulary=('blue', 'red')
    validation=[[0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]
    test=[[1, 0, 0, 0], [0, 0, 0, 1]]
    vocabulary_after_transform=('blue', 'red')
  edge_case_vi: fit_categories([]) báo ValueError; train [None] tạo vocabulary rỗng và hai cột missing/unknown.
    Nếu __UNKNOWN__ có trong train, nó là nhóm thật, không phải sentinel.
  edge_case_en: fit_categories([]) raises ValueError; training [None] produces an empty vocabulary and
    two missing/unknown columns. If __UNKNOWN__ appears in train it is a real category, not a sentinel.
  explanation_vi: Thứ tự cột là blue, red, thiếu, chưa biết. Hai cờ riêng tránh va chạm giữa sentinel
    dạng chuỗi với giá trị thật. Ví dụ không drop cột; mỗi hàng đúng một số 1.
  explanation_en: Column order is blue, red, missing, unknown. Separate flags avoid string-sentinel collisions
    with real labels. No column is dropped; each encoded row has exactly one 1.
resources:
- title: 'scikit-learn: Encoding categorical features'
  url: https://scikit-learn.org/stable/modules/preprocessing.html#encoding-categorical-features
  language: en
  kind: official
  required: true
  purpose_vi: Đối chiếu one-hot, ordinal và nhóm mới.
  purpose_en: Compare one-hot, ordinal and unknown-category handling.
  read_vi: Đọc Encoding categorical features; so handle_unknown với hai cột riêng trong ví dụ.
  read_en: Read Encoding categorical features; compare handle_unknown with the example separate flags.
exercise_ids:
- exercise-3-preprocessing
review_item_ids:
- phase-03-classical-ml-preprocessing-2-recall
- phase-03-classical-ml-preprocessing-2-application
- phase-03-classical-ml-preprocessing-2-debug
- phase-03-classical-ml-preprocessing-2-interview
estimated_minutes: 60
completion_checklist:
- Mã và output mẫu
- Assert mỗi hàng có len(vocabulary)+2 cột và tổng bằng 1
- Kết quả train toàn None và train rỗng
completion_criteria:
- Validation mới không đổi vocabulary; None và green có cột khác nhau.
- Assert mỗi hàng có len(vocabulary)+2 cột và tổng bằng 1
common_mistakes:
- Fit riêng encoder trên test làm đổi ý nghĩa cột.
- Dùng số nguyên áp đặt thứ tự cho thành phố.
- Trùng sentinel với nhãn thật hoặc lộ nhãn qua target encoding.
next_lessons:
- phase-03-classical-ml-preprocessing-3
- phase-03-classical-ml-preprocessing-4
review_question_vi: One-hot khác ordinal ở đâu?
review_question_en: How does one-hot differ from ordinal encoding?
review_answer_vi: One-hot tạo cờ từng nhóm, không áp đặt thứ tự. Ordinal dùng mã số theo thứ tự có nghĩa,
  nhưng khoảng cách giữa mã có thể không phản ánh thực tế.
review_answer_en: One-hot creates group indicators without imposing order. Ordinal uses codes for meaningful
  order, but numeric spacing may not match reality.
review_cards:
- id: phase-03-classical-ml-preprocessing-2-recall
  type: recall
  question_vi: One-hot khác ordinal ở đâu?
  question_en: How does one-hot differ from ordinal encoding?
  answer_vi: One-hot tạo cờ từng nhóm, không áp đặt thứ tự. Ordinal dùng mã số theo thứ tự có nghĩa, nhưng
    khoảng cách giữa mã có thể không phản ánh thực tế.
  answer_en: One-hot creates group indicators without imposing order. Ordinal uses codes for meaningful
    order, but numeric spacing may not match reality.
  hint_vi: So thành phố với thấp/vừa/cao.
  hint_en: Compare cities with low/medium/high.
- id: phase-03-classical-ml-preprocessing-2-application
  type: application
  question_vi: Với vocabulary (blue, red), mã của green và None là gì?
  question_en: With vocabulary (blue, red), how are green and None encoded?
  answer_vi: Cột là blue, red, missing, unknown. green thành [0,0,0,1]; None thành [0,0,1,0]. Vocabulary
    không đổi.
  answer_en: Columns are blue, red, missing, unknown. green becomes [0,0,0,1]; None becomes [0,0,1,0].
    Vocabulary stays frozen.
  hint_vi: Hai cột cuối có ý nghĩa khác nhau.
  hint_en: The last two columns represent different states.
- id: phase-03-classical-ml-preprocessing-2-debug
  type: debug
  question_vi: Tại sao fit riêng trên test có thể gây lỗi dù số cột bằng nhau?
  question_en: Why can fitting separately on test fail even with equal column counts?
  answer_vi: Nếu train có blue/red còn test có green/red thì cột đầu đổi nghĩa. Lưu danh mục train rồi
    chỉ transform test; dùng chính sách unknown đã định.
  answer_en: If train has blue/red and test has green/red, the first column changes meaning. Save the
    training vocabulary and only transform test using the chosen unknown policy.
  hint_vi: So tên cột, không chỉ shape.
  hint_en: Compare column meanings, not only shape.
- id: phase-03-classical-ml-preprocessing-2-interview
  type: interview
  question_vi: Vì sao dùng cờ riêng thay chuỗi sentinel?
  question_en: Why use separate flags instead of a string sentinel?
  answer_vi: Sentinel như __UNKNOWN__ có thể là nhãn thật. Cờ riêng giữ phân biệt thiếu/nhóm mới/nhãn
    thật, nhưng thêm hai chiều; cần lưu schema và theo dõi tỷ lệ unknown.
  answer_en: A sentinel such as __UNKNOWN__ may be a genuine label. Separate flags preserve missing/unknown/real-label
    distinctions at the cost of two dimensions; persist schema and monitor unknown rates.
  hint_vi: Thử đưa __UNKNOWN__ vào train.
  hint_en: Try placing __UNKNOWN__ in train.
completion_checklist_en:
- Code and matching example output
- Assertions that each row has len(vocabulary)+2 columns and sums to 1
- Results for all-None and empty training input
completion_criteria_en:
- New validation values do not alter vocabulary; None and green use different columns.
- Assertions that each row has len(vocabulary)+2 columns and sums to 1
common_mistakes_en:
- Refitting on test changes column meanings.
- Integer city codes impose artificial order.
- Colliding sentinel labels or leaking targets through target encoding.
---
# Mã hóa dữ liệu phân loại / Categorical data

Dữ liệu phân loại biểu diễn nhóm. Thành phố là danh nghĩa, không có thứ tự; mức thấp/vừa/cao có thứ tự. Gán thành phố A=1, B=2, C=3 có thể khiến mô hình khoảng cách hay tuyến tính hiểu sai khoảng cách. One-hot tạo một cột cho mỗi nhóm; ordinal chỉ phù hợp khi thứ tự có nghĩa, và khoảng cách số vẫn là một giả định.

Chia tập trước, fit danh mục trên train rồi transform validation/test với cùng danh mục và thứ tự cột. Không fit encoder riêng trên mỗi tập. Trong cross-validation, danh mục được học trong từng fold train. Ví dụ thêm hai cột cố định: thiếu (None) và nhóm chưa biết. Nhóm mới không làm tăng số cột.

Không dùng chuỗi __UNKNOWN__ như sentinel nếu nó có thể là nhãn thật. Ví dụ dùng hai cờ tách biệt, nên chuỗi đó có trong train thì vẫn là nhóm thật. None biểu diễn thiếu; chuỗi rỗng vẫn là nhóm thật theo hợp đồng này. Mã hóa all-zero cho unknown là chính sách khác; nếu cũng drop một nhóm cơ sở, hai trường hợp có thể không phân biệt được.

One-hot tránh thứ tự giả nhưng số chiều tăng khi có nhiều nhóm. Gộp nhóm hiếm phải học tần suất từ train; chọn ngưỡng bằng validation. Target encoding cần tính ngoài fold cho hàng train để không lộ nhãn của chính hàng đó. Bài này chỉ làm one-hot không dùng nhãn.

Categorical values represent groups. Cities are nominal; low/medium/high are ordered. Coding cities as A=1, B=2, C=3 can impose misleading distances on linear or distance-based models. One-hot creates category indicators. Ordinal codes require meaningful order, and numeric spacing remains an assumption.

Split first, fit vocabulary on train, and transform validation/test with the same vocabulary and column order. Never fit a separate encoder on each split. In cross-validation, learn vocabulary inside each training fold. The example adds two fixed columns: missing (None) and unknown. New categories cannot increase dimensionality.

A string such as __UNKNOWN__ is unsafe as a sentinel if it can be a real label. Separate flags avoid collisions; if that string occurs in train it remains a real category. None means missing; an empty string is an ordinary category here. All-zero unknown encoding is another policy, but with a dropped reference category it may make the two states indistinguishable.

One-hot avoids artificial order but expands high-cardinality inputs. Learn rare-group frequencies only from train and choose thresholds using validation. Target encoding needs out-of-fold training encodings so a row cannot reveal its own label. This lesson uses label-free one-hot encoding only.
