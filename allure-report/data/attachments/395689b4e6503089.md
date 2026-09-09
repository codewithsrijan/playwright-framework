# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — Site Shutdown >> ShutdownSelfRegistration — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:428:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
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
  341 |     expect(status).toBe(200);
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
> 431 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
  442 |     // Create a client with a bad token to trigger 401
  443 |     const envVars = APIClient.getEnvVariables();
  444 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  445 |     // Directly call the endpoint with an invalid bearer token
  446 |     const res = await request.post(
  447 |       // replace with the actual URL builder call if needed
  448 |       `${serviceConfig.url}/api/v2/site-shutdown/sync/shutdown`,
  449 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  450 |     );
  451 |     // NOTE: service returns 500 when body is missing + token is invalid (body is validated before auth)
  452 |     expect([401, 403, 500]).toContain(res.status());
  453 |   });
  454 | 
  455 | });
  456 | 
  457 | test.describe("SelfRegistration — otp integration", () => {
  458 |   test.beforeEach(async () => {
  459 |     await Reporter.setEpic("SelfRegistration");
  460 |     await Reporter.setFeature("otp integration");
  461 |     await Reporter.addTags("api", "auto-generated");
  462 |   });
  463 | 
  464 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/generate
  465 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  466 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  467 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  468 |   //   3. const otp = mailhog.extractOtp(email);
  469 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  470 |   //   See helper/api/MailhogClient.ts for the full API.
  471 |   test("GenerateOtp — 204  happy path", async () => {
  472 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate");
  473 |     const { status, body } = await client.generateOtp("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, generateOtpPayload({ organizationUuid: orgId }));
  474 |     expect(status).toBe(204);
  475 |   });
  476 | 
  477 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized
  478 |   test("GenerateOtp — 401 unauthorized", async ({ request }) => {
  479 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized");
  480 |     // Create a client with a bad token to trigger 401
  481 |     const envVars = APIClient.getEnvVariables();
  482 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  483 |     // Directly call the endpoint with an invalid bearer token
  484 |     const res = await request.post(
  485 |       // replace with the actual URL builder call if needed
  486 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/generate`,
  487 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  488 |     );
  489 |     expect([401, 403]).toContain(res.status());
  490 |   });
  491 | 
  492 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — not found
  493 |   test("GenerateOtp — 404 not found", async () => {
  494 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — not found");
  495 |     const { status } = await client.generateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", generateOtpPayload());
  496 |     expect([404, 400, 500]).toContain(status);
  497 |   });
  498 | 
  499 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/validate
  500 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  501 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  502 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  503 |   //   3. const otp = mailhog.extractOtp(email);
  504 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  505 |   //   See helper/api/MailhogClient.ts for the full API.
  506 |   test("ValidateOTP — 204  happy path", async () => {
  507 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate");
  508 |     const { status, body } = await client.validateOTP("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, validateOTPPayload({ organizationUuid: orgId }));
  509 |     expect(status).toBe(204);
  510 |   });
  511 | 
  512 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized
  513 |   test("ValidateOTP — 401 unauthorized", async ({ request }) => {
  514 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized");
  515 |     // Create a client with a bad token to trigger 401
  516 |     const envVars = APIClient.getEnvVariables();
  517 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  518 |     // Directly call the endpoint with an invalid bearer token
  519 |     const res = await request.post(
  520 |       // replace with the actual URL builder call if needed
  521 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/validate`,
  522 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  523 |     );
  524 |     expect([401, 403]).toContain(res.status());
  525 |   });
  526 | 
  527 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — not found
  528 |   test("ValidateOTP — 404 not found", async () => {
  529 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — not found");
  530 |     const { status } = await client.validateOTP("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", validateOTPPayload());
  531 |     expect([404, 400, 500]).toContain(status);
```