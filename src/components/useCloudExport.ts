import { useEffect, useRef, useState } from 'react'
import catalogVersion from '../../content/catalog-version.json'
import { requireHostedUser, requireSupabase } from '../platform/hosted/supabase-client'

export function useCloudExport() {
  const [busy, setBusy] = useState(false)
  const [exported, setExported] = useState(false)
  const [error, setError] = useState<'account' | 'export' | null>(null)
  const mounted = useRef(false)
  const inFlight = useRef(false)
  const accountVersion = useRef(0)

  useEffect(() => {
    mounted.current = true
    let owner: string | null | undefined
    const { data } = requireSupabase().auth.onAuthStateChange((event, session) => {
      if (!mounted.current) return
      const nextOwner = session?.user.id ?? null
      if (event === 'SIGNED_OUT' || (owner !== undefined && owner !== nextOwner)) {
        accountVersion.current += 1
        setExported(false)
        setError(null)
      }
      owner = nextOwner
    })
    return () => {
      mounted.current = false
      accountVersion.current += 1
      data.subscription.unsubscribe()
    }
  }, [])

  const download = async () => {
    if (inFlight.current) return
    inFlight.current = true
    const version = accountVersion.current
    setBusy(true)
    setExported(false)
    setError(null)
    const changedAccount = () => {
      if (!mounted.current) return true
      if (version === accountVersion.current) return false
      setError('account')
      return true
    }
    try {
      const user = await requireHostedUser()
      if (changedAccount()) return
      const { data, error: failure } = await requireSupabase().rpc('export_learning_snapshot')
      if (changedAccount()) return
      if (failure || !data) throw new Error('Export unavailable')
      const currentUser = await requireHostedUser()
      if (changedAccount()) return
      if (data.owner_id !== user.id || currentUser.id !== user.id) {
        setError('account')
        return
      }
      const payload = { ...data, catalog: catalogVersion }
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
      try {
        const link = document.createElement('a')
        link.href = url
        link.download = `journey-cloud-${new Date().toISOString().slice(0, 10)}.json`
        link.click()
      } finally {
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
      setExported(true)
    } catch {
      if (!changedAccount()) setError('export')
    } finally {
      inFlight.current = false
      if (mounted.current) setBusy(false)
    }
  }
  return { busy, exported, error, download }
}
