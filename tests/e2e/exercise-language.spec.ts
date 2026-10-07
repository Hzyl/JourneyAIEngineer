import { expect, test, type Route } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} practice supports keyboard, pending retry, empty history and export review`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route('**/api/health', (route) => route.fulfill({ json: {
      status: 'ok', project_root_configured: true, git_publish_available: true, local_only: false,
    } }))
    await page.route('**/api/exercises', (route) => route.fulfill({ json: { exercises: [{
      id: 99, slug: 'fixture-practice', title_vi: 'Thực hành dữ liệu', title_en: 'Data practice',
      description_vi: 'Phân tích bản ghi mẫu.', description_en: 'Analyze synthetic records.',
      difficulty: 'easy', estimated_minutes: 30, assessment_kind: 'verified',
      workspace_id: 7, workspace_path: 'workspaces/fixture', hints: [], test_command: 'python -m unittest',
    }] } }))
    let pending: Route | undefined
    let runs = 0
    let gitWrites = 0
    await page.route('**/api/workspaces/7/run', (route) => { pending = route; runs += 1 })
    await page.route('**/api/workspaces/7/runs', (route) => route.fulfill({ json: { runs: [], count: 0 } }))
    await page.route('**/api/workspaces/7/export', (route) => route.fulfill({ json: {
      artifact_path: 'exercises/fixture', files: ['main.py'], skipped: [], secret_files: [], workspace_id: 7,
    } }))
    await page.route('**/api/git/publish', (route) => { gitWrites += 1; return route.abort() })
    await page.goto('/exercises')
    const skip = page.locator('.skip-link')
    await expect(skip).toHaveCSS('clip-path', 'inset(100%)')
    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    await expect(skip).toHaveCSS('clip-path', 'none')
    await page.keyboard.press('Tab')
    await expect(skip).toHaveCSS('clip-path', 'inset(100%)')
    const card = page.locator('.exercise-card')
    await expect(card.getByRole('heading')).toHaveText(vi ? 'Thực hành dữ liệu' : 'Data practice')
    const search = page.getByRole('textbox', { name: vi ? 'Tìm bài tập' : 'Search exercises', exact: true })
    await search.fill('synthetic')
    await expect(card).toHaveCount(1)
    await search.fill('missing-example')
    await expect(card).toHaveCount(0)
    await expect(page.getByRole('status')).toContainText(vi ? 'Không có bài tập phù hợp' : 'No matching exercises')
    await search.clear()
    const run = card.getByRole('button', { name: vi ? 'Chạy test' : 'Run tests', exact: true })
    await run.focus()
    await page.keyboard.press('Enter')
    const running = card.getByRole('button', { name: vi ? 'Đang chạy…' : 'Running…', exact: true })
    await expect(running).toHaveAttribute('aria-busy', 'true')
    await expect(running).toBeDisabled()
    await running.evaluate((button: HTMLButtonElement) => button.click())
    await expect.poll(() => runs).toBe(1)
    await page.setViewportSize({ width: 390, height: 844 })
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme })
      await page.screenshot({
        path: `.build/exercise-evidence/${language}-${theme}-pending.png`,
        fullPage: true, animations: 'disabled',
      })
      await checkThemeContrast(page)
    }
    await pending!.fulfill({ status: 500, json: { detail: 'Runner unavailable' } })
    await expect(page.getByRole('alert')).toHaveText('Runner unavailable')
    await expect(run).toBeEnabled()
    await run.click()
    await expect.poll(() => runs).toBe(2)
    await pending!.fulfill({ json: {
      status: 'failed', output: 'AssertionError: expected 2', duration_ms: 10, assessment_kind: 'verified',
    } })
    await expect(page.getByRole('region', { name: vi ? 'Kết quả chạy bài' : 'Exercise output' }))
      .toContainText('AssertionError: expected 2')
    await expect(page.getByRole('alert')).toContainText(vi ? 'Chưa đạt' : 'Failed')
    await expect(page.locator('.success-note')).toHaveCount(0)
    await expect(card).toContainText(vi ? 'Chưa có lần chạy.' : 'No runs yet.')
    await card.getByRole('button', { name: vi ? 'Lưu artifact' : 'Save artifact', exact: true }).click()
    const publish = page.getByRole('button', { name: vi ? 'Xác nhận & push GitHub' : 'Confirm & push to GitHub' })
    await expect(publish).toBeDisabled()
    await page.getByRole('checkbox').check()
    await expect(publish).toBeEnabled()
    await page.getByRole('textbox', { name: vi ? 'Nội dung commit' : 'Commit message' }).fill('learn: new draft')
    await expect(publish).toBeDisabled()
    await checkThemeContrast(page)
    await expect(skip).toHaveCSS('clip-path', 'inset(100%)')
    await page.screenshot({
      path: `.build/exercise-evidence/${language}-dark-review.png`, fullPage: true, animations: 'disabled',
    })
    expect(gitWrites).toBe(0)
  })
}
