import { ThemeToggle } from '../theme/ThemeToggle'
import { useId, useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'
import { describeAuthError, isUnconfirmedEmailError, passwordValidationError } from './auth-utils'
import './auth.css'

type Mode = 'sign_in' | 'sign_up' | 'reset'

function callbackUrl(): string {
  return `${window.location.origin}/auth/callback`
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  invalid = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  disabled: boolean
  invalid?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const inputId = useId()
  return <div className="auth-field">
    <label htmlFor={inputId}>{label}</label>
    <span className="password-control">
      <input id={inputId} type={visible ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} minLength={8} aria-invalid={invalid || undefined} required />
      <button className="password-toggle" type="button" onClick={() => setVisible((current) => !current)} disabled={disabled} aria-label={visible ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`}>{visible ? 'Ẩn' : 'Hiện'}</button>
    </span>
  </div>
}

export function AuthScreen({ loading }: { loading: boolean }) {
  const [mode, setMode] = useState<Mode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [resending, setResending] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const disabled = loading || busy || resending
  const resetNotice = () => {
    setError('')
    setMessage('')
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setAwaitingConfirmation(false)
    resetNotice()
  }

  const resendConfirmation = async () => {
    resetNotice()
    if (!email.includes('@')) {
      setError('Hãy nhập email của bạn trước khi yêu cầu gửi lại xác nhận.')
      return
    }
    setResending(true)
    try {
      const { error: authError } = await requireSupabase().auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: callbackUrl() },
      })
      if (authError) throw authError
      setMessage(`Đã gửi lại email xác nhận đến ${email}. Hãy kiểm tra Inbox và Spam.`)
    } catch (cause) {
      setError(describeAuthError(cause))
    } finally {
      setResending(false)
    }
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetNotice()
    if (!email.includes('@')) {
      setError('Hãy nhập một email hợp lệ.')
      return
    }
    if (mode === 'sign_up') {
      const validationError = passwordValidationError(password, confirmation)
      if (validationError) {
        setError(validationError)
        return
      }
    } else if (mode === 'sign_in' && password.length < 8) {
      setError('Mật khẩu cần có ít nhất 8 ký tự.')
      return
    }

    setBusy(true)
    try {
      const client = requireSupabase()
      if (mode === 'sign_in') {
        const { error: authError } = await client.auth.signInWithPassword({ email, password })
        if (authError) {
          if (isUnconfirmedEmailError(authError)) {
            setAwaitingConfirmation(true)
            setMessage(`Tài khoản ${email} chưa được xác nhận. Mở email xác nhận trước, hoặc gửi lại email mới.`)
            return
          }
          throw authError
        }
      } else if (mode === 'sign_up') {
        const { error: authError } = await client.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callbackUrl() },
        })
        if (authError) throw authError
        setAwaitingConfirmation(true)
        setMessage(`Tài khoản đã được tạo. Mở email gửi đến ${email} để xác nhận trước khi đăng nhập.`)
      } else {
        const { error: authError } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${callbackUrl()}?mode=recovery`,
        })
        if (authError) throw authError
        setMessage('Nếu email có tài khoản, hướng dẫn đặt lại mật khẩu đã được gửi. Hãy kiểm tra cả Spam.')
      }
    } catch (cause) {
      setError(describeAuthError(cause))
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'sign_in' ? 'Chào mừng bạn trở lại' : mode === 'sign_up' ? 'Tạo tài khoản học tập' : 'Khôi phục tài khoản'
  const description = mode === 'sign_in'
    ? 'Đăng nhập để tiếp tục tiến độ và lịch ôn tập của bạn.'
    : mode === 'sign_up'
      ? 'Dùng một email bạn có thể mở ngay để xác nhận tài khoản.'
      : 'Chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu tới email của bạn.'
  const noticeTitle = error
    ? mode === 'sign_in' ? 'Không thể đăng nhập' : mode === 'sign_up' ? 'Không thể tạo tài khoản' : 'Không thể gửi email'
    : awaitingConfirmation ? 'Xác nhận email để tiếp tục' : 'Kiểm tra hộp thư của bạn'

  return <main className="auth-shell">
    <section className="auth-frame" aria-busy={loading || busy || resending}>
      <aside className="auth-intro" aria-label="Giới thiệu Journey AI Engineer">
        <div className="brand-lockup"><div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div></div>
        <span className="eyebrow">WEB BETA · CLOUD SYNC</span>
        <h1>Học có hệ thống.<br />Lưu lại bằng chứng.</h1>
        <p>Không gian học AI Engineer giúp bạn theo dõi roadmap, luyện review và ghi lại dự án theo từng tuần.</p>
        <ol className="auth-value-list">
          <li><strong>Tiến độ có ngữ cảnh</strong><span>Lesson, notes và journal nằm cùng một hành trình.</span></li>
          <li><strong>Ôn tập đúng lúc</strong><span>Lịch review giúp bạn nhận ra chủ đề còn yếu.</span></li>
          <li><strong>Chỉ bạn truy cập</strong><span>Dữ liệu web được tách theo tài khoản.</span></li>
        </ol>
        <p className="auth-intro-footnote">Workspace, VS Code và Git vẫn dành cho bản desktop/source clone.</p>
      </aside>

      <section className="auth-form-panel" aria-labelledby="auth-title">
        <div className="auth-theme-toolbar"><ThemeToggle /></div>
        <div className="auth-mode-switch" role="tablist" aria-label="Chọn cách truy cập">
          <button type="button" role="tab" aria-selected={mode === 'sign_in'} className={mode === 'sign_in' ? 'is-active' : ''} onClick={() => switchMode('sign_in')}>Đăng nhập</button>
          <button type="button" role="tab" aria-selected={mode === 'sign_up'} className={mode === 'sign_up' ? 'is-active' : 'auth-mode-cta'} onClick={() => switchMode('sign_up')}>Tạo tài khoản</button>
        </div>
        <div className="auth-heading">
          <span className="eyebrow accent">TÀI KHOẢN CỦA BẠN</span>
          <h2 id="auth-title">{title}</h2>
          <p>{description}</p>
        </div>

        {(message || error) && <div className={error ? 'auth-notice is-error' : 'auth-notice is-success'} role={error ? 'alert' : 'status'} aria-live="polite">
          <span className="auth-notice-mark" aria-hidden="true">{error ? '!' : '✓'}</span>
          <div className="auth-notice-copy"><strong>{noticeTitle}</strong><span>{error || message}</span></div>
          {awaitingConfirmation && <button type="button" className="secondary-button" onClick={() => void resendConfirmation()} disabled={disabled} aria-busy={resending}>{resending ? 'Đang gửi…' : 'Gửi lại email xác nhận'}</button>}
        </div>}

        <form className="auth-form" onSubmit={(event) => void submit(event)} noValidate>
          <label className="auth-field"><span>Email</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={disabled} placeholder="ban@example.com" required /></label>
          {mode !== 'reset' && <PasswordField label="Mật khẩu" value={password} onChange={setPassword} autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'} disabled={disabled} invalid={mode === 'sign_up' && confirmation.length > 0 && password !== confirmation} />}
          {mode === 'sign_up' && <PasswordField label="Nhập lại mật khẩu" value={confirmation} onChange={setConfirmation} autoComplete="new-password" disabled={disabled} invalid={confirmation.length > 0 && password !== confirmation} />}
          {mode === 'sign_up' && <p className="field-hint">Ít nhất 8 ký tự. Hãy dùng mật khẩu riêng, không dùng mật khẩu GitHub.</p>}
          <button className={`primary-button auth-submit${mode === 'sign_up' ? ' auth-submit-signup' : ''}`} disabled={disabled} aria-busy={loading || busy} type="submit">{loading || busy ? 'Đang xử lý…' : mode === 'sign_in' ? 'Đăng nhập' : mode === 'sign_up' ? 'Tạo tài khoản và xác nhận email' : 'Gửi email khôi phục'}</button>
        </form>

        <div className="auth-secondary-actions">
          {mode !== 'reset' && <button type="button" className="text-button" onClick={() => switchMode('reset')}>Quên mật khẩu?</button>}
          {mode === 'reset' && <button type="button" className="text-button" onClick={() => switchMode('sign_in')}>Quay về đăng nhập</button>}
          {awaitingConfirmation && <button type="button" className="text-button" onClick={() => switchMode('sign_up')}>Dùng email khác</button>}
        </div>
        {mode === 'sign_in' && <button type="button" className="auth-create-account-link" onClick={() => switchMode('sign_up')}><span>Bạn chưa có tài khoản?</span><strong>Tạo tài khoản miễn phí →</strong></button>}
        <p className="auth-privacy-note">Không có API key, source code hay thư mục trên máy của bạn được gửi lên web beta.</p>
      </section>
    </section>
  </main>
}
