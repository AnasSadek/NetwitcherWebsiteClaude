<?php
/**
 * ServiceSpectrum (components/portfolio/ServiceSpectrum.tsx): every service as
 * a typographic register. Rows with projects link into the portfolio filter,
 * the rest to the service page.
 */
$rows = [
    ['Social Media', 'Content', 'pink', 'social-video', '/leistungen/social-media-management'],
    ['Videoproduktion', 'Content', 'pink', 'social-video', '/leistungen/foto-videoproduktion'],
    ['Reels & Werbefilme', 'Content', 'pink', 'social-video', '/studio'],
    ['Fotografie', 'Studio', 'sun', 'photo', '/studio'],
    ['Grafikdesign', 'Design', 'sun', 'design', '/leistungen/branding-design'],
    ['Poster & Print', 'Design', 'sun', 'design', '/leistungen/druck-printdesign'],
    ['Branding', 'Design', 'sun', 'design', '/leistungen/branding-design'],
    ['Websites', 'Web', 'mint', 'web', '/leistungen/webdesign-ecommerce'],
    ['E-Commerce', 'Web', 'mint', 'ecommerce', '/leistungen/webdesign-ecommerce'],
    ['Individuelle Software', 'Software', 'violet', 'software', '/leistungen/softwareentwicklung'],
    ['Webanwendungen', 'Software', 'violet', 'software', '/leistungen/softwareentwicklung'],
    ['Plattformen', 'Software', 'violet', 'software', '/leistungen/softwareentwicklung'],
    ['Automatisierung', 'KI', 'sky', 'ai', '/leistungen/softwareentwicklung'],
    ['KI-Lösungen', 'KI', 'sky', 'ai', '/leistungen/softwareentwicklung'],
];
$counts = array_column(nw_categories_with_count(), 'count', 'id');
?>
<section class="py-24 md:py-32" aria-labelledby="spektrum">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 id="spektrum" class="font-boxi text-3xl leading-[1.05] text-white md:text-5xl">DAS GANZE<br>SPEKTRUM.</h2>
        <p class="max-w-sm text-base leading-relaxed text-white/60">Vom ersten Reel bis zur eigenen Plattform. Alles aus einem Team, alles aus Berlin.</p>
      </div>
    <?php echo nw_reveal_close(); ?>

    <ol class="mt-12 grid gap-x-12 border-t border-white/10 md:mt-16 md:grid-cols-2">
      <?php foreach ($rows as $i => [$label, $group, $color, $category, $href]):
          $n = $counts[$category] ?? 0;
          $target = $n > 0 ? '/portfolio?f=' . $category . '#arbeiten' : $href;
          $hex = NW_ARROW_COLORS[$color]; ?>
        <?php echo nw_reveal_open('border-b border-white/10', min($i * 0.03, 0.2), 'li'); ?>
          <a href="<?php echo esc_url(nw_url($target)); ?>" class="group flex items-center gap-4 py-4 transition-colors md:gap-6 md:py-5">
            <span class="w-7 shrink-0 font-heading text-xs font-semibold tabular-nums text-white/30"><?php echo str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT); ?></span>
            <span class="flex-1 font-heading text-xl font-bold tracking-tight text-white/85 transition-colors group-hover:text-white md:text-2xl"><?php echo esc_html($label); ?></span>
            <span class="hidden font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/35 sm:block"><?php echo $n > 0 ? $n . ' ' . ($n === 1 ? 'Projekt' : 'Projekte') : esc_html($group); ?></span>
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-transparent" style="--hex:<?php echo $hex; ?>">
              <svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-0.5"><path d="<?php echo NW_ARROW_PATH; ?>" fill="<?php echo $hex; ?>" transform="rotate(90 50 50)"/></svg>
            </span>
          </a>
        <?php echo nw_reveal_close('li'); ?>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
