import { useEffect, useRef } from 'react'
import type { Exercise } from '../api'
import { exerciseCopy } from './exercise-copy'
import { exerciseMaterial } from './exercise-materials'
import { ExerciseProse } from './ExerciseProse'
import { ExerciseWorkspace } from './ExerciseWorkspace'
import { ExerciseSolution } from './ExerciseSolution'
import { useExerciseActions } from './useExerciseActions'

type Props = {
  exercise: Exercise
  language: 'vi' | 'en'
  hosted: boolean
  gitPublishAvailable: boolean
  onBack: () => void
  onRefresh: () => Promise<void>
}

export function ExerciseDetail({ exercise, language, hosted, gitPublishAvailable, onBack, onRefresh }: Props) {
  const vi = language === 'vi'
  const t = exerciseCopy[language]
  const material = exerciseMaterial(exercise, language)
  const a = useExerciseActions(hosted, gitPublishAvailable, t, onRefresh)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [exercise.slug])

  return <article className="exercise-detail">
    <button className="exercise-back text-button" disabled={a.pending !== null} onClick={onBack}>
      ← {vi ? 'Danh sách bài tập' : 'All exercises'}
    </button>
    <header className="exercise-detail-header">
      <div className="exercise-meta">
        <span>{exercise.assessment_kind === 'verified' ? t.verified : t.reflection}</span>
        <span>{exercise.estimated_minutes} {t.minutes}</span>
      </div>
      <h2 ref={heading} tabIndex={-1}>{vi ? exercise.title_vi : exercise.title_en}</h2>
      <p>{material.summary}</p>
    </header>
    <nav className="exercise-section-links" aria-label={vi ? 'Trong bài tập này' : 'In this exercise'}>
      <a href="#exercise-task">{vi ? 'Đề bài' : 'Task'}</a>
      <a href="#exercise-walkthrough">{vi ? 'Hướng dẫn' : 'Walkthrough'}</a>
      <a href="#exercise-solution">{vi ? 'Bài giải' : 'Solution'}</a>
      <a href="#exercise-start">{vi ? 'File & cách chạy' : 'Files & setup'}</a>
    </nav>
    <div className="exercise-reading-layout">
      <div className="exercise-reading">
        <section aria-labelledby="exercise-task">
          <h3 id="exercise-task">01 · {vi ? 'Đề bài' : 'The task'}</h3>
          <ExerciseProse text={material.description} />
          {material.example && <pre tabIndex={0} aria-label={vi ? 'Ví dụ đầu vào và kết quả' : 'Example input and result'}>
            <code>{material.example}</code>
          </pre>}
        </section>
        <section aria-labelledby="exercise-walkthrough">
          <h3 id="exercise-walkthrough">02 · {vi ? 'Hướng dẫn làm bài' : 'How to approach it'}</h3>
          <ol className="exercise-steps">{material.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
        <section aria-labelledby="exercise-checks">
          <h3 id="exercise-checks">03 · {vi ? 'Tự kiểm tra kết quả' : 'Check your result'}</h3>
          <ul className="exercise-checks">{material.checks.map((check) => <li key={check}>{check}</li>)}</ul>
          {exercise.assessment_kind !== 'verified' && <p className="muted">{vi
            ? 'Bài này chưa có bộ chấm tự động. Dùng tiêu chí trên để giải thích và tự đánh giá bài làm.'
            : 'This lab has no automated assessment. Use the criteria above to explain and assess your work.'}</p>}
        </section>
        {material.hints.length > 0 && <details className="exercise-hints">
          <summary>{vi ? 'Cần gợi ý?' : 'Need a hint?'}</summary>
          <ul>{material.hints.map((hint) => <li key={hint}>{hint}</li>)}</ul>
        </details>}
        <ExerciseSolution key={exercise.slug} slug={exercise.slug} language={language} />
        {!hosted && <ExerciseWorkspace exercise={exercise} language={language}
          gitPublishAvailable={gitPublishAvailable} actions={a} />}
      </div>
      <aside className="exercise-setup" aria-labelledby="exercise-start">
        <h3 id="exercise-start">{vi ? 'Bắt đầu làm bài' : 'Start practising'}</h3>
        {material.files.length > 0 ? <>
          <p>{vi ? 'Cần Python 3.11+. Tải hai file vào cùng một thư mục; không cần Git hoặc cài package ngoài.'
            : 'Requires Python 3.11+. Save both files in one folder; no Git or third-party packages needed.'}</p>
          <ul className="exercise-files">{material.files.map((file) => <li key={file.name}>
            <a download={file.name} href={`data:text/plain;charset=utf-8,${encodeURIComponent(file.content)}`}>
              <strong>{file.name}</strong>
              <span>{vi ? 'Tải file ↓' : 'Download ↓'}</span>
            </a>
          </li>)}</ul>
          <p>{vi ? 'Sửa starter.py, sau đó chạy lệnh trong thư mục vừa lưu:'
            : 'Edit starter.py, then run this command in the folder where you saved both files:'}</p>
          <pre tabIndex={0} aria-label={vi ? 'Lệnh kiểm tra' : 'Test command'}>
            <code>python -m unittest -v test_exercise.py</code>
          </pre>
          <details className="exercise-source">
            <summary>{vi ? 'Xem code khởi đầu' : 'View starter code'}</summary>
            <pre tabIndex={0}><code>{material.files.find((file) => file.name === 'starter.py')?.content}</code></pre>
          </details>
        </> : <p>{vi
          ? 'Tạo file hoặc notebook cho bài làm của bạn. Bắt đầu với yêu cầu ở mục Đề bài và làm lần lượt theo hướng dẫn.'
          : 'Create a file or notebook for your work. Start with the task requirements and follow the steps in order.'}</p>}
        {hosted && <p className="exercise-platform-note">{vi
          ? 'Bạn có thể đọc toàn bộ hướng dẫn tại đây. Code được chạy bằng Python trên máy của bạn.'
          : 'Read the complete guide here. Run your code using Python on your own computer.'}</p>}
      </aside>
    </div>
  </article>
}
