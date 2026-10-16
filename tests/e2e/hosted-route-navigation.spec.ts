import { expect, test } from '@playwright/test'
import catalog from '../../content/lessons.json' with { type: 'json' }
import { mockAuthenticatedLearner } from './hosted-learner'
import { checkThemeContrast } from './theme-checks'

function catalogLesson(slug: string) {
  const lesson = catalog.lessons.find((item) => item.lesson_id === slug)
  if (!lesson) throw new Error(`Hosted catalog fixture is missing ${slug}`)
  return lesson
}

function lessonUrl(slug: string) {
  return `/lesson/${slug}?route=application`
}

for (const language of ['vi', 'en'] as const) {
  test(`${language} hosted application route crosses core boundaries and ends without specialization links`,
    async ({ page, baseURL }) => {
      test.setTimeout(60_000)
      if (!baseURL) throw new Error('Hosted route tests require the configured local preview baseURL')
      const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, language)
      const browserErrors: string[] = []
      page.on('pageerror', (error) => browserErrors.push(error.message))
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      const boundaries = [
        ['phase-12-genai-rag-rag-foundations-4', 'phase-17-genai-evaluation-genai-evaluation-1'],
        ['phase-19-genai-production-genai-production-4', 'phase-07-capstone-career-problem-1'],
      ]
      for (const [sourceSlug, targetSlug] of boundaries) {
        await test.step(`${sourceSlug} continues to ${targetSlug}`, async () => {
          const source = catalogLesson(sourceSlug)
          const target = catalogLesson(targetSlug)
          await page.goto(lessonUrl(source.lesson_id))
          await expect(page.locator('#lesson-page-title')).toHaveText(source[`title_${language}`])
          const next = page.locator('.next-lesson-list button').first()
          await expect(next).toHaveText(`${target[`title_${language}`]} →`)
          await next.click()
          await expect(page).toHaveURL(lessonUrl(target.lesson_id))
          await expect(page.locator('#lesson-page-title')).toHaveText(target[`title_${language}`])
          await page.reload()
          await expect(page).toHaveURL(lessonUrl(target.lesson_id))
          await expect(page.locator('#lesson-page-title')).toHaveText(target[`title_${language}`])
        })
      }

      const lastLesson = catalogLesson('phase-07-capstone-career-career-4')
      await page.goto(lessonUrl(lastLesson.lesson_id))
      await expect(page.locator('#lesson-page-title')).toHaveText(lastLesson[`title_${language}`])
      const completion = page.locator('section[aria-labelledby="lesson-next-title"]')
      await expect(completion.getByRole('heading', {
        level: 2, name: language === 'vi' ? 'Bài tiếp theo' : 'Next lessons', exact: true,
      })).toBeVisible()
      await expect(completion).toContainText(language === 'vi' ? 'bài cuối' : 'last core lesson')
      await expect(completion.locator('.next-lesson-list button')).toHaveCount(0)
      const reviewRoadmap = completion.getByRole('button', {
        name: language === 'vi' ? 'Xem lại lộ trình' : 'Review the roadmap', exact: true,
      })
      await expect(reviewRoadmap).toBeVisible()

      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await completion.scrollIntoViewIfNeeded()
          await checkThemeContrast(page)
          const spacing = await completion.evaluate((element) => {
            const style = getComputedStyle(element)
            const label = element.querySelector('.muted')!
            return {
              left: parseFloat(style.paddingLeft),
              right: parseFloat(style.paddingRight),
              labelSize: parseFloat(getComputedStyle(label).fontSize),
            }
          })
          expect(spacing.left).toBeGreaterThanOrEqual(16)
          expect(spacing.right).toBeGreaterThanOrEqual(16)
          expect(spacing.labelSize).toBeGreaterThanOrEqual(16)
          await completion.screenshot({
            path: `.build/route-evidence/hosted-${language}-${theme}-${width}-route-end.png`,
            animations: 'disabled',
          })
        }
      }
      await reviewRoadmap.click()
      await expect(page).toHaveURL('/roadmap?route=application')
      await expect(page.getByRole('button', {
        name: language === 'vi' ? /Làm ứng dụng AI/ : /Build AI applications/,
      })).toHaveAttribute('aria-pressed', 'true')
      expect(unexpected, 'Hosted navigation must not call local APIs, write data or reach real services').toEqual([])
      expect(browserErrors, 'Hosted browser errors').toEqual([])
    })
}
