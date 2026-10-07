import { ThemeToggle } from '../theme/ThemeToggle'
import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { requireSupabase } from '../platform/hosted/supabase-client'
import './auth.css'

function isRecoveryRoute(): boolean {
  return new URLSearchParams(window.location.search).get('mode') === 'recovery'
}

function callbackFailure(): string | null {
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.slice(1))
  return query.get('error_description') ?? hash.get('error_description')
}

export function AuthCallback() {
  const auth = useAuth()
  const recovery = isRecoveryRoute()
  const callbackError = callbackFailure()
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
    <section className="auth-frame auth-callback" aria-busy={auth.state === 'loading' || busy}>
      <section className="auth-form-panel">
        <div className="auth-theme-toolbar"><ThemeToggle /></div>
        <div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div></div>
        {callbackError ? <div className="auth-heading">
          <span className="eyebrow accent">LIÊN KẾT KHÔNG HỢP LỆ</span>
          <h2>Không thể xác nhận tài khoản</h2>
          <p>Liên kết này có thể đã hết hạn hoặc đã được dùng. Hãy quay lại đăng nhập để gửi lại email xác nhận.</p>
          <p className="auth-notice is-error" role="alert">{callbackError}</p>
          <button type="button" className="primary-button" onClick={() => window.location.replace('/')}>Về trang đăng nhập</button>
        </div> : recovery ? <>
          <div className="auth-heading"><span className="eyebrow accent">MẬT KHẨU MỚI</span><h2>Đặt lại mật khẩu</h2><p>Chọn mật khẩu mới cho tài khoản học của bạn. Dữ liệu học sẽ không bị thay đổi.</p></div>
          <form className="auth-form" onSubmit={(event) => void updatePassword(event)}>
            <label className="auth-field"><span>Mật khẩu mới</span><input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} disabled={busy} required /></label>
            <label className="auth-field"><span>Nhập lại mật khẩu</span><input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} disabled={busy} required /></label>
            <button className="primary-button" type="submit" disabled={busy || auth.state !== 'signed_in'}>{busy ? 'Đang lưu…' : 'Lưu mật khẩu mới'}</button>
          </form>
          {auth.state === 'loading' && <p className="field-hint" role="status">Đang xác thực đường dẫn khôi phục…</p>}
          {auth.state === 'signed_out' && <p className="auth-notice is-error" role="alert">Đường dẫn khôi phục không còn hiệu lực. Hãy quay lại và yêu cầu email mới.</p>}
        </> : <div className="auth-heading">
          <span className="eyebrow accent">WEB BETA · ACCOUNT</span>
          <h2>Đang xác nhận tài khoản</h2>
          <p>{auth.state === 'signed_in' ? 'Tài khoản đã sẵn sàng. Bạn sẽ được chuyển về không gian học.' : 'Nếu link còn hiệu lực, trang này sẽ tự hoàn tất xác nhận.'}</p>
          {auth.state === 'signed_out' && <button type="button" className="primary-button" onClick={() => window.location.replace('/')}>Về trang đăng nhập</button>}
        </div>}
        {error && <p className="auth-notice is-error" role="alert">{error}</p>}
      </section>
    </section>
  </main>
}
