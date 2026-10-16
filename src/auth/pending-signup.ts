import { useMemo, useSyncExternalStore } from 'react'

export type PendingSignup = { email: string; resendAfter: number; expiresAt: number }
const storageKey = 'journey-pending-signup'
const changedEvent = 'journey:pending-signup'
const lifetime = 60 * 60 * 1000
let memory: string | null = null

function parse(value: string | null): PendingSignup | null {
  try {
    const pending: unknown = JSON.parse(value ?? 'null')
    if (!pending || typeof pending !== 'object') return null
    if (!('email' in pending) || typeof pending.email !== 'string'
      || !pending.email.includes('@') || pending.email.length > 320) return null
    if (!('expiresAt' in pending) || typeof pending.expiresAt !== 'number'
      || !Number.isFinite(pending.expiresAt) || pending.expiresAt <= Date.now()
      || pending.expiresAt > Date.now() + lifetime) return null
    if (!('resendAfter' in pending) || typeof pending.resendAfter !== 'number'
      || !Number.isFinite(pending.resendAfter) || pending.resendAfter < 0
      || pending.resendAfter > pending.expiresAt) return null
    return { email: pending.email, resendAfter: pending.resendAfter, expiresAt: pending.expiresAt }
  } catch {
    return null
  }
}

function snapshot(): string | null {
  let value = memory
  try {
    value = sessionStorage.getItem(storageKey)
  } catch { /* Private browsing can make storage unavailable. */ }
  return parse(value) ? value : null
}

function publish(value: string | null): void {
  memory = value
  try {
    if (value === null) sessionStorage.removeItem(storageKey)
    else sessionStorage.setItem(storageKey, value)
  } catch { /* In-memory state still works until this tab is reloaded. */ }
  window.dispatchEvent(new Event(changedEvent))
}

export function rememberPendingSignup(email: string, justSent: boolean): void {
  const now = Date.now()
  // This is a tab-local display intent, never proof of confirmation or admission.
  publish(JSON.stringify({ email: email.trim(), resendAfter: justSent ? now + 60000 : 0, expiresAt: now + lifetime }))
}

export function clearPendingSignup(): void {
  publish(null)
}

export function readPendingSignup(): PendingSignup | null {
  return parse(snapshot())
}

function subscribe(change: () => void): () => void {
  const events = [changedEvent, 'focus', 'pageshow']
  events.forEach((event) => window.addEventListener(event, change))
  return () => events.forEach((event) => window.removeEventListener(event, change))
}

export function usePendingSignup(): PendingSignup | null {
  const value = useSyncExternalStore(subscribe, snapshot, () => null)
  return useMemo(() => parse(value), [value])
}
