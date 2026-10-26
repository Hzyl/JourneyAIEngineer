---
lesson_id: phase-03-classical-ml-analysis-4
phase_id: phase-03-classical-ml
module_id: analysis
title_vi: Diễn giải và lưu mô hình
title_en: Model interpretation and serialization
summary_vi: Diễn giải hệ số theo thang đo và kiểm tra mô hình JSON cùng tiền xử lý sau khi nạp lại.
summary_en: Interpret coefficients with feature scales and verify a JSON model plus preprocessing after
  reload.
learning_objectives: &id001
- Tính tay hai dự đoán 101 và 99 cùng đóng góp đặc trưng.
- So dự đoán trước/sau JSON và kiểm tra phiên bản/thứ tự/scale.
- Nêu giới hạn diễn giải và rủi ro nạp pickle không tin cậy.
learning_objectives_en: &id002
- Calculate predictions 101 and 99 and their feature contributions.
- Compare predictions across JSON and validate version/order/scales.
- Explain interpretation limits and untrusted-pickle risks.
prerequisites:
- phase-03-classical-ml-analysis-3
- phase-02-math-ml-linear-algebra-1
key_terms:
- model
- interpretation
- serialization
- dataset
- feature
- baseline
- evaluation
- analysis
concept_notes_vi: 'Mô hình tuyến tính minh họa dùng z_size=(size-50)/10, z_age=(age-10)/5 và dự đoán 100+2*z_size-z_age.
  Với size=60, age=15, đóng góp là +2 và -1, kết quả 101. Với 40 và 5, kết quả 99. Đây là mô hình cố định
  để học, không được huấn luyện hoặc kiểm chứng dự báo giá thật.


  Hệ số 2 và -1 tác động trên đặc trưng đã chuẩn hóa; không so trực tiếp với hệ số trên đơn vị gốc. Tăng
  size một đơn vị làm dự đoán tăng 2/10=0.2 khi age cố định; tăng age một đơn vị làm giảm 1/5=0.2. Đó
  là hành vi mô hình, không chứng minh can thiệp size hoặc age gây thay đổi kết quả thật. Đặc trưng tương
  quan làm diễn giải khó hơn; giải thích một hàng không đại diện toàn bộ dữ liệu.


  Artifact JSON lưu schema, version, danh sách đặc trưng có thứ tự, mean/scale đã fit, coefficients và
  intercept. Nạp lại phải xác nhận đúng khóa, phiên bản, thứ tự, kích thước và số hữu hạn; scale phải
  dương. Dữ liệu dự đoán là mapping theo tên để tránh đổi cột âm thầm. So hai dự đoán trước/sau round-trip
  và thử artifact sai; không chỉ kiểm tra tệp tồn tại.


  JSON ở đây chỉ chứa dữ liệu, không thực thi mã khi nạp. Nó không phải định dạng chung để lưu mọi estimator.
  JSON vẫn cần giới hạn kích thước từ bên ngoài và kiểm tra schema; không phải mọi nội dung JSON đều an
  toàn. Không nạp pickle/joblib từ nguồn không tin cậy vì có thể thực thi mã. Với scikit-learn, lưu toàn
  bộ pipeline đã fit từ nguồn tin cậy, thứ tự cột và phiên bản Python/thư viện; không giả định tương thích
  giữa phiên bản. Round-trip đúng chưa chứng minh chất lượng, fairness hoặc an toàn production.'
concept_notes_en: 'The illustrative linear model uses z_size=(size-50)/10, z_age=(age-10)/5 and prediction
  100+2*z_size-z_age. At size=60, age=15 the contributions are +2 and -1, producing 101. At 40 and 5 the
  result is 99. This is a fixed teaching model, neither trained nor validated for real price prediction.


  Coefficients 2 and -1 act on standardized features; they cannot be compared directly with raw-unit coefficients.
  Increasing size by one raw unit raises prediction by 2/10=0.2 with age fixed; increasing age by one
  lowers it by 1/5=0.2. This describes model behavior, not causal effects on actual outcomes. Correlated
  features complicate interpretation; a local row explanation need not represent the whole dataset.


  The JSON artifact stores schema, version, ordered features, fitted means/scales, coefficients and intercept.
  Reloading validates exact keys, version, order, dimensions and finite numbers; scales must be positive.
  Prediction inputs map names to values to prevent silent column swaps. Compare two predictions before/after
  a round trip and test invalid artifacts, rather than merely checking file existence.


  This JSON contains data and does not execute code when loaded. It is not a general estimator persistence
  format. JSON still needs external size limits and schema checks; arbitrary JSON is not automatically
  safe. Never load untrusted pickle/joblib artifacts because loading can execute code. For scikit-learn,
  persist the complete fitted pipeline from a trusted source with column order and Python/library versions;
  do not assume cross-version compatibility. Round-trip equality proves neither quality, fairness nor
  production safety.'
why_it_matters_vi: Thiếu preprocessing hoặc đổi cột có thể làm dự đoán sai dù trọng số vẫn nguyên; giải
  thích hệ số cũng cần đúng đơn vị.
why_it_matters_en: Missing preprocessing or reordered columns can corrupt predictions despite unchanged
  weights; interpretation also requires correct units.
study_steps_vi:
- Tính z_size và z_age của hai hàng.
- Đọc tài liệu diễn giải hệ số và model persistence.
- Chạy round-trip JSON ở Colab/Python, so 101 và 99.
- Thử đổi thứ tự features, version và scale=0; phải gặp ValueError.
- 'Viết model card nhỏ: mục tiêu minh họa, schema, môi trường, giới hạn và nguồn artifact tin cậy.'
study_steps_en:
- Calculate z_size and z_age for both rows.
- Read coefficient interpretation and model persistence references.
- Run the JSON round trip in Colab/Python and compare 101 and 99.
- Change feature order, version and scale=0; expect ValueError.
- 'Write a small model card: teaching purpose, schema, environment, limits and trusted artifact provenance.'
practice_plan:
  vi:
    task: Lưu/nạp mô hình tuyến tính minh họa bằng JSON trong bộ nhớ, xác nhận dự đoán và thử artifact
      hỏng.
    deliverables:
    - Mã, chuỗi JSON và stdout round-trip
    - Bảng hai dự đoán và đóng góp đặc trưng
    - Model card cùng kiểm tra version, scale=0, NaN và khóa thừa
    checkpoint: Trước/sau đều [101.0,99.0]; dữ liệu lỗi bị từ chối.
    stretch: 'Tăng size từ 60 lên 61 khi age=15: dự đoán 101.2; giải thích tại sao không phải tăng 2.'
  en:
    task: Serialize/reload the illustrative linear model as in-memory JSON; verify predictions and reject
      corrupt artifacts.
    deliverables:
    - Code, JSON string and round-trip stdout
    - Two predictions and feature contributions
    - Model card and version, scale=0, NaN and extra-key tests
    checkpoint: Before/after both equal [101.0,99.0]; invalid data is rejected.
    stretch: 'Increase size from 60 to 61 with age=15: predict 101.2; explain why the increase is not
      2.'
interview_questions:
  vi:
  - Hàng size=60, age=15 cho dự đoán nào?
  - Nếu features bị đảo hoặc scale=0 thì sao?
  - Round-trip đúng đã đủ để dùng mô hình thật chưa?
  en:
  - What is predicted for size=60, age=15?
  - What if feature order changes or a scale becomes zero?
  - Is a successful round trip sufficient for real deployment?
formulas:
- standardized feature = (value - training mean) / training scale
- prediction = intercept + sum(coefficient * standardized feature)
- raw-unit sensitivity = coefficient / scale; not a causal effect
code_examples:
- language: python
  title: Validated linear-model JSON round trip
  code: "import json\nfrom math import isfinite\n\n\nFEATURES = [\"size\", \"age\"]\n\n\ndef finite_number(value):\n\
    \    return type(value) in (int, float) and isfinite(value)\n\n\ndef validate_model(model):\n    keys\
    \ = {\"schema\", \"version\", \"features\", \"preprocess\", \"coefficients\", \"intercept\"}\n   \
    \ if type(model) is not dict or set(model) != keys:\n        raise ValueError(\"invalid model keys\"\
    )\n    if model[\"schema\"] != \"teaching-linear\" or type(model[\"version\"]) is not int or model[\"\
    version\"] != 1:\n        raise ValueError(\"unsupported schema or version\")\n    if model[\"features\"\
    ] != FEATURES:\n        raise ValueError(\"ordered features must be size, age\")\n    preprocess =\
    \ model[\"preprocess\"]\n    if type(preprocess) is not dict or set(preprocess) != {\"mean\", \"scale\"\
    }:\n        raise ValueError(\"invalid preprocessing schema\")\n    for vector in [preprocess[\"mean\"\
    ], preprocess[\"scale\"], model[\"coefficients\"]]:\n        if type(vector) is not list or len(vector)\
    \ != 2 or not all(map(finite_number, vector)):\n            raise ValueError(\"two finite numbers\
    \ required per vector\")\n    if not finite_number(model[\"intercept\"]) or any(scale <= 0 for scale\
    \ in preprocess[\"scale\"]):\n        raise ValueError(\"finite intercept and positive scales required\"\
    )\n\n\ndef predict(model, rows):\n    validate_model(model)\n    if not rows:\n        raise ValueError(\"\
    non-empty rows required\")\n    predictions = []\n    for row in rows:\n        if type(row) is not\
    \ dict or set(row) != set(FEATURES) or not all(map(finite_number, row.values())):\n            raise\
    \ ValueError(\"row must contain exactly two finite named features\")\n        value = model[\"intercept\"\
    ]\n        for index, feature in enumerate(FEATURES):\n            standardized = (row[feature] -\
    \ model[\"preprocess\"][\"mean\"][index]) / model[\"preprocess\"][\"scale\"][index]\n            value\
    \ += model[\"coefficients\"][index] * standardized\n        if not isfinite(value):\n            raise\
    \ ValueError(\"non-finite prediction\")\n        predictions.append(value)\n    return predictions\n\
    \n\ndef reject_constant(value):\n    raise ValueError(\"non-standard JSON number: \" + value)\n\n\n\
    def unique_keys(pairs):\n    result = {}\n    for key, value in pairs:\n        if key in result:\n\
    \            raise ValueError(\"duplicate JSON key: \" + key)\n        result[key] = value\n    return\
    \ result\n\n\ndef load_model(serialized):\n    model = json.loads(serialized, parse_constant=reject_constant,\
    \ object_pairs_hook=unique_keys)\n    validate_model(model)\n    return model\n\n\nmodel = {\n   \
    \ \"schema\": \"teaching-linear\",\n    \"version\": 1,\n    \"features\": [\"size\", \"age\"],\n\
    \    \"preprocess\": {\"mean\": [50.0, 10.0], \"scale\": [10.0, 5.0]},\n    \"coefficients\": [2.0,\
    \ -1.0],\n    \"intercept\": 100.0,\n}\nrows = [{\"size\": 60.0, \"age\": 15.0}, {\"size\": 40.0,\
    \ \"age\": 5.0}]\nbefore = predict(model, rows)\nserialized = json.dumps(model, allow_nan=False, sort_keys=True)\n\
    reloaded = load_model(serialized)\nafter = predict(reloaded, rows)\nprint(\"before:\", before)\nprint(\"\
    after:\", after)\nprint(\"round_trip_equal:\", before == after)\nprint(\"size_plus_one:\", predict(reloaded,\
    \ [{\"size\": 61.0, \"age\": 15.0}]))\n"
  status: runnable
  purpose_vi: Kiểm tra preprocessing, schema và dự đoán khi nạp lại.
  purpose_en: Verify preprocessing, schema and predictions across a reload.
  setup: Python 3.11+; standard library only; Colab or python persistence.py.
  expected_output: 'before: [101.0, 99.0]

    after: [101.0, 99.0]

    round_trip_equal: True

    size_plus_one: [101.2]'
  edge_case_vi: 'Đổi version=2, features đảo thứ tự, scale=0, khóa thừa, NaN hoặc khóa JSON trùng: ValueError.
    Thiếu age ở hàng đầu vào cũng bị từ chối.'
  edge_case_en: Version=2, reversed features, scale=0, extra keys, NaN or duplicate JSON keys raise ValueError.
    A row missing age is also rejected.
  explanation_vi: Mô hình cố định cho bài học; không train và không lưu estimator sklearn. Mean/scale
    giả định đã fit trước, không tính lại từ rows mới.
  explanation_en: A fixed teaching model, not training or sklearn estimator persistence. Means/scales
    are assumed fitted earlier and never refitted on new rows.
  setup_vi: Dán mã vào một ô Colab hoặc lưu persistence.py rồi chạy python persistence.py bằng Python
    3.11+. Không cài gói; JSON nằm trong bộ nhớ, không cần tệp dữ liệu.
  setup_en: Paste into one Colab cell, or save persistence.py and run python persistence.py with Python
    3.11+. No packages needed; JSON stays in memory and needs no data files.
resources:
- language: en
  title: scikit-learn Model persistence
  url: https://scikit-learn.org/stable/model_persistence.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc rủi ro pickle/joblib, môi trường và giới hạn tương thích phiên bản.
  read_en: Read pickle/joblib risks, environment requirements and version compatibility limitations.
- language: en
  title: 'scikit-learn: Interpreting linear-model coefficients'
  url: https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc ảnh hưởng thang đo và đặc trưng tương quan đến hệ số.
  read_en: Read how feature scales and correlated features affect coefficients.
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
- exercise-3-analysis
review_item_ids:
- phase-03-classical-ml-analysis-4-recall
- phase-03-classical-ml-analysis-4-application
- phase-03-classical-ml-analysis-4-debug
- phase-03-classical-ml-analysis-4-interview
estimated_minutes: 60
completion_checklist: *id001
completion_criteria: *id001
common_mistakes:
- So hệ số mà quên thang đo hoặc suy ra nhân quả.
- Chỉ lưu trọng số, bỏ preprocessing và thứ tự cột.
- Nạp pickle lạ hoặc coi round-trip là bằng chứng chất lượng.
next_lessons:
- phase-04-deep-learning-pytorch-core-1
- phase-04-deep-learning-pytorch-core-2
review_question_vi: Vì sao hệ số size=2 không nghĩa mỗi đơn vị size tăng dự đoán 2?
review_question_en: Why does size coefficient 2 not mean a two-unit prediction increase per raw unit?
review_answer_vi: 'size được chia scale=10: độ nhạy theo đơn vị gốc là 2/10=0.2 khi age cố định, chỉ là
  hành vi mô hình.'
review_answer_en: Size is divided by scale=10, so raw-unit sensitivity is 2/10=0.2 with age fixed; this
  describes model behavior only.
review_cards:
- id: phase-03-classical-ml-analysis-4-recall
  type: recall
  question_vi: Vì sao hệ số size=2 không nghĩa mỗi đơn vị size tăng dự đoán 2?
  question_en: Why does size coefficient 2 not mean a two-unit prediction increase per raw unit?
  answer_vi: 'size được chia scale=10: độ nhạy theo đơn vị gốc là 2/10=0.2 khi age cố định, chỉ là hành
    vi mô hình.'
  answer_en: Size is divided by scale=10, so raw-unit sensitivity is 2/10=0.2 with age fixed; this describes
    model behavior only.
  hint_vi: Đối chiếu đơn vị, schema và bằng chứng round-trip.
  hint_en: Check units, schema and round-trip evidence.
- id: phase-03-classical-ml-analysis-4-application
  type: application
  question_vi: Hàng size=60, age=15 cho dự đoán nào?
  question_en: What is predicted for size=60, age=15?
  answer_vi: z_size=z_age=1; 100+2*1-1*1=101. Nạp JSON đúng giữ nguyên kết quả này và 99 của hàng còn
    lại.
  answer_en: Both standardized values are 1; 100+2*1-1*1=101. Correct JSON reload preserves it and the
    other row prediction 99.
  hint_vi: Đối chiếu đơn vị, schema và bằng chứng round-trip.
  hint_en: Check units, schema and round-trip evidence.
- id: phase-03-classical-ml-analysis-4-debug
  type: debug
  question_vi: Nếu features bị đảo hoặc scale=0 thì sao?
  question_en: What if feature order changes or a scale becomes zero?
  answer_vi: Validator báo ValueError trước dự đoán; không đoán lại thứ tự hoặc thay scale âm thầm. Kiểm
    tra schema, phiên bản và artifact nguồn.
  answer_en: The validator raises ValueError before prediction; do not guess order or silently replace
    the scale. Inspect schema, version and source artifact.
  hint_vi: Đối chiếu đơn vị, schema và bằng chứng round-trip.
  hint_en: Check units, schema and round-trip evidence.
- id: phase-03-classical-ml-analysis-4-interview
  type: interview
  question_vi: Round-trip đúng đã đủ để dùng mô hình thật chưa?
  question_en: Is a successful round trip sufficient for real deployment?
  answer_vi: Chưa. Cần dữ liệu đánh giá đại diện, giới hạn tác động, pipeline đầy đủ và môi trường tương
    thích. Không nạp pickle lạ; JSON này chỉ minh họa mô hình tuyến tính cố định.
  answer_en: No. Representative evaluation, impact limits, a complete pipeline and compatible environment
    are still needed. Never load unknown pickle; this JSON only illustrates a fixed linear model.
  hint_vi: Đối chiếu đơn vị, schema và bằng chứng round-trip.
  hint_en: Check units, schema and round-trip evidence.
completion_checklist_en: *id002
completion_criteria_en: *id002
common_mistakes_en:
- Compare coefficients without scales or infer causation.
- Save only weights, omitting preprocessing and feature order.
- Load unknown pickle or treat a round trip as quality evidence.
---
# Diễn giải và lưu mô hình / Model interpretation and serialization

Mô hình tuyến tính minh họa dùng z_size=(size-50)/10, z_age=(age-10)/5 và dự đoán 100+2*z_size-z_age. Với size=60, age=15, đóng góp là +2 và -1, kết quả 101. Với 40 và 5, kết quả 99. Đây là mô hình cố định để học, không được huấn luyện hoặc kiểm chứng dự báo giá thật.

Hệ số 2 và -1 tác động trên đặc trưng đã chuẩn hóa; không so trực tiếp với hệ số trên đơn vị gốc. Tăng size một đơn vị làm dự đoán tăng 2/10=0.2 khi age cố định; tăng age một đơn vị làm giảm 1/5=0.2. Đó là hành vi mô hình, không chứng minh can thiệp size hoặc age gây thay đổi kết quả thật. Đặc trưng tương quan làm diễn giải khó hơn; giải thích một hàng không đại diện toàn bộ dữ liệu.

Artifact JSON lưu schema, version, danh sách đặc trưng có thứ tự, mean/scale đã fit, coefficients và intercept. Nạp lại phải xác nhận đúng khóa, phiên bản, thứ tự, kích thước và số hữu hạn; scale phải dương. Dữ liệu dự đoán là mapping theo tên để tránh đổi cột âm thầm. So hai dự đoán trước/sau round-trip và thử artifact sai; không chỉ kiểm tra tệp tồn tại.

JSON ở đây chỉ chứa dữ liệu, không thực thi mã khi nạp. Nó không phải định dạng chung để lưu mọi estimator. JSON vẫn cần giới hạn kích thước từ bên ngoài và kiểm tra schema; không phải mọi nội dung JSON đều an toàn. Không nạp pickle/joblib từ nguồn không tin cậy vì có thể thực thi mã. Với scikit-learn, lưu toàn bộ pipeline đã fit từ nguồn tin cậy, thứ tự cột và phiên bản Python/thư viện; không giả định tương thích giữa phiên bản. Round-trip đúng chưa chứng minh chất lượng, fairness hoặc an toàn production.

The illustrative linear model uses z_size=(size-50)/10, z_age=(age-10)/5 and prediction 100+2*z_size-z_age. At size=60, age=15 the contributions are +2 and -1, producing 101. At 40 and 5 the result is 99. This is a fixed teaching model, neither trained nor validated for real price prediction.

Coefficients 2 and -1 act on standardized features; they cannot be compared directly with raw-unit coefficients. Increasing size by one raw unit raises prediction by 2/10=0.2 with age fixed; increasing age by one lowers it by 1/5=0.2. This describes model behavior, not causal effects on actual outcomes. Correlated features complicate interpretation; a local row explanation need not represent the whole dataset.

The JSON artifact stores schema, version, ordered features, fitted means/scales, coefficients and intercept. Reloading validates exact keys, version, order, dimensions and finite numbers; scales must be positive. Prediction inputs map names to values to prevent silent column swaps. Compare two predictions before/after a round trip and test invalid artifacts, rather than merely checking file existence.

This JSON contains data and does not execute code when loaded. It is not a general estimator persistence format. JSON still needs external size limits and schema checks; arbitrary JSON is not automatically safe. Never load untrusted pickle/joblib artifacts because loading can execute code. For scikit-learn, persist the complete fitted pipeline from a trusted source with column order and Python/library versions; do not assume cross-version compatibility. Round-trip equality proves neither quality, fairness nor production safety.
