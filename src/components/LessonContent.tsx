import type { Lesson } from '../api'
import { StudyStepAccordion } from './StudyStepAccordion'

type ContentProps = { lesson: Lesson; language: 'vi' | 'en' }
type NavigationProps = { onOpenLesson: (slug: string) => void; nextLessonTitles: Record<string, string> }

export function LessonReading({ lesson, language }: ContentProps) {
  const vi = language === 'vi'
  const guide = lesson.guide ?? lesson
  const steps = vi ? guide.study_steps_vi : guide.study_steps_en
  const plan = guide.practice_plan?.[language]
  return <>
    <section id="overview-objectives" className="detail-section lesson-section lesson-section-overview"
      aria-labelledby="lesson-overview-title" tabIndex={-1}>
      <h2 id="lesson-overview-title">{vi ? 'Sau bài này, bạn sẽ làm được gì?' : 'Learning outcomes'}</h2>
      <ul>{lesson.objectives[language].map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
    <section id="concept" className="detail-section lesson-section lesson-section-concept"
      aria-labelledby="lesson-concept-title" tabIndex={-1}>
      <h2 id="lesson-concept-title">{vi ? 'Kiến thức cần nắm' : 'Concept notes'}</h2>
      <div className="concept-notes">
        {(vi ? lesson.concept_notes_vi : lesson.concept_notes_en).split(/\n+/).filter(Boolean)
          .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {lesson.formulas.length > 0 && <div className="formula-list"
        aria-label={vi ? 'Công thức liên quan' : 'Related formulas'}>
        {lesson.formulas.map((formula) => <code key={formula}>{formula}</code>)}
      </div>}
    </section>
    <section id="practice" className="lesson-playbook lesson-section lesson-section-practice"
      aria-labelledby="lesson-playbook-title" tabIndex={-1}>
      <div className="playbook-intro">
        <span className="eyebrow accent">02 · {vi ? 'CÁCH THỰC HÀNH' : 'PRACTICE PLAYBOOK'}</span>
        <h2 id="lesson-playbook-title">{vi ? 'Các bước thực hành'
          : 'Follow a repeatable study process'}</h2>
        <p>{vi ? guide.why_it_matters_vi : guide.why_it_matters_en}</p>
      </div>
      <ol className="study-step-list">{steps.map((step, index) =>
        <StudyStepAccordion key={`${lesson.slug}-${index}`} step={step} index={index}
          lesson={lesson} language={language} />)}
      </ol>
      {plan && <div className="practice-plan-grid">
        <article className="practice-plan">
          <span className="eyebrow">{vi ? 'THỰC HÀNH' : 'PRACTICE'}</span>
          <strong>{plan.task}</strong>
          <h3>{vi ? 'Kết quả cần lưu lại' : 'Evidence to save'}</h3>
          <ul>{(plan.deliverables ?? []).map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="practice-plan checkpoint">
          <span className="eyebrow">{vi ? 'TỰ KIỂM TRA' : 'CHECKPOINT'}</span>
          <strong>{plan.checkpoint}</strong>
          {plan.stretch && <>
            <h3>{vi ? 'Thử thách thêm' : 'Stretch task'}</h3>
            <p>{plan.stretch}</p>
          </>}
        </article>
      </div>}
    </section>
    {lesson.code_examples.length > 0 && <section
      className="detail-section lesson-section lesson-section-practice" aria-labelledby="lesson-code-title">
      <h2 id="lesson-code-title">{vi ? 'Ví dụ mã nguồn' : 'Code examples'}</h2>
      {lesson.code_examples.map((example) => <div className="code-example" key={example.title}>
        <strong>{example.title}</strong>
        <pre tabIndex={0} aria-label={example.title}><code>{example.code}</code></pre>
        <p className="muted">{vi ? example.explanation_vi : example.explanation_en}</p>
      </div>)}
    </section>}
  </>
}

export function LessonChecks({ lesson, language, checked, nudge, onToggle, onOpenLesson, nextLessonTitles }:
  ContentProps & NavigationProps & { checked: boolean[]; nudge: boolean; onToggle: (index: number) => void }) {
  const vi = language === 'vi'
  const questions = (lesson.guide ?? lesson).interview_questions?.[language] ?? []
  return <>
    <section id="check" className="detail-section lesson-section lesson-section-check"
      aria-labelledby="lesson-check-title" tabIndex={-1}>
      <h2 id="lesson-check-title">{vi ? 'Kiểm tra mức độ hiểu bài' : 'Check understanding'}</h2>
      <div className="lesson-check-block">
        <h3>{vi ? 'Kiến thức cần có và tiêu chí hoàn thành' : 'Prerequisites and completion criteria'}</h3>
        {lesson.prerequisites.length > 0 && <ul>{lesson.prerequisites.map((item) => <li key={item}>
          {nextLessonTitles[item] ? <button className="text-button" onClick={() => onOpenLesson(item)}>
            {nextLessonTitles[item]}
          </button> : item}
        </li>)}</ul>}
        <ul>{lesson.completion_criteria.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      {lesson.common_mistakes.length > 0 && <div className="lesson-check-block">
        <h3>{vi ? 'Lỗi thường gặp' : 'Common mistakes'}</h3>
        <ul>{lesson.common_mistakes.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>}
    </section>
    <section className="detail-section lesson-section lesson-section-check" aria-labelledby="lesson-checklist-title">
      <h2 id="lesson-checklist-title">{vi ? 'Những việc cần hoàn thành' : 'Practice checklist'}</h2>
      <div className="checklist">{lesson.checklist.map((item, index) => <label key={index}>
        <input type="checkbox" checked={checked[index] ?? false} onChange={() => onToggle(index)} />
        <span className={checked[index] ? 'checked-item' : ''}>{item}</span>
      </label>)}</div>
      {nudge && <p className="warning-note" role="status">{vi
        ? 'Hãy làm đủ các mục bên trên trước khi đánh dấu hoàn thành bài học.'
        : 'Finish every checklist item before marking this lesson complete.'}</p>}
      {questions.length > 0 && <div className="interview-questions">
        <h3>{vi ? 'Câu hỏi phỏng vấn cần tự trả lời' : 'Interview questions to answer aloud'}</h3>
        <ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
      </div>}
      {lesson.reviews.length > 0 && <div className="lesson-review-list">
        <h3>{vi ? 'Câu hỏi tự kiểm tra' : 'Self-check questions'}</h3>
        {lesson.reviews.map((review) => <div className="review-prompt" key={review.id}>
          <p>{vi ? review.question_vi : review.question_en}</p>
          <details>
            <summary>{vi ? 'Hiện gợi ý đáp án' : 'Show answer hint'}</summary>
            <p>{vi ? review.answer_vi : review.answer_en}</p>
          </details>
        </div>)}
      </div>}
    </section>
  </>
}

export function LessonRelated({ lesson, language, onOpenExercise, onOpenLesson, nextLessonTitles }:
  ContentProps & NavigationProps & { onOpenExercise: (slug: string) => void }) {
  const vi = language === 'vi'
  return <>
    <section className="detail-section lesson-section lesson-section-practice" aria-labelledby="lesson-exercise-title">
      <h2 id="lesson-exercise-title">{vi ? 'Bài tập liên quan' : 'Practice exercise'}</h2>
      {lesson.exercises.length > 0 ? <>
        <p className="muted">{vi ? 'Mở đề bài, hướng dẫn và bài giải tham khảo ngay trong app.'
          : 'Open the task, guide and available reference solution here in the app.'}</p>
        {lesson.exercises.map((exercise) => <div className="linked-exercise" key={exercise.slug}>
          <div>
            <strong>{vi ? exercise.title_vi : exercise.title_en}</strong>
            <small>{exercise.estimated_minutes} {vi ? 'phút thực hành' : 'min practice'}</small>
          </div>
          <button className="secondary-button" onClick={() => onOpenExercise(exercise.slug)}
            aria-label={`${vi ? 'Mở bài tập' : 'Open exercise'}: ${vi ? exercise.title_vi : exercise.title_en}`}>
            {vi ? 'Xem đề & hướng dẫn' : 'Read task & guide'} →
          </button>
        </div>)}
      </> : <p className="muted">{vi ? 'Chưa có bài tập riêng cho bài học này.'
        : 'No dedicated exercise is linked yet.'}</p>}
    </section>
    {lesson.next_lessons.length > 0 && <section
      className="detail-section lesson-section lesson-section-completion" aria-labelledby="lesson-next-title">
      <h2 id="lesson-next-title">{vi ? 'Bài tiếp theo' : 'Next lessons'}</h2>
      <div className="next-lesson-list">{lesson.next_lessons.map((slug) =>
        <button className="text-button" key={slug} onClick={() => onOpenLesson(slug)}>
          {nextLessonTitles[slug] ?? slug} →
        </button>)}
      </div>
    </section>}
  </>
}

export function LessonResources({ lesson, language }: ContentProps) {
  const vi = language === 'vi'
  return <section id="resources" className="detail-section rich-resources lesson-section lesson-section-resources"
    aria-labelledby="lesson-resources-title" tabIndex={-1}>
    <h2 id="lesson-resources-title">{vi ? 'Tài liệu có hướng dẫn đọc' : 'Guided resources'}</h2>
    {!lesson.resources.length && <p className="muted">{vi ? 'Chưa có tài liệu bổ sung cho bài học này.'
      : 'No additional resources are linked to this lesson yet.'}</p>}
    <div className="rich-resource-list">{lesson.resources.map((resource, index) => {
      const internal = resource.kind === 'in_app' || !resource.url
      const content = <>
        <div className="resource-heading">
          <span className="resource-language">{resource.language === 'en' ? 'EN' : 'VI'}</span>
          <strong>{resource.title}</strong>
          {internal ? <span className="resource-required">{vi ? 'Đọc trong app' : 'In-app'}</span>
            : resource.required && <span className="resource-required">{vi ? 'Bắt buộc' : 'Required'}</span>}
        </div>
        <p>{vi ? resource.purpose_vi : resource.purpose_en}</p>
        <small>{vi ? resource.read_vi : resource.read_en}</small>
      </>
      return internal ? <article className="lesson-resource resource-internal" key={index}>{content}</article>
        : <a className="lesson-resource resource-link" href={resource.url} target="_blank" rel="noreferrer" key={index}>
          {content}
          <code className="resource-url">{resource.url}</code>
          <b>{vi ? 'Mở tài liệu' : 'Open resource'} ↗</b>
        </a>
    })}</div>
  </section>
}
