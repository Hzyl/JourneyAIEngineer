// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ReviewView } from '../components/ReviewView'

vi.mock('../platform/learning-client', () => ({
  learningClient: {
    reviewHistory: async () => ({ items: [] }),
    weakTopics: async () => ({ items: [] }),
  },
}))

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
  await act(async () => fail(new Error('Offline')))
  expect(host.querySelector('[role="alert"]')!.textContent).toBe('Offline')
  expect(host.querySelector('h3')!.textContent).toBe('Question 1')
  expect(host.querySelector<HTMLButtonElement>('button.good')!.disabled).toBe(false)
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
