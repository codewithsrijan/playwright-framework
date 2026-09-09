# Tests — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_

---

## Test Scope and Objectives

This is an **E2E browser automation story** — the spec files themselves are the tests. There are no unit tests or integration tests to write separately (no application code is authored). The TDD sequence is:

1. **RED** — Write spec files that import not-yet-existing page objects → TypeScript compilation fails.
2. **GREEN** — Implement page objects → compilation succeeds → `playwright test` runs.
3. **REFACTOR** — Fix any locator issues discovered during first run (see T-14–T-16 in tasks.md).

---

## Test Pyramid

```
         [E2E Browser Tests — 6 spec files]
           These ARE the tests for this story

         [No unit tests — no application code authored]
         [No API tests — no new endpoints introduced]
```

---

## Test Inventory

### PB-01 — SC-01: Design Tab Component Coverage
**File:** `tests/PageBuilder/pageBuilderComponents.spec.ts`
**Maps to AC:** AC-01

| Step | Assertion |
|------|-----------|
| Navigate to Page Builder list (`/admin/landing-pages`) | URL matches `/admin/landing-pages` |
| Create new page with Faker title | Browser redirects to `/admin/page-builder` |
| Enter Edit mode | Editor canvas becomes interactive |
| Open Design tab → expand Static + Dynamic sections | All 14 component buttons visible |
| Drag each of 14 components to canvas (Basic × 6, Static × 4, Dynamic × 4) | Each component's `data-marker` appears on canvas |
| Save page | No error toasts |
| Navigate back to list | Page row with Faker title visible in list |

---

### PB-02 — SC-02: Multi-Level Page Creation
**File:** `tests/PageBuilder/pageBuilderMultiLevel.spec.ts`
**Maps to AC:** AC-02

| Step | Assertion |
|------|-----------|
| Create parent page (Faker title) | Redirects to editor |
| Switch to Pages tab | Pages panel visible |
| Open page-level Actions menu | Menu with Rename, Copy link, Add subpage |
| Click "Add subpage" | Child page name input appears |
| Fill child page name (Faker title) | Child page created |
| Assert subpage visible under parent in tree | Parent–child hierarchy visible |
| Save | No error |
| Back to list | Parent page row present |

---

### PB-03 — SC-03: Audience Association
**File:** `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts`
**Maps to AC:** AC-03

| Step | Assertion |
|------|-----------|
| Create page (Faker title) | Editor opens |
| Click Publish → Publish wizard Step 1 | Step 1: Landing Page Details visible |
| Fill title, click Next: Pages | Step 2 visible |
| Click Next: Determine visibility | Step 3: audience search visible |
| Select "All Users" audience | Row checked / selected |
| Click Next: Default homepage | Step 4 visible |
| Set "No" for default homepage | Radio selected |
| Click Next: Review and publish | Step 5 visible |
| Assert "All Users" in review summary | Audience name visible in review |
| Click Cancel → confirm "Yes, leave without saving" | Returns to editor |

---

### PB-05 — SC-05: Action Menu Validation
**File:** `tests/PageBuilder/pageBuilderActionMenus.spec.ts`
**Maps to AC:** AC-05

| Step | Assertion |
|------|-----------|
| Navigate to Page Builder list | List loaded |
| Create page (Faker title) for list population | Redirects to editor |
| Go back to list | Page visible in list |
| **List-page row actions:** | |
| Open Actions menu for created page | Menu visible with `[role="menu"]` |
| Assert all 5 items: Publish, Rename, Preview, Delete, Duplicate | All 5 `[role="menuitem"]` visible |
| Click Delete | `[role="alertdialog"]` appears |
| Assert dialog contains confirmation buttons | "Yes, leave without saving" + "No, keep working" visible |
| Click "No, keep working" | Dialog dismissed, page still in list |
| Reopen Actions → click Rename | Inline rename input visible |
| **Editor page-level actions:** | |
| Open created page in editor | Editor loads |
| Switch to Pages tab | Pages panel visible |
| Open page-level Actions menu | Menu opens |
| Assert all 3 items: Rename, Copy link, Add subpage | All 3 visible |

---

### PB-06 — SC-06: Column Picker Validation
**File:** `tests/PageBuilder/pageBuilderColumns.spec.ts`
**Maps to AC:** AC-06

| Step | Assertion |
|------|-----------|
| Navigate to Page Builder list | List loaded |
| Click Columns tab | Columns panel appears |
| Assert 5 column toggles present (Name, Status, Type, Modified Date, Created By) | All 5 checkboxes visible |
| Uncheck "Status" toggle | "Status" columnheader NOT visible in grid |
| Re-check "Status" toggle | "Status" columnheader visible again |
| Click "Toggle All Columns Visibility" (to hide all) | No columnheaders visible |
| Click "Toggle All Columns Visibility" again (to show all) | All 5 columnheaders visible |

---

### PB-07 — SC-07: Drag-and-Drop Validation
**File:** `tests/PageBuilder/pageBuilderDragDrop.spec.ts`
**Maps to AC:** AC-07

| Step | Assertion |
|------|-----------|
| Create fresh page (Faker title) | Editor opens |
| Enter Edit mode | Canvas interactive |
| Open Design tab → expand Static + Dynamic | 14 components visible in panel |
| For each of 14 components: execute mouse DnD gesture from panel to canvas | Component marker appears on canvas |
| Assert first 2 canvas components — capture DOM order | Initial order recorded |
| Drag first component past second (canvas reorder) | DOM order changes (component position updated) |
| Save | No error |

---

## TDD Execution Sequence

```
Step 1 — Write all page object stubs (empty classes, correct imports)
          → npx tsc --noEmit: should FAIL with "missing method" errors
          (This validates that spec files reference the right method signatures)

Step 2 — Implement page object methods
          → npx tsc --noEmit: should PASS

Step 3 — Run spec files against develop
          → npx playwright test tests/PageBuilder/ --project=chrome
          → Collect failures (likely locator adjustments needed for DnD + columns)

Step 4 — Fix locators per T-14, T-15, T-16 findings
          → Re-run until all 6 specs pass

Step 5 — Generate Allure report
          → allure generate allure-results && allure open
          → Verify PB-01 through PB-07 steps visible
```

---

## Test Commands

```bash
# Run all Page Builder specs
npx playwright test tests/PageBuilder/ --project=chrome

# Run a single spec
npx playwright test tests/PageBuilder/pageBuilderColumns.spec.ts --project=chrome

# Run with UI mode (useful for DnD debugging)
npx playwright test tests/PageBuilder/ --project=chrome --ui

# TypeScript compile check
npx tsc --noEmit

# Generate Allure report
allure generate allure-results --clean && allure open

# Stage environment
NODE_ENV=stage npx playwright test tests/PageBuilder/ --project=chrome
```

---

## Exit Criteria

| Criterion | Pass condition |
|-----------|---------------|
| AC-01 | `pageBuilderComponents.spec.ts` passes: all 14 components on canvas, page in list |
| AC-02 | `pageBuilderMultiLevel.spec.ts` passes: parent+child hierarchy visible |
| AC-03 | `pageBuilderAudienceAssociation.spec.ts` passes: "All Users" audience confirmed in review |
| AC-05 | `pageBuilderActionMenus.spec.ts` passes: all row actions + editor actions verified |
| AC-06 | `pageBuilderColumns.spec.ts` passes: hide/show/toggle-all confirmed |
| AC-07 | `pageBuilderDragDrop.spec.ts` passes: DnD gesture succeeds for all 14 components |
| AC-08 | `allure-report/` shows steps for all 6 specs |
| AC-09 | `NODE_ENV=stage` run passes without code changes |
| AC-10 | All PO classes extend `BasePage`, use role-based locators |

---

## Coverage Gaps and Testability Notes

1. **Canvas data-marker values (5 of 14 inferred)** — `PageBuilderDesignPanel.componentCanvasMarker()` must be validated during first run. If markers differ, update the map; assertions won't fire false-positives before validation.

2. **Column picker DOM structure** — toggle checkbox locators are assumed to be `getByRole("checkbox", { name: /ColumnName/i })`. If the Columns panel uses a different structure, T-15 will identify the correct selectors.

3. **Canvas reorder in SC-07** — DOM order assertion depends on components having predictable `data-marker` attributes. If markers aren't sequential in DOM, the reorder verification must use index-based position checks instead.

4. **SC-04 (Multilingual) not covered** — By design; deferred to follow-on ticket. No coverage gap for UHS-17045.

---

_End of tests.md_
