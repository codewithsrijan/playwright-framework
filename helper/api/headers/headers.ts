export function basicAuth(serviceConfig: { token: string }) {
  return {
    Authorization: "Basic " + serviceConfig.token.replace(/"/g, ""),
    "Content-Type": "application/json",
  };
}

export function commonHeaderWithToken(token: string) {
  return {
    "Content-type": "application/json",
    authorization: "Bearer " + token.replace(/"/g, ""),
  };
}

export function chatGptHeader(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + apiKey.replace(/"/g, ""),
  };
}

export function adminUserToken(serviceConfig: { token: string }) {
  return {
    Authorization: "Bearer " + serviceConfig.token.replace(/"/g, ""),
    "Content-Type": "application/json",
  };
}

export function encodeBasicToken(username: string, password: string) {
  return Buffer.from(`${username}:${password}`).toString("base64");
}

export function basicAuthFromCredentials(username: string, password: string) {
  return {
    Authorization: "Basic " + encodeBasicToken(username, password),
    "Content-Type": "application/json",
  };
}

export const headerData = {
  basicAuth,
  commonHeaderWithToken,
  chatGptHeader,
  adminUserToken,
  encodeBasicToken,
  basicAuthFromCredentials,
};

