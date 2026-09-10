<?php
/** ProjectHeader (components/portfolio/ProjectSections.tsx). $args: project */
$p = $args['project'];
$hex = NW_ARROW_COLORS[$p['color']];
$btn = 'group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 font-heading text-xs font-bold tracking-wide text-ink transition-colors hover:bg-paper-2';
$arrow = '<svg width="10" height="10" viewBox="0 0 100 100" aria-hidden="true" class="transition-transform group-hover:translate-x-1"><path d="' . NW_ARROW_PATH . '" fill="currentColor" transform="rotate(90 50 50)"/></svg>';
?>
<header class="relative overflow-hidden pt-28 md:pt-36">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-[80vh]" style="background:radial-gradient(60% 50% at 30% 0%, <?php echo $hex; ?>30, transparent 70%)"></div>
  <div class="relative mx-auto max-w-[1500px] px-5 sm:px-8">
    <?php echo nw_reveal_open(); ?>
      <nav aria-label="Brotkrumen" class="flex items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-white/45">
        <a href="<?php echo esc_url(nw_url('/portfolio')); ?>" class="transition-colors hover:text-white">Portfolio</a>
        <span aria-hidden="true" class="text-white/25">/</span>
        <span class="text-white/80"><?php echo esc_html($p['client']); ?></span>
      </nav>

      <div class="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div class="min-w-0 lg:col-span-8">
          <p class="flex items-center gap-2.5 font-heading text-xs font-bold uppercase tracking-[0.25em] text-white/60"><span class="h-2 w-2 rounded-full" style="background-color:<?php echo $hex; ?>"></span><?php echo esc_html($p['client']); ?><span class="text-white/25">·</span><span class="text-white/45"><?php echo esc_html((string) $p['year']); ?></span></p>
          <div class="mt-5"><?php echo nw_boxi_title(['as' => 'h1', 'lines' => [$p['title']], 'max' => '5.5rem', 'min' => '1.375rem', 'class' => 'text-white']); ?></div>
        </div>
        <div class="lg:col-span-4 lg:pb-2">
          <p class="text-base leading-relaxed text-white/70 md:text-lg"><?php echo esc_html($p['description']); ?></p>
          <?php if (!empty($p['placeholder'])): ?>
            <p class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Vorschau · Inhalte folgen</p>
          <?php endif; ?>
        </div>
      </div>

      <dl class="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-6 md:grid-cols-4">
        <div>
          <dt class="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Leistungen</dt>
          <dd class="mt-2 text-sm font-semibold text-white/85"><?php echo esc_html(implode(', ', $p['services'])); ?></dd>
        </div>
        <div>
          <dt class="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Bereich</dt>
          <dd class="mt-2 text-sm font-semibold text-white/85"><?php echo esc_html(implode(', ', array_map('nw_category_label', $p['categories']))); ?></dd>
        </div>
        <div>
          <dt class="font-heading text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Jahr</dt>
          <dd class="mt-2 text-sm font-semibold text-white/85"><?php echo esc_html((string) $p['year']); ?></dd>
        </div>
        <div class="flex items-end md:justify-end">
          <?php if (!empty($p['website']['url'])): ?>
            <a href="<?php echo esc_url($p['website']['url']); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo $btn; ?>">Website besuchen<?php echo $arrow; ?></a>
          <?php elseif (!empty($p['links'][0])): ?>
            <a href="<?php echo esc_url(nw_url($p['links'][0]['href'])); ?>" class="<?php echo $btn; ?>"><?php echo esc_html($p['links'][0]['label']); ?><?php echo $arrow; ?></a>
          <?php endif; ?>
        </div>
      </dl>
    <?php echo nw_reveal_close(); ?>
  </div>
</header>
