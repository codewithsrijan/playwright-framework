# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — organizations >> Upsert — 404 not found
- Location: tests/tests-api/selfRegistration.spec.ts:645:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [404, 400, 500]
```

# Test source

```ts
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
  645 |   test("Upsert — 404 not found", async () => {
  646 |     await Reporter.setStory("POST /api/organizations/{organizationUuid}/config — not found");
  647 |     const { status } = await client.upsert("00000000-0000-0000-0000-000000000000", upsertPayload());
> 648 |     expect([404, 400, 500]).toContain(status);
      |                             ^ Error: expect(received).toContain(expected) // indexOf
  649 |   });
  650 | 
  651 |   // Happy path: Delete custom attribute for an organization.
  652 |   test("DeleteCustomAttribute — 200  happy path", async () => {
  653 |     await Reporter.setStory("Delete custom attribute for an organization.");
  654 |     const { status, body } = await client.deleteCustomAttribute(orgId, "test-customAttributeUuid" /* TODO: replace with real customAttributeUuid */);
  655 |     expect(status).toBe(200);
  656 |     // Zod contract validation
  657 |     if (body !== null) {
  658 |       const parsed = DeleteCustomAttributeResponseSchema.safeParse(body);
  659 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  660 |     }
  661 |   });
  662 | 
  663 |   // Error path: Delete custom attribute for an organization. — unauthorized
  664 |   test("DeleteCustomAttribute — 401 unauthorized", async ({ request }) => {
  665 |     await Reporter.setStory("Delete custom attribute for an organization. — unauthorized");
  666 |     // Create a client with a bad token to trigger 401
  667 |     const envVars = APIClient.getEnvVariables();
  668 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  669 |     // Directly call the endpoint with an invalid bearer token
  670 |     const res = await request.delete(
  671 |       // replace with the actual URL builder call if needed
  672 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/custom-attributes/invalid-customAttributeUuid`,
  673 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  674 |     );
  675 |     expect([401, 403]).toContain(res.status());
  676 |   });
  677 | 
  678 |   // Error path: Delete custom attribute for an organization. — not found
  679 |   test("DeleteCustomAttribute — 404 not found", async () => {
  680 |     await Reporter.setStory("Delete custom attribute for an organization. — not found");
  681 |     const { status } = await client.deleteCustomAttribute("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000");
  682 |     expect([404, 400, 500]).toContain(status);
  683 |   });
  684 | 
  685 | });
  686 | 
  687 | test.describe("SelfRegistration — public", () => {
  688 |   test.beforeEach(async () => {
  689 |     await Reporter.setEpic("SelfRegistration");
  690 |     await Reporter.setFeature("public");
  691 |     await Reporter.addTags("api", "auto-generated");
  692 |   });
  693 | 
  694 |   // Happy path: GET /api/public/health/v1/ping
  695 |   test("Ping — 200  happy path", async () => {
  696 |     await Reporter.setStory("GET /api/public/health/v1/ping");
  697 |     const { status, body } = await client.ping();
  698 |     expect(status).toBe(200);
  699 |     // Zod contract validation
  700 |     if (body !== null) {
  701 |       const parsed = PingResponseSchema.safeParse(body);
  702 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  703 |     }
  704 |   });
  705 | 
  706 |   // Error path: GET /api/public/health/v1/ping — unauthorized
  707 |   test("Ping — 401 unauthorized", async ({ request }) => {
  708 |     await Reporter.setStory("GET /api/public/health/v1/ping — unauthorized");
  709 |     // Create a client with a bad token to trigger 401
  710 |     const envVars = APIClient.getEnvVariables();
  711 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  712 |     // Directly call the endpoint with an invalid bearer token
  713 |     const res = await request.get(
  714 |       // replace with the actual URL builder call if needed
  715 |       `${serviceConfig.url}/api/public/health/v1/ping`,
  716 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  717 |     );
  718 |     // NOTE: /api/public/* endpoints have no auth guard — they return 200 regardless of token
  719 |     expect([200, 401, 403]).toContain(res.status());
  720 |   });
  721 | 
  722 |   // Happy path: GET /api/public/build_version
  723 |   test("GetBuildVersion — 200  happy path", async () => {
  724 |     await Reporter.setStory("GET /api/public/build_version");
  725 |     const { status, body } = await client.getBuildVersion();
  726 |     expect(status).toBe(200);
  727 |     // Zod contract validation
  728 |     if (body !== null) {
  729 |       const parsed = GetBuildVersionResponseSchema.safeParse(body);
  730 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  731 |     }
  732 |   });
  733 | 
  734 |   // Error path: GET /api/public/build_version — unauthorized
  735 |   test("GetBuildVersion — 401 unauthorized", async ({ request }) => {
  736 |     await Reporter.setStory("GET /api/public/build_version — unauthorized");
  737 |     // Create a client with a bad token to trigger 401
  738 |     const envVars = APIClient.getEnvVariables();
  739 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  740 |     // Directly call the endpoint with an invalid bearer token
  741 |     const res = await request.get(
  742 |       // replace with the actual URL builder call if needed
  743 |       `${serviceConfig.url}/api/public/build_version`,
  744 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  745 |     );
  746 |     // NOTE: /api/public/* endpoints have no auth guard — they return 200 regardless of token
  747 |     expect([200, 401, 403]).toContain(res.status());
  748 |   });
```