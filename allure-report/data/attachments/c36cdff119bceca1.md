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

Locator: getByRole('row').filter({ hasText: 'All Users' })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('row').filter({ hasText: 'All Users' })

```

```yaml
- main:
  - heading "Publish" [level=2]
  - text: Step 1 of 5, Landing page details, completed Step 2 of 5, Pages, completed Current step 3 of 5, Determine visibility Step 4 of 5, Default homepage, not yet completed Step 5 of 5, Review and publish, not yet completed
  - heading "Search for audiences" [level=3]
  - heading [level=2]
  - textbox "Search for audiences"
  - button "Search for"
  - list:
    - listitem:
      - button "Remove All Users from the list.":
        - img
  - tablist:
    - tab "All audiences" [selected]
    - tab "Selected audiences"
  - tabpanel "All audiences":
    - text: Showing all results
    - img
    - text: All Users 4237 users
    - button "Select or deselect item"
  - text: Rows per page
  - combobox "Rows per page":
    - option "10" [selected]
    - option "25"
    - option "50"
  - navigation: 1 – 1 of 1
  - button "Back to Pages"
  - button "Cancel"
  - 'button "Next: Default homepage"'
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
  88  |   private readonly publishPageBtn = this.page.getByRole("button", {
  89  |     name: "Publish page(s)",
  90  |   });
  91  | 
  92  |   // ── Cancel / Leave dialog (appears on ANY Cancel click) ──────────────────────
  93  |   private readonly cancelBtn = this.page.getByRole("button", {
  94  |     name: "Cancel",
  95  |   });
  96  |   private readonly alertDialog = this.page.getByRole("alertdialog");
  97  |   private readonly confirmLeaveBtn = this.page.getByRole("button", {
  98  |     name: "Yes, leave without saving",
  99  |   });
  100 |   private readonly stayBtn = this.page.getByRole("button", {
  101 |     name: "No, keep working",
  102 |   });
  103 | 
  104 |   constructor(page: Page) {
  105 |     super(page);
  106 |   }
  107 | 
  108 |   // ── Step 1 ───────────────────────────────────────────────────────────────────
  109 | 
  110 |   /**
  111 |    * Assert Step 1 (Landing Page Details) is visible.
  112 |    * Call after PageBuilderEditorPage.clickPublish().
  113 |    */
  114 |   async assertStep1Visible(): Promise<void> {
  115 |     await this.step("Assert Publish wizard Step 1 (Landing page details) is visible", async () => {
  116 |       await this.waitForVisible(this.step1TitleInput, "Step 1 — page title input");
  117 |       await this.waitForVisible(this.nextPagesBtn, "Step 1 — Next: Pages button");
  118 |     });
  119 |   }
  120 | 
  121 |   /**
  122 |    * Fill Step 1 form fields (title already pre-filled from page creation).
  123 |    * Call this only if you need to change the title in the wizard.
  124 |    * @param title - New page title (max 48 chars).
  125 |    */
  126 |   async fillStep1Title(title: string): Promise<void> {
  127 |     await this.step(`Fill Step 1 title: "${title}"`, async () => {
  128 |       await this.step1TitleInput.waitFor({ state: "visible" });
  129 |       await this.step1TitleInput.clear();
  130 |       await this.fill(this.step1TitleInput, title, "Step 1 — page title");
  131 |     });
  132 |   }
  133 | 
  134 |   async proceedToStep2(): Promise<void> {
  135 |     await this.step("Proceed to Step 2 (Pages) — click Next: Pages", async () => {
  136 |       await this.click(this.nextPagesBtn, "Next: Pages");
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
  163 |    * Select an audience row from the Step 3 audience table.
  164 |    * Clicks the row containing the audience name.
  165 |    *
  166 |    * @param audienceName - Audience name visible in the table row.
  167 |    */
  168 |   async selectAudience(audienceName: string): Promise<void> {
  169 |     await this.step(`Select audience "${audienceName}" in Step 3`, async () => {
  170 |       const audienceRow = this.page
  171 |         .getByRole("row")
  172 |         .filter({ hasText: audienceName })
  173 |         .first();
  174 |       await this.waitForVisible(audienceRow, `Audience row: "${audienceName}"`);
  175 |       await this.click(audienceRow, `Audience row: "${audienceName}"`);
  176 |     });
  177 |   }
  178 | 
  179 |   /**
  180 |    * Assert an audience name is visible in the audience table (Step 3).
  181 |    */
  182 |   async assertAudienceInList(audienceName: string): Promise<void> {
  183 |     await this.step(
  184 |       `Assert audience "${audienceName}" is visible in the audience picker`,
  185 |       async () => {
  186 |         await expect(
  187 |           this.page.getByRole("row").filter({ hasText: audienceName }),
> 188 |         ).toBeVisible({ timeout: 15_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
  189 |       },
  190 |     );
  191 |   }
  192 | 
  193 |   /**
  194 |    * Switch to the "Selected audiences" tab to verify an audience was selected.
  195 |    */
  196 |   async switchToSelectedAudiencesTab(): Promise<void> {
  197 |     await this.step("Switch to 'Selected audiences' tab", async () => {
  198 |       await this.click(this.selectedAudiencesTab, "Selected audiences tab");
  199 |     });
  200 |   }
  201 | 
  202 |   async proceedToStep4(): Promise<void> {
  203 |     await this.step("Proceed to Step 4 (Default homepage) — click Next: Default homepage", async () => {
  204 |       await this.click(this.nextDefaultHomepageBtn, "Next: Default homepage");
  205 |       await this.waitForVisible(this.nextReviewBtn, "Step 4 — Next: Review and publish button");
  206 |     });
  207 |   }
  208 | 
  209 |   // ── Step 4 ───────────────────────────────────────────────────────────────────
  210 | 
  211 |   /**
  212 |    * Set the "Is this the default homepage?" option.
  213 |    * @param yes - true = Yes; false = No.
  214 |    */
  215 |   async setDefaultHomepage(yes: boolean): Promise<void> {
  216 |     await this.step(
  217 |       `Set default homepage: ${yes ? "Yes" : "No"}`,
  218 |       async () => {
  219 |         const radio = yes ? this.defaultHomepageYes : this.defaultHomepageNo;
  220 |         await radio.first().waitFor({ state: "visible" });
  221 |         await radio.first().click();
  222 |       },
  223 |     );
  224 |   }
  225 | 
  226 |   async proceedToStep5(): Promise<void> {
  227 |     await this.step("Proceed to Step 5 (Review and publish) — click Next: Review and publish", async () => {
  228 |       await this.click(this.nextReviewBtn, "Next: Review and publish");
  229 |       await this.waitForVisible(this.publishPageBtn, "Step 5 — Publish page(s) button");
  230 |     });
  231 |   }
  232 | 
  233 |   // ── Step 5 ───────────────────────────────────────────────────────────────────
  234 | 
  235 |   /**
  236 |    * Assert that an audience name is visible in the Step 5 review summary.
  237 |    * This validates that the audience selection in Step 3 was preserved.
  238 |    */
  239 |   async assertAudienceInReview(audienceName: string): Promise<void> {
  240 |     await this.step(
  241 |       `Assert audience "${audienceName}" is shown in Step 5 review summary`,
  242 |       async () => {
  243 |         await expect(
  244 |           this.page.getByText(audienceName),
  245 |         ).toBeVisible({ timeout: 10_000 });
  246 |       },
  247 |     );
  248 |   }
  249 | 
  250 |   /**
  251 |    * Assert the Step 5 review page edit buttons are visible.
  252 |    * Validates that Step 5 is fully rendered.
  253 |    */
  254 |   async assertStep5ReviewVisible(): Promise<void> {
  255 |     await this.step("Assert Step 5 (Review and publish) is visible", async () => {
  256 |       await this.waitForVisible(this.publishPageBtn, "Publish page(s) button");
  257 |       await this.waitForVisible(this.editAudienceBtn, "Edit audience button (data-marker=editAudienceButton)");
  258 |     });
  259 |   }
  260 | 
  261 |   /**
  262 |    * Click "Publish page(s)" to finalize and publish.
  263 |    *
  264 |    * ⚠️  Each publish consumes one slot from the 10-page cap.
  265 |    *     Prefer cancelAndLeave() in tests where publication is not required.
  266 |    */
  267 |   async publishPage(): Promise<void> {
  268 |     await this.step("Click 'Publish page(s)' — finalize publication", async () => {
  269 |       await this.click(this.publishPageBtn, "Publish page(s)");
  270 |     });
  271 |   }
  272 | 
  273 |   // ── Cancel flow (works from any step) ───────────────────────────────────────
  274 | 
  275 |   /**
  276 |    * Cancel the wizard and confirm "Yes, leave without saving".
  277 |    * Returns the editor to its pre-wizard state.
  278 |    *
  279 |    * This triggers [role="alertdialog"] — handled by clicking "Yes, leave without saving".
  280 |    */
  281 |   async cancelAndLeave(): Promise<void> {
  282 |     await this.step("Cancel Publish wizard — confirm 'Yes, leave without saving'", async () => {
  283 |       await this.click(this.cancelBtn, "Cancel button");
  284 |       await this.waitForVisible(this.alertDialog, "Leave confirmation alertdialog");
  285 |       await this.click(this.confirmLeaveBtn, "Yes, leave without saving");
  286 |       await this.waitForHidden(this.alertDialog, "alertdialog (dismissed)");
  287 |     });
  288 |   }
```