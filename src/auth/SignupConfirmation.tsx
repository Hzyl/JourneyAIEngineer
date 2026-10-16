import { useEffect, useRef, useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'
import type { PublicLanguage } from '../public/public-language'
import { signupConfirmationCopy, resendFailure } from './otp-copy'
import { rememberConfirmationReturn } from './confirmation-return'
import { rememberPendingSignup } from './pending-signup'
import { useSignupConfirmation } from './use-signup-confirmation'
import './signup-confirmation.css'

type Props = {
  email: string
  language: PublicLanguage
  justSent: boolean
  resendAt?: number
  loading: boolean
  onChangeEmail: () => void
  onBack: () => void
  onContinue: () => void
}
type Failure = 'rateLimit' | 'resendFailure'

export function SignupConfirmation({ email, language, justSent, resendAt, loading, onChangeEmail, onBack, onContinue }: Props) {
  const text = signupConfirmationCopy[language]
  const { status, check } = useSignupConfirmation(email)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Failure | null>(null)
  const [notice, setNotice] = useState(false)
  const [resendAfter, setResendAfter] = useState(() => resendAt ?? (justSent ? Date.now() + 60_000 : 0))
  const [seconds, setSeconds] = useState(() => Math.max(0, Math.ceil((resendAfter - Date.now()) / 1000)))
  const inFlight = useRef(false)
  const active = useRef(true)
  const confirmed = status === 'confirmed'
  const disabled = loading || pending || confirmed

  useEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])
  useEffect(() => {
    document.getElementById('auth-title')?.focus()
  }, [confirmed])
  useEffect(() => {
    if (!resendAfter || confirmed) return
    const tick = () => setSeconds(Math.max(0, Math.ceil((resendAfter - Date.now()) / 1000)))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [resendAfter, confirmed])

  const resend = async () => {
    if (inFlight.current || disabled || Date.now() < resendAfter) return
    inFlight.current = true
    setPending(true)
    setError(null)
    setNotice(false)
    setResendAfter(Date.now() + 60_000)
    setSeconds(60)
    rememberPendingSignup(email, true)
    try {
      const callback = new URL('/auth/callback', window.location.origin)
      callback.searchParams.set('lang', language)
      const { error: authError } = await requireSupabase().auth.resend({
        type: 'signup', email, options: { emailRedirectTo: callback.href },
      })
      if (authError) throw authError
      rememberConfirmationReturn()
      if (active.current) setNotice(true)
    } catch (cause) {
      if (active.current) setError(resendFailure(cause))
    } finally {
      inFlight.current = false
      if (active.current) setPending(false)
    }
  }

  return <div className="signup-confirmation" aria-busy={loading || pending || status === 'checking'}>
    <div className="auth-heading">
      <span className="eyebrow accent">{text.step}</span>
      <h2 id="auth-title" tabIndex={-1}>{confirmed ? text.confirmedTitle : text.title}</h2>
      {!confirmed && <p>{text.intro}</p>}
    </div>
    <p className="otp-destination"><span>{text.destination}</span><strong>{email}</strong></p>
    {confirmed ? <>
      <div className="auth-notice is-success" data-confirmation="confirmed" role="status">
        <span className="auth-notice-mark" aria-hidden="true">✓</span>
        <div className="auth-notice-copy">{text.confirmed}</div>
      </div>
      <button className="primary-button auth-submit" type="button" data-action="continue"
        disabled={loading} onClick={onContinue}>{text.continue}</button>
    </> : <>
    {(notice || error) && <div className={`auth-notice ${error ? 'is-error' : 'is-success'}`}
      role={error ? 'alert' : 'status'}>
      <span className="auth-notice-mark" aria-hidden="true">{error ? '!' : '✓'}</span>
      <div className="auth-notice-copy">{error ? text[error] : text.sent}</div>
    </div>}
    {(status === 'unavailable' || status === 'other_account') && <p className="confirmation-feedback" role="status">
      {status === 'unavailable' ? text.unavailable : text.otherAccount}
    </p>}
    <button className="secondary-button" type="button" data-action="check-confirmation"
      disabled={disabled || status === 'checking'} onClick={check} aria-busy={status === 'checking'}>
      {status === 'checking' ? text.checking : text.check}
    </button>
    <div className="otp-resend">
      <p>{text.help}</p>
      <button className="secondary-button" type="button" data-action="resend"
        disabled={disabled || seconds > 0} onClick={() => void resend()} aria-busy={pending}>
        {pending ? text.sending : seconds > 0 ? text.wait(seconds) : text.resend}
      </button>
    </div>
    <div className="auth-secondary-actions">
      <button className="text-button" type="button" data-action="change-email" disabled={disabled}
        onClick={onChangeEmail}>{text.changeEmail}</button>
      <button className="text-button" type="button" disabled={disabled} onClick={onBack}>{text.back}</button>
    </div>
    </>}
  </div>
}
