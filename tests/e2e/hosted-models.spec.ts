import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} core models guide and opt-in solution stay readable and download-only`, async ({ page }) => {
    const vi = language === 'vi'
    const unsafe: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')
        || !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) unsafe.push(request.url())
    })
    await page.goto('/exercises?exercise=exercise-3-models')
    if (!vi) await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.locator('.exercise-steps li')).toHaveCount(5)
    await expect(page.locator('.exercise-steps')).toContainText('240/80/80')
    const solution = page.locator('.exercise-solution')
    await expect(solution.getByRole('table')).toHaveCount(0)
    await expect(solution.locator('a[download]')).toHaveCount(0)
    await solution.getByRole('button').focus()
    await page.keyboard.press('Enter')
    await expect(solution.getByRole('table')).toHaveCount(2)
    await expect(solution).toContainText('11 tests, OK')
    const tableName = vi ? 'Kết quả seed 42' : 'Seed 42 results'
    await expect(solution.getByRole('table', { name: tableName })).toContainText('40 / 3 / 1 / 36')
    for (const name of ['compare.py', 'models.py', 'test_solution.py']) {
      const downloaded = page.waitForEvent('download')
      await solution.getByRole('link', { name: new RegExp(name.replace('.', '\\.')) }).click()
      const download = await downloaded
      expect(download.suggestedFilename()).toBe(name)
      expect(await readFile((await download.path())!, 'utf8'))
        .toBe(await readFile(`content/worked_solutions/exercise-3-models/${name}`, 'utf8'))
    }
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        const region = solution.getByRole('region', { name: tableName })
        await region.evaluate((element) => { element.scrollLeft = 0 })
        await region.focus()
        await expect(region).toBeFocused()
        const namesFit = await region.getByRole('rowheader').evaluateAll((headers) => headers.every((header) => {
          const range = document.createRange()
          range.selectNodeContents(header)
          return range.getClientRects().length === 1
        }))
        expect(namesFit, 'Short model names should not break across lines').toBe(true)
        await region.screenshot({ path: `.build/models-evidence/${language}-${theme}-${width}.png`,
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
