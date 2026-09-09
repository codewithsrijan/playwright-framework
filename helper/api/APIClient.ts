import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import path from "path";
import fs from "fs";

import { urlData } from "./urls";
import { tokenGeneratorApipayload } from "./payloads/tokenGeneratorPayload";
// eslint-disable-next-line @typescript-eslint/no-var-requires

import { headerData } from "./headers/headers";
import { logger } from "../../utils/logger";

export class APIClient {
  async generateToken(
    request: APIRequestContext,
    serviceConfig: {
      url: string;
      username: string;
      password: string;
      orgId: string;
      [k: string]: any;
    },
    retryCount = 0,
  ): Promise<string | undefined> {
    try {
      const res = await request.post(urlData.authenticateUrl(serviceConfig), {
        data: tokenGeneratorApipayload(
          serviceConfig.username as string,
          serviceConfig.password as string,
          serviceConfig.orgId,
        ),
        headers: { "Content-Type": "application/json" },
      });
      expect(res.status()).toBe(200);
      const token = await res.json();
      const jwtToken: string = token["id_token"];
      logger.info(
        `Admin Token has been generated in attempt ${retryCount + 1}`,
      );
      return jwtToken;
    } catch (error) {
      if (retryCount < 10) {
        logger.error(
          `Unable to generate admin token. Retrying... (Retry ${retryCount + 1} of 10)`,
        );
        logger.error(error);
        return this.generateToken(request, serviceConfig, retryCount + 1);
      } else {
        const errorMessage = `Retry limit exceeded (10 attempts). Unable to generate admin token. Error: ${error}`;
        logger.error(errorMessage);
      }
    }
  }

  static getEnvVariables(): Record<string, any> {
    const envName = process.env.NODE_ENV || "develop";
    const configPath = path.join(__dirname, "../../config", `${envName}.json`);
    if (!fs.existsSync(configPath)) {
      throw new Error(
        `Config not found: ${configPath}. Set NODE_ENV (e.g. develop) or create the file.`,
      );
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config;
  }

  async getDomainByOrgId(
    request: APIRequestContext,
    organizationUuid: string,
    serviceConfig: { url: string; [k: string]: any },
  ): Promise<string> {
    const response = await request.get(
      urlData.getOrgDetailsUrl(organizationUuid, serviceConfig),
      {
        headers: headerData.basicAuth(
          serviceConfig as unknown as { token: string },
        ),
      },
    );
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    const orgDetails = await response.json();
    return orgDetails.domain as string;
  }

  async getOrgDetailsByDomain(
    request: APIRequestContext,
    domain: string,
    serviceConfig: { url: string; [k: string]: any },
  ): Promise<string> {
    const url = urlData.getOrgDetailsByDomainUrl(domain, serviceConfig);
    const response = await request.get(url, {
      headers: headerData.basicAuth(
        serviceConfig as unknown as { token: string },
      ),
    });
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    const orgDetails = await response.json();
    return orgDetails.id as string;
  }
}
