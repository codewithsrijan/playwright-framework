/**
 * Plan: specs/plan-ucm-manual3-aws-create-audience.md — §A Login (see also full Audiences/create flow)
 *
 * Override front URL: `UCM_MANUAL3_AWS_BASE_URL` (defaults to manual3-aws develop host below).
 * Credentials: `config/<NODE_ENV>.json` → `frontend.basicUser` / `frontend.basicPassword`
 *
 * Shared config + post-login shell: `./manual3Auth.ts`
 */
import { test, expect } from "../../fixtures/loginFixture";
import {
  expectManual3LoggedInShell,
  manual3FrontendConfig,
} from "./manual3Auth";

test.describe("Entry & login", () => {
  test("admin opens base URL, sees Percipio Login shell, and authenticates", async ({
    page,
    loginFixture,
  }) => {
    const cfg = manual3FrontendConfig();

    // 1. Open base URL — redirect to `/login` (or equivalent) with Percipio Login
    await loginFixture.openPercipio(cfg);
    await expect(page).toHaveURL(/login/i);
    await expect(page).toHaveTitle(/Percipio/i);

    // 2. Review options: Log in, Alternatively… Percipio credentials, Smart App Login
    await expect(
      page.getByRole("heading", { level: 1, name: /let's get started/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^log in$/i })).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Alternatively, login with your Percipio credentials/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Smart App Login/i }),
    ).toBeVisible();

    // 3. Complete login with valid admin credentials — authenticated landing, not stuck on login
    await loginFixture.login({
      basicUser: cfg.basicUser,
      basicPassword: cfg.basicPassword,
    });

    await expectManual3LoggedInShell(page);
  });
});
