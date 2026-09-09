# API Test Plan — SelfRegistration

Generated: 2026-05-27

---

## Service Config

- **develop.json key:** `"selfRegistration"`
- **Base URL:** `https://self-registration.develop.squads-dev.com` (from `envVars["selfRegistration"].url`)
- **Auth:** Basic auth — `ping:Pong321!` (pre-encoded token in `develop.json`)
- **Mailhog URL:** `http://mailhog.develop.squads-dev.com` (from `envVars["mailhog"].url`)
- **Test email:** `test@mailhog.local`

---

## Endpoint Inventory (26 total)

| # | Method | Path | Group | Testable |
|---|--------|------|-------|----------|
| 1 | POST | `/api/registrations` | registration | ✅ isolated + flow |
| 2 | POST | `/api/registrations/{registrationUuid}/otp/{code}/validate` | registration | ✅ flow |
| 3 | POST | `/api/registrations/{registrationUuid}/save-user` | registration | ✅ flow |
| 4 | POST | `/api/registrations/{registrationUuid}/otp/resend` | registration | ✅ flow |
| 5 | GET  | `/api/registrations/{registrationUuid}/fetch-user-status` | registration | ✅ flow |
| 6 | POST | `/api/registrations/{registrationUuid}/send-otp-email` | registration | ✅ flow |
| 7 | POST | `/api/registrations/fetch-registered-users-for-approval` | registration | ✅ isolated |
| 8 | PUT  | `/api/registrations/approve-pending-registered-users` | registration | ✅ flow (needs pending reg) |
| 9 | PUT  | `/api/registrations/approve-registered-user-with-update` | registration | ✅ flow (needs pending reg) |
| 10 | PUT | `/api/registrations/reject-pending-registration-users` | registration | ✅ flow (needs pending reg) |
| 11 | PUT | `/api/registrations/bulk-update-custom-attribute-values` | registration | ✅ isolated |
| 12 | POST | `/api/v2/site-shutdown/sync/shutdown` | site-shutdown | ⛔ SKIP |
| 13 | POST | `/api/users/{userUuid}/otp/{featureType}/generate` | otp-integration | ✅ flow |
| 14 | POST | `/api/users/{userUuid}/otp/{featureType}/validate` | otp-integration | ✅ flow |
| 15 | POST | `/api/users/{userUuid}/otp/{featureType}/verify-email` | otp-integration | ✅ flow |
| 16 | GET  | `/api/organizations/{organizationUuid}/config` | organizations | ✅ isolated |
| 17 | POST | `/api/organizations/{organizationUuid}/config` | organizations | ✅ isolated |
| 18 | DELETE | `/api/organizations/{organizationUuid}/custom-attributes/{customAttributeUuid}` | organizations | ✅ flow |
| 19 | GET | `/api/public/health/v1/ping` | public | ✅ isolated |
| 20 | GET | `/api/public/build_version` | public | ✅ isolated |
| 21 | GET | `/api/health/v1/local` | health | ✅ isolated |
| 22 | GET | `/api/health/v1/remote` | health | ✅ isolated |
| 23 | GET | `/api/health/v1/all` | health | ✅ isolated |
| 24 | GET | `/api/health/v1/auth/basic` | health | ✅ isolated |
| 25 | GET | `/api/audit-mesgs` | audit | ✅ isolated |
| 26 | POST | `/api/audit-mesgs/ack/id/{audit_id}/seq/{seq}` | audit | ⚠ needs real auditId |

---

## Flows (serial execution — `test.describe.serial`)

### Flow 1: UserRegistration

**File:** `tests/tests-api/flows/selfRegistration.flow.userRegistration.spec.ts`

```
Step 1: POST /api/registrations
  Payload: insertPayload({ organizationUuid: orgId, email: "test@mailhog.local" })
  Capture: registrationUuid ← from response body

Step 2: GET /api/registrations/{registrationUuid}/fetch-user-status
  Depends on: registrationUuid (Step 1)
  Assert: status 200

Step 3: POST /api/registrations/{registrationUuid}/otp/resend
  Depends on: registrationUuid (Step 1)
  Assert: status 200

Step 4: POST /api/registrations/{registrationUuid}/send-otp-email
  Depends on: registrationUuid (Step 1)
  Payload: sendOtpEmailPayload({ organizationUuid: orgId, email: "test@mailhog.local" })
  Assert: status 200

Step 5: Read OTP from Mailhog
  const mailhog = MailhogClient.fromEnv();
  const msg = await mailhog.waitForEmail("test@mailhog.local");
  const otp = mailhog.extractOtp(msg);
  ⚠ The OTP goes into the URL path, NOT the body:
    → client.validateOtp(registrationUuid, otp, validateOtpPayload({ organizationUuid: orgId }))
  Note: Mailhog clears entire inbox — run with --workers 1

Step 6: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  ⚠ code = otp from Step 5 — injected as URL path parameter, not body field
  Depends on: registrationUuid (Step 1), otp (Step 5)
  Payload: validateOtpPayload({ organizationUuid: orgId })
  Assert: status 200

Step 7: POST /api/registrations/{registrationUuid}/save-user
  Depends on: registrationUuid (Step 1), OTP validated in Step 6
  Payload: saveUserPayload()   ← empty body
  Assert: status 200
```

**Shared state pattern:**
```typescript
let registrationUuid: string;
// Captured: registrationUuid = body.registrationUuid ?? body.id
```

---

### Flow 2: AdminApproval

**File:** `tests/tests-api/flows/selfRegistration.flow.adminApproval.spec.ts`

```
beforeAll Step A: POST /api/registrations
  Payload: insertPayload({ organizationUuid: orgId, email: "test@mailhog.local" })
  Capture: pendingRegistrationUuid ← for use in approval/rejection tests

Step 1: POST /api/registrations/fetch-registered-users-for-approval
  Payload: fetchRegisteredUsersforapprovalPayload({ organizationUuid: orgId })
  Assert: status 200, body contains registration list

Step 2: PUT /api/registrations/approve-pending-registered-users
  Payload: approvePendingRegisteredUsersPayload({ organizationUuid: orgId, registrationUuids: [pendingRegistrationUuid] })
  Assert: status 200

  [Create second pending registration for rejection test]

Step 3: beforeAll Step B — create second registration
  Capture: rejectRegistrationUuid

Step 4: PUT /api/registrations/reject-pending-registration-users
  Payload: rejectUserRegistrationPayload({ organizationUuid: orgId, registrationUuids: [rejectRegistrationUuid] })
  Assert: status 200

Step 5: PUT /api/registrations/approve-registered-user-with-update
  Payload: approveRegisteredUserWithUpdateRequestPayload({ organizationUuid: orgId })
  Assert: status 200
```

---

### Flow 3: UserOtp (EMAIL_CHANGE)

**File:** `tests/tests-api/flows/selfRegistration.flow.userOtp.spec.ts`

```
beforeAll: Create a user via organizations-api
  import { createUserRequest } from "../../helper/api/payloads/createUserPayload";
  import { roles } from "../../helper/api/roles";
  import { urlData } from "../../helper/api/urls";

  const orgConfig = envVars["organizations-api"] as { url: string; token: string };
  const res = await apiContext.post(
    urlData.createUserUrl(orgId, orgConfig),
    { headers: headerData.basicAuth({ token: orgConfig.token }),
      data: createUserRequest(roles.learner, null, "TestPassword123!", false, false, false) }
  );
  expect(res.status()).toBe(200);
  userUuid = (await res.json()).id;

Step 1: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate
  Payload: generateOtpPayload({ organizationUuid: orgId })
  Assert: status 204
  → Triggers OTP email to the user's email address

Step 2: Read OTP from Mailhog
  const mailhog = MailhogClient.fromEnv();
  const msg = await mailhog.waitForEmail(testUserEmail);
  const otp = mailhog.extractOtp(msg);

Step 3: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate
  Payload: validateOTPPayload({ organizationUuid: orgId, otp })
  Assert: status 204

Step 4: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/verify-email
  Payload: verifyEmailPayload()
  Assert: status 200
```

**Shared state:**
```typescript
let userUuid: string;
let testUserEmail: string;  // captured when creating the user in beforeAll
```

---

### Flow 4: DeleteCustomAttribute

**File:** inline in `selfRegistration.spec.ts` (organizations group)

```
beforeAll extension: After orgId is resolved:
  const upsertRes = await client.upsert(orgId, upsertPayload({
    customAttributes: [{ name: "audit-test-attr", type: "TEXT" }]
  }));
  customAttributeUuid = upsertRes.body?.customAttributes?.[0]?.uuid;

Step: DELETE /api/organizations/{orgId}/custom-attributes/{customAttributeUuid}
  Assert: status 200
```

> **Note:** The `customAttributeUuid` field shape in the upsert response needs to be confirmed. If the config endpoint doesn't return UUIDs in its response, query `GET /api/organizations/{orgId}/config` after upsert to extract the created attribute's UUID.

---

## Isolated Endpoints (no dependencies)

These need only `orgId` and the Basic auth client. Test them in `selfRegistration.spec.ts`:

| Endpoint | Method | Expected status | Notes |
|---|---|---|---|
| `/api/registrations/fetch-registered-users-for-approval` | POST | 200 | No pending registrations required |
| `/api/registrations/bulk-update-custom-attribute-values` | PUT | 200 or 400 | Empty array body accepted |
| `/api/organizations/{orgId}/config` | GET | 200 | Config may not exist yet — 404 acceptable |
| `/api/organizations/{orgId}/config` | POST | 200 | True upsert — always 200 |
| `/api/public/health/v1/ping` | GET | 200 | No auth required |
| `/api/public/build_version` | GET | 200 | No auth required |
| `/api/health/v1/local` | GET | 200 | Basic auth |
| `/api/health/v1/remote` | GET | 200 | Basic auth |
| `/api/health/v1/all` | GET | 200 | Basic auth |
| `/api/health/v1/auth/basic` | GET | 200 | Basic auth test endpoint |
| `/api/audit-mesgs` | GET | 200 | Returns empty list if no audits |

---

## Skipped Endpoints

| Endpoint | Reason |
|---|---|
| `POST /api/v2/site-shutdown/sync/shutdown` | Irreversible side effect — shuts down self-registration for the org. **Do not test in shared dev environment.** |
| `POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}` | Requires real audit message IDs with matching sequence numbers. No way to create them via this API. Mark as `test.skip` with comment. |

---

## beforeAll Setup Summary (selfRegistration.spec.ts)

```typescript
test.beforeAll("Authenticate + resolve org", async () => {
  apiContext = await playwrightRequest.newContext();
  const envVars = APIClient.getEnvVariables();

  // 1. Resolve orgId from frontend domain (existing pattern)
  const frontendUrl = (envVars["frontend"] as { url: string }).url;
  const domain = frontendUrl.match(/https:\/\/([^.]+)\./)?.[1]!;
  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  const apiClient = new APIClient();
  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);

  // 2. Create selfRegistration client (Basic auth)
  client = await SelfRegistrationClient.create(apiContext);
});
```

---

## Mailhog Config

- **URL:** `http://mailhog.develop.squads-dev.com` (auto-loaded via `MailhogClient.fromEnv()`)
- **Test email (registration flows):** `test@mailhog.local`
- **User email (UserOtp flow):** captured dynamically from the created user's `email` field
- **⚠ Important:** Mailhog `delete` API clears the entire inbox. Run flow tests with `--workers 1` to prevent race conditions.

---

## Auth Notes

| Endpoint group | Auth used | Implementation |
|---|---|---|
| All service endpoints | Basic auth `ping:Pong321!` | `headerData.basicAuth({ token })` in `SelfRegistrationClient` |
| `/api/public/*` | No auth | 200 regardless of token — tests correctly allow `[200, 401, 403]` |
| organizations-api (for user creation) | Basic auth `ping:Pong321!` | Use `envVars["organizations-api"].token` directly |

---

## TODOs in Existing Generated Files

The following `TODO` comments in the generated `selfRegistration.spec.ts` must be resolved:

| File | TODO | Resolution |
|---|---|---|
| `selfRegistration.spec.ts:104` | `TODO: replace with real registrationUuid` in `validateOtp` | Move to flow file; capture from `POST /api/registrations` |
| `selfRegistration.spec.ts:138` | `TODO: replace with real registrationUuid` in `saveUser` | Same |
| `selfRegistration.spec.ts:178` | `TODO: replace with real registrationUuid` in `resendOtp` | Same |
| `selfRegistration.spec.ts:212` | `TODO: replace with real registrationUuid` in `fetchUserStatus` | Same |
| `selfRegistration.spec.ts:252` | `TODO: replace with real registrationUuid` in `sendOtpEmail` | Same |
| `selfRegistration.spec.ts:473` | `TODO: replace with real userUuid` in `generateOtp` | Move to UserOtp flow; create user in beforeAll |
| `selfRegistration.spec.ts:508` | `TODO: replace with real userUuid` in `validateOTP` | Same |
| `selfRegistration.spec.ts:543` | `TODO: replace with real userUuid` in `verifyEmail` | Same |
| `selfRegistration.spec.ts:657` | `TODO: replace with real customAttributeUuid` | Create attribute in beforeAll via POST config |

---

## Run Commands

```bash
# Isolated endpoint tests (fast, no flows)
npx playwright test -c playwright.api.config.ts tests/tests-api/selfRegistration.spec.ts

# Registration flow (must run single-worker — Mailhog inbox is shared)
npx playwright test -c playwright.api.config.ts tests/tests-api/flows/selfRegistration.flow.userRegistration.spec.ts --workers 1

# Admin approval flow
npx playwright test -c playwright.api.config.ts tests/tests-api/flows/selfRegistration.flow.adminApproval.spec.ts --workers 1

# User OTP flow
npx playwright test -c playwright.api.config.ts tests/tests-api/flows/selfRegistration.flow.userOtp.spec.ts --workers 1

# All selfRegistration tests
npx playwright test -c playwright.api.config.ts --grep "SelfRegistration" --workers 1
```
