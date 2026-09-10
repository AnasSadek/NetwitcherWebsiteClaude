<?php /* Template Name: Studio */
/** app/studio/page.tsx */
$studio = nw_service('studio');
$studioAngebote = [
    ['Produktfotografie', 'E-Commerce-Freisteller, Lifestyle-Szenen und Detailaufnahmen mit Set-Design, Bilder, die den Preis deines Produkts rechtfertigen.', 'sun'],
    ['Food & Beverage Shoots', 'Gerichte, Drinks und Zutaten, inszeniert mit Licht und Textur, Content, der Appetit macht und Reservierungen bringt.', 'pink'],
    ['Beauty & Kosmetik Content', 'Texturen, Swatches, Anwendung: Beauty-Content mit dem Look großer Marken, produziert für Feed, Shop und Ads.', 'violet'],
    ['E-Commerce Produktbilder', 'Einheitliche Bildserien für dein komplettes Sortiment, konsistent, skalierbar und shop-optimiert angeliefert.', 'mint'],
    ['Reels für Instagram & TikTok', 'Vertikal gedacht, mit Hook geplant, nativ geschnitten: Reels, die organische Reichweite holen statt sie zu kaufen.', 'sky'],
    ['Werbevideos für Ads', 'Kurze Performance-Videos mit klarer Botschaft und CTA. Das Material, das Meta- und TikTok-Kampagnen wirklich brauchen.', 'violet'],
    ['Behind-the-Scenes Content', 'Echte Einblicke in dein Team und deine Produktion, der Content, der Vertrauen aufbaut und Marken nahbar macht.', 'pink'],
    ['Content für Webseiten & Landingpages', 'Header-Bilder, Team-Fotos und Produktvisuals, die deine Website vom Template zum Markenauftritt machen.', 'mint'],
];
get_header(); ?>

<?php /* Hero */ ?>
<section class="relative overflow-hidden pt-36 pb-20 md:pt-44">
  <div aria-hidden="true" class="absolute inset-0" style="background:radial-gradient(800px 450px at 75% 10%, rgba(244,104,168,.16), transparent 65%), radial-gradient(600px 400px at 15% 80%, rgba(245,211,61,.1), transparent 65%)"></div>
  <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid items-center gap-12 lg:grid-cols-2">
      <?php echo nw_reveal_open(); ?>
        <p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em] text-pink"><?php echo esc_html($studio['hero']['eyebrow']); ?> · Studio Berlin</p>
        <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"><?php echo esc_html($studio['hero']['headline']); ?></h1>
        <p class="mt-6 text-base leading-relaxed text-ink-3 md:text-lg"><?php echo esc_html($studio['hero']['intro']); ?></p>
        <div class="mt-9 flex flex-wrap gap-4">
          <?php echo nw_button('/kontakt?service=Fotoshooting', 'Studio-Shooting anfragen', 'studio'); ?>
          <?php echo nw_button('/kontakt#termin', 'Kostenloses Erstgespräch', 'ghost'); ?>
        </div>
      <?php echo nw_reveal_close(); ?>
      <?php echo nw_reveal_open('', 0.15); ?>
        <div class="relative">
          <div aria-hidden="true" class="absolute -inset-3 rounded bg-gradient-to-tr from-pink/40 via-violet/25 to-sun/40 opacity-60 blur-xl"></div>
          <?php echo nw_picture(nw_media('studio'), 'relative rounded border border-line object-cover', '(min-width: 1024px) 45vw, 100vw', true); ?>
        </div>
      <?php echo nw_reveal_close(); ?>
    </div>
  </div>
</section>

<?php /* Was im Studio entsteht */ ?>
<section class="py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'eyebrowColor' => 'text-pink',
        'titleHtml' => 'Ein Ort. <span class="text-sun">Alle Formate.</span>',
        'intro' => 'Vom Produktbild bis zum Kampagnenvideo: Wir produzieren dort, wo Licht, Technik und Team schon bereitstehen. Das macht uns schnell und die Qualität konstant.',
    ]); ?>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach ($studioAngebote as $i => [$title, $text, $color]): ?>
        <?php echo nw_reveal_open('', ($i % 4) * 0.07); ?>
          <div class="group h-full rounded border border-line bg-white p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
            <?php echo nw_arrow($color, 22, 0, 'mb-4 transition-transform duration-300 group-hover:rotate-12'); ?>
            <h3 class="font-heading text-sm font-bold leading-snug"><?php echo esc_html($title); ?></h3>
            <p class="mt-2.5 text-[13px] leading-relaxed text-ink-3"><?php echo esc_html($text); ?></p>
          </div>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php /* Bild-Duo: Produkt + Reels */ ?>
<section class="bg-paper-2 py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid items-stretch gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <?php echo nw_reveal_open(); ?>
        <figure class="relative h-full overflow-hidden rounded border border-line">
          <?php echo nw_picture(nw_media('product'), 'h-full w-full object-cover transition-transform duration-700 hover:scale-105'); ?>
          <figcaption class="absolute bottom-4 left-4 rounded border border-line bg-white/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-mint backdrop-blur">Produktfotografie</figcaption>
        </figure>
      <?php echo nw_reveal_close(); ?>
      <div class="flex flex-col gap-6">
        <?php echo nw_reveal_open('', 0.1); ?>
          <figure class="relative overflow-hidden rounded border border-line">
            <?php echo nw_picture(nw_media('reels'), 'w-full object-cover transition-transform duration-700 hover:scale-105'); ?>
            <figcaption class="absolute bottom-4 left-4 rounded border border-line bg-white/80 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-widest text-sky backdrop-blur">Reels &amp; Video-Produktion</figcaption>
          </figure>
        <?php echo nw_reveal_close(); ?>
        <?php echo nw_reveal_open('', 0.2); ?>
          <div class="flex flex-1 flex-col justify-center rounded border border-line bg-white p-8 backdrop-blur">
            <h2 class="font-heading text-xl font-bold">Produkt einsenden, Content zurückbekommen</h2>
            <p class="mt-3 text-sm leading-relaxed text-ink-3">Du musst für ein Shooting nicht nach Berlin kommen: Sende uns dein Produkt, wir übernehmen Set-Design, Produktion, Nachbearbeitung und Rückversand. Innerhalb weniger Tage hast du kampagnenfertigen Content im Postfach.</p>
            <div class="mt-6"><?php echo nw_button('/kontakt?service=Fotoshooting', 'Studio-Shooting anfragen', 'studio'); ?></div>
          </div>
        <?php echo nw_reveal_close(); ?>
      </div>
    </div>
  </div>
</section>

<?php /* Inhaltliche Sektionen aus dem Servicedatensatz */ echo nw_service_sections($studio['sections'], 'pink', 'py-20 md:py-28'); ?>

<?php /* FAQ */ echo nw_faq_section($studio['faq'], 'bg-paper-2 py-20 md:py-28'); ?>

<?php echo nw_final_cta(
    'Dein Produkt verdient bessere Bilder.',
    'Erzähl uns, was du verkaufst. Wir zeigen dir, wie es im richtigen Licht aussieht. Erstgespräch und Konzeptidee sind kostenlos.'
); ?>
<?php get_footer();
