import type { GuideText } from './exercise-guides'

export const workflowGuides: Record<string, Record<'vi' | 'en', GuideText>> = {
  'exercise-1-developer-tools': {
    vi: {
      summary: 'Gọi API giả lập, lưu JSON và dùng nhánh Git để quản lý thay đổi. Đọc phần thay đổi rồi khôi phục bản trước để so sánh.',
      steps: [
        'Tạo thư mục riêng cho bài tập và chỉ dùng dữ liệu giả. Cần Python 3.11+ và Git; chạy các lệnh trên máy của bạn. Website chỉ hiển thị nội dung.',
        'Viết máy chủ chỉ lắng nghe trên địa chỉ nội bộ, có /status trả JSON như ví dụ. Phía gọi API dùng thời gian chờ 3 giây. Kiểm tra HTTP, JSON và hai trường trước khi lưu response.json; phản hồi lỗi không được ghi đè tệp cũ.',
        'Trong thư mục đó, chạy git init. Chọn tệp theo tên để đưa vào vùng chờ commit, đọc git diff --cached rồi tạo commit đầu tiên. Tạo nhánh lab/status-v2 bằng git switch -c.',
        'Đổi service thành learning-api-v2, khởi động lại máy chủ rồi gọi API. Cập nhật giá trị kỳ vọng trong kiểm thử theo yêu cầu mới, xem git diff rồi tạo commit với thông điệp mô tả việc đổi service.',
        'Dùng git show HEAD~1:response.json để xem bản cũ. Chạy git worktree add --detach ../workflow-before HEAD~1 để lấy bản trước vào thư mục mới. Lưu phần thay đổi, kết quả kiểm thử và lời giải thích; không cần đẩy lên kho từ xa.',
      ],
      checks: ['response.json chứa đúng JSON từ API; lỗi 404 hoặc JSON sai không được báo thành công.',
        'Phần thay đổi thể hiện service đã đổi ở máy chủ, kiểm thử và phản hồi.',
        'Bản trước trong thư mục workflow-before có service cũ; nhánh đang làm vẫn có service mới.'],
      hints: ['Dùng hai cửa sổ dòng lệnh: một chạy máy chủ, một gọi API và thao tác Git.',
        'Trong bài giải, kiểm thử API tự chọn cổng trống; bạn cần kiểm tra riêng các thao tác Git.'],
      example: '# GET http://127.0.0.1:8765/status\n{"service": "learning-api", "status": "ok"}',
    },
    en: {
      summary: 'Fetch mock API JSON, explain a change using a branch and diff, then recover the earlier version.',
      steps: [
        'Create a dedicated practice folder with fake data only. Requires Python 3.11+ and Git; commands run on your computer. The website displays the material.',
        'Write a loopback /status server returning the example JSON and a client with a three-second timeout. Validate HTTP, JSON and both fields before saving response.json; invalid responses must preserve the old file.',
        'Run git init in that folder. Stage files by name, inspect git diff --cached and create an initial commit. Create lab/status-v2 with git switch -c.',
        'Change the service to learning-api-v2, restart the server and call the client. Update test expectations for the new requirement, inspect git diff and commit a message describing the service-name change.',
        'Read the previous response using git show HEAD~1:response.json. Restore the earlier revision into a new folder with git worktree add --detach ../workflow-before HEAD~1. Keep the diff, test output and explanation; no push is needed.',
      ],
      checks: ['response.json contains the API JSON; a 404 or invalid JSON never reports success.',
        'The diff shows the service change in the server, test and response.',
        'workflow-before contains the old service while your working branch keeps the new one.'],
      hints: ['Use two terminals: one keeps the server running, the other runs the client and Git.',
        'Solution tests use a free port for the API; verify the Git steps separately.'],
      example: '# GET http://127.0.0.1:8765/status\n{"service": "learning-api", "status": "ok"}',
    },
  },
  'exercise-1-sql-structures': {
    vi: {
      summary: 'Tính phút học tuần bằng SQL và từ điển Python; giữ cả người chưa học và kiểm tra các ngày ở ranh giới tuần.',
      steps: [
        'Tạo learners(id, name) và sessions(id, learner_id, studied_on, minutes). Nêu mỗi dòng của từng bảng đại diện cho gì, cùng khóa chính và khóa ngoại. Bật PRAGMA foreign_keys trên kết nối SQLite.',
        'Thêm An, Binh, Chi. An học 20 phút ngày 2026-10-05, 25 phút ngày 11 và 100 phút ngày 12; Binh học 30 phút ngày 06; Chi chưa có phiên.',
        'Viết weekly_join cho tuần bắt đầu thứ Hai 2026-10-05. Dùng LEFT JOIN, đặt điều kiện ngày trong ON, nhóm theo id/name bằng GROUP BY và dùng COALESCE. Khoảng tuần không bao gồm thứ Hai kế tiếp.',
        'Viết weekly_lookup: dùng SQL tổng hợp theo learner_id, sau đó tạo dictionary để tra số phút của từng người. Trả cùng định dạng và thứ tự với cách JOIN.',
        'Kiểm thử tuần rỗng, người trùng tên, phiên cùng số phút, khóa ngoại sai và tuần qua năm mới. Giải thích chi phí tra dictionary; không kết luận câu SQL nào nhanh hơn từ ví dụ nhỏ.',
      ],
      checks: ['Tuần 05/10: An=45, Binh=30, Chi=0; tuần 12/10: An=100, hai người còn lại=0.',
        'Hai cách trả cùng kết quả; người trùng tên không bị gộp.',
        'Nêu được vì sao điều kiện ngày đặt trong ON và vì sao không dùng SUM(DISTINCT minutes).'],
      hints: ['COALESCE(SUM(s.minutes), 0) giữ tổng 0 cho người chưa học.',
        'Ngày ISO và khoảng [Monday, next Monday) tránh đếm trùng biên tuần.'],
      example: 'weekly_join(db, "2026-10-05")\n# [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)]',
    },
    en: {
      summary: 'Aggregate weekly study minutes with SQL and a dictionary, preserving inactive learners and date boundaries.',
      steps: [
        'Create learners(id, name) and sessions(id, learner_id, studied_on, minutes). State each table’s grain, primary key and foreign key; enable PRAGMA foreign_keys on the SQLite connection.',
        'Add An, Binh and Chi. An studies 20 minutes on 2026-10-05, 25 on October 11 and 100 on October 12; Binh studies 30 on October 6; Chi has no sessions.',
        'Write weekly_join for the Monday starting 2026-10-05. Use LEFT JOIN, date predicates in ON, GROUP BY id/name and COALESCE. Exclude the next Monday.',
        'Write weekly_lookup: aggregate SQL rows by learner_id and build a dictionary to look up each learner. Return the same shape and order as the JOIN.',
        'Test empty weeks, duplicate names, equal-duration sessions, invalid foreign keys and year boundaries. Explain dictionary lookup costs without assuming which SQL approach is faster from tiny data.',
      ],
      checks: ['October 5 week: An=45, Binh=30, Chi=0; October 12 week: An=100 and the others=0.',
        'Both approaches agree; learners with the same name remain separate.',
        'Explain why date predicates belong in ON and why SUM(DISTINCT minutes) is incorrect.'],
      hints: ['COALESCE(SUM(s.minutes), 0) returns zero for inactive learners.',
        'ISO dates and [Monday, next Monday) avoid counting week boundaries twice.'],
      example: 'weekly_join(db, "2026-10-05")\n# [(1, "An", 45), (2, "Binh", 30), (3, "Chi", 0)]',
    },
  },
}
