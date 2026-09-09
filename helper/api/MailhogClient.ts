/**
 * MailhogClient.ts
 *
 * Helper for reading emails captured by Mailhog during API tests.
 * Used for flows that require data extracted from emails — OTP codes,
 * verification links, activation tokens, magic links, etc.
 *
 * Prerequisites:
 *   - Mailhog must be running and accessible from the test runner.
 *   - Add a "mailhog" key to config/<NODE_ENV>.json:
 *
 *     No auth (default Mailhog):
 *       "mailhog": { "url": "http://mailhog.<env>.squads-dev.com" }
 *
 *     Basic auth (if Mailhog is behind HTTP Basic Auth):
 *       "mailhog": {
 *         "url": "http://mailhog.<env>.squads-dev.com",
 *         "basicUser": "mailhog-user",
 *         "basicPassword": "mailhog-pass"
 *       }
 *
 * Basic usage:
 *   const mailhog = MailhogClient.fromEnv();
 *   const email   = await mailhog.waitForEmail("user@example.com");
 *   const otp     = mailhog.extractOtp(email);  // e.g. "482910"
 *
 * Full flow example in a Playwright test:
 *   test("verifies OTP after registration", async () => {
 *     const sentAt = new Date();
 *     await client.registerUser(registerUserPayload({ email: "test@example.com", organizationId: orgId }));
 *
 *     const mailhog = MailhogClient.fromEnv();
 *     const email = await mailhog.waitForEmail("test@example.com", 30_000, sentAt);
 *     const otp   = mailhog.extractOtp(email);
 *     expect(otp).not.toBeNull();
 *
 *     const { status } = await client.verifyOtp(verifyOtpPayload({ otp, organizationId: orgId }));
 *     expect(status).toBe(200);
 *   });
 */

import axios, { type AxiosInstance } from "axios";
import { APIClient } from "./APIClient";

// ── Mailhog API types ─────────────────────────────────────────────────────────

export interface MailhogAddress {
  Relpath: string;
  Mailbox: string;
  Domain: string;
  Params: string;
}

export interface MailhogContent {
  Headers: Record<string, string[]>;
  Body: string;
  Size: number;
  MIME: { Parts: MailhogContent[] } | null;
}

export interface MailhogMessage {
  ID: string;
  From: MailhogAddress;
  To: MailhogAddress[];
  Content: MailhogContent;
  Created: string; // ISO 8601
  MIME: null | unknown;
  Raw: { From: string; To: string[]; Data: string; Helo: string };
}

export interface MailhogSearchResult {
  total: number;
  count: number;
  start: number;
  items: MailhogMessage[];
}

// ── Client ────────────────────────────────────────────────────────────────────

export class MailhogClient {
  private readonly baseUrl: string;
  private readonly pollIntervalMs: number;
  /** Pre-configured axios instance — carries Basic Auth header when credentials are set */
  private readonly http: AxiosInstance;

  /**
   * @param baseUrl        Mailhog base URL, e.g. "http://mailhog.develop.squads-dev.com"
   * @param auth           Optional Basic Auth credentials `{ username, password }`.
   *                       If omitted, requests are sent without an Authorization header
   *                       (works for default open Mailhog instances).
   * @param pollIntervalMs How often to poll when waiting for an email (default: 1 000 ms)
   */
  constructor(
    baseUrl: string,
    auth?: { username: string; password: string },
    pollIntervalMs = 1_000,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.pollIntervalMs = pollIntervalMs;

    // Build a dedicated axios instance so every request automatically carries
    // the correct Authorization header (or none, if no credentials were given).
    this.http = axios.create({
      baseURL: this.baseUrl,
      ...(auth
        ? {
            headers: {
              // RFC 7617 Basic Auth: "Basic base64(user:pass)"
              Authorization:
                "Basic " +
                Buffer.from(`${auth.username}:${auth.password}`).toString("base64"),
            },
          }
        : {}),
    });
  }

  // ── Factory ─────────────────────────────────────────────────────────────────

  /**
   * Build a MailhogClient from `config/<NODE_ENV>.json`.
   *
   * Minimal config (no auth):
   *   "mailhog": { "url": "http://mailhog.<env>.squads-dev.com" }
   *
   * With Basic Auth (Mailhog behind a reverse proxy or --auth flag):
   *   "mailhog": {
   *     "url": "http://mailhog.<env>.squads-dev.com",
   *     "basicUser": "mailhog-user",
   *     "basicPassword": "mailhog-pass"
   *   }
   */
  static fromEnv(): MailhogClient {
    const envVars = APIClient.getEnvVariables();
    const cfg = envVars["mailhog"] as
      | { url?: string; basicUser?: string; basicPassword?: string }
      | undefined;

    if (!cfg?.url) {
      throw new Error(
        'MailhogClient.fromEnv(): Missing "mailhog.url" in config/<NODE_ENV>.json.\n' +
          'Add: "mailhog": { "url": "http://mailhog.<env>.squads-dev.com" }',
      );
    }

    const auth =
      cfg.basicUser && cfg.basicPassword
        ? { username: cfg.basicUser, password: cfg.basicPassword }
        : undefined;

    return new MailhogClient(cfg.url, auth);
  }

  // ── Fetch helpers ────────────────────────────────────────────────────────────

  /**
   * List all messages in Mailhog (newest first).
   */
  async getMessages(limit = 50): Promise<MailhogMessage[]> {
    const res = await this.http.get<MailhogSearchResult>(
      `/api/v2/messages?limit=${limit}`,
    );
    return res.data.items ?? [];
  }

  /**
   * Search messages by recipient email address.
   * Returns newest-first.
   */
  async getMessagesForRecipient(recipientEmail: string): Promise<MailhogMessage[]> {
    const res = await this.http.get<MailhogSearchResult>(
      `/api/v2/search?kind=to&query=${encodeURIComponent(recipientEmail)}`,
    );
    return res.data.items ?? [];
  }

  /**
   * Get the most recent message for a recipient, or null if none.
   */
  async getLatestEmail(recipientEmail: string): Promise<MailhogMessage | null> {
    const messages = await this.getMessagesForRecipient(recipientEmail);
    return messages.length > 0 ? messages[0] : null;
  }

  /**
   * Poll until a new email arrives for the given recipient.
   *
   * @param recipientEmail  Address to wait for
   * @param timeoutMs       Maximum wait time in milliseconds (default: 30 000)
   * @param afterTimestamp  Only return emails received after this time.
   *                        Pass `new Date()` just before triggering the email
   *                        to avoid picking up stale messages.
   * @throws Error if no email arrives within timeoutMs
   */
  async waitForEmail(
    recipientEmail: string,
    timeoutMs = 30_000,
    afterTimestamp?: Date,
  ): Promise<MailhogMessage> {
    const deadline = Date.now() + timeoutMs;
    const since = afterTimestamp ?? new Date(0);

    while (Date.now() < deadline) {
      const messages = await this.getMessagesForRecipient(recipientEmail);
      const fresh = messages.filter((m) => new Date(m.Created) > since);
      if (fresh.length > 0) return fresh[0];
      await new Promise((r) => setTimeout(r, this.pollIntervalMs));
    }

    throw new Error(
      `MailhogClient: No email arrived for "${recipientEmail}" within ${timeoutMs} ms`,
    );
  }

  // ── Content helpers ──────────────────────────────────────────────────────────

  /**
   * Get the plain-text body of a message.
   * Falls back to the HTML part if no plain-text part is present.
   * Falls back to the raw body for single-part messages.
   */
  getEmailBody(message: MailhogMessage): string {
    const parts = message.Content.MIME?.Parts;
    if (parts && parts.length > 0) {
      // Prefer text/plain
      for (const part of parts) {
        const ct = part.Headers?.["Content-Type"]?.[0] ?? "";
        if (ct.includes("text/plain")) return part.Body;
      }
      // Fall back to text/html
      for (const part of parts) {
        const ct = part.Headers?.["Content-Type"]?.[0] ?? "";
        if (ct.includes("text/html")) return part.Body;
      }
    }
    return message.Content.Body;
  }

  /**
   * Get the subject line of a message.
   */
  getSubject(message: MailhogMessage): string {
    return message.Content.Headers?.["Subject"]?.[0] ?? "";
  }

  /**
   * Extract a standalone numeric OTP from the email body.
   *
   * Looks for an isolated sequence of exactly `digits` digits (default: 6).
   * Returns the first match, or null if not found.
   *
   * @example
   *   mailhog.extractOtp(email)          // default 6-digit OTP
   *   mailhog.extractOtp(email, 4)       // 4-digit PIN
   */
  extractOtp(message: MailhogMessage, digits = 6): string | null {
    const body = this.getEmailBody(message);
    const regex = new RegExp(`(?<![\\d])(\\d{${digits}})(?![\\d])`);
    const match = body.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Extract a value that follows a label in the email body.
   *
   * Useful for non-numeric tokens or when the email format is consistent.
   *
   * @example
   *   mailhog.extractByLabel(email, "Verification Code")  // "482910"
   *   mailhog.extractByLabel(email, "Activation Token")   // "abc-xyz-123"
   */
  extractByLabel(message: MailhogMessage, label: string): string | null {
    const body = this.getEmailBody(message);
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escaped}[:\\s]+([\\w\\-./=+]+)`, "i");
    const match = body.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract a URL from the email body matching an optional path prefix.
   *
   * @example
   *   mailhog.extractLink(email)                          // first URL found
   *   mailhog.extractLink(email, "/verify")               // first URL containing "/verify"
   *   mailhog.extractLink(email, "/activate?token=")      // activation link
   */
  extractLink(message: MailhogMessage, pathPrefix?: string): string | null {
    const body = this.getEmailBody(message);
    const urlPattern = /https?:\/\/[^\s"'<>]+/g;
    const urls = body.match(urlPattern) ?? [];
    if (!pathPrefix) return urls[0] ?? null;
    return urls.find((u) => u.includes(pathPrefix)) ?? null;
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────────

  /**
   * Delete ALL messages from Mailhog.
   * Call in `afterAll` / `afterEach` to prevent cross-test email pollution.
   *
   * Note: Mailhog's API does not support deleting by recipient — this clears
   * the entire inbox. Run tests sequentially (--workers 1) when using Mailhog.
   */
  async clearAllMessages(): Promise<void> {
    await this.http.delete(`/api/v1/messages`);
  }
}
