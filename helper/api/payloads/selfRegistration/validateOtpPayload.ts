// AUTO-GENERATED — do not edit manually
// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration
//
// Two exports — one per endpoint:
//   validateOtpPayload  → POST /api/registrations/{registrationUuid}/otp/{code}/validate
//                         (OTP goes in the URL path as {code}, body only needs organizationUuid)
//   validateOTPPayload  → POST /api/users/{userUuid}/otp/{featureType}/validate
//                         (OTP goes in the request body as "otp")

/** Registration-level OTP validation — OTP is the URL path {code} param, NOT in the body */
export function validateOtpPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "organizationUuid": "00000000-0000-0000-0000-000000000000" /* override: pass real orgId */,
    ...overrides,
  };
}

/** User-level OTP validation — OTP goes in the request body as "otp" */
export function validateOTPPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "otp": "" /* ⚠ FLOW DEPENDENCY: inject from Mailhog via overrides — { otp } */,
    "organizationUuid": "00000000-0000-0000-0000-000000000000" /* override: pass real orgId */,
    ...overrides,
  };
}
