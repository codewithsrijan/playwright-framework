import { commonFunctions } from "../../../utils/commonfuctions";

async function siteDeactivationPayload(organizationUuid: string, organizationDomain: string) {
  return {
    orgRequests: [
      {
        organizationUuid,
        organizationDomain,
        ticketId: (await commonFunctions.generateRandomId(5)).toString(),
        actionType: "deactivation",
      },
    ],
  };
}

async function siteShutdownPayload(organizationUuid: string, organizationDomain: string) {
  return {
    orgRequests: [
      {
        organizationUuid,
        organizationDomain,
        ticketId: (await commonFunctions.generateRandomId(5)).toString(),
        actionType: "shutdown",
      },
    ],
  };
}

export const siteShutdownPayloads = {
  siteDeactivationPayload,
  siteShutdownPayload,
};

