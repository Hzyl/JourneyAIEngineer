// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import curriculum from '../../content/curriculum.json'
import { PortfolioBoard } from '../components/PortfolioBoard'

let host: HTMLDivElement
let root: Root
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })
const render = (language: 'vi' | 'en') => act(async () => {
  root.render(<PortfolioBoard program={curriculum.program} language={language} />)
})

test('all project deliverables and evaluation criteria are readable without external navigation', async () => {
  await render('en')
  const projects = curriculum.program.portfolio_projects
  expect(host.querySelectorAll('.portfolio-card')).toHaveLength(projects.length)
  for (const [index, card] of [...host.querySelectorAll('.portfolio-card')].entries()) {
    expect(card.querySelectorAll('li')).toHaveLength(projects[index].deliverables.length)
    expect(card.textContent).toContain(projects[index].evaluation)
    expect(card.textContent).toContain(projects[index].github_path)
    expect(card.querySelector('details')!.open).toBe(false)
  }
  expect(host.querySelector('a')).toBeNull()
  expect(host.textContent).toContain('You do not need to build them all')
})

test('Vietnamese translations retain every deliverable and English uses its own career checklist', async () => {
  await render('vi')
  for (const [index, card] of [...host.querySelectorAll('.portfolio-card')].entries()) {
    const project = curriculum.program.portfolio_projects[index]
    expect(project.deliverables_vi).toHaveLength(project.deliverables.length)
    expect(card.textContent).toContain(project.evaluation_vi)
    expect(card.textContent).toContain(project.deliverables_vi.at(-1))
  }
  expect(host.querySelector('.career-checklist')!.textContent).toContain('Có CV một trang')
  await render('en')
  expect(host.querySelector('.career-checklist')!.textContent).toContain('Prepare a one-page CV')
  expect(host.querySelector('.career-checklist')!.textContent).not.toContain('Có CV một trang')
})

test('missing portfolio data has a clear empty state', async () => {
  await act(async () => root.render(<PortfolioBoard program={{}} language="en" />))
  expect(host.querySelector('[role="status"]')!.textContent).toBe('No project ideas are available yet.')
})
