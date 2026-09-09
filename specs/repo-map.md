# Repository Map — ucm-playwright-automation

_Generated: 2026-05-25_

---

## Overview

Single-repository Playwright end-to-end (E2E) test automation suite for the **Skillsoft Percipio UCM** (User and Content Management) admin portal. The suite targets the browser-rendered admin UI across two environments (develop, stage/AWS) and is the sole automated test layer for admin workflows including Assignments, Audiences, and User Profiles.

- **Architecture style**: Page Object Model (POM) with a pluggable reporter abstraction layer
- **Test execution**: Playwright Test runner (project: `chrome` / `setup`); single-worker sequential by default
- **Reporting**: Allure (primary) + Playwright HTML/JSON; swappable via `ReporterRegistry` singleton
- **Environments**: `develop` (`plat3-complete.front.develop.squads-dev.com`) and `stage` (AWS; `*.use1-stage-*.percipio.com`)
- **CI**: Jenkins (`Jenkinsfile` at root); Docker-based execution; headless mode auto-detected via `CI` / `JENKINS_URL` env vars

---

## Repository Details

| Field | Value |
|-------|-------|
| **Name** | `ucm-playwright-automation` |
| **Path** | `/Users/sngeddam/Desktop/spec-kit-builder/ucm-playwright-automation` |
| **Purpose** | Browser-level E2E test automation for Percipio UCM admin UI workflows |
| **Primary language** | TypeScript 6.0.3 |
| **Package manager** | npm |
| **Test runner** | Playwright Test 1.60.0 |
| **Reporting** | allure-playwright 3.7.1 / allure-commandline 2.38.1 |

---

## Directory and Module Map

```
ucm-playwright-automation/
│
├── config/                        Environment-specific config files
│   ├── develop.json               Resolved secrets + URLs for dev (git-ignored locally)
│   ├── develop.json.template      Template with ${secrets.getValue(...)} placeholders
│   └── stage.json.template        Template for AWS stage environment
│
├── fixtures/                      Playwright fixture extensions
│   ├── allureFixtures.ts          Overrides `page`: console log capture + screenshot on failure
│   │                              Exposes `reporter` (IReporter) and `loginPage` fixtures
│   └── loginFixture.ts            Extends allureFixtures; adds `loginFixture` and
│                                  `lognToPageFixture` (auto-navigates + logs in before test)
│
├── framework/                     Reusable framework primitives (not test-specific)
│   ├── reporting/
│   │   ├── IReporter.ts           Interface: step(), attach*, addLabels(), screenshotOnFailure()
│   │   ├── AllureReporter.ts      IReporter backed by allure-js-commons (default in prod)
│   │   ├── PlaywrightReporter.ts  IReporter backed by test.step() / testInfo.attach()
│   │   ├── ConsoleReporter.ts     IReporter writing indented steps to stdout
│   │   ├── CompositeReporter.ts   Fan-out to multiple IReporter instances
│   │   ├── NoOpReporter.ts        Silent no-op (useful in unit / seed contexts)
│   │   ├── ReporterRegistry.ts    Global singleton; setReporter() / getReporter()
│   │   └── index.ts               Re-exports all reporter types and IReporter interface
│   └── wait/
│       ├── timeouts.ts            Central timeout constants (NAVIGATION_MS=60s, ACTION_MS=30s,
│       │                          ASSERT_MS=15s, POST_LOGIN_SETTLE_MS=10s); env-overridable
│       └── waitFor.ts             waitForPageReady(), waitAfterLoginTransition(),
│                                  waitForStableUi() helpers
│
├── helper/                        API-layer helpers for test data seeding and backend calls
│   └── api/
│       ├── APIClient.ts           Token generation (10-retry), env config loader,
│       │                          org-by-ID domain lookup
│       ├── urls.ts                Backend service URL constants
│       ├── params.ts              Shared query parameter builders
│       ├── roles.ts               Role constants for API calls
│       ├── headers/headers.ts     HTTP header builders
│       └── payloads/              23 payload factory files (assignment, audience, user,
│                                  org, channel, license pool, site-shutdown, etc.)
│
├── pageObjects/                   Page Object classes (one class per UI page/component)
│   ├── base/BasePage.ts           Abstract base: navigation, click, fill, assert, wait,
│   │                              screenshot — all wrapped in reporter.step()
│   ├── AdminHomePage.page.ts      Learning menu → Assignments navigation
│   │                              Locators: #learningMainMenu, [data-marker="assignmetns"]
│   ├── LoginPage.page.ts          Percipio login flow (basic auth + optional SSO path)
│   ├── Assignments/
│   │   ├── AssignmentsPage.page.ts        Assignment list page; "New Assignment" button
│   │   │                                  Locator: [data-marker="newAssignmentBtn"]
│   │   └── CreateAssignmentWizard.page.ts 5-step wizard: Describe → Add content →
│   │                                       Add users & audiences → Notify → Review & Launch
│   └── Audiences/
│       └── CreateAudiencePage.page.ts     Audience creation wizard (name, type, user search)
│
├── tests/                         All Playwright spec files
│   ├── auth/auth.setup.ts         Setup project: logs in, saves session to
│   │                              tests/playwright/.auth/user.json
│   ├── Assignments/
│   │   └── assignmentCreate.spec.ts  HP-01 (create+launch), NG-01..NG-05 (validation)
│   ├── audiences/
│   │   └── create-child-audience.spec.ts
│   ├── ucm-manual3-aws/           Tests targeting the manual3-aws dev environment
│   │   ├── entry-and-login.spec.ts
│   │   ├── create-audience.spec.ts
│   │   ├── create-audience-individual-users.spec.ts  HP-01..HP-02, NG-01..NG-05
│   │   ├── audience-management-navigation.spec.ts
│   │   ├── team-automation-rule-user-profiles.spec.ts
│   │   ├── manual3Auth.ts         Auth helpers for manual3 environment
│   │   ├── audienceNavigation.ts  Navigation helpers
│   │   └── teamAutomationRuleNavigation.ts
│   └── tests-api/                 Backend / BFF API tests (separate config: playwright.api.config.ts)
│       ├── be/                    Org creation, site shutdown, data seed
│       ├── bff/                   User creation via BFF
│       └── customContent/         Custom content data seeding
│
├── utils/                         Shared utility functions and config loaders
│   ├── AllureReporter.ts          Backward-compat shim re-exporting from framework/reporting
│   ├── commonfuctions.ts          File I/O, JSON helpers, random ID generation, domain extraction
│   ├── dates.ts                   ISO date strings, past/future date calculators
│   ├── env.js                     ENV class binding BASE_URL, USERNAME, PASSWORD from process.env
│   ├── frontendConfig.ts          getFrontendConfig(): loads config/<NODE_ENV>.json,
│   │                              applies env var precedence (PLAYWRIGHT_BASE_URL > BASE_URL)
│   ├── globalSetup.ts             Playwright globalSetup: sets NODE_ENV default, loads dotenv
│   ├── logger.ts                  Winston logger (IST timezone, file + console)
│   ├── organizationData.ts        Org and license-pool API helpers
│   ├── provisioningData.ts        Provisioning API helpers
│   ├── roles.json                 Role definitions
│   ├── orgDataDev.json            Dev org fixtures
│   ├── orgDataStage.json          Stage org fixtures
│   └── playwright/
│       ├── index.ts               Re-exports attachViewportPng, gotoPath
│       ├── navigation.ts          gotoPath() — relative navigation with waitUntil: networkidle
│       └── screenshotAttach.ts    attachViewportPng() — captures viewport + attaches to testInfo
│
├── specs/                         Test plans, spec docs, and (after build.repo-map) repo-map.md
├── docs/                          Additional documentation
├── qmetry-utility/                QMetry test case import utilities
├── scripts/                       fetch-pr-context.mjs, qmetry-run-issue.mjs
├── playwright.config.ts           Main UI test config (projects: setup + chrome)
├── playwright.api.config.ts       API test config (project: chrome, 4 workers)
├── tsconfig.json                  TypeScript config (ES2020, commonjs, strict: false)
├── Dockerfile                     Container definition for CI execution
├── Jenkinsfile                    CI pipeline definition
└── seed.spec.ts                   Orchestrator/generator scaffold for test seeding
```

---

## API Inventory

This repository is a **test automation suite** — it does not expose HTTP endpoints. Its "API surface" consists of two layers:

### 1. Internal Test Helper API (`helper/api/`)

| Module | Purpose | Key Methods |
|--------|---------|-------------|
| `APIClient.ts` | Token auth + org lookups | `generateToken()` (10-retry), `getEnvVariables()`, `getDomainByOrgId()` |
| `urls.ts` | Backend service URL constants | Organization API, settings, assignment, provisioning, ucm2bff, tailored-content |
| `payloads/*.ts` (×23) | Typed request body factories | Assignment, audience, user, org, channel, license pool, site-shutdown, etc. |

### 2. External Services Under Test (Admin UI)

| Service | Role | Endpoint Pattern |
|---------|------|-----------------|
| Percipio Admin UI | Primary SUT (browser-based) | `https://<env>.front.<domain>/admin/...` |
| organizations-api | Org CRUD (seeding) | `https://organizations-api.<env>.<domain>` |
| assignment-service | Assignment CRUD | `https://assignment-service.<env>.<domain>` |
| settings-service | Platform settings | `https://settings-service.<env>.<domain>` |
| ucm2bff | BFF for user management | `https://ucm2bff.<env>.<domain>` |
| provisioning | User provisioning | AWS stage-specific endpoint |

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Test runner** | Playwright Test | 1.60.0 |
| **Language** | TypeScript | 6.0.3 |
| **Runtime** | Node.js | (managed via .npmrc) |
| **Browser** | Chromium (via Google Chrome channel) | managed by Playwright |
| **Reporting** | allure-playwright | 3.7.1 |
| **Allure CLI** | allure-commandline | 2.38.1 |
| **Test data** | @faker-js/faker | 8.4.1 |
| **HTTP** | axios | 1.13.6 |
| **Logging** | winston | 3.13.0 |
| **Secret management** | @skillsoft-security-chapter/percipiosecretloader | 3.1.3 |
| **Utilities** | uuid | 11.1.1 |
| **Env config** | dotenv | 16.4.1 |
| **MCP** | @playwright/mcp | 0.0.71 |
| **Build / transpile** | tsx | 4.19.3 |
| **CI** | Jenkins + Docker | — |

---

## Architecture Summary

### Pattern: Page Object Model + Pluggable Reporter

```
Test Spec (.spec.ts)
  └── imports `test` from fixtures/loginFixture.ts
        └── extends allureFixtures.ts (page override: console logs + failure screenshots)
              └── exposes reporter (IReporter via ReporterRegistry)

Test Spec uses Page Object classes
  └── All extend BasePage
        └── Every action/assertion wraps reporter.step(...)
              └── reporter resolves from ReporterRegistry.getReporter()
                    └── Default: AllureReporter (allure-js-commons)
                    └── Swap in globalSetup.ts for CI or unit contexts
```

### Session State Strategy

Two modes coexist:

| Mode | Mechanism | Used by |
|------|-----------|---------|
| **Saved session** | `tests/playwright/.auth/user.json` written by `auth.setup.ts`; loaded in `playwright.config.ts` chrome project | Default for all specs |
| **Fresh login per test** | `test.use({ storageState: { cookies: [], origins: [] } })` + `lognToPageFixture` | Specs that need guaranteed OAuth-clean state (e.g. `assignmentCreate.spec.ts`) |

### Config Loading Precedence

```
PLAYWRIGHT_BASE_URL env var
  → BASE_URL env var
    → config/<NODE_ENV>.json → frontend.url
      → undefined (test will fail at navigation)

config/<NODE_ENV>.json is generated from:
  npm run load-secrets-dev   →  npx psl render config/develop.json.template --profile develop
  npm run jenkins-config-template  →  npx psl render config/$NODE_ENV.json.template --fromrole true
```

---

## Data and Control Flow

### Happy-Path E2E Flow (UI test)

```
1. globalSetup.ts       — Sets NODE_ENV, loads config/<NODE_ENV>.json via dotenv
2. auth.setup.ts        — Opens browser, logs in via LoginPage, saves storageState
3. Test spec .beforeEach — Instantiates page objects (AdminHomePage, AssignmentsPage, etc.)
4. Test body            — Calls page object methods (e.g. navigateToAssignments())
                          Every method wraps in reporter.step() → Allure step recorded
5. BasePage methods     — Playwright locator interactions with ACTION_MS / NAVIGATION_MS timeouts
6. Assertions           — expect() calls wrapped in reporter steps
7. Post-test (fixture)  — Console logs attached; screenshot captured on failure
8. Reporter output      — allure-results/ written; allure generate → allure-report/
```

### API Data Seeding Flow (API tests)

```
1. APIClient.generateToken() — POST to organizations-api with retry
2. Payload factories        — Typed objects from helper/api/payloads/
3. axios HTTP calls         — Direct REST calls to backend services
4. Test assertions          — Status codes, response body validation
```

---

## Known Constraints / Risks

> **Note:** This repository is a test automation suite, not an application backend. There are no database tables owned by this repo. All constraints are framework-level.

| # | Constraint | Detail |
|---|-----------|--------|
| 1 | **Single worker** | `playwright.config.ts` sets `workers: 1`. Tests run sequentially; parallelism requires explicit `test.describe.configure({ mode: 'parallel' })` per suite |
| 2 | **Chrome channel dependency** | Both `setup` and `chrome` projects specify `channel: "chrome"` — requires Google Chrome installed on the test host; Chromium alone is insufficient |
| 3 | **Saved session fragility** | `storageState` saved by `auth.setup.ts` may expire or become invalid after OAuth token rotation; specs using `storageState: { cookies: [], origins: [] }` bypass this but add login time per test |
| 4 | **XPath locators in AdminHomePage** | `learningMenu` and `assignments` locators use XPath (`//*[@id="learningMainMenu"]`, `//*[@data-marker="assignmetns"]`) — brittle vs. role-based selectors; `"assignmetns"` is a typo in the `data-marker` attribute that must match the live UI exactly |
| 5 | **Secret config not committed** | `config/develop.json` is generated from a template using Percipio Secret Loader (`npx psl render`). On a fresh clone or CI, secrets must be provisioned via `npm run load-secrets-dev` or `npm run jenkins-config-template` before any test can run |
| 6 | **AssignmentsPage locator** | `newAssignmentButton` uses XPath `//a[@data-marker="newAssignmentBtn"]` — if the element changes from `<a>` to `<button>`, the test breaks silently with a timeout |
| 7 | **No filter/search page object** | `AssignmentsPage.page.ts` only models the list page + "New Assignment" button. There are currently **no page object methods or locators for the assignment list filters** (status, date range, search, etc.). Any filter automation must create new locators and methods |
| 8 | **`strict: false` in tsconfig** | TypeScript strict mode is disabled; implicit `any` types and null-unsafe patterns may exist throughout the codebase |
| 9 | **API tests use separate config** | `playwright.api.config.ts` is a separate config with 4 workers; API tests are excluded from the main config via `testIgnore: ["tests/tests-api/**"]` |
| 10 | **Timeout sensitivity** | NAVIGATION_MS defaults to 60 seconds; slow environments (CI, AWS stage) may still hit timeouts on heavy pages. All timeouts are env-overridable via `PLAYWRIGHT_NAVIGATION_MS` etc. |

---

## Observations

1. **Assignment filter page object is missing entirely.** `AssignmentsPage.page.ts` contains only `navigateToNewAssignment()`. Any test that exercises filters, search, or sort on the assignments list page will require a new set of locators and methods — none exist today.

2. **Dual locator strategies coexist.** Newer page objects (`CreateAssignmentWizard`, `CreateAudiencePage`) use role-based/label-based Playwright selectors (`getByRole`, `getByLabel`). Older objects (`AdminHomePage`, `AssignmentsPage`) use raw XPath. Inconsistency increases maintenance overhead.

3. **`data-marker` typo in AdminHomePage.** The `assignments` locator uses `data-marker="assignmetns"` (misspelled). This matches the current live UI attribute but is a long-term fragility risk if the UI is fixed without updating the test.

4. **No dedicated `AssignmentsFilterPage` or similar.** The test suite has coverage for assignment *creation* (HP-01, NG-01..NG-05 in `assignmentCreate.spec.ts`) but zero coverage for the assignment *list* view's filter panel. This is the primary gap for UHS-1234.

5. **`specs/` folder already contains test plans** (`plan-admin-create-assignment-launch.md`, etc.) following a consistent format — new spec docs should follow the same structure.

6. **`seed.spec.ts` at root** is referenced as an "orchestrator/generator scaffold" but its implementation details were not fully explored. Seeding for filter tests (e.g., pre-creating assignments with specific states) may rely on this or on `helper/api/payloads/createAssignmentPayLoad.ts`.

7. **`tests/ucm-manual3-aws/` tests** follow a slightly different pattern (inline `test.step()` calls rather than page objects for all steps). The Assignments tests under `tests/Assignments/` use the full POM pattern — new filter tests should follow that convention.

8. **QMetry integration** exists (`qmetry-utility/`, `npm run qmetry:import-test-case`) for test case management. New test IDs for filter tests may need to be registered in QMetry.

---

## Open Questions

_All open questions must be resolved before proceeding to spec writing._

_(None — all critical facts have been gathered from code. Ambiguities about filter UI specifics are deferred to the spec step where the user will provide filter names and behavior.)_

---

_End of repo-map.md_
