import { v4 as uuidv4 } from "uuid";

export function createAudienceRequest(attributeUuid: string, enumValue: string) {
  return {
    audienceName: "Audience" + uuidv4(),
    ownerUuids: [] as string[],
    additionalUserUuids: [] as string[],
    channelUuids: [] as string[],
    audienceFilters: [
      {
        audienceFilterUuid: uuidv4(),
        audienceFilterTypeId: 2,
        audienceFilterTypeName: "VALUE",
        customAttributeUuid: attributeUuid,
        dateValues: null,
        startDate: null,
        endDate: null,
        enumValues: [enumValue],
        userValues: null,
        stringValues: null,
        operator: "equals",
      },
    ],
    audienceAdministratorsUuids: [] as string[],
    parentAudienceUuid: null as string | null,
  };
}

