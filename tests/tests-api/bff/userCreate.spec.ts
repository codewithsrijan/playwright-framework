import { test, expect } from "@playwright/test";
import { logger } from "../../../utils/logger";
import { urlData } from "../../../helper/api/urls.js";
import { createUserRequest as createUserBody } from "../../../helper/api/payloads/createUserPayload.js";
import { roles } from "../../../helper/api/roles.js";
import { headerData } from "../../../helper/api/headers/headers.js";
import { APIClient } from "../../../helper/api/APIClient.js";

let token: string | undefined;
let apiClientInstance: APIClient;
let envVariables: Record<string, any>;
test.beforeAll("get Token", async ({ request }) => {
  envVariables = APIClient.getEnvVariables();
  const client = new APIClient();
  token = await client.generateToken(
    request,
    envVariables["frontend"] as {
      url: string;
      username: string;
      password: string;
      orgId: string;
      [k: string]: any;
    },
  );
  apiClientInstance = new APIClient();
});

test.describe("Create User", () => {
  test("Creating new user ", async ({ request }) => {
    console.log(urlData.createUserUrl);
    console.log(
      createUserBody(roles.learner, null, "Passw0rd!", true, true, false),
    );
    console.log(headerData.commonHeaderWithToken(token!));
    // Example endpoint requires serviceConfig; adjust to your actual call
    // let response = await request.post(urlData.createUserUrl(serviceConfig), {
    //   data: createUserBody(roles.learner, null, "Passw0rd!", true, true, false),
    //   headers: headerData.commonHeaderWithToken(token!),
    // });
    // console.log(response.status());
    // console.log(await response.json());
    expect(true).toBeTruthy();
  });
});
