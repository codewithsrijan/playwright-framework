# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/selfRegistration.flow.apiRegistrations.spec.ts >> SelfRegistration — ApiRegistrations flow >> Step 1: Insert — POST /api/registrations
- Location: tests/tests-api/flows/selfRegistration.flow.apiRegistrations.spec.ts:68:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1   | // FLOW TEST — SelfRegistration: ApiRegistrations
  2   | // Resolved from: tests/tests-api/selfRegistration.test-plan.md
  3   | //
  4   | // Flows covered:
  5   | //   Flow 1: UserRegistration   — register → OTP validate → save-user
  6   | //   Flow 2: RegistrationAdmin  — resend OTP, send OTP email, fetch status
  7   | //   Flow 3: UserOtp (EMAIL_CHANGE) — generate OTP → validate OTP → verify email
  8   | //
  9   | // ⚠  Run with --workers 1 — Mailhog clears the entire inbox, not per-recipient.
  10  | //     npx playwright test -c playwright.api.config.ts tests/tests-api/flows/selfRegistration.flow.apiRegistrations.spec.ts --workers 1
  11  | 
  12  | import { test, expect, request as playwrightRequest } from "@playwright/test";
  13  | import { Reporter } from "../../../utils/Reporter";
  14  | import { APIClient } from "../../../helper/api/APIClient";
  15  | import { SelfRegistrationClient } from "../../../helper/api/SelfRegistrationClient";
  16  | import { MailhogClient } from "../../../helper/api/MailhogClient";
  17  | import { insertPayload } from "../../../helper/api/payloads/selfRegistration/insertPayload";
  18  | import { validateOtpPayload, validateOTPPayload } from "../../../helper/api/payloads/selfRegistration/validateOtpPayload";
  19  | import { saveUserPayload } from "../../../helper/api/payloads/selfRegistration/saveUserPayload";
  20  | import { resendOtpPayload } from "../../../helper/api/payloads/selfRegistration/resendOtpPayload";
  21  | import { sendOtpEmailPayload } from "../../../helper/api/payloads/selfRegistration/sendOtpEmailPayload";
  22  | import { generateOtpPayload } from "../../../helper/api/payloads/selfRegistration/generateOtpPayload";
  23  | import { verifyEmailPayload } from "../../../helper/api/payloads/selfRegistration/verifyEmailPayload";
  24  | 
  25  | // ── Constants ────────────────────────────────────────────────────────────────
  26  | // Must be reachable via Mailhog at http://mailhog.develop.squads-dev.com
  27  | const TEST_EMAIL = "test@mailhog.local";
  28  | const FEATURE_TYPE = "EMAIL_CHANGE"; // confirmed with team
  29  | 
  30  | // ── Shared state across serial steps ────────────────────────────────────────
  31  | let client: SelfRegistrationClient;
  32  | let orgId: string;
  33  | let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;
  34  | let registrationUuid: string;  // captured in Step 1, used by Steps 2–7
  35  | let userUuid: string;           // captured in Step 3, used by Steps 8–10
  36  | let registrationSentAt: Date;   // timestamp just before Step 1 — used by Step 2 Mailhog filter
  37  | let userOtpSentAt: Date;        // timestamp just before Step 8 — used by Step 9 Mailhog filter
  38  | 
  39  | test.beforeAll("Authenticate + resolve org", async () => {
  40  |   apiContext = await playwrightRequest.newContext();
  41  |   const envVars = APIClient.getEnvVariables();
  42  |   const frontendUrl = (envVars["frontend"] as { url: string }).url;
  43  |   const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  44  |   if (!domainMatch) throw new Error(`Cannot extract domain: ${frontendUrl}`);
  45  |   const domain = domainMatch[1];
  46  |   const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  47  |   const apiClient = new APIClient();
  48  |   orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);
  49  |   client = await SelfRegistrationClient.create(apiContext);
  50  | });
  51  | 
  52  | test.afterAll(async () => {
  53  |   await apiContext?.dispose();
  54  | });
  55  | 
  56  | // test.describe.serial guarantees steps run in order, one at a time.
  57  | test.describe.serial("SelfRegistration — ApiRegistrations flow", () => {
  58  |   test.beforeEach(async () => {
  59  |     await Reporter.setEpic("SelfRegistration");
  60  |     await Reporter.setFeature("ApiRegistrations flow");
  61  |     await Reporter.addTags("api", "flow", "auto-generated");
  62  |   });
  63  | 
  64  |   // ── Flow 1: UserRegistration ──────────────────────────────────────────────
  65  | 
  66  |   // Step 1: POST /api/registrations
  67  |   // Triggers OTP email to TEST_EMAIL.
  68  |   test("Step 1: Insert — POST /api/registrations", async () => {
  69  |     await Reporter.setStory("ApiRegistrations / Step 1: POST /api/registrations");
  70  | 
  71  |     registrationSentAt = new Date(); // timestamp BEFORE triggering OTP email
  72  |     const { status, body } = await client.insert(
  73  |       insertPayload({
  74  |         organizationUuid: orgId,
  75  |         email: TEST_EMAIL,
  76  |         // externalUserId / externalId are optional — omit to avoid FK errors
  77  |         externalUserId: undefined,
  78  |         externalId: undefined,
  79  |       })
  80  |     );
> 81  |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  82  |     registrationUuid = (body as Record<string, string>)["registrationUuid"];
  83  |     expect(registrationUuid, "Expected registrationUuid in response body").toBeTruthy();
  84  |   });
  85  | 
  86  |   // Step 2: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  87  |   // ⚠  OTP goes in the URL path as {code} — NOT in the request body.
  88  |   //    The body only needs organizationUuid.
  89  |   test("Step 2: ValidateOtp — POST /api/registrations/{registrationUuid}/otp/{code}/validate", async () => {
  90  |     await Reporter.setStory("ApiRegistrations / Step 2: POST /api/registrations/{registrationUuid}/otp/{code}/validate");
  91  |     expect(registrationUuid, "Step 2 requires registrationUuid from Step 1").toBeTruthy();
  92  | 
  93  |     // Read OTP from Mailhog — email was triggered in Step 1
  94  |     const mailhog = MailhogClient.fromEnv();
  95  |     const email = await mailhog.waitForEmail(TEST_EMAIL, 30_000, registrationSentAt);
  96  |     const otp = mailhog.extractOtp(email);
  97  |     expect(otp, "OTP not found in registration email body").not.toBeNull();
  98  | 
  99  |     // otp goes as the second argument (URL path {code}), NOT in the body
  100 |     const { status, body } = await client.validateOtp(
  101 |       registrationUuid,
  102 |       otp!,
  103 |       validateOtpPayload({ organizationUuid: orgId })
  104 |     );
  105 |     expect(status).toBe(200);
  106 |     // Response may refresh registrationUuid — update if present
  107 |     const freshUuid = (body as Record<string, string>)["registrationUuid"];
  108 |     if (freshUuid) registrationUuid = freshUuid;
  109 |   });
  110 | 
  111 |   // Step 3: POST /api/registrations/{registrationUuid}/save-user
  112 |   // Finalises user creation. Response contains userUuid.
  113 |   test("Step 3: SaveUser — POST /api/registrations/{registrationUuid}/save-user", async () => {
  114 |     await Reporter.setStory("ApiRegistrations / Step 3: POST /api/registrations/{registrationUuid}/save-user");
  115 |     expect(registrationUuid, "Step 3 requires registrationUuid from Step 1").toBeTruthy();
  116 | 
  117 |     const { status, body } = await client.saveUser(registrationUuid, saveUserPayload());
  118 |     expect(status).toBe(200);
  119 |     userUuid = (body as Record<string, string>)["userUuid"];
  120 |     expect(userUuid, "Expected userUuid in save-user response body").toBeTruthy();
  121 |   });
  122 | 
  123 |   // ── Flow 2: Registration admin operations ─────────────────────────────────
  124 |   // These use the registrationUuid from Step 1. They run after registration
  125 |   // is complete but before the user OTP flow, to avoid interfering with Mailhog.
  126 | 
  127 |   // Step 4: GET /api/registrations/{registrationUuid}/fetch-user-status
  128 |   test("Step 4: FetchUserStatus — GET /api/registrations/{registrationUuid}/fetch-user-status", async () => {
  129 |     await Reporter.setStory("ApiRegistrations / Step 4: GET /api/registrations/{registrationUuid}/fetch-user-status");
  130 |     expect(registrationUuid, "Step 4 requires registrationUuid from Step 1").toBeTruthy();
  131 | 
  132 |     const { status } = await client.fetchUserStatus(registrationUuid);
  133 |     expect(status).toBe(200);
  134 |   });
  135 | 
  136 |   // Step 5: POST /api/registrations/{registrationUuid}/otp/resend
  137 |   test("Step 5: ResendOtp — POST /api/registrations/{registrationUuid}/otp/resend", async () => {
  138 |     await Reporter.setStory("ApiRegistrations / Step 5: POST /api/registrations/{registrationUuid}/otp/resend");
  139 |     expect(registrationUuid, "Step 5 requires registrationUuid from Step 1").toBeTruthy();
  140 | 
  141 |     const { status } = await client.resendOtp(registrationUuid, resendOtpPayload());
  142 |     expect(status).toBe(200);
  143 |   });
  144 | 
  145 |   // Step 6: POST /api/registrations/{registrationUuid}/send-otp-email
  146 |   test("Step 6: SendOtpEmail — POST /api/registrations/{registrationUuid}/send-otp-email", async () => {
  147 |     await Reporter.setStory("ApiRegistrations / Step 6: POST /api/registrations/{registrationUuid}/send-otp-email");
  148 |     expect(registrationUuid, "Step 6 requires registrationUuid from Step 1").toBeTruthy();
  149 | 
  150 |     const { status } = await client.sendOtpEmail(
  151 |       registrationUuid,
  152 |       sendOtpEmailPayload({ organizationUuid: orgId, email: TEST_EMAIL })
  153 |     );
  154 |     expect(status).toBe(200);
  155 |   });
  156 | 
  157 |   // ── Flow 3: User-level OTP (EMAIL_CHANGE feature) ─────────────────────────
  158 |   // Requires userUuid captured in Step 3 (save-user).
  159 |   // The generate call sends an OTP to the user's email (TEST_EMAIL).
  160 | 
  161 |   // Step 7: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate  → 204
  162 |   test("Step 7: GenerateOtp — POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate", async () => {
  163 |     await Reporter.setStory("ApiRegistrations / Step 7: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate");
  164 |     expect(userUuid, "Step 7 requires userUuid from Step 3").toBeTruthy();
  165 | 
  166 |     userOtpSentAt = new Date(); // timestamp BEFORE triggering user OTP email
  167 |     const { status } = await client.generateOtp(
  168 |       userUuid,
  169 |       FEATURE_TYPE,
  170 |       generateOtpPayload({ organizationUuid: orgId, email: TEST_EMAIL })
  171 |     );
  172 |     expect(status).toBe(204);
  173 |   });
  174 | 
  175 |   // Step 8: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate  → 204
  176 |   // ⚠  OTP goes in the request BODY as "otp" (different from registration OTP which goes in URL).
  177 |   test("Step 8: ValidateOTP — POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate", async () => {
  178 |     await Reporter.setStory("ApiRegistrations / Step 8: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate");
  179 |     expect(userUuid, "Step 8 requires userUuid from Step 3").toBeTruthy();
  180 | 
  181 |     // Read user OTP from Mailhog — email was triggered in Step 7
```