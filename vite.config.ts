import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Source archives extracted under .build are snapshots, not the active test suite.
    include: ['src/test/**/*.test.{ts,tsx}'],
  },
  server: {
    proxy: {
      '/api': `http://127.0.0.1:${Number(process.env.JOURNEY_DEV_API_PORT) || 8000}`,
    },
  },
})
