import { APIClient } from "../helper/api/APIClient";

export type FrontendServiceConfig = {
  url: string;
  basicUser: string;
  basicPassword: string;
};

/** Default UI host for develop (plat3-complete); override with PLAYWRIGHT_BASE_URL. */
export const DEFAULT_FRONTEND_URL =
  "https://plat3-complete.front.develop.squads-dev.com";

/**
 * UI login config from `config/<NODE_ENV>.json` → `frontend`, with env overrides:
 * - PLAYWRIGHT_BASE_URL / BASE_URL → url
 * - FRONTEND_BASIC_USER / FRONTEND_BASIC_PASSWORD → credentials
 */
export function getFrontendConfig(options?: {
  defaultUrl?: string;
}): FrontendServiceConfig {
  const envName = process.env.NODE_ENV || "develop";
  const env = APIClient.getEnvVariables() as Record<string, unknown>;
  const fromFile = env["frontend"] as Partial<FrontendServiceConfig> | undefined;

  const url =
    process.env.PLAYWRIGHT_BASE_URL?.trim() ||
    process.env.BASE_URL?.trim() ||
    fromFile?.url?.trim() ||
    options?.defaultUrl ||
    DEFAULT_FRONTEND_URL;

  const basicUser =
    process.env.FRONTEND_BASIC_USER?.trim() || fromFile?.basicUser?.trim() || "";
  const basicPassword =
    process.env.FRONTEND_BASIC_PASSWORD?.trim() ||
    fromFile?.basicPassword?.trim() ||
    "";

  if (!basicUser || !basicPassword) {
    throw new Error(
      `Missing UI login credentials for NODE_ENV=${envName}. ` +
        `Add "frontend": { "url", "basicUser", "basicPassword" } to config/${envName}.json ` +
        `(see config/${envName}.json.template), or set FRONTEND_BASIC_USER and FRONTEND_BASIC_PASSWORD. ` +
        `Optional: PLAYWRIGHT_BASE_URL (default host: ${DEFAULT_FRONTEND_URL}).`,
    );
  }

  return { url, basicUser, basicPassword };
}
