// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { ToolsView } from '../components/ToolsView'
import toolPayload from '../../content/tools.json'
import type { ToolTextField } from '../api'

let host: HTMLDivElement
let root: Root
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

test('the real toolkit renders every English field and translates non-command instructions', async () => {
  await act(async () => root.render(<ToolsView tools={toolPayload} language="en" />))
  expect(host.querySelectorAll('.tool-card')).toHaveLength(8)
  expect(host.textContent).toContain('Use the right tool')
  const fields: ToolTextField[] = ['when', 'how', 'when_not', 'install', 'error', 'combine', 'risks']
  for (const tool of toolPayload) {
    for (const field of fields) {
      expect(tool[`${field}_en`]).not.toBe(tool[`${field}_vi`])
      expect(host.textContent).toContain(tool[`${field}_en`])
    }
  }
  expect(host.textContent).toContain('Create context from a lesson or exercise in the app')
  expect(host.textContent).not.toContain('Tạo context')
  expect(host.textContent).toContain('git commit -m "learn: ..."')
  expect(host.querySelector('button')).toBeNull()
  expect(host.querySelector('a')).toBeNull()
})

test('language switches preserve tool names and command strings', async () => {
  await act(async () => root.render(<ToolsView tools={toolPayload} language="vi" />))
  expect(host.textContent).toContain('Dùng công cụ')
  expect(host.textContent).toContain('Trợ lý học tập')
  expect(host.textContent).toContain('Khi gặp lỗi')
  const before = [...host.querySelectorAll('h3')].map((heading) => heading.textContent)
  await act(async () => root.render(<ToolsView tools={toolPayload} language="en" />))
  expect([...host.querySelectorAll('h3')].map((heading) => heading.textContent)).toEqual(before)
  expect(host.textContent).toContain('Troubleshooting')
  expect(host.textContent).not.toContain('Khi gặp lỗi')
  expect(host.textContent).toContain('python --version')
})

test('an empty toolkit has a localized recovery instruction', async () => {
  await act(async () => root.render(<ToolsView tools={[]} language="en" />))
  expect(host.querySelector('[role="status"]')!.textContent).toContain('No tools available')
  await act(async () => root.render(<ToolsView tools={[]} language="vi" />))
  expect(host.querySelector('[role="status"]')!.textContent).toContain('Chưa có công cụ')
})
