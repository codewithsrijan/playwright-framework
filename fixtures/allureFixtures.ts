import { test as base, Page } from "@playwright/test";
import { Reporter } from "../utils/Reporter";
import { LoginPage } from "../pageObjects/LoginPage.page";

// ─────────────────────────────────────────────
// CONSOLE LOG COLLECTOR
// ─────────────────────────────────────────────

function attachConsoleListener(page: Page): () => string[] {
  const logs: string[] = [];
  page.on("console", (msg) => {
    logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  return () => logs;
}

// ─────────────────────────────────────────────
// FIXTURE TYPES
// ─────────────────────────────────────────────

type BaseFixtures = {
  loginPage: LoginPage;
};

// ─────────────────────────────────────────────
// BASE TEST
// ─────────────────────────────────────────────

export const test = base.extend<BaseFixtures>({
  /**
   * Augmented page fixture:
   *  - collects browser console logs and attaches them after every test
   *  - captures full-page screenshot + DOM when a test fails
   */
  page: async ({ page }, use, testInfo) => {
    const getLogs = attachConsoleListener(page);

    await use(page);

    // ── post-test hooks ──────────────────────
    await Reporter.attachConsoleLogs(getLogs());
    await Reporter.screenshotOnFailure(page, testInfo);
  },

  /** LoginPage fixture — add more page-object fixtures following this pattern. */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
