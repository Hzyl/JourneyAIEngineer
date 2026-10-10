import { useId, useState } from 'react'
import { exerciseSolution } from './exercise-solutions'
import './exercise-solution.css'

export function ExerciseSolution({ slug, language }: { slug: string; language: 'vi' | 'en' }) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  const headingId = useId()
  const vi = language === 'vi'
  const solution = exerciseSolution(slug, language)

  return <section id="exercise-solution" className="exercise-solution" aria-labelledby={headingId} tabIndex={-1}>
    <h3 id={headingId}>04 · {vi ? 'Bài giải tham khảo' : 'Reference solution'}</h3>
    {solution ? <>
      <p className="muted">{vi
        ? 'Đã thử làm hoặc đang bị vướng? Mở bài giải để đối chiếu. Đây là một cách giải, không phải cách duy nhất.'
        : 'Finished your attempt or feeling stuck? Open the solution to compare. This is one approach, not the only one.'}</p>
      <button className="secondary-button exercise-solution-toggle" aria-expanded={expanded}
        aria-controls={panelId} onClick={() => setExpanded((value) => !value)}>
        {expanded ? (vi ? 'Ẩn bài giải' : 'Hide solution') : (vi ? 'Xem bài giải' : 'View solution')}
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <div id={panelId} hidden={!expanded}>
        {expanded && <div className="exercise-solution-content">
          <h4>{vi ? 'Cách tiếp cận' : 'Approach'}</h4>
          <p>{solution.approach}</p>
          {solution.tables.length > 0 && <p className="muted">{vi
            ? 'Trên màn hình nhỏ, cuộn ngang để xem đủ cột. Bạn có thể chọn bảng bằng Tab rồi dùng phím ← →.'
            : 'On small screens, scroll horizontally to see every column. You can also Tab to a table and use ← →.'}</p>}
          {solution.tables.map((table) => <div className="exercise-solution-table" key={table.title}
            role="region" aria-label={table.title} tabIndex={0}>
            <table>
              <caption>{table.title}</caption>
              <thead><tr>{table.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
              <tbody>{table.rows.map((row) => <tr key={row[0]}>
                {row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th>
                  : <td key={index}>{cell}</td>)}
              </tr>)}</tbody>
            </table>
          </div>)}
          <h4>{vi ? 'Vì sao cách này đúng?' : 'Why this works'}</h4>
          <ol>{solution.explanation.map((step) => <li key={step}>{step}</li>)}</ol>
          <h4>{vi ? 'Lỗi thường gặp' : 'Common mistake'}</h4>
          <p>{solution.pitfall}</p>
          <h4>{vi ? 'Thử lại để hiểu bài' : 'Try again to check your understanding'}</h4>
          <p>{solution.practice}</p>
          <h4>{vi ? 'Chạy lời giải' : 'Run the solution'}</h4>
          <p>{solution.setup}</p>
          <pre tabIndex={0}><code>{solution.command}</code></pre>
          <ul className="exercise-solution-downloads">{solution.files.map((file) => <li key={file.name}>
            <a download={file.name.split('/').at(-1)}
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(file.content)}`}>
              {vi ? 'Tải' : 'Download'} {file.name} ↓
            </a>
          </li>)}</ul>
          <h4>{vi ? 'Mã mẫu' : 'Example code'}</h4>
          <details className="exercise-solution-file exercise-solution-primary">
            <summary>{vi ? 'Xem mã: ' : 'View code: '}{solution.files[0].name}</summary>
            <pre tabIndex={0} aria-label={vi ? 'Mã Python của lời giải' : 'Python solution code'}>
              <code>{solution.code}</code>
            </pre>
          </details>
          {solution.files.slice(1).map((file) => <details key={file.name} className="exercise-solution-file">
            <summary>{file.name}</summary>
            <pre tabIndex={0} aria-label={file.name}><code>{file.content}</code></pre>
          </details>)}
        </div>}
      </div>
    </> : <p className="muted">{vi
      ? 'Bài này chưa có bài giải mẫu. Bạn có thể dùng hướng dẫn và tiêu chí tự kiểm tra ở trên để đối chiếu bài làm.'
      : 'This exercise has no worked solution yet. Use the walkthrough and self-check criteria above to review your attempt.'}</p>}
  </section>
}
