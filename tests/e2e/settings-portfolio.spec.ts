import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} settings separate automatic choices from weekly goals and portfolio shows complete requirements`,
    async ({ page }) => {
      const vi = language === 'vi'
      const overrides: Record<string, unknown> = { language, weekly_goal_minutes: 720 }
      const writes: Array<Record<string, unknown>> = []
      let goalWrites = 0
      let release!: () => void
      const gate = new Promise<void>((resolve) => { release = resolve })
      await page.route('**/api/settings', async (route) => {
        if (route.request().method() === 'PATCH') {
          const patch = route.request().postDataJSON()
          writes.push(patch)
          if ('weekly_goal_minutes' in patch) {
            goalWrites += 1
            if (goalWrites === 1) return route.fulfill({ status: 503, json: { detail: 'Offline' } })
            await gate
          }
          Object.assign(overrides, patch)
        }
        const response = await route.fetch({ method: 'GET', postData: undefined })
        await route.fulfill({ json: { ...await response.json(), ...overrides } })
      })
      try {
        await page.goto('/settings')
        const goal = page.getByRole('spinbutton', {
          name: vi ? 'Mục tiêu mỗi tuần, tính bằng phút' : 'Weekly goal in minutes',
        })
        await goal.fill('480')
        await page.getByRole('combobox', { name: vi ? 'Mục tiêu nghề nghiệp' : 'Career goal' }).selectOption('junior')
        await expect(page.getByRole('status')).toContainText(vi ? 'Đã lưu: Mục tiêu nghề nghiệp.' : 'Saved: Career goal.')
        await expect(goal).toHaveValue('480')
        expect(writes).toEqual([{ target_role: 'junior' }])
        await expect(page.getByText(vi ? 'Mục tiêu đang nhập chưa được lưu.'
          : 'Your edited weekly goal has not been saved yet.')).toBeVisible()
        await goal.fill('30')
        await goal.press('Enter')
        await expect(goal).toHaveAttribute('aria-invalid', 'true')
        expect(writes).toHaveLength(1)
        await goal.fill('480')
        await goal.press('Enter')
        await expect(page.getByRole('alert')).toHaveText(vi ? 'Không lưu được cài đặt.' : 'Could not save settings.')
        await expect(goal).toHaveValue('480')
        await goal.press('Enter')
        await expect(goal).toBeDisabled()
        const save = page.getByRole('button', { name: vi ? 'Đang lưu…' : 'Saving…', exact: true })
        await expect(save).toHaveAttribute('aria-busy', 'true')
        expect(writes).toHaveLength(3)
        for (const width of [1440, 390]) {
          await page.setViewportSize({ width, height: 900 })
          for (const theme of ['light', 'dark'] as const) {
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await checkThemeContrast(page)
            await page.locator('.settings-card').screenshot({
              path: `.build/settings-portfolio-evidence/${language}-${theme}-${width}-settings.png`,
              animations: 'disabled',
            })
          }
        }
        release()
        await expect(page.getByRole('status')).toHaveText(vi ? 'Đã lưu mục tiêu tuần.' : 'Weekly goal saved.')
        overrides.weekly_goal_minutes = 600
        await page.getByRole('button', { name: vi ? 'Làm mới dữ liệu' : 'Refresh data', exact: true }).click()
        await expect(goal).toHaveValue('600')
        await page.goto('/roadmap')
        const board = page.locator('.portfolio-board')
        await expect(board.locator('.portfolio-card')).toHaveCount(10)
        const first = board.locator('.portfolio-card').first()
        await first.locator('summary').focus()
        await page.keyboard.press('Enter')
        await expect(first.locator('details')).toHaveAttribute('open', '')
        await expect(first.locator('li')).toHaveCount(6)
        await expect(first).toContainText(vi ? 'lý do chọn thước đo' : 'metric rationale')
        await expect(first).toContainText('projects/tabular-ml')
        await expect(board.locator('a')).toHaveCount(0)
        await board.locator('.career-checklist summary').click()
        await expect(board.locator('.career-checklist')).toContainText(vi ? 'Có CV một trang' : 'Prepare a one-page CV')
        for (const width of [1440, 390]) {
          await page.setViewportSize({ width, height: 900 })
          for (const theme of ['light', 'dark'] as const) {
            await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await checkThemeContrast(page)
            await first.screenshot({
              path: `.build/settings-portfolio-evidence/${language}-${theme}-${width}-portfolio.png`,
              animations: 'disabled',
            })
          }
        }
        expect(writes).toHaveLength(3)
      } finally { release() }
    })
}
