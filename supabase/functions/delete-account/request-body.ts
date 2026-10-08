const MAX_BODY_BYTES = 8192

type BodyResult = { ok: true; text: string }
  | { ok: false; status: 400 | 413; code: 'invalid_request' | 'body_too_large' }

export async function readDeletionBody(request: Request): Promise<BodyResult> {
  if (!request.body) return { ok: true, text: '' }
  const reader = request.body.getReader()
  const bytes = new Uint8Array(MAX_BODY_BYTES)
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (length + value.byteLength > MAX_BODY_BYTES) {
        // Do not wait for an untrusted source to acknowledge cancellation.
        void reader.cancel().catch(() => undefined)
        return { ok: false, status: 413, code: 'body_too_large' }
      }
      bytes.set(value, length)
      length += value.byteLength
    }
  } finally {
    reader.releaseLock()
  }
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, length))
    return { ok: true, text }
  } catch {
    return { ok: false, status: 400, code: 'invalid_request' }
  }
}
