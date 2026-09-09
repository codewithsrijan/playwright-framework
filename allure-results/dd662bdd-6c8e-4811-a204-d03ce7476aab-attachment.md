# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> SaveUser — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:115:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  18  | test.beforeAll("Authenticate + resolve org", async () => {
  19  |   // Create a persistent APIRequestContext scoped to the whole suite.
  20  |   // Using playwrightRequest.newContext() avoids the "fixture from beforeAll cannot be
  21  |   // reused in a test" error that occurs when storing the { request } fixture.
  22  |   apiContext = await playwrightRequest.newContext();
  23  | 
  24  |   const envVars = APIClient.getEnvVariables();
  25  |   serviceConfig = envVars["selfRegistration"] as { url: string; basicUser: string; basicPassword: string };
  26  | 
  27  |   // 1. Extract domain from the frontend URL to resolve org UUID
  28  |   const frontendUrl = (envVars["frontend"] as { url: string }).url;
  29  |   const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  30  |   if (!domainMatch) throw new Error(`Cannot extract domain from frontend URL: ${frontendUrl}`);
  31  |   const domain = domainMatch[1];
  32  | 
  33  |   // 2. Resolve real org UUID via organizations-api
  34  |   const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  35  |   const apiClient = new APIClient();
  36  |   orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);
  37  | 
  38  |   // 3. Create service client using the persistent context
  39  |   client = await SelfRegistrationClient.create(apiContext);
  40  | });
  41  | 
  42  | test.afterAll(async () => {
  43  |   await apiContext?.dispose();
  44  | });
  45  | 
  46  | test.describe("SelfRegistration — registration", () => {
  47  |   test.beforeEach(async () => {
  48  |     await Reporter.setEpic("SelfRegistration");
  49  |     await Reporter.setFeature("registration");
  50  |     await Reporter.addTags("api", "auto-generated");
  51  |   });
  52  | 
  53  |   // Happy path: POST /api/registrations
  54  |   test("Insert — 200  happy path", async () => {
  55  |     await Reporter.setStory("POST /api/registrations");
  56  |     const { status, body } = await client.insert({});
  57  |     expect(status).toBe(200);
  58  |     // Zod contract validation
  59  |     if (body !== null) {
  60  |       const parsed = InsertResponseSchema.safeParse(body);
  61  |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  62  |     }
  63  |   });
  64  | 
  65  |   // Error path: POST /api/registrations — unauthorized
  66  |   test("Insert — 401 unauthorized", async ({ request }) => {
  67  |     await Reporter.setStory("POST /api/registrations — unauthorized");
  68  |     // Create a client with a bad token to trigger 401
  69  |     const envVars = APIClient.getEnvVariables();
  70  |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  71  |     // Directly call the endpoint with an invalid bearer token
  72  |     const res = await request.post(
  73  |       // replace with the actual URL builder call if needed
  74  |       `${serviceConfig.url}/api/registrations`,
  75  |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  76  |     );
  77  |     expect([401, 403]).toContain(res.status());
  78  |   });
  79  | 
  80  |   // Happy path: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  81  |   test("ValidateOtp — 200  happy path", async () => {
  82  |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate");
  83  |     const { status, body } = await client.validateOtp("test-registrationUuid", "test-code", {}); // TODO: replace with real registrationUuid & OTP code
  84  |     expect(status).toBe(200);
  85  |     // Zod contract validation
  86  |     if (body !== null) {
  87  |       const parsed = ValidateOtpResponseSchema.safeParse(body);
  88  |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  89  |     }
  90  |   });
  91  | 
  92  |   // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized
  93  |   test("ValidateOtp — 401 unauthorized", async ({ request }) => {
  94  |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized");
  95  |     // Create a client with a bad token to trigger 401
  96  |     const envVars = APIClient.getEnvVariables();
  97  |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  98  |     // Directly call the endpoint with an invalid bearer token
  99  |     const res = await request.post(
  100 |       // replace with the actual URL builder call if needed
  101 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/invalid-code/validate`,
  102 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  103 |     );
  104 |     expect([401, 403]).toContain(res.status());
  105 |   });
  106 | 
  107 |   // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found
  108 |   test("ValidateOtp — 404 not found", async () => {
  109 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found");
  110 |     const { status } = await client.validateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  111 |     expect([404, 400]).toContain(status);
  112 |   });
  113 | 
  114 |   // Happy path: POST /api/registrations/{registrationUuid}/save-user
  115 |   test("SaveUser — 200  happy path", async () => {
  116 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user");
  117 |     const { status, body } = await client.saveUser("test-registrationUuid", {}); // TODO: replace with real registrationUuid
> 118 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  119 |     // Zod contract validation
  120 |     if (body !== null) {
  121 |       const parsed = SaveUserResponseSchema.safeParse(body);
  122 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  123 |     }
  124 |   });
  125 | 
  126 |   // Error path: POST /api/registrations/{registrationUuid}/save-user — unauthorized
  127 |   test("SaveUser — 401 unauthorized", async ({ request }) => {
  128 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — unauthorized");
  129 |     // Create a client with a bad token to trigger 401
  130 |     const envVars = APIClient.getEnvVariables();
  131 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  132 |     // Directly call the endpoint with an invalid bearer token
  133 |     const res = await request.post(
  134 |       // replace with the actual URL builder call if needed
  135 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/save-user`,
  136 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  137 |     );
  138 |     expect([401, 403]).toContain(res.status());
  139 |   });
  140 | 
  141 |   // Error path: POST /api/registrations/{registrationUuid}/save-user — not found
  142 |   test("SaveUser — 404 not found", async () => {
  143 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — not found");
  144 |     const { status } = await client.saveUser("00000000-0000-0000-0000-000000000000", {});
  145 |     // NOTE: service validates body before UUID lookup, returns 500 for nil UUID + empty body
  146 |     expect([404, 400, 500]).toContain(status);
  147 |   });
  148 | 
  149 |   // Happy path: POST /api/registrations/{registrationUuid}/otp/resend
  150 |   test("ResendOtp — 200  happy path", async () => {
  151 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend");
  152 |     const { status, body } = await client.resendOtp("test-registrationUuid", {}); // TODO: replace with real registrationUuid
  153 |     expect(status).toBe(200);
  154 |     // Zod contract validation
  155 |     if (body !== null) {
  156 |       const parsed = ResendOtpResponseSchema.safeParse(body);
  157 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  158 |     }
  159 |   });
  160 | 
  161 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — unauthorized
  162 |   test("ResendOtp — 401 unauthorized", async ({ request }) => {
  163 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — unauthorized");
  164 |     // Create a client with a bad token to trigger 401
  165 |     const envVars = APIClient.getEnvVariables();
  166 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  167 |     // Directly call the endpoint with an invalid bearer token
  168 |     const res = await request.post(
  169 |       // replace with the actual URL builder call if needed
  170 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/resend`,
  171 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  172 |     );
  173 |     expect([401, 403]).toContain(res.status());
  174 |   });
  175 | 
  176 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — not found
  177 |   test("ResendOtp — 404 not found", async () => {
  178 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — not found");
  179 |     const { status } = await client.resendOtp("00000000-0000-0000-0000-000000000000", {});
  180 |     expect([404, 400]).toContain(status);
  181 |   });
  182 | 
  183 |   // Happy path: GET /api/registrations/{registrationUuid}/fetch-user-status
  184 |   test("FetchUserStatus — 200  happy path", async () => {
  185 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status");
  186 |     const { status, body } = await client.fetchUserStatus("test-registrationUuid"); // TODO: replace with real registrationUuid
  187 |     expect(status).toBe(200);
  188 |     // Zod contract validation
  189 |     if (body !== null) {
  190 |       const parsed = FetchUserStatusResponseSchema.safeParse(body);
  191 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  192 |     }
  193 |   });
  194 | 
  195 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized
  196 |   test("FetchUserStatus — 401 unauthorized", async ({ request }) => {
  197 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized");
  198 |     // Create a client with a bad token to trigger 401
  199 |     const envVars = APIClient.getEnvVariables();
  200 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  201 |     // Directly call the endpoint with an invalid bearer token
  202 |     const res = await request.get(
  203 |       // replace with the actual URL builder call if needed
  204 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/fetch-user-status`,
  205 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  206 |     );
  207 |     expect([401, 403]).toContain(res.status());
  208 |   });
  209 | 
  210 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — not found
  211 |   test("FetchUserStatus — 404 not found", async () => {
  212 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — not found");
  213 |     const { status } = await client.fetchUserStatus("00000000-0000-0000-0000-000000000000");
  214 |     // NOTE: service returns 500 for nil UUID (validates existence before returning 404)
  215 |     expect([404, 400, 500]).toContain(status);
  216 |   });
  217 | 
  218 |   // Happy path: POST /api/registrations/{registrationUuid}/send-otp-email
```