<?php
/**
 * /portfolio (app/portfolio/page.tsx + layout.tsx):
 * PortfolioHero (with FilmStrip) → WorkIndex → ClientStrip → ServiceSpectrum → PortfolioCTA.
 * The dark stage (html[data-stage="dark"]) is set in header.php via nw_is_dark_stage().
 */
get_header();
$site = nw_site();
$description = 'Ausgewählte Websites, Social-Media-Kampagnen, Videos, Designs, Software und digitale Erlebnisse von Netwitcher, Digital Agency & Content-Studio Berlin.';
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'CollectionPage',
    'name' => 'Unsere Arbeiten',
    'description' => $description,
    'url' => $site['url'] . '/portfolio',
    'mainEntity' => [
        '@type' => 'ItemList',
        'itemListElement' => array_map(fn($p, $i) => [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'url' => $site['url'] . '/portfolio/' . $p['slug'],
            'name' => $p['client'] . ': ' . $p['title'],
        ], nw_projects(), array_keys(nw_projects())),
    ],
];
?>
<div class="bg-void text-white">
  <script type="application/ld+json"><?php echo wp_json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>
  <?php get_template_part('parts/portfolio/hero'); ?>
  <div class="mx-auto max-w-[1500px] px-5 pt-14 sm:px-8 md:pt-20">
    <?php get_template_part('parts/portfolio/work-index'); ?>
  </div>
  <div class="mt-24 md:mt-32">
    <?php get_template_part('parts/portfolio/client-strip'); ?>
  </div>
  <?php get_template_part('parts/portfolio/service-spectrum'); ?>
  <?php get_template_part('parts/portfolio/cta'); ?>
</div>
<?php get_footer();
