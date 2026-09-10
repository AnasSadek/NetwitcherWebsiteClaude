<?php /* Template Name: Über uns */
/** app/ueber-uns/page.tsx */
$werte = [
    ['Ehrlichkeit vor Verkauf', 'Wenn eine Leistung dir nichts bringt, sagen wir das, auch wenn wir sie im Angebot haben. Langfristige Kunden sind uns wichtiger als schnelle Abschlüsse.'],
    ['Ergebnisse vor Ästhetik', 'Schön ist Pflicht, wirksam ist das Ziel. Wir messen unsere Arbeit an Anfragen, Verkäufen und Sichtbarkeit, nicht an Design-Preisen.'],
    ['Tempo mit Substanz', 'Eigenes Studio, kurze Wege, eingespieltes Team: Wir liefern schnell, ohne dass Strategie und Qualität hinten runterfallen.'],
    ['Verständnis für Vielfalt', 'Berlin ist mehrsprachig. Wir auch. Wir verstehen Zielgruppen in Deutschland kulturell wie sprachlich und bauen Botschaften, die wirklich ankommen.'],
];
get_header(); ?>
<section class="relative overflow-hidden pt-36 pb-20 md:pt-44">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
      <?php echo nw_reveal_open(); ?>
        <p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-mint">Über uns</p>
        <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Wir sind das Studio, das <span class="text-mint">Content wie Vertrieb</span> denkt.</h1>
        <p class="mt-6 max-w-2xl text-base leading-relaxed text-ink-3 md:text-lg">Netwitcher ist eine Digital Agency und ein Content-Studio aus Berlin. Wir haben Netwitcher gegründet, weil wir zu oft dasselbe gesehen haben: Unternehmen mit starken Produkten, deren Auftritt ihnen nicht gerecht wird, und Agenturen, die schöne Bilder liefern, aber keine Anfragen. Wir machen beides: Content, der auffällt, und Systeme, die daraus Kunden machen.</p>
        <div class="mt-9 flex flex-wrap gap-4">
          <?php echo nw_button('/kontakt#termin', 'Lern uns kennen, kostenloses Erstgespräch'); ?>
          <?php echo nw_button('/studio', 'Unser Studio in Berlin', 'ghost'); ?>
        </div>
      <?php echo nw_reveal_close(); ?>
      <?php echo nw_reveal_open('', 0.15); ?>
        <div class="relative mx-auto flex h-72 w-72 items-center justify-center"><?php echo nw_star(220); ?></div>
      <?php echo nw_reveal_close(); ?>
    </div>
  </div>
</section>

<?php /* Der Stern als Team-Philosophie */ ?>
<section class="py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'titleHtml' => 'Warum unser Logo ein <span class="text-mint">Stern aus Pfeilen</span> ist',
        'intro' => 'Jeder Pfeil steht für eine Disziplin, Webdesign, Strategie, Content, Fotografie, Social Media. Einzeln sind sie Werkzeuge. Zusammengesetzt ergeben sie den Stern: Marketing, das aus einem Guss funktioniert. Genau so arbeiten wir.',
    ]); ?>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <?php foreach (nw_arrow_targets() as $i => $t): ?>
        <?php echo nw_reveal_open('', $i * 0.07); ?>
          <div class="h-full rounded border border-line bg-white p-6 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1">
            <?php echo nw_arrow($t['color'], 34, $i * 72, 'mx-auto mb-4'); ?>
            <h3 class="font-heading text-sm font-bold leading-snug"><?php echo esc_html($t['label']); ?></h3>
          </div>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php /* Werte */ ?>
<section class="bg-paper-2 py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading(['title' => 'Vier Prinzipien, an denen du uns messen kannst']); ?>
    <div class="mt-14 grid gap-6 md:grid-cols-2">
      <?php foreach ($werte as $i => [$title, $text]): ?>
        <?php echo nw_reveal_open('', ($i % 2) * 0.08); ?>
          <div class="h-full rounded border border-line bg-white p-8 backdrop-blur">
            <span class="font-heading text-2xl font-extrabold text-mint"><?php echo str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT); ?></span>
            <h3 class="mt-3 font-heading text-lg font-bold"><?php echo esc_html($title); ?></h3>
            <p class="mt-3 text-sm leading-relaxed text-ink-3"><?php echo esc_html($text); ?></p>
          </div>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php /* Berlin & Studio */ ?>
<section class="py-20 md:py-28">
  <div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
    <?php echo nw_reveal_open(); ?>
      <p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-sun">Made in Berlin</p>
      <h2 class="text-3xl font-extrabold tracking-tight md:text-4xl">Berlin ist unser Zuhause und unser Wettbewerbsvorteil</h2>
      <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-3">Mit unserem eigenen Content-Studio in Berlin produzieren wir dort, wo deine Zielgruppe lebt: schnell, flexibel und nah dran an Trends, die anderswo erst Monate später ankommen. Von hier aus betreuen wir Unternehmen in ganz Deutschland, vom lokalen Restaurant bis zur E-Commerce-Marke.</p>
      <div class="mt-9"><?php echo nw_button('/studio', 'Studio entdecken', 'studio'); ?></div>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>

<?php echo nw_final_cta(
    'Klingt nach dem richtigen Team?',
    'Dann lass uns reden. Im Erstgespräch lernst du uns kennen, wir dein Unternehmen und du bekommst eine ehrliche Einschätzung, was für dich funktioniert.'
); ?>
<?php get_footer();
