<?php
/**
 * FeatureSpread (components/portfolio/WorkItems.tsx): featured project on a
 * whole stage, text left / composition right, alternating.
 * $args: project, flip (bool), priority (bool)
 */
$p = $args['project'];
$flip = !empty($args['flip']);
$priority = !empty($args['priority']);
$hex = NW_ARROW_COLORS[$p['color']];
$cats = array_map('nw_category_label', $p['categories']);
$chevron = fn(string $color) => '<svg width="12" height="12" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-300 ease-out group-hover:translate-x-1.5"><path d="' . NW_ARROW_PATH . '" fill="' . esc_attr($color) . '" transform="rotate(90 50 50)"/></svg>';
?>
<article class="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-void-2 md:rounded-[40px]" style="background-image:radial-gradient(90% 70% at <?php echo $flip ? '85%' : '15%'; ?> 0%, <?php echo $hex; ?>26, transparent 60%)">
  <div class="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
    <div class="min-w-0 lg:col-span-5 <?php echo $flip ? 'lg:order-2' : ''; ?>">
      <p class="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/55"><span class="h-1.5 w-1.5 rounded-full" style="background-color:<?php echo $hex; ?>"></span><?php echo esc_html($p['client']); ?><span class="text-white/25">·</span><span class="text-white/40"><?php echo esc_html((string) $p['year']); ?></span></p>
      <div class="mt-5"><?php echo nw_boxi_title(['as' => 'h3', 'lines' => [$p['title']], 'max' => '2.9rem', 'min' => '1.1rem', 'class' => 'text-white']); ?></div>
      <p class="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 md:text-base"><?php echo esc_html($p['description']); ?></p>
      <ul class="mt-6 flex flex-wrap gap-2">
        <?php foreach ($p['services'] as $s): ?><li class="rounded-full border border-white/12 px-3 py-1.5 text-xs font-semibold text-white/75"><?php echo esc_html($s); ?></li><?php endforeach; ?>
      </ul>
      <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href="<?php echo esc_url(nw_url('/portfolio/' . $p['slug'])); ?>" class="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 font-heading text-sm font-bold tracking-wide text-ink transition-colors hover:bg-paper-2">Projekt ansehen<?php echo $chevron('currentColor'); ?></a>
        <?php if (!empty($p['website']['url'])): ?>
          <a href="<?php echo esc_url($p['website']['url']); ?>" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white">Website besuchen<?php echo $chevron($hex); ?></a>
        <?php endif; ?>
      </div>
      <p class="mt-8 hidden font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 lg:block"><?php echo esc_html(implode(' · ', $cats)); ?></p>
    </div>

    <div class="min-w-0 lg:col-span-7 <?php echo $flip ? 'lg:order-1' : ''; ?>">
      <a href="<?php echo esc_url(nw_url('/portfolio/' . $p['slug'])); ?>" aria-label="<?php echo esc_attr($p['client'] . ': ' . $p['title'] . ' ansehen'); ?>" class="group block rounded-3xl transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline-offset-8">
        <?php echo nw_project_visual($p, $priority); ?>
      </a>
    </div>
  </div>
</article>
