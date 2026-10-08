import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

const slug = 'phase-00-onboarding-environment-1'
for (const language of ['vi', 'en'] as const) {
  test(`${language} invalid links recover and in-page history preserves a lesson draft`, async ({ page }) => {
    const vi = language === 'vi'
    const pageErrors: string[] = []
    let reads = 0
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route(`**/api/lessons/${slug}`, async (route) => {
      reads += 1
      await route.continue()
    })
    await page.goto('/unknown-learning-page')
    const missing = page.getByRole('heading', { name: vi ? 'Đường dẫn này không mở được' : 'This link is unavailable' })
    await expect(missing).toBeFocused()
    await expect(page).toHaveURL(/\/unknown-learning-page$/)
    await page.evaluate(() => {
      history.pushState({}, '', '/lesson/%E0%A4%A')
      dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(missing).toBeVisible()
    await page.getByRole('button', { name: vi ? 'Mở lộ trình' : 'Open roadmap', exact: true }).click()
    await expect(page).toHaveURL(/\/roadmap$/)
    await page.goto(`/lesson/${slug}#notes`)
    await expect(page.locator('#notes')).toBeFocused()
    const draft = page.getByRole('textbox', { name: vi ? 'Ghi chú của bạn' : 'Your note', exact: true })
    await draft.fill('My unfinished explanation stays here')
    const before = reads
    await page.evaluate(() => { location.hash = 'concept' })
    await expect(page.locator('#concept')).toBeFocused()
    await expect(draft).toHaveValue('My unfinished explanation stays here')
    expect(reads).toBe(before)
    await page.goBack()
    await expect(page.locator('#notes')).toBeFocused()
    await expect(draft).toHaveValue('My unfinished explanation stays here')
    expect(reads).toBe(before)
    expect(pageErrors).toEqual([])
  })

  test(`${language} a failed lesson can retry without being erased by workspace loading`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    let reads = 0
    let available = false
    await page.route(`**/api/lessons/${slug}`, async (route) => {
      reads += 1
      if (!available) await route.fulfill({ status: 503, json: { detail: 'Temporary test failure' } })
      else await route.continue()
    })
    await page.goto(`/lesson/${slug}`)
    await expect(page.locator('.lesson-page .empty-state')).toContainText(vi ? 'Chưa tải được bài học' : 'Lesson unavailable')
    await expect(page.locator('.error-banner')).toContainText(vi ? 'Chưa tải được bài học.' : 'Could not load this lesson.')
    await expect(page.locator('.error-banner')).not.toContainText('Temporary test failure')
    for (const theme of ['light', 'dark'] as const) {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await checkThemeContrast(page)
      await page.screenshot({ path: `.build/lesson-recovery-evidence/${language}-${theme}-failed.png` })
    }
    const failedReads = reads
    available = true
    await page.getByRole('button', { name: vi ? 'Thử lại' : 'Retry', exact: true }).click()
    await expect(page.locator('#lesson-page-title')).toBeFocused()
    await expect(page.locator('.error-banner')).toHaveCount(0)
    expect(reads).toBe(failedReads + 1)
  })
}
