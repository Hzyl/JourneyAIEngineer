// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { LessonPage } from '../components/LessonPage'
import { lessonFixture } from './lesson-fixture'

const state = vi.hoisted(() => ({ owner: 'owner-a' }))
vi.mock('../auth/AuthProvider', () => ({ useAuth: () => ({ session: { user: { id: state.owner } } }) }))
vi.mock('../platform/runtime-config', () => ({ runtimeConfig: { mode: 'hosted' } }))
vi.mock('../platform/learning-client', () => ({ learningClient: { createNote: vi.fn() } }))
vi.mock('../components/FeedbackPanel', () => ({ FeedbackPanel: () => null }))
let host: HTMLDivElement
let root: Root
const onExercise = vi.fn()
const onLesson = vi.fn()
const onProgress = vi.fn()
const render = (language: 'vi' | 'en' = 'en', lesson = lessonFixture) => act(async () => {
  root.render(<LessonPage lesson={lesson} lessonLoading={false} language={language} onBack={() => {}}
    onProgress={onProgress} onOpenLesson={onLesson} onOpenExercise={onExercise}
    nextLessonTitles={{ 'earlier-lesson': 'Earlier lesson', 'next-lesson': 'Next topic' }} />)
})
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.resetAllMocks()
  state.owner = 'owner-a'
  window.localStorage.clear()
  window.history.replaceState({}, '', '/lesson/lesson-one')
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  HTMLElement.prototype.scrollIntoView = vi.fn()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

test.each(['vi', 'en'] as const)('Colab practice opens the lesson notebook safely in %s', async (language) => {
  const url = 'https://colab.research.google.com/github/Hzyl/JourneyAIEngineer/blob/main/notebooks/lab-a-evidence-retrieval.ipynb'
  await render(language, { ...lessonFixture, resources: [{ ...lessonFixture.resources[0],
    title: 'Lab A', url }] })
  const callout = host.querySelector('.lesson-colab')!
  expect(callout).not.toBeNull()
  const link = callout.querySelector('a')!
  expect(link.href).toBe(url)
  expect(link.target).toBe('_blank')
  expect(link.rel).toContain('noopener')
  expect(link.rel).toContain('noreferrer')
  expect(link.textContent).toBe(language === 'vi' ? 'Mở Lab A ↗' : 'Open Lab A ↗')
  expect(callout.textContent).toContain(language === 'vi' ? 'không tự lưu' : 'not automatically saved')
  expect(host.querySelector('#resources')!.textContent).toContain(
    language === 'vi' ? 'Mở notebook Colab' : 'Open Colab notebook')
})

test.each(['vi', 'en'] as const)('every code example exposes its run guide in %s', async (language) => {
  const examples = [
    { language: 'python', title: 'First example', code: 'print(1)',
      setup: 'Python 3.11+', expected_output: '1',
      edge_case_vi: 'Kiểm tra đầu vào rỗng.', edge_case_en: 'Check empty input.',
      explanation_vi: 'Ví dụ đầu.', explanation_en: 'First example.' },
    { language: 'python', title: 'Outcome example', code: 'print("pass")',
      setup: 'Paste into a separate Colab cell.', expected_output: '<report>pass</report>',
      edge_case_vi: 'Thiếu báo cáo phải trượt.', edge_case_en: 'A missing report must fail.',
      explanation_vi: 'Ví dụ thứ hai.', explanation_en: 'Second example.' },
  ]
  await render(language, { ...lessonFixture, code_examples: examples })
  const cards = host.querySelectorAll('.code-example')
  expect(cards).toHaveLength(2)
  examples.forEach((example, index) => {
    const guide = cards[index].querySelector('.code-example-guide')!
    expect(guide).not.toBeNull()
    expect([...guide.querySelectorAll('dd')].map(node => node.textContent)).toEqual([
      example.setup, example.expected_output, example[`edge_case_${language}`],
    ])
    expect(guide.querySelector('dt')!.textContent).toBe(language === 'vi' ? 'Chuẩn bị' : 'Setup')
    expect(guide.querySelector('report')).toBeNull()
  })
  expect(onProgress).not.toHaveBeenCalled()
})

test('ordinary resources do not promise a hosted notebook runtime', async () => {
  await render()
  expect(host.querySelector('.lesson-colab')).toBeNull()
  await render('en', { ...lessonFixture, resources: [{ ...lessonFixture.resources[0],
    url: 'https://colab.research.google.com.example.test/lab.ipynb' }] })
  expect(host.querySelector('.lesson-colab')).toBeNull()
})

test('code setup switches language on rerender and escapes localized instructions', async () => {
  const example = {
    language: 'python', title: 'Localized setup', code: 'print(1)',
    setup: 'Legacy setup must not appear.',
    setup_vi: 'Dán vào Colab: <img src=x onerror="alert(1)"> & chạy ô.',
    setup_en: 'Paste into Colab: <script>alert(2)</script> & run the cell.',
    expected_output: '1', explanation_vi: 'Ví dụ.', explanation_en: 'Example.',
  }
  const lesson = { ...lessonFixture, code_examples: [example] }
  for (const language of ['vi', 'en', 'vi'] as const) {
    await render(language, lesson)
    const guide = host.querySelector('.code-example-guide')!
    expect(guide.querySelector('dd')!.textContent).toBe(example[`setup_${language}`])
    expect(guide.querySelector('dt')!.textContent).toBe(language === 'vi' ? 'Chuẩn bị' : 'Setup')
    expect(guide.querySelector('img, script')).toBeNull()
    expect(guide.textContent).not.toContain(example.setup)
    expect(host.querySelector('.code-example code')!.textContent).toBe(example.code)
    expect(guide.querySelectorAll('dd')[1].textContent).toBe(example.expected_output)
  }
  expect(onProgress).not.toHaveBeenCalled()
})

test.each(['vi', 'en'] as const)('code setup uses nonblank language, legacy, then alternate in %s', async (language) => {
  const alternate = language === 'vi' ? 'en' : 'vi'
  const setups = [
    { setup: 'Legacy only.' },
    { [`setup_${language}`]: ' \n\t', setup: 'Legacy before alternate.', [`setup_${alternate}`]: 'Alternate.' },
    { [`setup_${language}`]: ' ', setup: '\t', [`setup_${alternate}`]: 'Alternate without legacy.' },
    { [`setup_${language}`]: 'Localized only.' },
  ]
  const examples = setups.map((setup, index) => ({
    language: 'python', title: `Fallback ${index}`, code: 'print(1)',
    explanation_vi: 'Ví dụ.', explanation_en: 'Example.', ...setup,
  }))
  await render(language, { ...lessonFixture, code_examples: examples })
  expect([...host.querySelectorAll('.code-example-guide dd')].map(node => node.textContent)).toEqual([
    'Legacy only.', 'Legacy before alternate.', 'Alternate without legacy.', 'Localized only.',
  ])
})

test.each(['vi', 'en'] as const)('missing and blank setup omit the setup row in %s', async (language) => {
  const example = { language: 'python', title: 'No setup', code: 'print(1)',
    explanation_vi: 'Ví dụ.', explanation_en: 'Example.' }
  await render(language, { ...lessonFixture, code_examples: [
    example,
    { ...example, title: 'Blank setup', setup: '\t', setup_vi: ' ', setup_en: '\n' },
    { ...example, title: 'Output only', setup_vi: ' ', expected_output: '1' },
  ] })
  const cards = host.querySelectorAll('.code-example')
  expect(cards[0].querySelector('.code-example-guide')).toBeNull()
  expect(cards[1].querySelector('.code-example-guide')).toBeNull()
  const guide = cards[2].querySelector('.code-example-guide')!
  expect(guide.querySelectorAll('dt')).toHaveLength(1)
  expect(guide.querySelector('dt')!.textContent).toBe(language === 'vi' ? 'Kết quả mong đợi' : 'Expected output')
  expect(guide.querySelector('dd')!.textContent).toBe('1')
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test('English lesson controls use localized labels and open the exact exercise and prerequisite', async () => {
  await render()
  expect(host.querySelector('.session-minutes')!.textContent).toBe('Study minutes')
  expect(host.querySelector('.resource-link b')!.textContent).toContain('Open resource')
  expect(host.querySelector('.ask-box p')!.textContent).toContain('Open Journal')
  await act(async () => host.querySelector<HTMLButtonElement>('.linked-exercise button')!.click())
  expect(onExercise).toHaveBeenCalledExactlyOnceWith('exercise-0-environment')
  await act(async () => host.querySelector<HTMLButtonElement>('.lesson-check-block button')!.click())
  expect(onLesson).toHaveBeenCalledExactlyOnceWith('earlier-lesson')
  expect(onProgress).not.toHaveBeenCalled()
})

test('anchor navigation moves keyboard focus and direct fragment URLs restore the reading position', async () => {
  window.history.replaceState({}, '', '/lesson/lesson-one#notes')
  await render()
  expect(document.activeElement).toBe(host.querySelector('#notes'))
  await act(async () => host.querySelector<HTMLAnchorElement>('a[href="#concept"]')!.click())
  expect(document.activeElement).toBe(host.querySelector('#concept'))
  expect(window.location.hash).toBe('#concept')
  expect(HTMLElement.prototype.scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' })
})

test('changing language preserves checklist ticks while changing accounts clears them', async () => {
  await render()
  await act(async () => host.querySelector<HTMLInputElement>('.checklist input')!.click())
  expect(JSON.parse(localStorage.getItem('journey-checklist:user:owner-a:lesson-one')!)).toEqual([true, false])
  await render('vi')
  expect(host.querySelector<HTMLInputElement>('.checklist input')!.checked).toBe(true)
  expect(host.querySelector('.checklist label')!.textContent).toBe('Chạy Python')
  state.owner = 'owner-b'
  await render('vi')
  expect(host.querySelector<HTMLInputElement>('.checklist input')!.checked).toBe(false)
  expect(JSON.parse(localStorage.getItem('journey-checklist:user:owner-a:lesson-one')!)).toEqual([true, false])
})

test('checklist reminders focus the check section and opening answers never completes a lesson', async () => {
  await render()
  await act(async () => host.querySelector<HTMLButtonElement>('.detail-actions button')!.click())
  expect(document.activeElement).toBe(host.querySelector('#check'))
  expect(host.textContent).toContain('Finish every checklist item')
  await act(async () => host.querySelector<HTMLButtonElement>('.study-step-toggle')!.click())
  expect(host.querySelector('.study-step-answer')).toBeNull()
  expect(onProgress).not.toHaveBeenCalled()
})

test.each(['vi', 'en'] as const)('%s keeps the main concept and recall questions in one place', async (language) => {
  await render(language)
  const concept = host.querySelector('#concept')!
  expect(concept.querySelectorAll('.concept-notes')).toHaveLength(1)
  await act(async () => host.querySelector<HTMLButtonElement>('.study-step-toggle')!.click())
  expect(host.querySelector('.study-step-detail .concept-notes')).toBeNull()
  expect(host.querySelector('.study-step-detail')!.textContent).not.toContain(lessonFixture.concept_notes_en)
  await act(async () => host.querySelectorAll<HTMLButtonElement>('.study-step-toggle')[4].click())
  const recall = host.querySelectorAll('.study-step-detail')[4]
  expect(recall.textContent).toContain(language === 'vi' ? 'Câu hỏi tự kiểm tra' : 'self-check questions')
  expect(recall.querySelector('a[href="#self-check-questions"]')).not.toBeNull()
  expect(recall.textContent).not.toContain(language === 'vi' ? lessonFixture.reviews[0].question_vi : lessonFixture.reviews[0].question_en)
})

test.each(['vi', 'en'] as const)('%s keeps practice steps as pointers instead of copied sections', async (language) => {
  await render(language)
  const toggles = host.querySelectorAll<HTMLButtonElement>('.study-step-toggle')
  await act(async () => toggles[1].click())
  const reading = host.querySelectorAll('.study-step-detail')[1]
  expect(reading.querySelector('.lesson-resource, .resource-link')).toBeNull()
  expect(reading.querySelector('a[href="#resources"]')).not.toBeNull()
  expect(reading.textContent).not.toContain('Python docs')
  expect(reading.textContent).not.toContain(language === 'vi' ? 'Chạy không lỗi' : 'Run without errors')

  await act(async () => toggles[2].click())
  const coding = host.querySelectorAll('.study-step-detail')[2]
  expect(coding.querySelector('pre, .code-example-guide, .linked-exercise')).toBeNull()
  expect(coding.querySelector('a[href="#lesson-code-title"]')).not.toBeNull()
  expect(coding.querySelector('a[href="#lesson-exercise-title"]')).not.toBeNull()
  expect(coding.textContent).not.toContain('import sys')
  expect(coding.textContent).not.toContain(language === 'vi' ? 'Kiểm tra Python đang chạy' : 'Inspect the Python environment')
})

test.each(['vi', 'en'] as const)('%s concept notes render separate paragraphs and escape markup', async (language) => {
  const paragraphs = [
    language === 'vi' ? 'Đoạn đầu giải thích khái niệm.' : 'The first paragraph explains the concept.',
    '<img src=x onerror="alert(1)"> & <script>alert(2)</script>',
    language === 'vi' ? 'Đoạn cuối nêu cách tự kiểm tra.' : 'The last paragraph explains the self-check.',
  ]
  const concept = `\n${paragraphs[0]}\n\n${paragraphs[1]}\n${paragraphs[2]}\n`
  await render(language, { ...lessonFixture,
    concept_notes_vi: language === 'vi' ? concept : 'Không hiển thị câu này.',
    concept_notes_en: language === 'en' ? concept : 'This sentence must not be shown.',
  })
  const container = host.querySelector('.concept-notes')!
  expect([...container.querySelectorAll(':scope > p')].map((node) => node.textContent)).toEqual(paragraphs)
  expect(container.children).toHaveLength(3)
  expect(container.querySelector('img, script')).toBeNull()
  expect(container.innerHTML).toContain('&lt;img')
  expect(container.innerHTML).toContain('&lt;script&gt;')
  expect(onProgress).not.toHaveBeenCalled()
})
