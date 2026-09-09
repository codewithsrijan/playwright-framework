# Feature Spec — Assignment Filters Automation

**Slug:** `assignment-filters-automation`
**Repo:** `ucm-playwright-automation`
**Date:** 2026-05-25
**Author:** Generated via speckit-build-spec

---

## Feature Summary and Business Goal

Automate end-to-end test coverage for all filter controls on the **Admin View → Learning → Assignments** list page in the Percipio UCM admin portal.

**Business goal:** Provide regression safety for the Assignments filter panel so that any UI or backend change that breaks filtering behaviour is caught automatically before reaching production. Filters are a primary navigation tool for administrators managing large assignment libraries; broken filters have direct operational impact.

**Scope of filters confirmed by user:**
1. **Status filter** — dropdown or toggle selecting assignment status (known values include at least: Active, Retired; additional values may exist)
2. **Search by name / title** — text input that filters the list to assignments whose name matches the search term
3. **Assignment type filter** — dropdown or selector for assignment type (exact values unknown — see Open Questions)

**Verification approach:** After applying each filter, assert that the visible assignment list updates to reflect only assignments matching the applied filter. The primary verification test case for the Status filter uses the **Retired** status (filtering to Retired shows only retired assignments).

---

## In-Scope / Out-of-Scope

### In-Scope

- Automating the **Status filter**: apply each known status value, assert the list updates accordingly
- Automating the **Search by name** filter: enter a known assignment name, assert matching results appear; enter a non-matching term, assert empty/no-results state
- Automating the **Assignment type filter**: apply each available type value, assert the list updates accordingly
- **Filter clear / reset**: after applying a filter, clear it and assert the full list is restored
- **Combined filters** (stretch): apply two filters simultaneously and verify the intersection of results _(only if time permits; not required for first pass)_
- Navigation prerequisite: Admin View → Learning → Assignments (existing `AdminHomePage.navigateToAssignments()` + `AssignmentsPage`)

### Out-of-Scope

- Creating or editing assignments (covered by existing `assignmentCreate.spec.ts`)
- Sorting the assignments list (not a filter; separate concern)
- Pagination behaviour
- Assignment detail page content
- API-level filter parameter validation (no API test required)
- Data seeding via API (tests rely on existing dev environment data)
- Stage / AWS environment execution (target is the `develop` environment only for this work)

---

## User Scenarios

### Scenario 1 — Filter by Status: Retired
**As** an admin navigating the Assignments list,
**When** I apply the Status filter with value "Retired",
**Then** the list should show only assignments with Retired status.

### Scenario 2 — Filter by Status: Active
**As** an admin navigating the Assignments list,
**When** I apply the Status filter with value "Active",
**Then** the list should show only assignments with Active status.

### Scenario 3 — Search by name (matching)
**As** an admin,
**When** I type a known assignment name into the search box,
**Then** the list should show only assignments whose title contains (or matches) the search term.

### Scenario 4 — Search by name (no match)
**As** an admin,
**When** I type a search term that matches no assignments,
**Then** the list should show an empty state or a "no results" indicator.

### Scenario 5 — Filter by Assignment Type
**As** an admin,
**When** I apply the Assignment Type filter with a specific type value,
**Then** the list should show only assignments of that type.

### Scenario 6 — Clear filter restores full list
**As** an admin,
**When** I apply any filter and then clear it (via reset button, "X" chip, or clearing the input),
**Then** the full unfiltered assignments list is restored.

---

## Functional Requirements

> All requirements are testable and unambiguous. Implementation decisions (selectors, method names) are deferred to the planning phase.

| ID | Requirement |
|----|-------------|
| FR-01 | The test suite must navigate to the Assignments list page using the existing `AdminHomePage.navigateToAssignments()` path |
| FR-02 | The page object layer must expose a method to apply the **Status filter** for a given status value |
| FR-03 | The page object layer must expose a method to read the **current visible assignment count** from the list |
| FR-04 | The page object layer must expose a method to read the **titles of all visible assignments** from the list |
| FR-05 | After applying the Status filter to "Retired", the test must assert that every visible assignment title corresponds to a Retired-status assignment (or that the visible count is less than the total count) |
| FR-06 | After applying the Status filter to "Active", the test must assert that no Retired assignments are visible |
| FR-07 | The page object layer must expose a method to **type into the name/title search input** |
| FR-08 | After entering a known search term, the test must assert that all visible assignment titles contain (case-insensitively) the search term |
| FR-09 | After entering a search term with no matches, the test must assert that an empty state or zero-result indicator is displayed |
| FR-10 | The page object layer must expose a method to apply the **Assignment Type filter** for a given type value |
| FR-11 | After applying the Assignment Type filter, the test must assert that the visible list contains only assignments of the selected type |
| FR-12 | The page object layer must expose a method to **clear all active filters** (or clear each filter individually) |
| FR-13 | After clearing all filters, the test must assert that the assignment list returns to a state with more results than when filtered (or the same count as before any filter was applied) |
| FR-14 | All page object filter methods must wrap interactions in `reporter.step(...)` consistent with the rest of the POM layer |
| FR-15 | The new spec file must import `test` from `fixtures/loginFixture.ts` and use `test.use({ storageState: { cookies: [], origins: [] } })` for a clean session (consistent with `assignmentCreate.spec.ts`) |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Each test case must complete within the global `timeout: 5 * 60 * 1000` (5 minutes) defined in `playwright.config.ts` |
| NFR-02 | Locators for filter controls must use role-based or `data-marker`-based selectors (Playwright `getByRole`, `getByLabel`, `page.locator('[data-marker="..."]')`) — raw XPath must not be introduced for new elements |
| NFR-03 | Tests must be runnable in CI (headless) via `npx playwright test tests/Assignments/assignmentFilters.spec.ts` |
| NFR-04 | Test output must be captured in Allure report (`allure-results/`) with meaningful step names |
| NFR-05 | Tests must not depend on a specific total count of assignments — assertions must be relative (e.g. filtered count < total count, or all visible titles match criterion) to avoid brittle data dependencies |
| NFR-06 | The new page object code must be in TypeScript with no use of `any` unless unavoidable, consistent with project conventions |

---

## Acceptance Criteria

| ID | Criterion | Pass Condition |
|----|-----------|---------------|
| AC-01 | Status filter — Retired | Applying "Retired" status filter results in only retired assignments being visible in the list |
| AC-02 | Status filter — Active | Applying "Active" status filter results in no retired assignments being visible |
| AC-03 | Status filter — clear | After clearing the status filter, the list shows more assignments than when filtered |
| AC-04 | Name search — match | Searching for a term known to match ≥1 assignment returns only rows whose title contains the term |
| AC-05 | Name search — no match | Searching for `__NO_MATCH_TERM_ZZZ__` (or equivalent) shows an empty-state indicator |
| AC-06 | Name search — clear | Clearing the search input restores the full list |
| AC-07 | Assignment type filter | Applying any type filter value results in only assignments of that type being visible |
| AC-08 | Assignment type filter — clear | Clearing the type filter restores the full list |
| AC-09 | Allure steps | All test steps appear in the Allure report with descriptive names |
| AC-10 | CI execution | `npx playwright test tests/Assignments/assignmentFilters.spec.ts` exits with code 0 when all tests pass |

---

## Repo Impact Matrix

| Repository | Change Type | Why |
|-----------|------------|-----|
| `ucm-playwright-automation` | **New file** — `tests/Assignments/assignmentFilters.spec.ts` | New test spec covering all filter scenarios |
| `ucm-playwright-automation` | **Modify** — `pageObjects/Assignments/AssignmentsPage.page.ts` | Add filter methods (applyStatusFilter, searchByName, applyTypeFilter, clearFilters, getVisibleCount, getVisibleTitles) |

No other repositories are affected. No backend, no schema, no API contract changes.

---

## Dependencies / Assumptions

| # | Dependency / Assumption |
|---|------------------------|
| 1 | The `develop` environment (`plat3-complete.front.develop.squads-dev.com`) has at least **one assignment in Retired status** and **at least one assignment in Active status** for Status filter tests to be meaningful |
| 2 | The dev environment has at least **two assignments with different type values** for the Assignment Type filter test to verify filtering works |
| 3 | At least **one assignment with a predictable, searchable title** exists in dev (e.g. "Auto Assignment") for the name search test |
| 4 | Filter controls on the Assignments list page are accessible via role-based ARIA attributes or `data-marker` attributes that are stable across deploys |
| 5 | Navigation to the Assignments list page works correctly via `AdminHomePage.navigateToAssignments()` (currently using XPath with known typo `assignmetns` — this is the existing behaviour and is not changed by this work) |
| 6 | The test will use a fresh browser session (`storageState: { cookies: [], origins: [] }`) and log in via `lognToPageFixture` to avoid session expiry issues |
| 7 | Assignment type filter values will be discovered during the implementation/planning phase via live UI inspection or MCP browser snapshot |

---

## Observations

1. **Zero existing filter coverage.** No test, locator, or page object method for the Assignments filter panel exists today. This is a complete greenfield addition to `AssignmentsPage.page.ts`.

2. **"Retired filter" as verification anchor.** The user specified "retired filter" as the verification method. This is interpreted as: the primary test for filter correctness is applying the "Retired" status filter and asserting the list reflects only retired assignments. This is a sound, deterministic approach given that Retired is a terminal, stable state.

3. **Relative assertions required.** Because tests rely on existing dev data (no seeding), assertions must be expressed relatively (e.g. "count after filter < count before filter", or "all visible titles contain search term") rather than asserting exact counts. This makes tests resilient to data changes.

4. **Filter locators must be discovered.** The exact HTML structure of the filter panel (dropdowns, chips, buttons, inputs) is not documented in the repo. Locator discovery is required before implementation — this is a planning-phase activity.

5. **`AssignmentsPage.page.ts` extension vs. new class.** The spec does not mandate whether to extend the existing `AssignmentsPage` class or create a separate `AssignmentsFilterPage` class. That is an implementation decision deferred to the planning phase.

6. **QMetry registration.** New test cases may need to be registered in QMetry via `npm run qmetry:import-test-case`. This is outside the scope of this spec but should be tracked as a post-implementation action.

---

## Open Questions

| # | Question | Owner | Blocking? |
|---|----------|-------|-----------|
| OQ-01 | What are the exact **Assignment Type filter values** available in the UI? (e.g. Required / Optional / Compliance / Custom) | Engineer (live UI inspection required) | Yes — needed before implementing AC-07 / AC-08 |
| OQ-02 | Does the Assignments list page have a visible **total count** displayed (e.g. "Showing 24 of 80 assignments") that can be used for relative assertions? | Engineer (live UI inspection required) | Influences NFR-05 assertion strategy |
| OQ-03 | Is there a **clear all filters** button, or must each filter be cleared individually? | Engineer | Influences FR-12 / AC-03 / AC-06 / AC-08 |
| OQ-04 | Does the Status filter have values beyond Active and Retired? (e.g. Draft, Inactive, Archived) | Product / Engineer | Influences FR-02 and the number of Status filter test cases |

> **Note:** OQ-01 is blocking for implementation. All other open questions can be resolved during the planning phase via live UI inspection. These questions must be empty before proceeding to `build.plan`.

---

_End of spec.md_
