// Interop with existing dates util
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");
import { faker } from "@faker-js/faker";

type Options = {
  organizationUuid?: string;
  contract?: string;
  contractLine?: number;
  orderNumber?: number;
  peoplesoftOrgId?: string;
  startDate?: string;
  endDate?: string;
  seats?: number;
  platformTierTypeId?: string;
  additionalCapabilityUuids?: string[];
  additionalRestrictionUuids?: string[];
};

export function createPlatformTierRequestPayload(organizationUuid: string, options: Options = {}) {
  return {
    organizationUuid: options.organizationUuid || organizationUuid,
    contract:
      options.contract ||
      faker.number.int({ min: 100000000000000000, max: 999999999999999999 }).toString(),
    contractLine: options.contractLine || faker.number.int({ min: 100000000, max: 999999999 }),
    orderNumber: options.orderNumber || faker.number.int({ min: 100000, max: 999999 }),
    peoplesoftOrgId:
      options.peoplesoftOrgId ||
      faker.number.int({ min: 100000000000000000, max: 999999999999999999 }).toString(),
    startDate: options.startDate || dateUtils.todayDateWithTimeStamp(),
    endDate: options.endDate || dateUtils.futureDateWithTimeStamp(365),
    seats: options.seats || faker.number.int({ min: 100000, max: 999999 }),
    platformTierTypeId: options.platformTierTypeId || "PLATFORM_TIER_2",
    additionalCapabilityUuids: options.additionalCapabilityUuids || [],
    additionalRestrictionUuids: options.additionalRestrictionUuids || [],
  };
}

