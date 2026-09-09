---
name: api-spec-audit
description: "Use this skill BEFORE generating API tests. Triggers on: 'audit this swagger', 'scan the spec', 'what are the dependencies', 'analyze this API', 'plan the API tests', 'what do I need before generating tests', or any request to understand a Swagger/OpenAPI spec before writing code. Fetches the spec, detects all gaps (flow dependencies, external system needs, unknown UUIDs, auth requirements), produces a structured resolution plan, and hands off to /swagger-api-gen for implementation. This is the scout skill — it never writes test files."
---

# api-spec-audit

Trigger phrase: `/api-spec-audit`

## Purpose

Analyse a Swagger/OpenAPI spec **before any code is generated**. Surface every dependency, gap, and cross-endpoint chain so the user can resolve them upfront. Outputs a **Resolved API Test Plan** that is passed directly into `/swagger-api-gen` for implementation.

This skill never writes test files. It only reads, analyses, and plans.

## Non-Negotiable Rule

Do not hallucinate. Every gap listed must come from the actual spec. Do not invent dependencies. If something is ambiguous, ask — never assume.

---

## What This Skill Detects

| Gap type               | Description                                                                            | Resolution needed                         |
| ---------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Flow chains**        | Endpoint A produces a field (e.g. `registrationId`) that Endpoint B requires as input  | Confirm step order and capture strategy   |
| **Email / OTP flows**  | Endpoints that require a code or link sent to an email inbox                           | Confirm Mailhog URL and recipient address |
| **Foreign-key UUIDs**  | Request body or path param that must be a real resource ID (e.g. `roleId`, `courseId`) | Create in `beforeAll`, seed, or skip      |
| **Unknown auth**       | Endpoints that use a different auth scheme than the standard Bearer token              | Confirm auth strategy                     |
| **Isolated endpoints** | Endpoints with no dependencies that can be tested independently                        | No action needed                          |

---

## Instructions for Claude

### Step 1 — Gather inputs

Ask the user for:

1. **Service URL** — Swagger UI or direct JSON spec URL
2. **Service name** — camelCase key matching `develop.json`, e.g. `selfRegistration`
3. **develop.json config key** — exact string for `envVars["<key>"]`
4. **Test email address** — the email address to use for registration/OTP flows (must be reachable via Mailhog)

---

### Step 2 — Fetch the spec

```bash
node scripts/swagger-fetch.mjs <URL> --out /tmp/swagger-spec.json
```

---

### Step 3 — Run the automated flow detector

```bash
node scripts/swagger-api-gen.mjs \
  --spec /tmp/swagger-spec.json \
  --service <serviceName> \
  --out . \
  --dry-run 2>&1
```

Read the **API FLOW DEPENDENCY REPORT** section from the output. This gives you the machine-detected producer→consumer chains as a starting point.

---

### Step 4 — Deep manual gap analysis

After reading the automated report, perform the following additional checks by reading the spec directly:

#### 4A — Complete endpoint inventory

List every endpoint with:

- Method + path
- Purpose (from `summary` / `description`)
- Input: path params + required body fields
- Output: key response fields (especially IDs, tokens, codes)

Format:

```
POST /api/orgs/{organizationId}/register
  Purpose: Register a new user — triggers OTP email
  Inputs:  organizationId (auto), email, firstName, lastName
  Outputs: registrationId ← capture this

POST /api/orgs/{organizationId}/verify-otp
  Purpose: Verify OTP from email
  Inputs:  organizationId (auto), registrationId ← from step above, otp ← from Mailhog
  Outputs: sessionToken
```

#### 4B — Flow chain table

Build a table of every detected chain:

| Flow name        | Step | Endpoint         | Produces         | Needs            | Source          |
| ---------------- | ---- | ---------------- | ---------------- | ---------------- | --------------- |
| UserRegistration | 1    | POST /register   | `registrationId` | —                | —               |
| UserRegistration | 2    | POST /verify-otp | `sessionToken`   | `registrationId` | Step 1 response |
| UserRegistration | 2    | POST /verify-otp | —                | `otp`            | Mailhog email   |

#### 4C — Foreign key UUID table

List every UUID field in request bodies that is NOT an org UUID and NOT produced by another endpoint in this spec:

| Endpoint              | Field      | Type | Why it's needed       | Proposed resolution                                                     |
| --------------------- | ---------- | ---- | --------------------- | ----------------------------------------------------------------------- |
| POST /api/enrollments | `courseId` | UUID | Must be a real course | Create via `POST /api/courses` in `beforeAll` — or ask user for seed ID |
| POST /api/users       | `roleId`   | UUID | Must be a valid role  | Query `GET /api/roles` in `beforeAll` and pick first result             |

#### 4D — External system dependencies

| Endpoint         | External system | What's needed              | Config key                    |
| ---------------- | --------------- | -------------------------- | ----------------------------- |
| POST /verify-otp | Mailhog         | OTP code from email body   | `"mailhog": { "url": "..." }` |
| POST /activate   | Mailhog         | Activation link from email | `"mailhog": { "url": "..." }` |

#### 4E — Auth requirements

Check if any endpoint uses a different auth scheme (e.g. no auth, API key, separate token). Flag any that deviate from the standard `Bearer` token from `APIClient.generateToken()`.

#### 4F — Endpoints that cannot be automatically tested

Flag any endpoint that:

- Requires manual setup that can't be automated (e.g. human approval workflow)
- Has no deterministic way to produce its prerequisite data
- Would cause irreversible side effects in a shared environment

---

### Step 5 — Present the full Gap Report

Present a structured report to the user with all four sections populated. For each gap, propose a resolution. Use this format:

```
## API Audit Report — <ServiceName>

### 1. Detected Flows (require serial test execution)
<flow chain table from 4B>

### 2. Foreign Key Dependencies (require beforeAll setup)
<table from 4C>

### 3. External System Dependencies
<table from 4D>

### 4. Untestable / Requires Manual Setup
<list from 4F>

### 5. Isolated Endpoints (no dependencies — straightforward to test)
<list>

### Proposed Resolution Plan
For each gap:
  - Flow chains → test.describe.serial file, shared let variables
  - Foreign keys → create resource in beforeAll, capture ID
  - Mailhog → MailhogClient.fromEnv(), waitForEmail, extractOtp
  - Untestable → skip in config.json with comment
```

---

### Step 6 — Resolve each gap with the user

Ask the user one question per gap cluster (not per item):

1. **Flows confirmed?** "These are the multi-step flows I detected. Does this match how the API works? Any steps missing or wrong?"
2. **Foreign keys** "For `roleId`, `courseId`, etc. — should I create them in `beforeAll`, or do you have seed IDs I can use?"
3. **Mailhog** "Is Mailhog available? What URL? Which email address will receive the OTP/verification emails during tests?"
4. **Skips** "Are there any endpoints you want to exclude from the generated tests?"

**Do not proceed to Step 7 until all gaps have a confirmed resolution.**

---

### Step 7 — Produce the Resolved Test Plan

Write the resolved plan as a markdown document saved to:

```
tests/tests-api/<serviceName>.test-plan.md
```

The plan must contain:

```markdown
# API Test Plan — <ServiceName>

Generated: <date>

## Service Config

- develop.json key: "<key>"
- Base URL: from envVars["<key>"].url

## Flows (serial execution order)

### Flow 1: <FlowName>

Step 1: POST /api/.../register

- Payload: registerUserPayload({ organizationId: orgId, email: "<testEmail>" })
- Capture: registrationId from response body

Step 2: POST /api/.../verify-otp

- Depends on: registrationId (Step 1)
- External: otp from Mailhog (waitForEmail("<testEmail>"), extractOtp())
- Payload: verifyOtpPayload({ registrationId, otp, organizationId: orgId })

## Isolated Endpoints

- GET /api/.../users → standard happy + 401 + 404

## beforeAll Setup Required

- Create roleId: GET /api/roles → roles[0].id
- Create courseId: POST /api/courses → body.id

## Mailhog Config

- URL: <confirmed URL>
- Test email: <confirmed email>

## Skipped Endpoints

- POST /admin/reset-all (irreversible side effect)

## Run Commands

npx playwright test -c playwright.api.config.ts tests/tests-api/<service>.spec.ts
npx playwright test -c playwright.api.config.ts tests/tests-api/flows/
```

---

### Step 8 — Hand off to swagger-api-gen

Tell the user:

> "The audit is complete. Your resolved test plan is saved at `tests/tests-api/<serviceName>.test-plan.md`.
>
> To generate all the test files, run `/swagger-api-gen` with the following confirmed inputs:
>
> - URL: `<specUrl>`
> - Service name: `<serviceName>`
> - Config key: `<configKey>`
> - Skips: `<patterns from plan>`
>
> The generator will automatically detect the same flows and produce:
>
> - `tests/tests-api/<service>.spec.ts` — per-endpoint tests
> - `tests/tests-api/flows/<service>.flow.*.spec.ts` — flow tests with shared state
>
> After generation, the only manual edits needed are the items flagged in the plan."

---

## Notes

- This skill reads but never writes test files. Hand off to `/swagger-api-gen` for all code generation.
- The automated flow detector (`detectFlows()` inside `swagger-api-gen.mjs`) handles producer→consumer matching algorithmically. Trust its output but supplement with manual analysis for semantic gaps it cannot detect (e.g. business-logic preconditions).
- Mailhog's delete API clears the entire inbox — remind the user to run flow tests with `--workers 1`.
- If a foreign key UUID can be queried from a GET endpoint in the same spec, prefer that over seeding — it keeps tests environment-agnostic.
