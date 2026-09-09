export function tokenGeneratorApipayload(userName?: string, Password?: string, orgId?: string) {
  return {
    login: userName,
    password: Password,
    organizationId: orgId,
  };
}

