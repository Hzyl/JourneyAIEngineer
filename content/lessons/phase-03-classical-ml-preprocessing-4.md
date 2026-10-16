---
lesson_id: phase-03-classical-ml-preprocessing-4
phase_id: phase-03-classical-ml
module_id: preprocessing
title_vi: Xây dựng đặc trưng
title_en: Feature engineering
summary_vi: Tạo đặc trưng lịch sử đúng khách hàng và đúng thời điểm dữ liệu có sẵn.
summary_en: Build history features using the correct customer and point-in-time data availability.
learning_objectives:
- Tạo đặc trưng cửa sổ cho từng khách hàng.
- Kiểm tra ngày sự kiện, ngày có sẵn và cutoff.
- Phân biệt tính đúng với lợi ích mô hình.
learning_objectives_en:
- Build per-customer windowed features.
- Check event time, availability time and cutoff.
- Distinguish arithmetic correctness from model utility.
prerequisites:
- phase-03-classical-ml-preprocessing-3
- phase-02-math-ml-linear-algebra-1
key_terms:
- feature
- engineering
- dataset
- baseline
- evaluation
- preprocessing
concept_notes_vi: |-
  Feature engineering tạo đầu vào mới từ dữ liệu thô, như số lần mua, tổng tiền và trung bình mỗi lần mua trong 30 ngày. Feature selection chọn một phần cột đã có. Cần giả thuyết về thông tin mới; thêm cột không tự làm mô hình tốt hơn.

  Mỗi hàng dự đoán có khóa khách hàng và cutoff riêng. Ví dụ dùng cutoff là đầu ngày; cửa sổ [cutoff−30, cutoff) lấy đầu trái, bỏ đầu phải. Chỉ lấy giao dịch đúng khách, event_day trong cửa sổ và available_day<cutoff. Giao dịch hôm qua nhưng ngày mai mới nhập chưa thể dùng hôm nay.

  Hợp đồng: giao dịch đã xác thực, không trùng, tiền hữu hạn không âm và cùng đơn vị; hoàn tiền cần hợp đồng khác. Không có lịch sử trả count=0, total=0, mean=0 và no_history=1 để phân biệt với giao dịch thật 0 đồng. Hàm không học thống kê nên không cần fit. Imputer/scaler hoặc ngưỡng học thêm phải fit chỉ trên train, rồi đóng băng khi transform validation/test.

  Tổng tiền cả tháng khi dự đoán giữa tháng, trạng thái ghi sau cutoff hoặc nhãn tương lai đều gây rò rỉ. Tái tạo lịch sử đúng từng hàng train. So baseline với baseline cộng đặc trưng trên cùng split thời gian và metric, thử bỏ đặc trưng để đánh giá. Bài này kiểm chứng phép tính và ranh giới dữ liệu, chưa chứng minh tăng chất lượng mô hình.
concept_notes_en: |-
  Feature engineering creates inputs from raw records, such as purchase count, total and mean spend in the prior 30 days. Feature selection retains existing columns. State a hypothesis about new information; adding columns does not guarantee better predictions.

  Each prediction row needs its own customer key and cutoff. Here cutoff is the start of a day; [cutoff−30, cutoff) includes the left endpoint and excludes the right. Use matching customers, event_day in the window and available_day<cutoff. A purchase from yesterday entered tomorrow cannot be used today.

  The contract assumes validated, unique purchases with finite nonnegative amounts in one currency; refunds need another contract. No history returns count=0, total=0, mean=0 and no_history=1 to distinguish it from an observed zero-value purchase. The function learns no statistics and needs no fit. Any added imputer/scaler or learned threshold must fit only on train, then stay frozen for validation/test.

  Full-month spend for a mid-month prediction, status recorded after cutoff and future labels cause leakage. Reconstruct history at each training row cutoff too. Compare baseline with added features on the same temporal split and metric; use ablation. This lesson verifies arithmetic and information boundaries, not model-quality improvement.
why_it_matters_vi: Giữ cách xử lý dữ liệu nhất quán giữa huấn luyện và dự đoán để tránh rò rỉ hoặc sai
  lệch.
why_it_matters_en: Build consistent, leakage-safe preprocessing that turns messy data into reproducible
  features.
study_steps_vi:
- Đọc khái niệm; vẽ [0,30) và ngày dữ liệu có sẵn.
- Lưu mã, chạy python feature_demo.py.
- 'Chạy feature_demo.py. Thêm giao dịch A ngày 40: kết quả ngày 30 phải không đổi. Thêm giao dịch ngày
  0 rồi ngày −1 để kiểm tra ranh giới.'
- Chạy ca biên và trả lời thẻ ôn tập.
study_steps_en:
- Read concepts; draw [0,30) and availability days.
- Save code and run python feature_demo.py.
- 'Run feature_demo.py. Add an A purchase on day 40: day-30 output must stay unchanged. Add events on
  day 0 and day −1 to test boundaries.'
- Run boundary cases and answer review cards.
practice_plan:
  vi:
    task: 'Chạy feature_demo.py. Thêm giao dịch A ngày 40: kết quả ngày 30 phải không đổi. Thêm giao dịch
      ngày 0 rồi ngày −1 để kiểm tra ranh giới.'
    deliverables:
    - Mã và ba output mẫu
    - Assert khách mới, khách khác, tới trễ và hai đầu cửa sổ
    - Ghi cutoff, đơn vị tiền, khóa khách và giả định không trùng
    checkpoint: Ngày 30 có 2 giao dịch, tổng 30, mean 15; tương lai không đổi lịch sử.
    stretch: Thiết kế so baseline với thêm purchase_count trên cùng split thời gian; chưa chạy thì không
      kết luận tăng điểm.
  en:
    task: 'Run feature_demo.py. Add an A purchase on day 40: day-30 output must stay unchanged. Add events
      on day 0 and day −1 to test boundaries.'
    deliverables:
    - Code and three matching outputs
    - Assertions for new/other customers, late arrivals and window endpoints
    - Notes on cutoff, currency, customer key and unique events
    checkpoint: At day 30 count=2, total=30, mean=15; future events cannot change past features.
    stretch: Design baseline versus added purchase_count on the same temporal split; claim no improvement
      without running it.
interview_questions:
  vi:
  - Tại cutoff 30, vì sao tổng của A là 30, không phải 200?
  - Giao dịch hôm qua được ghi ngày mai có dùng hôm nay không?
  - Tính đúng đã chứng minh đặc trưng giúp mô hình chưa?
  en:
  - At cutoff 30, why is A total 30 rather than 200?
  - Can a purchase from yesterday, recorded tomorrow, be used today?
  - Does correct feature arithmetic prove model improvement?
formulas:
- eligible = same_customer AND cutoff−window ≤ event_day < cutoff AND available_day < cutoff
- mean_purchase = total_spend/purchase_count if purchase_count>0 else 0
code_examples:
- language: python
  title: Point-in-time customer purchase features
  code: |-
    from math import isfinite


    def purchase_features(events, customer_id, cutoff_day, window_days=30):
        if type(cutoff_day) is not int or type(window_days) is not int or window_days <= 0:
            raise ValueError("cutoff and positive window must use integer days")
        selected_amounts = []
        for event in events:
            if event["customer_id"] != customer_id:
                continue
            event_day = event["event_day"]
            available_day = event["available_day"]
            amount = event["amount"]
            if type(event_day) is not int or type(available_day) is not int:
                raise ValueError("event and availability days must be integers")
            if available_day < event_day:
                raise ValueError("availability cannot precede the event")
            if isinstance(amount, bool) or not isinstance(amount, (int, float)) or not isfinite(amount) or amount < 0:
                raise ValueError("purchase amount must be finite and nonnegative")
            in_window = cutoff_day - window_days <= event_day < cutoff_day
            known_at_prediction = available_day < cutoff_day
            if in_window and known_at_prediction:
                selected_amounts.append(amount)
        count = len(selected_amounts)
        total = float(sum(selected_amounts))
        mean = total / count if count else 0.0
        return {
            "purchase_count": count,
            "total_spend": total,
            "mean_purchase": mean,
            "no_history": int(count == 0),
        }


    if __name__ == "__main__":
        events = [
            {"customer_id": "A", "event_day": 5, "available_day": 5, "amount": 10},
            {"customer_id": "A", "event_day": 29, "available_day": 29, "amount": 20},
            {"customer_id": "A", "event_day": 29, "available_day": 31, "amount": 80},
            {"customer_id": "A", "event_day": 30, "available_day": 30, "amount": 90},
            {"customer_id": "B", "event_day": 20, "available_day": 20, "amount": 999},
        ]
        print("A_day30=", purchase_features(events, "A", 30), sep="")
        print("new_customer=", purchase_features(events, "NEW", 30), sep="")
        print("A_day32=", purchase_features(events, "A", 32), sep="")
  status: runnable
  setup: Python 3.11+; standard library only. Save as feature_demo.py and run python feature_demo.py.
  setup_vi: Python 3.11+; chỉ thư viện chuẩn. Lưu feature_demo.py và chạy python feature_demo.py.
  setup_en: Python 3.11+; standard library only. Save as feature_demo.py and run python feature_demo.py.
  purpose_vi: Tạo số lần mua, tổng và trung bình chi tiêu chỉ từ lịch sử đã biết tại thời điểm dự đoán.
  purpose_en: Derive count, total and mean purchase features only from history known at prediction time.
  expected_output: |-
    A_day30={'purchase_count': 2, 'total_spend': 30.0, 'mean_purchase': 15.0, 'no_history': 0}
    new_customer={'purchase_count': 0, 'total_spend': 0.0, 'mean_purchase': 0.0, 'no_history': 1}
    A_day32={'purchase_count': 4, 'total_spend': 200.0, 'mean_purchase': 50.0, 'no_history': 0}
  edge_case_vi: Không có lịch sử trả 0 kèm no_history=1. Sự kiện đúng cutoff bị loại; ngày bắt đầu cửa
    sổ được lấy. window_days<=0, số tiền âm và available_day<event_day báo ValueError.
  edge_case_en: No history returns zeros with no_history=1. Events exactly at cutoff are excluded; the
    window start is included. window_days<=0, negative amounts and available_day<event_day raise ValueError.
  explanation_vi: 'Tại đầu ngày 30 chỉ 10+20 đã biết: 80 ghi nhận trễ tới ngày 31, 90 thuộc ngày 30 và
    B là khách khác. Ngày 32 cả bốn giao dịch A đã biết nên tổng 200. Ví dụ không đọc nhãn tương lai.'
  explanation_en: 'At the start of day 30 only 10+20 are known: 80 arrives on day 31, 90 belongs to day
    30, and B is another customer. By day 32 all four A purchases are known, totaling 200. The function
    never reads future labels.'
resources:
- title: 'scikit-learn: Common pitfalls and data leakage'
  url: https://scikit-learn.org/stable/common_pitfalls.html#data-leakage
  language: en
  kind: official
  required: true
  purpose_vi: Kiểm chứng nguyên tắc ngăn rò rỉ.
  purpose_en: Verify leakage prevention principles.
  read_vi: Đọc Data leakage và How to avoid data leakage; áp dụng vào từng hàng và cutoff.
  read_en: Read Data leakage and How to avoid data leakage; apply to each row and cutoff.
exercise_ids:
- exercise-3-preprocessing
review_item_ids:
- phase-03-classical-ml-preprocessing-4-recall
- phase-03-classical-ml-preprocessing-4-application
- phase-03-classical-ml-preprocessing-4-debug
- phase-03-classical-ml-preprocessing-4-interview
estimated_minutes: 60
completion_checklist:
- Mã và ba output mẫu
- Assert khách mới, khách khác, tới trễ và hai đầu cửa sổ
- Ghi cutoff, đơn vị tiền, khóa khách và giả định không trùng
completion_criteria:
- Ngày 30 có 2 giao dịch, tổng 30, mean 15; tương lai không đổi lịch sử.
- Assert khách mới, khách khác, tới trễ và hai đầu cửa sổ
common_mistakes:
- Dùng cả tháng hoặc chỉ kiểm tra event_day.
- Trộn khách hoặc lấy trạng thái sau cutoff.
- Kết luận từ điểm train tăng.
next_lessons:
- phase-03-classical-ml-evaluation-1
- phase-03-classical-ml-evaluation-2
review_question_vi: Đặc trưng hợp lệ tại lúc dự đoán cần gì?
review_question_en: What makes a feature valid at prediction time?
review_answer_vi: Đúng khách hàng, đúng cửa sổ và đã có sẵn trước cutoff. Tái tạo lịch sử theo từng hàng;
  không dùng nhãn hoặc tương lai.
review_answer_en: Use the correct customer, time window and information available before cutoff. Reconstruct
  history per row; exclude targets and future information.
review_cards:
- id: phase-03-classical-ml-preprocessing-4-recall
  type: recall
  question_vi: Đặc trưng hợp lệ tại lúc dự đoán cần gì?
  question_en: What makes a feature valid at prediction time?
  answer_vi: Đúng khách hàng, đúng cửa sổ và đã có sẵn trước cutoff. Tái tạo lịch sử theo từng hàng; không
    dùng nhãn hoặc tương lai.
  answer_en: Use the correct customer, time window and information available before cutoff. Reconstruct
    history per row; exclude targets and future information.
  hint_vi: Kiểm tra event_day và available_day.
  hint_en: Check event_day and available_day.
- id: phase-03-classical-ml-preprocessing-4-application
  type: application
  question_vi: Tại cutoff 30, vì sao tổng của A là 30, không phải 200?
  question_en: At cutoff 30, why is A total 30 rather than 200?
  answer_vi: Chỉ 10 và 20 đã biết. Khoản 80 tới ngày 31 mới có; 90 thuộc ngày 30 bị loại vì cutoff là
    đầu ngày. Tổng 30, count 2, mean 15.
  answer_en: Only 10 and 20 are known. The 80 arrives on day 31; the 90 on day 30 is excluded because
    cutoff is start of day. Total 30, count 2, mean 15.
  hint_vi: Phân biệt xảy ra với có sẵn.
  hint_en: Distinguish occurrence from availability.
- id: phase-03-classical-ml-preprocessing-4-debug
  type: debug
  question_vi: Giao dịch hôm qua được ghi ngày mai có dùng hôm nay không?
  question_en: Can a purchase from yesterday, recorded tomorrow, be used today?
  answer_vi: Không. Chỉ kiểm tra event_day làm lộ dữ liệu tới trễ. Cần available_day<cutoff; thêm dữ liệu
    tương lai không được đổi đặc trưng quá khứ.
  answer_en: No. Checking event_day alone leaks late arrivals. Require available_day<cutoff; future records
    must not change past features.
  hint_vi: Xét thời điểm hệ thống biết dữ liệu.
  hint_en: Check when the system knows the record.
- id: phase-03-classical-ml-preprocessing-4-interview
  type: interview
  question_vi: Tính đúng đã chứng minh đặc trưng giúp mô hình chưa?
  question_en: Does correct feature arithmetic prove model improvement?
  answer_vi: Chưa. So baseline với thêm đặc trưng trên cùng split thời gian và metric; kiểm tra ablation,
    chi phí và thiếu lịch sử. Cờ no_history phân biệt khách mới với mua 0 đồng.
  answer_en: No. Compare baseline with added features on the same temporal split and metric; inspect ablation,
    cost and missing history. no_history distinguishes a new customer from a zero-value purchase.
  hint_vi: Tách kiểm tra hàm khỏi đánh giá mô hình.
  hint_en: Separate function correctness from model evaluation.
completion_checklist_en:
- Code and three matching outputs
- Assertions for new/other customers, late arrivals and window endpoints
- Notes on cutoff, currency, customer key and unique events
completion_criteria_en:
- At day 30 count=2, total=30, mean=15; future events cannot change past features.
- Assertions for new/other customers, late arrivals and window endpoints
common_mistakes_en:
- Using full-month history or event time alone.
- Mixing customers or post-cutoff status.
- Claiming value from training score alone.
---
# Xây dựng đặc trưng / Feature engineering

Feature engineering tạo đầu vào mới từ dữ liệu thô, như số lần mua, tổng tiền và trung bình mỗi lần mua trong 30 ngày. Feature selection chọn một phần cột đã có. Cần giả thuyết về thông tin mới; thêm cột không tự làm mô hình tốt hơn.

Mỗi hàng dự đoán có khóa khách hàng và cutoff riêng. Ví dụ dùng cutoff là đầu ngày; cửa sổ [cutoff−30, cutoff) lấy đầu trái, bỏ đầu phải. Chỉ lấy giao dịch đúng khách, event_day trong cửa sổ và available_day<cutoff. Giao dịch hôm qua nhưng ngày mai mới nhập chưa thể dùng hôm nay.

Hợp đồng: giao dịch đã xác thực, không trùng, tiền hữu hạn không âm và cùng đơn vị; hoàn tiền cần hợp đồng khác. Không có lịch sử trả count=0, total=0, mean=0 và no_history=1 để phân biệt với giao dịch thật 0 đồng. Hàm không học thống kê nên không cần fit. Imputer/scaler hoặc ngưỡng học thêm phải fit chỉ trên train, rồi đóng băng khi transform validation/test.

Tổng tiền cả tháng khi dự đoán giữa tháng, trạng thái ghi sau cutoff hoặc nhãn tương lai đều gây rò rỉ. Tái tạo lịch sử đúng từng hàng train. So baseline với baseline cộng đặc trưng trên cùng split thời gian và metric, thử bỏ đặc trưng để đánh giá. Bài này kiểm chứng phép tính và ranh giới dữ liệu, chưa chứng minh tăng chất lượng mô hình.

Feature engineering creates inputs from raw records, such as purchase count, total and mean spend in the prior 30 days. Feature selection retains existing columns. State a hypothesis about new information; adding columns does not guarantee better predictions.

Each prediction row needs its own customer key and cutoff. Here cutoff is the start of a day; [cutoff−30, cutoff) includes the left endpoint and excludes the right. Use matching customers, event_day in the window and available_day<cutoff. A purchase from yesterday entered tomorrow cannot be used today.

The contract assumes validated, unique purchases with finite nonnegative amounts in one currency; refunds need another contract. No history returns count=0, total=0, mean=0 and no_history=1 to distinguish it from an observed zero-value purchase. The function learns no statistics and needs no fit. Any added imputer/scaler or learned threshold must fit only on train, then stay frozen for validation/test.

Full-month spend for a mid-month prediction, status recorded after cutoff and future labels cause leakage. Reconstruct history at each training row cutoff too. Compare baseline with added features on the same temporal split and metric; use ablation. This lesson verifies arithmetic and information boundaries, not model-quality improvement.
