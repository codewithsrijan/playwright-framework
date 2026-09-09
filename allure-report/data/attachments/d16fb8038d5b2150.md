# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderActionMenus.spec.ts >> SC-05: Page Builder — Action menu validation >> PB-05a: Verify all 5 row-level actions on the Page Builder list page
- Location: tests/PageBuilder/pageBuilderActionMenus.spec.ts:24:7

# Error details

```
Test timeout of 300000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 300000ms exceeded.
Call log:
  - waiting for locator('[data-marker="flexibleDataTableContainer"]').getByRole('row').filter({ hasText: 'PB Actions clam modi 1779712988235' }).locator('[data-marker="Actions"]').first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - link "Jump to main content" [ref=e8]
        - banner [ref=e10]:
          - generic [ref=e11]:
            - button "Skillsoft apps" [ref=e15] [cursor=pointer]:
              - generic [ref=e16]:
                - img [ref=e19]
                - generic [ref=e21]: Skillsoft apps
            - link "Percipio Home" [ref=e22] [cursor=pointer]:
              - /url: /
              - img [ref=e24]
            - generic [ref=e26]:
              - generic [ref=e29]:
                - generic [ref=e30]: Search
                - combobox "Search" [ref=e31]
              - generic [ref=e32]:
                - button "Search" [disabled]:
                  - generic:
                    - img
            - generic "Language" [ref=e33]:
              - button "Language English (US)" [ref=e37] [cursor=pointer]:
                - generic [ref=e40]:
                  - img [ref=e42]
                  - generic [ref=e44]: EN-US
            - 'button "Experience Points: 0" [ref=e47] [cursor=pointer]':
              - img [ref=e49]
              - generic [ref=e52]: 0 XP
            - link "My Achievements" [ref=e55] [cursor=pointer]:
              - /url: /profile/achievements
              - img [ref=e59]
            - button "4 notifications to read" [ref=e64] [cursor=pointer]:
              - img "4 notifications to read" [ref=e70]
            - button "AI Assistant" [ref=e77] [cursor=pointer]:
              - img [ref=e79]
            - button "My Profile" [ref=e85] [cursor=pointer]:
              - generic [ref=e89]: My Profile
            - generic [ref=e90]:
              - button "Site Navigation" [expanded] [ref=e94]:
                - img [ref=e96]
              - generic [ref=e98]:
                - button "Switch to my learner view" [ref=e100] [cursor=pointer]:
                  - img [ref=e102]
                  - text: Switch to my learner view
                - generic [ref=e105]:
                  - navigation [ref=e106]:
                    - list [ref=e107]:
                      - listitem
                      - listitem [ref=e108]:
                        - button "Main Menu" [ref=e110] [cursor=pointer]:
                          - img [ref=e112]
                          - generic [ref=e114]: Main Menu
                      - listitem [ref=e115]:
                        - generic [ref=e117]:
                          - img [ref=e119]
                          - generic [ref=e121]: Learning
                        - list [ref=e122]:
                          - listitem [ref=e123]:
                            - link "Assignments" [ref=e124] [cursor=pointer]:
                              - /url: /admin/assignments
                              - generic [ref=e125]: Assignments
                          - listitem [ref=e126]:
                            - link "Business Objectives" [ref=e127] [cursor=pointer]:
                              - /url: /admin/custom-business-objectives
                              - generic [ref=e128]: Business Objectives
                          - listitem [ref=e129]:
                            - link "Completions & Waivers" [ref=e130] [cursor=pointer]:
                              - /url: /admin/completion-override
                              - generic [ref=e131]: Completions & Waivers
                          - listitem [ref=e132]:
                            - link "Reset Course Progress" [ref=e133] [cursor=pointer]:
                              - /url: /admin/reset-course-progress
                              - generic [ref=e134]: Reset Course Progress
                          - listitem [ref=e135]:
                            - link "Content Promotions" [ref=e136] [cursor=pointer]:
                              - /url: /admin/promoted-content
                              - generic [ref=e137]: Content Promotions
                          - listitem [ref=e138]:
                            - link "External Learning" [ref=e139] [cursor=pointer]:
                              - /url: /admin/report/dw/external-learning
                              - generic [ref=e140]: External Learning
                          - listitem [ref=e141]:
                            - link "Page Builder" [ref=e142] [cursor=pointer]:
                              - /url: /admin/landing-pages
                              - generic [ref=e143]: Page Builder
                              - generic [ref=e146]: BETA
                          - listitem [ref=e147]:
                            - link "Q&A Management" [ref=e148] [cursor=pointer]:
                              - /url: /admin/qa-management
                              - generic [ref=e149]: Q&A Management
                  - navigation "settings and help" [ref=e150]:
                    - list [ref=e151]:
                      - listitem [ref=e152]:
                        - link "My Settings" [ref=e153] [cursor=pointer]:
                          - /url: /profile/account-information
                          - img [ref=e155]
                          - generic [ref=e157]: My Settings
                      - listitem [ref=e158]:
                        - link "Help" [ref=e159] [cursor=pointer]:
                          - /url: /help
                          - img [ref=e161]
                          - generic [ref=e163]: Help
                      - listitem [ref=e164]:
                        - link "Log Out" [ref=e165] [cursor=pointer]:
                          - /url: https://plat3-complete.front.develop.squads-dev.com/login#/logout
                          - img [ref=e167]
                          - generic [ref=e169]: Log Out
      - generic [ref=e172]:
        - main [ref=e173]:
          - generic [ref=e175]:
            - generic:
              - generic "Breadcrumb":
                - generic:
                  - heading [level=1]
            - generic [ref=e179]:
              - generic [ref=e180]:
                - heading "Welcome to your Page Builder!" [level=2] [ref=e181]:
                  - text: Welcome to your Page Builder!
                  - listitem [ref=e182]:
                    - generic [ref=e183]: BETA
                - paragraph [ref=e184]: Easily create customized and impactful pages that drive learning.
              - generic [ref=e185]:
                - heading "Choose a template and customize it to fit your needs." [level=3] [ref=e186]
                - generic [ref=e187]:
                  - generic [ref=e188]:
                    - generic [ref=e189]:
                      - img "template-image" [ref=e190]
                      - generic [ref=e192]: Academy Experience
                    - paragraph [ref=e194]: Build a one-stop hub for learning resources across multiple topics. This template helps you organize content and invite learners to explore, engage, and grow with expert guidance.
                    - button "Get started" [ref=e196]:
                      - generic [ref=e197]: Get started
                      - img [ref=e199]
                  - generic [ref=e203]:
                    - heading "Coming soon" [level=4] [ref=e204]
                    - paragraph [ref=e205]: Audience/Function-Based
                  - generic [ref=e214]:
                    - heading "Coming soon" [level=4] [ref=e215]
                    - paragraph [ref=e216]: Learning Program Marketing
              - generic [ref=e223]:
                - generic [ref=e224]:
                  - heading "Your pages at a glance" [level=3] [ref=e225]
                  - generic [ref=e226]: 0/10 published pages
                - generic [ref=e230]:
                  - generic [ref=e231]: 1 to 2 of 2. Page 1 of 1
                  - text:  
                  - treegrid [ref=e232]:
                    - rowgroup [ref=e233]:
                      - row "Name" [ref=e234]:
                        - columnheader "Name" [ref=e235]:
                          - generic [ref=e237] [cursor=pointer]: 
                          - generic [ref=e238]: Name
                          - text: 
                    - rowgroup [ref=e240]:
                      - row "Status Type Modified Date Created By" [ref=e241]:
                        - columnheader "Status" [ref=e242]:
                          - generic [ref=e244] [cursor=pointer]: 
                          - generic [ref=e245] [cursor=pointer]: Status
                          - text: 
                        - columnheader "Type" [ref=e248]:
                          - generic [ref=e250] [cursor=pointer]: 
                          - generic [ref=e251] [cursor=pointer]: Type
                          - text: 
                        - columnheader "Modified Date" [ref=e254]:
                          - generic [ref=e256] [cursor=pointer]: 
                          - generic [ref=e257] [cursor=pointer]: Modified Date
                          - text: 
                        - columnheader "Created By" [ref=e260]:
                          - generic [ref=e262] [cursor=pointer]: 
                          - generic [ref=e263] [cursor=pointer]: Created By
                          - text: 
                    - rowgroup [ref=e264]:
                      - row [ref=e265]:
                        - columnheader [ref=e266]: 
                    - rowgroup [ref=e268]:
                      - row " PB Actions clam modi 1779712988235" [ref=e269]:
                        - gridcell " PB Actions clam modi 1779712988235" [ref=e270] [cursor=pointer]:
                          - generic [ref=e271]:
                            - text: 
                            - generic [ref=e272]: 
                            - generic [ref=e273]: PB Actions clam modi 1779712988235
                      - row "Testtier" [ref=e274]:
                        - gridcell "Testtier" [ref=e275] [cursor=pointer]:
                          - generic [ref=e276]:
                            - text:  
                            - generic [ref=e277]: Testtier
                    - rowgroup [ref=e278]:
                      - row "Draft custom May 25, 2026" [ref=e279]:
                        - gridcell "Draft" [ref=e280]
                        - gridcell "custom" [ref=e281]
                        - gridcell "May 25, 2026" [ref=e282]
                        - gridcell [ref=e283]
                      - row "Draft custom Mar 18, 2026" [ref=e284]:
                        - gridcell "Draft" [ref=e285]
                        - gridcell "custom" [ref=e286]
                        - gridcell "Mar 18, 2026" [ref=e287]
                        - gridcell [ref=e288]
                    - rowgroup [ref=e289]:
                      - row "Actions" [ref=e290]:
                        - gridcell "Actions" [ref=e291]:
                          - button "Actions" [ref=e295]:
                            - img [ref=e297]
                      - row "Actions" [ref=e299]:
                        - gridcell "Actions" [ref=e300]:
                          - button "Actions" [ref=e304]:
                            - img [ref=e306]
                    - rowgroup
                    - rowgroup
                    - rowgroup [ref=e308]
                    - rowgroup
                    - rowgroup
                  - generic [ref=e309]:
                    - tablist [ref=e310]:
                      - tab "Columns" [ref=e311] [cursor=pointer]:
                        - generic [ref=e312]: 
                        - generic [ref=e313]: Columns
                    - text:    
                  - generic [ref=e314]:
                    - generic [ref=e315]:
                      - generic [ref=e316]: "Page Size:"
                      - combobox "Page Size" [ref=e317]:
                        - generic [ref=e318]: "10"
                        - generic [ref=e319] [cursor=pointer]: 
                    - generic [ref=e320]: 1 to 2 of 2
                    - button "First Page" [disabled] [ref=e321]: 
                    - button "Previous Page" [disabled] [ref=e322]: 
                    - generic [ref=e323]: Page 1 of 1
                    - button "Next Page" [disabled] [ref=e324]: 
                    - button "Last Page" [disabled] [ref=e325]: 
        - contentinfo [ref=e326]:
          - generic [ref=e327]:
            - list [ref=e328]:
              - listitem [ref=e329]:
                - link "License Agreement" [ref=e330] [cursor=pointer]:
                  - /url: https://documentation.skillsoft.com/en_us/privacy/skillsoft_license_agreement.htm
              - listitem [ref=e331]:
                - link "Privacy Notice" [ref=e332] [cursor=pointer]:
                  - /url: https://www.skillsoft.com/about/privacy-notice
              - listitem [ref=e333]:
                - link "Help" [ref=e334] [cursor=pointer]:
                  - /url: /help
            - generic [ref=e335]:
              - paragraph [ref=e336]: © Copyright 2026 Skillsoft Ireland Limited. All rights reserved.PMBOK, PMI, PMP, CAPM, PMI-ACP, PgMP, PMI-RMP and PMI-SP are trademarks of the Project Management Institute, Inc.
              - paragraph [ref=e337]:
                - img "Skillsoft logo" [ref=e338]
          - generic [ref=e339]:
            - generic [ref=e340]:
              - heading "Get the app" [level=2] [ref=e341]
              - button "Smart App Login" [ref=e342]:
                - generic [ref=e343]: Smart App Login
            - generic [ref=e344]: Improve yourself in minutes a day — anytime, anywhere.Use plat3-complete as your site name to get started!
            - generic [ref=e345]:
              - link "Download on the App Store" [ref=e347] [cursor=pointer]:
                - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_iOS
                - img [ref=e348]
              - link "Get it on Google Play" [ref=e350] [cursor=pointer]:
                - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_Android
                - img [ref=e351]
    - generic:
      - log [ref=e352]
      - log [ref=e353]
      - log [ref=e354]
      - log [ref=e355]
  - generic [ref=e356]: Percipio
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
> 54  |       await locator.waitFor({ state: "visible" });
      |                     ^ Error: locator.waitFor: Test timeout of 300000ms exceeded.
  55  |       await locator.click();
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
```