---
name: swagger-api-gen
description: "Use this skill when the user wants to generate Playwright API tests from a Swagger/OpenAPI spec. Triggers include: any mention of 'swagger', 'openapi', 'generate api tests', 'api automation', or a swagger UI URL (e.g. /docs/index.html). Also triggers on the slash command /swagger-api-gen. Generates typed TypeScript artifacts — URL builders, payload builders, Zod schemas, service client, and Playwright spec — following the existing ucm-playwright-automation helper/api/ conventions."
---

# swagger-api-gen

Trigger phrase: `/swagger-api-gen`

## Purpose

Automate backend API test generation from a Swagger/OpenAPI spec. Given a service base URL (or direct spec URL), this skill auto-discovers the spec, generates typed TypeScript artifacts following the existing `helper/api/` conventions, and produces Playwright test specs with Zod contract validation for every endpoint.

## Non-Negotiable Rule

If required context is missing or uncertain, STOP and ask the user. Do not hallucinate. For any missing data, ask — never assume.

---

## What Gets Generated

For a given `--service <name>` the following files are created:

| File                                      | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| `helper/api/urls.<service>.ts`            | URL builder functions per endpoint                            |
| `helper/api/payloads/<service>/`          | Request body skeleton builders (POST/PUT/PATCH only)          |
| `helper/api/schemas/<service>.schemas.ts` | Zod schemas for all components + per-operation response types |
| `helper/api/<Service>Client.ts`           | Service client wrapping `APIClient` with token auth           |
| `tests/tests-api/<service>.spec.ts`       | Playwright spec — happy path + 401 + 404 per endpoint         |
| `tests/tests-api/flows/<service>.flow.<flowName>.spec.ts` | **Flow spec** (one per detected chain) — `test.describe.serial` with shared state, Mailhog wiring, and captured IDs passed between steps |

All generated specs use the existing `Reporter` utility, `APIClient.getEnvVariables()` for auth, and `headerData.commonHeaderWithToken()` for request headers — no new dependencies except `zod`.

---

## Org UUID Resolution (Required for Most Endpoints)

Most service endpoints require a real **organization UUID** as a path parameter (e.g. `/api/organizations/{organizationId}/...`). Never use a hardcoded or random UUID — always resolve it at runtime using the existing `APIClient.getOrgDetailsByDomain()` method.

### How it works

`develop.json` (loaded via `APIClient.getEnvVariables()`) has two keys needed for org resolution:

```json
"organizations-api": {
  "url": "https://organization-api.develop.squads-dev.com",
  "token": "<token>"
},
"frontend": {
  "url": "https://plat3-complete.front.develop.squads-dev.com",
  "basicUser": "adminsw",
  "basicPassword": "##knock22"
}
```

The domain is extracted from the **frontend URL** — e.g. `"https://plat3-complete.front.develop.squads-dev.com"` → domain = `"plat3-complete"`.

That domain is passed to `APIClient.getOrgDetailsByDomain()` using the **`organizations-api`** serviceConfig. The method calls:

```
GET {organizations-api.url}/api/organizations/by_domain/{domain}
```

and returns the `id` field (the org UUID string).

### Pattern to use in every generated `beforeAll`

```typescript
import { APIClient } from "../../../helper/api/APIClient";
import { headerData } from "../../../helper/api/headers/headers";

let orgId: string;
let token: string;
let serviceConfig: { url: string; [k: string]: unknown };

test.beforeAll(async ({ request }) => {
  const envVars = APIClient.getEnvVariables();
  serviceConfig = envVars["<service-key>"] as { url: string; token: string };

  // 1. Extract domain from the frontend URL
  const frontendUrl: string = (envVars["frontend"] as { url: string }).url;
  const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  if (!domainMatch)
    throw new Error(`Cannot extract domain from frontend URL: ${frontendUrl}`);
  const domain = domainMatch[1];

  // 2. Resolve real org UUID via organizations-api
  const orgV2Config = envVars["organizations-api"] as {
    url: string;
    token: string;
  };
  const apiClient = new APIClient();
  orgId = await apiClient.getOrgDetailsByDomain(request, domain, orgV2Config);

  // 3. Generate bearer token for the target service
  token =
    (await apiClient.generateToken(request, {
      url: serviceConfig.url,
      username: (serviceConfig as any).basicUser,
      password: (serviceConfig as any).basicPassword,
      orgId,
    })) ?? "";
});
```

### Which path parameters to resolve dynamically

| Parameter name pattern                                   | Value to use                                                                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `organizationId`, `orgId`, `organizationUuid`, `orgUuid` | Use resolved `orgId`                                                                               |
| Any other path param (e.g. `userId`, `assignmentId`)     | Use `"test-<paramName>"` as a placeholder — document that the test author must supply a real value |
| 404 error path params                                    | Use `"00000000-0000-0000-0000-000000000000"` (nil UUID) — realistic non-existent ID                |

---

## Request Body Generation (POST / PUT / PATCH)

The generator automatically creates a payload builder file per endpoint and **imports + calls it** in the generated spec. You do not need to hand-write request bodies.

Generated payload files live at:
```
helper/api/payloads/<service>/<operationId>Payload.ts
```

### What the generator produces for each field

| Field characteristic | Generated value | Action needed |
|---|---|---|
| `format: email` or name contains `email` | `faker.internet.email()` | None — unique per run |
| `firstName`, `lastName`, `name` suffix | `faker.person.firstName()` etc. | None |
| `description`, `bio`, `summary`, `note` | `faker.lorem.sentence()` | None |
| `phone`, `mobile` | `faker.phone.number()` | None |
| `url`, `website`, `link` | `faker.internet.url()` | None |
| `format: uuid` — org variants (`organizationId`, `orgId` …) | `"00000000-..." /* override: pass real orgId */` | Pass `orgId` via overrides |
| `format: uuid` — other resources (`roleId`, `courseId` …) | `"00000000-..." /* TODO: override with real roleId */` | Supply from `beforeAll` or clarify in scan |
| `otp`, `verificationCode`, `activationCode` | `"" /* ⚠ FLOW DEPENDENCY */` | Inject from Mailhog |
| `isActive`, `enabled`, `verified` booleans | `true` | None |
| integers | `faker.number.int({ min: 1, max: 100 })` | Adjust range if needed |

Example generated file:
```typescript
import { faker } from "@faker-js/faker";

// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from Mailhog.
// Pass runtime values via the overrides argument:
//   createUserPayload({ organizationId: orgId, roleId })

export function createUserPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "email":          faker.internet.email(),
    "firstName":      faker.person.firstName(),
    "lastName":       faker.person.lastName(),
    "organizationId": "00000000-0000-0000-0000-000000000000", /* override: pass real orgId */
    "roleId":         "00000000-0000-0000-0000-000000000000", /* TODO: override with real roleId */
    "isActive":       true,
    "phone":          faker.phone.number(),
    ...overrides,
  };
}
```

The `overrides` argument lets you inject runtime values without rewriting the whole payload:

```typescript
// In the generated spec (after fixup):
const { status } = await client.createUser(
  createUserPayload({ organizationId: orgId, roleId: adminRoleId })
);
```

After generation, search each payload file for `/* TODO: override` and `/* ⚠ FLOW DEPENDENCY` — those are the only fields that need attention. Everything else is already dynamic via faker.

---

## Flow-Dependent Endpoints and Third-Party Data

Some endpoints cannot be tested in isolation — they require data produced by a previous step or an external system. Common cases:

| Dependency                            | Solution                                                    |
| ------------------------------------- | ----------------------------------------------------------- |
| OTP / verification code sent by email | Read from Mailhog using `MailhogClient`                     |
| Magic link / activation URL in email  | Extract link with `MailhogClient.extractLink()`             |
| Resource ID from a previous POST      | Chain tests: capture `body.id` in step 1, pass to step 2   |
| User must exist before GET/PUT        | Call a `create` endpoint in `beforeAll` and store the ID    |

The generator adds a `// ⚠ FLOW DEPENDENCY` comment on any endpoint whose path or operation name contains words like `otp`, `verify`, `validate`, `confirm-email`, `magic-link`, or `activation-code`. Look for those comments and add the appropriate setup.

### MailhogClient — reading emails in tests

`helper/api/MailhogClient.ts` provides a ready-to-use client. Add to `develop.json`:
```json
"mailhog": { "url": "http://mailhog.<env>.squads-dev.com" }
```

**Full OTP verification flow:**

```typescript
import { MailhogClient } from "../../helper/api/MailhogClient";

test("verifies OTP after registration", async () => {
  const sentAt = new Date(); // timestamp BEFORE triggering the email

  // Step 1 — trigger the email
  const { status: s1 } = await client.registerUser(
    registerUserPayload({ email: "newuser@example.com", organizationId: orgId })
  );
  expect(s1).toBe(201);

  // Step 2 — wait for and read the email from Mailhog
  const mailhog = MailhogClient.fromEnv();
  const email   = await mailhog.waitForEmail("newuser@example.com", 30_000, sentAt);
  const otp     = mailhog.extractOtp(email);       // e.g. "482910"
  expect(otp).not.toBeNull();

  // Step 3 — use the OTP
  const { status: s2 } = await client.verifyOtp(
    verifyOtpPayload({ otp, email: "newuser@example.com", organizationId: orgId })
  );
  expect(s2).toBe(200);
});
```

**Available MailhogClient methods:**

| Method | Description |
| ------ | ----------- |
| `MailhogClient.fromEnv()` | Factory — reads URL from `develop.json["mailhog"]` |
| `waitForEmail(email, timeoutMs?, afterTimestamp?)` | Poll until email arrives; throws on timeout |
| `getLatestEmail(email)` | Get the newest message for a recipient (no wait) |
| `getMessagesForRecipient(email)` | All messages for a recipient, newest first |
| `extractOtp(message, digits?)` | Pull a 6-digit (or N-digit) code from the body |
| `extractByLabel(message, label)` | Pull a value following a label, e.g. `"Verification Code: 482910"` |
| `extractLink(message, pathPrefix?)` | Pull a URL from the body, optionally filtered by path prefix |
| `getEmailBody(message)` | Raw plain-text body (falls back to HTML for multi-part emails) |
| `getSubject(message)` | Email subject line |
| `clearAllMessages()` | Delete all Mailhog messages — use in `afterAll` to avoid cross-test pollution |

> **Important:** Mailhog's delete API clears the **entire** inbox, not per-recipient.
> Run specs that use Mailhog with `--workers 1` to avoid race conditions.

---

## Skip Endpoints

Edit `skills/swagger-api-gen/config.json` to exclude endpoints from generation:

```json
{
  "skipEndpoints": [
    "/actuator/*",
    "/health",
    "POST /admin/purge",
    "GET /debug/*"
  ]
}
```

## Include Specific Endpoints Only

To generate tests for **only** certain endpoints (ignores `skipEndpoints` entirely), use `includeEndpoints` in the config:

```json
{
  "includeEndpoints": ["GET /api/users", "POST /api/users", "/api/orders/*"]
}
```

Or pass it inline via the CLI without editing the config:

```bash
npm run gen:api \
  --url=https://service.example.com/docs/index.html \
  --service=myService \
  --include="GET /api/users,POST /api/users,/api/orders/*"
```

When `includeEndpoints` is non-empty (or `--include` is passed), the generator runs in **include-only mode** — only the matching endpoints are generated and `skipEndpoints` is ignored.

Pattern types (same for both skip and include):

- `/path/glob/*` — any method matching this path prefix
- `METHOD /path` — specific HTTP method + exact path
- `/exact/path` — exact path, any HTTP method

---

## Instructions for Claude

**MANDATORY ORDER — do not skip or reorder steps. Never write any code or files before Step 4 (dependency sign-off).**

---

### Step 1 — Gather minimum inputs

Ask the user for only what is needed to fetch the spec:

1. **Service base URL or direct spec URL** — e.g. `https://self-registration.develop.squads-dev.com/docs/index.html`
2. **Service name** — camelCase name matching the key in `develop.json`, e.g. `selfRegistration`, `assignmentService`
3. **Service config key in develop.json** — the exact key string used in `envVars["<key>"]`, e.g. `"selfRegistration"`, `"assignment-service"`, `"ucm2bff"`

Do not ask about skip/include yet — that comes after the scan.

---

### Step 2 — Fetch the spec

```bash
node scripts/swagger-fetch.mjs <URL> --out /tmp/swagger-spec.json
```

If this fails, ask the user for the direct JSON spec URL (e.g. `/v3/api-docs`).

---

### Step 2b — Run the flow detector (always, before any generation)

```bash
node scripts/swagger-api-gen.mjs \
  --spec /tmp/swagger-spec.json \
  --service <serviceName> \
  --out . \
  --dry-run 2>&1 | grep -A 200 "FLOW DEPENDENCY REPORT"
```

This prints the **API Flow Dependency Report** — a machine-detected graph of producer→consumer chains. Read it carefully. Every flow listed there needs a `test.describe.serial` flow spec (generated automatically). Every ❓ in the report needs user clarification before generation.

> If you used `/api-spec-audit` first, skip to Step 4 — the audit already produced the resolved plan.

---

### Step 3 — MANDATORY: Full endpoint scan and dependency analysis

**Read `/tmp/swagger-spec.json` and produce a dependency report before writing a single file.**

Walk every path and operation in the spec. For each endpoint build four tables:

#### Table A — Path Parameter Dependencies

For every `{param}` in every path:

| Endpoint | Param | Auto-resolved? | Resolution strategy |
|---|---|---|---|
| `GET /api/orgs/{organizationId}/users` | `organizationId` | ✅ Yes | `getOrgDetailsByDomain` in `beforeAll` |
| `GET /api/orgs/{orgId}/users/{userId}` | `userId` | ❌ No | ❓ Ask user |
| `DELETE /api/courses/{courseId}` | `courseId` | ❌ No | ❓ Ask user |

Auto-resolved params: any name matching `organizationId`, `orgId`, `organizationUuid`, `orgUuid` (and variants) — these are handled by the existing `beforeAll` pattern.

Everything else is **unresolved** and must be clarified with the user.

#### Table B — Request Body Field Dependencies

For every POST / PUT / PATCH endpoint, inspect the `requestBody` schema. Flag fields that cannot be a fake value:

| Endpoint | Field | Schema type | Flag | Reason |
|---|---|---|---|---|
| `POST /api/users` | `organizationId` | `string uuid` | ✅ Auto | Org UUID — resolved in `beforeAll` |
| `POST /api/enrollments` | `courseId` | `string uuid` | ❓ Unknown | Must be a real course ID — how to get one? |
| `POST /api/verify-otp` | `otp` | `string` | ⚠ Flow | Comes from email — Mailhog needed |
| `POST /api/users` | `email` | `string email` | ✅ Fake OK | `"test@example.com"` is fine for happy-path |
| `POST /api/users` | `roleId` | `string uuid` | ❓ Unknown | Must be a valid role ID — how to get one? |

Rules for flagging:
- `organizationId` / org variants → ✅ Auto
- `email`, `name`, `description`, plain strings → ✅ Fake OK (unless it must match an existing record)
- Any UUID field that represents another resource (userId, courseId, roleId, planId, …) → ❓ Unknown
- Fields whose name contains `otp`, `code`, `token`, `verificationCode`, `activationCode` → ⚠ Flow

#### Table C — External Flow Dependencies

For every endpoint whose **path or operationId** matches:
`otp | verify | validate | confirm.*email | activation | magic.?link | resend.*code`

| Endpoint | Flow type | Dependency |
|---|---|---|
| `POST /api/verify-otp` | OTP from email | Mailhog — `MailhogClient.waitForEmail` + `extractOtp` |
| `POST /api/resend-verification` | Triggers email | No inbound dependency; verify Mailhog is configured |
| `GET /api/activate` | Activation link | Mailhog — `MailhogClient.extractLink("/activate")` |

#### Table D — Sequential / Chained Dependencies

For any GET / PUT / DELETE that operates on a specific resource (path has a non-org UUID param), the resource must exist first:

| Endpoint | Prerequisite | Suggested setup |
|---|---|---|
| `GET /api/users/{userId}` | User must exist | `POST /api/users` in `beforeAll`, capture `body.id` |
| `PUT /api/courses/{courseId}` | Course must exist | `POST /api/courses` in `beforeAll`, capture `body.id` |
| `DELETE /api/enrollments/{enrollmentId}` | Enrollment must exist | `POST /api/enrollments` in `beforeAll`, capture `body.id` |

If the CREATE endpoint is in the same spec and not in the skip list, note it. If not, the user must supply a seeded ID.

---

### Step 4 — Present the report and get sign-off

Present all four tables to the user as a single **Dependency Report** (use markdown tables). Then ask:

1. For each ❓ **Unknown path param**: "How should we resolve `{paramName}` — should I create a resource in `beforeAll` using `POST <path>`, or do you have a known seed ID to use?"
2. For each ❓ **Unknown request body UUID**: "Is `<fieldName>` a real foreign-key reference? If yes, how do I get a valid one?"
3. For any ⚠ **Flow dependencies**: "Is Mailhog available at your environment? What is its URL (add to `develop.json` as `"mailhog": { "url": "..." }`)?"
4. "Are there any endpoints you want to skip or test with a known fixture instead of creating resources?"
5. "Any endpoints you want to exclude from this run entirely?"

**Do not proceed to Step 5 until the user has answered every ❓ and ⚠ item**, or explicitly said "skip those for now" / "use placeholder and add TODO".

---

### Step 5 — (Optional) Update skip/include list

If the user specified endpoints to skip or limit, update `skills/swagger-api-gen/config.json` accordingly before running the generator.

---

### Step 6 — Run the generator

```bash
node scripts/swagger-api-gen.mjs \
  --spec /tmp/swagger-spec.json \
  --service <serviceName> \
  --out /path/to/ucm-playwright-automation
```

Or use the single npm command:

```bash
npm run gen:api \
  --url=https://service.example.com/docs/index.html \
  --service=myService
```

---

### Step 7 — Apply dependency resolutions to the generated spec

Open the generated `tests/tests-api/<service>.spec.ts` and apply every resolution agreed in Step 4:

**A. Service config key**
Replace `envVars["<serviceName>"]` in `beforeAll` with the exact `develop.json` key the user confirmed.

**B. Sequential dependencies — create resources in `beforeAll`**
For each resource that must be pre-created, add a `beforeAll` step using the appropriate client method and capture the ID:
```typescript
let courseId: string;
// In beforeAll:
const { body: courseBody } = await client.createCourse(createCoursePayload({ organizationId: orgId }));
courseId = (courseBody as { id: string }).id;
```
Then replace `"test-courseId" /* TODO */` with `courseId` in every test that uses it.

**C. Known seed IDs**
If the user provided a fixed seed ID, replace the `/* TODO */` placeholder with it and add a comment explaining the source.

**D. Flow dependencies — add Mailhog setup**
For each `// ⚠ FLOW DEPENDENCY` comment, implement the Mailhog pattern with `waitForEmail` / `extractOtp` / `extractLink` as agreed.

**E. Payload builder values**
In each `helper/api/payloads/<service>/` file, replace placeholder UUIDs with real runtime references (e.g. `orgId`) using the `overrides` argument.

---

### Step 8 — Report to user

After generation and fixup, tell the user:

1. How many endpoints were generated and how many were skipped
2. The 5 files created (with paths)
3. Which items from the dependency report are **still unresolved** (need future attention)
4. The command to run the spec:
   ```
   npx playwright test -c playwright.api.config.ts tests/tests-api/<service>.spec.ts
   ```

---

### Step 9 — Optional dry-run preview

If the user wants to preview before writing files:
```bash
npm run gen:api:dry --url=... --service=...
```

---

## Notes

- `APIClient.getEnvVariables()` reads `config/<NODE_ENV>.json` — ensure secrets are loaded first: `npm run load-secrets-dev`
- `APIClient.getOrgDetailsByDomain(request, domain, orgV2Config)` uses `organizations-api` serviceConfig and returns the org `id` string
- Domain is always extracted from `envVars["frontend"].url` using the pattern `https://([^.]+)\.`
- Zod validation runs at the client level (logs contract mismatches as warnings) and in the spec (fails the test on shape mismatch)
- Re-running the generator overwrites previous generated files — safe to re-run after spec changes
- YAML specs are not supported directly; pipe through `js-yaml` first if needed
