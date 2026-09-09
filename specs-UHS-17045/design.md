# Design — UHS-17045: Page Builder Automation

_Generated: 2026-05-25_
_Source: Live app analysis via Playwright MCP on `develop` (plat3-complete.front.develop.squads-dev.com)_

---

## Existing Design Standards (Must Follow)

All new Page Builder page objects and specs must follow the patterns established by the existing suite. Key standards extracted from `pageObjects/base/BasePage.ts`, `AssignmentsPage.page.ts`, `CreateAssignmentWizard.page.ts`, and `CreateAudiencePage.page.ts`:

### Locator Strategy (Priority Order)

| Priority | Strategy | Example | Reason |
|----------|----------|---------|--------|
| 1st | `data-marker` attribute | `[data-marker="getStartedBtn"]` | Most stable; team-controlled hook |
| 2nd | `getByRole` + name | `getByRole("button", { name: "Publish" })` | Semantic; resilient to CSS changes |
| 3rd | `getByLabel` / `getByPlaceholder` | `getByLabel("Search for audiences")` | Good for form inputs |
| 4th | CSS `id` attribute | `#pageTitle`, `#search` | Use only when role/label not available |
| Last | XPath | `//button[@data-marker="..."]` | Avoid for new code; brittle |

> **Important:** The existing `AdminHomePage.page.ts` and `AssignmentsPage.page.ts` use XPath. New Page Builder page objects MUST NOT follow this pattern — use role-based selectors as in `CreateAssignmentWizard.page.ts`.

### Page Object Class Pattern

```typescript
// Standard pattern — every new Page Builder class must follow this:
export class PageBuilderListPage extends BasePage {
  // Private locators as class fields
  private readonly someButton = this.page.locator('[data-marker="someMarker"]');

  constructor(page: Page) { super(page); }

  // Public methods — every action wrapped in this.step()
  async someAction(): Promise<void> {
    await this.step("Describe the action", async () => {
      await this.click(this.someButton, "Human description");
    });
  }
}
```

### Reporter Integration
- All actions use `Reporter.step()` via `BasePage.step()` — never raw Playwright calls outside a step
- Assertions use `BasePage.assertVisible()`, `assertText()`, `assertCount()` etc.
- Screenshots via `BasePage.screenshot()` on failure (automatic via `allureFixtures.ts`)

### CSS Module Class Naming
The Page Builder app uses hashed CSS Modules (`Button---root---TwJp3`, `ucm2--src-components-...`). **Never use these as locators** — they change on every build. Use `data-marker` or ARIA roles instead.

---

## UI Surface Map (Discovered via Live Analysis)

### 1. Page Builder List Page

**URL:** `/admin/landing-pages`
> ⚠️ **NOT** `/admin/page-builder` — navigating to `/admin/page-builder` opens the last-opened editor page directly, not the list.

**Admin nav path:** Admin → Learning → Page Builder _(BETA)_
**Nav link locator:** `[data-marker="pageBuilder"]` → `/admin/landing-pages`

#### Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ "Welcome to your Page Builder!"  [BETA]                         │
│ "Easily create customized and impactful pages..."               │
│                                                                  │
│ Template Cards:                                                  │
│  ┌─────────────────────────┐ ┌────────────┐ ┌────────────┐     │
│  │ Academy Experience      │ │Coming soon │ │Coming soon │     │
│  │ [Get started]           │ │            │ │            │     │
│  └─────────────────────────┘ └────────────┘ └────────────┘     │
│                                                                  │
│ "Your pages at a glance"   [0/10 published pages]               │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ NAME │ STATUS │ TYPE │ MODIFIED DATE │ CREATED BY │ ▣   │    │
│ │──────┼────────┼──────┼──────────────┼────────────┼─────│    │
│ │ ...  │ Draft  │custom│ Mar 18, 2026  │            │[⋮]  │    │
│ └──────────────────────────────────────────────────────────┘    │
│ [Columns]  Page Size: [10▼]   1 to N of N  [◁] [▷]             │
└─────────────────────────────────────────────────────────────────┘
```

#### List Page Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page Builder nav link | `[data-marker="pageBuilder"]` | In left nav Learning submenu |
| "Get started" button | `[data-marker="getStartedBtn"]` | Academy Experience template card |
| Flexible data table | `[data-marker="flexibleDataTableContainer"]` | Custom treegrid — NOT AG Grid |
| Row Actions button | `[data-marker="Actions"]` | Per-row kebab menu |
| Column headers | `[role="columnheader"]` | Name, Status, Type, Modified Date, Created By |
| Page size selector | `[role="combobox"][aria-label="Page Size"]` | Options: 10, 25, 50 |
| Pagination: first | `getByRole("button", { name: "First Page" })` | |
| Pagination: prev | `getByRole("button", { name: "Previous Page" })` | |
| Pagination: next | `getByRole("button", { name: "Next Page" })` | |
| Pagination: last | `getByRole("button", { name: "Last Page" })` | |
| Columns tab | `getByRole("tab", { name: "Columns" })` | Column visibility picker — NOT row filters |

#### Row Actions Menu (per page row)

Triggered by `[data-marker="Actions"]` button. Rendered as `[role="menu"]`.

| Action | Role/Selector | Notes |
|--------|---------------|-------|
| **Publish** | `getByRole("menuitem", { name: "Publish" })` | Opens 5-step Publish wizard |
| **Rename** | `getByRole("menuitem", { name: "Rename" })` | Inline rename |
| **Preview** | `getByRole("menuitem", { name: "Preview" })` | Opens preview mode |
| **Delete** | `getByRole("menuitem", { name: "Delete" })` | ⚠️ Destructive — requires confirmation modal |
| **Duplicate** | `getByRole("menuitem", { name: "Duplicate" })` | Creates a copy |

> **Delete confirmation dialog:** `[role="alertdialog"]` with "Leave without saving?" pattern — buttons: `"Yes, leave without saving"` and `"No, keep working"`.

#### ⚠️ NO Filter Panel — Critical BETA Gap

The Page Builder list page has **no row-level filter panel**. Unlike `AssignmentsPage` which has `[data-marker="filterToggleBtn"]` opening status checkboxes, Page Builder only exposes:
- Column visibility picker via `[role="tab" name="Columns"]`
- Column header sorting (click column header)
- No status filter, no type filter, no search input for list rows

**Impact on SC-06 (Filter validation):** SC-06 as written in spec.md assumes filters exist. See Open Design Questions below.

---

### 2. Create New Page Flow (from "Get started")

**Trigger:** Click `[data-marker="getStartedBtn"]`
**Presentation:** Inline modal/drawer over the list page

#### Fields

| Field | Locator | Constraints |
|-------|---------|-------------|
| Page title | `#pageTitle` (type="text") | Required, max 48 chars; counter `8/48` visible |
| URL | `#pageUrl` (type="text") | Auto-generated from title |
| Permission | `getByRole("combobox")` or dropdown | Default: "All Admins" |
| Don't show in left nav | `#shouldHideInLeftNav` (checkbox) | Optional |
| Disclaimer | Static text | "Please refrain from entering any sensitive information on this page." |
| Cancel | `getByRole("button", { name: "Cancel" })` | Dismisses modal |
| Create page | `getByRole("button", { name: "Create page" })` | Submits; navigates to editor |

---

### 3. Page Builder Editor

**URL:** `/admin/page-builder` (shares URL regardless of which page is open)
**Component class:** `ucm2--src-components-LandingPageBuilder__pageBuilderEditor`

#### Editor Layout

```
┌──────────────────┬────────────────────────────────────────────┐
│ [←] [PageTitle]  │  [↩][↪] [Edit] [Preview] [Revert][Save][Publish] │ ← Toolbar
├──────────────────┼────────────────────────────────────────────┤
│ [Pages][Design]  │                                            │
│                  │                                            │
│  Pages tab:      │           CANVAS                           │
│  ┌─────────────┐ │  (page content shown here)                │
│  │ ≡ PageName  │ │                                            │
│  │   [⋮] menu  │ │                                            │
│  │  └ subpage  │ │                                            │
│  └─────────────┘ │                                            │
│                  │                                            │
│  Design tab:     │                                            │
│  Basic ─────────│                                            │
│   Text Button   │                                            │
│   Image Video   │                                            │
│   Divider DynTxt│                                            │
│  Static ────────│                                            │
│   [collapsed]   │                                            │
│  Dynamic ───────│                                            │
│   [collapsed]   │                                            │
└──────────────────┴────────────────────────────────────────────┘
```

#### Toolbar Locators

| Button | Locator | State notes |
|--------|---------|-------------|
| Back to list | `getByRole("button", { name: "Back to Page Builder main" })` | Always enabled |
| Undo | `button.TopNavigationBar---undoRedoButton` (1st) | Disabled until first edit |
| Redo | `button.TopNavigationBar---undoRedoButton` (2nd) | Disabled until edit |
| **Edit** | `getByRole("button", { name: "Edit" }).filter(class: TopNav)` | Toggles edit mode |
| Preview | `getByRole("button", { name: "Preview" })` | Opens preview |
| Revert | `getByRole("button", { name: "Revert" })` | Disabled until unsaved changes |
| Save | `getByRole("button", { name: "Save" })` | Disabled until edits made |
| **Publish** | `getByRole("button", { name: "Publish" })` | Opens 5-step wizard |

#### Pages Tab

**Locator:** `[data-marker="pageBuilderPages"]` or `getByRole("tab", { name: "Pages" })`

| Element | Locator |
|---------|---------|
| Pages tab | `getByRole("tab", { name: "Pages" })` |
| Page item button | `getByRole("button", { name: "<pageName>" })` |
| Drag-to-reorder handle | `getByRole("button", { name: "Drag to reorder" })` |
| Page-level Actions | `getByRole("button", { name: "Actions null" })` or `[aria-label="Actions null"]` |

**Page-level Actions menu** (3 items):

| Action | Locator | Notes |
|--------|---------|-------|
| **Rename** | `getByRole("button", { name: "Rename" })` inside menu | Inline rename |
| **Copy link** | `getByRole("button", { name: "Copy link" })` inside menu | Copies page URL |
| **Add subpage** | `getByRole("button", { name: "Add subpage" })` inside menu | Creates child page — this is how multi-level pages are created (SC-02) |

#### Design Tab — Component Palette

**Locator:** `[data-marker="pageBuilderDesign"]` or `getByRole("tab", { name: "Design" })`
**Panel content:** `[data-marker="pageBuilderDesignContent"]`

##### All 14 Design Components

**Group: Basic** (always visible, 6 components)

| Component | Locator | Canvas data-marker |
|-----------|---------|-------------------|
| Text | `getByRole("button", { name: "Text" })` in Design panel | `PageBuilder--text` |
| Button | `getByRole("button", { name: "Button" })` in Design panel | `PageBuilder--button` _(inferred)_ |
| Image | `getByRole("button", { name: "Image" })` in Design panel | `PageBuilder--image` _(inferred)_ |
| Video | `getByRole("button", { name: "Video" })` in Design panel | `PageBuilder--video` _(inferred)_ |
| Divider | `getByRole("button", { name: "Divider" })` in Design panel | `PageBuilder--divider` _(inferred)_ |
| Dynamic Text | `getByRole("button", { name: "Dynamic Text" })` in Design panel | `PageBuilder--dynamicText` _(inferred)_ |

> Canvas data-markers for Button/Image/Video/Divider/Dynamic Text are marked _(inferred)_ — confirm during implementation by adding each component and inspecting the resulting DOM.

**Group: Static** (collapsible accordion, 4 components)

| Component | Locator | Notes |
|-----------|---------|-------|
| Static section toggle | `getByRole("button", { name: /Static Editable elements/ })` | Expand/collapse |
| Image & Text Card | `getByRole("button", { name: /Image & Text Card/ })` | Canvas marker: `PageBuilder--imageTextCard` ✅ |
| Text & Button Card | `getByRole("button", { name: /Text & Button Card/ })` | |
| Image, Text & Button Card | `getByRole("button", { name: /Image, Text & Button Card/ })` | |
| Profile Card | `getByRole("button", { name: /Profile Card/ })` | |

**Group: Dynamic** (collapsible accordion, 4 components)

| Component | Locator | Notes |
|-----------|---------|-------|
| Dynamic section toggle | `getByRole("button", { name: /Dynamic Elements managed/ })` | Expand/collapse |
| Dynamic Card | `getByRole("button", { name: /Dynamic Card/ })` | |
| Dynamic Strip | `getByRole("button", { name: /Dynamic Strip/ })` | |
| Promoted Content Strip | `getByRole("button", { name: /Promoted Content Strip/ })` | |
| Promoted Banner | `getByRole("button", { name: /Promoted Banner/ })` | |

---

### 4. Publish Wizard (5-step)

Triggered by: `getByRole("button", { name: "Publish" })` in editor toolbar.

#### Step 1 — Landing Page Details

| Field | Locator |
|-------|---------|
| Page title | `#pageTitle` (max 48 chars) |
| URL | `#pageUrl` |
| Don't show in left nav | `#shouldHideInLeftNav` |
| Next button | `getByRole("button", { name: "Next: Pages" })` |
| Cancel | `getByRole("button", { name: "Cancel" })` |

#### Step 2 — Pages

| Element | Notes |
|---------|-------|
| Pages to be published | List of pages; reorderable |
| Back | `getByRole("button", { name: "Back to Landing page details" })` |
| Next | `getByRole("button", { name: "Next: Determine visibility" })` |

#### Step 3 — Determine Visibility (Audience Association)

| Element | Locator | Notes |
|---------|---------|-------|
| Audience search | `#search` or `input[aria-label="Search for audiences"]` | Filters audience list |
| All audiences tab | `getByRole("tab", { name: "All audiences" })` | Shows all org audiences |
| Selected audiences tab | `getByRole("tab", { name: "Selected audiences" })` | Shows only selected |
| Audience rows | `getByRole("row")` within audience table | Each row = one audience |
| Back | `getByRole("button", { name: "Back to Pages" })` | |
| Next | `getByRole("button", { name: "Next: Default homepage" })` | |

> **Pre-condition for SC-03:** "All Users" audience (4,237 users) already exists in the develop org. No seeding required. OQ-07 **RESOLVED**.

#### Step 4 — Default Homepage

| Element | Locator |
|---------|---------|
| Yes radio | `getByRole("radio", { name: "Yes" })` or `getByLabel("Yes")` |
| No radio | `getByRole("radio", { name: "No" })` or `getByLabel("No")` |
| Next | `getByRole("button", { name: "Next: Review and publish" })` |

#### Step 5 — Review and Publish

| Element | Locator | Notes |
|---------|---------|-------|
| Landing page details edit | `[data-marker="editLandingPageDetailsButton"]` _(verify)_ | |
| Audience edit | `[data-marker="editAudienceButton"]` | Confirmed in DOM |
| Default homepage edit | `[data-marker="editDefaultHomepageButton"]` | Confirmed in DOM |
| Publish page(s) | `getByRole("button", { name: "Publish page(s)" })` | Final submit |
| Cancel | `getByRole("button", { name: "Cancel" })` | Triggers "Leave without saving?" dialog |

**"Leave without saving?" confirmation dialog:**

| Element | Locator |
|---------|---------|
| Dialog | `getByRole("alertdialog")` |
| Confirm leave | `getByRole("button", { name: "Yes, leave without saving" })` |
| Stay | `getByRole("button", { name: "No, keep working" })` |

---

## Drag-and-Drop — Implementation Strategy

### Findings

| Property | Value | Source |
|----------|-------|--------|
| `draggable="true"` on components | ❌ None found | DOM inspection in both view and edit mode |
| `@dnd-kit` attributes | ❌ None found | DOM inspection |
| `react-beautiful-dnd` attributes | ❌ None found | DOM inspection |
| CSS classes with `drag`/`drop`/`sortable` | ❌ None found | DOM inspection |
| HTML5 DnD events | ❌ Not set | No `ondragstart` handlers |
| "Drag to reorder" handle button | ✅ Found in Pages tab | `getByRole("button", { name: "Drag to reorder" })` |

### Recommended Implementation Strategy

The DnD mechanism is **pointer-event based** (likely `pointerdown` / `pointermove` / `pointerup` event sequence). The recommended automation approach:

```typescript
// Strategy A: Playwright dragTo() — try first
await source.dragTo(target);

// Strategy B: If dragTo() fails, use mouse simulation
await page.mouse.move(sourceX, sourceY);
await page.mouse.down();
await page.mouse.move(targetX, targetY, { steps: 10 });
await page.mouse.up();
```

> **OQ-06 RESOLVED (partially):** DnD is NOT html5-native, NOT dnd-kit. Pointer-event based. Final strategy must be validated during implementation — `dragTo()` should be attempted first, with mouse API fallback. Document the chosen strategy in the page object.

---

## Multilingual Support — Critical Finding

### Status: NOT IMPLEMENTED in current Page Builder BETA

Live analysis confirmed:
- **Zero** ucm2-prefixed language/locale elements in Page Builder editor
- **Zero** language configuration in the 5-step Publish wizard  
- **Zero** per-page language settings in the Create page flow
- The 47-locale language selector visible on the page is the **global Percipio UI language selector** (navigation header), not a Page Builder-specific feature

### Available Locales (Global UI Language Selector — NOT Page Builder specific)

The global nav language selector (`[data-marker="languageSelector"]`) exposes 47 locales:

| Group | Locales |
|-------|---------|
| Asian | Japanese, Simplified Chinese, Traditional Chinese, Korean, Thai, Hindi, Arabic, Vietnamese |
| European — Romance | French (FR), French (Canada), Spanish (ES), Spanish (Castellano), Spanish (LATAM), Portuguese (PT), Portuguese (BR), Italian, Romanian |
| European — Germanic | German, Dutch, Swedish, Norwegian, Danish, Finnish |
| European — Slavic | Polish, Czech, Slovak, Croatian, Serbian, Slovenian, Bulgarian, Russian, Macedonian |
| European — Other | Greek, Turkish, Estonian, Latvian, Lithuanian, Hungarian |
| English variants | EN-US (current), EN-AU, EN-CA, EN-IN, EN-NZ, EN-GB |
| Malay-family | Bahasa Indonesia, Bahasa Melayu |

**Resolution for SC-04 (decided 2026-05-25):** SC-04 is **deferred to a future sprint**. Per-page multilingual configuration is not yet implemented in the current BETA. A follow-on Jira ticket should be created when the feature is available. The `pageBuilderMultilingual.spec.ts` file will NOT be created as part of UHS-17045.

---

## Component Mapping (Existing vs New)

| Existing Component | New Page Builder Equivalent | Notes |
|-------------------|----------------------------|-------|
| `AssignmentsPage` (list POM) | `PageBuilderListPage` | New; different grid type (treegrid, not AG Grid) |
| `CreateAssignmentWizard` (wizard POM) | `PageBuilderPublishWizard` | New; 5-step publish wizard |
| `CreateAudiencePage` (form POM) | N/A — audiences are consumed via Step 3 | No new audience creation needed |
| N/A | `PageBuilderEditorPage` | New; wraps editor toolbar + left panel |
| N/A | `PageBuilderDesignPanel` | New; wraps Design tab component palette |
| N/A | `PageBuilderPagesPanel` | New; wraps Pages tab + page tree |
| AG Grid pattern | Custom treegrid pattern | Different selectors; no `.ag-row` pattern |

---

## Styling Rules and Design Tokens

This is a **test automation repository** — no UI styling is produced by these tests. The following notes apply to understanding existing component classes for stable locator writing:

| Class Pattern | Purpose | Locator Use |
|--------------|---------|-------------|
| `Button---root---[hash]` | Base button | ❌ Avoid — hashed |
| `Button---primary---[hash]` | Primary CTA style | ❌ Avoid — hashed |
| `Button---secondary---[hash]` | Secondary style | ❌ Avoid — hashed |
| `TopNavigationBar---[name]---[hash]` | Toolbar buttons | ❌ Avoid — hashed |
| `ucm2--src-components-[...]` | Page Builder ucm2 components | ❌ Avoid — hashed |
| `data-marker="*"` | Test hooks | ✅ **Use these** |

---

## Accessibility Expectations

Observed ARIA patterns during live analysis:

| Pattern | Finding |
|---------|---------|
| `[role="treegrid"]` for list | ✅ Proper semantic role |
| `[role="menu"]` for Actions dropdown | ✅ Proper ARIA menu |
| `[role="menuitem"]` for each action | ✅ Proper ARIA |
| `[role="tab"]` for Design/Pages tabs | ✅ Proper ARIA tab |
| `[role="tabpanel"]` for tab content | ✅ Proper ARIA |
| `[role="alertdialog"]` for "Leave without saving?" | ✅ Correct dialog role |
| Undo/Redo buttons have empty `aria-label=""` | ⚠️ Accessibility gap — no accessible name on toolbar icon buttons |
| Page-level Actions button: `aria-label="Actions null"` | ⚠️ `"null"` suffix is a bug — likely missing the page name in the aria-label |

---

## Screenshot References

All screenshots taken during live analysis are saved to `specs-UHS-17045/`:

| File | Contents |
|------|----------|
| `discovery-01-list-page.png` | Full Page Builder list page (`/admin/landing-pages`) |
| `discovery-02-actions-menu.png` | Actions button before click |
| `discovery-03-actions-dropdown.png` | Row-level Actions menu open (Publish, Rename, Preview, Delete, Duplicate) |
| `discovery-04-design-tab.png` | Design tab with Basic and Dynamic groups (Static collapsed) |
| `discovery-05-design-components-full.png` | Design tab with all groups expanded |
| `discovery-06-edit-mode.png` | Editor after clicking Edit button |
| `discovery-07-page-actions-menu.png` | Pages tab — page-level Actions menu (Rename, Copy link, Add subpage) |
| `discovery-08-publish-flow-step1.png` | Publish wizard — Step 1: Landing page details |
| `discovery-09-publish-step3-audience.png` | Publish wizard — Step 3: Determine visibility (audience picker) |
| `discovery-10-edit-mode-active.png` | Editor in active edit mode |
| `discovery-11-component-selected.png` | Canvas with component selected |
| `discovery-12-create-page-modal.png` | Create new page modal |

---

## Observations

1. **Page Builder URL is `/admin/landing-pages`, not `/admin/page-builder`.** The admin navigation link (`[data-marker="pageBuilder"]`) routes to `/admin/landing-pages`. Navigating directly to `/admin/page-builder` opens the last-opened editor page. All tests must navigate via the admin nav link or directly to `/admin/landing-pages`.

2. **SC-06 (Filters) requires re-scoping.** No filter panel exists on the Page Builder list page in this BETA. The "Columns" tab provides column-visibility management only. There is no status/type/search filter panel. SC-06 as written cannot be implemented against the current BETA — it must either be deferred or re-scoped to test column sorting and the column picker.

3. **SC-04 (Multilingual) requires user clarification.** No per-page language configuration was found anywhere in the Page Builder UI (editor, create flow, or publish wizard). The 47-locale language selector in the page is the global Percipio UI language selector, not Page Builder-specific. SC-04 cannot be implemented as originally written — needs re-scoping.

4. **Audience association is in the Publish wizard (Step 3), not the editor.** SC-03 (audience association) must test the Publish wizard flow, not an "Audiences" tab in the editor. The test must proceed through Steps 1–3 of the wizard to reach the "Determine visibility" step.

5. **"All Users" audience already exists in develop org.** OQ-07 is resolved — no seeding required for SC-03. The pre-existing "All Users" audience with 4,237 users is available.

6. **Only one template available.** Only "Academy Experience" is available for creating new pages; two other templates are "Coming soon". All new page creation tests must use the Academy Experience template.

7. **Undo/Redo buttons have empty `aria-label`.** These buttons cannot be targeted by `getByRole("button", { name: "Undo" })`. They must be located by their class pattern: `button.TopNavigationBar---undoRedoButton` (first = Undo, second = Redo). This is an accessibility bug in the product — document in the page object.

8. **Page-level Actions button has `aria-label="Actions null"`.** The `"null"` suffix appears to be a bug (the page name or ID that should populate the label is null). This means the locator `getByRole("button", { name: "Actions null" })` will work for the current implementation but is fragile — if the bug is fixed, the label will change. Use `[data-marker="Actions"]` on the list page and check for the actual label in the editor.

9. **DnD requires further investigation with a blank new canvas.** All DnD testing was done on the "Testtier" page which had pre-existing content. A fresh blank canvas (created via "Get started") should be used to validate that components can be dragged from the Design panel onto the canvas, as the empty canvas showed "Drag and drop items from Design panel" instructional text.

10. **Page count limit: 10 published pages.** The list page shows "0/10 published pages" — there is a cap of 10 published pages per org. Tests must not exhaust this cap; use Draft state where possible, or clean up published pages between runs.

---

## Open Design Questions

> ✅ All open design questions resolved on 2026-05-25. No blockers remain for implementation.

| # | Question | Resolution |
|---|----------|------------|
| **ODQ-01** | SC-04 (Multilingual): No per-page language configuration exists in the BETA. What does "Multilingual support in page builder" mean? | **DEFERRED.** SC-04 is deferred to a future sprint. `pageBuilderMultilingual.spec.ts` will NOT be created in UHS-17045. A follow-on ticket should be raised when per-page multilingual is implemented. |
| **ODQ-02** | SC-06 (Filters): No filter panel exists on the Page Builder list page. What should filter validation cover? | **RE-SCOPED.** SC-06 re-scoped to validate the **Columns picker** (Columns tab): test that individual columns can be shown/hidden and the grid table updates accordingly. `pageBuilderFilters.spec.ts` renamed intent → `pageBuilderColumns.spec.ts`. |

---

_End of design.md_
