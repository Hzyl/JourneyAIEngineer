import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

const slug = 'phase-00-onboarding-environment-1'
for (const language of ['vi', 'en'] as const) {
  test(`${language} lesson supports anchored reading, exact practice and validated progress retry`, async ({ page }) => {
    const vi = language === 'vi'
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    const writes: Array<{ status: string; minutes_spent: number }> = []
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route(`**/api/lessons/${slug}/progress`, async (route) => {
      writes.push(route.request().postDataJSON())
      if (writes.length === 1) return route.fulfill({ status: 503, json: { detail: 'Connection unavailable' } })
      await gate
      await route.fulfill({ json: { ok: true } })
    })
    try {
      await page.goto(`/lesson/${slug}#concept`)
      await expect(page.locator('#concept')).toBeFocused()
      await expect(page.locator('.app-shell')).toHaveCSS('transition-duration', '0s')
      const contents = page.getByRole('navigation', { name: vi ? 'Mục lục bài học' : 'Lesson contents' })
      const practice = contents.getByRole('link', { name: vi ? 'Thực hành' : 'Practice', exact: true })
      await practice.focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('#practice')).toBeFocused()
      await expect(page).toHaveURL(new RegExp(`/lesson/${slug}#practice$`))
      const navBox = (await contents.boundingBox())!
      expect(navBox.y + navBox.height).toBeLessThanOrEqual(0)
      const step = page.locator('.study-step-toggle').first()
      await step.focus()
      await page.keyboard.press('Space')
      await expect(step).toHaveAttribute('aria-expanded', 'true')
      await page.locator('.study-step-answer summary').click()
      expect(writes).toEqual([])
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          await page.locator('#practice').screenshot({
            path: `.build/lesson-evidence/${language}-${theme}-${width}-practice.png`, animations: 'disabled',
          })
        }
      }
      const linkedExercise = page.locator('.linked-exercise button').first()
      await linkedExercise.click()
      await expect(page).toHaveURL(/\/exercises\?exercise=exercise-0-environment$/)
      await expect(page.locator('.exercise-detail h2')).toBeFocused()
      await expect(page.locator('.exercise-solution button')).toContainText(vi ? 'Xem bài giải' : 'View solution')
      await page.goBack()
      await expect(page).toHaveURL(new RegExp(`/lesson/${slug}#practice$`))
      await expect(page.locator('#practice')).toBeFocused()
      const complete = page.getByRole('button', { name: vi ? 'Đánh dấu hoàn thành' : 'Mark complete' })
      await complete.click()
      await expect(page.locator('#check')).toBeFocused()
      expect(writes).toHaveLength(0)
      for (const checkbox of await page.locator('.checklist input').all()) await checkbox.check()
      const minutes = page.getByRole('spinbutton', { name: vi ? 'Phút học' : 'Study minutes' })
      await minutes.fill('1441')
      await complete.click()
      await expect(minutes).toHaveAttribute('aria-invalid', 'true')
      await expect(page.getByRole('alert')).toContainText('1440')
      expect(writes).toHaveLength(0)
      await minutes.fill('25')
      await complete.click()
      await expect(page.getByRole('alert')).toContainText(vi ? 'Chưa lưu được tiến độ' : 'Progress was not saved')
      await expect(minutes).toHaveValue('25')
      await complete.click()
      await expect(page.locator('.detail-actions button')).toHaveAttribute('aria-busy', 'true')
      await expect(minutes).toBeDisabled()
      expect(writes).toHaveLength(2)
      expect(writes[1]).toMatchObject({ status: 'completed', minutes_spent: 25 })
      release()
      await expect(page.getByRole('status').filter({ hasText: vi ? 'Đã lưu tiến độ.' : 'Progress saved.' })).toBeVisible()
      await expect(minutes).toBeEnabled()
      await checkThemeContrast(page)
    } finally { release() }
  })
}
