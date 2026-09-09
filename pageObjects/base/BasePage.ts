import { Page, Locator, expect } from "@playwright/test";
import { Reporter } from "../../utils/Reporter";

/**
 * BasePage – Every Page Object Model class extends this.
 *
 * All actions are wrapped in Reporter.step() which feeds Playwright's
 * built-in HTML report directly — no extra config needed.
 *
 * Subclasses get a protected this.step() shortcut for their own named steps.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Convenience so subclasses can write: await this.step("...", async () => { ... }) */
  protected async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return Reporter.step(name, body);
  }

  // ─────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────

  async navigateTo(url: string): Promise<void> {
    await Reporter.step(`Navigate to: ${url}`, async () => {
      await this.page.goto(url);
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  async reload(): Promise<void> {
    await Reporter.step("Reload page", async () => {
      await this.page.reload();
      await this.page.waitForLoadState("domcontentloaded");
    });
  }

  async goBack(): Promise<void> {
    await Reporter.step("Navigate back", async () => {
      await this.page.goBack();
    });
  }

  // ─────────────────────────────────────────────
  // INTERACTIONS
  // ─────────────────────────────────────────────

  async click(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Click: ${description}`, async () => {
      await locator.waitFor({ state: "visible" });
      await locator.click();
    });
  }

  async fill(locator: Locator, value: string, description: string): Promise<void> {
    await Reporter.step(`Fill "${description}" with "${value}"`, async () => {
      await locator.waitFor({ state: "visible" });
      await locator.fill(value);
    });
  }

  async clearAndFill(locator: Locator, value: string, description: string): Promise<void> {
    await Reporter.step(`Clear and fill "${description}" with "${value}"`, async () => {
      await locator.waitFor({ state: "visible" });
      await locator.clear();
      await locator.fill(value);
    });
  }

  async selectOption(locator: Locator, value: string, description: string): Promise<void> {
    await Reporter.step(`Select "${value}" from "${description}"`, async () => {
      await locator.selectOption(value);
    });
  }

  async check(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Check: ${description}`, async () => {
      await locator.check();
    });
  }

  async uncheck(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Uncheck: ${description}`, async () => {
      await locator.uncheck();
    });
  }

  async hover(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Hover over: ${description}`, async () => {
      await locator.hover();
    });
  }

  async doubleClick(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Double-click: ${description}`, async () => {
      await locator.dblclick();
    });
  }

  async rightClick(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Right-click: ${description}`, async () => {
      await locator.click({ button: "right" });
    });
  }

  async pressKey(key: string): Promise<void> {
    await Reporter.step(`Press key: ${key}`, async () => {
      await this.page.keyboard.press(key);
    });
  }

  async uploadFile(locator: Locator, filePath: string, description: string): Promise<void> {
    await Reporter.step(`Upload file "${filePath}" via ${description}`, async () => {
      await locator.setInputFiles(filePath);
    });
  }

  async dragAndDrop(source: Locator, target: Locator, description: string): Promise<void> {
    await Reporter.step(`Drag and drop: ${description}`, async () => {
      await source.dragTo(target);
    });
  }

  // ─────────────────────────────────────────────
  // WAITS
  // ─────────────────────────────────────────────

  async waitForVisible(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Wait for visible: ${description}`, async () => {
      await locator.waitFor({ state: "visible" });
    });
  }

  async waitForHidden(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Wait for hidden: ${description}`, async () => {
      await locator.waitFor({ state: "hidden" });
    });
  }

  async waitForNetworkIdle(): Promise<void> {
    await Reporter.step("Wait for network idle", async () => {
      await this.page.waitForLoadState("networkidle");
    });
  }

  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await Reporter.step(`Wait for URL: ${urlPattern}`, async () => {
      await this.page.waitForURL(urlPattern);
    });
  }

  // ─────────────────────────────────────────────
  // GETTERS  (no step wrapping — these are reads, not actions)
  // ─────────────────────────────────────────────

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? "";
  }

  async getValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  async getAttribute(locator: Locator, attr: string): Promise<string | null> {
    return locator.getAttribute(attr);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ─────────────────────────────────────────────
  // ASSERTIONS
  // ─────────────────────────────────────────────

  async assertVisible(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Assert visible: ${description}`, async () => {
      await expect(locator).toBeVisible();
    });
  }

  async assertHidden(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Assert hidden: ${description}`, async () => {
      await expect(locator).toBeHidden();
    });
  }

  async assertText(locator: Locator, expected: string | RegExp, description: string): Promise<void> {
    await Reporter.step(`Assert text of "${description}" = "${expected}"`, async () => {
      await expect(locator).toHaveText(expected);
    });
  }

  async assertContainsText(locator: Locator, text: string, description: string): Promise<void> {
    await Reporter.step(`Assert "${description}" contains "${text}"`, async () => {
      await expect(locator).toContainText(text);
    });
  }

  async assertUrl(expected: string | RegExp): Promise<void> {
    await Reporter.step(`Assert URL = "${expected}"`, async () => {
      await expect(this.page).toHaveURL(expected);
    });
  }

  async assertTitle(expected: string | RegExp): Promise<void> {
    await Reporter.step(`Assert title = "${expected}"`, async () => {
      await expect(this.page).toHaveTitle(expected);
    });
  }

  async assertEnabled(locator: Locator, description: string): Promise<void> {
    await Reporter.step(`Assert enabled: ${description}`, async () => {
      await expect(locator).toBeEnabled();
    });
  }

  async assertCount(locator: Locator, count: number, description: string): Promise<void> {
    await Reporter.step(`Assert count of "${description}" = ${count}`, async () => {
      await expect(locator).toHaveCount(count);
    });
  }

  // ─────────────────────────────────────────────
  // SCREENSHOT HELPERS
  // ─────────────────────────────────────────────

  async screenshot(name?: string): Promise<void> {
    await Reporter.screenshot(this.page, name);
  }

  async screenshotFullPage(name?: string): Promise<void> {
    await Reporter.fullPageScreenshot(this.page, name);
  }
}
