import { expect, test } from '@playwright/test'
import catalog from '../../content/lessons.json' with { type: 'json' }
import { checkEditorialReading } from './editorial-reading-checks'
import { mockAuthenticatedLearner } from './hosted-learner'
import { checkThemeContrast } from './theme-checks'

const lessons = [
  'phase-04-deep-learning-pytorch-core-1',
  'phase-04-deep-learning-pytorch-core-4',
  'phase-04-deep-learning-training-1',
  'phase-04-deep-learning-vision-nlp-3',
  'phase-04-deep-learning-vision-nlp-4',
  'phase-05-mlops-containers-1',
  'phase-05-mlops-containers-2',
  'phase-07-capstone-career-ship-1',
  'phase-07-capstone-career-ship-2',
  'phase-13-genai-advanced-rag-advanced-rag-1',
  'phase-13-genai-advanced-rag-advanced-rag-2',
  'phase-14-genai-tool-calling-tool-calling-4',
  'phase-15-genai-agents-ai-agents-3',
  'phase-15-genai-agents-ai-agents-4',
  'phase-16-genai-mcp-mcp-4',
  'phase-17-genai-evaluation-genai-evaluation-2',
  'phase-18-genai-observability-genai-observability-2',
  'phase-19-genai-production-genai-production-4',
]

for (const language of ['vi', 'en'] as const) {
  for (const width of [320, 1440]) {
    for (const theme of ['light', 'dark'] as const) {
      test(`research lessons ${language} ${width}px ${theme}`, async ({ page, baseURL }) => {
        test.setTimeout(240_000)
        if (!baseURL) throw new Error('Use the hosted production preview config')
        const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, language)
        const errors: string[] = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
        const measurements = []
        for (const slug of lessons) {
          await test.step(slug, async () => {
            const lesson = catalog.lessons.find((item) => item.lesson_id === slug)
            if (!lesson) throw new Error(`Missing ${slug}`)
            const path = `/lesson/${slug}?route=application`
            await page.goto(path)
            await expect(page.locator('#lesson-page-title')).toHaveText(lesson[`title_${language}`])
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            const examples = page.locator('.code-example')
            await expect(examples).toHaveCount(lesson.code_examples.length)
            for (let index = 0; index < lesson.code_examples.length; index += 1) {
              const fixture = lesson.code_examples[index]
              const example = examples.nth(index)
              await expect(example.locator('pre')).toContainText(fixture.code.trim().split('\n')[0])
              await expect(example.locator('.code-example-guide')).toContainText(fixture.expected_output)
              await example.locator('pre').focus()
              await expect(example.locator('pre')).toBeFocused()
              await page.keyboard.press('Tab')
              await expect(example.locator('pre')).not.toBeFocused()
            }
            const prompts = page.locator('.review-prompt')
            await expect(prompts).toHaveCount(4)
            await prompts.first().locator('summary').focus()
            await page.keyboard.press('Enter')
            await expect(prompts.first().locator('details')).toHaveAttribute('open', '')
            await expect(prompts.first().locator('details > p')).toHaveText(lesson.review_cards[0][`answer_${language}`])
            await checkThemeContrast(page)
            const measurement = await checkEditorialReading(page, page.locator(
              '.concept-notes > p, .code-example > p, .code-example pre, '
              + '.code-example-guide dt, .code-example-guide dd, .review-prompt details > p',
            ))
            measurements.push({ slug, ...measurement })
            if (slug.endsWith('containers-2') || slug.endsWith('vision-nlp-4')) {
              await examples.first().locator('.code-example-guide').screenshot({
                path: `.build/research-20261021/screens/${slug}-${language}-${width}-${theme}.png`,
                animations: 'disabled',
              })
            }
            await expect(page).toHaveURL(path)
          })
        }
        expect(errors).toEqual([])
        expect(unexpected, 'No real service calls or data writes').toEqual([])
        await test.info().attach('readability', {
          body: JSON.stringify(measurements, null, 2), contentType: 'application/json',
        })
      })
    }
  }
}
