# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderComponents.spec.ts >> SC-01: Page Builder — Design tab component coverage >> PB-01: Add all 14 Design tab components to a new page and verify each appears on canvas
- Location: tests/PageBuilder/pageBuilderComponents.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Save' })
Expected: enabled
Received: disabled
Timeout:  15000ms

Call log:
  - Expect "toBeEnabled" with timeout 15000ms
  - waiting for getByRole('button', { name: 'Save' })
    33 × locator resolved to <button disabled type="button" data-focus="false" class="Button---root---TwJp3 Button---secondary---H8yOM Button---small---HuPO_ Button---center---KFO8Q Button---disabled---XCoMG TopNavigationBar---buttonComponent---zqdWr">…</button>
       - unexpected value "disabled"

```

```yaml
- button "Save" [disabled]
```

# Test source

```ts
  4   | 
  5   | /**
  6   |  * PageBuilderEditorPage — /admin/page-builder
  7   |  *
  8   |  * Wraps the Page Builder editor's toolbar and left-panel tab switcher.
  9   |  * Works together with PageBuilderDesignPanel and PageBuilderPagesPanel,
  10  |  * all sharing the same page instance.
  11  |  *
  12  |  * Toolbar buttons (left to right):
  13  |  *   ← Back | [undo] [redo] | Edit | Preview | Revert | Save | Publish
  14  |  *
  15  |  * ⚠️  Known locator notes (confirmed 2026-05-25):
  16  |  *   - "Edit" button: multiple elements with name "Edit" may exist in some editor
  17  |  *     states. The primary approach is to take the first visible Edit button in
  18  |  *     the top navigation bar. If ambiguity causes issues, filter by the
  19  |  *     TopNavigationBar class (.TopNavigationBar---root---*), but note that
  20  |  *     CSS-module class names are build-time hashed and cannot be relied upon
  21  |  *     across deployments.
  22  |  *   - Undo/Redo buttons have empty aria-label (product bug). Cannot locate by
  23  |  *     role name; use the class-based selector as documented below.
  24  |  *   - URL remains /admin/page-builder regardless of which page is open in the
  25  |  *     editor. Use assertEditorLoaded() rather than assertUrl() for validation.
  26  |  */
  27  | export class PageBuilderEditorPage extends BasePage {
  28  |   // ── Toolbar ─────────────────────────────────────────────────────────────────
  29  |   /** Back arrow — navigates to /admin/landing-pages */
  30  |   private readonly backToListBtn = this.page.getByRole("button", {
  31  |     name: "Back to Page Builder main",
  32  |   });
  33  | 
  34  |   /**
  35  |    * Edit mode toggle.
  36  |    * Note: multiple buttons may be named "Edit" (e.g. inline component edit).
  37  |    * Taking the first visible instance is usually correct for the toolbar Edit button.
  38  |    */
  39  |   private readonly editBtn = this.page
  40  |     .getByRole("button", { name: "Edit" })
  41  |     .first();
  42  | 
  43  |   private readonly saveBtn = this.page.getByRole("button", { name: "Save" });
  44  |   private readonly publishBtn = this.page.getByRole("button", { name: "Publish" });
  45  |   private readonly revertBtn = this.page.getByRole("button", { name: "Revert" });
  46  |   private readonly previewBtn = this.page.getByRole("button", { name: "Preview" });
  47  | 
  48  |   /**
  49  |    * Undo button.
  50  |    * ⚠️ aria-label is empty (product accessibility bug) — cannot use getByRole.
  51  |    * Located by nth-child pattern: first toolbar icon button pair.
  52  |    * Update this locator if the bug is fixed in a future release.
  53  |    */
  54  |   private readonly undoBtn = this.page
  55  |     .locator('button[class*="undoRedoButton"]')
  56  |     .first();
  57  | 
  58  |   /**
  59  |    * Redo button (second of the undo/redo pair).
  60  |    */
  61  |   private readonly redoBtn = this.page
  62  |     .locator('button[class*="undoRedoButton"]')
  63  |     .nth(1);
  64  | 
  65  |   // ── Left panel tabs ──────────────────────────────────────────────────────────
  66  |   private readonly pagesTab = this.page.getByRole("tab", { name: "Pages" });
  67  |   private readonly designTab = this.page.getByRole("tab", { name: "Design" });
  68  | 
  69  |   constructor(page: Page) {
  70  |     super(page);
  71  |   }
  72  | 
  73  |   // ── Editor load ──────────────────────────────────────────────────────────────
  74  | 
  75  |   /**
  76  |    * Wait for the editor to fully load.
  77  |    * Asserts the URL is /admin/page-builder and the Back button is visible
  78  |    * (reliable indicator that the editor shell has rendered).
  79  |    */
  80  |   async waitForEditorLoad(): Promise<void> {
  81  |     await this.step("Wait for Page Builder editor to load", async () => {
  82  |       await this.page.waitForURL(/\/admin\/page-builder/, { timeout: 30_000 });
  83  |       await this.waitForVisible(this.backToListBtn, "Back to Page Builder main button");
  84  |     });
  85  |   }
  86  | 
  87  |   async assertEditorLoaded(): Promise<void> {
  88  |     await this.step("Assert Page Builder editor is loaded", async () => {
  89  |       await expect(this.page).toHaveURL(/\/admin\/page-builder/);
  90  |       await expect(this.backToListBtn).toBeVisible();
  91  |     });
  92  |   }
  93  | 
  94  |   // ── Toolbar actions ──────────────────────────────────────────────────────────
  95  | 
  96  |   /**
  97  |    * Click the Edit button to enter edit mode.
  98  |    * After clicking, the Save and Revert buttons become enabled.
  99  |    */
  100 |   async clickEditMode(): Promise<void> {
  101 |     await this.step("Click Edit to enter edit mode", async () => {
  102 |       await this.click(this.editBtn, "Edit button (toolbar)");
  103 |       // Wait for Save button to become enabled as indicator that edit mode is active
> 104 |       await expect(this.saveBtn).toBeEnabled({ timeout: 15_000 });
      |                                  ^ Error: expect(locator).toBeEnabled() failed
  105 |     });
  106 |   }
  107 | 
  108 |   async clickSave(): Promise<void> {
  109 |     await this.step("Click Save", async () => {
  110 |       await this.click(this.saveBtn, "Save button");
  111 |       // Wait for Save to complete — button typically becomes disabled again after save
  112 |       await expect(this.saveBtn).toBeDisabled({ timeout: 15_000 });
  113 |     });
  114 |   }
  115 | 
  116 |   async clickPublish(): Promise<void> {
  117 |     await this.step("Click Publish — opens 5-step Publish wizard", async () => {
  118 |       await this.click(this.publishBtn, "Publish button");
  119 |     });
  120 |   }
  121 | 
  122 |   async clickRevert(): Promise<void> {
  123 |     await this.step("Click Revert", async () => {
  124 |       await this.click(this.revertBtn, "Revert button");
  125 |     });
  126 |   }
  127 | 
  128 |   async clickPreview(): Promise<void> {
  129 |     await this.step("Click Preview", async () => {
  130 |       await this.click(this.previewBtn, "Preview button");
  131 |     });
  132 |   }
  133 | 
  134 |   /**
  135 |    * Navigate back to the Page Builder list (/admin/landing-pages).
  136 |    */
  137 |   async goBackToList(): Promise<void> {
  138 |     await this.step("Click Back to Page Builder main → navigate to list", async () => {
  139 |       await this.click(this.backToListBtn, "Back to Page Builder main");
  140 |       await this.page.waitForURL(/\/admin\/landing-pages/, { timeout: 30_000 });
  141 |     });
  142 |   }
  143 | 
  144 |   // ── Left panel tab switching ─────────────────────────────────────────────────
  145 | 
  146 |   async switchToPagesTab(): Promise<void> {
  147 |     await this.step("Switch to Pages tab in left panel", async () => {
  148 |       await this.click(this.pagesTab, "Pages tab");
  149 |     });
  150 |   }
  151 | 
  152 |   async switchToDesignTab(): Promise<void> {
  153 |     await this.step("Switch to Design tab in left panel", async () => {
  154 |       await this.click(this.designTab, "Design tab");
  155 |     });
  156 |   }
  157 | 
  158 |   // ── Toolbar state assertions ─────────────────────────────────────────────────
  159 | 
  160 |   async assertSaveEnabled(): Promise<void> {
  161 |     await this.step("Assert Save button is enabled", async () => {
  162 |       await expect(this.saveBtn).toBeEnabled();
  163 |     });
  164 |   }
  165 | 
  166 |   async assertSaveDisabled(): Promise<void> {
  167 |     await this.step("Assert Save button is disabled (no pending changes)", async () => {
  168 |       await expect(this.saveBtn).toBeDisabled();
  169 |     });
  170 |   }
  171 | }
  172 | 
```