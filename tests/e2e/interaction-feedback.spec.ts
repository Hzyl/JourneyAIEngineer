import { expect, test, type Route } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

test('mouse and keyboard clicks acknowledge activation without stealing focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' })
  await page.goto('/')
  const toggle = page.locator('.theme-toggle')
  await expect(toggle).toBeVisible()
  // Record feedback in the same event turn, before the short animation finishes.
  await toggle.evaluate((element) => {
    element.addEventListener('click', () => {
      element.setAttribute('data-acknowledged', String(element.getAnimations().some(
        (animation) => animation.id === 'journey-press',
      )))
    })
  })
  await toggle.click()
  await expect(toggle).toHaveAttribute('data-acknowledged', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await toggle.focus()
  await toggle.evaluate((element) => element.removeAttribute('data-acknowledged'))
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('data-acknowledged', 'true')
  await expect(toggle).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await toggle.click()
  await expect(toggle).toHaveAttribute('data-acknowledged', 'false')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} note save shows pending, blocks duplicates, and preserves text on failure`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 390, height: 844 })
    let pending: Route | undefined
    let writes = 0
    await page.route('**/api/notes', async (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      writes += 1
      pending = route
    })
    await page.goto('/lesson/phase-00-onboarding-environment-1')
    const note = page.getByRole('textbox', { name: 'Ghi chú của bạn', exact: true })
    const save = page.locator('.lesson-note-block button')
    await note.fill('Giữ lại insight khi mất mạng.')
    await save.click()
    await expect.poll(() => writes).toBe(1)
    await expect(save).toBeDisabled()
    await expect(save).toHaveAttribute('aria-busy', 'true')
    await expect(save).toHaveText('Đang lưu…')
    await expect(save).toHaveCSS('opacity', '1')
    await expect(note).toBeDisabled()
    await save.evaluate((element: HTMLButtonElement) => element.click())
    expect(writes).toBe(1)
    await expect(page.getByText('Đã lưu vào nhật ký.', { exact: true })).toHaveCount(0)
    await expect.poll(() => save.evaluate((element) => getComputedStyle(element, '::after').animationName))
      .toBe('feedback-spin')
    await checkThemeContrast(page)
    await page.screenshot({ path: `.build/interaction-evidence/note-pending-${theme}.png` })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(() => save.evaluate((element) => getComputedStyle(element, '::after').animationName))
      .toBe('none')
    await pending!.fulfill({ status: 500, json: { detail: 'Chưa lưu được. Thử lại.' } })
    await expect(page.getByRole('alert').filter({ hasText: 'Chưa lưu được. Thử lại.' })).toBeVisible()
    await expect(note).toHaveValue('Giữ lại insight khi mất mạng.')
    await expect(save).toBeEnabled()
    await expect(save).toHaveAttribute('aria-busy', 'false')
    await save.click()
    await expect.poll(() => writes).toBe(2)
    await pending!.fulfill({ json: { id: 1 } })
    await expect(page.getByRole('status').filter({ hasText: 'Đã lưu vào nhật ký.' })).toBeVisible()
    await expect(note).toHaveValue('')
    await note.fill('Ghi chú mới')
    await expect(page.getByText('Đã lưu vào nhật ký.', { exact: true })).toHaveCount(0)
  })
}

test('settings waits for the server and recovers from a failed save', async ({ page }) => {
  let pending: Route | undefined
  let writes = 0
  await page.route('**/api/settings', async (route) => {
    if (route.request().method() !== 'PATCH') return route.continue()
    writes += 1
    pending = route
  })
  await page.goto('/settings')
  const original = await (await page.request.get('/api/settings')).json()
  const goal = page.getByRole('spinbutton', { name: 'Mục tiêu mỗi tuần, tính bằng phút' })
  const save = page.locator('.settings-card .primary-button')
  await goal.fill('480')
  await save.click()
  await expect.poll(() => writes).toBe(1)
  await expect(save).toHaveAttribute('aria-busy', 'true')
  await expect(goal).toBeDisabled()
  await expect(page.getByRole('combobox', { name: 'Mục tiêu nghề nghiệp' })).toBeDisabled()
  await expect(page.getByText('Đã lưu mục tiêu tuần.', { exact: true })).toHaveCount(0)
  await pending!.fulfill({ status: 500, json: { detail: 'Không lưu được cài đặt.' } })
  await expect(page.getByRole('alert').filter({ hasText: 'Không lưu được cài đặt.' })).toBeVisible()
  await expect(goal).toHaveValue('480')
  await expect(save).toBeEnabled()
  await save.click()
  await expect.poll(() => writes).toBe(2)
  await pending!.fulfill({ json: { ...original, weekly_goal_minutes: 480 } })
  await expect(page.getByRole('status').filter({ hasText: 'Đã lưu mục tiêu tuần.' })).toBeVisible()
  await expect(save).toHaveAttribute('aria-busy', 'false')
  await goal.fill('600')
  await expect(page.getByText('Đã lưu mục tiêu tuần.', { exact: true })).toHaveCount(0)
})
