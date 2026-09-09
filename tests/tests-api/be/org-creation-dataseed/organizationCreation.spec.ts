import { test, expect, request as pwRequest } from "@playwright/test";
import { APIClient } from "../../../../helper/api/APIClient";
import { provisioningData } from "../../../../utils/provisioningData";

let envVariables: Record<string, any> | null = null;

test.beforeAll(() => {
  envVariables = APIClient.getEnvVariables();
});

test("Create an Organization @createOrganization", async ({ request }) => {
  const lisencePools = "BusinessSkills,DigitalSkills";
  // process.env.LICENSE_POOLS as string;
  const lisencePoolsArray = lisencePools.split(",");

  await provisioningData.createOrganization(
    request,
    envVariables!["provisioning"],
    "SiteShudownTest" + Math.floor(Math.random() * 1000 + 1),
  );

  for (const pool of lisencePoolsArray) {
    await provisioningData.createLicensePool(
      request,
      envVariables!["provisioning"],
      pool,
    );
  }

  await provisioningData.createConnection(
    request,
    envVariables!["provisioning"],
  );
  await provisioningData.createPlatformTier(
    request,
    envVariables!["provisioning"],
  );
  await provisioningData.createUser(request, envVariables!["provisioning"]);
});

// Run:
// NODE_ENV=develop npx playwright test --grep @createOrganization -c 'playwright.api.config.ts' --reporter=list --workers 1
