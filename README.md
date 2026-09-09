# UCM Playwright Automation

A Playwright E2E framework using the Page Object Model (POM) pattern with a single, lightweight `Reporter` utility that feeds both the **Playwright HTML report** and the **Allure report** simultaneously — no configuration required.

---

## Project Structure

```
ucm-playwright-automation/
├── config/                          # Environment JSON templates (develop, stage)
├── docs/                            # Extra documentation
├── fixtures/
│   ├── allureFixtures.ts            # Base test: auto console logs + failure screenshots
│   └── loginFixture.ts              # Login / pre-authenticated page fixtures
├── framework/
│   └── wait/                        # Shared timeout constants
├── helper/
│   └── api/                         # API automation helpers
│       ├── APIClient.ts
│       ├── headers/
│       ├── params.ts
│       ├── roles.ts
│       ├── urls.ts
│       └── payloads/                # Request body builders
├── pageObjects/
│   ├── base/
│   │   └── BasePage.ts              # All actions auto-wrapped in Reporter.step()
│   ├── Assignments/
│   │   ├── AssignmentsPage.page.ts
│   │   └── CreateAssignmentWizard.page.ts
│   ├── Audiences/
│   │   └── CreateAudiencePage.page.ts
│   ├── PageBuilder/
│   │   ├── PageBuilderListPage.page.ts
│   │   ├── PageBuilderEditorPage.page.ts
│   │   └── PageBuilderDesignPanel.page.ts
│   ├── AdminHomePage.page.ts
│   └── LoginPage.page.ts
├── qmetry-utility/                  # QMetry integration scripts
├── scripts/                         # CI helper scripts
├── specs/                           # Written test plans and PR context
├── tests/
│   ├── Assignments/
│   ├── audiences/
│   ├── auth/
│   │   └── auth.setup.ts            # Saves browser storage state for chrome project
│   ├── PageBuilder/                 # Page Builder E2E specs (SC-01 through SC-07)
│   ├── playwright/
│   │   └── .auth/                   # Saved session (user.json) — gitignored
│   ├── tests-api/                   # API-focused specs (separate playwright.api.config.ts)
│   └── ucm-manual3-aws/             # UCM manual test scenarios
├── utils/
│   ├── Reporter.ts                  # ← Single reporting utility (HTML + Allure)
│   ├── globalSetup.ts
│   ├── frontendConfig.ts
│   ├── commonfuctions.ts
│   ├── logger.ts
│   └── *.json / *.ts                # Env data, roles, org data
├── Dockerfile
├── package.json
├── playwright.api.config.ts         # Config for API test runs
├── playwright.config.ts             # Main config (UI tests)
└── tsconfig.json
```

---

## Installation

```bash
npm install
npx playwright install
```

Install the [Allure CLI](https://allurereport.org/docs/install/) to generate and open Allure reports:

```bash
# macOS
brew install allure

# Windows (Scoop)
scoop install allure

# Cross-platform via npm
npm install -g allure-commandline
```

---

## Playwright MCP Setup (for Claude Code)

[Playwright MCP](https://github.com/microsoft/playwright-mcp) lets **Claude Code interact with a live browser** during development — inspecting the real DOM, verifying selectors, checking element positions, and taking screenshots without running a full test. This is how we debug selectors and discover data-markers before writing tests.

### What it enables

- Ask Claude to navigate to a page and inspect the live DOM
- Verify that a locator actually matches the intended element before writing test code
- Discover data-attributes, ARIA roles, and element IDs directly from the running app
- Debug why a drag/drop or interaction isn't working by watching the browser live

---

### Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Node.js 18+ (already required for this project)

---

### Installation

**1. Install the Playwright MCP package**

```bash
npm install -D @playwright/mcp
```

Or use it without installing (the config below uses `npx -y` which auto-installs on first use).

**2. Install a browser for MCP** (if not already installed)

```bash
npx playwright install chromium
```

---

### Configuration

The project already includes a `.mcp.json` file in the root that configures the Playwright MCP server for Claude Code. It runs in **headless mode** by default:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--headless"
      ]
    }
  }
}
```

> `.mcp.json` is gitignored — each developer has their own copy. The above is the standard config for this project. Create or restore it at the repo root if it's missing.

**To run in headed mode** (see the browser window while Claude inspects):

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

Simply remove the `"--headless"` arg.

---

### Using it with Claude Code

Once `.mcp.json` is in the project root, Claude Code automatically picks up the MCP server when you open the project.

**Check it's connected:**

```bash
claude
# In the Claude Code prompt:
/mcp
# Should show: playwright ● connected
```

**Example prompts you can give Claude:**

```
Navigate to https://your-app.com/admin/page-builder and take a snapshot of the design panel
```

```
Find the data-marker attribute on the canvas element after dragging "Image & Text Card"
```

```
Check what role="status" contains after a drag-and-drop
```

```
Scroll to the bottom of the canvas and tell me what grid-item IDs are present
```

Claude will use the live browser to answer these directly — no test run needed.

---

### Troubleshooting

| Problem | Fix |
|---|---|
| `/mcp` shows playwright as disconnected | Run `npx playwright install chromium` to ensure the browser binary exists |
| `.mcp.json` missing | Create it at the repo root using the JSON config above |
| Browser opens but page won't load | The MCP browser has no auth session — navigate to login first or copy cookies from the test `.auth/user.json` |
| `TimeoutError` on navigate | The target environment may be down or slow; retry or check VPN |

---

## Running Tests

```bash
# Load environment secrets first
npm run load-secrets-dev          # develop
npm run load-secrets-stg          # stage

# Run the full UI suite
npm run test:ui

# Run a specific spec
NODE_ENV=develop npx playwright test tests/Assignments/assignmentCreate.spec.ts --project=chrome

# Run all chrome tests
npx playwright test --project=chrome
```

API / data-seed runs use `playwright.api.config.ts`:

```bash
npx playwright test -c playwright.api.config.ts
```

---

## Reports

### Playwright HTML Report

Generated automatically after every run. Open with:

```bash
npx playwright show-report
```

### Allure Report

```bash
# Generate and open static report from allure-results/
npm run report:allure

# Or serve live (no separate generate step)
npx allure serve allure-results

# Clear previous raw results before a clean run
npm run allure:clean-results
```

Both reports are populated from the same `Reporter` calls — no separate configuration needed.

---

## Reporter API (`utils/Reporter.ts`)

A single static class. Every call feeds both the Playwright HTML report and the Allure report.

### Metadata

Populates the Allure BDD hierarchy (Behaviors / Features views) and the HTML report's Annotations row.

```typescript
import { Reporter } from "../utils/Reporter";

await Reporter.setEpic("UCM");
await Reporter.setFeature("Assignments");
await Reporter.setStory("Create and launch assignment");
await Reporter.setSeverity("critical");       // blocker | critical | normal | minor | trivial
await Reporter.setOwner("qa-team");
await Reporter.addTags("smoke", "regression");
```

### Steps

Wraps any async block in a named step — collapsible with ✅/❌ and timing in both reports.

```typescript
await Reporter.step("Login as admin", async () => {
  await loginPage.login(config);
});
```

> **Page objects don't need to call `Reporter` directly.** `BasePage` wraps every action (`click`, `fill`, `navigate`, `assert`…) in a step automatically. Subclasses get a `this.step()` shortcut for their own higher-level steps.

### Attachments

```typescript
await Reporter.screenshot(page, "After submit");
await Reporter.fullPageScreenshot(page, "Full page");
await Reporter.attachJson("API Response", responseBody);
await Reporter.attachText("Log output", text);
await Reporter.attachHtml("Page fragment", html);
await Reporter.attachPageSource(page);
await Reporter.attachConsoleLogs(logs);
```

### Automatic (no code needed in tests)

The `page` fixture in `allureFixtures.ts` runs these automatically after every test:

| Event | What gets attached |
|---|---|
| Every test | Browser console logs |
| Test failure | Full-page screenshot + page HTML (DOM) |

---

## Page Objects

Every page object extends `BasePage`. All standard actions are already wrapped in steps — no extra reporter calls needed in most methods.

```typescript
import { BasePage } from "./base/BasePage";

export class CheckoutPage extends BasePage {
  private readonly placeOrderBtn = this.page.locator('[data-testid="place-order"]');

  async placeOrder(): Promise<void> {
    // BasePage.click() auto-wraps in Reporter.step()
    await this.click(this.placeOrderBtn, "Place order button");
    await this.waitForNetworkIdle();
  }

  async complexFlow(): Promise<void> {
    // Use this.step() for higher-level named steps in subclasses
    await this.step("Complete checkout flow", async () => {
      await this.placeOrder();
      await this.assertVisible(this.confirmationBanner, "Order confirmation");
    });
  }
}
```

---

## Fixtures

### `allureFixtures.ts` — base fixture

Extends Playwright's `test` with:
- Augmented `page` fixture: auto-attaches console logs + failure screenshot after every test
- `loginPage` fixture: pre-built `LoginPage` instance

### `loginFixture.ts` — login fixtures

Extends `allureFixtures` with:

| Fixture | Description |
|---|---|
| `loginFixture` | A `LoginPage` instance (not yet logged in) |
| `lognToPageFixture` | A `LoginPage` instance that has already navigated and logged in |

### Adding a new fixture

```typescript
// fixtures/allureFixtures.ts — add to BaseFixtures type and extend block
checkoutPage: async ({ page }, use) => {
  await use(new CheckoutPage(page));
},
```

---

## Writing a Test

```typescript
import { test, expect } from "../../fixtures/loginFixture";
import { AdminHomePage } from "../../pageObjects/AdminHomePage.page";
import { Reporter } from "../../utils/Reporter";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Assignments — Create", () => {
  test.beforeEach(async ({ lognToPageFixture }) => {
    void lognToPageFixture; // triggers login fixture

    // Metadata — feeds both Allure and HTML report
    await Reporter.setEpic("UCM");
    await Reporter.setFeature("Assignments");
    await Reporter.addTags("smoke");
  });

  test("Create and launch assignment", async ({ page }) => {
    const homePage = new AdminHomePage(page);

    // Steps are created automatically by BasePage methods
    await homePage.navigateToAssignments();

    // Manual step for higher-level actions
    await Reporter.step("Fill assignment details", async () => {
      // ...
    });
  });
});
```

---

---

## API Test Generation (`/swagger-api-gen`)

Generate typed TypeScript API tests from any Swagger/OpenAPI 3.0 spec in seconds, following the existing `helper/api/` conventions.

### What gets generated

For `--service userManagement` against a spec with 12 endpoints, the following files are written:

```
helper/api/urls.userManagement.ts            ← URL builder functions per endpoint
helper/api/payloads/userManagement/          ← Request body builders (POST/PUT/PATCH only)
helper/api/schemas/userManagement.schemas.ts ← Zod schemas for contract validation
helper/api/UserManagementClient.ts           ← Service client with token auth
tests/tests-api/userManagement.spec.ts       ← Playwright spec (happy path + 401 + 404)
```

---

### Single command

The fastest way — fetches the spec and generates everything in one pipe:

```bash
npm run gen:api --url=https://your-service.example.com/docs/index.html --service=myService
```

Preview without writing files:
```bash
npm run gen:api:dry --url=https://your-service.example.com/docs/index.html --service=myService
```

Then run the generated spec:
```bash
npx playwright test -c playwright.api.config.ts tests/tests-api/myService.spec.ts
```

---

### Step-by-step

```bash
# 1. Load environment secrets
npm run load-secrets-dev

# 2. Fetch the spec (see "Fetching the spec" section for all URL forms)
node scripts/swagger-fetch.mjs https://your-service.example.com/docs/index.html --out /tmp/spec.json

# 3. Generate all artifacts
node scripts/swagger-api-gen.mjs --spec /tmp/spec.json --service myService --out .

# 4. Run the generated tests
npx playwright test -c playwright.api.config.ts tests/tests-api/myService.spec.ts
```

---

### Fetching the spec (`swagger-fetch.mjs`)

The fetch script accepts all URL forms — it auto-detects what was passed and handles each correctly.

**Swagger UI HTML page** (most common — just paste the browser URL):
```bash
node scripts/swagger-fetch.mjs https://self-registration.develop.squads-dev.com/docs/index.html
```
The script fetches the HTML, extracts the spec URL from the page source, and downloads the JSON automatically.

**Service base URL** (probes 19 common spec paths):
```bash
node scripts/swagger-fetch.mjs https://api.example.com
```

**Direct spec URL** (skips discovery entirely):
```bash
node scripts/swagger-fetch.mjs https://api.example.com/v3/api-docs
```

**Auth options** (for protected swagger endpoints):

| Flag | Description |
|---|---|
| `--token <jwt>` | Bearer token — `Authorization: Bearer <token>` |
| `--basic-token <b64>` | Base64-encoded `user:password` — `Authorization: Basic <b64>` |
| `--user <u> --password <p>` | Username + password, encoded to Basic auth automatically |

```bash
# Bearer token
node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --token eyJhbGc...

# Basic auth (pre-encoded)
node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --basic-token cGluZzpQb25nMzIxIQ==

# Basic auth (plain credentials)
node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --user ping --password Pong321!
```

Save to a file instead of stdout:
```bash
node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --out /tmp/spec.json
```

---

### Filtering endpoints (`swagger-api-gen.mjs`)

#### Skip specific endpoints

Endpoints matching `skipEndpoints` in `skills/swagger-api-gen/config.json` are excluded from generation. Edit the file to customise:

```json
{
  "skipEndpoints": [
    "/actuator/*",
    "/health",
    "POST /admin/purge",
    "GET /debug/*"
  ]
}
```

#### Generate only specific endpoints

When you only want tests for a subset of a service, use include-only mode. `skipEndpoints` is ignored when this is active.

**Via CLI flag** (no config change needed — useful for one-off runs):
```bash
# Single command
npm run gen:api \
  --url=https://your-service.example.com/docs/index.html \
  --service=myService \
  --include="GET /api/users,POST /api/users,/api/orders/*"

# Step-by-step
node scripts/swagger-api-gen.mjs \
  --spec /tmp/spec.json \
  --service myService \
  --include "GET /api/users,POST /api/users"
```

**Via config** (persistent, shared across the team):
```json
{
  "includeEndpoints": [
    "GET /api/users",
    "POST /api/users",
    "/api/orders/*"
  ]
}
```

**Pattern syntax** (same for both `skipEndpoints` and `includeEndpoints`):

| Pattern | Matches |
|---|---|
| `/api/users` | Exact path, any HTTP method |
| `GET /api/users` | Exact method + path only |
| `/api/orders/*` | Any method, any path under `/api/orders/` |
| `POST /admin/*` | POST to any path under `/admin/` |

---

### Zod contract validation

Every generated spec validates response shapes at runtime using Zod schemas derived from the OpenAPI `components/schemas` and per-operation response definitions.

```typescript
// Inside the generated spec — runs on every successful response
const parsed = GetUsersResponseSchema.safeParse(body);
expect(
  parsed.success,
  `Contract mismatch: ${JSON.stringify(parsed.error?.format())}`
).toBe(true);
```

Validation also runs inside the client itself (logs a warning on mismatch) so contract drift is caught even in tests that don't assert the full response shape.

---

### After generation

The payload builders use skeleton values (`"test-fieldName"`, `0`, `true`). Before running against a real environment, open `helper/api/payloads/myService/` and replace skeleton values with real test data that your API accepts.

---

### Via Cowork skill

In the Cowork desktop app, type `/swagger-api-gen` — Claude will ask for the service URL and name, run both scripts, and report what was generated.

---

## Environment Configuration

| Variable | Description |
|---|---|
| `NODE_ENV` | `develop` (default) or `stage` — selects `config/<env>.json` |
| `PLAYWRIGHT_BASE_URL` | Override the frontend URL at runtime |
| `BASE_URL` | Alternative URL override |

Config files are generated from templates via the secret loader:

```bash
npm run load-secrets-dev    # → config/develop.json
npm run load-secrets-stg    # → config/stage.json
```
