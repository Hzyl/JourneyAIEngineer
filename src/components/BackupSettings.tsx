import { useEffect, useRef, useState } from 'react'
import type { BackupPayload } from '../api'
import { learningClient as api } from '../platform/learning-client'
import { backupWarning } from './backup-copy'
import './backup-settings.css'

type Preview = Awaited<ReturnType<typeof api.previewBackup>>
type Operation = 'export' | 'preview' | 'import'

export function BackupSettings({ language, onRestored }: {
  language: 'vi' | 'en'
  onRestored: () => Promise<void>
}) {
  const vi = language === 'vi'
  const [text, setText] = useState('')
  const currentText = useRef('')
  const [review, setReview] = useState<{ source: string; payload: BackupPayload; result: Preview } | null>(null)
  const [pending, setPending] = useState<Operation | null>(null)
  const inFlight = useRef(false)
  const mounted = useRef(true)
  const [error, setError] = useState<Operation | 'reload' | null>(null)
  const [receipt, setReceipt] = useState<{ kind: 'export' | 'import'; path: string } | null>(null)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const replaceText = (value: string) => {
    currentText.current = value
    setText(value)
    setReview(null)
    setReceipt(null)
    setError(null)
  }
  const begin = (operation: Operation) => {
    if (inFlight.current) return false
    inFlight.current = true
    setPending(operation)
    setReview(null)
    setReceipt(null)
    setError(null)
    return true
  }
  const finish = () => {
    inFlight.current = false
    if (mounted.current) setPending(null)
  }
  const exportBackup = async () => {
    if (!begin('export')) return
    try {
      const result = await api.exportBackup()
      if (!mounted.current) return
      const source = JSON.stringify(result.payload, null, 2)
      replaceText(source)
      const url = URL.createObjectURL(new Blob([source], { type: 'application/json' }))
      try {
        const link = document.createElement('a')
        link.href = url
        link.download = 'journey-ai-engineer-backup.json'
        link.click()
      } finally { window.setTimeout(() => URL.revokeObjectURL(url), 1000) }
      setReceipt({ kind: 'export', path: result.json_path })
    } catch { if (mounted.current) setError('export') }
    finally { finish() }
  }
  const previewBackup = async () => {
    if (!text.trim() || !begin('preview')) return
    const source = currentText.current
    try {
      const payload = JSON.parse(source) as BackupPayload
      const result = await api.previewBackup(payload)
      if (mounted.current && source === currentText.current) setReview({ source, payload, result })
    } catch { if (mounted.current) setError('preview') }
    finally { finish() }
  }
  const ready = Boolean(review?.result.valid && review.source === text)
  const importBackup = async () => {
    if (inFlight.current || !ready || !review) return
    if (!window.confirm(vi
      ? 'Nhập bản sao lưu sẽ thay thế tiến độ, lịch ôn, lịch sử ôn, ghi chú, phiên học và cài đặt. Tệp nhật ký trùng tên sẽ bị ghi đè. Ứng dụng tạo bản sao an toàn trước khi nhập. Tiếp tục?'
      : 'Import replaces progress, review schedules/history, notes, sessions and settings. Matching journal files are overwritten. A safety backup is created first. Continue?')) return
    const payload = review.payload
    if (!begin('import')) return
    try {
      const result = await api.importBackup(payload)
      if (!mounted.current) return
      setReceipt({ kind: 'import', path: result.safety_backup_json })
      try { await onRestored() }
      catch { if (mounted.current) setError('reload') }
    } catch { if (mounted.current) setError('import') }
    finally { finish() }
  }
  const labels: Record<string, string> = vi
    ? { progress: 'Tiến độ bài học', review_state: 'Lịch ôn', review_history: 'Lượt ôn', notes: 'Ghi chú',
      study_sessions: 'Phiên học', journal_files: 'Tệp nhật ký' }
    : { progress: 'Lesson progress', review_state: 'Review schedules', review_history: 'Review history', notes: 'Notes',
      study_sessions: 'Study sessions', journal_files: 'Journal files' }
  const errors = vi ? {
    export: 'Chưa xuất được bản sao lưu. Hãy thử lại.',
    preview: 'Chưa kiểm tra được bản sao lưu. Kiểm tra JSON và thử lại; nội dung vẫn còn.',
    import: 'Chưa nhập được bản sao lưu. Nội dung vẫn còn; hãy kiểm tra lại trước khi thử nhập.',
    reload: 'Đã nhập thành công, nhưng chưa tải lại được màn hình. Hãy tải lại trang; không cần nhập lần nữa.',
  } : {
    export: 'Could not export the backup. Please retry.',
    preview: 'Could not preview the backup. Check the JSON and retry; your text is preserved.',
    import: 'Could not import the backup. Your text is preserved; preview it again before retrying.',
    reload: 'Import succeeded, but the screen could not reload. Refresh the app; do not import again.',
  }
  return <section className="section-card backup-card">
    <span className="eyebrow">{vi ? 'SAO LƯU CÓ THỂ CHUYỂN MÁY' : 'PORTABLE BACKUP'}</span>
    <h3>{vi ? 'Sao lưu và khôi phục' : 'Backup and restore'}</h3>
    <p className="muted">{vi
      ? 'Chuyển tiến độ, lịch ôn, ghi chú, nhật ký và cài đặt sang máy khác. Bản sao lưu không chứa toàn bộ cơ sở dữ liệu hay thư mục bài tập. Tệp này có nội dung riêng tư.'
      : 'Move progress, reviews, notes, journals and settings to another computer. Database files and exercise workspaces are excluded. Backups contain private content.'}</p>
    <div className="backup-actions">
      <button className="secondary-button" disabled={pending !== null} aria-busy={pending === 'export'}
        onClick={() => void exportBackup()}>{pending === 'export' ? (vi ? 'Đang xuất…' : 'Exporting…')
          : (vi ? 'Xuất bản sao lưu' : 'Export backup')}</button>
      <button className="text-button" disabled={!text.trim() || pending !== null} aria-busy={pending === 'preview'}
        onClick={() => void previewBackup()}>{pending === 'preview' ? (vi ? 'Đang kiểm tra…' : 'Checking…')
          : (vi ? 'Kiểm tra bản sao lưu' : 'Preview backup')}</button>
      <button className="primary-button" disabled={!ready || pending !== null} aria-busy={pending === 'import'}
        onClick={() => void importBackup()}>{pending === 'import' ? (vi ? 'Đang nhập…' : 'Importing…')
          : (vi ? 'Nhập bản đã kiểm tra' : 'Import reviewed backup')}</button>
    </div>
    <textarea className="backup-editor" spellCheck={false} wrap="off"
      aria-label={vi ? 'Nội dung bản sao lưu JSON' : 'Backup JSON contents'}
      value={text} disabled={pending !== null} onChange={(event) => {
        if (!inFlight.current) replaceText(event.target.value)
      }} placeholder={vi ? 'Dán JSON để kiểm tra trước khi nhập…' : 'Paste JSON to review before importing…'} />
    {review && <div className="backup-preview" role="status">
      <p className={review.result.valid ? 'success-note' : 'warning-note'}>{review.result.valid
        ? (vi ? 'Bản sao lưu hợp lệ. Kiểm tra thay đổi bên dưới trước khi nhập.' : 'Valid backup. Review the changes below.')
        : review.result.errors.join(' ')}</p>
      <ul>{Object.entries(review.result.counts).map(([key, count]) => <li key={key}>
        {labels[key] ?? key}: {count} {vi ? 'sẽ nhập' : 'to import'}
        {key in review.result.replaces && ` / ${review.result.replaces[key]} ${vi ? 'hiện có, sẽ thay thế' : 'existing, replaced'}`}
      </li>)}</ul>
      <p>{vi ? 'Cài đặt sẽ được thay thế. Tệp nhật ký trùng tên sẽ bị ghi đè; các tệp khác được giữ nguyên.'
        : 'Settings are replaced. Matching journal filenames are overwritten; other files are kept.'}</p>
      {review.result.journal_conflicts && <p>{vi ? 'Tệp nhật ký sẽ bị ghi đè: ' : 'Journal files to overwrite: '}
        {review.result.journal_conflicts.join(', ') || (vi ? 'Không có' : 'None')}</p>}
      {review.result.warnings.map((warning) => <p className="warning-note" key={warning}>
        {backupWarning(warning, language)}</p>)}
    </div>}
    {receipt && <p className="success-note" role="status">{receipt.kind === 'import'
      ? (vi ? 'Đã nhập. Bản sao an toàn: ' : 'Imported. Safety backup: ')
      : (vi ? 'Đã tạo bản sao lưu: ' : 'Backup created: ')}{receipt.path}</p>}
    {error && <p className="warning-note" role="alert">{errors[error]}</p>}
  </section>
}
