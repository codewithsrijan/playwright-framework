import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { POST_LOGIN_SETTLE_MS } from "./timeouts";

/**
 * Baseline readiness after navigation: DOM + load event (avoids networkidle flakiness on SPAs).
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("load");
}

/**
 * Post-auth / post-redirect settle. Uses configurable buffer; replace with
 * `waitForStableUi` when you have a stable shell locator.
 */
export async function waitAfterLoginTransition(
  page: Page,
  settleMs: number = POST_LOGIN_SETTLE_MS,
): Promise<void> {
  await waitForPageReady(page);
  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}

/**
 * Wait until a key element is visible (preferred "ready" signal for a route).
 */
export async function waitForStableUi(
  page: Page,
  keyLocator: Locator,
  options?: { timeout?: number },
): Promise<void> {
  await expect(keyLocator).toBeVisible(options);
}
