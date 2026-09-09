# E2E Test Plan: Page Builder — Full Component Creation & Publication Flow

**Document ID:** PB-E2E-001  
**Date:** 2026-07-23  
**Status:** In Development  

---

## Overview

This test validates the complete end-to-end workflow for the Page Builder:
1. Create a page with all 14 design tab components
2. Populate each component with realistic test data
3. For multi-type components (Dynamic Strip, Leaderboard), add instances for each type
4. Publish the page to all audiences
5. Navigate to learner view and validate all components render correctly

---

## Test Scope

### Components Covered (14 Total)

#### Basic Components (6)
- [x] Text
- [x] Button
- [x] Image
- [x] Video
- [x] Divider
- [x] Dynamic Text

#### Static Editable Cards (4)
- [x] Image & Text Card
- [x] Text & Button Card
- [x] Image, Text & Button Card
- [x] Profile Card

#### Dynamic Data Components (4)
- [x] Dynamic Card
- [x] Dynamic Strip (with type variations)
- [x] Promoted Content Strip
- [x] Promoted Banner

**Note:** Dynamic Strip types to be explored during live app inspection. Leaderboard is assumed to be a variant or separate component; will be identified during exploration.

---

## Test Flow (High Level)

```
┌─ Preconditions ─────────────────────────────────────────
│ • Authenticated as Admin (test setup)
│ • Page Builder list page accessible
│ • "All Users" audience available (4,237 users)
└─────────────────────────────────────────────────────────

┌─ Step 1: Create Page ────────────────────────────────────
│ • Create new page with unique name
│ • Navigate to page editor
│ • Enter Edit Mode
│ • Switch to Design Tab
└─────────────────────────────────────────────────────────

┌─ Step 2: Add All 14 Components ─────────────────────────
│ ├─ Basic (6 components)
│ │  • Drag each to canvas
│ │  • Fill test data:
│ │    - Text: Faker Lorem text
│ │    - Button: Label + action config (if applicable)
│ │    - Image: Upload or select image
│ │    - Video: Select video from catalog
│ │    - Divider: (no data needed)
│ │    - Dynamic Text: Bind to data field (TBD)
│ │
│ ├─ Static Cards (4 components)
│ │  • Drag each to canvas
│ │  • Fill card-specific data:
│ │    - Title, description, CTA text
│ │    - Image selection
│ │    - Link/action configuration
│ │
│ ├─ Dynamic Components (4 components)
│ │  • Drag Dynamic Strip → Configure types:
│ │    - Add instance for each available type
│ │    - Bind to data source (TBD)
│ │
│ │  • Drag Leaderboard (if separate) → Configure:
│ │    - Add instance for each leaderboard type
│ │    - Set ranking criteria
│ │
│ │  • Drag Dynamic Card, Promoted Content Strip, Promoted Banner
│ │    - Configure data bindings
│ │
│ └─
└─────────────────────────────────────────────────────────

┌─ Step 3: Save Draft ────────────────────────────────────
│ • Click Save
│ • Verify Save completes
└─────────────────────────────────────────────────────────

┌─ Step 4: Publish Page ──────────────────────────────────
│ • Click Publish → 5-step wizard opens
│ │
│ • Step 1: Landing Page Details
│ │  - Verify title, URL pre-filled
│ │  - Toggle "Hide in left nav" if needed
│ │  - Click "Next: Pages"
│ │
│ • Step 2: Pages
│ │  - Verify page in list
│ │  - Click "Next: Determine visibility"
│ │
│ • Step 3: Determine Visibility (Audience)
│ │  - Search and select "All Users" audience
│ │  - Verify in "Selected audiences" tab
│ │  - Click "Next: Default homepage"
│ │
│ • Step 4: Default Homepage
│ │  - Select "No" (or configure as needed)
│ │  - Click "Next: Review and publish"
│ │
│ • Step 5: Review & Publish
│ │  - Verify all details
│ │  - Click "Publish page(s)"
│ │  - Confirm publication success
│ │
│ └─
└─────────────────────────────────────────────────────────

┌─ Step 5: Navigate to Learner View ──────────────────────
│ • Log out from Admin or navigate to learner portal
│ • Locate published page in left navigation
│ • Open page
└─────────────────────────────────────────────────────────

┌─ Step 6: Validate Component Rendering ──────────────────
│ • Verify page layout renders
│ • For each component:
│ │  • Text: Verify text content displays
│ │  • Button: Verify button visible with correct label
│ │  • Image: Verify image loaded and visible
│ │  • Video: Verify video player or placeholder visible
│ │  • Divider: Verify divider line rendered
│ │  • Dynamic Text: Verify dynamic content populated
│ │  • Cards: Verify all card elements (image, text, CTA)
│ │  • Dynamic Strip instances: Verify each type rendered
│ │  • Leaderboard instances: Verify each type rendered
│ │  • Promoted components: Verify content displayed
│ │
│ └─
└─────────────────────────────────────────────────────────
```

---

## Component Data Strategy

### Basic Components

| Component | Test Data | Source |
|-----------|-----------|--------|
| Text | `faker.lorem.paragraph()` | @faker-js/faker |
| Button | Label: `faker.lorem.word()` | @faker-js/faker |
| Image | Test image URL or upload | TBD (explore in app) |
| Video | Select from video catalog | TBD (explore in app) |
| Divider | N/A | N/A |
| Dynamic Text | Bind to field (TBD) | App binding UI |

### Static Cards

| Component | Data Fields | Source |
|-----------|-------------|--------|
| Image & Text Card | Title, description, image | faker + image URL |
| Text & Button Card | Title, description, button label | faker |
| Image, Text & Button Card | All above + button action | faker + app |
| Profile Card | Name, role, image, description | faker |

### Dynamic Components

**Strategy:** 
1. Explore live app to identify:
   - Dynamic Strip available types (e.g., "Card List", "Carousel", etc.)
   - Leaderboard types (if separate component)
   - Data binding UI for each type
   
2. Create N instances per type:
   - Minimum 2 instances per type to verify multiple instances render
   - Use unique data sets for each instance

---

## Acceptance Criteria

1. ✅ All 14 components successfully added to page
2. ✅ Each component configured with realistic test data
3. ✅ Dynamic Strip: At least 1 instance per available type
4. ✅ Leaderboard: At least 1 instance per available type (if component exists)
5. ✅ Page saved successfully (draft state)
6. ✅ Page published successfully to "All Users" audience
7. ✅ Published page visible in learner left navigation
8. ✅ All components render in learner view
9. ✅ Component content (text, images, etc.) matches what was created
10. ✅ Dynamic components display data correctly
11. ✅ No console errors or accessibility violations during viewing

---

## Test Locators & Strategies

### Design Tab Components
- **Drag Source:** `[aria-roledescription="draggable"]` + component name
- **Canvas Drop Zone:** 250px right of design panel, 40% down from panel top
- **Component Canvas Markers:** `[data-marker="PageBuilder--{componentName}"]`

### Publish Wizard Steps
- **Step 1 Title:** `#pageTitle`
- **Step 3 Audience Search:** `#search` or `input[aria-label="Search for audiences"]`
- **All Audiences Tab:** `getByRole("tab", { name: "All audiences" })`
- **Selected Audiences Tab:** `getByRole("tab", { name: "Selected audiences" })`
- **Step 4 Radios:** Styled custom radio buttons — use `evaluate()` for state changes
- **Publish Button:** `getByRole("button", { name: "Publish page(s)" })`

### Learner View Navigation
- **Left Navigation:** TBD (explore in app)
- **Published Pages List:** TBD (explore in app)
- **Component Visibility:** Use data-markers or role-based selectors per component

---

## Known Constraints & Workarounds

1. **Dynamic Component Dialogs:** Video, Dynamic Strip, and other dynamic components open configuration dialogs on drop. These dismiss via Cancel, removing the component placeholder. Use `dismissPickerDialogIfOpen()` helper.

2. **Org Page Cap:** 10 published pages max per org. Consider using `cancelAndLeave()` in wizard if publication not strictly required, to preserve cap for other tests.

3. **Drag Implementation:** Uses pointer-event based drag, not HTML5 native DnD. Requires:
   - `user-select: none` to prevent text selection
   - Initial jiggle (8px, 3 steps) to cross browser drag threshold
   - 80ms pause after `mouse.down()` for press registration

4. **Radio Button Styling:** Step 4 "Default homepage" uses custom-styled radio buttons (positioned off-viewport). Cannot use standard `getByRole("radio")`. Use `evaluate()` to set state directly.

5. **Canvas Position Calculation:** No stable data-marker on canvas. Drop zone calculated as 250px right of panel bounding box, clamped to [200px, viewport-height - 100px] in Y.

6. **Page Scroll During Drag:** When dragging lower sidebar tiles (e.g., "Text & Button Card"), page scrolls down, pushing panel top above viewport. Use `source.scrollIntoViewIfNeeded()` before drag.

---

## Helper Methods to Create/Update

### PageBuilderDesignPanel Extensions
- `addComponentWithData(componentName, data)` — Drag + fill component form
- `configureComponentData(componentName, data)` — Fill post-drop configuration
- `addDynamicStripTypes(types[])` — Add multiple Dynamic Strip type instances
- `addLeaderboardTypes(types[])` — Add multiple Leaderboard type instances

### New Page Object: PageBuilderLearnerView
- `navigateToLearnerView()` — Logout or navigate to learner portal
- `assertPublishedPageInNav(pageName)` — Verify page in left nav
- `clickPublishedPage(pageName)` — Open published page
- `assertComponentVisible(componentName)` — Verify component renders
- `assertComponentContent(componentName, expectedContent)` — Verify data

---

## Dependencies & Setup

### Test Fixtures
- Standard `allureFixtures` with auth context
- Faker for random data generation
- Optional: Image/video fixtures if upload required

### Pre-test Seeding
- ✅ "All Users" audience available (confirmed in develop org)
- ❓ Sample video catalog (needs verification)
- ❓ Test image assets (needs setup)

### Post-test Cleanup
- Delete test page to preserve org page cap (or use `cancelAndLeave()`)
- Consider: Draft pages do NOT count against cap — only published pages

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Component dialogs not dismissed properly | Implement robust `dismissPickerDialogIfOpen()` with retry logic |
| Learner view not accessible or different URL | Explore live app URL structure early; add env var for learner base URL |
| Dynamic component types unknown | Explore live app; document all types in constants file |
| Data binding UI complex/non-standard | Record component configuration flow in helpers; verify in manual testing first |
| Canvas element selector unreliable | Use grid-item ID snapshots before/after drag; find new item by ID diff |
| Radio button state not settable via standard means | Use `evaluate()` to manipulate DOM directly; verify with live app |

---

## Execution Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| App Exploration (live MCP) | 1 hour | **In Progress** |
| Test Plan Review & Approval | 30 min | Pending |
| Helper Method Implementation | 2 hours | Pending |
| Test Implementation | 2 hours | Pending |
| Manual Validation (learner view) | 1 hour | Pending |
| Test Execution & Debugging | 1 hour | Pending |
| **Total** | **~7.5 hours** | |

---

## References

- **Spec:** specs-UHS-XXXXX/spec.md
- **Existing Test:** `tests/PageBuilder/pageBuilderComponents.spec.ts`
- **Page Objects:** `pageObjects/PageBuilder/*.page.ts`
- **Faker Docs:** https://fakerjs.dev/
- **Playwright Docs:** https://playwright.dev/docs/intro

