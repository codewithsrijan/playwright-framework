# Spec — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_
_Jira: [UHS-17045](https://skillsoftdev.atlassian.net/browse/UHS-17045)_
_Status: Approved — live app analysis complete (build.design done 2026-05-25); SC-04 deferred, SC-06 re-scoped_

---

## Feature Summary and Business Goal

Automate all Page Builder workflows in the Percipio UCM admin portal using Playwright and the Page Object Model pattern. Page Builder is accessible at:

```
Admin View → Learning → Page Builder
```

The goal is to establish automated regression coverage for seven distinct Page Builder scenarios — four creation/configuration workflows and three list-page validations — so that Page Builder regressions are caught in CI before reaching production. All automated tests must produce Allure-annotated reports and run on both the **develop** and **stage (AWS)** environments.

---

## In-Scope / Out-of-Scope

### In Scope

| # | Area | Description |
|---|------|-------------|
| 1 | Design tab components | Create a Page Builder page using every available component in the Design tab (enumerated via live app analysis) |
| 2 | Multi-level page creation | Create a parent Page Builder page with at least one child page; use faker-generated names and dummy data throughout |
| 3 | Audience association | Associate an existing audience with a Page Builder page |
| 4 | Multilingual support | ~~Configure at least one non-English locale on a Page Builder page~~ **DEFERRED** — no per-page language config exists in current BETA; follow-on ticket required |
| 5 | Action menu validation | Validate all action menu entries on the Page Builder list page (entries enumerated via live app analysis) |
| 6 | Column picker validation | Validate the **Columns picker** (Columns tab at base of grid) — show/hide individual columns and verify the grid table updates. No row-level filter panel exists in the current BETA. |
| 7 | Drag-and-drop validation | Validate drag-and-drop reordering/placement for all available Design tab components |
| — | Dual-environment | All specs must pass on `develop`; stage compatibility verified via `NODE_ENV=stage` |
| — | Allure reporting | Every test step wrapped in `reporter.step()` per existing POM convention |

### Out of Scope

| Area | Reason |
|------|--------|
| User-login E2E flow for Page Builder | Explicitly deferred by ticket: _"Can automate the end-to-end flow using the user login on the next task"_ |
| API-level test data cleanup | Not in scope; unique faker-generated names are used to avoid collisions; cleanup is manual/periodic |
| Performance or load testing of Page Builder | Not mentioned; not an E2E automation concern |
| Page Builder features outside Admin → Learning → Page Builder path | Out of navigation scope |
| Mobile / non-Chrome browsers | Suite targets Chrome channel only (existing constraint) |
| Unit or contract tests for the Page Builder backend service | This repo is a UI automation suite; backend coverage is not in scope here |

---

## User Scenarios

| ID | Role | Scenario | Entry point |
|----|------|----------|-------------|
| SC-01 | Admin | Creates a Page Builder page and adds all available Design tab components to it | Admin → Learning → Page Builder → New Page |
| SC-02 | Admin | Creates a multi-level page (parent + child page) using dummy data | Admin → Learning → Page Builder → New Page → Add Child |
| SC-03 | Admin | Associates an existing audience with a Page Builder page | Admin → Learning → Page Builder → [page] → Audience tab / Association step |
| SC-04 | Admin | ~~Configures multilingual support~~ **DEFERRED** — per-page language config not in current BETA | N/A — deferred to follow-on ticket |
| SC-05 | Admin | Validates every action in the action menus on the Page Builder list page | Admin → Learning → Page Builder (list view) |
| SC-06 | Admin | Validates the **Columns picker** — toggles individual column visibility and confirms the grid updates (re-scoped; no filter panel exists in BETA) | Admin → Learning → Page Builder (list view) → Columns tab |
| SC-07 | Admin | Drags and drops each available Design tab component to verify reordering/placement works | Admin → Learning → Page Builder → [page editor] → Design tab |

---

## Functional Requirements

> **Note:** Items marked `[DISCOVERY REQUIRED]` are intentionally under-specified until live app analysis (build.design phase) enumerates the exact UI controls. The structure of these requirements is final; the enumerated lists will be filled in post-discovery.

### FR-01 — Design Tab Component Coverage (SC-01)

- **FR-01.1** The test MUST navigate to Admin → Learning → Page Builder and initiate page creation.
- **FR-01.2** The test MUST add every component available in the Design tab to the new page. `[DISCOVERY REQUIRED: component list]`
- **FR-01.3** The test MUST save/publish the page and verify a success state (no error toasts or modal errors).
- **FR-01.4** The test MUST verify the created page appears in the Page Builder list.
- **FR-01.5** Page names MUST be generated by Faker to ensure uniqueness across runs.

### FR-02 — Multi-Level Page Creation (SC-02)

- **FR-02.1** The test MUST create a parent Page Builder page with a Faker-generated name.
- **FR-02.2** The test MUST create at least one child page nested under the parent.
- **FR-02.3** Dummy data (text, images placeholders, etc.) MUST be provided wherever required by form fields.
- **FR-02.4** The test MUST verify the parent-child hierarchy is visible in the Page Builder list or navigation tree.

### FR-03 — Audience Association (SC-03)

- **FR-03.1** The test MUST open an existing Page Builder page (created in or before the test).
- **FR-03.2** The test MUST navigate to the audience association step/tab.
- **FR-03.3** The test MUST associate at least one existing audience with the page.
- **FR-03.4** The test MUST save the association and verify a success state.
- **FR-03.5** A pre-existing audience MUST be available in the target org; if seeding is required, it MUST use `helper/api/payloads/` factories.

### FR-04 — Multilingual Support (SC-04) — ⛔ DEFERRED

> **Status: DEFERRED.** Live app analysis confirmed that no per-page language configuration exists in the current BETA. SC-04 will not be implemented in UHS-17045. A follow-on Jira ticket must be created when per-page multilingual support is added to Page Builder.
>
> FR-04.1 – FR-04.4 are suspended. The `pageBuilderMultilingual.spec.ts` file will NOT be created.

### FR-05 — List Page Action Menu Validation (SC-05)

- **FR-05.1** The test MUST open the action menu for at least one Page Builder page in the list view.
- **FR-05.2** The test MUST verify every action option is present and visible. `[DISCOVERY REQUIRED: action menu entries]`
- **FR-05.3** For each action that triggers a modal/dialog (e.g., Delete confirmation, Duplicate, Publish), the test MUST verify the modal/dialog opens and can be dismissed (cancel path at minimum; happy path for non-destructive actions).
- **FR-05.4** The test MUST verify that a destructive action (e.g., Delete) requires confirmation before executing.

### FR-06 — Column Picker Validation (SC-06, re-scoped)

> **Re-scoped:** No row-level filter panel exists on the Page Builder list page in the current BETA. SC-06 is re-scoped to validate the **Columns picker** (column visibility management). The spec file is renamed from `pageBuilderFilters.spec.ts` → `pageBuilderColumns.spec.ts`.

- **FR-06.1** The test MUST open the Columns picker by clicking the `getByRole("tab", { name: "Columns" })` tab at the base of the data grid.
- **FR-06.2** The test MUST verify the column list is visible and each available column (Name, Status, Type, Modified Date, Created By) has a corresponding visibility toggle.
- **FR-06.3** The test MUST hide at least one column by unchecking its toggle and verify it disappears from the grid header row.
- **FR-06.4** The test MUST re-show the hidden column and verify it re-appears in the grid header row.
- **FR-06.5** The test MUST verify the "Toggle All Columns Visibility" checkbox hides/shows all columns at once.

### FR-07 — Drag-and-Drop Component Validation (SC-07)

- **FR-07.1** The test MUST open the Page Builder editor and navigate to the Design tab.
- **FR-07.2** For each available component, the test MUST perform a drag-and-drop action (reorder or place in canvas). `[DISCOVERY REQUIRED: component list and drag target zones]`
- **FR-07.3** The test MUST verify the component's position changes after the drop (DOM order or visual indicator).
- **FR-07.4** If the component library uses a non-standard DnD implementation, fallback to `mouse.move()` + `dispatchEvent('drop')` is permissible — the strategy MUST be documented in the page object.

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | All tests MUST pass on `develop` environment as the primary target. |
| NFR-02 | All tests MUST be validated for compatibility on `stage` (AWS) environment using `NODE_ENV=stage`. |
| NFR-03 | Every test step MUST be wrapped in `reporter.step()` via `BasePage` conventions — no raw Playwright calls outside a step wrapper. |
| NFR-04 | All created Page Builder pages MUST use Faker-generated unique names (e.g. `faker.lorem.words(3)`) to prevent collision across runs. |
| NFR-05 | No test data cleanup is required; unique names are sufficient. Test data accumulation is accepted. |
| NFR-06 | Tests MUST use the Google Chrome browser channel (existing constraint — `channel: "chrome"`). |
| NFR-07 | Tests MUST use the saved session strategy (`tests/playwright/.auth/user.json`) by default, consistent with existing Assignments specs. |
| NFR-08 | Each spec file MUST follow the existing naming convention: `tests/PageBuilder/<scenarioName>.spec.ts`. |
| NFR-09 | Page Object classes MUST reside in `pageObjects/PageBuilder/` and extend `BasePage`. |
| NFR-10 | All new locators MUST prefer role-based or `data-marker`-based selectors (consistent with `CreateAssignmentWizard` pattern) over raw XPath. |
| NFR-11 | Allure labels (`epic`, `feature`, `story`) MUST be applied to all Page Builder specs per `allureFixtures.ts` convention. |

---

## Acceptance Criteria

The story is **done** when all of the following are true:

| AC | Criterion |
|----|-----------|
| AC-01 | SC-01 spec exists at `tests/PageBuilder/pageBuilderComponents.spec.ts` and passes green on develop with Design tab components discovered via live analysis. |
| AC-02 | SC-02 spec exists at `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` and passes green on develop. Parent-child page creation verified in the list/tree view. |
| AC-03 | SC-03 spec exists at `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` and passes green on develop. Audience association saved and confirmed. |
| AC-04 | ~~SC-04 multilingual spec~~ **DEFERRED** — `pageBuilderMultilingual.spec.ts` not created in this story. Follow-on ticket required. |
| AC-05 | SC-05 spec exists at `tests/PageBuilder/pageBuilderActionMenus.spec.ts` and passes green on develop. All action menu options (list-page row actions + editor page-level actions) verified; Delete confirmation tested. |
| AC-06 | SC-06 spec exists at `tests/PageBuilder/pageBuilderColumns.spec.ts` (renamed from pageBuilderFilters) and passes green on develop. Columns picker verified: hide, show, and toggle-all column visibility confirmed. |
| AC-07 | SC-07 spec exists at `tests/PageBuilder/pageBuilderDragDrop.spec.ts` and passes green on develop. Drag-and-drop position change verified for all Design tab components. |
| AC-08 | All 7 specs produce Allure-annotated step results (steps visible in `allure-report/`). |
| AC-09 | All 7 specs run without modification against `stage` (AWS) environment when `NODE_ENV=stage`. |
| AC-10 | All new Page Object classes in `pageObjects/PageBuilder/` extend `BasePage` and use role-based locators. |

---

## Repo Impact Matrix

| Repo | Area | Change Type | Why |
|------|------|-------------|-----|
| `ucm-playwright-automation` | `pageObjects/PageBuilder/` | **New directory + new files** | No Page Builder page objects exist today; must be created from scratch |
| `ucm-playwright-automation` | `tests/PageBuilder/` | **New directory + 7 new spec files** | One spec per scenario (SC-01 through SC-07) |
| `ucm-playwright-automation` | `playwright.config.ts` | **Possible minor edit** | Verify `testDir` / `testMatch` includes `tests/PageBuilder/**`; if the glob already matches, no change needed |
| `ucm-playwright-automation` | `helper/api/payloads/` | **Possible new payload file** | SC-03 (audience association) may require an existing audience; if none exists in the env, an API payload factory is needed to seed one |
| `ucm-playwright-automation` | `specs-UHS-17045/` | **New directory** | This spec and combined repo map |

---

## Dependencies / Assumptions

| # | Dependency / Assumption |
|---|------------------------|
| 1 | **Live app analysis required.** Component enumeration (FR-01, FR-07), filter names (FR-06), and action menu entries (FR-05) are intentionally deferred to the build.design phase where Playwright MCP will be used to inspect the live admin UI. |
| 2 | **Auth via saved session.** Page Builder is assumed accessible with the standard admin credentials already stored in `tests/playwright/.auth/user.json`. If Page Builder requires a separate role or permission, a fresh login fixture or additional auth step will be needed. |
| 3 | **Pre-existing audience.** SC-03 assumes at least one audience exists in the target org. If not, `helper/api/payloads/createAudiencePayload.ts` (or equivalent) must be used to seed one in `beforeAll`. |
| 4 | **Locale availability.** SC-04 assumes the target org has multilingual features enabled. Locales will be discovered via live app analysis; if no additional locales are enabled, this scenario may be limited or require org configuration. |
| 5 | **Stage environment config.** `config/stage.json.template` already exists; `npm run jenkins-config-template` must be run with `NODE_ENV=stage` before stage-targeted runs. |
| 6 | **Sequential execution.** `playwright.config.ts` runs `workers: 1`; Page Builder tests will run sequentially. If parallelism is desired for a subset of tests, `test.describe.configure({ mode: 'parallel' })` can be added per suite. |
| 7 | **Drag-and-drop implementation TBD.** The exact DnD mechanism (React DnD, HTML5 native, Sortable.js, etc.) will be determined during live app analysis. The implementation strategy in the page object may vary accordingly. |

---

## Observations

1. **All spec file locations and page object paths are determined** by the existing repo conventions — no configuration changes are needed unless `testDir` patterns don't already match `tests/PageBuilder/**`.

2. **Drag-and-drop (SC-07) is the highest technical risk.** Playwright's `locator.dragTo()` works for standard HTML5 DnD, but React DnD and similar libraries often require `mouse.move()` + `dispatchEvent` sequences. The strategy must be validated during live analysis and documented in the page object.

3. **Filter testing (SC-06) depends on having sufficient test data in the list.** If the Page Builder list is empty, filter tests won't produce observable results. Pre-seeding at least 3–5 pages with distinct names/statuses may be needed in `beforeAll`.

4. **Locale discovery for SC-04 may reveal zero additional locales** in the develop org. If this is the case, SC-04 will either test the locale toggle (enabled/disabled state) or be marked as a conditional test with `test.skip` and a documented reason.

5. **QMetry registration.** Per repo observation, new test IDs (HP-xx, NG-xx for Page Builder) should be registered in QMetry. This is a post-spec concern but should be tracked.

6. **Action menu "destructive action" assumption.** FR-05.4 assumes a Delete or similar destructive action exists in the action menu. If no destructive action exists, FR-05.4 is not applicable — this will be confirmed during live app analysis.

---

## Open Questions

> ✅ All open questions resolved during build.design phase (2026-05-25) via Playwright MCP live analysis.

| # | Question | Resolution |
|---|----------|------------|
| OQ-01 | What components are available in the Design tab? | **RESOLVED.** 14 components: Basic (Text, Button, Image, Video, Divider, Dynamic Text), Static (Image & Text Card, Text & Button Card, Image Text & Button Card, Profile Card), Dynamic (Dynamic Card, Dynamic Strip, Promoted Content Strip, Promoted Banner). See `design.md`. |
| OQ-02 | What filters exist on the Page Builder list page? | **RESOLVED (none).** No row-level filter panel exists. Only column picker (Columns tab). SC-06 re-scoped to Columns picker validation. |
| OQ-03 | What action menu entries exist on the Page Builder list page? | **RESOLVED.** Row-level (list page): Publish, Rename, Preview, Delete, Duplicate. Page-level (editor Pages tab): Rename, Copy link, Add subpage. |
| OQ-04 | Does the target develop org have multilingual features enabled, and which locales? | **RESOLVED.** No per-page multilingual feature exists in BETA. Global UI language selector has 47 locales. SC-04 deferred. |
| OQ-05 | What admin role/permission is required to access Page Builder? | **RESOLVED.** Standard admin credentials (`adminsw`) can access Page Builder. No special role needed. |
| OQ-06 | Does Page Builder use an HTML5-native DnD, React DnD, or another mechanism? | **RESOLVED (partially).** NOT HTML5-native, NOT dnd-kit, NOT react-beautiful-dnd. Pointer-event based. `dragTo()` first, `mouse.*` fallback. Final strategy confirmed during implementation. |
| OQ-07 | Does a pre-existing audience exist in the develop org for SC-03? | **RESOLVED.** "All Users" audience (4,237 users) already exists. No seeding required. |

---

_End of spec.md_
