import { spawnSync } from 'node:child_process'
import { writeFileSync, renameSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const root = fileURLToPath(new URL('../', import.meta.url))
const cli = fileURLToPath(new URL('../node_modules/supabase/dist/supabase.js', import.meta.url))
const target = fileURLToPath(new URL('../src/platform/hosted/database.types.ts', import.meta.url))
const { values } = parseArgs({ options: { workdir: { type: 'string' } } })
const args = values.workdir ? ['--workdir', values.workdir] : []
const result = spawnSync(process.execPath, [cli, ...args, 'gen', 'types', 'typescript', '--local'], {
  cwd: root,
  encoding: 'utf8',
  timeout: 120_000,
  maxBuffer: 5 * 1024 * 1024,
})
if (result.stderr) process.stderr.write(result.stderr)
if (result.error || result.status !== 0) {
  throw new Error('Local database type generation failed; the existing type file was preserved.')
}
if (!/^\s*export type Json\b/.test(result.stdout) || !result.stdout.includes('export type Database')) {
  throw new Error('Unexpected generated output; the existing type file was preserved.')
}
// CLI versions may emit spaces on blank lines; use the same normalization in CI and locally.
const source = result.stdout.replace(/\r\n/g, '\n').replace(/[\t ]+$/gm, '')
const temporary = `${target}.${process.pid}.tmp`
try {
  writeFileSync(temporary, source, 'utf8')
  renameSync(temporary, target)
} finally {
  rmSync(temporary, { force: true })
}
console.log('Generated database types from local Supabase.')
