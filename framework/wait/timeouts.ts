/**
 * Single source of named timeouts for UI automation.
 * Override via env when needed (e.g. CI slowness).
 */
function readIntEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined || v === "") {
    return fallback;
  }
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Full navigation / page.goto */
export const NAVIGATION_MS = readIntEnv("PLAYWRIGHT_NAVIGATION_MS", 60_000);

/** Clicks, fills, keyboard */
export const ACTION_MS = readIntEnv("PLAYWRIGHT_ACTION_MS", 30_000);

/** Assertions (align with playwright.config.ts expect.timeout when possible) */
export const ASSERT_MS = readIntEnv("PLAYWRIGHT_ASSERT_MS", 15_000);

/**
 * After login or heavy client-side redirect — prefer replacing with a real
 * "app ready" signal (expect on a shell locator). Kept configurable for stability during migration.
 */
export const POST_LOGIN_SETTLE_MS = readIntEnv(
  "PLAYWRIGHT_POST_LOGIN_MS",
  10_000,
);
