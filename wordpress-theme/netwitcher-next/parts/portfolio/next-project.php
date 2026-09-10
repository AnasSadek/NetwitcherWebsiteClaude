<?php
/** NextProject (components/portfolio/ProjectSections.tsx): prev/next navigation + next-project stage. $args: next, prev */
$next = $args['next'];
$prev = $args['prev'];
$hex = NW_ARROW_COLORS[$next['color']];
?>
<section class="py-14 md:py-20" aria-labelledby="next">
  <div class="mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="mb-6 flex items-center justify-between gap-4">
        <p id="next" class="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-white/45">Nächstes Projekt</p>
        <div class="flex items-center gap-5 font-heading text-[11px] font-bold uppercase tracking-[0.2em]">
          <?php if ($prev['slug'] !== $next['slug']): ?>
            <a href="<?php echo esc_url(nw_url('/portfolio/' . $prev['slug'])); ?>" class="text-white/45 transition-colors hover:text-white">← <?php echo esc_html($prev['client']); ?></a>
          <?php endif; ?>
          <a href="<?php echo esc_url(nw_url('/portfolio')); ?>" class="text-white/45 transition-colors hover:text-white">Alle Projekte</a>
        </div>
      </div>
      <a href="<?php echo esc_url(nw_url('/portfolio/' . $next['slug'])); ?>" class="group relative block overflow-hidden rounded-[28px] border border-white/[0.08] bg-void-2 md:rounded-[40px]" style="background-image:radial-gradient(70% 80% at 100% 0%, <?php echo $hex; ?>26, transparent 60%)">
        <div class="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-12 md:p-10 lg:p-14">
          <div class="min-w-0 md:col-span-7">
            <p class="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/55"><span class="h-1.5 w-1.5 rounded-full" style="background-color:<?php echo $hex; ?>"></span><?php echo esc_html($next['client']); ?></p>
            <div class="mt-4"><?php echo nw_boxi_title(['as' => 'p', 'lines' => [$next['title']], 'max' => '3.75rem', 'min' => '1.1rem', 'class' => 'text-white']); ?></div>
            <span class="mt-8 inline-flex items-center gap-2.5 font-heading text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors group-hover:text-white">Ansehen<svg width="11" height="11" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-1.5"><path d="<?php echo NW_ARROW_PATH; ?>" fill="<?php echo $hex; ?>" transform="rotate(90 50 50)"/></svg></span>
          </div>
          <div class="md:col-span-5">
            <?php echo nw_smart_image($next['cover'], $next['color'], ['ratio' => '4/3', 'sizes' => '(min-width: 768px) 40vw, 100vw', 'monogram' => nw_char0($next['client']), 'rounded' => 'rounded-2xl md:rounded-3xl', 'imgClass' => 'transition-transform duration-700 ease-out group-hover:scale-[1.04]']); ?>
          </div>
        </div>
      </a>
    <?php echo nw_reveal_close(); ?>
  </div>
</section>
