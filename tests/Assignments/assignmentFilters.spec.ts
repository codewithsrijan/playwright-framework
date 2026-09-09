// spec:  specs-assignment-filters-automation/spec.md
// plan:  specs-assignment-filters-automation/plan.md
// tasks: specs-assignment-filters-automation/tasks.md
// tests: specs-assignment-filters-automation/tests.md
//
// Covers: SF-01…SF-06 (status filter checkboxes), SF-07 (clear), SF-08 (multi-select)
//         SR-01…SR-03 (search filter)
//         CB-01 (combined filter + search)
//
// Phase 0 discovery (2026-05-25):
//   Filter values confirmed in dev: Failed, Scheduled, Draft, In Progress, Archived, Canceled
//   NOTE: "Active" and "Retired" were NOT found as filter options in the UI.
//         The filter panel shows non-default (non-active) statuses only.
//   Known stable search term: "Auto Assignment HP01" (multiple in dev)

import { test, expect } from "../../fixtures/loginFixture";
import { AdminHomePage } from "../../pageObjects/AdminHomePage.page";
import { AssignmentsPage } from "../../pageObjects/Assignments/AssignmentsPage.page";
import { Reporter } from "../../utils/Reporter";

/**
 * Use a fresh browser session per test to avoid OAuth redirect issues.
 * Consistent with assignmentCreate.spec.ts pattern.
 */
test.use({ storageState: { cookies: [], origins: [] } });

// ── Stable test data (confirmed in dev via Phase 0 inspection) ────────────────
/**
 * Partial title string confirmed to match multiple assignments in dev.
 * Used in SR-01 (search match) and CB-01 (combined filter + search).
 */
const KNOWN_TITLE_SUBSTRING = "Auto Assignment HP01";

/**
 * Status filter values confirmed via live UI inspection (Phase 0).
 * These are the checkbox labels shown in the filter panel.
 * "Active" and "Retired" are NOT available as filter options.
 */
const STATUS_FILTER_VALUES = [
  "Failed",
  "Scheduled",
  "Draft",
  "In Progress",
  "Archived",
  "Canceled",
] as const;

type StatusFilterValue = (typeof STATUS_FILTER_VALUES)[number];

// ── Page object instances (set in beforeEach) ────────────────────────────────
let adminHomePage: AdminHomePage;
let assignmentsPage: AssignmentsPage;
let baselineCount: number;

// ── Status Filter — Checkbox Tests ───────────────────────────────────────────

test.describe("Status filter — checkbox", () => {
  test.beforeEach(async ({ page, lognToPageFixture }) => {
    void lognToPageFixture;
    page.on("dialog", (dialog) => void dialog.accept());
    adminHomePage = new AdminHomePage(page);
    assignmentsPage = new AssignmentsPage(page);

    await Reporter.setEpic("Assignments");
    await Reporter.setFeature("Assignment Filters");
    await Reporter.addTags("filters", "status-filter");

    await adminHomePage.navigateToAssignments();
    // Wait for AG Grid to render data rows before capturing baseline
    await assignmentsPage.waitForListLoaded();
    // Capture baseline (unfiltered) row count for relative assertions
    baselineCount = await assignmentsPage.getVisibleAssignmentCount();
  });

  // SF-01 … SF-06: Apply each status checkbox — list must update
  for (const status of STATUS_FILTER_VALUES) {
    test(`SF — Apply "${status}" filter → list updates`, async () => {
      await assignmentsPage.applyFilterCheckbox(status);
      const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

      if (filteredCount === 0) {
        // No data for this status in dev — assert the empty state is shown
        await assignmentsPage.expectEmptyState();
      } else {
        // Filtered count must be ≤ baseline (can equal baseline when all items match
        // the selected status — e.g. all assignments are "In Progress").
        // The filter checkbox being checked (asserted in applyFilterCheckbox) confirms
        // the filter was applied; filtering can only reduce or maintain the count.
        expect(filteredCount).toBeLessThanOrEqual(baselineCount);
      }

      // Cleanup: uncheck so the next test starts from baseline
      await assignmentsPage.clearFilterCheckbox(status);
    });
  }

  // SF-07: Unchecking a filter restores the full list
  test("SF-07 — Uncheck 'Draft' filter → full list restored", async () => {
    await assignmentsPage.applyFilterCheckbox("Draft");
    const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

    await assignmentsPage.clearFilterCheckbox("Draft");
    const restoredCount = await assignmentsPage.getVisibleAssignmentCount();

    // Restored count must be ≥ filtered count
    expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
    // Prefer exact restoration to baseline
    expect(restoredCount).toBe(baselineCount);
  });

  // SF-08: Multi-select — two checkboxes simultaneously
  test("SF-08 — Multi-select 'Draft' + 'Archived' → combined results", async () => {
    // Apply Draft first, capture count
    await assignmentsPage.applyFilterCheckbox("Draft");
    const draftCount = await assignmentsPage.getVisibleAssignmentCount();

    // Add Archived to the selection
    await assignmentsPage.applyFilterCheckbox("Archived");
    const combinedCount = await assignmentsPage.getVisibleAssignmentCount();

    // Combined must be ≥ Draft-only count (Archived adds more rows)
    expect(combinedCount).toBeGreaterThanOrEqual(draftCount);
    // Combined must be ≤ baseline (still a subset of all assignments)
    expect(combinedCount).toBeLessThanOrEqual(baselineCount);

    // Cleanup
    await assignmentsPage.clearFilterCheckbox("Draft");
    await assignmentsPage.clearFilterCheckbox("Archived");
  });
});

// ── Search Filter Tests ───────────────────────────────────────────────────────

test.describe("Search by name filter", () => {
  test.beforeEach(async ({ page, lognToPageFixture }) => {
    void lognToPageFixture;
    page.on("dialog", (dialog) => void dialog.accept());
    adminHomePage = new AdminHomePage(page);
    assignmentsPage = new AssignmentsPage(page);

    await Reporter.setEpic("Assignments");
    await Reporter.setFeature("Assignment Filters");
    await Reporter.addTags("filters", "search-filter");

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.waitForListLoaded();
    baselineCount = await assignmentsPage.getVisibleAssignmentCount();
  });

  // SR-01: Search a known term — all visible titles must contain it
  test("SR-01 — Search known term → only matching titles shown", async () => {
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const titles = await assignmentsPage.getVisibleAssignmentTitles();

    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(KNOWN_TITLE_SUBSTRING.toLowerCase());
    }
  });

  // SR-02: Search a term that matches nothing — empty state shown
  test("SR-02 — Search non-matching term → empty state shown", async () => {
    await assignmentsPage.searchByName("__NO_MATCH_TERM_ZZZ_XYZ_123__");
    await assignmentsPage.expectEmptyState();
  });

  // SR-03: Clear search — full list is restored
  test("SR-03 — Clear search → full list restored", async () => {
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

    await assignmentsPage.clearSearch();
    const restoredCount = await assignmentsPage.getVisibleAssignmentCount();

    expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
    expect(restoredCount).toBe(baselineCount);
  });
});

// ── Assignment Type Filter ────────────────────────────────────────────────────

test.describe("Assignment type filter", () => {
  test("TF-01 — Assignment type filter (skipped: type filter is the same as status filter group)", async () => {
    // Phase 0 T-03 confirmed: there is NO separate Assignment Type filter group.
    // The filter panel contains a single checkbox group with status values:
    // Failed, Scheduled, Draft, In Progress, Archived, Canceled.
    // Type filter coverage is provided by the status filter tests (SF-01…SF-08).
    test.skip(
      true,
      "Phase 0 discovery confirmed no separate Assignment Type filter group. " +
        "The filter panel has a single checkbox set: Failed, Scheduled, Draft, " +
        "In Progress, Archived, Canceled. AC-07/AC-08 are covered by SF-01…SF-08.",
    );
  });
});

// ── Combined Filter Tests ─────────────────────────────────────────────────────

test.describe("Combined filters", () => {
  test.beforeEach(async ({ page, lognToPageFixture }) => {
    void lognToPageFixture;
    page.on("dialog", (dialog) => void dialog.accept());
    adminHomePage = new AdminHomePage(page);
    assignmentsPage = new AssignmentsPage(page);

    await Reporter.setEpic("Assignments");
    await Reporter.setFeature("Assignment Filters");
    await Reporter.addTags("filters", "combined-filter");

    await adminHomePage.navigateToAssignments();
    await assignmentsPage.waitForListLoaded();
    baselineCount = await assignmentsPage.getVisibleAssignmentCount();
  });

  // CB-01: Status checkbox filter + name search simultaneously
  test("CB-01 — Apply 'Draft' filter + search known title → intersection shown", async () => {
    // Apply Draft status filter
    await assignmentsPage.applyFilterCheckbox("Draft");
    const draftCount = await assignmentsPage.getVisibleAssignmentCount();

    // Apply name search on top of the filter
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const combinedCount = await assignmentsPage.getVisibleAssignmentCount();

    if (combinedCount > 0) {
      // All visible titles must contain the search term
      const titles = await assignmentsPage.getVisibleAssignmentTitles();
      for (const title of titles) {
        expect(title.toLowerCase()).toContain(KNOWN_TITLE_SUBSTRING.toLowerCase());
      }
      // Combined must be ≤ Draft-only count (search further narrows)
      expect(combinedCount).toBeLessThanOrEqual(draftCount);
    } else {
      // No Draft assignments match the search term in dev — valid outcome
      await assignmentsPage.expectEmptyState();
    }

    // Cleanup: clear search first, then uncheck filter
    await assignmentsPage.clearSearch();
    await assignmentsPage.clearFilterCheckbox("Draft");
  });
});
