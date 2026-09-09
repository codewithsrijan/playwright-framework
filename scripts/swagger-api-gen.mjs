#!/usr/bin/env node
/**
 * swagger-api-gen.mjs
 *
 * Generates typed TypeScript artifacts from an OpenAPI 3.0 JSON spec,
 * following the existing ucm-playwright-automation helper/api/ conventions.
 *
 * Generated files per service:
 *   helper/api/urls.<service>.ts          — URL builder functions
 *   helper/api/payloads/<service>/        — Request body builder functions
 *   helper/api/schemas/<service>.schemas.ts — Zod response schemas (contract validation)
 *   helper/api/<Service>Client.ts         — Service client wrapping APIClient
 *   tests/tests-api/<service>.spec.ts     — Playwright spec (happy + error paths)
 *
 * Usage:
 *   node scripts/swagger-api-gen.mjs --spec <path-or-url> --service <name> [options]
 *
 * Options:
 *   --spec    <path|url>   Path to OpenAPI JSON file or URL (required)
 *   --service <name>       Service name used in filenames/class names (required)
 *   --out     <dir>        Project root to write files into (default: cwd)
 *   --dry-run              Print generated files to stdout, do not write
 *   --config  <path>       Path to config.json with skipEndpoints/includeEndpoints (default: skills/swagger-api-gen/config.json)
 *   --include <patterns>   Comma-separated endpoint patterns to include exclusively.
 *                          When set, ONLY these endpoints are generated (skipEndpoints ignored).
 *                          Supports same syntax as skipEndpoints: path glob, method+path.
 *                          e.g. --include "GET /api/users,POST /api/users,/api/orders/*"
 *
 * Examples:
 *   node scripts/swagger-api-gen.mjs --spec ./spec.json --service userManagement
 *   node scripts/swagger-api-gen.mjs --spec ./spec.json --service userManagement --include "GET /api/users,POST /api/users"
 *   node scripts/swagger-api-gen.mjs --spec https://api.example.com/v3/api-docs --service assignments --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    spec: null,
    service: null,
    out: process.cwd(),
    dryRun: false,
    configPath: null,
    include: [],   // CLI --include patterns (takes precedence over config includeEndpoints)
  };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--spec":    args.spec    = argv[++i]; break;
      case "--service": args.service = argv[++i]; break;
      case "--out":     args.out     = argv[++i]; break;
      case "--dry-run": args.dryRun  = true;      break;
      case "--config":  args.configPath = argv[++i]; break;
      case "--include":
        // Accept comma-separated patterns: "GET /api/users,POST /api/users,/api/orders/*"
        args.include = argv[++i]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
    }
  }
  return args;
}

// ── Load skip config ──────────────────────────────────────────────────────────

function loadConfig(configPath, projectRoot) {
  const candidates = [
    configPath,
    path.join(projectRoot, "skills", "swagger-api-gen", "config.json"),
    path.join(__dirname, "..", "skills", "swagger-api-gen", "config.json"),
  ].filter(Boolean);

  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(p, "utf8"));
        const skipPatterns    = cfg.skipEndpoints    ?? [];
        const includePatterns = cfg.includeEndpoints ?? [];
        if (includePatterns.length > 0) {
          console.error(`  Config: ${p} — include-only mode (${includePatterns.length} patterns)`);
        } else if (skipPatterns.length > 0) {
          console.error(`  Config: ${p} (${skipPatterns.length} skip patterns)`);
        }
        return { skipPatterns, includePatterns };
      } catch {
        // ignore malformed config
      }
    }
  }
  return { skipPatterns: [], includePatterns: [] };
}

function shouldSkip(method, pathStr, patterns) {
  for (const pattern of patterns) {
    // "METHOD /path" form
    if (/^[A-Z]+\s/.test(pattern)) {
      const [m, p] = pattern.split(/\s+/, 2);
      if (m.toUpperCase() === method.toUpperCase() && matchGlob(pathStr, p)) {
        return pattern;
      }
    } else {
      // path-only pattern
      if (matchGlob(pathStr, pattern)) return pattern;
    }
  }
  return null;
}

function matchGlob(str, pattern) {
  // Simple glob: * matches any segment characters
  const regex = new RegExp(
    "^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
  );
  return regex.test(str);
}

// ── Spec loader ───────────────────────────────────────────────────────────────

async function loadSpec(specArg) {
  if (specArg.startsWith("http://") || specArg.startsWith("https://")) {
    const res = await fetch(specArg, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching spec from ${specArg}`);
    return await res.json();
  }
  const resolved = path.resolve(specArg);
  if (!fs.existsSync(resolved)) throw new Error(`Spec file not found: ${resolved}`);
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

// ── Name helpers ──────────────────────────────────────────────────────────────

function toCamelCase(str) {
  return str.replace(/[-_/{}](.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
}

function toPascalCase(str) {
  const cc = toCamelCase(str);
  return cc.charAt(0).toUpperCase() + cc.slice(1);
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[-\s]+/g, "_");
}

/** Convert OpenAPI path template to a function-name-friendly string.
 *  e.g. /api/users/{userId}/roles → apiUsersByUserIdRoles */
function pathToFnName(method, pathStr) {
  const cleaned = pathStr
    .replace(/^\//, "")
    .replace(/\{([^}]+)\}/g, "By$1")
    .split("/")
    .map((s, i) => (i === 0 ? s : toPascalCase(s)))
    .join("");
  return `${method.toLowerCase()}${toPascalCase(cleaned)}`;
}

/** Convert OpenAPI path template to URL builder fn name: getUsersById */
function pathToUrlFnName(method, pathStr) {
  return pathToFnName(method, pathStr) + "Url";
}

/** Extract path params from an OpenAPI path template */
function extractPathParams(pathStr) {
  return [...pathStr.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
}

/** True if a path parameter name represents an organization UUID */
const ORG_PARAM_NAMES = new Set([
  "organizationId", "orgId", "organizationUuid", "orgUuid",
  "organizationID", "orgID", "orgUUID", "organizationUUID",
]);
function isOrgParam(paramName) {
  return ORG_PARAM_NAMES.has(paramName) ||
    /^org(anization)?(Id|Uuid|UUID|ID)?$/.test(paramName);
}

/** True if the endpoint likely involves email/OTP verification flows */
function isOtpRelated(pathStr, operation) {
  const text = [
    pathStr,
    operation.operationId ?? "",
    operation.summary ?? "",
    ...(operation.tags ?? []),
  ].join(" ").toLowerCase();
  return /\botp\b|verify.*(email|code|token)|email.*verif|confirm.*(email|account)|magic.?link|activation.?code|resend.*(otp|code)|validate.*(otp|token|code)/.test(text);
}

// ── Zod schema generator ──────────────────────────────────────────────────────

function schemaToZod(schema, spec, depth = 0) {
  if (!schema) return "z.unknown()";
  if (depth > 6) return "z.unknown()"; // guard deep recursion

  // Resolve $ref
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    return `${toPascalCase(refName)}Schema`;
  }

  if (schema.allOf) {
    const parts = schema.allOf.map((s) => schemaToZod(s, spec, depth + 1));
    return parts.length === 1 ? parts[0] : `z.intersection(${parts.join(", ")})`;
  }
  if (schema.oneOf || schema.anyOf) {
    const variants = (schema.oneOf ?? schema.anyOf).map((s) =>
      schemaToZod(s, spec, depth + 1),
    );
    return `z.union([${variants.join(", ")}])`;
  }

  const type = schema.type ?? (schema.properties ? "object" : null);

  if (type === "object" || schema.properties) {
    if (!schema.properties) return "z.record(z.unknown())";
    const required = new Set(schema.required ?? []);
    const fields = Object.entries(schema.properties)
      .map(([key, val]) => {
        let zodType = schemaToZod(val, spec, depth + 1);
        if (!required.has(key)) zodType += ".optional()";
        if (val.nullable) zodType += ".nullable()";
        return `    ${JSON.stringify(key)}: ${zodType}`;
      })
      .join(",\n");
    const base = `z.object({\n${fields}\n  })`;
    return schema.additionalProperties ? `${base}.passthrough()` : base;
  }

  if (type === "array") {
    const items = schema.items ? schemaToZod(schema.items, spec, depth + 1) : "z.unknown()";
    return `z.array(${items})`;
  }

  switch (type) {
    case "string":
      if (schema.enum) return `z.enum([${schema.enum.map((v) => JSON.stringify(v)).join(", ")}])`;
      if (schema.format === "date-time") return "z.string().datetime({ offset: true })";
      if (schema.format === "date") return "z.string().date()";
      if (schema.format === "uuid") return "z.string().uuid()";
      if (schema.format === "email") return "z.string().email()";
      return "z.string()";
    case "integer":
    case "number":
      return "z.number()";
    case "boolean":
      return "z.boolean()";
    case "null":
      return "z.null()";
    default:
      return "z.unknown()";
  }
}

/**
 * Generate all named component schemas as Zod consts.
 * Returns { content, emittedSchemas } so callers know which consts were actually written.
 */
function generateSchemaFile(spec, serviceName) {
  const components = spec.components?.schemas ?? {};
  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service ${serviceName}`,
    `import { z } from "zod";`,
    ``,
    `// ── Component Schemas (from OpenAPI components/schemas) ──────────────────────`,
  ];

  /** Track every const name that is actually emitted so clients only import real exports */
  const emittedSchemas = new Set();

  const schemaNames = Object.keys(components);

  // Forward-declare names so cross-references resolve
  for (const name of schemaNames) {
    const zodExpr = schemaToZod(components[name], spec);
    const constName = `${toPascalCase(name)}Schema`;
    lines.push(``, `export const ${constName} = ${zodExpr};`);
    lines.push(`export type ${toPascalCase(name)} = z.infer<typeof ${constName}>;`);
    emittedSchemas.add(constName);
  }

  // Per-operation response schemas (inline, not from components)
  lines.push(``, `// ── Inline Response Schemas (per operation) ─────────────────────────────────`);
  for (const [pathStr, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
      const opId = operation.operationId ?? pathToFnName(method, pathStr);
      const successResponse =
        operation.responses?.["200"] ??
        operation.responses?.["201"] ??
        operation.responses?.["204"];
      if (!successResponse) continue;
      const content = successResponse.content;
      if (!content) continue;
      const jsonContent = content["application/json"] ?? Object.values(content)[0];
      if (!jsonContent?.schema) continue;
      const zodExpr = schemaToZod(jsonContent.schema, spec);
      const constName = `${toPascalCase(opId)}ResponseSchema`;

      // Skip: z.unknown() is useless noise
      if (zodExpr === "z.unknown()") continue;
      // Skip: self-reference alias (const Foo = Foo) — happens when operationId matches component name
      if (constName === zodExpr) continue;
      // Skip: already declared as a component schema with the same name
      if (emittedSchemas.has(constName)) continue;

      lines.push(``, `export const ${constName} = ${zodExpr};`);
      lines.push(`export type ${toPascalCase(opId)}Response = z.infer<typeof ${constName}>;`);
      emittedSchemas.add(constName);
    }
  }

  return { content: lines.join("\n"), emittedSchemas };
}

// ── URL builders file ─────────────────────────────────────────────────────────

function generateUrlsFile(endpoints, serviceName) {
  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service ${serviceName}`,
    ``,
    `// URL builder functions for ${serviceName}`,
    `// Pattern follows helper/api/urls.ts conventions`,
    ``,
  ];

  const exportNames = [];

  for (const ep of endpoints) {
    const { method, pathStr, pathParams } = ep;
    const fnName = pathToUrlFnName(method, pathStr);
    const allParams = [...pathParams];
    const paramList = allParams.length
      ? allParams.map((p) => `${toCamelCase(p)}: string`).join(", ") + ", serviceConfig: { url: string }"
      : "serviceConfig: { url: string }";
    const urlTemplate = pathStr.replace(/\{([^}]+)\}/g, (_, p) => `\${${toCamelCase(p)}}`);

    lines.push(
      `export function ${fnName}(${paramList}): string {`,
      `  return \`\${serviceConfig.url}${urlTemplate}\`;`,
      `}`,
      ``,
    );
    exportNames.push(fnName);
  }

  lines.push(
    `export const ${toCamelCase(serviceName)}Urls = {`,
    ...exportNames.map((n) => `  ${n},`),
    `};`,
  );

  return lines.join("\n");
}

// ── Payload builders ──────────────────────────────────────────────────────────

function generatePayloadFile(method, pathStr, operation, spec) {
  const opId = operation.operationId ?? pathToFnName(method, pathStr);
  const fnName = `${toCamelCase(opId)}Payload`;
  const requestBody = operation.requestBody;
  let bodySchema = null;

  if (requestBody?.content) {
    const jsonContent =
      requestBody.content["application/json"] ??
      Object.values(requestBody.content)[0];
    bodySchema = jsonContent?.schema;
  }

  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Fields marked "TODO: override" must be replaced with real runtime values.`,
    `// Fields marked "⚠ FLOW DEPENDENCY" require data from an external system (e.g. Mailhog OTP).`,
    `// Pass runtime values via the overrides argument:`,
    `//   ${toCamelCase(opId)}Payload({ organizationId: orgId, courseId })`,
  ];

  if (!bodySchema) {
    lines.push(
      ``,
      `/** ${operation.summary ?? opId} — no request body */`,
      `export function ${fnName}(): Record<string, never> {`,
      `  return {};`,
      `}`,
    );
    return { fnName, content: lines.join("\n") };
  }

  // Only import faker when there is a real schema to generate
  lines.push(`import { faker } from "@faker-js/faker";`, ``);

  // Build a skeleton payload from schema properties
  const fields = buildSkeletonFields(bodySchema, spec, 0);
  lines.push(
    `/** ${operation.summary ?? opId} */`,
    `export function ${fnName}(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {`,
    `  return {`,
    ...fields.map((f) => `    ${f},`),
    `    ...overrides,`,
    `  };`,
    `}`,
  );

  return { fnName, content: lines.join("\n") };
}

function buildSkeletonFields(schema, spec, depth) {
  if (depth > 3) return [];
  if (!schema) return [];

  // Resolve $ref
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    const resolved = spec.components?.schemas?.[refName];
    return resolved ? buildSkeletonFields(resolved, spec, depth + 1) : [];
  }

  if (schema.allOf) {
    return schema.allOf.flatMap((s) => buildSkeletonFields(s, spec, depth + 1));
  }

  if (!schema.properties) return [];

  return Object.entries(schema.properties).map(([key, val]) => {
    const value = skeletonValue(key, val, spec, depth);
    return `${JSON.stringify(key)}: ${value}`;
  });
}

function skeletonValue(key, schema, spec, depth) {
  if (!schema) return "null";
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    const resolved = spec.components?.schemas?.[refName];
    if (resolved) return skeletonValue(key, resolved, spec, depth + 1);
    return "{}";
  }

  // allOf / oneOf / anyOf — use first variant
  if (schema.allOf?.length) return skeletonValue(key, schema.allOf[0], spec, depth + 1);
  if ((schema.oneOf ?? schema.anyOf)?.length) {
    return skeletonValue(key, (schema.oneOf ?? schema.anyOf)[0], spec, depth + 1);
  }

  if (schema.enum) return JSON.stringify(schema.enum[0]);

  const type = schema.type ?? (schema.properties ? "object" : null);
  const lk = key.toLowerCase();

  switch (type) {
    case "string": {
      // ── Flow-dependency fields — must not be faked ──────────────────────────
      if (/^(otp|verificationcode|verifycode|activationcode|magictoken|verifytoken|resettoken|confirmationcode)$/.test(lk) ||
          /code$/.test(lk) && /otp|verify|confirm|activation/.test(lk)) {
        return `"" /* ⚠ FLOW DEPENDENCY: inject real value via overrides — get from Mailhog */`;
      }

      // ── Format-based ────────────────────────────────────────────────────────
      if (schema.format === "uuid" || schema.format === "UUID") {
        if (isOrgParam(key))
          return `"00000000-0000-0000-0000-000000000000" /* override: pass real orgId */`;
        return `"00000000-0000-0000-0000-000000000000" /* TODO: override with real ${key} */`;
      }
      if (schema.format === "date-time") return `new Date().toISOString()`;
      if (schema.format === "date")      return `new Date().toISOString().split("T")[0]`;
      if (schema.format === "email")     return `faker.internet.email()`;
      if (schema.format === "uri" || schema.format === "url") return `faker.internet.url()`;

      // ── Name-based heuristics ───────────────────────────────────────────────
      if (lk.includes("email"))  return `faker.internet.email()`;
      if (lk === "firstname" || lk === "first_name")  return `faker.person.firstName()`;
      if (lk === "lastname"  || lk === "last_name")   return `faker.person.lastName()`;
      if (lk === "fullname"  || lk === "full_name" || lk === "displayname") return `faker.person.fullName()`;
      // "name" suffix but not username/domainname/filename
      if (/name$/.test(lk) && !/username|domain|file|mime|host/.test(lk)) return `faker.person.fullName()`;
      if (lk.includes("username") || lk === "login") return `faker.internet.userName()`;
      if (lk.includes("password") || lk.includes("pwd") || lk === "secret") {
        return `faker.internet.password({ length: 12 })`;
      }
      if (lk.includes("phone") || lk.includes("mobile") || lk.includes("cell")) {
        return `faker.phone.number()`;
      }
      if (lk.includes("description") || lk.includes("bio") || lk.includes("summary") || lk.includes("note") || lk.includes("comment")) {
        return `faker.lorem.sentence()`;
      }
      if (lk.includes("title") || lk.includes("label") || lk.includes("subject") || lk.includes("heading")) {
        return `faker.lorem.words(3)`;
      }
      if (lk.includes("url") || lk.includes("website") || lk.includes("link") || lk.includes("href")) {
        return `faker.internet.url()`;
      }
      if (lk.includes("domain")) return `faker.internet.domainName()`;
      if (lk.includes("city"))   return `faker.location.city()`;
      if (lk.includes("country") && lk.includes("code")) return `faker.location.countryCode()`;
      if (lk.includes("country")) return `faker.location.country()`;
      if (lk.includes("zip") || lk.includes("postal") || lk.includes("postcode")) {
        return `faker.location.zipCode()`;
      }
      if (lk.includes("address") || lk.includes("street")) return `faker.location.streetAddress()`;
      if (lk.includes("color") || lk.includes("colour")) return `faker.color.human()`;
      if (lk.includes("timezone") || lk.includes("time_zone")) return `"UTC"`;
      if (lk.includes("locale") || lk.includes("language")) return `"en-US"`;
      // Any field ending in Id/Uuid that isn't covered by format:uuid above
      if (/(?:id|uuid)$/i.test(key)) {
        if (isOrgParam(key))
          return `"00000000-0000-0000-0000-000000000000" /* override: pass real orgId */`;
        return `"00000000-0000-0000-0000-000000000000" /* TODO: override with real ${key} */`;
      }
      return `faker.lorem.word()`;
    }

    case "integer":
    case "number":
      if (/page$/.test(lk) || lk === "pagenumber") return `1`;
      if (/limit$|size$|perpage$|pagesize$/.test(lk)) return `10`;
      if (lk === "year") return `new Date().getFullYear()`;
      return `faker.number.int({ min: 1, max: 100 })`;

    case "boolean":
      if (/enabled|active|isactive|visible|published|verified|confirmed/.test(lk)) return `true`;
      return `false`;

    case "array":
      return "[]";

    case "object":
      if (schema.properties && depth < 2) {
        const inner = buildSkeletonFields(schema, spec, depth + 1);
        return `{ ${inner.join(", ")} }`;
      }
      return "{}";

    default:
      return "null";
  }
}

// ── Service client ────────────────────────────────────────────────────────────

function generateClientFile(endpoints, serviceName, spec, emittedSchemas = new Set()) {
  const className = `${toPascalCase(serviceName)}Client`;
  const urlsImport = toCamelCase(serviceName) + "Urls";
  const schemaImports = [];
  const methods = [];

  for (const ep of endpoints) {
    const { method, pathStr, pathParams, operation } = ep;
    const opId = operation.operationId ?? pathToFnName(method, pathStr);
    const fnName = toCamelCase(opId);
    const urlFn = pathToUrlFnName(method, pathStr);
    const hasBody = ["post", "put", "patch"].includes(method.toLowerCase());
    const payloadFn = hasBody ? `${toCamelCase(opId)}Payload` : null;

    // Determine response schema name
    const successResponse =
      operation.responses?.["200"] ??
      operation.responses?.["201"] ??
      operation.responses?.["204"];
    const hasResponseSchema =
      successResponse?.content?.["application/json"]?.schema ||
      (successResponse?.content && Object.values(successResponse.content)[0]?.schema);
    const candidateSchema = hasResponseSchema ? `${toPascalCase(opId)}ResponseSchema` : null;
    // Only import the schema if it was actually emitted by generateSchemaFile
    const responseSchemaConst =
      candidateSchema && emittedSchemas.has(candidateSchema) ? candidateSchema : null;

    if (responseSchemaConst) schemaImports.push(responseSchemaConst);

    const pathParamArgs = pathParams.map((p) => `${toCamelCase(p)}: string`);
    const bodyArg = payloadFn ? `body: Record<string, unknown> = {}` : null;
    const queryArg = "queryParams?: Record<string, string>";

    const allArgs = [...pathParamArgs, ...(bodyArg ? [bodyArg] : []), queryArg];
    const urlCallArgs = [
      ...pathParams.map(toCamelCase),
      "this.serviceConfig",
    ].join(", ");

    const methodLines = [
      `  /** ${operation.summary ?? opId} */`,
      `  async ${fnName}(${allArgs.join(", ")}): Promise<{ status: number; body: unknown }> {`,
      `    const url = ${urlsImport}.${urlFn}(${urlCallArgs});`,
      `    const res = await this.request.${method.toLowerCase()}(url, {`,
      `      headers: this.headers,`,
    ];
    if (hasBody && payloadFn) {
      methodLines.push(`      data: body,`);
    }
    if (method.toLowerCase() === "get") {
      methodLines.push(`      params: queryParams,`);
    }
    methodLines.push(
      `    });`,
      `    const status = res.status();`,
    );
    if (responseSchemaConst) {
      methodLines.push(
        `    if (status >= 200 && status < 300) {`,
        `      const json = await res.json().catch(() => null);`,
        `      if (json !== null) {`,
        `        const parsed = ${responseSchemaConst}.safeParse(json);`,
        `        if (!parsed.success) {`,
        `          console.warn(\`[${className}] Contract mismatch on ${method.toUpperCase()} ${pathStr}:\`, parsed.error.format());`,
        `        }`,
        `      }`,
        `    }`,
      );
    }
    methodLines.push(
      `    const body_ = await res.json().catch(() => null);`,
      `    return { status, body: body_ };`,
      `  }`,
    );
    methods.push(methodLines.join("\n"));
  }

  // Unique schema imports
  const uniqueSchemas = [...new Set(schemaImports)];

  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service ${serviceName}`,
    `import type { APIRequestContext } from "@playwright/test";`,
    `import { APIClient } from "./APIClient";`,
    `import { headerData } from "./headers/headers";`,
    `import { ${urlsImport} } from "./urls.${serviceName}";`,
    ...(uniqueSchemas.length > 0
      ? [`import { ${uniqueSchemas.join(", ")} } from "./schemas/${serviceName}.schemas";`]
      : []),
    ``,
    `export class ${className} {`,
    `  private readonly request: APIRequestContext;`,
    `  private readonly serviceConfig: { url: string; [k: string]: unknown };`,
    `  private readonly headers: Record<string, string>;`,
    ``,
    `  private constructor(`,
    `    request: APIRequestContext,`,
    `    serviceConfig: { url: string; [k: string]: unknown },`,
    `    token: string,`,
    `  ) {`,
    `    this.request = request;`,
    `    this.serviceConfig = serviceConfig;`,
    `    this.headers = headerData.commonHeaderWithToken(token);`,
    `  }`,
    ``,
    `  /** Factory — reads develop.json, generates auth token, returns ready client */`,
    `  static async create(request: APIRequestContext): Promise<${className}> {`,
    `    const envVars = APIClient.getEnvVariables();`,
    `    const serviceConfig = envVars["${serviceName}"] as { url: string; basicUser: string; basicPassword: string };`,
    `    const apiClient = new APIClient();`,
    `    const token = await apiClient.generateToken(request, serviceConfig);`,
    `    if (!token) throw new Error("Failed to generate auth token");`,
    `    return new ${className}(request, serviceConfig, token);`,
    `  }`,
    ``,
    ...methods,
    `}`,
  ];

  return lines.join("\n");
}

// ── Test spec ─────────────────────────────────────────────────────────────────

function generateSpecFile(endpoints, serviceName, spec, emittedSchemas = new Set()) {
  const className = `${toPascalCase(serviceName)}Client`;
  const specTitle = spec.info?.title ?? serviceName;
  const schemaImports = [];

  // Collect schema imports — only include consts that were actually emitted
  for (const ep of endpoints) {
    const { method, pathStr, operation } = ep;
    const opId = operation.operationId ?? pathToFnName(method, pathStr);
    const successResponse =
      operation.responses?.["200"] ??
      operation.responses?.["201"] ??
      operation.responses?.["204"];
    const hasSchema =
      successResponse?.content?.["application/json"]?.schema ||
      (successResponse?.content && Object.values(successResponse.content)[0]?.schema);
    const candidate = hasSchema ? `${toPascalCase(opId)}ResponseSchema` : null;
    if (candidate && emittedSchemas.has(candidate)) schemaImports.push(candidate);
  }
  const uniqueSchemas = [...new Set(schemaImports)];

  // The spec is written to tests/tests-api/<service>.spec.ts (2 levels from project root)
  const root = "../..";

  // Pre-compute payload builder imports (POST/PUT/PATCH only)
  const payloadImportLines = [];
  const payloadFnMap = new Map(); // opId → payload function name
  for (const ep of endpoints) {
    const { method, pathStr: ps, operation: op } = ep;
    if (!["post", "put", "patch"].includes(method.toLowerCase())) continue;
    const epOpId = op.operationId ?? pathToFnName(method, ps);
    const fnName = `${toCamelCase(epOpId)}Payload`;
    if (!payloadFnMap.has(epOpId)) {
      payloadFnMap.set(epOpId, fnName);
      payloadImportLines.push(
        `import { ${fnName} } from "${root}/helper/api/payloads/${serviceName}/${fnName}";`
      );
    }
  }

  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Re-run: node scripts/swagger-api-gen.mjs --spec <specUrl> --service ${serviceName}`,
    `//`,
    `// Service: ${specTitle}`,
    `// Generated: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `import { test, expect, request as playwrightRequest } from "@playwright/test";`,
    `import { Reporter } from "${root}/utils/Reporter";`,
    `import { APIClient } from "${root}/helper/api/APIClient";`,
    `import { ${className} } from "${root}/helper/api/${className}";`,
    ...(uniqueSchemas.length > 0
      ? [
          `import { ${uniqueSchemas.join(", ")} } from "${root}/helper/api/schemas/${serviceName}.schemas";`,
        ]
      : []),
    ...payloadImportLines,
    ``,
    `let client: ${className};`,
    `let orgId: string;`,
    `let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;`,
    ``,
    `test.beforeAll("Authenticate + resolve org", async () => {`,
    `  // Create a persistent APIRequestContext scoped to the whole suite.`,
    `  // Using playwrightRequest.newContext() avoids the "fixture from beforeAll cannot be`,
    `  // reused in a test" error that occurs when storing the { request } fixture.`,
    `  apiContext = await playwrightRequest.newContext();`,
    ``,
    `  const envVars = APIClient.getEnvVariables();`,
    `  const serviceConfig = envVars["${serviceName}"] as { url: string; [k: string]: unknown };`,
    ``,
    `  // 1. Extract domain from the frontend URL to resolve org UUID`,
    `  const frontendUrl = (envVars["frontend"] as { url: string }).url;`,
    `  const domainMatch = frontendUrl.match(/https:\\/\\/([^.]+)\\./);`,
    `  if (!domainMatch) throw new Error(\`Cannot extract domain from frontend URL: \${frontendUrl}\`);`,
    `  const domain = domainMatch[1];`,
    ``,
    `  // 2. Resolve real org UUID via organizations-api`,
    `  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };`,
    `  const apiClient = new APIClient();`,
    `  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);`,
    ``,
    `  // 3. Create service client using the persistent context`,
    `  client = await ${className}.create(apiContext);`,
    `});`,
    ``,
    `test.afterAll(async () => {`,
    `  await apiContext?.dispose();`,
    `});`,
    ``,
  ];

  // Group endpoints by tag or path prefix
  const groups = groupEndpoints(endpoints);

  for (const [groupName, groupEps] of Object.entries(groups)) {
    lines.push(
      `test.describe("${toPascalCase(serviceName)} — ${groupName}", () => {`,
      `  test.beforeEach(async () => {`,
      `    await Reporter.setEpic("${toPascalCase(serviceName)}");`,
      `    await Reporter.setFeature("${groupName}");`,
      `    await Reporter.addTags("api", "auto-generated");`,
      `  });`,
      ``,
    );

    for (const ep of groupEps) {
      const { method, pathStr, pathParams, operation } = ep;
      const opId = operation.operationId ?? pathToFnName(method, pathStr);
      const fnName = toCamelCase(opId);
      const summary = operation.summary ?? `${method.toUpperCase()} ${pathStr}`;
      const successCode = Object.keys(operation.responses ?? {}).find((c) =>
        ["200", "201", "204"].includes(c),
      ) ?? "200";
      const hasBody = ["post", "put", "patch"].includes(method.toLowerCase());
      const payloadFn = hasBody ? (payloadFnMap.get(opId) ?? `${toCamelCase(opId)}Payload`) : null;
      const otpFlow = isOtpRelated(pathStr, operation);

      // Build call args — use orgId for org params, payload builder for body
      const pathArgValues = pathParams.map((p) =>
        isOrgParam(p)
          ? `orgId`
          : `"test-${toCamelCase(p)}" /* TODO: replace with real ${p} */`
      );
      const bodyArg = payloadFn ? `${payloadFn}()` : null;
      const callArgs = [...pathArgValues, ...(bodyArg ? [bodyArg] : [])].join(", ");

      // Success schema const — use exact match to avoid "Fetch" matching "FetchUserStatus"
      const expectedSchemaName = `${toPascalCase(opId)}ResponseSchema`;
      const responseSchemaConst = uniqueSchemas.includes(expectedSchemaName)
        ? expectedSchemaName
        : undefined;

      // Happy path
      lines.push(`  // Happy path: ${summary}`);
      if (otpFlow) {
        lines.push(
          `  // ⚠ FLOW DEPENDENCY: This endpoint likely requires an OTP/verification code from email.`,
          `  //   1. Read the OTP from Mailhog:  const mailhog = MailhogClient.fromEnv();`,
          `  //   2. const email = await mailhog.waitForEmail("user@example.com");`,
          `  //   3. const otp = mailhog.extractOtp(email);`,
          `  //   4. Pass otp in the request body via the payload builder's overrides argument.`,
          `  //   See helper/api/MailhogClient.ts for the full API.`,
        );
      }
      lines.push(`  test("${opId} — ${parseInt(successCode)}  happy path", async () => {`);
      lines.push(`    await Reporter.setStory("${summary}");`);
      lines.push(`    const { status, body } = await client.${fnName}(${callArgs});`);
      lines.push(`    expect(status).toBe(${parseInt(successCode)});`);
      if (responseSchemaConst) {
        lines.push(`    // Zod contract validation`);
        lines.push(`    if (body !== null) {`);
        lines.push(`      const parsed = ${responseSchemaConst}.safeParse(body);`);
        lines.push(`      expect(parsed.success, \`Contract mismatch: \${JSON.stringify(parsed.error?.format())}\`).toBe(true);`);
        lines.push(`    }`);
      }
      lines.push(`  });`, ``);

      // Error path — 401 Unauthorized (always relevant)
      lines.push(`  // Error path: ${summary} — unauthorized`);
      lines.push(`  test("${opId} — 401 unauthorized", async ({ request }) => {`);
      lines.push(`    await Reporter.setStory("${summary} — unauthorized");`);
      lines.push(
        `    // Create a client with a bad token to trigger 401`,
        `    const envVars = APIClient.getEnvVariables();`,
        `    const serviceConfig = envVars["${serviceName}"] as { url: string };`,
        `    // Directly call the endpoint with an invalid bearer token`,
        `    const res = await request.${method.toLowerCase()}(`,
        `      // replace with the actual URL builder call if needed`,
        `      \`\${serviceConfig.url}${pathStr.replace(/\{([^}]+)\}/g, "invalid-$1")}\`,`,
        `      { headers: { Authorization: "Bearer invalid-token", "Content-Type": "application/json" } },`,
        `    );`,
        `    expect([401, 403]).toContain(res.status());`,
        `  });`,
        ``,
      );

      // 404 path for endpoints with path params
      if (pathParams.length > 0) {
        lines.push(`  // Error path: ${summary} — not found`);
        lines.push(`  test("${opId} — 404 not found", async () => {`);
        lines.push(`    await Reporter.setStory("${summary} — not found");`);
        const notFoundArgs = [
          ...pathParams.map(() => `"00000000-0000-0000-0000-000000000000"`),
          ...(payloadFn ? [`${payloadFn}()`] : []),
        ].join(", ");
        lines.push(`    const { status } = await client.${fnName}(${notFoundArgs});`);
        // 500 included: some services validate body/routing before UUID existence check
        lines.push(`    expect([404, 400, 500]).toContain(status);`);
        lines.push(`  });`, ``);
      }
    }

    lines.push(`});`, ``);
  }

  return lines.join("\n");
}

function groupEndpoints(endpoints) {
  const groups = {};
  for (const ep of endpoints) {
    const tag = ep.operation.tags?.[0] ?? ep.pathStr.split("/").filter(Boolean)[0] ?? "default";
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(ep);
  }
  return groups;
}

// ── Flow dependency analysis ──────────────────────────────────────────────────

/**
 * Fields whose names suggest they are IDs, tokens, or codes produced by one
 * endpoint and consumed by another.  Used to match producer → consumer pairs.
 */
const PRODUCED_FIELD_SUFFIXES = /(?:id|uuid|token|code|key|ref|secret|ticket|handle|registration|session)$/i;

/**
 * Collect all leaf field names from a resolved JSON Schema (depth-limited).
 * Follows $ref into spec.components.schemas.
 */
function collectFieldNames(schema, spec, depth = 0) {
  if (!schema || depth > 4) return new Set();
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    return collectFieldNames(spec.components?.schemas?.[refName], spec, depth + 1);
  }
  if (schema.allOf) {
    const all = new Set();
    for (const s of schema.allOf) for (const f of collectFieldNames(s, spec, depth + 1)) all.add(f);
    return all;
  }
  const fields = new Set();
  if (schema.properties) {
    for (const [key, val] of Object.entries(schema.properties)) {
      fields.add(key);
      // Recurse one level into nested objects
      for (const f of collectFieldNames(val, spec, depth + 1)) fields.add(f);
    }
  }
  return fields;
}

/**
 * Resolve the success response schema (200 / 201) for an operation.
 */
function getResponseSchema(operation) {
  const resp = operation.responses?.["200"] ?? operation.responses?.["201"];
  if (!resp?.content) return null;
  return (resp.content["application/json"] ?? Object.values(resp.content)[0])?.schema ?? null;
}

/**
 * Resolve the request body schema for an operation.
 */
function getRequestBodySchema(operation) {
  const rb = operation.requestBody?.content;
  if (!rb) return null;
  return (rb["application/json"] ?? Object.values(rb)[0])?.schema ?? null;
}

/**
 * Analyse all endpoints in the spec and return:
 *
 *   flows  — array of detected named flows:
 *     { flowName, steps: [{ method, pathStr, operation, produces, consumes }] }
 *
 *   isolated — endpoints that have no detected cross-endpoint dependency
 */
function detectFlows(allEndpoints, spec) {
  // ── 1. Build producer map: endpointKey → Set of produced field names ─────────
  const producers = new Map(); // key → { method, pathStr, operation, fields: Set }
  for (const ep of allEndpoints) {
    const { method, pathStr, operation } = ep;
    const key = `${method.toUpperCase()} ${pathStr}`;
    const schema = getResponseSchema(operation);
    const fields = collectFieldNames(schema, spec);
    // Keep only fields whose names suggest they carry IDs / tokens / codes
    const relevant = new Set([...fields].filter((f) => PRODUCED_FIELD_SUFFIXES.test(f)));
    // Also capture the bare "id" / "uuid" fields
    if (fields.has("id")) relevant.add("id");
    if (fields.has("uuid")) relevant.add("uuid");
    producers.set(key, { ...ep, producedFields: relevant });
  }

  // ── 2. Build consumer map: endpointKey → Set of consumed field names ─────────
  const consumers = new Map();
  for (const ep of allEndpoints) {
    const { method, pathStr, pathParams, operation } = ep;
    const key = `${method.toUpperCase()} ${pathStr}`;
    const bodySchema = getRequestBodySchema(operation);
    const bodyFields = collectFieldNames(bodySchema, spec);
    // Path params + body fields together form the "needs" surface
    const needed = new Set([
      ...pathParams,
      ...[...bodyFields].filter((f) => PRODUCED_FIELD_SUFFIXES.test(f) || f === "id" || f === "uuid"),
    ]);
    // Remove org-family params — those are auto-resolved and not a cross-endpoint dep
    for (const p of [...needed]) { if (isOrgParam(p)) needed.delete(p); }
    consumers.set(key, { ...ep, consumedFields: needed });
  }

  // ── 3. Cross-reference: find which endpoint's produced field feeds another ───
  //   edges: { from: epKey, to: epKey, sharedFields: [fieldName] }
  const edges = [];
  for (const [toKey, toEp] of consumers) {
    for (const field of toEp.consumedFields) {
      for (const [fromKey, fromEp] of producers) {
        if (fromKey === toKey) continue;
        if (fromEp.producedFields.has(field)) {
          edges.push({ from: fromKey, to: toKey, field, fromEp, toEp });
        }
      }
    }
  }

  // ── 4. Also detect email-flow endpoints (OTP / verify etc.) ─────────────────
  const emailFlowKeys = new Set();
  for (const ep of allEndpoints) {
    if (isOtpRelated(ep.pathStr, ep.operation)) {
      emailFlowKeys.add(`${ep.method.toUpperCase()} ${ep.pathStr}`);
    }
  }

  // ── 5. Group edges into named flows using path-prefix heuristics ─────────────
  //   Strategy: walk the edge graph topologically; group connected components.
  const visited = new Set();
  const flowGroups = []; // each group = ordered list of endpoint keys

  function dfs(key, group) {
    if (visited.has(key)) return;
    visited.add(key);
    group.push(key);
    // Follow outgoing edges
    for (const e of edges) {
      if (e.from === key) dfs(e.to, group);
    }
    // Also follow incoming edges (to capture the full chain)
    for (const e of edges) {
      if (e.to === key) dfs(e.from, group);
    }
  }

  // Seed DFS from endpoints that appear as producers (chain starters)
  const producerKeys = new Set(edges.map((e) => e.from));
  for (const key of producerKeys) {
    if (!visited.has(key)) {
      const group = [];
      dfs(key, group);
      if (group.length > 1) flowGroups.push(group);
    }
  }

  // Also add isolated email-flow endpoints that didn't appear in any edge
  for (const key of emailFlowKeys) {
    if (!visited.has(key)) {
      visited.add(key);
      // Find the nearest non-otp endpoint that likely triggers the email
      const toEp = consumers.get(key);
      if (toEp) flowGroups.push([key]); // single-step email flow
    }
  }

  // ── 6. Build final flow objects ──────────────────────────────────────────────
  const flows = flowGroups.map((group, i) => {
    // Sort steps: producers first (endpoints with no incoming edges in this group)
    const groupEdges = edges.filter((e) => group.includes(e.from) && group.includes(e.to));
    const hasIncoming = new Set(groupEdges.map((e) => e.to));
    const ordered = [
      ...group.filter((k) => !hasIncoming.has(k)),  // starters
      ...group.filter((k) => hasIncoming.has(k)),   // dependents
    ];

    const steps = ordered.map((key, stepIdx) => {
      const ep = [...allEndpoints].find(
        (e) => `${e.method.toUpperCase()} ${e.pathStr}` === key,
      );
      const producedHere = producers.get(key)?.producedFields ?? new Set();
      const consumedHere = consumers.get(key)?.consumedFields ?? new Set();
      const fromEmail = emailFlowKeys.has(key);

      // Which fields come from a prior step vs from email vs still unknown
      const fieldSources = {};
      for (const f of consumedHere) {
        const producer = groupEdges.find((e) => e.to === key && e.field === f);
        if (producer) {
          fieldSources[f] = { source: "prior-step", from: producer.from };
        } else if (/otp|verificationcode|activationcode|resetcode|code/i.test(f)) {
          fieldSources[f] = { source: "mailhog-otp" };
        } else if (/token|magic|activationtoken|verifytoken/i.test(f)) {
          fieldSources[f] = { source: "mailhog-link" };
        } else {
          fieldSources[f] = { source: "unknown" };
        }
      }

      // Which produced fields are interesting (consumed downstream)?
      const downstreamFields = groupEdges
        .filter((e) => e.from === key)
        .map((e) => e.field);

      return {
        stepNumber: stepIdx + 1,
        key,
        method: ep?.method.toUpperCase() ?? "?",
        pathStr: ep?.pathStr ?? key,
        operation: ep?.operation,
        producedFields: [...producedHere],
        captureFields: downstreamFields,   // fields to capture for downstream steps
        consumedFields: [...consumedHere],
        fieldSources,
        needsEmail: fromEmail || Object.values(fieldSources).some((s) => s.source.startsWith("mailhog")),
      };
    });

    // Derive a human-readable flow name from the first step's path
    const firstPath = steps[0]?.pathStr ?? "";
    const rawName = firstPath
      .split("/")
      .filter((s) => s && !s.startsWith("{"))
      .slice(-2)
      .join("-");
    const flowName = toPascalCase(rawName || `Flow${i + 1}`);

    return { flowName, steps };
  });

  const allFlowKeys = new Set(flowGroups.flat());
  const isolated = allEndpoints.filter(
    (ep) => !allFlowKeys.has(`${ep.method.toUpperCase()} ${ep.pathStr}`),
  );

  return { flows, isolated };
}

/**
 * Render the flow dependency report as a human-readable string (printed to stderr).
 */
function renderFlowReport(flows, isolated) {
  const lines = [];
  lines.push(`\n${"─".repeat(64)}`);
  lines.push(`  API FLOW DEPENDENCY REPORT`);
  lines.push(`${"─".repeat(64)}`);

  if (flows.length === 0) {
    lines.push(`  No cross-endpoint flows detected.`);
  }

  for (const { flowName, steps } of flows) {
    lines.push(`\n  📋 Flow: ${flowName}`);
    lines.push(`  ${"─".repeat(52)}`);
    for (const step of steps) {
      lines.push(`\n  Step ${step.stepNumber}: ${step.method} ${step.pathStr}`);
      if (step.captureFields.length > 0) {
        lines.push(`    ↳ Produces (capture for next step): ${step.captureFields.join(", ")}`);
      }
      for (const [field, src] of Object.entries(step.fieldSources)) {
        if (src.source === "prior-step") {
          lines.push(`    ← ${field}: from ${src.from}`);
        } else if (src.source === "mailhog-otp") {
          lines.push(`    ← ${field}: ⚠ extract OTP from Mailhog email`);
        } else if (src.source === "mailhog-link") {
          lines.push(`    ← ${field}: ⚠ extract link/token from Mailhog email`);
        } else {
          lines.push(`    ← ${field}: ❓ unknown source — clarify with user`);
        }
      }
      if (step.needsEmail) {
        lines.push(`    ✉ Email interaction required — MailhogClient needed`);
      }
    }
  }

  if (isolated.length > 0) {
    lines.push(`\n  Isolated endpoints (no detected flow dependencies):`);
    for (const ep of isolated) {
      lines.push(`    ${ep.method.toUpperCase()} ${ep.pathStr}`);
    }
  }

  lines.push(`\n${"─".repeat(64)}\n`);
  return lines.join("\n");
}

/**
 * Generate a flow test file for a single detected flow.
 * Uses test.describe.serial so steps run in order and share state.
 */
function generateFlowSpecFile(flow, serviceName, spec) {
  const { flowName, steps } = flow;
  const className = `${toPascalCase(serviceName)}Client`;
  const root = "../..";

  // Collect payload imports
  const payloadImports = [];
  for (const step of steps) {
    if (!step.operation) continue;
    if (!["POST", "PUT", "PATCH"].includes(step.method)) continue;
    const opId = step.operation.operationId ?? pathToFnName(step.method.toLowerCase(), step.pathStr);
    const fnName = `${toCamelCase(opId)}Payload`;
    payloadImports.push(`import { ${fnName} } from "${root}/helper/api/payloads/${serviceName}/${fnName}";`);
  }

  const needsMailhog = steps.some((s) => s.needsEmail);
  const sharedVars = new Set();
  for (const step of steps) {
    for (const f of step.captureFields) sharedVars.add(f);
  }

  const lines = [
    `// AUTO-GENERATED FLOW TEST — do not edit manually`,
    `// Flow: ${flowName}`,
    `// Steps: ${steps.map((s) => `${s.method} ${s.pathStr}`).join(" → ")}`,
    `//`,
    `// This file uses test.describe.serial — steps MUST run in order.`,
    `// Each step captures data needed by the next.`,
    ``,
    `import { test, expect, request as playwrightRequest } from "@playwright/test";`,
    `import { Reporter } from "${root}/utils/Reporter";`,
    `import { APIClient } from "${root}/helper/api/APIClient";`,
    `import { ${className} } from "${root}/helper/api/${className}";`,
    ...(needsMailhog ? [`import { MailhogClient } from "${root}/helper/api/MailhogClient";`] : []),
    ...payloadImports,
    ``,
    `// ── Shared state across steps ────────────────────────────────────────────────`,
    `let client: ${className};`,
    `let orgId: string;`,
    `let apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>>;`,
    ...[...sharedVars].map((v) => `let ${toCamelCase(v)}: string;`),
    ``,
    `test.beforeAll("Authenticate + resolve org", async () => {`,
    `  apiContext = await playwrightRequest.newContext();`,
    `  const envVars = APIClient.getEnvVariables();`,
    `  const serviceConfig = envVars["${serviceName}"] as { url: string; [k: string]: unknown };`,
    `  const frontendUrl = (envVars["frontend"] as { url: string }).url;`,
    `  const domainMatch = frontendUrl.match(/https:\\/\\/([^.]+)\\./);`,
    `  if (!domainMatch) throw new Error(\`Cannot extract domain: \${frontendUrl}\`);`,
    `  const domain = domainMatch[1];`,
    `  const orgV2Config = envVars["organizations-api"] as { url: string; token: string };`,
    `  const apiClient = new APIClient();`,
    `  orgId = await apiClient.getOrgDetailsByDomain(apiContext, domain, orgV2Config);`,
    `  client = await ${className}.create(apiContext);`,
    `});`,
    ``,
    `test.afterAll(async () => { await apiContext?.dispose(); });`,
    ``,
    `// test.describe.serial guarantees steps run in order, one at a time.`,
    `test.describe.serial("${toPascalCase(serviceName)} — ${flowName} flow", () => {`,
    `  test.beforeEach(async () => {`,
    `    await Reporter.setEpic("${toPascalCase(serviceName)}");`,
    `    await Reporter.setFeature("${flowName} flow");`,
    `    await Reporter.addTags("api", "flow", "auto-generated");`,
    `  });`,
    ``,
  ];

  for (const step of steps) {
    if (!step.operation) continue;
    const opId = step.operation.operationId ?? pathToFnName(step.method.toLowerCase(), step.pathStr);
    const fnName = toCamelCase(opId);
    const summary = step.operation.summary ?? `${step.method} ${step.pathStr}`;
    const successCode = Object.keys(step.operation.responses ?? {}).find((c) =>
      ["200", "201", "204"].includes(c),
    ) ?? "200";
    const hasBody = ["POST", "PUT", "PATCH"].includes(step.method);
    const payloadFn = hasBody
      ? `${toCamelCase(opId)}Payload`
      : null;

    // Build path args — use orgId for org params, captured vars for known deps, TODO for unknowns
    const pathArgs = step.operation
      ? extractPathParams(step.pathStr).map((p) => {
          if (isOrgParam(p)) return `orgId`;
          if (sharedVars.has(p)) return toCamelCase(p);
          return `"test-${toCamelCase(p)}" /* TODO: supply real ${p} */`;
        })
      : [];

    // Build overrides for payload — inject captured vars + flag unknowns
    const overrideEntries = [];
    for (const [field, src] of Object.entries(step.fieldSources)) {
      if (isOrgParam(field)) {
        overrideEntries.push(`${field}: orgId`);
      } else if (src.source === "prior-step" && sharedVars.has(field)) {
        overrideEntries.push(`${field}: ${toCamelCase(field)}`);
      } else if (src.source === "mailhog-otp") {
        overrideEntries.push(`${field}: otp /* from Mailhog */`);
      } else if (src.source === "mailhog-link") {
        overrideEntries.push(`${field}: token /* from Mailhog link */`);
      }
      // unknown fields stay as faker defaults in the payload builder
    }
    const overrides = overrideEntries.length > 0
      ? `{ ${overrideEntries.join(", ")} }`
      : `{}`;

    const callArgs = [
      ...pathArgs,
      ...(payloadFn ? [`${payloadFn}(${overrides})`] : []),
    ].join(", ");

    lines.push(`  // Step ${step.stepNumber}: ${summary}`);
    lines.push(`  test("Step ${step.stepNumber}: ${opId} — ${summary}", async () => {`);
    lines.push(`    await Reporter.setStory("${flowName} / Step ${step.stepNumber}: ${summary}");`);

    // Assert prior captured vars exist (guard)
    for (const [field, src] of Object.entries(step.fieldSources)) {
      if (src.source === "prior-step" && sharedVars.has(field)) {
        lines.push(`    expect(${toCamelCase(field)}, "Step ${step.stepNumber} requires ${field} from a previous step").toBeTruthy();`);
      }
    }

    // Mailhog setup if needed for this step
    const mailhogOtpFields = Object.entries(step.fieldSources)
      .filter(([, s]) => s.source === "mailhog-otp")
      .map(([f]) => f);
    const mailhogLinkFields = Object.entries(step.fieldSources)
      .filter(([, s]) => s.source === "mailhog-link")
      .map(([f]) => f);

    if (mailhogOtpFields.length > 0 || mailhogLinkFields.length > 0) {
      lines.push(`    const sentAt = new Date();`);
      lines.push(`    // NOTE: trigger the email first (the call below may do it), then read from Mailhog`);
      lines.push(`    const mailhog = MailhogClient.fromEnv();`);
      lines.push(`    const email = await mailhog.waitForEmail("test@example.com" /* TODO: use real test email */, 30_000, sentAt);`);
      if (mailhogOtpFields.length > 0) {
        lines.push(`    const otp = mailhog.extractOtp(email);`);
        lines.push(`    expect(otp, "OTP not found in email body").not.toBeNull();`);
      }
      if (mailhogLinkFields.length > 0) {
        lines.push(`    const token = mailhog.extractLink(email); // TODO: adjust path prefix if needed`);
        lines.push(`    expect(token, "Token/link not found in email body").not.toBeNull();`);
      }
    }

    lines.push(`    const { status, body } = await client.${fnName}(${callArgs});`);
    lines.push(`    expect(status).toBe(${parseInt(successCode)});`);

    // Capture fields for downstream steps
    for (const field of step.captureFields) {
      const camel = toCamelCase(field);
      lines.push(`    // Capture ${field} for downstream steps`);
      lines.push(`    ${camel} = (body as Record<string, string>)["${field}"];`);
      lines.push(`    expect(${camel}, "Expected ${field} in response body").toBeTruthy();`);
    }

    lines.push(`  });`, ``);
  }

  lines.push(`});`, ``);
  return lines.join("\n");
}

// ── File writer ───────────────────────────────────────────────────────────────

function writeFile(filePath, content, dryRun) {
  if (dryRun) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`// FILE: ${filePath}`);
    console.log(`${"=".repeat(60)}`);
    console.log(content);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.error(`  ✓ ${filePath}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.spec || !args.service) {
    console.error(
      "Usage: node scripts/swagger-api-gen.mjs --spec <path|url> --service <name> [--out <dir>] [--dry-run]",
    );
    process.exit(1);
  }

  const projectRoot = path.resolve(args.out);
  const serviceName = args.service;

  console.error(`\n── swagger-api-gen ──────────────────────────────────────────`);
  console.error(`  Service:  ${serviceName}`);
  console.error(`  Spec:     ${args.spec}`);
  console.error(`  Output:   ${projectRoot}`);
  console.error(`  Dry-run:  ${args.dryRun}`);

  // Load spec
  console.error(`\nLoading spec...`);
  const spec = await loadSpec(args.spec);
  const title = spec.info?.title ?? serviceName;
  const version = spec.info?.version ?? "?";
  const paths = spec.paths ?? {};
  console.error(`  Title:   ${title} v${version}`);
  console.error(`  Paths:   ${Object.keys(paths).length}`);

  // Load config (skip + include patterns)
  const { skipPatterns, includePatterns: configInclude } = loadConfig(args.configPath, projectRoot);

  // CLI --include takes precedence over config includeEndpoints
  const includePatterns = args.include.length > 0 ? args.include : configInclude;
  const usingIncludeMode = includePatterns.length > 0;

  if (usingIncludeMode) {
    console.error(`  Mode: include-only (${includePatterns.length} patterns — skipEndpoints ignored)`);
    for (const p of includePatterns) console.error(`    + ${p}`);
  }

  // Collect endpoints
  const endpoints = [];
  const skipped = [];
  const excluded = []; // did not match include list

  for (const [pathStr, pathItem] of Object.entries(paths)) {
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      const operation = pathItem[method];
      if (!operation) continue;

      if (usingIncludeMode) {
        // Include-only mode: keep only endpoints that match a pattern
        const includeReason = shouldSkip(method.toUpperCase(), pathStr, includePatterns);
        if (!includeReason) {
          excluded.push({ method: method.toUpperCase(), pathStr });
          continue;
        }
      } else {
        // Skip mode: remove endpoints that match a skip pattern
        const skipReason = shouldSkip(method.toUpperCase(), pathStr, skipPatterns);
        if (skipReason) {
          skipped.push({ method: method.toUpperCase(), pathStr, pattern: skipReason });
          continue;
        }
      }

      endpoints.push({
        method,
        pathStr,
        pathParams: extractPathParams(pathStr),
        operation,
      });
    }
  }

  console.error(`  Endpoints to generate: ${endpoints.length}`);
  if (skipped.length > 0) {
    console.error(`  Skipped (${skipped.length}):`);
    for (const s of skipped) {
      console.error(`    ✗ ${s.method} ${s.pathStr}  [pattern: "${s.pattern}"]`);
    }
  }
  if (excluded.length > 0) {
    console.error(`  Excluded — not in include list (${excluded.length}):`);
    for (const e of excluded) {
      console.error(`    ✗ ${e.method} ${e.pathStr}`);
    }
  }

  if (endpoints.length === 0) {
    console.error(`\n⚠ No endpoints to generate. Check skip patterns or spec paths.`);
    process.exit(0);
  }

  // ── Flow dependency analysis (always runs — informs Claude and the user) ─────
  const { flows, isolated } = detectFlows(endpoints, spec);
  console.error(renderFlowReport(flows, isolated));

  console.error(`\nGenerating files...`);

  // 1. Zod schemas
  const { content: schemasContent, emittedSchemas } = generateSchemaFile(spec, serviceName);
  writeFile(
    path.join(projectRoot, "helper", "api", "schemas", `${serviceName}.schemas.ts`),
    schemasContent,
    args.dryRun,
  );

  // 2. URL builders
  const urlsContent = generateUrlsFile(endpoints, serviceName);
  writeFile(
    path.join(projectRoot, "helper", "api", `urls.${serviceName}.ts`),
    urlsContent,
    args.dryRun,
  );

  // 3. Payload builders (one file per endpoint with request body)
  const payloadFns = [];
  for (const ep of endpoints) {
    const { method, pathStr, operation } = ep;
    if (!["post", "put", "patch"].includes(method.toLowerCase())) continue;
    const { fnName, content } = generatePayloadFile(method, pathStr, operation, spec);
    const opId = operation.operationId ?? pathToFnName(method, pathStr);
    writeFile(
      path.join(projectRoot, "helper", "api", "payloads", serviceName, `${toCamelCase(opId)}Payload.ts`),
      content,
      args.dryRun,
    );
    payloadFns.push(fnName);
  }

  // 4. Service client
  const clientContent = generateClientFile(endpoints, serviceName, spec, emittedSchemas);
  writeFile(
    path.join(projectRoot, "helper", "api", `${toPascalCase(serviceName)}Client.ts`),
    clientContent,
    args.dryRun,
  );

  // 5. Test spec
  const specContent = generateSpecFile(endpoints, serviceName, spec, emittedSchemas);
  writeFile(
    path.join(projectRoot, "tests", "tests-api", `${serviceName}.spec.ts`),
    specContent,
    args.dryRun,
  );

  // 6. Flow test files (one per detected flow)
  if (flows.length > 0) {
    console.error(`\nGenerating flow test files (${flows.length} flows)...`);
    for (const flow of flows) {
      const flowFileName = `${serviceName}.flow.${toCamelCase(flow.flowName)}.spec.ts`;
      const flowContent = generateFlowSpecFile(flow, serviceName, spec);
      writeFile(
        path.join(projectRoot, "tests", "tests-api", "flows", flowFileName),
        flowContent,
        args.dryRun,
      );
    }
  }

  const flowNote = flows.length > 0
    ? `\n  + ${flows.length} flow spec(s) in tests/tests-api/flows/`
    : `\n  No cross-endpoint flows detected.`;

  console.error(`\n✓ Done. Generated ${endpoints.length} endpoints across 5 files.${flowNote}`);
  console.error(
    `\nRun endpoint tests:\n  npx playwright test -c playwright.api.config.ts tests/tests-api/${serviceName}.spec.ts`,
  );
  if (flows.length > 0) {
    console.error(
      `Run flow tests:\n  npx playwright test -c playwright.api.config.ts tests/tests-api/flows/`,
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
