type WorkedText = {
  approach: string
  explanation: string[]
  pitfall: string
  practice: string
  setup: string
  tables?: Array<{ title: string; columns: string[]; rows: string[][] }>
}

export type WorkedLab = {
  files: string[]
  command: string
  vi: WorkedText
  en: WorkedText
}

export const foundationSolutions: Record<string, WorkedLab> = {
  'exercise-1-python-core': {
    files: ['study_scores/__init__.py', 'test_solution.py'],
    command: 'python -m unittest -v test_solution.py',
    vi: {
      approach: 'Một cách làm là tách phép tính điểm trung bình có trọng số thành hàm thuần trong gói study_scores. Ví dụ [(80, 0.25), (100, 0.75)] trả về 95.',
      setup: 'Cần Python 3.11+, không cần thư viện bên ngoài. Tạo thư mục study_scores, lưu __init__.py bên trong rồi đặt test_solution.py cạnh thư mục đó. Chạy lệnh tại thư mục chứa test_solution.py. Kết quả mong đợi: 5 tests, OK.',
      explanation: [
        'Hàm nhận một danh sách không rỗng gồm các tuple (điểm, trọng số). Điểm từ 0 đến 100, trọng số lớn hơn 0 và không quá 1. Tổng trọng số không bắt buộc bằng 1.',
        'Chú thích kiểu (type hint) mô tả đầu vào cho người đọc và công cụ. Khi chạy, vẫn cần kiểm tra để từ chối chuỗi, bool, NaN và dữ liệu ngoài khoảng.',
        'Chia từng trọng số cho tổng trọng số rồi nhân với điểm. [(0, 0.2), (100, 0.2)] có kết quả 50, không phải 20.',
        'Hàm không đọc tệp, không in và không sửa danh sách đầu vào: cùng dữ liệu luôn cho cùng kết quả. Tách phần tính toán thành gói riêng giúp tái sử dụng.',
        'assertAlmostEqual phù hợp với số thực. Bộ kiểm thử gồm trường hợp rỗng, biên, dữ liệu sai và yêu cầu đầu vào không bị sửa; việc đạt kiểm thử chưa chứng minh hàm đúng với mọi dữ liệu.',
      ],
      pitfall: 'Bỏ bước chuẩn hóa trọng số sẽ sai khi tổng trọng số khác 1. isinstance(True, int) là True, nên cần loại bool.',
      practice: 'Ẩn lời giải. Đổi yêu cầu để cho phép trọng số 0 nhưng tổng trọng số phải dương. Viết kiểm thử cho một trọng số 0 và cho toàn bộ trọng số bằng 0 trước khi sửa hàm.',
    },
    en: {
      approach: 'One solution: a study_scores package calculates a weighted mean with a pure function. [(80, 0.25), (100, 0.75)] returns 95.',
      setup: 'Requires Python 3.11+, with no third-party packages. Create study_scores and save __init__.py inside it; place test_solution.py next to that folder. Run the command from the directory containing test_solution.py. Expected: 5 tests, OK.',
      explanation: [
        'Contract: a non-empty list of (score, weight) tuples; scores range from 0 to 100 and weights are greater than 0 and at most 1. Weights need not sum to 1.',
        'Type hints describe inputs for readers and tools; runtime validation still rejects strings, bools, NaN and out-of-range data.',
        'Divide each weight by the total weight before multiplying by its score. [(0, 0.2), (100, 0.2)] returns 50, not 20.',
        'The function performs no file reads, printing or input mutation: the same input gives the same output. The package keeps calculation reusable.',
        'assertAlmostEqual handles floating-point comparisons. Tests cover empty, boundary and invalid inputs plus input preservation; they do not prove correctness for all inputs.',
      ],
      pitfall: 'Skipping weight normalization fails when weights do not sum to 1. isinstance(True, int) is True, so reject bool explicitly.',
      practice: 'Hide the solution. Allow individual zero weights but require a positive total. Write tests for one zero weight and all-zero weights before changing the function.',
    },
  },
  'exercise-1-reliable-code': {
    files: ['tags.py', 'test_solution.py', 'buggy.py'],
    command: 'python buggy.py\npython -m unittest -v test_solution.py',
    vi: {
      approach: 'Tái hiện lỗi dùng chung danh sách mặc định trong add_tag và quan sát nhật ký chạy. Sau đó dùng None và bản sao danh sách để các lần gọi không ảnh hưởng lẫn nhau.',
      setup: 'Cần Python 3.11+. Lưu ba tệp vào cùng thư mục. buggy.py cố ý có lỗi: cả hai kết quả đều chứa python và sql. Kiểm thử lời giải tags.py phải báo 5 tests, OK. Không dùng buggy.py làm mã đã sửa.',
      explanation: [
        'Dự đoán add_tag("python") trả ["python"] và add_tag("sql") trả ["sql"]. Ghi giả thuyết: hai lần gọi có thể dùng chung một danh sách.',
        'Chạy buggy.py. Nhật ký id và nội dung trước/sau cho thấy danh sách mặc định chỉ được tạo một lần khi định nghĩa hàm. first và second cùng tham chiếu tới danh sách đó.',
        'Dùng None làm giá trị mặc định và tạo danh sách mới trong hàm. Nếu người gọi truyền vào một danh sách, dùng copy để không sửa đầu vào.',
        'test_calls_are_independent tái hiện đúng lỗi cũ. Đổi dòng import trong bài kiểm thử thành from buggy import add_tag thì kết quả phải là FAIL; đổi về from tags import add_tag thì phải là PASS.',
        'ValueError do tag rỗng là lỗi đầu vào; dùng chung danh sách là lỗi logic. ModuleNotFoundError do lưu sai tên hoặc thư mục là lỗi thiết lập môi trường. Hãy kiểm tra đường dẫn trước khi sửa thuật toán.',
      ],
      pitfall: 'Chỉ kiểm tra một lần gọi sẽ bỏ sót lỗi. Thay tags=[] bằng tags=None nhưng vẫn sửa danh sách truyền vào cũng làm thay đổi dữ liệu của người gọi.',
      practice: 'Ẩn lời giải, tự viết lại kiểm thử hồi quy. Sau đó thêm yêu cầu không phân biệt hoa/thường và giải thích kiểm thử nào cần đổi, kiểm thử nào vẫn phải giữ.',
    },
    en: {
      approach: 'Reproduce a shared mutable default in add_tag, inspect its logs, then use None and a copied list to isolate calls.',
      setup: 'Requires Python 3.11+. Save the three files in one folder. buggy.py intentionally fails its intended behavior: both results contain python and sql. Tests for the corrected tags.py must report 5 tests, OK. Do not use buggy.py as the fix.',
      explanation: [
        'Predict that add_tag("python") returns ["python"] and add_tag("sql") returns ["sql"]. Record a hypothesis: both calls might share one list.',
        'Run buggy.py. Logs of the list identity and contents show that the default list is created once when the function is defined. first and second reference the same list.',
        'Use None as the default and create a new list inside the function. Copy a supplied list so the result does not mutate the caller’s input.',
        'test_calls_are_independent reproduces the original bug. Change the test import to from buggy import add_tag: this test must FAIL. Restore from tags import add_tag: it must PASS.',
        'ValueError for an empty tag is an input failure. Shared list state is a logic failure. ModuleNotFoundError from a misplaced file is an environment setup failure; check paths before changing the algorithm.',
      ],
      pitfall: 'Testing only one call misses the bug. Replacing tags=[] with tags=None still mutates caller data if you append to the supplied list.',
      practice: 'Hide the solution and recreate the regression test. Then add case-insensitive deduplication and explain which tests must change and which must remain.',
    },
  },
  'exercise-1-data-files': {
    files: ['clean_scores.py', 'test_solution.py'],
    command: 'python -m unittest -v test_solution.py\npython clean_scores.py scores.csv cleaned.json',
    vi: {
      approach: 'Đọc CSV bằng DictReader, kiểm tra tên cột và từng dòng. Sau đó ghi JSON gồm records chứa bản ghi hợp lệ và errors chứa lỗi kèm số dòng.',
      setup: 'Cần Python 3.11+. Lưu hai tệp trong cùng thư mục. Kiểm thử phải báo 5 tests, OK. Để chạy quy trình xử lý, tạo scores.csv từ ví dụ ở Đề bài. Lệnh sau kiểm thử sẽ tạo cleaned.json và báo Kept 2; rejected 1. Chạy lại sẽ ghi đè tệp kết quả này, vì vậy hãy dùng tệp riêng cho bài tập.',
      explanation: [
        'Cấu trúc dữ liệu yêu cầu đúng hai cột name,score theo thứ tự. Sai tên cột thì dừng toàn bộ lần chạy; sai số cột ở một dòng thì chỉ đưa dòng đó vào errors.',
        'Dùng utf-8-sig để nhận cả UTF-8 có BOM và không BOM; csv xử lý dấu phẩy trong trường được bao bằng dấu nháy. Không dùng split(",").',
        'Cắt khoảng trắng ở hai đầu tên, đổi điểm thành số hữu hạn trong [0,100]. Giữ điểm 0; loại tên rỗng, NaN và điểm sai kèm lý do. Không tự điền điểm thiếu.',
        'reader.line_num là số dòng vật lý cuối của bản ghi, kể cả bản ghi trải trên nhiều dòng. errors giúp tìm lại dữ liệu gốc; records chỉ giữ dữ liệu đã qua kiểm tra.',
        'Không sửa nguồn và từ chối trường hợp nguồn/đích cùng đường dẫn. Ghi JSON mới thay vì nối thêm để chạy lại không nhân đôi kết quả. Quy trình nhỏ này xử lý trong bộ nhớ; chưa đọc dữ liệu theo luồng hoặc ghi tệp theo cách nguyên tử cho dữ liệu lớn.',
      ],
      pitfall: 'float("NaN") không báo ValueError. Cần isfinite để tránh đưa NaN vào kết quả. Chỉ bắt lỗi dự kiến, không bỏ qua mọi ngoại lệ rồi báo thành công.',
      practice: 'Ẩn lời giải. Thêm quy tắc phát hiện tên trùng, nêu rõ giữ hay loại bản ghi nào rồi viết kiểm thử. Giải thích vì sao gộp tên giống nhau có thể làm mất dữ liệu.',
    },
    en: {
      approach: 'Read CSV with DictReader, validate the header and rows, then write JSON containing valid records and errors with line numbers.',
      setup: 'Requires Python 3.11+. Save both files in one folder. Tests must report 5 tests, OK. Create scores.csv using the task example; the command after the tests creates cleaned.json and reports Kept 2; rejected 1. Rerunning overwrites that output; use a dedicated exercise output file.',
      explanation: [
        'The schema requires exactly name,score in that order. A bad header stops the run; a wrong column count in one row sends only that row to errors.',
        'utf-8-sig accepts UTF-8 with or without a BOM; csv handles commas inside quoted fields. Do not parse CSV using split(",").',
        'Trim names and convert scores to finite numbers in [0,100]. Keep zero; reject empty names, NaN and invalid scores with reasons. Do not invent missing scores.',
        'reader.line_num is the final physical line of each record, including multiline records. Errors locate the original data; records contain only validated data.',
        'Preserve the source and reject identical source/output paths. Rewrite JSON instead of appending so retries do not duplicate results. This small in-memory pipeline does not implement streaming or atomic writes for large data.',
      ],
      pitfall: 'float("NaN") does not raise ValueError. Check isfinite to keep NaN out of the output. Catch expected failures instead of swallowing every exception and claiming success.',
      practice: 'Hide the solution. Add a duplicate-name rule, document which rows you keep or drop, and test it. Explain why merging equal names can lose data.',
    },
  },
}
