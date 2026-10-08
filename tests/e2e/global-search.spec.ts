import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} global search discards stale results, retries and opens the exact exercise`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    let releaseOld!: () => void
    const oldGate = new Promise<void>((resolve) => { releaseOld = resolve })
    let oldStarted = false
    let oldFinished = false
    let retryFails = true
    const exercise = {
      type: 'exercise', id: 'exercise-0-baseline', slug: 'exercise-0-baseline',
      title: 'Tóm tắt điểm và xử lý dữ liệu thiếu', title_en: 'Summarize scores and handle missing data',
    }
    await page.route('**/api/search?**', async (route) => {
      const query = new URL(route.request().url()).searchParams.get('q')
      if (query === 'old') {
        oldStarted = true
        await oldGate
        await route.fulfill({ json: { results: [{ ...exercise, title: 'Old result', title_en: 'Old result' }] } })
        oldFinished = true
      } else if (query === 'retry' && retryFails) {
        await route.fulfill({ status: 503, json: { detail: 'private internal error' } })
      } else if (query === 'minutes') {
        await route.fulfill({ json: { results: [{ ...exercise, id: 'exercise-0-learning-system',
          slug: 'exercise-0-learning-system', title: 'Tính phút học', title_en: 'Study minutes' }] } })
      } else {
        await route.fulfill({ json: { results: [exercise] } })
      }
    })
    await page.goto('/exercises')
    const search = page.locator('.global-search input')
    await search.fill('old')
    await expect.poll(() => oldStarted).toBe(true)
    await search.fill('scores')
    const option = page.getByRole('option', { name: vi ? /Tóm tắt điểm/ : /Summarize scores/ })
    await expect(option).toBeVisible()
    releaseOld()
    await expect.poll(() => oldFinished).toBe(true)
    await expect(option).toBeVisible()
    await expect(page.getByRole('option', { name: /Old result/ })).toHaveCount(0)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await search.press('ArrowDown')
        await expect(option).toHaveAttribute('aria-selected', 'true')
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/search-evidence/${language}-${theme}-${width}.png`,
          animations: 'disabled' })
      }
    }
    await search.press('Escape')
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(search).toHaveValue('scores')
    await search.press('ArrowDown')
    await search.press('Enter')
    await expect(page).toHaveURL(/\/exercises\?exercise=exercise-0-baseline$/)
    await expect(page.locator('.exercise-detail h2')).toBeFocused()
    await expect(page.locator('.exercise-detail')).toContainText('summarize_scores')
    await page.keyboard.press('Control+k')
    await expect(search).toBeFocused()
    await search.fill('retry')
    await expect(page.locator('.global-search [role="alert"]')).toContainText(vi ? 'Chưa tìm kiếm được' : 'Search failed')
    await expect(search).toHaveValue('retry')
    await expect(page.locator('.global-search')).not.toContainText('private internal error')
    retryFails = false
    await page.locator('.global-search').getByRole('button', { name: vi ? 'Thử lại' : 'Retry' }).click()
    await expect(option).toBeVisible()
    await search.fill('minutes')
    await expect(page.getByRole('option', { name: vi ? /Tính phút học/ : /Study minutes/ })).toBeVisible()
    await search.press('ArrowDown')
    await search.press('Enter')
    await expect(page).toHaveURL(/exercise=exercise-0-learning-system$/)
    await expect(page.locator('.exercise-detail')).toContainText('total_study_minutes')
    await page.goBack()
    await expect(page).toHaveURL(/exercise=exercise-0-baseline$/)
    await expect(page.locator('.exercise-detail')).toContainText('summarize_scores')
    await page.unroute('**/api/search?**')
    await search.fill('exercise-0-environment')
    const actual = await page.request.get('/api/search?q=exercise-0-environment&type=exercises')
    const result = (await actual.json()).results[0]
    await expect(page.getByRole('option')).toContainText(vi ? result.title : result.title_en)
    await search.press('ArrowDown')
    await search.press('Enter')
    await expect(page).toHaveURL(/exercise=exercise-0-environment$/)
    await expect(page.locator('.exercise-detail')).toContainText('inspect_environment')
  })
}
