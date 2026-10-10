import { expect, type Locator, type Page } from '@playwright/test'

export async function checkEditorialReading(page: Page, prose: Locator) {
  const readings = await prose.evaluateAll((elements) => elements.filter((element) => {
    const style = getComputedStyle(element)
    return element.getClientRects().length > 0 && style.visibility !== 'hidden' && element.textContent?.trim()
  }).map((element) => {
    const style = getComputedStyle(element)
    return { text: element.textContent!.trim().slice(0, 120), fontSize: parseFloat(style.fontSize) }
  }))
  expect(readings.length, 'Teaching prose must exist before checking its size').toBeGreaterThan(5)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  expect(overflow,
    'The document must not overflow horizontally').toBeLessThanOrEqual(1)
  expect(readings.filter((reading) => reading.fontSize < 16), 'Teaching prose below 16px').toEqual([])
  return { textElements: readings.length, minimumFontSize: Math.min(...readings.map((reading) => reading.fontSize)), overflow }
}
