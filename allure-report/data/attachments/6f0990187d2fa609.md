# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderComponents.spec.ts >> SC-01: Page Builder — Design tab component coverage >> PB-01: Add all 14 Design tab components to a new page and verify each appears on canvas
- Location: tests/PageBuilder/pageBuilderComponents.spec.ts:27:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-marker="pageBuilderDesignContent"]').locator('#sidebar-item-video') to be visible

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
            - heading "PB Components eaque libero 1779725893193" [level=1] [ref=e21]
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
                    - button "Text" [ref=e62]:
                      - generic [ref=e63]:
                        - img [ref=e66]
                        - generic [ref=e68]: Text
                    - button "Button" [ref=e69]:
                      - generic [ref=e70]:
                        - img [ref=e73]
                        - generic [ref=e75]: Button
                    - button "Image" [active] [ref=e76]:
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
                - generic [ref=e105]:
                  - button "Static Editable elements with images, text, and buttons in various combinations." [ref=e106] [cursor=pointer]:
                    - generic [ref=e107]:
                      - text: Static
                      - button [ref=e108]:
                        - img [ref=e110]
                    - generic [ref=e112]: Editable elements with images, text, and buttons in various combinations.
                  - generic [ref=e113]:
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo Image & Text Card" [ref=e114]:
                      - generic [ref=e115]:
                        - generic [ref=e118] [cursor=pointer]:
                          - img [ref=e119]
                          - generic [ref=e121]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e122]
                            - generic [ref=e123]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo
                        - generic [ref=e124]: Image & Text Card
                    - button "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna Button Text & Button Card" [ref=e125]:
                      - generic [ref=e126]:
                        - generic [ref=e129]:
                          - generic [ref=e131]:
                            - heading "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing" [level=3] [ref=e132]
                            - generic [ref=e133]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                          - generic [ref=e134]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e135]: Text & Button Card
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Image, Text & Button Card" [ref=e136]:
                      - generic [ref=e137]:
                        - generic [ref=e140]:
                          - img [ref=e141]
                          - generic [ref=e143]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e144]
                            - generic [ref=e145]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e146]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e147]: Image, Text & Button Card
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Profile Card" [ref=e148]:
                      - generic [ref=e149]:
                        - generic [ref=e152]:
                          - img [ref=e153]
                          - generic [ref=e155]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e156]
                            - generic [ref=e157]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e158]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e159]: Profile Card
                - generic [ref=e160]:
                  - button "Dynamic Elements managed outside the builder, ready to use on your pages." [ref=e161] [cursor=pointer]:
                    - generic [ref=e162]:
                      - text: Dynamic
                      - button [ref=e163]:
                        - img [ref=e165]
                    - generic [ref=e167]: Elements managed outside the builder, ready to use on your pages.
                  - generic [ref=e168]:
                    - button "DYNAMIC CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Card" [ref=e169]:
                      - generic [ref=e170]:
                        - generic [ref=e173] [cursor=pointer]:
                          - generic:
                            - generic:
                              - generic: DYNAMIC CONTENT TYPE
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e174]: Dynamic Card
                    - button "Recommendations strip title Tab Label Tab Label Tab Label CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Strip" [ref=e175]:
                      - generic [ref=e176]:
                        - generic [ref=e178]:
                          - generic [ref=e179]: Recommendations strip title
                          - generic [ref=e180]:
                            - generic [ref=e181] [cursor=pointer]: Tab Label
                            - generic [ref=e182] [cursor=pointer]: Tab Label
                            - generic [ref=e183] [cursor=pointer]: Tab Label
                          - generic [ref=e184]:
                            - generic [ref=e186] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - generic [ref=e188] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - img [ref=e190] [cursor=pointer]
                        - generic [ref=e192]: Dynamic Strip
                    - button "Content strip title CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur Promoted Content Strip" [ref=e193]:
                      - generic [ref=e194]:
                        - generic [ref=e196]:
                          - generic [ref=e197]: Content strip title
                          - generic [ref=e198]:
                            - img [ref=e200] [cursor=pointer]
                            - generic [ref=e203] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e205] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e207] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - img [ref=e209] [cursor=pointer]
                        - generic [ref=e211]: Promoted Content Strip
                    - button "Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Promoted Banner" [ref=e212]:
                      - generic [ref=e213]:
                        - generic [ref=e216] [cursor=pointer]:
                          - generic:
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e217]: Promoted Banner
          - generic [ref=e226]:
            - 'button "Welcome to the Academy: Your Gateway to Growth & Success" [ref=e227]':
              - 'heading "Welcome to the Academy: Your Gateway to Growth & Success" [level=1] [ref=e235]'
            - button "The Academy is your centralized resource for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities. Choose your function from the options below to begin exploring your learning and growth opportunities." [ref=e236]:
              - paragraph [ref=e244]:
                - text: The Academy is your
                - strong [ref=e245]: centralized resource
                - text: for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities.
                - strong [ref=e246]: Choose your function from the options below to begin exploring your learning and growth opportunities.
            - button "Lorem ipsum dolor sit amet test" [ref=e247]:
              - generic [ref=e253]: Lorem ipsum dolor sit amet test
            - button [ref=e254]:
              - img [ref=e261]
            - button "Label" [ref=e262]:
              - generic [ref=e267]:
                - button "Label" [disabled]:
                  - generic: Label
            - button "Digital Academy Master essential and advanced digital skills to stay ahead." [ref=e268]:
              - generic [ref=e273] [cursor=pointer]:
                - img [ref=e274]
                - generic [ref=e276]:
                  - heading "Digital Academy" [level=3] [ref=e277]
                  - generic [ref=e278]: Master essential and advanced digital skills to stay ahead.
            - button "Data Science Academy Learn to analyze, visualize, and derive insights from data to drive better decisions." [ref=e279]:
              - generic [ref=e284] [cursor=pointer]:
                - img [ref=e285]
                - generic [ref=e287]:
                  - heading "Data Science Academy" [level=3] [ref=e288]
                  - generic [ref=e289]: Learn to analyze, visualize, and derive insights from data to drive better decisions.
            - button "Cybersecurity Academy Master skills to secure data, manage risks, and defend against cyber threats." [ref=e290]:
              - generic [ref=e295] [cursor=pointer]:
                - img [ref=e296]
                - generic [ref=e298]:
                  - heading "Cybersecurity Academy" [level=3] [ref=e299]
                  - generic [ref=e300]: Master skills to secure data, manage risks, and defend against cyber threats.
            - button "Cloud Engineering Academy Explore cloud computing and learn to implement scalable solutions" [ref=e301]:
              - generic [ref=e306] [cursor=pointer]:
                - img [ref=e307]
                - generic [ref=e309]:
                  - heading "Cloud Engineering Academy" [level=3] [ref=e310]
                  - generic [ref=e311]: Explore cloud computing and learn to implement scalable solutions
            - button "Sales Academy Gain skills and strategies to drive revenue and build client relationships." [ref=e312]:
              - generic [ref=e317] [cursor=pointer]:
                - img [ref=e318]
                - generic [ref=e320]:
                  - heading "Sales Academy" [level=3] [ref=e321]
                  - generic [ref=e322]: Gain skills and strategies to drive revenue and build client relationships.
            - button "Global Marketing Academy Learn to engage diverse audiences with innovative marketing." [ref=e323]:
              - generic [ref=e328] [cursor=pointer]:
                - img [ref=e329]
                - generic [ref=e331]:
                  - heading "Global Marketing Academy" [level=3] [ref=e332]
                  - generic [ref=e333]: Learn to engage diverse audiences with innovative marketing.
            - button "Product Management Academy Create and optimize products that drive success and meet customer needs." [ref=e334]:
              - generic [ref=e339] [cursor=pointer]:
                - img [ref=e340]
                - generic [ref=e342]:
                  - heading "Product Management Academy" [level=3] [ref=e343]
                  - generic [ref=e344]: Create and optimize products that drive success and meet customer needs.
            - button "Logistics & Supply Academy Boost efficiency and resilience in supply chain management." [ref=e345]:
              - generic [ref=e350] [cursor=pointer]:
                - img [ref=e351]
                - generic [ref=e353]:
                  - heading "Logistics & Supply Academy" [level=3] [ref=e354]
                  - generic [ref=e355]: Boost efficiency and resilience in supply chain management.
        - status [ref=e356]: Draggable item image was dropped.
    - generic:
      - log [ref=e357]
      - log [ref=e358]
      - log [ref=e359]
      - log [ref=e360]
  - generic [ref=e361]: Percipio
```

# Test source

```ts
  63  |    */
  64  |   private readonly staticSectionToggle = this.page.getByRole("button", {
  65  |     name: /Static Editable elements/i,
  66  |   });
  67  | 
  68  |   /**
  69  |    * Dynamic section accordion toggle.
  70  |    * Text: "Dynamic Elements managed …" (partial match)
  71  |    */
  72  |   private readonly dynamicSectionToggle = this.page.getByRole("button", {
  73  |     name: /Dynamic Elements managed/i,
  74  |   });
  75  | 
  76  |   constructor(page: Page) {
  77  |     super(page);
  78  |   }
  79  | 
  80  |   // ── Accordion management ──────────────────────────────────────────────────
  81  | 
  82  |   /**
  83  |    * Ensure the Static section is expanded so its components are visible.
  84  |    * Idempotent — only clicks the toggle if "Image & Text Card" is not already visible.
  85  |    *
  86  |    * ⚠️  Confirmed 2026-05-25:
  87  |    *   - Static/Dynamic sections are EXPANDED by default when Design tab opens.
  88  |    *   - The toggle button may NOT have an aria-expanded attribute — do not rely on
  89  |    *     getAttribute("aria-expanded") for the expanded/collapsed state check.
  90  |    *     Use component visibility instead.
  91  |    *   - Component buttons use long accessible names that END WITH the component
  92  |    *     label (e.g. "Lorem Ipsum... Image & Text Card"). Use end-of-string regex.
  93  |    */
  94  |   async expandStaticSection(): Promise<void> {
  95  |     await this.step("Expand Static components section (accordion)", async () => {
  96  |       await this.staticSectionToggle.waitFor({ state: "visible", timeout: 10_000 });
  97  | 
  98  |       // Check visibility directly — aria-expanded may not be present
  99  |       const firstStaticItem = this.panel.getByRole("button", {
  100 |         name: /Image & Text Card$/i,
  101 |       });
  102 |       const isAlreadyVisible = await firstStaticItem.isVisible();
  103 |       if (!isAlreadyVisible) {
  104 |         await this.click(this.staticSectionToggle, "Static section toggle");
  105 |       }
  106 | 
  107 |       await expect(firstStaticItem).toBeVisible({ timeout: 10_000 });
  108 |     });
  109 |   }
  110 | 
  111 |   /**
  112 |    * Ensure the Dynamic section is expanded so its components are visible.
  113 |    * Idempotent — only clicks the toggle if "Dynamic Card" is not already visible.
  114 |    *
  115 |    * Same constraints as expandStaticSection().
  116 |    */
  117 |   async expandDynamicSection(): Promise<void> {
  118 |     await this.step("Expand Dynamic components section (accordion)", async () => {
  119 |       await this.dynamicSectionToggle.waitFor({ state: "visible", timeout: 10_000 });
  120 | 
  121 |       const firstDynamicItem = this.panel.getByRole("button", {
  122 |         name: /Dynamic Card$/i,
  123 |       });
  124 |       const isAlreadyVisible = await firstDynamicItem.isVisible();
  125 |       if (!isAlreadyVisible) {
  126 |         await this.click(this.dynamicSectionToggle, "Dynamic section toggle");
  127 |       }
  128 | 
  129 |       await expect(firstDynamicItem).toBeVisible({ timeout: 10_000 });
  130 |     });
  131 |   }
  132 | 
  133 |   // ── Component placement ───────────────────────────────────────────────────
  134 | 
  135 |   /**
  136 |    * Drag a component from the Design palette onto the editor canvas.
  137 |    *
  138 |    * The component button in the panel is the drag source.
  139 |    * The canvas target position is calculated as 250px to the right of the
  140 |    * panel's right edge, at 40% of the panel's vertical height.
  141 |    *
  142 |    * Strategy: pointer-event based mouse simulation (not HTML5 DnD).
  143 |    *
  144 |    * @param componentName - Exact component label (e.g. "Text", "Image & Text Card").
  145 |    */
  146 |   async addComponent(componentName: string): Promise<void> {
  147 |     await this.step(`Drag "${componentName}" from Design panel to canvas`, async () => {
  148 |       // Locate the draggable palette tile by its sidebar item ID.
  149 |       // ID-based lookup is the most reliable: names like "Text & Button Card" are
  150 |       // a suffix of "Image, Text & Button Card", so end-of-string regex is ambiguous.
  151 |       // IDs follow two confirmed patterns:
  152 |       //   Basic: "sidebar-item-<camelCase>"
  153 |       //   Card:  "sidebar-item-card-<PascalCase>"
  154 |       // Confirmed from DOM (2026-05-25): sidebar-item-button, sidebar-item-card-TextButtonCard,
  155 |       //   sidebar-item-card-ImageTextButton. All others follow the same convention.
  156 |       const itemId = SIDEBAR_ITEM_IDS[componentName];
  157 |       if (!itemId) {
  158 |         throw new Error(
  159 |           `No sidebar item ID registered for component "${componentName}". Add it to SIDEBAR_ITEM_IDS.`,
  160 |         );
  161 |       }
  162 |       const source = this.panel.locator(`#${itemId}`);
> 163 |       await source.waitFor({ state: "visible", timeout: 10_000 });
      |                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  164 | 
  165 |       const sourceBB = await source.boundingBox();
  166 |       const panelBB = await this.panel.boundingBox();
  167 | 
  168 |       if (!sourceBB) {
  169 |         throw new Error(
  170 |           `Component button "${componentName}" not found in Design panel`,
  171 |         );
  172 |       }
  173 |       if (!panelBB) {
  174 |         throw new Error(
  175 |           "Design panel container not found — ensure Design tab is active and editor is in Edit mode",
  176 |         );
  177 |       }
  178 | 
  179 |       const srcX = sourceBB.x + sourceBB.width / 2;
  180 |       const srcY = sourceBB.y + sourceBB.height / 2;
  181 | 
  182 |       // Canvas target: 250px to the right of the panel, 40% down vertically
  183 |       const tgtX = panelBB.x + panelBB.width + 250;
  184 |       const tgtY = panelBB.y + panelBB.height * 0.4;
  185 | 
  186 |       // Pointer-event DnD: move → down → slight jiggle → smooth move to target → up
  187 |       await this.page.mouse.move(srcX, srcY);
  188 |       await this.page.mouse.down();
  189 |       await this.page.mouse.move(srcX + 2, srcY + 2); // trigger drag detection
  190 |       await this.page.mouse.move(tgtX, tgtY, { steps: 20 });
  191 |       await this.page.mouse.up();
  192 | 
  193 |       // Brief settle time for canvas animation
  194 |       await this.page.waitForTimeout(400);
  195 | 
  196 |       // Some components open a configuration picker after being dropped (e.g. Video → "Select video").
  197 |       // Dismiss via Cancel so the placeholder lands on canvas and the test can continue.
  198 |       await this.dismissPickerDialogIfOpen();
  199 |     });
  200 |   }
  201 | 
  202 |   /**
  203 |    * Dismiss any media/configuration picker dialog that may open after a component is dropped.
  204 |    *
  205 |    * Confirmed 2026-05-25:
  206 |    *   - Video opens a "Select video" dialog on drop.
  207 |    *   - Clicking "Cancel" closes the dialog but REMOVES the component from the canvas
  208 |    *     (no placeholder remains). Canvas assertion must be skipped for Video.
  209 |    *
  210 |    * Use PICKER_REQUIRED_COMPONENTS to identify components affected by this behaviour.
  211 |    * This method is a no-op when no dialog is present.
  212 |    */
  213 |   private async dismissPickerDialogIfOpen(): Promise<void> {
  214 |     const dialog = this.page.getByRole("dialog");
  215 |     const dialogVisible = await dialog.isVisible();
  216 |     if (!dialogVisible) return;
  217 | 
  218 |     const cancelBtn = dialog.getByRole("button", { name: "Cancel" });
  219 |     const cancelVisible = await cancelBtn.isVisible();
  220 |     if (cancelVisible) {
  221 |       await this.step(
  222 |         "Dismiss component picker dialog (Cancel) — component placement initiated",
  223 |         async () => {
  224 |           await this.click(cancelBtn, "Cancel button in picker dialog");
  225 |           await this.waitForHidden(dialog, "Picker dialog (dismissed)");
  226 |         },
  227 |       );
  228 |     }
  229 |   }
  230 | 
  231 |   // ── Canvas assertions ─────────────────────────────────────────────────────
  232 | 
  233 |   /**
  234 |    * Assert that a component of the given name is visible on the editor canvas.
  235 |    * Uses the data-marker map (confirmed markers from live analysis;
  236 |    * inferred markers from naming convention — validate during T-14).
  237 |    *
  238 |    * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
  239 |    */
  240 |   async assertComponentOnCanvas(componentName: string): Promise<void> {
  241 |     await this.step(
  242 |       `Assert "${componentName}" component is visible on canvas`,
  243 |       async () => {
  244 |         const marker = componentCanvasMarker(componentName);
  245 |         // Use .first() — the canvas may have multiple instances of the same component type
  246 |         // (e.g. a page template may already contain Text components). We just need at least one.
  247 |         await expect(
  248 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  249 |         ).toBeVisible({ timeout: 10_000 });
  250 |       },
  251 |     );
  252 |   }
  253 | 
  254 |   /**
  255 |    * Assert all 14 Design tab components are present on the canvas.
  256 |    * Call after addComponent() for each of the 14 components.
  257 |    */
  258 |   async assertAllComponentsOnCanvas(): Promise<void> {
  259 |     await this.step("Assert all 14 Design tab components are on canvas", async () => {
  260 |       for (const name of ALL_COMPONENT_NAMES) {
  261 |         const marker = componentCanvasMarker(name);
  262 |         // Use .first() — canvas may have multiple instances per component type
  263 |         await expect(
```