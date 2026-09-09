# Combined Repository Map — UHS-17045 (Page Builder Automation)

_Generated: 2026-05-25_
_Scope: Single repository — `ucm-playwright-automation`_

---

## Overview

This workspace contains a **single repository**: `ucm-playwright-automation`, a Playwright E2E test automation suite for the **Skillsoft Percipio UCM** (User and Content Management) admin portal. There are no microservices or backend repos in scope — the automation suite tests a browser-rendered admin UI by driving real browser sessions against deployed environments.

| Dimension | Value |
|-----------|-------|
| **Repos in scope** | 1 |
| **Architecture style** | Page Object Model (POM) + pluggable reporter abstraction |
| **Test runner** | Playwright Test 1.60.0 (TypeScript) |
| **Primary browser** | Google Chrome (channel: "chrome") |
| **Environments targeted** | `develop` (`plat3-complete.front.develop.squads-dev.com`) · `stage` (AWS) |
| **CI** | Jenkins + Docker |

---

## Repository Index

| Repo | Path | Purpose | Tech Stack Summary |
|------|------|---------|-------------------|
| `ucm-playwright-automation` | `/Users/sngeddam/Desktop/spec-kit-builder/ucm-playwright-automation` | Browser-level E2E test automation for Percipio UCM admin UI workflows (Assignments, Audiences, User Profiles, and forthcoming Page Builder) | TypeScript 6.0.3 · Playwright 1.60.0 · Allure · axios · Winston · Faker |

---

## Cross-Repository API Surface

> _Single-repo workspace — no cross-repo API surface exists._

The suite calls the following **external services** under test:

| Service | Role | Endpoint Pattern |
|---------|------|-----------------|
| Percipio Admin UI | Primary SUT (browser) | `https://<env>.front.<domain>/admin/...` |
| organizations-api | Org CRUD (seeding) | `https://organizations-api.<env>.<domain>` |
| assignment-service | Assignment CRUD | `https://assignment-service.<env>.<domain>` |
| ucm2bff | BFF for user management | `https://ucm2bff.<env>.<domain>` |
| provisioning | User provisioning | AWS stage-specific endpoint |

---

## Shared Infrastructure and Integration Dependencies

| Dependency | Used by | Notes |
|-----------|---------|-------|
| **Percipio Secret Loader (`npx psl`)** | Config generation | `config/<env>.json` generated from `.template` files; secrets are not committed |
| **Google Chrome** | All UI tests | `channel: "chrome"` required; Chromium alone insufficient |
| **Allure CLI** | Reporting | `allure-commandline 2.38.1`; generates HTML report from `allure-results/` |
| **QMetry** | Test case management | `qmetry-utility/` + `npm run qmetry:import-test-case` |
| **Jenkins** | CI execution | Docker-based; `CI` / `JENKINS_URL` env vars auto-detected |

---

## Data and Control Flow Across Repos

> _Single-repo workspace — no cross-repo data flow._

**Within-repo flow (UI tests):**

```
1. globalSetup.ts         — NODE_ENV → config/<env>.json via dotenv
2. auth.setup.ts          — LoginPage → saves storageState to tests/playwright/.auth/user.json
3. Test spec .beforeEach  — Instantiates Page Object classes
4. Test body              — Page Object methods → Playwright interactions
5. BasePage               — Wraps every action in reporter.step() → Allure step
6. Post-test (fixture)    — Console logs attached; screenshot on failure
7. allure generate        — allure-results/ → allure-report/
```

**For UHS-17045 (Page Builder):** the Page Builder area (`Admin → Learning → Page Builder`) has **no existing page object**. The entire `pageObjects/PageBuilder/` directory must be created from scratch, following the POM pattern used by `Assignments/` and `Audiences/`.

---

## Known Constraints / Risks

| # | Constraint | Detail |
|---|-----------|--------|
| 1 | **No Page Builder page objects exist** | `pageObjects/` has no `PageBuilder/` directory. All locators and action methods must be built new — requires live app analysis via Playwright MCP. |
| 2 | **Drag-and-drop complexity** | Playwright's `dragTo()` / `dispatchEvent` approach can be fragile depending on the component library (React DnD, Sortable.js, etc.). Exact drag-and-drop strategy must be determined after live inspection. |
| 3 | **Single worker** | `playwright.config.ts` uses `workers: 1`; Page Builder tests will also run sequentially unless a dedicated parallel config is added. |
| 4 | **Chrome channel dependency** | Requires installed Google Chrome, not Chromium. |
| 5 | **Saved session fragility** | `storageState` in `tests/playwright/.auth/user.json` may expire; Page Builder tests that modify global state may need fresh login. |
| 6 | **Secret config not committed** | `config/develop.json` must be regenerated via `npm run load-secrets-dev` on fresh clones. |
| 7 | **Multilingual test data** | Testing multilingual support requires knowing which locales are enabled per org/environment. Locale availability is env-specific. |
| 8 | **No cleanup hooks in existing suites** | Existing assignment/audience tests do not clean up created data. Page Builder tests creating pages, child pages, and audience associations may accumulate test data. Cleanup strategy TBD. |
| 9 | **`strict: false` in tsconfig** | Implicit `any` types allowed; new code should still aim for explicit typing. |
| 10 | **Out-of-scope: user-login E2E flow** | Ticket explicitly defers "end-to-end flow using user login" to a follow-on task. |

---

## Observations

1. **Page Builder is a net-new automation area.** Unlike Assignments and Audiences (which have existing page objects and at least some test coverage), Page Builder has zero existing automation infrastructure. The full POM hierarchy must be created.

2. **Ticket says "using Playwright MCP server and live app analysis"** — this strongly implies that component discovery (Design tab items, filter names, action menu entries) is expected to happen via live browser inspection rather than being pre-specified in the ticket.

3. **Dual locator strategy risk.** Existing POM uses both role-based selectors (newer) and raw XPath (older). New Page Builder page objects should use role-based / `data-marker` / `getByLabel` selectors consistent with the `CreateAssignmentWizard` pattern.

4. **Drag-and-drop** is explicitly in scope (Validation #3). This is the most technically complex scenario; Playwright's native `dragTo()` works for most implementations but may need `mouse.move()` + `dispatchEvent('drop')` workarounds depending on the component library used in Page Builder.

5. **`specs/` folder pattern** — existing spec docs (`plan-admin-create-assignment-launch.md`, etc.) follow a consistent format. New Page Builder test plans should use the same structure.

6. **QMetry registration** — new test IDs (HP-xx, NG-xx) for Page Builder tests will likely need to be registered in QMetry per the existing pattern.

---

## Open Questions

_(Carried from repo-map; to be resolved in spec step)_

1. **Which specific components appear in the Page Builder Design tab?** — requires live app analysis or explicit enumeration from the product team.
2. **What are the filter names and action menu entries on the Page Builder list page?** — same; requires live UI inspection.
3. **Which environments are targeted** — develop only, or stage as well?
4. **Is test data cleanup required?** — should created pages/child pages/audience associations be deleted after each test?
5. **Which locales are valid for multilingual testing** in the target org/environment?

---

_End of combined-repo-map.md_
