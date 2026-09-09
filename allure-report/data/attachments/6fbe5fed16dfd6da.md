# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderDragDrop.spec.ts >> SC-07: Page Builder — Drag-and-drop component validation >> PB-07a: Drag all 14 Design tab components from palette to canvas — verify each is placed
- Location: tests/PageBuilder/pageBuilderDragDrop.spec.ts:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-marker="PageBuilder--video"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-marker="PageBuilder--video"]').first()

```

```yaml
- main:
  - button "Back to Page Builder main"
  - heading "PB DnD thema cattus 1779726788930" [level=1]
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
  - status: Draggable item videoPlayer was dropped over droppable area 87315676-685b-4078-9808-4914aa034a98
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
  164 |       } else {
  165 |         const isBasicName = BASIC_COMPONENT_NAMES.has(componentName);
  166 |         const nameLocator = isBasicName
  167 |           ? this.page.getByRole("button", { name: componentName, exact: true })
  168 |           : (() => {
  169 |               const esc = componentName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  170 |               return this.page.getByRole("button", {
  171 |                 name: new RegExp(esc + "$", "i"),
  172 |               });
  173 |             })();
  174 |         source = this.panel
  175 |           .locator('[aria-roledescription="draggable"]')
  176 |           .and(nameLocator);
  177 |       }
  178 |       await source.waitFor({ state: "visible", timeout: 10_000 });
  179 | 
  180 |       const sourceBB = await source.boundingBox();
  181 |       const panelBB = await this.panel.boundingBox();
  182 | 
  183 |       if (!sourceBB) {
  184 |         throw new Error(
  185 |           `Component button "${componentName}" not found in Design panel`,
  186 |         );
  187 |       }
  188 |       if (!panelBB) {
  189 |         throw new Error(
  190 |           "Design panel container not found — ensure Design tab is active and editor is in Edit mode",
  191 |         );
  192 |       }
  193 | 
  194 |       const srcX = sourceBB.x + sourceBB.width / 2;
  195 |       const srcY = sourceBB.y + sourceBB.height / 2;
  196 | 
  197 |       // Canvas target: 250px to the right of the panel, 40% down vertically
  198 |       const tgtX = panelBB.x + panelBB.width + 250;
  199 |       const tgtY = panelBB.y + panelBB.height * 0.4;
  200 | 
  201 |       // Pointer-event DnD: move → down → slight jiggle → smooth move to target → up
  202 |       await this.page.mouse.move(srcX, srcY);
  203 |       await this.page.mouse.down();
  204 |       await this.page.mouse.move(srcX + 2, srcY + 2); // trigger drag detection
  205 |       await this.page.mouse.move(tgtX, tgtY, { steps: 20 });
  206 |       await this.page.mouse.up();
  207 | 
  208 |       // Brief settle time for canvas animation
  209 |       await this.page.waitForTimeout(400);
  210 | 
  211 |       // Some components open a configuration picker after being dropped (e.g. Video → "Select video").
  212 |       // Dismiss via Cancel so the placeholder lands on canvas and the test can continue.
  213 |       await this.dismissPickerDialogIfOpen();
  214 |     });
  215 |   }
  216 | 
  217 |   /**
  218 |    * Dismiss any media/configuration picker dialog that may open after a component is dropped.
  219 |    *
  220 |    * Confirmed 2026-05-25:
  221 |    *   - Video opens a "Select video" dialog on drop.
  222 |    *   - Clicking "Cancel" closes the dialog but REMOVES the component from the canvas
  223 |    *     (no placeholder remains). Canvas assertion must be skipped for Video.
  224 |    *
  225 |    * Use PICKER_REQUIRED_COMPONENTS to identify components affected by this behaviour.
  226 |    * This method is a no-op when no dialog is present.
  227 |    */
  228 |   private async dismissPickerDialogIfOpen(): Promise<void> {
  229 |     const dialog = this.page.getByRole("dialog");
  230 |     const dialogVisible = await dialog.isVisible();
  231 |     if (!dialogVisible) return;
  232 | 
  233 |     const cancelBtn = dialog.getByRole("button", { name: "Cancel" });
  234 |     const cancelVisible = await cancelBtn.isVisible();
  235 |     if (cancelVisible) {
  236 |       await this.step(
  237 |         "Dismiss component picker dialog (Cancel) — component placement initiated",
  238 |         async () => {
  239 |           await this.click(cancelBtn, "Cancel button in picker dialog");
  240 |           await this.waitForHidden(dialog, "Picker dialog (dismissed)");
  241 |         },
  242 |       );
  243 |     }
  244 |   }
  245 | 
  246 |   // ── Canvas assertions ─────────────────────────────────────────────────────
  247 | 
  248 |   /**
  249 |    * Assert that a component of the given name is visible on the editor canvas.
  250 |    * Uses the data-marker map (confirmed markers from live analysis;
  251 |    * inferred markers from naming convention — validate during T-14).
  252 |    *
  253 |    * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
  254 |    */
  255 |   async assertComponentOnCanvas(componentName: string): Promise<void> {
  256 |     await this.step(
  257 |       `Assert "${componentName}" component is visible on canvas`,
  258 |       async () => {
  259 |         const marker = componentCanvasMarker(componentName);
  260 |         // Use .first() — the canvas may have multiple instances of the same component type
  261 |         // (e.g. a page template may already contain Text components). We just need at least one.
  262 |         await expect(
  263 |           this.page.locator(`[data-marker="${marker}"]`).first(),
> 264 |         ).toBeVisible({ timeout: 10_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  265 |       },
  266 |     );
  267 |   }
  268 | 
  269 |   /**
  270 |    * Assert all 14 Design tab components are present on the canvas.
  271 |    * Call after addComponent() for each of the 14 components.
  272 |    */
  273 |   async assertAllComponentsOnCanvas(): Promise<void> {
  274 |     await this.step("Assert all 14 Design tab components are on canvas", async () => {
  275 |       for (const name of ALL_COMPONENT_NAMES) {
  276 |         const marker = componentCanvasMarker(name);
  277 |         // Use .first() — canvas may have multiple instances per component type
  278 |         await expect(
  279 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  280 |         ).toBeVisible({ timeout: 10_000 });
  281 |       }
  282 |     });
  283 |   }
  284 | 
  285 |   /**
  286 |    * Assert that the canvas shows the "Drag and drop items from Design panel"
  287 |    * instructional text — i.e., the canvas is currently empty.
  288 |    */
  289 |   async assertCanvasEmpty(): Promise<void> {
  290 |     await this.step("Assert canvas shows empty-state instructional text", async () => {
  291 |       await expect(
  292 |         this.page.getByText(/Drag and drop items from Design panel/i),
  293 |       ).toBeVisible();
  294 |     });
  295 |   }
  296 | }
  297 | 
  298 | // ── Component lists and marker map ────────────────────────────────────────────
  299 | 
  300 | /**
  301 |  * Set of Basic-section component names.
  302 |  * Kept for reference / future use (e.g. accordion visibility checks).
  303 |  */
  304 | const BASIC_COMPONENT_NAMES = new Set([
  305 |   "Text",
  306 |   "Button",
  307 |   "Image",
  308 |   "Video",
  309 |   "Divider",
  310 |   "Dynamic Text",
  311 | ]);
  312 | 
  313 | /**
  314 |  * Confirmed DOM IDs for palette tiles where name-based matching is ambiguous.
  315 |  *
  316 |  * IDs are ONLY registered here when name+draggable matching would produce strict-mode
  317 |  * violations. All other components use accessible-name matching instead.
  318 |  *
  319 |  * Why each ID is required (confirmed 2026-05-25):
  320 |  *   "Text"         — /Text$/i also matches "Dynamic Text"
  321 |  *   "Dynamic Text" — exact name "Dynamic Text" is fine but confirmed ID is cleaner
  322 |  *   "Button"       — exact name matches nested disabled <button> in card previews
  323 |  *   "Text & Button Card"        — suffix of "Image, Text & Button Card"
  324 |  *   "Image, Text & Button Card" — paired with above (both need ID for consistency)
  325 |  *
  326 |  * Pattern:
  327 |  *   Basic → id="sidebar-item-<camelCase>"
  328 |  *   Card  → id="sidebar-item-card-<PascalCase>"
  329 |  */
  330 | const CONFIRMED_SIDEBAR_IDS: Partial<Record<string, string>> = {
  331 |   "Text":                      "sidebar-item-text",                    // ✅ confirmed
  332 |   "Dynamic Text":              "sidebar-item-dynamicText",             // ✅ confirmed
  333 |   "Button":                    "sidebar-item-button",                  // ✅ confirmed
  334 |   "Text & Button Card":        "sidebar-item-card-TextButtonCard",     // ✅ confirmed
  335 |   "Image, Text & Button Card": "sidebar-item-card-ImageTextButton",    // ✅ confirmed
  336 | };
  337 | 
  338 | /** All 14 component display names in order (Basic → Static → Dynamic). */
  339 | export const ALL_COMPONENT_NAMES: readonly string[] = [
  340 |   // Basic (6)
  341 |   "Text",
  342 |   "Button",
  343 |   "Image",
  344 |   "Video",
  345 |   "Divider",
  346 |   "Dynamic Text",
  347 |   // Static (4)
  348 |   "Image & Text Card",
  349 |   "Text & Button Card",
  350 |   "Image, Text & Button Card",
  351 |   "Profile Card",
  352 |   // Dynamic (4)
  353 |   "Dynamic Card",
  354 |   "Dynamic Strip",
  355 |   "Promoted Content Strip",
  356 |   "Promoted Banner",
  357 | ] as const;
  358 | 
  359 | /**
  360 |  * Components for which the canvas data-marker assertion is SKIPPED in PB-01.
  361 |  *
  362 |  * Two reasons a component ends up here:
  363 |  *
  364 |  *  a) Picker-required (Video):
```