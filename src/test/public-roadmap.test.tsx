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
  expect(host.querySelectorAll('[data-public-track-filter]')).toHaveLength(3)
  expect(host.querySelector('.roadmap-image-card img')?.getAttribute('src')).toBe('/images/roadmap/ai-engineer-roadmap.jpg')
  expect(host.querySelectorAll('.roadmap-stage-card')).toHaveLength(11)
  await act(async () => host.querySelector<HTMLButtonElement>('[data-public-track-filter="specialization"]')!.click())
  expect(host.querySelectorAll('.roadmap-stage-card')).toHaveLength(1)
  expect(window.location.search).toContain('track=specialization')
})
