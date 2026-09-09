# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderFullE2E.spec.ts >> PB-E2E: Full Page Builder Workflow >> PB-E2E-01: All components → data → publish → learner validation
- Location: tests/PageBuilder/pageBuilderFullE2E.spec.ts:27:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Remove All Users/i }).or(getByRole('tabpanel').filter({ hasText: /All Users/i }).first()).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('button', { name: /Remove All Users/i }).or(getByRole('tabpanel').filter({ hasText: /All Users/i }).first()).first()

```

```yaml
- main:
  - heading "Publish" [level=2]
  - text: Step 1 of 5, Landing page details, completed Step 2 of 5, Pages, completed Current step 3 of 5, Determine visibility Step 4 of 5, Default homepage, not yet completed Step 5 of 5, Review and publish, not yet completed
  - heading "Search for audiences" [level=3]
  - heading [level=2]
  - textbox "Search for audiences": All Users
  - button "Search for All Users"
  - list
  - tablist:
    - tab "All audiences"
    - tab "Selected audiences" [selected]
  - tabpanel "Selected audiences": No results
  - text: Rows per page
  - combobox "Rows per page":
    - option "10" [selected]
    - option "25"
    - option "50"
  - navigation: No Results
  - button "Back to Pages"
  - button "Cancel"
  - 'button "Next: Default homepage" [disabled]'
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
  137 |       await this.waitForVisible(this.nextVisibilityBtn, "Step 2 — Next: Determine visibility button");
  138 |     });
  139 |   }
  140 | 
  141 |   // ── Step 2 ───────────────────────────────────────────────────────────────────
  142 | 
  143 |   async proceedToStep3(): Promise<void> {
  144 |     await this.step("Proceed to Step 3 (Determine visibility) — click Next: Determine visibility", async () => {
  145 |       await this.click(this.nextVisibilityBtn, "Next: Determine visibility");
  146 |       await this.waitForVisible(this.audienceSearchInput.first(), "Step 3 — audience search input");
  147 |     });
  148 |   }
  149 | 
  150 |   // ── Step 3 (Audience) ────────────────────────────────────────────────────────
  151 | 
  152 |   /**
  153 |    * Search for an audience in the Step 3 audience picker.
  154 |    * @param audienceName - Audience name to search for.
  155 |    */
  156 |   async searchForAudience(audienceName: string): Promise<void> {
  157 |     await this.step(`Search for audience: "${audienceName}"`, async () => {
  158 |       await this.fill(this.audienceSearchInput.first(), audienceName, "Audience search input");
  159 |     });
  160 |   }
  161 | 
  162 |   /**
  163 |    * Check whether an audience is already selected (its remove-chip is visible).
  164 |    *
  165 |    * ⚠️  Confirmed 2026-05-25: The audience picker shows a chip list above the
  166 |    *     tabpanel. Each selected audience has a `button "Remove <name> from the
  167 |    *     list."` chip. If the chip is visible the audience is already selected and
  168 |    *     clicking the "Select or deselect item" button would DESELECT it.
  169 |    */
  170 |   async isAudienceAlreadySelected(audienceName: string): Promise<boolean> {
  171 |     const removeChip = this.page.getByRole("button", {
  172 |       name: new RegExp(`Remove ${audienceName}`, "i"),
  173 |     });
  174 |     return removeChip.isVisible();
  175 |   }
  176 | 
  177 |   /**
  178 |    * Select an audience in the Step 3 audience picker.
  179 |    *
  180 |    * ⚠️  Confirmed 2026-05-25: The audience picker uses a custom component —
  181 |    *     audience items are NOT table rows. Each item is displayed as text
  182 |    *     ("Name N users") + a `button "Select or deselect item"` toggle inside
  183 |    *     `tabpanel "All audiences"`. Clicking the button when the audience is
  184 |    *     already selected DESELECTS it — call isAudienceAlreadySelected() first.
  185 |    *
  186 |    * @param audienceName - Audience name visible in the "All audiences" tabpanel.
  187 |    */
  188 |   async selectAudience(audienceName: string): Promise<void> {
  189 |     await this.step(`Select audience "${audienceName}" in Step 3`, async () => {
  190 |       const tabpanel = this.page.getByRole("tabpanel", { name: "All audiences" });
  191 |       await tabpanel.waitFor({ state: "visible" });
  192 | 
  193 |       // Wait for the audience text to appear (confirms search results loaded)
  194 |       await expect(
  195 |         tabpanel.getByText(audienceName, { exact: false }),
  196 |       ).toBeVisible({ timeout: 15_000 });
  197 | 
  198 |       // Click the "Select or deselect item" toggle button.
  199 |       // After searching there is typically 1 result, so .first() is safe.
  200 |       const toggleBtn = tabpanel
  201 |         .getByRole("button", { name: /select or deselect/i })
  202 |         .first();
  203 |       await this.click(toggleBtn, `Select/deselect toggle for "${audienceName}"`);
  204 |     });
  205 |   }
  206 | 
  207 |   /**
  208 |    * Assert an audience is visible in the Step 3 audience picker.
  209 |    *
  210 |    * ⚠️  Confirmed 2026-05-25: The audience picker uses custom components —
  211 |    *     audience names do NOT appear as table rows. Two reliable indicators:
  212 |    *
  213 |    *   (1) The remove-chip button "Remove <name> from the list." — always visible
  214 |    *       above the tablist whenever the audience is part of the page's audience set,
  215 |    *       regardless of which tab ("All audiences" / "Selected audiences") is active.
  216 |    *
  217 |    *   (2) A tabpanel whose text content includes the audience name — works when
  218 |    *       the audience row is rendered inside the active tabpanel.
  219 |    *
  220 |    *   We accept EITHER indicator so the assertion works from both tabs.
  221 |    */
  222 |   async assertAudienceInList(audienceName: string): Promise<void> {
  223 |     await this.step(
  224 |       `Assert audience "${audienceName}" is visible in the audience picker`,
  225 |       async () => {
  226 |         const removeChip = this.page.getByRole("button", {
  227 |           name: new RegExp(`Remove ${audienceName}`, "i"),
  228 |         });
  229 |         // Tabpanel that has the audience name in its text tree (active or visible one)
  230 |         const tabpanelWithAudience = this.page
  231 |           .getByRole("tabpanel")
  232 |           .filter({ hasText: new RegExp(audienceName, "i") })
  233 |           .first();
  234 | 
  235 |         await expect(
  236 |           removeChip.or(tabpanelWithAudience).first(),
> 237 |         ).toBeVisible({ timeout: 15_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  238 |       },
  239 |     );
  240 |   }
  241 | 
  242 |   /**
  243 |    * Switch to the "Selected audiences" tab to verify an audience was selected.
  244 |    */
  245 |   async switchToSelectedAudiencesTab(): Promise<void> {
  246 |     await this.step("Switch to 'Selected audiences' tab", async () => {
  247 |       await this.click(this.selectedAudiencesTab, "Selected audiences tab");
  248 |     });
  249 |   }
  250 | 
  251 |   async proceedToStep4(): Promise<void> {
  252 |     await this.step("Proceed to Step 4 (Default homepage) — click Next: Default homepage", async () => {
  253 |       await this.click(this.nextDefaultHomepageBtn, "Next: Default homepage");
  254 |       await this.waitForVisible(this.nextReviewBtn, "Step 4 — Next: Review and publish button");
  255 |     });
  256 |   }
  257 | 
  258 |   // ── Step 4 ───────────────────────────────────────────────────────────────────
  259 | 
  260 |   /**
  261 |    * Set the "Is this the default homepage?" option.
  262 |    *
  263 |    * ⚠️  Confirmed 2026-05-25: The radio buttons are custom-styled — the native
  264 |    *     <input type="radio"> is CSS-positioned off-viewport (absolute at 0,0 behind
  265 |    *     a visual wrapper). waitFor("visible") never resolves and click({ force:true })
  266 |    *     fails with "outside of viewport".
  267 |    *
  268 |    *     Fix: evaluate() calls el.click() directly via JavaScript, bypassing all
  269 |    *     Playwright viewport/visibility guards. This fires the click event from within
  270 |    *     the page context, which the React radio component handles correctly.
  271 |    *
  272 |    * @param yes - true = Yes; false = No.
  273 |    */
  274 |   async setDefaultHomepage(yes: boolean): Promise<void> {
  275 |     await this.step(
  276 |       `Set default homepage: ${yes ? "Yes" : "No"}`,
  277 |       async () => {
  278 |         const radio = yes ? this.defaultHomepageYes : this.defaultHomepageNo;
  279 |         await radio.first().waitFor({ state: "attached", timeout: 15_000 });
  280 |         // evaluate() calls the native DOM click() directly — bypasses CSS positioning
  281 |         await radio.first().evaluate((el: HTMLElement) => el.click());
  282 |       },
  283 |     );
  284 |   }
  285 | 
  286 |   async proceedToStep5(): Promise<void> {
  287 |     await this.step("Proceed to Step 5 (Review and publish) — click Next: Review and publish", async () => {
  288 |       await this.click(this.nextReviewBtn, "Next: Review and publish");
  289 |       await this.waitForVisible(this.publishPageBtn, "Step 5 — Publish page(s) button");
  290 |     });
  291 |   }
  292 | 
  293 |   // ── Step 5 ───────────────────────────────────────────────────────────────────
  294 | 
  295 |   /**
  296 |    * Assert that the audience association is confirmed in the Step 5 review summary.
  297 |    *
  298 |    * ⚠️  Confirmed 2026-05-25: The Step 5 review does NOT show the audience name.
  299 |    *     It shows an AGGREGATE count: "1 Audience | 4237 users".
  300 |    *     We accept either the audience name (if somehow shown) OR the aggregate
  301 |    *     count pattern `\d+ Audience` as proof that an audience is associated.
  302 |    *
  303 |    * @param audienceName - Audience name (accepted if visible, e.g. future UI change).
  304 |    */
  305 |   async assertAudienceInReview(audienceName: string): Promise<void> {
  306 |     await this.step(
  307 |       `Assert audience association is shown in Step 5 review summary ("${audienceName}" or count)`,
  308 |       async () => {
  309 |         // Step 5 shows "N Audience | M users" not the audience name itself
  310 |         await expect(
  311 |           this.page.getByText(audienceName, { exact: false })
  312 |             .or(this.page.getByText(/\d+\s+Audience/i))
  313 |             .first(),
  314 |         ).toBeVisible({ timeout: 10_000 });
  315 |       },
  316 |     );
  317 |   }
  318 | 
  319 |   /**
  320 |    * Assert the Step 5 review page edit buttons are visible.
  321 |    * Validates that Step 5 is fully rendered.
  322 |    */
  323 |   async assertStep5ReviewVisible(): Promise<void> {
  324 |     await this.step("Assert Step 5 (Review and publish) is visible", async () => {
  325 |       await this.waitForVisible(this.publishPageBtn, "Publish page(s) button");
  326 |       await this.waitForVisible(this.editAudienceBtn, "Edit audience button (data-marker=editAudienceButton)");
  327 |     });
  328 |   }
  329 | 
  330 |   /**
  331 |    * Click "Publish page(s)" to finalize and publish.
  332 |    *
  333 |    * ⚠️  Each publish consumes one slot from the 10-page cap.
  334 |    *     Prefer cancelAndLeave() in tests where publication is not required.
  335 |    */
  336 |   async publishPage(): Promise<void> {
  337 |     await this.step("Click 'Publish page(s)' — finalize publication", async () => {
```