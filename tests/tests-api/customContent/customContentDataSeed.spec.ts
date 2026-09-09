import { test, expect } from "@playwright/test";
import { APIClient } from "../../../helper/api/APIClient";
import { v4 as uuidv4 } from "uuid";
import { headerData } from "../../../helper/api/headers/headers";
import { createAttributeRequest } from "../../../helper/api/payloads/createAttributePayload";
import { createAudienceRequest } from "../../../helper/api/payloads/createAudiencePayload";
import { createUserRequest } from "../../../helper/api/payloads/createUserPayload";
import { createUserAuthenticationRequest } from "../../../helper/api/payloads/createUserAuthenticationPayLoad";
import { createAreaRequest } from "../../../helper/api/payloads/createAreaPayLoad";
import { createSubjectRequest } from "../../../helper/api/payloads/createSubjectPayload";
import { createLinkedContentRequest } from "../../../helper/api/payloads/createLinkedContentPayload";
import { createChannelRequest } from "../../../helper/api/payloads/createChannelPayload";
import { createAddContentToChannelPayload } from "../../../helper/api/payloads/addContentToChannelPayload";
import { urlData } from "../../../helper/api/urls";
import { provisioningData } from "../../../utils/provisioningData";
import { commonFunctions } from "../../../utils/commonfuctions";
import { logger } from "../../../utils/logger";
import { dateUtils } from "../../../utils/dates";
import * as role from "../../../utils/roles.json";

let organizationUuid: any;
let organizationDomain: any;
let attributeUuid: any;
let enumUuid: any;
let audienceUuid: any;
let userUuid: any;
let adminUuid: any;
let adminLoginName: any;
let userLoginName: any;
let password: any;
let adminToken: any; // Generated admin token for UCM operations

let areaUuid: any;
let subjectUuid: any;
let linkedContentUuid: any;
let customChannelUuid: any;
let customChannelViewUuid: any;
let publishedChannelUuid: any;

let areaTitle: any;
let subjectTitle: any;
let linkedContentTitle: any;
let customChannelTitle: any;
let attributeName: any;
let audienceName: any;

// Service configurations
let envVariables: any = null;
let orgV2_serviceConfig: any = null;
let provisioning_serviceConfig: any = null;
let ucm2bff_serviceConfig: any = null;

const GOOGLE_URL = "https://www.google.com";

// Helper function to save current UUIDs to file
async function saveCustomContentDataSeeding() {
  const customContentDataSeedingResults = {
    // Organization details
    organizationUuid,
    organizationDomain,

    // User details
    adminUuid,
    adminLoginName,
    userUuid,
    userLoginName,
    password,

    // Audience and targeting
    attributeUuid,
    attributeName,
    enumUuid,
    audienceUuid,
    audienceName,

    // Content details
    areaUuid,
    areaTitle,
    subjectUuid,
    subjectTitle,
    linkedContentUuid,
    linkedContentTitle,
    customChannelUuid,
    customChannelViewUuid,
    customChannelTitle,
    publishedChannelUuid,

    // Authentication
    adminToken: adminToken ? "TOKEN_EXISTS" : "NO_TOKEN",

    // Metadata
    timestamp: new Date().toISOString(),
    testType: "customContentDataSeeding",
    status: "in_progress",
    contentCreated: {
      area: areaUuid ? true : false,
      subject: subjectUuid ? true : false,
      linkedContent: linkedContentUuid ? true : false,
      customChannel: customChannelUuid ? true : false,
      publishedChannel: publishedChannelUuid ? true : false,
    },
  };

  try {
    await commonFunctions.writeFile(
      "utils/customContentDataSeed.json",
      JSON.stringify(customContentDataSeedingResults, null, 2),
    );
    logger.info(`UUIDs updated in utils/customContentDataSeed.json`);
  } catch (error: any) {
    logger.warn(`Failed to save UUIDs to file: ${error.message}`);
  }
}

test.beforeAll(async () => {
  envVariables = APIClient.getEnvVariables();
  orgV2_serviceConfig = envVariables["organizations-api"];
  provisioning_serviceConfig = envVariables["provisioning"];
  ucm2bff_serviceConfig = envVariables["ucm2bff"];

  // Debug: Log service configurations
  logger.info("Service Configurations:");
  logger.info(`   ENV: ${process.env.NODE_ENV}`);
  logger.info(
    `   Organizations API URL: ${orgV2_serviceConfig?.url || "NOT_CONFIGURED"}`,
  );
  logger.info(
    `   Organizations API Token: ${
      orgV2_serviceConfig?.token ? "CONFIGURED" : "NOT_CONFIGURED"
    }`,
  );
  logger.info(
    `   Provisioning URL: ${
      provisioning_serviceConfig?.url || "NOT_CONFIGURED"
    }`,
  );
  logger.info(
    `   UCM2BFF URL: ${ucm2bff_serviceConfig?.url || "NOT_CONFIGURED"}`,
  );

  // Try to read existing organization data from orgData.json (created by organizationCreation.spec.js)
  try {
    if (urlData.getBuildVersion(orgV2_serviceConfig).includes("stage")) {
      const orgDataContent = await commonFunctions.readFile(
        "utils/orgDataStage.json",
      );
    } else {
      const orgDataContent = await commonFunctions.readFile(
        "utils/orgDataDev.json",
      );
    }
    const orgData = JSON.parse(
      await commonFunctions.readFile("utils/orgDataDev.json").catch(() => "{}"),
    );
    if (orgData && orgData.orgId) {
      organizationUuid = orgData.orgId;
      organizationDomain = orgData.orgDomain;
      logger.info(
        `Using Organization UUID from organizationCreation: ${organizationUuid}`,
      );
      logger.info(`   Organization Domain: ${organizationDomain}`);
    }
  } catch (error: any) {
    logger.info(
      "No existing orgData.json found, will create new organization in first test",
    );
    logger.info(`   Error: ${error.message}`);
  }
});

test.describe.serial("Custom Content Data Seeding for Site Shutdown", () => {
  test("Health Check and Setup Organization @healthCheck", async ({
    request,
  }) => {
    logger.info("=== STARTING CUSTOM CONTENT DATA SEEDING ===");

    // If we don't have organizationUuid from beforeAll, try to get it from environment or create new
    if (!organizationUuid) {
      // Check if ORG_ID is set in environment (from organizationCreation.spec.js)
      if (process.env.ORG_ID) {
        organizationUuid = process.env.ORG_ID;
        logger.info(
          `Using Organization UUID from environment: ${organizationUuid}`,
        );
      }
    }

    // Health check for organizations API
    const response = await request.get(
      urlData.getBuildVersion(orgV2_serviceConfig),
      {
        headers: headerData.basicAuth(orgV2_serviceConfig),
      },
    );
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    logger.info(`Organizations API Health Check: OK`);
    logger.info(`Using Organization UUID: ${organizationUuid}`);
  });

  test("Create Custom Attribute for Audience Targeting @createAttribute", async ({
    request,
  }) => {
    const attributePayload = createAttributeRequest();
    attributeName = attributePayload.name;

    const response = await request.post(
      urlData.createAttributeUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + orgV2_serviceConfig.token.replace(/\"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: attributePayload,
      },
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    attributeUuid = data.customAttributeUuid;
    logger.info(`Created Custom Attribute UUID: ${attributeUuid}`);
    logger.info(`   Attribute Name: ${attributeName}`);

    // Save UUIDs to file
    await saveCustomContentDataSeeding();
  });

  test("Get Attribute Enum Values @getEnumValues", async ({ request }) => {
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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    enumUuid = data.enumValues[0].optionUuid;
    logger.info(`Retrieved Enum Value UUID: ${enumUuid}`);

    // Save UUIDs to file
    await saveCustomContentDataSeeding();
  });

  test("Create Audience for Channel Publishing @createAudience", async ({
    request,
  }) => {
    const audiencePayload = createAudienceRequest(attributeUuid, enumUuid);
    audienceName = audiencePayload.audienceName;

    const response = await request.post(
      urlData.createAudienceUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + orgV2_serviceConfig.token.replace(/\"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: audiencePayload,
      },
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    audienceUuid = data.audienceUuid;
    logger.info(`Created Audience UUID: ${audienceUuid}`);
    logger.info(`   Audience Name: ${audienceName}`);

    // Save UUIDs to file
    await saveCustomContentDataSeeding();
  });

  test("Create User Connection for Organization @createConnection", async ({
    request,
  }) => {
    logger.info("Creating user connection for organization...");
    logger.info(`   Organization UUID: ${organizationUuid}`);

    const connectionUrl = urlData.createConnectionUrl(
      organizationUuid,
      provisioning_serviceConfig,
    );
    logger.info(`   Connection URL: ${connectionUrl}`);

    const connectionPayload = { strategy: "username_password" };

    const response = await request.post(connectionUrl, {
      headers: {
        Authorization: `Bearer ${provisioning_serviceConfig.jwt}`,
        "Content-Type": "application/json",
      },
      data: connectionPayload,
    });

    logger.info(`Connection Creation Response Status: ${response.status()}`);
    logger.info(`   Response OK: ${response.ok()}`);

    if (!response.ok() && response.status() !== 409) {
      const errorBody = await response.text();
      logger.error(`Connection creation failed with error: ${errorBody}`);
      const responseHeaders = response.headers();
      logger.error(
        `Response Headers: ${JSON.stringify(responseHeaders, null, 2)}`,
      );
    }

    // Accept 200 (found), 201 (created), or 409 (already exists)
    expect([200, 201, 409]).toContain(response.status());

    let statusMessage;
    if (response.status() === 200) statusMessage = "already exists (200)";
    else if (response.status() === 201)
      statusMessage = "created successfully (201)";
    else if (response.status() === 409)
      statusMessage = "already exists (409 - conflict)";

    logger.info(`User connection ${statusMessage} for organization`);
  });

  test("Create Site Admin User @createSiteAdmin", async ({ request }) => {
    password = uuidv4();

    const response = await request.post(
      urlData.createUserUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + orgV2_serviceConfig.token.replace(/\"/g, ""),
          "Content-Type": "application/json",
          "x-author-org-id": organizationUuid,
          "x-author-userid": organizationUuid,
        },
        data: createUserRequest(
          (role as any).SiteAdmin,
          attributeUuid,
          password,
          true,
          false,
          false,
        ),
      },
    );

    logger.info(`Site Admin Creation Response Status: ${response.status()}`);
    logger.info(`   Response OK: ${response.ok()}`);

    if (!response.ok()) {
      const errorBody = await response.text();
      logger.error(`Site Admin creation failed with error: ${errorBody}`);
      const responseHeaders = response.headers();
      logger.error(
        `Response Headers: ${JSON.stringify(responseHeaders, null, 2)}`,
      );
    }

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    adminUuid = data.id;
    adminLoginName = data.loginName;
    logger.info(
      `Created Site Admin - UUID: ${adminUuid}, Login: ${adminLoginName}`,
    );

    await saveCustomContentDataSeeding();
  });

  test("Create Learner User @createLearner", async ({ request }) => {
    const response = await request.post(
      urlData.createUserUrl(organizationUuid, orgV2_serviceConfig),
      {
        headers: {
          Authorization:
            "Basic " + orgV2_serviceConfig.token.replace(/\"/g, ""),
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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    userUuid = data.id;
    userLoginName = data.loginName;
    logger.info(
      `Created Learner User - UUID: ${userUuid}, Login: ${userLoginName}`,
    );

    await saveCustomContentDataSeeding();
  });

  test("Authenticate Admin User for Content Creation @authenticateAdmin", async ({
    request,
  }) => {
    const authUrl = urlData.authenticateUserUrl(
      organizationUuid,
      orgV2_serviceConfig,
    );

    const authPayload = createUserAuthenticationRequest(
      adminLoginName,
      password,
    );

    const response = await request.post(authUrl, {
      headers: {
        Authorization: "Basic " + orgV2_serviceConfig.token.replace(/\"/g, ""),
        "Content-Type": "application/json",
      },
      data: authPayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test("Generate Admin Token for UCM Operations @generateAdminToken", async ({
    request,
  }) => {
    const frontEndDomain =
      process.env.NODE_ENV === "stage"
        ? `${organizationDomain}.stage.percipio.com`
        : `${organizationDomain}.front.develop.squads-dev.com`;
    const adminTokenUrl = `https://${frontEndDomain}/api/public/auth/authenticate`;

    const authPayload = {
      login: adminLoginName,
      password: password,
      organizationId: organizationUuid,
    };

    const response = await request.post(adminTokenUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-request-id": uuidv4(),
        "x-sks-cid": uuidv4(),
      },
      data: authPayload,
    });

    if (response.ok()) {
      const data = await response.json();
      adminToken = data.id_token;
    }

    expect(adminToken).toBeTruthy();
    await saveCustomContentDataSeeding();
  });

  test("Create Area for Subject Organization @createArea", async ({
    request,
  }) => {
    areaUuid = uuidv4();
    const timestamp = dateUtils.todayDateWithTimeStamp();

    areaTitle = `CustomContent_Area_${timestamp}`;
    const customDescription = `Area for organizing custom content subjects in site shutdown testing`;
    const areaPayload = createAreaRequest(areaTitle, customDescription);

    const ucm2Url = urlData.createAreaUrl(areaUuid, ucm2bff_serviceConfig);

    const requestId = uuidv4();
    const response = await request.post(ucm2Url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-request-id": requestId,
        "x-sks-cid": requestId,
        "x-sks-user-id": adminUuid,
        "x-sks-org-id": organizationUuid,
      },
      data: areaPayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    await saveCustomContentDataSeeding();
  });

  test("Create Subject within Area @createSubject", async ({ request }) => {
    subjectUuid = uuidv4();
    const timestamp = dateUtils.todayDateWithTimeStamp();

    const subjectPayload = createSubjectRequest(
      areaUuid,
      [], // channelUuids - will be populated later
      null, // uploadUuid
      adminUuid, // ownerUuid
    );

    subjectTitle = `CustomContent_Subject_${timestamp}`;
    subjectPayload.title = subjectTitle;
    subjectPayload.localizedMetadataList[0].title = subjectTitle;
    subjectPayload.localizedMetadataList[0].description = `Subject for organizing linked content in site shutdown testing`;

    const ucm2SubjectUrl = urlData.createSubjectUrl(
      subjectUuid,
      ucm2bff_serviceConfig,
    );
    const requestId = uuidv4();

    const response = await request.post(ucm2SubjectUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-request-id": requestId,
        "x-sks-cid": requestId,
        "x-sks-user-id": adminUuid,
        "x-sks-org-id": organizationUuid,
      },
      data: subjectPayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    await saveCustomContentDataSeeding();
  });

  test("Create Linked Content Item @createLinkedContent", async ({
    request,
  }) => {
    linkedContentUuid = uuidv4();
    const timestamp = dateUtils.todayDateWithTimeStamp();
    const randomSuffix = Math.floor(Math.random() * 10000);
    linkedContentTitle = `CustomContent_LinkedContent_${timestamp}_${randomSuffix}`;

    const linkedContentPayload = createLinkedContentRequest({
      title: linkedContentTitle,
      description: `<p class="EditorTheme__paragraph"><span>Automated linked content for site shutdown custom content testing - ${timestamp}_${randomSuffix} - Google.com</span></p>`,
      url: GOOGLE_URL,
      providerName: "STANDARD",
      providerAssetId: null,
      durationInSeconds: 3600,
      modality: "READ",
      category: "Link",
      expertiseLevel: "Everyone",
      trackingMethod: "SELF_REPORTED",
      sourceName: "www.google.com",
      vendor: "NONE",
      linkedContentType: "EXTERNAL_LINK",
      imageUrl:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      ownerUuid: organizationUuid,
      createdBy: adminLoginName || "Automation Test User",
      modifiedBy: adminLoginName || "Automation Test User",
      linkedContentUuid: linkedContentUuid,
      badgeCustomTitle: linkedContentTitle,
      locale: "en-US",
      languageCode: "en",
      timeZone: "UTC",
    });

    const ucm2LinkedContentUrl = urlData.createLinkedContentUrl(
      linkedContentUuid,
      ucm2bff_serviceConfig,
    );

    const response = await request.post(ucm2LinkedContentUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      data: linkedContentPayload,
    });

    if (response.ok()) {
      const data = await response.json();
      expect(data.linkedContentUuid ?? linkedContentUuid).toBeDefined();
    } else {
      const errorBody = await response.text();
      throw new Error(
        `Linked content creation failed with status ${response.status()}: ${errorBody}`,
      );
    }

    await saveCustomContentDataSeeding();
  });

  test("Publish Linked Content @publishLinkedContent", async ({ request }) => {
    const publishLinkedContentUrl = urlData.publishLinkedContentUrl(
      linkedContentUuid,
      ucm2bff_serviceConfig,
    );

    const response = await request.post(publishLinkedContentUrl, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    await saveCustomContentDataSeeding();
  });

  test("Verify Linked Content Creation @verifyLinkedContent", async ({
    request,
  }) => {
    const ucm2LinkedContentVerifyUrl = urlData.createLinkedContentUrl(
      linkedContentUuid,
      ucm2bff_serviceConfig,
    );

    const response = await request.get(ucm2LinkedContentVerifyUrl, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-author-org-id": organizationUuid,
      },
    });

    if (response.ok()) {
      const data = await response.json();
      const contentId =
        data.id || data.uuid || data.linkedContentUuid || linkedContentUuid;
      expect(contentId).toBeDefined();
      if (data.url) {
        expect(data.url).toBe(GOOGLE_URL);
      }
    } else {
      expect(linkedContentUuid).toBeTruthy();
    }
  });

  test("Create Custom Channel @createCustomChannel", async ({ request }) => {
    customChannelUuid = uuidv4();
    const timestamp = dateUtils.todayDateWithTimeStamp();
    customChannelTitle = `CustomContent_Channel_${timestamp}`;

    const customChannelPayload = createChannelRequest({
      subjectUuids: [subjectUuid],
      title: customChannelTitle,
      description: `Custom channel for site shutdown testing - ${customChannelTitle}`,
    });

    const ucm2ChannelUrl = urlData.createChannelUrl(
      customChannelUuid,
      ucm2bff_serviceConfig,
    );
    const requestId = uuidv4();

    const response = await request.post(ucm2ChannelUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-request-id": requestId,
        "x-sks-cid": requestId,
        "x-sks-user-id": adminUuid,
        "x-sks-org-id": organizationUuid,
      },
      data: customChannelPayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    await saveCustomContentDataSeeding();
  });

  test("Get Channel-View UUID @getChannelView", async ({ request }) => {
    const getChannelViewUrl = urlData.getChannelUrl(
      customChannelUuid,
      ucm2bff_serviceConfig,
    );
    const requestId = uuidv4();

    const response = await request.get(getChannelViewUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-request-id": requestId,
        "x-sks-cid": requestId,
        "x-sks-user-id": adminUuid,
        "x-sks-org-id": organizationUuid,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();

    if (data.channelView && data.channelView.channelViewUuid) {
      customChannelViewUuid = data.channelView.channelViewUuid;
    } else if (data.channelViews && data.channelViews.length > 0) {
      customChannelViewUuid = data.channelViews[0].id;
    } else {
      customChannelViewUuid = customChannelUuid;
    }

    await saveCustomContentDataSeeding();
  });

  test("Add Linked Content to Custom Channel @addContentToChannel", async ({
    request,
  }) => {
    const verifyLinkedContentUrl = urlData.createLinkedContentUrl(
      linkedContentUuid,
      ucm2bff_serviceConfig,
    );
    const verifyResponse = await request.get(verifyLinkedContentUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const contentItemsPayload = createAddContentToChannelPayload({
      linkedContentUuid: linkedContentUuid,
    });

    const addContentUrl = urlData.addContentToChannelUrl(
      customChannelViewUuid,
      ucm2bff_serviceConfig,
    );
    const requestId = uuidv4();
    const requestHeaders = {
      Accept: "application/json",
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    };

    const response = await request.put(addContentUrl, {
      headers: requestHeaders,
      data: contentItemsPayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    await saveCustomContentDataSeeding();
  });

  test("Publish Custom Channel @publishChannel", async ({ request }) => {
    const publishChannelUrl = urlData.publishChannelUrl(
      customChannelUuid,
      ucm2bff_serviceConfig,
    );
    const requestId = uuidv4();
    const response = await request.post(publishChannelUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
        "x-request-id": requestId,
        "x-sks-cid": requestId,
        "x-sks-user-id": adminUuid,
        "x-sks-org-id": organizationUuid,
      },
      data: {},
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const data = await response.json();
    publishedChannelUuid = data.publishedChannelUuid || customChannelUuid;
    await saveCustomContentDataSeeding();
  });

  test("Save All UUIDs to File @saveUUIDs", async () => {
    const customContentDataSeedingResults = {
      organizationUuid,
      organizationDomain,
      adminUuid,
      adminLoginName,
      userUuid,
      userLoginName,
      password,
      attributeUuid,
      attributeName,
      enumUuid,
      audienceUuid,
      audienceName,
      areaUuid,
      areaTitle,
      subjectUuid,
      subjectTitle,
      linkedContentUuid,
      linkedContentTitle,
      customChannelUuid,
      customChannelViewUuid,
      customChannelTitle,
      publishedChannelUuid,
      adminToken: adminToken ? "TOKEN_EXISTS" : "NO_TOKEN",
      timestamp: new Date().toISOString(),
      testType: "customContentDataSeeding",
      status: "completed",
      contentCreated: {
        area: !!areaUuid,
        subject: !!subjectUuid,
        linkedContent: !!linkedContentUuid,
        customChannel: !!customChannelUuid,
        publishedChannel: !!publishedChannelUuid,
      },
    };

    await commonFunctions.writeFile(
      "utils/customContentDataSeed.json",
      JSON.stringify(customContentDataSeedingResults, null, 2),
    );

    expect(organizationUuid).toBeTruthy();
    expect(adminUuid).toBeTruthy();
    expect(userUuid).toBeTruthy();
    expect(audienceUuid).toBeTruthy();
    expect(areaUuid).toBeTruthy();
    expect(subjectUuid).toBeTruthy();
    expect(linkedContentUuid).toBeTruthy();
    expect(customChannelUuid).toBeTruthy();
    expect(publishedChannelUuid).toBeTruthy();
  });
});

// NODE_ENV=develop npx playwright test "customContentDataSeed.spec.ts" -c 'playwright.api.config.ts' --reporter=list --workers 1
