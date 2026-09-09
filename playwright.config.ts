import fs from "fs";
import path from "path";
import { defineConfig } from "@playwright/test";

function loadFrontendBaseURL(): string | undefined {
  const fromEnv =
    process.env.PLAYWRIGHT_BASE_URL?.trim() || process.env.BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  const envName = process.env.NODE_ENV || "develop";
  try {
    const configPath = path.join(__dirname, "config", `${envName}.json`);
    if (!fs.existsSync(configPath)) {
      return undefined;
    }
    const raw = fs.readFileSync(configPath, "utf8");
    const cfg = JSON.parse(raw) as { frontend?: { url?: string } };
    return cfg.frontend?.url;
  } catch {
    return undefined;
  }
}

/** Resolved once so `page.goto("/")` and projects share the same origin. */
const baseURL = loadFrontendBaseURL();

const isCI = !!process.env.CI || !!process.env.JENKINS_URL;

// This is a sample config for what users might be running locally

export default defineConfig({
  testDir: ".",
  testMatch: ["tests/**/*.spec.ts"],
  testIgnore: ["tests/tests-api/**"],

  /* Maximum time one test can run for. */
  timeout: 5 * 60 * 1000, //this is five minutes
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 15_000,
  },
  /* tests in parallel */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: [
    ["line"],
    ["json", { outputFile: "./test-results/test-results.json" }],
    ["allure-playwright", { resultsDir: "./allure-results" }],
    ["html", { outputFile: "./test-results/index.html" }],
    //["html", { outputFile: "./test-results/index.html" }],
  ],

  use: {
    /* Base URL: PLAYWRIGHT_BASE_URL / BASE_URL, or config/<NODE_ENV>.json → frontend.url */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: isCI,
    launchOptions: {
      args: ["--start-maximized"],
    },
  },
  globalSetup: "./utils/globalSetup.ts",

  /* Configure projects for major browsers */

  projects: [
    // Runs first; writes tests/playwright/.auth/user.json (see tests/auth/auth.setup.ts).
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
      // Must use the same browser as `chrome` — storageState from bundled Chromium often
      // does not apply to Google Chrome (channel), so tests redirect to /login.
      use: {
        baseURL,
        headless: isCI,
        browserName: "chromium",
        channel: "chrome",
        viewport: null,
      },
    },
    {
      name: "chrome",
      dependencies: ["setup"],
      use: {
        baseURL,
        headless: isCI,
        browserName: "chromium",
        channel: "chrome",
        viewport: null,
        launchOptions: {
          args: isCI ? [] : ["--start-maximized"],
        },
        // Session loaded after setup project saves it.
        storageState: "tests/playwright/.auth/user.json",
      },
    },
  ],
});
