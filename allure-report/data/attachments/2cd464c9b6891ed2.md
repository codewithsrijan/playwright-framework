# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — otp integration >> ValidateOTP — 204  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:463:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 204
Received: 400
```

# Test source

```ts
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
  411 |     // Create a client with a bad token to trigger 401
  412 |     const envVars = APIClient.getEnvVariables();
  413 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  414 |     // Directly call the endpoint with an invalid bearer token
  415 |     const res = await request.post(
  416 |       // replace with the actual URL builder call if needed
  417 |       `${serviceConfig.url}/api/v2/site-shutdown/sync/shutdown`,
  418 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  419 |     );
  420 |     // NOTE: service returns 500 when body is missing + token is invalid (body is validated before auth)
  421 |     expect([401, 403, 500]).toContain(res.status());
  422 |   });
  423 | 
  424 | });
  425 | 
  426 | test.describe("SelfRegistration — otp integration", () => {
  427 |   test.beforeEach(async () => {
  428 |     await Reporter.setEpic("SelfRegistration");
  429 |     await Reporter.setFeature("otp integration");
  430 |     await Reporter.addTags("api", "auto-generated");
  431 |   });
  432 | 
  433 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/generate
  434 |   test("GenerateOtp — 204  happy path", async () => {
  435 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate");
  436 |     const { status, body } = await client.generateOtp("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  437 |     expect(status).toBe(204);
  438 |   });
  439 | 
  440 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized
  441 |   test("GenerateOtp — 401 unauthorized", async ({ request }) => {
  442 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — unauthorized");
  443 |     // Create a client with a bad token to trigger 401
  444 |     const envVars = APIClient.getEnvVariables();
  445 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  446 |     // Directly call the endpoint with an invalid bearer token
  447 |     const res = await request.post(
  448 |       // replace with the actual URL builder call if needed
  449 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/generate`,
  450 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  451 |     );
  452 |     expect([401, 403]).toContain(res.status());
  453 |   });
  454 | 
  455 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/generate — not found
  456 |   test("GenerateOtp — 404 not found", async () => {
  457 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/generate — not found");
  458 |     const { status } = await client.generateOtp("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  459 |     expect([404, 400]).toContain(status);
  460 |   });
  461 | 
  462 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/validate
  463 |   test("ValidateOTP — 204  happy path", async () => {
  464 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate");
  465 |     const { status, body } = await client.validateOTP("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
> 466 |     expect(status).toBe(204);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  467 |   });
  468 | 
  469 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized
  470 |   test("ValidateOTP — 401 unauthorized", async ({ request }) => {
  471 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — unauthorized");
  472 |     // Create a client with a bad token to trigger 401
  473 |     const envVars = APIClient.getEnvVariables();
  474 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  475 |     // Directly call the endpoint with an invalid bearer token
  476 |     const res = await request.post(
  477 |       // replace with the actual URL builder call if needed
  478 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/validate`,
  479 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  480 |     );
  481 |     expect([401, 403]).toContain(res.status());
  482 |   });
  483 | 
  484 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/validate — not found
  485 |   test("ValidateOTP — 404 not found", async () => {
  486 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/validate — not found");
  487 |     const { status } = await client.validateOTP("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  488 |     expect([404, 400]).toContain(status);
  489 |   });
  490 | 
  491 |   // Happy path: POST /api/users/{userUuid}/otp/{featureType}/verify-email
  492 |   test("VerifyEmail — 200  happy path", async () => {
  493 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email");
  494 |     const { status, body } = await client.verifyEmail("test-userUuid", "test-featureType", {}); // TODO: replace with real userUuid & featureType
  495 |     expect(status).toBe(200);
  496 |     // Zod contract validation
  497 |     if (body !== null) {
  498 |       const parsed = VerifyEmailResponseSchema.safeParse(body);
  499 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  500 |     }
  501 |   });
  502 | 
  503 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized
  504 |   test("VerifyEmail — 401 unauthorized", async ({ request }) => {
  505 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — unauthorized");
  506 |     // Create a client with a bad token to trigger 401
  507 |     const envVars = APIClient.getEnvVariables();
  508 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  509 |     // Directly call the endpoint with an invalid bearer token
  510 |     const res = await request.post(
  511 |       // replace with the actual URL builder call if needed
  512 |       `${serviceConfig.url}/api/users/invalid-userUuid/otp/invalid-featureType/verify-email`,
  513 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  514 |     );
  515 |     expect([401, 403]).toContain(res.status());
  516 |   });
  517 | 
  518 |   // Error path: POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found
  519 |   test("VerifyEmail — 404 not found", async () => {
  520 |     await Reporter.setStory("POST /api/users/{userUuid}/otp/{featureType}/verify-email — not found");
  521 |     const { status } = await client.verifyEmail("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000", {});
  522 |     expect([404, 400]).toContain(status);
  523 |   });
  524 | 
  525 | });
  526 | 
  527 | test.describe("SelfRegistration — organizations", () => {
  528 |   test.beforeEach(async () => {
  529 |     await Reporter.setEpic("SelfRegistration");
  530 |     await Reporter.setFeature("organizations");
  531 |     await Reporter.addTags("api", "auto-generated");
  532 |   });
  533 | 
  534 |   // Happy path: GET /api/organizations/{organizationUuid}/config
  535 |   test("Fetch — 200  happy path", async () => {
  536 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config");
  537 |     const { status, body } = await client.fetch(orgId);
  538 |     expect(status).toBe(200);
  539 |     // Zod contract validation
  540 |     if (body !== null) {
  541 |       const parsed = FetchResponseSchema.safeParse(body);
  542 |       expect(parsed.success, `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  543 |     }
  544 |   });
  545 | 
  546 |   // Error path: GET /api/organizations/{organizationUuid}/config — unauthorized
  547 |   test("Fetch — 401 unauthorized", async ({ request }) => {
  548 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — unauthorized");
  549 |     // Create a client with a bad token to trigger 401
  550 |     const envVars = APIClient.getEnvVariables();
  551 |     const serviceConfig = envVars["selfRegistration"] as { url: string };
  552 |     // Directly call the endpoint with an invalid bearer token
  553 |     const res = await request.get(
  554 |       // replace with the actual URL builder call if needed
  555 |       `${serviceConfig.url}/api/organizations/invalid-organizationUuid/config`,
  556 |       { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },
  557 |     );
  558 |     expect([401, 403]).toContain(res.status());
  559 |   });
  560 | 
  561 |   // Error path: GET /api/organizations/{organizationUuid}/config — not found
  562 |   test("Fetch — 404 not found", async () => {
  563 |     await Reporter.setStory("GET /api/organizations/{organizationUuid}/config — not found");
  564 |     const { status } = await client.fetch("00000000-0000-0000-0000-000000000000");
  565 |     expect([404, 400]).toContain(status);
  566 |   });
```