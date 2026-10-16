// @vitest-environment jsdom
import { act } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { AdminDirectoryPage } from '../platform/hosted/admin-client'
import {
  advanceTime, createDirectoryHarness, deferred, directoryPage, directoryUser, fixtureNow,
} from './admin-users-view-helpers'

const api = vi.hoisted(() => ({ read: vi.fn(), mutate: vi.fn() }))
vi.mock('../platform/hosted/admin-client', () => ({
  readAdminUsers: api.read,
  mutateAdminUser: api.mutate,
}))

let view: ReturnType<typeof createDirectoryHarness>
beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.setSystemTime(fixtureNow)
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  api.read.mockResolvedValue(directoryPage([directoryUser('current')]))
  api.mutate.mockResolvedValue({ code: 'ok' })
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  view = createDirectoryHarness()
})
afterEach(async () => {
  await view.dispose()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

test('an already expired ban uses the current mount time instead of module import time', async () => {
  api.read.mockResolvedValue(directoryPage([directoryUser('expired', '2098-12-31T23:59:59.000Z')]))
  await view.render()
  view.expectActive('expired')
})

test('ban expiry updates the visible status, action, and count without another API request', async () => {
  api.read.mockResolvedValue(directoryPage([directoryUser('expiring', '2099-01-01T00:00:01.000Z')]))
  await view.render()
  expect(view.row('expiring').querySelector('.admin-badge')?.textContent).toBe('Banned')
  expect(view.button('Unban', view.row('expiring')).disabled).toBe(false)
  expect(view.bannedCount()).toBe('1')
  await advanceTime(61_000)
  view.expectActive('expiring')
  expect(api.read).toHaveBeenCalledOnce()
})

test.each(['focus', 'visibilitychange'])('resuming via %s updates bans after suspended wall-clock time', async (eventName) => {
  api.read.mockResolvedValue(directoryPage([directoryUser('resuming', '2099-01-01T00:05:00.000Z')]))
  await view.render()
  expect(view.bannedCount()).toBe('1')
  await act(async () => {
    vi.setSystemTime(new Date('2099-01-01T01:00:00.000Z'))
    if (eventName === 'focus') window.dispatchEvent(new Event(eventName))
    else document.dispatchEvent(new Event(eventName))
  })
  view.expectActive('resuming')
})

test('a slow old query cannot replace a newer query result', async () => {
  const older = deferred<AdminDirectoryPage>()
  const newer = deferred<AdminDirectoryPage>()
  api.read.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise)
  await view.render()
  await view.search('newer')
  expect(api.read).toHaveBeenLastCalledWith(1, 25, 'newer')
  await act(async () => newer.resolve(directoryPage([directoryUser('newer')])) )
  expect(view.row('newer')).toBeDefined()
  await act(async () => older.resolve(directoryPage([directoryUser('older')])) )
  expect(view.row('newer')).toBeDefined()
  expect(view.host.textContent).not.toContain('older@example.test')
})

test('an older rejected request cannot overwrite newer success with an error', async () => {
  const older = deferred<AdminDirectoryPage>()
  api.read.mockReturnValueOnce(older.promise)
  await view.render()
  await view.search('current')
  expect(view.row('current')).toBeDefined()
  await act(async () => older.reject(new Error('admin_required')))
  expect(view.row('current')).toBeDefined()
  expect(view.host.querySelector('[role="alert"]')).toBeNull()
})

test.each(['admin_required', 'authentication_required'])('latest %s failure removes stale personal rows, actions, and statistics', async (code) => {
  api.read.mockResolvedValueOnce(directoryPage([directoryUser('private', '2099-01-02T00:00:00Z')]))
  await view.render()
  expect(view.row('private')).toBeDefined()
  api.read.mockRejectedValueOnce(new Error(code))
  await view.search('new-query')
  expect(view.host.querySelector('[role="alert"]')).not.toBeNull()
  expect(view.host.textContent).not.toContain('private@example.test')
  expect(view.host.querySelector('tbody tr')).toBeNull()
  expect([...view.host.querySelectorAll('button')].some((button) => /Ban 24h|Unban|Reset password/.test(button.textContent ?? ''))).toBe(false)
  const stats = [...view.host.querySelectorAll('.admin-stats strong')].map((stat) => stat.textContent)
  expect(stats.slice(0, 2)).toEqual(['—', '—'])
  expect(stats[2]).toBe('0')
})

test('cancelled confirmation sends no mutation and keeps the selected row visible', async () => {
  await view.render()
  vi.mocked(window.confirm).mockReturnValue(false)
  await view.click(view.button('Ban 24h', view.row('current')))
  expect(window.confirm).toHaveBeenCalledOnce()
  expect(api.mutate).not.toHaveBeenCalled()
  expect(api.read).toHaveBeenCalledOnce()
  view.expectActive('current')
})

test.each([
  { kind: 'ban', label: 'Ban 24h', banned: false, duration: '24h' },
  { kind: 'unban', label: 'Unban', banned: true, duration: '24h' },
  { kind: 'send_reset', label: 'Reset password', banned: false, duration: undefined },
])('confirmed $kind targets the exact selected user and shows the refreshed directory', async ({ kind, label, banned, duration }) => {
  const mutation = deferred<{ code: string }>()
  api.read.mockResolvedValueOnce(directoryPage([
    directoryUser('other'),
    directoryUser('selected', banned ? '2099-01-02T00:00:00Z' : undefined),
  ])).mockResolvedValueOnce(directoryPage([directoryUser('refreshed')]))
  api.mutate.mockReturnValueOnce(mutation.promise)
  await view.render()
  await view.click(view.button(label, view.row('selected')))
  expect(api.mutate).toHaveBeenCalledExactlyOnceWith(kind, 'selected', duration)
  expect([...view.host.querySelectorAll('.admin-actions button')].every((button) => button.hasAttribute('disabled'))).toBe(true)
  await act(async () => mutation.resolve({ code: 'ok' }))
  expect(api.read).toHaveBeenCalledTimes(2)
  expect(view.row('refreshed')).toBeDefined()
  expect(view.host.textContent).not.toContain('selected@example.test')
})

test.each(['admin_required', 'authentication_required'])('mutation %s failure removes personal rows and actions after permission loss', async (code) => {
  await view.render()
  expect(view.row('current')).toBeDefined()
  api.mutate.mockRejectedValueOnce(new Error(code))
  await view.click(view.button('Ban 24h', view.row('current')))
  expect(api.mutate).toHaveBeenCalledExactlyOnceWith('ban', 'current', '24h')
  expect(view.host.querySelector('[role="alert"]')).not.toBeNull()
  expect(view.host.textContent).not.toContain('current@example.test')
  expect(view.host.querySelector('tbody tr')).toBeNull()
  expect(view.host.querySelector('.admin-actions')).toBeNull()
  const stats = [...view.host.querySelectorAll('.admin-stats strong')].map((stat) => stat.textContent)
  expect(stats.slice(0, 2)).toEqual(['—', '—'])
  expect(stats[2]).toBe('0')
})

test('a pending directory response after unmount does not trigger another fetch', async () => {
  const response = deferred<AdminDirectoryPage>()
  api.read.mockReturnValueOnce(response.promise)
  await view.render()
  expect(api.read).toHaveBeenCalledOnce()
  await view.dispose()
  await act(async () => response.resolve(directoryPage([directoryUser('late')])) )
  expect(api.read).toHaveBeenCalledOnce()
  expect(view.host.childElementCount).toBe(0)
})

test('a completed mutation after unmount does not fetch the directory again', async () => {
  const mutation = deferred<{ code: string }>()
  api.mutate.mockReturnValueOnce(mutation.promise)
  await view.render()
  await view.click(view.button('Ban 24h', view.row('current')))
  expect(api.mutate).toHaveBeenCalledOnce()
  await view.dispose()
  await act(async () => mutation.resolve({ code: 'ok' }))
  expect(api.read).toHaveBeenCalledOnce()
  expect(view.host.childElementCount).toBe(0)
})
