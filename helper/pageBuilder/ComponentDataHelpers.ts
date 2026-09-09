/**
 * Page Builder Component Data Helpers
 * Handles filling component data discovered via live app exploration
 */

import { Page } from "@playwright/test";

/**
 * Data structure for card components
 */
export interface CardData {
  title?: string;
  description?: string;
  buttonLabel?: string;
  name?: string;
  role?: string;
  description2?: string;
}

/**
 * Fill text component with content
 * Targets: textarea, input[type="text"], [contenteditable="true"]
 */
export async function fillTextData(page: Page, content: string): Promise<void> {
  await page.waitForTimeout(300);
  const inputs = page.locator('textarea, input[type="text"], [contenteditable="true"]');
  const count = await inputs.count();
  if (count > 0) {
    await inputs.nth(count - 1).fill(content);
  }
}

/**
 * Fill button component label
 * Targets: input[placeholder*="label"], input[placeholder*="button"]
 */
export async function fillButtonLabel(page: Page, label: string): Promise<void> {
  await page.waitForTimeout(300);
  const inputs = page.locator('input[placeholder*="label" i], input[placeholder*="button" i]');
  if (await inputs.first().isVisible().catch(() => false)) {
    await inputs.first().fill(label);
  }
}

/**
 * Fill card component data (title, description, button label, etc.)
 * Strategy: Find inputs/textareas and fill sequentially
 */
export async function fillCardData(page: Page, data: CardData): Promise<void> {
  await page.waitForTimeout(300);

  const inputs = page.locator('input:not([type="hidden"]), textarea, [contenteditable="true"]');
  let index = 0;

  for (const value of Object.values(data)) {
    if (value && index < (await inputs.count())) {
      const input = inputs.nth(index);
      if (await input.isVisible().catch(() => false)) {
        await input.fill(String(value));
      }
      index++;
    }
  }
}

/**
 * Fill dynamic strip configuration
 * Note: Type variants to be discovered and documented
 */
export async function configureDynamicStrip(page: Page, config: Record<string, string>): Promise<void> {
  // Dialog: role="alertdialog"
  const dialog = page.locator('[role="alertdialog"]');
  if (await dialog.isVisible().catch(() => false)) {
    // Fill configuration fields based on discovered UI
    const inputs = page.locator('input, select, textarea');
    let index = 0;

    for (const value of Object.values(config)) {
      if (index < (await inputs.count())) {
        const input = inputs.nth(index);
        if (await input.isVisible().catch(() => false)) {
          await input.fill(value);
        }
        index++;
      }
    }
  }
}

/**
 * Handle component configuration dialog dismissal
 * Video, Dynamic Strip, and other dynamic components open dialogs
 */
export async function dismissConfigurationDialog(page: Page): Promise<void> {
  const dialog = page.locator('[role="dialog"], [role="alertdialog"]');
  const cancelBtn = dialog.locator('button:has-text(/^Cancel$/i)').or(
    page.locator('button[aria-label*="Close" i]')
  );

  if (await dialog.isVisible().catch(() => false)) {
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
    }
  }
}

/**
 * Validate component is visible on canvas
 * Uses data-markers: [data-marker="PageBuilder--{componentType}"]
 */
export async function assertComponentOnCanvas(page: Page, componentType: string): Promise<void> {
  const marker = `PageBuilder--${componentType}`;
  const component = page.locator(`[data-marker="${marker}"]`);
  await component.first().waitFor({ state: "visible", timeout: 10_000 });
}

/**
 * Get component data-marker names for all 14 components
 */
export const COMPONENT_MARKERS = {
  // Basic (6)
  Text: "PageBuilder--text",
  Button: "PageBuilder--button",
  Image: "PageBuilder--image",
  Video: "PageBuilder--video",
  Divider: "PageBuilder--divider",
  DynamicText: "PageBuilder--dynamicText",

  // Static Cards (4)
  ImageTextCard: "PageBuilder--imageTextCard",
  TextButtonCard: "PageBuilder--textButtonCard",
  ImageTextButtonCard: "PageBuilder--imageTextButtonCard",
  ProfileCard: "PageBuilder--profileCard",

  // Dynamic (4)
  DynamicCard: "PageBuilder--dynamicCard",
  DynamicStrip: "PageBuilder--dynamicStrip",
  PromotedContentStrip: "PageBuilder--promotedContentStrip",
  PromotedBanner: "PageBuilder--promotedBanner",
} as const;

/**
 * Design panel component sidebar IDs (confirmed from live app)
 */
export const SIDEBAR_COMPONENT_IDS = {
  Text: "sidebar-item-text",
  Button: "sidebar-item-button",
  DynamicText: "sidebar-item-dynamicText",
  TextButtonCard: "sidebar-item-card-TextButtonCard",
  ImageTextButtonCard: "sidebar-item-card-ImageTextButton",
} as const;

/**
 * Learner view URL path (discovered from app structure)
 */
export const LEARNER_VIEW_PATH = "/pages";

/**
 * Publish wizard form IDs (from live app inspection)
 */
export const PUBLISH_WIZARD_IDS = {
  pageTitle: "#pageTitle",
  pageUrl: "#pageUrl",
  hideInNav: "#shouldHideInLeftNav",
  audienceSearch: "#search",
} as const;
