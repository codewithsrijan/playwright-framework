import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Reporter } from "../../utils/Reporter";


export type DescribeAssignmentFields = {
  title: string;
  businessObjectiveTypeahead: string;
  categoryLabel: string;
  description: string;
  daysToComplete: string;
};

/**
 * Create Assignment wizard (steps after **Create Assignment** heading).
 * Locators match Percipio admin assignment flow; keep role/label-based selectors.
 */
export class CreateAssignmentWizardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private contentSearchDialog() {
    return this.page.getByRole("dialog", {
      name: /Search for your content and Percipio content/i,
    });
  }

  private usersSearchDialog() {
    return this.page.getByRole("dialog", {
      name: "Search for users and audiences",
    });
  }

  /** Primary wizard surface for Add content (excludes open dialogs). */
  private addContentMainRegion(): Locator {
    return this.page.getByRole("main");
  }

  private async resolveCheckboxInventoryRoot(): Promise<Locator> {
    const main = this.addContentMainRegion();
    if ((await main.count()) > 0) {
      return main;
    }
    return this.page.locator("body");
  }

  /**
   * “Force order” / ordered completion (`isContentOrderRequired`).
   * Stable hook: `data-marker="assignmentforcedOrderCompletionCheckbox"` (Add content → Assignment completion).
   */
  forceOrderCheckbox(): Locator {
    const marked = this.page.locator(
      '[data-marker="assignmentforcedOrderCompletionCheckbox"]',
    );
    return marked
      .getByRole("checkbox")
      .or(marked.locator('input[type="checkbox"]'))
      .or(
        this.page.locator(
          'input[type="checkbox"][data-marker="assignmentforcedOrderCompletionCheckbox"]',
        ),
      )
      .first();
  }

  nextAddContentButton(): Locator {
    return this.page.getByRole("button", { name: /Next: Add content/i });
  }

  nextAddUsersAndAudiencesButton(): Locator {
    return this.page.getByRole("button", {
      name: /Next: Add users and audiences/i,
    });
  }

  nextNotifyUsersButton(): Locator {
    return this.page.getByRole("button", { name: /Next: Notify users/i });
  }

  /**
   * Collects accessible names for all checkboxes under `root` (for plan §8.1 inventory).
   */
  async enumerateCheckboxAccessibleNames(root: Locator): Promise<string[]> {
    const checkboxes = root.getByRole("checkbox");
    const count = await checkboxes.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const label = await checkboxes.nth(i).evaluate((el: HTMLInputElement) => {
        const fromLabel = el.labels?.[0]?.textContent?.trim();
        if (fromLabel) {
          return fromLabel;
        }
        return el.getAttribute("aria-label")?.trim() ?? "";
      });
      names.push(label || `checkbox[${i}]`);
    }
    return names;
  }

  async recordAddContentStepCheckboxInventory(
    phase: "before-add" | "after-first-content",
  ): Promise<string[]> {
    return await this.step(
      `Add content step — checkbox inventory (${phase})`,
      async () => {
        const root = await this.resolveCheckboxInventoryRoot();
        const names = await this.enumerateCheckboxAccessibleNames(root);
        await Reporter.attachJson(`checkbox-inventory-${phase}`, {
          labels: names,
          count: names.length,
        });
        return names;
      },
    );
  }

  async recordContentSearchDialogCheckboxInventory(): Promise<string[]> {
    return await this.step(
      "Content search dialog — checkbox inventory",
      async () => {
        const dialog = this.contentSearchDialog();
        const names = await this.enumerateCheckboxAccessibleNames(dialog);
        await Reporter.attachJson("checkbox-inventory-content-dialog", {
          labels: names,
          count: names.length,
        });
        return names;
      },
    );
  }

  async checkForceOrder(): Promise<void> {
    await this.step("Enable Force order (content order)", async () => {
      const control = this.forceOrderCheckbox();
      await expect(control).toBeVisible({ timeout: 30_000 });
      await control.scrollIntoViewIfNeeded();

      const role = await control.evaluate((el) =>
        (el.getAttribute("role") ?? "").toLowerCase(),
      );

      if (role === "switch") {
        await expect(control).toBeEnabled();
        const checked = await control.getAttribute("aria-checked");
        if (checked !== "true") {
          await this.click(control, "Content order switch");
        }
        await expect(control).toHaveAttribute("aria-checked", "true");
        return;
      }

      await expect(control).toBeEnabled();
      if (await control.isChecked()) {
        await expect(control).toBeChecked();
        return;
      }
      // Custom checkbox UI: SVG/icon overlay intercepts pointer events on the raw input.
      await control.check({ force: true });
      await expect(control).toBeChecked();
    });
  }

  async expectForceOrderCheckboxDisabled(): Promise<void> {
    await this.step("Assert Force order control is disabled", async () => {
      const box = this.forceOrderCheckbox();
      await expect(box).toBeVisible();
      await expect(box).toBeDisabled();
    });
  }

  async expectForceOrderCheckboxEnabled(): Promise<void> {
    await this.step("Assert Force order control is enabled", async () => {
      const box = this.forceOrderCheckbox();
      await expect(box).toBeVisible();
      await expect(box).toBeEnabled();
    });
  }

  /**
   * Waits until a content-order control appears (after navigation or adding items).
   */
  async waitForContentOrderControlVisible(): Promise<void> {
    await this.step("Wait for content order control", async () => {
      await expect(this.forceOrderCheckbox()).toBeVisible({ timeout: 30_000 });
    });
  }

  async fillDescribeAssignment(
    fields: DescribeAssignmentFields,
  ): Promise<void> {
    await this.step(
      "Describe assignment — fill required fields",
      async () => {
        await this.fill(
          this.page.getByRole("textbox", { name: "Title" }),
          fields.title,
          "Title",
        );

        const businessObjective = this.page.getByRole("combobox", {
          name: "Business objective",
        });
        await this.click(businessObjective, "Business objective");
        await this.page.keyboard.type(fields.businessObjectiveTypeahead);
        await this.page.keyboard.press("ArrowDown");
        await this.page.keyboard.press("Enter");

        await this.page
          .getByRole("combobox", { name: "Category" })
          .selectOption({ label: fields.categoryLabel });

        await this.fill(
          this.page.getByRole("textbox", { name: "Description" }),
          fields.description,
          "Description",
        );

        await this.fill(
          this.page.getByRole("spinbutton", { name: "Days to complete" }),
          fields.daysToComplete,
          "Days to complete",
        );
      },
    );
  }

  async goToAddContentStep(): Promise<void> {
    await this.step("Go to Add content step", async () => {
      await this.click(
        this.page.getByRole("button", { name: /Next: Add content/i }),
        "Next: Add content",
      );
    });
  }

  /**
   * Opens Add content, searches, and attaches the first search result.
   */
  async addFirstContentBySearch(searchTerm: string): Promise<void> {
    await this.step(
      `Add content — search "${searchTerm}" and select first result`,
      async () => {
        await this.click(
          this.page.getByRole("button", { name: "Add content" }).first(),
          "Add content",
        );

        const dialog = this.contentSearchDialog();
        await this.waitForVisible(dialog, "Content search dialog");
        await this.recordContentSearchDialogCheckboxInventory();

        await this.fill(
          dialog.getByRole("combobox", {
            name: /Search for content in English/i,
          }),
          searchTerm,
          "Search for content in English",
        );
        await this.page.keyboard.press("Enter");
        await expect(
          dialog.getByText(new RegExp(`results for "${searchTerm}"`, "i")),
        ).toBeVisible();

        await this.click(
          dialog.getByRole("button", { name: "Add To Assignment" }).first(),
          "Add To Assignment (first row)",
        );
        await this.click(
          dialog.getByRole("button", { name: "Add content" }),
          "Add content (confirm)",
        );
      },
    );
  }

  async goToAddUsersStep(): Promise<void> {
    await this.step(
      "Go to Add users and audiences step",
      async () => {
        await this.click(
          this.page.getByRole("button", {
            name: /Next: Add users and audiences/i,
          }),
          "Next: Add users and audiences",
        );
      },
    );
  }

  async openUsersAndAudiencesPicker(): Promise<void> {
    await this.step("Open users and audiences picker", async () => {
      await this.click(
        this.page.getByRole("button", { name: "Add users and audiences" }),
        "Add users and audiences",
      );
      await this.waitForVisible(
        this.usersSearchDialog(),
        "Search for users and audiences dialog",
      );
    });
  }

  async addUserBySearch(loginOrName: string): Promise<void> {
    await this.step(`Select user "${loginOrName}"`, async () => {
      await this.openUsersAndAudiencesPicker();

      const dialog = this.usersSearchDialog();
      await this.fill(
        dialog.getByRole("textbox", { name: "Search for users" }),
        loginOrName,
        "Search for users",
      );
      await this.page.keyboard.press("Enter");
      await this.click(
        dialog.getByRole("button", { name: "Select or deselect item" }).first(),
        "Select or deselect item (first match)",
      );
      await this.click(dialog.getByRole("button", { name: "Done" }), "Done");
    });
  }

  async goToNotifyUsersStep(): Promise<void> {
    await this.step("Go to Notify users step", async () => {
      await this.click(
        this.page.getByRole("button", { name: /Next: Notify users/i }),
        "Next: Notify users",
      );
    });
  }

  async goToReviewAndLaunchStep(): Promise<void> {
    await this.step("Go to Review and launch step", async () => {
      await this.click(
        this.page.getByRole("button", { name: /Next: Review and launch/i }),
        "Next: Review and launch",
      );
    });
  }

  async launchAssignment(): Promise<void> {
    await this.step("Launch assignment", async () => {
      await this.click(
        this.page.getByRole("button", { name: /Next: Launch Assignment/i }),
        "Next: Launch Assignment",
      );
    });
  }

  async expectLaunchSuccess(): Promise<void> {
    await this.step(
      "Assert assignment launched successfully",
      async () => {
        await expect(
          this.page.getByText("Success! You launched a new assignment."),
        ).toBeVisible();
        await expect(
          this.page.getByRole("link", { name: "View summary page" }),
        ).toBeVisible();
      },
    );
  }
}
