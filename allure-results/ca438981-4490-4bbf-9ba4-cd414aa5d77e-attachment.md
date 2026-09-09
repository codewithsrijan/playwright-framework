# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> SendOtpEmail — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:219:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  219 |   test("SendOtpEmail — 200  happy path", async () => {
  220 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email");
  221 |     const { status, body } = await client.sendOtpEmail("test-registrationUuid", {}); // TODO: replace with real registrationUuid
> 222 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  223 |     // Zod contract validation
  224 |     if (body !== null) {
  225 |       const parsed = SendOtpEmailResponseSchema.safeParse(body);
  226 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  227 |     }
  228 |   });
  229 | 
  230 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized
  231 |   test("SendOtpEmail — 401 unauthorized", async ({ request }) => {
  232 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized");
  233 |     // Create a client with a bad token to trigger 401
  234 |     const envVars = APIClient.getEnvVariables();
  235 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  236 |     // Directly call the endpoint with an invalid bearer token
  237 |     const res = await request.post(
  238 |       // replace with the actual URL builder call if needed
  239 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/send-otp-email`,
  240 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  241 |     );
  242 |     expect([401, 403]).toContain(res.status());
  243 |   });
  244 | 
  245 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — not found
  246 |   test("SendOtpEmail — 404 not found", async () => {
  247 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — not found");
  248 |     const { status } = await client.sendOtpEmail("00000000-0000-0000-0000-000000000000", {});
  249 |     expect([404, 400]).toContain(status);
  250 |   });
  251 | 
  252 |   // Happy path: POST /api/registrations/fetch-registered-users-for-approval
  253 |   test("FetchRegisteredUsersforapproval — 200  happy path", async () => {
  254 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval");
  255 |     const { status, body } = await client.fetchRegisteredUsersforapproval({});
  256 |     expect(status).toBe(200);
  257 |     // Zod contract validation
  258 |     if (body !== null) {
  259 |       const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(body);
  260 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  261 |     }
  262 |   });
  263 | 
  264 |   // Error path: POST /api/registrations/fetch-registered-users-for-approval — unauthorized
  265 |   test("FetchRegisteredUsersforapproval — 401 unauthorized", async ({ request }) => {
  266 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval — unauthorized");
  267 |     // Create a client with a bad token to trigger 401
  268 |     const envVars = APIClient.getEnvVariables();
  269 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  270 |     // Directly call the endpoint with an invalid bearer token
  271 |     const res = await request.post(
  272 |       // replace with the actual URL builder call if needed
  273 |       `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`,
  274 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  275 |     );
  276 |     expect([401, 403]).toContain(res.status());
  277 |   });
  278 | 
  279 |   // Happy path: PUT /api/registrations/approve-pending-registered-users
  280 |   test("ApprovePendingRegisteredUsers — 200  happy path", async () => {
  281 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users");
  282 |     const { status, body } = await client.approvePendingRegisteredUsers({});
  283 |     expect(status).toBe(200);
  284 |     // Zod contract validation
  285 |     if (body !== null) {
  286 |       const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(body);
  287 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  288 |     }
  289 |   });
  290 | 
  291 |   // Error path: PUT /api/registrations/approve-pending-registered-users — unauthorized
  292 |   test("ApprovePendingRegisteredUsers — 401 unauthorized", async ({ request }) => {
  293 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users — unauthorized");
  294 |     // Create a client with a bad token to trigger 401
  295 |     const envVars = APIClient.getEnvVariables();
  296 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  297 |     // Directly call the endpoint with an invalid bearer token
  298 |     const res = await request.put(
  299 |       // replace with the actual URL builder call if needed
  300 |       `${serviceConfig.url}/api/registrations/approve-pending-registered-users`,
  301 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  302 |     );
  303 |     expect([401, 403]).toContain(res.status());
  304 |   });
  305 | 
  306 |   // Happy path: PUT /api/registrations/approve-registered-user-with-update
  307 |   test("ApproveRegisteredUserWithUpdateRequest — 200  happy path", async () => {
  308 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update");
  309 |     const { status, body } = await client.approveRegisteredUserWithUpdateRequest({});
  310 |     expect(status).toBe(200);
  311 |     // Zod contract validation
  312 |     if (body !== null) {
  313 |       const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(body);
  314 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  315 |     }
  316 |   });
  317 | 
  318 |   // Error path: PUT /api/registrations/approve-registered-user-with-update — unauthorized
  319 |   test("ApproveRegisteredUserWithUpdateRequest — 401 unauthorized", async ({ request }) => {
  320 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
  321 |     // Create a client with a bad token to trigger 401
  322 |     const envVars = APIClient.getEnvVariables();
```