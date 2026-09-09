import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";

/**
 * PageBuilderEditorPage — /admin/page-builder
 *
 * Wraps the Page Builder editor's toolbar and left-panel tab switcher.
 * Works together with PageBuilderDesignPanel and PageBuilderPagesPanel,
 * all sharing the same page instance.
 *
 * Toolbar buttons (left to right):
 *   ← Back | [undo] [redo] | Edit | Preview | Revert | Save | Publish
 *
 * ⚠️  Known locator notes (confirmed 2026-05-25):
 *   - "Edit" button: multiple elements with name "Edit" may exist in some editor
 *     states. The primary approach is to take the first visible Edit button in
 *     the top navigation bar. If ambiguity causes issues, filter by the
 *     TopNavigationBar class (.TopNavigationBar---root---*), but note that
 *     CSS-module class names are build-time hashed and cannot be relied upon
 *     across deployments.
 *   - Undo/Redo buttons have empty aria-label (product bug). Cannot locate by
 *     role name; use the class-based selector as documented below.
 *   - URL remains /admin/page-builder regardless of which page is open in the
 *     editor. Use assertEditorLoaded() rather than assertUrl() for validation.
 */
export class PageBuilderEditorPage extends BasePage {
  // ── Toolbar ─────────────────────────────────────────────────────────────────
  /** Back arrow — navigates to /admin/landing-pages */
  private readonly backToListBtn = this.page.getByRole("button", {
    name: "Back to Page Builder main",
  });

  /**
   * Edit mode toggle.
   * Note: multiple buttons may be named "Edit" (e.g. inline component edit).
   * Taking the first visible instance is usually correct for the toolbar Edit button.
   */
  private readonly editBtn = this.page
    .getByRole("button", { name: "Edit" })
    .first();

  private readonly saveBtn = this.page.getByRole("button", { name: "Save" });
  private readonly publishBtn = this.page.getByRole("button", { name: "Publish" });
  private readonly revertBtn = this.page.getByRole("button", { name: "Revert" });
  private readonly previewBtn = this.page.getByRole("button", { name: "Preview" });

  /**
   * Undo button.
   * ⚠️ aria-label is empty (product accessibility bug) — cannot use getByRole.
   * Located by nth-child pattern: first toolbar icon button pair.
   * Update this locator if the bug is fixed in a future release.
   */
  private readonly undoBtn = this.page
    .locator('button[class*="undoRedoButton"]')
    .first();

  /**
   * Redo button (second of the undo/redo pair).
   */
  private readonly redoBtn = this.page
    .locator('button[class*="undoRedoButton"]')
    .nth(1);

  // ── Left panel tabs ──────────────────────────────────────────────────────────
  private readonly pagesTab = this.page.getByRole("tab", { name: "Pages" });
  private readonly designTab = this.page.getByRole("tab", { name: "Design" });

  constructor(page: Page) {
    super(page);
  }

  // ── Editor load ──────────────────────────────────────────────────────────────

  /**
   * Wait for the editor to fully load.
   * Asserts the URL is /admin/page-builder and the Back button is visible
   * (reliable indicator that the editor shell has rendered).
   */
  async waitForEditorLoad(): Promise<void> {
    await this.step("Wait for Page Builder editor to load", async () => {
      await this.page.waitForURL(/\/admin\/page-builder/, { timeout: 30_000 });
      await this.waitForVisible(this.backToListBtn, "Back to Page Builder main button");
    });
  }

  async assertEditorLoaded(): Promise<void> {
    await this.step("Assert Page Builder editor is loaded", async () => {
      await expect(this.page).toHaveURL(/\/admin\/page-builder/);
      await expect(this.backToListBtn).toBeVisible();
    });
  }

  // ── Toolbar actions ──────────────────────────────────────────────────────────

  /**
   * Click the Edit button to toggle the editor into edit mode.
   *
   * ⚠️  Confirmed 2026-05-25: Clicking "Edit" switches the editor UI mode but
   *     does NOT immediately enable the Save button. Save is only enabled after
   *     actual canvas changes (drag-and-drop component placements, text edits, etc).
   *     Do NOT assert Save.toBeEnabled() here.
   */
  async clickEditMode(): Promise<void> {
    await this.step("Click Edit to enter edit mode", async () => {
      await this.click(this.editBtn, "Edit button (toolbar)");
      // No Save assertion — Save becomes enabled only after canvas content changes
    });
  }

  async clickSave(): Promise<void> {
    await this.step("Click Save", async () => {
      await this.click(this.saveBtn, "Save button");
      // Wait for Save to complete — button typically becomes disabled again after save
      await expect(this.saveBtn).toBeDisabled({ timeout: 15_000 });
    });
  }

  async clickPublish(): Promise<void> {
    await this.step("Click Publish — opens 5-step Publish wizard", async () => {
      await this.click(this.publishBtn, "Publish button");
    });
  }

  async clickRevert(): Promise<void> {
    await this.step("Click Revert", async () => {
      await this.click(this.revertBtn, "Revert button");
    });
  }

  async clickPreview(): Promise<void> {
    await this.step("Click Preview", async () => {
      await this.click(this.previewBtn, "Preview button");
    });
  }

  /**
   * Navigate back to the Page Builder list (/admin/landing-pages).
   */
  async goBackToList(): Promise<void> {
    await this.step("Click Back to Page Builder main → navigate to list", async () => {
      await this.click(this.backToListBtn, "Back to Page Builder main");
      await this.page.waitForURL(/\/admin\/landing-pages/, { timeout: 30_000 });
    });
  }

  // ── Left panel tab switching ─────────────────────────────────────────────────

  async switchToPagesTab(): Promise<void> {
    await this.step("Switch to Pages tab in left panel", async () => {
      await this.click(this.pagesTab, "Pages tab");
    });
  }

  async switchToDesignTab(): Promise<void> {
    await this.step("Switch to Design tab in left panel", async () => {
      await this.click(this.designTab, "Design tab");
    });
  }

  // ── Toolbar state assertions ─────────────────────────────────────────────────

  async assertSaveEnabled(): Promise<void> {
    await this.step("Assert Save button is enabled", async () => {
      await expect(this.saveBtn).toBeEnabled();
    });
  }

  async assertSaveDisabled(): Promise<void> {
    await this.step("Assert Save button is disabled (no pending changes)", async () => {
      await expect(this.saveBtn).toBeDisabled();
    });
  }
}
