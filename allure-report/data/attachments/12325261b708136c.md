# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — otp integration >> GenerateOtp — 204  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:432:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 204
Received: 400
```

# Test source

```ts
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
> 435 |     expect(status).toBe(204);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  436 |   });
  437 | 
  438 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized
  439 |   test("GenerateOtp — 401 unauthorized", async ({ request }) => {
  440 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized");
  441 |     // Create a client with a bad token to trigger 401
  442 |     const envVars = APIClient.getEnvVariables();
  443 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  444 |     // Directly call the endpoint with an invalid bearer token
  445 |     const res = await request.post(
  446 |       // replace with the actual URL builder call if needed
  447 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/generate`,
  448 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  449 |     );
  450 |     expect([401, 403]).toContain(res.status());
  451 |   });
  452 | 
  453 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — not found
  454 |   test("GenerateOtp — 404 not found", async () => {
  455 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — not found");
  456 |     const { status } = await client.generateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  457 |     expect([404, 400]).toContain(status);
  458 |   });
  459 | 
  460 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/validate
  461 |   test("ValidateOTP — 204  happy path", async () => {
  462 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate");
  463 |     const { status, body } = await client.validateOTP("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  464 |     expect(status).toBe(204);
  465 |   });
  466 | 
  467 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized
  468 |   test("ValidateOTP — 401 unauthorized", async ({ request }) => {
  469 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized");
  470 |     // Create a client with a bad token to trigger 401
  471 |     const envVars = APIClient.getEnvVariables();
  472 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  473 |     // Directly call the endpoint with an invalid bearer token
  474 |     const res = await request.post(
  475 |       // replace with the actual URL builder call if needed
  476 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/validate`,
  477 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  478 |     );
  479 |     expect([401, 403]).toContain(res.status());
  480 |   });
  481 | 
  482 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — not found
  483 |   test("ValidateOTP — 404 not found", async () => {
  484 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — not found");
  485 |     const { status } = await client.validateOTP("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  486 |     expect([404, 400]).toContain(status);
  487 |   });
  488 | 
  489 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/verify-email
  490 |   test("VerifyEmail — 200  happy path", async () => {
  491 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email");
  492 |     const { status, body } = await client.verifyEmail("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  493 |     expect(status).toBe(200);
  494 |     // Zod contract validation
  495 |     if (body !== null) {
  496 |       const parsed = VerifyEmailResponseSchema.safeParse(body);
  497 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  498 |     }
  499 |   });
  500 | 
  501 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized
  502 |   test("VerifyEmail — 401 unauthorized", async ({ request }) => {
  503 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized");
  504 |     // Create a client with a bad token to trigger 401
  505 |     const envVars = APIClient.getEnvVariables();
  506 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  507 |     // Directly call the endpoint with an invalid bearer token
  508 |     const res = await request.post(
  509 |       // replace with the actual URL builder call if needed
  510 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
  511 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  512 |     );
  513 |     expect([401, 403]).toContain(res.status());
  514 |   });
  515 | 
  516 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  517 |   test("VerifyEmail — 404 not found", async () => {
  518 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
  519 |     const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  520 |     expect([404, 400]).toContain(status);
  521 |   });
  522 | 
  523 | });
  524 | 
  525 | test.describe("SelfRegistration — organizations", () => {
  526 |   test.beforeEach(async () => {
  527 |     await Reporter.setEpic("SelfRegistration");
  528 |     await Reporter.setFeature("organizations");
  529 |     await Reporter.addTags("api", "auto-generated");
  530 |   });
  531 | 
  532 |   // Happy path: GET /api/organizations/{organizationUuid}/config
  533 |   test("Fetch — 200  happy path", async () => {
  534 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config");
  535 |     const { status, body } = await client.fetch(orgId);
```