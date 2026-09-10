# Portfolio (/portfolio)

Das Portfolio ist datengetrieben. Es gibt **eine** Quelle: `lib/portfolio.ts`.
Listing, Filter, Filmstreifen, Detailseiten, Sitemap und Open-Graph-Bilder
leiten sich daraus ab.

## Routen

| Route | Inhalt |
|---|---|
| `/portfolio` | Übersicht: Hero + Filmstreifen, Filter, Werke, Spektrum, CTA |
| `/portfolio?f=web` | Übersicht mit vorausgewähltem Filter (`web`, `ecommerce`, `social-video`, `photo`, `design`, `software`, `ai`) |
| `/portfolio/<slug>` | Case Study eines Projekts |
| `/portfolio/opengraph-image` | OG-Bild der Übersicht (automatisch) |
| `/portfolio/<slug>/opengraph-image` | OG-Bild pro Projekt (automatisch) |

## Neues Projekt anlegen

1. Ordner `public/portfolio/<slug>/` anlegen und Medien ablegen
   (siehe `public/portfolio/README.md`).
2. In `lib/portfolio.ts` einen Eintrag zu `portfolioProjects` hinzufügen:

```ts
{
  slug: "kunde-xy",                 // → /portfolio/kunde-xy
  client: "Kunde XY",
  title: "Relaunch & Kampagne",
  description: "Ein bis zwei Sätze Einordnung.",
  year: 2025,
  categories: ["web", "social-video"],  // Filter-Zuordnung (mehrere möglich)
  services: ["Webdesign", "Reels", "Meta Ads"],
  color: "mint",                    // mint | violet | pink | sun | sky
  featured: true,                   // ganze Bühne im Portfolio
  cover: { src: "/portfolio/kunde-xy/cover.jpg", alt: "…", ratio: "16/10" },
  website: {
    url: "https://kunde-xy.de",
    desktop: { src: "/portfolio/kunde-xy/desktop.jpg", alt: "…", ratio: "16/10" },
    mobile:  { src: "/portfolio/kunde-xy/mobile.jpg",  alt: "…", ratio: "9/16" },
  },
  videos: [
    { title: "Reel 01", source: "local",   src: "/portfolio/kunde-xy/reel-01.mp4", poster: "/portfolio/kunde-xy/reel-01.jpg", ratio: "9/16" },
    { title: "Spot",    source: "youtube", src: "dQw4w9WgXcQ", ratio: "16/9" },
    { title: "Making-of", source: "vimeo", src: "https://vimeo.com/123456789", ratio: "16/9" },
  ],
  images:      [{ src: "/portfolio/kunde-xy/01.jpg", alt: "…", ratio: "4/5" }],
  posters:     [],
  socialPosts: [],
  screens:     [],                  // Software: 16:10 Screens, 9:16 = Phone-Rahmen
  story: [{ heading: "Ausgangslage", body: "…" }, { heading: "Umsetzung", body: "…" }],
  results: [{ value: "+38 %", label: "Anfragen über die Website" }],  // nur echte Zahlen
  testimonial: { quote: "…", name: "…", role: "…" },
  links: [{ label: "Instagram", href: "https://instagram.com/…" }],
}
```

3. Fertig. Die Reihenfolge im Array ist die Reihenfolge auf der Seite.

Nur `slug`, `client`, `title`, `description`, `year`, `categories`,
`services`, `color` und `cover` sind Pflicht. Alles andere ist optional;
die Detailseite zeigt nur Abschnitte, für die Daten vorhanden sind.

## Featured

`featured: true` setzen. Featured-Projekte bekommen im Portfolio eine ganze
Bühne (Spread) mit einer Komposition, die zum Projekttyp passt:
Browser + Smartphone (Website), Reel-Fächer (Video), Screens (Software),
Cover + Begleitbild (Design/Foto). Normale Projekte laufen als Kacheln in
wechselnden Spaltenbreiten (7/5 · 5/7 · 4/4/4).

## Platzhalter

Solange ein `src` fehlt, erscheint ein neutraler Platzhalter im passenden
Format (kein Stockfoto). `placeholder: true` blendet auf der Detailseite den
Hinweis „Vorschau · Inhalte folgen" ein. Beides entfernen, sobald echte
Inhalte da sind.

## Video

Videos werden nie vorab geladen: erst Vorschaubild, Player erst beim Klick.
Läuft ein Video, stoppen andere. Unterstützt: `local` (Datei unter /public),
`youtube`, `vimeo`, `url` (direkte mp4/webm-URL). `ratio: "9/16"` landet in
der wischbaren Reel-Reihe, `16/9` als grosser Player darunter.

## Kategorien anpassen

`PORTFOLIO_CATEGORIES` in `lib/portfolio.ts`. Filter ohne Projekte werden
automatisch ausgeblendet. Das Leistungs-Register (`ServiceSpectrum`) verlinkt
auf den Filter, sobald es dort Projekte gibt, sonst auf die Leistungsseite.
