/**
 * HTML-E-Mail-Vorlagen für die interne Benachrichtigung (info@netwitcher.com)
 * und die Eingangsbestätigung an den Kunden. Reines Templating, kein Secret-
 * Zugriff — unbedenklich, falls versehentlich importiert, aber gehört
 * inhaltlich zur serverseitigen Kontaktformular-Logik.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

const WRAP_START = (dir: "ltr" | "rtl", align: "left" | "right") => `<!doctype html>
<html lang="${dir === "rtl" ? "ar" : "de"}" dir="${dir}">
  <body style="margin:0;padding:0;background:#f2eeff;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e9e3ff;text-align:${align};">
        <p style="margin:0 0 24px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#8b5cf6;">Netwitcher</p>`;

const WRAP_END = `
      </div>
    </div>
  </body>
</html>`;

function field(label: string, value: string): string {
  return `
        <p style="margin:0 0 3px;font-size:12px;font-weight:700;color:#6b6191;">${escapeHtml(label)}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:#150a33;">${escapeHtml(value) || "-"}</p>`;
}

export function internalInquiryEmailHtml(params: {
  locale: "de" | "ar";
  serviceLabel: string;
  timingLabel: string;
  message: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: string;
}): string {
  const isAr = params.locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const align = isAr ? "right" : "left";

  return `${WRAP_START(dir, align)}
        <h1 style="margin:0 0 24px;font-size:20px;color:#150a33;">${isAr ? "طلب مشروع جديد" : "Neue Projektanfrage"}</h1>
        ${field(isAr ? "الموضوع" : "Thema", params.serviceLabel)}
        ${field(isAr ? "الإطار الزمني" : "Zeitrahmen", params.timingLabel)}
        <p style="margin:0 0 3px;font-size:12px;font-weight:700;color:#6b6191;">${escapeHtml(isAr ? "تفاصيل المشروع" : "Projektbeschreibung")}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#150a33;">${escapeMultiline(params.message)}</p>
        <hr style="border:none;border-top:1px solid #e9e3ff;margin:8px 0 24px;" />
        <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#150a33;">${isAr ? "بيانات العميل" : "Kontaktdaten"}</p>
        ${field(isAr ? "الاسم" : "Name", params.name)}
        ${field(isAr ? "الشركة" : "Unternehmen", params.company)}
        ${field(isAr ? "البريد الإلكتروني" : "E-Mail", params.email)}
        ${field(isAr ? "الهاتف" : "Telefon", params.phone)}
        ${field(isAr ? "طريقة التواصل المفضلة" : "Bevorzugter Kontakt", params.preferredContact)}${WRAP_END}`;
}

export function customerConfirmationEmailHtml(params: { locale: "de" | "ar"; name: string }): string {
  const isAr = params.locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const align = isAr ? "right" : "left";
  const name = escapeHtml(params.name);

  const paragraphs = isAr
    ? [
        `مرحبًا ${name}،`,
        "شكرًا لتواصلك مع Netwitcher.",
        "لقد استلمنا طلبك وسنراجع التفاصيل ونتواصل معك في أقرب وقت ممكن.",
        "مع تحيات فريق<br>Netwitcher",
        "سحرٌ في كل نقرة.",
      ]
    : [
        `Hallo ${name},`,
        "vielen Dank für deine Anfrage bei Netwitcher.",
        "Wir haben deine Nachricht erhalten, prüfen die Details und melden uns so schnell wie möglich bei dir.",
        "Viele Grüße<br>Netwitcher",
        "Magic in Every Click",
      ];

  const body = paragraphs
    .map((p) => `<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#150a33;">${p}</p>`)
    .join("");

  return `${WRAP_START(dir, align)}${body}${WRAP_END}`;
}
