// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { PublicRoadmap } from '../public/PublicRoadmap'

let host: HTMLDivElement
let root: Root

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  window.history.replaceState({}, '', '/roadmap?route=foundation')
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => { await act(async () => root.unmount()); host.remove() })

test('public roadmap exposes source metadata and a core or specialization filter', async () => {
  await act(async () => root.render(<PublicRoadmap language="en" standalone onStart={() => undefined} />))
  expect(host.textContent).toContain('Core')
  expect(host.textContent).toContain('Prerequisites')
  expect(host.textContent).toContain('Exit criteria')
  expect(host.textContent).toContain('Evidence required')
  expect(host.textContent).toContain('Estimated workload')
  expect(host.textContent).toContain('Bridge modules')
  expect(host.textContent).toContain('Main sequence:')
  expect(host.querySelectorAll('[data-public-track-filter]')).toHaveLength(3)
  expect(host.querySelector('.roadmap-image-card img')?.getAttribute('src')).toBe('/images/roadmap/ai-engineer-roadmap.jpg')
  expect(host.querySelectorAll('.roadmap-stage-card')).toHaveLength(12)
  const topics = Array.from(host.querySelectorAll('.roadmap-stage-card')).map((card) => card.getAttribute('data-topic'))
  expect(topics.indexOf('production')).toBeLessThan(topics.indexOf('agents'))
  expect(host.querySelector('[data-topic="rag"]')?.textContent).toContain('earlier survey lessons')
  expect(host.querySelector('[data-topic="llm"]')?.textContent).not.toContain('NLP and LLM survey')
  await act(async () => host.querySelector<HTMLButtonElement>('[data-public-track-filter="specialization"]')!.click())
  expect(host.querySelectorAll('.roadmap-stage-card')).toHaveLength(2)
  expect(window.location.search).toContain('track=specialization')
  await act(async () => {
    window.history.replaceState({}, '', '/roadmap?route=application&track=core')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(host.querySelectorAll('.roadmap-stage-card')).toHaveLength(10)
  expect(host.querySelector('.route-choices [aria-pressed="true"]')?.textContent).toBe('Build AI applications')
})
