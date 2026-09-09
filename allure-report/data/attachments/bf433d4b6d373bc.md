# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> SendOtpEmail — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:250:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
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
  240 |     expect([404, 400, 500]).toContain(status);
  241 |   });
  242 | 
  243 |   // Happy path: POST /api/registrations/{registrationUuid}/send-otp-email
  244 |   // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.
  245 |   //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();
  246 |   //   2. const email = await mailhog.waitForEmail("user@example.com");
  247 |   //   3. const otp = mailhog.extractOtp(email);
  248 |   //   4. Pass otp in the request body via the payload builder's overrides argument.
  249 |   //   See helper/api/MailhogClient.ts for the full API.
  250 |   test("SendOtpEmail — 200  happy path", async () => {
  251 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email");
  252 |     const { status, body } = await client.sendOtpEmail("test-registrationUuid" /* TODO: replace with real registrationUuid */, sendOtpEmailPayload({ organizationUuid: orgId }));
> 253 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  254 |     // Zod contract validation
  255 |     if (body !== null) {
  256 |       const parsed = SendOtpEmailResponseSchema.safeParse(body);
  257 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  258 |     }
  259 |   });
  260 | 
  261 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized
  262 |   test("SendOtpEmail — 401 unauthorized", async ({ request }) => {
  263 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — unauthorized");
  264 |     // Create a client with a bad token to trigger 401
  265 |     const envVars = APIClient.getEnvVariables();
  266 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  267 |     // Directly call the endpoint with an invalid bearer token
  268 |     const res = await request.post(
  269 |       // replace with the actual URL builder call if needed
  270 |       `${serviceConfig.url}/api/registrations/invalid-registrationUuid/send-otp-email`,
  271 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  272 |     );
  273 |     expect([401, 403]).toContain(res.status());
  274 |   });
  275 | 
  276 |   // Error path: POST /api/registrations/{registrationUuid}/send-otp-email — not found
  277 |   test("SendOtpEmail — 404 not found", async () => {
  278 |     await Reporter.setStory("POST /api/registrations/{registrationUuid}/send-otp-email — not found");
  279 |     const { status } = await client.sendOtpEmail("00000000-0000-0000-0000-000000000000", sendOtpEmailPayload());
  280 |     expect([404, 400, 500]).toContain(status);
  281 |   });
  282 | 
  283 |   // Happy path: POST /api/registrations/fetch-registered-users-for-approval
  284 |   test("FetchRegisteredUsersforapproval — 200  happy path", async () => {
  285 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval");
  286 |     const { status, body } = await client.fetchRegisteredUsersforapproval(fetchRegisteredUsersforapprovalPayload({ organizationUuid: orgId }));
  287 |     expect(status).toBe(200);
  288 |     // Zod contract validation
  289 |     if (body !== null) {
  290 |       const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(body);
  291 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  292 |     }
  293 |   });
  294 | 
  295 |   // Error path: POST /api/registrations/fetch-registered-users-for-approval — unauthorized
  296 |   test("FetchRegisteredUsersforapproval — 401 unauthorized", async ({ request }) => {
  297 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval — unauthorized");
  298 |     // Create a client with a bad token to trigger 401
  299 |     const envVars = APIClient.getEnvVariables();
  300 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  301 |     // Directly call the endpoint with an invalid bearer token
  302 |     const res = await request.post(
  303 |       // replace with the actual URL builder call if needed
  304 |       `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`,
  305 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  306 |     );
  307 |     expect([401, 403]).toContain(res.status());
  308 |   });
  309 | 
  310 |   // Happy path: PUT /api/registrations/approve-pending-registered-users
  311 |   test("ApprovePendingRegisteredUsers — 200  happy path", async () => {
  312 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users");
  313 |     const { status, body } = await client.approvePendingRegisteredUsers(approvePendingRegisteredUsersPayload({ organizationUuid: orgId }));
  314 |     expect(status).toBe(200);
  315 |     // Zod contract validation
  316 |     if (body !== null) {
  317 |       const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(body);
  318 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  319 |     }
  320 |   });
  321 | 
  322 |   // Error path: PUT /api/registrations/approve-pending-registered-users — unauthorized
  323 |   test("ApprovePendingRegisteredUsers — 401 unauthorized", async ({ request }) => {
  324 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users — unauthorized");
  325 |     // Create a client with a bad token to trigger 401
  326 |     const envVars = APIClient.getEnvVariables();
  327 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  328 |     // Directly call the endpoint with an invalid bearer token
  329 |     const res = await request.put(
  330 |       // replace with the actual URL builder call if needed
  331 |       `${serviceConfig.url}/api/registrations/approve-pending-registered-users`,
  332 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  333 |     );
  334 |     expect([401, 403]).toContain(res.status());
  335 |   });
  336 | 
  337 |   // Happy path: PUT /api/registrations/approve-registered-user-with-update
  338 |   test("ApproveRegisteredUserWithUpdateRequest — 200  happy path", async () => {
  339 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update");
  340 |     const { status, body } = await client.approveRegisteredUserWithUpdateRequest(approveRegisteredUserWithUpdateRequestPayload({ organizationUuid: orgId }));
  341 |     expect(status).toBe(200);
  342 |     // Zod contract validation
  343 |     if (body !== null) {
  344 |       const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(body);
  345 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  346 |     }
  347 |   });
  348 | 
  349 |   // Error path: PUT /api/registrations/approve-registered-user-with-update — unauthorized
  350 |   test("ApproveRegisteredUserWithUpdateRequest — 401 unauthorized", async ({ request }) => {
  351 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
  352 |     // Create a client with a bad token to trigger 401
  353 |     const envVars = APIClient.getEnvVariables();
```