import type { FullConfig } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";

async function globalSetup(_config: FullConfig): Promise<void> {
  process.env.NODE_ENV ??= "develop";
  dotenvConfig({
    path: `./config/${process.env.NODE_ENV}.json`,
    override: true,
  });
}

export default globalSetup;
