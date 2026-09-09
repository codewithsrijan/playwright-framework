import type { Page } from "@playwright/test";
import { errors } from "playwright";
import { NAVIGATION_MS } from "../framework/wait/timeouts";
import { BasePage } from "./base/BasePage";

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('//*[@id="loginName"]');
  private readonly passwordInput = this.page.locator('//*[@id="password"]');
  private readonly ssoClassicLink = this.page.locator('//a[@href="#/classic"]');

  constructor(page: Page) {
    super(page);
  }

  /** Navigate to the Percipio login page. */
  async openPercipio(serviceConfig: { url: string }): Promise<void> {
    await this.step("Open Percipio", async () => {
      await this.page.goto(serviceConfig.url, {
        waitUntil: "domcontentloaded",
        timeout: NAVIGATION_MS,
      });
    });
  }

  async login(serviceConfig: {
    basicUser: string;
    basicPassword: string;
  }): Promise<void> {
    await this.step("Login", async () => {
      try {
        const ssoButton = this.ssoClassicLink;
        if (await this.isEnabled(ssoButton)) {
          await this.click(ssoButton, "SSO Classic Link");
        }
      } catch (error: unknown) {
        if (error instanceof errors.TimeoutError) {
          // SSO option not present; continue with username/password
        }
      }

      await this.fill(this.usernameInput, serviceConfig.basicUser, "Login Name");
      await this.pressKey("Enter");
      await this.fill(this.passwordInput, serviceConfig.basicPassword, "Login Password");
      await this.pressKey("Enter");
    });
    await this.waitForVisible(
      this.page.getByRole("heading", { name: /Welcome/i }),
      "Home Page",
    );
  }
}
