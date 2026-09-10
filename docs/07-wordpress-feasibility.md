# WordPress-Machbarkeitstest: Next.js/Vercel vs. WordPress-Theme

**Status:** Experiment. Die WordPress-Umsetzung liegt getrennt unter
`wordpress-theme/netwitcher-next/`, ist nicht deployt und ersetzt nichts.
Produktion bleibt die Next.js-App (Vercel). Migration nur nach ausdrücklicher Freigabe.


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

## 4. Ergebnisse: Ladeleistung (Lighthouse 13.4.1, Median aus 3 Läufen)

Werte: WordPress / Next.js. Alle Läufe einzeln in `bench/` der Sitzung; Streuung der Performance-Scores lag bei ±1 Punkt, LCP bei ±5 %.

#### Mobile (Moto G, 4× CPU-Drossel, Slow 4G)
| Seite | Perf WP / Next | FCP ms | LCP ms | TBT ms | CLS | Speed Index | Bytes gesamt kB | JS kB | Requests | Main-Thread ms |
|---|---|---|---|---|---|---|---|---|---|---|
| / | **99** / 94 | 1107 / 907 | 1960 / 3024 | 24 / 57 | 0 / 0 | 1107 / 907 | 132 / 337 | 6 / 185 | 9 / 20 | 2139 / 2168 |
| /portfolio | **100** / 93 | 1116 / 1061 | 1661 / 3195 | 0 / 105 | 0 / 0 | 1116 / 1226 | 102 / 323 | 4 / 196 | 8 / 24 | 408 / 1424 |
| /portfolio/frida-eu | **100** / 94 | 968 / 1059 | 1515 / 3074 | 0 / 82 | 0 / 0 | 968 / 1059 | 99 / 322 | 4 / 196 | 8 / 24 | 369 / 1142 |
| /leistungen | **100** / 94 | 950 / 1060 | 1663 / 3046 | 0 / 75 | 0 / 0 | 950 / 1060 | 96 / 315 | 1 / 179 | 7 / 20 | 328 / 1057 |
| /leistungen/webdesign-ecommerce | **100** / 94 | 963 / 1059 | 1514 / 2904 | 0 / 110 | 0 / 0 | 963 / 1059 | 97 / 318 | 1 / 185 | 7 / 21 | 340 / 1046 |
| /studio | **100** / 92 | 998 / 1063 | 1813 / 3171 | 0 / 138 | 0 / 0 | 998 / 1063 | 136 / 344 | 1 / 185 | 8 / 21 | 442 / 1343 |
| /kontakt | **100** / 98 | 911 / 1059 | 1658 / 2305 | 0 / 92 | 0 / 0 | 911 / 1059 | 97 / 290 | 3 / 184 | 8 / 18 | 285 / 687 |
| /blog | **100** / 95 | 987 / 1060 | 1513 / 2763 | 0 / 106 | 0 / 0 | 987 / 1060 | 92 / 304 | 1 / 179 | 7 / 20 | 313 / 1053 |

#### Desktop (ungedrosselt)
| Seite | Perf WP / Next | FCP ms | LCP ms | TBT ms | CLS | Speed Index | Bytes gesamt kB | JS kB | Requests | Main-Thread ms |
|---|---|---|---|---|---|---|---|---|---|---|
| / | **100** / 100 | 294 / 244 | 609 / 611 | 0 / 0 | 0 / 0 | 311 / 261 | 1676 / 1959 | 6 / 205 | 70 / 94 | 321 / 568 |
| /portfolio | **100** / 100 | 296 / 289 | 415 / 781 | 0 / 0 | 0 / 0 | 296 / 293 | 102 / 393 | 4 / 207 | 8 / 35 | 143 / 381 |
| /portfolio/frida-eu | **100** / 100 | 261 / 289 | 370 / 773 | 0 / 0 | 0 / 0 | 307 / 339 | 99 / 381 | 4 / 207 | 8 / 34 | 92 / 377 |
| /leistungen | **100** / 100 | 271 / 294 | 372 / 749 | 0 / 0 | 0 / 0 | 271 / 298 | 96 / 421 | 1 / 202 | 7 / 34 | 106 / 326 |
| /leistungen/webdesign-ecommerce | **100** / 100 | 259 / 288 | 367 / 745 | 0 / 0 | 0 / 0 | 259 / 288 | 97 / 376 | 1 / 202 | 7 / 30 | 125 / 322 |
| /studio | **100** / 100 | 265 / 289 | 433 / 817 | 0 / 0 | 0 / 0 | 300 / 314 | 198 / 466 | 1 / 202 | 10 / 32 | 145 / 333 |
| /kontakt | **100** / 100 | 259 / 288 | 372 / 565 | 0 / 0 | 0 / 0 | 259 / 288 | 97 / 364 | 3 / 205 | 8 / 32 | 74 / 248 |
| /blog | **100** / 100 | 256 / 289 | 375 / 713 | 0 / 0 | 0 / 0 | 256 / 289 | 92 / 388 | 1 / 202 | 7 / 32 | 98 / 302 |


Lesart:
- **Desktop:** beide 100/100, LCP/FCP innerhalb der Messstreuung (Startseite 609 vs. 611 ms). WP ist auf Unterseiten bei LCP schneller (≈370 vs. ≈750 ms), weil kein 200-kB-Framework geparst werden muss, bevor Bilder priorisiert werden.
- **Mobile:** WP 99–100, Next.js 92–98. Der Unterschied ist fast ausschließlich **JavaScript**: Next.js lädt pro Seite ≈180–210 kB (gzip) React + Next-Runtime + Framer Motion, das WP-Theme 1–6 kB. Daraus folgen 3–4× weniger Main-Thread-Zeit, TBT 0 statt 57–138 ms und LCP ≈1,5–2,0 s statt ≈2,3–3,2 s bei gedrosselter CPU.
- **CLS** ist auf beiden Seiten 0, Accessibility/Best Practices/SEO sind identisch (die a11y-Abzüge 93–96 stammen aus denselben Kontrastwerten des gemeinsamen Designs).
- Wichtig für die Einordnung: Das sind **Labor-Werte auf einer Maschine ohne Netz-Latenz zum Server**. Vercel liefert die statischen Next.js-Seiten vom Edge-CDN (TTFB typ. 20–60 ms weltweit); ein WordPress-Host liefert PHP-Seiten aus einem Rechenzentrum (TTFB ohne Page-Cache typ. 200–600 ms, mit Page-Cache + CDN 30–100 ms). Der hier gemessene Vorsprung von WP auf Mobile (≈1 s LCP) wird im Betrieb also nur mit einem sauber konfigurierten Page-Cache/CDN gehalten; ohne ihn verliert WP ihn wieder.

## 5. Ergebnisse: Payload (Chromium, Desktop 1366 px, gzip, WP / Next.js)

| Seite | Requests WP / Next | Übertragen gesamt kB | davon JS kB | CSS kB | HTML kB | DOM-Knoten |
|---|---|---|---|---|---|---|
| / | 70 / 94 | 120 / 395 (+ 1 550 HeadTurn-Frames, beide) | 6 / 204 | 14 / 15 | 15 / 19 | 457 / 470 |
| /portfolio/ | 8 / 34 | 103 / 389 | 4 / 206 | 14 / 15 | 16 / 22 | 755 / 821 |
| /portfolio/frida-eu/ | 8 / 33 | 99 / 378 | 4 / 206 | 14 / 15 | 13 / 18 | 392 / 419 |
| /leistungen/webdesign-ecommerce/ | 7 / 29 | 97 / 373 | 1 / 200 | 14 / 15 | 14 / 19 | 386 / 404 |
| /kontakt/ | 8 / 31 | 98 / 361 | 3 / 204 | 14 / 15 | 13 / 11 | 351 / 298 |
| /blog/ | 7 / 31 | 93 / 385 | 1 / 200 | 14 / 15 | 10 / 13 | 253 / 266 |

- Identisch auf beiden Seiten: Fonts (≈66 kB), Poster-Bilder, die 61 HeadTurn-Frames (≈1,55 MB, nur Desktop mit Maus, nach dem ersten Paint und mitten-nach-außen geladen).
- Das WP-Theme liefert 90–95 % weniger JavaScript und 20–25 % weniger HTML (kein RSC-Payload, keine Hydration-Daten). CSS ist praktisch gleich groß (gleiche Tailwind-Quelle).

## 6. Ergebnisse: Animation, Interaktion, Hero

Playwright/Chromium, 1440×900, 4 s schnelle Mausbewegung über den gesamten Viewport, Median aus 3 Läufen (WP / Next.js):

| Kennzahl | WordPress | Next.js |
| --- | --- | --- |
| rAF-Frames/s während der Bewegung | 42,0 | 40,8 |
| Frames > 20 ms (von ≈165) | 68 | 70 |
| Frames > 34 ms | 5 | 5 |
| p95 Frame-Dauer | 33,4 ms | 33,4 ms |
| Augen-Updates/s (pointermove → Transform) | 42,0 | 40,5 |
| HeadTurn-Frames geladen (Desktop) | 61 / 61 | 61 / 61 |
| HeadTurn-Frames geladen (Pixel-7-Emulation) | 0 | 0 |
| rAF-Frames/s Mobile-Emulation (Scroll + Tap) | 60 | 60 |

- **Gleiches Laufzeitverhalten.** Beide Implementierungen rendern dieselben Ebenen (Canvas-Kopf, Logo-Auge, Karten mit `backdrop-blur`, Glow-Verlauf) und landen im GPU-losen Headless-Chromium bei denselben ≈41 fps mit derselben Verteilung langer Frames. Der Engpass ist Rasterisierung (Blur + große Verlaufsfläche), nicht die Animationslogik; auf echter Hardware mit GPU laufen beide bei 60 fps (die Mobile-Emulation ohne Blur-Karten zeigt 60/60).
- Die Federphysik (Auge 320/26/0,6, Kopf 110/20/1, Körper 55/18/1,4), das Lehnen aus der Kopf-Geschwindigkeit, Idle-Umschauen, Touch-Folgen, Scroll-Blick, Aufwachen, Verschluss mit Blitz und fünf Sternfunken, Magnet-Karten und die Frame-Sequenz mit Nachbar-Crossfade sind 1:1 portiert (`src/js/hero.js`, 430 Zeilen, ohne Bibliothek; `src/js/spring.js` ersetzt Framer's `useSpring`).
- Kein Geisterbild: derselbe Canvas-Ansatz (ImageBitmap, ein Draw pro Frame, Crossfade nur zwischen Nachbarframes).
- Kein Mobile-Download: Canvas und Frames werden nur bei `pointer: fine` **und** ≥ 1024 px aktiviert; in der Pixel-7-Emulation wurden auf beiden Seiten 0 Frames angefordert.

## 7. Ergebnisse: Browser × Viewport, Screenshot-Vergleich

8 Seiten (Start, Portfolio-Index, Projekt, Leistungen, SEO-Leistung, Studio, Kontakt, Blog) × Chromium (= Edge) / Firefox / WebKit (= Safari-Engine) × 1920, 1366, 820, 390 px, jeweils WP gegen Next.js: **96 Paare, 0 Konsolenfehler, 0 fehlgeschlagene Requests, identische Seitenhöhen in allen 96 Paaren.**

| Engine | 1920 px | 1366 px | 820 px | 390 px |
| --- | --- | --- | --- | --- |
| Chromium/Edge | 0 % Differenz auf 7 von 8 Seiten* | ≤ 0,2 % (nur Hero-Zeitpunkt) | 0 %* | ≤ 0,36 % (Hero) |
| Firefox | ≤ 0,17 % (Hero) | ≤ 0,33 % (Hero) | 0 % | ≤ 0,01 % |
| WebKit/Safari | 0 % auf 6 von 8 Seiten* | ≤ 0,41 % (Hero) | 0 % | 0 % |

\* Vier Paare der ersten Messung (Startseite 1920/820 Chromium, Startseite und Portfolio 1920 WebKit) zeigten 0,7–6,7 % Differenz. Ursache war die Messmethode, nicht die Seite: Playwrights `animations: "disabled"` beendet die Web-Animations von Framer Motion, ohne dass Framer den Endzustand setzt, dadurch blieben Reveal-Abschnitte in der **Next.js**-Aufnahme unsichtbar. Ohne diese Option (zweiter Lauf, siehe unten) verschwinden die Abweichungen.
- Hero-Funktionstest je Engine (Desktop-Viewports): Auge folgt der Maus, Canvas aktiv, 61 Frames geladen, auf beiden Seiten in Chromium, Firefox und WebKit. Tablet/Mobile: kein Canvas, keine Frame-Requests, auf beiden Seiten.
- Restdifferenzen außerhalb des Hero: 0 Pixel in allen Paaren. Innerhalb des Hero-Bereichs bleiben ≤ 0,4 % durch den Aufnahmezeitpunkt (Blinzeln, Glow-Position).

### Nebenbefund (Next.js, unabhängig vom Experiment)
Mit `prefers-reduced-motion: reduce` bleiben in der Next.js-Version alle `Reveal`-Abschnitte unsichtbar (`opacity: 0; transform: translateY(24px)` wird beim Server-Render gesetzt, aber mit `initial={false}` unter Reduced Motion nicht mehr aufgelöst). Reproduziert in Chromium/Firefox: die gesamte Startseite unterhalb des Hero ist für Nutzer mit reduzierter Bewegung leer. Das WP-Theme hat das Problem nicht (CSS-Klasse `.is-shown` wird unabhängig von der Animation gesetzt). Empfehlung: in `components/Reveal.tsx` bei `reduce` den sichtbaren Zustand direkt setzen (`initial={ opacity: 1, y: 0 }` oder Wrapper ohne Motion). Kleiner, isolierter Fix, in diesem Experiment bewusst nicht angefasst.

## 8. Aufwand und Betrieb

| | Next.js + Vercel (heute) | WordPress-Theme (Experiment) |
| --- | --- | --- |
| Portierungsaufwand | – | ≈ 4 200 Zeilen PHP/JS/CSS (1 Tag mit Werkzeugunterstützung); Inhalte per Export, Seiten per Seeding |
| Neue Animation/Interaktion | React + Framer Motion, typisiert, deklarativ | Vanilla-JS + CSS; Spring-Physik selbst gepflegt; kein Typ-System, keine Komponententests |
| Inhalte pflegen | Code (`lib/*.ts`), Deploy per Git | Portfolio/Blog im WP-Backend; Services/Cases weiterhin JSON im Theme (oder ACF nachrüsten) |
| Hosting | Vercel: statisch, Edge-CDN, Brotli, HTTP/2/3, Preview-Deploys, kein Server | PHP-Host: Page-Cache (z. B. Nginx FastCGI/Redis), CDN, Brotli, HTTP/2 müssen eingerichtet werden; Datenbank, Backups |
| Sicherheit/Updates | Abhängigkeits-Updates im Repo | WP-Core, PHP, ggf. Plugins; Login/REST/XML-RPC als Angriffsfläche; Monitoring |
| OG-Bilder, Sitemap | automatisch (`next/og`, `sitemap.ts`) | Plugin oder Eigenbau |
| Preview/Rollback | pro Branch automatisch | Staging-Instanz nötig |

## 9. Empfehlung

**Technisch ist die Konvertierung machbar, und zwar ohne sichtbaren Verlust:** Design, Responsivität, Cross-Browser-Verhalten, die WITCH-Interaktion inklusive Kopfdrehung per Canvas-Frame-Sequenz sind im Experiment 1:1 nachgebildet (0 Pixel Unterschied außerhalb des animierten Hero-Bereichs in 96 Browser/Viewport-Paaren, identisches Laufzeitprofil der Animation). In den Labor-Messungen ist das schlanke WP-Theme auf Mobile sogar messbar schneller (Lighthouse 99–100 vs. 92–98, LCP ≈1 s früher), weil es 200 kB Framework-JavaScript nicht ausliefert.

**Trotzdem lautet die Empfehlung: Option B, bei Next.js + Vercel bleiben**, es sei denn, es gibt einen Grund, der nicht Performance oder Design heißt (z. B. redaktionelle Pflege durch Nicht-Entwickler als harte Anforderung). Begründung:

1. **Der Performance-Vorsprung ist kein WordPress-Vorsprung, sondern ein „kein-React“-Vorsprung.** Dieselben 200 kB lassen sich in Next.js ohne Plattformwechsel abbauen (Server Components ohne Framer auf statischen Seiten, `motion/react-m` bzw. LazyMotion, Hero-Logik als Vanilla-Insel). Damit erreicht Next.js dieselben Werte und behält Edge-CDN, Preview-Deploys und Typsicherheit.
2. **Im echten Betrieb kippt der Vergleich.** Die Messung lief ohne Netz-Latenz. Auf Vercel kommt die Seite statisch vom Edge; WordPress braucht Page-Cache, CDN und Kompression, um überhaupt gleichzuziehen, und jede dieser Schichten ist Konfiguration, die gepflegt und überwacht werden muss.
3. **Die Kosten liegen nach der Migration.** Jede neue Interaktion wird in Vanilla-JS teurer als in React/Framer; Spring-Physik, FLIP-Animation und Video-Player sind jetzt Eigencode ohne Typen und Tests. Dazu WP-Updates, Sicherheitsfläche, Backups, Staging.
4. **Der redaktionelle Gewinn ist halbiert.** Portfolio und Blog wären in WP pflegbar, die Leistungs- und Case-Texte bleiben Theme-Daten (oder brauchen ACF und weitere Arbeit). Wenn Redaktionspflege das eigentliche Ziel ist, ist ein Headless-CMS vor der bestehenden Next.js-App der kleinere Schritt.

**Wenn Option A dennoch gewählt wird**, sind die Voraussetzungen für „gleich gut oder besser“: Managed-WP-Host mit Page-Cache + CDN + Brotli + HTTP/2, PHP 8.3+, Object-Cache, keine Page-Builder-/Optimierungs-Plugins (sie würden das schlanke Theme wieder aufblähen), OG-Bilder und Sitemap ergänzen, Inhalte aus `data/*.json` in Felder überführen, und ein Staging-Workflow.

**Kurzfristige Empfehlung unabhängig von der Plattformfrage:** den Reduced-Motion-Fehler in `Reveal.tsx` beheben und das JS-Budget der Next.js-Seite senken (Framer nur dort laden, wo es läuft). Beides bringt der Produktion mehr als ein Plattformwechsel.

## 10. Reproduktion

- Theme: `wordpress-theme/netwitcher-next/README.md` (Aufbau, Konventionen, Build).
- Mess-Skripte und Rohdaten: `wordpress-theme/netwitcher-next/tools/bench/` (`bench-hero.mjs`, `lh.mjs`/`runlh.sh`, `xbrowser.mjs`, `payload.mjs`, `gzproxy.mjs`; `results/*.json`). Die 96 × 3 Screenshots (WP, Next, Diff) liegen nur in der Sitzung (zu groß für das Repo).
