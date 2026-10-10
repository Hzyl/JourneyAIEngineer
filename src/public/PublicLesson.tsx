import { illustrationForLesson } from '../components/learning-illustrations'
import { LearningIllustration } from '../components/LearningIllustration'
import type { CatalogLesson } from '../platform/hosted/catalog'

type Props = {
  lesson: CatalogLesson
  language: 'vi' | 'en'
  onSignIn: () => void
}

export function PublicLesson({ lesson, language, onSignIn }: Props) {
  const vi = language === 'vi'
  const practice = lesson.practice_plan[language]
  const concept = vi ? lesson.concept_notes_vi : lesson.concept_notes_en
  const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
  const conceptParagraphs = concept.split(/\n+/).map((text) => text.trim()).filter(Boolean)
  const conceptTexts = new Set([concept, ...conceptParagraphs].map(normalize))
  return <article className="public-lesson">
    <span className="eyebrow">{vi ? 'BÀI HỌC MẪU · ĐÃ RÀ SOÁT NỘI DUNG' : 'SAMPLE LESSON · REVIEWED CONTENT'}</span>
    <h1>{vi ? lesson.title_vi : lesson.title_en}</h1>
    <p className="public-lead">{vi ? lesson.summary_vi : lesson.summary_en}</p>
    <p className="public-footnote">{lesson.estimated_minutes} {vi ? 'phút đọc dự kiến · thực hành theo nhịp riêng'
      : 'estimated reading minutes · practise at your own pace'}</p>
    <LearningIllustration name={illustrationForLesson(lesson.lesson_id)} variant="section" />
    <section>
      <h2>{vi ? 'Sau bài này' : 'After this lesson'}</h2>
      <ul>{(vi ? lesson.learning_objectives : lesson.learning_objectives_en).map((item) => <li key={item}>
        {item}
      </li>)}</ul>
      <div className="public-prose">{conceptParagraphs
        .map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </section>
    <section>
      <h2>{vi ? 'Thử trên máy của bạn' : 'Try it on your computer'}</h2>
      {lesson.code_examples.map((example) => <div className="public-example" key={example.title}>
        <h3>{example.title}</h3>
        {(vi ? example.explanation_vi : example.explanation_en).split(/\n+/)
          .map((text) => text.trim()).filter(Boolean)
          .filter((paragraph) => !conceptTexts.has(normalize(paragraph)))
          .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <p className="public-footnote">{example.setup}</p>
        <pre tabIndex={0} aria-label={vi ? 'Mã ví dụ' : 'Example code'}><code>{example.code}</code></pre>
        <p><strong>{vi ? 'Kết quả mong đợi: ' : 'Expected result: '}</strong>{example.expected_output}</p>
        <p><strong>{vi ? 'Tình huống cần kiểm tra: ' : 'Check this edge case: '}</strong>
          {vi ? example.edge_case_vi : example.edge_case_en}</p>
      </div>)}
    </section>
    <section className="public-practice">
      <h2>{vi ? 'Tự làm và lưu kết quả' : 'Create your first learning artifact'}</h2>
      <p>{practice.task}</p>
      <ul>{practice.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
      <p><strong>{vi ? 'Cách tự kiểm tra: ' : 'Checkpoint: '}</strong>{practice.checkpoint}</p>
      <p className="public-footnote">{vi ? 'Không cần Git. Lưu mã nguồn và kết quả chạy trong một thư mục trên máy của bạn.'
        : 'No Git required. Save the code and its output in your own folder.'}</p>
    </section>
    <section>
      <h2>{vi ? 'Tự kiểm tra' : 'Check your understanding'}</h2>
      {lesson.review_cards.map((card) => <details className="public-question" key={card.id}>
        <summary>{vi ? card.question_vi : card.question_en}</summary>
        <p>{vi ? card.answer_vi : card.answer_en}</p>
      </details>)}
    </section>
    <section>
      <h2>{vi ? 'Đọc thêm tài liệu gốc' : 'Read the original sources'}</h2>
      <ul>{lesson.resources.filter((resource) => resource.url).map((resource) => <li key={resource.url}>
        <a href={resource.url} target="_blank" rel="noreferrer">{resource.title} ↗</a>
      </li>)}</ul>
    </section>
    <section className="public-save">
      <h2>{vi ? 'Lưu lại tiến độ học' : 'Keep your learning momentum'}</h2>
      <p>{vi ? 'Tạo tài khoản để lưu tiến độ, ghi chú và lịch ôn. Bạn vẫn có thể đọc bài mà không đăng nhập.'
        : 'Create an account to save progress, notes and reviews. Reading stays available without signing in.'}</p>
      <button className="public-primary" onClick={onSignIn}>{vi ? 'Đăng nhập để lưu' : 'Sign in to save'}</button>
    </section>
  </article>
}
