import { defineConfig } from '@playwright/test'
import hosted from './playwright.hosted.config'

// Run real production chunks against synthetic public settings. No remote data is needed.
export default defineConfig({
  ...hosted,
  testMatch: ['hosted-*.spec.ts', 'guest-load.production.spec.ts'],
  outputDir: '.build/hosted-production-results',
  use: { ...hosted.use, baseURL: 'http://127.0.0.1:4175' },
  webServer: {
    command: 'npx vite build --outDir .build/hosted-production --manifest'
      + ' && npx vite preview --host 127.0.0.1 --port 4175 --strictPort --outDir .build/hosted-production',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    env: {
      ...process.env,
      VITE_APP_MODE: 'hosted',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'local-preview-key',
    },
  },
})
