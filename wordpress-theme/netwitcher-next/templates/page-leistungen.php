<?php /* Template Name: Leistungen */ get_header(); ?>
<?php /** app/leistungen/page.tsx */ ?>
<section class="relative overflow-hidden pt-36 pb-20 md:pt-44">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'as' => 'h1',
        'align' => 'left',
        'eyebrow' => 'Leistungen',
        'titleHtml' => '<span class="text-4xl md:text-5xl">Alles, was deine Marke <span class="text-mint">wachsen lässt</span></span>',
        'intro' => 'Zehn Bereiche, ein Team: Wir verbinden Content-Produktion, Kampagnen und Technik so, dass jeder Baustein auf dasselbe Ziel einzahlt, mehr Sichtbarkeit, mehr Vertrauen, mehr Anfragen. Wähl den Bereich, der dich gerade weiterbringt.',
    ]); ?>
  </div>
</section>
<section class="pb-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <?php foreach (nw_services() as $i => $service) echo nw_service_card($service, ($i % 3) * 0.08); ?>
    </div>
  </div>
</section>
<?php echo nw_final_cta(
    'Nicht sicher, wo du anfangen sollst?',
    'Kein Problem, dafür ist das Erstgespräch da. Wir schauen gemeinsam auf dein Unternehmen und sagen dir ehrlich, welcher Hebel bei dir zuerst wirkt: Content, Kampagnen oder Website.'
); ?>
<?php get_footer();
