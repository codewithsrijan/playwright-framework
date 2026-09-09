# Combined Repository Map — assignment-filters-automation

_Generated: 2026-05-25_

---

## Overview

This workspace contains a **single repository**: `ucm-playwright-automation`. There are no cross-repository concerns for this feature. All test automation code for the Percipio UCM admin UI lives in one place.

- **Number of repos in scope:** 1
- **Shared purpose:** Browser-level E2E test automation for the Skillsoft Percipio UCM admin portal
- **Architecture style:** Page Object Model (POM) with pluggable reporter abstraction (IReporter / ReporterRegistry)

---

## Repository Index

| Repo Name | Path | Purpose | Tech Stack Summary |
|-----------|------|---------|-------------------|
| `ucm-playwright-automation` | `/Users/sngeddam/Desktop/spec-kit-builder/ucm-playwright-automation` | Playwright E2E test suite for Percipio UCM admin UI | TypeScript 6, Playwright 1.60, Allure 3.7, Faker 8.4, Axios, Winston, Percipio Secret Loader |

Full detail: see [`../specs/repo-map.md`](../specs/repo-map.md)

---

## Cross-Repository API Surface

_Not applicable — single repository._

---

## Shared Infrastructure and Integration Dependencies

| Dependency | Role | Notes |
|-----------|------|-------|
| Percipio Admin UI | System under test (browser) | `https://<env>.front.<domain>/admin/assignments` |
| assignment-service | Backend for assignment data | Indirectly exercised by UI interactions |
| Percipio Secret Loader (`percipiosecretloader`) | Secret provisioning | Required before any test run; secrets go into `config/<NODE_ENV>.json` |
| Google Chrome (channel) | Browser runtime | Must be installed on host — Chromium alone is insufficient |
| Allure CLI | Report generation | `allure generate allure-results --clean -o allure-report` |
| Jenkins + Docker | CI pipeline | Headless mode auto-enabled via `CI` / `JENKINS_URL` env vars |

---

## Data and Control Flow Across Repos

_Single repo — no cross-repo data flow._

Internal test flow for filter automation:

```
globalSetup.ts  →  auth.setup.ts (save session)
  →  assignmentFilters.spec.ts
       →  AdminHomePage.navigateToAssignments()
       →  AssignmentsPage.applyStatusFilter(value) / applyTypeFilter(value) / searchByName(term)
       →  AssignmentsPage.getVisibleAssignmentCount() / getVisibleAssignmentTitles()
       →  expect() assertions (list updates to match filter)
       →  AssignmentsPage.clearFilter()
       →  expect() assertions (full list restored)
  →  Allure report
```

---

## Known Constraints / Risks

| # | Constraint | Detail |
|---|-----------|--------|
| 1 | **No filter page object exists** | `AssignmentsPage.page.ts` has zero filter-related locators or methods. All filter automation requires new code |
| 2 | **Filter locators unknown** | Filter UI elements (dropdowns, inputs, chips) have no documented `data-marker` attributes or ARIA roles in this repo. Must be discovered via live inspection or MCP snapshot |
| 3 | **Single worker** | Tests run sequentially (`workers: 1`). Filter tests may be slow if the list is large |
| 4 | **Relies on existing dev data** | Tests depend on dev environment having assignments in multiple statuses (Active, Retired, etc.) and types. No seeding is planned |
| 5 | **XPath locator debt** | `AdminHomePage` uses XPath with a known typo (`assignmetns`). New locators should use role-based selectors |
| 6 | **Chrome channel required** | Google Chrome must be installed — not just Chromium |

---

## Observations

1. The assignment filter feature is a **greenfield addition** to the test suite — no existing filter code, tests, or locators exist.
2. The `AssignmentsPage` class must be extended (or a new `AssignmentsFilterPage` class created) to model the filter panel.
3. The "retired filter" verification approach mentioned by the user (filtering by Retired status) implies that the dev environment must have at least some assignments in Retired state for that test to be meaningful.
4. The exact `Assignment type` filter values are currently unknown — this is flagged as an open question.

---

## Open Questions

_(Carried over to spec.md — see Open Questions section there.)_

---

_End of combined-repo-map.md_
