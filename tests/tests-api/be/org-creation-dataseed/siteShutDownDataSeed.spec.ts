import { test, expect } from "@playwright/test";
import { APIClient } from "../../../../helper/api/APIClient";
import { v4 as uuidv4 } from "uuid";
import { headerData } from "../../../../helper/api/headers/headers";
import { createAttributeRequest } from "../../../../helper/api/payloads/createAttributePayload";
import { createAudienceRequest } from "../../../../helper/api/payloads/createAudiencePayload";
import { createLicensePoolAssociationRequest } from "../../../../helper/api/payloads/createLicensePoolAssociationPayLoad";
import { createSelfRegistrationRequest } from "../../../../helper/api/payloads/createSelfRegistrationPayLoad";
import { createUserAuthenticationRequest } from "../../../../helper/api/payloads/createUserAuthenticationPayLoad";
import { createUserRequest } from "../../../../helper/api/payloads/createUserPayload";
import { updateSettingRequest } from "../../../../helper/api/payloads/updateSettingPayLoad";
import { updateOrganizationDetailsPayLoad } from "../../../../helper/api/payloads/updateOrganizationDetailsPayLoad";
import { urlData } from "../../../../helper/api/urls";
// ENV, orgDataStage, orgDataDev were imported in JS but unused in this file; omit.
import { provisioningData } from "../../../../utils/provisioningData";
import * as role from "../../../../utils/roles.json";
import { createAssignmentRequest } from "../../../../helper/api/payloads/createAssignmentPayLoad";
import { createLearningProgramRequest } from "../../../../helper/api/payloads/createLearningProgramPayLoad";
import { logger } from "../../../../utils/logger";

let percipioToken: any;
let attributeUuid: any;
let organizationUuid: any;
let enumUuid: any;
let userUuid: any;
let adminUuid: any;
let audienceUuid: any;
let adminLoginName: any;
let password: any;

let envVariables: any = null;
let orgV2_serviceConfig: any = null;
let assignment_serviceConfig: any = null;
let settings_serviceConfig: any = null;
let selfRegistration_serviceConfig: any = null;
let provisioning_serviceConfig: any = null;
let siteShutdown_serviceConfig: any = null;
let tailoredContent_serviceConfig: any = null;
let equivalencyActivity_serviceConfig: any = null;

test.beforeAll(() => {
  envVariables = APIClient.getEnvVariables();
  orgV2_serviceConfig = envVariables["organizations-api"];
  assignment_serviceConfig = envVariables["assignment-service"];
  settings_serviceConfig = envVariables["settings-service"];
  selfRegistration_serviceConfig = envVariables["selfRegistration"];
  provisioning_serviceConfig = envVariables["provisioning"];
  siteShutdown_serviceConfig = envVariables["site-shutdown-v2"];
  tailoredContent_serviceConfig = envVariables["tailored-content"];
  equivalencyActivity_serviceConfig = envVariables["equivalency-activity"];
});

test.describe.serial("OrgV2 Data seed for site shutdown", () => {
  test("OrgV2 Health all @healthCheck", async ({ request }) => {
    const updateOrgDetailsResponse = await updateOrgDetails({
      request,
      serviceName: "ucm2",
      status: "started",
    });
    organizationUuid = updateOrgDetailsResponse.organizationUuid;
    logger.info("Organization UUID: " + organizationUuid);
    const response = await request.get(
      urlData.getBuildVersion(orgV2_serviceConfig),
      {
        headers: headerData.basicAuth(orgV2_serviceConfig),
      },
    );
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Create new attribute @createAttribute", async ({ request }) => {
    const response = await request.post(
      urlData.createAttributeUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createAttributeRequest(),
      },
    );
    logger.info("Create Attribute Response: " + response.toString());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    attributeUuid = data.customAttributeUuid;
  });

  test("Get the attribute enumValues ", async ({ request }) => {
    const response = await request.get(
      urlData.getAttributeEnumValuesUrl(
        attributeUuid,
        organizationUuid,
        orgV2_serviceConfig,
      ) + "?type=value",
      {
        headers: headerData.basicAuth(orgV2_serviceConfig),
      },
    );
    const data = await response.json();
    enumUuid = data.enumValues[0].optionUuid;
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Create new audience", async ({ request }) => {
    const response = await request.post(
      urlData.createAudienceUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createAudienceRequest(attributeUuid, enumUuid),
      },
    );
    const data = await response.json();
    audienceUuid = data.audienceUuid;
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Create new user @userCreation", async ({ request }) => {
    password = uuidv4();
    const user = await request.post(
      urlData.createUserUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createUserRequest(
          (role as any).Learner,
          attributeUuid,
          password,
          true,
          false,
          false,
        ),
      },
    );
    expect(user.status()).toBe(200);
    const data = await user.json();
    userUuid = data.id;
    adminLoginName = data.loginName;
    expect(user.ok()).toBeTruthy();
    expect(user.status()).toBe(200);
  });

  // let admin = await request.post(urlData.createUserUrl(organizationUuid, orgV2_serviceConfig), {
  //   headers: {
  //     Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ''),
  //     "Content-Type": "application/json",
  //     "x-author-org-id": organizationUuid,
  //     "x-author-userid": organizationUuid
  //   },
  //   data: createUserRequest(role.SiteAdmin, attributeUuid, password)
  // });
  // expect(admin.status()).toBe(200);
  // data = await admin.json();
  // adminUuid = data.id;
  // adminLoginName = data.loginName
  // expect(admin.ok()).toBeTruthy();
  // expect(admin.status()).toBe(200);

  test("Create assignment ", async ({ request }) => {
    const isDevelopEnv =
      (process.env.NODE_ENV || "").toLowerCase().startsWith("develop") ||
      (assignment_serviceConfig?.url || "").includes("develop");
    const businessObjectiveUuid = isDevelopEnv
      ? "61dbb0f1-449a-4fd0-9462-e5c7451d1c52"
      : "aab4ece5-ca89-4d42-bca1-08b09170da91";
    const assignmentUrl = urlData.createAssignmentUrl(assignment_serviceConfig);
    const assignmentHeaders = {
      Authorization:
        "Basic " + assignment_serviceConfig.token.replace(/"/g, ""),
      "Content-Type": "application/json",
      "x-author-org-id": organizationUuid,
      "x-author-userid": organizationUuid,
    };
    const assignmentPayload = createAssignmentRequest(
      audienceUuid,
      userUuid,
      organizationUuid,
      userUuid,
      businessObjectiveUuid,
    );

    logger.info(
      `Create Assignment Request: URL=${assignmentUrl} headers=${JSON.stringify(
        assignmentHeaders,
      )} body=${JSON.stringify(assignmentPayload)}`,
    );

    const response = await request.post(assignmentUrl, {
      headers: assignmentHeaders,
      data: assignmentPayload,
    });

    logger.info("Create Assignment Response: " + response.toString());
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Create Learning Program ", async ({ request }) => {
    const response = await request.post(
      urlData.createLearningProgramtUrl(assignment_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + assignment_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createLearningProgramRequest(
          audienceUuid,
          userUuid,
          organizationUuid,
          userUuid,
        ),
      },
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Associate license pool to admin user", async ({ request }) => {
    const licensePoolsData = await provisioningData.getLicensePoolsByOrgId(
      request,
      provisioning_serviceConfig,
      organizationUuid,
    );
    const response = await request.post(
      urlData.associateLicensePoolUrl(orgV2_serviceConfig),
      {
        headers: {
          Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createLicensePoolAssociationRequest(
          organizationUuid,
          audienceUuid,
          licensePoolsData[1].lpSetId,
          userUuid,
        ),
      },
    );
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();
  });

  test("Authenticate and create session for user", async ({ request }) => {
    let response = await request.post(
      urlData.authenticateUserUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
        },
        data: createUserAuthenticationRequest(adminLoginName, password),
      },
    );

    const data = await response.json();
    percipioToken = data.percipio_jwt;
    expect(response.status()).toBe(200);

    response = await request.post(urlData.connectUserUrl(orgV2_serviceConfig), {
      headers: {
        Authorization: "Basic " + orgV2_serviceConfig.token.replace(/"/g, ""),
        "Content-Type": "application/json",
      },
      data: {
        token: percipioToken,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});

test.describe.serial("Settings Data seed for site shutdown", () => {
  test("Update Setting ", async ({ request }) => {
    const response = await request.patch(
      urlData.updateSettingUrl(organizationUuid, settings_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + settings_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
        },
        data: updateSettingRequest(),
      },
    );
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});

test.describe.serial("Self Registration Data seed for site shutdown", () => {
  test("Create Self Registration Record ", async ({ request }) => {
    const selfRegistrationPayload =
      createSelfRegistrationRequest(organizationUuid);
    logger.info(
      "Create Self Registration Payload: " +
        JSON.stringify(selfRegistrationPayload),
    );

    const response = await request.post(
      urlData.createSelfRegistrationUrl(selfRegistration_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + selfRegistration_serviceConfig.token.replace(/"/g, ""),
          "Content-Type": "application/json",
        },
        data: selfRegistrationPayload,
      },
    );
    logger.info("Create Self Registration Response: " + response.toString());
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    await updateOrgDetails({
      request,
      serviceName: "ucm2",
      status: "completed",
    });
  });
});

test.describe.serial("tailored-content data seed for site shutdown", () => {
  test("Should seed test data in tailored-content", async ({ request }) => {
    const response = await request.post(
      urlData.seedTailoredContentURL(tailoredContent_serviceConfig),
      {
        headers: {
          ...headerData.basicAuth(tailoredContent_serviceConfig),
          "x-request-id": uuidv4(),
        },
      },
    );
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    const parsedResponse = JSON.parse(responseBody);
    expect(parsedResponse.success).toBeTruthy();
  });

  test("Should validate that learner records currently exist in tailored-content after seeding", async ({
    request,
  }) => {
    const response = await request.post(
      urlData.validateTailoredContentURL(tailoredContent_serviceConfig),
      {
        headers: {
          ...headerData.basicAuth(tailoredContent_serviceConfig),
          "x-request-id": uuidv4(),
        },
      },
    );
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
    const responseBody = await response.text();
    const parsedResponse = JSON.parse(responseBody);
    expect(parsedResponse.success).toBe("false");
    const numberOfAnswers = parsedResponse.message.split(" ")[6];
    expect(parseInt(numberOfAnswers)).toBeGreaterThan(0);
  });
});

test.describe.serial("equivalency-activity data seed for site shutdown", () => {
  test("Should seed test data in equivalency-activity", async ({ request }) => {
    const response = await request.post(
      urlData.seedEquivalencyActivityURL(equivalencyActivity_serviceConfig),
      {
        headers: {
          ...headerData.basicAuth(equivalencyActivity_serviceConfig),
          "x-request-id": uuidv4(),
        },
      },
    );
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.text();
    const parsedResponse = JSON.parse(responseBody);
    expect(parsedResponse.success).toBeTruthy();
  });

  test("Should validate that records exist in equivalency-activity after seeding", async ({
    request,
  }) => {
    const response = await request.post(
      urlData.validateEquivalencyActivityURL(equivalencyActivity_serviceConfig),
      {
        headers: {
          ...headerData.basicAuth(equivalencyActivity_serviceConfig),
          "x-request-id": uuidv4(),
        },
      },
    );
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
    const responseBody = await response.text();
    const parsedResponse = JSON.parse(responseBody);
    expect(parsedResponse.success).toBe("false");
    const numberOfAnswers = parsedResponse.message.split(" ")[6];
    expect(parseInt(numberOfAnswers)).toBeGreaterThan(0);
  });
});

const updateOrgDetails = async ({
  request,
  serviceName,
  status,
}: {
  request: any;
  serviceName: string;
  status: string;
}) => {
  const updateOrgDetailsPayload = updateOrganizationDetailsPayLoad(
    "",
    "",
    serviceName,
    status,
  );
  const response = await request.post(
    urlData.updateOrganizationDetailsUrl(siteShutdown_serviceConfig),
    {
      headers: headerData.basicAuth(siteShutdown_serviceConfig),
      data: updateOrgDetailsPayload,
    },
  );
  const organizationId = await response.text();
  logger.info("Update Org Details Response ID: " + organizationId);
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  return {
    organizationUuid: organizationId.replace(/"/g, ""),
  };
};

// Site branding
// Self Reg data
// Session Creation
// License Pool association
// License Consumption
// Assignment Creation
// Learning Program creatiom
// User Creation
// Audience Creation
// Attribute Creation

//NODE_ENV=develop npx playwright test "siteShutDownDataSeed.spec.js" -c 'playwright.api.config.ts' --reporter=list --workers 1
//NODE_ENV=develop npx playwright test --grep @userCreation  -c 'playwright.api.config.ts' --reporter=list --workers 1
// NODE_ENV=develop npx playwright test --grep @healthCheck  -c 'playwright.api.config.ts' --reporter=list --workers 1
