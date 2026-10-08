import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

test('an older refresh cannot overwrite a newly saved language', async ({ page }) => {
  let holdRead = false
  let held = false
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/api/settings', async (route) => {
    if (route.request().method() === 'PATCH') {
      const original = await (await page.request.get('/api/settings')).json()
      return route.fulfill({ json: { ...original, language: 'en' } })
    }
    const response = await route.fetch()
    const original = await response.json()
    if (holdRead) {
      held = true
      await gate
    }
    await route.fulfill({ json: { ...original, language: 'vi' } })
  })
  try {
    await page.goto('/tools')
    await expect(page.locator('.tool-card')).toHaveCount(8)
    holdRead = true
    await page.getByRole('button', { name: 'Làm mới dữ liệu', exact: true }).click()
    await expect.poll(() => held).toBe(true)
    await page.getByRole('button', { name: 'Đổi ngôn ngữ', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    release()
    await expect(page.locator('.refresh-button')).toBeEnabled()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('.tools-page h2')).toContainText('Use the right tool')
  } finally { release() }
})

test('initial failure shows a recovery action rather than a misleading empty catalogue', async ({ page }) => {
  let unavailable = true
  await page.route('**/api/tools', async (route) => {
    if (unavailable) return route.fulfill({ status: 503, json: { detail: 'Private database detail' } })
    await route.continue()
  })
  await page.goto('/tools')
  const notice = page.locator('.error-banner')
  await expect(notice).toContainText('Chưa tải được dữ liệu.')
  await expect(notice).not.toContainText('dữ liệu lần trước')
  await expect(page.locator('body')).not.toContainText('Private database detail')
  await expect(page.locator('.tools-page')).toHaveCount(0)
  await expect(page.locator('.workspace-unavailable')).toBeVisible()
  await expect(page.locator('.language-chip')).toBeDisabled()
  await page.setViewportSize({ width: 320, height: 844 })
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await checkThemeContrast(page)
    await page.screenshot({ path: `.build/workspace-recovery-evidence/initial-${theme}-320.png` })
  }
  unavailable = false
  await notice.getByRole('button', { name: 'Thử lại', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.tool-card')).toHaveCount(8)
  await expect(notice).toHaveCount(0)
  await expect(page.locator('.workspace-unavailable')).toHaveCount(0)
  await expect(page.locator('.language-chip')).toBeEnabled()
})

for (const language of ['vi', 'en'] as const) {
  test(`${language} failed refresh retains prior content and allows a keyboard retry`, async ({ page }) => {
    const vi = language === 'vi'
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    let unavailable = false
    let hold = false
    let reads = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route('**/api/tools', async (route) => {
      reads += 1
      if (unavailable) return route.fulfill({ status: 503, json: { detail: 'Private provider detail' } })
      if (hold) await gate
      await route.continue()
    })
    try {
      await page.goto('/tools')
      await expect(page.locator('.tool-card')).toHaveCount(8)
      unavailable = true
      await page.locator('.refresh-button').click()
      const notice = page.locator('.error-banner')
      await expect(notice).toContainText(vi ? 'Đang hiển thị dữ liệu lần trước.' : 'Showing previously loaded data.')
      await expect(page.locator('body')).not.toContainText('Private provider detail')
      await expect(page.locator('.tool-card')).toHaveCount(8)
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          await page.screenshot({ path: `.build/workspace-recovery-evidence/${language}-${theme}-${width}.png` })
        }
      }
      unavailable = false
      hold = true
      const before = reads
      await notice.getByRole('button', { name: vi ? 'Thử lại' : 'Retry', exact: true }).focus()
      await page.keyboard.press('Enter')
      await expect.poll(() => reads).toBe(before + 1)
      await expect(page.locator('.refresh-button')).toBeDisabled()
      await expect(page.locator('.refresh-button')).toHaveAttribute('aria-busy', 'true')
      await expect(page.locator('.tool-card')).toHaveCount(8)
      release()
      await expect(page.locator('.refresh-button')).toBeEnabled()
      await expect(notice).toHaveCount(0)
      expect(reads).toBe(before + 1)
      expect(errors).toEqual([])
    } finally { release() }
  })

  test(`${language} language retry persists a change and locks settings while pending`, async ({ page }) => {
    const vi = language === 'vi'
    const writes: unknown[] = []
    let reads = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/settings', async (route) => {
      if (route.request().method() === 'PATCH') {
        writes.push(route.request().postDataJSON())
        if (writes.length === 1) return route.fulfill({ status: 503, json: { detail: 'Private provider detail' } })
        await gate
        const original = await (await page.request.get('/api/settings')).json()
        return route.fulfill({ json: { ...original, language: vi ? 'en' : 'vi' } })
      }
      reads += 1
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    try {
      await page.goto('/settings')
      const goal = page.locator('.settings-goal input')
      await goal.fill('480')
      const before = reads
      await page.locator('.language-chip').click()
      const notice = page.locator('.error-banner')
      await expect(notice).toContainText(vi ? 'Chưa đổi được ngôn ngữ.' : 'Could not change the language.')
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(notice).not.toContainText('Private provider detail')
      await notice.getByRole('button', { name: vi ? 'Thử lại' : 'Retry', exact: true }).focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('.language-chip')).toBeDisabled()
      await expect(page.locator('.language-chip')).toHaveAttribute('aria-busy', 'true')
      await expect(goal).toBeDisabled()
      for (const control of await page.locator('.settings-card input, .settings-card select, .settings-card button').all()) {
        await expect(control).toBeDisabled()
      }
      await page.setViewportSize({ width: 320, height: 844 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/workspace-recovery-evidence/${language}-${theme}-saving.png` })
      }
      release()
      await expect(page.locator('html')).toHaveAttribute('lang', vi ? 'en' : 'vi')
      await expect(page.locator('.language-chip')).toBeEnabled()
      await expect(goal).toBeEnabled()
      await expect(goal).toHaveValue('480')
      await expect(notice).toHaveCount(0)
      expect(writes).toEqual([{ language: vi ? 'en' : 'vi' }, { language: vi ? 'en' : 'vi' }])
      expect(reads).toBe(before)
    } finally { release() }
  })
}
