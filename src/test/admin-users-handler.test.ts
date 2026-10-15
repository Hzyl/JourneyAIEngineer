import { expect, test, vi } from 'vitest'
import { handleAdminUsers, type AdminUserServices } from '../../supabase/functions/admin-users/handler'

const target = { id: '11111111-1111-4111-8111-111111111111', email: 'learner@example.com', created_at: '2026-01-01T00:00:00Z', confirmed_at: null, last_sign_in_at: null, banned_until: null }
const actor = '22222222-2222-4222-8222-222222222222'
function services(overrides: Partial<AdminUserServices> = {}): AdminUserServices {
  return {
    identify: vi.fn(async () => ({ id: actor })),
    isAdmin: vi.fn(async () => true),
    listUsers: vi.fn(async () => ({ users: [target], total: 1 })),
    getUser: vi.fn(async () => target),
    isAdminTarget: vi.fn(async () => false),
    ban: vi.fn(async () => true),
    unban: vi.fn(async () => true),
    sendReset: vi.fn(async () => true),
    audit: vi.fn(async () => true),
    ...overrides,
  }
}

test('admin GET returns paginated users and validates query', async () => {
  const api = services()
  const response = await handleAdminUsers(new Request('https://fn.test/admin-users?page=2&per_page=10&q=learner', { headers: { Authorization: 'Bearer token', Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test/auth/callback?mode=recovery')
  expect(response.status).toBe(200)
  expect((await response.json()).pages).toBe(1)
  expect(api.listUsers).toHaveBeenCalledWith({ page: 2, perPage: 10, q: 'learner' })
})

test('ban rejects self lockout and audits successful mutations', async () => {
  const api = services()
  const self = await handleAdminUsers(new Request('https://fn.test', { method: 'POST', body: JSON.stringify({ action: 'ban', user_id: actor, duration: '24h' }), headers: { Authorization: 'Bearer token', Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test/auth/callback?mode=recovery')
  expect(self.status).toBe(409)
  const response = await handleAdminUsers(new Request('https://fn.test', { method: 'POST', body: JSON.stringify({ action: 'ban', user_id: target.id, duration: '24h' }), headers: { Authorization: 'Bearer token', Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test/auth/callback?mode=recovery')
  expect(response.status).toBe(200)
  expect(api.ban).toHaveBeenCalledWith(target.id, '24h')
  expect(api.audit).toHaveBeenCalledWith(actor, target.id, 'ban', { duration: '24h' })
})

test('reset never returns a link and protects admin targets', async () => {
  const api = services({ isAdminTarget: vi.fn(async () => true) })
  const response = await handleAdminUsers(new Request('https://fn.test', { method: 'POST', body: JSON.stringify({ action: 'send_reset', user_id: target.id }), headers: { Authorization: 'Bearer token', Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test/auth/callback?mode=recovery')
  expect(response.status).toBe(409)
  expect(await response.text()).not.toContain('token')
})

test('unknown origin and missing bearer are rejected before provider calls', async () => {
  const api = services()
  const origin = await handleAdminUsers(new Request('https://fn.test', { headers: { Origin: 'https://evil.test' } }), api, new Set(['https://app.test']), 'https://app.test')
  expect(origin.status).toBe(403)
  const auth = await handleAdminUsers(new Request('https://fn.test', { headers: { Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test')
  expect(auth.status).toBe(401)
  expect(api.identify).not.toHaveBeenCalled()
})

test('reset mutation supplies only the fixed recovery callback path', async () => {
  const sendReset = vi.fn(async () => true)
  const api = services({ sendReset })
  const response = await handleAdminUsers(new Request('https://fn.test', { method: 'POST', body: JSON.stringify({ action: 'send_reset', user_id: target.id }), headers: { Authorization: 'Bearer token', Origin: 'https://app.test' } }), api, new Set(['https://app.test']), 'https://app.test')
  expect(response.status).toBe(200)
  expect(sendReset).toHaveBeenCalledWith(target.email, 'https://app.test/auth/callback?mode=recovery')
})
