/**
 * Plan: specs/plan-ucm-manual3-aws-create-audience.md — §B Navigate to Audiences
 * Plan: specs/plan-admin-view-users-audience-management.md — §C Site Navigation → Users → Audience Management
 *
 * Prefer `UCM_MANUAL3_AUDIENCES_GOTO` once you copy the path from the address bar after manual navigation
 * (full URL or path + hash, e.g. `#/admin/audiences`).
 */
import type { Page } from "@playwright/test";

/** Same shape as `manual3FrontendConfig()` return (see manual3Auth.ts). */
export type Manual3FrontendConfig = {
  url: string;
  basicUser: string;
  basicPassword: string;
};

function resolveAudiencesGotoTarget(cfg: Manual3FrontendConfig, direct: string): string {
  const base = cfg.url.replace(/\/$/, "");
  return direct.startsWith("http")
    ? direct
    : direct.startsWith("#")
      ? `${base}${direct}`
      : `${base}${direct.startsWith("/") ? "" : "/"}${direct}`;
}

/**
 * Admin shell: Site Navigation → **Users** (expand) → **Audience Management**.
 * UI copy uses "Audience Management" (not a top-level "Audiences" link in the flyout).
 */
export async function goToAudienceManagementViaSiteNav(
  page: Page,
  cfg: Manual3FrontendConfig,
): Promise<void> {
  const direct = process.env.UCM_MANUAL3_AUDIENCES_GOTO?.trim();
  if (direct) {
    await page.goto(resolveAudiencesGotoTarget(cfg, direct), {
      waitUntil: "domcontentloaded",
    });
    return;
  }

  // §C1 — Site Navigation
  await page.getByRole("button", { name: /site navigation/i }).click({ timeout: 30_000 });

  // §C2–C3 — Expand **Users** inside the flyout’s main menu (`navigation` first, not header duplicates)
  const mainMenu = page.getByRole("navigation").first();
  const usersToggle = mainMenu.getByRole("button", { name: /^users$/i });
  if (await usersToggle.isVisible().catch(() => false)) {
    await usersToggle.click({ timeout: 15_000 });
  }

  // §C4 — Prefer **Audience Management** inside the flyout nav (avoid dashboard quick link in `<main>`)
  const flyoutLink = page
    .getByRole("navigation")
    .first()
    .getByRole("link", { name: /audience management/i });
  if (await flyoutLink.isVisible().catch(() => false)) {
    await flyoutLink.click({ timeout: 30_000 });
  } else {
    await page
      .getByRole("link", { name: /audience management/i })
      .first()
      .click({ timeout: 30_000 });
  }
}

/**
 * plan §C-alt — **My Dashboard** → **My Quick Links** → **Audience Management** (same `/admin/audiences` route).
 */
export async function goToAudienceManagementViaQuickLinks(
  page: Page,
  cfg: Manual3FrontendConfig,
): Promise<void> {
  const direct = process.env.UCM_MANUAL3_AUDIENCES_GOTO?.trim();
  if (direct) {
    await page.goto(resolveAudiencesGotoTarget(cfg, direct), {
      waitUntil: "domcontentloaded",
    });
    return;
  }

  const base = cfg.url.replace(/\/$/, "");
  await page.goto(`${base}/admin/dashboard-home`, { waitUntil: "domcontentloaded" });

  await page
    .getByRole("main")
    .getByRole("link", { name: /audience management/i })
    .click({ timeout: 30_000 });
}

/** Alias for {@link goToAudienceManagementViaSiteNav} (create-audience and older specs). */
export async function goToAudiencesList(
  page: Page,
  cfg: Manual3FrontendConfig,
): Promise<void> {
  await goToAudienceManagementViaSiteNav(page, cfg);
}
