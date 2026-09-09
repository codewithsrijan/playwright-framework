# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/selfRegistration.flow.apiRegistrations.spec.ts >> SelfRegistration — ApiRegistrations flow >> Step 1: Insert — POST /api/registrations
- Location: tests/tests-api/flows/selfRegistration.flow.apiRegistrations.spec.ts:68:7

# Error details

```
Error: Failed to generate auth token
```

# Test source

```ts
  1   | // AUTO-GENERATED — do not edit manually
  2   | // Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration
  3   | import type { APIRequestContext } from "@playwright/test";
  4   | import { APIClient } from "./APIClient";
  5   | import { headerData } from "./headers/headers";
  6   | import { selfRegistrationUrls } from "./urls.selfRegistration";
  7   | import { InsertResponseSchema, ValidateOtpResponseSchema, SaveUserResponseSchema, ResendOtpResponseSchema, FetchUserStatusResponseSchema, SendOtpEmailResponseSchema, FetchRegisteredUsersforapprovalResponseSchema, ApprovePendingRegisteredUsersResponseSchema, ApproveRegisteredUserWithUpdateRequestResponseSchema, RejectUserRegistrationResponseSchema, BulkUpdateCustomAttributeValuesResponseSchema, VerifyEmailResponseSchema, FetchResponseSchema, UpsertResponseSchema, DeleteCustomAttributeResponseSchema, PingResponseSchema, LocalHealthResponseSchema, RemoteHealthResponseSchema, LocalAndRemoteHealthResponseSchema, BasicAuthHealthResponseSchema, GetBuildVersionResponseSchema, FetchEntriesResponseSchema } from "./schemas/selfRegistration.schemas";
  8   | 
  9   | export class SelfRegistrationClient {
  10  |   private readonly request: APIRequestContext;
  11  |   private readonly serviceConfig: { url: string; [k: string]: unknown };
  12  |   private readonly headers: Record<string, string>;
  13  | 
  14  |   private constructor(
  15  |     request: APIRequestContext,
  16  |     serviceConfig: { url: string; [k: string]: unknown },
  17  |     token: string,
  18  |   ) {
  19  |     this.request = request;
  20  |     this.serviceConfig = serviceConfig;
  21  |     this.headers = headerData.commonHeaderWithToken(token);
  22  |   }
  23  | 
  24  |   /** Factory — reads develop.json, generates auth token, returns ready client */
  25  |   static async create(request: APIRequestContext): Promise<SelfRegistrationClient> {
  26  |     const envVars = APIClient.getEnvVariables();
  27  |     const serviceConfig = envVars["selfRegistration"] as { url: string; basicUser: string; basicPassword: string };
  28  |     const apiClient = new APIClient();
  29  |     const token = await apiClient.generateToken(request, serviceConfig);
> 30  |     if (!token) throw new Error("Failed to generate auth token");
      |                       ^ Error: Failed to generate auth token
  31  |     return new SelfRegistrationClient(request, serviceConfig, token);
  32  |   }
  33  | 
  34  |   /** Insert */
  35  |   async insert(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  36  |     const url = selfRegistrationUrls.postApiRegistrationsUrl(this.serviceConfig);
  37  |     const res = await this.request.post(url, {
  38  |       headers: this.headers,
  39  |       data: body,
  40  |     });
  41  |     const status = res.status();
  42  |     if (status >= 200 && status < 300) {
  43  |       const json = await res.json().catch(() => null);
  44  |       if (json !== null) {
  45  |         const parsed = InsertResponseSchema.safeParse(json);
  46  |         if (!parsed.success) {
  47  |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations:`, parsed.error.format());
  48  |         }
  49  |       }
  50  |     }
  51  |     const body_ = await res.json().catch(() => null);
  52  |     return { status, body: body_ };
  53  |   }
  54  |   /** ValidateOtp */
  55  |   async validateOtp(registrationUuid: string, code: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  56  |     const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidOtpBycodeValidateUrl(registrationUuid, code, this.serviceConfig);
  57  |     const res = await this.request.post(url, {
  58  |       headers: this.headers,
  59  |       data: body,
  60  |     });
  61  |     const status = res.status();
  62  |     if (status >= 200 && status < 300) {
  63  |       const json = await res.json().catch(() => null);
  64  |       if (json !== null) {
  65  |         const parsed = ValidateOtpResponseSchema.safeParse(json);
  66  |         if (!parsed.success) {
  67  |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/otp/{code}/validate:`, parsed.error.format());
  68  |         }
  69  |       }
  70  |     }
  71  |     const body_ = await res.json().catch(() => null);
  72  |     return { status, body: body_ };
  73  |   }
  74  |   /** SaveUser */
  75  |   async saveUser(registrationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  76  |     const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidSaveUserUrl(registrationUuid, this.serviceConfig);
  77  |     const res = await this.request.post(url, {
  78  |       headers: this.headers,
  79  |       data: body,
  80  |     });
  81  |     const status = res.status();
  82  |     if (status >= 200 && status < 300) {
  83  |       const json = await res.json().catch(() => null);
  84  |       if (json !== null) {
  85  |         const parsed = SaveUserResponseSchema.safeParse(json);
  86  |         if (!parsed.success) {
  87  |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/save-user:`, parsed.error.format());
  88  |         }
  89  |       }
  90  |     }
  91  |     const body_ = await res.json().catch(() => null);
  92  |     return { status, body: body_ };
  93  |   }
  94  |   /** ResendOtp */
  95  |   async resendOtp(registrationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  96  |     const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidOtpResendUrl(registrationUuid, this.serviceConfig);
  97  |     const res = await this.request.post(url, {
  98  |       headers: this.headers,
  99  |       data: body,
  100 |     });
  101 |     const status = res.status();
  102 |     if (status >= 200 && status < 300) {
  103 |       const json = await res.json().catch(() => null);
  104 |       if (json !== null) {
  105 |         const parsed = ResendOtpResponseSchema.safeParse(json);
  106 |         if (!parsed.success) {
  107 |           console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/otp/resend:`, parsed.error.format());
  108 |         }
  109 |       }
  110 |     }
  111 |     const body_ = await res.json().catch(() => null);
  112 |     return { status, body: body_ };
  113 |   }
  114 |   /** FetchUserStatus */
  115 |   async fetchUserStatus(registrationUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
  116 |     const url = selfRegistrationUrls.getApiRegistrationsByregistrationUuidFetchUserStatusUrl(registrationUuid, this.serviceConfig);
  117 |     const res = await this.request.get(url, {
  118 |       headers: this.headers,
  119 |       params: queryParams,
  120 |     });
  121 |     const status = res.status();
  122 |     if (status >= 200 && status < 300) {
  123 |       const json = await res.json().catch(() => null);
  124 |       if (json !== null) {
  125 |         const parsed = FetchUserStatusResponseSchema.safeParse(json);
  126 |         if (!parsed.success) {
  127 |           console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/registrations/{registrationUuid}/fetch-user-status:`, parsed.error.format());
  128 |         }
  129 |       }
  130 |     }
```