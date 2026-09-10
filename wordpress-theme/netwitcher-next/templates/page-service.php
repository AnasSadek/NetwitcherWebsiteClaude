<?php /* Template Name: Leistung (Detail) */
/** app/leistungen/[slug]/page.tsx – the service is resolved from the page slug. */
$service = nw_service(get_post_field('post_name', get_queried_object_id()));
if (!$service || $service['slug'] === 'studio') {
    status_header(404);
    nocache_headers();
    include get_404_template();
    return;
}
$accent = NW_ARROW_COLORS[$service['color']];
$related = array_slice(array_values(array_filter(nw_leistungen_services(), fn($s) => $s['slug'] !== $service['slug'])), 0, 3);
$site = nw_site();
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'Service',
    'name' => $service['title'],
    'description' => $service['seo']['description'],
    'provider' => [
        '@type' => 'ProfessionalService',
        'name' => $site['name'],
        'address' => ['@type' => 'PostalAddress', 'addressLocality' => $site['city'], 'addressCountry' => 'DE'],
    ],
    'areaServed' => 'Berlin',
];
get_header(); ?>
<script type="application/ld+json"><?php echo wp_json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>

<?php /* Hero */ ?>
<section class="relative overflow-hidden pt-36 pb-20 md:pt-44">
  <div aria-hidden="true" class="absolute inset-0" style="background:radial-gradient(700px 400px at 80% 0%, <?php echo $accent; ?>22, transparent 65%), radial-gradient(500px 300px at 10% 90%, <?php echo $accent; ?>11, transparent 65%)"></div>
  <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_reveal_open(); ?>
      <nav aria-label="Brotkrumen" class="mb-8 text-xs text-ink-3">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-ink">Startseite</a>
        <span aria-hidden="true"> / </span>
        <a href="<?php echo esc_url(nw_url('/leistungen')); ?>" class="hover:text-ink">Leistungen</a>
        <span aria-hidden="true"> / </span>
        <span class="text-ink"><?php echo esc_html($service['navTitle']); ?></span>
      </nav>
      <div class="flex items-start gap-5">
        <span class="hidden h-16 w-16 shrink-0 items-center justify-center rounded border border-line bg-ink/5 p-4 sm:inline-flex" style="color:<?php echo $accent; ?>">
          <?php echo nw_service_icon($service['icon'], 'h-8 w-8'); ?>
        </span>
        <div class="max-w-3xl">
          <p class="mb-4 font-heading text-xs font-medium uppercase tracking-[0.25em]" style="color:<?php echo $accent; ?>"><?php echo esc_html($service['hero']['eyebrow']); ?></p>
          <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"><?php echo esc_html($service['hero']['headline']); ?></h1>
          <p class="mt-6 text-base leading-relaxed text-ink-3 md:text-lg"><?php echo esc_html($service['hero']['intro']); ?></p>
          <div class="mt-9 flex flex-wrap gap-4">
            <?php echo nw_button('/kontakt?service=' . rawurlencode($service['navTitle']), $service['cta']); ?>
            <?php echo nw_button('/kontakt#termin', 'Kostenloses Erstgespräch', 'ghost'); ?>
          </div>
        </div>
      </div>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>

<?php /* Inhalts-Sektionen */ echo nw_service_sections($service['sections'], $accent, 'py-20'); ?>

<?php /* Deliverables */ ?>
<section class="bg-paper-2 py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'title' => 'Das bekommst du',
        'intro' => 'Keine vagen Versprechen. Das ist der Umfang, mit dem wir arbeiten. Im Angebot wird jeder Punkt auf dein Projekt zugeschnitten.',
    ]); ?>
    <ul class="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
      <?php foreach ($service['deliverables'] as $i => $d): ?>
        <?php echo nw_reveal_open('', ($i % 2) * 0.06, 'li'); ?>
          <div class="flex items-center gap-3 rounded border border-line bg-white/[.03] px-5 py-3.5 text-sm">
            <?php echo nw_arrow($accent, 13, 90, 'shrink-0'); ?>
            <?php echo esc_html($d); ?>
          </div>
        <?php echo nw_reveal_close('li'); ?>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<?php /* FAQ */ echo nw_faq_section($service['faq'], 'py-20 md:py-28'); ?>

<?php /* Verwandte Leistungen */ ?>
<section class="bg-paper-2 py-20 md:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading(['title' => 'Verwandte Leistungen']); ?>
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <?php foreach ($related as $i => $s) echo nw_service_card($s, $i * 0.08); ?>
    </div>
  </div>
</section>

<?php echo nw_final_cta(); ?>
<?php get_footer();
