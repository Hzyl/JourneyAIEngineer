import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import curriculum from '../../content/curriculum.json'
import manifest from '../../public/images/flow/manifest.json'
import { illustrationForLesson } from '../components/learning-illustrations'

describe('learning illustrations', () => {
  it('covers every curriculum phase with a shipped image', () => {
    const ids = new Set(manifest.map((asset) => asset.id))
    for (const phase of curriculum.phases) {
      expect(ids.has(illustrationForLesson(phase.slug))).toBe(true)
      expect(illustrationForLesson(`${phase.slug}-sample-lesson`)).toBe(illustrationForLesson(phase.slug))
    }
  })

  it('ships both responsive variants with accurate manifest sizes', () => {
    expect(manifest).toHaveLength(18)
    for (const asset of manifest) {
      expect(asset.variants.map((variant) => variant.width)).toEqual([480, 960])
      for (const variant of asset.variants) {
        const path = `public/images/flow/${variant.file}`
        expect(existsSync(path)).toBe(true)
        expect(statSync(path).size).toBe(variant.bytes)
      }
    }
  })
})
