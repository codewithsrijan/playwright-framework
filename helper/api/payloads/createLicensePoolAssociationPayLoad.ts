export function createLicensePoolAssociationRequest(
  organizationUuid: string,
  audienceUuid: string,
  licensePoolSetUuid: string,
  createdBy: string
) {
  return {
    organizationUuid,
    licensePoolSetUuid,
    audienceUuid,
    createdBy,
  };
}

