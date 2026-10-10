import type { WorkedLab } from './foundation-solutions'

export const workflowSolutions: Record<string, WorkedLab> = {
  'exercise-1-developer-tools': {
    files: ['fetch_status.py', 'mock_api.py', 'test_solution.py'],
    command: 'python -m unittest -v test_solution.py\n# Terminal 1\npython mock_api.py\n# Terminal 2\npython fetch_status.py http://127.0.0.1:8765/status response.json',
    vi: {
      approach: 'Dùng API giả lập trên 127.0.0.1 để luyện lấy JSON, kiểm tra phản hồi và mô tả thay đổi bằng Git. Không cần khóa API hoặc dịch vụ bên ngoài.',
      setup: 'Cần Python 3.11+ và Git. Lưu ba tệp vào cùng thư mục bài tập mới. Kiểm thử tự mở máy chủ với cổng trống và phải báo 5 tests, OK. Khi chạy thủ công, giữ máy chủ ở cửa sổ dòng lệnh 1 rồi gọi API ở cửa sổ 2; dùng Ctrl+C để dừng máy chủ. Phía gọi API ghi đè response.json dành riêng cho bài tập. Nếu cổng 8765 bận, đổi cổng trong mock_api.py và URL tương ứng.',
      explanation: [
        'urlopen giới hạn thời gian chờ 3 giây; lỗi HTTP hoặc kết nối không được báo thành công. Chỉ ghi tệp khi đối tượng JSON có service không rỗng và status="ok", đúng các trường yêu cầu.',
        'mock_api.py chỉ lắng nghe trên địa chỉ nội bộ; /status trả 200, đường dẫn khác trả 404. Đây là máy chủ để học, không dùng làm dịch vụ công khai.',
        'Trong thư mục bài tập riêng, chạy git init rồi git status. Chỉ đưa ba tệp Python và response.json vào vùng chờ commit bằng tên cụ thể. Đọc git diff --cached để biết nội dung sắp lưu. Commit đầu dùng thông điệp feat: add local status API exercise. Git có thể yêu cầu bạn tự cấu hình tên/email nếu máy chưa có.',
        'Tạo nhánh bằng git switch -c lab/status-v2. Đổi service trong mock_api.py thành learning-api-v2, dừng và chạy lại máy chủ rồi lấy phản hồi mới. Kiểm thử thành công cũng cần giá trị kỳ vọng mới cho thay đổi có chủ đích này. Chạy kiểm thử, xem git diff và chọn đúng tệp vào vùng chờ. Đọc git diff --cached trước commit có thông điệp feat: report updated service name.',
        'git show HEAD~1:response.json đọc phản hồi cũ. git worktree add --detach ../workflow-before HEAD~1 lấy bản trước vào thư mục mới chưa tồn tại, giữ nguyên nhánh đang làm. So sánh tệp ở hai thư mục. Kiểm thử API không thay thế việc tự kiểm tra nhánh, phần thay đổi và bước khôi phục này.',
      ],
      pitfall: 'Sửa máy chủ mà chưa khởi động lại sẽ vẫn nhận phản hồi cũ. Đừng đưa cả thư mục vào vùng chờ bằng git add . nếu có tệp riêng tư. Bài tập chỉ dùng dữ liệu giả, không cần kho từ xa hoặc đẩy mã lên.',
      practice: 'Ẩn lời giải. Thêm trường version vào API; trước khi sửa phần gọi API, viết kiểm thử cho cấu trúc mới. Ghi lại phần thay đổi, lý do đổi yêu cầu dữ liệu và thông điệp commit tương ứng.',
    },
    en: {
      approach: 'Use a loopback mock API to fetch and validate JSON, then explain its changes through Git. No API key or external service is required.',
      setup: 'Requires Python 3.11+ and Git for the workflow. Save all three files in a new practice folder. Tests start a server on a free port and should report 5 tests, OK. For manual use, keep the server running in terminal 1 and run the client in terminal 2; Ctrl+C stops the server. The client overwrites the dedicated response.json. If port 8765 is busy, change it in mock_api.py and the client URL.',
      explanation: [
        'urlopen uses a three-second timeout; HTTP or connection errors cannot report success. Validate a JSON object containing exactly a non-empty service and status="ok" before writing.',
        'mock_api.py binds only to loopback; /status returns 200 and other paths return 404. This is a practice server, not a public server.',
        'In the dedicated lab folder, run git init and git status. Stage only the three Python files and response.json by name; inspect git diff --cached. First commit: feat: add local status API exercise. Git may ask you to configure your own name/email if none is configured.',
        'Create a branch with git switch -c lab/status-v2. Change the service in mock_api.py to learning-api-v2, restart the server and fetch again. Update the success test expectation for this deliberate contract change. Run tests, inspect git diff, stage the intended files and inspect git diff --cached before committing feat: report updated service name.',
        'git show HEAD~1:response.json reads the previous response. git worktree add --detach ../workflow-before HEAD~1 restores the earlier version into a new directory that does not already exist, preserving your active branch. Compare the two folders; API tests do not verify these manual branch, diff and recovery steps.',
      ],
      pitfall: 'A server that was not restarted still returns the old response. Avoid git add . around private files; this lab needs only fake data, without a remote or push.',
      practice: 'Hide the solution. Add a version field to the API and test the new schema before updating the client. Record the diff, reason for the contract change and matching commit message.',
    },
  },
  'exercise-1-sql-structures': {
    files: ['learning_log.py', 'test_solution.py'],
    command: 'python -m unittest -v test_solution.py\npython learning_log.py',
    vi: {
      approach: 'Mỗi dòng learners là một người học; mỗi dòng sessions là một phiên học. Trên cùng dữ liệu, so sánh cách dùng LEFT JOIN + GROUP BY với cách tổng hợp bằng SQL rồi tra từ điển trong Python.',
      setup: 'Cần Python 3.11+, không cần thư viện ngoài hoặc máy chủ cơ sở dữ liệu. Lưu hai tệp vào cùng thư mục. Kiểm thử phải báo 5 tests, OK. Khi chạy learning_log.py, JOIN và Lookup đều trả [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)] (Python có thể in nháy đơn). Cơ sở dữ liệu nằm trong bộ nhớ và đóng sau mỗi lần chạy; không kết nối Supabase.',
      explanation: [
        'sessions.id phân biệt từng phiên; learner_id tham chiếu learners.id. Hai người trùng tên vẫn khác ID. Hai phiên cùng 20 phút phải cộng thành 40, không dùng SUM(DISTINCT minutes). PRAGMA foreign_keys bật kiểm tra khóa ngoại cho kết nối SQLite này.',
        'Tuần bắt đầu thứ Hai, trong khoảng [start, start+7 ngày). Ngày ISO YYYY-MM-DD so sánh được theo thứ tự từ điển. Ví dụ lấy ngày 05 và 11/10 nhưng loại 12/10; tuần qua năm mới vẫn được xử lý đúng. Ví dụ dùng ngày học theo lịch, chưa xử lý dấu thời gian (timestamp) hoặc múi giờ.',
        'Đặt điều kiện ngày trong ON của LEFT JOIN giữ người chưa học tuần này. COALESCE đổi SUM(NULL) thành 0. Chuyển điều kiện ấy xuống WHERE có thể làm mất người không có phiên phù hợp.',
        'Cách thứ hai dùng SQL tổng hợp theo learner_id, tạo dictionary rồi duyệt danh sách người học. Với L người và K nhóm có dữ liệu, phần Python tốn O(L+K) trung bình và O(K) bộ nhớ phụ, không tính kết quả trả về. Đây không phải độ phức tạp của toàn bộ truy vấn SQL.',
        'Hai cách phải cho cùng danh sách đã ORDER BY id. Chi phí SQL phụ thuộc số dòng, chỉ mục và kế hoạch thực thi; không kết luận cách nào nhanh hơn từ dữ liệu bốn phiên. Ví dụ giả định ngày ISO trong dữ liệu khởi tạo là đúng, chưa kiểm tra mọi dữ liệu do người dùng nhập.',
      ],
      pitfall: 'GROUP BY name gộp nhầm người trùng tên; INNER JOIN loại người chưa học. Dùng tham số giữ chỗ ? để truyền giá trị, không ghép chuỗi SQL.',
      practice: 'Ẩn lời giải. Thêm số phiên bên cạnh tổng phút. Kiểm thử yêu cầu người chưa học có count=0; giải thích vì sao COUNT(*) sau LEFT JOIN có thể cho 1 và COUNT(s.id) phù hợp hơn.',
    },
    en: {
      approach: 'Each learners row represents one learner; each sessions row represents one session. Compare LEFT JOIN plus GROUP BY with a SQL aggregate followed by Python dictionary lookup on the same data.',
      setup: 'Requires Python 3.11+, without third-party packages or a database server. Save both files in one folder. Tests should report 5 tests, OK. Run learning_log.py: JOIN and Lookup both return [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)] (Python may print single quotes). The database lives in memory and closes after each run; it does not connect to Supabase.',
      explanation: [
        'sessions.id identifies a session; learner_id references learners.id. Equal names do not merge learners, and two 20-minute sessions total 40: do not use SUM(DISTINCT minutes). PRAGMA foreign_keys enables foreign-key enforcement on this SQLite connection.',
        'A week starts on Monday and spans [start, start+7 days). ISO YYYY-MM-DD dates sort lexically. October 5 and 11 are included but October 12 is excluded; year boundaries also work. These are calendar study dates, not timestamps or time-zone calculations.',
        'Keep date predicates in the LEFT JOIN ON clause to preserve learners without sessions that week. COALESCE converts SUM(NULL) to zero. Moving those predicates into WHERE can remove unmatched learners.',
        'The second approach aggregates SQL rows by learner_id, builds a dictionary and visits each learner. For L learners and K populated groups, the Python part takes expected O(L+K) time and O(K) auxiliary memory excluding the output. This is not the complexity of the entire SQL query.',
        'Both approaches must return the same list ordered by id. SQL costs depend on rows, indexes and query plans; four sessions do not establish a speed advantage. This small schema trusts ISO seed dates and does not validate every possible user write.',
      ],
      pitfall: 'GROUP BY name merges distinct learners; INNER JOIN drops learners with no sessions. Bind values with ? placeholders instead of concatenating SQL.',
      practice: 'Hide the solution. Add a session count alongside minutes. Test that an inactive learner has count=0; explain why COUNT(*) after LEFT JOIN may return 1 and COUNT(s.id) is appropriate.',
    },
  },
}
