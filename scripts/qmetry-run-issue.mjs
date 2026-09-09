/**
 * Runs qmetry:js with QMETRY_ISSUE_KEY set from the first CLI argument.
 * Usage (from repo root): npm run qmetry:issue -- <QMETRY_ISSUE_KEY>
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const issue = process.argv[2]?.trim();
if (!issue) {
  console.error("Usage: npm run qmetry:issue -- <QMETRY_ISSUE_KEY>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const child = spawn(npm, ["run", "qmetry:js"], {
  cwd: root,
  env: { ...process.env, QMETRY_ISSUE_KEY: issue },
  stdio: "inherit",
  shell: false,
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
