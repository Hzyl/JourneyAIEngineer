import { useState } from 'react'
import type { Exercise } from '../api'
import { exerciseCopy, runStatus } from './exercise-copy'
import { useExerciseActions } from './useExerciseActions'

type Props = {
  exercises: Exercise[]
  gitPublishAvailable: boolean
  hosted: boolean
  language: 'vi' | 'en'
  onRefresh: () => Promise<void>
}

export function ExercisesView({ exercises, gitPublishAvailable, hosted, language, onRefresh }: Props) {
  const t = exerciseCopy[language]
  const vi = language === 'vi'
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const a = useExerciseActions(hosted, gitPublishAvailable, t, onRefresh)
  const busy = a.pending !== null
  const visible = exercises.filter((exercise) => {
    const text = [exercise.title_vi, exercise.title_en, exercise.description_vi, exercise.description_en].join(' ')
    return text.toLowerCase().includes(query.trim().toLowerCase())
      && (difficulty === 'all' || exercise.difficulty.toLowerCase() === difficulty)
  })

  return <div>
    <div className="page-intro">
      <div>
        <span className="eyebrow accent">{hosted ? 'PRACTICE BRIEF' : 'PRACTICE LAB'}</span>
        <h2>{hosted ? t.webTitle : t.title}<br /><em>{hosted ? t.webEmphasis : t.emphasis}</em></h2>
      </div>
      <p>{hosted ? t.webIntro : t.intro}</p>
    </div>
    {hosted && <p className="warning-note" role="status">{t.webBoundary}</p>}
    {!hosted && !gitPublishAvailable && <p className="warning-note" role="status">{t.localOnly}</p>}
    {!hosted && <div className="workspace-flow">
      {t.steps.map((step, index) => <div key={index}>
        <span>0{index + 1}</span>
        <strong>{step}</strong>
        <small>{t.stepHints[index]}</small>
      </div>)}
    </div>}
    <div className="filter-bar">
      <input aria-label={t.search} value={query} placeholder={`${t.search}…`}
        onChange={(event) => setQuery(event.target.value)} />
      <select aria-label={t.difficulty} value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
        <option value="all">{t.all}</option>
        <option value="easy">{t.easy}</option>
        <option value="medium">{t.medium}</option>
        <option value="hard">{t.hard}</option>
      </select>
      <span className="muted">{visible.length}/{exercises.length} {t.count}</span>
    </div>
    {a.notice && <p className="success-note" role="status">{a.notice}</p>}
    {a.error && <p className="warning-note" role="alert">{a.error}</p>}
    {!visible.length && <p className="muted" role="status">{t.empty}</p>}
    <div className="exercise-grid">
      {visible.map((exercise) => {
        const active = a.pending?.id === exercise.id ? a.pending.action : null
        const path = a.workspaces[exercise.id]?.path ?? exercise.workspace_path
        return <article className="exercise-card" key={exercise.slug}>
          <div className="exercise-top">
            <span className="tag">{exercise.assessment_kind === 'verified' ? t.verified : t.reflection}</span>
            <span>{exercise.estimated_minutes} {t.minutes}</span>
          </div>
          <h3>{vi ? exercise.title_vi : exercise.title_en}</h3>
          <p>{vi ? exercise.description_vi : exercise.description_en}</p>
          {hosted ? <a className="resource-link" target="_blank" rel="noreferrer"
            href="https://github.com/Hzyl/JourneyAIEngineer/blob/main/docs/QUICKSTART-WINDOWS.md">
            {t.guide} <span aria-hidden="true">↗</span>
          </a> : <>
            <div className="exercise-actions workspace-actions">
              <button className="secondary-button" disabled={busy} aria-busy={active === 'open'}
                onClick={() => void a.open(exercise)}>
                {active === 'open' ? t.opening : a.workspaceId(exercise) ? t.open : t.create}
              </button>
              <button className="text-button" disabled={busy} aria-busy={active === 'folder'}
                onClick={() => void a.folder(exercise)}>{active === 'folder' ? t.opening : t.folder}</button>
              <button className="secondary-button" disabled={busy} aria-busy={active === 'run'}
                onClick={() => void a.run(exercise)}>{active === 'run' ? t.running : t.run}</button>
              <button className="text-button" disabled={busy || !gitPublishAvailable} aria-busy={active === 'export'}
                onClick={() => void a.exportArtifact(exercise)}>{active === 'export' ? t.exporting : t.export}</button>
              <button className="text-button" disabled={busy} aria-busy={active === 'history'}
                onClick={() => void a.loadHistory(exercise)}>{active === 'history' ? t.loading : t.history}</button>
            </div>
            {path && <small className="path-label">Workspace: {path}</small>}
            {a.exportedPaths[exercise.id] && <p className="artifact-path">
              Artifact: <code>{a.exportedPaths[exercise.id]}</code>
            </p>}
            {a.historyFor === exercise.id && <div className="run-history">
              {a.history[exercise.id]?.length ? a.history[exercise.id].slice(0, 5).map((run) => <p key={run.id}>
                <strong>{runStatus(run.status, t)}</strong> · {run.duration_ms}ms · {' '}
                {new Date(run.created_at).toLocaleString(vi ? 'vi-VN' : 'en-US')}
              </p>) : <p className="muted">{t.noRuns}</p>}
            </div>}
          </>}
        </article>
      })}
    </div>
    {!hosted && a.output && <section aria-label={t.output}>
      <h3>{t.output}</h3>
      <pre className="run-output">
        {a.output.assessment_kind === 'verified' ? t.runVerified : t.runReflection}
        {' · '}{runStatus(a.output.status, t)} · {a.output.duration_ms}ms{'\n\n'}{a.output.output}
      </pre>
    </section>}
    {!hosted && a.publishTarget && <section className="publish-panel" aria-labelledby="publish-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow accent">GITHUB CHECKPOINT</span>
          <h3 id="publish-title">{t.publishTitle}</h3>
        </div>
        <button className="text-button" disabled={busy} onClick={a.cancelPublish}>{t.cancel}</button>
      </div>
      <p>{t.publishInfo}</p>
      <p><code>{a.publishTarget.path}</code></p>
      <label>{t.commit}
        <input value={a.publishMessage} disabled={busy} maxLength={120}
          onChange={(event) => { a.setPublishMessage(event.target.value); a.setPublishConfirmed(false) }} />
      </label>
      <pre className="publish-preview">
        git add {a.publishTarget.path}{'\n'}git commit -m "{a.publishMessage}"{'\n'}git push origin &lt;current-branch&gt;
      </pre>
      <label className="publish-confirm">
        <input type="checkbox" checked={a.publishConfirmed} disabled={busy}
          onChange={(event) => a.setPublishConfirmed(event.target.checked)} />
        {t.confirm}
      </label>
      <button className="primary-button" aria-busy={a.pending?.action === 'publish'}
        disabled={busy || !gitPublishAvailable || !a.publishConfirmed || a.publishMessage.trim().length < 5}
        onClick={() => void a.publish()}>{a.pending?.action === 'publish' ? t.publishing : t.publish}</button>
    </section>}
  </div>
}
