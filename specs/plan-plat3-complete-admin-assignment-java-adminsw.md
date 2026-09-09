# Test Plan: plat3-complete — Admin → Assignments → Create & Launch (java / adminsw)

This plan follows [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc) and [`.github/agents/playwright-test-planner.agent.md`](../.github/agents/playwright-test-planner.agent.md).

## Target environment

| Item | Value |
| ---- | ----- |
| **App URL** | `https://plat3-complete.front.develop.squads-dev.com` |
| **Seed / orchestrator hook** | [`seed.spec.ts`](../seed.spec.ts) — empty scaffold with `lognToPageFixture`; use for generator replay or replace with a dedicated spec under `tests/`. |

**Config:** Point `frontend.url` in `config/<NODE_ENV>.json` (e.g. `develop.json`) to this host for runs against plat3-complete. Credentials come from the same `frontend.basicUser` / `frontend.basicPassword` entries used by [`fixtures/loginFixture.ts`](../fixtures/loginFixture.ts).

## Live exploration notes

### Login (`https://plat3-complete.front.develop.squads-dev.com/`)

- Navigating to the base URL redirects to **`/login?state=%2F#/`** (Percipio Login).
- **Session 2026-04-29 (browser):** Landing showed **classic** path directly: textbox **`Email or login name`**, **`Next`** (initially disabled until the email step is valid), link **`Login with your corporate credentials using SSO`** (returns to corporate SSO entry). Heading **Let’s get started!**
- Other builds may show an **SSO-first** screen first (`Log in`, **`Alternatively, login with your Percipio credentials`**) before `#/classic` — use whichever path your tenant shows.
- **Popups / dialogs during login:** **Accept** native `alert` / `confirm` / `prompt` and in-app modals (cookies, announcements, session) so the authenticated shell loads. Automation: `page.on('dialog', …)` with `dialog.accept()` (see [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts)).

### Add content step — checkboxes (not captured live)

- **Post-login Add content UI** was **not** explored in-session (credentials required). Checkbox labels and layout must be confirmed on first logged-in pass on plat3-complete.
- **Product alignment:** Assignment APIs in this repo use **`isContentOrderRequired`** ([`helper/api/payloads/createAssignmentPayLoad.ts`](../helper/api/payloads/createAssignmentPayLoad.ts)) for ordered content; the UI checkbox for **Force order** (or **Force content order** / locale equivalent) should correspond to that behavior. Record the exact accessible name when you verify in the app.

### Assignment wizard (from automation / prior plans)

- Steps align with [`specs/plan-admin-create-assignment-launch.md`](plan-admin-create-assignment-launch.md) and [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts). Reconcile labels if plat3-complete diverges.

## Related automation (reference)

| Artifact | Purpose |
| -------- | ------- |
| [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts) | Reference implementation: `AdminHomePage.navigateToAssignments` → `AssignmentsPage.navigateToNewAssignment`, java content, `adminsw`, launch assertions. |
| [`pageObjects/AdminHomePage.page.ts`](../pageObjects/AdminHomePage.page.ts) | Learning menu → Assignments. |
| [`pageObjects/Assignments/AssignmentsPage.page.ts`](../pageObjects/Assignments/AssignmentsPage.page.ts) | New assignment → **Create Assignment** heading. |
| [`pageObjects/Assignments/CreateAssignmentWizard.page.ts`](../pageObjects/Assignments/CreateAssignmentWizard.page.ts) | Wizard steps including Add content; extend here for checkbox / Force order automation. |

## Preconditions

- Tester uses an **admin** (or equivalent) account that can open **Admin** / site navigation and **Assignments**.
- `frontend.url` matches **plat3-complete** when executing against this environment.
- User **`adminsw`** exists and can be assigned.
- Content search returns at least one hit for **`java`**.
- **Starting state:** fresh browser session or cleared storage; no half-finished assignment wizard open.

## Happy path

### HP-01: Create and launch assignment — java content, user adminsw

**Assumptions:** Blank/fresh state; admin credentials available.

1. Open **`https://plat3-complete.front.develop.squads-dev.com`**.
2. Complete login: use SSO **`Log in`** *or* **`Alternatively, login with your Percipio credentials`** → classic flow with **Email or login name** / password as required; **accept any modals** that block progress.
3. Wait until the **learner/admin shell** is ready (e.g. `#learningMainMenu` visible — match your existing login spec assertions).
4. **Admin view → Assignments:** open **Learning** / site menu → **Assignments** (same navigation as `AdminHomePage.navigateToAssignments`).
5. Start **New assignment**; expect heading **Create Assignment** (`data-marker` / POM: `AssignmentsPage.navigateToNewAssignment`).
6. **Step 1 — Describe your assignment:** fill required fields (example from automation: **Title** unique, **Business objective** e.g. Engagement, **Category** e.g. Upskilling, **Description**, **Days to complete** e.g. 7).
7. Click **`Next: Add content`**.
8. **Step 2 — Add content** (search, checkboxes, **Force order**):
   1. **Checkbox inventory:** On the Add content step, identify **every** `checkbox` in the accessibility tree that belongs to this step. Include:
      - The **main wizard** surface for “Add content” / managed content list.
      - The **content search dialog** while it is open (if any checkboxes appear there).
      For each checkbox, record its **accessible name** (and short note: e.g. row select vs assignment option). Use DevTools **Accessibility** tree, or Playwright discovery: e.g. scope to the step region and list `getByRole("checkbox")`.
   2. **Search and add first result:** Open **Add content**; in the content search dialog, search **`java`**, wait for results, select the **first** result (e.g. first **`Add To Assignment`**), confirm with **`Add content`** if a second confirmation control appears.
   3. **Force order:** Enable the checkbox labeled **Force order** or **Force content order** (or the closest match that means “learners must complete content in order”). If the control is **disabled** until at least one item exists, perform step **8.2** first, then return to the Add content step and enable **Force order**. If multiple order-related checkboxes exist, select the one that applies to **assignment-level** sequential completion (not an unrelated row checkbox).
9. Click **`Next: Add users and audiences`**.
10. **Step 3 — Users:** open **Add users and audiences**; in **Search for users**, enter **`adminsw`**, select the user (e.g. first **Select or deselect item**), **Done**.
11. Click **`Next: Notify users`** → **`Next: Review and launch`** → **`Next: Launch Assignment`**.
12. **Expected:** Success copy such as **`Success! You launched a new assignment.`** and **`View summary page`** (or equivalent) is visible.

**Success criteria:** Step 12 passes; **Force order** is visibly checked (or persisted in review) before launch, and checkbox inventory is documented for regression.  
**Failure conditions:** Login blocked by dismissed modals, validation errors, missing content/user, **Force order** not selectable when required, or launch/success UI absent.

## Negative scenarios (independent)

### NG-01: Step 1 required fields empty

Leave mandatory fields empty; attempt **Next**.  
**Expected:** Cannot proceed or inline validation appears.

### NG-02: No content added

Complete step 1; on step 2 add no content.  
**Expected:** Cannot reach users step or **Next: Add users and audiences** stays disabled / blocked.

### NG-03: No user selected

Complete steps 1–2; open user picker but select nothing.  
**Expected:** Cannot complete notify step or clear validation.

### NG-04: User search — no results

Search for a non-existent user.  
**Expected:** No row to select; **Done** behavior matches product (disabled or no assignment).

### NG-05: Force order — cannot enable without content

If the product requires at least one content item before **Force order** is enabled:

1. Open Add content; confirm **Force order** is disabled with no items.
2. Add one item; confirm **Force order** becomes enabled.

**Expected:** Behavior matches product rules; no silent failure on launch.

## Automation mapping (framework conventions)

1. Import `test` / `expect` from [`fixtures/loginFixture`](../fixtures/loginFixture.ts) (or Allure fixtures if project standard).
2. Use **`AllureReporter.step`** for business steps; locators prefer **`getByRole` → `getByLabel` → `getByText`**; keep wizard logic in **page objects** where possible ([`pageObjects/base/BasePage.ts`](../pageObjects/base/BasePage.ts)).
3. New plat3-complete spec: set `frontend.url` / env to plat3-complete, or `page.goto` override consistent with team pattern; avoid `waitForTimeout` / `networkidle` per rules.
4. **Checkboxes:** Implement enumeration in a dedicated `AllureReporter.step` (e.g. `locator.evaluateAll` to collect `aria-label` / name, or loop `getByRole("checkbox")` with a stable parent). Target **Force order** with `getByRole("checkbox", { name: /force.*order/i })` (adjust regex after live label capture on plat3-complete).

## Exit criteria

- HP-01 passes on plat3-complete with the configured admin user; **java** first result, **adminsw**, **Force order** checked, then launch success.
- Negative scenarios behave as expected.
- No unexplained console or network failures during launch.
