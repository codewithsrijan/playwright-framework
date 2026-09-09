import type { Page } from "@playwright/test";
import { NAVIGATION_MS } from "../../framework/wait/timeouts";
import { waitForPageReady } from "../../framework/wait/waitFor";

/**
 * Navigate relative to Playwright `use.baseURL` (set in playwright.config.ts).
 * Prefer this over string-concatenating full URLs in specs.
 */
export async function gotoPath(
  page: Page,
  path: string,
  options?: { waitUntil?: "load" | "domcontentloaded" | "commit" },
): Promise<void> {
  await page.goto(path, {
    waitUntil: options?.waitUntil ?? "domcontentloaded",
    timeout: NAVIGATION_MS,
  });
  await waitForPageReady(page);
}
