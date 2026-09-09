# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> RejectUserRegistration — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:332:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
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
  254 |     expect(status).toBe(200);
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
> 335 |     expect(status).toBe(200);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
  355 |     expect([401, 403]).toContain(res.status());
  356 |   });
  357 | 
  358 |   // Happy path: PUT /api/registrations/bulk-update-custom-attribute-values
  359 |   test("BulkUpdateCustomAttributeValues — 200  happy path", async () => {
  360 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values");
  361 |     const { status, body } = await client.bulkUpdateCustomAttributeValues({});
  362 |     expect(status).toBe(200);
  363 |     // Zod contract validation
  364 |     if (body !== null) {
  365 |       const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(body);
  366 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  367 |     }
  368 |   });
  369 | 
  370 |   // Error path: PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized
  371 |   test("BulkUpdateCustomAttributeValues — 401 unauthorized", async ({ request }) => {
  372 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized");
  373 |     // Create a client with a bad token to trigger 401
  374 |     const envVars = APIClient.getEnvVariables();
  375 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  376 |     // Directly call the endpoint with an invalid bearer token
  377 |     const res = await request.put(
  378 |       // replace with the actual URL builder call if needed
  379 |       `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`,
  380 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  381 |     );
  382 |     expect([401, 403]).toContain(res.status());
  383 |   });
  384 | 
  385 | });
  386 | 
  387 | test.describe("SelfRegistration — Site Shutdown", () => {
  388 |   test.beforeEach(async () => {
  389 |     await Reporter.setEpic("SelfRegistration");
  390 |     await Reporter.setFeature("Site Shutdown");
  391 |     await Reporter.addTags("api", "auto-generated");
  392 |   });
  393 | 
  394 |   // Happy path: POST /api/v2/site-shutdown/sync/shutdown
  395 |   test("ShutdownSelfRegistration — 200  happy path", async () => {
  396 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown");
  397 |     const { status, body } = await client.shutdownSelfRegistration({});
  398 |     expect(status).toBe(200);
  399 |     // Zod contract validation
  400 |     if (body !== null) {
  401 |       const parsed = ShutdownSelfRegistrationResponseSchema.safeParse(body);
  402 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  403 |     }
  404 |   });
  405 | 
  406 |   // Error path: POST /api/v2/site-shutdown/sync/shutdown — unauthorized
  407 |   test("ShutdownSelfRegistration — 401 unauthorized", async ({ request }) => {
  408 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown — unauthorized");
  409 |     // Create a client with a bad token to trigger 401
  410 |     const envVars = APIClient.getEnvVariables();
  411 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  412 |     // Directly call the endpoint with an invalid bearer token
  413 |     const res = await request.post(
  414 |       // replace with the actual URL builder call if needed
  415 |       `${serviceConfig.url}/api/v2/site-shutdown/sync/shutdown`,
  416 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  417 |     );
  418 |     // NOTE: service returns 500 when body is missing + token is invalid (body is validated before auth)
  419 |     expect([401, 403, 500]).toContain(res.status());
  420 |   });
  421 | 
  422 | });
  423 | 
  424 | test.describe("SelfRegistration — otp integration", () => {
  425 |   test.beforeEach(async () => {
  426 |     await Reporter.setEpic("SelfRegistration");
  427 |     await Reporter.setFeature("otp integration");
  428 |     await Reporter.addTags("api", "auto-generated");
  429 |   });
  430 | 
  431 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/generate
  432 |   test("GenerateOtp — 204  happy path", async () => {
  433 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate");
  434 |     const { status, body } = await client.generateOtp("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  435 |     expect(status).toBe(204);
```