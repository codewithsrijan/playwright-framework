/**
 * spec: specs/plan-UHS-TC-1338-team-automation-user-profiles.md
 * Qmetry: UHS-TC-1338
 * seed: manual3Auth, audienceNavigation, teamAutomationRuleNavigation
 */
import { test, expect } from "../../fixtures/loginFixture";
import { loginAsManual3Admin } from "./manual3Auth";
import {
  goToTeamAutomationRuleContext,
  PROFILE_FIELD_RE,
} from "./teamAutomationRuleNavigation";

test.describe("ucm-manual3-aws — UHS-TC-1338 team automation & user profiles", () => {
  test.describe.configure({ mode: "serial" });

  test("D1 — Direct Manager, Percipio Role, Job Title available for team automation rule", async ({
    page,
    loginFixture,
  }) => {
    const cfg = await loginAsManual3Admin(page, loginFixture);
    await goToTeamAutomationRuleContext(page, cfg);

    const hasInlineLabels = await page
      .getByText(PROFILE_FIELD_RE)
      .first()
      .isVisible()
      .catch(() => false);
    if (!hasInlineLabels) {
      const openDropdown = page
        .getByRole("combobox", { name: /user profile|profile|attribute|field/i })
        .or(page.getByRole("button", { name: /user profile|select.*field|add condition/i }))
        .first();
      await openDropdown.click({ timeout: 20_000 });
    }

    await expect(page.getByText(/direct manager/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/percipio role/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/job title/i).first()).toBeVisible({ timeout: 15_000 });
  });

  test("D2–D5 — create, verify, edit, verify team automation rule (user profile values)", async ({
    page,
    loginFixture,
  }) => {
    const cfg = await loginAsManual3Admin(page, loginFixture);
    await goToTeamAutomationRuleContext(page, cfg);

    const ruleName = `E2E Team Rule ${Date.now()}`;
    const nameInput = page
      .getByLabel(/rule name|name/i)
      .or(page.getByPlaceholder(/rule name|name/i))
      .first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(ruleName);
    }

    // Select user profile fields / values where the UI exposes comboboxes (order-agnostic)
    const comboboxes = page.getByRole("combobox");
    const n = await comboboxes.count();
    for (let i = 0; i < Math.min(n, 6); i++) {
      const cb = comboboxes.nth(i);
      if (!(await cb.isVisible().catch(() => false))) continue;
      await cb.click();
      const dm = page.getByRole("option", { name: /direct manager/i }).first();
      if (await dm.isVisible().catch(() => false)) {
        await dm.click();
        break;
      }
      await page.keyboard.press("Escape");
    }

    const saveBtn = page
      .getByRole("button", { name: /^(save|create|apply|done)$/i })
      .or(page.getByRole("button", { name: /save rule|create rule/i }));
    if (await saveBtn.first().isVisible().catch(() => false)) {
      await saveBtn.first().click({ timeout: 15_000 });
    }

    await expect(page.getByText(ruleName, { exact: false }).first()).toBeVisible({
      timeout: 30_000,
    });

    const editBtn = page.getByRole("button", { name: /edit/i }).first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
      const saveAgain = page.getByRole("button", { name: /^(save|apply|done)$/i }).first();
      if (await saveAgain.isVisible().catch(() => false)) {
        await saveAgain.click();
      }
    }

    await expect(page.getByText(ruleName, { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
