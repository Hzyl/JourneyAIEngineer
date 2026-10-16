import { useEffect, useState } from 'react'
import type { AdminDirectoryUser } from '../platform/hosted/admin-client'

/** Recompute displayed expiry locally; the server still authorizes every action. */
export function useAdminBanClock(users: AdminDirectoryUser[] | undefined) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const refresh = () => {
      clearTimeout(timer)
      const current = Date.now()
      setNow(current)
      const futureExpiries = (users ?? [])
        .map((user) => Date.parse(user.banned_until ?? ''))
        .filter((expiry) => expiry > current)
      if (futureExpiries.length) {
        timer = setTimeout(refresh, Math.min(60_000, Math.min(...futureExpiries) - current))
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [users])
  return now
}
