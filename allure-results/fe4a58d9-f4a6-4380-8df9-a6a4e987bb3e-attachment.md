# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — public >> GetBuildVersion — 401 unauthorized
- Location: tests/tests-api/selfRegistration.spec.ts:737:7

# Error details

```
Error: apiRequestContext.get: socket hang up
Call log:
  - → GET https://self-registration.develop.squads-dev.com/api/public/build_version
    - user-agent: Playwright/1.60.0 (arm64; macOS 26.5) node/20.15
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Authorization: Bearer invalid-token
    - Content-Type: application/json

```

# Test source

```ts
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
  715 |     const res = await request.get(
  716 |       // replace with the actual URL builder call if needed
  717 |       `${serviceConfig.url}/api/public/health/v1/ping`,
  718 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  719 |     );
  720 |     // NOTE: /api/public/* endpoints have no auth guard — they return 200 regardless of token
  721 |     expect([200, 401, 403]).toContain(res.status());
  722 |   });
  723 | 
  724 |   // Happy path: GET /api/public/build_version
  725 |   test("GetBuildVersion — 200  happy path", async () => {
  726 |     await Reporter.setStory("GET /api/public/build_version");
  727 |     const { status, body } = await client.getBuildVersion();
  728 |     expect(status).toBe(200);
  729 |     // Zod contract validation
  730 |     if (body !== null) {
  731 |       const parsed = GetBuildVersionResponseSchema.safeParse(body);
  732 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  733 |     }
  734 |   });
  735 | 
  736 |   // Error path: GET /api/public/build_version — unauthorized
  737 |   test("GetBuildVersion — 401 unauthorized", async ({ request }) => {
  738 |     await Reporter.setStory("GET /api/public/build_version — unauthorized");
  739 |     // Create a client with a bad token to trigger 401
  740 |     const envVars = APIClient.getEnvVariables();
  741 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  742 |     // Directly call the endpoint with an invalid bearer token
> 743 |     const res = await request.get(
      |                               ^ Error: apiRequestContext.get: socket hang up
  744 |       // replace with the actual URL builder call if needed
  745 |       `${serviceConfig.url}/api/public/build_version`,
  746 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  747 |     );
  748 |     // NOTE: /api/public/* endpoints have no auth guard — they return 200 regardless of token
  749 |     expect([200, 401, 403]).toContain(res.status());
  750 |   });
  751 | 
  752 | });
  753 | 
  754 | test.describe("SelfRegistration — sshealth", () => {
  755 |   test.beforeEach(async () => {
  756 |     await Reporter.setEpic("SelfRegistration");
  757 |     await Reporter.setFeature("sshealth");
  758 |     await Reporter.addTags("api", "auto-generated");
  759 |   });
  760 | 
  761 |   // Happy path: GET /api/health/v1/local
  762 |   test("LocalHealth — 200  happy path", async () => {
  763 |     await Reporter.setStory("GET /api/health/v1/local");
  764 |     const { status, body } = await client.localHealth();
  765 |     expect(status).toBe(200);
  766 |     // Zod contract validation
  767 |     if (body !== null) {
  768 |       const parsed = LocalHealthResponseSchema.safeParse(body);
  769 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  770 |     }
  771 |   });
  772 | 
  773 |   // Error path: GET /api/health/v1/local — unauthorized
  774 |   test("LocalHealth — 401 unauthorized", async ({ request }) => {
  775 |     await Reporter.setStory("GET /api/health/v1/local — unauthorized");
  776 |     // Create a client with a bad token to trigger 401
  777 |     const envVars = APIClient.getEnvVariables();
  778 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  779 |     // Directly call the endpoint with an invalid bearer token
  780 |     const res = await request.get(
  781 |       // replace with the actual URL builder call if needed
  782 |       `${serviceConfig.url}/api/health/v1/local`,
  783 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  784 |     );
  785 |     expect([401, 403]).toContain(res.status());
  786 |   });
  787 | 
  788 |   // Happy path: GET /api/health/v1/remote
  789 |   test("RemoteHealth — 200  happy path", async () => {
  790 |     await Reporter.setStory("GET /api/health/v1/remote");
  791 |     const { status, body } = await client.remoteHealth();
  792 |     expect(status).toBe(200);
  793 |     // Zod contract validation
  794 |     if (body !== null) {
  795 |       const parsed = RemoteHealthResponseSchema.safeParse(body);
  796 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  797 |     }
  798 |   });
  799 | 
  800 |   // Error path: GET /api/health/v1/remote — unauthorized
  801 |   test("RemoteHealth — 401 unauthorized", async ({ request }) => {
  802 |     await Reporter.setStory("GET /api/health/v1/remote — unauthorized");
  803 |     // Create a client with a bad token to trigger 401
  804 |     const envVars = APIClient.getEnvVariables();
  805 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  806 |     // Directly call the endpoint with an invalid bearer token
  807 |     const res = await request.get(
  808 |       // replace with the actual URL builder call if needed
  809 |       `${serviceConfig.url}/api/health/v1/remote`,
  810 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  811 |     );
  812 |     expect([401, 403]).toContain(res.status());
  813 |   });
  814 | 
  815 |   // Happy path: GET /api/health/v1/all
  816 |   test("LocalAndRemoteHealth — 200  happy path", async () => {
  817 |     await Reporter.setStory("GET /api/health/v1/all");
  818 |     const { status, body } = await client.localAndRemoteHealth();
  819 |     expect(status).toBe(200);
  820 |     // Zod contract validation
  821 |     if (body !== null) {
  822 |       const parsed = LocalAndRemoteHealthResponseSchema.safeParse(body);
  823 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  824 |     }
  825 |   });
  826 | 
  827 |   // Error path: GET /api/health/v1/all — unauthorized
  828 |   test("LocalAndRemoteHealth — 401 unauthorized", async ({ request }) => {
  829 |     await Reporter.setStory("GET /api/health/v1/all — unauthorized");
  830 |     // Create a client with a bad token to trigger 401
  831 |     const envVars = APIClient.getEnvVariables();
  832 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  833 |     // Directly call the endpoint with an invalid bearer token
  834 |     const res = await request.get(
  835 |       // replace with the actual URL builder call if needed
  836 |       `${serviceConfig.url}/api/health/v1/all`,
  837 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  838 |     );
  839 |     expect([401, 403]).toContain(res.status());
  840 |   });
  841 | 
  842 |   // Happy path: GET /api/health/v1/auth/basic
  843 |   test("BasicAuthHealth — 200  happy path", async () => {
```