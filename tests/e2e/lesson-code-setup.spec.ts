import { expect, test } from '@playwright/test'
import catalog from '../../content/lessons.json' with { type: 'json' }
import type { CodeExample, Lesson } from '../../src/api'
import { checkEditorialReading } from './editorial-reading-checks'

const lessons = catalog.lessons.filter((lesson) =>
  /^phase-03-classical-ml-(preprocessing|models|evaluation)-[1-4]$/.test(lesson.lesson_id))

for (const language of ['vi', 'en'] as const) {
  test(`${language} localized setup survives real FastAPI across 12 Classical ML lesson pages`,
    async ({ page, request }) => {
      test.setTimeout(120_000)
      expect(lessons).toHaveLength(12)
      const alternate = language === 'vi' ? 'en' : 'vi'
      const browserErrors: string[] = []
      page.on('pageerror', (error) => browserErrors.push(error.message))
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      await page.route('**/api/settings', async (route) => {
        expect(route.request().method(), 'Settings language override must remain read-only').toBe('GET')
        const response = await route.fetch()
        await route.fulfill({ json: { ...await response.json(), language } })
      })

      for (const [index, lesson] of lessons.entries()) {
        await test.step(`${lesson.lesson_id}: real API and localized setup`, async () => {
          const response = await request.get(`/api/lessons/${lesson.lesson_id}`)
          expect(response.ok(), `${response.status()} from local lesson API`).toBeTruthy()
          const payload: Lesson = await response.json()
          expect(payload.slug).toBe(lesson.lesson_id)
          expect(payload.code_examples).toHaveLength(1)
          const expected: CodeExample = lesson.code_examples[0]
          const actual = payload.code_examples[0]
          for (const field of ['setup', 'setup_vi', 'setup_en', 'code', 'expected_output'] as const) {
            expect(expected[field]?.trim(), `${lesson.lesson_id} source ${field}`).toBeTruthy()
            expect(actual[field], `${lesson.lesson_id} API ${field}`).toBe(expected[field])
          }

          await page.goto(`/lesson/${lesson.lesson_id}`)
          await expect(page.locator('#lesson-page-title')).toHaveText(lesson[`title_${language}`])
          const example = page.locator('.code-example')
          await expect(example).toHaveCount(1)
          await expect(example.locator('pre code')).toHaveText(expected.code)
          const guide = example.locator('.code-example-guide')
          const setup = guide.locator('dd').first()
          await expect(guide.locator('dt').first()).toHaveText(language === 'vi' ? 'Chuẩn bị' : 'Setup')
          await expect(setup).toHaveText(expected[`setup_${language}`]!)
          expect(expected[`setup_${language}`]).not.toBe(expected[`setup_${alternate}`])
          await expect(guide).not.toContainText(expected[`setup_${alternate}`]!)
          await expect(guide.locator('dd').nth(1)).toHaveText(expected.expected_output!)

          for (const width of [390, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            await setup.scrollIntoViewIfNeeded()
            await expect(setup).toBeVisible()
            await checkEditorialReading(page, example.locator('p, pre, pre code, dt, dd'))
            if (index === 0) {
              await guide.screenshot({
                path: `.build/models-lesson-evidence/local-${language}-setup-${width}.png`,
                animations: 'disabled',
              })
            }
          }
          expect(browserErrors, 'Local lesson browser errors').toEqual([])
        })
      }
    })
}
