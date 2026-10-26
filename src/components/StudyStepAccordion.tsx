import { useState } from 'react'
import type { Lesson } from '../api'

export function StudyStepAccordion({ step, index, lesson, language }:
  { step: string; index: number; lesson: Lesson; language: 'vi' | 'en' }) {
  const [open, setOpen] = useState(false)
  const vi = language === 'vi'
  const stage = Math.min(index, 4)
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
              <span className="eyebrow">{vi ? 'ĐỌC PHẦN CHÍNH' : 'READ THE MAIN LESSON'}</span>
              <p>{vi
                ? 'Phần “Kiến thức cần nắm” ở trên là nội dung chính. Đọc một lượt, tự viết lại một đến hai ý bằng lời của bạn và đánh dấu điều cần kiểm chứng.'
                : 'The Concept notes above are the main lesson. Read them once, restate one or two ideas in your own words and mark what you still need to verify.'}</p>
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Cách biết mình đã sẵn sàng' : 'Ready to continue when'}</h4>
              <ul>
                <li>{vi ? 'Nói lại được ý chính mà không chép nguyên văn.' : 'You can restate the main idea without copying it.'}</li>
                <li>{vi ? 'Nêu được một điểm cần kiểm tra bằng ví dụ hoặc lệnh nhỏ.' : 'You can name one point to verify with a small example or command.'}</li>
              </ul>
            </div>
          </>}
          {stage === 1 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'ĐỌC CÓ MỤC TIÊU' : 'READ THIS'}</span>
              <p>{lesson.resources.length > 0
                ? (vi ? `Bài này có ${lesson.resources.length} tài liệu được tuyển chọn. Đọc để trả lời một câu hỏi cụ thể, không đọc lại toàn bộ phần chính.`
                  : `This lesson has ${lesson.resources.length} curated resource${lesson.resources.length === 1 ? '' : 's'}. Read it to answer one focused question instead of rereading the main lesson.`)
                : (vi ? 'Bài học này chưa có tài liệu bổ sung; hãy chuyển thẳng sang ví dụ và bài tập.'
                  : 'No additional resource is linked; move directly to the example and exercise.')}</p>
              {lesson.resources.length > 0 && <a className="text-button" href="#resources">
                {vi ? 'Mở mục Tài liệu có hướng dẫn đọc' : 'Open guided resources'} →
              </a>}
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Cách biết mình đọc đúng hướng' : 'How to know you are on track'}</h4>
              <p>{vi ? 'Ghi lại một định nghĩa, một giả định hoặc một điểm còn mâu thuẫn cần kiểm tra. Tiêu chí hoàn thành đầy đủ nằm ở phần kiểm tra bên dưới.'
                : 'Capture one definition, assumption or unresolved point to verify. The full completion criteria live in the check section below.'}</p>
              <a className="text-button" href="#check">{vi ? 'Xem tiêu chí hoàn thành' : 'View completion criteria'} →</a>
            </div>
          </>}
          {stage === 2 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'MỘT THAY ĐỔI NHỎ' : 'ONE SMALL CHANGE'}</span>
              <p>{vi
                ? 'Mở ví dụ mã nguồn bên dưới, chạy để có mốc ban đầu rồi thay đúng một đầu vào hoặc giả định. Ghi lại output trước và sau thay đổi.'
                : 'Open the code example below, run it for a baseline, then change exactly one input or assumption. Record the output before and after.'}</p>
              {lesson.code_examples.length > 0 && <a className="text-button" href="#lesson-code-title">
                {vi ? 'Đi tới Ví dụ mã nguồn' : 'Go to code examples'} →
              </a>}
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Kiểm tra bằng bài tập' : 'Verify with the exercise'}</h4>
              <p>{lesson.exercises.length > 0
                ? (vi ? 'Làm bài tập liên quan sau khi đã có output nền. Nếu không đạt, quay lại đúng giả định vừa thay đổi.'
                  : 'Do the related exercise after you have a baseline output. If it fails, return to the assumption you changed.')
                : (vi ? 'Chưa có bài tập riêng; dùng checklist để tự tạo một ca kiểm tra nhỏ.'
                  : 'No dedicated exercise is linked; use the checklist to create a small verification case.')}</p>
              {lesson.exercises.length > 0 && <a className="text-button" href="#lesson-exercise-title">
                {vi ? 'Đi tới Bài tập liên quan' : 'Go to related exercise'} →
              </a>}
            </div>
          </>}
          {stage === 3 && <>
            <div className="study-step-card">
              <span className="eyebrow">{vi ? 'BẰNG CHỨNG' : 'EVIDENCE'}</span>
              <h4>{vi ? 'Ghi lại thứ người khác có thể kiểm tra' : 'Save evidence someone else can verify'}</h4>
              <ul>
                <li>{vi ? 'Mã nguồn hoặc lệnh đã chạy.' : 'The code or commands you ran.'}</li>
                <li>{vi ? 'Output, test hoặc ảnh chụp kết quả.' : 'The output, test or a screenshot of the result.'}</li>
                <li>{vi ? 'Một giới hạn và bước kiểm tra tiếp theo.' : 'One limitation and the next verification step.'}</li>
              </ul>
            </div>
            <div className="study-step-card">
              <h4>{vi ? 'Đừng chỉ lưu kết quả tốt' : 'Do not save only a happy path'}</h4>
              <p>{vi
                ? 'Ghi cả trường hợp biên hoặc lỗi đã gặp. Phần checklist bên dưới là nơi đánh dấu từng tiêu chí hoàn thành.'
                : 'Record an edge case or failure too. Use the checklist below to mark each completion criterion.'}</p>
            </div>
          </>}
          {stage === 4 && <div className="study-step-card">
            <span className="eyebrow">{vi ? 'TỰ NHỚ LẠI' : 'RECALL'}</span>
            <p>{vi
              ? 'Hãy trả lời các câu hỏi trong mục “Câu hỏi tự kiểm tra” bên dưới trước khi mở gợi ý. Nếu còn thiếu, quay lại đúng đoạn cần đọc thay vì học lại cả bài.'
              : 'Answer the questions in “Self-check questions” below before opening the hints. If you miss one, return to the exact gap instead of rereading the whole lesson.'}</p>
            <a className="text-button" href="#self-check-questions">{vi ? 'Đi tới câu hỏi tự kiểm tra' : 'Go to self-check questions'} →</a>
          </div>}
        </div>
      </>}
    </div>
  </li>
}
