# Test Plan: Admin → Users → Audience Management → Create Audience (Individual Users)

This plan follows [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc) and
[`.github/agents/playwright-test-planner.agent.md`](../.github/agents/playwright-test-planner.agent.md).

Exploration grounded in:
- Live MCP snapshots (`.playwright-mcp/page-2026-04-29T08-16-55-580Z.yml` — ucm-manual3-aws login)
- Admin dashboard snapshot (`.playwright-mcp/page-2026-04-29T08-19-13-750Z.yml`) confirming nav structure
- Existing automation: [`tests/ucm-manual3-aws/create-audience.spec.ts`](../tests/ucm-manual3-aws/create-audience.spec.ts), [`tests/ucm-manual3-aws/audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts), [`tests/ucm-manual3-aws/audience-management-navigation.spec.ts`](../tests/ucm-manual3-aws/audience-management-navigation.spec.ts)

---

## Target environment

| Item | Value |
| ---- | ----- |
| **App URL** | `https://ucm-manual3-aws.front.develop.squads-dev.com/` |
| **Override env var** | `UCM_MANUAL3_AWS_BASE_URL` (see [`tests/ucm-manual3-aws/manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts)) |
| **Nav override** | `UCM_MANUAL3_AUDIENCES_GOTO` — set to `/admin/audiences` to skip Site Navigation (see [`audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts)) |
| **Seed** | [`seed.spec.ts`](../seed.spec.ts) — `lognToPageFixture` scaffold |

Credentials from `config/<NODE_ENV>.json` → `frontend.basicUser` / `frontend.basicPassword`.

---

## Live exploration notes

### Login — ucm-manual3-aws (confirmed from snapshot `08-16-55-580Z`)

- Base URL redirects to `/login?state=%2F#/`.
- Landing: heading **Let's get started!**, two entry paths:
  - SSO path: button **Log in** → corporate credentials
  - Percipio path: link **Alternatively, login with your Percipio credentials** → `#/classic` → textbox **Email or login name** → **Next** → **Password** → **Log in**
- Handle all dialogs: `page.on('dialog', d => d.accept())`.
- Post-login shell assertion: `#learningMainMenu` visible (see `expectManual3LoggedInShell` in [`manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts)).

### Admin home (confirmed from snapshot `08-19-13-750Z`)

- Post-login heading: **Welcome, Default! Ready to shape learning excellence?**
- **My Quick Links** (on My Dashboard `<main>`): includes link **Audience Management** → `/admin/audiences`
- **Site Navigation** (top-right button, `[expanded]` when open) → flyout contains:
  - button **Switch to my learner view**
  - `navigation` (first region — main menu): items include **My Dashboard**, **Library**, **Analytics**, **Emails & Notifications**, **Users** *(expandable button)*, **Content**, **Learning**, **Compliance**, **Site Settings**, **Explore**, **AI Assistant**
  - `navigation "settings and help"`: My Settings, Help, Log Out

### Navigation path: Site Navigation → Users → Audience Management

- Click **Site Navigation** button in header.
- In the flyout's first `navigation` region, locate button **Users** (expandable) — it is an accordion/toggle, not a direct link.
- Click **Users** to expand → child links appear; click **Audience Management**.
- Expected URL: contains `/admin/audiences`.
- Automation already implemented in [`audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts) → `goToAudienceManagementViaSiteNav`.

### Audience Management list page (`/admin/audiences`)

- Page `<main>` loads with audience list or empty state.
- Primary action button/link: matches `/^(create|add)(\s+an?)?\s+audience/i` or `/new audience/i`.
- Search/filter control may be present for existing audiences.

### Create Audience flow (exploratory — confirm labels on first run)

The create audience form/wizard is expected based on API payload structure ([`createAudiencePayload.ts`](../helper/api/payloads/createAudiencePayload.ts)):
- **Audience name** — required text field (`audienceName` in API)
- **Audience type** — the UI likely offers:
  - *Rule-based*: filter by custom attributes / metadata
  - *Individual users*: manually add users by search (`additionalUserUuids` in API)
- **Individual users path**: search control → find users by name/login → select 2 → confirm
- **Save / Create** — final action; confirms and redirects to list or detail page

> Labels such as "Individual users", "Add users", or "Manually add users" are product-defined — verify on first run against this tenant and update this plan accordingly.

---

## Preconditions

- Admin account with audience management permissions available in `config/<NODE_ENV>.json`.
- At least **2 searchable users** exist in the ucm-manual3-aws tenant (any user name works — tester confirms on run).
- No partial create-audience flow in progress; fresh browser session / cleared storage.
- Starting state: logged-out unless a scenario states otherwise.

---

## Happy path

### HP-01: Create audience with 2 individual users via Site Navigation

**Goal:** Confirm an admin can create a new audience by adding 2 individual users from the Audience Management page.

**Assumptions:** Fresh browser session; admin credentials from `lognToPageFixture` / `loginAsManual3Admin`; dialog handler registered.

#### §A — Login

1. Open `https://ucm-manual3-aws.front.develop.squads-dev.com/`.
2. Register `page.on('dialog', d => d.accept())`.
3. Click **Alternatively, login with your Percipio credentials** → enter **Email or login name** → **Next** → enter **Password** → **Log in**.
4. Assert `#learningMainMenu` is visible (admin shell ready).

#### §B — Navigate to Audience Management (Site Navigation path)

5. Click button **Site Navigation** in the header.
6. In the first `navigation` region (flyout), click button **Users** to expand it.
7. Click link **Audience Management** inside the expanded Users section.
8. Assert URL contains `/admin/audiences`.
9. Assert `<main>` is visible (list or empty state).

#### §C — Open Create Audience

10. Click the create/add control (matches `/^(create|add)(\s+an?)?\s+audience/i` or `/new audience/i`).
11. Assert create form / modal / wizard opens.

#### §D — Enter audience details

12. Fill **Audience name** field with a unique name (e.g. `E2E Audience Individual ${Date.now()}`).
13. If an audience type selector is shown, select the option corresponding to **Individual users** (label TBC on first run — e.g. "Individual users", "Manually add users").
14. Assert the individual users section / user search control becomes visible.

#### §E — Add 2 users

15. In the **Search users** / **Add users** control, type the first user's name or login and submit (Enter or search button).
16. Assert at least one result row appears.
17. Select the first result (e.g. click **Select** / **Add** / **Select or deselect item** button for that user).
18. Repeat steps 15–17 for a second user (different search or pick second result if multiple appear).
19. Assert the selected users section / counter shows **2 users** selected.

#### §F — Save / Create

20. Click **Save** / **Create** / **Done** / **Finish** button (label TBC; last primary action button in form scope).
21. Assert form/modal closes or page navigates back to the audience list or audience detail.
22. Assert the new audience name appears in the list or detail heading.

**Success criteria:** Steps 21–22 pass; audience is visible with the unique name.  
**Failure conditions:** Cannot open create form; audience type selector absent or mismatched; user search returns no results; save blocked by validation; audience not visible after save.

---

### HP-02: Create audience via My Dashboard → My Quick Links (alternate navigation)

**Same §D–F as HP-01**, but navigation step differs:

1. Complete §A.
2. After login, from **My Dashboard**, click **Audience Management** under **My Quick Links** (link in `<main>`, URL `/admin/audiences`).
3. Continue from §C onward.

**Expected Result:** Same outcome as HP-01.

---

## Negative scenarios

### NG-01: Cannot save audience with empty name

1. Open create audience form (§A–C).
2. Leave **Audience name** blank.
3. Attempt to save.
4. **Expected:** Save button remains disabled **or** inline validation appears (text matching `/required|enter.*name|cannot be empty/i`); audience is not created.

### NG-02: Cannot save audience with no users selected (individual users type)

1. Open create audience form (§A–C).
2. Fill **Audience name**; select individual-users type.
3. Add no users; attempt to save.
4. **Expected:** Save is blocked or validation requires at least one user.

### NG-03: User search returns no results

1. Open create audience form; navigate to user search.
2. Search for a non-existent user string (e.g. `__no_such_user_zzzz__`).
3. **Expected:** Empty results state with no-match message; no user added.

### NG-04: Duplicate audience name

1. Create an audience with a known name (from a prior run or seeded data).
2. Open create audience form again; enter the same name; attempt to save.
3. **Expected:** Error or validation message about duplicate name (behavior is product-defined — update if no duplicate check exists).

### NG-05: Unauthenticated direct URL access

1. Open a fresh browser context (no session).
2. Navigate directly to `https://ucm-manual3-aws.front.develop.squads-dev.com/admin/audiences`.
3. **Expected:** Redirect to `/login`; audience management page not accessible.

---

## Automation mapping (framework conventions)

Per [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc):

1. **Import** `test` / `expect` from `fixtures/loginFixture`; use `loginAsManual3Admin` from [`manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts) for login.
2. **Navigation helper** already in [`audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts):
   - `goToAudienceManagementViaSiteNav(page, cfg)` — Site Navigation → Users → Audience Management
   - `goToAudienceManagementViaQuickLinks(page, cfg)` — My Dashboard → My Quick Links
   - `goToAudiencesList(page, cfg)` — alias for site nav path
3. **Page objects:** new audience creation steps should be extracted into a page object (e.g. `pageObjects/Audiences/CreateAudiencePage.page.ts`) extending [`pageObjects/base/BasePage.ts`](../pageObjects/base/BasePage.ts). Keep all locator logic out of spec files.
4. **AllureReporter.step** wraps each business action (login, navigate, open create, fill name, add users, save, assert).
5. **Locators (priority order):** `getByRole` → `getByLabel` → `getByText` → `getByPlaceholder`. Avoid brittle CSS/XPath.
6. **No `waitForTimeout` / `networkidle`** — use `expect(...).toBeVisible()` / `toBeEnabled()` with explicit timeouts.
7. **`storageState: { cookies: [], origins: [] }`** via `test.use(...)` to ensure fresh UI login.
8. **Allure metadata** via `allure.epic("UCM")`, `allure.feature("Admin — Audience Management")`, `allure.tag("manual3-aws")` (see `audience-management-navigation.spec.ts` for reference).
9. **Reference spec** (basic create): [`tests/ucm-manual3-aws/create-audience.spec.ts`](../tests/ucm-manual3-aws/create-audience.spec.ts) — extend rather than duplicate.

### Suggested new page object methods

```typescript
// pageObjects/Audiences/CreateAudiencePage.page.ts
async openCreateAudience(): Promise<void>
async fillAudienceName(name: string): Promise<void>
async selectIndividualUsersType(): Promise<void>
async searchAndAddUser(loginOrName: string): Promise<void>
async saveAudience(): Promise<void>
async expectAudienceVisible(name: string): Promise<void>
```

### Locator hints (confirm on first live run)

| Control | Suggested locator |
|---------|-------------------|
| Create button | `getByRole("button", { name: /^(create\|add)(\s+an?)?\s+audience/i })` or `getByRole("link", { … })` |
| Audience name field | `getByLabel(/audience name\|^name$/i)` or `getByPlaceholder(/audience\|name/i)` |
| Individual users type | `getByRole("radio", { name: /individual users/i })` or `getByRole("button", { name: /individual users/i })` |
| User search | `getByRole("searchbox")` or `getByPlaceholder(/search.*user/i)` |
| Select user button | `getByRole("button", { name: /select or deselect item/i }).first()` |
| Save button | `getByRole("button", { name: /^(save\|create\|done\|finish)$/i }).last()` |

---

## Exit criteria

- HP-01 passes on ucm-manual3-aws: audience created with unique name and 2 individual users; visible in list after save.
- HP-02 (Quick Links nav) reaches the same page and outcome.
- NG-01 to NG-05 show correct blocking, validation, or redirect behavior.
- Locator hints confirmed or updated from first live run.
- No unhandled console errors or network failures during the create flow.
