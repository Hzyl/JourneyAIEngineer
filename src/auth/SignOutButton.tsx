import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthProvider'
import './session-controls.css'

export function SignOutButton({ language }: { language: 'vi' | 'en' }) {
  const { signOut } = useAuth()
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const active = useRef(true)
  const inFlight = useRef(false)
  const vi = language === 'vi'
  useEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])
  const submit = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setPending(true)
    setFailed(false)
    try {
      await signOut()
    } catch {
      if (active.current) setFailed(true)
    } finally {
      inFlight.current = false
      if (active.current) setPending(false)
    }
  }
  return <div className="signout-control">
    <button className="text-button" disabled={pending} aria-busy={pending}
      aria-describedby={failed ? 'signout-error' : undefined} onClick={() => void submit()}>
      {pending ? (vi ? 'Đang đăng xuất…' : 'Signing out…') : (vi ? 'Đăng xuất' : 'Sign out')}
    </button>
    {failed && <p id="signout-error" role="alert">{vi
      ? 'Chưa đăng xuất được. Kiểm tra kết nối và thử lại.'
      : 'Could not sign out. Check your connection and try again.'}</p>}
  </div>
}
