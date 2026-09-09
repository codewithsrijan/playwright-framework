// spec: specs-UHS-17045/spec.md (SC-07)
// AC: AC-07 — DnD position change verified for all 14 Design tab components.
//
// DnD strategy (confirmed 2026-05-25):
//   NOT html5-native draggable, NOT dnd-kit, NOT react-beautiful-dnd.
//   Pointer-event based. Implementation uses Playwright mouse API:
//   mouse.move() → mouse.down() → slight jiggle → mouse.move(target, steps) → mouse.up()
//
// Differentiation from SC-01 (pageBuilderComponents):
//   SC-01: Component coverage — adds all 14, verifies canvas, saves to list
//   SC-07: DnD mechanics    — explicit drag gesture for all 14, then verifies
//                             canvas reorder by dragging one placed component
//                             past another and checking DOM order changes.

import { test, expect } from "../../fixtures/allureFixtures";
import { faker } from "@faker-js/faker";
import { PageBuilderListPage } from "../../pageObjects/PageBuilder/PageBuilderListPage.page";
import { PageBuilderEditorPage } from "../../pageObjects/PageBuilder/PageBuilderEditorPage.page";
import {
  PageBuilderDesignPanel,
  ALL_COMPONENT_NAMES,
} from "../../pageObjects/PageBuilder/PageBuilderDesignPanel.page";
import { Reporter } from "../../utils/Reporter";

let listPage: PageBuilderListPage;
let editorPage: PageBuilderEditorPage;
let designPanel: PageBuilderDesignPanel;

test.beforeEach(async ({ page }) => {
  listPage = new PageBuilderListPage(page);
  editorPage = new PageBuilderEditorPage(page);
  designPanel = new PageBuilderDesignPanel(page);
  await listPage.navigateDirectly();
});

test.describe("SC-07: Page Builder — Drag-and-drop component validation", () => {
  test(
    "PB-07a: Drag all 14 Design tab components from palette to canvas — verify each is placed",
    async ({ page }) => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-07: Drag-and-drop validation");
      await Reporter.setSeverity("critical");

      const pageName = `PB DnD ${faker.lorem.words(2)} ${Date.now()}`;

      // ── Create a fresh blank page ────────────────────────────────────────────
      await listPage.createNewPage(pageName);
      await editorPage.waitForEditorLoad();

      // ── Enter edit mode and open Design tab ─────────────────────────────────
      await editorPage.clickEditMode();
      await editorPage.switchToDesignTab();

      // ── Expand accordion sections before accessing Static/Dynamic components ─
      await designPanel.expandStaticSection();
      await designPanel.expandDynamicSection();

      // ── Drag each of the 14 components to the canvas ────────────────────────
      for (const componentName of ALL_COMPONENT_NAMES) {
        await designPanel.addComponent(componentName);
        await designPanel.assertComponentOnCanvas(componentName);
      }

      // ── Save the page ────────────────────────────────────────────────────────
      await editorPage.clickSave();
    },
  );

  test(
    "PB-07b: Reorder two canvas components — verify DOM position changes after drag",
    async ({ page }) => {
      await Reporter.setEpic("UCM Admin");
      await Reporter.setFeature("Page Builder");
      await Reporter.setStory("SC-07: Drag-and-drop validation");
      await Reporter.setSeverity("normal");

      const pageName = `PB DnD Reorder ${faker.lorem.words(2)} ${Date.now()}`;

      // ── Create a fresh page and enter edit mode ──────────────────────────────
      await listPage.createNewPage(pageName);
      await editorPage.waitForEditorLoad();
      await editorPage.clickEditMode();
      await editorPage.switchToDesignTab();

      // ── Add two components (Text then Image & Text Card) ─────────────────────
      // Count pre-existing Text components from the page template so we can
      // identify the NEWLY PLACED Text by index (templates have Text items).
      // Image & Text Card has no template instances — .first() is safe for that one.
      const preTextCount = await page.locator('[data-marker="PageBuilder--text"]').count();

      await designPanel.addComponent("Text");
      await designPanel.assertComponentOnCanvas("Text");

      await designPanel.expandStaticSection();
      await designPanel.addComponent("Image & Text Card");
      await designPanel.assertComponentOnCanvas("Image & Text Card");

      // ── Capture initial DOM order ────────────────────────────────────────────
      // Record the vertical positions of the two newly placed canvas components.
      // Text: use nth(preTextCount) — skips template Texts, gets the one we just placed.
      // Card: use .first() — no pre-existing imageTextCard items in template.
      const textEl = page.locator('[data-marker="PageBuilder--text"]').nth(preTextCount);
      const cardEl = page.locator('[data-marker="PageBuilder--imageTextCard"]').first();

      // Scroll the TEXT element (drag source) into view first.
      // addComponent()'s scrollToLastPlacedComponent() scrolled DOWN to the Card for
      // its screenshot — this can push the earlier-added Text element ABOVE the viewport
      // fold (negative bounding-box Y). Scrolling Text into view ensures both elements
      // are visible and their bounding-box coordinates are positive/usable.
      await textEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300); // let scroll settle

      const textBBBefore = await textEl.boundingBox();
      const cardBBBefore = await cardEl.boundingBox();

      // Sanity check: Text should be above Card (added first → higher position)
      if (textBBBefore && cardBBBefore) {
        expect(textBBBefore.y).toBeLessThan(cardBBBefore.y);
      }

      // ── Drag Text component PAST Image & Text Card (reorder) ────────────────
      // Canvas reorder uses the same pointer-event DnD mechanism as palette-to-canvas.
      // The same gesture parameters (userSelect:none + 80ms pause + 8px jiggle) are
      // required — without them the drag registers as text-selection instead.
      //
      // Drop target: BOTTOM 80% of the Card element.
      //
      // ⚠️  Semantic note (confirmed from live snapshot 2026-05-25):
      //   Text is already at position 0 (above Card at position 1).
      //   Dropping Text on the TOP half of Card means "insert Text before Card" — a no-op.
      //   To trigger an actual reorder (swap positions), we must drop Text on the
      //   BOTTOM portion of Card, which signals "insert Text AFTER Card."
      //   After the drop: Card moves to position 0, Text moves to position 1.
      if (textBBBefore && cardBBBefore) {
        const srcX = textBBBefore.x + textBBBefore.width / 2;
        const srcY = textBBBefore.y + textBBBefore.height / 2;
        // Drop target: bottom 80% of Card — signals "insert Text after Card" → swaps order
        const tgtX = cardBBBefore.x + cardBBBefore.width / 2;
        const tgtY = cardBBBefore.y + cardBBBefore.height * 0.8;

        // Mirror the proven drag-gesture pattern used in addComponent():
        //  1. Disable user-select so text-heavy canvas items don't trigger text selection.
        //  2. 80 ms pause after mouse.down() so browser registers a drag press, not a click.
        //  3. 8 px jiggle (3 steps) to cross the drag-detection threshold.
        //  4. Smooth travel to target (25 steps).
        await page.evaluate(
          () => { (document.body.style as CSSStyleDeclaration).userSelect = "none"; },
        );
        try {
          await page.mouse.move(srcX, srcY);
          await page.mouse.down();
          await page.waitForTimeout(80);
          await page.mouse.move(srcX + 8, srcY + 8, { steps: 3 });
          await page.mouse.move(tgtX, tgtY, { steps: 25 });
          await page.mouse.up();
        } finally {
          await page.evaluate(
            () => { (document.body.style as CSSStyleDeclaration).userSelect = ""; },
          );
        }

        // Allow canvas to settle after drag (animation + DOM update)
        await page.waitForTimeout(800);

        // ── Verify position change ─────────────────────────────────────────────
        const textBBAfter = await textEl.boundingBox();
        const cardBBAfter = await cardEl.boundingBox();

        if (textBBAfter && cardBBAfter) {
          // After reorder: Card moved to position 0 (above), Text moved to position 1 (below).
          // Card.y ≤ Text.y confirms the swap.
          expect(cardBBAfter.y).toBeLessThanOrEqual(textBBAfter.y);
        }
      }

      // ── Save ──────────────────────────────────────────────────────────────────
      await editorPage.clickSave();
    },
  );
});
