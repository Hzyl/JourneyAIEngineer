import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} passive review localizes source evidence and recovers without executing endpoints`, async ({ page }) => {
    const vi = language === 'vi'
    let fail = true
    let requests = 0
    const writes: string[] = []
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')
        && !['GET', 'HEAD', 'OPTIONS'].includes(request.method())
        && !request.url().includes('/runtime/')) writes.push(request.url())
    })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route('**/api/security/audit', async (route) => {
      requests += 1
      if (fail) return route.fulfill({ status: 503, json: { detail: 'Private source path' } })
      const response = await route.fetch()
      const report = await response.json()
      // Long but synthetic technical metadata should wrap inside the report.
      report.findings[0].source_file = `apps/api/${'example_'.repeat(30)}.py`
      await route.fulfill({ json: report })
    })
    await page.goto('/security')
    const view = page.locator('.security-layout')
    await expect(view.getByRole('alert')).toContainText(vi ? 'Chưa tải được báo cáo' : 'Could not load the report')
    await expect(view).not.toContainText('Private source path')
    fail = false
    await view.getByRole('button', { name: vi ? 'Thử lại' : 'Retry', exact: true }).click()
    await expect(view.locator('.security-finding')).not.toHaveCount(0)
    await expect(view).toContainText(vi ? 'Không phát hiện shell=True' : 'No shell=True call found')
    const loaded = requests
    await view.getByRole('combobox', { name: vi ? 'Mức độ' : 'Severity', exact: true }).selectOption('critical')
    await expect(view.locator('.security-empty')).toContainText(vi ? 'Không có kết quả' : 'No matching findings')
    await view.getByRole('button', { name: vi ? 'Xóa bộ lọc' : 'Clear filters' }).click()
    expect(requests).toBe(loaded)
    const limitations = view.locator('summary').filter({ hasText: vi ? 'Giới hạn' : 'Limitations' })
    await limitations.focus()
    await page.keyboard.press('Enter')
    await expect(view.locator('details[open]')).toContainText(vi
      ? 'không gửi yêu cầu tới các điểm cuối được kiểm tra' : 'sends no requests to target endpoints')
    await view.locator('summary').filter({ hasText: vi ? 'Danh sách endpoint' : 'Endpoint inventory' }).click()
    await expect(view.getByRole('region', { name: vi ? 'Chi tiết endpoint' : 'Endpoint details' })).toBeVisible()
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/security-evidence/${language}-${theme}-${width}.png`,
          fullPage: true, animations: 'disabled' })
        await view.locator('.security-hero').screenshot({
          path: `.build/security-evidence/hero-${language}-${theme}-${width}.png`,
        })
        await view.locator('.security-finding').first().screenshot({
          path: `.build/security-evidence/finding-${language}-${theme}-${width}.png`,
        })
      }
    }
    fail = true
    await view.getByRole('button', { name: vi ? 'Kiểm tra lại mã nguồn' : 'Review source again' }).click()
    await expect(view.getByRole('alert')).toContainText(vi ? 'kết quả lần trước' : 'Previous results')
    await expect(view.locator('.security-finding')).not.toHaveCount(0)
    expect(writes).toEqual([])
    expect(errors).toEqual([])
  })
}
