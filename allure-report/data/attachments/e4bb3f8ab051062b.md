# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/PageBuilder/pageBuilderDragDrop.spec.ts >> SC-07: Page Builder — Drag-and-drop component validation >> PB-07b: Reorder two canvas components — verify DOM position changes after drag
- Location: tests/PageBuilder/pageBuilderDragDrop.spec.ts:70:7

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 345.609375
Received:    397.609375
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e9]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]:
            - button "Back to Page Builder main" [ref=e16]:
              - img [ref=e18]
              - generic [ref=e20]: Back to Page Builder main
            - heading "PB DnD Reorder defessus nisi 1779730307628" [level=1] [ref=e21]
          - list [ref=e22]:
            - listitem [ref=e23]:
              - button [ref=e26]:
                - img [ref=e28]
            - listitem [ref=e30]:
              - generic [ref=e32]:
                - button [disabled]:
                  - generic:
                    - img
            - listitem [ref=e33]:
              - generic [ref=e34]:
                - button "Edit" [ref=e35]:
                  - generic [ref=e36]: Edit
                - button "Preview" [ref=e37]:
                  - generic [ref=e38]: Preview
            - listitem [ref=e39]:
              - button "Revert" [ref=e40]:
                - generic [ref=e41]: Revert
            - listitem [ref=e42]:
              - button "Save" [ref=e43]:
                - generic [ref=e44]: Save
            - listitem [ref=e45]:
              - button "Publish" [ref=e46]:
                - generic [ref=e47]: Publish
        - generic [ref=e48]:
          - generic [ref=e50]:
            - tablist [ref=e51]:
              - tab "Pages" [ref=e52] [cursor=pointer]
              - tab "Design" [selected] [ref=e53] [cursor=pointer]
            - tabpanel "Design" [ref=e54]:
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]: Basic
                  - generic [ref=e61]:
                    - button "Text" [ref=e62]:
                      - generic [ref=e63]:
                        - img [ref=e66]
                        - generic [ref=e68]: Text
                    - button "Button" [ref=e69]:
                      - generic [ref=e70]:
                        - img [ref=e73]
                        - generic [ref=e75]: Button
                    - button "Image" [ref=e76]:
                      - generic [ref=e77]:
                        - img [ref=e80]
                        - generic [ref=e83]: Image
                    - button "Video" [ref=e84]:
                      - generic [ref=e85]:
                        - img [ref=e88]
                        - generic [ref=e90]: Video
                    - button "Divider" [ref=e91]:
                      - generic [ref=e92]:
                        - img [ref=e95]
                        - generic [ref=e97]: Divider
                    - button "Dynamic Text" [ref=e98]:
                      - generic [ref=e99]:
                        - img [ref=e102]
                        - generic [ref=e104]: Dynamic Text
                - generic [ref=e105]:
                  - button "Static Editable elements with images, text, and buttons in various combinations." [ref=e106] [cursor=pointer]:
                    - generic [ref=e107]:
                      - text: Static
                      - button [ref=e108]:
                        - img [ref=e110]
                    - generic [ref=e112]: Editable elements with images, text, and buttons in various combinations.
                  - generic [ref=e113]:
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo Image & Text Card" [ref=e114]:
                      - generic [ref=e115]:
                        - generic [ref=e118] [cursor=pointer]:
                          - img [ref=e119]
                          - generic [ref=e121]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e122]
                            - generic [ref=e123]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo
                        - generic [ref=e124]: Image & Text Card
                    - button "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna Button Text & Button Card" [ref=e125]:
                      - generic [ref=e126]:
                        - generic [ref=e129]:
                          - generic [ref=e131]:
                            - heading "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing" [level=3] [ref=e132]
                            - generic [ref=e133]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                          - generic [ref=e134]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e135]: Text & Button Card
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Image, Text & Button Card" [ref=e136]:
                      - generic [ref=e137]:
                        - generic [ref=e140]:
                          - img [ref=e141]
                          - generic [ref=e143]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e144]
                            - generic [ref=e145]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e146]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e147]: Image, Text & Button Card
                    - button "Lorem Ipsum Dolor Sit Amet Lorem ipsum dolor sit amet, consectetur adipiscing elit Button Profile Card" [ref=e148]:
                      - generic [ref=e149]:
                        - generic [ref=e152]:
                          - img [ref=e153]
                          - generic [ref=e155]:
                            - heading "Lorem Ipsum Dolor Sit Amet" [level=3] [ref=e156]
                            - generic [ref=e157]: Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          - generic [ref=e158]:
                            - button "Button" [disabled]:
                              - generic: Button
                        - generic [ref=e159]: Profile Card
                - generic [ref=e160]:
                  - button "Dynamic Elements managed outside the builder, ready to use on your pages." [ref=e161] [cursor=pointer]:
                    - generic [ref=e162]:
                      - text: Dynamic
                      - button [ref=e163]:
                        - img [ref=e165]
                    - generic [ref=e167]: Elements managed outside the builder, ready to use on your pages.
                  - generic [ref=e168]:
                    - button "DYNAMIC CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Card" [ref=e169]:
                      - generic [ref=e170]:
                        - generic [ref=e173] [cursor=pointer]:
                          - generic:
                            - generic:
                              - generic: DYNAMIC CONTENT TYPE
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e174]: Dynamic Card
                    - button "Recommendations strip title Tab Label Tab Label Tab Label CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur CONTENT TYPE Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Dynamic Strip" [ref=e175]:
                      - generic [ref=e176]:
                        - generic [ref=e178]:
                          - generic [ref=e179]: Recommendations strip title
                          - generic [ref=e180]:
                            - generic [ref=e181] [cursor=pointer]: Tab Label
                            - generic [ref=e182] [cursor=pointer]: Tab Label
                            - generic [ref=e183] [cursor=pointer]: Tab Label
                          - generic [ref=e184]:
                            - generic [ref=e186] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - generic [ref=e188] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                            - img [ref=e190] [cursor=pointer]
                        - generic [ref=e192]: Dynamic Strip
                    - button "Content strip title CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur CONTENT TYPE Lorem ipsum si onsectetur Promoted Content Strip" [ref=e193]:
                      - generic [ref=e194]:
                        - generic [ref=e196]:
                          - generic [ref=e197]: Content strip title
                          - generic [ref=e198]:
                            - img [ref=e200] [cursor=pointer]
                            - generic [ref=e203] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e205] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - generic [ref=e207] [cursor=pointer]:
                              - generic:
                                - generic:
                                  - generic: CONTENT TYPE
                                - generic: Lorem ipsum si onsectetur
                            - img [ref=e209] [cursor=pointer]
                        - generic [ref=e211]: Promoted Content Strip
                    - button "Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur Promoted Banner" [ref=e212]:
                      - generic [ref=e213]:
                        - generic [ref=e216] [cursor=pointer]:
                          - generic:
                            - generic: Lorem ipsum sit amet consectetur lorem ipsum sit amet consectetur
                        - generic [ref=e217]: Promoted Banner
          - generic [ref=e226]:
            - 'button "Welcome to the Academy: Your Gateway to Growth & Success" [ref=e227]':
              - 'heading "Welcome to the Academy: Your Gateway to Growth & Success" [level=1] [ref=e235]'
            - button "The Academy is your centralized resource for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities. Choose your function from the options below to begin exploring your learning and growth opportunities." [ref=e236]:
              - paragraph [ref=e244]:
                - text: The Academy is your
                - strong [ref=e245]: centralized resource
                - text: for all recommended learning and development materials. Each resource is thoughtfully curated to help you gain insights into our business and products, strengthen the skills needed for your role, grow your career, and enhance your leadership abilities.
                - strong [ref=e246]: Choose your function from the options below to begin exploring your learning and growth opportunities.
            - button "Lorem ipsum dolor sit amet test" [ref=e247]:
              - generic [ref=e253]: Lorem ipsum dolor sit amet test
            - button "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt" [ref=e254]:
              - generic [ref=e259] [cursor=pointer]:
                - img [ref=e260]
                - generic [ref=e262]:
                  - heading "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed" [level=3] [ref=e263]
                  - generic [ref=e264]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            - button "Digital Academy Master essential and advanced digital skills to stay ahead." [ref=e265]:
              - generic [ref=e270] [cursor=pointer]:
                - img [ref=e271]
                - generic [ref=e273]:
                  - heading "Digital Academy" [level=3] [ref=e274]
                  - generic [ref=e275]: Master essential and advanced digital skills to stay ahead.
            - button "Data Science Academy Learn to analyze, visualize, and derive insights from data to drive better decisions." [ref=e276]:
              - generic [ref=e281] [cursor=pointer]:
                - img [ref=e282]
                - generic [ref=e284]:
                  - heading "Data Science Academy" [level=3] [ref=e285]
                  - generic [ref=e286]: Learn to analyze, visualize, and derive insights from data to drive better decisions.
            - button "Cybersecurity Academy Master skills to secure data, manage risks, and defend against cyber threats." [ref=e287]:
              - generic [ref=e292] [cursor=pointer]:
                - img [ref=e293]
                - generic [ref=e295]:
                  - heading "Cybersecurity Academy" [level=3] [ref=e296]
                  - generic [ref=e297]: Master skills to secure data, manage risks, and defend against cyber threats.
            - button "Cloud Engineering Academy Explore cloud computing and learn to implement scalable solutions" [ref=e298]:
              - generic [ref=e303] [cursor=pointer]:
                - img [ref=e304]
                - generic [ref=e306]:
                  - heading "Cloud Engineering Academy" [level=3] [ref=e307]
                  - generic [ref=e308]: Explore cloud computing and learn to implement scalable solutions
            - button "Sales Academy Gain skills and strategies to drive revenue and build client relationships." [ref=e309]:
              - generic [ref=e314] [cursor=pointer]:
                - img [ref=e315]
                - generic [ref=e317]:
                  - heading "Sales Academy" [level=3] [ref=e318]
                  - generic [ref=e319]: Gain skills and strategies to drive revenue and build client relationships.
            - button "Global Marketing Academy Learn to engage diverse audiences with innovative marketing." [ref=e320]:
              - generic [ref=e325] [cursor=pointer]:
                - img [ref=e326]
                - generic [ref=e328]:
                  - heading "Global Marketing Academy" [level=3] [ref=e329]
                  - generic [ref=e330]: Learn to engage diverse audiences with innovative marketing.
            - button "Product Management Academy Create and optimize products that drive success and meet customer needs." [ref=e331]:
              - generic [ref=e336] [cursor=pointer]:
                - img [ref=e337]
                - generic [ref=e339]:
                  - heading "Product Management Academy" [level=3] [ref=e340]
                  - generic [ref=e341]: Create and optimize products that drive success and meet customer needs.
            - button "Logistics & Supply Academy Boost efficiency and resilience in supply chain management." [ref=e342]:
              - generic [ref=e347] [cursor=pointer]:
                - img [ref=e348]
                - generic [ref=e350]:
                  - heading "Logistics & Supply Academy" [level=3] [ref=e351]
                  - generic [ref=e352]: Boost efficiency and resilience in supply chain management.
        - status [ref=e353]: Draggable item card-ImageTextCard was dropped over droppable area c94e22c0-2393-4fd8-8d39-659063f6cf5c
    - generic:
      - log [ref=e354]
      - log [ref=e355]
      - log [ref=e356]
      - log [ref=e357]
  - generic [ref=e358]: Percipio
```

# Test source

```ts
  40  |       await Reporter.setEpic("UCM Admin");
  41  |       await Reporter.setFeature("Page Builder");
  42  |       await Reporter.setStory("SC-07: Drag-and-drop validation");
  43  |       await Reporter.setSeverity("critical");
  44  | 
  45  |       const pageName = `PB DnD ${faker.lorem.words(2)} ${Date.now()}`;
  46  | 
  47  |       // ── Create a fresh blank page ────────────────────────────────────────────
  48  |       await listPage.createNewPage(pageName);
  49  |       await editorPage.waitForEditorLoad();
  50  | 
  51  |       // ── Enter edit mode and open Design tab ─────────────────────────────────
  52  |       await editorPage.clickEditMode();
  53  |       await editorPage.switchToDesignTab();
  54  | 
  55  |       // ── Expand accordion sections before accessing Static/Dynamic components ─
  56  |       await designPanel.expandStaticSection();
  57  |       await designPanel.expandDynamicSection();
  58  | 
  59  |       // ── Drag each of the 14 components to the canvas ────────────────────────
  60  |       for (const componentName of ALL_COMPONENT_NAMES) {
  61  |         await designPanel.addComponent(componentName);
  62  |         await designPanel.assertComponentOnCanvas(componentName);
  63  |       }
  64  | 
  65  |       // ── Save the page ────────────────────────────────────────────────────────
  66  |       await editorPage.clickSave();
  67  |     },
  68  |   );
  69  | 
  70  |   test(
  71  |     "PB-07b: Reorder two canvas components — verify DOM position changes after drag",
  72  |     async ({ page }) => {
  73  |       await Reporter.setEpic("UCM Admin");
  74  |       await Reporter.setFeature("Page Builder");
  75  |       await Reporter.setStory("SC-07: Drag-and-drop validation");
  76  |       await Reporter.setSeverity("normal");
  77  | 
  78  |       const pageName = `PB DnD Reorder ${faker.lorem.words(2)} ${Date.now()}`;
  79  | 
  80  |       // ── Create a fresh page and enter edit mode ──────────────────────────────
  81  |       await listPage.createNewPage(pageName);
  82  |       await editorPage.waitForEditorLoad();
  83  |       await editorPage.clickEditMode();
  84  |       await editorPage.switchToDesignTab();
  85  | 
  86  |       // ── Add two components (Text then Image & Text Card) ─────────────────────
  87  |       // Count pre-existing Text components from the page template so we can
  88  |       // identify the NEWLY PLACED Text by index (templates have Text items).
  89  |       // Image & Text Card has no template instances — .first() is safe for that one.
  90  |       const preTextCount = await page.locator('[data-marker="PageBuilder--text"]').count();
  91  | 
  92  |       await designPanel.addComponent("Text");
  93  |       await designPanel.assertComponentOnCanvas("Text");
  94  | 
  95  |       await designPanel.expandStaticSection();
  96  |       await designPanel.addComponent("Image & Text Card");
  97  |       await designPanel.assertComponentOnCanvas("Image & Text Card");
  98  | 
  99  |       // ── Capture initial DOM order ────────────────────────────────────────────
  100 |       // Record the vertical positions of the two newly placed canvas components.
  101 |       // Text: use nth(preTextCount) — skips template Texts, gets the one we just placed.
  102 |       // Card: use .first() — no pre-existing imageTextCard items in template.
  103 |       const textEl = page.locator('[data-marker="PageBuilder--text"]').nth(preTextCount);
  104 |       const cardEl = page.locator('[data-marker="PageBuilder--imageTextCard"]').first();
  105 | 
  106 |       const textBBBefore = await textEl.boundingBox();
  107 |       const cardBBBefore = await cardEl.boundingBox();
  108 | 
  109 |       // Sanity check: Text should be above Card (added first → higher position)
  110 |       if (textBBBefore && cardBBBefore) {
  111 |         expect(textBBBefore.y).toBeLessThan(cardBBBefore.y);
  112 |       }
  113 | 
  114 |       // ── Drag Text component over Image & Text Card (reorder) ─────────────────
  115 |       // Drag the Text component ONTO the Card to trigger a canvas reorder swap.
  116 |       // Target is the center of the Card component — dragging INTO the Card triggers
  117 |       // the pointer-event DnD reorder in the canvas grid.
  118 |       if (textBBBefore && cardBBBefore) {
  119 |         const srcX = textBBBefore.x + textBBBefore.width / 2;
  120 |         const srcY = textBBBefore.y + textBBBefore.height / 2;
  121 |         // Target: center of the Card component (triggers reorder)
  122 |         const tgtX = cardBBBefore.x + cardBBBefore.width / 2;
  123 |         const tgtY = cardBBBefore.y + cardBBBefore.height / 2;
  124 | 
  125 |         await page.mouse.move(srcX, srcY);
  126 |         await page.mouse.down();
  127 |         await page.mouse.move(srcX + 2, srcY + 2); // trigger drag gesture
  128 |         await page.mouse.move(tgtX, tgtY, { steps: 20 });
  129 |         await page.mouse.up();
  130 | 
  131 |         // Allow canvas to settle after drag
  132 |         await page.waitForTimeout(600);
  133 | 
  134 |         // ── Verify position change ─────────────────────────────────────────────
  135 |         const textBBAfter = await textEl.boundingBox();
  136 |         const cardBBAfter = await cardEl.boundingBox();
  137 | 
  138 |         if (textBBAfter && cardBBAfter) {
  139 |           // After reorder, Card should be above Text (positions swapped)
> 140 |           expect(cardBBAfter.y).toBeLessThanOrEqual(textBBAfter.y);
      |                                 ^ Error: expect(received).toBeLessThanOrEqual(expected)
  141 |         }
  142 |       }
  143 | 
  144 |       // ── Save ──────────────────────────────────────────────────────────────────
  145 |       await editorPage.clickSave();
  146 |     },
  147 |   );
  148 | });
  149 | 
```