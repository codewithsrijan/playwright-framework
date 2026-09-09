# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> ApproveRegisteredUserWithUpdateRequest — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:307:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  222 |     expect(status).toBe(200);
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
> 310 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
  323 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  324 |     // Directly call the endpoint with an invalid bearer token
  325 |     const res = await request.put(
  326 |       // replace with the actual URL builder call if needed
  327 |       `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`,
  328 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  329 |     );
  330 |     expect([401, 403]).toContain(res.status());
  331 |   });
  332 | 
  333 |   // Happy path: PUT /api/registrations/reject-pending-registration-users
  334 |   test("RejectUserRegistration — 200  happy path", async () => {
  335 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users");
  336 |     const { status, body } = await client.rejectUserRegistration({});
  337 |     expect(status).toBe(200);
  338 |     // Zod contract validation
  339 |     if (body !== null) {
  340 |       const parsed = RejectUserRegistrationResponseSchema.safeParse(body);
  341 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  342 |     }
  343 |   });
  344 | 
  345 |   // Error path: PUT /api/registrations/reject-pending-registration-users — unauthorized
  346 |   test("RejectUserRegistration — 401 unauthorized", async ({ request }) => {
  347 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users — unauthorized");
  348 |     // Create a client with a bad token to trigger 401
  349 |     const envVars = APIClient.getEnvVariables();
  350 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  351 |     // Directly call the endpoint with an invalid bearer token
  352 |     const res = await request.put(
  353 |       // replace with the actual URL builder call if needed
  354 |       `${serviceConfig.url}/api/registrations/reject-pending-registration-users`,
  355 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  356 |     );
  357 |     expect([401, 403]).toContain(res.status());
  358 |   });
  359 | 
  360 |   // Happy path: PUT /api/registrations/bulk-update-custom-attribute-values
  361 |   test("BulkUpdateCustomAttributeValues — 200  happy path", async () => {
  362 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values");
  363 |     const { status, body } = await client.bulkUpdateCustomAttributeValues({});
  364 |     expect(status).toBe(200);
  365 |     // Zod contract validation
  366 |     if (body !== null) {
  367 |       const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(body);
  368 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  369 |     }
  370 |   });
  371 | 
  372 |   // Error path: PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized
  373 |   test("BulkUpdateCustomAttributeValues — 401 unauthorized", async ({ request }) => {
  374 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized");
  375 |     // Create a client with a bad token to trigger 401
  376 |     const envVars = APIClient.getEnvVariables();
  377 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  378 |     // Directly call the endpoint with an invalid bearer token
  379 |     const res = await request.put(
  380 |       // replace with the actual URL builder call if needed
  381 |       `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`,
  382 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  383 |     );
  384 |     expect([401, 403]).toContain(res.status());
  385 |   });
  386 | 
  387 | });
  388 | 
  389 | test.describe("SelfRegistration — Site Shutdown", () => {
  390 |   test.beforeEach(async () => {
  391 |     await Reporter.setEpic("SelfRegistration");
  392 |     await Reporter.setFeature("Site Shutdown");
  393 |     await Reporter.addTags("api", "auto-generated");
  394 |   });
  395 | 
  396 |   // Happy path: POST /api/v2/site-shutdown/sync/shutdown
  397 |   test("ShutdownSelfRegistration — 200  happy path", async () => {
  398 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown");
  399 |     const { status, body } = await client.shutdownSelfRegistration({});
  400 |     expect(status).toBe(200);
  401 |     // Zod contract validation
  402 |     if (body !== null) {
  403 |       const parsed = ShutdownSelfRegistrationResponseSchema.safeParse(body);
  404 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  405 |     }
  406 |   });
  407 | 
  408 |   // Error path: POST /api/v2/site-shutdown/sync/shutdown — unauthorized
  409 |   test("ShutdownSelfRegistration — 401 unauthorized", async ({ request }) => {
  410 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown — unauthorized");
```