import { useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'

export function DeleteAccount({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const [expanded, setExpanded] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [deleted, setDeleted] = useState(false)
  const remove = async () => {
    if (busy || confirmation !== 'DELETE' || !password) return
    setBusy(true)
    setError('')
    try {
      const client = requireSupabase()
      const { data, error: failure } = await client.functions.invoke('delete-account', {
        body: { confirmation, password },
      })
      if (failure || data?.code !== 'account_deleted') {
        throw new Error(vi ? 'Chưa xóa được tài khoản. Kiểm tra mật khẩu và kết nối rồi thử lại. Nếu có MFA, liên hệ hỗ trợ.'
          : 'Account was not deleted. Check your password and connection. For MFA accounts, contact support.')
      }
      setDeleted(true)
      setPassword('')
      setConfirmation('')
      await client.auth.signOut({ scope: 'local' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Account deletion failed')
    } finally { setBusy(false) }
  }
  if (deleted) return <p role="status">{vi ? 'Tài khoản đã được xóa.' : 'Account deleted.'}</p>
  return <section className="section-card">
    <h3>{vi ? 'Xóa tài khoản' : 'Delete account'}</h3>
    <p>{vi ? 'Xóa vĩnh viễn tài khoản và dữ liệu học trên web. Hãy tải bản xuất trước nếu bạn muốn giữ lại.'
      : 'Permanently delete your account and web learning data. Export first if you want to keep a copy.'}</p>
    {!expanded ? <button className="text-button" onClick={() => setExpanded(true)}>
      {vi ? 'Mở bước xác nhận xóa' : 'Open deletion confirmation'}</button> : <form onSubmit={(event) => {
        event.preventDefault()
        void remove()
      }}>
      <label>{vi ? 'Nhập lại mật khẩu' : 'Re-enter password'}
        <input type="password" autoComplete="current-password" required value={password} disabled={busy}
          onChange={(event) => setPassword(event.target.value)} /></label>
      <label>{vi ? 'Nhập DELETE để xác nhận' : 'Type DELETE to confirm'}
        <input autoComplete="off" value={confirmation} disabled={busy} required
          onChange={(event) => setConfirmation(event.target.value)} /></label>
      <div className="backup-actions">
        <button className="secondary-button" type="button" disabled={busy}
          onClick={() => { setExpanded(false); setPassword(''); setConfirmation('') }}>{vi ? 'Hủy' : 'Cancel'}</button>
        <button className="danger-button" aria-busy={busy} disabled={busy || confirmation !== 'DELETE' || !password}>
          {busy ? (vi ? 'Đang xóa…' : 'Deleting…') : (vi ? 'Xóa vĩnh viễn' : 'Delete permanently')}</button>
      </div>
    </form>}
    {error && <p role="alert" className="warning-note">{error}</p>}
  </section>
}
