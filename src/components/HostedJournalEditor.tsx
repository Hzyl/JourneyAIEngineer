import { useRef, useState } from 'react'
import { journalCopy } from './journal-copy'

export type HostedJournalEntry = {
  id: string
  week_start: string
  title: string
  body: string
  created_at: string
  updated_at: string
}
export type JournalPayload = Pick<HostedJournalEntry, 'week_start' | 'title' | 'body'>
export type HostedJournalApi = {
  journalEntries: () => Promise<{ entries: HostedJournalEntry[] }>
  upsertJournalEntry: (payload: JournalPayload) => Promise<HostedJournalEntry>
}

export function HostedJournalEditor({ entries, language, onSaved }: {
  entries: HostedJournalEntry[]
  language: 'vi' | 'en'
  onSaved: (payload: JournalPayload) => Promise<void>
}) {
  const t = journalCopy[language]
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7))
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}`
      + `-${String(monday.getDate()).padStart(2, '0')}`
  })
  const [title, setTitle] = useState(language === 'vi' ? 'Tổng kết tuần' : 'Weekly reflection')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const submitting = useRef(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const save = async () => {
    if (submitting.current) return
    setError('')
    setSaved(false)
    if (!title.trim() || !body.trim()) {
      setError(t.required)
      return
    }
    submitting.current = true
    setBusy(true)
    try {
      await onSaved({ week_start: weekStart, title, body })
      setSaved(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.saveError)
    } finally {
      submitting.current = false
      setBusy(false)
    }
  }
  return <section className="section-card journal-card">
    <div className="section-heading">
      <div><span className="eyebrow">CLOUD JOURNAL</span><h3>{t.cloudTitle}</h3></div>
      <span className="tag">{t.private}</span>
    </div>
    <p className="muted">{t.cloudInfo}</p>
    <label>{t.week}
      <input type="date" value={weekStart} disabled={busy}
        onChange={(event) => { setWeekStart(event.target.value); setSaved(false) }} />
    </label>
    <label>{t.title}
      <input maxLength={200} value={title} disabled={busy}
        onChange={(event) => { setTitle(event.target.value); setSaved(false) }} />
    </label>
    <label>{t.reflection}
      <textarea maxLength={50_000} value={body} disabled={busy} placeholder={t.reflectionHint}
        onChange={(event) => { setBody(event.target.value); setSaved(false) }} />
    </label>
    <button className="secondary-button" disabled={busy} aria-busy={busy} onClick={() => void save()}>
      {busy ? t.syncing : t.save}
    </button>
    {saved && <p className="success-note" role="status">{t.saved}</p>}
    {error && <p className="warning-note" role="alert">{error}</p>}
    {entries.length > 0 && <details>
      <summary>{entries.length} {t.entries}</summary>
      <div className="saved-notes">
        {entries.slice(0, 6).map((entry) => <article className="saved-note" key={entry.id}>
          <strong>{entry.title}</strong>
          <p>{entry.body}</p>
          <small>{t.weekFrom} {entry.week_start}</small>
        </article>)}
      </div>
    </details>}
  </section>
}
