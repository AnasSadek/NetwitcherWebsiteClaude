<?php
/**
 * Blog index (app/blog/page.tsx). WordPress "posts page" at /blog/; the main
 * loop is ordered by date desc like blogPosts in lib/blog.ts.
 */
get_header();
?>
<section class="relative overflow-hidden pt-36 pb-16 md:pt-44">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <?php echo nw_section_heading([
        'as' => 'h1',
        'align' => 'left',
        'eyebrow' => 'Blog',
        'titleHtml' => '<span class="text-4xl md:text-5xl">Praxiswissen statt <span class="text-mint">Marketing-Blabla</span></span>',
        'intro' => 'Was wir im Studio und in Kampagnen jeden Tag lernen, schreiben wir hier auf: konkret, anwendbar und ohne Verkaufsdruck.',
    ]); ?>
  </div>
</section>
<section class="pb-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <?php $i = 0; while (have_posts()): the_post();
          $m = nw_post_meta();
          $accent = NW_ARROW_COLORS[NW_STAR_ORDER[$i % 5]];
          echo nw_reveal_open('h-full', ($i % 3) * 0.08, 'article'); ?>
        <a href="<?php echo esc_url(get_permalink()); ?>" class="group flex h-full flex-col rounded border border-line bg-white p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
          <div class="mb-4 flex items-center justify-between gap-3">
            <span class="font-heading text-[11px] font-bold uppercase tracking-widest" style="color:<?php echo esc_attr($accent); ?>"><?php echo esc_html($m['category']); ?></span>
            <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true" class="opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100"><path d="<?php echo NW_ARROW_PATH; ?>" fill="<?php echo esc_attr($accent); ?>"/></svg>
          </div>
          <h2 class="font-heading text-lg font-bold leading-snug transition-colors group-hover:text-ink"><?php echo esc_html(get_the_title()); ?></h2>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-ink-3"><?php echo esc_html(get_the_excerpt()); ?></p>
          <p class="mt-5 text-xs text-ink-3"><time datetime="<?php echo esc_attr($m['date']); ?>"><?php echo esc_html($m['dateLabel']); ?></time> · <?php echo esc_html($m['readingTime']); ?> Lesezeit</p>
        </a>
      <?php echo nw_reveal_close('article'); $i++; endwhile; ?>
    </div>
  </div>
</section>
<?php
echo nw_final_cta(
    'Lieber direkt fragen statt lesen?',
    'Vieles klärt sich in 20 Minuten Gespräch schneller als in 20 Artikeln. Buch dir ein kostenloses Erstgespräch. Wir beantworten deine Fragen konkret für dein Unternehmen.'
);
get_footer();
