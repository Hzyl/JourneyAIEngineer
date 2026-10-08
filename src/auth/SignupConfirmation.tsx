import { useEffect, useRef, useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'
import type { PublicLanguage } from '../public/public-language'
import { otpCopy, otpFailure } from './otp-copy'
import './signup-confirmation.css'

type Props = {
  email: string
  language: PublicLanguage
  justSent: boolean
  loading: boolean
  onChangeEmail: () => void
  onBack: () => void
}
type Failure = 'validation' | 'invalid' | 'rateLimit' | 'failure' | 'resendFailure'

export function SignupConfirmation({ email, language, justSent, loading, onChangeEmail, onBack }: Props) {
  const text = otpCopy[language]
  const [token, setToken] = useState('')
  const [pending, setPending] = useState<'verify' | 'resend' | null>(null)
  const [error, setError] = useState<Failure | null>(null)
  const [notice, setNotice] = useState<'sent' | 'confirmed' | null>(null)
  const [resendAfter, setResendAfter] = useState(() => justSent ? Date.now() + 60_000 : 0)
  const [seconds, setSeconds] = useState(justSent ? 60 : 0)
  const inFlight = useRef(false)
  const active = useRef(true)
  const input = useRef<HTMLInputElement>(null)
  const confirmed = notice === 'confirmed'
  const disabled = loading || pending !== null || confirmed

  useEffect(() => {
    active.current = true
    input.current?.focus()
    return () => { active.current = false }
  }, [])
  useEffect(() => {
    if (error && !disabled) input.current?.focus()
  }, [error, disabled])
  useEffect(() => {
    if (!resendAfter) return
    const tick = () => setSeconds(Math.max(0, Math.ceil((resendAfter - Date.now()) / 1000)))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [resendAfter])

  const verify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current || disabled) return
    setError(null)
    setNotice(null)
    const code = token.replace(/\s/g, '')
    // Supabase controls the configured code length and expiry. Bound the input,
    // without assuming that the hosted project uses the local six-digit default.
    if (!/^\d{1,32}$/.test(code)) {
      setError('validation')
      input.current?.focus()
      return
    }
    inFlight.current = true
    setPending('verify')
    try {
      const { data, error: authError } = await requireSupabase().auth.verifyOtp({ email, token: code, type: 'email' })
      if (authError) throw authError
      if (!data.session) throw new Error('Missing verified session')
      if (active.current) {
        setToken('')
        setNotice('confirmed')
      }
      // AuthProvider receives the SDK event and enforces the 24-hour deadline
      // before any personal data is shown. This component never admits a user.
    } catch (cause) {
      if (active.current) setError(otpFailure(cause))
    } finally {
      inFlight.current = false
      if (active.current) setPending(null)
    }
  }
  const resend = async () => {
    if (inFlight.current || disabled || Date.now() < resendAfter) return
    inFlight.current = true
    setPending('resend')
    setError(null)
    setNotice(null)
    setResendAfter(Date.now() + 60_000)
    setSeconds(60)
    try {
      const callback = new URL('/auth/callback', window.location.origin)
      callback.searchParams.set('lang', language)
      const { error: authError } = await requireSupabase().auth.resend({
        type: 'signup', email, options: { emailRedirectTo: callback.href },
      })
      if (authError) throw authError
      if (active.current) setNotice('sent')
    } catch (cause) {
      if (active.current) setError(otpFailure(cause) === 'rateLimit' ? 'rateLimit' : 'resendFailure')
    } finally {
      inFlight.current = false
      if (active.current) setPending(null)
    }
  }

  return <div className="signup-confirmation" aria-busy={disabled}>
    <div className="auth-heading">
      <span className="eyebrow accent">{text.step}</span>
      <h2 id="auth-title" tabIndex={-1}>{text.title}</h2>
      <p>{text.intro}</p>
    </div>
    <p className="otp-destination"><span>{text.destination}</span><strong>{email}</strong></p>
    {(notice || error) && <div className={`auth-notice ${error ? 'is-error' : 'is-success'}`}
      role={error ? 'alert' : 'status'}>
      <span className="auth-notice-mark" aria-hidden="true">{error ? '!' : '✓'}</span>
      <div className="auth-notice-copy" id="otp-feedback">{error ? text[error] : text[notice!]}</div>
    </div>}
    <form className="auth-form" onSubmit={(event) => void verify(event)} noValidate>
      <label className="auth-field" htmlFor="signup-code"><span>{text.label}</span></label>
      <input ref={input} id="signup-code" className="otp-input" name="confirmation-code" type="text"
        inputMode="numeric" autoComplete="one-time-code" maxLength={64} spellCheck={false}
        value={token} onChange={(event) => { setToken(event.target.value); setError(null) }}
        placeholder={text.placeholder} disabled={disabled} required
        aria-invalid={error === 'validation' || error === 'invalid'}
        aria-describedby={error ? 'otp-hint otp-feedback' : 'otp-hint'} />
      <p className="field-hint" id="otp-hint">{text.hint}</p>
      <button className="primary-button auth-submit" type="submit" disabled={disabled}
        aria-busy={pending === 'verify'}>{pending === 'verify' ? text.verifying : text.verify}</button>
    </form>
    <div className="otp-resend">
      <p>{text.help}</p>
      <button className="secondary-button" type="button" data-action="resend"
        disabled={disabled || seconds > 0} onClick={() => void resend()} aria-busy={pending === 'resend'}>
        {pending === 'resend' ? text.sending : seconds > 0 ? text.wait(seconds) : text.resend}
      </button>
    </div>
    <div className="auth-secondary-actions">
      <button className="text-button" type="button" data-action="change-email" disabled={disabled}
        onClick={onChangeEmail}>{text.changeEmail}</button>
      <button className="text-button" type="button" disabled={disabled} onClick={onBack}>{text.back}</button>
    </div>
  </div>
}
