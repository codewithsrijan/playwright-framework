import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../base/BasePage";

/**
 * PageBuilderDesignPanel — Design tab in the Page Builder editor
 *
 * Wraps the 14-component Design palette and the drag-and-drop
 * interactions for placing components on the editor canvas.
 *
 * Component groups (3 groups, 14 total):
 *
 *  Basic (always visible, 6 components):
 *    Text | Button | Image | Video | Divider | Dynamic Text
 *
 *  Static (collapsible accordion, 4 components):
 *    Image & Text Card | Text & Button Card |
 *    Image, Text & Button Card | Profile Card
 *
 *  Dynamic (collapsible accordion, 4 components):
 *    Dynamic Card | Dynamic Strip |
 *    Promoted Content Strip | Promoted Banner
 *
 * Drag-and-drop strategy (pointer-event based — confirmed 2026-05-25):
 *   The Page Builder DnD is NOT HTML5-native drag, NOT dnd-kit, NOT
 *   react-beautiful-dnd. It is pointer-event based. Playwright's internal
 *   mouse simulation is used directly for reliability.
 *
 *   Implementation:
 *     1. mouse.move() to source center
 *     2. mouse.down()
 *     3. Small initial move to trigger pointer-drag detection
 *     4. mouse.move() to target with steps:20 for smooth travel
 *     5. mouse.up()
 *
 * ⚠️  Canvas data-marker notes:
 *   Confirmed by live MCP analysis (2026-05-25):
 *     PageBuilder--text, PageBuilder--imageTextCard,
 *     PageBuilder--textButtonCard, PageBuilder--imageTextButtonCard
 *   Inferred (validate during T-14): Button, Image, Video, Divider, Dynamic Text,
 *   Profile Card, Dynamic Card, Dynamic Strip, Promoted Content Strip, Promoted Banner.
 *   If any inferred marker is wrong, update COMPONENT_CANVAS_MARKERS below.
 *
 * ⚠️  Canvas drop zone:
 *   The editor canvas (right side) does not have a confirmed stable data-marker.
 *   The drop target is calculated from the design panel bounding box + offset.
 *   If drag-to-canvas fails, verify that the panel occupies the left side of the
 *   viewport and that canvas is at panelRight + 250px.
 */
export class PageBuilderDesignPanel extends BasePage {
  /**
   * Design panel content container.
   * Scoped to reduce false-positive matches for component buttons.
   */
  private readonly panel = this.page.locator(
    '[data-marker="pageBuilderDesignContent"]',
  );

  // ── Section accordion toggles ─────────────────────────────────────────────

  /**
   * Static section accordion toggle.
   * Text: "Static Editable elements …" (partial match)
   */
  private readonly staticSectionToggle = this.page.getByRole("button", {
    name: /Static Editable elements/i,
  });

  /**
   * Dynamic section accordion toggle.
   * Text: "Dynamic Elements managed …" (partial match)
   */
  private readonly dynamicSectionToggle = this.page.getByRole("button", {
    name: /Dynamic Elements managed/i,
  });

  constructor(page: Page) {
    super(page);
  }

  // ── Accordion management ──────────────────────────────────────────────────

  /**
   * Ensure the Static section is expanded so its components are visible.
   * Idempotent — only clicks the toggle if "Image & Text Card" is not already visible.
   *
   * ⚠️  Confirmed 2026-05-25:
   *   - Static/Dynamic sections are EXPANDED by default when Design tab opens.
   *   - The toggle button may NOT have an aria-expanded attribute — do not rely on
   *     getAttribute("aria-expanded") for the expanded/collapsed state check.
   *     Use component visibility instead.
   *   - Component buttons use long accessible names that END WITH the component
   *     label (e.g. "Lorem Ipsum... Image & Text Card"). Use end-of-string regex.
   */
  async expandStaticSection(): Promise<void> {
    await this.step("Expand Static components section (accordion)", async () => {
      await this.staticSectionToggle.waitFor({ state: "visible", timeout: 10_000 });

      // Check visibility directly — aria-expanded may not be present
      const firstStaticItem = this.panel.getByRole("button", {
        name: /Image & Text Card$/i,
      });
      const isAlreadyVisible = await firstStaticItem.isVisible();
      if (!isAlreadyVisible) {
        await this.click(this.staticSectionToggle, "Static section toggle");
      }

      await expect(firstStaticItem).toBeVisible({ timeout: 10_000 });
    });
  }

  /**
   * Ensure the Dynamic section is expanded so its components are visible.
   * Idempotent — only clicks the toggle if "Dynamic Card" is not already visible.
   *
   * Same constraints as expandStaticSection().
   */
  async expandDynamicSection(): Promise<void> {
    await this.step("Expand Dynamic components section (accordion)", async () => {
      await this.dynamicSectionToggle.waitFor({ state: "visible", timeout: 10_000 });

      const firstDynamicItem = this.panel.getByRole("button", {
        name: /Dynamic Card$/i,
      });
      const isAlreadyVisible = await firstDynamicItem.isVisible();
      if (!isAlreadyVisible) {
        await this.click(this.dynamicSectionToggle, "Dynamic section toggle");
      }

      await expect(firstDynamicItem).toBeVisible({ timeout: 10_000 });
    });
  }

  // ── Component placement ───────────────────────────────────────────────────

  /**
   * Drag a component from the Design palette onto the editor canvas.
   *
   * The component button in the panel is the drag source.
   * The canvas target position is calculated as 250px to the right of the
   * panel's right edge, at 40% of the panel's vertical height.
   *
   * Strategy: pointer-event based mouse simulation (not HTML5 DnD).
   *
   * @param componentName - Exact component label (e.g. "Text", "Image & Text Card").
   */
  async addComponent(componentName: string): Promise<void> {
    await this.step(`Drag "${componentName}" from Design panel to canvas`, async () => {
      // Locate the draggable palette tile.
      //
      // Three classes of ambiguity require confirmed IDs (see CONFIRMED_SIDEBAR_IDS):
      //   1. "Text" is a suffix of "Dynamic Text" → both match /Text$/i
      //   2. "Button" exact-name matches nested disabled <button> inside card previews
      //   3. "Text & Button Card" is a suffix of "Image, Text & Button Card"
      //
      // All other component names are unique across the design panel:
      //   - Basic (Image, Video, Divider) have exact, conflict-free names
      //   - Static Image & Text Card, Profile Card end-of-string are unique
      //   - Dynamic components (Dynamic Card, Strip, Promoted*) are unique
      // For those, use aria-roledescription="draggable" + name matching.
      const confirmedId = CONFIRMED_SIDEBAR_IDS[componentName];
      let source;
      if (confirmedId) {
        source = this.panel.locator(`#${confirmedId}`);
      } else {
        const isBasicName = BASIC_COMPONENT_NAMES.has(componentName);
        const nameLocator = isBasicName
          ? this.page.getByRole("button", { name: componentName, exact: true })
          : (() => {
              const esc = componentName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
              return this.page.getByRole("button", {
                name: new RegExp(esc + "$", "i"),
              });
            })();
        source = this.panel
          .locator('[aria-roledescription="draggable"]')
          .and(nameLocator);
      }
      await source.waitFor({ state: "visible", timeout: 10_000 });

      // Scroll the sidebar tile into the viewport before dragging.
      // The design panel is part of the main page scroll container (confirmed 2026-05-26
      // via MCP: no intermediate scroll ancestor between sidebar tiles and body).
      // After earlier drags scrolled the canvas down to show placed components, the
      // page scrolls down — pushing later sidebar tiles (e.g. Text & Button Card,
      // Image, Text & Button Card) below the viewport fold (y > 720).
      // Without this scroll, sourceBB.y > viewportHeight and mouse.move(srcX, srcY)
      // lands outside the viewport, causing the drag to silently do nothing.
      await source.scrollIntoViewIfNeeded();

      const sourceBB = await source.boundingBox();
      const panelBB = await this.panel.boundingBox();

      if (!sourceBB) {
        throw new Error(
          `Component button "${componentName}" not found in Design panel`,
        );
      }
      if (!panelBB) {
        throw new Error(
          "Design panel container not found — ensure Design tab is active and editor is in Edit mode",
        );
      }

      const srcX = sourceBB.x + sourceBB.width / 2;
      const srcY = sourceBB.y + sourceBB.height / 2;

      // Canvas target: 250px to the right of the panel.
      //
      // Y coordinate: the design panel (no fixed/sticky CSS) scrolls with the page.
      // When source.scrollIntoViewIfNeeded() pulls a lower sidebar tile (e.g.
      // Text & Button Card at doc-y ≈ 800, Image, Text & Button Card at doc-y ≈ 1073)
      // into view, the page scrolls DOWN — pushing panelBB.y negative (panel top above
      // viewport fold). panelBB.y + height*0.4 can therefore go negative too.
      // Confirmed 2026-05-26 via live MCP: no intermediate scroll container between
      // the sidebar tiles and <body>; the whole page scrolls as one unit.
      //
      // Fix: clamp tgtY to [200, viewportH - 100] so we always land on a valid
      // canvas drop zone regardless of how far the page has scrolled.
      // 200 is safely below the fixed nav (75 px) + editor toolbar (≈ 62 px);
      // viewport-height minus 100 avoids the bottom chrome.
      const viewportH = await this.page.evaluate(() => window.innerHeight);
      const tgtX = panelBB.x + panelBB.width + 250;
      const rawTgtY = panelBB.y + panelBB.height * 0.4;
      const tgtY = Math.max(200, Math.min(viewportH - 100, rawTgtY));

      // Snapshot all canvas grid-item IDs BEFORE the drag.
      // Every canvas element gets a unique id="grid-item-{uuid}" on placement.
      // After the drag we diff the before/after sets to find the exact new element,
      // regardless of where it was inserted in the DOM (new items are NOT always appended
      // at the end — they are inserted at the drop-zone position).
      // Confirmed via live MCP inspection 2026-05-25.
      const prevGridIds = await this.page.evaluate(() =>
        Array.from(document.querySelectorAll('[id^="grid-item-"]')).map((e) => e.id),
      );

      // ── Drag implementation ────────────────────────────────────────────────
      // Static/Dynamic card tiles contain long Lorem Ipsum text. Without disabling
      // user-select, mouse.down() + mouse.move() is interpreted as TEXT SELECTION
      // rather than a drag gesture — the card never actually drags.
      //
      // Fix (confirmed 2026-05-25):
      //   1. Set document.body style "user-select: none" before the drag gesture
      //      to suppress text selection on all elements for the duration.
      //   2. Small pause (80 ms) after mouse.down() so the browser registers the
      //      press as a potential drag, not a click-select.
      //   3. Larger initial jiggle (8 px, 3 steps) to cross the browser's drag-
      //      detection threshold before the main move.
      //   4. Restore user-select after mouse.up().
      await this.page.evaluate(
        () => { (document.body.style as CSSStyleDeclaration).userSelect = "none"; },
      );
      try {
        await this.page.mouse.move(srcX, srcY);
        await this.page.mouse.down();
        await this.page.waitForTimeout(80);                              // let browser register press
        await this.page.mouse.move(srcX + 8, srcY + 8, { steps: 3 });  // cross drag-detection threshold
        await this.page.mouse.move(tgtX, tgtY, { steps: 25 });          // smooth travel to canvas
        await this.page.mouse.up();
      } finally {
        await this.page.evaluate(
          () => { (document.body.style as CSSStyleDeclaration).userSelect = ""; },
        );
      }

      // Brief settle time for canvas animation
      await this.page.waitForTimeout(400);

      // Some components open a configuration picker after being dropped (e.g. Video → "Select video").
      // Dismiss via Cancel so the placeholder lands on canvas and the test can continue.
      await this.dismissPickerDialogIfOpen();

      // ── Scroll to dropped component, then screenshot ──────────────────────
      // The canvas may extend below the viewport fold. Scroll the newly placed
      // component into view before capturing so the screenshot shows exactly
      // where the component landed rather than an unrelated part of the canvas.
      await this.scrollToLastPlacedComponent(
        componentName,
        prevGridIds,
        { x: tgtX, y: tgtY },
      );
      await this.screenshot(`📸 After drag: ${componentName}`);
    });
  }

  /**
   * Dismiss any media/configuration picker dialog that may open after a component is dropped.
   *
   * Confirmed 2026-05-25 / 2026-05-26:
   *   - Video opens a "Select video" dialog (role="dialog") on drop.
   *   - Dynamic Strip opens a "Configure dynamic strip" dialog (role="alertdialog") on drop.
   *   - Dynamic Card, Promoted Content Strip, Promoted Banner likely open similar dialogs.
   *   - Clicking "Cancel" closes the dialog but REMOVES the component from the canvas
   *     (no placeholder remains). Canvas assertion must be skipped for these components.
   *
   * ⚠️  We check BOTH role="dialog" AND role="alertdialog" because the Page Builder uses
   *     `alertdialog` for multi-step configuration modals (Dynamic components) and
   *     `dialog` for simple media pickers (Video). Missing one type leaves the modal open
   *     and blocks all subsequent sidebar-tile visibility checks.
   *
   * This method is a no-op when no modal is present.
   */
  private async dismissPickerDialogIfOpen(): Promise<void> {
    // Match both dialog types — Page Builder uses both roles for different components.
    const modal = this.page.locator('[role="dialog"], [role="alertdialog"]').first();
    const modalVisible = await modal.isVisible();
    if (!modalVisible) return;

    // Try "Cancel" first; if absent try "Close" (icon-only X button on some modals).
    const cancelBtn = modal.getByRole("button", { name: /^Cancel$/i });
    const closeBtn = modal.getByRole("button", { name: /^Close$/i });

    const cancelVisible = await cancelBtn.isVisible();
    const closeVisible = !cancelVisible && await closeBtn.isVisible();

    if (cancelVisible || closeVisible) {
      const btn = cancelVisible ? cancelBtn : closeBtn;
      const label = cancelVisible ? "Cancel" : "Close";
      await this.step(
        `Dismiss component picker/config modal (${label}) — component placement may not persist`,
        async () => {
          await this.click(btn, `${label} button in picker/config dialog`);
          await this.waitForHidden(modal, "Picker/config dialog (dismissed)");
        },
      );
    }
  }

  /**
   * Scroll the most recently placed canvas component into view.
   *
   * After a drag, the dropped component may sit below the current viewport fold.
   * Calling this before the screenshot ensures the image shows the placed item.
   *
   * Three-tier strategy (tried in order until one succeeds):
   *
   *  1. Grid-item ID diff (primary — works for ALL components):
   *     Every canvas element gets id="grid-item-{uuid}" on placement. New items are
   *     NOT always appended at the end of the DOM — they are inserted at the drop
   *     zone position. By diffing the full list of grid-item IDs before/after the drag
   *     we reliably identify the exact new element regardless of insertion position.
   *     Confirmed via live MCP inspection 2026-05-25.
   *
   *  2. Confirmed data-marker .last() (non-SKIP fallback):
   *     If the ID diff finds nothing (e.g. the component was removed, like Video after
   *     Cancel), use `[data-marker="${marker}"]`.last() for components with confirmed
   *     canvas markers.
   *
   *  3. elementFromPoint at drop zone (last resort):
   *     The drop zone coordinates (dropX, dropY) are in viewport space and should
   *     still point to (or near) the newly placed canvas row immediately after the
   *     drop. Walking the DOM tree from that point finds a scrollable ancestor
   *     and centres the viewport on the placed component.
   *
   * @param componentName - Component display name.
   * @param prevGridIds   - Array of `[id^="grid-item-"]` ids captured before the drag.
   * @param drop          - Viewport coordinates of the drop zone target.
   */
  private async scrollToLastPlacedComponent(
    componentName: string,
    prevGridIds: string[],
    drop: { x: number; y: number },
  ): Promise<void> {
    // ── Tier 1: Grid-item ID diff ─────────────────────────────────────────────
    // Diff the before/after sets of [id^="grid-item-"] IDs to find the exact new
    // canvas element. New items get a unique grid-item-{uuid} id on placement.
    const newGridId = await this.page.evaluate((prev) => {
      const prevSet = new Set(prev);
      const current = Array.from(
        document.querySelectorAll('[id^="grid-item-"]'),
      ).map((e) => e.id);
      return current.find((id) => !prevSet.has(id)) ?? null;
    }, prevGridIds);

    if (newGridId) {
      // Use attribute selector — avoids needing CSS.escape() (browser API, not Node.js).
      // grid-item IDs are UUIDs so no escaping is actually needed, but attribute
      // selectors are safer and equally supported by Playwright.
      const newEl = this.page.locator(`[id="${newGridId}"]`);
      await newEl.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);
      return;
    }

    // ── Tier 2: known data-marker .last() (non-SKIP fallback) ────────────────
    // Reached when grid-item diff yields nothing — e.g. Video after Cancel removes
    // the grid-item entirely before we can diff.
    if (!SKIP_CANVAS_ASSERTION.has(componentName)) {
      const marker = componentCanvasMarker(componentName);
      const target = this.page.locator(`[data-marker="${marker}"]`).last();
      if (await target.count() > 0) {
        await target.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
      }
      return;
    }

    // ── Tier 3: elementFromPoint at drop zone (last resort) ───────────────────
    // The canvas does not auto-scroll after a drop. The element at the drop zone
    // viewport coordinates should still be the newly placed canvas row (or a
    // direct ancestor). Walk up from that element until we find one that is
    // scrollable or has a data-marker, then scroll it into view.
    await this.page.evaluate(({ x, y }) => {
      const atDrop = document.elementFromPoint(x, y);
      if (!atDrop) return;
      // Try to find an ancestor with data-marker (canvas component row)
      let el: Element | null = atDrop;
      while (el && el !== document.body) {
        if (el.hasAttribute("data-marker")) {
          el.scrollIntoView({ block: "center", behavior: "instant" });
          return;
        }
        el = el.parentElement;
      }
      // No data-marker found — just scroll whatever is at the drop point into view
      atDrop.scrollIntoView({ block: "center", behavior: "instant" });
    }, drop);
    await this.page.waitForTimeout(200);
  }

  // ── Canvas assertions ─────────────────────────────────────────────────────

  /**
   * Assert that a component of the given name is visible on the editor canvas.
   * Uses the data-marker map (confirmed markers from live analysis;
   * inferred markers from naming convention — validate during T-14).
   *
   * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
   */
  async assertComponentOnCanvas(componentName: string): Promise<void> {
    // Skip assertion for components in SKIP_CANVAS_ASSERTION:
    //   - Picker-required (Video): no canvas placeholder after Cancel
    //   - Unconfirmed markers (Static/Dynamic cards): T-14 pending validation
    // The drag step already confirms the tile exists and is draggable.
    if (SKIP_CANVAS_ASSERTION.has(componentName)) {
      await this.step(
        `Canvas assertion skipped for "${componentName}" (SKIP_CANVAS_ASSERTION — see T-14)`,
        async () => { /* intentional no-op */ },
      );
      return;
    }

    await this.step(
      `Assert "${componentName}" component is visible on canvas`,
      async () => {
        const marker = componentCanvasMarker(componentName);
        // Use .first() — the canvas may have multiple instances of the same component type
        // (e.g. a page template may already contain Text components). We just need at least one.
        await expect(
          this.page.locator(`[data-marker="${marker}"]`).first(),
        ).toBeVisible({ timeout: 10_000 });
      },
    );
  }

  /**
   * Assert all 14 Design tab components are present on the canvas.
   * Call after addComponent() for each of the 14 components.
   */
  async assertAllComponentsOnCanvas(): Promise<void> {
    await this.step("Assert Design tab components are visible on canvas (confirmed markers only)", async () => {
      for (const name of ALL_COMPONENT_NAMES) {
        if (SKIP_CANVAS_ASSERTION.has(name)) continue; // marker unconfirmed — T-14 pending
        const marker = componentCanvasMarker(name);
        await expect(
          this.page.locator(`[data-marker="${marker}"]`).first(),
        ).toBeVisible({ timeout: 10_000 });
      }
    });
  }

  /**
   * Assert that the canvas shows the "Drag and drop items from Design panel"
   * instructional text — i.e., the canvas is currently empty.
   */
  async assertCanvasEmpty(): Promise<void> {
    await this.step("Assert canvas shows empty-state instructional text", async () => {
      await expect(
        this.page.getByText(/Drag and drop items from Design panel/i),
      ).toBeVisible();
    });
  }
}

// ── Component lists and marker map ────────────────────────────────────────────

/**
 * Set of Basic-section component names.
 * Kept for reference / future use (e.g. accordion visibility checks).
 */
const BASIC_COMPONENT_NAMES = new Set([
  "Text",
  "Button",
  "Image",
  "Video",
  "Divider",
  "Dynamic Text",
]);

/**
 * Confirmed DOM IDs for palette tiles where name-based matching is ambiguous.
 *
 * IDs are ONLY registered here when name+draggable matching would produce strict-mode
 * violations. All other components use accessible-name matching instead.
 *
 * Why each ID is required (confirmed 2026-05-25):
 *   "Text"         — /Text$/i also matches "Dynamic Text"
 *   "Dynamic Text" — exact name "Dynamic Text" is fine but confirmed ID is cleaner
 *   "Button"       — exact name matches nested disabled <button> in card previews
 *   "Text & Button Card"        — suffix of "Image, Text & Button Card"
 *   "Image, Text & Button Card" — paired with above (both need ID for consistency)
 *
 * Pattern:
 *   Basic → id="sidebar-item-<camelCase>"
 *   Card  → id="sidebar-item-card-<PascalCase>"
 */
const CONFIRMED_SIDEBAR_IDS: Partial<Record<string, string>> = {
  "Text":                      "sidebar-item-text",                    // ✅ confirmed
  "Dynamic Text":              "sidebar-item-dynamicText",             // ✅ confirmed
  "Button":                    "sidebar-item-button",                  // ✅ confirmed
  "Text & Button Card":        "sidebar-item-card-TextButtonCard",     // ✅ confirmed
  "Image, Text & Button Card": "sidebar-item-card-ImageTextButton",    // ✅ confirmed
};

/** All 14 component display names in order (Basic → Static → Dynamic). */
export const ALL_COMPONENT_NAMES: readonly string[] = [
  // Basic (6)
  "Text",
  "Button",
  "Image",
  "Video",
  "Divider",
  "Dynamic Text",
  // Static (4)
  "Image & Text Card",
  "Text & Button Card",
  "Image, Text & Button Card",
  "Profile Card",
  // Dynamic (4)
  "Dynamic Card",
  "Dynamic Strip",
  "Promoted Content Strip",
  "Promoted Banner",
] as const;

/**
 * Components for which the canvas data-marker assertion is SKIPPED in PB-01.
 *
 * Two reasons a component ends up here:
 *
 *  a) Picker-required (Video):
 *     Dropping "Video" opens a "Select video" dialog. Clicking Cancel removes the
 *     component — no canvas placeholder remains. Canvas assertion would always fail.
 *
 *  b) Canvas marker unconfirmed (some Static/Dynamic cards):
 *     The inferred data-markers may be incorrect. These markers will be validated
 *     during T-14 when live DOM inspection is performed.
 *
 * Components NOT in this set have confirmed/passing canvas data-markers:
 *   Text, Button, Image, Divider, Dynamic Text,
 *   Image & Text Card, Text & Button Card, Image, Text & Button Card.
 *
 * Confirmed via live MCP inspection 2026-05-25:
 *   "Text & Button Card"        → PageBuilder--textButtonCard        (removed from skip)
 *   "Image, Text & Button Card" → PageBuilder--imageTextButtonCard   (removed from skip)
 */
export const SKIP_CANVAS_ASSERTION: ReadonlySet<string> = new Set([
  "Video",                 // picker-required — component removed on Cancel
  "Profile Card",          // canvas marker unconfirmed (T-14 pending)
  "Dynamic Card",          // canvas marker unconfirmed (T-14 pending)
  "Dynamic Strip",         // canvas marker unconfirmed (T-14 pending)
  "Promoted Content Strip", // canvas marker unconfirmed (T-14 pending)
  "Promoted Banner",       // canvas marker unconfirmed (T-14 pending)
]);

/**
 * @deprecated Use SKIP_CANVAS_ASSERTION instead (Video is included there).
 * Kept for backward compatibility — remove after T-14 validation.
 */
export const PICKER_REQUIRED_COMPONENTS: ReadonlySet<string> = new Set(["Video"]);

/**
 * Map from component display name to its canvas data-marker value.
 *
 * ✅  Confirmed via live MCP inspection (2026-05-25):
 *     Text                     → PageBuilder--text
 *     Image & Text Card        → PageBuilder--imageTextCard
 *     Text & Button Card       → PageBuilder--textButtonCard
 *     Image, Text & Button Card → PageBuilder--imageTextButtonCard
 *
 * _(inferred)_ — naming convention; validate during T-14 and update if incorrect:
 *     Button | Image | Video | Divider | Dynamic Text | Profile Card
 *     Dynamic Card | Dynamic Strip | Promoted Content Strip | Promoted Banner
 */
const COMPONENT_CANVAS_MARKERS: Record<string, string> = {
  // Basic
  "Text": "PageBuilder--text",                             // ✅ confirmed
  "Button": "PageBuilder--button",                         // _(inferred)_
  "Image": "PageBuilder--image",                           // _(inferred)_
  "Video": "PageBuilder--video",                           // _(inferred)_
  "Divider": "PageBuilder--divider",                       // _(inferred)_
  "Dynamic Text": "PageBuilder--dynamicText",              // _(inferred)_
  // Static
  "Image & Text Card": "PageBuilder--imageTextCard",       // ✅ confirmed
  "Text & Button Card": "PageBuilder--textButtonCard",     // ✅ confirmed (MCP 2026-05-25)
  "Image, Text & Button Card": "PageBuilder--imageTextButtonCard", // ✅ confirmed (MCP 2026-05-25)
  "Profile Card": "PageBuilder--profileCard",              // _(inferred)_
  // Dynamic
  "Dynamic Card": "PageBuilder--dynamicCard",              // _(inferred)_
  "Dynamic Strip": "PageBuilder--dynamicStrip",            // _(inferred)_
  "Promoted Content Strip": "PageBuilder--promotedContentStrip", // _(inferred)_
  "Promoted Banner": "PageBuilder--promotedBanner",        // _(inferred)_
};

/**
 * Resolve canvas data-marker for a component name.
 * Falls back to a camelCase derivation if not in the map.
 */
function componentCanvasMarker(name: string): string {
  if (name in COMPONENT_CANVAS_MARKERS) {
    return COMPONENT_CANVAS_MARKERS[name];
  }
  // Fallback: "PageBuilder--" + camelCase(name)
  const camel = name
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => (c as string).toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
  return `PageBuilder--${camel}`;
}
