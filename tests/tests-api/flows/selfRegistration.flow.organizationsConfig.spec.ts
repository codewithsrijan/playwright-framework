// FLOW TEST — SelfRegistration: OrganizationsConfig
// Resolved from: tests/tests-api/selfRegistration.test-plan.md
//
// Flow:
//   Step 1 — GET  /api/organizations/{orgId}/config   (read existing config; 404 = not configured yet)
//   Step 2 — POST /api/organizations/{orgId}/config   (upsert — always returns 200, true upsert)
//
// These two endpoints are ordered because GET informs what fields to round-trip in upsert.
// Step 2 is safe to run even if Step 1 returns 404 (upsert creates the config if absent).

import { test, expect, request as playwrightRequest } from "@playwright/test";
import { Reporter } from "../../../utils/Reporter";
import { APIClient } from "../../../helper/api/APIClient";
import { SelfRegistrationClient } from "../../../helper/api/SelfRegistrationClient";
import { upsertPayload } from "../../../helper/api/payloads/selfRegistration/upsertPayload";

// ── Shared state ─────────────────────────────────────────────────────────────
let client: SelfRegistrationClient;
let orgId: string;
let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;
// Optional: if GET returns existing config, carry requiresUserId into the upsert
let existingRequiresUserId: boolean | undefined;

test.beforeAll("Authenticate + resolve org", async () => {
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
});

test.afterAll(async () => { await apiContext?.dispose(); });

test.describe.serial("SelfRegistration — OrganizationsConfig flow", () => {
  test.beforeEach(async () => {
    await Reporter.setEpic("SelfRegistration");
    await Reporter.setFeature("OrganizationsConfig flow");
    await Reporter.addTags("api", "flow", "auto-generated");
  });

  // Step 1: GET /api/organizations/{organizationUuid}/config
  // May return 404 if self-registration has never been configured for this org — that's fine.
  test("Step 1: Fetch — GET /api/organizations/{organizationUuid}/config", async () => {
    await Reporter.setStory("OrganizationsConfig / Step 1: GET /api/organizations/{organizationUuid}/config");

    const { status, body } = await client.fetch(orgId);
    // 200 = config exists; 404 = not configured yet (both valid)
    expect([200, 404]).toContain(status);

    if (status === 200 && body) {
      const config = body as Record<string, unknown>;
      existingRequiresUserId = config["requiresUserId"] as boolean | undefined;
    }
  });

  // Step 2: POST /api/organizations/{organizationUuid}/config
  // True upsert — always returns 200 regardless of whether config existed.
  test("Step 2: Upsert — POST /api/organizations/{organizationUuid}/config", async () => {
    await Reporter.setStory("OrganizationsConfig / Step 2: POST /api/organizations/{organizationUuid}/config");

    const { status } = await client.upsert(
      orgId,
      upsertPayload({
        // Round-trip the existing value if we got one, otherwise use default
        requiresUserId: existingRequiresUserId ?? false,
      })
    );
    expect(status).toBe(200);
  });

});
