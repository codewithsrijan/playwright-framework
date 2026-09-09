# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — uts-audit >> DeleteEntries — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:853:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  756 |       `${serviceConfig.url}/api/health/v1/remote`,
  757 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  758 |     );
  759 |     expect([401, 403]).toContain(res.status());
  760 |   });
  761 | 
  762 |   // Happy path: GET /api/health/v1/all
  763 |   test("LocalAndRemoteHealth — 200  happy path", async () => {
  764 |     await Reporter.setStory("GET /api/health/v1/all");
  765 |     const { status, body } = await client.localAndRemoteHealth();
  766 |     expect(status).toBe(200);
  767 |     // Zod contract validation
  768 |     if (body !== null) {
  769 |       const parsed = LocalAndRemoteHealthResponseSchema.safeParse(body);
  770 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  771 |     }
  772 |   });
  773 | 
  774 |   // Error path: GET /api/health/v1/all — unauthorized
  775 |   test("LocalAndRemoteHealth — 401 unauthorized", async ({ request }) => {
  776 |     await Reporter.setStory("GET /api/health/v1/all — unauthorized");
  777 |     // Create a client with a bad token to trigger 401
  778 |     const envVars = APIClient.getEnvVariables();
  779 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  780 |     // Directly call the endpoint with an invalid bearer token
  781 |     const res = await request.get(
  782 |       // replace with the actual URL builder call if needed
  783 |       `${serviceConfig.url}/api/health/v1/all`,
  784 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  785 |     );
  786 |     expect([401, 403]).toContain(res.status());
  787 |   });
  788 | 
  789 |   // Happy path: GET /api/health/v1/auth/basic
  790 |   test("BasicAuthHealth — 200  happy path", async () => {
  791 |     await Reporter.setStory("GET /api/health/v1/auth/basic");
  792 |     const { status, body } = await client.basicAuthHealth();
  793 |     expect(status).toBe(200);
  794 |     // Zod contract validation
  795 |     if (body !== null) {
  796 |       const parsed = BasicAuthHealthResponseSchema.safeParse(body);
  797 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  798 |     }
  799 |   });
  800 | 
  801 |   // Error path: GET /api/health/v1/auth/basic — unauthorized
  802 |   test("BasicAuthHealth — 401 unauthorized", async ({ request }) => {
  803 |     await Reporter.setStory("GET /api/health/v1/auth/basic — unauthorized");
  804 |     // Create a client with a bad token to trigger 401
  805 |     const envVars = APIClient.getEnvVariables();
  806 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  807 |     // Directly call the endpoint with an invalid bearer token
  808 |     const res = await request.get(
  809 |       // replace with the actual URL builder call if needed
  810 |       `${serviceConfig.url}/api/health/v1/auth/basic`,
  811 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  812 |     );
  813 |     expect([401, 403]).toContain(res.status());
  814 |   });
  815 | 
  816 | });
  817 | 
  818 | test.describe("SelfRegistration — uts-audit", () => {
  819 |   test.beforeEach(async () => {
  820 |     await Reporter.setEpic("SelfRegistration");
  821 |     await Reporter.setFeature("uts-audit");
  822 |     await Reporter.addTags("api", "auto-generated");
  823 |   });
  824 | 
  825 |   // Happy path: GET /api/audit-mesgs
  826 |   test("FetchEntries — 200  happy path", async () => {
  827 |     await Reporter.setStory("GET /api/audit-mesgs");
  828 |     const { status, body } = await client.fetchEntries();
  829 |     expect(status).toBe(200);
  830 |     // Zod contract validation
  831 |     if (body !== null) {
  832 |       const parsed = FetchEntriesResponseSchema.safeParse(body);
  833 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  834 |     }
  835 |   });
  836 | 
  837 |   // Error path: GET /api/audit-mesgs — unauthorized
  838 |   test("FetchEntries — 401 unauthorized", async ({ request }) => {
  839 |     await Reporter.setStory("GET /api/audit-mesgs — unauthorized");
  840 |     // Create a client with a bad token to trigger 401
  841 |     const envVars = APIClient.getEnvVariables();
  842 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  843 |     // Directly call the endpoint with an invalid bearer token
  844 |     const res = await request.get(
  845 |       // replace with the actual URL builder call if needed
  846 |       `${serviceConfig.url}/api/audit-mesgs`,
  847 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  848 |     );
  849 |     expect([401, 403]).toContain(res.status());
  850 |   });
  851 | 
  852 |   // Happy path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}
  853 |   test("DeleteEntries — 200  happy path", async () => {
  854 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq}");
  855 |     const { status, body } = await client.deleteEntries("test-auditId", "test-seq", {}); // TODO: replace with real audit_id & seq
> 856 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  857 |   });
  858 | 
  859 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized
  860 |   test("DeleteEntries — 401 unauthorized", async ({ request }) => {
  861 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — unauthorized");
  862 |     // Create a client with a bad token to trigger 401
  863 |     const envVars = APIClient.getEnvVariables();
  864 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  865 |     // Directly call the endpoint with an invalid bearer token
  866 |     const res = await request.post(
  867 |       // replace with the actual URL builder call if needed
  868 |       `${serviceConfig.url}/api/audit-mesgs/ack/id/invalid-audit_id/seq/invalid-seq`,
  869 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  870 |     );
  871 |     expect([401, 403]).toContain(res.status());
  872 |   });
  873 | 
  874 |   // Error path: POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found
  875 |   test("DeleteEntries — 404 not found", async () => {
  876 |     await Reporter.setStory("POST /api/audit-mesgs/ack/id/{audit_id}/seq/{seq} — not found");
  877 |     const { status } = await client.deleteEntries("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  878 |     expect([404, 400]).toContain(status);
  879 |   });
  880 | 
  881 | });
  882 | 
```