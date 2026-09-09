// AUTO-GENERATED — do not edit manually
// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration
import { z } from "zod";

// ── Component Schemas (from OpenAPI components/schemas) ──────────────────────

export const UuidSchema = z.string();
export type Uuid = z.infer<typeof UuidSchema>;

export const SaveUserRegistrationResponseSchema = z.object({
    "registrationUuid": UuidSchema
  });
export type SaveUserRegistrationResponse = z.infer<typeof SaveUserRegistrationResponseSchema>;

export const UserCustomAttributeSchema = z.object({
    "customAttributeId": z.string(),
    "value": z.string()
  });
export type UserCustomAttribute = z.infer<typeof UserCustomAttributeSchema>;

export const SaveUserRegistrationRequestSchema = z.object({
    "organizationUuid": UuidSchema,
    "email": z.string(),
    "firstName": z.string().optional(),
    "lastName": z.string().optional(),
    "customAttributes": z.array(UserCustomAttributeSchema).optional(),
    "externalUserId": z.string().optional(),
    "formSubmission": z.number().optional(),
    "externalId": z.string().optional()
  });
export type SaveUserRegistrationRequest = z.infer<typeof SaveUserRegistrationRequestSchema>;

export const ValidateOtpResponseSchema = z.object({
    "message": z.string(),
    "registrationUuid": UuidSchema,
    "organizationUuid": UuidSchema.optional()
  });
export type ValidateOtpResponse = z.infer<typeof ValidateOtpResponseSchema>;

export const SaveUserResponseSchema = z.object({
    "userUuid": UuidSchema,
    "organizationUuid": UuidSchema
  });
export type SaveUserResponse = z.infer<typeof SaveUserResponseSchema>;

export const OtpStatusSchema = z.enum(["DISABLE_RESEND_OTP", "OTP_ALREADY_VALIDATED", "ENABLE_RESEND_OTP", "OTP_SENT_SUCCESSFULLY", "MAXIMUM_ATTEMPTS_REACHED"]);
export type OtpStatus = z.infer<typeof OtpStatusSchema>;

export const UserStatusSchema = z.enum(["NEW_SELF_REGISTRATION_USER", "VALIDATE_OTP", "CREATE_PASSWORD", "LINK_HAS_EXPIRED"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserStatusResponseSchema = z.object({
    "email": z.string(),
    "registrationUuid": UuidSchema,
    "userStatus": UserStatusSchema,
    "resendOtpStatus": OtpStatusSchema.optional(),
    "userUuid": UuidSchema.optional(),
    "organizationUuid": UuidSchema
  });
export type UserStatusResponse = z.infer<typeof UserStatusResponseSchema>;

export const PendingRegistrationDetailsResponseSchema = z.object({
    "registrationUuid": UuidSchema,
    "organizationUuid": UuidSchema,
    "email": z.string(),
    "firstName": z.string(),
    "lastName": z.string(),
    "createdDate": z.string().datetime({ offset: true }),
    "customAttributeJson": z.array(UserCustomAttributeSchema),
    "approvedDate": z.string().datetime({ offset: true }),
    "approvedBy": UuidSchema,
    "rejectedDate": z.string().datetime({ offset: true }),
    "rejectedBy": UuidSchema,
    "rejectedReason": z.string(),
    "userUuid": UuidSchema,
    "externalId": z.string()
  });
export type PendingRegistrationDetailsResponse = z.infer<typeof PendingRegistrationDetailsResponseSchema>;

export const PendingRegistrationDetailsRequestSchema = z.object({
    "organizationUuid": UuidSchema,
    "registrationUuids": z.array(UuidSchema).optional()
  });
export type PendingRegistrationDetailsRequest = z.infer<typeof PendingRegistrationDetailsRequestSchema>;

export const UpdateStatusSchema = z.enum(["UPDATED_REJECTED_REGISTRATIONS_SUCCESSFULLY", "NO_REGISTRATIONS_FOR_REJECTION", "NO_REGISTRATIONS_FOR_APPROVAL", "APPROVED_REGISTRATIONS_SUCCESSFULLY_UPDATED"]);
export type UpdateStatus = z.infer<typeof UpdateStatusSchema>;

export const ApproveRequestSchema = z.object({
    "organizationUuid": UuidSchema,
    "registrationUuids": z.array(UuidSchema),
    "approvedBy": UuidSchema
  });
export type ApproveRequest = z.infer<typeof ApproveRequestSchema>;

export const ApproveRegisteredUserWithUpdateRequestSchema = z.object({
    "registrationUuid": UuidSchema,
    "organizationUuid": UuidSchema,
    "email": z.string(),
    "firstName": z.string().optional(),
    "lastName": z.string().optional(),
    "customAttributes": z.array(UserCustomAttributeSchema).optional(),
    "externalId": z.string().optional(),
    "middleInitial": z.string().optional().nullable(),
    "suffix": z.string().optional().nullable(),
    "loginName": z.string().optional().nullable(),
    "roleUuid": UuidSchema.optional().nullable(),
    "status": z.string().optional().nullable(),
    "approvalManager": z.object({
    "userUuid": UuidSchema
  }).optional().nullable(),
    "isInstructor": z.boolean().optional().nullable(),
    "hasCoaching": z.boolean().optional().nullable(),
    "mustResetPassword": z.boolean().optional().nullable(),
    "approvedBy": UuidSchema,
    "directManagerUuid": UuidSchema.optional().nullable(),
    "jobTitle": z.string().optional().nullable(),
    "jobRole": z.string().optional().nullable()
  });
export type ApproveRegisteredUserWithUpdateRequest = z.infer<typeof ApproveRegisteredUserWithUpdateRequestSchema>;

export const RejectRequestSchema = z.object({
    "organizationUuid": UuidSchema,
    "registrationUuids": z.array(UuidSchema),
    "rejectedBy": UuidSchema,
    "rejectReason": z.string()
  });
export type RejectRequest = z.infer<typeof RejectRequestSchema>;

export const BulkUpdateCustomAttributeValuesResponseSchema = z.object({
    "updatedCount": z.number()
  });
export type BulkUpdateCustomAttributeValuesResponse = z.infer<typeof BulkUpdateCustomAttributeValuesResponseSchema>;

export const BulkUpdateCustomAttributeValuesRequestSchema = z.object({
    "organizationUuid": UuidSchema,
    "customAttributeUuid": UuidSchema,
    "oldValue": z.string().nullable(),
    "updatedValue": z.string().nullable()
  });
export type BulkUpdateCustomAttributeValuesRequest = z.infer<typeof BulkUpdateCustomAttributeValuesRequestSchema>;

export const ResultsShutdownSchema = z.object({
    "tablename": z.string(),
    "operation": z.enum(["OBFUSCATED", "DELETED"])
  });
export type ResultsShutdown = z.infer<typeof ResultsShutdownSchema>;

export const SiteShutdownResponseSchema = z.object({
    "requestId": z.string(),
    "service": z.string(),
    "action": z.enum(["DEACTIVATION", "REACTIVATION", "SHUTDOWN"]),
    "status": z.enum(["IN_PROGRESS", "COMPLETED", "FAILED"]),
    "results": z.array(ResultsShutdownSchema)
  });
export type SiteShutdownResponse = z.infer<typeof SiteShutdownResponseSchema>;

export const FeatureTypeSchema = z.enum(["SELF-REG", "LLL", "GK", "MFA", "QR-CODE"]);
export type FeatureType = z.infer<typeof FeatureTypeSchema>;

export const ReferenceTypeSchema = z.enum(["USER", "NEW_USER"]);
export type ReferenceType = z.infer<typeof ReferenceTypeSchema>;

export const OtpGenerationRequestSchema = z.object({
    "referenceType": ReferenceTypeSchema,
    "organizationUuid": UuidSchema,
    "email": z.string(),
    "firstName": z.string(),
    "lastName": z.string(),
    "language": z.string()
  });
export type OtpGenerationRequest = z.infer<typeof OtpGenerationRequestSchema>;

export const OtpValidationRequestSchema = z.object({
    "otp": z.number(),
    "organizationUuid": UuidSchema
  });
export type OtpValidationRequest = z.infer<typeof OtpValidationRequestSchema>;

export const VerifyEmailResponseSchema = z.object({
    "emailHash": z.string(),
    "verifiedTime": z.string().datetime({ offset: true }).nullable()
  });
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

export const VerifyEmailRequestSchema = z.object({
    "email": z.string(),
    "referenceType": ReferenceTypeSchema
  });
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;

export const UpsertOrganizationConfigResponseSchema = z.object({
    "organizationUuid": z.string()
  });
export type UpsertOrganizationConfigResponse = z.infer<typeof UpsertOrganizationConfigResponseSchema>;

export const UpsertOrganizationConfigRequestSchema = z.object({
    "allowedDomains": z.array(z.string()),
    "customMessage": z.array(z.object({
    "langCode": z.string(),
    "msg": z.string()
  })).optional().nullable(),
    "requiresContactSupport": z.boolean().optional().nullable(),
    "requiresAdminApproval": z.boolean().optional(),
    "displaySelfRegistrationLink": z.boolean().optional(),
    "notifyAdmin": z.boolean().optional(),
    "requiresFirstName": z.boolean(),
    "requiresLastName": z.boolean(),
    "customAttributes": z.array(z.object({
    "validationCode": z.string().optional().nullable(),
    "required": z.boolean().optional().nullable(),
    "customAttributeUuid": z.string()
  })).optional().nullable(),
    "requiresUserId": z.boolean().optional().nullable(),
    "displayUserIdField": z.boolean().optional().nullable()
  });
export type UpsertOrganizationConfigRequest = z.infer<typeof UpsertOrganizationConfigRequestSchema>;

export const GetOrganizationConfigResponseSchema = z.object({
    "organizationUuid": z.string(),
    "allowedDomains": z.array(z.string()),
    "customMessage": z.array(z.object({
    "langCode": z.string(),
    "msg": z.string()
  })).nullable(),
    "requiresContactSupport": z.boolean(),
    "requiresAdminApproval": z.boolean().nullable(),
    "displaySelfRegistrationLink": z.boolean().nullable(),
    "notifyAdmin": z.boolean().nullable(),
    "customAttributes": z.array(z.object({
    "displayOrder": z.number().optional().nullable(),
    "validationCode": z.string().optional().nullable(),
    "required": z.boolean().optional().nullable(),
    "customAttributeUuid": z.string()
  })),
    "requiresFirstName": z.boolean(),
    "requiresLastName": z.boolean(),
    "requiresUserId": z.boolean().optional().nullable(),
    "displayUserIdField": z.boolean().optional().nullable()
  });
export type GetOrganizationConfigResponse = z.infer<typeof GetOrganizationConfigResponseSchema>;

export const DeleteCustomAttributeSchema = z.object({
    "customAttributeUuid": z.string()
  });
export type DeleteCustomAttribute = z.infer<typeof DeleteCustomAttributeSchema>;

export const HealthCheckResponseSchema = z.object({
    "summary": z.enum(["OK", "NOT_OK"])
  }).passthrough();
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

export const AllHealthCheckResponseSchema = z.object({
    "summary": z.enum(["OK", "NOT_OK"]),
    "local": HealthCheckResponseSchema,
    "remote": HealthCheckResponseSchema
  });
export type AllHealthCheckResponse = z.infer<typeof AllHealthCheckResponseSchema>;

export const BuildVersionSchema = z.object({
    "commit": z.string().optional(),
    "branch": z.string().optional(),
    "image": z.string().optional(),
    "buildDate": z.string().optional(),
    "buildnumber": z.string()
  });
export type BuildVersion = z.infer<typeof BuildVersionSchema>;

export const BuildSchema = z.object({
    "build": BuildVersionSchema
  });
export type Build = z.infer<typeof BuildSchema>;

export const AuditSchema = z.object({
    "seq": z.number(),
    "auditId": z.string(),
    "ts": z.string(),
    "mesg": z.string()
  });
export type Audit = z.infer<typeof AuditSchema>;

// ── Inline Response Schemas (per operation) ─────────────────────────────────

export const InsertResponseSchema = SaveUserRegistrationResponseSchema;
export type InsertResponse = z.infer<typeof InsertResponseSchema>;

export const ResendOtpResponseSchema = OtpStatusSchema;
export type ResendOtpResponse = z.infer<typeof ResendOtpResponseSchema>;

export const FetchUserStatusResponseSchema = UserStatusResponseSchema;
export type FetchUserStatusResponse = z.infer<typeof FetchUserStatusResponseSchema>;

export const SendOtpEmailResponseSchema = z.union([OtpStatusSchema, z.object({
    "status": z.string()
  })]);
export type SendOtpEmailResponse = z.infer<typeof SendOtpEmailResponseSchema>;

export const FetchRegisteredUsersforapprovalResponseSchema = z.array(PendingRegistrationDetailsResponseSchema);
export type FetchRegisteredUsersforapprovalResponse = z.infer<typeof FetchRegisteredUsersforapprovalResponseSchema>;

export const ApprovePendingRegisteredUsersResponseSchema = UpdateStatusSchema;
export type ApprovePendingRegisteredUsersResponse = z.infer<typeof ApprovePendingRegisteredUsersResponseSchema>;

export const ApproveRegisteredUserWithUpdateRequestResponseSchema = UpdateStatusSchema;
export type ApproveRegisteredUserWithUpdateRequestResponse = z.infer<typeof ApproveRegisteredUserWithUpdateRequestResponseSchema>;

export const RejectUserRegistrationResponseSchema = UpdateStatusSchema;
export type RejectUserRegistrationResponse = z.infer<typeof RejectUserRegistrationResponseSchema>;

export const ShutdownSelfRegistrationResponseSchema = SiteShutdownResponseSchema;
export type ShutdownSelfRegistrationResponse = z.infer<typeof ShutdownSelfRegistrationResponseSchema>;

export const UpsertResponseSchema = UpsertOrganizationConfigResponseSchema;
export type UpsertResponse = z.infer<typeof UpsertResponseSchema>;

export const FetchResponseSchema = GetOrganizationConfigResponseSchema;
export type FetchResponse = z.infer<typeof FetchResponseSchema>;

export const DeleteCustomAttributeResponseSchema = DeleteCustomAttributeSchema;
export type DeleteCustomAttributeResponse = z.infer<typeof DeleteCustomAttributeResponseSchema>;

export const PingResponseSchema = HealthCheckResponseSchema;
export type PingResponse = z.infer<typeof PingResponseSchema>;

export const LocalHealthResponseSchema = HealthCheckResponseSchema;
export type LocalHealthResponse = z.infer<typeof LocalHealthResponseSchema>;

export const RemoteHealthResponseSchema = HealthCheckResponseSchema;
export type RemoteHealthResponse = z.infer<typeof RemoteHealthResponseSchema>;

export const LocalAndRemoteHealthResponseSchema = AllHealthCheckResponseSchema;
export type LocalAndRemoteHealthResponse = z.infer<typeof LocalAndRemoteHealthResponseSchema>;

export const BasicAuthHealthResponseSchema = HealthCheckResponseSchema;
export type BasicAuthHealthResponse = z.infer<typeof BasicAuthHealthResponseSchema>;

export const GetBuildVersionResponseSchema = BuildSchema;
export type GetBuildVersionResponse = z.infer<typeof GetBuildVersionResponseSchema>;

export const FetchEntriesResponseSchema = z.array(AuditSchema);
export type FetchEntriesResponse = z.infer<typeof FetchEntriesResponseSchema>;