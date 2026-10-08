import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { runtimeConfig } from '../platform/runtime-config'
import { supabase } from '../platform/hosted/supabase-client'

export type AuthState = 'local' | 'loading' | 'error' | 'signed_out' | 'signed_in'

type AuthContextValue = {
  state: AuthState
  session: Session | null
  signOut: () => Promise<void>
  retrySession: () => void
}

const AuthContext = createContext<AuthContextValue>({
  state: 'local',
  session: null,
  signOut: async () => undefined,
  retrySession: () => undefined,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(runtimeConfig.mode === 'hosted' ? 'loading' : 'local')
  const [session, setSession] = useState<Session | null>(null)
  const [attempt, setAttempt] = useState(0)
  const reading = useRef(true)
  const retrySession = useCallback(() => {
    if (reading.current || runtimeConfig.mode !== 'hosted') return
    reading.current = true
    setState('loading')
    setAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    if (!supabase || runtimeConfig.mode !== 'hosted') return
    let active = true
    let changed = false
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      changed = true
      reading.current = false
      setSession(nextSession)
      setState(nextSession ? 'signed_in' : 'signed_out')
    })
    const readSession = async () => {
      try {
        const { data, error } = await supabase!.auth.getSession()
        if (!active || changed) return
        if (error) throw error
        setSession(data.session)
        setState(data.session ? 'signed_in' : 'signed_out')
      } catch {
        if (!active || changed) return
        setSession(null)
        setState('error')
      } finally {
        if (active) reading.current = false
      }
    }
    void readSession()
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [attempt])

  const value = useMemo<AuthContextValue>(() => ({
    state,
    session,
    retrySession,
    signOut: async () => {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  }), [retrySession, session, state])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
