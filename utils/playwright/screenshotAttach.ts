import type { Page, TestInfo } from "@playwright/test";

/** Viewport screenshot attached to HTML + Allure (via testInfo.attach). */
export async function attachViewportPng(
  page: Page,
  testInfo: TestInfo,
  attachmentName: string,
): Promise<void> {
  const buffer = await page.screenshot({ fullPage: false });
  await testInfo.attach(attachmentName, {
    body: buffer,
    contentType: "image/png",
  });
}
