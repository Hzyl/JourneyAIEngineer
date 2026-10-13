---
lesson_id: phase-12-genai-rag-rag-foundations-1
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Đọc cấu trúc và nhập tài liệu
title_en: Document parsing and ingestion
summary_vi: Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng.
summary_en: Ingest documents while preserving their content, source identity and useful structure such as headings
  or tables.
learning_objectives:
- Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất.
- Lần từ mỗi đoạn về đúng dòng trong đúng phiên bản tài liệu.
- Từ chối đầu vào rỗng, trùng hoặc thiếu trường và giải thích giới hạn parser.
learning_objectives_en:
- Compare extracted text with the source and record lost structure.
- Trace each chunk to its document version and source position.
- Reject empty, duplicate or incomplete inputs and explain the parser's limits.
prerequisites:
- phase-11-llm-application-llm-application-4
- phase-11-llm-application-llm-application-1
key_terms:
- document
- parsing
- ingestion
- token
- embedding
- retrieval
- evaluation
- rag-foundations
concept_notes_vi: |-
  Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng. Kiểm tra đầu ra trước khi lập chỉ mục để lỗi đọc tài liệu không lan sang truy xuất.

  Parsing biến định dạng tài liệu thành nội dung có cấu trúc; ingestion là cả luồng tiếp nhận, kiểm tra và đưa nội dung vào hệ thống. OCR nhận chữ từ ảnh, nhưng không tự bảo đảm thứ tự đọc hoặc liên kết giữa ô trong bảng.

  Ví dụ, PDF hai cột có thể bị đọc xen dòng, làm câu đúng trở thành đoạn vô nghĩa. Tự kiểm tra: mở được tệp và lấy được văn bản đã đủ lập chỉ mục chưa? Chưa; đối chiếu một số trang có bảng, tiêu đề và ký hiệu, giữ nguồn cùng vị trí để truy ngược khi câu trả lời sai.
concept_notes_en: |-
  Document ingestion should retain useful content, provenance and structure such as headings and tables. Check extracted output before indexing.

  Parsing converts a file format into structured content; ingestion covers receiving, validating and incorporating it. OCR recognizes text from images but does not guarantee reading order or table relationships.

  A two-column PDF may produce interleaved lines that destroy meaning. Self-check: is successfully extracting text enough to index it? No: compare pages containing tables, headings and symbols, and retain source locations so answer failures can be traced back.
why_it_matters_vi: Tách truy xuất khỏi sinh câu trả lời để truy nguồn và xử lý thiếu bằng chứng.
why_it_matters_en: RAG separates retrieval from generation so answers can be sourced and can abstain without evidence.
study_steps_vi:
- Đọc phần kiến thức và phân biệt nhập tài liệu với truy xuất và sinh câu trả lời.
- Lưu ví dụ đầu thành ingest_documents.py rồi chạy bằng Python 3.11 trở lên; không cần cài thêm gói.
- Đối chiếu từng đoạn với dòng gốc, rồi thử tài liệu rỗng và trùng ID/phiên bản.
- Đổi tiêu đề hoặc thêm dòng trống; giải thích vì sao số dòng thay đổi nhưng vẫn trỏ đúng nguồn.
- Lưu ví dụ thứ hai thành check_ingestion.py cạnh tệp đầu; chạy python check_ingestion.py và nêu giới hạn về PDF, bảng, OCR.
study_steps_en:
- Distinguish ingestion from retrieval and answer generation.
- Save the first example as ingest_documents.py and run it with Python 3.11 or newer; no packages are required.
- Compare each chunk with its original line, then try empty documents and duplicate ID/version pairs.
- Change a heading or add blank lines; explain why line numbers change while citations still resolve.
- Save the second example as check_ingestion.py beside the first; run python check_ingestion.py and state the PDF, table and OCR limitations.
practice_plan:
  vi:
    task: Viết hàm nhập văn bản giữ document_id, version, tiêu đề và số dòng. Dùng hai tài liệu tự tạo, lần
      từ mỗi đoạn về dòng nguồn; ghi lại phần định dạng mà cách tách dòng không giữ được.
    deliverables:
    - Mã nhập dữ liệu và hai tài liệu mẫu
    - Danh sách đoạn kèm nguồn cùng kết quả test rỗng/trùng
    - Ghi chú giới hạn của cách tách dòng
    checkpoint: check_ingestion(ingest) đạt; hàm trả list rỗng hoặc sai số dòng phải không đạt. Mỗi đoạn khớp đúng dòng và phiên bản; đầu vào rỗng/trùng/thiếu trường bị từ chối.
    stretch: Thử bảng nhiều dòng; chỉ ra thông tin quan hệ giữa các ô mà cách tách đơn giản làm mất.
  en:
    task: Implement plain-text ingestion retaining document_id, version, heading and line number. Use two synthetic
      documents, trace every chunk to its source line and record formatting lost by line splitting.
    deliverables:
    - Ingestion code and two synthetic documents
    - Source-linked chunks and empty/duplicate test results
    - A note on line-splitting limitations
    checkpoint: check_ingestion(ingest) passes; empty-output and wrong-line implementations fail. Every chunk matches its source version and line; empty, duplicate and incomplete inputs are rejected.
    stretch: Try a multiline table and identify cell relationships that simple splitting loses.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Đọc cấu trúc và nhập tài liệu” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain document parsing and ingestion to a new teammate?
  - Which assumption behind document parsing and ingestion could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: Giữ vị trí nguồn khi nhập / Preserve source locations during ingestion
  status: runnable
  code: |
    def ingest(documents):
        if not isinstance(documents, list) or not documents:
            raise ValueError('documents must be a nonempty list')
        chunks, seen = [], set()
        for document in documents:
            if not isinstance(document, dict):
                raise ValueError('document must be a mapping')
            values = [document.get(key) for key in ('id', 'version', 'text')]
            if not all(isinstance(value, str) and value.strip() for value in values):
                raise ValueError('id, version and text must be nonblank strings')
            doc_id, version, text = values
            identity = (doc_id, version)
            if identity in seen:
                raise ValueError('duplicate document version')
            seen.add(identity)
            heading, start = '', len(chunks)
            for line_no, line in enumerate(text.splitlines(), start=1):
                if line.startswith('#') and line.lstrip('#').startswith(' '):
                    heading = line.lstrip('#').strip()
                elif line.strip():
                    chunks.append({'document_id': doc_id, 'version': version,
                                   'line': line_no, 'heading': heading, 'text': line,
                                   'source': f'{doc_id}@{version}:L{line_no}'})
            if len(chunks) == start:
                raise ValueError('document has no body text')
        return chunks


    if __name__ == '__main__':
        document = {'id': 'guide', 'version': 'v1',
                    'text': '# Quy định\nHọc 25 phút.\n\n# Nguồn\nGhi ID tài liệu.'}
        chunks = ingest([document])
        assert [c['line'] for c in chunks] == [2, 5]
        assert chunks[1]['heading'] == 'Nguồn'
        for chunk in chunks:
            assert document['text'].splitlines()[chunk['line'] - 1] == chunk['text']
        for invalid in ([], [dict(document, text=' ')], [document, document],
                        [{'id': 'guide'}], [dict(document, text='# Heading')]):
            try:
                ingest(invalid)
            except ValueError:
                pass
            else:
                raise AssertionError('invalid corpus accepted')
        print([chunk['source'] for chunk in chunks])
        print('empty, duplicate, missing fields and headings-only: rejected')
  setup: "Python 3.11+; save as ingest_documents.py and run python ingest_documents.py."
  expected_output: |
    ['guide@v1:L2', 'guide@v1:L5']
    empty, duplicate, missing fields and headings-only: rejected
  purpose_vi: Giữ phiên bản, tiêu đề và dòng nguồn; từ chối đầu vào không hợp lệ.
  purpose_en: Preserve version, heading and source line; reject invalid inputs.
  edge_case_vi: Dòng trống vẫn tính số dòng; tài liệu chỉ có tiêu đề bị từ chối.
  edge_case_en: Blank lines retain their positions; headings-only documents are rejected.
  explanation_vi: "Lưu thành ingest_documents.py, chạy python ingest_documents.py. Hai nguồn đúng là guide@v1:L2 và guide@v1:L5; dòng cuối báo empty, duplicate, missing fields and headings-only: rejected. Chỉ tách văn bản thuần; không chạy PDF, OCR, Docling hay embedding."
  explanation_en: "Save as ingest_documents.py and run python ingest_documents.py. The sources are guide@v1:L2 and guide@v1:L5; the final line is empty, duplicate, missing fields and headings-only: rejected. This parses plain text only; no PDF, OCR, Docling or embeddings run."
- language: python
  title: Kiểm tra bài làm / Check your ingestion implementation
  status: runnable
  code: |
    from ingest_documents import ingest


    def check_ingestion(candidate):
        docs = [
            {'id': 'policy', 'version': 'v1', 'text': '# Policy\nRefund in 7 days.\n\n# Exception\nOpened goods excluded.'},
            {'id': 'policy', 'version': 'v2', 'text': '# Policy\nRefund in 14 days.'},
        ]
        chunks = candidate(docs)
        assert len(chunks) == 3
        assert [(c['version'], c['line'], c['heading']) for c in chunks] == [
            ('v1', 2, 'Policy'), ('v1', 5, 'Exception'), ('v2', 2, 'Policy')]
        for chunk in chunks:
            source = next(d for d in docs if (d['id'], d['version']) ==
                          (chunk['document_id'], chunk['version']))
            assert chunk['text'] == source['text'].splitlines()[chunk['line'] - 1]
            assert chunk['source'] == f"policy@{chunk['version']}:L{chunk['line']}"
        for bad in ([], [docs[0], docs[0]], [{'id': 'policy'}],
                    [dict(docs[0], text='# Heading')]):
            try:
                candidate(bad)
            except ValueError:
                continue
            raise AssertionError('invalid input was accepted')
        return True


    if __name__ == '__main__':
        assert check_ingestion(ingest)
        print('ingestion acceptance: passed')
  setup: "Save as check_ingestion.py beside ingest_documents.py; run python check_ingestion.py."
  expected_output: "ingestion acceptance: passed"
  purpose_vi: Đối chiếu từng đoạn với đúng phiên bản và dòng gốc, thay vì chỉ đếm đoạn.
  purpose_en: Compare each chunk with the correct source version and line instead of counting alone.
  edge_case_vi: Trả list rỗng hoặc đánh lại số dòng sau khi bỏ dòng trống phải không đạt.
  edge_case_en: Returning an empty list or renumbering after removing blank lines must fail.
  explanation_vi: "Local: lưu check_ingestion.py cạnh ingest_documents.py, chạy python check_ingestion.py. Colab: đặt %%writefile ingest_documents.py ở dòng đầu ô chứa ví dụ 1 rồi chạy; đặt %%writefile check_ingestion.py ở dòng đầu ô chứa ví dụ 2 rồi chạy; ô mới chạy !python check_ingestion.py. Ô code thường không tự tạo tệp để import. Stdout đúng: ingestion acceptance: passed. Giữ nguyên checker khi sửa ingest; không suy chất lượng OCR hay câu trả lời RAG."
  explanation_en: "Local: save check_ingestion.py beside ingest_documents.py and run python check_ingestion.py. Colab: put %%writefile ingest_documents.py first in the example 1 cell and run it; put %%writefile check_ingestion.py first in the example 2 cell and run it; run !python check_ingestion.py in a new cell. Ordinary cells do not create importable files. Expected stdout: ingestion acceptance: passed. Keep the checker unchanged; this does not establish OCR or RAG answer quality."
resources:
- title: Lab A · Colab
  url: https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb
  language: vi
  kind: practice
  required: false
  purpose_vi: Chạy bộ nhập và truy xuất 12 tài liệu giả trên Colab; không cần cài model trên máy cá nhân.
  purpose_en: Run ingestion and retrieval over 12 synthetic documents on Colab without installing a model on your computer.
  read_vi: Chạy baseline trước, kiểm tra phiên bản và dòng nguồn; sau đó mới thử embedding và lưu báo cáo.
  read_en: Run the baseline first, inspect document versions and source lines, then try embeddings and save the report.
- language: en
  title: Docling · Chunking
  url: https://docling-project.github.io/docling/concepts/chunking/
  kind: official
  required: false
  purpose_vi: Đọc sâu về chia đoạn theo cấu trúc và metadata sau khi hiểu truy nguồn văn bản.
  purpose_en: Study structure-aware chunking and metadata after understanding text provenance.
  read_vi: Đọc Introduction, Base/Hybrid/Hierarchical Chunker và phần header bảng. So với tách dòng trong bài; Hybrid Chunker xét cấu trúc và giới hạn token. Chưa chạy Docling, PDF hoặc OCR trong ví dụ này.
  read_en: Read Introduction, Base/Hybrid/Hierarchical Chunker and table headers. Compare with line splitting; Hybrid Chunker considers structure and token limits. This example does not execute Docling, PDF parsing or OCR.
- title: Giải thích và hướng dẫn thực hành trong bài
  url: ''
  language: vi
  kind: in_app
  purpose_vi: Đọc giải thích, thực hiện nhiệm vụ và đối chiếu tiêu chí hoàn thành.
  purpose_en: The explanation, code example, checklist, and completion criteria inside the app.
  read_vi: Đọc giải thích → xem ví dụ → thực hành → tự kiểm tra.
  read_en: Follow Study plan → Concept notes → Code example → Practice plan.
  required: true
exercise_ids:
- exercise-12-rag-foundations
review_item_ids:
- phase-12-genai-rag-rag-foundations-1-recall
- phase-12-genai-rag-rag-foundations-1-application
- phase-12-genai-rag-rag-foundations-1-debug
- phase-12-genai-rag-rag-foundations-1-interview
estimated_minutes: 60
completion_checklist:
- Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất.
- Lần từ mỗi chunk về đúng dòng nguồn và phiên bản tài liệu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần từ mỗi chunk về đúng dòng nguồn và phiên bản tài liệu.
common_mistakes:
- Để lỗi trích xuất tài liệu lan sang truy xuất mà không kiểm tra.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-12-genai-rag-rag-foundations-2
- phase-12-genai-rag-rag-foundations-3
review_question_vi: Những trường nào giúp lần từ một đoạn về đúng nguồn?
review_question_en: Which fields trace a chunk to its exact source?
review_answer_vi: document_id và version chọn đúng bản; line là số dòng gốc tính từ 1, text giữ nguyên nội dung, heading giữ tiêu đề gần nhất và source ghép ID/phiên bản/dòng. Đối chiếu text với dòng nguồn trước khi lập chỉ mục.
review_answer_en: document_id and version identify the source revision; line is the original one-based line number, text preserves content, heading retains the nearest heading and source combines ID/version/line. Compare text against that source line before indexing.
review_cards:
- id: phase-12-genai-rag-rag-foundations-1-recall
  type: recall
  question_vi: Parsing và ingestion khác nhau thế nào trong ví dụ?
  question_en: How do parsing and ingestion differ in the example?
  answer_vi: Parsing tách tiêu đề và dòng nội dung; ingestion còn kiểm tra danh sách đầu vào, trường bắt buộc, cặp ID/phiên bản trùng và lưu nguồn. Chạy được không đồng nghĩa văn bản đã đúng.
  answer_en: Parsing separates headings and body lines; ingestion also validates the input list, required fields and duplicate ID/version pairs while preserving provenance. Successful execution does not establish extraction correctness.
  hint_vi: Theo dõi bước kiểm tra trước vòng tách dòng.
  hint_en: Follow validation before line splitting.
- id: phase-12-genai-rag-rag-foundations-1-application
  type: application
  question_vi: Vì sao hai đoạn ví dụ có nguồn L2 và L5 thay vì L1 và L2?
  question_en: Why are the example sources L2 and L5 rather than L1 and L2?
  answer_vi: Số dòng đếm trong văn bản gốc, gồm dòng tiêu đề và dòng trống. Bỏ chúng khỏi danh sách đoạn không được đánh lại số dòng; source phải trỏ đúng guide@v1.
  answer_en: Line numbers count original headings and blank lines. Omitting those from the chunk list must not renumber the source; source must identify guide@v1 correctly.
  hint_vi: Dùng splitlines rồi kiểm tra vị trí line - 1.
  hint_en: Use splitlines and inspect position line - 1.
- id: phase-12-genai-rag-rag-foundations-1-debug
  type: debug
  question_vi: Tài liệu chỉ có tiêu đề hoặc lặp cùng ID/phiên bản phải được xử lý thế nào?
  question_en: How should headings-only documents and duplicate ID/version pairs be handled?
  answer_vi: Cả hai bị từ chối bằng ValueError. Tiêu đề không phải đoạn nội dung; cặp ID/phiên bản trùng không được nhập hai lần. Hai phiên bản khác nhau của cùng ID vẫn được giữ riêng.
  answer_en: Both raise ValueError. Headings are not body chunks and duplicate ID/version pairs must not be ingested twice. Different versions of the same ID remain separate.
  hint_vi: So identity với seen và số đoạn trước/sau từng tài liệu.
  hint_en: Compare identity with seen and count chunks before and after each document.
- id: phase-12-genai-rag-rag-foundations-1-interview
  type: interview
  question_vi: Kiểm tra truy nguồn đúng chứng minh gì và chưa chứng minh gì?
  question_en: What do correct provenance checks establish, and what do they not?
  answer_vi: Chúng xác nhận đoạn khớp dòng trong đúng phiên bản, không chứng minh nghĩa câu trả lời được nguồn hỗ trợ. Tách dòng không xử lý PDF, thứ tự đọc OCR hay quan hệ ô bảng; phải đánh giá riêng trước retrieval.
  answer_en: They establish that a chunk matches a line in the correct revision, not that a source semantically supports an answer. Line splitting does not handle PDF, OCR reading order or table relationships; evaluate those separately before retrieval.
  hint_vi: Phân biệt vị trí trích dẫn với chất lượng trích xuất và ý nghĩa.
  hint_en: Separate citation location from extraction quality and semantic support.
---
# Đọc cấu trúc và nhập tài liệu / Document parsing and ingestion

Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng. Kiểm tra đầu ra trước khi lập chỉ mục để lỗi đọc tài liệu không lan sang truy xuất.

Parsing biến định dạng tài liệu thành nội dung có cấu trúc; ingestion là cả luồng tiếp nhận, kiểm tra và đưa nội dung vào hệ thống. OCR nhận chữ từ ảnh, nhưng không tự bảo đảm thứ tự đọc hoặc liên kết giữa ô trong bảng.

Ví dụ, PDF hai cột có thể bị đọc xen dòng, làm câu đúng trở thành đoạn vô nghĩa. Tự kiểm tra: mở được tệp và lấy được văn bản đã đủ lập chỉ mục chưa? Chưa; đối chiếu một số trang có bảng, tiêu đề và ký hiệu, giữ nguồn cùng vị trí để truy ngược khi câu trả lời sai.

## Thực hành

Viết hàm nhập văn bản giữ document_id, version, tiêu đề và số dòng. Dùng hai tài liệu tự tạo, lần từ mỗi đoạn về dòng nguồn; ghi lại phần định dạng mà cách tách dòng không giữ được.
