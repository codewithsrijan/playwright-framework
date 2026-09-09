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
  - waiting for locator('[data-marker="pageBuilderDesignContent"]').locator('[aria-roledescription="draggable"]').and(getByRole('button', { name: /Promoted\ Content\ Strip$/i })) to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e9]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]:
            - button [ref=e16]:
              - img [ref=e18]
              - generic [ref=e20]: Back to Page Builder main
            - heading [level=1] [ref=e21]: PB Components cresco adeptio 1779777444797
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
                - button [ref=e35]:
                  - generic [ref=e36]: Edit
                - button [ref=e37]:
                  - generic [ref=e38]: Preview
            - listitem [ref=e39]:
              - button [ref=e40]:
                - generic [ref=e41]: Revert
            - listitem [ref=e42]:
              - button [ref=e43]:
                - generic [ref=e44]: Save
            - listitem [ref=e45]:
              - button [ref=e46]:
                - generic [ref=e47]: Publish
        - generic [ref=e48]:
          - generic [ref=e50]:
            - tablist [ref=e51]:
              - tab [ref=e52] [cursor=pointer]: Pages
              - tab [selected] [ref=e53] [cursor=pointer]: Design
            - tabpanel [ref=e54]:
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]: Basic
                  - generic [ref=e61]:
                    - button [ref=e62]:
                      - generic [ref=e63]:
                        - img [ref=e66]
                        - generic [ref=e68]: Text
                    - button [ref=e69]:
                      - generic [ref=e70]:
                        - img [ref=e73]
                        - generic [ref=e75]: Button
                    - button [ref=e76]:
                      - generic [ref=e77]:
                        - img [ref=e80]
                        - generic [ref=e83]: Image
                    - button [ref=e84]:
                      - generic [ref=e85]:
                        - img [ref=e88]
                        - generic [ref=e90]: Video
                    - button [ref=e91]:
                      - generic [ref=e92]:
                        - img [ref=e95]
                        - generic [ref=e97]: Divider
                    - button [ref=e98]:
                      - generic [ref=e99]:
                        - img [ref=e102]
                        - generic [ref=e104]: Dynamic Text
                - generic [ref=e105]:
                  - button [ref=e106] [cursor=pointer]:
                    - generic [ref=e107]:
                      - text: Static
                      - button [ref=e108]:
                        - img [ref=e110]
                    - generic [ref=e112]: Editable elements with images, text, and buttons in various combinations.
                  - generic [ref=e113]:
                    - button [ref=e114]:
                      - generic [ref=e115]:
                        - generic [ref=e118] [cursor=pointer]:
                          - img [ref=e119]
                          - generic [ref=e121]:
                            - heading [level=3] [ref=e122]: Lorem Ipsum Dolor Sit Amet
                            - generic [ref=e123]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo
                        - generic [ref=e124]: Image & Text Card
                    - button [ref=e125]:
                      - generic [ref=e126]:
                        - generic [ref=e129]:
                          - generic [ref=e131]:
                            - heading [level=3] [ref=e132]: Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing
                            - generic [ref=e133]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                          - generic [ref=e134]:
                            - button [disabled]:
                              - generic: Button
                        - generic [ref=e135]: Text & Button Card
                    - button [ref=e136]:
                      - generic [ref=e137]:
                        - generic [ref=e140]:
                          - img [ref=e141]
                          - generic [ref=e143]:
                            - heading [level=3] [ref=e144]: Lorem Ipsum Dolor Sit Amet
                            - generic [ref=e145]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e146]:
                            - button [disabled]:
                              - generic: Button
                        - generic [ref=e147]: Image, Text & Button Card
                    - button [ref=e148]:
                      - generic [ref=e149]:
                        - generic [ref=e152]:
                          - img [ref=e153]
                          - generic [ref=e155]:
                            - heading [level=3] [ref=e156]: Lorem Ipsum Dolor Sit Amet
                            - generic [ref=e157]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e158]:
                            - button [disabled]:
                              - generic: Button
                        - generic [ref=e159]: Profile Card
                - generic [ref=e160]:
                  - button [ref=e161] [cursor=pointer]:
                    - generic [ref=e162]:
                      - text: Dynamic
                      - button [ref=e163]:
                        - img [ref=e165]
                    - generic [ref=e167]: Elements managed outside the builder, ready to use on your pages.
                  - generic [ref=e168]:
                    - button [ref=e169]:
                      - generic [ref=e170]:
                        - generic [ref=e173] [cursor=pointer]:
                          - generic:
                            - generic:
                              - generic: DYNAMIC CONTENT TYPE
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e174]: Dynamic Card
                    - button [ref=e175]:
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
                    - button [ref=e193]:
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
                    - button [ref=e212]:
                      - generic [ref=e213]:
                        - generic [ref=e216] [cursor=pointer]:
                          - generic:
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e217]: Promoted Banner
          - generic [ref=e226]:
            - button [ref=e227]:
              - heading [level=1] [ref=e235]: "Welcome to the Academy: Your Gateway to Growth & Success"
            - button [ref=e236]:
              - generic [ref=e240]:
                - generic [ref=e241]: This is a title of the dynamic strip
                - generic [ref=e242]:
                  - generic [ref=e244] [cursor=pointer]:
                    - generic:
                      - generic:
                        - generic: CONTENT TYPE
                      - generic: Content type
                  - generic [ref=e246] [cursor=pointer]:
                    - generic:
                      - generic:
                        - generic: CONTENT TYPE
                      - generic: Content type
                  - generic [ref=e248] [cursor=pointer]:
                    - generic:
                      - generic:
                        - generic: CONTENT TYPE
                      - generic: Content type
                  - generic [ref=e250] [cursor=pointer]:
                    - generic:
                      - generic:
                        - generic: CONTENT TYPE
                      - generic: Content type
            - button [ref=e251]:
              - generic [ref=e256] [cursor=pointer]:
                - generic:
                  - generic:
                    - generic: DYNAMIC CONTENT TYPE
                  - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
            - button [ref=e257]:
              - generic [ref=e262]:
                - img [ref=e263]
                - generic [ref=e265]:
                  - heading [level=3] [ref=e266]: Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tem
                  - generic [ref=e267]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volu
                - button [ref=e269]:
                  - generic [ref=e270]: Button
            - button [ref=e271]:
              - generic [ref=e276]:
                - img [ref=e277]
                - generic [ref=e279]:
                  - heading [level=3] [ref=e280]: Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor incididunt Ut L
                  - generic [ref=e281]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commo
                - button [ref=e283]:
                  - generic [ref=e284]: Button
            - button [ref=e285]:
              - paragraph [ref=e293]:
                - text: The Academy is your
                - strong [ref=e294]: centralized resource
                - text: for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities.
                - strong [ref=e295]: Choose your function from the options below to begin exploring your learning and growth opportunities.
            - button [ref=e296]:
              - generic [ref=e302]: Lorem ipsum dolor sit amet test
            - button [ref=e303]:
              - generic [ref=e308]:
                - generic [ref=e310]:
                  - heading [level=3] [ref=e311]: Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed
                  - generic [ref=e312]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostr
                - button [ref=e314]:
                  - generic [ref=e315]: Button
            - button [ref=e316]:
              - paragraph [ref=e322]: "Greetings, {Name}! Explore, discover, and master new skills."
            - button [ref=e323]:
              - generic [ref=e328] [cursor=pointer]:
                - img [ref=e329]
                - generic [ref=e331]:
                  - heading [level=3] [ref=e332]: Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed
                  - generic [ref=e333]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            - button [ref=e334]:
              - img [ref=e341]
            - button [ref=e342]
            - button [ref=e348]:
              - generic [ref=e353]:
                - button [disabled]:
                  - generic: Label
            - button [ref=e354]:
              - generic [ref=e359] [cursor=pointer]:
                - img [ref=e360]
                - generic [ref=e362]:
                  - heading [level=3] [ref=e363]: Digital Academy
                  - generic [ref=e364]: Master essential and advanced digital skills to stay ahead.
            - button [ref=e365]:
              - generic [ref=e370] [cursor=pointer]:
                - img [ref=e371]
                - generic [ref=e373]:
                  - heading [level=3] [ref=e374]: Data Science Academy
                  - generic [ref=e375]: Learn to analyze, visualize, and derive insights from data to drive better decisions.
            - button [ref=e376]:
              - generic [ref=e381] [cursor=pointer]:
                - img [ref=e382]
                - generic [ref=e384]:
                  - heading [level=3] [ref=e385]: Cybersecurity Academy
                  - generic [ref=e386]: Master skills to secure data, manage risks, and defend against cyber threats.
            - button [ref=e387]:
              - generic [ref=e392] [cursor=pointer]:
                - img [ref=e393]
                - generic [ref=e395]:
                  - heading [level=3] [ref=e396]: Cloud Engineering Academy
                  - generic [ref=e397]: Explore cloud computing and learn to implement scalable solutions
            - button [ref=e398]:
              - generic [ref=e403] [cursor=pointer]:
                - img [ref=e404]
                - generic [ref=e406]:
                  - heading [level=3] [ref=e407]: Sales Academy
                  - generic [ref=e408]: Gain skills and strategies to drive revenue and build client relationships.
            - button [ref=e409]:
              - generic [ref=e414] [cursor=pointer]:
                - img [ref=e415]
                - generic [ref=e417]:
                  - heading [level=3] [ref=e418]: Global Marketing Academy
                  - generic [ref=e419]: Learn to engage diverse audiences with innovative marketing.
            - button [ref=e420]:
              - generic [ref=e425] [cursor=pointer]:
                - img [ref=e426]
                - generic [ref=e428]:
                  - heading [level=3] [ref=e429]: Product Management Academy
                  - generic [ref=e430]: Create and optimize products that drive success and meet customer needs.
            - button [ref=e431]:
              - generic [ref=e436] [cursor=pointer]:
                - img [ref=e437]
                - generic [ref=e439]:
                  - heading [level=3] [ref=e440]: Logistics & Supply Academy
                  - generic [ref=e441]: Boost efficiency and resilience in supply chain management.
        - status [ref=e442]: Draggable item DynamicStrip was dropped.
    - log [ref=e443]
    - log [ref=e444]
    - log [ref=e445]
    - log [ref=e446]
  - generic [ref=e447]: Percipio
  - alertdialog "Configure dynamic strip" [active] [ref=e449]:
    - generic [ref=e451]:
      - generic [ref=e452]:
        - heading "Configure dynamic strip" [level=1] [ref=e454]
        - button "Close" [ref=e456]:
          - img [ref=e458]
      - generic [ref=e460]:
        - generic [ref=e461]: Select the type of recommendation to display in your dynamic strip.Your selection will be used as the strip title and cannot be changed later. You can customize the layout in the next step.
        - generic [ref=e462]:
          - button "Top picks for role Displays content tailored to the learner's role." [ref=e463] [cursor=pointer]:
            - generic [ref=e464]:
              - radio
            - generic [ref=e467]:
              - img [ref=e470]
              - generic [ref=e472]:
                - generic [ref=e473]: Top picks for role
                - generic [ref=e474]: Displays content tailored to the learner's role.
          - button "Based on skill interest Personalized content aligned with skill interests." [ref=e475] [cursor=pointer]:
            - generic [ref=e476]:
              - radio
            - generic [ref=e479]:
              - img [ref=e482]
              - generic [ref=e484]:
                - generic [ref=e485]: Based on skill interest
                - generic [ref=e486]: Personalized content aligned with skill interests.
          - button "Recommendations for learners General recommendations tailored to the learner's profiles." [ref=e487] [cursor=pointer]:
            - generic [ref=e488]:
              - radio
            - generic [ref=e491]:
              - img [ref=e494]
              - generic [ref=e496]:
                - generic [ref=e497]: Recommendations for learners
                - generic [ref=e498]: General recommendations tailored to the learner's profiles.
          - button "Learner activity Displays learner activity across various learning activities." [ref=e499] [cursor=pointer]:
            - generic [ref=e500]:
              - radio
            - generic [ref=e503]:
              - img [ref=e506]
              - generic [ref=e508]:
                - generic [ref=e509]: Learner activity
                - generic [ref=e510]: Displays learner activity across various learning activities.
      - generic [ref=e512]:
        - button "Cancel" [ref=e513]:
          - generic [ref=e514]: Cancel
        - button "Customize" [ref=e515]:
          - generic [ref=e516]: Customize
```

# Test source

```ts
  79  |   }
  80  | 
  81  |   // ── Accordion management ──────────────────────────────────────────────────
  82  | 
  83  |   /**
  84  |    * Ensure the Static section is expanded so its components are visible.
  85  |    * Idempotent — only clicks the toggle if "Image & Text Card" is not already visible.
  86  |    *
  87  |    * ⚠️  Confirmed 2026-05-25:
  88  |    *   - Static/Dynamic sections are EXPANDED by default when Design tab opens.
  89  |    *   - The toggle button may NOT have an aria-expanded attribute — do not rely on
  90  |    *     getAttribute("aria-expanded") for the expanded/collapsed state check.
  91  |    *     Use component visibility instead.
  92  |    *   - Component buttons use long accessible names that END WITH the component
  93  |    *     label (e.g. "Lorem Ipsum... Image & Text Card"). Use end-of-string regex.
  94  |    */
  95  |   async expandStaticSection(): Promise<void> {
  96  |     await this.step("Expand Static components section (accordion)", async () => {
  97  |       await this.staticSectionToggle.waitFor({ state: "visible", timeout: 10_000 });
  98  | 
  99  |       // Check visibility directly — aria-expanded may not be present
  100 |       const firstStaticItem = this.panel.getByRole("button", {
  101 |         name: /Image & Text Card$/i,
  102 |       });
  103 |       const isAlreadyVisible = await firstStaticItem.isVisible();
  104 |       if (!isAlreadyVisible) {
  105 |         await this.click(this.staticSectionToggle, "Static section toggle");
  106 |       }
  107 | 
  108 |       await expect(firstStaticItem).toBeVisible({ timeout: 10_000 });
  109 |     });
  110 |   }
  111 | 
  112 |   /**
  113 |    * Ensure the Dynamic section is expanded so its components are visible.
  114 |    * Idempotent — only clicks the toggle if "Dynamic Card" is not already visible.
  115 |    *
  116 |    * Same constraints as expandStaticSection().
  117 |    */
  118 |   async expandDynamicSection(): Promise<void> {
  119 |     await this.step("Expand Dynamic components section (accordion)", async () => {
  120 |       await this.dynamicSectionToggle.waitFor({ state: "visible", timeout: 10_000 });
  121 | 
  122 |       const firstDynamicItem = this.panel.getByRole("button", {
  123 |         name: /Dynamic Card$/i,
  124 |       });
  125 |       const isAlreadyVisible = await firstDynamicItem.isVisible();
  126 |       if (!isAlreadyVisible) {
  127 |         await this.click(this.dynamicSectionToggle, "Dynamic section toggle");
  128 |       }
  129 | 
  130 |       await expect(firstDynamicItem).toBeVisible({ timeout: 10_000 });
  131 |     });
  132 |   }
  133 | 
  134 |   // ── Component placement ───────────────────────────────────────────────────
  135 | 
  136 |   /**
  137 |    * Drag a component from the Design palette onto the editor canvas.
  138 |    *
  139 |    * The component button in the panel is the drag source.
  140 |    * The canvas target position is calculated as 250px to the right of the
  141 |    * panel's right edge, at 40% of the panel's vertical height.
  142 |    *
  143 |    * Strategy: pointer-event based mouse simulation (not HTML5 DnD).
  144 |    *
  145 |    * @param componentName - Exact component label (e.g. "Text", "Image & Text Card").
  146 |    */
  147 |   async addComponent(componentName: string): Promise<void> {
  148 |     await this.step(`Drag "${componentName}" from Design panel to canvas`, async () => {
  149 |       // Locate the draggable palette tile.
  150 |       //
  151 |       // Three classes of ambiguity require confirmed IDs (see CONFIRMED_SIDEBAR_IDS):
  152 |       //   1. "Text" is a suffix of "Dynamic Text" → both match /Text$/i
  153 |       //   2. "Button" exact-name matches nested disabled <button> inside card previews
  154 |       //   3. "Text & Button Card" is a suffix of "Image, Text & Button Card"
  155 |       //
  156 |       // All other component names are unique across the design panel:
  157 |       //   - Basic (Image, Video, Divider) have exact, conflict-free names
  158 |       //   - Static Image & Text Card, Profile Card end-of-string are unique
  159 |       //   - Dynamic components (Dynamic Card, Strip, Promoted*) are unique
  160 |       // For those, use aria-roledescription="draggable" + name matching.
  161 |       const confirmedId = CONFIRMED_SIDEBAR_IDS[componentName];
  162 |       let source;
  163 |       if (confirmedId) {
  164 |         source = this.panel.locator(`#${confirmedId}`);
  165 |       } else {
  166 |         const isBasicName = BASIC_COMPONENT_NAMES.has(componentName);
  167 |         const nameLocator = isBasicName
  168 |           ? this.page.getByRole("button", { name: componentName, exact: true })
  169 |           : (() => {
  170 |               const esc = componentName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  171 |               return this.page.getByRole("button", {
  172 |                 name: new RegExp(esc + "$", "i"),
  173 |               });
  174 |             })();
  175 |         source = this.panel
  176 |           .locator('[aria-roledescription="draggable"]')
  177 |           .and(nameLocator);
  178 |       }
> 179 |       await source.waitFor({ state: "visible", timeout: 10_000 });
      |                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  180 | 
  181 |       // Scroll the sidebar tile into the viewport before dragging.
  182 |       // The design panel is part of the main page scroll container (confirmed 2026-05-26
  183 |       // via MCP: no intermediate scroll ancestor between sidebar tiles and body).
  184 |       // After earlier drags scrolled the canvas down to show placed components, the
  185 |       // page scrolls down — pushing later sidebar tiles (e.g. Text & Button Card,
  186 |       // Image, Text & Button Card) below the viewport fold (y > 720).
  187 |       // Without this scroll, sourceBB.y > viewportHeight and mouse.move(srcX, srcY)
  188 |       // lands outside the viewport, causing the drag to silently do nothing.
  189 |       await source.scrollIntoViewIfNeeded();
  190 | 
  191 |       const sourceBB = await source.boundingBox();
  192 |       const panelBB = await this.panel.boundingBox();
  193 | 
  194 |       if (!sourceBB) {
  195 |         throw new Error(
  196 |           `Component button "${componentName}" not found in Design panel`,
  197 |         );
  198 |       }
  199 |       if (!panelBB) {
  200 |         throw new Error(
  201 |           "Design panel container not found — ensure Design tab is active and editor is in Edit mode",
  202 |         );
  203 |       }
  204 | 
  205 |       const srcX = sourceBB.x + sourceBB.width / 2;
  206 |       const srcY = sourceBB.y + sourceBB.height / 2;
  207 | 
  208 |       // Canvas target: 250px to the right of the panel.
  209 |       //
  210 |       // Y coordinate: the design panel (no fixed/sticky CSS) scrolls with the page.
  211 |       // When source.scrollIntoViewIfNeeded() pulls a lower sidebar tile (e.g.
  212 |       // Text & Button Card at doc-y ≈ 800, Image, Text & Button Card at doc-y ≈ 1073)
  213 |       // into view, the page scrolls DOWN — pushing panelBB.y negative (panel top above
  214 |       // viewport fold). panelBB.y + height*0.4 can therefore go negative too.
  215 |       // Confirmed 2026-05-26 via live MCP: no intermediate scroll container between
  216 |       // the sidebar tiles and <body>; the whole page scrolls as one unit.
  217 |       //
  218 |       // Fix: clamp tgtY to [200, viewportH - 100] so we always land on a valid
  219 |       // canvas drop zone regardless of how far the page has scrolled.
  220 |       // 200 is safely below the fixed nav (75 px) + editor toolbar (≈ 62 px);
  221 |       // viewport-height minus 100 avoids the bottom chrome.
  222 |       const viewportH = await this.page.evaluate(() => window.innerHeight);
  223 |       const tgtX = panelBB.x + panelBB.width + 250;
  224 |       const rawTgtY = panelBB.y + panelBB.height * 0.4;
  225 |       const tgtY = Math.max(200, Math.min(viewportH - 100, rawTgtY));
  226 | 
  227 |       // Snapshot all canvas grid-item IDs BEFORE the drag.
  228 |       // Every canvas element gets a unique id="grid-item-{uuid}" on placement.
  229 |       // After the drag we diff the before/after sets to find the exact new element,
  230 |       // regardless of where it was inserted in the DOM (new items are NOT always appended
  231 |       // at the end — they are inserted at the drop-zone position).
  232 |       // Confirmed via live MCP inspection 2026-05-25.
  233 |       const prevGridIds = await this.page.evaluate(() =>
  234 |         Array.from(document.querySelectorAll('[id^="grid-item-"]')).map((e) => e.id),
  235 |       );
  236 | 
  237 |       // ── Drag implementation ────────────────────────────────────────────────
  238 |       // Static/Dynamic card tiles contain long Lorem Ipsum text. Without disabling
  239 |       // user-select, mouse.down() + mouse.move() is interpreted as TEXT SELECTION
  240 |       // rather than a drag gesture — the card never actually drags.
  241 |       //
  242 |       // Fix (confirmed 2026-05-25):
  243 |       //   1. Set document.body style "user-select: none" before the drag gesture
  244 |       //      to suppress text selection on all elements for the duration.
  245 |       //   2. Small pause (80 ms) after mouse.down() so the browser registers the
  246 |       //      press as a potential drag, not a click-select.
  247 |       //   3. Larger initial jiggle (8 px, 3 steps) to cross the browser's drag-
  248 |       //      detection threshold before the main move.
  249 |       //   4. Restore user-select after mouse.up().
  250 |       await this.page.evaluate(
  251 |         () => { (document.body.style as CSSStyleDeclaration).userSelect = "none"; },
  252 |       );
  253 |       try {
  254 |         await this.page.mouse.move(srcX, srcY);
  255 |         await this.page.mouse.down();
  256 |         await this.page.waitForTimeout(80);                              // let browser register press
  257 |         await this.page.mouse.move(srcX + 8, srcY + 8, { steps: 3 });  // cross drag-detection threshold
  258 |         await this.page.mouse.move(tgtX, tgtY, { steps: 25 });          // smooth travel to canvas
  259 |         await this.page.mouse.up();
  260 |       } finally {
  261 |         await this.page.evaluate(
  262 |           () => { (document.body.style as CSSStyleDeclaration).userSelect = ""; },
  263 |         );
  264 |       }
  265 | 
  266 |       // Brief settle time for canvas animation
  267 |       await this.page.waitForTimeout(400);
  268 | 
  269 |       // Some components open a configuration picker after being dropped (e.g. Video → "Select video").
  270 |       // Dismiss via Cancel so the placeholder lands on canvas and the test can continue.
  271 |       await this.dismissPickerDialogIfOpen();
  272 | 
  273 |       // ── Scroll to dropped component, then screenshot ──────────────────────
  274 |       // The canvas may extend below the viewport fold. Scroll the newly placed
  275 |       // component into view before capturing so the screenshot shows exactly
  276 |       // where the component landed rather than an unrelated part of the canvas.
  277 |       await this.scrollToLastPlacedComponent(
  278 |         componentName,
  279 |         prevGridIds,
```