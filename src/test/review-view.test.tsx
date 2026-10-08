// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ReviewView } from '../components/ReviewView'

const api = vi.hoisted(() => ({ reviewHistory: vi.fn(), weakTopics: vi.fn() }))
vi.mock('../platform/learning-client', () => ({ learningClient: api }))

let host: HTMLDivElement
let root: Root
const cards = [1, 2, 3].map((id) => ({
  id,
  question_vi: `Câu ${id}`,
  question_en: `Question ${id}`,
  answer_vi: 'Đáp án',
  answer_en: 'Answer',
  phase_title_vi: 'Nền tảng',
  phase_title_en: 'Foundation',
  queue_status: 'new' as const,
}))

beforeEach(() => {
  vi.resetAllMocks()
  api.reviewHistory.mockResolvedValue({ items: [] })
  api.weakTopics.mockResolvedValue({ items: [] })
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

test('refresh removes the answered card without skipping the next card', async () => {
  const render = (reviews: typeof cards) => root.render(
    <ReviewView reviews={reviews} language="en" onAnswer={answer} onOpenLesson={() => {}} />,
  )
  const answer = vi.fn(async () => { render(cards.slice(1)) })
  await act(async () => render(cards))
  expect(host.textContent).toContain('3 new cards')
  await act(async () => host.querySelector<HTMLButtonElement>('button.good')!.click())
  expect(answer).toHaveBeenCalledWith(1, 'good', 0, '')
  expect(host.querySelector('h3')!.textContent).toBe('Question 2')
  expect(host.querySelector('details')!.open).toBe(false)
})

test('pending writes disable duplicate submissions and a failed save retains the card', async () => {
  let fail: (reason: Error) => void = () => {}
  const answer = vi.fn(() => new Promise<void>((_resolve, reject) => { fail = reject }))
  await act(async () => root.render(
    <ReviewView reviews={cards} language="en" onAnswer={answer} onOpenLesson={() => {}} />,
  ))
  await act(async () => {
    host.querySelector<HTMLButtonElement>('button.good')!.click()
    host.querySelector<HTMLButtonElement>('button.easy')!.click()
  })
  expect(answer).toHaveBeenCalledTimes(1)
  expect(host.querySelector<HTMLButtonElement>('button.good')!.disabled).toBe(true)
  expect(host.querySelector('button.good')!.getAttribute('aria-busy')).toBe('true')
  expect(host.querySelector('button.easy')!.getAttribute('aria-busy')).toBe('false')
  await act(async () => fail(new Error('Offline')))
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Offline')
  expect(host.querySelector('h3')!.textContent).toBe('Question 1')
  expect(host.querySelector<HTMLButtonElement>('button.good')!.disabled).toBe(false)
  expect(host.querySelector('button.good')!.getAttribute('aria-busy')).toBe('false')
})

test('retry keeps the original elapsed time so the server recognizes the same review', async () => {
  const answer = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(undefined)
  await act(async () => root.render(
    <ReviewView reviews={cards} language="en" onAnswer={answer} onOpenLesson={() => {}} />,
  ))
  const focus = new FocusEvent('focusin', { bubbles: true })
  Object.defineProperty(focus, 'timeStamp', { value: 1000 })
  await act(async () => host.querySelector('textarea')!.dispatchEvent(focus))
  const click = (time: number) => {
    const event = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(event, 'timeStamp', { value: time })
    host.querySelector('button.good')!.dispatchEvent(event)
  }
  await act(async () => click(11000))
  await act(async () => click(61000))
  expect(answer.mock.calls[0]).toEqual([1, 'good', 10, ''])
  expect(answer.mock.calls[1]).toEqual(answer.mock.calls[0])
})

test('queue replacement cannot carry an answer or open disclosure into another card', async () => {
  const answer = vi.fn().mockResolvedValue(undefined)
  const render = (reviews: typeof cards) => root.render(
    <ReviewView reviews={reviews} language="en" onAnswer={answer} onOpenLesson={() => {}} />,
  )
  await act(async () => render(cards))
  await act(async () => {
    const input = host.querySelector('textarea')!
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, 'First answer')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    host.querySelector('details')!.open = true
  })
  await act(async () => render(cards.slice(1)))
  expect(host.querySelector('textarea')!.value).toBe('')
  expect(host.querySelector('details')!.open).toBe(false)
  expect(document.activeElement).toBe(host.querySelector('.review-card h3'))
  await act(async () => host.querySelector<HTMLButtonElement>('button.good')!.click())
  expect(answer).toHaveBeenCalledWith(2, 'good', 0, '')
})

test('activity errors are retryable without blocking recall or discarding successful history', async () => {
  api.reviewHistory.mockResolvedValue({ items: [{
    id: 8, rating: 'hard', lesson_title_vi: 'Hàm', lesson_title_en: 'Functions',
  }] })
  api.weakTopics.mockRejectedValueOnce(new Error('Offline'))
  await act(async () => root.render(
    <ReviewView reviews={cards} language="en" onAnswer={vi.fn()} onOpenLesson={() => {}} />,
  ))
  expect(host.querySelector('.review-history')!.textContent).toContain('Functions')
  expect(host.querySelector<HTMLButtonElement>('button.good')!.disabled).toBe(false)
  const retry = [...host.querySelectorAll('button')].find((button) => button.textContent?.includes('Retry activity'))!
  expect(retry).toBeDefined()
  await act(async () => retry.click())
  expect(host.querySelector('[role="alert"]')).toBeNull()
  expect(api.weakTopics).toHaveBeenCalledTimes(2)
})

test('finishing the last card focuses a localized empty session', async () => {
  await act(async () => root.render(
    <ReviewView reviews={cards.slice(0, 1)} language="vi" onAnswer={vi.fn()}
      onOpenLesson={() => {}} />,
  ))
  await act(async () => host.querySelector<HTMLButtonElement>('button.good')!.click())
  expect(document.activeElement?.textContent).toBe('Đã hết thẻ trong lượt này')
  expect(host.querySelector('.review-card')).toBeNull()
})

test('language changes preserve the current draft and disclosure with hosted string card IDs', async () => {
  const answer = vi.fn().mockResolvedValue(undefined)
  const reviews = [{ ...cards[0], id: 'lesson-one:recall-1' }]
  const render = (language: 'vi' | 'en') => root.render(
    <ReviewView reviews={reviews} language={language} onAnswer={answer} onOpenLesson={() => {}} />,
  )
  await act(async () => render('vi'))
  await act(async () => {
    const input = host.querySelector('textarea')!
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, 'My answer')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    host.querySelector('details')!.open = true
  })
  await act(async () => render('en'))
  expect(host.querySelector('textarea')!.value).toBe('My answer')
  expect(host.querySelector('details')!.open).toBe(true)
  expect(host.querySelector('details p')!.textContent).toBe('Answer')
  expect(api.reviewHistory).toHaveBeenCalledTimes(1)
  expect(answer).not.toHaveBeenCalled()
  await act(async () => host.querySelector<HTMLButtonElement>('button.good')!.click())
  expect(answer).toHaveBeenCalledWith('lesson-one:recall-1', 'good', 0, 'My answer')
})

test('late activity responses cannot overwrite a newer queue refresh', async () => {
  let resolve!: (value: { items: object[] }) => void
  api.reviewHistory.mockReturnValueOnce(new Promise((done) => { resolve = done }))
  api.reviewHistory.mockResolvedValue({ items: [{
    id: 12, rating: 'good', lesson_title_vi: 'Mới', lesson_title_en: 'Current activity',
  }] })
  const render = (reviews: typeof cards) => root.render(
    <ReviewView reviews={reviews} language="en" onAnswer={vi.fn()} onOpenLesson={() => {}} />,
  )
  await act(async () => render(cards))
  await act(async () => render(cards.slice(1)))
  expect(host.querySelector('.review-history')!.textContent).toContain('Current activity')
  await act(async () => resolve({ items: [{
    id: 11, rating: 'hard', lesson_title_vi: 'Cũ', lesson_title_en: 'Stale activity',
  }] }))
  expect(host.querySelector('.review-history')!.textContent).toContain('Current activity')
  expect(host.textContent).not.toContain('Stale activity')
})

test('a parent queue refresh does not show the next card as saving the previous answer', async () => {
  let finish!: () => void
  const answer = vi.fn(() => new Promise<void>((resolve) => { finish = resolve }))
  const render = (reviews: typeof cards) => root.render(
    <ReviewView reviews={reviews} language="en" onAnswer={answer} onOpenLesson={() => {}} />,
  )
  await act(async () => render(cards))
  await act(async () => host.querySelector<HTMLButtonElement>('button.good')!.click())
  await act(async () => render(cards.slice(1)))
  expect(host.querySelector('.review-card h3')!.textContent).toBe('Question 1')
  expect(host.querySelector('button.good')!.getAttribute('aria-busy')).toBe('true')
  await act(async () => finish())
  expect(host.querySelector('.review-card h3')!.textContent).toBe('Question 2')
  expect(host.querySelector('button.good')!.getAttribute('aria-busy')).toBe('false')
})
