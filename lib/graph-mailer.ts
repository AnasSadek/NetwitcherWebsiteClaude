/**
 * Server-seitiger Microsoft-Graph-Mailer (Client-Credentials-Flow).
 *
 * WICHTIG: Diese Datei darf NIEMALS von einer "use client"-Komponente
 * importiert werden — sie liest AZURE_TENANT_ID/AZURE_CLIENT_ID/
 * AZURE_CLIENT_SECRET aus process.env und würde sonst ins Browser-Bundle
 * gelangen. Verwendung ausschließlich aus app/api/contact/route.ts (Node-
 * Runtime).
 *
 * Diagnose-Logging: jede Stufe (Token, Postfach-Check, Graph-Versand) loggt
 * ihr Ergebnis über lib/contact-logger.ts — console UND Log-Datei (Plesk/
 * Phusion Passenger zeigt stdout eines Node-Prozesses nicht zuverlässig im
 * Log Browser an). Es werden NIE Token, Authorization-Header, Secrets oder
 * vollständige Fehler-Payloads geloggt — nur HTTP-Status und die von Azure/
 * Graph gelieferten Fehlercode/-Nachricht-Felder (auf eine sichere Länge
 * gekappt).
 */

import { logContact, logContactError } from "./contact-logger";

const MAX_LOG_MESSAGE_LENGTH = 300;

/** Kappt eine Azure/Graph-Fehlermeldung auf eine sichere Länge fürs Log. */
function safeMessage(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  return value.length > MAX_LOG_MESSAGE_LENGTH ? `${value.slice(0, MAX_LOG_MESSAGE_LENGTH)}…` : value;
}

type GraphTokenResponse = { access_token: string; expires_in: number };
type AzureTokenError = { error?: string; error_description?: string };
type GraphApiError = { error?: { code?: string; message?: string } };

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Holt (oder cacht) das Client-Credentials-Access-Token. Exportiert, damit
 * app/api/contact/route.ts den Postfach-Check (verifyMailboxExists) mit
 * demselben Token ausführen kann, ohne ein zweites Mal anzufragen.
 */
export async function getGraphToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.token;
  }

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure Graph credentials are not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  logContact("[contact] requesting Microsoft access token");

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  logContact(`[contact] token status: ${res.status}`);

  if (!res.ok) {
    let parsed: AzureTokenError | undefined;
    try {
      parsed = (await res.json()) as AzureTokenError;
    } catch {
      // Body wasn't JSON — status code alone still gets logged above.
    }
    const code = safeMessage(parsed?.error) ?? "unknown";
    const message = safeMessage(parsed?.error_description) ?? "no error description returned";
    logContactError(`[contact] token error code: ${code}`);
    logContactError(`[contact] token error message: ${message}`);
    throw new Error(`Graph token request failed with status ${res.status}`);
  }

  logContact("[contact] token acquired successfully");

  const data = (await res.json()) as GraphTokenResponse;
  cachedToken = { token: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return data.access_token;
}

/**
 * Rein diagnostisch: prüft per GET /users/{mailbox}, ob MAIL_FROM als
 * Microsoft-Graph-Benutzer auflösbar ist. Wirft NIE — ein Fehler hier
 * (z. B. fehlende User.Read-Berechtigung) darf den eigentlichen Mailversand
 * nicht verhindern, er wird nur geloggt. Fragt bewusst nur `id` ab, um keine
 * unnötigen Nutzerdaten zu übertragen/loggen.
 */
export async function verifyMailboxExists(token: string, mailbox: string): Promise<void> {
  try {
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}?$select=id`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (res.status === 200) {
      logContact(`[contact] mailbox check: ${mailbox} exists: true`);
    } else if (res.status === 404) {
      logContact(`[contact] mailbox check: ${mailbox} exists: false`);
    } else {
      logContact(`[contact] mailbox check: could not verify ${mailbox} (status ${res.status})`);
    }
  } catch (err) {
    logContact(
      `[contact] mailbox check: request failed for ${mailbox}: ${
        err instanceof Error ? (safeMessage(err.message) ?? "unknown error") : "unknown error"
      }`
    );
  }
}

export type GraphRecipient = { address: string; name?: string };

export async function sendGraphMail(params: {
  subject: string;
  html: string;
  to: GraphRecipient[];
  replyTo?: GraphRecipient[];
  /** Nur fürs Log — unterscheidet interne Benachrichtigung von Kundenbestätigung. */
  logLabel?: string;
}): Promise<void> {
  const mailFrom = process.env.MAIL_FROM;
  if (!mailFrom) {
    throw new Error("MAIL_FROM is not configured");
  }

  const token = await getGraphToken();

  const payload = {
    message: {
      subject: params.subject,
      body: { contentType: "HTML", content: params.html },
      toRecipients: params.to.map((r) => ({ emailAddress: { address: r.address, name: r.name } })),
      ...(params.replyTo?.length
        ? { replyTo: params.replyTo.map((r) => ({ emailAddress: { address: r.address, name: r.name } })) }
        : {}),
    },
    saveToSentItems: false,
  };

  logContact(`[contact] sending ${params.logLabel ?? "internal"} email through Microsoft Graph`);

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailFrom)}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  logContact(`[contact] graph status: ${res.status}`);

  if (!res.ok) {
    let parsed: GraphApiError | undefined;
    try {
      parsed = (await res.json()) as GraphApiError;
    } catch {
      // Body wasn't JSON — status code alone still gets logged above.
    }
    const code = safeMessage(parsed?.error?.code) ?? "unknown";
    const message = safeMessage(parsed?.error?.message) ?? "no error message returned";
    logContactError(`[contact] graph error code: ${code}`);
    logContactError(`[contact] graph error message: ${message}`);
    throw new Error(`Graph sendMail failed with status ${res.status}${code !== "unknown" ? ` (${code})` : ""}`);
  }
}
