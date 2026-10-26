# Rà soát cách tổ chức lộ trình — 22/10/2026

## Phạm vi và kết quả

Rà cả 23 phase, 52 module và 208 bài để xử lý các nhóm dễ bị hiểu là học lặp.
Đợt này sửa cách tổ chức và giải thích trên roadmap; không viết lại kiến thức,
đổi ID, cập nhật database hay xuất bản lên web.

| Nhóm | Cách xử lý |
| --- | --- |
| Python/MLOps 01, 05 và phần mềm GenAI 08 | Giữ phần đầy đủ và cầu nối; cầu nối thu gọn khi xem toàn bộ, mở sẵn ở hướng ứng dụng. |
| ML 03 và ML/embedding 09 | Gom cùng chủ đề; phân biệt nền tảng ML đầy đủ với cầu nối ứng dụng. |
| PyTorch 04 và Transformer 10 | Gom cùng chủ đề; vẫn giữ kiến thức attention, kiến trúc và KV cache riêng. |
| Khảo sát 06 | Phân 24 bài về đúng chủ đề dưới mục ôn tập tùy chọn; không còn một chặng RAG bắt buộc đứng riêng ở đầu. |
| RAG 12, 13 | RAG nền tảng, RAG nâng cao tùy chọn và 8 bài khảo sát truy xuất/RAG nằm cạnh nhau. Nâng cao yêu cầu baseline và bộ đánh giá trước. |
| Evaluation/operations 17–19 và agent 14–16 | Đánh giá và vận hành hiển thị trước công cụ/agent/MCP. Phân biệt kiểm tra câu trả lời với quyền thực thi hành động. |
| Fine-tuning, local LLM, system design 20–22 | Nhánh độc lập, không buộc học tuần tự tất cả. |
| Capstone 07 | Hiển thị cuối hướng học; ghi rõ có thể làm đồ án mà không học hết nhánh tùy chọn. |

Giữ các bài kiểm định ML, evaluation LLM, retry của dịch vụ và retry của công cụ:
chúng có đối tượng, ranh giới an toàn và đầu ra khác nhau, không phải bản sao.

`content/roadmap_overview.json` là nguồn nhóm chủ đề dùng chung. Sửa hai nhãn
bắt buộc sai: Python đầy đủ không bắt buộc cho hướng ứng dụng dùng cầu nối;
evaluation GenAI 17–19 không bắt buộc cho hướng deep-ML hiện tại.

Giữ thứ tự core của từng route. Tìm kiếm, lọc trạng thái, lọc phase cũ, URL,
mở bài và quay lại vẫn hoạt động. Bộ lọc có kết quả trong mục thu gọn sẽ mở
mục đó để người học thấy bài. Chữ danh sách bài được nâng lên 1rem.

## Bằng chứng kiểm tra

- `npx vitest run src/test/roadmap-organization.test.ts src/test/roadmap-view.test.tsx src/test/public-roadmap.test.tsx src/test/roadmap-metadata.test.ts src/test/lesson-route.test.ts`: **25 passed**.
- `npm run test:unit`: **338 passed**, 50 files.
- `.venv/Scripts/python.exe scripts/validate_content.py`: **23 phase, 208 bài hợp lệ**.
- `npm run lint`: exit 0; còn hai cảnh báo đã có trong `AuthProvider.tsx`.
- `npm run build`: exit 0; còn cảnh báo chunk lớn.
- `npx playwright test tests/e2e/roadmap-organization.spec.ts tests/e2e/today-roadmap.spec.ts --grep roadmap`: **6 passed**, FastAPI/SQLite dùng thư mục test tạm.
- `npx playwright test --config=playwright.production.config.ts tests/e2e/hosted-public-navigation.spec.ts --grep "guest roadmap" --workers=1`: **2 passed**, cấu hình Supabase giả, không truy cập dữ liệu thật.
- Sau chỉnh cỡ chữ, chạy lại `npx playwright test tests/e2e/roadmap-organization.spec.ts`: **2 passed**, có build Vite mới trước khi chạy.
- Kiểm tra tiếng Việt/Anh, light/dark, 390px và 1440px cho màn hình học; public thêm 320px/820px. Không tràn ngang; bàn phím mở được phần ôn; kiểm tra tương phản đạt.
- Đã xem ảnh chụp màn hình học và public ở điện thoại/máy tính. Ảnh test nằm trong `.build/roadmap-20261022/` và `.build/public-entry-evidence/`, không đưa vào Git.
- Kiểm tra ánh xạ: đủ 208 bài, mỗi bài xuất hiện đúng một lần trong tổng quan, giữ nguyên đối tượng tiến độ. Hash của curriculum, catalog/version và bốn bản thảo analysis trước đó không đổi.
- `git diff --check`: exit 0.

## Giới hạn cần giữ rõ

- Hai test guest chạy qua **Vite dev** đã timeout tại màn hình “Đang tải”, trước khi mở roadmap. Chưa xác định nguyên nhân; không tính chúng là đạt. Cùng luồng trên **build production** đạt ở lượt kiểm tra riêng.
- Không sửa graph `prerequisites`/`next_lessons` sinh từ thứ tự curriculum lịch sử hoặc lịch accelerated 208 bài. Ví dụ prerequisite đầu phase 08 vẫn tham chiếu capstone và phase 17 vẫn tham chiếu MCP. Đây là vấn đề metadata bài học riêng, chưa được giải quyết bằng thay đổi giao diện này. Điều hướng theo route đã có dùng thứ tự route và được regression test; không khẳng định mọi liên kết ngoài route đã được sửa.
- Ảnh roadmap hiện có chỉ dùng minh họa chủ đề; đã ghi rõ theo danh sách/route để xác định thứ tự thực tế.
- Chưa kiểm tra thiết bị iPhone/Android thật, chưa commit/push/deploy và chưa xác minh web production đang chạy bản mới.

Codex thực hiện và tích hợp. Một subagent kế thừa model cha rà soát nội dung
độc lập ở chế độ chỉ đọc; kết quả được đối chiếu bằng nguồn repo và test phía trên.
