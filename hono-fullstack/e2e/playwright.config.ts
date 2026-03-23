import { defineConfig, devices } from '@playwright/test'

// Resolve workspace root as an absolute path so webServer commands run
// from the correct directory regardless of where `playwright test` is invoked.
const rootDir = new URL('..', import.meta.url).pathname

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @app/api dev',
      url: 'http://localhost:3000/api/books',
      reuseExistingServer: !process.env.CI,
      cwd: rootDir,
    },
    {
      command: 'pnpm --filter @app/web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: rootDir,
    },
  ],
})
