import { expect, test, vi } from 'vitest'
import { handleDeletion, type DeletionServices } from '../../supabase/functions/delete-account/handler'

const origins = new Set(['https://learning.example'])
const headers = { Origin: 'https://learning.example', Authorization: 'Bearer synthetic-token' }
const encoder = new TextEncoder()
const services = (): DeletionServices => ({
  identify: vi.fn(async () => ({ id: 'account-A', email: 'learner@example.invalid' })),
  reauthenticate: vi.fn(async () => 'account-A'),
  remove: vi.fn(async () => true),
})
const payload = (password = 'synthetic-password') => JSON.stringify({ confirmation: 'DELETE', password })
const request = (body: BodyInit, extra: Record<string, string> = {}) =>
  new Request('https://function.example/delete-account', {
    method: 'POST', headers: { ...headers, ...extra }, body, duplex: 'half',
  } as RequestInit & { duplex: 'half' })

test('an oversized stream stops reading and cancels before calling account services', async () => {
  const api = services()
  let reads = 0
  const cancel = vi.fn()
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      reads += 1
      controller.enqueue(encoder.encode('x'.repeat(8193)))
      if (reads === 3) controller.close()
    },
    cancel,
  }, { highWaterMark: 0 })
  const response = await handleDeletion(request(stream), api, origins)
  expect(response.status).toBe(413)
  expect(await response.json()).toEqual({ code: 'body_too_large' })
  expect(reads).toBe(1)
  expect(cancel).toHaveBeenCalledOnce()
  expect(api.identify).not.toHaveBeenCalled()
  expect(api.reauthenticate).not.toHaveBeenCalled()
  expect(api.remove).not.toHaveBeenCalled()
})

test('the body limit counts UTF-8 bytes rather than JavaScript characters', async () => {
  const api = services()
  const body = payload('学'.repeat(2800))
  expect(body.length).toBeLessThan(8192)
  expect(encoder.encode(body).byteLength).toBeGreaterThan(8192)
  const response = await handleDeletion(request(body), api, origins)
  expect(response.status).toBe(413)
  expect(api.identify).not.toHaveBeenCalled()
  expect(api.remove).not.toHaveBeenCalled()
})

test('the byte budget is cumulative across otherwise small chunks', async () => {
  const api = services()
  let reads = 0
  const cancel = vi.fn()
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      reads += 1
      controller.enqueue(new Uint8Array(reads < 3 ? 4096 : 1))
      if (reads === 4) controller.close()
    },
    cancel,
  }, { highWaterMark: 0 })
  const response = await handleDeletion(request(stream), api, origins)
  expect(response.status).toBe(413)
  expect(reads).toBe(3)
  expect(cancel).toHaveBeenCalledOnce()
  expect(api.identify).not.toHaveBeenCalled()
})

test.each(['reject', 'pending'])('stream cancellation may %s without delaying the size response', async (mode) => {
  const api = services()
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) { controller.enqueue(new Uint8Array(8193)) },
    cancel() {
      return mode === 'reject' ? Promise.reject(new Error('Private cancellation detail')) : new Promise(() => {})
    },
  }, { highWaterMark: 0 })
  const response = await handleDeletion(request(stream), api, origins)
  expect(response.status).toBe(413)
  expect(await response.json()).toEqual({ code: 'body_too_large' })
  expect(api.remove).not.toHaveBeenCalled()
}, 1000)

test('a dishonest Content-Length cannot bypass the streamed byte limit', async () => {
  const api = services()
  const response = await handleDeletion(request(payload() + ' '.repeat(8192), { 'Content-Length': '1' }), api, origins)
  expect(response.status).toBe(413)
  expect(api.remove).not.toHaveBeenCalled()
})

test.each([8192, 8193])('the encoded body boundary is enforced at %s bytes', async (size) => {
  const api = services()
  const json = payload()
  const body = json + ' '.repeat(size - encoder.encode(json).length)
  const response = await handleDeletion(request(body), api, origins)
  expect(response.status).toBe(size === 8192 ? 200 : 413)
  expect(api.remove).toHaveBeenCalledTimes(size === 8192 ? 1 : 0)
})

test('split UTF-8 characters decode without changing the reauthentication password', async () => {
  const api = services()
  const password = 'mật-khẩu-学'
  const bytes = encoder.encode(payload(password))
  let position = 0
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (position === bytes.length) controller.close()
      else controller.enqueue(bytes.slice(position, ++position))
    },
  }, { highWaterMark: 0 })
  const response = await handleDeletion(request(stream), api, origins)
  expect(response.status).toBe(200)
  expect(api.reauthenticate).toHaveBeenCalledExactlyOnceWith('learner@example.invalid', password)
})

test('malformed UTF-8 is rejected instead of replacing password bytes', async () => {
  const api = services()
  const prefix = encoder.encode('{"confirmation":"DELETE","password":"')
  const suffix = encoder.encode('"}')
  const body = new Uint8Array([...prefix, 0xc3, 0x28, ...suffix])
  const response = await handleDeletion(request(body), api, origins)
  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({ code: 'invalid_request' })
  expect(api.identify).not.toHaveBeenCalled()
})

test('a broken input stream fails without disclosing details or deleting an account', async () => {
  const api = services()
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) { controller.error(new Error('Private upstream detail')) },
  })
  const response = await handleDeletion(request(stream), api, origins)
  expect(response.status).toBe(503)
  expect(await response.json()).toEqual({ code: 'deletion_failed' })
  expect(api.remove).not.toHaveBeenCalled()
})
