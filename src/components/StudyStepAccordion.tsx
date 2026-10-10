import { useState } from 'react'
import type { Lesson } from '../api'

export function StudyStepAccordion({ step, index, lesson, language }:
  { step: string; index: number; lesson: Lesson; language: 'vi' | 'en' }) {
  const [open, setOpen] = useState(false)
  const vi = language === 'vi'
  const stage = Math.min(index, 4)
  // Explicit references win; fallback examples belong to their matching study stage.
  const ref = lesson.study_step_refs?.[index]
  const resource = typeof ref?.resource_index === 'number' ? lesson.resources[ref.resource_index]
    : index === 1 ? lesson.resources[0] : undefined
  const example = typeof ref?.code_example_index === 'number' ? lesson.code_examples[ref.code_example_index]
    : index === 2 ? lesson.code_examples[0] : undefined
  const review = ref?.review_id !== undefined ? lesson.reviews.find((item) => item.id === ref.review_id)
    : index === 4 ? lesson.reviews[0] : undefined
  const panelId = `study-step-${lesson.slug}-${index}`
  const headingId = `${panelId}-heading`
  const titles = vi
    ? ['Nắm ý chính trước khi làm', 'Đọc tài liệu có mục tiêu', 'Vận dụng lý thuyết để viết mã',
      'Lưu lại bài làm và kết quả kiểm tra', 'Tự nhớ lại và ôn phần chưa hiểu']
    : ['Understand the idea before doing', 'Read with a focused question', 'Turn the concept into code',
      'Create verifiable evidence', 'Recall and close the gap']
  const explanations = vi ? [
    'Bắt đầu bằng phần giải thích cốt lõi và công thức liên quan. Hãy nói lại bằng lời của bạn trước khi mở tài liệu ngoài.',
    'Chọn tài liệu được gợi ý, ghi lại một định nghĩa hoặc ví dụ, rồi đối chiếu với mục tiêu của bài học.',
    'Chạy ví dụ trong môi trường thực hành của bạn, thay đổi một giả định và quan sát kết quả.',
    'Lưu mã nguồn, kết quả chạy hoặc bài kiểm thử, kèm ghi chú về trường hợp biên. Bạn có thể dùng bài làm này trong hồ sơ dự án sau này.',
    'Trả lời câu hỏi khi chưa nhìn gợi ý. Nếu sai, quay lại đúng phần chưa hiểu để ôn lại.',
  ] : [
    'Start with the concept notes and relevant formulas. Explain the idea in your own words before opening a resource.',
    'Read the suggested resource with a question in mind. Capture one definition or example and compare it with the outcomes.',
    'Run the example in your practice environment, change one assumption and inspect the output.',
    'Save code, output or a test with a short edge-case note. This evidence can later support your portfolio.',
    'Answer the question before looking at the hint. If you miss it, return to the exact gap and review it.',
  ]
  const answer = [
    lesson.objectives[language].join(' '),
    lesson.completion_criteria.slice(0, 2).join(' '),
    vi ? example?.explanation_vi ?? lesson.concept_notes_vi : example?.explanation_en ?? lesson.concept_notes_en,
    lesson.checklist.slice(0, 3).join(' '),
  ][stage]
  return <li className={`study-step-item ${open ? 'open' : ''}`}>
    <button id={headingId} className="study-step-toggle" type="button" aria-expanded={open}
      aria-controls={panelId} onClick={() => setOpen((current) => !current)}>
      <span className="study-step-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="study-step-copy">
        <strong>{step}</strong>
        <small>{open ? (vi ? 'Đang mở nội dung chi tiết' : 'Details open')
          : (vi ? 'Bấm để xem giải thích, ví dụ và cách tự kiểm tra' : 'Open explanation, example and self-check')}</small>
      </span>
      <span className="study-step-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    <div hidden={!open} className="study-step-detail" id={panelId} role="region" aria-labelledby={headingId}>
      {open && <>
        <h3>{titles[stage]}</h3>
        <p className="study-step-explanation">{explanations[stage]}</p>
        <div className="study-step-content">
          {stage === 0 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'KHÁI NIỆM' : 'CONCEPT'}</span>
              <p className="concept-notes">{vi ? lesson.concept_notes_vi : lesson.concept_notes_en}</p>
              {lesson.formulas.length > 0 && <div className="formula-list">
                {lesson.formulas.slice(0, 3).map((formula) => <code key={formula}>{formula}</code>)}
              </div>}
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Sau bước này, bạn làm được gì?' : 'By the end of this step'}</h4>
              <ul>{lesson.objectives[language].map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </>}
          {stage === 1 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'ĐỌC CÓ MỤC TIÊU' : 'READ THIS'}</span>
              {resource ? <>
                <strong>{resource.title}</strong>
                <p>{vi ? resource.purpose_vi : resource.purpose_en}</p>
                <small>{vi ? resource.read_vi : resource.read_en}</small>
                {resource.url && resource.kind !== 'in_app'
                  && <a href={resource.url} target="_blank" rel="noreferrer">
                    {vi ? 'Mở tài liệu' : 'Open resource'} ↗
                  </a>}
              </> : <p>{vi ? 'Bài học này chưa có tài liệu bổ sung.' : 'No additional resource is linked yet.'}</p>}
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Cách biết mình đọc đúng hướng' : 'How to know you are on track'}</h4>
              <ul>{lesson.completion_criteria.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </>}
          {stage === 2 && <>
            <div className="study-step-card">
              {example ? <>
                <span className="eyebrow">{vi ? 'VÍ DỤ' : 'EXAMPLE'} · {example.status === 'conceptual'
                  ? (vi ? 'MINH HỌA KHÁI NIỆM' : 'CONCEPTUAL') : (vi ? 'CÓ THỂ CHẠY' : 'RUNNABLE')}</span>
                <strong>{example.title}</strong>
                {(example.purpose_vi || example.purpose_en)
                  && <p className="muted">{vi ? example.purpose_vi : example.purpose_en}</p>}
                <pre tabIndex={0} aria-label={example.title}><code>{example.code}</code></pre>
                <p>{vi ? example.explanation_vi : example.explanation_en}</p>
                <dl className="code-example-guide">
                  {example.setup && <><dt>{vi ? 'Chuẩn bị' : 'Setup'}</dt><dd>{example.setup}</dd></>}
                  {example.expected_output && <><dt>{vi ? 'Kết quả mong đợi' : 'Expected output'}</dt>
                    <dd>{example.expected_output}</dd></>}
                  {(example.edge_case_vi || example.edge_case_en) && <>
                    <dt>{vi ? 'Trường hợp biên' : 'Edge case'}</dt>
                    <dd>{vi ? example.edge_case_vi : example.edge_case_en}</dd>
                  </>}
                </dl>
              </> : <p>{vi ? 'Chưa có ví dụ mã riêng. Dùng danh sách tự kiểm tra để tạo một ví dụ tối thiểu.'
                : 'No code example is linked yet; use the checklist to create a minimal example.'}</p>}
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Bài thực hành liên quan' : 'Related practice'}</h4>
              {lesson.exercises.length ? <ul>{lesson.exercises.slice(0, 3).map((exercise) =>
                <li key={exercise.slug}>{vi ? exercise.title_vi : exercise.title_en}
                  {' · '}{exercise.estimated_minutes} {vi ? 'phút' : 'min'}</li>)}</ul>
                : <p>{vi ? 'Chưa có bài tập riêng cho bài học này.' : 'No dedicated exercise is linked yet.'}</p>}
            </div>
          </>}
          {stage === 3 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'BẰNG CHỨNG' : 'EVIDENCE'}</span>
              <h4>{vi ? 'Những việc cần hoàn thành' : 'Checklist to complete'}</h4>
              <ul>{lesson.checklist.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Tiêu chí đạt' : 'Definition of done'}</h4>
              <ul>{lesson.completion_criteria.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </>}
          {stage === 4 && <div className="study-step-card">
            <span className="eyebrow">{vi ? 'TỰ NHỚ LẠI' : 'RECALL'}</span>
            {review ? <>
              <p><strong>{vi ? review.question_vi : review.question_en}</strong></p>
              <details>
                <summary>{vi ? 'Mở câu trả lời mẫu' : 'Show answer'}</summary>
                <p>{vi ? review.answer_vi : review.answer_en}</p>
              </details>
            </> : <p>{vi ? 'Giải thích lại bài học bằng một ví dụ và ghi điều còn chưa chắc vào nhật ký.'
              : 'Explain the lesson with one example and record any remaining uncertainty in your Journal.'}</p>}
          </div>}
        </div>
        {answer && <details className="study-step-answer">
          <summary>{vi ? 'Mở câu trả lời / dấu hiệu đã hiểu' : 'Show answer / understanding check'}</summary>
          <p>{answer}</p>
        </details>}
      </>}
    </div>
  </li>
}
