import "dotenv/config";
import axios from "axios";
import {
  normalizeQmetryTestCaseResponse,
  describeQmetryPayloadShape,
} from "./parseQmetryTestCasePayload.mjs";
import {
  extractQtm4jCaseVersionMeta,
  parseTestStepsSearchBody,
  TEST_STEPS_SEARCH_BODY,
  buildTestStepsSearchUrl,
  testStepsSearchTotals,
} from "./qmetryTestSteps.mjs";

const REQUEST_TIMEOUT_MS = 30_000;

/** QTM4J: JSON API is under /rest/api/latest — /testcases/:key without it is the SPA (HTML). */
const CONFIG = {
  apiKey: (process.env.QMETRY_API_KEY ?? "").trim(),
  baseUrl: (
    process.env.QMETRY_BASE_URL ?? "https://qtmcloud.qmetry.com"
  ).replace(/\/$/, ""),
  apiPrefix: (process.env.QMETRY_API_PREFIX ?? "/rest/api/latest").replace(
    /\/$/,
    "",
  ),
  issueKey: (process.env.QMETRY_ISSUE_KEY ?? "UHS-TC-1338").trim(),
  project: (process.env.QMETRY_PROJECT ?? "").trim(),
  authorization: (process.env.QMETRY_AUTHORIZATION ?? "").trim(),
};

async function getTestCaseSteps() {
  if (!CONFIG.apiKey) {
    console.error(
      "Missing QMETRY_API_KEY. Set it in .env or export it, then re-run.",
    );
    process.exitCode = 1;
    return;
  }

  const url = `${CONFIG.baseUrl}${CONFIG.apiPrefix}/testcases/${encodeURIComponent(CONFIG.issueKey)}/versions/latest`;
  console.log("[qmetry] GET", url);
  if (!CONFIG.authorization && process.env.QMETRY_DEBUG === "1") {
    console.log(
      "[qmetry] Tip: QTM4J often requires Jira Basic auth. Set QMETRY_AUTHORIZATION=Basic <base64(email:token)>.",
    );
  }

  try {
    const headers = {
      apiKey: CONFIG.apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (CONFIG.project) headers.project = CONFIG.project;
    if (CONFIG.authorization) headers.Authorization = CONFIG.authorization;

    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT_MS,
      headers,
      validateStatus: () => true,
      /** When server omits JSON Content-Type, axios keeps body as string — parse here too. */
      transformResponse: [
        (data) => {
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
        },
      ],
    });

    if (process.env.QMETRY_DEBUG === "1") {
      const ct = response.headers["content-type"] ?? "(no content-type)";
      console.log("[qmetry] HTTP", response.status, response.statusText);
      console.log("[qmetry] content-type:", ct);
      console.log(
        "[qmetry] data typeof:",
        response.data === null ? "null" : typeof response.data,
      );
    }

    if (response.status < 200 || response.status >= 300) {
      console.error(
        "[qmetry] Request failed:",
        response.status,
        response.data ?? response.statusText,
      );
      if (response.status === 401 && !CONFIG.authorization) {
        console.error(
          "[qmetry] Try QMETRY_AUTHORIZATION (Jira Basic: base64 of email:api_token).",
        );
      }
      process.exitCode = 1;
      return;
    }

    if (
      typeof response.data === "string" &&
      /^<!DOCTYPE\s+html|<html[\s>]/i.test(response.data.trim())
    ) {
      console.error(
        "[qmetry] Response is HTML (web app shell), not the REST API. Use QMETRY_API_PREFIX=/rest/api/latest (default) and QMETRY_BASE_URL=https://qtmcloud.qmetry.com.",
      );
      process.exitCode = 1;
      return;
    }

    const normalized = normalizeQmetryTestCaseResponse(response.data);
    if (!normalized) {
      console.error(
        "[qmetry] Could not find summary/steps — check base URL, API key, issue key, and optional QMETRY_PROJECT.",
      );
      console.error("[qmetry]", describeQmetryPayloadShape(response.data));
      console.error(
        "[qmetry] Re-run with QMETRY_DEBUG=1 for content-type and body typeof.",
      );
      if (process.env.QMETRY_DEBUG === "1") {
        const sample =
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data, null, 2);
        console.error("[qmetry] Raw body (debug):", sample.slice(0, 4000));
      }
      process.exitCode = 1;
      return;
    }

    console.log(`--- Test Case: ${normalized.summary} ---`);

    let steps = normalized.testSteps;
    if (steps.length === 0) {
      const meta = extractQtm4jCaseVersionMeta(response.data);
      if (!meta) {
        console.error(
          "[qmetry] Could not parse testcase id / versionNo from version JSON — re-run with QMETRY_DEBUG=1.",
        );
      } else {
        const tryIds =
          meta.caseId === CONFIG.issueKey
            ? [meta.caseId]
            : [meta.caseId, CONFIG.issueKey];
        const jsonTransform = [
          (data) => {
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
          },
        ];

        for (const caseId of tryIds) {
          const stepsUrl = buildTestStepsSearchUrl(
            CONFIG.baseUrl,
            CONFIG.apiPrefix,
            caseId,
            meta.versionNo,
          );
          if (process.env.QMETRY_DEBUG === "1") {
            console.log("[qmetry] POST", stepsUrl, "(fetch manual steps)");
          }
          const stepsRes = await axios.post(stepsUrl, TEST_STEPS_SEARCH_BODY, {
            timeout: REQUEST_TIMEOUT_MS,
            headers,
            validateStatus: () => true,
            transformResponse: jsonTransform,
          });
          if (stepsRes.status < 200 || stepsRes.status >= 300) {
            console.error(
              "[qmetry] teststeps/search failed:",
              stepsRes.status,
              typeof stepsRes.data === "string"
                ? stepsRes.data.slice(0, 500)
                : stepsRes.data,
            );
            continue;
          }
          steps = parseTestStepsSearchBody(stepsRes.data);
          const { total } = testStepsSearchTotals(stepsRes.data);
          if (steps.length === 0 && (total === null || total === 0)) {
            if (caseId === tryIds[tryIds.length - 1]) {
              console.error(
                "[qmetry] teststeps/search returned 0 rows (API total:",
                total,
                "). If steps exist in UI, response shape may differ — use QMETRY_DEBUG=1.",
              );
            }
          } else if (steps.length === 0 && total != null && total > 0) {
            console.error(
              "[qmetry] teststeps/search reports total=",
              total,
              "but parser found 0 rows — re-run with QMETRY_DEBUG=1 and inspect raw JSON.",
            );
          }
          if (steps.length > 0) break;
        }
      }
    }

    if (steps.length > 0) {
      const formattedSteps = steps
        .map(
          (step, index) =>
            `${index + 1}. Action: ${step.stepSummary}\n   Expected: ${step.expectedResult}`,
        )
        .join("\n\n");

      console.log("Steps for Playwright Planner:");
      console.log(formattedSteps);
      return formattedSteps;
    }

    console.log(
      "No test steps found for this issue (version details had no steps and teststeps/search returned none).",
    );
    return undefined;
  } catch (error) {
    const msg = axios.isAxiosError(error)
      ? (error.response?.data ?? error.message)
      : error instanceof Error
        ? error.message
        : error;
    console.error("Error fetching test case:", msg);
    process.exitCode = 1;
  }
}

getTestCaseSteps();
