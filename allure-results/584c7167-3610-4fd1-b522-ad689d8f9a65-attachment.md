# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> SaveUser — 404 not found
- Location: tests/tests-api/selfRegistration.spec.ts:142:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [404, 400]
```

# Test source

```ts
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
  118 |     expect(status).toBe(200);
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
> 145 |     expect([404, 400]).toContain(status);
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  146 |   });
  147 | 
  148 |   // Happy path: POST /api/registrations/{registrationUuid}/otp/resend
  149 |   test("ResendOtp — 200  happy path", async () => {
  150 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend");
  151 |     const { status, body } = await client.resendOtp("test-registrationUuid", {}); // TODO: replace with real registrationUuid
  152 |     expect(status).toBe(200);
  153 |     // Zod contract validation
  154 |     if (body !== null) {
  155 |       const parsed = ResendOtpResponseSchema.safeParse(body);
  156 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  157 |     }
  158 |   });
  159 | 
  160 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — unauthorized
  161 |   test("ResendOtp — 401 unauthorized", async ({ request }) => {
  162 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — unauthorized");
  163 |     // Create a client with a bad token to trigger 401
  164 |     const envVars = APIClient.getEnvVariables();
  165 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  166 |     // Directly call the endpoint with an invalid bearer token
  167 |     const res = await request.post(
  168 |       // replace with the actual URL builder call if needed
  169 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/otp/resend`,
  170 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  171 |     );
  172 |     expect([401, 403]).toContain(res.status());
  173 |   });
  174 | 
  175 |   // Error path: POST /api/registrations/{registrationUuid}/otp/resend — not found
  176 |   test("ResendOtp — 404 not found", async () => {
  177 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/otp/resend — not found");
  178 |     const { status } = await client.resendOtp("00000000-0000-0000-0000-000000000000", {});
  179 |     expect([404, 400]).toContain(status);
  180 |   });
  181 | 
  182 |   // Happy path: GET /api/registrations/{registrationUuid}/fetch-user-status
  183 |   test("FetchUserStatus — 200  happy path", async () => {
  184 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status");
  185 |     const { status, body } = await client.fetchUserStatus("test-registrationUuid"); // TODO: replace with real registrationUuid
  186 |     expect(status).toBe(200);
  187 |     // Zod contract validation
  188 |     if (body !== null) {
  189 |       const parsed = FetchUserStatusResponseSchema.safeParse(body);
  190 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  191 |     }
  192 |   });
  193 | 
  194 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized
  195 |   test("FetchUserStatus — 401 unauthorized", async ({ request }) => {
  196 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — unauthorized");
  197 |     // Create a client with a bad token to trigger 401
  198 |     const envVars = APIClient.getEnvVariables();
  199 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  200 |     // Directly call the endpoint with an invalid bearer token
  201 |     const res = await request.get(
  202 |       // replace with the actual URL builder call if needed
  203 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/fetch-user-status`,
  204 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  205 |     );
  206 |     expect([401, 403]).toContain(res.status());
  207 |   });
  208 | 
  209 |   // Error path: GET /api/registrations/{registrationUuid}/fetch-user-status — not found
  210 |   test("FetchUserStatus — 404 not found", async () => {
  211 |     await Reporter.setStory("GET /api/registrations/{registrationUuid}/fetch-user-status — not found");
  212 |     const { status } = await client.fetchUserStatus("00000000-0000-0000-0000-000000000000");
  213 |     expect([404, 400]).toContain(status);
  214 |   });
  215 | 
  216 |   // Happy path: POST /api/registrations/{registrationUuid}/send-otp-email
  217 |   test("SendOtpEmail — 200  happy path", async () => {
  218 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email");
  219 |     const { status, body } = await client.sendOtpEmail("test-registrationUuid", {}); // TODO: replace with real registrationUuid
  220 |     expect(status).toBe(200);
  221 |     // Zod contract validation
  222 |     if (body !== null) {
  223 |       const parsed = SendOtpEmailResponseSchema.safeParse(body);
  224 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  225 |     }
  226 |   });
  227 | 
  228 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized
  229 |   test("SendOtpEmail — 401 unauthorized", async ({ request }) => {
  230 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized");
  231 |     // Create a client with a bad token to trigger 401
  232 |     const envVars = APIClient.getEnvVariables();
  233 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  234 |     // Directly call the endpoint with an invalid bearer token
  235 |     const res = await request.post(
  236 |       // replace with the actual URL builder call if needed
  237 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/send-otp-email`,
  238 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  239 |     );
  240 |     expect([401, 403]).toContain(res.status());
  241 |   });
  242 | 
  243 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — not found
  244 |   test("SendOtpEmail — 404 not found", async () => {
  245 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — not found");
```