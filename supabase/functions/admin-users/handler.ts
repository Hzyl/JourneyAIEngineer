const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type AdminDirectoryUser = {
  id: string
  email: string | null
  created_at: string
  confirmed_at: string | null
  last_sign_in_at: string | null
  banned_until: string | null
}

export type AdminUserServices = {
  identify: (token: string) => Promise<{ id: string } | null>
  isAdmin: (id: string) => Promise<boolean>
  listUsers: (query: { page: number; perPage: number; q: string }) => Promise<{ users: AdminDirectoryUser[]; total: number }>
  getUser: (id: string) => Promise<AdminDirectoryUser | null>
  isAdminTarget: (id: string) => Promise<boolean>
  ban: (id: string, duration: string) => Promise<boolean>
  unban: (id: string) => Promise<boolean>
  sendReset: (email: string, redirectTo: string) => Promise<boolean>
  audit: (adminId: string, targetId: string, action: string, metadata: Record<string, string>) => Promise<boolean>
}

function providerStatus(error: unknown): number {
  const value = error as { status?: unknown }
  return value && typeof value.status === 'number' && [429, 500, 502, 503, 504].includes(value.status)
    ? value.status : 503
}

function validBanDuration(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const match = /^(\d+)([mhd])$/.exec(value)
  if (!match) return false
  const amount = Number(match[1])
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 8760
}

function responseHeaders(origin: string | null, allowed: boolean) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  })
  if (allowed && origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Headers', 'authorization, apikey, content-type, x-client-info')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  }
  return headers
}

export async function handleAdminUsers(request: Request, services: AdminUserServices, origins: Set<string>, redirectTo: string) {
  const origin = request.headers.get('Origin')
  const allowed = origin !== null && origins.has(origin)
  const headers = responseHeaders(origin, allowed)
  const respond = (status: number, code: string, body: Record<string, unknown> = { code }) =>
    new Response(JSON.stringify(body), { status, headers })
  if (origin && !allowed) return respond(403, 'origin_not_allowed')
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'GET' && request.method !== 'POST') return respond(405, 'method_not_allowed')
  const token = request.headers.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1]
  if (!token) return respond(401, 'authentication_required')
  try {
    const actor = await services.identify(token)
    if (!actor || !await services.isAdmin(actor.id)) return respond(403, 'admin_required')
    if (request.method === 'GET') {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') ?? '1')
      const perPage = Number(url.searchParams.get('per_page') ?? '25')
      const q = (url.searchParams.get('q') ?? '').trim()
      if (!Number.isInteger(page) || page < 1 || page > 10_000
        || !Number.isInteger(perPage) || perPage < 1 || perPage > 100 || q.length > 200) {
        return respond(400, 'invalid_query')
      }
      const result = await services.listUsers({ page, perPage, q })
      return respond(200, 'ok', { ...result, page, per_page: perPage, pages: Math.max(1, Math.ceil(result.total / perPage)) })
    }
    const raw = await request.text()
    if (raw.length > 16_384) return respond(413, 'request_too_large')
    let body: Record<string, unknown>
    try { body = JSON.parse(raw) as Record<string, unknown> } catch { return respond(400, 'invalid_request') }
    const action = body.action
    const targetId = body.user_id
    if (typeof action !== 'string' || !['ban', 'unban', 'send_reset'].includes(action)
      || typeof targetId !== 'string' || !UUID.test(targetId)) return respond(400, 'invalid_request')
    if (targetId === actor.id) return respond(409, 'self_lockout_not_allowed')
    if (await services.isAdminTarget(targetId)) return respond(409, 'admin_target_protected')
    const target = await services.getUser(targetId)
    if (!target) return respond(404, 'user_not_found')
    let ok = false
    const metadata: Record<string, string> = {}
    if (action === 'ban') {
      if (!validBanDuration(body.duration)) return respond(400, 'invalid_ban_duration')
      metadata.duration = body.duration
      ok = await services.ban(targetId, body.duration)
    } else if (action === 'unban') {
      ok = await services.unban(targetId)
    } else {
      if (!target.email) return respond(400, 'user_email_missing')
      ok = await services.sendReset(target.email, `${redirectTo}/auth/callback?mode=recovery`)
    }
    if (!ok) return respond(503, 'provider_operation_failed')
    if (!await services.audit(actor.id, targetId, action, metadata)) return respond(503, 'audit_failed')
    return respond(200, 'ok', { code: 'ok', action, user_id: targetId })
  } catch (error) {
    return respond(providerStatus(error), providerStatus(error) === 429 ? 'rate_limited' : 'provider_unavailable')
  }
}
