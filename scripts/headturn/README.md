# WITCH Kopfdrehung – Pipeline (2D)

Erzeugt aus acht Turnaround-Clips die radialen Frame-Strips, die der Hero
auf dem Desktop per Canvas in ALLE Richtungen scrubbt
(`components/mascot/HeadTurn.tsx`).

Clips (MiniMax H3, 2K, Startbild = `public/mascot/witch-wide.webp`, Prompt:
nur die Kamera-Kopf-Drehung in die jeweilige Richtung, alles andere fixiert):

- `clips/center-to-left.mp4`, `clips/center-to-right.mp4` → horizontaler
  61-Frame-Strip (Wurzelordner)
- `clips/center-to-{up,down,up-left,up-right,down-left,down-right}.mp4` →
  je ein 16-Frame-Strip (Frame 0 = frontale Mitte)

Alle Builds teilen sich EINE Crop-Box (`--crop`), damit ein einziges Canvas
alle Strips deckungsgleich zeichnen kann. Die Box ist die Vereinigung der
Bewegungsregionen aller Clips (`--analyze` zeigt die Auto-Box eines Clips).

```bash
cd scripts/headturn
npm i
CROP=0.25,0.0633,0.4813,0.6567

# 1. Horizontal (schreibt public/mascot/headturn/{1600,960} + manifest.json)
node build.mjs --left clips/center-to-left.mp4 --right clips/center-to-right.mp4 \
  --frames 61 --threshold 60 --crop $CROP --feather-bottom 0.03 --matte-fade 0.552,0.568

# 2. Sechs Richtungs-Strips (je eigener Unterordner)
for d in up-left up-right; do
  node build.mjs --clip clips/center-to-$d.mp4 --frames 16 --threshold 60 --crop $CROP \
    --feather-bottom 0.03 --matte-fade 0.552,0.568 --lens-bottom 0.48 \
    --out ../../public/mascot/headturn/$d
done
node build.mjs --clip clips/center-to-up.mp4 --frames 16 --threshold 60 --crop $CROP \
  --feather-bottom 0.03 --matte-fade 0.552,0.568 --lens-bottom 0.44 \
  --out ../../public/mascot/headturn/up
for d in down down-left down-right; do
  node build.mjs --clip clips/center-to-$d.mp4 --frames 16 --threshold 60 --crop $CROP \
    --feather-bottom 0.03 --matte-fade 0.66,0.70 --lens-bottom 0.66 \
    --out ../../public/mascot/headturn/$d
done

# 3. Einzel-Manifeste zu components/mascot/headturn2.manifest.json vereinen
node assemble.mjs
```

`--lens-bottom` variiert, weil bei hochgeneigtem Kopf der Schatten unter der
Kamera sonst als „Linse" erkannt wird (bei gesenktem Kopf wandert die echte
Linse dagegen nach unten). `--matte-fade` liegt bei den Down-Strips tiefer,
weil die Kamera-Unterkante beim Senken unter die frontale Kante wandert.

Nach einem Neubau die Linsenmitte aus der Konsole (`lens center` des
Horizontal-Builds) in `app/globals.css` (`.witch-stage` ab `lg`: `--eye-x`,
`--eye-y`) übernehmen. `--poster` nur benutzen, wenn wirklich ein neuer
Center-Frame als Poster gewollt ist — die Richtungs-Clips starten alle auf
dem bestehenden Poster.
