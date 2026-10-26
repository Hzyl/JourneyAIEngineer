import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} topic roadmap keeps review beside RAG and preserves existing lesson navigation`, async ({ page }) => {
    const vi = language === 'vi'
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language, show_completed_lessons: true } })
    })
    await page.goto('/roadmap')
    await expect(page.locator('.lesson-row')).toHaveCount(208)
    const topics = await page.locator('[data-topic]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-topic')))
    expect(topics.at(-1)).toBe('portfolio')
    expect(topics.indexOf('production')).toBeLessThan(topics.indexOf('agents'))
    const rag = page.locator('[data-topic="rag"]')
    const review = rag.locator('[data-section-kind="review"]')
    await expect(review).not.toHaveAttribute('open')
    await expect(rag.locator('[data-phase-id="phase-12-genai-rag"]')).toBeVisible()
    await review.locator('summary').focus()
    await page.keyboard.press('Enter')
    await expect(review).toHaveAttribute('open', '')
    await expect(review.locator('.lesson-row')).toHaveCount(8)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await review.scrollIntoViewIfNeeded()
        await page.screenshot({ path: `.build/roadmap-20261022/${language}-${theme}-${width}-review.png` })
      }
    }
    const slug = 'phase-06-llm-rag-rag-1'
    await review.locator(`[data-lesson-id="${slug}"]`).click()
    await expect(page.locator('#lesson-page-title')).toBeVisible()
    await page.getByRole('button', { name: vi ? 'Quay lại' : 'Back', exact: true }).click()
    await expect(page).toHaveURL(/\/roadmap$/)
    await page.goto('/roadmap?phase=phase-06-llm-rag')
    await expect(page.locator('.lesson-row')).toHaveCount(24)
    await expect(page.locator(`[data-lesson-id="${slug}"]`)).toBeVisible()
    await page.goto('/roadmap?q=Quy+trình+RAG')
    await expect(page.locator(`[data-lesson-id="${slug}"]`)).toBeVisible()
    await page.goto('/roadmap?route=application')
    await expect(page.locator('[data-topic="engineering"] [data-section-kind="bridge"]')).toHaveAttribute('open', '')
    await expect(page.locator('[data-topic]').last()).toHaveAttribute('data-topic', 'portfolio')
    expect(errors).toEqual([])
  })
}
