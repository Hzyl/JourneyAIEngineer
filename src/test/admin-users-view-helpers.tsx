import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { expect, vi } from 'vitest'
import { AdminUsersView } from '../components/AdminUsersView'
import type { AdminDirectoryPage, AdminDirectoryUser } from '../platform/hosted/admin-client'

export const fixtureNow = new Date('2099-01-01T00:00:00.000Z')

export function directoryUser(id: string, bannedUntil?: string): AdminDirectoryUser {
  return {
    id,
    email: `${id}@example.test`,
    created_at: '2026-01-01T00:00:00Z',
    confirmed_at: '2026-01-01T00:00:00Z',
    last_sign_in_at: undefined,
    banned_until: bannedUntil,
  }
}

export function directoryPage(users: AdminDirectoryUser[]): AdminDirectoryPage {
  return { users, total: users.length, page: 1, per_page: 25, pages: 1 }
}

export function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

export function createDirectoryHarness() {
  const host = document.createElement('div')
  document.body.append(host)
  const root: Root = createRoot(host)
  let mounted = true
  const render = () => act(async () => root.render(<AdminUsersView language="en" />))
  const dispose = async () => {
    if (mounted) {
      await act(async () => root.unmount())
      mounted = false
    }
    host.remove()
  }
  const search = async (query: string) => {
    const input = host.querySelector<HTMLInputElement>('input[type="search"]')!
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, query)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await act(async () => {
      host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }
  const row = (id: string) => {
    const result = [...host.querySelectorAll('tbody tr')].find((candidate) => candidate.textContent?.includes(`${id}@example.test`))
    expect(result, `Visible row for ${id}`).toBeDefined()
    return result as HTMLTableRowElement
  }
  const button = (label: string, scope: Element = host) => {
    const result = [...scope.querySelectorAll('button')].find((candidate) => candidate.textContent === label)
    expect(result, `Visible button ${label}`).toBeDefined()
    return result as HTMLButtonElement
  }
  const click = (element: HTMLButtonElement) => act(async () => element.click())
  const bannedCount = () => host.querySelectorAll('.admin-stats strong')[2]?.textContent
  const expectActive = (id: string) => {
    const userRow = row(id)
    expect(userRow.querySelector('.admin-badge')?.textContent).toBe('Active')
    expect(button('Ban 24h', userRow).disabled).toBe(false)
    expect(userRow.textContent).not.toContain('Unban')
    expect(bannedCount()).toBe('0')
  }
  return { host, render, dispose, search, row, button, click, bannedCount, expectActive }
}

export async function advanceTime(milliseconds: number) {
  await act(async () => vi.advanceTimersByTimeAsync(milliseconds))
}
