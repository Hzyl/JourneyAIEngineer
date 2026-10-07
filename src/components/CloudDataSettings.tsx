import { useState } from 'react'
import { DeleteAccount } from './DeleteAccount'
import catalogVersion from '../../content/catalog-version.json'
import { requireHostedUser, requireSupabase } from '../platform/hosted/supabase-client'

export function CloudDataSettings({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const download = async () => {
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const user = await requireHostedUser()
      const { data, error: failure } = await requireSupabase().rpc('export_learning_snapshot')
      if (failure) throw new Error(failure.message)
      if (!data || data.owner_id !== user.id) throw new Error('Account changed. Please try again.')
      const payload = { ...data, catalog: catalogVersion }
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `journey-cloud-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage(vi ? 'Đã tạo file xuất dữ liệu. Hãy kiểm tra thư mục tải xuống.'
        : 'Export created. Check your downloads folder.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Export failed')
    } finally { setBusy(false) }
  }
  return <><section className="section-card backup-card">
    <span className="eyebrow">CLOUD DATA</span>
    <h3>{vi ? 'Dữ liệu thuộc về bạn' : 'Your learning data'}</h3>
    <p>{vi ? 'Tải tiến độ, lịch sử ôn tập, phiên học, notes, journal và cài đặt của tài khoản này.'
      : 'Download this account’s progress, review history, study sessions, notes, journal and settings.'}</p>
    <p className="muted">{vi ? 'File có nội dung riêng tư. Đây là bản xuất dữ liệu web, chưa dùng để khôi phục SQLite hoặc nhập sang tài khoản khác.'
      : 'The file contains private content. This web export cannot yet restore SQLite or import into another account.'}</p>
    <button className="secondary-button" disabled={busy} aria-busy={busy} onClick={() => void download()}>
      {busy ? (vi ? 'Đang xuất…' : 'Exporting…') : (vi ? 'Tải dữ liệu JSON' : 'Download JSON export')}
    </button>
    {message && <p role="status" className="success-note">{message}</p>}
    {error && <p role="alert" className="warning-note">{error}</p>}
  </section><DeleteAccount language={language} /></>
}
