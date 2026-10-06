import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { requireSupabase } from '../platform/hosted/supabase-client'
import './auth.css'

function isRecoveryRoute(): boolean {
  return new URLSearchParams(window.location.search).get('mode') === 'recovery'
}

export function AuthCallback() {
  const auth = useAuth()
  const recovery = isRecoveryRoute()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (recovery || auth.state !== 'signed_in') return
    const timer = window.setTimeout(() => {
      window.location.replace('/')
    }, 900)
    return () => window.clearTimeout(timer)
  }, [auth.state, recovery])

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Mật khẩu mới cần có ít nhất 8 ký tự.')
      return
    }
    if (password !== confirmation) {
      setError('Hai mật khẩu chưa trùng khớp.')
      return
    }
    setBusy(true)
    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({ password })
      if (updateError) throw updateError
      window.history.replaceState({}, '', '/')
      window.location.replace('/')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể đổi mật khẩu. Hãy yêu cầu email khôi phục mới.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-shell">
    <section className="auth-card" aria-busy={auth.state === 'loading' || busy}>
      <div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div></div>
      <span className="eyebrow accent">WEB BETA · ACCOUNT</span>
      {recovery ? <>
        <h1>Đặt mật khẩu mới</h1>
        <p>Chọn mật khẩu mới cho tài khoản học của bạn. Dữ liệu học sẽ không bị thay đổi.</p>
        <form onSubmit={(event) => void updatePassword(event)}>
          <label>Mật khẩu mới<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} disabled={busy} required /></label>
          <label>Nhập lại mật khẩu<input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} disabled={busy} required /></label>
          <button className="primary-button" type="submit" disabled={busy || auth.state !== 'signed_in'}>{busy ? 'Đang lưu…' : 'Lưu mật khẩu mới'}</button>
        </form>
        {auth.state === 'loading' && <p className="muted" role="status">Đang xác thực đường dẫn khôi phục…</p>}
        {auth.state === 'signed_out' && <p className="warning-note" role="alert">Đường dẫn khôi phục không còn hiệu lực. Hãy quay lại và yêu cầu email mới.</p>}
      </> : <>
        <h1>Đang xác nhận tài khoản</h1>
        <p>{auth.state === 'signed_in' ? 'Tài khoản đã sẵn sàng. Bạn sẽ được chuyển về không gian học.' : 'Nếu link còn hiệu lực, trang này sẽ tự hoàn tất xác nhận.'}</p>
        {auth.state === 'signed_out' && <button type="button" className="primary-button" onClick={() => window.location.replace('/')}>Về trang đăng nhập</button>}
      </>}
      {error && <p className="warning-note" role="alert">{error}</p>}
    </section>
  </main>
}
