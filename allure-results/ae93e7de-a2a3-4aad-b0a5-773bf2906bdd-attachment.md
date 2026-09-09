# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/auth/auth.setup.ts >> authenticate
- Location: tests/auth/auth.setup.ts:9:6

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { Page, Locator, expect } from "@playwright/test";
  2   | import { Reporter } from "../../utils/Reporter";
  3   | 
  4   | /**
  5   |  * BasePage – Every Page Object Model class extends this.
  6   |  *
  7   |  * All actions are wrapped in Reporter.step() which feeds Playwright's
  8   |  * built-in HTML report directly — no extra config needed.
  9   |  *
  10  |  * Subclasses get a protected this.step() shortcut for their own named steps.
  11  |  */
  12  | export abstract class BasePage {
  13  |   protected readonly page: Page;
  14  | 
  15  |   constructor(page: Page) {
  16  |     this.page = page;
  17  |   }
  18  | 
  19  |   /** Convenience so subclasses can write: await this.step("...", async () => { ... }) */
  20  |   protected async step<T>(name: string, body: () => Promise<T>): Promise<T> {
  21  |     return Reporter.step(name, body);
  22  |   }
  23  | 
  24  |   // ─────────────────────────────────────────────
  25  |   // NAVIGATION
  26  |   // ─────────────────────────────────────────────
  27  | 
  28  |   async navigateTo(url: string): Promise<void> {
  29  |     await Reporter.step(`Navigate to: ${url}`, async () => {
  30  |       await this.page.goto(url);
  31  |       await this.page.waitForLoadState("domcontentloaded");
  32  |     });
  33  |   }
  34  | 
  35  |   async reload(): Promise<void> {
  36  |     await Reporter.step("Reload page", async () => {
  37  |       await this.page.reload();
  38  |       await this.page.waitForLoadState("domcontentloaded");
  39  |     });
  40  |   }
  41  | 
  42  |   async goBack(): Promise<void> {
  43  |     await Reporter.step("Navigate back", async () => {
  44  |       await this.page.goBack();
  45  |     });
  46  |   }
  47  | 
  48  |   // ─────────────────────────────────────────────
  49  |   // INTERACTIONS
  50  |   // ─────────────────────────────────────────────
  51  | 
  52  |   async click(locator: Locator, description: string): Promise<void> {
  53  |     await Reporter.step(`Click: ${description}`, async () => {
  54  |       await locator.waitFor({ state: "visible" });
  55  |       await locator.click();
  56  |     });
  57  |   }
  58  | 
  59  |   async fill(locator: Locator, value: string, description: string): Promise<void> {
  60  |     await Reporter.step(`Fill "${description}" with "${value}"`, async () => {
> 61  |       await locator.waitFor({ state: "visible" });
      |                     ^ Error: locator.waitFor: Target page, context or browser has been closed
  62  |       await locator.fill(value);
  63  |     });
  64  |   }
  65  | 
  66  |   async clearAndFill(locator: Locator, value: string, description: string): Promise<void> {
  67  |     await Reporter.step(`Clear and fill "${description}" with "${value}"`, async () => {
  68  |       await locator.waitFor({ state: "visible" });
  69  |       await locator.clear();
  70  |       await locator.fill(value);
  71  |     });
  72  |   }
  73  | 
  74  |   async selectOption(locator: Locator, value: string, description: string): Promise<void> {
  75  |     await Reporter.step(`Select "${value}" from "${description}"`, async () => {
  76  |       await locator.selectOption(value);
  77  |     });
  78  |   }
  79  | 
  80  |   async check(locator: Locator, description: string): Promise<void> {
  81  |     await Reporter.step(`Check: ${description}`, async () => {
  82  |       await locator.check();
  83  |     });
  84  |   }
  85  | 
  86  |   async uncheck(locator: Locator, description: string): Promise<void> {
  87  |     await Reporter.step(`Uncheck: ${description}`, async () => {
  88  |       await locator.uncheck();
  89  |     });
  90  |   }
  91  | 
  92  |   async hover(locator: Locator, description: string): Promise<void> {
  93  |     await Reporter.step(`Hover over: ${description}`, async () => {
  94  |       await locator.hover();
  95  |     });
  96  |   }
  97  | 
  98  |   async doubleClick(locator: Locator, description: string): Promise<void> {
  99  |     await Reporter.step(`Double-click: ${description}`, async () => {
  100 |       await locator.dblclick();
  101 |     });
  102 |   }
  103 | 
  104 |   async rightClick(locator: Locator, description: string): Promise<void> {
  105 |     await Reporter.step(`Right-click: ${description}`, async () => {
  106 |       await locator.click({ button: "right" });
  107 |     });
  108 |   }
  109 | 
  110 |   async pressKey(key: string): Promise<void> {
  111 |     await Reporter.step(`Press key: ${key}`, async () => {
  112 |       await this.page.keyboard.press(key);
  113 |     });
  114 |   }
  115 | 
  116 |   async uploadFile(locator: Locator, filePath: string, description: string): Promise<void> {
  117 |     await Reporter.step(`Upload file "${filePath}" via ${description}`, async () => {
  118 |       await locator.setInputFiles(filePath);
  119 |     });
  120 |   }
  121 | 
  122 |   async dragAndDrop(source: Locator, target: Locator, description: string): Promise<void> {
  123 |     await Reporter.step(`Drag and drop: ${description}`, async () => {
  124 |       await source.dragTo(target);
  125 |     });
  126 |   }
  127 | 
  128 |   // ─────────────────────────────────────────────
  129 |   // WAITS
  130 |   // ─────────────────────────────────────────────
  131 | 
  132 |   async waitForVisible(locator: Locator, description: string): Promise<void> {
  133 |     await Reporter.step(`Wait for visible: ${description}`, async () => {
  134 |       await locator.waitFor({ state: "visible" });
  135 |     });
  136 |   }
  137 | 
  138 |   async waitForHidden(locator: Locator, description: string): Promise<void> {
  139 |     await Reporter.step(`Wait for hidden: ${description}`, async () => {
  140 |       await locator.waitFor({ state: "hidden" });
  141 |     });
  142 |   }
  143 | 
  144 |   async waitForNetworkIdle(): Promise<void> {
  145 |     await Reporter.step("Wait for network idle", async () => {
  146 |       await this.page.waitForLoadState("networkidle");
  147 |     });
  148 |   }
  149 | 
  150 |   async waitForUrl(urlPattern: string | RegExp): Promise<void> {
  151 |     await Reporter.step(`Wait for URL: ${urlPattern}`, async () => {
  152 |       await this.page.waitForURL(urlPattern);
  153 |     });
  154 |   }
  155 | 
  156 |   // ─────────────────────────────────────────────
  157 |   // GETTERS  (no step wrapping — these are reads, not actions)
  158 |   // ─────────────────────────────────────────────
  159 | 
  160 |   async getText(locator: Locator): Promise<string> {
  161 |     return (await locator.textContent()) ?? "";
```