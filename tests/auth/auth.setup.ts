import { test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LoginPage } from "../../pageObjects/LoginPage.page";
import { getFrontendConfig } from "../../utils/frontendConfig";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Ensure the .auth directory exists.
  // It is gitignored so it will not exist on a fresh Jenkins/CI workspace.
  // storageState() throws ENOENT if the parent directory is missing.
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const frontendConfig = getFrontendConfig();
  const loginPage = new LoginPage(page);
  // Reporter is resolved automatically via ReporterRegistry inside LoginPage
  await loginPage.openPercipio(frontendConfig as { url: string });
  await loginPage.login(
    frontendConfig as { basicUser: string; basicPassword: string },
  );
  await page.context().storageState({ path: authFile });
});
