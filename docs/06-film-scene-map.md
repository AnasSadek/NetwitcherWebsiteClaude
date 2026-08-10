# From Nothing to Attention — Scene Map

Ein durchgehender Scroll-Film auf der Startseite. Wrapper: 950vh Desktop / 700vh Mobil,
Sticky-Viewport mit einem R3F-Canvas, Copy und CTAs als echtes DOM darüber.
Scroll-Fortschritt (0..1) steuert deterministisch alle Zustände — vorwärts wie rückwärts.

| # | Szene | Range | 3D-Zustand | Pfeile | Medien | Copy (EP-Boxi) | CTA |
|---|-------|-------|-----------|--------|--------|----------------|-----|
| 1 | Niemand schaut hin | .00–.09 | Dunkler Raum, kleines Marken-Zeichen (abstrakter Leucht-Monolith), ein schwaches Licht | keine | – | NIEMAND SCHAUT HIN. / Guter Content ändert das. | Projekt starten |
| 2 | Aufmerksamkeit entsteht | .09–.21 | Studio baut sich auf: Softbox, Stativ, Hintergrund; Licht wird warm | Sun schiebt Licht, Pink rahmt | – | WIR MACHEN MARKEN SICHTBAR. + Foto/Video/Reels/Creative Direction | Studio-Shooting anfragen |
| 3 | Kamera-Explosion (WOW) | .21–.38 | Parametrische Kamera fährt heran, zerlegt sich reversibel in Z (Linsen, Ringe, Mount, Body, Sensor); Raumtypo IDEE·LICHT·STORY·MOTION·SOUND·SCHNITT zwischen den Teilen | ruhen | – | MEHR ALS NUR AUFNAHME. | – |
| 4 | Roh wird Content | .38–.50 | Frame aus der Linse wird Clip; Timeline in der Tiefe, Playhead folgt Scroll; Look von entsättigt zu final | Pink markiert Schnitt | studio, reels | AUS ROHMATERIAL WIRD CONTENT, DER FUNKTIONIERT. | – |
| 5 | Eine Idee, viele Formate (WOW) | .50–.60 | Der finale Frame teilt sich in 9:16 / 4:5 / 1:1 / 16:9-Ebenen, fächert räumlich auf | Sky führt | 4 echte Fotos | EINE IDEE. VIELE FORMATE. | – |
| 6 | Distribution | .60–.70 | Formate strömen auf Bahnen nach außen; Kanal-Ebenen (Social/Meta/TikTok/Google) ohne Fake-UI | Sky + Violet lenken | Streams | GUTER CONTENT MUSS GESEHEN WERDEN. → WIR PRODUZIEREN IHN. UND BRINGEN IHN ZU DEN RICHTIGEN MENSCHEN. | Kampagne besprechen |
| 7 | Die richtige Zielgruppe | .70–.78 | Instanziertes Punktefeld; relevante Punkte aktivieren sich violett, Rest bleibt dunkel | Violet ordnet | – | (nur Motion, Mini-Label „Relevanz statt Reichweite") | – |
| 8 | Digitales Ziel | .78–.86 | Schräge UI-Ebenen richten sich zu einem Interface aus; Traffic dockt an | Mint dockt | performance | AUFMERKSAMKEIT BRAUCHT EIN ZIEL. + Webdesign/Landingpages/E-Commerce/Software | – |
| 9 | Handlung | .86–.92 | Alles beruhigt sich; eine Aktion: „Anfrage gesendet" | ziehen ab | – | AUS AUFMERKSAMKEIT WIRD HANDLUNG. | – |
| 10 | Netwitcher | .92–1.0 | Bühne leer; die 5 echten Pfeile fliegen aus 5 Richtungen ein und rasten im 72°-Raster zum offiziellen Stern | alle 5 | – | WIR MACHEN NICHT NUR CONTENT. WIR SORGEN DAFÜR, DASS ER ETWAS BEWIRKT. | Projekt starten / Erstgespräch buchen |

## Kontinuität (Continuous Object)
Linse → Frame → Clip → Formatebenen → Streams → Publikumsaktivierung → Website-Ebene → Aktion.
Die Pfeile begleiten jede Szene; der Stern ist ihr Endzustand, kein Crossfade.

## Motion-Sprache
Gewichtet, präzise, kinematografisch. Ease [0.22,1,0.36,1] bzw. gedämpfte Federn (maath damp).
Ruhe → Beschleunigung → Transformation → Ruhe. WOW nur in Szene 3 und 5.

## Performance
- three/fiber/drei nur im dynamischen `FilmCanvas` (ssr:false, lazy) — Hero-Copy und CTAs sind SSR-DOM.
- DPR clamp: Desktop max 2, Mobil max 1,5. `frameloop="never"` sobald der Film aus dem Viewport ist.
- Nur Primitive + 5 Arrow-PNGs + 4 Fotos als Texturen. Kein GLB, keine Schatten-Maps.
- Mobil: 700vh, ~1/3 Publikums-Instanzen, vereinfachte Kamerateile.

## Fallbacks
- `prefers-reduced-motion` / WebGL-Fehler: statische Panel-Fassung derselben Erzählung (DOM + echte Fotos).
- Alle Copy/CTAs sind immer echtes DOM (SEO, Screenreader, Tastatur).
