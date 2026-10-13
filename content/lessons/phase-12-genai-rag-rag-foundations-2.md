---
lesson_id: phase-12-genai-rag-rag-foundations-2
phase_id: phase-12-genai-rag
module_id: rag-foundations
title_vi: Chia đoạn, siêu dữ liệu và ngữ cảnh
title_en: Chunking, metadata, and context
summary_vi: So tách dòng với nhóm theo tiêu đề, giữ dòng nguồn và kiểm tra ngoại lệ cùng ngân sách ngữ cảnh.
summary_en: Compare line and heading-section chunks, preserve source spans and check exceptions against a context budget.
learning_objectives:
- So hai cách chia đoạn trên một tài liệu giả và chỉ ra ngoại lệ bị mất ở top-1.
- Lần từ mỗi đoạn về đúng ID, phiên bản và khoảng dòng gốc.
- Ghép ngữ cảnh trong ngân sách ký tự, tính cả nhãn nguồn và bỏ nguyên đoạn quá dài.
learning_objectives_en:
- Compare two chunking strategies on one synthetic document and identify a top-1 result that loses an exception.
- Trace each chunk to its document ID, version and original line span.
- Assemble context within a character budget including source labels, skipping oversized chunks whole.
prerequisites:
- phase-12-genai-rag-rag-foundations-1
- phase-11-llm-application-llm-application-1
key_terms:
- chunking
- metadata
- context
- token
- embedding
- retrieval
- evaluation
- rag-foundations
concept_notes_vi: |-
  Đoạn tài liệu cần đủ ý để dùng làm bằng chứng; siêu dữ liệu giữ liên hệ tới nguồn và phạm vi truy cập. Kích thước đoạn phải cân bằng với ngân sách ngữ cảnh.

  Chunk là đơn vị nội dung được truy xuất; cửa sổ ngữ cảnh là giới hạn dữ liệu của một lần mô hình xử lý. Hai kích thước này không đồng nhất: nhiều chunk cùng chỉ dẫn và câu hỏi phải chia sẻ một ngân sách.

  Ví dụ, tách điều kiện hoàn tiền khỏi ngoại lệ của nó có thể tạo câu trả lời thiếu chính xác dù truy xuất đúng từ khóa. Tự kiểm tra: tăng phần chồng lặp giữa đoạn có luôn tốt không? Không; nó có thể giữ mạch ý nhưng cũng tạo bản sao và tốn ngữ cảnh. Đo khả năng tìm đủ bằng chứng cùng mức trùng lặp.

  Trong ví dụ, line tạo một đoạn cho mỗi dòng nội dung; section giữ cả mục bắt đầu bằng "# " đến trước tiêu đề tiếp theo. Khoảng dòng tính từ 1 trong nguồn gốc, kể cả tiêu đề và dòng trống. text giữ nguyên từng dòng, nối bằng xuống dòng; không chuẩn hóa khoảng trắng. chunk_id chỉ duy nhất trong cùng tài liệu/phiên bản/cách chia; luôn dùng kèm document_id và version.

  Top-1 ở đây là đoạn đầu tiên chứa từ refund theo thứ tự nguồn. Dòng điều kiện được chọn nhưng ngoại lệ ở dòng kế tiếp bị mất; nhóm theo mục giữ cả hai trong fixture này. Nếu ngoại lệ nằm ở mục khác hoặc tiêu đề sai, cách nhóm này vẫn có thể thiếu bằng chứng. Đây không phải semantic retrieval, benchmark hay chứng minh chất lượng mô hình.

  assemble_context dùng len trên chuỗi Python, tính nhãn nguồn, xuống dòng và dấu phân cách. Ngân sách là ký tự cho phần nguồn, không phải token và chưa gồm chỉ dẫn/câu hỏi. Đoạn quá dài bị bỏ nguyên, nguồn bị bỏ được báo; hàm vẫn xét các đoạn tiếp theo. packed chỉ có nghĩa mọi đoạn được cấp đã vừa, không bảo đảm bằng chứng đủ nghĩa. Chỉ cần thiếu một đoạn được cấp, ví dụ báo insufficient evidence theo quy tắc bảo thủ.
concept_notes_en: |-
  Chunks need enough meaning to serve as evidence. Metadata preserves source and access scope, while chunk size must fit the context budget.

  A chunk is a retrieval unit; a context window limits one model input. They are not interchangeable sizes: multiple chunks, instructions and the question share a budget.

  Separating refund conditions from their exceptions can yield an incorrect answer despite keyword matches. Self-check: is more chunk overlap always better? No: it can preserve continuity but also duplicate content and consume context. Measure evidence coverage and redundancy together.

  Here line makes one chunk per body line; section keeps each section from a "# " heading to just before the next heading. Source spans are one-based and count original headings and blank lines. text preserves each line joined with newlines, without stripping whitespace. chunk_id is unique only within a document/version/strategy; always pair it with document_id and version.

  Top-1 means the first chunk containing refund in source order. The condition line is selected but loses the adjacent exception; heading sections keep both in this fixture. An exception under another heading or an incorrect heading can still defeat this grouping. This is not semantic retrieval, a benchmark or evidence of model quality.

  assemble_context uses Python string len, counting labels, newlines and separators. This is a character budget for source context, not tokens, and excludes instructions/question. Oversized chunks are skipped whole and their sources reported; later chunks are still considered. packed only means all supplied chunks fit, not that their meaning is sufficient. This conservative example reports insufficient evidence whenever a supplied chunk is skipped.
why_it_matters_vi: Tách truy xuất khỏi sinh câu trả lời để truy nguồn và xử lý thiếu bằng chứng.
why_it_matters_en: RAG separates retrieval from generation so answers can be sourced and can abstain without evidence.
study_steps_vi:
- Đọc kiến thức, dự đoán top-1 theo dòng có giữ được ngoại lệ hay không.
- Lưu ví dụ đầu thành chunk_documents.py và chạy python chunk_documents.py với Python 3.11+; không cài gói.
- Đối chiếu dòng L2 với mục L1-L3; kiểm tra text khớp dòng gốc và đúng phiên bản.
- So ngân sách 97, 96 và 0 ký tự; giải thích vì sao nhãn nguồn cũng chiếm ngân sách.
- Lưu ví dụ hai thành check_chunking.py cạnh tệp đầu rồi chạy python check_chunking.py; hướng dẫn Colab nằm dưới ví dụ.
study_steps_en:
- Read the concept notes and predict whether line top-1 retains the exception.
- Save example one as chunk_documents.py and run python chunk_documents.py with Python 3.11+; no packages are needed.
- Compare line L2 with section L1-L3; check the text against original lines and the correct version.
- Compare budgets of 97, 96 and 0 characters; explain why source labels also consume the budget.
- Save example two as check_chunking.py beside the first file and run python check_chunking.py; Colab instructions follow the examples.
practice_plan:
  vi:
    task: So tách dòng với nhóm theo tiêu đề trên văn bản giả; giữ ID/phiên bản/khoảng dòng/text gốc. Ghép ngữ cảnh có ngân sách ký tự và báo đoạn bị bỏ. Đây là một bước chuẩn bị cho bài RAG tổng hợp của học phần.
    deliverables:
    - Hai tệp chunk_documents.py và check_chunking.py cùng stdout đúng
    - Đối chiếu top-1 và khoảng dòng nguồn, ngân sách vừa đủ/thiếu một/không ký tự
    - Một phản ví dụ mà nhóm theo tiêu đề vẫn mất ngoại lệ
    checkpoint: check_chunking(split_document, assemble_context) đạt; checker phải bác bỏ mất metadata, sai text/dòng và cắt đoạn để vừa ngân sách.
    stretch: Chuyển ngoại lệ sang tiêu đề riêng; chỉ ra vì sao top-1 theo mục không còn đủ và cần xem thêm bằng chứng.
  en:
    task: Compare line and heading-section chunks on synthetic text; preserve ID/version/source spans/original text. Pack source context within a character budget and report skipped chunks. This prepares one step of the module's larger RAG exercise.
    deliverables:
    - chunk_documents.py and check_chunking.py with matching stdout
    - Top-1 and source-span checks, plus exact/one-short/zero character budgets
    - One counterexample where heading grouping still loses the exception
    checkpoint: check_chunking(split_document, assemble_context) passes; the checker rejects missing metadata, wrong text/spans and cutting a chunk to fit.
    stretch: Move the exception under a separate heading; show why section top-1 is now insufficient and more evidence must be inspected.
interview_questions:
  vi:
  - Bạn sẽ giải thích nội dung “Chia đoạn, siêu dữ liệu và ngữ cảnh” bằng ví dụ nào?
  - Điều kiện nào cần kiểm tra trước khi áp dụng vào công việc thực tế?
  - Bạn dùng bằng chứng nào để kết luận bài làm đáp ứng yêu cầu?
  en:
  - How would you explain chunking, metadata, and context to a new teammate?
  - Which assumption behind chunking, metadata, and context could fail in production?
  - Which metric or test would prove the result is trustworthy?
formulas: []
code_examples:
- language: python
  title: So ranh giới đoạn / Compare chunk boundaries
  status: runnable
  code: |
    CONDITION = 'Refund within 7 days.'
    EXCEPTION = 'Exception: opened items are excluded.'
    DOCUMENT = {'id': 'policy', 'version': 'v1',
                'text': '# Returns\n' + CONDITION + '\n' + EXCEPTION + '\n# Contact\nEmail support.'}


    def split_document(document, mode):
        if mode not in ('line', 'section'):
            raise ValueError('mode must be line or section')
        if not isinstance(document, dict):
            raise ValueError('document must be a mapping')
        values = [document.get(key) for key in ('id', 'version', 'text')]
        if not all(isinstance(value, str) and value.strip() for value in values):
            raise ValueError('id, version and text must be nonblank strings')
        doc_id, version, text = values
        lines = text.splitlines()
        is_heading = lambda line: line.startswith('# ')
        body = [i for i, line in enumerate(lines, 1) if line.strip() and not is_heading(line)]
        if not body:
            raise ValueError('document has no body text')
        if mode == 'line':
            spans = [(i, i) for i in body]
        else:
            starts = sorted({1} | {i for i, line in enumerate(lines, 1) if is_heading(line)})
            ends = [i - 1 for i in starts[1:]] + [len(lines)]
            spans = [(start, end) for start, end in zip(starts, ends)
                     if any(start <= i <= end for i in body)]
        return [{'document_id': doc_id, 'version': version,
                 'chunk_id': f'{mode}-{number}', 'line_start': start, 'line_end': end,
                 'text': '\n'.join(lines[start - 1:end])}
                for number, (start, end) in enumerate(spans, 1)]


    def source_label(chunk):
        return (f"{chunk['document_id']}@{chunk['version']}/{chunk['chunk_id']}:"
                f"L{chunk['line_start']}-L{chunk['line_end']}")


    def assemble_context(chunks, budget):
        if type(budget) is not int or budget < 0:
            raise ValueError('budget must be a nonnegative integer')
        if not isinstance(chunks, list):
            raise ValueError('chunks must be a list')
        context, included, skipped, seen = '', [], [], set()
        for chunk in chunks:
            if not isinstance(chunk, dict):
                raise ValueError('chunk must be a mapping')
            if not all(isinstance(chunk.get(k), str) and chunk[k].strip()
                       for k in ('document_id', 'version', 'chunk_id', 'text')):
                raise ValueError('missing chunk metadata or text')
            start, end = chunk.get('line_start'), chunk.get('line_end')
            if type(start) is not int or type(end) is not int or not 1 <= start <= end:
                raise ValueError('invalid source span')
            # Chunks join source lines with LF; retain a final empty source line.
            if len(chunk['text'].split('\n')) != end - start + 1:
                raise ValueError('text does not match span length')
            identity = (chunk['document_id'], chunk['version'], chunk['chunk_id'])
            if identity in seen:
                raise ValueError('duplicate chunk identity')
            seen.add(identity)
            label = source_label(chunk)
            block = f"[{label}]\n{chunk['text']}"
            candidate = context + ('\n\n' if context else '') + block
            if len(candidate) <= budget:
                context = candidate
                included.append(label)
            else:
                skipped.append(label)
        # Conservative packing status: all supplied chunks are required here.
        status = 'packed' if included and not skipped else 'insufficient evidence'
        return {'context': context, 'included': included, 'skipped': skipped, 'status': status}


    if __name__ == '__main__':
        tops = {}
        for mode in ('line', 'section'):
            chunks = split_document(DOCUMENT, mode)
            # First literal match in source order, not semantic retrieval.
            top = next(c for c in chunks if 'refund' in c['text'].lower())
            tops[mode] = top
            complete = CONDITION in top['text'] and EXCEPTION in top['text']
            print(f'{mode} top-1: {source_label(top)}; complete={complete}')
        top = tops['section']
        exact = len(f"[{source_label(top)}]\n{top['text']}")
        for budget in (exact, exact - 1, 0):
            result = assemble_context([top], budget)
            print(f"budget={budget}; used={len(result['context'])}; status={result['status']}")
            print(f"skipped={result['skipped']}")
  setup: Python 3.11+ standard library only; save as chunk_documents.py; run python chunk_documents.py.
  expected_output: |
    line top-1: policy@v1/line-1:L2-L2; complete=False
    section top-1: policy@v1/section-1:L1-L3; complete=True
    budget=97; used=97; status=packed
    skipped=[]
    budget=96; used=0; status=insufficient evidence
    skipped=['policy@v1/section-1:L1-L3']
    budget=0; used=0; status=insufficient evidence
    skipped=['policy@v1/section-1:L1-L3']
  purpose_vi: So top-1 theo dòng với theo mục, giữ nguồn gốc và bỏ cả đoạn khi không đủ ngân sách.
  purpose_en: Compare line and section top-1 results, preserve provenance and skip whole chunks that do not fit.
  edge_case_vi: Rỗng/chỉ tiêu đề, thiếu metadata và ngân sách âm bị từ chối; thiếu một ký tự thì bỏ cả đoạn. Dòng trống vẫn
    giữ vị trí nguồn.
  edge_case_en: Reject empty/headings-only input, missing metadata and negative budgets; one character short skips the whole
    chunk. Blank lines retain source positions.
  explanation_vi: Lưu chunk_documents.py, chạy python chunk_documents.py. complete chỉ so hai câu trong fixture này; packed
    chỉ xác nhận các đoạn đầu vào vừa ngân sách, không chứng minh đủ nghĩa. Nhãn nguồn, xuống dòng và dấu phân cách đều tính
    vào len(context). Đây là ngân sách ký tự dạy học cho phần nguồn, chưa gồm chỉ dẫn/câu hỏi và không phải token. Không chạy
    embedding, LLM, PDF, OCR hay Docling.
  explanation_en: Save chunk_documents.py and run python chunk_documents.py. complete checks two sentences in this fixture
    only; packed means all supplied chunks fit, not that their meaning is sufficient. Source labels, newlines and separators
    count in len(context). This teaching character budget covers source context only, excludes instructions/question, and
    is not a token budget. No embeddings, LLM, PDF, OCR or Docling run.
- language: python
  title: Kiểm tra bài làm / Check your chunking implementation
  status: runnable
  code: |
    from chunk_documents import split_document, assemble_context


    def check_chunking(split, pack):
        document = {'id': 'terms', 'version': 'v2',
                    'text': '# Returns\n  Refund in 5 days.  \n\nException: opened items excluded.\n# Contact\nEmail us.'}
        lines = document['text'].splitlines()
        line_chunks, sections = split(document, 'line'), split(document, 'section')
        assert len(line_chunks) == 3 and len(sections) == 2
        for chunks, spans in ((line_chunks, [(2, 2), (4, 4), (6, 6)]),
                              (sections, [(1, 4), (5, 6)])):
            assert len({c['chunk_id'] for c in chunks}) == len(chunks)
            for chunk, (start, end) in zip(chunks, spans):
                assert chunk['document_id'] == 'terms' and chunk['version'] == 'v2'
                assert (chunk['line_start'], chunk['line_end']) == (start, end)
                assert chunk['text'] == '\n'.join(lines[start - 1:end])
        assert 'Exception:' not in line_chunks[0]['text']
        assert 'Exception: opened items excluded.' in sections[0]['text']
        labels = [f"terms@v2/{c['chunk_id']}:L{c['line_start']}-L{c['line_end']}" for c in sections]
        blocks = [f"[{label}]\n{c['text']}" for label, c in zip(labels, sections)]
        expected = '\n\n'.join(blocks)
        full = pack(sections, len(expected))
        assert full == {'context': expected, 'included': labels, 'skipped': [], 'status': 'packed'}
        short = pack(sections, len(expected) - 1)
        assert short == {'context': blocks[0], 'included': labels[:1],
                         'skipped': labels[1:], 'status': 'insufficient evidence'}
        for budget in (0, len(blocks[0]) - 1):
            result = pack(sections[:1], budget)
            assert result == {'context': '', 'included': [], 'skipped': labels[:1],
                              'status': 'insufficient evidence'}
        assert pack([], 0) == {'context': '', 'included': [], 'skipped': [],
                               'status': 'insufficient evidence'}
        bad_chunk = dict(sections[0])
        del bad_chunk['version']
        for operation in (
            lambda: split({}, 'section'),
            lambda: split(dict(document, text=' '), 'line'),
            lambda: split(dict(document, text='# Heading'), 'section'),
            lambda: split(document, 'unknown'),
            lambda: pack([bad_chunk], 1000),
            lambda: pack(sections, -1),
            lambda: pack(sections, True),
        ):
            try:
                operation()
            except ValueError:
                continue
            raise AssertionError('invalid input accepted')
        return True


    if __name__ == '__main__':
        assert check_chunking(split_document, assemble_context)
        print('chunking acceptance: passed')
  setup: Python 3.11+ standard library only; save as check_chunking.py; run python check_chunking.py beside chunk_documents.py.
  expected_output: |
    chunking acceptance: passed
  purpose_vi: Đối chiếu dòng gốc và ngân sách với đáp án độc lập; checker phải bác bỏ bản làm mất metadata, ngoại lệ hoặc
    cắt giữa đoạn.
  purpose_en: Check original lines and budget against independent expectations; reject missing metadata, lost exceptions and
    truncated chunks.
  edge_case_vi: Rỗng/chỉ tiêu đề, thiếu metadata và ngân sách âm bị từ chối; thiếu một ký tự thì bỏ cả đoạn. Dòng trống vẫn
    giữ vị trí nguồn.
  edge_case_en: Reject empty/headings-only input, missing metadata and negative budgets; one character short skips the whole
    chunk. Blank lines retain source positions.
  explanation_vi: 'Local: lưu check_chunking.py cạnh chunk_documents.py, chạy python check_chunking.py. Colab: dòng đầu ô
    chứa ví dụ 1 là %%writefile chunk_documents.py; chạy ô đó. Dòng đầu ô chứa ví dụ 2 là %%writefile check_chunking.py; chạy
    ô đó. Ô mới chạy !python chunk_documents.py rồi !python check_chunking.py trên hai dòng. Ô code thường không tự tạo tệp
    để import. Stdout checker đúng là chunking acceptance: passed. Giữ checker khi sửa hai hàm; không suy ra chất lượng RAG
    từ fixture này.'
  explanation_en: 'Local: save check_chunking.py beside chunk_documents.py and run python check_chunking.py. Colab: put %%writefile
    chunk_documents.py first in the example 1 cell and run it; put %%writefile check_chunking.py first in the example 2 cell
    and run it. In a new cell run !python chunk_documents.py then !python check_chunking.py on separate lines. Ordinary cells
    do not create importable files. Expected checker stdout is chunking acceptance: passed. Keep the checker unchanged when
    editing either function; this fixture does not establish RAG quality.'
resources:
- language: en
  title: Docling · Chunking
  url: https://docling-project.github.io/docling/concepts/chunking/
  kind: official
  required: false
  purpose_vi: Dùng lại nguồn đọc của bài nhập tài liệu để so chia đoạn có cấu trúc và metadata với ví dụ văn bản thuần.
  purpose_en: Reuse the ingestion lesson's reading to compare structured chunking and metadata with this plain-text example.
  read_vi: Đọc Introduction và Base/Hybrid/Hierarchical Chunker; đối chiếu cấu trúc và giới hạn token với ngân sách ký tự dạy học. Ví dụ này không triển khai Docling.
  read_en: Read Introduction and Base/Hybrid/Hierarchical Chunker; compare structure and token limits with this teaching character budget. This example does not implement Docling.
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
- phase-12-genai-rag-rag-foundations-2-recall
- phase-12-genai-rag-rag-foundations-2-application
- phase-12-genai-rag-rag-foundations-2-debug
- phase-12-genai-rag-rag-foundations-2-interview
estimated_minutes: 60
completion_checklist:
- Chỉ ra top-1 nào mất ngoại lệ và vì sao.
- Đối chiếu từng đoạn với ID, phiên bản, text và khoảng dòng gốc.
- Chạy checker, ghi ngân sách kể cả nhãn nguồn và giải thích một giới hạn của cách nhóm theo tiêu đề.
completion_criteria:
- Hai ví dụ chạy ra stdout đã ghi, không cần thư viện ngoài.
- Checker bác bỏ metadata bị mất, text/dòng sai và cắt giữa đoạn để vừa ngân sách.
- Nêu được vì sao packed không bảo đảm đủ bằng chứng và ký tự không phải token.
common_mistakes:
- Đánh lại số dòng sau khi bỏ tiêu đề/dòng trống hoặc bỏ version khi truy nguồn.
- Chỉ tính len(text), quên nhãn nguồn và dấu phân cách khi ghép ngữ cảnh.
- Cắt đoạn giữa điều kiện/ngoại lệ, hoặc suy rằng nhóm theo tiêu đề luôn giữ đủ nghĩa.
next_lessons:
- phase-12-genai-rag-rag-foundations-3
- phase-12-genai-rag-rag-foundations-4
review_question_vi: Vì sao dòng hoàn tiền được chọn đúng từ khóa nhưng vẫn thiếu bằng chứng?
review_question_en: Why does the refund line match the keyword yet still lack evidence?
review_answer_vi: Dòng L2 giữ điều kiện nhưng không có ngoại lệ ở L3. Mục L1-L3 giữ cả hai trong fixture này; ID/phiên bản/khoảng dòng/text cho phép kiểm tra lại nguồn. Ngoại lệ ở mục khác vẫn có thể bị mất.
review_answer_en: Line L2 retains the condition but loses the exception at L3. Section L1-L3 retains both in this fixture; ID/version/span/text allow source checks. An exception in another section can still be lost.
review_cards:
- id: phase-12-genai-rag-rag-foundations-2-recall
  type: recall
  question_vi: line và section chia tài liệu mẫu khác nhau thế nào?
  question_en: How do line and section split the sample document differently?
  answer_vi: line lấy từng dòng nội dung, nên top-1 L2 thiếu ngoại lệ L3. section lấy cả mục L1-L3 từ tiêu đề, nên giữ cả điều kiện lẫn ngoại lệ. Cả hai giữ ID/phiên bản/khoảng dòng/text gốc.
  answer_en: line takes individual body lines, so top-1 L2 loses the L3 exception. section takes heading section L1-L3 and retains both condition and exception. Both retain ID/version/source span/original text.
  hint_vi: So văn bản trong hai chunk được chọn.
  hint_en: Compare the text in the two selected chunks.
- id: phase-12-genai-rag-rag-foundations-2-application
  type: application
  question_vi: Ngân sách phải tính những phần nào, và 97 so với 96 ký tự khác gì?
  question_en: What must the budget count, and how do 97 and 96 characters differ?
  answer_vi: Tính cả text, nhãn nguồn trong ngoặc vuông, xuống dòng và dấu phân cách giữa các đoạn. Mục đầu dùng 97 ký tự; ngân sách 96 bỏ nguyên mục, context rỗng và ghi nguồn trong skipped. Không cắt mất ngoại lệ.
  answer_en: Count text, bracketed source labels, newlines and separators between chunks. The first section uses 97 characters; a budget of 96 skips it whole, leaves context empty and reports the source in skipped. It does not cut away the exception.
  hint_vi: Tính len trên chuỗi cuối cùng, không chỉ text.
  hint_en: Measure len of the final string, not text alone.
- id: phase-12-genai-rag-rag-foundations-2-debug
  type: debug
  question_vi: Checker cần bắt được những lỗi nào ngoài việc đếm chunk?
  question_en: What must the checker catch beyond counting chunks?
  answer_vi: Thiếu ID/phiên bản/chunk_id, sai khoảng dòng/text so nguồn, mất ngoại lệ và cắt giữa đoạn để vừa ngân sách. Dòng trống vẫn tính vị trí gốc; tài liệu rỗng/chỉ tiêu đề và ngân sách sai phải bị từ chối.
  answer_en: Missing ID/version/chunk_id, wrong spans or source text, lost exceptions and cutting a chunk to fit. Blank lines still count toward original positions; empty/headings-only documents and invalid budgets must be rejected.
  hint_vi: Đối chiếu đầu ra với nguồn và chuỗi ngữ cảnh mong đợi độc lập.
  hint_en: Compare output against the source and an independently constructed context string.
- id: phase-12-genai-rag-rag-foundations-2-interview
  type: interview
  question_vi: Nhóm theo tiêu đề đạt ở fixture này chứng minh điều gì và còn giới hạn gì?
  question_en: What does successful heading grouping establish in this fixture, and what are its limits?
  answer_vi: Nó giữ điều kiện và ngoại lệ liền kề trong cùng mục, nhưng ngoại lệ ở mục khác vẫn có thể bị mất. Mục lớn có thể bị bỏ vì ngân sách. packed chỉ là trạng thái ghép; ký tự không phải token. Chưa đo embedding, LLM, PDF/OCR hoặc Docling.
  answer_en: It retains adjacent condition and exception in the same section, but an exception under another heading can still be lost. Large sections can be skipped by the budget. packed is a packing status; characters are not tokens. No embeddings, LLM, PDF/OCR or Docling were evaluated.
  hint_vi: Thử chuyển ngoại lệ xuống một tiêu đề mới.
  hint_en: Try moving the exception under a new heading.
---
# Chia đoạn, siêu dữ liệu và ngữ cảnh / Chunking, metadata, and context

So tách từng dòng với nhóm theo tiêu đề trên văn bản hoàn tiền giả. Top-1 là đoạn đầu tiên chứa refund theo thứ tự nguồn: dòng L2 thiếu ngoại lệ ở L3, còn mục L1-L3 giữ cả hai. Metadata gồm document_id, version, chunk_id, line_start và line_end; text giữ từng dòng gốc, kể cả khoảng trắng.

Compare line chunks and heading sections on synthetic refund text. Top-1 is the first chunk containing refund in source order: L2 loses the L3 exception, while section L1-L3 retains both. Metadata includes document_id, version, chunk_id, line_start and line_end; text preserves original lines and whitespace.

Ngân sách ký tự tính cả nhãn nguồn, xuống dòng và dấu phân cách. Mục đầu cần 97 ký tự; 96 hoặc 0 ký tự khiến mục bị bỏ nguyên và báo insufficient evidence. Đây là ngân sách dạy học cho phần nguồn, không phải token và chưa gồm chỉ dẫn/câu hỏi.

The character budget includes source labels, newlines and separators. The first section requires 97 characters; 96 or 0 skips it whole and reports insufficient evidence. This teaching budget covers source context only, not tokens or instructions/question.

## Thực hành / Practice

Lưu hai ví dụ thành chunk_documents.py và check_chunking.py trong cùng thư mục, chạy python chunk_documents.py rồi python check_chunking.py. Dùng hướng dẫn %%writefile trong ví dụ thứ hai khi học trên Colab. So stdout, kiểm tra trường bị thiếu và ngân sách thiếu một ký tự; giữ nguyên checker khi sửa bài làm.

Save the examples as chunk_documents.py and check_chunking.py in the same directory; run python chunk_documents.py then python check_chunking.py. Follow the second example's %%writefile instructions on Colab. Compare stdout, test missing fields and a one-character shortfall, and keep the checker unchanged.

Nhóm theo tiêu đề chỉ giữ đủ bằng chứng trong fixture này. Chuyển ngoại lệ sang mục riêng để thấy giới hạn; packed không chứng minh đủ nghĩa. Không chạy embedding, LLM, PDF, OCR hay Docling.

Heading grouping retains sufficient evidence only in this fixture. Move the exception under another heading to expose the limit; packed does not establish semantic completeness. No embeddings, LLM, PDF, OCR or Docling run.
