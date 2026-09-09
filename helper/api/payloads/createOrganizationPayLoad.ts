import { v4 as uuidv4 } from "uuid";
// Interop without converting dates util yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");

export function createOrganizationRequest(domain: string) {
  return {
    peopleSoftId: "peopleSoftId-" + dateUtils.todayDateWithTimeStamp(),
    salesForceCustId: "salesForceCustId" + dateUtils.todayDateWithTimeStamp(),
    orgName: domain,
    displayName: domain,
    domain: domain,
    orgType: "internal",
    domainUuid: uuidv4(),
  };
}

