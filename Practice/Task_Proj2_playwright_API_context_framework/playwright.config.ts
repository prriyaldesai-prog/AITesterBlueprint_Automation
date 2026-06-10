import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Maximum time one test can run for. */
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await request.get(url)`. */
    baseURL: 'http://127.0.0.1:3001',

    /* Set default headers for all API requests */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlaywrightAPIAutomation/1.0'
    },

    /* Collect trace when retrying a failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Run local dev server (Mock API Server) before starting the tests */
  globalSetup: require.resolve('./src/utils/global-setup'),
  globalTeardown: require.resolve('./src/utils/global-teardown'),
});
