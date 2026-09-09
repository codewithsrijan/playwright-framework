#!/usr/bin/env node
/**
 * swagger-fetch.mjs
 *
 * Auto-discovers the OpenAPI/Swagger JSON spec for a service.
 * Handles Swagger UI HTML pages (e.g. /docs/index.html) automatically —
 * just pass the UI URL and the script extracts the underlying spec.
 *
 * Usage:
 *   node scripts/swagger-fetch.mjs <baseUrl|swaggerUiUrl|directSpecUrl> [options]
 *
 * Options:
 *   --token <bearer>       Bearer token for auth-protected swagger endpoints
 *   --basic-token <b64>    Base64-encoded Basic auth credentials (e.g. cGluZzpQb25nMzIxIQ==)
 *   --user <user>          Basic auth username (combined with --password)
 *   --password <pass>      Basic auth password (combined with --user)
 *   --out <file>           Save spec to file instead of printing to stdout
 *   --timeout <ms>         Per-probe timeout in milliseconds (default: 5000)
 *
 * Examples:
 *   node scripts/swagger-fetch.mjs https://self-registration.develop.squads-dev.com/docs/index.html
 *   node scripts/swagger-fetch.mjs https://api.example.com
 *   node scripts/swagger-fetch.mjs https://api.example.com/v3/api-docs
 *   node scripts/swagger-fetch.mjs https://api.example.com --token eyJhbGc... --out spec.json
 *   node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --basic-token cGluZzpQb25nMzIxIQ==
 *   node scripts/swagger-fetch.mjs https://api.example.com/docs/index.html --user ping --password Pong321!
 */

import fs from "fs";
import path from "path";

// ── Candidate paths probed when no spec found via HTML or direct URL ──────────
const SWAGGER_PROBE_PATHS = [
  "/v3/api-docs",
  "/v3/api-docs.yaml",
  "/v2/api-docs",
  "/swagger.json",
  "/swagger/v1/swagger.json",
  "/swagger/v2/swagger.json",
  "/api-docs",
  "/api-docs.json",
  "/openapi.json",
  "/openapi.yaml",
  "/openapi/v3/api-docs",
  "/api/swagger.json",
  "/api/v1/swagger.json",
  "/api/v2/swagger.json",
  "/api/v3/api-docs",
  "/docs/swagger.json",
  "/docs/openapi.json",
  "/docs/v2/api-docs",
  "/docs/v3/api-docs",
];

// ── Regex patterns to extract spec URL from Swagger UI HTML ──────────────────
const SPEC_URL_PATTERNS = [
  // SwaggerUIBundle({ url: "..." })  or  url: "..."
  /SwaggerUIBundle\s*\(\s*\{[^}]*url\s*:\s*["']([^"']+)["']/is,
  /[,{]\s*url\s*:\s*["']([^"']+)["']/i,
  // configUrl or spec href in anchor/script tags
  /configUrl\s*[=:]\s*["']([^"']+)["']/i,
  // data-spec-url attribute
  /data-spec-url\s*=\s*["']([^"']+)["']/i,
  // window.swaggerSpec or similar assignments to JSON objects
  /window\.\w+\s*=\s*(\{[\s\S]*?"openapi"\s*:)/i,
  // Any JSON-looking href containing api-docs/swagger/openapi
  /href\s*=\s*["']([^"']*(?:swagger|openapi|api-docs)[^"']*)["']/i,
  /src\s*=\s*["']([^"']*(?:swagger\.json|openapi\.json|api-docs)[^"']*)["']/i,
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { token: null, basicToken: null, user: null, password: null, out: null, timeout: 5000, url: null };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--token":        args.token       = argv[++i]; break;
      case "--basic-token":  args.basicToken  = argv[++i]; break;
      case "--user":         args.user        = argv[++i]; break;
      case "--password":     args.password    = argv[++i]; break;
      case "--out":          args.out         = argv[++i]; break;
      case "--timeout":      args.timeout     = parseInt(argv[++i], 10); break;
      default:
        if (!argv[i].startsWith("--")) positional.push(argv[i]);
    }
  }
  args.url = positional[0] ?? null;
  // Treat empty strings as null (happens when npm_config_ vars are unset)
  if (!args.token)      args.token      = null;
  if (!args.basicToken) args.basicToken = null;
  if (!args.user)       args.user       = null;
  if (!args.password)   args.password   = null;
  // Derive basicToken from --user/--password if provided
  if (!args.basicToken && args.user && args.password) {
    args.basicToken = Buffer.from(`${args.user}:${args.password}`).toString("base64");
  }
  return args;
}

function normalizeUrl(url) {
  return url.replace(/\/+$/, "");
}

/** True if the URL clearly points to a spec file (not an HTML UI page) */
function isDirectSpecUrl(url) {
  const knownSuffixes = [
    "swagger.json", "openapi.json", "api-docs", "api-docs.json",
    "api-docs.yaml", "openapi.yaml", "swagger.yaml",
  ];
  const lower = url.toLowerCase();
  // Exclude .html pages — those are Swagger UI, not the spec itself
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return false;
  return knownSuffixes.some((s) => lower.endsWith(s));
}

/** True if the URL looks like a Swagger UI HTML page */
function isSwaggerUiPage(url) {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".html") ||
    lower.endsWith(".htm") ||
    lower.includes("/swagger-ui") ||
    lower.includes("/docs/index") ||
    lower.includes("/swagger/index")
  );
}

function buildHeaders(token, basicToken) {
  const headers = { Accept: "application/json, text/html, */*" };
  if (basicToken) {
    headers["Authorization"] = `Basic ${basicToken}`;
  } else if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Attempt to extract the spec URL from a Swagger UI HTML page.
 * Returns the absolute spec URL string, or null if not found.
 */
function extractSpecUrlFromHtml(html, pageUrl) {
  // File extensions that are definitely not API specs
  const NON_SPEC_EXTENSIONS = [".css", ".js", ".png", ".jpg", ".ico", ".svg", ".woff", ".ttf", ".map"];

  for (const pattern of SPEC_URL_PATTERNS) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const candidate = match[1].trim();
      // Skip obviously wrong matches
      if (candidate.length < 3 || candidate.includes("{{")) continue;
      // Skip static asset files (CSS, JS, images, etc.)
      const lowerCandidate = candidate.toLowerCase();
      if (NON_SPEC_EXTENSIONS.some((ext) => lowerCandidate.endsWith(ext))) continue;
      // Resolve relative URLs against the page URL
      try {
        return new URL(candidate, pageUrl).toString();
      } catch {
        // candidate is not a valid URL fragment — skip
      }
    }
  }
  return null;
}

/**
 * Derive candidate spec URLs from the Swagger UI page URL.
 * e.g. https://service.example.com/docs/index.html  →  try /docs/swagger.json, /v3/api-docs, etc.
 */
function deriveSpecCandidatesFromUiUrl(uiUrl) {
  const parsed = new URL(uiUrl);
  const base = `${parsed.protocol}//${parsed.host}`;

  // The directory containing the HTML file (e.g. /docs/)
  const uiDir = parsed.pathname.substring(0, parsed.pathname.lastIndexOf("/") + 1);

  // Candidates relative to the UI directory first, then the root
  const relativePaths = [
    `${uiDir}swagger.json`,
    `${uiDir}openapi.json`,
    `${uiDir}swagger-ui.json`,
    `${uiDir}../v3/api-docs`,
    `${uiDir}../swagger.json`,
    `${uiDir}../api-docs`,
  ];

  const rootPaths = SWAGGER_PROBE_PATHS;

  return [
    ...relativePaths.map((p) => {
      try { return new URL(p, uiUrl).toString(); } catch { return null; }
    }).filter(Boolean),
    ...rootPaths.map((p) => `${base}${p}`),
  ];
}

/**
 * Fetch a URL and return the raw text if it looks like an OpenAPI/Swagger spec.
 * Returns null otherwise.
 */
async function tryFetchSpec(url, token, timeoutMs, basicToken) {
  try {
    const res = await fetchWithTimeout(url, { headers: buildHeaders(token, basicToken) }, timeoutMs);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    const text = await res.text();
    const trimmed = text.trim();

    // JSON spec
    if (
      contentType.includes("json") ||
      trimmed.startsWith("{") ||
      trimmed.startsWith("[")
    ) {
      // Quick sanity: must contain openapi or swagger key
      if (trimmed.includes('"openapi"') || trimmed.includes('"swagger"') || trimmed.includes('"paths"')) {
        return text;
      }
      return null;
    }

    // YAML spec
    if (
      contentType.includes("yaml") ||
      trimmed.startsWith("openapi:") ||
      trimmed.startsWith("swagger:")
    ) {
      return text;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch a URL as HTML and return the text.
 */
async function tryFetchHtml(url, token, timeoutMs, basicToken) {
  try {
    const res = await fetchWithTimeout(url, { headers: buildHeaders(token, basicToken) }, timeoutMs);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseSpec(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  throw new Error(
    "YAML spec detected. Convert to JSON first:\n  npm install -g js-yaml && js-yaml spec.yaml > spec.json",
  );
}

function detectSpecVersion(spec) {
  if (spec.openapi) return `OpenAPI ${spec.openapi}`;
  if (spec.swagger) return `Swagger ${spec.swagger}`;
  return "Unknown";
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.url) {
    console.error(
      "Usage: node scripts/swagger-fetch.mjs <url> [--token <bearer>] [--out <file>] [--timeout <ms>]\n\n" +
      "  url can be:\n" +
      "    • A Swagger UI page:  https://service.example.com/docs/index.html\n" +
      "    • A service base URL: https://service.example.com\n" +
      "    • A direct spec URL:  https://service.example.com/v3/api-docs",
    );
    process.exit(1);
  }

  const url = normalizeUrl(args.url);

  // ── Path 1: Direct spec URL ───────────────────────────────────────────────
  if (isDirectSpecUrl(url)) {
    console.error(`Fetching spec directly from: ${url}`);
    const text = await tryFetchSpec(url, args.token, args.timeout, args.basicToken);
    if (!text) {
      console.error(`✗ Failed to fetch spec from ${url}`);
      process.exit(1);
    }
    return outputSpec(text, url, args);
  }

  // ── Path 2: Swagger UI HTML page ──────────────────────────────────────────
  if (isSwaggerUiPage(url)) {
    console.error(`Detected Swagger UI page: ${url}`);
    console.error(`  Fetching HTML to extract spec URL...`);

    const html = await tryFetchHtml(url, args.token, args.timeout, args.basicToken);

    if (html) {
      const specUrl = extractSpecUrlFromHtml(html, url);

      if (specUrl) {
        console.error(`  ↳ Found spec URL in page: ${specUrl}`);
        const text = await tryFetchSpec(specUrl, args.token, args.timeout, args.basicToken);
        if (text) return outputSpec(text, specUrl, args);
        console.error(`  ↳ Could not fetch spec at extracted URL, trying derived candidates...`);
      } else {
        console.error(`  ↳ No spec URL found in HTML, trying derived candidates...`);
      }
    } else {
      console.error(`  ↳ Could not fetch HTML page, trying derived candidates...`);
    }

    // Fall through to probe paths derived from the UI URL
    const candidates = deriveSpecCandidatesFromUiUrl(url);
    console.error(`  Probing ${candidates.length} derived paths...`);
    for (const candidate of candidates) {
      process.stderr.write(`    Trying ${candidate} ... `);
      const text = await tryFetchSpec(candidate, args.token, args.timeout, args.basicToken);
      if (text) {
        process.stderr.write("✓\n");
        return outputSpec(text, candidate, args);
      }
      process.stderr.write("✗\n");
    }

    console.error(`\n✗ Could not locate spec for ${url}`);
    process.exit(1);
  }

  // ── Path 3: Base URL — probe all common paths ─────────────────────────────
  // Also try fetching the base URL as HTML first in case it redirects to swagger UI
  console.error(`Probing ${SWAGGER_PROBE_PATHS.length} candidate paths on: ${url}`);

  // Quick check: does the root serve a swagger UI HTML?
  const rootHtml = await tryFetchHtml(url, args.token, args.timeout, args.basicToken);
  if (rootHtml && rootHtml.toLowerCase().includes("swagger")) {
    const specUrl = extractSpecUrlFromHtml(rootHtml, url);
    if (specUrl) {
      console.error(`  ↳ Found spec URL in root HTML: ${specUrl}`);
      const text = await tryFetchSpec(specUrl, args.token, args.timeout, args.basicToken);
      if (text) return outputSpec(text, specUrl, args);
    }
  }

  for (const probePath of SWAGGER_PROBE_PATHS) {
    const candidate = `${url}${probePath}`;
    process.stderr.write(`  Trying ${candidate} ... `);
    const text = await tryFetchSpec(candidate, args.token, args.timeout, args.basicToken);
    if (text) {
      process.stderr.write("✓\n");
      return outputSpec(text, candidate, args);
    }
    process.stderr.write("✗\n");
  }

  console.error(
    `\n✗ Could not discover swagger spec on ${url}\n` +
      `  Tried all ${SWAGGER_PROBE_PATHS.length} common paths.\n` +
      `  If the spec URL is non-standard, pass it directly:\n` +
      `    node scripts/swagger-fetch.mjs ${url}/your/custom/spec-path`,
  );
  process.exit(1);
}

function outputSpec(text, sourceUrl, args) {
  let spec;
  try {
    spec = parseSpec(text);
  } catch (e) {
    console.error(`✗ Failed to parse spec from ${sourceUrl}: ${e.message}`);
    process.exit(1);
  }

  const version = detectSpecVersion(spec);
  const endpointCount = spec.paths ? Object.keys(spec.paths).length : 0;
  const title = spec.info?.title ?? "Unknown Service";

  console.error(`\n✓ Found spec:`);
  console.error(`  Title:     ${title}`);
  console.error(`  Version:   ${spec.info?.version ?? "?"}`);
  console.error(`  Format:    ${version}`);
  console.error(`  Endpoints: ${endpointCount} paths`);
  console.error(`  Source:    ${sourceUrl}`);

  const output = JSON.stringify(spec, null, 2);

  if (args.out) {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output, "utf8");
    console.error(`\n✓ Saved to: ${outPath}`);
  } else {
    process.stdout.write(output);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
