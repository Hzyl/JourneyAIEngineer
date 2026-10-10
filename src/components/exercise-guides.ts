import { foundationGuides } from './foundation-guides'
import { workflowGuides } from './workflow-guides'
import { mathGuides } from './math-guides'
import { framingGuide } from './framing-guide'
import { modelsGuide } from './models-guide'

export type GuideText = {
  summary: string
  steps: string[]
  checks: string[]
  hints: string[]
  example?: string
}

export const exerciseGuides: Record<string, Record<'vi' | 'en', GuideText>> = {
  ...foundationGuides,
  ...workflowGuides,
  ...mathGuides,
  'exercise-3-ml-framing': framingGuide,
  'exercise-3-models': modelsGuide,
  'exercise-0-environment': {
    vi: {
      summary: 'Viết một hàm nhận diện phiên bản Python và môi trường đang chạy.',
      steps: [
        'Đọc starter.py, xác định bốn giá trị inspect_environment() cần trả về. Chạy tệp một lần để thấy phần chưa hoàn thành.',
        'Nhập mô-đun sys bằng import sys. Đọc phiên bản, đường dẫn trình thông dịch và hai giá trị prefix của Python đang chạy; không điền giá trị cố định.',
        'Trả về một từ điển (dictionary) có đúng bốn khóa major, minor, executable, in_venv. Hai khóa phiên bản nhận số nguyên; in_venv nhận bool.',
        'Chạy bộ kiểm thử. Nếu một ca lỗi, so sánh giá trị thực tế với yêu cầu trước khi sửa hàm.',
        'Tạo .venv bằng python -m venv .venv. Chạy lại starter.py bằng Python trong .venv rồi so sánh kết quả của hai lần chạy.',
      ],
      checks: [
        'major và minor khớp sys.version_info; executable khớp sys.executable.',
        'in_venv phản ánh sys.prefix khác sys.base_prefix, cả khi bật và tắt môi trường ảo.',
        'Giữ kết quả của cả hai lần chạy và giải thích vì sao đường dẫn Python thay đổi. Kiểm thử đạt không có nghĩa là bạn đã cài đủ công cụ AI.',
      ],
      hints: ['sys.version_info có thuộc tính major và minor.', 'sys.executable cho biết trình thông dịch thực sự đang chạy, không chỉ tên lệnh bạn đã gõ.'],
      example: '# Hình dạng kết quả (giá trị phụ thuộc máy của bạn):\n{"major": 3, "minor": 11, "executable": "...", "in_venv": False}',
    },
    en: {
      summary: 'Write a function that identifies the Python version and active environment.',
      steps: [
        'Read starter.py and identify the four values inspect_environment() must return. Run the file once to see the unfinished part.',
        'Import sys. Read the version, interpreter path and both prefixes from the running Python process; do not hardcode values.',
        'Return a dictionary with major, minor, executable and in_venv. Version fields are integers; in_venv is a bool.',
        'Run the tests. For each failure, compare the actual value with the requirement before changing your function.',
        'Create .venv with python -m venv .venv. Run starter.py using its Python interpreter and compare both outputs.',
      ],
      checks: [
        'major and minor match sys.version_info; executable matches sys.executable.',
        'in_venv reflects whether sys.prefix differs from sys.base_prefix, inside and outside a virtual environment.',
        'Keep both outputs and explain the interpreter path change. Passing does not prove every AI tool is installed.',
      ],
      hints: ['sys.version_info provides major and minor attributes.', 'sys.executable identifies the actual interpreter, not the command you typed.'],
      example: '# Result shape (values depend on your computer):\n{"major": 3, "minor": 11, "executable": "...", "in_venv": False}',
    },
  },
  'exercise-0-baseline': {
    vi: {
      summary: 'Tính số lượng, tổng và trung bình điểm; xử lý dữ liệu thiếu và đầu vào sai.',
      steps: [
        'Trước khi viết mã, tính tay kết quả của [0, None, 20], danh sách rỗng và danh sách chỉ có None.',
        'Duyệt từng phần tử. Bỏ qua None nhưng giữ điểm 0; đừng loại tất cả giá trị được coi là False (falsy).',
        'Từ chối bool, chuỗi, số vô hạn, NaN và điểm ngoài [0, 100] bằng ValueError.',
        'Tính count và total từ các điểm hợp lệ. Chỉ chia để tính mean khi count lớn hơn 0.',
        'Chạy kiểm thử rồi kiểm tra danh sách đầu vào vẫn giữ nguyên. Ghi lại trường hợp thất bại và cách bạn sửa.',
      ],
      checks: [
        '[0, None, 20] trả count=2, total=20, mean=10.',
        '[] và [None] trả count=0, total=0, mean=None.',
        'True, "20", -1, 101 và số không hữu hạn gây ValueError. Danh sách đầu vào không bị sửa.',
      ],
      hints: ['Trong Python, bool là lớp con của int; kiểm tra bool trước.', 'math.isfinite giúp phân biệt số hữu hạn với NaN và vô hạn (infinity).'],
      example: 'summarize_scores([0, None, 20])\n# {"count": 2, "total": 20, "mean": 10}\n\nsummarize_scores([])\n# {"count": 0, "total": 0, "mean": None}',
    },
    en: {
      summary: 'Calculate score count, total and mean while handling missing and invalid inputs.',
      steps: [
        'Before coding, work out the result for [0, None, 20], an empty list and a list containing only None.',
        'Visit each value. Skip None but keep zero; do not filter out every falsy value.',
        'Reject bools, strings, infinity, NaN and scores outside [0, 100] with ValueError.',
        'Compute count and total from valid scores. Divide to get the mean only when count is greater than zero.',
        'Run the tests and verify the input list is unchanged. Record a failing case and how you fixed it.',
      ],
      checks: [
        '[0, None, 20] returns count=2, total=20, mean=10.',
        '[] and [None] return count=0, total=0, mean=None.',
        'True, "20", -1, 101 and non-finite numbers raise ValueError. The input list stays unchanged.',
      ],
      hints: ['Python bool is a subclass of int; check for bool first.', 'math.isfinite distinguishes finite numbers from NaN and infinity.'],
      example: 'summarize_scores([0, None, 20])\n# {"count": 2, "total": 20, "mean": 10}\n\nsummarize_scores([])\n# {"count": 0, "total": 0, "mean": None}',
    },
  },
  'exercise-0-learning-system': {
    vi: {
      summary: 'Cộng phút học và xử lý phiên gửi lại mà không đếm trùng.',
      steps: [
        'Viết ví dụ gồm hai phiên 20 và 25 phút, rồi thêm lại phiên đầu. Dự đoán tổng trước khi viết mã.',
        'Kiểm tra mỗi phiên học là một dictionary, id là chuỗi không rỗng, minutes là số nguyên 1–1440 và không phải bool.',
        'Dùng dictionary lưu số phút đã gặp của mỗi id. Cộng phiên có ID mới; bỏ qua phiên có ID cũ và cùng số phút.',
        'Nếu cùng id nhưng số phút khác nhau, báo ValueError thay vì âm thầm chọn một giá trị.',
        'Chạy kiểm thử với tuần rỗng, phiên gửi trùng, dữ liệu sai và xung đột. Giải thích vì sao gửi lại một phiên không làm tăng tổng.',
      ],
      checks: [
        'Tuần rỗng có tổng 0; hai phiên 20 và 25 phút có tổng 45.',
        'Thêm lại cùng id và số phút vẫn có tổng 45.',
        'ID trùng nhưng khác phút, id rỗng, bool hoặc phút ngoài khoảng gây ValueError.',
      ],
      hints: ['Dùng id làm khóa; chỉ dùng set sẽ không đủ để nhận biết xung đột số phút.', 'Phân biệt phiên trùng hợp lệ với phiên cùng id nhưng nội dung khác.'],
      example: 'sessions = [{"id": "a", "minutes": 20}, {"id": "b", "minutes": 25}]\ntotal_study_minutes(sessions)  # 45\ntotal_study_minutes(sessions + [sessions[0]])  # vẫn là 45',
    },
    en: {
      summary: 'Total study minutes and handle retries without counting sessions twice.',
      steps: [
        'Write an example with 20-minute and 25-minute sessions, then repeat the first session. Predict the total before coding.',
        'Check that each session is a dictionary, id is a non-empty string and minutes is an integer from 1–1440, excluding bool.',
        'Use a dictionary to remember the minutes for each id. Add a new id; skip a repeated id with matching minutes.',
        'Raise ValueError when the same id has different minutes instead of silently choosing a value.',
        'Test an empty week, retries, invalid inputs and conflicts. Explain why resending a session does not increase the total.',
      ],
      checks: [
        'An empty week totals 0; 20-minute and 25-minute sessions total 45.',
        'Repeating a session with the same id and minutes keeps the total at 45.',
        'Conflicting minutes, empty ids, bools and out-of-range minutes raise ValueError.',
      ],
      hints: ['Use id as a key; a set alone cannot detect conflicting minute values.', 'Distinguish a valid retry from the same id carrying different data.'],
      example: 'sessions = [{"id": "a", "minutes": 20}, {"id": "b", "minutes": 25}]\ntotal_study_minutes(sessions)  # 45\ntotal_study_minutes(sessions + [sessions[0]])  # still 45',
    },
  },
}
