# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — sshealth >> RemoteHealth — 401 unauthorized
- Location: tests/tests-api/selfRegistration.spec.ts:801:7

# Error details

```
Error: apiRequestContext.get: socket hang up
Call log:
  - → GET https://self-registration.develop.squads-dev.com/api/health/v1/remote
    - user-agent: Playwright/1.60.0 (arm64; macOS 26.5) node/20.15
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Authorization: Bearer invalid-token
    - Content-Type: application/json

```

# Test source

```ts
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
  743 |     const res = await request.get(
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
> 807 |     const res = await request.get(
      |                               ^ Error: apiRequestContext.get: socket hang up
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
  844 |     await Reporter.setStory("GET /api/health/v1/auth/basic");
  845 |     const { status, body } = await client.basicAuthHealth();
  846 |     expect(status).toBe(200);
  847 |     // Zod contract validation
  848 |     if (body !== null) {
  849 |       const parsed = BasicAuthHealthResponseSchema.safeParse(body);
  850 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  851 |     }
  852 |   });
  853 | 
  854 |   // Error path: GET /api/health/v1/auth/basic — unauthorized
  855 |   test("BasicAuthHealth — 401 unauthorized", async ({ request }) => {
  856 |     await Reporter.setStory("GET /api/health/v1/auth/basic — unauthorized");
  857 |     // Create a client with a bad token to trigger 401
  858 |     const envVars = APIClient.getEnvVariables();
  859 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  860 |     // Directly call the endpoint with an invalid bearer token
  861 |     const res = await request.get(
  862 |       // replace with the actual URL builder call if needed
  863 |       `${serviceConfig.url}/api/health/v1/auth/basic`,
  864 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  865 |     );
  866 |     expect([401, 403]).toContain(res.status());
  867 |   });
  868 | 
  869 | });
  870 | 
  871 | test.describe("SelfRegistration — uts-audit", () => {
  872 |   test.beforeEach(async () => {
  873 |     await Reporter.setEpic("SelfRegistration");
  874 |     await Reporter.setFeature("uts-audit");
  875 |     await Reporter.addTags("api", "auto-generated");
  876 |   });
  877 | 
  878 |   // Happy path: GET /api/audit-mesgs
  879 |   test("FetchEntries — 200  happy path", async () => {
  880 |     await Reporter.setStory("GET /api/audit-mesgs");
  881 |     const { status, body } = await client.fetchEntries();
  882 |     expect(status).toBe(200);
  883 |     // Zod contract validation
  884 |     if (body !== null) {
  885 |       const parsed = FetchEntriesResponseSchema.safeParse(body);
  886 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  887 |     }
  888 |   });
  889 | 
  890 |   // Error path: GET /api/audit-mesgs — unauthorized
  891 |   test("FetchEntries — 401 unauthorized", async ({ request }) => {
  892 |     await Reporter.setStory("GET /api/audit-mesgs — unauthorized");
  893 |     // Create a client with a bad token to trigger 401
  894 |     const envVars = APIClient.getEnvVariables();
  895 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  896 |     // Directly call the endpoint with an invalid bearer token
  897 |     const res = await request.get(
  898 |       // replace with the actual URL builder call if needed
  899 |       `${serviceConfig.url}/api/audit-mesgs`,
  900 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  901 |     );
  902 |     expect([401, 403]).toContain(res.status());
  903 |   });
  904 | 
  905 |   // Happy path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}
  906 |   test("DeleteEntries — 200  happy path", async () => {
  907 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}");
```