# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> FetchRegisteredUsersforapproval — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:251:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  246 |     const { status } = await client.sendOtpEmail("00000000-0000-0000-0000-000000000000", {});
  247 |     expect([404, 400]).toContain(status);
  248 |   });
  249 | 
  250 |   // Happy path: POST /api/registrations/fetch-registered-users-for-approval
  251 |   test("FetchRegisteredUsersforapproval — 200  happy path", async () => {
  252 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval");
  253 |     const { status, body } = await client.fetchRegisteredUsersforapproval({});
> 254 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  255 |     // Zod contract validation
  256 |     if (body !== null) {
  257 |       const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(body);
  258 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  259 |     }
  260 |   });
  261 | 
  262 |   // Error path: POST /api/registrations/fetch-registered-users-for-approval — unauthorized
  263 |   test("FetchRegisteredUsersforapproval — 401 unauthorized", async ({ request }) => {
  264 |     await Reporter.setStory("POST /api/registrations/fetch-registered-users-for-approval — unauthorized");
  265 |     // Create a client with a bad token to trigger 401
  266 |     const envVars = APIClient.getEnvVariables();
  267 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  268 |     // Directly call the endpoint with an invalid bearer token
  269 |     const res = await request.post(
  270 |       // replace with the actual URL builder call if needed
  271 |       `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`,
  272 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  273 |     );
  274 |     expect([401, 403]).toContain(res.status());
  275 |   });
  276 | 
  277 |   // Happy path: PUT /api/registrations/approve-pending-registered-users
  278 |   test("ApprovePendingRegisteredUsers — 200  happy path", async () => {
  279 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users");
  280 |     const { status, body } = await client.approvePendingRegisteredUsers({});
  281 |     expect(status).toBe(200);
  282 |     // Zod contract validation
  283 |     if (body !== null) {
  284 |       const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(body);
  285 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  286 |     }
  287 |   });
  288 | 
  289 |   // Error path: PUT /api/registrations/approve-pending-registered-users — unauthorized
  290 |   test("ApprovePendingRegisteredUsers — 401 unauthorized", async ({ request }) => {
  291 |     await Reporter.setStory("PUT /api/registrations/approve-pending-registered-users — unauthorized");
  292 |     // Create a client with a bad token to trigger 401
  293 |     const envVars = APIClient.getEnvVariables();
  294 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  295 |     // Directly call the endpoint with an invalid bearer token
  296 |     const res = await request.put(
  297 |       // replace with the actual URL builder call if needed
  298 |       `${serviceConfig.url}/api/registrations/approve-pending-registered-users`,
  299 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  300 |     );
  301 |     expect([401, 403]).toContain(res.status());
  302 |   });
  303 | 
  304 |   // Happy path: PUT /api/registrations/approve-registered-user-with-update
  305 |   test("ApproveRegisteredUserWithUpdateRequest — 200  happy path", async () => {
  306 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update");
  307 |     const { status, body } = await client.approveRegisteredUserWithUpdateRequest({});
  308 |     expect(status).toBe(200);
  309 |     // Zod contract validation
  310 |     if (body !== null) {
  311 |       const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(body);
  312 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  313 |     }
  314 |   });
  315 | 
  316 |   // Error path: PUT /api/registrations/approve-registered-user-with-update — unauthorized
  317 |   test("ApproveRegisteredUserWithUpdateRequest — 401 unauthorized", async ({ request }) => {
  318 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
  319 |     // Create a client with a bad token to trigger 401
  320 |     const envVars = APIClient.getEnvVariables();
  321 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  322 |     // Directly call the endpoint with an invalid bearer token
  323 |     const res = await request.put(
  324 |       // replace with the actual URL builder call if needed
  325 |       `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`,
  326 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  327 |     );
  328 |     expect([401, 403]).toContain(res.status());
  329 |   });
  330 | 
  331 |   // Happy path: PUT /api/registrations/reject-pending-registration-users
  332 |   test("RejectUserRegistration — 200  happy path", async () => {
  333 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users");
  334 |     const { status, body } = await client.rejectUserRegistration({});
  335 |     expect(status).toBe(200);
  336 |     // Zod contract validation
  337 |     if (body !== null) {
  338 |       const parsed = RejectUserRegistrationResponseSchema.safeParse(body);
  339 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  340 |     }
  341 |   });
  342 | 
  343 |   // Error path: PUT /api/registrations/reject-pending-registration-users — unauthorized
  344 |   test("RejectUserRegistration — 401 unauthorized", async ({ request }) => {
  345 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users — unauthorized");
  346 |     // Create a client with a bad token to trigger 401
  347 |     const envVars = APIClient.getEnvVariables();
  348 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  349 |     // Directly call the endpoint with an invalid bearer token
  350 |     const res = await request.put(
  351 |       // replace with the actual URL builder call if needed
  352 |       `${serviceConfig.url}/api/registrations/reject-pending-registration-users`,
  353 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  354 |     );
```