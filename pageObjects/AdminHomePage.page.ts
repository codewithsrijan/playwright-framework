import type { Page } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class AdminHomePage extends BasePage {
  private readonly learningMenu = this.page.locator(
    '//*[@id="learningMainMenu"]',
  );
  private readonly assignments = this.page.locator(
    '//*[@data-marker="assignmetns"]',
  );
  private readonly pageBuilder = this.page.locator(
    '[data-marker="pageBuilder"]',
  );

  constructor(page: Page) {
    super(page);
  }

  async navigateToAssignments(): Promise<void> {
    await this.step("Navigate to assignments", async () => {
      await this.click(this.learningMenu, "Learning Menu");
      await this.click(this.assignments, "Assignments");
    });
  }

  /** Navigate to Page Builder via the Learning side-nav (Admin → Learning → Page Builder). */
  async navigateToPageBuilder(): Promise<void> {
    await this.step("Navigate to Page Builder", async () => {
      await this.click(this.learningMenu, "Learning Menu");
      await this.click(this.pageBuilder, "Page Builder nav link");
      await this.page.waitForURL(/\/admin\/landing-pages/, { timeout: 30_000 });
    });
  }
}
