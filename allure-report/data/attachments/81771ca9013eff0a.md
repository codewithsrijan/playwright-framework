# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — otp integration >> ValidateOTP — 204  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:450:7

# Error details

```
Error: apiRequestContext.post: Fixture { request } from beforeAll cannot be reused in a test.
  - Recommended fix: use a separate { request } in the test.
  - Alternatively, manually create APIRequestContext in beforeAll and dispose it in afterAll.
See https://playwright.dev/docs/api-testing#sending-api-requests-from-ui-tests for more details.
```

# Test source

```ts
  188 |         }
  189 |       }
  190 |     }
  191 |     const body_ = await res.json().catch(() => null);
  192 |     return { status, body: body_ };
  193 |   }
  194 |   /** ApproveRegisteredUserWithUpdateRequest */
  195 |   async approveRegisteredUserWithUpdateRequest(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  196 |     const url = selfRegistrationUrls.putApiRegistrationsApproveRegisteredUserWithUpdateUrl(this.serviceConfig);
  197 |     const res = await this.request.put(url, {
  198 |       headers: this.headers,
  199 |       data: body,
  200 |     });
  201 |     const status = res.status();
  202 |     if (status >= 200 && status < 300) {
  203 |       const json = await res.json().catch(() => null);
  204 |       if (json !== null) {
  205 |         const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(json);
  206 |         if (!parsed.success) {
  207 |           console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/approve-registered-user-with-update:`, parsed.error.format());
  208 |         }
  209 |       }
  210 |     }
  211 |     const body_ = await res.json().catch(() => null);
  212 |     return { status, body: body_ };
  213 |   }
  214 |   /** RejectUserRegistration */
  215 |   async rejectUserRegistration(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  216 |     const url = selfRegistrationUrls.putApiRegistrationsRejectPendingRegistrationUsersUrl(this.serviceConfig);
  217 |     const res = await this.request.put(url, {
  218 |       headers: this.headers,
  219 |       data: body,
  220 |     });
  221 |     const status = res.status();
  222 |     if (status >= 200 && status < 300) {
  223 |       const json = await res.json().catch(() => null);
  224 |       if (json !== null) {
  225 |         const parsed = RejectUserRegistrationResponseSchema.safeParse(json);
  226 |         if (!parsed.success) {
  227 |           console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/reject-pending-registration-users:`, parsed.error.format());
  228 |         }
  229 |       }
  230 |     }
  231 |     const body_ = await res.json().catch(() => null);
  232 |     return { status, body: body_ };
  233 |   }
  234 |   /** BulkUpdateCustomAttributeValues */
  235 |   async bulkUpdateCustomAttributeValues(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  236 |     const url = selfRegistrationUrls.putApiRegistrationsBulkUpdateCustomAttributeValuesUrl(this.serviceConfig);
  237 |     const res = await this.request.put(url, {
  238 |       headers: this.headers,
  239 |       data: body,
  240 |     });
  241 |     const status = res.status();
  242 |     if (status >= 200 && status < 300) {
  243 |       const json = await res.json().catch(() => null);
  244 |       if (json !== null) {
  245 |         const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(json);
  246 |         if (!parsed.success) {
  247 |           console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/bulk-update-custom-attribute-values:`, parsed.error.format());
  248 |         }
  249 |       }
  250 |     }
  251 |     const body_ = await res.json().catch(() => null);
  252 |     return { status, body: body_ };
  253 |   }
  254 |   /** ShutdownSelfRegistration */
  255 |   async shutdownSelfRegistration(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  256 |     const url = selfRegistrationUrls.postApiV2SiteShutdownSyncShutdownUrl(this.serviceConfig);
  257 |     const res = await this.request.post(url, {
  258 |       headers: this.headers,
  259 |       data: body,
  260 |     });
  261 |     const status = res.status();
  262 |     if (status >= 200 && status < 300) {
  263 |       const json = await res.json().catch(() => null);
  264 |       if (json !== null) {
  265 |         const parsed = ShutdownSelfRegistrationResponseSchema.safeParse(json);
  266 |         if (!parsed.success) {
  267 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/v2/site-shutdown/sync/shutdown:`, parsed.error.format());
  268 |         }
  269 |       }
  270 |     }
  271 |     const body_ = await res.json().catch(() => null);
  272 |     return { status, body: body_ };
  273 |   }
  274 |   /** GenerateOtp */
  275 |   async generateOtp(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  276 |     const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeGenerateUrl(userUuid, featureType, this.serviceConfig);
  277 |     const res = await this.request.post(url, {
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
> 288 |     const res = await this.request.post(url, {
      |                                    ^ Error: apiRequestContext.post: Fixture { request } from beforeAll cannot be reused in a test.
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
  378 |     const res = await this.request.get(url, {
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
```