<?php /* Template Name: Projekte (Case Studies) */ get_header(); ?>
<?php /** app/projekte/page.tsx */ ?>
<section class="relative overflow-hidden pt-36 pb-16 md:pt-44">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'as' => 'h1',
        'align' => 'left',
        'eyebrow' => 'Projekte & Case Studies',
        'titleHtml' => '<span class="text-4xl md:text-5xl">Arbeit, die man <span class="text-mint">messen kann</span></span>',
        'intro' => 'Sechs Branchen, sechs typische Ausgangslagen, sechs Wege zum Ergebnis. Die Cases zeigen, wie wir denken und arbeiten. Konkrete Kundennamen und Kennzahlen ergänzen wir nach Freigabe unserer Kunden.',
    ]); ?>
  </div>
</section>
<section class="pb-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <?php foreach (nw_cases() as $i => $item) echo nw_case_card($item, ($i % 3) * 0.08); ?>
    </div>
  </div>
</section>
<?php echo nw_final_cta(
    'Dein Projekt könnte das nächste sein.',
    'Egal ob Restaurant, Shop, Handwerk oder B2B: Erzähl uns deine Ausgangslage. Wir zeigen dir, wie wir sie angehen würden. Kostenlos und unverbindlich.'
); ?>
<?php get_footer();
