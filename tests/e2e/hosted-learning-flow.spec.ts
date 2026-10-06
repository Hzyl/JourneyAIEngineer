import { expect, test } from '@playwright/test'

test('hosted browser starts with account boundary and never calls local FastAPI', async ({ page }) => {
  const localApiRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) localApiRequests.push(request.url())
  })

  await page.goto('/lesson/phase-00-onboarding-environment-1')
  await expect(page.getByRole('heading', { name: 'Tiếp tục hành trình học' })).toBeVisible()
  await expect(page.getByText('Web beta không chạy code, mở VS Code hoặc truy cập Git trên máy của bạn.')).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  expect(localApiRequests).toEqual([])
})
