// AUTO-GENERATED — do not edit manually
// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration
import type { APIRequestContext } from "@playwright/test";
import { APIClient } from "./APIClient";
import { headerData } from "./headers/headers";
import { selfRegistrationUrls } from "./urls.selfRegistration";
import { InsertResponseSchema, ValidateOtpResponseSchema, SaveUserResponseSchema, ResendOtpResponseSchema, FetchUserStatusResponseSchema, SendOtpEmailResponseSchema, FetchRegisteredUsersforapprovalResponseSchema, ApprovePendingRegisteredUsersResponseSchema, ApproveRegisteredUserWithUpdateRequestResponseSchema, RejectUserRegistrationResponseSchema, BulkUpdateCustomAttributeValuesResponseSchema, VerifyEmailResponseSchema, FetchResponseSchema, UpsertResponseSchema, DeleteCustomAttributeResponseSchema, PingResponseSchema, LocalHealthResponseSchema, RemoteHealthResponseSchema, LocalAndRemoteHealthResponseSchema, BasicAuthHealthResponseSchema, GetBuildVersionResponseSchema, FetchEntriesResponseSchema } from "./schemas/selfRegistration.schemas";

export class SelfRegistrationClient {
  private readonly request: APIRequestContext;
  private readonly serviceConfig: { url: string; [k: string]: unknown };
  private readonly headers: Record<string, string>;

  private constructor(
    request: APIRequestContext,
    serviceConfig: { url: string; [k: string]: unknown },
    token: string,
  ) {
    this.request = request;
    this.serviceConfig = serviceConfig;
    // selfRegistration uses Basic auth — token is pre-encoded base64 credentials from develop.json
    this.headers = headerData.basicAuth({ token });
  }

  /** Factory — reads develop.json, returns a ready client using the pre-encoded Basic auth token */
  static async create(request: APIRequestContext): Promise<SelfRegistrationClient> {
    const envVars = APIClient.getEnvVariables();
    const serviceConfig = envVars["selfRegistration"] as { url: string; token: string };
    const token = serviceConfig.token;
    if (!token) throw new Error("No auth token configured for selfRegistration in develop.json");
    return new SelfRegistrationClient(request, serviceConfig, token);
  }

  /** Insert */
  async insert(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsUrl(this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = InsertResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** ValidateOtp */
  async validateOtp(registrationUuid: string, code: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidOtpBycodeValidateUrl(registrationUuid, code, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = ValidateOtpResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/otp/{code}/validate:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** SaveUser */
  async saveUser(registrationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidSaveUserUrl(registrationUuid, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = SaveUserResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/save-user:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** ResendOtp */
  async resendOtp(registrationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidOtpResendUrl(registrationUuid, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = ResendOtpResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/otp/resend:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** FetchUserStatus */
  async fetchUserStatus(registrationUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiRegistrationsByregistrationUuidFetchUserStatusUrl(registrationUuid, this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = FetchUserStatusResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/registrations/{registrationUuid}/fetch-user-status:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** SendOtpEmail */
  async sendOtpEmail(registrationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsByregistrationUuidSendOtpEmailUrl(registrationUuid, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = SendOtpEmailResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/{registrationUuid}/send-otp-email:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** FetchRegisteredUsersforapproval */
  async fetchRegisteredUsersforapproval(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiRegistrationsFetchRegisteredUsersForApprovalUrl(this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = FetchRegisteredUsersforapprovalResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/registrations/fetch-registered-users-for-approval:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** ApprovePendingRegisteredUsers */
  async approvePendingRegisteredUsers(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.putApiRegistrationsApprovePendingRegisteredUsersUrl(this.serviceConfig);
    const res = await this.request.put(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = ApprovePendingRegisteredUsersResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/approve-pending-registered-users:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** ApproveRegisteredUserWithUpdateRequest */
  async approveRegisteredUserWithUpdateRequest(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.putApiRegistrationsApproveRegisteredUserWithUpdateUrl(this.serviceConfig);
    const res = await this.request.put(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = ApproveRegisteredUserWithUpdateRequestResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/approve-registered-user-with-update:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** RejectUserRegistration */
  async rejectUserRegistration(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.putApiRegistrationsRejectPendingRegistrationUsersUrl(this.serviceConfig);
    const res = await this.request.put(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = RejectUserRegistrationResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/reject-pending-registration-users:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** BulkUpdateCustomAttributeValues */
  async bulkUpdateCustomAttributeValues(body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.putApiRegistrationsBulkUpdateCustomAttributeValuesUrl(this.serviceConfig);
    const res = await this.request.put(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = BulkUpdateCustomAttributeValuesResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on PUT /api/registrations/bulk-update-custom-attribute-values:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** GenerateOtp */
  async generateOtp(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeGenerateUrl(userUuid, featureType, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** ValidateOTP */
  async validateOTP(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeValidateUrl(userUuid, featureType, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** VerifyEmail */
  async verifyEmail(userUuid: string, featureType: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiUsersByuserUuidOtpByfeatureTypeVerifyEmailUrl(userUuid, featureType, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = VerifyEmailResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/users/{userUuid}/otp/{featureType}/verify-email:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** Fetch */
  async fetch(organizationUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiOrganizationsByorganizationUuidConfigUrl(organizationUuid, this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = FetchResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/organizations/{organizationUuid}/config:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** Upsert */
  async upsert(organizationUuid: string, body: Record<string, unknown> = {}, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.postApiOrganizationsByorganizationUuidConfigUrl(organizationUuid, this.serviceConfig);
    const res = await this.request.post(url, {
      headers: this.headers,
      data: body,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = UpsertResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on POST /api/organizations/{organizationUuid}/config:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** Delete custom attribute for an organization. */
  async deleteCustomAttribute(organizationUuid: string, customAttributeUuid: string, queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.deleteApiOrganizationsByorganizationUuidCustomAttributesBycustomAttributeUuidUrl(organizationUuid, customAttributeUuid, this.serviceConfig);
    const res = await this.request.delete(url, {
      headers: this.headers,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = DeleteCustomAttributeResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on DELETE /api/organizations/{organizationUuid}/custom-attributes/{customAttributeUuid}:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** Ping */
  async ping(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiPublicHealthV1PingUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = PingResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/public/health/v1/ping:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** LocalHealth */
  async localHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiHealthV1LocalUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = LocalHealthResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/local:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** RemoteHealth */
  async remoteHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiHealthV1RemoteUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = RemoteHealthResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/remote:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** LocalAndRemoteHealth */
  async localAndRemoteHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiHealthV1AllUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = LocalAndRemoteHealthResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/all:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** BasicAuthHealth */
  async basicAuthHealth(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiHealthV1AuthBasicUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = BasicAuthHealthResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/health/v1/auth/basic:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** GetBuildVersion */
  async getBuildVersion(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiPublicBuildVersionUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = GetBuildVersionResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/public/build_version:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
  /** FetchEntries */
  async fetchEntries(queryParams?: Record<string, string>): Promise<{ status: number; body: unknown }> {
    const url = selfRegistrationUrls.getApiAuditMesgsUrl(this.serviceConfig);
    const res = await this.request.get(url, {
      headers: this.headers,
      params: queryParams,
    });
    const status = res.status();
    if (status >= 200 && status < 300) {
      const json = await res.json().catch(() => null);
      if (json !== null) {
        const parsed = FetchEntriesResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.warn(`[SelfRegistrationClient] Contract mismatch on GET /api/audit-mesgs:`, parsed.error.format());
        }
      }
    }
    const body_ = await res.json().catch(() => null);
    return { status, body: body_ };
  }
}