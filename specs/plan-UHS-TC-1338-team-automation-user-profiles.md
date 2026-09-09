# Test plan: UHS-TC-1338 — Team automation rules & user profile fields (create audience)

**Qmetry:** `UHS-TC-1338` — _Test that the API for user profiles is integrated correctly in the create audience feature._

**App:** Set `UCM_MANUAL3_AWS_BASE_URL` (e.g. `https://ucm-manual3-aws.example.com/`) — overrides default manual3-aws host in [`tests/ucm-manual3-aws/manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts).

**Automation prerequisites:** [`entry-and-login.spec.ts`](../tests/ucm-manual3-aws/entry-and-login.spec.ts), [`manual3Auth.ts`](../tests/ucm-manual3-aws/manual3Auth.ts), [`audienceNavigation.ts`](../tests/ucm-manual3-aws/audienceNavigation.ts).

**Optional deep link:** If the team automation rule UI has a stable URL after manual discovery, set `UCM_MANUAL3_TEAM_AUTOMATION_GOTO` (path, hash, or full URL — same pattern as `UCM_MANUAL3_AUDIENCES_GOTO` in the create-audience plan).

---

## A. Login

Same contract as [`plan-ucm-manual3-aws-create-audience.md`](plan-ucm-manual3-aws-create-audience.md) §A — `loginAsManual3Admin`, `#learningMainMenu` visible.

---

## B. Navigate to Audiences (admin)

Same as create-audience plan §B — `goToAudiencesList`, or direct `UCM_MANUAL3_AUDIENCES_GOTO`.

---

## C. Reach team automation rule UI (create / edit path)

**Starting state:** Audiences list.

| Step | Action                                                                                                                                                          | Expected                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| C1   | Open **Create audience** (or edit an existing audience if rules only appear there).                                                                             | Create/edit shell loads.                                         |
| C2   | Advance through wizard sections/tabs until **team automation rule** (or equivalent) is available — labels may include _Automation_, _Rules_, _Team automation_. | Rule builder or add-rule control visible.                        |
| C3   | Open **add rule** / **new automation rule** if required.                                                                                                        | Condition/value controls including user profile field dropdowns. |

**Note:** Exact navigation varies by tenant. Prefer `UCM_MANUAL3_TEAM_AUTOMATION_GOTO` once discovered via headed `codegen` or manual copy of the address bar.

---

## D. Qmetry scenario coverage

### D1 — User profile fields in dropdown

| Step | Action                                                                                                             | Expected                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1    | Open the dropdown that selects **user profile** / attribute for a team automation rule (when creating or editing). | **Direct Manager**, **Percipio Role**, and **Job Title** appear as selectable user profile fields. |

### D2 — Create rule with valid profile values

| Step | Action                                                                                                                       | Expected                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 2    | Create a new team automation rule; choose valid values from Direct Manager, Percipio Role, and Job Title (as the UI allows). | Rule is created without error. |

### D3 — Verify created rule

| Step | Action                                            | Expected                                           |
| ---- | ------------------------------------------------- | -------------------------------------------------- |
| 3    | Inspect saved rule (list, summary, or edit view). | Rule shows the selected user profile field values. |

### D4 — Edit rule

| Step | Action                                              | Expected       |
| ---- | --------------------------------------------------- | -------------- |
| 4    | Edit the rule and change user profile field values. | Save succeeds. |

### D5 — Verify edited rule

| Step | Action                    | Expected                                     |
| ---- | ------------------------- | -------------------------------------------- |
| 5    | Re-open or view the rule. | Updated user profile field values are shown. |

---

## E. Automation file

[`tests/ucm-manual3-aws/team-automation-rule-user-profiles.spec.ts`](../tests/ucm-manual3-aws/team-automation-rule-user-profiles.spec.ts)

---

## Assumptions

- Admin credentials in `config/<NODE_ENV>.json` → `frontend` can access Audiences and audience automation rules.
- Labels **Direct Manager**, **Percipio Role**, **Job Title** match UI copy (case-insensitive / partial match in tests).
