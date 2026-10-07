/** Fetch until an empty page: a server may cap pages below the requested size. */
export async function readPages<T>(
  fetchPage: (after?: string) => Promise<T[]>,
  rowKey: (row: T) => string,
): Promise<T[]> {
  const result: T[] = []
  let cursor: string | undefined
  const seen = new Set<string>()
  for (;;) {
    const page = await fetchPage(cursor)
    if (!page.length) return result
    for (const row of page) {
      const key = rowKey(row)
      if (!key || seen.has(key)) throw new Error('Pagination did not advance; export was not completed.')
      seen.add(key)
      result.push(row)
    }
    cursor = rowKey(page[page.length - 1])
  }
}
