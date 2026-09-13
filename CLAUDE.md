# Netwitcher Website — Projektregeln

## GESPERRT: Statischer Körper im Hero (WITCH)

Die Hero-Architektur in `components/mascot/HeroStage.tsx` ist abgenommen
und **gesperrt**:

- **Der Körper ist zu 100 % statisch.** Die Körper-Kette (Poster
  `witch-wide`/`witch-portrait` + kopflose Platte `witch-body.webp`) darf
  **keine** animierten oder transformierten Vorfahren haben: kein
  translate, kein scale, kein rotate, kein Float/Bob, kein Parallax,
  keine cursorgesteuerte Bewegung — weder direkt noch über einen
  Eltern-Container.
- **Alle Bewegung lebt ausschließlich auf der Kopf-Ebene** (der absolute
  Overlay-Wrapper um `<HeadTurn>`): Schwebe-Bob, Auslöser-Rückstoß,
  Cursor-Verfolgung, Linsen-Glanz und Sternfunken. Zukünftige
  Animationsänderungen dürfen nur diese Ebene betreffen.
- **Der Kontaktschatten ist statisch** (feste Position, feste Deckkraft,
  Teil der ruhenden Komposition): er darf die Kapuze in keiner Pose
  umzeichnen und nicht animiert werden.
- **Die Kopf-Frames enthalten NUR die Kamera** — keine Kapuzen-,
  Schulter- oder Brust-Pixel. Nach jedem Strip-Neubau (build.mjs)
  zwingend `scripts/headturn/head-only-guard.mjs` ausführen; ohne den
  Guard „verformen" Footage-Körperpixel den statischen Körper beim
  Posenwechsel.
- Der 12-px-Ruheabstand (`HEAD_GAP`), die kopflose Körper-Platte
  (`public/mascot/witch-body.webp` + `scripts/headturn/make-plate.mjs`)
  und die Hood-Komposition sind ebenfalls abgenommen — nicht neu bauen.
- Der Kopf ist eine Video-Zustandsmaschine (`components/mascot/HeadTurn.tsx`):
  Stern-Graph, zu jedem Zeitpunkt GENAU EIN echter Frame, kein Blending,
  kein Crossfade zwischen Posen. Die entfernten up/down-Bogen-Reihen
  nicht wieder einführen (ihre Posen passten nicht zu den Speichen).
- Ausnahme: auf Touch/schmalen Layouts (kein `headTurn`) ist die Figur
  ungeteilt und animiert als Ganzes — das bleibt so.

Verifikationsstandard für Änderungen am Hero: Screenshots bei laufenden
Animationen an mehreren Cursor-Positionen und zeitversetzt diffen —
Hoodie/Torso/Kordeln müssen pixelidentisch bleiben (0 abweichende Pixel
außerhalb der Kopf-Ebene), Validierung immer in der vollen Hero-Ansicht
bei normalem Browser-Maßstab.
