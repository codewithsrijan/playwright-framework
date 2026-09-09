# Implementation — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_
_Status: All files created; TypeScript compilation clean (0 errors in new files)_

---

## Completed Work

### Phase A — Page Object Infrastructure ✅

| File | Status | Notes |
|------|--------|-------|
| `pageObjects/PageBuilder/PageBuilderListPage.page.ts` | ✅ Created | Navigation (direct + Learning menu), create-page modal, row actions, Columns picker, row/column assertions |
| `pageObjects/PageBuilder/PageBuilderEditorPage.page.ts` | ✅ Created | Toolbar: Edit, Save, Publish, Revert, Preview, Back; tab switching; editor load wait |
| `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` | ✅ Created | 14 components across 3 groups; accordion expand (idempotent); pointer-event DnD; canvas assertions via data-marker map |
| `pageObjects/PageBuilder/PageBuilderPagesPanel.page.ts` | ✅ Created | Page tree; page-level Actions menu; add subpage; parent-child hierarchy assertions |
| `pageObjects/PageBuilder/PageBuilderPublishWizard.page.ts` | ✅ Created | 5-step wizard; audience selection; cancel+leave handling; alertdialog management |
| `pageObjects/AdminHomePage.page.ts` | ✅ Updated | Added `navigateToPageBuilder()` method |

### Phase B — Spec Files ✅

| File | AC | Test IDs | Status |
|------|-----|---------|--------|
| `tests/PageBuilder/pageBuilderComponents.spec.ts` | AC-01 | PB-01 | ✅ Created |
| `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` | AC-02 | PB-02 | ✅ Created |
| `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` | AC-03 | PB-03 | ✅ Created |
| `tests/PageBuilder/pageBuilderActionMenus.spec.ts` | AC-05 | PB-05a, PB-05b | ✅ Created |
| `tests/PageBuilder/pageBuilderColumns.spec.ts` | AC-06 | PB-06a, PB-06b, PB-06c | ✅ Created |
| `tests/PageBuilder/pageBuilderDragDrop.spec.ts` | AC-07 | PB-07a, PB-07b | ✅ Created |

**Not created (by design):** `pageBuilderMultilingual.spec.ts` — SC-04 deferred (no per-page multilingual config in current BETA).

---

## TypeScript Compilation

```bash
npx tsc --noEmit
# Result: 0 errors in pageObjects/PageBuilder/ and tests/PageBuilder/
# Pre-existing warning: tsconfig.json moduleResolution=node10 deprecation (unrelated to UHS-17045)
```

---

## Deviations from Plan

| Item | Plan | Actual | Reason |
|------|------|--------|--------|
| SC-05 split into 2 tests | Single test | PB-05a (list row actions) + PB-05b (editor page-level actions) | Cleaner Allure reporting; each test has a single focused assertion scope |
| SC-06 split into 3 tests | Single test | PB-06a (toggle presence) + PB-06b (hide/show single) + PB-06c (toggle-all) | Granular failure isolation |
| SC-07 split into 2 tests | Single test | PB-07a (all 14 components placed) + PB-07b (reorder 2 components) | Separates "can we place" from "can we reorder" — fail independently |
| `navigateDirectly()` added to ListPage | Not in plan | Added | Direct URL navigation is faster than Learning menu for beforeEach setup |
| `ALL_COMPONENT_NAMES` exported from DesignPanel | Not in plan | Added | Allows spec files to iterate components without duplicating the list |

---

## Validation Required After First Run (T-14, T-15, T-16)

### T-14: Canvas data-marker values (5 inferred, 8 confirmed)

Open `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` → `COMPONENT_CANVAS_MARKERS` and update any `_(inferred)_` entries that differ from the actual DOM. To inspect:

```bash
# In Playwright test runner, after adding a component, evaluate:
await page.evaluate(() => {
  const markers = [...document.querySelectorAll('[data-marker^="PageBuilder--"]')];
  return markers.map(el => el.getAttribute('data-marker'));
});
```

Expected confirmed: `PageBuilder--text`, `PageBuilder--imageTextCard`
All others: inferred from naming convention — update if different.

### T-15: Column picker toggle locators

The Columns panel toggle checkboxes are located via:
```typescript
getByRole("checkbox", { name: /ColumnName/i }).or(getByLabel(/ColumnName/i)).first()
```
If this doesn't match the actual DOM, update `PageBuilderListPage.columnToggle()`.

Possible alternatives if primary fails:
- `getByRole("switch", { name: /Status/i })` (if toggles use switch role)
- `page.locator('[data-marker*="column"][data-marker*="Status"]')` (if data-markers exist)

### T-16: DnD canvas drop zone

`PageBuilderDesignPanel.addComponent()` calculates the canvas target as:
```
target X = panelBB.x + panelBB.width + 250
target Y = panelBB.y + panelBB.height * 0.4
```

If components are not landing on the canvas (drag fails silently), adjust the offset. Use `--ui` mode to watch the drag visually:
```bash
npx playwright test tests/PageBuilder/pageBuilderDragDrop.spec.ts --project=chrome --ui
```

---

## Run Commands

```bash
# Run all Page Builder specs
npx playwright test tests/PageBuilder/ --project=chrome

# Run individual specs
npx playwright test tests/PageBuilder/pageBuilderColumns.spec.ts --project=chrome
npx playwright test tests/PageBuilder/pageBuilderActionMenus.spec.ts --project=chrome
npx playwright test tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts --project=chrome
npx playwright test tests/PageBuilder/pageBuilderMultiLevel.spec.ts --project=chrome
npx playwright test tests/PageBuilder/pageBuilderComponents.spec.ts --project=chrome
npx playwright test tests/PageBuilder/pageBuilderDragDrop.spec.ts --project=chrome

# Debug with UI mode
npx playwright test tests/PageBuilder/ --project=chrome --ui

# Allure report
allure generate allure-results --clean && allure open

# Stage environment
NODE_ENV=stage npx playwright test tests/PageBuilder/ --project=chrome
```

---

## Files Changed Summary

| Repo | Path | Type |
|------|------|------|
| `ucm-playwright-automation` | `pageObjects/PageBuilder/PageBuilderListPage.page.ts` | **New** |
| `ucm-playwright-automation` | `pageObjects/PageBuilder/PageBuilderEditorPage.page.ts` | **New** |
| `ucm-playwright-automation` | `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` | **New** |
| `ucm-playwright-automation` | `pageObjects/PageBuilder/PageBuilderPagesPanel.page.ts` | **New** |
| `ucm-playwright-automation` | `pageObjects/PageBuilder/PageBuilderPublishWizard.page.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderComponents.spec.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderActionMenus.spec.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderColumns.spec.ts` | **New** |
| `ucm-playwright-automation` | `tests/PageBuilder/pageBuilderDragDrop.spec.ts` | **New** |
| `ucm-playwright-automation` | `pageObjects/AdminHomePage.page.ts` | **Modified** (1 method added) |
| `ucm-playwright-automation` | `specs-UHS-17045/plan.md` | **New** |
| `ucm-playwright-automation` | `specs-UHS-17045/tasks.md` | **New** |
| `ucm-playwright-automation` | `specs-UHS-17045/tests.md` | **New** |
| `ucm-playwright-automation` | `specs-UHS-17045/architecture.md` | **New** |
| `ucm-playwright-automation` | `specs-UHS-17045/implementation.md` | **New** |

**Unchanged:** `playwright.config.ts`, `fixtures/`, `helper/api/`, `utils/`, `package.json`

---

## Known Limitations and Follow-Ups

| # | Item | Type |
|---|------|------|
| 1 | 5 of 14 canvas data-markers are inferred — require validation on first test run (T-14) | Must fix before AC-01/AC-07 pass |
| 2 | Column picker toggle locators assumed (not confirmed from live DOM analysis) — require T-15 validation | Must fix before AC-06 passes |
| 3 | Canvas drop zone position calculated from panel bounds — may need offset adjustment (T-16) | Must fix before AC-01/AC-07 pass |
| 4 | SC-04 (multilingual) NOT implemented — deferred to follow-on Jira ticket | By design |
| 5 | Subpage creation input locator uses multiple fallbacks — validate during SC-02 first run | May need refinement |
| 6 | `aria-label="Actions null"` bug on page-level Actions button — uses prefix match `[aria-label^="Actions"]` which is fragile if the bug is fixed | Monitor in future BETA updates |
| 7 | QMetry test IDs (PB-01 through PB-07) not yet registered in QMetry — post-implementation task | Non-blocking |

---

## Observations

1. **DnD implementation documented inline.** `PageBuilderDesignPanel.addComponent()` uses the explicit mouse API (not `locator.dragTo()`) because the DnD is pointer-event based. The implementation comments explain the strategy for future maintainers.

2. **10-page publish cap mitigation implemented.** SC-03 cancels at Step 5 review instead of publishing. This verifies audience association without consuming a published-page slot.

3. **SC-06 requires the Columns tab to be functional.** If the Columns picker panel doesn't open or toggle checkboxes don't match the assumed ARIA pattern, T-15 must be addressed before the spec can pass.

4. **SC-07 includes a canvas reorder test (PB-07b).** This tests the reorder mechanic by verifying that dragging the first placed component past the second changes their relative vertical positions. This is the highest-risk test due to DnD complexity.

5. **TypeScript `strict: false` maintained.** New page object files aim for explicit typing but don't enable strict mode — consistent with the project-wide tsconfig setting.

---

_End of implementation.md_
