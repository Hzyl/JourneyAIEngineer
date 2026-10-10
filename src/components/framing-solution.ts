import type { WorkedLab } from './foundation-solutions'

export const framingSolution: WorkedLab = {
  files: ['framing.py', 'test_solution.py'],
  command: 'python -m unittest -v test_solution.py\npython framing.py',
  vi: {
    approach: 'Xác định bài toán học máy bắt đầu từ thời điểm cần quyết định và thời điểm có thể biết nhãn. Ví dụ dùng 19 đơn hàng giả để dự đoán hoàn trả trong 30 ngày, với mô hình cơ sở luôn chọn lớp đa số. Bạn không cần huấn luyện mô hình phức tạp để phát hiện lỗi thiết kế.',
    setup: 'Cần Python 3.11+, không cần thư viện ngoài và không dùng dữ liệu khách hàng thật. Lưu hai tệp vào cùng thư mục. Kiểm thử phải báo 6 tests, OK. framing.py in JSON; muốn giữ báo cáo, chạy python framing.py > framing-report.json trong thư mục bài tập riêng. Lệnh chuyển hướng ghi đè tệp đó. Chỉ chạy python framing.py --include-test sau khi chốt phương án.',
    tables: [
      { title: 'Bảng mô tả dữ liệu', columns: ['Trường / kiểu', 'Khi nào biết?', 'Vai trò'], rows: [
        ['order_id · string', 'Lúc mua', 'Khóa duy nhất để phát hiện trùng; không dùng làm đặc trưng.'],
        ['customer_id · string', 'Lúc mua', 'Kiểm tra khách hàng xuất hiện nhiều lần; không dùng làm đặc trưng.'],
        ['ordered_on · date', 'Lúc mua', 'Thời điểm dự đoán và chia dữ liệu.'],
        ['items_at_purchase · int ≥ 1', 'Lúc mua', 'Đặc trưng: số sản phẩm trong đơn.'],
        ['prior_orders_at_purchase · int ≥ 0', 'Lúc mua', 'Đặc trưng: số đơn trước đó, không tính đơn hiện tại hoặc tương lai.'],
        ['returned_30d · 0/1', 'Sau thời gian quan sát 30 ngày', 'Biến đích: có hoàn trả trong thời gian quan sát hay không.'],
        ['refund_issued · 0/1', 'Sau quyết định mua', 'Thông tin tương lai được thêm có chủ đích; tuyệt đối không dùng làm đặc trưng.'],
        ['label_ready_on · date', 'Suy ra từ ngày mua + 30', 'Mốc sớm nhất được dùng nhãn trong ví dụ; không dùng làm đặc trưng.'],
      ] },
      { title: 'Nguy cơ rò rỉ dữ liệu', columns: ['Nguy cơ', 'Vì sao sai?', 'Cách xử lý'], rows: [
        ['Dùng refund_issued', 'Tiết lộ kết quả tương lai.', 'Chỉ lấy đặc trưng trong danh sách cho phép FEATURES.'],
        ['Đếm prior_orders từ toàn lịch sử', 'Đưa đơn tương lai vào đặc trưng quá khứ.', 'Tính theo thời điểm mua; ví dụ sinh số đếm theo thứ tự thời gian.'],
        ['Đơn chưa đủ 30 ngày', 'Nhãn chưa biết có thể bị gọi nhầm là không hoàn trả.', 'Loại nếu label_ready_on > cutoff của tập dữ liệu tương ứng.'],
        ['Trộn ngẫu nhiên mọi ngày', 'Có thể dùng dữ liệu tương lai để đánh giá quyết định quá khứ.', 'Dùng các khoảng thời gian đã định và ghi giả định triển khai.'],
        ['Khách hàng lặp giữa các tập', 'Không chứng minh chất lượng cho khách hàng hoàn toàn mới.', 'Nêu rõ phạm vi cùng nhóm khách hàng; khi đánh giá khách hàng mới, giữ riêng một nhóm khách hàng (group holdout).'],
        ['Chọn mô hình theo điểm của tập kiểm tra', 'Tập kiểm tra bị dùng để ra quyết định.', 'Dùng tập kiểm định để chọn phương án, chốt lựa chọn rồi mới xem tập kiểm tra. Ví dụ không cưỡng chế quy tắc này bằng quyền truy cập.'],
      ] },
    ],
    explanation: [
      'Đơn được chia theo ordered_on, không theo thứ tự dòng. Mỗi tập lại lọc theo label_ready_on <= mốc quyết định. Ba đơn ngày 20/02, 20/05 và 20/07 chưa đủ 30 ngày tại các mốc tương ứng nên bị loại. Không di chuyển chúng sang tập khác hoặc gán nhãn âm.',
      'Tập huấn luyện có 6 nhãn 0 và 2 nhãn 1 nên mô hình cơ sở chọn 0. Dự đoán hằng số không dùng đặc trưng, nhưng danh sách cho phép vẫn minh họa yêu cầu dữ liệu của mô hình tiếp theo. Quy tắc chọn 0 khi hòa được định trước, không điều chỉnh theo tập kiểm định.',
      'Tập kiểm định có TN=2, FN=2, TP=FP=0: accuracy=0.5 và recall=0. Precision là null vì không có dự đoán dương. Mô hình cơ sở không phát hiện được đơn hoàn trả nào; accuracy trên tập huấn luyện=0.75 chưa cho thấy nó hữu ích cho mục tiêu này.',
      'Khi nguồn lực kiểm tra đơn có hạn, cần đọc recall cùng precision, số cảnh báo và chi phí FP/FN. Bài này chưa có mô hình xác suất hoặc ngân sách vận hành để chọn ngưỡng dự đoán (threshold). Không thể dựa vào một chỉ số đơn lẻ để kết luận sẵn sàng triển khai.',
      'Khách hàng giả có thể xuất hiện ở nhiều giai đoạn vì mục tiêu là dự đoán đơn tương lai của cùng nhóm khách hàng. Đây chưa phải kiểm chứng cho khách hàng mới. Ngày trong ví dụ được đơn giản hóa; dữ liệu thật cần dấu thời gian, độ trễ ghi nhãn, thời gian cho phép hoàn trả và phép nối đúng thời điểm (point-in-time join).',
      'Báo cáo mặc định chỉ in chỉ số huấn luyện/kiểm định và ID của từng tập. --include-test dùng để xem kết quả cuối, không phải cơ chế bảo mật; mã kiểm thử đã chứa dữ liệu giả để kiểm tra chương trình. Cỡ mẫu nhỏ không cho phép suy rộng sang sản phẩm thật.',
    ],
    pitfall: 'Chỉ kiểm tra ngày mua mà quên thời điểm biết nhãn vẫn gây rò rỉ dữ liệu. Không coi precision=null là số 0 hoặc 1 khi kết luận; hãy nói rõ không có dự đoán dương.',
    practice: 'Ẩn lời giải. Đổi thời gian quan sát mục tiêu thành 60 ngày, cập nhật kiểm thử biên và báo số dòng còn lại trước khi đo điểm. Sau đó viết phương án đánh giá cho khách hàng chưa từng xuất hiện; giải thích vì sao có thể phải chờ đủ dữ liệu mới đánh giá được.',
  },
  en: {
    approach: 'A complete framing exercise begins with decision time and label availability. Use 19 synthetic orders, a 30-day return target and a majority-class baseline; a complex model is unnecessary for exposing design errors.',
    setup: 'Requires Python 3.11+, without third-party packages or real customer data. Save both files in one folder. Tests should report 6 tests, OK. framing.py prints JSON; to keep it, run python framing.py > framing-report.json in your practice folder. Redirection overwrites that file. Run python framing.py --include-test only after freezing the approach.',
    tables: [
      { title: 'Data dictionary', columns: ['Field / type', 'Available when?', 'Role'], rows: [
        ['order_id · string', 'At purchase', 'Unique audit key; not a feature.'],
        ['customer_id · string', 'At purchase', 'Audit repeated customer groups; not a feature.'],
        ['ordered_on · date', 'At purchase', 'Prediction time and split boundary.'],
        ['items_at_purchase · int ≥ 1', 'At purchase', 'Feature: number of items in the order.'],
        ['prior_orders_at_purchase · int ≥ 0', 'At purchase', 'Feature: earlier orders, excluding this and future orders.'],
        ['returned_30d · 0/1', 'After the 30-day window', 'Target: whether a return occurred within the window.'],
        ['refund_issued · 0/1', 'After the purchase decision', 'Deliberately included future information; never a feature.'],
        ['label_ready_on · date', 'Derived as purchase date + 30', 'Earliest label-use date allowed by this example; not a feature.'],
      ] },
      { title: 'Leakage risk table', columns: ['Risk', 'Why it fails', 'Mitigation'], rows: [
        ['Using refund_issued', 'Reveals a future outcome.', 'Select only the FEATURES whitelist.'],
        ['Computing prior_orders from all history', 'Future purchases enter past features.', 'Compute as of purchase time; the demo counts in chronological order.'],
        ['Orders younger than 30 days', 'An unobserved outcome may be mislabeled negative.', 'Exclude when label_ready_on exceeds the partition cutoff.'],
        ['Randomly mixing all dates', 'Future information can evaluate past decisions.', 'Use predeclared time periods and document deployment assumptions.'],
        ['Repeated customers across splits', 'Does not establish performance for entirely new customers.', 'Scope claims to the existing population; add group holdout for new-customer deployment.'],
        ['Selecting models using test scores', 'Test becomes decision-making data.', 'Choose on validation, freeze, then reveal test; this example does not enforce access control.'],
      ] },
    ],
    explanation: [
      'Partition by ordered_on, not row position, and require label_ready_on <= the decision cutoff in each partition. February 20, May 20 and July 20 orders are immature at their respective cutoffs. Do not move them to another split or label them negative.',
      'Training contains six zeros and two ones, so the baseline predicts zero. Constant predictions ignore features, but the whitelist demonstrates a data contract for the next model. The zero tie policy is predeclared, not tuned on validation.',
      'Validation has TN=2, FN=2 and TP=FP=0: accuracy=0.5 and recall=0. Precision is null because there are no positive predictions. This baseline misses every return; training accuracy=0.75 does not establish utility for detecting returns.',
      'When review capacity is limited, pair recall with precision, alert volume and false-positive/false-negative costs. This lab has neither probability scores nor an operational budget for threshold selection; one metric alone does not justify deployment.',
      'Synthetic customers can recur across periods because the deployment target is future orders from the same population. This does not validate new-customer performance. Calendar dates are simplified; real data needs timestamps, label arrival delays, exact return windows and point-in-time joins.',
      'The default report prints train/validation metrics and split IDs. --include-test is a final reveal, not a security mechanism; test source contains synthetic outcomes to verify program behavior. This tiny sample cannot support real-product generalization claims.',
    ],
    pitfall: 'Checking purchase dates without label availability still permits leakage. Do not interpret precision=null as zero or one; explicitly state that there were no positive predictions.',
    practice: 'Hide the solution. Change the target window to 60 days, update boundary tests and report remaining rows before measuring performance. Propose an evaluation for never-seen customers and explain when additional data must mature before evaluation is possible.',
  },
}
