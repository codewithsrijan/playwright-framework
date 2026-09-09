// spec: specs-UHS-17045/spec.md (SC-03)
// AC: AC-03 — Audience association saved and confirmed in Publish wizard review step.
//
// Pre-condition: "All Users" audience (4,237 users) exists in the develop org.
//               No seeding required (OQ-07 resolved 2026-05-25).
//
// Note: This test cancels at Step 5 review (does NOT publish) to avoid consuming
//       one of the 10 published-page slots. The audience association is verified
//       by asserting "All Users" is visible in the Step 5 review summary.

import { test, expect } from "../../fixtures/allureFixtures";
import { faker } from "@faker-js/faker";
import { PageBuilderListPage } from "../../pageObjects/PageBuilder/PageBuilderListPage.page";
import { PageBuilderEditorPage } from "../../pageObjects/PageBuilder/PageBuilderEditorPage.page";
import { PageBuilderPublishWizard } from "../../pageObjects/PageBuilder/PageBuilderPublishWizard.page";
import { Reporter } from "../../utils/Reporter";

/** Pre-existing audience name in the develop org. */
const EXISTING_AUDIENCE = "All Users";

let listPage: PageBuilderListPage;
let editorPage: PageBuilderEditorPage;
let wizard: PageBuilderPublishWizard;

test.beforeEach(async ({ page }) => {
  listPage = new PageBuilderListPage(page);
  editorPage = new PageBuilderEditorPage(page);
  wizard = new PageBuilderPublishWizard(page);
  await listPage.navigateDirectly();
});

test.describe("SC-03: Page Builder — Audience association via Publish wizard", () => {
  test(
    "PB-03: Associate the 'All Users' audience with a Page Builder page via the Publish wizard Step 3",
    async () => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-03: Audience association");
      await Reporter.setSeverity("critical");

      const pageName = `PB Audience ${faker.lorem.words(2)} ${Date.now()}`;

      // ── Create page ──────────────────────────────────────────────────────────
      await listPage.createNewPage(pageName);
      await editorPage.waitForEditorLoad();

      // ── Open Publish wizard ──────────────────────────────────────────────────
      await editorPage.clickPublish();
      await wizard.assertStep1Visible();

      // ── Step 1: Landing Page Details ──────────────────────────────────────────
      // Title is pre-filled from page creation; proceed without changes
      await wizard.proceedToStep2();

      // ── Step 2: Pages ─────────────────────────────────────────────────────────
      await wizard.proceedToStep3();

      // ── Step 3: Determine Visibility (Audience) ───────────────────────────────
      // Verify "All Users" is available in the audience list
      await wizard.assertAudienceInList(EXISTING_AUDIENCE);

      // Select "All Users" — but only if it is not already selected.
      // The develop org's wizard pre-selects "All Users" by default for new pages;
      // clicking the toggle when already selected would DESELECT it.
      if (!(await wizard.isAudienceAlreadySelected(EXISTING_AUDIENCE))) {
        await wizard.selectAudience(EXISTING_AUDIENCE);
      }

      // Verify it appears in the "Selected audiences" tab
      await wizard.switchToSelectedAudiencesTab();
      await wizard.assertAudienceInList(EXISTING_AUDIENCE);

      // ── Step 4: Default Homepage ──────────────────────────────────────────────
      await wizard.proceedToStep4();
      await wizard.setDefaultHomepage(false); // No — not the default homepage

      // ── Step 5: Review and Publish ────────────────────────────────────────────
      await wizard.proceedToStep5();
      await wizard.assertStep5ReviewVisible();

      // Assert "All Users" audience is shown in the review summary
      await wizard.assertAudienceInReview(EXISTING_AUDIENCE);

      // ── Cancel (do not publish — preserve published-page cap) ─────────────────
      await wizard.cancelAndLeave();

      // ── Verify we are back in the editor ─────────────────────────────────────
      await editorPage.assertEditorLoaded();
    },
  );
});
