import { faker } from "@faker-js/faker";
// Interop without converting dates util yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");

export function createLicensePoolRequest(
  organizationUuid: string,
  collectionId: string,
  kitId: string
) {
  return {
    contract: faker.number.int(Number.MAX_SAFE_INTEGER).toString(),
    contractLine: Math.floor(Math.random() * 10000 + 1),
    peopleSoftProdId: "PeopleSoftProd-" + faker.number.int(Number.MAX_SAFE_INTEGER),
    orderNumber: Math.floor(Math.random() * 10000 + 1),
    kitId: kitId,
    collectionId: collectionId,
    seats: 500,
    lineStartDate: dateUtils.todayDateWithTimeStamp(),
    lineEndDate: dateUtils.futureDateWithTimeStamp(365),
    licenseExpDate: dateUtils.futureDateWithTimeStamp(365),
    peopleSoftOrgId: "PeopleSoft-" + faker.number.int(Number.MAX_SAFE_INTEGER),
    salesForceCustId: "SalesForceId-" + faker.number.int(Number.MAX_SAFE_INTEGER),
    customerName: "Customer-" + faker.number.int(Number.MAX_SAFE_INTEGER),
    orgId: organizationUuid,
    contractValueUSD: 500000,
    contractValue: 250000,
    royaltyRestrictionsApply: false,
    allLocales: true,
    props: null,
    qualifiers: null,
    parentLpSetId: null,
    isChildSiteAutoRenewable: true,
  };
}

