/**
 * Plan: specs/plan-UHS-TC-1338-team-automation-user-profiles.md — §C
 *
 * Optional `UCM_MANUAL3_TEAM_AUTOMATION_GOTO`: full URL, path, or hash after manual discovery
 * (same idea as `UCM_MANUAL3_AUDIENCES_GOTO`).
 */
import type { Page } from "@playwright/test";
import type { Manual3FrontendConfig } from "./audienceNavigation";
import { goToAudiencesList } from "./audienceNavigation";

const PROFILE_FIELD_RE = /direct manager|percipio role|job title/i;

/**
 * Land on UI where team automation rules and user profile fields can be configured.
 * Without a direct URL, uses Audiences → Create audience → advance wizard until profile fields or automation section appears.
 */
export async function goToTeamAutomationRuleContext(
  page: Page,
  cfg: Manual3FrontendConfig,
): Promise<void> {
  const direct = process.env.UCM_MANUAL3_TEAM_AUTOMATION_GOTO?.trim();
  if (direct) {
    const base = cfg.url.replace(/\/$/, "");
    const target = direct.startsWith("http")
      ? direct
      : direct.startsWith("#")
        ? `${base}${direct}`
        : `${base}${direct.startsWith("/") ? "" : "/"}${direct}`;
    await page.goto(target, { waitUntil: "domcontentloaded" });
    return;
  }

  await goToAudiencesList(page, cfg);

  const createControl = page
    .getByRole("button", { name: /^(create|add)(\s+an?)?\s+audience/i })
    .or(page.getByRole("link", { name: /^(create|add)(\s+an?)?\s+audience/i }))
    .or(page.getByRole("button", { name: /new audience/i }));
  await createControl.first().click({ timeout: 30_000 });

  // Advance wizard: stop when user profile fields are visible, or automation/rules tab is visible
  for (let step = 0; step < 12; step++) {
    if (
      await page
        .getByText(PROFILE_FIELD_RE)
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return;
    }
    const automationTab = page.getByRole("tab", { name: /automation|team.*rule|rules/i });
    if (await automationTab.first().isVisible().catch(() => false)) {
      await automationTab.first().click();
      await page.waitForLoadState("domcontentloaded");
    }
    const addRule = page.getByRole("button", {
      name: /add.*(automation )?rule|new.*rule|create.*rule/i,
    });
    if (await addRule.first().isVisible().catch(() => false)) {
      await addRule.first().click();
      await page.waitForLoadState("domcontentloaded");
    }
    const nextBtn = page.getByRole("button", { name: /^next$/i });
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await page.waitForLoadState("domcontentloaded");
    } else {
      break;
    }
  }
}

export { PROFILE_FIELD_RE };
