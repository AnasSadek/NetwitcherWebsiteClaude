# WITCH Kopfdrehung – Pipeline

Erzeugt aus zwei Turnaround-Clips (Mitte → links, Mitte → rechts) die
Frame-Sequenz, die der Hero auf dem Desktop per Canvas scrubbt
(`components/mascot/HeadTurn.tsx`).

```bash
cd scripts/headturn
npm i
node build.mjs --left clips/center-to-left.mp4 --right clips/center-to-right.mp4 \
  --frames 61 --threshold 60 --crop-bottom 0.60 --feather-bottom 0.03 --poster
mv ../../public/mascot/headturn/manifest.json ../../components/mascot/headturn.manifest.json
```

Ausgabe: `public/mascot/headturn/{1600,960}/NN.webp` (Kopf-Crops mit Alpha-Matte),
`components/mascot/headturn.manifest.json` (Crop, Linsenbahn, Frame-Anzahl) und mit
`--poster` das neue `public/mascot/witch-wide.{webp,avif}` (Center-Frame).

Nach einem Neubau die Linsenmitte aus der Konsole (`lens center`) in
`app/globals.css` (`.witch-stage` ab `lg`: `--eye-x`, `--eye-y`) übernehmen.

Die Clips wurden mit MiniMax H3 (2K) aus dem frontalen Render erzeugt
(Prompt: nur die Kamera-Kopf-Drehung, alles andere fixiert). Die Pipeline
gleicht Restdrift des Körpers aus und schneidet den Kopf per Matte frei,
damit der Körper immer das statische Poster bleibt.
