import { expect, test } from 'vitest'
import { readPages } from '../platform/read-pages'

test('includes all 1251 rows when the server caps responses below the requested page size', async () => {
  const rows = Array.from({ length: 1251 }, (_, id) => ({ id: String(id).padStart(5, '0') }))
  const result = await readPages(async (after) => rows.filter((row) => !after || row.id > after).slice(0, 73),
    (row) => row.id)
  expect(result).toEqual(rows)
})

test('does not silently return partial data when a later page fails or repeats', async () => {
  await expect(readPages(async (after) => {
    if (after) throw new Error('offline')
    return [{ id: 'first' }]
  }, (row) => row.id)).rejects.toThrow('offline')
  await expect(readPages(async () => [{ id: 'same' }], (row) => row.id)).rejects.toThrow('did not advance')
})
