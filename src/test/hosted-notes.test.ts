import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const services = vi.hoisted(() => ({ requireHostedUser: vi.fn(), requireSupabase: vi.fn() }))
vi.mock('../platform/hosted/supabase-client', () => services)

type Note = { id: string; user_id: string; lesson_slug: string | null; title: string; body: string }
type Failure = { code?: string; message: string }
const duplicate = { code: '23505', message: 'duplicate key' }
const payload = { lesson_slug: 'phase-00-onboarding-environment-1', title: 'My note', body: 'Keep this once' }
let rows: Map<string, Note>
let lostResponse: boolean
let insertError: Failure | null
let readError: Failure | null
let beforeInsert: (() => Promise<void>) | undefined
let insertedIds: string[]
let readFilters: Record<string, string>[]

afterEach(() => { vi.unstubAllGlobals() })

// Emulate only the external storage boundary, including primary-key uniqueness.
// The hosted client and real mutation/sessionStorage lifecycle run unchanged.
beforeEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
  const storage = new Map<string, string>()
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  })
  rows = new Map()
  insertedIds = []
  readFilters = []
  lostResponse = false
  insertError = readError = null
  beforeInsert = undefined
  services.requireHostedUser.mockResolvedValue({ id: 'user-one' })
  services.requireSupabase.mockReturnValue({ from: (table: string) => {
    if (table !== 'notes') throw new Error(`Unexpected table: ${table}`)
    let inserted: Note | undefined
    const filters: Record<string, string> = {}
    const query = {
      insert: (value: Note) => { inserted = value; return query },
      select: () => query,
      eq: (key: string, value: string) => { filters[key] = value; return query },
      single: async () => {
        if (!inserted) {
          readFilters.push({ ...filters })
          if (readError) return { data: null, error: readError }
          const data = [...rows.values()].find((row) => Object.entries(filters)
            .every(([key, value]) => row[key as keyof Note] === value))
          return { data: data ?? null, error: data ? null : { message: 'row not found' } }
        }
        await beforeInsert?.()
        const row = { ...inserted, id: inserted.id ?? crypto.randomUUID() }
        insertedIds.push(row.id)
        if (insertError) return { data: null, error: insertError }
        if (rows.has(row.id)) return { data: null, error: duplicate }
        rows.set(row.id, row)
        if (lostResponse) { lostResponse = false; return { data: null, error: { message: 'response lost' } } }
        return { data: row, error: null }
      },
    }
    return query
  } })
})

test('retry after a committed but lost response returns the same note once', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  const result = await hostedApi.createNote(payload)
  expect(rows.size).toBe(1)
  expect(result.id).toBe(insertedIds[0])
  expect(readFilters).toEqual([{ id: result.id, user_id: 'user-one' }])
})

test('module reload recovers the pending request from the same sessionStorage', async () => {
  const first = (await import('../platform/hosted/hosted-client')).hostedApi
  lostResponse = true
  await expect(first.createNote(payload)).rejects.toThrow('response lost')
  vi.resetModules()
  const reloaded = (await import('../platform/hosted/hosted-client')).hostedApi
  const result = await reloaded.createNote(payload)
  expect(result.id).toBe(insertedIds[0])
  expect(rows.size).toBe(1)
})

test('simultaneous identical saves share the in-flight action', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })
  beforeInsert = vi.fn(() => gate)
  const first = hostedApi.createNote(payload)
  const second = hostedApi.createNote({ ...payload })
  await vi.waitFor(() => expect(beforeInsert).toHaveBeenCalled())
  // Give both digests time to reach the in-flight request map.
  await new Promise((resolve) => setTimeout(resolve, 20))
  beforeInsert = undefined
  release()
  const results = await Promise.all([first, second])
  expect(results[0].id).toBe(results[1].id)
  expect(rows.size).toBe(1)
  expect(insertedIds).toHaveLength(1)
})

test('acknowledged identical actions create separate notes', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  const first = await hostedApi.createNote(payload)
  const second = await hostedApi.createNote(payload)
  expect(second.id).not.toBe(first.id)
  expect(rows.size).toBe(2)
})

test.each(['body', 'title', 'lesson_slug'] as const)('changed %s is a distinct action', async (field) => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  const result = await hostedApi.createNote({ ...payload, [field]: 'different' })
  expect(result.id).not.toBe(insertedIds[0])
  expect(rows.size).toBe(2)
})

test('another user cannot reuse the first user pending action', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  services.requireHostedUser.mockResolvedValue({ id: 'user-two' })
  const result = await hostedApi.createNote(payload)
  expect(result.id).not.toBe(insertedIds[0])
  expect(rows.get(result.id)?.user_id).toBe('user-two')
})

test.each(['body', 'title', 'lesson_slug'] as const)('a conflicting %s is neither overwritten nor acknowledged', async (field) => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  const row = rows.get(insertedIds[0])!
  row[field] = 'different stored content'
  await expect(hostedApi.createNote(payload)).rejects.toThrow('duplicate key')
  expect(rows.size).toBe(1)
  expect(row[field]).toBe('different stored content')
  row[field] = payload[field]
  expect((await hostedApi.createNote(payload)).id).toBe(row.id)
})

test('a conflicting ID owned by another account is not acknowledged', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  rows.get(insertedIds[0])!.user_id = 'another-owner'
  await expect(hostedApi.createNote(payload)).rejects.toThrow('row not found')
  expect(rows.size).toBe(1)
})

test('failed conflict read keeps the request pending for a later retry', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  lostResponse = true
  await expect(hostedApi.createNote(payload)).rejects.toThrow('response lost')
  readError = { message: 'read unavailable' }
  await expect(hostedApi.createNote(payload)).rejects.toThrow('read unavailable')
  readError = null
  expect((await hostedApi.createNote(payload)).id).toBe(insertedIds[0])
  expect(rows.size).toBe(1)
})

test('unrelated insert errors propagate without trying to read a note', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  insertError = { code: '42501', message: 'access denied' }
  await expect(hostedApi.createNote(payload)).rejects.toThrow('access denied')
  expect(readFilters).toEqual([])
  expect(rows.size).toBe(0)
})

test('an omitted lesson is stored consistently as null', async () => {
  const { hostedApi } = await import('../platform/hosted/hosted-client')
  const note = { title: 'General', body: 'Unattached' }
  lostResponse = true
  await expect(hostedApi.createNote(note)).rejects.toThrow('response lost')
  const result = await hostedApi.createNote({ ...note, lesson_slug: undefined })
  expect(result.lesson_slug).toBeNull()
  expect(rows.size).toBe(1)
})
