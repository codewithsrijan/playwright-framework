# Test plan: Admin view → Users → Audience Management

**Planner workflow:** [`.github/agents/playwright-test-planner.agent.md`](../.github/agents/playwright-test-planner.agent.md)  
**Related rules:** [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc)

**App:** `UCM_MANUAL3_AWS_BASE_URL` or default `https://ucm-manual3-aws.front.develop.squads-dev.com/` (see [`tests/ucm-manual3-aws/manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts)).

---

## Exploration summary (ucm-manual3-aws)

Per [`.github/agents/playwright-test-planner.agent.md`](../.github/agents/playwright-test-planner.agent.md): map **admin** navigation, identify interactive controls and routes, and record **assumptions**, **success/failure**, and **evidence** (below).

Exploration was performed on the **manual3-aws** host using an **organization admin**: **Percipio credentials** (link **Alternatively, login with your Percipio credentials** → email/username → **Next** → password → **Log in**), not corporate SSO-only.

**Verified flow — Admin view → Users → Audience Management**

1. **Post-login landing:** Session opens **`/admin/dashboard-home`** (**My Dashboard**), consistent with an admin org shell (not learner-only navigation).
2. **Admin chrome:** Header includes **Site Navigation** and **Skillsoft apps**; opening **Site Navigation** shows **Switch to my learner view** (confirms an admin view is active).
3. **Primary path (flyout):** **Site Navigation** → left flyout **main menu** (first `navigation` region) → **Users** is an expandable **button** (often collapsed) → expand **Users** → choose link **Audience Management** → URL includes **`/admin/audiences`**.
4. **Alternate path (same app route):** On **My Dashboard**, **My Quick Links** includes **Audience Management** → same **`/admin/audiences`** destination as (3).
5. **Labeling:** Use **Audience Management** in selectors; a flyout link named only **Audiences** may not exist (prior automation timed out expecting `/audiences/` text alone).
6. Take the screenshot after audience management page is confirmed

**Screenshot coverage (this plan update uses only existing repo assets under `specs/assets/` — no new files added):**

| Plan steps                            | Evidence                                                                                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| §A (login shell)                      | **01** — Percipio login landing before credentials                                                                                                                                                                 |
| §B / §C-alt (admin home + quick link) | **02** — **My Quick Links** includes **Audience Management**                                                                                                                                                       |
| §C1–C3 (flyout + **Users**)           | **03** — **Site Navigation** open, **Users** visible in main menu                                                                                                                                                  |
| §C4–C5, §D (destination page)         | Described by URL **`/admin/audiences`** and automation in §G; optional extra stills (**Users** expanded, list page) may be added later under the same asset folder **without changing this plan file’s structure** |

**Screenshots** (repository assets):

| #   | File                                                                                                                              | What it shows                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 01  | [`01-percipio-login-landing.png`](assets/plan-admin-view-users-audience-management/01-percipio-login-landing.png)                 | Percipio login landing (“Let’s get started!”) before Percipio-credentials sign-in                |
| 02  | [`02-admin-dashboard-my-quick-links.png`](assets/plan-admin-view-users-audience-management/02-admin-dashboard-my-quick-links.png) | Admin **My Dashboard** with **My Quick Links** (includes **Audience Management**)                |
| 03  | [`03-site-navigation-flyout-users.png`](assets/plan-admin-view-users-audience-management/03-site-navigation-flyout-users.png)     | **Site Navigation** flyout: **Users** (expandable), **Switch to my learner view**, and main menu |

### Figure — Login landing (§A)

![Percipio login landing — manual3-aws](assets/plan-admin-view-users-audience-management/01-percipio-login-landing.png)

### Figure — Admin dashboard and quick link (§B / §C-alt)

![Admin My Dashboard — My Quick Links with Audience Management](assets/plan-admin-view-users-audience-management/02-admin-dashboard-my-quick-links.png)

### Figure — Site Navigation flyout — Users (§C)

![Site Navigation open — Users section visible](assets/plan-admin-view-users-audience-management/03-site-navigation-flyout-users.png)

---

## Assumptions

- Tester uses an **organization admin** account (`config/<NODE_ENV>.json` → `frontend` credentials).
- Starting state is **no session** unless a scenario says otherwise.
- Audience list URL pattern on manual3-aws includes **`/admin/audiences`** (SPA may use hash; confirm in the address bar).

---

## A. Login

**Starting state:** Browser has no Percipio session.

| Step | Action                                                                                                                                                                                                                                                                                                | Expected                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| A1   | Open base URL.                                                                                                                                                                                                                                                                                        | Redirect to login; URL matches `/login` (case-insensitive).                  |
| A2   | Use **Alternatively, login with your Percipio credentials** when that path is shown. Enter **email/username** → **Next** → **Password** → **Log in** (see [`entry-and-login.spec.ts`](../tests/ucm-manual3-aws/entry-and-login.spec.ts) and [`LoginPage.page.ts`](../pageObjects/LoginPage.page.ts)). | Authenticated; URL moves off `/login` `#/classic` stuck state.               |
| A3   | Wait for main shell.                                                                                                                                                                                                                                                                                  | `#learningMainMenu` visible (same contract as `expectManual3LoggedInShell`). |

**Success:** Logged-in Percipio shell (typically **`/admin/...`** for this admin user).  
**Failure:** SSO/credential errors, infinite login, missing main menu.

---

## B. Admin view (not learner-only)

**Starting state:** Logged in.

| Step | Action                                                                                                      | Expected                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| B1   | Confirm **admin** context.                                                                                  | **Site Navigation** in header; flyout shows **Switch to my learner view** (admin is active). |
| B2   | If you only see learner navigation, switch via **Skillsoft apps** / experience switcher (**label varies**). | Admin dashboard or **`/admin/dashboard-home`**.                                              |

**Success:** Admin UI with **Site Navigation** available.  
**Failure:** No admin entry (role or tenant).

---

## C. Navigate: Site Navigation → Users → Audience Management

**Starting state:** Admin shell (section B satisfied).

| Step | Action                                                                                                                                       | Expected                                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| C1   | Click **Site Navigation** (header).                                                                                                          | Flyout opens; **Main menu** / **Users** visible (see screenshot 03). |
| C2   | Locate **Users** (expandable **button** **Users**) in the flyout **main menu** (first `navigation` region—not duplicate controls elsewhere). | **Users** visible in the flyout.                                     |
| C3   | Expand **Users** if collapsed.                                                                                                               | Child links include **Audience Management** (confirm on build).      |
| C4   | Click **Audience Management**.                                                                                                               | URL contains **`/admin/audiences`**.                                 |
| C5   | Wait for main content.                                                                                                                       | Audience list/grid or empty state; not 5xx/blank shell.              |

**Alternate entry (same destination):**

| Step    | Action                                                                                            | Expected                                 |
| ------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| C-alt-1 | On **My Dashboard**, under **My Quick Links**, click **Audience Management** (see screenshot 02). | Same **`/admin/audiences`** route as C4. |

**Direct URL (automation):**

- Set `UCM_MANUAL3_AUDIENCES_GOTO` to path or full URL (see [`audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts)), e.g. `/admin/audiences`.

**Success:** Audience Management loads with admin chrome.  
**Failure:** 403, 404, or missing nav item.

**Automation note:** Use `getByRole('link', { name: /audience management/i })` or `page.goto` to `/admin/audiences` after login—not a lone `/audiences/` link name in the flyout.

---

## D. Audience Management page — functional checks

**Starting state:** Audience Management page loaded (section C).

| ID  | Scenario        | Steps                                                        | Expected                                         |
| --- | --------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| D1  | Page shell      | Observe heading/title and `<main>`.                          | Clear audience-admin content.                    |
| D2  | Primary action  | Find **Create audience** / **Add audience** (or equivalent). | Visible if role allows.                          |
| D3  | Search / filter | If present, search for a substring.                          | List filters or empty state behaves predictably. |
| D4  | Accessibility   | Tab through header, main, key controls.                      | Focus order logical; controls named.             |

---

## E. Scenario catalog (independent where possible)

### E1 — Happy path: open Audience Management via Users nav

| Step | Instruction                                                         | Expected outcome                                |
| ---- | ------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | Perform §A–B.                                                       | Admin shell.                                    |
| 2    | Perform §C1–C5 (**Site Navigation → Users → Audience Management**). | List loads; URL matches **`/admin/audiences`**. |

### E2 — Happy path: open via My Quick Links

| Step | Instruction                                             | Expected outcome            |
| ---- | ------------------------------------------------------- | --------------------------- |
| 1    | Perform §A–B; land on **My Dashboard**.                 | **My Quick Links** visible. |
| 2    | Click **Audience Management** under **My Quick Links**. | Same page as E1.            |

### E3 — Negative: deep link without auth

| Step | Instruction                            | Expected outcome                                      |
| ---- | -------------------------------------- | ----------------------------------------------------- |
| 1    | Sign out.                              | Session cleared.                                      |
| 2    | Open `/admin/audiences` (or full URL). | Redirect to login or access denied per product rules. |

### E4 — Negative: learner-only user (if available)

| Step | Instruction                            | Expected outcome         |
| ---- | -------------------------------------- | ------------------------ |
| 1    | Log in as a non-admin learner.         | Learner shell.           |
| 2    | Open Audience Management (URL or nav). | No access or nav hidden. |

### E5 — Boundary: empty tenant

| Step | Instruction                                          | Expected outcome                               |
| ---- | ---------------------------------------------------- | ---------------------------------------------- |
| 1    | Open Audience Management as admin with no audiences. | Empty state with guidance; no unhandled error. |

---

## F. Failure conditions (test exit criteria)

- Cannot reach admin view after login (role/configuration).
- **Users** does not expose **Audience Management** (capture actual labels; file defect).
- Audience page returns 5xx or blank `<main>`.
- Create/search errors with no user-visible message.

---

## G. Automation mapping (optional follow-up)

| Area           | Suggested artifact                                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login          | [`tests/ucm-manual3-aws/manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts), [`tests/ucm-manual3-aws/entry-and-login.spec.ts`](../tests/ucm-manual3-aws/entry-and-login.spec.ts)                                      |
| Nav / goto     | [`tests/ucm-manual3-aws/audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts) — `goToAudienceManagementViaSiteNav`, `goToAudienceManagementViaQuickLinks`; `goToAudiencesList` delegates to site-nav path |
| Navigation E2E | [`tests/ucm-manual3-aws/audience-management-navigation.spec.ts`](../tests/ucm-manual3-aws/audience-management-navigation.spec.ts)                                                                                           |
| Audience CRUD  | [`specs/plan-ucm-manual3-aws-create-audience.md`](plan-ucm-manual3-aws-create-audience.md), [`tests/ucm-manual3-aws/create-audience.spec.ts`](../tests/ucm-manual3-aws/create-audience.spec.ts)                             |

---

## H. Planner output

This file is the **saved test plan** for **Admin view → Users → Audience Management**: user journeys (§E), functional checks (§D), failure criteria (§F), and **evidence** via figures **01–03** in `specs/assets/plan-admin-view-users-audience-management/`. Suitable for QA/dev review and for a later **generator** pass per [`.cursor/rules/playwright-agents.mdc`](../.cursor/rules/playwright-agents.mdc).
