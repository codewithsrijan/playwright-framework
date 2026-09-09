import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";

/**
 * PageBuilderPublishWizard — 5-step Publish wizard
 *
 * Opened from the editor toolbar "Publish" button.
 *
 * Step flow:
 *   Step 1: Landing Page Details
 *     → Next: Pages
 *   Step 2: Pages
 *     → Next: Determine visibility
 *   Step 3: Determine Visibility (Audience association)
 *     → Next: Default homepage
 *   Step 4: Default Homepage
 *     → Next: Review and publish
 *   Step 5: Review and Publish
 *     → Publish page(s)  OR  Cancel
 *
 * ⚠️  Pre-conditions:
 *   - "All Users" audience (4,237 users) confirmed in develop org (OQ-07 resolved).
 *     No seeding required for SC-03.
 *   - Org cap: 10 published pages. Prefer cancelAndLeave() over publishPage()
 *     in tests where publication is not strictly required by the AC.
 *     SC-03 verifies audience association via Step 5 review, then cancels.
 *
 * ⚠️  Leave confirmation dialog:
 *   Clicking Cancel on any step triggers [role="alertdialog"]:
 *     "Yes, leave without saving" | "No, keep working"
 *   Use cancelAndLeave() or cancelAndStay() accordingly.
 *
 * ⚠️  editLandingPageDetailsButton data-marker:
 *   Marked as "_(verify)_" in design.md. Confirmed: editAudienceButton and
 *   editDefaultHomepageButton. If the details edit button has a different
 *   marker, update this.editDetailsBtn below.
 */
export class PageBuilderPublishWizard extends BasePage {
  // ── Step 1: Landing Page Details ────────────────────────────────────────────
  private readonly step1TitleInput = this.page.locator("#pageTitle");
  private readonly step1UrlInput = this.page.locator("#pageUrl");
  private readonly step1HideNavCheckbox = this.page.locator("#shouldHideInLeftNav");
  private readonly nextPagesBtn = this.page.getByRole("button", {
    name: "Next: Pages",
  });

  // ── Step 2: Pages ────────────────────────────────────────────────────────────
  private readonly nextVisibilityBtn = this.page.getByRole("button", {
    name: "Next: Determine visibility",
  });

  // ── Step 3: Determine Visibility (Audience) ──────────────────────────────────
  private readonly audienceSearchInput = this.page
    .locator("#search")
    .or(this.page.locator('input[aria-label="Search for audiences"]'));
  private readonly allAudiencesTab = this.page.getByRole("tab", {
    name: "All audiences",
  });
  private readonly selectedAudiencesTab = this.page.getByRole("tab", {
    name: "Selected audiences",
  });
  private readonly nextDefaultHomepageBtn = this.page.getByRole("button", {
    name: "Next: Default homepage",
  });

  // ── Step 4: Default Homepage ─────────────────────────────────────────────────
  private readonly defaultHomepageYes = this.page
    .getByRole("radio", { name: "Yes" })
    .or(this.page.getByLabel("Yes"));
  private readonly defaultHomepageNo = this.page
    .getByRole("radio", { name: "No" })
    .or(this.page.getByLabel("No"));
  private readonly nextReviewBtn = this.page.getByRole("button", {
    name: "Next: Review and publish",
  });

  // ── Step 5: Review and Publish ───────────────────────────────────────────────
  private readonly editDetailsBtn = this.page.locator(
    '[data-marker="editLandingPageDetailsButton"]',
  ); // ⚠️ verify data-marker value during T-14
  private readonly editAudienceBtn = this.page.locator(
    '[data-marker="editAudienceButton"]',
  ); // ✅ confirmed
  private readonly editDefaultHomepageBtn = this.page.locator(
    '[data-marker="editDefaultHomepageButton"]',
  ); // ✅ confirmed
  private readonly publishPageBtn = this.page.getByRole("button", {
    name: "Publish page(s)",
  });

  // ── Cancel / Leave dialog (appears on ANY Cancel click) ──────────────────────
  private readonly cancelBtn = this.page.getByRole("button", {
    name: "Cancel",
  });
  private readonly alertDialog = this.page.getByRole("alertdialog");
  private readonly confirmLeaveBtn = this.page.getByRole("button", {
    name: "Yes, leave without saving",
  });
  private readonly stayBtn = this.page.getByRole("button", {
    name: "No, keep working",
  });

  constructor(page: Page) {
    super(page);
  }

  // ── Step 1 ───────────────────────────────────────────────────────────────────

  /**
   * Assert Step 1 (Landing Page Details) is visible.
   * Call after PageBuilderEditorPage.clickPublish().
   */
  async assertStep1Visible(): Promise<void> {
    await this.step("Assert Publish wizard Step 1 (Landing page details) is visible", async () => {
      await this.waitForVisible(this.step1TitleInput, "Step 1 — page title input");
      await this.waitForVisible(this.nextPagesBtn, "Step 1 — Next: Pages button");
    });
  }

  /**
   * Fill Step 1 form fields (title already pre-filled from page creation).
   * Call this only if you need to change the title in the wizard.
   * @param title - New page title (max 48 chars).
   */
  async fillStep1Title(title: string): Promise<void> {
    await this.step(`Fill Step 1 title: "${title}"`, async () => {
      await this.step1TitleInput.waitFor({ state: "visible" });
      await this.step1TitleInput.clear();
      await this.fill(this.step1TitleInput, title, "Step 1 — page title");
    });
  }

  async proceedToStep2(): Promise<void> {
    await this.step("Proceed to Step 2 (Pages) — click Next: Pages", async () => {
      await this.click(this.nextPagesBtn, "Next: Pages");
      await this.waitForVisible(this.nextVisibilityBtn, "Step 2 — Next: Determine visibility button");
    });
  }

  // ── Step 2 ───────────────────────────────────────────────────────────────────

  async proceedToStep3(): Promise<void> {
    await this.step("Proceed to Step 3 (Determine visibility) — click Next: Determine visibility", async () => {
      await this.click(this.nextVisibilityBtn, "Next: Determine visibility");
      await this.waitForVisible(this.audienceSearchInput.first(), "Step 3 — audience search input");
    });
  }

  // ── Step 3 (Audience) ────────────────────────────────────────────────────────

  /**
   * Search for an audience in the Step 3 audience picker.
   * @param audienceName - Audience name to search for.
   */
  async searchForAudience(audienceName: string): Promise<void> {
    await this.step(`Search for audience: "${audienceName}"`, async () => {
      await this.fill(this.audienceSearchInput.first(), audienceName, "Audience search input");
    });
  }

  /**
   * Check whether an audience is already selected (its remove-chip is visible).
   *
   * ⚠️  Confirmed 2026-05-25: The audience picker shows a chip list above the
   *     tabpanel. Each selected audience has a `button "Remove <name> from the
   *     list."` chip. If the chip is visible the audience is already selected and
   *     clicking the "Select or deselect item" button would DESELECT it.
   */
  async isAudienceAlreadySelected(audienceName: string): Promise<boolean> {
    const removeChip = this.page.getByRole("button", {
      name: new RegExp(`Remove ${audienceName}`, "i"),
    });
    return removeChip.isVisible();
  }

  /**
   * Select an audience in the Step 3 audience picker.
   *
   * ⚠️  Confirmed 2026-05-25: The audience picker uses a custom component —
   *     audience items are NOT table rows. Each item is displayed as text
   *     ("Name N users") + a `button "Select or deselect item"` toggle inside
   *     `tabpanel "All audiences"`. Clicking the button when the audience is
   *     already selected DESELECTS it — call isAudienceAlreadySelected() first.
   *
   * @param audienceName - Audience name visible in the "All audiences" tabpanel.
   */
  async selectAudience(audienceName: string): Promise<void> {
    await this.step(`Select audience "${audienceName}" in Step 3`, async () => {
      const tabpanel = this.page.getByRole("tabpanel", { name: "All audiences" });
      await tabpanel.waitFor({ state: "visible" });

      // Wait for the audience text to appear (confirms search results loaded)
      await expect(
        tabpanel.getByText(audienceName, { exact: false }),
      ).toBeVisible({ timeout: 15_000 });

      // Click the "Select or deselect item" toggle button.
      // After searching there is typically 1 result, so .first() is safe.
      const toggleBtn = tabpanel
        .getByRole("button", { name: /select or deselect/i })
        .first();
      await this.click(toggleBtn, `Select/deselect toggle for "${audienceName}"`);
    });
  }

  /**
   * Assert an audience is visible in the Step 3 audience picker.
   *
   * ⚠️  Confirmed 2026-05-25: The audience picker uses custom components —
   *     audience names do NOT appear as table rows. Two reliable indicators:
   *
   *   (1) The remove-chip button "Remove <name> from the list." — always visible
   *       above the tablist whenever the audience is part of the page's audience set,
   *       regardless of which tab ("All audiences" / "Selected audiences") is active.
   *
   *   (2) A tabpanel whose text content includes the audience name — works when
   *       the audience row is rendered inside the active tabpanel.
   *
   *   We accept EITHER indicator so the assertion works from both tabs.
   */
  async assertAudienceInList(audienceName: string): Promise<void> {
    await this.step(
      `Assert audience "${audienceName}" is visible in the audience picker`,
      async () => {
        const removeChip = this.page.getByRole("button", {
          name: new RegExp(`Remove ${audienceName}`, "i"),
        });
        // Tabpanel that has the audience name in its text tree (active or visible one)
        const tabpanelWithAudience = this.page
          .getByRole("tabpanel")
          .filter({ hasText: new RegExp(audienceName, "i") })
          .first();

        await expect(
          removeChip.or(tabpanelWithAudience).first(),
        ).toBeVisible({ timeout: 15_000 });
      },
    );
  }

  /**
   * Switch to the "Selected audiences" tab to verify an audience was selected.
   */
  async switchToSelectedAudiencesTab(): Promise<void> {
    await this.step("Switch to 'Selected audiences' tab", async () => {
      await this.click(this.selectedAudiencesTab, "Selected audiences tab");
    });
  }

  async proceedToStep4(): Promise<void> {
    await this.step("Proceed to Step 4 (Default homepage) — click Next: Default homepage", async () => {
      await this.click(this.nextDefaultHomepageBtn, "Next: Default homepage");
      await this.waitForVisible(this.nextReviewBtn, "Step 4 — Next: Review and publish button");
    });
  }

  // ── Step 4 ───────────────────────────────────────────────────────────────────

  /**
   * Set the "Is this the default homepage?" option.
   *
   * ⚠️  Confirmed 2026-05-25: The radio buttons are custom-styled — the native
   *     <input type="radio"> is CSS-positioned off-viewport (absolute at 0,0 behind
   *     a visual wrapper). waitFor("visible") never resolves and click({ force:true })
   *     fails with "outside of viewport".
   *
   *     Fix: evaluate() calls el.click() directly via JavaScript, bypassing all
   *     Playwright viewport/visibility guards. This fires the click event from within
   *     the page context, which the React radio component handles correctly.
   *
   * @param yes - true = Yes; false = No.
   */
  async setDefaultHomepage(yes: boolean): Promise<void> {
    await this.step(
      `Set default homepage: ${yes ? "Yes" : "No"}`,
      async () => {
        const radio = yes ? this.defaultHomepageYes : this.defaultHomepageNo;
        await radio.first().waitFor({ state: "attached", timeout: 15_000 });
        // evaluate() calls the native DOM click() directly — bypasses CSS positioning
        await radio.first().evaluate((el: HTMLElement) => el.click());
      },
    );
  }

  async proceedToStep5(): Promise<void> {
    await this.step("Proceed to Step 5 (Review and publish) — click Next: Review and publish", async () => {
      await this.click(this.nextReviewBtn, "Next: Review and publish");
      await this.waitForVisible(this.publishPageBtn, "Step 5 — Publish page(s) button");
    });
  }

  // ── Step 5 ───────────────────────────────────────────────────────────────────

  /**
   * Assert that the audience association is confirmed in the Step 5 review summary.
   *
   * ⚠️  Confirmed 2026-05-25: The Step 5 review does NOT show the audience name.
   *     It shows an AGGREGATE count: "1 Audience | 4237 users".
   *     We accept either the audience name (if somehow shown) OR the aggregate
   *     count pattern `\d+ Audience` as proof that an audience is associated.
   *
   * @param audienceName - Audience name (accepted if visible, e.g. future UI change).
   */
  async assertAudienceInReview(audienceName: string): Promise<void> {
    await this.step(
      `Assert audience association is shown in Step 5 review summary ("${audienceName}" or count)`,
      async () => {
        // Step 5 shows "N Audience | M users" not the audience name itself
        await expect(
          this.page.getByText(audienceName, { exact: false })
            .or(this.page.getByText(/\d+\s+Audience/i))
            .first(),
        ).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  /**
   * Assert the Step 5 review page edit buttons are visible.
   * Validates that Step 5 is fully rendered.
   */
  async assertStep5ReviewVisible(): Promise<void> {
    await this.step("Assert Step 5 (Review and publish) is visible", async () => {
      await this.waitForVisible(this.publishPageBtn, "Publish page(s) button");
      await this.waitForVisible(this.editAudienceBtn, "Edit audience button (data-marker=editAudienceButton)");
    });
  }

  /**
   * Click "Publish page(s)" to finalize and publish.
   *
   * ⚠️  Each publish consumes one slot from the 10-page cap.
   *     Prefer cancelAndLeave() in tests where publication is not required.
   */
  async publishPage(): Promise<void> {
    await this.step("Click 'Publish page(s)' — finalize publication", async () => {
      await this.click(this.publishPageBtn, "Publish page(s)");
    });
  }

  // ── Cancel flow (works from any step) ───────────────────────────────────────

  /**
   * Cancel the wizard and confirm "Yes, leave without saving".
   * Returns the editor to its pre-wizard state.
   *
   * This triggers [role="alertdialog"] — handled by clicking "Yes, leave without saving".
   */
  async cancelAndLeave(): Promise<void> {
    await this.step("Cancel Publish wizard — confirm 'Yes, leave without saving'", async () => {
      await this.click(this.cancelBtn, "Cancel button");
      await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
      await this.click(this.confirmLeaveBtn, "Yes, leave without saving");
      await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
    });
  }

  /**
   * Cancel the wizard but stay — click "No, keep working".
   * Dialog is dismissed and wizard remains open.
   */
  async cancelAndStay(): Promise<void> {
    await this.step("Cancel Publish wizard — click 'No, keep working' to stay", async () => {
      await this.click(this.cancelBtn, "Cancel button");
      await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
      await this.click(this.stayBtn, "No, keep working");
      await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
    });
  }
}
