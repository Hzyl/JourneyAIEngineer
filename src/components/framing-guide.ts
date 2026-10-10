import type { GuideText } from './exercise-guides'

export const framingGuide: Record<'vi' | 'en', GuideText> = {
  vi: {
    summary: 'Xác định thời điểm dự đoán, loại dữ liệu tương lai và giữ đúng ranh giới giữa tập huấn luyện, kiểm định và kiểm tra cuối cùng.',
    steps: [
      'Xét bài toán giả lập: tại thời điểm mua, dự đoán đơn hàng có được hoàn trả trong 30 ngày hay không. Mỗi dòng là một đơn; nhãn 1 nghĩa là có hoàn trả. Trước khi xem kết quả, chọn recall để theo dõi đơn bị bỏ sót, đồng thời báo precision và số đơn cần kiểm tra.',
      'Lập bảng mô tả dữ liệu: kiểu, ý nghĩa, thời điểm biết giá trị và vai trò của từng cột. Chỉ dùng items_at_purchase và prior_orders_at_purchase làm đặc trưng (feature). ID dùng để kiểm tra/chia tập; returned_30d là nhãn; refund_issued là thông tin tương lai cần loại.',
      'Chốt mốc 01/03/2026 cho tập huấn luyện (train), 01/06 cho tập kiểm định (validation), và quan sát tập kiểm tra (test) đến 01/08. Chia theo ngày mua rồi chỉ giữ nhãn đã đủ 30 ngày tại từng mốc. Đơn mua trước mốc nhưng chưa đủ thời gian biết nhãn vẫn bị loại, không gán nhãn 0.',
      'Chỉ dùng tập huấn luyện để chọn lớp đa số làm mô hình cơ sở (baseline). Nếu hòa, chọn 0 theo quy tắc đã định. In ma trận nhầm lẫn (confusion matrix), accuracy, precision và recall trên tập huấn luyện/kiểm định. Precision không xác định phải hiện null, không thay bằng 1.',
      'Lập bảng nguy cơ rò rỉ dữ liệu (leakage). Giải thích vì sao khách hàng có thể lặp lại khi mục tiêu là dự đoán đơn tương lai của cùng nhóm khách hàng. Nếu muốn phục vụ khách hàng hoàn toàn mới, cần giữ riêng khách hàng để đánh giá. Chỉ chạy --include-test sau khi chốt lựa chọn và nêu rõ giới hạn của dữ liệu giả.',
    ],
    checks: [
      'Bảng mô tả dữ liệu phân biệt đặc trưng, ID, nhãn và thông tin xuất hiện sau thời điểm dự đoán.',
      'Có 8 dòng huấn luyện, 4 dòng kiểm định, 4 dòng kiểm tra và 3 dòng bị loại vì chưa đủ thời gian quan sát.',
      'Mô hình cơ sở chọn 0: accuracy trên tập huấn luyện=0.75, accuracy trên tập kiểm định=0.5, recall=0 và precision=null.',
      'Thay nhãn của tập kiểm định/kiểm tra không làm đổi mô hình cơ sở; báo cáo mặc định không có chỉ số của tập kiểm tra.',
    ],
    hints: ['label_ready_on = ordered_on + 30 ngày; kiểm tra label_ready_on <= cutoff, không chỉ ordered_on < cutoff.',
      'Recall = TP/(TP+FN). Accuracy cao vẫn có thể bỏ sót toàn bộ lớp cần phát hiện.'],
    example: 'prediction_time: ordered_on\ntarget: returned_30d\nfeatures: items_at_purchase, prior_orders_at_purchase\nforbidden feature: refund_issued',
  },
  en: {
    summary: 'Define prediction time, exclude future information and defend the train/validation/test split.',
    steps: [
      'Frame a synthetic task: at purchase time, predict a return within 30 days. One row is one order; target 1 means a return. Before inspecting scores, choose recall to track missed returns, while also reporting precision and review workload.',
      'Write a data dictionary with type, meaning, availability and role. Only items_at_purchase and prior_orders_at_purchase are features. IDs support auditing/splits; returned_30d is the label; refund_issued is forbidden future information.',
      'Fix March 1, 2026 as the training cutoff, June 1 as the validation cutoff, and observe test outcomes through August 1. Partition by purchase date, then require 30 days of label maturity at each cutoff. Exclude immature labels rather than calling them negative.',
      'Fit a majority-class baseline on training labels only, with a predeclared tie policy of 0. Report confusion counts, accuracy, precision and recall for train/validation. Undefined precision is null, not an invented perfect score.',
      'List leakage risks and explain why repeated customers fit a future-order deployment within the same customer population. For entirely new customers, add a customer-held-out evaluation. Run --include-test only after freezing choices, and document the synthetic-data limits.',
    ],
    checks: [
      'The dictionary distinguishes features, identifiers, labels and information that arrives after prediction.',
      'There are 8 training, 4 validation and 4 test rows; 3 immature observations are excluded.',
      'The baseline chooses 0: training accuracy=0.75, validation accuracy=0.5, recall=0 and precision=null.',
      'Changing validation/test labels cannot change the baseline; the default report omits test metrics.',
    ],
    hints: ['label_ready_on = ordered_on + 30 days; require label_ready_on <= cutoff, not merely ordered_on < cutoff.',
      'Recall = TP/(TP+FN). High accuracy can still miss every positive outcome.'],
    example: 'prediction_time: ordered_on\ntarget: returned_30d\nfeatures: items_at_purchase, prior_orders_at_purchase\nforbidden feature: refund_issued',
  },
}
