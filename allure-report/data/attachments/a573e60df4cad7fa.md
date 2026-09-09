# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — uts-audit >> DeleteEntries — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:855:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  758 |       `${serviceConfig.url}/api/health/v1/remote`,
  759 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  760 |     );
  761 |     expect([401, 403]).toContain(res.status());
  762 |   });
  763 | 
  764 |   // Happy path: GET /api/health/v1/all
  765 |   test("LocalAndRemoteHealth — 200  happy path", async () => {
  766 |     await Reporter.setStory("GET /api/health/v1/all");
  767 |     const { status, body } = await client.localAndRemoteHealth();
  768 |     expect(status).toBe(200);
  769 |     // Zod contract validation
  770 |     if (body !== null) {
  771 |       const parsed = LocalAndRemoteHealthResponseSchema.safeParse(body);
  772 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  773 |     }
  774 |   });
  775 | 
  776 |   // Error path: GET /api/health/v1/all — unauthorized
  777 |   test("LocalAndRemoteHealth — 401 unauthorized", async ({ request }) => {
  778 |     await Reporter.setStory("GET /api/health/v1/all — unauthorized");
  779 |     // Create a client with a bad token to trigger 401
  780 |     const envVars = APIClient.getEnvVariables();
  781 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  782 |     // Directly call the endpoint with an invalid bearer token
  783 |     const res = await request.get(
  784 |       // replace with the actual URL builder call if needed
  785 |       `${serviceConfig.url}/api/health/v1/all`,
  786 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  787 |     );
  788 |     expect([401, 403]).toContain(res.status());
  789 |   });
  790 | 
  791 |   // Happy path: GET /api/health/v1/auth/basic
  792 |   test("BasicAuthHealth — 200  happy path", async () => {
  793 |     await Reporter.setStory("GET /api/health/v1/auth/basic");
  794 |     const { status, body } = await client.basicAuthHealth();
  795 |     expect(status).toBe(200);
  796 |     // Zod contract validation
  797 |     if (body !== null) {
  798 |       const parsed = BasicAuthHealthResponseSchema.safeParse(body);
  799 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  800 |     }
  801 |   });
  802 | 
  803 |   // Error path: GET /api/health/v1/auth/basic — unauthorized
  804 |   test("BasicAuthHealth — 401 unauthorized", async ({ request }) => {
  805 |     await Reporter.setStory("GET /api/health/v1/auth/basic — unauthorized");
  806 |     // Create a client with a bad token to trigger 401
  807 |     const envVars = APIClient.getEnvVariables();
  808 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  809 |     // Directly call the endpoint with an invalid bearer token
  810 |     const res = await request.get(
  811 |       // replace with the actual URL builder call if needed
  812 |       `${serviceConfig.url}/api/health/v1/auth/basic`,
  813 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  814 |     );
  815 |     expect([401, 403]).toContain(res.status());
  816 |   });
  817 | 
  818 | });
  819 | 
  820 | test.describe("SelfRegistration — uts-audit", () => {
  821 |   test.beforeEach(async () => {
  822 |     await Reporter.setEpic("SelfRegistration");
  823 |     await Reporter.setFeature("uts-audit");
  824 |     await Reporter.addTags("api", "auto-generated");
  825 |   });
  826 | 
  827 |   // Happy path: GET /api/audit-mesgs
  828 |   test("FetchEntries — 200  happy path", async () => {
  829 |     await Reporter.setStory("GET /api/audit-mesgs");
  830 |     const { status, body } = await client.fetchEntries();
  831 |     expect(status).toBe(200);
  832 |     // Zod contract validation
  833 |     if (body !== null) {
  834 |       const parsed = FetchEntriesResponseSchema.safeParse(body);
  835 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  836 |     }
  837 |   });
  838 | 
  839 |   // Error path: GET /api/audit-mesgs — unauthorized
  840 |   test("FetchEntries — 401 unauthorized", async ({ request }) => {
  841 |     await Reporter.setStory("GET /api/audit-mesgs — unauthorized");
  842 |     // Create a client with a bad token to trigger 401
  843 |     const envVars = APIClient.getEnvVariables();
  844 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  845 |     // Directly call the endpoint with an invalid bearer token
  846 |     const res = await request.get(
  847 |       // replace with the actual URL builder call if needed
  848 |       `${serviceConfig.url}/api/audit-mesgs`,
  849 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  850 |     );
  851 |     expect([401, 403]).toContain(res.status());
  852 |   });
  853 | 
  854 |   // Happy path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}
  855 |   test("DeleteEntries — 200  happy path", async () => {
  856 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}");
  857 |     const { status, body } = await client.deleteEntries("test-auditId", "test-seq", {}); // TODO: replace with real audit_id & seq
> 858 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  859 |   });
  860 | 
  861 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized
  862 |   test("DeleteEntries — 401 unauthorized", async ({ request }) => {
  863 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized");
  864 |     // Create a client with a bad token to trigger 401
  865 |     const envVars = APIClient.getEnvVariables();
  866 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  867 |     // Directly call the endpoint with an invalid bearer token
  868 |     const res = await request.post(
  869 |       // replace with the actual URL builder call if needed
  870 |       `${serviceConfig.url}/api/audit-mesgs/ack/id/invalid-audit_id/seq/invalid-seq`,
  871 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  872 |     );
  873 |     expect([401, 403]).toContain(res.status());
  874 |   });
  875 | 
  876 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found
  877 |   test("DeleteEntries — 404 not found", async () => {
  878 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found");
  879 |     const { status } = await client.deleteEntries("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  880 |     expect([404, 400]).toContain(status);
  881 |   });
  882 | 
  883 | });
  884 | 
```