<?php /* Template Name: FekraHub */
/** app/produkte/fekrahub/page.tsx */
$features = [
    ['Digitale Anmeldung', 'Eltern melden Kinder online an, ohne Papierformulare, mit klarem Status für Verwaltung und Familien.', 'mint'],
    ['Kurs- & Klassenverwaltung', 'Kurse, Klassen, Lehrkräfte und Räume zentral organisiert, inklusive Zuweisungen und Kapazitäten.', 'violet'],
    ['Kommunikation', 'Ankündigungen und Nachrichten erreichen Eltern zuverlässig, mehrsprachig und nachvollziehbar.', 'pink'],
    ['Berichte & Zeugnisse', 'Leistungsberichte digital erstellen, freigeben und teilen, mit Rollen und Rechten für jedes Teammitglied.', 'sun'],
    ['Rollen & Rechte', 'Verwaltung, Lehrkräfte, Eltern: Jede Rolle sieht genau das, was sie braucht, nicht mehr und nicht weniger.', 'sky'],
    ['Sicher & DSGVO-bewusst', 'Entwickelt und gehostet mit Fokus auf Datenschutz, sensible Schülerdaten bleiben geschützt.', 'mint'],
];
get_header(); ?>
<section class="relative overflow-hidden pt-36 pb-20 md:pt-44">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="max-w-3xl">
      <?php echo nw_reveal_open(); ?>
        <p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sky">Produkte · FekraHub</p>
        <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">FekraHub: Schulverwaltung, <span class="text-mint">die sich selbst erklärt</span></h1>
        <p class="mt-6 text-base leading-relaxed text-ink-3 md:text-lg">FekraHub ist unsere selbst entwickelte Plattform für Schulen und Bildungseinrichtungen: Anmeldungen, Kurse, Kommunikation und Berichte an einem Ort, gebaut, weil Zettelwirtschaft und Excel-Listen wertvolle Zeit kosten, die in den Unterricht gehört.</p>
        <div class="mt-9 flex flex-wrap gap-4">
          <?php echo nw_button('/kontakt?service=Software', 'Demo anfragen'); ?>
          <?php echo nw_button('/leistungen/softwareentwicklung', 'Eigene Lösung entwickeln lassen', 'ghost'); ?>
        </div>
      <?php echo nw_reveal_close(); ?>
    </div>
  </div>
</section>

<section class="py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'eyebrow' => 'Funktionen',
        'title' => 'Alles Wichtige an einem Ort',
        'intro' => 'FekraHub deckt den Alltag einer Bildungseinrichtung ab, von der ersten Anmeldung bis zum Zeugnis.',
    ]); ?>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <?php foreach ($features as $i => [$title, $text, $color]): ?>
        <?php echo nw_reveal_open('', ($i % 3) * 0.08); ?>
          <div class="h-full rounded border border-line bg-white p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
            <?php echo nw_arrow($color, 24, 0, 'mb-4'); ?>
            <h3 class="font-heading text-base font-bold"><?php echo esc_html($title); ?></h3>
            <p class="mt-2.5 text-sm leading-relaxed text-ink-3"><?php echo esc_html($text); ?></p>
          </div>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="bg-paper-2 py-20 md:py-28">
  <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
    <?php echo nw_reveal_open(); ?>
      <h2 class="text-3xl font-extrabold tracking-tight md:text-4xl">Warum wir ein eigenes Produkt bauen</h2>
      <p class="mt-6 text-base leading-relaxed text-ink-3">FekraHub ist mehr als ein Produkt. Es ist unser Beweis, dass wir Software nicht nur versprechen, sondern betreiben. Jede Erfahrung aus dem echten Plattform-Alltag, Rollenmodelle, Datenmodelle, Support, fließt direkt in die individuellen Lösungen, die wir für Kunden entwickeln.</p>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>

<?php echo nw_final_cta(
    'Interesse an FekraHub, oder an deiner eigenen Plattform?',
    'Wir zeigen dir FekraHub gern in einer Demo. Und wenn du ein eigenes digitales Werkzeug brauchst: Genau solche Systeme entwickeln wir.'
); ?>
<?php get_footer();
