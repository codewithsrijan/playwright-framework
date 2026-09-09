# Tasks — Assignment Filters Automation

**Slug:** `assignment-filters-automation`
**Repo:** `ucm-playwright-automation`
**Date:** 2026-05-25
**Source artifacts:** `plan.md`, `spec.md`, `specs/repo-map.md`

---

## Task Index

| ID | Phase | Description | Depends on | Parallel with | Type |
|----|-------|-------------|-----------|---------------|------|
| T-00 | Pre-flight | Run existing Assignments tests to confirm env health | — | — | Manual |
| T-01 | 0 | Inspect filter panel HTML in dev | T-00 | — | Manual |
| T-02 | 0 | Document locator hints in code comment block | T-01 | — | Manual |
| T-03 | 0 | Confirm filter group structure (one group or two) | T-01 | — | Manual |
| T-04 | 0 | Identify a known stable searchable assignment title | T-01 | T-03 | Manual |
| T-05 | 0 | Audit dev data for each status value | T-01 | T-03, T-04 | Manual |
| T-10 | 1 | Add locator properties to `AssignmentsPage` | T-02, T-03 | — | Code |
| T-11 | 1 | Implement `applyFilterCheckbox()` | T-10 | T-12…T-17 | Code |
| T-12 | 1 | Implement `clearFilterCheckbox()` | T-10 | T-11, T-13…T-17 | Code |
| T-13 | 1 | Implement `getVisibleAssignmentCount()` | T-10 | T-11, T-12, T-14…T-17 | Code |
| T-14 | 1 | Implement `getVisibleAssignmentTitles()` | T-10 | T-11…T-13, T-15…T-17 | Code |
| T-15 | 1 | Implement `searchByName()` | T-10 | T-11…T-14, T-16, T-17 | Code |
| T-16 | 1 | Implement `clearSearch()` | T-10 | T-11…T-15, T-17 | Code |
| T-17 | 1 | Implement `expectEmptyState()` and `expectListNotEmpty()` | T-10 | T-11…T-16 | Code |
| T-18 | 1 | TypeScript compile check for page object | T-11…T-17 | — | Validate |
| T-20 | 2 | Create `assignmentFilters.spec.ts` scaffold | T-18, T-04, T-05 | — | Code |
| T-21 | 2 | Implement status filter tests SF-01…SF-08 | T-20 | T-22…T-25 | Code |
| T-22 | 2 | Implement status filter clear test SF-09 | T-20 | T-21, T-23…T-25 | Code |
| T-23 | 2 | Implement multi-select test SF-10 | T-20 | T-21, T-22, T-24, T-25 | Code |
| T-24 | 2 | Implement search tests SR-01, SR-02, SR-03 | T-20 | T-21…T-23, T-25 | Code |
| T-25 | 2 | Implement type filter test TF-01 (conditional) | T-20, T-03 | T-21…T-24 | Code |
| T-26 | 2 | Implement combined filter test CB-01 | T-20 | T-21…T-25 | Code |
| T-27 | 2 | Add Allure metadata to all describe blocks | T-21…T-26 | — | Code |
| T-40 | 3 | Run new spec headed; fix any locator failures | T-27 | — | Validate |
| T-41 | 3 | Run new spec headless | T-40 | — | Validate |
| T-42 | 3 | Run full `tests/Assignments/` suite (regression check) | T-41 | — | Validate |
| T-43 | 3 | Generate Allure report and verify step names | T-41 | T-42 | Validate |
| T-44 | 3 | Final TypeScript compile check (`npx tsc --noEmit`) | T-42 | T-43 | Validate |

---

## Dependency Graph

```
T-00 (pre-flight)
  └── T-01 (inspect UI)
        ├── T-02 (document locators)
        │     └── T-10 (add locator properties)
        │           ├── T-11 (applyFilterCheckbox)   ─┐
        │           ├── T-12 (clearFilterCheckbox)    │
        │           ├── T-13 (getVisibleCount)        ├─ all parallel
        │           ├── T-14 (getVisibleTitles)       │
        │           ├── T-15 (searchByName)           │
        │           ├── T-16 (clearSearch)            │
        │           └── T-17 (expectEmptyState/NotEmpty) ─┘
        │                 └── T-18 (tsc check PO)
        ├── T-03 (confirm filter groups)             ─┐
        ├── T-04 (find searchable title)              ├─ all parallel
        └── T-05 (audit dev data per status)         ─┘
              (all feed into)
                    └── T-20 (spec scaffold)
                          ├── T-21 (SF-01…SF-08)  ─┐
                          ├── T-22 (SF-09)          │
                          ├── T-23 (SF-10)          ├─ all parallel
                          ├── T-24 (SR-01…SR-03)    │
                          ├── T-25 (TF-01)          │
                          └── T-26 (CB-01)         ─┘
                                └── T-27 (Allure metadata)
                                      └── T-40 (run headed)
                                            └── T-41 (run headless)
                                                  ├── T-42 (regression check) ─┐
                                                  └── T-43 (Allure report)     ├─ parallel
                                                        └── T-44 (tsc final)  ─┘
```

---

## Phase 0 — Discovery (Manual Tasks)

> These tasks **cannot be executed by an automation agent**. They require a human to open the live dev environment and inspect the UI. Complete all Phase 0 tasks and update `AssignmentsPage.page.ts` with a discovery comment block before starting Phase 1.

---

### T-00 — Pre-flight: confirm dev environment health

**Type:** Manual validation
**File:** none
**Action:**
```
npx playwright test tests/Assignments/assignmentCreate.spec.ts
```
**Pass condition:** All HP-01 and NG-01…NG-05 tests pass. If any fail, do not proceed — fix the environment first.

---

### T-01 — Inspect filter panel HTML structure in dev

**Type:** Manual discovery
**Environment:** `https://plat3-complete.front.develop.squads-dev.com/admin/assignments`
**Action:**
1. Log in as admin (`adminsw` user from `config/develop.json`)
2. Navigate to Admin View → Learning → Assignments
3. Open browser DevTools → Elements panel
4. Inspect the filter panel and record for each element:

| Element | What to find |
|---------|-------------|
| Filter panel container | `data-marker`, `id`, or `role` attribute |
| Each status checkbox (Active, Retired, Draft, In Progress, Archived, Scheduled, Canceled, Failed) | `aria-label`, `data-marker`, or associated `<label>` text |
| Search text input | `placeholder`, `aria-label`, `name`, or `data-marker` attribute |
| Assignment row in list | `data-marker`, `role`, or class that uniquely identifies a row |
| Assignment title cell | child element of row that contains the assignment name |
| Empty state indicator | element shown when no results match a filter |

**Output required:** A filled-in version of the table above, ready to paste into a code comment.

---

### T-02 — Document locator hints as a comment block in `AssignmentsPage.page.ts`

**Type:** Manual code edit
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Action:**
Add the following comment block immediately after the existing imports, filling in the values discovered in T-01:

```typescript
// ─── FILTER PANEL LOCATOR DISCOVERY (from Phase 0 UI inspection) ───────────
// Filter panel container:    data-marker="???" | role="???" | id="???"
// Status checkbox — Active:  aria-label="Active" | data-marker="???"
// Status checkbox — Retired: aria-label="Retired" | data-marker="???"
// Status checkbox — Draft:   aria-label="Draft" | data-marker="???"
// Status checkbox — In Progress: aria-label="In Progress" | data-marker="???"
// Status checkbox — Archived:    aria-label="Archived" | data-marker="???"
// Status checkbox — Scheduled:   aria-label="Scheduled" | data-marker="???"
// Status checkbox — Canceled:    aria-label="Canceled" | data-marker="???"
// Status checkbox — Failed:      aria-label="Failed" | data-marker="???"
// Search input:              placeholder="???" | aria-label="???"
// Assignment row:            data-marker="???" | role="row"
// Assignment title cell:     [child selector of row] data-marker="???" | role="cell"
// Empty state message:       text="???" | data-marker="???"
// Filter group structure:    [ ] Single group   [ ] Two groups (Status + Type)
// Known searchable title:    "???"
// Status values with NO data in dev: ???
// ────────────────────────────────────────────────────────────────────────────
```

**Pass condition:** All `???` placeholders are replaced with actual values from T-01.

---

### T-03 — Confirm filter group structure

**Type:** Manual discovery
**Action:** While inspecting the UI in T-01, answer:
- Are Status and Assignment Type separate filter groups with separate labels/headings?
- Or is there a single checkbox group containing all values (Active, Retired, Draft, In Progress, Archived, Scheduled, Canceled, Failed)?

**Output required:** Update the comment block from T-02 with the confirmed answer:
```
// Filter group structure:    [x] Single group   [ ] Two groups (Status + Type)
```
**Impact on tasks:** If two groups exist, T-25 (TF-01) is a separate test for the Type group. If one combined group, TF-01 is redundant and must be marked `test.skip` with note: "Type filter is the same checkbox group as Status filter."

---

### T-04 — Identify a known stable searchable assignment title

**Type:** Manual discovery
**Action:** In the Assignments list, find at least one assignment whose title:
- Is predictable (not a random UUID suffix)
- Will remain in the dev environment long-term
- Is distinct enough that a partial search returns only that one (or a small set)

**Output required:** Record the title (or a partial substring) in the comment block:
```
// Known searchable title:    "Auto Assignment HP01"  (example — use real value)
```
This value will be hardcoded in SR-01 (T-24).

---

### T-05 — Audit dev data: confirm at least one assignment per status

**Type:** Manual discovery
**Action:** In the Assignments list, for each status value, check if at least one assignment exists by applying the filter. Record which statuses have data and which do not.

**Output required:** Fill in the comment block:
```
// Status values with NO data in dev: "Failed", "Scheduled"  (example)
```
**Impact on tasks:** Status values with no data → mark corresponding SF-0X test with `test.skip`.

---

## Phase 1 — Extend `AssignmentsPage` Page Object

> All T-11 through T-17 tasks are **independent of each other** and can be implemented in parallel once T-10 is complete.

---

### T-10 — Add locator properties to `AssignmentsPage`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-02 (locator comment block populated), T-03 (filter structure confirmed)

**Action:** Add the following private locator members to the `AssignmentsPage` class body, using the confirmed values from the T-02 comment block. Replace the selector strings with actual values discovered in Phase 0.

```typescript
// ── Filter panel locators (populated from Phase 0 discovery) ─────────────

/** Returns the checkbox locator for a given filter label. */
private filterCheckbox(label: string): Locator {
  // Prefer getByLabel if checkboxes have accessible labels;
  // fall back to data-marker if label lookup is ambiguous.
  return this.page.getByLabel(label, { exact: true });
}

/** Search input in the filter panel */
private readonly nameSearchInput: Locator = this.page.getByPlaceholder(
  "???",  // Replace with actual placeholder from T-01
);

/** All visible assignment rows in the list */
private readonly assignmentListRows: Locator = this.page.locator(
  '[data-marker="???"]',  // Replace with actual row marker from T-01
);

/** Title cells within visible rows */
private readonly assignmentTitleCells: Locator = this.page.locator(
  '[data-marker="???"] [data-marker="???"]',  // Replace: row marker > title cell marker
);

/** Empty state indicator shown when no results match */
private readonly emptyStateIndicator: Locator = this.page.getByText(
  "???",  // Replace with actual empty-state text from T-01
);
```

**Also add** the `Locator` import if not already present:
```typescript
import type { Locator, Page } from "@playwright/test";
```

**Pass condition:** File compiles with `npx tsc --noEmit` (no errors introduced).

---

### T-11 — Implement `applyFilterCheckbox()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-12, T-13, T-14, T-15, T-16, T-17

**Action:** Add this public method to the `AssignmentsPage` class:

```typescript
/**
 * Checks the filter checkbox with the given accessible label.
 * Waits for the list to stabilize after checking.
 */
async applyFilterCheckbox(label: string): Promise<void> {
  await this.reporter.step(`Apply filter checkbox: ${label}`, async () => {
    const checkbox = this.filterCheckbox(label);
    await this.waitForVisible(checkbox, `Filter checkbox: ${label}`);
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await this.waitForNetworkIdle();
  });
}
```

**Note:** `expect` must be imported from `@playwright/test` at the top of the file. Check if it is already imported — if not, add:
```typescript
import { expect } from "@playwright/test";
```

**Pass condition:** Method is present, compiles without errors, wraps step in `reporter.step`.

---

### T-12 — Implement `clearFilterCheckbox()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-13, T-14, T-15, T-16, T-17

**Action:** Add this public method:

```typescript
/**
 * Unchecks the filter checkbox with the given accessible label.
 * Waits for the list to stabilize after unchecking.
 */
async clearFilterCheckbox(label: string): Promise<void> {
  await this.reporter.step(`Clear filter checkbox: ${label}`, async () => {
    const checkbox = this.filterCheckbox(label);
    await this.waitForVisible(checkbox, `Filter checkbox: ${label}`);
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await this.waitForNetworkIdle();
  });
}
```

**Pass condition:** Method present, compiles, uses `reporter.step`.

---

### T-13 — Implement `getVisibleAssignmentCount()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-12, T-14, T-15, T-16, T-17

**Action:** Add this public method:

```typescript
/**
 * Returns the number of assignment rows currently visible in the list.
 * Used for relative assertions (filtered count vs. baseline).
 */
async getVisibleAssignmentCount(): Promise<number> {
  return await this.reporter.step(
    "Get visible assignment count",
    async () => {
      return await this.assignmentListRows.count();
    },
  );
}
```

**Pass condition:** Returns a `Promise<number>`, compiles without errors.

---

### T-14 — Implement `getVisibleAssignmentTitles()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-12, T-13, T-15, T-16, T-17

**Action:** Add this public method:

```typescript
/**
 * Returns the text content of all visible assignment title cells.
 * Used to assert that all visible titles match a filter criterion.
 */
async getVisibleAssignmentTitles(): Promise<string[]> {
  return await this.reporter.step(
    "Get visible assignment titles",
    async () => {
      const count = await this.assignmentTitleCells.count();
      const titles: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = await this.assignmentTitleCells.nth(i).textContent();
        titles.push(text?.trim() ?? "");
      }
      return titles;
    },
  );
}
```

**Pass condition:** Returns `Promise<string[]>`, compiles without errors.

---

### T-15 — Implement `searchByName()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-12, T-13, T-14, T-16, T-17

**Action:** Add this public method:

```typescript
/**
 * Types a search term into the name search input and waits for
 * the list to stabilize.
 */
async searchByName(term: string): Promise<void> {
  await this.reporter.step(`Search assignments by name: "${term}"`, async () => {
    await this.waitForVisible(this.nameSearchInput, "Name search input");
    await this.fill(this.nameSearchInput, term, "Name search input");
    await this.waitForNetworkIdle();
  });
}
```

**Pass condition:** Method present, uses `fill` from BasePage, compiles.

---

### T-16 — Implement `clearSearch()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-12, T-13, T-14, T-15, T-17

**Action:** Add this public method:

```typescript
/**
 * Clears the name search input and waits for the list to restore.
 * Uses triple-click + Backspace to reliably clear the field.
 */
async clearSearch(): Promise<void> {
  await this.reporter.step("Clear name search filter", async () => {
    await this.waitForVisible(this.nameSearchInput, "Name search input");
    await this.nameSearchInput.click({ clickCount: 3 });
    await this.page.keyboard.press("Backspace");
    await this.waitForNetworkIdle();
  });
}
```

**Pass condition:** Method present, compiles.

---

### T-17 — Implement `expectEmptyState()` and `expectListNotEmpty()`

**Type:** Code
**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Depends on:** T-10
**Parallel with:** T-11, T-12, T-13, T-14, T-15, T-16

**Action:** Add both assertion methods:

```typescript
/**
 * Asserts that the empty-state / no-results indicator is visible.
 * Called after applying a filter that yields zero results.
 */
async expectEmptyState(): Promise<void> {
  await this.reporter.step("Assert empty state is visible", async () => {
    await expect(this.emptyStateIndicator).toBeVisible({ timeout: 15_000 });
  });
}

/**
 * Asserts that at least one assignment row is visible in the list.
 */
async expectListNotEmpty(): Promise<void> {
  await this.reporter.step("Assert assignment list is not empty", async () => {
    await expect(this.assignmentListRows.first()).toBeVisible({ timeout: 15_000 });
  });
}
```

**Pass condition:** Both methods present, compile, wrap in `reporter.step`.

---

### T-18 — TypeScript compile check for page object

**Type:** Validate
**Depends on:** T-11, T-12, T-13, T-14, T-15, T-16, T-17
**Action:**
```bash
npx tsc --noEmit
```
**Pass condition:** Exit code 0. Fix any type errors before proceeding to Phase 2.

---

## Phase 2 — Create `assignmentFilters.spec.ts`

> T-21 through T-26 are **independent of each other** and can be implemented in parallel after T-20 creates the file scaffold.

---

### T-20 — Create `assignmentFilters.spec.ts` scaffold

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts` _(create new)_
**Depends on:** T-18, T-04 (known searchable title confirmed), T-05 (dev data status audit complete)

**Action:** Create the file with the following scaffold. Replace `"KNOWN_TITLE_SUBSTRING"` with the value discovered in T-04.

```typescript
// spec: specs-assignment-filters-automation/spec.md
// plan: specs-assignment-filters-automation/plan.md
// Covers: SF-01…SF-10, SR-01…SR-03, TF-01, CB-01

import { test, expect } from "../../fixtures/loginFixture";
import { AdminHomePage } from "../../pageObjects/AdminHomePage.page";
import { AssignmentsPage } from "../../pageObjects/Assignments/AssignmentsPage.page";

/**
 * Use fresh session per test to avoid OAuth redirect issues.
 * Consistent with assignmentCreate.spec.ts pattern.
 */
test.use({ storageState: { cookies: [], origins: [] } });

// Replace with the stable assignment title substring found in Phase 0 / T-04.
const KNOWN_TITLE_SUBSTRING = "REPLACE_WITH_ACTUAL_VALUE_FROM_T04";

let adminHomePage: AdminHomePage;
let assignmentsPage: AssignmentsPage;
let baselineCount: number;

test.beforeEach(async ({ page, lognToPageFixture }) => {
  void lognToPageFixture;
  page.on("dialog", (dialog) => void dialog.accept());
  adminHomePage = new AdminHomePage(page);
  assignmentsPage = new AssignmentsPage(page);
  await adminHomePage.navigateToAssignments();
  // Capture baseline (unfiltered) count for relative assertions.
  baselineCount = await assignmentsPage.getVisibleAssignmentCount();
});
```

**Pass condition:** File created, imports resolve, `npx tsc --noEmit` passes.

---

### T-21 — Implement status filter checkbox tests SF-01…SF-08

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20
**Parallel with:** T-22, T-23, T-24, T-25, T-26

**Action:** Append the following describe block to the file.

> For status values that T-05 confirmed have **no data in dev**, replace the test body with `test.skip(true, "No assignments with status '<value>' in dev environment")`.

```typescript
test.describe("Status filter — checkbox", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("status-filter");
  });

  const STATUS_VALUES = [
    "Active",
    "Retired",
    "Draft",
    "In Progress",
    "Archived",
    "Scheduled",
    "Canceled",
    "Failed",
  ] as const;

  // ── SF-01…SF-08: apply each status checkbox, assert count drops ──────────

  for (const status of STATUS_VALUES) {
    test(`SF — Apply "${status}" filter → list updates`, async () => {
      await assignmentsPage.applyFilterCheckbox(status);
      const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

      if (filteredCount === 0) {
        // No data for this status in dev — assert empty state is shown.
        await assignmentsPage.expectEmptyState();
      } else {
        // Filtered count must be less than the unfiltered baseline.
        expect(filteredCount).toBeLessThan(baselineCount);
      }
    });
  }
});
```

**Pass condition:** 8 parameterised tests created, compile cleanly.

---

### T-22 — Implement status filter clear test SF-09

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20
**Parallel with:** T-21, T-23, T-24, T-25, T-26

**Action:** Append the following describe block:

```typescript
test.describe("Status filter — clear", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("status-filter");
  });

  test("SF-09 — Uncheck 'Active' filter → full list restored", async () => {
    // Apply
    await assignmentsPage.applyFilterCheckbox("Active");
    const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

    // Clear
    await assignmentsPage.clearFilterCheckbox("Active");
    const restoredCount = await assignmentsPage.getVisibleAssignmentCount();

    // Restored count must be ≥ filtered count (and ideally equal to baseline).
    expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
    // Prefer exact restoration:
    expect(restoredCount).toBe(baselineCount);
  });
});
```

**Pass condition:** Test compiles and is logically correct.

---

### T-23 — Implement multi-select test SF-10

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20
**Parallel with:** T-21, T-22, T-24, T-25, T-26

**Action:** Append the following describe block:

```typescript
test.describe("Status filter — multi-select", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("status-filter");
  });

  test("SF-10 — Apply 'Active' + 'Draft' → combined results shown", async () => {
    // Apply Active first, record count
    await assignmentsPage.applyFilterCheckbox("Active");
    const activeCount = await assignmentsPage.getVisibleAssignmentCount();

    // Add Draft to the selection
    await assignmentsPage.applyFilterCheckbox("Draft");
    const combinedCount = await assignmentsPage.getVisibleAssignmentCount();

    // Combined must be ≥ Active-only count (Draft adds more rows).
    expect(combinedCount).toBeGreaterThanOrEqual(activeCount);
    // Combined must be ≤ baseline (still a subset of all assignments).
    expect(combinedCount).toBeLessThanOrEqual(baselineCount);

    // Cleanup: uncheck both
    await assignmentsPage.clearFilterCheckbox("Active");
    await assignmentsPage.clearFilterCheckbox("Draft");
  });
});
```

**Pass condition:** Test compiles, cleanup is present at end of test.

---

### T-24 — Implement search filter tests SR-01, SR-02, SR-03

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20, T-04 (known title confirmed and set in scaffold via `KNOWN_TITLE_SUBSTRING`)
**Parallel with:** T-21, T-22, T-23, T-25, T-26

**Action:** Append the following describe block:

```typescript
test.describe("Search by name filter", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("search-filter");
  });

  test("SR-01 — Search known term → only matching titles shown", async () => {
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const titles = await assignmentsPage.getVisibleAssignmentTitles();

    // Every visible title must contain the search term (case-insensitive).
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain(
        KNOWN_TITLE_SUBSTRING.toLowerCase(),
      );
    }
  });

  test("SR-02 — Search non-matching term → empty state shown", async () => {
    await assignmentsPage.searchByName("__NO_MATCH_TERM_ZZZ_XYZ__");
    await assignmentsPage.expectEmptyState();
  });

  test("SR-03 — Clear search → full list restored", async () => {
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

    await assignmentsPage.clearSearch();
    const restoredCount = await assignmentsPage.getVisibleAssignmentCount();

    expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
    expect(restoredCount).toBe(baselineCount);
  });
});
```

**Pass condition:** 3 tests compile. `KNOWN_TITLE_SUBSTRING` is referenced correctly.

---

### T-25 — Implement assignment type filter test TF-01 (conditional)

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20, T-03 (filter group structure confirmed)
**Parallel with:** T-21, T-22, T-23, T-24, T-26

**Action:**

**If T-03 confirmed a single combined filter group** (no separate Type filter):
```typescript
test.describe("Assignment type filter", () => {
  test("TF-01 — Assignment type filter (skipped: type filter is same as status filter group)", async () => {
    test.skip(
      true,
      "Phase 0 T-03 confirmed: no separate Assignment Type filter group. " +
        "Type values are included in the Status filter checkbox group (SF-01…SF-08).",
    );
  });
});
```

**If T-03 confirmed two separate filter groups** (Status + Type are distinct):
```typescript
// Replace "FIRST_TYPE_VALUE" with the first actual type label from T-03
const FIRST_TYPE_VALUE = "REPLACE_WITH_ACTUAL_TYPE_VALUE_FROM_T03";

test.describe("Assignment type filter", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("type-filter");
  });

  test(`TF-01 — Apply type "${FIRST_TYPE_VALUE}" → list updates`, async () => {
    await assignmentsPage.applyFilterCheckbox(FIRST_TYPE_VALUE);
    const filteredCount = await assignmentsPage.getVisibleAssignmentCount();

    if (filteredCount === 0) {
      await assignmentsPage.expectEmptyState();
    } else {
      expect(filteredCount).toBeLessThan(baselineCount);
    }

    // Cleanup
    await assignmentsPage.clearFilterCheckbox(FIRST_TYPE_VALUE);
  });
});
```

**Pass condition:** Test is present (either implemented or skipped with explanation).

---

### T-26 — Implement combined filter test CB-01

**Type:** Code
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-20, T-04
**Parallel with:** T-21, T-22, T-23, T-24, T-25

**Action:** Append the following describe block:

```typescript
test.describe("Combined filters", () => {
  test.beforeEach(async ({ reporter }) => {
    await reporter.addEpic("Assignments");
    await reporter.addFeature("Assignment Filters");
    await reporter.addTag("filters");
    await reporter.addTag("combined-filter");
  });

  test("CB-01 — Apply 'Active' filter + search by known name → intersection shown", async () => {
    // Apply status filter first
    await assignmentsPage.applyFilterCheckbox("Active");
    const activeCount = await assignmentsPage.getVisibleAssignmentCount();

    // Then apply search on top of the filter
    await assignmentsPage.searchByName(KNOWN_TITLE_SUBSTRING);
    const combinedCount = await assignmentsPage.getVisibleAssignmentCount();

    if (combinedCount > 0) {
      // All visible titles must contain the search term
      const titles = await assignmentsPage.getVisibleAssignmentTitles();
      for (const title of titles) {
        expect(title.toLowerCase()).toContain(
          KNOWN_TITLE_SUBSTRING.toLowerCase(),
        );
      }
      // Combined must be ≤ Active-only count
      expect(combinedCount).toBeLessThanOrEqual(activeCount);
    } else {
      // No assignments match both criteria in dev — acceptable outcome
      await assignmentsPage.expectEmptyState();
    }

    // Cleanup: clear search first, then uncheck filter
    await assignmentsPage.clearSearch();
    await assignmentsPage.clearFilterCheckbox("Active");
  });
});
```

**Pass condition:** Test compiles, has cleanup, handles zero-result case.

---

### T-27 — Verify Allure metadata is present on all describe blocks

**Type:** Code review + fix
**File:** `tests/Assignments/assignmentFilters.spec.ts`
**Depends on:** T-21, T-22, T-23, T-24, T-25, T-26

**Action:**
1. Verify each `test.describe` block has a `test.beforeEach` calling `reporter.addEpic("Assignments")`, `reporter.addFeature("Assignment Filters")`, and `reporter.addTag("filters")` plus a group-specific tag.
2. Confirm `reporter` is destructured from the fixture parameter: `async ({ reporter }) => { ... }`
3. Check `IReporter` interface at `framework/reporting/IReporter.ts` to confirm `addEpic`, `addFeature`, `addTag` method signatures. If any method does not exist on `IReporter`, use the correct available method (e.g., `addLabel("epic", "Assignments")` or similar).
4. Fix any method name mismatches found.

**Pass condition:** All describe blocks have Allure metadata; `npx tsc --noEmit` passes.

---

## Phase 3 — Validation

---

### T-40 — Run new spec in headed mode; fix locator failures

**Type:** Validate + fix
**Depends on:** T-27
**Action:**
```bash
npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed
```
**If any test fails with a timeout/locator error:**
1. Open the browser at the point of failure (use `--debug` flag if needed)
2. Inspect the element to find the correct selector
3. Update the locator in `AssignmentsPage.page.ts`
4. Re-run until all tests pass

**Pass condition:** All tests pass in headed mode with no locator timeout errors.

---

### T-41 — Run new spec in headless mode

**Type:** Validate
**Depends on:** T-40
**Action:**
```bash
npx playwright test tests/Assignments/assignmentFilters.spec.ts
```
**Pass condition:** Exit code 0; same pass/skip counts as T-40.

---

### T-42 — Regression check: full Assignments suite

**Type:** Validate
**Depends on:** T-41
**Parallel with:** T-43
**Action:**
```bash
npx playwright test tests/Assignments/
```
**Pass condition:** `assignmentCreate.spec.ts` tests (HP-01, NG-01…NG-05) all pass. No new failures introduced.

---

### T-43 — Generate and inspect Allure report

**Type:** Validate
**Depends on:** T-41
**Parallel with:** T-42
**Action:**
```bash
npm run report:allure
```
Open the report and verify:
- All filter test cases appear under the correct Epic (`Assignments`) and Feature (`Assignment Filters`)
- Each test has labelled steps (no unnamed steps)
- Skipped tests show the skip reason message

**Pass condition:** All test steps are named; no empty step names; Allure categorization correct.

---

### T-44 — Final TypeScript compile check

**Type:** Validate
**Depends on:** T-42, T-43
**Action:**
```bash
npx tsc --noEmit
```
**Pass condition:** Exit code 0 with no errors or warnings.

---

## Parallelization Notes

| Parallel group | Tasks | When |
|---------------|-------|------|
| Phase 0 discovery (partial) | T-03, T-04, T-05 | All can happen simultaneously while inspecting the UI in T-01 |
| Phase 1 methods | T-11, T-12, T-13, T-14, T-15, T-16, T-17 | All independent; can be implemented simultaneously after T-10 |
| Phase 2 test groups | T-21, T-22, T-23, T-24, T-25, T-26 | All independent; can be written simultaneously after T-20 scaffold exists |
| Phase 3 final checks | T-42, T-43 | Can run simultaneously after T-41 |

---

## Validation Checkpoints

| After | Command | Must pass before |
|-------|---------|-----------------|
| T-10 | `npx tsc --noEmit` | T-11…T-17 |
| T-18 | `npx tsc --noEmit` | T-20 |
| T-27 | `npx tsc --noEmit` | T-40 |
| T-40 | Headed run passes | T-41 |
| T-41 | Headless run passes | T-42, T-43 |
| T-44 | Final compile clean | Done |

---

## Observations

1. **Phase 0 is the hard blocker.** None of the code tasks can be made correct without the Phase 0 locator discovery. The comment block scaffolded in T-02 acts as the contract between Phase 0 and Phase 1 — implementation agents must not guess selectors.

2. **`reporter.addEpic` / `reporter.addFeature` availability unconfirmed.** The `IReporter` interface must be checked in T-27 before assuming these methods exist. If the interface only has `addLabel(key, value)` or `step()`, the Allure metadata calls must be adapted accordingly.

3. **`waitForNetworkIdle()` may be too aggressive.** On the Assignments list page, checking a checkbox may trigger a debounced filter (not a full network request). If `waitForNetworkIdle()` times out, replace with `page.waitForTimeout(500)` or wait for a specific DOM change (e.g., row count to change). This should be caught in T-40.

4. **`clearSearch()` triple-click approach.** Some input fields don't clear reliably with triple-click + Backspace if they are controlled inputs (React/Angular). If SR-03 fails in T-40, try `fill("", ...)` or look for a dedicated clear button (X icon on the input) and click that instead.

5. **`baselineCount` scoping.** `baselineCount` is a module-level `let` variable. In Playwright's single-worker sequential execution, this is safe. If tests are ever run in parallel mode, this variable must be moved inside each test or into a `test.describe`-scoped fixture.

6. **TF-01 depends on T-03.** The type filter test has two completely different implementations depending on whether one or two filter groups exist. This task must not be written until T-03 is complete.

---

## Open Blockers

_All open questions from spec and plan have been resolved. Tasks are ready for implementation once Phase 0 is complete._

| Blocker | Resolution Required Before |
|---------|--------------------------|
| Phase 0 locator discovery (T-01…T-05) | T-10 (no code can be written without real selectors) |

---

_End of tasks.md_
