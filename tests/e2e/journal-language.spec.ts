import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} journal preserves notes, labels controls and handles clipboard failure`, async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.route('**/api/notes', (route) => route.fulfill({ json: { notes: [{
      id: 1, title: 'My own title', body: 'Nội dung gốc của người học.',
      lesson_title_vi: 'Môi trường Python', lesson_title_en: 'Python environment',
      updated_at: '2026-10-07T12:00:00Z',
    }] } }))
    await page.route('**/api/git/status', (route) => route.fulfill({ json: {
      root: '', branch: '', status: '', remote: '', last_commit: '',
    } }))
    await page.route('**/api/git/diff', (route) => route.fulfill({ json: { diff: '' } }))
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: {
        writeText: async () => { throw new DOMException('Denied', 'NotAllowedError') },
      } })
    })
    let submittedQuestion = ''
    await page.route('**/api/context/export', (route) => {
      submittedQuestion = route.request().postDataJSON().question
      return route.fulfill({ json: { path: 'context.md', content: '# Context\nKeep my own wording.' } })
    })
    await page.route('**/api/journal/export', (route) => route.fulfill({ json: { path: 'journal/week.md' } }))
    await page.goto('/journal')
    const vi = language === 'vi'
    await expect(page.getByRole('heading', { name: vi ? 'Insight đã lưu' : 'Saved insights' })).toBeVisible()
    await expect(page.getByText('Nội dung gốc của người học.', { exact: true })).toBeVisible()
    await expect(page.getByText(vi ? 'Môi trường Python' : 'Python environment', { exact: false })).toBeVisible()
    await expect(page.getByText(vi ? 'Chưa khởi tạo' : 'Not initialized', { exact: true })).toBeVisible()
    await page.getByRole('textbox', { name: vi ? 'Câu hỏi cho trợ lý' : 'Question for your assistant' }).fill('My question')
    await page.getByRole('button', { name: vi ? 'Tạo context & copy' : 'Create context & copy' }).click()
    expect(submittedQuestion).toBe('My question')
    await expect(page.getByRole('alert').filter({ hasText: vi ? 'clipboard' : 'Clipboard' })).toBeVisible()
    const preview = page.getByRole('textbox', { name: vi ? 'Context vừa tạo' : 'Generated context' })
    await expect(preview).toHaveValue('# Context\nKeep my own wording.')
    await expect(preview).toHaveAttribute('readonly', '')
    await page.getByRole('button', { name: vi ? 'Xuất journal →' : 'Export journal →' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'journal/week.md' })).toBeVisible()
    await page.setViewportSize({ width: 390, height: 844 })
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme })
      await page.screenshot({
        path: `.build/journal-evidence/${language}-${theme}.png`,
        fullPage: true,
        animations: 'disabled',
      })
      await checkThemeContrast(page)
    }
  })
}
