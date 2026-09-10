# Medien-Manifest

Alle Assets liegen lokal im Projekt (`public/media`, `public/brand`).
Keine Remote-/CDN-Abhängigkeit zur Laufzeit.

## Marken-Assets (echt, nicht generiert)

| Datei | Herkunft | Einsatz |
|---|---|---|
| `public/brand/star.svg` | Vektoren aus der offiziellen Broschüre extrahiert | Header, Footer, Conversion, 404 |
| `public/brand/wordmark.svg` | dito (Original-Letterformen) | Header, Footer |
| `public/brand/arrow3d-{mint,violet,pink,sun,sky}.png` | aus `arrows_3d.ai` extrahiert (Alpha-Masken, CMYK→RGB) | Hero-Art-Direction-Cursor, Conversion-Zusammenlauf |

Auf 420 px verkleinert und palettiert: 778 KB → 70 KB gesamt.

## Higgsfield-Assets (unterstützendes Bildmaterial)

Einheitliche Vorgabe für alle Generierungen: hochwertige kommerzielle
Produktion, Berliner Studio, dunkles neutrales Umfeld, echtes Kamera-Equipment,
kein Fake-Text, keine Logos, keine KI-Futurismus-Ästhetik.

| Datei | Zweck | Prompt (gekürzt) |
|---|---|---|
| `studio.avif/.webp` | Hero-Standbild, Studio-Spread 01 | Premium content studio Berlin, softboxen, Kamera, Produkttisch |
| `studio-close.avif/.webp` | Studio-Spread 02 | Cinema-Kamera am Produkttisch, Neon-Rim-Light |
| `reels.avif/.webp` | Studio-Spread 03, Distribution | Reel-Produktion BTS, Gimbal, Ringlicht |
| `product.avif/.webp` | Format-Kapitel, Distribution | Makro-Produktfotografie, Cyan/Magenta-Kanten |
| `performance.avif/.webp` | Digitales-Ziel-Kapitel | Abstrakte Kampagnenflächen, Lichtspuren |
| `studio-loop.mp4` + `studio-loop-poster.avif` | Hero-Video (progressive Verbesserung) | Studio, langsame Dolly-Fahrt, keine Personen frontal |

Bilder als AVIF + WebP ausgeliefert (`components/ui/Media.tsx`, `<picture>`),
lazy per Default. Rohdaten-PNGs entfernt: 12,9 MB → 145 KB AVIF.

## Offen

- `studio-loop.mp4` konnte im Headless-Chromium dieser Umgebung nicht dekodiert
  werden (keine proprietären Codecs). Das Hero funktioniert deshalb bewusst
  ohne Video; das Video ist rein additiv. Vor dem Livegang visuell prüfen.
