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
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
- Giải thích kết quả và nêu một giới hạn của bài làm.
learning_objectives_en:
- Compare extracted text with the source and record lost structure.
- Trace each chunk to its document version and source position.
- Reject empty or duplicate inputs and explain the parser's limits.
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
- Lưu ví dụ thành ingest.py rồi chạy bằng Python 3.11 trở lên; không cần cài thêm gói.
- Đối chiếu từng đoạn với dòng gốc, rồi thử tài liệu rỗng và trùng ID/phiên bản.
- Đổi tiêu đề hoặc thêm dòng trống; giải thích vì sao số dòng thay đổi nhưng vẫn trỏ đúng nguồn.
- 'Lưu kết quả cùng một giới hạn: ví dụ chỉ đọc văn bản thuần, chưa xử lý PDF, bảng hay OCR.'
study_steps_en:
- Distinguish ingestion from retrieval and answer generation.
- Save the example as ingest.py and run it with Python 3.11 or newer; no packages are required.
- Compare each chunk with its original line, then try empty documents and duplicate ID/version pairs.
- Change a heading or add blank lines; explain why line numbers change while citations still resolve.
- 'Save results and one limitation: this example handles plain text, not PDF, tables or OCR.'
practice_plan:
  vi:
    task: Viết hàm nhập văn bản giữ document_id, version, tiêu đề và số dòng. Dùng hai tài liệu tự tạo, lần
      từ mỗi đoạn về dòng nguồn; ghi lại phần định dạng mà cách tách dòng không giữ được.
    deliverables:
    - Mã nhập dữ liệu và hai tài liệu mẫu
    - Danh sách đoạn kèm nguồn cùng kết quả test rỗng/trùng
    - Ghi chú giới hạn của cách tách dòng
    checkpoint: Mỗi đoạn khớp đúng dòng trong đúng phiên bản tài liệu; đầu vào rỗng/trùng được xử lý rõ.
    stretch: Thử bảng nhiều dòng; chỉ ra thông tin quan hệ giữa các ô mà cách tách đơn giản làm mất.
  en:
    task: Implement plain-text ingestion retaining document_id, version, heading and line number. Use two synthetic
      documents, trace every chunk to its source line and record formatting lost by line splitting.
    deliverables:
    - Ingestion code and two synthetic documents
    - Source-linked chunks and empty/duplicate test results
    - A note on line-splitting limitations
    checkpoint: Every chunk matches a line in the correct document version; empty and duplicate inputs have
      explicit outcomes.
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
  title: Nhập văn bản và giữ vị trí nguồn / Preserve source positions
  status: runnable
  code: "def ingest(documents):\n    chunks, seen = [], set()\n    for document in documents:\n        doc_id,\
    \ version, text = (document[k] for k in ('id', 'version', 'text'))\n        if not all(isinstance(v, str)\
    \ and v.strip() for v in (doc_id, version, text)):\n            raise ValueError('empty document or metadata')\n\
    \        identity = (doc_id, version)\n        if identity in seen:\n            raise ValueError('duplicate\
    \ document version')\n        seen.add(identity)\n        heading = ''\n        for line_no, line in enumerate(text.splitlines(),\
    \ start=1):\n            if line.startswith('#') and line.lstrip('#').startswith(' '):\n              \
    \  heading = line.lstrip('#').strip()\n            elif line.strip():\n                chunks.append({'document_id':\
    \ doc_id, 'version': version,\n                               'line': line_no, 'heading': heading, 'text':\
    \ line,\n                               'source': f'{doc_id}@{version}:L{line_no}'})\n    return chunks\n\
    \n\nif __name__ == '__main__':\n    document = {'id': 'guide', 'version': 'v1',\n                'text':\
    \ '# Quy định\\nHọc 25 phút.\\n\\n# Nguồn\\nGhi ID tài liệu.'}\n    chunks = ingest([document])\n    assert\
    \ [c['line'] for c in chunks] == [2, 5]\n    assert chunks[1]['heading'] == 'Nguồn'\n    for chunk in chunks:\n\
    \        assert document['text'].splitlines()[chunk['line'] - 1] == chunk['text']\n    for invalid in ([dict(document,\
    \ text=' ')], [document, document]):\n        try:\n            ingest(invalid)\n        except ValueError:\n\
    \            pass\n        else:\n            raise AssertionError('invalid corpus accepted')\n    print([chunk['source']\
    \ for chunk in chunks])\n    print('empty and duplicate: rejected')\n"
  setup: Python 3.11+; lưu thành ingest.py và chạy python ingest.py. Standard library only.
  expected_output: '[''guide@v1:L2'', ''guide@v1:L5'']

    empty and duplicate: rejected'
  purpose_vi: Tách dòng nội dung, giữ tiêu đề, ID, phiên bản và vị trí để kiểm tra lại nguồn.
  purpose_en: Extract content lines while retaining heading, ID, version and source position.
  edge_case_vi: Tài liệu rỗng và trùng ID/phiên bản phải bị từ chối. Dòng trống vẫn được tính khi đánh số dòng
    nguồn.
  edge_case_en: Reject empty documents and duplicate ID/version pairs. Blank lines still count in source numbering.
  explanation_vi: Mỗi đoạn giữ nguyên dòng văn bản và đường dẫn nguồn có thể đối chiếu. Đây là bước nhập văn
    bản thuần; chưa có embeddings, LLM, OCR hay xử lý bảng. Với PDF, phải kiểm tra cấu trúc trích xuất bằng
    cách khác.
  explanation_en: Each chunk retains its original text line and a verifiable source locator. This is plain-text
    ingestion, without embeddings, an LLM, OCR or table parsing. PDF extraction needs separate structural checks.
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
  title: Qdrant Concepts
  url: https://qdrant.tech/documentation/concepts/
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: FAISS Getting Started
  url: https://github.com/facebookresearch/faiss/wiki/Getting-started
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
- language: en
  title: Hugging Face NLP Course
  url: https://huggingface.co/learn/nlp-course/chapter1/1
  kind: official
  required: false
  purpose_vi: Tài liệu tham khảo chính thức để kiểm chứng khái niệm trong bài học.
  purpose_en: Official reference to verify the lesson concept.
  read_vi: Đọc phần liên quan, chạy lại ví dụ nhỏ và ghi một điều bạn kiểm chứng được.
  read_en: Read the relevant section, run a small example, and record one verified insight.
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
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
- Lưu kết quả và giải thích được một giới hạn mà không nhìn lời giải.
completion_criteria:
- 'Bài làm đáp ứng nhiệm vụ: Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất.'
- Có kết quả đối chiếu với tiêu chí hoặc dự đoán đã ghi trước.
- Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.
common_mistakes:
- Để lỗi trích xuất tài liệu lan sang truy xuất mà không kiểm tra.
- Kết luận từ một kết quả thuận lợi mà chưa kiểm tra trường hợp khác.
- Chép lời giải nhưng không giải thích được quyết định trong bài làm của mình.
next_lessons:
- phase-12-genai-rag-rag-foundations-2
- phase-12-genai-rag-rag-foundations-3
review_question_vi: Nội dung cốt lõi của “Đọc cấu trúc và nhập tài liệu” là gì?
review_question_en: Define document parsing and ingestion in your own words. What are the input, transformation
  and output?
review_answer_vi: Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng. Kiểm tra đầu
  ra trước khi lập chỉ mục để lỗi đọc tài liệu không lan sang truy xuất.
review_answer_en: A strong answer names the input, transformation, output and the context where document parsing
  and ingestion is used. Relate it specifically to document parsing and ingestion in lesson phase-12-genai-rag-rag-foundations-1.
review_cards:
- id: phase-12-genai-rag-rag-foundations-1-recall
  type: recall
  question_vi: Nội dung cốt lõi của “Đọc cấu trúc và nhập tài liệu” là gì?
  question_en: Define document parsing and ingestion in your own words. What are the input, transformation and output?
  answer_vi: Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng. Kiểm tra đầu ra trước
    khi lập chỉ mục để lỗi đọc tài liệu không lan sang truy xuất.
  answer_en: A strong answer names the input, transformation, output and the context where document parsing and
    ingestion is used.
  hint_vi: Nêu ý chính, sau đó minh họa bằng tình huống cụ thể.
  hint_en: Start with a small example you can calculate by hand.
- id: phase-12-genai-rag-rag-foundations-1-application
  type: application
  question_vi: Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất.
  question_en: Write a small code example or design that applies document parsing and ingestion to an AI engineering
    problem.
  answer_vi: 'Với nhiệm vụ “Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất”, cần lưu: đoạn tài
    liệu, siêu dữ liệu và kết quả của từng bước RAG. Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu.'
  answer_en: The document parsing and ingestion example should have an explicit input, expected output and a way
    to run or verify it (phase-12-genai-rag-rag-foundations-1).
  hint_vi: Bắt đầu từ nhiệm vụ thực hành của bài.
  hint_en: Start from the lesson code example and change one assumption.
- id: phase-12-genai-rag-rag-foundations-1-debug
  type: debug
  question_vi: Khi làm bài “Đọc cấu trúc và nhập tài liệu”, bạn cần tránh lỗi nào và kiểm tra lại ra sao?
  question_en: If document parsing and ingestion produces a wrong result or a metric drops, what would you debug
    first?
  answer_vi: 'Trong bài “Đọc cấu trúc và nhập tài liệu”, lỗi cần tránh là: để lỗi trích xuất tài liệu lan sang truy
    xuất mà không kiểm tra. Lần từ câu trả lời về đúng đoạn nguồn và bản tài liệu. Dùng ví dụ nhỏ để tìm bước đầu
    tiên có kết quả khác dự kiến.'
  answer_en: For document parsing and ingestion, check inputs/shapes, preprocessing and the baseline first; then
    isolate the failure with a small test and error analysis (phase-12-genai-rag-rag-foundations-1).
  hint_vi: Tìm bước đầu tiên xuất hiện khác biệt.
  hint_en: Do not start by changing the model or adding complexity.
- id: phase-12-genai-rag-rag-foundations-1-interview
  type: interview
  question_vi: Bạn dùng kết quả nào từ bài “Đọc cấu trúc và nhập tài liệu” để giải thích cách làm và giới hạn?
  question_en: In an interview, how would you explain a trade-off and one edge case of document parsing and ingestion?
  answer_vi: Bắt đầu từ nhiệm vụ “Đối chiếu văn bản trích xuất với tài liệu gốc và ghi phần bị mất”. Trình bày kết
    quả đã lưu, cách đối chiếu và một điều kiện có thể khiến kết luận thay đổi; không chỉ đọc lại định nghĩa.
  answer_en: The answer about document parsing and ingestion should cover assumptions, metrics/cost, limitations
    and how to reduce production risk (phase-12-genai-rag-rag-foundations-1).
  hint_vi: Dùng quyết định thật trong bài làm, tránh chỉ đọc định nghĩa.
  hint_en: Relate it to latency, quality, cost or observability where relevant.
---
# Đọc cấu trúc và nhập tài liệu / Document parsing and ingestion

Nhập tài liệu cần giữ nội dung, nguồn và cấu trúc hữu ích như tiêu đề hoặc bảng. Kiểm tra đầu ra trước khi lập chỉ mục để lỗi đọc tài liệu không lan sang truy xuất.

Parsing biến định dạng tài liệu thành nội dung có cấu trúc; ingestion là cả luồng tiếp nhận, kiểm tra và đưa nội dung vào hệ thống. OCR nhận chữ từ ảnh, nhưng không tự bảo đảm thứ tự đọc hoặc liên kết giữa ô trong bảng.

Ví dụ, PDF hai cột có thể bị đọc xen dòng, làm câu đúng trở thành đoạn vô nghĩa. Tự kiểm tra: mở được tệp và lấy được văn bản đã đủ lập chỉ mục chưa? Chưa; đối chiếu một số trang có bảng, tiêu đề và ký hiệu, giữ nguồn cùng vị trí để truy ngược khi câu trả lời sai.

## Thực hành

Viết hàm nhập văn bản giữ document_id, version, tiêu đề và số dòng. Dùng hai tài liệu tự tạo, lần từ mỗi đoạn về dòng nguồn; ghi lại phần định dạng mà cách tách dòng không giữ được.
