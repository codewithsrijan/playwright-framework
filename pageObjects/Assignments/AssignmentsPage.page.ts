import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { errors } from "playwright";
import {
  ACTION_MS,
  NAVIGATION_MS,
  POST_LOGIN_SETTLE_MS,
} from "../../framework/wait/timeouts";
import { BasePage } from "../base/BasePage";

// ─── FILTER PANEL LOCATOR DISCOVERY (Phase 0 — live UI inspection 2026-05-25) ─
// Environment:        https://plat3-complete.front.develop.squads-dev.com/admin/assignments
//
// Filter toggle btn:  [data-marker="filterToggleBtn"]  (text: "Filter")
//                     Must be clicked to open/reveal the filter checkbox panel.
//
// Filter checkboxes:  Checkbox controls — accessible via getByLabel(text):
//                     "Failed"      id="Failed"
//                     "Scheduled"   id="scheduled"
//                     "Draft"       id="draft"
//                     "In Progress" id="in_progress"
//                     "Archived"    id="archived"
//                     "Canceled"    id="canceled"
//                     NOTE: "Active" and "Retired" are NOT filter options in the UI.
//                     The filter panel shows non-default states only.
//
// Search input:       id="search"  (placeholder="Search assignments in this list",
//                                   aria-label="Search assignments in this list")
//
// Assignment rows:    .ag-row  (AG Grid data rows; row-index attr identifies data rows)
// Assignment title:   .ag-row [col-id="name"]  (first cell — assignment name)
//
// Empty state:        .ag-overlay-no-rows-wrapper  (AG Grid no-rows overlay)
//                     Default text: "No Rows To Show"
//
// Known searchable title in dev: "Auto Assignment HP01" (multiple instances confirmed)
// ──────────────────────────────────────────────────────────────────────────────

export class AssignmentsPage extends BasePage {
  // ── Existing locators ──────────────────────────────────────────────────────
  private readonly newAssignmentButton = this.page.locator(
    '//a[@data-marker="newAssignmentBtn"]',
  );

  // ── Filter panel locators ──────────────────────────────────────────────────

  /** Toggle button that opens/closes the filter checkbox panel. */
  private readonly filterToggleBtn: Locator = this.page.locator(
    '[data-marker="filterToggleBtn"]',
  );

  /**
   * Returns the checkbox locator for a given filter label text.
   * Filter panel must be open (call openFilterPanel first).
   * Confirmed label values: "Failed", "Scheduled", "Draft",
   * "In Progress", "Archived", "Canceled"
   */
  private filterCheckbox(label: string): Locator {
    // Checkboxes have associated <label> elements; getByLabel resolves
    // the for/id association automatically.
    return this.page.getByLabel(label, { exact: true });
  }

  /** Search input that filters assignments by name/title. */
  private readonly nameSearchInput: Locator = this.page.locator("#search");

  /** All visible AG Grid data rows. */
  private readonly assignmentListRows: Locator = this.page.locator(".ag-row");

  /** Name/title cells within AG Grid data rows. */
  private readonly assignmentTitleCells: Locator = this.page.locator(
    ".ag-row [col-id='name']",
  );

  /**
   * AG Grid no-rows overlay — shown when filter/search yields zero results.
   * Default text: "No Rows To Show"
   */
  private readonly emptyStateIndicator: Locator = this.page.locator(
    ".ag-overlay-no-rows-wrapper",
  );

  constructor(page: Page) {
    super(page);
  }

  // ── Existing methods ───────────────────────────────────────────────────────

  async navigateToNewAssignment(): Promise<void> {
    await this.step("Navigate to new assignment", async () => {
      await this.click(this.newAssignmentButton, "New Assignment Button");
      await this.waitForVisible(
        this.page.getByRole("heading", { name: "Create Assignment" }),
        "Create Assignment Page",
      );
    });
  }

  // ── Filter panel methods ───────────────────────────────────────────────────

  /**
   * Opens the filter panel by clicking the toggle button.
   * Safe to call multiple times — checks whether the first checkbox
   * is already visible before clicking.
   */
  async openFilterPanel(): Promise<void> {
    await this.step("Open filter panel", async () => {
      // Check if filter panel is already open (any filter checkbox visible)
      const draftCheckbox = this.filterCheckbox("Draft");
      const isAlreadyOpen = await draftCheckbox.isVisible();
      if (!isAlreadyOpen) {
        await this.click(this.filterToggleBtn, "Filter toggle button");
        await this.waitForVisible(draftCheckbox, "Filter panel (Draft checkbox)");
      }
    });
  }

  /**
   * Checks a filter checkbox with the given label text.
   * Opens the filter panel first if it is not already open.
   * Waits for the list to stabilize after checking.
   * Confirmed labels: "Failed" | "Scheduled" | "Draft" |
   *                   "In Progress" | "Archived" | "Canceled"
   */
  async applyFilterCheckbox(label: string): Promise<void> {
    await this.step(`Apply filter: "${label}"`, async () => {
      await this.openFilterPanel();
      const checkbox = this.filterCheckbox(label);
      await this.waitForVisible(checkbox, `Filter checkbox: ${label}`);
      // force:true bypasses the SVG icon overlay that intercepts pointer events
      await checkbox.check({ force: true });
      await expect(checkbox).toBeChecked();
      // AG Grid filtering is client-side; brief settle before asserting rows
      await this.page.waitForTimeout(500);
    });
  }

  /**
   * Unchecks a filter checkbox with the given label text.
   * Opens the filter panel first if it is not already open.
   * Waits for the list to stabilize after unchecking.
   */
  async clearFilterCheckbox(label: string): Promise<void> {
    await this.step(`Clear filter: "${label}"`, async () => {
      await this.openFilterPanel();
      const checkbox = this.filterCheckbox(label);
      await this.waitForVisible(checkbox, `Filter checkbox: ${label}`);
      // force:true bypasses the SVG icon overlay that intercepts pointer events
      await checkbox.uncheck({ force: true });
      await expect(checkbox).not.toBeChecked();
      await this.page.waitForTimeout(500);
    });
  }

  /**
   * Waits until the AG Grid has rendered at least one data row.
   * Call this after navigation before capturing baseline counts.
   */
  async waitForListLoaded(): Promise<void> {
    await this.step("Wait for assignment list to load", async () => {
      await this.assignmentListRows.first().waitFor({
        state: "visible",
        timeout: 30_000,
      });
    });
  }

  /**
   * Types a search term into the assignment name search input.
   * Waits for the AG Grid to re-render after the input change.
   */
  async searchByName(term: string): Promise<void> {
    await this.step(`Search assignments by name: "${term}"`, async () => {
      await this.waitForVisible(this.nameSearchInput, "Assignment search input");
      await this.fill(this.nameSearchInput, term, "Assignment search input");
      // Increase settle time — search may debounce or trigger an API call
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Clears the assignment name search input and waits for the list to restore.
   */
  async clearSearch(): Promise<void> {
    await this.step("Clear assignment search", async () => {
      await this.waitForVisible(this.nameSearchInput, "Assignment search input");
      await this.nameSearchInput.click({ clickCount: 3 });
      await this.page.keyboard.press("Backspace");
      await this.page.waitForTimeout(800);
    });
  }

  /**
   * Returns the number of assignment data rows currently visible in the AG Grid.
   */
  async getVisibleAssignmentCount(): Promise<number> {
    return await this.step(
      "Get visible assignment row count",
      async () => {
        return await this.assignmentListRows.count();
      },
    );
  }

  /**
   * Returns an array of assignment title strings from the visible AG Grid rows.
   */
  async getVisibleAssignmentTitles(): Promise<string[]> {
    return await this.step(
      "Get visible assignment titles",
      async () => {
        const count = await this.assignmentTitleCells.count();
        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
          const text = await this.assignmentTitleCells.nth(i).textContent();
          titles.push(text?.trim() ?? "");
        }
        return titles;
      },
    );
  }

  /**
   * Asserts that the AG Grid no-rows overlay is visible
   * (i.e. the current filter/search yields zero results).
   */
  async expectEmptyState(): Promise<void> {
    await this.step("Assert empty state is visible", async () => {
      await expect(this.emptyStateIndicator).toBeVisible({ timeout: 15_000 });
    });
  }

  /**
   * Asserts that at least one assignment row is visible in the list.
   */
  async expectListNotEmpty(): Promise<void> {
    await this.step("Assert assignment list is not empty", async () => {
      await expect(this.assignmentListRows.first()).toBeVisible({
        timeout: 15_000,
      });
    });
  }
}
