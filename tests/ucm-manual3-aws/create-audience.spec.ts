/**
 * spec: specs/plan-ucm-manual3-aws-create-audience.md
 * seed: tests/ucm-manual3-aws/entry-and-login.spec.ts, tests/ucm-manual3-aws/manual3Auth.ts
 *
 * Generator-style: step comments follow plan §A–C. Set `UCM_MANUAL3_AUDIENCES_GOTO` if Site Navigation
 * labels differ in your tenant (see plan §B — direct URL).
 */
import { test, expect } from "../../fixtures/loginFixture";
import { loginAsManual3Admin } from "./manual3Auth";
import { goToAudiencesList } from "./audienceNavigation";

test.describe("ucm-manual3-aws — Create audience", () => {
  test("admin creates an audience with a unique name (happy path)", async ({
    page,
    loginFixture,
  }) => {
    // §A — Login (same contract as entry-and-login.spec.ts)
    const cfg = await loginAsManual3Admin(page, loginFixture);

    // §B — Navigate to Audiences (admin shell)
    await goToAudiencesList(page, cfg);

    // §C1 — Open create flow
    const createControl = page
      .getByRole("button", { name: /^(create|add)(\s+an?)?\s+audience/i })
      .or(page.getByRole("link", { name: /^(create|add)(\s+an?)?\s+audience/i }))
      .or(page.getByRole("button", { name: /new audience/i }));
    await createControl.first().click({ timeout: 30_000 });

    // §C2 — Unique audience name
    const uniqueName = `E2E Audience ${Date.now()}`;
    const nameField = page
      .getByLabel(/audience name|^name$/i)
      .or(page.getByPlaceholder(/audience|name/i))
      .first();
    await nameField.fill(uniqueName);

    // §C3 — Required fields: complete type/filters if the UI exposes them (minimal path = name only when allowed)
    const nextBtn = page.getByRole("button", { name: /^next$/i });
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
    }

    // §C4 — Save / Create (prefer dialog scope when present)
    const dialog = page.getByRole("dialog");
    const useDialog = (await dialog.count()) > 0;
    const saveBtn = useDialog
      ? dialog.getByRole("button", { name: /^(save|create|done|finish)$/i })
      : page.getByRole("button", { name: /^(save|create|done|finish)$/i });
    await saveBtn.last().click({ timeout: 15_000 });

    // §C5 — Discover new audience via search (list or redirect back to list)
    const search = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder(/search/i))
      .first();
    if (await search.isVisible().catch(() => false)) {
      await search.fill(uniqueName);
      await page.keyboard.press("Enter");
    }

    await expect(page.getByText(uniqueName, { exact: false }).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test.fixme(
    "validation: cannot submit create audience with empty name (plan §D1)",
    async ({ page, loginFixture }) => {
      const cfg = await loginAsManual3Admin(page, loginFixture);
      await goToAudiencesList(page, cfg);
      await page
        .getByRole("button", { name: /create|add.*audience/i })
        .first()
        .click();
      await page.getByRole("button", { name: /^(save|create)$/i }).click();
      await expect(page.getByText(/required|enter.*name|cannot be empty/i)).toBeVisible();
    },
  );
});
