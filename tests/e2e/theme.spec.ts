import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

test('theme follows the system until chosen, persists, and supports keyboard switching', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('.today-next')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const toggle = page.getByRole('button', { name: 'Chuyển sang giao diện tối' })
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(toggle).not.toBeVisible()
  await page.reload()
  await expect(page.locator('.today-next')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} review ratings and revealed answer remain readable`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.route('**/api/reviews/due', (route) => route.fulfill({ json: { count: 1, items: [{
      id: 1, queue_status: 'new', phase_title_vi: 'Nền tảng', phase_title_en: 'Foundation',
      question_vi: 'Python nào đang chạy?', question_en: 'Which Python is running?',
      answer_vi: 'Kiểm tra sys.executable.', answer_en: 'Check sys.executable.',
    }] } }))
    await page.goto('/review')
    await page.getByText('Xem đáp án gợi ý', { exact: true }).click()
    await page.getByRole('textbox', { name: 'Câu trả lời của bạn' }).fill('sys.executable')
    for (const label of ['Chưa nhớ', 'Khó', 'Nhớ được', 'Dễ']) {
      await page.getByRole('button', { name: label, exact: true }).hover()
      await checkThemeContrast(page)
    }
  })

  test(`${theme} text stays readable across learning screens and narrow layouts`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    for (const route of ['/', '/roadmap', '/lesson/phase-00-onboarding-environment-1', '/review',
      '/exercises', '/tools', '/resources', '/community', '/journal', '/settings', '/security']) {
      await test.step(`Desktop ${theme}: ${route}`, async () => {
        await page.goto(route)
        await expect(page.locator('.page-content')).toBeVisible()
        if (route.startsWith('/lesson/')) await expect(page.locator('#lesson-page-title')).toBeVisible()
        await checkThemeContrast(page)
      })
    }
    await page.setViewportSize({ width: 390, height: 844 })
    for (const route of ['/', '/roadmap', '/lesson/phase-00-onboarding-environment-1', '/settings']) {
      await test.step(`Mobile ${theme}: ${route}`, async () => {
        await page.goto(route)
        await expect(page.locator('.page-content')).toBeVisible()
        if (route.startsWith('/lesson/')) await expect(page.locator('#lesson-page-title')).toBeVisible()
        await checkThemeContrast(page)
      })
    }
    await page.goto('/')
    await expect(page.locator('.today-next')).toBeVisible()
    await page.screenshot({ path: `.build/theme-evidence/today-${theme}-mobile.png`, fullPage: true })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({ path: `.build/theme-evidence/today-${theme}-desktop.png`, fullPage: true })
  })
}

test('blocked browser storage does not prevent switching themes', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError') } })
  })
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Chuyển sang giao diện tối' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Chuyển sang giao diện sáng' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
