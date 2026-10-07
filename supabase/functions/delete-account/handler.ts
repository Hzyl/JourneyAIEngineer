type Identity = { id: string; email?: string; factors?: { status: string }[] }
export type DeletionServices = {
  identify: (token: string) => Promise<Identity | null>
  reauthenticate: (email: string, password: string) => Promise<string | null>
  remove: (id: string) => Promise<boolean>
}

export async function handleDeletion(request: Request, services: DeletionServices, origins: Set<string>) {
  const origin = request.headers.get('Origin')
  const allowed = origin !== null && origins.has(origin)
  const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' })
  if (allowed) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Headers', 'authorization, apikey, content-type, x-client-info')
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  }
  const respond = (status: number, code: string) => new Response(JSON.stringify({ code }), { status, headers })
  if (origin && !allowed) return respond(403, 'origin_not_allowed')
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return respond(405, 'method_not_allowed')
  const token = request.headers.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1]
  if (!token) return respond(401, 'authentication_required')
  try {
    const text = await request.text()
    if (text.length > 8192) return respond(413, 'body_too_large')
    let body
    try { body = JSON.parse(text) } catch { return respond(400, 'invalid_request') }
    if (!body || body.confirmation !== 'DELETE' || typeof body.password !== 'string'
      || !body.password || body.password.length > 4096) return respond(400, 'confirmation_required')
    const user = await services.identify(token)
    if (!user?.email) return respond(401, 'authentication_required')
    // This beta supports password reauthentication only. Never bypass an enrolled second factor.
    if (user.factors?.some((factor) => factor.status === 'verified')) {
      return respond(409, 'mfa_deletion_not_supported')
    }
    const confirmedId = await services.reauthenticate(user.email, body.password)
    if (confirmedId !== user.id) return respond(403, 'reauthentication_failed')
    // The target comes exclusively from the verified session, never the request body.
    if (!await services.remove(user.id)) return respond(503, 'deletion_failed')
    return respond(200, 'account_deleted')
  } catch {
    // Do not log passwords, bearer tokens or provider responses.
    return respond(503, 'deletion_failed')
  }
}
