# Architecture — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_
_Jira: [UHS-17045](https://skillsoftdev.atlassian.net/browse/UHS-17045)_
_Status: Ready for implementation_

---

## Current-State Baseline

### Repository

`ucm-playwright-automation` is a single-repo Playwright E2E test automation suite for the Percipio UCM admin portal. It uses the Page Object Model (POM) pattern with a pluggable reporter abstraction (`IReporter` / `ReporterRegistry`) backed by Allure as the default reporter.

### Existing Test Infrastructure

| Layer | Current State |
|-------|--------------|
| `BasePage` | Abstract base class at `pageObjects/base/BasePage.ts`; provides `step()`, `click()`, `fill()`, `dragAndDrop()`, `assertVisible()`, and all other action/assertion primitives. Every method wraps `Reporter.step()`. |
| `Reporter` | Shim at `utils/Reporter.ts` delegating to `framework/reporting/ReporterRegistry`; default is `AllureReporter` (allure-js-commons). |
| `fixtures/allureFixtures.ts` | Extends Playwright `base.test`; augments the `page` fixture with console log collection and screenshot-on-failure. Exposes `loginPage` fixture. |
| `fixtures/loginFixture.ts` | Extends `allureFixtures`; adds `lognToPageFixture` (auto-navigates + logs in before test) for tests that need a fresh OAuth session. |
| `playwright.config.ts` | `testDir: "."`, `testMatch: ["tests/**/*.spec.ts"]`, `testIgnore: ["tests/tests-api/**"]`, `workers: 1`, Chrome channel, global setup via `utils/globalSetup.ts`. |
| `tests/playwright/.auth/user.json` | Session saved by `auth.setup.ts` (`setup` project); loaded by the `chrome` project for all spec runs. |

### What Exists for Page Builder Today

| Item | State |
|------|-------|
| `pageObjects/PageBuilder/` | **Does not exist.** No Page Builder page objects anywhere in the repo. |
| `tests/PageBuilder/` | **Does not exist.** No Page Builder test specs. |
| Navigation to Page Builder | Reachable via Admin nav `[data-marker="pageBuilder"]` → `/admin/landing-pages`. No helper method in any existing page object. |
| Audience seeding (SC-03 pre-condition) | Not required — "All Users" audience (4,237 users) confirmed pre-existing in the develop org. |

### Existing POM Pattern Exemplars

| Exemplar | What it teaches |
|----------|----------------|
| `pageObjects/Assignments/CreateAssignmentWizard.page.ts` | Multi-step wizard pattern: role-based locators, wizard step navigation methods, `data-marker` attribute hooks |
| `pageObjects/Audiences/CreateAudiencePage.page.ts` | Flexible `.or()` chaining for locator fallbacks on polymorphic UI controls |
| `pageObjects/Assignments/AssignmentsPage.page.ts` | List page pattern; row action button; pagination — though uses AG Grid (different from Page Builder's treegrid) |

---

## Target-State Architecture

### New File Tree

```
ucm-playwright-automation/
│
├── pageObjects/
│   └── PageBuilder/                             ← NEW DIRECTORY
│       ├── PageBuilderListPage.page.ts           ← NEW (SC-05, SC-06; list + row actions + columns)
│       ├── PageBuilderEditorPage.page.ts         ← NEW (SC-01, SC-02, SC-07; toolbar + nav)
│       ├── PageBuilderDesignPanel.page.ts        ← NEW (SC-01, SC-07; 14 Design tab components + DnD)
│       ├── PageBuilderPagesPanel.page.ts         ← NEW (SC-02; Pages tab tree + Add subpage)
│       └── PageBuilderPublishWizard.page.ts      ← NEW (SC-03; 5-step Publish wizard incl. audience)
│
└── tests/
    └── PageBuilder/                              ← NEW DIRECTORY
        ├── pageBuilderComponents.spec.ts         ← NEW (SC-01: Design tab all 14 components)
        ├── pageBuilderMultiLevel.spec.ts         ← NEW (SC-02: parent + child page creation)
        ├── pageBuilderAudienceAssociation.spec.ts← NEW (SC-03: audience via Publish wizard step 3)
        │  [pageBuilderMultilingual.spec.ts]      ← NOT CREATED — SC-04 deferred
        ├── pageBuilderActionMenus.spec.ts        ← NEW (SC-05: list-row + editor page-level menus)
        ├── pageBuilderColumns.spec.ts            ← NEW (SC-06: Columns picker show/hide/toggle-all)
        └── pageBuilderDragDrop.spec.ts           ← NEW (SC-07: DnD all Design tab components)
```

### playwright.config.ts — No Change Required

`testMatch: ["tests/**/*.spec.ts"]` already matches `tests/PageBuilder/*.spec.ts` via the `**` glob. No modification to `playwright.config.ts` is needed.

### helper/api/payloads/ — No Change Required

SC-03 assumes a pre-existing audience in the develop org. Live app analysis (2026-05-25) confirmed "All Users" (4,237 users) already exists. No payload factory file is needed.

---

## Page Object Class Responsibilities

| Class | Wraps | Methods (summary) |
|-------|-------|-------------------|
| `PageBuilderListPage` | `/admin/landing-pages` list view | `navigateToPageBuilder()`, `clickGetStarted()`, `openRowActionsMenu(pageName)`, `clickRowAction(action)`, `confirmDelete()`, `cancelDelete()`, `openColumnsTab()`, `toggleColumnVisibility(columnName)`, `toggleAllColumns()`, `assertColumnVisible(name)`, `assertColumnHidden(name)`, `assertRowPresent(pageName)` |
| `PageBuilderEditorPage` | Editor toolbar + tab switcher | `clickEditMode()`, `clickPublish()`, `clickSave()`, `clickRevert()`, `clickPreview()`, `goBackToList()`, `switchToDesignTab()`, `switchToPagesTab()`, `assertEditorLoaded()` |
| `PageBuilderDesignPanel` | Design tab panel + component palette | `expandStaticSection()`, `expandDynamicSection()`, `addComponent(componentName)`, `dragComponentToCanvas(componentName, targetLocator)`, `assertComponentOnCanvas(componentName)` |
| `PageBuilderPagesPanel` | Pages tab tree | `openPageActionsMenu(pageName)`, `clickAddSubpage()`, `clickRename()`, `clickCopyLink()`, `assertPageInTree(pageName)`, `assertSubpageInTree(parentName, childName)` |
| `PageBuilderPublishWizard` | 5-step Publish wizard | `fillStep1Details(title, url?)`, `proceedToStep2()`, `proceedToStep3()`, `selectAudience(audienceName)`, `proceedToStep4()`, `setDefaultHomepage(yes)`, `proceedToStep5()`, `publishPage()`, `cancelAndLeave()`, `cancelAndStay()` |

### Create Page Helper

The "Create new page" modal (triggered from `[data-marker="getStartedBtn"]`) is a lightweight inline form, not a full wizard. It can be modeled as a method on `PageBuilderListPage`:

```typescript
async createNewPage(title: string): Promise<void>  // fills #pageTitle, clicks "Create page", waits for editor load
```

---

## Sequence / Flow Narrative

### SC-01 — Design Tab Component Coverage

```
1. auth.setup.ts          — Saves session to tests/playwright/.auth/user.json
2. pageBuilderComponents.spec.ts .beforeEach
   └── PageBuilderListPage.navigateToPageBuilder()       → /admin/landing-pages
       └── AdminHomePage-style nav via [data-marker="pageBuilder"]
3. PageBuilderListPage.clickGetStarted()                → opens Create page modal
4. PageBuilderListPage.createNewPage(fakerTitle)        → fills #pageTitle, submits → /admin/page-builder
5. PageBuilderEditorPage.clickEditMode()               → activates Edit mode
6. PageBuilderEditorPage.switchToDesignTab()
7. PageBuilderDesignPanel.expandStaticSection()         → expands Static accordion
8. PageBuilderDesignPanel.expandDynamicSection()        → expands Dynamic accordion
9. FOR each of 14 components:
   PageBuilderDesignPanel.addComponent(name)            → click component button in palette
   BasePage.assertVisible(canvas marker)               → assert component appears on canvas
10. PageBuilderEditorPage.clickSave()
11. PageBuilderEditorPage.goBackToList()
12. PageBuilderListPage.assertRowPresent(fakerTitle)    → page visible in list
```

### SC-02 — Multi-Level Page Creation

```
1. Navigate to /admin/landing-pages (saved session)
2. PageBuilderListPage.createNewPage(parentTitle)       → /admin/page-builder
3. PageBuilderEditorPage.switchToPagesTab()
4. PageBuilderPagesPanel.openPageActionsMenu(parentTitle)
5. PageBuilderPagesPanel.clickAddSubpage()              → subpage form appears
6. Fill subpage name (fakerChildTitle)                  → child page created
7. PageBuilderPagesPanel.assertSubpageInTree(parentTitle, childTitle)
8. PageBuilderEditorPage.clickSave()
9. PageBuilderEditorPage.goBackToList()
10. PageBuilderListPage.assertRowPresent(parentTitle)
```

### SC-03 — Audience Association

```
1. Navigate to /admin/landing-pages (saved session)
2. PageBuilderListPage.createNewPage(fakerTitle)        → editor
3. PageBuilderEditorPage.clickPublish()                 → opens 5-step Publish wizard (Step 1)
4. PageBuilderPublishWizard.fillStep1Details(fakerTitle)
5. PageBuilderPublishWizard.proceedToStep2()            → Step 2: Pages
6. PageBuilderPublishWizard.proceedToStep3()            → Step 3: Determine visibility
7. PageBuilderPublishWizard.selectAudience("All Users") → selects pre-existing audience
8. PageBuilderPublishWizard.proceedToStep4()            → Step 4: Default homepage
9. PageBuilderPublishWizard.setDefaultHomepage(false)   → set to No
10. PageBuilderPublishWizard.proceedToStep5()           → Step 5: Review and publish
11. Assert audience name visible in review summary
12. PageBuilderPublishWizard.cancelAndLeave()           → dismiss wizard (or publishPage() for full flow)
```

> **Note:** The cancel path (`cancelAndLeave()`) must handle the `[role="alertdialog"]` "Leave without saving?" dialog by clicking "Yes, leave without saving". This was confirmed during live analysis.

### SC-05 — Action Menu Validation

```
── List-page row actions ───────────────────────────────────────────
1. Navigate to /admin/landing-pages with ≥1 page in list
2. PageBuilderListPage.openRowActionsMenu(pageName)     → [role="menu"] appears
3. Assert all 5 menuitem entries visible: Publish, Rename, Preview, Delete, Duplicate
4. PageBuilderListPage.clickRowAction("Delete")         → alertdialog appears
5. Assert [role="alertdialog"] with "Yes, leave without saving" and "No, keep working"
6. PageBuilderListPage.cancelDelete()                   → dismiss
7. PageBuilderListPage.clickRowAction("Rename")         → inline rename input appears
8. Assert rename input visible
9. (Optional) Test Duplicate: verify new row appears with "Copy of ..." name

── Editor page-level actions ───────────────────────────────────────
10. Open any page in editor
11. PageBuilderEditorPage.switchToPagesTab()
12. PageBuilderPagesPanel.openPageActionsMenu(pageName)  → menu with 3 items
13. Assert 3 entries visible: Rename, Copy link, Add subpage
```

### SC-06 — Column Picker Validation

```
1. Navigate to /admin/landing-pages
2. PageBuilderListPage.openColumnsTab()                 → getByRole("tab", { name: "Columns" })
3. Assert column toggles visible: Name, Status, Type, Modified Date, Created By
4. PageBuilderListPage.toggleColumnVisibility("Status") → uncheck Status toggle
5. Assert [role="columnheader"] does NOT contain "Status"
6. PageBuilderListPage.toggleColumnVisibility("Status") → re-check Status toggle
7. Assert [role="columnheader"] contains "Status" again
8. PageBuilderListPage.toggleAllColumns()               → click "Toggle All Columns Visibility"
9. Assert NO columnheaders visible (all hidden)
10. PageBuilderListPage.toggleAllColumns()              → click again to show all
11. Assert all 5 columnheaders visible again
```

### SC-07 — Drag-and-Drop Component Validation

```
1. Navigate to /admin/landing-pages, create a fresh blank page (fakerTitle)
2. PageBuilderEditorPage.clickEditMode()
3. PageBuilderEditorPage.switchToDesignTab()
4. PageBuilderDesignPanel.expandStaticSection()
5. PageBuilderDesignPanel.expandDynamicSection()
6. FOR each of 14 components:
   a. PageBuilderDesignPanel.dragComponentToCanvas(name, canvasDropZone)
      → Strategy A: source.dragTo(canvasDropZone)
      → Strategy B (fallback): mouse.move + mouse.down + mouse.move(steps:10) + mouse.up
   b. Assert component appears on canvas (DOM order or data-marker on canvas element)
   c. Optionally: verify reorder by dragging a second component above the first
7. PageBuilderEditorPage.clickSave()
```

---

## Inter-Service Communication

This is a **browser-level E2E test automation story**. The tests drive a Chrome browser instance; they do not call backend services directly.

```
Test Process (Node.js)
  └── Playwright Test runner
        └── Chrome (Google Chrome channel) — browser process
              └── HTTP/HTTPS → Percipio Admin UI (React SPA)
                    └── [Runtime calls from the SPA, not from tests:]
                          ├── ucm2bff (BFF) — user data, Page Builder CRUD
                          ├── organizations-api — org context
                          └── settings-service — platform settings

No backend service is changed by UHS-17045.
No API calls are made by the test code (helper/api/ layer not used for Page Builder).
```

### Auth Flow

```
auth.setup.ts (setup project)
  1. Opens Chrome → https://plat3-complete.front.develop.squads-dev.com
  2. LoginPage.openPercipio() → LoginPage.login(adminsw / ##knock22)
  3. Saves context.storageState() → tests/playwright/.auth/user.json

chrome project (all specs)
  4. Loads storageState from tests/playwright/.auth/user.json
  5. Each spec navigates directly to /admin/landing-pages (no fresh login needed)
```

> **Note:** Unlike `assignmentCreate.spec.ts` which uses `test.use({ storageState: { cookies: [], origins: [] } })` + fresh `lognToPageFixture` login, Page Builder specs will use the saved session from `auth.setup.ts`. Live analysis confirmed `adminsw` can access Page Builder without a special role (OQ-05 resolved).

---

## Data Flow and Storage

### Test Data

| Type | Generation | Lifecycle |
|------|-----------|-----------|
| Page names (SC-01, SC-02, SC-07) | `faker.lorem.words(3)` — unique per run | Persists in develop org after test; never cleaned up (NFR-05) |
| Child page names (SC-02) | `faker.lorem.words(2)` | Same as above |
| Audience used (SC-03) | Pre-existing "All Users" in develop org | Not created or deleted by tests |

### Session State

| File | Written by | Read by | Notes |
|------|-----------|---------|-------|
| `tests/playwright/.auth/user.json` | `auth.setup.ts` | `playwright.config.ts` chrome project | May expire; auth.setup re-runs before each full suite invocation |

### Allure Output

```
Test execution
  └── allure-playwright reporter → allure-results/*.json + attachments
        └── allure generate allure-results → allure-report/index.html

Per-step recording:
  Every BasePage.step() / Reporter.step() call → one Allure step node
  console logs → Reporter.attachConsoleLogs() (post-test, via allureFixtures)
  screenshots → Reporter.screenshotOnFailure() (on failure, via allureFixtures)
```

### Allure Label Convention

Following the `test.describe()` naming pattern already used in the repo:

```typescript
// Each spec file follows this pattern:
import { test, expect } from "../../fixtures/allureFixtures";

test.describe("SC-01: Page Builder — Design tab components", () => {
  test("PB-01: Add all 14 Design tab components to a new page", async ({ page }) => {
    // ...
  });
});
```

> The existing `assignmentCreate.spec.ts` does not use explicit `allure.label()` calls — it embeds IDs in `test.describe()` and `test()` names, which propagate to Allure naturally. New Page Builder specs follow the same convention with `PB-XX` IDs.

---

## Repo-by-Repo Change Map

Single-repo workspace — all changes are in `ucm-playwright-automation`.

### Impacted Directories and Files

| Path | Change Type | Why |
|------|------------|-----|
| `pageObjects/PageBuilder/` | **New directory** | No Page Builder page objects exist; full POM hierarchy required |
| `pageObjects/PageBuilder/PageBuilderListPage.page.ts` | **New file** | List page POM: navigation, row actions, Columns picker |
| `pageObjects/PageBuilder/PageBuilderEditorPage.page.ts` | **New file** | Editor toolbar POM: edit/save/publish/revert/preview + tab switching |
| `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` | **New file** | Design tab panel: 14 components, accordion expand, DnD |
| `pageObjects/PageBuilder/PageBuilderPagesPanel.page.ts` | **New file** | Pages tab tree: page actions menu, Add subpage |
| `pageObjects/PageBuilder/PageBuilderPublishWizard.page.ts` | **New file** | 5-step Publish wizard: all steps including audience association |
| `tests/PageBuilder/` | **New directory** | No Page Builder specs exist |
| `tests/PageBuilder/pageBuilderComponents.spec.ts` | **New file** | SC-01: adds all 14 Design tab components |
| `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` | **New file** | SC-02: parent + child page creation |
| `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` | **New file** | SC-03: audience association via Publish wizard |
| `tests/PageBuilder/pageBuilderActionMenus.spec.ts` | **New file** | SC-05: list-row + editor page-level action menus |
| `tests/PageBuilder/pageBuilderColumns.spec.ts` | **New file** | SC-06: Columns picker show/hide/toggle-all |
| `tests/PageBuilder/pageBuilderDragDrop.spec.ts` | **New file** | SC-07: DnD all 14 Design tab components |
| `playwright.config.ts` | **No change** | `testMatch: ["tests/**/*.spec.ts"]` already matches `tests/PageBuilder/**` via glob |
| `helper/api/payloads/` | **No change** | No API seeding required; "All Users" audience pre-exists |
| `fixtures/allureFixtures.ts` | **No change** | Existing fixture infrastructure is sufficient |
| `fixtures/loginFixture.ts` | **No change** | Saved session used; `lognToPageFixture` not required for Page Builder |

### Key Locator Decisions per Class

#### `PageBuilderListPage`

```typescript
// Navigation
readonly navLink = this.page.locator('[data-marker="pageBuilder"]');
readonly getStartedBtn = this.page.locator('[data-marker="getStartedBtn"]');

// Create page modal
readonly pageTitleInput = this.page.locator('#pageTitle');
readonly createPageBtn = this.page.getByRole("button", { name: "Create page" });

// List/grid
readonly dataTable = this.page.locator('[data-marker="flexibleDataTableContainer"]');
readonly rowActionsBtn = this.page.locator('[data-marker="Actions"]');

// Row actions menu items
// getByRole("menuitem", { name: "Publish" | "Rename" | "Preview" | "Delete" | "Duplicate" })

// Column visibility
readonly columnsTab = this.page.getByRole("tab", { name: "Columns" });
// Column headers: getByRole("columnheader", { name: "Status" | "Type" | ... })

// Delete confirmation
readonly alertDialog = this.page.getByRole("alertdialog");
readonly confirmLeaveBtn = this.page.getByRole("button", { name: "Yes, leave without saving" });
readonly stayBtn = this.page.getByRole("button", { name: "No, keep working" });
```

#### `PageBuilderEditorPage`

```typescript
readonly editBtn = this.page.getByRole("button", { name: "Edit" });
   // ⚠️ Multiple "Edit" buttons exist in some states — filter by TopNav class or use .first()
readonly publishBtn = this.page.getByRole("button", { name: "Publish" });
readonly saveBtn = this.page.getByRole("button", { name: "Save" });
readonly revertBtn = this.page.getByRole("button", { name: "Revert" });
readonly previewBtn = this.page.getByRole("button", { name: "Preview" });
readonly backBtn = this.page.getByRole("button", { name: "Back to Page Builder main" });
readonly designTab = this.page.getByRole("tab", { name: "Design" });
readonly pagesTab = this.page.getByRole("tab", { name: "Pages" });
```

#### `PageBuilderDesignPanel`

```typescript
readonly panel = this.page.locator('[data-marker="pageBuilderDesignContent"]');
readonly staticToggle = this.page.getByRole("button", { name: /Static Editable elements/ });
readonly dynamicToggle = this.page.getByRole("button", { name: /Dynamic Elements managed/ });

// Component buttons in palette (within panel):
componentBtn(name: string): Locator {
  return this.panel.getByRole("button", { name });
}

// Canvas drop target — confirmed data-marker:
canvasComponentEl(marker: string): Locator {
  return this.page.locator(`[data-marker="${marker}"]`);
}
// Confirmed: PageBuilder--text, PageBuilder--imageTextCard
// Inferred (confirm during implementation): PageBuilder--button, PageBuilder--image, etc.
```

#### `PageBuilderPagesPanel`

```typescript
readonly pageActionsBtn = this.page.getByRole("button", { name: "Actions null" });
   // ⚠️ Bug: aria-label includes literal "null" — fragile if fixed; monitor during implementation
   // Fallback: this.page.locator('[aria-label^="Actions"]')
readonly addSubpageItem = this.page.getByRole("button", { name: "Add subpage" });
readonly renameItem = this.page.getByRole("button", { name: "Rename" });
readonly copyLinkItem = this.page.getByRole("button", { name: "Copy link" });
readonly dragToReorderHandle = this.page.getByRole("button", { name: "Drag to reorder" });
```

#### `PageBuilderPublishWizard`

```typescript
// Step 1
readonly pageTitleInput = this.page.locator('#pageTitle');
readonly nextPagesBtn = this.page.getByRole("button", { name: "Next: Pages" });

// Step 2
readonly nextVisibilityBtn = this.page.getByRole("button", { name: "Next: Determine visibility" });

// Step 3 — Audience
readonly audienceSearch = this.page.locator('#search');
readonly allAudiencesTab = this.page.getByRole("tab", { name: "All audiences" });
readonly selectedAudiencesTab = this.page.getByRole("tab", { name: "Selected audiences" });
readonly nextDefaultHomepageBtn = this.page.getByRole("button", { name: "Next: Default homepage" });

// Step 4
readonly defaultHomepageYes = this.page.getByRole("radio", { name: "Yes" });
readonly defaultHomepageNo = this.page.getByRole("radio", { name: "No" });
readonly nextReviewBtn = this.page.getByRole("button", { name: "Next: Review and publish" });

// Step 5
readonly editAudienceBtn = this.page.locator('[data-marker="editAudienceButton"]');
readonly publishBtn = this.page.getByRole("button", { name: "Publish page(s)" });
readonly cancelBtn = this.page.getByRole("button", { name: "Cancel" });

// Leave dialog
readonly confirmLeaveBtn = this.page.getByRole("button", { name: "Yes, leave without saving" });
readonly stayBtn = this.page.getByRole("button", { name: "No, keep working" });
```

---

## Database Compatibility Notes

> **Not applicable.** This is a pure test automation story. No database migrations, schema changes, SQL queries, or persistence layer modifications are introduced. The test suite reads from and writes to the Percipio Admin UI exclusively; all backend persistence is managed by the Percipio platform services (out of scope for UHS-17045).

---

## Risks and Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R-01 | **DnD implementation fragility** — Pointer-event based DnD may not respond to `dragTo()` on a blank canvas | High | SC-07 blocked | Implement dual strategy in `PageBuilderDesignPanel.dragComponentToCanvas()`: attempt `source.dragTo(target)` first; on failure, fall back to `mouse.move()` + `mouse.down()` + `mouse.move({steps:10})` + `mouse.up()`. Document chosen strategy in JSDoc. |
| R-02 | **Canvas data-marker values unconfirmed for 5 of 14 components** — Button, Image, Video, Divider, Dynamic Text are marked `_(inferred)_` in design.md | Medium | SC-01, SC-07 assertions may fail | During SC-01 implementation, add each component to canvas and inspect DOM for actual `data-marker` values; update `PageBuilderDesignPanel` accordingly before SC-07. |
| R-03 | **`aria-label="Actions null"` fragile locator** — "null" is a product bug; if fixed, locator breaks | Low | SC-05, SC-02 affected | Use `this.page.locator('[aria-label^="Actions"]')` as primary locator (prefix match). Document the bug in the page object's JSDoc. |
| R-04 | **Saved session expiry** — `tests/playwright/.auth/user.json` may expire between CI runs | Medium | All Page Builder specs fail on login redirect | Re-run `auth.setup.ts` before any Page Builder run. If session issues persist, add `test.use({ storageState: { cookies: [], origins: [] } })` + `lognToPageFixture` to Page Builder specs (same pattern as `assignmentCreate.spec.ts`). |
| R-05 | **10 published page cap** — Org caps at 10 published pages; repeated test runs that publish may exhaust the cap | Medium | SC-03 may fail after ~10 runs | Use `cancelAndLeave()` instead of `publishPage()` wherever publication is not required by the AC. For SC-03 (audience association), cancel after Step 5 review — association is verified without publishing. If cap is hit, manually delete old published pages. |
| R-06 | **Only one template available** — "Academy Experience" is the only live template; the other two are "Coming soon" | Low | All creation tests must use this template | Confirmed during live analysis. All `createNewPage()` calls click `[data-marker="getStartedBtn"]` (Academy Experience). No mitigation needed. |
| R-07 | **Undo/Redo buttons have empty `aria-label`** — Cannot locate by `getByRole("button", { name: "Undo" })` | Low | Undo/Redo not testable via role | Use class-based selector `button.TopNavigationBar---undoRedoButton` (1st = Undo, 2nd = Redo) with a code comment explaining the accessibility bug. |
| R-08 | **`editLandingPageDetailsButton` data-marker unverified** — marked `_(verify)_` in design.md | Low | SC-05 Review step assertion | Confirm marker during implementation by reaching Step 5 of Publish wizard and inspecting DOM. |
| R-09 | **Static/Dynamic accordion sections may default to collapsed** — `addComponent()` will fail if section is collapsed | Medium | SC-01, SC-07 | Always call `expandStaticSection()` and `expandDynamicSection()` before any Static or Dynamic component interaction. Both methods must be idempotent (only click if not already expanded). |
| R-10 | **`/admin/page-builder` URL ambiguity** — navigating directly to this URL opens the last-opened editor page, not the list | Medium | Tests that hard-navigate to wrong URL will operate on wrong page | Always navigate via `[data-marker="pageBuilder"]` nav link or directly to `/admin/landing-pages`. Never use `/admin/page-builder` as a navigation target. |

---

## Observations

1. **`playwright.config.ts` requires zero changes.** The `testMatch: ["tests/**/*.spec.ts"]` glob already covers `tests/PageBuilder/` via the `**` wildcard. This is confirmed by examining the config; no edit is needed.

2. **Saved session is sufficient for Page Builder.** Unlike `assignmentCreate.spec.ts` which bypasses the saved session due to OAuth redirect issues on `/admin/assignments`, Page Builder tests at `/admin/landing-pages` can use the saved session without a fresh login. This was confirmed during live analysis — the `adminsw` user session navigated to Page Builder successfully.

3. **SC-03 tests the cancel path, not the publish path.** The 10-published-page cap (R-05) means tests should verify audience association at the Step 5 review screen and then cancel, rather than actually publishing. This satisfies AC-03 without consuming the published page slot.

4. **`PageBuilderDesignPanel` and `PageBuilderEditorPage` are composites, not independent pages.** Both classes wrap parts of the same URL (`/admin/page-builder`) and will be instantiated together in specs that need the editor. Specs should instantiate `PageBuilderEditorPage` for toolbar actions and `PageBuilderDesignPanel` / `PageBuilderPagesPanel` for the side panel — all sharing the same `page` instance.

5. **DnD canvas drop zone strategy.** Live analysis found the canvas shows "Drag and drop items from Design panel" when empty. The canvas `[data-marker="flexibleDataTableContainer"]` is used for the list, but the editor canvas has a different structure. Confirmed drop target: the canvas area itself — exact locator TBD during SC-07 implementation. See R-01 for fallback strategy.

6. **SC-01 and SC-07 share the Design tab infrastructure.** `PageBuilderDesignPanel` is shared between the two specs. SC-01 tests "add component to canvas"; SC-07 tests "reorder/reposition via DnD". They should share the same page object but use different methods (`addComponent()` vs. `dragComponentToCanvas()`).

7. **Delete confirmation uses `[role="alertdialog"]`, not `[role="dialog"]`.** This was confirmed during live analysis — the modal has the `alertdialog` ARIA role, which aligns with the "Leave without saving?" pattern seen when canceling the Publish wizard. Both `PageBuilderListPage` (Delete action) and `PageBuilderPublishWizard` (Cancel action) must handle this dialog.

8. **QMetry test IDs.** New Page Builder tests should be assigned `PB-XX` test IDs and registered in QMetry (`qmetry-utility/`) following the existing `HP-XX` / `NG-XX` pattern. This is a post-implementation concern but should be tracked during the implementation phase.

9. **Stage environment compatibility (NFR-02).** No Page Builder-specific stage configuration is required beyond `NODE_ENV=stage`. The `config/stage.json.template` already exists; running `npm run jenkins-config-template` with `NODE_ENV=stage` will produce the stage config. Page Builder tests are environment-agnostic at the code level — only the base URL changes.

10. **`strict: false` in `tsconfig.json`.** New Page Builder page objects should aim for explicit typing despite the project-wide `strict: false` setting, consistent with the approach in `CreateAssignmentWizard.page.ts`. Avoid implicit `any` in new code.

---

## Open Questions

> ✅ All open questions resolved. No blockers remain for implementation.

_(No open questions — all architecture decisions are deterministic given the live app analysis completed on 2026-05-25.)_

---

_End of architecture.md_
