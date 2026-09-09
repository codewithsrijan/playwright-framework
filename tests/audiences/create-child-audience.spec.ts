/**
 * PR: HardRoc/ucm2 #8783 — child audience for automated audience.
 * Plan: specs/plan-pr-8783-child-audience.md
 * Context: specs/pr-8783-context.md
 *
 * Override base URL: `UCM2_BASE_URL=...` (defaults to UCM2 develop below).
 * Search string: `AUTOMATED_AUDIENCE_NAME` (name of an automated audience in the org).
 */
import { test, expect } from "../../fixtures/loginFixture";
import { LoginPage } from "../../pageObjects/LoginPage.page";
import { getFrontendConfig } from "../../utils/frontendConfig";
import type { Page } from "@playwright/test";

const DEFAULT_UCM2_BASE = "https://ucm2.develop.squads-dev.com/";

function ucm2FrontendConfig(): {
  url: string;
  basicUser: string;
  basicPassword: string;
} {
  const frontend = getFrontendConfig();
  const url =
    process.env.UCM2_BASE_URL?.replace(/\/?$/, "/") ?? DEFAULT_UCM2_BASE;
  return { ...frontend, url };
}

async function loginAsAdmin(
  loginFixture: LoginPage,
  cfg: ReturnType<typeof ucm2FrontendConfig>,
): Promise<void> {
  await loginFixture.openPercipio(cfg);
  await loginFixture.login({
    basicUser: cfg.basicUser,
    basicPassword: cfg.basicPassword,
  });
}

/** Navigate to Audiences list per plan §1–2 (AudienceList). */
async function goToAudiencesList(
  page: Page,
  baseUrl: string,
): Promise<void> {
  const audiencesLink = page.getByRole("link", { name: /audiences/i }).first();
  if (await audiencesLink.isVisible().catch(() => false)) {
    await audiencesLink.click();
    return;
  }
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: /audiences/i }).first().click();
}

async function searchAudienceByName(page: Page, name: string): Promise<void> {
  const search = page
    .getByRole("searchbox")
    .or(page.getByPlaceholder(/search/i))
    .first();
  await search.fill(name);
  await page.keyboard.press("Enter");
}

/** Row actions control on list row (AudienceList — refine if UI uses icon-only button). */
function rowActionsButton(page: Page, row: ReturnType<Page["getByRole"]>) {
  return row.getByRole("button", {
    name: /actions|open menu|more|menu/i,
  });
}

test.describe("Automated audience — child audience (PR 8783)", () => {
  test("admin sees Create child audience in row actions for an automated audience", async ({
    page,
    loginFixture,
  }) => {
    const cfg = ucm2FrontendConfig();
    await loginAsAdmin(loginFixture, cfg);
    await goToAudiencesList(page, cfg.url);

    const audienceName =
      process.env.AUTOMATED_AUDIENCE_NAME ?? "Audience";
    await searchAudienceByName(page, audienceName);

    const dataRow = page.getByRole("row").nth(1);
    await rowActionsButton(page, dataRow).click();

    await expect(
      page.getByRole("menuitem", { name: /create child audience/i }),
    ).toBeVisible();
  });

  test("Create child audience opens create/edit flow", async ({
    page,
    loginFixture,
  }) => {
    const cfg = ucm2FrontendConfig();
    await loginAsAdmin(loginFixture, cfg);
    await goToAudiencesList(page, cfg.url);

    await searchAudienceByName(
      page,
      process.env.AUTOMATED_AUDIENCE_NAME ?? "Audience",
    );

    const dataRow = page.getByRole("row").nth(1);
    await rowActionsButton(page, dataRow).click();

    await page
      .getByRole("menuitem", { name: /create child audience/i })
      .click();

    await expect(
      page
        .getByRole("heading", { name: /child|audience/i })
        .or(page.getByRole("dialog")),
    ).toBeVisible({ timeout: 15_000 });
  });
});
