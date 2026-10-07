import { expect, test } from '@playwright/test'

test('hosted browser starts with account boundary and never calls local FastAPI', async ({ page }) => {
  const localApiRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) localApiRequests.push(request.url())
  })

  await page.goto('/lesson/phase-00-onboarding-environment-1')
  await expect(page.getByRole('heading', { name: 'Chào mừng bạn trở lại' })).toBeVisible()
  await expect(page.getByText('Workspace, VS Code và Git vẫn dành cho bản desktop/source clone.')).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await page.getByRole('tab', { name: 'Tạo tài khoản' }).click()
  await expect(page.getByLabel('Nhập lại mật khẩu', { exact: true })).toBeVisible()
  await page.getByLabel('Email').fill('learner@example.com')
  await page.getByLabel('Mật khẩu', { exact: true }).fill('secure-pass')
  await page.getByLabel('Nhập lại mật khẩu', { exact: true }).fill('different-pass')
  await page.getByRole('button', { name: 'Tạo tài khoản và xác nhận email' }).click()
  await expect(page.getByRole('alert')).toContainText('Hai mật khẩu chưa trùng khớp')
  expect(localApiRequests).toEqual([])
})
