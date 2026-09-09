import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";


/**
 * Audience Management — Create Audience wizard/form.
 * Plan: specs/plan-ucm-manual3-aws-create-audience-individual-users.md
 * Labels (name field, type selector, save button) are confirmed from first live run;
 * flexible locators cover known product label variants.
 */
export class CreateAudiencePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ───────────────────────────────────────────────────────────────

  private createControl(): Locator {
    return this.page
      .getByRole("button", { name: /^(create|add)(\s+an?)?\s+audience/i })
      .or(this.page.getByRole("link", { name: /^(create|add)(\s+an?)?\s+audience/i }))
      .or(this.page.getByRole("button", { name: /new audience/i }))
      .first();
  }

  private audienceNameInput(): Locator {
    return this.page
      .getByLabel(/audience name|^name$/i)
      .or(this.page.getByPlaceholder(/audience name|^name$/i))
      .first();
  }

  private individualUsersTypeControl(): Locator {
    return this.page
      .getByRole("radio", { name: /individual users/i })
      .or(this.page.getByRole("button", { name: /individual users/i }))
      .or(this.page.getByRole("option", { name: /individual users/i }))
      .first();
  }

  private userSearchInput(): Locator {
    return this.page
      .getByRole("searchbox")
      .or(this.page.getByPlaceholder(/search.*user/i))
      .or(this.page.getByRole("textbox", { name: /search.*user/i }))
      .first();
  }

  private selectUserButtons(): Locator {
    return this.page.getByRole("button", { name: /select or deselect item/i });
  }

  private saveButton(): Locator {
    const dialog = this.page.getByRole("dialog");
    const inDialog = dialog.getByRole("button", {
      name: /^(save|create|done|finish)$/i,
    });
    const onPage = this.page.getByRole("button", {
      name: /^(save|create|done|finish)$/i,
    });
    return inDialog.or(onPage).last();
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  async openCreateAudience(): Promise<void> {
    await this.step("Open Create Audience form", async () => {
      await this.click(this.createControl(), "Create Audience control");
    });
  }

  async fillAudienceName(name: string): Promise<void> {
    await this.step(`Fill audience name: "${name}"`, async () => {
      await this.fill(this.audienceNameInput(), name, "Audience name");
    });
  }

  async selectIndividualUsersType(): Promise<void> {
    await this.step("Select Individual users audience type", async () => {
      const control = this.individualUsersTypeControl();
      if (await control.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await this.click(control, "Individual users type");
      }
    });
  }

  async searchUsers(query: string): Promise<void> {
    await this.step(`Search users: "${query}"`, async () => {
      await this.fill(this.userSearchInput(), query, "User search input");
      await this.page.keyboard.press("Enter");
    });
  }

  async addFirstSearchResult(label: string): Promise<void> {
    await this.step(`Select first result (${label})`, async () => {
      await this.waitForVisible(
        this.selectUserButtons().first(),
        "Select user button",
      );
      await this.click(this.selectUserButtons().first(), `Select user: ${label}`);
    });
  }

  async searchAndAddUser(query: string): Promise<void> {
    await this.step(`Search and add user: "${query}"`, async () => {
      await this.searchUsers(query);
      await this.addFirstSearchResult(query);
    });
  }

  async saveAudience(): Promise<void> {
    await this.step("Save / Create audience", async () => {
      await this.click(this.saveButton(), "Save audience button");
    });
  }

  // ─── Assertions ─────────────────────────────────────────────────────────────

  async expectAudienceVisible(name: string): Promise<void> {
    await this.step(`Assert audience "${name}" is visible in list`, async () => {
      await expect(
        this.page.getByText(name, { exact: false }).first(),
      ).toBeVisible({ timeout: 30_000 });
    });
  }

  async expectSaveBlocked(): Promise<void> {
    await this.step("Assert Save is blocked (disabled or inline validation)", async () => {
      const saveBtn = this.page
        .getByRole("button", { name: /^(save|create|done|finish)$/i })
        .last();
      const disabled = await saveBtn.isDisabled({ timeout: 5_000 }).catch(() => true);
      if (disabled) {
        await expect(saveBtn).toBeDisabled();
        return;
      }
      await saveBtn.click({ timeout: 5_000 });
      await expect(
        this.page.getByText(/required|enter.*name|cannot be empty/i),
      ).toBeVisible({ timeout: 10_000 });
    });
  }

  async expectUserSearchEmpty(): Promise<void> {
    await this.step("Assert user search returns no results", async () => {
      await expect(this.selectUserButtons()).toHaveCount(0, { timeout: 15_000 });
    });
  }

  async expectAudienceManagementPage(): Promise<void> {
    await this.step("Assert Audience Management page is loaded", async () => {
      await expect(this.page).toHaveURL(/\/admin\/audiences/i, {
        timeout: 60_000,
      });
      await expect(this.page.getByRole("main")).toBeVisible({ timeout: 30_000 });
    });
  }
}
