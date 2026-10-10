import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { checkThemeContrast } from './theme-checks'

for (const language of ['vi', 'en'] as const) {
  test(`${language} guests read exercise guides, download files and navigate without local APIs`, async ({ page }) => {
    const vi = language === 'vi'
    const unsafeRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/') || !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
        unsafeRequests.push(request.url())
      }
    })
    await page.goto('/exercises')
    if (!vi) await page.getByRole('button', { name: 'Switch to English' }).click()
    await expect(page.locator('.exercise-card')).toHaveCount(12)
    await expect(page.locator('.practice-page a[href*="github"]')).toHaveCount(0)
    await expect(page.locator('.practice-page .warning-note')).toHaveCount(0)
    const search = page.getByRole('searchbox', { name: vi ? 'Tìm bài tập' : 'Search exercises' })
    await search.fill('summarize_scores')
    await expect(page.locator('.exercise-card')).toHaveCount(1)
    const open = page.locator('.exercise-open')
    await open.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/exercise=exercise-0-baseline/)
    await expect(page.locator('.exercise-detail h2')).toBeFocused()
    await expect(page.getByRole('heading', { name: vi ? '02 · Hướng dẫn làm bài' : '02 · How to approach it' })).toBeVisible()
    await expect(page.locator('.exercise-reading')).toContainText('ValueError')
    await expect(page.locator('.exercise-workspace')).toHaveCount(0)
    await expect(page.locator('.exercise-prose code').first()).toHaveText('summarize_scores(scores)')
    await page.getByText(vi ? 'Cần gợi ý?' : 'Need a hint?', { exact: true }).click()
    await expect(page.locator('.exercise-hints')).toContainText('math.isfinite')
    await page.getByText(vi ? 'Xem mã khởi đầu' : 'View starter code', { exact: true }).click()
    await expect(page.locator('.exercise-source pre')).toBeVisible()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: /starter.py/ }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('starter.py')
    expect(await readFile((await download.path())!, 'utf8')).toContain('def summarize_scores(scores):')
    await page.getByText(vi ? 'Xem mã khởi đầu' : 'View starter code', { exact: true }).click()
    const solution = page.locator('.exercise-solution')
    const reveal = solution.getByRole('button')
    await page.getByRole('link', { name: vi ? 'Bài giải' : 'Solution', exact: true }).click()
    await expect(page).toHaveURL(/#exercise-solution$/)
    await expect(solution).toBeFocused()
    await expect(reveal).toHaveAttribute('aria-expanded', 'false')
    await expect(solution.locator('pre')).toHaveCount(0)
    await reveal.focus()
    await page.keyboard.press('Enter')
    await expect(reveal).toHaveAttribute('aria-expanded', 'true')
    const source = solution.getByLabel(vi ? 'Mã Python của lời giải' : 'Python solution code')
    await expect(source).toBeHidden()
    const sourceToggle = solution.locator('.exercise-solution-primary summary')
    await sourceToggle.focus()
    await page.keyboard.press('Enter')
    await expect(source).toBeVisible()
    await expect(source).toContainText('def summarize_scores(scores):')
    await page.keyboard.press('Space')
    await expect(source).toBeHidden()
    await expect(sourceToggle).toBeFocused()
    await expect(solution.getByRole('heading', { name: vi ? 'Vì sao cách này đúng?' : 'Why this works' }))
      .toBeVisible()
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        const command = page.locator('.exercise-setup > pre')
        expect(await command.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
        await page.screenshot({
          path: `.build/exercise-guide-evidence/${language}-${theme}-${width}-detail.png`,
          fullPage: true, animations: 'disabled',
        })
      }
    }
    await reveal.focus()
    await page.keyboard.press('Space')
    await expect(reveal).toHaveAttribute('aria-expanded', 'false')
    await expect(solution.locator('pre')).toHaveCount(0)
    await expect(reveal).toBeFocused()
    await page.getByRole('button', { name: vi ? '← Danh sách bài tập' : '← All exercises' }).click()
    await expect(search).toHaveValue('summarize_scores')
    await expect(page.locator('.exercise-open')).toBeFocused()
    await search.clear()
    await page.getByRole('button', { name: vi ? 'Xem thêm bài tập' : 'Show more exercises' }).click()
    await expect(page.locator('.exercise-card')).toHaveCount(24)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => window.scrollTo(0, 0))
      await checkThemeContrast(page)
      await page.screenshot({
        path: `.build/exercise-guide-evidence/${language}-dark-${width}-list.png`, animations: 'disabled',
      })
    }
    await page.goto('/exercises?exercise=exercise-0-learning-system')
    await expect(page.locator('.exercise-detail')).toContainText('total_study_minutes')
    await page.reload()
    await expect(page.locator('.exercise-detail')).toContainText('total_study_minutes')
    await page.getByRole('button', { name: vi ? '← Danh sách bài tập' : '← All exercises' }).click()
    await page.goBack()
    await expect(page.locator('.exercise-detail')).toContainText('total_study_minutes')
    await page.goto('/exercises?exercise=exercise-3-preprocessing')
    await expect(page.locator('.exercise-steps li')).toHaveCount(4)
    await expect(page.locator('.exercise-detail')).toContainText(vi ? 'chưa có bộ chấm tự động' : 'no automated assessment')
    await expect(page.locator('.exercise-solution')).toContainText(vi ? 'chưa có bài giải mẫu' : 'no worked solution yet')
    await expect(page.locator('.exercise-solution button')).toHaveCount(0)
    await expect(page.locator('.exercise-files')).toHaveCount(0)
    await page.goto('/exercises?exercise=exercise-1-python-core')
    await expect(page.locator('html')).toHaveAttribute('lang', language)
    await expect(page.locator('.exercise-steps')).toContainText('weighted_score')
    await page.locator('.exercise-solution button').click()
    await expect(page.locator('.exercise-solution')).toContainText('study_scores/__init__.py')
    await expect(page.locator('.exercise-solution')).toContainText('python -m unittest -v test_solution.py')
    await expect(page.locator('.exercise-solution')).not.toContainText('test_exercise.py')
    const labDownloadPromise = page.waitForEvent('download')
    await page.locator('.exercise-solution-downloads a').first().click()
    const labDownload = await labDownloadPromise
    expect(labDownload.suggestedFilename()).toBe('__init__.py')
    expect(await readFile((await labDownload.path())!, 'utf8')).toContain('def weighted_score')
    await page.locator('.exercise-solution-file summary').filter({ hasText: /^test_solution\.py$/ }).click()
    await expect(page.getByLabel('test_solution.py', { exact: true })).toBeVisible()
    await expect(page.locator('.exercise-solution-primary pre')).toBeHidden()
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme })
        await checkThemeContrast(page)
        await page.screenshot({
          path: `.build/exercise-guide-evidence/${language}-${theme}-${width}-worked-lab.png`,
          fullPage: true, animations: 'disabled',
        })
      }
    }
    expect(unsafeRequests).toEqual([])
  })

  test(`${language} workflow and SQL solutions are downloadable without running local services`, async ({ page }) => {
    const unsafeRequests: string[] = []
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (url.pathname.startsWith('/api/') || url.port === '8765'
        || !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) unsafeRequests.push(request.url())
    })
    for (const [slug, filename, code] of [
      ['exercise-1-developer-tools', 'fetch_status.py', 'def save_status'],
      ['exercise-1-sql-structures', 'learning_log.py', 'def weekly_join'],
    ]) {
      await page.goto(`/exercises?exercise=${slug}&lang=${language}`)
      const solution = page.locator('.exercise-solution')
      await expect(page.locator('.exercise-steps li')).toHaveCount(5)
      await expect(solution.locator('pre')).toHaveCount(0)
      await solution.getByRole('button').click()
      const source = solution.getByLabel(language === 'vi' ? 'Mã Python của lời giải' : 'Python solution code')
      await expect(source).toBeHidden()
      await solution.locator('.exercise-solution-primary summary').click()
      await expect(source).toBeVisible()
      await expect(source).toContainText(code)
      await expect(solution).toContainText('5 tests, OK')
      await expect(page.locator('.exercise-workspace')).toHaveCount(0)
      const pending = page.waitForEvent('download')
      await solution.getByRole('link', { name: new RegExp(filename) }).click()
      const download = await pending
      expect(download.suggestedFilename()).toBe(filename)
      expect(await readFile((await download.path())!, 'utf8')).toContain(code)
      await page.setViewportSize({ width: 390, height: 900 })
      await checkThemeContrast(page)
    }
    expect(unsafeRequests).toEqual([])
  })

  test(`${language} mathematics guides include dependencies and preserve reading-only behavior`, async ({ page }) => {
    const writes: string[] = []
    page.on('request', (request) => {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())
        || new URL(request.url()).pathname.startsWith('/api/')) writes.push(request.url())
    })
    for (const module of ['linear-algebra', 'calculus', 'probability', 'optimization']) {
      await page.goto(`/exercises?exercise=exercise-2-${module}&lang=${language}`)
      await expect(page.locator('.exercise-steps li')).toHaveCount(5)
      const solution = page.locator('.exercise-solution')
      await solution.getByRole('button').click()
      await expect(solution).toContainText('requirements.txt')
      const pending = page.waitForEvent('download')
      await solution.getByRole('link', { name: /requirements.txt/ }).click()
      const download = await pending
      expect(download.suggestedFilename()).toBe('requirements.txt')
      const requirements = await readFile((await download.path())!, 'utf8')
      expect(requirements).toContain('matplotlib')
      expect(requirements).toContain(module === 'calculus' ? 'torch' : 'numpy')
      await page.setViewportSize({ width: 390, height: 900 })
      await checkThemeContrast(page)
    }
    expect(writes).toEqual([])
  })
}
