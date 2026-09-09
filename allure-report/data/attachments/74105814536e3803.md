# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> SaveUser — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:136:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  39  |   const envVars = APIClient.getEnvVariables();
  40  |   const serviceConfig = envVars["selfRegistration"] as { url: string; [k: string]: unknown };
  41  | 
  42  |   // 1. Extract domain from the frontend URL to resolve org UUID
  43  |   const frontendUrl = (envVars["frontend"] as { url: string }).url;
  44  |   const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  45  |   if (!domainMatch) throw new Error(`Cannot extract domain from frontend URL: ${frontendUrl}`);
  46  |   const domain = domainMatch[1];
  47  | 
  48  |   // 2. Resolve real org UUID via organizations-api
  49  |   const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  50  |   const apiClient = new APIClient();
  51  |   orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);
  52  | 
  53  |   // 3. Create service client using the persistent context
  54  |   client = await SelfRegistrationClient.create(apiContext);
  55  | });
  56  | 
  57  | test.afterAll(async () => {
  58  |   await apiContext?.dispose();
  59  | });
  60  | 
  61  | test.describe("SelfRegistration — registration", () => {
  62  |   test.beforeEach(async () => {
  63  |     await Reporter.setEpic("SelfRegistration");
  64  |     await Reporter.setFeature("registration");
  65  |     await Reporter.addTags("api", "auto-generated");
  66  |   });
  67  | 
  68  |   // Happy path: POST /api/registrations
  69  |   test("Insert — 200  happy path", async () => {
  70  |     await Reporter.setStory("POST /api/registrations");
  71  |     const { status, body } = await client.insert(insertPayload({ organizationUuid: orgId }));
  72  |     expect(status).toBe(200);
  73  |     // Zod contract validation
  74  |     if (body !== null) {
  75  |       const parsed = InsertResponseSchema.safeParse(body);
  76  |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  77  |     }
  78  |   });
  79  | 
  80  |   // Error path: POST /api/registrations — unauthorized
  81  |   test("Insert — 401 unauthorized", async ({ request }) => {
  82  |     await Reporter.setStory("POST /api/registrations — unauthorized");
  83  |     // Create a client with a bad token to trigger 401
  84  |     const envVars = APIClient.getEnvVariables();
  85  |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  86  |     // Directly call the endpoint with an invalid bearer token
  87  |     const res = await request.post(
  88  |       // replace with the actual URL builder call if needed
  89  |       `${serviceConfig.url}/api/registrations`,
  90  |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  91  |     );
  92  |     expect([401, 403]).toContain(res.status());
  93  |   });
  94  | 
  95  |   // Happy path: POST /api/registrations/{registrationUuid}/otp/{code}/validate
  96  |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  97  |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  98  |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  99  |   //   3. const otp = mailhog.extractOtp(email);
  100 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  101 |   //   See helper/api/MailhogClient.ts for the full API.
  102 |   test("ValidateOtp — 200  happy path", async () => {
  103 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate");
  104 |     const { status, body } = await client.validateOtp("test-registrationUuid" /* TODO: replace with real registrationUuid */, "test-code" /* TODO: replace with real code */, validateOtpPayload({ organizationUuid: orgId }));
  105 |     expect(status).toBe(200);
  106 |     // Zod contract validation
  107 |     if (body !== null) {
  108 |       const parsed = ValidateOtpResponseSchema.safeParse(body);
  109 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  110 |     }
  111 |   });
  112 | 
  113 |   // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized
  114 |   test("ValidateOtp — 401 unauthorized", async ({ request }) => {
  115 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — unauthorized");
  116 |     // Create a client with a bad token to trigger 401
  117 |     const envVars = APIClient.getEnvVariables();
  118 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  119 |     // Directly call the endpoint with an invalid bearer token
  120 |     const res = await request.post(
  121 |       // replace with the actual URL builder call if needed
  122 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/invalid-code/validate`,
  123 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  124 |     );
  125 |     expect([401, 403]).toContain(res.status());
  126 |   });
  127 | 
  128 |   // Error path: POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found
  129 |   test("ValidateOtp — 404 not found", async () => {
  130 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/{code}/validate — not found");
  131 |     const { status } = await client.validateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", validateOtpPayload());
  132 |     expect([404, 400, 500]).toContain(status);
  133 |   });
  134 | 
  135 |   // Happy path: POST /api/registrations/{registrationUuid}/save-user
  136 |   test("SaveUser — 200  happy path", async () => {
  137 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user");
  138 |     const { status, body } = await client.saveUser("test-registrationUuid" /* TODO: replace with real registrationUuid */, saveUserPayload());
> 139 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  140 |     // Zod contract validation
  141 |     if (body !== null) {
  142 |       const parsed = SaveUserResponseSchema.safeParse(body);
  143 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  144 |     }
  145 |   });
  146 | 
  147 |   // Error path: POST /api/registrations/{registrationUuid}/save-user — unauthorized
  148 |   test("SaveUser — 401 unauthorized", async ({ request }) => {
  149 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — unauthorized");
  150 |     // Create a client with a bad token to trigger 401
  151 |     const envVars = APIClient.getEnvVariables();
  152 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  153 |     // Directly call the endpoint with an invalid bearer token
  154 |     const res = await request.post(
  155 |       // replace with the actual URL builder call if needed
  156 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/save-user`,
  157 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  158 |     );
  159 |     expect([401, 403]).toContain(res.status());
  160 |   });
  161 | 
  162 |   // Error path: POST /api/registrations/{registrationUuid}/save-user — not found
  163 |   test("SaveUser — 404 not found", async () => {
  164 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/save-user — not found");
  165 |     const { status } = await client.saveUser("00000000-0000-0000-0000-000000000000", saveUserPayload());
  166 |     expect([404, 400, 500]).toContain(status);
  167 |   });
  168 | 
  169 |   // Happy path: POST /api/registrations/{registrationUuid}/otp/resend
  170 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  171 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  172 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  173 |   //   3. const otp = mailhog.extractOtp(email);
  174 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  175 |   //   See helper/api/MailhogClient.ts for the full API.
  176 |   test("ResendOtp — 200  happy path", async () => {
  177 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend");
  178 |     const { status, body } = await client.resendOtp("test-registrationUuid" /* TODO: replace with real registrationUuid */, resendOtpPayload());
  179 |     expect(status).toBe(200);
  180 |     // Zod contract validation
  181 |     if (body !== null) {
  182 |       const parsed = ResendOtpResponseSchema.safeParse(body);
  183 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  184 |     }
  185 |   });
  186 | 
  187 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — unauthorized
  188 |   test("ResendOtp — 401 unauthorized", async ({ request }) => {
  189 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — unauthorized");
  190 |     // Create a client with a bad token to trigger 401
  191 |     const envVars = APIClient.getEnvVariables();
  192 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  193 |     // Directly call the endpoint with an invalid bearer token
  194 |     const res = await request.post(
  195 |       // replace with the actual URL builder call if needed
  196 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/resend`,
  197 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  198 |     );
  199 |     expect([401, 403]).toContain(res.status());
  200 |   });
  201 | 
  202 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — not found
  203 |   test("ResendOtp — 404 not found", async () => {
  204 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — not found");
  205 |     const { status } = await client.resendOtp("00000000-0000-0000-0000-000000000000", resendOtpPayload());
  206 |     expect([404, 400, 500]).toContain(status);
  207 |   });
  208 | 
  209 |   // Happy path: GET /api/registrations/{registrationUuid}/fetch-user-status
  210 |   test("FetchUserStatus — 200  happy path", async () => {
  211 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status");
  212 |     const { status, body } = await client.fetchUserStatus("test-registrationUuid" /* TODO: replace with real registrationUuid */);
  213 |     expect(status).toBe(200);
  214 |     // Zod contract validation
  215 |     if (body !== null) {
  216 |       const parsed = FetchUserStatusResponseSchema.safeParse(body);
  217 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  218 |     }
  219 |   });
  220 | 
  221 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized
  222 |   test("FetchUserStatus — 401 unauthorized", async ({ request }) => {
  223 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized");
  224 |     // Create a client with a bad token to trigger 401
  225 |     const envVars = APIClient.getEnvVariables();
  226 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  227 |     // Directly call the endpoint with an invalid bearer token
  228 |     const res = await request.get(
  229 |       // replace with the actual URL builder call if needed
  230 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/fetch-user-status`,
  231 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  232 |     );
  233 |     expect([401, 403]).toContain(res.status());
  234 |   });
  235 | 
  236 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — not found
  237 |   test("FetchUserStatus — 404 not found", async () => {
  238 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — not found");
  239 |     const { status } = await client.fetchUserStatus("00000000-0000-0000-0000-000000000000");
```