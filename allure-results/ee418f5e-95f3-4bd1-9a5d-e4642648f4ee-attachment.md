# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderDragDrop.spec.ts >> SC-07: Page Builder — Drag-and-drop component validation >> PB-07b: Reorder two canvas components — verify DOM position changes after drag
- Location: tests/PageBuilder/pageBuilderDragDrop.spec.ts:70:7

# Error details

```
ReferenceError: CSS is not defined
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e9]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]:
            - button "Back to Page Builder main" [ref=e16]:
              - img [ref=e18]
              - generic [ref=e20]: Back to Page Builder main
            - heading "PB DnD Reorder administratio ademptio 1779772762" [level=1] [ref=e21]
          - list [ref=e22]:
            - listitem [ref=e23]:
              - button [ref=e26]:
                - img [ref=e28]
            - listitem [ref=e30]:
              - generic [ref=e32]:
                - button [disabled]:
                  - generic:
                    - img
            - listitem [ref=e33]:
              - generic [ref=e34]:
                - button "Edit" [ref=e35]:
                  - generic [ref=e36]: Edit
                - button "Preview" [ref=e37]:
                  - generic [ref=e38]: Preview
            - listitem [ref=e39]:
              - button "Revert" [ref=e40]:
                - generic [ref=e41]: Revert
            - listitem [ref=e42]:
              - button "Save" [ref=e43]:
                - generic [ref=e44]: Save
            - listitem [ref=e45]:
              - button "Publish" [ref=e46]:
                - generic [ref=e47]: Publish
        - generic [ref=e48]:
          - generic [ref=e50]:
            - tablist [ref=e51]:
              - tab "Pages" [ref=e52] [cursor=pointer]
              - tab "Design" [selected] [ref=e53] [cursor=pointer]
            - tabpanel "Design" [ref=e54]:
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]: Basic
                  - generic [ref=e61]:
                    - button "Text" [active] [ref=e62]:
                      - generic [ref=e63]:
                        - img [ref=e66]
                        - generic [ref=e68]: Text
                    - button "Button" [ref=e69]:
                      - generic [ref=e70]:
                        - img [ref=e73]
                        - generic [ref=e75]: Button
                    - button "Image" [ref=e76]:
                      - generic [ref=e77]:
                        - img [ref=e80]
                        - generic [ref=e83]: Image
                    - button "Video" [ref=e84]:
                      - generic [ref=e85]:
                        - img [ref=e88]
                        - generic [ref=e90]: Video
                    - button "Divider" [ref=e91]:
                      - generic [ref=e92]:
                        - img [ref=e95]
                        - generic [ref=e97]: Divider
                    - button "Dynamic Text" [ref=e98]:
                      - generic [ref=e99]:
                        - img [ref=e102]
                        - generic [ref=e104]: Dynamic Text
                - button "Static Editable elements with images, text, and buttons in various combinations." [ref=e106] [cursor=pointer]:
                  - generic [ref=e107]:
                    - text: Static
                    - button [ref=e108]:
                      - img [ref=e110]
                  - generic [ref=e112]: Editable elements with images, text, and buttons in various combinations.
                - generic [ref=e113]:
                  - button "Dynamic Elements managed outside the builder, ready to use on your pages." [ref=e114] [cursor=pointer]:
                    - generic [ref=e115]:
                      - text: Dynamic
                      - button [ref=e116]:
                        - img [ref=e118]
                    - generic [ref=e120]: Elements managed outside the builder, ready to use on your pages.
                  - generic [ref=e121]:
                    - button "DYNAMIC CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Card" [ref=e122]:
                      - generic [ref=e123]:
                        - generic [ref=e126] [cursor=pointer]:
                          - generic:
                            - generic:
                              - generic: DYNAMIC CONTENT TYPE
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e127]: Dynamic Card
                    - button "Recommendations strip title Tab Label Tab Label Tab Label CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Strip" [ref=e128]:
                      - generic [ref=e129]:
                        - generic [ref=e131]:
                          - generic [ref=e132]: Recommendations strip title
                          - generic [ref=e133]:
                            - generic [ref=e134] [cursor=pointer]: Tab Label
                            - generic [ref=e135] [cursor=pointer]: Tab Label
                            - generic [ref=e136] [cursor=pointer]: Tab Label
                          - generic [ref=e137]:
                            - generic [ref=e139] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - generic [ref=e141] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - img [ref=e143] [cursor=pointer]
                        - generic [ref=e145]: Dynamic Strip
                    - button "Content strip title CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur Promoted Content Strip" [ref=e146]:
                      - generic [ref=e147]:
                        - generic [ref=e149]:
                          - generic [ref=e150]: Content strip title
                          - generic [ref=e151]:
                            - img [ref=e153] [cursor=pointer]
                            - generic [ref=e156] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e158] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e160] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - img [ref=e162] [cursor=pointer]
                        - generic [ref=e164]: Promoted Content Strip
                    - button "Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Promoted Banner" [ref=e165]:
                      - generic [ref=e166]:
                        - generic [ref=e169] [cursor=pointer]:
                          - generic:
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e170]: Promoted Banner
          - generic [ref=e179]:
            - 'button "Welcome to the Academy: Your Gateway to Growth & Success" [ref=e180]':
              - 'heading "Welcome to the Academy: Your Gateway to Growth & Success" [level=1] [ref=e188]'
            - button "The Academy is your centralized resource for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities. Choose your function from the options below to begin exploring your learning and growth opportunities." [ref=e189]:
              - paragraph [ref=e197]:
                - text: The Academy is your
                - strong [ref=e198]: centralized resource
                - text: for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities.
                - strong [ref=e199]: Choose your function from the options below to begin exploring your learning and growth opportunities.
            - button "Lorem ipsum dolor sit amet test" [ref=e200]:
              - generic [ref=e206]: Lorem ipsum dolor sit amet test
            - button "Digital Academy Master essential and advanced digital skills to stay ahead." [ref=e207]:
              - generic [ref=e212] [cursor=pointer]:
                - img [ref=e213]
                - generic [ref=e215]:
                  - heading "Digital Academy" [level=3] [ref=e216]
                  - generic [ref=e217]: Master essential and advanced digital skills to stay ahead.
            - button "Data Science Academy Learn to analyze, visualize, and derive insights from data to drive better decisions." [ref=e218]:
              - generic [ref=e223] [cursor=pointer]:
                - img [ref=e224]
                - generic [ref=e226]:
                  - heading "Data Science Academy" [level=3] [ref=e227]
                  - generic [ref=e228]: Learn to analyze, visualize, and derive insights from data to drive better decisions.
            - button "Cybersecurity Academy Master skills to secure data, manage risks, and defend against cyber threats." [ref=e229]:
              - generic [ref=e234] [cursor=pointer]:
                - img [ref=e235]
                - generic [ref=e237]:
                  - heading "Cybersecurity Academy" [level=3] [ref=e238]
                  - generic [ref=e239]: Master skills to secure data, manage risks, and defend against cyber threats.
            - button "Cloud Engineering Academy Explore cloud computing and learn to implement scalable solutions" [ref=e240]:
              - generic [ref=e245] [cursor=pointer]:
                - img [ref=e246]
                - generic [ref=e248]:
                  - heading "Cloud Engineering Academy" [level=3] [ref=e249]
                  - generic [ref=e250]: Explore cloud computing and learn to implement scalable solutions
            - button "Sales Academy Gain skills and strategies to drive revenue and build client relationships." [ref=e251]:
              - generic [ref=e256] [cursor=pointer]:
                - img [ref=e257]
                - generic [ref=e259]:
                  - heading "Sales Academy" [level=3] [ref=e260]
                  - generic [ref=e261]: Gain skills and strategies to drive revenue and build client relationships.
            - button "Global Marketing Academy Learn to engage diverse audiences with innovative marketing." [ref=e262]:
              - generic [ref=e267] [cursor=pointer]:
                - img [ref=e268]
                - generic [ref=e270]:
                  - heading "Global Marketing Academy" [level=3] [ref=e271]
                  - generic [ref=e272]: Learn to engage diverse audiences with innovative marketing.
            - button "Product Management Academy Create and optimize products that drive success and meet customer needs." [ref=e273]:
              - generic [ref=e278] [cursor=pointer]:
                - img [ref=e279]
                - generic [ref=e281]:
                  - heading "Product Management Academy" [level=3] [ref=e282]
                  - generic [ref=e283]: Create and optimize products that drive success and meet customer needs.
            - button "Logistics & Supply Academy Boost efficiency and resilience in supply chain management." [ref=e284]:
              - generic [ref=e289] [cursor=pointer]:
                - img [ref=e290]
                - generic [ref=e292]:
                  - heading "Logistics & Supply Academy" [level=3] [ref=e293]
                  - generic [ref=e294]: Boost efficiency and resilience in supply chain management.
        - status [ref=e295]: Draggable item text was dropped.
    - generic:
      - log [ref=e296]
      - log [ref=e297]
      - log [ref=e298]
      - log [ref=e299]
  - generic [ref=e300]: Percipio
```

# Test source

```ts
  237 |           () => { (document.body.style as CSSStyleDeclaration).userSelect = ""; },
  238 |         );
  239 |       }
  240 | 
  241 |       // Brief settle time for canvas animation
  242 |       await this.page.waitForTimeout(400);
  243 | 
  244 |       // Some components open a configuration picker after being dropped (e.g. Video → "Select video").
  245 |       // Dismiss via Cancel so the placeholder lands on canvas and the test can continue.
  246 |       await this.dismissPickerDialogIfOpen();
  247 | 
  248 |       // ── Scroll to dropped component, then screenshot ──────────────────────
  249 |       // The canvas may extend below the viewport fold. Scroll the newly placed
  250 |       // component into view before capturing so the screenshot shows exactly
  251 |       // where the component landed rather than an unrelated part of the canvas.
  252 |       await this.scrollToLastPlacedComponent(
  253 |         componentName,
  254 |         prevGridIds,
  255 |         { x: tgtX, y: tgtY },
  256 |       );
  257 |       await this.screenshot(`📸 After drag: ${componentName}`);
  258 |     });
  259 |   }
  260 | 
  261 |   /**
  262 |    * Dismiss any media/configuration picker dialog that may open after a component is dropped.
  263 |    *
  264 |    * Confirmed 2026-05-25:
  265 |    *   - Video opens a "Select video" dialog on drop.
  266 |    *   - Clicking "Cancel" closes the dialog but REMOVES the component from the canvas
  267 |    *     (no placeholder remains). Canvas assertion must be skipped for Video.
  268 |    *
  269 |    * Use PICKER_REQUIRED_COMPONENTS to identify components affected by this behaviour.
  270 |    * This method is a no-op when no dialog is present.
  271 |    */
  272 |   private async dismissPickerDialogIfOpen(): Promise<void> {
  273 |     const dialog = this.page.getByRole("dialog");
  274 |     const dialogVisible = await dialog.isVisible();
  275 |     if (!dialogVisible) return;
  276 | 
  277 |     const cancelBtn = dialog.getByRole("button", { name: "Cancel" });
  278 |     const cancelVisible = await cancelBtn.isVisible();
  279 |     if (cancelVisible) {
  280 |       await this.step(
  281 |         "Dismiss component picker dialog (Cancel) — component placement initiated",
  282 |         async () => {
  283 |           await this.click(cancelBtn, "Cancel button in picker dialog");
  284 |           await this.waitForHidden(dialog, "Picker dialog (dismissed)");
  285 |         },
  286 |       );
  287 |     }
  288 |   }
  289 | 
  290 |   /**
  291 |    * Scroll the most recently placed canvas component into view.
  292 |    *
  293 |    * After a drag, the dropped component may sit below the current viewport fold.
  294 |    * Calling this before the screenshot ensures the image shows the placed item.
  295 |    *
  296 |    * Three-tier strategy (tried in order until one succeeds):
  297 |    *
  298 |    *  1. Grid-item ID diff (primary — works for ALL components):
  299 |    *     Every canvas element gets id="grid-item-{uuid}" on placement. New items are
  300 |    *     NOT always appended at the end of the DOM — they are inserted at the drop
  301 |    *     zone position. By diffing the full list of grid-item IDs before/after the drag
  302 |    *     we reliably identify the exact new element regardless of insertion position.
  303 |    *     Confirmed via live MCP inspection 2026-05-25.
  304 |    *
  305 |    *  2. Confirmed data-marker .last() (non-SKIP fallback):
  306 |    *     If the ID diff finds nothing (e.g. the component was removed, like Video after
  307 |    *     Cancel), use `[data-marker="${marker}"]`.last() for components with confirmed
  308 |    *     canvas markers.
  309 |    *
  310 |    *  3. elementFromPoint at drop zone (last resort):
  311 |    *     The drop zone coordinates (dropX, dropY) are in viewport space and should
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
> 337 |       const newEl = this.page.locator(`#${CSS.escape(newGridId)}`);
      |                                           ^ ReferenceError: CSS is not defined
  338 |       await newEl.scrollIntoViewIfNeeded();
  339 |       await this.page.waitForTimeout(200);
  340 |       return;
  341 |     }
  342 | 
  343 |     // ── Tier 2: known data-marker .last() (non-SKIP fallback) ────────────────
  344 |     // Reached when grid-item diff yields nothing — e.g. Video after Cancel removes
  345 |     // the grid-item entirely before we can diff.
  346 |     if (!SKIP_CANVAS_ASSERTION.has(componentName)) {
  347 |       const marker = componentCanvasMarker(componentName);
  348 |       const target = this.page.locator(`[data-marker="${marker}"]`).last();
  349 |       if (await target.count() > 0) {
  350 |         await target.scrollIntoViewIfNeeded();
  351 |         await this.page.waitForTimeout(200);
  352 |       }
  353 |       return;
  354 |     }
  355 | 
  356 |     // ── Tier 3: elementFromPoint at drop zone (last resort) ───────────────────
  357 |     // The canvas does not auto-scroll after a drop. The element at the drop zone
  358 |     // viewport coordinates should still be the newly placed canvas row (or a
  359 |     // direct ancestor). Walk up from that element until we find one that is
  360 |     // scrollable or has a data-marker, then scroll it into view.
  361 |     await this.page.evaluate(({ x, y }) => {
  362 |       const atDrop = document.elementFromPoint(x, y);
  363 |       if (!atDrop) return;
  364 |       // Try to find an ancestor with data-marker (canvas component row)
  365 |       let el: Element | null = atDrop;
  366 |       while (el && el !== document.body) {
  367 |         if (el.hasAttribute("data-marker")) {
  368 |           el.scrollIntoView({ block: "center", behavior: "instant" });
  369 |           return;
  370 |         }
  371 |         el = el.parentElement;
  372 |       }
  373 |       // No data-marker found — just scroll whatever is at the drop point into view
  374 |       atDrop.scrollIntoView({ block: "center", behavior: "instant" });
  375 |     }, drop);
  376 |     await this.page.waitForTimeout(200);
  377 |   }
  378 | 
  379 |   // ── Canvas assertions ─────────────────────────────────────────────────────
  380 | 
  381 |   /**
  382 |    * Assert that a component of the given name is visible on the editor canvas.
  383 |    * Uses the data-marker map (confirmed markers from live analysis;
  384 |    * inferred markers from naming convention — validate during T-14).
  385 |    *
  386 |    * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
  387 |    */
  388 |   async assertComponentOnCanvas(componentName: string): Promise<void> {
  389 |     // Skip assertion for components in SKIP_CANVAS_ASSERTION:
  390 |     //   - Picker-required (Video): no canvas placeholder after Cancel
  391 |     //   - Unconfirmed markers (Static/Dynamic cards): T-14 pending validation
  392 |     // The drag step already confirms the tile exists and is draggable.
  393 |     if (SKIP_CANVAS_ASSERTION.has(componentName)) {
  394 |       await this.step(
  395 |         `Canvas assertion skipped for "${componentName}" (SKIP_CANVAS_ASSERTION — see T-14)`,
  396 |         async () => { /* intentional no-op */ },
  397 |       );
  398 |       return;
  399 |     }
  400 | 
  401 |     await this.step(
  402 |       `Assert "${componentName}" component is visible on canvas`,
  403 |       async () => {
  404 |         const marker = componentCanvasMarker(componentName);
  405 |         // Use .first() — the canvas may have multiple instances of the same component type
  406 |         // (e.g. a page template may already contain Text components). We just need at least one.
  407 |         await expect(
  408 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  409 |         ).toBeVisible({ timeout: 10_000 });
  410 |       },
  411 |     );
  412 |   }
  413 | 
  414 |   /**
  415 |    * Assert all 14 Design tab components are present on the canvas.
  416 |    * Call after addComponent() for each of the 14 components.
  417 |    */
  418 |   async assertAllComponentsOnCanvas(): Promise<void> {
  419 |     await this.step("Assert Design tab components are visible on canvas (confirmed markers only)", async () => {
  420 |       for (const name of ALL_COMPONENT_NAMES) {
  421 |         if (SKIP_CANVAS_ASSERTION.has(name)) continue; // marker unconfirmed — T-14 pending
  422 |         const marker = componentCanvasMarker(name);
  423 |         await expect(
  424 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  425 |         ).toBeVisible({ timeout: 10_000 });
  426 |       }
  427 |     });
  428 |   }
  429 | 
  430 |   /**
  431 |    * Assert that the canvas shows the "Drag and drop items from Design panel"
  432 |    * instructional text — i.e., the canvas is currently empty.
  433 |    */
  434 |   async assertCanvasEmpty(): Promise<void> {
  435 |     await this.step("Assert canvas shows empty-state instructional text", async () => {
  436 |       await expect(
  437 |         this.page.getByText(/Drag and drop items from Design panel/i),
```