# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderColumns.spec.ts >> SC-06: Page Builder — Columns picker validation >> PB-06c: 'Toggle All Columns Visibility' hides and shows all columns at once
- Location: tests/PageBuilder/pageBuilderColumns.spec.ts:71:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('columnheader', { name: /Name/i })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('columnheader', { name: /Name/i })

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
  - text: Loading
  - img
  - text: Loading
  - img
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
  317 | 
  318 |   /**
  319 |    * Assert that the Columns picker panel shows all expected column toggles.
  320 |    *
  321 |    * ⚠️  Confirmed 2026-05-25: "Name" is NOT in the column toggle list — it is
  322 |    *     the pinned auto-group column and cannot be hidden. The panel lists
  323 |    *     only: Status | Type | Modified Date | Created By.
  324 |    */
  325 |   async assertAllColumnTogglesVisible(): Promise<void> {
  326 |     await this.step(
  327 |       "Assert 4 column visibility toggles present in Columns panel (Status, Type, Modified Date, Created By)",
  328 |       async () => {
  329 |         for (const col of [
  330 |           "Status",
  331 |           "Type",
  332 |           "Modified Date",
  333 |           "Created By",
  334 |         ]) {
  335 |           const toggle = this.columnToggle(col);
  336 |           await expect(toggle).toBeVisible({ timeout: 10_000 });
  337 |         }
  338 |       },
  339 |     );
  340 |   }
  341 | 
  342 |   /**
  343 |    * Toggle visibility for a named column.
  344 |    * Requires openColumnsTab() to have been called first.
  345 |    *
  346 |    * @param columnName - Exact column label (e.g. "Status", "Modified Date")
  347 |    */
  348 |   async toggleColumnVisibility(columnName: string): Promise<void> {
  349 |     await this.step(
  350 |       `Toggle visibility for column "${columnName}"`,
  351 |       async () => {
  352 |         const toggle = this.columnToggle(columnName);
  353 |         await toggle.waitFor({ state: "visible", timeout: 10_000 });
  354 |         await toggle.click();
  355 |       },
  356 |     );
  357 |   }
  358 | 
  359 |   /**
  360 |    * Click the "Toggle All Columns Visibility" master checkbox.
  361 |    * Toggles all columns on or off in a single click.
  362 |    */
  363 |   async toggleAllColumnsVisibility(): Promise<void> {
  364 |     await this.step("Click 'Toggle All Columns Visibility' checkbox", async () => {
  365 |       const toggleAll = this.page
  366 |         .getByRole("checkbox", { name: /toggle all columns visibility/i })
  367 |         .or(this.page.getByLabel(/toggle all/i))
  368 |         .first();
  369 |       await toggleAll.waitFor({ state: "visible", timeout: 10_000 });
  370 |       await toggleAll.click();
  371 |     });
  372 |   }
  373 | 
  374 |   // ── Grid header assertions ───────────────────────────────────────────────────
  375 | 
  376 |   async assertColumnVisible(columnName: string): Promise<void> {
  377 |     await this.step(
  378 |       `Assert column "${columnName}" header is visible in the data grid`,
  379 |       async () => {
  380 |         await expect(
  381 |           this.page.getByRole("columnheader", {
  382 |             name: new RegExp(columnName, "i"),
  383 |           }),
  384 |         ).toBeVisible({ timeout: 10_000 });
  385 |       },
  386 |     );
  387 |   }
  388 | 
  389 |   async assertColumnHidden(columnName: string): Promise<void> {
  390 |     await this.step(
  391 |       `Assert column "${columnName}" header is hidden from the data grid`,
  392 |       async () => {
  393 |         await expect(
  394 |           this.page.getByRole("columnheader", {
  395 |             name: new RegExp(columnName, "i"),
  396 |           }),
  397 |         ).toBeHidden({ timeout: 10_000 });
  398 |       },
  399 |     );
  400 |   }
  401 | 
  402 |   async assertAllDefaultColumnsVisible(): Promise<void> {
  403 |     await this.step(
  404 |       "Assert all 5 default column headers visible (Name, Status, Type, Modified Date, Created By)",
  405 |       async () => {
  406 |         for (const col of [
  407 |           "Name",
  408 |           "Status",
  409 |           "Type",
  410 |           "Modified Date",
  411 |           "Created By",
  412 |         ]) {
  413 |           await expect(
  414 |             this.page.getByRole("columnheader", {
  415 |               name: new RegExp(col, "i"),
  416 |             }),
> 417 |           ).toBeVisible();
      |             ^ Error: expect(locator).toBeVisible() failed
  418 |         }
  419 |       },
  420 |     );
  421 |   }
  422 | 
  423 |   // ── Row assertions ───────────────────────────────────────────────────────────
  424 | 
  425 |   /**
  426 |    * Assert a page row with the given name is present in the list.
  427 |    * @param pageName - Title visible in the Name column.
  428 |    */
  429 |   async assertRowPresent(pageName: string): Promise<void> {
  430 |     await this.step(
  431 |       `Assert page "${pageName}" is present in the Page Builder list`,
  432 |       async () => {
  433 |         await expect(
  434 |           this.dataTable.getByRole("row").filter({ hasText: pageName }),
  435 |         ).toBeVisible({ timeout: 15_000 });
  436 |       },
  437 |     );
  438 |   }
  439 | 
  440 |   // ── Private helpers ──────────────────────────────────────────────────────────
  441 | 
  442 |   /**
  443 |    * Locate the column visibility toggle checkbox in the AG Grid Columns panel.
  444 |    *
  445 |    * ⚠️  Confirmed 2026-05-25: ALL column checkboxes share the same accessible
  446 |    *     name "Press SPACE to toggle visibility (visible)" — the column name is
  447 |    *     displayed as text NEXT TO the checkbox inside a treeitem. Therefore we
  448 |    *     cannot use getByRole("checkbox", { name: /ColumnName/ }) — instead we
  449 |    *     scope to the treeitem that contains the column name text, then select
  450 |    *     the checkbox inside it.
  451 |    *
  452 |    *     DOM: tabpanel "Columns" > tree > treeitem "<ColName> Column" > checkbox
  453 |    */
  454 |   private columnToggle(columnName: string): Locator {
  455 |     return this.page
  456 |       .getByRole("tabpanel", { name: "Columns" })
  457 |       .getByRole("treeitem")
  458 |       .filter({ hasText: new RegExp(columnName, "i") })
  459 |       .getByRole("checkbox");
  460 |   }
  461 | }
  462 | 
```