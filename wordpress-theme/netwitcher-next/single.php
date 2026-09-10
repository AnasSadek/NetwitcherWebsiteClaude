<?php
/**
 * Single blog post (app/blog/[slug]/page.tsx). The seeded content is plain
 * <h2>/<p> HTML; it is split into sections at each <h2> so every block gets
 * its own Reveal like post.content.map() in the source.
 */
get_header();
the_post();
$m = nw_post_meta();
$site = nw_site();
$ld = [
    '@context' => 'https://schema.org',
    '@type' => 'BlogPosting',
    'headline' => get_the_title(),
    'description' => $m['seoDescription'],
    'datePublished' => $m['date'],
    'inLanguage' => 'de-DE',
    'author' => ['@type' => 'Organization', 'name' => $site['name']],
    'publisher' => ['@type' => 'Organization', 'name' => $site['name']],
];
$content = apply_filters('the_content', get_the_content());
$blocks = array_values(array_filter(preg_split('/(?=<h2[\s>])/i', $content), fn($b) => trim($b) !== ''));
?>
<script type="application/ld+json"><?php echo wp_json_encode($ld, JSON_UNESCAPED_UNICODE); ?></script>
<article class="pt-36 pb-20 md:pt-44">
  <div class="mx-auto max-w-3xl px-4 sm:px-6">
    <?php echo nw_reveal_open(); ?>
      <nav aria-label="Brotkrumen" class="mb-8 text-xs text-ink-3">
        <a href="<?php echo esc_url(nw_url('/')); ?>" class="hover:text-ink">Startseite</a>
        <span aria-hidden="true"> / </span>
        <a href="<?php echo esc_url(nw_url('/blog')); ?>" class="hover:text-ink">Blog</a>
      </nav>
      <p class="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em] text-mint"><?php echo esc_html($m['category']); ?></p>
      <h1 class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"><?php echo esc_html(get_the_title()); ?></h1>
      <p class="mt-4 text-sm text-ink-3"><time datetime="<?php echo esc_attr($m['date']); ?>"><?php echo esc_html($m['dateLabel']); ?></time> · <?php echo esc_html($m['readingTime']); ?> Lesezeit · Netwitcher Team</p>
    <?php echo nw_reveal_close(); ?>
    <div class="mt-12 space-y-10">
      <?php foreach ($blocks as $block): ?>
        <?php echo nw_reveal_open(); ?>
          <section class="[&_h2]:mb-4 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold md:[&_h2]:text-2xl [&_p]:mb-4 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-ink-3"><?php echo wp_kses_post($block); ?></section>
        <?php echo nw_reveal_close(); ?>
      <?php endforeach; ?>
    </div>
    <?php echo nw_reveal_open(); ?>
      <div class="mt-14 rounded border border-line bg-white p-8 text-center backdrop-blur">
        <h2 class="font-heading text-lg font-bold">Diese Themen für dein Unternehmen umsetzen?</h2>
        <p class="mt-3 text-sm leading-relaxed text-ink-3">Im kostenlosen Erstgespräch übertragen wir das auf deine Marke: konkret und ohne Verpflichtung.</p>
        <div class="mt-6"><?php echo nw_button('/kontakt#termin', 'Kostenloses Erstgespräch buchen'); ?></div>
      </div>
    <?php echo nw_reveal_close(); ?>
  </div>
</article>
<?php
echo nw_final_cta();
get_footer();
