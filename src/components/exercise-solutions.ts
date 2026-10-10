import { foundationSolutions } from './foundation-solutions'
import { workflowSolutions } from './workflow-solutions'
import { mathSolutions } from './math-solutions'
import { framingSolution } from './framing-solution'
import { modelsSolution } from './models-solution'

type SolutionText = {
  approach: string
  explanation: string[]
  pitfall: string
  practice: string
}

// Explicitly published teaching examples, never learner workspace files.
const references = import.meta.glob<string>('../../content/exercise_templates/*/reference.py', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const workedFiles = import.meta.glob<string>([
  '../../content/worked_solutions/**/*.py',
  '../../content/worked_solutions/**/requirements.txt',
], {
  eager: true, query: '?raw', import: 'default',
})

const explanations: Record<string, Record<'vi' | 'en', SolutionText>> = {
  'exercise-0-environment': {
    vi: {
      approach: 'Đọc thông tin của trình thông dịch Python đang chạy qua mô-đun sys.',
      explanation: [
        'sys.version_info.major và .minor trả về hai số nguyên của phiên bản Python thực tế.',
        'sys.executable trả về đường dẫn trình thông dịch đã chạy tệp, nên bạn không cần đoán nơi cài Python.',
        'Trong môi trường ảo venv, sys.prefix trỏ tới môi trường ảo còn sys.base_prefix trỏ tới Python gốc. So sánh hai giá trị để nhận kết quả kiểu bool.',
        'Khối __main__ chỉ in kết quả khi chạy tệp trực tiếp; khi bài kiểm thử dùng import để nạp hàm, khối này không tự in.',
      ],
      pitfall: 'Không ghi cố định phiên bản hoặc đường dẫn: chương trình phải phản ánh môi trường thực tế.',
      practice: 'Đóng bài giải, tự viết lại hàm rồi so sánh kết quả khi chạy bằng Python ngoài và trong .venv.',
    },
    en: {
      approach: 'Read the running interpreter directly through the sys module.',
      explanation: [
        'sys.version_info.major and .minor return the integer components of the actual Python version.',
        'sys.executable gives the interpreter path that ran the file, so there is no installation path to guess.',
        'Inside a venv, sys.prefix points to the environment and sys.base_prefix points to the base Python. Comparing them returns a bool.',
        'The __main__ block prints the result only when the file runs directly; importing the function in a test does not print it.',
      ],
      pitfall: 'Do not hardcode a version or path: the result must reflect the active environment.',
      practice: 'Hide the solution, rewrite the function and compare its output outside and inside .venv.',
    },
  },
  'exercise-0-baseline': {
    vi: {
      approach: 'Lọc dữ liệu hợp lệ vào một danh sách mới rồi tính số lượng, tổng và trung bình.',
      explanation: [
        'Chỉ bỏ qua phần tử là None. Điểm 0 vẫn đi tiếp và được tính vào số lượng.',
        'Loại bool trước khi chấp nhận int hoặc float, vì bool cũng là lớp con của int trong Python.',
        'math.isfinite và kiểm tra khoảng [0, 100] từ chối NaN, vô hạn và điểm ngoài giới hạn.',
        'Danh sách values là dữ liệu mới nên danh sách đầu vào không bị sửa. len và sum tạo ra count và total.',
        'Khi values rỗng, mean là None để không chia cho 0. Ví dụ [0, None, 20] còn [0, 20], có tổng 20 và trung bình 10.',
      ],
      pitfall: 'Dùng if not score sẽ bỏ nhầm điểm 0. Dùng total / count mà không kiểm tra rỗng sẽ gây lỗi chia cho 0.',
      practice: 'Đóng bài giải rồi viết phiên bản chỉ giữ count và total, không tạo danh sách values. Chạy lại cùng bộ kiểm thử.',
    },
    en: {
      approach: 'Collect valid values in a new list, then calculate their count, total and mean.',
      explanation: [
        'Skip only None. Zero continues through validation and contributes to the count.',
        'Reject bool before accepting int or float, because Python bool is also a subclass of int.',
        'math.isfinite and the [0, 100] range check reject NaN, infinity and out-of-range scores.',
        'The new values list leaves the input list unchanged. len and sum produce count and total.',
        'An empty values list returns mean=None rather than dividing by zero. [0, None, 20] becomes [0, 20]: total 20, mean 10.',
      ],
      pitfall: 'if not score incorrectly drops zero. total / count without an empty check can divide by zero.',
      practice: 'Hide the solution and write a version that keeps only count and total, without a values list. Run the same tests.',
    },
  },
  'exercise-0-learning-system': {
    vi: {
      approach: 'Dùng từ điển (dictionary) để lưu số phút của từng ID. Mỗi ID chỉ được tính một lần vào tổng.',
      explanation: [
        'Kiểm tra từng phiên học là dictionary trước khi gọi .get, rồi kiểm tra ID và số phút.',
        'identity.strip() phát hiện ID chỉ chứa khoảng trắng. Khi lưu khóa, vẫn giữ nguyên ID gốc; không tự ý cắt hoặc đổi ID.',
        'Nếu ID đã có nhưng số phút khác, báo ValueError. Nếu cả hai giống nhau, gán lại cùng giá trị nên tổng không tăng.',
        'sum(seen.values()) cộng mỗi phiên đúng một lần. Hai phiên a=20, b=25 có tổng 45; gửi lại a=20 vẫn là 45.',
      ],
      pitfall: 'Cộng phút ngay trong mỗi vòng lặp sẽ đếm trùng. Chỉ dùng set ID thì không đủ phát hiện số phút xung đột.',
      practice: 'Đóng bài giải và thử đổi phiên gửi lại thành a=30. Giải thích vì sao cần báo lỗi thay vì trả tổng mới.',
    },
    en: {
      approach: 'Map each session ID to its minutes in a dictionary. Each ID contributes one value to the total.',
      explanation: [
        'Check that each session is a dictionary before calling .get, then validate its ID and minutes.',
        'identity.strip() detects whitespace-only IDs; the stored key remains the original ID rather than silently changing identity.',
        'Raise ValueError for an existing ID with different minutes. Assigning the same value again leaves the total unchanged.',
        'sum(seen.values()) counts each session once. a=20 and b=25 total 45; retrying a=20 still totals 45.',
      ],
      pitfall: 'Adding minutes on every iteration counts retries twice. A set of IDs alone cannot detect conflicting minutes.',
      practice: 'Hide the solution and retry with a=30. Explain why this should raise an error instead of returning a new total.',
    },
  },
}

export function exerciseSolution(slug: string, language: 'vi' | 'en') {
  const lab = foundationSolutions[slug] ?? workflowSolutions[slug] ?? mathSolutions[slug]
    ?? (slug === 'exercise-3-ml-framing' ? framingSolution : undefined)
    ?? (slug === 'exercise-3-models' ? modelsSolution : undefined)
  if (lab) {
    const files = lab.files.map((name) => ({
      name, content: workedFiles[`../../content/worked_solutions/${slug}/${name}`],
    }))
    if (files.some((file) => file.content === undefined)) return null
    return { ...lab[language], tables: lab[language].tables ?? [], code: files[0].content, files, command: lab.command }
  }
  const text = explanations[slug]?.[language]
  const code = references[`../../content/exercise_templates/${slug}/reference.py`]
  return text && code ? {
    ...text, tables: [], code, files: [{ name: 'starter.py', content: code }],
    command: 'python -m unittest -v test_exercise.py',
    setup: language === 'vi'
      ? 'Chép mã mẫu vào starter.py, đặt cạnh test_exercise.py tải từ mục Tệp và cách chạy, rồi chạy lệnh bên dưới.'
      : 'Put the example code in starter.py beside test_exercise.py from Files & setup, then run the command below.',
  } : null
}
