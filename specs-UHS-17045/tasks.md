# Tasks — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_

---

## Milestone 1 — Page Object Infrastructure

All tasks in this milestone are independent of each other (same base class, different UI surfaces). Can be written in parallel.

| ID | Task | File | Status |
|----|------|------|--------|
| T-01 | Create `PageBuilderListPage` — navigation, create-page modal, row actions, columns picker, row assertions | `pageObjects/PageBuilder/PageBuilderListPage.page.ts` | 🔲 |
| T-02 | Create `PageBuilderEditorPage` — toolbar buttons, tab switching, editor load wait | `pageObjects/PageBuilder/PageBuilderEditorPage.page.ts` | 🔲 |
| T-03 | Create `PageBuilderDesignPanel` — accordion expand, 14 component DnD, canvas assertions | `pageObjects/PageBuilder/PageBuilderDesignPanel.page.ts` | 🔲 |
| T-04 | Create `PageBuilderPagesPanel` — page tree, page-level actions menu, add subpage | `pageObjects/PageBuilder/PageBuilderPagesPanel.page.ts` | 🔲 |
| T-05 | Create `PageBuilderPublishWizard` — 5-step wizard, audience selection, cancel/leave handling | `pageObjects/PageBuilder/PageBuilderPublishWizard.page.ts` | 🔲 |
| T-06 | Update `AdminHomePage` — add `navigateToPageBuilder()` method | `pageObjects/AdminHomePage.page.ts` | 🔲 |

**Dependency gate:** All T-01 through T-06 must complete before Milestone 2.

---

## Milestone 2 — Spec Files

Ordered simplest-to-complex to maximize early signal from the test run.

| ID | Task | File | Depends on | Status |
|----|------|------|-----------|--------|
| T-07 | SC-06: Columns picker spec | `tests/PageBuilder/pageBuilderColumns.spec.ts` | T-01 | 🔲 |
| T-08 | SC-05: Action menus spec | `tests/PageBuilder/pageBuilderActionMenus.spec.ts` | T-01, T-02, T-04 | 🔲 |
| T-09 | SC-03: Audience association spec | `tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts` | T-01, T-02, T-05 | 🔲 |
| T-10 | SC-02: Multi-level page spec | `tests/PageBuilder/pageBuilderMultiLevel.spec.ts` | T-01, T-02, T-04 | 🔲 |
| T-11 | SC-01: Design tab components spec | `tests/PageBuilder/pageBuilderComponents.spec.ts` | T-01, T-02, T-03 | 🔲 |
| T-12 | SC-07: Drag-and-drop spec | `tests/PageBuilder/pageBuilderDragDrop.spec.ts` | T-01, T-02, T-03 | 🔲 |

---

## Milestone 3 — Validation Tasks

| ID | Task | Status |
|----|------|--------|
| T-13 | Run `npx playwright test tests/PageBuilder/ --project=chrome` and collect results | 🔲 |
| T-14 | Validate inferred canvas `data-marker` values (Button, Image, Video, Divider, Dynamic Text, and Static/Dynamic group markers) — update `PageBuilderDesignPanel.componentCanvasMarker()` map if needed | 🔲 |
| T-15 | Validate Columns picker toggle locators — update if `getByRole("checkbox", { name: /.../ })` pattern doesn't match actual DOM | 🔲 |
| T-16 | Validate DnD strategy — confirm whether `dragTo()` works or mouse API fallback needed | 🔲 |
| T-17 | Generate and verify Allure report: `allure generate allure-results && allure open` | 🔲 |
| T-18 | Verify stage compatibility: `NODE_ENV=stage npx playwright test tests/PageBuilder/ --project=chrome` | 🔲 |

---

## Dependency Graph

```
BasePage (existing)
  ├── T-01: PageBuilderListPage
  ├── T-02: PageBuilderEditorPage
  ├── T-03: PageBuilderDesignPanel
  ├── T-04: PageBuilderPagesPanel
  ├── T-05: PageBuilderPublishWizard
  └── T-06: AdminHomePage (update)

T-01 ──────────────────────────────────────┐
T-01, T-02, T-04 ──────────────────────────┼── T-08 (SC-05)
T-01, T-02, T-05 ──────────────────────────┼── T-09 (SC-03)
T-01, T-02, T-04 ──────────────────────────┼── T-10 (SC-02)
T-01, T-02, T-03 ──────────────────────────┼── T-11 (SC-01)
                                           ├── T-12 (SC-07)
                                           └── T-07 (SC-06)

T-11, T-12 ────────────────────────────────── T-13, T-14, T-16
T-07 ──────────────────────────────────────── T-15
T-13 ──────────────────────────────────────── T-17
T-17 ──────────────────────────────────────── T-18
```

---

## Parallelization Notes

- **T-01 through T-06** can all be written in parallel (no inter-page-object dependencies).
- **T-07 through T-12** can all be written in parallel once T-01–T-06 are complete.
- **T-13** (first run) is sequential — one run, capture all failures.
- **T-14, T-15, T-16** are parallel validation tasks after T-13.

---

## Validation Checkpoints

| Checkpoint | Check |
|-----------|-------|
| After T-01–T-06 | TypeScript compiles: `npx tsc --noEmit` — no errors in `pageObjects/PageBuilder/` |
| After T-07–T-12 | TypeScript compiles: `npx tsc --noEmit` — no errors in `tests/PageBuilder/` |
| After T-13 | All 6 spec files listed in test results; 0 compile errors; track runtime failures |
| After T-14–T-16 | Locators and DnD strategy confirmed; data-marker map updated |
| After T-17 | Allure report shows PB-01 through PB-07 with step hierarchy |

---

## Open Blockers

_(None — all blockers resolved during build.design phase on 2026-05-25.)_

---

_End of tasks.md_
