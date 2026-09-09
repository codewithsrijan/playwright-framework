// spec: specs-UHS-17045/spec.md (SC-05)
// AC: AC-05 — All action menu options verified (list-page row actions + editor page-level actions);
//             Delete confirmation dialog tested; no destructive actions executed.

import { test, expect } from "../../fixtures/allureFixtures";
import { faker } from "@faker-js/faker";
import { PageBuilderListPage } from "../../pageObjects/PageBuilder/PageBuilderListPage.page";
import { PageBuilderEditorPage } from "../../pageObjects/PageBuilder/PageBuilderEditorPage.page";
import { PageBuilderPagesPanel } from "../../pageObjects/PageBuilder/PageBuilderPagesPanel.page";
import { Reporter } from "../../utils/Reporter";

let listPage: PageBuilderListPage;
let editorPage: PageBuilderEditorPage;
let pagesPanel: PageBuilderPagesPanel;

test.beforeEach(async ({ page }) => {
  listPage = new PageBuilderListPage(page);
  editorPage = new PageBuilderEditorPage(page);
  pagesPanel = new PageBuilderPagesPanel(page);
  await listPage.navigateDirectly();
});

test.describe("SC-05: Page Builder — Action menu validation", () => {
  test(
    "PB-05a: Verify all 5 row-level actions on the Page Builder list page",
    async ({ page }) => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-05: Action menu validation");
      await Reporter.setSeverity("critical");

      const pageName = `PB Actions ${faker.lorem.words(2)} ${Date.now()}`;

      // ── Create a page so the list has at least one row ─────────────────────
      await listPage.createNewPage(pageName);
      await editorPage.waitForEditorLoad();
      await editorPage.goBackToList();

      // ── Open row Actions menu ──────────────────────────────────────────────
      await listPage.openRowActionsMenu(pageName);

      // ── Assert all 6 actions are present ──────────────────────────────────
      // (Publish, Rename, Preview, Manage Access, Delete, Duplicate)
      await listPage.assertAllRowActionItems();

      // ── Test destructive action: Delete → must show confirmation ───────────
      await listPage.clickRowAction("Delete");
      await listPage.assertDeleteConfirmationVisible();

      // Cancel — do not actually delete
      await listPage.cancelDeleteAction();

      // ── Assert the page is still in the list after cancel ─────────────────
      await listPage.assertRowPresent(pageName);

      // ── Test Rename: opens "Rename page" modal dialog ─────────────────────
      await listPage.openRowActionsMenu(pageName);
      await listPage.clickRowAction("Rename");
      await listPage.assertRenameInputVisible();

      // Cancel (do not rename — avoids side effects on later assertions)
      await listPage.cancelRenameDialog();
    },
  );

  test(
    "PB-05b: Verify all 3 editor page-level actions in the Pages tab",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-05: Action menu validation");
      await Reporter.setSeverity("critical");

      const pageName = `PB Editor Actions ${faker.lorem.words(2)} ${Date.now()}`;

      // ── Create page and open in editor ────────────────────────────────────
      await listPage.createNewPage(pageName);
      await editorPage.waitForEditorLoad();

      // ── Switch to Pages tab ───────────────────────────────────────────────
      await editorPage.switchToPagesTab();

      // ── Open page-level Actions menu ──────────────────────────────────────
      await pagesPanel.openPageActionsMenu(pageName);

      // ── Assert all 3 editor page-level actions ────────────────────────────
      await pagesPanel.assertAllPageActionItems();
    },
  );
});
