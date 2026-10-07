type Payload = Record<string, string | number | boolean | null>
const pending = new Map<string, Promise<unknown>>()
const fallback = new Map<string, string>()

function storedId(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? fallback.get(key) ?? null
  } catch {
    return fallback.get(key) ?? null
  }
}

function remember(key: string, value: string | null) {
  if (value) fallback.set(key, value)
  else fallback.delete(key)
  try {
    if (value) sessionStorage.setItem(key, value)
    else sessionStorage.removeItem(key)
  } catch {
    // Private browsing can reject storage; in-memory retries still share the ID.
  }
}

export async function withMutationRequest<T>(
  scope: string,
  operation: string,
  payload: Payload,
  send: (requestId: string) => Promise<T>,
): Promise<T> {
  const canonical = JSON.stringify(Object.fromEntries(Object.entries(payload).sort(([a], [b]) => a.localeCompare(b))))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${operation}:${canonical}`))
  const fingerprint = Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')
  const key = `journey-mutation:${scope}:${fingerprint}`
  const existing = pending.get(key)
  if (existing) return existing as Promise<T>
  const requestId = storedId(key) ?? crypto.randomUUID()
  remember(key, requestId)
  const result = Promise.resolve().then(() => send(requestId)).then((response) => {
    remember(key, null)
    return response
  }).finally(() => { pending.delete(key) })
  pending.set(key, result)
  return result
}
