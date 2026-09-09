import { test as base, expect } from "./allureFixtures";
import { LoginPage } from "../pageObjects/LoginPage.page";
import { getFrontendConfig } from "../utils/frontendConfig";

type LoginFixture = {
  loginFixture: LoginPage;
  lognToPageFixture: LoginPage;
};

export const test = base.extend<LoginFixture>({
  loginFixture: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  lognToPageFixture: async ({ page }, use) => {
    const serviceConfig = getFrontendConfig();
    const loginpage = new LoginPage(page);
    // Reporter is resolved automatically via ReporterRegistry inside LoginPage
    await loginpage.openPercipio(serviceConfig);
    await loginpage.login({
      basicUser: serviceConfig.basicUser,
      basicPassword: serviceConfig.basicPassword,
    });
    await use(loginpage);
  },
});
export { expect };
