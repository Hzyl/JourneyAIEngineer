// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import lesson from '../../content/curated/phase-00-onboarding-baseline-1.json'
import { PublicLesson } from '../public/PublicLesson'
import type { CatalogLesson } from '../platform/hosted/catalog'

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

test.each(['vi', 'en'] as const)('%s public lesson keeps paragraphs and only removes repeated explanation', async (language) => {
  const paragraphs = language === 'vi'
    ? ['Đọc ví dụ rồi chạy thử.', 'Đối chiếu kết quả với dữ liệu đầu vào.']
    : ['Read the example and run it.', 'Compare the result with the input.']
  const distinct = '<script>neverExecute()</script>'
  const concept = paragraphs.join('\n\n')
  const example = lesson.code_examples[0]
  const onSignIn = vi.fn()
  await act(async () => root.render(<PublicLesson language={language} onSignIn={onSignIn} lesson={{
    ...lesson,
    concept_notes_vi: language === 'vi' ? concept : 'Không hiển thị.',
    concept_notes_en: language === 'en' ? concept : 'Do not display.',
    code_examples: [{ ...example,
      explanation_vi: `${paragraphs[0]}  \n\n${distinct}`,
      explanation_en: `${paragraphs[0]}  \n\n${distinct}`,
    }, { ...example, title: 'Whole concept repeated', explanation_vi: paragraphs.join('  '),
      explanation_en: paragraphs.join('  ') }],
  } as CatalogLesson} />))
  expect([...host.querySelectorAll('.public-prose > p')].map((node) => node.textContent)).toEqual(paragraphs)
  const examples = host.querySelectorAll('.public-example')
  expect(examples[0].textContent).not.toContain(paragraphs[0])
  expect(examples[0].textContent).toContain(distinct)
  expect(examples[0].querySelector('script')).toBeNull()
  expect(examples[1].textContent).not.toContain(paragraphs[0])
  expect(examples[1].textContent).not.toContain(paragraphs[1])
  expect(examples[0].querySelector('code')?.textContent).toBe(example.code)
  expect(onSignIn).not.toHaveBeenCalled()
})
