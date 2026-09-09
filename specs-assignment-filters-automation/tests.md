# Test Plan — Assignment Filters Automation

**Slug:** `assignment-filters-automation`
**Repo:** `ucm-playwright-automation`
**Date:** 2026-05-25
**Source artifacts:** `spec.md`, `plan.md`, `tasks.md`
**Note:** `architecture.md` is not applicable — no backend, no schema, no service changes. All tests are Playwright E2E browser tests targeting the Percipio UCM admin UI.

---

## Test Scope and Objectives

### What is being tested

The **Assignments list page filter panel** in Admin View → Learning → Assignments:

| Filter | Mechanism | Values |
|--------|-----------|--------|
| Status / type checkboxes | Checkbox (check = apply, uncheck = clear) | Active, Retired, Draft, In Progress, Archived, Scheduled, Canceled, Failed |
| Name/title search | Text input | Free-form text |
| Combined | Status checkbox + Search simultaneously | Intersection of both |

### What is NOT being tested

- Assignment creation, editing, or deletion (covered by `assignmentCreate.spec.ts`)
- Sort order of the list
- Pagination
- Assignment detail page
- API-level filter parameters (backend contract)
- Stage / AWS environments

### Test objectives

1. Prove that each status checkbox, when checked, updates the visible list to show only matching assignments (or an empty state if no data)
2. Prove that unchecking a checkbox restores the full unfiltered list
3. Prove that the name search input returns only title-matching rows
4. Prove that searching for a non-existent term shows an empty-state indicator
5. Prove that selecting multiple checkboxes simultaneously returns the union of results
6. Prove that combining a checkbox filter with a name search shows the intersection
7. Confirm all test steps appear correctly in the Allure report
8. Confirm the suite runs headless in CI without failure

---

## Test Pyramid / Layering

> This repository IS the test layer — there is no application code to unit test here.
> The "pyramid" for a Playwright automation project maps to: page object method
> correctness → individual E2E scenario → full suite regression.

```
                    ┌─────────────────────┐
                    │  Full Suite CI Run  │  ← T-41, T-42 (1 run, headless)
                    └─────────────────────┘
               ┌───────────────────────────────┐
               │  Individual E2E Scenarios      │  ← SF-*, SR-*, TF-*, CB-* (15 tests)
               └───────────────────────────────┘
          ┌─────────────────────────────────────────┐
          │  Page Object Method Validation (headed)  │  ← T-40 (headed run, catch locator errors)
          └─────────────────────────────────────────┘
     ┌───────────────────────────────────────────────────┐
     │  Locator Discovery + Compile Check                 │  ← T-01→T-05, T-18 (Phase 0 + tsc)
     └───────────────────────────────────────────────────┘
```

| Layer | Purpose | When to run | Owner |
|-------|---------|-------------|-------|
| **Locator + compile** | Validate selectors exist in live DOM; code compiles | Phase 0 + after each Phase 1 task | Developer |
| **Headed E2E** | Catch visual/timing issues; confirm filters work interactively | After each test group is written (T-40) | Developer |
| **Headless E2E** | Full suite in CI-equivalent mode | Before PR; in Jenkins | CI / Developer |
| **Regression** | Confirm no `assignmentCreate.spec.ts` regressions | After T-41 | CI / Developer |

---

## Per-Repo Test Inventory

### `ucm-playwright-automation`

| File | Status | Test count | Coverage |
|------|--------|-----------|---------|
| `tests/Assignments/assignmentCreate.spec.ts` | Existing — do not modify | 5 (HP-01, NG-01…NG-05) | Assignment creation and wizard validation |
| `tests/Assignments/assignmentFilters.spec.ts` | **New — create in T-20** | 15 (SF-01…SF-10, SR-01…SR-03, TF-01, CB-01) | Assignment list filter panel |

**Total new test cases:** 15
**Total Assignments coverage after this work:** 20 tests

---

## Test Case Matrix

> Every acceptance criterion from `spec.md` must map to at least one test case.
> Gate: all 10 ACs are covered — verified below.

| AC ID | Criterion | Test Case(s) | Group | Conditional? |
|-------|-----------|-------------|-------|-------------|
| AC-01 | Status filter — Retired: applying shows only retired assignments | SF-02 (Apply "Retired" checkbox) | Status filter | No |
| AC-02 | Status filter — Active: applying shows no retired assignments | SF-01 (Apply "Active" checkbox) | Status filter | No |
| AC-03 | Status filter — clear: list shows more than when filtered | SF-09 (Uncheck "Active" → baseline restored) | Status filter | No |
| AC-04 | Name search — match: all visible titles contain the term | SR-01 (Search known term) | Search filter | No |
| AC-05 | Name search — no match: empty state shown | SR-02 (Search `__NO_MATCH_TERM_ZZZ__`) | Search filter | No |
| AC-06 | Name search — clear: full list restored | SR-03 (Clear search → baseline count) | Search filter | No |
| AC-07 | Assignment type filter: applying shows only that type | TF-01 (Apply first type checkbox value) | Type filter | ⚠️ Yes — see note |
| AC-08 | Assignment type filter — clear: full list restored | TF-01 cleanup (uncheck in same test) | Type filter | ⚠️ Yes — see note |
| AC-09 | Allure steps: all steps appear with descriptive names | All 15 tests + T-27 (metadata) | All | No |
| AC-10 | CI execution: headless run exits with code 0 | T-41 (headless run) | Suite | No |

> ⚠️ **AC-07 / AC-08 conditional coverage note:** TF-01 is implemented only if Phase 0 (T-03) confirms a separate Assignment Type filter group. If Phase 0 reveals a single combined checkbox group (Status + Type share the same checkboxes), then:
> - AC-07 is already covered by SF-01…SF-08 (status checkbox tests cover the same filter group)
> - AC-08 is already covered by SF-09
> - TF-01 is marked `test.skip` with explanation
> - No coverage gap exists — the ACs are satisfied by the status filter tests

**✅ Gate check: All 10 acceptance criteria are covered.** AC-07 and AC-08 have conditional coverage with a documented fallback.

---

## Detailed Test Cases

### Group 1 — Status Filter (Checkbox)

| Test ID | Name | Precondition | Steps | Assertion | Maps to AC |
|---------|------|-------------|-------|-----------|-----------|
| SF-01 | Apply "Active" filter | Assignments list loaded; `baselineCount` captured | 1. Check "Active" checkbox | `filteredCount < baselineCount` OR empty state if no Active data | AC-02 |
| SF-02 | Apply "Retired" filter | Assignments list loaded | 1. Check "Retired" checkbox | `filteredCount < baselineCount` OR empty state | AC-01 |
| SF-03 | Apply "Draft" filter | Assignments list loaded | 1. Check "Draft" checkbox | `filteredCount < baselineCount` OR empty state; `test.skip` if no data confirmed in T-05 | — |
| SF-04 | Apply "In Progress" filter | Assignments list loaded | 1. Check "In Progress" checkbox | Same as SF-03 | — |
| SF-05 | Apply "Archived" filter | Assignments list loaded | 1. Check "Archived" checkbox | Same as SF-03 | — |
| SF-06 | Apply "Scheduled" filter | Assignments list loaded | 1. Check "Scheduled" checkbox | Same as SF-03 | — |
| SF-07 | Apply "Canceled" filter | Assignments list loaded | 1. Check "Canceled" checkbox | Same as SF-03 | — |
| SF-08 | Apply "Failed" filter | Assignments list loaded | 1. Check "Failed" checkbox | Same as SF-03 | — |
| SF-09 | Clear "Active" filter → restore | Assignments list loaded | 1. Check "Active" 2. Capture `filteredCount` 3. Uncheck "Active" 4. Capture `restoredCount` | `restoredCount === baselineCount` | AC-03 |
| SF-10 | Multi-select: "Active" + "Draft" | Assignments list loaded | 1. Check "Active" → capture `activeCount` 2. Check "Draft" → capture `combinedCount` 3. Uncheck both | `combinedCount >= activeCount` AND `combinedCount <= baselineCount` | — |

### Group 2 — Search Filter

| Test ID | Name | Precondition | Steps | Assertion | Maps to AC |
|---------|------|-------------|-------|-----------|-----------|
| SR-01 | Search known term — match | Assignments list loaded; `KNOWN_TITLE_SUBSTRING` set from T-04 | 1. Type `KNOWN_TITLE_SUBSTRING` in search | All visible titles contain `KNOWN_TITLE_SUBSTRING` (case-insensitive); count > 0 | AC-04 |
| SR-02 | Search non-matching term — empty state | Assignments list loaded | 1. Type `__NO_MATCH_TERM_ZZZ_XYZ__` in search | `expectEmptyState()` passes | AC-05 |
| SR-03 | Clear search — restore | Assignments list loaded | 1. Type `KNOWN_TITLE_SUBSTRING` 2. Capture `filteredCount` 3. Clear search | `restoredCount === baselineCount` | AC-06 |

### Group 3 — Type Filter (Conditional on Phase 0 T-03)

| Test ID | Name | Precondition | Steps | Assertion | Maps to AC |
|---------|------|-------------|-------|-----------|-----------|
| TF-01 | Apply type filter value | Phase 0 confirmed separate Type group; at least one type value known | 1. Check first type checkbox 2. Capture count 3. Uncheck | `filteredCount < baselineCount` OR empty state; after uncheck: `restoredCount === baselineCount` | AC-07, AC-08 |
| TF-01 (skip) | Type filter — skipped | Phase 0 confirmed single combined group | `test.skip(true, reason)` | N/A — AC-07/AC-08 covered by SF tests | AC-07, AC-08 (fallback) |

### Group 4 — Combined Filter

| Test ID | Name | Precondition | Steps | Assertion | Maps to AC |
|---------|------|-------------|-------|-----------|-----------|
| CB-01 | Active filter + name search | Assignments list loaded | 1. Check "Active" → capture `activeCount` 2. Search `KNOWN_TITLE_SUBSTRING` 3. Capture `combinedCount` 4. Clear search 5. Uncheck "Active" | If `combinedCount > 0`: all visible titles contain search term AND `combinedCount <= activeCount`. If 0: `expectEmptyState()` | — (stretch goal) |

---

## TDD Execution Sequence

This is a test-automation project, so "Red → Green → Refactor" maps to:

```
RED    = Test spec written; page object methods don't exist yet → TypeScript
         compilation error or runtime "method does not exist" error
GREEN  = Page object methods implemented → tests pass
REFACTOR = Cleanup, Allure metadata, skip guards, compile check
```

### Red Phase (write tests first, before page object methods)

> Execute in this order. Each step deliberately creates a failing state.

| Step | Action | Expected failure |
|------|--------|-----------------|
| R-1 | Complete Phase 0 discovery (T-01…T-05) — no code yet | N/A (manual) |
| R-2 | Add locator comment block to `AssignmentsPage.page.ts` (T-02) | No failure yet |
| R-3 | Add locator *properties* to `AssignmentsPage` (T-10) — no methods yet | Compile passes (properties only) |
| R-4 | Create `assignmentFilters.spec.ts` scaffold (T-20) — imports `AssignmentsPage` | `npx tsc --noEmit` fails: methods `applyFilterCheckbox`, `searchByName`, etc. do not exist on the class |
| R-5 | Write all test bodies (T-21…T-26) calling the non-existent methods | Compile error on every test file reference to missing methods |

**Red phase verification:**
```bash
npx tsc --noEmit
# Expected: errors like "Property 'applyFilterCheckbox' does not exist on type 'AssignmentsPage'"
```

### Green Phase (implement page object methods to make tests pass)

> Execute in this order. Each step removes one class of compilation/runtime error.

| Step | Task | Unblocks |
|------|------|---------|
| G-1 | Implement `applyFilterCheckbox()` (T-11) | SF-01…SF-08, SF-09 (partial), SF-10, CB-01 |
| G-2 | Implement `clearFilterCheckbox()` (T-12) | SF-09 (cleanup), SF-10 (cleanup), CB-01 (cleanup), TF-01 (cleanup) |
| G-3 | Implement `getVisibleAssignmentCount()` (T-13) | All count-based assertions |
| G-4 | Implement `getVisibleAssignmentTitles()` (T-14) | SR-01, CB-01 (title assertions) |
| G-5 | Implement `searchByName()` (T-15) | SR-01, SR-02, SR-03, CB-01 |
| G-6 | Implement `clearSearch()` (T-16) | SR-03, CB-01 (search cleanup) |
| G-7 | Implement `expectEmptyState()` + `expectListNotEmpty()` (T-17) | SR-02; SF-03…SF-08 zero-data path |

**After all G steps:**
```bash
npx tsc --noEmit          # Must exit 0
npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed
# Expected: tests pass (or skip with documented reason for no-data statuses)
```

### Refactor Phase (polish and verify)

| Step | Task | Validation |
|------|------|-----------|
| RF-1 | Add Allure metadata to all describe blocks (T-27) | `npm run report:allure` → check Epic/Feature labels |
| RF-2 | Add `test.skip` guards for status values with no data (per T-05) | No test fails with "0 < 0" assertion error |
| RF-3 | Confirm `KNOWN_TITLE_SUBSTRING` is set in scaffold (T-20) | SR-01 does not use placeholder `"REPLACE_WITH_ACTUAL_VALUE_FROM_T04"` |
| RF-4 | Final headless run (T-41) | Exit code 0 |
| RF-5 | Regression check (T-42) | `assignmentCreate.spec.ts` still passes |
| RF-6 | Final compile check (T-44) | `npx tsc --noEmit` exits 0 |

---

## Tooling and Commands

### Primary test commands

| Purpose | Command |
|---------|---------|
| Run filter tests only (headed, debug-friendly) | `npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed` |
| Run filter tests only (headless, CI mode) | `npx playwright test tests/Assignments/assignmentFilters.spec.ts` |
| Run specific test by name | `npx playwright test tests/Assignments/assignmentFilters.spec.ts -g "SF-02"` |
| Run all Assignments tests | `npx playwright test tests/Assignments/` |
| Debug a failing test | `npx playwright test tests/Assignments/assignmentFilters.spec.ts --debug` |
| Run with headed + slow-mo (visual debugging) | `npx playwright test tests/Assignments/assignmentFilters.spec.ts --headed --slowMo 500` |

### TypeScript validation

| Purpose | Command |
|---------|---------|
| Compile check (no emit) | `npx tsc --noEmit` |
| Check only changed files | `npx tsc --noEmit pageObjects/Assignments/AssignmentsPage.page.ts` |

### Allure reporting

| Purpose | Command |
|---------|---------|
| Clean previous results | `npm run allure:clean-results` |
| Generate + open report | `npm run report:allure` |
| Generate only | `npm run allure:generate` |
| Open existing report | `npm run allure:open` |

### Red phase verification (TDD check)

```bash
# After T-20 scaffold is written but before any page object methods exist:
npx tsc --noEmit
# Must show errors for missing methods — confirms Red phase is real
```

### Environment setup (if running for first time)

```bash
npm run load-secrets-dev     # Provisions config/develop.json from Percipio Secret Loader
# Then confirm:
npx playwright test tests/Assignments/assignmentCreate.spec.ts  # Must pass before starting filter work
```

---

## Exit Criteria

All of the following must be true before this work is considered done:

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | All 10 acceptance criteria have passing test coverage | See AC mapping table — all ACs green |
| 2 | `npx playwright test tests/Assignments/assignmentFilters.spec.ts` exits with code 0 | Headless run |
| 3 | `npx playwright test tests/Assignments/assignmentCreate.spec.ts` still passes | Regression check |
| 4 | `npx tsc --noEmit` exits with code 0 | Compile check |
| 5 | Allure report shows all tests under Epic=Assignments, Feature=Assignment Filters | `npm run report:allure` inspection |
| 6 | All Allure test steps have descriptive names (no unnamed steps) | Report inspection |
| 7 | Status values with no dev data are marked `test.skip` with a clear reason | Code review |
| 8 | `KNOWN_TITLE_SUBSTRING` constant contains a real, stable assignment title (not a placeholder) | Code review |
| 9 | TF-01 either has a real type filter assertion OR is `test.skip` with documented reason | Code review |
| 10 | No raw XPath added for new locators | Code review |

---

## Observations

1. **SF-03 through SF-08 are data-dependent.** Tests for Draft, In Progress, Archived, Scheduled, Canceled, and Failed status values will produce zero results if dev has no assignments in those states. These tests are still valid — they confirm that the filter *applies* (showing 0 results) — but they do not confirm the filter *shows correct results*. The skip guard prevents false failures; the skip reason documents the gap. To make these tests fully meaningful, data seeding should be added in a future iteration.

2. **AC-01 (Retired filter) is the primary regression signal.** Retired is a terminal, stable state. If the Retired filter breaks, SF-02 will catch it definitively. This is the highest-confidence test in the suite.

3. **SR-01 quality depends entirely on `KNOWN_TITLE_SUBSTRING`.** If the title chosen in T-04 is deleted from dev, SR-01 will fail with a valid assertion error (correct behavior) but will look like a test bug. The constant should be documented with a comment explaining which assignment it refers to and when it was last verified.

4. **CB-01 may produce zero results on first run.** If no "Active" assignment has a title matching `KNOWN_TITLE_SUBSTRING`, the test takes the empty-state path. This is correct but reduces confidence. Consider using a search term that is very broad (e.g., first word of the title) to maximize the chance of intersection.

5. **`waitForNetworkIdle()` risk.** The Green phase may reveal that checkbox filter interactions don't trigger a full network request (e.g., client-side filtering). If `waitForNetworkIdle()` hangs, swap it for a DOM-change wait strategy. This will be caught and fixed in T-40 (headed run).

6. **No unit tests for page object methods.** In this framework, page object methods are validated only by running them against a live browser. There is no mock layer or unit-test harness for `AssignmentsPage` methods. This is consistent with the rest of the repo and is acceptable given the POM pattern.

7. **Allure `addEpic` / `addFeature` / `addTag` availability.** Plan observation flagged that these methods may not exist on `IReporter`. During T-27 (Refactor phase), the engineer must check `framework/reporting/IReporter.ts` and adapt calls if the interface uses `addLabel(key, value)` instead of individual helpers. This is a low-risk fix but must not be skipped.

8. **SF-09 baseline restoration assertion is strict.** The test asserts `restoredCount === baselineCount` (exact equality). If another test in the suite is running concurrently and modifying the list, this could be flaky. Since `workers: 1` is configured in `playwright.config.ts`, this is safe for now. If parallelism is ever enabled, this assertion must be relaxed to `>=`.

9. **TF-01 coverage gap risk.** If Phase 0 (T-03) discovers that the Assignment Type filter IS a separate group with unique values not in the status list, TF-01 becomes a meaningful new test. If it's the same group, TF-01 is skipped and AC-07/AC-08 are satisfied by SF tests. The engineer must document the Phase 0 finding clearly in the `test.skip` reason string so future maintainers understand why.

---

## Open Questions

_No open questions. All acceptance criteria are covered. All inputs are resolved._

---

_End of tests.md_
