# WordPress-Machbarkeitstest: Next.js/Vercel vs. WordPress-Theme

**Status:** Experiment. Die WordPress-Umsetzung liegt getrennt unter
`wordpress-theme/netwitcher-next/`, ist nicht deployt und ersetzt nichts.
Produktion bleibt die Next.js-App (Vercel). Migration nur nach ausdrücklicher Freigabe.

> Ergebnisse, Messwerte und Empfehlung: siehe Abschnitte 4–7 (werden nach den Messläufen ergänzt).

## 1. Ausgangslage: Architektur der Next.js-Seite

| Baustein | Umsetzung heute | Bedeutung für WordPress |
| --- | --- | --- |
| Routing/Rendering | Next.js 15 App Router, alle Seiten statisch vorgerendert (SSG), Vercel Edge/CDN | WP rendert PHP pro Request; braucht Full-Page-Cache + CDN, um gleichzuziehen |
| Styling | Tailwind CSS 4 (`@theme`-Tokens in `app/globals.css`), Container Queries (`@container`, `cqw`) | 1:1 übernehmbar: gleiche Tokens, gleiche Klassen, Build per Tailwind-CLI |
| Schriften | `next/font/local` (EP Boxi, Oxanium, Nunito Sans), Preload, `font-display: swap` | `@font-face` + `<link rel=preload>` im Theme, gleiche Dateien |
| Bilder | statische AVIF/WebP-Paare, `<picture>`; Portfolio mit `next/image` | `<picture>` identisch; `next/image` → `<img srcset>`/CSS-Platzhalter |
| Bewegung | Framer Motion 12 (Springs, `useMotionTemplate`, `AnimatePresence`, `layout`) in Hero, Header, Reveal, Portfolio-Filter, Kontakt-Flow | kein 1:1-Port möglich; Ersatz: eigene Spring-Physik (JS, ~90 Zeilen) + CSS-Keyframes |
| WITCH-Hero | `HeroStage.tsx` (654 Zeilen): 3 Federn, Blick, Idle, Touch, Scroll, Tilt, Aufwachen, Verschluss; `HeadTurn.tsx`: Canvas-Frame-Sequenz (61 WebP-Frames, ImageBitmap, Nachbar-Crossfade) | Logik ist reines Browser-JS; React/Framer sind nur Träger → portierbar |
| Inhalte | TypeScript-Module (`lib/*.ts`): Services, Cases, Blog, Portfolio, Medien | JSON-Export → Theme-Daten; Portfolio/Blog als echte WP-Inhalte (CPT + Meta, Posts) |
| SEO | `metadata`-Objekte, `sitemap.ts`, `robots.ts`, dynamische OG-Bilder (`next/og`) | Titel/Meta/OG/JSON-LD im Theme ohne Plugin; OG-Bilder nur statisch |
| Kontakt | `InquiryFlow.tsx` (493 Zeilen, 3 Schritte, Mailto/WhatsApp-Übergabe) | Vanilla-JS-Port |

### Einfach (Aufwand gering, Ergebnis identisch)
- Layout, Farben, Typografie, Abstände: Tailwind-Klassen werden unverändert in PHP-Templates übernommen; das CSS ist byte-ähnlich.
- Header, Footer, Buttons, Karten, Reveal-Einblendungen, Section-Headings: kleine PHP-Helfer ersetzen die React-Komponenten.
- Statische Seiten (Leistungen, Studio, Über uns, FekraHub, Impressum/Datenschutz/AGB), Blog, 404.
- SEO-Basis (Titel, Description, Canonical, OG, JSON-LD, `noindex` für Rechtstexte).

### Mittel
- Portfolio: Custom Post Type + Taxonomie + Meta; Filter mit URL-Sync, Video-Player (lokal/YouTube/Vimeo), Boxi-Titel-Fitting.
- Kontakt-Flow (Schritte, Validierung, `?service=`-Vorauswahl, Zusammenfassung).
- Content-Pflege: Was heute in `lib/*.ts` liegt, muss in WP-Felder (ACF/Meta) oder bleibt im Theme (dann kein Redaktionsvorteil).

### Schwer / Risiko
- Framer-Motion-Feeling: Spring-Physik, Velocity-basiertes Lehnen, `AnimatePresence`, `layout`-FLIP müssen von Hand nachgebaut werden. Machbar (siehe `src/js/spring.js`), aber jede künftige Animation kostet in WP mehr Entwicklungszeit als in React.
- HeadTurn-Canvas: 1:1 portiert, identisches Laufzeitverhalten; Risiko liegt nicht im Port, sondern in der Pflege ohne Typen/Tests.
- Performance-Parität hängt in WP vollständig vom Hosting ab (PHP-Cache, Full-Page-Cache, CDN, Brotli, HTTP/2). Vercel liefert das ohne Konfiguration.
- Dynamische OG-Bilder (`next/og`) und der `sitemap.ts`-Automatismus haben in WP kein Pendant ohne Plugin.
- Plugin-/Update-Pflege, Sicherheitsfläche (Login, XML-RPC, REST), Datenbank-Betrieb: neue Betriebskosten, die Vercel-Static nicht hat.

## 2. Was gebaut wurde

`wordpress-theme/netwitcher-next/` (eigenständiges Classic-Theme, kein Page-Builder, keine Plugins):

- `inc/`: Datenlader (JSON aus `lib/*.ts` via `tools/export-data.ts`), Helfer = React-Komponenten, Assets, SEO, CPT `portfolio`, Seeding (legt alle Seiten/Posts/Projekte bei Aktivierung an).
- `src/app.css` → Tailwind v4 (identische `@theme`-Tokens + CSS für JS-Zustände), `src/js/*.js` → ES-Module-Bundles (esbuild): `site.js` (Header, Reveal, Journey), `hero.js` (WITCH + HeadTurn), `portfolio.js`, `inquiry.js`.
- Templates für alle Routen der Next.js-Seite (Start, Leistungen + 9 Unterseiten, Studio, Über uns, Projekte, FekraHub, Portfolio-Index + Detail, Blog-Index + Beiträge, Kontakt, Impressum, Datenschutz, AGB, 404).

## 3. Messmethodik

- Lokal, gleiche Maschine, gleicher Chromium (Playwright 1194) bzw. Lighthouse 13.4.1.
- Next.js: `next build` + `next start` (Port 3100; komprimiert, Cache-Header wie Vercel).
- WordPress 7.1 + PHP 8.4 (Built-in-Server, SQLite) hinter einem Gzip-Reverse-Proxy (Port 8081), der das nachbildet, was jeder WP-Host tut (Gzip, Cache-Header). Kein Objekt-/Seiten-Cache, d. h. WP wird eher konservativ gemessen.
- Lighthouse: je Seite × Formfaktor drei Läufe, Median. Mobile = Moto-G-Profil mit 4× CPU-Drossel, Desktop ungedrosselt.
- Hero-Interaktion: Playwright, 4 s schnelle Mausbewegung über den ganzen Viewport, rAF-Sampling (FPS, lange Frames > 20 ms, p95), Eingabe→Sichtbarkeit (pointermove → Änderung der Augen-Transformation), Anzahl geladener HeadTurn-Frames; Mobile-Emulation (Pixel 7): kein Canvas, keine Frame-Downloads.
- Cross-Browser: Chromium (= Edge, gleiche Engine), Firefox 1490, WebKit 2203 (= Safari-Engine) × Desktop-XL 1920, Laptop 1366, Tablet 820, Mobile 390; Screenshot-Vergleich WP vs. Next per pixelmatch, Hero-Reaktionstest.
