import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} community handles errors, filters and long feedback in both themes`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    let fail = true
    const item = {
      id: 1, lesson_slug: 'phase-00-onboarding-environment-1', kind: 'unclear',
      lesson_title_vi: 'Môi trường Python', lesson_title_en: 'Python environment',
      body: 'Nội dung gốc: ' + 'LongFeedbackWithoutSpaces'.repeat(12),
      status: 'implemented', display_name: 'Learner',
      created_at: '2026-10-07T10:00:00Z', updated_at: '2026-10-07T10:00:00Z',
    }
    await page.route('**/api/feedback*', (route) => fail
      ? route.fulfill({ status: 503, json: { detail: 'not available' } })
      : route.fulfill({ json: { items: [item, { ...item, id: 2, status: 'pending', body: 'Private draft' }] } }))
    await page.goto('/community')
    await expect(page.locator('.community-feed [role="alert"]')).toContainText(vi
      ? 'Chưa tải được góp ý' : 'Could not load feedback')
    fail = false
    await page.locator('.community-feed').getByRole('button', { name: vi ? 'Thử lại' : 'Retry' }).click()
    await expect(page.locator('.community-feedback-card')).toHaveCount(1)
    await expect(page.locator('.community-feed')).not.toContainText('Private draft')
    await expect(page.locator('.community-feedback-card')).toContainText(vi ? 'Đã cập nhật' : 'Implemented')
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/community-evidence/${language}-${theme}-${width}.png`,
          fullPage: true, animations: 'disabled' })
      }
    }
    await page.getByRole('combobox', { name: vi ? 'Lọc loại góp ý' : 'Filter feedback type' }).selectOption('typo')
    await expect(page.locator('.community-feed .empty-state')).toContainText(vi
      ? 'Chưa có nhận xét phù hợp' : 'No matching feedback')
    await page.getByRole('button', { name: vi ? 'Mở lộ trình' : 'Open roadmap', exact: true }).click()
    await expect(page).toHaveURL(/\/roadmap$/)
  })
}
