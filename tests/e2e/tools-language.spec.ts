import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} toolkit reads localized instructions without running commands`, async ({ page }) => {
    const vi = language === 'vi'
    const writes: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')
        && !['GET', 'HEAD', 'OPTIONS'].includes(request.method())
        && !request.url().includes('/runtime/')) writes.push(request.url())
    })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.goto('/tools')
    await expect(page.locator('.tools-page h2')).toContainText(vi ? 'Dùng công cụ' : 'Use the right tool')
    await expect(page.locator('.tool-card')).toHaveCount(8)
    await expect(page.locator('.tool-card').first()).toContainText(vi
      ? 'Ngôn ngữ chính để xử lý dữ liệu' : 'The main language for data work')
    await expect(page.locator('.tool-card').first()).toContainText(vi ? 'Cài đặt' : 'Setup')
    await expect(page.locator('.tool-card').filter({ hasText: 'ChatGPT/Codex' })).toContainText(vi
      ? 'Tạo context từ lesson' : 'Create context from a lesson')
    await expect(page.locator('.tools-page button')).toHaveCount(0)
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/tools-evidence/${language}-${theme}-${width}.png`,
          fullPage: true, animations: 'disabled' })
      }
    }
    expect(writes).toEqual([])
    await page.route('**/api/tools', (route) => route.fulfill({ json: { tools: [] } }))
    await page.reload()
    await expect(page.locator('.tools-page [role="status"]')).toContainText(vi
      ? 'Chưa có công cụ' : 'No tools available')
  })
}
