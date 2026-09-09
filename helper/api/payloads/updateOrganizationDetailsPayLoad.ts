export function updateOrganizationDetailsPayLoad(
  org_uuid: string,
  domain: string,
  serviceName?: string,
  dataSeedStatus?: string
) {
  return {
    organizationUuid: org_uuid,
    organizationDomain: domain,
    serviceName: serviceName,
    dataSeedStatus: dataSeedStatus,
  };
}

