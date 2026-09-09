import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { urlData } from "../helper/api/urls";
import { headerData } from "../helper/api/headers/headers";
import { faker } from "@faker-js/faker";
import path from "path";
import fs from "fs";

// Interop with existing JS utilities without converting them yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { dateUtils } from "./dates";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { logger } from "./logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { commonFunctions } from "./commonfuctions";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { createOrganizationRequest } from "../helper/api/payloads/createOrganizationPayLoad";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { createLicensePoolRequest } from "../helper/api/payloads/createLicensePoolPayLoad";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { createUserRequest } from "../helper/api/payloads/createUserPayload";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { updateOrganizationDetailsPayLoad } from "../helper/api/payloads/updateOrganizationDetailsPayLoad";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { createPlatformTierRequestPayload } from "../helper/api/payloads/createPlatformTierRequestPayload";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { roles } from "../helper/api/roles";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { APIClient } from "../helper/api/APIClient";

type ServiceConfig = {
  url: string;
  token?: string;
  jwt?: string;
  [k: string]: any;
};

let envVariables: Record<string, any> | null = null;
let siteShutdown_serviceConfig: ServiceConfig | null = null;
let orgDetails: any;

async function getLicensePoolsByOrgId(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
  organizationUuid: string,
) {
  const url = urlData.getLicensePoolsSetsUrl(organizationUuid, serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.token);
  const response = await request.get(url, { headers });

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

async function updateLicensePool(
  request: APIRequestContext,
  contract: string,
  contractLine: string,
  organizationUuid: string,
  serviceConfig: ServiceConfig,
  payLoad: Record<string, any>,
) {
  const url = urlData.updateLicensePoolSetsUrl(
    contract,
    contractLine,
    organizationUuid,
    serviceConfig,
  );
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const response = await request.patch(url, { headers, data: payLoad });
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

async function updateEndDateToAllLicensePools(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
  organizationUuid: string,
) {
  const licensePoolsData = await getLicensePoolsByOrgId(
    request,
    serviceConfig,
    organizationUuid,
  );
  const lineEndDate = dateUtils.pastDate(1);
  let flag = false;

  for (const item of licensePoolsData) {
    flag = false;
    const { contract, contractLine } = item;
    const payLoad = {
      lineStartDate: lineEndDate,
      lineEndDate: lineEndDate,
      licenseExpDate: lineEndDate,
    };

    const response = await updateLicensePool(
      request,
      contract,
      contractLine,
      organizationUuid,
      serviceConfig,
      payLoad,
    );
    logger.info(JSON.stringify(response));
    flag = true;
  }

  return flag;
}

async function createOrganization(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
  domain: string,
) {
  envVariables = APIClient.getEnvVariables();
  siteShutdown_serviceConfig = envVariables["site-shutdown-v2"];
  const url = urlData.createOrganizationUrl(serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const response = await request.post(url, {
    headers,
    data: createOrganizationRequest(domain),
  });

  if (!response.ok()) {
    logger.info(
      `Organization creation failed with status: ${response.status()}`,
    );
    logger.info(`Response text: ${await response.text()}`);
  }
  expect(response.ok()).toBeTruthy();
  orgDetails = await response.json();
  if (url.includes("stage")) {
    logger.info("Org_Url: " + "https://" + domain + ".stage.percipio.com");
    commonFunctions.writeFile(
      "utils/orgDataStage.json",
      JSON.stringify(orgDetails),
    );
  } else {
    logger.info(
      "Org_Url: " + "https://" + domain + ".front.develop.squads-dev.com",
    );
    commonFunctions.writeFile(
      "utils/orgDataDev.json",
      JSON.stringify(orgDetails),
    );
  }

  const updateOrgDetailsUrl = urlData.updateOrganizationDetailsUrl(
    siteShutdown_serviceConfig,
  );
  const updateOrgDetailsPayLoad = updateOrganizationDetailsPayLoad(
    orgDetails.orgId,
    domain,
  );

  const updateOrgDetailsResponse = await request.post(updateOrgDetailsUrl, {
    headers: headerData.basicAuth({
      token: siteShutdown_serviceConfig.token as string,
    }),
    data: updateOrgDetailsPayLoad,
  });

  if (!updateOrgDetailsResponse.ok()) {
    logger.info(
      `Update org details failed with status: ${updateOrgDetailsResponse.status()}`,
    );
    logger.info(`Response text: ${await updateOrgDetailsResponse.text()}`);

    // Handle 409 "Data already exists" as acceptable for testing
    if (updateOrgDetailsResponse.status() === 409) {
      logger.info(
        "Organization already exists in site shutdown service - continuing with test : Organization ID - " +
          orgDetails.orgId +
          " and Domain - " +
          domain,
      );
    } else {
      expect(updateOrgDetailsResponse.ok()).toBeTruthy();
    }
  }

  // Set environment variable
  process.env.ORG_ID = orgDetails.orgId;
  logger.info(orgDetails.orgId);
}

async function createLicensePool(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
  collectionID: string,
) {
  let books = "";
  let course = "";
  let response = null as any;
  const url = urlData.createLicensePoolUrl(serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const kitId = faker.number.int(Number.MAX_SAFE_INTEGER).toString();

  if (collectionID == "WintellectNow" || collectionID == "GoFLUENT") {
    course = "CRS_" + collectionID;
    response = await request.post(url, {
      headers,
      data: createLicensePoolRequest(orgDetails.orgId, course, kitId),
    });
    expect(response.ok()).toBeTruthy();
  } else {
    books = "BK_" + collectionID;
    course = "CRS_" + collectionID;
    response = await request.post(url, {
      headers,
      data: createLicensePoolRequest(orgDetails.orgId, books, kitId),
    });
    expect(response.ok()).toBeTruthy();
    response = await request.post(url, {
      headers,
      data: createLicensePoolRequest(orgDetails.orgId, course, kitId),
    });
    expect(response.ok()).toBeTruthy();
  }
}

async function createConnection(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
) {
  const url = urlData.createConnectionUrl(orgDetails.orgId, serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const payLoad = {
    strategy: "username_password",
  };
  const response = await request.post(url, { headers, data: payLoad });
  expect(response.ok()).toBeTruthy();
}

async function createPlatformTier(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
) {
  const url = urlData.createPlatformTierUrl(serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const payLoad = createPlatformTierRequestPayload(orgDetails.orgId);
  const response = await request.post(url, { headers, data: payLoad });
  expect(response.ok()).toBeTruthy();
  return response;
}

async function createUser(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
) {
  const url = urlData.createUserProvUrl(orgDetails.orgId, serviceConfig);
  const headers = headerData.commonHeaderWithToken(serviceConfig.jwt);
  const response = await request.post(url, {
    headers,
    data: createUserRequest(roles.siteAdmin, null, "##knock22", false, true),
  });
  expect(response.ok()).toBeTruthy();
}

export const provisioningData = {
  getLicensePoolsByOrgId,
  updateEndDateToAllLicensePools,
  updateLicensePool,
  createOrganization,
  createLicensePool,
  createConnection,
  createUser,
  createPlatformTier,
};
