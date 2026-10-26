import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

type Language = 'vi' | 'en'
type LessonSummary = {
  slug: string
  title_vi: string
  title_en: string
  status: string
}
type Roadmap = {
  phases: Array<{ slug: string; modules: Array<{ lessons: LessonSummary[] }> }>
}

async function setLanguage(page: Page, language: Language) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/api/settings', async (route) => {
    const response = await route.fetch()
    await route.fulfill({ json: { ...await response.json(), language, show_completed_lessons: true } })
  })
}

async function readRoadmap(request: APIRequestContext): Promise<Roadmap> {
  const response = await request.get('/api/roadmap')
  expect(response.ok()).toBeTruthy()
  return response.json()
}

function phaseLessons(roadmap: Roadmap, phaseSlug: string): LessonSummary[] {
  const phase = roadmap.phases.find((item) => item.slug === phaseSlug)
  if (!phase) throw new Error(`Roadmap fixture is missing ${phaseSlug}`)
  const lessons = phase.modules.flatMap((module) => module.lessons)
  expect(lessons.length, `${phaseSlug} must contain lessons`).toBeGreaterThan(0)
  return lessons
}

function lessonUrl(slug: string, routeId?: string) {
  return `/lesson/${slug}${routeId ? `?route=${routeId}` : ''}`
}

async function expectNextLessons(page: Page, expectedLessons: LessonSummary[], language: Language) {
  const nextLessons = page.locator('.next-lesson-list button')
  await expect(nextLessons.first()).toHaveText(`${expectedLessons[0][`title_${language}`]} →`)
  const shown = await nextLessons.count()
  expect(shown).toBeLessThanOrEqual(expectedLessons.length)
  await expect(nextLessons).toHaveText(expectedLessons.slice(0, shown)
    .map((lesson) => `${lesson[`title_${language}`]} →`))
}

test('application lessons preserve route context, history and roadmap filters across the RAG boundary',
  async ({ page, request }) => {
    await setLanguage(page, 'vi')
    const roadmap = await readRoadmap(request)
    const source = phaseLessons(roadmap, 'phase-12-genai-rag').at(-1)!
    const evaluation = phaseLessons(roadmap, 'phase-17-genai-evaluation')
    await page.goto('/roadmap')
    await page.getByRole('button', { name: /Làm ứng dụng AI/ }).click()
    await expect(page).toHaveURL('/roadmap?route=application')
    await page.getByRole('combobox', { name: 'Lọc theo chặng' }).selectOption('phase-12-genai-rag')
    await page.getByRole('combobox', { name: 'Lọc theo trạng thái' }).selectOption(source.status)
    await page.locator('[data-track-filter="core"]').click()
    await page.getByRole('searchbox', { name: 'Tìm bài học hoặc học phần' }).fill(source.title_vi)
    await expect(page.locator('.lesson-row')).toHaveCount(1)
    const roadmapUrl = page.url()
    await page.locator('.lesson-row').click()
    await expect(page).toHaveURL(lessonUrl(source.slug, 'application'))
    await expectNextLessons(page, evaluation, 'vi')

    await page.reload()
    await expect(page).toHaveURL(lessonUrl(source.slug, 'application'))
    await expect(page.locator('#lesson-page-title')).toHaveText(source.title_vi)
    await expectNextLessons(page, evaluation, 'vi')
    await expect(page.locator('.next-lesson-primary')).toHaveText(`Học bài tiếp theo: ${evaluation[0].title_vi} →`)
    await page.locator('.next-lesson-primary').click()
    await expect(page).toHaveURL(lessonUrl(evaluation[0].slug, 'application'))
    await expect(page.locator('#lesson-page-title')).toHaveText(evaluation[0].title_vi)
    await page.goBack()
    await expect(page).toHaveURL(lessonUrl(source.slug, 'application'))
    await expect(page.locator('#lesson-page-title')).toHaveText(source.title_vi)
    await page.getByRole('button', { name: 'Quay lại', exact: true }).click()
    await expect(page).toHaveURL(roadmapUrl)
    await expect(page.getByRole('searchbox', { name: 'Tìm bài học hoặc học phần' })).toHaveValue(source.title_vi)
    await expect(page.getByRole('combobox', { name: 'Lọc theo chặng' })).toHaveValue('phase-12-genai-rag')
    await expect(page.getByRole('combobox', { name: 'Lọc theo trạng thái' })).toHaveValue(source.status)
    await expect(page.locator('[data-track-filter="core"]')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: /Làm ứng dụng AI/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.lesson-row')).toHaveCount(1)
  })

test('route boundaries follow each path while ordinary links retain authored next lessons',
  async ({ page, request }) => {
    await setLanguage(page, 'en')
    const roadmap = await readRoadmap(request)
    const boundaries = [
      { routeId: 'application', source: 'phase-19-genai-production', target: 'phase-07-capstone-career' },
      { routeId: 'foundation', source: 'phase-03-classical-ml', target: 'phase-07-capstone-career' },
      { routeId: 'deep-ml', source: 'phase-03-classical-ml', target: 'phase-04-deep-learning' },
    ]
    for (const boundary of boundaries) {
      await test.step(`${boundary.routeId}: ${boundary.source} reaches ${boundary.target}`, async () => {
        const source = phaseLessons(roadmap, boundary.source).at(-1)!
        const target = phaseLessons(roadmap, boundary.target)
        await page.goto(lessonUrl(source.slug, boundary.routeId))
        await expectNextLessons(page, target, 'en')
        await page.locator('.next-lesson-list button').first().click()
        await expect(page).toHaveURL(lessonUrl(target[0].slug, boundary.routeId))
        await expect(page.locator('#lesson-page-title')).toHaveText(target[0].title_en)
      })
    }

    await test.step('no route keeps the authored next lessons', async () => {
      const source = phaseLessons(roadmap, 'phase-03-classical-ml').at(-1)!
      const response = await request.get(`/api/lessons/${source.slug}`)
      expect(response.ok()).toBeTruthy()
      const authored: { next_lessons: string[] } = await response.json()
      expect(authored.next_lessons.length).toBeGreaterThan(0)
      const lessons = roadmap.phases.flatMap((phase) => phase.modules.flatMap((module) => module.lessons))
      const titles = new Map(lessons.map((lesson) => [lesson.slug, lesson.title_en]))
      await page.goto(lessonUrl(source.slug))
      const nextLessons = page.locator('.next-lesson-list button')
      await expect(nextLessons).toHaveText(authored.next_lessons.map((slug) => `${titles.get(slug) ?? slug} →`))
      await nextLessons.first().click()
      await expect(page).toHaveURL(lessonUrl(authored.next_lessons[0]))
      await expect(page.locator('#lesson-page-title')).toHaveText(titles.get(authored.next_lessons[0])!)
    })
  })

for (const language of ['vi', 'en'] as const) {
  test(`${language} application route ends at career-4 and returns to its roadmap`, async ({ page, request }) => {
    await setLanguage(page, language)
    const roadmap = await readRoadmap(request)
    const finalLesson = phaseLessons(roadmap, 'phase-07-capstone-career').at(-1)!
    expect(finalLesson.slug).toBe('phase-07-capstone-career-career-4')
    await page.goto(lessonUrl(finalLesson.slug, 'application'))
    await expect(page.locator('#lesson-page-title')).toHaveText(finalLesson[`title_${language}`])
    const completion = page.locator('section[aria-labelledby="lesson-next-title"]')
    await expect(completion.getByRole('heading', {
      name: language === 'vi' ? 'Bài tiếp theo' : 'Next lessons', exact: true,
    })).toBeVisible()
    await expect(page.locator('.next-lesson-list button')).toHaveCount(0)
    await expect(completion).toContainText(language === 'vi' ? /cuối|kết thúc|hoàn tất/i : /last core lesson/i)
    const reviewRoadmap = completion.getByRole('button', {
      name: language === 'vi' ? 'Xem lại lộ trình' : 'Review the roadmap', exact: true,
    })
    await expect(reviewRoadmap).toBeVisible()
    await page.reload()
    await expect(page).toHaveURL(lessonUrl(finalLesson.slug, 'application'))
    await expect(page.locator('.next-lesson-list button')).toHaveCount(0)
    await reviewRoadmap.click()
    await expect(page).toHaveURL('/roadmap?route=application')
    await expect(page.getByRole('button', {
      name: language === 'vi' ? /Làm ứng dụng AI/ : /Build AI applications/,
    })).toHaveAttribute('aria-pressed', 'true')
  })
}
