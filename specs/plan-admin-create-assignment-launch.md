# Test Plan: Admin -> Assignments -> Create and Launch Assignment

This plan follows `.cursor/rules/playwright-agents.mdc` and `.github/agents/playwright-test-planner.agent.md`.

## Environment URL

- **Default host (ucm-manual3-aws):** `https://ucm-manual3-aws.front.develop.squads-dev.com/`
- Override with `UCM_MANUAL3_AWS_BASE_URL` if needed (see [`tests/ucm-manual3-aws/manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts)).

## Related automation and seed

| Artifact | Purpose |
| -------- | ------- |
| [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts) | **Primary automation** — implements the happy path below (`Create and launch assignment with java content for adminsw`). Prefer extending this file rather than duplicating flows in other specs. |
| [`seed.spec.ts`](../seed.spec.ts) | Empty scaffold (`lognToPageFixture`) for orchestrator / generator replay; wire this spec to the same login + admin nav as `assignmentCreate.spec.ts` when using the **playwright-test-generator** replay flow. |

**Page objects:** [`pageObjects/AdminHomePage.page.ts`](../pageObjects/AdminHomePage.page.ts) (`navigateToAssignments`), [`pageObjects/Assignments/AssignmentsPage.page.ts`](../pageObjects/Assignments/AssignmentsPage.page.ts) (`navigateToNewAssignment`). Wizard steps after that currently use role-based locators in the spec; new shared steps should move into page objects per framework rules.

## Scope

Validate the end-to-end admin flow:

1. Navigate to `Admin View -> Assignments`.
2. Create a new assignment.
3. Search content with `java` and select the first result.
4. Add user `adminsw`.
5. Launch the assignment.

## Observed Application Behavior (Live Exploration)

- Login page supports `Alternatively, login with your Percipio credentials`.
- Assignment creation is a **5-step wizard**:
  1. Describe your assignment
  2. Add content
  3. Add users and audiences
  4. Notify users (emails)
  5. Review and launch
- In content search, query `java` returns results; first row is added via **`Add To Assignment`** (first matching button), then dialog **`Add content`** confirms.
- Content dialog (automation): `dialog` named like **Search for your content and Percipio content**; combobox **Search for content in English**.
- User picker: dialog **Search for users and audiences**; textbox **Search for users**; select first **Select or deselect item** for `adminsw`, then **Done**.
- Final launch: buttons **Next: Notify users** → **Next: Review and launch** → **Next: Launch Assignment**.
- Success confirmation:
  - `Success! You launched a new assignment.`
  - `View summary page` (link)

## Preconditions

- Test user has admin permissions and can open admin dashboard.
- `adminsw` exists and is assignable in the tenant.
- Content search is available and returns at least one item for `java`.
- Start with no in-progress assignment wizard open.

## Happy Path Scenario

### Scenario HP-01: Create and Launch Assignment with Java Content for adminsw

**Goal:** Confirm assignment can be created and launched with selected content and user.

1. Open app URL and log in as admin (see `fixtures/loginFixture` / auth setup used by `assignmentCreate.spec.ts`).
2. From admin / site navigation: **Learning** menu → **Assignments** (matches `AdminHomePage.navigateToAssignments`).
3. Click **New assignment** (matches `AssignmentsPage.navigateToNewAssignment` — heading **Create Assignment**).
4. In step 1 (**Describe your assignment**), fill required fields (example values from automation):
   - **Title** — unique string
   - **Business objective** — combobox (e.g. type `Engagement`, arrow down, Enter)
   - **Category** — e.g. `Upskilling`
   - **Description** — non-empty
   - **Days to complete** — e.g. `7`
5. Click **`Next: Add content`**.
6. In step 2, click **`Add content`** (first instance if multiple).
7. In the content search dialog:
   - In **Search for content in English**, enter **`java`** and submit search (Enter).
   - Wait for results (e.g. copy indicating results for `"java"`).
   - On the **first** result row, click **`Add To Assignment`**.
   - Click **`Add content`** in the dialog to confirm and close.
8. Confirm the wizard shows added content (e.g. manage content area updated).
9. Click **`Next: Add users and audiences`**.
10. In step 3, click **`Add users and audiences`**.
11. In **Search for users and audiences**:
    - In **Search for users**, enter **`adminsw`** and search (Enter).
    - Click the first **`Select or deselect item`** for that user.
    - Click **`Done`**.
12. Click **`Next: Notify users`**.
13. Click **`Next: Review and launch`**.
14. Click **`Next: Launch Assignment`**.
15. **Assert success:** text `Success! You launched a new assignment.` and link **`View summary page`** visible.

**Expected Result:** Assignment launches successfully; success screen matches step 15.

**Success criteria:** Step 15 passes. **Failure conditions:** Wizard blocked, validation errors, launch error, or success message missing.

## Negative Scenarios

### Scenario NG-01: Required details missing in Step 1

1. Open `New assignment`.
2. Leave one or more mandatory fields empty (e.g., title or business objective).
3. Attempt to proceed.

**Expected Result:** Next action remains disabled or inline validation is shown; cannot continue.

### Scenario NG-02: No content selected

1. Complete step 1.
2. Go to step 2.
3. Do not add content.

**Expected Result:** `Next: Add users and audiences` stays disabled or user is blocked with validation.

### Scenario NG-03: User not selected

1. Complete steps 1 and 2.
2. In step 3, open picker but do not select any user/audience.

**Expected Result:** `Next: Notify users` remains disabled or validation prevents progress.

### Scenario NG-04: User search returns no results

1. Open `Add users and audiences`.
2. Search with a non-existent user id.

**Expected Result:** Empty results, `Done` disabled, and no user added.

## Suggested Automation Mapping

- Implemented path: [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts) (uses `loginFixture`, `storageState` cleared for fresh login).
- Extend **page objects** for any new steps instead of growing inline locators in the spec (per `.cursor/rules/playwright-agents.mdc`).
- Optional hardening: move step 1 / modals / launch assertions into `AssignmentsPage` or a dedicated assignment wizard page object.

## Exit Criteria

- Happy path passes in target environment.
- All negative scenarios show correct blocking/validation behavior.
- No unexpected console/network blockers during assignment launch flow.
