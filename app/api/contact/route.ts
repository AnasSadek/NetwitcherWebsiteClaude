import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Empfängt die Anfrage-Formular-Daten aus components/contact/InquiryFlow.tsx
 * und verschickt sie serverseitig per E-Mail (Resend) — kein mailto:, kein
 * Öffnen eines lokalen Mailprogramms. Erfordert RESEND_API_KEY (und optional
 * CONTACT_FROM_EMAIL für eine verifizierte Absenderadresse) als Umgebungs-
 * variable; ohne Schlüssel liefert die Route einen klaren 500er statt eines
 * Absturzes, damit der Client eine Fehlermeldung anzeigen kann.
 */

const TO_EMAIL = "mazenwaraq@gmail.com";

type ContactPayload = {
  service?: string;
  message?: string;
  timeline?: string;
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  budget?: string;
  contactMethod?: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { service, message, timeline, name, email, company, phone, budget, contactMethod } = payload;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot send contact form email.");
    return NextResponse.json({ ok: false, error: "Email service is not configured." }, { status: 500 });
  }

  const subject = `New request from website form: ${service?.trim() || "General inquiry"}`;

  const lines: string[] = [`Name: ${name}`, `Email address: ${email}`];
  if (phone?.trim()) lines.push(`Phone number: ${phone}`);
  if (company?.trim()) lines.push(`Company: ${company}`);
  lines.push(`Requested service: ${service?.trim() || "-"}`);
  if (budget?.trim()) lines.push(`Budget: ${budget}`);
  lines.push(`Timeline: ${timeline?.trim() || "-"}`);
  lines.push(`Preferred contact method: ${contactMethod?.trim() || "-"}`);
  lines.push("", "Message:", message);

  const text = lines.join("\n");
  const html = `<pre style="font-family: inherit; white-space: pre-wrap;">${escapeHtml(text)}</pre>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Netwitcher Website <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Failed to send the request." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ ok: false, error: "Failed to send the request." }, { status: 500 });
  }
}
