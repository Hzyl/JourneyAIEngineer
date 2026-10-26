import { expect, test, type Page } from '@playwright/test'
import { readFile, stat } from 'node:fs/promises'
import catalog from '../../content/lessons.json' with { type: 'json' }
import { mockAuthenticatedLearner, type Language } from './hosted-learner'

type Manifest = Record<string, { file: string }>
type LessonFixture = (typeof catalog.lessons)[number]
const output = '.build/hosted-production'

// The dev hosted config also discovers this filename; chunk budgets need production.
test.beforeEach(async ({ baseURL }) => {
  test.skip(new URL(baseURL ?? 'http://localhost').port !== '4175', 'Production manifest and chunks only')
})

async function productionManifest() {
  return JSON.parse(await readFile(`${output}/.vite/manifest.json`, 'utf8')) as Manifest
}

function phaseFiles(manifest: Manifest) {
  return Object.entries(manifest).filter(([key]) => key.includes('journey-lesson-phase'))
}

for (const language of ['vi', 'en'] as const) {
  test(`${language} review queue hydrates completed lesson cards and preserves rating behavior`, async ({ page, baseURL }) => {
    const manifest = await productionManifest()
    const { scripts, errors } = observe(page)
    const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL!).origin, language)
    const lesson = await fixture('phase-00-onboarding-environment-1')
    const cards = lesson.review_cards
    const writes: Array<{ p_operation: string; p_payload: Record<string, unknown> }> = []
    await page.route('https://example.supabase.co/rest/v1/lesson_progress?**', (route) => {
      if (route.request().method() !== 'GET') return route.fallback()
      return route.fulfill({ json: [{ lesson_slug: lesson.lesson_id, status: 'completed',
        minutes_spent: 25, completed_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }] })
    })
    await page.route('https://example.supabase.co/rest/v1/review_state?**', (route) => {
      if (route.request().method() !== 'GET') return route.fallback()
      return route.fulfill({ json: [{ card_id: cards[0].id, lesson_slug: lesson.lesson_id,
        due_at: '2026-01-01T00:00:00Z', last_reviewed_at: '2025-12-30T00:00:00Z',
        interval_days: 2, repetitions: 1, ease_factor: 2.5, lapses: 0, leech: false, suspended: false }] })
    })
    await page.route('https://example.supabase.co/rest/v1/rpc/apply_learning_mutation', (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      writes.push(route.request().postDataJSON())
      return route.fulfill({ json: { ok: true } })
    })
    await page.goto('/review')
    await expect(page.locator('.review-header [role="status"]')).toHaveText(language === 'vi'
      ? '1 đến hạn · 3 thẻ mới' : '1 due · 3 new cards')
    for (const [index, card] of cards.entries()) {
      await expect(page.locator('.review-card h3')).toHaveText(card[`question_${language}`])
      await page.locator('.review-card summary').click()
      await expect(page.locator('.review-card details > p')).toHaveText(card[`answer_${language}`])
      expect(writes).toHaveLength(index)
      await page.getByRole('textbox', { name: language === 'vi' ? 'Câu trả lời của bạn' : 'Your review answer' })
        .fill(`Synthetic answer ${index + 1}`)
      await page.getByRole('button', { name: language === 'vi' ? 'Nhớ được' : 'Good', exact: true }).click()
      await expect.poll(() => writes.length).toBe(index + 1)
      expect(writes[index]).toMatchObject({ p_operation: 'review', p_payload: {
        card_id: card.id, lesson_slug: lesson.lesson_id, rating: 'good', answer_text: `Synthetic answer ${index + 1}`,
      } })
    }
    await expect(page.locator('.review-empty')).toBeVisible()
    await expect(page.locator('.review-header [role="status"]')).toHaveText(language === 'vi'
      ? '0 đến hạn · 0 thẻ mới' : '0 due · 0 new cards')
    expect(requestedPhases(manifest, scripts)).toHaveLength(1)
    expect(requestedPhases(manifest, scripts)[0]).toContain(lesson.phase_id)
    expect(unexpected).toEqual([])
    expect(errors).toEqual([])
  })
}

test('an aborted phase body shows a recoverable lesson error and reload preserves its deep link', async ({ page, baseURL }) => {
  const manifest = await productionManifest()
  test.skip(phaseFiles(manifest).length === 0, 'Pre-change baseline has no phase chunks; initial budget test still fails')
  const lesson = await fixture('phase-00-onboarding-environment-1')
  const entry = phaseFiles(manifest).find(([key]) => key.includes(lesson.phase_id))
  expect(entry, 'Requested phase must be present in manifest').toBeTruthy()
  const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL!).origin, 'en')
  const chunk = `**/${entry![1].file}`
  let aborted = 0
  await page.route(chunk, (route) => {
    aborted += 1
    return route.abort('failed')
  })
  const path = `/lesson/${lesson.lesson_id}?route=foundation`
  await page.goto(path)
  await expect(page.locator('.lesson-page .empty-state')).toContainText('Lesson unavailable')
  await expect(page.locator('.error-banner')).toContainText('Could not load this lesson.')
  expect(aborted).toBeGreaterThan(0)
  await expect(page).toHaveURL(path)
  await page.unroute(chunk)
  // Vite handles a failed cached import through a full document reload.
  await page.reload()
  await expectBody(page, lesson, 'en')
  await expect(page.locator('.error-banner')).toHaveCount(0)
  await expect(page).toHaveURL(path)
  expect(unexpected).toEqual([])
})

function requestedPhases(manifest: Manifest, scripts: Set<string>) {
  return phaseFiles(manifest).filter(([, value]) => scripts.has(value.file)).map(([key]) => key).sort()
}

function observe(page: Page) {
  const scripts = new Set<string>()
  const errors: string[] = []
  // Capture all JS requests, including modulepreload, and deduplicate by output path.
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname.slice(1)
    if (path.endsWith('.js')) scripts.add(path)
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return { scripts, errors }
}

async function fixture(slug: string): Promise<LessonFixture> {
  try {
    return JSON.parse(await readFile(`content/curated/${slug}.json`, 'utf8')) as LessonFixture
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    const lesson = catalog.lessons.find((item) => item.lesson_id === slug)
    if (!lesson) throw new Error(`Missing catalog fixture ${slug}`)
    return lesson
  }
}

async function expectBody(page: Page, lesson: LessonFixture, language: Language) {
  await expect(page.locator('#lesson-page-title')).toHaveText(lesson[`title_${language}`])
  const paragraphs = lesson[`concept_notes_${language}`].split(/\n+/).filter(Boolean)
  await expect(page.locator('.concept-notes > p')).toHaveText(paragraphs)
  const card = lesson.review_cards[0]
  const prompt = page.locator('.review-prompt').filter({ hasText: card[`question_${language}`] })
  await expect(prompt.locator('details > p')).toHaveText(card[`answer_${language}`])
}

test('initial authenticated Today, roadmap and search stay under the raw JS budget without phase bodies',
  async ({ page, baseURL }, testInfo) => {
    const manifest = await productionManifest()
    const { scripts, errors } = observe(page)
    const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL!).origin, 'en')
    await page.goto('/')
    await expect(page.locator('.today-view')).toBeVisible()
    await page.waitForLoadState('networkidle')
    const files = [...scripts].sort()
    const sizes = await Promise.all(files.map(async (file) => ({ file, bytes: (await stat(`${output}/${file}`)).size })))
    const rawJsBytes = sizes.reduce((total, item) => total + item.bytes, 0)
    // Attach before every budget/splitting assertion, so the pre-change run records its baseline.
    await testInfo.attach('authenticated-initial-raw-js', {
      body: JSON.stringify({ capturedAt: new Date().toISOString(), rawJsBytes, files: sizes,
        phaseChunkCount: phaseFiles(manifest).length, requestedPhases: requestedPhases(manifest, scripts),
        metric: 'Uncompressed production JS file bytes requested by browser; not bandwidth, latency or Core Web Vitals',
      }, null, 2),
      contentType: 'application/json',
    })
    await page.getByRole('button', { name: 'View the full roadmap →', exact: true }).click()
    await expect(page.locator('.lesson-row').first()).toBeVisible()
    const lesson = await fixture('phase-03-classical-ml-models-1')
    await page.getByRole('searchbox', { name: 'Search lessons or modules', exact: true }).fill(lesson.title_en)
    await expect(page.locator('.lesson-row')).toHaveCount(1)
    await page.locator('.global-search input').fill(lesson.lesson_id)
    await expect(page.getByRole('option')).toContainText([lesson.title_en])
    await page.waitForLoadState('networkidle')
    const knownFiles = new Set(Object.values(manifest).map((entry) => entry.file))
    expect(files.filter((file) => !knownFiles.has(file)), 'Every measured script belongs to this production manifest').toEqual([])
    expect(unexpected).toEqual([])
    expect(errors).toEqual([])
    expect(rawJsBytes, 'Initial authenticated raw JS bytes (baseline attached before assertion)').toBeLessThan(1_500_000)
    expect(phaseFiles(manifest).length, 'All phase body chunks must exist').toBeGreaterThanOrEqual(23)
    expect(requestedPhases(manifest, scripts), 'Today, roadmap and search must use metadata only').toEqual([])
  })

for (const language of ['vi', 'en'] as const) {
  test(`${language} deep links and in-app navigation load curated and canonical bodies by phase`, async ({ page, baseURL }) => {
    const manifest = await productionManifest()
    const { scripts, errors } = observe(page)
    const unexpected = await mockAuthenticatedLearner(page, new URL(baseURL!).origin, language)
    const curated = await fixture('phase-00-onboarding-environment-1')
    await page.goto(`/lesson/${curated.lesson_id}`)
    await expectBody(page, curated, language)
    await expect(page.locator('.lesson-detail > .tag')).toHaveText(language === 'vi' ? 'Nội dung đã rà soát' : 'Reviewed content')
    const samePhase = await fixture(curated.next_lessons[0])
    await page.locator('.next-lesson-list button').filter({ hasText: samePhase[`title_${language}`] }).click()
    await expectBody(page, samePhase, language)
    expect(requestedPhases(manifest, scripts)).toHaveLength(1)
    const canonical = await fixture('phase-00-onboarding-learning-system-3')
    await page.goto(`/lesson/${canonical.lesson_id}`)
    await expectBody(page, canonical, language)
    const crossPhase = await fixture(canonical.next_lessons[1])
    expect(crossPhase.phase_id).not.toBe(canonical.phase_id)
    await page.locator('.next-lesson-list button').filter({ hasText: crossPhase[`title_${language}`] }).click()
    await expect(page).toHaveURL(`/lesson/${crossPhase.lesson_id}`)
    await expectBody(page, crossPhase, language)
    expect(requestedPhases(manifest, scripts)).toHaveLength(2)
    expect(requestedPhases(manifest, scripts).some((key) => key.includes(crossPhase.phase_id))).toBe(true)
    expect(unexpected).toEqual([])
    expect(errors).toEqual([])
  })
}
