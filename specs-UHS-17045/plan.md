# Implementation Plan — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_

---

## Technical Context

Single-repo Playwright E2E suite (`ucm-playwright-automation`). All changes are net-new additions — **no existing files are broken or modified except `AdminHomePage.page.ts`** (one new method). No database, no API contract, no CI config changes required.

Key confirmed facts from live analysis (2026-05-25):
- Page Builder list URL: `/admin/landing-pages` (NOT `/admin/page-builder`)
- DnD mechanism: pointer-event based — no HTML5 draggable, no dnd-kit
- Audience pre-condition: "All Users" (4,237 users) already exists in develop org
- No filter panel on list page — SC-06 re-scoped to Columns picker
- SC-04 deferred — no per-page multilingual config in current BETA
- `adminsw` credential works for Page Builder — no special role needed
- 10-page published page cap — tests must not publish more than needed

---

## Repo Scope and Ownership

Single repo: `ucm-playwright-automation`

| Category | Files | Count |
|----------|-------|-------|
| New page object classes | `pageObjects/PageBuilder/*.page.ts` | 5 |
| New spec files | `tests/PageBuilder/*.spec.ts` | 6 |
| Modified existing | `pageObjects/AdminHomePage.page.ts` | 1 |
| No change needed | `playwright.config.ts`, `fixtures/`, `helper/api/`, `utils/` | — |

---

## Implementation Phases

### Phase A — Page Object Infrastructure (must complete before specs)

| # | File | Depends on |
|---|------|-----------|
| A-1 | `pageObjects/PageBuilder/PageBuilderListPage.page.ts` | `BasePage` |
| A-2 | `pageObjects/PageBuilder/PageBuilderEditorPage.page.ts` | `BasePage` |
| A-3 | `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` | `BasePage` |
| A-4 | `pageObjects/PageBuilder/PageBuilderPagesPanel.page.ts` | `BasePage` |
| A-5 | `pageObjects/PageBuilder/PageBuilderPublishWizard.page.ts` | `BasePage` |
| A-6 | Update `pageObjects/AdminHomePage.page.ts` | Existing file |

### Phase B — Spec Files (order: simplest → most complex)

| # | File | Page Objects needed | SC |
|---|------|--------------------|----|
| B-1 | `tests/PageBuilder/pageBuilderColumns.spec.ts` | ListPage | SC-06 |
| B-2 | `tests/PageBuilder/pageBuilderActionMenus.spec.ts` | ListPage, EditorPage, PagesPanel | SC-05 |
| B-3 | `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` | ListPage, EditorPage, PublishWizard | SC-03 |
| B-4 | `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` | ListPage, EditorPage, PagesPanel | SC-02 |
| B-5 | `tests/PageBuilder/pageBuilderComponents.spec.ts` | ListPage, EditorPage, DesignPanel | SC-01 |
| B-6 | `tests/PageBuilder/pageBuilderDragDrop.spec.ts` | ListPage, EditorPage, DesignPanel | SC-07 |

---

## Dependencies and Prerequisites

| Prerequisite | Status | Action if missing |
|-------------|--------|-------------------|
| `tests/playwright/.auth/user.json` exists (auth setup run) | Required | Run `npx playwright test --project=setup` |
| `config/develop.json` exists with valid credentials | Required | Run `npm run load-secrets-dev` |
| Google Chrome installed | Required | Install Chrome |
| "All Users" audience in develop org | Confirmed ✅ | No action |
| At least 1 Page Builder page in list for SC-05 and SC-06 | Created in `beforeAll` or per-test | Each spec creates its own page if needed |

---

## Risk Controls

| Risk | Control |
|------|---------|
| DnD fails with `dragTo()` | Mouse API fallback implemented in `PageBuilderDesignPanel.addComponent()` |
| 10-page published cap | SC-03 cancels wizard at Step 5 review (no publish). Other specs use Draft state |
| Canvas data-marker values (5 inferred) | Inferred values documented; confirm and update during first red-green run |
| `aria-label="Actions null"` bug | Use `[aria-label^="Actions"]` prefix selector as primary locator |
| Saved session expiry | All specs work with saved session; add fresh login if auth redirects observed |

---

## Validation Strategy

1. Run `npx playwright test tests/PageBuilder/ --project=chrome` with Allure reporter
2. If DnD tests fail, inspect DOM in edit mode and update `PageBuilderDesignPanel` canvas locator
3. If canvas data-markers differ from inferred values, update the `componentCanvasMarker` map in `PageBuilderDesignPanel`
4. Verify Allure report: `allure generate allure-results && allure open` — all PB-0x steps must appear

---

## Definition of Done

- [ ] 6 spec files created under `tests/PageBuilder/`
- [ ] 5 page object files created under `pageObjects/PageBuilder/`
- [ ] `AdminHomePage.navigateToPageBuilder()` added
- [ ] `npx playwright test tests/PageBuilder/ --project=chrome` passes with 0 failures
- [ ] `allure-report/` shows Allure steps for all 6 specs
- [ ] `NODE_ENV=stage npx playwright test tests/PageBuilder/ --project=chrome` passes

---

## Observations

1. **SC-01 and SC-07 share the same Design tab infrastructure.** `PageBuilderDesignPanel` is shared. SC-01 validates component coverage (all 14 present + page saved to list); SC-07 validates DnD mechanics (explicit drag gesture for each, plus canvas reorder).

2. **`playwright.config.ts` requires zero changes.** `testMatch: ["tests/**/*.spec.ts"]` already covers `tests/PageBuilder/`.

3. **Phase A (page objects) must be fully committed before any Phase B spec can pass.** TypeScript `import` compilation will fail otherwise.

4. **Column picker locators (toggles) are not confirmed from live analysis.** The checkbox labels (`getByRole("checkbox", { name: /Status/i })`) are reasonable assumptions. First run may require locator adjustments.

---

_End of plan.md_
