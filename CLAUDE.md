# Netwitcher Website — Projektregeln

## GESPERRT: Hero-Charakter (WITCH) — statischer Körper, echter 3D-Kopf

Die Hero-Architektur in `components/mascot/HeroStage.tsx` ist abgenommen
und **gesperrt**:

- **Der Körper ist zu 100 % statisch.** Die Körper-Kette (Poster
  `witch-wide`/`witch-portrait` + kopflose Platte `witch-body.webp`) darf
  **keine** animierten oder transformierten Vorfahren haben: kein
  translate, kein scale, kein rotate, kein Float/Bob, kein Parallax,
  keine cursorgesteuerte Bewegung — weder direkt noch über einen
  Eltern-Container. Das gilt auf ALLEN Viewports (auch mobil).
- **Nur die Kopf-Ebene bewegt sich — und der Kopf ist ECHTES 3D:**
  `public/mascot/camera-head.glb` (Draco-komprimiert, WebP-Texturen,
  ~640 KB; Decoder unter `public/draco/gltf/`), per Higgsfield
  MULTI-VIEW image-to-3D aus der freigegebenen Kunden-Referenz erzeugt
  (Front + drei Winkel-Stills aus dem Kunden-Sheet, Hintergrund
  entfernt, weiß geflattet; Front dominiert die Textur) und in
  `components/mascot/Head3D.tsx` mit three.js gerendert (lazy Import,
  Render nur bei Wertänderung). Maus X → Yaw, Maus Y → Pitch
  (`ROT` = ±34°/±24°, durch tanh-Sättigung effektiv ≈ ±29°/±21°; echte
  Geometrie dreht um die Objektmitte — Seiten/Ober-/Unterseite werden
  real sichtbar), Translation sekundär (`TRAVEL` ±16/±12 px), weiches
  Zurückfedern in die Mitte, dezentes Schweben (`animate-float-head`).
  Die Kopf-Box (`HEAD_BOX`, Bühnen-Anteile) hat −18 % Canvas-Overscan,
  damit die rotierte Silhouette nie beschnitten wird.
- **Fallback ohne Blending:** bis zum ersten 3D-Frame (onReady), auf
  Touch/schmalen Viewports, bei reduced motion und bei WebGL-Fehlern
  steht das Poster mit gemaltem Kopf — zu jedem Zeitpunkt genau EIN
  Kopf, nie eine kopflose Figur, kein Crossfade.
- **Mobil/Touch und prefers-reduced-motion:** der Charakter steht
  komplett still (kein 3D, keine Verfolgung, kein Schweben); nur der
  Glanzpunkt in der Poster-Linse darf wandern.
- **Der Kontaktschatten ist statisch** (feste Position, feste Deckkraft):
  er darf die Kapuze in keiner Pose umzeichnen und nicht animiert werden.
- Der 12-px-Ruheabstand (`HEAD_GAP`) und die kopflose Körper-Platte
  (`public/mascot/witch-body.webp`) sind abgenommen — nicht neu bauen.
- Das Kopf-Design stammt aus der vom Kunden freigegebenen Referenz
  (Multi-Angle-Sheet, 2026-09-12); bei Konflikten mit älteren Assets
  gewinnt die Kunden-Referenz. Das Design nie frei per KI neu erfinden —
  Rekonstruktion (image-to-3D) aus der Referenz ist der abgenommene Weg.
- Die Linsen-Ruheposition für die Zielberechnung steht in
  `app/globals.css` (`--eye-x`/`--eye-y` je Breakpoint) und muss bei
  Layout-Änderungen der Charakter-Box mitkalibriert werden; `HEAD_BOX`
  in HeroStage ist auf die Kopf-BBox des Posters kalibriert
  (x 0.322–0.666, y 0.144–0.530 der lg-Bühne).

Verifikationsstandard für Änderungen am Hero: Screenshots an mehreren
Cursor-Positionen (Mitte, links, rechts, oben, unten, Diagonalen) und
den Ruhezustand nach Mouse-Leave diffen — Hoodie/Torso/Kordeln/Tasche
müssen pixelidentisch bleiben (0 abweichende Pixel in allen
Körper-Zonen), der Kopf muss in jeder Pose vollständig sichtbar sein.
Validierung immer in der vollen Hero-Ansicht bei normalem
Browser-Maßstab; Mobil (kein Canvas, Figur statisch) und
reduced-motion (komplett statisch) mitprüfen.
