import { expect, test } from '@playwright/test'

test('guest reads a lesson before the account boundary and never calls local FastAPI', async ({ page }) => {
  const localApiRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) localApiRequests.push(request.url())
  })

  await page.goto('/lesson/phase-00-onboarding-environment-1')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Python')
  await expect(page.getByRole('button', { name: 'Đăng nhập để lưu' })).toBeVisible()
  await page.getByRole('button', { name: 'Đăng nhập để lưu' }).click()
  await expect(page.getByRole('heading', { name: 'Chào mừng bạn trở lại' })).toBeVisible()
  await expect(page.getByText('Workspace, VS Code và Git vẫn dành cho bản desktop/source clone.')).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tạo tài khoản miễn phí →' })).toBeVisible()
  await page.getByRole('tab', { name: 'Tạo tài khoản' }).click()
  await expect(page.getByLabel('Nhập lại mật khẩu', { exact: true })).toBeVisible()
  await page.getByLabel('Email').fill('learner@example.com')
  await page.getByLabel('Mật khẩu', { exact: true }).fill('secure-pass')
  await page.getByLabel('Nhập lại mật khẩu', { exact: true }).fill('different-pass')
  await page.getByRole('button', { name: 'Tạo tài khoản và xác nhận email' }).click()
  await expect(page.getByRole('alert')).toContainText('Hai mật khẩu chưa trùng khớp')
  expect(localApiRequests).toEqual([])
})


test('public landing and route selection work on mobile without private writes', async ({ page }) => {
  const writes: string[] = []
  page.on('request', (request) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) writes.push(request.url())
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Học AI')
  await expect(page.locator('.public-lesson-list > li')).toHaveCount(10)
  await page.getByRole('button', { name: 'Khám phá lộ trình' }).click()
  await expect(page).toHaveURL(/roadmap$/)
  await page.getByRole('button', { name: 'Làm ứng dụng AI', exact: true }).click()
  await expect(page.getByText('Trợ lý tài liệu tiếng Việt có trích nguồn', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.getByRole('button', { name: 'Build AI applications', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(writes).toEqual([])
})
