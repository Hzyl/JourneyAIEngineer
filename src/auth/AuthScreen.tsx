import { useRef, useState } from 'react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { requireSupabase } from '../platform/hosted/supabase-client'
import type { PublicLanguage } from '../public/public-language'
import { describeAuthError, isUnconfirmedEmailError } from './auth-utils'
import { authCopy } from './auth-copy'
import { AuthIntro } from './AuthIntro'
import { PasswordField } from './PasswordField'
import './auth.css'
import './auth-layout.css'

type Mode = 'sign_in' | 'sign_up' | 'reset'
type Notice = { kind: keyof typeof authCopy.vi.notices; email: string }
type FormError = { key: keyof typeof authCopy.vi.validation } | { cause: unknown }

export function AuthScreen({ loading, language = 'vi' }: { loading: boolean; language?: PublicLanguage }) {
  const text = authCopy[language]
  const [mode, setMode] = useState<Mode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [pending, setPending] = useState<'submit' | 'resend' | null>(null)
  const inFlight = useRef(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [error, setError] = useState<FormError | null>(null)
  const disabled = loading || pending !== null
  const errorText = error && ('key' in error ? text.validation[error.key] : describeAuthError(error.cause, language))
  const message = notice ? text.notices[notice.kind](notice.email) : ''

  const resetNotice = () => { setError(null); setNotice(null) }
  const switchMode = (next: Mode) => {
    if (inFlight.current || loading) return
    setMode(next)
    setAwaitingConfirmation(false)
    resetNotice()
  }
  const callbackUrl = (recovery = false) => {
    const url = new URL('/auth/callback', window.location.origin)
    url.searchParams.set('lang', language)
    if (recovery) url.searchParams.set('mode', 'recovery')
    return url.href
  }
  const finish = () => { inFlight.current = false; setPending(null) }
  const resendConfirmation = async () => {
    if (inFlight.current || loading) return
    resetNotice()
    if (!email.includes('@')) { setError({ key: 'resendEmail' }); return }
    inFlight.current = true
    setPending('resend')
    try {
      const { error: authError } = await requireSupabase().auth.resend({
        type: 'signup', email, options: { emailRedirectTo: callbackUrl() },
      })
      if (authError) throw authError
      setNotice({ kind: 'resend', email })
    } catch (cause) { setError({ cause }) }
    finally { finish() }
  }
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current || loading) return
    resetNotice()
    if (!email.includes('@')) { setError({ key: 'email' }); return }
    if (mode !== 'reset' && password.length < 8) { setError({ key: 'short' }); return }
    if (mode === 'sign_up' && password !== confirmation) { setError({ key: 'mismatch' }); return }
    inFlight.current = true
    setPending('submit')
    try {
      const client = requireSupabase()
      if (mode === 'sign_in') {
        const { error: authError } = await client.auth.signInWithPassword({ email, password })
        if (authError) {
          if (isUnconfirmedEmailError(authError)) {
            setAwaitingConfirmation(true)
            setNotice({ kind: 'unconfirmed', email })
            return
          }
          throw authError
        }
      } else if (mode === 'sign_up') {
        const { error: authError } = await client.auth.signUp({
          email, password, options: { emailRedirectTo: callbackUrl() },
        })
        if (authError) throw authError
        setAwaitingConfirmation(true)
        setNotice({ kind: 'created', email })
      } else {
        const { error: authError } = await client.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl(true) })
        if (authError) throw authError
        setNotice({ kind: 'reset', email })
      }
    } catch (cause) { setError({ cause }) }
    finally { finish() }
  }
  const noticeTitle = error ? text.failures[mode] : awaitingConfirmation ? text.confirm : text.inbox

  return <main className="auth-shell" lang={language}>
    <section className="auth-frame" aria-busy={disabled}>
      <AuthIntro language={language} />
      <section className="auth-form-panel" aria-labelledby="auth-title">
        <div className="auth-theme-toolbar"><ThemeToggle language={language} /></div>
        <div className="auth-mode-switch" role="group" aria-label={text.chooseMode}>
          <button type="button" aria-pressed={mode === 'sign_in'} disabled={disabled}
            className={mode === 'sign_in' ? 'is-active' : ''} onClick={() => switchMode('sign_in')}>
            {text.signIn}</button>
          <button type="button" aria-pressed={mode === 'sign_up'} disabled={disabled}
            className={mode === 'sign_up' ? 'is-active' : 'auth-mode-cta'} onClick={() => switchMode('sign_up')}>
            {text.signUp}</button>
        </div>
        <div className="auth-heading">
          <span className="eyebrow accent">{text.account}</span>
          <h2 id="auth-title" tabIndex={-1}>{text.titles[mode]}</h2>
          <p>{text.descriptions[mode]}</p>
        </div>
        {(message || errorText) && <div className={error ? 'auth-notice is-error' : 'auth-notice is-success'}
          role={error ? 'alert' : 'status'} aria-live="polite">
          <span className="auth-notice-mark" aria-hidden="true">{error ? '!' : '✓'}</span>
          <div className="auth-notice-copy"><strong>{noticeTitle}</strong><span>{errorText || message}</span></div>
          {awaitingConfirmation && <button type="button" className="secondary-button" disabled={disabled}
            onClick={() => void resendConfirmation()} aria-busy={pending === 'resend'}>
            {pending === 'resend' ? text.sending : text.resend}</button>}
        </div>}
        <form className="auth-form" onSubmit={(event) => void submit(event)} noValidate>
          <label className="auth-field"><span>Email</span>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)}
              disabled={disabled} placeholder="you@example.com" required />
          </label>
          {mode !== 'reset' && <PasswordField label={text.password} value={password} onChange={setPassword}
            autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'} language={language}
            disabled={disabled} invalid={mode === 'sign_up' && confirmation.length > 0 && password !== confirmation} />}
          {mode === 'sign_up' && <PasswordField label={text.confirmation} value={confirmation} onChange={setConfirmation}
            autoComplete="new-password" language={language} disabled={disabled}
            invalid={confirmation.length > 0 && password !== confirmation} />}
          {mode === 'sign_up' && <p className="field-hint">{text.passwordHint}</p>}
          <button className={`primary-button auth-submit${mode === 'sign_up' ? ' auth-submit-signup' : ''}`}
            disabled={disabled} aria-busy={loading || pending === 'submit'} type="submit">
            {loading || pending === 'submit' ? text.working
              : mode === 'sign_in' ? text.signIn : mode === 'sign_up' ? text.create : text.recover}</button>
        </form>
        <div className="auth-secondary-actions">
          <button type="button" className="text-button" disabled={disabled}
            onClick={() => switchMode(mode === 'reset' ? 'sign_in' : 'reset')}>
            {mode === 'reset' ? text.back : text.forgot}</button>
          {awaitingConfirmation && <button type="button" className="text-button" disabled={disabled}
            onClick={() => switchMode('sign_up')}>{text.different}</button>}
        </div>
        {mode === 'sign_in' && <button type="button" className="auth-create-account-link" disabled={disabled}
          onClick={() => switchMode('sign_up')}><span>{text.noAccount}</span><strong>{text.freeAccount}</strong></button>}
        <p className="auth-privacy-note">{text.privacy}</p>
      </section>
    </section>
  </main>
}
