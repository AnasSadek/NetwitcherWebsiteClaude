<?php
/** ClientStrip (components/portfolio/ClientStrip.tsx): one row of the brands, logo if present, otherwise the name. */
$seen = [];
$clients = [];
foreach (nw_projects() as $p) {
    if (isset($seen[$p['client']])) continue;
    $seen[$p['client']] = true;
    $clients[] = $p;
}
if (count($clients) < 2) return;
?>
<section class="border-y border-white/[0.07] py-10 md:py-12" aria-label="Marken, mit denen wir arbeiten">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
        <p class="shrink-0 font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Marken, mit denen wir arbeiten</p>
        <ul class="flex flex-wrap items-center gap-x-10 gap-y-4 md:justify-end md:flex-1">
          <?php foreach ($clients as $c): ?>
            <li>
              <a href="<?php echo esc_url(nw_url('/portfolio/' . $c['slug'])); ?>" class="block text-white/55 transition-colors hover:text-white" aria-label="<?php echo esc_attr($c['client'] . ' ansehen'); ?>">
                <?php if (!empty($c['logo'])): ?>
                  <img src="<?php echo esc_url(nw_media_url($c['logo'])); ?>" alt="<?php echo esc_attr($c['client']); ?>" width="120" height="36" loading="lazy" decoding="async" class="h-7 w-auto object-contain opacity-80">
                <?php else: ?>
                  <span class="font-heading text-lg font-extrabold uppercase tracking-[0.12em]"><?php echo esc_html($c['client']); ?></span>
                <?php endif; ?>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>
