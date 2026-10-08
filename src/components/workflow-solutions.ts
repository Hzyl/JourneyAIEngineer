import type { WorkedLab } from './foundation-solutions'

export const workflowSolutions: Record<string, WorkedLab> = {
  'exercise-1-developer-tools': {
    files: ['fetch_status.py', 'mock_api.py', 'test_solution.py'],
    command: 'python -m unittest -v test_solution.py\n# Terminal 1\npython mock_api.py\n# Terminal 2\npython fetch_status.py http://127.0.0.1:8765/status response.json',
    vi: {
      approach: 'Dùng API giả lập trên 127.0.0.1 để luyện lấy JSON, kiểm tra response và mô tả thay đổi bằng Git. Không cần API key hoặc dịch vụ bên ngoài.',
      setup: 'Cần Python 3.11+ và Git cho phần workflow. Lưu ba file cùng thư mục bài tập mới. Test tự mở server với cổng trống và phải báo 5 tests, OK. Khi chạy thủ công, giữ server ở terminal 1 rồi chạy client ở terminal 2; Ctrl+C dừng server. Client ghi đè response.json dành riêng cho lab. Nếu cổng 8765 bận, đổi cổng trong mock_api.py và URL tương ứng.',
      explanation: [
        'urlopen có timeout 3 giây; lỗi HTTP hoặc kết nối không được báo thành công. Chỉ chấp nhận object JSON có đúng service không rỗng và status="ok" trước khi ghi file.',
        'mock_api.py chỉ lắng nghe loopback; /status trả 200, đường dẫn khác trả 404. Đây là server học tập, không phải server để public.',
        'Trong thư mục lab riêng: git init, sau đó git status. Chỉ stage ba file Python và response.json bằng tên cụ thể; git diff --cached cho thấy đúng nội dung sắp commit. Commit đầu: feat: add local status API exercise. Git có thể yêu cầu bạn tự cấu hình tên/email nếu máy chưa có.',
        'Tạo branch bằng git switch -c lab/status-v2. Đổi service trong mock_api.py thành learning-api-v2, dừng và chạy lại server, lấy response mới. Test success cũng cần cập nhật giá trị kỳ vọng theo thay đổi có chủ đích. Chạy test, git diff rồi stage đúng file; git diff --cached trước commit feat: report updated service name.',
        'git show HEAD~1:response.json đọc lại response cũ. git worktree add --detach ../workflow-before HEAD~1 tạo bản trước trong thư mục mới chưa tồn tại, giữ nguyên branch đang làm. So sánh file ở hai thư mục; test API không thay thế việc tự kiểm tra branch, diff và phục hồi này.',
      ],
      pitfall: 'Sửa server mà chưa khởi động lại sẽ vẫn nhận response cũ. Đừng stage cả thư mục bằng git add . nếu có file riêng tư; lab này chỉ dùng dữ liệu giả, không cần remote hay push.',
      practice: 'Ẩn lời giải. Thêm trường version vào API; trước khi sửa client, viết test cho schema mới. Ghi lại diff, lý do thay đổi hợp đồng và commit message tương ứng.',
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
      approach: 'Một dòng learners là một người học; một dòng sessions là một phiên. So sánh LEFT JOIN + GROUP BY với tổng hợp SQL rồi tra dictionary trong Python trên cùng dữ liệu.',
      setup: 'Cần Python 3.11+, không cài package hay database server. Lưu hai file cùng thư mục. Test phải báo 5 tests, OK. Chạy learning_log.py: JOIN và Lookup đều trả [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)] (Python có thể in nháy đơn). Database nằm trong bộ nhớ và đóng sau mỗi lần chạy; không kết nối Supabase.',
      explanation: [
        'sessions.id phân biệt từng phiên, learner_id tham chiếu learners.id. Hai người trùng tên vẫn khác ID; hai phiên cùng 20 phút phải cộng thành 40, không SUM(DISTINCT minutes). PRAGMA foreign_keys bật kiểm tra khóa ngoại cho connection SQLite này.',
        'Tuần bắt đầu thứ Hai, khoảng [start, start+7 ngày). Ngày ISO YYYY-MM-DD so sánh được theo thứ tự từ điển. Ví dụ chứa ngày 05 và 11/10 nhưng loại 12/10; qua năm mới vẫn đúng. Ví dụ dùng ngày học theo lịch, không xử lý timestamp hay múi giờ.',
        'Đặt điều kiện ngày trong ON của LEFT JOIN giữ người chưa học tuần này. COALESCE đổi SUM(NULL) thành 0. Chuyển điều kiện ấy xuống WHERE có thể làm mất người không có phiên phù hợp.',
        'Cách thứ hai dùng SQL tổng hợp theo learner_id, tạo dictionary và duyệt người học. Với L người và K nhóm có dữ liệu, phần Python tốn O(L+K) trung bình và O(K) bộ nhớ phụ, không tính kết quả trả về. Đây không phải độ phức tạp của toàn bộ query SQL.',
        'Hai cách phải cho cùng danh sách đã ORDER BY id. Chi phí SQL phụ thuộc số dòng, index và query plan; không kết luận nhanh hơn từ dữ liệu bốn phiên. Schema nhỏ này tin ngày ISO trong seed, chưa có validation cho mọi dữ liệu ghi từ người dùng.',
      ],
      pitfall: 'GROUP BY name gộp nhầm người trùng tên; INNER JOIN loại người chưa học. Dùng placeholder ? cho giá trị thay vì ghép chuỗi SQL.',
      practice: 'Ẩn lời giải. Thêm số phiên bên cạnh tổng phút. Test người chưa học phải có count=0; giải thích vì sao COUNT(*) sau LEFT JOIN có thể cho 1 và COUNT(s.id) phù hợp hơn.',
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
