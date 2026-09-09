import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";

/**
 * PageBuilderListPage — /admin/landing-pages
 *
 * Covers:
 *  - Navigation to the Page Builder list via the Learning side-nav
 *  - Direct URL navigation (fast path for test setup)
 *  - New page creation via the "Get started" (Academy Experience) modal
 *  - Row-level Actions menu: Publish | Rename | Preview | Delete | Duplicate
 *  - Delete confirmation dialog (alertdialog role)
 *  - Columns picker (Columns tab): show / hide / toggle-all column visibility
 *  - Grid assertions (row present, column header visible/hidden)
 *
 * Locator strategy:
 *   1st priority: data-marker attributes
 *   2nd priority: getByRole / getByLabel
 *   3rd priority: CSS id (only for modal form fields)
 *   Avoid: hashed CSS-Module class names (change on every build)
 *
 * ⚠️  BETA constraints (confirmed 2026-05-25):
 *   - No filter/search panel on the list page — only column picker
 *   - Row Actions button has data-marker="Actions"
 *   - Page table uses [role="treegrid"] NOT AG Grid
 *   - URL: /admin/landing-pages (NOT /admin/page-builder)
 */
export class PageBuilderListPage extends BasePage {
  // ── Learning-nav link ──────────────────────────────────────────────────────
  /**
   * Learning menu accordion — same pattern as AdminHomePage.navigateToAssignments().
   * Keep duplicated here so PageBuilderListPage can be used without AdminHomePage.
   */
  private readonly learningMenu = this.page.locator('//*[@id="learningMainMenu"]');
  private readonly pageBuilderNavLink = this.page.locator('[data-marker="pageBuilder"]');

  // ── Data table ─────────────────────────────────────────────────────────────
  private readonly dataTable = this.page.locator(
    '[data-marker="flexibleDataTableContainer"]',
  );

  // ── Create page modal ───────────────────────────────────────────────────────
  private readonly getStartedBtn = this.page.locator('[data-marker="getStartedBtn"]');
  private readonly pageTitleInput = this.page.locator("#pageTitle");
  private readonly createPageBtn = this.page.getByRole("button", { name: "Create page" });

  // ── Row actions ─────────────────────────────────────────────────────────────
  // Use .first() — the page may have a second [role="menu"] element (e.g. nested submenu).
  // The primary Actions dropdown has aria-label "Actions menu with options: …"
  private readonly openActionsMenu = this.page
    .getByRole("menu", { name: /Actions menu/i })
    .or(this.page.getByRole("menu").first())
    .first();

  // ── Delete confirmation dialog ─────────────────────────────────────────────
  // Confirmed 2026-05-25: Delete uses [role="dialog"] named "Delete <pageName>",
  // NOT [role="alertdialog"]. The "alertdialog" pattern is used only for the
  // Publish wizard "Leave without saving?" cancel flow.
  private readonly deleteDialog = this.page.getByRole("dialog", {
    name: /^Delete /i,
  });
  private readonly confirmDeleteBtn = this.page.getByRole("button", {
    name: "Yes, delete",
  });
  // "Close" (×) button cancels the delete dialog without deleting
  private readonly closeDialogBtn = this.page
    .getByRole("button", { name: "Close" })
    .or(this.page.getByRole("button", { name: /^Cancel$/i }))
    .first();

  // ── Columns picker ──────────────────────────────────────────────────────────
  private readonly columnsTab = this.page.getByRole("tab", { name: "Columns" });

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to Page Builder via the Learning side-nav menu.
   * Use this when starting from the admin home / a different section.
   */
  async navigateViaMenu(): Promise<void> {
    await this.step("Navigate to Page Builder via Learning menu", async () => {
      await this.click(this.learningMenu, "Learning Menu");
      await this.click(this.pageBuilderNavLink, "Page Builder nav link");
      await this.page.waitForURL(/\/admin\/landing-pages/, { timeout: 30_000 });
    });
  }

  /**
   * Navigate directly to /admin/landing-pages.
   * Fastest route — use in beforeEach for speed.
   */
  async navigateDirectly(): Promise<void> {
    await this.step("Navigate directly to Page Builder list (/admin/landing-pages)", async () => {
      await this.navigateTo("/admin/landing-pages");
      await this.page.waitForURL(/\/admin\/landing-pages/, { timeout: 30_000 });
    });
  }

  // ── Create page ─────────────────────────────────────────────────────────────

  /**
   * Open the "Get started" modal (Academy Experience template).
   * Only one template is live in current BETA; the other two are "Coming soon".
   */
  async clickGetStarted(): Promise<void> {
    await this.step("Click 'Get started' (Academy Experience template)", async () => {
      await this.click(this.getStartedBtn, "Get started button");
      await this.waitForVisible(this.pageTitleInput, "Page title input in modal");
    });
  }

  /**
   * Create a new Page Builder page end-to-end:
   *   1. Click Get started
   *   2. Fill the title (max 48 chars)
   *   3. Click Create page
   *   4. Wait for editor to open (/admin/page-builder)
   *
   * @param title - Page title (use faker.lorem.words(3) for uniqueness).
   */
  async createNewPage(title: string): Promise<void> {
    await this.step(`Create new Page Builder page: "${title}"`, async () => {
      await this.clickGetStarted();
      await this.fill(this.pageTitleInput, title, "Page title");
      await this.click(this.createPageBtn, "Create page button");
      await this.page.waitForURL(/\/admin\/page-builder/, { timeout: 30_000 });
    });
  }

  // ── Row actions ─────────────────────────────────────────────────────────────

  /**
   * Open the kebab Actions menu for a specific page row.
   *
   * ⚠️  Treegrid DOM structure (confirmed 2026-05-25):
   *   The Page Builder treegrid stores Name cells and Actions buttons in SEPARATE
   *   rowgroups. Searching for [data-marker="Actions"] *inside* the name row yields
   *   nothing — the button is a sibling rowgroup at the same row index.
   *
   *   Strategy:
   *     1. Find the gridcell containing pageName and evaluate its row index within
   *        its parent rowgroup.
   *     2. Click the nth [data-marker="Actions"] button at that same index.
   *
   * @param pageName - Partial or full name visible in the Name column gridcell.
   */
  async openRowActionsMenu(pageName: string): Promise<void> {
    await this.step(`Open row Actions menu for "${pageName}"`, async () => {
      // Find the name-column gridcell for this page
      const nameCell = this.dataTable
        .getByRole("gridcell")
        .filter({ hasText: pageName })
        .first();
      await nameCell.waitFor({ state: "visible", timeout: 15_000 });

      // Determine the row's 0-based index within its parent rowgroup
      const rowIndex = await nameCell.evaluate((el: Element): number => {
        const row = el.closest('[role="row"]');
        if (!row) return 0;
        const rowgroup = row.closest('[role="rowgroup"]');
        if (!rowgroup) return 0;
        const siblings = Array.from(rowgroup.querySelectorAll('[role="row"]'));
        return siblings.indexOf(row as HTMLElement);
      });

      // Click the Actions button at the same row index in the Actions rowgroup
      const actionsBtn = this.dataTable
        .locator('[data-marker="Actions"]')
        .nth(rowIndex);
      await actionsBtn.waitFor({ state: "visible", timeout: 10_000 });
      await this.click(actionsBtn, `Actions button (row "${pageName}", index ${rowIndex})`);
      await this.waitForVisible(this.openActionsMenu, "[role=menu] dropdown");
    });
  }

  /**
   * Click a specific row action from the open Actions dropdown.
   * Call openRowActionsMenu() first.
   *
   * ⚠️  "Manage Access" was discovered as a 6th action during first test run (2026-05-25).
   *     Original spec listed 5 items; live app now shows 6.
   */
  async clickRowAction(
    action: "Publish" | "Rename" | "Preview" | "Manage Access" | "Delete" | "Duplicate",
  ): Promise<void> {
    await this.step(`Click row action: "${action}"`, async () => {
      await this.click(
        this.page.getByRole("menuitem", { name: action }),
        `"${action}" menu item`,
      );
    });
  }

  /**
   * Assert all 6 row action items are visible in the open menu.
   * Call openRowActionsMenu() first.
   *
   * Actions (confirmed live 2026-05-25): Publish | Rename | Preview | Manage Access | Delete | Duplicate
   */
  async assertAllRowActionItems(): Promise<void> {
    await this.step(
      "Assert all 6 row action items visible (Publish, Rename, Preview, Manage Access, Delete, Duplicate)",
      async () => {
        for (const action of [
          "Publish",
          "Rename",
          "Preview",
          "Manage Access",
          "Delete",
          "Duplicate",
        ]) {
          await expect(
            this.page.getByRole("menuitem", { name: action }),
          ).toBeVisible();
        }
      },
    );
  }

  // ── Delete confirmation dialog ───────────────────────────────────────────────

  /**
   * Assert the Delete confirmation dialog is visible.
   *
   * Dialog: [role="dialog"] named "Delete <pageName>"
   * Body:   "Deleting '...' will also delete its subpages. This cannot be undone. Are you sure?"
   * Buttons: "Yes, delete" | "Close" (×)
   *
   * ⚠️  This is NOT [role="alertdialog"] — that role is only used by the
   *     "Leave without saving?" Publish-wizard cancel dialog.
   */
  async assertDeleteConfirmationVisible(): Promise<void> {
    await this.step(
      "Assert Delete confirmation dialog visible (role=dialog, name='Delete …')",
      async () => {
        await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
        await expect(this.confirmDeleteBtn).toBeVisible();
      },
    );
  }

  /** Click "Yes, delete" to permanently delete the page. */
  async confirmDeleteAction(): Promise<void> {
    await this.step("Confirm delete — click 'Yes, delete'", async () => {
      await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
      await this.click(this.confirmDeleteBtn, "Yes, delete");
      await this.waitForHidden(this.deleteDialog, "Delete dialog (dismissed)");
    });
  }

  /** Click "Close" (×) to dismiss the Delete dialog without deleting. */
  async cancelDeleteAction(): Promise<void> {
    await this.step("Cancel delete — click 'Close' (×) button", async () => {
      await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
      await this.click(this.closeDialogBtn, "Close (cancel delete)");
      await this.waitForHidden(this.deleteDialog, "Delete dialog (dismissed)");
    });
  }

  // ── Rename modal ────────────────────────────────────────────────────────────

  /**
   * After clicking the Rename row action, assert the "Rename page" modal dialog
   * is visible and its "Page title" input is populated.
   *
   * ⚠️  Confirmed 2026-05-25: Rename opens a MODAL DIALOG (role="dialog",
   *     name="Rename page"), NOT an inline text edit in the grid row.
   *
   * Dialog contents:
   *   - textbox "Page title" (pre-filled with current name, max 48 chars)
   *   - textbox "URL" (disabled — auto-generated slug)
   *   - combobox "Permission"
   *   - checkbox "Don't show this page in the left navigation"
   *   - button "Cancel" | button "Rename" (disabled until title is changed)
   */
  async assertRenameInputVisible(): Promise<void> {
    await this.step(
      "Assert Rename page modal dialog is visible with Page title input",
      async () => {
        const renameDialog = this.page.getByRole("dialog", { name: "Rename page" });
        await this.waitForVisible(renameDialog, "Rename page dialog");
        // The "Page title" textbox is pre-filled with the current name
        const pageTitleInput = renameDialog.getByRole("textbox", { name: "Page title" });
        await expect(pageTitleInput).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  /**
   * Close the "Rename page" modal without saving — clicks Cancel.
   * Call after assertRenameInputVisible() when you don't want to rename.
   */
  async cancelRenameDialog(): Promise<void> {
    await this.step("Cancel Rename page dialog without saving", async () => {
      const renameDialog = this.page.getByRole("dialog", { name: "Rename page" });
      await this.waitForVisible(renameDialog, "Rename page dialog");
      await this.click(
        renameDialog.getByRole("button", { name: "Cancel" }),
        "Cancel rename button",
      );
      await this.waitForHidden(renameDialog, "Rename dialog (dismissed)");
    });
  }

  // ── Columns picker ───────────────────────────────────────────────────────────

  async openColumnsTab(): Promise<void> {
    await this.step("Open the Columns picker tab", async () => {
      await this.click(this.columnsTab, "Columns tab");
    });
  }

  /**
   * Assert that the Columns picker panel shows all expected column toggles.
   *
   * ⚠️  Confirmed 2026-05-25: "Name" is NOT in the column toggle list — it is
   *     the pinned auto-group column and cannot be hidden. The panel lists
   *     only: Status | Type | Modified Date | Created By.
   */
  async assertAllColumnTogglesVisible(): Promise<void> {
    await this.step(
      "Assert 4 column visibility toggles present in Columns panel (Status, Type, Modified Date, Created By)",
      async () => {
        for (const col of [
          "Status",
          "Type",
          "Modified Date",
          "Created By",
        ]) {
          const toggle = this.columnToggle(col);
          await expect(toggle).toBeVisible({ timeout: 10_000 });
        }
      },
    );
  }

  /**
   * Toggle visibility for a named column.
   * Requires openColumnsTab() to have been called first.
   *
   * @param columnName - Exact column label (e.g. "Status", "Modified Date")
   */
  async toggleColumnVisibility(columnName: string): Promise<void> {
    await this.step(
      `Toggle visibility for column "${columnName}"`,
      async () => {
        const toggle = this.columnToggle(columnName);
        await toggle.waitFor({ state: "visible", timeout: 10_000 });
        await toggle.click();
      },
    );
  }

  /**
   * Click the "Toggle All Columns Visibility" master checkbox.
   * Toggles all columns on or off in a single click.
   */
  async toggleAllColumnsVisibility(): Promise<void> {
    await this.step("Click 'Toggle All Columns Visibility' checkbox", async () => {
      const toggleAll = this.page
        .getByRole("checkbox", { name: /toggle all columns visibility/i })
        .or(this.page.getByLabel(/toggle all/i))
        .first();
      await toggleAll.waitFor({ state: "visible", timeout: 10_000 });
      await toggleAll.click();
    });
  }

  // ── Grid header assertions ───────────────────────────────────────────────────

  async assertColumnVisible(columnName: string): Promise<void> {
    await this.step(
      `Assert column "${columnName}" header is visible in the data grid`,
      async () => {
        await expect(
          this.page.getByRole("columnheader", {
            name: new RegExp(columnName, "i"),
          }),
        ).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  async assertColumnHidden(columnName: string): Promise<void> {
    await this.step(
      `Assert column "${columnName}" header is hidden from the data grid`,
      async () => {
        await expect(
          this.page.getByRole("columnheader", {
            name: new RegExp(columnName, "i"),
          }),
        ).toBeHidden({ timeout: 10_000 });
      },
    );
  }

  async assertAllDefaultColumnsVisible(): Promise<void> {
    await this.step(
      "Assert all 5 default column headers visible (Name, Status, Type, Modified Date, Created By)",
      async () => {
        for (const col of [
          "Name",
          "Status",
          "Type",
          "Modified Date",
          "Created By",
        ]) {
          await expect(
            this.page.getByRole("columnheader", {
              name: new RegExp(col, "i"),
            }),
          ).toBeVisible();
        }
      },
    );
  }

  // ── Row assertions ───────────────────────────────────────────────────────────

  /**
   * Assert a page row with the given name is present in the list.
   * @param pageName - Title visible in the Name column.
   */
  async assertRowPresent(pageName: string): Promise<void> {
    await this.step(
      `Assert page "${pageName}" is present in the Page Builder list`,
      async () => {
        await expect(
          this.dataTable.getByRole("row").filter({ hasText: pageName }),
        ).toBeVisible({ timeout: 15_000 });
      },
    );
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  /**
   * Locate the column visibility toggle checkbox in the AG Grid Columns panel.
   *
   * ⚠️  Confirmed 2026-05-25: ALL column checkboxes share the same accessible
   *     name "Press SPACE to toggle visibility (visible)" — the column name is
   *     displayed as text NEXT TO the checkbox inside a treeitem. Therefore we
   *     cannot use getByRole("checkbox", { name: /ColumnName/ }) — instead we
   *     scope to the treeitem that contains the column name text, then select
   *     the checkbox inside it.
   *
   *     DOM: tabpanel "Columns" > tree > treeitem "<ColName> Column" > checkbox
   */
  private columnToggle(columnName: string): Locator {
    return this.page
      .getByRole("tabpanel", { name: "Columns" })
      .getByRole("treeitem")
      .filter({ hasText: new RegExp(columnName, "i") })
      .getByRole("checkbox");
  }
}
