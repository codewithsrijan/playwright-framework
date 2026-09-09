/**
 * QMetry Cloud responses vary: body may be wrapped in `data` / `result`, or follow Jira `fields`.
 * Servers sometimes return JSON with Content-Type text/plain — axios then gives a string `data`.
 * This normalizes to { summary, testSteps } for our scripts.
 */

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/** Collect objects that might hold summary + steps (order: try shallow first, then nested). */
function collectCandidateObjects(raw) {
  const out = [];
  const seen = new Set();

  function push(o) {
    if (!isPlainObject(o) || seen.has(o)) return;
    seen.add(o);
    out.push(o);
  }

  if (!isPlainObject(raw)) return out;
  push(raw);
  push(raw.data);
  push(raw.result);
  if (isPlainObject(raw.data)) {
    push(raw.data.data);
    push(raw.data.testCase);
    push(raw.data.testcase);
  }
  push(raw.testCase);
  push(raw.testcase);
  if (isPlainObject(raw.fields)) push(raw.fields);

  return out;
}

function pickSummary(obj) {
  const v =
    obj.summary ??
    obj.name ??
    obj.title ??
    obj.summaryText ??
    obj.testCaseSummary ??
    obj.issueSummary;
  if (typeof v === "string" && v.trim()) return v;
  return undefined;
}

function pickStepsArray(obj) {
  const s =
    obj.testSteps ??
    obj.steps ??
    obj.manualTestSteps ??
    obj.testCaseSteps ??
    obj.stepModels ??
    obj.dataGridTestSteps ??
    obj.scriptedTestSteps;
  return Array.isArray(s) ? s : [];
}

function normalizeStep(step) {
  if (!isPlainObject(step)) return null;
  const action =
    step.stepSummary ??
    step.stepDetails ??
    step.action ??
    step.step ??
    step.description ??
    step.stepDescription ??
    step.summary ??
    step.name;
  const expected =
    step.expectedResult ??
    step.expected ??
    step.expectedResults ??
    step.result;
  const stepSummary =
    typeof action === "string"
      ? action
      : action != null
        ? String(action)
        : "";
  const expectedResult =
    typeof expected === "string"
      ? expected
      : expected != null
        ? String(expected)
        : "";
  if (!stepSummary && !expectedResult) return null;
  return { stepSummary, expectedResult };
}

/** If the body is a JSON string, parse it; otherwise return as-is. */
function coerceParsedBody(raw) {
  if (typeof raw !== "string") return raw;
  const t = raw.trim();
  if (!t) return raw;
  const looksJson =
    (t.startsWith("{") && t.endsWith("}")) ||
    (t.startsWith("[") && t.endsWith("]"));
  if (!looksJson) return raw;
  try {
    return JSON.parse(t);
  } catch {
    return raw;
  }
}

/**
 * @param {unknown} raw - Axios response.data
 * @returns {{ summary: string, testSteps: { stepSummary: string, expectedResult: string }[] } | null}
 */
export function normalizeQmetryTestCaseResponse(raw) {
  const parsed = coerceParsedBody(raw);
  const candidates = collectCandidateObjects(parsed);

  for (const obj of candidates) {
    const summary = pickSummary(obj);
    const rawSteps = pickStepsArray(obj);
    const testSteps = rawSteps
      .map(normalizeStep)
      .filter(Boolean);

    if (summary || testSteps.length > 0) {
      return {
        summary: summary ?? "(no title in response)",
        testSteps,
      };
    }
  }

  return null;
}

/** Safe debug line: top-level keys only (no body dump). */
export function describeQmetryPayloadShape(raw) {
  if (raw == null) return "response body is null/undefined";
  if (typeof raw === "string") {
    const t = raw.trim();
    const len = raw.length;
    const preview = t.slice(0, 160).replace(/\s+/g, " ");
    let hint = "";
    if (/^<!DOCTYPE\s+html|<html[\s>]/i.test(t))
      hint = " (looks like HTML — wrong URL, redirect, or error page)";
    else if (t.startsWith("{") || t.startsWith("["))
      hint = " (JSON-like but parse failed or shape not recognized)";
    else hint = " (plain text — API may be returning an error message)";
    return `response body type: string, length ${len}${hint}. Preview: ${preview}${t.length > 160 ? "…" : ""}`;
  }
  if (typeof raw !== "object") return `response body type: ${typeof raw}`;
  const keys = Object.keys(raw);
  const parts = [`top-level keys: ${keys.join(", ") || "(none)"}`];
  if (isPlainObject(raw.data)) {
    parts.push(`data keys: ${Object.keys(raw.data).join(", ") || "(empty object)"}`);
  }
  if (isPlainObject(raw.fields)) {
    parts.push(`fields keys: ${Object.keys(raw.fields).slice(0, 12).join(", ")}${Object.keys(raw.fields).length > 12 ? "…" : ""}`);
  }
  return parts.join(" | ");
}
