# Netwitcher Website — Projektregeln

## GESPERRT: Hero-Charakter (WITCH) — statischer Körper, bewegter Kopf

Der Hero-Charakter besteht aus EINEM gelieferten Design-Asset
(`scripts/mascot/mascot-src.webp`, 1254×1254, echtes Alpha), zerlegt in
zwei unabhängige Ebenen (`scripts/mascot/slice-mascot.mjs`):

- `public/mascot/witch-head.webp` (Zeilen 0–634) — der Kamera-Kopf
- `public/mascot/witch-torso.webp` (Zeilen 634–1254) — der Hoodie-Körper

Beide Slices behalten die volle Quellbreite (transparenter Overscan):
Kopf und Körper fluchten dadurch automatisch, und der Kopf hat rundum
Luft und wird bei keiner Auslenkung beschnitten. Der Design-Spalt der
Quelle ergibt im Hero ≈ 5 px sichtbaren Ruheabstand.

Regeln (abgenommen und **gesperrt**):

- **Der Körper ist zu 100 % statisch.** `witch-torso.webp`, seine
  Charakter-Box und alle Eltern-Container dürfen KEINE Transforms,
  Animationen, Parallaxe oder cursorgesteuerte Bewegung tragen.
- **Nur die Kopf-Ebene bewegt sich**: Feder-geglättete 3D-Blickführung
  zur Maus — die ROTATION ist der dominante Effekt (rotateY ±14°,
  rotateX ±10°, Drehpunkt = Linsenmitte, perspective 750px,
  preserve-3d), die Translation sekundär (±18/±12 px). Dazu ein
  kopflokaler Spekular-Glanz auf dem Objektiv (läuft der Drehung
  entgegen), weiches Zurückkehren in die Mitte beim Verlassen des
  Hero-Bereichs, dezentes Schweben (`animate-float-head`). Genau EIN
  Kopf-Bild — kein Canvas, keine Frames, kein Blending, keine
  Überblendungen.
- **Mobil/Touch und prefers-reduced-motion:** der Charakter steht
  komplett still (keine Verfolgung, kein Schweben).
- Hintergrund: `public/mascot/backdrop-wide.webp` — die charakterfreie
  Bühne, per Inpainting aus dem alten Poster erzeugt
  (`scripts/mascot/make-backdrop.mjs`); Portrait-Layouts beschneiden
  dieselbe Datei per `object-cover`.
- Das Maskottchen-Design (inkl. Logo im Objektiv und auf dem Hoodie)
  stammt ausschließlich aus dem gelieferten Asset — niemals per KI
  neu generieren.
- Die Linsen-Ruheposition für die Zielberechnung steht in
  `app/globals.css` (`--eye-x`/`--eye-y` je Breakpoint) und muss bei
  Layout-Änderungen der Charakter-Box mitkalibriert werden.

Verifikationsstandard für Änderungen am Hero: Screenshots an mehreren
Cursor-Positionen (Mitte, links, rechts, oben, unten, Diagonalen) und
den Ruhezustand nach Mouse-Leave diffen — Hoodie/Torso/Kordeln/Tasche
müssen pixelidentisch bleiben (0 abweichende Pixel außerhalb der
Kopf-Ebene), der Kopf muss in jeder Pose vollständig sichtbar sein.
Validierung immer in der vollen Hero-Ansicht bei normalem
Browser-Maßstab; Mobil und reduced-motion mitprüfen.
