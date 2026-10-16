import { expect, test } from '@playwright/test'
import catalog from '../../content/lessons.json' with { type: 'json' }
import type { CodeExample } from '../../src/api'
import { checkEditorialReading } from './editorial-reading-checks'
import { mockAuthenticatedLearner } from './hosted-learner'
import { checkThemeContrast } from './theme-checks'

type ExampleFixture = {
  group: 'preprocessing' | 'models' | 'evaluation'
  number: number
  functionName: string
  expectedOutput: string
  recall: { vi: string; en: string }
}

const examples: ExampleFixture[] = [
  {
    group: 'preprocessing',
    number: 1,
    functionName: 'fit_median',
    expectedOutput: [
      'train_median=20.0',
      'validation=[(20.0, 1), (0.0, 0), (200.0, 0)]',
      'test=[(20.0, 1), (30.0, 0)]',
      'median_after_transform=20.0',
    ].join('\n'),
    recall: { vi: '0 có thể là giá trị thật', en: 'Zero may be a genuine observation' },
  },
  {
    group: 'preprocessing',
    number: 2,
    functionName: 'fit_categories',
    expectedOutput: [
      "vocabulary=('blue', 'red')",
      'validation=[[0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]',
      'test=[[1, 0, 0, 0], [0, 0, 0, 1]]',
      "vocabulary_after_transform=('blue', 'red')",
    ].join('\n'),
    recall: {
      vi: 'One-hot tạo cờ từng nhóm, không áp đặt thứ tự',
      en: 'One-hot creates group indicators without imposing order',
    },
  },
  {
    group: 'preprocessing',
    number: 3,
    functionName: 'fit_scaler',
    expectedOutput: [
      'state=(15.0, 5.0)',
      'train=[-1.0, 1.0]',
      'validation=[0.0, 2.0]',
      'constant_state=(7.0, 1.0)',
      'constant_validation=[0.0, 2.0]',
      'log_counts=[0.0, 1.3863, 2.1972]',
    ].join('\n'),
    recall: {
      vi: 'Standardization học mean và độ lệch chuẩn từ train',
      en: 'Standardization learns training mean and standard deviation',
    },
  },
  {
    group: 'preprocessing',
    number: 4,
    functionName: 'purchase_features',
    expectedOutput: [
      "A_day30={'purchase_count': 2, 'total_spend': 30.0, 'mean_purchase': 15.0, 'no_history': 0}",
      "new_customer={'purchase_count': 0, 'total_spend': 0.0, 'mean_purchase': 0.0, 'no_history': 1}",
      "A_day32={'purchase_count': 4, 'total_spend': 200.0, 'mean_purchase': 50.0, 'no_history': 0}",
    ].join('\n'),
    recall: {
      vi: 'Đúng khách hàng, đúng cửa sổ và đã có sẵn trước cutoff',
      en: 'Use the correct customer, time window and information available before cutoff',
    },
  },
  {
    group: 'models',
    number: 1,
    functionName: 'fit_line',
    expectedOutput: 'slope=2.00, intercept=1.00\nbaseline_mse=4.00\nlinear_mse=0.00',
    recall: { vi: '2 × 3 + 1 = 7', en: '2 × 3 + 1 = 7' },
  },
  {
    group: 'models',
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
    group: 'models',
    number: 3,
    functionName: 'fit_stump',
    expectedOutput: 'threshold=3.5\nstump_predictions=[0, 1]\nsupplied_tree_votes=[0, 1]',
    recall: { vi: 'Sao chép một cây', en: 'Copies of one tree' },
  },
  {
    group: 'models',
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
  {
    group: 'evaluation',
    number: 1,
    functionName: 'binary_metrics',
    expectedOutput: [
      'filter TP FP TN FN: (1, 1, 7, 1)',
      'accuracy=0.800 precision=0.500 recall=0.500 f1=0.500',
      'baseline TP FP TN FN: (0, 0, 8, 2)',
      'accuracy=0.800 precision=0.000 recall=0.000 f1=0.000',
    ].join('\n'),
    recall: { vi: 'Recall=TP/(TP+FN)', en: 'Recall=TP/(TP+FN)' },
  },
  {
    group: 'evaluation',
    number: 2,
    functionName: 'regression_metrics',
    expectedOutput: 'uniform mae=2.000 mse=4.000 rmse=2.000\none_large mae=2.000 mse=16.000 rmse=4.000',
    recall: { vi: 'MAE=mean(|e|)', en: 'MAE=mean(|e|)' },
  },
  {
    group: 'evaluation',
    number: 3,
    functionName: 'cross_validate_mean',
    expectedOutput: [
      'fold=1 train=[2, 3, 4, 5] valid=[0, 1]',
      'train_mean=9.000 mae=6.000',
      'fold=2 train=[0, 1, 4, 5] valid=[2, 3]',
      'train_mean=7.000 mae=1.000',
      'fold=3 train=[0, 1, 2, 3] valid=[4, 5]',
      'train_mean=5.000 mae=6.000',
      'mean_mae=4.333 descriptive_sd=2.357',
    ].join('\n'),
    recall: { vi: 'các tập train giữa các lượt chồng lặp', en: 'training sets across iterations overlap' },
  },
  {
    group: 'evaluation',
    number: 4,
    functionName: 'select_neighbors',
    expectedOutput: [
      'k=1 validation_mae=2.000',
      'k=3 validation_mae=0.667',
      'k=5 validation_mae=0.500',
      'selected_k=5 candidate_fits=3',
      'test_mae=1.000',
      'baseline_test_mae=2.000',
    ].join('\n'),
    recall: { vi: 'k là số láng giềng', en: 'k is the number of neighbors' },
  },
]

for (const language of ['vi', 'en'] as const) {
  test(`${language} Classical ML lessons expose runnable examples and readable substantive review answers`,
    async ({ page, baseURL }) => {
      test.setTimeout(180_000)
      expect(examples).toHaveLength(12)
      if (!baseURL) throw new Error('Classical ML tests require the configured hosted preview baseURL')
      const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL).origin, language)
      const browserErrors: string[] = []
      page.on('pageerror', (error) => browserErrors.push(error.message))
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      const readability: Array<Record<string, string | number>> = []

      for (const fixture of examples) {
        await test.step(`${fixture.group}-${fixture.number}: code, output and all four answer hints`, async () => {
          const slug = `phase-03-classical-ml-${fixture.group}-${fixture.number}`
          const lesson = catalog.lessons.find((item) => item.lesson_id === slug)
          if (!lesson) throw new Error(`Classical ML catalog fixture is missing ${slug}`)
          const lessonPath = `/lesson/${slug}?route=foundation`
          await page.goto(lessonPath)
          await expect(page.locator('#lesson-page-title')).toHaveText(lesson[`title_${language}`])
          await expect(page).toHaveURL(lessonPath)
          const example = page.locator('.code-example')
          await expect(example).toHaveCount(1)
          const codeExample: CodeExample = lesson.code_examples[0]
          const alternate = language === 'vi' ? 'en' : 'vi'
          const localizedSetup = codeExample[`setup_${language}`]
          const alternateSetup = codeExample[`setup_${alternate}`]
          expect(localizedSetup?.trim(), `${slug} setup_${language}`).toBeTruthy()
          expect(alternateSetup?.trim(), `${slug} setup_${alternate}`).toBeTruthy()
          expect(localizedSetup).not.toBe(alternateSetup)
          const guide = example.locator('.code-example-guide')
          const setup = guide.locator('dd').first()
          await expect(guide.locator('dt').first()).toHaveText(language === 'vi' ? 'Chuẩn bị' : 'Setup')
          await expect(setup).toHaveText(localizedSetup!)
          await expect(guide).not.toContainText(alternateSetup!)
          const source = example.locator('pre')
          await expect(source).toContainText(`def ${fixture.functionName}(`)
          await source.focus()
          await expect(source).toBeFocused()
          await page.keyboard.press('Tab')
          await expect(source).not.toBeFocused()

          const expectedOutput = fixture.expectedOutput
          expect(expectedOutput.trim(), `${slug} must provide concrete expected output`).toBeTruthy()
          expect(expectedOutput).not.toMatch(/Một output nhỏ|small output|expected output here/i)
          expect(codeExample.expected_output).toBe(fixture.expectedOutput)
          const output = example.locator('.code-example-guide dd').filter({
            hasText: expectedOutput.split('\n')[0],
          })
          await expect(output).toHaveCount(1)
          await expect(output).toBeVisible()
          await expect(output).toHaveCSS('white-space', 'pre-wrap')
          expect(await output.innerText()).toBe(expectedOutput)

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
              await expect(setup).toBeVisible()
              await expect(setup).toHaveText(localizedSetup!)
              await checkThemeContrast(page)
              const reading = await checkEditorialReading(page, page.locator(
                '.concept-notes > p, .code-example > p, .code-example pre, .code-example pre code, '
                + '.code-example-guide dt, .code-example-guide dd, .review-prompt > p, '
                + '.review-prompt details > p, .review-prompt summary',
              ))
              readability.push({ lesson: slug, language, width, theme, ...reading })
              if (fixture.group === 'models' && fixture.number === 1 && theme === 'light') {
                await guide.screenshot({
                  path: `.build/models-lesson-evidence/hosted-${language}-setup-${width}.png`,
                  animations: 'disabled',
                })
              }
              if (fixture.number === 2 && width === 390 && theme === 'dark') {
                await example.locator('.code-example-guide').screenshot({
                  path: `.build/models-lesson-evidence/hosted-${language}-${fixture.group}-2-output-dark-390.png`,
                  animations: 'disabled',
                })
              }
              if (fixture.number === 4 && width === 1440 && theme === 'light') {
                await prompts.first().screenshot({
                  path: `.build/models-lesson-evidence/hosted-${language}-${fixture.group}-4-answer-light-1440.png`,
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
