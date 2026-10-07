import { defineConfig, devices } from '@playwright/test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dataRoot = mkdtempSync(join(tmpdir(), 'journey-e2e-'))

/**
 * The smoke suite exercises the same local-only processes used by contributors:
 * FastAPI serves the learning data and Vite serves the React shell. No external
 * API or network resource is required by the test.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/hosted-learning-flow.spec.ts',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // The local FastAPI/SQLite smoke environment has one shared runtime data
  // root. Serial execution keeps Playwright artifacts and app state isolated.
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5177',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'python -m uvicorn apps.api.main:app --host 127.0.0.1 --port 8871',
      url: 'http://127.0.0.1:8871/api/health/live',
      env: { JOURNEY_DATA_DIR: dataRoot, JOURNEY_JOURNAL_DIR: join(dataRoot, 'journal') },
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5177 --strictPort',
      url: 'http://127.0.0.1:5177',
      env: { VITE_APP_MODE: 'local', JOURNEY_DEV_API_PORT: '8871' },
      timeout: 120_000,
      reuseExistingServer: false,
    },
  ],
})
