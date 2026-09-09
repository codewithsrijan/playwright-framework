/**
 * QTM4J: manual steps are not embedded in GET .../versions/latest.
 * They are returned from POST .../testcases/{id}/versions/{no}/teststeps/search
 * @see QTM4J OpenAPI
 */

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

export function tryParseJsonResponseData(data) {
  if (typeof data !== "string" || !data.length) return data;
  const t = data.trim();
  const looksJson =
    (t.startsWith("{") && t.endsWith("}")) ||
    (t.startsWith("[") && t.endsWith("]"));
  if (!looksJson) return data;
  try {
    return JSON.parse(t);
  } catch {
    return data;
  }
}

/**
 * From GET /testcases/{key}/versions/latest body: internal id + version number for steps API.
 */
export function extractQtm4jCaseVersionMeta(raw) {
  const root = tryParseJsonResponseData(raw);
  const inner = root?.data ?? root;
  if (!isPlainObject(inner)) return null;
  const caseId =
    inner.id ?? inner.testCaseId ?? inner.testcaseId ?? inner.entityId;
  const versionNo =
    inner.version?.versionNo ??
    inner.version?.no ??
    inner.versionNo ??
    inner.currentVersion?.versionNo;
  if (caseId == null || versionNo == null || Number.isNaN(Number(versionNo))) {
    return null;
  }
  return { caseId: String(caseId), versionNo: Number(versionNo) };
}

function pushStep(out, actionSrc, expectedSrc) {
  const a =
    actionSrc != null && typeof actionSrc === "object"
      ? JSON.stringify(actionSrc)
      : actionSrc ?? "";
  const e =
    expectedSrc != null && typeof expectedSrc === "object"
      ? JSON.stringify(expectedSrc)
      : expectedSrc ?? "";
  const stepSummary = String(a).trim();
  const expectedResult = String(e).trim();
  if (!stepSummary && !expectedResult) return;
  out.push({
    stepSummary: stepSummary || "(no action)",
    expectedResult,
  });
}

function rowsFromSearchRoot(root) {
  if (!isPlainObject(root)) return [];
  const rows = root.data ?? root.testSteps ?? root.steps ?? root.results;
  return Array.isArray(rows) ? rows : [];
}

/** Flatten POST teststeps/search response into { stepSummary, expectedResult }[]. */
export function parseTestStepsSearchBody(raw) {
  const root = tryParseJsonResponseData(raw);
  const rows = rowsFromSearchRoot(root);
  const out = [];
  for (const row of rows) {
    if (!isPlainObject(row)) continue;
    const nested = row.shareable?.shareableTestSteps;
    if (Array.isArray(nested) && nested.length > 0) {
      for (const st of nested) {
        if (!isPlainObject(st)) continue;
        const a =
          st.stepDetails ??
          st.description ??
          st.action ??
          st.step ??
          st.summary;
        const e =
          st.expectedResult ?? st.expected ?? st.expectedResults;
        pushStep(out, a, e);
      }
    } else {
      const a =
        row.stepDetails ??
        row.description ??
        row.action ??
        row.step ??
        row.summary;
      const e = row.expectedResult ?? row.expected ?? row.expectedResults;
      pushStep(out, a, e);
    }
  }
  return out;
}

/**
 * Empty body: OpenAPI "Filter" fields are substring filters; values like "step"
 * wrongly exclude real rows. Omit filter to list all steps.
 */
export const TEST_STEPS_SEARCH_BODY = {};

/** @returns {{ total: number | null }} */
export function testStepsSearchTotals(raw) {
  const root = tryParseJsonResponseData(raw);
  if (!isPlainObject(root)) return { total: null };
  const t = root.total;
  if (typeof t === "number" && !Number.isNaN(t)) return { total: t };
  return { total: null };
}

export function buildTestStepsSearchUrl(baseUrl, apiPrefix, caseId, versionNo) {
  const base = String(baseUrl).replace(/\/$/, "");
  const prefix = String(apiPrefix).replace(/\/$/, "");
  const path = `${base}${prefix}/testcases/${encodeURIComponent(caseId)}/versions/${encodeURIComponent(String(versionNo))}/teststeps/search`;
  const q = new URLSearchParams({ startAt: "0", maxResults: "100" });
  return `${path}?${q.toString()}`;
}
