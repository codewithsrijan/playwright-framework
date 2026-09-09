import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { urlData } from "../helper/api/urls";
import { headerData } from "../helper/api/headers/headers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { logger } from "./logger";

type ServiceConfig = {
  url: string;
  token: string; // Basic auth token for org/settings APIs
  jwt?: string; // Bearer token when required
  [k: string]: any;
};

async function orgConnectionAPICall(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
) {
  const url = await urlData.getConnectionDetailsUrl(serviceConfig);
  const response = await request.get(url, {
    headers: headerData.basicAuth(serviceConfig),
  });
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

async function getOrgID(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
) {
  const connectionData = await orgConnectionAPICall(request, serviceConfig);
  const organizationIds = new Set<string>();

  connectionData.forEach((item: any) => {
    if (item.organizationId) {
      organizationIds.add(item.organizationId as string);
    }
  });

  return Array.from(organizationIds);
}

async function getLicensePoolsByOrgId(
  request: APIRequestContext,
  serviceConfig: ServiceConfig,
  organizationUuid: string,
) {
  const url = urlData.getLicensePoolsSetsUrl(organizationUuid, serviceConfig);
  const headers = headerData.commonHeaderWithToken(
    serviceConfig.jwt ?? serviceConfig.token,
  );
  const response = await request.get(url, { headers });
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

async function updateExpiryDateInLicensePools() {
  // Intentionally left for future implementation
  logger?.info?.("updateExpiryDateInLicensePools not implemented yet");
}

export const organizationData = {
  orgConnectionData: orgConnectionAPICall,
  getOrgID,
  getLicensePoolsByOrgId,
  updateExpiryDateInLicensePools,
};
