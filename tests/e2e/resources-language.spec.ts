import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} resource library preserves filters and remains readable`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.goto('/resources')
    await expect(page.locator('.resources-intro h2')).toContainText(vi ? 'Học từ nguồn' : 'Learn from sources')
    const search = page.getByRole('searchbox', { name: vi ? 'Tìm tài liệu' : 'Search resources' })
    const phase = page.getByRole('combobox', { name: vi ? 'Lọc theo giai đoạn' : 'Filter by phase' })
    const type = page.getByRole('combobox', { name: vi ? 'Lọc theo loại' : 'Filter by type' })
    await type.selectOption('Book')
    expect(new URL(page.url()).searchParams.get('type')).toBe('Book')
    await page.reload()
    await expect(type).toHaveValue('Book')
    await type.selectOption('all')
    await search.fill('not-a-real-resource-123')
    await expect(page.getByRole('heading', { name: vi ? 'Không tìm thấy tài liệu' : 'No resources found' }))
      .toBeVisible()
    await search.clear()
    await phase.selectOption('phase-02')
    await expect(phase).toHaveValue('phase-02')
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/resources-evidence/${language}-${theme}-${width}.png`,
          fullPage: true, animations: 'disabled' })
      }
    }
    await search.focus()
    await page.keyboard.press('Tab')
    await expect(phase).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(type).toBeFocused()
  })
}
