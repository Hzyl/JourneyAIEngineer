import { expect, test } from '@playwright/test'
import { readFile, stat } from 'node:fs/promises'

type Manifest = Record<string, { file: string; imports?: string[] }>
const output = '.build/hosted-production'
const manifest = JSON.parse(await readFile(`${output}/.vite/manifest.json`, 'utf8')) as Manifest

test('guests download exercise code only when opening exercises and never load the personal app', async ({ page }) => {
  const scripts = new Set<string>()
  const errors: string[] = []
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname.slice(1)
    if (path.endsWith('.js')) scripts.add(path)
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.public-hero')).toBeVisible()
  const personal = manifest['src/App.tsx'].file
  const cloud = manifest['src/platform/hosted/hosted-client.ts'].file
  const exercises = manifest['src/public/PublicExercises.tsx'].file
  expect(scripts.has(personal)).toBe(false)
  expect(scripts.has(cloud)).toBe(false)
  expect(scripts.has(exercises)).toBe(false)
  const bytes = (await Promise.all([...scripts].map(async (path) => (await stat(`${output}/${path}`)).size)))
    .reduce((sum, value) => sum + value, 0)
  // Raw JS bytes, not transfer time: catches accidentally eager app/catalog imports.
  expect(bytes).toBeLessThan(700_000)
  await test.info().attach('guest-script-load', {
    body: JSON.stringify({ bytes, files: [...scripts] }, null, 2), contentType: 'application/json',
  })
  await page.getByRole('button', { name: 'Bài tập', exact: true }).click()
  await expect(page.locator('.exercise-card')).toHaveCount(12)
  expect(scripts.has(exercises)).toBe(true)
  expect(scripts.has(personal)).toBe(false)
  expect(scripts.has(cloud)).toBe(false)
  await page.locator('.exercise-open').first().click()
  await page.getByRole('button', { name: 'Xem bài giải' }).click()
  await expect(page.getByLabel('Code bài giải Python')).toContainText('def inspect_environment')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByLabel('Email')).toBeVisible()
  expect(scripts.has(personal)).toBe(false)
  expect(scripts.has(cloud)).toBe(false)
  expect(errors).toEqual([])
})

test('a failed public chunk offers reload and recovers with the same lesson URL', async ({ page }) => {
  const chunk = `**/${manifest['src/public/PublicExperience.tsx'].file}`
  await page.route(chunk, (route) => route.abort())
  await page.goto('/lesson/phase-00-onboarding-environment-1')
  await expect(page.getByRole('alert')).toContainText('Could not load this page')
  await page.unroute(chunk)
  await page.getByRole('button', { name: 'Tải lại trang / Reload page' }).click()
  await expect(page.locator('.public-lesson')).toBeVisible()
  await expect(page).toHaveURL(/lesson\/phase-00-onboarding-environment-1$/)
})
