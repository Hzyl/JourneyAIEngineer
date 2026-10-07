import { expect, test } from 'vitest'
import { withMutationRequest } from '../platform/mutation-request'

test('an uncertain response keeps the request ID; an acknowledged new action gets a new ID', async () => {
  const seen: string[] = []
  let available = false
  const send = async (id: string) => {
    seen.push(id)
    if (!available) throw new Error('connection lost')
    return { saved: true }
  }
  await expect(withMutationRequest('test-user-A', 'session', { minutes: 25, note: 'test' }, send)).rejects.toThrow()
  available = true
  await withMutationRequest('test-user-A', 'session', { note: 'test', minutes: 25 }, send)
  await withMutationRequest('test-user-A', 'session', { minutes: 25, note: 'test' }, send)
  expect(seen[0]).toBe(seen[1])
  expect(seen[2]).not.toBe(seen[0])
})

test('another account never reuses a pending request from the previous account', async () => {
  let first = ''
  await expect(withMutationRequest('test-user-B', 'progress', { minutes: 10 }, async (id) => {
    first = id
    throw new Error('offline')
  })).rejects.toThrow()
  const second = await withMutationRequest('test-user-C', 'progress', { minutes: 10 }, async (id) => id)
  expect(second).not.toBe(first)
})
