# Test Plan: Admin → Assignments → Create & Launch (java / adminsw)

This plan follows [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc) and
[`.github/agents/playwright-test-planner.agent.md`](../.github/agents/playwright-test-planner.agent.md).

Explored via Playwright MCP snapshots (`.playwright-mcp/`); UI structure confirmed against live app sessions.

## Target environment

| Item | Value |
| ---- | ----- |
| **App URL** | `https://ucm-manual3-aws.front.develop.squads-dev.com/` |
| **Seed** | [`seed.spec.ts`](../seed.spec.ts) — `lognToPageFixture` scaffold |
| **Reference spec** | [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts) |

Credentials from `config/<NODE_ENV>.json` → `frontend.basicUser` / `frontend.basicPassword` (used by
[`fixtures/loginFixture.ts`](../fixtures/loginFixture.ts)).

---

## Live exploration notes

### Login

- Base URL redirects to `/login?state=%2F#/` (Percipio Login).
- Login presents an SSO path (`Log in`) **and** a classic path (`Alternatively, login with your Percipio credentials` → `#/classic`).
- Classic path: textbox **Email or login name** → **Next** → password → **Sign In**.
- **Popups / dialogs:** handle native `alert` / `confirm` / `prompt` and in-app modals (cookies, announcements, session warnings) via `page.on('dialog', d => d.accept())`.

### Admin home — navigation to Assignments

- After login, heading: **Welcome, Default! Ready to shape learning excellence?**
- Top-right: button **Site Navigation** (opens slide-out) → expand **Learning** group → link **Assignments** (`/admin/assignments`).
- Also accessible as **My Quick Links** on the dashboard, but the menu path is the authoritative automation route.

### Create Assignment wizard — 5-step structure (confirmed from snapshots)

| Step | Label | Key next-button text |
| ---- | ----- | -------------------- |
| 1 | Describe your assignment | `Next: Add content` |
| 2 | Add content | `Next: Add users and audiences` |
| 3 | Add users and audiences | `Next: Notify users` |
| 4 | Manage emails | `Next: Review and launch` |
| 5 | Review and launch | `Next: Launch Assignment` |

> **Note:** Step 4 is labelled **Manage emails** in the wizard progress bar but the advancing button reads **Next: Notify users** — this is correct as confirmed from snapshots.

### Step 1 — Describe your assignment (fields confirmed from snapshot)

- **Title** — required textbox, placeholder "Enter your title here"
- **Business objective** — required combobox (type-to-filter, ArrowDown+Enter to select)
- **Assignment type** — One-time / Recurring radiogroup (default One-time)
- **Assigned by** — pre-filled with current admin; read-only
- **Category** — required `<select>` combobox (e.g. `Upskilling`)
- **Description** — required rich-text editor (accessible as `textbox`)
- **Duration** — Specific date / Number of days radiogroup; activating **Number of days** reveals:
  - **Start date** datepicker (default today)
  - **Days to complete** spinbutton (e.g. `7`)
  - Time Zone display (GMT)
- **Manage access** — optional; add admins section
- **Languages** — "Choose your languages" section (NEW multilingual feature); default `English (US)`
- Both `Save as draft` and `Next: Add content` remain **disabled** until required fields are valid.

### Step 2 — Add content (content search dialog)

- Step surface shows a button **Add content**.
- Clicking opens dialog: **Search for your content and Percipio content**
  - combobox **Search for content in English** — type `java` + Enter
  - Results display copy like `results for "java"`
  - First result row: **Java Novice to Javanista** (Journey, Active)
  - Each row has button **Add To Assignment**
  - After selecting, click dialog button **Add content** to confirm and close
- After adding: manage content list updates; `Next: Add users and audiences` becomes enabled
- **Force order checkbox** (`data-marker="assignmentforcedOrderCompletionCheckbox"`): appears after content is added; check to require sequential completion

### Step 3 — Add users and audiences

- Button **Add users and audiences** opens dialog: **Search for users and audiences**
  - Tabs: **All users** | **All audiences** | **Selected users and audiences**
  - Textbox **Search for users** — enter `adminsw` + Enter (or button **Search for adminsw**)
  - Result row: user card with email, button **Select or deselect item**
  - **Done** button remains disabled until at least one user is selected
- After closing dialog: `Next: Notify users` becomes enabled

### Step 4 — Manage emails

- Email notification settings (send date, send time, introduction text)
- Navigate with **Next: Review and launch**

### Step 5 — Review and launch

- Summary surface shows: Assignment details, Content items (1), Users and audiences (1 user), Initial notification
- Button **Next: Launch Assignment** (or **Next: Update Assignment** when editing)
- On success: a modal dialog appears with:
  - Text: **Success! You launched a new assignment.**
  - Assignment status card (title, due date, assigned by)
  - 1 user count
  - Link **View summary page** → `/admin/assignments/<uuid>/summary`
  - Link **View all assignments** → `/admin/assignments`

---

## Preconditions

- Admin credentials are available in `config/<NODE_ENV>.json` and login succeeds.
- User **`adminsw`** exists and is assignable in the ucm-manual3-aws tenant.
- Content search returns at least one result for **`java`** (confirmed: "Java Novice to Javanista").
- No in-progress assignment wizard open; fresh browser session / cleared storage.

---

## Happy path

### HP-01: Create and launch assignment — java content, adminsw user

**Goal:** Confirm the end-to-end admin flow creates and launches an assignment successfully.

**Assumptions:** Fresh state; admin credentials from `lognToPageFixture`; `storageState` cleared.

1. Open `https://ucm-manual3-aws.front.develop.squads-dev.com/` and log in via `lognToPageFixture`.
2. Register `page.on('dialog', d => d.accept())` to auto-dismiss modals.
3. Open **Site Navigation** (top-right button) → **Learning** → click link **Assignments**.
4. Expect URL contains `/admin/assignments`; click button **New assignment** (`data-marker="newAssignmentBtn"`).
5. Expect heading **Create Assignment** visible; status shows **Draft**.

**Step 1 — Describe your assignment:**

6. Fill **Title** with a unique string (e.g. `Auto Assignment HP01 <timestamp>`).
7. Click **Business objective** combobox → type `Engagement` → ArrowDown → Enter.
8. Select **Category** `Upskilling` via `selectOption`.
9. Fill **Description** textbox.
10. Confirm **Number of days** radio is selected; fill **Days to complete** spinbutton with `7`.
11. Assert `Next: Add content` button becomes enabled; click it.

**Step 2 — Add content:**

12. Click button **Add content** (first on page).
13. In dialog **Search for your content and Percipio content**:
    - Fill combobox **Search for content in English** with `java`; press Enter.
    - Assert text matching `results for "java"` is visible.
    - Click first button **Add To Assignment**.
    - Click dialog button **Add content** (confirmation).
14. Assert dialog closes; content list in wizard shows an item.
15. Assert `Next: Add users and audiences` button is enabled.

**Step 2b — Force order (optional coverage):**

16. Locate checkbox `[data-marker="assignmentforcedOrderCompletionCheckbox"]`.
17. Assert it is visible and enabled; check it (use `{ force: true }` for SVG-overlay UIs).
18. Assert checkbox is checked.

19. Click **Next: Add users and audiences**.

**Step 3 — Add users and audiences:**

20. Click button **Add users and audiences**.
21. In dialog **Search for users and audiences**:
    - Fill textbox **Search for users** with `adminsw`; press Enter.
    - Assert at least one **Select or deselect item** button appears.
    - Click first **Select or deselect item**.
    - Click button **Done**.
22. Assert dialog closes; `Next: Notify users` button is enabled; click it.

**Step 4 — Manage emails:**

23. Click **Next: Review and launch**.

**Step 5 — Review and launch:**

24. Assert summary shows content item "Java Novice to Javanista" and "1 user".
25. Click **Next: Launch Assignment**.

**Assertions:**

26. Assert text `Success! You launched a new assignment.` is visible.
27. Assert link **View summary page** is visible.

**Success criteria:** Steps 26–27 pass.  
**Failure conditions:** Login blocked by unhandled modals; validation errors on any wizard step; content/user not found; launch fails or success copy absent.

---

## Negative scenarios

### NG-01: Required fields empty in Step 1 — cannot proceed

1. Navigate to **New assignment** → **Create Assignment** heading visible.
2. Leave all fields empty.
3. Assert button `Next: Add content` is **disabled**.

### NG-02: No content added — cannot reach Add users step

1. Complete Step 1 (fill all required fields → `Next: Add content`).
2. On Step 2, add no content.
3. Assert button `Next: Add users and audiences` is **disabled**.

### NG-03: Users picker opened but no user selected — cannot notify

1. Complete Steps 1–2 (with java content).
2. Click `Next: Add users and audiences`.
3. Click **Add users and audiences**, then **Done** without selecting any user.
4. Assert button `Next: Notify users` is **disabled** (or `Done` in the dialog is disabled before selection).

### NG-04: User search returns no results

1. Complete Steps 1–2.
2. Click `Next: Add users and audiences` → open picker.
3. In **Search for users**, type a non-existent user (e.g. `__no_such_user_zzzz__`) → Enter.
4. Assert zero **Select or deselect item** buttons in the dialog.

### NG-05: Force order is disabled / gated until content is added

1. Complete Step 1; click `Next: Add content`.
2. Before adding any content, assert Force order checkbox is **disabled** or not yet visible.
3. Add one content item (java → first result).
4. Assert Force order checkbox becomes **enabled**.

---

## Automation mapping (framework conventions)

Per [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc):

1. **Import** `test` / `expect` from `fixtures/loginFixture` (or `fixtures/allureFixtures`).
2. **Page objects:** use existing [`pageObjects/Assignments/AssignmentsPage.page.ts`](../pageObjects/Assignments/AssignmentsPage.page.ts) and [`pageObjects/Assignments/CreateAssignmentWizard.page.ts`](../pageObjects/Assignments/CreateAssignmentWizard.page.ts); extend for new steps rather than putting raw locators in specs.
3. **AllureReporter.step** wraps every meaningful business action.
4. **Locators:** `getByRole` → `getByLabel` → `getByText` → `data-marker` (Force order checkbox).
5. **No `waitForTimeout` / `networkidle`** — rely on `expect(...).toBeVisible()` / `toBeEnabled()` with timeouts.
6. **`storageState: { cookies: [], origins: [] }`** in `test.use(...)` to force fresh UI login.
7. Reference spec: [`tests/Assignments/assignmentCreate.spec.ts`](../tests/Assignments/assignmentCreate.spec.ts) — implements HP-01 and NG-01–NG-05 for this exact flow; prefer extending rather than duplicating.

---

## Exit criteria

- HP-01 passes on ucm-manual3-aws: java first result, adminsw user, Force order checked, launch success confirmed.
- NG-01 to NG-05 show correct blocking / validation behavior.
- No unexpected console errors or network failures during launch.
