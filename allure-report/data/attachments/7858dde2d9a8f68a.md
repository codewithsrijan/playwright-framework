# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderMultiLevel.spec.ts >> SC-02: Page Builder — Multi-level page creation >> PB-02: Create a parent page with a child subpage and verify the hierarchy in the Pages tree
- Location: tests/PageBuilder/pageBuilderMultiLevel.spec.ts:23:7

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: locator.click: Test timeout of 300000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Save' })
    - locator resolved to <button disabled type="button" data-focus="false" class="Button---root---TwJp3 Button---secondary---H8yOM Button---small---HuPO_ Button---center---KFO8Q Button---disabled---XCoMG TopNavigationBar---buttonComponent---zqdWr">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    558 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [active] [ref=e9]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]:
            - button "Back to Page Builder main" [ref=e16]:
              - img [ref=e18]
              - generic [ref=e20]: Back to Page Builder main
            - heading "PB Parent terror labore 1779722403214" [level=1] [ref=e21]
          - list [ref=e22]:
            - listitem [ref=e23]:
              - generic [ref=e25]:
                - button [disabled]:
                  - generic:
                    - img
            - listitem [ref=e26]:
              - generic [ref=e28]:
                - button [disabled]:
                  - generic:
                    - img
            - listitem [ref=e29]:
              - generic [ref=e30]:
                - button "Edit" [ref=e31]:
                  - generic [ref=e32]: Edit
                - button "Preview" [ref=e33]:
                  - generic [ref=e34]: Preview
            - listitem [ref=e35]:
              - button "Revert" [disabled]:
                - generic: Revert
            - listitem [ref=e36]:
              - button "Save" [disabled]:
                - generic: Save
            - listitem [ref=e37]:
              - generic [ref=e39]:
                - button "Publish" [disabled]:
                  - generic: Publish
        - generic [ref=e40]:
          - generic [ref=e42]:
            - tablist [ref=e43]:
              - tab "Pages" [selected] [ref=e44] [cursor=pointer]
              - tab "Design" [ref=e45] [cursor=pointer]
            - tabpanel "Pages" [ref=e46]:
              - generic [ref=e47]:
                - generic [ref=e49]:
                  - generic [ref=e50] [cursor=pointer]:
                    - button "Drag to reorder" [ref=e51]:
                      - img [ref=e53]
                    - button [ref=e62]:
                      - img [ref=e64]
                    - button "PB Parent terror labore 1779722403214" [ref=e66]:
                      - generic [ref=e67]:
                        - img [ref=e70]
                        - generic [ref=e75]: PB Parent terror labore 1779722403214
                  - generic [ref=e76]:
                    - generic [ref=e77]:
                      - generic [ref=e78] [cursor=pointer]:
                        - button "Drag to reorder" [ref=e79]:
                          - img [ref=e81]
                        - button [ref=e90]:
                          - img [ref=e92]
                        - button "Digital Academy" [ref=e94]:
                          - generic [ref=e95]:
                            - img [ref=e98]
                            - generic [ref=e103]: Digital Academy
                      - generic [ref=e106] [cursor=pointer]:
                        - button "Drag to reorder" [ref=e107]:
                          - img [ref=e109]
                        - button "Skill Page" [ref=e117]:
                          - generic [ref=e118]:
                            - img [ref=e121]
                            - generic [ref=e126]: Skill Page
                    - generic [ref=e128] [cursor=pointer]:
                      - button "Drag to reorder" [ref=e129]:
                        - img [ref=e131]
                      - button "PB Child via thorax" [ref=e139]:
                        - generic [ref=e140]:
                          - img [ref=e143]
                          - generic [ref=e148]: PB Child via thorax
                      - button "Actions null" [ref=e154]:
                        - img [ref=e156]
                - status [ref=e158]
          - generic [ref=e169]:
            - img [ref=e171]
            - generic [ref=e175]: Drag and drop items from Design panel
        - status [ref=e176]
    - generic:
      - log [ref=e177]
      - log [ref=e178]
      - log [ref=e179]
      - log [ref=e180]
  - generic [ref=e181]: Percipio
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
> 55  |       await locator.click();
      |                     ^ Error: locator.click: Test timeout of 300000ms exceeded.
  56  |     });
  57  |   }
  58  | 
  59  |   async fill(locator: Locator, value: string, description: string): Promise<void> {
  60  |     await Reporter.step(`Fill "${description}" with "${value}"`, async () => {
  61  |       await locator.waitFor({ state: "visible" });
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
```