# Netwitcher – Website

**Magic in Every Click ✦** – Premium-Website der Netwitcher Digital Agency & des
Content-Studios Berlin. Dunkles, animiertes Design auf Basis der fünf Logo-Pfeile,
komplett auf Deutsch, conversion-optimiert.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** – Design-Tokens in `app/globals.css` (`@theme`)
- **Framer Motion 12** – Scroll-Reveals, Maus-Parallax, Stern-Assembly
- **SVG-Pfeilsystem** – die fünf Logo-Pfeile als wiederverwendbare Komponenten
- Lokale variable Fonts (Orbitron für Headings, Space Grotesk für Fließtext)

## Lokal starten

```bash
npm install
npm run dev        # → http://localhost:3000
```

Produktion:

```bash
npm run build
npm start
```

## Generierte Medien (Higgsfield)

Hero-Video-Loop und Studio-Bilder wurden mit Higgsfield generiert und werden
aktuell vom Higgsfield-CDN geladen (`lib/media.ts`). **Empfohlen vor dem Livegang:**

```bash
npm run fetch-media
```

Das lädt alle Dateien nach `public/media/` und stellt `lib/media.ts` automatisch
auf lokale Pfade um. Danach kann der `remotePatterns`-Eintrag in
`next.config.mjs` entfernt werden.

## Vor dem Livegang ausfüllen (Platzhalter)

| Wo | Was |
|---|---|
| `lib/site.ts` | Telefonnummer, WhatsApp-Nummer, Straße/PLZ, Calendly-URL, Social-Links |
| `app/impressum/page.tsx` | Name der Inhaber:in, USt-IdNr. |
| `app/datenschutz/page.tsx` | Hosting-Anbieter, ggf. Analytics/Pixel-Abschnitt |
| `app/agb/page.tsx` | Rechtlich prüfen lassen |
| `lib/cases.ts` | Echte Kunden, Kennzahlen und Projektbilder ergänzen |
| `components/ContactForm.tsx` | Formular-Backend anbinden (derzeit `mailto:`-Fallback) |

## Struktur

```
app/                  Seiten (App Router)
  page.tsx            Startseite (10 Sektionen)
  leistungen/         Übersicht + 9 Service-Seiten aus lib/services.ts
  studio/             Content Creation & Studio Berlin (Signature-Seite)
  projekte/           Portfolio / Case Studies
  ueber-uns/          Über uns
  produkte/fekrahub/  Produktseite FekraHub
  blog/               Blog-Index + Artikel aus lib/blog.ts
  kontakt/            Formular, WhatsApp, Calendly
  impressum|datenschutz|agb/  Rechtliches
components/           UI-Bausteine (Pfeile, Karten, Header, Formulare …)
lib/                  Inhalte & Konfiguration (Copy lebt hier!)
docs/                 Sitemap, Wireframe, Design-System, Animationsplan
scripts/              fetch-media.mjs
```

Alle deutschen Texte liegen zentral in `lib/` (services, cases, packages, blog) –
Copy-Änderungen brauchen keinen Komponenten-Code.

## Design-System & Animationen

Siehe `docs/03-design-system.md` und `docs/04-arrow-animation-plan.md`.
Kurzfassung: Night-Hintergrund `#06060F`, Akzente Mint `#2EE6C8`, Violet
`#8B5CF6`, Pink `#F468A8`, Sun `#F5D33D`, Sky `#0FB9F2`. Alle Animationen
respektieren `prefers-reduced-motion`.
