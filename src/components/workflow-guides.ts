import type { GuideText } from './exercise-guides'

export const workflowGuides: Record<string, Record<'vi' | 'en', GuideText>> = {
  'exercise-1-developer-tools': {
    vi: {
      summary: 'Gọi API giả lập, lưu JSON, dùng branch và diff để giải thích thay đổi rồi khôi phục bản trước.',
      steps: [
        'Tạo thư mục lab riêng, chỉ dùng dữ liệu giả. Cần Python 3.11+ và Git; chạy các lệnh trên máy bạn. Website chỉ hiển thị nội dung.',
        'Viết server loopback /status trả JSON như ví dụ và client có timeout 3 giây. Kiểm tra HTTP, JSON và hai trường trước khi lưu response.json; response lỗi không được ghi đè file cũ.',
        'Trong thư mục đó chạy git init. Stage file bằng tên, đọc git diff --cached và tạo commit ban đầu. Tạo branch lab/status-v2 bằng git switch -c.',
        'Đổi service thành learning-api-v2, khởi động lại server và gọi client. Cập nhật test kỳ vọng theo yêu cầu mới, xem git diff rồi commit với thông điệp mô tả đổi tên service.',
        'Dùng git show HEAD~1:response.json xem bản cũ. Dùng git worktree add --detach ../workflow-before HEAD~1 lấy bản trước ra thư mục mới. Lưu diff, output test và giải thích; không cần push.',
      ],
      checks: ['response.json chứa đúng JSON từ API; lỗi 404 hoặc JSON sai không được báo thành công.',
        'Diff thể hiện thay đổi service ở server, test và response.',
        'Bản trước ở thư mục workflow-before có service cũ; branch đang làm vẫn có service mới.'],
      hints: ['Dùng hai terminal: một giữ server, một chạy client và Git.',
        'Trong bài giải, test API tự mở cổng trống; thao tác Git do bạn kiểm tra riêng.'],
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
      summary: 'Tính phút học tuần bằng SQL và dictionary, giữ người chưa học và kiểm tra biên ngày.',
      steps: [
        'Tạo learners(id, name) và sessions(id, learner_id, studied_on, minutes). Nêu grain của từng bảng, primary key và foreign key; bật PRAGMA foreign_keys trên connection SQLite.',
        'Thêm An, Binh, Chi. An học 20 phút ngày 2026-10-05, 25 phút ngày 11 và 100 phút ngày 12; Binh học 30 phút ngày 06; Chi chưa có phiên.',
        'Viết weekly_join cho tuần bắt đầu thứ Hai 2026-10-05. Dùng LEFT JOIN, điều kiện ngày trong ON, GROUP BY id/name và COALESCE. Khoảng tuần không bao gồm thứ Hai kế tiếp.',
        'Viết weekly_lookup: SQL tổng hợp theo learner_id rồi tạo dictionary để tra cho từng người. Trả cùng định dạng và thứ tự với cách JOIN.',
        'Test tuần rỗng, người trùng tên, phiên có số phút giống nhau, khóa ngoại sai và tuần qua năm mới. Giải thích chi phí tra dictionary, không suy ra SQL nào nhanh hơn từ ví dụ nhỏ.',
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
