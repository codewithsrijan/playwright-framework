import { commonFunctions } from "../../utils/commonfuctions";

// Interop with existing JS modules without changing them yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ENV = require("../../utils/env").default as Record<
  string,
  string | undefined
>;

const baseURL = ENV.BASE_URL;

const authenticateUrl = (serviceConfig: { url: string }) =>
  `${serviceConfig.url}/api/public/auth/authenticate`;

function getBuildVersion(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/public/build_version`;
}
function createUserUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/users`;
}
function createAttributeUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/custom-attributes`;
}
function getOrgDetailsUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}`;
}
function createAudienceUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/v1/organizations/${organizationUuid}/audiences`;
}
async function getConnectionDetailsUrl(serviceConfig: { url: string }) {
  const domain = await commonFunctions.getDomainFromURL();
  return `${serviceConfig.url}/api/subdomains/${domain}/connections`;
}
function getAttributeEnumValuesUrl(
  attributUuid: string,
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/v1/organizations/${organizationUuid}/custom-attributes/${attributUuid}/search-values`;
}

function associateLicensePoolUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/license-distributions`;
}

function authenticateUserUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/identity-provider/authenticate/v2`;
}
function connectUserUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/organizations/hooks/users/connect`;
}

function getOrgDetailsByDomainUrl(domain: string, serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/organizations/by_domain/${domain}`;
}
// Assignment
function createAssignmentUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/assignments/ucm/v1`;
}
function createLearningProgramtUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/learning-programs`;
}

// Self Registration
function createSelfRegistrationUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/registrations`;
}

// Settings
function updateSettingUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/settings`;
}

// Site Shutdown
function siteShutdownRequestUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v1/site-shutdown-request`;
}
function siteShutdownConfigUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v1/site-shutdown-request/service-config`;
}
function updateOrganizationDetailsUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v1/test-automation`;
}

// Provisioning
function getLicensePoolsSetsUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/v2/license-pools/organization/${organizationUuid}`;
}
function updateLicensePoolSetsUrl(
  contract: string,
  contractLine: string,
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/v2/license-pools/contract/${contract}/line/${contractLine}/organization/${organizationUuid}`;
}

function createOrganizationUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/v1/organizations`;
}
function createConnectionUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/v1/organizations/${organizationUuid}/auth/connections`;
}
function createUserProvUrl(
  organizationUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/v1/organizations/${organizationUuid}/users`;
}
function createLicensePoolUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/v2/license-pools`;
}
function createPlatformTierUrl(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/v1/contract-line-items/contract`;
}

// UCM2BFF
function createAreaUrl(areaUuid: string, serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/ucm/areas/${areaUuid}`;
}
function createSubjectUrl(subjectUuid: string, serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/ucm/subjects/${subjectUuid}`;
}
function createLinkedContentUrl(
  linkedContentUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/linked-content/${linkedContentUuid}`;
}
function publishLinkedContentUrl(
  linkedContentUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/linked-content/${linkedContentUuid}/publish`;
}
function createChannelUrl(channelUuid: string, serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/ucm/channels/${channelUuid}`;
}
function addContentToChannelUrl(
  channelViewUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/channel-views/${channelViewUuid}/content-items`;
}
function publishChannelUrl(
  channelUuid: string,
  serviceConfig: { url: string },
) {
  return `${serviceConfig.url}/api/ucm/channels/${channelUuid}/publish`;
}
function getChannelUrl(channelUuid: string, serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/ucm/channels/${channelUuid}`;
}

// tailored-content URLs
function seedTailoredContentURL(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v2/site-shutdown/async/seed-test-data`;
}
function validateTailoredContentURL(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v2/site-shutdown/async/validate-test-data`;
}

// equivalency-activity URLs
function seedEquivalencyActivityURL(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v2/site-shutdown/async/seed-test-data`;
}
function validateEquivalencyActivityURL(serviceConfig: { url: string }) {
  return `${serviceConfig.url}/api/v2/site-shutdown/async/validate-test-data`;
}

export const urlData = {
  createUserUrl,
  getBuildVersion,
  authenticateUrl,
  siteShutdownRequestUrl,
  siteShutdownConfigUrl,
  createAssignmentUrl,
  createLearningProgramtUrl,
  getLicensePoolsSetsUrl,
  getConnectionDetailsUrl,
  updateLicensePoolSetsUrl,
  getOrgDetailsUrl,
  getOrgDetailsByDomainUrl,
  createAttributeUrl,
  getAttributeEnumValuesUrl,
  createAudienceUrl,
  createSelfRegistrationUrl,
  updateSettingUrl,
  associateLicensePoolUrl,
  authenticateUserUrl,
  connectUserUrl,
  createOrganizationUrl,
  createConnectionUrl,
  createLicensePoolUrl,
  createUserProvUrl,
  updateOrganizationDetailsUrl,
  createAreaUrl,
  createSubjectUrl,
  createLinkedContentUrl,
  publishLinkedContentUrl,
  createChannelUrl,
  addContentToChannelUrl,
  publishChannelUrl,
  getChannelUrl,
  seedTailoredContentURL,
  validateTailoredContentURL,
  createPlatformTierUrl,
  seedEquivalencyActivityURL,
  validateEquivalencyActivityURL,
};
