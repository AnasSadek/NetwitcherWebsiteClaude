"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { site } from "@/lib/site";

const serviceOptions = [
  "Content Creation",
  "Fotoshooting",
  "Social Media",
  "Ads",
  "Website",
  "SEO",
  "Branding",
  "Support",
  "Software",
  "Print",
] as const;

function matchService(param: string | null): string {
  if (!param) return "";
  const p = param.toLowerCase();
  return (
    serviceOptions.find(
      (o) => o.toLowerCase() === p || p.includes(o.toLowerCase())
    ) ?? ""
  );
}

function Form() {
  const params = useSearchParams();
  const preselected = matchService(params.get("service"));
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Ohne Backend: Anfrage als vorbereitete E-Mail öffnen.
    // Für Produktion: hier POST an ein Formular-Backend (z. B. eigene API-Route) einsetzen.
    const subject = `Anfrage: ${data.get("service") || "Allgemein"} – ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Unternehmen: ${data.get("company") || "-"}`,
      `E-Mail: ${data.get("email")}`,
      `Telefon: ${data.get("phone") || "-"}`,
      `Leistung: ${data.get("service") || "-"}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-night-700/60 px-4 py-3 text-sm text-snow placeholder:text-mist/60 transition-colors focus:border-mint/60 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Kontaktformular">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name <span className="text-pink">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputCls} placeholder="Dein Name" />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Unternehmen
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputCls} placeholder="Dein Unternehmen" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            E-Mail <span className="text-pink">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="du@unternehmen.de" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} placeholder="+49 …" />
        </div>
      </div>
      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
          Welche Leistung interessiert dich?
        </label>
        <select id="service" name="service" defaultValue={preselected} className={inputCls}>
          <option value="">Bitte auswählen …</option>
          {serviceOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Dein Vorhaben <span className="text-pink">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputCls}
          placeholder="Erzähl uns kurz, was du vorhast – Ziel, Zielgruppe, Zeitrahmen. Zwei, drei Sätze reichen."
        />
      </div>
      <p className="text-xs leading-relaxed text-mist">
        Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Bearbeitung
        der Anfrage zu. Details in der{" "}
        <a href="/datenschutz" className="underline underline-offset-2 hover:text-snow">
          Datenschutzerklärung
        </a>
        .
      </p>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet to-sky px-8 py-3.5 font-heading text-sm font-bold tracking-wide text-night shadow-glow-violet transition-all duration-200 hover:-translate-y-0.5"
      >
        Anfrage senden
      </button>
      {sent && (
        <p role="status" className="text-sm text-mint">
          Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Alternativ
          erreichst du uns direkt per WhatsApp oder unter {site.email}.
        </p>
      )}
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-night-700/60" />}>
      <Form />
    </Suspense>
  );
}
