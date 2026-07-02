# Netwitcher – Animationsplan „Logo-Pfeile“

Die fünf Pfeile des Logos (Türkis, Lila, Pink, Gelb, Blau) sind das Signature-Element.
Sie sind als **eine wiederverwendbare SVG-Pfadform** (`components/arrows.tsx`) umgesetzt,
die pro Instanz gefärbt und um 72° versetzt rotiert wird → ergibt exakt den Logo-Stern.

## Zuordnung Pfeil → Kategorie (Klick-Navigation)

| Pfeil | Farbe | Route |
|---|---|---|
| Türkis | `#2EE6C8` | /leistungen/webdesign-ecommerce |
| Lila | `#8B5CF6` | /leistungen/performance-marketing (Strategie/Digital Marketing) |
| Pink | `#F468A8` | /studio (Content Creation) |
| Gelb | `#F5D33D` | /leistungen/foto-videoproduktion (Studio/Fotografie) |
| Blau | `#0FB9F2` | /leistungen/social-media-management (Social/Ads) |

## Verhalten

1. **Hero (`HeroArrows`)**
   - Idle: Pfeile schweben versetzt (y-Sinus-Loop, 6–9 s je Pfeil, leichte Eigenrotation).
   - Maus-Parallax: `useSpring` auf Mausposition, jeder Pfeil mit eigenem Faktor
     (0.02–0.06) und leichter Gegenrotation → Tiefenwirkung.
   - Hover über einen Pfeil: skaliert auf 1.12, Glow (drop-shadow) in Pfeilfarbe,
     Tooltip mit Kategoriename.
   - Klick / Enter / Space: Navigation zur Kategorie (echte Links, fokussierbar).

2. **Scroll-Assembly (`ArrowAssembly`, Sektion 6)**
   - `useScroll` + `useTransform`: `progress 0→1` mappt jeden Pfeil von einer
     „explodierten“ Position (x/y-Offset ±140 px, Rotation ±90°) in seine
     Stern-Position (0/0, Basisrotation `i*72°`). Beim Zurückscrollen zerfällt der Stern.
   - Bei `progress > 0.85`: zentraler Glow blendet ein („Stern komplett“).

3. **Service-Hover-Reaktion**
   - Karten in Sektion 4 melden ihre Kategorie-Farbe via Hover-Event an einen
     leichten Context; der zugehörige Mini-Pfeil im Sektionskopf rotiert Richtung
     Karte und leuchtet auf.

4. **Weitere Verwendungen**
   - Header-Logo: Stern rotiert 36° bei Hover.
   - Bullet-Points: Mini-Pfeil als Listen-Icon in Pfeilfarbe der Seite.
   - Prozess-Timeline: Pfeil wandert als Fortschritts-Marker mit.
   - 404 / Final CTA: pulsierender Stern-Glow.

## Accessibility / Reduced Motion

- `useReducedMotion()` (Framer Motion): Parallax, Float-Loops und Assembly werden
  deaktiviert → Stern wird statisch komplett gerendert, Links bleiben bedienbar.
- Alle klickbaren Pfeile sind `<Link>`-Elemente mit `aria-label` und sichtbarem Fokusring.
- Dekorative Instanzen tragen `aria-hidden="true"`.
