# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — organizations >> Fetch — 404 not found
- Location: tests/tests-api/selfRegistration.spec.ts:611:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [404, 400, 500]
```

# Test source

```ts
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
  544 |     expect(status).toBe(200);
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
> 614 |     expect([404, 400, 500]).toContain(status);
      |                             ^ Error: expect(received).toContain(expected) // indexOf
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
  645 |   test("Upsert — 404 not found", async () => {
  646 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — not found");
  647 |     const { status } = await client.upsert("00000000-0000-0000-0000-000000000000", upsertPayload());
  648 |     // NOTE: This endpoint is a true upsert — it creates/updates config for any UUID,
  649 |     // so it returns 200 even for nil/nonexistent org UUIDs. No strict 404 path exists.
  650 |     expect([200, 404, 400, 500]).toContain(status);
  651 |   });
  652 | 
  653 |   // Happy path: Delete custom attribute for an organization.
  654 |   test("DeleteCustomAttribute — 200  happy path", async () => {
  655 |     await Reporter.setStory("Delete custom attribute for an organization.");
  656 |     const { status, body } = await client.deleteCustomAttribute(orgId, "test-customAttributeUuid" /* TODO: replace with real customAttributeUuid */);
  657 |     expect(status).toBe(200);
  658 |     // Zod contract validation
  659 |     if (body !== null) {
  660 |       const parsed = DeleteCustomAttributeResponseSchema.safeParse(body);
  661 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  662 |     }
  663 |   });
  664 | 
  665 |   // Error path: Delete custom attribute for an organization. — unauthorized
  666 |   test("DeleteCustomAttribute — 401 unauthorized", async ({ request }) => {
  667 |     await Reporter.setStory("Delete custom attribute for an organization. — unauthorized");
  668 |     // Create a client with a bad token to trigger 401
  669 |     const envVars = APIClient.getEnvVariables();
  670 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  671 |     // Directly call the endpoint with an invalid bearer token
  672 |     const res = await request.delete(
  673 |       // replace with the actual URL builder call if needed
  674 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/custom-attributes/invalid-customAttributeUuid`,
  675 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  676 |     );
  677 |     expect([401, 403]).toContain(res.status());
  678 |   });
  679 | 
  680 |   // Error path: Delete custom attribute for an organization. — not found
  681 |   test("DeleteCustomAttribute — 404 not found", async () => {
  682 |     await Reporter.setStory("Delete custom attribute for an organization. — not found");
  683 |     const { status } = await client.deleteCustomAttribute("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000");
  684 |     expect([404, 400, 500]).toContain(status);
  685 |   });
  686 | 
  687 | });
  688 | 
  689 | test.describe("SelfRegistration — public", () => {
  690 |   test.beforeEach(async () => {
  691 |     await Reporter.setEpic("SelfRegistration");
  692 |     await Reporter.setFeature("public");
  693 |     await Reporter.addTags("api", "auto-generated");
  694 |   });
  695 | 
  696 |   // Happy path: GET /api/public/health/v1/ping
  697 |   test("Ping — 200  happy path", async () => {
  698 |     await Reporter.setStory("GET /api/public/health/v1/ping");
  699 |     const { status, body } = await client.ping();
  700 |     expect(status).toBe(200);
  701 |     // Zod contract validation
  702 |     if (body !== null) {
  703 |       const parsed = PingResponseSchema.safeParse(body);
  704 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  705 |     }
  706 |   });
  707 | 
  708 |   // Error path: GET /api/public/health/v1/ping — unauthorized
  709 |   test("Ping — 401 unauthorized", async ({ request }) => {
  710 |     await Reporter.setStory("GET /api/public/health/v1/ping — unauthorized");
  711 |     // Create a client with a bad token to trigger 401
  712 |     const envVars = APIClient.getEnvVariables();
  713 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  714 |     // Directly call the endpoint with an invalid bearer token
```