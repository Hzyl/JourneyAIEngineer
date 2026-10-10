# Biên tập tiếng Việt

Tài liệu này quy định cách viết phần tiếng Việt của Journey AI Engineer. Mục tiêu là giúp
bạn hiểu cần học gì, làm gì tiếp theo và tự kiểm tra kết quả. Đọc cùng
[chuẩn nội dung](CURRICULUM-STANDARDS.md) và [cách đóng góp bài học](LESSON-CONTRIBUTION.md).

## Giọng viết

Viết như một người hướng dẫn đang giải thích trực tiếp cho người học. Gọi người học là
**bạn**; dùng động từ cụ thể và câu có quan hệ rõ ràng. Giải thích mục đích trước khi đưa
các bước làm. Không hứa thời gian thành thạo, cơ hội việc làm hoặc chứng nhận chuyên môn.

- “Chạy ví dụ và đối chiếu kết quả với…” rõ hơn “tạo bằng chứng có thể ship”.
- “Mở thư mục bài tập bằng VS Code” rõ hơn “mở workspace để practice”.
- “Ghi điều bạn vừa hiểu và câu hỏi còn vướng” cụ thể hơn “lưu insight”.
- “Đọc thêm tài liệu gốc” tự nhiên hơn “đọc từ nguồn gốc”.
- Tránh lời động viên chung chung, câu rời thiếu chủ ngữ và dịch sát trật tự câu tiếng Anh.

Mỗi bước chỉ yêu cầu một việc chính. Tách việc cần làm, kết quả mong đợi và cách tự kiểm tra.
Lỗi cần nói điều gì xảy ra và bạn có thể làm gì tiếp theo; không chỉ ghi “có vấn đề”.

## Thuật ngữ và nhãn

| Ý nghĩa | Cách dùng trong phần tiếng Việt |
| --- | --- |
| journal | nhật ký |
| weekly reflection | tổng kết tuần / nhìn lại tuần học |
| note, saved insight | ghi chú / ghi chú đã lưu |
| context gửi trợ lý | nội dung gửi cho trợ lý; giải thích thông tin được gom khi cần |
| workspace bài tập | thư mục bài tập |
| output | kết quả chạy / đầu ra, tùy ngữ cảnh |
| checkpoint | cách tự kiểm tra / mốc kiểm tra |
| source clone | bản sao mã nguồn |
| portable | bản chạy trực tiếp; có thể ghi Portable lần đầu để đối chiếu gói tải |
| reviewed, verified | giữ giá trị trong dữ liệu; giải thích rõ nội dung hoặc hành vi nào đã được kiểm tra |

Giữ tên Python, Git, VS Code, API, SQL, RAG và tên công cụ. Khi thuật ngữ mới cần cho bài,
giới thiệu tiếng Việt kèm tiếng Anh, chẳng hạn “hàm mất mát trên tập kiểm định (validation loss)”.
Không dịch ID, enum, khóa JSON, đường dẫn, URL, câu lệnh hoặc kết quả máy cần đối chiếu.

Nhãn giao diện được dịch theo ngôn ngữ đang chọn. Giữ nguyên nhánh tiếng Anh và khóa dữ liệu.
Một chuỗi tiếng Việt có thể là khóa tra cứu thông báo máy chủ, như trong `backup-copy.ts`;
không sửa khóa riêng lẻ chỉ để câu tự nhiên hơn. Khi đổi nhãn dùng trong kiểm thử, cập nhật kỳ vọng
tương ứng mà vẫn giữ kiểm tra hành vi.

## Sửa nguồn trước, sinh danh mục sau

- `content/curriculum.json`: lộ trình, giai đoạn, mô-đun và thứ tự bài.
- `content/module_guides.json`: hướng dẫn thực hành của mô-đun.
- `content/lessons/*.md` và phần sinh nội dung tương ứng trong `scripts/build_lesson_catalog.py`:
  nguồn của danh mục nền.
- `content/curated/<lesson_id>.json`: bản biên tập được ưu tiên hiển thị khi trùng ID.
- `content/lessons.json`: kết quả sinh tự động; không sửa trực tiếp để thay thế nguồn.

Xem thêm [bản đồ nguồn nội dung](../content/README.md). Giữ nguyên ID, quan hệ bài cần học trước,
liên kết bài tập/thẻ ôn và cờ chất lượng nếu chưa có lý do kỹ thuật để đổi chúng. Sửa tiếng Việt
không tự nâng bài từ nháp thành đã kiểm tra.

Sau khi sửa nguồn, chạy từ thư mục gốc:

```powershell
python scripts/build_lesson_catalog.py
python scripts/catalog_version.py --write
python scripts/validate_content.py
```

Đọc phần thay đổi được sinh lại và chạy các kiểm thử phù hợp. Đừng xóa cơ sở dữ liệu để làm mới
nội dung. Trước thay đổi cấu trúc hoặc dữ liệu khởi tạo lớn, sao lưu đầy đủ; xuất nhật ký để đọc
không thay thế bản sao lưu tiến độ và lịch ôn.

## Phạm vi rà soát tài liệu và nhãn — 2026-10-10

Đợt rà soát tài liệu kiểm kê 51 tệp Markdown có sẵn: 47 tệp trong `docs/` và
`README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `content/README.md`.
Đã đọc các phần tiếng Việt đang dùng trong 11 tệp:

- Bốn tệp ở gốc/nội dung nêu trên.
- `ARCHITECTURE.md`, `LESSON-CONTRIBUTION.md`, `STARTER-ISSUES.md`,
  `PUBLIC-BETA.md`, `QUICKSTART-WINDOWS.md`, `INTERACTIONS.md`, `THEMES.md`.

40 tệp còn lại chủ yếu là tài liệu tiếng Anh hoặc hồ sơ kiểm chứng/thiết kế cũ:
đã phân loại theo ngôn ngữ và tiêu đề, không tuyên bố biên tập lại từng câu.
Các đoạn báo cáo kiểm thử có ngày trong `INTERACTIONS.md` và `THEMES.md` được giữ nguyên;
ngày, phiên bản và kết quả triển khai cũ không được biến thành xác nhận hiện tại.

Phần nhãn được đọc gồm năm tệp `*-copy.ts` (backup, feedback, journal, review, settings),
`JournalView.tsx`, nhãn điều hướng trong `App.tsx`, `PublicExperience.tsx` và `PublicLesson.tsx`.
Đã sửa sáu tệp có cách diễn đạt cần cải thiện; giữ ba tệp còn lại vì nhãn đã rõ hoặc chuỗi là khóa
tra cứu thông báo. `exercise-copy.ts`, các màn hình khác và nội dung chương trình học được
rà soát ở phần việc riêng, không nằm trong số lượng này.

Đây là phạm vi đọc và sửa nguồn, không phải chứng nhận toàn bộ chương trình học, kiểm chứng
triển khai web, hay kiểm tra trực quan mọi màn hình. Nhãn dài hơn cần được xem trên điện thoại;
kiểm tra kiểu và cú pháp không chứng minh bố cục không tràn. Kết quả tích hợp và những kiểm thử
cần cập nhật được ghi riêng trong báo cáo của đợt làm việc.

## Phạm vi tích hợp nội dung — 2026-10-11

Đợt biên tập còn bao gồm phần tiếng Việt trong 208 bài học nguồn, 10 bản biên tập ưu tiên,
52 hướng dẫn mô-đun, 23 mô tả giai đoạn và 10 dự án thực hành. Danh mục bài tập, tài liệu,
công cụ và hướng học lần lượt có 52, 50, 8 và 3 mục. Các hướng dẫn và bài giải hiển thị trong
ứng dụng được chỉnh để trình bày rõ cách làm, kết quả cần lưu và cách tự kiểm tra.

Nội dung mô tả bài tập bằng tiếng Việt được quản lý tại `content/exercise_editorial_vi.json`.
Khi sửa tệp này, chạy thêm `python scripts/build_exercise_catalog.py` trước khi cập nhật
dấu kiểm danh mục bằng `scripts/catalog_version.py --write`. Không sửa riêng bản sinh tự động.

Bố cục đọc tách các đoạn kiến thức; trong bài giải, phần giải thích xuất hiện trước mã nguồn.
Người học tự mở từng tệp mã khi muốn xem. Hình minh họa có kích thước phù hợp với màn hình,
không thay thế sơ đồ kỹ thuật hoặc bằng chứng rằng kiến trúc đã được kiểm chứng.

Giới hạn của đợt biên tập: danh mục vẫn có **198 bài nháp và 10 bài đã rà soát**.
Có **101 bài còn dùng ví dụ khung `class Result:`**; các ví dụ này cần được thay bằng bài toán
cụ thể trong đợt nâng cấp kiến thức tiếp theo. Sửa lời văn không đồng nghĩa đã kiểm chứng
mọi ví dụ hoặc xác nhận toàn bộ lộ trình đáp ứng yêu cầu tuyển dụng. Một số nội dung xuất dữ liệu
và thông báo dự phòng ở API/hosted client vẫn cần rà soát riêng. Những giới hạn này phải được
giữ rõ khi giới thiệu chất lượng nội dung.
