import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} study sessions preserve failed input and return from a lesson to Today`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    const writes: unknown[] = []
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/study-sessions', async (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      writes.push(route.request().postDataJSON())
      if (writes.length === 1) return route.fulfill({ status: 503, json: { detail: 'Offline' } })
      await gate
      await route.fulfill({ json: { ok: true } })
    })
    try {
      await page.goto('/')
      const minutes = page.getByRole('spinbutton', { name: vi ? 'Phút' : 'Minutes', exact: true })
      const note = page.getByRole('textbox', { name: vi ? 'Ghi chú' : 'Note', exact: true })
      const save = page.getByRole('button', { name: vi ? 'Lưu phiên học' : 'Save session' })
      await minutes.fill('30')
      await note.fill('Practised loops')
      await save.click()
      await expect(page.getByRole('alert')).toContainText('Offline')
      await expect(note).toHaveValue('Practised loops')
      await save.click()
      await expect(minutes).toBeDisabled()
      await expect(note).toBeDisabled()
      expect(writes).toHaveLength(2)
      expect(writes[1]).toMatchObject({ minutes: 30, note: 'Practised loops' })
      release()
      await expect(page.getByRole('status')).toHaveText(vi ? 'Đã ghi phiên học.' : 'Study session saved.')
      await expect(note).toHaveValue('')
      await note.fill('Next session')
      await expect(page.locator('.today-session [role="status"]')).toHaveCount(0)
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          await page.locator('.today-view').screenshot({
            path: `.build/today-roadmap-evidence/${language}-${theme}-${width}-today.png`, animations: 'disabled',
          })
        }
      }
      await page.locator('.today-next button').click()
      await expect(page.locator('#lesson-page-title')).toBeVisible()
      await page.getByRole('button', { name: vi ? 'Quay lại' : 'Back', exact: true }).click()
      await expect(page).toHaveURL(/\/$/)
      await expect(page.locator('.today-view')).toBeVisible()
    } finally { release() }
  })

  test(`${language} roadmap restores filters after reading and exposes explicitly requested completed lessons`,
    async ({ page }) => {
      const vi = language === 'vi'
      await page.route('**/api/settings', async (route) => {
        const response = await route.fetch()
        await route.fulfill({ json: { ...await response.json(), language, show_completed_lessons: false } })
      })
      await page.route('**/api/roadmap', async (route) => {
        const response = await route.fetch()
        const data = await response.json()
        data.phases[0].modules[0].lessons[0].status = 'completed'
        await route.fulfill({ json: data })
      })
      await page.goto('/roadmap?route=foundation&phase=phase-00-onboarding&status=completed')
      await expect(page.locator('.lesson-row')).toHaveCount(1)
      const origin = page.url()
      await page.locator('.lesson-row').click()
      await expect(page.locator('#lesson-page-title')).toBeVisible()
      await page.getByRole('button', { name: vi ? 'Quay lại' : 'Back', exact: true }).click()
      await expect(page).toHaveURL(origin)
      await expect(page.locator('.lesson-row')).toHaveCount(1)
      const search = page.getByRole('searchbox', { name: vi ? 'Tìm bài học hoặc học phần' : 'Search lessons or modules' })
      await search.fill('no matching lesson 928374')
      await expect(page.locator('.lesson-row')).toHaveCount(0)
      await expect(page.getByText(vi ? 'Không có bài phù hợp bộ lọc này.' : 'No lessons match these filters.')).toBeVisible()
      await page.getByRole('button', { name: vi ? 'Xóa bộ lọc' : 'Clear filters', exact: true }).click()
      await expect(page).toHaveURL(/\/roadmap$/)
      await expect(page.locator('.lesson-row.done')).toHaveCount(0)
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          await page.locator('.roadmap-intro').scrollIntoViewIfNeeded()
          await page.screenshot({
            path: `.build/today-roadmap-evidence/${language}-${theme}-${width}-roadmap.png`, animations: 'disabled',
          })
        }
      }
    })
}
