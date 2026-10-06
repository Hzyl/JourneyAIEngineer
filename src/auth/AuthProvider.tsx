import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { runtimeConfig } from '../platform/runtime-config'
import { supabase } from '../platform/hosted/supabase-client'

export type AuthState = 'local' | 'loading' | 'signed_out' | 'signed_in'

type AuthContextValue = {
  state: AuthState
  session: Session | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  state: 'local',
  session: null,
  signOut: async () => undefined,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(runtimeConfig.mode === 'hosted' ? 'loading' : 'local')
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setState(data.session ? 'signed_in' : 'signed_out')
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setState(nextSession ? 'signed_in' : 'signed_out')
    })
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    state,
    session,
    signOut: async () => {
      if (supabase) await supabase.auth.signOut()
    },
  }), [session, state])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
