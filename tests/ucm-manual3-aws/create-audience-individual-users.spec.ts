// spec: specs/plan-ucm-manual3-aws-create-audience-individual-users.md
// seed: seed.spec.ts

import { allure } from "allure-playwright";
import { test, expect } from "../../fixtures/loginFixture";
import { attachViewportPng } from "../../utils/playwright/screenshotAttach";
import { loginAsManual3Admin, manual3FrontendConfig } from "./manual3Auth";
import {
  goToAudienceManagementViaSiteNav,
  goToAudienceManagementViaQuickLinks,
} from "./audienceNavigation";
import { CreateAudiencePage } from "../../pageObjects/Audiences/CreateAudiencePage.page";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("ucm-manual3-aws — Create Audience with Individual Users", () => {
  test.beforeEach(async () => {
    await allure.epic("UCM");
    await allure.feature("Admin — Audience Management");
    await allure.tag("manual3-aws");
  });

  // ─── HP-01 ────────────────────────────────────────────────────────────────

  test("HP-01 — admin creates audience with 2 individual users via Site Navigation", async ({
    page,
    loginFixture,
  }) => {
    const testInfo = test.info();

    // §A — Login
    const cfg = await test.step("§A — Login as manual3 admin", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    // §B — Navigate: Site Navigation → Users → Audience Management
    await test.step("§B — Site Navigation → Users → Audience Management", async () => {
      await goToAudienceManagementViaSiteNav(page, cfg);
      await expect(page).toHaveURL(/\/admin\/audiences/i, { timeout: 60_000 });
      await expect(page.getByRole("main")).toBeVisible({ timeout: 30_000 });
    });

    const audiencePage = new CreateAudiencePage(page);
    const uniqueName = `E2E Audience Individual ${Date.now()}`;

    // §C — Open create audience form
    await test.step("§C — Open Create Audience", async () => {
      await audiencePage.openCreateAudience();
    });

    // §D — Fill audience name and select individual users type
    await test.step("§D — Fill name and select Individual users type", async () => {
      await audiencePage.fillAudienceName(uniqueName);
      await audiencePage.selectIndividualUsersType();
    });

    // §E — Add first user
    await test.step("§E — Search and add first user", async () => {
      await audiencePage.searchAndAddUser("admin");
    });

    // §E — Add second user
    await test.step("§E — Search and add second user", async () => {
      await audiencePage.searchAndAddUser("user");
    });

    // §F — Save and verify
    await test.step("§F — Save audience", async () => {
      await audiencePage.saveAudience();
    });

    await test.step("§F — Assert audience visible in list", async () => {
      await audiencePage.expectAudienceVisible(uniqueName);
    });

    await test.step("Attach screenshot", async () => {
      await attachViewportPng(
        page,
        testInfo,
        "HP-01 — Audience created with 2 individual users (Site Navigation)",
      );
    });
  });

  // ─── HP-02 ────────────────────────────────────────────────────────────────

  test("HP-02 — admin creates audience with 2 individual users via My Quick Links", async ({
    page,
    loginFixture,
  }) => {
    const testInfo = test.info();

    // §A — Login
    const cfg = await test.step("§A — Login as manual3 admin", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    // §B-alt — Navigate via My Dashboard → My Quick Links
    await test.step("§B-alt — My Dashboard → My Quick Links → Audience Management", async () => {
      await goToAudienceManagementViaQuickLinks(page, cfg);
      await expect(page).toHaveURL(/\/admin\/audiences/i, { timeout: 60_000 });
      await expect(page.getByRole("main")).toBeVisible({ timeout: 30_000 });
    });

    const audiencePage = new CreateAudiencePage(page);
    const uniqueName = `E2E Audience QLinks ${Date.now()}`;

    // §C — Open create audience form
    await test.step("§C — Open Create Audience", async () => {
      await audiencePage.openCreateAudience();
    });

    // §D — Fill details
    await test.step("§D — Fill name and select Individual users type", async () => {
      await audiencePage.fillAudienceName(uniqueName);
      await audiencePage.selectIndividualUsersType();
    });

    // §E — Add 2 users
    await test.step("§E — Search and add first user", async () => {
      await audiencePage.searchAndAddUser("admin");
    });

    await test.step("§E — Search and add second user", async () => {
      await audiencePage.searchAndAddUser("user");
    });

    // §F — Save and verify
    await test.step("§F — Save audience and assert visible", async () => {
      await audiencePage.saveAudience();
      await audiencePage.expectAudienceVisible(uniqueName);
    });

    await test.step("Attach screenshot", async () => {
      await attachViewportPng(
        page,
        testInfo,
        "HP-02 — Audience created with 2 individual users (Quick Links)",
      );
    });
  });

  // ─── NG-01 ────────────────────────────────────────────────────────────────

  test("NG-01 — cannot save audience with empty name", async ({
    page,
    loginFixture,
  }) => {
    // §A — Login
    const cfg = await test.step("§A — Login as manual3 admin", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    // §B — Navigate
    await test.step("§B — Navigate to Audience Management", async () => {
      await goToAudienceManagementViaSiteNav(page, cfg);
    });

    const audiencePage = new CreateAudiencePage(page);

    // §C — Open form, leave name blank
    await test.step("§C — Open Create Audience", async () => {
      await audiencePage.openCreateAudience();
    });

    // §D — Assert save is blocked with no name entered
    await test.step("§D — Assert Save is blocked (empty name)", async () => {
      await audiencePage.expectSaveBlocked();
    });
  });

  // ─── NG-02 ────────────────────────────────────────────────────────────────

  test("NG-02 — cannot save audience with individual users type selected but no users added", async ({
    page,
    loginFixture,
  }) => {
    // §A — Login
    const cfg = await test.step("§A — Login as manual3 admin", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    // §B — Navigate
    await test.step("§B — Navigate to Audience Management", async () => {
      await goToAudienceManagementViaSiteNav(page, cfg);
    });

    const audiencePage = new CreateAudiencePage(page);

    // §C — Open form
    await test.step("§C — Open Create Audience", async () => {
      await audiencePage.openCreateAudience();
    });

    // §D — Fill name, select individual users type, add no users
    await test.step("§D — Fill name and select Individual users type", async () => {
      await audiencePage.fillAudienceName(`E2E NG02 ${Date.now()}`);
      await audiencePage.selectIndividualUsersType();
    });

    // §D — Assert save is blocked (no users selected)
    await test.step("§D — Assert Save is blocked (no users selected)", async () => {
      await audiencePage.expectSaveBlocked();
    });
  });

  // ─── NG-03 ────────────────────────────────────────────────────────────────

  test("NG-03 — user search returns no results for unknown query", async ({
    page,
    loginFixture,
  }) => {
    // §A — Login
    const cfg = await test.step("§A — Login as manual3 admin", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    // §B — Navigate
    await test.step("§B — Navigate to Audience Management", async () => {
      await goToAudienceManagementViaSiteNav(page, cfg);
    });

    const audiencePage = new CreateAudiencePage(page);

    // §C — Open form
    await test.step("§C — Open Create Audience", async () => {
      await audiencePage.openCreateAudience();
    });

    // §D — Activate user search (select individual users type if available)
    await test.step("§D — Select Individual users type", async () => {
      await audiencePage.selectIndividualUsersType();
    });

    // §E — Search non-existent user and assert empty results
    await test.step("§E — Search non-existent user; assert no results", async () => {
      await audiencePage.searchUsers("__no_such_user_zzzz__");
      await audiencePage.expectUserSearchEmpty();
    });
  });

  // ─── NG-04 ────────────────────────────────────────────────────────────────

  test.fixme(
    "NG-04 — duplicate audience name shows validation error (requires pre-existing audience in tenant)",
    async ({ page, loginFixture }) => {
      const cfg = await loginAsManual3Admin(page, loginFixture);
      await goToAudienceManagementViaSiteNav(page, cfg);

      const audiencePage = new CreateAudiencePage(page);
      await audiencePage.openCreateAudience();

      const duplicateName = process.env.EXISTING_AUDIENCE_NAME ?? "E2E Audience";
      await audiencePage.fillAudienceName(duplicateName);
      await audiencePage.selectIndividualUsersType();
      await audiencePage.searchAndAddUser("admin");
      await audiencePage.saveAudience();

      await expect(
        page.getByText(/duplicate|already exists|name.*taken/i),
      ).toBeVisible({ timeout: 15_000 });
    },
  );

  // ─── NG-05 ────────────────────────────────────────────────────────────────

  test("NG-05 — unauthenticated access to /admin/audiences redirects to login", async ({
    browser,
  }) => {
    const cfg = manual3FrontendConfig();
    const base = cfg.url.replace(/\/$/, "");
    const context = await browser.newContext();
    const page = await context.newPage();

    await test.step("Navigate to /admin/audiences without a session", async () => {
      await page.goto(`${base}/admin/audiences`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page).toHaveURL(/login/i, { timeout: 60_000 });
    });

    await context.close();
  });
});
