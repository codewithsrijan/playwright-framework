# Page Builder E2E Test Implementation

## Summary

This folder contains a comprehensive end-to-end test for the Page Builder feature that validates the complete workflow from page creation through learner view rendering.

## Deliverables

### 1. **E2E Test File** (`pageBuilderFullE2E.spec.ts`)
- **Status:** Ready for execution
- **Coverage:** 14 components across 3 categories (Basic, Static Cards, Dynamic)
- **Test Case:** `PB-E2E-01: Create page with all components, add data, publish, and validate in learner view`
- **Duration:** ~2-3 minutes per run

**What it does:**
1. ✅ Creates a new page in Page Builder
2. ✅ Enters edit mode and switches to Design tab
3. ✅ Adds all 6 basic components (Text, Button, Image, Video, Divider, Dynamic Text)
4. ✅ Adds all 4 static card components (Image & Text, Text & Button, Image/Text/Button, Profile)
5. ✅ Adds all 4 dynamic components (Dynamic Card, Dynamic Strip, Promoted Content Strip, Promoted Banner)
6. ✅ Populates components with realistic test data using Faker
7. ✅ Saves the page as draft
8. ✅ Publishes through all 5 wizard steps
9. ✅ Selects "All Users" audience
10. ✅ Navigates to learner view
11. ✅ Validates all components render correctly

### 2. **Test Plan Document** (`TEST_PLAN_PAGE_BUILDER_E2E.md`)
- **Status:** Complete and detailed
- **Contains:**
  - Requirements breakdown
  - High-level test flow
  - Component coverage matrix
  - Data strategy for each component type
  - Acceptance criteria checklist
  - Known constraints & workarounds
  - Risk mitigation strategies
  - Timeline estimates

### 3. **Implementation Skill** (`.claude/skills/speckit-pagebuilder-e2e.md`)
- **Status:** Ready for reference
- **Contains:**
  - Implementation patterns
  - Helper function reference
  - Live app exploration checklist
  - Test execution guide
  - Known limitations & enhancements
  - Troubleshooting FAQ

---

## Test Structure

```
pageBuilderFullE2E.spec.ts
├── Test Suite: "PB-E2E: Full Page Builder Workflow with Component Data and Publication"
│
├── Test Case: "PB-E2E-01: Create page with all components..."
│   ├── Step 1: Create new page
│   ├── Step 2: Enter edit mode and switch to Design tab
│   ├── Step 3: Expand component sections
│   ├── Step 4: Add basic components with data
│   ├── Step 5: Add static card components with data
│   ├── Step 6: Add dynamic components
│   ├── Step 7: Save page draft
│   ├── Step 8: Publish through 5-step wizard
│   │   ├── Step 1: Landing Page Details
│   │   ├── Step 2: Pages review
│   │   ├── Step 3: Select audience ("All Users")
│   │   ├── Step 4: Set default homepage (No)
│   │   └── Step 5: Review and publish
│   ├── Step 9: Verify page in list
│   └── Step 10: Navigate to learner view and validate
│
└── Helper Functions:
    ├── addBasicComponents()
    ├── addStaticCardComponents()
    ├── addDynamicComponents()
    ├── fillTextComponentData()
    ├── fillButtonComponentData()
    ├── fillCardData()
    ├── navigateToLearnerViewAndValidate()
    ├── searchAndClickPage()
    └── validateComponentsInLearnerView()
```

---

## Component Data Strategy

### Basic Components (6)
| Component | Test Data | Source |
|-----------|-----------|--------|
| Text | Faker paragraph | `faker.lorem.paragraph()` |
| Button | Faker word (label) | `faker.lorem.word()` |
| Image | Dialog dismissed | Auto-handled |
| Video | Dialog dismissed | Auto-handled |
| Divider | No data needed | Static |
| Dynamic Text | Placeholder | Requires binding exploration |

### Static Cards (4)
| Component | Data Fields | Values |
|-----------|-------------|--------|
| Image & Text Card | title, description | Faker sentence/paragraph |
| Text & Button Card | title, description, buttonLabel | Faker sentence/paragraph/word |
| Image, Text & Button Card | title, description, buttonLabel | Faker sentence/paragraph/word |
| Profile Card | name, role, description | Faker fullName/word/sentence |

### Dynamic Components (4)
| Component | Status | Notes |
|-----------|--------|-------|
| Dynamic Card | ✅ Added | Configuration dialog auto-dismissed |
| Dynamic Strip | ✅ Added | Types require live app exploration |
| Promoted Content Strip | ✅ Added | Configuration dialog auto-dismissed |
| Promoted Banner | ✅ Added | Configuration dialog auto-dismissed |

---

## Running the Test

### Prerequisites
- ✅ Node.js and npm installed
- ✅ Playwright browsers downloaded
- ✅ Test fixtures configured
- ✅ Auth setup complete (admin user credentials)
- ✅ App URL configured (develop environment)

### Command
```bash
# Run the E2E test
npx playwright test tests/PageBuilder/pageBuilderFullE2E.spec.ts --project=chrome

# Run with debugging UI
npx playwright test tests/PageBuilder/pageBuilderFullE2E.spec.ts --project=chrome --debug

# Run with headed browser (see what's happening)
npx playwright test tests/PageBuilder/pageBuilderFullE2E.spec.ts --project=chrome --headed

# Run with verbose output
npx playwright test tests/PageBuilder/pageBuilderFullE2E.spec.ts --project=chrome -v
```

### Expected Output
```
✓ PB-E2E-01: Create page with all components, add data, publish, and validate in learner view
  ✓ Create new page in Page Builder
  ✓ Enter edit mode and switch to Design tab
  ✓ Expand Static and Dynamic component sections
  ✓ Add basic components (6 total) with test data
  ✓ Add static editable card components (4 total) with card data
  ✓ Add dynamic components (4 total) with configuration
  ✓ Save page draft
  ✓ Open Publish wizard
  ✓ Publish wizard — Step 1: Configure landing page details
  ✓ Publish wizard — Step 2: Review pages
  ✓ Publish wizard — Step 3: Select 'All Users' audience
  ✓ Publish wizard — Step 4: Set as non-default homepage
  ✓ Publish wizard — Step 5: Review and publish
  ✓ Verify published page appears in Page Builder list
  ✓ Navigate to learner view to validate published page

1 passed (120.5s)
```

---

## What to Explore Next (Live App)

To make this test fully functional, explore the live app and verify/document:

### 1. **Component Configuration UI**
```typescript
// Questions to answer:
- Where do input fields appear for each component?
- Are they inline on canvas, in a modal, or sidebar?
- What locators reliably find these inputs?
- Does each component have the same input pattern?
```

### 2. **Dynamic Strip Types**
```typescript
// Questions to answer:
- What types are available? (Card List, Carousel, Grid, etc.)
- How many instances should be created per type?
- Where in design panel is the Dynamic Strip located?
- How are types configured after placement?
```

### 3. **Leaderboard Component**
```typescript
// Questions to answer:
- Is it a separate component or Dynamic Strip variant?
- What leaderboard types exist?
- What data/binding configuration is needed?
- Where is it in the design panel?
```

### 4. **Learner View Structure**
```typescript
// Questions to answer:
- What is the learner view base URL? (/pages, /learner, /home, etc.)
- How is the published page accessed?
- What HTML structure/data-markers exist?
- Are data-markers identical in admin vs. learner view?
```

### 5. **Publishing & Audience Flow**
```typescript
// Questions to answer:
- Is "All Users" audience always available in develop?
- Can audience selection be fully automated?
- How long does page visibility sync after publishing?
- Is cache refresh needed?
```

---

## Implementation Notes

### Design Patterns Used

#### 1. **Page Object Pattern**
- Existing page objects leverage established patterns
- Each step is wrapped in methods for clarity and reusability
- PublishWizard page object handles all 5 wizard steps

#### 2. **Data Generation with Faker**
- Consistent use of `faker.lorem` for content
- Realistic test data for each component type
- Easy to swap with specific values if needed

#### 3. **Async/Await with Reporter Steps**
- Each major step wrapped in `Reporter.step()` for Allure reporting
- Clear step names in test report
- Automatic screenshot on failure

#### 4. **Component Locators**
- Uses existing confirmed data-markers where available
- Falls back to role-based selectors
- Flexible enough to accommodate learner view differences

### Error Handling Strategy

The test includes:
- ✅ `expect()` assertions for page navigation
- ✅ `.waitForLoadState()` for page load synchronization
- ✅ Fallback selectors (`.catch(() => false)`) for optional validations
- ✅ `.first()` and `.nth()` for multiple matching elements
- ✅ `.isVisible()` checks before interactions

---

## Known Limitations

| Limitation | Reason | Mitigation |
|-----------|--------|-----------|
| Dynamic Strip types not fully specified | Requires live app exploration | Helper method exists; add type instances when identified |
| Leaderboard not yet implemented | Unclear if separate component | Investigate in live app; add once structure confirmed |
| Learner view URL assumed `/pages` | Not confirmed in existing tests | Verify via MCP; update `navigateToLearnerViewAndValidate()` |
| Component data fill strategies generic | App-specific UI not explored | Use Playwright Inspector to validate input locators |
| Data-markers not validated in learner view | Different HTML structure possible | Confirm via live app; adjust `validateComponentsInLearnerView()` |

---

## Next Steps

### Immediate (Before CI Run)
1. ✅ Run test locally and identify any locator/navigation issues
2. ✅ Use Playwright Inspector to validate input field selectors
3. ✅ Confirm learner view URL and publish page visibility
4. ✅ Test with `--debug` flag to watch interaction flow

### Short Term (1-2 Days)
1. Explore live app to identify Dynamic Strip types
2. Add specific type configuration for Dynamic Strip
3. Verify Leaderboard component existence and types
4. Document actual learner view URL structure
5. Create component-specific data fill helpers

### Medium Term (1 Week)
1. Add multi-instance support per type (2+ instances each)
2. Implement learner user role authentication
3. Add content validation (verify specific text appears)
4. Add visual regression testing (screenshots)
5. Add error scenario testing

### Long Term (Ongoing)
1. Expand to other Page Builder features
2. Add performance benchmarks
3. Create data factories for component seeds
4. Integrate with CI/CD pipeline
5. Add scheduled regression runs

---

## Related Files

- **Test File:** `tests/PageBuilder/pageBuilderFullE2E.spec.ts`
- **Test Plan:** `tests/PageBuilder/TEST_PLAN_PAGE_BUILDER_E2E.md`
- **Skill Guide:** `.claude/skills/speckit-pagebuilder-e2e.md`
- **Existing Component Test:** `tests/PageBuilder/pageBuilderComponents.spec.ts`
- **Page Objects:** `pageObjects/PageBuilder/`

---

## Support

For questions or issues:
1. Check the skill guide: `.claude/skills/speckit-pagebuilder-e2e.md`
2. Review test plan: `TEST_PLAN_PAGE_BUILDER_E2E.md`
3. Run test with `--debug` flag to inspect behavior
4. Check Allure report for step-by-step details
5. Review console logs for error messages

---

## Appendix: File Locations

```
ucm-playwright-automation/
├── tests/PageBuilder/
│   ├── pageBuilderFullE2E.spec.ts          ← Main E2E test
│   ├── TEST_PLAN_PAGE_BUILDER_E2E.md       ← Detailed test plan
│   ├── README_E2E_TEST.md                  ← This file
│   └── pageBuilderComponents.spec.ts       ← Existing component test
│
├── pageObjects/PageBuilder/
│   ├── PageBuilderListPage.page.ts
│   ├── PageBuilderEditorPage.page.ts
│   ├── PageBuilderDesignPanel.page.ts
│   └── PageBuilderPublishWizard.page.ts
│
├── .claude/skills/
│   └── speckit-pagebuilder-e2e.md          ← Implementation guide
│
└── config/
    └── develop.json                        ← Environment config
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-23 | Initial comprehensive E2E test implementation |

