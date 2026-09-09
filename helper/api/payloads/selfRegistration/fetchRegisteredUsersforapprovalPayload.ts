// AUTO-GENERATED — do not edit manually
// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).
// Pass runtime values via the overrides argument:
//   fetchRegisteredUsersforapprovalPayload({ organizationId: orgId, courseId })
import { faker } from "@faker-js/faker";

/** FetchRegisteredUsersforapproval */
export function fetchRegisteredUsersforapprovalPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "organizationUuid": "00000000-0000-0000-0000-000000000000" /* override: pass real orgId */,
    "registrationUuids": [],
    ...overrides,
  };
}