// AUTO-GENERATED — do not edit manually
// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).
// Pass runtime values via the overrides argument:
//   generateOtpPayload({ organizationId: orgId, courseId })
import { faker } from "@faker-js/faker";

/** GenerateOtp */
export function generateOtpPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "referenceType": "USER",
    "organizationUuid": "00000000-0000-0000-0000-000000000000" /* override: pass real orgId */,
    "email": faker.internet.email(),
    "firstName": faker.person.firstName(),
    "lastName": faker.person.lastName(),
    "language": "en-US",
    ...overrides,
  };
}