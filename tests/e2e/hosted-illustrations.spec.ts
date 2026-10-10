import { expect, test } from '@playwright/test'
import { checkEditorialReading } from './editorial-reading-checks'

for (const theme of ['light', 'dark'] as const) {
  test(`public illustrations load and fit: ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const path of ['/', '/roadmap?route=genai', '/exercises', '/lesson/phase-00-onboarding-environment-1']) {
        await page.goto(path)
        const images = page.locator('.flow-art')
        await expect(images.first()).toBeAttached()
        for (const img of await images.all()) {
          await img.scrollIntoViewIfNeeded()
          await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
          const bounds = await img.boundingBox()
          expect(bounds!.width).toBeLessThanOrEqual(width)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        if (path === '/' && [390, 1440].includes(width)) {
          await page.evaluate(() => scrollTo(0, 0))
          await page.screenshot({ path: `.build/flow-ui/public-${theme}-${width}.png` })
        }
      }
    }
  })
}

for (const theme of ['light', 'dark'] as const) {
  for (const width of [320, 390, 1440]) {
    test(`Vietnamese lesson and solution remain readable: ${theme} ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      const unsafeRequests: string[] = []
      page.on('request', (request) => {
        if (new URL(request.url()).pathname.startsWith('/api/')
          || !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) unsafeRequests.push(request.url())
      })
      await page.goto('/lesson/phase-00-onboarding-environment-1?lang=vi')
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
      const lesson = page.locator('.public-lesson')
      await expect(lesson.locator('.public-prose')).toContainText('Trình thông dịch')
      await expect(lesson.locator('.public-prose > p')).toHaveCount(2)
      await expect(lesson.locator('.public-example')).not.toContainText(
        'Trình thông dịch là chương trình thực thi tệp Python.',
      )
      await expect.poll(() => lesson.locator('.flow-art').evaluate((element: HTMLImageElement) =>
        element.naturalWidth)).toBeGreaterThan(0)
      await page.screenshot({ path: `.build/editorial-ui/lesson-${theme}-${width}.png`,
        fullPage: true, animations: 'disabled' })
      const lessonReadability = await checkEditorialReading(page, lesson.locator(
        '.public-prose > p, section > ul > li, .public-example > p:not(.public-footnote), .public-practice > p:not(.public-footnote)',
      ))
      await page.goto('/exercises?exercise=exercise-3-ml-framing&lang=vi')
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
      const solution = page.locator('.exercise-solution')
      await expect(solution.getByRole('table')).toHaveCount(0)
      await solution.getByRole('button', { name: 'Xem bài giải' }).click()
      await expect(solution.getByRole('table')).toHaveCount(2)
      const source = solution.getByLabel('Mã Python của lời giải')
      await expect(source).toBeHidden()
      const sourceToggle = solution.locator('.exercise-solution-primary summary')
      await sourceToggle.focus()
      await page.keyboard.press('Enter')
      await expect(source).toBeVisible()
      await expect(source).toContainText('def split_orders')
      await page.keyboard.press('Space')
      await expect(source).toBeHidden()
      await page.screenshot({ path: `.build/editorial-ui/exercise-${theme}-${width}.png`,
        fullPage: true, animations: 'disabled' })
      await solution.scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.build/editorial-ui/solution-${theme}-${width}.png`, animations: 'disabled' })
      const exerciseReadability = await checkEditorialReading(page, page.locator(
        '.exercise-prose p, .exercise-steps li, .exercise-checks li, .exercise-solution > p, '
        + '.exercise-solution-content > p, .exercise-solution-content > ol > li, '
        + '.exercise-solution-table td, .exercise-solution-table th',
      ))
      await test.info().attach('editorial-readability', {
        body: JSON.stringify({ theme, width, lesson: lessonReadability, exercise: exerciseReadability }, null, 2),
        contentType: 'application/json',
      })
      expect(unsafeRequests).toEqual([])
    })
  }
}
