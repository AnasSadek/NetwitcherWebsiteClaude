# Portfolio-Medien

Ein Ordner pro Projekt, benannt wie der `slug` in `lib/portfolio.ts`:

```
public/portfolio/
  frida-eu/
    cover.jpg            Titelmotiv (16:10 empfohlen, min. 1600 px breit)
    logo.svg             Kundenlogo, einfarbig weiss (optional)
    desktop.jpg          Website-Screenshot Desktop (gern seitenlang, 1600 px breit)
    mobile.jpg           Website-Screenshot Smartphone (9:16, min. 720 px breit)
    01.jpg, 02.jpg …     Bilder / Poster / Social-Posts
    reel-01.mp4          Lokale Videos (H.264, max. ~10 MB pro Reel)
    reel-01.jpg          Vorschaubild zum Video (wird immer zuerst geladen)
    screen-01.jpg        Software-Screenshots
```

Referenziert werden Dateien im Projekt-Eintrag über den Pfad ab `/portfolio/…`,
z. B. `src: "/portfolio/frida-eu/cover.jpg"`. Fehlt ein `src`, zeigt die Seite
automatisch einen neutralen Platzhalter im richtigen Format.

Formate: JPG/WebP/AVIF für Bilder (next/image liefert automatisch responsive
Grössen), MP4 (H.264) für lokale Videos. YouTube/Vimeo brauchen nur die ID
oder URL im Eintrag und keine Datei.
