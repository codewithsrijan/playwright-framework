# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — Site Shutdown >> ShutdownSelfRegistration — 401 unauthorized
- Location: tests/tests-api/selfRegistration.spec.ts:397:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [401, 403]
```

# Test source

```ts
  308 |     await Reporter.setStory("PUT /api/registrations/approve-registered-user-with-update — unauthorized");
  309 |     // Create a client with a bad token to trigger 401
  310 |     const envVars = APIClient.getEnvVariables();
  311 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  312 |     // Directly call the endpoint with an invalid bearer token
  313 |     const res = await request.put(
  314 |       // replace with the actual URL builder call if needed
  315 |       `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`,
  316 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  317 |     );
  318 |     expect([401, 403]).toContain(res.status());
  319 |   });
  320 | 
  321 |   // Happy path: PUT /api/registrations/reject-pending-registration-users
  322 |   test("RejectUserRegistration — 200  happy path", async () => {
  323 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users");
  324 |     const { status, body } = await client.rejectUserRegistration({});
  325 |     expect(status).toBe(200);
  326 |     // Zod contract validation
  327 |     if (body !== null) {
  328 |       const parsed = RejectUserRegistrationResponseSchema.safeParse(body);
  329 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  330 |     }
  331 |   });
  332 | 
  333 |   // Error path: PUT /api/registrations/reject-pending-registration-users — unauthorized
  334 |   test("RejectUserRegistration — 401 unauthorized", async ({ request }) => {
  335 |     await Reporter.setStory("PUT /api/registrations/reject-pending-registration-users — unauthorized");
  336 |     // Create a client with a bad token to trigger 401
  337 |     const envVars = APIClient.getEnvVariables();
  338 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  339 |     // Directly call the endpoint with an invalid bearer token
  340 |     const res = await request.put(
  341 |       // replace with the actual URL builder call if needed
  342 |       `${serviceConfig.url}/api/registrations/reject-pending-registration-users`,
  343 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  344 |     );
  345 |     expect([401, 403]).toContain(res.status());
  346 |   });
  347 | 
  348 |   // Happy path: PUT /api/registrations/bulk-update-custom-attribute-values
  349 |   test("BulkUpdateCustomAttributeValues — 200  happy path", async () => {
  350 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values");
  351 |     const { status, body } = await client.bulkUpdateCustomAttributeValues({});
  352 |     expect(status).toBe(200);
  353 |     // Zod contract validation
  354 |     if (body !== null) {
  355 |       const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(body);
  356 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  357 |     }
  358 |   });
  359 | 
  360 |   // Error path: PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized
  361 |   test("BulkUpdateCustomAttributeValues — 401 unauthorized", async ({ request }) => {
  362 |     await Reporter.setStory("PUT /api/registrations/bulk-update-custom-attribute-values — unauthorized");
  363 |     // Create a client with a bad token to trigger 401
  364 |     const envVars = APIClient.getEnvVariables();
  365 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  366 |     // Directly call the endpoint with an invalid bearer token
  367 |     const res = await request.put(
  368 |       // replace with the actual URL builder call if needed
  369 |       `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`,
  370 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  371 |     );
  372 |     expect([401, 403]).toContain(res.status());
  373 |   });
  374 | 
  375 | });
  376 | 
  377 | test.describe("SelfRegistration — Site Shutdown", () => {
  378 |   test.beforeEach(async () => {
  379 |     await Reporter.setEpic("SelfRegistration");
  380 |     await Reporter.setFeature("Site Shutdown");
  381 |     await Reporter.addTags("api", "auto-generated");
  382 |   });
  383 | 
  384 |   // Happy path: POST /api/v2/site-shutdown/sync/shutdown
  385 |   test("ShutdownSelfRegistration — 200  happy path", async () => {
  386 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown");
  387 |     const { status, body } = await client.shutdownSelfRegistration({});
  388 |     expect(status).toBe(200);
  389 |     // Zod contract validation
  390 |     if (body !== null) {
  391 |       const parsed = ShutdownSelfRegistrationResponseSchema.safeParse(body);
  392 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  393 |     }
  394 |   });
  395 | 
  396 |   // Error path: POST /api/v2/site-shutdown/sync/shutdown — unauthorized
  397 |   test("ShutdownSelfRegistration — 401 unauthorized", async ({ request }) => {
  398 |     await Reporter.setStory("POST /api/v2/site-shutdown/sync/shutdown — unauthorized");
  399 |     // Create a client with a bad token to trigger 401
  400 |     const envVars = APIClient.getEnvVariables();
  401 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  402 |     // Directly call the endpoint with an invalid bearer token
  403 |     const res = await request.post(
  404 |       // replace with the actual URL builder call if needed
  405 |       `${serviceConfig.url}/api/v2/site-shutdown/sync/shutdown`,
  406 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  407 |     );
> 408 |     expect([401, 403]).toContain(res.status());
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  409 |   });
  410 | 
  411 | });
  412 | 
  413 | test.describe("SelfRegistration — otp integration", () => {
  414 |   test.beforeEach(async () => {
  415 |     await Reporter.setEpic("SelfRegistration");
  416 |     await Reporter.setFeature("otp integration");
  417 |     await Reporter.addTags("api", "auto-generated");
  418 |   });
  419 | 
  420 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/generate
  421 |   test("GenerateOtp — 204  happy path", async () => {
  422 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate");
  423 |     const { status, body } = await client.generateOtp("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  424 |     expect(status).toBe(204);
  425 |   });
  426 | 
  427 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized
  428 |   test("GenerateOtp — 401 unauthorized", async ({ request }) => {
  429 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized");
  430 |     // Create a client with a bad token to trigger 401
  431 |     const envVars = APIClient.getEnvVariables();
  432 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  433 |     // Directly call the endpoint with an invalid bearer token
  434 |     const res = await request.post(
  435 |       // replace with the actual URL builder call if needed
  436 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/generate`,
  437 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  438 |     );
  439 |     expect([401, 403]).toContain(res.status());
  440 |   });
  441 | 
  442 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — not found
  443 |   test("GenerateOtp — 404 not found", async () => {
  444 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — not found");
  445 |     const { status } = await client.generateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  446 |     expect([404, 400]).toContain(status);
  447 |   });
  448 | 
  449 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/validate
  450 |   test("ValidateOTP — 204  happy path", async () => {
  451 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate");
  452 |     const { status, body } = await client.validateOTP("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  453 |     expect(status).toBe(204);
  454 |   });
  455 | 
  456 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized
  457 |   test("ValidateOTP — 401 unauthorized", async ({ request }) => {
  458 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized");
  459 |     // Create a client with a bad token to trigger 401
  460 |     const envVars = APIClient.getEnvVariables();
  461 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  462 |     // Directly call the endpoint with an invalid bearer token
  463 |     const res = await request.post(
  464 |       // replace with the actual URL builder call if needed
  465 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/validate`,
  466 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  467 |     );
  468 |     expect([401, 403]).toContain(res.status());
  469 |   });
  470 | 
  471 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — not found
  472 |   test("ValidateOTP — 404 not found", async () => {
  473 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — not found");
  474 |     const { status } = await client.validateOTP("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  475 |     expect([404, 400]).toContain(status);
  476 |   });
  477 | 
  478 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/verify-email
  479 |   test("VerifyEmail — 200  happy path", async () => {
  480 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email");
  481 |     const { status, body } = await client.verifyEmail("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  482 |     expect(status).toBe(200);
  483 |     // Zod contract validation
  484 |     if (body !== null) {
  485 |       const parsed = VerifyEmailResponseSchema.safeParse(body);
  486 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  487 |     }
  488 |   });
  489 | 
  490 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized
  491 |   test("VerifyEmail — 401 unauthorized", async ({ request }) => {
  492 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized");
  493 |     // Create a client with a bad token to trigger 401
  494 |     const envVars = APIClient.getEnvVariables();
  495 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  496 |     // Directly call the endpoint with an invalid bearer token
  497 |     const res = await request.post(
  498 |       // replace with the actual URL builder call if needed
  499 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
  500 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  501 |     );
  502 |     expect([401, 403]).toContain(res.status());
  503 |   });
  504 | 
  505 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  506 |   test("VerifyEmail — 404 not found", async () => {
  507 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
  508 |     const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
```