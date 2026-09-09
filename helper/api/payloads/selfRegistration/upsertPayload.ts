// AUTO-GENERATED — do not edit manually
// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).
// Pass runtime values via the overrides argument:
//   upsertPayload({ organizationId: orgId, courseId })
import { faker } from "@faker-js/faker";

/** Upsert */
export function upsertPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "allowedDomains": [],
    "customMessage": [],
    "requiresContactSupport": false,
    "requiresAdminApproval": false,
    "displaySelfRegistrationLink": false,
    "notifyAdmin": false,
    "requiresFirstName": false,
    "requiresLastName": false,
    "customAttributes": [],
    "requiresUserId": false,
    "displayUserIdField": false,
    ...overrides,
  };
}