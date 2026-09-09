# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts >> SC-03: Page Builder — Audience association via Publish wizard >> PB-03: Associate the 'All Users' audience with a Page Builder page via the Publish wizard Step 3
- Location: tests/PageBuilder/pageBuilderAudienceAssociation.spec.ts:33:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('All Users')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('All Users')

```

```yaml
- main:
  - heading "Publish" [level=2]
  - text: "Step 1 of 5, Landing page details, completed Step 2 of 5, Pages, completed Step 3 of 5, Determine visibility, completed Step 4 of 5, Default homepage, completed Current step 5 of 5, Review and publish Summary Landing page details:"
  - button "Edit"
  - paragraph:
    - text: "Pages:"
    - button "Edit"
  - paragraph: All pages | 3 pages
  - paragraph:
    - text: "Determine visibility:"
    - button "Edit"
  - paragraph:
    - img
    - text: 1 Audience | 4237 users
  - text: "Set as default homepage:"
  - button "Edit"
  - paragraph: This page is not set as the default homepage for any audience
  - button "Cancel"
  - button "Publish page(s)"
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
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
  296 |    * Assert that an audience name is visible in the Step 5 review summary.
  297 |    * This validates that the audience selection in Step 3 was preserved.
  298 |    */
  299 |   async assertAudienceInReview(audienceName: string): Promise<void> {
  300 |     await this.step(
  301 |       `Assert audience "${audienceName}" is shown in Step 5 review summary`,
  302 |       async () => {
  303 |         await expect(
  304 |           this.page.getByText(audienceName),
> 305 |         ).toBeVisible({ timeout: 10_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  306 |       },
  307 |     );
  308 |   }
  309 | 
  310 |   /**
  311 |    * Assert the Step 5 review page edit buttons are visible.
  312 |    * Validates that Step 5 is fully rendered.
  313 |    */
  314 |   async assertStep5ReviewVisible(): Promise<void> {
  315 |     await this.step("Assert Step 5 (Review and publish) is visible", async () => {
  316 |       await this.waitForVisible(this.publishPageBtn, "Publish page(s) button");
  317 |       await this.waitForVisible(this.editAudienceBtn, "Edit audience button (data-marker=editAudienceButton)");
  318 |     });
  319 |   }
  320 | 
  321 |   /**
  322 |    * Click "Publish page(s)" to finalize and publish.
  323 |    *
  324 |    * ⚠️  Each publish consumes one slot from the 10-page cap.
  325 |    *     Prefer cancelAndLeave() in tests where publication is not required.
  326 |    */
  327 |   async publishPage(): Promise<void> {
  328 |     await this.step("Click 'Publish page(s)' — finalize publication", async () => {
  329 |       await this.click(this.publishPageBtn, "Publish page(s)");
  330 |     });
  331 |   }
  332 | 
  333 |   // ── Cancel flow (works from any step) ───────────────────────────────────────
  334 | 
  335 |   /**
  336 |    * Cancel the wizard and confirm "Yes, leave without saving".
  337 |    * Returns the editor to its pre-wizard state.
  338 |    *
  339 |    * This triggers [role="alertdialog"] — handled by clicking "Yes, leave without saving".
  340 |    */
  341 |   async cancelAndLeave(): Promise<void> {
  342 |     await this.step("Cancel Publish wizard — confirm 'Yes, leave without saving'", async () => {
  343 |       await this.click(this.cancelBtn, "Cancel button");
  344 |       await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
  345 |       await this.click(this.confirmLeaveBtn, "Yes, leave without saving");
  346 |       await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
  347 |     });
  348 |   }
  349 | 
  350 |   /**
  351 |    * Cancel the wizard but stay — click "No, keep working".
  352 |    * Dialog is dismissed and wizard remains open.
  353 |    */
  354 |   async cancelAndStay(): Promise<void> {
  355 |     await this.step("Cancel Publish wizard — click 'No, keep working' to stay", async () => {
  356 |       await this.click(this.cancelBtn, "Cancel button");
  357 |       await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
  358 |       await this.click(this.stayBtn, "No, keep working");
  359 |       await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
  360 |     });
  361 |   }
  362 | }
  363 | 
```