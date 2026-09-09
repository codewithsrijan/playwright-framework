# Specs

This is a directory for test plans and PR context used with `.cursor/rules/playwright-agents.mdc`.

## Fetch PR context from GitHub CLI

1. Install [GitHub CLI](https://cli.github.com/) and run `gh auth login` (with access to the target repo).
2. For **GitHub Enterprise** (`github.skillsoft.com`), set `GH_HOST` if your team requires it (see internal docs).
3. From the repo root:

   ```bash
   npm run fetch-pr-context -- <pr-number> [owner/repo]
   ```

   Example:

   ```bash
   export GH_HOST=github.skillsoft.com   # if needed
   npm run fetch-pr-context -- 8783 HardRoc/ucm2
   ```

4. Open the generated `specs/pr-<number>-context.md`, add the **App URL**, then paste the **Unified prompt** from [.cursor/rules/playwright-agents.mdc](../.cursor/rules/playwright-agents.mdc) (or the PR section only) into Agent chat with the **playwright-test-orchestrator** agent for the full pipeline, or planner → generator as needed.

## ucm-manual3-aws — create audience (planner)

- Test plan: [`plan-ucm-manual3-aws-create-audience.md`](plan-ucm-manual3-aws-create-audience.md) — login (`entry-and-login.spec.ts`), **admin** nav to Audiences (see §B; not learner `#learningMainMenu` alone), create audience scenarios.
- Run login in headed mode: `NODE_ENV=develop npx playwright test tests/ucm-manual3-aws/entry-and-login.spec.ts --project=chrome`
- Create audience tests: `tests/ucm-manual3-aws/create-audience.spec.ts` (optional `UCM_MANUAL3_AUDIENCES_GOTO` for §B deep link)
