# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — uts-audit >> DeleteEntries — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:906:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  908 |     const { status, body } = await client.deleteEntries("test-auditId" /* TODO: replace with real audit_id */, "test-seq" /* TODO: replace with real seq */, deleteEntriesPayload());
> 909 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  910 |   });
  911 | 
  912 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized
  913 |   test("DeleteEntries — 401 unauthorized", async ({ request }) => {
  914 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized");
  915 |     // Create a client with a bad token to trigger 401
  916 |     const envVars = APIClient.getEnvVariables();
  917 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  918 |     // Directly call the endpoint with an invalid bearer token
  919 |     const res = await request.post(
  920 |       // replace with the actual URL builder call if needed
  921 |       `${serviceConfig.url}/api/audit-mesgs/ack/id/invalid-audit_id/seq/invalid-seq`,
  922 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  923 |     );
  924 |     expect([401, 403]).toContain(res.status());
  925 |   });
  926 | 
  927 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found
  928 |   test("DeleteEntries — 404 not found", async () => {
  929 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found");
  930 |     const { status } = await client.deleteEntries("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", deleteEntriesPayload());
  931 |     expect([404, 400, 500]).toContain(status);
  932 |   });
  933 | 
  934 | });
  935 | 
```