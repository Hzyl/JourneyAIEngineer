import { authReturnPath } from '../public/public-navigation'

const storageKey = 'journey-confirmation-return'
const lifetime = 60 * 60 * 1000

export function clearConfirmationReturn(): void {
  try { localStorage.removeItem(storageKey) } catch { /* Storage is optional. */ }
}

export function rememberConfirmationReturn(): void {
  // Keep the allowlisted email callback unchanged. This non-sensitive destination
  // can be recovered when the email opens another tab in the same browser.
  try {
    localStorage.setItem(storageKey, JSON.stringify({ path: authReturnPath(), expiresAt: Date.now() + lifetime }))
  } catch { /* A blocked storage area falls back to the home page. */ }
}

export function consumeConfirmationReturn(): string {
  let stored: unknown
  try { stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null') } catch { /* Treat corrupt storage as absent. */ }
  clearConfirmationReturn()
  const explicit = new URLSearchParams(window.location.search).get('next')
  if (explicit !== null) return authReturnPath(explicit)
  if (typeof stored !== 'object' || stored === null || !('path' in stored) || !('expiresAt' in stored)) return '/'
  if (typeof stored.path !== 'string' || typeof stored.expiresAt !== 'number' || stored.expiresAt <= Date.now()) return '/'
  return authReturnPath(stored.path)
}
