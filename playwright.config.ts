import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'accessibility',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable accessibility testing
        contextOptions: {
          reducedMotion: 'reduce',
        }
      },
    },
    {
      name: 'nil-smoke',
      testMatch: ['**/nil-smoke.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'],
        // Fast headless mode for smoke tests
        headless: true,
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox']
        }
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});