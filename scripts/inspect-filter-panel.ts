/**
 * Phase 0 Part 2 — Inspect Filter Panel (after clicking Filter toggle)
 * Run after inspect-assignment-filters.ts confirms navigation works.
 *
 * Run: npx tsx scripts/inspect-filter-panel.ts
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
  const browser = await chromium.launch({ channel: "chrome", headless: false, slowMo: 100 });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // ── Login ─────────────────────────────────────────────────────────────────
  console.log("🌐 Opening login page...");
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForSelector('#loginName', { timeout: 30000 });
  await page.fill('#loginName', USER);
  await page.keyboard.press("Enter");
  await page.locator('#password').waitFor({ state: "visible", timeout: 15000 });
  await page.fill('#password', PASS);
  await page.keyboard.press("Enter");
  await page.waitForURL((url) => !url.href.includes("/login"), { timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(2000);
  console.log(`✅ Logged in — URL: ${page.url()}`);

  // ── Navigate to Assignments ───────────────────────────────────────────────
  await page.locator('//*[@id="learningMainMenu"]').click();
  await page.waitForTimeout(500);
  await page.locator('//*[@data-marker="assignmetns"]').click();
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log(`✅ On Assignments — URL: ${page.url()}`);

  // Screenshot before opening filter
  await page.screenshot({ path: "scripts/assignments-before-filter.png", fullPage: false });
  console.log("📸 Before filter open → scripts/assignments-before-filter.png");

  // ── Get assignment row count before filter ────────────────────────────────
  const rowsBefore = await page.locator('[role="row"]').count();
  console.log(`\n📊 Rows visible before filter (including header): ${rowsBefore}`);

  // Get first few assignment titles from the grid
  console.log("\n📝 First 5 assignment titles (from AG Grid rows):");
  const dataRows = page.locator('[role="row"]:not([row-index="0"])').or(
    page.locator('.ag-row')
  );
  const rowCount = await dataRows.count();
  console.log(`  Data rows (non-header): ${rowCount}`);
  for (let i = 0; i < Math.min(5, rowCount); i++) {
    const row = dataRows.nth(i);
    const text = (await row.textContent())?.trim().slice(0, 120);
    const rowIndex = await row.getAttribute("row-index");
    const dm = await row.getAttribute("data-marker");
    console.log(`  [${i}] row-index="${rowIndex}" | data-marker="${dm}" | text="${text}"`);

    // Try to find the title cell (first cell / link)
    const cells = row.locator('[role="gridcell"], [role="cell"], td');
    const cellCount = await cells.count();
    if (cellCount > 0) {
      const firstCellText = (await cells.first().textContent())?.trim();
      const firstCellDm = await cells.first().getAttribute("data-marker");
      const firstCellClass = (await cells.first().getAttribute("col-id")) ||
                             (await cells.first().getAttribute("class"))?.slice(0, 60);
      console.log(`     First cell: col-id/class="${firstCellClass}" | data-marker="${firstCellDm}" | text="${firstCellText}"`);
    }
  }

  // ── Click Filter Toggle Button ─────────────────────────────────────────────
  console.log("\n🔵 Clicking filter toggle button (data-marker='filterToggleBtn')...");
  const filterToggle = page.locator('[data-marker="filterToggleBtn"]');
  await filterToggle.waitFor({ timeout: 10000 });
  await filterToggle.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "scripts/filter-panel-open.png", fullPage: false });
  console.log("📸 Filter panel open → scripts/filter-panel-open.png");

  // ── Capture ALL checkboxes AFTER filter panel opens ───────────────────────
  console.log("\n☑️  ALL CHECKBOXES after filter panel opened:");
  const cbData = await page.evaluate(() => {
    const results: Array<Record<string, string | null>> = [];
    document.querySelectorAll('input[type="checkbox"], [role="checkbox"]').forEach((el) => {
      const e = el as HTMLInputElement;
      let labelText: string | null = null;

      // Method 1: for attribute
      if (e.id) {
        const lbl = document.querySelector<HTMLElement>(`label[for="${e.id}"]`);
        if (lbl) labelText = lbl.textContent?.trim() ?? null;
      }
      // Method 2: parent label
      if (!labelText) {
        const closest = e.closest("label");
        if (closest) labelText = closest.textContent?.trim() ?? null;
      }
      // Method 3: aria-labelledby
      if (!labelText) {
        const lblId = e.getAttribute("aria-labelledby");
        if (lblId) {
          const lblEl = document.getElementById(lblId);
          if (lblEl) labelText = lblEl.textContent?.trim() ?? null;
        }
      }
      // Method 4: next sibling span/div text
      if (!labelText) {
        const next = e.nextElementSibling;
        if (next) labelText = next.textContent?.trim() ?? null;
      }
      // Method 5: parent's text content (excluding child inputs)
      if (!labelText) {
        const parent = e.parentElement;
        if (parent) {
          const clone = parent.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("input").forEach((inp) => inp.remove());
          labelText = clone.textContent?.trim() ?? null;
        }
      }

      results.push({
        id: e.id || null,
        ariaLabel: e.getAttribute("aria-label"),
        dataMarker: e.getAttribute("data-marker"),
        name: e.getAttribute("name"),
        labelText: labelText?.slice(0, 80) ?? null,
        checked: String((e as HTMLInputElement).checked),
        className: e.className?.slice(0, 80) ?? null,
        parentClass: e.parentElement?.className?.slice(0, 80) ?? null,
        outerHTML: e.outerHTML?.slice(0, 200) ?? null,
      });
    });
    return results;
  });

  cbData.forEach((cb, i) => {
    console.log(`  [${i}] labelText="${cb.labelText}" | ariaLabel="${cb.ariaLabel}" | dataMarker="${cb.dataMarker}" | id="${cb.id}" | checked="${cb.checked}"`);
    console.log(`       class="${cb.className}" | parentClass="${cb.parentClass}"`);
  });

  // ── Capture filter panel HTML ─────────────────────────────────────────────
  console.log("\n🏗️  FILTER PANEL STRUCTURE:");
  const filterPanelPatterns = [
    '[data-marker*="filter" i]',
    '[class*="filter" i]',
    'aside',
    '[role="complementary"]',
    '[role="dialog"]',
    '[role="region"]',
  ];
  for (const pp of filterPanelPatterns) {
    const els = page.locator(pp);
    const count = await els.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const el = els.nth(i);
        const dm = await el.getAttribute("data-marker");
        const innerText = (await el.innerText())?.trim().slice(0, 300);
        const cls = (await el.getAttribute("class"))?.slice(0, 80);
        if (innerText && innerText.length > 3) {
          console.log(`  "${pp}"[${i}]: data-marker="${dm}" | class="${cls}"`);
          console.log(`    text: "${innerText}"`);
        }
      }
    }
  }

  // ── Save filter panel HTML ────────────────────────────────────────────────
  const filterPanelHtml = await page.evaluate(() => {
    // Try to find the filter panel container
    const candidates = [
      ...document.querySelectorAll('[data-marker*="filter" i]'),
      ...document.querySelectorAll('[class*="filterPanel" i]'),
      ...document.querySelectorAll('[class*="filter-panel" i]'),
      ...document.querySelectorAll('aside'),
    ];
    const biggest = candidates.reduce((max, el) =>
      el.innerHTML.length > max.innerHTML.length ? el : max,
      document.createElement("div")
    );
    return biggest.outerHTML?.slice(0, 50000) ?? "";
  });
  fs.writeFileSync(path.join(__dirname, "..", "scripts", "filter-panel.html"), filterPanelHtml);
  console.log("\n💾 Filter panel HTML → scripts/filter-panel.html");

  // ── Apply "Active" filter if found and check row count ────────────────────
  console.log("\n🧪 Testing filter interaction — looking for 'Active' checkbox...");
  // Try multiple approaches to find the Active checkbox
  const activeCheckboxSelectors = [
    'input[type="checkbox"]',
    '[role="checkbox"]',
  ];
  let activeCheckbox = null;
  for (const sel of activeCheckboxSelectors) {
    const allCbs = await page.locator(sel).all();
    for (const cb of allCbs) {
      const label = await cb.evaluate((el: Element) => {
        const e = el as HTMLInputElement;
        let text = e.getAttribute("aria-label") || "";
        if (!text && e.id) {
          const lbl = document.querySelector(`label[for="${e.id}"]`);
          if (lbl) text = lbl.textContent?.trim() || "";
        }
        if (!text) {
          const closest = e.closest("label");
          if (closest) {
            const clone = closest.cloneNode(true) as HTMLElement;
            clone.querySelectorAll("input").forEach((i) => i.remove());
            text = clone.textContent?.trim() || "";
          }
        }
        return text;
      });
      if (label?.toLowerCase().includes("active")) {
        activeCheckbox = cb;
        console.log(`  ✅ Found 'Active' checkbox with label: "${label}"`);
        break;
      }
    }
    if (activeCheckbox) break;
  }

  if (activeCheckbox) {
    await activeCheckbox.check();
    await page.waitForTimeout(2000);
    const rowsAfter = await page.locator('[role="row"]').count();
    console.log(`  Rows after 'Active' filter: ${rowsAfter} (before: ${rowsBefore})`);
    await page.screenshot({ path: "scripts/filter-active-applied.png", fullPage: false });
    console.log("  📸 After Active filter → scripts/filter-active-applied.png");

    // Try empty search
    await page.fill('#search', '__NOMATCH_ZZZZ__');
    await page.waitForTimeout(2000);
    const rowsEmpty = await page.locator('[role="row"]').count();
    console.log(`  Rows after no-match search: ${rowsEmpty}`);
    await page.screenshot({ path: "scripts/filter-empty-search.png", fullPage: false });
    console.log("  📸 After empty search → scripts/filter-empty-search.png");

    // Capture empty state DOM
    const emptyStateInfo = await page.evaluate(() => {
      const body = document.querySelector('.ag-overlay, .ag-overlay-no-rows-wrapper, [class*="noRows"], [class*="empty"], [data-marker*="empty"]');
      return body ? {
        className: body.className,
        text: body.textContent?.trim().slice(0, 200),
        dataMarker: body.getAttribute("data-marker"),
        tagName: body.tagName
      } : null;
    });
    console.log("  Empty state element:", JSON.stringify(emptyStateInfo));

    // Get visible text when no rows match
    const overlayText = await page.locator('.ag-overlay-no-rows-center, [class*="noRows"], [ref="eNoRowsOverlay"]').first().textContent().catch(() => null);
    console.log(`  AG Grid no-rows overlay text: "${overlayText}"`);

    // Uncheck
    await activeCheckbox.uncheck();
    await page.fill('#search', '');
    await page.waitForTimeout(1500);
  } else {
    console.log("  ⚠️  'Active' checkbox not found in filter panel");
  }

  // ── Confirm search input id="search" works ────────────────────────────────
  console.log("\n🔎 Testing search input (id='search')...");
  const searchInput = page.locator('#search');
  if (await searchInput.count() > 0) {
    await searchInput.fill("auto");
    await page.waitForTimeout(2000);
    const rowsAfterSearch = await page.locator('[role="row"]').count();
    console.log(`  Rows after searching 'auto': ${rowsAfterSearch}`);
    const titles = await page.evaluate(() => {
      const rows = document.querySelectorAll('.ag-row');
      return Array.from(rows).slice(0, 5).map((r) => r.textContent?.trim().slice(0, 80));
    });
    console.log("  Visible assignment titles (first 5):", JSON.stringify(titles));
    await searchInput.fill("");
    await page.waitForTimeout(1000);
  }

  // ── AG Grid row data-marker discovery ────────────────────────────────────
  console.log("\n🔍 AG Grid row structure:");
  const agRowInfo = await page.evaluate(() => {
    const results: string[] = [];
    document.querySelectorAll(".ag-row").forEach((row, i) => {
      if (i >= 5) return;
      const ri = row.getAttribute("row-index");
      const dm = row.getAttribute("data-marker");
      const firstCell = row.querySelector('[col-id]');
      const colId = firstCell?.getAttribute("col-id");
      const cellText = firstCell?.textContent?.trim().slice(0, 60);
      results.push(`row-index="${ri}" data-marker="${dm}" firstCell col-id="${colId}" text="${cellText}"`);
    });
    return results;
  });
  agRowInfo.forEach((r, i) => console.log(`  [${i}] ${r}`));

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n\n══════════════════════════════════════════════════");
  console.log("DISCOVERY SUMMARY FOR LOCATORS:");
  console.log("══════════════════════════════════════════════════");
  console.log("Filter toggle btn:   [data-marker='filterToggleBtn']");
  console.log("Search input:        #search  (placeholder='Search assignments in this list')");
  console.log("Assignment rows:     .ag-row  (AG Grid rows)");
  console.log("Header row:          .ag-header-row  (to exclude from count)");
  console.log("Check screenshots and cbData above for checkbox selectors");
  console.log("══════════════════════════════════════════════════\n");

  await page.waitForTimeout(3000);
  await browser.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
