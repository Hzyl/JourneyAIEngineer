import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} backup requires the reviewed source and refreshes restored settings`, async ({ page }) => {
    const vi = language === 'vi'
    // Playwright's local webServer uses a fresh temporary SQLite/journal directory.
    const backup = await page.request.post('/api/backup/export')
    expect(backup.ok()).toBe(true)
    const original = (await backup.json()).payload
    const incoming = { ...original, settings: { ...original.settings, weekly_goal_minutes: '180' },
      catalog: { ...original.catalog, content_sha256: 'older-content-for-test' } }
    let writes = 0
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/api/backup/import') writes += 1
    })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/backup/preview', async (route) => {
      await gate
      await route.fulfill({ response: await route.fetch() })
    })
    try {
      await page.goto('/settings')
      const card = page.locator('.backup-card')
      const editor = card.getByRole('textbox')
      const preview = card.getByRole('button', { name: vi ? 'Kiểm tra bản sao lưu' : 'Preview backup', exact: true })
      const restore = card.getByRole('button', { name: vi ? 'Nhập bản đã kiểm tra' : 'Import reviewed backup' })
      await editor.fill(JSON.stringify(incoming))
      await preview.click()
      await expect(editor).toBeDisabled()
      await expect(card.getByRole('button', { name: vi ? 'Đang kiểm tra…' : 'Checking…' })).toHaveAttribute('aria-busy', 'true')
      await expect(restore).toBeDisabled()
      release()
      await expect(restore).toBeEnabled()
      await expect(card.locator('.backup-preview')).toContainText(vi ? 'Bộ nội dung khác' : 'content version differs')
      await page.unroute('**/api/backup/preview')
      // A real edit must invalidate the preview without replacing hundreds of KB
      // through Chromium's multiline insertText automation path.
      await editor.press('ControlOrMeta+End')
      await editor.press('Space')
      await expect(editor).toHaveValue(`${JSON.stringify(incoming)} `)
      await expect(restore).toBeDisabled()
      await expect(card.locator('.backup-preview')).toHaveCount(0)
      await preview.click()
      await expect(restore).toBeEnabled()
      page.once('dialog', (dialog) => dialog.dismiss())
      await restore.click()
      expect(writes).toBe(0)
      await expect(restore).toBeEnabled()
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme })
          await checkThemeContrast(page)
          await card.screenshot({ path: `.build/backup-evidence/${language}-${theme}-${width}.png`,
            animations: 'disabled' })
        }
      }
      page.once('dialog', (dialog) => dialog.accept())
      await restore.click()
      await expect(card).toContainText(vi ? 'Đã nhập. Bản sao an toàn:' : 'Imported. Safety backup:')
      await expect(page.getByRole('spinbutton', { name: vi ? 'Mục tiêu mỗi tuần, tính bằng phút' : 'Weekly goal in minutes' }))
        .toHaveValue('180')
      expect(writes).toBe(1)
      await expect(restore).toBeDisabled()
      await checkThemeContrast(page)
    } finally {
      release()
      const restored = await page.request.post('/api/backup/import', { data: { payload: original, confirm: true } })
      expect(restored.ok()).toBe(true)
    }
  })

  test(`${language} malformed backup shows field errors without enabling import`, async ({ page }) => {
    const vi = language === 'vi'
    let imports = 0
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/api/backup/import') imports += 1
    })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    const invalid = JSON.stringify({ schema_version: 1, settings: { weekly_goal_minutes: 'invalid' },
      progress: [], review_state: [], review_history: [], notes: [], study_sessions: [], journal_files: [] })
    await page.goto('/settings')
    const card = page.locator('.backup-card')
    await card.getByRole('textbox').fill(invalid)
    await card.getByRole('button', { name: vi ? 'Kiểm tra bản sao lưu' : 'Preview backup', exact: true }).click()
    await expect(card.locator('.backup-preview')).toContainText('settings.weekly_goal_minutes')
    await expect(card.getByRole('button', { name: vi ? 'Nhập bản đã kiểm tra' : 'Import reviewed backup' }))
      .toBeDisabled()
    await expect(card.getByRole('textbox')).toHaveValue(invalid)
    expect(imports).toBe(0)
  })
}
