# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderComponents.spec.ts >> SC-01: Page Builder — Design tab component coverage >> PB-01: Add all 14 Design tab components to a new page and verify each appears on canvas
- Location: tests/PageBuilder/pageBuilderComponents.spec.ts:27:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-marker="PageBuilder--textButtonCard"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-marker="PageBuilder--textButtonCard"]').first()

```

```yaml
- main:
  - button "Back to Page Builder main"
  - heading "PB Components dicta aedificium 1779772921191" [level=1]
  - list:
    - listitem:
      - button
    - listitem:
      - button [disabled]
    - listitem:
      - button "Edit"
      - button "Preview"
    - listitem:
      - button "Revert"
    - listitem:
      - button "Save"
    - listitem:
      - button "Publish"
  - tablist:
    - tab "Pages"
    - tab "Design" [selected]
  - tabpanel "Design":
    - text: Basic
    - button "Text":
      - img
      - text: Text
    - button "Button":
      - img
      - text: Button
    - button "Image":
      - img
      - text: Image
    - button "Video":
      - img
      - text: Video
    - button "Divider":
      - img
      - text: Divider
    - button "Dynamic Text":
      - img
      - text: Dynamic Text
    - button "Static Editable elements with images, text, and buttons in various combinations.":
      - text: Static
      - button
      - text: Editable elements with images, text, and buttons in various combinations.
    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo Image & Text Card":
      - heading "Lorem Ipsum Dolor Sit Amet" [level=3]
      - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo Image & Text Card
    - button "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna Button Text & Button Card":
      - heading "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing" [level=3]
      - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
      - button "Button" [disabled]
      - text: Text & Button Card
    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Image, Text & Button Card":
      - heading "Lorem Ipsum Dolor Sit Amet" [level=3]
      - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit
      - button "Button" [disabled]
      - text: Image, Text & Button Card
    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Profile Card":
      - heading "Lorem Ipsum Dolor Sit Amet" [level=3]
      - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit
      - button "Button" [disabled]
      - text: Profile Card
    - button "Dynamic Elements managed outside the builder, ready to use on your pages.":
      - text: Dynamic
      - button
      - text: Elements managed outside the builder, ready to use on your pages.
    - button "DYNAMIC CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Card"
    - button "Recommendations strip title Tab Label Tab Label Tab Label CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Strip":
      - text: Recommendations strip title Tab Label Tab Label Tab Label CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
      - img
      - text: Dynamic Strip
    - button "Content strip title CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur Promoted Content Strip":
      - text: Content strip title
      - img
      - text: CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur
      - img
      - text: Promoted Content Strip
    - button "Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Promoted Banner"
  - 'button "Welcome to the Academy: Your Gateway to Growth & Success"':
    - 'heading "Welcome to the Academy: Your Gateway to Growth & Success" [level=1]'
  - button "The Academy is your centralized resource for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities. Choose your function from the options below to begin exploring your learning and growth opportunities.":
    - paragraph:
      - text: The Academy is your
      - strong: centralized resource
      - text: for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities.
      - strong: Choose your function from the options below to begin exploring your learning and growth opportunities.
  - button "Lorem ipsum dolor sit amet test"
  - 'button "Greetings, {Name}! Explore, discover, and master new skills."':
    - paragraph: "Greetings, {Name}! Explore, discover, and master new skills."
  - button "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt":
    - heading "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed" [level=3]
    - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  - button
  - button
  - button "Label":
    - button "Label" [disabled]
  - button "Digital Academy Master essential and advanced digital skills to stay ahead.":
    - heading "Digital Academy" [level=3]
    - text: Master essential and advanced digital skills to stay ahead.
  - button "Data Science Academy Learn to analyze, visualize, and derive insights from data to drive better decisions.":
    - heading "Data Science Academy" [level=3]
    - text: Learn to analyze, visualize, and derive insights from data to drive better decisions.
  - button "Cybersecurity Academy Master skills to secure data, manage risks, and defend against cyber threats.":
    - heading "Cybersecurity Academy" [level=3]
    - text: Master skills to secure data, manage risks, and defend against cyber threats.
  - button "Cloud Engineering Academy Explore cloud computing and learn to implement scalable solutions":
    - heading "Cloud Engineering Academy" [level=3]
    - text: Explore cloud computing and learn to implement scalable solutions
  - button "Sales Academy Gain skills and strategies to drive revenue and build client relationships.":
    - heading "Sales Academy" [level=3]
    - text: Gain skills and strategies to drive revenue and build client relationships.
  - button "Global Marketing Academy Learn to engage diverse audiences with innovative marketing.":
    - heading "Global Marketing Academy" [level=3]
    - text: Learn to engage diverse audiences with innovative marketing.
  - button "Product Management Academy Create and optimize products that drive success and meet customer needs.":
    - heading "Product Management Academy" [level=3]
    - text: Create and optimize products that drive success and meet customer needs.
  - button "Logistics & Supply Academy Boost efficiency and resilience in supply chain management.":
    - heading "Logistics & Supply Academy" [level=3]
    - text: Boost efficiency and resilience in supply chain management.
  - status: Draggable item card-ImageTextCard was dropped over droppable area 4b79bf10-0e94-4172-8618-7304f9cc9cb0
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
  312 |    *     still point to (or near) the newly placed canvas row immediately after the
  313 |    *     drop. Walking the DOM tree from that point finds a scrollable ancestor
  314 |    *     and centres the viewport on the placed component.
  315 |    *
  316 |    * @param componentName - Component display name.
  317 |    * @param prevGridIds   - Array of `[id^="grid-item-"]` ids captured before the drag.
  318 |    * @param drop          - Viewport coordinates of the drop zone target.
  319 |    */
  320 |   private async scrollToLastPlacedComponent(
  321 |     componentName: string,
  322 |     prevGridIds: string[],
  323 |     drop: { x: number; y: number },
  324 |   ): Promise<void> {
  325 |     // ── Tier 1: Grid-item ID diff ─────────────────────────────────────────────
  326 |     // Diff the before/after sets of [id^="grid-item-"] IDs to find the exact new
  327 |     // canvas element. New items get a unique grid-item-{uuid} id on placement.
  328 |     const newGridId = await this.page.evaluate((prev) => {
  329 |       const prevSet = new Set(prev);
  330 |       const current = Array.from(
  331 |         document.querySelectorAll('[id^="grid-item-"]'),
  332 |       ).map((e) => e.id);
  333 |       return current.find((id) => !prevSet.has(id)) ?? null;
  334 |     }, prevGridIds);
  335 | 
  336 |     if (newGridId) {
  337 |       // Use attribute selector — avoids needing CSS.escape() (browser API, not Node.js).
  338 |       // grid-item IDs are UUIDs so no escaping is actually needed, but attribute
  339 |       // selectors are safer and equally supported by Playwright.
  340 |       const newEl = this.page.locator(`[id="${newGridId}"]`);
  341 |       await newEl.scrollIntoViewIfNeeded();
  342 |       await this.page.waitForTimeout(200);
  343 |       return;
  344 |     }
  345 | 
  346 |     // ── Tier 2: known data-marker .last() (non-SKIP fallback) ────────────────
  347 |     // Reached when grid-item diff yields nothing — e.g. Video after Cancel removes
  348 |     // the grid-item entirely before we can diff.
  349 |     if (!SKIP_CANVAS_ASSERTION.has(componentName)) {
  350 |       const marker = componentCanvasMarker(componentName);
  351 |       const target = this.page.locator(`[data-marker="${marker}"]`).last();
  352 |       if (await target.count() > 0) {
  353 |         await target.scrollIntoViewIfNeeded();
  354 |         await this.page.waitForTimeout(200);
  355 |       }
  356 |       return;
  357 |     }
  358 | 
  359 |     // ── Tier 3: elementFromPoint at drop zone (last resort) ───────────────────
  360 |     // The canvas does not auto-scroll after a drop. The element at the drop zone
  361 |     // viewport coordinates should still be the newly placed canvas row (or a
  362 |     // direct ancestor). Walk up from that element until we find one that is
  363 |     // scrollable or has a data-marker, then scroll it into view.
  364 |     await this.page.evaluate(({ x, y }) => {
  365 |       const atDrop = document.elementFromPoint(x, y);
  366 |       if (!atDrop) return;
  367 |       // Try to find an ancestor with data-marker (canvas component row)
  368 |       let el: Element | null = atDrop;
  369 |       while (el && el !== document.body) {
  370 |         if (el.hasAttribute("data-marker")) {
  371 |           el.scrollIntoView({ block: "center", behavior: "instant" });
  372 |           return;
  373 |         }
  374 |         el = el.parentElement;
  375 |       }
  376 |       // No data-marker found — just scroll whatever is at the drop point into view
  377 |       atDrop.scrollIntoView({ block: "center", behavior: "instant" });
  378 |     }, drop);
  379 |     await this.page.waitForTimeout(200);
  380 |   }
  381 | 
  382 |   // ── Canvas assertions ─────────────────────────────────────────────────────
  383 | 
  384 |   /**
  385 |    * Assert that a component of the given name is visible on the editor canvas.
  386 |    * Uses the data-marker map (confirmed markers from live analysis;
  387 |    * inferred markers from naming convention — validate during T-14).
  388 |    *
  389 |    * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
  390 |    */
  391 |   async assertComponentOnCanvas(componentName: string): Promise<void> {
  392 |     // Skip assertion for components in SKIP_CANVAS_ASSERTION:
  393 |     //   - Picker-required (Video): no canvas placeholder after Cancel
  394 |     //   - Unconfirmed markers (Static/Dynamic cards): T-14 pending validation
  395 |     // The drag step already confirms the tile exists and is draggable.
  396 |     if (SKIP_CANVAS_ASSERTION.has(componentName)) {
  397 |       await this.step(
  398 |         `Canvas assertion skipped for "${componentName}" (SKIP_CANVAS_ASSERTION — see T-14)`,
  399 |         async () => { /* intentional no-op */ },
  400 |       );
  401 |       return;
  402 |     }
  403 | 
  404 |     await this.step(
  405 |       `Assert "${componentName}" component is visible on canvas`,
  406 |       async () => {
  407 |         const marker = componentCanvasMarker(componentName);
  408 |         // Use .first() — the canvas may have multiple instances of the same component type
  409 |         // (e.g. a page template may already contain Text components). We just need at least one.
  410 |         await expect(
  411 |           this.page.locator(`[data-marker="${marker}"]`).first(),
> 412 |         ).toBeVisible({ timeout: 10_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  413 |       },
  414 |     );
  415 |   }
  416 | 
  417 |   /**
  418 |    * Assert all 14 Design tab components are present on the canvas.
  419 |    * Call after addComponent() for each of the 14 components.
  420 |    */
  421 |   async assertAllComponentsOnCanvas(): Promise<void> {
  422 |     await this.step("Assert Design tab components are visible on canvas (confirmed markers only)", async () => {
  423 |       for (const name of ALL_COMPONENT_NAMES) {
  424 |         if (SKIP_CANVAS_ASSERTION.has(name)) continue; // marker unconfirmed — T-14 pending
  425 |         const marker = componentCanvasMarker(name);
  426 |         await expect(
  427 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  428 |         ).toBeVisible({ timeout: 10_000 });
  429 |       }
  430 |     });
  431 |   }
  432 | 
  433 |   /**
  434 |    * Assert that the canvas shows the "Drag and drop items from Design panel"
  435 |    * instructional text — i.e., the canvas is currently empty.
  436 |    */
  437 |   async assertCanvasEmpty(): Promise<void> {
  438 |     await this.step("Assert canvas shows empty-state instructional text", async () => {
  439 |       await expect(
  440 |         this.page.getByText(/Drag and drop items from Design panel/i),
  441 |       ).toBeVisible();
  442 |     });
  443 |   }
  444 | }
  445 | 
  446 | // ── Component lists and marker map ────────────────────────────────────────────
  447 | 
  448 | /**
  449 |  * Set of Basic-section component names.
  450 |  * Kept for reference / future use (e.g. accordion visibility checks).
  451 |  */
  452 | const BASIC_COMPONENT_NAMES = new Set([
  453 |   "Text",
  454 |   "Button",
  455 |   "Image",
  456 |   "Video",
  457 |   "Divider",
  458 |   "Dynamic Text",
  459 | ]);
  460 | 
  461 | /**
  462 |  * Confirmed DOM IDs for palette tiles where name-based matching is ambiguous.
  463 |  *
  464 |  * IDs are ONLY registered here when name+draggable matching would produce strict-mode
  465 |  * violations. All other components use accessible-name matching instead.
  466 |  *
  467 |  * Why each ID is required (confirmed 2026-05-25):
  468 |  *   "Text"         — /Text$/i also matches "Dynamic Text"
  469 |  *   "Dynamic Text" — exact name "Dynamic Text" is fine but confirmed ID is cleaner
  470 |  *   "Button"       — exact name matches nested disabled <button> in card previews
  471 |  *   "Text & Button Card"        — suffix of "Image, Text & Button Card"
  472 |  *   "Image, Text & Button Card" — paired with above (both need ID for consistency)
  473 |  *
  474 |  * Pattern:
  475 |  *   Basic → id="sidebar-item-<camelCase>"
  476 |  *   Card  → id="sidebar-item-card-<PascalCase>"
  477 |  */
  478 | const CONFIRMED_SIDEBAR_IDS: Partial<Record<string, string>> = {
  479 |   "Text":                      "sidebar-item-text",                    // ✅ confirmed
  480 |   "Dynamic Text":              "sidebar-item-dynamicText",             // ✅ confirmed
  481 |   "Button":                    "sidebar-item-button",                  // ✅ confirmed
  482 |   "Text & Button Card":        "sidebar-item-card-TextButtonCard",     // ✅ confirmed
  483 |   "Image, Text & Button Card": "sidebar-item-card-ImageTextButton",    // ✅ confirmed
  484 | };
  485 | 
  486 | /** All 14 component display names in order (Basic → Static → Dynamic). */
  487 | export const ALL_COMPONENT_NAMES: readonly string[] = [
  488 |   // Basic (6)
  489 |   "Text",
  490 |   "Button",
  491 |   "Image",
  492 |   "Video",
  493 |   "Divider",
  494 |   "Dynamic Text",
  495 |   // Static (4)
  496 |   "Image & Text Card",
  497 |   "Text & Button Card",
  498 |   "Image, Text & Button Card",
  499 |   "Profile Card",
  500 |   // Dynamic (4)
  501 |   "Dynamic Card",
  502 |   "Dynamic Strip",
  503 |   "Promoted Content Strip",
  504 |   "Promoted Banner",
  505 | ] as const;
  506 | 
  507 | /**
  508 |  * Components for which the canvas data-marker assertion is SKIPPED in PB-01.
  509 |  *
  510 |  * Two reasons a component ends up here:
  511 |  *
  512 |  *  a) Picker-required (Video):
```