# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: selfRegistration.spec.ts >> SelfRegistration — registration >> BulkUpdateCustomAttributeValues — 200  happy path
- Location: tests/tests-api/selfRegistration.spec.ts:349:7

# Error details

```
Error: apiRequestContext.put: Fixture { request } from beforeAll cannot be reused in a test.
  - Recommended fix: use a separate { request } in the test.
  - Alternatively, manually create APIRequestContext in beforeAll and dispose it in afterAll.
See https://playwright.dev/docs/api-testing#sending-api-requests-from-ui-tests for more details.
```

# Test source

```ts
  137 |     const res = await this.request.post(url, {
  138 |       headers: this.headers,
  139 |       data: body,
  140 |     });
  141 |     const status = res.status();
  142 |     if (status >= 200 && status < 300) {
  143 |       const json = await res.json().catch(() => null);
  144 |       if (json !== null) {
  145 |         const parsed = SendOtpEmailResponseSchema.safeParse(json);
  146 |         if (!parsed.success) {
  147 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/send-otp-email:`, parsed.error.format());
  148 |         }
  149 |       }
  150 |     }
  151 |     const body_ = await res.json().catch(() => null);
  152 |     return { status, body: body_ };
  153 |   }
  154 |   /** FetchRegisteredUsersforapproval */
  155 |   async fetchRegisteredUsersforapproval(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  156 |     const url = selfRegistrationUrls.postApiRegistrationsFetchRegisteredUsersForApprovalUrl(this.serviceConfig);
  157 |     const res = await this.request.post(url, {
  158 |       headers: this.headers,
  159 |       data: body,
  160 |     });
  161 |     const status = res.status();
  162 |     if (status >= 200 && status < 300) {
  163 |       const json = await res.json().catch(() => null);
  164 |       if (json !== null) {
  165 |         const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(json);
  166 |         if (!parsed.success) {
  167 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/fetch-registered-users-for-approval:`, parsed.error.format());
  168 |         }
  169 |       }
  170 |     }
  171 |     const body_ = await res.json().catch(() => null);
  172 |     return { status, body: body_ };
  173 |   }
  174 |   /** ApprovePendingRegisteredUsers */
  175 |   async approvePendingRegisteredUsers(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  176 |     const url = selfRegistrationUrls.putApiRegistrationsApprovePendingRegisteredUsersUrl(this.serviceConfig);
  177 |     const res = await this.request.put(url, {
  178 |       headers: this.headers,
  179 |       data: body,
  180 |     });
  181 |     const status = res.status();
  182 |     if (status >= 200 && status < 300) {
  183 |       const json = await res.json().catch(() => null);
  184 |       if (json !== null) {
  185 |         const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(json);
  186 |         if (!parsed.success) {
  187 |           console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/approve-pending-registered-users:`, parsed.error.format());
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
> 237 |     const res = await this.request.put(url, {
      |                                    ^ Error: apiRequestContext.put: Fixture { request } from beforeAll cannot be reused in a test.
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
```