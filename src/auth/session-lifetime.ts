import type { Session } from '@supabase/supabase-js'

type State = 'loading' | 'error' | 'signed_out' | 'signed_in' | 'expired'
type Deadline = { server_time: string; expires_at: string | null }
type Services = {
  read: () => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<unknown>
  publish: (state: State, session: Session | null) => void
}

// This controller only manages UI admission. RLS independently enforces server time.
export function sessionLifetime({ read, signOut, publish }: Services) {
  let active = true
  let revision = 0
  let current: Session | null = null
  let admittedOwner: string | undefined
  let expired = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let wallDeadline = Infinity
  let monotonicDeadline = Infinity
  const requests = new Set<ReturnType<typeof setTimeout>>()
  const clearTimer = () => { clearTimeout(timer); timer = undefined }
  const expire = () => {
    if (!active || expired) return
    revision += 1
    expired = true
    current = null
    admittedOwner = undefined
    clearTimer()
    publish('expired', null)
    // Do not sign out other devices. RLS still denies the session if cleanup fails.
    void signOut().catch(() => undefined)
  }

  const accept = (session: Session | null) => {
    if (!active) return
    const version = ++revision
    current = session
    if (!session) {
      admittedOwner = undefined
      clearTimer()
      publish(expired ? 'expired' : 'signed_out', null)
      return
    }
    if (session.user.id !== admittedOwner) {
      clearTimer()
      publish('loading', null)
    }
    // Never await a Supabase call inside onAuthStateChange: the SDK holds its lock.
    void Promise.resolve().then(async () => {
      if (!active || version !== revision) return
      const started = performance.now()
      let timeout: ReturnType<typeof setTimeout> | undefined
      try {
        const reply = await Promise.race([
          read(),
          new Promise<never>((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Session check timed out')), 10000)
            requests.add(timeout)
          }),
        ])
        if (!active || version !== revision) return
        if (reply.error) throw reply.error
        const data = reply.data as Deadline | null
        if (!data || typeof data.server_time !== 'string'
          || (data.expires_at !== null && typeof data.expires_at !== 'string')) {
          throw new Error('Invalid session check')
        }
        const serverTime = Date.parse(data?.server_time ?? '')
        if (!Number.isFinite(serverTime) || !data) throw new Error('Invalid session check')
        if (data.expires_at === null) { expired = false; expire(); return }
        const deadline = Date.parse(data.expires_at)
        if (!Number.isFinite(deadline)) throw new Error('Invalid session deadline')
        // Subtract the full round trip so latency never extends the server deadline.
        const remaining = Math.min(86400000, deadline - serverTime - (performance.now() - started))
        expired = false
        if (remaining <= 0) { expire(); return }
        clearTimer()
        wallDeadline = Date.now() + remaining
        monotonicDeadline = performance.now() + remaining
        timer = setTimeout(expire, remaining)
        admittedOwner = session.user.id
        publish('signed_in', session)
      } catch {
        if (!active || version !== revision) return
        admittedOwner = undefined
        clearTimer()
        publish('error', null)
      } finally {
        clearTimeout(timeout)
        if (timeout) requests.delete(timeout)
      }
    })
  }

  const recheck = () => {
    if (!current || !active) return
    if (Date.now() >= wallDeadline || performance.now() >= monotonicDeadline) expire()
    else accept(current)
  }
  return {
    accept, recheck,
    dispose: () => {
      active = false
      revision += 1
      clearTimer()
      requests.forEach(clearTimeout)
      requests.clear()
    },
  }
}
