// spec: specs-UHS-17045/spec.md (SC-02)
// AC: AC-02 — Parent page with at least one child page created; hierarchy visible in tree.

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

test.describe("SC-02: Page Builder — Multi-level page creation", () => {
  test(
    "PB-02: Create a parent page with a child subpage and verify the hierarchy in the Pages tree",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-02: Multi-level page creation");
      await Reporter.setSeverity("critical");

      const parentName = `PB Parent ${faker.lorem.words(2)} ${Date.now()}`;
      const childName  = `PB Child ${faker.lorem.words(2)}`;

      // ── Create parent page ───────────────────────────────────────────────────
      await listPage.createNewPage(parentName);
      await editorPage.waitForEditorLoad();

      // ── Switch to Pages tab ─────────────────────────────────────────────────
      await editorPage.switchToPagesTab();

      // ── Assert parent page is visible in tree ───────────────────────────────
      await pagesPanel.assertPageInTree(parentName);

      // ── Add subpage under parent ─────────────────────────────────────────────
      await pagesPanel.addSubpageTo(parentName, childName);

      // ── Assert parent-child hierarchy in Pages tree ──────────────────────────
      await pagesPanel.assertSubpageInTree(parentName, childName);

      // ── Verify parent page visible in list ──────────────────────────────────
      // Note: subpage creation via the modal persists immediately; Save is not needed.
      await editorPage.goBackToList();
      await listPage.assertRowPresent(parentName);
    },
  );
});
