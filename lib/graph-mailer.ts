/**
 * Server-seitiger Microsoft-Graph-Mailer (Client-Credentials-Flow).
 *
 * WICHTIG: Diese Datei darf NIEMALS von einer "use client"-Komponente
 * importiert werden — sie liest AZURE_TENANT_ID/AZURE_CLIENT_ID/
 * AZURE_CLIENT_SECRET aus process.env und würde sonst ins Browser-Bundle
 * gelangen. Verwendung ausschließlich aus app/api/contact/route.ts (Node-
 * Runtime). Es werden nie Token, Authorization-Header oder Secrets geloggt —
 * Fehler geben höchstens HTTP-Status und Graph-Fehlercode weiter.
 */

type GraphTokenResponse = { access_token: string; expires_in: number };

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getGraphToken(): Promise<string> {
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

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Graph token request failed with status ${res.status}`);
  }

  const data = (await res.json()) as GraphTokenResponse;
  cachedToken = { token: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return data.access_token;
}

export type GraphRecipient = { address: string; name?: string };

export async function sendGraphMail(params: {
  subject: string;
  html: string;
  to: GraphRecipient[];
  replyTo?: GraphRecipient[];
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

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailFrom)}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    let code: string | undefined;
    try {
      const errBody = (await res.json()) as { error?: { code?: string } };
      code = errBody?.error?.code;
    } catch {
      // Response body wasn't JSON — ignore, status alone is enough context.
    }
    throw new Error(`Graph sendMail failed with status ${res.status}${code ? ` (${code})` : ""}`);
  }
}
