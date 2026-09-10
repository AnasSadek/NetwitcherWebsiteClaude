<?php
/**
 * WorkTile + Caption (components/portfolio/WorkItems.tsx).
 * $args: project, span (12|7|6|5|4). Ratio + sizes come from the span;
 * portfolio.js swaps them when the filter re-arranges the grid.
 */
$p = $args['project'];
$span = $args['span'];
$hex = NW_ARROW_COLORS[$p['color']];
$kindLabel = ['website' => 'Website', 'video' => 'Video & Social', 'software' => 'Software', 'visual' => 'Design & Foto'][nw_project_visual_kind($p)];
?>
<a href="<?php echo esc_url(nw_url('/portfolio/' . $p['slug'])); ?>" class="group block rounded-3xl focus-visible:outline-offset-8">
  <div class="relative overflow-hidden rounded-2xl md:rounded-3xl">
    <?php echo nw_smart_image($p['cover'], $p['color'], ['ratioClass' => NW_WORK_RATIO_CLASS[$span], 'sizes' => NW_WORK_SIZES[$span], 'monogram' => nw_char0($p['client']), 'rounded' => 'rounded-2xl md:rounded-3xl', 'imgClass' => 'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]']); ?>
    <span class="pointer-events-none absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md"><?php echo esc_html($kindLabel); ?></span>
    <span class="pointer-events-none absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 100 100"><path d="<?php echo NW_ARROW_PATH; ?>" fill="currentColor" transform="rotate(90 50 50)"/></svg></span>
    <span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:ring-white/25 md:rounded-3xl"></span>
  </div>
  <div class="mt-4 flex items-start justify-between gap-4 md:mt-5">
    <div class="min-w-0">
      <p class="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-white/55"><span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:<?php echo $hex; ?>"></span><?php echo esc_html($p['client']); ?></p>
      <h3 class="mt-1.5 font-bold leading-snug tracking-tight text-white text-lg md:text-xl"><?php echo esc_html($p['title']); ?></h3>
      <p class="mt-1.5 truncate text-sm text-white/50"><?php echo esc_html(implode(' · ', $p['services'])); ?></p>
    </div>
    <span class="shrink-0 pt-0.5 font-heading text-xs font-semibold tabular-nums text-white/40"><?php echo esc_html((string) $p['year']); ?></span>
  </div>
  <span class="sr-only">Projekt ansehen</span>
</a>
