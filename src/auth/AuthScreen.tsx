import { useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'
import './auth.css'

type Mode = 'sign_in' | 'sign_up' | 'reset'

export function AuthScreen({ loading }: { loading: boolean }) {
  const [mode, setMode] = useState<Mode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!email.includes('@')) {
      setError('Hãy nhập một email hợp lệ.')
      return
    }
    if (mode !== 'reset' && password.length < 8) {
      setError('Mật khẩu cần có ít nhất 8 ký tự.')
      return
    }
    setBusy(true)
    try {
      const client = requireSupabase()
      if (mode === 'sign_in') {
        const { error: authError } = await client.auth.signInWithPassword({ email, password })
        if (authError) throw authError
      } else if (mode === 'sign_up') {
        const { error: authError } = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (authError) throw authError
        setMessage('Kiểm tra email để xác nhận tài khoản, sau đó quay lại đăng nhập.')
      } else {
        const { error: authError } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?mode=recovery`,
        })
        if (authError) throw authError
        setMessage('Đã gửi hướng dẫn đặt lại mật khẩu nếu email có tài khoản.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể hoàn tất xác thực. Hãy thử lại.')
    } finally {
      setBusy(false)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setMessage('')
  }

  return <main className="auth-shell">
    <section className="auth-card" aria-busy={loading || busy}>
      <div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div></div>
      <span className="eyebrow accent">WEB BETA · CLOUD SYNC</span>
      <h1>{mode === 'sign_in' ? 'Tiếp tục hành trình học' : mode === 'sign_up' ? 'Tạo không gian học riêng' : 'Khôi phục quyền truy cập'}</h1>
      <p>{mode === 'sign_in' ? 'Đăng nhập để lưu tiến độ, review, notes và journal trên thiết bị của bạn.' : 'Dữ liệu học trên web được tách riêng khỏi portable và source clone.'}</p>
      <form onSubmit={(event) => void submit(event)}>
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading || busy} required /></label>
        {mode !== 'reset' && <label>Mật khẩu<input type="password" autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading || busy} minLength={8} required /></label>}
        <button className="primary-button" disabled={loading || busy} type="submit">{loading || busy ? 'Đang xử lý…' : mode === 'sign_in' ? 'Đăng nhập' : mode === 'sign_up' ? 'Tạo tài khoản' : 'Gửi email khôi phục'}</button>
      </form>
      {message && <p className="success-note" role="status">{message}</p>}
      {error && <p className="warning-note" role="alert">{error}</p>}
      <div className="auth-links">
        {mode !== 'sign_in' && <button type="button" className="text-button" onClick={() => switchMode('sign_in')}>Đã có tài khoản</button>}
        {mode !== 'sign_up' && <button type="button" className="text-button" onClick={() => switchMode('sign_up')}>Tạo tài khoản</button>}
        {mode !== 'reset' && <button type="button" className="text-button" onClick={() => switchMode('reset')}>Quên mật khẩu</button>}
      </div>
      <small>Web beta không chạy code, mở VS Code hoặc truy cập Git trên máy của bạn.</small>
    </section>
  </main>
}
