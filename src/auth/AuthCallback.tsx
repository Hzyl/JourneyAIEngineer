import { ThemeToggle } from '../theme/ThemeToggle'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthProvider'
import { requireSupabase } from '../platform/hosted/supabase-client'
import { usePublicLanguage } from '../public/public-language'
import { PasswordField } from './PasswordField'
import { authCopy } from './auth-copy'
import { describeAuthError } from './auth-utils'
import './auth.css'
import './auth-layout.css'

export function AuthCallback() {
  const auth = useAuth()
  const [language, setLanguage] = usePublicLanguage()
  const vi = language === 'vi'
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const recovery = query.get('mode') === 'recovery'
  const callbackError = query.has('error_description') || hash.has('error_description')
    || query.has('error') || hash.has('error')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  const [error, setError] = useState<{ key: 'short' | 'mismatch' } | { cause: unknown } | null>(null)
  const errorText = error && ('key' in error ? authCopy[language].validation[error.key]
    : describeAuthError(error.cause, language))
  const disabled = busy || auth.state !== 'signed_in'
  const back = <button type="button" className="primary-button"
    onClick={() => window.location.replace('/auth/sign-in')}>
    {vi ? 'Về trang đăng nhập' : 'Back to sign in'}</button>

  useEffect(() => {
    if (callbackError || recovery || auth.state !== 'signed_in') return
    const timer = window.setTimeout(() => window.location.replace('/'), 900)
    return () => window.clearTimeout(timer)
  }, [auth.state, recovery, callbackError])

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current || auth.state !== 'signed_in') return
    setError(null)
    if (password.length < 8) { setError({ key: 'short' }); return }
    if (password !== confirmation) { setError({ key: 'mismatch' }); return }
    inFlight.current = true
    setBusy(true)
    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({ password })
      if (updateError) throw updateError
      window.location.replace('/')
    } catch (cause) { setError({ cause }) }
    finally { inFlight.current = false; setBusy(false) }
  }

  return <main className="auth-shell" lang={language}>
    <section className="auth-frame auth-callback" aria-busy={auth.state === 'loading' || busy}>
      <section className="auth-form-panel">
        <div className="auth-theme-toolbar"><ThemeToggle language={language} />
          <button className="text-button" onClick={() => setLanguage(vi ? 'en' : 'vi')}
            aria-label={vi ? 'Switch to English' : 'Đổi sang tiếng Việt'}>{vi ? 'EN' : 'VI'}</button>
        </div>
        <div className="brand-lockup">
          <div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div>
        </div>
        {callbackError ? <div className="auth-heading">
          <span className="eyebrow accent">{vi ? 'LIÊN KẾT KHÔNG HỢP LỆ' : 'INVALID LINK'}</span>
          <h1>{vi ? 'Không thể xác nhận tài khoản' : 'Could not confirm your account'}</h1>
          <p role="alert">{vi
            ? 'Liên kết này có thể đã hết hạn hoặc đã được dùng. Hãy quay lại đăng nhập để gửi lại email xác nhận.'
            : 'This link may have expired or already been used. Return to sign in to request a new confirmation email.'}</p>
          {back}
        </div> : recovery ? <>
          <div className="auth-heading">
            <span className="eyebrow accent">{vi ? 'MẬT KHẨU MỚI' : 'NEW PASSWORD'}</span>
            <h1>{vi ? 'Đặt lại mật khẩu' : 'Reset your password'}</h1>
            <p>{vi ? 'Chọn mật khẩu mới cho tài khoản học của bạn. Dữ liệu học sẽ không bị thay đổi.'
              : 'Choose a new password for your learning account. Your learning data will stay unchanged.'}</p>
          </div>
          <form className="auth-form" noValidate onSubmit={(event) => void updatePassword(event)}>
            <PasswordField label={vi ? 'Mật khẩu mới' : 'New password'} value={password} onChange={setPassword}
              autoComplete="new-password" language={language} disabled={disabled} />
            <PasswordField label={authCopy[language].confirmation} value={confirmation} onChange={setConfirmation}
              autoComplete="new-password" language={language} disabled={disabled}
              invalid={confirmation.length > 0 && password !== confirmation} />
            <button className="primary-button" type="submit" aria-busy={busy} disabled={disabled}>
              {busy ? (vi ? 'Đang lưu…' : 'Saving…') : (vi ? 'Lưu mật khẩu mới' : 'Save new password')}</button>
          </form>
          {auth.state === 'loading' && <p className="field-hint" role="status">
            {vi ? 'Đang xác thực đường dẫn khôi phục…' : 'Checking the recovery link…'}</p>}
          {auth.state === 'signed_out' && <>
            <p className="auth-notice is-error" role="alert">{vi
              ? 'Đường dẫn khôi phục không còn hiệu lực. Hãy quay lại và yêu cầu email mới.'
              : 'This recovery link is no longer valid. Go back and request a new email.'}</p>
            {back}
          </>}
        </> : <div className="auth-heading">
          <span className="eyebrow accent">WEB BETA · ACCOUNT</span>
          <h1>{vi ? 'Đang xác nhận tài khoản' : 'Confirming your account'}</h1>
          <p>{auth.state === 'signed_in'
            ? (vi ? 'Tài khoản đã sẵn sàng. Bạn sẽ được chuyển về không gian học.'
              : 'Your account is ready. You will be redirected to your learning space.')
            : (vi ? 'Nếu link còn hiệu lực, trang này sẽ tự hoàn tất xác nhận.'
              : 'If the link is valid, confirmation will finish automatically.')}</p>
          {auth.state === 'signed_out' && back}
        </div>}
        {errorText && <p className="auth-notice is-error" role="alert">{errorText}</p>}
      </section>
    </section>
  </main>
}
