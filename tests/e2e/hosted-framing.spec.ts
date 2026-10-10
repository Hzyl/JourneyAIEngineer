import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} framing solution exposes readable tables and files without running code`, async ({ page }) => {
    const vi = language === 'vi'
    const unsafe: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')
        || !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) unsafe.push(request.url())
    })
    await page.goto('/exercises?exercise=exercise-3-ml-framing')
    if (!vi) await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.locator('.exercise-steps li')).toHaveCount(5)
    const solution = page.locator('.exercise-solution')
    await expect(solution.getByRole('table')).toHaveCount(0)
    await solution.getByRole('button').focus()
    await page.keyboard.press('Enter')
    await expect(solution.getByRole('table')).toHaveCount(2)
    await expect(solution.getByRole('table', { name: vi ? 'Bảng mô tả dữ liệu' : 'Data dictionary' })).toContainText('refund_issued')
    await expect(solution.getByRole('table', { name: vi ? 'Nguy cơ rò rỉ dữ liệu' : 'Leakage risk table' }))
      .toContainText('label_ready_on')
    await expect(solution).toContainText('6 tests, OK')
    await expect(solution).toContainText('precision=null')
    const downloadEvent = page.waitForEvent('download')
    await solution.getByRole('link', { name: /framing.py/ }).click()
    const download = await downloadEvent
    expect(download.suggestedFilename()).toBe('framing.py')
    const source = await readFile((await download.path())!, 'utf8')
    expect(source).toContain('def split_orders')
    expect(source).toContain('include_test=False')
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        const region = solution.getByRole('region', { name: vi ? 'Bảng mô tả dữ liệu' : 'Data dictionary' })
        await region.focus()
        await expect(region).toBeFocused()
        await region.screenshot({ path: `.build/framing-evidence/${language}-${theme}-${width}.png`,
          animations: 'disabled' })
        if (width === 390) {
          await page.keyboard.press('ArrowRight')
          await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
        }
      }
    }
    await solution.getByRole('button').click()
    await expect(solution.getByRole('table')).toHaveCount(0)
    expect(unsafe).toEqual([])
  })
}
