// FLOW TEST — SelfRegistration: ApiRegistrations
// Resolved from: tests/tests-api/selfRegistration.test-plan.md
//
// Flows covered:
//   Flow 1: UserRegistration   — register → OTP validate → save-user
//   Flow 2: RegistrationAdmin  — resend OTP, send OTP email, fetch status
//   Flow 3: UserOtp (EMAIL_CHANGE) — generate OTP → validate OTP → verify email
//
// ⚠  Run with --workers 1 — Mailhog clears the entire inbox, not per-recipient.
//     npx playwright test -c playwright.api.config.ts tests/tests-api/flows/selfRegistration.flow.apiRegistrations.spec.ts --workers 1

import { test, expect, request as playwrightRequest } from "@playwright/test";
import { Reporter } from "../../../utils/Reporter";
import { APIClient } from "../../../helper/api/APIClient";
import { SelfRegistrationClient } from "../../../helper/api/SelfRegistrationClient";
import { MailhogClient } from "../../../helper/api/MailhogClient";
import { insertPayload } from "../../../helper/api/payloads/selfRegistration/insertPayload";
import { validateOtpPayload, validateOTPPayload } from "../../../helper/api/payloads/selfRegistration/validateOtpPayload";
import { saveUserPayload } from "../../../helper/api/payloads/selfRegistration/saveUserPayload";
import { resendOtpPayload } from "../../../helper/api/payloads/selfRegistration/resendOtpPayload";
import { sendOtpEmailPayload } from "../../../helper/api/payloads/selfRegistration/sendOtpEmailPayload";
import { generateOtpPayload } from "../../../helper/api/payloads/selfRegistration/generateOtpPayload";
import { verifyEmailPayload } from "../../../helper/api/payloads/selfRegistration/verifyEmailPayload";

// ── Constants ────────────────────────────────────────────────────────────────
// Must be reachable via Mailhog at http://mailhog.develop.squads-dev.com
const TEST_EMAIL = "test@mailhog.local";
const FEATURE_TYPE = "EMAIL_CHANGE"; // confirmed with team

// ── Shared state across serial steps ────────────────────────────────────────
let client: SelfRegistrationClient;
let orgId: string;
let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;
let registrationUuid: string;  // captured in Step 1, used by Steps 2–7
let userUuid: string;           // captured in Step 3, used by Steps 8–10
let registrationSentAt: Date;   // timestamp just before Step 1 — used by Step 2 Mailhog filter
let userOtpSentAt: Date;        // timestamp just before Step 8 — used by Step 9 Mailhog filter

test.beforeAll("Authenticate + resolve org", async () => {
  apiContext = await playwrightRequest.newContext();
  const envVars = APIClient.getEnvVariables();
  const frontendUrl = (envVars["frontend"] as { url: string }).url;
  const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  if (!domainMatch) throw new Error(`Cannot extract domain: ${frontendUrl}`);
  const domain = domainMatch[1];
  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  const apiClient = new APIClient();
  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);
  client = await SelfRegistrationClient.create(apiContext);
});

test.afterAll(async () => {
  await apiContext?.dispose();
});

// test.describe.serial guarantees steps run in order, one at a time.
test.describe.serial("SelfRegistration — ApiRegistrations flow", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("ApiRegistrations flow");
    await Reporter.addTags("api", "flow", "auto-generated");
  });

  // ── Flow 1: UserRegistration ──────────────────────────────────────────────

  // Step 1: POST /api/registrations
  // Triggers OTP email to TEST_EMAIL.
  test("Step 1: Insert — POST /api/registrations", async () => {
    await Reporter.setStory("ApiRegistrations / Step 1: POST /api/registrations");

    registrationSentAt = new Date(); // timestamp BEFORE triggering OTP email
    const { status, body } = await client.insert(
      insertPayload({
        organizationUuid: orgId,
        email: TEST_EMAIL,
        // externalUserId / externalId are optional — omit to avoid FK errors
        externalUserId: undefined,
        externalId: undefined,
      })
    );
    expect(status).toBe(200);
    registrationUuid = (body as Record<string, string>)["registrationUuid"];
    expect(registrationUuid, "Expected registrationUuid in response body").toBeTruthy();
  });

  // Step 2: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  // ⚠  OTP goes in the URL path as {code} — NOT in the request body.
  //    The body only needs organizationUuid.
  test("Step 2: ValidateOtp — POST /api/registrations/{registrationUuid}/otp/{code}/validate", async () => {
    await Reporter.setStory("ApiRegistrations / Step 2: POST /api/registrations/{registrationUuid}/otp/{code}/validate");
    expect(registrationUuid, "Step 2 requires registrationUuid from Step 1").toBeTruthy();

    // Read OTP from Mailhog — email was triggered in Step 1
    const mailhog = MailhogClient.fromEnv();
    const email = await mailhog.waitForEmail(TEST_EMAIL, 30_000, registrationSentAt);
    const otp = mailhog.extractOtp(email);
    expect(otp, "OTP not found in registration email body").not.toBeNull();

    // otp goes as the second argument (URL path {code}), NOT in the body
    const { status, body } = await client.validateOtp(
      registrationUuid,
      otp!,
      validateOtpPayload({ organizationUuid: orgId })
    );
    expect(status).toBe(200);
    // Response may refresh registrationUuid — update if present
    const freshUuid = (body as Record<string, string>)["registrationUuid"];
    if (freshUuid) registrationUuid = freshUuid;
  });

  // Step 3: POST /api/registrations/{registrationUuid}/save-user
  // Finalises user creation. Response contains userUuid.
  test("Step 3: SaveUser — POST /api/registrations/{registrationUuid}/save-user", async () => {
    await Reporter.setStory("ApiRegistrations / Step 3: POST /api/registrations/{registrationUuid}/save-user");
    expect(registrationUuid, "Step 3 requires registrationUuid from Step 1").toBeTruthy();

    const { status, body } = await client.saveUser(registrationUuid, saveUserPayload());
    expect(status).toBe(200);
    userUuid = (body as Record<string, string>)["userUuid"];
    expect(userUuid, "Expected userUuid in save-user response body").toBeTruthy();
  });

  // ── Flow 2: Registration admin operations ─────────────────────────────────
  // These use the registrationUuid from Step 1. They run after registration
  // is complete but before the user OTP flow, to avoid interfering with Mailhog.

  // Step 4: GET /api/registrations/{registrationUuid}/fetch-user-status
  test("Step 4: FetchUserStatus — GET /api/registrations/{registrationUuid}/fetch-user-status", async () => {
    await Reporter.setStory("ApiRegistrations / Step 4: GET /api/registrations/{registrationUuid}/fetch-user-status");
    expect(registrationUuid, "Step 4 requires registrationUuid from Step 1").toBeTruthy();

    const { status } = await client.fetchUserStatus(registrationUuid);
    expect(status).toBe(200);
  });

  // Step 5: POST /api/registrations/{registrationUuid}/otp/resend
  test("Step 5: ResendOtp — POST /api/registrations/{registrationUuid}/otp/resend", async () => {
    await Reporter.setStory("ApiRegistrations / Step 5: POST /api/registrations/{registrationUuid}/otp/resend");
    expect(registrationUuid, "Step 5 requires registrationUuid from Step 1").toBeTruthy();

    const { status } = await client.resendOtp(registrationUuid, resendOtpPayload());
    expect(status).toBe(200);
  });

  // Step 6: POST /api/registrations/{registrationUuid}/send-otp-email
  test("Step 6: SendOtpEmail — POST /api/registrations/{registrationUuid}/send-otp-email", async () => {
    await Reporter.setStory("ApiRegistrations / Step 6: POST /api/registrations/{registrationUuid}/send-otp-email");
    expect(registrationUuid, "Step 6 requires registrationUuid from Step 1").toBeTruthy();

    const { status } = await client.sendOtpEmail(
      registrationUuid,
      sendOtpEmailPayload({ organizationUuid: orgId, email: TEST_EMAIL })
    );
    expect(status).toBe(200);
  });

  // ── Flow 3: User-level OTP (EMAIL_CHANGE feature) ─────────────────────────
  // Requires userUuid captured in Step 3 (save-user).
  // The generate call sends an OTP to the user's email (TEST_EMAIL).

  // Step 7: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate  → 204
  test("Step 7: GenerateOtp — POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate", async () => {
    await Reporter.setStory("ApiRegistrations / Step 7: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/generate");
    expect(userUuid, "Step 7 requires userUuid from Step 3").toBeTruthy();

    userOtpSentAt = new Date(); // timestamp BEFORE triggering user OTP email
    const { status } = await client.generateOtp(
      userUuid,
      FEATURE_TYPE,
      generateOtpPayload({ organizationUuid: orgId, email: TEST_EMAIL })
    );
    expect(status).toBe(204);
  });

  // Step 8: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate  → 204
  // ⚠  OTP goes in the request BODY as "otp" (different from registration OTP which goes in URL).
  test("Step 8: ValidateOTP — POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate", async () => {
    await Reporter.setStory("ApiRegistrations / Step 8: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/validate");
    expect(userUuid, "Step 8 requires userUuid from Step 3").toBeTruthy();

    // Read user OTP from Mailhog — email was triggered in Step 7
    const mailhog = MailhogClient.fromEnv();
    const email = await mailhog.waitForEmail(TEST_EMAIL, 30_000, userOtpSentAt);
    const otp = mailhog.extractOtp(email);
    expect(otp, "OTP not found in user OTP email body").not.toBeNull();

    const { status } = await client.validateOTP(
      userUuid,
      FEATURE_TYPE,
      validateOTPPayload({ organizationUuid: orgId, otp })
    );
    expect(status).toBe(204);
  });

  // Step 9: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/verify-email
  test("Step 9: VerifyEmail — POST /api/users/{userUuid}/otp/EMAIL_CHANGE/verify-email", async () => {
    await Reporter.setStory("ApiRegistrations / Step 9: POST /api/users/{userUuid}/otp/EMAIL_CHANGE/verify-email");
    expect(userUuid, "Step 9 requires userUuid from Step 3").toBeTruthy();

    const { status } = await client.verifyEmail(userUuid, FEATURE_TYPE, verifyEmailPayload());
    expect(status).toBe(200);
  });

});
