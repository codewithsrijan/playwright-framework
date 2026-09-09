import { defineConfig, devices } from "@playwright/test";
// This is a sample config for what users might be running locally

export default defineConfig({

  testDir: "tests/tests-api",
  testMatch: "**/*.spec.ts",

  /* Maximum time one test can run for. */
  timeout: 5 * 60 * 1000, //this is five minutes
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* tests in parallel */
  workers: 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
    ["allure-playwright"],
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      args: ["--start-maximized"],
    },
  },
  globalSetup: "./utils/globalSetup.ts",

  /* Configure projects for major browsers */

  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
  ],
});
