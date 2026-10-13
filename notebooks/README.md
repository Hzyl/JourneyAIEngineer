# Thực hành với Google Colab

Mở notebook từ nút **Mở Google Colab — Lab …** trong bài học trên Journey. Nếu mở
tệp trong GitHub, dùng một trong các liên kết sau:

| Notebook | Bạn sẽ làm gì? |
| --- | --- |
| [Lab A](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb) | So sánh tìm kiếm từ khóa với embedding và truy lại bằng chứng |
| [Lab B](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-b-workflow-agent.ipynb) | Theo dõi workflow, agent theo kịch bản, giới hạn công cụ và checkpoint |
| [Lab C](https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-c-security-regression.ipynb) | Kiểm tra quyền đọc, fixture injection và kết quả hồi quy |

1. Đăng nhập Google và chọn runtime **hosted** dùng CPU. Không chọn local runtime.
2. Chạy ô thiết lập, rồi chạy từng ô theo thứ tự. Thư viện/model của Lab A
   được tải vào máy ảo Google; Labs B/C không cần model.
3. Đọc kết quả tóm tắt. Để xem một ca cụ thể, mở dict `report` hoặc tệp JSON
   xuất ở cuối notebook. Giữ cả những ca sai.
4. Tải báo cáo trước khi ngắt runtime. Ghi lại điều vừa hiểu và tự cập nhật
   tiến độ trong Journey; notebook chưa đồng bộ kết quả vào tài khoản.

Lab A mặc định chỉ chạy **dev**. Sau khi chốt cách làm, bật
`RUN_FINAL_TEST = True` trong ô cuối. Không tiếp tục chỉnh theo test đã xem
rồi gọi kết quả đó là đánh giá độc lập. Cả corpus lẫn câu hỏi đều là dữ liệu
giả công khai, nhằm minh họa cách làm.

Mỗi lần thiết lập, notebook đổi `main` thành một commit cụ thể rồi tải toàn
bộ module từ commit đó. Báo cáo lưu SHA này. Muốn lặp lại cùng mã, thay
`REVISION = "main"` bằng SHA đã lưu. Notebook dùng lại module trong
`samples/vi-document-assistant/research_lab`; có thể xem và sửa bản tải về
trong danh sách Files của Colab. Sau khi sửa tệp Python đã import, dùng
`importlib.reload` để nạp lại module phụ thuộc trước, rồi tới module lab.
Việc chạy lại ô thiết lập sẽ tải lại bản gốc và bỏ các thay đổi vừa thử.
Muốn thử nhanh số kết quả truy xuất, đổi `lab_a.TOP_K` rồi chạy lại ô baseline;
chỉ dùng dev để chọn cấu hình và ghi lại lý do chọn.

Không cần API key, mount Google Drive hay kết nối Supabase.
[Colab có hạn mức miễn phí thay đổi theo tài nguyên](https://research.google.com/colaboratory/faq.html).
Nếu GitHub báo lỗi tải module, kiểm tra commit và thử lại sau; không chuyển
sang tải model về máy cá nhân để khắc phục.

## English

Open a lab from the lesson, connect to a Google-hosted CPU runtime, and run
cells in order. Only Lab A has optional real-model installation/download
cells. B/C use scripted fixtures without an LLM. No API key, Google Drive
mount or Supabase connection is needed.

Inspect the summary and export the full JSON report. Update Journey progress
yourself. Lab A defaults to dev; opt in to the separate final-test cell only
after freezing your approach. Public synthetic tests are not an independent
benchmark after inspection.

The setup resolves GitHub main once and downloads modules at that commit.
The report records this revision; set REVISION to it for repeat runs. Edit
downloaded modules in Colab and use `importlib.reload` on dependencies first,
then the lab module. Re-running setup restores repository files and discards
those experiments. For a quick retrieval experiment, change `lab_a.TOP_K`
and rerun the baseline cell; choose configurations on dev only and document
your choice. Free Colab resources are limited, so save the report before
ending the session.

## Maintainers

Generate one notebook at a time with `python scripts/build_research_notebooks.py a`
(or `b` / `c`). The generator compiles each code cell and leaves outputs empty.
The lightweight tests execute setup/baseline/export using local HTTP fixtures;
they do not install ML packages or establish that a model ran on Google Colab.
Publish the notebooks and their module files together before sharing the links.
