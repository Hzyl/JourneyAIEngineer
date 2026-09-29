import { expect, test } from '@playwright/test'

const firstLessonSlug = 'phase-00-onboarding-environment-1'

test('dashboard loads and the main navigation reaches the roadmap', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Hôm nay học gì?' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('button', { name: /Lộ trình/ }).click()
  await expect(page).toHaveURL(/\/roadmap$/)
  await expect(page.getByRole('heading', { name: /Lộ trình/ })).toBeVisible()
})

test('lesson deep link renders content and preserves a single browser route', async ({ page }) => {
  await page.goto(`/lesson/${firstLessonSlug}`)

  await expect(page).toHaveURL(new RegExp(`/lesson/${firstLessonSlug}$`))
  await expect(page.getByRole('heading', { name: 'Lesson workspace' })).toBeVisible()
  await expect(page.getByText('Cài Python và kiểm tra phiên bản', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Giải thích cốt lõi' })).toBeVisible()

  // The route is intentionally a real SPA deep link. Refreshing this URL is
  // covered by opening it directly above, so a hosted/local server must serve
  // the same app shell for `/lesson/*` instead of returning a 404.
})
