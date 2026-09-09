# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderColumns.spec.ts >> SC-06: Page Builder — Columns picker validation >> PB-06b: Hide and re-show a single column — Status column visibility toggle
- Location: tests/PageBuilder/pageBuilderColumns.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('columnheader', { name: /Status/i })
Expected: visible
Error: strict mode violation: getByRole('columnheader', { name: /Status/i }) resolved to 2 elements:
    1) <div tabindex="-1" aria-sort="none" aria-colindex="2" role="columnheader" col-id="publishedStatus" class="ag-header-cell ag-header-parent-hidden ag-header-cell-sortable ag-focus-managed">…</div> aka getByRole('columnheader', { name: 'Status', exact: true })
    2) <div tabindex="-1" aria-sort="none" aria-colindex="5" role="columnheader" col-id="translationStatus" class="ag-header-cell ag-header-parent-hidden ag-header-cell-sortable ag-focus-managed">…</div> aka getByRole('columnheader', { name: 'Translation Status' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('columnheader', { name: /Status/i })

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - generic [ref=e52]: XP
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
                            - link "Learner Submissions" [ref=e133] [cursor=pointer]:
                              - /url: /admin/learner-submissions
                              - generic [ref=e134]: Learner Submissions
                          - listitem [ref=e135]:
                            - link "Reset Course Progress" [ref=e136] [cursor=pointer]:
                              - /url: /admin/reset-course-progress
                              - generic [ref=e137]: Reset Course Progress
                          - listitem [ref=e138]:
                            - link "Content Promotions" [ref=e139] [cursor=pointer]:
                              - /url: /admin/promoted-content
                              - generic [ref=e140]: Content Promotions
                          - listitem [ref=e141]:
                            - link "External Learning" [ref=e142] [cursor=pointer]:
                              - /url: /admin/report/dw/external-learning
                              - generic [ref=e143]: External Learning
                          - listitem [ref=e144]:
                            - link "Learning Programs" [ref=e145] [cursor=pointer]:
                              - /url: /admin/learning-programs
                              - generic [ref=e146]: Learning Programs
                          - listitem [ref=e147]:
                            - link "Page Builder" [ref=e148] [cursor=pointer]:
                              - /url: /admin/landing-pages
                              - generic [ref=e149]: Page Builder
                          - listitem [ref=e150]:
                            - link "Q&A Management" [ref=e151] [cursor=pointer]:
                              - /url: /admin/qa-management
                              - generic [ref=e152]: Q&A Management
                          - listitem [ref=e153]:
                            - link "Question Feedback" [ref=e154] [cursor=pointer]:
                              - /url: /admin/question-feedback
                              - generic [ref=e155]: Question Feedback
                  - navigation "settings and help" [ref=e156]:
                    - list [ref=e157]:
                      - listitem [ref=e158]:
                        - link "My Settings" [ref=e159] [cursor=pointer]:
                          - /url: /profile/account-information
                          - img [ref=e161]
                          - generic [ref=e163]: My Settings
                      - listitem [ref=e164]:
                        - link "Help" [ref=e165] [cursor=pointer]:
                          - /url: /help
                          - img [ref=e167]
                          - generic [ref=e169]: Help
                      - listitem [ref=e170]:
                        - link "Log Out" [ref=e171] [cursor=pointer]:
                          - /url: https://plat3-complete.front.develop.squads-dev.com/login#/logout
                          - img [ref=e173]
                          - generic [ref=e175]: Log Out
      - generic [ref=e178]:
        - main [ref=e179]:
          - generic [ref=e181]:
            - generic:
              - generic "Breadcrumb":
                - generic:
                  - heading [level=1]
            - generic [ref=e185]:
              - generic [ref=e186]:
                - heading "Welcome to your Page Builder!" [level=2] [ref=e187]:
                  - text: Welcome to your Page Builder!
                  - listitem [ref=e188]:
                    - generic [ref=e189]: BETA
                - paragraph [ref=e190]: Easily create customized and impactful pages that drive learning.
              - generic [ref=e191]:
                - heading "Choose a template and customize it to fit your needs." [level=3] [ref=e192]
                - generic [ref=e193]:
                  - generic [ref=e194]:
                    - generic [ref=e195]:
                      - img "template-image" [ref=e196]
                      - generic [ref=e198]: Academy Experience
                    - paragraph [ref=e200]: Build a one-stop hub for learning resources across multiple topics. This template helps you organize content and invite learners to explore, engage, and grow with expert guidance.
                    - button "Get started" [ref=e202]:
                      - generic [ref=e203]: Get started
                      - img [ref=e205]
                  - generic [ref=e209]:
                    - heading "Coming soon" [level=4] [ref=e210]
                    - paragraph [ref=e211]: Audience/Function-Based
                  - generic [ref=e220]:
                    - heading "Coming soon" [level=4] [ref=e221]
                    - paragraph [ref=e222]: Learning Program Marketing
              - generic [ref=e230]:
                - tablist [ref=e231]:
                  - tab "Pages" [selected] [ref=e232] [cursor=pointer]
                  - tab "Safelisted URLs" [ref=e233] [cursor=pointer]
                - tabpanel "Pages" [ref=e234]:
                  - generic [ref=e235]:
                    - heading "Your pages at a glance" [level=3] [ref=e236]
                    - generic [ref=e240]:
                      - img [ref=e242]
                      - generic [ref=e244]: 0 of 10 pages published. You can publish up to 10 pages.
                  - generic [ref=e248]:
                    - generic [ref=e249]: 1 to 10 of 124. Page 1 of 13
                    - text:  
                    - treegrid [ref=e250]:
                      - rowgroup [ref=e251]:
                        - row "Name" [ref=e252]:
                          - columnheader "Name" [ref=e253]:
                            - generic [ref=e255] [cursor=pointer]: 
                            - generic [ref=e256]: Name
                            - text: 
                      - rowgroup [ref=e258]:
                        - row "Status Type Languages Translation Status" [ref=e259]:
                          - columnheader "Status" [ref=e260]:
                            - generic [ref=e262] [cursor=pointer]: 
                            - generic [ref=e263] [cursor=pointer]: Status
                            - text: 
                          - columnheader "Type" [ref=e266]:
                            - generic [ref=e268] [cursor=pointer]: 
                            - generic [ref=e269] [cursor=pointer]: Type
                            - text: 
                          - columnheader "Languages" [ref=e272]:
                            - generic [ref=e274] [cursor=pointer]: 
                            - generic [ref=e275] [cursor=pointer]: Languages
                            - text: 
                          - columnheader "Translation Status" [ref=e278]:
                            - generic [ref=e280] [cursor=pointer]: 
                            - generic [ref=e281] [cursor=pointer]: Translation Status
                            - text: 
                      - rowgroup [ref=e284]:
                        - row [ref=e285]:
                          - columnheader [ref=e286]: 
                      - rowgroup [ref=e288]:
                        - row " PB Audience voco varietas 1784783952910" [ref=e289]:
                          - gridcell " PB Audience voco varietas 1784783952910" [ref=e290] [cursor=pointer]:
                            - generic [ref=e291]:
                              - text: 
                              - generic [ref=e292]: 
                              - generic [ref=e293]: PB Audience voco varietas 1784783952910
                        - row " PB Editor Actions copia tergum 1784783937769" [ref=e294]:
                          - gridcell " PB Editor Actions copia tergum 1784783937769" [ref=e295] [cursor=pointer]:
                            - generic [ref=e296]:
                              - text: 
                              - generic [ref=e297]: 
                              - generic [ref=e298]: PB Editor Actions copia tergum 1784783937769
                        - row " PB Actions atrox tollo 1784783920378" [ref=e299]:
                          - gridcell " PB Actions atrox tollo 1784783920378" [ref=e300] [cursor=pointer]:
                            - generic [ref=e301]:
                              - text: 
                              - generic [ref=e302]: 
                              - generic [ref=e303]: PB Actions atrox tollo 1784783920378
                        - row " PB Parent ater claro 1779882039597" [ref=e304]:
                          - gridcell " PB Parent ater claro 1779882039597" [ref=e305] [cursor=pointer]:
                            - generic [ref=e306]:
                              - text: 
                              - generic [ref=e307]: 
                              - generic [ref=e308]: PB Parent ater claro 1779882039597
                        - row " PB DnD Reorder adsum admoneo 1779882017730" [ref=e309]:
                          - gridcell " PB DnD Reorder adsum admoneo 1779882017730" [ref=e310] [cursor=pointer]:
                            - generic [ref=e311]:
                              - text: 
                              - generic [ref=e312]: 
                              - generic [ref=e313]: PB DnD Reorder adsum admoneo 1779882017730
                        - row " PB DnD amiculum derelinquo 1779881976265" [ref=e314]:
                          - gridcell " PB DnD amiculum derelinquo 1779881976265" [ref=e315] [cursor=pointer]:
                            - generic [ref=e316]:
                              - text: 
                              - generic [ref=e317]: 
                              - generic [ref=e318]: PB DnD amiculum derelinquo 1779881976265
                        - row " PB Components appono enim 1779881934748" [ref=e319]:
                          - gridcell " PB Components appono enim 1779881934748" [ref=e320] [cursor=pointer]:
                            - generic [ref=e321]:
                              - text: 
                              - generic [ref=e322]: 
                              - generic [ref=e323]: PB Components appono enim 1779881934748
                        - row " PB Audience subnecto atrox 1779881886118" [ref=e324]:
                          - gridcell " PB Audience subnecto atrox 1779881886118" [ref=e325] [cursor=pointer]:
                            - generic [ref=e326]:
                              - text: 
                              - generic [ref=e327]: 
                              - generic [ref=e328]: PB Audience subnecto atrox 1779881886118
                        - row " PB Editor Actions tredecim rerum 1779881873018" [ref=e329]:
                          - gridcell " PB Editor Actions tredecim rerum 1779881873018" [ref=e330] [cursor=pointer]:
                            - generic [ref=e331]:
                              - text: 
                              - generic [ref=e332]: 
                              - generic [ref=e333]: PB Editor Actions tredecim rerum 1779881873018
                        - row " PB Actions cito vulpes 1779881857863" [ref=e334]:
                          - gridcell " PB Actions cito vulpes 1779881857863" [ref=e335] [cursor=pointer]:
                            - generic [ref=e336]:
                              - text: 
                              - generic [ref=e337]: 
                              - generic [ref=e338]: PB Actions cito vulpes 1779881857863
                      - rowgroup [ref=e339]:
                        - row "Draft custom" [ref=e340]:
                          - gridcell "Draft" [ref=e341]
                          - gridcell "custom" [ref=e342]
                          - gridcell [ref=e343]:
                            - listitem [ref=e345]:
                              - generic [ref=e346]: EN
                          - gridcell [ref=e347]
                        - row "Draft custom" [ref=e348]:
                          - gridcell "Draft" [ref=e349]
                          - gridcell "custom" [ref=e350]
                          - gridcell [ref=e351]:
                            - listitem [ref=e353]:
                              - generic [ref=e354]: EN
                          - gridcell [ref=e355]
                        - row "Draft custom" [ref=e356]:
                          - gridcell "Draft" [ref=e357]
                          - gridcell "custom" [ref=e358]
                          - gridcell [ref=e359]:
                            - listitem [ref=e361]:
                              - generic [ref=e362]: EN
                          - gridcell [ref=e363]
                        - row "Draft custom -" [ref=e364]:
                          - gridcell "Draft" [ref=e365]
                          - gridcell "custom" [ref=e366]
                          - gridcell "-" [ref=e367]
                          - gridcell [ref=e368]
                        - row "Draft custom -" [ref=e369]:
                          - gridcell "Draft" [ref=e370]
                          - gridcell "custom" [ref=e371]
                          - gridcell "-" [ref=e372]
                          - gridcell [ref=e373]
                        - row "Draft custom -" [ref=e374]:
                          - gridcell "Draft" [ref=e375]
                          - gridcell "custom" [ref=e376]
                          - gridcell "-" [ref=e377]
                          - gridcell [ref=e378]
                        - row "Draft custom -" [ref=e379]:
                          - gridcell "Draft" [ref=e380]
                          - gridcell "custom" [ref=e381]
                          - gridcell "-" [ref=e382]
                          - gridcell [ref=e383]
                        - row "Draft custom -" [ref=e384]:
                          - gridcell "Draft" [ref=e385]
                          - gridcell "custom" [ref=e386]
                          - gridcell "-" [ref=e387]
                          - gridcell [ref=e388]
                        - row "Draft custom -" [ref=e389]:
                          - gridcell "Draft" [ref=e390]
                          - gridcell "custom" [ref=e391]
                          - gridcell "-" [ref=e392]
                          - gridcell [ref=e393]
                        - row "Draft custom -" [ref=e394]:
                          - gridcell "Draft" [ref=e395]
                          - gridcell "custom" [ref=e396]
                          - gridcell "-" [ref=e397]
                          - gridcell [ref=e398]
                      - rowgroup [ref=e399]:
                        - row "Actions" [ref=e400]:
                          - gridcell "Actions" [ref=e401]:
                            - button "Actions" [ref=e405]:
                              - img [ref=e407]
                        - row "Actions" [ref=e409]:
                          - gridcell "Actions" [ref=e410]:
                            - button "Actions" [ref=e414]:
                              - img [ref=e416]
                        - row "Actions" [ref=e418]:
                          - gridcell "Actions" [ref=e419]:
                            - button "Actions" [ref=e423]:
                              - img [ref=e425]
                        - row "Actions" [ref=e427]:
                          - gridcell "Actions" [ref=e428]:
                            - button "Actions" [ref=e432]:
                              - img [ref=e434]
                        - row "Actions" [ref=e436]:
                          - gridcell "Actions" [ref=e437]:
                            - button "Actions" [ref=e441]:
                              - img [ref=e443]
                        - row "Actions" [ref=e445]:
                          - gridcell "Actions" [ref=e446]:
                            - button "Actions" [ref=e450]:
                              - img [ref=e452]
                        - row "Actions" [ref=e454]:
                          - gridcell "Actions" [ref=e455]:
                            - button "Actions" [ref=e459]:
                              - img [ref=e461]
                        - row "Actions" [ref=e463]:
                          - gridcell "Actions" [ref=e464]:
                            - button "Actions" [ref=e468]:
                              - img [ref=e470]
                        - row "Actions" [ref=e472]:
                          - gridcell "Actions" [ref=e473]:
                            - button "Actions" [ref=e477]:
                              - img [ref=e479]
                        - row "Actions" [ref=e481]:
                          - gridcell "Actions" [ref=e482]:
                            - button "Actions" [ref=e486]:
                              - img [ref=e488]
                      - rowgroup
                      - rowgroup
                      - rowgroup [ref=e490]
                      - rowgroup
                      - rowgroup
                    - generic [ref=e491]:
                      - tablist [ref=e492]:
                        - tab "Columns" [expanded] [active] [ref=e493] [cursor=pointer]:
                          - generic [ref=e494]: 
                          - generic [ref=e495]: Columns
                      - tabpanel "Columns" [ref=e496]:
                        - generic [ref=e498]:
                          - generic [ref=e499]:
                            - text:   
                            - checkbox "Toggle All Columns Visibility" [checked] [ref=e501]
                            - textbox "Filter Columns Input" [ref=e503]:
                              - /placeholder: Search...
                            - tree "Column List 11 Columns" [ref=e504]:
                              - treeitem "Status Column" [level=1] [ref=e505]:
                                - generic [ref=e506]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e507]
                                  - text: 
                                  - generic [ref=e508]: Status
                              - treeitem "Type Column" [level=1] [ref=e509]:
                                - generic [ref=e510]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e511]
                                  - text: 
                                  - generic [ref=e512]: Type
                              - treeitem "Languages Column" [level=1] [ref=e513]:
                                - generic [ref=e514]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e515]
                                  - text: 
                                  - generic [ref=e516]: Languages
                              - treeitem "Translation Status Column" [level=1] [ref=e517]:
                                - generic [ref=e518]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e519]
                                  - text: 
                                  - generic [ref=e520]: Translation Status
                              - treeitem "Collaborators Column" [level=1] [ref=e521]:
                                - generic [ref=e522]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e523]
                                  - text: 
                                  - generic [ref=e524]: Collaborators
                              - treeitem "Audience Associated Column" [level=1] [ref=e525]:
                                - generic [ref=e526]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e527]
                                  - text: 
                                  - generic [ref=e528]: Audience Associated
                              - treeitem "Default Page Audiences Column" [level=1] [ref=e529]:
                                - generic [ref=e530]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e531]
                                  - text: 
                                  - generic [ref=e532]: Default Page Audiences
                              - treeitem "Modified By Column" [level=1] [ref=e533]:
                                - generic [ref=e534]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e535]
                                  - text: 
                                  - generic [ref=e536]: Modified By
                              - treeitem "Modified Date Column" [level=1] [ref=e537]:
                                - generic [ref=e538]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e539]
                                  - text: 
                                  - generic [ref=e540]: Modified Date
                              - treeitem "Created By Column" [level=1] [ref=e541]:
                                - generic [ref=e542]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e543]
                                  - text: 
                                  - generic [ref=e544]: Created By
                              - treeitem "Column" [level=1] [ref=e545]:
                                - generic [ref=e546]:
                                  - checkbox "Press SPACE to toggle visibility (visible)" [checked] [ref=e547]
                                  - text: 
                          - generic [ref=e549]:
                            - text: 
                            - generic [ref=e550]: Row Groups
                          - generic "Row Groups" [ref=e551]:
                            - generic [ref=e552]: Drag here to set row groups
                    - generic [ref=e553]:
                      - generic [ref=e554]:
                        - generic [ref=e555]: "Page Size:"
                        - combobox "Page Size" [ref=e556]:
                          - generic [ref=e557]: "10"
                          - generic [ref=e558] [cursor=pointer]: 
                      - generic [ref=e559]: 1 to 10 of 124
                      - button "First Page" [disabled] [ref=e560]: 
                      - button "Previous Page" [disabled] [ref=e561]: 
                      - generic [ref=e562]: Page 1 of 13
                      - button "Next Page" [ref=e563] [cursor=pointer]: 
                      - button "Last Page" [ref=e564] [cursor=pointer]: 
        - contentinfo [ref=e565]:
          - generic [ref=e566]:
            - list [ref=e567]:
              - listitem [ref=e568]:
                - link "License Agreement" [ref=e569] [cursor=pointer]:
                  - /url: https://documentation.skillsoft.com/en_us/privacy/skillsoft_license_agreement.htm
              - listitem [ref=e570]:
                - link "Privacy Notice" [ref=e571] [cursor=pointer]:
                  - /url: https://www.skillsoft.com/about/privacy-notice
              - listitem [ref=e572]:
                - link "Help" [ref=e573] [cursor=pointer]:
                  - /url: /help
            - generic [ref=e574]:
              - paragraph [ref=e575]: © Copyright 2026 Skillsoft Ireland Limited. All rights reserved.PMBOK, PMI, PMP, CAPM, PMI-ACP, PgMP, PMI-RMP and PMI-SP are trademarks of the Project Management Institute, Inc.
              - paragraph [ref=e576]:
                - img "Skillsoft logo" [ref=e577]
          - generic [ref=e578]:
            - generic [ref=e579]:
              - heading "Get the app" [level=2] [ref=e580]
              - button "Smart App Login" [ref=e581]:
                - generic [ref=e582]: Smart App Login
            - generic [ref=e583]: Improve yourself in minutes a day — anytime, anywhere.Use plat3-complete as your site name to get started!
            - generic [ref=e584]:
              - link "Download on the App Store" [ref=e586] [cursor=pointer]:
                - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_iOS
                - img [ref=e587]
              - link "Get it on Google Play" [ref=e589] [cursor=pointer]:
                - /url: https://my.percipio.com/mobile/v1/appLinks/PercipioWeb_Android
                - img [ref=e590]
    - generic:
      - log [ref=e591]
      - log [ref=e592]
      - log [ref=e593]
      - log [ref=e594]
  - generic [ref=e595]: Percipio
```

# Test source

```ts
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
> 384 |         ).toBeVisible({ timeout: 10_000 });
      |           ^ Error: expect(locator).toBeVisible() failed
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
  417 |           ).toBeVisible();
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