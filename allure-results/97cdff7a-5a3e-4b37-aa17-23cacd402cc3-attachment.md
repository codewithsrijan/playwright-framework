# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> ApproveRegisteredUserWithUpdateRequest — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:338:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  241 |   });
  242 | 
  243 |   // Happy path: POST /api/registrations/{registrationUuid}/send-otp-email
  244 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  245 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  246 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  247 |   //   3. const otp = mailhog.extractOtp(email);
  248 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  249 |   //   See helper/api/MailhogClient.ts for the full API.
  250 |   test("SendOtpEmail — 200  happy path", async () => {
  251 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email");
  252 |     const { status, body } = await client.sendOtpEmail("test-registrationUuid" /* TODO: replace with real registrationUuid */, sendOtpEmailPayload({ organizationUuid: orgId }));
  253 |     expect(status).toBe(200);
  254 |     // Zod contract validation
  255 |     if (body !== null) {
  256 |       const parsed = SendOtpEmailResponseSchema.safeParse(body);
  257 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  258 |     }
  259 |   });
  260 | 
  261 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized
  262 |   test("SendOtpEmail — 401 unauthorized", async ({ request }) => {
  263 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized");
  264 |     // Create a client with a bad token to trigger 401
  265 |     const envVars = APIClient.getEnvVariables();
  266 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  267 |     // Directly call the endpoint with an invalid bearer token
  268 |     const res = await request.post(
  269 |       // replace with the actual URL builder call if needed
  270 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/send-otp-email`,
  271 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  272 |     );
  273 |     expect([401, 403]).toContain(res.status());
  274 |   });
  275 | 
  276 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — not found
  277 |   test("SendOtpEmail — 404 not found", async () => {
  278 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — not found");
  279 |     const { status } = await client.sendOtpEmail("00000000-0000-0000-0000-000000000000", sendOtpEmailPayload());
  280 |     expect([404, 400, 500]).toContain(status);
  281 |   });
  282 | 
  283 |   // Happy path: POST /api/registrations/fetch-registered-users-for-approval
  284 |   test("FetchRegisteredUsersforapproval — 200  happy path", async () => {
  285 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval");
  286 |     const { status, body } = await client.fetchRegisteredUsersforapproval(fetchRegisteredUsersforapprovalPayload({ organizationUuid: orgId }));
  287 |     expect(status).toBe(200);
  288 |     // Zod contract validation
  289 |     if (body !== null) {
  290 |       const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(body);
  291 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  292 |     }
  293 |   });
  294 | 
  295 |   // Error path: POST /api/registrations/fetch-registered-users-for-approval — unauthorized
  296 |   test("FetchRegisteredUsersforapproval — 401 unauthorized", async ({ request }) => {
  297 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval — unauthorized");
  298 |     // Create a client with a bad token to trigger 401
  299 |     const envVars = APIClient.getEnvVariables();
  300 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  301 |     // Directly call the endpoint with an invalid bearer token
  302 |     const res = await request.post(
  303 |       // replace with the actual URL builder call if needed
  304 |       `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`,
  305 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  306 |     );
  307 |     expect([401, 403]).toContain(res.status());
  308 |   });
  309 | 
  310 |   // Happy path: PUT /api/registrations/approve-pending-registered-users
  311 |   test("ApprovePendingRegisteredUsers — 200  happy path", async () => {
  312 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users");
  313 |     const { status, body } = await client.approvePendingRegisteredUsers(approvePendingRegisteredUsersPayload({ organizationUuid: orgId }));
  314 |     expect(status).toBe(200);
  315 |     // Zod contract validation
  316 |     if (body !== null) {
  317 |       const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(body);
  318 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  319 |     }
  320 |   });
  321 | 
  322 |   // Error path: PUT /api/registrations/approve-pending-registered-users — unauthorized
  323 |   test("ApprovePendingRegisteredUsers — 401 unauthorized", async ({ request }) => {
  324 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users — unauthorized");
  325 |     // Create a client with a bad token to trigger 401
  326 |     const envVars = APIClient.getEnvVariables();
  327 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  328 |     // Directly call the endpoint with an invalid bearer token
  329 |     const res = await request.put(
  330 |       // replace with the actual URL builder call if needed
  331 |       `${serviceConfig.url}/api/registrations/approve-pending-registered-users`,
  332 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  333 |     );
  334 |     expect([401, 403]).toContain(res.status());
  335 |   });
  336 | 
  337 |   // Happy path: PUT /api/registrations/approve-registered-user-with-update
  338 |   test("ApproveRegisteredUserWithUpdateRequest — 200  happy path", async () => {
  339 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update");
  340 |     const { status, body } = await client.approveRegisteredUserWithUpdateRequest(approveRegisteredUserWithUpdateRequestPayload({ organizationUuid: orgId }));
> 341 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  342 |     // Zod contract validation
  343 |     if (body !== null) {
  344 |       const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(body);
  345 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  346 |     }
  347 |   });
  348 | 
  349 |   // Error path: PUT /api/registrations/approve-registered-user-with-update — unauthorized
  350 |   test("ApproveRegisteredUserWithUpdateRequest — 401 unauthorized", async ({ request }) => {
  351 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
  352 |     // Create a client with a bad token to trigger 401
  353 |     const envVars = APIClient.getEnvVariables();
  354 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  355 |     // Directly call the endpoint with an invalid bearer token
  356 |     const res = await request.put(
  357 |       // replace with the actual URL builder call if needed
  358 |       `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`,
  359 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  360 |     );
  361 |     expect([401, 403]).toContain(res.status());
  362 |   });
  363 | 
  364 |   // Happy path: PUT /api/registrations/reject-pending-registration-users
  365 |   test("RejectUserRegistration — 200  happy path", async () => {
  366 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users");
  367 |     const { status, body } = await client.rejectUserRegistration(rejectUserRegistrationPayload({ organizationUuid: orgId }));
  368 |     expect(status).toBe(200);
  369 |     // Zod contract validation
  370 |     if (body !== null) {
  371 |       const parsed = RejectUserRegistrationResponseSchema.safeParse(body);
  372 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  373 |     }
  374 |   });
  375 | 
  376 |   // Error path: PUT /api/registrations/reject-pending-registration-users — unauthorized
  377 |   test("RejectUserRegistration — 401 unauthorized", async ({ request }) => {
  378 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users — unauthorized");
  379 |     // Create a client with a bad token to trigger 401
  380 |     const envVars = APIClient.getEnvVariables();
  381 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  382 |     // Directly call the endpoint with an invalid bearer token
  383 |     const res = await request.put(
  384 |       // replace with the actual URL builder call if needed
  385 |       `${serviceConfig.url}/api/registrations/reject-pending-registration-users`,
  386 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  387 |     );
  388 |     expect([401, 403]).toContain(res.status());
  389 |   });
  390 | 
  391 |   // Happy path: PUT /api/registrations/bulk-update-custom-attribute-values
  392 |   test("BulkUpdateCustomAttributeValues — 200  happy path", async () => {
  393 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values");
  394 |     const { status, body } = await client.bulkUpdateCustomAttributeValues(bulkUpdateCustomAttributeValuesPayload({ organizationUuid: orgId }));
  395 |     expect(status).toBe(200);
  396 |     // Zod contract validation
  397 |     if (body !== null) {
  398 |       const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(body);
  399 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  400 |     }
  401 |   });
  402 | 
  403 |   // Error path: PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized
  404 |   test("BulkUpdateCustomAttributeValues — 401 unauthorized", async ({ request }) => {
  405 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized");
  406 |     // Create a client with a bad token to trigger 401
  407 |     const envVars = APIClient.getEnvVariables();
  408 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  409 |     // Directly call the endpoint with an invalid bearer token
  410 |     const res = await request.put(
  411 |       // replace with the actual URL builder call if needed
  412 |       `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`,
  413 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  414 |     );
  415 |     expect([401, 403]).toContain(res.status());
  416 |   });
  417 | 
  418 | });
  419 | 
  420 | test.describe("SelfRegistration — Site Shutdown", () => {
  421 |   test.beforeEach(async () => {
  422 |     await Reporter.setEpic("SelfRegistration");
  423 |     await Reporter.setFeature("Site Shutdown");
  424 |     await Reporter.addTags("api", "auto-generated");
  425 |   });
  426 | 
  427 |   // Happy path: POST /api/v2/site-shutdown/sync/shutdown
  428 |   test("ShutdownSelfRegistration — 200  happy path", async () => {
  429 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown");
  430 |     const { status, body } = await client.shutdownSelfRegistration(shutdownSelfRegistrationPayload());
  431 |     expect(status).toBe(200);
  432 |     // Zod contract validation
  433 |     if (body !== null) {
  434 |       const parsed = ShutdownSelfRegistrationResponseSchema.safeParse(body);
  435 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  436 |     }
  437 |   });
  438 | 
  439 |   // Error path: POST /api/v2/site-shutdown/sync/shutdown — unauthorized
  440 |   test("ShutdownSelfRegistration — 401 unauthorized", async ({ request }) => {
  441 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown — unauthorized");
```