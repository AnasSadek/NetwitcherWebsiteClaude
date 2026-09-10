<?php
/**
 * PortfolioHero + FilmStrip (components/portfolio/PortfolioHero.tsx, FilmStrip.tsx).
 * The strip is pure CSS: animate-strip on pointer devices, paused on hover,
 * swipeable on touch, static (but swipeable) with reduced motion.
 */
$items = nw_strip_media();
$count = count(nw_projects());

$frame = function (array $item, bool $priority = false): string {
    $o = '<a href="' . esc_url(nw_url('/portfolio/' . $item['slug'])) . '" class="group relative block h-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-void-2 sm:h-[280px] lg:h-[340px]" style="aspect-ratio:' . esc_attr(nw_ratio_value($item['ratio'])) . '" aria-label="' . esc_attr($item['client'] . ': ' . $item['alt']) . '">';
    if (!empty($item['src'])) {
        $o .= nw_smart_image(['src' => $item['src'], 'alt' => '', 'ratio' => $item['ratio']], $item['color'], ['ratio' => $item['ratio'], 'sizes' => '(min-width: 1024px) 40vw, 80vw', 'priority' => $priority, 'rounded' => 'rounded-none', 'class' => 'absolute inset-0 h-full', 'imgClass' => 'transition-transform duration-700 ease-out group-hover:scale-[1.04]']);
    } else {
        $o .= nw_placeholder(['color' => $item['color'], 'kind' => $item['kind'], 'monogram' => nw_char0($item['client']), 'label' => false]);
    }
    $o .= '<span class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3.5 pt-10"><span class="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">' . esc_html($item['client']) . '</span>';
    if ($item['kind'] === 'video') {
        $o .= '<span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink" aria-hidden="true"><svg width="9" height="9" viewBox="0 0 100 100" class="ml-px"><path d="' . NW_ARROW_PATH . '" fill="currentColor" transform="rotate(90 50 50)"/></svg></span>';
    }
    $o .= '</span><span aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" style="box-shadow:inset 0 0 0 0 ' . NW_ARROW_COLORS[$item['color']] . '"></span></a>';
    return $o;
};
?>
<header class="relative overflow-hidden pt-28 md:pt-36">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-[70vh]" style="background:radial-gradient(60% 50% at 20% 0%, rgba(139,92,246,0.28), transparent 70%), radial-gradient(40% 40% at 90% 10%, rgba(15,185,242,0.16), transparent 70%)"></div>
  <div class="relative mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-white/55"><?php echo nw_star(18); ?>Portfolio · Netwitcher Berlin</p>
          <div class="mt-5">
            <?php echo nw_boxi_title(['as' => 'h1', 'lines' => ['ARBEIT, DIE', ['text' => 'MAN SIEHT.', 'sweep' => true]], 'max' => '7.5rem', 'min' => '2rem', 'fitLines' => true, 'class' => 'text-white']); ?>
          </div>
        </div>
        <div class="max-w-sm shrink-0 lg:w-[360px] lg:pb-3 lg:text-right">
          <p class="text-base leading-relaxed text-white/70 sm:text-lg">Websites, Content, Kampagnen und Software für Marken, die mehr wollen.</p>
          <p class="mt-4 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/40"><?php echo (int) $count; ?> <?php echo $count === 1 ? 'Projekt' : 'Projekte'; ?> · Auswahl</p>
        </div>
      </div>
    <?php echo nw_reveal_close(); ?>
  </div>

  <div class="relative mx-auto mt-10 max-w-[1500px] px-5 sm:px-8 md:mt-14">
    <div class="fade-x relative -mx-5 sm:-mx-8">
      <div class="no-scrollbar snap-x snap-mandatory overflow-x-auto px-5 sm:px-8 pointer-fine:motion-safe:snap-none pointer-fine:motion-safe:overflow-hidden pointer-fine:motion-safe:px-0">
        <div class="flex w-max gap-3 sm:gap-4 pointer-fine:motion-safe:animate-strip pointer-fine:motion-safe:hover:[animation-play-state:paused] pointer-fine:motion-safe:pr-3 sm:pointer-fine:motion-safe:pr-4">
          <?php foreach ($items as $i => $it) echo $frame($it, $i < 3); ?>
          <div aria-hidden="true" class="hidden gap-3 sm:gap-4 pointer-fine:motion-safe:flex">
            <?php foreach ($items as $it) echo $frame($it); ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
