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
- **Nur die Kopf-Ebene bewegt sich — und der Kopf ist ECHTES 3D:**
  `public/mascot/witch-head.glb` (Draco-komprimiert; Decoder unter
  `public/draco/gltf/`), per Higgsfield MULTI-VIEW image-to-3D aus dem gelieferten
  Kopf-Asset erzeugt (Original-Frontbild als erste Referenz + drei
  daraus generierte Seiten-/Obenansichten; der Gurt-Artefakt unter der
  Kamera wurde aus dem Mesh geschnitten) und in `components/mascot/Head3D.tsx` mit three.js
  gerendert (lazy Import, Render nur bei Wertänderung). Feder-geglättete
  Blickführung: yaw/pitch effektiv ≈ ±25°/±18° (echte Geometrie dreht um
  die Objektmitte — Seitenflächen/Ober-/Unterseite werden real
  sichtbar), Translation sekundär ≈ ±20/±14 px, weiches Zurückkehren in
  die Mitte, dezentes Schweben (`animate-float-head`). Der Canvas hat
  Overscan (−16 %), damit die rotierte Silhouette nie beschnitten wird.
  `witch-head.webp` bleibt als statischer Fallback (Mobil, reduced
  motion, bis zum ersten 3D-Frame, WebGL-Fehler). Kein Blending, keine
  Überblendungen — zu jedem Zeitpunkt genau EIN Kopf.
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
