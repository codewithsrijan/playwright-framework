// spec: specs-UHS-17045/spec.md (SC-06, re-scoped from filter validation)
// AC: AC-06 — Columns picker verified: hide, show, and toggle-all column visibility confirmed.
//
// Re-scope rationale: No row-level filter panel exists on the Page Builder list page in
// the current BETA. SC-06 is re-scoped to validate the Columns picker (Columns tab at the
// base of the data grid). (ODQ-02 resolved 2026-05-25)

import { test, expect } from "../../fixtures/allureFixtures";
import { PageBuilderListPage } from "../../pageObjects/PageBuilder/PageBuilderListPage.page";
import { Reporter } from "../../utils/Reporter";

/** All default column headers on the Page Builder list page. */
const DEFAULT_COLUMNS = ["Name", "Status", "Type", "Modified Date", "Created By"] as const;
type ColumnName = typeof DEFAULT_COLUMNS[number];

/**
 * Columns that can be toggled on/off via the Columns picker panel.
 * "Name" is the pinned auto-group column and is NOT included in the toggle list —
 * it cannot be hidden and does not appear in the AG Grid Columns panel.
 * Confirmed live 2026-05-25.
 */
const TOGGLEABLE_COLUMNS = ["Status", "Type", "Modified Date", "Created By"] as const;

let listPage: PageBuilderListPage;

test.beforeEach(async ({ page }) => {
  listPage = new PageBuilderListPage(page);
  await listPage.navigateDirectly();
});

test.describe("SC-06: Page Builder — Columns picker validation", () => {
  test(
    "PB-06a: All default column visibility toggles are present in the Columns picker",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-06: Columns picker validation");
      await Reporter.setSeverity("normal");

      await listPage.openColumnsTab();
      await listPage.assertAllColumnTogglesVisible();
    },
  );

  test(
    "PB-06b: Hide and re-show a single column — Status column visibility toggle",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-06: Columns picker validation");
      await Reporter.setSeverity("normal");

      const columnUnderTest: ColumnName = "Status";

      // ── Open Columns picker ────────────────────────────────────────────────
      await listPage.openColumnsTab();

      // ── Assert column is currently visible ────────────────────────────────
      await listPage.assertColumnVisible(columnUnderTest);

      // ── Hide the column ────────────────────────────────────────────────────
      await listPage.toggleColumnVisibility(columnUnderTest);
      await listPage.assertColumnHidden(columnUnderTest);

      // ── Re-show the column ─────────────────────────────────────────────────
      await listPage.toggleColumnVisibility(columnUnderTest);
      await listPage.assertColumnVisible(columnUnderTest);
    },
  );

  test(
    "PB-06c: 'Toggle All Columns Visibility' hides and shows all columns at once",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-06: Columns picker validation");
      await Reporter.setSeverity("normal");

      // ── Assert all columns are initially visible ───────────────────────────
      await listPage.assertAllDefaultColumnsVisible();

      // ── Open Columns picker ────────────────────────────────────────────────
      await listPage.openColumnsTab();

      // ── Toggle all OFF ─────────────────────────────────────────────────────
      await listPage.toggleAllColumnsVisibility();

      // The 4 toggleable column headers should now be hidden.
      // "Name" is excluded — it is the pinned auto-group column and cannot be hidden.
      for (const col of TOGGLEABLE_COLUMNS) {
        await listPage.assertColumnHidden(col);
      }

      // ── Toggle all ON ──────────────────────────────────────────────────────
      await listPage.toggleAllColumnsVisibility();

      // All 5 column headers should be visible again
      await listPage.assertAllDefaultColumnsVisible();
    },
  );
});
