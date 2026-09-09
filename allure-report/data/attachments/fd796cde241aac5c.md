# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts >> SC-03: Page Builder — Audience association via Publish wizard >> PB-03: Associate the 'All Users' audience with a Page Builder page via the Publish wizard Step 3
- Location: tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts:33:7

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 300000ms exceeded.
Call log:
  - waiting for getByRole('radio', { name: 'No' }).or(getByLabel('No')).first() to be visible
    575 × locator resolved to hidden <input checked value="" type="radio" aria-hidden="false" id="defaultHomepageNo" name="defaultHomepage" class="RadioButton---input---Y8bG0" aria-labelledby="label-for-defaultHomepageNo"/>

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e9]:
      - generic [ref=e12]:
        - heading "Publish" [level=2] [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e18]:
            - generic [ref=e19]: Step 1 of 5, Landing page details, completed
            - generic [ref=e20]:
              - generic [ref=e21]:
                - generic [ref=e22]: "1"
                - img [ref=e25]
              - generic [ref=e29]: Landing page details
            - generic [ref=e30]: Step 2 of 5, Pages, completed
            - generic [ref=e31]:
              - generic [ref=e32]:
                - generic [ref=e33]: "2"
                - img [ref=e36]
              - generic [ref=e40]: Pages
            - generic [ref=e41]: Step 3 of 5, Determine visibility, completed
            - generic [ref=e42]:
              - generic [ref=e43]:
                - generic [ref=e44]: "3"
                - img [ref=e47]
              - generic [ref=e51]: Determine visibility
            - generic [ref=e52]: Current step 4 of 5, Default homepage
            - generic [ref=e53]:
              - generic [ref=e54]:
                - generic [ref=e55]: "4"
                - img [ref=e58]
              - generic [ref=e62]: Default homepage
            - generic [ref=e63]: Step 5 of 5, Review and publish, not yet completed
            - generic [ref=e64]:
              - generic [ref=e65]:
                - generic [ref=e66]: "5"
                - img [ref=e69]
              - generic [ref=e72]: Review and publish
          - generic [ref=e75]:
            - generic [ref=e81]:
              - heading "Set as default homepage" [level=3] [ref=e82]
              - paragraph [ref=e83]: Do you want to set this page as the default homepage?
              - generic [ref=e84]:
                - generic [ref=e85] [cursor=pointer]:
                  - radio "Yes"
                  - generic [ref=e87]: "Yes"
                - generic [ref=e88] [cursor=pointer]:
                  - radio "No" [checked]
                  - generic [ref=e90]: "No"
            - generic [ref=e91]:
              - button "Back to Determine visibility" [ref=e95]:
                - img [ref=e97]
                - generic [ref=e99]: Back to Determine visibility
              - generic [ref=e102]:
                - button "Cancel" [ref=e103]:
                  - generic [ref=e104]: Cancel
                - 'button "Next: Review and publish" [active] [ref=e105]':
                  - generic [ref=e106]: "Next: Review and publish"
    - generic:
      - log [ref=e107]
      - log [ref=e108]
      - log [ref=e109]
      - log [ref=e110]
  - generic [ref=e111]: Percipio
```

# Test source

```ts
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
  237 |         ).toBeVisible({ timeout: 15_000 });
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
  262 |    * @param yes - true = Yes; false = No.
  263 |    */
  264 |   async setDefaultHomepage(yes: boolean): Promise<void> {
  265 |     await this.step(
  266 |       `Set default homepage: ${yes ? "Yes" : "No"}`,
  267 |       async () => {
  268 |         const radio = yes ? this.defaultHomepageYes : this.defaultHomepageNo;
> 269 |         await radio.first().waitFor({ state: "visible" });
      |                             ^ Error: locator.waitFor: Test timeout of 300000ms exceeded.
  270 |         await radio.first().click();
  271 |       },
  272 |     );
  273 |   }
  274 | 
  275 |   async proceedToStep5(): Promise<void> {
  276 |     await this.step("Proceed to Step 5 (Review and publish) — click Next: Review and publish", async () => {
  277 |       await this.click(this.nextReviewBtn, "Next: Review and publish");
  278 |       await this.waitForVisible(this.publishPageBtn, "Step 5 — Publish page(s) button");
  279 |     });
  280 |   }
  281 | 
  282 |   // ── Step 5 ───────────────────────────────────────────────────────────────────
  283 | 
  284 |   /**
  285 |    * Assert that an audience name is visible in the Step 5 review summary.
  286 |    * This validates that the audience selection in Step 3 was preserved.
  287 |    */
  288 |   async assertAudienceInReview(audienceName: string): Promise<void> {
  289 |     await this.step(
  290 |       `Assert audience "${audienceName}" is shown in Step 5 review summary`,
  291 |       async () => {
  292 |         await expect(
  293 |           this.page.getByText(audienceName),
  294 |         ).toBeVisible({ timeout: 10_000 });
  295 |       },
  296 |     );
  297 |   }
  298 | 
  299 |   /**
  300 |    * Assert the Step 5 review page edit buttons are visible.
  301 |    * Validates that Step 5 is fully rendered.
  302 |    */
  303 |   async assertStep5ReviewVisible(): Promise<void> {
  304 |     await this.step("Assert Step 5 (Review and publish) is visible", async () => {
  305 |       await this.waitForVisible(this.publishPageBtn, "Publish page(s) button");
  306 |       await this.waitForVisible(this.editAudienceBtn, "Edit audience button (data-marker=editAudienceButton)");
  307 |     });
  308 |   }
  309 | 
  310 |   /**
  311 |    * Click "Publish page(s)" to finalize and publish.
  312 |    *
  313 |    * ⚠️  Each publish consumes one slot from the 10-page cap.
  314 |    *     Prefer cancelAndLeave() in tests where publication is not required.
  315 |    */
  316 |   async publishPage(): Promise<void> {
  317 |     await this.step("Click 'Publish page(s)' — finalize publication", async () => {
  318 |       await this.click(this.publishPageBtn, "Publish page(s)");
  319 |     });
  320 |   }
  321 | 
  322 |   // ── Cancel flow (works from any step) ───────────────────────────────────────
  323 | 
  324 |   /**
  325 |    * Cancel the wizard and confirm "Yes, leave without saving".
  326 |    * Returns the editor to its pre-wizard state.
  327 |    *
  328 |    * This triggers [role="alertdialog"] — handled by clicking "Yes, leave without saving".
  329 |    */
  330 |   async cancelAndLeave(): Promise<void> {
  331 |     await this.step("Cancel Publish wizard — confirm 'Yes, leave without saving'", async () => {
  332 |       await this.click(this.cancelBtn, "Cancel button");
  333 |       await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
  334 |       await this.click(this.confirmLeaveBtn, "Yes, leave without saving");
  335 |       await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
  336 |     });
  337 |   }
  338 | 
  339 |   /**
  340 |    * Cancel the wizard but stay — click "No, keep working".
  341 |    * Dialog is dismissed and wizard remains open.
  342 |    */
  343 |   async cancelAndStay(): Promise<void> {
  344 |     await this.step("Cancel Publish wizard — click 'No, keep working' to stay", async () => {
  345 |       await this.click(this.cancelBtn, "Cancel button");
  346 |       await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
  347 |       await this.click(this.stayBtn, "No, keep working");
  348 |       await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
  349 |     });
  350 |   }
  351 | }
  352 | 
```