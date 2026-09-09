# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — organizations >> DeleteCustomAttribute — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:601:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  504 |     // Create a client with a bad token to trigger 401
  505 |     const envVars = APIClient.getEnvVariables();
  506 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  507 |     // Directly call the endpoint with an invalid bearer token
  508 |     const res = await request.post(
  509 |       // replace with the actual URL builder call if needed
  510 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
  511 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  512 |     );
  513 |     expect([401, 403]).toContain(res.status());
  514 |   });
  515 | 
  516 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  517 |   test("VerifyEmail — 404 not found", async () => {
  518 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
  519 |     const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  520 |     expect([404, 400]).toContain(status);
  521 |   });
  522 | 
  523 | });
  524 | 
  525 | test.describe("SelfRegistration — organizations", () => {
  526 |   test.beforeEach(async () => {
  527 |     await Reporter.setEpic("SelfRegistration");
  528 |     await Reporter.setFeature("organizations");
  529 |     await Reporter.addTags("api", "auto-generated");
  530 |   });
  531 | 
  532 |   // Happy path: GET /api/organizations/{organizationUuid}/config
  533 |   test("Fetch — 200  happy path", async () => {
  534 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config");
  535 |     const { status, body } = await client.fetch(orgId);
  536 |     expect(status).toBe(200);
  537 |     // Zod contract validation
  538 |     if (body !== null) {
  539 |       const parsed = FetchUserStatusResponseSchema.safeParse(body);
  540 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  541 |     }
  542 |   });
  543 | 
  544 |   // Error path: GET /api/organizations/{organizationUuid}/config — unauthorized
  545 |   test("Fetch — 401 unauthorized", async ({ request }) => {
  546 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — unauthorized");
  547 |     // Create a client with a bad token to trigger 401
  548 |     const envVars = APIClient.getEnvVariables();
  549 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  550 |     // Directly call the endpoint with an invalid bearer token
  551 |     const res = await request.get(
  552 |       // replace with the actual URL builder call if needed
  553 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
  554 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  555 |     );
  556 |     expect([401, 403]).toContain(res.status());
  557 |   });
  558 | 
  559 |   // Error path: GET /api/organizations/{organizationUuid}/config — not found
  560 |   test("Fetch — 404 not found", async () => {
  561 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — not found");
  562 |     const { status } = await client.fetch("00000000-0000-0000-0000-000000000000");
  563 |     expect([404, 400]).toContain(status);
  564 |   });
  565 | 
  566 |   // Happy path: POST /api/organizations/{organizationUuid}/config
  567 |   test("Upsert — 200  happy path", async () => {
  568 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config");
  569 |     const { status, body } = await client.upsert(orgId, {});
  570 |     expect(status).toBe(200);
  571 |     // Zod contract validation
  572 |     if (body !== null) {
  573 |       const parsed = UpsertResponseSchema.safeParse(body);
  574 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  575 |     }
  576 |   });
  577 | 
  578 |   // Error path: POST /api/organizations/{organizationUuid}/config — unauthorized
  579 |   test("Upsert — 401 unauthorized", async ({ request }) => {
  580 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — unauthorized");
  581 |     // Create a client with a bad token to trigger 401
  582 |     const envVars = APIClient.getEnvVariables();
  583 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  584 |     // Directly call the endpoint with an invalid bearer token
  585 |     const res = await request.post(
  586 |       // replace with the actual URL builder call if needed
  587 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
  588 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  589 |     );
  590 |     expect([401, 403]).toContain(res.status());
  591 |   });
  592 | 
  593 |   // Error path: POST /api/organizations/{organizationUuid}/config — not found
  594 |   test("Upsert — 404 not found", async () => {
  595 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — not found");
  596 |     const { status } = await client.upsert("00000000-0000-0000-0000-000000000000", {});
  597 |     expect([404, 400]).toContain(status);
  598 |   });
  599 | 
  600 |   // Happy path: Delete custom attribute for an organization.
  601 |   test("DeleteCustomAttribute — 200  happy path", async () => {
  602 |     await Reporter.setStory("Delete custom attribute for an organization.");
  603 |     const { status, body } = await client.deleteCustomAttribute(orgId, "test-customAttributeUuid"); // TODO: replace "test-customAttributeUuid" with a real custom attribute UUID
> 604 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  605 |     // Zod contract validation
  606 |     if (body !== null) {
  607 |       const parsed = DeleteCustomAttributeResponseSchema.safeParse(body);
  608 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  609 |     }
  610 |   });
  611 | 
  612 |   // Error path: Delete custom attribute for an organization. — unauthorized
  613 |   test("DeleteCustomAttribute — 401 unauthorized", async ({ request }) => {
  614 |     await Reporter.setStory("Delete custom attribute for an organization. — unauthorized");
  615 |     // Create a client with a bad token to trigger 401
  616 |     const envVars = APIClient.getEnvVariables();
  617 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  618 |     // Directly call the endpoint with an invalid bearer token
  619 |     const res = await request.delete(
  620 |       // replace with the actual URL builder call if needed
  621 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/custom-attributes/invalid-customAttributeUuid`,
  622 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  623 |     );
  624 |     expect([401, 403]).toContain(res.status());
  625 |   });
  626 | 
  627 |   // Error path: Delete custom attribute for an organization. — not found
  628 |   test("DeleteCustomAttribute — 404 not found", async () => {
  629 |     await Reporter.setStory("Delete custom attribute for an organization. — not found");
  630 |     const { status } = await client.deleteCustomAttribute("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000");
  631 |     expect([404, 400]).toContain(status);
  632 |   });
  633 | 
  634 | });
  635 | 
  636 | test.describe("SelfRegistration — public", () => {
  637 |   test.beforeEach(async () => {
  638 |     await Reporter.setEpic("SelfRegistration");
  639 |     await Reporter.setFeature("public");
  640 |     await Reporter.addTags("api", "auto-generated");
  641 |   });
  642 | 
  643 |   // Happy path: GET /api/public/health/v1/ping
  644 |   test("Ping — 200  happy path", async () => {
  645 |     await Reporter.setStory("GET /api/public/health/v1/ping");
  646 |     const { status, body } = await client.ping();
  647 |     expect(status).toBe(200);
  648 |     // Zod contract validation
  649 |     if (body !== null) {
  650 |       const parsed = PingResponseSchema.safeParse(body);
  651 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  652 |     }
  653 |   });
  654 | 
  655 |   // Error path: GET /api/public/health/v1/ping — unauthorized
  656 |   test("Ping — 401 unauthorized", async ({ request }) => {
  657 |     await Reporter.setStory("GET /api/public/health/v1/ping — unauthorized");
  658 |     // Create a client with a bad token to trigger 401
  659 |     const envVars = APIClient.getEnvVariables();
  660 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  661 |     // Directly call the endpoint with an invalid bearer token
  662 |     const res = await request.get(
  663 |       // replace with the actual URL builder call if needed
  664 |       `${serviceConfig.url}/api/public/health/v1/ping`,
  665 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  666 |     );
  667 |     // NOTE: /api/public/health/v1/ping is a public endpoint — no auth required, 200 is expected
  668 |     expect([200, 401, 403]).toContain(res.status());
  669 |   });
  670 | 
  671 |   // Happy path: GET /api/public/build_version
  672 |   test("GetBuildVersion — 200  happy path", async () => {
  673 |     await Reporter.setStory("GET /api/public/build_version");
  674 |     const { status, body } = await client.getBuildVersion();
  675 |     expect(status).toBe(200);
  676 |     // Zod contract validation
  677 |     if (body !== null) {
  678 |       const parsed = GetBuildVersionResponseSchema.safeParse(body);
  679 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  680 |     }
  681 |   });
  682 | 
  683 |   // Error path: GET /api/public/build_version — unauthorized
  684 |   test("GetBuildVersion — 401 unauthorized", async ({ request }) => {
  685 |     await Reporter.setStory("GET /api/public/build_version — unauthorized");
  686 |     // Create a client with a bad token to trigger 401
  687 |     const envVars = APIClient.getEnvVariables();
  688 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  689 |     // Directly call the endpoint with an invalid bearer token
  690 |     const res = await request.get(
  691 |       // replace with the actual URL builder call if needed
  692 |       `${serviceConfig.url}/api/public/build_version`,
  693 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  694 |     );
  695 |     // NOTE: /api/public/* endpoints have no auth guard — 200 is also a valid response
  696 |     expect([200, 401, 403]).toContain(res.status());
  697 |   });
  698 | 
  699 | });
  700 | 
  701 | test.describe("SelfRegistration — sshealth", () => {
  702 |   test.beforeEach(async () => {
  703 |     await Reporter.setEpic("SelfRegistration");
  704 |     await Reporter.setFeature("sshealth");
```