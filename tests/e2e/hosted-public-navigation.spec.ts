import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} guest roadmap, auth history and language survive reload`, async ({ page }) => {
    const vi = language === 'vi'
    const writes: string[] = []
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) writes.push(request.url())
    })
    await page.goto('/')
    if (!vi) await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', language)
    await page.getByRole('button', { name: vi ? 'Khám phá lộ trình' : 'Explore the roadmap' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(vi ? 'Chọn đích đến' : 'Choose a direction')
    await expect(page.getByRole('button', { name: vi ? 'Lộ trình' : 'Roadmap', exact: true }))
      .toHaveAttribute('aria-current', 'page')
    const application = page.getByRole('button', { name: vi ? 'Làm ứng dụng AI' : 'Build AI applications', exact: true })
    await application.click()
    await page.reload()
    await expect(application).toHaveAttribute('aria-pressed', 'true')
    for (const width of [1440, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/public-entry-evidence/${language}-${theme}-${width}-roadmap.png` })
      }
    }
    await page.getByRole('button', { name: vi ? 'Bắt đầu với bài học mẫu' : 'Start with a sample lesson' }).click()
    await expect(page.locator('.public-lesson')).toBeVisible()
    const lessonUrl = page.url()
    await page.getByRole('button', { name: vi ? 'Đăng nhập để lưu' : 'Sign in to save' }).click()
    await expect(page).toHaveURL(/\/auth\/sign-in\?next=/)
    await expect(page.getByRole('heading', { name: vi ? 'Chào mừng bạn trở lại' : 'Welcome back' })).toBeFocused()
    await page.goBack()
    await expect(page).toHaveURL(lessonUrl)
    await expect(page.locator('.public-lesson')).toBeVisible()
    await page.goForward()
    await expect(page.getByLabel('Email')).toBeVisible()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', language)
    await page.getByRole('button', { name: vi ? 'Tạo tài khoản' : 'Create account', exact: true }).click()
    await page.getByLabel('Email').fill('learner@example.com')
    await page.getByLabel(vi ? 'Mật khẩu' : 'Password', { exact: true }).fill('example-password')
    await page.getByLabel(vi ? 'Nhập lại mật khẩu' : 'Confirm password', { exact: true }).fill('different-password')
    await page.getByRole('button', { name: vi ? 'Tạo tài khoản và xác nhận email' : 'Create account and confirm email' }).click()
    await expect(page.getByRole('alert')).toContainText(vi ? 'chưa trùng khớp' : 'do not match')
    for (const width of [1440, 820, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/public-entry-evidence/${language}-${theme}-${width}-auth.png`, fullPage: true })
      }
    }
    await page.getByRole('button', { name: vi ? 'Quay lại học thử' : 'Back to learning' }).click()
    await expect(page).toHaveURL(lessonUrl)
    expect(writes).toEqual([])
    expect(errors).toEqual([])
  })

  test(`${language} invalid email links give a localized route back to sign-in`, async ({ page }) => {
    await page.goto(`/auth/callback?lang=${language}&error_description=private-upstream-detail`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(language === 'vi'
      ? 'Không thể xác nhận tài khoản' : 'Could not confirm your account')
    await expect(page.locator('body')).not.toContainText('private-upstream-detail')
    await page.getByRole('button', { name: language === 'vi' ? 'Về trang đăng nhập' : 'Back to sign in' }).click()
    await expect(page).toHaveURL(/\/auth\/sign-in$/)
    await expect(page.getByLabel('Email')).toBeVisible()
    await page.goto(`/auth/callback?lang=${language}&mode=recovery`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(language === 'vi'
      ? 'Đặt lại mật khẩu' : 'Reset your password')
    await expect(page.getByRole('button', { name: language === 'vi' ? 'Lưu mật khẩu mới' : 'Save new password' }))
      .toBeDisabled()
    await page.setViewportSize({ width: 390, height: 900 })
    await checkThemeContrast(page)
  })
}
