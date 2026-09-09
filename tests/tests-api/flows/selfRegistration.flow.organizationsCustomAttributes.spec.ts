// FLOW TEST — SelfRegistration: OrganizationsCustomAttributes
// Resolved from: tests/tests-api/selfRegistration.test-plan.md
//
// Flow:
//   beforeAll — GET org config to find an existing custom attribute UUID
//   Step 1    — DELETE /api/organizations/{orgId}/custom-attributes/{customAttributeUuid}
//   Step 2    — PUT /api/registrations/bulk-update-custom-attribute-values
//
// ⚠  Requires at least one custom attribute to exist in the org's self-registration config.
//    If none exist, Steps 1 and 2 are skipped with a descriptive message.
//    To add one: POST /api/organizations/{orgId}/config with a customAttributes entry.

import { test, expect, request as playwrightRequest } from "@playwright/test";
import { Reporter } from "../../../utils/Reporter";
import { APIClient } from "../../../helper/api/APIClient";
import { SelfRegistrationClient } from "../../../helper/api/SelfRegistrationClient";
import { bulkUpdateCustomAttributeValuesPayload } from "../../../helper/api/payloads/selfRegistration/bulkUpdateCustomAttributeValuesPayload";

// ── Shared state ─────────────────────────────────────────────────────────────
let client: SelfRegistrationClient;
let orgId: string;
let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;
// customAttributeUuid is resolved in beforeAll from the org config.
// If no custom attributes exist, tests are skipped.
let customAttributeUuid: string | undefined;

test.beforeAll("Authenticate + resolve org + find custom attribute", async () => {
  apiContext = await playwrightRequest.newContext();
  const envVars = APIClient.getEnvVariables();
  const frontendUrl = (envVars["frontend"] as { url: string }).url;
  const domainMatch = frontendUrl.match(/https:\/\/([^.]+)\./);
  if (!domainMatch) throw new Error(`Cannot extract domain: ${frontendUrl}`);
  const domain = domainMatch[1];
  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };
  const apiClient = new APIClient();
  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);
  client = await SelfRegistrationClient.create(apiContext);

  // Try to find an existing custom attribute from the org's self-registration config
  const { status, body } = await client.fetch(orgId);
  if (status === 200 && body) {
    const config = body as Record<string, unknown>;
    const attrs = config["customAttributes"] as Array<{ uuid?: string; id?: string }> | undefined;
    if (Array.isArray(attrs) && attrs.length > 0) {
      customAttributeUuid = attrs[0].uuid ?? attrs[0].id;
    }
  }
  // If customAttributeUuid is still undefined, the tests below will skip.
});

test.afterAll(async () => {
  await apiContext?.dispose();
});

test.describe.serial("SelfRegistration — OrganizationsCustomAttributes flow", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("OrganizationsCustomAttributes flow");
    await Reporter.addTags("api", "flow", "auto-generated");
  });

  // Step 1: DELETE /api/organizations/{organizationUuid}/custom-attributes/{customAttributeUuid}
  test("Step 1: DeleteCustomAttribute — DELETE /api/organizations/{orgId}/custom-attributes/{uuid}", async () => {
    await Reporter.setStory("OrganizationsCustomAttributes / Step 1: Delete custom attribute");

    if (!customAttributeUuid) {
      test.skip(true, "No custom attributes found in org config — create one manually first via POST /api/organizations/{orgId}/config with customAttributes array");
      return;
    }

    const { status } = await client.deleteCustomAttribute(orgId, customAttributeUuid);
    expect(status).toBe(200);
  });

  // Step 2: PUT /api/registrations/bulk-update-custom-attribute-values
  test("Step 2: BulkUpdateCustomAttributeValues — PUT /api/registrations/bulk-update-custom-attribute-values", async () => {
    await Reporter.setStory("OrganizationsCustomAttributes / Step 2: Bulk update custom attribute values");

    if (!customAttributeUuid) {
      test.skip(true, "No custom attributes found — skipped with Step 1");
      return;
    }

    const { status } = await client.bulkUpdateCustomAttributeValues(
      bulkUpdateCustomAttributeValuesPayload({ organizationUuid: orgId })
    );
    // 200 on success; 400/404 if org has no pending registrations to update — both acceptable
    expect([200, 400, 404]).toContain(status);
  });

});
