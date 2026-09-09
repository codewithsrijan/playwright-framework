// AUTO-GENERATED — do not edit manually
// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration
//
// Service: self-registration-service
// Generated: 2026-05-27

import { test, expect, request as playwrightRequest } from "@playwright/test";
import { Reporter } from "../../utils/Reporter";
import { APIClient } from "../../helper/api/APIClient";
import { SelfRegistrationClient } from "../../helper/api/SelfRegistrationClient";
import { InsertResponseSchema, ValidateOtpResponseSchema, SaveUserResponseSchema, ResendOtpResponseSchema, FetchUserStatusResponseSchema, SendOtpEmailResponseSchema, FetchRegisteredUsersforapprovalResponseSchema, ApprovePendingRegisteredUsersResponseSchema, ApproveRegisteredUserWithUpdateRequestResponseSchema, RejectUserRegistrationResponseSchema, BulkUpdateCustomAttributeValuesResponseSchema, VerifyEmailResponseSchema, FetchResponseSchema, UpsertResponseSchema, DeleteCustomAttributeResponseSchema, PingResponseSchema, LocalHealthResponseSchema, RemoteHealthResponseSchema, LocalAndRemoteHealthResponseSchema, BasicAuthHealthResponseSchema, GetBuildVersionResponseSchema, FetchEntriesResponseSchema } from "../../helper/api/schemas/selfRegistration.schemas";
import { insertPayload } from "../../helper/api/payloads/selfRegistration/insertPayload";
import { validateOtpPayload } from "../../helper/api/payloads/selfRegistration/validateOtpPayload";
import { saveUserPayload } from "../../helper/api/payloads/selfRegistration/saveUserPayload";
import { resendOtpPayload } from "../../helper/api/payloads/selfRegistration/resendOtpPayload";
import { sendOtpEmailPayload } from "../../helper/api/payloads/selfRegistration/sendOtpEmailPayload";
import { fetchRegisteredUsersforapprovalPayload } from "../../helper/api/payloads/selfRegistration/fetchRegisteredUsersforapprovalPayload";
import { approvePendingRegisteredUsersPayload } from "../../helper/api/payloads/selfRegistration/approvePendingRegisteredUsersPayload";
import { approveRegisteredUserWithUpdateRequestPayload } from "../../helper/api/payloads/selfRegistration/approveRegisteredUserWithUpdateRequestPayload";
import { rejectUserRegistrationPayload } from "../../helper/api/payloads/selfRegistration/rejectUserRegistrationPayload";
import { bulkUpdateCustomAttributeValuesPayload } from "../../helper/api/payloads/selfRegistration/bulkUpdateCustomAttributeValuesPayload";
import { generateOtpPayload } from "../../helper/api/payloads/selfRegistration/generateOtpPayload";
import { validateOTPPayload } from "../../helper/api/payloads/selfRegistration/validateOtpPayload";
import { verifyEmailPayload } from "../../helper/api/payloads/selfRegistration/verifyEmailPayload";
import { upsertPayload } from "../../helper/api/payloads/selfRegistration/upsertPayload";

let client: SelfRegistrationClient;
let orgId: string;
let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;

test.beforeAll("Authenticate + resolve org", async () => {
  // Create a persistent APIRequestContext scoped to the whole suite.
  // Using playwrightRequest.newContext() avoids the "fixture from beforeAll cannot be
  // reused in a test" error that occurs when storing the { request } fixture.
  apiContext = await playwrightRequest.newContext();

  const envVars = APIClient.getEnvVariables();
  const serviceConfig = envVars["selfRegistration"] as { url: string; [k: string]: unknown };

  // 1. Extract domain from the frontend URL to resolve org UUID
  const frontendUrl = (envVars["frontend"] as { url: string }).url;
  const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  if (!domainMatch) throw new Error(`Cannot extract domain from frontend URL: ${frontendUrl}`);
  const domain = domainMatch[1];

  // 2. Resolve real org UUID via organizations-api
  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  const apiClient = new APIClient();
  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);

  // 3. Create service client using the persistent context
  client = await SelfRegistrationClient.create(apiContext);
});

test.afterAll(async () => {
  await apiContext?.dispose();
});

test.describe("SelfRegistration — registration", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("registration");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: POST /api/registrations
  test("Insert — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations");
    const { status, body } = await client.insert(insertPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = InsertResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations — unauthorized
  test("Insert — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("ValidateOtp — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate");
    const { status, body } = await client.validateOtp("test-registrationUuid" /* TODO: replace with real registrationUuid */, "test-code" /* TODO: replace with real code */, validateOtpPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = ValidateOtpResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized
  test("ValidateOtp — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/invalid-code/validate`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found
  test("ValidateOtp — 404 not found", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found");
    const { status } = await client.validateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", validateOtpPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/registrations/{registrationUuid}/save-user
  test("SaveUser — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user");
    const { status, body } = await client.saveUser("test-registrationUuid" /* TODO: replace with real registrationUuid */, saveUserPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = SaveUserResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations/{registrationUuid}/save-user — unauthorized
  test("SaveUser — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/invalid-registrationUuid/save-user`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/registrations/{registrationUuid}/save-user — not found
  test("SaveUser — 404 not found", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — not found");
    const { status } = await client.saveUser("00000000-0000-0000-0000-000000000000", saveUserPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/registrations/{registrationUuid}/otp/resend
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("ResendOtp — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend");
    const { status, body } = await client.resendOtp("test-registrationUuid" /* TODO: replace with real registrationUuid */, resendOtpPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = ResendOtpResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations/{registrationUuid}/otp/resend — unauthorized
  test("ResendOtp — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/resend`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/registrations/{registrationUuid}/otp/resend — not found
  test("ResendOtp — 404 not found", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — not found");
    const { status } = await client.resendOtp("00000000-0000-0000-0000-000000000000", resendOtpPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: GET /api/registrations/{registrationUuid}/fetch-user-status
  test("FetchUserStatus — 200  happy path", async () => {
    await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status");
    const { status, body } = await client.fetchUserStatus("test-registrationUuid" /* TODO: replace with real registrationUuid */);
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = FetchUserStatusResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized
  test("FetchUserStatus — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/invalid-registrationUuid/fetch-user-status`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — not found
  test("FetchUserStatus — 404 not found", async () => {
    await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — not found");
    const { status } = await client.fetchUserStatus("00000000-0000-0000-0000-000000000000");
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/registrations/{registrationUuid}/send-otp-email
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("SendOtpEmail — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email");
    const { status, body } = await client.sendOtpEmail("test-registrationUuid" /* TODO: replace with real registrationUuid */, sendOtpEmailPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = SendOtpEmailResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized
  test("SendOtpEmail — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/invalid-registrationUuid/send-otp-email`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — not found
  test("SendOtpEmail — 404 not found", async () => {
    await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — not found");
    const { status } = await client.sendOtpEmail("00000000-0000-0000-0000-000000000000", sendOtpEmailPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/registrations/fetch-registered-users-for-approval
  test("FetchRegisteredUsersforapproval — 200  happy path", async () => {
    await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval");
    const { status, body } = await client.fetchRegisteredUsersforapproval(fetchRegisteredUsersforapprovalPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/registrations/fetch-registered-users-for-approval — unauthorized
  test("FetchRegisteredUsersforapproval — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: PUT /api/registrations/approve-pending-registered-users
  test("ApprovePendingRegisteredUsers — 200  happy path", async () => {
    await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users");
    const { status, body } = await client.approvePendingRegisteredUsers(approvePendingRegisteredUsersPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: PUT /api/registrations/approve-pending-registered-users — unauthorized
  test("ApprovePendingRegisteredUsers — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.put(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/approve-pending-registered-users`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: PUT /api/registrations/approve-registered-user-with-update
  test("ApproveRegisteredUserWithUpdateRequest — 200  happy path", async () => {
    await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update");
    const { status, body } = await client.approveRegisteredUserWithUpdateRequest(approveRegisteredUserWithUpdateRequestPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: PUT /api/registrations/approve-registered-user-with-update — unauthorized
  test("ApproveRegisteredUserWithUpdateRequest — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.put(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: PUT /api/registrations/reject-pending-registration-users
  test("RejectUserRegistration — 200  happy path", async () => {
    await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users");
    const { status, body } = await client.rejectUserRegistration(rejectUserRegistrationPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = RejectUserRegistrationResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: PUT /api/registrations/reject-pending-registration-users — unauthorized
  test("RejectUserRegistration — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.put(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/reject-pending-registration-users`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: PUT /api/registrations/bulk-update-custom-attribute-values
  test("BulkUpdateCustomAttributeValues — 200  happy path", async () => {
    await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values");
    const { status, body } = await client.bulkUpdateCustomAttributeValues(bulkUpdateCustomAttributeValuesPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized
  test("BulkUpdateCustomAttributeValues — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.put(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

});

test.describe("SelfRegistration — otp integration", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("otp integration");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: POST /api/users/{userUuid}/otp/{featureType}/generate
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("GenerateOtp — 204  happy path", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate");
    const { status, body } = await client.generateOtp("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, generateOtpPayload());
    expect(status).toBe(204);
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized
  test("GenerateOtp — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/generate`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — not found
  test("GenerateOtp — 404 not found", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — not found");
    const { status } = await client.generateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", generateOtpPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/users/{userUuid}/otp/{featureType}/validate
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("ValidateOTP — 204  happy path", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate");
    const { status, body } = await client.validateOTP("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, validateOTPPayload());
    expect(status).toBe(204);
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized
  test("ValidateOTP — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/validate`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — not found
  test("ValidateOTP — 404 not found", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — not found");
    const { status } = await client.validateOTP("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", validateOTPPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/users/{userUuid}/otp/{featureType}/verify-email
  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  //   2. const email = await mailhog.waitForEmail("user@example.com");
  //   3. const otp = mailhog.extractOtp(email);
  //   4. Pass otp in the request body via the payload builder's overrides argument.
  //   See helper/api/MailhogClient.ts for the full API.
  test("VerifyEmail — 200  happy path", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email");
    const { status, body } = await client.verifyEmail("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, verifyEmailPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = VerifyEmailResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized
  test("VerifyEmail — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  test("VerifyEmail — 404 not found", async () => {
    await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
    const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", verifyEmailPayload());
    expect([404, 400, 500]).toContain(status);
  });

});

test.describe("SelfRegistration — organizations", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("organizations");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: GET /api/organizations/{organizationUuid}/config
  test("Fetch — 200  happy path", async () => {
    await Reporter.setStory("GET /api/organizations/{organizationUuid}/config");
    const { status, body } = await client.fetch(orgId);
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = FetchResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/organizations/{organizationUuid}/config — unauthorized
  test("Fetch — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: GET /api/organizations/{organizationUuid}/config — not found
  test("Fetch — 404 not found", async () => {
    await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — not found");
    const { status } = await client.fetch("00000000-0000-0000-0000-000000000000");
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: POST /api/organizations/{organizationUuid}/config
  test("Upsert — 200  happy path", async () => {
    await Reporter.setStory("POST /api/organizations/{organizationUuid}/config");
    const { status, body } = await client.upsert(orgId, upsertPayload());
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = UpsertResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: POST /api/organizations/{organizationUuid}/config — unauthorized
  test("Upsert — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.post(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: POST /api/organizations/{organizationUuid}/config — not found
  test("Upsert — 404 not found", async () => {
    await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — not found");
    const { status } = await client.upsert("00000000-0000-0000-0000-000000000000", upsertPayload());
    expect([404, 400, 500]).toContain(status);
  });

  // Happy path: Delete custom attribute for an organization.
  test("DeleteCustomAttribute — 200  happy path", async () => {
    await Reporter.setStory("Delete custom attribute for an organization.");
    const { status, body } = await client.deleteCustomAttribute(orgId, "test-customAttributeUuid" /* TODO: replace with real customAttributeUuid */);
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = DeleteCustomAttributeResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: Delete custom attribute for an organization. — unauthorized
  test("DeleteCustomAttribute — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("Delete custom attribute for an organization. — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.delete(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/organizations/invalid-organizationUuid/custom-attributes/invalid-customAttributeUuid`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Error path: Delete custom attribute for an organization. — not found
  test("DeleteCustomAttribute — 404 not found", async () => {
    await Reporter.setStory("Delete custom attribute for an organization. — not found");
    const { status } = await client.deleteCustomAttribute("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000");
    expect([404, 400, 500]).toContain(status);
  });

});

test.describe("SelfRegistration — public", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("public");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: GET /api/public/health/v1/ping
  test("Ping — 200  happy path", async () => {
    await Reporter.setStory("GET /api/public/health/v1/ping");
    const { status, body } = await client.ping();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = PingResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/public/health/v1/ping — unauthorized
  test("Ping — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/public/health/v1/ping — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/public/health/v1/ping`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: GET /api/public/build_version
  test("GetBuildVersion — 200  happy path", async () => {
    await Reporter.setStory("GET /api/public/build_version");
    const { status, body } = await client.getBuildVersion();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = GetBuildVersionResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/public/build_version — unauthorized
  test("GetBuildVersion — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/public/build_version — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/public/build_version`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

});

test.describe("SelfRegistration — sshealth", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("sshealth");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: GET /api/health/v1/local
  test("LocalHealth — 200  happy path", async () => {
    await Reporter.setStory("GET /api/health/v1/local");
    const { status, body } = await client.localHealth();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = LocalHealthResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/health/v1/local — unauthorized
  test("LocalHealth — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/health/v1/local — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/health/v1/local`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: GET /api/health/v1/remote
  test("RemoteHealth — 200  happy path", async () => {
    await Reporter.setStory("GET /api/health/v1/remote");
    const { status, body } = await client.remoteHealth();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = RemoteHealthResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/health/v1/remote — unauthorized
  test("RemoteHealth — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/health/v1/remote — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/health/v1/remote`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: GET /api/health/v1/all
  test("LocalAndRemoteHealth — 200  happy path", async () => {
    await Reporter.setStory("GET /api/health/v1/all");
    const { status, body } = await client.localAndRemoteHealth();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = LocalAndRemoteHealthResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/health/v1/all — unauthorized
  test("LocalAndRemoteHealth — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/health/v1/all — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/health/v1/all`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

  // Happy path: GET /api/health/v1/auth/basic
  test("BasicAuthHealth — 200  happy path", async () => {
    await Reporter.setStory("GET /api/health/v1/auth/basic");
    const { status, body } = await client.basicAuthHealth();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = BasicAuthHealthResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/health/v1/auth/basic — unauthorized
  test("BasicAuthHealth — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/health/v1/auth/basic — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/health/v1/auth/basic`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

});

test.describe("SelfRegistration — uts-audit", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("uts-audit");
    await Reporter.addTags("api", "auto-generated");
  });

  // Happy path: GET /api/audit-mesgs
  test("FetchEntries — 200  happy path", async () => {
    await Reporter.setStory("GET /api/audit-mesgs");
    const { status, body } = await client.fetchEntries();
    expect(status).toBe(200);
    // Zod contract validation
    if (body !== null) {
      const parsed = FetchEntriesResponseSchema.safeParse(body);
      expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
    }
  });

  // Error path: GET /api/audit-mesgs — unauthorized
  test("FetchEntries — 401 unauthorized", async ({ request }) => {
    await Reporter.setStory("GET /api/audit-mesgs — unauthorized");
    // Create a client with a bad token to trigger 401
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string };
    // Directly call the endpoint with an invalid bearer token
    const res = await request.get(
      // replace with the actual URL builder call if needed
      `${serviceConfig.url}/api/audit-mesgs`,
      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
    );
    expect([401, 403]).toContain(res.status());
  });

});
