// AUTO-GENERATED — do not edit manually
// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).
// Pass runtime values via the overrides argument:
//   verifyEmailPayload({ organizationId: orgId, courseId })
import { faker } from "@faker-js/faker";

/** VerifyEmail */
export function verifyEmailPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "email": faker.internet.email(),
    "referenceType": "USER",
    ...overrides,
  };
}