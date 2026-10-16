import { expect, test } from '@playwright/test'
import catalog from '../../content/lessons.json' with { type: 'json' }
import { checkEditorialReading } from './editorial-reading-checks'
import { mockAuthenticatedLearner } from './hosted-learner'
import { checkThemeContrast } from './theme-checks'

const examples = [
  {
    number: 1,
    functionName: 'fit_line',
    expectedOutput: 'slope=2.00, intercept=1.00\nbaseline_mse=4.00\nlinear_mse=0.00',
    recall: { vi: '2 × 3 + 1 = 7', en: '2 × 3 + 1 = 7' },
  },
  {
    number: 2,
    functionName: 'sigmoid',
    expectedOutput: [
      'probabilities=[0.8, 0.6, 0.4, 0.2]',
      'threshold=0.5, labels=[1, 1, 0, 0]',
      'precision=0.500, recall=0.500',
      'threshold=0.3, labels=[1, 1, 1, 0]',
      'precision=0.667, recall=1.000',
    ].join('\n'),
    recall: { vi: 'Xác suất mô hình vẫn là 0,4', en: 'model probability remains 0.4' },
  },
  {
    number: 3,
    functionName: 'fit_stump',
    expectedOutput: 'threshold=3.5\nstump_predictions=[0, 1]\nsupplied_tree_votes=[0, 1]',
    recall: { vi: 'Sao chép một cây', en: 'Copies of one tree' },
  },
  {
    number: 4,
    functionName: 'fit_stump',
    expectedOutput: [
      'baseline=2.50, threshold=2.5',
      'learning_rate=0.5, predictions=[1.75, 1.75, 3.25, 3.25]',
      'training_mse_before=2.2500',
      'training_mse_after=0.5625',
    ].join('\n'),
    recall: { vi: '8 + 0,1 × 2 = 8,2', en: '8 + 0.1 × 2 = 8.2' },
  },
]

for (const language of ['vi', 'en'] as const) {
  test(`${language} Classical ML lessons expose runnable examples and readable substantive review answers`,
    async ({ page, baseURL }) => {
      test.setTimeout(120_000)
      if (!baseURL) throw new Error('Classical ML tests require the configured hosted preview baseURL')
      const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, language)
      const browserErrors: string[] = []
      page.on('pageerror', (error) => browserErrors.push(error.message))
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      const readability: Array<Record<string, string | number>> = []

      for (const fixture of examples) {
        await test.step(`models-${fixture.number}: code, output and all four answer hints`, async () => {
          const slug = `phase-03-classical-ml-models-${fixture.number}`
          const lesson = catalog.lessons.find((item) => item.lesson_id === slug)
          if (!lesson) throw new Error(`Classical ML catalog fixture is missing ${slug}`)
          const lessonPath = `/lesson/${slug}?route=foundation`
          await page.goto(lessonPath)
          await expect(page.locator('#lesson-page-title')).toHaveText(lesson[`title_${language}`])
          await expect(page).toHaveURL(lessonPath)
          const example = page.locator('.code-example')
          await expect(example).toHaveCount(1)
          const source = example.locator('pre')
          await expect(source).toContainText(`def ${fixture.functionName}(`)
          await source.focus()
          await expect(source).toBeFocused()
          await page.keyboard.press('Tab')
          await expect(source).not.toBeFocused()

          expect(lesson.code_examples[0].expected_output).toBe(fixture.expectedOutput)
          const output = example.locator('.code-example-guide dd').filter({
            hasText: fixture.expectedOutput.split('\n')[0],
          })
          await expect(output).toHaveCount(1)
          await expect(output).toBeVisible()
          await expect(output).toHaveCSS('white-space', 'pre-wrap')
          expect(await output.innerText()).toBe(fixture.expectedOutput)

          expect(lesson.review_cards.map((card) => card.type))
            .toEqual(['recall', 'application', 'debug', 'interview'])
          const prompts = page.locator('.review-prompt')
          await expect(prompts).toHaveCount(4)
          for (const card of lesson.review_cards) {
            const question = card[`question_${language}`]
            const answer = card[`answer_${language}`]
            expect(answer).not.toMatch(/A strong answer|input, transformation and output/i)
            const prompt = prompts.filter({ hasText: question })
            await expect(prompt.getByText(question, { exact: true })).toBeVisible()
            const summary = prompt.locator('summary')
            await expect(summary).toHaveText(language === 'vi' ? 'Hiện gợi ý đáp án' : 'Show answer hint')
            await expect(prompt.locator('details')).not.toHaveAttribute('open')
            await summary.focus()
            await expect(summary).toBeFocused()
            await page.keyboard.press(card.type === 'debug' ? 'Space' : 'Enter')
            await expect(prompt.locator('details')).toHaveAttribute('open', '')
            await expect(prompt.locator('details > p')).toHaveText(answer)
            await expect(prompt.locator('details > p')).toBeVisible()
          }
          await expect(prompts.first().locator('details > p')).toContainText(fixture.recall[language])

          for (const width of [390, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            for (const theme of ['light', 'dark'] as const) {
              await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
              await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
              await checkThemeContrast(page)
              const reading = await checkEditorialReading(page, page.locator(
                '.concept-notes > p, .code-example > p, .code-example pre, .code-example pre code, '
                + '.code-example-guide dt, .code-example-guide dd, .review-prompt > p, '
                + '.review-prompt details > p, .review-prompt summary',
              ))
              readability.push({ lesson: slug, language, width, theme, ...reading })
              if (fixture.number === 2 && width === 390 && theme === 'dark') {
                await example.locator('.code-example-guide').screenshot({
                  path: `.build/models-lesson-evidence/hosted-${language}-logistic-output-dark-390.png`,
                  animations: 'disabled',
                })
              }
              if (fixture.number === 4 && width === 1440 && theme === 'light') {
                await prompts.first().screenshot({
                  path: `.build/models-lesson-evidence/hosted-${language}-boosting-answer-light-1440.png`,
                  animations: 'disabled',
                })
              }
            }
          }
          await expect(page).toHaveURL(lessonPath)
          expect(unexpected, 'Hosted lessons must not call local APIs, write data or reach real services').toEqual([])
          expect(browserErrors, 'Hosted browser errors').toEqual([])
        })
      }
      await test.info().attach('classical-lesson-readability', {
        body: JSON.stringify(readability, null, 2),
        contentType: 'application/json',
      })
    })
}
