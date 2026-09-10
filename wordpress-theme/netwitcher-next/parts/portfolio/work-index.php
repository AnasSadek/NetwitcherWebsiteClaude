<?php
/**
 * WorkIndex (components/portfolio/WorkIndex.tsx): sticky filter bar + the
 * arranged grid. The initial filter comes from ?f= (server-side, so the first
 * paint is already right); portfolio.js takes over clicks, URL sync and the
 * layout (FLIP) animation. All projects are in the DOM, filtered ones carry
 * [hidden] – like AnimatePresence, only without the exit transition on load.
 */
$projects = nw_projects();
$categories = nw_categories_with_count();
$ids = array_column($categories, 'id');
$filter = isset($_GET['f']) && in_array($_GET['f'], array_merge(['all'], $ids), true) ? $_GET['f'] : 'all';
$visible = $filter === 'all' ? $projects : array_values(array_filter($projects, fn($p) => in_array($filter, $p['categories'] ?? [], true)));

// Arrangement for the visible set; hidden items get their all-projects slot so the markup is complete.
$slots = [];
foreach (nw_arrange_work($projects) as $it) $slots[$it['project']['slug']] = $it;
foreach (nw_arrange_work($visible) as $i => $it) $slots[$it['project']['slug']] = $it + ['index' => $i];

$chips = array_merge([['id' => 'all', 'label' => 'Alle', 'count' => count($projects)]], $categories);
?>
<section id="arbeiten" aria-labelledby="arbeiten-heading" class="scroll-mt-24" data-work-index>
  <h2 id="arbeiten-heading" class="sr-only">Projekte</h2>

  <div class="sticky top-[58px] z-30 -mx-5 border-y border-white/[0.07] bg-void/80 backdrop-blur-xl sm:-mx-8 md:top-[60px]">
    <div class="mx-auto max-w-[1500px]">
      <div role="group" aria-label="Projekte filtern" class="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
        <?php foreach ($chips as $c): $active = $filter === $c['id']; ?>
          <button type="button" aria-pressed="<?php echo $active ? 'true' : 'false'; ?>" data-work-filter="<?php echo esc_attr($c['id']); ?>" class="group flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-heading text-xs font-bold tracking-wide transition-colors duration-200 <?php echo $active ? 'border-white bg-white text-ink' : 'border-white/12 text-white/70 hover:border-white/30 hover:text-white'; ?>">
            <?php if (!empty($c['color'])): ?><span class="h-1.5 w-1.5 rounded-full" style="background-color:<?php echo NW_ARROW_COLORS[$c['color']]; ?>" aria-hidden="true"></span><?php endif; ?>
            <?php echo esc_html($c['label']); ?>
            <span class="tabular-nums <?php echo $active ? 'text-ink/50' : 'text-white/35'; ?>" data-work-chip-count><?php echo (int) $c['count']; ?></span>
          </button>
        <?php endforeach; ?>
        <span aria-live="polite" class="sr-only" data-work-count><?php echo count($visible); ?> <?php echo count($visible) === 1 ? 'Projekt' : 'Projekte'; ?></span>
      </div>
    </div>
  </div>

  <div class="nw-work-grid mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-14 md:grid-cols-12 md:gap-y-16" data-work-grid>
    <?php foreach ($projects as $p):
        $it = $slots[$p['slug']];
        $shown = isset($it['index']);
        $spread = $it['type'] === 'spread'; ?>
      <div class="nw-work-item <?php echo $spread ? 'md:col-span-12' : NW_WORK_SPAN_CLASS[$it['span']]; ?>" data-work-item data-slug="<?php echo esc_attr($p['slug']); ?>" data-cats="<?php echo esc_attr(implode(' ', $p['categories'])); ?>"<?php echo !empty($p['featured']) ? ' data-featured' : ''; ?><?php echo $shown ? '' : ' hidden'; ?>>
        <?php if ($spread) get_template_part('parts/portfolio/feature-spread', null, ['project' => $p, 'flip' => $it['flip'], 'priority' => ($it['index'] ?? -1) === 0]);
        else get_template_part('parts/portfolio/work-tile', null, ['project' => $p, 'span' => $it['span']]); ?>
      </div>
    <?php endforeach; ?>
  </div>

  <p class="mt-16 text-center text-white/60" data-work-empty<?php echo $visible ? ' hidden' : ''; ?>>In dieser Kategorie zeigen wir bald erste Projekte.</p>
</section>
