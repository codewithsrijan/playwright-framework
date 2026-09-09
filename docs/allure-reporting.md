# Allure reporting

This project uses [`allure-playwright`](https://github.com/allure-framework/allure-js) as a reporter (see `playwright.config.ts`).

## Local run

1. Run tests: `npm run test:ui` (or `npx playwright test`).
2. Raw results are written under `allure-results/` (default for `allure-playwright`).
3. Generate and open an HTML report (requires [Allure commandline](https://github.com/allure-framework/allure2) on your `PATH`):

```bash
npm run report:allure
```

Or manually:

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

## Environment / CI

Set `ALLURE_RESULTS_DIR` if you need a non-default output directory for your pipeline.

Use `import { allure } from "allure-playwright"` for labels (`epic`, `feature`, `story`, `severity`, `tag`) and combine with `test.step()` for structured steps in the Allure UI.
