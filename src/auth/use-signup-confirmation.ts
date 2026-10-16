import { useCallback, useEffect, useRef, useState } from 'react'
import { requireSupabase } from '../platform/hosted/supabase-client'

type Status = 'waiting' | 'checking' | 'confirmed' | 'unavailable' | 'other_account'
const normalize = (email: string) => email.trim().toLowerCase()

export function useSignupConfirmation(email: string) {
  const [status, setStatus] = useState<Status>('waiting')
  const request = useRef<() => void>(() => {})
  const check = useCallback(() => request.current(), [])

  useEffect(() => {
    const auth = requireSupabase().auth
    let active = true
    let generation = 0
    let owner: string | null = null
    let confirmed = false
    let inFlight: number | null = null
    let scheduled: number | null = null
    const expectedEmail = normalize(email)
    const identity = (user: { id: string; email?: string }) => `${user.id}:${normalize(user.email ?? '')}`

    const invalidate = () => {
      generation += 1
      inFlight = null
      confirmed = false
      if (scheduled !== null) window.clearTimeout(scheduled)
      scheduled = null
      if (active) setStatus('waiting')
    }
    const verify = async () => {
      if (!active || confirmed || inFlight !== null) return
      const version = generation
      inFlight = version
      setStatus('checking')
      try {
        // The SDK event is only a wake-up signal. Read confirmation from Auth.
        const { data, error } = await auth.getUser()
        if (!active || version !== generation) return
        if (error) {
          setStatus(error.name === 'AuthSessionMissingError' ? 'waiting' : 'unavailable')
          return
        }
        const user = data.user
        if (!user?.id || !user.email) {
          setStatus('waiting')
          return
        }
        if (normalize(user.email) !== expectedEmail || (owner && identity(user) !== owner)) {
          setStatus('other_account')
          return
        }
        if (!user.email_confirmed_at || !Number.isFinite(Date.parse(user.email_confirmed_at))) {
          setStatus('waiting')
          return
        }
        owner = identity(user)
        confirmed = true
        setStatus('confirmed')
      } catch {
        if (active && version === generation) setStatus('unavailable')
      } finally {
        if (inFlight === version) inFlight = null
      }
    }
    const schedule = () => {
      if (!active || confirmed || inFlight !== null || scheduled !== null) return
      // Never call another SDK method inside its locked auth event callback.
      scheduled = window.setTimeout(() => {
        scheduled = null
        void verify()
      }, 0)
    }
    request.current = schedule
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT') {
        owner = null
        invalidate()
        return
      }
      const nextOwner = session?.user ? identity(session.user) : null
      if (nextOwner !== owner || event === 'USER_UPDATED') invalidate()
      owner = nextOwner
      schedule()
    })
    const visible = () => {
      if (document.visibilityState === 'visible') schedule()
    }
    window.addEventListener('focus', schedule)
    window.addEventListener('pageshow', schedule)
    document.addEventListener('visibilitychange', visible)
    schedule()
    return () => {
      active = false
      generation += 1
      request.current = () => {}
      if (scheduled !== null) window.clearTimeout(scheduled)
      subscription.unsubscribe()
      window.removeEventListener('focus', schedule)
      window.removeEventListener('pageshow', schedule)
      document.removeEventListener('visibilitychange', visible)
    }
  }, [email])

  return { status, check }
}
