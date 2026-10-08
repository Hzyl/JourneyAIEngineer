import type { Exercise } from '../api'
import { exerciseCopy, runStatus } from './exercise-copy'
import type { useExerciseActions } from './useExerciseActions'

type Props = {
  exercise: Exercise
  language: 'vi' | 'en'
  gitPublishAvailable: boolean
  actions: ReturnType<typeof useExerciseActions>
}

export function ExerciseWorkspace({ exercise, language, gitPublishAvailable, actions: a }: Props) {
  const t = exerciseCopy[language]
  const vi = language === 'vi'
  const busy = a.pending !== null
  const active = a.pending?.id === exercise.id ? a.pending.action : null
  const path = a.workspaces[exercise.id]?.path ?? exercise.workspace_path
  return <section className="exercise-workspace" aria-label={vi ? 'Thực hành trên máy' : 'Local practice'}>
    <h3>{vi ? 'Thực hành trên máy' : 'Local practice'}</h3>
    {!gitPublishAvailable && <p className="muted">{t.localOnly}</p>}
    {a.notice && <p className="success-note" role="status">{a.notice}</p>}
    {a.error && <p className="warning-note" role="alert">{a.error}</p>}
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
    {a.output && <section aria-label={t.output}>
      <h3>{t.output}</h3>
      <pre className="run-output">
        {a.output.assessment_kind === 'verified' ? t.runVerified : t.runReflection}
        {' · '}{runStatus(a.output.status, t)} · {a.output.duration_ms}ms{'\n\n'}{a.output.output}
      </pre>
    </section>}
    {a.publishTarget && <section className="publish-panel" aria-labelledby="publish-title">
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
  </section>
}
