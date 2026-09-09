/**
 * spec: specs/plan-admin-view-users-audience-management.md
 * seed: tests/ucm-manual3-aws/entry-and-login.spec.ts, manual3Auth.ts
 *
 * Generator: [.github/agents/playwright-test-generator.agent.md](../../.github/agents/playwright-test-generator.agent.md)
 * Rules: [.cursor/rules/playwright-agents.mdc](../../.cursor/rules/playwright-agents.mdc)
 *
 * Maps plan §A–D and §E1–E3. Set `UCM_MANUAL3_AUDIENCES_GOTO` to skip UI nav (plan §C — direct URL).
 */
import { allure } from "allure-playwright";
import { test, expect } from "../../fixtures/loginFixture";
import { attachViewportPng } from "../../utils/playwright/screenshotAttach";
import {
  loginAsManual3Admin,
  manual3FrontendConfig,
} from "./manual3Auth";
import {
  goToAudienceManagementViaQuickLinks,
  goToAudienceManagementViaSiteNav,
} from "./audienceNavigation";

/** Plan §D1 — `/admin/audiences` with a visible `<main>` (list, empty state, or actions may vary). */
async function expectAudienceManagementShell(page: import("@playwright/test").Page): Promise<void> {
  await expect(page).toHaveURL(/\/admin\/audiences/i, { timeout: 120_000 });
  await expect(page.getByRole("main")).toBeVisible({ timeout: 60_000 });
}

test.describe("ucm-manual3-aws — Admin view → Audience Management", () => {
  test.beforeEach(async () => {
    await allure.epic("UCM");
    await allure.feature("Admin — Audience Management");
    await allure.tag("manual3-aws");
  });

  test("E1 — opens Audience Management via Site Navigation → Users → Audience Management", async ({
    page,
    loginFixture,
  }) => {
    const testInfo = test.info();

    const cfg = await test.step("§A — Login (manual3 admin)", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    await test.step("§B1 — Admin shell affordances", async () => {
      await expect(
        page.getByRole("button", { name: /site navigation/i }),
      ).toBeVisible({ timeout: 30_000 });
    });

    await test.step("§C — Site Navigation → Users → Audience Management", async () => {
      await goToAudienceManagementViaSiteNav(page, cfg);
    });

    await test.step("§D1 — Audience Management page shell", async () => {
      await expectAudienceManagementShell(page);
    });

    await test.step("Attach exploration screenshot", async () => {
      await attachViewportPng(
        page,
        testInfo,
        "E1 — Audience Management page (Site Navigation → Users → Audience Management)",
      );
    });
  });

  test("E2 — opens Audience Management via My Dashboard → My Quick Links", async ({
    page,
    loginFixture,
  }) => {
    const testInfo = test.info();

    const cfg = await test.step("§A — Login (manual3 admin)", async () =>
      loginAsManual3Admin(page, loginFixture),
    );

    await test.step("§C-alt — My Quick Links", async () => {
      await goToAudienceManagementViaQuickLinks(page, cfg);
    });

    await test.step("§D1 — Audience Management page shell", async () => {
      await expectAudienceManagementShell(page);
    });

    await test.step("Attach exploration screenshot", async () => {
      await attachViewportPng(
        page,
        testInfo,
        "E2 — Audience Management page (My Quick Links)",
      );
    });
  });

  test("E3 — unauthenticated deep link to /admin/audiences returns to login", async ({
    browser,
  }) => {
    const testInfo = test.info();
    const cfg = manual3FrontendConfig();
    const base = cfg.url.replace(/\/$/, "");
    const context = await browser.newContext();
    const page = await context.newPage();

    await test.step("Deep link without session", async () => {
      await page.goto(`${base}/admin/audiences`, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/login/i, { timeout: 60_000 });
    });

    await test.step("Attach screenshot", async () => {
      await attachViewportPng(
        page,
        testInfo,
        "E3 — Login shell after unauthenticated deep link to /admin/audiences",
      );
    });

    await context.close();
  });

  test.fixme(
    "E4 — learner user cannot open Audience Management (plan §E4 — needs learner credentials)",
    async () => {},
  );

  test.fixme(
    "E5 — empty tenant shows guided empty state (plan §E5 — needs isolated org or data setup)",
    async () => {},
  );
});
