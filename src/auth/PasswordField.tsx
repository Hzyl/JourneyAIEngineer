import { useId, useState } from 'react'
import type { PublicLanguage } from '../public/public-language'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'current-password' | 'new-password'
  disabled: boolean
  invalid?: boolean
  language: PublicLanguage
}

export function PasswordField({ label, value, onChange, autoComplete, disabled, invalid, language }: Props) {
  const [visible, setVisible] = useState(false)
  const inputId = useId()
  const action = language === 'vi' ? (visible ? 'Ẩn' : 'Hiện') : (visible ? 'Hide' : 'Show')
  return <div className="auth-field">
    <label htmlFor={inputId}>{label}</label>
    <span className="password-control">
      <input id={inputId} type={visible ? 'text' : 'password'} autoComplete={autoComplete} value={value}
        onChange={(event) => onChange(event.target.value)} disabled={disabled} minLength={8}
        aria-invalid={invalid || undefined} required />
      <button className="password-toggle" type="button" onClick={() => setVisible((current) => !current)}
        disabled={disabled} aria-label={`${action} ${label.toLowerCase()}`}>{action}</button>
    </span>
  </div>
}
