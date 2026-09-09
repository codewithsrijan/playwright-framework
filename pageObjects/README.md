# Page objects and UI structure

## Layout

- `base/BasePage.ts` — shared waits and `Page` reference; extend for each screen.
- `<Feature>Page.ts` — one class per logical page or workflow step.
- `components/` — reusable regions (headers, modals, data tables) composed by multiple pages.

## Locator priority

Use this order when choosing selectors (implement in `locators/*.locators.ts` as factory functions returning `Locator`):

1. **`getByRole`** with an accessible name.
2. **`getByLabel` / `getByPlaceholder`** for forms.
3. **`getByTestId`** for stable `data-testid` hooks agreed with development.
4. **CSS** when semantics are missing but the hook is stable.
5. **XPath** — last resort; keep in the locator module so fixes stay localized.

## Components

Place shared fragments under `pageObjects/components/` and inject `Page` (or a parent page) the same way as feature pages.
