import { expect, test } from '@playwright/test'
import { checkThemeContrast } from './theme-checks'
import type { ReferenceResource } from '../../src/api'

const resources: ReferenceResource[] = [{
  slug: 'readable-reference',
  title_vi: 'Tài liệu học máy: từ nền tảng toán học đến ứng dụng kỹ thuật có thể kiểm chứng',
  title_en: 'Machine learning reference: from mathematical foundations to verifiable engineering practice',
  provider: 'Example Learning Community',
  url: 'https://example.com/reference', type: 'Book', language: 'en', level: 'beginner', official: false,
  phase_ids: ['phase-02', 'phase-03'],
  description_vi: 'Đọc tài liệu theo mục tiêu bài học, kiểm tra ví dụ và ghi lại kết quả trước khi thực hành.',
  description_en: 'Read with a learning goal, verify the examples and record results before practicing.',
  how_to_use_vi: 'Đọc từng phần, chạy ví dụ và giải thích lại kết quả bằng lời của bạn.',
  how_to_use_en: 'Read each section, run the examples and explain the results in your own words.',
}, {
  slug: 'long-reference',
  title_vi: `Tài liệu ${'LongReferenceIdentifier'.repeat(4)}`,
  title_en: `Reference ${'LongReferenceIdentifier'.repeat(4)}`,
  provider: 'ExampleProvider'.repeat(5),
  url: '', type: 'Official docs', language: 'vi', level: 'beginner', official: true,
  phase_ids: ['phase-02'],
  description_vi: 'Nội dung mẫu để kiểm tra cách ngắt dòng khi tên tài liệu hoặc nhà cung cấp quá dài.',
  description_en: 'Sample content to check wrapping when a reference or provider name is unusually long.',
  how_to_use_vi: 'Xem hướng dẫn và ghi lại điều bạn đã kiểm chứng.',
  how_to_use_en: 'Review the guide and record what you verified.',
}]

for (const language of ['vi', 'en'] as const) {
  test(`${language} resource library preserves filters and remains readable`, async ({ page }) => {
    const vi = language === 'vi'
    await page.route('**/api/resources', (route) => route.fulfill({
      json: { resources, count: resources.length, total: resources.length },
    }))
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch()
      await route.fulfill({ json: { ...await response.json(), language } })
    })
    await page.goto('/resources')
    await expect(page.locator('.resources-intro h2')).toContainText(vi ? 'Học từ nguồn' : 'Learn from sources')
    const search = page.getByRole('searchbox', { name: vi ? 'Tìm tài liệu' : 'Search resources' })
    const phase = page.getByRole('combobox', { name: vi ? 'Lọc theo giai đoạn' : 'Filter by phase' })
    const type = page.getByRole('combobox', { name: vi ? 'Lọc theo loại' : 'Filter by type' })
    await type.selectOption('Book')
    expect(new URL(page.url()).searchParams.get('type')).toBe('Book')
    await page.reload()
    await expect(type).toHaveValue('Book')
    await type.selectOption('all')
    await search.fill('not-a-real-resource-123')
    await expect(page.getByRole('heading', { name: vi ? 'Không tìm thấy tài liệu' : 'No resources found' }))
      .toBeVisible()
    await search.clear()
    await phase.selectOption('phase-02')
    await expect(phase).toHaveValue('phase-02')
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        const typography = await page.locator('.resources-view').evaluate((library) => {
          const selectors = ['.resources-intro > p', '.resource-library-header p',
            '.resource-library-header h3', '.resource-card h4', '.resource-provider',
            '.resource-card > p:not(.resource-provider)', '.resource-how strong', '.resource-how p',
            '.resource-phases span', '.resource-language', '.tag', '.resource-link',
            '.resource-internal-note', 'input', 'select', '[role="status"]']
          return Object.fromEntries(selectors.map((selector) => {
            const element = library.querySelector(selector)!
            const style = getComputedStyle(element)
            return [selector, { font: parseFloat(style.fontSize), line: style.lineHeight,
              height: element.getBoundingClientRect().height }]
          }))
        })
        await test.info().attach(`${language}-${theme}-${width}-typography`, {
          body: JSON.stringify(typography, null, 2), contentType: 'application/json',
        })
        for (const [selector, size] of Object.entries(typography)) {
          const body = ['.resources-intro > p', '.resource-library-header p',
            '.resource-card > p:not(.resource-provider)',
            '.resource-how p'].includes(selector)
          expect(size.font, `${selector} at ${width}px in ${theme}`).toBeGreaterThanOrEqual(body ? 18 : 16)
          // Native selects compute line-height as normal in Chromium; verify their target height instead.
          if (selector === 'select' || selector === 'input') expect(size.height).toBeGreaterThanOrEqual(44)
          if (selector !== 'select') {
            expect(parseFloat(size.line), `${selector} line spacing`).toBeGreaterThanOrEqual(size.font * 1.4)
          }
        }
        const overflow = await page.locator('.resource-library-card').evaluate((library) =>
          [...library.querySelectorAll<HTMLElement>('.resource-card, input, select, .resource-link')]
            .filter((element) => element.scrollWidth > element.clientWidth + 1)
            .map((element) => element.className || element.id))
        expect(overflow, `Unclipped content at ${width}px in ${theme}`).toEqual([])
        await expect(page.locator('.resource-link')).toHaveAttribute('href', 'https://example.com/reference')
        await checkThemeContrast(page)
        await page.screenshot({ path: `.build/resources-evidence/${language}-${theme}-${width}.png`,
          fullPage: true, animations: 'disabled' })
      }
    }
    await search.focus()
    await page.keyboard.press('Tab')
    await expect(phase).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(type).toBeFocused()
  })
}
