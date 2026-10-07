// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { checklistKey, readChecklist } from '../platform/checklist-storage'

afterEach(() => localStorage.clear())

it('keeps account B separate from account A and legacy local checklist ticks', () => {
  const lesson = 'intro'
  localStorage.setItem(checklistKey(lesson, null), '[true,true]')
  localStorage.setItem(checklistKey(lesson, 'account-a'), '[true,false]')
  expect(readChecklist(checklistKey(lesson, 'account-b'), 2)).toEqual([false, false])
  expect(readChecklist(checklistKey(lesson, 'account-a'), 2)).toEqual([true, false])
  expect(readChecklist(checklistKey(lesson, null), 2)).toEqual([true, true])
})

it('tolerates malformed and outdated saved values without claiming completion', () => {
  localStorage.setItem('broken', '{')
  localStorage.setItem('outdated', '[true,"true",1]')
  expect(readChecklist('broken', 2)).toEqual([false, false])
  expect(readChecklist('outdated', 4)).toEqual([true, false, false, false])
})
