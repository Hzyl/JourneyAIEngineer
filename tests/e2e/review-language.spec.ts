import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} recall supports disclosure, independent history retry and safe card progression`, async ({ page }) => {
    const vi = language === 'vi'
    const cards = [1, 2].map((id) => ({
      id, queue_status: id === 1 ? 'due' : 'new',
      phase_title_vi: 'Nền tảng', phase_title_en: 'Foundation',
      question_vi: `Câu ${id}: Làm sao biết Python nào đang chạy?`,
      question_en: `Question ${id}: How do you identify the running Python?`,
      answer_vi: 'Kiểm tra sys.executable.\nĐối chiếu đường dẫn với môi trường đã chọn.',
      answer_en: 'Check sys.executable.\nCompare the path with the selected environment.',
    }))
    let queue = [...cards]
    const writes: Array<Record<string, unknown>> = []
    let historyOffline = true
    let release!: () => void
    const gate = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route('**/api/reviews/due', (route) => route.fulfill({ json: { items: queue, count: queue.length } }))
    await page.route('**/api/reviews/history', (route) => {
      if (historyOffline) return route.fulfill({ status: 503, json: { detail: 'History offline' } })
      return route.fulfill({ json: { items: [{
        id: 5, rating: 'hard', lesson_title_vi: 'Cài Python', lesson_title_en: 'Install Python',
      }] } })
    })
    await page.route('**/api/reviews/weak-topics', (route) => route.fulfill({ json: { items: [{
      lesson_slug: 'phase-00-onboarding-environment-1', title_vi: 'Cài Python', title_en: 'Install Python',
      hard_attempts: 1, attempts: 2,
    }] } }))
    await page.route('**/api/reviews/*/answer', async (route) => {
      writes.push(route.request().postDataJSON())
      if (writes.length === 1) return route.fulfill({ status: 503, json: { detail: 'Save offline' } })
      if (writes.length === 2) await gate
      queue = queue.filter((item) => !route.request().url().endsWith(`/${item.id}/answer`))
      await route.fulfill({ json: { ok: true } })
    })
    try {
      await page.goto('/review')
      const question = page.locator('.review-card h3')
      await expect(question).toBeFocused()
      await expect(page.locator('.review-header [role="status"]')).toHaveText(vi ? '1 đến hạn · 1 thẻ mới' : '1 due · 1 new cards')
      await expect(page.locator('.review-history [role="alert"]')).toBeVisible()
      await expect(page.locator('.weak-topics')).toContainText('1/2')
      historyOffline = false
      await page.getByRole('button', { name: vi ? 'Thử tải lại hoạt động' : 'Retry activity' }).click()
      await expect(page.locator('.review-history')).toContainText(vi ? 'Khó' : 'Hard')
      await expect(page.locator('.review-activity [role="alert"]')).toHaveCount(0)
      const draft = page.getByRole('textbox', { name: vi ? 'Câu trả lời của bạn' : 'Your review answer' })
      await draft.fill('sys.executable')
      const reveal = page.locator('.review-card summary')
      await reveal.focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('.review-card details')).toHaveAttribute('open', '')
      expect(writes).toHaveLength(0)
      const good = page.getByRole('button', { name: vi ? 'Nhớ được' : 'Good', exact: true })
      await good.click()
      await expect(page.getByRole('alert')).toHaveText('Save offline')
      await expect(draft).toHaveValue('sys.executable')
      await good.click()
      await expect(good).toBeDisabled()
      await expect(draft).toBeDisabled()
      await expect(good).toContainText(vi ? 'Đang lưu' : 'Saving')
      expect(writes).toHaveLength(2)
      expect(writes[1]).toEqual(writes[0])
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await checkThemeContrast(page)
          await page.locator('.review-layout').screenshot({
            path: `.build/review-evidence/${language}-${theme}-${width}-pending.png`, animations: 'disabled',
          })
        }
      }
      release()
      await expect(question).toHaveText(vi ? cards[1].question_vi : cards[1].question_en)
      await expect(question).toBeFocused()
      await expect(question).toBeInViewport()
      await expect(draft).toHaveValue('')
      await expect(page.locator('.review-card details')).not.toHaveAttribute('open')
      await expect(good).toBeEnabled()
      await good.focus()
      await page.keyboard.press('Space')
      await expect(page.locator('.review-empty h3')).toBeFocused()
      await expect(page.locator('.review-empty')).toContainText(vi ? 'Đã hết thẻ' : 'session is complete')
      expect(writes).toHaveLength(3)
      await checkThemeContrast(page)
      await page.locator('.weak-topics button').click()
      await expect(page).toHaveURL(/\/lesson\/phase-00-onboarding-environment-1$/)
    } finally { release() }
  })
}
