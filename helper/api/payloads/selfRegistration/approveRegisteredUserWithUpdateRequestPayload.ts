// AUTO-GENERATED — do not edit manually
// Fields marked "TODO: override" must be replaced with real runtime values.
// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).
// Pass runtime values via the overrides argument:
//   approveRegisteredUserWithUpdateRequestPayload({ organizationId: orgId, courseId })
import { faker } from "@faker-js/faker";

/** ApproveRegisteredUserWithUpdateRequest */
export function approveRegisteredUserWithUpdateRequestPayload(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    "registrationUuid": "00000000-0000-0000-0000-000000000000" /* TODO: override with real registrationUuid */,
    "organizationUuid": "00000000-0000-0000-0000-000000000000" /* override: pass real orgId */,
    "email": faker.internet.email(),
    "firstName": faker.person.firstName(),
    "lastName": faker.person.lastName(),
    "customAttributes": [],
    "externalId": "00000000-0000-0000-0000-000000000000" /* TODO: override with real externalId */,
    "middleInitial": faker.lorem.word(),
    "suffix": faker.lorem.word(),
    "loginName": faker.person.fullName(),
    "roleUuid": "00000000-0000-0000-0000-000000000000" /* TODO: override with real roleUuid */,
    "status": faker.lorem.word(),
    "approvalManager": { "userUuid": "00000000-0000-0000-0000-000000000000" /* TODO: override with real userUuid */ },
    "isInstructor": false,
    "hasCoaching": false,
    "mustResetPassword": false,
    "approvedBy": faker.lorem.word(),
    "directManagerUuid": "00000000-0000-0000-0000-000000000000" /* TODO: override with real directManagerUuid */,
    "jobTitle": faker.lorem.words(3),
    "jobRole": faker.lorem.word(),
    ...overrides,
  };
}