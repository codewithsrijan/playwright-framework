import { test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import * as allure from "allure-js-commons";

/**
 * Reporter — single reporting utility for the whole framework.
 *
 * Steps feed BOTH reporters automatically:
 *   • test.step()         → Playwright HTML report (collapsible steps)
 *   • allure-playwright   → picks up test.step() natively in v3
 *
 * Metadata (epic/feature/story/tags/severity/owner) is sent to:
 *   • allure-js-commons   → populates Allure BDD hierarchy (Behaviors/Features)
 *   • test.info().annotations → visible in Playwright HTML report's Annotations row
 *
 * Usage anywhere inside a running test (page objects, fixtures, helpers):
 *
 *   await Reporter.step("Login as admin", async () => { ... });
 *   Reporter.setEpic("UCM");  Reporter.setFeature("Assignments");
 *   await Reporter.screenshot(page, "After login");
 *   await Reporter.attachJson("Response payload", body);
 */
export class Reporter {

  // ─── Metadata — feeds both Allure BDD hierarchy and HTML annotations ─────────

  /** Set Epic label — populates Allure Behaviors view and HTML annotations. */
  static async setEpic(value: string): Promise<void> {
    test.info().annotations.push({ type: "epic", description: value });
    await allure.epic(value);
  }

  /** Set Feature label — populates Allure Features view and HTML annotations. */
  static async setFeature(value: string): Promise<void> {
    test.info().annotations.push({ type: "feature", description: value });
    await allure.feature(value);
  }

  /** Set Story label — populates Allure Stories view and HTML annotations. */
  static async setStory(value: string): Promise<void> {
    test.info().annotations.push({ type: "story", description: value });
    await allure.story(value);
  }

  /** Add one or more tags — visible in both Allure and HTML reports. */
  static async addTags(...tags: string[]): Promise<void> {
    tags.forEach((tag) =>
      test.info().annotations.push({ type: "tag", description: tag }),
    );
    await allure.tags(...tags);
  }

  /** Set severity: blocker | critical | normal | minor | trivial */
  static async setSeverity(
    value: "blocker" | "critical" | "normal" | "minor" | "trivial",
  ): Promise<void> {
    test.info().annotations.push({ type: "severity", description: value });
    await allure.severity(value);
  }

  /** Set test owner — visible in both reports. */
  static async setOwner(value: string): Promise<void> {
    test.info().annotations.push({ type: "owner", description: value });
    await allure.owner(value);
  }

  // ─── Steps ──────────────────────────────────────────────────────────────────

  /**
   * Wrap any async block in a named step.
   * • Playwright HTML report: collapsible row with ✅/❌ and timing
   * • Allure report:          captured automatically by allure-playwright v3
   */
  static async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return test.step(name, body);
  }

  // ─── Screenshots ────────────────────────────────────────────────────────────

  static async screenshot(page: Page, name = "Screenshot"): Promise<void> {
    const buffer = await page.screenshot({ fullPage: false });
    await test.info().attach(name, { body: buffer, contentType: "image/png" });
  }

  static async fullPageScreenshot(page: Page, name = "Full Page Screenshot"): Promise<void> {
    const buffer = await page.screenshot({ fullPage: true });
    await test.info().attach(name, { body: buffer, contentType: "image/png" });
  }

  /** Attach a screenshot + page HTML when the test has failed. */
  static async screenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
    if (testInfo.status !== testInfo.expectedStatus) {
      const buffer = await page.screenshot({ fullPage: true });
      await testInfo.attach(`FAILED – ${testInfo.title}`, {
        body: buffer,
        contentType: "image/png",
      });
      const html = await page.content();
      await testInfo.attach("DOM on Failure", { body: html, contentType: "text/html" });
    }
  }

  // ─── Attachments ────────────────────────────────────────────────────────────

  static async attachText(name: string, content: string): Promise<void> {
    await test.info().attach(name, { body: content, contentType: "text/plain" });
  }

  static async attachJson(name: string, data: object): Promise<void> {
    await test.info().attach(name, {
      body: JSON.stringify(data, null, 2),
      contentType: "application/json",
    });
  }

  static async attachHtml(name: string, html: string): Promise<void> {
    await test.info().attach(name, { body: html, contentType: "text/html" });
  }

  static async attachConsoleLogs(logs: string[], name = "Console Logs"): Promise<void> {
    if (logs.length > 0) {
      await test.info().attach(name, {
        body: logs.join("\n"),
        contentType: "text/plain",
      });
    }
  }

  static async attachPageSource(page: Page, name = "Page Source"): Promise<void> {
    const html = await page.content();
    await Reporter.attachHtml(name, html);
  }
}
