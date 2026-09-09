# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderComponents.spec.ts >> SC-01: Page Builder — Design tab component coverage >> PB-01: Add all 14 Design tab components to a new page and verify each appears on canvas
- Location: tests/PageBuilder/pageBuilderComponents.spec.ts:26:7

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
- text: Percipio
- dialog "Select video":
  - heading "Select video" [level=1]
  - button "Close"
  - heading "You can find all published custom video content. If the content is meant for specific users or audiences, make sure to select or create a version tailored for them to ensure proper access." [level=3]
  - log
  - text: English (US)
  - combobox
  - combobox "Search for content in English (US)"
  - button "Search" [disabled]
  - img
  - text: Search above to find video content to add.
  - button "Cancel"
  - button "Add video" [disabled]
```

# Test source

```ts
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
  148 |       // All palette tiles have aria-roledescription="draggable".
  149 |       // Basic components are located by exact accessible name.
  150 |       // Static/Dynamic components are located by end-of-string regex (long Lorem Ipsum prefix).
  151 |       // The .and([aria-roledescription="draggable"]) ensures we match the TILE ITSELF,
  152 |       // not nested <button> elements inside card preview content (e.g. disabled "Button"
  153 |       // inside "Text & Button Card" preview). Nested buttons lack aria-roledescription.
  154 |       const isBasic = BASIC_COMPONENT_NAMES.has(componentName);
  155 |       const nameLocator = isBasic
  156 |         ? this.page.getByRole("button", { name: componentName, exact: true })
  157 |         : (() => {
  158 |             const esc = componentName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  159 |             return this.page.getByRole("button", {
  160 |               name: new RegExp(esc + "$", "i"),
  161 |             });
  162 |           })();
  163 |       const source = this.panel
  164 |         .locator('[aria-roledescription="draggable"]')
  165 |         .and(nameLocator);
  166 |       await source.waitFor({ state: "visible", timeout: 10_000 });
  167 | 
  168 |       const sourceBB = await source.boundingBox();
  169 |       const panelBB = await this.panel.boundingBox();
  170 | 
  171 |       if (!sourceBB) {
  172 |         throw new Error(
  173 |           `Component button "${componentName}" not found in Design panel`,
  174 |         );
  175 |       }
  176 |       if (!panelBB) {
  177 |         throw new Error(
  178 |           "Design panel container not found — ensure Design tab is active and editor is in Edit mode",
  179 |         );
  180 |       }
  181 | 
  182 |       const srcX = sourceBB.x + sourceBB.width / 2;
  183 |       const srcY = sourceBB.y + sourceBB.height / 2;
  184 | 
  185 |       // Canvas target: 250px to the right of the panel, 40% down vertically
  186 |       const tgtX = panelBB.x + panelBB.width + 250;
  187 |       const tgtY = panelBB.y + panelBB.height * 0.4;
  188 | 
  189 |       // Pointer-event DnD: move → down → slight jiggle → smooth move to target → up
  190 |       await this.page.mouse.move(srcX, srcY);
  191 |       await this.page.mouse.down();
  192 |       await this.page.mouse.move(srcX + 2, srcY + 2); // trigger drag detection
  193 |       await this.page.mouse.move(tgtX, tgtY, { steps: 20 });
  194 |       await this.page.mouse.up();
  195 | 
  196 |       // Brief settle time for canvas animation
  197 |       await this.page.waitForTimeout(400);
  198 |     });
  199 |   }
  200 | 
  201 |   // ── Canvas assertions ─────────────────────────────────────────────────────
  202 | 
  203 |   /**
  204 |    * Assert that a component of the given name is visible on the editor canvas.
  205 |    * Uses the data-marker map (confirmed markers from live analysis;
  206 |    * inferred markers from naming convention — validate during T-14).
  207 |    *
  208 |    * @param componentName - Component display name (e.g. "Text", "Image & Text Card").
  209 |    */
  210 |   async assertComponentOnCanvas(componentName: string): Promise<void> {
  211 |     await this.step(
  212 |       `Assert "${componentName}" component is visible on canvas`,
  213 |       async () => {
  214 |         const marker = componentCanvasMarker(componentName);
  215 |         // Use .first() — the canvas may have multiple instances of the same component type
  216 |         // (e.g. a page template may already contain Text components). We just need at least one.
  217 |         await expect(
  218 |           this.page.locator(`[data-marker="${marker}"]`).first(),
> 219 |         ).toBeVisible({ timeout: 10_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  220 |       },
  221 |     );
  222 |   }
  223 | 
  224 |   /**
  225 |    * Assert all 14 Design tab components are present on the canvas.
  226 |    * Call after addComponent() for each of the 14 components.
  227 |    */
  228 |   async assertAllComponentsOnCanvas(): Promise<void> {
  229 |     await this.step("Assert all 14 Design tab components are on canvas", async () => {
  230 |       for (const name of ALL_COMPONENT_NAMES) {
  231 |         const marker = componentCanvasMarker(name);
  232 |         // Use .first() — canvas may have multiple instances per component type
  233 |         await expect(
  234 |           this.page.locator(`[data-marker="${marker}"]`).first(),
  235 |         ).toBeVisible({ timeout: 10_000 });
  236 |       }
  237 |     });
  238 |   }
  239 | 
  240 |   /**
  241 |    * Assert that the canvas shows the "Drag and drop items from Design panel"
  242 |    * instructional text — i.e., the canvas is currently empty.
  243 |    */
  244 |   async assertCanvasEmpty(): Promise<void> {
  245 |     await this.step("Assert canvas shows empty-state instructional text", async () => {
  246 |       await expect(
  247 |         this.page.getByText(/Drag and drop items from Design panel/i),
  248 |       ).toBeVisible();
  249 |     });
  250 |   }
  251 | }
  252 | 
  253 | // ── Component lists and marker map ────────────────────────────────────────────
  254 | 
  255 | /**
  256 |  * Set of Basic-section component names.
  257 |  * These buttons have exact accessible names matching the component label.
  258 |  * Static/Dynamic components have long Lorem Ipsum prefix names.
  259 |  * Used by addComponent() to choose the correct locator strategy.
  260 |  */
  261 | const BASIC_COMPONENT_NAMES = new Set([
  262 |   "Text",
  263 |   "Button",
  264 |   "Image",
  265 |   "Video",
  266 |   "Divider",
  267 |   "Dynamic Text",
  268 | ]);
  269 | 
  270 | /** All 14 component display names in order (Basic → Static → Dynamic). */
  271 | export const ALL_COMPONENT_NAMES: readonly string[] = [
  272 |   // Basic (6)
  273 |   "Text",
  274 |   "Button",
  275 |   "Image",
  276 |   "Video",
  277 |   "Divider",
  278 |   "Dynamic Text",
  279 |   // Static (4)
  280 |   "Image & Text Card",
  281 |   "Text & Button Card",
  282 |   "Image, Text & Button Card",
  283 |   "Profile Card",
  284 |   // Dynamic (4)
  285 |   "Dynamic Card",
  286 |   "Dynamic Strip",
  287 |   "Promoted Content Strip",
  288 |   "Promoted Banner",
  289 | ] as const;
  290 | 
  291 | /**
  292 |  * Map from component display name to its canvas data-marker value.
  293 |  *
  294 |  * ✅  Confirmed via live analysis (2026-05-25):
  295 |  *     Text → PageBuilder--text
  296 |  *     Image & Text Card → PageBuilder--imageTextCard
  297 |  *
  298 |  * _(inferred)_ — naming convention; validate during T-14 and update if incorrect:
  299 |  *     Button | Image | Video | Divider | Dynamic Text
  300 |  *     Text & Button Card | Image, Text & Button Card | Profile Card
  301 |  *     Dynamic Card | Dynamic Strip | Promoted Content Strip | Promoted Banner
  302 |  */
  303 | const COMPONENT_CANVAS_MARKERS: Record<string, string> = {
  304 |   // Basic
  305 |   "Text": "PageBuilder--text",                             // ✅ confirmed
  306 |   "Button": "PageBuilder--button",                         // _(inferred)_
  307 |   "Image": "PageBuilder--image",                           // _(inferred)_
  308 |   "Video": "PageBuilder--video",                           // _(inferred)_
  309 |   "Divider": "PageBuilder--divider",                       // _(inferred)_
  310 |   "Dynamic Text": "PageBuilder--dynamicText",              // _(inferred)_
  311 |   // Static
  312 |   "Image & Text Card": "PageBuilder--imageTextCard",       // ✅ confirmed
  313 |   "Text & Button Card": "PageBuilder--textButtonCard",     // _(inferred)_
  314 |   "Image, Text & Button Card": "PageBuilder--imageTextButtonCard", // _(inferred)_
  315 |   "Profile Card": "PageBuilder--profileCard",              // _(inferred)_
  316 |   // Dynamic
  317 |   "Dynamic Card": "PageBuilder--dynamicCard",              // _(inferred)_
  318 |   "Dynamic Strip": "PageBuilder--dynamicStrip",            // _(inferred)_
  319 |   "Promoted Content Strip": "PageBuilder--promotedContentStrip", // _(inferred)_
```