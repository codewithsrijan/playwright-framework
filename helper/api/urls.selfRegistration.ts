// AUTO-GENERATED — do not edit manually
// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service selfRegistration

// URL builder functions for selfRegistration
// Pattern follows helper/api/urls.ts conventions

export function postApiRegistrationsUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations`;
}

export function postApiRegistrationsByregistrationUuidOtpBycodeValidateUrl(registrationUuid: string, code: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/${registrationUuid}/otp/${code}/validate`;
}

export function postApiRegistrationsByregistrationUuidSaveUserUrl(registrationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/${registrationUuid}/save-user`;
}

export function postApiRegistrationsByregistrationUuidOtpResendUrl(registrationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/${registrationUuid}/otp/resend`;
}

export function getApiRegistrationsByregistrationUuidFetchUserStatusUrl(registrationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/${registrationUuid}/fetch-user-status`;
}

export function postApiRegistrationsByregistrationUuidSendOtpEmailUrl(registrationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/${registrationUuid}/send-otp-email`;
}

export function postApiRegistrationsFetchRegisteredUsersForApprovalUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/fetch-registered-users-for-approval`;
}

export function putApiRegistrationsApprovePendingRegisteredUsersUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/approve-pending-registered-users`;
}

export function putApiRegistrationsApproveRegisteredUserWithUpdateUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/approve-registered-user-with-update`;
}

export function putApiRegistrationsRejectPendingRegistrationUsersUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/reject-pending-registration-users`;
}

export function putApiRegistrationsBulkUpdateCustomAttributeValuesUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/registrations/bulk-update-custom-attribute-values`;
}

export function postApiUsersByuserUuidOtpByfeatureTypeGenerateUrl(userUuid: string, featureType: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/users/${userUuid}/otp/${featureType}/generate`;
}

export function postApiUsersByuserUuidOtpByfeatureTypeValidateUrl(userUuid: string, featureType: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/users/${userUuid}/otp/${featureType}/validate`;
}

export function postApiUsersByuserUuidOtpByfeatureTypeVerifyEmailUrl(userUuid: string, featureType: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/users/${userUuid}/otp/${featureType}/verify-email`;
}

export function getApiOrganizationsByorganizationUuidConfigUrl(organizationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/config`;
}

export function postApiOrganizationsByorganizationUuidConfigUrl(organizationUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/config`;
}

export function deleteApiOrganizationsByorganizationUuidCustomAttributesBycustomAttributeUuidUrl(organizationUuid: string, customAttributeUuid: string, serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/organizations/${organizationUuid}/custom-attributes/${customAttributeUuid}`;
}

export function getApiPublicHealthV1PingUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/public/health/v1/ping`;
}

export function getApiHealthV1LocalUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/health/v1/local`;
}

export function getApiHealthV1RemoteUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/health/v1/remote`;
}

export function getApiHealthV1AllUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/health/v1/all`;
}

export function getApiHealthV1AuthBasicUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/health/v1/auth/basic`;
}

export function getApiPublicBuildVersionUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/public/build_version`;
}

export function getApiAuditMesgsUrl(serviceConfig: { url: string }): string {
  return `${serviceConfig.url}/api/audit-mesgs`;
}

export const selfRegistrationUrls = {
  postApiRegistrationsUrl,
  postApiRegistrationsByregistrationUuidOtpBycodeValidateUrl,
  postApiRegistrationsByregistrationUuidSaveUserUrl,
  postApiRegistrationsByregistrationUuidOtpResendUrl,
  getApiRegistrationsByregistrationUuidFetchUserStatusUrl,
  postApiRegistrationsByregistrationUuidSendOtpEmailUrl,
  postApiRegistrationsFetchRegisteredUsersForApprovalUrl,
  putApiRegistrationsApprovePendingRegisteredUsersUrl,
  putApiRegistrationsApproveRegisteredUserWithUpdateUrl,
  putApiRegistrationsRejectPendingRegistrationUsersUrl,
  putApiRegistrationsBulkUpdateCustomAttributeValuesUrl,
  postApiUsersByuserUuidOtpByfeatureTypeGenerateUrl,
  postApiUsersByuserUuidOtpByfeatureTypeValidateUrl,
  postApiUsersByuserUuidOtpByfeatureTypeVerifyEmailUrl,
  getApiOrganizationsByorganizationUuidConfigUrl,
  postApiOrganizationsByorganizationUuidConfigUrl,
  deleteApiOrganizationsByorganizationUuidCustomAttributesBycustomAttributeUuidUrl,
  getApiPublicHealthV1PingUrl,
  getApiHealthV1LocalUrl,
  getApiHealthV1RemoteUrl,
  getApiHealthV1AllUrl,
  getApiHealthV1AuthBasicUrl,
  getApiPublicBuildVersionUrl,
  getApiAuditMesgsUrl,
};