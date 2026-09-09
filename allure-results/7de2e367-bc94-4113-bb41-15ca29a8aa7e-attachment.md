# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — otp integration >> VerifyEmail — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:541:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  532 |   });
  533 | 
  534 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/verify-email
  535 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  536 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  537 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  538 |   //   3. const otp = mailhog.extractOtp(email);
  539 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  540 |   //   See helper/api/MailhogClient.ts for the full API.
  541 |   test("VerifyEmail — 200  happy path", async () => {
  542 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email");
  543 |     const { status, body } = await client.verifyEmail("test-userUuid" /* TODO: replace with real userUuid */, "test-featureType" /* TODO: replace with real featureType */, verifyEmailPayload());
> 544 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  545 |     // Zod contract validation
  546 |     if (body !== null) {
  547 |       const parsed = VerifyEmailResponseSchema.safeParse(body);
  548 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  549 |     }
  550 |   });
  551 | 
  552 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized
  553 |   test("VerifyEmail — 401 unauthorized", async ({ request }) => {
  554 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized");
  555 |     // Create a client with a bad token to trigger 401
  556 |     const envVars = APIClient.getEnvVariables();
  557 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  558 |     // Directly call the endpoint with an invalid bearer token
  559 |     const res = await request.post(
  560 |       // replace with the actual URL builder call if needed
  561 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
  562 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  563 |     );
  564 |     expect([401, 403]).toContain(res.status());
  565 |   });
  566 | 
  567 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  568 |   test("VerifyEmail — 404 not found", async () => {
  569 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
  570 |     const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", verifyEmailPayload());
  571 |     expect([404, 400, 500]).toContain(status);
  572 |   });
  573 | 
  574 | });
  575 | 
  576 | test.describe("SelfRegistration — organizations", () => {
  577 |   test.beforeEach(async () => {
  578 |     await Reporter.setEpic("SelfRegistration");
  579 |     await Reporter.setFeature("organizations");
  580 |     await Reporter.addTags("api", "auto-generated");
  581 |   });
  582 | 
  583 |   // Happy path: GET /api/organizations/{organizationUuid}/config
  584 |   test("Fetch — 200  happy path", async () => {
  585 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config");
  586 |     const { status, body } = await client.fetch(orgId);
  587 |     expect(status).toBe(200);
  588 |     // Zod contract validation
  589 |     if (body !== null) {
  590 |       const parsed = FetchResponseSchema.safeParse(body);
  591 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  592 |     }
  593 |   });
  594 | 
  595 |   // Error path: GET /api/organizations/{organizationUuid}/config — unauthorized
  596 |   test("Fetch — 401 unauthorized", async ({ request }) => {
  597 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — unauthorized");
  598 |     // Create a client with a bad token to trigger 401
  599 |     const envVars = APIClient.getEnvVariables();
  600 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  601 |     // Directly call the endpoint with an invalid bearer token
  602 |     const res = await request.get(
  603 |       // replace with the actual URL builder call if needed
  604 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
  605 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  606 |     );
  607 |     expect([401, 403]).toContain(res.status());
  608 |   });
  609 | 
  610 |   // Error path: GET /api/organizations/{organizationUuid}/config — not found
  611 |   test("Fetch — 404 not found", async () => {
  612 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — not found");
  613 |     const { status } = await client.fetch("00000000-0000-0000-0000-000000000000");
  614 |     expect([404, 400, 500]).toContain(status);
  615 |   });
  616 | 
  617 |   // Happy path: POST /api/organizations/{organizationUuid}/config
  618 |   test("Upsert — 200  happy path", async () => {
  619 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config");
  620 |     const { status, body } = await client.upsert(orgId, upsertPayload());
  621 |     expect(status).toBe(200);
  622 |     // Zod contract validation
  623 |     if (body !== null) {
  624 |       const parsed = UpsertResponseSchema.safeParse(body);
  625 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  626 |     }
  627 |   });
  628 | 
  629 |   // Error path: POST /api/organizations/{organizationUuid}/config — unauthorized
  630 |   test("Upsert — 401 unauthorized", async ({ request }) => {
  631 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — unauthorized");
  632 |     // Create a client with a bad token to trigger 401
  633 |     const envVars = APIClient.getEnvVariables();
  634 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  635 |     // Directly call the endpoint with an invalid bearer token
  636 |     const res = await request.post(
  637 |       // replace with the actual URL builder call if needed
  638 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
  639 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  640 |     );
  641 |     expect([401, 403]).toContain(res.status());
  642 |   });
  643 | 
  644 |   // Error path: POST /api/organizations/{organizationUuid}/config — not found
```