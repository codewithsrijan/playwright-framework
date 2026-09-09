// spec: specs/plan-plat3-complete-admin-assignment-java-adminsw.md, specs/plan-admin-create-assignment-launch.md
// seed: seed.spec.ts (orchestrator / generator scaffold)

import { test, expect } from "../../fixtures/loginFixture";
import { AdminHomePage } from "../../pageObjects/AdminHomePage.page";
import { AssignmentsPage } from "../../pageObjects/Assignments/AssignmentsPage.page";
import { CreateAssignmentWizardPage } from "../../pageObjects/Assignments/CreateAssignmentWizard.page";

/**
 * Ignore `storageState` from the `chrome` project: saved cookies from setup often do not
 * authorize `/admin/assignments` (OAuth redirects to login). Fresh UI login per run fixes that.
 */
test.use({ storageState: { cookies: [], origins: [] } });

let adminHomePage: AdminHomePage;
let assignmentsPage: AssignmentsPage;

test.beforeEach(async ({ page, lognToPageFixture }) => {
  void lognToPageFixture;
  page.on("dialog", (dialog) => {
    void dialog.accept();
  });
  adminHomePage = new AdminHomePage(page);
  assignmentsPage = new AssignmentsPage(page);
});

function describeFields(titleSuffix: string) {
  return {
    title: `Auto Assignment ${titleSuffix} ${Date.now()}`,
    businessObjectiveTypeahead: "Engagement",
    categoryLabel: "Upskilling",
    description: "Automated assignment wizard scenario.",
    daysToComplete: "7",
  };
}

test.describe("HP-01: Create and launch — java, adminsw, Force order", () => {
  test("Create and launch assignment with java content, Force order, and adminsw", async ({
    page,
  }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await wizard.fillDescribeAssignment(describeFields("HP01"));
    await wizard.goToAddContentStep();

    await wizard.recordAddContentStepCheckboxInventory("before-add");

    await wizard.addFirstContentBySearch("java");

    await wizard.recordAddContentStepCheckboxInventory("after-first-content");

    await wizard.checkForceOrder();

    await wizard.goToAddUsersStep();
    await wizard.addUserBySearch("adminsw");

    await wizard.goToNotifyUsersStep();
    await wizard.goToReviewAndLaunchStep();
    await wizard.launchAssignment();

    await wizard.expectLaunchSuccess();
  });
});

test.describe("NG: Assignment wizard validation", () => {
  test("NG-01 — cannot proceed from Describe step with required fields empty", async ({
    page,
  }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await expect(wizard.nextAddContentButton()).toBeDisabled();
  });

  test("NG-02 — no content: cannot go to Add users and audiences", async ({
    page,
  }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await wizard.fillDescribeAssignment(describeFields("NG02"));
    await wizard.goToAddContentStep();

    await expect(wizard.nextAddUsersAndAudiencesButton()).toBeDisabled();
  });

  test("NG-03 — no user selected: cannot notify users", async ({ page }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await wizard.fillDescribeAssignment(describeFields("NG03"));
    await wizard.goToAddContentStep();
    await wizard.addFirstContentBySearch("java");
    await wizard.goToAddUsersStep();

    await wizard.openUsersAndAudiencesPicker();
    const dialog = page.getByRole("dialog", {
      name: "Search for users and audiences",
    });
    const done = dialog.getByRole("button", { name: "Done" });

    if (await done.isDisabled()) {
      await expect(done).toBeDisabled();
      return;
    }

    await done.click();
    await expect(wizard.nextNotifyUsersButton()).toBeDisabled();
  });

  test("NG-04 — user search returns no selectable rows", async ({ page }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await wizard.fillDescribeAssignment(describeFields("NG04"));
    await wizard.goToAddContentStep();
    await wizard.addFirstContentBySearch("java");
    await wizard.goToAddUsersStep();

    await wizard.openUsersAndAudiencesPicker();
    const dialog = page.getByRole("dialog", {
      name: "Search for users and audiences",
    });
    await dialog
      .getByRole("textbox", { name: "Search for users" })
      .fill("__no_such_user_zzzz__");
    await page.keyboard.press("Enter");

    await expect(
      dialog.getByRole("button", { name: "Select or deselect item" }),
    ).toHaveCount(0);
  });

  test("NG-05 — Force order enabled after first content item (when gated)", async ({
    page,
  }) => {
    const wizard = new CreateAssignmentWizardPage(page);

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.navigateToNewAssignment();

    await wizard.fillDescribeAssignment(describeFields("NG05"));
    await wizard.goToAddContentStep();

    const orderBefore = wizard.forceOrderCheckbox();
    const visibleBefore = await orderBefore.isVisible();
    const wasDisabledBeforeContent = visibleBefore
      ? await orderBefore.isDisabled()
      : true;

    await wizard.addFirstContentBySearch("java");
    await wizard.waitForContentOrderControlVisible();

    if (!visibleBefore) {
      await wizard.expectForceOrderCheckboxEnabled();
      return;
    }

    if (wasDisabledBeforeContent) {
      await wizard.expectForceOrderCheckboxEnabled();
    } else {
      await expect(wizard.forceOrderCheckbox()).toBeEnabled();
    }
  });
});
