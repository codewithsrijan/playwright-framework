# Implementation Plan — Assignment Filters Automation

**Slug:** `assignment-filters-automation`
**Repo:** `ucm-playwright-automation`
**Date:** 2026-05-25
**Input artifacts:** `specs/repo-map.md`, `specs-assignment-filters-automation/spec.md`
**Note:** `design.md` and `architecture.md` are not applicable — this is a pure test-automation addition with no UI code changes, no backend changes, and no architectural modifications.

---

## Technical Context

### What exists today

| Artifact | State |
|---------|-------|
| `pageObjects/Assignments/AssignmentsPage.page.ts` | Exists — contains only `navigateToNewAssignment()`. Zero filter methods or locators |
| `tests/Assignments/assignmentCreate.spec.ts` | Exists — covers creation and wizard validation |
| `pageObjects/base/BasePage.ts` | Exists — provides `click`, `fill`, `waitForVisible`, `assertVisible`, etc., all reporter-wrapped |
| `fixtures/loginFixture.ts` | Exists — provides `lognToPageFixture` (auto-login) and `test` export |
| `framework/reporting/` | Exists — `ReporterRegistry.getReporter()` / `reporter.step()` pattern |

### What must be built

| Artifact | Action |
|---------|--------|
| `pageObjects/Assignments/AssignmentsPage.page.ts` | **Extend** — add filter panel methods |
| `tests/Assignments/assignmentFilters.spec.ts` | **Create new** — filter test suite |

### Filter UI mechanism (confirmed)

- **Control type:** Checkboxes (not dropdowns)
- **Filter groups confirmed:**
  - **Status / filter checkboxes** with values: `Active`, `Retired`, `Failed`, `Scheduled`, `Draft`, `In Progress`, `Archived`, `Canceled`
  - **Search by name** — text input
- **Clear mechanism:** Deselect the checkbox (no separate "clear all" button confirmed)
- **Note:** During planning it emerged that the values the user provided for "Assignment Type" filter overlap with status-like values. The implementation phase must confirm whether these are two separate filter groups (Status + Type) or a single combined filter group with all these values as checkbox options.

### Assertion strategy

Because tests rely on existing dev data (no seeding), all assertions are **relative**:
- After checking a status checkbox → visible rows contain only assignments of that status, OR the visible count is less than the pre-filter total
- After typing a search term → all visible titles contain the term (case-insensitive)
- After unchecking a checkbox → list count returns to the pre-filter value

---

## Repo Scope and Ownership

| Repository | Files Changed | Type |
|-----------|--------------|------|
| `ucm-playwright-automation` | `pageObjects/Assignments/AssignmentsPage.page.ts` | Modify (extend) |
| `ucm-playwright-automation` | `tests/Assignments/assignmentFilters.spec.ts` | Create new |

No other repositories touched.

---

## Implementation Phases

### Phase 0 — Discovery (Pre-implementation prerequisite)

> **Must be completed before writing any code.** Cannot be automated — requires a human to inspect the live UI.

| Step | Action | Output |
|------|--------|--------|
| 0.1 | Open `Admin View → Learning → Assignments` in the develop environment | Confirm the page loads at the expected URL |
| 0.2 | Inspect the filter panel HTML structure | Identify: container element (`data-marker`, `role`, `id`), each checkbox's `data-marker` or `aria-label`, the search input's accessible name or placeholder |
| 0.3 | Confirm filter group names | Are there two separate groups ("Status" and "Assignment Type") or one combined checkbox group? List all visible checkbox labels |
| 0.4 | Confirm search input | What is the accessible name or placeholder of the search text box? |
| 0.5 | Record locator hints | Add confirmed `data-marker` values / ARIA roles to a comment block at the top of `AssignmentsPage.page.ts` before writing any methods |
| 0.6 | Identify a known searchable assignment title | Find at least one assignment in dev whose title is predictable and stable (e.g. "Auto Assignment …") — record it for use in search test cases |
| 0.7 | Confirm at least one assignment exists per status value | Verify dev has at least one assignment in `Retired`, `Active`, `Draft`, `In Progress`, `Archived`, `Canceled`, `Failed`, `Scheduled` states — or document which status values have no data |

---

### Phase 1 — Extend `AssignmentsPage` Page Object

**File:** `pageObjects/Assignments/AssignmentsPage.page.ts`
**Approach:** Add filter-related methods to the existing class. Do not create a separate file — the filter panel is part of the same page.

#### 1.1 — Add locator properties

Add private readonly locator properties for:

| Locator name | Target element | Selector strategy |
|-------------|---------------|------------------|
| `filterCheckbox(value)` | Checkbox for a given filter label | `getByLabel(value)` or `page.locator('[data-marker="..."]')` based on Phase 0 discovery |
| `nameSearchInput` | The search text input | `getByRole('searchbox')` or `getByPlaceholder(...)` based on Phase 0 discovery |
| `assignmentListRows` | All visible assignment rows in the list | Role-based: `getByRole('row')` within the list region, or `page.locator('[data-marker="assignmentRow"]')` |
| `assignmentTitles` | Title cells within visible rows | Child locator of `assignmentListRows` |
| `emptyStateIndicator` | "No results" / empty list message | `getByText(...)` or `getByRole('status')` — confirm label during Phase 0 |

#### 1.2 — Add public methods

All methods must:
- Wrap logic in `await this.reporter.step("...", async () => { ... })`
- Use `BasePage` helpers (`click`, `fill`, `waitForVisible`) where applicable
- Accept parameters rather than hardcoding filter values

| Method | Signature | Description |
|--------|-----------|-------------|
| `applyFilterCheckbox` | `async applyFilterCheckbox(label: string): Promise<void>` | Check the checkbox with the given accessible label. Assert it is checked after clicking |
| `clearFilterCheckbox` | `async clearFilterCheckbox(label: string): Promise<void>` | Uncheck the checkbox with the given label. Assert it is unchecked after clicking |
| `searchByName` | `async searchByName(term: string): Promise<void>` | Type `term` into the search input and wait for the list to stabilize (network idle or list re-render) |
| `clearSearch` | `async clearSearch(): Promise<void>` | Clear the search input (triple-click + delete, or clear button) and wait for the list to stabilize |
| `getVisibleAssignmentCount` | `async getVisibleAssignmentCount(): Promise<number>` | Return the count of visible assignment rows |
| `getVisibleAssignmentTitles` | `async getVisibleAssignmentTitles(): Promise<string[]>` | Return an array of all visible assignment title strings |
| `expectEmptyState` | `async expectEmptyState(): Promise<void>` | Assert that the empty-state / no-results indicator is visible |
| `expectListNotEmpty` | `async expectListNotEmpty(): Promise<void>` | Assert that at least one assignment row is visible |

#### 1.3 — Backward compatibility

All existing methods (`navigateToNewAssignment`) remain unchanged. The `newAssignmentButton` locator and all existing tests are unaffected.

---

### Phase 2 — Create `assignmentFilters.spec.ts`

**File:** `tests/Assignments/assignmentFilters.spec.ts`

#### 2.1 — File structure and imports

```
import { test, expect } from "../../fixtures/loginFixture";
import { AdminHomePage } from "../../pageObjects/AdminHomePage.page";
import { AssignmentsPage } from "../../pageObjects/Assignments/AssignmentsPage.page";

test.use({ storageState: { cookies: [], origins: [] } });

let adminHomePage: AdminHomePage;
let assignmentsPage: AssignmentsPage;

test.beforeEach(async ({ page, lognToPageFixture }) => {
  void lognToPageFixture;
  adminHomePage = new AdminHomePage(page);
  assignmentsPage = new AssignmentsPage(page);
  await adminHomePage.navigateToAssignments();
  // Record baseline count before any filter is applied
});
```

#### 2.2 — Test groups and cases

| Group | Test ID | Description | Assertion type |
|-------|---------|-------------|---------------|
| **Status filter — checkbox** | SF-01 | Apply "Active" checkbox → list updates | Visible count < baseline OR all titles verified Active |
| | SF-02 | Apply "Retired" checkbox → list updates | Visible count < baseline; no Active assignments visible |
| | SF-03 | Apply "Draft" checkbox → list updates | Relative count drop |
| | SF-04 | Apply "In Progress" checkbox → list updates | Relative count drop |
| | SF-05 | Apply "Archived" checkbox → list updates | Relative count drop |
| | SF-06 | Apply "Scheduled" checkbox → list updates | Relative count drop |
| | SF-07 | Apply "Canceled" checkbox → list updates | Relative count drop |
| | SF-08 | Apply "Failed" checkbox → list updates | Relative count drop |
| | SF-09 | Uncheck "Active" → full list restored | Count returns to baseline |
| **Multi-select** | SF-10 | Apply "Active" + "Draft" → only Active and Draft assignments visible | Count ≥ each individual count |
| **Search filter** | SR-01 | Search known term → only matching titles shown | All visible titles contain term (case-insensitive) |
| | SR-02 | Search non-matching term → empty state shown | `expectEmptyState()` passes |
| | SR-03 | Clear search → full list restored | Count returns to baseline |
| **Type filter** | TF-01 | Apply type filter (value TBD from Phase 0) → list updates | Relative count drop (or skip if type filter == status filter) |
| **Combined** | CB-01 | Apply status "Active" + search by known name → intersection shown | Visible titles contain term AND are Active status |

> **Note on SF-03 through SF-08:** If the dev environment has no assignments in a given status (e.g. "Failed"), the test will record a count of 0 and `expectEmptyState()`. These tests should use `test.skip` with a comment if the status has no data — this must be confirmed in Phase 0 step 0.7.

#### 2.3 — Allure metadata

Each `test.describe` block must include `beforeEach` Allure labelling:
```typescript
test.beforeEach(async ({ reporter }) => {
  reporter.addEpic("Assignments");
  reporter.addFeature("Assignment Filters");
  reporter.addTag("filters");
});
```

---

### Phase 3 — Validation and Cleanup

| Step | Action |
|------|--------|
| 3.1 | Run the new spec in headed mode locally: `npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed` |
| 3.2 | Fix any locator failures discovered during live run |
| 3.3 | Run in headless mode: `npx playwright test tests/Assignments/assignmentFilters.spec.ts` |
| 3.4 | Generate and open Allure report: `npm run report:allure` — verify all steps are named correctly |
| 3.5 | Run the full `tests/Assignments/` suite to confirm no regression in existing `assignmentCreate.spec.ts` |
| 3.6 | Review for any `any` types or strict TypeScript issues |

---

## Dependencies and Prerequisites

| # | Prerequisite | Blocking? |
|---|-------------|-----------|
| P-01 | Phase 0 discovery complete — locators for filter checkboxes and search input identified | Yes — Phase 1 cannot start without filter locators |
| P-02 | Dev environment accessible and authenticated (`config/develop.json` provisioned) | Yes |
| P-03 | Dev environment has ≥1 assignment in `Active` and `Retired` status | Yes — SF-01, SF-02 are the primary test cases |
| P-04 | At least one assignment with a known, stable, searchable title exists in dev | Yes — SR-01 requires a known term |
| P-05 | `assignmentCreate.spec.ts` tests still passing (baseline check before starting) | Yes — confirms environment is healthy |

---

## Risk Controls

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Filter locators change between dev deploys | Medium | Use `data-marker` or `aria-label` based selectors; avoid positional XPath |
| Dev environment has no assignments in rare statuses (Failed, Scheduled) | High | Wrap those tests with a skip guard if count = 0; document in test comments |
| Checkbox state check is flaky (async re-render after click) | Medium | Use `waitForNetworkIdle()` or wait for list count to stabilize after checking |
| Multiple filter values selected simultaneously changes assertion logic | Low | SR-01 captures baseline count before any filter; restore after each test via `clearFilterCheckbox()` |
| Search triggers on every keypress (not on Enter/submit) | Low | After `fill()`, call `page.waitForLoadState('networkidle')` before asserting — already available via `BasePage.waitForNetworkIdle()` |
| `lognToPageFixture` re-login adds ~5-10s per test | Low | Acceptable; total suite time well within 5-min timeout per test |

---

## Validation Strategy

| Gate | Command | Pass Condition |
|------|---------|---------------|
| Pre-flight | `npx playwright test tests/Assignments/assignmentCreate.spec.ts` | All existing tests pass |
| New suite (headed) | `npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed` | No locator timeout failures |
| New suite (headless) | `npx playwright test tests/Assignments/assignmentFilters.spec.ts` | Exit code 0 |
| Full Assignments suite | `npx playwright test tests/Assignments/` | No regressions |
| Allure report | `npm run report:allure` | All steps named; no unnamed steps |

---

## Definition of Done

- [ ] Phase 0 discovery complete — filter locators documented in code comments
- [ ] `AssignmentsPage.page.ts` extended with all 8 filter methods (Phase 1.2)
- [ ] `tests/Assignments/assignmentFilters.spec.ts` created with all test groups (Phase 2.2)
- [ ] All tests pass headless locally
- [ ] No regressions in existing `assignmentCreate.spec.ts`
- [ ] Allure report shows correct step hierarchy for filter tests
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Status values with no data in dev are documented and marked `test.skip` with explanation

---

## Observations

1. **Filter UI is checkbox-based, not dropdown-based.** This is an important implementation detail: applying a filter means calling `.check()` on a checkbox locator, and clearing it means `.uncheck()`. This is different from a `selectOption()` approach. The `BasePage.check()` and `BasePage.uncheck()` helpers should be used.

2. **"Assignment Type" vs "Status" ambiguity.** When asked for Assignment Type filter values, the user provided: Failed, Scheduled, Draft, In Progress, Archived, Canceled — all of which are status-like values. This strongly suggests that either: (a) there is only one filter group with all these values as checkboxes, or (b) the Status and Type filters share the same set of values. Phase 0 discovery must confirm whether these appear under one filter group or two separate groups. If they are one group, the plan's test cases for "Assignment Type" (TF-01) collapse into the Status filter test cases.

3. **Baseline count capture strategy.** Because we rely on existing dev data, each `beforeEach` should capture the total assignment count *before* applying any filter. This baseline enables relative assertions ("count after filter < baseline") without hardcoding expected values. This baseline variable must be scoped at the describe level.

4. **Skip guards for empty-status tests.** SF-03 through SF-08 test statuses that may have zero assignments in dev (e.g. "Failed", "Scheduled"). Rather than failing, these tests should use a programmatic skip:
   ```typescript
   const count = await assignmentsPage.getVisibleAssignmentCount();
   if (count === 0) test.skip();
   ```
   This keeps the suite green while documenting the gap.

5. **`navigateToAssignments()` XPath typo.** The existing `AdminHomePage` uses `data-marker="assignmetns"` (misspelled). This is pre-existing and should not be changed in this work — changing it could break the existing test. It is flagged for a separate cleanup task.

6. **No Allure label helper for `addEpic` / `addFeature` on `IReporter`.** The existing spec in `assignmentCreate.spec.ts` does not use `reporter.addEpic()` / `reporter.addFeature()` in `beforeEach`. Check the `IReporter` interface to confirm which label methods are available before adding Allure metadata in Phase 2.3.

---

## Open Questions

_All open questions from the spec have been resolved. No blocking unknowns remain._

| # | Question | Resolution |
|---|----------|-----------|
| OQ-01 | Assignment Type filter values | Resolved: values are Failed, Scheduled, Draft, In Progress, Archived, Canceled (plus Active and Retired from spec). Likely one combined checkbox group — Phase 0 to confirm |
| OQ-02 | Visible total count in UI | Deferred to Phase 0 — plan uses `getVisibleAssignmentCount()` regardless |
| OQ-03 | Clear filter mechanism | Resolved: filters are checkboxes — clear = uncheck |
| OQ-04 | Status values beyond Active/Retired | Resolved: Failed, Scheduled, Draft, In Progress, Archived, Canceled |

---

_End of plan.md_
