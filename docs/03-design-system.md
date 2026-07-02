# Netwitcher – Design System

## Farben

| Token | Wert | Verwendung |
|---|---|---|
| `--color-night` | `#06060F` | Seitenhintergrund |
| `--color-night-800` | `#0B0B1A` | Sektions-Wechsel |
| `--color-night-700` | `#121226` | Karten-Basis |
| `--color-line` | `rgba(255,255,255,.08)` | Hairlines, Card-Border |
| `--color-mint` | `#2EE6C8` | Türkis-Pfeil → Webdesign |
| `--color-violet` | `#8B5CF6` | Lila-Pfeil → Strategie/Marketing |
| `--color-pink` | `#F468A8` | Pink-Pfeil → Content Creation |
| `--color-sun` | `#F5D33D` | Gelb-Pfeil → Studio/Fotografie |
| `--color-sky` | `#0FB9F2` | Blau-Pfeil → Social/Ads |
| Text | `#F4F4FB` / `#A3A3C2` | Primär / Sekundär |

Gradients: `violet → sky` (Primär-CTA), `pink → sun` (Studio), Aurora-Glows als radiale
Hintergründe mit 10–20 % Opazität. Kontrast: alle Textfarben ≥ 4.5:1 auf Night.

## Typografie

- **Headings:** Orbitron (variable, 500–900) – futuristisch, passend zum Logo-Wordmark.
  H1 `clamp(2.4rem, 6vw, 4.5rem)`, tracking-tight, 800–900.
- **Body/UI:** Space Grotesk (variable, 300–700) – klar, technisch, sehr gut lesbar.
  Body 1rem/1.7, Sekundärtext `#A3A3C2`.
- Eyebrow-Labels: Orbitron 500, uppercase, letter-spacing 0.2em, 12–13 px, Akzentfarbe.

## Buttons

- **Primary:** Gradient violet→sky, Text Night, bold, `rounded-full`, Glow-Shadow,
  Hover: hebt sich (−2 px) + stärkerer Glow. Fokusring 2 px mint.
- **Secondary:** transparente Fläche, 1 px `--color-line`-Border, Hover: Border-Akzent.
- **Ghost/Arrow-Link:** Textlink mit `→`, das beim Hover 4 px nach rechts gleitet.
- **WhatsApp:** `#25D366`-Kreis, fixed bottom-right, Puls-Ring (bei reduced-motion statisch).

## Karten

- Basis: `bg night-700/60`, 1 px Border `--color-line`, `rounded-2xl`, `backdrop-blur`.
- Hover: Border in Kategorie-Farbe, radialer Glow oben, translateY(-4px), Icon skaliert.
- Jede Service-Karte trägt eine der 5 Pfeilfarben als Akzent (Icon, Border, CTA).

## Motion-Prinzipien

- Einstiege: `opacity 0→1`, `y 24→0`, 0.6 s, ease `[0.22,1,0.36,1]`, gestaffert 60–90 ms.
- Micro-Interactions ≤ 200 ms. Scroll-Animationen nur transform/opacity (GPU).
- `prefers-reduced-motion`: alle Loops/Parallax aus, Inhalte sofort sichtbar.
