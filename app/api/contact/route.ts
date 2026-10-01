import { NextRequest, NextResponse } from "next/server";
import { INQUIRY_TOPICS, INQUIRY_TIMINGS } from "@/lib/inquiry-options";
import { sendGraphMail, getGraphToken, verifyMailboxExists } from "@/lib/graph-mailer";
import { internalInquiryEmailHtml, customerConfirmationEmailHtml } from "@/lib/inquiry-email";

/**
 * Kontaktformular-Endpunkt: nimmt die Angaben des 3-Schritte-Formulars
 * (components/contact/InquiryFlow.tsx) entgegen, validiert sie serverseitig
 * erneut und verschickt die Anfrage über Microsoft Graph (Client-Credentials-
 * Flow) von noreply@netwitcher.com an info@netwitcher.com, mit Reply-To auf
 * die E-Mail des Kunden. Danach – best effort, ohne die Antwort zu
 * beeinflussen – eine kurze Eingangsbestätigung an den Kunden.
 *
 * Node-Runtime (nicht Edge): läuft hinter Plesk als normaler Next-Server,
 * und der In-Memory-Zustand für Rate-Limit/Duplikat-Schutz unten setzt einen
 * einzelnen, langlebigen Prozess voraus.
 */
export const runtime = "nodejs";

type Locale = "de" | "ar";

const MAX_LENGTHS = { name: 200, email: 200, company: 200, phone: 50, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Leichte, prozessinterne Schutzmaßnahmen (kein sichtbares CAPTCHA gefordert).
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitBuckets.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitBuckets.set(ip, timestamps);
  if (rateLimitBuckets.size > 1000) {
    for (const [key, times] of rateLimitBuckets) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitBuckets.delete(key);
    }
  }
  return false;
}

const DEDUPE_WINDOW_MS = 2 * 60 * 1000;
const dedupeStore = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const last = dedupeStore.get(key);
  return typeof last === "number" && Date.now() - last < DEDUPE_WINDOW_MS;
}

function markSubmitted(key: string) {
  dedupeStore.set(key, Date.now());
  if (dedupeStore.size > 500) {
    const cutoff = Date.now() - DEDUPE_WINDOW_MS;
    for (const [k, t] of dedupeStore) if (t < cutoff) dedupeStore.delete(k);
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// ---------------------------------------------------------------------------
// Validierung
// ---------------------------------------------------------------------------

type ContactBody = {
  locale?: unknown;
  topicId?: unknown;
  timingId?: unknown;
  message?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  hp?: unknown; // Honeypot — muss leer bleiben
};

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function validate(body: ContactBody, locale: Locale): boolean {
  if (!isNonEmptyString(body.name, MAX_LENGTHS.name)) return false;
  if (typeof body.email !== "string") return false;
  const email = body.email.trim();
  if (!EMAIL_RE.test(email) || email.length > MAX_LENGTHS.email) return false;
  if (typeof body.topicId !== "string" || !INQUIRY_TOPICS[locale].some((t) => t.id === body.topicId)) return false;
  if (!isNonEmptyString(body.message, MAX_LENGTHS.message)) return false;
  if (typeof body.company === "string" && body.company.length > MAX_LENGTHS.company) return false;
  if (typeof body.phone === "string" && body.phone.length > MAX_LENGTHS.phone) return false;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  console.log("[contact] request received");
  console.log("[contact] env check:", {
    AZURE_TENANT_ID: Boolean(process.env.AZURE_TENANT_ID),
    AZURE_CLIENT_ID: Boolean(process.env.AZURE_CLIENT_ID),
    AZURE_CLIENT_SECRET: Boolean(process.env.AZURE_CLIENT_SECRET),
    MAIL_FROM: Boolean(process.env.MAIL_FROM),
    CONTACT_RECIPIENT_EMAIL: Boolean(process.env.CONTACT_RECIPIENT_EMAIL),
  });

  try {
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json().catch(() => null)) as ContactBody | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }

    // Honeypot: sichtbar nur für Bots (im Formular per CSS unsichtbar).
    // Ausgefüllt -> so tun, als sei alles gut, aber nichts verschicken.
    if (typeof body.hp === "string" && body.hp.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const locale: Locale = body.locale === "ar" ? "ar" : "de";

    if (!validate(body, locale)) {
      return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
    }

    const name = (body.name as string).trim();
    const email = (body.email as string).trim();
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = (body.message as string).trim();
    const topicId = body.topicId as string;

    const dedupeKey = [ip, email, topicId, message].join("|");
    if (isDuplicate(dedupeKey)) {
      return NextResponse.json({ ok: true });
    }

    const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
    if (!recipient) {
      throw new Error("CONTACT_RECIPIENT_EMAIL is not configured");
    }

    const topic = INQUIRY_TOPICS[locale].find((t) => t.id === topicId)!;
    const timing = INQUIRY_TIMINGS[locale].find((t) => t.id === body.timingId);
    const timingLabel = timing?.label ?? (locale === "ar" ? "غير محدد" : "offen");
    const preferredContact = phone
      ? locale === "ar"
        ? "الهاتف"
        : "Telefon"
      : locale === "ar"
        ? "البريد الإلكتروني"
        : "E-Mail";

    const mailFrom = process.env.MAIL_FROM;
    if (mailFrom) {
      // Diagnostisch, nie blockierend: holt das Token einmal explizit (damit
      // Token-Stufe und Postfach-Check sauber vor dem eigentlichen Versand
      // im Log auftauchen) und loggt, ob MAIL_FROM als Graph-Nutzer auflösbar
      // ist. sendGraphMail() nutzt danach denselben gecachten Token.
      try {
        const token = await getGraphToken();
        await verifyMailboxExists(token, mailFrom);
      } catch {
        // Fehler ist bereits in getGraphToken() geloggt; der eigentliche
        // Sendeversuch unten holt das Token erneut und wirft/loggt dann.
      }
    }

    const subject = locale === "ar" ? `طلب جديد: ${topic.label}` : `Neue Anfrage: ${topic.label}`;
    const html = internalInquiryEmailHtml({
      locale,
      serviceLabel: topic.label,
      timingLabel,
      message,
      name,
      company,
      email,
      phone,
      preferredContact,
    });

    await sendGraphMail({
      subject,
      html,
      to: [{ address: recipient }],
      replyTo: [{ address: email, name }],
      logLabel: "internal",
    });

    // Nur bei Erfolg der internen Mail markieren -> ein fehlgeschlagener
    // Versuch darf sofort erneut probiert werden, kein Duplikat-Block.
    markSubmitted(dedupeKey);

    // Bestätigung an den Kunden: best effort. Ein Fehler hier darf die
    // bereits erfolgreich zugestellte interne Anfrage nicht rückgängig machen.
    try {
      const confirmSubject =
        locale === "ar" ? "استلمنا طلبك – Netwitcher" : "Wir haben deine Anfrage erhalten – Netwitcher";
      const confirmHtml = customerConfirmationEmailHtml({ locale, name });
      await sendGraphMail({
        subject: confirmSubject,
        html: confirmHtml,
        to: [{ address: email, name }],
        logLabel: "confirmation",
      });
    } catch (confirmError) {
      console.error("[contact] confirmation email failed", {
        timestamp: new Date().toISOString(),
        message: confirmError instanceof Error ? confirmError.message : "unknown error",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] submission failed", {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
