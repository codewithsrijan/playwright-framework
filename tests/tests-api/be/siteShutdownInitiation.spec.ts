import { test, expect } from "@playwright/test";
import { APIClient } from "../../../helper/api/APIClient";
import { headerData } from "../../../helper/api/headers/headers";
import { urlData } from "../../../helper/api/urls";
import { logger } from "../../../utils/logger";
import { commonFunctions } from "../../../utils/commonfuctions";
import { dateUtils } from "../../../utils/dates";
import orgDataStage from "../../../utils/orgDataStage.json";
import orgDataDev from "../../../utils/orgDataDev.json";
import { provisioningData } from "../../../utils/provisioningData";
import { updateOrganizationDetailsPayLoad } from "../../../helper/api/payloads/updateOrganizationDetailsPayLoad";

let organizationUuid: string | null = null;
let envVariables: any = null;
let orgV2_serviceConfig: any = null;
let provisioning_serviceConfig: any = null;
let siteShutdown_serviceConfig: any = null;
let apiClientInstance: APIClient | null = null;
let domain: string | null = null;
let url: string | null = null;

test.beforeAll(() => {
  envVariables = APIClient.getEnvVariables();
  apiClientInstance = new APIClient();
  orgV2_serviceConfig = envVariables["organizations-api"];
  provisioning_serviceConfig = envVariables["provisioning"];
  siteShutdown_serviceConfig = envVariables["site-shutdown-v2"];
  url = urlData.createOrganizationUrl(provisioning_serviceConfig);
});

test("Get License Pools by Org ID @getLicensePools", async ({ request }) => {
  const updateOrgDetailsResponse = await updateOrgDetails({
    request,
    serviceName: "ucm2",
    status: "completed",
  });
  organizationUuid = updateOrgDetailsResponse.organizationUuid;
  logger.info("Organization UUID: " + organizationUuid);
  const licensePoolsData = await provisioningData.getLicensePoolsByOrgId(
    request,
    provisioning_serviceConfig,
    organizationUuid,
  );
  logger.info(JSON.stringify(licensePoolsData));

  licensePoolsData.forEach((item: any) => {
    if (item.orgId) {
      expect(item.orgId).toBe(organizationUuid);
    }
  });
});

test("Update expiry date for each license pool in an Org @expireLicensePools", async ({
  request,
}) => {
  const updateOrgDetailsResponse = await updateOrgDetails({
    request,
    serviceName: "ucm2",
    status: "completed",
  });
  organizationUuid = updateOrgDetailsResponse.organizationUuid;
  logger.info("Organization UUID: " + organizationUuid);
  await provisioningData.updateEndDateToAllLicensePools(
    request,
    provisioning_serviceConfig,
    organizationUuid,
  );

  logger.info("License pool updations completed");

  const licensePoolsData = await provisioningData.getLicensePoolsByOrgId(
    request,
    provisioning_serviceConfig,
    organizationUuid,
  );
  licensePoolsData.forEach((item: any) => {
    if (item.lineEndDate) {
      const actual = item.lineEndDate;
      const expected = dateUtils.convertISODateToShortDate(
        dateUtils.pastDate(1),
      );
      expect(actual).toContain(expected);
    }
  });
});

test("Initiate site deactivation process @deactivateOrganization", async ({
  request,
}) => {
  if ((url || "").includes("stage")) {
    organizationUuid = orgDataStage.orgId;
  } else {
    organizationUuid = orgDataDev.orgId;
  }
  domain = await (apiClientInstance as APIClient).getDomainByOrgId(
    request,
    organizationUuid as string,
    orgV2_serviceConfig,
  );
  const response = await request.post(
    urlData.siteShutdownRequestUrl(siteShutdown_serviceConfig),
    {
      data: {
        orgRequests: [
          {
            organizationUuid: organizationUuid,
            organizationDomain: (domain as string).toString(),
            ticketId: await commonFunctions.generateRandomId(5),
            actionType: "deactivation",
          },
        ],
      },
      headers: headerData.basicAuth(siteShutdown_serviceConfig),
    },
  );

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  expect(JSON.stringify(await response.json())).toContain(
    "Request submitted successfully",
  );
});

test("Initiate site shutdown process @shutdownOrganization", async ({
  request,
}) => {
  if ((url || "").includes("stage")) {
    organizationUuid = orgDataStage.orgId;
  } else {
    organizationUuid = orgDataDev.orgId;
  }
  logger.info("Organization UUID: " + organizationUuid);
  domain = await (apiClientInstance as APIClient).getDomainByOrgId(
    request,
    organizationUuid as string,
    orgV2_serviceConfig,
  );
  const response = await request.post(
    urlData.siteShutdownRequestUrl(siteShutdown_serviceConfig),
    {
      data: {
        orgRequests: [
          {
            organizationUuid: organizationUuid,
            organizationDomain: (domain as string).toString(),
            ticketId: await commonFunctions.generateRandomId(5),
            actionType: "shutdown",
          },
        ],
      },
      headers: headerData.basicAuth(siteShutdown_serviceConfig),
    },
  );

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  expect(JSON.stringify(await response.json())).toContain(
    "Request submitted successfully",
  );
});

test("Get site shutdown config @getsiteShutdownConfig", async ({ request }) => {
  const response = await request.get(
    urlData.siteShutdownConfigUrl(siteShutdown_serviceConfig),
    {
      headers: headerData.basicAuth(siteShutdown_serviceConfig),
    },
  );

  const data = await response.json();
  logger.info(JSON.stringify(data));
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
});

const updateOrgDetails = async ({
  request,
  serviceName,
  status,
}: {
  request: any;
  serviceName: string;
  status: string;
}) => {
  const updateOrgDetailsPayLoadBody = updateOrganizationDetailsPayLoad(
    "",
    "",
    serviceName,
    status,
  );
  const response = await request.post(
    urlData.updateOrganizationDetailsUrl(siteShutdown_serviceConfig),
    {
      headers: headerData.basicAuth(siteShutdown_serviceConfig),
      data: updateOrgDetailsPayLoadBody,
    },
  );
  if (!response.ok()) {
    const body = await response.text();
    logger.error(
      `updateOrganizationDetails failed with ${response.status()}: ${body}`,
    );
  }
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  return {
    organizationUuid: (await response.text()).replace(/"/g, ""),
  };
};
