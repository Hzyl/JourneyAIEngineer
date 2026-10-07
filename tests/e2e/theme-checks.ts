import { expect, type Page } from '@playwright/test'

/** Rendered solid/gradient text pairs, including form values and placeholders.
 * This is a regression check, not a replacement for a full accessibility audit. */
export async function checkThemeContrast(page: Page) {
  const failures = await page.evaluate(() => {
    type Color = [number, number, number, number]
    const parse = (value: string): Color => {
      const values = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]
      return [values[0], values[1], values[2], values[3] ?? 1]
    }
    const over = (top: Color, bottom: Color): Color => [
      top[0] * top[3] + bottom[0] * (1 - top[3]),
      top[1] * top[3] + bottom[1] * (1 - top[3]),
      top[2] * top[3] + bottom[2] * (1 - top[3]), 1,
    ]
    const luminance = (color: Color) => color.slice(0, 3).reduce((sum, value, index) => {
      const channel = value / 255
      return sum + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
        * [0.2126, 0.7152, 0.0722][index]
    }, 0)
    const background = (element: Element): Color => {
      const layers: Color[] = []
      for (let current: Element | null = element; current; current = current.parentElement) {
        const style = getComputedStyle(current)
        const gradient = style.backgroundImage.match(/rgba?\([^)]+\)/)?.[0]
        const color = parse(gradient ?? style.backgroundColor)
        layers.push(color)
        if (color[3] === 1) break
      }
      return layers.reverse().reduce((result, layer) => over(layer, result), [255, 255, 255, 1] as Color)
    }
    const problems: string[] = []
    document.querySelectorAll('body *').forEach((element) => {
      if (element.closest('.sr-only, .skip-link, [disabled], [aria-hidden="true"]')) return
      const box = element.getBoundingClientRect()
      if (!box.width || !box.height || box.right <= 0 || box.left >= innerWidth) return
      const style = getComputedStyle(element)
      if (style.visibility !== 'visible' || Number(style.opacity) === 0) return
      const formField = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      const ownText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      if (!ownText && !formField && !(element instanceof HTMLSelectElement)) return
      const bg = background(element)
      const placeholder = formField && !element.value && element.hasAttribute('placeholder')
      const text = parse(placeholder ? getComputedStyle(element, '::placeholder').color : style.color)
      const l1 = luminance(over(text, bg))
      const l2 = luminance(bg)
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
      const large = parseFloat(style.fontSize) >= 24
        || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700)
      if (ratio + 0.01 < (large ? 3 : 4.5)) {
        problems.push(`${element.tagName}.${element.className} ${ratio.toFixed(2)}:1 ${style.color} / ${bg.slice(0, 3)} ${element.textContent?.trim().slice(0, 45)}`)
      }
    })
    return problems
  })
  expect(failures, `Text contrast at ${page.url()}`).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
}
