import { useEffect, useRef, useState } from 'react'
import type { SecurityAuditReport } from '../api'
import { learningClient as api } from '../platform/learning-client'

export function useSecurityAudit() {
  const [report, setReport] = useState<SecurityAuditReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [revision, setRevision] = useState(0)
  const pending = useRef(true)
  useEffect(() => {
    let current = true
    void api.securityAudit().then((next) => {
      if (current) setReport(next)
    }).catch(() => {
      if (current) setFailed(true)
    }).finally(() => {
      if (current) {
        pending.current = false
        setLoading(false)
      }
    })
    return () => { current = false }
  }, [revision])
  const reload = () => {
    if (pending.current) return
    pending.current = true
    setLoading(true)
    setFailed(false)
    setRevision((value) => value + 1)
  }
  return { report, loading, failed, reload }
}
