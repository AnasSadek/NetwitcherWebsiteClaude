<?php
/**
 * /portfolio/<slug> (app/portfolio/[slug]/page.tsx):
 * ProjectHeader → ProjectVisual → sections (story, website, video, screens,
 * galleries, results, testimonial, links) → NextProject → PortfolioCTA.
 */
get_header();
the_post();
$site = nw_site();
$project = nw_project_data(get_the_ID());
$adjacent = nw_adjacent_projects($project['slug']);
$ctaTopic = ['web' => 'Website', 'ecommerce' => 'Shop', 'social-video' => 'Social Media', 'photo' => 'Fotoshooting', 'design' => 'Branding', 'software' => 'Software', 'ai' => 'Software'];

$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'CreativeWork',
    'name' => $project['client'] . ': ' . $project['title'],
    'description' => $project['description'],
    'url' => $site['url'] . '/portfolio/' . $project['slug'],
    'dateCreated' => (string) $project['year'],
    'genre' => array_map('nw_category_label', $project['categories']),
    'creator' => ['@type' => 'Organization', 'name' => $site['name'], 'url' => $site['url']],
];
if ($project['client'] !== $site['name']) $jsonLd['sourceOrganization'] = ['@type' => 'Organization', 'name' => $project['client']];
?>
<div class="bg-void text-white">
  <script type="application/ld+json"><?php echo wp_json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>
  <article>
    <?php get_template_part('parts/portfolio/project-header', null, ['project' => $project]); ?>

    <div class="mx-auto mt-12 max-w-[1500px] px-5 sm:px-8 md:mt-16">
      <?php echo nw_reveal_open() . nw_project_visual($project, true, '(min-width: 1500px) 1400px, 100vw') . nw_reveal_close(); ?>
    </div>

    <div class="mt-6 md:mt-10">
      <?php get_template_part('parts/portfolio/project-sections', null, ['project' => $project]); ?>
    </div>

    <?php if ($adjacent['next']) get_template_part('parts/portfolio/next-project', null, $adjacent); ?>
  </article>
  <?php get_template_part('parts/portfolio/cta', null, ['service' => $ctaTopic[$project['categories'][0] ?? ''] ?? null]); ?>
</div>
<?php get_footer();
