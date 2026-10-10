import { LearningIllustration } from './LearningIllustration'
import { useCallback, useEffect, useRef, useState } from 'react'
import { learningClient as api } from '../platform/learning-client'
import { HostedJournalEditor, type HostedJournalApi, type HostedJournalEntry } from './HostedJournalEditor'
import { journalCopy } from './journal-copy'
import './journal-layout.css'

type ContextExport = { path: string; content: string }
type GitStatus = Awaited<ReturnType<typeof api.gitStatus>>
type Note = {
  id: number | string
  title: string
  body: string
  lesson_title_vi?: string
  lesson_title_en?: string
  updated_at: string
}

export function JournalView({ hosted, language, onExportContext }: {
  hosted: boolean
  language: 'vi' | 'en'
  onExportContext: (question: string) => Promise<ContextExport>
}) {
  const t = journalCopy[language]
  const [question, setQuestion] = useState('')
  const [git, setGit] = useState<GitStatus | null>(null)
  const [diff, setDiff] = useState('')
  const [suggested, setSuggested] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [cloudJournal, setCloudJournal] = useState<HostedJournalEntry[]>([])
  const [journalPath, setJournalPath] = useState('')
  const [context, setContext] = useState<ContextExport | null>(null)
  const [contextBusy, setContextBusy] = useState(false)
  const [contextCopied, setContextCopied] = useState(false)
  const [contextError, setContextError] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [journalError, setJournalError] = useState('')
  const contextPending = useRef(false)
  const exportPending = useRef(false)
  const load = useCallback(async () => {
    setLoading(true)
    setJournalError('')
    try {
      if (hosted) {
        const cloudApi = api as unknown as HostedJournalApi
        const [nextNotes, nextJournal] = await Promise.all([api.notes(), cloudApi.journalEntries()])
        setNotes(nextNotes.notes)
        setCloudJournal(nextJournal.entries)
      } else {
        const [nextGit, nextNotes, nextDiff, nextSuggested] = await Promise.all([
          api.gitStatus(), api.notes(), api.gitDiff(), api.suggestedCommit(),
        ])
        setGit(nextGit)
        setNotes(nextNotes.notes)
        setDiff(nextDiff.diff)
        setSuggested(nextSuggested.message)
      }
    } catch (cause) {
      setJournalError(cause instanceof Error ? cause.message : t.loadError)
    } finally {
      setLoading(false)
    }
  }, [hosted, t.loadError])

  const copy = async (result: ContextExport) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard-unavailable')
      await navigator.clipboard.writeText(result.content)
      setContextCopied(true)
      setContextError('')
    } catch {
      setContextError(t.clipboardError)
    }
  }
  const createContext = async () => {
    if (contextPending.current) return
    contextPending.current = true
    setContextBusy(true)
    setContextError('')
    setContextCopied(false)
    try {
      const result = await onExportContext(question.trim() || t.defaultQuestion)
      setContext(result)
      await copy(result)
    } catch (cause) {
      setContextError(cause instanceof Error ? cause.message : t.contextError)
    } finally {
      contextPending.current = false
      setContextBusy(false)
    }
  }
  const exportJournal = async () => {
    if (exportPending.current) return
    exportPending.current = true
    setExporting(true)
    setJournalPath('')
    setJournalError('')
    try {
      const result = await api.exportJournal()
      setJournalPath(result.path)
    } catch (cause) {
      setJournalError(cause instanceof Error ? cause.message : t.exportError)
    } finally {
      exportPending.current = false
      setExporting(false)
    }
  }
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const refreshButton = <button className="text-button" disabled={loading} aria-busy={loading}
    onClick={() => void load()}>{loading ? t.loading : t.refresh}</button>

  return <div>
    <LearningIllustration name="journal" />
    <div className="page-intro">
      <div>
        <span className="eyebrow accent">{language === 'vi' ? 'GHI LẠI VIỆC HỌC' : 'EVIDENCE LOG'}</span>
        <h2>{t.heading}<br /><em>{hosted ? t.synced : t.local}</em></h2>
      </div>
      <p>{hosted ? t.introCloud : t.introLocal}</p>
    </div>
    {journalError && <p className="warning-note" role="alert">{journalError}</p>}
    <div className="journal-grid">
      <section className="section-card journal-card">
        <div className="section-heading">
          <div><span className="eyebrow">{language === 'vi' ? 'NHÌN LẠI MỖI TUẦN' : 'WEEKLY REFLECTION'}</span><h3>{t.weekly}</h3></div>
          <span className="tag">Markdown</span>
        </div>
        <p>{hosted ? t.exportCloud : t.exportLocal}</p>
        <button className="primary-button" disabled={exporting} aria-busy={exporting}
          onClick={() => void exportJournal()}>{exporting ? t.exporting : t.export}</button>
        {journalPath && <p className="success-note" role="status">{t.created} {journalPath}</p>}
      </section>
      {hosted && <HostedJournalEditor entries={cloudJournal} language={language} onSaved={async (payload) => {
        const saved = await (api as unknown as HostedJournalApi).upsertJournalEntry(payload)
        setCloudJournal((current) => [saved, ...current.filter((item) => item.week_start !== saved.week_start)])
      }} />}
      <section className="section-card ask-card">
        <div className="section-heading">
          <div><span className="eyebrow">{language === 'vi' ? 'CHUẨN BỊ CÂU HỎI' : 'CONTEXT BRIDGE'}</span><h3>{t.ask}</h3></div>
          <span className="tag">{t.noKey}</span>
        </div>
        <p>{t.contextInfo}</p>
        <textarea aria-label={t.question} value={question} disabled={contextBusy}
          onChange={(event) => { setQuestion(event.target.value); setContextCopied(false) }}
          placeholder={t.questionHint} />
        <button className="secondary-button" disabled={contextBusy} aria-busy={contextBusy}
          onClick={() => void createContext()}>{contextBusy ? t.creating : t.create}</button>
        {contextError && <p className="warning-note" role="alert">{contextError}</p>}
        {context && <section className="context-result" aria-live="polite">
          <div className="section-heading">
            <div><span className="eyebrow accent">{language === 'vi' ? 'NỘI DUNG ĐÃ SẴN SÀNG' : 'CONTEXT READY'}</span><h4>{t.context}</h4></div>
            <button className="text-button" onClick={() => void copy(context)}>
              {contextCopied ? t.copied : t.copy}
            </button>
          </div>
          <textarea className="context-preview" aria-label={t.context} readOnly value={context.content}
            onFocus={(event) => event.currentTarget.select()} />
          <small className="context-path">{t.savedAt} {context.path}</small>
        </section>}
      </section>
    </div>
    <section className="section-card notes-card">
      <div className="section-heading">
        <div><span className="eyebrow">{language === 'vi' ? 'ĐIỀU BẠN GHI LẠI' : 'YOUR NOTES'}</span><h3>{t.notes}</h3></div>
        {refreshButton}
      </div>
      {notes.length ? <div className="saved-notes">
        {notes.slice(0, 12).map((note) => <article className="saved-note" key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.body}</p>
          <small>
            {(language === 'vi' ? note.lesson_title_vi : note.lesson_title_en)
              ?? note.lesson_title_vi ?? t.general}
            {' · '}{new Date(note.updated_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
          </small>
        </article>)}
      </div> : <p className="muted">{loading ? t.loading : t.empty}</p>}
    </section>
    {!hosted && <section className="section-card git-card">
      <div className="section-heading">
        <div><span className="eyebrow">{language === 'vi' ? 'KHO MÃ TRÊN MÁY' : 'LOCAL REPOSITORY'}</span>
          <h3>{language === 'vi' ? 'Trạng thái Git' : 'Git snapshot'}</h3></div>
        {refreshButton}
      </div>
      {git ? <div className="git-details">
        <div><span>{t.branch}</span><strong>{git.branch || t.noBranch}</strong></div>
        <div><span>{t.lastCommit}</span><strong>{git.last_commit || t.noCommit}</strong></div>
        <div><span>{t.remote}</span><strong>{git.remote || t.noRemote}</strong></div>
      </div> : <p className="muted">{loading ? t.gitLoading : t.gitUnavailable}</p>}
      <p className="muted">{t.suggested} <code>{suggested}</code></p>
      <pre className="git-output">{git?.status || t.clean}</pre>
      <details>
        <summary>{t.diff}</summary>
        <pre className="git-output">{diff || t.noDiff}</pre>
      </details>
    </section>}
  </div>
}
