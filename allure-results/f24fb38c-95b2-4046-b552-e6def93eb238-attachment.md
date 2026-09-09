# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderActionMenus.spec.ts >> SC-05: Page Builder — Action menu validation >> PB-05a: Verify all 5 row-level actions on the Page Builder list page
- Location: tests/PageBuilder/pageBuilderActionMenus.spec.ts:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[data-marker="flexibleDataTableContainer"]').getByRole('textbox').or(locator('[data-marker="flexibleDataTableContainer"]').locator('input[type="text"]')).first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-marker="flexibleDataTableContainer"]').getByRole('textbox').or(locator('[data-marker="flexibleDataTableContainer"]').locator('input[type="text"]')).first()
    24 × locator resolved to <input type="text" tabindex="0" data-ref="eInput" id="ag-155-input" autocomplete="off" placeholder="Search..." aria-label="Filter Columns Input" class="ag-input-field-input ag-text-field-input"/>
       - unexpected value "hidden"

```

```yaml
- text: Percipio
- dialog "Rename page":
  - heading "Rename page" [level=1]
  - button "Close"
  - text: Page title
  - img
  - textbox "Page title":
    - /placeholder: ""
    - text: PB Actions ulciscor textilis 1779714628993
  - text: 42/48
  - alert
  - text: URL
  - textbox "URL" [disabled]:
    - /placeholder: ""
    - text: https://plat3-complete.front.develop.squads-dev.com/custom-pages/a12552a5-2709-4820-ba48-53f91e8af1d5
  - alert
  - button
  - paragraph: Choose which admins with page builder access permissions can make changes.
  - text: Permission
  - log
  - text: All Admins
  - combobox "Permission"
  - alert
  - checkbox "Don’t show this page in the left navigation"
  - text: Don’t show this page in the left navigation
  - img
  - text: Please refrain from entering any sensitive information on this page.
  - button "Cancel"
  - button "Rename" [disabled]
```

# Test source

```ts
  180 | 
  181 |   /**
  182 |    * Click a specific row action from the open Actions dropdown.
  183 |    * Call openRowActionsMenu() first.
  184 |    *
  185 |    * ⚠️  "Manage Access" was discovered as a 6th action during first test run (2026-05-25).
  186 |    *     Original spec listed 5 items; live app now shows 6.
  187 |    */
  188 |   async clickRowAction(
  189 |     action: "Publish" | "Rename" | "Preview" | "Manage Access" | "Delete" | "Duplicate",
  190 |   ): Promise<void> {
  191 |     await this.step(`Click row action: "${action}"`, async () => {
  192 |       await this.click(
  193 |         this.page.getByRole("menuitem", { name: action }),
  194 |         `"${action}" menu item`,
  195 |       );
  196 |     });
  197 |   }
  198 | 
  199 |   /**
  200 |    * Assert all 6 row action items are visible in the open menu.
  201 |    * Call openRowActionsMenu() first.
  202 |    *
  203 |    * Actions (confirmed live 2026-05-25): Publish | Rename | Preview | Manage Access | Delete | Duplicate
  204 |    */
  205 |   async assertAllRowActionItems(): Promise<void> {
  206 |     await this.step(
  207 |       "Assert all 6 row action items visible (Publish, Rename, Preview, Manage Access, Delete, Duplicate)",
  208 |       async () => {
  209 |         for (const action of [
  210 |           "Publish",
  211 |           "Rename",
  212 |           "Preview",
  213 |           "Manage Access",
  214 |           "Delete",
  215 |           "Duplicate",
  216 |         ]) {
  217 |           await expect(
  218 |             this.page.getByRole("menuitem", { name: action }),
  219 |           ).toBeVisible();
  220 |         }
  221 |       },
  222 |     );
  223 |   }
  224 | 
  225 |   // ── Delete confirmation dialog ───────────────────────────────────────────────
  226 | 
  227 |   /**
  228 |    * Assert the Delete confirmation dialog is visible.
  229 |    *
  230 |    * Dialog: [role="dialog"] named "Delete <pageName>"
  231 |    * Body:   "Deleting '...' will also delete its subpages. This cannot be undone. Are you sure?"
  232 |    * Buttons: "Yes, delete" | "Close" (×)
  233 |    *
  234 |    * ⚠️  This is NOT [role="alertdialog"] — that role is only used by the
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
  265 |   // ── Rename inline ───────────────────────────────────────────────────────────
  266 | 
  267 |   /**
  268 |    * After clicking the Rename row action, assert the inline rename input appears.
  269 |    */
  270 |   async assertRenameInputVisible(): Promise<void> {
  271 |     await this.step(
  272 |       "Assert inline rename text input is visible in the row",
  273 |       async () => {
  274 |         // After Rename click, a text input appears inside the data table
  275 |         // (replaces the name cell with an editable field)
  276 |         const renameInput = this.dataTable
  277 |           .getByRole("textbox")
  278 |           .or(this.dataTable.locator('input[type="text"]'))
  279 |           .first();
> 280 |         await expect(renameInput).toBeVisible({ timeout: 10_000 });
      |                                   ^ Error: expect(locator).toBeVisible() failed
  281 |       },
  282 |     );
  283 |   }
  284 | 
  285 |   // ── Columns picker ───────────────────────────────────────────────────────────
  286 | 
  287 |   async openColumnsTab(): Promise<void> {
  288 |     await this.step("Open the Columns picker tab", async () => {
  289 |       await this.click(this.columnsTab, "Columns tab");
  290 |     });
  291 |   }
  292 | 
  293 |   /**
  294 |    * Assert that the Columns picker panel shows all expected column toggles.
  295 |    * Default columns: Name | Status | Type | Modified Date | Created By
  296 |    */
  297 |   async assertAllColumnTogglesVisible(): Promise<void> {
  298 |     await this.step(
  299 |       "Assert all 5 column visibility toggles present in Columns panel",
  300 |       async () => {
  301 |         for (const col of [
  302 |           "Name",
  303 |           "Status",
  304 |           "Type",
  305 |           "Modified Date",
  306 |           "Created By",
  307 |         ]) {
  308 |           // Column toggles are likely checkboxes labeled with the column name
  309 |           const toggle = this.columnToggle(col);
  310 |           await expect(toggle).toBeVisible({ timeout: 10_000 });
  311 |         }
  312 |       },
  313 |     );
  314 |   }
  315 | 
  316 |   /**
  317 |    * Toggle visibility for a named column.
  318 |    * Requires openColumnsTab() to have been called first.
  319 |    *
  320 |    * @param columnName - Exact column label (e.g. "Status", "Modified Date")
  321 |    */
  322 |   async toggleColumnVisibility(columnName: string): Promise<void> {
  323 |     await this.step(
  324 |       `Toggle visibility for column "${columnName}"`,
  325 |       async () => {
  326 |         const toggle = this.columnToggle(columnName);
  327 |         await toggle.waitFor({ state: "visible", timeout: 10_000 });
  328 |         await toggle.click();
  329 |       },
  330 |     );
  331 |   }
  332 | 
  333 |   /**
  334 |    * Click the "Toggle All Columns Visibility" master checkbox.
  335 |    * Toggles all columns on or off in a single click.
  336 |    */
  337 |   async toggleAllColumnsVisibility(): Promise<void> {
  338 |     await this.step("Click 'Toggle All Columns Visibility' checkbox", async () => {
  339 |       const toggleAll = this.page
  340 |         .getByRole("checkbox", { name: /toggle all columns visibility/i })
  341 |         .or(this.page.getByLabel(/toggle all/i))
  342 |         .first();
  343 |       await toggleAll.waitFor({ state: "visible", timeout: 10_000 });
  344 |       await toggleAll.click();
  345 |     });
  346 |   }
  347 | 
  348 |   // ── Grid header assertions ───────────────────────────────────────────────────
  349 | 
  350 |   async assertColumnVisible(columnName: string): Promise<void> {
  351 |     await this.step(
  352 |       `Assert column "${columnName}" header is visible in the data grid`,
  353 |       async () => {
  354 |         await expect(
  355 |           this.page.getByRole("columnheader", {
  356 |             name: new RegExp(columnName, "i"),
  357 |           }),
  358 |         ).toBeVisible({ timeout: 10_000 });
  359 |       },
  360 |     );
  361 |   }
  362 | 
  363 |   async assertColumnHidden(columnName: string): Promise<void> {
  364 |     await this.step(
  365 |       `Assert column "${columnName}" header is hidden from the data grid`,
  366 |       async () => {
  367 |         await expect(
  368 |           this.page.getByRole("columnheader", {
  369 |             name: new RegExp(columnName, "i"),
  370 |           }),
  371 |         ).toBeHidden({ timeout: 10_000 });
  372 |       },
  373 |     );
  374 |   }
  375 | 
  376 |   async assertAllDefaultColumnsVisible(): Promise<void> {
  377 |     await this.step(
  378 |       "Assert all 5 default column headers visible (Name, Status, Type, Modified Date, Created By)",
  379 |       async () => {
  380 |         for (const col of [
```