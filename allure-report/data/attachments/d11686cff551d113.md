# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderColumns.spec.ts >> SC-06: Page Builder — Columns picker validation >> PB-06a: All default column visibility toggles are present in the Columns picker
- Location: tests/PageBuilder/pageBuilderColumns.spec.ts:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByRole('checkbox', { name: /Name/i }).or(getByLabel(/Name/i)).first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('checkbox', { name: /Name/i }).or(getByLabel(/Name/i)).first()
    23 × locator resolved to <button tabindex="-1" type="button" data-focus="true" data-marker="pinThisLanguage" aria-label="Pin Tiếng Việt (Vietnamese)" class="Button---root---TwJp3 Button---icon---O8jmG Button---gray---ZhsV0 Button---small---HuPO_ Button---center---KFO8Q Button---icon-only---OstZf">…</button>
       - unexpected value "hidden"

```

```yaml
- link "Jump to main content"
- banner:
  - button "Skillsoft apps":
    - img
    - text: Skillsoft apps
  - link "Percipio Home":
    - /url: /
  - text: Search
  - combobox "Search"
  - button "Search" [disabled]
  - button "Language English (US)":
    - img
    - text: EN-US
  - 'button "Experience Points: 0"': 0 XP
  - link "My Achievements":
    - /url: /profile/achievements
  - button "4 notifications to read":
    - img "4 notifications to read"
  - button "AI Assistant"
  - button "My Profile"
  - button "Site Navigation" [expanded]
  - button "Switch to my learner view":
    - img
    - text: Switch to my learner view
  - navigation:
    - list:
      - listitem
      - listitem:
        - button "Main Menu":
          - img
          - text: Main Menu
      - listitem:
        - img
        - text: Learning
        - list:
          - listitem:
            - link "Assignments":
              - /url: /admin/assignments
          - listitem:
            - link "Business Objectives":
              - /url: /admin/custom-business-objectives
          - listitem:
            - link "Completions & Waivers":
              - /url: /admin/completion-override
          - listitem:
            - link "Reset Course Progress":
              - /url: /admin/reset-course-progress
          - listitem:
            - link "Content Promotions":
              - /url: /admin/promoted-content
          - listitem:
            - link "External Learning":
              - /url: /admin/report/dw/external-learning
          - listitem:
            - link "Page Builder":
              - /url: /admin/landing-pages
          - listitem:
            - link "Q&A Management":
              - /url: /admin/qa-management
  - navigation "settings and help":
    - list:
      - listitem:
        - link "My Settings":
          - /url: /profile/account-information
          - img
          - text: My Settings
      - listitem:
        - link "Help":
          - /url: /help
          - img
          - text: Help
      - listitem:
        - link "Log Out":
          - /url: https://plat3-complete.front.develop.squads-dev.com/login#/logout
          - img
          - text: Log Out
- main:
  - heading [level=1]
  - heading "Welcome to your Page Builder!" [level=2]:
    - text: Welcome to your Page Builder!
    - listitem
  - paragraph: Easily create customized and impactful pages that drive learning.
  - heading "Choose a template and customize it to fit your needs." [level=3]
  - img "template-image"
  - text: Academy Experience
  - paragraph: Build a one-stop hub for learning resources across multiple topics. This template helps you organize content and invite learners to explore, engage, and grow with expert guidance.
  - button "Get started"
  - heading "Coming soon" [level=4]
  - paragraph: Audience/Function-Based
  - heading "Coming soon" [level=4]
  - paragraph: Learning Program Marketing
  - heading "Your pages at a glance" [level=3]
  - text: 0/10 published pages 1 to 10 of 11. Page 1 of 2
  - treegrid:
    - rowgroup:
      - row "Name":
        - columnheader "Name"
    - rowgroup:
      - row "Status Type Modified Date Created By":
        - columnheader "Status"
        - columnheader "Type"
        - columnheader "Modified Date"
        - columnheader "Created By"
    - rowgroup:
      - row:
        - columnheader
    - rowgroup:
      - row " PB Editor Actions civitas sub 1779714921651":
        - gridcell " PB Editor Actions civitas sub 1779714921651"
      - row " PB Actions copia territo 1779714906727":
        - gridcell " PB Actions copia territo 1779714906727"
      - row " PB Editor Actions aggredior suasoria 17797146666":
        - gridcell " PB Editor Actions aggredior suasoria 17797146666"
      - row " PB Actions ulciscor textilis 1779714628993":
        - gridcell " PB Actions ulciscor textilis 1779714628993"
      - row " PB Editor Actions cilicium terminatio 1779714300":
        - gridcell " PB Editor Actions cilicium terminatio 1779714300"
      - row " PB Actions terga mollitia 1779713982808":
        - gridcell " PB Actions terga mollitia 1779713982808"
      - row " PB Editor Actions abbas dolores 1779713699474":
        - gridcell " PB Editor Actions abbas dolores 1779713699474"
      - row " PB Actions bos templum 1779713671645":
        - gridcell " PB Actions bos templum 1779713671645"
      - row " PB Editor Actions totidem verbum 1779713299005":
        - gridcell " PB Editor Actions totidem verbum 1779713299005"
      - row " PB Actions clam modi 1779712988235":
        - gridcell " PB Actions clam modi 1779712988235"
    - rowgroup:
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
      - row "Draft custom May 25, 2026":
        - gridcell "Draft"
        - gridcell "custom"
        - gridcell "May 25, 2026"
        - gridcell
    - rowgroup:
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
      - row "Actions":
        - gridcell "Actions":
          - button "Actions"
    - rowgroup
    - rowgroup
    - rowgroup
    - rowgroup
    - rowgroup
  - tablist:
    - tab "Columns" [expanded]
  - tabpanel "Columns":
    - checkbox "Toggle All Columns Visibility" [checked]
    - textbox "Filter Columns Input":
      - /placeholder: Search...
    - tree "Column List 5 Columns":
      - treeitem "Status Column" [level=1]:
        - checkbox "Press SPACE to toggle visibility (visible)" [checked]
        - text:  Status
      - treeitem "Type Column" [level=1]:
        - checkbox "Press SPACE to toggle visibility (visible)" [checked]
        - text:  Type
      - treeitem "Modified Date Column" [level=1]:
        - checkbox "Press SPACE to toggle visibility (visible)" [checked]
        - text:  Modified Date
      - treeitem "Created By Column" [level=1]:
        - checkbox "Press SPACE to toggle visibility (visible)" [checked]
        - text:  Created By
      - treeitem "Column" [level=1]:
        - checkbox "Press SPACE to toggle visibility (visible)" [checked]
        - text: 
    - text: Drag here to set row groups
  - text: "Page Size:"
  - combobox "Page Size": "10"
  - text: 1 to 10 of 11
  - button "First Page" [disabled]: 
  - button "Previous Page" [disabled]: 
  - text: Page 1 of 2
  - button "Next Page": 
  - button "Last Page": 
- contentinfo:
  - list:
    - listitem:
      - link "License Agreement":
        - /url: https://documentation.skillsoft.com/en_us/privacy/skillsoft_license_agreement.htm
    - listitem:
      - link "Privacy Notice":
        - /url: https://www.skillsoft.com/about/privacy-notice
    - listitem:
      - link "Help":
        - /url: /help
  - paragraph: Copyright 2026 Skillsoft Ireland Limited. All rights reserved.PMBOK, PMI, PMP, CAPM, PMI-ACP, PgMP, PMI-RMP and PMI-SP are trademarks of the Project Management Institute, Inc.
  - paragraph:
    - img "Skillsoft logo"
  - heading "Get the app" [level=2]
  - button "Smart App Login"
  - text: Improve yourself in minutes a day — anytime, anywhere.Use plat3-complete as your site name to get started!
  - link "Download on the App Store":
    - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_iOS
    - img
  - link "Get it on Google Play":
    - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_Android
    - img
- log
- log
- log
- log
- text: Percipio
```

# Test source

```ts
  235 |    *     "Leave without saving?" Publish-wizard cancel dialog.
  236 |    */
  237 |   async assertDeleteConfirmationVisible(): Promise<void> {
  238 |     await this.step(
  239 |       "Assert Delete confirmation dialog visible (role=dialog, name='Delete …')",
  240 |       async () => {
  241 |         await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
  242 |         await expect(this.confirmDeleteBtn).toBeVisible();
  243 |       },
  244 |     );
  245 |   }
  246 | 
  247 |   /** Click "Yes, delete" to permanently delete the page. */
  248 |   async confirmDeleteAction(): Promise<void> {
  249 |     await this.step("Confirm delete — click 'Yes, delete'", async () => {
  250 |       await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
  251 |       await this.click(this.confirmDeleteBtn, "Yes, delete");
  252 |       await this.waitForHidden(this.deleteDialog, "Delete dialog (dismissed)");
  253 |     });
  254 |   }
  255 | 
  256 |   /** Click "Close" (×) to dismiss the Delete dialog without deleting. */
  257 |   async cancelDeleteAction(): Promise<void> {
  258 |     await this.step("Cancel delete — click 'Close' (×) button", async () => {
  259 |       await this.waitForVisible(this.deleteDialog, "Delete confirmation dialog");
  260 |       await this.click(this.closeDialogBtn, "Close (cancel delete)");
  261 |       await this.waitForHidden(this.deleteDialog, "Delete dialog (dismissed)");
  262 |     });
  263 |   }
  264 | 
  265 |   // ── Rename modal ────────────────────────────────────────────────────────────
  266 | 
  267 |   /**
  268 |    * After clicking the Rename row action, assert the "Rename page" modal dialog
  269 |    * is visible and its "Page title" input is populated.
  270 |    *
  271 |    * ⚠️  Confirmed 2026-05-25: Rename opens a MODAL DIALOG (role="dialog",
  272 |    *     name="Rename page"), NOT an inline text edit in the grid row.
  273 |    *
  274 |    * Dialog contents:
  275 |    *   - textbox "Page title" (pre-filled with current name, max 48 chars)
  276 |    *   - textbox "URL" (disabled — auto-generated slug)
  277 |    *   - combobox "Permission"
  278 |    *   - checkbox "Don't show this page in the left navigation"
  279 |    *   - button "Cancel" | button "Rename" (disabled until title is changed)
  280 |    */
  281 |   async assertRenameInputVisible(): Promise<void> {
  282 |     await this.step(
  283 |       "Assert Rename page modal dialog is visible with Page title input",
  284 |       async () => {
  285 |         const renameDialog = this.page.getByRole("dialog", { name: "Rename page" });
  286 |         await this.waitForVisible(renameDialog, "Rename page dialog");
  287 |         // The "Page title" textbox is pre-filled with the current name
  288 |         const pageTitleInput = renameDialog.getByRole("textbox", { name: "Page title" });
  289 |         await expect(pageTitleInput).toBeVisible({ timeout: 10_000 });
  290 |       },
  291 |     );
  292 |   }
  293 | 
  294 |   /**
  295 |    * Close the "Rename page" modal without saving — clicks Cancel.
  296 |    * Call after assertRenameInputVisible() when you don't want to rename.
  297 |    */
  298 |   async cancelRenameDialog(): Promise<void> {
  299 |     await this.step("Cancel Rename page dialog without saving", async () => {
  300 |       const renameDialog = this.page.getByRole("dialog", { name: "Rename page" });
  301 |       await this.waitForVisible(renameDialog, "Rename page dialog");
  302 |       await this.click(
  303 |         renameDialog.getByRole("button", { name: "Cancel" }),
  304 |         "Cancel rename button",
  305 |       );
  306 |       await this.waitForHidden(renameDialog, "Rename dialog (dismissed)");
  307 |     });
  308 |   }
  309 | 
  310 |   // ── Columns picker ───────────────────────────────────────────────────────────
  311 | 
  312 |   async openColumnsTab(): Promise<void> {
  313 |     await this.step("Open the Columns picker tab", async () => {
  314 |       await this.click(this.columnsTab, "Columns tab");
  315 |     });
  316 |   }
  317 | 
  318 |   /**
  319 |    * Assert that the Columns picker panel shows all expected column toggles.
  320 |    * Default columns: Name | Status | Type | Modified Date | Created By
  321 |    */
  322 |   async assertAllColumnTogglesVisible(): Promise<void> {
  323 |     await this.step(
  324 |       "Assert all 5 column visibility toggles present in Columns panel",
  325 |       async () => {
  326 |         for (const col of [
  327 |           "Name",
  328 |           "Status",
  329 |           "Type",
  330 |           "Modified Date",
  331 |           "Created By",
  332 |         ]) {
  333 |           // Column toggles are likely checkboxes labeled with the column name
  334 |           const toggle = this.columnToggle(col);
> 335 |           await expect(toggle).toBeVisible({ timeout: 10_000 });
      |                                ^ Error: expect(locator).toBeVisible() failed
  336 |         }
  337 |       },
  338 |     );
  339 |   }
  340 | 
  341 |   /**
  342 |    * Toggle visibility for a named column.
  343 |    * Requires openColumnsTab() to have been called first.
  344 |    *
  345 |    * @param columnName - Exact column label (e.g. "Status", "Modified Date")
  346 |    */
  347 |   async toggleColumnVisibility(columnName: string): Promise<void> {
  348 |     await this.step(
  349 |       `Toggle visibility for column "${columnName}"`,
  350 |       async () => {
  351 |         const toggle = this.columnToggle(columnName);
  352 |         await toggle.waitFor({ state: "visible", timeout: 10_000 });
  353 |         await toggle.click();
  354 |       },
  355 |     );
  356 |   }
  357 | 
  358 |   /**
  359 |    * Click the "Toggle All Columns Visibility" master checkbox.
  360 |    * Toggles all columns on or off in a single click.
  361 |    */
  362 |   async toggleAllColumnsVisibility(): Promise<void> {
  363 |     await this.step("Click 'Toggle All Columns Visibility' checkbox", async () => {
  364 |       const toggleAll = this.page
  365 |         .getByRole("checkbox", { name: /toggle all columns visibility/i })
  366 |         .or(this.page.getByLabel(/toggle all/i))
  367 |         .first();
  368 |       await toggleAll.waitFor({ state: "visible", timeout: 10_000 });
  369 |       await toggleAll.click();
  370 |     });
  371 |   }
  372 | 
  373 |   // ── Grid header assertions ───────────────────────────────────────────────────
  374 | 
  375 |   async assertColumnVisible(columnName: string): Promise<void> {
  376 |     await this.step(
  377 |       `Assert column "${columnName}" header is visible in the data grid`,
  378 |       async () => {
  379 |         await expect(
  380 |           this.page.getByRole("columnheader", {
  381 |             name: new RegExp(columnName, "i"),
  382 |           }),
  383 |         ).toBeVisible({ timeout: 10_000 });
  384 |       },
  385 |     );
  386 |   }
  387 | 
  388 |   async assertColumnHidden(columnName: string): Promise<void> {
  389 |     await this.step(
  390 |       `Assert column "${columnName}" header is hidden from the data grid`,
  391 |       async () => {
  392 |         await expect(
  393 |           this.page.getByRole("columnheader", {
  394 |             name: new RegExp(columnName, "i"),
  395 |           }),
  396 |         ).toBeHidden({ timeout: 10_000 });
  397 |       },
  398 |     );
  399 |   }
  400 | 
  401 |   async assertAllDefaultColumnsVisible(): Promise<void> {
  402 |     await this.step(
  403 |       "Assert all 5 default column headers visible (Name, Status, Type, Modified Date, Created By)",
  404 |       async () => {
  405 |         for (const col of [
  406 |           "Name",
  407 |           "Status",
  408 |           "Type",
  409 |           "Modified Date",
  410 |           "Created By",
  411 |         ]) {
  412 |           await expect(
  413 |             this.page.getByRole("columnheader", {
  414 |               name: new RegExp(col, "i"),
  415 |             }),
  416 |           ).toBeVisible();
  417 |         }
  418 |       },
  419 |     );
  420 |   }
  421 | 
  422 |   // ── Row assertions ───────────────────────────────────────────────────────────
  423 | 
  424 |   /**
  425 |    * Assert a page row with the given name is present in the list.
  426 |    * @param pageName - Title visible in the Name column.
  427 |    */
  428 |   async assertRowPresent(pageName: string): Promise<void> {
  429 |     await this.step(
  430 |       `Assert page "${pageName}" is present in the Page Builder list`,
  431 |       async () => {
  432 |         await expect(
  433 |           this.dataTable.getByRole("row").filter({ hasText: pageName }),
  434 |         ).toBeVisible({ timeout: 15_000 });
  435 |       },
```