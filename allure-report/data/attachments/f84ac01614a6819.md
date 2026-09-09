# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — public >> Ping — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:644:7

# Error details

```
Error: apiRequestContext.get: socket hang up
Call log:
  - → GET https://self-registration.develop.squads-dev.com/api/public/health/v1/ping
    - user-agent: Playwright/1.60.0 (arm64; macOS 26.5) node/20.15
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Authorization: Basic cGluZzpQb25nMzIxIQ==
    - Content-Type: application/json

```

# Test source

```ts
  278 |       headers: this.headers,
  279 |       data: body,
  280 |     });
  281 |     const status = res.status();
  282 |     const body_ = await res.json().catch(() => null);
  283 |     return { status, body: body_ };
  284 |   }
  285 |   /** ValidateOTP */
  286 |   async validateOTP(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  287 |     const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeValidateUrl(userUuid, featureType, this.serviceConfig);
  288 |     const res = await this.request.post(url, {
  289 |       headers: this.headers,
  290 |       data: body,
  291 |     });
  292 |     const status = res.status();
  293 |     const body_ = await res.json().catch(() => null);
  294 |     return { status, body: body_ };
  295 |   }
  296 |   /** VerifyEmail */
  297 |   async verifyEmail(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  298 |     const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeVerifyEmailUrl(userUuid, featureType, this.serviceConfig);
  299 |     const res = await this.request.post(url, {
  300 |       headers: this.headers,
  301 |       data: body,
  302 |     });
  303 |     const status = res.status();
  304 |     if (status >= 200 && status < 300) {
  305 |       const json = await res.json().catch(() => null);
  306 |       if (json !== null) {
  307 |         const parsed = VerifyEmailResponseSchema.safeParse(json);
  308 |         if (!parsed.success) {
  309 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/users/{userUuid}/otp/{featureType}/verify-email:`, parsed.error.format());
  310 |         }
  311 |       }
  312 |     }
  313 |     const body_ = await res.json().catch(() => null);
  314 |     return { status, body: body_ };
  315 |   }
  316 |   /** Fetch */
  317 |   async fetch(organizationUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  318 |     const url = selfRegistrationUrls.getApiOrganizationsByorganizationUuidConfigUrl(organizationUuid, this.serviceConfig);
  319 |     const res = await this.request.get(url, {
  320 |       headers: this.headers,
  321 |       params: queryParams,
  322 |     });
  323 |     const status = res.status();
  324 |     if (status >= 200 && status < 300) {
  325 |       const json = await res.json().catch(() => null);
  326 |       if (json !== null) {
  327 |         const parsed = FetchResponseSchema.safeParse(json);
  328 |         if (!parsed.success) {
  329 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/organizations/{organizationUuid}/config:`, parsed.error.format());
  330 |         }
  331 |       }
  332 |     }
  333 |     const body_ = await res.json().catch(() => null);
  334 |     return { status, body: body_ };
  335 |   }
  336 |   /** Upsert */
  337 |   async upsert(organizationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  338 |     const url = selfRegistrationUrls.postApiOrganizationsByorganizationUuidConfigUrl(organizationUuid, this.serviceConfig);
  339 |     const res = await this.request.post(url, {
  340 |       headers: this.headers,
  341 |       data: body,
  342 |     });
  343 |     const status = res.status();
  344 |     if (status >= 200 && status < 300) {
  345 |       const json = await res.json().catch(() => null);
  346 |       if (json !== null) {
  347 |         const parsed = UpsertResponseSchema.safeParse(json);
  348 |         if (!parsed.success) {
  349 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/organizations/{organizationUuid}/config:`, parsed.error.format());
  350 |         }
  351 |       }
  352 |     }
  353 |     const body_ = await res.json().catch(() => null);
  354 |     return { status, body: body_ };
  355 |   }
  356 |   /** Delete custom attribute for an organization. */
  357 |   async deleteCustomAttribute(organizationUuid: string, customAttributeUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  358 |     const url = selfRegistrationUrls.deleteApiOrganizationsByorganizationUuidCustomAttributesBycustomAttributeUuidUrl(organizationUuid, customAttributeUuid, this.serviceConfig);
  359 |     const res = await this.request.delete(url, {
  360 |       headers: this.headers,
  361 |     });
  362 |     const status = res.status();
  363 |     if (status >= 200 && status < 300) {
  364 |       const json = await res.json().catch(() => null);
  365 |       if (json !== null) {
  366 |         const parsed = DeleteCustomAttributeResponseSchema.safeParse(json);
  367 |         if (!parsed.success) {
  368 |           console.warn(`[SelfRegistrationClient] Contract mismatch on DELETE /api/organizations/{organizationUuid}/custom-attributes/{customAttributeUuid}:`, parsed.error.format());
  369 |         }
  370 |       }
  371 |     }
  372 |     const body_ = await res.json().catch(() => null);
  373 |     return { status, body: body_ };
  374 |   }
  375 |   /** Ping */
  376 |   async ping(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  377 |     const url = selfRegistrationUrls.getApiPublicHealthV1PingUrl(this.serviceConfig);
> 378 |     const res = await this.request.get(url, {
      |                                    ^ Error: apiRequestContext.get: socket hang up
  379 |       headers: this.headers,
  380 |       params: queryParams,
  381 |     });
  382 |     const status = res.status();
  383 |     if (status >= 200 && status < 300) {
  384 |       const json = await res.json().catch(() => null);
  385 |       if (json !== null) {
  386 |         const parsed = PingResponseSchema.safeParse(json);
  387 |         if (!parsed.success) {
  388 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/public/health/v1/ping:`, parsed.error.format());
  389 |         }
  390 |       }
  391 |     }
  392 |     const body_ = await res.json().catch(() => null);
  393 |     return { status, body: body_ };
  394 |   }
  395 |   /** LocalHealth */
  396 |   async localHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  397 |     const url = selfRegistrationUrls.getApiHealthV1LocalUrl(this.serviceConfig);
  398 |     const res = await this.request.get(url, {
  399 |       headers: this.headers,
  400 |       params: queryParams,
  401 |     });
  402 |     const status = res.status();
  403 |     if (status >= 200 && status < 300) {
  404 |       const json = await res.json().catch(() => null);
  405 |       if (json !== null) {
  406 |         const parsed = LocalHealthResponseSchema.safeParse(json);
  407 |         if (!parsed.success) {
  408 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/local:`, parsed.error.format());
  409 |         }
  410 |       }
  411 |     }
  412 |     const body_ = await res.json().catch(() => null);
  413 |     return { status, body: body_ };
  414 |   }
  415 |   /** RemoteHealth */
  416 |   async remoteHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  417 |     const url = selfRegistrationUrls.getApiHealthV1RemoteUrl(this.serviceConfig);
  418 |     const res = await this.request.get(url, {
  419 |       headers: this.headers,
  420 |       params: queryParams,
  421 |     });
  422 |     const status = res.status();
  423 |     if (status >= 200 && status < 300) {
  424 |       const json = await res.json().catch(() => null);
  425 |       if (json !== null) {
  426 |         const parsed = RemoteHealthResponseSchema.safeParse(json);
  427 |         if (!parsed.success) {
  428 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/remote:`, parsed.error.format());
  429 |         }
  430 |       }
  431 |     }
  432 |     const body_ = await res.json().catch(() => null);
  433 |     return { status, body: body_ };
  434 |   }
  435 |   /** LocalAndRemoteHealth */
  436 |   async localAndRemoteHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  437 |     const url = selfRegistrationUrls.getApiHealthV1AllUrl(this.serviceConfig);
  438 |     const res = await this.request.get(url, {
  439 |       headers: this.headers,
  440 |       params: queryParams,
  441 |     });
  442 |     const status = res.status();
  443 |     if (status >= 200 && status < 300) {
  444 |       const json = await res.json().catch(() => null);
  445 |       if (json !== null) {
  446 |         const parsed = LocalAndRemoteHealthResponseSchema.safeParse(json);
  447 |         if (!parsed.success) {
  448 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/all:`, parsed.error.format());
  449 |         }
  450 |       }
  451 |     }
  452 |     const body_ = await res.json().catch(() => null);
  453 |     return { status, body: body_ };
  454 |   }
  455 |   /** BasicAuthHealth */
  456 |   async basicAuthHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  457 |     const url = selfRegistrationUrls.getApiHealthV1AuthBasicUrl(this.serviceConfig);
  458 |     const res = await this.request.get(url, {
  459 |       headers: this.headers,
  460 |       params: queryParams,
  461 |     });
  462 |     const status = res.status();
  463 |     if (status >= 200 && status < 300) {
  464 |       const json = await res.json().catch(() => null);
  465 |       if (json !== null) {
  466 |         const parsed = BasicAuthHealthResponseSchema.safeParse(json);
  467 |         if (!parsed.success) {
  468 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/auth/basic:`, parsed.error.format());
  469 |         }
  470 |       }
  471 |     }
  472 |     const body_ = await res.json().catch(() => null);
  473 |     return { status, body: body_ };
  474 |   }
  475 |   /** GetBuildVersion */
  476 |   async getBuildVersion(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  477 |     const url = selfRegistrationUrls.getApiPublicBuildVersionUrl(this.serviceConfig);
  478 |     const res = await this.request.get(url, {
```