/**
 * Phase 0 Discovery Script — Assignment Filters
 * Uses the project's LoginPage + AdminHomePage to authenticate, then inspects
 * the Assignments list page for filter locators.
 *
 * Run: npx tsx scripts/inspect-assignment-filters.ts
 */

import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const CONFIG_PATH = path.join(__dirname, "..", "config", "develop.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as {
  frontend: { url: string; basicUser: string; basicPassword: string };
};

const BASE_URL = config.frontend.url;
const USER = config.frontend.basicUser;
const PASS = config.frontend.basicPassword;

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: false, slowMo: 200 });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // ── Navigate to Percipio ──────────────────────────────────────────────────
  console.log(`\n🌐 Opening ${BASE_URL} ...`);
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  console.log(`  Current URL: ${page.url()}`);

  // ── Login ─────────────────────────────────────────────────────────────────
  // Matches LoginPage.page.ts exactly: #loginName, #password, Enter to submit
  console.log("\n🔐 Waiting for page to fully load...");
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scripts/login-page.png" });
  console.log("  📸 Login page screenshot → scripts/login-page.png");
  console.log(`  URL: ${page.url()}`);

  // Log all visible input IDs to help debug
  const allInputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input")).map((el) => ({
      id: el.id,
      type: el.type,
      placeholder: el.placeholder,
      name: el.name,
      visible: el.offsetParent !== null,
    }))
  );
  console.log("  All inputs on login page:", JSON.stringify(allInputs));

  console.log("  Waiting for login form (#loginName)...");
  await page.waitForSelector('#loginName', { timeout: 30000 });

  // Optional SSO classic link
  const ssoLink = page.locator('a[href="#/classic"]');
  if (await ssoLink.count() > 0) {
    console.log("  SSO classic link found — clicking...");
    await ssoLink.click();
    await page.waitForTimeout(500);
  }

  await page.fill('#loginName', USER);
  console.log(`  Filled username: ${USER}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);

  // Screenshot after username step — might need to handle 2-step login
  await page.screenshot({ path: "scripts/after-username.png" });
  console.log(`  After username URL: ${page.url()}`);
  const afterUserInputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input:not([type='hidden'])")).map((e) => ({
      id: (e as HTMLInputElement).id, type: (e as HTMLInputElement).type, placeholder: (e as HTMLInputElement).placeholder
    }))
  );
  console.log("  Visible inputs after username:", JSON.stringify(afterUserInputs));

  const passwordField = page.locator('#password');
  await passwordField.waitFor({ state: "visible", timeout: 15000 });
  await page.fill('#password', PASS);
  console.log("  Filled password");
  await page.keyboard.press("Enter");

  // Wait for navigation away from login page
  await page.waitForURL((url) => !url.href.includes("/login"), { timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "scripts/post-login.png" });
  console.log(`  ✅ Post-login URL: ${page.url()}`);

  // ── Navigate to Assignments ───────────────────────────────────────────────
  console.log("\n📋 Navigating to Assignments list...");
  // Click Learning menu
  const learningMenu = page.locator('//*[@id="learningMainMenu"]');
  await learningMenu.waitFor({ timeout: 30000 });
  await learningMenu.click();
  await page.waitForTimeout(500);

  // Click Assignments (note the typo in data-marker is intentional — matches live UI)
  const assignmentsItem = page.locator('//*[@data-marker="assignmetns"]');
  await assignmentsItem.click();
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log(`  ✅ Current URL: ${page.url()}`);

  // ── Screenshot of the full list page ─────────────────────────────────────
  await page.screenshot({ path: "scripts/assignment-list-full.png", fullPage: true });
  console.log("\n📸 Full page screenshot → scripts/assignment-list-full.png");

  // ── CHECKBOXES ────────────────────────────────────────────────────────────
  console.log("\n☑️  CHECKBOXES found on page:");
  const cbInfo = await page.evaluate(() => {
    const results: Array<Record<string, string | null>> = [];
    document.querySelectorAll('input[type="checkbox"], [role="checkbox"]').forEach((el) => {
      const e = el as HTMLInputElement;
      let labelText: string | null = null;
      if (e.id) {
        const lbl = document.querySelector<HTMLElement>(`label[for="${e.id}"]`);
        if (lbl) labelText = lbl.textContent?.trim() ?? null;
      }
      if (!labelText) {
        const closest = e.closest("label");
        if (closest) labelText = closest.textContent?.trim() ?? null;
      }
      if (!labelText) {
        // Try aria-labelledby
        const lblId = e.getAttribute("aria-labelledby");
        if (lblId) {
          const lblEl = document.getElementById(lblId);
          if (lblEl) labelText = lblEl.textContent?.trim() ?? null;
        }
      }
      results.push({
        tagName: e.tagName,
        id: e.id || null,
        name: e.getAttribute("name"),
        ariaLabel: e.getAttribute("aria-label"),
        dataMarker: e.getAttribute("data-marker"),
        labelText,
        checked: String(e.checked),
        className: e.className?.slice(0, 80) ?? null,
      });
    });
    return results;
  });
  cbInfo.forEach((cb, i) =>
    console.log(
      `  [${i}] label="${cb.labelText}" | aria-label="${cb.ariaLabel}" | data-marker="${cb.dataMarker}" | id="${cb.id}" | class="${cb.className}"`
    )
  );

  // ── TEXT / SEARCH INPUTS ──────────────────────────────────────────────────
  console.log("\n🔎 TEXT / SEARCH INPUTS:");
  const inputInfo = await page.evaluate(() => {
    const results: Array<Record<string, string | null>> = [];
    document
      .querySelectorAll('input[type="text"], input[type="search"], [role="searchbox"], input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="password"])')
      .forEach((el) => {
        const e = el as HTMLInputElement;
        results.push({
          type: e.getAttribute("type"),
          placeholder: e.getAttribute("placeholder"),
          ariaLabel: e.getAttribute("aria-label"),
          dataMarker: e.getAttribute("data-marker"),
          id: e.id || null,
          name: e.getAttribute("name"),
          role: e.getAttribute("role"),
          className: e.className?.slice(0, 80) ?? null,
        });
      });
    return results;
  });
  inputInfo.forEach((inp, i) =>
    console.log(
      `  [${i}] placeholder="${inp.placeholder}" | aria-label="${inp.ariaLabel}" | type="${inp.type}" | data-marker="${inp.dataMarker}" | id="${inp.id}"`
    )
  );

  // ── ASSIGNMENT ROW PATTERNS ────────────────────────────────────────────────
  console.log("\n📝 ASSIGNMENT LIST ROWS — probing patterns:");
  const rowPatterns = [
    'tr[data-marker]',
    '[data-marker*="row" i]',
    '[data-marker*="assignment" i]',
    '[data-marker*="item" i]',
    'tr:not(:first-child)',
    '[role="row"]',
    'li[role="listitem"]',
    'li',
  ];
  for (const pattern of rowPatterns) {
    const count = await page.locator(pattern).count();
    if (count > 0) {
      const first = page.locator(pattern).first();
      const dm = await first.getAttribute("data-marker");
      const text = (await first.textContent())?.trim().slice(0, 100);
      console.log(`  ✅ "${pattern}" → ${count} matches | data-marker="${dm}" | text="${text}"`);
    }
  }

  // ── TITLE CELL within first row ────────────────────────────────────────────
  console.log("\n  🔍 Title cell inside first visible row — probing:");
  const firstRowEl = await page.locator('tr:not(:first-child), [role="row"]:not(:first-child), [data-marker*="row" i], li').first();
  if (await firstRowEl.count() > 0) {
    const titlePatterns = ['a', 'td:first-child', '[role="cell"]:first-child', '[data-marker*="title" i]', '[data-marker*="name" i]'];
    for (const tp of titlePatterns) {
      const tc = firstRowEl.locator(tp);
      if (await tc.count() > 0) {
        const tcText = (await tc.first().textContent())?.trim().slice(0, 80);
        const tcDm = await tc.first().getAttribute("data-marker");
        console.log(`    "${tp}": text="${tcText}" | data-marker="${tcDm}"`);
      }
    }
  }

  // ── FILTER PANEL CONTAINER ────────────────────────────────────────────────
  console.log("\n🏗️  FILTER PANEL container — probing:");
  const panelPatterns = [
    '[data-marker*="filter" i]',
    '[class*="filter" i]',
    'aside',
    '[role="complementary"]',
    '[aria-label*="filter" i]',
    'form',
  ];
  for (const pp of panelPatterns) {
    const count = await page.locator(pp).count();
    if (count > 0) {
      const first = page.locator(pp).first();
      const dm = await first.getAttribute("data-marker");
      const cls = (await first.getAttribute("class"))?.slice(0, 80);
      const innerText = (await first.innerText())?.slice(0, 200);
      console.log(`  ✅ "${pp}" → ${count} matches | data-marker="${dm}" | class="${cls}"`);
      console.log(`     innerText: "${innerText}"`);
    }
  }

  // ── EMPTY STATE via no-match search ──────────────────────────────────────
  console.log("\n🚫 EMPTY STATE — searching for no-match term...");
  const searchInput = page.locator('input[type="text"], input[type="search"], [role="searchbox"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill("__NOMATCH_ZZZ__");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "scripts/assignment-empty-state.png" });
    console.log("  📸 Empty state screenshot → scripts/assignment-empty-state.png");

    const emptyInfo = await page.evaluate(() => {
      const patterns = [
        '[data-marker*="empty" i]',
        '[data-marker*="no-result" i]',
        '[class*="empty" i]',
        '[class*="no-result" i]',
        '[role="status"]',
        '[role="alert"]',
      ];
      const found: string[] = [];
      patterns.forEach((p) => {
        document.querySelectorAll(p).forEach((el) => {
          found.push(`pattern="${p}" | data-marker="${el.getAttribute("data-marker")}" | text="${el.textContent?.trim().slice(0, 100)}"`);
        });
      });
      return found;
    });
    emptyInfo.forEach((e) => console.log(`  ✅ ${e}`));

    // Also grab visible text on page to see what empty state says
    const visibleText = await page.evaluate(() => {
      const main = document.querySelector("main") || document.body;
      return main.textContent?.replace(/\s+/g, " ").trim().slice(0, 500);
    });
    console.log(`  Page text: "${visibleText}"`);

    // Clear the search
    await searchInput.fill("");
    await page.waitForTimeout(1500);
  }

  // ── Save full page HTML for offline analysis ──────────────────────────────
  const html = await page.content();
  const htmlPath = path.join(__dirname, "..", "scripts", "assignment-page.html");
  fs.writeFileSync(htmlPath, html);
  console.log(`\n💾 Full page HTML saved to: scripts/assignment-page.html`);

  // ── Count assignments ─────────────────────────────────────────────────────
  console.log("\n📊 ASSIGNMENT TITLES visible (first 10):");
  const allText = await page.evaluate(() => {
    const rows: string[] = [];
    // Try table rows
    document.querySelectorAll("table tr").forEach((tr, i) => {
      if (i === 0) return; // skip header
      const text = tr.textContent?.trim().slice(0, 120);
      if (text) rows.push(text);
    });
    if (rows.length === 0) {
      // Try list items
      document.querySelectorAll("ul li, ol li").forEach((li) => {
        const text = li.textContent?.trim().slice(0, 120);
        if (text) rows.push(text);
      });
    }
    return rows.slice(0, 10);
  });
  allText.forEach((t, i) => console.log(`  [${i}] ${t}`));

  console.log("\n✅ Discovery complete!");
  console.log("   Review scripts/assignment-list-full.png for visual reference");
  console.log("   Review scripts/assignment-empty-state.png for empty state");
  console.log("   Review scripts/assignment-page.html for full DOM");

  await page.waitForTimeout(3000); // brief pause to visually inspect
  await browser.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
