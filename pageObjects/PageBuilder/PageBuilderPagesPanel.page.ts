import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";

/**
 * PageBuilderPagesPanel — Pages tab in the Page Builder editor
 *
 * Wraps the left-panel Pages tab which shows the page hierarchy tree
 * and provides page-level actions (Rename, Copy link, Add subpage).
 *
 * Activate this panel by calling PageBuilderEditorPage.switchToPagesTab() first.
 *
 * Page-level Actions menu items (3 total):
 *   Rename | Copy link | Add subpage
 *
 * ⚠️  Known locator issues (confirmed 2026-05-25):
 *   - The page-level Actions button has aria-label="Actions null" — the "null"
 *     is a product bug (the page name is not being interpolated into the label).
 *     Primary locator uses a prefix match [aria-label^="Actions"] to be tolerant
 *     of a future fix. If the bug is fixed and the label becomes "Actions <name>",
 *     this selector will still work due to the ^ prefix operator.
 *   - "Drag to reorder" handle button — exists for page reordering within the tree.
 *     Not tested in the current scope but locator is provided for future use.
 */
export class PageBuilderPagesPanel extends BasePage {
  /**
   * Page-level Actions button.
   * ⚠️  aria-label="Actions null" (product bug) — uses prefix match.
   */
  private readonly pageActionsBtn = this.page
    .locator('[aria-label^="Actions"]')
    .first();

  /** Drag-to-reorder handle on page items (for page tree reordering). */
  private readonly dragToReorderHandle = this.page.getByRole("button", {
    name: "Drag to reorder",
  });

  // ── Page-level action menu items ────────────────────────────────────────────
  private readonly renameMenuItem = this.page.getByRole("button", {
    name: "Rename",
  });
  private readonly copyLinkMenuItem = this.page.getByRole("button", {
    name: "Copy link",
  });
  private readonly addSubpageMenuItem = this.page.getByRole("button", {
    name: "Add subpage",
  });

  constructor(page: Page) {
    super(page);
  }

  // ── Page actions menu ──────────────────────────────────────────────────────

  /**
   * Open the page-level Actions menu for the active/first page in the tree.
   * In most test scenarios there is exactly one page in the tree (just created).
   *
   * @param pageName - Human-readable name for step labeling (not used as locator).
   */
  async openPageActionsMenu(pageName: string): Promise<void> {
    await this.step(`Open page-level Actions menu for "${pageName}"`, async () => {
      await this.click(this.pageActionsBtn, `Actions menu button (page: "${pageName}")`);
      // Wait for the menu to appear
      await this.waitForVisible(
        this.page.getByRole("menu"),
        "Page-level Actions menu",
      );
    });
  }

  /**
   * Assert all 3 page-level action menu items are visible.
   * Call openPageActionsMenu() first.
   */
  async assertAllPageActionItems(): Promise<void> {
    await this.step(
      "Assert all 3 page-level action items visible (Rename, Copy link, Add subpage)",
      async () => {
        await expect(this.renameMenuItem).toBeVisible();
        await expect(this.copyLinkMenuItem).toBeVisible();
        await expect(this.addSubpageMenuItem).toBeVisible();
      },
    );
  }

  // ── Add subpage ────────────────────────────────────────────────────────────

  /**
   * Click "Add subpage" from the page-level Actions menu.
   * Expects the menu to already be open.
   */
  async clickAddSubpage(): Promise<void> {
    await this.step("Click 'Add subpage' in page Actions menu", async () => {
      await this.click(this.addSubpageMenuItem, "Add subpage menu item");
    });
  }

  /**
   * Fill the subpage name in the "Create new subpage" modal and submit.
   *
   * ⚠️  Confirmed 2026-05-25: "Add subpage" opens a MODAL DIALOG
   *     (NOT an inline input in the page tree).
   *
   *     Dialog: role="dialog", name="Create new subpage under <parentName>"
   *     Contents:
   *       - textbox "Page title" (required, 0/48 counter)
   *       - textbox "URL" (disabled — auto-generated slug)
   *       - checkbox "Don't show this page in the left navigation" (disabled)
   *       - button "Cancel" | button "Create page" (disabled until title entered)
   *
   *     We scope the textbox locator to the dialog to avoid matching the
   *     disabled "URL" textbox or any other inputs on the page.
   *
   * @param name - Subpage title (use faker.lorem.words(2) for uniqueness).
   */
  async fillSubpageName(name: string): Promise<void> {
    await this.step(`Fill subpage name: "${name}"`, async () => {
      // Wait for the "Create new subpage" dialog to appear
      const dialog = this.page.getByRole("dialog", { name: /Create new subpage/i });
      await dialog.waitFor({ state: "visible", timeout: 15_000 });

      // Fill the "Page title" textbox (scoped to dialog — avoids URL input ambiguity)
      const titleInput = dialog.getByRole("textbox", { name: "Page title" });
      await this.fill(titleInput, name, "Subpage page title");

      // Click "Create page" — becomes enabled once a title is entered
      const createBtn = dialog.getByRole("button", { name: "Create page" });
      await createBtn.waitFor({ state: "visible", timeout: 10_000 });
      await this.click(createBtn, "Create page (create subpage)");

      // Wait for dialog to dismiss
      await this.waitForHidden(dialog, "Create subpage dialog (dismissed)");
    });
  }

  /**
   * Full sequence to add a subpage to the active page:
   *   1. Open Actions menu
   *   2. Click Add subpage
   *   3. Fill subpage name
   *
   * @param parentName - Parent page name (for logging).
   * @param childName  - Child page title to create.
   */
  async addSubpageTo(parentName: string, childName: string): Promise<void> {
    await this.step(
      `Add subpage "${childName}" under "${parentName}"`,
      async () => {
        await this.openPageActionsMenu(parentName);
        await this.clickAddSubpage();
        await this.fillSubpageName(childName);
      },
    );
  }

  // ── Rename ─────────────────────────────────────────────────────────────────

  async clickRename(): Promise<void> {
    await this.step("Click 'Rename' in page Actions menu", async () => {
      await this.click(this.renameMenuItem, "Rename menu item");
    });
  }

  async clickCopyLink(): Promise<void> {
    await this.step("Click 'Copy link' in page Actions menu", async () => {
      await this.click(this.copyLinkMenuItem, "Copy link menu item");
    });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Assert a page with the given name is visible in the Pages tab tree.
   * @param pageName - Exact or partial page name.
   */
  async assertPageInTree(pageName: string): Promise<void> {
    await this.step(
      `Assert page "${pageName}" is visible in the Pages tree`,
      async () => {
        await expect(
          this.page.getByRole("button", { name: pageName }),
        ).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  /**
   * Assert a child (subpage) is nested under its parent in the Pages tree.
   * Both names must be visible in the panel simultaneously.
   *
   * @param parentName - Parent page name.
   * @param childName  - Subpage name.
   */
  async assertSubpageInTree(parentName: string, childName: string): Promise<void> {
    await this.step(
      `Assert subpage "${childName}" is nested under "${parentName}" in the Pages tree`,
      async () => {
        // Both parent and child page names should be visible in the panel
        await expect(
          this.page.getByRole("button", { name: parentName }),
        ).toBeVisible({ timeout: 10_000 });
        await expect(
          this.page.getByRole("button", { name: childName }),
        ).toBeVisible({ timeout: 10_000 });
      },
    );
  }
}
