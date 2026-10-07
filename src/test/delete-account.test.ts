import { expect, test, vi } from 'vitest'
import { handleDeletion, type DeletionServices } from '../../supabase/functions/delete-account/handler'

const origins = new Set(['https://learning.example'])
const services = (): DeletionServices => ({
  identify: vi.fn(async () => ({ id: 'account-A', email: 'learner@example.invalid' })),
  reauthenticate: vi.fn(async () => 'account-A'),
  remove: vi.fn(async () => true),
})
const request = (body: unknown, token = 'verified-by-service', origin = 'https://learning.example') =>
  new Request('https://function.example/delete-account', { method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Origin: origin }, body: JSON.stringify(body) })

test('deletion target is the verified account even if the body names another user', async () => {
  const api = services()
  const response = await handleDeletion(request({ confirmation: 'DELETE', password: 'test-password', user_id: 'victim' }), api, origins)
  expect(response.status).toBe(200)
  expect(api.remove).toHaveBeenCalledExactlyOnceWith('account-A')
  expect(response.headers.get('Cache-Control')).toBe('no-store')
})

test('wrong confirmation, untrusted origin, invalid identity and wrong password cannot delete', async () => {
  const api = services()
  expect((await handleDeletion(request({ confirmation: 'yes', password: 'test' }), api, origins)).status).toBe(400)
  expect((await handleDeletion(request({ confirmation: 'DELETE', password: 'test' }, 'token', 'https://evil.example'), api, origins)).status).toBe(403)
  api.identify = vi.fn(async () => null)
  expect((await handleDeletion(request({ confirmation: 'DELETE', password: 'test' }), api, origins)).status).toBe(401)
  api.identify = vi.fn(async () => ({ id: 'account-A', email: 'learner@example.invalid' }))
  api.reauthenticate = vi.fn(async () => 'different-account')
  expect((await handleDeletion(request({ confirmation: 'DELETE', password: 'test' }), api, origins)).status).toBe(403)
  expect(api.remove).not.toHaveBeenCalled()
})

test('MFA and provider errors fail closed without exposing sensitive errors', async () => {
  const api = services()
  api.identify = vi.fn(async () => ({ id: 'account-A', email: 'learner@example.invalid', factors: [{ status: 'verified' }] }))
  expect((await handleDeletion(request({ confirmation: 'DELETE', password: 'test' }), api, origins)).status).toBe(409)
  api.identify = vi.fn(async () => { throw new Error('sensitive provider detail') })
  const response = await handleDeletion(request({ confirmation: 'DELETE', password: 'test' }), api, origins)
  expect(await response.text()).not.toContain('sensitive')
  expect(api.remove).not.toHaveBeenCalled()
})
